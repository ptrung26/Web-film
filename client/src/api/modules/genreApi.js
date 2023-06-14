import tmdbAPI from "../clients/tmdbAPI";

const genreApi = {
  getList: async ({ mediaType }) => {
    const response = await tmdbAPI.get(`/genre/${mediaType}/list`);
    return response?.data || {};
  },
};

export default genreApi;
