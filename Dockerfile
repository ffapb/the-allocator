FROM nginx:alpine
MAINTAINER Shadi Akiki

WORKDIR /usr/share/nginx/html/
RUN apk add --no-cache nodejs npm git mercurial && \
    npm install -g bower && \
    git clone --depth 1 https://github.com/shadiakiki1986/the-allocator.git && \
    mv the-allocator/* . && \
    make install

