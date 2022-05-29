import { useEffect, useState } from 'react';
import { getIpfsURL } from '../helpers';
import '../styles/Photograph.scss';


interface PhotographProps {
  photograph: any;
  mKey: any;
  masonry_item_style?: any;
}

export default function ({ photograph, mKey, masonry_item_style }: PhotographProps) {
  const [metadata, setMetadata] = useState<any>({});

  useEffect(() => {
    fetch(getIpfsURL(photograph.photograph_metadata_cid))
      .then((data: any) => data.json())
      .then((metadata: any) => {
        setMetadata(metadata);
      });
  }, []);

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
    <img
      data-use-lozad
      data-src={getIpfsURL(photograph.image_cid)}
      style={{ ...masonry_item_style }}
      className="lozad"
      id={mKey}
      key={mKey}
    ></img>
  );
}
