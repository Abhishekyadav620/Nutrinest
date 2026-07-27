const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s()-]{10,15}$/;
const NAME_REGEX = /^[a-zA-Z\s.'-]{2,50}$/;

export function validateLogin({ username, password }) {
  const errors = {};
  const email = username?.trim() || "";

  if (!email) {
    errors.username = "Email address is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.username = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

export function validateSignup(formData, passChecks) {
  const errors = {};
  const name = formData.name?.trim() || "";
  const email = formData.email?.trim() || "";
  const phone = formData.phone?.trim() || "";

  if (!name) {
    errors.name = "Full name is required.";
  } else if (!NAME_REGEX.test(name)) {
    errors.name = "Enter a valid name (letters only, 2–50 characters).";
  }

  if (!email) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_REGEX.test(phone)) {
    errors.phone = "Enter a valid phone number (at least 10 digits).";
  }

  if (!formData.password) {
    errors.password = "Password is required.";
  } else if (!Object.values(passChecks).every(Boolean)) {
    errors.password = "Password does not meet all requirements below.";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
