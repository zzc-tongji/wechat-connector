# Docker

### Build

``` sh
git clean -xfd
docker build -t zzcgwu/wechat-connector .
```

### Run

(Example)

#### Script

``` sh
docker run -d --restart on-failure --name wechat-connector -v ./runtime/:/usr/src/app/runtime/ -p 8002:8002 zzcgwu/wechat-connector
```

#### Compose

``` yaml
version: "3.3"
services:
  wechat-connector:
    restart: on-failure
    container_name: wechat-connector
    volumes:
      - "./runtime/:/usr/src/app/runtime/"
    ports:
      - "8002:8002"
    image: zzcgwu/wechat-connector
```

``` sh
docker-compose up -d
```

