import './App.scss';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { getIpfsURL, uploadFile, vignette_abi, vignette_address } from './helpers';
import Photograph from './components/Photograph';
import Feed from './components/Feed';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';

function App() {
  // states
  const [ethprovider, setEthProvider] = useState<Web3Provider | undefined>(undefined);
  const [ethSigner, setEthSigner] = useState<JsonRpcSigner | undefined>(undefined);
  const [currentAccount, setCurrentAccount] = useState('');

  useEffect(() => {
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      }
    });
  }, [ethprovider]);

  // functions
  const connectToMetaMask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const accounts = await provider.send('eth_requestAccounts', []);

    setEthProvider(provider);
    setEthSigner(signer);
    if (accounts.length > 0) {
      setCurrentAccount(accounts[0]);
    }
  };

  return (
    <div className="App">
      <Header
        connectToMetaMask={connectToMetaMask}
        currentAccount={currentAccount}
        ethprovider={ethprovider}
      ></Header>

      <Routes>
        <Route
          path="/profile"
          element={
            <ProfilePage
              currentAccount={currentAccount}
              ethSigner={ethSigner}
              ethprovider={ethprovider}
            />
          }
        />
        <Route
          path="/"
          element={
            <HomePage 
            ethprovider={ethprovider}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
