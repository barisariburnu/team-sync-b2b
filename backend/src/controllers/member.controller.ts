import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { z } from "zod";
import { HTTP_STATUS } from "../config/http.config";
import { joinWorkspaceByInvite } from "../services/member.service";
import { UnauthorizedException } from "../utils/appError";
import { ErrorCodeEnum } from "../enums/error-code.enum";

export const joinWorkspaceController = asyncHandler(async (req: Request, res: Response) => {
    const inviteCode = z.string().parse(req.params.inviteCode);
    const userId = req.user?._id;

    if (!userId) {
        throw new UnauthorizedException("User not found", ErrorCodeEnum.ACCESS_UNAUTHORIZED);
    }

    const { workspaceId, role } = await joinWorkspaceByInvite(userId, inviteCode);

    return res.status(HTTP_STATUS.OK).json({
        message: "Successfully joined workspace",
        workspaceId,
        role
    })
});