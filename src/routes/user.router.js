import { Router } from "express";
// import express from 'express'
import { userRegister } from "../controllers/user.controller.js";

const router = Router()

router.post('/register', userRegister)
// router.route("/register").post( userRegister)

export default router