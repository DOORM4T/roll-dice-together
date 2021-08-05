import {
  Box,
  Button,
  Heading,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react"
import React from "react"
import InputModal from "../common/InputModal"
import { HandleNameChange } from "../PeerContainer/actions/changeName"
import { IMyPeer, IPeerConnection, IPeerData } from "../PeerContainer/types"
import DiceRollTable from "./DiceRollTable"

const AppWrapper = (props: {
  handleNameChange: HandleNameChange
  handleDiceRoll: () => void
  myPeer: IMyPeer & IPeerData
  peers: (IPeerConnection & IPeerData)[]
}) => {
  const { handleNameChange, handleDiceRoll, myPeer, peers } = props
  return (
    <Box width={useBreakpointValue({ sm: "sm", md: "md", lg: "lg" })} mt="3rem">
      <Heading pt="1rem">Roll Dice Together</Heading>
      <Heading pt="0.4rem" size="sm">
        Under construction!
      </Heading>
      <HStack mt="1rem">
        <InputModal
          buttonName="Change Name"
          handleConfirmChange={handleNameChange}
          defaultValue={myPeer.name}
        />
        <Button colorScheme="yellow" onClick={handleDiceRoll}>
          Roll
        </Button>
      </HStack>
      <Box mt="1rem">
        <DiceRollTable myPeer={myPeer} peers={peers} />
      </Box>
    </Box>
  )
}

export default AppWrapper
