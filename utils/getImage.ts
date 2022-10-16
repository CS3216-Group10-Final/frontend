export function getImage(path: string) {
  return `${process.env.NEXT_PUBLIC_BE_ENDPOINT}${path}`;
}
