import "dotenv/config";
import mongoose from "mongoose";
import connectToDatabase from "../config/database.config";
import RoleModel from "../models/roles-permission.model";
import { RolePermissions } from "../utils/role-permission";

const seedRoles = async () => {
    console.log("Seeding roles started...");

    try {
        await connectToDatabase();

        const session = await mongoose.startSession();
        session.startTransaction();

        console.log("Clearing existing roles...");
        await RoleModel.deleteMany({}, { session });

        for (const roleName in RolePermissions) {
            const role = roleName as keyof typeof RolePermissions;
            const permissions = RolePermissions[role];

            // Check if the role already exists
            const existingRole = await RoleModel.findOne({ name: role }).session(session);
            if (!existingRole) {
                const newRole = new RoleModel({ name: role, permissions });
                await newRole.save({ session });
                console.log(`Role ${role} created successfully`);
            } else {
                console.log(`Role ${role} already exists`);
            }
        }

        await session.commitTransaction();
        console.log("Transaction committed successfully");

        session.endSession();
        console.log("Session ended");

        console.log("Roles seeding completed successfully");
    } catch (error) {
        console.error("Error seeding roles:", error);
        throw error;
    }
};

seedRoles().catch((error) => {
    console.error("Error running seed script:", error);
});
