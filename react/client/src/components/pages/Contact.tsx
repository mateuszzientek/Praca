import React, { useContext, useEffect, useState } from "react";
import Navbar from "../sections/Navbar";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../elements/ThemeContext";
import { UserContext } from "../elements/UserProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import contact from "../../assets/images/contact.png";
import contact_black from "../../assets/images/contact-black.png";
import { AiOutlineArrowDown, AiOutlineClockCircle } from "react-icons/ai";
import { TfiLocationPin } from "react-icons/tfi";
import { BsTelephone, BsEnvelope } from "react-icons/bs";
import ContactCircle from "../elements/ContactCircle";
import axios from "axios";
import validator from "validator";
import InfoDivBottom from "../elements/InfoDivBottom";
import CircleSvg from "../elements/CircleSvg";
import { ErrorInterface } from "src/types";

function Contact() {
  const { user, isUserLoggedIn } = useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [showInfo, setshowInfo] = useState(false);
  const [showLoading, setLoading] = useState(false);
  const [errorsVadlidationServer, setErrorsVadlidationServer] = useState<
    ErrorInterface[]
  >([]);
  const [errorsServer, setErrorsServer] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleSurnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSurname(event.target.value);
  };
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const validateData = () => {
    setMessage("");

    if (email && !validator.isEmail(email)) {
      const message = t("loginError.email");
      setMessage(message);
      return false;
    }

    if (name && !/^[a-zA-Z]+$/.test(name)) {
      const message = t("loginError.name");
      setMessage(message);
      return false;
    }

    if (surname && !/^[a-zA-Z]+$/.test(surname)) {
      const message = t("loginError.surname");
      setMessage(message);
      return false;
    }

    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !name || !surname || !text) {
      const message = t("emailQuestion.error");
      setMessage(message);
      return;
    }

    if (!validateData()) {
      return;
    }

    const data = {
      name: name,
      surname: surname,
      email: email,
      text: text,
    };

    setLoading(true);

    axios
      .post("/emailQuestion", data)
      .then((response) => {
        setEmail("");
        setName("");
        setSurname("");
        setText("");

        setshowInfo(true);
        setTimeout(() => {
          setshowInfo(false);
        }, 2500);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setErrorsServer(error.response.data.error);
        } else if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          setErrorsVadlidationServer(error.response.data.errors);
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {showInfo && (
        <div className="flex justify-center">
          <InfoDivBottom
            color={"bg-green-500"}
            text={t("emailQuestion.successful")}
          />
        </div>
      )}
      <div>
        <div className="relative">
          <Navbar
            background="bg-white"
            extra="absolute top-0 left-0 right-0 z-10"
            shadow="shadow-button"
          />

          <LazyLoadImage
            src={theme === "dark" ? contact_black : contact}
            alt="Photo showing office"
            className="h-[650px] w-screen flex items-center justify-center"
            effect="blur"
            placeholderSrc={theme === "dark" ? contact_black : contact}
          />

          <div className=" text-center w-full absolute top-[57%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <p className="text-6xl md:text-7xl 2xl:text-8xl font-lato text-black/80 dark:text-white">
              {t("contact.main")}
            </p>
            <div className="text-xl w-auto md:text-2xl 2xl:text-3xl font-lato text-black/60 dark:text-white mt-6 ">
              <p className="mb-2"> {t("contact.text1")}</p>
              <p> {t("contact.text2")}</p>
            </div>
          </div>
          <div className="flex justify-center absolute bottom-[9%] w-screen h-12 transform left-0">
            <div className="flex justify-center items-center w-12 h-12  bg-black/80 dark:bg-white rounded-full animate-bounce mr-2">
              <AiOutlineArrowDown
                size={30}
                color={theme === "dark" ? "black" : "white"}
              />
            </div>
          </div>
        </div>

        <div className="witam flex flex-col lg:flex-row justify-center items-center space-y-16 lg:space-y-0 lg:space-x-60  bg-white dark:bg-black/80 mt-[-1rem] pt-20 ">
          <div className="items-center space-y-12 ">
            <ContactCircle
              mainText={t("contact.address")}
              text="Biała 3, 00-895 Warszawa"
              icon={
                <TfiLocationPin
                  size={35}
                  color={theme === "dark" ? "black" : "white"}
                />
              }
              text2=""
            />

            <ContactCircle
              mainText={t("contact.phone")}
              text="+48 509 976 345"
              icon={
                <BsTelephone
                  size={35}
                  color={theme === "dark" ? "black" : "white"}
                />
              }
              text2=""
            />

            <ContactCircle
              mainText={"Email"}
              text="sneakerszone@gmail.com"
              icon={
                <BsEnvelope
                  size={35}
                  color={theme === "dark" ? "black" : "white"}
                />
              }
              text2=""
            />

            <ContactCircle
              mainText={t("contact.hours-main")}
              text={
                <>
                  <span className="font-bold">{t("contact.mon-sat")}</span>{" "}
                  {t("contact.hours1")}{" "}
                </>
              }
              text2={
                <>
                  <span className="font-bold">{t("contact.sun")}</span>{" "}
                  {t("contact.hours2")}
                </>
              }
              icon={
                <AiOutlineClockCircle
                  size={35}
                  color={theme === "dark" ? "black" : "white"}
                />
              }
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-6 items-center"
          >
            <input
              value={name}
              onChange={handleNameChange}
              className="px-3 w-[22rem] h-[3rem] bg-[#e6e6e6] focus:outline-none focus:border-2 border-black/60"
              type="text"
              placeholder={t("questionSection.name") as string}
            />
            <input
              value={surname}
              onChange={handleSurnameChange}
              className="px-3 w-[22rem] h-[3rem] bg-[#e6e6e6] focus:outline-none focus:border-2 border-black/60"
              type="text"
              placeholder={t("questionSection.surname") as string}
            />
            <input
              value={email}
              onChange={handleEmailChange}
              className="px-3 w-[22rem] h-[3rem] bg-[#e6e6e6] focus:outline-none focus:border-2 border-black/60"
              type="email"
              placeholder={t("questionSection.email") as string}
            />
            <textarea
              value={text}
              onChange={handleTextChange}
              className="p-3  focus:outline-none focus:border-2 border-black/60 w-[22rem] h-[8rem] bg-[#e6e6e6]  "
              placeholder={t("questionSection.question") as string}
            ></textarea>

            {message && <p className="text-red-500 text-base">{message}</p>}

            {errorsServer && (
              <p className="text-red-500 text-base ">{errorsServer}</p>
            )}

            {errorsVadlidationServer.map((error, index) => (
              <p key={index} className="text-red-500 text-base ">
                {error.msg}
              </p>
            ))}

            <button
              type="submit"
              disabled={showLoading}
              className="text-2xl rounded-full bg-[#97DEFF] disabled:bg-[#c9c9c9] w-[22rem] h-[3rem] transform hover:scale-105 transition ease-out duration-300 "
            >
              <div className="flex items-center justify-center">
                {showLoading && <CircleSvg color="black" secColor="black" />}
                <p className="text-black/80">{t("questionSection.button")}</p>
              </div>
            </button>
          </form>
        </div>

        <div className="flex flex-col justify-center items-center py-20 space-y-10  bg-white dark:bg-black/80">
          <p className="text-4xl font-lato text-black/80 dark:text-white">
            {t("contact.map")}
          </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1221.6238326657467!2d20.990019069435892!3d52.23888501683926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecd054d7f9cd3%3A0x1f84f4e991f81c7f!2zQmlhxYJhIDM!5e0!3m2!1sen!2spl!4v1685305076456!5m2!1sen!2spl"
            className="w-[70%] h-[20rem] lg:h-[30rem] lg:w-[40rem] 2xl:w-[50rem] "
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </>
  );
}

export default Contact;
