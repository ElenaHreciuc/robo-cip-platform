"use strict";
const {Pool}=require("pg");
const SCHEMA=`
CREATE TABLE IF NOT EXISTS institutions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL,
 country_code char(2) NOT NULL CHECK (country_code ~ '^[A-Z]{2}$'),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS accounts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 email text UNIQUE,
 email_verified_at timestamptz,
 nickname text UNIQUE,
 password_hash text,
 role text NOT NULL CHECK (role IN ('teacher','parent','student','platform_admin')),
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','suspended')),
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK (email IS NOT NULL OR nickname IS NOT NULL)
);
CREATE TABLE IF NOT EXISTS email_verifications (
 account_id uuid PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
 token_hash text UNIQUE NOT NULL,
 expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS school_memberships (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 institution_id uuid NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
 account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
 role text NOT NULL CHECK (role IN ('teacher','school_admin')),
 verified_at timestamptz,
 UNIQUE (institution_id,account_id)
);
CREATE TABLE IF NOT EXISTS classes (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 institution_id uuid NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
 owner_teacher_id uuid NOT NULL REFERENCES accounts(id),
 name text NOT NULL,
 school_year text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS learner_profiles (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 account_id uuid UNIQUE NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
 display_name text,
 age_band text CHECK (age_band IN ('7-8','8-9','9-10')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS learner_private_identity (
 learner_id uuid PRIMARY KEY REFERENCES learner_profiles(id) ON DELETE CASCADE,
 legal_name text NOT NULL
);
CREATE TABLE IF NOT EXISTS class_enrollments (
 class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
 learner_id uuid NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
 joined_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY (class_id,learner_id)
);
CREATE TABLE IF NOT EXISTS family_links (
 parent_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
 learner_id uuid NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
 relation text NOT NULL DEFAULT 'parent',
 linked_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(parent_id,learner_id)
);
CREATE TABLE IF NOT EXISTS activity_progress (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 learner_id uuid NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
 activity_key text NOT NULL,
 status text NOT NULL DEFAULT 'started' CHECK(status IN ('started','completed')),
 result jsonb NOT NULL DEFAULT '{}'::jsonb,
 updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(learner_id,activity_key)
);
CREATE TABLE IF NOT EXISTS portfolios (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 learner_id uuid NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
 activity_key text NOT NULL,
 content jsonb NOT NULL DEFAULT '{}'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_class_school ON classes(institution_id);
CREATE INDEX IF NOT EXISTS idx_membership_school ON school_memberships(institution_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_learner ON portfolios(learner_id);
CREATE INDEX IF NOT EXISTS idx_progress_learner ON activity_progress(learner_id);
`;
const pool=process.env.DATABASE_URL?new Pool({connectionString:process.env.DATABASE_URL,max:5,connectionTimeoutMillis:5000,ssl:process.env.PGSSLMODE==="require"?{rejectUnauthorized:false}:undefined}):null;
async function initialize(){if(!pool){console.warn("[db] DATABASE_URL absent; database initialization skipped");return false}const client=await pool.connect();try{await client.query("BEGIN");await client.query(SCHEMA);await client.query("COMMIT");console.log("[db] PostgreSQL schema initialized");return true}catch(err){await client.query("ROLLBACK");throw err}finally{client.release()}}
module.exports={pool,initialize};
