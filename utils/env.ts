// Read a required environment variable, failing fast if it is missing
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  standardUser: required('STANDARD_USER'),
  lockedUser: required('LOCKED_USER'),
  password: required('PASSWORD'),
  apiUser: required('API_USER'),
  apiPassword: required('API_PASSWORD'),
  visualUser: required('VISUAL_USER'),
  problemUser: required('PROBLEM_USER'),
};
