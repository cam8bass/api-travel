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
