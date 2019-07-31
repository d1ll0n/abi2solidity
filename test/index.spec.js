import fs from 'fs';
import solc from 'solc';
import ABI2Solidity from '../src/abi2solidity';

function getTestFile(filename) {
  return fs.readFileSync(filename, 'utf8');
}

function compileAndGetABI(soliditySource) {
  const input = {
    language: 'Solidity',
    sources: {
      'generated.sol': {
        content: soliditySource,
      },
    },
    settings: {
      outputSelection: {
        'generated.sol': {
          GeneratedInterface: ['abi'],
        },
      },
    },
  };
  
  const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
  return JSON.stringify(compiled.contracts['generated.sol'].GeneratedInterface.abi);
}

function filterABI(stringAbi) {
  const abi = JSON.parse(stringAbi);
  return abi.filter(x => x.type === 'function');
}

describe('Check that empty ABI return empty interface', () => {
  it('returns empty interface', () => {
    expect(ABI2Solidity('[]')).toBe('pragma solidity ^0.5.10;\n\ninterface GeneratedInterface {\n}\n');
  });
});

describe('Test 1 with expected output', () => {
  it('returns solidity test1', () => {
    expect(ABI2Solidity(getTestFile('test/test1.abi'))).toBe(getTestFile('test/test1-out.sol'));
  });
});

describe('Test OraclizeLib with custom struct returned with expected output', () => {
  it('returns solidity test1', () => {
    expect(ABI2Solidity(getTestFile('test/oraclizeLib.abi'))).toBe(
      getTestFile('test/oraclizeLib-out.sol'),
    );
  });
});

describe('ABI -> Solidity -> ABI - manually set', () => {
  // Test all ABI files
  const testParams = ['test/test1.abi', 'test/test2.abi'];
  for (let i = 0; i < testParams.length; i += 1) {
    const testSpec = testParams[i];
    it(`get Solidity interface then compiles it back to ABI and compare - ${testSpec}`, () => {
      const compiledAbi = compileAndGetABI(ABI2Solidity(getTestFile(`${testSpec}`)));
      expect(filterABI(getTestFile(`${testSpec}`))).toEqual(filterABI(compiledAbi));
    });
  }
});

describe('ABI -> Solidity -> ABI - All *.abi files', () => {
  // Test all ABI files
  const testParams = fs.readdirSync('test/abi/').filter(filename => filename.endsWith('.abi'));
  for (let i = 0; i < testParams.length; i += 1) {
    const testSpec = testParams[i];
    it(`get Solidity interface then compiles it back to ABI and compare - ${testSpec}`, () => {
      const compiledAbi = compileAndGetABI(ABI2Solidity(getTestFile(`test/abi/${testSpec}`)));
      expect(filterABI(getTestFile(`test/abi/${testSpec}`))).toEqual(filterABI(compiledAbi));
    });
  }
});
