export function formatIndianCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

type PriceValue =
  | number
  | string
  | null
  | undefined;

interface PropertyPriceDisplay {
  label: string | null;
  value: string;
}

function getFinitePrice(
  value: PriceValue,
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const numericValue = Number(value);

  return Number.isFinite(numericValue)
    ? numericValue
    : null;
}

export function getPropertyPriceDisplay(
  startingPrice: PriceValue,
  endingPrice: PriceValue,
  priceSuffix = "",
): PropertyPriceDisplay {
  const start = getFinitePrice(startingPrice);
  const end = getFinitePrice(endingPrice);

  if (start !== null && end !== null) {
    return {
      label: "Price range",
      value: `${formatIndianCurrency(start)} – ${formatIndianCurrency(end)}`,
    };
  }

  if (start !== null) {
    return {
      label: "Starting from",
      value: `${formatIndianCurrency(start)}${priceSuffix}`,
    };
  }

  if (end !== null) {
    return {
      label: "Up to",
      value: formatIndianCurrency(end),
    };
  }

  return {
    label: null,
    value: "Price on request",
  };
}