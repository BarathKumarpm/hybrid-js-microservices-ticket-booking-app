#!/bin/bash
set -e

# This script creates the databases using the variables passed from the root .env
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE ${DB_NAME_USERS:-users_db};
    CREATE DATABASE ${DB_NAME_BOOKINGS:-bookings_db};
    GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME_USERS:-users_db} TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME_BOOKINGS:-bookings_db} TO $POSTGRES_USER;
EOSQL