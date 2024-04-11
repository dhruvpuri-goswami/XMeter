const bcrypt = require('bcrypt');
const connectToMongo = require('../db');

const signUp = async (req, res) => {
    try {

        //connect to the database
        const client = await connectToMongo();
        // Extract the password from the request body
        const { name, email, password } = req.body;

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        // Create a new user object with the hashed password
        const newUser = {
            name: name,
            email: email,
            password: hashedPassword
        };

        // Insert the new user into the database
        const db = await client.db("xmeter");
        const result = await db.collection("users").insertOne(newUser);

        if(!result.acknowledged) {
            throw new Error('Failed to insert user');
        }
        
        // Send response
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, user:{
            name: name,
            email: email
        } }));
    } catch (err) {
        console.error('Error occurred:', err);
        res.writeHead(500);
        res.end('Internal Server Error');
    }
}

//login logic
const login = async (req, res) => {
    try {
        //connect to the database
        const client = await connectToMongo();
        // Extract the email and password from the request body
        const { email, password } = req.body;

        // Find the user with the email
        const db = await client.db("xmeter");
        const user = await db.collection("users").findOne({ email: email });

        if(!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: 'User not found' }));
            return;
        }

        // Compare the password
        const match = await bcrypt.compare(password, user.password);

        if(!match) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: 'Invalid password' }));
            return;
        }

        // Send response
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, user: {
            name: user.name,
            email: user.email
        } }));
    } catch (err) {
        console.error('Error occurred:', err);
        res.writeHead(500);
        res.end('Internal Server Error');
    }
}

module.exports = { signUp, login };
