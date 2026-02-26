Founders on X — Engagement Intelligence Board
Role

Act as a World-Class Senior Product Designer and Lead Frontend Engineer.

You are building a high-signal engagement command center — not a marketing site.

This interface should feel like:

A private trading terminal

A mission control dashboard

A behavioral analytics instrument

Every row has purpose.
Every hover has feedback.
Every scroll has weight.

Eradicate all generic dashboard UI patterns.

Agent Flow — MUST FOLLOW

When this file is loaded into a fresh project:

Do NOT ask branding questions.
Do NOT generate marketing content.
Do NOT improvise extra sections.

Build the Founders on X MVP exactly as defined.

This is a product interface, not a landing page.

Identity Direction — FIXED
Identity Label

"Signal Terminal"

A precision interface for tracking social engagement behavior.

Emotional Tone

Serious

Clean

Slightly competitive

High-trust

Minimal decoration

Design System — Founders on X
Palette

Primary Background: #0E1116
Surface: #151A22
Surface Elevated: #1C222C
Border: #242C38
Text Primary: #E6EDF3
Text Secondary: #8B98A5
Accent: #4C8DFF
Positive: #3FB950
Warning: #F2C744
Danger: #F85149

No gradients.
No bright marketing colors.
No glassmorphism.

Typography

Headings: "Inter" (600–700 weight, tight tracking)
Body: "Inter" (400–500)
Data / Numbers / Labels: "JetBrains Mono"

Everything feels terminal-grade and deliberate.

Fixed Design System (NEVER CHANGE)

These rules apply globally.

Visual Texture

Implement a subtle global noise overlay using inline SVG <feTurbulence> at 0.04 opacity

All containers use rounded-2xl or rounded-3xl

Border opacity must be subtle (border-white/5 equivalent)

No sharp corners.
No flat boxes.
No heavy shadows.

Micro-Interactions

All clickable rows lift translateY(-2px) on hover

Buttons scale to 1.02

Toggle switches animate smoothly with cubic-bezier(0.25, 0.46, 0.45, 0.94)

Avatar hover reveals soft accent ring glow

No bouncy animations.
Everything feels controlled.

Animation Lifecycle

Use GSAP 3 with gsap.context() inside useEffect.

Defaults:

Entrance easing: power3.out

Stagger: 0.06

Duration: 0.6

Page load:

Top member bar fades in

Posts cascade upward

Leaderboard slides in subtly

No excessive motion.

Component Architecture (DO NOT CHANGE STRUCTURE)
A. NAVBAR — “Control Header”

Fixed top bar.

Height: 64px.

Left:

Founders on X logotype (text only)

Center:

Tab Switcher

"Today"

"All Posts"

Right:

Search input

Sort dropdown

Behavior:

Slightly transparent when at top

Solid surface on scroll

Bottom subtle border

No marketing links.
No CTA button.

B. TOP MEMBER STRIP — “Operator Grid”

Horizontal scrollable row directly below navbar.

Displays:

All member avatars

Alphabetically sorted

Each avatar:

Circular

Hover shows username tooltip

Subtle engagement count badge (global)

Scrollable with:

Horizontal drag

Scrollbar hidden

Soft fade mask at edges

This is not decorative.
This is the engagement roster.

C. MAIN TIMELINE — “Post Column”

Centered column.
Max width: 720px.
Vertical spacing consistent and tight.

Posts ordered:

Latest first (default)

Or based on selected sorting

D. POST CARD — “Engagement Unit”

Container:

Surface background

Rounded-3xl

Subtle border

No heavy shadow

Each card includes:

1. Header Row

Author avatar

Author username

Post date

Engagement count (monospace)

Right side:

External link icon (opens tweet in new tab)

2. Content

Full tweet text

Proper whitespace preservation

No truncation in MVP

3. Engagement Panel

This is the most important UI element.

Top:
Toggle switch:

[ Engaged ] | [ Missing ]

Default: Engaged

Engaged View

Row of avatars of members who replied.

Tight grid

Wrap if needed

Hover shows timestamp of engagement

Missing View

Row of avatars of members who have NOT engaged.

Slight desaturated look

Hover shows username

This is accountability visibility.
Design it with intention.

E. LEADERBOARD — “Performance Index”

Separate section below timeline OR dedicated route.

Two Tabs:

Global

Today

Each leaderboard row:

Left:

Rank number (monospace)

Avatar

Username

Right:

Engagement count (bold monospace)

Hover:

Slight lift

Subtle accent border glow

Sorting:
Descending by engagement count.

No charts.
No graphs.
Just clarity.

F. DASHBOARD — “Admin Console”

Route: /dashboard

Minimal.
Functional.
Precise.

Section 1 — Add Member

Input field:

Username (no @)

Button:
Fetch & Save

Below:
List of members

Each row:

Avatar

Username

Twitter ID (monospace)

Delete button

Deleting:
Removes user + all engagements.

Section 2 — Add Post

Input field:

Tweet ID

Button:
Fetch & Save

Below:
List of posts

Each row:

Tweet ID

Author

Engagement count

Refresh button

Delete button

Delete:
Removes post + engagements.

Refresh:
Re-fetch replies.
Insert new only.
No duplication.

Responsive Rules

Mobile:

Navbar condenses

Member strip scroll remains horizontal

Post cards stack full width

Engagement avatars wrap to grid

Leaderboard stacked vertically

Reduce padding.
Reduce font sizes.
Keep density high.

Technical Requirements (NEVER CHANGE)

Stack:

Next.js (App Router)

Tailwind CSS v3.4+

GSAP 3

Convex backend

Fonts loaded via <link> in layout

All API calls server-side

RapidAPI key stored in environment variables

No placeholder content

All engagement logic wired

Interaction Philosophy

This is not a social app.
This is not a feed.

It is:

A behavioral accountability engine.

Users should feel:

Slight pressure when in "Missing"

Competitive when viewing leaderboard

Clear understanding of participation

Every interface element reinforces:

Visibility.
Participation.
Measurement.

Build Sequence

Scaffold layout structure

Implement global design tokens

Build Navbar + Tabs + Sorting

Build Member Strip

Build Post Card + Engagement Toggle logic

Build Leaderboard (global + daily queries)

Build Dashboard (members + posts CRUD)

Wire GSAP entrance animations

Final polish: hover states, micro-lifts, border refinements

Execution Directive

Do not build a dashboard.

Build a Signal Terminal for engagement behavior.

Every surface intentional.
Every interaction weighted.
No generic SaaS patterns.
No decorative fluff.

Precision over decoration.
Clarity over complexity.
Accountability over aesthetics.
