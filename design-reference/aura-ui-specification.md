# AURA UI — Visual Design Specification

> **Reference File**: `design-reference/aura-ui-reference.png`  
> **Target Design System**: Clean, calm, modern productivity planner with pastel accents, soft shadows, rounded container cards, high-contrast typography, and a spacious grid layout.

---

### 1. Overall Page Structure
- **Layout Architecture**: 2-column web application layout with a persistent fixed-width left navigation sidebar and a flexible main workspace area.
- **Background Color**: 
  - *Light Mode*: `#F7F8FA` (Soft neutral cool gray/off-white)
  - *Dark Mode*: `#0B0F17` / `#111827` (Deep dark slate)
- **Main Canvas Padding**: `24px` to `32px` generous outer container padding.
- **Visual Aesthetic**: Glass-like modern card layout with subtle borders, pastel accent badges, clean geometric sans-serif typography, and subtle micro-shadows.

---

### 2. Sidebar Dimensions and Structure
- **Width**: `240px` - `260px` fixed width.
- **Background**: Dark charcoal / slate `#111827` (Provides crisp contrast against light content area).
- **Header / Brand**:
  - Logo Text: **AURA** in bold white (`#FFFFFF`).
  - Brand Mark: 4-point sparkle/star icon in vibrant gradient indigo (`#6356F1`).
- **Navigation Groups**:
  - **Main Navigation**: `My Day`, `Schedule`, `Tasks`, `Goals`, `Habits`, `Journal`, `Notes`, `Insights`.
  - **System Navigation**: `Focus Mode`, `Integrations`, `Settings`.
- **Item States**:
  - **Active State**: Glowing indigo pill container (`#6356F1`), crisp white text, and solid white icon.
  - **Inactive State**: Light gray text (`#9CA3AF`), single-line outline icon, with smooth hover transition (`#1F2937` background).
- **User Profile Footer**:
  - Positioned at sidebar bottom.
  - Contains user avatar image, Name (`Muthu S`), subtext (`View Profile`), and dropdown chevron indicator.

---

### 3. Top Navigation
- **Left Greeting Header**:
  - Primary Heading: `Good morning, Muthu! 👋` (Font: `Poppins` Semi-Bold, `22px` - `24px`, `#111827`).
  - Subtitle: `Here's your plan for today. Stay focused and make it count.` (Font: `Inter` Regular, `14px`, `#6B7280`).
- **Right Utilities**:
  - **Search Input**: Rounded pill input with left search lens icon (`#9CA3AF`), placeholder text `"Search anything..."`, background `#FFFFFF` with `#E5E7EB` border.
  - **Notification Button**: Rounded action button containing bell outline icon with subtle hover ring.

---

### 4. Dashboard Grid
- **Top Row (4 Overview Stat Cards)**:
  - Equal-width 4-column responsive grid gap `16px` - `20px`.
  - **Card 1 (Tasks)**: Number `8` | Subtext `"5 remaining"` | Purple pastel pill background (`#EEF2FF`) + Purple checkbook icon (`#6356F1`).
  - **Card 2 (Habits)**: Score `4/6` | Subtext `"On track"` | Green pastel pill background (`#ECFDF5`) + Emerald target icon (`#10B981`).
  - **Card 3 (Goals)**: Percentage `72%` | Subtext `"Progress"` | Amber pastel pill background (`#FFFBEB`) + Gold chart icon (`#F59E0B`).
  - **Card 4 (Focus Time)**: Time `2h 15m` | Subtext `"Today"` | Blue pastel pill background (`#EFF6FF`) + Blue clock icon (`#3B82F6`).
- **Middle Main Row (2-Column Asymmetric Grid ~60% / ~40%)**:
  - **Left Section (~60%)**: "Today's Schedule" timeline card with interactive date header (`Today`, `<` `>`, `May 16, 2025`).
  - **Right Section (~40%)**:
    1. **Top Priorities**: Checklist card with round radio indicators, priority badges, and target deadlines (`Today`, `Tomorrow`).
    2. **Habit Progress**: Habit streak list with `View all` action link and 5-dot weekly progress indicators.

---

### 5. Card Dimensions & Hierarchy
- **Card Surface**: `#FFFFFF` (Dark Mode: `#1E293B` or `#1F2937`).
- **Border**: `1px` solid `#E5E7EB` (Dark Mode: `#374151`).
- **Border Radius**: `16px` (`1rem`).
- **Internal Padding**: `20px` to `24px`.
- **Card Header Standard**: Flexbox row with Section Title (Semi-Bold `16px` - `18px`) on left, contextual action or filter dropdown on right.

---

### 6. Typography Hierarchy
- **Primary Font Families**:
  - **Headings**: `Poppins`, sans-serif (Geometric, warm, modern).
  - **Body / Interface**: `Inter`, sans-serif (Highly legible, crisp).
- **Scale**:
  - **Page Greeting Title**: `24px` | `Poppins` Semi-Bold | Weight 600
  - **Card Section Titles**: `16px` - `18px` | `Poppins` Semi-Bold | Weight 600
  - **Stat Metrics**: `24px` - `28px` | `Poppins` Bold | Weight 700
  - **Body Text**: `14px` | `Inter` Regular/Medium | Weight 400/500
  - **Captions & Muted Labels**: `12px` - `13px` | `Inter` Regular | Color `#6B7280`
  - **Badges & Button Labels**: `12px` - `14px` | `Inter` Medium/Semi-Bold | Weight 500/600

---

### 7. Color System
- **Primary Color**: `#6356F1` (Indigo / Electric Purple)
- **Secondary / Success**: `#10B981` (Emerald Green)
- **Accent / Warning**: `#F59E0B` (Warm Amber / Gold)
- **Info**: `#3B82F6` (Sky Blue)
- **Pink Accent**: `#EC4899` (Magenta Pink)
- **App Background**: `#F7F8FA`
- **Card Surface**: `#FFFFFF`
- **Card Border**: `#E5E7EB`
- **Text Primary**: `#111827`
- **Text Muted**: `#6B7280`
- **Pastel Badge & Pill Fills**:
  - Purple Pill: `#EEF2FF`
  - Green Pill: `#ECFDF5`
  - Amber Pill: `#FFFBEB`
  - Blue Pill: `#EFF6FF`
  - Pink Pill: `#FDF2F8`

---

### 8. Spacing System
- **Base Grid**: `4px` | `8px` | `12px` | `16px` | `20px` | `24px` | `32px` | `48px` | `64px`.
- **Card Gaps**: `16px` - `24px`.
- **List Item Spacing**: `8px` - `12px` gap between stacked task or habit rows.

---

### 9. Border Radius
- **Cards & Modals**: `16px` (`1rem`)
- **Buttons & Text Inputs**: `10px` - `12px` (`0.625rem` - `0.75rem`)
- **Pill Badges & Tag Labels**: `9999px` (Full rounded capsules)
- **Checkbox Indicators**: `50%` (Circular radio check buttons)

---

### 10. Shadows
- **Card Shadow (Default)**: `0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)`
- **Hover Elevation**: `0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)`
- **Primary Button Glow**: `0 4px 12px rgba(99, 86, 241, 0.25)`

---

### 11. Buttons
- **Primary Button**: Solid Purple/Indigo `#6356F1`, white text, rounded radius `10px-12px`, padding `10px 18px`. Includes leading `+` icon for primary creation actions (`+ Add Task`, `+ Add Habit`, `+ Add Goal`, `+ New Note`, `Save Entry`).
- **Secondary Button**: Background `#FFFFFF`, solid border `#E5E7EB`, text `#374151`, rounded `10px`.
- **Icon Buttons**: Square/rounded mini buttons (`<` `>`, calendar, edit, 3-dots options), border `#E5E7EB`, text `#6B7280`.

---

### 12. Icons
- **Icon Set**: Clean, minimalist single-stroke outline icons (Lucide / Feather icon style).
- **Stroke Width**: `1.75px` - `2px`.
- **Size**: `18px` for action items & list icons; `24px` inside stat card pastel badges.

---

### 13. Task Components
- **Task List View**:
  - Filter Tabs: `All`, `Today`, `Upcoming`, `Completed` with active underline/pill tab.
  - Task Row: Circular checkbox indicator, Task title, date tag (`Today`, `Tomorrow`, `May 18`), category pill (`Work` - pink/amber, `Study` - yellow, `Personal` - green, `Career` - purple), priority badge (`High` - pink badge).
  - Completed State: Blue filled circular checkmark, strikethrough title text, muted color opacity.

---

### 14. Habit Components
- **Habit Progress Tracking**:
  - Habit Row: Icon + Habit title (`Exercise`, `Reading`, `Meditation`, `No Sugar`), frequency subtext (`4/7 days`, `3 day streak`).
  - Weekly Progress Dots: Horizontal tracker with 5 to 7 rounded indicator dots. Filled dots in vibrant green `#10B981` indicate completed target days; hollow ring dots represent pending days.

---

### 15. Goal Components
- **Goal Cards / Module**:
  - Goal Title: e.g. "Crack Placement", "Build 3 Projects", "Learn UI/UX Design".
  - Subtitle / Deadline: e.g. `Target: Dec 31, 2025`.
  - Percentage: Bold metric on right (`72%`, `55%`, `80%`).
  - Progress Bar: Rounded gray track `#F3F4F6`, progress indicator bar with distinct accent color (Amber, Blue, Green).

---

### 16. Journal Components
- **Daily Journal Module**:
  - Header: Date selector `May 16, 2025` + calendar icon.
  - Editor Box: Textarea titled `Today's Thoughts`.
  - Action Bar: Bottom left media/formatting action icons (bookmark, photo, link, list), bottom right primary button `Save Entry`.

---

### 17. Notes Components
- **Notes Module**:
  - Note Items: Card items with amber document icon, Note Title ("UI Design Ideas", "Python Concepts", "Project Requirements", "Book Summary - Atomic Habits"), subtext date (`May 16, 2025`).
  - Action Button: Bottom primary button `+ New Note`.

---

### 18. Insights Components
- **Analytics & Graphs**:
  - Top Metric: Tasks Completed `12` (+20% vs last week badge).
  - Graph: Smooth vector line chart with blue gradient fill.
  - Bottom Stat Cards:
    1. Focus Time: `14.5h` (+2.5h)
    2. Habit Score: `85%` (Great job!)
    3. Productivity: `72%` (Keep going!)

---

### 19. Calendar
- **Calendar (Week View)**:
  - Header Controls: `<` `>`, Date range `May 12 - May 18, 2025`, View Selector dropdown (`Week`).
  - Time Axis: Vertical hour labels (`8 AM` - `6 PM`).
  - Day Columns: `Mon 12` through `Sun 18`.
  - Scheduled Blocks: Soft pastel-colored rounded event chips (Blue for Lecture, Yellow for Study/Design, Green for Lunch/Meetings, Pink for Project Work, Purple for Gym Workout).

---

### 20. Focus Mode
- **Focus Timer Module**:
  - Dark Theme Card (`#111827`).
  - Session Tag: `Deep Work` with pencil edit icon.
  - Timer Display: Large hero readout `25:00` in white bold numbers.
  - Control Button: `+ Start` solid blue pill button.
  - Real-time Audio/Frequency Waveform graphic below timer readout alongside `"Today's Focus: 2h 15m"`.

---

### 21. Settings
- **Settings Panel**:
  - Left Nav Tabs: `General` (Active), `Appearance`, `Notifications`, `Data & Backup`, `Privacy`, `Integrations`, `About`.
  - Controls:
    - **Appearance**: Segmented radio pills (`Light`, `Dark`, `System`).
    - **Accent Color**: 8 round color swatches (Indigo, Green, Amber, Blue, Pink, Teal, Purple, Red).
    - **Font Size**: Radio pills (`Small`, `Medium`, `Large`).
  - Footer Action: Primary button `Save Changes`.

---

### 22. Dark Mode
- **Dark Mode Palette**:
  - Main Background: `#0B0F17` / `#111827`
  - Card Containers: `#1E293B` / `#1F2937`
  - Container Borders: `#374151`
  - Primary Text: `#F9FAFB`
  - Secondary / Muted Text: `#9CA3AF`
  - Stat Cards & Pills: Dark transparent fills with neon pastel text & icons for optimal contrast.
