# Zaplit

Split bills with friends using Bitcoin Lightning ⚡️
Created for a [Bitcoin++](https://btcplusplus.dev/conf/floripa) [hackathon](https://bitcoinplusplus.devpost.com/).

[Check our wireframe](https://excalidraw.com/#json=OG4WlqTDH85UqVXm_gY_f,4FYX8PnZ6JDIUBqmcShEQg)

## Overview

Zaplit is a web application that simplifies group expenses at conferences and events by enabling easy bill splitting with Bitcoin Lightning payments via [Nostr Wallet Connect (NWC)](https://github.com/nostr-protocol/nips/blob/master/47.md).

## Protocol Flow Description

This section describes the basic protocol flow for Zaplit, including event kinds and encryption methods used for secure team communication.

### Events

Each event type has its own specific kind in the Nostr protocol:

```
Event kinds follow NIP-01 conventions:

Addressable Events (30000 <= n < 40000):
- Team Event: 30003
- User Event: 31013

Regular Events (1000 <= n < 10000):
- Bill Event: 3003
- Payment Event: 3113

Payment status and calculations are handled client-side.
```

#### Team Event

```json
{
  "kind": 3003,
  "content": "<encrypted JSON string>",
  "tags": [
    ["d", "zaplit:team:<teamId>"],
    ["L", "zaplit:team"]
    ["l", "<teamId>", "zaplit:team"],
  ]
}
```

#### User Event (Joining a Team)

```json
{
  "kind": 31013,
  "content": "<encrypted NWC connection URL using team secret>",
  "tags": [
    ["e", "<team event id>"],
    ["d", "zaplit:user:<team event id>"]
    ["L", "zaplit:user"]
    ["l", "<team event id>", "zaplit:user"],
  ]
}
```

#### Bill Event

```json
{
  "kind": 3003,
  "content": "<encrypted JSON string of bill data>",
  "tags": [
    ["e", "<team event id>"],
    ["L", "zaplit:bill"]
    ["l", "<team event id>", "zaplit:bill"],
  ]
}
```

#### Payment Event

```json
{
  "kind": 3113,
  "content": "<encrypted JSON string of payment data>",
  "tags": [
    ["e", "<team event id>"],
    ["e", "<bill event id>"],
    ["L", "zaplit:payment"]
    ["l", "<bill event id>", "zaplit:payment"],
  ]
}
```

### Team Creation and Joining Flow

1. Team Creator:

   - Generates a random team secret
   - Creates Team Event (kind: 31001)
   - Generates shareable URL containing: team event id and teamSecret
   - Creates QR code from URL

2. Team Member:
   - Scans QR code or uses URL
   - Decodes teamId and teamSecret
   - Connects their NWC wallet
   - Creates User Event with encrypted NWC URL
   - Can now participate in bill splitting

### Bill Creation Flow

1. Any team member can create a bill:

   - Creates Bill Event with encrypted details
   - Other members are notified via Nostr subscription

2. Payment Flow:
   - System calculates each member's share of the bill
   - Multiple members can pay their portions independently:
     - Each member sees their required share
     - Members use their connected NWC wallet to pay
     - A separate Payment Event is created for each payment
     - Each payment references the original bill via the "e" tag
   - Client-side calculation of bill status:
     - Tracks total amount paid vs bill amount
     - Shows who has paid and who hasn't
     - Displays remaining balance
     - Updates payment status in real-time
   - Members can track payment progress through the UI

## Data Format

All event contents are encrypted stringified JSON objects, allowing for extensibility. Here are the base JSON structures before encryption:

### Team Data

```json
{
  "name": "Team Name",
  "teamId": "<teamId>"
}
```

### Bill Data

```json
{
  "title": "Lunch at Bitcoin Conference",
  "amount": 50000000, // Amount in millisats
  "currency": "USD",
  "fiatAmount": 50.0
}
```

### Payment Data

```json
{
  "amount": 10000000, // Amount in millisats
  "share_index": 1 // Which share of the bill this payment covers (optional)
}
```

The client application maintains the bill's payment status by:

1. Fetching all payment events that reference the bill
2. Summing the total amount paid
3. Calculating remaining balances
4. Tracking individual member contributions

All amounts in the application are handled in millisatoshis (millisats) for maximum precision in calculations.

## Security Considerations

- Team secret is used to encrypt sensitive information in events
- NWC URLs are encrypted in User Events
- Bill amounts and titles are encrypted
- Each team has its own encryption key
- Only team members with the team secret can decrypt information

## Development Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## Technology Stack

- React for frontend
- Nostr for communication layer
- NWC for Lightning payments

## Contributing

This project was created during the Bitcoin++ Beach Edition Hackathon in Florianópolis, Brasil.
