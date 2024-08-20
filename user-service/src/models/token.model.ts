import mongoose, { Schema, Document } from 'mongoose';
import toIdPlugin from './plugin/toIdPlugin';

export interface IToken extends Document {
  accessToken: string;
  refreshToken: string;
  refreshSecret: string;
  accessSecret: string;
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  lastUsedAt: Date;
  expiresAt: Date; // Expiry time for the refreshToken
  revoked: boolean; // Indicates if the token has been revoked
  isExpiredOrRevoked(): boolean; // Custom method to check expiration/revocation
  extendExpiry(days: number): void; // Custom method to extend token expiry
}

const TokenSchema: Schema<IToken> = new Schema({
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  refreshSecret: { type: String, required: true },
  accessSecret: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  lastUsedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }, // Expiry time for the refreshToken
  revoked: { type: Boolean, default: false }, // Indicates if the token has been revoked
});

// Apply the `toIdPlugin` to the schema
TokenSchema.plugin(toIdPlugin);

// Define the custom method to check if the token is expired or revoked
TokenSchema.methods.isExpiredOrRevoked = function (): boolean {
  return this.revoked || Date.now() > this.expiresAt.getTime();
};

// Define the custom method to extend the token's expiry
TokenSchema.methods.extendExpiry = function (days: number): void {
  this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

export const Token = mongoose.model<IToken>('Token', TokenSchema);
