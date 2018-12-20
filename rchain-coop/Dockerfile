FROM node:11-slim
ENV PORT 3000
COPY . .
EXPOSE $PORT
RUN apt-get update && \
 npm install --production && \
 npm rebuild && \
 npm prune
CMD [ "npm", "start" ]
