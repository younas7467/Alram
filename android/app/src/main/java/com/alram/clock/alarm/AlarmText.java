package com.alram.clock.alarm;

import java.util.Locale;

final class AlarmText {
    private AlarmText() {}

    static String get(String language, String key, int minutes) {
        boolean urdu = "ur".equals(language);
        boolean arabic = "ar".equals(language);
        boolean hindi = "hi".equals(language);
        switch (key) {
            case "ringing":
                if (urdu) return "الارم بج رہا ہے";
                if (arabic) return "المنبّه يرن";
                if (hindi) return "अलार्म बज रहा है";
                return "ALARM IS RINGING";
            case "snooze":
                if (urdu) return "اسنوز " + minutes + " منٹ";
                if (arabic) return "غفوة " + minutes + " دقائق";
                if (hindi) return "स्नूज़ " + minutes + " मिनट";
                return "Snooze " + minutes + " min";
            case "dismiss":
                if (urdu) return "بند کریں";
                if (arabic) return "إيقاف";
                if (hindi) return "बंद करें";
                return "Dismiss";
            case "notificationBody":
                return get(language, key, "");
            case "appName":
                if (urdu) return "ڈباغ الارم";
                if (arabic) return "دباغ المنبّه";
                if (hindi) return "दब्बाग अलार्म";
                return "Dabbagh Alram";
            case "channelName":
                if (urdu) return "الارم";
                if (arabic) return "المنبّهات";
                if (hindi) return "अलार्म";
                return "Alarms";
            case "channelDescription":
                if (urdu) return "ڈباغ الارم کے مقررہ الارم";
                if (arabic) return "منبّهات دباغ المجدولة";
                if (hindi) return "दब्बाग अलार्म के निर्धारित अलार्म";
                return "Scheduled alarms for Dabbagh Alram.";
            default:
                return key.toUpperCase(Locale.ROOT);
        }
    }

    static String get(String language, String key) {
        return get(language, key, 0);
    }

    static String get(String language, String key, String value) {
        boolean urdu = "ur".equals(language);
        boolean arabic = "ar".equals(language);
        boolean hindi = "hi".equals(language);
        if ("notificationBody".equals(key)) {
            if (urdu) return "الارم · " + value;
            if (arabic) return "منبّه · " + value;
            if (hindi) return "अलार्म · " + value;
            return "Alarm · " + value;
        }
        if ("wakeUp".equals(key)) {
            if (urdu) return "اٹھنے کا وقت";
            if (arabic) return "حان وقت الاستيقاظ";
            if (hindi) return "जागने का समय";
            return "Time to wake up";
        }
        return get(language, key, 0);
    }
}
