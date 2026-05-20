export interface ValidationResult {
  valid: boolean
  errors: string[]
}

type JsonSchema = Record<string, unknown>;
type JsonValue = string | number | boolean | null | JsonValue[] | Record<string, JsonValue>;

function getJsonType(value: JsonValue): string {
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  return typeof value;
}

function validateFormat(value: string, format: string, path: string): string | null {
  switch (format) {
    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return `${path}: invalid email format`;
      }
      break;
    }
    case 'uri': {
      try {
        // eslint-disable-next-line no-new
        new URL(value);
      }
      catch {
        return `${path}: invalid URI format`;
      }
      break;
    }
    case 'date': {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) {
        return `${path}: invalid date format (expected YYYY-MM-DD)`;
      }
      break;
    }
    case 'date-time': {
      if (Number.isNaN(Date.parse(value))) {
        return `${path}: invalid date-time format`;
      }
      break;
    }
    case 'ipv4': {
      const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipv4Regex.test(value) || value.split('.').some(n => Number(n) > 255)) {
        return `${path}: invalid IPv4 format`;
      }
      break;
    }
    case 'uuid': {
      const uuidRegex = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;
      if (!uuidRegex.test(value)) {
        return `${path}: invalid UUID format`;
      }
      break;
    }
  }
  return null;
}

function validateValue(value: JsonValue, schema: JsonSchema, path: string): string[] {
  const errors: string[] = [];

  if (schema.type !== undefined) {
    const expectedType = schema.type as string | string[];
    const types = Array.isArray(expectedType) ? expectedType : [expectedType];
    const actualType = getJsonType(value);
    if (!types.includes(actualType)) {
      errors.push(`${path}: expected type "${types.join(' | ')}", got "${actualType}"`);
      return errors;
    }
  }

  if (schema.enum !== undefined) {
    const enumValues = schema.enum as JsonValue[];
    if (!enumValues.some(e => JSON.stringify(e) === JSON.stringify(value))) {
      errors.push(`${path}: value must be one of [${enumValues.map(e => JSON.stringify(e)).join(', ')}]`);
    }
  }

  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < (schema.minLength as number)) {
      errors.push(`${path}: string length ${value.length} is less than minLength ${schema.minLength}`);
    }
    if (schema.maxLength !== undefined && value.length > (schema.maxLength as number)) {
      errors.push(`${path}: string length ${value.length} exceeds maxLength ${schema.maxLength}`);
    }
    if (schema.pattern !== undefined) {
      const regex = new RegExp(schema.pattern as string);
      if (!regex.test(value)) {
        errors.push(`${path}: string does not match pattern "${schema.pattern}"`);
      }
    }
    if (schema.format !== undefined) {
      const formatError = validateFormat(value, schema.format as string, path);
      if (formatError) {
        errors.push(formatError);
      }
    }
  }

  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < (schema.minimum as number)) {
      errors.push(`${path}: value ${value} is less than minimum ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && value > (schema.maximum as number)) {
      errors.push(`${path}: value ${value} exceeds maximum ${schema.maximum}`);
    }
    if (schema.exclusiveMinimum !== undefined && value <= (schema.exclusiveMinimum as number)) {
      errors.push(`${path}: value ${value} must be greater than exclusiveMinimum ${schema.exclusiveMinimum}`);
    }
    if (schema.exclusiveMaximum !== undefined && value >= (schema.exclusiveMaximum as number)) {
      errors.push(`${path}: value ${value} must be less than exclusiveMaximum ${schema.exclusiveMaximum}`);
    }
    if (schema.multipleOf !== undefined) {
      const multiple = schema.multipleOf as number;
      if (value % multiple !== 0) {
        errors.push(`${path}: value ${value} is not a multiple of ${multiple}`);
      }
    }
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < (schema.minItems as number)) {
      errors.push(`${path}: array has ${value.length} items, minimum is ${schema.minItems}`);
    }
    if (schema.maxItems !== undefined && value.length > (schema.maxItems as number)) {
      errors.push(`${path}: array has ${value.length} items, maximum is ${schema.maxItems}`);
    }
    if (schema.items !== undefined) {
      const itemSchema = schema.items as JsonSchema;
      value.forEach((item, i) => {
        errors.push(...validateValue(item as JsonValue, itemSchema, `${path}[${i}]`));
      });
    }
    if (schema.uniqueItems === true) {
      const seen = new Set<string>();
      value.forEach((item, i) => {
        const key = JSON.stringify(item);
        if (seen.has(key)) {
          errors.push(`${path}[${i}]: duplicate item (uniqueItems constraint violated)`);
        }
        seen.add(key);
      });
    }
  }

  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, JsonValue>;

    if (schema.required !== undefined) {
      const requiredFields = schema.required as string[];
      for (const field of requiredFields) {
        if (!(field in obj)) {
          errors.push(`${path}: missing required property "${field}"`);
        }
      }
    }

    if (schema.properties !== undefined) {
      const properties = schema.properties as Record<string, JsonSchema>;
      for (const [key, propSchema] of Object.entries(properties)) {
        if (key in obj) {
          errors.push(...validateValue(obj[key], propSchema, `${path}.${key}`));
        }
      }
    }

    if (schema.additionalProperties === false && schema.properties !== undefined) {
      const allowedProps = Object.keys(schema.properties as Record<string, JsonSchema>);
      for (const key of Object.keys(obj)) {
        if (!allowedProps.includes(key)) {
          errors.push(`${path}: additional property "${key}" is not allowed`);
        }
      }
    }

    if (schema.minProperties !== undefined && Object.keys(obj).length < (schema.minProperties as number)) {
      errors.push(`${path}: object has ${Object.keys(obj).length} properties, minimum is ${schema.minProperties}`);
    }
    if (schema.maxProperties !== undefined && Object.keys(obj).length > (schema.maxProperties as number)) {
      errors.push(`${path}: object has ${Object.keys(obj).length} properties, maximum is ${schema.maxProperties}`);
    }
  }

  if (schema.allOf !== undefined) {
    const allOf = schema.allOf as JsonSchema[];
    for (const subSchema of allOf) {
      errors.push(...validateValue(value, subSchema, path));
    }
  }

  if (schema.anyOf !== undefined) {
    const anyOf = schema.anyOf as JsonSchema[];
    const anyErrors = anyOf.map(s => validateValue(value, s, path));
    if (anyErrors.every(e => e.length > 0)) {
      errors.push(`${path}: value does not match any of the anyOf schemas`);
    }
  }

  if (schema.oneOf !== undefined) {
    const oneOf = schema.oneOf as JsonSchema[];
    const matching = oneOf.filter(s => validateValue(value, s, path).length === 0);
    if (matching.length !== 1) {
      errors.push(`${path}: value must match exactly one of the oneOf schemas (matched ${matching.length})`);
    }
  }

  if (schema.not !== undefined) {
    const notSchema = schema.not as JsonSchema;
    if (validateValue(value, notSchema, path).length === 0) {
      errors.push(`${path}: value must NOT match the "not" schema`);
    }
  }

  if (schema.if !== undefined) {
    const ifSchema = schema.if as JsonSchema;
    const ifErrors = validateValue(value, ifSchema, path);
    if (ifErrors.length === 0 && schema.then !== undefined) {
      errors.push(...validateValue(value, schema.then as JsonSchema, path));
    }
    else if (ifErrors.length > 0 && schema.else !== undefined) {
      errors.push(...validateValue(value, schema.else as JsonSchema, path));
    }
  }

  return errors;
}

export function validateJsonSchema(json: string, schema: string): ValidationResult {
  if (!json.trim()) {
    return { valid: false, errors: ['JSON input is empty'] };
  }
  if (!schema.trim()) {
    return { valid: false, errors: ['JSON Schema input is empty'] };
  }

  let parsedJson: JsonValue;
  let parsedSchema: JsonSchema;

  try {
    parsedJson = JSON.parse(json);
  }
  catch (e: unknown) {
    return { valid: false, errors: [`Invalid JSON: ${(e as Error).message}`] };
  }

  try {
    parsedSchema = JSON.parse(schema) as JsonSchema;
  }
  catch (e: unknown) {
    return { valid: false, errors: [`Invalid JSON Schema: ${(e as Error).message}`] };
  }

  const errors = validateValue(parsedJson, parsedSchema, '$');
  return { valid: errors.length === 0, errors };
}
