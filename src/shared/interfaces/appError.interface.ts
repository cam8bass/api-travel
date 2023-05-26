export interface AppErrorInterface extends Error {
  status: string;
  statusCode: number;
  isOperational: boolean;
}
