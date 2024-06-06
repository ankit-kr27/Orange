import {Router} from 'express'
import { 
    changeCurrentPassword, 
    getCurrentUser, 
    getUserChannelProfile, 
    getWatchHistory, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage 
} from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router()

// ROUTES
router.route("/register").post(
    upload.fields([     // injecting middleware before actual controller
        {   // two objects: avatar, coverImage
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
// patch request as we don't need to update everything just a part of it
router.route("/update-avatar").patch( 
    verifyJWT, 
    upload.single("avatar"), 
    updateUserAvatar
);
router.route("/update-cover-image").patch(
    verifyJWT, 
    upload.single("coverImage"), 
    updateUserCoverImage
);

router.route("/ch/:username").get(verifyJWT, getUserChannelProfile);   // since passing through params

router.route("/history").get(verifyJWT, getWatchHistory)


export default router;