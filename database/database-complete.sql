--
-- PostgreSQL database dump
--

\restrict VaHW9mQeS8klt2uyBtgjrLF9nCMQjGwQtnHZuKDRvAD85iHcFzL2SbvBliEmu4a

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

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
-- Name: Day; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Day" AS ENUM (
    'LUNES',
    'MARTES',
    'MIERCOLES',
    'JUEVES',
    'VIERNES',
    'SABADO',
    'DOMINGO'
);


--
-- Name: Difficulty; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Difficulty" AS ENUM (
    'BAJA',
    'MEDIA',
    'ALTA'
);


--
-- Name: Modality; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Modality" AS ENUM (
    'PRESENCIAL',
    'VIRTUAL'
);


--
-- Name: RejectionCode; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RejectionCode" AS ENUM (
    'CANTIDAD_INCORRECTA',
    'MATERIAS_OBLIGATORIAS_FALTANTES',
    'CRUCE_HORARIO',
    'MODALIDAD_NO_CUMPLIDA',
    'MAXIMO_DIFICILES_SUPERADO',
    'MAXIMO_CREDITOS_SUPERADO',
    'PRERREQUISITOS_NO_CUMPLIDOS',
    'MATERIA_NO_DISPONIBLE'
);


--
-- Name: RequiredModality; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RequiredModality" AS ENUM (
    'CUALQUIERA',
    'PRESENCIAL',
    'VIRTUAL'
);


--
-- Name: ScheduleStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ScheduleStatus" AS ENUM (
    'VALIDO',
    'DESCARTADO'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: configuration_completed_courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.configuration_completed_courses (
    configuration_id integer NOT NULL,
    course_id integer NOT NULL
);


--
-- Name: configuration_required_courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.configuration_required_courses (
    configuration_id integer NOT NULL,
    course_id integer NOT NULL
);


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    section character varying(20),
    day public."Day" NOT NULL,
    start_time time(0) without time zone NOT NULL,
    end_time time(0) without time zone NOT NULL,
    modality public."Modality" NOT NULL,
    difficulty public."Difficulty" NOT NULL,
    credits integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: generated_schedules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.generated_schedules (
    id integer NOT NULL,
    configuration_id integer NOT NULL,
    combination_number integer NOT NULL,
    status public."ScheduleStatus" NOT NULL,
    total_credits integer NOT NULL,
    difficult_courses_count integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: generated_schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.generated_schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: generated_schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.generated_schedules_id_seq OWNED BY public.generated_schedules.id;


--
-- Name: prerequisites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.prerequisites (
    course_id integer NOT NULL,
    prerequisite_course_id integer NOT NULL
);


--
-- Name: rejection_reasons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rejection_reasons (
    id integer NOT NULL,
    schedule_id integer NOT NULL,
    code public."RejectionCode" NOT NULL,
    message character varying(255) NOT NULL
);


--
-- Name: rejection_reasons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rejection_reasons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rejection_reasons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rejection_reasons_id_seq OWNED BY public.rejection_reasons.id;


--
-- Name: schedule_configurations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schedule_configurations (
    id integer NOT NULL,
    number_of_courses integer NOT NULL,
    maximum_credits integer NOT NULL,
    maximum_difficult_courses integer NOT NULL,
    required_modality public."RequiredModality" DEFAULT 'CUALQUIERA'::public."RequiredModality" NOT NULL,
    avoid_time_conflicts boolean DEFAULT true NOT NULL,
    validate_prerequisites boolean DEFAULT true NOT NULL,
    total_available_courses integer DEFAULT 0 NOT NULL,
    total_combinations integer DEFAULT 0 NOT NULL,
    valid_schedules_count integer DEFAULT 0 NOT NULL,
    discarded_schedules_count integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    generated_at timestamp(3) without time zone
);


--
-- Name: schedule_configurations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.schedule_configurations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schedule_configurations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schedule_configurations_id_seq OWNED BY public.schedule_configurations.id;


--
-- Name: schedule_courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schedule_courses (
    schedule_id integer NOT NULL,
    course_id integer NOT NULL
);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: generated_schedules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generated_schedules ALTER COLUMN id SET DEFAULT nextval('public.generated_schedules_id_seq'::regclass);


--
-- Name: rejection_reasons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rejection_reasons ALTER COLUMN id SET DEFAULT nextval('public.rejection_reasons_id_seq'::regclass);


--
-- Name: schedule_configurations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_configurations ALTER COLUMN id SET DEFAULT nextval('public.schedule_configurations_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public._prisma_migrations VALUES ('28c2a435-0d37-41aa-8997-9d3119ecff09', '1a7b79f723937d58592e52419ff6fcaca798387a548c98ae1c106285cef4a99f', '2026-07-25 06:00:06.253273-05', '20260725110006_init_horarios', NULL, NULL, '2026-07-25 06:00:06.21243-05', 1);


--
-- Data for Name: configuration_completed_courses; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: configuration_required_courses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.configuration_required_courses VALUES (2, 3);


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.courses VALUES (3, 'Programación 1785112291809', 'A', 'LUNES', '08:00:00', '10:00:00', 'PRESENCIAL', 'ALTA', 4, '2026-07-27 00:31:57.96', '2026-07-27 00:31:57.96');
INSERT INTO public.courses VALUES (4, 'Matemáticas 1785112291809', 'A', 'LUNES', '10:00:00', '12:00:00', 'PRESENCIAL', 'MEDIA', 3, '2026-07-27 00:32:35.962', '2026-07-27 00:32:35.962');
INSERT INTO public.courses VALUES (5, 'Inglés 1785112291809', 'A', 'MARTES', '08:00:00', '10:00:00', 'VIRTUAL', 'BAJA', 2, '2026-07-27 00:32:36.074', '2026-07-27 00:32:36.074');
INSERT INTO public.courses VALUES (6, 'Redes 1785112291809', 'A', 'LUNES', '09:00:00', '11:00:00', 'PRESENCIAL', 'ALTA', 4, '2026-07-27 00:32:36.15', '2026-07-27 00:32:36.15');
INSERT INTO public.courses VALUES (7, 'Base de datos básica 1785112291809', 'A', 'MIERCOLES', '08:00:00', '10:00:00', 'VIRTUAL', 'MEDIA', 4, '2026-07-27 00:32:36.244', '2026-07-27 00:32:36.244');
INSERT INTO public.courses VALUES (8, 'Base de datos avanzada 1785112291809', 'A', 'JUEVES', '08:00:00', '10:00:00', 'VIRTUAL', 'ALTA', 4, '2026-07-27 00:32:36.344', '2026-07-27 00:32:36.344');
INSERT INTO public.courses VALUES (9, 'Diseño 1785112291809', 'A', 'VIERNES', '08:00:00', '10:00:00', 'PRESENCIAL', 'BAJA', 3, '2026-07-27 00:32:36.43', '2026-07-27 00:32:36.43');
INSERT INTO public.courses VALUES (10, 'Inglés II 1785112291809', 'A', 'JUEVES', '16:00:00', '18:00:00', 'PRESENCIAL', 'MEDIA', 3, '2026-07-27 02:23:45.296', '2026-07-27 02:23:45.296');


--
-- Data for Name: generated_schedules; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.generated_schedules VALUES (36, 2, 1, 'VALIDO', 9, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (37, 2, 2, 'DESCARTADO', 11, 2, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (38, 2, 3, 'VALIDO', 11, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (39, 2, 4, 'DESCARTADO', 11, 2, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (40, 2, 5, 'VALIDO', 10, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (41, 2, 6, 'DESCARTADO', 10, 2, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (42, 2, 7, 'VALIDO', 10, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (43, 2, 8, 'DESCARTADO', 10, 2, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (44, 2, 9, 'VALIDO', 9, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (45, 2, 10, 'DESCARTADO', 12, 2, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (46, 2, 11, 'DESCARTADO', 12, 3, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (47, 2, 12, 'DESCARTADO', 11, 2, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (48, 2, 13, 'VALIDO', 12, 2, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (49, 2, 14, 'VALIDO', 11, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (50, 2, 15, 'DESCARTADO', 11, 2, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (51, 2, 16, 'DESCARTADO', 9, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (52, 2, 17, 'DESCARTADO', 9, 0, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (53, 2, 18, 'DESCARTADO', 9, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (54, 2, 19, 'DESCARTADO', 8, 0, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (55, 2, 20, 'DESCARTADO', 11, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (56, 2, 21, 'DESCARTADO', 11, 2, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (57, 2, 22, 'DESCARTADO', 10, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (58, 2, 23, 'DESCARTADO', 11, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (59, 2, 24, 'DESCARTADO', 10, 0, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (60, 2, 25, 'DESCARTADO', 10, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (61, 2, 26, 'DESCARTADO', 10, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (62, 2, 27, 'DESCARTADO', 10, 2, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (63, 2, 28, 'DESCARTADO', 9, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (64, 2, 29, 'DESCARTADO', 10, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (65, 2, 30, 'DESCARTADO', 9, 0, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (66, 2, 31, 'DESCARTADO', 9, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (67, 2, 32, 'DESCARTADO', 12, 2, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (68, 2, 33, 'DESCARTADO', 11, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (69, 2, 34, 'DESCARTADO', 11, 2, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (70, 2, 35, 'DESCARTADO', 11, 1, '2026-07-27 00:52:59.079');
INSERT INTO public.generated_schedules VALUES (71, 3, 1, 'VALIDO', 9, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (72, 3, 2, 'DESCARTADO', 11, 2, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (73, 3, 3, 'VALIDO', 11, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (74, 3, 4, 'DESCARTADO', 11, 2, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (75, 3, 5, 'VALIDO', 10, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (76, 3, 6, 'DESCARTADO', 10, 2, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (77, 3, 7, 'VALIDO', 10, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (78, 3, 8, 'DESCARTADO', 10, 2, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (79, 3, 9, 'VALIDO', 9, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (80, 3, 10, 'DESCARTADO', 12, 2, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (81, 3, 11, 'DESCARTADO', 12, 3, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (82, 3, 12, 'DESCARTADO', 11, 2, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (83, 3, 13, 'VALIDO', 12, 2, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (84, 3, 14, 'VALIDO', 11, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (85, 3, 15, 'DESCARTADO', 11, 2, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (86, 3, 16, 'DESCARTADO', 9, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (87, 3, 17, 'VALIDO', 9, 0, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (88, 3, 18, 'DESCARTADO', 9, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (89, 3, 19, 'VALIDO', 8, 0, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (90, 3, 20, 'DESCARTADO', 11, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (91, 3, 21, 'DESCARTADO', 11, 2, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (92, 3, 22, 'DESCARTADO', 10, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (93, 3, 23, 'VALIDO', 11, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (94, 3, 24, 'VALIDO', 10, 0, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (95, 3, 25, 'DESCARTADO', 10, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (96, 3, 26, 'VALIDO', 10, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (97, 3, 27, 'DESCARTADO', 10, 2, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (98, 3, 28, 'VALIDO', 9, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (99, 3, 29, 'VALIDO', 10, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (100, 3, 30, 'VALIDO', 9, 0, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (101, 3, 31, 'DESCARTADO', 9, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (102, 3, 32, 'VALIDO', 12, 2, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (103, 3, 33, 'VALIDO', 11, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (104, 3, 34, 'DESCARTADO', 11, 2, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (105, 3, 35, 'VALIDO', 11, 1, '2026-07-27 02:00:44.558');
INSERT INTO public.generated_schedules VALUES (106, 4, 1, 'VALIDO', 9, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (107, 4, 2, 'DESCARTADO', 11, 2, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (108, 4, 3, 'VALIDO', 11, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (109, 4, 4, 'DESCARTADO', 11, 2, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (110, 4, 5, 'VALIDO', 10, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (111, 4, 6, 'DESCARTADO', 10, 2, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (112, 4, 7, 'VALIDO', 10, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (113, 4, 8, 'DESCARTADO', 10, 2, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (114, 4, 9, 'VALIDO', 9, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (115, 4, 10, 'DESCARTADO', 12, 2, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (116, 4, 11, 'DESCARTADO', 12, 3, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (117, 4, 12, 'DESCARTADO', 11, 2, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (118, 4, 13, 'VALIDO', 12, 2, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (119, 4, 14, 'VALIDO', 11, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (120, 4, 15, 'DESCARTADO', 11, 2, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (121, 4, 16, 'DESCARTADO', 9, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (122, 4, 17, 'VALIDO', 9, 0, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (123, 4, 18, 'DESCARTADO', 9, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (124, 4, 19, 'VALIDO', 8, 0, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (125, 4, 20, 'DESCARTADO', 11, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (126, 4, 21, 'DESCARTADO', 11, 2, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (127, 4, 22, 'DESCARTADO', 10, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (128, 4, 23, 'VALIDO', 11, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (129, 4, 24, 'VALIDO', 10, 0, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (130, 4, 25, 'DESCARTADO', 10, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (131, 4, 26, 'VALIDO', 10, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (132, 4, 27, 'DESCARTADO', 10, 2, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (133, 4, 28, 'VALIDO', 9, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (134, 4, 29, 'VALIDO', 10, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (135, 4, 30, 'VALIDO', 9, 0, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (136, 4, 31, 'DESCARTADO', 9, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (137, 4, 32, 'VALIDO', 12, 2, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (138, 4, 33, 'VALIDO', 11, 1, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (139, 4, 34, 'DESCARTADO', 11, 2, '2026-07-27 02:01:00.38');
INSERT INTO public.generated_schedules VALUES (140, 4, 35, 'VALIDO', 11, 1, '2026-07-27 02:01:00.38');


--
-- Data for Name: prerequisites; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.prerequisites VALUES (8, 7);
INSERT INTO public.prerequisites VALUES (10, 5);


--
-- Data for Name: rejection_reasons; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.rejection_reasons VALUES (41, 37, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (42, 39, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (43, 41, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (44, 43, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (45, 45, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (46, 46, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (47, 46, 'MAXIMO_DIFICILES_SUPERADO', 'Supera el máximo de materias difíciles.');
INSERT INTO public.rejection_reasons VALUES (48, 46, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (49, 47, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (50, 50, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (51, 51, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (52, 51, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (53, 52, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (54, 53, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (55, 53, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (56, 54, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (57, 55, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (58, 55, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (59, 56, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (60, 56, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (61, 56, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (62, 57, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (63, 57, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (64, 58, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (65, 59, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (66, 60, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (67, 60, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (68, 61, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (69, 62, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (70, 62, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (71, 63, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (72, 64, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (73, 65, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (74, 66, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (75, 66, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (76, 67, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (77, 68, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (78, 69, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (79, 69, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (80, 70, 'MATERIAS_OBLIGATORIAS_FALTANTES', 'No contiene todas las materias obligatorias.');
INSERT INTO public.rejection_reasons VALUES (81, 72, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (82, 74, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (83, 76, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (84, 78, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (85, 80, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (86, 81, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (87, 81, 'MAXIMO_DIFICILES_SUPERADO', 'Supera el máximo de materias difíciles.');
INSERT INTO public.rejection_reasons VALUES (88, 81, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (89, 82, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (90, 85, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (91, 86, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (92, 88, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (93, 90, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (94, 91, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (95, 91, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (96, 92, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (97, 95, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (98, 97, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (99, 101, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (100, 104, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (101, 107, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (102, 109, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (103, 111, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (104, 113, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (105, 115, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (106, 116, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (107, 116, 'MAXIMO_DIFICILES_SUPERADO', 'Supera el máximo de materias difíciles.');
INSERT INTO public.rejection_reasons VALUES (108, 116, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (109, 117, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (110, 120, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (111, 121, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (112, 123, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (113, 125, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (114, 126, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (115, 126, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (116, 127, 'CRUCE_HORARIO', 'El horario tiene cruces.');
INSERT INTO public.rejection_reasons VALUES (117, 130, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (118, 132, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (119, 136, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');
INSERT INTO public.rejection_reasons VALUES (120, 139, 'PRERREQUISITOS_NO_CUMPLIDOS', 'No cumple todos los prerrequisitos.');


--
-- Data for Name: schedule_configurations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.schedule_configurations VALUES (2, 3, 12, 2, 'CUALQUIERA', true, true, 7, 35, 7, 28, '2026-07-27 00:52:59.079', '2026-07-27 00:52:59.074');
INSERT INTO public.schedule_configurations VALUES (3, 3, 12, 2, 'CUALQUIERA', true, true, 7, 35, 18, 17, '2026-07-27 02:00:44.558', '2026-07-27 02:00:44.46');
INSERT INTO public.schedule_configurations VALUES (4, 3, 12, 2, 'CUALQUIERA', true, true, 7, 35, 18, 17, '2026-07-27 02:01:00.38', '2026-07-27 02:01:00.376');


--
-- Data for Name: schedule_courses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.schedule_courses VALUES (71, 5);
INSERT INTO public.schedule_courses VALUES (71, 4);
INSERT INTO public.schedule_courses VALUES (71, 3);
INSERT INTO public.schedule_courses VALUES (72, 6);
INSERT INTO public.schedule_courses VALUES (72, 4);
INSERT INTO public.schedule_courses VALUES (72, 3);
INSERT INTO public.schedule_courses VALUES (73, 7);
INSERT INTO public.schedule_courses VALUES (73, 4);
INSERT INTO public.schedule_courses VALUES (73, 3);
INSERT INTO public.schedule_courses VALUES (74, 8);
INSERT INTO public.schedule_courses VALUES (74, 4);
INSERT INTO public.schedule_courses VALUES (74, 3);
INSERT INTO public.schedule_courses VALUES (75, 9);
INSERT INTO public.schedule_courses VALUES (75, 4);
INSERT INTO public.schedule_courses VALUES (75, 3);
INSERT INTO public.schedule_courses VALUES (76, 6);
INSERT INTO public.schedule_courses VALUES (76, 5);
INSERT INTO public.schedule_courses VALUES (76, 3);
INSERT INTO public.schedule_courses VALUES (77, 7);
INSERT INTO public.schedule_courses VALUES (77, 5);
INSERT INTO public.schedule_courses VALUES (77, 3);
INSERT INTO public.schedule_courses VALUES (78, 8);
INSERT INTO public.schedule_courses VALUES (78, 5);
INSERT INTO public.schedule_courses VALUES (78, 3);
INSERT INTO public.schedule_courses VALUES (79, 9);
INSERT INTO public.schedule_courses VALUES (79, 5);
INSERT INTO public.schedule_courses VALUES (79, 3);
INSERT INTO public.schedule_courses VALUES (80, 7);
INSERT INTO public.schedule_courses VALUES (80, 6);
INSERT INTO public.schedule_courses VALUES (80, 3);
INSERT INTO public.schedule_courses VALUES (81, 8);
INSERT INTO public.schedule_courses VALUES (81, 6);
INSERT INTO public.schedule_courses VALUES (81, 3);
INSERT INTO public.schedule_courses VALUES (82, 9);
INSERT INTO public.schedule_courses VALUES (82, 6);
INSERT INTO public.schedule_courses VALUES (82, 3);
INSERT INTO public.schedule_courses VALUES (83, 8);
INSERT INTO public.schedule_courses VALUES (83, 7);
INSERT INTO public.schedule_courses VALUES (83, 3);
INSERT INTO public.schedule_courses VALUES (84, 9);
INSERT INTO public.schedule_courses VALUES (84, 7);
INSERT INTO public.schedule_courses VALUES (84, 3);
INSERT INTO public.schedule_courses VALUES (85, 9);
INSERT INTO public.schedule_courses VALUES (85, 8);
INSERT INTO public.schedule_courses VALUES (85, 3);
INSERT INTO public.schedule_courses VALUES (86, 6);
INSERT INTO public.schedule_courses VALUES (86, 5);
INSERT INTO public.schedule_courses VALUES (86, 4);
INSERT INTO public.schedule_courses VALUES (87, 7);
INSERT INTO public.schedule_courses VALUES (87, 5);
INSERT INTO public.schedule_courses VALUES (87, 4);
INSERT INTO public.schedule_courses VALUES (88, 8);
INSERT INTO public.schedule_courses VALUES (88, 5);
INSERT INTO public.schedule_courses VALUES (88, 4);
INSERT INTO public.schedule_courses VALUES (89, 9);
INSERT INTO public.schedule_courses VALUES (89, 5);
INSERT INTO public.schedule_courses VALUES (89, 4);
INSERT INTO public.schedule_courses VALUES (90, 7);
INSERT INTO public.schedule_courses VALUES (90, 6);
INSERT INTO public.schedule_courses VALUES (90, 4);
INSERT INTO public.schedule_courses VALUES (91, 8);
INSERT INTO public.schedule_courses VALUES (91, 6);
INSERT INTO public.schedule_courses VALUES (91, 4);
INSERT INTO public.schedule_courses VALUES (92, 9);
INSERT INTO public.schedule_courses VALUES (92, 6);
INSERT INTO public.schedule_courses VALUES (92, 4);
INSERT INTO public.schedule_courses VALUES (93, 8);
INSERT INTO public.schedule_courses VALUES (93, 7);
INSERT INTO public.schedule_courses VALUES (93, 4);
INSERT INTO public.schedule_courses VALUES (94, 9);
INSERT INTO public.schedule_courses VALUES (94, 7);
INSERT INTO public.schedule_courses VALUES (94, 4);
INSERT INTO public.schedule_courses VALUES (95, 9);
INSERT INTO public.schedule_courses VALUES (95, 8);
INSERT INTO public.schedule_courses VALUES (95, 4);
INSERT INTO public.schedule_courses VALUES (96, 7);
INSERT INTO public.schedule_courses VALUES (96, 6);
INSERT INTO public.schedule_courses VALUES (96, 5);
INSERT INTO public.schedule_courses VALUES (97, 8);
INSERT INTO public.schedule_courses VALUES (97, 6);
INSERT INTO public.schedule_courses VALUES (97, 5);
INSERT INTO public.schedule_courses VALUES (98, 9);
INSERT INTO public.schedule_courses VALUES (98, 6);
INSERT INTO public.schedule_courses VALUES (98, 5);
INSERT INTO public.schedule_courses VALUES (99, 8);
INSERT INTO public.schedule_courses VALUES (99, 7);
INSERT INTO public.schedule_courses VALUES (99, 5);
INSERT INTO public.schedule_courses VALUES (100, 9);
INSERT INTO public.schedule_courses VALUES (100, 7);
INSERT INTO public.schedule_courses VALUES (100, 5);
INSERT INTO public.schedule_courses VALUES (101, 9);
INSERT INTO public.schedule_courses VALUES (101, 8);
INSERT INTO public.schedule_courses VALUES (101, 5);
INSERT INTO public.schedule_courses VALUES (102, 8);
INSERT INTO public.schedule_courses VALUES (102, 7);
INSERT INTO public.schedule_courses VALUES (102, 6);
INSERT INTO public.schedule_courses VALUES (103, 9);
INSERT INTO public.schedule_courses VALUES (103, 7);
INSERT INTO public.schedule_courses VALUES (103, 6);
INSERT INTO public.schedule_courses VALUES (104, 9);
INSERT INTO public.schedule_courses VALUES (104, 8);
INSERT INTO public.schedule_courses VALUES (104, 6);
INSERT INTO public.schedule_courses VALUES (105, 9);
INSERT INTO public.schedule_courses VALUES (105, 8);
INSERT INTO public.schedule_courses VALUES (105, 7);
INSERT INTO public.schedule_courses VALUES (36, 5);
INSERT INTO public.schedule_courses VALUES (36, 4);
INSERT INTO public.schedule_courses VALUES (36, 3);
INSERT INTO public.schedule_courses VALUES (37, 6);
INSERT INTO public.schedule_courses VALUES (37, 4);
INSERT INTO public.schedule_courses VALUES (37, 3);
INSERT INTO public.schedule_courses VALUES (38, 7);
INSERT INTO public.schedule_courses VALUES (38, 4);
INSERT INTO public.schedule_courses VALUES (38, 3);
INSERT INTO public.schedule_courses VALUES (39, 8);
INSERT INTO public.schedule_courses VALUES (39, 4);
INSERT INTO public.schedule_courses VALUES (39, 3);
INSERT INTO public.schedule_courses VALUES (40, 9);
INSERT INTO public.schedule_courses VALUES (40, 4);
INSERT INTO public.schedule_courses VALUES (40, 3);
INSERT INTO public.schedule_courses VALUES (41, 6);
INSERT INTO public.schedule_courses VALUES (41, 5);
INSERT INTO public.schedule_courses VALUES (41, 3);
INSERT INTO public.schedule_courses VALUES (42, 7);
INSERT INTO public.schedule_courses VALUES (42, 5);
INSERT INTO public.schedule_courses VALUES (42, 3);
INSERT INTO public.schedule_courses VALUES (43, 8);
INSERT INTO public.schedule_courses VALUES (43, 5);
INSERT INTO public.schedule_courses VALUES (43, 3);
INSERT INTO public.schedule_courses VALUES (44, 9);
INSERT INTO public.schedule_courses VALUES (44, 5);
INSERT INTO public.schedule_courses VALUES (44, 3);
INSERT INTO public.schedule_courses VALUES (45, 7);
INSERT INTO public.schedule_courses VALUES (45, 6);
INSERT INTO public.schedule_courses VALUES (45, 3);
INSERT INTO public.schedule_courses VALUES (46, 8);
INSERT INTO public.schedule_courses VALUES (46, 6);
INSERT INTO public.schedule_courses VALUES (46, 3);
INSERT INTO public.schedule_courses VALUES (47, 9);
INSERT INTO public.schedule_courses VALUES (47, 6);
INSERT INTO public.schedule_courses VALUES (47, 3);
INSERT INTO public.schedule_courses VALUES (48, 8);
INSERT INTO public.schedule_courses VALUES (48, 7);
INSERT INTO public.schedule_courses VALUES (48, 3);
INSERT INTO public.schedule_courses VALUES (49, 9);
INSERT INTO public.schedule_courses VALUES (49, 7);
INSERT INTO public.schedule_courses VALUES (49, 3);
INSERT INTO public.schedule_courses VALUES (50, 9);
INSERT INTO public.schedule_courses VALUES (50, 8);
INSERT INTO public.schedule_courses VALUES (50, 3);
INSERT INTO public.schedule_courses VALUES (51, 6);
INSERT INTO public.schedule_courses VALUES (51, 5);
INSERT INTO public.schedule_courses VALUES (51, 4);
INSERT INTO public.schedule_courses VALUES (52, 7);
INSERT INTO public.schedule_courses VALUES (52, 5);
INSERT INTO public.schedule_courses VALUES (52, 4);
INSERT INTO public.schedule_courses VALUES (53, 8);
INSERT INTO public.schedule_courses VALUES (53, 5);
INSERT INTO public.schedule_courses VALUES (53, 4);
INSERT INTO public.schedule_courses VALUES (54, 9);
INSERT INTO public.schedule_courses VALUES (54, 5);
INSERT INTO public.schedule_courses VALUES (54, 4);
INSERT INTO public.schedule_courses VALUES (55, 7);
INSERT INTO public.schedule_courses VALUES (55, 6);
INSERT INTO public.schedule_courses VALUES (55, 4);
INSERT INTO public.schedule_courses VALUES (56, 8);
INSERT INTO public.schedule_courses VALUES (56, 6);
INSERT INTO public.schedule_courses VALUES (56, 4);
INSERT INTO public.schedule_courses VALUES (57, 9);
INSERT INTO public.schedule_courses VALUES (57, 6);
INSERT INTO public.schedule_courses VALUES (57, 4);
INSERT INTO public.schedule_courses VALUES (58, 8);
INSERT INTO public.schedule_courses VALUES (58, 7);
INSERT INTO public.schedule_courses VALUES (58, 4);
INSERT INTO public.schedule_courses VALUES (59, 9);
INSERT INTO public.schedule_courses VALUES (59, 7);
INSERT INTO public.schedule_courses VALUES (59, 4);
INSERT INTO public.schedule_courses VALUES (60, 9);
INSERT INTO public.schedule_courses VALUES (60, 8);
INSERT INTO public.schedule_courses VALUES (60, 4);
INSERT INTO public.schedule_courses VALUES (61, 7);
INSERT INTO public.schedule_courses VALUES (61, 6);
INSERT INTO public.schedule_courses VALUES (61, 5);
INSERT INTO public.schedule_courses VALUES (62, 8);
INSERT INTO public.schedule_courses VALUES (62, 6);
INSERT INTO public.schedule_courses VALUES (62, 5);
INSERT INTO public.schedule_courses VALUES (63, 9);
INSERT INTO public.schedule_courses VALUES (63, 6);
INSERT INTO public.schedule_courses VALUES (63, 5);
INSERT INTO public.schedule_courses VALUES (64, 8);
INSERT INTO public.schedule_courses VALUES (64, 7);
INSERT INTO public.schedule_courses VALUES (64, 5);
INSERT INTO public.schedule_courses VALUES (65, 9);
INSERT INTO public.schedule_courses VALUES (65, 7);
INSERT INTO public.schedule_courses VALUES (65, 5);
INSERT INTO public.schedule_courses VALUES (66, 9);
INSERT INTO public.schedule_courses VALUES (66, 8);
INSERT INTO public.schedule_courses VALUES (66, 5);
INSERT INTO public.schedule_courses VALUES (67, 8);
INSERT INTO public.schedule_courses VALUES (67, 7);
INSERT INTO public.schedule_courses VALUES (67, 6);
INSERT INTO public.schedule_courses VALUES (68, 9);
INSERT INTO public.schedule_courses VALUES (68, 7);
INSERT INTO public.schedule_courses VALUES (68, 6);
INSERT INTO public.schedule_courses VALUES (69, 9);
INSERT INTO public.schedule_courses VALUES (69, 8);
INSERT INTO public.schedule_courses VALUES (69, 6);
INSERT INTO public.schedule_courses VALUES (70, 9);
INSERT INTO public.schedule_courses VALUES (70, 8);
INSERT INTO public.schedule_courses VALUES (70, 7);
INSERT INTO public.schedule_courses VALUES (106, 5);
INSERT INTO public.schedule_courses VALUES (106, 4);
INSERT INTO public.schedule_courses VALUES (106, 3);
INSERT INTO public.schedule_courses VALUES (107, 6);
INSERT INTO public.schedule_courses VALUES (107, 4);
INSERT INTO public.schedule_courses VALUES (107, 3);
INSERT INTO public.schedule_courses VALUES (108, 7);
INSERT INTO public.schedule_courses VALUES (108, 4);
INSERT INTO public.schedule_courses VALUES (108, 3);
INSERT INTO public.schedule_courses VALUES (109, 8);
INSERT INTO public.schedule_courses VALUES (109, 4);
INSERT INTO public.schedule_courses VALUES (109, 3);
INSERT INTO public.schedule_courses VALUES (110, 9);
INSERT INTO public.schedule_courses VALUES (110, 4);
INSERT INTO public.schedule_courses VALUES (110, 3);
INSERT INTO public.schedule_courses VALUES (111, 6);
INSERT INTO public.schedule_courses VALUES (111, 5);
INSERT INTO public.schedule_courses VALUES (111, 3);
INSERT INTO public.schedule_courses VALUES (112, 7);
INSERT INTO public.schedule_courses VALUES (112, 5);
INSERT INTO public.schedule_courses VALUES (112, 3);
INSERT INTO public.schedule_courses VALUES (113, 8);
INSERT INTO public.schedule_courses VALUES (113, 5);
INSERT INTO public.schedule_courses VALUES (113, 3);
INSERT INTO public.schedule_courses VALUES (114, 9);
INSERT INTO public.schedule_courses VALUES (114, 5);
INSERT INTO public.schedule_courses VALUES (114, 3);
INSERT INTO public.schedule_courses VALUES (115, 7);
INSERT INTO public.schedule_courses VALUES (115, 6);
INSERT INTO public.schedule_courses VALUES (115, 3);
INSERT INTO public.schedule_courses VALUES (116, 8);
INSERT INTO public.schedule_courses VALUES (116, 6);
INSERT INTO public.schedule_courses VALUES (116, 3);
INSERT INTO public.schedule_courses VALUES (117, 9);
INSERT INTO public.schedule_courses VALUES (117, 6);
INSERT INTO public.schedule_courses VALUES (117, 3);
INSERT INTO public.schedule_courses VALUES (118, 8);
INSERT INTO public.schedule_courses VALUES (118, 7);
INSERT INTO public.schedule_courses VALUES (118, 3);
INSERT INTO public.schedule_courses VALUES (119, 9);
INSERT INTO public.schedule_courses VALUES (119, 7);
INSERT INTO public.schedule_courses VALUES (119, 3);
INSERT INTO public.schedule_courses VALUES (120, 9);
INSERT INTO public.schedule_courses VALUES (120, 8);
INSERT INTO public.schedule_courses VALUES (120, 3);
INSERT INTO public.schedule_courses VALUES (121, 6);
INSERT INTO public.schedule_courses VALUES (121, 5);
INSERT INTO public.schedule_courses VALUES (121, 4);
INSERT INTO public.schedule_courses VALUES (122, 7);
INSERT INTO public.schedule_courses VALUES (122, 5);
INSERT INTO public.schedule_courses VALUES (122, 4);
INSERT INTO public.schedule_courses VALUES (123, 8);
INSERT INTO public.schedule_courses VALUES (123, 5);
INSERT INTO public.schedule_courses VALUES (123, 4);
INSERT INTO public.schedule_courses VALUES (124, 9);
INSERT INTO public.schedule_courses VALUES (124, 5);
INSERT INTO public.schedule_courses VALUES (124, 4);
INSERT INTO public.schedule_courses VALUES (125, 7);
INSERT INTO public.schedule_courses VALUES (125, 6);
INSERT INTO public.schedule_courses VALUES (125, 4);
INSERT INTO public.schedule_courses VALUES (126, 8);
INSERT INTO public.schedule_courses VALUES (126, 6);
INSERT INTO public.schedule_courses VALUES (126, 4);
INSERT INTO public.schedule_courses VALUES (127, 9);
INSERT INTO public.schedule_courses VALUES (127, 6);
INSERT INTO public.schedule_courses VALUES (127, 4);
INSERT INTO public.schedule_courses VALUES (128, 8);
INSERT INTO public.schedule_courses VALUES (128, 7);
INSERT INTO public.schedule_courses VALUES (128, 4);
INSERT INTO public.schedule_courses VALUES (129, 9);
INSERT INTO public.schedule_courses VALUES (129, 7);
INSERT INTO public.schedule_courses VALUES (129, 4);
INSERT INTO public.schedule_courses VALUES (130, 9);
INSERT INTO public.schedule_courses VALUES (130, 8);
INSERT INTO public.schedule_courses VALUES (130, 4);
INSERT INTO public.schedule_courses VALUES (131, 7);
INSERT INTO public.schedule_courses VALUES (131, 6);
INSERT INTO public.schedule_courses VALUES (131, 5);
INSERT INTO public.schedule_courses VALUES (132, 8);
INSERT INTO public.schedule_courses VALUES (132, 6);
INSERT INTO public.schedule_courses VALUES (132, 5);
INSERT INTO public.schedule_courses VALUES (133, 9);
INSERT INTO public.schedule_courses VALUES (133, 6);
INSERT INTO public.schedule_courses VALUES (133, 5);
INSERT INTO public.schedule_courses VALUES (134, 8);
INSERT INTO public.schedule_courses VALUES (134, 7);
INSERT INTO public.schedule_courses VALUES (134, 5);
INSERT INTO public.schedule_courses VALUES (135, 9);
INSERT INTO public.schedule_courses VALUES (135, 7);
INSERT INTO public.schedule_courses VALUES (135, 5);
INSERT INTO public.schedule_courses VALUES (136, 9);
INSERT INTO public.schedule_courses VALUES (136, 8);
INSERT INTO public.schedule_courses VALUES (136, 5);
INSERT INTO public.schedule_courses VALUES (137, 8);
INSERT INTO public.schedule_courses VALUES (137, 7);
INSERT INTO public.schedule_courses VALUES (137, 6);
INSERT INTO public.schedule_courses VALUES (138, 9);
INSERT INTO public.schedule_courses VALUES (138, 7);
INSERT INTO public.schedule_courses VALUES (138, 6);
INSERT INTO public.schedule_courses VALUES (139, 9);
INSERT INTO public.schedule_courses VALUES (139, 8);
INSERT INTO public.schedule_courses VALUES (139, 6);
INSERT INTO public.schedule_courses VALUES (140, 9);
INSERT INTO public.schedule_courses VALUES (140, 8);
INSERT INTO public.schedule_courses VALUES (140, 7);


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.courses_id_seq', 10, true);


--
-- Name: generated_schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.generated_schedules_id_seq', 196, true);


--
-- Name: rejection_reasons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rejection_reasons_id_seq', 213, true);


--
-- Name: schedule_configurations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.schedule_configurations_id_seq', 5, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: configuration_completed_courses configuration_completed_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration_completed_courses
    ADD CONSTRAINT configuration_completed_courses_pkey PRIMARY KEY (configuration_id, course_id);


--
-- Name: configuration_required_courses configuration_required_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration_required_courses
    ADD CONSTRAINT configuration_required_courses_pkey PRIMARY KEY (configuration_id, course_id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: generated_schedules generated_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generated_schedules
    ADD CONSTRAINT generated_schedules_pkey PRIMARY KEY (id);


--
-- Name: prerequisites prerequisites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prerequisites
    ADD CONSTRAINT prerequisites_pkey PRIMARY KEY (course_id, prerequisite_course_id);


--
-- Name: rejection_reasons rejection_reasons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rejection_reasons
    ADD CONSTRAINT rejection_reasons_pkey PRIMARY KEY (id);


--
-- Name: schedule_configurations schedule_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_configurations
    ADD CONSTRAINT schedule_configurations_pkey PRIMARY KEY (id);


--
-- Name: schedule_courses schedule_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_courses
    ADD CONSTRAINT schedule_courses_pkey PRIMARY KEY (schedule_id, course_id);


--
-- Name: configuration_completed_courses_course_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX configuration_completed_courses_course_id_idx ON public.configuration_completed_courses USING btree (course_id);


--
-- Name: configuration_required_courses_course_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX configuration_required_courses_course_id_idx ON public.configuration_required_courses USING btree (course_id);


--
-- Name: courses_day_start_time_end_time_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX courses_day_start_time_end_time_idx ON public.courses USING btree (day, start_time, end_time);


--
-- Name: courses_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX courses_name_idx ON public.courses USING btree (name);


--
-- Name: generated_schedules_configuration_id_combination_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX generated_schedules_configuration_id_combination_number_key ON public.generated_schedules USING btree (configuration_id, combination_number);


--
-- Name: generated_schedules_configuration_id_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX generated_schedules_configuration_id_status_idx ON public.generated_schedules USING btree (configuration_id, status);


--
-- Name: prerequisites_prerequisite_course_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX prerequisites_prerequisite_course_id_idx ON public.prerequisites USING btree (prerequisite_course_id);


--
-- Name: rejection_reasons_schedule_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rejection_reasons_schedule_id_idx ON public.rejection_reasons USING btree (schedule_id);


--
-- Name: schedule_courses_course_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX schedule_courses_course_id_idx ON public.schedule_courses USING btree (course_id);


--
-- Name: configuration_completed_courses configuration_completed_courses_configuration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration_completed_courses
    ADD CONSTRAINT configuration_completed_courses_configuration_id_fkey FOREIGN KEY (configuration_id) REFERENCES public.schedule_configurations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: configuration_completed_courses configuration_completed_courses_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration_completed_courses
    ADD CONSTRAINT configuration_completed_courses_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: configuration_required_courses configuration_required_courses_configuration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration_required_courses
    ADD CONSTRAINT configuration_required_courses_configuration_id_fkey FOREIGN KEY (configuration_id) REFERENCES public.schedule_configurations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: configuration_required_courses configuration_required_courses_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration_required_courses
    ADD CONSTRAINT configuration_required_courses_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: generated_schedules generated_schedules_configuration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generated_schedules
    ADD CONSTRAINT generated_schedules_configuration_id_fkey FOREIGN KEY (configuration_id) REFERENCES public.schedule_configurations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: prerequisites prerequisites_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prerequisites
    ADD CONSTRAINT prerequisites_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: prerequisites prerequisites_prerequisite_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prerequisites
    ADD CONSTRAINT prerequisites_prerequisite_course_id_fkey FOREIGN KEY (prerequisite_course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: rejection_reasons rejection_reasons_schedule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rejection_reasons
    ADD CONSTRAINT rejection_reasons_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.generated_schedules(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: schedule_courses schedule_courses_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_courses
    ADD CONSTRAINT schedule_courses_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: schedule_courses schedule_courses_schedule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_courses
    ADD CONSTRAINT schedule_courses_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES public.generated_schedules(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict VaHW9mQeS8klt2uyBtgjrLF9nCMQjGwQtnHZuKDRvAD85iHcFzL2SbvBliEmu4a

