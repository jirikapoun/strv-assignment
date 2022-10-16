FROM node:16.16.0 as base

# Add package file
COPY package.json ./
COPY yarn.lock ./

# Install deps
RUN yarn install

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY tsconfig.production.json ./tsconfig.production.json
COPY package.json ./package.json

# Build dist
RUN yarn build:prod

# Start production image build
FROM gcr.io/distroless/nodejs:16

# Copy node modules and build directory
COPY --from=base ./node_modules ./node_modules
COPY --from=base /dist /dist
COPY .env ./.env

# Expose port 3000
EXPOSE 3000
CMD ["dist/src/index.js"]
