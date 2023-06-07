import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
export var Status;
(function (Status) {
    Status["WHITE"] = "white";
    Status["GREY"] = "grey";
    Status["BLACK"] = "black";
    Status["REQUEST"] = "request";
    Status["PROCESS"] = "process";
    Status["REJECT"] = "reject";
    Status["SUCCESS"] = "success";
})(Status = Status || (Status = {}));
const CompanySchema = new Schema({
    note: { type: String, default: '' },
    positionKeyword: { type: String, default: '' },
    placeKeyword: { type: String, default: '' },
    mailFrom: { type: String },
    email: { type: String, default: () => uuidv4() },
    phone: { type: String },
    name: { type: String },
    website: { type: String },
    vacancyLink: { type: String },
    additionalInfo: { type: String },
    industry: { type: String },
    vacancyTitle: { type: String },
    address: { type: String },
    size: { type: Number },
    turnover: { type: Number },
    vacancyDate: { type: Date },
    status: { type: String, enum: Object.values(Status), required: true, default: Status.WHITE },
    vacancyParsedDate: { type: Date, required: true, default: Date.now() },
    sentEmails: [{ type: Schema.Types.ObjectId, ref: 'Email' }],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
CompanySchema.index({ email: 1, user: 1 }, { unique: true });
CompanySchema.index({ name: 1, user: 1 }, { unique: true });
CompanySchema.pre('save', function (next) {
    if (this.isNew) {
        const emailIsUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(this.email);
        if (emailIsUuid) {
            this.status = Status.GREY;
        }
    }
    next();
});
export const Company = mongoose.model('Company', CompanySchema);
//# sourceMappingURL=Company.js.map