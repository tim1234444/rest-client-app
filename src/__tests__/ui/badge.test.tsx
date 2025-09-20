import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Badge } from "../../components/ui/badge";

describe("Badge", () => {
  test("renders with default variant", () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("bg-primary");
  });

  test("renders with secondary variant", () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    const badge = screen.getByText("Secondary Badge");
    expect(badge.className).toContain("bg-secondary");
  });

  test("renders with destructive variant", () => {
    render(<Badge variant="destructive">Delete</Badge>);
    const badge = screen.getByText("Delete");
    expect(badge.className).toContain("bg-destructive");
  });

  test("renders with outline variant", () => {
    render(<Badge variant="outline">Outlined</Badge>);
    const badge = screen.getByText("Outlined");
    expect(badge.className).toContain("text-foreground");
  });

  test("applies custom className", () => {
    render(<Badge className="custom-class">With custom class</Badge>);
    const badge = screen.getByText("With custom class");
    expect(badge.className).toContain("custom-class");
  });

  test("passes additional props", () => {
    render(<Badge data-testid="badge">With props</Badge>);
    const badge = screen.getByTestId("badge");
    expect(badge).toBeInTheDocument();
  });
});
