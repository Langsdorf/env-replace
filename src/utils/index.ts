import * as fs from "node:fs/promises";

type Log = {
	info: (message: string) => void;
};

export function getEnvFile(lines: string[]) {
	const env = new Map<string, string>();

	for (const line of lines) {
		if (line.startsWith("#")) continue;

		const firstEqualIndex = line.indexOf("=");

		if (firstEqualIndex === -1) continue;

		const key = line.substring(0, firstEqualIndex);
		const value = line.substring(firstEqualIndex + 1);

		env.set(key, value);
	}

	return env;
}

interface ReplaceAllOptions {
	upsert: boolean;
	removeNonMatches: boolean;
	write: boolean;
	logger: Log;
}

export async function runReplaceAll(
	file: string,
	output: string,
	replaceAll: string,
	{ logger, removeNonMatches, upsert, write }: ReplaceAllOptions
) {
	const envContent = await fs.readFile(file, "utf8");

	const env = getEnvFile(envContent.split("\n"));
	const replaceMap = getEnvFile(replaceAll.split("\n"));

	logger.info(`Replace list: ${Array.from(replaceMap.keys()).join(", ")}`);
	logger.info(`Env: ${Array.from(env.keys()).join(", ")}`);

	const matches = new Map();

	for (const key of env.keys()) {
		const replaceValue = replaceMap.get(key);

		if (replaceValue === undefined && !removeNonMatches) {
			matches.set(key, env.get(key));
			continue;
		}

		matches.set(key, replaceValue);
	}

	for (const key of replaceMap.keys()) {
		// already replaced or not should be upserted
		if (env.has(key) || !upsert) continue;

		matches.set(key, replaceMap.get(key));
	}

	logger.info(`Found ${matches.size} matches`);

	const result = Array.from(matches.keys())
		.map((key) => `${key}=${matches.get(key)}`)
		.join("\n");

	if (write) await fs.writeFile(output, result);

	return result;
}

interface ReplaceOneOptions {
	write: boolean;
	logger: Log;
}

export async function runReplaceOne(
	key: string,
	value: string,
	file: string,
	output: string,
	{ logger, write }: ReplaceOneOptions
) {
	logger.info(`Setting ${key} to ${value} in ${file}`);

	const envContent = await fs.readFile(file, "utf8");

	const env = getEnvFile(envContent.split("\n"));

	if (env.has(key) && env.get(key) === value) {
		logger.info(`${key} is already set to ${value} in ${file}`);
		return;
	}

	env.set(key, value);

	const result = Array.from(env.keys())
		.map((k) => `${k}=${env.get(k)}`)
		.join("\n");

	if (write) await fs.writeFile(output, result);

	logger.info(`Successfully set ${key} to ${value} in ${file}`);

	return result;
}
