## Overview

A blockchain-based intellectual property rights management system that allows for the creation of digital rights and the transfer of digital rights. This web-app was bootstrapped with [React](https://reactjs.org/) and next.js. The frontend component library is built with [chakra-ui](https://chakra-ui.com/). The backend is built with [Node.js](https://nodejs.org/en/). The off-chain database uses [Web3.storage](https://web3.storage/), a free and simple storage service on a decentralized set of [IPFS](https://ipfs.io/) and [Filecoin](https://filecoin.io/) providers to store the digital assets.

## Getting Started

### 1. Clone the repository and install dependencies

```
git clone https://github.com/COMP6452-IP3/project-2.git
cd next-auth
npm install
```

### 2. Configure your local environment

Copy the `.env.local.example` file into `.env.local` and complete with your local environment variables.

```
cp .env.local.example .env.local
```

#### Database

A database is needed to store the digital assets. In this case, we use [Web3.storage](https://web3.storage/). An account needs to be created on the storage service and your API key needs to be added to the `.env.local` file.

### 4. Start the application

To run your site locally, use:

```
npm run dev
```

To run it in production mode, use:

```
npm run build
npm run start
```

## Tech Stack
Frontend: React, Chakra-UI <br/>
Backend: Node.js, Next.js, Ether.js <br/>
Database: Web3.storage <br/>
Smart Contract: Solidity <br/>
Wallet: Metamask <br/>
Test Network: Ropsten <br/>


