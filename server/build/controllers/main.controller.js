import { runCaJobankParser } from '../services/parsers/ca_jobbank.parser/main.ca_jobbank.js';
export async function main(req, res, next) {
    try {
        await runCaJobankParser('calgary', 'developer');
        res.status(200).json({ message: 'hello client hunter v3!' });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=main.controller.js.map