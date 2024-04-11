const http = require('http');
const port = 3000;
const connectToMongo = require('./db');
const {signUp,login} = require('./routes/auth');


const server = http.createServer(async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    //get the request body
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async() => {
        console.log(body)
        req.body = await JSON.parse(body);

        try {

            const url = req.url;
    
            switch (url) {
                case '/api/signup':
                    // Handle signup API
                    signUp(req, res);
                    break;
                case '/api/signin':
                    // Handle login API
                    login(req, res);
                    break;
                default:
                    res.writeHead(404);
                    res.end('Not Found');
                    break;
            }
        } catch (err) {
            console.error('Error occurred:', err);
            res.writeHead(500);
            res.end('Internal Server Error');
        }



    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});