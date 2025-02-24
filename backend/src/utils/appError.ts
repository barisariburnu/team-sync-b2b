import { HTTP_STATUS, HttpStatusCodeType } from "../config/http.config";
import { ErrorCodeEnum, ErrorCodeEnumType } from "../enums/error-code.enum";

export class AppError extends Error {
    public statusCode: HttpStatusCodeType;
    public errorCode?: ErrorCodeEnumType;

    constructor(
        message: string,
        statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
        errorCode?: ErrorCodeEnumType
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class HttpException extends AppError {
    constructor(
        message: string = "Http Exception Error",
        statusCode: HttpStatusCodeType,
        errorCode?: ErrorCodeEnumType
    ) {
        super(message, statusCode, errorCode);
    }
}

export class InternalServerError extends AppError {
    constructor(
        message: string = "Internal Server Error",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            message,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR
        );
    }
}

export class NotFoundException extends AppError {
    constructor(
        message: string = "Resource Not Found Error",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            message,
            HTTP_STATUS.NOT_FOUND,
            errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND
        );
    }
}

export class BadRequestError extends AppError {
    constructor(
        message: string = "Bad Request Error",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            message,
            HTTP_STATUS.BAD_REQUEST,
            errorCode || ErrorCodeEnum.VALIDATION_ERROR);
    }
}

export class UnauthorizedError extends AppError {
    constructor(
        message: string = "Unauthorized Error",
        errorCode?: ErrorCodeEnumType
    ) {
        super(
            message,
            HTTP_STATUS.UNAUTHORIZED,
            errorCode || ErrorCodeEnum.AUTH_UNAUTHORIZED
        );
    }
}
