export function removeExistingVacancyLinks(VACANCY_LINKS: string[], vacancyLinks: string[]): string[] {
  const result = VACANCY_LINKS.filter((link) => !vacancyLinks.includes(link));
  return result;
}
