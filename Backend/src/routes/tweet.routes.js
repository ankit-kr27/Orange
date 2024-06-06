import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";

const router = Router()
router.use(verifyJWT)   // apply verification middleware for all routes in the file
// it will also add user to the req object

router.route("/create").post(createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/update/:tweetId").patch(updateTweet)
router.route("/delete/:tweetId").delete(deleteTweet)

export default router;