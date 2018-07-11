// require the Koa server
const server = require("../routes/tags");
// require supertest
const request = require("supertest");


describe("routes: tags", () => {
    test("should respond as expected", async () => {
        try {
            const response = await request(server).get("/tags");
        }
        catch(err) {
            console.log(err)
        }
        expect(response.body.person).toHaveProperty("label");
    });
});