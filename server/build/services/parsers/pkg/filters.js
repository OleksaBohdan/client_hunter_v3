export function removeExistingVacancyLinks(VACANCY_LINKS, vacancyLinks) {
    const result = VACANCY_LINKS.filter((link) => !vacancyLinks.includes(link));
    return result;
}
//# sourceMappingURL=filters.js.map