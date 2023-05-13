import React from "react";
import RatingStars from './RatingStars';
import { Swiper, SwiperSlide } from "swiper/react";
import comments from '../comments';

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation, Autoplay } from "swiper";

function SlideOpinions() {
    return (
        <Swiper
            slidesPerView={1}
            loop={true}
            loopedSlidesLimit={false}
            autoplay={{
                delay: 4000,
                disableOnInteraction: false
            }}
            breakpoints={{
                640: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                },
                1210: {
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
                        <img src={require('../assets/images/avatars/' + comment.avatar + '.png')} alt="Avatar" className="w-32 h-32 mr-auto ml-auto mt-[-6rem] mb-6 "></img>
                        <RatingStars rating={comment.rating} />
                        <p className="sm:text-base md:text-lg px-8 mb-8">{comment.text}</p>
                        <p className="sm:text-base md:text-lg font-bold">{comment.name}</p>
                    </div>
                </SwiperSlide>
            ))
            }
        </Swiper >

    );
}



export default SlideOpinions;