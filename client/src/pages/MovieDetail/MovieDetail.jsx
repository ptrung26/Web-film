import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from "swiper/react";
import tmdbConfigs from "../../api/configs/tmdbConfig";
import favoriteApi from "../../api/modules/favoriteAPI";
import genreApi from "../../api/modules/genreApi";
import mediaApi from "../../api/modules/mediaApi";
import heartIconFull from "../../assets/images/heart-full.png";
import heartIcon from "../../assets/images/heart.png";
import { ReactComponent as PlayIcon } from "../../assets/images/play-icon.svg";
import Media from "../../components/Media/Media";
import { addFavorite, removeFavorite } from "../../redux/features/userSlice";
import "./MovieDetail.scss";

function MovieDetail() {
  const { id } = useParams();
  const { listFavorites } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState(false);
  const [mediaTralers, setMediaTralers] = useState();
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.status === "signin_success") {
      toast.info("Sign successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [location.state]);

  useEffect(() => {
    const getMediaTralers = async () => {
      const { response, err } = await mediaApi.getVideos({
        mediaType: tmdbConfigs.mediaType.movie,
        mediaId: id,
      });

      if (response?.data) {
        setMediaTralers(response.data.results);
      } 
    };

    getMediaTralers();
  }, [id]);

  const { data: media } = useQuery(
    ["detail", tmdbConfigs.mediaType.movie, id],
    () =>
      mediaApi.getDetail({
        mediaType: tmdbConfigs.mediaType.movie,
        mediaId: id,
      })
  );

  // const { data: mediaTralers } = useQuery(
  //   ["videos", tmdbConfigs.mediaType.movie, id],
  //   () => {
  //     mediaApi.getVideos({
  //       mediaType: tmdbConfigs.mediaType.movie,
  //       mediaId: id,
  //     });
  //   }
  // );

  const { data: mediaCredit } = useQuery(
    ["credit", tmdbConfigs.mediaType.movie, id],
    () =>
      mediaApi.getCredit({
        mediaType: tmdbConfigs.mediaType.movie,
        mediaId: id,
      })
  );

  const { data: similarData } = useQuery(
    ["smiliar", tmdbConfigs.mediaType.movie, id],
    () =>
      mediaApi.getSimilar({
        mediaType: tmdbConfigs.mediaType.movie,
        mediaId: id,
      })
  );

  const { data: genreData } = useQuery(
    ["genre", tmdbConfigs.mediaType.movie],
    () => genreApi.getList({ mediaType: tmdbConfigs.mediaType.movie })
  );

  const mediaSimilars = similarData?.results || [];
  const genreList = genreData?.genres || [];

  useEffect(() => {
    if (listFavorites.find((x) => x.mediaId.toString() === id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [id, listFavorites]);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const handleToUpdateFavorite = async () => {
    if (!user) {
      toast.error("You must be logged in to access this feature", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (!isFavorite) {
      const body = {
        mediaId: media.id,
        mediaTitle: media.original_title,
        mediaType: tmdbConfigs.mediaType.movie,
        mediaPoster: media.poster_path,
        mediaRate: media.vote_average,
      };

      const { response, err } = await favoriteApi.add(body);
      if (response) {
        dispatch(addFavorite(response));
        setIsFavorite(true);
        toast.success("A favorite item was added successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      const { response, err } = await favoriteApi.remove({
        mediaId: id,
      });

      if (response) {
        dispatch(removeFavorite(id));
        setIsFavorite(false);
        toast.success("A favorite item was removed successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      if (err) {
      }
    }
  };

  return (
    <div className="MediaDetail">
      <div
        className="MediaDetail__banner"
        style={{
          background: `url('${
            media ? tmdbConfigs.backdropPath(media.backdrop_path) : ""
          }') no-repeat center 50% fixed`,
        }}
      >
        <div className="MediaDetail__banner-overlay"></div>
      </div>
      <div className="MediaDetail__body">
        <div className="MediaDetail__body-left">
          <img
            src={media && tmdbConfigs.posterPath(media.poster_path)}
            alt={media && media.title}
          />
          <div className="MediaDetail__overview">
            <div
              className="MediaDetail__average"
              style={{
                background: `conic-gradient(#EF4444 ${(
                  (media ? media.vote_average : 1) * 36
                ).toFixed(2)}deg, #000 0deg)`,
              }}
            >
              <span>{media?.vote_average.toFixed(2)}</span>
            </div>
            <div className="MediaDetail__ratings">
              <p>
                {media?.vote_count} <span>ratings</span>
              </p>
              <p>
                84 <span>reviews</span>
              </p>
            </div>
          </div>
        </div>
        <div className="MediaDetail__body-right">
          <div className="MediaDetail__info">
            <h2 className="MediaDetail__name">{media?.title}</h2>
            <ul className="MediaDetail__genres">
              {media &&
                media.genres.map((genre, index) => (
                  <li className="MediaDetail__genres-item" key={index}>
                    {genre.name}
                  </li>
                ))}
            </ul>
            <p className="MediaDetail__desc">{media?.overview}</p>
            <div className="MediaDetail__actions">
              <Link to={`/movie/watch/${id}`}>
                <PlayIcon />
                <span>Watch now</span>
              </Link>
              <button
                className="btn-add-favorite"
                onClick={() => handleToUpdateFavorite()}
              >
                {isFavorite ? (
                  <img src={heartIconFull} alt="add to favorite" />
                ) : (
                  <img src={heartIcon} alt="add to favorite" />
                )}
              </button>
            </div>
          </div>
          <div className="MediaDetail__casts">
            <h4>Cast and crew</h4>
            <ul className="MediaDetail__casts-list">
              {mediaCredit &&
                mediaCredit.cast
                  .filter((mediaCredit) => {
                    return mediaCredit.character;
                  })
                  .slice(0, 10)
                  .map((credit, index) => (
                    <li key={index} className="MediaDetail__casts-item">
                      <img
                        src={
                          credit.profile_path
                            ? tmdbConfigs.profilePath(credit.profile_path)
                            : ""
                        }
                        alt={credit.name}
                      />
                      <div className="MediaDetail__casts-details">
                        <p className="MediaDetail__casts-name">{credit.name}</p>
                        <p className="MediaDetail__casts-character">
                          {credit.character}
                        </p>
                      </div>
                    </li>
                  ))}
            </ul>
          </div>
          <div className="MediaDetail__tralers">
            <div className="MediaDetail__tralers-list">
              {mediaTralers &&
                mediaTralers.slice(0, 2).map((val, index) => {
                  return (
                    <div className="MediaDetail__tralers-item" key={index}>
                      <iframe
                        key={val.key}
                        src={tmdbConfigs.youtubePath(val.key)}
                        width="450px"
                        height="300px"
                        title={val.id}
                        style={{ border: 0 }}
                        allowFullScreen={true}
                      ></iframe>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="MediaDetail__similars">
            <h4>Similars</h4>
            {mediaSimilars.length > 0 && (
              <Swiper
                slidesPerView={2}
                slidesPerGroup={1}
                spaceBetween={15}
                loop
                centerInsufficientSlides
                centeredSlides
                slideToClickedSlide
                breakpoints={{
                  1536: {
                    slidesPerView: 4,
                  },
                  1280: {
                    slidesPerView: 4,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                  640: {
                    slidesPerView: 2,
                  },
                }}
              >
                {mediaSimilars.slice(0, 6).map((media, index) => (
                  <SwiperSlide key={index}>
                    <Media
                      media={media}
                      mediaType={tmdbConfigs.mediaType.movie}
                      genres={genreList}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default MovieDetail;
