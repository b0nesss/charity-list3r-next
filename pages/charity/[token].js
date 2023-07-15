"use client";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../../constants";
import { useNotification } from "web3uikit";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const Page = () => {
  const router = useRouter();
  const token = router.query.token;

  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const charityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [charity, setCharity] = useState([]);
  const [donors, setDonors] = useState([]);
  const [value, setValue] = useState("0");

  const dispatch = useNotification();

  const { runContractFunction: getCharityByTokenName } = useWeb3Contract({
    abi: abi,
    contractAddress: charityAddress,
    functionName: "getCharityByTokenName",
    params: { _tokenName: token.toString() },
  });
  const { runContractFunction: getDonorsArrayByTokenName } = useWeb3Contract({
    abi: abi,
    contractAddress: charityAddress,
    functionName: "getDonorsArrayByTokenName",
    params: { _tokenName: token.toString() },
  });
  const {
    runContractFunction: donate,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: charityAddress,
    functionName: "donate",
    params: { _tokenName: token.toString() },
    msgValue: ethers.utils.parseUnits(value),
  });

  const { runContractFunction: upvote } = useWeb3Contract({
    abi: abi,
    contractAddress: charityAddress,
    functionName: "vouch",
    params: {
      _tokenName: token.toString(),
      _vote: 1,
    },
  });

  const { runContractFunction: downvote } = useWeb3Contract({
    abi: abi,
    contractAddress: charityAddress,
    functionName: "vouch",
    params: {
      _tokenName: token.toString(),
      _vote: -1,
    },
  });

  const handleChange = (event) => {
    const { value } = event.target;
    console.log(typeof value);
    if (value === "") {
      setValue("0");
    } else {
      setValue(value);
    }
  };

  const handleDonateSuccess = async (tx) => {
    await tx.wait(1);
    handleNewDonate(tx);
    updateUI();
  };

  const handleUpvoteSuccess = async (tx) => {
    await tx.wait(1);
    handleNewUpvote(tx);
    updateUI();
  };

  const handleDownvoteSuccess = async (tx) => {
    await tx.wait(1);
    handleNewDownvote();
    updateUI();
  };

  async function updateUI() {
    const x = await getCharityByTokenName();
    setCharity(x);
    const y = await getDonorsArrayByTokenName();
    setDonors(y);
  }

  const handleNewDonate = () => {
    dispatch({
      type: "info",
      message: "Successful Donation",
      title: "Donation",
      position: "topR",
    });
  };
  const handleNewUpvote = () => {
    dispatch({
      type: "info",
      message: "Successfully Approved",
      title: "Upvote",
      position: "topR",
    });
  };
  const handleNewDownvote = () => {
    dispatch({
      type: "info",
      message: "Successfully Disapproved",
      title: "Downvote",
      position: "topR",
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <>
      <Header />
      <div className="flex flex-row">
        <div className=" flex-auto">
          <h1 className="text-2xl ml-2">Current Donors</h1>
          {donors.map((donor, index) => (
            <h1 key={index} className=" mt-2 ml-2">
              {donor[2].toString()} {ethers.utils.formatEther(donor[1])} ETH
            </h1>
          ))}
        </div>
        <div className=" flex-auto">
          <h1 className=" text-2xl">{charity[3]}</h1>
          <h1>Credibility Score: {charity[1]}</h1>
          <h1>Agenda: {charity[6]}</h1>
          <h1>
            Amount donated so far
            {charity[2]}
          </h1>
          <input
            type="number"
            name="val"
            id="val"
            value={value}
            onChange={handleChange}
            className="shadow border mb-3 mr-3"
          />
          <button
            className="font-bold bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded mr-2"
            onClick={async () => {
              await donate({
                onSuccess: handleDonateSuccess,
                onError: (err) => {
                  console.log(err);
                },
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isFetching || isLoading ? (
              <div className=" animate-spin spinner-border w-8 h-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Donate</div>
            )}
          </button>
          <br />
          <button
            className="font-bold bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded mr-2"
            onClick={async () => {
              await upvote({
                onError: (err) => {
                  console.log(err);
                },
                onSuccess: handleUpvoteSuccess,
              });
            }}
            disabled={isFetching || isLoading}
          >
            Upvote Charity
          </button>
          <button
            className="font-bold bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded"
            onClick={async () => {
              await downvote({
                onError: (err) => {
                  console.log(err);
                },
                onSuccess: handleDownvoteSuccess,
              });
            }}
            disabled={isFetching || isLoading}
          >
            Downvote Charity
          </button>
        </div>
      </div>
    </>
  );
};

export default Page;
