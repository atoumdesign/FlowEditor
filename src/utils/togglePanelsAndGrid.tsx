export function togglePanelsAndGrid(hide: boolean) {
  // Ajuste os seletores conforme as classes reais dos seus painéis e grid
  const selectors = [
    '.side-panel',
    '.resource-panel',
    '.resources-panel',
    '.state-panel',
    '.react-flow__minimap',
    '.react-flow__controls',
    '.react-flow__background'
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      (el as HTMLElement).style.display = hide ? 'none' : '';
    });
  });
}