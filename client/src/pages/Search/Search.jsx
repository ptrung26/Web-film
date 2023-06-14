import React from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { SwiperSlide } from "swiper/react";
import tmdbConfigs from "../../api/configs/tmdbConfig";
import mediaApi from "../../api/modules/mediaApi";
import Media from "../../components/Media/Media";
import Pagination from "../../components/Pagination/Pagination";
import { CardSkeleton } from "../../components/Skeleton/CardSkeleton";
import { SwiperConfig } from "../../components/Swiper/SwiperConfig";
import "./Search.scss";

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading } = useQuery(
    [
      "search",
      tmdbConfigs.mediaType.movie,
      Object.fromEntries([...searchParams]),
    ],
    () =>
      mediaApi.getSearchQuery({
        mediaType: tmdbConfigs.mediaType.movie,
        params: Object.fromEntries([...searchParams]),
      })
  );

  const searchResults = data?.results || [];

  const onPageChange = (page) => {
    let currentQuery = Object.fromEntries([...searchParams]);
    setSearchParams({ ...currentQuery, page });
  };

  if (isLoading) {
    return (
      <div className="Search">
        <div className="Search__results">
          <SwiperConfig>
            {new Array(6).fill(1).map((_, index) => {
              return (
                <SwiperSlide key={index}>
                  <CardSkeleton />
                </SwiperSlide>
              );
            })}
          </SwiperConfig>
        </div>
      </div>
    );
  }
  if (data) {
    return (
      <div className="Search">
        <h3 className="Search__total">{`Search results for "${searchParams
          .get("query")
          .toString()}"`}</h3>
        <div className="Search__results">
          {searchResults.length !== 0 &&
            searchResults.map((media, index) => (
              <div className="Search__results-item" key={index}>
                <Media media={media} mediaType={tmdbConfigs.mediaType.movie} />
              </div>
            ))}
          {searchResults.length === 0 && (
            <h3 style={{ color: "#fff" }}>{`Không tìm thấy kết quả`}</h3>
          )}
        </div>
        <Pagination
          currentPage={parseInt(searchParams.get("page") || 1)}
          pageCount={data?.total_pages}
          maxDisplayPages={5}
          onPageChange={onPageChange}
        />
      </div>
    );
  }
};
