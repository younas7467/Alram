package com.alram.clock.alarm;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import androidx.core.content.ContextCompat;

public final class AlarmReceiver extends BroadcastReceiver {
    static final String ACTION_FIRE = "com.alram.clock.alarm.FIRE";
    static final String EXTRA_ALARM_ID = "alarm_id";
    static final String EXTRA_IS_SNOOZE = "is_snooze";
    private static final String TAG = "AlramAlarmReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (!ACTION_FIRE.equals(intent.getAction())) return;
        String id = intent.getStringExtra(EXTRA_ALARM_ID);
        boolean isSnooze = intent.getBooleanExtra(EXTRA_IS_SNOOZE, false);
        if (id == null) {
            Log.e(TAG, "Alarm fired without an alarm ID.");
            return;
        }

        if (isSnooze) {
            AlarmScheduler.clearSnooze(context);
        }

        org.json.JSONObject alarm = AlarmScheduler.getAlarm(context, id);
        boolean oneTimeFinished = false;
        if (!isSnooze) {
            if (!AlarmScheduler.preferences(context).getBoolean(AlarmScheduler.MONITORING_KEY, true)) return;
            if (alarm == null || !alarm.optBoolean("enabled", false)) return;
            oneTimeFinished = AlarmScheduler.onAlarmFired(context, id);
        }

        Intent service = new Intent(context, AlarmService.class)
            .putExtra(EXTRA_ALARM_ID, id)
            .putExtra(AlarmService.EXTRA_IS_SNOOZE, isSnooze);
        service.putExtra(AlarmService.EXTRA_ALARM_TIME, alarm == null ? "" : alarm.optString("time"));
        try {
            ContextCompat.startForegroundService(context, service);
            NativeAlarmPlugin.emitAlarmFired(id, alarm, isSnooze, oneTimeFinished);
        } catch (RuntimeException error) {
            Log.e(TAG, "Could not start the alarm playback service.", error);
        }
    }
}
