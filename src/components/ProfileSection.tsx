import { useEffect, useState } from 'react';
import { EMPTY_PROFILE_PICTURE, getIpfsURL, getVignetteAddress, vignette_abi } from '../helpers';
import { MetadataInterface } from '../interfaces';
import '../styles/ProfileSection.scss';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';

interface ProfileSectionProps {
  account: string;
  ethprovider: Web3Provider | undefined;
}

export default function ProfileSection({ account, ethprovider }: ProfileSectionProps) {
  const [metadata, setMetadata] = useState<any>({
    name: '',
    website: '',
    contact: '',
    location: '',
    profilepic: ''
  });

  const getKeyTitle = (key: string) => {
    return {
      name: 'Name',
      website: 'Website',
      contact: 'Contact',
      location: 'Location',
    }[key];
  };

  useEffect(() => {
    const _init_ = async () => {
      if (ethprovider !== undefined) {
        const vignette_address = await getVignetteAddress();
        if (vignette_address !== undefined) {
          const vignetteContract = new ethers.Contract(vignette_address, vignette_abi, ethprovider);
  
          if (account !== undefined) {
            const _account_obj: any = await vignetteContract.getAccount(account);
            const _metadata_cid = _account_obj.account_metadata_cid;
            fetch(getIpfsURL(_metadata_cid))
              .then((data: any) => data.json())
              .then((metadata: any) => {
                setMetadata(metadata);
              });
          }
        }
      }
    }
    _init_()
  }, [])

  return (
    <div className="ProfileSection">
      <img src={ metadata.profilepic !== '' || metadata.profilepic !== undefined ? getIpfsURL(metadata.profilepic) : EMPTY_PROFILE_PICTURE} className="profile-pic" />
      <div className="metadata">
        <ul>
        {Object.keys(metadata)
          .filter((key: any) => metadata[key] !== '' && key !== 'profilepic')
          .map((key: any) => (
            <li>
              <b>{getKeyTitle(key)}: </b>{metadata[key]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
