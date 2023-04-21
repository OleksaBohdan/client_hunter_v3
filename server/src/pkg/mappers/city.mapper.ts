import { ICity } from '../../databases/mongo/models/City.js';

export function mapCity(city: ICity) {
  const mappedCity = {
    _id: city.id,
    city: city.city,
  };
  return mappedCity;
}
