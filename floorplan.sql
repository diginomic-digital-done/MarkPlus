--
-- PostgreSQL database dump
--

\restrict WdSAklGv9SXRb6TEkc8Bwv2JigCqENifoRLSdg3KdXRBLZzCanfk0cKfE6WC46q

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: TriggeredBy; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TriggeredBy" AS ENUM (
    'USER',
    'STAFF',
    'SYSTEM'
);


ALTER TYPE public."TriggeredBy" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: FloorPlan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FloorPlan" (
    id integer NOT NULL,
    title text NOT NULL,
    frontage double precision,
    "areaLiving" integer,
    "areaTotal" integer,
    "basePrice" double precision NOT NULL,
    "heroImage" text,
    gallery text[],
    "brochurePdf" text,
    "floorPlanUrl" text,
    status text NOT NULL,
    "pdfPagesOverride" text[],
    "regionId" integer NOT NULL,
    bathrooms integer,
    bedrooms integer,
    "carSpaces" integer
);


ALTER TABLE public."FloorPlan" OWNER TO postgres;

--
-- Name: FloorPlan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."FloorPlan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."FloorPlan_id_seq" OWNER TO postgres;

--
-- Name: FloorPlan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."FloorPlan_id_seq" OWNED BY public."FloorPlan".id;


--
-- Name: PDFRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PDFRequest" (
    id text NOT NULL,
    "userId" integer,
    "stateId" integer NOT NULL,
    "floorPlanId" integer NOT NULL,
    "selectedOptions" jsonb NOT NULL,
    "clientFirstName" text NOT NULL,
    "clientEmail" text NOT NULL,
    "clientPhone" text NOT NULL,
    "longCode" text NOT NULL,
    "sourceUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "regionId" integer NOT NULL,
    "triggeredBy" public."TriggeredBy" NOT NULL
);


ALTER TABLE public."PDFRequest" OWNER TO postgres;

--
-- Name: Region; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Region" (
    id integer NOT NULL,
    name text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "stateId" integer NOT NULL,
    code text NOT NULL,
    "pdfStaticPages" text[]
);


ALTER TABLE public."Region" OWNER TO postgres;

--
-- Name: Region_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Region_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Region_id_seq" OWNER TO postgres;

--
-- Name: Region_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Region_id_seq" OWNED BY public."Region".id;


--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: Role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Role_id_seq" OWNER TO postgres;

--
-- Name: Role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Role_id_seq" OWNED BY public."Role".id;


--
-- Name: State; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."State" (
    id integer NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."State" OWNER TO postgres;

--
-- Name: State_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."State_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."State_id_seq" OWNER TO postgres;

--
-- Name: State_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."State_id_seq" OWNED BY public."State".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    mobile text NOT NULL,
    state text NOT NULL,
    "roleId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: VariationOption; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VariationOption" (
    id integer NOT NULL,
    "floorPlanId" integer NOT NULL,
    label text NOT NULL,
    description text,
    image text,
    "priceDelta" double precision,
    "isActive" boolean DEFAULT true NOT NULL,
    "order" integer,
    icon text,
    "variationTypeId" integer NOT NULL,
    "staffImage" text,
    "staffPriceDelta" double precision
);


ALTER TABLE public."VariationOption" OWNER TO postgres;

--
-- Name: VariationOption_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."VariationOption_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."VariationOption_id_seq" OWNER TO postgres;

--
-- Name: VariationOption_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."VariationOption_id_seq" OWNED BY public."VariationOption".id;


--
-- Name: VariationType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."VariationType" (
    id integer NOT NULL,
    name text NOT NULL,
    label text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."VariationType" OWNER TO postgres;

--
-- Name: VariationType_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."VariationType_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."VariationType_id_seq" OWNER TO postgres;

--
-- Name: VariationType_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."VariationType_id_seq" OWNED BY public."VariationType".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: FloorPlan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FloorPlan" ALTER COLUMN id SET DEFAULT nextval('public."FloorPlan_id_seq"'::regclass);


--
-- Name: Region id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Region" ALTER COLUMN id SET DEFAULT nextval('public."Region_id_seq"'::regclass);


--
-- Name: Role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role" ALTER COLUMN id SET DEFAULT nextval('public."Role_id_seq"'::regclass);


--
-- Name: State id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."State" ALTER COLUMN id SET DEFAULT nextval('public."State_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: VariationOption id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VariationOption" ALTER COLUMN id SET DEFAULT nextval('public."VariationOption_id_seq"'::regclass);


--
-- Name: VariationType id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VariationType" ALTER COLUMN id SET DEFAULT nextval('public."VariationType_id_seq"'::regclass);


--
-- Data for Name: FloorPlan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FloorPlan" (id, title, frontage, "areaLiving", "areaTotal", "basePrice", "heroImage", gallery, "brochurePdf", "floorPlanUrl", status, "pdfPagesOverride", "regionId", bathrooms, bedrooms, "carSpaces") FROM stdin;
2	Floor Plan Two	44	67	985	677	/uploads/qtiraj6hvoqgjxfcc5swekyud.png	{/uploads/wjpzx8nvgghph4pfdk3ioupb7.jpg,/uploads/wmytrxe15iyitre2mubbklmgy.jpg,/uploads/jrq2z4hn1co997nui0lpvqbmx.jpg}	/uploads/bu4xrvz6whtljud3uzak3kja7.pdf		Active	{/uploads/pkqnepi6rpfpo4r4etcgvo7mx.pdf,/uploads/o2y8u5y3db4mjuj2eto7addf8.pdf,/uploads/t5ps1d9hlfmal6brkcyvioayx.pdf}	2	3	3	3
3	Perth Home 2	10	170	210	410000	/placeholder.png	{/placeholder.png}	/placeholder.pdf		Active	{/placeholder.pdf}	1	2	3	2
4	Perth Home 3	12	200	250	420000	/placeholder.png	{/placeholder.png}	/placeholder.pdf		Active	{/placeholder.pdf}	1	3	5	2
5	Perth Home 4	11	160	200	430000	/placeholder.png	{/placeholder.png}	/placeholder.pdf		Active	{/placeholder.pdf}	1	2	4	1
6	Perth Home 5	13	150	190	440000	/placeholder.png	{/placeholder.png}	/placeholder.pdf		Active	{/placeholder.pdf}	1	2	3	2
7	Perth Home 6	14	190	230	450000	/placeholder.png	{/placeholder.png}	/placeholder.pdf		Active	{/placeholder.pdf}	1	3	4	2
8	Adelaide Home 2	10	175	215	415000	/placeholder.png	{/placeholder.png}	/placeholder.pdf		Active	{/placeholder.pdf}	2	2	3	2
9	Adelaide Home 3	12	185	225	425000	/placeholder.png	{/placeholder.png}	/placeholder.pdf		Active	{/placeholder.pdf}	2	2	4	2
10	Adelaide Home 4	11	195	235	435000	/placeholder.png	{/placeholder.png}	/placeholder.pdf		Active	{/placeholder.pdf}	2	3	5	2
11	Adelaide Home 5	13	165	205	445000	/placeholder.png	{/placeholder.png}	/placeholder.pdf		Active	{/placeholder.pdf}	2	2	4	1
12	Adelaide Home 6	14	155	195	455000	/placeholder.png	{/placeholder.png}	/placeholder.pdf		Active	{/placeholder.pdf}	2	2	3	2
1	Riverbank	23	21	234	429	/uploads/iojwholyg17vofs02acam4tbt.jpg	{/uploads/h2i2tkx4fa58uzb47vehhanic.jpg,/uploads/npfzls8nbo2d8z3nzy3dbapi6.jpg,/uploads/riooffg5dmr9ze3tda3qc64hp.jpg}	/uploads/rohx74rkzye2qmun4sivbcfpn.pdf		Active	{/uploads/f80jy448ojcliorfk7zl49ko2.pdf,/uploads/hb04rqsf4vbayhhhf3deo766o.pdf}	1	2	2	2
\.


--
-- Data for Name: PDFRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PDFRequest" (id, "userId", "stateId", "floorPlanId", "selectedOptions", "clientFirstName", "clientEmail", "clientPhone", "longCode", "sourceUrl", "createdAt", "regionId", "triggeredBy") FROM stdin;
\.


--
-- Data for Name: Region; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Region" (id, name, "isActive", "createdAt", "updatedAt", "stateId", code, "pdfStaticPages") FROM stdin;
1	Perth	t	2025-11-12 05:15:47.295	2025-11-12 05:15:47.295	4	perth	{}
2	Adelaide	t	2025-11-12 05:16:22.846	2025-11-12 05:16:22.846	5	adelaide	{}
3	Sydney	t	2025-11-12 05:17:00.126	2025-11-12 05:17:00.126	1	sydney	{}
4	Brisbane	t	2025-11-12 05:17:40.662	2025-11-12 05:17:40.662	3	brisbane	{}
5	Hobart	t	2025-11-12 05:18:01.503	2025-11-12 05:18:01.503	6	hobart	{}
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, name) FROM stdin;
1	Staff
2	Administrator
\.


--
-- Data for Name: State; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."State" (id, name, code, "isActive") FROM stdin;
1	New South Wales	NSW	t
2	Victoria	VIC	t
3	Queensland	QLD	t
4	Western Australia	WA	t
5	South Australia	SA	t
6	Tasmania	TAS	t
7	Australian Capital Territory	ACT	t
9	Northern Territory	NT	t
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, "firstName", "lastName", email, password, mobile, state, "roleId", "createdAt", "updatedAt") FROM stdin;
1	Staff	User	staff@example.com	$2b$10$uieKEVA2p8E.G5TFNYHkAO5tLiwFpXkQLf6WdiRkoiujC4/s27FY2	0987654321	Victoria	1	2025-11-11 10:11:12.761	2025-11-11 10:44:00.987
2	Admin	User	admin@example.com	$2b$10$GnSLGaGO6dihGvHnr1H1GeO.1OSqOV59gLy66S4pdMNNCstTvGGoW	1234567890	New South Wales	2	2025-11-11 10:11:12.761	2025-11-11 10:44:00.987
\.


--
-- Data for Name: VariationOption; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VariationOption" (id, "floorPlanId", label, description, image, "priceDelta", "isActive", "order", icon, "variationTypeId", "staffImage", "staffPriceDelta") FROM stdin;
9	3	Living Area Plus	Add 15 sqm to living area.	/uploads/a3mqf0k6xr0p458iayhx585ib.png	5500	t	2	/icons/living2.png	2	/images/staff6.png	5000
17	7	Standard Living Area	Standard living area.	/uploads/ikuv0qhxkvfysu4axnyv8vlf8.png	4800	t	2	/icons/living4.png	2	/images/staff14.png	4500
21	9	Open Living Area	Open living area.	/uploads/fqemmq78i7ho2k20kg8asacpq.png	5700	t	2	/icons/living5.png	2	/images/staff18.png	5500
12	5	Designer Elevation	Designer elevation style.	/images/elevation3.png	3500	t	1	/icons/elevation3.png	1	/images/staff9.png	3200
20	9	Coastal Elevation	Coastal elevation style.	/images/elevation5.png	4100	t	1	/icons/elevation5.png	1	/images/staff17.png	3900
25	11	Family Living Area	Family living area.	/uploads/fufkzpdhv84wdn01brkpxsllh.png	5300	t	2	/icons/living6.png	2	/images/staff22.png	5000
15	6	Compact Family Wing	Compact family wing.	/uploads/eqbwh0az4a1og93s5megy6oi1.png	4000	t	2	/icons/family3.png	4	/images/staff12.png	3700
19	8	Extra Family Wing	Extra family wing.	/uploads/y86el6d6zzsag5i1y6anflmcr.png	5200	t	2	/icons/family4.png	4	/images/staff16.png	5000
23	10	Retreat Family Wing	Retreat family wing.	/uploads/yyrnux4go500nh307vwq4zeg6.png	6800	t	2	/icons/family5.png	4	/images/staff20.png	6500
27	12	Studio Family Wing	Studio style family wing.	/uploads/e2q7zg4a3d51ua91f9q0gjp73.png	4900	t	2	/icons/family6.png	4	/images/staff24.png	4700
28	1	Suite Comfort	Comfort master suite.	/images/master7.png	7200	t	3	/icons/master7.png	3	/images/staff25.png	7000
4	1	Modern Elevation	Upgrade to modern elevation.	/uploads/d7h0wmxeanguwzx4znkvhncuq.png	3500	t	1	\N	1	/images/staff1.png	3000
16	7	Urban Elevation	Urban elevation style.	/uploads/ovxh2i0dta0fae0v3nny1gazo.png	3200	t	1	/icons/elevation4.png	1	/images/staff13.png	3000
24	11	Green Elevation	Eco-friendly elevation.	/uploads/nqzs3irfblhditmh7wxqkij9j.png	3900	t	1	/icons/elevation6.png	1	/images/staff21.png	3700
8	1	Classic Elevation	Classic elevation style.	/uploads/uptiprpntmq77jzwr31h2f2am.png	2500	t	1	/icons/elevation2.png	1	/images/staff5.png	2000
5	1	Living Area Extension	Add 10 sqm to living area.	/uploads/fncmjnysef5v7j6c87wix9gek.png	5000	t	2	/icons/living1.png	2	/images/staff2.png	4500
7	1	Family Wing Add-on	Add a family wing.	/uploads/y93i9asqjdbsbdx6f5k5jch0e.jpg	6000	t	2	/icons/family1.png	4	/images/staff4.png	5500
13	1	Living Area Max	Maximum living area.	/uploads/d5uvbzyix24tvmoi9yppnt42w.png	6000	t	2	/icons/living3.png	2	/images/staff10.png	5700
6	2	Master Suite Deluxe	Luxury master suite upgrade.	/uploads/f4qw26iw70koo8ukfgn6mjcez.png	7000	t	1	/icons/master1.png	3	/images/staff3.png	6500
18	1	Comfort Master Suite	Comfort master suite.	/uploads/i0em4g11s0j4n8fopfdtrqsu2.png	7200	t	1	/icons/master4.png	3	/images/staff15.png	7000
10	1	Premium Master Suite	Premium master suite.	/uploads/oz9cenvbwb353ewxw5i2epv8l.png	8000	t	1	/icons/master2.png	3	/images/staff7.png	7500
26	12	Zen Master Suite	Zen-inspired master suite.	/uploads/r09i2vmgdau4ytqpm4s0x6z0x.png	8700	t	1	/icons/master6.png	3	/images/staff23.png	8500
22	10	Spa Master Suite	Master suite with spa.	/uploads/xoadppoi53ut4jlbkyspx1jz2.png	9500	t	1	/icons/master5.png	3	/images/staff19.png	9000
14	6	Executive Master Suite	Executive master suite.	/uploads/cvaahleiiyw12ueeop2y2mhlb.png	9000	t	1	/icons/master3.png	3	/images/staff11.png	8500
11	4	Large Family Wing	Large family wing addition.	/uploads/b2tyoxxtqjwi2j562pdeyftbz.png	6500	t	2	/icons/family2.png	4	/images/staff8.png	6000
\.


--
-- Data for Name: VariationType; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."VariationType" (id, name, label, "isActive") FROM stdin;
1	ELEVATION	Elevation	t
2	LIVING_AREA	Living Area	t
3	MASTER_SUITE	Master Suite	t
4	FAMILY_WING	Family Wing	t
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
b5561215-2646-431c-95d3-4bf16e0049f4	63da40fa421d9bc0ef1752b98e448262defc097787a03f4b9552f28aebd0bb79	2025-11-11 15:41:11.420997+05:30	20250929064330_baseline	\N	\N	2025-11-11 15:41:11.348169+05:30	1
7e31c40e-8b74-41e0-a43d-cef0fb7f4037	cfb7a0b9dd7e6063379ddc527bca93144ed4494d906b414898164ad6c9048536	2025-11-11 15:41:11.433269+05:30	20250929085759_add_regions_model	\N	\N	2025-11-11 15:41:11.422583+05:30	1
aeebe8e6-62b4-4061-86ae-2fab2b0f1352	dc43fdef38bb69d2e1e747e0f9325e9a027acb3ecb318d68ecb3dca5bc5055b1	2025-11-11 15:41:11.441311+05:30	20251007055648_rename_stateid_to_regionid	\N	\N	2025-11-11 15:41:11.434632+05:30	1
769024c4-fa19-4e0a-9e1b-60ea0f4728c5	f56e23d7be063a6126c8e8af5fd52b1e691361db684ed01ee78fb3f3fb4305c0	2025-11-11 15:41:11.444817+05:30	20251007060953_make_hero_image_optional	\N	\N	2025-11-11 15:41:11.442054+05:30	1
243a2029-514b-4801-a09a-31728a594162	9aa65794729419b241d5974c3cb4f7b08dd5bdd66455b8820f8995ad9b8734d2	2025-11-11 15:41:11.453542+05:30	20251007065007_add_stateid_to_region	\N	\N	2025-11-11 15:41:11.445736+05:30	1
92a2bdce-cead-42b1-b627-8e5e4452ad88	0aa5b28e692eb5f3cb294bae119ab7bac134247330edeb0feced0abbfb2196d3	2025-11-11 15:41:11.460065+05:30	20251008053419_add_region_code	\N	\N	2025-11-11 15:41:11.454529+05:30	1
55dd1845-cbc9-4ada-8c0f-7f1a290288e3	4386fa09aec0abcd9e60f715937cb12db0af38306379777c3eb54f26c2e10c94	2025-11-11 15:41:11.464646+05:30	20251013042356_add_pdf_static_pages	\N	\N	2025-11-11 15:41:11.461177+05:30	1
fcb90162-b878-4374-87b8-d52c16614f69	8f067d61a943c0a1a4ce7d2dbdf3c2ded78229f704c0acfd4855ab2f0205030a	2025-11-11 15:41:11.469147+05:30	20251104054453_add_bed_bath_car_fields	\N	\N	2025-11-11 15:41:11.465363+05:30	1
38e087ed-bb76-4198-a392-ec47702128e1	eb5c0580245c95e8d8e1a232380db56602413cd0d622a63a8d6768e36974b53e	2025-11-11 15:41:11.477138+05:30	20251104095742_add_variationtype_enum	\N	\N	2025-11-11 15:41:11.47074+05:30	1
7f4913e6-5195-40cd-b2c3-0903ff2d66a8	01017b9edf537ed7a77c004e0a6a8d7f2e5f73d5df5c96d295875e589b0b08c1	2025-11-11 15:41:11.480998+05:30	20251105065616_add_icon_to_variationoption	\N	\N	2025-11-11 15:41:11.477998+05:30	1
3c9938fa-108b-4927-8699-1b8394238585	259fd8d2feadb8680b3e2a2f260302bbe25e1effd80322224287eb093fb68c3b	2025-11-11 15:41:11.555116+05:30	20251105070955_update_variationtype_enum	\N	\N	2025-11-11 15:41:11.482076+05:30	1
9ad4df85-2bd1-42ae-b03d-3f979ff522d6	25644920963fffcc9fe7f1c3ddd929a9d6abdcff00a756b558918c31328e070c	2025-11-11 16:09:33.211724+05:30	20251111103933_add_variation_type_table	\N	\N	2025-11-11 16:09:33.174759+05:30	1
0c87f23b-b44c-4440-af5f-c351950c3bf9	2812d0f7ef227cedc9fead00d35a74accd3e1ce69a272b35e4501205249283f0	2025-11-12 15:11:38.502573+05:30	20251112094138_add_staff_fields_to_variation_option	\N	\N	2025-11-12 15:11:38.497737+05:30	1
\.


--
-- Name: FloorPlan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."FloorPlan_id_seq"', 12, true);


--
-- Name: Region_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Region_id_seq"', 5, true);


--
-- Name: Role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Role_id_seq"', 2, true);


--
-- Name: State_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."State_id_seq"', 9, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 6, true);


--
-- Name: VariationOption_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."VariationOption_id_seq"', 28, true);


--
-- Name: VariationType_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."VariationType_id_seq"', 5, true);


--
-- Name: FloorPlan FloorPlan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FloorPlan"
    ADD CONSTRAINT "FloorPlan_pkey" PRIMARY KEY (id);


--
-- Name: PDFRequest PDFRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PDFRequest"
    ADD CONSTRAINT "PDFRequest_pkey" PRIMARY KEY (id);


--
-- Name: Region Region_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Region"
    ADD CONSTRAINT "Region_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: State State_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."State"
    ADD CONSTRAINT "State_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VariationOption VariationOption_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VariationOption"
    ADD CONSTRAINT "VariationOption_pkey" PRIMARY KEY (id);


--
-- Name: VariationType VariationType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VariationType"
    ADD CONSTRAINT "VariationType_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Region_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Region_code_key" ON public."Region" USING btree (code);


--
-- Name: Region_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Region_name_key" ON public."Region" USING btree (name);


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: State_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "State_code_key" ON public."State" USING btree (code);


--
-- Name: State_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "State_name_key" ON public."State" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VariationType_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "VariationType_name_key" ON public."VariationType" USING btree (name);


--
-- Name: FloorPlan FloorPlan_regionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FloorPlan"
    ADD CONSTRAINT "FloorPlan_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES public."Region"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PDFRequest PDFRequest_floorPlanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PDFRequest"
    ADD CONSTRAINT "PDFRequest_floorPlanId_fkey" FOREIGN KEY ("floorPlanId") REFERENCES public."FloorPlan"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PDFRequest PDFRequest_regionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PDFRequest"
    ADD CONSTRAINT "PDFRequest_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES public."Region"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PDFRequest PDFRequest_stateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PDFRequest"
    ADD CONSTRAINT "PDFRequest_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES public."State"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PDFRequest PDFRequest_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PDFRequest"
    ADD CONSTRAINT "PDFRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Region Region_stateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Region"
    ADD CONSTRAINT "Region_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES public."State"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VariationOption VariationOption_floorPlanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VariationOption"
    ADD CONSTRAINT "VariationOption_floorPlanId_fkey" FOREIGN KEY ("floorPlanId") REFERENCES public."FloorPlan"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VariationOption VariationOption_variationTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."VariationOption"
    ADD CONSTRAINT "VariationOption_variationTypeId_fkey" FOREIGN KEY ("variationTypeId") REFERENCES public."VariationType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict WdSAklGv9SXRb6TEkc8Bwv2JigCqENifoRLSdg3KdXRBLZzCanfk0cKfE6WC46q

