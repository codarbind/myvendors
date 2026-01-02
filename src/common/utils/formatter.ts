
/**
 * Ensures the phone number starts with "+"
 */
export const ensurePlus = (phone: string): string => {
  if (!phone) return phone;
  return phone.startsWith('+') ? phone : `+${phone}`;
};

/**
 * Ensures the phone number does NOT start with "+"
 */
export const removePlus = (phone: string): string => {
  if (!phone) return phone;
  return phone.startsWith('+') ? phone.slice(1) : phone;
};