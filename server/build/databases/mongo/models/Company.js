import mongoose, { Schema } from 'mongoose';
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
    email: { type: String },
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
export const Company = mongoose.model('Company', CompanySchema);
//# sourceMappingURL=Company.js.map