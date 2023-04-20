import mongoose, { Schema } from 'mongoose';
const ParserSchema = new Schema({
    name: { type: String, unique: true, required: true },
}, {
    timestamps: true,
});
export const Parser = mongoose.model('Parser', ParserSchema);
//# sourceMappingURL=Parser.js.map