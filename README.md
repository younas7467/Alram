# Alram

A responsive 24-hour alarm clock built with plain HTML, CSS, and JavaScript.

## Run locally

Open `index.html` in a browser. Alarms are saved in the browser's local storage. Keep the page open and alarms unpaused for them to ring; browser and device power settings can affect background operation.

## Package for Android with Capacitor

Install Node.js and the Android Studio / Android SDK prerequisites, then run:

```sh
npm install
npm run android:add
npx cap open android
```

For subsequent web changes, run `npm run android:sync` before building the APK in Android Studio. The build script copies only the app's three web files into Capacitor's `www` directory.
