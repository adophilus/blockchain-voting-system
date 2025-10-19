import 'reflect-metadata'

import { Container } from '@n8n/di'
import { App, HonoApp } from '@/features/app'
import {
  AuthUserRepository,
  KyselyAuthUserRepository
} from '@/features/auth/repository'
import {
  GetUserProfileUseCase,
  SignInWithEmailUseCase,
  SignInWithVoterCodeUseCase,
  SignUpWithEmailUseCase
} from '@/features/auth/use-case'
import { config } from '@/features/config'
import { KyselyClient } from '@/features/database/kysely'
import { createKyselySqliteClient } from '@/features/database/kysely/sqlite'
import { Logger } from '@/features/logger'
import {
  StorageService,
  SqliteStorageService
} from '@/features/storage/service'
import {
  ElectionRepository,
  KyselyElectionRepository
} from '@/features/election/repository'
import {
  ListElectionsUseCase,
  CreateElectionUseCase,
  CreatePositionUseCase,
  GetElectionByIdUseCase,
  CreateCandidateUseCase,
  GenerateVotersUseCase,
  GetPlatformElectionMetricsUseCase,
  ListVotersUseCase,
  GetElectionResultsUseCase,
  EndElectionUseCase,
  DeleteElectionUseCase
} from '@/features/election/use-case'
import { PositionRepository } from '@/features/election/position/repository'
import { KyselyPositionRepository } from '@/features/election/position/repository/kysely'
import { CandidateRepository } from '@/features/election/candidate/repository'
import { KyselyCandidateRepository } from '@/features/election/candidate/repository/kysely'
import {
  KyselyVoterRepository,
  VoterRepository
} from '@/features/election/voter/repository'
import { KyselyVoteRepository } from '@/features/election/voting/repository/kysely'
import { VoteRepository } from '@/features/election/voting/repository'
import { CronService } from '@/features/cron/service'
import { ElectionStatusCronJob } from '@/features/election/cron'
import { UploadUseCase } from '@/features/storage/route/upload/use-case'
import { GetFileUseCase } from '@/features/storage/route/get/use-case'
import { KyselyStorageRepository } from '@/features/storage/repository'
import { SubmitVoteUseCase } from '@/features/election/voter/use-case'
import { BlockchainService } from '@/features/blockchain/service'
import { BlockchainSubmitVoteUseCase } from '@/features/election/voter/route/submit/blockchain-use-case'

export const bootstrap = async () => {
  const logger = new Logger()

  // Database
  const kyselyClient = await createKyselySqliteClient()

  // Blockchain Service
  const blockchainService = new BlockchainService(
    logger,
    config.blockchain.votingSystemAddress as `0x${string}`
  )
  
  // Initialize blockchain service if wallet private key is provided
  if (config.blockchain.walletPrivateKey) {
    try {
      await blockchainService.initialize(
        config.blockchain.walletPrivateKey as `0x${string}`
      )
    } catch (error) {
      logger.error('Failed to initialize blockchain service:', error)
    }
  }

  // Storage DI
  const storageRepository = new KyselyStorageRepository(kyselyClient, logger)
  const storageService = new SqliteStorageService(storageRepository)

  // Auth DI
  const authUserRepository = new KyselyAuthUserRepository(kyselyClient, logger)

  // Auth Use Cases
  const getUserProfileUseCase = new GetUserProfileUseCase()
  const signInWithEmailUseCase = new SignInWithEmailUseCase(authUserRepository)
  const signUpWithEmailUseCase = new SignUpWithEmailUseCase(authUserRepository)
  const signInWithVoterCodeUseCase = new SignInWithVoterCodeUseCase(
    kyselyClient,
    logger
  )

  // Elections DI
  const electionRepository = new KyselyElectionRepository(kyselyClient, logger)
  const positionRepository = new KyselyPositionRepository(kyselyClient, logger)
  const candidateRepository = new KyselyCandidateRepository(
    kyselyClient,
    logger
  )
  const voterRepository = new KyselyVoterRepository(kyselyClient, logger)
  const voteRepository = new KyselyVoteRepository(kyselyClient, logger)
  const blockchainSubmitVoteUseCase = new BlockchainSubmitVoteUseCase(blockchainService, logger)
  const submitVoteUseCase = new SubmitVoteUseCase(
    voterRepository,
    voteRepository,
    blockchainSubmitVoteUseCase
  )

  // Cron Service
  const electionStatusCronJob = new ElectionStatusCronJob(
    electionRepository,
    logger
  )
  const cronService = new CronService([electionStatusCronJob], logger)

  // Elections Use Cases
  const generateVotersUseCase = new GenerateVotersUseCase(voterRepository)
  const listElectionsUseCase = new ListElectionsUseCase(electionRepository)
  const createElectionUseCase = new CreateElectionUseCase(electionRepository)
  const createPositionUseCase = new CreatePositionUseCase(positionRepository)
  const createCandidateUseCase = new CreateCandidateUseCase(candidateRepository)
  const getElectionByIdUseCase = new GetElectionByIdUseCase(
    electionRepository,
    positionRepository,
    candidateRepository,
    logger
  )
  const getPlatformElectionMetricsUseCase =
    new GetPlatformElectionMetricsUseCase(electionRepository, logger)
  const listVotersUseCase = new ListVotersUseCase(voterRepository, logger)
  const uploadUseCase = new UploadUseCase(storageRepository)
  const getFileUseCase = new GetFileUseCase(storageRepository, logger)
  const endElectionUseCase = new EndElectionUseCase(electionRepository)
  const getElectionResultsUseCase = new GetElectionResultsUseCase(
    electionRepository,
    voterRepository,
    voteRepository,
    positionRepository,
    candidateRepository,
    logger
  )
  const deleteElectionUseCase = new DeleteElectionUseCase(
    electionRepository,
    logger
  )

  const app = new HonoApp(logger)

  // App
  Container.set(App, app)

  // Blockchain Service
  Container.set(BlockchainService, blockchainService)

  // Database
  Container.set(KyselyClient, kyselyClient)

  // Storage DI
  Container.set(StorageService, storageService)

  // OpenTelemetry DI
  Container.set(Logger, logger)

  // Auth DI
  Container.set(AuthUserRepository, authUserRepository)

  // Auth Use Cases
  Container.set(GetUserProfileUseCase, getUserProfileUseCase)
  Container.set(SignInWithEmailUseCase, signInWithEmailUseCase)
  Container.set(SignUpWithEmailUseCase, signUpWithEmailUseCase)
  Container.set(SignInWithVoterCodeUseCase, signInWithVoterCodeUseCase)

  // Elections DI
  Container.set(ElectionRepository, electionRepository)
  Container.set(PositionRepository, positionRepository)
  Container.set(CandidateRepository, candidateRepository)
  Container.set(VoterRepository, voterRepository)
  Container.set(VoteRepository, voteRepository)
  Container.set(SubmitVoteUseCase, submitVoteUseCase)

  // Blockchain DI
  Container.set(BlockchainService, blockchainService)

  // Cron Service
  Container.set(CronService, cronService)

  // Elections Use Cases
  Container.set(GenerateVotersUseCase, generateVotersUseCase)
  Container.set(ListElectionsUseCase, listElectionsUseCase)
  Container.set(CreateElectionUseCase, createElectionUseCase)
  Container.set(CreatePositionUseCase, createPositionUseCase)
  Container.set(CreateCandidateUseCase, createCandidateUseCase)
  Container.set(GetElectionByIdUseCase, getElectionByIdUseCase)
  Container.set(
    GetPlatformElectionMetricsUseCase,
    getPlatformElectionMetricsUseCase
  )
  Container.set(ListVotersUseCase, listVotersUseCase)
  Container.set(EndElectionUseCase, endElectionUseCase)
  Container.set(GetElectionResultsUseCase, getElectionResultsUseCase)
  Container.set(DeleteElectionUseCase, deleteElectionUseCase)
  Container.set(UploadUseCase, uploadUseCase)
  Container.set(GetFileUseCase, getFileUseCase)

  return { app, logger, config, cronService }
}
