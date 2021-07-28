import { produce } from "immer"
import {
  IPeerAction,
  IPeerConnection,
  IPeerData,
  IPeerState,
  PeerActions,
} from "../types"
import { isMyPeerValid } from "../utils"

export interface IRollDiceAction extends IPeerAction {
  type: PeerActions.ROLL
  roll: number
}
function _rollDice(senderId: string, roll: number): IRollDiceAction {
  return { type: PeerActions.ROLL, senderId, roll }
}

export function handlePeerDiceRoll(action: IPeerAction, state: IPeerState) {
  const { senderId, roll } = action as IRollDiceAction
  state.setPeers((latest) => _updatePeers(senderId, roll, latest))
}

export const useHandleDiceRoll = (props: IPeerState) => {
  const { setMyPeer, myPeer, peers } = props

  const handleDiceRoll = () => {
    if (!isMyPeerValid(myPeer)) return

    const roll = Math.floor(Math.random() * (20 - 1)) + 1
    setMyPeer((latest) => ({ ...latest!, latestRoll: roll }))
    const rollDiceAction = JSON.stringify(_rollDice(myPeer!.peerObj.id, roll))
    peers.forEach((p) => p.connection.send(rollDiceAction))
  }

  return { handleDiceRoll }
}

function _updatePeers(
  senderId: string,
  roll: number,
  peers: (IPeerConnection & IPeerData)[],
) {
  const nextState = produce(peers, (draft) => {
    const isSender = (peer: IPeerConnection) =>
      peer.connection.peer === senderId
    const peerIndex = draft.findIndex(isSender)
    if (peerIndex === -1) return
    draft[peerIndex].latestRoll = roll
  })
  return nextState
}
