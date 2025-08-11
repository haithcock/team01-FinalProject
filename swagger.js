const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        title: 'Users Api',
        description: 'Users Api',
    },
    host: 'https://team01-finalproject.onrender.com',
    schemes: ['http','https']
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];

swaggerAutogen(outputFile,endpointFiles,doc);