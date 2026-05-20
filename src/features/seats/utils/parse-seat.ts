/**
 * Parse seat number (e.g. "12A") into row and column.
 */
export function parseSeatNumber(seatNumber: string): {
  row: number;
  col: string;
} {
  const match = seatNumber.match(/^(\d+)([A-Z])$/);
  if (!match) return { row: 0, col: '' };
  return { row: parseInt(match[1]!, 10), col: match[2]! };
}
