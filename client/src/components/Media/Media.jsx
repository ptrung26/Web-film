import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Link } from "react-router-dom";
import tmdbConfigs from "../../api/configs/tmdbConfig";
import sliceText from "../../ulitis/spliceText";
import "./Media.scss";

function Media({ media, mediaType }) {
  return (
    <Link to={`/${mediaType}/${media.id}`} className="Media">
      <LazyLoadImage
        className="Media__img"
        src={media.poster_path ? tmdbConfigs.posterPath(media.poster_path) : ""}
        alt={mediaType}
        effect="blur"
      />
      <div className="Media__info">
        <p className="Media__name">{sliceText(media.original_title)}</p>
      </div>
    </Link>
  );
}

export default Media;
