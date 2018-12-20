FROM node:11-slim
ENV PORT 3000
COPY . .
RUN apt-get update && \
    apt-get -y install sendmail && \
    apt-get update && \
    npm install --production && \
    npm prune
EXPOSE $PORT
CMD ["npm", "start"]
