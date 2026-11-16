// Tijori se value nikaalo; agar missing hai toh saaf error do
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ .env mein ${name} missing hai!`);
  }
  return value;
}

export const env = {
  standardUser: required('STANDARD_USER'),
  lockedUser: required('LOCKED_USER'),
  password: required('PASSWORD'),
  apiUser:required('API_USER'),
  apiPassword:required('API_PASSWORD')

};