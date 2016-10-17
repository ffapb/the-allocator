FROM shadiakiki1986/nginx-npm
MAINTAINER Shadi Akiki

RUN apk add --no-cache make vim
WORKDIR /usr/share/the-allocator
COPY etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY . .
RUN make install

# WORKDIR /usr/share/nginx/html/

