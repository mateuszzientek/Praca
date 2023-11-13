import React, { useContext, useState, useEffect, useRef } from "react";
import Navbar from "../sections/Navbar";
import user_light from "../../assets/images/user.png";
import user_dark from "../../assets/images/user_dark.png";
import { ThemeContext } from "../elements/ThemeContext";
import avatar from "../../assets/images/profile_avatar.png";
import { UserContext } from "../elements/UserProvider";
import {
  AiOutlineClose,
  AiOutlineEyeInvisible,
  AiOutlineEye,
} from "react-icons/ai";
import validator from "validator";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import axios from "axios";
import CircleSvg from "../elements/CircleSvg";
import InfoDivBottom from "../elements/InfoDivBottom";
import { useTranslation } from "react-i18next";
import storage from "../../resources/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import "react-image-crop/dist/ReactCrop.css";
import { Link } from "react-router-dom";
import { ErrorInterface } from "src/types";
import Cropper from "react-easy-crop";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

function Profile() {
  const inputRef = useRef(null);
  const [image, setImage] = useState<string | null>(null);
  const [croppedArea, setCroppedArea] = useState<Blob | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const { t } = useTranslation();
  const { user, isUserLoggedIn, isUserDataLoaded, fetchUserData } =
    useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const [showEditData, setShowEditData] = useState(false);
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const genders = ["man", "woman", "other"];
  const [isLoadingEditData, setIsLoadingEditData] = useState(false);
  const [errorsValidationServer, setErrorsValidationServer] = useState<
    ErrorInterface[]
  >([]);
  const [message, setMessage] = useState("");
  const [errorsServer, setErrorsServer] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const [name, setName] = useState(
    user?.name ? capitalizeFirstLetter(user.name) : ""
  );
  const [surname, setSurname] = useState(
    user?.surname ? capitalizeFirstLetter(user.surname) : ""
  );
  const [email, setEmail] = useState(user?.email || "");
  const [day, setDay] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordSec, setShowPasswordSec] = useState(false);
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
    new: "",
  });
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (image || showEditData || showEditEmail || showEditPassword) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up the effect
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [image, showEditData, showEditEmail, showEditPassword]);

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
        console.log("Błąd podczas pobierania zdjęcia:", error);
        setIsImageLoaded(true);
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
    setErrorEmail("");
    setShowEditEmail(!showEditEmail);
  };

  const handleClickEditPassword = () => {
    setErrorsServer("");
    setErrorsValidationServer([]);
    setErrorsPassword({
      old: "",
      new: "",
    });
    setShowEditPassword(!showEditPassword);
    setOldPassword("");
    setNewPassword("");
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

  const handleOldPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOldPassword(event.target.value);
  };

  const handleNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      old: "",
    };

    if (name && !/^[a-zA-Z]+$/.test(name)) {
      newErrors.name = t("loginError.name");
    }

    if (surname && !/^[a-zA-Z]+$/.test(surname)) {
      newErrors.surname = t("loginError.surname");
    }

    if (
      day &&
      (!/^\d+$/.test(day) || parseInt(day) < 1 || parseInt(day) > 31)
    ) {
      newErrors.day = t("profile.errorDay");
    }

    if (
      month &&
      (!/^\d+$/.test(month) || parseInt(month) < 1 || parseInt(month) > 12)
    ) {
      newErrors.month = t("profile.errorMonth");
    }

    if (year && (!/^\d+$/.test(year) || parseInt(year) < 1900)) {
      newErrors.year = t("profile.errorYear");
    }

    if (
      oldPassword &&
      !validator.isStrongPassword(oldPassword, { minSymbols: 0 })
    ) {
      newErrorsPassword.old = t("loginError.pass");
    }

    if (
      newPassword &&
      !validator.isStrongPassword(newPassword, { minSymbols: 0 })
    ) {
      newErrorsPassword.new = t("loginError.pass");
    }

    setErrorsPassword(newErrorsPassword);
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
          const message = t("profile.text12");
          setMessage(message);
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
    setErrorEmail("");
    setErrorsServer("");
    setErrorsValidationServer([]);

    if (!email) {
      const message = t("loginError.emailReq");
      setErrorEmail(message);
      return;
    }

    if (email && !validator.isEmail(email)) {
      const message = t("loginError.email");
      setErrorEmail(message);
      return;
    }

    const data = {
      id: user?._id,
      email: email,
    };

    setIsLoadingEditData(true);
    axios
      .post("/editEmail", data)
      .then((response) => {
        const message = t("profile.text11");
        setMessage(message);
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
  };

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
        id: user?._id,
      };

      setIsLoadingEditData(true);

      axios
        .post("/editPassword", data)
        .then((response) => {
          const message = t("profile.text10");
          setMessage(message);
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
  };

  //---------------------images---------------------------

  const onCropComplete = (
    croppedAreaPercentage: any,
    croppedAreaPixels: any
  ) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.addEventListener("load", () => {
        const result = reader.result as string | null;
        setImage(result); // Assuming setImage accepts a string | null type
      });
    }
  };

  async function getCroppedImageFile(
    imageSrc: string,
    croppedAreaPixels: any
  ): Promise<File> {
    const img = new Image();
    img.src = imageSrc;

    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "cropped-image.jpg", {
              type: "image/jpeg",
            });
            resolve(file);
          }
        }, "image/jpeg");
      });
    } else {
      throw new Error("Canvas context is null");
    }
  }

  async function deleteAvatarFiles(userId: any) {
    const avatarFolderRef = ref(storage, `avatars/`);
    const avatarFilesList = await listAll(avatarFolderRef);

    const deletePromises = avatarFilesList.items
      .filter((item) => item.name.startsWith(`${userId}_`))
      .map((item) => deleteObject(item));

    await Promise.all(deletePromises);
  }

  const handleImageUpload = async () => {
    try {
      if (!image || !croppedArea) {
        throw new Error("Proszę wybrać zdjęcie");
      }
      setIsLoadingEditData(true);

      const croppedImageFile: File = await getCroppedImageFile(
        image,
        croppedArea
      );

      // Create FormData with the File
      const userId = user?._id ? user?._id : ""

      // Use the FormData in the uploadImageHandler
      const response = await axios.post("/uploadImage", { userId });

      if (user && croppedImageFile) {
        await deleteAvatarFiles(user._id);

        const storageRef = ref(
          storage,
          `avatars/${response.data.filename}`
        );
        await uploadBytes(storageRef, croppedImageFile);

        console.log("Zdjęcie zapisane w Firebase Storage");
      }

      const message = t("profile.text13");
      setMessage(message);
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoadingEditData(false);
    }
  };

  const handleZoomChange = (event: any) => {
    setZoom(event.target.value);
  };

  return (
    <>
      <div className="flex justify-center z-20">
        {errorsServer && (
          <InfoDivBottom color="bg-red-500" text={errorsServer} />
        )}

        {errorsValidationServer.length > 0 && (
          <InfoDivBottom
            color="bg-red-500"
            text={errorsValidationServer.map((error) => error.msg).join(", ")}
          />
        )}

        {message && <InfoDivBottom color="bg-green-500" text={message} />}
      </div>

      {/* --------------- AVATAR ------------------*/}

      {image && (
        <div className="fixed w-full h-screen flex flex-col items-center pl-10 pb-10 px-10 z-[2] bg-white dark:bg-black  rounded-lg overflow-y-auto">
          <p className="text-3xl text-black/80 dark:text-white/80 font-bold mt-10 mb-10">
            {t("profile.text14")}
          </p>

          <div className="relative w-full h-full ">
            <Cropper
              image={image || ""}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <input
            className="w-full lg:w-[60%] mt-6"
            type="range"
            value={zoom}
            step={0.01}
            onChange={handleZoomChange}
            min={1}
            max={3}
          />

          <div className="flex mt-6 space-x-4 ">
            <button
              onClick={() => {
                setImage("");
              }}
              className="py-2 px-4 border-2 border-black/80 dark:border-white/80  dark:text-white/80 rounded-md hover:scale-105 ease-in-out duration-300"
            >
              {" "}
              {t("profile.cancel")}
            </button>

            <button
              disabled={isLoadingEditData}
              onClick={handleImageUpload}
              className={`flex items-center justify-center py-2 px-4 border-2 border-black/80 ${isLoadingEditData ? "bg-[#c9c9c9]" : "bg-transparent"
                } dark:border-white/80  dark:text-white/80 rounded-md hover:scale-105 ease-in-out duration-300`}
            >
              {isLoadingEditData && (
                <CircleSvg
                  color={theme === "dark" ? "white" : "black"}
                  secColor={theme === "dark" ? "white" : "black"}
                />
              )}
              <div> {t("profile.save")}</div>
            </button>
          </div>
        </div>
      )}

      {/* --------------- Email EDIT ------------------*/}
      {showEditEmail && (
        <div className="bg-black/40 backdrop-blur-sm fixed w-full min-h-screen h-screen z-[2] flex justify-center items-center overflow-y-auto ">
          <div className="relative flex flex-col items-start px-10 pb-10 bg-white dark:bg-black  w-[25rem]  lg:w-[35rem]  xl:w-[45rem] max-h-[80vh]   rounded-lg overflow-y-auto">
            <div className="max-h-[80vh] w-full">
              <div className="flex justify-between items-center mt-6">
                <p className="text-3xl text-black/80 dark:text-white/80 font-bold ">
                  {t("profile.text1")}
                </p>
                <div onClick={handleClickEditEmail}>
                  <AiOutlineClose
                    size={30}
                    color={theme === "dark" ? "white" : "black"}
                    className="cursor-pointer hover:scale-125"
                  />
                </div>
              </div>

              <form className="w-full" onSubmit={handleEditEmail}>
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
                  disabled={isLoadingEditData}
                  className="mt-8 w-full  h-[3rem] bg-black/80 dark:bg-white/80 text-white dark:text-black mb-4"
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
        </div>
      )}

      {/* --------------- Password EDIT ------------------*/}

      {showEditPassword && (
        <div className="bg-black/40  backdrop-blur-sm fixed w-full h-screen z-[2] flex justify-center items-center overflow-y-auto min-h-screen">
          <div className="relative flex flex-col items-start px-10 pb-4 bg-white dark:bg-black  w-[25rem]  lg:w-[35rem]  xl:w-[45rem] max-h-[80vh]  rounded-lg overflow-y-auto">
            <div className="max-h-[80vh] w-full">
              <div className="flex justify-between items-center mt-6">
                <p className="text-3xl text-black/80 dark:text-white/80 font-bold ">
                  {t("profile.text2")}
                </p>
                <div onClick={handleClickEditPassword}>
                  <AiOutlineClose
                    size={30}
                    color={theme === "dark" ? "white" : "black"}
                    className="cursor-pointer hover:scale-125"
                  />
                </div>
              </div>

              <form className="w-full " onSubmit={handleEditPassword}>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`mt-10 w-full px-2 h-[3rem] border-2 ${errorsPassword.old ? "border-red-500" : "border-black/50"
                      } `}
                    value={oldPassword}
                    onChange={handleOldPasswordChange}
                    onBlur={handleBlur}
                    placeholder={t("profile.text3") as string}
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 bottom-4"
                  >
                    {showPassword ? (
                      <AiOutlineEye
                        size={20}
                        className="cursor-pointer hover:scale-105 transition ease-in-out duration-300"
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        size={20}
                        className="cursor-pointer hover:scale-105 transition ease-in-out duration-300"
                      />
                    )}
                  </div>
                </div>
                {errorsPassword.old && (
                  <p className="text-red-500 text-sm mt-2">
                    {errorsPassword.old}
                  </p>
                )}
                <div className="relative">
                  <input
                    className={`mt-10 w-full px-2 h-[3rem] border-2 ${errorsPassword.new ? "border-red-500" : "border-black/50"
                      } `}
                    type={showPasswordSec ? "text" : "password"}
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    onBlur={handleBlur}
                    placeholder={t("profile.text4") as string}
                  />
                  <div
                    onClick={() => setShowPasswordSec(!showPasswordSec)}
                    className="absolute right-4 bottom-4"
                  >
                    {showPasswordSec ? (
                      <AiOutlineEye
                        size={20}
                        className="cursor-pointer hover:scale-105 transition ease-in-out duration-300"
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        size={20}
                        className="cursor-pointer hover:scale-105 transition ease-in-out duration-300"
                      />
                    )}
                  </div>
                </div>
                {errorsPassword.new && (
                  <p className="text-red-500 text-sm mt-2">
                    {errorsPassword.new}
                  </p>
                )}

                <button
                  disabled={isLoadingEditData}
                  type="submit"
                  className="mt-8 w-full mb-4  h-[3rem] bg-black/80 dark:bg-white/80 text-white dark:text-black "
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
        </div>
      )}

      {/* --------------- Personal data EDIT ------------------*/}

      {showEditData && (
        <div className="bg-black/40 backdrop-blur-sm fixed w-full  h-screen flex flex-col justify-center items-center overflow-y-auto min-h-screen">
          <div className="relative flex flex-col items-start px-10 pb-4 bg-white dark:bg-black  w-[30rem]  md:w-[35rem]  xl:w-[45rem] max-h-[80vh]   rounded-lg  overflow-y-auto">
            <div className="max-h-[80vh]  w-full">
              <div className="flex justify-between items-center mt-6">
                <p className="text-3xl text-black/80 dark:text-white/80 font-bold">
                  {t("profile.text5")}
                </p>
                <div onClick={handleClickEditData}>
                  <AiOutlineClose
                    size={30}
                    color={theme === "dark" ? "white" : "black"}
                    className="absolute right-3 lg:right-8 top-6 cursor-pointer hover:scale-125"
                  />
                </div>
              </div>

              <form className="w-full " onSubmit={handleSubmitEditData}>
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
                      <p className="text-red-500 text-sm mt-2">
                        {errors.month}
                      </p>
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
                  disabled={isLoadingEditData}
                  type="submit"
                  className="mt-8 w-full mb-4 h-[3rem] bg-black/80 dark:bg-white/80 text-white dark:text-black "
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

            <div className="flex items-center sm:space-x-2 lg:mt-40 ">
              <p className="text-xl lg:text-2xl  text-black/80 dark:text-white/80  px-4 h-[3rem] border-b-4  border-black dark:border-white cursor-default">
                {t("profile.myprofile")}
              </p>
              <Link
                to={"/address"}
                className="text-xl lg:text-2xl text-black/50 dark:text-white/50 px-4 h-[3rem] hover:border-b-4 h hover:border-black hover:dark:border-white cursor-pointer "
              >
                {t("profile.address")}
              </Link>
              <Link
                to={"/order"}
                className="text-xl lg:text-2xl text-black/50 dark:text-white/50  px-4 h-[3rem] hover:border-b-4  hover:border-black hover:dark:border-white cursor-pointer"
              >
                {t("profile.orders")}
              </Link>
            </div>

            <img
              src={theme === "dark" ? user_dark : user_light}
              className="hidden lg:block h-[7rem] w-[7rem] absolute right-14 xl:right-0 bottom-0"
            />
          </div>
        </div>

        {!isImageLoaded && user?.avatar ? (
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
                <input
                  type="file"
                  name="avatar"
                  accept="image/jpeg, image/jpg"
                  ref={inputRef}
                  onChange={onSelectFile}
                  className="hidden"
                />
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
            <p className="mt-6 text-xl text-black/80 dark:text-white/70">
              {user && user.email && user.email.toUpperCase()}
            </p>
            <button
              onClick={handleClickEditEmail}
              className="mt-2 h-[2rem]  font-bold border-b-2 border-black/80 dark:border-white/80 dark:text-white/80 hover:bg-black/80 hover:text-white hover:dark:bg-white/80 hover:dark:text-black"
            >
              {t("profile.edit")}
            </button>
            <p className="mt-10 text-xl text-black font-bold  dark:text-white ">
              {t("profile.password")}
            </p>
            <p className="pt-4 text-lg text-black/80  dark:text-white/70">
              ********
            </p>
            <button
              onClick={handleClickEditPassword}
              className=" h-[2rem] font-bold border-b-2 border-black/80 dark:border-white/80 dark:text-white/80 hover:bg-black/80 hover:text-white hover:dark:bg-white/80 hover:dark:text-black"
            >
              {t("profile.edit")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
