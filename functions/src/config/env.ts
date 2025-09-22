/**
 * Environment variables configuration
 * Centralized location for all environment variables used in the application
 */

export const ENV = {
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",
} as const;

/**
 * Validate that required environment variables are set
 */
export function validateEnvironment(): void {
  const missingVars: string[] = [];

  if (!ENV.EMAIL_USER) {
    missingVars.push("EMAIL_USER");
  }

  if (!ENV.EMAIL_PASS) {
    missingVars.push("EMAIL_PASS");
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
}
