import { City } from '../../databases/mongo/models/City.js';
import { User } from '../../databases/mongo/models/User.js';
import { mapCity } from '../../pkg/mappers/city.mapper.js';

export async function createCity(name: string, userId: string) {
  const user = await User.findById(userId);
  const city = await City.create({ city: name, user: user });
  return mapCity(city);
}

export async function readCities(id: string) {
  return await City.find({ user: id });
}

export async function readCity(id: string) {
  return await City.findById(id);
}

export async function deleteCity(userId: string, id: string) {
  await City.findByIdAndDelete(id);
  const user = await User.findById(userId);
  if (user?.activeCity == id) {
    user.activeCity = undefined;
    await user.save();
  }
}

export async function chooseCity(userId: string, cityId: string) {
  await User.findByIdAndUpdate(userId, { activeCity: cityId });
}
