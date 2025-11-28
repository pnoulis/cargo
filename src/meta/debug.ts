export function log(...args: any[]) {
  args.forEach((arg) => console.log(arg));
}

export function dir(...args: any[]) {
  args.forEach((arg) => console.dir(arg, { depth: null }));
}
