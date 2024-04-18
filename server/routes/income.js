const connectToMongo = require("../db");

const addIncome = async(req,res) =>{
    try{

        //connect to the database
        const client = await connectToMongo();
        const db = await client.db('xmeter');
        const income = await db.collection('income');

        //extract the request body
        const {email, incomeName, amount, source, date} = req.body;

        //validate the request
        if(!email || !incomeName || !amount || !source){
            res.writeHead(400);
            res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
            return;
        }

        //insert the income
        const result = await income.insertOne({
            email: email,
            incomeName: incomeName,
            amount: amount,
            source: source,
            insertedAt: date ||  new Date()
        });

        if(!result.acknowledged){
            throw new Error('Failed to insert income');
        }

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Income added successfully' }));

    }catch(err){
        console.error('Error occurred:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
    }
}

module.exports = {addIncome}; 