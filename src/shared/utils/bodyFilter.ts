/**
 * Filters the properties of a given object based on the specified fields.
 * This function is generic and can be used with any object type.
 *
 * @param requestBody - The object to be filtered.
 * @param fields - A rest parameter that specifies the keys of the properties to be retained in the filtered object.
 * @returns A new object containing only the specified fields from the original object. If no fields are specified, an empty object is returned.
 *
 * @example
 * const user = { name: 'John Doe', age: 30, email: 'john@example.com' };
 * const filteredUser = bodyFilter(user, 'name', 'email');
 * // filteredUser will be { name: 'John Doe', email: 'john@example.com' }
 */
export const bodyFilter = <T extends Record<string, any>>(
  requestBody: T,
  ...fields: (keyof T)[]
) => {
  const filteredBody: Partial<T> = {};
  if (fields.length === 0) {
    return { ...filteredBody };
  }

  Object.keys(requestBody).forEach((el) => {
    const key = el as keyof T;
    if (fields.includes(key)) {
      filteredBody[key] = requestBody[key];
    }
  });

  return filteredBody;
};
