import prisma from "../../libs/__mocks__/prisma.js";
import { describe, expect, test, vi } from "vitest";
import request from "supertest";
import app from "../../app.js";

vi.mock("../../libs/prisma.js");

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
      const room1 = {
        id: "1",
        title: "room1",
        maxUsers: 12,
        isMic: true,
        host: "1",
        coHost: "2",
      };
      const room2 = {
        id: "2",
        title: "room2",
        maxUsers: 12,
        isMic: true,
        host: "1",
        coHost: "2",
      };

      prisma.room.findMany.mockResolvedValueOnce([room1, room2]);

      // make request to api
      const response = await request(app).get("/api/rooms");
      expect(response.body).toEqual([room1, room2]);
      expect(response.header["content-type"]).toMatch(/application\/json/);
      expect(response.status).toBe(200);
    });
  });

  test("get room using valid id", async () => {
    //add room to databse using prisma
    //get the same room from database using api
    //remove the same room from database using prisma
  });
  test("get room using invalid id", async () => {
    //get room from database using api fake-id
  });
});
