import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const books = sqliteTable("books", {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull().unique(),
  path: text().notNull(),
  author: text(),
  created_at: text().notNull(),
  updated_at: text().notNull(),
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

export type Book = typeof books.$inferInsert;
export type Category = typeof category.$inferInsert;
export type BookCategory = typeof book_category.$inferInsert;
