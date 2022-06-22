import express from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import crypto from "crypto";
import passport from "passport";

const registerUser = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ success: false, error: 'Please fill in all fields' });
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        res.status(400).json({ success: false, error: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
        res.status(400).json({ success: false, error: 'Password should contain at least 6 characters' });
    }

    const userExist = await User.findOne({ email, authType: 'local' });

    if (userExist) {
        res.status(400).json({ success: false, error: 'Email has already been used' });
    } else {
        
        const newUser = await User.create({ username, email, password, isVerified: false, authType: 'local' });

        await newUser.sendVerifyAccountToken();

        res.status(201).json({ success: true, message: 'Please activiate your account in your email' });

    }
});

const verifyAccount = asyncHandler(async (req: express.Request, res: express.Response) => {
    const verifyAccountToken: string = req.body.token;

    if (!verifyAccountToken) {
        res.status(401).json({ success: false, error: 'Token cannot be found' });
    }

    const hashedVerifyAccountToken = crypto.createHash('sha256').update(verifyAccountToken).digest('hex');

    const user = await User.findOne({ verifyAccountToken: hashedVerifyAccountToken });

    if (!user) {
        res.status(401).json({ success: false, error: 'Token is not valid' });
    } else {

        if (new Date() > user.verifyAccountExpire!) {
            res.status(401).json({ success: false, error: 'Token has already expired' });
        } else {

            await user.updateVerificationStatus();
            res.status(200).json({ success: true, message: 'Your account is successfully verified' });

        }

    }
});

const resendVerificationEmail = asyncHandler(async(req: express.Request, res: express.Response) => {
    const verifyAccountToken: string = req.body.token;

    if (!verifyAccountToken) {
        res.status(401).json({ success: false, error: 'Token cannot be found' });
    }

    const hashedVerifyAccountToken = crypto.createHash('sha256').update(verifyAccountToken).digest('hex');

    const user = await User.findOne({ verifyAccountToken: hashedVerifyAccountToken });

    if (!user) {
        res.status(401).json({ success: false, error: 'Token is not valid' });
    } else {
        await user.sendVerifyAccountToken();
        res.status(200).json({ success: true, message: 'Verification email has been successfully resent' });
    }
});

const loginUser = asyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { email, password } = req.body;

    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);

        if (user) {
            req.logIn(user, err => {
                if (err) return next(err);

                res.status(200).json({ success: true, message: 'Login Successful' });
            })
        } else {
            res.status(401).json({ success: false, error: info.message})
        }
    })(req, res, next);

});

const forgotPassword = asyncHandler(async (req: express.Request, res: express.Response) => {
    const email = req.body.email;

    if (!email) {
        res.status(400).json({ success: false, error: "Please provide an email address" });
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        res.status(400).json({ success: false, error: 'Please provide a valid email address' });
    }

    const user = await User.findOne({ email, authType: 'local' });

    if (!user) {
        res.status(401).json({ success: false, error: "Email does not exist" });
    } else {

        if (!user.isVerified) {
            res.status(401).json({ success: false, error: "Your account is not verified yet" });
        } else {

            await user.sendResetPasswordToken();

            res.status(200).json({ success: true, message: 'The password reset link has been sent to your email' });

        }

    }   
});

const resetPassword = asyncHandler(async (req: express.Request, res: express.Response) => {
    const resetPasswordToken = req.params.token;
    const password = req.body.password;

    if (!resetPasswordToken) {
        res.status(401).json({ success: false, error: 'Token cannot be found' });
    }

    if (!password) {
        res.status(401).json({ success: false, error: 'Please provide a new password' });
    }

    const hashedResetPasswordToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');

    const user = await User.findOne({ resetPasswordToken: hashedResetPasswordToken }).select('+password');

    if (!user) {
        res.status(401).json({ success: false, error: 'Token is not valid' });
    } else {

        if (new Date() > user.resetPasswordExpire!) {
            res.status(401).json({ success: false, error: 'Token has already expired' });
        } else if (!user.isVerified) {
            res.status(401).json({ success: false, error: "Your account is not verified yet" });
        } else if (user.password === password) {
            res.status(401).json({ success: false, error: "Your new password is the same as the previous one" });
        } else {

            await user.resetPassword(password);
            res.status(200).json({ success: true, message: 'Your password has been successfully changed' });

        }
    }
});

const logoutUser = asyncHandler(async (req: express.Request, res: express.Response) => {

    req.logOut(err => {
        if (err) {
            res.status(401).json({ success: false, error: 'Logout Failure' });
        }
        res.status(200).json({ success: true, message: 'Logout Successful' });
    });
    
});

export { registerUser, verifyAccount, resendVerificationEmail, loginUser, forgotPassword, resetPassword, logoutUser };