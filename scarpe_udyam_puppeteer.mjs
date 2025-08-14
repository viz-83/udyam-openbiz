import puppeteer from "puppeteer";
import fs from "fs";

const url = "https://udyamregistration.gov.in/UdyamRegistration.aspx";

(async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0");
    try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    } catch (e) {
    console.error("Could not open page:", e.message);
    await browser.close();
    process.exit(1);
}

// Optional: intercept XHR to record validation endpoints
const xhrCalls = [];
page.on("request", req => {
 if (["xhr", "fetch"].includes(req.resourceType())) {
 xhrCalls.push({ url: req.url(), method: req.method() });
 }
});

// Wait a bit for scripts to run / dynamic forms to render
 // Replaced the deprecated page.waitForTimeout with a Promise and setTimeout
 await new Promise(resolve => setTimeout(resolve, 2000));

 // Extract fields + validation metadata
 const schema = await page.evaluate(() => {
  function getLabel(el) {
   if (!el) return null;
   const id = el.id;
   const byFor = id ? document.querySelector(`label[for="${id}"]`) : null;
   if (byFor && byFor.textContent.trim()) return byFor.textContent.trim();
   const parentLabel = el.closest("label");
   if (parentLabel && parentLabel.textContent.trim()) return parentLabel.textContent.trim();
   return el.getAttribute("aria-label") || el.getAttribute("placeholder") || null;
  }

const nodes = Array.from(document.querySelectorAll("input,textarea,select,button"));
 const fields = nodes.map(el => {
 const tag = el.tagName.toLowerCase();
 const options = tag === "select" ? Array.from(el.options).map(o => ({ value: o.value, text: o.text })) : null;
 // collect data-val* attributes (common in ASP.NET unobtrusive validation)
 const dataVals = {};
for (const name of el.getAttributeNames()) {
 if (name.startsWith("data-val")) dataVals[name] = el.getAttribute(name);
}
return {
 id: el.id || null,
 name: el.name || null,
 tag,
 type: el.type || null,
 label: getLabel(el),
 placeholder: el.getAttribute("placeholder") || null,
 required: !!(el.required || el.getAttribute("aria-required") === "true" || el.getAttribute("required")),
 maxlength: el.getAttribute("maxlength") ? parseInt(el.getAttribute("maxlength")) : null,
 pattern: el.getAttribute("pattern") || null,
 readonly: el.readOnly || !!el.getAttribute("readonly"),
 hidden: el.type === "hidden" || el.getAttribute("hidden") !== null,
 dataVals,
 options
};
});

// naive scan of inline script text for regex-like patterns (best-effort)
 const scripts = Array.from(document.querySelectorAll("script")).map(s => s.textContent || "").join("\n");
 // crude regex: look for {...}{n} style or [A-Za-z0-9]{n} patterns
 const regexMatches = Array.from(scripts.matchAll(/[\[A-Za-z0-9\\\]\{\}\(\)\^\$\.\\\|\+\-]{1,}\{[0-9,]+\}/g) || []).map(m => m[0]);return { url: location.href, fields, inlineRegexCandidates: Array.from(new Set(regexMatches)).slice(0,50) };});
// attach recorded XHR callsschema.capturedXHR = xhrCalls;
fs.writeFileSync("udyam_schema.json", JSON.stringify(schema, null, 2));console.log("Saved udyam_schema.json — fields:", schema.fields.length)
await browser.close();
})();