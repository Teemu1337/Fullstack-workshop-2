
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'starter', 'public');


console.log("__dirname:", __dirname);
console.log("PUBLIC_DIR:", PUBLIC_DIR);

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json'
};

function handle404(res) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Page Not Found</h1>');
}

function handleServerError(res, error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end('<h1>500 - Internal Server Error</h1>');
}

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
        else if (req.url.startsWith('/styles/')) {
            filePath = path.join(PUBLIC_DIR, req.url);
    
            const normalizedPath = path.normalize(filePath);
    
        if (!normalizedPath.startsWith(PUBLIC_DIR)) {
        console.log("SECURITY: Path traversal attempt blocked!");
        return handle404(res);
        }
         filePath = normalizedPath;
        }

        console.log("Attempting to read:", filePath);

        const extname = path.extname(filePath);
        const contentType = MIME_TYPES[extname] || 'text/html';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                console.error("Error reading file:", err);
                if (err.code === 'ENOENT') {
                    const notFoundPath = path.join(PUBLIC_DIR, '404.html');
                    fs.readFile(notFoundPath, (err404, content404) => {
                        if (err404) {
                            handle404(res);
                        } else {
                            res.writeHead(404, { 'Content-Type': 'text/html' });
                            res.end(content404, 'utf-8');
                        }
                    });
                } else {
                    handleServerError(res, err);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });

    } catch (error) {
        console.error("Unexpected error:", error);
        handleServerError(res, error);
    }
});

server.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});