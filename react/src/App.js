import React from "react";
import Navbar from "./components/Navbar";
import MainHome from "./components/MainHome";
import HeadLineCards from "./components/HeadLineCards";
import CustomSection from "./components/CustomSection";
import OpinionSection from "./components/OpinionSection";
import OwnPhotoSecion from "./components/OwnPhotoSection";
import QuestionsSection from "./components/QuestionsSection";
import Footer from "./components/Footer";
import BackgroundMain from "./components/BackgroundMain";
import Newslatter from "./components/Newslatter";
import { ThemeContextProvider } from "./components/ThemeContext";

function App() {
  return (
    <ThemeContextProvider>
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
    </ThemeContextProvider>
  );
}

export default App;
