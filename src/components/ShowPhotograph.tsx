import { useEffect, useState } from 'react';
import { getIpfsURL } from '../helpers';
import '../styles/ShowPhotograph.scss';

interface ShowPhotographProps {
  photograph: any;
  setPhotographToShow: any;
}

export default function ShowPhotograph({ photograph, setPhotographToShow }: ShowPhotographProps) {
  const [metadata, setMetadata] = useState<any>({});

  const handleKeyPress = (event: any) => {
    if(event.key === 'Escape'){
      hidePhotograph()
    }
  }

  useEffect(() => {
    if (photograph !== undefined) {
      fetch(getIpfsURL(photograph.photograph_metadata_cid))
        .then((data: any) => data.json())
        .then((metadata: any) => {
          setMetadata(metadata);
        });
    }
  }, [photograph]);

  const hidePhotograph = () => {    
      setMetadata({});
      setPhotographToShow(undefined);
  };

  const hidePhotoGraphClicked = (e: any) => {
    if (e.target.classList.contains('is-closer')) {
      hidePhotograph()
    }
  }

  const getKeyTitle = (key: string) => {
    return {
      title: 'Title',
      description: 'Description',
      location: 'Location',
      tags: 'Tags',
      photographer: 'Photographer',
      account: 'Account'
    }[key];
  };

  return (
    <div
      className="ShowPhotograph is-closer"
      style={{
        display: photograph === undefined ? 'none' : 'grid'
      }}
      onClick={hidePhotoGraphClicked}
      onKeyDown={handleKeyPress}
    >
      <div className="photo-card">
        <img
          src={photograph !== undefined ? getIpfsURL(photograph.image_cid) : ''}
          className="image"
        />
        <span className="cross is-closer" onClick={hidePhotoGraphClicked}>
          x
        </span>
        <div className="metadata">
          <p>
            <ul>
              {Object.keys(metadata)
                .filter((key: any) => metadata[key] !== '')
                .map((key: any) => (
                  <li>
                    <b>{getKeyTitle(key)}: </b>{metadata[key]}
                  </li>
                ))}
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
}
