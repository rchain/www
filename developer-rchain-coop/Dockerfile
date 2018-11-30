FROM node:11-slim
RUN apt-get update && \
    apt-get -y install sendmail && \
    apt-get update 
ENV APP_DIR /var/app
ENV PORT 3000
RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR
COPY . $APP_DIR
EXPOSE $PORT
CMD ["npm", "start"]
