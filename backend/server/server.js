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

app.post('/login', (req, res) => {
	if (
		getUserAuth(req.body.uuid) &&
		getUserAuth(req.body.uuid).then((result) => req.body.hashedPass === result)
	) {
		session = req.session;
		session.uuid = req.body.uuid;
	}
});

app.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/');
});

app.put('/user', (req, res) => {
	if (req.body.uuid && req.body.hashedPass) {
	}
});

app.get('/user', (req, res) => {
	session = req.session;
	if (session.uuid) {
		res.status(200).json(getUser(session.uuid));
	} else res.status(403);
});

app.get('/db/anime', (req, res) => {
	const { amount } = req.query;
	if (amount) {
		getAnimes(amount).then((result) => res.status(200).json(result));
	} else {
		getAnimes(20).then((result) => res.status(200).json(result));
	}
});

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

async function getAnimes(amount) {
	let res = await db.any(`select * from public.anime limit ${amount}`);
	return res;
}
async function getAnime(anime) {
	let res = await db.any(`select * from public.anime where id = ${anime}`);
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
async function createUser(uuid, hashedPass) {}
