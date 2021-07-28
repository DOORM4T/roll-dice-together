import produce from "immer"
import {
  IPeerAction,
  IPeerConnection,
  IPeerData,
  IPeerState,
  PeerActions,
} from "../types"
import { isMyPeerValid } from "../utils"

export interface IChangeNameAction extends IPeerAction {
  type: PeerActions.CHANGE_NAME
  name: string
}
function _changeName(senderId: string, name: string): IChangeNameAction {
  return { type: PeerActions.CHANGE_NAME, senderId, name }
}

export function handlePeerNameChange(action: IPeerAction, state: IPeerState) {
  const { senderId, name } = action as IChangeNameAction
  state.setPeers((latest) => _updatePeers(senderId, name, latest))
}

export const useHandleNameChange = (props: IPeerState) => {
  const { setMyPeer, myPeer, peers } = props

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isMyPeerValid(myPeer)) return
    const value = e.currentTarget.value
    setMyPeer((latest) => ({ ...latest!, name: value }))
    const changeNameAction = JSON.stringify(
      _changeName(myPeer!.peerObj.id, value),
    )
    peers.forEach((p) => p.connection.send(changeNameAction))
  }
  return { handleNameChange }
}

function _updatePeers(
  senderId: string,
  name: string,
  peers: (IPeerConnection & IPeerData)[],
) {
  const nextState = produce(peers, (draft) => {
    const isSender = (peer: IPeerConnection) =>
      peer.connection.peer === senderId
    const peerIndex = draft.findIndex(isSender)
    if (peerIndex === -1) return
    draft[peerIndex].name = name
  })
  return nextState
}
