import { expect, test } from "@jest/globals";
import * as fs from "fs/promises";

test("should replace the string", async () => {
	const key = "HELLO";
	const value = "TEST";
	const file = "src/tests/.env";
	const envContent = await fs.readFile(file, "utf8");

	const result = envContent.replace(new RegExp(`${key}=.*`), `${key}=${value}`);

	const expected = `${key}=${value}`;

	expect(result).toBe(expected);
});
