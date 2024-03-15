import * as core from "@actions/core";
import * as fs from "fs/promises";

function getEnvFile(lines: string[]) {
	const env = new Map<string, string>();

	for (const line of lines) {
		if (line.startsWith("#")) {
			continue;
		}

		const firstEqualIndex = line.indexOf("=");

		if (firstEqualIndex === -1) {
			continue;
		}

		const key = line.substring(0, firstEqualIndex);
		const value = line.substring(firstEqualIndex + 1);

		env.set(key, value);
	}

	return env;
}

async function runMatchSecrets(file: string) {
	const envContent = await fs.readFile(file, "utf8");

	const env = getEnvFile(envContent.split("\n"));
	const secrets = getEnvFile(core.getInput("secrets").split("\n"));

	core.info(`Secrets: ${Array.from(secrets.keys()).join(", ")}`);
	core.info(`Env: ${Array.from(env.keys()).join(", ")}`);

	const matches = new Map();

	for (const key of secrets.keys()) {
		if (env.has(key) && secrets.get(key) !== env.get(key)) {
			matches.set(key, env.get(key));
		}
	}

	core.info(`Found ${matches.size} matches`);

	const result = Array.from(matches.keys())
		.map((key) => `${key}=${matches.get(key)}`)
		.join("\n");

	core.setOutput("result", result);

	await fs.writeFile(file, result);

	return result;
}

async function run() {
	try {
		const key = core.getInput("key");
		const value = core.getInput("value");
		const file = core.getInput("file");
		const matchSecrets = core.getInput("match-secrets") === "true";
		const secrets = core.getInput("secrets");

		if (matchSecrets && secrets) {
			return await runMatchSecrets(file);
		}

		if (!key || !value || !file) {
			throw new Error("Missing required input");
		}

		core.info(`Setting ${key} to ${value} in ${file}`);

		const envContent = await fs.readFile(file, "utf8");

		const env = getEnvFile(envContent.split("\n"));

		if (env.has(key) && env.get(key) === value) {
			core.info(`${key} is already set to ${value} in ${file}`);
			return;
		}

		env.set(key, value);

		const result = Array.from(env.keys())
			.map((k) => `${k}=${env.get(k)}`)
			.join("\n");

		await fs.writeFile(file, result);

		core.info(`Successfully set ${key} to ${value} in ${file}`);

		core.setOutput("result", result);
	} catch (error) {
		core.setFailed((error as Error).message);
	}
}

run();
