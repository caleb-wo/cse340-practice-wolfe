import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Variable Declaration

/**
 * Declare important (semi-global) variables
 */
const PORT = process.env.PORT || 3000;

// Create __dirname and __filename variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// -------------------- //


 
const app = express();
/**
 * Routes
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/views/home.html'));
});
 
app.get('/page1', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/views/page1.html'));
});
 
app.get('/page2', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/views/page2.html'));
});
 
const name = process.env.NAME; // <-- NEW
 
app.get('/', (req, res) => {
    res.send(`Hello, ${name}!`); // <-- UPDATED
});
 
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
