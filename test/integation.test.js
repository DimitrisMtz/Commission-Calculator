const app = require('../app/server');
const supertest = require('supertest');
const request = supertest(app);
const helper = require('../app/functions.helper');

describe("Trying the API endpoint /commission/calculation", () => {

    it("Should Return 0.05 EUR -- User 42, Date 2021-01-02, Amount 2000.00, Currency EUR,", async() => {
        const res = await request.post("/commission/calculation").send({
            date: "2021-01-01",
            amount: "2000.00",
            currency: "EUR",
            client_id: 42
        });
        expect(res.status).toBe(200);
        expect(res.body.amount).toBe(0.05);
        expect(res.body.currency).toBe("EUR");
    });

    it("Should Return 2.50 EUR -- User 1, Date 2021-01-03, Amount 500.00, Currency EUR", async() => {
        const res = await request.post("/commission/calculation").send({
            date: "2021-01-03",
            amount: "500.00",
            currency: "EUR",
            client_id: 1
        });
        expect(res.status).toBe(200);
        expect(res.body.amount).toBe(2.50);
        expect(res.body.currency).toBe("EUR");
    });

    it("Should Return 2.50 EUR -- User 1, Date 2021-01-04, Amount 499.00, Currency EUR", async() => {
        const res = await request.post("/commission/calculation").send({
            date: "2021-01-04",
            amount: "499.00",
            currency: "EUR",
            client_id: 1
        });
        expect(res.status).toBe(200);
        expect(res.body.amount).toBe(2.50);
        expect(res.body.currency).toBe("EUR");
    });

    it("Should Return 0.50 EUR -- User 1, Date 2021-01-05, Amount 100.00, Currency EUR", async() => {
        const res = await request.post("/commission/calculation").send({
            date: "2021-01-05",
            amount: "100.00",
            currency: "EUR",
            client_id: 1
        });
        expect(res.status).toBe(200);
        expect(res.body.amount).toBe(0.50);
        expect(res.body.currency).toBe("EUR");
    });

    it("Should Return 0.03 EUR -- User 1, Date 2021-01-06, Amount 1, Currency EUR", async() => {
        const res = await request.post("/commission/calculation").send({
            date: "2021-01-06",
            amount: "1.00",
            currency: "EUR",
            client_id: 1
        });
        expect(res.status).toBe(200);
        expect(res.body.amount).toBe(0.03);
        expect(res.body.currency).toBe("EUR");
    })

    it("Should Return 2.50 EUR -- User 1, Date 2021-02-01, Amount 500, Currency EUR", async() => {
        const res = await request.post("/commission/calculation").send({
            date: "2021-02-01",
            amount: "500.00",
            currency: "EUR",
            client_id: 1
        });
        expect(res.status).toBe(200);
        expect(res.body.amount).toBe(2.50);
        expect(res.body.currency).toBe("EUR");
    })


    helper.resetMockDB();
});