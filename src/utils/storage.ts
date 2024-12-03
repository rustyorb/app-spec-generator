const STORAGE_KEY = 'claude_api_key';

export const saveApiKey = (apiKey: string) => {
  localStorage.setItem(STORAGE_KEY, apiKey);
};

export const getApiKey = () => {
  return localStorage.getItem(STORAGE_KEY);
};

export const removeApiKey = () => {
  localStorage.removeItem(STORAGE_KEY);
};