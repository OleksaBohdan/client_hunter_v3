import HttpError from 'http-errors';
import { User } from '../databases/mongo/models/User.js';
import { Parser } from '../databases/mongo/models/Parser.js';
import { runCaJobankParser } from '../services/parsers/ca_jobbank.parser/main.ca_jobbank.js';
import { runXingParser } from '../services/parsers/de_xing.parser/main.de_xing.js';
import { runLinkedinParser } from '../services/parsers/linkedin.parser/main.linkedin.parser.js';
export const stopFlags = new Map();
export async function startParser(req, res, next) {
    try {
        const id = req.userId;
        if (!id) {
            throw HttpError(401, 'Unauthorized');
        }
        const user = await User.findById(req.userId).populate('activeCity').populate('activeKeyword');
        if (!user) {
            throw HttpError(404, 'User does not exist');
        }
        const parser = await Parser.findById(user.parser);
        if (!parser) {
            throw HttpError(404, 'Choose website to parse');
        }
        if (stopFlags.get(id) == false) {
            res.status(403).json({ message: 'Parser alreay run' });
            return;
        }
        const position = user.activeKeyword ? user.activeKeyword.keyword : '';
        if (position == '') {
            res.status(403).json({ message: 'Choose Keyword to parse' });
            return;
        }
        const city = user.activeCity ? user.activeCity.city : '';
        if (city == '') {
            res.status(403).json({ message: 'Choose city to parse' });
            return;
        }
        switch (parser.name) {
            case 'jobbank.gc.ca':
                res.status(200).json({ message: 'Parser started succesfully' });
                try {
                    await runCaJobankParser(user, city, position);
                }
                catch (err) {
                    stopFlags.set(id, true);
                }
                break;
            case 'xing.com':
                res.status(200).json({ message: 'Parser started succesfully' });
                try {
                    await runXingParser(user, city, position);
                }
                catch (err) {
                    stopFlags.set(id, true);
                }
                break;
            case 'linkedin.com':
                res.status(200).json({ message: 'Parser started succesfully' });
                await runLinkedinParser();
                console.log('running linkedin.com');
                break;
        }
    }
    catch (err) {
        next(err);
    }
}
export async function stopParser(req, res, next) {
    try {
        const id = req.userId;
        if (!id) {
            throw HttpError(401, 'Unauthorized');
        }
        stopFlags.set(id, true);
        res.status(200).json({ message: 'Parser stop requested.' });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=startParser.controller.js.map