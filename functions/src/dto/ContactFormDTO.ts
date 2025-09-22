import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";
import { Transform } from "class-transformer";

/**
 * Data Transfer Object for contact form validation
 * Validates incoming contact form data with proper constraints
 */
export class ContactFormDTO {
  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name must be a string" })
  @MinLength(2, { message: "Name must be at least 2 characters long" })
  @MaxLength(100, { message: "Name cannot exceed 100 characters" })
  @Matches(/^[a-zA-Z\s\u00C0-\u017F\u0100-\u017F\u0180-\u024F]+$/, {
    message: "Name can only contain letters and spaces",
  })
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
    name!: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsString({ message: "Email must be a string" })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @MaxLength(254, { message: "Email cannot exceed 254 characters" })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "Please provide a valid email format",
  })
  @Transform(({ value }) => typeof value === "string" ? value.trim().toLowerCase() : value)
    email!: string;

  @IsNotEmpty({ message: "Message is required" })
  @IsString({ message: "Message must be a string" })
  @MinLength(10, { message: "Message must be at least 10 characters long" })
  @MaxLength(2000, { message: "Message cannot exceed 2000 characters" })
  @Matches(/^[\s\S]*[a-zA-Z][\s\S]*$/, {
    message: "Message must contain at least one letter",
  })
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
    message!: string;
}

