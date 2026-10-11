"use strict";

const ALARMS_KEY = "alram.alarms.v1";
const MONITORING_KEY = "alram.monitoring.v1";
const SETTINGS_KEY = "alram.settings.v1";
const SNOOZE_OPTIONS = [5, 10, 15, 20];
const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const LOCALES = { en: "en-US", ur: "ur-PK", ar: "ar-SA", hi: "hi-IN" };

const messages = {
  en: {
    language: "Language", mainNavigation: "Main navigation", navHome: "Home", navAlarms: "Alarms", navCalendar: "Calendar", navSounds: "Sounds", navSettings: "Settings",
    homeEyebrow: "A QUIETER START TO YOUR DAY", welcome: "Make space for what matters.", localTime: "YOUR LOCAL TIME", loading: "Loading…",
    alarmsActive: "Alarms active", alarmsPaused: "Alarms paused", upNext: "UP NEXT", nextAlarm: "Next alarm", addAlarm: "Add alarm", newAlarm: "New alarm",
    today: "TODAY", moonNote: "A little time for reflection, whenever the day begins.", deviceNote: "Alarms use your device's native scheduler on Android. Delivery still depends on device settings.",
    yourRoutine: "YOUR ROUTINE", alarms: "Alarms", scheduledAlarms: "Scheduled alarms", noAlarms: "A fresh start", noAlarmsBody: "You don't have any alarms yet. Create one that works for you.", createFirst: "Create your first alarm",
    allOff: "All alarms are turned off.", noUpcoming: "No upcoming alarms. Add one to start a routine.", todayAt: "Today", tomorrowAt: "Tomorrow", inDays: "In {days} days",
    once: "Once", everyDay: "Every day", selectedDays: "Selected days", weekdays: "Weekdays", repeatOn: "Repeat on", date: "Date", time: "Time", alarmLabel: "Label", repeat: "Repeat",
    oneTime: "Once", chooseSound: "Choose sound", systemAlarm: "System alarm", alarmVolume: "Alarm volume", vibration: "Vibration", vibrationDescription: "Vibrate while the alarm is sounding",
    snoozeDuration: "Snooze duration", saveAlarm: "Save alarm", cancel: "Cancel", edit: "Edit alarm", delete: "Delete alarm", close: "Close", makeItYours: "MAKE IT YOURS",
    reflectAndPlan: "REFLECT & PLAN", islamicCalendar: "Islamic calendar", previousMonth: "Previous month", nextMonth: "Next month", islamicOccasion: "Islamic occasion",
    upcomingOccasions: "UPCOMING OCCASIONS", hijriDisclaimer: "Hijri dates are estimates and may vary by region and moon sighting. Adjust the displayed date in Settings. This calendar does not provide prayer times.",
    soundAndFeel: "SOUND & FEEL", sounds: "Sounds", alarmTone: "Alarm tone", toneDescription: "Choose from alarm sounds available on your Android device.",
    selectedForNew: "Default for new alarms", preview: "Preview", stopPreview: "Stop preview", androidSoundNote: "On Android, the system sound picker includes a built-in preview. No bundled music is used.",
    browserSoundNote: "Browser alarms use a simple generated tone while this page stays open. System ringtones are available in the Android app.", browserTone: "Generated browser tone",
    defaultsForNew: "DEFAULTS FOR NEW ALARMS", soundLimitNote: "The alarm uses your selected device sound and configured volume. Media volume is not changed.",
    personalize: "PERSONALIZE", settings: "Settings", stayInformed: "STAY INFORMED", notifications: "Notifications & permissions",
    permissionDescription: "Review the Android access needed for scheduled alarms, sound, and lock-screen controls.",
    enablePermissions: "Enable alarm permissions", exactAlarmPermission: "Exact alarm access", notificationPermission: "Notifications", fullScreenPermission: "Lock-screen alarm display",
    permissionGranted: "Allowed", permissionNeeded: "Needs attention", permissionUnknown: "Checking", reliabilityNote: "Alarm delivery and lock-screen presentation depend on Android version, permissions, and device battery policies.",
    appPreferences: "APP PREFERENCES", themeSetting: "Theme", lightTheme: "Light", darkTheme: "Dark",
    timeFormat: "Time format", systemDefault: "Device default", twelveHour: "12-hour", twentyFourHour: "24-hour",
    defaultSnooze: "Default snooze", hijriAdjustment: "Hijri date adjustment", hijriSettingNote: "A small display adjustment only; local moon sighting remains authoritative.",
    alarmsEnabled: "Alarms are active", alarmsEnabledDescription: "Pause or resume all scheduled alarms", versionNote: "Thoughtful timekeeping. Built for your daily rhythm.",
    alarmRinging: "ALARM IS RINGING", snooze: "Snooze", dismiss: "Dismiss", alarmSaved: "Alarm saved.", alarmCreated: "Alarm created.", alarmDeleted: "Alarm deleted.",
    alarmOn: "Alarm enabled.", alarmOff: "Alarm disabled.", invalidTime: "Choose a valid alarm time.", invalidDate: "Choose a future date and time.",
    chooseWeekday: "Choose at least one day for a repeating alarm.", couldNotSave: "Your alarm could not be saved. Check available storage and try again.",
    nativeSyncError: "Android could not confirm scheduling this alarm. It remains saved in the app; check alarm access in Settings.",
    nativePermissionWarning: "The alarm was scheduled, but one or more Android permissions are unavailable. Review Settings; timing or alarm presentation may be limited.",
    permissionError: "Could not open permission settings. Check Android Settings.",
    ringtoneError: "The Android sound picker could not be opened.", ringtoneUnavailable: "That sound is unavailable. Choose another Android alarm sound.",
    previewUnavailable: "Sound preview is available from the Android sound picker.", notificationGranted: "Notifications are enabled.",
    notificationsUnsupported: "Browser notifications are not supported here. Android alarms use native notifications.",
    alarmSnoozed: "Alarm snoozed for {minutes} minutes.", alarmDismissed: "Alarm dismissed.", snoozeFailed: "The alarm could not be snoozed. Try again.",
    dismissFailed: "The alarm could not be dismissed. Try again.", noSoundSelected: "System alarm", onceFinished: "One-time alarm completed.",
    tapToEdit: "Tap to edit alarm", defaultTimeLabel: "Alarm",     selectedDate: "Selected date: {date}", noOccasions: "No listed occasions this month.", minutesShort: "min",
    eventMuharram: "Islamic New Year", eventAshura: "Day of Ashura", eventMawlid: "Mawlid an-Nabi", eventIsra: "Isra and Mi'raj",
    eventShaban: "Mid-Sha'ban", eventRamadan: "Ramadan begins", eventBadr: "Battle of Badr", eventQadr: "Laylat al-Qadr (27th night)",
    eventEidFitr: "Eid al-Fitr", eventArafah: "Day of Arafah", eventEidAdha: "Eid al-Adha", eventHijriNote: "Dates can vary",
    previewPlaying: "Preview playing", selectLanguage: "Language", browserOnly: "Browser alarms only work while this page is open. Use the Android app for native scheduling.",
    alarmNotificationTitle: "Dabbagh Alram alarm", alarmNotificationBody: "{label} · {time}",
    selectRingtoneForAlarm: "Select alarm sound", onceRepeat: "Once", repeatDaily: "Every day", repeatWeekdays: "Selected weekdays",
    vibrationOn: "Vibration on", vibrationOff: "Vibration off", noLabel: "No label", alarmDeletedConfirm: "Delete this alarm?",
    monitoringPaused: "All alarms paused.", monitoringResumed: "Alarms resumed.", closeDialog: "Close alarm editor",         selected: "Selected", alarmPlaceholder: "e.g. Morning routine", hijriDate: "Hijri date",
  },
  ur: {
    language: "زبان", mainNavigation: "مرکزی نیویگیشن", navHome: "گھر", navAlarms: "الارم", navCalendar: "کیلنڈر", navSounds: "آوازیں", navSettings: "ترتیبات",
    homeEyebrow: "دن کا پُرسکون آغاز", welcome: "اہم باتوں کے لیے وقت نکالیں۔", localTime: "آپ کا مقامی وقت", loading: "لوڈ ہو رہا ہے…",
    alarmsActive: "الارم فعال ہیں", alarmsPaused: "الارم رکے ہوئے ہیں", upNext: "اگلا", nextAlarm: "اگلا الارم", addAlarm: "الارم شامل کریں", newAlarm: "نیا الارم",
    today: "آج", moonNote: "دن کے آغاز میں غور و فکر کے لیے چند لمحے۔", deviceNote: "اینڈرائیڈ پر الارم آلے کے نظام الاوقات سے چلتے ہیں؛ ترسیل آلے کی ترتیبات پر بھی منحصر ہے۔",
    yourRoutine: "آپ کا معمول", alarms: "الارم", scheduledAlarms: "مقررہ الارم", noAlarms: "نئی شروعات", noAlarmsBody: "ابھی کوئی الارم نہیں۔ اپنے معمول کے مطابق الارم بنائیں۔", createFirst: "پہلا الارم بنائیں",
    allOff: "تمام الارم بند ہیں۔", noUpcoming: "کوئی اگلا الارم نہیں۔ معمول شروع کرنے کے لیے ایک شامل کریں۔", todayAt: "آج", tomorrowAt: "کل", inDays: "{days} دن میں",
    once: "ایک بار", everyDay: "ہر روز", selectedDays: "منتخب دن", weekdays: "ہفتے کے دن", repeatOn: "ان دنوں میں دہرائیں", date: "تاریخ", time: "وقت", alarmLabel: "نام", repeat: "دہرائیں",
    oneTime: "ایک بار", chooseSound: "آواز منتخب کریں", systemAlarm: "سسٹم الارم", alarmVolume: "الارم کی آواز", vibration: "وائبریشن", vibrationDescription: "الارم کے دوران وائبریٹ کریں",
    snoozeDuration: "اسنوز کا دورانیہ", saveAlarm: "الارم محفوظ کریں", cancel: "منسوخ", edit: "الارم میں ترمیم", delete: "الارم حذف کریں", close: "بند کریں", makeItYours: "اپنی پسند کے مطابق",
    reflectAndPlan: "غور و فکر اور منصوبہ بندی", islamicCalendar: "اسلامی کیلنڈر", previousMonth: "پچھلا مہینہ", nextMonth: "اگلا مہینہ", islamicOccasion: "اسلامی موقع",
    upcomingOccasions: "آنے والے مواقع", hijriDisclaimer: "ہجری تاریخیں اندازاً ہیں اور علاقے اور چاند دیکھنے کے مطابق مختلف ہو سکتی ہیں۔ ترتیبات میں تاریخ درست کریں۔ یہ کیلنڈر نماز کے اوقات نہیں دیتا۔",
    soundAndFeel: "آواز اور احساس", sounds: "آوازیں", alarmTone: "الارم کی آواز", toneDescription: "اپنے اینڈرائیڈ آلے پر دستیاب الارم آواز منتخب کریں۔",
    selectedForNew: "نئے الارم کے لیے طے شدہ", preview: "سنیں", stopPreview: "سننا بند کریں", androidSoundNote: "اینڈرائیڈ سسٹم ساؤنڈ چننے والے میں آواز کا نمونہ شامل ہے۔ کوئی موسیقی ایپ میں شامل نہیں۔",
    browserSoundNote: "براؤزر الارم صفحہ کھلا رہنے پر بنائی گئی سادہ آواز استعمال کرتے ہیں۔ سسٹم رنگ ٹون اینڈرائیڈ ایپ میں دستیاب ہیں۔", browserTone: "براؤزر کی بنائی ہوئی آواز",
    defaultsForNew: "نئے الارم کی طے شدہ ترتیبات", soundLimitNote: "الارم آپ کی منتخب آلے کی آواز اور والیوم استعمال کرتا ہے۔ میڈیا والیوم تبدیل نہیں ہوتا۔",
    personalize: "ذاتی بنائیں", settings: "ترتیبات", stayInformed: "باخبر رہیں", notifications: "اطلاعات اور اجازتیں",
    permissionDescription: "مقررہ الارم، آواز اور لاک اسکرین کنٹرول کے لیے اینڈرائیڈ رسائی دیکھیں۔",
    enablePermissions: "الارم کی اجازتیں فعال کریں", exactAlarmPermission: "بالکل درست الارم", notificationPermission: "اطلاعات", fullScreenPermission: "لاک اسکرین الارم",
    permissionGranted: "اجازت ہے", permissionNeeded: "توجہ درکار", permissionUnknown: "جانچ جاری",
    reliabilityNote: "الارم کی ترسیل اور لاک اسکرین Android ورژن، اجازتوں اور بیٹری پالیسی پر منحصر ہے۔",
    appPreferences: "ایپ کی ترجیحات", themeSetting: "تھیم", lightTheme: "ہلکی", darkTheme: "گہری",
    timeFormat: "وقت کی شکل", systemDefault: "آلے کے مطابق", twelveHour: "۱۲ گھنٹے", twentyFourHour: "۲۴ گھنٹے",
    defaultSnooze: "طے شدہ اسنوز", hijriAdjustment: "ہجری تاریخ کی درستی", hijriSettingNote: "یہ صرف دکھائی جانے والی تاریخ میں معمولی درستی ہے؛ مقامی چاند کی رؤیت مقدم ہے۔",
    alarmsEnabled: "الارم فعال ہیں", alarmsEnabledDescription: "تمام مقررہ الارم روکیں یا دوبارہ چلائیں", versionNote: "سوچ سمجھ کر وقت کا خیال، روزمرہ کے معمول کے لیے۔",
    alarmRinging: "الارم بج رہا ہے", snooze: "اسنوز", dismiss: "بند کریں", alarmSaved: "الارم محفوظ ہو گیا۔", alarmCreated: "الارم بنا دیا گیا۔", alarmDeleted: "الارم حذف ہو گیا۔",
    alarmOn: "الارم فعال ہے۔", alarmOff: "الارم بند ہے۔", invalidTime: "درست الارم وقت منتخب کریں۔", invalidDate: "مستقبل کی تاریخ اور وقت منتخب کریں۔",
    chooseWeekday: "دہرائے جانے والے الارم کے لیے کم از کم ایک دن منتخب کریں۔", couldNotSave: "الارم محفوظ نہیں ہو سکا۔ جگہ دیکھ کر دوبارہ کوشش کریں۔",
    nativeSyncError: "اینڈرائیڈ الارم کا وقت مقرر ہونے کی تصدیق نہیں کر سکا۔ یہ ایپ میں محفوظ ہے؛ ترتیبات میں اجازتیں دیکھیں۔",
    nativePermissionWarning: "الارم مقرر ہو گیا، لیکن اینڈرائیڈ کی کچھ اجازتیں دستیاب نہیں۔ ترتیبات دیکھیں؛ وقت یا الارم کی نمائش متاثر ہو سکتی ہے۔",
    permissionError: "اجازتوں کی ترتیبات نہیں کھل سکیں۔ اینڈرائیڈ ترتیبات دیکھیں۔",
    ringtoneError: "اینڈرائیڈ ساؤنڈ چننے والا نہیں کھل سکا۔", ringtoneUnavailable: "یہ آواز دستیاب نہیں۔ دوسری الارم آواز منتخب کریں۔",
    previewUnavailable: "آواز کا نمونہ اینڈرائیڈ ساؤنڈ چننے والے میں دستیاب ہے۔", notificationGranted: "اطلاعات فعال ہیں۔",
    notificationsUnsupported: "اس براؤزر میں اطلاعات دستیاب نہیں۔ اینڈرائیڈ الارم نظام کی اطلاعات استعمال کرتے ہیں۔",
    alarmNotificationTitle: "ڈباغ الارم", alarmNotificationBody: "{label} · {time}",
    alarmSnoozed: "الارم {minutes} منٹ کے لیے ملتوی ہے۔", alarmDismissed: "الارم بند کر دیا گیا۔", snoozeFailed: "الارم ملتوی نہیں ہو سکا۔ دوبارہ کوشش کریں۔",
    dismissFailed: "الارم بند نہیں ہو سکا۔ دوبارہ کوشش کریں۔", noSoundSelected: "سسٹم الارم", onceFinished: "ایک بار والا الارم مکمل ہوا۔",
    tapToEdit: "ترمیم کے لیے الارم دبائیں", defaultTimeLabel: "الارم",     selectedDate: "منتخب تاریخ: {date}", noOccasions: "اس مہینے میں درج کوئی موقع نہیں۔", minutesShort: "منٹ",
    eventMuharram: "اسلامی نیا سال", eventAshura: "عاشورا", eventMawlid: "عید میلاد النبی", eventIsra: "شب معراج",
    eventShaban: "نصف شعبان", eventRamadan: "رمضان کا آغاز", eventBadr: "غزوۂ بدر", eventQadr: "لیلۃ القدر (ستائیسویں رات)",
    eventEidFitr: "عید الفطر", eventArafah: "یوم عرفہ", eventEidAdha: "عید الاضحیٰ", eventHijriNote: "تاریخ مختلف ہو سکتی ہے",
    previewPlaying: "نمونہ چل رہا ہے", selectLanguage: "زبان", browserOnly: "براؤزر الارم صرف اس صفحے کے کھلے رہنے پر چلتے ہیں۔ مقامی نظام الاوقات کے لیے اینڈرائیڈ ایپ استعمال کریں۔",
    selectRingtoneForAlarm: "الارم کی آواز منتخب کریں", onceRepeat: "ایک بار", repeatDaily: "ہر روز", repeatWeekdays: "منتخب دن",
    vibrationOn: "وائبریشن فعال", vibrationOff: "وائبریشن بند", noLabel: "بغیر نام", alarmDeletedConfirm: "یہ الارم حذف کریں؟",
    monitoringPaused: "تمام الارم روک دیے گئے۔", monitoringResumed: "الارم دوبارہ شروع ہو گئے۔",         closeDialog: "الارم ایڈیٹر بند کریں", selected: "منتخب", alarmPlaceholder: "مثلاً صبح کا معمول", hijriDate: "ہجری تاریخ",
  },
  ar: {
    language: "اللغة", mainNavigation: "التنقل الرئيسي", navHome: "الرئيسية", navAlarms: "المنبّهات", navCalendar: "التقويم", navSounds: "الأصوات", navSettings: "الإعدادات",
    homeEyebrow: "بداية هادئة ليومك", welcome: "امنح وقتك لما يهمك.", localTime: "الوقت المحلي", loading: "جارٍ التحميل…",
    alarmsActive: "المنبّهات نشطة", alarmsPaused: "المنبّهات متوقفة", upNext: "التالي", nextAlarm: "المنبّه التالي", addAlarm: "إضافة منبّه", newAlarm: "منبّه جديد",
    today: "اليوم", moonNote: "لحظات للتأمل مع بداية اليوم.", deviceNote: "تستخدم المنبّهات المجدول الأصلي في أندرويد؛ ويظل التسليم مرتبطًا بإعدادات الجهاز.",
    yourRoutine: "روتينك", alarms: "المنبّهات", scheduledAlarms: "المنبّهات المجدولة", noAlarms: "بداية جديدة", noAlarmsBody: "لا توجد منبّهات بعد. أنشئ منبّهًا يناسبك.", createFirst: "أنشئ أول منبّه",
    allOff: "جميع المنبّهات متوقفة.", noUpcoming: "لا توجد منبّهات قادمة. أضف منبّهًا لبدء روتينك.", todayAt: "اليوم", tomorrowAt: "غدًا", inDays: "بعد {days} أيام",
    once: "مرة واحدة", everyDay: "كل يوم", selectedDays: "أيام محددة", weekdays: "أيام الأسبوع", repeatOn: "التكرار في", date: "التاريخ", time: "الوقت", alarmLabel: "التسمية", repeat: "التكرار",
    oneTime: "مرة واحدة", chooseSound: "اختيار صوت", systemAlarm: "منبّه النظام", alarmVolume: "مستوى صوت المنبّه", vibration: "الاهتزاز", vibrationDescription: "اهتزاز أثناء رنين المنبّه",
    snoozeDuration: "مدة الغفوة", saveAlarm: "حفظ المنبّه", cancel: "إلغاء", edit: "تعديل المنبّه", delete: "حذف المنبّه", close: "إغلاق", makeItYours: "حسب اختيارك",
    reflectAndPlan: "تأمل وخطط", islamicCalendar: "التقويم الهجري", previousMonth: "الشهر السابق", nextMonth: "الشهر التالي", islamicOccasion: "مناسبة إسلامية",
    upcomingOccasions: "المناسبات القادمة", hijriDisclaimer: "التواريخ الهجرية تقديرية وقد تختلف حسب المنطقة ورؤية الهلال. عدّل التاريخ في الإعدادات. لا يعرض هذا التقويم أوقات الصلاة.",
    soundAndFeel: "الصوت والإحساس", sounds: "الأصوات", alarmTone: "نغمة المنبّه", toneDescription: "اختر من أصوات المنبّه المتاحة على جهاز أندرويد.",
    selectedForNew: "الافتراضي للمنبّهات الجديدة", preview: "معاينة", stopPreview: "إيقاف المعاينة", androidSoundNote: "يتضمن منتقي أصوات النظام في أندرويد معاينة مدمجة. لا نستخدم موسيقى مرفقة.",
    browserSoundNote: "تستخدم منبّهات المتصفح نغمة بسيطة مُولّدة ما دامت الصفحة مفتوحة. تتوفر نغمات النظام في تطبيق أندرويد.", browserTone: "نغمة متصفح مُولّدة",
    defaultsForNew: "الإعدادات الافتراضية للمنبّهات الجديدة", soundLimitNote: "يستخدم المنبّه صوت الجهاز المحدد ومستوى الصوت المضبوط. لا يتغير صوت الوسائط.",
    personalize: "التخصيص", settings: "الإعدادات", stayInformed: "ابقَ على اطلاع", notifications: "الإشعارات والأذونات",
    permissionDescription: "راجع صلاحيات أندرويد اللازمة للمنبّهات المجدولة والصوت وعناصر شاشة القفل.",
    enablePermissions: "تفعيل أذونات المنبّه", exactAlarmPermission: "إذن المنبّه الدقيق", notificationPermission: "الإشعارات", fullScreenPermission: "عرض المنبّه على شاشة القفل",
    permissionGranted: "مسموح", permissionNeeded: "يتطلب الانتباه", permissionUnknown: "جارٍ التحقق",
    reliabilityNote: "يعتمد وصول المنبّه وعرضه على شاشة القفل على إصدار أندرويد والأذونات وسياسات بطارية الجهاز.",
    appPreferences: "تفضيلات التطبيق", themeSetting: "المظهر", lightTheme: "فاتح", darkTheme: "داكن",
    timeFormat: "تنسيق الوقت", systemDefault: "إعداد الجهاز", twelveHour: "١٢ ساعة", twentyFourHour: "٢٤ ساعة",
    defaultSnooze: "مدة الغفوة الافتراضية", hijriAdjustment: "تعديل التاريخ الهجري", hijriSettingNote: "تعديل بسيط للعرض فقط؛ وتبقى رؤية الهلال المحلية هي المرجع.",
    alarmsEnabled: "المنبّهات نشطة", alarmsEnabledDescription: "إيقاف أو استئناف كل المنبّهات المجدولة", versionNote: "وقتٌ بتأنٍ، مصمم لإيقاع يومك.",
    alarmRinging: "المنبّه يرن", snooze: "غفوة", dismiss: "إيقاف", alarmSaved: "تم حفظ المنبّه.", alarmCreated: "تم إنشاء المنبّه.", alarmDeleted: "تم حذف المنبّه.",
    alarmOn: "تم تفعيل المنبّه.", alarmOff: "تم إيقاف المنبّه.", invalidTime: "اختر وقتًا صالحًا للمنبّه.", invalidDate: "اختر تاريخًا ووقتًا في المستقبل.",
    chooseWeekday: "اختر يومًا واحدًا على الأقل لتكرار المنبّه.", couldNotSave: "تعذر حفظ المنبّه. تحقق من مساحة التخزين وحاول مجددًا.",
    nativeSyncError: "تعذر على أندرويد تأكيد جدولة المنبّه. سيبقى محفوظًا في التطبيق؛ راجع أذونات المنبّهات في الإعدادات.",
    nativePermissionWarning: "تمت جدولة المنبّه، لكن بعض أذونات أندرويد غير متاحة. راجع الإعدادات؛ قد يتأثر التوقيت أو عرض المنبّه.",
    permissionError: "تعذر فتح إعدادات الأذونات. راجع إعدادات أندرويد.",
    ringtoneError: "تعذر فتح منتقي الأصوات في أندرويد.", ringtoneUnavailable: "هذا الصوت غير متاح. اختر صوت منبّه آخر.", previewUnavailable: "تتوفر معاينة الصوت في منتقي أصوات أندرويد.",
    alarmNotificationTitle: "منبّه دباغ", alarmNotificationBody: "{label} · {time}",
    notificationGranted: "الإشعارات مفعّلة.", alarmSnoozed: "تم تأجيل المنبّه {minutes} دقائق.", alarmDismissed: "تم إيقاف المنبّه.",
    notificationsUnsupported: "إشعارات المتصفح غير متاحة هنا. تستخدم منبّهات أندرويد إشعارات النظام.",
    snoozeFailed: "تعذر تأجيل المنبّه. حاول مجددًا.", dismissFailed: "تعذر إيقاف المنبّه. حاول مجددًا.", noSoundSelected: "منبّه النظام", onceFinished: "اكتمل المنبّه لمرة واحدة.",
    tapToEdit: "اضغط لتعديل المنبّه", defaultTimeLabel: "منبّه",     selectedDate: "التاريخ المحدد: {date}", noOccasions: "لا توجد مناسبات مدرجة هذا الشهر.", minutesShort: "دقيقة",
    eventMuharram: "رأس السنة الهجرية", eventAshura: "يوم عاشوراء", eventMawlid: "المولد النبوي", eventIsra: "الإسراء والمعراج",
    eventShaban: "منتصف شعبان", eventRamadan: "بداية رمضان", eventBadr: "غزوة بدر", eventQadr: "ليلة القدر (ليلة ٢٧)",
    eventEidFitr: "عيد الفطر", eventArafah: "يوم عرفة", eventEidAdha: "عيد الأضحى", eventHijriNote: "قد يختلف التاريخ",
    previewPlaying: "المعاينة تعمل", selectLanguage: "اللغة", browserOnly: "تعمل منبّهات المتصفح فقط أثناء فتح هذه الصفحة. استخدم تطبيق أندرويد للجدولة الأصلية.",
    selectRingtoneForAlarm: "اختيار صوت المنبّه", onceRepeat: "مرة واحدة", repeatDaily: "كل يوم", repeatWeekdays: "أيام محددة",
    vibrationOn: "الاهتزاز مفعّل", vibrationOff: "الاهتزاز متوقف", noLabel: "بلا تسمية", alarmDeletedConfirm: "هل تريد حذف هذا المنبّه؟",
    monitoringPaused: "تم إيقاف جميع المنبّهات.", monitoringResumed: "تم استئناف المنبّهات.",         closeDialog: "إغلاق محرر المنبّه", selected: "محدد", alarmPlaceholder: "مثال: روتين الصباح", hijriDate: "التاريخ الهجري",
  },
  hi: {
    language: "भाषा", mainNavigation: "मुख्य नेविगेशन", navHome: "होम", navAlarms: "अलार्म", navCalendar: "कैलेंडर", navSounds: "ध्वनियाँ", navSettings: "सेटिंग",
    homeEyebrow: "दिन की एक शांत शुरुआत", welcome: "ज़रूरी बातों के लिए समय निकालें।", localTime: "आपका स्थानीय समय", loading: "लोड हो रहा है…",
    alarmsActive: "अलार्म चालू हैं", alarmsPaused: "अलार्म रुके हैं", upNext: "आगे", nextAlarm: "अगला अलार्म", addAlarm: "अलार्म जोड़ें", newAlarm: "नया अलार्म",
    today: "आज", moonNote: "दिन की शुरुआत में चिंतन के कुछ पल।", deviceNote: "Android पर अलार्म डिवाइस के मूल शेड्यूलर से चलते हैं; डिलीवरी डिवाइस सेटिंग पर भी निर्भर है।",
    yourRoutine: "आपकी दिनचर्या", alarms: "अलार्म", scheduledAlarms: "शेड्यूल किए गए अलार्म", noAlarms: "नई शुरुआत", noAlarmsBody: "अभी कोई अलार्म नहीं है। अपनी दिनचर्या के लिए एक बनाएँ।", createFirst: "पहला अलार्म बनाएँ",
    allOff: "सभी अलार्म बंद हैं।", noUpcoming: "कोई अगला अलार्म नहीं। दिनचर्या शुरू करने के लिए जोड़ें।", todayAt: "आज", tomorrowAt: "कल", inDays: "{days} दिनों में",
    once: "एक बार", everyDay: "हर दिन", selectedDays: "चुने हुए दिन", weekdays: "कार्यदिवस", repeatOn: "इन दिनों दोहराएँ", date: "तारीख", time: "समय", alarmLabel: "नाम", repeat: "दोहराएँ",
    oneTime: "एक बार", chooseSound: "ध्वनि चुनें", systemAlarm: "सिस्टम अलार्म", alarmVolume: "अलार्म वॉल्यूम", vibration: "कंपन", vibrationDescription: "अलार्म बजने पर कंपन करें",
    snoozeDuration: "स्नूज़ अवधि", saveAlarm: "अलार्म सहेजें", cancel: "रद्द करें", edit: "अलार्म संपादित करें", delete: "अलार्म हटाएँ", close: "बंद करें", makeItYours: "अपनी पसंद बनाएँ",
    reflectAndPlan: "चिंतन और योजना", islamicCalendar: "इस्लामी कैलेंडर", previousMonth: "पिछला महीना", nextMonth: "अगला महीना", islamicOccasion: "इस्लामी अवसर",
    upcomingOccasions: "आने वाले अवसर", hijriDisclaimer: "हिजरी तारीखें अनुमानित हैं और क्षेत्र तथा चाँद दिखने के अनुसार बदल सकती हैं। सेटिंग में तारीख समायोजित करें। यह कैलेंडर नमाज़ का समय नहीं देता।",
    soundAndFeel: "ध्वनि और अनुभव", sounds: "ध्वनियाँ", alarmTone: "अलार्म टोन", toneDescription: "अपने Android डिवाइस पर उपलब्ध अलार्म ध्वनियों में से चुनें।",
    selectedForNew: "नए अलार्म के लिए डिफ़ॉल्ट", preview: "पूर्वावलोकन", stopPreview: "पूर्वावलोकन रोकें", androidSoundNote: "Android सिस्टम साउंड पिकर में पूर्वावलोकन शामिल है। कोई संगीत ऐप में शामिल नहीं है।",
    browserSoundNote: "ब्राउज़र अलार्म पेज खुला रहने तक बनाई गई सरल ध्वनि का उपयोग करते हैं। सिस्टम रिंगटोन Android ऐप में उपलब्ध हैं।", browserTone: "ब्राउज़र की बनाई ध्वनि",
    defaultsForNew: "नए अलार्म के लिए डिफ़ॉल्ट", soundLimitNote: "अलार्म चुनी हुई डिवाइस ध्वनि और सेट वॉल्यूम का उपयोग करता है। मीडिया वॉल्यूम नहीं बदलता।",
    personalize: "अपनी पसंद", settings: "सेटिंग", stayInformed: "सूचित रहें", notifications: "सूचनाएँ और अनुमतियाँ",
    permissionDescription: "शेड्यूल किए गए अलार्म, ध्वनि और लॉक-स्क्रीन नियंत्रण के लिए Android एक्सेस देखें।",
    enablePermissions: "अलार्म अनुमतियाँ चालू करें", exactAlarmPermission: "सटीक अलार्म एक्सेस", notificationPermission: "सूचनाएँ", fullScreenPermission: "लॉक-स्क्रीन अलार्म डिस्प्ले",
    permissionGranted: "अनुमति मिली", permissionNeeded: "ध्यान दें", permissionUnknown: "जाँच जारी",
    reliabilityNote: "अलार्म डिलीवरी और लॉक-स्क्रीन प्रदर्शन Android संस्करण, अनुमतियों और बैटरी नीतियों पर निर्भर करता है।",
    appPreferences: "ऐप प्राथमिकताएँ", themeSetting: "थीम", lightTheme: "हल्की", darkTheme: "गहरी",
    timeFormat: "समय प्रारूप", systemDefault: "डिवाइस डिफ़ॉल्ट", twelveHour: "12 घंटे", twentyFourHour: "24 घंटे",
    defaultSnooze: "डिफ़ॉल्ट स्नूज़", hijriAdjustment: "हिजरी तारीख समायोजन", hijriSettingNote: "यह केवल प्रदर्शन समायोजन है; स्थानीय चाँद दिखना ही मान्य रहेगा।",
    alarmsEnabled: "अलार्म सक्रिय हैं", alarmsEnabledDescription: "सभी शेड्यूल किए गए अलार्म रोकें या फिर चालू करें", versionNote: "सोच-समझकर समय, आपकी दिनचर्या के लिए।",
    alarmRinging: "अलार्म बज रहा है", snooze: "स्नूज़", dismiss: "बंद करें", alarmSaved: "अलार्म सहेजा गया।", alarmCreated: "अलार्म बनाया गया।", alarmDeleted: "अलार्म हटा दिया गया।",
    alarmOn: "अलार्म चालू किया गया।", alarmOff: "अलार्म बंद किया गया।", invalidTime: "एक मान्य अलार्म समय चुनें।", invalidDate: "भविष्य की तारीख और समय चुनें।",
    chooseWeekday: "दोहराए जाने वाले अलार्म के लिए कम से कम एक दिन चुनें।", couldNotSave: "अलार्म सहेजा नहीं जा सका। स्टोरेज देखें और फिर कोशिश करें।",
    nativeSyncError: "Android अलार्म शेड्यूल की पुष्टि नहीं कर सका। यह ऐप में सहेजा है; सेटिंग में अलार्म अनुमति देखें।",
    nativePermissionWarning: "अलार्म शेड्यूल हुआ, लेकिन Android की कुछ अनुमतियाँ उपलब्ध नहीं हैं। सेटिंग देखें; समय या अलार्म प्रदर्शन प्रभावित हो सकता है।",
    permissionError: "अनुमति सेटिंग नहीं खुल सकी। Android सेटिंग देखें।",
    ringtoneError: "Android साउंड पिकर नहीं खुल सका।", ringtoneUnavailable: "यह ध्वनि उपलब्ध नहीं है। दूसरी Android अलार्म ध्वनि चुनें।", previewUnavailable: "ध्वनि पूर्वावलोकन Android साउंड पिकर में उपलब्ध है।",
    alarmNotificationTitle: "दब्बाग अलार्म", alarmNotificationBody: "{label} · {time}",
    notificationGranted: "सूचनाएँ चालू हैं।", alarmSnoozed: "अलार्म {minutes} मिनट के लिए स्नूज़ किया गया।", alarmDismissed: "अलार्म बंद किया गया।",
    notificationsUnsupported: "यहाँ ब्राउज़र सूचनाएँ उपलब्ध नहीं हैं। Android अलार्म सिस्टम सूचनाओं का उपयोग करते हैं।",
    snoozeFailed: "अलार्म स्नूज़ नहीं हो सका। फिर कोशिश करें।", dismissFailed: "अलार्म बंद नहीं हो सका। फिर कोशिश करें।", noSoundSelected: "सिस्टम अलार्म",
    onceFinished: "एक बार वाला अलार्म पूरा हुआ।", tapToEdit: "अलार्म संपादित करने के लिए टैप करें", defaultTimeLabel: "अलार्म",
    selectedDate: "चुनी हुई तारीख: {date}", noOccasions: "इस महीने कोई अवसर सूचीबद्ध नहीं है।", minutesShort: "मिनट",
    eventMuharram: "इस्लामी नववर्ष", eventAshura: "आशूरा", eventMawlid: "मौलिद उन-नबी", eventIsra: "इसरा और मेराज",
    eventShaban: "मध्य शाबान", eventRamadan: "रमज़ान शुरू", eventBadr: "जंग-ए-बद्र", eventQadr: "लैलतुल क़द्र (27वीं रात)",
    eventEidFitr: "ईद अल-फ़ित्र", eventArafah: "अरफ़ा का दिन", eventEidAdha: "ईद अल-अज़हा", eventHijriNote: "तारीख बदल सकती है",
    previewPlaying: "पूर्वावलोकन चल रहा है", selectLanguage: "भाषा", browserOnly: "ब्राउज़र अलार्म तभी चलते हैं जब यह पेज खुला हो। मूल शेड्यूलिंग के लिए Android ऐप उपयोग करें।",
    selectRingtoneForAlarm: "अलार्म ध्वनि चुनें", onceRepeat: "एक बार", repeatDaily: "हर दिन", repeatWeekdays: "चुने हुए दिन",
    vibrationOn: "कंपन चालू", vibrationOff: "कंपन बंद", noLabel: "बिना नाम", alarmDeletedConfirm: "यह अलार्म हटाएँ?",
    monitoringPaused: "सभी अलार्म रोक दिए गए।", monitoringResumed: "अलार्म फिर चालू हुए।", closeDialog: "अलार्म संपादक बंद करें", selected: "चुना गया",
    alarmPlaceholder: "जैसे: सुबह की दिनचर्या",
    hijriDate: "हिजरी तारीख",
  },
};

const state = {
  alarms: [],
  monitoring: readStorage(MONITORING_KEY, "true") !== "false",
  settings: null,
  native: window.Capacitor?.getPlatform?.() === "android"
    ? window.Capacitor.registerPlugin("NativeAlarm")
    : null,
  currentView: "home",
  month: startOfMonth(new Date()),
  selectedDate: new Date(),
  ringingAlarm: null,
  snoozeUntil: null,
  audio: null,
  audioTimer: null,
  toastTimer: null,
  nativeListenersConnected: false,
  permissionStatus: null,
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

state.settings = loadSettings();
state.alarms = loadAlarms();

function t(key, values = {}) {
  const dictionary = messages[state.settings?.language] || messages.en;
  return (dictionary[key] || messages.en[key] || key).replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
}

function announceAlarmChange(successKey) {
  const hasScheduledAlarms = state.monitoring && state.alarms.some((alarm) => alarm.enabled);
  const permissionsMissing = state.native && hasScheduledAlarms && state.permissionStatus
    && (!state.permissionStatus.exactAlarmAllowed
      || !state.permissionStatus.notificationsAllowed
      || !state.permissionStatus.fullScreenAllowed);
  announce(t(permissionsMissing ? "nativePermissionWarning" : successKey));
}

function readStorage(key, fallback = null) {
  try { return localStorage.getItem(key) ?? fallback; }
  catch (error) {
    console.error(`Could not read ${key}:`, error);
    announce(t("couldNotSave"));
    return fallback;
  }
}

function loadAlarms() {
  const stored = readStorage(ALARMS_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new TypeError("Saved alarms must be an array.");
    return parsed.filter((alarm) =>
      alarm && typeof alarm.id === "string" && typeof alarm.time === "string"
      && /^\d{2}:\d{2}$/.test(alarm.time) && typeof alarm.enabled === "boolean"
    ).map(normalizeAlarm);
  } catch (error) {
    console.error("Could not load saved alarms:", error);
    return [];
  }
}

function normalizeAlarm(alarm) {
  return {
    id: alarm.id,
    time: alarm.time,
    enabled: alarm.enabled,
    label: typeof alarm.label === "string" ? alarm.label : "",
    repeat: ["once", "daily", "weekdays"].includes(alarm.repeat) ? alarm.repeat : "daily",
    date: typeof alarm.date === "string" ? alarm.date : localDateString(new Date()),
    weekdays: Array.isArray(alarm.weekdays) ? alarm.weekdays.filter((day) => Number.isInteger(day) && day >= 0 && day <= 6) : [],
    ringtoneUri: typeof alarm.ringtoneUri === "string" ? alarm.ringtoneUri : "",
    soundName: typeof alarm.soundName === "string" && alarm.soundName ? alarm.soundName : t("systemAlarm"),
    volume: Number.isFinite(alarm.volume) ? Math.max(0, Math.min(100, alarm.volume)) : state.settings.defaultVolume,
    vibrate: typeof alarm.vibrate === "boolean" ? alarm.vibrate : state.settings.defaultVibration,
    snoozeMinutes: SNOOZE_OPTIONS.includes(alarm.snoozeMinutes) ? alarm.snoozeMinutes : state.settings.defaultSnooze,
    language: state.settings.language,
    displayTime: formatTime(alarm.time),
    lastTriggeredDate: typeof alarm.lastTriggeredDate === "string" ? alarm.lastTriggeredDate : "",
  };
}

function loadSettings() {
  let saved = {};
  try { saved = JSON.parse(readStorage(SETTINGS_KEY, "{}")) || {}; }
  catch (error) { console.error("Could not load app settings:", error); }
  return {
    language: ["en", "ur", "ar", "hi"].includes(saved.language) ? saved.language : "en",
    theme: ["system", "light", "dark"].includes(saved.theme) ? saved.theme : "system",
    timeFormat: ["system", "12", "24"].includes(saved.timeFormat) ? saved.timeFormat : "system",
    defaultSnooze: SNOOZE_OPTIONS.includes(saved.defaultSnooze) ? saved.defaultSnooze : 5,
    defaultVolume: Number.isFinite(saved.defaultVolume) ? Math.max(0, Math.min(100, saved.defaultVolume)) : 75,
    defaultVibration: typeof saved.defaultVibration === "boolean" ? saved.defaultVibration : true,
    defaultSoundUri: typeof saved.defaultSoundUri === "string" ? saved.defaultSoundUri : "",
    defaultSoundName: typeof saved.defaultSoundName === "string" && saved.defaultSoundName ? saved.defaultSoundName : t("systemAlarm"),
    hijriAdjustment: Number.isInteger(saved.hijriAdjustment) ? Math.max(-2, Math.min(2, saved.hijriAdjustment)) : 0,
  };
}

function saveSettings() {
  try {
    persistSettings();
    applyLanguage();
    applyTheme();
    renderClock();
    renderCalendar();
    renderAlarms();
    renderSoundSettings();
    renderPermissionStatus();
    return true;
  } catch (error) {
    console.error("Could not save app settings:", error);
    announce(t("couldNotSave"));
    return false;
  }
}

function persistSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function saveAlarms() {
  try {
    localStorage.setItem(ALARMS_KEY, JSON.stringify(state.alarms));
    return true;
  } catch (error) {
    console.error("Could not save alarms:", error);
    announce(t("couldNotSave"));
    return false;
  }
}

function locale() { return LOCALES[state.settings.language] || LOCALES.en; }
function hourCycle() { return state.settings.timeFormat === "24" ? "h23" : state.settings.timeFormat === "12" ? "h12" : undefined; }

function formatTime(value, includeSeconds = false) {
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, includeSeconds ? new Date().getSeconds() : 0, 0);
  const options = { hour: "2-digit", minute: "2-digit" };
  if (includeSeconds) options.second = "2-digit";
  if (hourCycle()) options.hourCycle = hourCycle();
  return new Intl.DateTimeFormat(locale(), options).format(date);
}

function localDateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function startOfMonth(date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function addDays(date, amount) { const result = new Date(date); result.setDate(result.getDate() + amount); return result; }

function announce(message) {
  const node = $("#announcement");
  if (node) node.textContent = message;
  showToast(message);
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3500);
}

function applyLanguage() {
  const language = state.settings.language;
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" || language === "ur" ? "rtl" : "ltr";
  $$("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
  $$("[data-i18n-aria]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.i18nAria)); });
  $("#language-select").value = language;
  $("#settings-language").value = language;
  $("#theme-select").value = state.settings.theme;
  $("#time-format").value = state.settings.timeFormat;
  $("#default-snooze").value = String(state.settings.defaultSnooze);
  $("#default-volume").value = String(state.settings.defaultVolume);
  $("#default-volume-output").value = `${state.settings.defaultVolume}%`;
  $("#default-vibration").checked = state.settings.defaultVibration;
  $("#hijri-adjustment").value = String(state.settings.hijriAdjustment);
  $("#hijri-adjustment-output").value = state.settings.hijriAdjustment > 0
    ? `+${state.settings.hijriAdjustment}` : String(state.settings.hijriAdjustment);
  $("#monitoring-toggle").checked = state.monitoring;
  $("#language-select").setAttribute("aria-label", t("language"));
  $("#settings-language").setAttribute("aria-label", t("language"));
  $(".bottom-nav").setAttribute("aria-label", t("mainNavigation"));
  $(".brand").setAttribute("aria-label", `${t("navHome")} · Dabbagh Alram`);
  $(".clock-card").setAttribute("aria-label", t("localTime"));
  $("#header-hijri").setAttribute("aria-label", t("hijriDate"));
  $("#calendar-grid").setAttribute("aria-label", t("navCalendar"));
  $("#alarm-label").placeholder = t("alarmPlaceholder");
  $("#default-snooze").querySelectorAll("option").forEach((option) => {
    option.textContent = `${option.value} ${t("minutesShort")}`;
  });
  $("#alarm-snooze").querySelectorAll("option").forEach((option) => {
    option.textContent = `${option.value} ${t("minutesShort")}`;
  });
  renderWeekdayPicker();
}

function applyTheme() {
  const dark = state.settings.theme === "dark"
    || (state.settings.theme === "system" && window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]').content = dark ? "#101b16" : "#102820";
}

function hijriParts(date) {
  const adjusted = addDays(date, state.settings.hijriAdjustment);
  const options = { calendar: "islamic-umalqura", numberingSystem: "latn", day: "numeric", month: "numeric", year: "numeric" };
  try {
    const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", options).formatToParts(adjusted);
    return {
      day: Number(parts.find((part) => part.type === "day")?.value),
      month: Number(parts.find((part) => part.type === "month")?.value),
      year: Number(parts.find((part) => part.type === "year")?.value),
    };
  } catch (error) {
    console.error("Umm al-Qura calendar is unavailable; using the Islamic calendar fallback:", error);
    const parts = new Intl.DateTimeFormat("en-u-ca-islamic-nu-latn", options).formatToParts(adjusted);
    return {
      day: Number(parts.find((part) => part.type === "day")?.value),
      month: Number(parts.find((part) => part.type === "month")?.value),
      year: Number(parts.find((part) => part.type === "year")?.value),
    };
  }
}

function formatHijri(date, includeYear = true) {
  const adjusted = addDays(date, state.settings.hijriAdjustment);
  const suffix = state.settings.language === "ar" ? "ar-SA" : state.settings.language === "ur" ? "ur-PK" : state.settings.language === "hi" ? "hi-IN" : "en-US";
  try {
    return new Intl.DateTimeFormat(`${suffix}-u-ca-islamic-umalqura`, {
      day: "numeric", month: "long", ...(includeYear ? { year: "numeric" } : {}),
    }).format(adjusted);
  } catch (error) {
    console.error("Could not format the Hijri date:", error);
    return new Intl.DateTimeFormat(`${suffix}-u-ca-islamic`, { day: "numeric", month: "long" }).format(adjusted);
  }
}

function renderClock() {
  const now = new Date();
  const timeValue = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  $("#clock-time").textContent = formatTime(timeValue, true);
  $("#clock-date").textContent = new Intl.DateTimeFormat(locale(), { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(now);
  $("#today-label").textContent = new Intl.DateTimeFormat(locale(), { weekday: "long" }).format(now);
  $("#hero-hijri").textContent = formatHijri(now);
  $("#header-hijri").textContent = formatHijri(now, false);
  $("#home-gregorian-date").textContent = new Intl.DateTimeFormat(locale(), { weekday: "long", month: "long", day: "numeric" }).format(now);
  $("#home-hijri-date").textContent = formatHijri(now);
  $("#monitor-status").textContent = t(state.monitoring ? "alarmsActive" : "alarmsPaused");
  $("#status-indicator").classList.toggle("is-paused", !state.monitoring);
  renderNextAlarm();
  if (!state.native) checkWebAlarms(now);
}

function weekStart() {
  try { return new Intl.Locale(locale()).weekInfo.firstDay % 7; }
  catch { return 0; }
}

const ISLAMIC_EVENTS = [
  [1, 1, "eventMuharram"], [1, 10, "eventAshura"], [3, 12, "eventMawlid"],
  [7, 27, "eventIsra"], [8, 15, "eventShaban"], [9, 1, "eventRamadan"],
  [9, 17, "eventBadr"], [9, 27, "eventQadr"], [10, 1, "eventEidFitr"],
  [12, 9, "eventArafah"], [12, 10, "eventEidAdha"],
];

function eventForDate(date) {
  const parts = hijriParts(date);
  return ISLAMIC_EVENTS.find(([month, day]) => month === parts.month && day === parts.day) || null;
}

function renderCalendar() {
  const monthFormat = new Intl.DateTimeFormat(locale(), { month: "long", year: "numeric" });
  $("#calendar-month").textContent = monthFormat.format(state.month);
  const headings = $("#calendar-weekdays");
  headings.replaceChildren();
  const firstDay = weekStart();
  for (let offset = 0; offset < 7; offset++) {
    const dayIndex = (firstDay + offset) % 7;
    const sample = new Date(2024, 0, 7 + dayIndex);
    const heading = document.createElement("span");
    heading.textContent = new Intl.DateTimeFormat(locale(), { weekday: "short" }).format(sample);
    headings.append(heading);
  }

  const grid = $("#calendar-grid");
  grid.replaceChildren();
  const first = startOfMonth(state.month);
  const leading = (first.getDay() - firstDay + 7) % 7;
  const gridStart = addDays(first, -leading);
  const today = localDateString(new Date());
  const selected = localDateString(state.selectedDate);
  for (let index = 0; index < 42; index++) {
    const date = addDays(gridStart, index);
    const key = localDateString(date);
    const event = eventForDate(date);
    const day = document.createElement("button");
    day.type = "button";
    day.className = "calendar-day";
    day.setAttribute("role", "gridcell");
    day.setAttribute("aria-label", `${new Intl.DateTimeFormat(locale(), { dateStyle: "full" }).format(date)}${event ? `, ${t(event[2])}` : ""}`);
    if (date.getMonth() !== state.month.getMonth()) day.classList.add("is-outside");
    if (key === today) day.classList.add("is-today");
    if (key === selected) day.classList.add("is-selected");
    if (event) day.classList.add("has-occasion");
    const gregorian = document.createElement("span");
    gregorian.className = "gregorian-day";
    gregorian.textContent = new Intl.NumberFormat(locale(), { useGrouping: false }).format(date.getDate());
    const hijri = document.createElement("span");
    hijri.className = "hijri-day";
    hijri.textContent = new Intl.NumberFormat(locale(), { useGrouping: false }).format(hijriParts(date).day);
    day.append(gregorian, hijri);
    if (event) {
      const dot = document.createElement("span");
      dot.className = "occasion-dot";
      day.append(dot);
    }
    day.addEventListener("click", () => {
      state.selectedDate = date;
      if (date.getMonth() !== state.month.getMonth()) state.month = startOfMonth(date);
      renderCalendar();
      $("#calendar-selection").textContent = t("selectedDate", {
        date: `${new Intl.DateTimeFormat(locale(), { dateStyle: "full" }).format(date)} · ${formatHijri(date)}`,
      });
    });
    grid.append(day);
  }
  renderOccasions();
}

function renderOccasions() {
  const list = $("#occasion-list");
  list.replaceChildren();
  const monthDates = [];
  const today = new Date();
  for (let offset = 0; offset <= 370; offset++) {
    const date = addDays(today, offset);
    if (date.getMonth() !== state.month.getMonth() || date.getFullYear() !== state.month.getFullYear()) continue;
    const event = eventForDate(date);
    if (event) monthDates.push({ date, event });
  }
  if (monthDates.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted-copy";
    empty.textContent = t("noOccasions");
    list.append(empty);
    return;
  }
  for (const { date, event } of monthDates) {
    const item = document.createElement("article");
    item.className = "occasion-item";
    const eventDate = document.createElement("span");
    eventDate.className = "occasion-date";
    eventDate.textContent = new Intl.DateTimeFormat(locale(), { day: "numeric", month: "short" }).format(date);
    const text = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = t(event[2]);
    const note = document.createElement("small");
    note.textContent = t("eventHijriNote");
    text.append(title, note);
    item.append(eventDate, text);
    list.append(item);
  }
}

function renderWeekdayPicker(selectedDays = []) {
  const container = $("#weekday-options");
  if (!container) return;
  container.replaceChildren();
  for (let day = 0; day < 7; day++) {
    const label = document.createElement("label");
    label.className = "weekday-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "weekdays";
    input.value = String(day);
    input.checked = selectedDays.includes(day);
    input.setAttribute("aria-label", new Intl.DateTimeFormat(locale(), { weekday: "long" }).format(new Date(2024, 0, 7 + day)));
    const shortDay = document.createElement("span");
    shortDay.textContent = new Intl.DateTimeFormat(locale(), { weekday: "narrow" }).format(new Date(2024, 0, 7 + day));
    label.append(input, shortDay);
    container.append(label);
  }
}

function repeatSummary(alarm) {
  if (alarm.repeat === "once") {
    const date = new Date(`${alarm.date}T12:00:00`);
    return `${t("once")} · ${new Intl.DateTimeFormat(locale(), { month: "short", day: "numeric" }).format(date)}`;
  }
  if (alarm.repeat === "daily") return t("everyDay");
  const days = [...alarm.weekdays].sort((a, b) => a - b);
  if (days.length === 5 && days.every((day, index) => day === index + 1)) return t("weekdays");
  return days.map((day) => new Intl.DateTimeFormat(locale(), { weekday: "short" }).format(new Date(2024, 0, 7 + day))).join(" · ");
}

function renderAlarms() {
  const list = $("#alarm-list");
  if (!list) return;
  list.replaceChildren();
  $("#alarm-count").textContent = new Intl.NumberFormat(locale()).format(state.alarms.length);
  $("#empty-state").hidden = state.alarms.length > 0;
  [...state.alarms].sort((a, b) => a.time.localeCompare(b.time)).forEach((alarm) => {
    const row = document.createElement("article");
    row.className = `alarm-row${alarm.enabled ? "" : " is-disabled"}`;
    const main = document.createElement("button");
    main.className = "alarm-main";
    main.type = "button";
    main.setAttribute("aria-label", `${t("edit")}: ${formatTime(alarm.time)} ${alarm.label || t("defaultTimeLabel")}`);
    main.title = t("tapToEdit");
    const icon = document.createElement("span");
    icon.className = "alarm-bell";
    icon.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-alarm"/></svg>';
    const info = document.createElement("span");
    info.className = "alarm-info";
    const time = document.createElement("span");
    time.className = "alarm-time";
    time.textContent = formatTime(alarm.time);
    const caption = document.createElement("span");
    caption.className = "alarm-caption";
    caption.textContent = alarm.label || repeatSummary(alarm);
    info.append(time, caption);
    main.append(icon, info);
    main.addEventListener("click", () => openAlarmEditor(alarm));

    const summary = document.createElement("span");
    summary.className = "alarm-summary";
    summary.textContent = repeatSummary(alarm);

    const actions = document.createElement("div");
    actions.className = "alarm-actions";
    const toggleLabel = document.createElement("label");
    toggleLabel.className = "switch";
    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.checked = alarm.enabled;
    toggle.setAttribute("aria-label", `${alarm.enabled ? t("alarmOff") : t("alarmOn")} ${formatTime(alarm.time)}`);
    toggle.addEventListener("change", async () => {
      const enabled = toggle.checked;
      if (await updateAlarm(alarm.id, (item) => ({ ...item, enabled }))) {
        announceAlarmChange(enabled ? "alarmOn" : "alarmOff");
      }
    });
    const track = document.createElement("span");
    track.className = "switch-track";
    toggleLabel.append(toggle, track);
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "small-action";
    edit.setAttribute("aria-label", t("edit"));
    edit.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-edit"/></svg>';
    edit.addEventListener("click", () => openAlarmEditor(alarm));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "small-action is-danger";
    remove.setAttribute("aria-label", t("delete"));
    remove.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-trash"/></svg>';
    remove.addEventListener("click", async () => {
      if (!window.confirm(t("alarmDeletedConfirm"))) return;
      await deleteAlarm(alarm.id);
    });
    actions.append(toggleLabel, edit, remove);
    row.append(main, summary, actions);
    list.append(row);
  });
  renderNextAlarm();
}

function nextOccurrence(alarm, now = new Date()) {
  if (!alarm.enabled) return null;
  const [hours, minutes] = alarm.time.split(":").map(Number);
  for (let offset = 0; offset < (alarm.repeat === "once" ? 2 : 8); offset++) {
    const date = addDays(new Date(now.getFullYear(), now.getMonth(), now.getDate()), offset);
    if (alarm.repeat === "once" && localDateString(date) !== alarm.date) continue;
    if (alarm.repeat === "weekdays" && !alarm.weekdays.includes(date.getDay())) continue;
    date.setHours(hours, minutes, 0, 0);
    if (date <= now) continue;
    return date;
  }
  return null;
}

function renderNextAlarm() {
  const content = $("#next-alarm-content");
  const upcoming = state.alarms.map((alarm) => ({ alarm, date: nextOccurrence(alarm) }))
    .filter((item) => item.date).sort((a, b) => a.date - b.date)[0];
  content.replaceChildren();
  if (!upcoming) {
    const empty = document.createElement("p");
    empty.className = "next-alarm-empty";
    empty.textContent = state.alarms.length && state.alarms.every((alarm) => !alarm.enabled)
      ? t("allOff") : t("noUpcoming");
    content.append(empty);
    return;
  }
  const time = document.createElement("span");
  time.className = "next-time";
  time.textContent = formatTime(upcoming.alarm.time);
  const caption = document.createElement("p");
  caption.className = "next-caption";
  const dayDifference = Math.floor((new Date(upcoming.date.getFullYear(), upcoming.date.getMonth(), upcoming.date.getDate()) - new Date().setHours(0, 0, 0, 0)) / 86400000);
  const relative = dayDifference === 0 ? t("todayAt") : dayDifference === 1 ? t("tomorrowAt") : t("inDays", { days: dayDifference });
  const weekday = new Intl.DateTimeFormat(locale(), { weekday: "long" }).format(upcoming.date);
  caption.textContent = `${upcoming.alarm.label || repeatSummary(upcoming.alarm)} · ${relative}, ${weekday}`;
  content.append(time, caption);
}

function openAlarmEditor(alarm = null) {
  const form = $("#alarm-form");
  form.reset();
  $("#form-error").hidden = true;
  $("#alarm-id").value = alarm?.id || "";
  $("#alarm-dialog-title").textContent = t(alarm ? "edit" : "newAlarm");
  $("#alarm-time").value = alarm?.time || "07:00";
  $("#alarm-label").value = alarm?.label || "";
  $("#alarm-repeat").value = alarm?.repeat || "daily";
  $("#alarm-date").value = alarm?.date || localDateString(new Date());
  $("#alarm-sound-uri").value = alarm?.ringtoneUri || state.settings.defaultSoundUri;
  $("#alarm-sound-name").textContent = alarm?.ringtoneUri
    ? alarm.soundName
    : state.settings.defaultSoundUri
      ? state.settings.defaultSoundName
      : state.native ? t("systemAlarm") : t("browserTone");
  $("#pick-alarm-sound").disabled = !state.native;
  $("#alarm-volume").value = String(alarm?.volume ?? state.settings.defaultVolume);
  $("#alarm-volume-output").value = `${$("#alarm-volume").value}%`;
  $("#alarm-vibration").checked = alarm?.vibrate ?? state.settings.defaultVibration;
  $("#alarm-snooze").value = String(alarm?.snoozeMinutes ?? state.settings.defaultSnooze);
  renderWeekdayPicker(alarm?.weekdays || []);
  updateRepeatFields();
  const dialog = $("#alarm-dialog");
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function closeAlarmEditor() {
  const dialog = $("#alarm-dialog");
  if (typeof dialog.close === "function" && dialog.open) dialog.close();
  else dialog.removeAttribute("open");
}

function updateRepeatFields() {
  const repeat = $("#alarm-repeat").value;
  $("#once-date-row").hidden = repeat !== "once";
  $("#weekday-picker").hidden = repeat !== "weekdays";
  $("#alarm-date").required = repeat === "once";
}

async function pickRingtone(target = "alarm") {
  if (!state.native) {
    announce(t("previewUnavailable"));
    return;
  }
  const uriInput = target === "default" ? null : $("#alarm-sound-uri");
  const currentUri = uriInput ? uriInput.value : state.settings.defaultSoundUri;
  try {
    const result = await state.native.pickRingtone({ uri: currentUri });
    if (result.cancelled) return;
    const uri = result.uri || "";
    const name = result.title || t("systemAlarm");
    if (uriInput) {
      uriInput.value = uri;
      $("#alarm-sound-name").textContent = name;
    } else {
      state.settings.defaultSoundUri = uri;
      state.settings.defaultSoundName = name;
      saveSettings();
    }
  } catch (error) {
    console.error("Android ringtone picker failed:", error);
    announce(t("ringtoneError"));
  }
}

async function previewRingtone() {
  if (!state.native) {
    announce(t("previewUnavailable"));
    return;
  }
  try {
    await state.native.previewRingtone({ uri: state.settings.defaultSoundUri });
    $("#preview-sound").disabled = true;
    $("#stop-preview").disabled = false;
    announce(t("previewPlaying"));
  } catch (error) {
    console.error("Android ringtone preview failed:", error);
    announce(t("ringtoneUnavailable"));
  }
}

async function stopRingtonePreview() {
  if (!state.native) return;
  try {
    await state.native.stopRingtonePreview();
  } catch (error) {
    console.error("Android ringtone preview could not be stopped:", error);
  } finally {
    $("#preview-sound").disabled = false;
    $("#stop-preview").disabled = true;
  }
}

function renderSoundSettings() {
  $("#sound-name").textContent = !state.native
    ? t("browserTone")
    : state.settings.defaultSoundUri
    ? state.settings.defaultSoundName || t("systemAlarm")
    : t("systemAlarm");
  $("#pick-default-sound").disabled = !state.native;
  $("#preview-sound").disabled = !state.native;
  $("#stop-preview").disabled = true;
  $("#sound-support-note").textContent = t(state.native ? "androidSoundNote" : "browserSoundNote");
  $("#default-volume").value = String(state.settings.defaultVolume);
  $("#default-volume-output").value = `${state.settings.defaultVolume}%`;
  $("#default-vibration").checked = state.settings.defaultVibration;
}

function renderPermissionStatus() {
  const container = $("#permission-status");
  if (!container) return;
  container.replaceChildren();
  if (!state.native && !("Notification" in window)) {
    container.textContent = t("notificationsUnsupported");
    return;
  }
  const status = state.permissionStatus || (!state.native
    ? { notificationsAllowed: Notification.permission === "granted" }
    : null);
  const permissions = state.native ? [
    ["exactAlarmAllowed", "exactAlarmPermission"],
    ["notificationsAllowed", "notificationPermission"],
    ["fullScreenAllowed", "fullScreenPermission"],
  ] : [["notificationsAllowed", "notificationPermission"]];
  for (const [field, key] of permissions) {
    const item = document.createElement("div");
    const granted = status ? Boolean(status[field]) : false;
    item.className = `permission-item${granted ? " is-granted" : ""}`;
    item.textContent = `${t(key)} · ${status ? t(granted ? "permissionGranted" : "permissionNeeded") : t("permissionUnknown")}`;
    container.append(item);
  }
}

async function requestPermissions() {
  try {
    if (state.native) {
      state.permissionStatus = await state.native.requestPermissions();
      renderPermissionStatus();
      const permissionsMissing = !state.permissionStatus.exactAlarmAllowed
        || !state.permissionStatus.notificationsAllowed
        || !state.permissionStatus.fullScreenAllowed;
      if (permissionsMissing) announce(t("nativePermissionWarning"));
    } else if ("Notification" in window) {
      if (Notification.permission === "default") {
        const result = await Notification.requestPermission();
        state.permissionStatus = { notificationsAllowed: result === "granted" };
        renderPermissionStatus();
        if (result === "granted") announce(t("notificationGranted"));
        else announce(t("browserOnly"));
      } else if (Notification.permission === "granted") {
        announce(t("notificationGranted"));
      } else {
        announce(t("browserOnly"));
      }
    } else {
      announce(t("notificationsUnsupported"));
    }
  } catch (error) {
    console.error("Alarm permissions could not be requested:", error);
    announce(t("permissionError"));
  }
}

function syncNativeAlarms() {
  if (!state.native) return Promise.resolve(true);
  return state.native.setAlarms({ alarms: state.alarms, monitoring: state.monitoring }).then(async (result) => {
    const expectedCount = state.monitoring ? state.alarms.filter((alarm) => alarm.enabled).length : 0;
    if (result.scheduledCount !== expectedCount) {
      throw new Error(`Android scheduled ${result.scheduledCount} of ${expectedCount} enabled alarms.`);
    }
    state.permissionStatus = await state.native.getStatus();
    renderPermissionStatus();
    return true;
  }).catch((error) => {
    console.error("Native alarm schedule sync failed:", error);
    announce(t("nativeSyncError"));
    return false;
  });
}

async function updateAlarm(id, transform) {
  const previousAlarms = state.alarms;
  state.alarms = state.alarms.map((alarm) => alarm.id === id ? normalizeAlarm(transform(alarm)) : alarm);
  if (!saveAlarms()) {
    state.alarms = previousAlarms;
    renderAlarms();
    return false;
  }
  renderAlarms();
  if (await syncNativeAlarms()) return true;
  state.alarms = previousAlarms;
  saveAlarms();
  renderAlarms();
  await syncNativeAlarms();
  return false;
}

async function deleteAlarm(id) {
  const previousAlarms = state.alarms;
  state.alarms = state.alarms.filter((alarm) => alarm.id !== id);
  if (!saveAlarms()) {
    state.alarms = previousAlarms;
    return false;
  }
  renderAlarms();
  if (!(await syncNativeAlarms())) {
    state.alarms = previousAlarms;
    saveAlarms();
    renderAlarms();
    await syncNativeAlarms();
    return false;
  }
  if (state.ringingAlarm?.id === id) dismissAlarm();
  announce(t("alarmDeleted"));
  return true;
}

function renderMonitoring() {
  $("#monitoring-toggle").checked = state.monitoring;
  $("#monitor-status").textContent = t(state.monitoring ? "alarmsActive" : "alarmsPaused");
  $("#status-indicator").classList.toggle("is-paused", !state.monitoring);
}

async function setMonitoring(enabled) {
  const previousMonitoring = state.monitoring;
  state.monitoring = enabled;
  try { localStorage.setItem(MONITORING_KEY, String(enabled)); }
  catch (error) {
    console.error("Could not persist monitoring state:", error);
    state.monitoring = previousMonitoring;
    renderMonitoring();
    announce(t("couldNotSave"));
    return;
  }
  if (!enabled && state.ringingAlarm) dismissAlarm();
  renderMonitoring();
  if (!(await syncNativeAlarms())) {
    state.monitoring = previousMonitoring;
    try { localStorage.setItem(MONITORING_KEY, String(previousMonitoring)); }
    catch (error) { console.error("Could not restore monitoring state:", error); }
    renderMonitoring();
    await syncNativeAlarms();
    return;
  }
  announceAlarmChange(enabled ? "monitoringResumed" : "monitoringPaused");
}

function checkWebAlarms(now) {
  if (state.native) return;
  if (!state.monitoring || state.ringingAlarm) return;
  if (state.snoozeUntil && now.getTime() >= state.snoozeUntil.at) {
    const alarm = state.alarms.find((item) => item.id === state.snoozeUntil.alarmId);
    state.snoozeUntil = null;
    startRinging(alarm || { id: "snooze", time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}` }, true);
    return;
  }
  if (state.snoozeUntil) return;
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const date = localDateString(now);
  const due = state.alarms.find((alarm) =>
    alarm.enabled && alarm.time === currentTime && nextOccurrence({ ...alarm, lastTriggeredDate: "" }, new Date(now.getTime() - 60000))
      && alarm.lastTriggeredDate !== date
  );
  if (!due) return;
  if (due.repeat === "once") updateAlarm(due.id, (alarm) => ({ ...alarm, enabled: false, lastTriggeredDate: date }));
  else updateAlarm(due.id, (alarm) => ({ ...alarm, lastTriggeredDate: date }));
  startRinging(due, false);
}

function startRinging(alarm, isSnooze = false) {
  if (state.ringingAlarm?.id === alarm.id) return;
  state.ringingAlarm = alarm;
  $("#ringing-title").textContent = formatTime(alarm.time);
  $("#ringing-label").textContent = alarm.label || t(isSnooze ? "snooze" : "defaultTimeLabel");
  $("#ringing-overlay").hidden = false;
  if (!state.native) {
    startBrowserSound(alarm);
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        const notification = new Notification(t("alarmNotificationTitle"), {
          body: t("alarmNotificationBody", {
            label: alarm.label || t("defaultTimeLabel"),
            time: formatTime(alarm.time),
          }),
          tag: `alram-${alarm.id}`,
          requireInteraction: true,
        });
        notification.onclick = () => {
          window.focus();
          navigate("alarms");
          notification.close();
        };
      } catch (error) {
        console.error("Browser alarm notification could not be shown:", error);
      }
    }
  }
}

function dismissAlarm() {
  if (!state.ringingAlarm) return;
  if (state.native) {
    state.native.dismiss().then(finishDismiss).catch((error) => {
      console.error("Native alarm could not be dismissed:", error);
      announce(t("dismissFailed"));
    });
    return;
  }
  finishDismiss();
}

function finishDismiss() {
  state.ringingAlarm = null;
  state.snoozeUntil = null;
  $("#ringing-overlay").hidden = true;
  stopBrowserSound();
  announce(t("alarmDismissed"));
}

function snoozeAlarm() {
  const alarm = state.ringingAlarm;
  if (!alarm) return;
  const minutes = SNOOZE_OPTIONS.includes(alarm.snoozeMinutes) ? alarm.snoozeMinutes : state.settings.defaultSnooze;
  if (state.native) {
    state.native.snooze({ minutes }).then(() => finishSnooze(alarm, minutes)).catch((error) => {
      console.error("Native alarm could not be snoozed:", error);
      announce(t("snoozeFailed"));
    });
    return;
  }
  state.snoozeUntil = { at: Date.now() + minutes * 60000, alarmId: alarm.id };
  finishSnooze(alarm, minutes);
}

function finishSnooze(alarm, minutes) {
  state.ringingAlarm = null;
  $("#ringing-overlay").hidden = true;
  stopBrowserSound();
  announce(t("alarmSnoozed", { minutes }));
}

function startBrowserSound(alarm) {
  stopBrowserSound();
  if (alarm.vibrate && "vibrate" in navigator) navigator.vibrate([450, 250, 450, 250]);
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  state.audio ||= new AudioContextClass();
  state.audio.resume().then(() => {
    if (!state.ringingAlarm) return;
    playBrowserTone(alarm.volume / 100);
    state.audioTimer = window.setInterval(() => playBrowserTone(alarm.volume / 100), 1600);
  }).catch((error) => {
    console.error("Browser alarm audio could not start:", error);
  });
}

function playBrowserTone(volume) {
  if (!state.audio || state.audio.state !== "running" || volume <= 0) return;
  const start = state.audio.currentTime;
  [0, 0.32].forEach((offset) => {
    const oscillator = state.audio.createOscillator();
    const gain = state.audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, start + offset);
    gain.gain.setValueAtTime(.0001, start + offset);
    gain.gain.exponentialRampToValueAtTime(Math.max(.001, .16 * volume), start + offset + .025);
    gain.gain.exponentialRampToValueAtTime(.0001, start + offset + .24);
    oscillator.connect(gain);
    gain.connect(state.audio.destination);
    oscillator.start(start + offset);
    oscillator.stop(start + offset + .25);
  });
}

function stopBrowserSound() {
  window.clearInterval(state.audioTimer);
  state.audioTimer = null;
  if ("vibrate" in navigator) navigator.vibrate(0);
}

function handleNativeAlarmFired(payload) {
  if (!payload?.id) return;
  const alarm = state.alarms.find((item) => item.id === payload.id)
    || normalizeAlarm({ id: payload.id, time: payload.time || "07:00", enabled: true });
  if (payload.oneTimeFinished && alarm.enabled) {
    state.alarms = state.alarms.map((item) => item.id === alarm.id ? { ...item, enabled: false } : item);
    saveAlarms();
    renderAlarms();
    announce(t("onceFinished"));
  }
  startRinging(alarm, Boolean(payload.isSnooze));
}

function connectNativeAlarms() {
  if (!state.native || state.nativeListenersConnected) return;
  state.nativeListenersConnected = true;
  state.native.addListener("alarmFired", handleNativeAlarmFired).catch((error) => {
    console.error("Could not listen for native alarms:", error);
  });
  state.native.addListener("alarmEnded", ({ result }) => {
    const wasRinging = Boolean(state.ringingAlarm);
    state.ringingAlarm = null;
    $("#ringing-overlay").hidden = true;
    if (wasRinging && result === "dismissed") announce(t("alarmDismissed"));
  }).catch((error) => console.error("Could not listen for alarm completion:", error));
  state.native.getActiveAlarm().then((active) => { if (active.active) handleNativeAlarmFired(active); })
    .catch((error) => console.error("Could not load active native alarm:", error));
  state.native.getStatus().then((status) => {
    state.permissionStatus = status;
    renderPermissionStatus();
  }).catch((error) => console.error("Could not read Android alarm permissions:", error));
  state.native.getAlarms().then((result) => {
    if (result.initialized && Array.isArray(result.alarms)) {
      state.alarms = result.alarms.map(normalizeAlarm);
      try { localStorage.setItem(ALARMS_KEY, JSON.stringify(state.alarms)); }
      catch (error) { console.error("Could not reconcile locally stored alarms:", error); }
      renderAlarms();
    } else {
      syncNativeAlarms();
    }
  }).catch((error) => {
    console.error("Could not reconcile native alarm storage:", error);
    syncNativeAlarms();
  });
}

function navigate(view) {
  if (!["home", "alarms", "calendar", "sounds", "settings"].includes(view)) return;
  state.currentView = view;
  $$("[data-view]").forEach((section) => {
    const active = section.dataset.view === view;
    section.hidden = !active;
    section.classList.toggle("is-active", active);
  });
  $$(".nav-item").forEach((button) => {
    const active = button.dataset.nav === view;
    button.classList.toggle("is-current", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (view === "calendar") renderCalendar();
}

async function submitAlarm(event) {
  event.preventDefault();
  const errorNode = $("#form-error");
  errorNode.hidden = true;
  const id = $("#alarm-id").value;
  const time = $("#alarm-time").value;
  const repeat = $("#alarm-repeat").value;
  const date = $("#alarm-date").value || localDateString(new Date());
  const weekdays = $$('input[name="weekdays"]:checked').map((node) => Number(node.value));
  const nowDate = localDateString(new Date());
  if (!/^\d{2}:\d{2}$/.test(time)) return showFormError(t("invalidTime"));
  if (repeat === "once" && date < nowDate) return showFormError(t("invalidDate"));
  if (repeat === "once" && new Date(`${date}T${time}:00`) <= new Date()) return showFormError(t("invalidDate"));
  if (repeat === "weekdays" && weekdays.length === 0) return showFormError(t("chooseWeekday"));

  const existing = state.alarms.find((alarm) => alarm.id === id);
  const alarm = normalizeAlarm({
    ...(existing || {}),
    id: id || (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    time,
    label: $("#alarm-label").value.trim(),
    enabled: existing?.enabled ?? true,
    repeat,
    date,
    weekdays,
    ringtoneUri: $("#alarm-sound-uri").value,
    soundName: $("#alarm-sound-name").textContent || state.settings.defaultSoundName,
    volume: Number($("#alarm-volume").value),
    vibrate: $("#alarm-vibration").checked,
    snoozeMinutes: Number($("#alarm-snooze").value),
    lastTriggeredDate: "",
  });
  state.alarms = existing
    ? state.alarms.map((item) => item.id === id ? alarm : item)
    : [...state.alarms, alarm];
  if (!saveAlarms()) return;
  renderAlarms();
  if (!(await syncNativeAlarms())) {
    showFormError(t("nativeSyncError"));
    return;
  }
  closeAlarmEditor();
  announceAlarmChange(existing ? "alarmSaved" : "alarmCreated");
}

function showFormError(message) {
  const node = $("#form-error");
  node.textContent = message;
  node.hidden = false;
}

function setLanguage(language) {
  if (!["en", "ur", "ar", "hi"].includes(language)) return;
  state.settings.language = language;
  state.alarms = state.alarms.map((alarm) => ({
    ...alarm,
    language,
    displayTime: formatTime(alarm.time),
  }));
  saveAlarms();
  syncNativeAlarms();
  saveSettings();
}

function bindEvents() {
  $$(".nav-item").forEach((button) => button.addEventListener("click", () => navigate(button.dataset.nav)));
  $$("[data-view-link]").forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    navigate(link.dataset.viewLink);
  }));
  $("#add-alarm").addEventListener("click", () => openAlarmEditor());
  $("#home-add-alarm").addEventListener("click", () => { navigate("alarms"); openAlarmEditor(); });
  $("#empty-add-alarm").addEventListener("click", () => openAlarmEditor());
  $("#alarm-form").addEventListener("submit", submitAlarm);
  $("#cancel-alarm").addEventListener("click", closeAlarmEditor);
  $("#close-alarm-dialog").addEventListener("click", closeAlarmEditor);
  $("#alarm-repeat").addEventListener("change", updateRepeatFields);
  $("#alarm-volume").addEventListener("input", (event) => { $("#alarm-volume-output").value = `${event.target.value}%`; });
  $("#default-volume").addEventListener("input", (event) => {
    $("#default-volume-output").value = `${event.target.value}%`;
    state.settings.defaultVolume = Number(event.target.value);
    try { persistSettings(); }
    catch (error) { console.error("Could not save sound defaults:", error); announce(t("couldNotSave")); }
  });
  $("#default-vibration").addEventListener("change", (event) => {
    state.settings.defaultVibration = event.target.checked;
    try { persistSettings(); }
    catch (error) { console.error("Could not save vibration setting:", error); announce(t("couldNotSave")); }
  });
  $("#default-snooze").addEventListener("change", (event) => {
    state.settings.defaultSnooze = Number(event.target.value);
    saveSettings();
  });
  $("#hijri-adjustment").addEventListener("input", (event) => {
    state.settings.hijriAdjustment = Number(event.target.value);
    $("#hijri-adjustment-output").value = event.target.value > 0 ? `+${event.target.value}` : event.target.value;
    renderClock();
    renderCalendar();
    try { persistSettings(); }
    catch (error) { console.error("Could not persist Hijri adjustment:", error); announce(t("couldNotSave")); }
  });
  $("#time-format").addEventListener("change", (event) => {
    state.settings.timeFormat = event.target.value;
    state.alarms = state.alarms.map((alarm) => ({ ...alarm, displayTime: formatTime(alarm.time) }));
    saveAlarms();
    syncNativeAlarms();
    saveSettings();
  });
  $("#language-select").addEventListener("change", (event) => setLanguage(event.target.value));
  $("#settings-language").addEventListener("change", (event) => setLanguage(event.target.value));
  $("#theme-select").addEventListener("change", (event) => {
    state.settings.theme = event.target.value;
    saveSettings();
  });
  $("#quick-add-alarm").addEventListener("click", () => {
    navigate("alarms");
    openAlarmEditor();
  });
  $("#monitoring-toggle").addEventListener("change", (event) => setMonitoring(event.target.checked));
  $("#request-permissions").addEventListener("click", requestPermissions);
  $("#pick-default-sound").addEventListener("click", () => pickRingtone("default"));
  $("#pick-alarm-sound").addEventListener("click", () => pickRingtone("alarm"));
  $("#preview-sound").addEventListener("click", previewRingtone);
  $("#stop-preview").addEventListener("click", stopRingtonePreview);
  $("#month-previous").addEventListener("click", () => {
    state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1);
    renderCalendar();
  });
  $("#month-next").addEventListener("click", () => {
    state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1);
    renderCalendar();
  });
  $("#ringing-snooze").addEventListener("click", snoozeAlarm);
  $("#ringing-dismiss").addEventListener("click", dismissAlarm);
  $("#alarm-dialog").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeAlarmEditor();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      renderClock();
      if (state.native) {
        state.native.getStatus().then((status) => {
          state.permissionStatus = status;
          renderPermissionStatus();
        }).catch((error) => console.error("Could not refresh alarm permissions:", error));
        state.native.stopRingtonePreview().then(() => {
          $("#preview-sound").disabled = false;
          $("#stop-preview").disabled = true;
        }).catch((error) => console.error("Could not stop the Android ringtone preview:", error));
      }
    }
  });
}

applyLanguage();
applyTheme();
bindEvents();
renderClock();
renderAlarms();
renderCalendar();
renderSoundSettings();
renderMonitoring();
renderPermissionStatus();
navigate("home");
connectNativeAlarms();
window.matchMedia?.("(prefers-color-scheme: dark)")?.addEventListener?.("change", () => {
  if (state.settings.theme === "system") applyTheme();
});
window.setInterval(renderClock, 1000);
