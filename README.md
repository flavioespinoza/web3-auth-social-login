# Web3Auth Social Login

## Docker

Build docker image.
```shell
docker build -t web3auth-social-login .
```

Run Docker container.
```shell
docker run --name web3auth-social-login -p 8080:80 -d web3auth-social-login
```

Navigate to http://localhost:8080

## Docker Hub

Push image to Docker Hub
```shell
docker tag web3auth-social-login:latest flavioespinoza/web3auth-social-login:latest

docker push flavioespinoza/web3auth-social-login:latest