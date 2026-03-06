# Backend Redeployment Instructions

## Current Status
- ❌ Lambda function deleted
- ❌ CloudFormation stack deleted
- ❌ API endpoint broken (times out)

## To Redeploy:

### Step 1: Set AWS Profile
```bash
export AWS_PROFILE=sapphire
```

### Step 2: Build Backend
```bash
cd cms/backend
npm install
npm run build:lambda
```

### Step 3: Build SAM
```bash
sam build
```

### Step 4: Deploy SAM
```bash
sam deploy --guided
```

When prompted:
- **Stack Name**: `cms-backend-api`
- **Region**: `us-east-2`
- **Confirm changes before deploy**: `y`
- **Allow SAM CLI IAM role creation**: `y`
- **Save parameters to samconfig.toml**: `y`

### Step 5: Verify Deployment
```bash
curl https://szlvt92np8.execute-api.us-east-1.amazonaws.com/health
```

Should return:
```json
{
  "success": true,
  "message": "API is running",
  "database": {
    "connected": true
  }
}
```

## Environment Variables Needed
Make sure these are set in Lambda:
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `AWS_REGION` - us-east-1
- `S3_BUCKET` - cms-media-prod-606876784342
- `CLOUDFRONT_DOMAIN` - d33bb8xwyugywj.cloudfront.net

## If Deploy Fails
1. Check AWS credentials: `aws sts get-caller-identity`
2. Check region: `echo $AWS_REGION`
3. Check SAM config: `cat cms/backend/samconfig.toml`
