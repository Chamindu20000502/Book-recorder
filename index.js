import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended : true}));

app.get("/",async(req,res)=>{
    const title = req.body["title"];
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}`);
    const arr = response["data"]["items"];
    for(var i = 0; i < arr.length; i++)
    {
        console.log(arr[i]["volumeInfo"]);
    }
});

app.listen(port,()=>{
    console.log("app is listening on port + " + port);
});