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
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const fetchAllPhotographs = async () => {
    await fetchPhotographsFromChain();
  };

  useEffect(() => {
    loadSectionPhotos()
  }, [])

  useEffect(() => {
    fetchAllPhotographs();
  }, [ethprovider]);

  useEffect(() => {
    loadSectionPhotos()
  }, [currentSection]);

  useEffect(() => {
    setIsSubscribed(getIsSubscribed(enteredAddress))
  }, [enteredAddress])

  const loadSectionPhotos = () => {
    if (currentSection === 'latest') {
      fetchAllPhotographs();
    } else if (currentSection === 'subscriptions') {
      fetchSubscriptionPhotographs()
    } else if (currentSection === 'view-account') {
      if (ethers.utils.isAddress(enteredAddress)) {
        fetchPhotographsFromChain(enteredAddress);
      } else {
        setPhotographs([]);
      }
    }
  }

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
    if (!getIsSubscribed(account)){
      setSubscriptions([...subscriptions, account])
      setIsSubscribed(true)
    }
  };

  const unsubscribeFromAccount = (account: string) => {
    let subscriptions: any = getSubscriptions();
    let new_subscriptions = subscriptions.filter((s: string) => s!==account);
    setSubscriptions(new_subscriptions);
    setIsSubscribed(false);
  }

  const getSubscriptions = () => {
    let _subscriptions: any = localStorage!.getItem('subscriptions') || '[]';
    return JSON.parse(_subscriptions);
  };

  const setSubscriptions = (subs: string[]) => {
    localStorage.setItem('subscriptions', JSON.stringify(subs));
  }

  const getIsSubscribed = (account: string) => {
    return getSubscriptions().includes(account);
  }

  const fetchSubscriptionPhotographs = async () => {
    if (ethprovider !== undefined) {

      const vignetteContract = new ethers.Contract(vignette_address, vignette_abi, ethprovider);
      const _subs = getSubscriptions();
      
      
      const _photographs: any = [];

      _subs.forEach(async (acc: string) => {        
        const _ps: any = await vignetteContract.getPhotographs(acc);
        if (_ps.length > 0){
          _ps.forEach((p: any) => {
            _photographs.push(p)
          });
        }
        console.log('ssss', _photographs);
      });
      setPhotographs(_photographs);
    }
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
              className={ethers.utils.isAddress(enteredAddress) ? '' : 'invalid'}
              disabled={!ethers.utils.isAddress(enteredAddress)}
              onClick={(e: any) => {
                if (isSubscribed){
                  unsubscribeFromAccount(enteredAddress);
                }else{
                  subscribeToAccount(enteredAddress);
                }
              }}
            >
              { isSubscribed ? 'Unsubscribe' : 'Subscribe' }
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
