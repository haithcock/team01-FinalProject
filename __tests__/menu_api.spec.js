const request = require('supertest');
const express = require('express');
const router = require('../routes/index');
const menuModel = require('../models/menu');

const app = express();
app.use('/', router);

jest.mock('../models/menu'); //simulate the menu model

//Get All menus
describe('Test on Get /menus api endpoint', () => {

    test('Should get all menus', async () => {

        //Simulate the getAll function to return list of menus
        menuModel.getAll.mockResolvedValue([
            {
                "_id": "688a49c904c8472efa4f66c9",
                "name": "Pancit Bihon",
                "description": "Rice noodles sautéed with vegetables and meat.",
                "imageUrl": "/images/pancit.jpg",
                "price": 120,
                "category": "Noodles",
                "servingSize": "1 plate",
                "createdAt": "2025-07-02T10:30:00"
            },
            {
                "_id": "689209f39190b682306aa5c7",
                "name": "Sinigang na Baboy",
                "description": "Filipino pork soup with a tangy tamarind broth, mixed with fresh vegetables.",
                "imageUrl": "/images/sinigang.jpg",
                "price": 320,
                "category": "Main Dish",
                "servingSize": "1 bowl"
            }
        ]);

        const res = await request(app).get('/menu');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('When there are not menus in the database', async () => {
        //Simulate empty menus list
        menuModel.getAll.mockResolvedValue([]);

        const res = await request(app).get('/menu');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(0);
    });

    test('When Something went wrong', async () => {
        //Simulate error throw
        menuModel.getAll.mockRejectedValue(new Error('Something went wrong'));

        const res = await request(app).get('/menu');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: 'Internal Server Error' });
    });
});

//Get menu by id
describe('Test on Get /menu/:id api endpoint', () => {

    test('Should get menu by id:688a49c904c8472efa4f66c9 ', async () => {

        //Simulate the getById function to return an menu
        const mockMenu = {
            _id: "688a49c904c8472efa4f66c9",
            name: "Pancit Bihon",
            description: "Rice noodles sautéed with vegetables and meat.",
            imageUrl: "/images/pancit.jpg",
            price: 120,
            category: "Noodles",
            servingSize: "1 plate",
            createdAt: "2025-07-02T10:30:00"
        };
        menuModel.getById.mockResolvedValue(mockMenu);

        const res = await request(app).get('/menu/688a49c904c8472efa4f66c9');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockMenu);
    });

    test("Should show 'Menu not found' by using not exited id:68956f18a49977c9f965ef4b", async () => {

        //Simulate the getById function to return "Menu not found"
         const mockMenu = {
            _id: "688a49c904c8472efa4f66c9",
            name: "Pancit Bihon",
            description: "Rice noodles sautéed with vegetables and meat.",
            imageUrl: "/images/pancit.jpg",
            price: 120,
            category: "Noodles",
            servingSize: "1 plate",
            createdAt: "2025-07-02T10:30:00"
        };
        menuModel.getById.mockResolvedValue(mockMenu);

        // Simulate that the getById function returns the mock menu only if the IDs match
        menuModel.getById.mockImplementation((id) => {
            if (id.toString() === "688a49c904c8472efa4f66c9") {
                return Promise.resolve(mockMenu);
            } else {
                return Promise.resolve(null);  // Return null if ID doesn't match
            }
        });

        const res = await request(app).get('/menu/68956f18a49977c9f965ef4b');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({message: "Menu not found"});
    });

    test('When Something went wrong', async () => {
        //Simulate error throw
        menuModel.getById.mockRejectedValue(new Error('Something went wrong'));

        const res = await request(app).get('/menu/68956f18a49977c9f965ef4a');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: 'Internal Server Error' });
    });
});