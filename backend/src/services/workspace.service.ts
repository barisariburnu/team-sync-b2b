import WorkspaceModel from "../models/workspace.mode";
import UserModel from "../models/user.model";
import { NotFoundException } from "../utils/appError";
import RoleModel from "../models/roles-permission.model";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import mongoose from "mongoose";

//********************************
// CREATE WORKSPACE SERVICE
//********************************
export const createWorkspaceService = async (userId: string, body: { name: string, description?: string | undefined }) => {
    const { name, description } = body;

    const user = await UserModel.findById(userId);

    if (!user) {
        throw new NotFoundException("User not found");
    }

    const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });

    if (!ownerRole) {
        throw new NotFoundException("Owner role not found");
    }

    const workspace = new WorkspaceModel({
        name: name,
        description: description,
        owner: user._id,
    });

    await workspace.save();

    const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
    });

    await member.save();

    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save();

    return {
        workspace,
    };
};

//********************************
// GET WORKSPACES USER IS A MEMBER
//********************************
export const getAllWorkpacesUserIsMemberService = async (userId: string) => {
    const memberships = await MemberModel.find({ userId: userId })
        .populate("workspaceId")
        .select("-password")
        .exec();

    // Extract workspaces from memberships
    const workspaces = memberships.map((membership) => membership.workspaceId);

    return {
        workspaces,
    }
}

//********************************
// GET WORKSPACE BY ID
//********************************
export const getWorkspaceByIdService = async (workspaceId: string) => {
    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
        throw new NotFoundException("Workspace not found");
    }

    const members = await MemberModel.find({ workspaceId }).populate("role");

    const workspaceWithMembers = {
        ...workspace.toObject(),
        members,
    }

    return {
        workspace: workspaceWithMembers,
    }
}

//********************************
// GET ALL MEMBERS IN WORKSPACE
//********************************
export const getWorkspaceMembersService = async (workspaceId: string) => {
    // Fetch all members in the workspace

    const members = await MemberModel
        .find({ workspaceId })
        .populate("userId", "name email profilePicture -password")
        .populate("role", "name");

    const roles = await RoleModel
        .find({}, { name: 1, _id: 1 })
        .select("-permissions")
        .lean();

    return {
        members,
        roles,
    }
}