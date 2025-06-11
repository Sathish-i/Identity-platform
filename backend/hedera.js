const { Client, ContractExecuteTransaction, ContractFunctionParameters } = require("@hashgraph/sdk");
require("dotenv").config();

const hederaClient = Client.forTestnet();
hederaClient.setOperator(
  process.env.HEDERA_OPERATOR_ID,
  process.env.HEDERA_OPERATOR_KEY
);

async function callContractFunction(
  contractId,
  functionName,
  parameters,
  gas = 1000000
) {
  const tx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(gas)
    .setFunction(functionName, parameters);

  const txResponse = await tx.execute(hederaClient);
  const receipt = await txResponse.getReceipt(hederaClient);
  return receipt;
}

async function issueCredential(contractId, issuerAddress, userAddress, ipfsHash, validUntil) {
  return callContractFunction(
    contractId,
    "issueCredential",
    new ContractFunctionParameters()
      .addAddress(userAddress)
      .addString(ipfsHash)
      .addUint256(validUntil)
  );
}

async function requestAccess(contractId, userAddress, credentialId) {
  return callContractFunction(
    contractId,
    "requestAccess",
    new ContractFunctionParameters()
      .addAddress(userAddress)
      .addString(credentialId)
  );
}

async function approveAccess(contractId, requestId) {
  return callContractFunction(
    contractId,
    "approveAccess",
    new ContractFunctionParameters()
      .addString(requestId)
  );
}

module.exports = {
  issueCredential,
  requestAccess,
  approveAccess
};
