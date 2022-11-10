import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { AdderContractAddress } from "./config";
import ContractAbi from "./utils/NumberToAddress.json";

function App() {
  const [input, setInput] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [number, setNumber] = useState();
  const [address, setAddress] = useState();
  // Connecting metamask
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Metamask not connected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);
      const polygonChainId = "0x13881";

      if (chainId != polygonChainId) {
        alert("Not Connected to Polygon Chain");
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };
  // Add Amount
  const addNum = async (e) => {
    e.preventDefault();
    let amt = input;
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const AdderContract = new ethers.Contract(
          AdderContractAddress,
          ContractAbi.abi,
          signer
        );
        AdderContract.setAmount(amt)
          .then((response) => {
            console.log("Completed Task");
          })
          .catch((err) => {
            console.log("Error occured while adding a new amount");
          });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error submitting new Task", error);
    }
    setInput("");
  };
  // Show Ammount
  const getTotalAmount = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const AdderContract = new ethers.Contract(
          AdderContractAddress,
          ContractAbi.abi,
          signer
        );
        let allAmount = await AdderContract.getTotalNumber();
        setNumber(allAmount);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTotalAmount();
}, []);
  // Show Addresses
  const getTotalAddress = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const AdderContract = new ethers.Contract(
          AdderContractAddress,
          ContractAbi.abi,
          signer
        );
        let allAdd = await AdderContract.getTotalAccounts();
        setAddress(allAdd);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTotalAddress();
}, []);
  return (
    <>
      {currentAccount === "" ? (
        <div className="grid h-screen place-items-center">
          <button className="btn btn-wide" onClick={connectWallet}>
            Connect Wallet
          </button>
        </div>
      ) : correctNetwork ? (
        <div className="min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w">
              <h1 className="text-md font-bold">
                Welcome User {currentAccount}
              </h1>
              <form className="mb-4">
                <input
                  type="text"
                  placeholder="Enter Amount"
                  className="input input-bordered input-info w-full max-w-xs m-3"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button className="btn btn-info" onClick={addNum}>
                  Add Amount
                </button>
              </form>
              <div>
                <div className="stats stats-vertical lg:stats-horizontal shadow">
                  <div className="stat">
                    <div className="stat-title">Total Accounts</div>
                    <div className="stat-value">{address}</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Total Amount</div>
                    <div className="stat-value">{number}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid h-screen place-items-center">
          <div className="alert alert-error shadow-l">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Please Connect to correct testnet.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
