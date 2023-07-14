"use client";
import React, { useState } from "react";
import Header from "../../components/Header";
import { contractAddresses, abi } from "../../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useNotification } from "web3uikit";

const CreateCharity = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const charityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [formData, setformData] = useState({
    _name: "",
    _tokenName: "",
    _agenda: "",
    _tags: ["all"],
    _ownerAddress: "",
  });

  const { runContractFunction: createCharity } = useWeb3Contract({
    abi: abi,
    contractAddress: charityAddress,
    functionName: "createCharity",
    params: formData,
  });

  const dispatch = useNotification();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setformData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    let token = formData._name;
    token = token.toLowerCase();
    token = token.replace(" ", "_");
    setformData((prev) => ({ ...prev, _tokenName: token }));
    event.preventDefault();
    await createCharity({
      onError: (err) => {
        console.log(err);
      },
      onSuccess: handleSuccess,
    });
  };

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
  };

  const handleNewNotification = function () {
    dispatch({
      type: "info",
      message: "Charity Created",
      title: "Tx Notification",
      position: "topR",
    });
  };

  if (isWeb3Enabled) {
    return (
      <>
        <Header />
        <form onSubmit={handleSubmit} className="mt-5 pl-5">
          <label htmlFor="_name" className=" font-bold">
            Name
          </label>
          <br />
          <input
            type="text"
            id="_name"
            name="_name"
            value={formData._name}
            onChange={handleChange}
            className="shadow border mb-3"
            required
          />
          <br />
          <label htmlFor="_agenda" className=" font-bold">
            Agenda
          </label>
          <br />
          <textarea
            type="text"
            id="_agenda"
            name="_agenda"
            value={formData._agenda}
            onChange={handleChange}
            className="shadow border mb-3"
            required
          />
          <br />
          <label htmlFor="_ownerAddress" className=" font-bold">
            Owner Address
          </label>
          <br />
          <input
            type="text"
            id="_ownerAddress"
            name="_ownerAddress"
            value={formData._ownerAddress}
            onChange={handleChange}
            className="shadow border mb-3"
            required
          />
          <br />
          <button
            type="submit"
            className="font-bold bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded"
          >
            Create
          </button>
        </form>
      </>
    );
  } else {
    return (
      <>
        <Header />
        <h1 className="mt-5 ml-5 ">Please connect your wallet.</h1>
      </>
    );
  }
};

export default CreateCharity;
