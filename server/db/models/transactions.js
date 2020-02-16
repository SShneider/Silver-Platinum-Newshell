"use strict";

const Sequelize = require("sequelize");
const db = require("../db");

const Transaction = db.define(
    "transaction",
    {
        ticker: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        priceAtTransaction:{
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        dateOfTransaction:{
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        sold:{
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate:{
                min:{
                    args: [0],
                    msg: "Must be a valid amount"
                }
            }
        }
    }
)

module.exports = Transaction;