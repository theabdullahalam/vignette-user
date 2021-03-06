import '../styles/UpdateProfile.scss';
import '../styles/modal.scss';
import { useEffect, useState } from 'react';
import {
  EMPTY_PROFILE_PICTURE,
  getIpfsURL,
  uploadFile,
  vignette_abi,
  getVignetteAddress
} from '../helpers';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { MetadataInterface } from '../interfaces';
import loadergif from '../img/loader.gif';

interface UpdateProfileProps {
  profileModalVisible: any;
  setProfileModalVisible: any;
  ethSigner: JsonRpcSigner | undefined;
  ethprovider: Web3Provider | undefined;
  currentAccount: string;
}

export default function UpdateProfile({
  profileModalVisible,
  setProfileModalVisible,
  ethSigner,
  ethprovider,
  currentAccount
}: UpdateProfileProps) {
  const [uploadedFile, setUploadedFile] = useState<File | undefined>();
  const [accountName, setAccountName] = useState<string>('');
  const [accountWebsite, setAccountWebsite] = useState<string>('');
  const [accountContact, setAccountContact] = useState<string>('');
  const [accountLocation, setAccountLocation] = useState<string>('');
  const [accountPicCid, setAccountPicCid] = useState<string>('');
  const [hasUpdated, setHasUpdated] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [txnHash, setTxnHash] = useState<string>('');
  const [metadata, setMetadata] = useState<MetadataInterface>({
    name: accountName,
    website: accountWebsite,
    contact: accountContact,
    location: accountLocation,
    profilepic: accountPicCid
  });

  useEffect(() => {
    setAccountName(metadata.name === undefined ? '' : metadata.name);
    setAccountWebsite(metadata.website === undefined ? '' : metadata.website);
    setAccountContact(metadata.contact === undefined ? '' : metadata.contact);
    setAccountLocation(metadata.location === undefined ? '' : metadata.location);
    setAccountPicCid(metadata.profilepic === undefined ? '' : metadata.profilepic);
  }, [metadata]);

  useEffect(() => {
    getMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = (e: any) => {
    if (e.target.classList.contains('is-modal-container')) {
      setProfileModalVisible(false);
    }
  };

  const getMetadata = async () => {
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

  const handleFileInputChange = async (e: any) => {
    const file = e.target.files![0];
    setUploadedFile(file);
  };

  const uploadMetadata = async (metadata: object) => {
    const metaDataBlob: Blob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: 'application/json'
    });

    const metaDataFile: File = new File([metaDataBlob], 'metadata.json');
    const meta_url = await uploadFile(metaDataFile);

    return meta_url;
  };

  const updateAccount = async (e: any) => {
    e.preventDefault();
    setIsUploading(true);
    let profile_pic_cid: string | undefined = metadata.profilepic;

    // upload profile pic
    if (uploadedFile !== undefined) {
      profile_pic_cid = await uploadFile(uploadedFile);
      setAccountPicCid(profile_pic_cid === undefined ? '' : profile_pic_cid);
    }

    const _metadata = {
      name: accountName,
      website: accountWebsite,
      contact: accountContact,
      location: accountLocation,
      profilepic: profile_pic_cid
    };

    const metadata_url = await uploadMetadata(_metadata);

    if (ethSigner !== undefined) {
      const vignette_address = await getVignetteAddress();
      if (vignette_address !== undefined) {
        const vignetteContract = new ethers.Contract(vignette_address, vignette_abi, ethSigner);
        vignetteContract.updateAccount(metadata_url).then((e: any) => {
          setTxnHash(e.hash);
          setHasUpdated(true);
          setIsUploading(false);
        });
      }
    }
  };

  return (
    <div className="is-modal-container" onClick={closeModal}>
      <div className="UpdateProfile is-modal">
        <span
          className="close-button"
          onClick={() => {
            setProfileModalVisible(false);
          }}
        >
          X
        </span>
        <div className="note">
          <p>
            <b>Note:</b> The data you enter here will go on-chain, forever. To maintain pseuodonymity, <b>you might want to use a new account just for this dApp.</b>
          </p>
        </div>
        {hasUpdated ? (
          <div className="success-note">
            <p>Metadata updated succesfully! Transaction: {txnHash}</p>
          </div>
        ) : (
          <></>
        )}

        <form className="profile-form">
          <label className="profile-pic-label">Update Profile Picture</label>
          <div className="profile-pic-div">
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img
              className="profile-pic"
              src={accountPicCid === '' ? EMPTY_PROFILE_PICTURE : getIpfsURL(accountPicCid)}
            ></img>
            <input
              type="file"
              name="profile-pic-file-input"
              onChange={handleFileInputChange}
              disabled={isUploading}
            />
          </div>

          <label htmlFor="name-input">Photographer Name</label>
          <input
            type="text"
            name="name-input"
            placeholder="Name"
            value={accountName}
            onChange={(e) => {
              setAccountName(e.target.value);
            }}
            disabled={isUploading}
          />

          <label htmlFor="name-input">Website</label>
          <input
            type="text"
            name="name-input"
            placeholder="yourpersonalsite.com"
            value={accountWebsite}
            onChange={(e) => {
              setAccountWebsite(e.target.value);
            }}
            disabled={isUploading}
          />

          <label htmlFor="name-input">Contact</label>
          <input
            type="text"
            name="name-input"
            placeholder="E-mail/Phone/Etc"
            value={accountContact}
            onChange={(e) => {
              setAccountContact(e.target.value);
            }}
            disabled={isUploading}
          />

          <label htmlFor="name-input">Location</label>
          <input
            type="text"
            name="name-input"
            placeholder="USA/Mumbai/France..."
            value={accountLocation}
            onChange={(e) => {
              setAccountLocation(e.target.value);
            }}
            disabled={isUploading}
          />
          <div className="submit-row">
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            {isUploading ? <img src={loadergif} className="loading-gif" /> : <></>}
            <button onClick={updateAccount} disabled={isUploading}>
              Update On-Chain
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
