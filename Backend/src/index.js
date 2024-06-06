// Entry point of our application

// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import {connectDB} from "./db/index.js"
import {app} from "./app.js"

dotenv.config({
    path: "./.env"
})

connectDB()
.then(()=>{
    app.on("error", (error)=>{   // listening to an event of error
        console.log("ERR: ", error);
        throw error;
    })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log('Server is listening at port: ', process.env.PORT);
    })
})
.catch(err=>{
    console.log("ERROR!!MongoDB connection failed!", err);
})























/* // first way of connecting to the database

import express from "express";
const app = express();

// function connectDB(){}  // ONE WAY TO CONNECT
// connectDB(); 

// using Immediately Invoked Function Expressions (IIFEs)

;(async ()=>{   // ; for safety purposes
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        // after db connection we can see sometimes listeners, which are contained in the express app
        app.on("error", (error)=>{   // listening to an event of error
            console.log("ERR: ", error);
            throw error;
        })

        app.listen(process.env.PORT, ()=>{
            console.log("App is listening on port ", process.env.PORT);
        })
    } catch (error) {
        console.error("Error: ", error);
        throw error
    }
})()
*/