import fs from "fs";

const Storage = {
  config: {
    dataDir: "./output/",
  },

  createDataDirIfNotExists: function () {
    var self = this;
    try {
      if (!fs.existsSync(self.config.dataDir)) {
        fs.mkdirSync(self.config.dataDir);
      }
    } catch (error) {
      console.error("Error creating /output/ folder");
    }
  },

  writeWalletJSONFile: function (filename, subdir, data) {
    if (!filename || !subdir || !data) {
      return false;
    }

    var self = this;
    var filePath = self.config.dataDir + subdir + "/" + filename;
    fs.writeFileSync(filePath, data);
  },

  writeFinalFile: function (filename, account, password) {
    if (!filename || !account || !password) {
      return false;
    }

    var self = this;
    var filePath = self.config.dataDir + filename;
    var data = account + "," + password + "\r\n";
    fs.appendFileSync(filePath, data);
  },

  createSubFolder: function (filename) {
    if (!filename) {
      return false;
    }

    var self = this;
    var dirPath = self.config.dataDir + filename;

    try {
      self.createDataDirIfNotExists();
      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
      }
      fs.mkdirSync(dirPath);
    } catch (error) {
      console.error(`Error creating ${dirPath} folder`);
    }
  },
};

export default Storage;
