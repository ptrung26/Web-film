import tmdbAPI from "../clients/tmdbAPI";

const mediaApi = {
  getList: async ({ mediaType, mediaCategory, page }) => {
    const response = await tmdbAPI.get(`${mediaType}/${mediaCategory}`, {
      params: {
        page,
      },
    });
    return response?.data || {};
  },

  getVideos: async ({ mediaType, mediaId }) => {
    try {
      const response = await tmdbAPI.get(`${mediaType}/${mediaId}/videos`);
      return { response };
    } catch (err) {
      return { err };
    }
  },

  getDetail: async ({ mediaType, mediaId }) => {
    const response = await tmdbAPI.get(`${mediaType}/${mediaId}`);
    return response?.data || {};
  },

  getCredit: async ({ mediaType, mediaId }) => {
    const response = await tmdbAPI.get(`${mediaType}/${mediaId}/credits`);
    return response?.data || {};
  },

  getSimilar: async ({ mediaType, mediaId }) => {
    const response = await tmdbAPI.get(`${mediaType}/${mediaId}/similar`);
    return response?.data || {};
  },

  getRm: async ({ mediaType, mediaId }) => {
    const response = await tmdbAPI.get(
      `${mediaType}/${mediaId}/recommendations`
    );
    return response?.data || {};
  },

  getDiscoverResult: async ({ mediaType, params }) => {
    const response = await tmdbAPI.get(`/discover/${mediaType}`, {
      params,
    });

    return response?.data || {};
  },

  getSearchQuery: async ({ mediaType, params }) => {
    const response = await tmdbAPI.get(`/search/${mediaType}`, {
      params,
    });

    return response?.data || {};
  },
};

export default mediaApi;
