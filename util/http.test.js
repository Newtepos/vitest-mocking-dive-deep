import { it, vi, expect } from "vitest";
import { HttpError } from "./errors.js";
import { sendDataRequest } from "./http.js";

const testResponseData = {
  testKey: "testData",
};

const testFetch = vi.fn((url, options) => {
  return new Promise((resolve, reject) => {
    if (typeof options.body !== "string") {
      return reject("Not a string");
    }
    const testResponse = {
      ok: true,
      json: () => {
        return new Promise((resolve, reject) => {
          resolve(testResponseData);
        });
      },
    };
    resolve(testResponse);
  });
});

vi.stubGlobal("fetch", testFetch);

it("should return any available response data", () => {
  const testData = { key: "test" };
  return expect(sendDataRequest(testData)).resolves.toEqual(testResponseData);
});

it("should convert the provied data to JSON before sending request", async () => {
  const testData = { key: "test" };

  let errorMessage;
  try {
    await expect(sendDataRequest(testData));
  } catch (error) {
    errorMessage = error;
  }

  expect(errorMessage).not.toBe("Not a string");
});

it("should throw an HttpError in case of non-ok response", () => {
  testFetch.mockImplementationOnce((url, options) => {
    return new Promise((resolve, reject) => {
      const testResponse = {
        ok: false,
        json: () => {
          return new Promise((resolve, reject) => {
            resolve(testResponseData);
          });
        },
      };
      resolve(testResponse);
    });
  });

  const testData = { key: "test" };

  return expect(sendDataRequest(testData)).rejects.toBeInstanceOf(HttpError);
});
