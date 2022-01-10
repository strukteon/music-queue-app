FROM node:14-alpine

EXPOSE 80

COPY backend /usr/app/backend
WORKDIR /usr/app/backend
RUN npm i

COPY frontend /usr/app/frontend
WORKDIR /usr/app/frontend
RUN npm i
RUN npm run build

WORKDIR /usr/app/backend

CMD ["npm", "run", "start"]