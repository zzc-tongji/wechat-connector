# Docker

### Build

``` sh
git clean -xfd
docker build -t messagehelper/wechat-connector .
```

### Run

(Example)

#### Script

``` sh
docker run --detach --name wechat-connector --volume ./mount/runtime/:/usr/src/app/runtime/ --publish 8002:8002 --restart on-failure messagehelper/wechat-connector
```

#### Compose

``` yaml
version: "3.3"
services:
  wechat-connector:
    container_name: wechat-connector
    image: messagehelper/wechat-connector
    ports:
      - "8002:8002"
    restart: always
    volumes:
      - "./mount/runtime/:/usr/src/app/runtime/"
```

``` sh
docker-compose up --detach
```

