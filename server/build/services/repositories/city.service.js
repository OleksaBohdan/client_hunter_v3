import { City } from '../../databases/mongo/models/City.js';
import { User } from '../../databases/mongo/models/User.js';
import { mapCity } from '../../pkg/mappers/city.mapper.js';
export async function createCity(name, userId) {
    const user = await User.findById(userId);
    const city = await City.create({ city: name, user: user });
    return mapCity(city);
}
export async function readCities(id) {
    return await City.find({ user: id });
}
export async function readCity(id) {
    return await City.findById(id);
}
export async function deleteCity(userId, id) {
    await City.findByIdAndDelete(id);
    const user = await User.findById(userId);
    if ((user === null || user === void 0 ? void 0 : user.activeCity) == id) {
        user.activeCity = undefined;
        await user.save();
    }
}
export async function chooseCity(userId, cityId) {
    await User.findByIdAndUpdate(userId, { activeCity: cityId });
}
//# sourceMappingURL=city.service.js.map