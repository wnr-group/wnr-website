import { describe, expect, it } from "vitest";
import {
  BadRequestError,
  UnauthorizedError,
  PayloadTooLargeError,
  UnsupportedFileTypeError,
  ValidationError,
  RateLimitError,
  InternalServerError,
  isAppError,
} from "./errors";

describe("Error class hierarchy", () => {
  it("AppError serialises without stack trace", () => {
    const err = new BadRequestError("test");
    const json = err.toJSON();
    expect(json).toEqual({ code: "BAD_REQUEST", message: "test" });
    expect(JSON.stringify(json)).not.toContain("stack");
  });

  it("BadRequestError has status 400", () => {
    const err = new BadRequestError();
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe("BAD_REQUEST");
  });

  it("UnauthorizedError has status 401", () => {
    expect(new UnauthorizedError().statusCode).toBe(401);
  });

  it("PayloadTooLargeError has status 413", () => {
    expect(new PayloadTooLargeError().statusCode).toBe(413);
  });

  it("UnsupportedFileTypeError has status 415", () => {
    expect(new UnsupportedFileTypeError().statusCode).toBe(415);
  });

  it("ValidationError has status 422 and includes fieldErrors", () => {
    const err = new ValidationError([{ field: "email", message: "Invalid email." }]);
    expect(err.statusCode).toBe(422);
    expect(err.fieldErrors).toHaveLength(1);
    const json = err.toJSON();
    expect(json.fieldErrors).toHaveLength(1);
    expect(json.fieldErrors?.[0].field).toBe("email");
  });

  it("RateLimitError has status 429 and retryAfterMs", () => {
    const err = new RateLimitError(30_000);
    expect(err.statusCode).toBe(429);
    expect(err.retryAfterMs).toBe(30_000);
  });

  it("InternalServerError has status 500", () => {
    expect(new InternalServerError().statusCode).toBe(500);
  });

  it("isAppError returns true for AppError subclasses", () => {
    expect(isAppError(new BadRequestError())).toBe(true);
    expect(isAppError(new ValidationError([]))).toBe(true);
  });

  it("isAppError returns false for plain errors", () => {
    expect(isAppError(new Error("plain"))).toBe(false);
    expect(isAppError("string")).toBe(false);
    expect(isAppError(null)).toBe(false);
  });

  it("AppError is instanceof Error", () => {
    expect(new BadRequestError()).toBeInstanceOf(Error);
  });
});
