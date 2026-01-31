# Docker & Redis for ADPL CMS

This guide explains the Redis configuration for the CMS backend, specifically how to use Redis locally while ensuring the production environment is correctly containerized.

## Summary of Changes

We have updated the Docker configurations to include a Redis service. This allows the application to connect to a Redis instance that runs alongside the backend API and MongoDB database within the Docker network.

### 1. Production (`docker-compose.prod.yml`)

- **Applies to**: Deployments (e.g., AWS EC2, DigitalOcean).
- **Service**: Added a `redis` service using the official `redis:7-alpine` image.
- **Networking**: The `backend` service is configured with `REDIS_HOST=redis` and `REDIS_PORT=6379`, allowing it to talk directly to the Redis container by its hostname.
- **Persistence**: A `redis_data` volume ensures cache persistence across restarts.

### 2. Local (`docker-compose.yml`)

- **Applies to**: Local development.
- **Service**: Added a `redis` service identical to production for parity.
- **Connection**:
    - **Inside Docker**: If you run the backend via Docker, it connects to the `redis` container.
    - **Local Machine**: Since you are running `npm run dev` on your host machine (Mac), the backend connects to `localhost:6379`.
    - **Config Logic**: The backend code (`src/config/redis.ts`) uses environment variables (`REDIS_HOST`, `REDIS_PORT`) but falls back to `127.0.0.1` and `6379`. This default fallback is exactly what your local setup needs to connect to your Mac's Redis instance.

## How to Use

### Local Development (Using Host Redis)

1. Ensure Redis is running on your Mac:

    ```bash
    redis-cli ping
    # Output: PONG
    ```

    If not running: `brew services start redis`

2. Run the backend normally:
    ```bash
    cd cms/backend
    npm run dev
    ```
    _The app will default to `127.0.0.1:6379`, connecting to your local Redis._

### Production Deployment (Using Docker Redis)

1. Build and run the containers:
    ```bash
    docker-compose -f cms/docker-compose.prod.yml up -d --build
    ```
2. The `backend` container will see the `REDIS_HOST` variable as `redis` and connect to the containerized Redis instance automatically.
