import { nanoid } from "nanoid"
import Peer from "peerjs"
import { useEffect, useRef, useState } from "react"
import {
  handleShareMyPeerData,
  shareMyPeerData,
} from "./actions/shareMyPeerData"
import { ISharePeersAction, sharePeers } from "./actions/sharePeers"
import {
  CustomConnectionHandler,
  CustomPeerActionHandler,
  IMyPeer,
  IPeerAction,
  IPeerConnection,
  IPeerData,
  IPeerState,
  PeerActions,
} from "./types"

interface IProps {
  idLength?: number
  onConnectionOpen?: CustomConnectionHandler
  onConnectionClose?: CustomConnectionHandler
  onPeerAction?: CustomPeerActionHandler
}
const usePeerConnections = (props: IProps) => {
  const [myPeer, setMyPeer] = useState<(IMyPeer & IPeerData) | null>(null)
  const latestMyPeer = useRef<typeof myPeer>(null)
  useEffect(() => {
    // Track latest myPeer state in a ref so we can access it in listeners or other functions that rely on it
    latestMyPeer.current = myPeer
  }, [myPeer])

  const initMyPeer = () => {
    if (latestMyPeer.current?.peerObj) latestMyPeer.current.peerObj.destroy()
    const peerObj = new Peer(nanoid(props.idLength || 10))
    listenForConnections(peerObj)

    // A peer's name will be their ID by default
    setMyPeer({ peerObj })
  }

  useEffect(initMyPeer, [])

  const [peers, setPeers] = useState<(IPeerConnection & IPeerData)[]>([])
  const latestPeers = useRef<typeof peers>([])
  useEffect(() => {
    // Track latest connections state in a ref so we can access it in listeners or other functions that rely on it
    latestPeers.current = peers
  }, [peers])

  const addConnection = (conn: Peer.DataConnection) => {
    const updatedConnections = latestPeers.current.concat({
      connection: conn,
    })
    setPeers(updatedConnections)
  }

  const removeConnection = (conn: Peer.DataConnection) => {
    setPeers(latestPeers.current.filter((c) => c.connection.peer !== conn.peer))
  }

  const hasPeer = (peer: string) => {
    const isMyPeer = peer === latestMyPeer.current?.peerObj.id
    const hasPeer = latestPeers.current.some((c) => c.connection.peer === peer)
    return isMyPeer || hasPeer
  }
  const disconnect = () => {
    const toDisconnect = latestPeers.current
    toDisconnect.forEach((conn) => conn.connection.close())
    setPeers([])
  }

  const getState = (): IPeerState => {
    return {
      myPeer: latestMyPeer.current,
      setMyPeer,
      peers: latestPeers.current,
      setPeers,
    }
  }

  const listenForConnections = (callee: Peer) =>
    callee.on("connection", handleConnection)

  const connectToPeer = (toConnectId: string) => {
    if (!latestMyPeer.current) return
    const conn = latestMyPeer.current.peerObj.connect(toConnectId)
    handleConnection(conn)
  }

  const handleConnectionOpen = (conn: Peer.DataConnection) => {
    const myId = latestMyPeer.current?.peerObj.id
    if (!myId) return

    if (hasPeer(conn.peer)) return

    addConnection(conn)
    console.log(`Connected with ${conn.peer}`)

    // Share my peers with the new peer -- this allows them to join group connections
    // This conferencing method follows a mesh topology, which might not be suitable for large groups
    const sharePeersAction = JSON.stringify(
      sharePeers(
        myId,
        latestPeers.current.map((c) => c.connection.peer),
      ),
    )
    conn.send(sharePeersAction)

    // Share extra peer data with the peer
    // Non-Peer.JS data such as this peer's name
    // IMPORTANT: the custom onConnectionOpen callback is actually called in handleConnectionData
    //  This ensures the newly connected peer can react to the new connection while having access to this peer's latest data
    //  Otherwise, fields like 'name' wouldn't be up to date when the peer calls onConnectionOpen from this function

    // The following line extracts ONLY IPeerData fields. IMyPeer type fields like peerObj won't be used here.
    // This prevents JSON stringify circular structure bugs, which can prevent new peers from seeing shared data upon connecting
    const { peerObj: _, ...myPeerData } = { ...latestMyPeer.current }

    const shareMyPeerDataAction = JSON.stringify(
      shareMyPeerData(myId, myPeerData),
    )
    conn.send(shareMyPeerDataAction)
    console.log(`Shared peers with ${conn.peer}`)
  }

  const handleConnectionData = (conn: Peer.DataConnection, data: string) => {
    console.log(`[${conn.peer}]: ${data}`)

    const action = JSON.parse(data) as IPeerAction
    const state = getState()

    switch (action.type) {
      case PeerActions.SHARE_PEERS: {
        const { peers } = action as ISharePeersAction
        peers.forEach((peer) => {
          if (hasPeer(peer) || !latestMyPeer.current) return
          console.log(`Connecting with shared peer ${peer}`)
          connectToPeer(peer)
        })
        return
      }

      case PeerActions.SHARE_MY_PEER_DATA:
        const onConnectionOpen = props.onConnectionOpen
          ? () => props.onConnectionOpen!(conn, state)
          : undefined
        handleShareMyPeerData(action, state, onConnectionOpen)
    }

    props.onPeerAction && props.onPeerAction(action, state)
  }

  const handleConnectionClose = (conn: Peer.DataConnection) => {
    props.onConnectionClose && props.onConnectionClose(conn, getState())
    removeConnection(conn)
    console.log(`Disconnected from ${conn.peer}`)
  }

  const handleConnection = (conn: Peer.DataConnection) => {
    conn.on("open", () => handleConnectionOpen(conn))
    conn.on("data", (data) => handleConnectionData(conn, data))
    conn.on("close", () => handleConnectionClose(conn))
    conn.on("error", console.error)
  }

  return {
    state: {
      myPeer,
      setMyPeer,

      peers,
      setPeers,
    },
    connectToPeer,
    disconnect,
    hasPeer,
    initMyPeer,
  }
}

export default usePeerConnections
