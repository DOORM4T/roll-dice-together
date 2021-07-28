import { useToast } from "@chakra-ui/react"
import { CustomConnectionHandler } from "./types"

const useConnectionHandlers = () => {
  const toast = useToast({
    duration: 9000,
    isClosable: true,
    position: "top-right",
  })

  const onConnectionOpen: CustomConnectionHandler = (conn, state) => {
    const newPeer = state.peers.find((p) => p.connection.peer === conn.peer)
    const description = `${newPeer?.name ? `${newPeer.name} ` : ""}${conn.peer}`
    toast({ title: "Peer Connected", description, status: "info" })
  }

  const onConnectionClose: CustomConnectionHandler = (conn, state) => {
    const closedPeer = state.peers.find((p) => p.connection.peer === conn.peer)
    const description = `${closedPeer?.name ? `${closedPeer.name} ` : ""}${
      conn.peer
    }`
    toast({ title: "Peer Disconnected", description, status: "error" })
  }

  return { onConnectionOpen, onConnectionClose }
}

export default useConnectionHandlers
