import '../styles/Feed.scss';
import MasonryContainer from './Masonry';
import { getIpfsURL } from '../helpers';
import lozad from 'lozad';
import { useEffect } from 'react';

interface PhotographProps {
  photographs: any;
  setPhotographToShow: any;
}

export default function Feed({ photographs, setPhotographToShow }: PhotographProps) {

  return (
    <MasonryContainer
      className="Feed"
      columnCounts={{ 800: 1, 1000: 2, default: 3 }}
      columnGap="1rem"
    >
      {photographs.map((p: any, i: number) => (
        <img
          className="lozad photograph"
          src={getIpfsURL(p.image_cid)}
          key={i}
          onClick={() => {
            setPhotographToShow(p);
          }}
          alt=""
        />
      ))}
    </MasonryContainer>
  );
}
