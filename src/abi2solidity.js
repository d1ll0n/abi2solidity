import fs from 'fs';
import ABIParser from './parser';

export default function ABI2Solidity(abi, versionString, interfaceName) {
  return ABIParser.parse(abi, versionString, interfaceName);
}

export function ABI2SolidityFiles(input, output, interfaceName, compilerVersion) {
  const abi = fs.readFileSync(input, { encoding: 'utf8' });
  const solidity = ABI2Solidity(abi, compilerVersion, interfaceName);
  if (!output) return solidity;
  fs.writeFileSync(output, solidity);
}
