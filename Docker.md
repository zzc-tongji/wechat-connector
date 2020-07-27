# Docker

### Build

``` sh
git clean -xfd
docker build -t zzcgwu/wechat-worker .
```

### Run

(Example)

#### Script

``` sh
docker run -d --restart on-failure --name wechat-worker -v ./runtime/:/usr/src/app/runtime/ -p 8002:8002 zzcgwu/wechat-worker
```

#### Compose

``` yaml
version: "3.3"
services:
  wechat-worker:
    restart: on-failure
    container_name: wechat-worker
    volumes:
      - "./runtime/:/usr/src/app/runtime/"
    ports:
      - "8002:8002"
    image: zzcgwu/wechat-worker
```

``` sh
docker-compose up -d
```

