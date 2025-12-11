// New color generation function ===
// the index determines the hue, saturation is controlled at 35%, and lightness is controlled at 92%.
export const getPastelColor = (index: number) => {
  // Use the golden angle (137.5 degrees) to offset colors and prevent adjacent colors from being too close.
  const hue = (index * 137.5) % 360; 
  return `hsl(${hue}, 35%, 92%)`;
};