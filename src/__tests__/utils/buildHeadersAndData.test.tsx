import { describe, it, expect } from "vitest";
import type { VariableItem, headersList } from "../../type/type";
import { buildHeaders, buildRequestData } from "../../utils/buildHeadersAndData";

describe("buildHeaders", () => {
  const variables: VariableItem[] = [
    { varName: "token", varValue: "abc" },
    { varName: "username", varValue: "timofey" },
  ];

  it("should build headers object with substituted values", () => {
    const headers: headersList = [
      { key: "Authorization", value: "Bearer {{token}}" },
      { key: "X-User", value: "{{username}}" },
    ];
    const result = buildHeaders(headers, variables);
    expect(result).toEqual({
      Authorization: "Bearer abc",
      "X-User": "timofey",
    });
  });

  it("should leave placeholders if variables are missing", () => {
    const headers: headersList = [{ key: "X-Test", value: "{{missing}}" }];
    const result = buildHeaders(headers, variables);
    expect(result).toEqual({ "X-Test": "{{missing}}" });
  });

  it("should replace both key and value", () => {
    const headers: headersList = [{ key: "{{username}}-id", value: "Bearer {{token}}" }];
    const result = buildHeaders(headers, variables);
    expect(result).toEqual({ "timofey-id": "Bearer abc" });
  });
});

describe("buildRequestData", () => {
  const variables: VariableItem[] = [
    { varName: "id", varValue: "42" },
    { varName: "name", varValue: "timofey" },
  ];

  it("should substitute url and body with variables", () => {
    const url = "/api/item/{{id}}";
    const body = '{"name": "{{name}}"}';
    const method = "POST";
    const result = buildRequestData(url, body, method, variables);
    expect(result).toEqual({
      url: "/api/item/42",
      body: '{"name": "timofey"}',
      method: "POST",
    });
  });

  it("should leave placeholders if variables are missing", () => {
    const url = "/api/item/{{missing}}";
    const body = '{"value": "{{missing}}"}';
    const method = "GET";
    const result = buildRequestData(url, body, method, variables);
    expect(result).toEqual({
      url: "/api/item/{{missing}}",
      body: '{"value": "{{missing}}"}',
      method: "GET",
    });
  });

  it("should keep method unchanged", () => {
    const url = "/api/test";
    const body = "{}";
    const method = "PUT";
    const result = buildRequestData(url, body, method, variables);
    expect(result.method).toBe("PUT");
  });
});
