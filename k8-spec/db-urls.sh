#!/bin/bash
## create secrets for mysql and postgres
##

kubectl -n qa create secret generic postgres-url \
  --from-literal=postgres-url=postgresql://${PGUSER}:${PGPASSWORD}@postgres:5432/${PGUSER}

kubectl -n qa create secret generic mysql-pass \
        --from-literal=password=${MYSQL_ROOT_PASSWORD}
