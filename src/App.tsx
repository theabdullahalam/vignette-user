import './App.scss';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import ShowPhotograph from './components/ShowPhotograph';

function App() {
  // states
  const [ethprovider, setEthProvider] = useState<Web3Provider | undefined>(undefined);
  const [ethSigner, setEthSigner] = useState<JsonRpcSigner | undefined>(undefined);
  const [currentAccount, setCurrentAccount] = useState('');
  const [profileModalVisible, setProfileModalVisible] = useState<boolean>(false)
  const [photographToShow, setPhotographToShow] = useState<any|undefined>(undefined)

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
        setProfileModalVisible={setProfileModalVisible}
      ></Header>

      <ShowPhotograph photograph={photographToShow} setPhotographToShow={setPhotographToShow} />

      <Routes>
        <Route
          path="/profile"
          element={
            <ProfilePage
              currentAccount={currentAccount}
              ethSigner={ethSigner}
              ethprovider={ethprovider}
              profileModalVisible={profileModalVisible}
              setProfileModalVisible={setProfileModalVisible}
              setPhotographToShow={setPhotographToShow}
            />
          }
        />
        <Route
          path="/"
          element={<HomePage ethprovider={ethprovider} current_account={currentAccount} setPhotographToShow={setPhotographToShow} />}
        />
      </Routes>
    </div>
  );
}

export default App;
