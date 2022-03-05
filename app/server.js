const express = require('express');
const helper = require('./functions.helper');
const app = express();

app.use(express.json())

app.post("/commission/calculation", async(req, res) => {
    const {date, amount, currency, client_id} = req.body;
    if (!date || !amount || !currency || !client_id) {
        res.status(400).send({
            error: "Bad Request",
            message: "Please provide all the required parameters"
        });
        return;
    }
    let exchangeRate = 1;
    let finalAmount = amount;
    if(currency !== "EUR"){
        // TODO: Add error handling
        exchangeRate = await helper.getExchangeRate(date, currency);
        finalAmount = amount / exchangeRate;
    }
    // Rule 1: Default pricing
    let defaultPricing = helper.calculateDefaultCommission(finalAmount);
    // Rule 2: Client pricing
    let clientPricing = helper.calculateClientDiscount(client_id);
    // Rule 3: High turnover discount
    let turnoverDiscount = helper.calculateTransactionTurnover(client_id, finalAmount, date);
    let result = Math.min(defaultPricing, clientPricing, turnoverDiscount);
    res.send({
        "amount": result,
        "currency": "EUR"
    })
});

module.exports = app;