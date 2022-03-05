const axios = require('axios');
const mockDB = require('./mockup_db.json');
const fs = require('fs');
const DEFAULT_PERC = 0.5;
const MIN_RATE = 0.05;

const getExchangeRate = async(date, currency) => {
    let result = await axios.get(`https://api.exchangerate.host/${date}`);
    return await result.data.rates[currency];
}
const calculateDefaultCommission = (amount) => {
    if ((amount / 100) * DEFAULT_PERC < MIN_RATE)
        return MIN_RATE;
    let result = (amount / 100) * DEFAULT_PERC;
    return parseFloat(result.toFixed(2));
}
const calculateClientDiscount = (client_id) => {
    if( client_id === 42){
        return MIN_RATE;
    }
    return Infinity;
}
const calculateTransactionTurnover = (client_id, amount, date) => {
    let row = mockDB.find(item => item.client_id === client_id)
    let previous_date = new Date(row.updated).getMonth();
    let current_date = new Date(date).getMonth();
    row.total_transactions += parseFloat(amount);
    row.updated = date;
    let result = row.month_transaction_turnover >= 1000 ? 0.03 : Infinity
    if (previous_date !== current_date){
        result = Infinity;
        row.month_transaction_turnover = parseFloat(amount);
    }else{
        row.month_transaction_turnover += parseFloat(amount);
    }
    fs.writeFileSync('./app/mockup_db.json', JSON.stringify(mockDB));
    return parseFloat(result.toFixed(2));
}

const resetMockDB = () => {
    mockDB.forEach(item => {
        item.total_transactions = 0;
        item.month_transaction_turnover = 0;
        item.updated = '2021-01-01';
    });
    fs.writeFileSync('./app/mockup_db.json', JSON.stringify(mockDB));
}

module.exports = {  getExchangeRate, calculateDefaultCommission, calculateClientDiscount, calculateTransactionTurnover, resetMockDB };