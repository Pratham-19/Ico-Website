import React, { useEffect,useState } from 'react';
import ContractAddress from "../../contracts/contract-address.json";
import TokenArtifacts from "../../contracts/CrossiantToken.json";
import { BuyCoin ,NoWallet,ConnectWallet} from '../../components';
import { BigNumber, ethers } from 'ethers';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const MainPage = () => {
    const owner ="0xAbDfaE994FBE4bA8b502b199Dee9d54Fd1aD9411";
    const [open, setOpen] = React.useState(false);
    const [ownerBal, setOwnerBal] = useState(0);
    const [croToken, setCroToken] = useState(null);
    const [userBal, setUserBal] = useState(0);

    const handleClick = () => {
      setOpen(true);
    };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };
    var token,tokenData,oBal,uBal;
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function (accounts) {
                window.location.reload();
            });
            window.ethereum.on('chainChanged', function (chainId) {
                window.location.reload();
            });
        }
    }, [])
    
    const [networkError,setNetworkError]=useState("");
    const [currentAccount, setCurrentAccount] = useState("");
    const connectWallet= async () => { 
        const [ selectedAddress ] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(selectedAddress);  
        initialiseEther();
        {console.log("ChECKING NETWORK",window.ethereum.networkVersion,typeof window.ethereum.networkVersion)}
        checkNetwork();
        console.log(token.functions.balanceOf(selectedAddress));
        uBal=await token.functions.balanceOf(selectedAddress);
        oBal=await token.functions.balanceOf(owner);
        uBal=parseInt(uBal[0]._hex,16);
        oBal=parseInt(oBal[0]._hex,16);
        console.log("user balance is",uBal);
        console.log("owner balance is",oBal);
        // setUserBal(parseInt(uBal[0]._hex,16));
        setOwnerBal(oBal);
        // // userBal=parseInt(userBal[0]._hex,16);
        // // ownerBal=parseInt(ownerBal[0]._hex,16);
        console.log(uBal,ownerBal);
        setCurrentAccount(selectedAddress);
        tokenData = await  getTokenData(selectedAddress);
        setCroToken(token);
        console.log(croToken)
        return selectedAddress;
    }
    const initialiseEther =() =>{
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        token=new ethers.Contract(
            ContractAddress.Token,
            TokenArtifacts.abi,
            provider.getSigner(0)
            )
        }
    // const getBalance = async (addr) => {
    //     const balance = await token.functions.balanceOf(addr);
    //     console.log(balance);
    // }
    const checkNetwork = async () => {
        if (!(window.ethereum.networkVersion == "5")) {
            setNetworkError("Please connect to Goerli Test Network");
            console.log("Please connect to Goerli Test Network");
            setOpen(true);
            setCurrentAccount("");
            throw new Error("Please Connect to Goerli Test Network");
        }
            setNetworkError("");
    }
        
    const getTokenData = async (addr) => {
        const tname = await token.name(); 
        const tsymbol = await token.symbol();
        return [tname,tsymbol];
    }
    const transfer= async(addr,amt) =>{
        console.log(token);
        await token.functions.transfer(addr,amt);
    console.log(addr,amt);
}

    if (window.ethereum === undefined){
        return <NoWallet/>
    } 
    else if (!currentAccount){
        return (
            <>
        <ConnectWallet connectWallet={connectWallet} open={open}  handleClick={handleClick} handleClose={handleClose}/>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Change network to Goerli !
            </Alert>
        </Snackbar>
            </>);
    }
    else{
        return <BuyCoin addr={currentAccount} ownerBal={oBal} token={token} userBal={uBal} transfer={async(addr,amt) =>{
            console.log(token);
            await transfer(addr,amt);
        console.log(addr,amt);
    }}/>;
    }
}

export default MainPage;