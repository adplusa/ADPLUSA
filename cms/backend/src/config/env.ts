import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    region: string;
    cloudFrontUrl?: string;
  };
  sanity: {
    projectId: string;
    dataset: string;
    apiToken: string;
  };
  corsOrigin: string;
}

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
];

// Validate required environment variables
function validateEnv(): void {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
}

// Validate on module load
validateEnv();

export const config: EnvConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    bucketName: process.env.AWS_BUCKET_NAME || '',
    region: process.env.AWS_REGION || 'us-east-1',
    cloudFrontUrl: process.env.AWS_CLOUDFRONT_URL,
  },
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID || '',
    dataset: process.env.SANITY_DATASET || 'production',
    apiToken: process.env.SANITY_API_TOKEN || '',
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
