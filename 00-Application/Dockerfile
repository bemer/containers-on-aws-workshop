FROM node:10.17.0-alpine
COPY app/ /app
WORKDIR /app
RUN npm install --global gulp && npm install gulp
RUN npm install
RUN gulp
ENTRYPOINT ["node"]
EXPOSE 80
CMD ["server.js"]
