import express from "express";
const authRouter = express.Router();
import passport from "passport";

// Load Controllers
import { registerUser, verifyAccount, loginUser, resendVerificationEmail, forgotPassword, resetPassword, logoutUser } from "../controllers/auth";

authRouter.post('/register', registerUser);

authRouter.post('/verify-account', verifyAccount);

authRouter.post('/resend-verification-email', resendVerificationEmail);

authRouter.post('/login', loginUser);

authRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

authRouter.get('/google/redirect', passport.authenticate('google', { successRedirect: `${process.env.CLIENT_URL}/#/dashboard`, failureRedirect: `${process.env.CLIENT_URL}/#/login` }));

authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email']}));

authRouter.get('/facebook/redirect', passport.authenticate('facebook', { successRedirect: `${process.env.CLIENT_URL}/#/dashboard`, failureRedirect: `${process.env.CLIENT_URL}/#/login` }));

authRouter.get('/twitter', passport.authenticate('twitter'));

authRouter.get('/twitter/redirect', passport.authenticate('twitter', { successRedirect: `${process.env.CLIENT_URL}/#/dashboard`, failureRedirect: `${process.env.CLIENT_URL}/#/login` }));

authRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

authRouter.get('/github/redirect', passport.authenticate('github', { successRedirect: `${process.env.CLIENT_URL}/#/dashboard`, failureRedirect: `${process.env.CLIENT_URL}/#/login` }))

authRouter.post('/forgot-password', forgotPassword);

authRouter.put('/reset-password/:token', resetPassword);

authRouter.get('/logout', logoutUser);

export default authRouter;