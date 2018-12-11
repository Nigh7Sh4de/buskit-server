# buskit-server
Backend server for the live music streaming application Buskit

## Prereqs

1. Install MongoDB and start server (`$ mongod`)
2. Install NodeJS (with npm)
3. Install yarn (`npm i -g yarn`)
4. Clone the repo and `cd` into it
5. `yarn` to install dependencies

## Spinning up the server
1. `yarn start` to start the web server

## Authentication
**Buskit** secures protected endpoints with [JWTs](https://www.npmjs.com/package/passport-jwt) (read the section *Include the JWT in requests*). A user can retrieve their JWT by authenticating with Twith. Currently only the [*OAuth Authorization Code Flow*](
https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#oauth-authorization-code-flow
) is supported which requires a client to send an *Authorization Code* to the auth endpoint on the Buskit server. Upon receiving an auth code, the server will verify the code with Twitch, find or create a user in the Buskit database, and finally respond with relevant user info (including a JWT).

## API

### Users

**GET /users/:id**
Retrieve a user from the database

Parameters

id | id of the user to retreive

Response

data | the user object or `null` if not found

### Streams

**GET /streams**
Get all streams

Response

data | array of stream objects


### Tags

**GET /tags**
Get all tags

Response

tags | array of tag objects