FROM shadiakiki1986/nginx-npm
MAINTAINER Shadi Akiki

RUN apk add --no-cache make 
COPY . /code/the-allocator
WORKDIR /code/the-allocator
RUN make install && \
    cp -r www/* /usr/share/nginx/html/

# WORKDIR /usr/share/nginx/html/

