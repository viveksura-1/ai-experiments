FROM ruby:3.2.0-slim

RUN apt-get update -qq && apt-get install -yq --no-install-recommends \
    build-essential \
    curl \
    gnupg2 \
    less \
    git \
    libpq-dev \
    default-libmysqlclient-dev \
    libvips \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV LANG=C.UTF-8 \
  BUNDLE_JOBS=4 \
  BUNDLE_RETRY=3
  
RUN gem update --system && gem install bundler
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g yarn@1.22.19


RUN mkdir /app
WORKDIR /app 
ADD Gemfile /app/Gemfile
ADD Gemfile.lock /app/Gemfile.lock
RUN bundle install
ADD package.json /app/package.json
RUN yarn install