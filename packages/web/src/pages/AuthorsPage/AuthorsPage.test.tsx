import { ApolloProvider } from "@apollo/client";
import { render, waitForElementToBeRemoved } from "@testing-library/react";
import { graphql } from "msw";
import React from "react";
import { MemoryRouter } from "react-router";

import { client } from "../../client";
import { server } from "../../mocks/server";
import { AuthorsPage } from "./AuthorsPage";

describe("<AuthorsPage />", () => {
  const renderComponent = () =>
    render(<AuthorsPage />, {
      wrapper: ({ children }) => (
        <ApolloProvider client={client}>
          <MemoryRouter>{children}</MemoryRouter>
        </ApolloProvider>
      )
    });

  beforeEach(() => client.resetStore());

  it("renders list of authors", async () => {
    // When
    const { getByText } = renderComponent();

    // Then
    expect(getByText("Loading authors...")).toBeInTheDocument();
    await waitForElementToBeRemoved(() => getByText("Loading authors..."));

    expect(getByText("J. K. Rowling")).toBeInTheDocument();
    expect(getByText("Andrzej Sapkowski")).toBeInTheDocument();
  });

  it("renders error alert when request fails", async () => {
    // Given
    server.use(
      graphql.query("GetAuthors", (req, res, ctx) =>
        res(ctx.errors([{ message: "Could not load authors..." }]))
      )
    );

    // When
    const { getByText } = renderComponent();

    // Then
    await waitForElementToBeRemoved(() => getByText("Loading authors..."));
    expect(getByText("Could not load authors...")).toBeInTheDocument();
  });
});
