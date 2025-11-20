const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Floorplan-Riaz API',
    version: '1.0.0',
    description: 'API documentation for Floorplan-Riaz project',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./pages/api/**/*.js'], // Path to your API files
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(4000, () => {
  console.log('Swagger docs available at http://localhost:4000/api/docs');
});
