import React from "react";
import Navbar from "../sections/Navbar";
import MainHome from "../sections/MainHome";
import HeadLineCards from "../sections/HeadLineCards";
import CustomSection from "../sections/CustomSection";
import OpinionSection from "../sections/OpinionSection";
import OwnPhotoSecion from "../sections/OwnPhotoSection";
import QuestionsSection from "../sections/QuestionsSection";
import BackgroundMain from "../elements/BackgroundMain";
import Newslatter from "../elements/Newslatter";

function Home() {

    return (
        <>
            <Newslatter />
            <BackgroundMain>
                <Navbar height="h-40" darkBackground="dark:bg-transparent" background="bg-transparent" shadow="shadow-none" />
                <MainHome />
            </BackgroundMain>
            <HeadLineCards />
            <CustomSection />
            <OpinionSection />
            <OwnPhotoSecion />
            <QuestionsSection />
        </>
    );
}

export default Home;