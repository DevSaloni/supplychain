import { ethers } from "ethers";
import ABI from "../../../blockchain/artifacts/contracts/SupplyChain.sol/SupplyChain.json";

const CONTRACT_ADDRESS = "0x508f1649C2E3BDbC86511e34E95c5bED9d92D2fd"; // Sepolia address

const getContract = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return null;
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Contract instance
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, signer);

  // DEBUG: list all contract functions
console.log("ABI keys:", Object.keys(ABI.abi[0])); 

  return contract;
};

export default getContract;
