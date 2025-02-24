import mongoose, { Document, Schema } from "mongoose";
import { RoleType, Permissions, PermissionType, Roles } from "../enums/role.enum";
import { RolePermissions } from "../utils/role-permission";

export interface RoleDocument extends Document {
    name: RoleType;
    permissions: Array<PermissionType>;
}

const roleSchema = new Schema<RoleDocument>({
    name: { type: String, enum: Object.values(Roles), required: true, unique: true },
    permissions: {
        type: [String], required: true, enum: Object.values(Permissions), default: function (this: RoleDocument) {
            return RolePermissions[this.name];
        }
    },
}, { timestamps: true });

const RoleModel = mongoose.model<RoleDocument>("Role", roleSchema);
export default RoleModel;   
