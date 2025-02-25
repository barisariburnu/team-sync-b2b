import mongoose from "mongoose";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.mode";
import { NotFoundException, BadRequestException, UnauthorizedException } from "../utils/appError";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import { ProviderEnum } from "../enums/account-provider.enum";

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
                userId: user._id,
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

            // 4. Create a default role for the new user
            const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }).session(session);
            if (!ownerRole) {
                throw new NotFoundException("Owner role not found");
            }

            // 5. Create a member for the new user in the default workspace
            const member = new MemberModel({
                userId: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date(),
            });
            await member.save({ session });

            // 6. Set the default workspace as the current workspace for the user
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

export const registerUserService = async (body: {
    name: string,
    email: string,
    password: string,
}) => {
    const { name, email, password } = body;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        console.log("Start session...");

        const existingUser = await UserModel.findOne({ email }).session(session);
        if (existingUser) {
            throw new BadRequestException("Email already exists");
        }

        // 1. Create user
        const user = new UserModel({
            name,
            email,
            password,
        });
        await user.save({ session });

        // 2. Create account
        const account = new AccountModel({
            userId: user._id,
            provider: ProviderEnum.EMAIL,
            providerId: email,
        });
        await account.save({ session });

        // 3. Create a default workspace for the new user
        const workspace = new WorkspaceModel({
            name: "My Workspace",
            description: `Workspace created for ${user.name}`,
            owner: user._id,
        });
        await workspace.save({ session });

        // 4. Create a default role for the new user
        const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }).session(session);
        if (!ownerRole) {
            throw new NotFoundException("Owner role not found");
        }

        // 5. Create a member for the new user in the default workspace
        const member = new MemberModel({
            userId: user._id,
            workspaceId: workspace._id,
            role: ownerRole._id,
            joinedAt: new Date(),
        });
        await member.save({ session });

        // 6. Set the default workspace as the current workspace for the user
        user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();
        console.log("End session...");

        return {
            userId: user._id,
            workspaceId: workspace._id
        };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

export const verifyUserService = async ({
    email,
    password,
    provider = ProviderEnum.EMAIL,
}: {
    email: string,
    password: string,
    provider?: string,
}) => {
    const account = await AccountModel.findOne({
        provider,
        providerId: email,
    });
    if (!account) {
        throw new NotFoundException("Invalid email or password");
    }

    const user = await UserModel.findById(account.userId);
    if (!user) {
        throw new NotFoundException("User not found for the given account");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new UnauthorizedException("Invalid email or password");
    }

    return user.omitPassword();
}