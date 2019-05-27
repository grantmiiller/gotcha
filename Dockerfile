FROM node:10-alpine

COPY ./app /usr/src/app
WORKDIR /usr/src/app
EXPOSE 4000
CMD [ "npm", "start"]