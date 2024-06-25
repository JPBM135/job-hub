import { gql } from 'graphql-tag';

export const schema = gql`
  type Query {
    Jobs(where: JobWhereInput, orderBy: JobOrderByInput, limit: Int, offset: Int): PaginatedJobs! @requireAuth
    Job(id: ID!): Job! @requireAuth
    JobApplications(jobId: String!): [JobApplication!]! @requireAuth
  }

  type Mutation {
    CreateJob(input: JobInput!): Job! @requireAuth
    UpdateJob(id: ID!, input: JobUpdateInput!): Job! @requireAuth
    ArchiveOrUnarchiveJob(id: ID!): Job! @requireAuth
    DeleteJob(id: ID!): Boolean! @requireAuth
    ApplyOrUpdateApplicationJob(input: JobApplicationInput!): JobApplication! @requireAuth
  }

  # Types
  enum JobRemoteStatus {
    remote
    hybrid
    onsite
  }

  enum JobExperienceLevel {
    internship
    entry
    mid
    senior
    lead
    manager
    executive
  }

  enum JobType {
    full_time
    part_time
    contract
    temporary
    internship
    volunteer
    remote
  }

  enum JobPayType {
    hourly
    daily
    weekly
    bi_weekly
    monthly
    yearly
  }

  type Job {
    id: ID!
    title: String!
    description: String
    url: String!
    datePosted: String
    remoteStatus: JobRemoteStatus!
    location: String
    company: String
    experienceLevel: JobExperienceLevel!
    type: JobType!
    payMin: Float
    payMax: Float
    payType: JobPayType
    application: JobApplication
    archived: Boolean!
    createdAt: String!
  }

  enum JobApplicationStatus {
    applied
    interviewing
    offered
    rejected
    hired
  }

  type JobApplication {
    id: ID!
    job: Job!
    user: User!
    status: JobApplicationStatus!
    createdAt: String!
    updatedAt: String!
  }

  # Inputs
  input JobInput {
    title: String!
    description: String
    url: String!
    datePosted: String
    remoteStatus: JobRemoteStatus!
    location: String
    company: String
    experienceLevel: JobExperienceLevel!
    type: JobType!
    payMin: Float
    payMax: Float
    payType: JobPayType
  }

  input JobUpdateInput {
    title: String
    description: String
    url: String
    datePosted: String
    remoteStatus: JobRemoteStatus
    location: String
    company: String
    experienceLevel: JobExperienceLevel
    type: JobType
    payMin: Float
    payMax: Float
    payType: JobPayType
    archived: Boolean
  }

  input JobApplicationInput {
    jobId: ID!
    status: JobApplicationStatus!
  }

  # Query
  enum JobOrderByInput {
    title_ASC
    title_DESC
    createdAt_ASC
    createdAt_DESC
  }

  input JobWhereInput {
    nameContains: String
    applicationStatus: JobApplicationStatus
    archived: Boolean
  }

  type PaginatedJobs {
    data: [Job!]!
    pageInfo: PageInfo!
  }
`;
