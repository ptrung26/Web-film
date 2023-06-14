import { SwiperSlide } from "swiper/react";
import { useQuery } from "react-query";
import mediaApi from "../../api/modules/mediaApi";
import Media from "../Media/Media";
import { CardSkeleton } from "../Skeleton/CardSkeleton";
import { SwiperConfig } from "../Swiper/SwiperConfig";
import "./Category.scss";
function Category({ title, mediaType, mediaCategory }) {
  const { isLoading, data, isError } = useQuery(
    [mediaType, mediaCategory],
    () => mediaApi.getList({ mediaType, mediaCategory, page: 1 })
  );

  const mediaList = data?.results || [];

  if (isLoading) {
    return (
      <div className="category">
        <h3 className="category__title">{title}</h3>
        <SwiperConfig>
          {new Array(6).fill(1).map((_, index) => {
            return (
              <SwiperSlide key={index}>
                <CardSkeleton></CardSkeleton>
              </SwiperSlide>
            );
          })}
        </SwiperConfig>
      </div>
    );
  }

  if (isError) {
    return <h1>Lỗi mẹ nó rồi!!</h1>;
  }

  return (
    <div className="category">
      <h3 className="category__title">{title}</h3>
      <SwiperConfig>
        {mediaList.map((media, index) => (
          <SwiperSlide key={index}>
            <Media media={media} mediaType={mediaType} genres={{}} />
          </SwiperSlide>
        ))}
      </SwiperConfig>
    </div>
  );
}

export default Category;
