import { Request, Response, NextFunction } from 'express';
import HttpError from 'http-errors';
import {
  createCity as writeCity,
  readCities as getCities,
  readCity as getCity,
  deleteCity,
  chooseCity as chooseActiveCity,
} from '../services/repositories/city.service.js';

export async function createCity(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;
    const { city } = req.body;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    if (!city) {
      throw HttpError(400, 'Client error. City cannot be empty.');
    }

    const newCity = await writeCity(city, id);

    res.status(201).json({ newCity, message: 'Success' });
  } catch (err) {
    next(err);
  }
}

export async function readCities(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    const cities = await getCities(id);

    res.status(200).json({ cities, message: 'Success' });
  } catch (err) {
    next(err);
  }
}

export async function deleteCityById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;
    const cityId = req.params.id;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    if (!cityId) {
      throw HttpError(400, 'Client error. Keyword not set. Try again later...');
    }

    await deleteCity(id, cityId);

    res.status(204).json({ message: 'City deleted succesfully' });
  } catch (err) {
    next(err);
  }
}

export async function chooseCity(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.userId;
    const { cityId } = req.body;

    if (!id) {
      throw HttpError(401, 'Unauthorized');
    }

    if (!cityId) {
      throw HttpError(400, 'Client error. Choosen city does not exist. Try again later...');
    }

    const city = await getCity(cityId);

    if (!city) {
      throw HttpError(500, 'Server error. Choosen city does not exist. Try again later... ');
    }

    await chooseActiveCity(id, cityId);

    res.status(204).json({ message: 'City choosen succesfully' });
  } catch (err) {
    next(err);
  }
}
