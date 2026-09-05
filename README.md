# Handoff: Schudme — mobile time planner & activity schedule (medical student)

## Overview
Schudme is a mobile time-planner for a clinical-years medical student. It opens on **progress, not the calendar**: the primary question is "am I hitting my study hours?", and the schedule is how that question gets answered. It covers five app screens plus notification surfaces, statistical illustrations of progress (daily hours bars, planned-vs-actual, goal rings, weekly summary numbers), and four kinds of notification.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that demonstrate intended look, layout and behavior. They are **not production code to copy**. The task is to **recreate these designs in the target codebase's existing environment** (React Native, Flutter, SwiftUI, Jetpack Compose, or a web stack) using that codebase's established components, navigation, theming and state patterns. If no codebase exists yet, pick the most appropriate framework for a cross-platform mobile app and implement the designs there.

Two important consequences:
- The HTML uses inline styles and a small custom runtime. Do not port the runtime; port the *design*.
- The device bezels (iPhone / Android frames) are presentation chrome only. They are not part of the product UI.

## Fidelity
**High fidelity.** Colors, typography, spacing, radii, shadows, chart geometry, copy and interaction behavior are all final-intent and should be matched closely. Two deliberate exceptions:
- **Photography is unfilled.** Three image slots are placeholders awaiting real photographs (see Assets).
- **Data is demo data.** All hours, streaks and deadlines are illustrative.

## Design Tokens

Derived from the "Modernist" design system, then softened (rounded corners, hairline rules, soft cards) at the client's request.

### Color
| Token | Value | Use |
| --- | --- | --- |
| ground | `#f1efee` | app background inside the phone |
| canvas ground | `#f3f2f2` | presentation canvas behind the phones |
| surface / card | `#ffffff` | every content card, the tab bar |
| ink | `#201e1d` | primary text, "actual" chart fills, solid Lecture blocks |
| accent (red) | `#ec3013` | primary action, now-line, today's bar, streak tail, one poster surface |
| accent-600 | `#dd2b0f` | primary hover |
| accent-700 | `#ae1800` | accent-colored small text (contrast-safe) |
| accent-100 | `#fff2ef` | Study block fill, hint banner fill |
| accent-500 | `#ff563c` | Study block border |
| accent-900 | `#4d170e` | text on Study fill |
| hairline | `rgba(32,30,29,0.10–0.11)` | row rules, section rules |
| soft border | `rgba(32,30,29,0.14–0.16)`, 1.5px | inputs, outlined controls, toggles |
| muted text | `rgba(32,30,29,0.55)` | captions, metadata |
| dim text | `rgba(32,30,29,0.58–0.68)` | secondary body copy |
| track | `rgba(32,30,29,0.10)` | progress-bar troughs |
| ring track | `rgba(32,30,29,0.18)` | goal-ring background stroke |
| dark lock-screen ground | `#0d0c0c` | Android lock screen behind the photo |

### Typography
Single family: **Archivo** (Google Fonts, weights 400 / 600 / 800). Headings and body both Archivo; weight 800 does all the emphasis work.

| Role | Size / line-height / weight | Notes |
| --- | --- | --- |
| Hero metric | 74px / 0.82 / 800, letter-spacing −0.04em | dashboard "3.5" |
| Poster metric (1c) | 148px / 0.78 / 800, letter-spacing −0.06em | red poster variant |
| Streak metric | 62px / 0.85 / 800, −0.04em | goals screen "12" |
| Screen title | 21–24px / 800 | "New activity", "Notifications" |
| Card title | 15px / 800 | "Hours per day" |
| Stat number | 30px / 1 / 800 | 2×2 summary tiles |
| Small stat number | 22px / 1 / 800 | profile tiles |
| Body | 13–14px / 1.4–1.55 / 400 | list rows, descriptions |
| Row title | 13–13.5px / 1.35 / 800 | schedule blocks, settings rows |
| Caption | 11–12px / 1.4 / 400 | metadata, subtitles |
| Eyebrow / label | 10px / 800, letter-spacing 0.12–0.22em, uppercase | "STUDY HOURS LOGGED TODAY", field labels |
| Tab label | 9px / 800, letter-spacing 0.09em, uppercase | bottom bar |
| Category tag | 8.5px / 800, letter-spacing 0.12em, uppercase | inside schedule blocks |

### Spacing
4px base. Card gutter 14px from screen edges; 10–12px vertical gap between cards; 18px card padding; 16px inner padding on tiles; 6–10px gaps in grids.

### Radius
| Value | Applied to |
| --- | --- |
| 24px | content cards, screen-section cards, Android notification cards |
| 26px (top only) | bottom tab bar (`26px 26px 0 0`) |
| 22px | Add tab button (circular-ish square) |
| 18–20px | stat tiles, schedule blocks, notification preview cards |
| 16px | hint banners, outlined groups, day chips |
| 14px | text inputs, category buttons |
| 999px (pill) | primary/secondary buttons, toggles, tags, progress bars, streak dots, segmented remind control |
| `10px 10px 0 0` | chart bars (top corners only) |
| round stroke caps | goal rings |

### Shadow
- Card: `0 1px 2px rgba(45,43,43,0.14)`
- Tab bar: `0 -2px 14px rgba(45,43,43,0.07)`
- Dragged schedule block: `0 12px 32px rgba(45,43,43,0.30)`
- In-app banner: `0 12px 32px rgba(45,43,43,0.34)`

## Screens / Views

Device canvas: 402 × 874 (iPhone) and 412 × 892 (Android). Content is a vertical stack: fixed header, scrolling body, fixed bottom tab bar (22px bottom padding to clear the home indicator).

---

### 1. App header (persistent, all tabs)
- Padding `62px 20px 14px` (top padding clears the status bar).
- Left: wordmark "SCHUDME", 11px/800, letter-spacing 0.22em, uppercase. Under it "Thursday 24 September · Week 6", 11.5px, muted, `white-space: nowrap`.
- Right: 44×44 circular button, 1.5px soft border, white fill, Lucide `bell` at 20px. Unread dot: 8px accent circle, top 6px / right 6px. Tapping it opens the Notifications screen.

---

### 2. Progress (default tab)
**Purpose:** answer "am I on track today / this week".

Cards, top to bottom:

1. **Hero card** — margin `14px 14px 0`, padding 18, radius 24, white, card shadow.
   - Eyebrow "STUDY HOURS LOGGED TODAY" in accent-700.
   - Metric row: hours-done at 74px/800 + "/ 8 h" at 20px/800 muted, baseline-aligned, 8px gap.
   - Progress bar: 14px tall pill, track `rgba(32,30,29,.10)`, fill accent, width = done/target, `transition: width .35s ease-out`.
   - Footer row, 11px muted, space-between, nowrap: "4.5 h to target" (or "Target met") / "7.8 h planned".
2. **Summary tiles** — 2×2 grid, 10px gap, margin `10px 14px 0`. Each tile: white, radius 18, padding `14px 16px`, card shadow. Number 30px/800; label 10.5px, letter-spacing 0.1em, uppercase, muted.
   - Hours this week · Planned vs actual (%) · Blocks completed ("2 / 6") · Current streak ("12 d", accent-700).
3. **Hours per day card** — title "Hours per day" (15px/800, nowrap) + legend (9.5px uppercase: hollow circle = PLANNED, filled circle = ACTUAL).
   - 7-column grid, 8px gap, bars bottom-aligned in a 112px-tall box.
   - Planned bar: full outline, 1.5px `rgba(32,30,29,.28)`, no bottom border, radius `10px 10px 0 0`, height = planned/9h × 112.
   - Actual bar: solid fill (ink; **accent for today**), same radius, height = actual/9h × 112, `animation: grow .5s ease-out` scaling from the bottom.
   - Day letters 9.5px/800 centered; today's letter in accent-700.
4. **Weekly subject goals card** — 3 columns. Each: 80×80 SVG ring (r=32, stroke-width 8, round caps, rotated −90°), track `rgba(32,30,29,.18)`, progress stroke accent (ink once ≥100%), center percentage 17px/800. Below: subject name 11px/800 and "6.5 / 8 h" 10.5px muted, nowrap.
   - Demo goals: Cardiology 6.5/8, Anatomy 4/6, Pharmacology 2.5/5.
5. **Photo card** — white, radius 24, overflow hidden, margin `10px 14px 26px`. 180px grayscale photograph (`filter: grayscale(1) contrast(1.08)`), then padding `12px 20px 18px`: "Clinical skills block · Ward 4" 14px/800 and a 12px muted line about the upcoming OSCE.

---

### 3. Today (schedule)
1. **Day strip** — 7 equal cells, 6px gap, padding `12px 14px 0`. Each cell: 56px min-height, radius 16, column-centered; day-of-week 9.5px uppercase (0.65 opacity) over date 16px/800. Selected: ink fill, `#f3f2f2` text. Tapping selects.
2. **Hint banner** — margin `10px 14px 0`, padding `12px 14px`, radius 16, fill accent-100, Lucide `menu`-style 2-line glyph in accent-700 + 11.5px accent-800 copy: "Drag a block to reschedule it — its reminder moves too."
3. **Time grid card** — white, radius 24, margin `10px 14px 26px`, padding `14px 14px 20px`, `position: relative`, height = 16 × rowHeight + 20.
   - Hour rows 06:00 → 22:00. rowHeight **62px** (46px in dense mode). Each row: 44px-wide time label (10px/800, 45% ink) + 1px hairline rule.
   - **Now line**: 8px accent dot + 2px accent rule + "NOW" 9.5px/800 accent, positioned at the current time (demo 12:50), `pointer-events: none`.
   - **Blocks**: absolutely positioned, `left: 54, right: 0`, `top = (startMinutes − 360)/60 × rowHeight`, `height = max(56, durationHours × rowHeight − 6)`, radius 18, overflow hidden, flex row.
     - Body (flex 1, padding `9px 10px`, `cursor: grab`, `touch-action: none`): tag pill + time range (10.5px, nowrap) / title 13.5px/800 / location 10.5px at 0.72 opacity. Title and location single-line with ellipsis.
     - Trailing 48px completion button, divided by a 2px inner border, tick = Lucide `check` at stroke-width 3. Completed: filled (ink, or 16% white on dark/accent blocks) with a light tick. Incomplete: transparent.
     - **Category treatments** — Lecture: ink fill, light text. Lab: `#f3f2f2` fill, 2px ink border. Clinical: accent fill, light text. Study: accent-100 fill, accent-500 border, accent-900 text.
     - **Incomplete blocks additionally carry a diagonal hatch**: `repeating-linear-gradient(135deg, transparent 0 9px, rgba(255,255,255,.14) 9px 18px)`.
   - Demo day: 08:00 Cardiology lecture (Lecture, 90m, done) · 10:00 Anatomy dissection (Lab, 120m, done) · 13:00 Ward round (Clinical, 60m) · 15:00 Pharmacology revision (Study, 90m) · 17:30 OSCE practice (Clinical, 60m) · 20:00 Path notes review (Study, 45m).

---

### 4. Add activity
Single white card, margin `14px 14px 28px`, padding 18, radius 24.
- Title "New activity" 24px/800; sub-line 12px muted: "It lands on Thursday 24 and counts toward your subject goals."; hairline rule.
- **Title** field: label 10px/800 uppercase 0.12em; input 46px min-height, 1.5px soft border, radius 14, white, 14px text, placeholder "e.g. Renal physiology revision", caret accent.
- **Category**: 2×2 grid of 44px buttons, radius 14, text flush left (12px left padding), 12.5px/800. Selected = ink fill + light text + ink border. Options: Study (default), Lecture, Lab, Clinical.
- **Starts**: native time input, same styling as the title field. Default 14:00.
- **Duration**: 46px stepper, radius 16, overflow hidden, white; 44px "−" and "+" cells split by hairlines; center shows "60 min" (15-minute steps, clamped 15–240).
- **Remind me before**: 3-way segmented control, 44px tall, pill ends (`999px 0 0 999px` / `0 999px 999px 0`), 1.5px soft borders. Selected = accent fill, light text. Options 5 / 10 (default) / 30 min.
- Hairline rule, then **primary button**: full width, 52px, pill, accent fill, light text, label flush left with 20px padding, "Add to schedule". Hover accent-600, active accent-700.
- **Secondary button**: 48px, pill, 1.5px border, "Cancel" — returns to Today.

---

### 5. Streaks & goals
1. **Streak card** — eyebrow "PLAN KEPT" accent-700; "12" at 62px/800 with "days running" 16px/800 muted; 14-column grid of 26px-tall dots, radius 9 — ink for kept days, accent for the most recent 3, and one outlined blank for the missed day; caption "Two weeks. One miss on the 10th — post-call day."
2. **Weekly hour targets card** — per subject: name 12.5px/800 with "6.5 / 8 h" muted on the right (nowrap); below, a 12px pill trough with a pill fill at done/goal — accent under 80%, ink at 80%+.
3. **Deadlines card** — hairline-separated rows: title 13px/800 (line-height 1.35), sub-line 11px muted, right-aligned countdown 15px/800 (accent-700 when under ~10 days). Demo: OSCE cardiovascular station 9 d · Pathology case write-up 16 d · Pharmacology in-course test 23 d.

---

### 6. Profile ("You")
- 168px grayscale photograph, margin `14px 14px 0`, radius 24, overflow hidden.
- **Identity card**: name 21px/800, "MB ChB Year 3 · Clinical rotations · KNUST" 12px muted, then two pill tags (accent tint "Cardiology block", neutral "Week 6 of 8"), radius 999, padding `4px 11px`.
- **Stat tiles**: 3 columns, 10px gap — 412 hours logged · 86% plan kept · 31 best streak. Number 22px/800, label 9.5px uppercase muted.
- **Settings card**: rows at 56px min-height, hairline separated, 19px Lucide icon + 14px/800 label + 11.5px muted value + `chevron-right` at 40% opacity. Rows: Notifications ("3 of 4 on", navigates) · Daily study target ("8 hours") · Timetable import ("Faculty calendar") · Export study log ("CSV").

---

### 7. Notifications (from the header bell or Profile)
- Header card: ghost back link "← PROFILE" (11px, uppercase, accent), title "Notifications" 21px/800, sub-line "Four jobs. Nothing else gets to interrupt a ward round."
- **Toggle rows** (white card): 64px min-height, hairline separated. Left: 13.5px/800 title + 11.5px muted description. Right: pill toggle 52×30, 1.5px soft border, 3px padding; off = transparent track with ink 20px knob at left; on = accent track with `#f3f2f2` knob at right; `transition: background .15s`. Toggling fires the in-app banner ("Pre-block reminders on.").
  1. *Before a block starts* — "10 minutes ahead, with the room" (on)
  2. *Off-schedule nudge* — "When a block runs 15 min past its slot" (on)
  3. *End-of-day recap* — "21:30 — hours, blocks kept, tomorrow's first" (on)
  4. *Weekly statistics digest* — "Sunday 18:00 — subject hours and trend" (off)
- **"What they look like" card** — four preview cards, radius 18, 10px apart, showing the three visual tiers:
  - Ink fill: "Ward round in 10 minutes" / "Ward 4 · consultant round · 60 min"
  - Accent fill (decision needed): "You are 15 minutes behind" / "Move OSCE practice to 18:00, or cut it to 45 min."
  - Outlined: "5.5 of 8 study hours today" / "4 of 6 blocks kept. Tomorrow starts 08:00, Cardiology."
  - Outlined: "Week 6: 31.5 h, up 2.5 h" / "Pharmacology is 2.5 h short of target."
  - Each carries an eyebrow "SCHUDME · 12:50" (9.5px/800, 0.12em, uppercase).
- Footer: secondary pill button "Send a test notification" → fires the in-app banner.

---

### 8. In-app banner (global)
Absolutely positioned `top: 58px, left/right: 12px`, z-index 60. Ink fill, light text, radius 20, padding `13px 16px`, 11px gap. Lucide `bell` 18px in accent-400, then eyebrow "SCHUDME · NOW" (10px/800, 0.12em, 0.6 opacity) over 13px message. Enter animation `bnr`: `translateY(-110%) → 0` with opacity 0 → 1 over 0.26s ease-out. Auto-dismisses after 3.6s (timer resets on each new banner).

---

### 9. Bottom tab bar
White, radius `26px 26px 0 0`, shadow `0 -2px 14px rgba(45,43,43,.07)`, 5 equal columns, 22px bottom padding, z-index 20.
- Each tab: 62px min-height, column layout, 21px Lucide icon over 9px/800 uppercase label.
- Active tab marker: 22 × 3.5px accent pill, 4px from the top, horizontally centered.
- **Add** tab is a filled accent button inside its cell: radius 22, margin `7px 8px`, light 24px `plus` icon at stroke-width 2.5.
- Tabs: Progress (`activity`) · Today (`calendar`) · Add (`plus`) · Goals (`target`) · You (`user`). The Notifications screen keeps "You" highlighted as its parent tab.

---

### 10. Android lock screen (notification parity)
412 × 892 dark frame. Full-bleed grayscale photograph behind a vertical scrim `linear-gradient(180deg, rgba(13,12,12,.72) 0%, rgba(13,12,12,.45) 42%, rgba(13,12,12,.86) 100%)`. Content padding `26px 20px 40px`, light text.
- Date 12px/800 uppercase 0.18em at 70% opacity; clock 84px/0.85/800, letter-spacing −0.05em.
- Notification stack pinned to the bottom, 10px gaps, radius 24 (outlined tier 22):
  1. White card: accent dot + "SCHUDME · NOW" eyebrow, "Ward round in 10 minutes" 14.5px/800, detail line, then two action pills — outlined "SNOOZE 10" and accent-filled "OPEN PLAN" (10.5px/800 uppercase, radius 999, padding `7px 14px`).
  2. Accent card: "Anatomy ran 25 min long" / "Shift the rest of the day back, or drop Path notes?"
  3. Outlined card (1.5px `rgba(243,242,242,.3)`): "6.5 of 8 study hours" / "Streak held — 12 days."
- Rule: **one red per notification stack** — only the item that needs a decision takes the accent field.

---

### 11. Poster dashboard (alternative Progress treatment)
Full-bleed accent (`#ec3013`) screen, light text, padding `62px 22px 34px`. Wordmark row + date, 2px light rule, eyebrow, "5.5" at 148px/800 with "/8" at 26px, 16px pill progress bar (light fill on 28% white track), two 11.5px stats, another rule, then the same 7-day planned/actual bars drawn in white (96px tall), and a bottom row pairing a 15px/800 statement ("Pharmacology is 2.5 h short of this week's target.") with an outlined pill "FIX THE PLAN".

## Interactions & Behavior
- **Tab navigation** — five destinations; the Notifications screen is a child of "You".
- **Complete a block** — tap the trailing tick column: toggles `done`, which immediately re-derives the hero metric, planned-vs-actual %, blocks-completed count, week total and Thursday's bar in the chart.
- **Drag to reschedule** — pointer-down on a block body starts a drag (`touch-action: none`, `cursor: grab`). Vertical delta converts to minutes via the row height and **snaps to 15-minute increments**; the block is clamped to 06:00 and 22:00 − duration. The dragged block gets z-index 6 and the drag shadow. On release, if the start changed, the banner reports "<title> moved to 16:00 — reminder set for 15:50." (i.e. the reminder moves with the block).
- **Add activity** — on submit: title defaults to "<Category> block" when blank; start is parsed from the time input and clamped to the grid; the activity is appended with `done: false` and location "Added just now"; the app navigates to Today and the banner confirms "<title> added at 14:00 — reminder 10 min before."
- **Notification toggles** — optimistic flip plus a banner naming the change.
- **Test notification** — fires the banner with a realistic pre-block reminder.
- **Banner lifecycle** — one at a time; a new message resets the 3.6s dismissal timer; cleared on unmount.
- **Chart entrance** — actual bars scale up from the bottom over 0.5s ease-out.
- **Focus** — 2px accent outline, 2px offset, on every interactive element (never the browser default).
- **Hover** — icon buttons and list rows take a ~5–7% ink tint; the primary button darkens to accent-600, active accent-700.

## State Management
Single screen-level store is sufficient:
- `screen`: `'progress' | 'today' | 'add' | 'goals' | 'profile' | 'notif'`
- `activities`: `{ id, title, place, cat: 'Lecture'|'Lab'|'Clinical'|'Study', start (minutes from midnight), dur (minutes), done }[]`
- `day`: selected day-of-week key (day strip)
- `dragId`: id of the block being dragged, or null
- `toggles`: `{ before, drift, recap, digest }` booleans
- `form`: `{ title, cat, start ('HH:MM'), dur, remind }`
- `banner`: message string or null (+ a dismissal timer ref)

**Derived, never stored:** hours done, hours planned, planned-vs-actual %, blocks completed, week total, hero bar width, per-goal ring fractions.

**Real-app data needs:** timetable import (faculty calendar / ICS), persistence of activities and completions, subject-goal definitions, local notification scheduling (reminder = block start − lead time; re-scheduled whenever a block moves), a background check for the off-schedule nudge, and cron-like local notifications for the 21:30 recap and Sunday 18:00 digest. Notification permission must be requested before the toggles can be honored.

## Assets
- **Icons** — Lucide (https://lucide.dev), stroke-width 2 (2.5 on the Add plus, 3 on the completion tick). Used: activity, calendar, plus, target, user, bell, clock, check, chevron-right, download, and a 2-line grip glyph for the drag hint.
- **Fonts** — Archivo 400/600/800 from Google Fonts.
- **Photography** — three placeholders, **not yet supplied**: the Progress "Clinical skills" panel (402×180), the Profile header (402×168), and the Android lock-screen wallpaper (full bleed). All are rendered grayscale (`filter: grayscale(1) contrast(1.08)`); the brief calls for stethoscope / clinical imagery. Supply real licensed photographs before build.
- No other raster or vector assets.

## Files
- `Schudme.dc.html` — the current design (softened, rounded). Contains all six app screens, the Android lock screen and the poster variant, plus the written brief and design notes on the canvas.
- `Schudme (grid).dc.html` — the earlier hard-edged Modernist version (0px radius, 2px rules). Reference only, superseded.
- `ios-frame.jsx`, `android-frame.jsx` — device bezel/status-bar chrome for presentation. **Do not port.**
- `image-slot.js` — the drag-and-drop photo placeholder used by the three image slots. **Do not port.**
- `_ds/modernist-.../styles.css` — the design-system token sheet the palette and type scale come from.

### Notes for implementation
- The design system's own rule is zero radius; the client explicitly asked for the softened, rounded treatment. **Follow the rounded values in this document**, not the base system.
- Type is Archivo at weight 800 for anything that carries hierarchy — do not substitute a lighter bold or another family.
- Keep red scarce: primary action, now-line, today's bar, streak tail, the single decision-needing notification, and the poster screen. Everything else is ink on the warm ground.
- Minimum touch target is 44px throughout; keep it.
