import axios from 'axios';

export function getData () {
  let request = axios('/data');
  return {
    type:"DATA",
    payload:request
  };
}
