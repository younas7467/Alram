package com.alram.clock.alarm;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;
import android.content.pm.ServiceInfo;
import androidx.core.app.NotificationCompat;
import androidx.core.app.ServiceCompat;

public final class AlarmService extends Service {
    static final String ACTION_SNOOZE = "com.alram.clock.alarm.SNOOZE";
    static final String ACTION_DISMISS = "com.alram.clock.alarm.DISMISS";
    static final String EXTRA_IS_SNOOZE = "is_snooze";
    static final String EXTRA_ALARM_TIME = "alarm_time";
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
            if (id != null) AlarmScheduler.scheduleSnooze(this, id, time);
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
        startAlarmSound();
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
        Intent screen = new Intent(this, AlarmActivity.class)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP)
            .putExtra(AlarmReceiver.EXTRA_ALARM_ID, id)
            .putExtra(EXTRA_ALARM_TIME, time);
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
        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("Alram")
            .setContentText("Alarm · " + time)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setOngoing(true)
            .setAutoCancel(false)
            .setFullScreenIntent(fullScreen, true)
            .addAction(android.R.drawable.ic_media_pause, "Snooze 5 min", snooze)
            .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Dismiss", dismiss)
            .build();
    }

    private void startAlarmSound() {
        stopAlarmSound();
        Uri tone = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
        if (tone == null) tone = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        if (tone == null) {
            Log.e(TAG, "No default alarm or notification ringtone is available.");
            return;
        }
        try {
            player = new MediaPlayer();
            player.setWakeMode(this, PowerManager.PARTIAL_WAKE_LOCK);
            player.setAudioAttributes(new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build());
            player.setDataSource(this, tone);
            player.setLooping(true);
            player.setOnErrorListener((mediaPlayer, what, extra) -> {
                Log.e(TAG, "Alarm ringtone playback failed (what=" + what + ", extra=" + extra + ").");
                return false;
            });
            player.prepare();
            player.start();
        } catch (Exception error) {
            Log.e(TAG, "Could not play the system alarm ringtone.", error);
            stopAlarmSound();
        }
    }

    private void stopAlarmSound() {
        if (player == null) return;
        try {
            if (player.isPlaying()) player.stop();
        } catch (IllegalStateException error) {
            Log.w(TAG, "Alarm player was already stopped.", error);
        } finally {
            player.release();
            player = null;
        }
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
        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID, "Alarms", NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription("Scheduled Alram clock alarms");
        channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        channel.setSound(null, null);
        channel.enableVibration(false);
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager != null) manager.createNotificationChannel(channel);
    }
}
