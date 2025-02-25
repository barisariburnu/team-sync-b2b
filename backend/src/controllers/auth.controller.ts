import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { HTTP_STATUS } from "../config/http.config";
import { registerUserService } from "../services/auth.service";
import passport from "passport";

// Google Login Callback
export const googleLoginCallback = asyncHandler(async (req: Request, res: Response) => {
    const currentWorkspace = req.user?.currentWorkspace;
    if (!currentWorkspace) {
        return res.redirect(
            `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
        );
    }

    return res.redirect(
        `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
    );
});

// Register User
export const registerUserController = asyncHandler(async (req: Request, res: Response) => {
    const body = registerSchema.parse({ ...req.body });

    const { userId, workspaceId } = await registerUserService(body);

    return res.status(HTTP_STATUS.CREATED).json({
        message: "User registered successfully",
        userId,
        workspaceId,
    });
});

// Login User
export const loginUserController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error | null, user: Express.User | false, info: { message: string | undefined }) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: info?.message || "Invalid email or password",
            });
        }

        req.login(user, (err) => {
            if (err) {
                return next(err);
            }

            return res.status(HTTP_STATUS.OK).json({
                message: "User logged in successfully",
                user,
            });
        });
    })(req, res, next);
});

export const logoutUserController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err) {
            console.error("Failed to logout user", err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: "Failed to logout user",
            });
        }
    });

    req.session = null;
    return res.status(HTTP_STATUS.OK).json({
        message: "User logged out successfully",
    });
});

