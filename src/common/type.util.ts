type NonFunctionPropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

/** Eliminates all properties that are functions from the type. */
export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

/** Extracts type of the object's `id` property. */
export type IdOf<T> = T extends { id: infer U } ? U : never;
