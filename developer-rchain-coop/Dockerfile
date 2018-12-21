FROM node:11
ENV NODE_ENV production
ENV PORT 3000
ENV APP_DIR /var/app
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR
COPY . $APP_DIR 
RUN apt-get update && \
  apt-get -y install sendmail && \
  apt-get update && \
  npm install --production
EXPOSE $PORT
CMD ["npm", "start"]
