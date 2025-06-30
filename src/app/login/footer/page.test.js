import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./page";

describe("Footer Component", () => {

  test("has correct class names for styling", () => {
    render(<Footer />);
    const footerElement = screen.getByRole("contentinfo");
    expect(footerElement).toHaveClass("w-full", "py-4", "text-center", "text-black", "bg-white");
  });
});

