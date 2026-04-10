# Moveo Backend API Guide

This README documents the backend APIs currently available in the `backend` folder in a frontend-friendly format.

## Quick Info

- Server URL: `http://localhost:4000`
- Base API URL: `http://localhost:4000/api/v1`
- User base path: `/api/v1/users`
- Captain base path: `/api/v1/captains`

## API Index

| Area | Method | Endpoint | Purpose |
| --- | --- | --- | --- |
| Root | `GET` | `/` | Basic health route |
| User | `POST` | `/api/v1/users/register` | Register a new user |
| User | `POST` | `/api/v1/users/login` | Login user |
| User | `GET` | `/api/v1/users/profile` | Get logged-in user profile |
| User | `GET` | `/api/v1/users/logout` | Logout user |
| Captain | `POST` | `/api/v1/captains/register` | Register a new captain |

## Common Response Types

### Validation error

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Validation message",
      "path": "fieldName",
      "location": "body"
    }
  ]
}
```

### General error

```json
{
  "error": "error message"
}
```

### Unauthorized error

```json
{
  "message": "Unauthorized"
}
```

## Root Endpoint

### `GET /`

Use this route to quickly verify the server is running.

#### Response

```json
"Hello, World!"
```

## User APIs

### `POST /api/v1/users/register`

Creates a new user account.

#### Frontend should send

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

#### Required fields

- `fullname.firstname`: string, minimum 3 characters
- `fullname.lastname`: string, optional in route validation, minimum 3 if provided
- `email`: valid email string, minimum 5 characters
- `password`: string, minimum 5 characters

#### Success response

Status: `201 Created`

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

#### Notes

- Password is hashed before saving
- Password is not returned in the register response

### `POST /api/v1/users/login`

Logs in a user and returns a JWT token.

#### Frontend should send

```json
{
  "email": "rahul@example.com",
  "password": "12345"
}
```

#### Required fields

- `email`: valid email string, minimum 5 characters
- `password`: string, minimum 5 characters

#### Success response

Status: `200 OK`

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

#### Notes

- JWT is created using `JWT_SECRET`
- Token expiry is currently `24h`
- Backend also sets a cookie named `token`
- Current implementation returns the user object along with the token
- Current implementation also returns the hashed password in the login response

### `GET /api/v1/users/profile`

Returns the currently authenticated user.

#### Authentication

Send token using either:

- Cookie: `token`
- Header: `Authorization: Bearer <token>`

#### Frontend should send

No request body.

#### Success response

Status: `200 OK`

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

### `GET /api/v1/users/logout`

Logs out the current user.

#### Authentication

Send token using either:

- Cookie: `token`
- Header: `Authorization: Bearer <token>`

#### Frontend should send

No request body.

#### What backend does

- Clears the `token` cookie
- Saves the token to the blacklist collection
- Blacklisted token expires automatically after 24 hours

#### Success response

Status: `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

## Captain APIs

### `POST /api/v1/captains/register`

Creates a new captain account with vehicle details.

#### Frontend should send

```json
{
  "fullname": {
    "firstname": "Aman",
    "lastname": "Kumar"
  },
  "email": "aman@example.com",
  "password": "12345",
  "vehicle": {
    "color": "Black",
    "plate": "DL01AB1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

#### Required fields

- `fullname.firstname`: string, minimum 3 characters
- `fullname.lastname`: string, optional in route validation
- `email`: valid email string, minimum 5 characters
- `password`: string, minimum 5 characters
- `vehicle.color`: string, minimum 3 characters
- `vehicle.plate`: string, minimum 3 characters
- `vehicle.capacity`: integer, minimum 1
- `vehicle.vehicleType`: must be one of `car`, `motorcycle`, `auto`

#### Success response

Status: `201 Created`

```json
{
  "_id": "captain_id",
  "fullname": {
    "firstname": "Aman",
    "lastname": "Kumar"
  },
  "email": "aman@example.com",
  "socketId": null,
  "status": "inactive",
  "vehicle": {
    "color": "Black",
    "plate": "DL01AB1234",
    "capacity": 4,
    "vehicleType": "car"
  },
  "location": {},
  "__v": 0
}
```

#### Notes

- Password is hashed before saving
- Password is not expected in the captain register response because the model marks it with `select: false`
- If a captain with the same email already exists, backend returns:

```json
{
  "error": "Captain with this email already exists"
}
```

## Frontend Cheat Sheet

### User register body

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

### User login body

```json
{
  "email": "string",
  "password": "string"
}
```

### Captain register body

```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string",
  "vehicle": {
    "color": "string",
    "plate": "string",
    "capacity": 1,
    "vehicleType": "car | motorcycle | auto"
  }
}
```

### Protected routes auth

- Use cookie `token`, or
- Use header `Authorization: Bearer <token>`

## Run Backend

```bash
npm install
npm start
```
