import { BlockchainVotingSystem } from "@blockchain-voting-system/core";

export abstract class BlockchainService {
  public abstract getVotingSystem(): BlockchainVotingSystem;
}
