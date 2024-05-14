#!/bin/sh

# Run database migrations
npx prisma db push

# Start the application
npm run start
