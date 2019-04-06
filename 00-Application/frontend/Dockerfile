###############################
# Stage 1 - the build process #
###############################

# base image
FROM node:11.1.0 as build-deps

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install/cache app dependencies and build de app
#ADD code/ /usr/src/app/
ADD code/ /usr/src/app
RUN npm install
RUN npm install react-scripts@1.1.1 -g
RUN npm run-script build

#################################
# Stage 2 - the web environment #
#################################

# base image
FROM nginx:1.12-alpine

# copy builded app to nginx
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html

# expose the port 80
EXPOSE 80

# start the nginx
CMD ["nginx", "-g", "daemon off;"]
