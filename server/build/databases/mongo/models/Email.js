import mongoose, { Schema } from 'mongoose';
const EmailSchema = new Schema({
    title: { type: String },
    content: { type: String, required: true },
    companies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
export const Email = mongoose.model('Email', EmailSchema);
//# sourceMappingURL=Email.js.map