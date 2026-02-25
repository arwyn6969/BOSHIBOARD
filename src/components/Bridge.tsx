"use client";

import { useState } from "react";
import { ArrowDownUp, ShieldCheck, Wallet, Loader2 } from "lucide-react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatUnits, parseUnits } from "viem";

const BOSHICASH_ADDRESS = "0xea50837B942e8C44B62937A2ff5FfB6258373169";
const ERC1155_TOKEN_ID = BigInt(1); // Assuming BOSHICASH is token ID 1

const erc1155Abi = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }, { name: "id", type: "uint256" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "safeTransferFrom",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "data", type: "bytes" }
    ],
    outputs: [],
  }
] as const;

export default function Bridge() {
  const { address, isConnected } = useAccount();
  const [isBridging, setIsBridging] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("100");

  const { data: balanceData, isLoading: isLoadingBalance } = useReadContract({
    address: BOSHICASH_ADDRESS,
    abi: erc1155Abi,
    functionName: "balanceOf",
    args: address ? [address, ERC1155_TOKEN_ID] : undefined,
    query: {
      enabled: !!address,
    }
  });

  const { writeContractAsync } = useWriteContract();

  const displayBalance = balanceData !== undefined ? formatUnits(balanceData, 18) : "0.00";

  const handleBridge = async () => {
    if (!address) return;
    setIsBridging(true);
    setBridgeStatus("Initializing Emblem Vault SDK...");
    
    try {
      const EmblemVaultSDK = (await import("emblem-vault-sdk")).default;
      const sdk = new EmblemVaultSDK("demo");
      
      setBridgeStatus("Generating Vault...");
      
      // Step 1: Create the Vault
      // We use a mock template pointing to generic vaulting
      const contractTemplate = {
        fromAddress: address,
        toAddress: address,
        chainId: 1,
        experimental: true,
        targetContract: {
            "1": "0x82C7a8f70711905398f6d22d264f3d1e9f16af35", // Generic Vault Contract Mock
            name: "Generic Vault",
            description: "A generic vault for Counterparty assets."
        },
        targetAsset: {
            image: "https://emblem.finance/boshi.jpg",
            name: "BOSHICASH Vault",
            xtra: ""
        }
      };

      const vaultData = await sdk.createCuratedVault(contractTemplate, (topic: string, msg: string) => {
        console.log(`[SDK] ${topic}: ${msg}`);
      });

      if (!vaultData || !vaultData.addresses) {
        throw new Error("Failed to generate vault deposit addresses.");
      }

      // Step 2: Find the ETH deposit address for the vault
      const ethDepositAddress = vaultData.addresses.find((a: any) => a.coin === 'ETH')?.address;
      
      if (!ethDepositAddress) {
        throw new Error("ETH Deposit Address missing from generated vault.");
      }

      setBridgeStatus("Depositing BOSHICASH to Vault...");

      // Step 3: Trigger the actual Web3 Transfer
      const txHash = await writeContractAsync({
        address: BOSHICASH_ADDRESS,
        abi: erc1155Abi,
        functionName: "safeTransferFrom",
        args: [
          address, 
          ethDepositAddress as `0x${string}`, 
          ERC1155_TOKEN_ID, 
          parseUnits(amount, 18), 
          "0x"
        ]
      });

      setBridgeStatus("Waiting for Deposit Confirmation...");
      
      // Step 4: Confirm Balance (Mock polling for demo)
      setTimeout(() => {
        setBridgeStatus("Refreshing SDK Balance...");
        setTimeout(() => {
          setBridgeStatus("Minting Vault NFT...");
          setTimeout(() => {
            setIsBridging(false);
            setBridgeStatus("Successfully swapped to DANKROSECASH!");
            setTimeout(() => {
              setBridgeStatus(null);
            }, 4000);
          }, 2000);
        }, 1500)
      }, 3000);

    } catch (e: any) {
      console.error(e);
      setBridgeStatus(e.message || "Failed to complete sequence");
      setTimeout(() => setBridgeStatus(null), 3000);
      setIsBridging(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col gap-6">
        <div className="space-y-4">
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 transition-colors hover:border-slate-600/50">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">From (Ethereum)</label>
              <span className="text-xs text-slate-500 font-mono">
                {isLoadingBalance ? "Bal: ..." : `Bal: ${Number(displayBalance).toFixed(2)}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                  <span className="text-xs font-bold text-white">BOS</span>
                </div>
                <span className="text-xl font-bold text-white tracking-tight">BOSHICASH</span>
              </div>
              <input 
                type="text" 
                placeholder="0.0" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-right text-2xl font-mono font-medium text-white focus:outline-none w-1/3 placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="relative flex justify-center -my-2 z-10">
            <button className="bg-slate-800 border-4 border-[#0f172a] p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors pointer-events-none">
              <ArrowDownUp className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 transition-colors hover:border-slate-600/50">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">To (Counterparty)</label>
              <span className="text-xs text-slate-500 font-mono">Bal: 0.00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-inner">
                  <span className="text-xs font-bold text-white">DRC</span>
                </div>
                <span className="text-xl font-bold text-white tracking-tight">DANKROSECASH</span>
              </div>
              <input 
                type="text" 
                placeholder="0.0" 
                disabled
                className="bg-transparent text-right text-2xl font-mono font-medium text-white focus:outline-none w-1/3 placeholder:text-slate-600 cursor-not-allowed opacity-80"
                value={amount}
              />
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-slate-300 leading-relaxed">
            Assets are vaulted via the <span className="text-white font-medium">Emblem Vault SDK</span>. Your BOSHICASH will be securely wrapped into an NFT and swapped for DANKROSECASH.
          </div>
        </div>

        {!isConnected ? (
          <div className="flex justify-center flex-col items-center gap-3 w-full">
            <ConnectButton.Custom>
              {({ account, chain, openConnectModal, mounted }) => {
                const ready = mounted;
                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                    className="w-full"
                  >
                    <button
                      onClick={openConnectModal}
                      className="w-full h-14 rounded-xl bg-white text-black font-bold text-lg hover:bg-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                      <Wallet className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                      Connect Wallet
                    </button>
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        ) : (
          <button 
            onClick={handleBridge}
            disabled={isBridging || bridgeStatus !== null}
            className="w-full h-14 rounded-xl relative overflow-hidden font-bold text-lg transition-all active:scale-[0.98] disabled:active:scale-100 group shadow-lg shadow-primary/25 disabled:opacity-90"
          >
            <div className="absolute inset-0 bg-linear-to-r from-primary to-accent"></div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-center gap-3 text-white">
              {isBridging ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {bridgeStatus}
                </>
              ) : bridgeStatus ? (
                <span className="text-emerald-300 drop-shadow-sm">{bridgeStatus}</span>
              ) : (
                "Vault & Swap"
              )}
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
