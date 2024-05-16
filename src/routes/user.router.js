import { Router } from "express";
// import express from 'express'
import { userRegister } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middlewares.js";

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
// router.route("/register").post( userRegister)

export default router