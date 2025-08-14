import fs from "fs";

// Load Step 1 scraped JSON
const step1Raw = JSON.parse(fs.readFileSync("udyam_schema.json", "utf8")).fields;

// Function to clean Step 1
function cleanStep1(fields) {
  return fields
    .filter(field => {
      // Remove hidden fields
      if (field.hidden) return false;
      // Remove elements without id or name
      if (!field.id && !field.name) return false;
      // Remove ASP.NET state fields
      if (field.id && field.id.startsWith("__")) return false;
      // Remove accessibility & UI buttons
      if (field.id?.startsWith("btn-") || field.id?.startsWith("uw-")) return false;
      if (field.id === "checkbox") return false;
      // Only keep relevant Aadhaar step inputs/buttons
      return true;
    })
    .map(field => {
      // Add validation rules where missing
      if (field.id?.includes("txtadharno")) {
        field.pattern = "^[0-9]{12}$";
        field.required = true;
      }
      if (field.id?.includes("txtownername")) {
        field.required = true;
      }
      if (field.id?.includes("chkDecarationA")) {
        field.required = true;
      }
      return field;
    });
}

// Clean Step 1
const step1Clean = cleanStep1(step1Raw);

// Load Step 2 schema (manually created earlier)
const step2Schema = JSON.parse(fs.readFileSync("step2.json", "utf8")).step2;

// Merge into final schema
const finalSchema = {
  step1: step1Clean,
  step2: step2Schema
};

// Save output
fs.writeFileSync("udyam_final_schema.json", JSON.stringify(finalSchema, null, 2));

console.log("✅ Cleaned Step 1 and merged with Step 2 into udyam_final_schema.json");
