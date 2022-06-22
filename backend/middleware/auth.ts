import express from "express";

interface Request extends express.Request {
    isAuthenticated: () => boolean;
};

const isAuthenticated = (req: Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.status(401).json({ success: false, error: 'Not authorized to access this route' });
};

export default isAuthenticated;