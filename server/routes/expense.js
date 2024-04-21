const connectToMongo = require("../db");

const addExpense = async (req, res) => {
    try {
        if (req.method === 'POST') {
            const client = await connectToMongo();
            const db = await client.db('xmeter');
            const expense = await db.collection('expenses');
            const { email, expenseName, amount, category, paymentMethod, date} = req.body;

            //validate the request
            if (!email || !expenseName || !amount || !category || !paymentMethod) {
                res.writeHead(400);
                res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
                return;
            }

            //convert date to date object
            let dateObj;
            if (date !== "" && date !== undefined) {
                dateObj = new Date(date);
                if (dateObj.toString() === 'Invalid Date') {
                    res.writeHead(400);
                    res.end(JSON.stringify({ success: false, message: 'Invalid date' }));
                    return;
                }
            }

            console.log(dateObj)

            //insert the expense
            const result = await expense.insertOne({
                email: email,
                expenseName: expenseName,
                amount: amount,
                category: category,
                paymentMethod: paymentMethod,
                insertedAt: dateObj || new Date()
            });

            if (!result.acknowledged) {
                throw new Error('Failed to insert expense');
            }

            res.writeHead(200);
            res.end(JSON.stringify({ success: true, message: 'Expense added successfully',data:req.body}));
        }
        else {
            res.writeHead(405);
            res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
        }
    } catch (err) {
        console.error('Error occurred:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
    }
}


//get expenses

const getExpenses = async (req, res) => {
    try {
        if (req.method === "POST") {
            const client = await connectToMongo();
            const db = await client.db('xmeter');
            const expenses = await db.collection('expenses');

            const number = parseInt(req.url.split('/')[3]) || -1;

            const { email } = req.body;

            let result;
            if (number === -1) {
                result = await expenses.find({ email }).sort({insertedAt: -1}).toArray();
            } else {
                result = await expenses.find({ email }).sort({insertedAt: -1}).limit(number).toArray();
            }
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, expenses: result }));
        } else {
            res.writeHead(405);
            res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
        }
    } catch (err) {
        console.error('Error occurred:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
    }
}


//get past monthly expenses by taking months as input and sum them sum group by month
const getMonthlyExpenses = async (req, res) => {
    try {
        if (req.method === "POST") {
            const client = await connectToMongo();
            const db = await client.db('xmeter');
            const expenses = await db.collection('expenses');

            const months = parseInt(req.url.split('/')[3]) || 1; // Number of past months
            const { email } = req.body;

            if(!email){
                res.writeHead(400);
                res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
                return;
            }

            let result = await expenses.aggregate([
                // Match documents from the last 4 months
                {
                  $match: {
                    email: email,
                    insertedAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - months)) }
                  }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$insertedAt" }, // Group by year
                            month: { $month: "$insertedAt" } // Group by month
                        },
                        total: { $sum: "$amount" } // Calculate total spending for each month
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1 } // Sort the result by year and month
                }
            ]).toArray();

            res.writeHead(200);
            res.end(JSON.stringify({ success: true, expenses: result }));
        } else {
            res.writeHead(405);
            res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }));
        }
    } catch (err) {
        console.error('Error occurred:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
    }


}

module.exports = { addExpense, getExpenses, getMonthlyExpenses }