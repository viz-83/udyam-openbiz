import React, { useState } from "react";

export default function DynamicForm({
  fields,
  onSubmit,
  onBack,
  submitLabel = "Submit",
  defaultValues = {},
  layout,
  extraContent
}) {
  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Simple validation based on field rules
  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label || field.name} is required`;
      }
      if (field.pattern) {
        const regex = new RegExp(field.pattern);
        if (formData[field.name] && !regex.test(formData[field.name])) {
          newErrors[field.name] = `Invalid format for ${field.label || field.name}`;
        }
      }
      if (field.maxlength && formData[field.name]?.length > field.maxlength) {
        newErrors[field.name] = `${field.label || field.name} must be at most ${field.maxlength} characters`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  // Render input/select/checkbox fields
  const renderField = (field) => {
    if (field.hidden) return null;

    // Text Inputs
    if (field.tag === "input" && field.type !== "checkbox" && field.type !== "radio") {
      return (
        <div key={field.id} className="mb-4">
          {field.label && (
            <label htmlFor={field.id} className="block font-medium mb-1">
              {field.label}
            </label>
          )}
          <input
            id={field.id}
            name={field.name}
            type={field.type || "text"}
            placeholder={field.placeholder || ""}
            value={formData[field.name] || ""}
            onChange={handleChange}
            maxLength={field.maxlength || undefined}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          {errors[field.name] && (
            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
          )}
        </div>
      );
    }

    // Checkbox
    if (field.type === "checkbox") {
      return (
        <div key={field.id} className="mb-4 flex items-start">
          <input
            type="checkbox"
            id={field.id}
            name={field.name}
            checked={formData[field.name] || false}
            onChange={handleChange}
            className="mt-1 mr-2"
          />
          {field.label && <label htmlFor={field.id}>{field.label}</label>}
          {errors[field.name] && (
            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={
          layout === "two-column-step1"
            ? "grid grid-cols-1 md:grid-cols-2 gap-4"
            : ""
        }
      >
        {fields
          .filter((f) => f.type !== "checkbox" && f.type !== "submit")
          .map((field) => renderField(field))}
      </div>

      {/* Extra content (e.g., bullet points) */}
      {extraContent && <div className="mt-4">{extraContent}</div>}

      {/* Checkbox section (consent) */}
      <div className="mt-4">
        {fields.filter((f) => f.type === "checkbox").map((field) => renderField(field))}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
