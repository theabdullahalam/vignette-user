import Photograph from "./Photograph";
import "../styles/Feed.scss"
import MasonryContainer from "./Masonry";
import { getIpfsURL } from "../helpers";

interface PhotographProps {
  photographs: any;
}

export default function Feed({ photographs }: PhotographProps){
  return (
    <MasonryContainer className='Feed' columnCounts={{800: 1, 1000: 2, default: 3}} columnGap="1rem">
      {photographs.map((p: any, i: number) => <img src={getIpfsURL(p.image_cid)} key={i} />)}
    </MasonryContainer>
  )
}