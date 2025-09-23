# 📧 Portfolio Contact Form

A simple Firebase Cloud Function that receives contact form submissions from your personal website and sends you email notifications.

## What it does

- Receives POST requests with `name`, `email`, and `message`
- Validates the input data
- Sends you a formatted email with the contact form content

## API

**Endpoint:** `POST /sendContactEmail`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "message": "Hello, I'd like to get in touch..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

## Validation

- **Name:** 2-100 characters, letters and spaces only
- **Email:** Valid email format
- **Message:** 10-2000 characters, must contain at least one letter

## Features

- ✅ TypeScript with strict validation
- ✅ Professional HTML email templates
- ✅ CORS support for web forms
- ✅ Comprehensive error handling
- ✅ Security measures (XSS protection, input sanitization)

## Project Structure

```
functions/src/
├── handlers/contactHandler.ts    # HTTP request handling
├── services/mailer.ts           # Email sending service
├── dto/ContactFormDTO.ts        # Data validation
├── config/env.ts               # Environment variables
└── index.ts                    # Main entry point
```

That's it! Simple contact form to email service for your portfolio website.

