const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
    "openapi": "3.0.3",
    "info": {
        "title": "Album delle Figurine dei Supereroi API",
        "description": "Documentation for the \"Album delle Figurine dei Supereroi\" API",
        "version": "1.0.11"
    },
    "host": "localhost:3000",
    "basePath": "/",
    "tags": [
        {
        "name": "session",
        "description": "Manages log in, register and log out of users"
        },
        {
        "name": "user",
        "description": "Manages user information"
        },
        {
        "name": "credits",
        "description": "Manages user credits"
        },
        {
        "name": "cards",
        "description": "Manages getting, selling and updating cards"
        },
        {
        "name": "trades",
        "description": "Manages trades between users"
        }
    ],
    "paths": {
        /* SESSION */
        "/register": {
            "post": {
                "tags": [
                "session"
                ],
                "description": "Registers a user with the info given in the body",
                "requestBody": {
                    "description": "tuple used for registration",
                    "required": true,
                    "content": {
                        "application/Json": {
                            "schema": {
                            "$ref": "#/definitions/userRegister"
                            }   
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Returns user info",
                    },
                    "400": {
                        "description": "User input missing",
                    },
                    "500": {
                        "description": "Error fetching the database",
                    },
                }
            }
        },
        "/login": {
            "post": {
                "tags": [
                "session"
                ],
                "description": "Logs in a user with the info given in the body",
                "requestBody": {
                    "description": "tuple used for registration",
                    "required": true,
                    "content": {
                        "application/Json": {
                            "schema": {
                                "$ref": "#/definitions/userLogin"
                            }   
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Returns user info",
                    },
                    "400": {
                        "description": "User input missing",
                    },
                    "500": {
                        "description": "Error fetching the database",
                    },
                }
            }
        },

        /* USER */
        "/user/{username}": {
            "get": {
                "tags": [
                "user"
                ],
                "description": "Gets the info of the specified user",
                "parameters": [
                    {
                        "$ref": "#/definitions/username" 
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Returns user info"
                    },
                    "400": {
                        "description": "User not found"
                    }
                }
            },
            "put": {
                "tags": [
                "user"
                ],
                "description": "Updates the user info",
                "parameters": [
                    {
                        "$ref": "#/definitions/username" 
                    }
                ],
                "requestBody": {
                    "type": "object",
                    "content": {
                        "application/Json": {
                            "schema": {
                                "properties": {
                                    "email": {
                                    "type": "string",
                                    "example": "modify@example.com"
                                    },
                                    "password": {
                                    "type": "string",
                                    "example": "modify"
                                    },
                                }
                            }   
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Returns user info"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            },
            "delete": {
                "tags": [
                "user"
                ],
                "description": "Deletes the user from the database",
                "parameters": [
                    {
                        "$ref": "#/definitions/username" 
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User deleted successfully"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            }
        },
        
        /* CREDITS */
        "/credits/{username}": {
            "get": {
                "tags": [
                "credits"
                ],
                "description": "Gets the current credits of the specified user",
                "parameters": [
                    {
                        "$ref": "#/definitions/username" 
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Returns credits of the user"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            },
            "post": {
                "tags": [
                "credits"
                ],
                "description": "Updates the credits of the user by the specified amount",
                "parameters": [
                    {
                        "$ref": "#/definitions/username" 
                    }
                ],
                "requestBody": {
                    "type": "object",
                    "required": true,
                    "content": {
                        "application/Json": {
                            "schema": {
                                "properties": {
                                    "changeCredits": {
                                    "type": "integer",
                                    "example": 1
                                    }
                                }
                            }   
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Returns the updated credits of the user"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            },
        },

        /* CARDS */
        "/cards": {
            "get": {
                "tags": [
                "cards"
                ],
                "description": "Gets all the cards",
                "responses": {
                    "200": {
                        "description": "Returns complete list of cards"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            }
        },
        "/cards/{username}": {
            "get": {
                "tags": [
                "cards"
                ],
                "description": "Gets all the cards of the specified user",
                "parameters": [
                    {
                    "$ref": "#/definitions/username" 
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Returns cards of the user"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            },
            "post": {
                "tags": [
                "cards"
                ],
                "description": "Updates credits and adds cards to the specified user",
                "parameters": [
                    {
                        "$ref": "#/definitions/username" 
                    }
                ],
                "requestBody": {
                    "type": "object",
                    "required": true,
                    "content": {
                        "application/Json": {
                            "schema": {
                                "$ref": "#/definitions/cardsCredits" 
                            }   
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Returns the newly added cards"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            }
        },
        "/card/{id}": {
            "get": {
                "tags": [
                "cards"
                ],
                "description": "Gets a single card",
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "description": "Id of card",
                        "required": true,
                        "type": "integer", 
                        "default": 1017100
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Returns the card info from the database"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            }
        },
        "/card/{username}": {
            "post": {
                "tags": [
                "cards"
                ],
                "description": "Gets a single card of the user",               
                "parameters": [
                    {
                        "$ref": "#/definitions/username" 
                    }
                ],
                "requestBody": {
                    "type": "object",
                    "required": true,
                    "content": {
                        "application/Json": {
                            "schema": {
                                "$ref": "#/definitions/cardId" 
                            }   
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Returns the card of the user"
                    },
                    "400": {
                        "description": "Can't find the card of the user"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            },
            "put": {
                "tags": [
                "cards"
                ],
                "description": "Modifies the trade status of a user card",
                "parameters": [
                    {
                        "$ref": "#/definitions/username" 
                    }
                ],
                "requestBody": {
                    "type": "object",
                    "required": true,
                    "content": {
                        "application/Json": {
                            "schema": {
                                "$ref": "#/definitions/cardId" 
                            }   
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Card updated successfully"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            },
            "delete": {
                "tags": [
                "cards"
                ],
                "description": "Removes a card from the user or updates its number value. Also updates user credist",
                "parameters": [
                    {
                        "$ref": "#/definitions/username" 
                    }
                ],
                "requestBody": {
                    "type": "object",
                    "required": true,
                    "content": {
                        "application/Json": {
                            "schema": {
                                "$ref": "#/definitions/cardId" 
                            }   
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Returns user info"
                    },
                    "200": {
                        "description": "Can't sell, card is blocked in a trade"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            }
        },

        /* TRADES */
        "/allTrades": {
            "get": {
                "tags": [
                "trades"
                ],
                "description": "Gets all the trades",
                "responses": {
                    "200": {
                        "description": "Returns all trades"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            }
        },
        "/trade/{id}": {
            "get": {
                "tags": [
                "trades"
                ],
                "description": "Gets a single trade",
                "parameters": [
                    {
                        "$ref": "#/definitions/tradeId" 
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Returns the specified trade"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            },
            "delete": {
                "tags": [
                "trades"
                ],
                "description": "Deletes a trade",
                "parameters": [
                    {
                        "$ref": "#/definitions/tradeId" 
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Trade deleted successfully"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            },
        },
        "/trade": {
            "post": {
                "tags": [
                "trades"
                ],
                "description": "Adds a trade given the informations",
                "requestBody": {
                    "type": "object",
                    "required": true,
                    "content": {
                        "application/Json": {
                            "schema": {
                                "$ref": "#/definitions/addTrade" 
                            }   
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Trade created successfully"
                    },
                    "400": {
                        "description": "Missing parameters or cards can't be exchanged"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            }
        },
        "/acceptTrade/{id}": {
            "post": {
                "tags": [
                "trades"
                ],
                "description": "Accepts a trade and exchanges cards between the users",
                "parameters": [
                    {
                        "$ref": "#/definitions/tradeId" 
                    }
                ],
                "requestBody": {
                    "type": "object",
                    "required": true,
                    "content": {
                        "application/Json": {
                            "schema": {
                                "properties": {
                                    "username": {
                                    "type": "string",
                                    "example": "test"
                                    }
                                }
                            }   
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Trade successful"
                    },
                    "400": {
                        "description": "Card used is in a trade or card received is present in the album"
                    },
                    "500": {
                        "description": "Error fetching the database"
                    }
                }
            }
        }
    },

    /* DEFINITIONS */
    "definitions": {
        "userRegister": {
            "type": "object",
            "required": true,
            "properties": {
                "username": {
                "type": "string",
                "example": "test"
                },
                "email": {
                "type": "string",
                "example": "test@example.com"
                },
                "password": {
                "type": "string",
                "example": "test"
                },
                "hero": {
                "type": "string",
                "example": "1011006"
                },
                "series": {
                "type": "string",
                "example": "261"
                },
            }
        },
        "userLogin": {
            "type": "object",
            "required": true,
            "properties": {
                "username": {
                "type": "string",
                "example": "test"
                },
                "password": {
                "type": "string",
                "example": "test"
                }
            }
        },
        "username": {
            "name": "username",
            "in": "path",
            "description": "Username",
            "required": true,
            "type": "string", 
            "default": "test"
        },
        "cardsCredits": {
            "properties": {
                "cards": {
                "type": "array",
                "example": [
                    {
                        "id": 1010815,
                        "name": "New Goblin",
                        "thumbnail": "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg",
                        "number": 1,
                        "inTrade": false
                    },
                    {
                        "id": 1009290,
                        "name": "Elite",
                        "thumbnail": "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg",
                        "number": 1,
                        "inTrade": false
                    },
                    {
                        "id": 1009262,
                        "name": "Daredevil",
                        "thumbnail": "http://i.annihil.us/u/prod/marvel/i/mg/d/50/50febb79985ee.jpg",
                        "number": 1,
                        "inTrade": false
                    },
                    {
                        "id": 1009171,
                        "name": "Bastion",
                        "thumbnail": "http://i.annihil.us/u/prod/marvel/i/mg/d/80/52695253215f4.jpg",
                        "number": 1,
                        "inTrade": false
                    },
                    {
                        "id": 1009366,
                        "name": "Invisible Woman",
                        "thumbnail": "http://i.annihil.us/u/prod/marvel/i/mg/6/a0/52695b9cd40b6.jpg",
                        "number": 1,
                        "inTrade": false
                    }
                ]
                },
                "credits": {
                "type": "integer",
                "example": 1
                },
            }
        },
        "cardId": {
            "properties": {
                "id": {
                "type": "integer",
                "example": 1010815
                },
            }
        },
        "tradeId": {
            "name": "id",
            "in": "path",
            "description": "Id of trade",
            "required": true,
            "type": "string", 
            "default": "67ae6ab79e68c6aef63b3b27"
        },
        "addTrade": {
            "type": "object",
            "required": true,
            "properties": {
                "username": {
                "type": "string",
                "example": "test"
                },
                "name": {
                "type": "string",
                "example": "Title"
                },
                "receive": {
                "type": "array",
                "example":  [
                    {
                        "id": 1010815,
                        "name": "New Goblin",
                        "thumbnail": "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg",
                        "number": 1,
                        "inTrade": false
                    },
                ],
                },
                "send": {
                "type": "array",
                "example": [
                    {
                        "id": 1009290,
                        "name": "Elite",
                        "thumbnail": "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg",
                        "number": 1,
                        "inTrade": false
                    }
                ]
                }
            }
        },
    }
};

const options = {
    swaggerDefinition,
    apis: ["../../app.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;