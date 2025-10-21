# System Architecture Diagram

This document presents the complete system architecture diagram for the Blockchain Voting System with ZK privacy and gasless transactions.

## Architecture Overview

The Blockchain Voting System follows a layered architecture that separates concerns while maintaining seamless integration between components. The system combines traditional web application patterns with blockchain technology and zero-knowledge privacy.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐                                                       │
│  │   Web Browser   │                                                       │
│  │  (React/Vite)   │                                                       │
│  └─────────────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                       │
│  │   Admin Portal  │                                                       │
│  │  (React/Admin)  │                                                       │
│  └─────────────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│                         ┌─────────▼─────────┐                             │
│                         │   API Gateway     │                             │
│                         │   (REST/GraphQL)  │                             │
│                         └─────────┬─────────┘                             │
└───────────────────────────────────┼─────────────────────────────────────────┘
                                    │
┌───────────────────────────────────┼─────────────────────────────────────────┐
│                           BACKEND LAYER                                 │
├───────────────────────────────────┼─────────────────────────────────────────┤
│                                   │                                       │
│                         ┌─────────▼─────────┐                             │
│                         │   Web Application │                             │
│                         │     Server        │                             │
│                         │  (Node.js/Hono)   │                             │
│                         └─────────┬─────────┘                             │
│                                   │                                       │
│                    ┌──────────────┼──────────────┐                        │
│                    │              │              │                        │
│          ┌─────────▼─────────┐    │    ┌─────────▼─────────┐              │
│          │ Authentication &  │    │    │  Business Logic   │              │
│          │    Session Mgmt   │    │    │                   │              │
│          └─────────────────┘    │    └─────────────────┘              │
│                    │              │              │                        │
│          ┌─────────▼─────────┐    │    ┌─────────▼─────────┐              │
│          │   ZK Proof Gen    │    │    │ Election Mgmt     │              │
│          │   & Validation    │    │    │                   │              │
│          └─────────────────┘    │    └─────────────────┘              │
│                    │              │              │                        │
│          ┌─────────▼─────────┐    │    ┌─────────▼─────────┐              │
│          │  Blockchain Relay │    │    │ Database Access   │              │
│          │   Service         │    │    │                   │              │
│          └─────────────────┘    │    └─────────────────┘              │
│                    │              │              │                        │
│                    └──────────────┼──────────────┘                        │
│                                   │                                       │
│                         ┌─────────▼─────────┐                             │
│                         │    Storage        │                             │
│                         │  (PostgreSQL)     │                             │
│                         └─────────┬─────────┘                             │
└───────────────────────────────────┼─────────────────────────────────────────┘
                                    │
┌───────────────────────────────────┼─────────────────────────────────────────┐
│                        BLOCKCHAIN LAYER                                 │
├───────────────────────────────────┼─────────────────────────────────────────┤
│                                   │                                       │
│                         ┌─────────▼─────────┐                             │
│                         │  Smart Contracts  │                             │
│                         │                   │                             │
│                         │  ┌─────────────┐  │                             │
│                         │  │ VotingSystem│  │                             │
│                         │  ├─────────────┤  │                             │
│                         │  │ Election    │  │                             │
│                         │  ├─────────────┤  │                             │
│                         │  │ Party       │  │                             │
│                         │  ├─────────────┤  │                             │
│                         │  │ Candidate   │  │                             │
│                         │  ├─────────────┤  │                             │
│                         │  │ Voter       │  │                             │
│                         │  └─────────────┘  │                             │
│                         └─────────┬─────────┘                             │
│                                   │                                       │
│                         ┌─────────▼─────────┐                             │
│                         │  ZK Circuits      │                             │
│                         │  (Semaphore)      │                             │
│                         └─────────┬─────────┘                             │
│                                   │                                       │
│                         ┌─────────▼─────────┐                             │
│                         │  Blockchain       │                             │
│                         │  (Polygon/Mumbai) │                             │
│                         └───────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Layer-by-Layer Explanation

### 1. Frontend Layer

#### Web Browser
- **Technology**: React with Vite
- **Purpose**: Primary voting interface for voters
- **Features**: 
  - Voter registration and authentication
  - Election browsing and information display
  - Voting interface with candidate selection
  - Real-time election results display
  - Responsive design for various devices

#### Admin Portal
- **Technology**: React with Admin Dashboard components
- **Purpose**: Election administration interface
- **Features**:
  - Election creation and management
  - Voter registration and verification
  - Candidate and party management
  - Real-time monitoring and analytics
  - Results visualization and reporting

### 2. Backend Layer

#### API Gateway
- **Technology**: REST/GraphQL API
- **Purpose**: Entry point for all client requests
- **Features**:
  - Request routing and load balancing
  - Authentication and authorization
  - Rate limiting and security
  - API documentation (Swagger/OpenAPI)

#### Web Application Server
- **Technology**: Node.js with Hono framework
- **Purpose**: Core business logic execution
- **Features**:
  - Request processing and response generation
  - Session and user management
  - Business rule enforcement
  - Error handling and logging

#### Authentication & Session Management
- **Purpose**: User authentication and session handling
- **Features**:
  - Voter and admin authentication
  - Session token generation and validation
  - Password hashing and security
  - JWT token management

#### ZK Proof Generation & Validation
- **Purpose**: Zero-knowledge proof handling
- **Features**:
  - Semaphore identity generation
  - ZK proof generation for voter eligibility
  - Proof validation before blockchain submission
  - Integration with Semaphore circuits

#### Blockchain Relay Service
- **Purpose**: Bridge between traditional web and blockchain
- **Features**:
  - Gasless transaction handling
  - Wallet management for transaction signing
  - Transaction monitoring and confirmation
  - Error handling and retry mechanisms

#### Business Logic
- **Purpose**: Core voting system functionality
- **Features**:
  - Election lifecycle management
  - Voting process orchestration
  - Results calculation and aggregation
  - Validation and verification workflows

#### Database Access
- **Purpose**: Data persistence and retrieval
- **Features**:
  - Voter information storage
  - Election and candidate data management
  - Vote records and audit trails
  - Performance optimization and caching

#### Storage
- **Technology**: PostgreSQL database
- **Purpose**: Persistent data storage
- **Features**:
  - ACID compliance for data integrity
  - Scalable storage for voter records
  - Election and candidate information
  - Audit logs and historical data

### 3. Blockchain Layer

#### Smart Contracts
- **Technology**: Solidity on Ethereum-compatible chains
- **Purpose**: Immutable voting record storage
- **Components**:
  - **VotingSystem**: Central coordinator for elections
  - **Election**: Individual election management
  - **Party**: Political party representation
  - **Candidate**: Candidate information storage
  - **Voter**: Voter registration and verification

#### ZK Circuits
- **Technology**: Semaphore protocol
- **Purpose**: Zero-knowledge privacy implementation
- **Features**:
  - Anonymous signaling for voter eligibility
  - Group membership verification
  - Double voting prevention
  - Identity privacy preservation

#### Blockchain
- **Technology**: Polygon/Mumbai testnet
- **Purpose**: Decentralized and immutable record storage
- **Features**:
  - Transaction finality and immutability
  - Public verification of results
  - Decentralized consensus
  - Low-cost transactions

## Data Flow Explanation

### Voter Registration Flow
1. User registers through frontend
2. Backend generates Semaphore identity
3. Identity commitment stored in database
4. Identity commitment added to blockchain group
5. User receives encrypted secret for future voting

### Voting Flow
1. User authenticates through frontend
2. Backend retrieves user's identity secret
3. Backend generates ZK proof of group membership
4. Backend submits vote transaction (pays gas)
5. Blockchain validates ZK proof
6. Vote recorded with privacy guarantees
7. Results available for public verification

### Results Flow
1. Anyone can query election results
2. Frontend requests results from backend
3. Backend fetches from blockchain
4. Results displayed with transparency
5. ZK proofs ensure vote integrity

## Security Architecture

### Privacy Protection
- **ZK Proofs**: Voter anonymity through Semaphore
- **Encrypted Storage**: Identity secrets in database
- **Gas Abstraction**: Hide blockchain complexity
- **Access Controls**: Role-based permissions

### Integrity Assurance
- **Immutable Records**: Blockchain storage
- **Proof Verification**: Mathematical verification
- **Audit Trails**: Complete transaction history
- **Consensus Mechanisms**: Decentralized validation

### Availability
- **Redundancy**: Multiple backend instances
- **Caching**: Performance optimization
- **Load Balancing**: Scalable architecture
- **Failover**: High availability design

## Scalability Considerations

### Horizontal Scaling
- **Microservices**: Independent component scaling
- **Load Balancing**: Distribute frontend requests
- **Database Sharding**: Partition data for performance
- **Caching Layers**: Reduce database load

### Blockchain Optimization
- **Batch Operations**: Reduce transaction count
- **Light Clients**: Minimize blockchain queries
- **Event Indexing**: Efficient data retrieval
- **Off-chain Computation**: Reduce on-chain operations

This architecture provides a balance between usability, privacy, and blockchain benefits while maintaining the scalability needed for real-world voting systems.