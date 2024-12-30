import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();

const development = {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
}

// Sequelize to authenticate and connect to the database.
const sequelize = new Sequelize(development.url, {
    dialect: 'postgres'
});

sequelize.authenticate()
    .then(() => console.log("Connected to the Postgre Database..."))
    .catch((err) => console.error("Unable to connect to the database", err));

export default sequelize;
