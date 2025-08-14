import fs from "fs";

const data = JSON.parse(fs.readFileSync("udyam_final_schema.json", "utf8"));

data.step1 = data.step1.filter(field => {
  // Keep Aadhaar input, name input, declaration checkbox, and submit button
  return (
    field.id?.includes("txtadharno") ||
    field.id?.includes("txtownername") ||
    field.id?.includes("chkDecarationA") ||
    field.id?.includes("btnValidateAadhaar")
  );
});

fs.writeFileSync("udyam_final_schema_clean.json", JSON.stringify(data, null, 2));

console.log("✅ Cleaned schema saved to udyam_final_schema_clean.json");
