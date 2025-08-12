const request = require('supertest');
const express = require('express');
const router = require('../routes/index');
const userModel = require('../models/user');

const app = express();
app.use('/', router);

jest.mock('../models/user'); //simulate the user model

//Get All users
describe('Test on Get /users api endpoint', () => {

    test('Should get all users', async () => {

        //Simulate the getAll function to return list of users
        userModel.getAll.mockResolvedValue([
            {
                "_id": "68956f18a49977c9f965ef4a",
                "userName": "hasdfha",
                "email": "hasdfhas@gmail.com",
                "role": "client"
            },
            {
                "_id": "689614ed1ad8b4186929ae3e",
                "userName": "any",
                "email": "hasd324fhas@gmail.com",
                "role": "kitchen"
            }
        ]);

        const res = await request(app).get('/users');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('When there are not users in the database', async () => {
        //Simulate empty users list
        userModel.getAll.mockResolvedValue([]);

        const res = await request(app).get('/users');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(0);
    });

    test('When Something went wrong', async () => {
        //Simulate error throw
        userModel.getAll.mockRejectedValue(new Error('Something went wrong'));

        const res = await request(app).get('/users');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: 'Internal Server Error' });
    });
});

//Get user by id
describe('Test on Get /users/:id api endpoint', () => {

    test('Should get user by id:68956f18a49977c9f965ef4a ', async () => {

        //Simulate the getById function to return an user
        const mockUser = {
            _id: "68956f18a49977c9f965ef4a",
            userName: "hasdfha",
            email: "hasdfhas@gmail.com",
            role: "client",
        };
        userModel.getById.mockResolvedValue(mockUser);

        const res = await request(app).get('/users/68956f18a49977c9f965ef4a');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockUser);
    });

    test("Should show 'User not found' by using not exited id:68956f18a49977c9f965ef4b", async () => {

        //Simulate the getById function to return an user
        const mockUser = {
            _id: "68956f18a49977c9f965ef4a",
            userName: "hasdfha",
            email: "hasdfhas@gmail.com",
            role: "client",
        };
        userModel.getById.mockResolvedValue(mockUser);

        // Simulate that the getById function returns the mock user only if the IDs match
        userModel.getById.mockImplementation((id) => {
            if (id.toString() === "688a49c904c8472efa4f66c9") {
                return Promise.resolve(mockMenu);
            } else {
                return Promise.resolve(null);  // Return null if ID doesn't match
            }
        });

        const res = await request(app).get('/users/68956f18a49977c9f965ef4b');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({message: "User not found"});
    });

    test('When Something went wrong', async () => {
        //Simulate error throw
        userModel.getById.mockRejectedValue(new Error('Something went wrong'));

        const res = await request(app).get('/users/68956f18a49977c9f965ef4a');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: 'Internal Server Error' });
    });
});