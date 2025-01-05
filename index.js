import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import env from "dotenv";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const hashingRounds =10;

env.config();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

const db = new pg.Client({
    user : process.env.DB_USER,
    host : process.env.DB_HOST,
    database : process.env.DB_DATABASE,
    password : process.env.DB_PASSWORD,
    port : 5432
});

db.connect();


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

app.post("/register",(req,res)=>{
    const username = req.body["username"];
    const name = req.body["name"];
    const pw = req.body["password"];

    bcrypt.hash(pw,hashingRounds,async(err,hash)=>{
        if(!err)
        {
            try
            {
                await db.query("insert into users (username,name,password) values ($1,$2,$3)",[username,name,hash]);
            }catch(err_1)
            {
                res.render("error.ejs",{error : err_1});
            }
        }else
        {
            res.render("error.ejs",{error : err});
        }
    });
});

app.post("/login",(req,res)=>{
    
});

app.listen(port,()=>{
    console.log("app is listening on port : " + port);
});