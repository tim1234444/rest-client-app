import { describe, it, expect } from "vitest";
import { substitute, substituteHeaders } from "../../utils/substitute"; 
import type { VariableItem, headersList } from "../../type/type";

describe("substitute", () => {
  const variables: VariableItem[] = [
    { varName: "token", varValue: "12345" },
    { varName: "username", varValue: "timofey" },
  ];

  it("replaces a single variable", () => {
    const result = substitute("Bearer {{token}}", variables);
    expect(result).toBe("Bearer 12345");
  });

  it("replaces multiple variables", () => {
    const result = substitute("User {{username}}, token={{token}}", variables);
    expect(result).toBe("User timofey, token=12345");
  });

  it("keeps {{placeholder}} if variable is missing", () => {
    const result = substitute("Unknown {{missing}}", variables);
    expect(result).toBe("Unknown {{missing}}");
  });

  it("handles spaces inside {{ }}", () => {
    const result = substitute("Bearer {{ token }}", variables);
    expect(result).toBe("Bearer 12345");
  });

  it("returns original string without {{}}", () => {
    const result = substitute("No placeholders", variables);
    expect(result).toBe("No placeholders");
  });
});

describe("substituteHeaders", () => {
  const variables: VariableItem[] = [
    { varName: "token", varValue: "abc" },
    { varName: "username", varValue: "timofey" },
  ];

  it("replaces values inside headers", () => {
    const headers: headersList = [
      { key: "Authorization", value: "Bearer {{token}}" },
      { key: "X-User", value: "{{username}}" },
    ];
    const result = substituteHeaders(headers, variables);
    expect(result).toEqual([
      { key: "Authorization", value: "Bearer abc" },
      { key: "X-User", value: "timofey" },
    ]);
  });

  it("keeps {{placeholder}} if variable is missing in headers", () => {
    const headers: headersList = [{ key: "X-Test", value: "{{unknown}}" }];
    const result = substituteHeaders(headers, variables);
    expect(result).toEqual([{ key: "X-Test", value: "{{unknown}}" }]);
  });

  it("replaces both key and value", () => {
    const headers: headersList = [
      { key: "{{username}}-id", value: "Bearer {{token}}" },
    ];
    const result = substituteHeaders(headers, variables);
    expect(result).toEqual([{ key: "timofey-id", value: "Bearer abc" }]);
  });
});
