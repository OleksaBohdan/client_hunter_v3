export function checkEmail(str) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regex.test(str)) {
        return str;
    }
    else {
        return '';
    }
}
//# sourceMappingURL=checkEmail.js.map