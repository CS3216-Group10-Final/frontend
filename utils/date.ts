import parseISO from "date-fns/parseISO";

// from https://stackoverflow.com/questions/65692061/casting-dates-properly-from-an-api-response-in-typescript

const dateFormat =
  /[+-]?\d{4}(-[01]\d(-[0-3]\d(T[0-2]\d:[0-5]\d:?([0-5]\d(\.\d+)?)?[+-][0-2]\d:[0-5]\dZ?)?)?)?/;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidDate(data: any) {
  return data && typeof data === "string" && dateFormat.test(data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== "object")
    return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isValidDate(value)) body[key] = parseISO(value);
    else if (typeof value === "object") handleDates(value);
  }
}
export default handleDates;
