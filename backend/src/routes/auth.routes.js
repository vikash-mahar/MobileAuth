import { Router } from "express";
import { sendLoginOtp,
    sendSignUpOtp,
    verifyOtpAndRegister,
    verifyOtpAndLogin, logoutUser} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/authmiddleware.js";

const router = Router();
router.post("/send-otp", sendSignUpOtp);
router.post("/verify-otp", verifyOtpAndRegister);
router.post("/login/send-otp", sendLoginOtp);
router.post("/login/verify-otp", verifyOtpAndLogin);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
