const helper = require('../app/functions.helper');

describe('Test the exchange rate between EURO and USD', ()=>{
    it('Should return 1.1221 for date 2020-01-01 (1 EUR === 1.1221 USD)', ()=>{
        helper.getExchangeRate('2020-01-01', 'USD').then(result => {
            expect(result).toBe(1.1221);
        });
    });
})

describe('Test Rule #1: Default pricing', ()=>{
    it('Should return 2.50€ if amount is 500.00€', ()=>{
        let result = helper.calculateDefaultCommission('500.00', 1)
        expect(result).toBe(2.50);
    });
    it('Should return 0.05€ if amount is 0.50€', ()=>{
        let result = helper.calculateDefaultCommission('0.50', 1)
        expect(result).toBe(0.05);
    });
})

describe('Test Rule #2: Client with a discount', ()=>{
    it('Should return 0.05€ if client_id is 42', ()=>{
        let result = helper.calculateClientDiscount(42, 1)
        expect(result).toBe(0.05);
    });
    it('Should return Infinity if client_id is not 42', ()=>{
        let result = helper.calculateClientDiscount(1, 1)
        expect(result).toBe(Infinity);
    });
})

describe('Test Rule #3: High turnover discount', ()=>{
    it('-1st transaction - 20 EUR, should return Infinity', ()=>{
        let result = helper.calculateTransactionTurnover(42, 20, '2020-01-01', 1)
        expect(result).toBe(Infinity);
    });
    it('-2nd transaction - 987 EUR, should return Infinity', ()=>{
        let result = helper.calculateTransactionTurnover(42, 987, '2020-01-01', 1)
        expect(result).toBe(Infinity);
    });
    it('-3rd transaction - 50 EUR, should return 0.03', ()=>{
        let result = helper.calculateTransactionTurnover(42, 987, '2020-01-01', 1)
        expect(result).toBe(0.03);
    });
    it('-4th transaction - 800 EUR but Month changed, should return Infinity', ()=>{
        let result = helper.calculateTransactionTurnover(42, 987, '2020-02-01', 1)
        expect(result).toBe(Infinity);
    });
    helper.resetMockDB();
})

