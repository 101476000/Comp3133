const validator = require('validator');

function requireNonEmpty(value, field) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return `${field} is required`;
  }
  return null;
}

function validateEmail(value) {
  if (!validator.isEmail(String(value || ''))) return 'email must be valid';
  return null;
}

function validatePassword(value) {
  const v = String(value || '');
  if (v.length < 6) return 'password must be at least 6 characters';
  return null;
}

function validateSalary(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 'salary must be a number';
  if (n < 1000) return 'salary must be >= 1000';
  return null;
}

function validateGender(value) {
  if (value == null) return null;
  const allowed = ['Male', 'Female', 'Other'];
  if (!allowed.includes(value)) return 'gender must be Male, Female, or Other';
  return null;
}

function validateDate(value, field) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return `${field} must be a valid date`;
  return null;
}

function validateAtLeastOne(filters) {
  const ok = Object.values(filters).some((v) => typeof v === 'string' && v.trim().length > 0);
  if (!ok) return 'At least one filter must be provided';
  return null;
}

function collectErrors(list) {
  const errors = list.filter(Boolean);
  return errors.length ? errors : null;
}

module.exports = {
  requireNonEmpty,
  validateEmail,
  validatePassword,
  validateSalary,
  validateGender,
  validateDate,
  validateAtLeastOne,
  collectErrors
};
