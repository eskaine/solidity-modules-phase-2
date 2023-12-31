import Head from "next/head";
import { useState } from "react";
import Button from "@/components/Button";
import TetherBarChart from "@/components/TetherBarChart";
import BlockInfoCharts from "@/components/BlockInfoCharts";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [chart, setChart] = useState(1);

  function clickHandler(id) {
    setChart(id);
  }

  return (
    <>
      <Head>
        <title>Interaction with Ethereum</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <div>
          <Button
            id="1"
            label="ERC20 Transactions By Block"
            clickHandler={clickHandler}
          />
          <Button
            id="2"
            label="Block Information (Base Fee & Gas Ratio)"
            clickHandler={clickHandler}
          />
        </div>
        <div className={styles.barchartContainer}>
          {chart === 1 && <TetherBarChart />}
          {chart === 2 && <BlockInfoCharts />}
        </div>
      </main>
    </>
  );
}
