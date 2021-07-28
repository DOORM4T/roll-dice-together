import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
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
          <Td>{myPeer.name || "-"}</Td>
          <Td>{myPeer.latestRoll || "-"}</Td>
        </Tr>
        {peers.map((p) => (
          <Tr key={p.connection.peer}>
            <Td>{p.name || "-"}</Td>
            <Td>{p.latestRoll || "-"}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
export default ConnectionsTable
