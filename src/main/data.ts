import { app } from 'electron';
import fs from 'fs';
import path from 'path';

const userDataPath = app.getPath('userData');
const filePath = path.join(userDataPath, 'config.json');

function parseData() {
  const defaultData = {};

  try {
    return JSON.parse(fs.readFileSync(filePath).toString());
  } catch(error) {
    return defaultData;
  }
}

export class UserData {
  static writeData(key: string, value: string): void {
    let contents = parseData();
    contents[key] = value;
    fs.writeFileSync(filePath, JSON.stringify(contents));
  }

  static readData(key: string): string {
   let contents = parseData();
   return contents[key];
  }
}
