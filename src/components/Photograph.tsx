import { getIpfsURL } from "../helpers";
import '../styles/Photograph.scss'

interface PhotographProps {
  photograph: any;
}

export default function ({ photograph }: PhotographProps) {
  return (
    <div className="Photograph">
      <img src={getIpfsURL(photograph.image_cid)}></img>
      <div className="info-section">
        <h3>Info:</h3>
        <p>
          <b>Photographer:</b> Abdullah Alam
        </p>
        <p>
          <b>Location:</b> Himachal
        </p>
        <p>
          <b>Tags:</b> landscape, nature, outdoor
        </p>
        <div className="buttons">
          <a className="link-button" href={getIpfsURL(photograph.image_cid)}>Image File</a>
          <a className="link-button" href={getIpfsURL(photograph.photograph_metadata_cid)}>Metadata</a>
        </div>
      </div>
    </div>
  );
}
