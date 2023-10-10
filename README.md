# Ecommerce monorepo

## Project Overview

The goal for this project is, having a eccomerce project as an excuse, to show how to apply the following patterns:

### Pattern

- **Monorepo**: to group all the code proejct in the same repository
- **Database**: to persist the state and events of the domain objects
- **Domain Driven Design (DDD)**
  - Layer separation: domain, appplication and infrastructure
  - Tactical patterns: aggregate, entity, value-object, repository, event
- **Loosely coupled modules and asynchronous communication**
  - **Processes**: All the modules work independently and the communication is made through events
  - **Code**: there are almost no imports between modules
- **Event bus**: to handle asynchronous communication between modules
- **Transactional Outbox**: to ensure that each time the state of a domain object is persisted an event as part of the transaction is stored in another table
- **Message Relay**: to manage sending the event to the proper channel in the event bus
- **Saga**: to manage distributed transactions between different modules. Achieve ACD (without the I of ACID because it's distributed) eventual consistency
- **Pub/Sub**: to react when a notification event is added
- **Containerization**: containerization of all the infrastructure third party application so the project can be agnostic and everyone use the same version of those applications
- **E2E backend testing**: to test the behaviour of the project

### Tools used for each pattern

- **Monorepo**: Nx
- **Dabase**: Postgres
- **Loosely coupled modules and asynchronous communication**: each contexts is in an independent library, all of them used by the app, which have only the code coupled to the framework
- **Event bus**: Kafka
- **Message Relay**: Debezium and Kafka Connect
- **Saga**: A custom library is provided in the proyect
- **Pub/Sub**: graphql subscriptions
- **Containerization**: docker
- **E2E backend testing**: jest, cucumber and docker to deploy a container with the database needed. The container is only up while doing the tests

### Domain explanations

The business domain consists in three bounded contexts:

- Products-management: products that are sold by the ecommerce
- Orders-management: orders of certain amount of certain products requested by a client
- Notifications-management: notifications that are produced as a reaction of the different use cases

#### Place order use case

This use case is interesting because it needs a transaction that spans different contexts to be fulfilled. To achieve the eventual consistency of the use case i am using the saga pattern thorough a custom library done for this proyect

[![Captura-de-pantalla-2023-10-10-a-las-15-07-59.png](https://i.postimg.cc/rFf7BfQQ/Captura-de-pantalla-2023-10-10-a-las-15-07-59.png)](https://postimg.cc/KRg9LDXM)

The saga is expressing by the DSL the following flow:

- An order with state `PENDING` is stored in the database
- The saga ask through an event to the Product contexts to validate the items and if successfully reduce their stock
- When the reply of the product services arrives:
  - If the validation failed the status of the order changes to `CANCELLED`
  - ift the validation succeded the status of the order changes to `APPROVED`

Along with that, the `OrderPlaced` event is sent when the order is placed, and `OrderApproved` or `OrderCancelled`is sent when the validation answer is recieved.

Finally the notification contexts in listening for the events and creating notifications whenever any of them is recieved. The notifications can be read in real time through websockets (graphql subscriptions)

### How to use the project

First to download the docker images for the third party infrastructure app and deploy the debezium connectors to listen to the database changes:

`npx nx run nestjs:docker:up`

Launch the nestjs application:

`npx nx run nestjs:serve`

A postman collection is attached in the project root with all the endpoints

To watch in real time the notifications through graphql subscriptions:

- Go in the browser to `http://localhost:3000/api/graphql`
- Copy the following snippet

```
    subscription {
          notificationAdded {
            id
            message
          }
        }
```

- Click the play button

To execute the e2e tests:

`npx nx run nestjs:test`

To put down the docker container:

`npx nx run nestjs:docker:down`
©
