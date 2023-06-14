import React from "react";
import { Swiper } from "swiper/react";

export const SwiperConfig = ({ children }) => {
  return (
    <Swiper
      slidesPerGroup={3}
      slidesPerView={6}
      spaceBetween={30}
      breakpoints={{
        1536: {
          slidesPerView: 6,
        },
        1280: {
          slidesPerView: 5,
        },
        1024: {
          slidesPerView: 4,
        },
        768: {
          slidesPerView: 3,
        },
        640: {
          slidesPerView: 2,
        },
      }}
    >
      {children}
    </Swiper>
  );
};
