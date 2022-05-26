import { useEffect, useState } from 'react';
import { getIpfsURL } from '../helpers';
import '../styles/Photograph.scss';

interface PhotographProps {
  photograph: any;
  mKey: any;
}

export default function ({ photograph, mKey }: PhotographProps) {
  const [metadata, setMetadata] = useState<any>({});

  useEffect(() => {
    fetch(getIpfsURL(photograph.photograph_metadata_cid))
      .then((data: any) => data.json())
      .then((metadata: any) => {
        setMetadata(metadata);
      })
  }, []);

  const getKeyTitle = (key: string) => {
    return {
      title: 'Title',
      description: 'Description',
      location: 'Location',
      tags: 'Tags',
      photographer: 'Photographer',
      account: 'Account',
    }[key]
  }

  return (
    <div className="Photograph">
      <img src={getIpfsURL(photograph.image_cid)}></img>
      <div className="info-section">
        <h3>Info:</h3>

        {Object.keys(metadata)
          .filter((key: string) => metadata[key] !== '')
          .map((key: string) => {
            return (
              <p>
                <b>{getKeyTitle(key)}:</b> {metadata[key]}
              </p>
            );
          })}
        <div className="buttons">
          <a className="link-button" href={getIpfsURL(photograph.image_cid)}>
            Image File
          </a>
          <a className="link-button" href={getIpfsURL(photograph.photograph_metadata_cid)}>
            Metadata
          </a>
        </div>
      </div>
    </div>
  );
}
