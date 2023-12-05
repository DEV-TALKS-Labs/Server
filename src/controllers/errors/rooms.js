// errros for rooms controller

class ResponseError {
  constructor(code, message, response) {
    this.code = code;
    this.jsonMessage = { server: message };
    this.response = response;
  }

  send() {
    this.response.status(this.code).json(this.jsonMessage);
  }
}

export default (error, response) => {
  console.log(error);
  if (error === "notFoundError")
    new ResponseError(404, "Room not found", response).send();
  else if (error === "roomIdRequiredError")
    new ResponseError(400, "Room id is required", response).send();
  else if (error === "userIdRequiredError")
    new ResponseError(400, "User id is required", response).send();
  else if (error === "maxUsersError")
    new ResponseError(
      403,
      "Max users count reached, you cannot join this room",
      response
    ).send();
  else if (error === "usersCountError")
    new ResponseError(
      403,
      "MaxUsers Count should more than 2 and less than or equal 12",
      response
    ).send();
  else if (error === "ExistingUsersCountError")
    new ResponseError(
      403,
      "Existing Users Count should be less than or equal MaxUsers Count",
      response
    ).send();
  else if (error.code === "P2003")
    new ResponseError(404, "User not found", response).send();
  else if (error.code === "P2002")
    new ResponseError(
      409,
      "User cannot create more than one room in the same time",
      response
    ).send();
  else if (error === "roomHostError" || error.code === "P2025")
    new ResponseError(
      409,
      "You are not the host of this room",
      response
    ).send();
  else new ResponseError(500, "Internal Server Error", response).send();
};
