import express from "express";
import { body } from "express-validator";
import favoriteController from "../controllers/favoriteController.js";
import userController from "../controllers/userController.js";
import userModel from "../models/userModel.js";
import requestHandler from "../handlers/requestHandler.js";
import tokenMiddleware from "../middlewares/tokenMiddleware.js";

const router = express.Router();

router.post(
  "/signup",
  body("username")
    .exists()
    .withMessage("username is required")
    .isLength({ min: 6 })
    .withMessage("username minimum 6 characters"),
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password minimum 6 characters"),
  body("confirmPassword")
    .exists()
    .withMessage("confirmPassword is required")
    .isLength({ min: 6 })
    .withMessage("confirmPassword minimum 6 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("confirmPassword not match");
      return true;
    }),
  requestHandler.validate,
  userController.signup
);

router.post(
  "/signin",
  body("username")
    .exists()
    .withMessage("username is required")
    .isLength({ min: 6 })
    .withMessage("username minimum 6 characters"),
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password minimum 6 characters"),
  requestHandler.validate,
  userController.signin
);

router.put(
  "/update-password",
  tokenMiddleware.auth,
  body("password")
    .exists()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password minimum 6 characters"),
  body("newPassword")
    .exists()
    .withMessage("newPassword is required")
    .isLength({ min: 6 })
    .withMessage("newPassword minimum 6 characters"),
  body("confirmNewPassword")
    .exists()
    .withMessage("confirmNewPassword is required")
    .isLength({ min: 6 })
    .withMessage("confirmNewPassword minimum 6 characters")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword)
        throw new Error("confirmNewPassword not match");
      return true;
    }),
  requestHandler.validate,
  userController.updatePassword
);

router.get("/info", tokenMiddleware.auth, userController.getInfo);

router.get(
  "/favorites",
  tokenMiddleware.auth,
  favoriteController.getFavoritesOfUser
);

router.post(
  "/favorites",
  tokenMiddleware.auth,
  body("mediaType")
    .exists()
    .withMessage("mediaType is required")
    .custom((type) => ["movie", "tv"].includes(type))
    .withMessage("mediaType invalid"),
  body("mediaId")
    .exists()
    .withMessage("mediaId is required")
    .isLength({ min: 1 })
    .withMessage("mediaId can not be empty"),
  body("mediaTitle").exists().withMessage("mediaTitle is required"),
  body("mediaPoster").exists().withMessage("mediaPoster is required"),
  body("mediaRate").exists().withMessage("mediaRate is required"),
  requestHandler.validate,
  favoriteController.addFavorite
);

router.delete(
  "/favorites/:mediaId",
  tokenMiddleware.auth,
  favoriteController.removeFavorite
);

export default router;
