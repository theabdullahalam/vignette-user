import Photograph from "./Photograph";
import "../styles/Feed.scss"

interface PhotographProps {
  photographs: any;
}

export default function Feed({ photographs }: PhotographProps){
  return (
    <div className="Feed">
      {photographs.map((p: any, i: number) => <Photograph photograph={p} key={i} mKey={i} />)}
    </div>
  )
}