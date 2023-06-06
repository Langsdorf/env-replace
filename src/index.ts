import * as core from "@actions/core";
import * as fs from "fs/promises";

async function run() {
	try {
		const key = core.getInput("key");
		const value = core.getInput("value");
		const file = core.getInput("file");

		core.info(`Setting ${key} to ${value} in ${file}`);

		const envContent = await fs.readFile(file, "utf8");

		const result = envContent.replace(
			new RegExp(`${key}=.*`),
			`${key}=${value}`
		);

		await fs.writeFile(file, result);

		core.info(`Successfully set ${key} to ${value} in ${file}`);

		core.setOutput("result", result);
	} catch (error) {
		core.setFailed((error as Error).message);
	}
}

run();
