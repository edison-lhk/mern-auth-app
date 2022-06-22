import passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;
import passportGoogle from "passport-google-oauth20";
const GoogleStrategy = passportGoogle.Strategy;
import passportFacebook from "passport-facebook";
import FacebookStrategy = passportFacebook.Strategy;
import passportTwitter from "passport-twitter";
import TwitterStrategy = passportTwitter.Strategy;
import passportGithub from "passport-github2";
const GithubStrategy = passportGithub.Strategy;
import User from "../models/User";
 
const initializeAuth = (passport: any) => {

    passport.serializeUser((user: any, done: any) => done(null, user));
    
    passport.deserializeUser((user: any, done: any) => done(null, user));

    // Sign in using email and password
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email, authType: 'local' }).select("+password");

            if (!user) {
                return done(null, false, { message: 'Email does not exist' });
            }

            if (!user.isVerified) {
                return done(null, false, { message: 'Your account has not verified yet' });
            }

            if (!(await user.validatePassword(password))) {
                return done(null, false, { message: 'Your password is incorrect, please try again' });
            }

            return done(null, { id: user._id, username: user.username, email: user.email, authType: user.authType });
        } catch (err) {
            return done(err);
        }
    }));

    // Sign in using Google account
    passport.use(new GoogleStrategy({ clientID: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET!, callbackURL: '/api/auth/google/redirect' }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        try {
            const userExist = await User.findOne({ googleId: profile.id, authType: 'google' });

            if (userExist) {
                return done(null, { id: userExist._id, username: userExist.username, email: userExist.email, authType: userExist.authType });
            } else {
                const user = await User.create({ googleId: profile.id, username: profile.displayName, email: profile.emails[0].value, photo: profile.photos[0].value, isVerified: profile.emails[0].verified, authType: 'google' });
                return done(null, { id: user._id, username: user.username, email: user.email, authType: user.authType });
            }
        } catch(err) {
            return done(err);
        };
    }));

    // Sign in using Facebook account
    passport.use(new FacebookStrategy({ clientID: process.env.FACEBOOK_CLIENT_ID!, clientSecret: process.env.FACEBOOK_CLIENT_SECRET!, callbackURL: '/api/auth/facebook/redirect', profileFields: ['id', 'displayName', 'email', 'photos'] }, async (accessToken: any, refreshToken: any, profile: any, done: any) => { 
        try {
            const userExist = await User.findOne({ facebookId: profile.id, authType: 'facebook' });

            if (userExist) {
                return done(null, { id: userExist._id, username: userExist.username, email: userExist.email, authType: userExist.authType });
            } else {
                const user = await User.create({ facebookId: profile.id, username: profile.displayName, email: profile.emails[0].value, photo: profile.photos[0].value, isVerified: true, authType: 'facebook' });
                return done(null, { id: user._id, username: user.username, email: user.email, authType: user.authType });
            }
        } catch(err) {
            return done(err);
        };
    }));

    // Sign in using Twitter account
    passport.use(new TwitterStrategy({ consumerKey: process.env.TWITTER_CONSUMER_KEY!, consumerSecret: process.env.TWITTER_CONSUMER_SECRET!, callbackURL: '/api/auth/twitter/redirect', includeEmail: true }, async (token: any, tokenSecret: any, profile: any, done: any) => {
        try {
            const userExist = await User.findOne({ twitterId: profile.id, authType: 'twitter' });

            if (userExist) {
                return done(null, { id: userExist.id, username: userExist.username, email: userExist.email, authType: userExist.authType });
            } else {
                const user = await User.create({ twitterId: profile.id, username: profile.username, email: profile.emails[0].value , photo: profile.photos[0].value, bio: profile._json.description, isVerified: true, authType: 'twitter' });
                return done(null, { id: user._id, username: user.username, email: user.email, authType: user.authType });
            }
        } catch(err) {
            return done(err);
        }
    }))

    // Sign in using Github account
    passport.use(new GithubStrategy({ clientID: process.env.GITHUB_CLIENT_ID!, clientSecret: process.env.GITHUB_CLIENT_SECRET!, callbackURL: '/api/auth/github/redirect', scope: ['user:email'], }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        try {
            const userExist = await User.findOne({ githubId: profile.id, authType: 'github' });

            if (userExist) {
                return done(null, { id: userExist._id, username: userExist.username, email: userExist.email, authType: userExist.authType });
            } else {
                const user = await User.create({ githubId: profile.id, username: profile.displayName, email: profile.emails[0].value, photo: profile._json.avatar_url, bio: profile._json.bio, isVerified: true, authType: 'github' });
                return done(null, { id: user._id, username: user.username, email: user.email, authType: user.authType });
            }
        } catch(err) {
            return done(err);
        }
    }));

};

export default initializeAuth;