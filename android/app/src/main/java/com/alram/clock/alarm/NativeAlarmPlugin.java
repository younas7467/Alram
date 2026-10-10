package com.alram.clock.alarm;

import android.Manifest;
import android.app.AlarmManager;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
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
import com.getcapacitor.annotation.PluginMethod;
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

    @Override
    public void load() {
        instance = this;
        emitSavedActiveAlarm();
    }

    @PluginMethod
    public void setAlarms(PluginCall call) {
        JSArray alarms = call.getArray("alarms");
        if (alarms == null) {
            call.reject("The alarm list is required.");
            return;
        }
        try {
            JSObject result = AlarmScheduler.updateAlarms(
                getContext(), alarms, call.getBoolean("monitoring", true)
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
    public void getActiveAlarm(PluginCall call) {
        call.resolve(activeAlarm());
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
            Intent intent = new Intent(AlarmManager.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
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
        getContext().startService(new Intent(getContext(), AlarmService.class).setAction(AlarmService.ACTION_SNOOZE));
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

    static void emitAlarmFired(String id, String time, boolean isSnooze) {
        NativeAlarmPlugin plugin = instance;
        if (plugin == null) return;
        JSObject payload = new JSObject();
        payload.put("id", id);
        payload.put("time", time);
        payload.put("isSnooze", isSnooze);
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
