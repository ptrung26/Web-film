import classNames from "classnames";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import tmdbConfigs from "../../api/configs/tmdbConfig";

import genreApi from "../../api/modules/genreApi";
import mediaApi from "../../api/modules/mediaApi";
import Media from "../../components/Media/Media";
import "./Discover.scss";
import Pagination from "../../components/Pagination/Pagination";

export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState({});

  const { data: genreData } = useQuery(
    ["genre", tmdbConfigs.mediaType.movie],
    () => genreApi.getList({ mediaType: tmdbConfigs.mediaType.movie })
  );

  const { data: searchData } = useQuery(
    ["discover", tmdbConfigs.mediaType.movie, params],
    () =>
      mediaApi.getDiscoverResult({
        mediaType: tmdbConfigs.mediaType.movie,
        params,
      })
  );

  const genreList = genreData?.genres || [];
  const searchResult = searchData?.results || [];

  useEffect(() => {
    const queries = Array.from(searchParams).reduce((acc, [key, value]) => {
      acc[key] = acc[key] ? acc[key] + "," + value : value;
      return acc;
    }, {});

    if (!Object.keys(queries).length) {
      setParams({});
    } else {
      setParams({ ...params, ...queries });
    }
  }, [searchParams.toString()]);

  useEffect(() => {
    // 👇️ scroll to top on page load
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [searchParams]);

  const configNewQuery = (key, value) => {
    let currentQueries = {};
    searchParams.forEach((_value, _key) => {
      if (!Array.isArray(currentQueries[_key])) {
        currentQueries[_key] = [];
      }
      currentQueries[_key].push(_value);
    });

    setSearchParams({
      ...currentQueries,
      [key]: value,
    });
  };

  const configGenreQuery = (genreId) => {
    const genreQueries = searchParams.getAll("with_genres");
    let newGenres;
    if (genreQueries.includes(genreId)) {
      newGenres = genreQueries.filter((genre) => genre !== genreId);
    } else {
      newGenres = [...genreQueries, genreId];
    }

    configNewQuery("with_genres", newGenres);
  };

  const configSortByType = (selected) => {
    let type = "";
    if (selected.value === "Most popular") {
      type = "popular.desc";
    } else if (selected.value === "Most rating") {
      type = "vote_count.desc";
    } else if (selected.value === "Most recent") {
      type = "release_date.desc";
    }
    configNewQuery("sort_by", type);
  };

  const configReleaseQuery = (type, value) => {
    configNewQuery(type, value);
  };

  const onPageChange = (page) => {
    configNewQuery("page", page);
  };

  return (
    <div className="Discover">
      <h1 className="Discover__heading">FIND FILMS THAT BEST FIT YOU</h1>
      <div className="Discover__body">
        <div className="Discover__main">
          <div className="Discover__result">
            {searchResult &&
              searchResult.map((media, index) => (
                <div className="Discover__result-item" key={index}>
                  <Media
                    media={media}
                    mediaType={tmdbConfigs.mediaType.movie}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="Discover__options">
          <div className="Discover__sort">
            <h4 className="Discover__options-heading">Sort</h4>
            <Select
              className="Discover__sort-options"
              defaultValue={{
                value: "Most popular",
                label: "Most popular",
                isFixed: true,
              }}
              options={[
                {
                  value: "Most popular",
                  label: "Most popular",
                  isFixed: true,
                },
                {
                  value: "Most rating",
                  label: "Most rating",
                  isFixed: true,
                },
                {
                  value: "Most recent",
                  label: "Most recent",
                  isFixed: true,
                },
              ]}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  background: "#49494b",
                  color: "#49494b",
                  border: 0,
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "#95989d",
                }),
              }}
              onChange={(selected) => configSortByType(selected)}
            />
          </div>
          <div className="Discover__filters">
            <h4 className="Discover__options-heading">Filters</h4>
            <div className="Discover__filters-item">
              <p className="Discover__filters-title">Genre</p>
              {genreList && (
                <ul className="Discover__filters--genres">
                  {genreList.map((genre, index) => (
                    <li
                      key={index}
                      className={classNames("Discover__filters--genre", {
                        isActive: searchParams
                          .getAll("with_genres")
                          .includes(String(genre.id)),
                      })}
                      onClick={() => configGenreQuery(String(genre.id))}
                    >
                      {genre.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="Discover__filters-item">
              <p className="Discover__filters-title">Release Dates</p>
              <div className="Discover__filters--date">
                <div className="Discover__filters--date__group">
                  <label>From</label>
                  <input
                    type="date"
                    onChange={(e) =>
                      configReleaseQuery("release_date.gte", e.target.value)
                    }
                  />
                </div>
                <div className="Discover__filters--date__group">
                  <label>To</label>
                  <input
                    type="date"
                    onChange={(e) =>
                      configReleaseQuery("release_date.lte", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={parseInt(searchParams.get("page") || 1)}
        pageCount={searchData?.total_pages}
        maxDisplayPages={5}
        onPageChange={onPageChange}
      />
    </div>
  );
}
