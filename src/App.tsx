import { Box } from "@chakra-ui/react"
import React from "react"
import PeerContainer from "./components/PeerContainer"
import usePeerDiceRoller from "./components/PeerDiceRoller/usePeerDiceRoller"

const App = () => {
  const { render, onPeerAction } = usePeerDiceRoller()

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      overflowX="hidden"
      overflowY="auto"
      bg="orange.200"
      textAlign="center"
      pt="1rem"
    >
      <PeerContainer render={render} onPeerAction={onPeerAction} />
    </Box>
  )
}

export default App
