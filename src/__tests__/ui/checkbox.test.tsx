
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { Checkbox } from "../../components/ui/checkbox";

describe("Checkbox component", () => {
  test("renders unchecked checkbox", () => {
    render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox") as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.getAttribute("data-state")).toBe("unchecked");
  });

  test("renders checked checkbox", () => {
    render(<Checkbox defaultChecked data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox") as HTMLInputElement;
    expect(checkbox.getAttribute("data-state")).toBe("checked");
  });

  test("calls onCheckedChange when clicked", () => {
    const handleChange = vi.fn();
    render(<Checkbox onCheckedChange={handleChange} data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledOnce();
  });

  test("applies custom className", () => {
    render(<Checkbox className="custom-class" data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");
    expect(checkbox.className).toContain("custom-class");
  });

  test("disabled checkbox cannot be clicked", () => {
    const handleChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={handleChange} data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");
    fireEvent.click(checkbox);
    expect(handleChange).not.toHaveBeenCalled();
    expect(checkbox).toHaveAttribute("disabled");
  });
});
