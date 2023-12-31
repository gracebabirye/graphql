import { SecureId } from "@bookshelf/secure-id";
import { titleizeSentence } from "@bookshelf/string-utils";
import { faker } from "@faker-js/faker";
import { MockList } from "apollo-server";

import {
  AUTHOR_PHOTOS,
  AVATAR_COLORS,
  AVATAR_IMAGES,
  BOOK_COVERS
} from "./image-paths";

const secureId = new SecureId<string>({ separator: "-" });

export const mocks = {
  ExternalID: (resource) =>
    secureId.toExternal(
      faker.number.int({ min: 1, max: 1000 }),
      resource.__typename
    ),
  Avatar: (rootValue, args, { assetsBaseUrl }) => {
    const path = faker.helpers.arrayElement(AVATAR_IMAGES);

    return {
      image: {
        path,
        url: assetsBaseUrl + path
      },
      color: faker.helpers.arrayElement(AVATAR_COLORS)
    };
  },
  User: () => ({
    __typename: "User",
    ownedBookCopies: () => new MockList([0, 8]),
    borrowedBookCopies: () => new MockList([0, 4])
  }),
  Book: (rootValue, args, { assetsBaseUrl }) => {
    const path = faker.helpers.arrayElement(BOOK_COVERS);

    return {
      __typename: "Book",
      title: titleizeSentence(
        faker.lorem.words(faker.number.int({ min: 1, max: 4 }))
      ),
      cover: {
        path,
        url: assetsBaseUrl + path
      },
      description: faker.lorem.paragraph(2),
      favourite: faker.datatype.boolean(),
      copies: () => new MockList([0, 4])
    };
  },
  Author: (rootValue, args, { assetsBaseUrl }) => {
    const path = faker.helpers.arrayElement(AUTHOR_PHOTOS);

    return {
      __typename: "Author",
      name: faker.person.fullName(),
      bio: faker.lorem.paragraphs(4),
      photo: {
        path,
        url: assetsBaseUrl + path
      }
    };
  },
  Query: () => ({
    booksCount: () => faker.number.int({ min: 1, max: 64 }),
    authors: () => new MockList([3, 8]),
    books: (rootValue, args) => new MockList(args.limit),
    users: () => new MockList([4, 16])
  })
};
