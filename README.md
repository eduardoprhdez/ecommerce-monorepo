# E-commerce Monorepo

A demonstration project showcasing advanced distributed system patterns in a TypeScript e-commerce application.

## ⚠️ IMPORTANT: Platform Compatibility

**This project is designed to run on Unix-based systems (Linux/macOS) only.**

The project uses shell scripts and Unix-specific commands that are not compatible with Windows. If you're using Windows, please use one of these options:

- **Windows Subsystem for Linux (WSL2)**
- **Linux Virtual Machine** 
- **macOS or Linux system**

The project will **NOT** work on native Windows due to shell script dependencies and Unix command usage.

---

## 🎯 Project Overview

This project uses an e-commerce domain as a practical example to demonstrate the implementation of several distributed system patterns and architectural principles. It's designed as a learning resource and reference implementation for building scalable, event-driven microservices.

## 🏗️ Architecture Patterns Implemented

### Core Patterns
- **Monorepo**: Centralized codebase management using Nx
- **Domain Driven Design (DDD)**:
  - Clean layer separation (domain, application, infrastructure)
  - Tactical patterns: aggregates, entities, value objects, repositories, events
- **Loosely Coupled Modules**: Independent modules communicating asynchronously
- **Event-Driven Architecture**: Asynchronous communication through events
- **Database per Service**: Each bounded context owns its data

### Distributed System Patterns
- **Saga Pattern**: Custom implementation for distributed transaction management
- **Transactional Outbox**: Ensures event publishing with state changes
- **Message Relay**: Automated event forwarding using Debezium
- **Event Bus**: Kafka-based message broker
- **Pub/Sub**: Real-time notifications via GraphQL subscriptions

### Infrastructure Patterns
- **Containerization**: Docker-based development environment
- **E2E Testing**: Comprehensive backend testing with containerized dependencies

## 🛠️ Technology Stack

| Pattern | Implementation |
|---------|---------------|
| **Monorepo** | Nx |
| **Database** | PostgreSQL |
| **Event Bus** | Apache Kafka |
| **Message Relay** | Debezium + Kafka Connect |
| **Saga Orchestration** | Custom TypeScript library |
| **Real-time Communication** | GraphQL Subscriptions |
| **Containerization** | Docker & Docker Compose |
| **Testing** | Jest + Cucumber + Docker |

## 🏪 Domain Model

The system is organized into three bounded contexts:

### 📦 Products Management
- Product catalog management
- Inventory tracking and validation
- Stock reduction operations

### 🛒 Orders Management  
- Order lifecycle management
- Order state transitions (PENDING → APPROVED/CANCELLED)
- Integration with product validation

### 🔔 Notifications Management
- Event-driven notification creation
- Real-time notification delivery
- GraphQL subscription support

## 🔄 Place Order Saga Flow

The **Place Order** use case demonstrates distributed transaction management across multiple contexts:

[![Saga Flow Diagram](https://i.postimg.cc/rFf7BfQQ/Captura-de-pantalla-2023-10-10-a-las-15-07-59.png)](https://postimg.cc/KRg9LDXM)

### Saga Steps:
1. **Create Order**: Store order with `PENDING` status
2. **Validate & Reserve**: Request product validation and stock reduction
3. **Handle Response**:
   - ✅ **Success**: Order status → `APPROVED`
   - ❌ **Failure**: Order status → `CANCELLED` (with compensation)

### Events Published:
- `OrderPlaced` - When order is initially created
- `OrderApproved` - When validation succeeds  
- `OrderCancelled` - When validation fails

### Notifications:
The notification context listens for all order events and creates real-time notifications accessible via GraphQL subscriptions.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker Desktop or Docker CLI
- npm

### Setup & Run

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd ecommerce-monorepo
   npm install
   ```

2. **Start Infrastructure**
   ```bash
   npx nx run nestjs:docker:up
   ```
   This launches:
   - PostgreSQL database
   - Apache Kafka
   - Debezium connectors
   - Kafka Connect

3. **Start Application**
   ```bash
   npx nx run nestjs:serve
   ```
   Server runs on `http://localhost:3000`

4. **Test Real-time Notifications**
   - Navigate to `http://localhost:3000/api/graphql`
   - Use this subscription:
   ```graphql
   subscription {
     notificationAdded {
       id
       message
     }
   }
   ```

### API Testing
A Postman collection is included in the project root with all available endpoints.

### Cleanup
```bash
# Stop containers
npx nx run nestjs:docker:down

# Run E2E tests
npx nx run nestjs:test
```

## 📁 Project Structure

```
├── libs/
│   ├── saga/                           # Custom saga orchestration library
│   │   ├── definitions/                # Interfaces and abstractions
│   │   └── implementations/            # Concrete implementations
│   └── contexts/
│       ├── orders-management/          # Order bounded context
│       ├── products-management/        # Product bounded context
│       └── notifications-management/   # Notification bounded context
├── apps/
│   └── nestjs/                        # NestJS application entry point
└── tools/                             # Build and development utilities
```

## 🧪 Key Features Demonstrated

### ✅ Distributed Transaction Management
- Saga pattern implementation with compensation logic
- Cross-context data consistency
- Failure handling and rollback mechanisms

### ✅ Event-Driven Communication
- Asynchronous message processing
- Event sourcing capabilities
- Real-time notification system

### ✅ Clean Architecture
- DDD tactical patterns
- Bounded context separation  
- Infrastructure abstraction

### ✅ Production-Ready Patterns
- Transactional outbox pattern
- Message relay automation
- Containerized development environment

## 📊 Learning Outcomes

This project demonstrates how to:
- Implement the Saga pattern for distributed transactions
- Build event-driven microservices with clean architecture
- Handle cross-service data consistency
- Create loosely coupled, independently deployable services
- Test distributed systems effectively

## 📝 Notes

This is a demonstration project created for learning and reference purposes. It showcases production-ready patterns and practices in a simplified e-commerce context, making it ideal for understanding distributed system architecture principles.

---

*Built with TypeScript, featuring custom saga orchestration and comprehensive distributed system patterns.*
