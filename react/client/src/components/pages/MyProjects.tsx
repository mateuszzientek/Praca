import React, { useContext, useEffect, useState } from "react";
import Navbar from "../sections/Navbar";
import { UserContext } from "../elements/UserProvider";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../elements/ThemeContext";
import project_light from "../../assets/images/project_light.png";
import project_dark from "../../assets/images/project_dark.png";
import axios from "axios";
import LoadingAnimationSmall from "../elements/LoadingAnimatonSmall";
import LeftViewDesignShoe from "../sections/LeftViewDesignShoe";
import BounceLoader from "react-spinners/BounceLoader";
import InfoDivBottom from "../elements/InfoDivBottom";
import TwoSideViewDesignSection from "../sections/TwoSideViewDesignSection";
import { ProjectItem, DesignProjectInterface } from "src/types";
import { CustomContext } from "../elements/CustomProvider";

function MyProjects() {
  const { setImagesUrls, setLeftSideImageCropped, setRightSideImageCropped } = useContext(CustomContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { user, isUserDataLoaded, fetchUserData } = useContext(UserContext);
  const [projects, setProjects] = useState<DesignProjectInterface | null>(null);
  const [singleProject, setSingleProject] = useState<ProjectItem | null>(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailsDiv, setShowDetailsDiv] = useState(false);
  const [errorsServer, setErrorsServer] = useState("");

  useEffect(() => {
    if (showDetailsDiv) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up the effect
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showDetailsDiv]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLeftSideImageCropped(null)
    setRightSideImageCropped(null)
    setImagesUrls({
      leftSideImageCroppedUrl: "",
      rightSideImageCroppedUrl: ""
    })

    const userId = user?._id ? user?._id : "";

    axios
      .get(`/getProjects/?userId=${userId}`)
      .then((response) => {
        setProjects(response.data.projects);
      })
      .catch((error) => {
        const text = t("customization.text12");
        setErrorsServer(text);
      })
      .finally(() => {
        setIsDataFetched(true);
        setTimeout(() => {
          setIsLoading(false); // Wyłącz animację ładowania po 2 sekundach
        }, 1000);
      });
  }, []);

  const clickDetails = (projectId: string) => {
    if (projects) {
      const singleProject = projects.projects.filter(
        (project) => project._id === projectId
      );
      setSingleProject(singleProject.length > 0 ? singleProject[0] : null);
    }

    setShowDetailsDiv(!showDetailsDiv);
  };

  return (
    <>
      {showDetailsDiv && (
        <TwoSideViewDesignSection
          setShowDiv={setShowDetailsDiv}
          project={singleProject}
          setError={setErrorsServer}
        />
      )}

      <div className="flex justify-center z-20">
        {errorsServer && (
          <InfoDivBottom color="bg-red-500" text={errorsServer} />
        )}
      </div>

      <div className="min-h-screen bg-black/10 dark:bg-black/80 xl:pb-20 pb-16">
        <Navbar
          background="bg-white"
          shadow="none"
          extra="border-b border-black/20 dark:border-white/20"
        />

        <div className="flex justify-center space-x-[10rem] xl:space-x-[16rem] 2xl:space-x-[20rem] items-center bg-white dark:bg-[#292929] h-[13rem]">
          <div className="flex flex-col lg:flex text-center items-center">
            <div className="text-center">
              {isUserDataLoaded && (
                <p className="text-4xl text-black/80 dark:text-white/80">
                  {t("profile.hello")}{" "}
                  {user?.name
                    ? user.name.charAt(0)?.toUpperCase() + user.name.slice(1)
                    : ""}
                </p>
              )}

              <p className="text-center lg:text-left text-lg text-black/70 dark:text-white/70 mt-2">
                {t("address.text12")}
              </p>
            </div>

            <div className="flex lg:hidden items-center pt-8 lg:pr-[5rem]">
              <p className="text-4xl text-black/80 dark:text-white/80">
                {t("myProjects.text1")}
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center pt-8 lg:pr-[5rem]">
            <p className="text-4xl text-black/80 dark:text-white/80">
              {t("myProjects.text1")}
            </p>
          </div>
          <img
            src={theme === "dark" ? project_dark : project_light}
            className="hidden lg:block h-[7rem] w-[9rem] mt-[6rem]"
          />
        </div>

        {!isDataFetched ? (
          <div className="flex justify-center items-center h-[50vh]">
            <LoadingAnimationSmall />
          </div>
        ) : (
          <div className="relative flex flex-col  mx-auto  bg-white dark:bg-[#292929] w-full sm:w-[600px] lg:w-[1000px]  mt-20 ">
            {projects === null ? (
              <p className="text-2xl text-black/80 dark:text-white/80 text-center py-10">
                {t("myProjects.text2")}
              </p>
            ) : (
              <>
                {isLoading && (
                  <div className="w-full h-full min-h-[10rem]  absolute top-0 left-0 bg-white dark:bg-[#292929]  z-20">
                    <div className="flex justify-center items-center py-8">
                      <BounceLoader color={"#48c5fe"} size={100} />
                    </div>
                  </div>
                )}
                {projects?.projects.map((project, index) => (
                  // Tutaj powinna być logika renderowania projektów
                  <div
                    className="relative flex items-center py-4"
                    key={project._id}
                  >
                    <div className="sm:ml-8">
                      <LeftViewDesignShoe
                        isLeftSwooshVisible={
                          project.swooshVisibility.isLeftSwooshVisible
                        }
                        leftText={project.sideText.leftText}
                        selectedLeftPatch={
                          project.selectedPatches.selectedLeftPatch
                        }
                        selectedColors={project.selectedColors}
                        selectedColorsText={project.selectedColorsText}
                        designName={project.designName}
                        setError={setErrorsServer}
                      />
                    </div>

                    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 ml-6">
                      <div className="flex flex-col items-start ">
                        <p className="text-xl text-black/60 dark:text-white/60">
                          {t("myProjects.text3")}
                        </p>
                        <p className="text-2xl text-black dark:text-white  w-[13rem] lg:w-auto overflow-hidden whitespace-nowrap overflow-ellipsis">
                          {project.designName}
                        </p>
                      </div>
                      <button
                        onClick={() => clickDetails(project._id)}
                        className="lg:absolute top-[4rem] right-[5rem] mr-6 px-4 py-3 text-black  dark:text-white rounded-full border-2 border-black/60 dark:border-white/70 hover:bg-black/80 hover:text-white hover:dark:text-black hover:dark:bg-white "
                      >
                        <p className="text-lg"> {t("myProjects.text4")}</p>
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default MyProjects;
