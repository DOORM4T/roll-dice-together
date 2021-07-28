import React from "react"
import AppWrapper from "."
import {
  handlePeerNameChange,
  useHandleNameChange,
} from "../PeerContainer/actions/changeName"
import {
  handlePeerDiceRoll,
  useHandleDiceRoll,
} from "../PeerContainer/actions/rollDice"
import {
  CustomPeerActionHandler,
  IPeerState,
  PeerActions,
} from "../PeerContainer/types"
import { isMyPeerValid } from "../PeerContainer/utils"

const usePeerDiceRoller = () => {
  const render = (props: IPeerState) => {
    const { myPeer, peers } = props
    const { handleNameChange } = useHandleNameChange(props)
    const { handleDiceRoll } = useHandleDiceRoll(props)
    if (!isMyPeerValid(myPeer)) return null

    return (
      <AppWrapper
        handleNameChange={handleNameChange}
        handleDiceRoll={handleDiceRoll}
        myPeer={myPeer!}
        peers={peers}
      />
    )
  }

  const onPeerAction: CustomPeerActionHandler = (action, state) => {
    switch (action.type) {
      case PeerActions.CHANGE_NAME:
        handlePeerNameChange(action, state)
        return

      case PeerActions.ROLL:
        handlePeerDiceRoll(action, state)
        return
    }
  }

  return { render, onPeerAction }
}

export default usePeerDiceRoller
