import "@typespec/http";

using Http;

@service(#{ title: "API Documentation" })
namespace ApiDocs;

@doc("API")
namespace Api {
  @example("f47ac10b-58cc-4372-a567-0e02b2c3d479")
  scalar Id extends string;

  @example("Mary Slessor")
  scalar FullName extends string;

  @example("HE6G1U")
  scalar ReferralCode extends string;

  @example("2000-01-01")
  scalar DateOfBirth extends string;

  @example("+2348123456789")
  scalar PhoneNumber extends string;

  @example("2021-09-01T12:00:00Z")
  scalar DateTime extends string;

  @example("745731af4484f323968969eda289aeee")
  scalar Token extends string;

  @example("Seafood")
  scalar FoodCategory extends string;

  @example("Nigeria")
  scalar CuisineRegion extends string;

  @example("12345")
  scalar Otp extends string;

  @example(4800.50)
  @minValue(0)
  scalar Price extends numeric;

  model VideoFile extends File {
    contentType: "video/mp4" | "video/webm" | "video/ogg";
  }

  model ImageFile extends File {
    contentType: "image/jpeg" | "image/png" | "image/webp";
  }

  model WithoutTimestamp<T> {
    ...OmitProperties<T, "created_at" | "updated_at" | "deleted_at">;
  }

  enum Role {
    ADMIN,
    USER,
    VOTER,
  }

  model MediaDescription {
    @example("sqlite")
    source: "sqlite";

    @example("h93suhw7mzyujf9tbugy")
    id: string;
  }

  @example("mary.slessor@mail.com")
  scalar Email extends string;

  @example("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30")
  scalar Jwt extends string;

  @example("securePassword123")
  scalar Password extends string;

  @error
  model ZodFlattenedError {
    formErrors: string[];

    @example(#{ name: #["Required"], age: #["Required"] })
    fieldErrors: unknown;
  }

  @error
  model UnexpectedError {
    @statusCode _code: 500;
    code: "ERR_UNEXPECTED";
  }

  @error
  model BadRequestError {
    @statusCode _code: 400;
    code: "ERR_EXPECTED_DATA_NOT_RECEIVED";
    data: ZodFlattenedError;
  }

  @error
  model NotFoundError<T> {
    @statusCode _code: 404;
    code: "ERR_${T}_NOT_FOUND";
  }

  @error
  model UnauthorizedError {
    @statusCode _code: 401;
    code: "ERR_UNAUTHORIZED";
  }

  @error
  model ConflictError<T> {
    @statusCode _code: 409;
    code: "ERR_${T}_ALREADY_IN_USE";
  }

  @example("Student Council Election 2024")
  scalar ElectionTitle extends string;

  @example("Annual student council election for 2024")
  scalar ElectionDescription extends string;

  @example("2024-12-01T09:00:00Z")
  scalar ElectionStartDate extends string;

  @example("2024-12-15T17:00:00Z")
  scalar ElectionEndDate extends string;

  @example("President")
  scalar PositionTitle extends string;

  @example("Lead the student council and represent student interests")
  scalar PositionDescription extends string;

  @example("John Smith")
  scalar CandidateName extends string;

  @example("Third-year Computer Science student with leadership experience")
  scalar CandidateBio extends string;

  @example("VOTER123")
  scalar VoterCode extends string;

  @tag("Authentication")
  @route("/auth")
  namespace Authentication {
    @route("/sign-up")
    namespace SignUp {
      @route("/email")
      namespace Email {
        namespace Request {
          model Body {
            full_name: FullName;
            email: Api.Email;
            password: Password;
          }
        }

        namespace Response {
          namespace Success {
            model SignUpSuccess {
              code: "SIGN_UP_SUCCESSFUL";
              data: {
                user: {
                  id: Id;
                  email: Api.Email;
                  full_name: FullName;
                };
              };
            }

            alias Success = SignUpSuccess;
          }

          namespace Error {
            @error
            model EmailAlreadyInUseError {
              @statusCode _code: 409;
              code: "ERR_EMAIL_ALREADY_IN_USE";
            }

            alias Error = EmailAlreadyInUseError | BadRequestError | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @post
        @doc("Sign up a new user with email and password")
        op signUp(@body body: Request.Body): Response.Response;
      }
    }

    @route("/sign-in")
    namespace SignIn {
      @route("/email")
      namespace Email {
        namespace Request {
          model Body {
            email: Api.Email;
            password: Password;
          }
        }

        namespace Response {
          namespace Success {
            model SignInSuccess {
              code: "SIGN_IN_SUCCESSFUL";
              data: {
                user: {
                  id: Id;
                  full_name: FullName;
                  email: Api.Email;
                };
                tokens: {
                  access_token: Jwt;
                  refresh_token: Jwt;
                };
              };
            }

            alias Success = SignInSuccess;
          }

          namespace Error {
            @error
            model InvalidCredentialsError {
              @statusCode _code: 401;
              code: "ERR_INVALID_CREDENTIALS";
            }

            @error
            model UserNotRegisteredWithPasswordError {
              @statusCode _code: 401;
              code: "ERR_USER_NOT_REGISTERED_WITH_PASSWORD";
            }

            alias Error =
              | NotFoundError<"USER">
              | InvalidCredentialsError
              | UserNotRegisteredWithPasswordError
              | BadRequestError
              | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @post
        @doc("Sign in an existing user with email and password")
        op signIn(@body body: Request.Body): Response.Response;
      }

      @route("/voter-code")
      namespace VotersCode {
        namespace Request {
          model Body {
            voter_code: VoterCode;
            election_id: Id;
          }
        }

        namespace Response {
          namespace Success {
            model SignInSuccess {
              code: "SIGN_IN_SUCCESSFUL";
              data: {
                voter: {
                  id: Id;
                  election_id: Id;
                  status: "NOT_VOTED" | "VOTED";
                  code: string;
                  voted_at: string | null;
                };
                tokens: {
                  access_token: Jwt;
                  refresh_token: Jwt;
                };
              };
            }

            alias Success = SignInSuccess;
          }

          namespace Error {
            @error
            model ElectionNotActiveError {
              @statusCode _code: 400;
              code: "ERR_ELECTION_NOT_ACTIVE";
            }

            @error
            model VoterAlreadyVotedError {
              @statusCode _code: 400;
              code: "ERR_VOTER_ALREADY_VOTED";
            }

            alias Error =
              | NotFoundError<"VOTER">
              | NotFoundError<"ELECTION">
              | ElectionNotActiveError
              | VoterAlreadyVotedError
              | BadRequestError
              | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @post
        @doc("Sign in a voter with voter code for a specific election")
        op signInVoter(@body body: Request.Body): Response.Response;
      }
    }

    @useAuth(BearerAuth)
    @route("/profile")
    namespace Profile {
      namespace Response {
        namespace Success {
          model UserProfile {
            code: "USER_PROFILE";
            data: {
              role: Role.ADMIN | Role.USER;
              id: Id;
              full_name: FullName;
              email: Api.Email;
              created_at: DateTime;
              updated_at: DateTime | null;
            } | {
              role: Role.VOTER;
              id: Id;
              code: VoterCode;
              election_id: Id;
            };
          }

          alias Success = UserProfile;
        }

        namespace Error {
          alias Error = UnauthorizedError | NotFoundError<"USER"> | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @get
      @doc("Get the authenticated user's profile")
      op getProfile(): Response.Response;
    }
  }

  @useAuth(BearerAuth)
  @tag("Election")
  @route("/elections")
  namespace Election {
    model Election {
      id: Id;
      title: ElectionTitle;
      description: ElectionDescription | null;
      start_timestamp: ElectionStartDate;
      end_timestamp: ElectionEndDate;
      status: "UPCOMING" | "ONGOING" | "COMPLETED";
      created_at: DateTime;
      updated_at: DateTime | null;
    }

    model Votes {
      id: Id;
      election_id: Id;
      position_id: Id;
      candidate_id: Id;
      voter_id: Id;
      created_at: DateTime;
    }

    namespace Create {
      namespace Request {
        model Body {
          title: ElectionTitle;
          description?: ElectionDescription;
          start_timestamp: ElectionStartDate;
          end_timestamp: ElectionEndDate;
        }
      }

      namespace Response {
        namespace Success {
          model ElectionCreated {
            code: "ELECTION_CREATED";
            data: {
              id: Id;
            };
          }

          alias Success = ElectionCreated;
        }

        namespace Error {
          @error
          model InvalidDateRangeError {
            @statusCode _code: 400;
            code: "ERR_INVALID_DATE_RANGE";
          }

          alias Error = BadRequestError | InvalidDateRangeError | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @post
      @doc("Create an election")
      op createElection(@body body: Request.Body): Response.Response;
    }

    namespace List {
      namespace Request {
        alias Query = Pagination.Query;
      }

      namespace Response {
        namespace Success {
          model ElectionsList {
            code: "ELECTIONS_LIST";
            data: Pagination.Paginated<Election>;
          }

          alias Success = ElectionsList;
        }

        namespace Error {
          alias Error = BadRequestError | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @doc("List elections")
      op listElections(...Request.Query): Response.Response;
    }

    @route("/{electionId}")
    namespace ById {
      model Path {
        @path
        electionId: Id;
      }

      namespace Get {
        namespace Request {
          alias Path = ById.Path;
        }

        namespace Response {
          namespace Success {
            model ElectionDetails {
              code: "ELECTION_DETAILS";
              data: {
                election: Election;
                positions: (Position.Position & {
                  candidates: Candidate.Candidate[];
                })[];
              };
            }

            alias Success = ElectionDetails;
          }

          namespace Error {
            alias Error = NotFoundError<"ELECTION"> | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @doc("Get election by id")
        op getElectionById(...Request.Path): Response.Response;
      }

      namespace Update {
        namespace Request {
          alias Path = ById.Path;
          alias Body = OptionalProperties<Create.Request.Body>;
        }

        namespace Response {
          namespace Success {
            model ElectionUpdated {
              code: "ELECTION_UPDATED";
            }

            alias Success = ElectionUpdated;
          }

          namespace Error {
            alias Error = BadRequestError | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @patch(#{ implicitOptionality: false })
        @doc("Update an election")
        op updateElectionById(
          ...Request.Path,
          @body body: Request.Body,
        ): Response.Response;
      }

      namespace Delete {
        namespace Request {
          alias Path = ById.Path;
        }

        namespace Response {
          namespace Success {
            model ElectionDeleted {
              code: "ELECTION_DELETED";
            }
            alias Success = ElectionDeleted;
          }

          namespace Error {
            alias Error = NotFoundError<"ELECTION"> | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @delete
        @doc("Delete an election by ID.")
        op deleteElectionById(...Request.Path): Response.Response;
      }

      @route("/end")
      namespace End {
        namespace Request {
          alias Path = ById.Path;
        }

        namespace Response {
          namespace Success {
            model ElectionEnded {
              code: "ELECTION_ENDED";
              data: {
                id: Id;
              };
            }
            alias Success = ElectionEnded;
          }

          namespace Error {
            alias Error = NotFoundError<"ELECTION"> | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @post
        @doc("End an election, setting its status to COMPLETED.")
        op endElection(...Request.Path): Response.Response;
      }

      @route("/voters")
      namespace Voter {
        model Voter {
          id: Id;
          election_id: Id;
          code: VoterCode;
          status: "NOT_VOTED" | "VOTED";
          voted_at: DateTime | null;
        }

        namespace Create {
          namespace Request {
            alias Path = ById.Path;

            model Body {
              count: int32;
            }
          }

          namespace Response {
            namespace Success {
              model VotersGenerated {
                code: "VOTERS_GENERATED";
                data: Voter[];
              }

              alias Success = VotersGenerated;
            }

            namespace Error {
              alias Error = NotFoundError<"ELECTION"> | BadRequestError | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @post
          @doc("Generate voter codes for a specific election")
          op generateVoters(
            ...Request.Path,
            @body body: Request.Body,
          ): Response.Response;
        }

        namespace List {
          namespace Request {
            alias Path = ById.Path;
          }

          namespace Response {
            namespace Success {
              model VotersList {
                code: "VOTERS_LIST";
                data: Voter[];
              }
              alias Success = VotersList;
            }

            namespace Error {
              alias Error = NotFoundError<"ELECTION"> | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @doc("List voters for a specific election")
          op listVoters(...Request.Path): Response.Response;
        }

        @route("/submit")
        namespace Submit {
          namespace Request {
            alias Path = ById.Path;

            model Body {
              election_id: Id;
              voter_code: VoterCode;
              votes: {
                position_id: Id;
                candidate_id: Id;
              }[];
            }
          }

          namespace Response {
            namespace Success {
              model VoteSubmitted {
                code: "VOTE_SUBMITTED";
              }
              alias Success = VoteSubmitted;
            }

            namespace Error {
              @error
              model VoterAlreadyVotedError {
                @statusCode _code: 400;
                code: "ERR_VOTER_ALREADY_VOTED";
              }

              alias Error =
                | NotFoundError<"VOTER">
                | VoterAlreadyVotedError
                | BadRequestError
                | UnexpectedError;
            }
            alias Response = Success.Success | Error.Error;
          }

          @post
          @doc("Submit votes for an election using a voter code.")
          op submitVoterVote(
            ...Request.Path,
            @body body: Request.Body,
          ): Response.Response;
        }
      }

      @route("/results")
      namespace Results {
        namespace Request {
          alias Path = ById.Path;
        }

        namespace Response {
          namespace Success {
            model ElectionResults {
              code: "ELECTION_RESULTS";
              data: {
                election: Election;
                total_votes: int32;
                total_voters: int32;
                positions: (Position.Position & {
                  total_votes: int32;
                  candidates: (Candidate.Candidate & {
                    votes: int32;
                    percentage: float64;
                  })[];
                })[];
              };
            }

            alias Success = ElectionResults;
          }

          namespace Error {
            alias Error = NotFoundError<"ELECTION"> | UnexpectedError;
          }

          alias Response = Success.Success | Error.Error;
        }

        @doc("Get results for a specific election")
        op getElectionResults(...Request.Path): Response.Response;
      }

      @tag("Candidate")
      @route("/candidates")
      namespace Candidate {
        model Candidate {
          id: Id;
          position_id: Id;
          name: CandidateName;
          bio: CandidateBio | null;
          image: MediaDescription | null;
          created_at: DateTime;
        }

        namespace Create {
          namespace Request {
            alias Path = ById.Path;

            model CandidatePayload {
              name: CandidateName;
              bio?: CandidateBio;
              image?: MediaDescription;
              position_id: Id;
            }

            model Body {
              candidates: CandidatePayload[];
            }
          }

          namespace Response {
            namespace Success {
              model CandidateCreated {
                code: "CANDIDATES_LIST";
                data: Candidate[];
              }

              alias Success = CandidateCreated;
            }

            namespace Error {
              alias Error =
                | NotFoundError<"ELECTION">
                | NotFoundError<"POSITION">
                | BadRequestError
                | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @post
          @doc("Create a candidate for a specific election")
          op createCandidate(
            ...Request.Path,
            @body body: Request.Body,
          ): Response.Response;
        }

        @route("/{candidateId}")
        namespace Get {
          namespace Request {
            model Path {
              ...ById.Path;

              @path
              candidateId: Id;
            }
          }

          namespace Response {
            namespace Success {
              model CandidateDetails {
                code: "CANDIDATE_DETAILS";
                data: Candidate;
              }

              alias Success = CandidateDetails;
            }

            namespace Error {
              alias Error = NotFoundError<"CANDIDATE"> | NotFoundError<"ELECTION"> | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @doc("Get details of a specific candidate")
          op getCandidateById(...Request.Path): Response.Response;
        }
      }

      @tag("Position")
      @route("/positions")
      namespace Position {
        model Position {
          id: Id;
          election_id: Id;
          title: PositionTitle;
          description: PositionDescription | null;
          created_at: DateTime;
          updated_at: DateTime | null;
        }

        namespace Create {
          namespace Request {
            alias Path = ById.Path;

            model PositionPayload {
              title: PositionTitle;
              description?: PositionDescription;
            }

            model Body {
              positions: PositionPayload[];
            }
          }

          namespace Response {
            namespace Success {
              model PositionsList {
                code: "POSITIONS_LIST";
                data: Position[];
              }

              alias Success = PositionsList;
            }

            namespace Error {
              alias Error = NotFoundError<"ELECTION"> | UnexpectedError;
            }

            alias Response = Success.Success | Error.Error;
          }

          @doc("Create a position for a specific election")
          op createPosition(
            ...Request.Path,
            @body body: Request.Body,
          ): Response.Response;
        }
      }
    }

    @route("/metrics")
    namespace Metrics {
      namespace Response {
        namespace Success {
          model ElectionMetrics {
            code: "ELECTION_METRICS";
            data: {
              total_elections: int32;
              active_elections: int32;
              completed_elections: int32;
            };
          }
          alias Success = ElectionMetrics;
        }
        namespace Error {
          alias Error = UnexpectedError;
        }
        alias Response = Success.Success | Error.Error;
      }

      @doc("Get platform-wide election metrics")
      op getPlatformElectionMetrics(): Response.Response;
    }
  }

  @tag("Storage")
  @route("/storage")
  namespace Storage {
    @route("/upload")
    namespace Upload {
      namespace Request {
        model Headers {
          @header
          contentType: "multipart/form-data";
        }

        model Body {
          files: HttpPart<ImageFile[]>;
        }
      }

      namespace Response {
        namespace Success {
          model MediaUploadSuccess {
            code: "MEDIA_UPLOADED";
            data: MediaDescription[];
          }
          alias Success = MediaUploadSuccess;
        }

        namespace Error {
          alias Error = BadRequestError | UnauthorizedError | UnexpectedError;
        }

        alias Response = Success.Success | Error.Error;
      }

      @post
      @useAuth(BearerAuth)
      @doc("Upload multiple media files")
      op uploadMedia(
        ...Request.Headers,
        @multipartBody body: Request.Body,
      ): Response.Response;
    }
  }

  namespace Pagination {
    model Options {
      page: int64;
      per_page: int64;
    }

    model Meta {
      ...Options;
      total: int64;
    }

    model Paginated<T> {
      data: T[];
      meta: Meta;
    }

    model Query {
      @query
      @minValue(1)
      page?: integer;

      @query
      @minValue(10)
      @maxValue(100)
      per_page?: integer;
    }
  }
}

