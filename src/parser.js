export default class ABIParser {
  constructor() {
    this.structs = [];
    this.structNames = {};
  }

  parseInput(input) {
    let { type } = input;
    const { name, components } = input;
    let mustDeclareStorage;
    if (type.indexOf('tuple') === 0 && components) {
      mustDeclareStorage = true;
      const suffix = type.slice(5);
      type = `${this.getStructDefinition(components)}${suffix}`;
    }
    if (type.indexOf('[') >= 0 || type === 'bytes' || type === 'string') mustDeclareStorage = true;
    return {
      name, type, mustDeclareStorage,
    };
  }

  getStructDefinition(inputs) {
    const structTypes = [];
    const name = `GeneratedStruct${this.structs.length || ''}`;
    const header = `\tstruct ${name} {\n`;
    const struct = [header];
    for (let i = 0; i < inputs.length; i += 1) {
      const { name: inputName, type } = this.parseInput(inputs[i]);
      structTypes.push(type);
      struct.push(`\t\t${type} ${inputName};\n`);
    }
    const structID = structTypes.join('');
    if (this.structNames[structID]) return this.structNames[structID];
    this.structNames[structID] = name;
    struct.push('\t}\n');
    this.structs.push(struct.join(''));
    return name;
  }

  getInOrOut(inputs, isOutput) {
    return inputs.map((input) => {
      const {
        name, type, mustDeclareStorage,
      } = this.parseInput(input);
      const storageLoc = mustDeclareStorage && (isOutput ? ' memory' : ' calldata');
      const nameStr = name ? ` ${name}` : '';
      return `${type}${storageLoc || ''}${nameStr}`;
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
      out.push(`returns (${this.getInOrOut(method.outputs, true)})`);
    }
    return out.join(' ');
  }

  static parse(abi, versionString = '^0.5.10', interfaceName = 'GeneratedInterface') {
    const parser = new ABIParser();
    const jsonABI = (typeof abi === 'string') ? JSON.parse(abi) : abi;
    const HEADER = `pragma solidity ${versionString};\n\ninterface ${interfaceName} {\n`;
    const FOOTER = '}\n';
    let out = '';
    const methods = [];
    for (let i = 0; i < jsonABI.length; i += 1) {
      const method = jsonABI[i];
      const methodString = parser.getMethodInterface(method);
      if (methodString) methods.push(`  ${methodString};\n`);
    }
    if (parser.structs.length) out += 'pragma experimental ABIEncoderV2;\n';
    out += HEADER;
    out += parser.structs.join('');
    out += methods.join('');
    return out + FOOTER;
  }
}
