import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import cookieParser from 'cookie-parser';
import passport from "passport";
import path from "path";

const app = express();

// .env Config
require("dotenv").config();

// db Config
import connectDB from "./config/db";
connectDB();

// Passport Config
import initializeAuth from "./config/passport";
initializeAuth(passport);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CORS_ORIGIN!, credentials: true }));
app.set("trust proxy", 1);
app.use(session({ secret: process.env.SESSION_SECRET! , resave: true, saveUninitialized: true, cookie: { maxAge: 60 * 60 * 1000, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production' } }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Routes
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

// Serve frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req: express.Request, res: express.Response) => res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));