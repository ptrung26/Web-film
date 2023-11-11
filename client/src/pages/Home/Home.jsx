import { useEffect } from "react";
import tmdbConfigs from "../../api/configs/tmdbConfig";
import Banner from "../../components/Banner/Banner";
import Category from "../../components/Category/Category";

import "./Home.scss";

function Home() {
  useEffect(() => {
    document.title = "Home page";
  });
  return (
    <>
      <Banner
        mediaType={tmdbConfigs.mediaType.movie}
        mediaCategory={tmdbConfigs.mediaCategory.now_playing}
      />

      <div className="Home__categories">
        <Category
          title="Up Coming"
          mediaType={tmdbConfigs.mediaType.movie}
          mediaCategory={tmdbConfigs.mediaCategory.upcoming}
        />
        <Category
          title="Top Popular"
          mediaType={tmdbConfigs.mediaType.movie}
          mediaCategory={tmdbConfigs.mediaCategory.popular}
        />
        <Category
          title="Top Rated"
          mediaType={tmdbConfigs.mediaType.movie}
          mediaCategory={tmdbConfigs.mediaCategory.top_rated}
        />
      </div>
    </>
  );
}

export default Home;
