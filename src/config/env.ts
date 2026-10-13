/**
 * CareTrail Environment & Deployment Configuration Inspector
 *
 * Strict Configuration & Security Boundary Rules:
 * 1. SESSION_SECRET and DATABASE_URL are required for the server to run. Validated securely without printing values.
 * 2. DATABASE_POOL_MAX defaults to 5 when missing, while supporting explicit overrides.
 * 3. Storage is optional during setup. Displays "NOT_CONFIGURED" and never claims durable/permanent save.
 * 4. ABDM integration remains disabled until valid sandbox credentials and facility configuration exist.
 * 5. eHospital integration remains disabled until authorized client token and facility code exist.
 * 6. Missing optional integration credentials do not prevent the main application from starting.
 * 7. Never fabricates, hardcodes, or exposes credentials; no fake successful API responses for ABDM/eHospital.
 * 8. Configuration-status check reports only whether each integration is configured without leaking secrets.
 */

export interface DatabaseConfig {
  databaseUrl: string | null;
  isConfigured: boolean;
  poolMax: number;
  engine: 'postgresql';
  statusDescription: string;
}

export interface SessionConfig {
  isConfigured: boolean;
  algorithm: string;
  cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax';
    maxAgeSeconds: number;
  };
  generationMethodDoc: string;
}

export interface StorageConfig {
  provider: 'local' | 'gcs' | 's3' | 'none';
  bucket: string | null;
  region: string;
  isConfigured: boolean;
  isDurable: boolean;
  statusLabel: 'Not configured' | 'DURABLE_STORAGE';
  notice: string;
}

export interface AbdmGatewayConfig {
  isEnabled: boolean;
  clientIdConfigured: boolean;
  clientSecretConfigured: boolean;
  facilityConfigured: boolean;
  gatewayUrlConfigured: boolean;
  status: 'Not configured' | 'READY_FOR_SANDBOX';
  gatewayUrl: string;
  facilityId: string | null;
  missingRequirements: string[];
  notice: string;
}

export interface EhospitalConfig {
  isEnabled: boolean;
  clientTokenConfigured: boolean;
  facilityCodeConfigured: boolean;
  status: 'Not configured' | 'READY_FOR_INTEGRATION';
  facilityCode: string | null;
  missingRequirements: string[];
  notice: string;
}

export interface ConfigurationStatusReport {
  checkedAt: string;
  isServerReady: boolean;
  requiredVariables: {
    SESSION_SECRET: {
      isConfigured: boolean;
      status: 'CONFIGURED' | 'MISSING_REQUIRED';
      purpose: string;
    };
    DATABASE_URL: {
      isConfigured: boolean;
      status: 'CONFIGURED' | 'MISSING_REQUIRED';
      purpose: string;
    };
  };
  optionalIntegrations: {
    databasePool: {
      poolMax: number;
      isDefault: boolean;
      purpose: string;
      status: 'ACTIVE';
    };
    documentStorage: {
      isConfigured: boolean;
      status: 'CONFIGURED' | 'Not configured';
      provider: string | null;
      isDurable: boolean;
      notice: string;
    };
    abdmGateway: {
      isConfigured: boolean;
      status: 'Not configured' | 'READY_FOR_SANDBOX';
      missingRequirements: string[];
      notice: string;
    };
    ehospitalBridge: {
      isConfigured: boolean;
      status: 'Not configured' | 'READY_FOR_INTEGRATION';
      missingRequirements: string[];
      notice: string;
    };
    geminiAi: {
      isConfigured: boolean;
      status: 'CONFIGURED' | 'Not configured';
      notice: string;
    };
  };
  summary: {
    totalChecked: number;
    configuredCount: number;
    missingRequiredCount: number;
    disabledIntegrationsCount: number;
  };
}

export interface AppEnvironmentSummary {
  nodeEnv: string;
  port: number;
  appUrl: string;
  database: DatabaseConfig;
  session: SessionConfig;
  storage: StorageConfig;
  abdm: AbdmGatewayConfig;
  ehospital: EhospitalConfig;
  gemini: {
    isConfigured: boolean;
    notice: string;
  };
}

/**
 * Safely inspects server-side environment variables.
 * Safe fallback in browser/vite context where process.env might only contain client-safe keys.
 */
function readEnv(key: string, defaultValue: string = ''): string {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key]!;
  }
  return defaultValue;
}

/**
 * Validates required server-side environment variables securely without printing their values.
 * Requirement 1: SESSION_SECRET and DATABASE_URL are required for the server to run.
 */
export function validateRequiredEnvironment(throwOnError: boolean = false): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  const rawSecret = readEnv('SESSION_SECRET');
  const isSecretValid = Boolean(
    rawSecret &&
    rawSecret.trim().length >= 32 &&
    !rawSecret.includes('CHANGE_ME') &&
    !rawSecret.includes('placeholder')
  );

  if (!isSecretValid) {
    errors.push('SESSION_SECRET is required and must be a cryptographically secure string of at least 32 characters');
  }

  const rawDbUrl = readEnv('DATABASE_URL');
  const isDbValid = Boolean(
    rawDbUrl &&
    rawDbUrl.trim().length > 0 &&
    !rawDbUrl.includes('placeholder')
  );

  if (!isDbValid) {
    errors.push('DATABASE_URL is required to connect to the PostgreSQL database');
  }

  if (throwOnError && errors.length > 0) {
    // SECURITY: Thrown message specifies missing variable requirements without ever printing secret values
    throw new Error(`Server Configuration Error: ${errors.join('; ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Assert that required environment variables are present and valid.
 * Useful as a guard in server startup scripts.
 */
export function assertServerEnvironment(): void {
  validateRequiredEnvironment(true);
}

/**
 * Returns database configuration.
 * Requirement 2: DATABASE_POOL_MAX must default to 5 when missing, while supporting explicit overrides.
 */
export function getDatabaseConfig(): DatabaseConfig {
  const rawUrl = readEnv('DATABASE_URL');
  const rawPoolMax = readEnv('DATABASE_POOL_MAX');
  
  // Default to 5 connections when missing or invalid
  const parsedPool = rawPoolMax ? parseInt(rawPoolMax, 10) : NaN;
  const poolMax = !isNaN(parsedPool) && parsedPool > 0 ? parsedPool : 5;

  const isConfigured = Boolean(
    rawUrl && 
    rawUrl.trim().length > 0 && 
    !rawUrl.includes('placeholder')
  );

  return {
    databaseUrl: isConfigured ? '[DATABASE_URL_CONFIGURED]' : null,
    isConfigured,
    poolMax,
    engine: 'postgresql',
    statusDescription: isConfigured
      ? `PostgreSQL 15+ configured with connection pool size = ${poolMax}`
      : 'In-memory preview repository active (PostgreSQL DATABASE_URL not yet configured)'
  };
}

/**
 * Returns session security configuration.
 * Document secure generation; never hardcode or expose secrets.
 */
export function getSessionConfig(): SessionConfig {
  const rawSecret = readEnv('SESSION_SECRET');
  const isConfigured = Boolean(
    rawSecret && 
    rawSecret.trim().length >= 32 && 
    !rawSecret.includes('CHANGE_ME') && 
    !rawSecret.includes('placeholder')
  );

  return {
    isConfigured,
    algorithm: 'HMAC-SHA256 with 256-bit entropy',
    cookieOptions: {
      httpOnly: true,
      secure: readEnv('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAgeSeconds: 86400 // 24 hours
    },
    generationMethodDoc: 'Generate cryptographically random 32-byte string: `openssl rand -base64 32`'
  };
}

/**
 * Returns storage configuration.
 * Requirement 3: Storage must be optional during initial setup.
 * When no valid storage provider is configured, display that document storage is not configured.
 * Never claim that a file has been securely or permanently saved when it has not.
 */
export function getStorageConfig(): StorageConfig {
  const rawProvider = readEnv('STORAGE_PROVIDER');
  const bucket = readEnv('STORAGE_BUCKET');
  const region = readEnv('STORAGE_REGION', 'asia-south1');

  const isValidProvider = rawProvider === 'gcs' || rawProvider === 's3';
  const isValidBucket = Boolean(
    bucket && 
    bucket.trim().length > 0 && 
    !bucket.includes('placeholder')
  );

  const isConfigured = isValidProvider && isValidBucket;

  return {
    provider: isConfigured ? (rawProvider as 'gcs' | 's3') : 'none',
    bucket: isConfigured ? bucket : null,
    region,
    isConfigured,
    isDurable: isConfigured,
    statusLabel: isConfigured ? 'DURABLE_STORAGE' : 'Not configured',
    notice: isConfigured
      ? `Encrypted private object storage active on ${rawProvider.toUpperCase()} (${bucket})`
      : 'Document storage is not configured. Uploaded documents are stored only in temporary session memory and are not permanently or securely saved.'
  };
}

/**
 * Returns ABDM Gateway configuration.
 * Requirement 4: ABDM integration must remain disabled until valid sandbox credentials
 * and any required facility configuration are provided.
 */
export function getAbdmConfig(): AbdmGatewayConfig {
  const clientId = readEnv('ABDM_SANDBOX_CLIENT_ID');
  const clientSecret = readEnv('ABDM_SANDBOX_CLIENT_SECRET');
  const gatewayUrl = readEnv('ABDM_GATEWAY_URL');
  const facilityId = readEnv('ABDM_FACILITY_ID');

  const clientIdConfigured = Boolean(clientId && clientId.trim().length > 0 && !clientId.includes('placeholder'));
  const clientSecretConfigured = Boolean(clientSecret && clientSecret.trim().length > 0 && !clientSecret.includes('placeholder'));
  const gatewayUrlConfigured = Boolean(gatewayUrl && gatewayUrl.trim().length > 0 && !gatewayUrl.includes('placeholder'));
  const facilityConfigured = Boolean(facilityId && facilityId.trim().length > 0 && !facilityId.includes('placeholder'));

  const isEnabled = clientIdConfigured && clientSecretConfigured && gatewayUrlConfigured && facilityConfigured;

  const missingRequirements: string[] = [];
  if (!clientIdConfigured) missingRequirements.push('ABDM_SANDBOX_CLIENT_ID');
  if (!clientSecretConfigured) missingRequirements.push('ABDM_SANDBOX_CLIENT_SECRET');
  if (!gatewayUrlConfigured) missingRequirements.push('ABDM_GATEWAY_URL');
  if (!facilityConfigured) missingRequirements.push('ABDM_FACILITY_ID');

  return {
    isEnabled,
    clientIdConfigured,
    clientSecretConfigured,
    facilityConfigured,
    gatewayUrlConfigured,
    status: isEnabled ? 'READY_FOR_SANDBOX' : 'Not configured',
    gatewayUrl: gatewayUrlConfigured ? gatewayUrl : 'https://dev.abdm.gov.in/gateway/v0.5',
    facilityId: facilityConfigured ? facilityId : null,
    missingRequirements,
    notice: isEnabled
      ? 'Official NHA ABDM Sandbox client credentials and facility configuration detected.'
      : 'ABDM integration is disabled: missing sandbox credentials or facility configuration (ABDM_SANDBOX_CLIENT_ID, ABDM_SANDBOX_CLIENT_SECRET, ABDM_GATEWAY_URL, ABDM_FACILITY_ID). System returns 503 Not Configured.'
  };
}

/**
 * Returns NIC e-Hospital configuration.
 * Requirement 5: eHospital integration must remain disabled until authorized client token
 * and facility code are provided.
 */
export function getEhospitalConfig(): EhospitalConfig {
  const clientToken = readEnv('EHOSPITAL_CLIENT_TOKEN');
  const facilityCode = readEnv('EHOSPITAL_FACILITY_CODE');

  const clientTokenConfigured = Boolean(clientToken && clientToken.trim().length > 0 && !clientToken.includes('placeholder'));
  const facilityCodeConfigured = Boolean(facilityCode && facilityCode.trim().length > 0 && !facilityCode.includes('placeholder'));

  const isEnabled = clientTokenConfigured && facilityCodeConfigured;

  const missingRequirements: string[] = [];
  if (!clientTokenConfigured) missingRequirements.push('EHOSPITAL_CLIENT_TOKEN');
  if (!facilityCodeConfigured) missingRequirements.push('EHOSPITAL_FACILITY_CODE');

  return {
    isEnabled,
    clientTokenConfigured,
    facilityCodeConfigured,
    status: isEnabled ? 'READY_FOR_INTEGRATION' : 'Not configured',
    facilityCode: facilityCodeConfigured ? facilityCode : null,
    missingRequirements,
    notice: isEnabled
      ? 'NIC e-Hospital Suite authorized client token and facility code detected.'
      : 'e-Hospital integration is disabled: missing authorized client token or facility code (EHOSPITAL_CLIENT_TOKEN, EHOSPITAL_FACILITY_CODE). System returns 503 Not Configured.'
  };
}

/**
 * Configuration status check that reports only whether each integration is configured,
 * without exposing secret values.
 * Requirement 8: Add a configuration-status check reporting configuration states safely.
 */
export function getConfigurationStatus(): ConfigurationStatusReport {
  const db = getDatabaseConfig();
  const session = getSessionConfig();
  const storage = getStorageConfig();
  const abdm = getAbdmConfig();
  const ehospital = getEhospitalConfig();
  const rawGeminiKey = readEnv('GEMINI_API_KEY');
  const geminiConfigured = Boolean(rawGeminiKey && rawGeminiKey.trim().length > 0 && !rawGeminiKey.includes('placeholder'));

  const validation = validateRequiredEnvironment(false);

  let configuredCount = 0;
  if (session.isConfigured) configuredCount++;
  if (db.isConfigured) configuredCount++;
  if (storage.isConfigured) configuredCount++;
  if (abdm.isEnabled) configuredCount++;
  if (ehospital.isEnabled) configuredCount++;
  if (geminiConfigured) configuredCount++;

  let disabledIntegrations = 0;
  if (!storage.isConfigured) disabledIntegrations++;
  if (!abdm.isEnabled) disabledIntegrations++;
  if (!ehospital.isEnabled) disabledIntegrations++;

  return {
    checkedAt: new Date().toISOString(),
    isServerReady: validation.isValid,
    requiredVariables: {
      SESSION_SECRET: {
        isConfigured: session.isConfigured,
        status: session.isConfigured ? 'CONFIGURED' : 'MISSING_REQUIRED',
        purpose: 'HMAC-SHA256 session cookie signing and role tamper-proofing (min 32 chars required)'
      },
      DATABASE_URL: {
        isConfigured: db.isConfigured,
        status: db.isConfigured ? 'CONFIGURED' : 'MISSING_REQUIRED',
        purpose: 'PostgreSQL 15+ connection pool for clinical records persistence'
      }
    },
    optionalIntegrations: {
      databasePool: {
        poolMax: db.poolMax,
        isDefault: !readEnv('DATABASE_POOL_MAX'),
        purpose: 'Connection limit for PostgreSQL pool (defaults to 5 when unset)',
        status: 'ACTIVE'
      },
      documentStorage: {
        isConfigured: storage.isConfigured,
        status: storage.isConfigured ? 'CONFIGURED' : 'Not configured',
        provider: storage.isConfigured ? storage.provider : null,
        isDurable: storage.isDurable,
        notice: storage.notice
      },
      abdmGateway: {
        isConfigured: abdm.isEnabled,
        status: abdm.isEnabled ? 'READY_FOR_SANDBOX' : 'Not configured',
        missingRequirements: abdm.missingRequirements,
        notice: abdm.notice
      },
      ehospitalBridge: {
        isConfigured: ehospital.isEnabled,
        status: ehospital.isEnabled ? 'READY_FOR_INTEGRATION' : 'Not configured',
        missingRequirements: ehospital.missingRequirements,
        notice: ehospital.notice
      },
      geminiAi: {
        isConfigured: geminiConfigured,
        status: geminiConfigured ? 'CONFIGURED' : 'Not configured',
        notice: geminiConfigured
          ? 'Gemini API active for assistive clinical synthesis'
          : 'Gemini API optional. Clinical workspace operates deterministically without it.'
      }
    },
    summary: {
      totalChecked: 6,
      configuredCount,
      missingRequiredCount: validation.errors.length,
      disabledIntegrationsCount: disabledIntegrations
    }
  };
}

/**
 * Full summary of system configuration states.
 * Requirement 6: Missing optional integration credentials do not prevent application start.
 */
export function getAppEnvironmentSummary(): AppEnvironmentSummary {
  const port = parseInt(readEnv('PORT', '3000'), 10) || 3000;
  const nodeEnv = readEnv('NODE_ENV', 'development');
  const appUrl = readEnv('APP_URL', `http://localhost:${port}`);
  const rawGeminiKey = readEnv('GEMINI_API_KEY');
  const geminiConfigured = Boolean(rawGeminiKey && rawGeminiKey.trim().length > 0 && !rawGeminiKey.includes('placeholder'));

  return {
    nodeEnv,
    port,
    appUrl,
    database: getDatabaseConfig(),
    session: getSessionConfig(),
    storage: getStorageConfig(),
    abdm: getAbdmConfig(),
    ehospital: getEhospitalConfig(),
    gemini: {
      isConfigured: geminiConfigured,
      notice: geminiConfigured
        ? 'Gemini API key is configured for AI clinical summaries and structured OCR extraction.'
        : 'Gemini API key is optional. Clinical workspace operates deterministically without it.'
    }
  };
}
