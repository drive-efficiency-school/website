# Efficiver — www.efficiver.com

The public marketing + support site for Efficiver. Built on Shadcn-Vue + Vue 3 +
TypeScript + Tailwind (originally scaffolded from the shadcn-vue landing-page
template, since heavily diverged).

## Claim accuracy

Customer-facing copy on this site is held to the app source, not to marketing
intent. The e2e suite encodes those claims as assertions — see `e2e/09` through
`e2e/22` — so a claim that stops being true fails the build. Two rules learned
the hard way and worth keeping:

- **Absence assertions need a mount barrier.** Route views are lazy
  (`defineAsyncComponent`), so reading `body.textContent()` straight after
  `goto` can assert against an empty page and PASS for the wrong reason.
- **No `\b` anchors against `textContent`.** Adjacent element text concatenates
  with no separator ("Fuel & CO₂ SavingsQuantify..."), so `/\bquantify\b/`
  never matches.

## Sections

- [x] Navbar
- [x] Sidebar(mobile)
- [x] Hero
- [x] Sponsors
- [x] Benefits
- [x] Features
- [x] Services
- [x] HowItWorks
- [x] Testimonials
- [x] Pricing
- [x] Frequently Asked Questions(FAQ)
- [x] Team
- [x] Community
- [x] Contact
- [x] Footer

## Features

- [x] Fully Responsive Design
- [x] User Friendly Navigation
- [x] Dark Mode
- [x] Meta tags
- [x] Contact Form Integration (email-fullstack API)
- [x] Newsletter Subscription (email-fullstack API)

## API Integration

This website integrates with the Efficiency School email backend API for:

### Contact Form

- **Endpoint**: `POST https://email.efficiency.school/api/v1/contact`
- **Features**: Full contact form with validation, email notifications
- **Source**: Automatically set to "efficiver.com"

### Newsletter Subscription

- **Endpoint**: `POST https://email.efficiency.school/api/v1/subscribers/subscribe`
- **Features**: Email subscription with preferences, duplicate handling
- **Source**: Automatically set to "efficiver.com"

## Testing API Integration

### Test Contact Form

```bash
curl -X POST https://email.efficiency.school/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "API Test",
    "message": "Testing contact form integration",
    "source": "efficiver.com"
  }'
```

### Test Newsletter Subscription

```bash
curl -X POST https://email.efficiency.school/api/v1/subscribers/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "subscriber@example.com",
    "name": "Test Subscriber",
    "preferences": ["technology", "business"],
    "source": "efficiver.com"
  }'
```

## Deployment

### Building for Production

```bash
npm run build
```

This will create a `dist/` directory with optimized production files.

### Uploading to Server

Use the provided deployment scripts to deploy to the appropriate environment:

**Development Deployment:**

```bash
./deploy-dev.sh
```

**Production Deployment:**

```bash
./deploy-prod.sh
```

**What the scripts do:**

- Builds the project (if needed)
- Cleans unwanted files locally and remotely
- Uploads all files to the respective environment
- Uses SSH key authentication for secure transfer
- Provides clear feedback on deployment status

**Server Details:**

- **Host**: `app03.digidhamu.com`
- **User**: `dhamukrish`
- **Dev Path**: `/home/dhamukrish/digidhamu/efficiver.com/www-dev`
- **Prod Path**: `/home/dhamukrish/digidhamu/efficiver.com/www`
- **Protocol**: rsync over SSH with sudo

**Prerequisites:**

- SSH key configured for passwordless authentication
- Access to the server via SSH with sudo privileges

## How to install

1. Clone this repositoy:

```bash
git clone https://github.com/leoMirandaa/shadcn-vue-landing-page.git
```

2. Go into project

```bash
cd shadcn-vue-landing-page
```

3. Install dependencies

```bash
npm install
```

4. Run project

```bash
npm run dev
```
