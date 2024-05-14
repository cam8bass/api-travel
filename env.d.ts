declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: "development" | "production";
    PORT: string;
    DATABASE: string;
    DATABASE_PASSWORD: string;
    API_KEY_SECRET: string;
    API_KEY_EXPIRES: string;
    INFISICAL_TOKEN: string;
    URL_API_CONNECT_DEV:string;
    URL_API_CONNECT_PROD:string
  }
}
