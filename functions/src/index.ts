import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import { handleContactForm } from "./handlers/contactHandler";

// Set global options for cost control
setGlobalOptions({ maxInstances: 10 });

/**
 * Contact form endpoint
 * Handles POST requests with contact form data and sends emails
 */
export const sendContactEmail = onRequest(handleContactForm);
