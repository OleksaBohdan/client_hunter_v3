import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true, unique: true },
    companies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
    activeKeyword: { type: Schema.Types.ObjectId, ref: 'Keyword' },
    activeCity: { type: Schema.Types.ObjectId, ref: 'City' },
    blackIndustry: [{ type: Schema.Types.ObjectId, ref: 'BlackIndustry' }],
    parser: { type: Schema.Types.ObjectId, ref: 'Parser' },
}, { timestamps: true });
export const User = mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map