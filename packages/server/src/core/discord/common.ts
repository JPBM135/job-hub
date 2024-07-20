export function numberToCurrency(num: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'CAD',
  }).format(num);
}

export function formatSalary(
  pay_max: number | null,
  pay_min: number | null,
  pay_type: string | null,
) {
  if (pay_max === null && pay_min === null) {
    return 'Unknown Salary';
  }

  if (pay_max === null) {
    return [`Up to ${numberToCurrency(pay_min!)}`, pay_type]
      .filter(Boolean)
      .join(' ');
  }

  if (pay_min === null) {
    return [`Up to ${numberToCurrency(pay_max!)}`, pay_type]
      .filter(Boolean)
      .join(' ');
  }

  return `${numberToCurrency(pay_min!)} - ${numberToCurrency(
    pay_min!,
  )} (${pay_type})`;
}

export function ellipsis(str: string, max: number) {
  return str.length > max ? str.slice(0, max - 3) + '...' : str;
}
