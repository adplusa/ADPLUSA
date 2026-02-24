import serverlessExpress from '@vendia/serverless-express';
import app from './app';

let serverlessExpressInstance: any;

async function setup() {
  const { dbConnection } = await import('./database/connection');
  await dbConnection.connect();
  return serverlessExpress({ app });
}

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!serverlessExpressInstance) {
    serverlessExpressInstance = await setup();
  }
  return serverlessExpressInstance(event, context);
};
