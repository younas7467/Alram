package com.alram.clock.alarm;

import android.Manifest;
import android.app.Activity;
import android.app.AlarmManager;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.ActivityNotFoundException;
import android.media.AudioAttributes;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import androidx.activity.result.ActivityResult;
import androidx.core.app.NotificationManagerCompat;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import com.getcapacitor.PluginMethod;
import java.util.Locale;
import org.json.JSONException;

@CapacitorPlugin(
    name = "NativeAlarm",
    permissions = {
        @Permission(alias = "notifications", strings = { Manifest.permission.POST_NOTIFICATIONS })
    }
)
public final class NativeAlarmPlugin extends Plugin {
    private static volatile NativeAlarmPlugin instance;
    private Ringtone previewRingtone;

    @Override
    public void load() {
        instance = this;
        emitSavedActiveAlarm();
    }

    @Override
    protected void handleOnStop() {
        stopPreview();
    }

    @Override
    protected void handleOnDestroy() {
        stopPreview();
        if (instance == this) instance = null;
    }

    @PluginMethod
    public void setAlarms(PluginCall call) {
        JSArray alarms = call.getArray("alarms");
        if (alarms == null) {
            call.reject("The alarm list is required.");
            return;
        }
        try {
            JSObject result = JSObject.fromJSONObject(
                AlarmScheduler.updateAlarms(getContext(), alarms, call.getBoolean("monitoring", true))
            );
            call.resolve(result);
        } catch (JSONException | SecurityException error) {
            call.reject("Could not schedule native alarms: " + error.getMessage(), error);
        }
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        call.resolve(status());
    }

    @PluginMethod
    public void getAlarms(PluginCall call) {
        try {
            call.resolve(JSObject.fromJSONObject(AlarmScheduler.getAlarms(getContext())));
        } catch (JSONException error) {
            call.reject("Could not read saved alarms.", error);
        }
    }

    @PluginMethod
    public void getActiveAlarm(PluginCall call) {
        call.resolve(activeAlarm());
    }

    @PluginMethod
    public void pickRingtone(PluginCall call) {
        Intent intent = new Intent(RingtoneManager.ACTION_RINGTONE_PICKER);
        intent.putExtra(RingtoneManager.EXTRA_RINGTONE_TYPE, RingtoneManager.TYPE_ALARM);
        intent.putExtra(RingtoneManager.EXTRA_RINGTONE_SHOW_DEFAULT, true);
        intent.putExtra(RingtoneManager.EXTRA_RINGTONE_SHOW_SILENT, false);
        intent.putExtra(
            RingtoneManager.EXTRA_RINGTONE_DEFAULT_URI,
            RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
        );
        String existingUri = call.getString("uri");
        if (existingUri != null && !existingUri.isEmpty()) {
            intent.putExtra(RingtoneManager.EXTRA_RINGTONE_EXISTING_URI, Uri.parse(existingUri));
        }
        try {
            startActivityForResult(call, intent, "ringtonePickerResult");
        } catch (ActivityNotFoundException error) {
            call.reject("No Android alarm sound picker is available.", error);
        }
    }

    @ActivityCallback
    private void ringtonePickerResult(PluginCall call, ActivityResult result) {
        JSObject selection = new JSObject();
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null) {
            selection.put("cancelled", true);
            call.resolve(selection);
            return;
        }
        Uri uri = result.getData().getParcelableExtra(RingtoneManager.EXTRA_RINGTONE_PICKED_URI);
        selection.put("cancelled", false);
        selection.put("uri", uri == null ? "" : uri.toString());
        Uri selectedUri = uri == null
            ? RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
            : uri;
        Ringtone selectedRingtone = selectedUri == null
            ? null
            : RingtoneManager.getRingtone(getContext(), selectedUri);
        String title = selectedRingtone == null ? null : selectedRingtone.getTitle(getContext());
        selection.put("title", title == null || title.trim().isEmpty() ? "System alarm" : title);
        call.resolve(selection);
    }

    @PluginMethod
    public void previewRingtone(PluginCall call) {
        stopPreview();
        String requestedUri = call.getString("uri");
        Uri uri = requestedUri == null || requestedUri.isEmpty()
            ? RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
            : Uri.parse(requestedUri);
        Ringtone ringtone = uri == null ? null : RingtoneManager.getRingtone(getContext(), uri);
        if (ringtone == null) {
            call.reject("The selected alarm sound is unavailable.");
            return;
        }
        ringtone.setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM).build());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) ringtone.setLooping(true);
        ringtone.play();
        previewRingtone = ringtone;
        call.resolve();
    }

    @PluginMethod
    public void stopRingtonePreview(PluginCall call) {
        stopPreview();
        call.resolve();
    }

    @PluginMethod
    public void requestPermissions(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
            && getPermissionState("notifications") != com.getcapacitor.PermissionState.GRANTED) {
            requestPermissionForAlias("notifications", call, "notificationsPermissionResult");
            return;
        }
        requestExactAlarmAccess(call);
    }

    @PermissionCallback
    private void notificationsPermissionResult(PluginCall call) {
        requestExactAlarmAccess(call);
    }

    private void requestExactAlarmAccess(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !canScheduleExactAlarms()) {
            Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
                .setData(Uri.parse("package:" + getContext().getPackageName()));
            startActivityForResult(call, intent, "exactAlarmSettingsResult");
            return;
        }
        requestFullScreenAccess(call);
    }

    @ActivityCallback
    private void exactAlarmSettingsResult(PluginCall call, ActivityResult result) {
        requestFullScreenAccess(call);
    }

    private void requestFullScreenAccess(PluginCall call) {
        if (Build.VERSION.SDK_INT >= 34 && !canUseFullScreenIntent()) {
            Intent intent = new Intent("android.settings.MANAGE_APP_USE_FULL_SCREEN_INTENT")
                .setData(Uri.parse("package:" + getContext().getPackageName()));
            startActivityForResult(call, intent, "fullScreenSettingsResult");
            return;
        }
        call.resolve(status());
    }

    @ActivityCallback
    private void fullScreenSettingsResult(PluginCall call, ActivityResult result) {
        call.resolve(status());
    }

    @PluginMethod
    public void snooze(PluginCall call) {
        int minutes = call.getInt("minutes", 5);
        if (minutes != 5 && minutes != 10 && minutes != 15 && minutes != 20) {
            call.reject("Snooze duration must be 5, 10, 15, or 20 minutes.");
            return;
        }
        Intent intent = new Intent(getContext(), AlarmService.class)
            .setAction(AlarmService.ACTION_SNOOZE)
            .putExtra(AlarmService.EXTRA_SNOOZE_MINUTES, minutes);
        getContext().startService(intent);
        call.resolve();
    }

    @PluginMethod
    public void dismiss(PluginCall call) {
        getContext().startService(new Intent(getContext(), AlarmService.class).setAction(AlarmService.ACTION_DISMISS));
        call.resolve();
    }

    private JSObject status() {
        JSObject result = new JSObject();
        result.put("exactAlarmAllowed", canScheduleExactAlarms());
        result.put("notificationsAllowed", NotificationManagerCompat.from(getContext()).areNotificationsEnabled());
        result.put("fullScreenAllowed", canUseFullScreenIntent());
        return result;
    }

    private boolean canScheduleExactAlarms() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return true;
        AlarmManager manager = (AlarmManager) getContext().getSystemService(Context.ALARM_SERVICE);
        return manager != null && manager.canScheduleExactAlarms();
    }

    private boolean canUseFullScreenIntent() {
        if (Build.VERSION.SDK_INT < 34) return true;
        NotificationManager manager = getContext().getSystemService(NotificationManager.class);
        return manager != null && manager.canUseFullScreenIntent();
    }

    private JSObject activeAlarm() {
        android.content.SharedPreferences preferences = AlarmScheduler.preferences(getContext());
        JSObject result = new JSObject();
        String id = preferences.getString(AlarmScheduler.ACTIVE_ID_KEY, null);
        if (id != null) {
            result.put("id", id);
            result.put("time", preferences.getString(AlarmScheduler.ACTIVE_TIME_KEY, ""));
            result.put("isSnooze", preferences.getBoolean(AlarmScheduler.ACTIVE_SNOOZE_KEY, false));
            org.json.JSONObject savedAlarm = AlarmScheduler.getAlarm(getContext(), id);
            if (savedAlarm != null) {
                result.put("label", savedAlarm.optString("label", ""));
                result.put("snoozeMinutes", savedAlarm.optInt("snoozeMinutes", 5));
                result.put("repeat", savedAlarm.optString("repeat", "daily"));
            }
            result.put("active", true);
        } else {
            result.put("active", false);
        }
        return result;
    }

    private void emitSavedActiveAlarm() {
        JSObject alarm = activeAlarm();
        if (alarm.optBoolean("active", false)) {
            notifyListeners("alarmFired", alarm, true);
        }
    }

    private void stopPreview() {
        if (previewRingtone == null) return;
        previewRingtone.stop();
        previewRingtone = null;
    }

    static void emitAlarmFired(String id, org.json.JSONObject alarm, boolean isSnooze, boolean oneTimeFinished) {
        NativeAlarmPlugin plugin = instance;
        if (plugin == null) return;
        JSObject payload = new JSObject();
        payload.put("id", id);
        payload.put("time", alarm == null ? "" : alarm.optString("time", ""));
        payload.put("label", alarm == null ? "" : alarm.optString("label", ""));
        payload.put("snoozeMinutes", alarm == null ? 5 : alarm.optInt("snoozeMinutes", 5));
        payload.put("repeat", alarm == null ? "daily" : alarm.optString("repeat", "daily"));
        payload.put("isSnooze", isSnooze);
        payload.put("oneTimeFinished", oneTimeFinished);
        plugin.notifyListeners("alarmFired", payload, true);
    }

    static void emitAlarmEnded(String result) {
        NativeAlarmPlugin plugin = instance;
        if (plugin == null) return;
        JSObject payload = new JSObject();
        payload.put("result", result.toLowerCase(Locale.ROOT));
        plugin.notifyListeners("alarmEnded", payload, true);
    }
}
