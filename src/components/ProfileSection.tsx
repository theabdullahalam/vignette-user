import { EMPTY_PROFILE_PICTURE, getIpfsURL } from "../helpers";
import "../styles/ProfileSection.scss"

interface ProfileSectionProps {

}

export default function ProfileSection () {
  return (
    <div className="ProfileSection">
      <img src={EMPTY_PROFILE_PICTURE} className="profile-pic" />
      <div className="metadata">
        <ul>
          <li>
            <b>Name: </b> Abdullah
          </li>
          <li>
            <b>Website: </b> Abdullah
          </li>
          <li>
            <b>Location: </b> Abdullah
          </li>
        </ul>
      </div>
    </div>
  )
}