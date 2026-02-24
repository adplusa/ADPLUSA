const mockServerlessExpressHandler = jest.fn().mockResolvedValue({ statusCode: 200, body: 'ok' });
const mockServerlessExpress = jest.fn().mockReturnValue(mockServerlessExpressHandler);
const mockConnect = jest.fn().mockResolvedValue(undefined);

jest.mock('@vendia/serverless-express', () => ({
  __esModule: true,
  default: mockServerlessExpress,
}));

jest.mock('./database/connection', () => ({
  dbConnection: {
    connect: mockConnect,
  },
}));

jest.mock('./app', () => ({
  __esModule: true,
  default: { use: jest.fn() },
}));

describe('Lambda Handler', () => {
  beforeEach(() => {
    jest.resetModules();
    mockConnect.mockClear();
    mockServerlessExpress.mockClear();
    mockServerlessExpressHandler.mockClear();
  });

  it('should set callbackWaitsForEmptyEventLoop to false', async () => {
    const { handler } = require('./lambda');
    const context = { callbackWaitsForEmptyEventLoop: true };
    const event = { httpMethod: 'GET', path: '/health' };

    await handler(event, context);

    expect(context.callbackWaitsForEmptyEventLoop).toBe(false);
  });

  it('should initialize DB connection on cold start', async () => {
    const { handler } = require('./lambda');
    const context = { callbackWaitsForEmptyEventLoop: true };
    const event = { httpMethod: 'GET', path: '/health' };

    await handler(event, context);

    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  it('should create serverless-express instance wrapping the app', async () => {
    const { handler } = require('./lambda');
    const context = { callbackWaitsForEmptyEventLoop: true };
    const event = { httpMethod: 'GET', path: '/' };

    await handler(event, context);

    expect(mockServerlessExpress).toHaveBeenCalledWith(
      expect.objectContaining({ app: expect.anything() })
    );
  });

  it('should reuse serverless-express instance on warm invocations', async () => {
    const { handler } = require('./lambda');
    const context1 = { callbackWaitsForEmptyEventLoop: true };
    const context2 = { callbackWaitsForEmptyEventLoop: true };
    const event = { httpMethod: 'GET', path: '/health' };

    await handler(event, context1);
    await handler(event, context2);

    // serverlessExpress factory should only be called once (cold start)
    expect(mockServerlessExpress).toHaveBeenCalledTimes(1);
    // DB connect should only be called once (cold start)
    expect(mockConnect).toHaveBeenCalledTimes(1);
    // But the handler should be invoked twice
    expect(mockServerlessExpressHandler).toHaveBeenCalledTimes(2);
  });

  it('should pass event and context to serverless-express handler', async () => {
    const { handler } = require('./lambda');
    const context = { callbackWaitsForEmptyEventLoop: true };
    const event = { httpMethod: 'POST', path: '/api/auth/login', body: '{}' };

    await handler(event, context);

    expect(mockServerlessExpressHandler).toHaveBeenCalledWith(event, context);
  });
});
