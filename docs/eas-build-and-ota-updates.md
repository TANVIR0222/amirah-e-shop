# EAS Build & OTA Updates

This document covers how to build the app for different environments and how to push Over-the-Air (OTA) updates using EAS Update.

---

## Environment Overview

The project has **three environments**, each producing a separate app with its own name and bundle ID:

| Profile | `APP_ENV` | App Name | Bundle ID | OTA Channel |
|---|---|---|---|---|
| `development` | `development` | Expo Starter (Dev) | `...kit.dev` | `development` |
| `preview` | `staging` | Expo Starter (Staging) | `...kit.staging` | `preview` |
| `production` | `production` | Expo Router Starter Kit | `...kit` | `production` |

> **Key rule:** OTA updates only reach the app that was built for the **same channel**. A `preview` update will NOT appear in the `development` app.

---

## Part 1 — EAS Build

### Prerequisites

Make sure you are logged in to EAS:

```sh
eas login
```

---

### Build 1: Development Build

Used for local development with Expo Dev Client. OTA updates are **disabled** in this build.

```sh
# Android
eas build --profile development --platform android

# iOS
eas build --profile development --platform ios

# Both platforms
eas build --profile development --platform all
```

- **App name:** `Expo Starter (Dev)`
- **Bundle ID:** `com.tanvir.exporouterstarterkit.dev`
- **OTA:** ❌ Disabled (development builds always load from Metro)

---

### Build 2: Preview Build

Used for internal testing and QA. OTA updates are **enabled** on the `preview` channel.

```sh
# Android
eas build --profile preview --platform android

# iOS (simulator only — see eas.json)
eas build --profile preview --platform ios

# Both platforms
eas build --profile preview --platform all
```

- **App name:** `Expo Starter (Staging)`
- **Bundle ID:** `com.tanvir.exporouterstarterkit.staging`
- **OTA:** ✅ Enabled — listens to `preview` channel
- **OTA check:** `ON_ERROR_RECOVERY` (checks only when a crash is detected)

---

### Build 3: Production Build

Used for App Store / Play Store releases. Version code auto-increments on every build.

```sh
# Android
eas build --profile production --platform android

# iOS
eas build --profile production --platform ios

# Both platforms
eas build --profile production --platform all
```

- **App name:** `Expo Router Starter Kit`
- **Bundle ID:** `com.tanvir.exporouterstarterkit`
- **OTA:** ✅ Enabled — listens to `production` channel
- **OTA check:** `ON_LOAD` (checks for update every time the app opens)

---

### Installing a Build on a Device/Emulator

After the build completes, install on a connected Android emulator:

```sh
# Uninstall previous version first (to avoid version downgrade errors)
adb -s emulator-5554 uninstall <bundle-id>

# Example for preview build
adb -s emulator-5554 uninstall com.tanvir.exporouterstarterkit.staging
```

Then run the app again via Expo or install the downloaded APK directly.

---

## Part 2 — OTA Updates (EAS Update)

OTA updates let you push **JavaScript/asset changes** to users without a new App Store / Play Store release.

> ⚠️ **Important:** OTA updates do **not** support native code changes (e.g., adding a new native module, modifying `AndroidManifest.xml`, changing `Info.plist`). Those require a full EAS build.

### How Runtime Version Works

This project uses `"policy": "appVersion"` for `runtimeVersion`:

```ts
// app.config.ts
runtimeVersion: {
  policy: "appVersion",  // runtime version = package.json "version" field
},
```

An OTA update is only delivered to devices where the **runtime version matches**. If you bump the `version` in `package.json` (e.g., `1.0.0` → `1.1.0`), you must do a new EAS build before pushing OTA updates for that version.

---

### Step 1 — Push an OTA Update to Preview

```sh
eas update --channel preview --message "your update message here"
```

**Example:**
```sh
eas update --channel preview --message "fix login button padding"
```

The command will:
1. Bundle JS for Android, iOS, and Web
2. Upload changed assets
3. Publish the update to the `preview` channel

---

### Step 2 — Push an OTA Update to Production

```sh
eas update --channel production --message "your update message here"
```

**Example:**
```sh
eas update --channel production --message "v1.2.0 - add dark mode toggle"
```

---

### Step 3 — Verify the Update Was Received

After pushing, the app will pick up the update based on its `checkAutomatically` setting:

| Channel | `checkAutomatically` | When update loads |
|---|---|---|
| `preview` | `ON_ERROR_RECOVERY` | After a crash/force-close |
| `production` | `ON_LOAD` | Every time the app opens |

To force-check immediately during testing, **close and reopen the app** (production) or **force-close after a simulated error** (preview).

You can also view all updates on the EAS dashboard:

```
https://expo.dev/accounts/yaxovex780/projects/expo-router-starter-kit/updates
```

---

## Full Workflow Example

Below is the complete end-to-end flow for releasing a new feature to preview testers:

```sh
# 1. Make your code changes, then commit
git add .
git commit -m "feat: add 3 card home section"

# 2. (First time only) Build the preview APK and install it on tester devices
eas build --profile preview --platform android

# 3. Push JS-only changes as an OTA update (no new build needed)
eas update --channel preview --message "add 3 card home section"

# 4. Testers close and reopen the app — they get the update automatically
```

---

## Common Errors & Fixes

### `INSTALL_FAILED_VERSION_DOWNGRADE`

The emulator has a newer version installed. Uninstall first:

```sh
adb -s emulator-5554 uninstall com.tanvir.exporouterstarterkit.dev
```

### OTA update not appearing

Check the following:
1. The app was built with the **same channel** as the update (`preview` → `preview`).
2. The app's **runtime version** matches the update's runtime version (both use the same `version` from `package.json`).
3. For `preview` builds, OTA check is `ON_ERROR_RECOVERY` — force-close the app or wait for the next crash recovery cycle.
4. `development` builds **never** receive OTA updates (disabled by design).

### Wrong app name on device

Ensure `APP_ENV` is set in `eas.json` for each build profile. See `eas.json` → `build.<profile>.env.APP_ENV`.

---

## Part 3 — Custom OTA Update UI/UX Flow

To offer a premium, non-disruptive update experience, the app handles updates through a custom UI module instead of basic auto-reloads.

### Code Architecture (`src/features/updates/`)

The feature is fully self-contained under `src/features/updates`:

```
src/features/updates/
├── components/
│   ├── update-banner.tsx     # Animated slide-down top banner notifying of updates
│   ├── update-modal.tsx      # Bottom-sheet modal with detail/changelog + install action
│   └── update-progress.tsx   # Custom horizontal progress tracker with shimmer glow
├── hooks/
│   └── useOTAUpdate.ts       # React hook wrapper to consume updates state and controls
├── providers/
│   └── UpdateProvider.tsx    # Context provider managing the AppState listener & download state
├── services/
│   └── updates.service.ts    # Service layer wrapping expo-updates API calls
└── types/
    └── update.types.ts       # Shared TypeScript definitions (UpdateStatus, etc.)
```

### Lifecycle & Interaction

1. **Automatic Background Checking**:
   The `<UpdateProvider>` starts checking on mount and listens to `AppState` transitions. Whenever the app returns to the foreground (`active` state), it runs a background check.
2. **Subtle Notification**:
   If an update is found on the current channel, `UpdateBanner` slides down from the top using native driver animations without blocking user interaction.
3. **Download Confirmation**:
   Tapping the banner opens `UpdateModal`. The user is shown release information and can select "Install Now" or "Remind Me Later".
4. **Visual Progress Tracker**:
   When downloading, `UpdateProgress` animates a custom progress bar. Once completed (100%), a short delay is applied before invoking `Updates.reloadAsync()` to apply the changes.
5. **Composed globally**:
   The provider and components are composed in [app-providers.tsx](file:///Users/mdtanvirislam/Desktop/project/expo-project-setup/src/providers/app-providers.tsx) wrapping the app root layout.

---

## Part 4 — Automated Store Submission (App Store & Play Store)

The production workflow (`.eas/workflows/ota-update-production.yaml`) is configured to:

- **Native code changed** → Build new binary → **Auto-submit to App Store & Play Store**
- **Native code unchanged** → Skip build → **OTA update only**

Before the auto-submit jobs can run, you must configure credentials in `eas.json`.

---

### Android — Play Store Setup

#### Step 1: Create a Google Service Account

1. Go to [Google Play Console](https://play.google.com/console) → **Setup** → **API access**
2. Click **Link to a Google Cloud project** (or create new)
3. In Google Cloud Console → **IAM & Admin** → **Service Accounts** → **Create Service Account**
4. Grant the service account **Release Manager** role in Play Console
5. Create and download a **JSON key** for the service account

#### Step 2: Add the key file to your project

```sh
# Place the downloaded JSON file in the project root
mv ~/Downloads/your-key.json ./google-service-account.json

# IMPORTANT: add to .gitignore immediately
echo "google-service-account.json" >> .gitignore
```

#### Step 3: Configure `eas.json`

```json
"submit": {
  "production": {
    "android": {
      "serviceAccountKeyPath": "./google-service-account.json",
      "track": "production"
    }
  }
}
```

> **Tracks available:** `production` · `beta` · `alpha` · `internal`
> Use `"track": "internal"` for initial upload before promoting to production.

---

### iOS — App Store Setup

#### Step 1: Get your credentials

You need three values from your Apple Developer account:

| Value | Where to find it |
|---|---|
| `appleId` | Your Apple ID email address |
| `ascAppId` | [App Store Connect](https://appstoreconnect.apple.com) → Apps → Your App → **App Information** → Apple ID |
| `appleTeamId` | [developer.apple.com/account](https://developer.apple.com/account) → Membership → **Team ID** |

#### Step 2: Configure `eas.json`

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "you@example.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABCD123456"
    }
  }
}
```

> EAS will prompt for your Apple password or use an **App Store Connect API Key** if configured. API Key is recommended for CI/CD (no 2FA prompts).

---

### Full `eas.json` submit section (both platforms)

```json
"submit": {
  "production": {
    "android": {
      "serviceAccountKeyPath": "./google-service-account.json",
      "track": "production"
    },
    "ios": {
      "appleId": "you@example.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABCD123456"
    }
  }
}
```

---

### Automated Workflow Logic

The workflow in `.eas/workflows/ota-update-production.yaml` works like this:

```
push to expo-ota-update branch
          ↓
1. Fingerprint check
          ↓
2. Look for existing build (matching fingerprint)
     ┌────────────────────┬──────────────────────┐
     │ No match found ❌  │  Match found ✅       │
     ↓                   ↓
3. Build Android + iOS   OTA Update only
4. Submit to stores      (no store upload needed)
   Play Store 🤖
   App Store 🍎
```

> **Note:** `development` and `preview` builds are never submitted to stores — only `production` profile builds go through the submit step.
