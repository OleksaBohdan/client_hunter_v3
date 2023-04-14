export function isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
        return email;
    }
    return '';
}
//# sourceMappingURL=validators.js.map