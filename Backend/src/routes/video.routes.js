import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, updateVideo } from "../controllers/video.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(upload.fields([
    {
        name: "videoFile",
        maxCount: 1,
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), publishAVideo)
.get(getAllVideos)

router.route("/:videoId")
.get(getVideoById)
.delete(deleteVideo)
.patch(upload.single("thumbnail"),updateVideo)

router.route("/toggle/publish/:videoId")

export default router;