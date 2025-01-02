import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import env from "dotenv";

const app = express();
const port = 3000;

env.config();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));


app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.post("/",async(req,res)=>{
    const title = req.body["title"];
    try
    {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}`);
        const arr = response["data"]["items"];
        var booksArr = [];
        for(var i = 0; i < arr.length; i++)
        {
            booksArr.push(arr[i]["volumeInfo"]);
        }
        res.render("search.ejs",{books : booksArr});
    }catch(err)
    {
        console.log(err);
    }
});

app.get("/test",async (req,res)=>{
    try
    {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=${process.env.GOOGLE_BOOKS_API}`);
        console.log(response["data"]["items"][0]["volumeInfo"]);
    }catch(err)
    {
        console.log(err);
    }
});

app.post("/filter",async (req,res)=>{
    const title = req.body["title"];
    const filter = req.body["filter"];
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}&filter=${filter}&key=${process.env.GOOGLE_BOOKS_API}`);
    console.log(response["data"]["items"][0]["volumeInfo"]);
});

app.listen(port,()=>{
    console.log("app is listening on port + " + port);
});