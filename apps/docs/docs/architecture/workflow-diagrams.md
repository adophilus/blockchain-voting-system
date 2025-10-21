# System Workflow Diagrams

This document presents various workflow diagrams illustrating how the Blockchain Voting System operates with ZK privacy and gasless transactions.

## 1. Data Flow Diagram (DFD)

```mermaid
graph TD
    subgraph "External Entities"
        A[Voters] --> B[Web Application]
        C[Administrators] --> B
        D[Blockchain Network] --> E[Smart Contracts]
    end

    subgraph "System Boundaries"
        B --> F[Authentication Service]
        B --> G[Voting Service]
        B --> H[Election Management Service]
        G --> I[ZK Proof Generator]
        G --> J[Blockchain Relay Service]
        H --> K[Election Registry]
        I --> L[Semaphore Circuit]
        J --> E
        K --> E
        F --> M[User Database]
        G --> N[Vote Database]
        H --> O[Election Database]
    end

    subgraph "Data Stores"
        M --> F
        N --> G
        O --> H
        E --> D
    end

    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e1f5fe
    style D fill:#f1f8e9
    style E fill:#c8e6c9
    style F fill:#fff3e0
    style G fill:#fce4ec
    style H fill:#f3e5f5
    style I fill:#e8f5e8
    style J fill:#e8f5e8
    style K fill:#c8e6c9
    style L fill:#c8e6c9
    style M fill:#ffecb3
    style N fill:#ffecb3
    style O fill:#ffecb3
```

## 2. Use Case Diagram

```mermaid
graph TD
    subgraph "Actors"
        A[Voter]
        B[Administrator]
        C[Blockchain]
    end

    subgraph "Voter Use Cases"
        D[Authenticate]
        E[View Election]
        F[Cast Vote]
        G[View Results]
    end

    subgraph "Administrator Use Cases"
        H[Create Election]
        I[Manage Candidates]
        J[Register Voters]
        K[Start/End Election]
    end

    subgraph "System Use Cases"
        L[Generate ZK Proof]
        M[Submit to Blockchain]
        N[Verify Vote]
        O[Record Vote]
    end

    A --> D
    A --> E
    A --> F
    A --> G
    B --> H
    B --> I
    B --> J
    B --> K
    
    D --> L
    E --> L
    F --> L
    G --> L
    
    L --> M
    M --> N
    N --> O
    O --> C

    style A fill:#e1f5fe
    style B fill:#e1f5fe
    style C fill:#f1f8e9
    style D fill:#f3e5f5
    style E fill:#f3e5f5
    style F fill:#f3e5f5
    style G fill:#f3e5f5
    style H fill:#fff3e0
    style I fill:#fff3e0
    style J fill:#fff3e0
    style K fill:#fff3e0
    style L fill:#e8f5e8
    style M fill:#e8f5e8
    style N fill:#c8e6c9
    style O fill:#c8e6c9
```

## 3. Voting Process Sequence Diagram

```mermaid
sequenceDiagram
    participant V as Voter
    participant W as Web Application
    participant B as Backend Service
    participant Z as ZK Service
    participant R as Relay Service
    participant SC as Smart Contract
    participant BC as Blockchain

    V->>W: Login with email/social
    W->>B: Authenticate user
    B->>W: Return session token
    
    V->>W: Navigate to election
    W->>B: Fetch election details
    B->>SC: Query election data
    SC->>BC: Read from blockchain
    BC->>SC: Return data
    SC->>B: Return election details
    B->>W: Return election data
    W->>V: Display election
    
    V->>W: Submit vote selections
    W->>B: Send vote data
    B->>Z: Generate ZK proof
    Z->>B: Return proof
    B->>R: Submit transaction (pay gas)
    R->>SC: Send transaction
    SC->>BC: Record transaction
    BC->>SC: Confirm transaction
    SC->>R: Return receipt
    R->>B: Return success
    B->>W: Return confirmation
    W->>V: Show vote confirmed
    
    V->>W: View results
    W->>B: Request results
    B->>SC: Query results
    SC->>BC: Read from blockchain
    BC->>SC: Return results
    SC->>B: Return results
    B->>W: Return results
    W->>V: Display results
```

## 4. Voter Registration Process Flow

```mermaid
graph TD
    A[Voter Registration Request] --> B[Validate Registration Data]
    B --> C{Is Data Valid?}
    C -->|No| D[Return Error]
    C -->|Yes| E[Create Voter Record]
    E --> F[Generate Semaphore Identity]
    F --> G[Store Encrypted Private Key]
    G --> H[Register on Blockchain]
    H --> I[Send Confirmation]
    I --> J[Voter Registered]

    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style D fill:#ffcdd2
    style E fill:#e8f5e8
    style F fill:#c8e6c9
    style G fill:#bbdefb
    style H fill:#f1f8e9
    style I fill:#ffecb3
    style J fill:#c8e6c9
```

## 5. Election Creation Process Flow

```mermaid
graph TD
    A[Admin Creates Election] --> B[Validate Election Data]
    B --> C{Is Data Valid?}
    C -->|No| D[Return Error]
    C -->|Yes| E[Create Election Record]
    E --> F[Deploy Election Contract]
    F --> G[Register Contract on Chain]
    G --> H[Store Election Details on IPFS]
    H --> I[Update Election with CID]
    I --> J[Election Created]

    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style D fill:#ffcdd2
    style E fill:#e8f5e8
    style F fill:#c8e6c9
    style G fill:#bbdefb
    style H fill:#f1f8e9
    style I fill:#ffecb3
    style J fill:#c8e6c9
```

## 6. Vote Casting Process with ZK Privacy

```mermaid
graph TD
    A[Voter Submits Vote] --> B[Verify Voter Authentication]
    B --> C[Retrieve Voter Identity Secret]
    C --> D[Generate ZK Proof of Eligibility]
    D --> E{Is Proof Valid?}
    E -->|No| F[Reject Vote]
    E -->|Yes| G[Create Blockchain Transaction]
    G --> H[Submit Transaction via Relay]
    H --> I[Pay Gas Fees]
    I --> J[Record Vote on Blockchain]
    J --> K[Mark Voter as Voted]
    K --> L[Return Success to Voter]

    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#c8e6c9
    style E fill:#fff3e0
    style F fill:#ffcdd2
    style G fill:#bbdefb
    style H fill:#f1f8e9
    style I fill:#ffecb3
    style J fill:#c8e6c9
    style K fill:#e0f2f1
    style L fill:#c8e6c9
```

## Diagram Explanations

### Data Flow Diagram (DFD)
This diagram shows the flow of data between external entities, system processes, and data stores. The key flows include:
- Voter interactions with the web application
- Authentication and session management
- Voting process with ZK proof generation
- Blockchain relay service for gasless transactions
- Data storage in various databases

### Use Case Diagram
This diagram illustrates the various functionalities available to different actors in the system:
- Voters can authenticate, view elections, cast votes, and view results
- Administrators can manage elections, candidates, and voters
- The system internally handles ZK proof generation, blockchain submission, and vote verification

### Voting Process Sequence Diagram
This diagram shows the step-by-step interaction between components during the voting process:
1. Voter authentication via email/social
2. Election viewing with ZK proof generation
3. Vote submission through backend relay
4. Blockchain recording with gas payment
5. Confirmation to voter without blockchain awareness

### Voter Registration Process Flow
This flowchart shows how voters are registered in the system:
1. Registration data validation
2. Semaphore identity generation for privacy
3. Encrypted private key storage
4. Blockchain registration for verification

### Election Creation Process Flow
This flowchart shows how administrators create elections:
1. Election data validation
2. Smart contract deployment
3. Blockchain registration
4. IPFS storage for election details

### Vote Casting Process with ZK Privacy
This flowchart shows how votes are cast with privacy protection:
1. Voter authentication verification
2. ZK proof generation for eligibility
3. Blockchain transaction creation and relay
4. Gas payment by backend
5. Vote recording with privacy guarantees

These diagrams provide a comprehensive view of how the system works with ZK privacy and gasless transactions while hiding blockchain complexity from users.