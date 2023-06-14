import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import tmdbConfigs from "../../api/configs/tmdbConfig";
import genreApi from "../../api/modules/genreApi";
import mediaApi from "../../api/modules/mediaApi";
import reviewApi from "../../api/modules/reviewApi";
import "./Watch.scss";

function Watch() {
  const { id } = useParams();
  const [commentValue, setCommentValue] = useState();
  const [reviewList, setReviewList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const { data: media } = useQuery(
    ["detail", tmdbConfigs.mediaType.movie, id],
    () =>
      mediaApi.getDetail({
        mediaType: tmdbConfigs.mediaType.movie,
        mediaId: id,
      })
  );

  const { data: rmData } = useQuery(
    ["recommandations", tmdbConfigs.mediaType.movie, id],
    () =>
      mediaApi.getRm({
        mediaType: tmdbConfigs.mediaType.movie,
        mediaId: id,
      })
  );

  const { data: genreData } = useQuery(
    ["genres", tmdbConfigs.mediaType.movie],
    () => genreApi.getList({ mediaType: tmdbConfigs.mediaType.movie })
  );

  useEffect(() => {
    const getReviewList = async () => {
      const response = await reviewApi.getReviewByMediaId({ mediaId: id });
      setReviewList(response);
    };
    getReviewList();
  }, [id]);

  const genreList = genreData?.genres;
  const rmList = rmData?.results;

  const handleToSendComment = async () => {
    if (commentValue.trim() === "") {
      return;
    }
    const body = {
      mediaId: media.id,
      mediaTitle: media.original_title,
      mediaType: tmdbConfigs.mediaType.movie,
      mediaPoster: media.poster_path,
      content: commentValue,
    };
    const { response, err } = await reviewApi.add(body);
    if (err) console.log(err);
    if (response) {
      setReviewList([...reviewList, response]);
      setCommentValue("");
    }
  };

  return (
    <div className="Watch">
      <div className="Watch__body">
        <div className="Watch__provider">
          <iframe
            src={`https://www.2embed.cc/embed/${id}`}
            width="100%"
            height="600px"
            allowFullScreen
            title={media?.title}
          ></iframe>
        </div>
        <h2 className="Watch__title">{media?.title || ""}</h2>
        <div className="Watch__rate">
          <div>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 1024 1024"
              className="text-primary"
              height="25"
              width="25"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"></path>
            </svg>
            <span>{media && media.vote_average.toFixed(2)}</span>
          </div>
          <div>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 1024 1024"
              className="text-primary"
              height="25"
              width="25"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M712 304c0 4.4-3.6 8-8 8h-56c-4.4 0-8-3.6-8-8v-48H384v48c0 4.4-3.6 8-8 8h-56c-4.4 0-8-3.6-8-8v-48H184v136h656V256H712v48z"></path>
              <path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zm0-448H184V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136z"></path>
            </svg>
            <span>{media && media.release_date.split("-")[0]}</span>
          </div>
        </div>
        <div className="Watch__category">
          {genreList &&
            genreList
              .filter((x) => media.genres.some((y) => y && y.id === x.id))
              .map((genre, index) => {
                return (
                  <p key={index} className="Watch__category-name">
                    {genre.name}
                  </p>
                );
              })}
        </div>
        <p className="Watch__overview">{media?.overview}</p>
        <div className="Watch__comment">
          <div className="Watch__comment-header">
            <p>Comments</p>
          </div>
          {user && (
            <div className="Watch__comment-input">
              <p
                className="Watch__comment-avatar"
                style={{
                  background: `${user.color}`,
                }}
              >
                {user.displayname.split("")[0]}
              </p>
              <input
                type="text"
                placeholder="Type anything you want..."
                onChange={(e) => setCommentValue(e.target.value)}
              />
              <button
                className="Watch__comment-send"
                onClick={() => handleToSendComment()}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  className="text-primary "
                  height="25"
                  width="25"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              </button>
            </div>
          )}
          {!user && (
            <p
              style={{
                color: "#fff",
                textAlign: "center",
                margin: "12px 0",
                fontSize: 18,
              }}
            >
              You need to{" "}
              <span
                style={{
                  cursor: "pointer",
                  color: "rgb(81,121,255)",
                }}
                onClick={() =>
                  navigate("/signin", { state: location.pathname })
                }
              >
                login
              </span>{" "}
              to comment.
            </p>
          )}
          <div className="Watch__comment-list">
            {reviewList.map((review, index) => {
              return (
                <div key={index} className="Watch__comment-item">
                  <div className="comment">
                    <span
                      className="comment__avatar"
                      style={{
                        background: `${review.user.color}`,
                      }}
                    >
                      {review.user.displayname.split("")[0]}
                    </span>
                    <div className="comment__info">
                      <div className="comment__content">
                        <p className="comment__user">
                          {review.user.displayname}
                        </p>
                        <p className="comment__text">{review.content}</p>
                      </div>
                      <p className="comment__release">
                        {new Date(review.updatedAt)
                          .toLocaleDateString("en-CA")
                          .replace(/-/g, "/")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="Watch__recommendations">
        <h2 className="Watch__recommendations-heading">Recommandations</h2>
        <div className="Watch__recommendations-list">
          {rmList &&
            rmList.slice(0, 4).map((media, index) => {
              return (
                <Link
                  to={`/movie/${media.id}`}
                  key={index}
                  className="Watch__recommendation"
                >
                  <img
                    src={tmdbConfigs.posterPath(media.poster_path)}
                    alt="media"
                  />
                  <div>
                    <p className="Watch__recommendation-title">{media.title}</p>
                    <p className="Watch__recommendation-release">
                      {media.release_date}
                    </p>
                    <div className="Watch__recommendation-rate">
                      <span>{media.vote_average.toFixed(2)}</span>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 1024 1024"
                        height="15"
                        width="15"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"></path>
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Watch;
