import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../config/sendEmail";

interface UserType {
    googleId?: string,
    facebookId?: string,
    twitterId?: string,
    githubId?: string,
    username: string,
    email?: string,
    password?: string,
    photo?: string,
    bio?: string,
    phone?: string,
    isVerified: boolean,
    verifyAccountToken?: string,
    verifyAccountExpire?: Date,
    resetPasswordToken?: string,
    resetPasswordExpire?: Date,
    authType: string,
    createdAt: Date,
    validatePassword: (password: string) => boolean,
    sendVerifyAccountToken: () => void,
    updateVerificationStatus: () => void,
    sendResetPasswordToken: () => void,
    resetPassword: (password: string) => void
}

const UserSchema = new mongoose.Schema<UserType>({
    googleId: {
        type: String,
        unique: true
    },
    facebookId: {
        type: String,
        unique: true
    },
    twitterId: {
        type: String,
        unique: true
    },
    githubId: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        required: [true, 'Please provide a username']
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        minlength: 6,
        select: false
    },
    photo: String,
    bio: String,
    phone: String,
    isVerified: {
        type: Boolean,
        require: [true, 'Please provide the email verification status']
    },
    verifyAccountToken: String,
    verifyAccountExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    authType: {
        type: String,
        enum: ['local', 'google', 'facebook', 'twitter', 'github'],
        required: [true, 'Please provide the authentication type']
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        require: true
    }
});

UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    if (this.password) {

        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);
    
            bcrypt.hash(this.password!, salt, (err, hashedPassword) => {
                if (err) return next(err);
    
                this.password = hashedPassword;
                next();
            })
        });

    }

});

UserSchema.methods.validatePassword = async function(password: string) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.sendVerifyAccountToken = async function() {
    const verifyAccountToken = crypto.randomBytes(20).toString('hex');

    this.verifyAccountToken = crypto.createHash('sha256').update(verifyAccountToken).digest('hex');
    this.verifyAccountExpire = Date.now() + 10 * 60 * 1000;

    await this.save();

    sendEmail(this.email, 'Please activate your account', `
            <h3>Hello, ${this.username}!!</h3>
            <p>Thank you for joining us, please activate your account by clicking on the following link:</p>
            <a href=${process.env.CLIENT_URL}/#/verify-account/${verifyAccountToken}>Click Here</a>
            `);
};

UserSchema.methods.updateVerificationStatus = async function() {
    this.isVerified = true;
    this.verifyAccountToken = undefined;
    this.verifyAccountExpire = undefined;

    await this.save();
}

UserSchema.methods.sendResetPasswordToken = async function() {
    const resetPasswordToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetPasswordToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await this.save();

    sendEmail(this.email, 'Password reset link', `
                <h3>Hello, ${this.username}!!</h3>
                <p>please reset your password by clicking on the following link:</p>
                <a href=${process.env.CLIENT_URL}/#/reset-password/${resetPasswordToken}>Click Here</a>
            `);
};

UserSchema.methods.resetPassword = async function(password: string) {
    this.password = password;
    this.resetPasswordToken = undefined;
    this.resetPasswordExpire = undefined;

    await this.save();
}

const User = mongoose.model<UserType>('User', UserSchema);

export default User;