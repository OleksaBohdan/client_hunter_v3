export function mapUserWithoutPassword(user) {
    const mappedUser = {
        _id: user.id,
        email: user.email,
    };
    return mappedUser;
}
//# sourceMappingURL=user.mapper.js.map