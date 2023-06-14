const mediaType = {
  movie: "movie",
  tv: "tv",
};

const mediaCategory = {
  now_playing: "now_playing",
  popular: "popular",
  top_rated: "top_rated",
  upcoming: "upcoming",
};

const backdropPath = (imgEndpoint) =>
  `https://image.tmdb.org/t/p/original${imgEndpoint}`;

const posterPath = (imgEndpoint) =>
  `https://image.tmdb.org/t/p/w300${imgEndpoint}`;

const profilePath = (imgEndpoint) =>
  `https://image.tmdb.org/t/p/w185${imgEndpoint}`;

const youtubePath = (videoId) =>
  `https://www.youtube.com/embed/${videoId}?controls=1`;

const tmdbConfigs = {
  mediaType,
  mediaCategory,
  backdropPath,
  posterPath,
  profilePath,
  youtubePath,
};

export default tmdbConfigs;
