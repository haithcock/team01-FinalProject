const request = require('supertest');
const express = require('express');
const router = require('../routes/index');
const orderModel = require('../models/order');

const app = express();
app.use('/', router);

jest.mock('../models/order'); //simulate the order model

//Get All orders
describe('Test on Get /orders api endpoint', () => {

    test('Should get all orders', async () => {

        //Simulate the getAll function to return list of orders
        orderModel.getAll.mockResolvedValue([
            {
                "_id": "68989f2e239e87abb572654f",
                "orderItems": [
                {
                    "menuItemId": "68989deec5b5fb5fd78e2c2b",
                    "quantity": 21
                },
                {
                    "menuItemId": "68989deec5b5fb5fd78e2c2b",
                    "quantity": 4
                }
                ],
                "orderStatus": "Preparing",
                "orderType": "Take-out",
                "createdAt": "2025-08-10T13:31:26.962Z"
            }
        ]);

        const res = await request(app).get('/orders');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('When there are not orders in the database', async () => {
        //Simulate empty orders list
        orderModel.getAll.mockResolvedValue([]);

        const res = await request(app).get('/orders');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(0);
    });

    test('When Something went wrong', async () => {
        //Simulate error throw
        orderModel.getAll.mockRejectedValue(new Error('Something went wrong'));

        const res = await request(app).get('/orders');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: 'Internal Server Error' });
    });
});

//Get order by id
describe('Test on Get /order/:id api endpoint', () => {

    test('Should get order by id:68989f2e239e87abb572654f ', async () => {

        //Simulate the getById function to return an order
        const mockOrder = {
            _id: "68989f2e239e87abb572654f",
            orderItems: [
                {
                    "menuItemId": "68989deec5b5fb5fd78e2c2b",
                    "quantity": 21
                },
                {
                    "menuItemId": "68989deec5b5fb5fd78e2c2b",
                    "quantity": 4
                }
            ],
            orderStatus: "Preparing",
            orderType: "Take-out",
            createdAt: "2025-08-10T13:31:26.962Z"
        };
        orderModel.getById.mockResolvedValue(mockOrder);

        const res = await request(app).get('/orders/68989f2e239e87abb572654f');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockOrder);
    });

    test("Should show 'Order not found' by using not exited id:68956f18a49977c9f965ef4b", async () => {

        //Simulate the getById function to return "Order not found"
        const mockOrder = {
            _id: "68989f2e239e87abb572654f",
            orderItems: [
                {
                    "menuItemId": "68989deec5b5fb5fd78e2c2b",
                    "quantity": 21
                },
                {
                    "menuItemId": "68989deec5b5fb5fd78e2c2b",
                    "quantity": 4
                }
            ],
            orderStatus: "Preparing",
            orderType: "Take-out",
            createdAt: "2025-08-10T13:31:26.962Z"
        };
        orderModel.getById.mockResolvedValue(mockOrder);

        // Simulate that the getById function returns the mock order only if the IDs match
        orderModel.getById.mockImplementation((id) => {
            if (id.toString() === "68989f2e239e87abb572654f") {
                return Promise.resolve(mockOrder);
            } else {
                return Promise.resolve(null);  // Return null if ID doesn't match
            }
        });

        const res = await request(app).get('/orders/68956f18a49977c9f965ef4b');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({message: "Order not found"});
    });

    test('When Something went wrong', async () => {
        //Simulate error throw
        orderModel.getById.mockRejectedValue(new Error('Something went wrong'));

        const res = await request(app).get('/orders/68956f18a49977c9f965ef4a');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: 'Internal Server Error' });
    });
});