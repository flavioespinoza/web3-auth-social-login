# Web3Auth Social Login

## Local Dev

Clone GitHub repository.
```shell
git clone https://github.com/flavioespinoza/web3auth-social-login.git
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
docker build -t flavioespinoza/web3auth-social-login:latest .
```

Run Docker container.
```shell
docker run -p 8080:80 -d flavioespinoza/web3auth-social-login:latest
```

Navigate to http://localhost:8080

## WASM

Follow these instructions to enable WASM in the Docker desktop app.

- https://docs.docker.com/desktop/wasm

Run Docker image as WASM.

```shell
docker run \
  --runtime=io.containerd.wasmedge.v1 \
  --platform=wasi/wasm \
  web3auth-social-login
```

## Docker Hub

Push image to Docker Hub
```shell
docker push flavioespinoza/web3auth-social-login:latest
```
