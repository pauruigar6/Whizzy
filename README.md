# Welcome to Whizzy App 👋

**Whizzy** is a collaborative app for managing household tasks, where users can organize by days, complete tasks, and earn points to climb the group ranking. It's built with React Native + Expo to work on Android, iOS, and Web from a single codebase.

## Features
- Shared task organization
- Points system and gamification
- Assignment by day and user
- Cross-platform: Web, Android, iOS
- Built with React Native and Expo

## Get started

1. **Clone the repository**

   ```bash
   git clone https://github.com/pauruigar6/Whizzy.git
   cd Whizzy
   ```
   
2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the app**

   ```bash
    npx expo start
   ```
   
In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Run and Test

- **Android**
```bash
npx expo start --android
```
Use an Android Studio emulator or scan the QR code with the Expo Go app.
- **iOS**
```bash
npx expo start --ios
```
Use an Xcode simulator or scan the QR code with the Expo Go app for iOS.

- **Web**
```bash
npx expo start --web
```
This will open the web version of the app in your browser.

## Build and Download

- **Create build for Android (APK or AAB)**
```bash
npx eas build -p android
```

- **Crear build para iOS**
```bash
npx eas build -p ios
```
Note: iOS builds require an Apple Developer account.

- **Descargar la app**
Download the app After building with EAS Build, Expo will provide a link to download the .apk, .aab, or iOS file. Check the official documentation for more details.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
