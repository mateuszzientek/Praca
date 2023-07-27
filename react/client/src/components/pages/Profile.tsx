import React, { useContext, useState, useEffect, useRef } from "react";
import Navbar from "../sections/Navbar";
import user_light from "../../assets/images/user.png";
import user_dark from "../../assets/images/user_dark.png";
import { ThemeContext } from "../elements/ThemeContext";
import avatar from "../../assets/images/profile_avatar.png"
import { UserContext } from "../elements/UserProvider";
import { AiOutlineClose } from "react-icons/ai";
import validator from "validator";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import axios from "axios";
import CircleSvg from "../elements/CircleSvg";
import InfoDivBottom from "../elements/InfoDivBottom";
import { useTranslation } from "react-i18next";
import storage from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
import { Link } from "react-router-dom";


interface Error {
  msg: string;
  type: string;
  value: string;
  path: string;
  location: string;
}

interface CropDemoProps {
  src: string;
  onImageUpload: (croppedImage: Blob) => void; // Nowy prop dla funkcji handleImageUpload
}

function Profile() {

  const { t } = useTranslation();
  const { user, isUserLoggedIn, isUserDataLoaded, fetchUserData } = useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const [showEditData, setShowEditData] = useState(false);
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const genders = ["man", "woman", "other"];
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isLoadingEditData, setIsLoadingEditData] = useState(false);
  const [errorsValidationServer, setErrorsValidationServer] = useState<Error[]>([]);
  const [message, setMessage] = useState("");
  const [errorsServer, setErrorsServer] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const capitalizeFirstLetter = (str: string) => { return str.charAt(0).toUpperCase() + str.slice(1); };
  const [name, setName] = useState(user?.name ? capitalizeFirstLetter(user.name) : "");
  const [surname, setSurname] = useState(user?.surname ? capitalizeFirstLetter(user.surname) : "");
  const [email, setEmail] = useState(user?.email || "")
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [selectedGender, setSelectedGender] = useState(user?.gender || "");
  const [imageUrl, setImageUrl] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    day: "",
    month: "",
    year: "",
  });
  const [errorsPassword, setErrorsPassword] = useState({
    old: "",
    new: ""
  });


  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user?.dateOfBirth && isUserDataLoaded) {
      const dateOfBirth = new Date(user.dateOfBirth);
      const day = dateOfBirth.getDate().toString().padStart(2, "0");
      const month = (dateOfBirth.getMonth() + 1).toString().padStart(2, "0");
      const year = dateOfBirth.getFullYear().toString();

      setDay(day);
      setMonth(month);
      setYear(year);
    } else {
      setDay("");
      setMonth("");
      setYear("");
    }
  }, [user]);

  const handleImageLoad = async () => {
    if (user && user.avatar) {
      try {
        const pathReference = ref(storage, `/avatars/${user.avatar}`);
        const url = await getDownloadURL(pathReference);
        setImageUrl(url as any);
        setIsImageLoaded(true);
      } catch (error) {
        console.log('Błąd podczas pobierania zdjęcia:', error);
        setIsImageLoaded(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      handleImageLoad();
    }
  }, [user]);



  const handleClickEditEmail = () => {
    setErrorsServer("");
    setErrorsValidationServer([]);
    setErrorEmail("")
    setShowEditEmail(!showEditEmail);

  };

  const handleClickEditPassword = () => {
    setErrorsServer("");
    setErrorsValidationServer([]);
    setErrorsPassword({
      old: "",
      new: ""
    });
    setShowEditPassword(!showEditPassword);
    setOldPassword("")
    setNewPassword("")

  };

  const handleClickEditData = () => {
    setErrorsServer("");
    setErrorsValidationServer([]);
    setErrors({
      name: "",
      surname: "",
      day: "",
      month: "",
      year: "",
    });
    setShowEditData(!showEditData);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);

  };

  const handleOldPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(event.target.value);

  };

  const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);

  };


  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedName = event.target.value;
    const capitalizedName =
      updatedName.charAt(0).toUpperCase() + updatedName.slice(1);
    setName(capitalizedName);
  };

  const handleSurnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedName = event.target.value;
    const capitalizedName =
      updatedName.charAt(0).toUpperCase() + updatedName.slice(1);
    setSurname(capitalizedName);
  };

  const handleDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDay(event.target.value);
  };
  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(event.target.value);
  };
  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value);
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGender(event.target.value);
  };

  const validateData = () => {
    const newErrors = {
      name: "",
      surname: "",
      day: "",
      month: "",
      year: "",
    };

    const newErrorsPassword = {
      new: "",
      old: ""
    }

    if (name && !/^[a-zA-Z]+$/.test(name)) {
      newErrors.name = t("loginError.name")
    }

    if (surname && !/^[a-zA-Z]+$/.test(surname)) {
      newErrors.surname = t("loginError.surname")
    }

    if (
      day &&
      (!/^\d+$/.test(day) || parseInt(day) < 1 || parseInt(day) > 31)
    ) {
      newErrors.day = t("profile.errorDay")
    }

    if (
      month &&
      (!/^\d+$/.test(month) || parseInt(month) < 1 || parseInt(month) > 12)
    ) {
      newErrors.month = t("profile.errorMonth")
    }

    if (year && (!/^\d+$/.test(year) || parseInt(year) < 1900)) {
      newErrors.year = t("profile.errorYear")
    }

    if (oldPassword && !validator.isStrongPassword(oldPassword, { minSymbols: 0 })) {
      newErrorsPassword.old = t("loginError.pass")
    }

    if (newPassword && !validator.isStrongPassword(newPassword, { minSymbols: 0 })) {
      newErrorsPassword.new = t("loginError.pass")
    }

    setErrorsPassword(newErrorsPassword)
    setErrors(newErrors);

    // Zwróć true, jeśli nie ma żadnych błędów walidacji, w przeciwnym razie false
    return (
      Object.keys(
        newErrors.name ||
        newErrors.surname ||
        newErrors.day ||
        newErrors.month ||
        newErrors.year ||
        newErrorsPassword.old ||
        newErrorsPassword.new
      ).length === 0
    );
  };

  const handleBlur = () => {
    validateData();
  };

  const handleSubmitEditData = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = validateData();

    if (!name || !surname) {
      setErrors({
        name: !name ? t("loginError.nameReq") : "",
        surname: !surname ? t("loginError.surnameReq") : "",
        day: "",
        month: "",
        year: "",
      });
      return;
    }

    if (isValid) {
      const data = {
        id: user?._id,
        name: name,
        surname: surname,
        day: day || "",
        month: month || "",
        year: year || "",
        gender: selectedGender || "",
      };

      setIsLoadingEditData(true);

      axios

        .post("/saveEditData", data)
        .then((response) => {
          const message = t("profile.text12")
          setMessage(message)
          setTimeout(() => {
            window.location.reload();
          }, 700);
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
            setErrorsValidationServer(error.response.data.errors);
          } else {
            console.log(error);
          }
        })
        .finally(() => {
          setIsLoadingEditData(false);
        });
    }
  };

  const handleEditEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorEmail("")
    setErrorsServer("")
    setErrorsValidationServer([])

    if (!email) {
      const message = t("loginError.emailReq")
      setErrorEmail(message)
      return;
    }

    if (email && !validator.isEmail(email)) {
      const message = t("loginError.email")
      setErrorEmail(message)
      return;
    }

    const data = {
      id: user?._id,
      email: email
    };

    setIsLoadingEditData(true);
    axios
      .post("/editEmail", data)
      .then((response) => {
        const message = t("profile.text11")
        setMessage(message)
        setTimeout(() => {
          window.location.reload();
        }, 700);
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
          setErrorsValidationServer(error.response.data.errors);
        } else {
          console.log(error);
        }
      })
      .finally(() => {
        setIsLoadingEditData(false);
      });

  }

  const handleEditPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = validateData();

    if (!oldPassword || !newPassword) {
      setErrorsPassword({
        old: !oldPassword ? t("loginError.passReq") : "",
        new: !newPassword ? t("loginError.passReq") : "",
      });
      return;
    }

    if (isValid) {
      const data = {
        newPassword: newPassword,
        oldPassword: oldPassword,
        id: user?._id
      };

      setIsLoadingEditData(true);

      axios
        .post("/editPassword", data)
        .then((response) => {
          const message = t("profile.text10")
          setMessage(message)
          setTimeout(() => {
            window.location.reload();
          }, 700);

          console.log(response);
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
            setErrorsValidationServer(error.response.data.errors);
          } else {
            console.log(error);
          }
        })
        .finally(() => {
          setIsLoadingEditData(false);
        });
    }

  }

  //---------------------images---------------------------

  function image64toCanvasRef(canvasRef: any, image64: any, pixelCrop: Crop) {
    canvasRef.width = pixelCrop.width; // Set canvas width to cropped area width
    canvasRef.height = pixelCrop.height; // Set canvas height to cropped area height
    const ctx = canvasRef.getContext('2d');
    const image = new Image();
    image.src = image64;
    image.onload = function () {
      ctx?.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      console.log(pixelCrop.x)
    };
  }


  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

  const imageRef = useRef<HTMLCanvasElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleImageUpload = async () => {
    try {
      if (!selectedImage) {
        throw new Error('Proszę wybrać zdjęcie');
      }
      setIsLoadingEditData(true);

      const data = new FormData();
      data.append('avatar', selectedImage);
      data.append('id', user?._id || '');

      const response = await axios.post('/uploadImage', data);

      if (user && selectedImage) {
        const storageRef = ref(storage, `avatars/${response.data.filename}`);
        await uploadBytes(storageRef, selectedImage);

        console.log('Zdjęcie zapisane w Firebase Storage');
      }

      const message = t("profile.text13")
      setMessage(message)
      window.location.reload();
    } catch (error) {
      setErrorsServer(error as string)
    } finally {
      setIsLoadingEditData(false);
    }
  };

  const [crop, setCrop] = useState<Crop>();

  console.log(croppedImage)


  const handleOnCropComplete = (crop: Crop, pixelCrop: any) => {
    const canvasRef = imageRef.current;
    const imageSrc = previewUrl;
    image64toCanvasRef(canvasRef, imageSrc, pixelCrop);
  };

  const handleOnCropChange = (crop: Crop) => {
    setCrop(crop);
  };



  return (
    <>
      {/* --------------- AVATAR ------------------*/}

      {previewUrl && (
        <div className="bg-black/80 fixed w-full h-screen z-10 flex justify-center items-center ">
          {errorsServer ? (
            <InfoDivBottom
              color="bg-red-500"
              text={
                errorsServer
              }
            />
          ) : null}

          {message && (
            <InfoDivBottom
              color="bg-green-500"
              text={message}
            />
          )}
          <div className="relative flex flex-col items-start pl-10 pb-10 px-10 bg-white dark:bg-black dark:border-white dark:border-2 rounded-lg w-[30rem]">
            <p className="text-3xl text-black/80 dark:text-white/80 font-bold mt-6 mb-10">
              {t("profile.text14")}
            </p>
            {previewUrl && (

              <ReactCrop
                crop={crop}
                onComplete={handleOnCropComplete}
                onChange={handleOnCropChange}>
                <img src={previewUrl} />
              </ReactCrop>

            )}

            <canvas ref={imageRef}></canvas>

            <div className="flex mt-6 space-x-4">
              <button onClick={() => {
                setPreviewUrl("")
              }} className="py-2 px-4 border-2 border-black/80 dark:border-white/80  dark:text-white/80 rounded-md hover:scale-105 ease-in-out duration-300"> {t("profile.cancel")}</button>

              <div className="flex items-center justify-center py-2 px-4 border-2 border-black/80 dark:border-white/80  dark:text-white/80 rounded-md hover:scale-105 ease-in-out duration-300">
                {isLoadingEditData && (
                  <CircleSvg
                    color={theme === "dark" ? "white" : "black"}
                    secColor={theme === "dark" ? "white" : "black"}
                  />
                )}
                <button onClick={handleImageUpload} > {t("profile.save")}</button>
              </div>
            </div>


          </div>
        </div>)}

      {/* --------------- Email EDIT ------------------*/}
      {showEditEmail && (
        <div className="bg-black/80 fixed w-full h-screen z-10 flex justify-center items-center ">
          {errorsServer || errorsValidationServer.length > 0 ? (
            <InfoDivBottom
              color="bg-red-500"
              text={
                errorsServer ||
                errorsValidationServer.map((error) => error.msg).join(" ")
              }
            />
          ) : null}

          {message && (
            <InfoDivBottom
              color="bg-green-500"
              text={message}
            />
          )}

          <div className="relative flex flex-col items-start pl-10 pb-10 bg-white dark:bg-black dark:border-white dark:border-2 w-[25rem]  lg:w-[35rem]  xl:w-[45rem]  rounded-lg">
            <div onClick={handleClickEditEmail}>
              <AiOutlineClose
                size={30}
                color={theme === "dark" ? "white" : "black"}
                className="absolute right-8 top-6 cursor-pointer hover:scale-125"
              />
            </div>

            <p className="text-3xl text-black/80 dark:text-white/80 font-bold mt-6">
              {t("profile.text1")}
            </p>

            <form className="w-[90%]" onSubmit={handleEditEmail}>
              <input
                className={`mt-10 w-full px-2 h-[3rem] border-2 ${errorEmail ? "border-red-500" : "border-black/50"
                  } `}
                value={email}
                type="email"
                onChange={handleEmailChange}

                placeholder={t("login.email") as string}
              />
              {errorEmail && (
                <p className="text-red-500 text-sm mt-2">{errorEmail}</p>
              )}

              <button
                type="submit"
                className="mt-8 w-full  h-[3rem] bg-black/80 dark:bg-white/80 text-white dark:text-black "
              >
                <div className="flex items-center justify-center">
                  {isLoadingEditData && (
                    <CircleSvg
                      color={theme === "dark" ? "black" : "white"}
                      secColor={theme === "dark" ? "black" : "white"}
                    />
                  )}
                  <p className="text-white dark:text-black font-lato text-xl">
                    {t("profile.save")}
                  </p>
                </div>
              </button>
            </form>
          </div>

        </div>)}

      {/* --------------- Password EDIT ------------------*/}


      {showEditPassword && (
        <div className="bg-black/80 fixed w-full h-screen z-10 flex justify-center items-center ">
          {errorsServer || errorsValidationServer.length > 0 ? (
            <InfoDivBottom
              color="bg-red-500"
              text={
                errorsServer ||
                errorsValidationServer.map((error) => error.msg).join(" ")
              }
            />
          ) : null}

          {message && (
            <InfoDivBottom
              color="bg-green-500"
              text={message}
            />
          )}

          <div className="relative flex flex-col items-start pl-10 pb-10 bg-white dark:bg-black dark:border-white dark:border-2 w-[25rem]  lg:w-[35rem]  xl:w-[45rem]  rounded-lg">
            <div onClick={handleClickEditPassword}>
              <AiOutlineClose
                size={30}
                color={theme === "dark" ? "white" : "black"}
                className="absolute right-8 top-6 cursor-pointer hover:scale-125"
              />
            </div>

            <p className="text-3xl text-black/80 dark:text-white/80 font-bold mt-6">
              {t("profile.text2")}
            </p>

            <form className="w-[90%]" onSubmit={handleEditPassword}>
              <input
                className={`mt-10 w-full px-2 h-[3rem] border-2 ${errorsPassword.old ? "border-red-500" : "border-black/50"
                  } `}
                value={oldPassword}
                type="password"
                onChange={handleOldPasswordChange}
                onBlur={handleBlur}
                placeholder={t("profile.text3") as string}
              />
              {errorsPassword.old && (
                <p className="text-red-500 text-sm mt-2">{errorsPassword.old}</p>
              )}

              <input
                className={`mt-10 w-full px-2 h-[3rem] border-2 ${errorsPassword.new ? "border-red-500" : "border-black/50"
                  } `}
                type="password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                onBlur={handleBlur}
                placeholder={t("profile.text4") as string}
              />
              {errorsPassword.new && (
                <p className="text-red-500 text-sm mt-2">{errorsPassword.new}</p>
              )}

              <button
                type="submit"
                className="mt-8 w-full  h-[3rem] bg-black/80 dark:bg-white/80 text-white dark:text-black "
              >
                <div className="flex items-center justify-center">
                  {isLoadingEditData && (
                    <CircleSvg
                      color={theme === "dark" ? "black" : "white"}
                      secColor={theme === "dark" ? "black" : "white"}
                    />
                  )}
                  <p className="text-white dark:text-black font-lato text-xl">
                    {t("profile.save")}
                  </p>
                </div>
              </button>
            </form>


          </div>

        </div>)}

      {/* --------------- Personal data EDIT ------------------*/}

      {showEditData && (
        <div className="bg-black/80 fixed w-full h-screen z-10 flex justify-center items-center ">
          {errorsServer || errorsValidationServer.length > 0 ? (
            <InfoDivBottom
              color="bg-red-500"
              text={
                errorsServer ||
                errorsValidationServer.map((error) => error.msg).join(" ")
              }
            />
          ) : null}

          {message && (
            <InfoDivBottom
              color="bg-green-500"
              text={message}
            />
          )}

          <div className="relative flex flex-col items-start pl-10 pb-10 bg-white dark:bg-black dark:border-white dark:border-2 w-[25rem]  lg:w-[35rem]  xl:w-[45rem]  rounded-lg">
            <div onClick={handleClickEditData}>
              <AiOutlineClose
                size={30}
                color={theme === "dark" ? "white" : "black"}
                className="absolute right-3 lg:right-8 top-6 cursor-pointer hover:scale-125"
              />
            </div>

            <p className="text-3xl text-black/80 dark:text-white/80 font-bold mt-6">
              {t("profile.text5")}
            </p>

            <form className="w-[90%]" onSubmit={handleSubmitEditData}>
              <input
                className={`mt-10 w-full px-2 h-[3rem] border-2 ${errors.name ? "border-red-500" : "border-black/50"
                  } `}
                value={name}
                onChange={handleNameChange}
                onBlur={handleBlur}
                placeholder={t("login.name") as string}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-2">{errors.name}</p>
              )}

              <input
                className={`mt-6 w-full  px-2 h-[3rem] border-2 ${errors.surname ? "border-red-500" : "border-black/50"
                  } `}
                value={surname}
                onChange={handleSurnameChange}
                onBlur={handleBlur}
                placeholder={t("login.surname") as string}
              />
              {errors.surname && (
                <p className="text-red-500 text-sm mt-2">{errors.surname}</p>
              )}

              <p className="text-2xl text-black/80 dark:text-white/80 mt-6 font-bold">
                {t("profile.text6")}
              </p>

              <div className="flex w-full  mt-6 space-x-4">
                <div className="w-[33%] ">
                  <input
                    className={`w-full px-2 h-[3rem]  border-2 ${errors.day ? "border-red-500" : "border-black/50"
                      }`}
                    value={day}
                    onChange={handleDayChange}
                    onBlur={handleBlur}
                    maxLength={2}
                    placeholder={t("profile.day") as string}
                  />
                  {errors.day && (
                    <p className="text-red-500 text-sm mt-2">{errors.day}</p>
                  )}
                </div>

                <div className="w-[33%] ">
                  <input
                    className={`w-full px-2 h-[3rem]  border-2 ${errors.month ? "border-red-500" : "border-black/50"
                      }`}
                    value={month}
                    onChange={handleMonthChange}
                    onBlur={handleBlur}
                    maxLength={2}
                    placeholder={t("profile.month") as string}
                  />
                  {errors.month && (
                    <p className="text-red-500 text-sm mt-2">{errors.month}</p>
                  )}
                </div>

                <div className="w-[33%] ">
                  <input
                    className={`w-full px-2 h-[3rem]  border-2 ${errors.year ? "border-red-500" : "border-black/50"
                      }`}
                    value={year}
                    onChange={handleYearChange}
                    onBlur={handleBlur}
                    maxLength={4}
                    placeholder={t("profile.year") as string}
                  />
                  {errors.year && (
                    <p className="text-red-500 text-sm mt-2">{errors.year}</p>
                  )}
                </div>
              </div>

              <p className="text-2xl text-black/80 dark:text-white/80 mt-6 font-bold">
                {t("profile.gender")}
              </p>

              <div className="mt-4 flex space-x-6 ">
                {genders.map((gender) => (
                  <label
                    key={gender}
                    className="cursor-pointer flex items-center"
                  >
                    <input
                      type="radio"
                      className="peer sr-only"
                      name="gender"
                      value={gender}
                      checked={selectedGender === gender}
                      onChange={handleGenderChange}
                    />
                    <div className="w-5 h-5 border-2 border-black/20 dark:border-white rounded-full transition-all peer-checked:bg-black/80 dark:peer-checked:bg-white"></div>
                    <p className=" ml-2 text-black/60 dark:text-white">
                      {t(`profile.${gender}`)}
                    </p>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="mt-8 w-full  h-[3rem] bg-black/80 dark:bg-white/80 text-white dark:text-black "
              >
                <div className="flex items-center justify-center">
                  {isLoadingEditData && (
                    <CircleSvg
                      color={theme === "dark" ? "black" : "white"}
                      secColor={theme === "dark" ? "black" : "white"}
                    />
                  )}
                  <p className="text-white dark:text-black font-lato text-xl">
                    {t("profile.save")}
                  </p>
                </div>
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-black/10 dark:bg-black/80 pb-20 min-h-screen ">
        <Navbar
          background="bg-white"
          shadow="none"
          extra="border-b border-black/20 dark:border-white/20"
        />

        <div className="flex justify-center items-center bg-white dark:bg-[#292929] h-[13rem]">
          <div className="flex flex-col lg:relative justify-center items-center w-[1200px] mt-12 lg:mt-0">
            <div className="lg:absolute lg:left-14 xl:left-0 mb-10 lg:mb-0">
              {isUserDataLoaded && (
                <p className="text-4xl text-black/80 dark:text-white/80">
                  {t("profile.hello")}{" "}
                  {user?.name
                    ? user.name.charAt(0)?.toUpperCase() + user.name.slice(1)
                    : ""}
                </p>
              )}

              <p className="text-center lg:text-left text-lg text-black/70 dark:text-white/70 mt-2">
                {t("profile.text7")}
              </p>
            </div>

            <div className="flex items-center space-x-2 lg:mt-40">
              <p className="text-xl lg:text-2xl  text-black/80 dark:text-white/80  px-4 h-[3rem] border-b-4  border-black dark:border-white cursor-default">
                {t("profile.myprofile")}
              </p>
              <Link to={"/address"} className="text-xl lg:text-2xl text-black/50 dark:text-white/50 px-4 h-[3rem] hover:border-b-4 h hover:border-black hover:dark:border-white cursor-pointer ">
                {t("profile.address")}
              </Link>
              <a className="text-xl lg:text-2xl text-black/50 dark:text-white/50  px-4 h-[3rem] hover:border-b-4  hover:border-black hover:dark:border-white cursor-pointer">
                {t("profile.orders")}
              </a>
            </div>

            <img
              src={theme === "dark" ? user_dark : user_light}
              className="hidden lg:block h-[7rem] w-[7rem] absolute right-14 xl:right-0 bottom-0"
            />
          </div>
        </div>

        {!isImageLoaded ? (
          <div className="flex justify-center items-center h-[60vh]">
            <LoadingAnimationSmall />
          </div>
        ) : (
          <div className="mx-auto bg-white dark:bg-[#292929] w-[1000px] py-10 mt-20 pl-6 md:pl-10">
            <p className="text-3xl text-black dark:text-white ">
              {t("profile.photo")}
            </p>
            <p className="pt-4 text-base text-black/70  dark:text-white/70  ">
              {t("profile.text8")}
            </p>
            <img
              src={previewUrl || imageUrl || avatar}
              className="rounded-full w-[10rem] h-[10rem] mt-8"
            />
            <div className="flex items-center mt-6 space-x-2 ml-2">
              <label className="py-2 px-4 border-2 cursor-pointer border-black/80 dark:border-white/80  dark:text-white/80 rounded-md hover:scale-105 ease-in-out duration-300">
                {t("profile.text15")}
                <input type="file" name="avatar" accept="image/jpeg, image/jpg" className="hidden" onChange={handleImageChange} />

              </label>


            </div>

            <p className="mt-12 text-3xl text-black dark:text-white ">
              {t("profile.myData")}
            </p>

            <div>
              <div className="flex flex-col space-y-2 pt-6 text-lg text-black/80 dark:text-white/70">
                <div className="flex items-center space-x-4">
                  <p className="font-bold">{t("profile.name")}: </p>
                  <p> {user && user.name && user.name.toUpperCase()}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <p className="font-bold">{t("profile.surname")}: </p>
                  <p>{user && user.surname && user.surname.toUpperCase()}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <p className="font-bold">{t("profile.dateOfBirth")}: </p>
                  <p>
                    {user?.dateOfBirth ? day + "." + month + "." + year : ""}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-bold">{t("profile.gender")}: </p>
                  <p>{user?.gender?.toUpperCase()}</p>
                </div>
              </div>

              <button
                onClick={handleClickEditData}
                className="mt-2 h-[2rem] font-bold border-b-2 border-black/80 dark:border-white/80 dark:text-white/80 hover:bg-black/80 hover:text-white hover:dark:bg-white/80 hover:dark:text-black"
              >
                {t("profile.edit")}
              </button>
            </div>

            <p className="mt-12 text-3xl text-black dark:text-white ">
              {t("profile.text9")}
            </p>
            <p className="mt-6 text-xl text-black font-bold  dark:text-white ">
              E-mail
            </p>
            <p className="mt-6 text-xl text-black dark:text-white">
              {user && user.email && user.email.toUpperCase()}
            </p>
            <button onClick={handleClickEditEmail} className="mt-2 h-[2rem]  font-bold border-b-2 border-black/80 dark:border-white/80 dark:text-white/80 hover:bg-black/80 hover:text-white hover:dark:bg-white/80 hover:dark:text-black">
              {t("profile.edit")}
            </button>
            <p className="mt-10 text-xl text-black font-bold  dark:text-white ">
              {t("profile.password")}
            </p>
            <p className="pt-4 text-lg text-black/80  dark:text-white/70">
              ********
            </p>
            <button onClick={handleClickEditPassword} className=" h-[2rem] font-bold border-b-2 border-black/80 dark:border-white/80 dark:text-white/80 hover:bg-black/80 hover:text-white hover:dark:bg-white/80 hover:dark:text-black">
              {t("profile.edit")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
