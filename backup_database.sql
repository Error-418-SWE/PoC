--
-- db_userQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2023-12-18 20:43:05

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
--
-- TOC entry 3325 (class 1262 OID 17271)
-- Name: test_swe; Type: DATABASE; Schema: -; Owner: db_user
--

CREATE DATABASE test_swe WITH TEMPLATE = template0 ENCODING = 'UTF8';


ALTER DATABASE test_swe OWNER TO db_user;

\connect test_swe

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
-- TOC entry 215 (class 1259 OID 17273)
-- Name: prodotti; Type: TABLE; Schema: public; Owner: db_user
--

CREATE TABLE public.prodotti (
    id integer NOT NULL,
    nome character varying(50),
    dimensione double precision,
    peso double precision
);


ALTER TABLE public.prodotti OWNER TO db_user;

--
-- TOC entry 214 (class 1259 OID 17272)
-- Name: prodotti_id_seq; Type: SEQUENCE; Schema: public; Owner: db_user
--

CREATE SEQUENCE public.prodotti_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.prodotti_id_seq OWNER TO db_user;

--
-- TOC entry 3326 (class 0 OID 0)
-- Dependencies: 214
-- Name: prodotti_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_user
--

ALTER SEQUENCE public.prodotti_id_seq OWNED BY public.prodotti.id;


--
-- TOC entry 3173 (class 2604 OID 17276)
-- Name: prodotti id; Type: DEFAULT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.prodotti ALTER COLUMN id SET DEFAULT nextval('public.prodotti_id_seq'::regclass);


--
-- TOC entry 3319 (class 0 OID 17273)
-- Dependencies: 215
-- Data for Name: prodotti; Type: TABLE DATA; Schema: public; Owner: db_user
--

INSERT INTO public.prodotti VALUES (1, 'prodotto n1', 2.3, 1.1);
INSERT INTO public.prodotti VALUES (2, 'prodotto n2', 2.3, 1.1);
INSERT INTO public.prodotti VALUES (3, 'prodotto n3', 2.3, 1.1);
INSERT INTO public.prodotti VALUES (4, 'prodotto n4', 2.3, 1.1);


--
-- TOC entry 3327 (class 0 OID 0)
-- Dependencies: 214
-- Name: prodotti_id_seq; Type: SEQUENCE SET; Schema: public; Owner: db_user
--

SELECT pg_catalog.setval('public.prodotti_id_seq', 1, false);


--
-- TOC entry 3175 (class 2606 OID 17278)
-- Name: prodotti prodotti_pkey; Type: CONSTRAINT; Schema: public; Owner: db_user
--

ALTER TABLE ONLY public.prodotti
    ADD CONSTRAINT prodotti_pkey PRIMARY KEY (id);


-- Completed on 2023-12-18 20:43:05

--
-- db_userQL database dump complete
--

