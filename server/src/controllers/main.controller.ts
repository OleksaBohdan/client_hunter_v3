import { Request, Response, NextFunction } from 'express';
import { runCaJobankParser } from '../services/parsers/ca_jobbank.parser/main.ca_jobbank.js';
import { createUser } from '../services/repositories/user.service.js';
import { IUser, User } from '../databases/mongo/models/User.js';
import { ICompany, Company } from '../databases/mongo/models/Company.js';

export async function main(req: Request, res: Response, next: NextFunction) {
  try {
    // const newUser: IUser = new User({
    //   name: 'John Doe',
    //   email: 'john.doe2@example.com' + Math.random(),
    //   passwordHash: 'hashed2_password' + Math.random(), // Replace with the actual hashed password
    // });

    // const user = await createUser(newUser);

    const user = await User.findById('6439a5f4e7cfc8a156771526');

    if (user) {
      await runCaJobankParser('calgary', 'cleaner', user);
      res.status(200).json(user);
    }
  } catch (err) {
    next(err);
  }
}
