/**
 * https://jwt.io/
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
   *  iss: 'donewithit',
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
  DEFAULT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkb25ld2l0aGl0IiwidXNlcklkIjoxLCJpc0FkbWluIjp0cnVlfQ.z37ryTFKXbTkp-FNHJUMULNaB8pdMwDO0DpVIVc9DmQ',

  /**
   * valid but expired
   *
   * headers  {
   *  alg: 'HS256',
   *  typ: 'JWT',
   * }
   * payload {
   *  iss: 'donewithit',
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
  EXPIRED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkb25ld2l0aGl0IiwidXNlcklkIjoxLCJpc0FkbWluIjp0cnVlLCJleHAiOjE1OTI5OTY5OTcwODF9.4lZpt3s_JmAiORJeMnqluBo429UemVsK865h6_Lz_f0',

  /** Random invalid token */
  INVALID_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkbd2l0aGl0IiwidXNlcklkIjoxLCJpc0FkbWjp0cnVlLCJleHAiOjE1OTI5OTY5OTcwODF9.4lZpt3s_JmAiORJeMnqluBo429UemVsK865h6_Lz_f0',

  /**
   * isAdmin property not included in payload
   *
   * headers  {
   *  alg: 'HS256',
   *  typ: 'JWT',
   * }
   * payload {
   *  iss: 'donewithit',
   *  userId: 1
   * }
   *
   * key {
   * ** SECRET **
   * }
   *
   *
   */
  NON_ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkb25ld2l0aGl0IiwidXNlcklkIjoxfQ.8SrWPwgb8nxsLY_ABmIDjSGCsqCzts9Y46NdQR721Ho',

  /**
   * isAdmin property not included in payload
   *
   * headers  {
   *  alg: 'HS256',
   *  typ: 'JWT',
   * }
   * payload {
   *  iss: 'donewithit',
   *  userId: 1,
   * isAdmin: true,
   * exp: 1592997623466 (Wed Jun 24 2020 11:20:23)
   * }
   *
   * key {
   * ** SECRET **
   * }
   */

  ADMIN_EXPIRED = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkb25ld2l0aGl0IiwidXNlcklkIjoxLCJpc0FkbWluIjp0cnVlLCJleHAiOjE1OTI5OTc2MjM0NjZ9.2heqKr6Yo2QTDU_xODK6eC-wdbSLMWPLq5h_0WxWN4g',

  /**
   * isAdmin property not included in payload
   *
   * headers  {
   *  alg: 'HS256',
   *  typ: 'JWT',
   * }
   * payload {
   *  iss: 'donewithit',
   *  userId: 0,
   * isAdmin: true,
   * exp: 1592997623466 (Wed Jun 24 2020 11:20:23)
   * }
   *
   * key {
   * ** SECRET **
   * }
   */

  INVALID_USER_ID = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkb25ld2l0aGl0IiwidXNlcklkIjowLCJpc0FkbWluIjp0cnVlLCJleHAiOjE1OTI5OTc2MjM0NjZ9.GWjzOHasBu-fbT1WAwFEjyejZia9q5ykYb15Ds4eizg',

  /**
   * isAdmin property not included in payload
   *
   * headers  {
   *  alg: 'HS256',
   *  typ: 'JWT',
   * }
   * payload {
   *  iss: 'donewithit',
   * isAdmin: true,
   * exp: 1592997623466 (Wed Jun 24 2020 11:20:23)
   * }
   *
   * key {
   * ** SECRET **
   * }
   */
  NO_USER_ID = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkb25ld2l0aGl0IiwiaXNBZG1pbiI6dHJ1ZSwiZXhwIjoxNTkyOTk3NjIzNDY2fQ.E1ng3vg7tQUKEwZvdkPhTI2E-4mYcoEC9N__0gxnFi0',
}
