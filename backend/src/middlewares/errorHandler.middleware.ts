import { ErrorRequestHandler } from "express";
import { HTTP_STATUS } from "../config/http.config";
import { AppError } from "../utils/appError";

export const errorHandler: ErrorRequestHandler = (err, req, res, next): any => {
    console.log(`Error occurred on PATH: ${req.path}`, err);

    if (err instanceof SyntaxError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Invalid JSON payload. Please check your request body.",
            error: err?.message || "Invalid JSON payload",
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            error: err.errorCode,
        });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error",
        error: err?.message || "Unknown error occurred",
    });
};

