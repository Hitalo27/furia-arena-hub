
export const getLevelFromPoints = (points: number): string => {
  if (points >= 300) return 'FURIOSO Lendário';
  if (points >= 100) return 'FURIOSO Veterano';
  return 'FURIOSO Iniciante';
};
