CREATE TABLE `bombs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`netId` text NOT NULL,
	`time` integer NOT NULL,
	`defused` integer DEFAULT 0 NOT NULL,
	`explosions` integer DEFAULT 0 NOT NULL,
	`score` real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `defuses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bombId` integer NOT NULL,
	`time` integer NOT NULL,
	`phase` integer NOT NULL,
	`response` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `explosions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bombId` integer NOT NULL,
	`time` integer NOT NULL,
	`phase` integer NOT NULL,
	`response` text NOT NULL
);
