import { IPeerAction, PeerActions } from "../types"

export interface ISharePeersAction extends IPeerAction {
  type: PeerActions.SHARE_PEERS
  peers: string[]
}
export function sharePeers(
  senderId: string,
  peers: string[],
): ISharePeersAction {
  return { type: PeerActions.SHARE_PEERS, senderId, peers }
}
