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

        //convert date to date object
        let dateObj;
        if(date !== "" && date !== undefined){
            dateObj = new Date(date);
            if(dateObj.toString() === 'Invalid Date'){
                res.writeHead(400);
                res.end(JSON.stringify({ success: false, message: 'Invalid date' }));
                return;
            }
        }

        //insert the income
        const result = await income.insertOne({
            email: email,
            incomeName: incomeName,
            amount: amount,
            source: source,
            insertedAt: dateObj ||  new Date()
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


//get monthly income
const getMonthlyIncome = async(req,res) => {
    try{
        //connect to the database
        const client = await connectToMongo();
        const db = await client.db('xmeter');
        const income = await db.collection('income');

        //extract the request body
        const {email, month, year} = req.body;

        //validate the request
        if(!email || !month || !year){
            res.writeHead(400);
            res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
            return;
        }

        //get the income
        const result = await income.find({
            email: email,
            insertedAt: {
                $gte: new Date(`${year}-${month}-01T00:00:00.000Z`),
                $lt: new Date(`${year}-${month+1}-01T00:00:00.000Z`)
            }
        }).toArray();

        res.writeHead(200);
        res.end(JSON.stringify({ success: true, income: result }));
    }catch(err){
        console.error('Error occurred:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
    }
}

const getPreviousMonthIncome = async(req,res) => {
    try {
        if (req.method === "POST") {
            const client = await connectToMongo();
            const db = await client.db('xmeter');
            const income = await db.collection('income');

            const months = parseInt(req.url.split('/')[3]) || 1; // Number of past months
            const { email } = req.body;

            let result = await income.aggregate([
                {
                    $match: {
                        email,
                        insertedAt: {
                            $gte: new Date(new Date().setMonth(new Date().getMonth() - months)),
                            $lt: new Date()
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$insertedAt" },
                        total: { $sum: "$amount" }
                    }
                }
            ]).toArray();

            res.writeHead(200);
            res.end(JSON.stringify({ success: true, income: result }));
        }else{
            res.writeHead(405);
            res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
        }
    }catch(err){
        console.error('Error occurred:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
    }
}

module.exports = {addIncome, getMonthlyIncome, getPreviousMonthIncome}; 