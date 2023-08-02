const { app } = require('electron');
const fs = require('fs');
const path = require('path');

const userDataPath = app.getPath('userData');
const filePath = path.join(userDataPath, 'config.json');

function parseData() {
  const defaultData = {}
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch(error) {
    return defaultData;
  }
}

class UserData {
  static writeData(key, value) {
    let contents = parseData()
    contents[key] = value;
    fs.writeFileSync(filePath, JSON.stringify(contents));
  }

  static readData(key) {
   let contents = parseData()
   return contents[key]
  }
}

module.exports = { UserData };
