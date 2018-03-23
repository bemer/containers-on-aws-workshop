# Let's use the ubuntu base image
FROM ubuntu:latest

MAINTAINER brunemer@amazon.com

# Install python in our image
RUN apt-get update -y && apt-get install -y python-pip python-dev build-essential

# Copy the app source code to our image
COPY . /app

# Set the working directory to be /app
WORKDIR /app

# Install necessary requirements
RUN pip install -r requirements.txt

# Selects "python" as our entrypoint
ENTRYPOINT ["python"]

# Container will listen on port 3000
EXPOSE 3000

# Run our app.py file everytime the container is started
CMD ["app.py"]
