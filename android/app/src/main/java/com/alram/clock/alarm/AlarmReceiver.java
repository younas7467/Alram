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
        } else {
            if (!AlarmScheduler.preferences(context).getBoolean(AlarmScheduler.MONITORING_KEY, true)) return;
            android.content.SharedPreferences preferences = AlarmScheduler.preferences(context);
            try {
                org.json.JSONArray alarms = new org.json.JSONArray(preferences.getString(AlarmScheduler.ALARMS_KEY, "[]"));
                boolean enabled = false;
                for (int index = 0; index < alarms.length(); index++) {
                    org.json.JSONObject alarm = alarms.optJSONObject(index);
                    if (alarm != null && id.equals(alarm.optString("id"))) {
                        enabled = alarm.optBoolean("enabled", false);
                        break;
                    }
                }
                if (!enabled) return;
                org.json.JSONObject alarm = AlarmScheduler.getAlarm(context, id);
                if (alarm != null) AlarmScheduler.scheduleDaily(context, id, alarm.optString("time"));
            } catch (org.json.JSONException error) {
                Log.e(TAG, "Could not verify the fired alarm.", error);
                return;
            }
        }

        Intent service = new Intent(context, AlarmService.class)
            .putExtra(EXTRA_ALARM_ID, id)
            .putExtra(AlarmService.EXTRA_IS_SNOOZE, isSnooze);
        org.json.JSONObject alarm = AlarmScheduler.getAlarm(context, id);
        service.putExtra(AlarmService.EXTRA_ALARM_TIME, alarm == null ? "" : alarm.optString("time"));
        try {
            ContextCompat.startForegroundService(context, service);
            NativeAlarmPlugin.emitAlarmFired(id, service.getStringExtra(AlarmService.EXTRA_ALARM_TIME), isSnooze);
        } catch (RuntimeException error) {
            Log.e(TAG, "Could not start the alarm playback service.", error);
        }
    }
}
