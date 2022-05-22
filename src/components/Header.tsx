import { Link } from 'react-router-dom';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import "../styles/Header.scss"
import { EMPTY_PROFILE_PICTURE } from '../helpers';

interface HeaderProps {
  connectToMetaMask: any;
  currentAccount: string;
  ethprovider: Web3Provider|undefined;
}

export default function Header({ connectToMetaMask, currentAccount, ethprovider }: HeaderProps) {
  return (
    <div className='Header'>
      {/* profile image */}
      <Link to="/" className='text-link title'>Vignette</Link>
      {/* <Link to="/account" className='text-link account-button'>ACCOUNT</Link> */}

      <button onClick={connectToMetaMask} disabled={currentAccount !== ''} className="metamask-button">
        {ethprovider === undefined ? `Connect to Metamask` : currentAccount}
      </button>
      <Link to="/profile">
        <img className='profile-pic' src={ EMPTY_PROFILE_PICTURE }></img>
      </Link>

    </div>
  );
}
