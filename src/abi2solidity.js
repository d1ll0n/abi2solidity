import fs from 'fs';
import ABIParser from './parser';

export default function ABI2Solidity(abi, versionString) {
  return ABIParser.parse(abi, versionString);
}

export function ABI2SolidityFiles(input, output) {
  const abi = fs.readFileSync(input, { encoding: 'utf8' });
  const solidity = ABI2Solidity(abi);
  if (!output) return solidity;
  fs.writeFileSync(output, solidity);
}
