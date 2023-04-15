export function mapUserWithoutPassword(user) {
    const mappedUser = {
        _id: user.id,
        email: user.email,
        companies: user.companies,
    };
    return mappedUser;
}
//# sourceMappingURL=user.mapper.js.map