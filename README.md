# wechat-connector

### Introduction

(TODO)

### Prerequisite

- Windows / macOS:
  - [Google Chrome](https://www.google.com/intl/en_us/chrome/) is required.
  - [Node.js](https://nodejs.org/) of v12.16.3 + is required.
- Linux: 
  - Only Debian and Ubuntu are supported.
  - 1 GiB RAM is required.
  - Execute script [prerequisite.sh](./prerequisite.sh) as `root` user to install dependent package [google-chrome-unstable_85.0.4173.0-1_amd64.deb](./google-chrome-unstable_85.0.4173.0-1_amd64.deb). (The official resource is [here](https://dl.google.com/linux/deb/pool/main/g/google-chrome-unstable/google-chrome-unstable_54.0.2837.0-1_amd64.deb).) The specific version `85.0.4173.0-1` is required.
  - [Node.js](https://nodejs.org/) of v12.16.3 + is required.
- Docker
  - See [Docker.md](./Docker.md) for details.

### Usage

#### Quick Start

``` sh
./prerequisite.sh # Linux only

yarn install

yarn start-first # macOS and Linux only
yarn start-first-windows # Windows only

cp ./runtime/setting.example.json ./runtime/setting.json

yarn start
```

#### Data Exchange

##### HTTP Receiver

- Status Page: `GET /`

- [API](https://editor.swagger.io/?url=https%3a%2f%2fraw.githubusercontent.com%2fzzc-tongji%2fwechat-connector%2fmaster%2fdoc%2fhttp-listener.yaml)

##### HTTP Sender

(TODO)

### Others

- All code files are edited by [Visual Studio Code](https://code.visualstudio.com/).
- All ".md" files are edited by [Typora](http://typora.io/).
- The style of all ".md" files is [Github Flavored Markdown](https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown).
- There is a LF (Linux) at the end of each line.

