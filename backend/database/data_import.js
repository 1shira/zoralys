// ONLY RUN ONCE ELSE YOU WILL HAVE EVERY ENTRY MULTIPLE TIMES IN THE DATABASE

import express from 'express';
import pgpx from 'pg-promise';
import AnimeListe from './data/data.json' assert { type: 'json' };
const app = express();
const pgp = pgpx();
const db = pgp('postgres://postgres:1@localhost:5432/AnimeListe');
let a = '';
//we take the data
const data = AnimeListe.data;
//we go thru
for (let index = 0; index < data.length; index++) {
	const anime = data[index];
	//creating an sql statement
	a += `('${anime.sources.join(';')}', '${anime.title}', '${anime.type}', ${
		anime.episodes
	}, '${anime.status}', '${
		anime.animeSeason.season + anime.animeSeason.year
	}', '${anime.picture}', '${anime.thumbnail}', '${anime.synonyms.join(
		';'
	)}', '${anime.relations.join(',')}', '${anime.tags.join(';')}', 'other')`;
	//to not have the , at the end
	if (index !== data.length - 1) a += ',\n';
}
db.none(`insert into anime VALUES ${a}`);
