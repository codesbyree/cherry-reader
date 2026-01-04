import { open } from "@op-engineering/op-sqlite";
import { drizzle } from "drizzle-orm/op-sqlite";
import * as schema from "./schema";

const opsqlite = open({ name: "cherry_db.sqlite" });
export const db = drizzle(opsqlite, { schema });
