package com.alram.clock.alarm;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Log;
import android.content.pm.ServiceInfo;
import androidx.core.app.NotificationCompat;
import androidx.core.app.ServiceCompat;

public final class AlarmService extends Service {
    static final String ACTION_SNOOZE = "com.alram.clock.alarm.SNOOZE";
    static final String ACTION_DISMISS = "com.alram.clock.alarm.DISMISS";
    static final String EXTRA_IS_SNOOZE = "is_snooze";
    static final String EXTRA_ALARM_TIME = "alarm_time";
    static final String EXTRA_SNOOZE_MINUTES = "snooze_minutes";
    private static final String CHANNEL_ID = "alram_alarm";
    private static final int NOTIFICATION_ID = 7104;
    private static final String TAG = "AlramAlarmService";

    private MediaPlayer player;

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            stopSelf(startId);
            return START_NOT_STICKY;
        }
        String action = intent.getAction();
        if (ACTION_DISMISS.equals(action)) {
            finishAlarm("dismissed");
            stopSelf(startId);
            return START_NOT_STICKY;
        }
        if (ACTION_SNOOZE.equals(action)) {
            String id = AlarmScheduler.preferences(this).getString(AlarmScheduler.ACTIVE_ID_KEY, null);
            String time = AlarmScheduler.preferences(this).getString(AlarmScheduler.ACTIVE_TIME_KEY, "");
            org.json.JSONObject alarm = id == null ? null : AlarmScheduler.getAlarm(this, id);
            int minutes = intent.hasExtra(EXTRA_SNOOZE_MINUTES)
                ? intent.getIntExtra(EXTRA_SNOOZE_MINUTES, 5)
                : alarm == null ? 5 : alarm.optInt("snoozeMinutes", 5);
            if (id != null) AlarmScheduler.scheduleSnooze(this, id, time, minutes);
            finishAlarm("snoozed");
            stopSelf(startId);
            return START_NOT_STICKY;
        }

        String id = intent.getStringExtra(AlarmReceiver.EXTRA_ALARM_ID);
        String time = intent.getStringExtra(EXTRA_ALARM_TIME);
        boolean isSnooze = intent.getBooleanExtra(EXTRA_IS_SNOOZE, false);
        if (id == null || time == null) {
            Log.e(TAG, "Alarm playback started without an ID or time.");
            stopSelf(startId);
            return START_NOT_STICKY;
        }
        AlarmScheduler.preferences(this).edit()
            .putString(AlarmScheduler.ACTIVE_ID_KEY, id)
            .putString(AlarmScheduler.ACTIVE_TIME_KEY, time)
            .putBoolean(AlarmScheduler.ACTIVE_SNOOZE_KEY, isSnooze)
            .apply();

        Notification notification = buildNotification(id, time);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ServiceCompat.startForeground(
                this, NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
            );
        } else {
            startForeground(NOTIFICATION_ID, notification);
        }
        org.json.JSONObject alarm = AlarmScheduler.getAlarm(this, id);
        startAlarmSound(alarm);
        if (alarm != null && alarm.optBoolean("vibrate", true)) startVibration();
        return START_NOT_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        stopAlarmSound();
        super.onDestroy();
    }

    private Notification buildNotification(String id, String time) {
        org.json.JSONObject alarm = AlarmScheduler.getAlarm(this, id);
        String language = alarm == null ? "en" : alarm.optString("language", "en");
        String displayTime = alarm == null ? time : alarm.optString("displayTime", time);
        String label = alarm == null ? "" : alarm.optString("label", "");
        Intent screen = new Intent(this, AlarmActivity.class)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP)
            .putExtra(AlarmReceiver.EXTRA_ALARM_ID, id)
            .putExtra(EXTRA_ALARM_TIME, displayTime)
            .putExtra("alarm_label", label)
            .putExtra("alarm_language", language)
            .putExtra(EXTRA_SNOOZE_MINUTES, alarm == null ? 5 : alarm.optInt("snoozeMinutes", 5));
        PendingIntent fullScreen = PendingIntent.getActivity(
            this, 0, screen, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        PendingIntent snooze = PendingIntent.getService(
            this, 1, new Intent(this, AlarmService.class).setAction(ACTION_SNOOZE),
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        PendingIntent dismiss = PendingIntent.getService(
            this, 2, new Intent(this, AlarmService.class).setAction(ACTION_DISMISS),
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        String title = label.isEmpty() ? AlarmText.get(language, "appName") : label;
        int snoozeMinutes = alarm == null ? 5 : alarm.optInt("snoozeMinutes", 5);
        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle(title)
            .setContentText(AlarmText.get(language, "notificationBody", displayTime))
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setOngoing(true)
            .setAutoCancel(false)
            .setFullScreenIntent(fullScreen, true)
            .addAction(android.R.drawable.ic_media_pause, AlarmText.get(language, "snooze", snoozeMinutes), snooze)
            .addAction(android.R.drawable.ic_menu_close_clear_cancel, AlarmText.get(language, "dismiss"), dismiss)
            .build();
    }

    private void startAlarmSound(org.json.JSONObject alarm) {
        stopAlarmSound();
        String selected = alarm == null ? "" : alarm.optString("ringtoneUri", "");
        Uri tone = selected.isEmpty() ? null : Uri.parse(selected);
        float volume = (alarm == null ? 100 : alarm.optInt("volume", 100)) / 100f;
        if (tone != null && playTone(tone, volume)) return;

        if (tone != null) Log.e(TAG, "Selected alarm sound is unavailable; trying the system alarm sound.");
        tone = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
        if (tone == null) tone = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        if (tone == null) {
            Log.e(TAG, "No default alarm or notification ringtone is available.");
            return;
        }
        if (!playTone(tone, volume)) Log.e(TAG, "Could not play the default alarm ringtone.");
    }

    private boolean playTone(Uri tone, float volume) {
        try {
            player = new MediaPlayer();
            player.setWakeMode(this, PowerManager.PARTIAL_WAKE_LOCK);
            player.setAudioAttributes(new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build());
            player.setAudioStreamType(AudioManager.STREAM_ALARM);
            player.setVolume(volume, volume);
            player.setDataSource(this, tone);
            player.setLooping(true);
            player.setOnErrorListener((mediaPlayer, what, extra) -> {
                Log.e(TAG, "Alarm ringtone playback failed (what=" + what + ", extra=" + extra + ").");
                return false;
            });
            player.prepare();
            player.start();
            return true;
        } catch (Exception error) {
            Log.e(TAG, "Could not play alarm ringtone: " + tone, error);
            stopAlarmSound();
            return false;
        }
    }

    private void startVibration() {
        Vibrator vibrator = getSystemService(Vibrator.class);
        if (vibrator == null || !vibrator.hasVibrator()) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createWaveform(new long[] { 0, 450, 250, 450 }, 0));
        } else {
            vibrator.vibrate(new long[] { 0, 450, 250, 450 }, 0);
        }
    }

    private void stopAlarmSound() {
        if (player != null) {
            try {
                if (player.isPlaying()) player.stop();
            } catch (IllegalStateException error) {
                Log.w(TAG, "Alarm player was already stopped.", error);
            } finally {
                player.release();
                player = null;
            }
        }
        Vibrator vibrator = getSystemService(Vibrator.class);
        if (vibrator != null) vibrator.cancel();
    }

    private void finishAlarm(String result) {
        stopAlarmSound();
        AlarmScheduler.preferences(this).edit()
            .remove(AlarmScheduler.ACTIVE_ID_KEY)
            .remove(AlarmScheduler.ACTIVE_TIME_KEY)
            .remove(AlarmScheduler.ACTIVE_SNOOZE_KEY)
            .apply();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            stopForeground(STOP_FOREGROUND_REMOVE);
        } else {
            stopForeground(true);
        }
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager != null) manager.cancel(NOTIFICATION_ID);
        NativeAlarmPlugin.emitAlarmEnded(result);
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        String language = "en";
        try {
            org.json.JSONArray alarms = new org.json.JSONArray(
                AlarmScheduler.preferences(this).getString(AlarmScheduler.ALARMS_KEY, "[]")
            );
            if (alarms.length() > 0 && alarms.optJSONObject(0) != null) {
                language = alarms.optJSONObject(0).optString("language", "en");
            }
        } catch (org.json.JSONException error) {
            Log.e(TAG, "Could not read alarm language for the notification channel.", error);
        }
        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID, AlarmText.get(language, "channelName"), NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription(AlarmText.get(language, "channelDescription"));
        channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        channel.setSound(null, null);
        channel.enableVibration(false);
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager != null) manager.createNotificationChannel(channel);
    }
}
