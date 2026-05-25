import chalk from "chalk";

export const logger = {
  error: (msg: string) => console.log(chalk.red(msg)),
  warn: (msg: string) => console.log(chalk.yellow(msg)),
  info: (msg: string) => console.log(chalk.blue(msg)),
  success: (msg: string) => console.log(chalk.green(msg)),
  melon: (msg: string) => console.log(chalk.hex("#ff5c71").bold(msg)),
  green: (msg: string) => console.log(chalk.hex("#7fff5e")(msg)),
};

export const MELON_BANNER = chalk.hex("#ff5c71")(`
 ███▄ ▄███▓ ▓█████  ██▓     ▒█████   ███▄    █
▓██▒▀█▀ ██▒ ▓█   ▀ ▓██▒    ▒██▒  ██▒ ██ ▀█   █
▓██    ▓██░ ▒███   ▒██░    ▒██░  ██▒▓██  ▀█ ██▒
▒██    ▒██  ▒▓█  ▄ ▒██░    ▒██   ██░▓██▒  ▐▌██▒
▒██▒   ░██▒ ░▒████▒░██████▒░ ████▓▒░▒██░   ▓██░
░ ▒░   ░  ░ ░░ ▒░ ░░ ▒░▓  ░░ ▒░▒░▒░ ░ ▒░   ▒ ▒
`);