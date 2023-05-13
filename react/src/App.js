import React from "react";
import Navbar from "./components/Navbar";
import MainHome from "./components/MainHome";
import HeadLineCards from "./components/HeadLineCards";
import CustomSection from "./components/CustomSection";
import OpinionSection from "./components/OpinionSection";
import OwnPhotoSecion from "./components/OwnPhotoSection";
import QuestionsSection from "./components/QuestionsSection";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <div className="main-background">
        <Navbar />
        <MainHome />
      </div>
      <HeadLineCards />
      <CustomSection />
      <OpinionSection />
      <OwnPhotoSecion />
      <QuestionsSection />
      <Footer />
    </div>
  );
}

export default App;
