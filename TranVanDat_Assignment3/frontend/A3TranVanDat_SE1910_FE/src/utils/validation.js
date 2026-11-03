/**
 * Utility functions for form and business logic validations.
 * Centralized validation logic separated from React components.
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[0-9+() -]{8,15}$/;

/**
 * Checks if a string is a valid email format.
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Checks if a string is a valid telephone number.
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== "string") return false;
  return PHONE_REGEX.test(phone.trim());
};

/**
 * Validates date range: endDate must be strictly after startDate.
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return !isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start;
};

/**
 * Validates check-in date is not in the past (before today 00:00:00).
 */
export const isNotPastDate = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Validates single item addition in CustomerBookingPage
 */
export const validateBookingItem = ({ roomId, startDate, endDate, existingItems = [] }) => {
  if (!roomId || !startDate || !endDate) {
    return {
      isValid: false,
      error: "Please select a room, check-in date and check-out date.",
    };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      isValid: false,
      error: "Invalid date format.",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (start < today) {
    return {
      isValid: false,
      error: "Check-in date cannot be in the past.",
    };
  }

  if (start >= end) {
    return {
      isValid: false,
      error: "Check-out date must be strictly after Check-in date.",
    };
  }

  // Check duplicate room in list with overlapping date ranges
  const hasOverlap = existingItems.some((item) => {
    if (item.roomId !== Number(roomId)) return false;
    const itemStart = new Date(item.startDate);
    const itemEnd = new Date(item.endDate);
    return start < itemEnd && end > itemStart;
  });

  if (hasOverlap) {
    return {
      isValid: false,
      error: "This room is already in your reservation list for an overlapping date range.",
    };
  }

  return { isValid: true };
};

/**
 * Validates submission of entire booking in CustomerBookingPage
 */
export const validateBookingSubmission = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      isValid: false,
      error: "Please add at least one room reservation item before confirming.",
    };
  }
  return { isValid: true };
};

/**
 * Validates user credentials on LoginPage
 */
export const validateLogin = ({ email, password }) => {
  if (!email || !email.trim()) {
    return {
      isValid: false,
      error: "Email address is required.",
    };
  }
  if (!isValidEmail(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address.",
    };
  }
  if (!password) {
    return {
      isValid: false,
      error: "Password is required.",
    };
  }
  return { isValid: true };
};

/**
 * Validates register form data on RegisterPage
 */
export const validateRegister = (form) => {
  const { customerFullName, emailAddress, telephone, customerBirthday, password } = form || {};

  if (!customerFullName || !customerFullName.trim()) {
    return { isValid: false, error: "Full Name is required." };
  }
  if (customerFullName.trim().length > 50) {
    return { isValid: false, error: "Full Name must not exceed 50 characters." };
  }

  if (!emailAddress || !emailAddress.trim()) {
    return { isValid: false, error: "Email Address is required." };
  }
  if (!isValidEmail(emailAddress)) {
    return { isValid: false, error: "Please enter a valid email address." };
  }
  if (emailAddress.trim().length > 50) {
    return { isValid: false, error: "Email Address must not exceed 50 characters." };
  }

  if (telephone && telephone.trim()) {
    if (telephone.trim().length > 12) {
      return { isValid: false, error: "Telephone must not exceed 12 characters." };
    }
    if (!isValidPhone(telephone)) {
      return { isValid: false, error: "Telephone format is invalid." };
    }
  }

  if (customerBirthday) {
    const bday = new Date(customerBirthday);
    if (isNaN(bday.getTime())) {
      return { isValid: false, error: "Invalid birthday format." };
    }
    if (bday > new Date()) {
      return { isValid: false, error: "Birthday cannot be in the future." };
    }
  }

  if (!password) {
    return { isValid: false, error: "Password is required." };
  }
  if (password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters long." };
  }

  return { isValid: true };
};

/**
 * Validates customer profile update form
 */
export const validateCustomerProfile = (profile) => {
  const { customerFullName, telephone, customerBirthday } = profile || {};

  if (!customerFullName || !customerFullName.trim()) {
    return { isValid: false, error: "Full Name is required." };
  }
  if (customerFullName.trim().length > 50) {
    return { isValid: false, error: "Full Name must not exceed 50 characters." };
  }

  if (telephone && telephone.trim()) {
    if (telephone.trim().length > 12) {
      return { isValid: false, error: "Telephone must not exceed 12 characters." };
    }
    if (!isValidPhone(telephone)) {
      return { isValid: false, error: "Telephone format is invalid." };
    }
  }

  if (customerBirthday) {
    const bday = new Date(customerBirthday);
    if (isNaN(bday.getTime())) {
      return { isValid: false, error: "Invalid birthday format." };
    }
    if (bday > new Date()) {
      return { isValid: false, error: "Birthday cannot be in the future." };
    }
  }

  return { isValid: true };
};

/**
 * Validates room create/update form in StaffRoomsPage
 */
export const validateRoom = (form) => {
  const { roomNumber, roomDetailDescription, roomMaxCapacity, roomTypeId, roomPricePerDay } = form || {};

  if (!roomNumber || !String(roomNumber).trim()) {
    return { isValid: false, error: "Room number is required." };
  }
  if (String(roomNumber).trim().length > 50) {
    return { isValid: false, error: "Room number must not exceed 50 characters." };
  }

  if (!roomTypeId) {
    return { isValid: false, error: "Please select a valid Room Type." };
  }

  if (!roomMaxCapacity || Number(roomMaxCapacity) < 1) {
    return { isValid: false, error: "Room max capacity must be at least 1." };
  }

  if (roomPricePerDay === undefined || roomPricePerDay === null || Number(roomPricePerDay) <= 0) {
    return { isValid: false, error: "Room price per day must be greater than 0." };
  }

  if (roomDetailDescription && roomDetailDescription.length > 220) {
    return { isValid: false, error: "Room description must not exceed 220 characters." };
  }

  return { isValid: true };
};

/**
 * Validates staff editing a customer account
 */
export const validateStaffCustomer = (form) => {
  const { customerFullName, telephone, customerBirthday } = form || {};

  if (!customerFullName || !customerFullName.trim()) {
    return { isValid: false, error: "Full Name is required." };
  }
  if (customerFullName.trim().length > 50) {
    return { isValid: false, error: "Full Name must not exceed 50 characters." };
  }

  if (telephone && telephone.trim()) {
    if (telephone.trim().length > 12) {
      return { isValid: false, error: "Telephone must not exceed 12 characters." };
    }
    if (!isValidPhone(telephone)) {
      return { isValid: false, error: "Telephone format is invalid." };
    }
  }

  if (customerBirthday) {
    const bday = new Date(customerBirthday);
    if (isNaN(bday.getTime())) {
      return { isValid: false, error: "Invalid birthday format." };
    }
    if (bday > new Date()) {
      return { isValid: false, error: "Birthday cannot be in the future." };
    }
  }

  return { isValid: true };
};

