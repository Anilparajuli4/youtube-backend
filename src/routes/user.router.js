import { Router } from "express";
import { logout, userRegister, userSignin } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyUser } from "../middlewares/verifyUser.js";


const router = Router()

router.post('/register', upload.fields([
   {
    name: "avatar",
    maxCount: 1
   },
   {
    name: "coverImage",
    maxCount: 1
   },
]), userRegister)


// router.route("/register").post(
//    upload.fields([
//        {
//            name: "avatar",
//            maxCount: 1
//        }, 
//        {
//            name: "coverImage",
//            maxCount: 1
//        }
//    ]),
//    userRegister
//    )
   router.route('/signin').post( userSignin)
   router.route('/logout').post(verifyUser, logout)


export default router