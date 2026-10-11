# Dabbagh Alram

A mobile-first alarm clock and estimated Hijri calendar built with plain HTML, CSS, and JavaScript, packaged with Capacitor 7. The interface includes English, Urdu, Arabic, and Hindi translations, with right-to-left layout for Urdu and Arabic. Language and system/light/dark theme preferences persist on the device.

## Build the web app

```sh
npm ci
npm run build
```

The build copies `index.html`, `style.css`, and `script.js` into Capacitor's `www/` directory.

## Build the Android APK

Install Node.js 22, JDK 21, and Android SDK Platform 35 / Android Gradle Plugin prerequisites, then run:

```sh
npm ci
npm run android:sync
cd android
chmod +x gradlew
./gradlew assembleDebug
```

The debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`. The project uses Capacitor 7 and its existing native `AlarmManager`, receiver, and foreground media service; no second alarm scheduler is used.

## Alarm behavior and permissions

Alarms support one-time dates, daily repeats, and selected weekdays. Each alarm stores its label, system alarm ringtone selection, player volume, vibration preference, and snooze duration. On Android, choose sounds through the system alarm sound picker; it provides its own preview. If a selected sound later becomes unavailable, the service logs the problem and attempts the system default alarm sound.

Use **Enable alarm permissions** in Settings to request notification access, exact-alarm access where applicable, and full-screen intent access on supported Android versions. Alarm creation, enable/disable, and deletion are sent to the native plugin's `setAlarms` method, which updates the complete saved alarm list; the UI checks its scheduled-alarm count before confirming a change. A failed or partial schedule is reported rather than presented as a successful Android schedule. If exact-alarm access is unavailable, the scheduler falls back to an inexact alarm. Android battery management and manufacturer-specific background restrictions may still affect delivery. The app does not request battery-optimization exemption. Force-stopping the app prevents Android from starting its scheduled work until the app is opened again.

## Hijri calendar

The calendar formats dates using the browser's Umm al-Qura Islamic calendar data where available, with an Islamic-calendar fallback. Its listed observances are informational; actual dates may differ by region and moon sighting. The Settings adjustment shifts the displayed date by up to two days. Prayer times are intentionally not shown because this app does not include a verified prayer-time calculation method or location workflow.

## Test on a physical Android device

The app's use of native Android alarms is not a guarantee of delivery on every device. Before relying on it, install the APK, grant the available permissions, schedule an alarm a few minutes ahead, lock the screen, and verify ringing, vibration, sound, snooze, and dismiss. Repeat after reboot and review the device's battery/background settings. These behaviors have not been verified on a physical device as part of this change.

When using the plain browser build, alarm timing and audio depend on the page remaining open and the browser/device allowing its timers and audio to run; use the Android app for native scheduled alarms.
