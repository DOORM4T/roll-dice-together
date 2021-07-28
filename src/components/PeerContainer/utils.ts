import { IMyPeer, IPeerData } from "./types"

export function isMyPeerValid(myPeer: (IMyPeer & IPeerData) | null) {
  return myPeer && myPeer.peerObj && myPeer.peerObj.id
}
