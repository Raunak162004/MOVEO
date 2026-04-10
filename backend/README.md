# Backend API Documentation

This document describes the backend APIs currently implemented in the `backend` folder.

## Project Info

- Default port: `4000` from `.env`
- Local server URL: `http://localhost:4000`
- Base API URL: `http://localhost:4000/api/v1`

## Available Endpoints

### 1. Health Check

- Method: `GET`
- Endpoint: `/`

#### Response

```json
"Hello, World!"
```

## User APIs

Base path for user routes:

```text
/api/v1/users
```

### 1. Register User

- Method: `POST`
- Endpoint: `/api/v1/users/register`

#### Expected Data From Frontend

Frontend should send JSON in this format:

```json
{
  "fullname": {
    "firstname": "Rahul",
    "lastname": "Sharma"
  },
  "email": "rahul@example.com",
  "password": "12345"
}
```

#### Field Details

- `fullname.firstname`
  - Type: `string`
  - Required: `yes`
  - Minimum length: `3`
- `fullname.lastname`
  - Type: `string`
  - Required: `no` in route validation, but expected by model structure
  - Minimum length: `3` if provided
- `email`
  - Type: `string`
  - Required: `yes`
  - Must be a valid email
  - Minimum length: `5`
- `password`
  - Type: `string`
  - Required: `yes`
  - Minimum length: `5`

#### Validation Rules

The backend currently validates:

- `email` must be a valid email and at least 5 characters long
- `password` must be at least 5 characters long
- `fullname.firstname` must be at least 3 characters long

#### Success Response

Status code:

```text
201 Created
```

Example response shape:

```json
{
  "_id": "user_id",
  "fullname": {
    "firstname": "Rahul",
    "lastname": "Sharma"
  },
  "email": "rahul@example.com",
  "socketId": null,
  "__v": 0
}
```

#### Notes About Success Response

- Password is not returned in the response
- Password is hashed before saving to MongoDB
- Response contains the created user document

#### Validation Error Response

Status code:

```text
400 Bad Request
```

Example response:

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Password must be at least 5 characters long",
      "path": "password",
      "location": "body"
    }
  ]
}
```

#### Service or Model Error Response

Status code:

```text
400 Bad Request
```

Example response:

```json
{
  "error": "All fields are required"
}
```

### 2. Login User

- Method: `POST`
- Endpoint: `/api/v1/users/login`

#### Expected Data From Frontend

Frontend should send JSON in this format:

```json
{
  "email": "rahul@example.com",
  "password": "12345"
}
```

#### Field Details

- `email`
  - Type: `string`
  - Required: `yes`
  - Must be a valid email
  - Minimum length: `5`
- `password`
  - Type: `string`
  - Required: `yes`
  - Minimum length: `5`

#### Validation Rules

The backend currently validates:

- `email` must be a valid email and at least 5 characters long
- `password` must be at least 5 characters long

#### Success Response

Status code:

```text
200 OK
```

Example response shape:

```json
{
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "Rahul",
      "lastname": "Sharma"
    },
    "email": "rahul@example.com",
    "password": "hashed_password",
    "socketId": null,
    "__v": 0
  }
}
```

#### Notes About Success Response

- Backend returns a JWT token
- Token is created using `JWT_SECRET`
- Token expiry is currently `1d`
- Backend also sets the token in a cookie named `token`
- The current login response also returns the user object
- The current login response includes the hashed password because the controller fetches the user with `select("+password")` and returns it directly

#### Validation Error Response

Status code:

```text
400 Bad Request
```

Example response:

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Email must be at least 5 characters long",
      "path": "email",
      "location": "body"
    }
  ]
}
```

#### Invalid Credentials Response

Status code:

```text
401 Unauthorized
```

Example response:

```json
{
  "error": "Invalid email or password"
}
```

### 3. Get User Profile

- Method: `GET`
- Endpoint: `/api/v1/users/profile`

#### Authentication Required

This endpoint is protected.

Backend accepts token from either:

- Cookie: `token`
- Header: `Authorization: Bearer <token>`

#### Expected Data From Frontend

No request body is required.

Frontend must send a valid authentication token.

#### Success Response

Status code:

```text
200 OK
```

Example response shape:

```json
{
  "_id": "user_id",
  "fullname": {
    "firstname": "Rahul",
    "lastname": "Sharma"
  },
  "email": "rahul@example.com",
  "socketId": null,
  "__v": 0
}
```

#### Unauthorized Response

Status code:

```text
401 Unauthorized
```

Example response:

```json
{
  "message": "Unauthorized"
}
```

### 4. Logout User

- Method: `GET`
- Endpoint: `/api/v1/users/logout`

#### Authentication Required

This endpoint is protected.

Backend accepts token from either:

- Cookie: `token`
- Header: `Authorization: Bearer <token>`

#### Expected Data From Frontend

No request body is required.

Frontend must send a valid authentication token.

#### What Backend Does

- Clears the `token` cookie
- Stores the token in blacklist collection
- Blacklisted token expires automatically after 24 hours

#### Success Response

Status code:

```text
200 OK
```

Example response:

```json
{
  "message": "Logged out successfully"
}
```

#### Unauthorized Response

Status code:

```text
401 Unauthorized
```

Example response:

```json
{
  "message": "Unauthorized"
}
```

## Summary For Frontend

### Frontend should send for register

```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string"
}
```

### Backend sends on register success

```json
{
  "_id": "string",
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "socketId": "string or null",
  "__v": 0
}
```

### Frontend should send for login

```json
{
  "email": "string",
  "password": "string"
}
```

### Backend sends on login success

```json
{
  "token": "string",
  "user": {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "password": "hashed string",
    "socketId": "string or null",
    "__v": 0
  }
}
```

### Frontend should send for profile

No body is required.

Send either:

- cookie `token`
- `Authorization: Bearer <token>` header

### Backend sends on profile success

```json
{
  "_id": "string",
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "socketId": "string or null",
  "__v": 0
}
```

### Frontend should send for logout

No body is required.

Send either:

- cookie `token`
- `Authorization: Bearer <token>` header

### Backend sends on logout success

```json
{
  "message": "Logged out successfully"
}
```

### Backend sends on error

Validation error:

```json
{
  "errors": []
}
```

General error:

```json
{
  "error": "error message"
}
```

Unauthorized error:

```json
{
  "message": "Unauthorized"
}
```

## Run Backend

Install dependencies and start the server:

```bash
npm install
npm start
```
