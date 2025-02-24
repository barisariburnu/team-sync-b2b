import mongoose from "mongoose";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.mode";
import { NotFoundException } from "../utils/appError";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";

export const loginOrCreateAccountService = async (data: {
    provider: string,
    displayName: string,
    providerId: string,
    picture?: string,
    email?: string,
}) => {
    const { email, displayName, provider, providerId, picture } = data;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        console.log("Start session...");

        let user = await UserModel.findOne({ email }).session(session);
        if (!user) {
            // 1. Create user
            user = new UserModel({
                email,
                name: displayName,
                profilePicture: picture || null,
            });
            await user.save({ session });

            // 2. Create account
            const account = new AccountModel({
                user: user._id,
                provider: provider,
                providerId: providerId,
            });
            await account.save({ session });

            // 3. Create workspace
            const workspace = new WorkspaceModel({
                name: "My Workspace",
                description: `Workspace created for ${user.name}`,
                owner: user._id,
            });
            await workspace.save({ session });

            const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }).session(session);
            if (!ownerRole) {
                throw new NotFoundException("Resource Not Found Error");
            }

            const member = new MemberModel({
                user: user._id,
                workspace: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date(),
            });
            await member.save({ session });

            user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
            await user.save({ session });
        }

        await session.commitTransaction();
        session.endSession();
        console.log("End session...");
        return { user };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}