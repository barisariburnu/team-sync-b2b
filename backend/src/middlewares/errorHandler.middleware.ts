import { ErrorRequestHandler, Response } from "express";
import { HTTP_STATUS } from "../config/http.config";
import { AppError } from "../utils/appError";
import { z, ZodError } from "zod";
import { ErrorCodeEnum } from "../enums/error-code.enum";

const formatZodError = (res: Response, err: z.ZodError) => {
    const errors = err?.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
    }));

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Validation error",
        errors,
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    });
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next): any => {
    console.log(`Error occurred on PATH: ${req.path}`, err);

    if (err instanceof SyntaxError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Invalid JSON payload. Please check your request body.",
            error: err?.message || "Invalid JSON payload",
        });
    }

    if (err instanceof ZodError) {
        return formatZodError(res, err);
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

