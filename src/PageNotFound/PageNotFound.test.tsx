import '@testing-library/jest-dom';
import {render} from "@testing-library/react";
import PageNotFound from "./PageNotFound.tsx";
import {expect, it} from "vitest";

it('page not fond', () => {
  const renderResult = render(<PageNotFound/>);

  const knob = renderResult.getByTestId("page-not-found");
  expect(knob).toBeInTheDocument();
});