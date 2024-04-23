const connectToMongo = require("../db");

const addRemainder = async(req,res) =>{
    if(req.method !== "POST"){
        res.writeHead(404);
        res.end("Method not allowed");
        return;
    }
    try{
        const {subject, amount,sentTo, date} = req.body;
        if(!subject || !amount || !sentTo || !date){
            res.writeHead(400);
            res.end("All fields are mandatory");
            return;
        }

        //convert date to object
        //set date 1 day ahead
        const dateObj = new Date(date);
        dateObj.setHours(0,0,0,0);
        const currentDate = new Date();
        currentDate.setHours(0,0,0,0);

        if(dateObj > currentDate){
            res.writeHead(400);
            res.end(JSON.stringify({success: false, message: "Date cannot be in the future"}));
            return;
        }

        if(sentTo === req.user.email){
            res.writeHead(400);
            res.end(JSON.stringify({success: false, message: "You cannot send a remainder to yourself"}));
            return;
        }

        const client = await connectToMongo();
        const db = client.db("xmeter");

        //check if user exists
        const checkUser = await db.collection("users").findOne({email: sentTo});
        if(!checkUser){
            res.writeHead(400);
            res.end(JSON.stringify({success: false, message: "User does not exist"}));
            return;
        }

        //add remainder
        const remainderCollection = await db.collection("remainders");
        const remainder = {
            subject,
            amount,
            sentTo,
            date: dateObj,
            sentBy: req.user.email,
            insertedAt: currentDate
        };
        const response = await remainderCollection.insertOne(remainder);

        console.log(response);
        if(response?.acknowledged !== true){
            throw new Error("Failed to add remainder");
        }


        res.writeHead(200);
        res.end(JSON.stringify({success: true, message: "Remainder added successfully"}));
    }catch(err){
        console.log(err);
        res.writeHead(500);
        res.end(JSON.stringify({success: false, message: "Failed to add remainder"}));
    }
}

//get remainders by user by limit and sorted by date
const getRemainders = async(req,res) =>{
    if(req.method !== "POST"){
        res.writeHead(404);
        res.end("Method not allowed");
        return;
    }
    try{
        const limit = req.url.split("/").pop();
        //if limit is not provided, set to all
        const limitVal = limit ? parseInt(limit) : 0;
        if(limitVal < 0){
            res.writeHead(400);
            res.end(JSON.stringify({success: false, message: "Invalid limit value"}));
            return;
        }


        const client = await connectToMongo();
        const db = client.db("xmeter");

        if(limitVal === 0){
            const remainders = await db.collection("remainders").find({sentTo: req.user.email}).sort({date: 1}).toArray();
            res.writeHead(200);
            res.end(JSON.stringify({success: true, remainders}));
            return;
        }

        const remainders = await db.collection("remainders").find({sentTo: req.user.email}).sort({date: 1}).limit(limitVal).toArray();
        res.writeHead(200);
        res.end(JSON.stringify({success: true, remainders}));
    }catch(err){
        console.log(err);
        res.writeHead(500);
        res.end(JSON.stringify({success: false, message: "Failed to get remainders"}));
    }
}

//get remainders sent by user by limit and sorted by date
const getSentRemainders = async(req,res) =>{
    if(req.method !== "POST"){
        res.writeHead(404);
        res.end("Method not allowed");
        return;
    }
    try{
        const limit = req.url.split("/").pop();
        //if limit is not provided, set to all
        const limitVal = limit ? parseInt(limit) : 0;
        if(limitVal < 0){
            res.writeHead(400);
            res.end(JSON.stringify({success: false, message: "Invalid limit value"}));
            return;
        }

        const client = await connectToMongo();
        const db = client.db("xmeter");
        
        if(limitVal === 0){
            const remainders = await db.collection("remainders").find({sentBy: req.user.email}).sort({date: 1}).toArray();
            res.writeHead(200);
            res.end(JSON.stringify({success: true, remainders}));
            return;
        }

        const remainders = await db.collection("remainders").find({sentBy: req.user.email}).sort({date: 1}).limit(limitVal).toArray();
        res.writeHead(200);
        res.end(JSON.stringify({success: true, remainders}));
    }
    catch(err){
        console.log(err);
        res.writeHead(500);
        res.end(JSON.stringify({success: false, message: "Failed to get remainders"}));
    }
};


module.exports = {addRemainder, getRemainders, getSentRemainders};