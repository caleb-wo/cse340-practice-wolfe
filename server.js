import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';


// Variable Declaration
const app = express();

/**
 * Declare important (semi-global) variables
 */
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "production";

// Create __dirname and __filename variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// -------------------- //

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS
app.set('view engine', 'ejs');
 
// Set the views directory (where your templates are located)
app.set('views', path.join(__dirname, 'src/views'));
 
/**
 * Routes
 */
app.get('/', (req, res) => {
    const title = "Home Page";
    const content = "<h1>Welcome to the home page!</h1><p>This is the main content of the Home Page.</p>";
    res.render("index", { title, content, NODE_ENV, PORT });
});
 
app.get('/about', (req, res) => {
    const title = "About";
    const content = "<h1>This is The About page.</h1><p>Between the Home Page and Contact, it is the best.</p>";
    res.render("index", { title, content, NODE_ENV, PORT });
});
 
app.get('/contact', (req, res) => {
    const title = "Contact";
    const content = "<h1>This is Contact.</h1><p>This page is last in line for a reason. That's all you need to know.</p>";
    res.render("index", { title, content, NODE_ENV, PORT });
});

if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');
 
    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });
 
        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });
 
        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}
 
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
