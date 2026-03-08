const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SB Stocks API",
      version: "1.0.0",
      description: "API documentation for SB Stocks project",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development Server",
      },
      {
        url: process.env.API_URL || "http://localhost:5000/api",
        description: "Current Environment Server",
      },
      {
        url: "https://api.sbstocks.com/api",
        description: "Production Server",
      },
      {
        url: "https://staging-api.sbstocks.com/api",
        description: "Staging Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;