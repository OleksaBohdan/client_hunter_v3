import { IBlackIndustry } from '../../databases/mongo/models/BlackIndustry.js';

export function mapBlackIndustry(blackIndustry: IBlackIndustry) {
  const mappedBlackIndustry = {
    _id: blackIndustry.id,
    name: blackIndustry.name,
  };
  return mappedBlackIndustry;
}
