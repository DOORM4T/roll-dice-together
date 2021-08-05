import {
  Box,
  Button,
  Flex,
  FormControl,
  HStack,
  Input,
  Tooltip,
  useToast,
} from "@chakra-ui/react"
import React from "react"
import { CustomPeerActionHandler, IPeerState } from "./types"
import useConnectionHandlers from "./useConnectionHandlers"
import usePeerConnections from "./usePeerConnections"

interface IProps {
  render?: (state: IPeerState) => React.ReactNode
  onPeerAction?: CustomPeerActionHandler
}
function PeerContainer({ onPeerAction, render }: IProps) {
  const { onConnectionOpen, onConnectionClose } = useConnectionHandlers()
  const peerConnections = usePeerConnections({
    onConnectionOpen,
    onConnectionClose,
    onPeerAction,
  })

  const {
    state: peerState,
    connectToPeer,
    disconnect,
    hasPeer,
    initMyPeer,
  } = peerConnections

  const { peers, myPeer, setMyPeer, setPeers } = peerState

  const handleConnectFormSubmit = (toConnectId: string) => {
    if (hasPeer(toConnectId)) return
    connectToPeer(toConnectId)
  }
  const hasPeers = peers.length > 0

  if (myPeer && !myPeer.peerObj.id) {
    // Creating a new peer object with a random ID fails some times, causing the ID to be null
    return <div>Oops, Something broke! Please refresh the page.</div>
  }

  return (
    <Box>
      <HStack flexDirection="row" alignItems="center" justifyContent="center">
        {myPeer && myPeer.peerObj.id && (
          <CopyMyIDInput myId={myPeer.peerObj.id} />
        )}
        {!hasPeers && (
          <Button colorScheme="yellow" onClick={initMyPeer}>
            New ID
          </Button>
        )}
      </HStack>

      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt="1rem"
      >
        <PeerConnectForm
          handleSubmit={handleConnectFormSubmit}
          doShowDisconnect={hasPeers}
          disconnect={disconnect}
        />
        {render && render({ myPeer, setMyPeer, peers, setPeers })}
      </Flex>
    </Box>
  )
}

const CopyMyIDInput = (props: { myId: string }) => {
  const { myId } = props
  const toast = useToast()

  const handleCopy = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.currentTarget.select()
    document.execCommand("copy")
    toast({
      title: "Copied ID to clipboard!",
      status: "success",
      duration: 1000,
      isClosable: true,
      position: "top-right",
    })
  }

  return (
    <Tooltip label="Click to copy!" placement="right">
      <Input
        ml="1rem"
        value={myId}
        width="auto"
        onClick={handleCopy}
        readOnly
      />
    </Tooltip>
  )
}

interface IConnectFormProps {
  handleSubmit: (toConnectId: string) => void
  doShowDisconnect: boolean
  disconnect: () => void
}
const PeerConnectForm = ({
  handleSubmit,
  doShowDisconnect,
  disconnect,
}: IConnectFormProps) => {
  const _handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const toConnectId = (e.target as HTMLFormElement)["peer-id"].value as string
    handleSubmit(toConnectId)
  }

  return (
    <form action="" onSubmit={_handleSubmit}>
      <FormControl id="peer-id">
        <HStack alignItems="center" justifyContent="center">
          <Input
            type="text"
            onClick={(e) => {
              e.currentTarget.select()
            }}
          />
          <Button type="submit" colorScheme="telegram">
            Connect
          </Button>

          {doShowDisconnect && (
            <Button colorScheme="red" onClick={disconnect}>
              Disconnect
            </Button>
          )}
        </HStack>
      </FormControl>
    </form>
  )
}

export default PeerContainer
