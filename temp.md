# React Native Reown Embedded Wallet Template

This is a wallet template which uses Expo, React Native, Monad and Reown AppKit for wallet authentication.

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

> [!NOTE]
> This repo also has a `demo` branch that you can switch to in order to view the demo project.

## Prerequisites

- Node.js
- NPM
- Expo CLI (Install using the following command: `npm i -g expo-cli`)
- Reown Account

For Android:
- [Android Studio](https://developer.android.com/studio) (API version 35 and above)
  - Guide to setup Android Studio for Expo is available [here](https://docs.expo.dev/workflow/android-studio-emulator/)

For iOS:
- [XCode](https://apps.apple.com/in/app/xcode/id497799835?mt=12)
  - Guide to setup iOS Simulator for Expo is available [here](https://docs.expo.dev/workflow/ios-simulator/)


### Setting up the Reown account

#### Create a Reown Project

1. Navigate to [Reown Cloud](https://cloud.reown.com)
2. Sign in or create a new account
3. Click on "Create Project"
4. Give your project a name and description
5. Select "AppKit" as the SDK
6. Configure your project settings:
   - Enable Email authentication
   - Enable Social logins (X, Discord, Apple)
   - Set up your app's metadata

## Get started

> [!NOTE]
> This repo also has a `demo` branch that you can switch to in order to view the demo project.
> ```
> git checkout demo
> ```

### Install dependencies

```bash
npm install
```

### Set up the environment variables

- Create a copy of `.env.example`

```bash
cp .env.example .env
```

- Add the following environment variables to it

```
EXPO_PUBLIC_REOWN_PROJECT_ID=
```

#### `EXPO_PUBLIC_REOWN_PROJECT_ID`

1. Go to [Reown Cloud](https://cloud.reown.com) and sign in or create an account.

2. Create a new project or select an existing one.

3. Copy the Project ID from your project settings.

4. Add this Project ID as the value for `EXPO_PUBLIC_REOWN_PROJECT_ID` in your `.env` file.

### Start the app

The below commands will start the app in Expo Go app on respective devices.

For iOS:

```bash
npm run ios
```

For Android:

```bash
npm run android
```

For native app builds use the following commands:

For iOS:

```bash
npx expo run:ios
```

For Android:

```bash
npx expo run:android
```

## Folder structure of the template

```
react-native-privy-embedded-wallet-template/
  ├── app/                                   # Expo router entrypoint
  │   ├── _layout.tsx                        # Root Layout
  │   └── index.tsx                          # First screen
  ├── assets/
  │   ├── fonts/                             # Custom fonts go here
  │   └── images/ 
  │       ├── adaptive-icon.png
  │       ├── favicon.png
  │       ├── icon.png
  │       ├── monad-logo-inverted.png
  │       └── monad-logo.png
  │   └── readme/                            # images for the readme, you can delete this
  ├── constants/
  │   └── Colors.ts
  ├── app.json                               # App properties
  ├── babel.config.js
  ├── eas.json
  ├── entrypoint.js
  ├── eslint.config.js
  ├── metro.config.js                        # Configuration for Hermes and Polyfills
  ├── package-lock.json
  ├── package.json
  ├── README.md
  ├── tsconfig.json
  ├── types/
  │   └── react-native-qrcode-styled.d.ts
```

## Modifying the app name

<table width="100%">
  <tr>
    <th width="50%">iOS</th>
    <th width="50%">Android</th>
  </tr>
  <tr>
    <td align="center">
      <img src="/assets/readme/icon_ios.png" width="300"/>
    </td>
    <td align="center">
      <img src="/assets/readme/icon_android.png" width="300"/>
    </td>
  </tr>
</table>

Edit the `name` property in the `app.json` file.

```json
{
   "expo": {
      "name": "wallet-app", <--- Edit this
      ...
   }
}  
```

## Modifying the App Icon & Splash Screen

### App Icon

<table width="100%">
  <tr>
    <th width="50%">iOS</th>
    <th width="50%">Android</th>
  </tr>
  <tr>
    <td align="center">
      <img src="/assets/readme/icon_ios.png" width="300"/>
    </td>
    <td align="center">
      <img src="/assets/readme/icon_android.png" width="300"/>
    </td>
  </tr>
</table>

You can edit the app icon by replacing the `assets/images/icon.png` file.

Recommended App Icon size is `1024x1024`.

If you name the icon file something else then edit the `icon` property in `app.json` accordingly.

```json
{
   "expo": {
      "name": "rn-wallet-app",
      ...
      "icon": "./assets/images/icon.png", <--- Change this
      ...
   }
}
```

### Splash Screen

<table width="100%">
  <tr>
    <th width="50%">iOS</th>
    <th width="50%">Android</th>
  </tr>
  <tr>
    <td align="center">
      <img src="/assets/readme/splash_ios.png" width="300"/>
    </td>
    <td align="center">
      <img src="/assets/readme/splash_android.png" width="300"/>
    </td>
  </tr>
</table>

Edit the `splash` object in `app.json` to modify the splash screen.

```json
{
   "expo": {
      "name": "rn-wallet-app",
      ...
      "splash": { <--- Edit this object
         "image": "./assets/images/icon.png",
         "backgroundColor": "#ffffff"
      }
   }  
}
```

## Modifying fonts for the app

## Modifying the deeplinking scheme

Edit the `scheme` property in `app.json` file, for your custom deeplinking scheme.

```json
{
  "expo": {
    ...
    "scheme": "rnwalletapp",
    ...
  }
}
```

For example, if you set this to `rnwalletapp`, then `rnwalletapp://` URLs would open your app when tapped.

This is a build-time configuration, it has no effect in Expo Go.

## Editing the landing screen

<table width="100%">
  <tr>
    <th width="50%">iOS</th>
    <th width="50%">Android</th>
  </tr>
  <tr>
    <td align="center">
      <img src="/assets/readme/landing_screen_ios.png" width="300"/>
    </td>
    <td align="center">
      <img src="/assets/readme/landing_screen_android.png" width="300"/>
    </td>
  </tr>
</table>

You can edit the landing page by editing the code in the file `app/index.tsx`.

## Wallet Actions

The template has example code for the following Wallet Actions:

- [Send USDC](https://github.com/monad-developers/react-native-privy-embedded-wallet-template/blob/main/components/sheets/SendSheet.tsx) 
- [Sign Message](https://github.com/monad-developers/react-native-privy-embedded-wallet-template/blob/main/components/sheets/SignSheet.tsx)


## Modifying the package/bundle identifier

When publishing app to the app store you need to have a unique package/bundle identifier you can change it in in `app.json`.

> [!NOTE]
> Don't forget to update the redirect URL in your Reown project settings

```json
{
  "expo": {
    "name": "rn-wallet-app",
    ...
    "ios": {
      "bundleIdentifier": "com.anonymous.rn-wallet-app", <--- Edit this
      ...
    },
    "android": {
      ...
      "package": "com.anonymous.rnwalletapp" <--- Edit this
    },
  }
}
```

## Check out the demo app

If you want try the demo app before you start developing you can switch to the `demo` branch available with the repo:

```bash
git checkout demo
```

### Folder structure of the demo project (Change to `demo` branch to view this)

```
react-native-privy-embedded-wallet-template/
  ├── app/
  │   ├── _layout.tsx                        # Root layout of the project
  │   ├── +not-found.tsx
  │   ├── demo/                              # This is entrypoint for the Wallet related code.
  │   │   ├── _layout.tsx
  │   │   ├── app/                           # If Authenticated the user can access route /app
  │   │   │   ├── _layout.tsx
  │   │   │   └── index.tsx
  │   │   └── sign-in/                       # Unauthenticated user gets redirected to /sign-in
  │   └── index.tsx                          # This is the landing page
  ├── assets/
  │   ├── fonts/                             # Custom fonts go here
  │   │   └── SF_Pro_Rounded/                # Custom Font example
  │   └── images/
  │       ├── adaptive-icon.png
  │       ├── favicon.png
  │       ├── icon.png
  │       ├── monad-icon.png
  │       ├── monad-logo-inverted.png
  │       ├── monad-logo.png
  │       ├── partial-react-logo.png
  │       └── splash-icon.png
  ├── components/
  │   ├── sheets/                            # All the bottom sheets are here
  │   └── ui/
  ├── config/
  │   ├── reownConfig.ts                     # Reown related config
  │   ├── providers.tsx 
  │   └── wagmiConfig.ts                     # Monad Testnet related config
  ├── constants/
  ├── context/
  │   ├── AuthContext.tsx
  │   └── WalletContext.tsx                  # Wallet actions implementations are here
  ├── hooks/
  ├── screens/
  │   ├── Email/                             # Screen that asks for Email
  │   ├── Home/                              # Wallet Home screen (Authenticated users only)
  │   ├── Landing/                           # Screen with info on how to use the template
  │   └── OTP/                               # Screen that asks for the OTP code sent to email
  ├── types/
  ├── utils.ts
  ├── entrypoint.ts
  ├── app.json
  ├── babel.config.js
  ├── eas.json
  ├── eslint.config.js
  ├── metro.config.js
  ├── package.json
  ├── package-lock.json
  ├── README.md
  ├── tsconfig.json
```

## Learn more

To learn more about developing your project with Expo, Reown, and Monad look at the following resources:

- [Expo documentation](https://docs.expo.dev/)
- [Expo guides](https://docs.expo.dev/guides)
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)
- [Reown AppKit documentation](https://docs.reown.com/appkit/react-native/core/installation)
- [Reown Email & Social authentication](https://docs.reown.com/appkit/react-native/core/email)
- [Reown wagmi integration](https://docs.reown.com/appkit/react-native/core/wagmi)
- [Tooling and infra options on Monad](https://docs.monad.xyz/tooling-and-infra/)

## Join the community

- [Discord community](https://discord.com/invite/monaddev): Chat with fellow Monad developers and ask questions.

Facing issues? report [here](https://github.com/monad-developers/react-native-privy-embedded-wallet-template/issues).