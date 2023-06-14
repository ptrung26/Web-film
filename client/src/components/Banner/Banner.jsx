import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { ReactComponent as ArrowLeftIcon } from "../../assets/images/arrow-left-icon.svg";
import { ReactComponent as ArrowRightIcon } from "../../assets/images/arrow-right-icon.svg";
import { ReactComponent as PlayIcon } from "../../assets/images/play-icon.svg";
import { Link } from "react-router-dom";
import "swiper/css";
import tmdbConfigs from "../../api/configs/tmdbConfig";
import genreApi from "../../api/modules/genreApi";
import mediaApi from "../../api/modules/mediaApi";
import spliceText from "../../ulitis/spliceText";
import "./Banner.scss";

export default function Banner({ mediaType, mediaCategory }) {
  const [selectedMedia, setSelectMedia] = useState(null);
  const { data: mediaData } = useQuery([mediaType, mediaCategory], () =>
    mediaApi.getList({ mediaType, mediaCategory, page: 1 })
  );

  const { data: genreData } = useQuery(["genre", mediaType], () =>
    genreApi.getList({ mediaType })
  );

  const mediaList = mediaData?.results || [];
  const genreList = genreData?.genres || [];

  return (
    <div className="banner">
      {/* Selected Media */}
      <AnimatePresence>
        <motion.div
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
          }}
          animate="animate"
          exit="exit"
          initial="initial"
          className="banner__show"
        >
          {selectedMedia && (
            <motion.img
              className="banner__show-image"
              src={tmdbConfigs.backdropPath(selectedMedia.backdrop_path)}
            />
          )}
          <div className="banner__movie">
            <h1 className="banner__movie-name">
              {selectedMedia?.original_title}
            </h1>
            <div className="banner__movie-info">
              <ul className="banner__movie-genres">
                {genreList
                  .filter((genre) => {
                    return selectedMedia?.genre_ids.some(
                      (genre_id) => genre_id === genre.id
                    );
                  })
                  .map((item, index) => (
                    <li className="banner__movie-genre" key={index}>
                      {item.name}
                    </li>
                  ))}
              </ul>
              <p className="banner__movie-desc">
                {spliceText(selectedMedia?.overview)}
              </p>
              <button className="banner__movie-btn">
                <PlayIcon />
                <Link to={`movie/${selectedMedia?.id}`}>Watch</Link>
              </button>
            </div>
          </div>
          <div className="banner__overlay">
            <div className="banner__overlay--down"></div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Banner carousel */}
      <div className="banner__carousel">
        <div className="banner__carousel-actions">
          <button>
            <ArrowLeftIcon />
          </button>
          <button>
            <ArrowRightIcon />
          </button>
        </div>
        {mediaList.length > 0 && (
          <Swiper
            containerModifierClass="bannerSwiper"
            slidesPerGroup={1}
            slidesPerView={2}
            loop
            centerInsufficientSlides
            centeredSlides
            spaceBetween={10}
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
            slideToClickedSlide
            onSlideChange={(swiper) => {
              swiper.loopCreate();
              setSelectMedia(mediaList[swiper.realIndex]);
            }}
          >
            {mediaList.map((media, index) => {
              return (
                <SwiperSlide key={index}>
                  {({ isActive }) => {
                    return (
                      <motion.img
                        variants={{
                          enter: {
                            opacity: 1,
                            y: -40,
                            speed: 300,
                          },
                          exit: {
                            opacity: 0.2,
                            y: 0,
                          },
                        }}
                        animate={isActive ? "enter" : "exit"}
                        alt="movie"
                        className="banner__carousel-image"
                        src={tmdbConfigs.backdropPath(media.poster_path)}
                      />
                    );
                  }}
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </div>
  );
}
