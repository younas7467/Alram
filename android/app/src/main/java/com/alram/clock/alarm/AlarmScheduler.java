package com.alram.clock.alarm;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import com.alram.clock.MainActivity;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.Calendar;

final class AlarmScheduler {
    static final String PREFS = "alram_native_alarms";
    static final String ALARMS_KEY = "alarms";
    static final String MONITORING_KEY = "monitoring";
    static final String SNOOZE_AT_KEY = "snooze_at";
    static final String SNOOZE_ID_KEY = "snooze_id";
    static final String SNOOZE_TIME_KEY = "snooze_time";
    static final String ACTIVE_ID_KEY = "active_id";
    static final String ACTIVE_TIME_KEY = "active_time";
    static final String ACTIVE_SNOOZE_KEY = "active_snooze";
    private static final String TAG = "AlramScheduler";

    private AlarmScheduler() {}

    static boolean canScheduleExactAlarms(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return true;
        AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        return manager != null && manager.canScheduleExactAlarms();
    }

    static JSONObject updateAlarms(Context context, JSONArray alarms, boolean monitoring) throws JSONException {
        android.content.SharedPreferences preferences = preferences(context);
        JSONArray oldAlarms;
        try {
            oldAlarms = new JSONArray(preferences.getString(ALARMS_KEY, "[]"));
        } catch (JSONException error) {
            Log.e(TAG, "Saved native alarm list is invalid; replacing it.", error);
            oldAlarms = new JSONArray();
        }

        String oldSnoozeId = preferences.getString(SNOOZE_ID_KEY, null);
        boolean oldSnoozeStillValid = false;
        for (int index = 0; index < oldAlarms.length(); index++) {
            JSONObject previous = oldAlarms.optJSONObject(index);
            if (previous != null) {
                cancel(context, previous.optString("id"), false);
            }
        }

        preferences.edit()
            .putString(ALARMS_KEY, alarms.toString())
            .putBoolean(MONITORING_KEY, monitoring)
            .apply();

        int scheduledCount = 0;
        for (int index = 0; index < alarms.length(); index++) {
            JSONObject alarm = alarms.optJSONObject(index);
            if (alarm == null) continue;
            String id = alarm.optString("id");
            String time = alarm.optString("time");
            boolean enabled = alarm.optBoolean("enabled", false);
            if (id.equals(oldSnoozeId) && enabled) oldSnoozeStillValid = true;
            if (monitoring && enabled) {
                scheduleDaily(context, id, time);
                scheduledCount++;
            } else {
                cancel(context, id, true);
            }
        }

        if (!monitoring || !oldSnoozeStillValid) cancelSnooze(context);
        if (!monitoring) {
            Intent stop = new Intent(context, AlarmService.class).setAction(AlarmService.ACTION_DISMISS);
            context.startService(stop);
        }

        JSONObject result = new JSONObject();
        result.put("exactAlarmAllowed", canScheduleExactAlarms(context));
        result.put("scheduledCount", scheduledCount);
        return result;
    }

    static void restore(Context context) {
        android.content.SharedPreferences preferences = preferences(context);
        if (!preferences.getBoolean(MONITORING_KEY, true)) return;
        try {
            JSONArray alarms = new JSONArray(preferences.getString(ALARMS_KEY, "[]"));
            for (int index = 0; index < alarms.length(); index++) {
                JSONObject alarm = alarms.optJSONObject(index);
                if (alarm != null && alarm.optBoolean("enabled", false)) {
                    scheduleDaily(context, alarm.optString("id"), alarm.optString("time"));
                }
            }
            long snoozeAt = preferences.getLong(SNOOZE_AT_KEY, 0);
            String snoozeId = preferences.getString(SNOOZE_ID_KEY, null);
            String snoozeTime = preferences.getString(SNOOZE_TIME_KEY, null);
            if (snoozeAt > System.currentTimeMillis() && snoozeId != null && snoozeTime != null) {
                scheduleAt(context, snoozeId, snoozeTime, true, snoozeAt);
            } else if (snoozeAt > 0) {
                cancelSnooze(context);
            }
        } catch (JSONException error) {
            Log.e(TAG, "Could not restore saved alarms.", error);
        }
    }

    static JSONObject getAlarm(Context context, String id) {
        try {
            JSONArray alarms = new JSONArray(preferences(context).getString(ALARMS_KEY, "[]"));
            for (int index = 0; index < alarms.length(); index++) {
                JSONObject alarm = alarms.optJSONObject(index);
                if (alarm != null && id.equals(alarm.optString("id"))) return alarm;
            }
        } catch (JSONException error) {
            Log.e(TAG, "Could not read saved alarms.", error);
        }
        return null;
    }

    static void scheduleDaily(Context context, String id, String time) {
        Calendar next = Calendar.getInstance();
        String[] parts = time.split(":");
        if (parts.length != 2) {
            Log.e(TAG, "Skipping invalid alarm time: " + time);
            return;
        }
        try {
            next.set(Calendar.HOUR_OF_DAY, Integer.parseInt(parts[0]));
            next.set(Calendar.MINUTE, Integer.parseInt(parts[1]));
            next.set(Calendar.SECOND, 0);
            next.set(Calendar.MILLISECOND, 0);
        } catch (NumberFormatException error) {
            Log.e(TAG, "Skipping invalid alarm time: " + time, error);
            return;
        }
        if (next.getTimeInMillis() <= System.currentTimeMillis()) next.add(Calendar.DAY_OF_YEAR, 1);
        scheduleAt(context, id, time, false, next.getTimeInMillis());
    }

    static void scheduleSnooze(Context context, String id, String time) {
        long triggerAt = System.currentTimeMillis() + 5 * 60 * 1000L;
        preferences(context).edit()
            .putString(SNOOZE_ID_KEY, id)
            .putString(SNOOZE_TIME_KEY, time)
            .putLong(SNOOZE_AT_KEY, triggerAt)
            .apply();
        scheduleAt(context, id, time, true, triggerAt);
    }

    static void clearSnooze(Context context) {
        cancelSnooze(context);
    }

    private static void scheduleAt(Context context, String id, String time, boolean snooze, long triggerAt) {
        AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (manager == null) {
            Log.e(TAG, "AlarmManager is unavailable.");
            return;
        }
        PendingIntent operation = pendingIntent(context, id, snooze);
        try {
            if (canScheduleExactAlarms(context)) {
                if (snooze) {
                    manager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, operation);
                } else {
                    Intent showIntent = new Intent(context, MainActivity.class)
                        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    PendingIntent show = PendingIntent.getActivity(
                        context, 0, showIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                    );
                    manager.setAlarmClock(new AlarmManager.AlarmClockInfo(triggerAt, show), operation);
                }
            } else {
                manager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, operation);
            }
        } catch (SecurityException error) {
            Log.w(TAG, "Exact-alarm access changed while scheduling; using an inexact alarm.", error);
            manager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, operation);
        }
    }

    private static void cancel(Context context, String id, boolean includeSnooze) {
        if (id == null || id.isEmpty()) return;
        AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (manager == null) return;
        manager.cancel(pendingIntent(context, id, false));
        if (includeSnooze) manager.cancel(pendingIntent(context, id, true));
    }

    private static void cancelSnooze(Context context) {
        android.content.SharedPreferences preferences = preferences(context);
        String id = preferences.getString(SNOOZE_ID_KEY, null);
        if (id != null) cancel(context, id, true);
        preferences.edit().remove(SNOOZE_ID_KEY).remove(SNOOZE_TIME_KEY).remove(SNOOZE_AT_KEY).apply();
    }

    private static PendingIntent pendingIntent(Context context, String id, boolean snooze) {
        Intent intent = new Intent(context, AlarmReceiver.class)
            .setAction(AlarmReceiver.ACTION_FIRE)
            .setData(Uri.parse("alram://alarm/" + Uri.encode(id) + (snooze ? "/snooze" : "/daily")))
            .putExtra(AlarmReceiver.EXTRA_ALARM_ID, id)
            .putExtra(AlarmReceiver.EXTRA_IS_SNOOZE, snooze);
        return PendingIntent.getBroadcast(
            context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
    }

    static android.content.SharedPreferences preferences(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }
}
