import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import brownieConfig from "../brownie-config.json"
import dapp from "../dapp.png"
import eth from "../eth.png"
import dai from "../dai.png"
import { YourWallet } from "./yourWallet/YourWallet"
import React, { useEffect, useState } from "react"
import { TokenFarmContract } from "./TokenFarmContract"
import { Snackbar, Typography, makeStyles } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

export type Token = {
    image: string
    address: string
    name: string
}

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.common.white,
        textAlign: "center",
        padding: theme.spacing(4)
    }
}))

export const Main = () => {
    const classes = useStyles()
    const { chainId, error } = useEthers()

    const networkName = chainId ? helperConfig[chainId] : "dev"

    const dappTokenAddress = chainId ? networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero


    const supportedTokens: Array<Token> = [
        {
            image: dapp, 
            address: dappTokenAddress,
            name: "DAPP"
        },
        {
            image: eth, 
            address: wethTokenAddress,
            name: "WETH"
        },
        {
            image: dai, 
            address: fauTokenAddress,
            name: "FAU"
        },
    ]

    const [showNetworkError, setShowNetworkError] = useState(false)

    const handleCloseNetworkError = (
      event: React.SyntheticEvent | React.MouseEvent,
      reason?: string
    ) => {
      if (reason === "clickaway") {
        return
      }
  
      showNetworkError && setShowNetworkError(false)
    }

    return (
        <>
          <Typography
            variant="h2"
            component="h1"
            classes={{
              root: classes.title,
            }}
          >
            Dapp Token Farm
          </Typography>
          <YourWallet supportedTokens={supportedTokens} />
          <TokenFarmContract supportedTokens={supportedTokens} />
          <Snackbar
            open={showNetworkError}
            autoHideDuration={5000}
            onClose={handleCloseNetworkError}
          >
            <Alert onClose={handleCloseNetworkError} severity="warning">
              You gott toconnect to the Kovan or Rinkeby network!
            </Alert>
          </Snackbar>
        </>
      )
}