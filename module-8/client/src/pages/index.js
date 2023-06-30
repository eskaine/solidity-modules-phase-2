import Head from 'next/head'
import { useState } from 'react';
import { ethers } from 'ethers';
import { advancedNftAbi } from '../abi/advancedNftAbi';
import { getMerkleProof } from './helpers/merkleTree';

export default function Home() {
  const [randomIds, setRandomIds] = useState([]);
  const [inputId, setInputId] = useState(null);
  const [toAddress, setToAddress] = useState("");

  const MAX_TOKEN_SUPPLY = 999;
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  const mintBtnHandler = async (bitmapIndex) => {
    try {
      const { contract, signer, account } = await getContract();

      // generate random token id
      const { proof, leaf, index } = getMerkleProof(bitmapIndex);
      const randomTokenId = Math.floor(Math.random() * MAX_TOKEN_SUPPLY) + 1;
      const tokenIdHash = ethers.utils.solidityKeccak256([ "address", "uint256" ], [ account, randomTokenId ]);
      setRandomIds([...randomIds, randomTokenId]);

      await contract.connect(signer).commitMint(proof, leaf, index, tokenIdHash);
    } catch (error) {
      console.error(error);
    }
  };

  const revealBtnHandler = async () => {
    try {
      const { contract, signer } = await getContract();
      await contract.connect(signer).reveal(inputId);
      setInputId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const transferBtnHandler = async () => {
    try {
      const { contract, signer } = await getContract();
      await contract.connect(signer).multiTransfer(toAddress, randomIds);
      setToAddress("");
    } catch (error) {
      console.error(error);
    }
  };

  const getContract = async () => {
    if(window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const [account] = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner(account);
      const contract = new ethers.Contract(contractAddress, advancedNftAbi, signer);

      return {contract, signer, account};
   };
  }

  const handleIdChange = (e) => {
    setInputId(Number(e.target.value));
  }

  const handleAddressChange = (e) => {
    setToAddress(e.target.value);
  }

  return (
    <>
      <Head>
        <title>Advanced NFT</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <button onClick={() => mintBtnHandler(0)}>Mint NFT 1</button>
        <button onClick={() => mintBtnHandler(1)}>Mint NFT 2</button>
        <button onClick={() => mintBtnHandler(2)}>Mint NFT 3</button>
        <br/><br/><div>
          <label for="inputId">ID to reveal:</label>
          <input type="text" id="inputId" name="inputId" onChange={handleIdChange} />
        </div>
        <br/><button onClick={revealBtnHandler}>Reveal</button>
        <br/><br/><div>{randomIds.join(" ")}</div>
        <br/><br/><div>
          <label for="toAddress">Transfer to address:</label>
          <input type="text" id="toAddress" name="toAddress" onChange={handleAddressChange} />
        </div>
        <br/><button onClick={transferBtnHandler}>Transfer</button>
      </main>
    </>
  )
}
