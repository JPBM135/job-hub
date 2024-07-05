export function dateResolver(
  date: Date | string | null | undefined,
  allowNull: true,
): string | null;
export function dateResolver(
  date: Date | string | null | undefined,
  allowNull?: false,
): string;
export function dateResolver(
  date: Date | string | null | undefined,
  allowNull = false,
): string | null {
  if (!date && allowNull) {
    return null;
  }

  if (!date) {
    throw new Error('Date is required');
  }

  return new Date(date).toISOString();
}
