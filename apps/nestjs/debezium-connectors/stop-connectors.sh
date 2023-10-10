#!/bin/bash

# Utiliza curl para crear el conector Debezium
curl -i -X DELETE -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ecommerce-saga-messages
curl -i -X DELETE -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ecommerce-events