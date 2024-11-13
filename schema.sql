--- pg_dump --schema-only postgres://postgres@localhost:5432/oikotie > schema.sql
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.4

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
-- Name: tablefunc; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA public;


--
-- Name: EXTENSION tablefunc; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION tablefunc IS 'functions that manipulate whole tables, including crosstab';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: listing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listing (
    id integer NOT NULL,
    address text,
    district text,
    city text,
    zip_code text,
    country text,
    latitude text,
    longitude text,
    published text,
    asuinpinta_ala text,
    asumistyyppi text,
    asunnossa_sauna text,
    autopaikan_kustannukset text,
    energialuokka text,
    energiatodistus text,
    "ensiesittelyssä" text,
    hissi text,
    hoitovastike text,
    "huoneistojen_lukumäärä" text,
    huoneiston_kokoonpano text,
    huoneita text,
    ikkunoiden_suunta text,
    ilmanvaihto text,
    "ilmastointijärjestelmä" text,
    "isännöinti" text,
    kaavatilanne text,
    kaavoitustiedot text,
    kattomateriaali text,
    kattotyyppi text,
    kaupunginosa text,
    "keittiön_lattia" text,
    "keittiön_seinä" text,
    "keittiön_varusteet" text,
    kerroksia text,
    "kerroksien_lukumäärä" text,
    kerros text,
    kiinnitykset text,
    "kiinteistön_antennijärjestelmä" text,
    "kiinteistönhoito" text,
    "kiinteistötunnus" text,
    "kiinteistövero" text,
    kohde_on text,
    kohdenumero text,
    kokonaispinta_ala text,
    kunnallistekniikka text,
    "kunnon_lisätiedot" text,
    kunto text,
    kuntotutkimus text,
    kylpyhuoneen_lattia text,
    "kylpyhuoneen_seinät" text,
    kylpyhuoneen_varusteet text,
    "käyttövastike" text,
    "liikehuoneistojen_lukumäärä" text,
    liikehuoneistojen_pinta_ala text,
    liikenneyhteydet text,
    liiketilojen_pinta_ala text,
    linkit text,
    "lisätiedot" text,
    "lisätietoa_taloyhtiöstä" text,
    "lisätietoa_vapautumisesta" text,
    "lisätietoja_lämmityksestä" text,
    "lisätietoja_makuuhuoneen_varusteista" text,
    "lisätietoja_talosta" text,
    "lunastuspykälä" text,
    "lämmitys" text,
    "lämmityskustannukset" text,
    "lämmönjakelu" text,
    maanvuokraaja text,
    maasto text,
    makuuhuoneen_lattia text,
    "makuuhuoneen_seinät" text,
    muut_kustannukset text,
    muut_rakennukset text,
    muut_tilat text,
    myyntihinta text,
    "neliöhinta" text,
    "näkymät" text,
    olohuoneen_lattia text,
    "olohuoneen_seinät" text,
    olohuoneen_varusteet text,
    ominaisuudet text,
    onko_osuus_lunastettu text,
    onko_osuus_tontista_lunastettu text,
    "osakeluettelo_on_siirretty_huoneistojärjestelmään" text,
    palvelut text,
    parveke text,
    "parvekkeen_lisätiedot" text,
    perustus text,
    pihan_ilmansuunnat text,
    "pinta_alan_lähde" text,
    "pinta_alojen_lisätiedot" text,
    pintamateriaalit text,
    postitoimipaikka text,
    puhtaanapito text,
    "pysäköintitilan_kuvaus" text,
    "pääomavastike" text,
    "rakennuksen_käyttöönottovuosi" text,
    rakennuksen_tyyppi text,
    rakennusmateriaali text,
    rakennusoikeus text,
    "rakennusvuoden_lisätiedot" text,
    rakennusvuosi text,
    rannan_omistus text,
    saunamaksu text,
    saunan_kustannukset text,
    "saunan_lisätiedot" text,
    sijainti text,
    "sähköinen_omistajamerkintä" text,
    "säilytystilat" text,
    "taloyhtiön_nimi" text,
    "taloyhtiön_tilat_ja_tuotot" text,
    "taloyhtiössä_on_sauna" text,
    tehdyt_remontit text,
    tiedustelut text,
    tietoliikennepalvelut text,
    tontin_koko text,
    tontin_kuvaus text,
    tontin_omistus text,
    tontin_pinta_ala text,
    tontin_vuokra text,
    "tontin_vuokra_päättyy" text,
    tontin_vuokravastike text,
    tulevat_remontit text,
    tv_palvelut text,
    uudiskohde text,
    valinnaisen_vuokratontin_lunastusosuus text,
    vapautuu text,
    velaton_hinta text,
    velkaosuus text,
    "vesi_ja_jätevesi" text,
    vesimaksu text,
    "vesimaksun_lisätiedot" text,
    "viemäröinti" text,
    vuokra_aika text,
    vuokratontin_lunastusosuus text,
    vuokrattu text,
    yhteiset_tilat text,
    "yhtiövastike_yhteensä" text,
    created_at date DEFAULT now() NOT NULL
);


ALTER TABLE public.listing OWNER TO postgres;

--
-- Name: metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metadata (
    field text NOT NULL,
    value text
);


ALTER TABLE public.metadata OWNER TO postgres;

--
-- Name: listing listing_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listing
    ADD CONSTRAINT listing_pkey PRIMARY KEY (id);


--
-- Name: metadata metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metadata
    ADD CONSTRAINT metadata_pkey PRIMARY KEY (field);


--
-- PostgreSQL database dump complete
--

