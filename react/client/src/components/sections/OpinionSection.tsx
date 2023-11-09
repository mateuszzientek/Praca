import React, { useContext } from "react";
import { ThemeContext } from "../elements/ThemeContext";
import { useTranslation } from "react-i18next";
import CircleOpinion from "../elements/CircleOpinion";
import SlideOpinions from "../elements/SlideOpinions";

function OpinionSection() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <div
      className={`h-[65rem] ${
        theme === "dark"
          ? "opinion-black-background"
          : "opinion-white-background"
      } opinion-white-background font-roboto `}
    >
      {/* main text */}

      <div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl pc:text-6xl text-center pt-28 mb-6 text-black dark:text-white">
          {t("opinionSection.main")}
        </h2>
        <div className="bg-black dark:bg-white h-[0.3rem] w-[20rem] md:w-[25rem] lg:w-[32rem] m-auto rounded-full"></div>
      </div>

      {/* circle opinion*/}

      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-center mt-16 md:mt-20 lg:mt-28 lg:space-x-12 pc:space-x-20 mb-10 md:mb-20 ">
        <div className="flex justify-center lg:space-x-12  xl:space-x-20">
          <CircleOpinion text="+1M" main_text={t("opinionSection.info1")} />
          <CircleOpinion text="+2M" main_text={t("opinionSection.info2")} />
        </div>
        <div className="flex justify-center lg:space-x-12  xl:space-x-20 ">
          <CircleOpinion text="+100K" main_text={t("opinionSection.info3")} />
          <CircleOpinion text="+10K" main_text={t("opinionSection.info4")} />
        </div>
      </div>

      {/* slider for opinions*/}

      <SlideOpinions />
    </div>
  );
}

export default OpinionSection;
