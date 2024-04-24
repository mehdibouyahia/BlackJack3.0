FROM node:latest
WORKDIR /app
COPY ./package.json /app/package.json
COPY ./vite.config.js /app/vite.config.js
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]