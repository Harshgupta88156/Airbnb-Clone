const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatPrice(amount: number, currency = "₹"): string {
  return `${currency}${inr.format(amount)}`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
