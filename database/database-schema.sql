--
-- PostgreSQL database dump
--

\restrict ACa7bGa7LvJTXRxiQd0eTsFRG2YCrquivVZcYfSUrFI231SUe5WhOzh9TVhLuY7

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

\unrestrict ACa7bGa7LvJTXRxiQd0eTsFRG2YCrquivVZcYfSUrFI231SUe5WhOzh9TVhLuY7

