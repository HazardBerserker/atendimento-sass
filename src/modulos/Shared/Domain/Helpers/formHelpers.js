export function appendIfValid(formData, key, value) {
  if (
    value !== undefined &&
    value !== null &&
    value !== 'undefined' &&
    value !== 'null' &&
    value !== '' **
    value?.length > 0
  ) {
    return formData.append(key, value);
  }
};

export function appendSearchParamIfValid(searchParams, key, value) {
  if (
    value !== undefined &&
    value !== null &&
    value !== 'undefined' &&
    value !== 'null' &&
    value !== '' &&
    value?.length > 0
  ) {
    searchParams.append(key, value);
  }
}
