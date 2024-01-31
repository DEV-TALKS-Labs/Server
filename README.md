# DEV TALKS REST API

## Overview

This is the official REST API for DEV TALKS, providing endpoints to interact with filters, rooms, and users.

this api used to serve the [DEV TALKS] web application.

## Base URL

- Development Server: [http://localhost:8080](http://localhost:8080)

## Authentication

TODO: Include information about any authentication mechanisms, if applicable.

## Endpoints

### 1. Get All Filters

- **Endpoint:** `/api/filters`
- **Method:** `GET`
- **Description:** Get all filters.
- **Response:**
  - `200 OK` - Successful response with filters.
  - `500 Internal Server Error` - Internal Server Error.

### 2. Get Rooms for a Specific Filter

- **Endpoint:** `/api/filters/{id}/rooms`
- **Method:** `GET`
- **Description:** Get rooms for a specific filter.
- **Parameters:**
  - `{id}` (Path Parameter) - The ID of the filter.
- **Response:**
  - `200 OK` - Successful response with filtered rooms.
  - `404 Not Found` - Filter not found.
  - `500 Internal Server Error` - Internal Server Error.

### 3. Get All Public Rooms

- **Endpoint:** `/api/rooms`
- **Method:** `GET`
- **Description:** Get all public rooms.
- **Response:**
  - `200 OK` - Successful response with public rooms.
  - `500 Internal Server Error` - Internal Server Error.

### 4. Create a New Room

- **Endpoint:** `/api/rooms`
- **Method:** `POST`
- **Description:** Create a new room.
- **Request Body:**
  - JSON object with room details.
- **Response:**
  - `201 Created` - Room created successfully.
  - `403 Forbidden` - Max users count reached or invalid user input.
  - `500 Internal Server Error` - Internal Server Error.

### 5. Get Details of a Specific Room

- **Endpoint:** `/api/rooms/{id}`
- **Method:** `GET`
- **Description:** Get details of a specific room.
- **Parameters:**
  - `{id}` (Path Parameter) - The ID of the room.
- **Response:**
  - `200 OK` - Successful response with room details.
  - `404 Not Found` - Room not found.
  - `500 Internal Server Error` - Internal Server Error.

### 6. Update Details of a Specific Room

- **Endpoint:** `/api/rooms/{id}`
- **Method:** `PUT`
- **Description:** Update details of a specific room.
- **Parameters:**
  - `{id}` (Path Parameter) - The ID of the room.
- **Request Body:**
  - JSON object with updated room details.
- **Response:**
  - `200 OK` - Room updated successfully.
  - `403 Forbidden` - Max users count reached or invalid user input.
  - `404 Not Found` - Room not found.
  - `500 Internal Server Error` - Internal Server Error.

### 7. Delete a Specific Room

- **Endpoint:** `/api/rooms/{id}`
- **Method:** `DELETE`
- **Description:** Delete a specific room.
- **Parameters:**
  - `{id}` (Path Parameter) - The ID of the room.
- **Response:**
  - `204 No Content` - Room deleted successfully.
  - `403 Forbidden` - Invalid user input or user not authorized to delete the room.
  - `404 Not Found` - Room not found.
  - `500 Internal Server Error` - Internal Server Error.

### 8. Join a Specific Room

- **Endpoint:** `/api/rooms/{id}/join`
- **Method:** `PATCH`
- **Description:** Join a specific room.
- **Parameters:**
  - `{id}` (Path Parameter) - The ID of the room.
- **Request Body:**
  - JSON object with user ID.
- **Response:**
  - `200 OK` - User joined the room successfully.
  - `403 Forbidden` - Max users count reached or invalid user input.
  - `404 Not Found` - Room not found.
  - `409 Conflict` - User already in the room.
  - `500 Internal Server Error` - Internal Server Error.

### 9. Leave a Specific Room

- **Endpoint:** `/api/rooms/{id}/leave`
- **Method:** `PATCH`
- **Description:** Leave a specific room.
- **Parameters:**
  - `{id}` (Path Parameter) - The ID of the room.
- **Request Body:**
  - JSON object with user ID.
- **Response:**
  - `200 OK` - User left the room successfully.
  - `403 Forbidden` - Invalid user input or user not authorized to leave the room.
  - `404 Not Found` - Room not found.
  - `409 Conflict` - User not in the room.
  - `500 Internal Server Error` - Internal Server Error.

### 10. Create a New User

- **Endpoint:** `/api/users`
- **Method:** `POST`
- **Description:** Create a new user.
- **Request Body:**
  - JSON object with user details.
- **Response:**
  - `200 OK` - User already exists.
  - `201 Created` - User created successfully.
  - `500 Internal Server Error` - Internal Server Error.

## Tags

- Filters
- Rooms
- Users
