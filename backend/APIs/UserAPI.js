import exp from "express";
import { register, authenticate } from "../services/authService.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import {upload} from '../config/multer.js'
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";
export const userRoute = exp.Router();

userRoute.post(
        "/users",
        upload.single("profileImageUrl"),
        async (req, res, next) => {
        let cloudinaryResult;

            try {
                let userObj = req.body;

                //  Step 1: upload image to cloudinary from memoryStorage (if exists)
                if (req.file) {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
                }

                // Step 2: call existing register()
                const newUserObj = await register({
                ...userObj,
                role: "USER",
                profileImageUrl: cloudinaryResult?.secure_url,
                });

                res.status(201).json({
                message: "user created",
                payload: newUserObj,
                });

            } catch (err) {

                // Step 3: rollback 
                if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
                }

                next(err); // send to your error middleware
            }

        }
  );


//Read all articles(protected route)
userRoute.get("/articles", verifyToken("USER"), async (req, res) => {
  //read articles of all authors which are active
  const articles = await ArticleModel.find({ isArticleActive: true }).populate("comments.user","email firstName")
  //send res
  res.status(200).json({ message: "all articles", payload: articles });
});

//Add comment to an article(protected route)
userRoute.put("/articles", verifyToken("USER"), async (req, res) => {
  //get comment obj from req
  const {articleId, comment } = req.body;
  //check user(req.user)
   const user=req.user._id;
    // console.log("user",user)
  if (user !== req.user._id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  //find artcleby id and update
  let articleWithComment = await ArticleModel.findOneAndUpdate(
    { _id: articleId, isArticleActive: true },
    { $push: { comments: { user, comment } } },
    { new: true, runValidators: true },
  ).populate("comments.user","email firstName")

  //if article not found
  if (!articleWithComment) {
    return res.status(404).json({ message: "Article not found" });
  }
  //send res
  res.status(200).json({ message: "comment added successfully", payload: articleWithComment });
});


// Get single article by ID
userRoute.get(
  "/article/:id",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const article = await ArticleModel.findById(id)
        .populate("author", "firstName email")
        .populate("comments.user", "firstName email"); // ✅ IMPORTANT

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.status(200).json({
        message: "article",
        payload: article,
      });
    } catch (err) {
      res.status(500).json({
        message: "Error fetching article",
        error: err.message,
      });
    }
  }
);