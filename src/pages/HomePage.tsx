import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import '../styles/HomePage.scss';
import { Web3Provider } from '@ethersproject/providers';
import { vignette_abi, getVignetteAddress } from '../helpers';
import Feed from '../components/Feed';
import ProfileSection from '../components/ProfileSection';

interface HomePageProps {
  ethprovider: Web3Provider | undefined;
  current_account: string;
  setPhotographToShow: any;
}

export default function HomePage({
  ethprovider,
  current_account,
  setPhotographToShow
}: HomePageProps) {
  const [currentSection, setCurrentSection] = useState<string>('latest');
  const [enteredAddress, setEnteredAddress] = useState<string>('');
  const [photographs, setPhotographs] = useState<any>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [emptyPrompt, setEmptyPrompt] = useState<string>('');

  const fetchAllPhotographs = async () => {
    await fetchPhotographsFromChain();
  };

  useEffect(() => {
    loadSectionPhotos();
    setEmptyPromptState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAllPhotographs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethprovider]);

  useEffect(() => {
    loadSectionPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection]);

  useEffect(() => {
    setIsSubscribed(getIsSubscribed(enteredAddress));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enteredAddress]);

  useEffect(() => {
    setEmptyPromptState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current_account, photographs]);

  const loadSectionPhotos = () => {
    setPhotographs([]);
    if (currentSection === 'latest') {
      fetchAllPhotographs();
    } else if (currentSection === 'subscriptions') {
      setPhotographs([]);
      fetchSubscriptionPhotographs();
    } else if (currentSection === 'view-account') {
      if (ethers.utils.isAddress(enteredAddress)) {
        fetchPhotographsFromChain(enteredAddress);
      } else {
        setPhotographs([]);
      }
    }
  };

  const fetchPhotographsFromChain = async (account: string | undefined = undefined) => {
    if (ethprovider !== undefined) {
      const vignette_address = await getVignetteAddress();
      if (vignette_address !== undefined) {
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
    }
  };

  const subscribeToAccount = (account: string) => {
    let subscriptions: any = getSubscriptions();
    if (!getIsSubscribed(account)) {
      setSubscriptions([...subscriptions, account]);
      setIsSubscribed(true);
    }
  };

  const unsubscribeFromAccount = (account: string) => {
    let subscriptions: any = getSubscriptions();
    let new_subscriptions = subscriptions.filter((s: string) => s !== account);
    setSubscriptions(new_subscriptions);
    setIsSubscribed(false);
  };

  const getSubscriptions = () => {
    const _subscriptions: any = JSON.parse(localStorage!.getItem('subscriptions') || '{}');
    const _current_subs: any = _subscriptions[current_account];
    return _current_subs === undefined ? [] : _current_subs;
  };

  const setSubscriptions = (subs: string[]) => {
    const _subscriptions: any = JSON.parse(localStorage!.getItem('subscriptions') || '{}');
    _subscriptions[current_account] = subs;
    localStorage.setItem('subscriptions', JSON.stringify(_subscriptions));
  };

  const getIsSubscribed = (account: string) => {
    return getSubscriptions().includes(account);
  };

  const getEmptyPrompt = async () => {
    if (!window.ethereum) {
      return 'You need to install Metamask to continue...';
    }
    if (current_account === '') {
      return 'Connect to Metamask to view photographs...';
    }
    const chainId: string = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0x3' && chainId !== '0x4') {
      return 'Are you sure you are connected to Rinkeby or Ropsten?';
    }
    if (photographs.length === 0) {
      return 'There are no photographs to display. Go to profile to upload one :)';
    }
  };

  const setEmptyPromptState = async () => {
    const prompt = await getEmptyPrompt();
    setEmptyPrompt(prompt || '');
  };

  const fetchSubscriptionPhotographs = async () => {
    if (ethprovider !== undefined) {
      const vignette_address = await getVignetteAddress();
      if (vignette_address !== undefined) {
        const vignetteContract = new ethers.Contract(vignette_address, vignette_abi, ethprovider);
        const _subs = getSubscriptions();

        let new_photographs: any = [];

        _subs.forEach(async (acc: string) => {
          vignetteContract
            .getPhotographs(acc)
            .then((res: any) => {
              res.forEach((_pic: any) => {
                new_photographs = [...new_photographs, _pic];
              });
            })
            .finally((s: any) => {
              setPhotographs(new_photographs);
            });
        });
      }
    }
  };

  return (
    <div className="HomePage">
      <div className="sectionStrip">
        <a
          className={currentSection === 'latest' ? 'selected' : ''}
          onClick={(e: any) => {
            e.preventDefault();
            setCurrentSection('latest');
          }}
          href="/#"
        >
          Latest
        </a>
        <a
          className={currentSection === 'subscriptions' ? 'selected' : ''}
          onClick={(e: any) => {
            e.preventDefault();
            setCurrentSection('subscriptions');
          }}
          href="/#"
        >
          Subscriptions
        </a>
        <a
          className={currentSection === 'view-account' ? 'selected' : ''}
          onClick={(e: any) => {
            e.preventDefault();
            setCurrentSection('view-account');
          }}
          href="/#"
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
                if (isSubscribed) {
                  unsubscribeFromAccount(enteredAddress);
                } else {
                  subscribeToAccount(enteredAddress);
                }
              }}
            >
              {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
          </div>

          {photographs.length > 0 && enteredAddress !== '' ? (
            <ProfileSection account={enteredAddress} ethprovider={ethprovider} />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}

      <Feed photographs={photographs} setPhotographToShow={setPhotographToShow} />
      {photographs.length === 0 ? <p className="empty-prompt">{emptyPrompt}</p> : <></>}
    </div>
  );
}
