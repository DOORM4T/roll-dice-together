import { Box, Heading } from "@chakra-ui/react"
import React from "react"
import usePeerDiceRoller from "./components/PeerDiceRoller/usePeerDiceRoller"
import PeerContainer from "./components/PeerContainer"
import useConnectionHandlers from "./components/PeerContainer/useConnectionHandlers"

const App = () => {
  const { onConnectionOpen, onConnectionClose } = useConnectionHandlers()
  const { render, onPeerAction } = usePeerDiceRoller()

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      bg="linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%);"
      color="white"
      textAlign="center"
    >
      <Heading pt="1rem">PeerJS-React Template</Heading>
      <PeerContainer
        render={render}
        onPeerAction={onPeerAction}
        onConnectionOpen={onConnectionOpen}
        onConnectionClose={onConnectionClose}
      />
    </Box>
  )
}

export default App
