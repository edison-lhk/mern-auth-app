import express from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";

declare global {
    namespace Express {
      interface User {
        id: string,
        username: string,
        email: string
      }
    }
  }

const getUser = asyncHandler(async (req: express.Request, res: express.Response) => {
    const id  = req.user!.id;

    const user = await User.findById(id);

    res.status(200).json({ success: true, user: { photo: user!.photo, username: user!.username, bio: user!.bio, phone: user!.phone, email: user!.email, authType: user!.authType } });

});

const updateUser = asyncHandler(async (req: express.Request, res: express.Response) => {
    const id = req.user!.id;
    const { photo, username, bio, phone, email, password } = req.body;

    const user = await User.findById(id).select('+password');

    if (photo && photo !== '') {
        user!.photo = photo;
    } else {
        user!.photo = undefined;
    }

    if (username && username !== '') {
        user!.username = username;
    } else {
        res.status(400).json({ success: false, error: 'You must have a username' });
    }
    

    if (bio && bio !== '') {
        user!.bio = bio;
    } else {
        user!.bio = undefined;
    }
    

    if (phone && phone !== '') {
        if (!(/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone))) {
            res.status(400).json({ success: false, error: 'Please provide a valid phone number' });
        } else {
            user!.phone = phone;
        }
    } else {
        user!.phone = undefined;
    }

    if (email) {
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).json({ success: false, error: 'Please provide a valid email address' });
        } else {
            user!.email = email;
        }
    }

    if (password && password !== '') {
        if (password.length < 6) {
            res.status(400).json({ success: false, error: 'Password should contain at least 6 characters' });
        } else {
            user!.password = password;
        }
    }

    await user!.save();

    res.status(200).json({ success: true, message: "Personal info has been successfully updated"  });
});

export { getUser, updateUser };