const env = process.env.NODE_ENV;
const isProduction = env === 'production';

const baseHost = isProduction ? 'slippichat.net' : '127.0.0.1:4000';

export const baseWS = `ws${isProduction ? 's' : ''}://${baseHost}`;
export const baseHTTP = `http${isProduction ? 's' : ''}://${baseHost}`;
