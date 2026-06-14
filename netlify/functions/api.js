import serverless from 'serverless-http';
import app from '../../functions/src/app.js';

export const handler = serverless(app);
