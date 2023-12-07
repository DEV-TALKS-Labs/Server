# server

# API Documentation

## Get Rooms

Endpoint: `/api/rooms`  
Method: `GET`

### Description

The `getRooms` function retrieves all rooms from the database. It accepts an optional `orderBy` object in the request body to specify the sorting criteria for the rooms. By default, rooms are sorted by creation date in descending order. The endpoint returns a response with a count of rooms and an array of room details.

### Request

- Method: `GET`
- URL: `/api/rooms`
- Body (optional):

  ```json
  {
    "orderBy": {
      "createdAt": "desc"
    }
  }
  ```

- respose:

  ```json
  {
   "count": 7,
   "data": [
       {
           "id": "1f96e7ab-4742-4480-a073-91db2bac3f8e",
           "title": "",
           "maxUsers": 12,
           "isPublic": true,
           "hostId": "2",
           "coHostId": null,
           "createdAt": "2023-12-07T13:44:31.593Z",
           "filters": [
               {
                   "id": "519d80fe-d5de-4d54-a5c1-6a4b9e250ea7",
                   "name": "Backend"
               },
               {
                   "id": "2eff57f2-9042-487f-ad80-e35b5fca20bb",
                   "name": "DevOps"
               }
           ],
           "_count": {
               "roomUsers": 2
           }
       },
  	{
           "id": "2aasfasr-4742-4480-a073-easf2bac3f8e",
           "title": "",
           "maxUsers": 12,
           "isPublic": true,
           "hostId": "2",
           "coHostId": null,
           "createdAt": "2023-12-07T13:44:31.593Z",
           "filters": [
               {
                   "id": "519d80fe-d5de-4d54-a5c1-6a4b9e250ea7",
                   "name": "Backend"
               },
               {
                   "id": "3eff57f2-9042-487f-ad80-e35b5fca20bb",
                   "name": "Frontend"
               }
           ],
           "_count": {
               "roomUsers": 5
           }
       },
  	...
  	]
  }
  ```

## PATCH /api/rooms/:id/join

### Description

The `joinRoom` function is used to add a user to a room. It accepts a roomId and userId in the request body. If the room is public and not full, it adds the user to the room. Else, if the room doesn't exist, it creates a private room. If the room is full, it throws an error. If the user is already in the room, it throws an error. If the room is private and not full, it throws an error.

### Request

- Method: `PATCH`
- URL: `/api/rooms/:id/join`
- Body:

- respose:

  ```json
  {
    "id": "1f96e7ab-4742-4480-a073-91db2bac3f8e",
    "title": "",
    "maxUsers": 12,
    "isPublic": true,
    "hostId": "2",
    "coHostId": null,
    "createdAt": "2023-12-07T13:44:31.593Z",
    "roomUsers": [
      {
        "id": "1",
        "name": "Emad",
        "imageUrl": "https://avatars.githubusercontent.com/u/47259812?v=4",
        "roomId": "1f96e7ab-4742-4480-a073-91db2bac3f8e"
      },
      {
        "id": "2",
        "name": "Tut",
        "imageUrl": "https://avatars.githubusercontent.com/u/45897778?v=4",
        "roomId": "1f96e7ab-4742-4480-a073-91db2bac3f8e"
      }
    ],
    "filters": [
      {
        "id": "519d80fe-d5de-4d54-a5c1-6a4b9e250ea7",
        "name": "Backend"
      },
      {
        "id": "2eff57f2-9042-487f-ad80-e35b5fca20bb",
        "name": "DevOps"
      }
    ]
  }
  ```

## PUT /api/rooms/:id

### Description

The `putRoom` function is used to update a room. It accepts a roomId, hostId, title, maxUsers, isPublic, and filters in the request body. Returns a response with the updated room with response code 200. or throws an error.

### Request

- Method: `PUT`
- URL: `/api/rooms/:id`
- request body:

  ```json
  {
    "id": "1f96e7ab-4742-4480-a073-91db2bac3f8e",
    "title": "new title",
    "maxUsers": 12,
    "isPublic": true,
    "hostId": "2",
    "coHostId": "3"
  }
  ```

- respose:

  ```json
  {
    "id": "1f96e7ab-4742-4480-a073-91db2bac3f8e",
    "title": "new title",
    "maxUsers": 12,
    "isPublic": true,
    "hostId": "2",
    "coHostId": "3",
    "createdAt": "2023-12-07T13:44:31.593Z"
  }
  ```

## DELETE /api/rooms/:id

### Description

The `deleteRoom` function is used to delete a room. It accepts a roomId in the request body. Returns a response with the deleted room with response code 204. or throws an error.

### Request

- Method: `DELETE`
- URL: `/api/rooms/:id`
- request body:

  ```json
  {
    "hostId": "1f96e7ab-4742-4480-a073-91db2bac3f8e"
  }
  ```

- respose:

  ```json
  {}
  ```

  
