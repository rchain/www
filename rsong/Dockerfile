FROM nginx:alpine
ENV PORT 80
ENV NODE_ENV production
EXPOSE $PORT
WORKDIR /usr/share/nginx/html
COPY public .
RUN apk update && \
  rm -f /etc/nginx/conf.d/default.conf
ADD default.conf /etc/nginx/conf.d
