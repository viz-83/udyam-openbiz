import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rulesPath = path.join(__dirname, "rules.schema.json");
const rules = JSON.parse(fs.readFileSync(rulesPath, "utf-8"));

/**
 * Build a Zod schema from rules array
 */
const buildSchema = (ruleArray) => {
  const schemaShape = {};

  ruleArray.forEach((fieldRules) => {
    let fieldSchema;

    // Handle different types
    if (fieldRules.type === "boolean") {
      fieldSchema = z.boolean();
    } else if (fieldRules.type === "date") {
      fieldSchema = z.string().refine(
        (val) => !isNaN(Date.parse(val)),
        `${fieldRules.key} must be a valid date`
      );
    } else if (fieldRules.type === "email") {
      fieldSchema = z.string().email(`${fieldRules.key} must be a valid email`);
    } else {
      fieldSchema = z.string();
    }

    if (fieldRules.required) {
      if (fieldRules.type === "boolean") {
        fieldSchema = fieldSchema.refine((val) => val !== undefined, `${fieldRules.key} is required`);
      } else {
        fieldSchema = fieldSchema.min(1, `${fieldRules.key} is required`);
      }
    }
    if (fieldRules.pattern) {
      fieldSchema = fieldSchema.regex(
        new RegExp(fieldRules.pattern),
        `${fieldRules.key} is invalid`
      );
    }
    if (fieldRules.maxlength && fieldRules.type !== "boolean") {
      fieldSchema = fieldSchema.max(
        fieldRules.maxlength,
        `${fieldRules.key} exceeds max length`
      );
    }
    if (fieldRules.enum) {
      fieldSchema = z.enum(fieldRules.enum);
    }

    schemaShape[fieldRules.key] = fieldSchema;
  });

  return z.object(schemaShape);
};

// Export schemas
export const Step1Schema = buildSchema(rules.step1);
export const Step2Schema = buildSchema(rules.step2);

export const validateData = (data, step = 1) => {
  const schema = step === 1 ? Step1Schema : Step2Schema;
  return schema.parse(data);
};
