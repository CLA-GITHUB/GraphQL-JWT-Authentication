# GraphQL-JWT-Authentication
This is a graphql server that handles authentication using jwt tokens and also refreshes the access token if it has expired

## How the tokens are created
- When the login mutation is hit, two tokens are created (accessToken and refreshToken)
- The accessToken holds the user id in its payload and the refreshToken holds the user id and user count in its payload
- The user count will be used to invalidate the tokens if the user count in the database does not match what is in the refreshToken payload

## How tokens are validated
- If the accessToken is verified but the refreshToken is not, the user only has 15m before the accessToken is invalidated
- If the refreshToken is verified but the accessToken is not, a new accessToken will be generated

## How tokens are invalidated
- The user count will be used to invalidate the tokens if the user count in the database does not match what is in the refreshToken payload

### Hope you get the gist
