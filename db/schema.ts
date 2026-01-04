import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const books = sqliteTable("books", {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  path: text().notNull(),
  author: text(),
  year: integer(),
  created_at: text().notNull(),
  image: text().notNull(),
});

export const category = sqliteTable("category", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const book_category = sqliteTable(
  "book_category",
  {
    book_id: integer()
      .notNull()
      .references(() => books.id),
    category_id: integer()
      .notNull()
      .references(() => category.id),
  },
  (table) => ({
    // This ensures the pair (book_id, category_id) is unique
    pk: primaryKey({ columns: [table.book_id, table.category_id] }),
  })
);
