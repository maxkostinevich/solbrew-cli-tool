import chalk from "chalk";
import cliProgress from "cli-progress";

import * as solanaWeb3 from "@solana/web3.js";
import base58 from "bs58";

import Storage from "./Storage.js";

const Wallet = {
  uuid: null,
  wallets_count: 0,

  init: function (wallets_count) {
    this.wallets_count = wallets_count;
    this.uuid = crypto.randomUUID();

    console.log(chalk.yellow(`Session UID: ${this.uuid}`));
    Storage.createSubFolder(this.uuid);
    this.generateWallets();
  },

  generateWallet: function () {
    var self = this;
    let account = solanaWeb3.Keypair.generate();

    const secret = new Uint8Array(account._keypair.secretKey);
    const pubKey = new Uint8Array(account._keypair.publicKey);

    const pass = base58.encode(secret);
    const address = base58.encode(pubKey);

    let file = address + ".json";
    Storage.writeWalletJSONFile(file, self.uuid, JSON.stringify(account));

    const result_file = self.uuid + ".csv";
    Storage.writeFinalFile(result_file, address, pass);
  },

  generateWallets: function () {
    var self = this;

    console.log(chalk.yellow("Generating wallets. Please wait.."), "\n");
    const bar = new cliProgress.SingleBar({
      format:
        "{bar}" +
        "| {percentage}% | {value}/{total} wallets | " +
        self.uuid +
        ".csv",
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
    });

    // initialize the bar - defining payload token "speed" with the default value "N/A"
    var total = self.wallets_count;
    bar.start(total, 0);
    var current = 1;
    const updateBar = setInterval(() => {
      if (current > total) {
        clearInterval(updateBar);
        bar.stop();
        console.log("\n");
        console.log(chalk.black.bold.bgYellow(`  ---------------------  `));
        console.log(chalk.black.bold.bgYellow(`  | > > > Done! < < < |  `));
        console.log(chalk.black.bold.bgYellow(`  ---------------------  `));
        console.log("\n");
        console.log(
          chalk.green(
            chalk.green.bold.underline(`${current - 1}`),
            ` wallets have been generated.`
          )
        );
        console.log(
          chalk.green(
            `See `,
            chalk.green.bold.underline(`/output/${self.uuid}.csv`),
            ` for more details`
          )
        );
        console.log("\n");
        console.log(chalk.gray("Thank you for using SolBrew CLI Tool."));
        console.log(chalk.gray("Made by [maxico.dev]"));
        console.log("\n");
      } else {
        self.generateWallet();
        bar.update(current);
      }
      current++;
    }, 300);
  },
};
export default Wallet;
