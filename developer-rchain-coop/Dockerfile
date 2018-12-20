FROM node:11-slim
ENV PORT 3000
ENV NODE_ENV production
COPY . .
RUN apt-get update && \
    npm install --production
EXPOSE $PORT
CMD ["npm", "start"]
