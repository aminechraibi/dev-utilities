export interface Unit { name: string; symbol: string; toBase: number }
export interface Category { name: string; units: Unit[] }

export const categories: Category[] = [
  {
    name: 'Length',
    units: [
      { name: 'Meter', symbol: 'm', toBase: 1 },
      { name: 'Kilometer', symbol: 'km', toBase: 1000 },
      { name: 'Centimeter', symbol: 'cm', toBase: 0.01 },
      { name: 'Millimeter', symbol: 'mm', toBase: 0.001 },
      { name: 'Mile', symbol: 'mi', toBase: 1609.344 },
      { name: 'Yard', symbol: 'yd', toBase: 0.9144 },
      { name: 'Foot', symbol: 'ft', toBase: 0.3048 },
      { name: 'Inch', symbol: 'in', toBase: 0.0254 },
      { name: 'Nautical mile', symbol: 'nmi', toBase: 1852 },
    ],
  },
  {
    name: 'Weight',
    units: [
      { name: 'Kilogram', symbol: 'kg', toBase: 1 },
      { name: 'Gram', symbol: 'g', toBase: 0.001 },
      { name: 'Milligram', symbol: 'mg', toBase: 0.000001 },
      { name: 'Pound', symbol: 'lb', toBase: 0.453592 },
      { name: 'Ounce', symbol: 'oz', toBase: 0.0283495 },
      { name: 'Metric ton', symbol: 't', toBase: 1000 },
      { name: 'Stone', symbol: 'st', toBase: 6.35029 },
    ],
  },
  {
    name: 'Volume',
    units: [
      { name: 'Liter', symbol: 'L', toBase: 1 },
      { name: 'Milliliter', symbol: 'mL', toBase: 0.001 },
      { name: 'Cubic meter', symbol: 'm³', toBase: 1000 },
      { name: 'Gallon (US)', symbol: 'gal', toBase: 3.78541 },
      { name: 'Quart (US)', symbol: 'qt', toBase: 0.946353 },
      { name: 'Pint (US)', symbol: 'pt', toBase: 0.473176 },
      { name: 'Cup (US)', symbol: 'cup', toBase: 0.236588 },
      { name: 'Fluid oz (US)', symbol: 'fl oz', toBase: 0.0295735 },
    ],
  },
  {
    name: 'Area',
    units: [
      { name: 'Square meter', symbol: 'm²', toBase: 1 },
      { name: 'Square kilometer', symbol: 'km²', toBase: 1e6 },
      { name: 'Square foot', symbol: 'ft²', toBase: 0.092903 },
      { name: 'Square inch', symbol: 'in²', toBase: 0.00064516 },
      { name: 'Acre', symbol: 'ac', toBase: 4046.86 },
      { name: 'Hectare', symbol: 'ha', toBase: 10000 },
      { name: 'Square mile', symbol: 'mi²', toBase: 2589988 },
    ],
  },
  {
    name: 'Speed',
    units: [
      { name: 'Meter/second', symbol: 'm/s', toBase: 1 },
      { name: 'Kilometer/hour', symbol: 'km/h', toBase: 0.277778 },
      { name: 'Mile/hour', symbol: 'mph', toBase: 0.44704 },
      { name: 'Knot', symbol: 'kn', toBase: 0.514444 },
      { name: 'Foot/second', symbol: 'ft/s', toBase: 0.3048 },
    ],
  },
  {
    name: 'Pressure',
    units: [
      { name: 'Pascal', symbol: 'Pa', toBase: 1 },
      { name: 'Kilopascal', symbol: 'kPa', toBase: 1000 },
      { name: 'Megapascal', symbol: 'MPa', toBase: 1e6 },
      { name: 'Bar', symbol: 'bar', toBase: 100000 },
      { name: 'PSI', symbol: 'psi', toBase: 6894.76 },
      { name: 'Atmosphere', symbol: 'atm', toBase: 101325 },
      { name: 'mmHg (Torr)', symbol: 'mmHg', toBase: 133.322 },
    ],
  },
];
