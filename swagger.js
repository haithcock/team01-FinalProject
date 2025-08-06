const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        title: 'Users Api',
        description: 'Users Api',
    },
    host: 'team01-finalproject-xyot.onrender.com',
    schemes: ['http','https']
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];

swaggerAutogen(outputFile,endpointFiles,doc);