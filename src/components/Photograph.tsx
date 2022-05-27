import { useEffect, useState } from 'react';
import { getIpfsURL } from '../helpers';
import '../styles/Photograph.scss';
import lozad from 'lozad'

interface PhotographProps {
  photograph: any;
  mKey: any;
  masonry_item_style?: any;

}

export default function ({ photograph, mKey, masonry_item_style }: PhotographProps) {
  const [metadata, setMetadata] = useState<any>({});

  const observer = lozad(); // lazy loads elements with default selector as '.lozad'
  observer.observe();

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
    <img src={getIpfsURL(photograph.image_cid)} style={{...masonry_item_style}} className='lozad'></img>
  );
}
