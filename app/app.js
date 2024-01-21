#!/usr/bin/env node

/*

 ███╗   ███╗ █████╗ ██╗  ██╗██╗ ██████╗ ██████╗    ██████╗ ███████╗██╗   ██╗
 ████╗ ████║██╔══██╗╚██╗██╔╝██║██╔════╝██╔═══██╗   ██╔══██╗██╔════╝██║   ██║
 ██╔████╔██║███████║ ╚███╔╝ ██║██║     ██║   ██║   ██║  ██║█████╗  ██║   ██║
 ██║╚██╔╝██║██╔══██║ ██╔██╗ ██║██║     ██║   ██║   ██║  ██║██╔══╝  ╚██╗ ██╔╝
 ██║ ╚═╝ ██║██║  ██║██╔╝ ██╗██║╚██████╗╚██████╔╝██╗██████╔╝███████╗ ╚████╔╝
 ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═════╝ ╚═╝╚═════╝ ╚══════╝  ╚═══╝


 -------------------------------------------------------------------------------
 (c) Max Kostinevich / https://maxico.dev / https://t.me/maxico_dev
 -------------------------------------------------------------------------------

*/

import { Command } from "commander";
import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";

import Wallet from "./utils/Wallet.js";

const program = new Command();

program
  .name("solbrew")
  .version("1.0.0")
  .summary("Solana Mass Wallet Generator CLI Tool")
  .description("Generate Solana wallets in bulk");

async function showWelcomeMessage() {
  const data = await figlet.text("SolBrew \n CLI Tool", {
    font: "Big Money-ne",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  });
  console.log(data);
  console.log(chalk.gray("Made by [maxico.dev]\n\n"));
}

function initCLI() {
  program
    .command("generate")
    .description("Generate wallets")
    .action(() => {
      inquirer
        .prompt([
          {
            type: "input",
            name: "wallets_count",
            message: "How many wallets would you like to generate? (1-1000)",
          },
        ])
        .then((answer) => {
          const wallets_count = parseInt(answer.wallets_count);
          if (!Number.isInteger(wallets_count)) {
            console.log(
              chalk.red(
                `Oops! "${answer.wallets_count}" is not vaild number. Please, try again.`
              )
            );
            return false;
          }
          if (wallets_count < 1 || wallets_count > 1000) {
            console.log(
              chalk.red(
                `Oops! Entered value should be in 1-1000 range. Please, try again.`
              )
            );
            return false;
          }

          Wallet.init(wallets_count);
        });
    });
  program.parse(process.argv);
}

async function init() {
  if (process.argv.length <= 2) {
    await showWelcomeMessage();
  }
  initCLI();
}

init();
