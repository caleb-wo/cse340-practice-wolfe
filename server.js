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
 * Middleware Functions 
 */

// Global middleware to measure request processing time
app.use((req, res, next) => {
    // Record the time when the request started
    const start = Date.now();
 
    /**
     * The `res` object has built-in event listeners we can use to trigger
     * actions at different points in the request/response lifecycle.
     * 
     * We will use the 'finish' event to detect when the response has been
     * sent to the client, and then calculate the time taken to process
     * the entire request.
     */
    res.on('finish', () => {
        // Calculate how much time has passed since the request started
        const end = Date.now();
        const processingTime = end - start;
 
        // Log the results to the console
        console.log(`${req.method} ${req.url} - Processing time: ${processingTime}ms`);
    });
 
    // Don't forget to call next() to continue to the next middleware
    next();
});
 
app.use((req, res, next) => {
    console.log(`Method: ${req.method}, URL: ${req.url}`);
    next(); // Pass control to the next middleware or route
});

// Global middleware to set a custom header
app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'Express Middleware Tutorial');
    next(); // Don't forget this or your request will hang!
});

app.use((req, res, next) => {
    // Get the current year for copyright notice
    res.locals.currentYear = new Date().getFullYear();

    // Add NODE_ENV for all views
    res.locals.NODE_ENV = process.env.NODE_ENV || "development";

    next();
});


// Middleware to validate display parameter
const validateDisplayMode = (req, res, next) => {
    const { display } = req.params;
    if (display !== 'grid' && display !== 'details') {
        const error = new Error('Invalid display mode: must be either "grid" or "details".');
        next(error); // Pass control to the error-handling middleware
    }
    next(); // Pass control to the next middleware or route
};

// Middleware to add a timestamp to res.locals for all views
app.use((req, res, next) => {
    // Create a formatted timestamp like "May 8, 2025 at 3:42 PM"
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
 
    // Adding to res.locals makes this available to all views automatically
    res.locals.timestamp = now.toLocaleDateString('en-US', options);
 
    next();
});
/**
 * Routes
 */
app.get('/', (req, res) => {
    const title = "Home Page";
    const content = "<h1>Welcome to the home page!</h1><p>This is the main content of the Home Page.</p>";
    res.render("index", { title, content, PORT });
});
 
app.get('/about', (req, res) => {
    const title = "About";
    const content = "<h1>This is The About page.</h1><p>Between the Home Page and Contact, it is the best.</p>";
    res.render("index", { title, content, PORT });
});
 
app.get('/contact', (req, res) => {
    const title = "Contact";
    const content = "<h1>This is Contact.</h1><p>This page is last in line for a reason. That's all you need to know.</p>";
    res.render("index", { title, content, PORT });
});

// Products page route with display mode validation
app.get('/products/:display', validateDisplayMode, (req, res) => {
    const title = "Our Products";
    const { display } = req.params;

    // MOCK Products
    const products = [
        {
            id: 1,
            name: "Kindle E-Reader",
            description: "Lightweight e-reader with a glare-free display and weeks of battery life.",
            price: 149.99,
            image: "https://picsum.photos/id/367/800/600"
        },
        {
            id: 2,
            name: "Vintage Film Camera",
            description: "Capture timeless moments with this classic vintage film camera, perfect for photography enthusiasts.",
            price: 199.99,
            image: "https://picsum.photos/id/250/800/600"
        }
    ];

    res.render('products', { title, products, display, PORT });
});
 
// Default products route (redirects to grid view)
app.get('/products', (req, res) => {
    res.redirect('/products/grid');
});

// Updated route to handle both route and query parameters
app.get('/explore/:category/:id', (req, res) => {
    // Get route parameters
    const { category, id } = req.params;
 
    // Get query parameters (optional)
    const { sort = 'default', filter = 'none' } = req.query;
 
    // Log all parameters for debugging
    console.log('Route Parameters:', req.params);
    console.log('Query Parameters:', req.query);
 
    // Set the title for the page
    const title = `Exploring ${category}`;
 
    // Render the template with all parameters
    res.render('explore', { title, category, id, sort, filter, PORT });
});

/**
 * Error Handling Middleware
 */
 
// Catch-all middleware for unmatched routes (404)
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
 
    const status = err.status || 500;
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Internal Server Error',
        error: err.message,
        stack: err.stack,
        PORT
    };
 
    // Render the appropriate template based on status code
    res.status(status).render(`errors/${status === 404 ? '404' : '500'}`, context);
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
