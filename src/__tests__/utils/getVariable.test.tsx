import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getVariable } from "../../utils/getVariable";
import type { VariableItem } from "../../type/type";

describe("getVariable", () => {
  const mockId = "test-id";
  const mockData: VariableItem[] = [
    { varName: "token", varValue: "123" },
    { varName: "user", varValue: "timofey" },
  ];

  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn() as unknown as (key: string) => string | null,
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return empty array when localStorage has no data", () => {
    const getItemMock = localStorage.getItem as unknown as ReturnType<typeof vi.fn>;
    getItemMock.mockReturnValue(null);

    const result = getVariable(mockId);
    expect(result).toEqual([]);
  });

  it("should return parsed data when localStorage has valid JSON", () => {
    const getItemMock = localStorage.getItem as unknown as ReturnType<typeof vi.fn>;
    getItemMock.mockReturnValue(JSON.stringify(mockData));

    const result = getVariable(mockId);
    expect(result).toEqual(mockData);
  });

  it("should throw error when JSON is invalid", () => {
    const getItemMock = localStorage.getItem as unknown as ReturnType<typeof vi.fn>;
    getItemMock.mockReturnValue("{invalid json}");

    expect(() => getVariable(mockId)).toThrow();
  });
});
