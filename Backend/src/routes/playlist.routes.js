import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist } from '../controllers/playlist.controller.js';

const router = Router();

router.use(verifyJWT)   // apply verification middleware for all routes in the file
// it will also add user to the req object

router.route("/create").post(createPlaylist)
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/user/:userId").get(getUserPlaylists)
router.route("/:playlistId").get(getPlaylistById)
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)
router.route("/delete/:playlistId").delete(deletePlaylist)

export default router;