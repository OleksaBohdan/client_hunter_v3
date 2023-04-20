import { IKeyword } from '../../databases/mongo/models/Keyword.js';

export function mapKeyword(keyword: IKeyword) {
  const mappedKeyword = {
    _id: keyword.id,
    keyword: keyword.keyword,
  };
  return mappedKeyword;
}
