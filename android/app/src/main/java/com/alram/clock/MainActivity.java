package com.alram.clock;

import com.getcapacitor.BridgeActivity;
import com.alram.clock.alarm.NativeAlarmPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(NativeAlarmPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
