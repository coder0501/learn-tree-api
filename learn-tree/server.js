
// Necessary imports
import sequelize from "./config/config.js";
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import setupRoutes from "./routes/index.js";
import cors from 'cors';
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer(); // Initialize multer for parsing multipart data

dotenv.config();


// app.use(upload.none()); // Parse non-file fields from multipart/form-data

// Import and set up routes
setupRoutes(app); // Pass the Express app to the function

// Enable CORS
app.use(cors());
// Middleware to parse URL-encoded data (for form submissions, etc.)
// app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// Create __dirname equivalent
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Listening on Port 5000
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
