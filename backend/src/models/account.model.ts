import mongoose, { Document, Schema } from "mongoose";
import { ProviderEnum, ProviderEnumType } from "../enums/account-provider.enum";

export interface AccountDocument extends Document {
    provider: ProviderEnumType;
    providerId: string; // Store the email, google id, github id, etc.
    userId: mongoose.Types.ObjectId;
    refreshToken: string | null;
    tokenExpiry: Date | null;
    createdAt: Date;
}

export const accountSchema = new Schema<AccountDocument>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, enum: Object.values(ProviderEnum), required: true },
    providerId: { type: String, required: true, unique: true },
    refreshToken: { type: String, default: null },
    tokenExpiry: { type: Date, default: null },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.refreshToken;
        }
    },
});

export const AccountModel = mongoose.model<AccountDocument>("Account", accountSchema);
export default AccountModel;

