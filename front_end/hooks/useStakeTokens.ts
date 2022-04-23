import {useEthers, useContractFunction} from "@usedapp/core"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contract"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import {networkMapping} from "../chain-info/deployments.json"

export const useStateToken = (tokenAddress: string) => {
    //approve & stake tokens
    const {chainId} = useEthers()
    const {abi} = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)
    
    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)

    const {send: approveErc20Send, state: approveErc20State} = useContractFunction(erc20Contract)

}