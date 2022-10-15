/**
 * Can be used to throw error after ?? Nullish Coalescing operator.
 *
 * @param {Error} error
 * @returns {never}
 */
export const _throw = (error: Error): never => {
  throw error;
};
