export function validateEmail(email) {
  // Very simple email regex for demonstration
  return !!email && /\S+@\S+\.\S+/.test(email);
}
