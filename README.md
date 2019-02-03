# buskit-server
Backend server for the live music streaming application Buskit

## Prereqs

1. Install MongoDB and start server (`$ mongod`)
2. Install NodeJS (with npm)
3. Install yarn (`$ npm i -g yarn`)
4. Clone the repo and `$ cd` into it
5. `$ yarn` to install dependencies

## Spinning up the server
1. `$ yarn start` to start the web server on `http://localhost:3000/`

## Authentication
Buskit secures protected endpoints with [JWTs](https://www.npmjs.com/package/passport-jwt) (read the section *Include the JWT in requests*). A user can retrieve their JWT by authenticating with Twith. Currently only the [*OAuth Authorization Code Flow*](
https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#oauth-authorization-code-flow
) is supported which requires a client to send an *Authorization Code* to the auth endpoint on the Buskit server. Upon receiving an auth code, the server will verify the code with Twitch, find or create a user in the Buskit database, and finally respond with relevant user info (including a JWT).

---

## API

### Auth

#### GET /auth/twitch/redirect
Verify twitch auth code and return JWT for Buskit user. After authentication, all Twitch WebHook subscriptions will be created/renewed.

| Query | Description |
| --- | --- |
| code | Authorization code issued to be verified with Twitch |

| Response | Description |
| --- | --- |
| user | the user object or `null` if not found |
| token | JWT for further protected route access |

---

### Users

#### GET /users
Retrieve a user from the database

| Query | Description |
| --- | --- |
| id | id of the user to retreive |

| Response | Description |
| --- | --- |
| user | the user object or `null` if not found |

---

### Streams

#### GET /streams
Get all streams

| Response | Description |
| --- | --- |
| streams | array of stream objects |

#### *GET /streams/sub*
*Twitch Stream Changed* subscription verification

| Response | Description |
| --- | --- |
|  | `hub.challenge` query from request |

#### *POST /streams/sub*
*Twitch Stream Changed* subscription notification

---

### Tags

#### GET /tags
Get all tags

| Response | Description |
| --- | --- |
| tags | array of tag objects |

#### POST /tags
Save tags into database. Tags are unique in the database, therefore any posted tags that already exist will be ignored. The API will attempt to save all the tags into the database which will then only insert new tags and return an error object with write information.

| Response | Description |
| --- | --- |
| tags | array of tag objects inserted or already found in database |
| error | any error that may have occured |

#### POST /tags
Save tags into database. Tags are unique in the database, therefore any posted tags that already exist will be ignored. The API will attempt to save all the tags into the database which will then only insert new tags and return an error object with write information.

| Response | Description |
| --- | --- |
| tags | array of tag objects inserted or already found in database |
| error | any error that may have occured |

🍕
