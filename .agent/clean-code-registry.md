# Clean Code Refactoring - File Registry

**Total Files**: 136  
**Completed**: 19  
**Remaining**: 117  
**Last Updated**: 2026-01-30

---

## How to Use This Registry

1. Each file has a unique number (1-136)
2. Status Icons:
   - ⬜ = Not Started (available for assignment)
   - 🔄 = In Progress (currently being worked on)
   - ✅ = Complete (refactoring finished)
3. Agents automatically claim the next ⬜ file
4. Agent marks file as 🔄 immediately when starting
5. Agent marks file as ✅ when complete

---

## Convex Backend Files (21 files)

### Generated Files (Skip - Auto-generated)

- **File 001** ⬜ `convex/_generated/api.d.ts`
- **File 002** ⬜ `convex/_generated/dataModel.d.ts`
- **File 003** ⬜ `convex/_generated/server.d.ts`

### Core Config

- **File 004** ✅ `convex/auth.config.ts`
- **File 005** ✅ `convex/convexTypes.ts`
- **File 006** ✅ `convex/schema.ts`

### HTTP & Routes

- **File 007** ✅ `convex/http.ts`

### Helper Functions

- **File 008** ✅ `convex/helper/convexHelperFunctions.ts`
- **File 009** ✅ `convex/helper/images.ts`

### Email Templates

- **File 010** ✅ `convex/emails/templates/WelcomeEmail.tsx`
- **File 011** ✅ `convex/emails/templates/marketplace/ReceiptEmail.tsx`
- **File 012** ✅ `convex/emails/templates/userNotificationEmail.tsx`
- **File 013** ✅ `convex/emails/userEmails.ts`

### Stripe Integration

- **File 014** ✅ `convex/stripe/billing.ts`
- **File 015** ✅ `convex/stripe/plans.ts`
- **File 016** ✅ `convex/stripe/stripeActions.ts`

### User Functions

- **File 017** ✅ `convex/userFunctions/clerk.ts`
- **File 018** ✅ `convex/userFunctions/memberships.ts`
- **File 019** ✅ `convex/userFunctions/organizationLimits.ts`
- **File 020** ✅ `convex/userFunctions/organizations.ts`
- **File 021** ✅ `convex/userFunctions/users.ts`

---

## Frontend Source Files (115 files)

### App Root

- **File 022** ✅ `src/app/layout.tsx`
- **File 023** ✅ `src/app/global-error.tsx`
- **File 024** ✅ `src/app/not-found.tsx`

### Landing Page Components

- **File 025** ✅ `src/app/[locale]/(landing)/animated-list-custom.tsx`
- **File 026** ✅ `src/app/[locale]/(landing)/call-to-action.tsx`
- **File 027** ✅ `src/app/[locale]/(landing)/cpu-architecture.tsx`
- **File 028** ⬜ `src/app/[locale]/(landing)/faqs.tsx`
- **File 029** ⬜ `src/app/[locale]/(landing)/features-one.tsx`
- **File 030** ⬜ `src/app/[locale]/(landing)/footer.tsx`
- **File 031** ⬜ `src/app/[locale]/(landing)/header.tsx`
- **File 032** ⬜ `src/app/[locale]/(landing)/hero-section.tsx`
- **File 033** ⬜ `src/app/[locale]/(landing)/page.tsx`
- **File 034** ⬜ `src/app/[locale]/(landing)/table.tsx`
- **File 035** ⬜ `src/app/[locale]/(landing)/testimonials.tsx`

### Old/Archived Landing

- **File 036** ⬜ `src/app/[locale]/old/animated-list-custom.tsx`
- **File 037** ⬜ `src/app/[locale]/old/call-to-action.tsx`
- **File 038** ⬜ `src/app/[locale]/old/cpu-architecture.tsx`
- **File 039** ⬜ `src/app/[locale]/old/faqs.tsx`
- **File 040** ⬜ `src/app/[locale]/old/features-one.tsx`
- **File 041** ⬜ `src/app/[locale]/old/footer.tsx`
- **File 042** ⬜ `src/app/[locale]/old/header.tsx`
- **File 043** ⬜ `src/app/[locale]/old/hero-section.tsx`
- **File 044** ⬜ `src/app/[locale]/old/page.tsx`
- **File 045** ⬜ `src/app/[locale]/old/table.tsx`
- **File 046** ⬜ `src/app/[locale]/old/testimonials.tsx`

### Dashboard Components

- **File 047** ⬜ `src/app/[locale]/dashboard/app-sidebar.tsx`
- **File 048** ⬜ `src/app/[locale]/dashboard/chart-area-interactive.tsx`
- **File 049** ⬜ `src/app/[locale]/dashboard/data-table.tsx`
- **File 050** ⬜ `src/app/[locale]/dashboard/layout.tsx`
- **File 051** ⬜ `src/app/[locale]/dashboard/loading-bar.tsx`
- **File 052** ⬜ `src/app/[locale]/dashboard/nav-documents.tsx`
- **File 053** ⬜ `src/app/[locale]/dashboard/nav-main.tsx`
- **File 054** ⬜ `src/app/[locale]/dashboard/nav-secondary.tsx`
- **File 055** ⬜ `src/app/[locale]/dashboard/nav-user.tsx`
- **File 056** ⬜ `src/app/[locale]/dashboard/page.tsx`
- **File 057** ⬜ `src/app/[locale]/dashboard/payment-gated/page.tsx`
- **File 058** ⬜ `src/app/[locale]/dashboard/section-cards.tsx`
- **File 059** ⬜ `src/app/[locale]/dashboard/site-header.tsx`

### API Routes

- **File 060** ✅ `src/app/[locale]/api/arcjet/route.ts`
- **File 061** ⬜ `src/app/api/counter/route.ts`
- **File 062** ⬜ `src/app/api/send/route.ts`
- **File 063** ⬜ `src/app/api/test-error/route.ts`

### Actions

- **File 064** ⬜ `src/app/actions/email-actions/user-notification-email-action.ts`
- **File 065** ⬜ `src/app/actions/revalidate.ts`

### Test Pages

- **File 066** ✅ `src/app/test/page.tsx`
- **File 067** ⬜ `src/app/test/email/page.tsx`
- **File 068** ⬜ `src/app/test/redis/page.tsx`

### Feature Components

- **File 069** ⬜ `src/components/cta-section.tsx`
- **File 070** ⬜ `src/components/custom-clerk-pricing.tsx`
- **File 071** ⬜ `src/components/email-template.tsx`
- **File 072** ⬜ `src/components/features-section.tsx`
- **File 073** ⬜ `src/components/hero-section.tsx`
- **File 074** ⬜ `src/components/menu-section.tsx`
- **File 075** ⬜ `src/components/navigation.tsx`
- **File 076** ⬜ `src/components/process-section.tsx`
- **File 077** ⬜ `src/components/reviews-section.tsx`

### Shared Components

- **File 078** ⬜ `src/components/logo.tsx`
- **File 079** ⬜ `src/components/mode-toggle.tsx`
- **File 080** ⬜ `src/components/spotlight-card.tsx`

### Global UI Components

- **File 081** ⬜ `src/components/global-ui/category-header.tsx`
- **File 082** ⬜ `src/components/global-ui/feature-image-card.tsx`
- **File 083** ⬜ `src/components/global-ui/hero-section.tsx`
- **File 084** ⬜ `src/components/global-ui/review-card.tsx`
- **File 085** ⬜ `src/components/global-ui/section-badge.tsx`
- **File 086** ⬜ `src/components/global-ui/section-header.tsx`

### KokonutUI Components

- **File 087** ⬜ `src/components/kokonutui/attract-button.tsx`
- **File 088** ⬜ `src/components/kokonutui/dock.tsx`
- **File 089** ⬜ `src/components/kokonutui/phone.tsx`

### MagicUI Components

- **File 090** ⬜ `src/components/magicui/animated-list.tsx`
- **File 091** ⬜ `src/components/magicui/marquee.tsx`

### Motion Primitives

- **File 092** ⬜ `src/components/motion-primitives/animated-background.tsx`
- **File 093** ⬜ `src/components/motion-primitives/cursor.tsx`
- **File 094** ⬜ `src/components/motion-primitives/transition-panel.tsx`

### React Bits Components

- **File 095** ⬜ `src/components/react-bits/pixel-card.tsx`
- **File 096** ⬜ `src/components/react-bits/splash-cursor.tsx`
- **File 097** ⬜ `src/components/react-bits/text-cursor.tsx`

### Shadcn UI Components

- **File 098** ⬜ `src/components/ui/accordion.tsx`
- **File 099** ⬜ `src/components/ui/animated-group.tsx`
- **File 100** ⬜ `src/components/ui/badge.tsx`
- **File 101** ⬜ `src/components/ui/breadcrumb.tsx`
- **File 102** ⬜ `src/components/ui/button.tsx`
- **File 103** ⬜ `src/components/ui/card.tsx`
- **File 104** ⬜ `src/components/ui/chart.tsx`
- **File 105** ⬜ `src/components/ui/collapsible.tsx`
- **File 106** ⬜ `src/components/ui/dropdown-menu.tsx`
- **File 107** ⬜ `src/components/ui/input.tsx`
- **File 108** ⬜ `src/components/ui/label.tsx`
- **File 109** ⬜ `src/components/ui/select.tsx`
- **File 110** ⬜ `src/components/ui/separator.tsx`
- **File 111** ⬜ `src/components/ui/sheet.tsx`
- **File 112** ⬜ `src/components/ui/sidebar.tsx`
- **File 113** ⬜ `src/components/ui/skeleton.tsx`
- **File 114** ⬜ `src/components/ui/switch.tsx`
- **File 115** ⬜ `src/components/ui/table.tsx`
- **File 116** ⬜ `src/components/ui/text-effect.tsx`
- **File 117** ⬜ `src/components/ui/tooltip.tsx`

### Providers

- **File 118** ⬜ `src/providers/convex-provider.tsx`
- **File 119** ⬜ `src/providers/posthog-provider.tsx`
- **File 120** ⬜ `src/providers/theme-provider.tsx`

### Hooks

- **File 121** ⬜ `src/hooks/use-mobile.ts`

### Libs

- **File 122** ⬜ `src/libs/Arcjet.ts`
- **File 123** ⬜ `src/libs/Env.ts`
- **File 124** ⬜ `src/libs/I18n.ts`
- **File 125** ⬜ `src/libs/I18nRouting.ts`
- **File 126** ✅ `src/libs/posthog-server.ts`
- **File 127** ⬜ `src/libs/redis.ts`
- **File 128** ⬜ `src/libs/resend.ts`
- **File 129** ⬜ `src/libs/stripe.ts`

### Utils

- **File 130** ⬜ `src/utils/app-config.ts`
- **File 131** ⬜ `src/utils/constants.ts`
- **File 132** ⬜ `src/utils/plansData.ts`
- **File 133** ⬜ `src/utils/utils.ts`

### Middleware

- **File 134** ✅ `src/proxy.ts`

### Config Files

- **File 135** ⬜ `src/config/plansData.ts`
- **File 136** ⬜ `src/i18n/routing.ts`

---

## Progress Tracking

| Status         | Count | Percentage |
| -------------- | ----- | ---------- |
| ✅ Complete    | 19    | 14.0%      |
| 🔄 In Progress | 0     | 0.0%       |
| ⬜ Not Started | 117   | 86.0%      |

---

## Notes

- Files 001-003: Skip (auto-generated)
- Keep `console.error` for production error logging
- Remove `console.log`, `console.warn` debug statements
- Remove file header comments, obvious comments, TODOs
- Check function length, naming conventions, DRY, SRP
- Agents auto-select next ⬜ file and mark as 🔄
- Update to ✅ when complete

## Parallel Execution Workflow

1. **Agent starts**: Reads registry, finds first ⬜ file
2. **Marks 🔄**: Updates status immediately to claim file
3. **Refactors**: Applies all clean code principles
4. **Marks ✅**: Updates status when complete
5. **Next agent**: Picks up next ⬜ file automatically

**Safe to run 5-10 agents in parallel!**
