import { runCaJobankParser } from '../services/parsers/ca_jobbank.parser/main.ca_jobbank.js';
import { User } from '../databases/mongo/models/User.js';
import { readCompaniesEmails } from '../services/repositories/company.service.js';
export async function main(req, res, next) {
    try {
        const user = await User.findById('6439abd829be3fa7902c9359');
        if (user) {
            await runCaJobankParser('calgary', 'cleaner', user);
            const emails = await readCompaniesEmails(user);
            res.status(200).json(emails);
        }
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=main.controller.js.map