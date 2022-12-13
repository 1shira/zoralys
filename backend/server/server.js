import express  from "express";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from 'dotenv';
import pgpx from 'pg-promise';

dotenv.config();

const pgp = pgpx();
const db = pgp(	
	`${process.env.DBTYPE}://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBDATABASE}`
);

const app = express();
app.use(morgan('tiny'));
app.use(helmet());

app.get('/db/anime',(req,res) => {
    const {amount} = req.query
    if(amount){
        getAnime(amount).then((result) => res.status(200).json(result))
    } 
    else{
        getAnime(20).then((result) => res.status(200).json(result))
    }
})

app.get('*',(req,res) => {
    res.status(404).send("<center><h1>404</h1><h3>Not found</h3></center>")
})

app.listen(process.env.port, () => console.log('started'));

// how does this return a promise?
async function getAnime(amount) { 
    let res = await db.any(`select * from public.anime limit ${amount}`);
    return res;
}
