# AURA — Official Design Specification

> **Source of Truth**: `design-reference/aura-ui-reference.png`  
> **Core Direction**: Clean, calm, and modern planner with a perfect balance of structure and clarity. Pastel accents, soft shadows, rounded elements, and a spacious layout.

---

## 1. Design Principles & Aesthetics
- **Visual Personality**: Premium, calm, modern, structured, and airy productivity dashboard.
- **Aesthetic Tone**: Soft pastel accents paired with sharp, high-legibility typography, subtle card borders, crisp micro-shadows, and high contrast between container elements.
- **Theme Modes**: Native Light Mode and Dark Mode support with identical element hierarchy.

---

## 2. Layout & Page Architecture
- **Structure**: 2-Column Application Shell consisting of a persistent dark left sidebar and a wide main content workspace.
- **Canvas Padding**: Outer margins `24px` to `32px` around content views.
- **Responsive Behavior**:
  - *Desktop (>1200px)*: Full 240px-260px sidebar + 4-column metric grid + 60/40 2-column dashboard layout.
  - *Tablet (768px - 1199px)*: Sidebar collapses or converts to icon rail / toggle drawer; stat cards stack into 2-column layout; dashboard columns reflow vertically.
  - *Mobile (<768px)*: Single column layout with full-width card stacking and off-canvas sidebar overlay.

---

## 3. Sidebar Navigation
- **Dimensions**: `240px` - `260px` fixed width; full screen height (`100vh`).
- **Background**: Dark slate charcoal `#111827` (Dark mode: `#0B0F17`).
- **Brand Header**:
  - **Logo Text**: `AURA` in bold geometric white (`#FFFFFF`).
  - **Brand Mark**: 4-point sparkle / star icon in electric indigo (`#6356F1`).
- **Navigation Groups**:
  - **Main Menu**: `My Day`, `Schedule`, `Tasks`, `Goals`, `Habits`, `Journal`, `Notes`, `Insights`.
  - **Secondary Menu**: `Focus Mode`, `Integrations`, `Settings`.
- **Item States**:
  - **Active Nav Item**: Glowing rounded pill background in Primary Indigo (`#6356F1`), bright white icon & text (`#FFFFFF`).
  - **Inactive Nav Item**: Neutral light gray text (`#9CA3AF`), 1.75px stroke outline icon, hover background `#1F2937`.
- **Bottom User Profile Widget**:
  - Border-top subtle separator line `#1F2937`.
  - Includes user avatar image (circle), Name (`Muthu S`), subtitle (`View Profile`), and right dropdown chevron icon.

---

## 4. Header & Top Bar Navigation
- **Left Greetings & Status**:
  - Primary Title: `Good morning, Muthu! 👋` (`Poppins` Semi-Bold, `22px` - `24px`, `#111827`).
  - Subtitle: `Here's your plan for today. Stay focused and make it count.` (`Inter` Regular, `14px`, `#6B7280`).
- **Right Utility Controls**:
  - **Search Input**: Full-pill input box with left search lens icon (`#9CA3AF`), placeholder text `"Search anything..."`, white background (`#FFFFFF`), border `#E5E7EB`.
  - **Notification Bell**: Rounded square icon button containing outline bell icon with notification alert badge.

---

## 5. Typography System
- **Font Families**:
  - **Headings & Titles**: `Poppins`, sans-serif (Clean geometric sans-serif).
  - **Body & Controls**: `Inter`, sans-serif (High legibility UI font).
- **Type Hierarchy & Weights**:
  - **Hero Greeting / Page Title**: `24px` | `Poppins` | Semi-Bold (600)
  - **Section / Card Headers**: `16px` - `18px` | `Poppins` | Semi-Bold (600)
  - **Stat Metrics**: `24px` - `32px` | `Poppins` | Bold (700)
  - **Body Text**: `14px` | `Inter` | Regular (400) / Medium (500)
  - **Subtext & Dates**: `12px` - `13px` | `Inter` | Regular (400) | Color `#6B7280`
  - **Pills, Badges & Buttons**: `12px` - `14px` | `Inter` | Medium (500) / Semi-Bold (600)

---

## 6. Color System

### Primary & Accent Palette
- **Primary**: `#6356F1` (Vibrant Indigo / Purple)
- **Secondary**: `#10B981` (Emerald Green)
- **Accent**: `#F59E0B` (Warm Amber / Gold)
- **Info**: `#3B82F6` (Sky / Royal Blue)
- **Pink Accent**: `#EC4899` (Magenta Pink)

### Neutral Base Colors (Light Mode)
- **App Background**: `#F7F8FA`
- **Surface / Cards**: `#FFFFFF`
- **Subtle Borders**: `#E5E7EB`
- **Text Primary**: `#111827`
- **Text Muted**: `#6B7280`

### Pastel Container & Pill Fills
- **Purple Soft Fill**: `#EEF2FF`
- **Green Soft Fill**: `#ECFDF5`
- **Amber Soft Fill**: `#FFFBEB`
- **Blue Soft Fill**: `#EFF6FF`
- **Pink Soft Fill**: `#FDF2F8`

---

## 7. Cards, Grid & Elevation

### Card Specifications
- **Background**: `#FFFFFF` (Dark Mode: `#1E293B` or `#1F2937`).
- **Border**: `1px` solid `#E5E7EB` (Dark Mode: `#374151`).
- **Corner Radius**: `16px` (`1rem`).
- **Internal Padding**: `20px` - `24px`.
- **Shadow**: `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)`.

### Grid System
- **Top Summary Grid**: 4 equal-width columns.
- **Main View Grid**: 2 columns split (~60% left timeline schedule, ~40% right stacked priorities & habit progress).

---

## 8. Spacing & Border Radius System
- **Spacing Scale**: `4px` | `8px` | `12px` | `16px` | `20px` | `24px` | `32px` | `48px` | `64px`.
- **Border Radii**:
  - **Cards & Modals**: `16px` (`1rem`)
  - **Buttons & Text Inputs**: `10px` - `12px` (`0.625rem` - `0.75rem`)
  - **Tag Badges & Filters**: `9999px` (Pill format)
  - **Checkboxes**: `50%` (Circular radio style)

---

## 9. Button & Icon Specifications
- **Primary Action Button**:
  - Fill: `#6356F1` (Primary Indigo)
  - Text: `#FFFFFF`
  - Radius: `10px` - `12px`
  - Includes leading `+` icon (`+ Add Task`, `+ Add Habit`, `+ Add Goal`, `+ New Note`, `Save Entry`).
- **Secondary Button**:
  - Fill: `#FFFFFF`
  - Border: `1px solid #E5E7EB`
  - Text: `#374151`
- **Icon Actions**:
  - Outline icons with `1.75px - 2px` stroke weight.
  - Sizing: `18px` for list items, `24px` for stat card pastel badges.

---

## 10. Core Module Specifications

### A. Dashboard Overview (My Day)
- **4 Stat Summary Cards**:
  1. *Tasks*: `8` (5 remaining) — Purple pastel icon badge (`#EEF2FF`).
  2. *Habits*: `4/6` (On track) — Green pastel icon badge (`#ECFDF5`).
  3. *Goals*: `72%` (Progress) — Amber pastel icon badge (`#FFFBEB`).
  4. *Focus Time*: `2h 15m` (Today) — Blue pastel icon badge (`#EFF6FF`).
- **Today's Schedule Card**: Vertical time axis (`8 AM` to `7 PM`), header with `Today` / date switcher, color-coded time blocks (UI/UX Design - Yellow, College Lecture - Blue, Lunch Break - Green, Project Work - Pink, Gym Workout - Purple).
- **Top Priorities Card**: Checklist items with circular radio checkboxes, date labels (`Today`, `Tomorrow`), and category badges (`Work`, `Study`, `Career`).
- **Habit Progress Card**: Header with `View all` link, habit items, streak labels, and 5-dot weekly progress indicators.

### B. Tasks UI
- **Filter Tabs**: `All`, `Today`, `Upcoming`, `Completed`.
- **Task Row Layout**: Circular check box, Task title, date tag, category tag badge (`Work`, `Study`, `Personal`, `Career`), priority badge (`High` pink badge).
- **Completed State**: Blue circular checkmark, strikethrough text on task title, opacity reduction.
- **Action**: Primary button `+ Add Task`.

### C. Habits UI
- **Filters**: Header selector dropdown (e.g. `This Week`).
- **Progress Rows**: Habit title (`Exercise`, `Reading`, `Meditation`, `No Sugar`), completion ratio (`4/7 days`), streak count (`3 day streak`).
- **Weekly Indicator**: 5 to 7 rounded dots. Solid green `#10B981` dots indicate completed target days; hollow ring dots represent pending days.
- **Action**: Primary button `+ Add Habit`.

### D. Goals UI
- **Filters**: Header dropdown `All Goals`.
- **Goal Row**: Title ("Crack Placement", "Build 3 Projects", "Learn UI/UX Design"), Target deadline subtext (`Target: Dec 31, 2025`), percentage metric (`72%`, `55%`, `80%`), and colorful horizontal progress bar.
- **Action**: Primary button `+ Add Goal`.

### E. Journal UI
- **Header**: Date indicator `May 16, 2025` + calendar button.
- **Editor Area**: Textarea titled `Today's Thoughts`.
- **Toolbar**: Bottom left rich action icons (bookmark, image upload, link, list) + bottom right primary button `Save Entry`.

### F. Notes UI
- **Grid Layout**: Stacked card list.
- **Note Item**: Amber document icon, note title ("UI Design Ideas", "Python Concepts", "Project Requirements", "Book Summary"), date subtext.
- **Action**: Primary button `+ New Note`.

### G. Insights UI
- **Filters**: `This Week` selector.
- **Chart Card**: `Tasks Completed 12` (+20% vs last week badge), smooth line chart with gradient blue area fill.
- **Metric Cards**: Focus Time (`14.5h`), Habit Score (`85%`), Productivity (`72%`).

### H. Calendar UI
- **Controls**: View dropdown (`Week`), date range navigation (`<` `>`, `May 12 - May 18, 2025`).
- **Grid**: Days of week columns (`Mon 12` - `Sun 18`), 1-hour time row grid (`8 AM` - `6 PM`), soft pastel scheduled block cards.

### I. Focus Mode UI
- **Container**: Dark charcoal card (`#111827`).
- **Controls**: Session name (`Deep Work`) with pencil edit icon, large bold digital timer (`25:00`), `+ Start` blue pill button.
- **Footer**: `Today's Focus: 2h 15m` with animated frequency/audio waveform graph.

### J. Settings UI
- **Navigation Tabs**: `General` (Active), `Appearance`, `Notifications`, `Data & Backup`, `Privacy`, `Integrations`, `About`.
- **Appearance Settings**:
  - Theme mode options: `Light`, `Dark`, `System` pill radio toggles.
  - Accent Color Palette: 8 round color swatches.
  - Font Size selector: `Small`, `Medium`, `Large` pill toggles.
- **Action**: Primary button `Save Changes`.

### K. Dark Mode System
- **App Background**: `#0B0F17` / `#111827`
- **Card Background**: `#1E293B` / `#1F2937`
- **Card Borders**: `#374151`
- **Text Primary**: `#F9FAFB`
- **Text Muted**: `#9CA3AF`
- **Stat Cards & Badges**: Dark translucent container fills with high-contrast glowing text & icons for maximum legibility.
