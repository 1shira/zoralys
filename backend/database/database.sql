--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: anime; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.anime (
    id serial,
    sources text,
    title text,
    type text,
    episodes integer,
    status text,
    season text,
    picture text,
    thumbnail text,
    synonyms text,
    relations text,
    tags text,
    other text
);

create table public.user(
    id serial,
    uuid text,
    hashedPass text,
    animeList text,
    profilePic text
);