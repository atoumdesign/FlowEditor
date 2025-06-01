export function getUniqueTabName(desiredName: string, existingTabs: { name: string }[]): string {
  let name = desiredName;
  let counter = 1;
  const names = existingTabs.map(tab => tab.name);
  while (names.includes(name)) {
    name = `${desiredName} (${counter})`;
    counter++;
  }
  return name;
}