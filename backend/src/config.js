/**
 * Centralized Configuration Management
 */
module.exports = {
  // Server Port
  port: process.env.PORT || 8080,

  // Google Cloud Platform Configurations
  gcpProject: process.env.GOOGLE_CLOUD_PROJECT || "project-f3658b98-4d0a-4964-a7f",
  gcpLocation: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",

  // Google reCAPTCHA v3 Secret Key
  recaptchaSecret: process.env.RECAPTCHA_SECRET_KEY || "",

  // Allowed CORS Origins
  allowedOrigins: [
    'https://pwick15.github.io',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
  ]
};
