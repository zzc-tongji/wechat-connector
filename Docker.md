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
docker run -d --restart always --name wechat-worker -v host-directory/runtime/:/usr/src/app/runtime/ -p http-receiver-port:http-receiver-port zzcgwu/wechat-worker
```

#### Compose

``` yaml
version: "3.3"
services:
  wechat-worker:
    restart: always
    container_name: wechat-worker
    volumes:
      - "host-directory/runtime/:/usr/src/app/runtime/"
    ports:
      - "http-receiver-port:http-receiver-port"
    image: zzcgwu/wechat-worker
```

``` sh
docker-compose up -d
```

