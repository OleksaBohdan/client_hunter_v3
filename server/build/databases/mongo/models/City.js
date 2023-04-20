import mongoose, { Schema } from 'mongoose';
const CitySchema = new Schema({
    city: { type: String, unique: true, required: true },
    isActive: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});
CitySchema.index({ city: 1, user: 1 }, { unique: true });
export const City = mongoose.model('City', CitySchema);
//# sourceMappingURL=City.js.map