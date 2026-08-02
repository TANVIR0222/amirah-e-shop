import type { ConfigContext, ExpoConfig } from "expo/config"

// ---------------------------------------------------------------------------
// Environment detection (build-time only — reads from .env which is gitignored)
// ---------------------------------------------------------------------------

type AppEnv = "development" | "staging" | "production"

const getAppEnv = (): AppEnv => {
  const envVal = process.env.APP_ENV ?? process.env.APP_VARIANT ?? "development"
  if (envVal === "preview") return "staging"
  if (envVal === "production" || envVal === "staging") return envVal
  return "development"
}

const APP_ENV = getAppEnv()

const IS_DEV = APP_ENV === "development"
const IS_PROD = APP_ENV === "production"

// ---------------------------------------------------------------------------
// Per-environment native identifiers
// ---------------------------------------------------------------------------

const APP_NAMES: Record<AppEnv, string> = {
  development: "amiraheshop (Dev)",
  staging: "amiraheshop (Staging)",
  production: "amiraheshop",
}

const BUNDLE_IDS: Record<AppEnv, string> = {
  development: "com.amiraheshop.shop.dev",
  staging: "com.amiraheshop.shop.staging",
  production: "com.amiraheshop.shop",
}

// ---------------------------------------------------------------------------
// Main config export
// Anything sensitive lives in .env (gitignored) and is read via process.env.
// The `extra` block only contains non-secret, runtime-safe values.
// ---------------------------------------------------------------------------

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  // ── Identity ──────────────────────────────────────────────────────────────
  name: APP_NAMES[APP_ENV],
  slug: "amiraheshop",
  version: "1.0.0",
  owner: "amiraheshops-team",

  // ── Appearance ────────────────────────────────────────────────────────────
  orientation: "portrait",
  icon: "./assets/app-icon/app-logo.png",
  scheme: "amiraheshop",
  userInterfaceStyle: "automatic",

  // ── iOS ───────────────────────────────────────────────────────────────────
  ios: {
    ...config.ios,
    bundleIdentifier: BUNDLE_IDS[APP_ENV],
    icon: "./assets/app-icon/app-logo.png",
    supportsTablet: false,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },

  // ── Android ───────────────────────────────────────────────────────────────
  android: {
    ...config.android,
    package: BUNDLE_IDS[APP_ENV],
    adaptiveIcon: {
      backgroundColor: "#F3F4F6",
      foregroundImage: "./assets/images/splash-icon.png",
      backgroundImage: "./assets/images/splash-icon.png",
      monochromeImage: "./assets/images/splash-icon.png",
    },
    predictiveBackGestureEnabled: false,
  },

  // ── OTA Updates ───────────────────────────────────────────────────────────
  updates: {
    enabled: !IS_DEV,
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/2c465609-cc31-483a-9d84-0d7cc9972149",
    checkAutomatically: IS_PROD ? "ON_LOAD" : "ON_ERROR_RECOVERY",
    requestHeaders: {
      "expo-channel-name": APP_ENV,
    },
  },

  runtimeVersion: {
    policy: "appVersion",
  },

  // ── Plugins ───────────────────────────────────────────────────────────────
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        image: "./assets/images/splash-icon.png",
        imageWidth: 120,
      },
    ],
    [
      "expo-localization",
      {
        supportedLocales: {
          ios: ["en", "es"],
          android: ["en", "es"],
        },
      },
    ],
    [
      "expo-build-properties",
      {
        ios: {
          deploymentTarget: "16.4",
        },
        android: {
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          buildToolsVersion: "36.0.0",
        },
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "The app accesses your photos to let you share them with your friends.",
        colors: {
          cropToolbarColor: "#000000",
        },
        dark: {
          colors: {
            cropToolbarColor: "#000000",
          },
        },
      },
    ],
  ],

  // ── Experiments ───────────────────────────────────────────────────────────
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },

  // ── Extra (runtime values → Constants.expoConfig.extra → src/config/env.ts)
  // ⚠️  Rule: NO secrets here. Everything in `extra` is visible in the JS bundle.
  //    API keys, tokens, passwords → server-side only.
  extra: {
    appEnvironment: APP_ENV,
    // All other runtime defaults live in src/config/app-env.ts
    // and are read by src/config/env.ts via Constants.expoConfig.extra
    eas: {
      projectId: "2c465609-cc31-483a-9d84-0d7cc9972149",
    },
  },
})
