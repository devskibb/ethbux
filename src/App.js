import React, { useState, useEffect } from 'react';
import { 
  BrowserProvider, 
  Contract, 
  parseEther, 
  formatEther,
  Interface 
} from 'ethers';
import styled from 'styled-components';
import { 
  Window, 
  WindowHeader, 
  WindowContent, 
  Button, 
  TextInput,
  Tabs,
  Tab,
  TabBody,
  Fieldset
} from 'react95';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import original from 'react95/dist/themes/original';
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';
import Draggable from 'react-draggable';
import { TaskBar } from './components/TaskBar';
import { Desktop } from './components/Desktop';
import { DisplayProperties } from './components/DisplayProperties';
import { Notepad } from './components/Notepad';
import { wallpapers } from './assets/wallpapers';
import { MyComputer } from './components/MyComputer';
import { Minesweeper } from './components/Minesweeper';
import { Internet } from './components/Internet';
import { Tooltip } from './components/Tooltip';
import { Doom } from './components/Doom';
import { Pinball } from './components/Pinball';

/* global BigInt */

const ABI = [
  "function mint() payable",
  "function redeem(uint256 amount)",
  "function getTrueSupply() view returns (uint256)",
  "function aprData() view returns (uint256 feesPast24h, uint256 lastUpdateTime)",
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function reflectFees()"
];

const CONTRACT_ADDRESS = "0x910De3fF7e1733E3ED29c9b90B6e30b7593D8126";
const BASE_CHAIN_ID = "0x2105"; // Base mainnet

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
  }
  * {
    font-family: 'ms_sans_serif' !important;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
`;

const WindowWrapper = styled.div`
  width: 400px;
  position: absolute;
`;

const StatusField = styled(Fieldset)`
  margin-bottom: 1rem;
  word-break: break-all;
`;

const CloseButton = styled(Button)`
  position: absolute !important;
  right: 10px !important;
  top: 12px !important;
  width: 22px !important;
  height: 22px !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  
  span {
    font-size: 18px;
    transform: translateY(-1px);
  }
`;

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [mintAmount, setMintAmount] = useState('');
  const [redeemAmount, setRedeemAmount] = useState('');
  const [trueSupply, setTrueSupply] = useState('0');
  const [apr, setApr] = useState(0);
  const [buxBalance, setBuxBalance] = useState('0');
  const [ethBalance, setEthBalance] = useState('0');
  const [activeTab, setActiveTab] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [currentWallpaper, setCurrentWallpaper] = useState(wallpapers.teal.color);
  const [openWindows, setOpenWindows] = useState({
    ethbux: true,
    display: false,
    notepad: false,
    computer: false,
    minesweeper: false,
    internet: false,
    doom: false,
    pinball: false
  });
  const [windowPosition, setWindowPosition] = useState({
    x: window.innerWidth / 2 - 200,
    y: window.innerHeight / 2 - 250
  });
  const [burnAmount, setBurnAmount] = useState('');

  const toggleWindow = (windowName) => {
    setOpenWindows(prev => ({
      ...prev,
      [windowName]: !prev[windowName]
    }));
  };

  const updateBalances = async () => {
    if (provider && contract) {
      try {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        // Get ETH balance
        const ethBal = await provider.getBalance(address);
        console.log("ETH Balance:", formatEther(ethBal));
        setEthBalance(formatEther(ethBal));
        
        // Get BUX balance
        const buxBal = await contract.balanceOf(address);
        console.log("BUX Balance:", formatEther(buxBal));
        setBuxBalance(formatEther(buxBal));

        console.log("Wallet details:", {
          address,
          ethBalance: formatEther(ethBal),
          buxBalance: formatEther(buxBal)
        });
      } catch (err) {
        console.error("Error updating balances:", err);
        console.error("Error details:", {
          message: err.message,
          code: err.code,
          data: err.data
        });
      }
    } else {
      console.log("Provider or contract not initialized", {
        provider: !!provider,
        contract: !!contract
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          console.log("Initializing...");
          
          // First request account access
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          const currentAddress = accounts[0];
          console.log("Connected address:", currentAddress);
          setWalletAddress(currentAddress);
          
          const provider = new BrowserProvider(window.ethereum);
          console.log("Provider created");
          
          const signer = await provider.getSigner();
          console.log("Signer obtained");
          
          const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
          console.log("Contract instance created");
          
          setProvider(provider);
          setContract(contract);
          
          // Get ETH balance
          const ethBal = await provider.getBalance(currentAddress);
          console.log("Initial ETH balance:", formatEther(ethBal));
          setEthBalance(formatEther(ethBal));
          
          // Get BUX balance
          const buxBal = await contract.balanceOf(currentAddress);
          console.log("Initial BUX balance:", formatEther(buxBal));
          setBuxBalance(formatEther(buxBal));
          
          await updateData(contract);
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', async (accounts) => {
            const newAddress = accounts[0];
            setWalletAddress(newAddress);
            
            // Update balances for new account
            const newEthBal = await provider.getBalance(newAddress);
            setEthBalance(formatEther(newEthBal));
            
            const newBuxBal = await contract.balanceOf(newAddress);
            setBuxBalance(formatEther(newBuxBal));
            
            await updateData(contract);
          });
        }
      } catch (err) {
        console.error("Initialization error:", err);
        console.error("Error details:", {
          message: err.message,
          code: err.code,
          data: err.data
        });
      }
    };
    init();
  }, []);

  const isMintDisabled = () => {
    if (!mintAmount || mintAmount === '0') return true;
    try {
      const weiAmount = parseEther(mintAmount);
      const weiBalance = parseEther(ethBalance);
      return weiAmount > weiBalance;
    } catch {
      return true;
    }
  };

  const isRedeemDisabled = () => {
    if (!redeemAmount || redeemAmount === '0') return true;
    try {
      const weiAmount = parseEther(redeemAmount);
      const weiBuxBalance = parseEther(buxBalance);
      return weiAmount > weiBuxBalance;
    } catch {
      return true;
    }
  };

  const updateData = async () => {
    try {
      if (!contract || !walletAddress) {
        console.log("Missing requirements:", { contract: !!contract, walletAddress: !!walletAddress });
        return;
      }

      console.log("Starting data update...");

      // Get the raw data
      const supply = await contract.getTrueSupply();
      console.log("Got supply:", supply.toString());

      const aprData = await contract.aprData();
      console.log("Got APR data:", {
        feesPast24h: aprData[0].toString(),
        timestamp: aprData[1].toString()
      });

      const buxBalance = await contract.balanceOf(walletAddress);
      console.log("Got balance:", buxBalance.toString());

      // Format the values
      const formattedSupply = formatEther(supply);
      const formattedFees = formatEther(aprData[0]);
      const formattedBalance = formatEther(buxBalance);

      console.log("Formatted values:", {
        formattedSupply,
        formattedFees,
        formattedBalance
      });

      // Set the states
      setTrueSupply(formattedSupply);
      setBuxBalance(formattedBalance);
      
      // Calculate APR
      const dailyFeesInBux = Number(formattedFees);
      const currentSupply = Number(formattedSupply);
      
      // APR = (Daily Fees * 365 * 100) / Total Supply
      const aprValue = currentSupply > 0 ? (dailyFeesInBux * 365 * 100) / currentSupply : 0;
      
      console.log("APR calculation:", {
        dailyFeesInBux,
        currentSupply,
        aprValue
      });

      setApr(aprValue);

    } catch (err) {
      console.error("Data update error:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        data: err.data
      });
    }
  };

  // Make sure updateData is called when contract is initialized
  useEffect(() => {
    if (contract && walletAddress) {
      console.log("Contract and wallet ready, updating data...");
      updateData();
      
      // Set up interval for updates
      const interval = setInterval(updateData, 10000);
      return () => clearInterval(interval);
    }
  }, [contract, walletAddress]);

  const handleMint = async () => {
    try {
      const weiAmount = parseEther(mintAmount);
      
      console.log("Attempting to mint with:", {
        value: weiAmount.toString(),
        contract: contract.target
      });
      
      // First estimate gas
      console.log("Estimating gas...");
      const gasEstimate = await contract.mint.estimateGas({
        value: weiAmount
      });
      console.log("Gas estimate:", gasEstimate.toString());
      
      // Add 20% buffer to gas estimate
      const gasLimit = Math.floor(Number(gasEstimate) * 1.2);
      console.log("Gas limit with buffer:", gasLimit);
      
      // Call mint with estimated gas
      const tx = await contract.mint({
        value: weiAmount,
        gasLimit: gasLimit
      });
      
      console.log("Transaction sent:", tx);
      console.log("Waiting for confirmation...");
      
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      
      console.log("Transaction successful!");
      updateData(contract);
      await updateBalances();
      setMintAmount('');
    } catch (err) {
      console.error("Minting error details:", {
        error: err,
        errorMessage: err.message,
        errorReason: err.reason,
        errorCode: err.code,
        transaction: err.transaction,
        data: err.data,
        error_data: err.error?.data // Additional error data if available
      });
      
      if (err.reason) {
        alert(`Error: ${err.reason}`);
      } else if (err.error?.data) {
        alert(`Transaction failed: ${err.error.data}`);
      } else {
        alert('Error minting BUX. Check console for details.');
      }
    }
  };

  const handleRedeem = async () => {
    try {
      // Convert BUX amount to wei (18 decimals)
      const buxWeiAmount = parseEther(redeemAmount);
      
      console.log("Attempting to redeem:", {
        amount: buxWeiAmount.toString(),
        contract: contract.target
      });
      
      // First estimate gas
      console.log("Estimating gas...");
      const gasEstimate = await contract.redeem.estimateGas(buxWeiAmount);
      console.log("Gas estimate:", gasEstimate.toString());
      
      // Add 20% buffer to gas estimate
      const gasLimit = Math.floor(Number(gasEstimate) * 1.2);
      console.log("Gas limit with buffer:", gasLimit);
      
      // Call redeem with the BUX amount
      const tx = await contract.redeem(buxWeiAmount, {
        gasLimit: gasLimit
      });
      
      console.log("Transaction sent:", tx);
      console.log("Waiting for confirmation...");
      
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      
      console.log("Transaction successful!");
      updateData(contract);
      await updateBalances();
      setRedeemAmount('');
    } catch (err) {
      console.error("Redeem error details:", {
        error: err,
        errorMessage: err.message,
        errorReason: err.reason,
        errorCode: err.code,
        transaction: err.transaction,
        data: err.data,
        error_data: err.error?.data
      });
      
      if (err.reason) {
        alert(`Error: ${err.reason}`);
      } else if (err.error?.data) {
        alert(`Transaction failed: ${err.error.data}`);
      } else {
        alert('Error redeeming BUX. Check console for details.');
      }
    }
  };

  const handleReflectFees = async () => {
    try {
      console.log("Reflecting fees...");
      const tx = await contract.reflectFees();
      console.log("Transaction sent:", tx);
      
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);
      
      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
      
      console.log("Fees reflected successfully!");
      await updateData(contract);
      await updateBalances();
    } catch (err) {
      console.error("Reflect fees error:", err);
      if (err.reason) {
        alert(`Error: ${err.reason}`);
      } else {
        alert('Error reflecting fees. Check console for details.');
      }
    }
  };

  const disconnectWallet = () => {
    // Simply clear all our app's state
    setWalletAddress('');
    setEthBalance('0');
    setBuxBalance('0');
    setContract(null);
    setMintAmount('');
    setBurnAmount('');
    setTrueSupply('0');
    setApr(0);
    
    console.log('Wallet disconnected');
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        const account = accounts[0];
        setWalletAddress(account);
        
        // Initialize contract and update data
        await init(account);
      } else {
        console.error('No ethereum wallet detected');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleBurn = async () => {
    try {
      if (!contract || !burnAmount) return;
      
      const tx = await contract.burn(parseEther(burnAmount));
      await tx.wait();
      
      // Update data after burn
      await updateData();
      setBurnAmount('');
    } catch (error) {
      console.error('Error burning tokens:', error);
    }
  };

  const isBurnDisabled = () => {
    return !contract || 
           !burnAmount || 
           isNaN(burnAmount) || 
           Number(burnAmount) <= 0 || 
           Number(burnAmount) > Number(buxBalance);
  };

  const init = async (account) => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const ethbuxContract = new Contract(
        CONTRACT_ADDRESS,
        ABI,
        signer
      );

      setContract(ethbuxContract);
      
      // Get ETH balance
      const balance = await provider.getBalance(account);
      setEthBalance(formatEther(balance));
      
      // Update all data
      await updateData();
    } catch (error) {
      console.error('Error initializing:', error);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          // User disconnected
          disconnectWallet();
        } else {
          // User switched accounts
          setWalletAddress(accounts[0]);
        }
      });

      return () => {
        window.ethereum.removeListener('accountsChanged', () => {});
      };
    }
  }, []);

  return (
    <ThemeProvider theme={original}>
      <GlobalStyles />
      <Wrapper style={
        currentWallpaper.startsWith('#') ? 
          { backgroundColor: currentWallpaper } : 
          { 
            backgroundImage: `url(${currentWallpaper})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }
      }>
        <Desktop onOpenWindow={toggleWindow} />
        
        {/* ETHBUX.EXE window */}
        {openWindows.ethbux && (
          <Draggable 
            handle=".window-header" 
            bounds="parent"
            defaultPosition={windowPosition}
            onDrag={(e, data) => setWindowPosition({ x: data.x, y: data.y })}
          >
            <Window 
              className='window'
              style={{ width: '400px' }}
            >
              <WindowHeader className="window-header">
                ETHBUX.EXE
                <CloseButton onClick={() => toggleWindow('ethbux')}>
                  <span>×</span>
                </CloseButton>
              </WindowHeader>
              <WindowContent>
                <Tabs value={activeTab} onChange={setActiveTab}>
                  <Tab value={0}>Trade</Tab>
                  <Tab value={1}>Wallet</Tab>
                </Tabs>
                <TabBody>
                  {activeTab === 0 ? (
                    <>
                      <StatusField label="Market Info">
                        <p>
                          True Supply: {Number(trueSupply).toLocaleString()} BUX
                        </p>
                        <p>
                          Current APR: {Number(apr).toFixed(6)}%
                          <Tooltip text="APR is calculated based on the fees collected in the last 24 hours, annualized. As more liquidity enters the protocol, more fees are captured from the pool, potentially increasing the APR. This creates a positive feedback loop where higher liquidity leads to higher returns." />
                        </p>
                        <Button 
                          onClick={handleReflectFees}
                          style={{ marginTop: '0.5rem', width: '100%' }}
                        >
                          Reflect Fees
                        </Button>
                      </StatusField>

                      <div style={{ marginBottom: '1rem' }}>
                        <TextInput
                          placeholder="ETH Amount"
                          value={mintAmount}
                          onChange={e => setMintAmount(e.target.value)}
                          style={{ width: '100%' }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                          <Button 
                            onClick={handleMint} 
                            disabled={isMintDisabled()}
                          >
                            Mint BUX
                          </Button>
                          <Tooltip text="Deposit ETH to receive the equivalent dollar value in BUX tokens. The exchange rate is determined by the current ETH/USD price." />
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <TextInput
                            placeholder="BUX Amount"
                            value={redeemAmount}
                            onChange={e => setRedeemAmount(e.target.value)}
                            style={{ width: '100%' }}
                          />
                          <Button 
                            onClick={() => setRedeemAmount(buxBalance)}
                            style={{ minWidth: 'auto', padding: '0 0.5rem' }}
                          >
                            Max
                          </Button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Button 
                            onClick={handleRedeem} 
                            disabled={isRedeemDisabled()}
                            style={{ marginTop: '0.5rem' }}
                          >
                            Redeem
                          </Button>
                          <Tooltip text="Redeem ETH by burning BUX. Receive the equivalent dollar value in ETH." />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <StatusField label="Wallet">
                        <p>Address: {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not Connected'}</p>
                        <p>ETH Balance: {Number(ethBalance).toFixed(4)} ETH</p>
                        <p>BUX Balance: {Number(buxBalance).toLocaleString()} BUX</p>
                        <Button 
                          onClick={walletAddress ? disconnectWallet : connectWallet}
                          style={{ marginTop: '0.5rem', width: '100%' }}
                        >
                          {walletAddress ? 'Disconnect Wallet' : 'Connect Wallet'}
                        </Button>
                      </StatusField>

                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <TextInput
                            placeholder="BUX Amount"
                            value={burnAmount}
                            onChange={e => setBurnAmount(e.target.value)}
                            style={{ width: '100%' }}
                          />
                          <Button 
                            onClick={() => setBurnAmount(buxBalance)}
                            style={{ minWidth: 'auto', padding: '0 0.5rem' }}
                          >
                            Max
                          </Button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                          <Button 
                            onClick={handleBurn}
                            disabled={isBurnDisabled()}
                          >
                            Redeem
                          </Button>
                          <Tooltip text="Burn your BUX tokens to receive the equivalent dollar value back in ETH. The exchange rate is determined by the current ETH/USD price." />
                        </div>
                      </div>
                    </>
                  )}
                </TabBody>
              </WindowContent>
            </Window>
          </Draggable>
        )}

        {/* Display Properties window */}
        {openWindows.display && (
          <DisplayProperties 
            onClose={() => toggleWindow('display')}
            currentWallpaper={currentWallpaper}
            onWallpaperChange={setCurrentWallpaper}
          />
        )}

        {/* Notepad window */}
        {openWindows.notepad && (
          <Notepad onClose={() => toggleWindow('notepad')} />
        )}

        {/* MyComputer window */}
        {openWindows.computer && (
          <MyComputer onClose={() => toggleWindow('computer')} />
        )}

        {/* Minesweeper window */}
        {openWindows.minesweeper && (
          <Minesweeper onClose={() => toggleWindow('minesweeper')} />
        )}

        {/* Internet window */}
        {openWindows.internet && (
          <Internet onClose={() => toggleWindow('internet')} />
        )}

        {/* Doom window */}
        {openWindows.doom && (
          <Doom onClose={() => toggleWindow('doom')} />
        )}

        {/* Pinball window */}
        {openWindows.pinball && (
          <Pinball onClose={() => toggleWindow('pinball')} />
        )}

        <TaskBar 
          openWindows={openWindows}
          onWindowClick={toggleWindow}
        />
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;