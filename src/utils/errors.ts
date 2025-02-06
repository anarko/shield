const ErrorType: { [key: string]: string } = {
  invalidCredentials: "INVALID_CREDENTIALS",
  userAlreadyExists: "USER_ALREADY_EXISTS",
  invalidData: "INVALID_DATA",
  invalidConfig: "INVALID_CONFIG",
  internalServerError: "INTERNAL_SERVER_ERROR",
  databaseError: "DATABASE_ERROR",
  walletAlreadyExists: "WALLET_ALREADY_EXISTS",
  walletNotFound: "WALLET_NOT_FOUND",
};

const StatusCodeMap: { [key: string]: number } = {
  INVALID_CREDENTIALS: 401,
  INVALID_DATA: 400,
  INVALID_CONFIG: 404,
  USER_ALREADY_EXISTS: 409,
  WALLET_ALREADY_EXISTS: 409,
  WALLET_NOT_FOUND: 404,
};

export class ServerError extends Error {
  constructor(
    public name: string,
    public description: string = "",
    public data: Record<string, any> | undefined = undefined,
    public statusCode: number = 500
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export type ErrorName = keyof typeof ErrorType;
type ErrorHandler = (
  description?: string,
  data?: Record<string, any>
) => ServerError;

export const Errors = Object.keys(ErrorType).reduce(
  (previous, name) => ({
    ...previous,
    [name]: (description: string, data: any) =>
      new ServerError(
        ErrorType[name],
        description,
        data,
        StatusCodeMap[ErrorType[name]]
      ),
  }),
  {}
) as Record<ErrorName, ErrorHandler>;

export default Errors;
