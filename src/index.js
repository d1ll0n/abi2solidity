module.exports = class AbiParser {
  constructor() {
    this.structs = [];
    this.structNames = {};
  }

  parseInput(input) {
    let {type, name, components} = input;
    let isStruct, isArray;
    if (type.indexOf('tuple') == 0 && components) {
      isStruct = true;
      const suffix = type.slice(5);
      type = `${this.getStructDefinition(components)}${suffix}`;
    }
    if (type.indexOf('[') >= 0) isArray = true;
    return {name, type, isStruct, isArray};
  }

  getStructDefinition(inputs) {
    let structTypes = [];
    let name = `GeneratedStruct${this.structs.length || ''}`;
    let header = `\tstruct ${name} {\n`;
    let struct = [header];
    for (let input of inputs) {
      const {name: inputName, type} = this.parseInput(input);
      structTypes.push(type);
      struct.push(`\t\t${type} ${inputName};\n`);
    }
    let structID = structTypes.join('');
    if (this.structNames[structID]) return this.structNames[structID];
    this.structNames[structID] = name;
    struct.push('\t}\n')
    this.structs.push(struct.join(''));
    return name;
  }

  getInOrOut(inputs) {
    return inputs.map(input => {
      const {name, type, isStruct, isArray} = this.parseInput(input);
      const mem = (isStruct || isArray) ? ` memory` : ``;
      return `${type}${mem} ${name}`;
    }).join(', ');
  }

  getMethodInterface(method) {
    const out = [];
    // Interfaces limitation: https://solidity.readthedocs.io/en/v0.4.24/contracts.html#interfaces
    if (method.type !== 'function') return null;
    out.push(method.type);
    // Name
    if (method.name) out.push(method.name);
    // Inputs
    out.push(`(${this.getInOrOut(method.inputs)})`);
    // Functions in ABI are either public or external and there is no difference in the ABI
    out.push('external');
    // State mutability
    if (method.stateMutability === 'pure') out.push('pure');
    else if (method.stateMutability === 'view') out.push('view');
    // Payable
    if (method.payable) out.push('payable');
    // Outputs
    if (method.outputs && method.outputs.length) {
      out.push(`returns (${this.getInOrOut(method.outputs)})`);
    }
    return out.join(' ');
  }

  static parse(abi) {
    const parser = new AbiParser();
    const jsonABI = (typeof abi == 'string') ? JSON.parse(abi) : abi;
    const HEADER = 'interface GeneratedInterface {\n';
    const FOOTER = '}\n';
    let out = '';
    let methods = [];
    for (let i = 0; i < jsonABI.length; i += 1) {
      const method = jsonABI[i];
      const methodString = parser.getMethodInterface(method);
      if (methodString) methods.push(`  ${methodString};\n`);
    }
    if (parser.structs.length) out += 'pragma experimental ABIEncoderV2;\n';
    out += HEADER;
    out += parser.structs.join('')
    out += methods.join('')
    return out + FOOTER;
  }
}

/* export function ABI2SolidityFiles(input, output) {
  fs.readFile(input, { encoding: 'utf8' }, (err, abi) => {
    if (err) {
      console.error(err);
      return;
    }
    const solidity = AbiParser.parse(abi);
    if (output === '') {
      // default to stdout
      console.log('------------ Solidity interface:');
      console.log(solidity);
    } else {
      fs.writeFile(output, solidity, (err2) => {
        if (err2) console.error(err2);
      });
    }
  });
} */
