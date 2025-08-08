# Monad Expo Thirdweb Example

This is a Web3 wallet template which uses Expo, React Native, Monad blockchain, and thirdweb SDK for blockchain application development.

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

### Features

- In-app wallet using email authentication
- Wallet balance display and refresh
- MON token transfers on Monad testnet
- Account management with disconnect functionality
- Transaction history with blockchain explorer links
- Input validation for addresses and amounts

## Prerequisites

- Node.js
- Yarn or NPM
- thirdweb Account

For Android:
- **JDK 17** (Java Development Kit version 17)
  - Set the `JAVA_HOME` environment variable to point to your JDK 17 installation
  - Example: `export JAVA_HOME=/Library/Java/JavaVirtualMachines/microsoft-17.jdk/Contents/Home`
- [Android Studio](https://developer.android.com/studio) (API version 35 and above)
  - Guide to setup Android Studio for Expo is available [here](https://docs.expo.dev/workflow/android-studio-emulator/)
  - Configure Gradle JDK in Android Studio:
    1. Open Android Studio Settings/Preferences
    2. Navigate to Build, Execution, Deployment → Build Tools → Gradle
    3. Set Gradle JDK to JDK 17 (e.g., `JAVA_HOME 17.0.13 - aarch64 /Library/Java/JavaVirtualMachines/microsoft-17.jdk/Contents/Home`)

For iOS:
- [Xcode](https://apps.apple.com/in/app/xcode/id497799835?mt=12) (Xcode 16 requires OpenSSL version 3.3.2000)
  - Guide to setup iOS Simulator for Expo is available [here](https://docs.expo.dev/workflow/ios-simulator/)

## Get started

### Install dependencies

```bash
yarn install
```

### Set up the environment variables

Create a copy of `.env.example`:

```bash
cp .env.example .env
```

### Getting your thirdweb Client ID

1. Go to [thirdweb Dashboard](https://thirdweb.com/dashboard) and sign in or create an account
2. Create a new project or select an existing one
3. Copy the Client ID from your project settings
4. Add this Client ID as the value for `EXPO_PUBLIC_THIRDWEB_CLIENT_ID` in your `.env` file:

```
EXPO_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
```

### Prebuild for native modules

> [!IMPORTANT]  
> The thirdweb SDK uses native modules, which means it cannot run on Expo Go. You must build the iOS and Android apps to link the native modules.

```bash
npx expo prebuild
```

For iOS:
```bash
yarn ios
```

For Android:
```bash
yarn android
```

To run this app, you'll need either:
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

## Folder Structure

```
expo-thirdweb-example/
  ├── app/                                   # Expo router entrypoint 
  │   ├── +html.tsx                          # Web HTML configuration
  │   ├── +native-intent.tsx                 # Deep link handling
  │   ├── +not-found.tsx                     # 404 page
  │   ├── _layout.tsx                        # Root layout with ThirdwebProvider
  │   └── index.tsx                          # Main screen
  ├── assets/
  │   ├── fonts/                             # Custom fonts
  │   └── images/                            # App images and icons
  │       ├── adaptive-icon.png
  │       ├── icon.png
  │       ├── monad-logo.png
  │       └── splash.png
  ├── components/                            # Reusable UI components
  │   ├── ThemedButton.tsx                   # Themed button component
  │   ├── ThemedText.tsx                     # Themed text component
  │   ├── ThemedView.tsx                     # Themed view component
  │   ├── SocialProfileCard.tsx              # Social profile display
  │   └── navigation/
  │       └── TabBarIcon.tsx                 # Tab bar icons
  ├── constants/
  │   ├── Colors.ts                          # App color scheme
  │   └── thirdweb.ts                        # Blockchain configuration
  ├── hooks/                                 # Custom React hooks
  │   ├── useColorScheme.ts                  # Theme detection
  │   └── useThemeColor.ts                   # Theme color utilities
  ├── app.json                               # Expo app configuration
  ├── babel.config.js
  ├── metro.config.js                        # Metro bundler config
  ├── package.json
  ├── tsconfig.json
  └── yarn.lock
```

## Troubleshooting

### OpenSSL Error on Xcode 16

If using xcode 16, you may encounter a OpenSSL error when trying to build the app. This is because xcode 16 requires a newer version of OpenSSL than the one specified in the current app.json.

To fix this, change the version of OpenSSL specified in the `app.json` file to `3.3.2000`.

- Open the `app.json` file
- Find the `ios` > `extraPods` section
- Set `"version": "3.3.2000"` for the `OpenSSL-Universal` pod
- Save the file

Then run `npx expo prebuild` to update the native modules with the new OpenSSL version and run the app again.

## Customizing Your App

### Modifying the App Name

Edit the `name` property in the `app.json` file:

```json
{
   "expo": {
      "name": "your-app-name", // ← Edit this
      ...
   }
}  
```

### Modifying the App Icon

You can edit the app icon by replacing the `assets/images/icon.png` file.

Recommended App Icon size is `1024x1024`.

If you name the icon file something else, edit the `icon` property in `app.json` accordingly:

```json
{
   "expo": {
      "name": "your-app-name",
      ...
      "icon": "./assets/images/icon.png", // ← Change this
      ...
   }
}
```

### Modifying the Splash Screen

Edit the `splash` object in `app.json` to modify the splash screen:

```json
{
   "expo": {
      "name": "your-app-name",
      ...
      "splash": { // ← Edit this object
         "image": "./assets/images/splash.png",
         "backgroundColor": "#ffffff"
      }
   }  
}
```

### Modifying the Deep Linking Scheme

Edit the `scheme` property in `app.json` file for your custom deep linking scheme:

```json
{
  "expo": {
    ...
    "scheme": "your-app-scheme",
    ...
  }
}
```

For example, if you set this to `mywalletapp`, then `mywalletapp://` URLs would open your app when tapped.

This is a build-time configuration and has no effect in Expo Go.

### Modifying the Package/Bundle Identifier

When publishing to the app store, you need a unique package/bundle identifier. Change it in `app.json`:

```json
{
  "expo": {
    "name": "your-app-name",
    ...
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp", // ← Edit this
      ...
    },
    "android": {
      ...
      "package": "com.yourcompany.yourapp" // ← Edit this
    },
  }
}
```

> [!IMPORTANT]
> **thirdweb Bundle ID Configuration**: Your `bundleIdentifier` and `package` must match the Bundle ID Restrictions configured in your thirdweb project settings. 
> 
> 1. Go to [thirdweb Dashboard](https://thirdweb.com/dashboard)
> 2. Select your project
> 3. Navigate to Settings → Bundle ID Restrictions
> 4. Add your iOS `bundleIdentifier` and Android `package` to the allowed bundle IDs
> 
> This ensures your app can properly authenticate with thirdweb services.

## Learn More

To learn more about developing your project with Expo, thirdweb, and Monad look at the following resources:

- Expo: [documentation](https://docs.expo.dev/) | [guides](https://docs.expo.dev/guides) | [learn](https://docs.expo.dev/tutorial/introduction/)
- Thirdweb: [documentation](https://portal.thirdweb.com/typescript/v5) | [templates](https://thirdweb.com/templates) | [YouTube](https://www.youtube.com/c/thirdweb)
- Monad: [docs](https://docs.monad.xyz/) | [tooling and infra](https://docs.monad.xyz/tooling-and-infra/)

## Join the Community

- [Monad Discord](https://discord.com/invite/monaddev): Chat with fellow Monad developers and ask questions
- [thirdweb Discord](https://discord.com/invite/thirdweb): Get help with thirdweb-related questions

## Support

For help or feedback:
- thirdweb: [support site](https://thirdweb.com/support)
- Monad: [report issues on GitHub](https://github.com/monad-xyz) or join the Discord community
