## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Features](#features)
- [Setup](#setup)

## General info

This project is a simple API for CRUD operations on users.

## Technologies

Project is created with:

- Node.js: 18.16.0
- MongoDB Community Server + Compass: 6.0.6

For more dependencies check [package.json](./package.json)

## Features

- User authentication
  - Signing in and registering `jwt`
  - Password hashing `bcrypt`
  - Register credentials validation `Joi`
- User authorization
  - Only authorized users can fetch all users GET /api/users `jwt`
- Data fetching from MongoDB local server `MongoDB, MongoDB Compass`
- Full CRUD implemented
  - Create - `POST /api/user`
  - Read - `GET /api/users` OR `GET /api/users?role=?`
  - Update - `PATCH /api/user/[ID]`
  - Delete - `DELETE /api/user/[ID]`

## Setup

To launch local server follow these commands:

```
$ git clone https://github.com/TerroR75/user-api.git
$ npm install
$ npm run dev
```

To create a MongoDB connection follow these steps:

1. Install MongoDB Community Server and MongoDB Compass https://www.mongodb.com/try/download/community
2. Add Environment variable to your PATH in "System variables"
   `C:\Program Files\MongoDB\Server\6.0\bin` for more info check [this guide](https://medium.com/@therkverma/set-mongodb-in-the-windows-path-environment-9d4c81477b32)
3. Then start your mongo server by using this command in Shell or Command Prompt:

   ```
   $ mongod
   ```

   This should start your server and the last message inside Command Prompt should be `{msg: "Waiting for connections"}`

4. In MongoDB Compass, click Connect and you should be connected by default on `localhost:27017`

5. Open `api/database/index.js` and change

   ```javascript
   const url = "mongodb://127.0.0.1:27017/[DB NAME HERE]";
   ```

6. If you are using Postman for testing the API, feel free to use my [Postman API calls collection](./users-api-collection.json)
