export function mapUserWithoutPassword(user) {
    const mappedUser = {
        _id: user.id,
        email: user.email,
        parser: user.parser,
        keyword: user.activeKeyword,
        city: user.activeCity,
    };
    return mappedUser;
}
//# sourceMappingURL=user.mapper.js.map