export {};

declare global {
  interface Window {
    ethereum: any;
  }
  namespace NodeJS {
    interface ProcessEnv {
      VIGNETTE_ADDRESS: string;
    }
  }
}