# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo React Native starter template for building Web3/blockchain applications using the thirdweb SDK. The app demonstrates wallet connections, smart contract interactions, and cryptocurrency purchases.

## Essential Commands

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Run on iOS (requires prebuild)
npx expo prebuild
yarn ios

# Run on Android (requires prebuild)
npx expo prebuild
yarn android

# Run tests
yarn test

# Lint code
yarn lint

# Reset project to minimal starter
yarn reset-project
```

## Important Setup Requirements

1. **Environment Variables**: Copy `.env.example` to `.env` and add your thirdweb client ID
2. **Native Modules**: This app requires native builds - cannot run on Expo GO
3. **Xcode 16**: Update OpenSSL version to `3.3.2000` in `app.json` under `ios.extraPods`

## Architecture Overview

### Navigation Structure
The app uses Expo Router (file-based routing) with a tab-based layout:
- `/app/(tabs)/connect.tsx` - Wallet connection examples
- `/app/(tabs)/read.tsx` - Reading blockchain data
- `/app/(tabs)/write.tsx` - Writing to smart contracts
- `/app/(tabs)/buy.tsx` - Cryptocurrency purchasing

### Key Integration Points

1. **ThirdwebProvider Configuration** (`/app/_layout.tsx`):
   - Wraps the entire app
   - Configures supported chains (Base, Base Sepolia, Ethereum)
   - Sets up wallet connection options

2. **Smart Contract Integration** (`/constants/thirdweb.ts`):
   - Defines contract addresses and ABIs
   - Exports pre-configured contract instances
   - Manages chain-specific configurations

3. **Wallet Connections**:
   - In-app wallets: Email, phone, social logins (Google, Apple, Facebook)
   - External wallets: MetaMask, Coinbase, WalletConnect
   - Smart accounts with gas sponsorship support
   - Passkey authentication

### Component Structure
- `/components/` - Reusable UI components following themed pattern (ThemedButton, ThemedText, etc.)
- Components use the color scheme hook for automatic light/dark mode support
- All themed components accept standard React Native props plus theme variations

### Testing Approach
- Jest with `jest-expo` preset
- Test files should be placed alongside components with `.test.tsx` extension
- Run specific tests: `yarn test -- --testPathPattern=<pattern>`

## Development Guidelines

1. **Blockchain Interactions**: Always use the thirdweb SDK hooks and components
2. **Styling**: Use themed components and constants from `/constants/Colors.ts`
3. **Navigation**: Add new screens under `/app/` following Expo Router conventions
4. **Environment**: Never commit `.env` file - use `.env.example` as reference