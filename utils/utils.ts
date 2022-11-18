export type IEqualsFunction<T> = (a: T, b: T) => boolean;

export function defaultEquals<T>(a: T, b: T): boolean {
  //TODO:better compare
  if (Array.isArray(a) && Array.isArray(b)) {
    let flag = true;
    a.forEach((v, k) => {
      if (b[k] !== v) {
        flag = false;
      }
    });
    return flag;
  } else {
    return a === b;
  }
}
