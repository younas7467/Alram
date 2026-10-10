package com.alram.clock.alarm;

import android.app.Activity;
import android.content.Intent;
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
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER);
        layout.setPadding(36, 48, 36, 48);
        layout.setBackgroundColor(Color.rgb(16, 19, 28));

        TextView heading = new TextView(this);
        heading.setText("ALARM IS RINGING");
        heading.setTextColor(Color.rgb(198, 243, 107));
        heading.setTextSize(14);
        heading.setGravity(Gravity.CENTER);
        layout.addView(heading);

        TextView timeView = new TextView(this);
        timeView.setText(time == null || time.isEmpty() ? "Wake up" : time);
        timeView.setTextColor(Color.WHITE);
        timeView.setTextSize(56);
        timeView.setGravity(Gravity.CENTER);
        timeView.setPadding(0, 28, 0, 44);
        layout.addView(timeView);

        Button snooze = new Button(this);
        snooze.setText("Snooze 5 min");
        snooze.setOnClickListener(view -> finishWithAction(AlarmService.ACTION_SNOOZE));
        layout.addView(snooze, new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        ));

        Button dismiss = new Button(this);
        dismiss.setText("Dismiss");
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
        startService(new Intent(this, AlarmService.class).setAction(action));
        finish();
    }
}
