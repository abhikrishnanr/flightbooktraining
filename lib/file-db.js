import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

export async function readJsonFile(fileName) {
  const filePath = path.join(dataDir, fileName);
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

export async function writeJsonFile(fileName, value) {
  const filePath = path.join(dataDir, fileName);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2));
  return value;
}
