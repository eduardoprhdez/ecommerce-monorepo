#!/bin/bash

NOTIFICATIONS='
{
  "name": "ecommerce-notifications",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "postgres",
    "database.password": "postgres",
    "database.dbname": "ecommerce",
    "database.server.name": "ecommerce",
    "key.converter": "org.apache.kafka.connect.json.JsonConverter",
    "key.converter.schemas.enable": "false",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable": "false",
    "plugin.name": "pgoutput",
    "time.precision.mode": "connect",
    "schema.include.list": "public",
    "table.include.list": "public.OrderTypeormEntity, public.NotificationTypeormEntity",
    "transforms": "RenameField, ContentBasedRouting",
    "transforms.RenameField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
    "transforms.RenameField.blacklist": "before",
    "transforms.RenameField.include": "after, source",
    "transforms.RenameField.renames": "after:data,source:metadata",
    "transforms.ContentBasedRouting.type": "io.debezium.transforms.ContentBasedRouter",
    "transforms.ContentBasedRouting.language": "jsr223.groovy",
    "transforms.ContentBasedRouting.topic.expression": "value.metadata.table",
    "skipped.operations": "t",
    "connector.client.config.override.policy": "All",
    "slot.name": "ecommercenotificationslot"
  }
}
'

ORDER_PLACING='
{
  "name": "ecommerce-order-placing",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "postgres",
    "database.password": "postgres",
    "database.dbname": "ecommerce",
    "database.server.name": "ecommerce",
    "key.converter": "org.apache.kafka.connect.json.JsonConverter",
    "key.converter.schemas.enable": "false",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable": "false",
    "plugin.name": "pgoutput",
    "time.precision.mode": "connect",
    "schema.include.list": "public",
    "table.include.list": "public.MessageTypeormEntity",
    "transforms": "RenameField, ContentBasedRouting",
    "transforms.RenameField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
    "transforms.RenameField.blacklist": "before",
    "transforms.RenameField.include": "after, source",
    "transforms.RenameField.renames": "after:data,source:metadata",
    "transforms.ContentBasedRouting.type": "io.debezium.transforms.ContentBasedRouter",
    "transforms.ContentBasedRouting.language": "jsr223.groovy",
    "transforms.ContentBasedRouting.topic.expression": "value.data.channel",
    "skipped.operations": "u,d,t",
    "connector.client.config.override.policy": "All",
    "slot.name": "ecommerceslot"
  }
}
'



# Utiliza curl para crear el conector Debezium
curl -i -X POST -H "Accept: application/json" -H "Content-Type: application/json" -d "$NOTIFICATIONS" http://localhost:8083/connectors
curl -i -X POST -H "Accept: application/json" -H "Content-Type: application/json" -d "$ORDER_PLACING" http://localhost:8083/connectors