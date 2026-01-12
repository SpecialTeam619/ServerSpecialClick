import request from "supertest";
import { App } from "../src/app";
import { boot } from "../src/main";

let application: App;

beforeAll(async () => {
  const { app } = await boot;
  application = app;
});

describe("Users e2e", () => {
  it("Register - error", async () => {
    await request(application.app).post("/users/register").send({
      name: "name",
      email: "aaa@gmail.com",
      password: "password",
    });
    const res = await request(application.app).post("/users/register").send({
      name: "name",
      email: "aaa@gmail.com",
      password: "password",
    });
    expect(res.statusCode).toBe(422);
  });
  it("Delete - error", async () => {
    const res = await request(application.app).delete("/users/delete").send({
      email: "aaa@gmail.com",
      password: "wrong password",
    });
    expect(res.statusCode).toBe(401);
  });
  it("Delete - success", async () => {
    const res = await request(application.app).delete("/users/delete").send({
      email: "aaa@gmail.com",
      password: "password",
    });
    expect(res.statusCode).toBe(200);
  });
  it("Register - success", async () => {
    const res = await request(application.app).post("/users/register").send({
      name: "name",
      email: "aaa@gmail.com",
      password: "password",
    });
    expect(res.statusCode).toBe(201);
  });
  it("Login - error", async () => {
    const res = await request(application.app).post("/users/login").send({
      email: "aaa@gmail.com",
      password: "wrong password",
    });
    expect(res.statusCode).toBe(401);
  });
  it("Login - success", async () => {
    const res = await request(application.app).post("/users/login").send({
      email: "aaa@gmail.com",
      password: "password",
    });
    expect(res.statusCode).toBe(200);
  });
  it("Info - success", async () => {
    const resLogin = await request(application.app).post("/users/login").send({
      email: "aaa@gmail.com",
      password: "password",
    });
    const res = await request(application.app).get("/users/info").set('Authorization', `Bearer ${resLogin.body.jwt}`);
    expect(res.statusCode).toBe(200);
  });
  it("Info - error", async () => {
    const res = await request(application.app).get("/users/info").set('Authorization', `Bearer aaa`);
    expect(res.statusCode).toBe(401);
  });
});

afterAll(() => {
  application.close();
});
