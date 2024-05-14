FROM node:latest

WORKDIR /jasper

COPY package.json ./
COPY prisma ./

RUN npm install --omit-dev
RUN npx prisma generate

COPY  . .

# Ensure the entrypoint script is executable
RUN chmod +x ./entrypoint.sh

CMD ["./entrypoint.sh"]
