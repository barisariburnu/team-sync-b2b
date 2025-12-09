/**
 * Ortam değişkenini okur. Değer yoksa ve varsayılan sağlanmadıysa hata fırlatır.
 */
export const getEnv = (key: string, defaultValue: string = ''): string => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
};
