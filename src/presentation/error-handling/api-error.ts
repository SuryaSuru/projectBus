
import * as  HttpStatus from './http-status'

import * as  ErrorMessage from './message-error'

export class ErrorClass {
  status: number;
  message: string;
  name: string;

  constructor(status: number, message: string, name: string) {
    this.status = status;
    this.message = message;
    this.name = name;
  }
}

class ApiError extends ErrorClass {
  constructor(status: number, message: string, name: string = "ApiError") {
    super(status, message, name);
  }

  static customError(status: number, specificMessage: string): ApiError {
    return new ApiError(status, specificMessage);
  }

  static getOk(): ApiError {
    return new ApiError(HttpStatus.OK, ErrorMessage.FETCH_SUCCESS, "OK");
  }

  static created(): ApiError {
    return new ApiError(
      HttpStatus.CREATED,
      ErrorMessage.CREATE_SUCCESS,
      "Created"
    );
  }

  static noContent(): ApiError {
    return new ApiError(
      HttpStatus.NO_CONTENT,
      ErrorMessage.DELETED_SUCCESS,
      "NoContent"
    );
  }

  static notFound(): ApiError {
    return new ApiError(
      HttpStatus.NOT_FOUND,
      ErrorMessage.NOT_FOUND,
      "notfound"
    );
  }

  static badRequest(): ApiError {
    return new ApiError(
      HttpStatus.BAD_REQUEST,
      ErrorMessage.BAD_REQUEST,
      "badRequest"
    );
  }

  static unAuthorized(): ApiError {
    return new ApiError(
      HttpStatus.UNAUTHORIZED,
      ErrorMessage.UNAUTHORIZED,
      "unAuthorized"
    );
  }

  static noService(): ApiError {
    return new ApiError(
      HttpStatus.SERVICE_UNAVAILABLE,
      ErrorMessage.SERVICE_UNAVAILABLE,
      "noService"
    );
  }
  
  static internalError(): ApiError {
    return new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorMessage.CONFLICT,
      "conflict"
    );
  }


    //OWN ERROR
  static emailExits(): ApiError {
    return new ApiError(HttpStatus.CONFLICT, ErrorMessage.EMAIL_CONFLICT, "email_conflict");
  }

  static contactInfoExits(): ApiError {
    return new ApiError(HttpStatus.CONFLICT, ErrorMessage.CONTACT_INFO_CONFLICT, "contactInfo_conflict");
  }

  static busNumberExits(): ApiError {
    return new ApiError(HttpStatus.CONFLICT, ErrorMessage.BUS_NUMBER_CONFLICT, "busNumber_conflict");
  }

  static nameExits(): ApiError {
    return new ApiError(HttpStatus.CONFLICT, ErrorMessage.NAME_CONFLICT, "name_conflict");
  }
}

export default ApiError;
