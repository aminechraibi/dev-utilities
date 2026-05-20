const firstNames = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah',
  'Ivan', 'Julia', 'Kevin', 'Laura', 'Michael', 'Nancy', 'Oscar', 'Patricia',
  'Quentin', 'Rachel', 'Samuel', 'Tina', 'Ulrich', 'Victoria', 'Walter', 'Xena',
  'Yusuf', 'Zoe', 'Aaron', 'Bella', 'Carlos', 'Daphne', 'Ethan', 'Frances',
  'Gabriel', 'Heidi', 'Ian', 'Jessica', 'Kyle', 'Lena', 'Marcus', 'Nina',
  'Oliver', 'Penelope', 'Quinn', 'Rebecca', 'Stefan', 'Teresa', 'Uma', 'Vincent',
  'Wendy', 'Xavier', 'Yasmine', 'Zachary', 'Amber', 'Brandon', 'Chloe', 'Derek',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
  'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell',
  'Mitchell', 'Carter', 'Roberts', 'Turner', 'Phillips', 'Evans', 'Collins', 'Stewart',
];

const cities = [
  'New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Berlin', 'Toronto', 'Amsterdam',
  'Madrid', 'Rome', 'Seoul', 'Mumbai', 'Singapore', 'Dubai', 'Chicago', 'Los Angeles',
  'San Francisco', 'Seattle', 'Boston', 'Miami', 'Barcelona', 'Vienna', 'Prague',
  'Stockholm', 'Oslo', 'Copenhagen', 'Helsinki', 'Warsaw', 'Lisbon', 'Athens',
  'Cairo', 'Lagos', 'Nairobi', 'Cape Town', 'Buenos Aires', 'São Paulo', 'Mexico City',
];

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
  'Japan', 'Brazil', 'India', 'China', 'Italy', 'Spain', 'Netherlands', 'Sweden',
  'Norway', 'Denmark', 'Finland', 'Poland', 'Portugal', 'Greece', 'Turkey',
  'Mexico', 'Argentina', 'South Korea', 'Singapore', 'UAE', 'South Africa',
];

const streetTypes = ['Street', 'Avenue', 'Boulevard', 'Road', 'Lane', 'Drive', 'Court', 'Place'];
const streetNames = [
  'Main', 'Oak', 'Maple', 'Cedar', 'Elm', 'Park', 'Lake', 'Hill', 'River',
  'Sunset', 'Sunrise', 'Highland', 'Valley', 'Forest', 'Meadow', 'Harbor',
  'Spring', 'Summer', 'Autumn', 'Winter', 'Green', 'Blue', 'Red', 'Golden',
];

const companyNouns = ['Tech', 'Solutions', 'Systems', 'Group', 'Labs', 'Studios', 'Works', 'Co'];
const companyPrefixes = [
  'Alpha', 'Beta', 'Gamma', 'Apex', 'Prime', 'Core', 'Nexus', 'Nova', 'Vortex',
  'Bright', 'Smart', 'Bold', 'Swift', 'Peak', 'Volt', 'Axis', 'Echo', 'Drift',
];

const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com', 'company.org', 'mail.net'];
const tlds = ['.com', '.net', '.org', '.io', '.co', '.dev'];
const urlPaths = ['about', 'products', 'services', 'blog', 'contact', 'home', 'team', 'news', 'faq'];

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit',
  'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
  'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
];

const phonePrefixes = ['+1', '+44', '+49', '+33', '+81', '+55', '+91', '+86', '+61', '+34'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function padded(n: number, len: number): string {
  return String(n).padStart(len, '0');
}

function generateFirstName(): string {
  return pick(firstNames);
}
function generateLastName(): string {
  return pick(lastNames);
}
function generateFullName(): string {
  return `${pick(firstNames)} ${pick(lastNames)}`;
}

function generateEmail(): string {
  const first = pick(firstNames).toLowerCase();
  const last = pick(lastNames).toLowerCase();
  const sep = pick(['.', '_', '']);
  return `${first}${sep}${last}${rand(1, 99)}@${pick(domains)}`;
}

function generatePhone(): string {
  const prefix = pick(phonePrefixes);
  const area = rand(100, 999);
  const mid = rand(100, 999);
  const end = rand(1000, 9999);
  return `${prefix} ${area} ${mid} ${end}`;
}

function generateStreetAddress(): string {
  return `${rand(1, 9999)} ${pick(streetNames)} ${pick(streetTypes)}`;
}

function generateCity(): string {
  return pick(cities);
}
function generateCountry(): string {
  return pick(countries);
}

function generateCompany(): string {
  return `${pick(companyPrefixes)} ${pick(companyNouns)}`;
}

function generateLorem(): string {
  const wordCount = rand(8, 16);
  const words = Array.from({ length: wordCount }, () => pick(loremWords));
  const sentence = words.join(' ');
  return `${sentence.charAt(0).toUpperCase() + sentence.slice(1)}.`;
}

function generateIPv4(): string {
  return `${rand(1, 254)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}`;
}

function generateMAC(): string {
  return Array.from({ length: 6 }, () => padded(rand(0, 255).toString(16).toUpperCase(), 2)).join(':');
}

function generateCreditCard(): string {
  // Generate Luhn-valid 16-digit number starting with 4 (Visa)
  const digits: number[] = [4];
  for (let i = 0; i < 14; i++) {
    digits.push(rand(0, 9));
  }

  // Luhn check digit
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i]!;
    if (alt) {
      d *= 2;
      if (d > 9) {
        d -= 9;
      }
    }
    sum += d;
    alt = !alt;
  }
  const check = (10 - (sum % 10)) % 10;
  digits.push(check);

  const s = digits.join('');
  return `${s.slice(0, 4)} ${s.slice(4, 8)} ${s.slice(8, 12)} ${s.slice(12, 16)}`;
}

function generateDate(): string {
  const year = rand(1970, 2025);
  const month = padded(rand(1, 12), 2);
  const day = padded(rand(1, 28), 2);
  return `${year}-${month}-${day}`;
}

function generateColor(): string {
  const r = padded(rand(0, 255).toString(16), 2);
  const g = padded(rand(0, 255).toString(16), 2);
  const b = padded(rand(0, 255).toString(16), 2);
  return `#${r}${g}${b}`.toUpperCase();
}

function generateURL(): string {
  const prefix = pick(companyPrefixes).toLowerCase();
  const tld = pick(tlds);
  const path = pick(urlPaths);
  return `https://www.${prefix}${tld}/${path}`;
}

function generateUsername(): string {
  const first = pick(firstNames).toLowerCase();
  const last = pick(lastNames).toLowerCase();
  const num = rand(1, 999);
  return pick([
    `${first}${rand(1, 99)}`,
    `${first}_${last}`,
    `${last}${num}`,
    `${first.slice(0, 3)}${last.slice(0, 3)}${num}`,
  ]);
}

const generators: Record<string, () => string> = {
  'First Name': generateFirstName,
  'Last Name': generateLastName,
  'Full Name': generateFullName,
  'Email': generateEmail,
  'Phone Number': generatePhone,
  'Street Address': generateStreetAddress,
  'City': generateCity,
  'Country': generateCountry,
  'Company Name': generateCompany,
  'Lorem Ipsum': generateLorem,
  'IPv4 Address': generateIPv4,
  'MAC Address': generateMAC,
  'Credit Card': generateCreditCard,
  'Date': generateDate,
  'Color (Hex)': generateColor,
  'URL': generateURL,
  'Username': generateUsername,
};

export const dataTypes = Object.keys(generators);

export function generateFakeData(type: string, count: number): string[] {
  const gen = generators[type];
  if (!gen) {
    throw new Error(`Unknown data type: ${type}`);
  }
  return Array.from({ length: count }, () => gen());
}

export function generateFakeDataMulti(types: string[], count: number): Record<string, string>[] {
  return Array.from({ length: count }, () => {
    const row: Record<string, string> = {};
    for (const type of types) {
      const gen = generators[type];
      if (gen) {
        row[type] = gen();
      }
    }
    return row;
  });
}
