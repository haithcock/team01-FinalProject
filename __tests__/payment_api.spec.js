const request = require('supertest');
const express = require('express');
const router = require('../routes/index');
const paymentModel = require('../models/payment');

const app = express();
app.use('/', router);

jest.mock('../models/payment'); //simulate the payment model

//Get All payments
describe('Test on Get /payments api endpoint', () => {

    test('Should get all payments', async () => {

        //Simulate the getAll function to return list of payments
        paymentModel.getAll.mockResolvedValue([
            {
                "_id": "6894b3e63d489a340bcd80f7",
                "orderId": "689497e7e7b658a6634a89e0",
                "subtotal": 780,
                "tax": 78,
                "total": 858,
                "isPaid": "true",
                "paymentMethod": "Credit Card",
                "createdAt": "2025-08-07T14:10:46.365Z"
            },
            {
                "_id": "6898aab264cc0d2d510e22fb",
                "orderId": "68989f2e239e87abb572654f",
                "subtotal": 0,
                "tax": 0,
                "total": 0,
                "isPaid": false,
                "paymentMethod": "Credit Card",
                "createdAt": "2025-08-10T14:20:34.452Z"
            }
        ]);

        const res = await request(app).get('/payment');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('When there are not payments in the database', async () => {
        //Simulate empty payments list
        paymentModel.getAll.mockResolvedValue([]);

        const res = await request(app).get('/payment');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(0);
    });

    test('When Something went wrong', async () => {
        //Simulate error throw
        paymentModel.getAll.mockRejectedValue(new Error('Something went wrong'));

        const res = await request(app).get('/payment');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: 'Internal Server Error' });
    });
});

//Get payment by id
describe('Test on Get /payment/:id api endpoint', () => {

    test('Should get payment by id:6894b3e63d489a340bcd80f7 ', async () => {

        //Simulate the getById function to return an payment
        const mockPayment = {
            _id: "6894b3e63d489a340bcd80f7",
            orderId: "689497e7e7b658a6634a89e0",
            subtotal: 780,
            tax: 78,
            total: 858,
            isPaid: "true",
            paymentMethod: "Credit Card",
            createdAt: "2025-08-07T14:10:46.365Z"
        };
        paymentModel.getById.mockResolvedValue(mockPayment);

        const res = await request(app).get('/payment/6894b3e63d489a340bcd80f7');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockPayment);
    });

    test("Should show 'Payment not found' by using not exited id:68956f18a49977c9f965ef4b", async () => {

        //Simulate the getById function to return "Payment not found"
        const mockPayment = {
            _id: "6894b3e63d489a340bcd80f7",
            orderId: "689497e7e7b658a6634a89e0",
            subtotal: 780,
            tax: 78,
            total: 858,
            isPaid: "true",
            paymentMethod: "Credit Card",
            createdAt: "2025-08-07T14:10:46.365Z"
        };
        paymentModel.getById.mockResolvedValue(mockPayment);

        // Simulate that the getById function returns the mock payment only if the IDs match
        paymentModel.getById.mockImplementation((id) => {
            if (id.toString() === "6894b3e63d489a340bcd80f7") {
                return Promise.resolve(mockPayment);
            } else {
                return Promise.resolve(null);  // Return null if ID doesn't match
            }
        });

        const res = await request(app).get('/payment/68956f18a49977c9f965ef4b');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({message: "Payment not found"});
    });

    test('When Something went wrong', async () => {
        //Simulate error throw
        paymentModel.getById.mockRejectedValue(new Error('Something went wrong'));

        const res = await request(app).get('/payment/68956f18a49977c9f965ef4a');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: 'Internal Server Error' });
    });
});