#!/bin/bash

# Test script for election and candidate endpoints
# This assumes you have a running backend server

echo "=== Testing Election and Candidate Endpoints ==="

# 1. Test listing elections
echo "1. Testing election listing..."
curl -s -X GET http://localhost:3000/api/elections | jq '.'

# 2. Test getting a specific election (replace with actual election ID)
echo "2. Testing specific election retrieval..."
curl -s -X GET http://localhost:3000/api/elections/election-123 | jq '.'

# 3. Test getting a candidate (replace with actual candidate ID)
echo "3. Testing candidate retrieval..."
curl -s -X GET http://localhost:3000/api/candidates/candidate-123 | jq '.'

# 4. Test voter sign-in with voter code
echo "4. Testing voter sign-in with voter code..."
curl -s -X POST http://localhost:3000/api/auth/sign-in/voters \
  -H "Content-Type: application/json" \
  -d '{
    "voter_code": "VOTER123",
    "election_id": "election-123"
  }' | jq '.'

# 5. Test submitting votes (requires authentication token)
echo "5. Testing vote submission..."
curl -s -X POST http://localhost:3000/api/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -d '{
    "election_id": "election-123",
    "voter_code": "VOTER123",
    "votes": [
      {
        "position_id": "position-123",
        "candidate_id": "candidate-123"
      }
    ]
  }' | jq '.'

# 6. Test getting election results
echo "6. Testing election results retrieval..."
curl -s -X GET http://localhost:3000/api/vote/results/election-123 | jq '.'

echo "=== Test completed ==="