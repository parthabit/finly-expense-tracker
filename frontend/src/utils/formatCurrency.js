export const formatCurrency = (amount, currency = "INR") => {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCompactNumber = (amount) => {
  return new Intl.NumberFormat("en-IN", { notation: "compact" }).format(Number(amount) || 0);
};
