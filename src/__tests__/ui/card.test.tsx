import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";

describe("Card components", () => {
  test("Card renders with default class", () => {
    render(<Card>Card Content</Card>);
    const card = screen.getByText("Card Content");
    expect(card).toBeInTheDocument();
    expect(card.className).toContain("rounded-xl");
    expect(card.className).toContain("bg-card");
  });

  test("CardHeader renders with correct class and children", () => {
    render(<CardHeader>Header</CardHeader>);
    const header = screen.getByText("Header");
    expect(header.className).toContain("flex flex-col");
  });

  test("CardTitle renders correctly", () => {
    render(<CardTitle>Title</CardTitle>);
    const title = screen.getByText("Title");
    expect(title.className).toContain("font-semibold");
  });

  test("CardDescription renders correctly", () => {
    render(<CardDescription>Description</CardDescription>);
    const desc = screen.getByText("Description");
    expect(desc.className).toContain("text-sm");
    expect(desc.className).toContain("text-muted-foreground");
  });

  test("CardContent renders with correct class", () => {
    render(<CardContent>Content</CardContent>);
    const content = screen.getByText("Content");
    expect(content.className).toContain("p-6 pt-0");
  });

  test("CardFooter renders with correct class", () => {
    render(<CardFooter>Footer</CardFooter>);
    const footer = screen.getByText("Footer");
    expect(footer.className).toContain("flex items-center p-6 pt-0");
  });

  test("custom className is applied", () => {
    render(<Card className="custom-class">Custom</Card>);
    const card = screen.getByText("Custom");
    expect(card.className).toContain("custom-class");
  });

  test("passes additional props", () => {
    render(<Card data-testid="card-test">Test</Card>);
    const card = screen.getByTestId("card-test");
    expect(card).toBeInTheDocument();
  });
});
