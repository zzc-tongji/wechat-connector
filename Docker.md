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
cp ./runtime/setting.example.json ./runtime/setting.json
docker run -d --restart always --name wechat-worker -v ./runtime/:/usr/src/app/runtime/ -p 8080:8080 zzcgwu/wechat-worker
```

#### Compose

``` yaml
version: "3.3"
services:
  wechat-worker:
    restart: always
    container_name: wechat-worker
    volumes:
      - "./runtime/:/usr/src/app/runtime/"
    ports:
      - "8080:8080"
    image: zzcgwu/wechat-worker
```

``` sh
docker-compose up -d
```

