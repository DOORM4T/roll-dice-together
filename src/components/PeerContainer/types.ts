import Peer from "peerjs"

export enum PeerActions {
  SHARE_PEERS = "SHARE_PEERS",
  SHARE_MY_PEER_DATA = "SHARE_MY_PEER_DATA",
  CHANGE_NAME = "CHANGE_NAME",

  // ADD CUSTOM PEER ACTION TYPES BELOW
  ROLL = "ROLL",
}

// CUSTOM PEER ACTIONS WILL EXTEND THE FOLLOWING INTERFACE
export interface IPeerAction {
  senderId: string
  type: PeerActions
}

export interface IPeerData {
  name?: string
  // ADDITIONAL PEER DATA GOES HERE
  latestRoll?: number
}

export type CustomConnectionHandler = (
  conn: Peer.DataConnection,
  state: IPeerState,
) => void

export type CustomPeerActionHandler = (
  action: IPeerAction,
  state: IPeerState,
) => void

export interface IPeerState {
  myPeer: (IMyPeer & IPeerData) | null
  setMyPeer: React.Dispatch<React.SetStateAction<(IMyPeer & IPeerData) | null>>
  peers: (IPeerConnection & IPeerData)[]
  setPeers: React.Dispatch<
    React.SetStateAction<(IPeerConnection & IPeerData)[]>
  >
}

export interface IMyPeer {
  peerObj: Peer
}

export interface IPeerConnection {
  connection: Peer.DataConnection
}
