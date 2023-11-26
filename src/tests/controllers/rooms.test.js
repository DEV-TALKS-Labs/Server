import prisma from "../../libs/__mocks__/prisma.js";
import { describe, expect, test, vi } from "vitest";
import request from "supertest";
import app from "../../app.js";

vi.mock("../../libs/prisma.js");

class Room {
  // id       String  @id @default(uuid())
  // title    String  @db.VarChar(255)
  // maxUsers Int     @default(12)
  // isPublic Boolean @default(true)
  // hostId String
  // coHostId String?
  // filters Filter[]

  constructor(id, title, maxUsers, isPublic, hostId, coHostId, filters) {
    this.id = id;
    this.title = title;
    this.maxUsers = maxUsers;
    this.isPublic = isPublic;
    this.hostId = hostId;
    this.coHostId = coHostId;
    this.filters = filters;
  }
}
describe("Rooms Controller", () => {
  describe("/api/rooms/ GET", () => {
    test("should get json empty list", async () => {
      // mock prisma.room.findMany with empty array
      prisma.room.findMany.mockResolvedValueOnce([]);

      // make request to api
      const response = await request(app).get("/api/rooms");
      expect(response.body).toEqual([]);
      expect(response.header["content-type"]).toMatch(/application\/json/);
      expect(response.status).toBe(200);
    });

    test("should get json empty list", async () => {
      // mock prisma.room.findMany with empty array

      const rooms = [];
      rooms.push(new Room("1", "room1", 10, true, "1", "2", []));
      rooms.push(new Room("2", "room2", 10, true, "3", "4", []));
      prisma.room.findMany.mockResolvedValueOnce(rooms);
      // make request to api
      const response = await request(app).get("/api/rooms");
      expect(response.body).toEqual(rooms);
      expect(response.header["content-type"]).toMatch(/application\/json/);
      expect(response.status).toBe(200);
    });
  });

  test("post Romms with valid HostID", async () => {
    const rooms = [];
    rooms.push(new Room("1", "room1", 10, true, "1", "2", []));
    rooms.push(new Room("2", "room2", 10, true, "3", "4", []));

    const room = new Room("3", "room3", 10, true, "5", "6", []);
    prisma.room.create.mockResolvedValueOnce(room);
    const response = await request(app).post("/api/rooms").send(room);
    expect(response.body).toEqual(room);
    expect(response.header["content-type"]).toMatch(/application\/json/);
    expect(response.status).toBe(200);
  });

  test("post Romms with invalid HostID", async () => {
    const rooms = [];
    rooms.push(new Room("1", "room1", 10, true, "1", "2", []));
    rooms.push(new Room("2", "room2", 10, true, "3", "4", []));

    const room = new Room("3", "room3", 10, true, "1", "6", []);
    prisma.room.create.mockRejectedValueOnce(room);
    const response = await request(app).post("/api/rooms").send(room);
    expect(response.body).toEqual({ error: "invalid host id" });
    expect(response.header["content-type"]).toMatch(/application\/json/);
    expect(response.status).toBe(409);
  });
});
