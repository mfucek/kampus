import fs from 'fs';

export class Logger {
	filePath: string;

	constructor(directory: string, prefix?: string) {
		const date = new Date();
		const dateString = date.toISOString().split('T')[0];
		const daySeconds =
			date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();

		fs.mkdirSync(directory, { recursive: true });

		this.filePath = `${directory}/${
			prefix ? prefix + '-' : ''
		}${dateString}-${daySeconds}.log`;

		this.appendToFile(`Starting logger with PID ${process.pid}`);
	}

	private appendToFile(message: string) {
		const fileExists = fs.existsSync(this.filePath);
		if (!fileExists) {
			fs.writeFileSync(this.filePath, '');
		}
		fs.appendFileSync(this.filePath, message + '\n');
	}

	/**
	 * Append output to a file
	 * @param message Append output to a file
	 */
	log(type: 'info' | 'error' | 'warn', message: string) {
		const time = new Date();
		const timeStamp = time.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		});

		const formattedMessage = `${timeStamp} [${type}] ${message}`;
		this.appendToFile(formattedMessage);
	}
}
