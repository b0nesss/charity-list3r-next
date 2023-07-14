"use client";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import Number from "../components/Number";
import CharityList from "../components/CharityList";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { contractAddresses, abi } from "../constants";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Home() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const charityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [number, setNumber] = useState(0);
  const [charities, setcharities] = useState([]);

  const { runContractFunction: getNumberOfCharitiesRegistered } =
    useWeb3Contract({
      abi: abi,
      contractAddress: charityAddress,
      functionName: "getNumberOfCharitiesRegistered",
      params: {},
    });

  const { runContractFunction: getCharityList } = useWeb3Contract({
    abi: abi,
    contractAddress: charityAddress,
    functionName: "getCharityList",
    params: {},
  });

  async function updateUI() {
    const x = await getNumberOfCharitiesRegistered({
      onError: (err) => {
        console.log(err);
      },
    });
    setNumber(x);
    const xx = await getCharityList({
      onError: (err) => {
        console.log(err);
      },
    });
    const arr = Object.values(xx);
    setcharities(arr);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Charity DAO</title>
        <meta name="description" content="A charity dao" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Number number={number} />
      <div>
        {charities.map((charity, index) => (
          <Link href={`/charity/${encodeURIComponent(charity[5])}`}>
            <CharityList
              key={index}
              name={charity[3]}
              agenda={charity[6]}
              cred={charity[0]}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
