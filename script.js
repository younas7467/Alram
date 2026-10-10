"use strict";

const STORAGE_KEY = "alram.alarms.v1";
const MONITORING_KEY = "alram.monitoring.v1";
const SNOOZE_DURATION = 5 * 60 * 1000;

const clockTime = document.querySelector("#clock-time");
const clockDate = document.querySelector("#clock-date");
const alarmForm = document.querySelector("#alarm-form");
const alarmTimeInput = document.querySelector("#alarm-time");
const alarmList = document.querySelector("#alarm-list");
const emptyState = document.querySelector("#empty-state");
const alarmCount = document.querySelector("#alarm-count");
const nextTime = document.querySelector("#next-time");
const nextCaption = document.querySelector("#next-caption");
const startMonitoringButton = document.querySelector("#start-monitoring");
const stopMonitoringButton = document.querySelector("#stop-monitoring");
const monitorStatus = document.querySelector("#monitor-status");
const statusDot = document.querySelector("#status-dot");
const ringingPanel = document.querySelector("#ringing-panel");
const ringingTime = document.querySelector("#ringing-time");
const snoozeButton = document.querySelector("#snooze-button");
const stopButton = document.querySelector("#stop-button");
const notificationsButton = document.querySelector("#notifications-button");
const notificationsLabel = document.querySelector("#notifications-label");
const announcement = document.querySelector("#announcement");
const nativeAlarm = window.Capacitor?.getPlatform?.() === "android"
  ? window.Capacitor.registerPlugin("NativeAlarm")
  : null;

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const clockFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

let alarms = loadAlarms();
let monitoring = localStorage.getItem(MONITORING_KEY) !== "false";
let ringingAlarm = null;
let snoozeUntil = null;
let audioContext = null;
let soundTimer = null;

function loadAlarms() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new TypeError("Saved alarms must be a list.");
    return parsed.filter((alarm) =>
      alarm &&
      typeof alarm.id === "string" &&
      typeof alarm.time === "string" &&
      /^\d{2}:\d{2}$/.test(alarm.time) &&
      typeof alarm.enabled === "boolean"
    );
  } catch (error) {
    console.error("Could not read saved alarms:", error);
    announcement.textContent = "Saved alarms could not be loaded.";
    return [];
  }
}

function saveAlarms() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  syncNativeAlarms();
}

function formatAlarmTime(value) {
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return timeFormatter.format(date);
}

function renderAlarms() {
  alarmList.replaceChildren();
  emptyState.hidden = alarms.length > 0;
  alarmCount.textContent = String(alarms.length);

  const sortedAlarms = [...alarms].sort((first, second) =>
    first.time.localeCompare(second.time)
  );

  sortedAlarms.forEach((alarm) => {
    const row = document.createElement("div");
    row.className = `alarm-row${alarm.enabled ? "" : " is-disabled"}`;

    const details = document.createElement("div");
    details.className = "alarm-details";

    const bell = document.createElement("span");
    bell.className = "alarm-bell";
    bell.setAttribute("aria-hidden", "true");
    bell.textContent = "◷";

    const info = document.createElement("div");
    info.className = "alarm-info";

    const time = document.createElement("span");
    time.className = "alarm-time";
    time.textContent = formatAlarmTime(alarm.time);

    const caption = document.createElement("span");
    caption.className = "alarm-caption";
    caption.textContent = alarm.enabled ? "Every day" : "Off";

    info.append(time, caption);
    details.append(bell, info);

    const actions = document.createElement("div");
    actions.className = "alarm-actions";

    const toggleLabel = document.createElement("label");
    toggleLabel.className = "switch";
    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.checked = alarm.enabled;
    toggle.setAttribute("aria-label", `${alarm.enabled ? "Turn off" : "Turn on"} ${time.textContent} alarm`);
    toggle.addEventListener("change", () => {
      updateAlarm(alarm.id, (item) => ({ ...item, enabled: toggle.checked }));
    });
    const toggleTrack = document.createElement("span");
    toggleTrack.className = "switch-track";
    toggleTrack.setAttribute("aria-hidden", "true");
    toggleLabel.append(toggle, toggleTrack);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Delete ${time.textContent} alarm`);
    deleteButton.addEventListener("click", () => deleteAlarm(alarm.id));

    actions.append(toggleLabel, deleteButton);
    row.append(details, actions);
    alarmList.append(row);
  });

  renderNextAlarm();
}

function renderNextAlarm() {
  const now = new Date();
  const enabled = alarms.filter((alarm) => alarm.enabled);
  if (enabled.length === 0) {
    nextTime.textContent = "—:—";
    nextCaption.textContent = alarms.length ? "All alarms are turned off." : "Add an alarm to see what’s next.";
    return;
  }

  const upcoming = enabled
    .map((alarm) => {
      const [hours, minutes] = alarm.time.split(":").map(Number);
      const next = new Date(now);
      next.setHours(hours, minutes, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      return { alarm, next };
    })
    .sort((first, second) => first.next - second.next)[0];

  const daysAway = Math.floor((startOfDay(upcoming.next) - startOfDay(now)) / 86400000);
  const caption = daysAway === 0 ? "Today" : daysAway === 1 ? "Tomorrow" : "Coming up";
  nextTime.textContent = formatAlarmTime(upcoming.alarm.time);
  nextCaption.textContent = `${caption} · ${upcoming.next.toLocaleDateString(undefined, { weekday: "long" })}`;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function updateClock() {
  const now = new Date();
  clockTime.textContent = clockFormatter.format(now);
  clockDate.textContent = dateFormatter.format(now);
  if (!nativeAlarm) checkAlarms(now);
}

function checkAlarms(now) {
  if (!monitoring || ringingAlarm) return;

  if (snoozeUntil && now.getTime() >= snoozeUntil.timestamp) {
    const alarm = alarms.find((item) => item.id === snoozeUntil.alarmId);
    snoozeUntil = null;
    beginRinging(alarm || { time: timeFormatter.format(now), id: "snooze" }, true);
    return;
  }

  if (snoozeUntil) return;

  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const dueAlarm = alarms.find((alarm) =>
    alarm.enabled &&
    alarm.time === currentTime &&
    alarm.lastTriggeredDate !== today
  );

  if (!dueAlarm) return;

  updateAlarm(dueAlarm.id, (alarm) => ({ ...alarm, lastTriggeredDate: today }));
  beginRinging(dueAlarm, false);
}

function beginRinging(alarm, isSnooze) {
  if (ringingAlarm?.id === alarm.id) return;
  ringingAlarm = alarm;
  ringingPanel.hidden = false;
  ringingTime.textContent = isSnooze ? "Snooze is over" : `Alarm · ${formatAlarmTime(alarm.time)}`;
  announcement.textContent = isSnooze ? "Your snooze is over." : `Alarm ringing for ${formatAlarmTime(alarm.time)}.`;
  if (nativeAlarm) return;
  startSound();
  showNotification(isSnooze ? "Snooze is over" : "Alarm", isSnooze ? "Time to get up." : `Your ${formatAlarmTime(alarm.time)} alarm is ringing.`);
}

function stopRinging(message, dismissNative = true) {
  if (!ringingAlarm) return;
  if (nativeAlarm && dismissNative) {
    nativeAlarm.dismiss().catch((error) => {
      console.error("Native alarm could not be dismissed:", error);
      announcement.textContent = "The alarm could not be dismissed. Try again.";
    });
  }
  ringingAlarm = null;
  snoozeUntil = null;
  ringingPanel.hidden = true;
  stopSound();
  announcement.textContent = message;
}

function snoozeAlarm() {
  if (!ringingAlarm) return;
  if (nativeAlarm) {
    nativeAlarm.snooze().catch((error) => {
      console.error("Native alarm could not be snoozed:", error);
      announcement.textContent = "The alarm could not be snoozed. Try again.";
    });
  } else {
    snoozeUntil = { timestamp: Date.now() + SNOOZE_DURATION, alarmId: ringingAlarm.id };
  }
  ringingAlarm = null;
  ringingPanel.hidden = true;
  stopSound();
  announcement.textContent = "Alarm snoozed for 5 minutes.";
}

function updateAlarm(id, transform) {
  alarms = alarms.map((alarm) => alarm.id === id ? transform(alarm) : alarm);
  saveAlarms();
  renderAlarms();
}

function deleteAlarm(id) {
  const deletedAlarm = alarms.find((alarm) => alarm.id === id);
  alarms = alarms.filter((alarm) => alarm.id !== id);
  if (snoozeUntil?.alarmId === id) snoozeUntil = null;
  if (ringingAlarm?.id === id) stopRinging("Alarm deleted.");
  saveAlarms();
  renderAlarms();
  announcement.textContent = deletedAlarm ? `${formatAlarmTime(deletedAlarm.time)} alarm deleted.` : "Alarm deleted.";
}

function updateMonitoringState() {
  startMonitoringButton.hidden = monitoring;
  stopMonitoringButton.hidden = !monitoring;
  monitorStatus.textContent = monitoring ? "Alarms are active" : "Alarms are paused";
  monitorStatus.classList.toggle("is-paused", !monitoring);
  statusDot.classList.toggle("is-paused", !monitoring);
}

function startSound() {
  stopSound();
  if ("vibrate" in navigator) navigator.vibrate([500, 250, 500, 250]);

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  audioContext ??= new AudioContextClass();
  audioContext.resume().then(() => {
    if (!ringingAlarm) return;
    playTone();
    soundTimer = window.setInterval(playTone, 1600);
  }).catch((error) => {
    console.error("Alarm audio could not start:", error);
    announcement.textContent = "Alarm is ringing, but audio could not start. Check your device sound settings.";
  });
}

async function unlockAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  audioContext ??= new AudioContextClass();
  if (audioContext.state === "suspended") await audioContext.resume();
}

function playTone() {
  if (!audioContext || audioContext.state !== "running") return;

  const start = audioContext.currentTime;
  [0, 0.32].forEach((offset) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, start + offset);
    gain.gain.setValueAtTime(0.0001, start + offset);
    gain.gain.exponentialRampToValueAtTime(0.16, start + offset + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.24);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(start + offset);
    oscillator.stop(start + offset + 0.25);
  });
}

function stopSound() {
  if (soundTimer !== null) {
    window.clearInterval(soundTimer);
    soundTimer = null;
  }
  if ("vibrate" in navigator) navigator.vibrate(0);
}

function updateNotificationLabel() {
  if (nativeAlarm) {
    notificationsLabel.textContent = "Enable alarm permissions";
    notificationsButton.disabled = false;
    return;
  }
  if (!("Notification" in window)) {
    notificationsLabel.textContent = "Notifications unavailable";
    notificationsButton.disabled = true;
    return;
  }
  notificationsLabel.textContent = Notification.permission === "granted"
    ? "Notifications enabled"
    : Notification.permission === "denied"
      ? "Notifications blocked"
      : "Enable notifications";
  notificationsButton.disabled = Notification.permission !== "default";
}

async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    updateNotificationLabel();
    return;
  }
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
  updateNotificationLabel();
}

function updateNativePermissionStatus(status) {
  if (!nativeAlarm || !status) return;
  if (status.exactAlarmAllowed && status.notificationsAllowed && status.fullScreenAllowed) {
    notificationsLabel.textContent = "Alarm permissions enabled";
  } else if (!status.notificationsAllowed) {
    notificationsLabel.textContent = "Enable alarm notifications";
  } else if (!status.exactAlarmAllowed) {
    notificationsLabel.textContent = "Allow exact alarms";
  } else {
    notificationsLabel.textContent = "Allow full-screen alarms";
  }
  const reliabilityNote = document.querySelector("#alarm-reliability-note");
  if (!reliabilityNote) return;
  if (!status.exactAlarmAllowed) {
    reliabilityNote.textContent = "Android exact-alarm access is off. Tap “Enable alarm permissions” and allow Alram to set alarms & reminders; without it Android may deliver alarms late.";
  } else if (!status.notificationsAllowed) {
    reliabilityNote.textContent = "Enable Alram notifications in Android settings to see the alarm controls on the lock screen.";
  } else if (!status.fullScreenAllowed) {
    reliabilityNote.textContent = "Allow Alram full-screen notifications in Android settings if you want the alarm screen to appear over the lock screen.";
  } else {
    reliabilityNote.textContent = "Android schedules alarms with its native alarm service. Battery restrictions and device-specific behavior can still affect delivery.";
  }
}

function syncNativeAlarms() {
  if (!nativeAlarm) return;
  nativeAlarm.setAlarms({ alarms, monitoring }).then((status) => {
    updateNativePermissionStatus({ ...status, notificationsAllowed: true, fullScreenAllowed: true });
    return nativeAlarm.getStatus();
  }).then(updateNativePermissionStatus).catch((error) => {
    console.error("Native alarms could not be scheduled:", error);
    announcement.textContent = "Native alarms could not be scheduled. Check alarm permissions and try again.";
  });
}

function handleNativeAlarmFired(payload) {
  if (!nativeAlarm || !payload?.id) return;
  const alarm = alarms.find((item) => item.id === payload.id) || {
    id: payload.id,
    time: /^\d{2}:\d{2}$/.test(payload.time) ? payload.time : timeFormatter.format(new Date()),
  };
  if (!payload.isSnooze && alarms.some((item) => item.id === payload.id)) {
    const today = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;
    if (alarm.lastTriggeredDate !== today) {
      updateAlarm(alarm.id, (item) => ({ ...item, lastTriggeredDate: today }));
    }
  }
  beginRinging(alarm, Boolean(payload.isSnooze));
}

function connectNativeAlarms() {
  if (!nativeAlarm) return;
  document.querySelector("#alarm-reliability-note").textContent =
    "Android schedules alarms natively. Grant alarm permissions for the best available delivery and lock-screen controls.";
  nativeAlarm.addListener("alarmFired", handleNativeAlarmFired).catch((error) => {
    console.error("Native alarm event listener could not be registered:", error);
  });
  nativeAlarm.addListener("alarmEnded", ({ result }) => {
    const message = result === "snoozed" ? "Alarm snoozed for 5 minutes." : "Alarm stopped.";
    stopRinging(message, false);
  }).catch((error) => {
    console.error("Native alarm completion listener could not be registered:", error);
  });
  nativeAlarm.getActiveAlarm().then((alarm) => {
    if (alarm.active) handleNativeAlarmFired(alarm);
  }).catch((error) => {
    console.error("Active native alarm state could not be read:", error);
  });
  nativeAlarm.getStatus().then(updateNativePermissionStatus).catch((error) => {
    console.error("Native alarm permissions could not be read:", error);
  });
  syncNativeAlarms();
}

function showNotification(title, body) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  try {
    const notification = new Notification(title, { body, tag: "alram-active-alarm" });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error("Alarm notification could not be displayed:", error);
    announcement.textContent = "Alarm is ringing, but the notification could not be displayed.";
  }
}

alarmForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!alarmTimeInput.value) return;

  const exists = alarms.some((alarm) => alarm.time === alarmTimeInput.value);
  if (exists) {
    announcement.textContent = "An alarm is already set for that time.";
    alarmTimeInput.focus();
    return;
  }

  alarms.push({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    time: alarmTimeInput.value,
    enabled: true,
    lastTriggeredDate: null,
  });
  alarms.sort((first, second) => first.time.localeCompare(second.time));
  saveAlarms();
  renderAlarms();
  announcement.textContent = `${formatAlarmTime(alarmTimeInput.value)} alarm added.`;
  alarmTimeInput.value = "";
});

startMonitoringButton.addEventListener("click", async () => {
  monitoring = true;
  localStorage.setItem(MONITORING_KEY, "true");
  updateMonitoringState();
  syncNativeAlarms();
  if (audioContext?.state === "suspended") await audioContext.resume();
  announcement.textContent = "Alarms started.";
});

stopMonitoringButton.addEventListener("click", () => {
  monitoring = false;
  localStorage.setItem(MONITORING_KEY, "false");
  stopRinging("Alarm monitoring paused.");
  updateMonitoringState();
  syncNativeAlarms();
  announcement.textContent = "Alarms paused.";
});

stopButton.addEventListener("click", () => stopRinging("Alarm stopped."));
snoozeButton.addEventListener("click", snoozeAlarm);
notificationsButton.addEventListener("click", () => {
  const permissionRequest = nativeAlarm
    ? nativeAlarm.requestPermissions().then(updateNativePermissionStatus)
    : requestNotificationPermission();
  permissionRequest.catch((error) => {
    console.error("Notification permission request failed:", error);
    announcement.textContent = "Could not request alarm permissions. Check Android settings and try again.";
  });
});
document.addEventListener("pointerdown", () => {
  unlockAudio().catch((error) => {
    console.error("Alarm audio could not be enabled:", error);
    announcement.textContent = "Alarm sound could not be enabled. Check your device sound settings.";
  });
}, { once: true });

renderAlarms();
updateMonitoringState();
updateNotificationLabel();
connectNativeAlarms();
updateClock();
window.setInterval(updateClock, 250);
