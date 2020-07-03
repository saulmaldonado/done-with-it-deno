<h1 align="center">Welcome to done-with-it-deno 🦕</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/saul_mal" target="_blank">
    <img alt="Twitter: saul\_mal" src="https://img.shields.io/twitter/follow/saul_mal.svg?style=social" />
  </a>
</p>

### Deno backend for Done With It React Native App

## Installation

#### clone repo

```sh
$ git clone https://github.com/saulmaldonado/done-with-it-deno.git
```

### Environment Variables

This server uses the dotenv module for environment variables [https://deno.land/x/dotenv](https://deno.land/x/dotenv). a '.env' fils is required in the root directory of the project and requires the following variables.

```bash
# .env
PORT_NUMBER= # A port number
HOST_NAME= # '192.168.29.192'
BASE_URL= # A baseURl ex. 'http://192.168.29.192:8000'
SECRET= # A secret key for JWT
TEST_SECRET= # A secret used for JWT testing
TOKEN_ISS= # A JWT Issuer
ACCESS_TOKEN_EXP= # access token expiry time in milliseconds
REFRESH_TOKEN_EXP= # refresh token expiry time in milliseconds
```

Environment variables are loaded into '.environment.dev.ts' this config object also includes the endpoint for Expo Push API which can be found at [https://docs.expo.io/push-notifications/sending-notifications/](https://docs.expo.io/push-notifications/sending-notifications/)

```ts
// .environment.dev.ts
export const config = {
  PORT_NUMBER: Number(env.PORT_NUMBER),
  BASE_URL: env.BASE_URL,
  HOST_NAME: env.HOST_NAME,
  SECRET: env.SECRET,
  TEST_SECRET: env.TEST_SECRET,
  TOKEN_ISS: env.TOKEN_ISS,
  ACCESS_TOKEN_EXP: Number(env.ACCESS_TOKEN_EXP),
  REFRESH_TOKEN_EXP: Number(env.REFRESH_TOKEN_EXP),
  EXPO_NOTIFICATION_ENDPOINT: 'https://exp.host/--/api/v2/push/send',
};
```

#### Testing

Tests expect a file './tests/test.env.ts' containing pre-generated tokens with invalid properties to test for different edge cases. These tokens are generated base on the environments variables and cannot be pre-made and pushed to this repo. To generate the correct tokens run the following script. This will generate tokens based on the issuer and secret keys in your .env file. If these properties are not already declared in .env, the script WILL fail.

```bash
vr generate-tokens
```

or

```bash
deno run --allow-read --allow-write --unstable --allow-plugin generateTestTokens.ts
```

### denon

> [denon](https://github.com/denosaurs/denon)

Start script for denon is included. Install denon to take advantage of auto-reloading

```sh
$ deno install --allow-read --allow-run --allow-write --allow-net -f --unstable https://deno.land/x/denon@v2.2.0/denon.ts

```

### velociraptor

Test script for velociraptor is included.

> [velociraptor](https://github.com/umbopepato/velociraptor)

```sh
$ deno install -qA -n vr https://deno.land/x/velociraptor@v1.0.0-beta.11/cli.ts

```

## Usage

```sh
# with denon
denon start
```

or

```sh
deno run --allow-net --allow-read --allow-plugin --allow-write --unstable index.ts
```

## Run tests

```sh
# with velociraptor
vr test
```

or

```sh
deno test tests/ --allow-net --allow-read --unstable --allow-plugin --allow-write
```

## Author

👤 **Saul Maldonado**

- Website: [saulmaldonado.tech](https://saulmaldonado.tech)
- Twitter: [@saul_mal](https://twitter.com/saul_mal)
- Github: [@saulmaldonado](https://github.com/saulmaldonado)
- LinkedIn: [@saulmaldonado4](https://linkedin.com/in/saulmaldonado4)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
