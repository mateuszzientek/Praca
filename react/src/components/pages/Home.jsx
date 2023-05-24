import React from "react";
import Navbar from "../sections/Navbar";
import MainHome from "../sections/MainHome";
import HeadLineCards from "../sections/HeadLineCards";
import CustomSection from "../sections/CustomSection";
import OpinionSection from "../sections/OpinionSection";
import OwnPhotoSecion from "../sections/OwnPhotoSection";
import QuestionsSection from "../sections/QuestionsSection";
import Footer from "../sections/Footer";
import BackgroundMain from "../elements/BackgroundMain";
import Newslatter from "../elements/Newslatter";
import { ThemeContextProvider } from "../elements/ThemeContext";

function Home(props) {


    return (
        <>
            <Newslatter />
            <BackgroundMain>
                <Navbar />
                <MainHome />
            </BackgroundMain>
            <HeadLineCards />
            <CustomSection />
            <OpinionSection />
            <OwnPhotoSecion />
            <QuestionsSection />
            <Footer />
        </>
    );
}

export default Home;