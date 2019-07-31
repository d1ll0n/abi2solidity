pragma solidity ^0.5.10;

interface GeneratedInterface {
  function oraclize_setCustomGasPrice (uint256 gasPrice) external;
  function oraclize_getPrice (string calldata datasource) external view returns (uint256);
  function oraclize_query (uint256 timestamp, string calldata datasource, string calldata arg, uint256 gaslimit) external returns (bytes32 id);
  function oraclize_query (string calldata datasource, string calldata arg1, string calldata arg2, uint256 gaslimit) external returns (bytes32 id);
  function oraclize_query (string calldata datasource, string calldata arg1, string calldata arg2) external returns (bytes32 id);
  function oraclize () external view returns (OraclizeI);
  function parseInt (string calldata _a) external pure returns (uint256);
  function proofType_NONE () external pure returns (bytes1);
  function oraclize_query (string calldata datasource, string calldata arg) external returns (bytes32 id);
  function oraclize_query (uint256 timestamp, string calldata datasource, string calldata arg1, string calldata arg2) external returns (bytes32 id);
  function oraclize_query (uint256 timestamp, string calldata datasource, string calldata arg1, string calldata arg2, uint256 gaslimit) external returns (bytes32 id);
  function oraclize_query (uint256 timestamp, string calldata datasource, string calldata arg) external returns (bytes32 id);
  function proofType_Native () external pure returns (bytes1);
  function proofStorage_IPFS () external pure returns (bytes1);
  function indexOf (string calldata _haystack, string calldata _needle) external pure returns (int256);
  function proofType_TLSNotary () external pure returns (bytes1);
  function parseAddr (string calldata _a) external pure returns (address);
  function oraclize_getPrice (string calldata datasource, uint256 gaslimit) external view returns (uint256);
  function oraclize_query (string calldata datasource, string calldata arg, uint256 gaslimit) external returns (bytes32 id);
  function getCodeSize (address _addr) external view returns (uint256 _size);
  function oraclize_cbAddress () external view returns (address);
  function parseInt (string calldata _a, uint256 _b) external pure returns (uint256);
  function oraclize_setNetwork () external view returns (OraclizeAddrResolverI);
  function OAR () external view returns (OraclizeAddrResolverI);
  function proofType_Ledger () external pure returns (bytes1);
  function oraclize_setProof (bytes1 proofP) external;
  function strCompare (string calldata _a, string calldata _b) external pure returns (int256);
  function proofType_Android () external pure returns (bytes1);
}
