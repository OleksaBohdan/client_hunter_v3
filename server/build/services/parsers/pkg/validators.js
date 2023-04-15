export function isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
        return email;
    }
    return '';
}
export function validateCanadaPhone(phone) {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (phoneRegex.test(phone)) {
        return phone;
    }
    else {
        return '';
    }
}
//# sourceMappingURL=validators.js.map