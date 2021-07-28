import produce from "immer"
import {
  IPeerAction,
  IPeerConnection,
  IPeerData,
  IPeerState,
  PeerActions,
} from "../types"

export interface IShareMyPeerDataAction extends IPeerAction {
  type: PeerActions
  data: IPeerData
}

export function shareMyPeerData(
  senderId: string,
  data: IPeerData,
): IShareMyPeerDataAction {
  return { type: PeerActions.SHARE_MY_PEER_DATA, senderId, data }
}

export function handleShareMyPeerData(
  action: IPeerAction,
  state: IPeerState,
  onConnectionOpen?: () => void,
) {
  const { setPeers } = state

  const { senderId, data } = action as IShareMyPeerDataAction
  const latestState: IPeerState = { ...state }
  const latestPeerIndex = latestState.peers.findIndex(
    (p) => p.connection.peer === senderId,
  )
  if (latestPeerIndex !== -1) {
    // This makes a newly added peer's state available to the client's onConnectionOpen handler
    // In summary:
    //  1. the handleConnectionOpen() function from usePeerConnections sends a "share my peer data" action. The connection is already open by this time.
    //  2. Clients receiving the "share my peer data" action can use the shared peer data in a custom onConnectionOpen() handler
    latestState.peers[latestPeerIndex].name = data.name
    onConnectionOpen && onConnectionOpen()
  }

  setPeers((latest) => _updatePeers(latest, senderId, data))
  return
}

function _updatePeers(
  latest: (IPeerConnection & IPeerData)[],
  senderId: string,
  data: IPeerData,
) {
  return produce(latest, (draft) => {
    const peerIndex = draft.findIndex((p) => p.connection.peer === senderId)
    if (peerIndex === -1) return
    draft[peerIndex] = { ...draft[peerIndex], ...data }
  })
}
