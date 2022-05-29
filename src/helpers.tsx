import vignette_contract from './abis/Vignette.json';
import { create } from 'ipfs-http-client';

const {
  REACT_APP_VIGNETTE_ADDRESS,
  REACT_APP_GANACHE_CONTRACT,
  REACT_APP_RINKEBY_CONTRACT,
  REACT_APP_ROPSTEN_CONTRACT
} = process.env

// contract details
export const vignette_abi = vignette_contract.abi;
// export const vignette_address = REACT_APP_VIGNETTE_ADDRESS ?? '';

// infura
const ipfsclient = create({host: 'ipfs.infura.io', port: 5001, protocol: 'https', apiPath: '/api/v0'})
const hostUrl = `https://ipfs.infura.io/ipfs/`

// localhost
// export const ipfsclient = create({ host: 'localhost', port: 5001, protocol: 'http' });
// export const hostUrl = `http://localhost:8080/ipfs/`;


export const getVignetteAddress = async () => {
  
  const chainId: string = await window.ethereum.request({ method: 'eth_chainId' })  
  return {
    '0x3': REACT_APP_ROPSTEN_CONTRACT ?? '',
    '0x4': REACT_APP_RINKEBY_CONTRACT ?? '',
    '0x539': REACT_APP_GANACHE_CONTRACT ?? ''
  }[chainId]
}

export const getIpfsURL = (cid: string) => {
  return `${hostUrl}${cid}`;
};

export const uploadFile = async (f: File) => {
  try {
    const added = await ipfsclient.add(f);
    return added.path;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const EXPLORER_ROPSTEN = 'ropsten'

export const getBlockExplorerUrl = (txnHash: string, explorer: string | undefined = undefined) => {
  if (explorer === EXPLORER_ROPSTEN){
    return `https://ropsten.etherscan.io/tx/${txnHash}`
  }
  return txnHash;
}


// misc
export const EMPTY_PROFILE_PICTURE: string = getIpfsURL(`QmeK4BXjQUTNka1pRTmWjURDEGVXC7E8uEB8xUsD2DGz2c`)