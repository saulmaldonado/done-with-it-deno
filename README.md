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
git clone https://github.com/saulmaldonado/done-with-it-deno.git
```

### Environment

This server requires a file named 'environment.dev.ts' for environment variables in the root directory

```ts
// ./environment.dev.ts

export enum config {
  PORT_NUMBER: number = // A port number,
  HOST_NAME: string // A hostname ex '192.168.29.192'
  BASE_URL: string = // A BaseURl ex. 'http://192.168.29.192',
  SECRET: string = // A secret key for JWT
  TEST_SECRET: string = // A secret used for JWT testing
  ACCESS_TOKEN_EXP: number = // An access token expiration duration in ms
  REFRESH_TOKEN_EXP: string = , // A refresh token expiration duration in ms
  TOKEN_ISS: string = , //  A JWT Issuer
}
```

#### Testing

Tests expect a file './tests/test.env.ts' containing pre-generated tokens with different properties to test for different edge cases.
Use a generator or [https://jwt.io/](https://jwt.io/) to generate keys with the following properties

```ts
// ./test/test.env.ts
/**
 * VARIABLES SURROUNDED BY ** ** MUST BE THE SAME AS IN config
 */
export enum testConfig {
  /**
   * default key generated from the genTest method
   *
   * headers  {
   *  alg: 'HS256',
   *  typ: 'JWT',
   * }
   * payload {
   *  iss: ** TOKEN_ISS **,
   *  userId: 1,
   *  isAdmin: true,
   * }
   *
   * key {
   * ** TEST_SECRET **
   * }
   *
   *
   */
  DEFAULT_TOKEN: string =
  // -------------------------------------------


  /**
   * valid but expired
   *
   * headers  {
   *  alg: 'HS256',
   *  typ: 'JWT',
   * }
   * payload {
   *  iss: ** TOKEN_ISS **,
   *  userId: 1,
   *  isAdmin: true,
   *  exp: 1592997623466 (Wed Jun 24 2020 11:20:23)
   * }
   *
   * key {
   * ** TEST_SECRET **
   * }
   *
   *
   */
  EXPIRED_TOKEN: string =
  // -------------------------------------------

  /** Random invalid token */
  INVALID_TOKEN: string =
    // -------------------------------------------


  /**
   * isAdmin property not included in payload
   *
   * headers  {
   *  alg: 'HS256',
   *  typ: 'JWT',
   * }
   * payload {
   *  iss: ** TOKEN_ISS **,
   *  userId: 1
   * }
   *
   * key {
   * ** SECRET **
   * }
   *
   *
   */
  NON_ADMIN_TOKEN: string =
    // -------------------------------------------


  /**
   * expired token with isAdmin property
   *
   * headers  {
   *  alg: 'HS256',
   *  typ: 'JWT',
   * }
   * payload {
   *  iss: ** TOKEN_ISS **,
   *  userId: 1,
   * isAdmin: true,
   * exp: 1592997623466 (Wed Jun 24 2020 11:20:23)
   * }
   *
   * key {
   * ** SECRET **
   * }
   */

  ADMIN_EXPIRED: string =
  // -------------------------------------------

  /**
   * Invalid userid in payload
   *
   * headers  {
   *  alg: 'HS256',
   *  typ: 'JWT',
   * }
   * payload {
   *  iss: ** TOKEN_ISS **,
   *  userId: 0,
   * isAdmin: true,
   * exp: 1592997623466 (Wed Jun 24 2020 11:20:23)
   * }
   *
   * key {
   * ** SECRET **
   * }
   */

  INVALID_USER_ID: string =
  // -------------------------------------------
  /**
   * no userid in payload
   *
   * headers  {
   *  alg: 'HS256',
   *  typ: 'JWT',
   * }
   * payload {
   *  iss: ** TOKEN_ISS **,
   * isAdmin: true,
   * exp: 1592997623466 (Wed Jun 24 2020 11:20:23)
   * }
   *
   * key {
   * ** SECRET **
   * }
   */
  NO_USER_ID: string =
}

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
