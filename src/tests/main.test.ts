import { expect, test } from "@jest/globals";
import path from "node:path";
import { runReplaceAll, runReplaceOne } from "../utils";

test("should replace one value", async () => {
	const file = path.join(__dirname, ".env");
	const output = path.join(__dirname, ".env.output");

	const toReplaceKey = "HELLO";
	const toReplaceValue = "PEOPLE";

	const result = await runReplaceOne(
		toReplaceKey,
		toReplaceValue,
		file,
		output,
		{
			logger: console,
			write: false,
		}
	);

	expect(result).toContain(`${toReplaceKey}=${toReplaceValue}`);
});

test("should replace all values and keep non matching keys", async () => {
	const file = path.join(__dirname, ".env");
	const output = path.join(__dirname, ".env.output");

	const toReplaceKey = "HELLO";
	const toReplaceValue = "PEOPLE";

	const result = await runReplaceAll(
		file,
		output,
		`${toReplaceKey}=${toReplaceValue}`,
		{
			logger: console,
			removeNonMatches: false,
			upsert: false,
			write: false,
		}
	);

	expect(result).toContain(`${toReplaceKey}=${toReplaceValue}`);
	expect(result.split("\n").length).toBeGreaterThan(1);
});
