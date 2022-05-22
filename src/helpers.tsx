import vignette_contract from './abis/Vignette.json';
import { create } from 'ipfs-http-client';

const {REACT_APP_VIGNETTE_ADDRESS} = process.env

// contract details
export const vignette_abi = vignette_contract.abi;
export const vignette_address = REACT_APP_VIGNETTE_ADDRESS ?? '';

// infura
// const ipfsclient = create({host: 'ipfs.infura.io', port: 5001, protocol: 'https', apiPath: '/api/v0'})
// const hostUrl = `https://ipfs.infura.io/ipfs/`

// localhost
export const ipfsclient = create({ host: 'localhost', port: 5001, protocol: 'http' });
export const hostUrl = `http://localhost:8080/ipfs/`;


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

// misc
export const EMPTY_PROFILE_PICTURE: string = getIpfsURL(`QmeK4BXjQUTNka1pRTmWjURDEGVXC7E8uEB8xUsD2DGz2c`)