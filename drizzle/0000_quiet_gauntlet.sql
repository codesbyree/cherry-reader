CREATE TABLE `book_category` (
	`book_id` integer NOT NULL,
	`category_id` integer NOT NULL,
	PRIMARY KEY(`book_id`, `category_id`),
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`path` text NOT NULL,
	`author` text,
	`year` integer,
	`created_at` text NOT NULL,
	`image` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
