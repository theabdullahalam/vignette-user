import { Link } from 'react-router-dom';
import { Web3Provider } from '@ethersproject/providers';
import '../styles/Header.scss';
import { EMPTY_PROFILE_PICTURE, getIpfsURL, getVignetteAddress, vignette_abi } from '../helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { ethers } from 'ethers';
import { MetadataInterface } from '../interfaces';
import { useEffect, useState } from 'react';
import { useMatch } from 'react-router-dom';

interface HeaderProps {
  connectToMetaMask: any;
  currentAccount: string;
  ethprovider: Web3Provider | undefined;
  setProfileModalVisible: any;
}

export default function Header({
  connectToMetaMask,
  currentAccount,
  ethprovider,
  setProfileModalVisible
}: HeaderProps) {
  const [metadata, setMetadata] = useState<MetadataInterface>({
    name: '',
    website: '',
    contact: '',
    location: '',
    profilepic: ''
  });

  let match = useMatch('/profile');

  useEffect(() => {
    const _fetch = async () => {
      fetchProfilePicture();
    };
    _fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  const fetchProfilePicture = async () => {
    if (ethprovider !== undefined) {
      const vignette_address = await getVignetteAddress();
      if (vignette_address !== undefined) {
        const vignetteContract = new ethers.Contract(vignette_address, vignette_abi, ethprovider);

        if (currentAccount !== undefined) {
          const _account_obj: any = await vignetteContract.getAccount(currentAccount);
          const _metadata_cid = _account_obj.account_metadata_cid;

          fetch(getIpfsURL(_metadata_cid))
            .then((data: any) => data.json())
            .then((metadata: any) => {
              setMetadata(metadata);
            });
        }
      }
    }
  };

  return (
    <div className="Header">
      {/* profile image */}
      <Link to="/" className="text-link title">
        Vignette
      </Link>
      {/* <Link to="/account" className='text-link account-button'>ACCOUNT</Link> */}

      <div className="account-div">
        {match?.pathname === '/profile' ? (
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="info-icon"
            onClick={(e: any) => {
              setProfileModalVisible(true);
            }}
          />
        ) : (
          <></>
        )}
        <button
          onClick={connectToMetaMask}
          disabled={currentAccount !== ''}
          className="metamask-button"
        >
          {ethprovider === undefined ? `Connect to Metamask` : currentAccount}
        </button>
      </div>
      <Link to="/profile">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img
          className="profile-pic"
          src={metadata.profilepic === '' ? EMPTY_PROFILE_PICTURE : getIpfsURL(metadata.profilepic)}
        ></img>
      </Link>
    </div>
  );
}
