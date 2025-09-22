import * as logger from "firebase-functions/logger";
import { createMailerService, ContactFormData } from "../services/mailer";
import { ContactFormDTO } from "../dto/ContactFormDTO";
import { Request } from "firebase-functions/https";
import { Response } from "firebase-functions/v1";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

/**
 * Set CORS headers
 */
function setCorsHeaders(response: Response): void {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

/**
 * Validate contact form data using DTO
 */
async function validateContactFormData(
  body: unknown
): Promise<{ isValid: boolean; errors: string[]; data?: ContactFormDTO }> {
  try {
    // Transform raw data to DTO instance using class-transformer
    const dto = plainToClass(ContactFormDTO, body);

    // Validate using class-validator
    const validationErrors = await validate(dto);

    if (validationErrors.length === 0) {
      return {
        isValid: true,
        errors: [],
        data: dto,
      };
    }

    // Extract error messages
    const errors: string[] = [];
    validationErrors.forEach((error) => {
      if (error.constraints) {
        errors.push(...Object.values(error.constraints));
      }
    });

    return {
      isValid: false,
      errors,
    };
  } catch (error) {
    logger.error("Error during DTO validation", error);
    return {
      isValid: false,
      errors: ["Invalid data format"],
    };
  }
}

/**
 * Handle errors and send appropriate response
 */
function handleError(error: unknown, response: Response): void {
  logger.error("Contact form submission error", error);

  response.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred. Please try again later.",
  });
}

/**
 * Handle contact form submission
 */
export async function handleContactForm(request: Request, response: Response): Promise<void> {
  // Enable CORS for all origins (you may want to restrict this in production)
  setCorsHeaders(response);

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  // Only allow POST requests
  if (request.method !== "POST") {
    response.status(405).json({
      error: "Method Not Allowed",
      message: "Only POST requests are allowed",
    });
    return;
  }

  try {
    // Validate and extract request data using DTO
    const validationResult = await validateContactFormData(request.body);

    if (!validationResult.isValid) {
      response.status(400).json({
        error: "Validation Error",
        message: "Please check your input data",
        details: validationResult.errors,
      });
      return;
    }

    // Convert DTO to ContactFormData for the mailer service
    const contactData: ContactFormData = {
      name: (validationResult.data as ContactFormDTO).name,
      email: (validationResult.data as ContactFormDTO).email,
      message: (validationResult.data as ContactFormDTO).message,
    };

    // Send email
    const mailerService = createMailerService();
    await mailerService.sendContactFormEmail(contactData);

    // Log successful submission
    logger.info("Contact form submitted successfully", {
      name: contactData.name,
      email: contactData.email,
      messageLength: contactData.message.length,
      timestamp: new Date().toISOString(),
    });

    response.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    handleError(error, response);
  }
}
