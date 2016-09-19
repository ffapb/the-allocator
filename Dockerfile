FROM shadiakiki1986/nginx-npm
MAINTAINER Shadi Akiki

# continue with my own commands
WORKDIR /usr/share/nginx/html/
COPY . .
RUN apk add --no-cache make && \
    make install

