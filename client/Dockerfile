FROM node:21.5.0-alpine as builder
WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx:stable-alpine
EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html


# Copy .env file to container
WORKDIR /usr/share/nginx/html
COPY .env .

# Add bash for running the environment setup script
RUN apk add --no-cache bash

# Copy and make the environment setup script executable
COPY env.sh .
RUN chmod +x env.sh

# Start Nginx server and run environment setup script
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g 'daemon off;'"]