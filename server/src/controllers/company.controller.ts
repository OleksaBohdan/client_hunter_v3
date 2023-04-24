import { Request, Response, NextFunction } from 'express';
import HttpError from 'http-errors';
import { readAllCompanies } from '../services/repositories/company.service.js';
import { readUserById } from '../services/repositories/user.service.js';
import { ICompany, Status } from '../databases/mongo/models/Company.js';
import { IUser } from '../databases/mongo/models/User.js';

export async function readCompanies(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    const user = await readUserById(id);

    if (!user) {
      throw HttpError(404, 'User does not exist');
    }

    const allCompanies = await readAllCompanies(user);

    const companiesListCount = countCompaniesByStatus(allCompanies, user);

    res.status(200).json({ companiesListCount, message: 'ok' });
  } catch (err) {
    next(err);
  }
}

function countCompaniesByStatus(companies: ICompany[], user: IUser) {
  const companiesCount = {
    all: {
      count: companies.length,
      percent: 100,
    },
    white: {
      count: 0,
      percent: 0,
    },
    grey: {
      count: 0,
      percent: 0,
    },
    black: {
      count: 0,
      percent: 0,
    },
    request: {
      count: 0,
      percent: 0,
    },
    process: {
      count: 0,
      percent: 0,
    },
    reject: {
      count: 0,
      percent: 0,
    },
    success: {
      count: 0,
      percent: 0,
    },
  } as { [key: string]: { count: number; percent: number } };

  companies.forEach((company: ICompany) => {
    if (company.user.toString() !== user._id.toString()) {
      return;
    }

    switch (company.status) {
      case Status.WHITE:
        companiesCount.white.count++;
        break;
      case Status.GREY:
        companiesCount.grey.count++;
        break;
      case Status.BLACK:
        companiesCount.black.count++;
        break;
      case Status.REQUEST:
        companiesCount.request.count++;
        break;
      case Status.PROCESS:
        companiesCount.process.count++;
        break;
      case Status.REJECT:
        companiesCount.reject.count++;
        break;
      case Status.SUCCESS:
        companiesCount.success.count++;
        break;
    }
  });

  Object.keys(companiesCount).forEach((key) => {
    if (key !== 'all') {
      companiesCount[key].percent = Math.round((companiesCount[key].count / companiesCount.all.count) * 10000) / 100;
    }
  });

  return companiesCount;
}
