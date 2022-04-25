import {Token} from "../Main"
import {useEthers, useTokenBalance, useNotifications} from "@usedapp/core"
import {formatUnits} from "@ethersproject/units"
import Alert from "@material-ui/lab/Alert"
import {Button, CircularProgress, Snackbar, makeStyles} from "@material-ui/core"
import React, {useState, useEffect} from "react"
import {useStakeTokens} from "../../hooks"
import { utils } from "ethers"
import { SliderInput } from "../../components"

export interface StakeFormProps {
    token: Token
}

const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: theme.spacing(2),
      width: "100%",
    },
    slider: {
      width: "100%",
      maxWidth: "400px",
    },
  }))

export const StakeForm = ({token}: StakeFormProps) => {
    const classes = useStyles()

    const {address: tokenAddress, name} = token
    const {account} = useEthers()
    const tokenBalance = useTokenBalance(tokenAddress, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const {notifications} = useNotifications()

    const [amount, setAmount ] = useState<number | string | Array<number | string>>(0)

    const {approveAndStake, approveAndStakeErc20State} = useStakeTokens(tokenAddress)
    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())
    }

    const isMining = approveAndStakeErc20State.status === "Mining"
    const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] = useState(false)
    const [showStakeTokenSuccess, setShowStakeTokenSuccess] = useState(false)
    const handleCloseSnack = () => {
        setShowErc20ApprovalSuccess(false)
        setShowStakeTokenSuccess(false)
    }

    useEffect(() => {
        if(notifications.filter(
            (notification) => 
                notification.type === "transactionSucceed" && 
                notification.transactionName === "Approve ERC20 transfer").length > 0) {
            setShowErc20ApprovalSuccess(true)
            setShowStakeTokenSuccess(false)
        }
        if(notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Stake Tokens").length > 0) {
            setShowErc20ApprovalSuccess(false)
            setShowStakeTokenSuccess(true)
        }
    }, [notifications, showErc20ApprovalSuccess, showStakeTokenSuccess])

    const hasZeroBalance = formattedTokenBalance === 0
    const hasZeroAmountSelected = parseFloat(amount.toString()) === 0

  return (
    <>
      <div className={classes.container}>
        <SliderInput
          label={`Stake ${name}`}
          maxValue={formattedTokenBalance}
          id={`slider-input-${name}`}
          className={classes.slider}
          value={amount}
          onChange={setAmount}
          disabled={isMining || hasZeroBalance}
        />
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={handleStakeSubmit}
          disabled={isMining || hasZeroAmountSelected}
        >
          {isMining ? <CircularProgress size={26} /> : "Stake"}
        </Button>
      </div>
      <Snackbar
        open={showErc20ApprovalSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          ERC-20 token transfer approved successfully! Now approve the 2nd tx to
          initiate the staking transfer.
        </Alert>
      </Snackbar>
      <Snackbar
        open={showStakeTokenSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          Tokens staked successfully!
        </Alert>
      </Snackbar>
    </>
  )
}