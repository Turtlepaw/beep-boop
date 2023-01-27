function validateEnv<T extends string = string>(
  key: keyof NodeJS.ProcessEnv,
  defaultValue?: T,
  warnDefault = false
): T {
  const value = process.env[key] as T | undefined;

  if (!value) {
    if (typeof defaultValue !== "undefined") {
      if (warnDefault) {
        const message = `validateEnv is using a default value for ${key} and has this warning enabled.`;
        console.warn(new Error(message));
      }

      return defaultValue;
    } else {
      throw new Error(`${key} is not defined in environment variables`);
    }
  }

  return value;
}

export const config = {
  cookieName: "token",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  appUri: process.env.APP_URI, //validateEnv("APP_URI", "http://localhost:3000", true),
  apiUri: process.env.API_URI, //validateEnv("API_URI", "http://localhost:4000", true),
  apiToken: process.env.API_TOKEN, //validateEnv("API_TOKEN", "", true),
  jwtSecret: process.env.JWT_SECRET, /*validateEnv(
    "JWT_SECRET",
    "this is a development value that should be changed in production!!!!!",
    true
  ),*/
  botToken: process.env.TOKEN, /*validateEnv(
    "TOKEN",
    "this is your bot's token",
    true
  )*/
} as const;
