import { HttpRequest } from '@architect/functions'

/**
 * Dados relacionados ao banco de dados
 */
export namespace Tables {
  /**
   * Conjunto de chave primária para todos os dados do banco de dados
   * na tabela `gthome`.
   */
  export interface ReadonlyPrimaryKeys {
    readonly PK: string
    SK: string
  }

  /**
   * Os registros do banco de dados requerem estar em um domínio.
   */
  export const enum DomainLabels {
    User = 'User',
    Article = 'Article',
    Taxonomy = 'Taxonomy',
    Attachment = 'Attachment',
    Warehouse = 'Warehouse'
  }

  /**
   * Os possíveis tipos de registro no banco de dados
   */
  export const enum RecordKind {
    User = 'User',
    UserMetadata = 'UserMetadata',
    Photo = 'Photo',
    PhotoMetadata = 'PhotoMetadata'
  }

  export interface SecondaryKeys {
    PK1: DomainLabels
    SK1: any
  }

  export interface SparseIndexKey {
    SI: string
  }

  /**
   * As entidades gerenciadas no banco de dados
   */
  export namespace Entities {
    /**
     * Funções do usuário dentro do sistema
     */
    export const enum UserRoles {
      Super = 'Super',
      Admin = 'Admin',
      AdminWarehouse = 'AdminWarehouse',
      AdminFinancial = 'AdminFinancial',
      AdminReports = 'AdminReports',
      Dealer = 'Dealer',
      Editor = 'Editor',
      EditorAuthor = 'EditorAuthor',
      EditorContributor = 'EditorContributor',
      Customer = 'Customer',
      Guest = 'Guest'
    }
  
    /**
     * Entidade básica de um usuário
     */
    export interface User 
      extends Required<ReadonlyPrimaryKeys>, SecondaryKeys {
      readonly SK: string
      readonly PK1: DomainLabels.User
      readonly Kind: RecordKind.User
      SK1: UserRoles
      Username: string
      CPF: string
      RG: string
      Password?: string
    }

    export const enum UserMetaKeys {
      Phone = '_#userPhone',
      Whatsapp = '_#userWhatsapp',
      CV = '_#userCv',
      Role = '_#userRole',
      HasPassword = '_#userHasPassword',
      CreatedAt = '_#userCreatedAt',
      DisplayName = '_#userDisplayName',
      PasswordlessEnabled = '_#userPasswordlessEnabled',
      LastAccessAt = '_#userLastAccessAt',
      ContactBy = '_#userContact',
      Terms = '_#userTerms',
      AcceptedTermsAt = '_#userAcceptedTermsAt',
      Exclusive = '_#userExclusive'
    }

    export interface UserMeta 
      extends Required<ReadonlyPrimaryKeys>, SecondaryKeys {
      readonly SK: UserMetaKeys
      readonly PK1: DomainLabels.User
      readonly Kind: RecordKind.UserMetadata
      SK1: string
    }

    export interface Photo 
      extends Required<ReadonlyPrimaryKeys>, SecondaryKeys {
      readonly SK: string
      readonly PK1: DomainLabels.Attachment
      readonly SK1: RecordKind.Photo
      readonly Kind: RecordKind.Photo
      URI: string
      Title?: string
    }

    export const enum PhotoMetaKeys {
      Title = '_#photoTitle',
      Caption = '_#photoCaption',
      Alt = '_#photoAlt',
      Description = '_#photoDescription',
      FileName = '_#photoFilename',
      FileMimeType = '_#photoFileMimeType',
      UploadedAt = '_#photoUploadedAt',
      UploadedById = '_#photoUploadedById',
      UploadedByName = '_#photoUploadedByName'
    }

    export interface PhotoMeta 
      extends Required<ReadonlyPrimaryKeys>, SecondaryKeys {
      readonly SK: PhotoMetaKeys
      readonly PK1: DomainLabels.Attachment
      readonly Kind: RecordKind.PhotoMetadata
      SK1: string
    }
  }

  export type EntityListWithEvaluation<T> = [ T[], string | null ]
}

export namespace Events {
  /**
   * Dados recebidos pelo evento SNS como primeiro parâmetro nas funções Lambda
   * para eventos.
   */
  export interface SNSPayload {
    Records: {
      Sns: {
        Message: string
      }
    }[]
  }

  export const enum EventNames {
    OnUserCreate = 'on-user-create',
    OnUserUpdate = 'on-user-update',
    OnUserDelete = 'on-user-delete',
    DispatchEmail = 'dispatch-email'
  }

  export interface OnUserCreateMessage {
    email: string
    role: Tables.Entities.UserRoles
  }

  export const enum DispatchEmailTypes {
    dealerRequest = 'dealer_request',
    welcomeDealer = 'welcome_dealer'
  }

  export interface DispatchEmailMessage {
    // !todo: Desenvolver uma tipagem
    type: DispatchEmailTypes
    target: string
    data: any
  }
}

export namespace Http {
  export type Methods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

  export interface Headers {
    'Geisa-Thome-Id': string
    'Access-Control-Allow-Origin': string,
    'Access-Control-Allow-Methods': string,
    'Access-Control-Allow-Headers': string,
    'Content-Type': string
    'WWW-Authenticate': string
    'Last-Evaluated': string
    'Content-Location': string
    'X-Refresh-Token': string
  }

  export interface JWTPayload {
    email: string
  }

  export interface Request  extends HttpRequest {
    httpMethod: Methods
    method?: Methods

    /**
     * The absolute path of the request
     */
     path: string

     /**
     * The absolute path of the request, with resources substituted for actual path parts (e.g. /{foo}/bar)
     */
    resource: string
  
    /**
     * Any URL params, if defined in your HTTP Function's path (e.g. foo in GET /:foo/bar)
     */
    pathParameters: Record<string, string>

    /**
    * Any query params if present in the client request
    */
    queryStringParameters: Record<string, string>
 
    /**
    * All client request headers
    */
    headers: Record<string, string>
     
    /**
     * Indicates whether body is base64-encoded binary payload (will always be true if body has not null)
     */
    isBase64Encoded: boolean

    /**
     * The request body in a base64-encoded buffer. You'll need to parse request.body before you can use it, but Architect provides tools to do this - see parsing request bodies.
     */
    body: any

    /** 
    * Identificador próprio para a requisição
    */
    Id?: string

    /**
     * Função do usuário no sistema
     */
    Role?: Tables.Entities.UserRoles

    /**
    * E-mail do possível usuário autenticado
    */
    Email?: string

    /**
     * Route key
     */
    routeKey?: string
  }

  export const enum ResourceActions {
    authenticateUser = 'authenticate_user',
    createDealer = 'create_dealer',
    createPhotoAttachment = 'create_photo_attachment',
    listPhotoAttachments = 'list_photo_attachments'
  }

  export type ResponseStatuses = 
      200
    | 201
    | 202
    | 204
    | 400
    | 401
    | 403
    | 404
    | 405
    | 409
    | 500

  export interface Response {
    status?: ResponseStatuses
    body?: string|object
    error?: boolean
    headers?: Partial<Headers>
  }
}
