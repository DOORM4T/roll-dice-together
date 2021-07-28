import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  useBreakpointValue,
} from "@chakra-ui/react"
import React from "react"
import { IMyPeer, IPeerConnection, IPeerData } from "../PeerContainer/types"
import DiceRollTable from "./DiceRollTable"

const AppWrapper = (props: {
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
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
        <Input
          placeholder="Custom name"
          onChange={handleNameChange}
          color="black"
          borderColor="black"
          _placeholder={{ color: "black" }}
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
