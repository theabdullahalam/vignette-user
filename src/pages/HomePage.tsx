import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import '../styles/HomePage.scss';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { vignette_abi, vignette_address } from '../helpers';
import Feed from '../components/Feed';

interface HomePageProps {
  // ethSigner: JsonRpcSigner | undefined;
  ethprovider: Web3Provider | undefined;
}

export default function HomePage({ ethprovider }: HomePageProps) {
  const [currentSection, setCurrentSection] = useState<string>('latest');
  const [enteredAddress, setEnteredAddress] = useState<string>('');
  const [photographs, setPhotographs] = useState<any>([]);

  const fetchAllPhotographs = async () => {
    await fetchPhotographsFromChain();
  };

  useEffect(() => {
    fetchAllPhotographs();
  }, [ethprovider]);

  useEffect(() => {
    if (currentSection === 'latest') {
      fetchAllPhotographs();
    } else if (currentSection === 'subscriptions') {
      const subs = getSubscriptions()
      console.log(subs);
      setPhotographs([]);
    } else if (currentSection === 'view-account') {
      if (ethers.utils.isAddress(enteredAddress)) {
        fetchPhotographsFromChain(enteredAddress);
      } else {
        setPhotographs([]);
      }
    }
  }, [currentSection]);

  const fetchPhotographsFromChain = async (account: string | undefined = undefined) => {
    if (ethprovider !== undefined) {
      const vignetteContract = new ethers.Contract(vignette_address, vignette_abi, ethprovider);

      if (account !== undefined) {
        let _photographs: any = await vignetteContract.getPhotographs(account);
        setPhotographs([..._photographs].reverse());
      } else {
        vignetteContract.getAllPhotographs().then((_photographs: any) => {
          setPhotographs([..._photographs].reverse());
        });
      }
    }
  };

  const subscribeToAccount = (account: string) => {
    let subscriptions: any = getSubscriptions();
    localStorage.setItem('subscriptions', JSON.stringify([...subscriptions, account]))
  };

  const getSubscriptions = () => {
    let _subscriptions: any = localStorage!.getItem('subscriptions') || '[]';
    return JSON.parse(_subscriptions)
  }

  return (
    <div className="HomePage">
      <div className="sectionStrip">
        <a
          className={currentSection === 'latest' ? 'selected' : ''}
          onClick={(e: any) => {
            setCurrentSection('latest');
          }}
        >
          Latest
        </a>
        <a
          className={currentSection === 'subscriptions' ? 'selected' : ''}
          onClick={(e: any) => {
            setCurrentSection('subscriptions');
          }}
        >
          Subscriptions
        </a>
        <a
          className={currentSection === 'view-account' ? 'selected' : ''}
          onClick={(e: any) => {
            setCurrentSection('view-account');
          }}
        >
          View Account
        </a>
      </div>

      {currentSection === 'view-account' ? (
        <div className="account-input-div">
          <label htmlFor="account-input">Account Address</label>
          <input
            type="text"
            name="account-input"
            placeholder="Account Address: 0x..."
            value={enteredAddress}
            onChange={(e: any) => {
              setEnteredAddress(e.target.value);
            }}
          />
          <div className="buttons">
            <button
              className={ethers.utils.isAddress(enteredAddress) ? '' : 'invalid'}
              disabled={!ethers.utils.isAddress(enteredAddress)}
              onClick={(e: any) => {
                if (ethers.utils.isAddress(enteredAddress)) {
                  fetchPhotographsFromChain(enteredAddress);
                }
              }}
            >
              Load
            </button>
            <button
              onClick={(e: any) => {
                subscribeToAccount(enteredAddress);
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}

      <Feed photographs={photographs} />
    </div>
  );
}
