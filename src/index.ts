import * as core from "@actions/core";
import { runReplaceAll, runReplaceOne } from "./utils";

async function run() {
	try {
		const key = core.getInput("key");
		const value = core.getInput("value");
		const file = core.getInput("file");
		const output = core.getInput("output") ?? file;
		const replaceAll = core.getInput("replace-all");
		const upsert = core.getBooleanInput("upsert", { required: false }) ?? false;
		const removeNonMatches =
			core.getBooleanInput("remove-non-matches", {
				required: false,
			}) ?? false;

		if (replaceAll) {
			const result = await runReplaceAll(file, output, replaceAll, {
				logger: core,
				removeNonMatches,
				upsert,
				write: true,
			});

			core.setOutput("result", result);

			return;
		}

		if (!key || !value || !file) throw new Error("Missing required input");

		const result = await runReplaceOne(key, value, file, output, {
			logger: core,
			write: true,
		});

		core.setOutput("result", result);
	} catch (error) {
		core.setFailed((error as Error).message);
	}
}

run();
