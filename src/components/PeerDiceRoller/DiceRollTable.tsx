import { BoxProps, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import React from "react"
import { IMyPeer, IPeerConnection, IPeerData } from "../PeerContainer/types"

const ConnectionsTable = (props: {
  myPeer: IPeerData & IMyPeer
  peers: (IPeerData & IPeerConnection)[]
}) => {
  const { myPeer, peers } = props

  return (
    <Table
      size="md"
      variant="striped"
      color="black"
      colorScheme="teal"
      bg="white"
      rounded="md"
    >
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Roll</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <FluidTd width="50%">{formatName(myPeer.name)}</FluidTd>
          <FluidTd width="50%">{myPeer.latestRoll || "-"}</FluidTd>
        </Tr>
        {peers.map((p) => (
          <Tr key={p.connection.peer}>
            <FluidTd width="50%">{formatName(p.name)}</FluidTd>
            <FluidTd width="50%">{p.latestRoll || "-"}</FluidTd>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

const FluidTd = (props: BoxProps) => {
  return <Td whiteSpace="break-spaces" wordBreak="break-all" {...props} />
}

function formatName(name?: string) {
  const OVERFLOW_LEN = 50
  const overflowContent = name && name.length > OVERFLOW_LEN ? "..." : ""
  const formatted = name ? name.slice(0, OVERFLOW_LEN) + overflowContent : "-"
  return formatted
}

export default ConnectionsTable
