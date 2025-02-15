const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "AFSE_API",
        version: "1.0.0",
        description: "API for Marvel card collections and trades",
    },
};

const options = {
    swaggerDefinition,
    apis: ["./app.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;