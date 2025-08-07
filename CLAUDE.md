# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo React Native starter template for building Web3/blockchain applications using the thirdweb SDK. The app demonstrates wallet connections and cryptocurrency transfers on the Monad blockchain.

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
The app uses Expo Router (file-based routing) with a single main screen:
- `/app/(tabs)/index.tsx` - Main transfer screen with wallet connection and MON token transfers

### Key Integration Points

1. **ThirdwebProvider Configuration** (`/app/_layout.tsx`):
   - Wraps the entire app with ThirdwebProvider
   - Validates required environment variables before initialization
   - Handles client configuration loading

2. **Thirdweb Client Configuration** (`/constants/thirdweb.ts`):
   - Creates and manages thirdweb client instance
   - Configures Monad testnet chain
   - Handles environment variable validation for client ID

3. **Wallet Connections**:
   - In-app wallet with email authentication
   - Wallet balance display
   - Account management with disconnect functionality

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