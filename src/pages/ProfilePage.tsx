import { useEffect, useState } from 'react';
import { getBlockExplorerUrl, uploadFile, vignette_abi, vignette_address } from '../helpers';
import { ethers } from 'ethers';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import Feed from '../components/Feed';
import '../styles/ProfilePage.scss';
import { v4 as uuidv4 } from 'uuid';
import UpdateProfile from '../components/UpdateProfile';
import '../styles/modal.scss';

interface ProfilePageProps {
  currentAccount: string;
  ethSigner: JsonRpcSigner | undefined;
  ethprovider: Web3Provider | undefined;
  profileModalVisible: any;
  setProfileModalVisible: any;
  setPhotographToShow: any;
}

export default function ProfilePage({
  currentAccount,
  ethSigner,
  ethprovider,
  profileModalVisible,
  setProfileModalVisible,
  setPhotographToShow
}: ProfilePageProps) {
  // state vars
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | undefined>();
  const [photographs, setPhotographs] = useState<any>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isWaitingForBlockConcfirmation, setIsWaitingForBlockConfirmation] =
    useState<boolean>(false);
  const [uploadTxn, setUploadTxn] = useState<string>('');

  // metadata vars
  const [photograph_title, setPhotograph_title] = useState<string>('');
  const [photograph_description, setPhotograph_description] = useState<string>('');
  const [photograph_location, setPhotograph_location] = useState<string>('');
  const [photograph_tags, setPhotograph_tags] = useState<string>('');
  const [photographer_name, setPhotographer_name] = useState<string>('');

  useEffect(() => {
    const _init = async () => {
      if (currentAccount !== '') {
        await fetchPhotographsFromChain(currentAccount);
      }
    };
    _init();
  }, [currentAccount]);

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

  const uploadPhotographToChain = async (photograph: any) => {
    if (ethSigner !== undefined) {
      const vignetteContract = new ethers.Contract(vignette_address, vignette_abi, ethSigner);
      vignetteContract.publishPhotograph(photograph).then((e: any) => {
        setIsUploading(false);
        setIsWaitingForBlockConfirmation(true);
        setUploadTxn(e.hash);
        let my_interval = setInterval(() => {
          ethprovider?.getTransaction(e.hash).then((t: any) => {
            if (t.blockNumber !== null) {
              fetchPhotographsFromChain(currentAccount);
              clearInterval(my_interval);
              setIsWaitingForBlockConfirmation(false);
            }
          });
        }, 1000);
      });
    }
  };

  const uploadPhotographClicked = async (e: any) => {
    setIsUploading(true);
    if (uploadedFile !== undefined) {
      const img_url = await uploadFile(uploadedFile);

      // in place
      if (img_url !== undefined) {
        setUploadedFiles([img_url, ...uploadedFiles]);
      }

      // createmetadata
      const metadata = {
        title: photograph_title,
        description: photograph_description,
        location: photograph_location,
        tags: photograph_tags,
        photographer: photographer_name,
        account: currentAccount
      };

      const metadata_url = await uploadMetadata(metadata);
      const copyright = 'CC';

      const photograph = [img_url, metadata_url, copyright];

      uploadPhotographToChain(photograph);
    }
  };

  const fetchPhotographsFromChain = async (account: string) => {
    if (ethprovider !== undefined) {
      const vignetteContract = new ethers.Contract(vignette_address, vignette_abi, ethprovider);
      let _photographs: any = await vignetteContract.getPhotographs(account);
      setPhotographs([..._photographs].reverse());
    }
  };

  return (
    <div className="ProfilePage">
      {currentAccount !== '' ? (
        <div className="account-actions">
          {profileModalVisible ? (
            <UpdateProfile
              profileModalVisible={profileModalVisible}
              setProfileModalVisible={setProfileModalVisible}
              ethSigner={ethSigner}
              ethprovider={ethprovider}
              currentAccount={currentAccount}
            />
          ) : (
            <></>
          )}
          <div className="photograph-upload">
            <p className="title">Upload a Photograph</p>

            {isUploading && <p>Uploading File...</p>}

            {isWaitingForBlockConcfirmation && (
              <p>
                Waiting for Transaction Confirmation... <br />
                Transaction: {getBlockExplorerUrl(uploadTxn)}
              </p>
            )}

            {!isUploading && !isWaitingForBlockConcfirmation && (
              <input type="file" onChange={handleFileInputChange} />
            )}

            {uploadedFile !== undefined && !isUploading && !isWaitingForBlockConcfirmation ? (
              <>
                <div className="metadata-form">
                  <label htmlFor="photograph-title">Title</label>
                  <input
                    type="text"
                    name="photograph-title"
                    placeholder="Title"
                    value={photograph_title}
                    onChange={(e: any) => {
                      setPhotograph_title(e.target.value);
                    }}
                  />

                  <label htmlFor="photograph-description">Description</label>
                  <textarea
                    name="photograph-description"
                    placeholder="Description"
                    value={photograph_description}
                    onChange={(e: any) => {
                      setPhotograph_description(e.target.value);
                    }}
                  />

                  <label htmlFor="photograph-location">Location</label>
                  <input
                    type="text"
                    name="photograph-location"
                    placeholder="Location"
                    value={photograph_location}
                    onChange={(e: any) => {
                      setPhotograph_location(e.target.value);
                    }}
                  />

                  <label htmlFor="photograph-tags">Tags</label>
                  <input
                    type="text"
                    name="photograph-tags"
                    placeholder="Comma Seperated"
                    value={photograph_tags}
                    onChange={(e: any) => {
                      setPhotograph_tags(e.target.value);
                    }}
                  />

                  <label htmlFor="photographer-name">Photographer Name</label>
                  <input
                    type="text"
                    name="photographer-name"
                    placeholder="Name"
                    value={photographer_name}
                    onChange={(e: any) => {
                      setPhotographer_name(e.target.value);
                    }}
                  />
                </div>

                <button
                  onClick={uploadPhotographClicked}
                  className="upload-button"
                  disabled={currentAccount === ''}
                >
                  Upload
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
      <Feed photographs={photographs} setPhotographToShow={setPhotographToShow} />
    </div>
  );
}
