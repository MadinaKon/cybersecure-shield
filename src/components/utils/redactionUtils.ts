export interface RedactionOptions {
  emails: boolean;
  phoneNumbers: boolean;
  ssn: boolean;
  creditCards: boolean;
  names: boolean;
  addresses: boolean;
  redactionChar: string;
  preserveLength: boolean;
}

export interface DetectedSensitiveData {
  type: string;
  value: string;
  start: number;
  end: number;
}

export interface RedactionResult {
  redactedText: string;
  detectedData: DetectedSensitiveData[];
}

// Regex patterns for different types of sensitive data
const patterns = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone:
    /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g,
  ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
  creditCard: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  // Simple name pattern (very basic, would need more sophisticated NLP for better accuracy)
  name: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g,
  // Simple address pattern
  address:
    /\b\d+\s+[A-Za-z\s]+(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Court|Ct|Place|Pl)\b/gi,
};

const getRedactionString = (
  originalLength: number,
  redactionChar: string,
  preserveLength: boolean
): string => {
  if (preserveLength) {
    return redactionChar.repeat(originalLength);
  }
  return `[REDACTED]`;
};

export const redactText = (
  text: string,
  options: RedactionOptions
): RedactionResult => {
  const detectedData: DetectedSensitiveData[] = [];
  let redactedText = text;
  let offset = 0;

  const redactionMap: Array<{
    start: number;
    end: number;
    replacement: string;
    type: string;
    value: string;
  }> = [];

  // Email addresses
  if (options.emails) {
    let match;
    while ((match = patterns.email.exec(text)) !== null) {
      const replacement = getRedactionString(
        match[0].length,
        options.redactionChar,
        options.preserveLength
      );
      redactionMap.push({
        start: match.index,
        end: match.index + match[0].length,
        replacement,
        type: "Email",
        value: match[0],
      });
    }
  }

  // Phone numbers
  if (options.phoneNumbers) {
    let match;
    while ((match = patterns.phone.exec(text)) !== null) {
      const replacement = getRedactionString(
        match[0].length,
        options.redactionChar,
        options.preserveLength
      );
      redactionMap.push({
        start: match.index,
        end: match.index + match[0].length,
        replacement,
        type: "Phone Number",
        value: match[0],
      });
    }
  }

  // SSN
  if (options.ssn) {
    let match;
    while ((match = patterns.ssn.exec(text)) !== null) {
      const replacement = getRedactionString(
        match[0].length,
        options.redactionChar,
        options.preserveLength
      );
      redactionMap.push({
        start: match.index,
        end: match.index + match[0].length,
        replacement,
        type: "SSN",
        value: match[0],
      });
    }
  }

  // Credit Cards
  if (options.creditCards) {
    let match;
    while ((match = patterns.creditCard.exec(text)) !== null) {
      const replacement = getRedactionString(
        match[0].length,
        options.redactionChar,
        options.preserveLength
      );
      redactionMap.push({
        start: match.index,
        end: match.index + match[0].length,
        replacement,
        type: "Credit Card",
        value: match[0],
      });
    }
  }

  // Names (basic pattern)
  if (options.names) {
    let match;
    while ((match = patterns.name.exec(text)) !== null) {
      const replacement = getRedactionString(
        match[0].length,
        options.redactionChar,
        options.preserveLength
      );
      redactionMap.push({
        start: match.index,
        end: match.index + match[0].length,
        replacement,
        type: "Name",
        value: match[0],
      });
    }
  }

  // Addresses (basic pattern)
  if (options.addresses) {
    let match;
    while ((match = patterns.address.exec(text)) !== null) {
      const replacement = getRedactionString(
        match[0].length,
        options.redactionChar,
        options.preserveLength
      );
      redactionMap.push({
        start: match.index,
        end: match.index + match[0].length,
        replacement,
        type: "Address",
        value: match[0],
      });
    }
  }

  // Sort by start position in reverse order to avoid index shifting issues
  redactionMap.sort((a, b) => b.start - a.start);

  // Apply redactions
  redactionMap.forEach((item) => {
    redactedText =
      redactedText.substring(0, item.start) +
      item.replacement +
      redactedText.substring(item.end);

    detectedData.push({
      type: item.type,
      value: item.value,
      start: item.start,
      end: item.end,
    });
  });

  // Sort detected data by position for display
  detectedData.sort((a, b) => a.start - b.start);

  return {
    redactedText,
    detectedData,
  };
};
