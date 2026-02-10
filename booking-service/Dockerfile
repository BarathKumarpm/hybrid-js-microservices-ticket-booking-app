FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
# Push schema to DB (Simplified for demo, ideally do this in CI or init container)
# ENV DATABASE_URL="postgres://admin:password@postgres:5432/bookings_db"
# RUN bunx drizzle-kit push 

CMD ["bun", "src/index.ts"]