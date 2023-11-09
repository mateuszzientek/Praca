import React, { useContext, useEffect } from "react";
import RatingStars from "./RatingStars";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { ThemeContext } from "./ThemeContext";
import { Swiper, SwiperSlide } from "swiper/react";
import comments from "../../comments";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation, Autoplay } from "swiper";

function SlideOpinions() {
  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    const cardElements = document.getElementsByClassName("card-opinions");

    for (let i = 0; i < cardElements.length; i++) {
      const cardElement = cardElements[i] as HTMLElement;

      if (theme === "dark") {
        cardElement.style.backgroundColor = "#dedede";
      } else {
        cardElement.style.backgroundColor = "white";
      }
    }
  }, [theme]);

  return (
    <Swiper
      slidesPerView={1}
      loop={true}
      loopedSlides={0}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        640: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        1300: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper"
    >
      {comments.map((comment) => (
        <SwiperSlide key={comment.id}>
          <div className="card-opinions">
            <LazyLoadImage
              src={require("../../assets/images/avatars/" +
                comment.avatar +
                ".png")}
              alt="Avatar"
              className="w-32 h-32 mr-auto ml-auto mt-[-6rem] mb-6 "
              effect="blur"
              placeholderSrc={require("../../assets/images/avatars/" +
                comment.avatar +
                ".png")}
            />

            <RatingStars rating={comment.rating} />
            <p className="sm:text-base md:text-lg px-8 mb-8">{comment.text}</p>
            <p className="sm:text-base md:text-lg font-bold">{comment.name}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default SlideOpinions;
