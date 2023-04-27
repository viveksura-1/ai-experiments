# Dev Setup

* Install Docker Desktop / (Docker + Docker Compose) on your local machine

* Get OpenAi API Key and save it in your machine's bash (not in docker bash) env variable as `OPEN_AI_API_KEY`.

* `docker build . -t  ai-experiments-app` to build the docker image 

* `docker compose up` to run the server on localhost:3000
