# pull official base image
FROM node:14.15.1-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react react-dom --no-save --silent

# add app
COPY . ./

# start app
CMD ["npm", "start"]


