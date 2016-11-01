FROM node:6
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

WORKDIR /opt/src

ADD . /opt/src

RUN npm install

CMD ["node", "./server/app.js"]
