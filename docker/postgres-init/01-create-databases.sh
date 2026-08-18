#!/bin/bash
# Runs automatically on first container start (docker-entrypoint-initdb.d).
# Creates one database per microservice so each keeps its own schema/migrations,
# while still sharing a single Postgres instance for local dev.
set -e

for db in core_service ai_service billing_service communication_service; do
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    SELECT 'CREATE DATABASE $db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$db')\gexec
EOSQL
done
