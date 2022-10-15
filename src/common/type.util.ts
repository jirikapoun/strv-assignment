// export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type NonFunctionPropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export type IdOf<T> = T extends { id: infer U } ? U : never;


// type NullablePropertyNames<T> = {
//   [K in keyof T]: null extends T[K] ? K : never;
// }[keyof T];
//
// type NullableToOptional<T> = Omit<T, NullablePropertyNames<T>> &
//   Partial<Pick<T, NullablePropertyNames<T>>>;
//
// export type RecursiveNonFunctionProperties<T> =
//   | {
//       [K in keyof NonFunctionProperties<T>]: T[K] extends (infer U)[]
//         ? RecursiveNonFunctionProperties<U>[]
//         : // eslint-disable-next-line @typescript-eslint/ban-types
//         T[K] extends object | null | undefined
//         ? RecursiveNonFunctionProperties<T[K]>
//         : T[K];
//     }
//   | T;
//
// export type RequiredRecursive<T> = {
//   [P in keyof T]-?: T[P] extends (infer U)[]
//     ? RequiredRecursive<U>[]
//     : // eslint-disable-next-line @typescript-eslint/ban-types
//     T[P] extends object | null | undefined
//     ? RequiredRecursive<T[P]>
//     : T[P];
// };
//
// export type PartialRecursive<T> = {
//   [P in keyof T]?: T[P] extends (infer U)[]
//     ? PartialRecursive<U>[]
//     : // eslint-disable-next-line @typescript-eslint/ban-types
//     T[P] extends object | null | undefined
//     ? PartialRecursive<T[P]>
//     : T[P];
// };
//
// /**
//  * Selected properties will be optional. Others as in original type.
//  */
// export type PartialSelected<T, K extends keyof T> = Pick<
//   T,
//   Exclude<keyof T, K>
// > &
//   Partial<Pick<T, K>>;
//
// export declare type DeepReadonly<T> = T extends
//   | string
//   | number
//   | boolean
//   | bigint
//   | symbol
//   | undefined
//   | null
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   | Function
//   | Date
//   | Error
//   | RegExp
//   ? T
//   : T extends Map<infer K, infer V>
//   ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
//   : T extends ReadonlyMap<infer K, infer V>
//   ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
//   : T extends WeakMap<infer K, infer V>
//   ? WeakMap<DeepReadonly<K>, DeepReadonly<V>>
//   : T extends Set<infer U>
//   ? ReadonlySet<DeepReadonly<U>>
//   : T extends ReadonlySet<infer U>
//   ? ReadonlySet<DeepReadonly<U>>
//   : T extends WeakSet<infer U>
//   ? WeakSet<DeepReadonly<U>>
//   : T extends Promise<infer U>
//   ? Promise<DeepReadonly<U>>
//   : // eslint-disable-next-line @typescript-eslint/ban-types
//   T extends {}
//   ? {
//       readonly [K in keyof T]: DeepReadonly<T[K]>;
//     }
//   : Readonly<T>;
