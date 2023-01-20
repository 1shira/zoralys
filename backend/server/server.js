import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import sessions from 'express-session';
import cookieParser from 'cookie-parser';
import {
	db,
	getAnime,
	getAnimes,
	getUser,
	getUserAuth,
	createUser,
} from './module/helpers';

dotenv.config();

var session;

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

app.POST('/user', (req, res) => {
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
