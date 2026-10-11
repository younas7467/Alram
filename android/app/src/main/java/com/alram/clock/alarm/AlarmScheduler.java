package com.alram.clock.alarm;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import com.alram.clock.MainActivity;
import java.util.Calendar;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

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
            if (previous != null) cancel(context, previous.optString("id"), false);
        }

        preferences.edit()
            .putString(ALARMS_KEY, alarms.toString())
            .putBoolean(MONITORING_KEY, monitoring)
            .apply();

        int scheduledCount = 0;
        int requestedCount = 0;
        for (int index = 0; index < alarms.length(); index++) {
            JSONObject alarm = alarms.optJSONObject(index);
            if (alarm == null) continue;
            String id = alarm.optString("id");
            if (id.equals(oldSnoozeId) && alarm.optBoolean("enabled", false)) oldSnoozeStillValid = true;
            if (monitoring && alarm.optBoolean("enabled", false)) {
                requestedCount++;
                if (scheduleNext(context, alarm)) scheduledCount++;
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
        result.put("requestedCount", requestedCount);
        return result;
    }

    static JSONObject getAlarms(Context context) throws JSONException {
        android.content.SharedPreferences preferences = preferences(context);
        JSONObject result = new JSONObject();
        result.put("initialized", preferences.contains(ALARMS_KEY));
        result.put("alarms", new JSONArray(preferences.getString(ALARMS_KEY, "[]")));
        return result;
    }

    static boolean onAlarmFired(Context context, String id) {
        android.content.SharedPreferences preferences = preferences(context);
        try {
            JSONArray alarms = new JSONArray(preferences.getString(ALARMS_KEY, "[]"));
            for (int index = 0; index < alarms.length(); index++) {
                JSONObject alarm = alarms.optJSONObject(index);
                if (alarm == null || !id.equals(alarm.optString("id"))) continue;
                if (!alarm.optBoolean("enabled", false)) return false;
                if ("once".equals(alarm.optString("repeat", "daily"))) {
                    alarm.put("enabled", false);
                    alarms.put(index, alarm);
                    preferences.edit().putString(ALARMS_KEY, alarms.toString()).apply();
                    return true;
                }
                scheduleNext(context, alarm);
                return false;
            }
        } catch (JSONException error) {
            Log.e(TAG, "Could not update the fired alarm.", error);
        }
        return false;
    }

    static void restore(Context context) {
        android.content.SharedPreferences preferences = preferences(context);
        if (!preferences.getBoolean(MONITORING_KEY, true)) return;
        try {
            JSONArray alarms = new JSONArray(preferences.getString(ALARMS_KEY, "[]"));
            for (int index = 0; index < alarms.length(); index++) {
                JSONObject alarm = alarms.optJSONObject(index);
                if (alarm != null && alarm.optBoolean("enabled", false)) scheduleNext(context, alarm);
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

    private static boolean scheduleNext(Context context, JSONObject alarm) {
        String id = alarm.optString("id");
        String time = alarm.optString("time");
        String[] parts = time.split(":");
        if (id.isEmpty() || parts.length != 2) {
            Log.e(TAG, "Skipping alarm with an invalid ID or time: " + id + " " + time);
            return false;
        }

        int hour;
        int minute;
        try {
            hour = Integer.parseInt(parts[0]);
            minute = Integer.parseInt(parts[1]);
        } catch (NumberFormatException error) {
            Log.e(TAG, "Skipping alarm with an invalid time: " + time, error);
            return false;
        }
        if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            Log.e(TAG, "Skipping alarm with an out-of-range time: " + time);
            return false;
        }

        String repeat = alarm.optString("repeat", "daily");
        Calendar now = Calendar.getInstance();
        Calendar next = Calendar.getInstance();
        if ("once".equals(repeat)) {
            String[] dateParts = alarm.optString("date").split("-");
            if (dateParts.length != 3) {
                Log.e(TAG, "Skipping one-time alarm without a valid date: " + id);
                return false;
            }
            try {
                next.set(Integer.parseInt(dateParts[0]), Integer.parseInt(dateParts[1]) - 1,
                    Integer.parseInt(dateParts[2]), hour, minute, 0);
                next.set(Calendar.MILLISECOND, 0);
            } catch (IllegalArgumentException error) {
                Log.e(TAG, "Skipping one-time alarm with an invalid date: " + id, error);
                return false;
            }
            if (next.get(Calendar.YEAR) != Integer.parseInt(dateParts[0])
                || next.get(Calendar.MONTH) != Integer.parseInt(dateParts[1]) - 1
                || next.get(Calendar.DAY_OF_MONTH) != Integer.parseInt(dateParts[2])
                || next.getTimeInMillis() <= now.getTimeInMillis()) {
                return false;
            }
            return scheduleAt(context, id, time, false, next.getTimeInMillis());
        }

        JSONArray weekdays = alarm.optJSONArray("weekdays");
        if ("weekdays".equals(repeat) && (weekdays == null || weekdays.length() == 0)) {
            Log.e(TAG, "Skipping repeating alarm with no selected weekdays: " + id);
            return false;
        }
        for (int offset = 0; offset <= 7; offset++) {
            next.setTimeInMillis(now.getTimeInMillis());
            next.add(Calendar.DAY_OF_YEAR, offset);
            next.set(Calendar.HOUR_OF_DAY, hour);
            next.set(Calendar.MINUTE, minute);
            next.set(Calendar.SECOND, 0);
            next.set(Calendar.MILLISECOND, 0);
            if (next.getTimeInMillis() <= now.getTimeInMillis()) continue;
            if ("weekdays".equals(repeat)) {
                int javascriptDay = (next.get(Calendar.DAY_OF_WEEK) + 6) % 7;
                boolean matches = false;
                for (int index = 0; index < weekdays.length(); index++) {
                    if (weekdays.optInt(index, -1) == javascriptDay) {
                        matches = true;
                        break;
                    }
                }
                if (!matches) continue;
            }
            return scheduleAt(context, id, time, false, next.getTimeInMillis());
        }
        return false;
    }

    static void scheduleSnooze(Context context, String id, String time, int minutes) {
        int safeMinutes = Math.max(1, Math.min(minutes, 60));
        long triggerAt = System.currentTimeMillis() + safeMinutes * 60 * 1000L;
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

    private static boolean scheduleAt(Context context, String id, String time, boolean snooze, long triggerAt) {
        AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (manager == null) {
            Log.e(TAG, "AlarmManager is unavailable.");
            return false;
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
            return true;
        } catch (SecurityException error) {
            Log.w(TAG, "Exact-alarm access changed while scheduling; using an inexact alarm.", error);
            manager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, operation);
            return true;
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
