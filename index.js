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
    const auther = req.body["auther"];
    const filter = req.body["filter"];
    const printType = req.body["printType"];
    const sorting = req.body["sorting"];
    
    if(auther === "" && filter === "notSelected" && printType === "notSelected" && sorting === "notSelected")
    {
        try
        {
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}`);            
            if(response["data"]["totalItems"] > 0)
            {
                const arr = response["data"]["items"]; 
                var booksArr = [];
                for(var i = 0; i < arr.length; i++)
                {
                    booksArr.push(arr[i]["volumeInfo"]);
                }
                res.render("search.ejs",{books : booksArr});
            }else
            {
                res.render("error.ejs",{error : "No result found."});
            }
        }catch(err)
        {
            res.render("error.ejs",{error : err});
        }
    }else
    {
        var url = `https://www.googleapis.com/books/v1/volumes?q=${title}`;
        if(auther !== "")
        {
            url += `+inauthor:${auther}`;
        }
        if(filter !== "notSelected")
        {
            url += `&filter=${filter}`;
        }
        if(printType !== "notSelected")
        {
            url += `&printType=${printType}`;
        }
        if(sorting !== "notSelected")
        {
            url += `&orderBy=${sorting}`;
        }
        url += `&key=${process.env.GOOGLE_BOOKS_API}`;

        try
        {
            const response = await axios.get(url);            
            if(response["data"]["totalItems"] > 0)
            {
                const arr = response["data"]["items"];        
                var booksArr = [];
                for(var i = 0; i < arr.length; i++)
                {
                    booksArr.push(arr[i]["volumeInfo"]);
                }
                res.render("search.ejs",{books : booksArr});
            }else
            {
                res.render("error.ejs",{error : "No result found."});
            }
        }catch(err)
        {
            res.render("error.ejs",{error : err});
        }
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