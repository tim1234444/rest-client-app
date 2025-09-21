import { describe, test, expect } from "vitest";
import type { headersList } from "../../type/type";
import { parseUrlParams } from "../../utils/parseUrlParams";

describe("parseUrlParams", () => {
  test("should correctly parse all parameters", () => {
    const method = "POST";
    const url = "https://example.com/api";
    const body = '{"foo":"bar"}';

    const arr = [
      method,
      encodeURIComponent(btoa(url)),
      encodeURIComponent(btoa(body)),
    ];
    const searchParams = new URLSearchParams([
      ["Authorization", "Bearer token"],
      ["Content-Type", "application/json"],
    ]);

    const [parsedMethod, parsedUrl, parsedBody, headers] = parseUrlParams(arr, searchParams);

    expect(parsedMethod).toBe(method);
    expect(parsedUrl).toBe(url);
    expect(parsedBody).toBe(body);

    expect(headers).toEqual<headersList>([
      { key: "Authorization", value: "Bearer token" },
      { key: "Content-Type", value: "application/json" },
    ]);
  });

  test("should default method to GET if missing", () => {
    const arr: string[] = [];
    const searchParams = new URLSearchParams();

    const [parsedMethod] = parseUrlParams(arr, searchParams);

    expect(parsedMethod).toBe("GET");
  });

  test("should return empty strings for url and body if missing", () => {
    const arr: string[] = ["POST"];
    const searchParams = new URLSearchParams();

    const [, parsedUrl, parsedBody] = parseUrlParams(arr, searchParams);

    expect(parsedUrl).toBe("");
    expect(parsedBody).toBe("");
  });

  test("should handle undefined paramsArray as empty", () => {
    const searchParams = new URLSearchParams();
    const [parsedMethod, parsedUrl, parsedBody, headers] = parseUrlParams(undefined, searchParams);

    expect(parsedMethod).toBe("GET");
    expect(parsedUrl).toBe("");
    expect(parsedBody).toBe("");
    expect(headers).toEqual([]);
  });

  test("should return an empty headers list if searchParams is empty", () => {
    const arr: string[] = ["GET"];
    const searchParams = new URLSearchParams();

    const [, , , headers] = parseUrlParams(arr, searchParams);

    expect(headers).toEqual([]);
  });
});
