# Web3Auth Social Login

## Local Dev

Clone GitHub repository.
```shell
git clone https://github.com/flavioespinoza/web3-auth-social-login.git
```

Install dependencies.
```shell
yarn
```

Run application.
```shell
yarn start
```

Navigate to http://localhost:3000

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
```