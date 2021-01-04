# Base
FROM node:14.15.3-alpine3.12 AS base
WORKDIR /usr/src/app

# Release
FROM node:14.15.3-alpine3.12 AS release
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force
COPY . .
