import mongoose, { Schema } from 'mongoose';
const BlackIndustrySchema = new Schema({
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});
BlackIndustrySchema.index({ name: 1, user: 1 }, { unique: true });
export const BlackIndustry = mongoose.model('BlackIndustry', BlackIndustrySchema);
//# sourceMappingURL=BlackIndustry.js.map