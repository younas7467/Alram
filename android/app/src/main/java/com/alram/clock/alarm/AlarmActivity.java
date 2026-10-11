package com.alram.clock.alarm;

import android.app.Activity;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

public final class AlarmActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
        );
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        }
        setVolumeControlStream(android.media.AudioManager.STREAM_ALARM);

        String time = getIntent().getStringExtra(AlarmService.EXTRA_ALARM_TIME);
        String language = getIntent().getStringExtra("alarm_language");
        if (language == null) language = "en";
        int snoozeMinutes = getIntent().getIntExtra(AlarmService.EXTRA_SNOOZE_MINUTES, 5);
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER);
        layout.setPadding(36, 48, 36, 48);
        layout.setBackgroundColor(Color.rgb(16, 40, 32));

        TextView heading = new TextView(this);
        heading.setText(AlarmText.get(language, "ringing"));
        heading.setTextColor(Color.rgb(227, 199, 129));
        heading.setTextSize(14);
        heading.setGravity(Gravity.CENTER);
        layout.addView(heading);

        TextView timeView = new TextView(this);
        timeView.setText(time == null || time.isEmpty() ? AlarmText.get(language, "wakeUp", "") : time);
        timeView.setTextColor(Color.rgb(255, 244, 217));
        timeView.setTextSize(56);
        timeView.setGravity(Gravity.CENTER);
        timeView.setPadding(0, 28, 0, 44);
        layout.addView(timeView);

        String alarmLabel = getIntent().getStringExtra("alarm_label");
        if (alarmLabel != null && !alarmLabel.isEmpty()) {
            TextView labelView = new TextView(this);
            labelView.setText(alarmLabel);
            labelView.setTextColor(Color.rgb(218, 199, 157));
            labelView.setTextSize(16);
            labelView.setGravity(Gravity.CENTER);
            labelView.setPadding(0, 0, 0, 24);
            layout.addView(labelView);
        }

        Button snooze = new Button(this);
        snooze.setText(AlarmText.get(language, "snooze", snoozeMinutes));
        styleButton(snooze);
        snooze.setOnClickListener(view -> finishWithAction(AlarmService.ACTION_SNOOZE, snoozeMinutes));
        layout.addView(snooze, new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        ));

        Button dismiss = new Button(this);
        dismiss.setText(AlarmText.get(language, "dismiss"));
        styleButton(dismiss);
        dismiss.setOnClickListener(view -> finishWithAction(AlarmService.ACTION_DISMISS));
        LinearLayout.LayoutParams dismissParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        dismissParams.topMargin = 12;
        layout.addView(dismiss, dismissParams);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(layout);
    }

    private void finishWithAction(String action) {
        finishWithAction(action, 0);
    }

    private void styleButton(Button button) {
        button.setBackgroundTintList(ColorStateList.valueOf(Color.rgb(36, 83, 64)));
        button.setTextColor(Color.rgb(255, 244, 217));
    }

    private void finishWithAction(String action, int snoozeMinutes) {
        Intent intent = new Intent(this, AlarmService.class).setAction(action);
        if (AlarmService.ACTION_SNOOZE.equals(action)) {
            intent.putExtra(AlarmService.EXTRA_SNOOZE_MINUTES, snoozeMinutes);
        }
        startService(intent);
        finish();
    }
}
