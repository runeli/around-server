docker stop around-server &&
docker rm around-server &&
docker build . around-server
heroku container:push web --app around-app-server