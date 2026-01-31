# 🚀 Self-Hosted Redis Deployment Guide

This guide details how to securely expose your self-hosted Redis user (running on AWS EC2, DigitalOcean, or similar) so that your **Next.js frontend hosted on Vercel** can connect to it, while your Backend (running on the same VPS) communicates with it locally.

---

## ⚠️ Critical Security Warning

Exposing a database port (`6379`) to the public internet carries risks.

1.  **YOU MUST SET A STRONG PASSWORD.** Without one, your server will be compromised in minutes.
2.  **Firewalling is Key.** If possible, restrict access to only Vercel IPs (though these change dynamically) or your own IP logic.

---

## Step 1: Secure & Configure Redis in Docker

Modify your `cms/docker-compose.yml` file to enable password authentication and expose the port.

### Update `cms/docker-compose.yml`

Locate the `redis` service block and update it as follows:

```yaml
redis:
    image: redis:7-alpine
    container_name: architect-cms-redis
    restart: unless-stopped
    # Expose port (HostPort:ContainerPort)
    ports:
        - "6379:6379"
    # 1. Enable password (requirepass)
    command: redis-server --requirepass "YourSuperStrongUniquePasswordSince1995" --appendonly yes
    volumes:
        - redis_data:/data
    networks:
        - cms-network
    healthcheck:
        # Update healthcheck to use password
        test:
            [
                "CMD",
                "redis-cli",
                "-a",
                "YourSuperStrongUniquePasswordSince1995",
                "ping",
            ]
        interval: 10s
        timeout: 5s
        retries: 3
```

> **Note:** Replace `"YourSuperStrongUniquePasswordSince1995"` with a generated secure string.

---

## Step 2: Configure Backend Service

Your Backend service (in `cms/backend`) is likely running on the same machine. It needs to know the password now.

### Update `cms/docker-compose.yml` (Backend Service)

Update the `environment` section of your `backend` service:

```yaml
backend:
    # ... other config
    environment:
        # ... existing envs
        - REDIS_HOST=redis
        - REDIS_PORT=6379
        # Add the password here
        - REDIS_PASSWORD=YourSuperStrongUniquePasswordSince1995
```

---

## Step 3: Configure AWS / VPS Firewall (Security Groups)

You must allow incoming traffic on port `6379` so Vercel can reach it.

### For AWS EC2 (Security Groups)

1.  Go to the **EC2 Dashboard** > **Security Groups**.
2.  Select the Security Group attached to your instance.
3.  **Edit Inbound Rules**.
4.  Add Rule:
    - **Type:** Custom TCP
    - **Port:** `6379`
    - **Source:** `0.0.0.0/0` (Anywhere) — _Required for Vercel unless using advanced VPC peering._

### For VPS (UFW / iptables)

If using Ubuntu `ufw`:

```bash
sudo ufw allow 6379/tcp
sudo ufw reload
```

---

## Step 4: Configure Vercel (Next.js Frontend)

Now that your Redis is public (but password protected), tell Vercel how to find it.

1.  Go to your **Vercel Project Settings** > **Environment Variables**.
2.  Add the following variables:

| Variable Key     | Value                                    | Description                        |
| ---------------- | ---------------------------------------- | ---------------------------------- |
| `REDIS_HOST`     | `123.45.67.89`                           | The **Public IP** of your VPS/EC2. |
| `REDIS_PORT`     | `6379`                                   | The exposed port.                  |
| `REDIS_PASSWORD` | `YourSuperStrongUniquePasswordSince1995` | The password set in Step 1.        |

> **Verify:** Ensure `src/lib/redis.ts` in your Next.js app is using these env vars (it currently logs `host` and `port` from process.env). You may need to ensure it processes `REDIS_PASSWORD` as well (see Step 5).

---

## Step 5: Verify Application Files

Ensure your code is actually reading the `REDIS_PASSWORD` variable.

### 1. Frontend (`src/lib/redis.ts`)

Make sure your configuration object includes the password:

```typescript
const redisConfig = {
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    host: process.env.REDIS_HOST || "127.0.0.1",
    password: process.env.REDIS_PASSWORD || undefined, // Ensure this line exists!
    // ...
};
```

### 2. Backend (`cms/backend/src/config/redis.ts`)

Ensure the backend config also reads it:

```typescript
const redisConfig = {
    // ...
    password: process.env.REDIS_PASSWORD || undefined,
    // ...
};
```

---

## Step 6: Deploy & Test

1. **Deploy VPS:** SSH into your server and run:

```bash
docker-compose down
docker-compose up -d --build
```

2. **Test Connection:** locally or from another terminal:

```bash
redis-cli -h YOUR_VPS_IP -p 6379 -a YourSuperStrongUniquePasswordSince1995 ping
# Should return "PONG"
```

3. **Deploy Vercel:** Push your changes to GitHub to trigger a Vercel build. Check the build logs. If Redis connection fails during build (SSG), it should now gracefully fallback to DB (thanks to our recent fix), but for runtime performance, it should connect successfully.

## Troubleshooting

- **Connection Refused:** Check AWS Security Groups / Firewall again. Is port 6379 open?
- **Authentication Failed:** Double-check the password in `docker-compose.yml` matches the Vercel Env Var.
- **Latency:** Since Vercel and your VPS are in different regions, there might be latency. Try to host your VPS in the same region as your Vercel functions (e.g., `us-east-1`).
