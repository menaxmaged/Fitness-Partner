// src/utils/base64-encode.ts
import * as fs from 'fs/promises';

export const base64Encode = async (filePath: string): Promise<string> => {
    const buffer = await fs.readFile(filePath);
    return buffer.toString('base64');
  };