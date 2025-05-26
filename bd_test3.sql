--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-05-26 14:19:32

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
-- TOC entry 908 (class 1247 OID 49543)
-- Name: enum_Appointments_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Appointments_status" AS ENUM (
    'scheduled',
    'completed',
    'cancelled'
);


ALTER TYPE public."enum_Appointments_status" OWNER TO postgres;

--
-- TOC entry 899 (class 1247 OID 49507)
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'patient',
    'doctor',
    'admin'
);


ALTER TYPE public."enum_Users_role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 237 (class 1259 OID 49550)
-- Name: Appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Appointments" (
    id integer NOT NULL,
    "patientId" integer NOT NULL,
    "doctorId" integer NOT NULL,
    date date NOT NULL,
    "time" time without time zone NOT NULL,
    status public."enum_Appointments_status" DEFAULT 'scheduled'::public."enum_Appointments_status",
    reason text,
    notes text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Appointments" OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 49549)
-- Name: Appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Appointments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Appointments_id_seq" OWNER TO postgres;

--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 236
-- Name: Appointments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Appointments_id_seq" OWNED BY public."Appointments".id;


--
-- TOC entry 235 (class 1259 OID 49527)
-- Name: Doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Doctors" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    specialty character varying(255) NOT NULL,
    "licenseNumber" character varying(255) NOT NULL,
    bio text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Doctors" OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 49526)
-- Name: Doctors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Doctors_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Doctors_id_seq" OWNER TO postgres;

--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 234
-- Name: Doctors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Doctors_id_seq" OWNED BY public."Doctors".id;


--
-- TOC entry 233 (class 1259 OID 49514)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(255),
    "dateOfBirth" date,
    role public."enum_Users_role" DEFAULT 'patient'::public."enum_Users_role",
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 49513)
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO postgres;

--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 232
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- TOC entry 217 (class 1259 OID 49376)
-- Name: adscrito; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adscrito (
    id_medico integer NOT NULL,
    cod_hospital integer NOT NULL,
    fecha_adscripcion date
);


ALTER TABLE public.adscrito OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 49379)
-- Name: agendan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agendan (
    id_paciente integer NOT NULL,
    id_cita integer NOT NULL
);


ALTER TABLE public.agendan OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 49382)
-- Name: asegurado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asegurado (
    id_paciente integer NOT NULL,
    cod_hospital integer NOT NULL
);


ALTER TABLE public.asegurado OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 49385)
-- Name: atiende; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.atiende (
    id_medico integer NOT NULL,
    id_cita integer NOT NULL,
    diagnostico text
);


ALTER TABLE public.atiende OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 49390)
-- Name: cita; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cita (
    id_cita integer NOT NULL,
    fecha date NOT NULL,
    hora time without time zone NOT NULL,
    motivo text
);


ALTER TABLE public.cita OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 49395)
-- Name: cita_id_cita_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cita_id_cita_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cita_id_cita_seq OWNER TO postgres;

--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 222
-- Name: cita_id_cita_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cita_id_cita_seq OWNED BY public.cita.id_cita;


--
-- TOC entry 223 (class 1259 OID 49396)
-- Name: consultas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consultas (
    id_medico integer NOT NULL,
    cod_hospital integer NOT NULL,
    fecha_consulta date
);


ALTER TABLE public.consultas OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 49399)
-- Name: hospital; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospital (
    cod_hospital integer NOT NULL,
    nombre_hospital character varying(100) NOT NULL,
    ubicacion character varying(100),
    tipo_hospital character varying(10),
    CONSTRAINT hospital_tipo_hospital_check CHECK (((tipo_hospital)::text = ANY (ARRAY[('Privado'::character varying)::text, ('Publico'::character varying)::text])))
);


ALTER TABLE public.hospital OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 49403)
-- Name: hospital_cod_hospital_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hospital_cod_hospital_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hospital_cod_hospital_seq OWNER TO postgres;

--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 225
-- Name: hospital_cod_hospital_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hospital_cod_hospital_seq OWNED BY public.hospital.cod_hospital;


--
-- TOC entry 226 (class 1259 OID 49404)
-- Name: medico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medico (
    id_medico integer NOT NULL,
    nombre character varying(100) NOT NULL,
    tipo_medico character varying(20),
    CONSTRAINT medico_tipo_medico_check CHECK (((tipo_medico)::text = ANY (ARRAY[('General'::character varying)::text, ('Especialidad'::character varying)::text])))
);


ALTER TABLE public.medico OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 49408)
-- Name: medico_id_medico_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medico_id_medico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medico_id_medico_seq OWNER TO postgres;

--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 227
-- Name: medico_id_medico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medico_id_medico_seq OWNED BY public.medico.id_medico;


--
-- TOC entry 228 (class 1259 OID 49409)
-- Name: p1; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.p1 (
    id_paciente integer NOT NULL,
    nss character varying(20) NOT NULL
);


ALTER TABLE public.p1 OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 49412)
-- Name: p2; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.p2 (
    id_paciente integer NOT NULL,
    num_poliza character varying(20) NOT NULL
);


ALTER TABLE public.p2 OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 49415)
-- Name: pacientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pacientes (
    id_paciente integer NOT NULL,
    nombre character varying(100) NOT NULL,
    num_tel character varying(15),
    tipo_paciente character varying(2),
    CONSTRAINT pacientes_tipo_paciente_check CHECK (((tipo_paciente)::text = ANY (ARRAY[('P1'::character varying)::text, ('P2'::character varying)::text])))
);


ALTER TABLE public.pacientes OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 49419)
-- Name: pacientes_id_paciente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pacientes_id_paciente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pacientes_id_paciente_seq OWNER TO postgres;

--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 231
-- Name: pacientes_id_paciente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pacientes_id_paciente_seq OWNED BY public.pacientes.id_paciente;


--
-- TOC entry 4814 (class 2604 OID 49553)
-- Name: Appointments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments" ALTER COLUMN id SET DEFAULT nextval('public."Appointments_id_seq"'::regclass);


--
-- TOC entry 4813 (class 2604 OID 49530)
-- Name: Doctors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doctors" ALTER COLUMN id SET DEFAULT nextval('public."Doctors_id_seq"'::regclass);


--
-- TOC entry 4810 (class 2604 OID 49517)
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- TOC entry 4806 (class 2604 OID 49420)
-- Name: cita id_cita; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita ALTER COLUMN id_cita SET DEFAULT nextval('public.cita_id_cita_seq'::regclass);


--
-- TOC entry 4807 (class 2604 OID 49421)
-- Name: hospital cod_hospital; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital ALTER COLUMN cod_hospital SET DEFAULT nextval('public.hospital_cod_hospital_seq'::regclass);


--
-- TOC entry 4808 (class 2604 OID 49422)
-- Name: medico id_medico; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medico ALTER COLUMN id_medico SET DEFAULT nextval('public.medico_id_medico_seq'::regclass);


--
-- TOC entry 4809 (class 2604 OID 49423)
-- Name: pacientes id_paciente; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes ALTER COLUMN id_paciente SET DEFAULT nextval('public.pacientes_id_paciente_seq'::regclass);


--
-- TOC entry 5031 (class 0 OID 49550)
-- Dependencies: 237
-- Data for Name: Appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Appointments" (id, "patientId", "doctorId", date, "time", status, reason, notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5029 (class 0 OID 49527)
-- Dependencies: 235
-- Data for Name: Doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Doctors" (id, "userId", specialty, "licenseNumber", bio, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5027 (class 0 OID 49514)
-- Dependencies: 233
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, "firstName", "lastName", email, password, phone, "dateOfBirth", role, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5011 (class 0 OID 49376)
-- Dependencies: 217
-- Data for Name: adscrito; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adscrito (id_medico, cod_hospital, fecha_adscripcion) FROM stdin;
1	33	2024-01-01
2	34	2024-02-15
3	35	2024-03-10
4	38	2024-01-20
5	39	2024-02-28
\.


--
-- TOC entry 5012 (class 0 OID 49379)
-- Dependencies: 218
-- Data for Name: agendan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agendan (id_paciente, id_cita) FROM stdin;
\.


--
-- TOC entry 5013 (class 0 OID 49382)
-- Dependencies: 219
-- Data for Name: asegurado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asegurado (id_paciente, cod_hospital) FROM stdin;
1	36
3	37
7	38
5	39
9	40
\.


--
-- TOC entry 5014 (class 0 OID 49385)
-- Dependencies: 220
-- Data for Name: atiende; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.atiende (id_medico, id_cita, diagnostico) FROM stdin;
\.


--
-- TOC entry 5015 (class 0 OID 49390)
-- Dependencies: 221
-- Data for Name: cita; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cita (id_cita, fecha, hora, motivo) FROM stdin;
1	2025-04-01	09:00:00	Revisión general
2	2025-04-02	10:00:00	Dolor de cabeza
3	2025-04-03	11:00:00	Chequeo anual
4	2025-04-04	12:00:00	Dolor abdominal
5	2025-04-05	13:00:00	Vacunación
6	2025-04-06	14:00:00	Consulta pediátrica
7	2025-04-07	15:00:00	Chequeo prenatal
8	2025-04-08	16:00:00	Control de presión
9	2025-04-09	17:00:00	Consulta oftalmológica
10	2025-04-10	18:00:00	Dolor muscular
\.


--
-- TOC entry 5017 (class 0 OID 49396)
-- Dependencies: 223
-- Data for Name: consultas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consultas (id_medico, cod_hospital, fecha_consulta) FROM stdin;
1	31	2024-04-01
2	32	2024-04-02
3	33	2024-04-03
4	34	2024-04-04
5	35	2024-04-05
\.


--
-- TOC entry 5018 (class 0 OID 49399)
-- Dependencies: 224
-- Data for Name: hospital; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospital (cod_hospital, nombre_hospital, ubicacion, tipo_hospital) FROM stdin;
31	Hospital Central	CDMX	Publico
32	Clínica San José	Guadalajara	Privado
33	Hospital del Norte	Monterrey	Publico
34	Instituto del Sur	Puebla	Privado
35	Clínica Santa María	Querétaro	Privado
36	Vida Plena	León	Publico
37	Centro Salud Esperanza	Toluca	Publico
38	Hospital Ángeles	CDMX	Privado
39	Bienestar Total	Tijuana	Privado
40	Universitario Norte	Chihuahua	Publico
\.


--
-- TOC entry 5020 (class 0 OID 49404)
-- Dependencies: 226
-- Data for Name: medico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medico (id_medico, nombre, tipo_medico) FROM stdin;
1	Dr. Gómez	General
2	Dra. Rivas	Especialidad
3	Dr. Salas	General
4	Dra. Cordero	Especialidad
5	Dr. Neri	General
6	Dra. Méndez	Especialidad
7	Dr. Vargas	General
8	Dra. Rivera	Especialidad
9	Dr. Ortiz	General
10	Dra. Jiménez	Especialidad
\.


--
-- TOC entry 5022 (class 0 OID 49409)
-- Dependencies: 228
-- Data for Name: p1; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.p1 (id_paciente, nss) FROM stdin;
1	NSS001
3	NSS002
5	NSS003
7	NSS004
9	NSS005
\.


--
-- TOC entry 5023 (class 0 OID 49412)
-- Dependencies: 229
-- Data for Name: p2; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.p2 (id_paciente, num_poliza) FROM stdin;
2	POL001
4	POL002
6	POL003
8	POL004
10	POL005
\.


--
-- TOC entry 5024 (class 0 OID 49415)
-- Dependencies: 230
-- Data for Name: pacientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pacientes (id_paciente, nombre, num_tel, tipo_paciente) FROM stdin;
1	Juan Pérez	5512345678	P1
2	María López	5523456789	P2
3	Carlos Ramírez	5534567890	P1
4	Ana Torres	5545678901	P2
5	Luis Fernández	5556789012	P1
6	Laura González	5567890123	P2
7	Pedro Martínez	5578901234	P1
8	Marta Sánchez	5589012345	P2
9	Diego Castro	5590123456	P1
10	Elena Ruiz	5501234567	P2
\.


--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 236
-- Name: Appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Appointments_id_seq"', 1, false);


--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 234
-- Name: Doctors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Doctors_id_seq"', 1, false);


--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 232
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 1, false);


--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 222
-- Name: cita_id_cita_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cita_id_cita_seq', 10, true);


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 225
-- Name: hospital_cod_hospital_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hospital_cod_hospital_seq', 40, true);


--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 227
-- Name: medico_id_medico_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medico_id_medico_seq', 10, true);


--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 231
-- Name: pacientes_id_paciente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pacientes_id_paciente_seq', 10, true);


--
-- TOC entry 4850 (class 2606 OID 49558)
-- Name: Appointments Appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments"
    ADD CONSTRAINT "Appointments_pkey" PRIMARY KEY (id);


--
-- TOC entry 4846 (class 2606 OID 49536)
-- Name: Doctors Doctors_licenseNumber_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doctors"
    ADD CONSTRAINT "Doctors_licenseNumber_key" UNIQUE ("licenseNumber");


--
-- TOC entry 4848 (class 2606 OID 49534)
-- Name: Doctors Doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doctors"
    ADD CONSTRAINT "Doctors_pkey" PRIMARY KEY (id);


--
-- TOC entry 4842 (class 2606 OID 49525)
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- TOC entry 4844 (class 2606 OID 49523)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- TOC entry 4820 (class 2606 OID 49425)
-- Name: adscrito adscrito_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adscrito
    ADD CONSTRAINT adscrito_pkey PRIMARY KEY (id_medico, cod_hospital);


--
-- TOC entry 4822 (class 2606 OID 49427)
-- Name: agendan agendan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendan
    ADD CONSTRAINT agendan_pkey PRIMARY KEY (id_paciente, id_cita);


--
-- TOC entry 4824 (class 2606 OID 49429)
-- Name: asegurado asegurado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asegurado
    ADD CONSTRAINT asegurado_pkey PRIMARY KEY (id_paciente, cod_hospital);


--
-- TOC entry 4826 (class 2606 OID 49431)
-- Name: atiende atiende_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atiende
    ADD CONSTRAINT atiende_pkey PRIMARY KEY (id_medico, id_cita);


--
-- TOC entry 4828 (class 2606 OID 49433)
-- Name: cita cita_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_pkey PRIMARY KEY (id_cita);


--
-- TOC entry 4830 (class 2606 OID 49435)
-- Name: consultas consultas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultas
    ADD CONSTRAINT consultas_pkey PRIMARY KEY (id_medico, cod_hospital);


--
-- TOC entry 4832 (class 2606 OID 49437)
-- Name: hospital hospital_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital
    ADD CONSTRAINT hospital_pkey PRIMARY KEY (cod_hospital);


--
-- TOC entry 4834 (class 2606 OID 49439)
-- Name: medico medico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medico
    ADD CONSTRAINT medico_pkey PRIMARY KEY (id_medico);


--
-- TOC entry 4836 (class 2606 OID 49441)
-- Name: p1 p1_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.p1
    ADD CONSTRAINT p1_pkey PRIMARY KEY (id_paciente);


--
-- TOC entry 4838 (class 2606 OID 49443)
-- Name: p2 p2_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.p2
    ADD CONSTRAINT p2_pkey PRIMARY KEY (id_paciente);


--
-- TOC entry 4840 (class 2606 OID 49445)
-- Name: pacientes pacientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pacientes
    ADD CONSTRAINT pacientes_pkey PRIMARY KEY (id_paciente);


--
-- TOC entry 4864 (class 2606 OID 49564)
-- Name: Appointments Appointments_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments"
    ADD CONSTRAINT "Appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public."Doctors"(id) ON UPDATE CASCADE;


--
-- TOC entry 4865 (class 2606 OID 49559)
-- Name: Appointments Appointments_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments"
    ADD CONSTRAINT "Appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- TOC entry 4863 (class 2606 OID 49537)
-- Name: Doctors Doctors_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doctors"
    ADD CONSTRAINT "Doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- TOC entry 4851 (class 2606 OID 49446)
-- Name: adscrito adscrito_cod_hospital_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adscrito
    ADD CONSTRAINT adscrito_cod_hospital_fkey FOREIGN KEY (cod_hospital) REFERENCES public.hospital(cod_hospital) ON DELETE CASCADE;


--
-- TOC entry 4852 (class 2606 OID 49451)
-- Name: adscrito adscrito_id_medico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adscrito
    ADD CONSTRAINT adscrito_id_medico_fkey FOREIGN KEY (id_medico) REFERENCES public.medico(id_medico) ON DELETE CASCADE;


--
-- TOC entry 4853 (class 2606 OID 49456)
-- Name: agendan agendan_id_cita_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendan
    ADD CONSTRAINT agendan_id_cita_fkey FOREIGN KEY (id_cita) REFERENCES public.cita(id_cita) ON DELETE CASCADE;


--
-- TOC entry 4854 (class 2606 OID 49461)
-- Name: agendan agendan_id_paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agendan
    ADD CONSTRAINT agendan_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES public.pacientes(id_paciente) ON DELETE CASCADE;


--
-- TOC entry 4855 (class 2606 OID 49466)
-- Name: asegurado asegurado_cod_hospital_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asegurado
    ADD CONSTRAINT asegurado_cod_hospital_fkey FOREIGN KEY (cod_hospital) REFERENCES public.hospital(cod_hospital) ON DELETE CASCADE;


--
-- TOC entry 4856 (class 2606 OID 49471)
-- Name: asegurado asegurado_id_paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asegurado
    ADD CONSTRAINT asegurado_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES public.p1(id_paciente) ON DELETE CASCADE;


--
-- TOC entry 4857 (class 2606 OID 49476)
-- Name: atiende atiende_id_cita_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atiende
    ADD CONSTRAINT atiende_id_cita_fkey FOREIGN KEY (id_cita) REFERENCES public.cita(id_cita) ON DELETE CASCADE;


--
-- TOC entry 4858 (class 2606 OID 49481)
-- Name: atiende atiende_id_medico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atiende
    ADD CONSTRAINT atiende_id_medico_fkey FOREIGN KEY (id_medico) REFERENCES public.medico(id_medico) ON DELETE CASCADE;


--
-- TOC entry 4859 (class 2606 OID 49486)
-- Name: consultas consultas_cod_hospital_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultas
    ADD CONSTRAINT consultas_cod_hospital_fkey FOREIGN KEY (cod_hospital) REFERENCES public.hospital(cod_hospital) ON DELETE CASCADE;


--
-- TOC entry 4860 (class 2606 OID 49491)
-- Name: consultas consultas_id_medico_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultas
    ADD CONSTRAINT consultas_id_medico_fkey FOREIGN KEY (id_medico) REFERENCES public.medico(id_medico) ON DELETE CASCADE;


--
-- TOC entry 4861 (class 2606 OID 49496)
-- Name: p1 p1_id_paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.p1
    ADD CONSTRAINT p1_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES public.pacientes(id_paciente) ON DELETE CASCADE;


--
-- TOC entry 4862 (class 2606 OID 49501)
-- Name: p2 p2_id_paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.p2
    ADD CONSTRAINT p2_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES public.pacientes(id_paciente) ON DELETE CASCADE;


-- Completed on 2025-05-26 14:19:32

--
-- PostgreSQL database dump complete
--

