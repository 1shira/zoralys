import pgpx from 'pg-promise';

const pgp = pgpx();
const db = pgp(
	`postgres://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBDATABASE}`
);

const getAnimes = async (amount) =>
	//Gets a list of Anime
	await db.any(`select * from public.anime limit ${amount}`);
const getAnime = async (anime) =>
	//Gets an Anime from id
	await db.any(`select * from public.anime where id = ${anime}`);
const getUserAuth = async (uuid) =>
	//Get hashed userpassword from uuid to compare, uuid is username
	await db.one(`select hashedPass from public.users where uuid = ${uuid}`);
const getUser = async (uuid) =>
	//get profile of User
	await db.one(
		`select uuid,animeList,profilePic from user where uuid = ${uuid}`
	);
const createUser = async (uuid, hashedPass) => {};

export { db, getAnimes, getAnime, getUser, getUserAuth, createUser };
