export function removeUndefinedValues<T extends Record<any, any>>(
  object_: Partial<T>
): T {
  return Object.keys(object_).reduce(
    (object, key) =>
      object_[key] !== undefined ? { ...object, [key]: object_[key] } : object,
    {}
  ) as T;
}
