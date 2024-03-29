import { ethers } from "ethers";
import contract from "../../smart-contract/build/contracts/TaskContract.json";
import { Task } from "@app/types/task";
import { enqueueSnackbar } from "notistack";

export const connectWallet = async (): Promise<undefined | string> => {
  try {
    if (typeof window === undefined || !window?.ethereum) {
      enqueueSnackbar("Metamask not detected!", { variant: "error" });
      return;
    }
    const { ethereum } = window;
    const chainId = await ethereum.request({ method: "eth_chainId" });
    if (chainId !== "0xaa36a7") {
      enqueueSnackbar("Your are not connecting with Sepolia network!", {
        variant: "error",
      });
      return;
    }
    const account = await ethereum.request({ method: "eth_requestAccounts" });
    if (!account.length) {
      enqueueSnackbar("Not founding your account!", { variant: "error" });
      return;
    }
    return account[0];
  } catch (error) {
    console.error((error as Record<string, string>).message);
    return;
  }
};

export const getContract = async () => {
  if (typeof window === undefined || !window?.ethereum) {
    enqueueSnackbar("Metamask not detected!", { variant: "error" });
    return false;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "",
    contract.abi,
    signer
  );
};

export const addTask = async (title: string): Promise<boolean> => {
  try {
    const taskContract = await getContract();
    if (!taskContract) {
      return false;
    }
    await taskContract.addTask(title);
    return true;
  } catch (error) {
    console.error((error as Record<string, string>).message);
    return false;
  }
};

export const deleteTask = async (id: number): Promise<boolean> => {
  try {
    const taskContract = await getContract();
    if (!taskContract) {
      return false;
    }
    await taskContract.deleteTask(id);
    return true;
  } catch (error) {
    console.error((error as Record<string, string>).message);
    return false;
  }
};

export const getAllTask = async (): Promise<Task[]> => {
  try {
    const taskContract = await getContract();

    if (!taskContract) {
      return [];
    }

    const tasks: Task[] = await taskContract.getMyTasks();

    return tasks;
  } catch (error) {
    console.error((error as Record<string, string>).message);
    return [];
  }
};
