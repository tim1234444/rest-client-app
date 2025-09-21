import { describe, it, expect, vi } from "vitest";
import { Validate } from "../../utils/validate";

describe("Validate (with real schema)", () => {
  it("returns true when data is valid", async () => {
    const setErrors = vi.fn();

    const formData = { url: "/api/test", method: "GET" };

    const result = await Validate(formData, setErrors);

    expect(result).toBe(true);
    expect(setErrors).not.toHaveBeenCalled();
  });

  it("returns false and sets errors when data is invalid", async () => {
    const setErrors = vi.fn();

    const formData = { url: "", method: "" };

    const result = await Validate(formData, setErrors);

    expect(result).toBe(false);
    expect(setErrors).toHaveBeenCalled();

    const errors = setErrors.mock.calls[0][0];
    expect(errors).toHaveProperty("url");
    expect(errors).toHaveProperty("method");
  });
});
