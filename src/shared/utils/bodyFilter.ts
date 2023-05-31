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
    console.log(key);
    if (fields.includes(key)) {
      filteredBody[key] = requestBody[key];
    }
  });

  return filteredBody;
};
