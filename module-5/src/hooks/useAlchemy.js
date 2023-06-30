import { useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

export function useAlchemy() {
  const alchemy = new Alchemy(settings);
  const [data, setData] = useState([]);

  function setBlockData(block) {
    setData((prevState) => {
      if (prevState[0].blockNum !== block.blockNum || prevState[0].number !== block.number) {
        const previousData = prevState.slice(0, 9);
        return [block, ...previousData];
      }
    });
  }

  return { alchemy, data, setData, setBlockData };
}
