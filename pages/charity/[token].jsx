"use client";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../../constants";
import { useNotification } from "web3uikit";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const token = router.query.token;

  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const charityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [charity, setCharity] = useState([]);

  const dispatch = useNotification();

  const { runContractFunction: getCharityByTokenName } = useWeb3Contract({
    abi: abi,
    contractAddress: charityAddress,
    functionName: "getCharityByTokenName",
    params: { _tokenName: token.toString() },
  });

  async function updateUI() {
    const x = await getCharityByTokenName();
    setCharity(x);
    console.log(x);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <>
      <Header />
      <div>
        <h1>{token}</h1>
      </div>
    </>
  );
};

export default Page;
