import "@testing-library/jest-dom";
import React from "react";
import Customization from "./components/pages/Customization";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./components/elements/UserProvider";
import { CustomProvider } from "./components/elements/CustomProvider";

describe("Customization Component", () => {
  it("Should render other component", () => {
    render(
      <Router>
        <CustomProvider>
          <Customization />
        </CustomProvider>
      </Router>
    );
    const button = screen.getByTestId("button");
    fireEvent.click(button);
    const customizationComponent = screen.getByTestId("designSection");
    expect(customizationComponent).toBeInTheDocument();
  });
});
