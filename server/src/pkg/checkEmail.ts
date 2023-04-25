export function checkEmail(str: string): string {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (regex.test(str)) {
    return str;
  } else {
    return '';
  }
}
