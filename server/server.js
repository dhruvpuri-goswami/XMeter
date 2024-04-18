const http = require('http');
const port = 3000;
const connectToMongo = require('./db');
const {signUp,login, logout} = require('./routes/auth');
const { addExpense, getExpenses, getMonthlyExpenses } = require('./routes/expense');
const { addIncome } = require('./routes/income');


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
        
        try {
            const url = req.url;

            if(req.method === 'POST' && req.headers['content-type'] === 'application/json') {
                req.body = await JSON.parse(body);
            }

            if (url === '/api/signup') {
                // Handle signup API
                signUp(req, res);
            } else if (url === '/api/signin') {
                // Handle login API
                login(req, res);
            } else if (url === '/api/logout') {
                // Handle logout API
                logout(req, res);
            } else if (url === '/api/add-expense') {
                // Handle add expense API
                addExpense(req, res);
            } else if (url === '/api/add-income') {
                // Handle add income API
                addIncome(req, res);
            } else if (url.startsWith('/api/get-expenses')) {
                // Handle get expenses API
                getExpenses(req, res);
            } else if(url.startsWith('/api/get-monthly-expenses')) {
                // Handle get monthly expenses API
                getMonthlyExpenses(req, res);
            } else if (url === '/') {
                res.writeHead(200);
                res.end('Hello World');
            } else {
                res.writeHead(404);
                res.end('Not Found');
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