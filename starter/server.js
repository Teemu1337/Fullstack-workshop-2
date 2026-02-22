console.log("__dirname:", __dirname);
console.log("PUBLIC_DIR:", PUBLIC_DIR);

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    try {
        let filePath;
        if (req.url === '/') {
            filePath = path.join(PUBLIC_DIR, 'index.html');
        }
        else if (req.url === '/about') {
            filePath = path.join(PUBLIC_DIR, 'about.html');
        }
        else if (req.url === '/contact') {
             filePath = path.join(PUBLIC_DIR, 'contact.html');
        }
        // TODO: Add 'else if' for '/about' -> 'about.html'
        // Example: else if (req.url === '/about') { filePath = path.join(PUBLIC_DIR, 'about.html'); }
        
        
        // TODO: Add 'else if' for '/contact' -> 'contact.html'
        
        
        // ========================================
        // TODO: Task 4 - Serve CSS Files
        // ========================================
        // Handle requests for CSS files from /styles/ folder
        // Uncomment and complete the security check:
        
        /*
        else if (req.url.startsWith('/styles/')) {
            filePath = path.join(PUBLIC_DIR, req.url);
            
            // Security: Prevent path traversal attacks (../ in URL)
            const normalizedPath = path.normalize(filePath);
            if (!normalizedPath.startsWith(PUBLIC_DIR)) {
                handle404(res);
                return;
            }
        }
        */
        else {
            // No route matched -> 404
            handle404(res);
            return;
        }


        
        const extname = path.extname(filePath);
        const contentType = MIME_TYPES[extname] || 'text/html';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    handle404(res);
                } else {
                    handleServerError(res, err);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });

    } catch (error) {
        handleServerError(res, error);
    }
});


// ========================================
// TODO: Task 5 - Error Handling Functions
// ========================================

// Function to handle 404 errors (Page Not Found)
function handle404(res) {
    // Step 1: Create the path to 404.html
    const notFoundPath = path.join(PUBLIC_DIR, '404.html');
    
    // Step 2: Try to read and serve the 404.html file
    // TODO: Use fs.readFile() to read notFoundPath
    // If successful: Send 404 status with the HTML content
    // If failed: Send 404 status with plain text "404 - Page Not Found"
    
    // Example structure:
    /*
    fs.readFile(notFoundPath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - Page Not Found');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
    */
}

// Function to handle 500 errors (Server Error)
function handleServerError(res, error) {
    // Step 1: Log the error to the console
    // TODO: Use console.error() to log the error
    
    
    // Step 2: Create the path to 500.html
    const serverErrorPath = path.join(PUBLIC_DIR, '500.html');
    
    // Step 3: Try to read and serve the 500.html file
    // TODO: Similar to handle404, read serverErrorPath and serve it
    // If successful: Send 500 status with the HTML content
    // If failed: Send 500 status with plain text "500 - Internal Server Error"
    
}


server.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
