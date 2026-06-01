import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app.js";

/*
?   POST /category
*   @param name
*/
describe("Category", () => {
  it("deve criar uma categoria", async () => {
    const response = await request(app)
      .post("/category")
      .send({
        name: "Vestidos"
      });

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("Vestidos");
  });
});

// ! Teste do @unique
it("não deve permitir categoria duplicada", async () => {
  await request(app)
    .post("/category")
    .send({
      name: "Vestidos"
    });

  const response = await request(app)
    .post("/category")
    .send({
      name: "Vestidos"
    });

  expect(response.status).toBe(409);
});

/*
? Query - POST /category
*/
it("deve buscar categoria pelo id", async () => {
  const created = await request(app)
    .post("/category")
    .send({
      name: "Calçados"
    });

  const id = created.body.data.id;

  const response = await request(app)
    .get(`/category/${id}`);

  expect(response.status).toBe(200);
  expect(response.body.data.name).toBe("Calçados");
});

/*
?   DEL /category
*   @param id
*/
it("deve remover categoria", async () => {
  const created = await request(app)
    .post("/category")
    .send({
      name: "Acessórios"
    });

  const id = created.body.data.id;

  const response = await request(app)
    .delete(`/category/${id}`);

  expect(response.status).toBe(204);
});