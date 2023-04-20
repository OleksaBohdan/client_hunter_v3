import mongoose, { Schema } from 'mongoose';
const KeywordSchema = new Schema({
    keyword: { type: String, unique: true, required: true },
    isActive: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});
KeywordSchema.index({ keyword: 1, user: 1 }, { unique: true });
export const Keyword = mongoose.model('Keyword', KeywordSchema);
//# sourceMappingURL=Keyword.js.map