// Given user input, pull signature out if it's raw, quote wrapped, or in an
// object response
export function parseSignatureFromInput(input: string): string {
  try {
    const json = JSON.parse(input);
    if (json.signature) {
      return json.signature;
    }
    if (typeof json === 'string') {
      return json;
    }
  }
  catch (err) { /* no op */ }
  return input;
}
