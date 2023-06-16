import responseHandler from "../handlers/responseHandler.js";
import favoriteModel from "../models/favoriteModel.js";

const addFavorite = async (req, res) => {
  try {
    const isFavorite = await favoriteModel.findOne({
      user: req.user.id,
      mediaId: req.body.mediaId,
    });

    if (isFavorite) return responseHandler.ok(res, isFavorite);

    const favorite = new favoriteModel({
      ...req.body,
      user: req.user.id,
    });

    await favorite.save();

    responseHandler.created(res, favorite);
  } catch {
    responseHandler.error(res);
  }
};

const removeFavorite = async (req, res) => {
  const { mediaId } = req.params;
  try {
    const deletedFavorite = await favoriteModel.findOneAndDelete({
      mediaId,
    });
    if (!deletedFavorite) {
      // Trường hợp không tìm thấy tài liệu
      return responseHandler.notfound(res);
    }
    // Trường hợp tìm thấy và xóa tài liệu thành công
    responseHandler.ok(res);
  } catch (err) {
    console.error(err);
    responseHandler.error(res);
  }
};

const getFavoritesOfUser = async (req, res) => {
  try {
    const favorite = await favoriteModel
      .find({ user: req.user.id })
      .sort("-createdAt");

    responseHandler.ok(res, favorite);
  } catch {
    responseHandler.error(res);
  }
};

export default { addFavorite, removeFavorite, getFavoritesOfUser };
