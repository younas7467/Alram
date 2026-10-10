# Alram

A responsive 24-hour alarm clock built with plain HTML, CSS, and JavaScript.

## Run locally

Open `index.html` in a browser. Alarms are saved in the browser's local storage. In a desktop browser, keep the page open and alarms unpaused; browser and device power settings can affect background operation.

## Package for Android with Capacitor

The Android app uses a small Capacitor 7 native plugin. Android `AlarmManager` schedules alarms independently of WebView timers, while a foreground media service plays the selected system alarm ringtone. Android stores its own schedule and restores daily alarms after device reboot, time changes, and app updates.

Install Node.js, JDK 21, and the Android Studio / Android SDK prerequisites, then run:

```sh
npm install
npm run android:sync
npx cap open android
```

This repository already has an `android/` project; do not run `android:add`. For web changes, run `npm run android:sync` before building. `npm run build` copies the app's HTML, CSS, and JavaScript to Capacitor's `www` directory. The existing GitHub Actions workflow continues to build and upload the debug APK.

### Android alarm access

Tap **Enable alarm permissions** in the app. Android may ask for notification permission, open **Alarms & reminders** settings to allow exact alarms, and (Android 14+) open full-screen notification settings. Granting these settings is required for exact scheduled times and for the alarm screen to appear over the lock screen. If exact-alarm access is denied, Android receives an inexact fallback schedule that can ring late. If notification or full-screen access is denied, the foreground alarm service can still play sound, but lock-screen controls may not appear.

On some devices, disable battery optimization or allow background activity for Alram if the manufacturer restricts alarms. Android force-stop prevents scheduled app work until the app is launched again. Do not infer alarm reliability from an emulator or build: test the built APK on the target physical device.

### Test while the screen is locked

1. Install and open the debug APK; grant the alarm permissions requested above.
2. Add an alarm for about two minutes ahead and leave **Alarms are active** enabled.
3. Press the power button to lock the device. Keep it locked through the alarm time.
4. Verify the system alarm ringtone and alarm screen/notification appear. Test **Snooze 5 min** and **Dismiss** from the lock screen.
5. Repeat after a reboot to check schedule restoration, and check the device's battery/background restrictions if delivery differs.

Background behavior has not been validated on a physical Android device in this development environment.
