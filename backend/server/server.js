import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pgpx from 'pg-promise';
import sessions from 'express-session';
import cookieParser from 'cookie-parser';

dotenv.config();

var session;

const pgp = pgpx();
const db = pgp(
	`postgres://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBDATABASE}`
);

const app = express();
app.use(morgan('tiny'));
app.use(helmet());
app.use(
	sessions({
		secret: 'sometobegeneratedramdomcode7t48293thgfro',
		saveUninitialized: true,
		cookie: { maxAge: 864000000 /*10 days*/ },
		resave: false,
	})
);
app.use(cookieParser());

//login
app.post('/login', (req, res) => {
	if (
		//check if we have the user and the pass matches it
		//honestly the .then should not be neccesary but just to be sure rn
		getUserAuth(req.body.uuid).then((result) =>  result ? true : false) &&
		getUserAuth(req.body.uuid).then((result) => req.body.hashedPass === result)
	) {
		session = req.session;
		session.uuid = req.body.uuid;
	}
});

//logout
app.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/');
});

//create a new user
app.put('/user', (req, res) => {
	if (req.body.uuid && req.body.hashedPass) {
		//TODO create a user
	}
});

//Get Data of current User, like users anime list and Profilepicture
app.get('/user', (req, res) => {
	session = req.session;
	if (session.uuid) {
		res.status(200).json(getUser(session.uuid));
	} else res.status(403);
});

//Get a list of anime, possibly will get a filter and/or sorting parameter
app.get('/db/anime', (req, res) => {
	const { amount } = req.query;
	if (amount) {
		getAnimes(amount).then((result) => res.status(200).json(result));
	} else {
		getAnimes(20).then((result) => res.status(200).json(result));
	}
});

//Get a specific anime, like when on the Anime's specific site, gotta look into how exactly to do this, currently I would let the client request based on it's own url
app.get('/db/anime/:anime', (req, res) => {
	const { anime } = req.params;
	if (anime) {
		getAnime(anime).then((result) => res.status(200).json(result));
	} else res.status(404);
});

app.get('*', (req, res) => {
	res.status(404).send('<center><h1>404</h1><h3>Not found</h3></center>');
});

app.listen(process.env.port, () => console.log('started'));

// how does this return a promise?

//TODO When getting animes, replace "U+0027" with "'", wich has been done the other way before to import the data correctly

//Helper functions for Database
async function getAnimes(amount) {
	let res = await db.any(`select * from public.anime limit ${amount}`);
	return res;
}
async function getAnime(animeId) {
	let res = await db.any(`select * from public.anime where id = ${animeId}`);
	return res;
}
async function getUserAuth(uuid) {
	return await db.one(
		`select hashedPass from public.users where uuid = ${uuid}`
	);
}
async function getUser(uuid) {
	return await db.one(
		`select uuid,animeList,profilePic from user where uuid = ${uuid}`
	);
}
async function createUser(uuid, hashedPass) {/*Create a User in the DB*/}
