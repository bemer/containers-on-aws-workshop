###############################
# Stage 1 - the build process #
###############################

# base image
FROM python:3.6-alpine as base

# builder image
FROM base as builder

# set working directory
RUN mkdir /install
WORKDIR /install

# install/cache app dependencies and build de app
COPY requirements.txt /requirements.txt
RUN pip install --install-option="--prefix=/install" -r /requirements.txt

#################################
# Stage 2 - the web environment #
#################################

# base image
FROM base

# install/cache app dependencies and build de app
COPY --from=builder /install /usr/local
COPY src /app

# set working directory
WORKDIR /app

# start the api
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "main:app"]