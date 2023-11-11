import { useDispatch, useSelector } from "react-redux";
import tmdbConfigs from "../../api/configs/tmdbConfig";
import favoriteAPI from "../../api/modules/favoriteAPI";
import { ReactComponent as Star } from "../../assets/images/start.svg";
import "./Favorite.scss";
import { Link } from "react-router-dom";
import { removeFavorite } from "../../redux/features/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
export default function Favorite() {
  useEffect(() => {
    document.title = "Favorite";
  });
  const { listFavorites } = useSelector((state) => state.user);
  console.log(listFavorites);
  const dispatch = useDispatch();
  return (
    <div className="Favorite">
      <h2 className="Favorite__heading">MY FAVORITE FILMS</h2>
      <div className="Favorite__list">
        {listFavorites.map((media, index) => {
          return (
            <div className="Favorite__item" key={index}>
              <Link to={`/movie/${media.mediaId}`}>
                <img
                  src={tmdbConfigs.posterPath(media.mediaPoster)}
                  alt="favorite media"
                  className="Favorite__image"
                />
              </Link>
              <p className="Favorite__name">{media.mediaTitle}</p>
              <p className="Favorite__rate">
                <span> {parseInt(media.mediaRate).toFixed(1)}</span>
                <Star />
              </p>
              <button
                className="Favorite__btn"
                onClick={() => {
                  favoriteAPI.remove({ mediaId: media.mediaId });
                  dispatch(removeFavorite(media.mediaId));
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
                }}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
      <ToastContainer />
    </div>
  );
}
