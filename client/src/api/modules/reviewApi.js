import publicClient from "../clients/publicClient";
import privateClient from "../clients/privateClient";

const reviewEndpoints = {
  list: "reviews",
  add: "reviews",
  remove: ({ reviewId }) => `reviews/${reviewId}`,
  media: ({ mediaId }) => `reviews/movie/${mediaId}`,
};

const reviewApi = {
  add: async ({ mediaId, mediaType, mediaTitle, mediaPoster, content }) => {
    try {
      const response = await privateClient.post(reviewEndpoints.add, {
        mediaId,
        mediaType,
        mediaTitle,
        mediaPoster,
        content,
      });

      return { response };
    } catch (err) {
      return { err };
    }
  },
  remove: async ({ reviewId }) => {
    try {
      const response = await privateClient.delete(
        reviewEndpoints.remove({ reviewId })
      );

      return { response };
    } catch (err) {
      return { err };
    }
  },
  getList: async () => {
    try {
      const response = await privateClient.get(reviewEndpoints.list);
      return { response };
    } catch (err) {
      return { err };
    }
  },

  getReviewByMediaId: async ({ mediaId }) => {
    try {
      const response = await publicClient.get(
        reviewEndpoints.media({ mediaId })
      );
      return response;
    } catch (err) {
      return err;
    }
  },
};

export default reviewApi;
