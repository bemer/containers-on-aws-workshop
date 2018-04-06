FROM alpine:latest
RUN apk add --update nodejs nodejs-npm
COPY app/ /app
WORKDIR /app
RUN npm install
ENTRYPOINT ["node"]
EXPOSE 8080
CMD ["server.js"]
