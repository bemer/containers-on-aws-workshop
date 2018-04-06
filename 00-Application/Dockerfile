FROM node:alpine
COPY app/ /app
WORKDIR /app
RUN npm install --global gulp && npm install gulp
RUN npm install
RUN gulp
ENTRYPOINT ["node"]
EXPOSE 8080
CMD ["server.js"]
