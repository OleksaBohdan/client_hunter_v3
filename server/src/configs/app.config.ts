export const PORT: number = parseInt(process.env.PORT || '3001', 10);
export const MONGODB_URL: string = process.env.MONGODB_URL || 'mongodb://localhost:27017/dev_client-hunter-v3-2';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'dev_JWT_SECRET';
export const PARSER_NAMES: string[] = ['jobbank.gc.ca', 'xing.com', 'startupverband.de', 'linkedin.com'];
