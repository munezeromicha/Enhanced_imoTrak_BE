
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model organizations
 * 
 */
export type organizations = $Result.DefaultSelection<Prisma.$organizationsPayload>
/**
 * Model permissions
 * 
 */
export type permissions = $Result.DefaultSelection<Prisma.$permissionsPayload>
/**
 * Model reports
 * 
 */
export type reports = $Result.DefaultSelection<Prisma.$reportsPayload>
/**
 * Model requests
 * 
 */
export type requests = $Result.DefaultSelection<Prisma.$requestsPayload>
/**
 * Model role_permissions
 * 
 */
export type role_permissions = $Result.DefaultSelection<Prisma.$role_permissionsPayload>
/**
 * Model roles
 * 
 */
export type roles = $Result.DefaultSelection<Prisma.$rolesPayload>
/**
 * Model sessions
 * 
 */
export type sessions = $Result.DefaultSelection<Prisma.$sessionsPayload>
/**
 * Model trips
 * 
 */
export type trips = $Result.DefaultSelection<Prisma.$tripsPayload>
/**
 * Model users
 * 
 */
export type users = $Result.DefaultSelection<Prisma.$usersPayload>
/**
 * Model vehicles
 * 
 */
export type vehicles = $Result.DefaultSelection<Prisma.$vehiclesPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Organizations
 * const organizations = await prisma.organizations.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Organizations
   * const organizations = await prisma.organizations.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.organizations`: Exposes CRUD operations for the **organizations** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organizations
    * const organizations = await prisma.organizations.findMany()
    * ```
    */
  get organizations(): Prisma.organizationsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.permissions`: Exposes CRUD operations for the **permissions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Permissions
    * const permissions = await prisma.permissions.findMany()
    * ```
    */
  get permissions(): Prisma.permissionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reports`: Exposes CRUD operations for the **reports** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reports
    * const reports = await prisma.reports.findMany()
    * ```
    */
  get reports(): Prisma.reportsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.requests`: Exposes CRUD operations for the **requests** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Requests
    * const requests = await prisma.requests.findMany()
    * ```
    */
  get requests(): Prisma.requestsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.role_permissions`: Exposes CRUD operations for the **role_permissions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Role_permissions
    * const role_permissions = await prisma.role_permissions.findMany()
    * ```
    */
  get role_permissions(): Prisma.role_permissionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roles`: Exposes CRUD operations for the **roles** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.roles.findMany()
    * ```
    */
  get roles(): Prisma.rolesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sessions`: Exposes CRUD operations for the **sessions** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.sessions.findMany()
    * ```
    */
  get sessions(): Prisma.sessionsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.trips`: Exposes CRUD operations for the **trips** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Trips
    * const trips = await prisma.trips.findMany()
    * ```
    */
  get trips(): Prisma.tripsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.users`: Exposes CRUD operations for the **users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.usersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vehicles`: Exposes CRUD operations for the **vehicles** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vehicles
    * const vehicles = await prisma.vehicles.findMany()
    * ```
    */
  get vehicles(): Prisma.vehiclesDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.8.2
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    organizations: 'organizations',
    permissions: 'permissions',
    reports: 'reports',
    requests: 'requests',
    role_permissions: 'role_permissions',
    roles: 'roles',
    sessions: 'sessions',
    trips: 'trips',
    users: 'users',
    vehicles: 'vehicles'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "organizations" | "permissions" | "reports" | "requests" | "role_permissions" | "roles" | "sessions" | "trips" | "users" | "vehicles"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      organizations: {
        payload: Prisma.$organizationsPayload<ExtArgs>
        fields: Prisma.organizationsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.organizationsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.organizationsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>
          }
          findFirst: {
            args: Prisma.organizationsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.organizationsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>
          }
          findMany: {
            args: Prisma.organizationsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>[]
          }
          create: {
            args: Prisma.organizationsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>
          }
          createMany: {
            args: Prisma.organizationsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.organizationsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>[]
          }
          delete: {
            args: Prisma.organizationsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>
          }
          update: {
            args: Prisma.organizationsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>
          }
          deleteMany: {
            args: Prisma.organizationsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.organizationsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.organizationsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>[]
          }
          upsert: {
            args: Prisma.organizationsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$organizationsPayload>
          }
          aggregate: {
            args: Prisma.OrganizationsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganizations>
          }
          groupBy: {
            args: Prisma.organizationsGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganizationsGroupByOutputType>[]
          }
          count: {
            args: Prisma.organizationsCountArgs<ExtArgs>
            result: $Utils.Optional<OrganizationsCountAggregateOutputType> | number
          }
        }
      }
      permissions: {
        payload: Prisma.$permissionsPayload<ExtArgs>
        fields: Prisma.permissionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.permissionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$permissionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.permissionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$permissionsPayload>
          }
          findFirst: {
            args: Prisma.permissionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$permissionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.permissionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$permissionsPayload>
          }
          findMany: {
            args: Prisma.permissionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$permissionsPayload>[]
          }
          create: {
            args: Prisma.permissionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$permissionsPayload>
          }
          createMany: {
            args: Prisma.permissionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.permissionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$permissionsPayload>[]
          }
          delete: {
            args: Prisma.permissionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$permissionsPayload>
          }
          update: {
            args: Prisma.permissionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$permissionsPayload>
          }
          deleteMany: {
            args: Prisma.permissionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.permissionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.permissionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$permissionsPayload>[]
          }
          upsert: {
            args: Prisma.permissionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$permissionsPayload>
          }
          aggregate: {
            args: Prisma.PermissionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePermissions>
          }
          groupBy: {
            args: Prisma.permissionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<PermissionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.permissionsCountArgs<ExtArgs>
            result: $Utils.Optional<PermissionsCountAggregateOutputType> | number
          }
        }
      }
      reports: {
        payload: Prisma.$reportsPayload<ExtArgs>
        fields: Prisma.reportsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.reportsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.reportsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>
          }
          findFirst: {
            args: Prisma.reportsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.reportsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>
          }
          findMany: {
            args: Prisma.reportsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>[]
          }
          create: {
            args: Prisma.reportsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>
          }
          createMany: {
            args: Prisma.reportsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.reportsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>[]
          }
          delete: {
            args: Prisma.reportsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>
          }
          update: {
            args: Prisma.reportsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>
          }
          deleteMany: {
            args: Prisma.reportsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.reportsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.reportsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>[]
          }
          upsert: {
            args: Prisma.reportsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$reportsPayload>
          }
          aggregate: {
            args: Prisma.ReportsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReports>
          }
          groupBy: {
            args: Prisma.reportsGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReportsGroupByOutputType>[]
          }
          count: {
            args: Prisma.reportsCountArgs<ExtArgs>
            result: $Utils.Optional<ReportsCountAggregateOutputType> | number
          }
        }
      }
      requests: {
        payload: Prisma.$requestsPayload<ExtArgs>
        fields: Prisma.requestsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.requestsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requestsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.requestsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requestsPayload>
          }
          findFirst: {
            args: Prisma.requestsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requestsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.requestsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requestsPayload>
          }
          findMany: {
            args: Prisma.requestsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requestsPayload>[]
          }
          create: {
            args: Prisma.requestsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requestsPayload>
          }
          createMany: {
            args: Prisma.requestsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.requestsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requestsPayload>[]
          }
          delete: {
            args: Prisma.requestsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requestsPayload>
          }
          update: {
            args: Prisma.requestsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requestsPayload>
          }
          deleteMany: {
            args: Prisma.requestsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.requestsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.requestsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requestsPayload>[]
          }
          upsert: {
            args: Prisma.requestsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$requestsPayload>
          }
          aggregate: {
            args: Prisma.RequestsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRequests>
          }
          groupBy: {
            args: Prisma.requestsGroupByArgs<ExtArgs>
            result: $Utils.Optional<RequestsGroupByOutputType>[]
          }
          count: {
            args: Prisma.requestsCountArgs<ExtArgs>
            result: $Utils.Optional<RequestsCountAggregateOutputType> | number
          }
        }
      }
      role_permissions: {
        payload: Prisma.$role_permissionsPayload<ExtArgs>
        fields: Prisma.role_permissionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.role_permissionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$role_permissionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.role_permissionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$role_permissionsPayload>
          }
          findFirst: {
            args: Prisma.role_permissionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$role_permissionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.role_permissionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$role_permissionsPayload>
          }
          findMany: {
            args: Prisma.role_permissionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$role_permissionsPayload>[]
          }
          create: {
            args: Prisma.role_permissionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$role_permissionsPayload>
          }
          createMany: {
            args: Prisma.role_permissionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.role_permissionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$role_permissionsPayload>[]
          }
          delete: {
            args: Prisma.role_permissionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$role_permissionsPayload>
          }
          update: {
            args: Prisma.role_permissionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$role_permissionsPayload>
          }
          deleteMany: {
            args: Prisma.role_permissionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.role_permissionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.role_permissionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$role_permissionsPayload>[]
          }
          upsert: {
            args: Prisma.role_permissionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$role_permissionsPayload>
          }
          aggregate: {
            args: Prisma.Role_permissionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole_permissions>
          }
          groupBy: {
            args: Prisma.role_permissionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Role_permissionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.role_permissionsCountArgs<ExtArgs>
            result: $Utils.Optional<Role_permissionsCountAggregateOutputType> | number
          }
        }
      }
      roles: {
        payload: Prisma.$rolesPayload<ExtArgs>
        fields: Prisma.rolesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.rolesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.rolesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>
          }
          findFirst: {
            args: Prisma.rolesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.rolesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>
          }
          findMany: {
            args: Prisma.rolesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>[]
          }
          create: {
            args: Prisma.rolesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>
          }
          createMany: {
            args: Prisma.rolesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.rolesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>[]
          }
          delete: {
            args: Prisma.rolesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>
          }
          update: {
            args: Prisma.rolesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>
          }
          deleteMany: {
            args: Prisma.rolesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.rolesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.rolesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>[]
          }
          upsert: {
            args: Prisma.rolesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$rolesPayload>
          }
          aggregate: {
            args: Prisma.RolesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoles>
          }
          groupBy: {
            args: Prisma.rolesGroupByArgs<ExtArgs>
            result: $Utils.Optional<RolesGroupByOutputType>[]
          }
          count: {
            args: Prisma.rolesCountArgs<ExtArgs>
            result: $Utils.Optional<RolesCountAggregateOutputType> | number
          }
        }
      }
      sessions: {
        payload: Prisma.$sessionsPayload<ExtArgs>
        fields: Prisma.sessionsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.sessionsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.sessionsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionsPayload>
          }
          findFirst: {
            args: Prisma.sessionsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.sessionsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionsPayload>
          }
          findMany: {
            args: Prisma.sessionsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionsPayload>[]
          }
          create: {
            args: Prisma.sessionsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionsPayload>
          }
          createMany: {
            args: Prisma.sessionsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.sessionsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionsPayload>[]
          }
          delete: {
            args: Prisma.sessionsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionsPayload>
          }
          update: {
            args: Prisma.sessionsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionsPayload>
          }
          deleteMany: {
            args: Prisma.sessionsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.sessionsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.sessionsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionsPayload>[]
          }
          upsert: {
            args: Prisma.sessionsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$sessionsPayload>
          }
          aggregate: {
            args: Prisma.SessionsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSessions>
          }
          groupBy: {
            args: Prisma.sessionsGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionsGroupByOutputType>[]
          }
          count: {
            args: Prisma.sessionsCountArgs<ExtArgs>
            result: $Utils.Optional<SessionsCountAggregateOutputType> | number
          }
        }
      }
      trips: {
        payload: Prisma.$tripsPayload<ExtArgs>
        fields: Prisma.tripsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tripsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tripsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tripsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tripsPayload>
          }
          findFirst: {
            args: Prisma.tripsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tripsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tripsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tripsPayload>
          }
          findMany: {
            args: Prisma.tripsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tripsPayload>[]
          }
          create: {
            args: Prisma.tripsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tripsPayload>
          }
          createMany: {
            args: Prisma.tripsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.tripsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tripsPayload>[]
          }
          delete: {
            args: Prisma.tripsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tripsPayload>
          }
          update: {
            args: Prisma.tripsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tripsPayload>
          }
          deleteMany: {
            args: Prisma.tripsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.tripsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.tripsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tripsPayload>[]
          }
          upsert: {
            args: Prisma.tripsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tripsPayload>
          }
          aggregate: {
            args: Prisma.TripsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrips>
          }
          groupBy: {
            args: Prisma.tripsGroupByArgs<ExtArgs>
            result: $Utils.Optional<TripsGroupByOutputType>[]
          }
          count: {
            args: Prisma.tripsCountArgs<ExtArgs>
            result: $Utils.Optional<TripsCountAggregateOutputType> | number
          }
        }
      }
      users: {
        payload: Prisma.$usersPayload<ExtArgs>
        fields: Prisma.usersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.usersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findFirst: {
            args: Prisma.usersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          findMany: {
            args: Prisma.usersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          create: {
            args: Prisma.usersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          createMany: {
            args: Prisma.usersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.usersCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          delete: {
            args: Prisma.usersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          update: {
            args: Prisma.usersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          deleteMany: {
            args: Prisma.usersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.usersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.usersUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[]
          }
          upsert: {
            args: Prisma.usersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.usersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.usersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
      vehicles: {
        payload: Prisma.$vehiclesPayload<ExtArgs>
        fields: Prisma.vehiclesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.vehiclesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehiclesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.vehiclesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehiclesPayload>
          }
          findFirst: {
            args: Prisma.vehiclesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehiclesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.vehiclesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehiclesPayload>
          }
          findMany: {
            args: Prisma.vehiclesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehiclesPayload>[]
          }
          create: {
            args: Prisma.vehiclesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehiclesPayload>
          }
          createMany: {
            args: Prisma.vehiclesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.vehiclesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehiclesPayload>[]
          }
          delete: {
            args: Prisma.vehiclesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehiclesPayload>
          }
          update: {
            args: Prisma.vehiclesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehiclesPayload>
          }
          deleteMany: {
            args: Prisma.vehiclesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.vehiclesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.vehiclesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehiclesPayload>[]
          }
          upsert: {
            args: Prisma.vehiclesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$vehiclesPayload>
          }
          aggregate: {
            args: Prisma.VehiclesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVehicles>
          }
          groupBy: {
            args: Prisma.vehiclesGroupByArgs<ExtArgs>
            result: $Utils.Optional<VehiclesGroupByOutputType>[]
          }
          count: {
            args: Prisma.vehiclesCountArgs<ExtArgs>
            result: $Utils.Optional<VehiclesCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    organizations?: organizationsOmit
    permissions?: permissionsOmit
    reports?: reportsOmit
    requests?: requestsOmit
    role_permissions?: role_permissionsOmit
    roles?: rolesOmit
    sessions?: sessionsOmit
    trips?: tripsOmit
    users?: usersOmit
    vehicles?: vehiclesOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type OrganizationsCountOutputType
   */

  export type OrganizationsCountOutputType = {
    reports: number
    users: number
    vehicles: number
  }

  export type OrganizationsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reports?: boolean | OrganizationsCountOutputTypeCountReportsArgs
    users?: boolean | OrganizationsCountOutputTypeCountUsersArgs
    vehicles?: boolean | OrganizationsCountOutputTypeCountVehiclesArgs
  }

  // Custom InputTypes
  /**
   * OrganizationsCountOutputType without action
   */
  export type OrganizationsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationsCountOutputType
     */
    select?: OrganizationsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrganizationsCountOutputType without action
   */
  export type OrganizationsCountOutputTypeCountReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: reportsWhereInput
  }

  /**
   * OrganizationsCountOutputType without action
   */
  export type OrganizationsCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
  }

  /**
   * OrganizationsCountOutputType without action
   */
  export type OrganizationsCountOutputTypeCountVehiclesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: vehiclesWhereInput
  }


  /**
   * Count Type PermissionsCountOutputType
   */

  export type PermissionsCountOutputType = {
    role_permissions: number
  }

  export type PermissionsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role_permissions?: boolean | PermissionsCountOutputTypeCountRole_permissionsArgs
  }

  // Custom InputTypes
  /**
   * PermissionsCountOutputType without action
   */
  export type PermissionsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PermissionsCountOutputType
     */
    select?: PermissionsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PermissionsCountOutputType without action
   */
  export type PermissionsCountOutputTypeCountRole_permissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: role_permissionsWhereInput
  }


  /**
   * Count Type RequestsCountOutputType
   */

  export type RequestsCountOutputType = {
    trips: number
  }

  export type RequestsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trips?: boolean | RequestsCountOutputTypeCountTripsArgs
  }

  // Custom InputTypes
  /**
   * RequestsCountOutputType without action
   */
  export type RequestsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestsCountOutputType
     */
    select?: RequestsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RequestsCountOutputType without action
   */
  export type RequestsCountOutputTypeCountTripsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tripsWhereInput
  }


  /**
   * Count Type RolesCountOutputType
   */

  export type RolesCountOutputType = {
    role_permissions: number
    users: number
  }

  export type RolesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role_permissions?: boolean | RolesCountOutputTypeCountRole_permissionsArgs
    users?: boolean | RolesCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * RolesCountOutputType without action
   */
  export type RolesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolesCountOutputType
     */
    select?: RolesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RolesCountOutputType without action
   */
  export type RolesCountOutputTypeCountRole_permissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: role_permissionsWhereInput
  }

  /**
   * RolesCountOutputType without action
   */
  export type RolesCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
  }


  /**
   * Count Type UsersCountOutputType
   */

  export type UsersCountOutputType = {
    reports: number
    requests_requests_requester_idTousers: number
    requests_requests_reviewed_byTousers: number
    sessions: number
    trips: number
  }

  export type UsersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reports?: boolean | UsersCountOutputTypeCountReportsArgs
    requests_requests_requester_idTousers?: boolean | UsersCountOutputTypeCountRequests_requests_requester_idTousersArgs
    requests_requests_reviewed_byTousers?: boolean | UsersCountOutputTypeCountRequests_requests_reviewed_byTousersArgs
    sessions?: boolean | UsersCountOutputTypeCountSessionsArgs
    trips?: boolean | UsersCountOutputTypeCountTripsArgs
  }

  // Custom InputTypes
  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsersCountOutputType
     */
    select?: UsersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: reportsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountRequests_requests_requester_idTousersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: requestsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountRequests_requests_reviewed_byTousersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: requestsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sessionsWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountTripsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tripsWhereInput
  }


  /**
   * Count Type VehiclesCountOutputType
   */

  export type VehiclesCountOutputType = {
    requests: number
    trips: number
  }

  export type VehiclesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requests?: boolean | VehiclesCountOutputTypeCountRequestsArgs
    trips?: boolean | VehiclesCountOutputTypeCountTripsArgs
  }

  // Custom InputTypes
  /**
   * VehiclesCountOutputType without action
   */
  export type VehiclesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehiclesCountOutputType
     */
    select?: VehiclesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VehiclesCountOutputType without action
   */
  export type VehiclesCountOutputTypeCountRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: requestsWhereInput
  }

  /**
   * VehiclesCountOutputType without action
   */
  export type VehiclesCountOutputTypeCountTripsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tripsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model organizations
   */

  export type AggregateOrganizations = {
    _count: OrganizationsCountAggregateOutputType | null
    _min: OrganizationsMinAggregateOutputType | null
    _max: OrganizationsMaxAggregateOutputType | null
  }

  export type OrganizationsMinAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    phone: string | null
    email: string | null
    created_at: Date | null
  }

  export type OrganizationsMaxAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    phone: string | null
    email: string | null
    created_at: Date | null
  }

  export type OrganizationsCountAggregateOutputType = {
    id: number
    name: number
    address: number
    phone: number
    email: number
    created_at: number
    _all: number
  }


  export type OrganizationsMinAggregateInputType = {
    id?: true
    name?: true
    address?: true
    phone?: true
    email?: true
    created_at?: true
  }

  export type OrganizationsMaxAggregateInputType = {
    id?: true
    name?: true
    address?: true
    phone?: true
    email?: true
    created_at?: true
  }

  export type OrganizationsCountAggregateInputType = {
    id?: true
    name?: true
    address?: true
    phone?: true
    email?: true
    created_at?: true
    _all?: true
  }

  export type OrganizationsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which organizations to aggregate.
     */
    where?: organizationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organizations to fetch.
     */
    orderBy?: organizationsOrderByWithRelationInput | organizationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: organizationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned organizations
    **/
    _count?: true | OrganizationsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganizationsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganizationsMaxAggregateInputType
  }

  export type GetOrganizationsAggregateType<T extends OrganizationsAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganizations]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganizations[P]>
      : GetScalarType<T[P], AggregateOrganizations[P]>
  }




  export type organizationsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: organizationsWhereInput
    orderBy?: organizationsOrderByWithAggregationInput | organizationsOrderByWithAggregationInput[]
    by: OrganizationsScalarFieldEnum[] | OrganizationsScalarFieldEnum
    having?: organizationsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganizationsCountAggregateInputType | true
    _min?: OrganizationsMinAggregateInputType
    _max?: OrganizationsMaxAggregateInputType
  }

  export type OrganizationsGroupByOutputType = {
    id: string
    name: string
    address: string
    phone: string
    email: string
    created_at: Date
    _count: OrganizationsCountAggregateOutputType | null
    _min: OrganizationsMinAggregateOutputType | null
    _max: OrganizationsMaxAggregateOutputType | null
  }

  type GetOrganizationsGroupByPayload<T extends organizationsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganizationsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganizationsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganizationsGroupByOutputType[P]>
            : GetScalarType<T[P], OrganizationsGroupByOutputType[P]>
        }
      >
    >


  export type organizationsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    phone?: boolean
    email?: boolean
    created_at?: boolean
    reports?: boolean | organizations$reportsArgs<ExtArgs>
    users?: boolean | organizations$usersArgs<ExtArgs>
    vehicles?: boolean | organizations$vehiclesArgs<ExtArgs>
    _count?: boolean | OrganizationsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organizations"]>

  export type organizationsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    phone?: boolean
    email?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["organizations"]>

  export type organizationsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    phone?: boolean
    email?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["organizations"]>

  export type organizationsSelectScalar = {
    id?: boolean
    name?: boolean
    address?: boolean
    phone?: boolean
    email?: boolean
    created_at?: boolean
  }

  export type organizationsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "address" | "phone" | "email" | "created_at", ExtArgs["result"]["organizations"]>
  export type organizationsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reports?: boolean | organizations$reportsArgs<ExtArgs>
    users?: boolean | organizations$usersArgs<ExtArgs>
    vehicles?: boolean | organizations$vehiclesArgs<ExtArgs>
    _count?: boolean | OrganizationsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type organizationsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type organizationsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $organizationsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "organizations"
    objects: {
      reports: Prisma.$reportsPayload<ExtArgs>[]
      users: Prisma.$usersPayload<ExtArgs>[]
      vehicles: Prisma.$vehiclesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      address: string
      phone: string
      email: string
      created_at: Date
    }, ExtArgs["result"]["organizations"]>
    composites: {}
  }

  type organizationsGetPayload<S extends boolean | null | undefined | organizationsDefaultArgs> = $Result.GetResult<Prisma.$organizationsPayload, S>

  type organizationsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<organizationsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrganizationsCountAggregateInputType | true
    }

  export interface organizationsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['organizations'], meta: { name: 'organizations' } }
    /**
     * Find zero or one Organizations that matches the filter.
     * @param {organizationsFindUniqueArgs} args - Arguments to find a Organizations
     * @example
     * // Get one Organizations
     * const organizations = await prisma.organizations.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends organizationsFindUniqueArgs>(args: SelectSubset<T, organizationsFindUniqueArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Organizations that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {organizationsFindUniqueOrThrowArgs} args - Arguments to find a Organizations
     * @example
     * // Get one Organizations
     * const organizations = await prisma.organizations.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends organizationsFindUniqueOrThrowArgs>(args: SelectSubset<T, organizationsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organizations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organizationsFindFirstArgs} args - Arguments to find a Organizations
     * @example
     * // Get one Organizations
     * const organizations = await prisma.organizations.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends organizationsFindFirstArgs>(args?: SelectSubset<T, organizationsFindFirstArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organizations that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organizationsFindFirstOrThrowArgs} args - Arguments to find a Organizations
     * @example
     * // Get one Organizations
     * const organizations = await prisma.organizations.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends organizationsFindFirstOrThrowArgs>(args?: SelectSubset<T, organizationsFindFirstOrThrowArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Organizations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organizationsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Organizations
     * const organizations = await prisma.organizations.findMany()
     * 
     * // Get first 10 Organizations
     * const organizations = await prisma.organizations.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organizationsWithIdOnly = await prisma.organizations.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends organizationsFindManyArgs>(args?: SelectSubset<T, organizationsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Organizations.
     * @param {organizationsCreateArgs} args - Arguments to create a Organizations.
     * @example
     * // Create one Organizations
     * const Organizations = await prisma.organizations.create({
     *   data: {
     *     // ... data to create a Organizations
     *   }
     * })
     * 
     */
    create<T extends organizationsCreateArgs>(args: SelectSubset<T, organizationsCreateArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Organizations.
     * @param {organizationsCreateManyArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organizations = await prisma.organizations.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends organizationsCreateManyArgs>(args?: SelectSubset<T, organizationsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Organizations and returns the data saved in the database.
     * @param {organizationsCreateManyAndReturnArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organizations = await prisma.organizations.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Organizations and only return the `id`
     * const organizationsWithIdOnly = await prisma.organizations.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends organizationsCreateManyAndReturnArgs>(args?: SelectSubset<T, organizationsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Organizations.
     * @param {organizationsDeleteArgs} args - Arguments to delete one Organizations.
     * @example
     * // Delete one Organizations
     * const Organizations = await prisma.organizations.delete({
     *   where: {
     *     // ... filter to delete one Organizations
     *   }
     * })
     * 
     */
    delete<T extends organizationsDeleteArgs>(args: SelectSubset<T, organizationsDeleteArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Organizations.
     * @param {organizationsUpdateArgs} args - Arguments to update one Organizations.
     * @example
     * // Update one Organizations
     * const organizations = await prisma.organizations.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends organizationsUpdateArgs>(args: SelectSubset<T, organizationsUpdateArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Organizations.
     * @param {organizationsDeleteManyArgs} args - Arguments to filter Organizations to delete.
     * @example
     * // Delete a few Organizations
     * const { count } = await prisma.organizations.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends organizationsDeleteManyArgs>(args?: SelectSubset<T, organizationsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organizationsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Organizations
     * const organizations = await prisma.organizations.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends organizationsUpdateManyArgs>(args: SelectSubset<T, organizationsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations and returns the data updated in the database.
     * @param {organizationsUpdateManyAndReturnArgs} args - Arguments to update many Organizations.
     * @example
     * // Update many Organizations
     * const organizations = await prisma.organizations.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Organizations and only return the `id`
     * const organizationsWithIdOnly = await prisma.organizations.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends organizationsUpdateManyAndReturnArgs>(args: SelectSubset<T, organizationsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Organizations.
     * @param {organizationsUpsertArgs} args - Arguments to update or create a Organizations.
     * @example
     * // Update or create a Organizations
     * const organizations = await prisma.organizations.upsert({
     *   create: {
     *     // ... data to create a Organizations
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Organizations we want to update
     *   }
     * })
     */
    upsert<T extends organizationsUpsertArgs>(args: SelectSubset<T, organizationsUpsertArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organizationsCountArgs} args - Arguments to filter Organizations to count.
     * @example
     * // Count the number of Organizations
     * const count = await prisma.organizations.count({
     *   where: {
     *     // ... the filter for the Organizations we want to count
     *   }
     * })
    **/
    count<T extends organizationsCountArgs>(
      args?: Subset<T, organizationsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganizationsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrganizationsAggregateArgs>(args: Subset<T, OrganizationsAggregateArgs>): Prisma.PrismaPromise<GetOrganizationsAggregateType<T>>

    /**
     * Group by Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {organizationsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends organizationsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: organizationsGroupByArgs['orderBy'] }
        : { orderBy?: organizationsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, organizationsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizationsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the organizations model
   */
  readonly fields: organizationsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for organizations.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__organizationsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reports<T extends organizations$reportsArgs<ExtArgs> = {}>(args?: Subset<T, organizations$reportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    users<T extends organizations$usersArgs<ExtArgs> = {}>(args?: Subset<T, organizations$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    vehicles<T extends organizations$vehiclesArgs<ExtArgs> = {}>(args?: Subset<T, organizations$vehiclesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the organizations model
   */
  interface organizationsFieldRefs {
    readonly id: FieldRef<"organizations", 'String'>
    readonly name: FieldRef<"organizations", 'String'>
    readonly address: FieldRef<"organizations", 'String'>
    readonly phone: FieldRef<"organizations", 'String'>
    readonly email: FieldRef<"organizations", 'String'>
    readonly created_at: FieldRef<"organizations", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * organizations findUnique
   */
  export type organizationsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * Filter, which organizations to fetch.
     */
    where: organizationsWhereUniqueInput
  }

  /**
   * organizations findUniqueOrThrow
   */
  export type organizationsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * Filter, which organizations to fetch.
     */
    where: organizationsWhereUniqueInput
  }

  /**
   * organizations findFirst
   */
  export type organizationsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * Filter, which organizations to fetch.
     */
    where?: organizationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organizations to fetch.
     */
    orderBy?: organizationsOrderByWithRelationInput | organizationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for organizations.
     */
    cursor?: organizationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of organizations.
     */
    distinct?: OrganizationsScalarFieldEnum | OrganizationsScalarFieldEnum[]
  }

  /**
   * organizations findFirstOrThrow
   */
  export type organizationsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * Filter, which organizations to fetch.
     */
    where?: organizationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organizations to fetch.
     */
    orderBy?: organizationsOrderByWithRelationInput | organizationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for organizations.
     */
    cursor?: organizationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of organizations.
     */
    distinct?: OrganizationsScalarFieldEnum | OrganizationsScalarFieldEnum[]
  }

  /**
   * organizations findMany
   */
  export type organizationsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * Filter, which organizations to fetch.
     */
    where?: organizationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of organizations to fetch.
     */
    orderBy?: organizationsOrderByWithRelationInput | organizationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing organizations.
     */
    cursor?: organizationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` organizations.
     */
    skip?: number
    distinct?: OrganizationsScalarFieldEnum | OrganizationsScalarFieldEnum[]
  }

  /**
   * organizations create
   */
  export type organizationsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * The data needed to create a organizations.
     */
    data: XOR<organizationsCreateInput, organizationsUncheckedCreateInput>
  }

  /**
   * organizations createMany
   */
  export type organizationsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many organizations.
     */
    data: organizationsCreateManyInput | organizationsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * organizations createManyAndReturn
   */
  export type organizationsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * The data used to create many organizations.
     */
    data: organizationsCreateManyInput | organizationsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * organizations update
   */
  export type organizationsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * The data needed to update a organizations.
     */
    data: XOR<organizationsUpdateInput, organizationsUncheckedUpdateInput>
    /**
     * Choose, which organizations to update.
     */
    where: organizationsWhereUniqueInput
  }

  /**
   * organizations updateMany
   */
  export type organizationsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update organizations.
     */
    data: XOR<organizationsUpdateManyMutationInput, organizationsUncheckedUpdateManyInput>
    /**
     * Filter which organizations to update
     */
    where?: organizationsWhereInput
    /**
     * Limit how many organizations to update.
     */
    limit?: number
  }

  /**
   * organizations updateManyAndReturn
   */
  export type organizationsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * The data used to update organizations.
     */
    data: XOR<organizationsUpdateManyMutationInput, organizationsUncheckedUpdateManyInput>
    /**
     * Filter which organizations to update
     */
    where?: organizationsWhereInput
    /**
     * Limit how many organizations to update.
     */
    limit?: number
  }

  /**
   * organizations upsert
   */
  export type organizationsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * The filter to search for the organizations to update in case it exists.
     */
    where: organizationsWhereUniqueInput
    /**
     * In case the organizations found by the `where` argument doesn't exist, create a new organizations with this data.
     */
    create: XOR<organizationsCreateInput, organizationsUncheckedCreateInput>
    /**
     * In case the organizations was found with the provided `where` argument, update it with this data.
     */
    update: XOR<organizationsUpdateInput, organizationsUncheckedUpdateInput>
  }

  /**
   * organizations delete
   */
  export type organizationsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
    /**
     * Filter which organizations to delete.
     */
    where: organizationsWhereUniqueInput
  }

  /**
   * organizations deleteMany
   */
  export type organizationsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which organizations to delete
     */
    where?: organizationsWhereInput
    /**
     * Limit how many organizations to delete.
     */
    limit?: number
  }

  /**
   * organizations.reports
   */
  export type organizations$reportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    where?: reportsWhereInput
    orderBy?: reportsOrderByWithRelationInput | reportsOrderByWithRelationInput[]
    cursor?: reportsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReportsScalarFieldEnum | ReportsScalarFieldEnum[]
  }

  /**
   * organizations.users
   */
  export type organizations$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    where?: usersWhereInput
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    cursor?: usersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * organizations.vehicles
   */
  export type organizations$vehiclesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicles
     */
    select?: vehiclesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicles
     */
    omit?: vehiclesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehiclesInclude<ExtArgs> | null
    where?: vehiclesWhereInput
    orderBy?: vehiclesOrderByWithRelationInput | vehiclesOrderByWithRelationInput[]
    cursor?: vehiclesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VehiclesScalarFieldEnum | VehiclesScalarFieldEnum[]
  }

  /**
   * organizations without action
   */
  export type organizationsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the organizations
     */
    select?: organizationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the organizations
     */
    omit?: organizationsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: organizationsInclude<ExtArgs> | null
  }


  /**
   * Model permissions
   */

  export type AggregatePermissions = {
    _count: PermissionsCountAggregateOutputType | null
    _min: PermissionsMinAggregateOutputType | null
    _max: PermissionsMaxAggregateOutputType | null
  }

  export type PermissionsMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
  }

  export type PermissionsMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
  }

  export type PermissionsCountAggregateOutputType = {
    id: number
    name: number
    description: number
    _all: number
  }


  export type PermissionsMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
  }

  export type PermissionsMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
  }

  export type PermissionsCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    _all?: true
  }

  export type PermissionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which permissions to aggregate.
     */
    where?: permissionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of permissions to fetch.
     */
    orderBy?: permissionsOrderByWithRelationInput | permissionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: permissionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned permissions
    **/
    _count?: true | PermissionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PermissionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PermissionsMaxAggregateInputType
  }

  export type GetPermissionsAggregateType<T extends PermissionsAggregateArgs> = {
        [P in keyof T & keyof AggregatePermissions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePermissions[P]>
      : GetScalarType<T[P], AggregatePermissions[P]>
  }




  export type permissionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: permissionsWhereInput
    orderBy?: permissionsOrderByWithAggregationInput | permissionsOrderByWithAggregationInput[]
    by: PermissionsScalarFieldEnum[] | PermissionsScalarFieldEnum
    having?: permissionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PermissionsCountAggregateInputType | true
    _min?: PermissionsMinAggregateInputType
    _max?: PermissionsMaxAggregateInputType
  }

  export type PermissionsGroupByOutputType = {
    id: string
    name: string
    description: string | null
    _count: PermissionsCountAggregateOutputType | null
    _min: PermissionsMinAggregateOutputType | null
    _max: PermissionsMaxAggregateOutputType | null
  }

  type GetPermissionsGroupByPayload<T extends permissionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PermissionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PermissionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PermissionsGroupByOutputType[P]>
            : GetScalarType<T[P], PermissionsGroupByOutputType[P]>
        }
      >
    >


  export type permissionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    role_permissions?: boolean | permissions$role_permissionsArgs<ExtArgs>
    _count?: boolean | PermissionsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["permissions"]>

  export type permissionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
  }, ExtArgs["result"]["permissions"]>

  export type permissionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
  }, ExtArgs["result"]["permissions"]>

  export type permissionsSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
  }

  export type permissionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description", ExtArgs["result"]["permissions"]>
  export type permissionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role_permissions?: boolean | permissions$role_permissionsArgs<ExtArgs>
    _count?: boolean | PermissionsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type permissionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type permissionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $permissionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "permissions"
    objects: {
      role_permissions: Prisma.$role_permissionsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
    }, ExtArgs["result"]["permissions"]>
    composites: {}
  }

  type permissionsGetPayload<S extends boolean | null | undefined | permissionsDefaultArgs> = $Result.GetResult<Prisma.$permissionsPayload, S>

  type permissionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<permissionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PermissionsCountAggregateInputType | true
    }

  export interface permissionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['permissions'], meta: { name: 'permissions' } }
    /**
     * Find zero or one Permissions that matches the filter.
     * @param {permissionsFindUniqueArgs} args - Arguments to find a Permissions
     * @example
     * // Get one Permissions
     * const permissions = await prisma.permissions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends permissionsFindUniqueArgs>(args: SelectSubset<T, permissionsFindUniqueArgs<ExtArgs>>): Prisma__permissionsClient<$Result.GetResult<Prisma.$permissionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Permissions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {permissionsFindUniqueOrThrowArgs} args - Arguments to find a Permissions
     * @example
     * // Get one Permissions
     * const permissions = await prisma.permissions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends permissionsFindUniqueOrThrowArgs>(args: SelectSubset<T, permissionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__permissionsClient<$Result.GetResult<Prisma.$permissionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Permissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {permissionsFindFirstArgs} args - Arguments to find a Permissions
     * @example
     * // Get one Permissions
     * const permissions = await prisma.permissions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends permissionsFindFirstArgs>(args?: SelectSubset<T, permissionsFindFirstArgs<ExtArgs>>): Prisma__permissionsClient<$Result.GetResult<Prisma.$permissionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Permissions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {permissionsFindFirstOrThrowArgs} args - Arguments to find a Permissions
     * @example
     * // Get one Permissions
     * const permissions = await prisma.permissions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends permissionsFindFirstOrThrowArgs>(args?: SelectSubset<T, permissionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__permissionsClient<$Result.GetResult<Prisma.$permissionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Permissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {permissionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Permissions
     * const permissions = await prisma.permissions.findMany()
     * 
     * // Get first 10 Permissions
     * const permissions = await prisma.permissions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const permissionsWithIdOnly = await prisma.permissions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends permissionsFindManyArgs>(args?: SelectSubset<T, permissionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$permissionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Permissions.
     * @param {permissionsCreateArgs} args - Arguments to create a Permissions.
     * @example
     * // Create one Permissions
     * const Permissions = await prisma.permissions.create({
     *   data: {
     *     // ... data to create a Permissions
     *   }
     * })
     * 
     */
    create<T extends permissionsCreateArgs>(args: SelectSubset<T, permissionsCreateArgs<ExtArgs>>): Prisma__permissionsClient<$Result.GetResult<Prisma.$permissionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Permissions.
     * @param {permissionsCreateManyArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permissions = await prisma.permissions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends permissionsCreateManyArgs>(args?: SelectSubset<T, permissionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Permissions and returns the data saved in the database.
     * @param {permissionsCreateManyAndReturnArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permissions = await prisma.permissions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Permissions and only return the `id`
     * const permissionsWithIdOnly = await prisma.permissions.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends permissionsCreateManyAndReturnArgs>(args?: SelectSubset<T, permissionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$permissionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Permissions.
     * @param {permissionsDeleteArgs} args - Arguments to delete one Permissions.
     * @example
     * // Delete one Permissions
     * const Permissions = await prisma.permissions.delete({
     *   where: {
     *     // ... filter to delete one Permissions
     *   }
     * })
     * 
     */
    delete<T extends permissionsDeleteArgs>(args: SelectSubset<T, permissionsDeleteArgs<ExtArgs>>): Prisma__permissionsClient<$Result.GetResult<Prisma.$permissionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Permissions.
     * @param {permissionsUpdateArgs} args - Arguments to update one Permissions.
     * @example
     * // Update one Permissions
     * const permissions = await prisma.permissions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends permissionsUpdateArgs>(args: SelectSubset<T, permissionsUpdateArgs<ExtArgs>>): Prisma__permissionsClient<$Result.GetResult<Prisma.$permissionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Permissions.
     * @param {permissionsDeleteManyArgs} args - Arguments to filter Permissions to delete.
     * @example
     * // Delete a few Permissions
     * const { count } = await prisma.permissions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends permissionsDeleteManyArgs>(args?: SelectSubset<T, permissionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {permissionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Permissions
     * const permissions = await prisma.permissions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends permissionsUpdateManyArgs>(args: SelectSubset<T, permissionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Permissions and returns the data updated in the database.
     * @param {permissionsUpdateManyAndReturnArgs} args - Arguments to update many Permissions.
     * @example
     * // Update many Permissions
     * const permissions = await prisma.permissions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Permissions and only return the `id`
     * const permissionsWithIdOnly = await prisma.permissions.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends permissionsUpdateManyAndReturnArgs>(args: SelectSubset<T, permissionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$permissionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Permissions.
     * @param {permissionsUpsertArgs} args - Arguments to update or create a Permissions.
     * @example
     * // Update or create a Permissions
     * const permissions = await prisma.permissions.upsert({
     *   create: {
     *     // ... data to create a Permissions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Permissions we want to update
     *   }
     * })
     */
    upsert<T extends permissionsUpsertArgs>(args: SelectSubset<T, permissionsUpsertArgs<ExtArgs>>): Prisma__permissionsClient<$Result.GetResult<Prisma.$permissionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {permissionsCountArgs} args - Arguments to filter Permissions to count.
     * @example
     * // Count the number of Permissions
     * const count = await prisma.permissions.count({
     *   where: {
     *     // ... the filter for the Permissions we want to count
     *   }
     * })
    **/
    count<T extends permissionsCountArgs>(
      args?: Subset<T, permissionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PermissionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PermissionsAggregateArgs>(args: Subset<T, PermissionsAggregateArgs>): Prisma.PrismaPromise<GetPermissionsAggregateType<T>>

    /**
     * Group by Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {permissionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends permissionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: permissionsGroupByArgs['orderBy'] }
        : { orderBy?: permissionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, permissionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPermissionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the permissions model
   */
  readonly fields: permissionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for permissions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__permissionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role_permissions<T extends permissions$role_permissionsArgs<ExtArgs> = {}>(args?: Subset<T, permissions$role_permissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$role_permissionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the permissions model
   */
  interface permissionsFieldRefs {
    readonly id: FieldRef<"permissions", 'String'>
    readonly name: FieldRef<"permissions", 'String'>
    readonly description: FieldRef<"permissions", 'String'>
  }
    

  // Custom InputTypes
  /**
   * permissions findUnique
   */
  export type permissionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the permissions
     */
    select?: permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the permissions
     */
    omit?: permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: permissionsInclude<ExtArgs> | null
    /**
     * Filter, which permissions to fetch.
     */
    where: permissionsWhereUniqueInput
  }

  /**
   * permissions findUniqueOrThrow
   */
  export type permissionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the permissions
     */
    select?: permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the permissions
     */
    omit?: permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: permissionsInclude<ExtArgs> | null
    /**
     * Filter, which permissions to fetch.
     */
    where: permissionsWhereUniqueInput
  }

  /**
   * permissions findFirst
   */
  export type permissionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the permissions
     */
    select?: permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the permissions
     */
    omit?: permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: permissionsInclude<ExtArgs> | null
    /**
     * Filter, which permissions to fetch.
     */
    where?: permissionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of permissions to fetch.
     */
    orderBy?: permissionsOrderByWithRelationInput | permissionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for permissions.
     */
    cursor?: permissionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of permissions.
     */
    distinct?: PermissionsScalarFieldEnum | PermissionsScalarFieldEnum[]
  }

  /**
   * permissions findFirstOrThrow
   */
  export type permissionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the permissions
     */
    select?: permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the permissions
     */
    omit?: permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: permissionsInclude<ExtArgs> | null
    /**
     * Filter, which permissions to fetch.
     */
    where?: permissionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of permissions to fetch.
     */
    orderBy?: permissionsOrderByWithRelationInput | permissionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for permissions.
     */
    cursor?: permissionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of permissions.
     */
    distinct?: PermissionsScalarFieldEnum | PermissionsScalarFieldEnum[]
  }

  /**
   * permissions findMany
   */
  export type permissionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the permissions
     */
    select?: permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the permissions
     */
    omit?: permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: permissionsInclude<ExtArgs> | null
    /**
     * Filter, which permissions to fetch.
     */
    where?: permissionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of permissions to fetch.
     */
    orderBy?: permissionsOrderByWithRelationInput | permissionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing permissions.
     */
    cursor?: permissionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` permissions.
     */
    skip?: number
    distinct?: PermissionsScalarFieldEnum | PermissionsScalarFieldEnum[]
  }

  /**
   * permissions create
   */
  export type permissionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the permissions
     */
    select?: permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the permissions
     */
    omit?: permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: permissionsInclude<ExtArgs> | null
    /**
     * The data needed to create a permissions.
     */
    data: XOR<permissionsCreateInput, permissionsUncheckedCreateInput>
  }

  /**
   * permissions createMany
   */
  export type permissionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many permissions.
     */
    data: permissionsCreateManyInput | permissionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * permissions createManyAndReturn
   */
  export type permissionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the permissions
     */
    select?: permissionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the permissions
     */
    omit?: permissionsOmit<ExtArgs> | null
    /**
     * The data used to create many permissions.
     */
    data: permissionsCreateManyInput | permissionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * permissions update
   */
  export type permissionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the permissions
     */
    select?: permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the permissions
     */
    omit?: permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: permissionsInclude<ExtArgs> | null
    /**
     * The data needed to update a permissions.
     */
    data: XOR<permissionsUpdateInput, permissionsUncheckedUpdateInput>
    /**
     * Choose, which permissions to update.
     */
    where: permissionsWhereUniqueInput
  }

  /**
   * permissions updateMany
   */
  export type permissionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update permissions.
     */
    data: XOR<permissionsUpdateManyMutationInput, permissionsUncheckedUpdateManyInput>
    /**
     * Filter which permissions to update
     */
    where?: permissionsWhereInput
    /**
     * Limit how many permissions to update.
     */
    limit?: number
  }

  /**
   * permissions updateManyAndReturn
   */
  export type permissionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the permissions
     */
    select?: permissionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the permissions
     */
    omit?: permissionsOmit<ExtArgs> | null
    /**
     * The data used to update permissions.
     */
    data: XOR<permissionsUpdateManyMutationInput, permissionsUncheckedUpdateManyInput>
    /**
     * Filter which permissions to update
     */
    where?: permissionsWhereInput
    /**
     * Limit how many permissions to update.
     */
    limit?: number
  }

  /**
   * permissions upsert
   */
  export type permissionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the permissions
     */
    select?: permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the permissions
     */
    omit?: permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: permissionsInclude<ExtArgs> | null
    /**
     * The filter to search for the permissions to update in case it exists.
     */
    where: permissionsWhereUniqueInput
    /**
     * In case the permissions found by the `where` argument doesn't exist, create a new permissions with this data.
     */
    create: XOR<permissionsCreateInput, permissionsUncheckedCreateInput>
    /**
     * In case the permissions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<permissionsUpdateInput, permissionsUncheckedUpdateInput>
  }

  /**
   * permissions delete
   */
  export type permissionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the permissions
     */
    select?: permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the permissions
     */
    omit?: permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: permissionsInclude<ExtArgs> | null
    /**
     * Filter which permissions to delete.
     */
    where: permissionsWhereUniqueInput
  }

  /**
   * permissions deleteMany
   */
  export type permissionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which permissions to delete
     */
    where?: permissionsWhereInput
    /**
     * Limit how many permissions to delete.
     */
    limit?: number
  }

  /**
   * permissions.role_permissions
   */
  export type permissions$role_permissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the role_permissions
     */
    select?: role_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the role_permissions
     */
    omit?: role_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: role_permissionsInclude<ExtArgs> | null
    where?: role_permissionsWhereInput
    orderBy?: role_permissionsOrderByWithRelationInput | role_permissionsOrderByWithRelationInput[]
    cursor?: role_permissionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Role_permissionsScalarFieldEnum | Role_permissionsScalarFieldEnum[]
  }

  /**
   * permissions without action
   */
  export type permissionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the permissions
     */
    select?: permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the permissions
     */
    omit?: permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: permissionsInclude<ExtArgs> | null
  }


  /**
   * Model reports
   */

  export type AggregateReports = {
    _count: ReportsCountAggregateOutputType | null
    _min: ReportsMinAggregateOutputType | null
    _max: ReportsMaxAggregateOutputType | null
  }

  export type ReportsMinAggregateOutputType = {
    id: string | null
    generated_by: string | null
    organization_id: string | null
    report_type: string | null
    generated_at: Date | null
    file_url: string | null
    description: string | null
  }

  export type ReportsMaxAggregateOutputType = {
    id: string | null
    generated_by: string | null
    organization_id: string | null
    report_type: string | null
    generated_at: Date | null
    file_url: string | null
    description: string | null
  }

  export type ReportsCountAggregateOutputType = {
    id: number
    generated_by: number
    organization_id: number
    report_type: number
    generated_at: number
    file_url: number
    description: number
    _all: number
  }


  export type ReportsMinAggregateInputType = {
    id?: true
    generated_by?: true
    organization_id?: true
    report_type?: true
    generated_at?: true
    file_url?: true
    description?: true
  }

  export type ReportsMaxAggregateInputType = {
    id?: true
    generated_by?: true
    organization_id?: true
    report_type?: true
    generated_at?: true
    file_url?: true
    description?: true
  }

  export type ReportsCountAggregateInputType = {
    id?: true
    generated_by?: true
    organization_id?: true
    report_type?: true
    generated_at?: true
    file_url?: true
    description?: true
    _all?: true
  }

  export type ReportsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which reports to aggregate.
     */
    where?: reportsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reports to fetch.
     */
    orderBy?: reportsOrderByWithRelationInput | reportsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: reportsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned reports
    **/
    _count?: true | ReportsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReportsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReportsMaxAggregateInputType
  }

  export type GetReportsAggregateType<T extends ReportsAggregateArgs> = {
        [P in keyof T & keyof AggregateReports]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReports[P]>
      : GetScalarType<T[P], AggregateReports[P]>
  }




  export type reportsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: reportsWhereInput
    orderBy?: reportsOrderByWithAggregationInput | reportsOrderByWithAggregationInput[]
    by: ReportsScalarFieldEnum[] | ReportsScalarFieldEnum
    having?: reportsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReportsCountAggregateInputType | true
    _min?: ReportsMinAggregateInputType
    _max?: ReportsMaxAggregateInputType
  }

  export type ReportsGroupByOutputType = {
    id: string
    generated_by: string
    organization_id: string
    report_type: string
    generated_at: Date
    file_url: string | null
    description: string | null
    _count: ReportsCountAggregateOutputType | null
    _min: ReportsMinAggregateOutputType | null
    _max: ReportsMaxAggregateOutputType | null
  }

  type GetReportsGroupByPayload<T extends reportsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReportsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReportsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReportsGroupByOutputType[P]>
            : GetScalarType<T[P], ReportsGroupByOutputType[P]>
        }
      >
    >


  export type reportsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    generated_by?: boolean
    organization_id?: boolean
    report_type?: boolean
    generated_at?: boolean
    file_url?: boolean
    description?: boolean
    users?: boolean | usersDefaultArgs<ExtArgs>
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reports"]>

  export type reportsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    generated_by?: boolean
    organization_id?: boolean
    report_type?: boolean
    generated_at?: boolean
    file_url?: boolean
    description?: boolean
    users?: boolean | usersDefaultArgs<ExtArgs>
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reports"]>

  export type reportsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    generated_by?: boolean
    organization_id?: boolean
    report_type?: boolean
    generated_at?: boolean
    file_url?: boolean
    description?: boolean
    users?: boolean | usersDefaultArgs<ExtArgs>
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reports"]>

  export type reportsSelectScalar = {
    id?: boolean
    generated_by?: boolean
    organization_id?: boolean
    report_type?: boolean
    generated_at?: boolean
    file_url?: boolean
    description?: boolean
  }

  export type reportsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "generated_by" | "organization_id" | "report_type" | "generated_at" | "file_url" | "description", ExtArgs["result"]["reports"]>
  export type reportsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | usersDefaultArgs<ExtArgs>
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
  }
  export type reportsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | usersDefaultArgs<ExtArgs>
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
  }
  export type reportsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | usersDefaultArgs<ExtArgs>
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
  }

  export type $reportsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "reports"
    objects: {
      users: Prisma.$usersPayload<ExtArgs>
      organizations: Prisma.$organizationsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      generated_by: string
      organization_id: string
      report_type: string
      generated_at: Date
      file_url: string | null
      description: string | null
    }, ExtArgs["result"]["reports"]>
    composites: {}
  }

  type reportsGetPayload<S extends boolean | null | undefined | reportsDefaultArgs> = $Result.GetResult<Prisma.$reportsPayload, S>

  type reportsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<reportsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReportsCountAggregateInputType | true
    }

  export interface reportsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['reports'], meta: { name: 'reports' } }
    /**
     * Find zero or one Reports that matches the filter.
     * @param {reportsFindUniqueArgs} args - Arguments to find a Reports
     * @example
     * // Get one Reports
     * const reports = await prisma.reports.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends reportsFindUniqueArgs>(args: SelectSubset<T, reportsFindUniqueArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Reports that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {reportsFindUniqueOrThrowArgs} args - Arguments to find a Reports
     * @example
     * // Get one Reports
     * const reports = await prisma.reports.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends reportsFindUniqueOrThrowArgs>(args: SelectSubset<T, reportsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reportsFindFirstArgs} args - Arguments to find a Reports
     * @example
     * // Get one Reports
     * const reports = await prisma.reports.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends reportsFindFirstArgs>(args?: SelectSubset<T, reportsFindFirstArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reports that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reportsFindFirstOrThrowArgs} args - Arguments to find a Reports
     * @example
     * // Get one Reports
     * const reports = await prisma.reports.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends reportsFindFirstOrThrowArgs>(args?: SelectSubset<T, reportsFindFirstOrThrowArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reportsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reports
     * const reports = await prisma.reports.findMany()
     * 
     * // Get first 10 Reports
     * const reports = await prisma.reports.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reportsWithIdOnly = await prisma.reports.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends reportsFindManyArgs>(args?: SelectSubset<T, reportsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Reports.
     * @param {reportsCreateArgs} args - Arguments to create a Reports.
     * @example
     * // Create one Reports
     * const Reports = await prisma.reports.create({
     *   data: {
     *     // ... data to create a Reports
     *   }
     * })
     * 
     */
    create<T extends reportsCreateArgs>(args: SelectSubset<T, reportsCreateArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reports.
     * @param {reportsCreateManyArgs} args - Arguments to create many Reports.
     * @example
     * // Create many Reports
     * const reports = await prisma.reports.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends reportsCreateManyArgs>(args?: SelectSubset<T, reportsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reports and returns the data saved in the database.
     * @param {reportsCreateManyAndReturnArgs} args - Arguments to create many Reports.
     * @example
     * // Create many Reports
     * const reports = await prisma.reports.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reports and only return the `id`
     * const reportsWithIdOnly = await prisma.reports.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends reportsCreateManyAndReturnArgs>(args?: SelectSubset<T, reportsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Reports.
     * @param {reportsDeleteArgs} args - Arguments to delete one Reports.
     * @example
     * // Delete one Reports
     * const Reports = await prisma.reports.delete({
     *   where: {
     *     // ... filter to delete one Reports
     *   }
     * })
     * 
     */
    delete<T extends reportsDeleteArgs>(args: SelectSubset<T, reportsDeleteArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Reports.
     * @param {reportsUpdateArgs} args - Arguments to update one Reports.
     * @example
     * // Update one Reports
     * const reports = await prisma.reports.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends reportsUpdateArgs>(args: SelectSubset<T, reportsUpdateArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reports.
     * @param {reportsDeleteManyArgs} args - Arguments to filter Reports to delete.
     * @example
     * // Delete a few Reports
     * const { count } = await prisma.reports.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends reportsDeleteManyArgs>(args?: SelectSubset<T, reportsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reportsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reports
     * const reports = await prisma.reports.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends reportsUpdateManyArgs>(args: SelectSubset<T, reportsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reports and returns the data updated in the database.
     * @param {reportsUpdateManyAndReturnArgs} args - Arguments to update many Reports.
     * @example
     * // Update many Reports
     * const reports = await prisma.reports.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Reports and only return the `id`
     * const reportsWithIdOnly = await prisma.reports.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends reportsUpdateManyAndReturnArgs>(args: SelectSubset<T, reportsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Reports.
     * @param {reportsUpsertArgs} args - Arguments to update or create a Reports.
     * @example
     * // Update or create a Reports
     * const reports = await prisma.reports.upsert({
     *   create: {
     *     // ... data to create a Reports
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reports we want to update
     *   }
     * })
     */
    upsert<T extends reportsUpsertArgs>(args: SelectSubset<T, reportsUpsertArgs<ExtArgs>>): Prisma__reportsClient<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reportsCountArgs} args - Arguments to filter Reports to count.
     * @example
     * // Count the number of Reports
     * const count = await prisma.reports.count({
     *   where: {
     *     // ... the filter for the Reports we want to count
     *   }
     * })
    **/
    count<T extends reportsCountArgs>(
      args?: Subset<T, reportsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReportsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReportsAggregateArgs>(args: Subset<T, ReportsAggregateArgs>): Prisma.PrismaPromise<GetReportsAggregateType<T>>

    /**
     * Group by Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {reportsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends reportsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: reportsGroupByArgs['orderBy'] }
        : { orderBy?: reportsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, reportsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReportsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the reports model
   */
  readonly fields: reportsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for reports.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__reportsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    organizations<T extends organizationsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, organizationsDefaultArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the reports model
   */
  interface reportsFieldRefs {
    readonly id: FieldRef<"reports", 'String'>
    readonly generated_by: FieldRef<"reports", 'String'>
    readonly organization_id: FieldRef<"reports", 'String'>
    readonly report_type: FieldRef<"reports", 'String'>
    readonly generated_at: FieldRef<"reports", 'DateTime'>
    readonly file_url: FieldRef<"reports", 'String'>
    readonly description: FieldRef<"reports", 'String'>
  }
    

  // Custom InputTypes
  /**
   * reports findUnique
   */
  export type reportsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * Filter, which reports to fetch.
     */
    where: reportsWhereUniqueInput
  }

  /**
   * reports findUniqueOrThrow
   */
  export type reportsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * Filter, which reports to fetch.
     */
    where: reportsWhereUniqueInput
  }

  /**
   * reports findFirst
   */
  export type reportsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * Filter, which reports to fetch.
     */
    where?: reportsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reports to fetch.
     */
    orderBy?: reportsOrderByWithRelationInput | reportsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for reports.
     */
    cursor?: reportsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of reports.
     */
    distinct?: ReportsScalarFieldEnum | ReportsScalarFieldEnum[]
  }

  /**
   * reports findFirstOrThrow
   */
  export type reportsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * Filter, which reports to fetch.
     */
    where?: reportsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reports to fetch.
     */
    orderBy?: reportsOrderByWithRelationInput | reportsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for reports.
     */
    cursor?: reportsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of reports.
     */
    distinct?: ReportsScalarFieldEnum | ReportsScalarFieldEnum[]
  }

  /**
   * reports findMany
   */
  export type reportsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * Filter, which reports to fetch.
     */
    where?: reportsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of reports to fetch.
     */
    orderBy?: reportsOrderByWithRelationInput | reportsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing reports.
     */
    cursor?: reportsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` reports.
     */
    skip?: number
    distinct?: ReportsScalarFieldEnum | ReportsScalarFieldEnum[]
  }

  /**
   * reports create
   */
  export type reportsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * The data needed to create a reports.
     */
    data: XOR<reportsCreateInput, reportsUncheckedCreateInput>
  }

  /**
   * reports createMany
   */
  export type reportsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many reports.
     */
    data: reportsCreateManyInput | reportsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * reports createManyAndReturn
   */
  export type reportsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * The data used to create many reports.
     */
    data: reportsCreateManyInput | reportsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * reports update
   */
  export type reportsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * The data needed to update a reports.
     */
    data: XOR<reportsUpdateInput, reportsUncheckedUpdateInput>
    /**
     * Choose, which reports to update.
     */
    where: reportsWhereUniqueInput
  }

  /**
   * reports updateMany
   */
  export type reportsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update reports.
     */
    data: XOR<reportsUpdateManyMutationInput, reportsUncheckedUpdateManyInput>
    /**
     * Filter which reports to update
     */
    where?: reportsWhereInput
    /**
     * Limit how many reports to update.
     */
    limit?: number
  }

  /**
   * reports updateManyAndReturn
   */
  export type reportsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * The data used to update reports.
     */
    data: XOR<reportsUpdateManyMutationInput, reportsUncheckedUpdateManyInput>
    /**
     * Filter which reports to update
     */
    where?: reportsWhereInput
    /**
     * Limit how many reports to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * reports upsert
   */
  export type reportsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * The filter to search for the reports to update in case it exists.
     */
    where: reportsWhereUniqueInput
    /**
     * In case the reports found by the `where` argument doesn't exist, create a new reports with this data.
     */
    create: XOR<reportsCreateInput, reportsUncheckedCreateInput>
    /**
     * In case the reports was found with the provided `where` argument, update it with this data.
     */
    update: XOR<reportsUpdateInput, reportsUncheckedUpdateInput>
  }

  /**
   * reports delete
   */
  export type reportsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    /**
     * Filter which reports to delete.
     */
    where: reportsWhereUniqueInput
  }

  /**
   * reports deleteMany
   */
  export type reportsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which reports to delete
     */
    where?: reportsWhereInput
    /**
     * Limit how many reports to delete.
     */
    limit?: number
  }

  /**
   * reports without action
   */
  export type reportsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
  }


  /**
   * Model requests
   */

  export type AggregateRequests = {
    _count: RequestsCountAggregateOutputType | null
    _min: RequestsMinAggregateOutputType | null
    _max: RequestsMaxAggregateOutputType | null
  }

  export type RequestsMinAggregateOutputType = {
    id: string | null
    vehicle_id: string | null
    requested_at: Date | null
    trip_purpose: string | null
    start_location: string | null
    end_location: string | null
    start_date: Date | null
    end_date: Date | null
    status: string | null
    reviewed_at: Date | null
    comments: string | null
    requester_id: string | null
    reviewed_by: string | null
  }

  export type RequestsMaxAggregateOutputType = {
    id: string | null
    vehicle_id: string | null
    requested_at: Date | null
    trip_purpose: string | null
    start_location: string | null
    end_location: string | null
    start_date: Date | null
    end_date: Date | null
    status: string | null
    reviewed_at: Date | null
    comments: string | null
    requester_id: string | null
    reviewed_by: string | null
  }

  export type RequestsCountAggregateOutputType = {
    id: number
    vehicle_id: number
    requested_at: number
    trip_purpose: number
    start_location: number
    end_location: number
    start_date: number
    end_date: number
    status: number
    reviewed_at: number
    comments: number
    requester_id: number
    reviewed_by: number
    _all: number
  }


  export type RequestsMinAggregateInputType = {
    id?: true
    vehicle_id?: true
    requested_at?: true
    trip_purpose?: true
    start_location?: true
    end_location?: true
    start_date?: true
    end_date?: true
    status?: true
    reviewed_at?: true
    comments?: true
    requester_id?: true
    reviewed_by?: true
  }

  export type RequestsMaxAggregateInputType = {
    id?: true
    vehicle_id?: true
    requested_at?: true
    trip_purpose?: true
    start_location?: true
    end_location?: true
    start_date?: true
    end_date?: true
    status?: true
    reviewed_at?: true
    comments?: true
    requester_id?: true
    reviewed_by?: true
  }

  export type RequestsCountAggregateInputType = {
    id?: true
    vehicle_id?: true
    requested_at?: true
    trip_purpose?: true
    start_location?: true
    end_location?: true
    start_date?: true
    end_date?: true
    status?: true
    reviewed_at?: true
    comments?: true
    requester_id?: true
    reviewed_by?: true
    _all?: true
  }

  export type RequestsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which requests to aggregate.
     */
    where?: requestsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of requests to fetch.
     */
    orderBy?: requestsOrderByWithRelationInput | requestsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: requestsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` requests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` requests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned requests
    **/
    _count?: true | RequestsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RequestsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RequestsMaxAggregateInputType
  }

  export type GetRequestsAggregateType<T extends RequestsAggregateArgs> = {
        [P in keyof T & keyof AggregateRequests]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRequests[P]>
      : GetScalarType<T[P], AggregateRequests[P]>
  }




  export type requestsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: requestsWhereInput
    orderBy?: requestsOrderByWithAggregationInput | requestsOrderByWithAggregationInput[]
    by: RequestsScalarFieldEnum[] | RequestsScalarFieldEnum
    having?: requestsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RequestsCountAggregateInputType | true
    _min?: RequestsMinAggregateInputType
    _max?: RequestsMaxAggregateInputType
  }

  export type RequestsGroupByOutputType = {
    id: string
    vehicle_id: string | null
    requested_at: Date
    trip_purpose: string
    start_location: string
    end_location: string
    start_date: Date
    end_date: Date
    status: string
    reviewed_at: Date | null
    comments: string | null
    requester_id: string
    reviewed_by: string | null
    _count: RequestsCountAggregateOutputType | null
    _min: RequestsMinAggregateOutputType | null
    _max: RequestsMaxAggregateOutputType | null
  }

  type GetRequestsGroupByPayload<T extends requestsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RequestsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RequestsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RequestsGroupByOutputType[P]>
            : GetScalarType<T[P], RequestsGroupByOutputType[P]>
        }
      >
    >


  export type requestsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicle_id?: boolean
    requested_at?: boolean
    trip_purpose?: boolean
    start_location?: boolean
    end_location?: boolean
    start_date?: boolean
    end_date?: boolean
    status?: boolean
    reviewed_at?: boolean
    comments?: boolean
    requester_id?: boolean
    reviewed_by?: boolean
    users_requests_requester_idTousers?: boolean | usersDefaultArgs<ExtArgs>
    users_requests_reviewed_byTousers?: boolean | requests$users_requests_reviewed_byTousersArgs<ExtArgs>
    vehicles?: boolean | requests$vehiclesArgs<ExtArgs>
    trips?: boolean | requests$tripsArgs<ExtArgs>
    _count?: boolean | RequestsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["requests"]>

  export type requestsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicle_id?: boolean
    requested_at?: boolean
    trip_purpose?: boolean
    start_location?: boolean
    end_location?: boolean
    start_date?: boolean
    end_date?: boolean
    status?: boolean
    reviewed_at?: boolean
    comments?: boolean
    requester_id?: boolean
    reviewed_by?: boolean
    users_requests_requester_idTousers?: boolean | usersDefaultArgs<ExtArgs>
    users_requests_reviewed_byTousers?: boolean | requests$users_requests_reviewed_byTousersArgs<ExtArgs>
    vehicles?: boolean | requests$vehiclesArgs<ExtArgs>
  }, ExtArgs["result"]["requests"]>

  export type requestsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicle_id?: boolean
    requested_at?: boolean
    trip_purpose?: boolean
    start_location?: boolean
    end_location?: boolean
    start_date?: boolean
    end_date?: boolean
    status?: boolean
    reviewed_at?: boolean
    comments?: boolean
    requester_id?: boolean
    reviewed_by?: boolean
    users_requests_requester_idTousers?: boolean | usersDefaultArgs<ExtArgs>
    users_requests_reviewed_byTousers?: boolean | requests$users_requests_reviewed_byTousersArgs<ExtArgs>
    vehicles?: boolean | requests$vehiclesArgs<ExtArgs>
  }, ExtArgs["result"]["requests"]>

  export type requestsSelectScalar = {
    id?: boolean
    vehicle_id?: boolean
    requested_at?: boolean
    trip_purpose?: boolean
    start_location?: boolean
    end_location?: boolean
    start_date?: boolean
    end_date?: boolean
    status?: boolean
    reviewed_at?: boolean
    comments?: boolean
    requester_id?: boolean
    reviewed_by?: boolean
  }

  export type requestsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vehicle_id" | "requested_at" | "trip_purpose" | "start_location" | "end_location" | "start_date" | "end_date" | "status" | "reviewed_at" | "comments" | "requester_id" | "reviewed_by", ExtArgs["result"]["requests"]>
  export type requestsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users_requests_requester_idTousers?: boolean | usersDefaultArgs<ExtArgs>
    users_requests_reviewed_byTousers?: boolean | requests$users_requests_reviewed_byTousersArgs<ExtArgs>
    vehicles?: boolean | requests$vehiclesArgs<ExtArgs>
    trips?: boolean | requests$tripsArgs<ExtArgs>
    _count?: boolean | RequestsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type requestsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users_requests_requester_idTousers?: boolean | usersDefaultArgs<ExtArgs>
    users_requests_reviewed_byTousers?: boolean | requests$users_requests_reviewed_byTousersArgs<ExtArgs>
    vehicles?: boolean | requests$vehiclesArgs<ExtArgs>
  }
  export type requestsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users_requests_requester_idTousers?: boolean | usersDefaultArgs<ExtArgs>
    users_requests_reviewed_byTousers?: boolean | requests$users_requests_reviewed_byTousersArgs<ExtArgs>
    vehicles?: boolean | requests$vehiclesArgs<ExtArgs>
  }

  export type $requestsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "requests"
    objects: {
      users_requests_requester_idTousers: Prisma.$usersPayload<ExtArgs>
      users_requests_reviewed_byTousers: Prisma.$usersPayload<ExtArgs> | null
      vehicles: Prisma.$vehiclesPayload<ExtArgs> | null
      trips: Prisma.$tripsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      vehicle_id: string | null
      requested_at: Date
      trip_purpose: string
      start_location: string
      end_location: string
      start_date: Date
      end_date: Date
      status: string
      reviewed_at: Date | null
      comments: string | null
      requester_id: string
      reviewed_by: string | null
    }, ExtArgs["result"]["requests"]>
    composites: {}
  }

  type requestsGetPayload<S extends boolean | null | undefined | requestsDefaultArgs> = $Result.GetResult<Prisma.$requestsPayload, S>

  type requestsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<requestsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RequestsCountAggregateInputType | true
    }

  export interface requestsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['requests'], meta: { name: 'requests' } }
    /**
     * Find zero or one Requests that matches the filter.
     * @param {requestsFindUniqueArgs} args - Arguments to find a Requests
     * @example
     * // Get one Requests
     * const requests = await prisma.requests.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends requestsFindUniqueArgs>(args: SelectSubset<T, requestsFindUniqueArgs<ExtArgs>>): Prisma__requestsClient<$Result.GetResult<Prisma.$requestsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Requests that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {requestsFindUniqueOrThrowArgs} args - Arguments to find a Requests
     * @example
     * // Get one Requests
     * const requests = await prisma.requests.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends requestsFindUniqueOrThrowArgs>(args: SelectSubset<T, requestsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__requestsClient<$Result.GetResult<Prisma.$requestsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Requests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requestsFindFirstArgs} args - Arguments to find a Requests
     * @example
     * // Get one Requests
     * const requests = await prisma.requests.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends requestsFindFirstArgs>(args?: SelectSubset<T, requestsFindFirstArgs<ExtArgs>>): Prisma__requestsClient<$Result.GetResult<Prisma.$requestsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Requests that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requestsFindFirstOrThrowArgs} args - Arguments to find a Requests
     * @example
     * // Get one Requests
     * const requests = await prisma.requests.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends requestsFindFirstOrThrowArgs>(args?: SelectSubset<T, requestsFindFirstOrThrowArgs<ExtArgs>>): Prisma__requestsClient<$Result.GetResult<Prisma.$requestsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Requests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requestsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Requests
     * const requests = await prisma.requests.findMany()
     * 
     * // Get first 10 Requests
     * const requests = await prisma.requests.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const requestsWithIdOnly = await prisma.requests.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends requestsFindManyArgs>(args?: SelectSubset<T, requestsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$requestsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Requests.
     * @param {requestsCreateArgs} args - Arguments to create a Requests.
     * @example
     * // Create one Requests
     * const Requests = await prisma.requests.create({
     *   data: {
     *     // ... data to create a Requests
     *   }
     * })
     * 
     */
    create<T extends requestsCreateArgs>(args: SelectSubset<T, requestsCreateArgs<ExtArgs>>): Prisma__requestsClient<$Result.GetResult<Prisma.$requestsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Requests.
     * @param {requestsCreateManyArgs} args - Arguments to create many Requests.
     * @example
     * // Create many Requests
     * const requests = await prisma.requests.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends requestsCreateManyArgs>(args?: SelectSubset<T, requestsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Requests and returns the data saved in the database.
     * @param {requestsCreateManyAndReturnArgs} args - Arguments to create many Requests.
     * @example
     * // Create many Requests
     * const requests = await prisma.requests.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Requests and only return the `id`
     * const requestsWithIdOnly = await prisma.requests.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends requestsCreateManyAndReturnArgs>(args?: SelectSubset<T, requestsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$requestsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Requests.
     * @param {requestsDeleteArgs} args - Arguments to delete one Requests.
     * @example
     * // Delete one Requests
     * const Requests = await prisma.requests.delete({
     *   where: {
     *     // ... filter to delete one Requests
     *   }
     * })
     * 
     */
    delete<T extends requestsDeleteArgs>(args: SelectSubset<T, requestsDeleteArgs<ExtArgs>>): Prisma__requestsClient<$Result.GetResult<Prisma.$requestsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Requests.
     * @param {requestsUpdateArgs} args - Arguments to update one Requests.
     * @example
     * // Update one Requests
     * const requests = await prisma.requests.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends requestsUpdateArgs>(args: SelectSubset<T, requestsUpdateArgs<ExtArgs>>): Prisma__requestsClient<$Result.GetResult<Prisma.$requestsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Requests.
     * @param {requestsDeleteManyArgs} args - Arguments to filter Requests to delete.
     * @example
     * // Delete a few Requests
     * const { count } = await prisma.requests.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends requestsDeleteManyArgs>(args?: SelectSubset<T, requestsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Requests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requestsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Requests
     * const requests = await prisma.requests.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends requestsUpdateManyArgs>(args: SelectSubset<T, requestsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Requests and returns the data updated in the database.
     * @param {requestsUpdateManyAndReturnArgs} args - Arguments to update many Requests.
     * @example
     * // Update many Requests
     * const requests = await prisma.requests.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Requests and only return the `id`
     * const requestsWithIdOnly = await prisma.requests.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends requestsUpdateManyAndReturnArgs>(args: SelectSubset<T, requestsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$requestsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Requests.
     * @param {requestsUpsertArgs} args - Arguments to update or create a Requests.
     * @example
     * // Update or create a Requests
     * const requests = await prisma.requests.upsert({
     *   create: {
     *     // ... data to create a Requests
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Requests we want to update
     *   }
     * })
     */
    upsert<T extends requestsUpsertArgs>(args: SelectSubset<T, requestsUpsertArgs<ExtArgs>>): Prisma__requestsClient<$Result.GetResult<Prisma.$requestsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Requests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requestsCountArgs} args - Arguments to filter Requests to count.
     * @example
     * // Count the number of Requests
     * const count = await prisma.requests.count({
     *   where: {
     *     // ... the filter for the Requests we want to count
     *   }
     * })
    **/
    count<T extends requestsCountArgs>(
      args?: Subset<T, requestsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RequestsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Requests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RequestsAggregateArgs>(args: Subset<T, RequestsAggregateArgs>): Prisma.PrismaPromise<GetRequestsAggregateType<T>>

    /**
     * Group by Requests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {requestsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends requestsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: requestsGroupByArgs['orderBy'] }
        : { orderBy?: requestsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, requestsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRequestsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the requests model
   */
  readonly fields: requestsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for requests.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__requestsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users_requests_requester_idTousers<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    users_requests_reviewed_byTousers<T extends requests$users_requests_reviewed_byTousersArgs<ExtArgs> = {}>(args?: Subset<T, requests$users_requests_reviewed_byTousersArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    vehicles<T extends requests$vehiclesArgs<ExtArgs> = {}>(args?: Subset<T, requests$vehiclesArgs<ExtArgs>>): Prisma__vehiclesClient<$Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    trips<T extends requests$tripsArgs<ExtArgs> = {}>(args?: Subset<T, requests$tripsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the requests model
   */
  interface requestsFieldRefs {
    readonly id: FieldRef<"requests", 'String'>
    readonly vehicle_id: FieldRef<"requests", 'String'>
    readonly requested_at: FieldRef<"requests", 'DateTime'>
    readonly trip_purpose: FieldRef<"requests", 'String'>
    readonly start_location: FieldRef<"requests", 'String'>
    readonly end_location: FieldRef<"requests", 'String'>
    readonly start_date: FieldRef<"requests", 'DateTime'>
    readonly end_date: FieldRef<"requests", 'DateTime'>
    readonly status: FieldRef<"requests", 'String'>
    readonly reviewed_at: FieldRef<"requests", 'DateTime'>
    readonly comments: FieldRef<"requests", 'String'>
    readonly requester_id: FieldRef<"requests", 'String'>
    readonly reviewed_by: FieldRef<"requests", 'String'>
  }
    

  // Custom InputTypes
  /**
   * requests findUnique
   */
  export type requestsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsInclude<ExtArgs> | null
    /**
     * Filter, which requests to fetch.
     */
    where: requestsWhereUniqueInput
  }

  /**
   * requests findUniqueOrThrow
   */
  export type requestsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsInclude<ExtArgs> | null
    /**
     * Filter, which requests to fetch.
     */
    where: requestsWhereUniqueInput
  }

  /**
   * requests findFirst
   */
  export type requestsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsInclude<ExtArgs> | null
    /**
     * Filter, which requests to fetch.
     */
    where?: requestsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of requests to fetch.
     */
    orderBy?: requestsOrderByWithRelationInput | requestsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for requests.
     */
    cursor?: requestsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` requests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` requests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of requests.
     */
    distinct?: RequestsScalarFieldEnum | RequestsScalarFieldEnum[]
  }

  /**
   * requests findFirstOrThrow
   */
  export type requestsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsInclude<ExtArgs> | null
    /**
     * Filter, which requests to fetch.
     */
    where?: requestsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of requests to fetch.
     */
    orderBy?: requestsOrderByWithRelationInput | requestsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for requests.
     */
    cursor?: requestsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` requests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` requests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of requests.
     */
    distinct?: RequestsScalarFieldEnum | RequestsScalarFieldEnum[]
  }

  /**
   * requests findMany
   */
  export type requestsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsInclude<ExtArgs> | null
    /**
     * Filter, which requests to fetch.
     */
    where?: requestsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of requests to fetch.
     */
    orderBy?: requestsOrderByWithRelationInput | requestsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing requests.
     */
    cursor?: requestsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` requests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` requests.
     */
    skip?: number
    distinct?: RequestsScalarFieldEnum | RequestsScalarFieldEnum[]
  }

  /**
   * requests create
   */
  export type requestsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsInclude<ExtArgs> | null
    /**
     * The data needed to create a requests.
     */
    data: XOR<requestsCreateInput, requestsUncheckedCreateInput>
  }

  /**
   * requests createMany
   */
  export type requestsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many requests.
     */
    data: requestsCreateManyInput | requestsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * requests createManyAndReturn
   */
  export type requestsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * The data used to create many requests.
     */
    data: requestsCreateManyInput | requestsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * requests update
   */
  export type requestsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsInclude<ExtArgs> | null
    /**
     * The data needed to update a requests.
     */
    data: XOR<requestsUpdateInput, requestsUncheckedUpdateInput>
    /**
     * Choose, which requests to update.
     */
    where: requestsWhereUniqueInput
  }

  /**
   * requests updateMany
   */
  export type requestsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update requests.
     */
    data: XOR<requestsUpdateManyMutationInput, requestsUncheckedUpdateManyInput>
    /**
     * Filter which requests to update
     */
    where?: requestsWhereInput
    /**
     * Limit how many requests to update.
     */
    limit?: number
  }

  /**
   * requests updateManyAndReturn
   */
  export type requestsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * The data used to update requests.
     */
    data: XOR<requestsUpdateManyMutationInput, requestsUncheckedUpdateManyInput>
    /**
     * Filter which requests to update
     */
    where?: requestsWhereInput
    /**
     * Limit how many requests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * requests upsert
   */
  export type requestsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsInclude<ExtArgs> | null
    /**
     * The filter to search for the requests to update in case it exists.
     */
    where: requestsWhereUniqueInput
    /**
     * In case the requests found by the `where` argument doesn't exist, create a new requests with this data.
     */
    create: XOR<requestsCreateInput, requestsUncheckedCreateInput>
    /**
     * In case the requests was found with the provided `where` argument, update it with this data.
     */
    update: XOR<requestsUpdateInput, requestsUncheckedUpdateInput>
  }

  /**
   * requests delete
   */
  export type requestsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsInclude<ExtArgs> | null
    /**
     * Filter which requests to delete.
     */
    where: requestsWhereUniqueInput
  }

  /**
   * requests deleteMany
   */
  export type requestsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which requests to delete
     */
    where?: requestsWhereInput
    /**
     * Limit how many requests to delete.
     */
    limit?: number
  }

  /**
   * requests.users_requests_reviewed_byTousers
   */
  export type requests$users_requests_reviewed_byTousersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    where?: usersWhereInput
  }

  /**
   * requests.vehicles
   */
  export type requests$vehiclesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicles
     */
    select?: vehiclesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicles
     */
    omit?: vehiclesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehiclesInclude<ExtArgs> | null
    where?: vehiclesWhereInput
  }

  /**
   * requests.trips
   */
  export type requests$tripsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the trips
     */
    select?: tripsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the trips
     */
    omit?: tripsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tripsInclude<ExtArgs> | null
    where?: tripsWhereInput
    orderBy?: tripsOrderByWithRelationInput | tripsOrderByWithRelationInput[]
    cursor?: tripsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TripsScalarFieldEnum | TripsScalarFieldEnum[]
  }

  /**
   * requests without action
   */
  export type requestsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsInclude<ExtArgs> | null
  }


  /**
   * Model role_permissions
   */

  export type AggregateRole_permissions = {
    _count: Role_permissionsCountAggregateOutputType | null
    _min: Role_permissionsMinAggregateOutputType | null
    _max: Role_permissionsMaxAggregateOutputType | null
  }

  export type Role_permissionsMinAggregateOutputType = {
    id: string | null
    role_id: string | null
    permission_id: string | null
  }

  export type Role_permissionsMaxAggregateOutputType = {
    id: string | null
    role_id: string | null
    permission_id: string | null
  }

  export type Role_permissionsCountAggregateOutputType = {
    id: number
    role_id: number
    permission_id: number
    _all: number
  }


  export type Role_permissionsMinAggregateInputType = {
    id?: true
    role_id?: true
    permission_id?: true
  }

  export type Role_permissionsMaxAggregateInputType = {
    id?: true
    role_id?: true
    permission_id?: true
  }

  export type Role_permissionsCountAggregateInputType = {
    id?: true
    role_id?: true
    permission_id?: true
    _all?: true
  }

  export type Role_permissionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which role_permissions to aggregate.
     */
    where?: role_permissionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of role_permissions to fetch.
     */
    orderBy?: role_permissionsOrderByWithRelationInput | role_permissionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: role_permissionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` role_permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` role_permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned role_permissions
    **/
    _count?: true | Role_permissionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Role_permissionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Role_permissionsMaxAggregateInputType
  }

  export type GetRole_permissionsAggregateType<T extends Role_permissionsAggregateArgs> = {
        [P in keyof T & keyof AggregateRole_permissions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole_permissions[P]>
      : GetScalarType<T[P], AggregateRole_permissions[P]>
  }




  export type role_permissionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: role_permissionsWhereInput
    orderBy?: role_permissionsOrderByWithAggregationInput | role_permissionsOrderByWithAggregationInput[]
    by: Role_permissionsScalarFieldEnum[] | Role_permissionsScalarFieldEnum
    having?: role_permissionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Role_permissionsCountAggregateInputType | true
    _min?: Role_permissionsMinAggregateInputType
    _max?: Role_permissionsMaxAggregateInputType
  }

  export type Role_permissionsGroupByOutputType = {
    id: string
    role_id: string
    permission_id: string
    _count: Role_permissionsCountAggregateOutputType | null
    _min: Role_permissionsMinAggregateOutputType | null
    _max: Role_permissionsMaxAggregateOutputType | null
  }

  type GetRole_permissionsGroupByPayload<T extends role_permissionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Role_permissionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Role_permissionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Role_permissionsGroupByOutputType[P]>
            : GetScalarType<T[P], Role_permissionsGroupByOutputType[P]>
        }
      >
    >


  export type role_permissionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role_id?: boolean
    permission_id?: boolean
    permissions?: boolean | permissionsDefaultArgs<ExtArgs>
    roles?: boolean | rolesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["role_permissions"]>

  export type role_permissionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role_id?: boolean
    permission_id?: boolean
    permissions?: boolean | permissionsDefaultArgs<ExtArgs>
    roles?: boolean | rolesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["role_permissions"]>

  export type role_permissionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role_id?: boolean
    permission_id?: boolean
    permissions?: boolean | permissionsDefaultArgs<ExtArgs>
    roles?: boolean | rolesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["role_permissions"]>

  export type role_permissionsSelectScalar = {
    id?: boolean
    role_id?: boolean
    permission_id?: boolean
  }

  export type role_permissionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "role_id" | "permission_id", ExtArgs["result"]["role_permissions"]>
  export type role_permissionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    permissions?: boolean | permissionsDefaultArgs<ExtArgs>
    roles?: boolean | rolesDefaultArgs<ExtArgs>
  }
  export type role_permissionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    permissions?: boolean | permissionsDefaultArgs<ExtArgs>
    roles?: boolean | rolesDefaultArgs<ExtArgs>
  }
  export type role_permissionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    permissions?: boolean | permissionsDefaultArgs<ExtArgs>
    roles?: boolean | rolesDefaultArgs<ExtArgs>
  }

  export type $role_permissionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "role_permissions"
    objects: {
      permissions: Prisma.$permissionsPayload<ExtArgs>
      roles: Prisma.$rolesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      role_id: string
      permission_id: string
    }, ExtArgs["result"]["role_permissions"]>
    composites: {}
  }

  type role_permissionsGetPayload<S extends boolean | null | undefined | role_permissionsDefaultArgs> = $Result.GetResult<Prisma.$role_permissionsPayload, S>

  type role_permissionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<role_permissionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Role_permissionsCountAggregateInputType | true
    }

  export interface role_permissionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['role_permissions'], meta: { name: 'role_permissions' } }
    /**
     * Find zero or one Role_permissions that matches the filter.
     * @param {role_permissionsFindUniqueArgs} args - Arguments to find a Role_permissions
     * @example
     * // Get one Role_permissions
     * const role_permissions = await prisma.role_permissions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends role_permissionsFindUniqueArgs>(args: SelectSubset<T, role_permissionsFindUniqueArgs<ExtArgs>>): Prisma__role_permissionsClient<$Result.GetResult<Prisma.$role_permissionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Role_permissions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {role_permissionsFindUniqueOrThrowArgs} args - Arguments to find a Role_permissions
     * @example
     * // Get one Role_permissions
     * const role_permissions = await prisma.role_permissions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends role_permissionsFindUniqueOrThrowArgs>(args: SelectSubset<T, role_permissionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__role_permissionsClient<$Result.GetResult<Prisma.$role_permissionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role_permissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {role_permissionsFindFirstArgs} args - Arguments to find a Role_permissions
     * @example
     * // Get one Role_permissions
     * const role_permissions = await prisma.role_permissions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends role_permissionsFindFirstArgs>(args?: SelectSubset<T, role_permissionsFindFirstArgs<ExtArgs>>): Prisma__role_permissionsClient<$Result.GetResult<Prisma.$role_permissionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role_permissions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {role_permissionsFindFirstOrThrowArgs} args - Arguments to find a Role_permissions
     * @example
     * // Get one Role_permissions
     * const role_permissions = await prisma.role_permissions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends role_permissionsFindFirstOrThrowArgs>(args?: SelectSubset<T, role_permissionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__role_permissionsClient<$Result.GetResult<Prisma.$role_permissionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Role_permissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {role_permissionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Role_permissions
     * const role_permissions = await prisma.role_permissions.findMany()
     * 
     * // Get first 10 Role_permissions
     * const role_permissions = await prisma.role_permissions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const role_permissionsWithIdOnly = await prisma.role_permissions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends role_permissionsFindManyArgs>(args?: SelectSubset<T, role_permissionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$role_permissionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Role_permissions.
     * @param {role_permissionsCreateArgs} args - Arguments to create a Role_permissions.
     * @example
     * // Create one Role_permissions
     * const Role_permissions = await prisma.role_permissions.create({
     *   data: {
     *     // ... data to create a Role_permissions
     *   }
     * })
     * 
     */
    create<T extends role_permissionsCreateArgs>(args: SelectSubset<T, role_permissionsCreateArgs<ExtArgs>>): Prisma__role_permissionsClient<$Result.GetResult<Prisma.$role_permissionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Role_permissions.
     * @param {role_permissionsCreateManyArgs} args - Arguments to create many Role_permissions.
     * @example
     * // Create many Role_permissions
     * const role_permissions = await prisma.role_permissions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends role_permissionsCreateManyArgs>(args?: SelectSubset<T, role_permissionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Role_permissions and returns the data saved in the database.
     * @param {role_permissionsCreateManyAndReturnArgs} args - Arguments to create many Role_permissions.
     * @example
     * // Create many Role_permissions
     * const role_permissions = await prisma.role_permissions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Role_permissions and only return the `id`
     * const role_permissionsWithIdOnly = await prisma.role_permissions.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends role_permissionsCreateManyAndReturnArgs>(args?: SelectSubset<T, role_permissionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$role_permissionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Role_permissions.
     * @param {role_permissionsDeleteArgs} args - Arguments to delete one Role_permissions.
     * @example
     * // Delete one Role_permissions
     * const Role_permissions = await prisma.role_permissions.delete({
     *   where: {
     *     // ... filter to delete one Role_permissions
     *   }
     * })
     * 
     */
    delete<T extends role_permissionsDeleteArgs>(args: SelectSubset<T, role_permissionsDeleteArgs<ExtArgs>>): Prisma__role_permissionsClient<$Result.GetResult<Prisma.$role_permissionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Role_permissions.
     * @param {role_permissionsUpdateArgs} args - Arguments to update one Role_permissions.
     * @example
     * // Update one Role_permissions
     * const role_permissions = await prisma.role_permissions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends role_permissionsUpdateArgs>(args: SelectSubset<T, role_permissionsUpdateArgs<ExtArgs>>): Prisma__role_permissionsClient<$Result.GetResult<Prisma.$role_permissionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Role_permissions.
     * @param {role_permissionsDeleteManyArgs} args - Arguments to filter Role_permissions to delete.
     * @example
     * // Delete a few Role_permissions
     * const { count } = await prisma.role_permissions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends role_permissionsDeleteManyArgs>(args?: SelectSubset<T, role_permissionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Role_permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {role_permissionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Role_permissions
     * const role_permissions = await prisma.role_permissions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends role_permissionsUpdateManyArgs>(args: SelectSubset<T, role_permissionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Role_permissions and returns the data updated in the database.
     * @param {role_permissionsUpdateManyAndReturnArgs} args - Arguments to update many Role_permissions.
     * @example
     * // Update many Role_permissions
     * const role_permissions = await prisma.role_permissions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Role_permissions and only return the `id`
     * const role_permissionsWithIdOnly = await prisma.role_permissions.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends role_permissionsUpdateManyAndReturnArgs>(args: SelectSubset<T, role_permissionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$role_permissionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Role_permissions.
     * @param {role_permissionsUpsertArgs} args - Arguments to update or create a Role_permissions.
     * @example
     * // Update or create a Role_permissions
     * const role_permissions = await prisma.role_permissions.upsert({
     *   create: {
     *     // ... data to create a Role_permissions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role_permissions we want to update
     *   }
     * })
     */
    upsert<T extends role_permissionsUpsertArgs>(args: SelectSubset<T, role_permissionsUpsertArgs<ExtArgs>>): Prisma__role_permissionsClient<$Result.GetResult<Prisma.$role_permissionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Role_permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {role_permissionsCountArgs} args - Arguments to filter Role_permissions to count.
     * @example
     * // Count the number of Role_permissions
     * const count = await prisma.role_permissions.count({
     *   where: {
     *     // ... the filter for the Role_permissions we want to count
     *   }
     * })
    **/
    count<T extends role_permissionsCountArgs>(
      args?: Subset<T, role_permissionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Role_permissionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role_permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Role_permissionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Role_permissionsAggregateArgs>(args: Subset<T, Role_permissionsAggregateArgs>): Prisma.PrismaPromise<GetRole_permissionsAggregateType<T>>

    /**
     * Group by Role_permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {role_permissionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends role_permissionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: role_permissionsGroupByArgs['orderBy'] }
        : { orderBy?: role_permissionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, role_permissionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRole_permissionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the role_permissions model
   */
  readonly fields: role_permissionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for role_permissions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__role_permissionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    permissions<T extends permissionsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, permissionsDefaultArgs<ExtArgs>>): Prisma__permissionsClient<$Result.GetResult<Prisma.$permissionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    roles<T extends rolesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, rolesDefaultArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the role_permissions model
   */
  interface role_permissionsFieldRefs {
    readonly id: FieldRef<"role_permissions", 'String'>
    readonly role_id: FieldRef<"role_permissions", 'String'>
    readonly permission_id: FieldRef<"role_permissions", 'String'>
  }
    

  // Custom InputTypes
  /**
   * role_permissions findUnique
   */
  export type role_permissionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the role_permissions
     */
    select?: role_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the role_permissions
     */
    omit?: role_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: role_permissionsInclude<ExtArgs> | null
    /**
     * Filter, which role_permissions to fetch.
     */
    where: role_permissionsWhereUniqueInput
  }

  /**
   * role_permissions findUniqueOrThrow
   */
  export type role_permissionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the role_permissions
     */
    select?: role_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the role_permissions
     */
    omit?: role_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: role_permissionsInclude<ExtArgs> | null
    /**
     * Filter, which role_permissions to fetch.
     */
    where: role_permissionsWhereUniqueInput
  }

  /**
   * role_permissions findFirst
   */
  export type role_permissionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the role_permissions
     */
    select?: role_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the role_permissions
     */
    omit?: role_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: role_permissionsInclude<ExtArgs> | null
    /**
     * Filter, which role_permissions to fetch.
     */
    where?: role_permissionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of role_permissions to fetch.
     */
    orderBy?: role_permissionsOrderByWithRelationInput | role_permissionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for role_permissions.
     */
    cursor?: role_permissionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` role_permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` role_permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of role_permissions.
     */
    distinct?: Role_permissionsScalarFieldEnum | Role_permissionsScalarFieldEnum[]
  }

  /**
   * role_permissions findFirstOrThrow
   */
  export type role_permissionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the role_permissions
     */
    select?: role_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the role_permissions
     */
    omit?: role_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: role_permissionsInclude<ExtArgs> | null
    /**
     * Filter, which role_permissions to fetch.
     */
    where?: role_permissionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of role_permissions to fetch.
     */
    orderBy?: role_permissionsOrderByWithRelationInput | role_permissionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for role_permissions.
     */
    cursor?: role_permissionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` role_permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` role_permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of role_permissions.
     */
    distinct?: Role_permissionsScalarFieldEnum | Role_permissionsScalarFieldEnum[]
  }

  /**
   * role_permissions findMany
   */
  export type role_permissionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the role_permissions
     */
    select?: role_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the role_permissions
     */
    omit?: role_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: role_permissionsInclude<ExtArgs> | null
    /**
     * Filter, which role_permissions to fetch.
     */
    where?: role_permissionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of role_permissions to fetch.
     */
    orderBy?: role_permissionsOrderByWithRelationInput | role_permissionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing role_permissions.
     */
    cursor?: role_permissionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` role_permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` role_permissions.
     */
    skip?: number
    distinct?: Role_permissionsScalarFieldEnum | Role_permissionsScalarFieldEnum[]
  }

  /**
   * role_permissions create
   */
  export type role_permissionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the role_permissions
     */
    select?: role_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the role_permissions
     */
    omit?: role_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: role_permissionsInclude<ExtArgs> | null
    /**
     * The data needed to create a role_permissions.
     */
    data: XOR<role_permissionsCreateInput, role_permissionsUncheckedCreateInput>
  }

  /**
   * role_permissions createMany
   */
  export type role_permissionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many role_permissions.
     */
    data: role_permissionsCreateManyInput | role_permissionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * role_permissions createManyAndReturn
   */
  export type role_permissionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the role_permissions
     */
    select?: role_permissionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the role_permissions
     */
    omit?: role_permissionsOmit<ExtArgs> | null
    /**
     * The data used to create many role_permissions.
     */
    data: role_permissionsCreateManyInput | role_permissionsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: role_permissionsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * role_permissions update
   */
  export type role_permissionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the role_permissions
     */
    select?: role_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the role_permissions
     */
    omit?: role_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: role_permissionsInclude<ExtArgs> | null
    /**
     * The data needed to update a role_permissions.
     */
    data: XOR<role_permissionsUpdateInput, role_permissionsUncheckedUpdateInput>
    /**
     * Choose, which role_permissions to update.
     */
    where: role_permissionsWhereUniqueInput
  }

  /**
   * role_permissions updateMany
   */
  export type role_permissionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update role_permissions.
     */
    data: XOR<role_permissionsUpdateManyMutationInput, role_permissionsUncheckedUpdateManyInput>
    /**
     * Filter which role_permissions to update
     */
    where?: role_permissionsWhereInput
    /**
     * Limit how many role_permissions to update.
     */
    limit?: number
  }

  /**
   * role_permissions updateManyAndReturn
   */
  export type role_permissionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the role_permissions
     */
    select?: role_permissionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the role_permissions
     */
    omit?: role_permissionsOmit<ExtArgs> | null
    /**
     * The data used to update role_permissions.
     */
    data: XOR<role_permissionsUpdateManyMutationInput, role_permissionsUncheckedUpdateManyInput>
    /**
     * Filter which role_permissions to update
     */
    where?: role_permissionsWhereInput
    /**
     * Limit how many role_permissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: role_permissionsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * role_permissions upsert
   */
  export type role_permissionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the role_permissions
     */
    select?: role_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the role_permissions
     */
    omit?: role_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: role_permissionsInclude<ExtArgs> | null
    /**
     * The filter to search for the role_permissions to update in case it exists.
     */
    where: role_permissionsWhereUniqueInput
    /**
     * In case the role_permissions found by the `where` argument doesn't exist, create a new role_permissions with this data.
     */
    create: XOR<role_permissionsCreateInput, role_permissionsUncheckedCreateInput>
    /**
     * In case the role_permissions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<role_permissionsUpdateInput, role_permissionsUncheckedUpdateInput>
  }

  /**
   * role_permissions delete
   */
  export type role_permissionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the role_permissions
     */
    select?: role_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the role_permissions
     */
    omit?: role_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: role_permissionsInclude<ExtArgs> | null
    /**
     * Filter which role_permissions to delete.
     */
    where: role_permissionsWhereUniqueInput
  }

  /**
   * role_permissions deleteMany
   */
  export type role_permissionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which role_permissions to delete
     */
    where?: role_permissionsWhereInput
    /**
     * Limit how many role_permissions to delete.
     */
    limit?: number
  }

  /**
   * role_permissions without action
   */
  export type role_permissionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the role_permissions
     */
    select?: role_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the role_permissions
     */
    omit?: role_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: role_permissionsInclude<ExtArgs> | null
  }


  /**
   * Model roles
   */

  export type AggregateRoles = {
    _count: RolesCountAggregateOutputType | null
    _min: RolesMinAggregateOutputType | null
    _max: RolesMaxAggregateOutputType | null
  }

  export type RolesMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
  }

  export type RolesMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
  }

  export type RolesCountAggregateOutputType = {
    id: number
    name: number
    description: number
    _all: number
  }


  export type RolesMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
  }

  export type RolesMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
  }

  export type RolesCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    _all?: true
  }

  export type RolesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which roles to aggregate.
     */
    where?: rolesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of roles to fetch.
     */
    orderBy?: rolesOrderByWithRelationInput | rolesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: rolesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned roles
    **/
    _count?: true | RolesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RolesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RolesMaxAggregateInputType
  }

  export type GetRolesAggregateType<T extends RolesAggregateArgs> = {
        [P in keyof T & keyof AggregateRoles]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoles[P]>
      : GetScalarType<T[P], AggregateRoles[P]>
  }




  export type rolesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: rolesWhereInput
    orderBy?: rolesOrderByWithAggregationInput | rolesOrderByWithAggregationInput[]
    by: RolesScalarFieldEnum[] | RolesScalarFieldEnum
    having?: rolesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RolesCountAggregateInputType | true
    _min?: RolesMinAggregateInputType
    _max?: RolesMaxAggregateInputType
  }

  export type RolesGroupByOutputType = {
    id: string
    name: string
    description: string | null
    _count: RolesCountAggregateOutputType | null
    _min: RolesMinAggregateOutputType | null
    _max: RolesMaxAggregateOutputType | null
  }

  type GetRolesGroupByPayload<T extends rolesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RolesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RolesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RolesGroupByOutputType[P]>
            : GetScalarType<T[P], RolesGroupByOutputType[P]>
        }
      >
    >


  export type rolesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    role_permissions?: boolean | roles$role_permissionsArgs<ExtArgs>
    users?: boolean | roles$usersArgs<ExtArgs>
    _count?: boolean | RolesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roles"]>

  export type rolesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
  }, ExtArgs["result"]["roles"]>

  export type rolesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
  }, ExtArgs["result"]["roles"]>

  export type rolesSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
  }

  export type rolesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description", ExtArgs["result"]["roles"]>
  export type rolesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role_permissions?: boolean | roles$role_permissionsArgs<ExtArgs>
    users?: boolean | roles$usersArgs<ExtArgs>
    _count?: boolean | RolesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type rolesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type rolesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $rolesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "roles"
    objects: {
      role_permissions: Prisma.$role_permissionsPayload<ExtArgs>[]
      users: Prisma.$usersPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
    }, ExtArgs["result"]["roles"]>
    composites: {}
  }

  type rolesGetPayload<S extends boolean | null | undefined | rolesDefaultArgs> = $Result.GetResult<Prisma.$rolesPayload, S>

  type rolesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<rolesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RolesCountAggregateInputType | true
    }

  export interface rolesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['roles'], meta: { name: 'roles' } }
    /**
     * Find zero or one Roles that matches the filter.
     * @param {rolesFindUniqueArgs} args - Arguments to find a Roles
     * @example
     * // Get one Roles
     * const roles = await prisma.roles.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends rolesFindUniqueArgs>(args: SelectSubset<T, rolesFindUniqueArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Roles that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {rolesFindUniqueOrThrowArgs} args - Arguments to find a Roles
     * @example
     * // Get one Roles
     * const roles = await prisma.roles.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends rolesFindUniqueOrThrowArgs>(args: SelectSubset<T, rolesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rolesFindFirstArgs} args - Arguments to find a Roles
     * @example
     * // Get one Roles
     * const roles = await prisma.roles.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends rolesFindFirstArgs>(args?: SelectSubset<T, rolesFindFirstArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Roles that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rolesFindFirstOrThrowArgs} args - Arguments to find a Roles
     * @example
     * // Get one Roles
     * const roles = await prisma.roles.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends rolesFindFirstOrThrowArgs>(args?: SelectSubset<T, rolesFindFirstOrThrowArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rolesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.roles.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.roles.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rolesWithIdOnly = await prisma.roles.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends rolesFindManyArgs>(args?: SelectSubset<T, rolesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Roles.
     * @param {rolesCreateArgs} args - Arguments to create a Roles.
     * @example
     * // Create one Roles
     * const Roles = await prisma.roles.create({
     *   data: {
     *     // ... data to create a Roles
     *   }
     * })
     * 
     */
    create<T extends rolesCreateArgs>(args: SelectSubset<T, rolesCreateArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roles.
     * @param {rolesCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const roles = await prisma.roles.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends rolesCreateManyArgs>(args?: SelectSubset<T, rolesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roles and returns the data saved in the database.
     * @param {rolesCreateManyAndReturnArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const roles = await prisma.roles.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roles and only return the `id`
     * const rolesWithIdOnly = await prisma.roles.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends rolesCreateManyAndReturnArgs>(args?: SelectSubset<T, rolesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Roles.
     * @param {rolesDeleteArgs} args - Arguments to delete one Roles.
     * @example
     * // Delete one Roles
     * const Roles = await prisma.roles.delete({
     *   where: {
     *     // ... filter to delete one Roles
     *   }
     * })
     * 
     */
    delete<T extends rolesDeleteArgs>(args: SelectSubset<T, rolesDeleteArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Roles.
     * @param {rolesUpdateArgs} args - Arguments to update one Roles.
     * @example
     * // Update one Roles
     * const roles = await prisma.roles.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends rolesUpdateArgs>(args: SelectSubset<T, rolesUpdateArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roles.
     * @param {rolesDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.roles.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends rolesDeleteManyArgs>(args?: SelectSubset<T, rolesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rolesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const roles = await prisma.roles.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends rolesUpdateManyArgs>(args: SelectSubset<T, rolesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles and returns the data updated in the database.
     * @param {rolesUpdateManyAndReturnArgs} args - Arguments to update many Roles.
     * @example
     * // Update many Roles
     * const roles = await prisma.roles.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Roles and only return the `id`
     * const rolesWithIdOnly = await prisma.roles.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends rolesUpdateManyAndReturnArgs>(args: SelectSubset<T, rolesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Roles.
     * @param {rolesUpsertArgs} args - Arguments to update or create a Roles.
     * @example
     * // Update or create a Roles
     * const roles = await prisma.roles.upsert({
     *   create: {
     *     // ... data to create a Roles
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Roles we want to update
     *   }
     * })
     */
    upsert<T extends rolesUpsertArgs>(args: SelectSubset<T, rolesUpsertArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rolesCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.roles.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends rolesCountArgs>(
      args?: Subset<T, rolesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RolesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RolesAggregateArgs>(args: Subset<T, RolesAggregateArgs>): Prisma.PrismaPromise<GetRolesAggregateType<T>>

    /**
     * Group by Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {rolesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends rolesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: rolesGroupByArgs['orderBy'] }
        : { orderBy?: rolesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, rolesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRolesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the roles model
   */
  readonly fields: rolesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for roles.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__rolesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role_permissions<T extends roles$role_permissionsArgs<ExtArgs> = {}>(args?: Subset<T, roles$role_permissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$role_permissionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    users<T extends roles$usersArgs<ExtArgs> = {}>(args?: Subset<T, roles$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the roles model
   */
  interface rolesFieldRefs {
    readonly id: FieldRef<"roles", 'String'>
    readonly name: FieldRef<"roles", 'String'>
    readonly description: FieldRef<"roles", 'String'>
  }
    

  // Custom InputTypes
  /**
   * roles findUnique
   */
  export type rolesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * Filter, which roles to fetch.
     */
    where: rolesWhereUniqueInput
  }

  /**
   * roles findUniqueOrThrow
   */
  export type rolesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * Filter, which roles to fetch.
     */
    where: rolesWhereUniqueInput
  }

  /**
   * roles findFirst
   */
  export type rolesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * Filter, which roles to fetch.
     */
    where?: rolesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of roles to fetch.
     */
    orderBy?: rolesOrderByWithRelationInput | rolesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for roles.
     */
    cursor?: rolesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of roles.
     */
    distinct?: RolesScalarFieldEnum | RolesScalarFieldEnum[]
  }

  /**
   * roles findFirstOrThrow
   */
  export type rolesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * Filter, which roles to fetch.
     */
    where?: rolesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of roles to fetch.
     */
    orderBy?: rolesOrderByWithRelationInput | rolesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for roles.
     */
    cursor?: rolesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of roles.
     */
    distinct?: RolesScalarFieldEnum | RolesScalarFieldEnum[]
  }

  /**
   * roles findMany
   */
  export type rolesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * Filter, which roles to fetch.
     */
    where?: rolesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of roles to fetch.
     */
    orderBy?: rolesOrderByWithRelationInput | rolesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing roles.
     */
    cursor?: rolesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` roles.
     */
    skip?: number
    distinct?: RolesScalarFieldEnum | RolesScalarFieldEnum[]
  }

  /**
   * roles create
   */
  export type rolesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * The data needed to create a roles.
     */
    data: XOR<rolesCreateInput, rolesUncheckedCreateInput>
  }

  /**
   * roles createMany
   */
  export type rolesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many roles.
     */
    data: rolesCreateManyInput | rolesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * roles createManyAndReturn
   */
  export type rolesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * The data used to create many roles.
     */
    data: rolesCreateManyInput | rolesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * roles update
   */
  export type rolesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * The data needed to update a roles.
     */
    data: XOR<rolesUpdateInput, rolesUncheckedUpdateInput>
    /**
     * Choose, which roles to update.
     */
    where: rolesWhereUniqueInput
  }

  /**
   * roles updateMany
   */
  export type rolesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update roles.
     */
    data: XOR<rolesUpdateManyMutationInput, rolesUncheckedUpdateManyInput>
    /**
     * Filter which roles to update
     */
    where?: rolesWhereInput
    /**
     * Limit how many roles to update.
     */
    limit?: number
  }

  /**
   * roles updateManyAndReturn
   */
  export type rolesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * The data used to update roles.
     */
    data: XOR<rolesUpdateManyMutationInput, rolesUncheckedUpdateManyInput>
    /**
     * Filter which roles to update
     */
    where?: rolesWhereInput
    /**
     * Limit how many roles to update.
     */
    limit?: number
  }

  /**
   * roles upsert
   */
  export type rolesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * The filter to search for the roles to update in case it exists.
     */
    where: rolesWhereUniqueInput
    /**
     * In case the roles found by the `where` argument doesn't exist, create a new roles with this data.
     */
    create: XOR<rolesCreateInput, rolesUncheckedCreateInput>
    /**
     * In case the roles was found with the provided `where` argument, update it with this data.
     */
    update: XOR<rolesUpdateInput, rolesUncheckedUpdateInput>
  }

  /**
   * roles delete
   */
  export type rolesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
    /**
     * Filter which roles to delete.
     */
    where: rolesWhereUniqueInput
  }

  /**
   * roles deleteMany
   */
  export type rolesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which roles to delete
     */
    where?: rolesWhereInput
    /**
     * Limit how many roles to delete.
     */
    limit?: number
  }

  /**
   * roles.role_permissions
   */
  export type roles$role_permissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the role_permissions
     */
    select?: role_permissionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the role_permissions
     */
    omit?: role_permissionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: role_permissionsInclude<ExtArgs> | null
    where?: role_permissionsWhereInput
    orderBy?: role_permissionsOrderByWithRelationInput | role_permissionsOrderByWithRelationInput[]
    cursor?: role_permissionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Role_permissionsScalarFieldEnum | Role_permissionsScalarFieldEnum[]
  }

  /**
   * roles.users
   */
  export type roles$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    where?: usersWhereInput
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    cursor?: usersWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * roles without action
   */
  export type rolesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the roles
     */
    select?: rolesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the roles
     */
    omit?: rolesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: rolesInclude<ExtArgs> | null
  }


  /**
   * Model sessions
   */

  export type AggregateSessions = {
    _count: SessionsCountAggregateOutputType | null
    _min: SessionsMinAggregateOutputType | null
    _max: SessionsMaxAggregateOutputType | null
  }

  export type SessionsMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    token: string | null
    created_at: Date | null
    expires_at: Date | null
    is_active: boolean | null
  }

  export type SessionsMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    token: string | null
    created_at: Date | null
    expires_at: Date | null
    is_active: boolean | null
  }

  export type SessionsCountAggregateOutputType = {
    id: number
    user_id: number
    token: number
    created_at: number
    expires_at: number
    is_active: number
    _all: number
  }


  export type SessionsMinAggregateInputType = {
    id?: true
    user_id?: true
    token?: true
    created_at?: true
    expires_at?: true
    is_active?: true
  }

  export type SessionsMaxAggregateInputType = {
    id?: true
    user_id?: true
    token?: true
    created_at?: true
    expires_at?: true
    is_active?: true
  }

  export type SessionsCountAggregateInputType = {
    id?: true
    user_id?: true
    token?: true
    created_at?: true
    expires_at?: true
    is_active?: true
    _all?: true
  }

  export type SessionsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sessions to aggregate.
     */
    where?: sessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sessions to fetch.
     */
    orderBy?: sessionsOrderByWithRelationInput | sessionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: sessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned sessions
    **/
    _count?: true | SessionsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionsMaxAggregateInputType
  }

  export type GetSessionsAggregateType<T extends SessionsAggregateArgs> = {
        [P in keyof T & keyof AggregateSessions]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSessions[P]>
      : GetScalarType<T[P], AggregateSessions[P]>
  }




  export type sessionsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: sessionsWhereInput
    orderBy?: sessionsOrderByWithAggregationInput | sessionsOrderByWithAggregationInput[]
    by: SessionsScalarFieldEnum[] | SessionsScalarFieldEnum
    having?: sessionsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionsCountAggregateInputType | true
    _min?: SessionsMinAggregateInputType
    _max?: SessionsMaxAggregateInputType
  }

  export type SessionsGroupByOutputType = {
    id: string
    user_id: string
    token: string
    created_at: Date
    expires_at: Date
    is_active: boolean
    _count: SessionsCountAggregateOutputType | null
    _min: SessionsMinAggregateOutputType | null
    _max: SessionsMaxAggregateOutputType | null
  }

  type GetSessionsGroupByPayload<T extends sessionsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionsGroupByOutputType[P]>
            : GetScalarType<T[P], SessionsGroupByOutputType[P]>
        }
      >
    >


  export type sessionsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    token?: boolean
    created_at?: boolean
    expires_at?: boolean
    is_active?: boolean
    users?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sessions"]>

  export type sessionsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    token?: boolean
    created_at?: boolean
    expires_at?: boolean
    is_active?: boolean
    users?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sessions"]>

  export type sessionsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    token?: boolean
    created_at?: boolean
    expires_at?: boolean
    is_active?: boolean
    users?: boolean | usersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sessions"]>

  export type sessionsSelectScalar = {
    id?: boolean
    user_id?: boolean
    token?: boolean
    created_at?: boolean
    expires_at?: boolean
    is_active?: boolean
  }

  export type sessionsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "token" | "created_at" | "expires_at" | "is_active", ExtArgs["result"]["sessions"]>
  export type sessionsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type sessionsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | usersDefaultArgs<ExtArgs>
  }
  export type sessionsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | usersDefaultArgs<ExtArgs>
  }

  export type $sessionsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "sessions"
    objects: {
      users: Prisma.$usersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      token: string
      created_at: Date
      expires_at: Date
      is_active: boolean
    }, ExtArgs["result"]["sessions"]>
    composites: {}
  }

  type sessionsGetPayload<S extends boolean | null | undefined | sessionsDefaultArgs> = $Result.GetResult<Prisma.$sessionsPayload, S>

  type sessionsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<sessionsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionsCountAggregateInputType | true
    }

  export interface sessionsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['sessions'], meta: { name: 'sessions' } }
    /**
     * Find zero or one Sessions that matches the filter.
     * @param {sessionsFindUniqueArgs} args - Arguments to find a Sessions
     * @example
     * // Get one Sessions
     * const sessions = await prisma.sessions.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends sessionsFindUniqueArgs>(args: SelectSubset<T, sessionsFindUniqueArgs<ExtArgs>>): Prisma__sessionsClient<$Result.GetResult<Prisma.$sessionsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Sessions that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {sessionsFindUniqueOrThrowArgs} args - Arguments to find a Sessions
     * @example
     * // Get one Sessions
     * const sessions = await prisma.sessions.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends sessionsFindUniqueOrThrowArgs>(args: SelectSubset<T, sessionsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__sessionsClient<$Result.GetResult<Prisma.$sessionsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionsFindFirstArgs} args - Arguments to find a Sessions
     * @example
     * // Get one Sessions
     * const sessions = await prisma.sessions.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends sessionsFindFirstArgs>(args?: SelectSubset<T, sessionsFindFirstArgs<ExtArgs>>): Prisma__sessionsClient<$Result.GetResult<Prisma.$sessionsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Sessions that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionsFindFirstOrThrowArgs} args - Arguments to find a Sessions
     * @example
     * // Get one Sessions
     * const sessions = await prisma.sessions.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends sessionsFindFirstOrThrowArgs>(args?: SelectSubset<T, sessionsFindFirstOrThrowArgs<ExtArgs>>): Prisma__sessionsClient<$Result.GetResult<Prisma.$sessionsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.sessions.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.sessions.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionsWithIdOnly = await prisma.sessions.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends sessionsFindManyArgs>(args?: SelectSubset<T, sessionsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sessionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Sessions.
     * @param {sessionsCreateArgs} args - Arguments to create a Sessions.
     * @example
     * // Create one Sessions
     * const Sessions = await prisma.sessions.create({
     *   data: {
     *     // ... data to create a Sessions
     *   }
     * })
     * 
     */
    create<T extends sessionsCreateArgs>(args: SelectSubset<T, sessionsCreateArgs<ExtArgs>>): Prisma__sessionsClient<$Result.GetResult<Prisma.$sessionsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {sessionsCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const sessions = await prisma.sessions.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends sessionsCreateManyArgs>(args?: SelectSubset<T, sessionsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {sessionsCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const sessions = await prisma.sessions.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionsWithIdOnly = await prisma.sessions.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends sessionsCreateManyAndReturnArgs>(args?: SelectSubset<T, sessionsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sessionsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Sessions.
     * @param {sessionsDeleteArgs} args - Arguments to delete one Sessions.
     * @example
     * // Delete one Sessions
     * const Sessions = await prisma.sessions.delete({
     *   where: {
     *     // ... filter to delete one Sessions
     *   }
     * })
     * 
     */
    delete<T extends sessionsDeleteArgs>(args: SelectSubset<T, sessionsDeleteArgs<ExtArgs>>): Prisma__sessionsClient<$Result.GetResult<Prisma.$sessionsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Sessions.
     * @param {sessionsUpdateArgs} args - Arguments to update one Sessions.
     * @example
     * // Update one Sessions
     * const sessions = await prisma.sessions.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends sessionsUpdateArgs>(args: SelectSubset<T, sessionsUpdateArgs<ExtArgs>>): Prisma__sessionsClient<$Result.GetResult<Prisma.$sessionsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {sessionsDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.sessions.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends sessionsDeleteManyArgs>(args?: SelectSubset<T, sessionsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const sessions = await prisma.sessions.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends sessionsUpdateManyArgs>(args: SelectSubset<T, sessionsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {sessionsUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const sessions = await prisma.sessions.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionsWithIdOnly = await prisma.sessions.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends sessionsUpdateManyAndReturnArgs>(args: SelectSubset<T, sessionsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sessionsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Sessions.
     * @param {sessionsUpsertArgs} args - Arguments to update or create a Sessions.
     * @example
     * // Update or create a Sessions
     * const sessions = await prisma.sessions.upsert({
     *   create: {
     *     // ... data to create a Sessions
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sessions we want to update
     *   }
     * })
     */
    upsert<T extends sessionsUpsertArgs>(args: SelectSubset<T, sessionsUpsertArgs<ExtArgs>>): Prisma__sessionsClient<$Result.GetResult<Prisma.$sessionsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionsCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.sessions.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends sessionsCountArgs>(
      args?: Subset<T, sessionsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionsAggregateArgs>(args: Subset<T, SessionsAggregateArgs>): Prisma.PrismaPromise<GetSessionsAggregateType<T>>

    /**
     * Group by Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sessionsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends sessionsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: sessionsGroupByArgs['orderBy'] }
        : { orderBy?: sessionsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, sessionsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the sessions model
   */
  readonly fields: sessionsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for sessions.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__sessionsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the sessions model
   */
  interface sessionsFieldRefs {
    readonly id: FieldRef<"sessions", 'String'>
    readonly user_id: FieldRef<"sessions", 'String'>
    readonly token: FieldRef<"sessions", 'String'>
    readonly created_at: FieldRef<"sessions", 'DateTime'>
    readonly expires_at: FieldRef<"sessions", 'DateTime'>
    readonly is_active: FieldRef<"sessions", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * sessions findUnique
   */
  export type sessionsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sessions
     */
    select?: sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sessions
     */
    omit?: sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionsInclude<ExtArgs> | null
    /**
     * Filter, which sessions to fetch.
     */
    where: sessionsWhereUniqueInput
  }

  /**
   * sessions findUniqueOrThrow
   */
  export type sessionsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sessions
     */
    select?: sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sessions
     */
    omit?: sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionsInclude<ExtArgs> | null
    /**
     * Filter, which sessions to fetch.
     */
    where: sessionsWhereUniqueInput
  }

  /**
   * sessions findFirst
   */
  export type sessionsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sessions
     */
    select?: sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sessions
     */
    omit?: sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionsInclude<ExtArgs> | null
    /**
     * Filter, which sessions to fetch.
     */
    where?: sessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sessions to fetch.
     */
    orderBy?: sessionsOrderByWithRelationInput | sessionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sessions.
     */
    cursor?: sessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sessions.
     */
    distinct?: SessionsScalarFieldEnum | SessionsScalarFieldEnum[]
  }

  /**
   * sessions findFirstOrThrow
   */
  export type sessionsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sessions
     */
    select?: sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sessions
     */
    omit?: sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionsInclude<ExtArgs> | null
    /**
     * Filter, which sessions to fetch.
     */
    where?: sessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sessions to fetch.
     */
    orderBy?: sessionsOrderByWithRelationInput | sessionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for sessions.
     */
    cursor?: sessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of sessions.
     */
    distinct?: SessionsScalarFieldEnum | SessionsScalarFieldEnum[]
  }

  /**
   * sessions findMany
   */
  export type sessionsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sessions
     */
    select?: sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sessions
     */
    omit?: sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionsInclude<ExtArgs> | null
    /**
     * Filter, which sessions to fetch.
     */
    where?: sessionsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of sessions to fetch.
     */
    orderBy?: sessionsOrderByWithRelationInput | sessionsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing sessions.
     */
    cursor?: sessionsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` sessions.
     */
    skip?: number
    distinct?: SessionsScalarFieldEnum | SessionsScalarFieldEnum[]
  }

  /**
   * sessions create
   */
  export type sessionsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sessions
     */
    select?: sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sessions
     */
    omit?: sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionsInclude<ExtArgs> | null
    /**
     * The data needed to create a sessions.
     */
    data: XOR<sessionsCreateInput, sessionsUncheckedCreateInput>
  }

  /**
   * sessions createMany
   */
  export type sessionsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many sessions.
     */
    data: sessionsCreateManyInput | sessionsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * sessions createManyAndReturn
   */
  export type sessionsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sessions
     */
    select?: sessionsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the sessions
     */
    omit?: sessionsOmit<ExtArgs> | null
    /**
     * The data used to create many sessions.
     */
    data: sessionsCreateManyInput | sessionsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * sessions update
   */
  export type sessionsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sessions
     */
    select?: sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sessions
     */
    omit?: sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionsInclude<ExtArgs> | null
    /**
     * The data needed to update a sessions.
     */
    data: XOR<sessionsUpdateInput, sessionsUncheckedUpdateInput>
    /**
     * Choose, which sessions to update.
     */
    where: sessionsWhereUniqueInput
  }

  /**
   * sessions updateMany
   */
  export type sessionsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update sessions.
     */
    data: XOR<sessionsUpdateManyMutationInput, sessionsUncheckedUpdateManyInput>
    /**
     * Filter which sessions to update
     */
    where?: sessionsWhereInput
    /**
     * Limit how many sessions to update.
     */
    limit?: number
  }

  /**
   * sessions updateManyAndReturn
   */
  export type sessionsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sessions
     */
    select?: sessionsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the sessions
     */
    omit?: sessionsOmit<ExtArgs> | null
    /**
     * The data used to update sessions.
     */
    data: XOR<sessionsUpdateManyMutationInput, sessionsUncheckedUpdateManyInput>
    /**
     * Filter which sessions to update
     */
    where?: sessionsWhereInput
    /**
     * Limit how many sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * sessions upsert
   */
  export type sessionsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sessions
     */
    select?: sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sessions
     */
    omit?: sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionsInclude<ExtArgs> | null
    /**
     * The filter to search for the sessions to update in case it exists.
     */
    where: sessionsWhereUniqueInput
    /**
     * In case the sessions found by the `where` argument doesn't exist, create a new sessions with this data.
     */
    create: XOR<sessionsCreateInput, sessionsUncheckedCreateInput>
    /**
     * In case the sessions was found with the provided `where` argument, update it with this data.
     */
    update: XOR<sessionsUpdateInput, sessionsUncheckedUpdateInput>
  }

  /**
   * sessions delete
   */
  export type sessionsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sessions
     */
    select?: sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sessions
     */
    omit?: sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionsInclude<ExtArgs> | null
    /**
     * Filter which sessions to delete.
     */
    where: sessionsWhereUniqueInput
  }

  /**
   * sessions deleteMany
   */
  export type sessionsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which sessions to delete
     */
    where?: sessionsWhereInput
    /**
     * Limit how many sessions to delete.
     */
    limit?: number
  }

  /**
   * sessions without action
   */
  export type sessionsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sessions
     */
    select?: sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sessions
     */
    omit?: sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionsInclude<ExtArgs> | null
  }


  /**
   * Model trips
   */

  export type AggregateTrips = {
    _count: TripsCountAggregateOutputType | null
    _avg: TripsAvgAggregateOutputType | null
    _sum: TripsSumAggregateOutputType | null
    _min: TripsMinAggregateOutputType | null
    _max: TripsMaxAggregateOutputType | null
  }

  export type TripsAvgAggregateOutputType = {
    start_odometer: number | null
    end_odometer: number | null
    fuel_used: number | null
  }

  export type TripsSumAggregateOutputType = {
    start_odometer: number | null
    end_odometer: number | null
    fuel_used: number | null
  }

  export type TripsMinAggregateOutputType = {
    id: string | null
    request_id: string | null
    vehicle_id: string | null
    start_odometer: number | null
    end_odometer: number | null
    start_time: Date | null
    end_time: Date | null
    fuel_used: number | null
    trip_notes: string | null
    created_at: Date | null
    driver_id: string | null
  }

  export type TripsMaxAggregateOutputType = {
    id: string | null
    request_id: string | null
    vehicle_id: string | null
    start_odometer: number | null
    end_odometer: number | null
    start_time: Date | null
    end_time: Date | null
    fuel_used: number | null
    trip_notes: string | null
    created_at: Date | null
    driver_id: string | null
  }

  export type TripsCountAggregateOutputType = {
    id: number
    request_id: number
    vehicle_id: number
    start_odometer: number
    end_odometer: number
    start_time: number
    end_time: number
    fuel_used: number
    trip_notes: number
    created_at: number
    driver_id: number
    _all: number
  }


  export type TripsAvgAggregateInputType = {
    start_odometer?: true
    end_odometer?: true
    fuel_used?: true
  }

  export type TripsSumAggregateInputType = {
    start_odometer?: true
    end_odometer?: true
    fuel_used?: true
  }

  export type TripsMinAggregateInputType = {
    id?: true
    request_id?: true
    vehicle_id?: true
    start_odometer?: true
    end_odometer?: true
    start_time?: true
    end_time?: true
    fuel_used?: true
    trip_notes?: true
    created_at?: true
    driver_id?: true
  }

  export type TripsMaxAggregateInputType = {
    id?: true
    request_id?: true
    vehicle_id?: true
    start_odometer?: true
    end_odometer?: true
    start_time?: true
    end_time?: true
    fuel_used?: true
    trip_notes?: true
    created_at?: true
    driver_id?: true
  }

  export type TripsCountAggregateInputType = {
    id?: true
    request_id?: true
    vehicle_id?: true
    start_odometer?: true
    end_odometer?: true
    start_time?: true
    end_time?: true
    fuel_used?: true
    trip_notes?: true
    created_at?: true
    driver_id?: true
    _all?: true
  }

  export type TripsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which trips to aggregate.
     */
    where?: tripsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of trips to fetch.
     */
    orderBy?: tripsOrderByWithRelationInput | tripsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tripsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` trips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` trips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned trips
    **/
    _count?: true | TripsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TripsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TripsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TripsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TripsMaxAggregateInputType
  }

  export type GetTripsAggregateType<T extends TripsAggregateArgs> = {
        [P in keyof T & keyof AggregateTrips]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrips[P]>
      : GetScalarType<T[P], AggregateTrips[P]>
  }




  export type tripsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tripsWhereInput
    orderBy?: tripsOrderByWithAggregationInput | tripsOrderByWithAggregationInput[]
    by: TripsScalarFieldEnum[] | TripsScalarFieldEnum
    having?: tripsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TripsCountAggregateInputType | true
    _avg?: TripsAvgAggregateInputType
    _sum?: TripsSumAggregateInputType
    _min?: TripsMinAggregateInputType
    _max?: TripsMaxAggregateInputType
  }

  export type TripsGroupByOutputType = {
    id: string
    request_id: string | null
    vehicle_id: string
    start_odometer: number
    end_odometer: number | null
    start_time: Date
    end_time: Date | null
    fuel_used: number | null
    trip_notes: string | null
    created_at: Date
    driver_id: string
    _count: TripsCountAggregateOutputType | null
    _avg: TripsAvgAggregateOutputType | null
    _sum: TripsSumAggregateOutputType | null
    _min: TripsMinAggregateOutputType | null
    _max: TripsMaxAggregateOutputType | null
  }

  type GetTripsGroupByPayload<T extends tripsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TripsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TripsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TripsGroupByOutputType[P]>
            : GetScalarType<T[P], TripsGroupByOutputType[P]>
        }
      >
    >


  export type tripsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    request_id?: boolean
    vehicle_id?: boolean
    start_odometer?: boolean
    end_odometer?: boolean
    start_time?: boolean
    end_time?: boolean
    fuel_used?: boolean
    trip_notes?: boolean
    created_at?: boolean
    driver_id?: boolean
    users?: boolean | usersDefaultArgs<ExtArgs>
    requests?: boolean | trips$requestsArgs<ExtArgs>
    vehicles?: boolean | vehiclesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trips"]>

  export type tripsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    request_id?: boolean
    vehicle_id?: boolean
    start_odometer?: boolean
    end_odometer?: boolean
    start_time?: boolean
    end_time?: boolean
    fuel_used?: boolean
    trip_notes?: boolean
    created_at?: boolean
    driver_id?: boolean
    users?: boolean | usersDefaultArgs<ExtArgs>
    requests?: boolean | trips$requestsArgs<ExtArgs>
    vehicles?: boolean | vehiclesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trips"]>

  export type tripsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    request_id?: boolean
    vehicle_id?: boolean
    start_odometer?: boolean
    end_odometer?: boolean
    start_time?: boolean
    end_time?: boolean
    fuel_used?: boolean
    trip_notes?: boolean
    created_at?: boolean
    driver_id?: boolean
    users?: boolean | usersDefaultArgs<ExtArgs>
    requests?: boolean | trips$requestsArgs<ExtArgs>
    vehicles?: boolean | vehiclesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trips"]>

  export type tripsSelectScalar = {
    id?: boolean
    request_id?: boolean
    vehicle_id?: boolean
    start_odometer?: boolean
    end_odometer?: boolean
    start_time?: boolean
    end_time?: boolean
    fuel_used?: boolean
    trip_notes?: boolean
    created_at?: boolean
    driver_id?: boolean
  }

  export type tripsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "request_id" | "vehicle_id" | "start_odometer" | "end_odometer" | "start_time" | "end_time" | "fuel_used" | "trip_notes" | "created_at" | "driver_id", ExtArgs["result"]["trips"]>
  export type tripsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | usersDefaultArgs<ExtArgs>
    requests?: boolean | trips$requestsArgs<ExtArgs>
    vehicles?: boolean | vehiclesDefaultArgs<ExtArgs>
  }
  export type tripsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | usersDefaultArgs<ExtArgs>
    requests?: boolean | trips$requestsArgs<ExtArgs>
    vehicles?: boolean | vehiclesDefaultArgs<ExtArgs>
  }
  export type tripsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | usersDefaultArgs<ExtArgs>
    requests?: boolean | trips$requestsArgs<ExtArgs>
    vehicles?: boolean | vehiclesDefaultArgs<ExtArgs>
  }

  export type $tripsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "trips"
    objects: {
      users: Prisma.$usersPayload<ExtArgs>
      requests: Prisma.$requestsPayload<ExtArgs> | null
      vehicles: Prisma.$vehiclesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      request_id: string | null
      vehicle_id: string
      start_odometer: number
      end_odometer: number | null
      start_time: Date
      end_time: Date | null
      fuel_used: number | null
      trip_notes: string | null
      created_at: Date
      driver_id: string
    }, ExtArgs["result"]["trips"]>
    composites: {}
  }

  type tripsGetPayload<S extends boolean | null | undefined | tripsDefaultArgs> = $Result.GetResult<Prisma.$tripsPayload, S>

  type tripsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<tripsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TripsCountAggregateInputType | true
    }

  export interface tripsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['trips'], meta: { name: 'trips' } }
    /**
     * Find zero or one Trips that matches the filter.
     * @param {tripsFindUniqueArgs} args - Arguments to find a Trips
     * @example
     * // Get one Trips
     * const trips = await prisma.trips.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tripsFindUniqueArgs>(args: SelectSubset<T, tripsFindUniqueArgs<ExtArgs>>): Prisma__tripsClient<$Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Trips that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {tripsFindUniqueOrThrowArgs} args - Arguments to find a Trips
     * @example
     * // Get one Trips
     * const trips = await prisma.trips.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tripsFindUniqueOrThrowArgs>(args: SelectSubset<T, tripsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__tripsClient<$Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Trips that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tripsFindFirstArgs} args - Arguments to find a Trips
     * @example
     * // Get one Trips
     * const trips = await prisma.trips.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tripsFindFirstArgs>(args?: SelectSubset<T, tripsFindFirstArgs<ExtArgs>>): Prisma__tripsClient<$Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Trips that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tripsFindFirstOrThrowArgs} args - Arguments to find a Trips
     * @example
     * // Get one Trips
     * const trips = await prisma.trips.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tripsFindFirstOrThrowArgs>(args?: SelectSubset<T, tripsFindFirstOrThrowArgs<ExtArgs>>): Prisma__tripsClient<$Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Trips that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tripsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Trips
     * const trips = await prisma.trips.findMany()
     * 
     * // Get first 10 Trips
     * const trips = await prisma.trips.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tripsWithIdOnly = await prisma.trips.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends tripsFindManyArgs>(args?: SelectSubset<T, tripsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Trips.
     * @param {tripsCreateArgs} args - Arguments to create a Trips.
     * @example
     * // Create one Trips
     * const Trips = await prisma.trips.create({
     *   data: {
     *     // ... data to create a Trips
     *   }
     * })
     * 
     */
    create<T extends tripsCreateArgs>(args: SelectSubset<T, tripsCreateArgs<ExtArgs>>): Prisma__tripsClient<$Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Trips.
     * @param {tripsCreateManyArgs} args - Arguments to create many Trips.
     * @example
     * // Create many Trips
     * const trips = await prisma.trips.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends tripsCreateManyArgs>(args?: SelectSubset<T, tripsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Trips and returns the data saved in the database.
     * @param {tripsCreateManyAndReturnArgs} args - Arguments to create many Trips.
     * @example
     * // Create many Trips
     * const trips = await prisma.trips.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Trips and only return the `id`
     * const tripsWithIdOnly = await prisma.trips.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends tripsCreateManyAndReturnArgs>(args?: SelectSubset<T, tripsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Trips.
     * @param {tripsDeleteArgs} args - Arguments to delete one Trips.
     * @example
     * // Delete one Trips
     * const Trips = await prisma.trips.delete({
     *   where: {
     *     // ... filter to delete one Trips
     *   }
     * })
     * 
     */
    delete<T extends tripsDeleteArgs>(args: SelectSubset<T, tripsDeleteArgs<ExtArgs>>): Prisma__tripsClient<$Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Trips.
     * @param {tripsUpdateArgs} args - Arguments to update one Trips.
     * @example
     * // Update one Trips
     * const trips = await prisma.trips.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends tripsUpdateArgs>(args: SelectSubset<T, tripsUpdateArgs<ExtArgs>>): Prisma__tripsClient<$Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Trips.
     * @param {tripsDeleteManyArgs} args - Arguments to filter Trips to delete.
     * @example
     * // Delete a few Trips
     * const { count } = await prisma.trips.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends tripsDeleteManyArgs>(args?: SelectSubset<T, tripsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Trips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tripsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Trips
     * const trips = await prisma.trips.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends tripsUpdateManyArgs>(args: SelectSubset<T, tripsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Trips and returns the data updated in the database.
     * @param {tripsUpdateManyAndReturnArgs} args - Arguments to update many Trips.
     * @example
     * // Update many Trips
     * const trips = await prisma.trips.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Trips and only return the `id`
     * const tripsWithIdOnly = await prisma.trips.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends tripsUpdateManyAndReturnArgs>(args: SelectSubset<T, tripsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Trips.
     * @param {tripsUpsertArgs} args - Arguments to update or create a Trips.
     * @example
     * // Update or create a Trips
     * const trips = await prisma.trips.upsert({
     *   create: {
     *     // ... data to create a Trips
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Trips we want to update
     *   }
     * })
     */
    upsert<T extends tripsUpsertArgs>(args: SelectSubset<T, tripsUpsertArgs<ExtArgs>>): Prisma__tripsClient<$Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Trips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tripsCountArgs} args - Arguments to filter Trips to count.
     * @example
     * // Count the number of Trips
     * const count = await prisma.trips.count({
     *   where: {
     *     // ... the filter for the Trips we want to count
     *   }
     * })
    **/
    count<T extends tripsCountArgs>(
      args?: Subset<T, tripsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TripsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Trips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TripsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TripsAggregateArgs>(args: Subset<T, TripsAggregateArgs>): Prisma.PrismaPromise<GetTripsAggregateType<T>>

    /**
     * Group by Trips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tripsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tripsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tripsGroupByArgs['orderBy'] }
        : { orderBy?: tripsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tripsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTripsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the trips model
   */
  readonly fields: tripsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for trips.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tripsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends usersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, usersDefaultArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    requests<T extends trips$requestsArgs<ExtArgs> = {}>(args?: Subset<T, trips$requestsArgs<ExtArgs>>): Prisma__requestsClient<$Result.GetResult<Prisma.$requestsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    vehicles<T extends vehiclesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, vehiclesDefaultArgs<ExtArgs>>): Prisma__vehiclesClient<$Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the trips model
   */
  interface tripsFieldRefs {
    readonly id: FieldRef<"trips", 'String'>
    readonly request_id: FieldRef<"trips", 'String'>
    readonly vehicle_id: FieldRef<"trips", 'String'>
    readonly start_odometer: FieldRef<"trips", 'Int'>
    readonly end_odometer: FieldRef<"trips", 'Int'>
    readonly start_time: FieldRef<"trips", 'DateTime'>
    readonly end_time: FieldRef<"trips", 'DateTime'>
    readonly fuel_used: FieldRef<"trips", 'Float'>
    readonly trip_notes: FieldRef<"trips", 'String'>
    readonly created_at: FieldRef<"trips", 'DateTime'>
    readonly driver_id: FieldRef<"trips", 'String'>
  }
    

  // Custom InputTypes
  /**
   * trips findUnique
   */
  export type tripsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the trips
     */
    select?: tripsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the trips
     */
    omit?: tripsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tripsInclude<ExtArgs> | null
    /**
     * Filter, which trips to fetch.
     */
    where: tripsWhereUniqueInput
  }

  /**
   * trips findUniqueOrThrow
   */
  export type tripsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the trips
     */
    select?: tripsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the trips
     */
    omit?: tripsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tripsInclude<ExtArgs> | null
    /**
     * Filter, which trips to fetch.
     */
    where: tripsWhereUniqueInput
  }

  /**
   * trips findFirst
   */
  export type tripsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the trips
     */
    select?: tripsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the trips
     */
    omit?: tripsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tripsInclude<ExtArgs> | null
    /**
     * Filter, which trips to fetch.
     */
    where?: tripsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of trips to fetch.
     */
    orderBy?: tripsOrderByWithRelationInput | tripsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for trips.
     */
    cursor?: tripsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` trips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` trips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of trips.
     */
    distinct?: TripsScalarFieldEnum | TripsScalarFieldEnum[]
  }

  /**
   * trips findFirstOrThrow
   */
  export type tripsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the trips
     */
    select?: tripsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the trips
     */
    omit?: tripsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tripsInclude<ExtArgs> | null
    /**
     * Filter, which trips to fetch.
     */
    where?: tripsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of trips to fetch.
     */
    orderBy?: tripsOrderByWithRelationInput | tripsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for trips.
     */
    cursor?: tripsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` trips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` trips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of trips.
     */
    distinct?: TripsScalarFieldEnum | TripsScalarFieldEnum[]
  }

  /**
   * trips findMany
   */
  export type tripsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the trips
     */
    select?: tripsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the trips
     */
    omit?: tripsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tripsInclude<ExtArgs> | null
    /**
     * Filter, which trips to fetch.
     */
    where?: tripsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of trips to fetch.
     */
    orderBy?: tripsOrderByWithRelationInput | tripsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing trips.
     */
    cursor?: tripsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` trips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` trips.
     */
    skip?: number
    distinct?: TripsScalarFieldEnum | TripsScalarFieldEnum[]
  }

  /**
   * trips create
   */
  export type tripsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the trips
     */
    select?: tripsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the trips
     */
    omit?: tripsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tripsInclude<ExtArgs> | null
    /**
     * The data needed to create a trips.
     */
    data: XOR<tripsCreateInput, tripsUncheckedCreateInput>
  }

  /**
   * trips createMany
   */
  export type tripsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many trips.
     */
    data: tripsCreateManyInput | tripsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * trips createManyAndReturn
   */
  export type tripsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the trips
     */
    select?: tripsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the trips
     */
    omit?: tripsOmit<ExtArgs> | null
    /**
     * The data used to create many trips.
     */
    data: tripsCreateManyInput | tripsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tripsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * trips update
   */
  export type tripsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the trips
     */
    select?: tripsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the trips
     */
    omit?: tripsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tripsInclude<ExtArgs> | null
    /**
     * The data needed to update a trips.
     */
    data: XOR<tripsUpdateInput, tripsUncheckedUpdateInput>
    /**
     * Choose, which trips to update.
     */
    where: tripsWhereUniqueInput
  }

  /**
   * trips updateMany
   */
  export type tripsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update trips.
     */
    data: XOR<tripsUpdateManyMutationInput, tripsUncheckedUpdateManyInput>
    /**
     * Filter which trips to update
     */
    where?: tripsWhereInput
    /**
     * Limit how many trips to update.
     */
    limit?: number
  }

  /**
   * trips updateManyAndReturn
   */
  export type tripsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the trips
     */
    select?: tripsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the trips
     */
    omit?: tripsOmit<ExtArgs> | null
    /**
     * The data used to update trips.
     */
    data: XOR<tripsUpdateManyMutationInput, tripsUncheckedUpdateManyInput>
    /**
     * Filter which trips to update
     */
    where?: tripsWhereInput
    /**
     * Limit how many trips to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tripsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * trips upsert
   */
  export type tripsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the trips
     */
    select?: tripsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the trips
     */
    omit?: tripsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tripsInclude<ExtArgs> | null
    /**
     * The filter to search for the trips to update in case it exists.
     */
    where: tripsWhereUniqueInput
    /**
     * In case the trips found by the `where` argument doesn't exist, create a new trips with this data.
     */
    create: XOR<tripsCreateInput, tripsUncheckedCreateInput>
    /**
     * In case the trips was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tripsUpdateInput, tripsUncheckedUpdateInput>
  }

  /**
   * trips delete
   */
  export type tripsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the trips
     */
    select?: tripsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the trips
     */
    omit?: tripsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tripsInclude<ExtArgs> | null
    /**
     * Filter which trips to delete.
     */
    where: tripsWhereUniqueInput
  }

  /**
   * trips deleteMany
   */
  export type tripsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which trips to delete
     */
    where?: tripsWhereInput
    /**
     * Limit how many trips to delete.
     */
    limit?: number
  }

  /**
   * trips.requests
   */
  export type trips$requestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsInclude<ExtArgs> | null
    where?: requestsWhereInput
  }

  /**
   * trips without action
   */
  export type tripsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the trips
     */
    select?: tripsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the trips
     */
    omit?: tripsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tripsInclude<ExtArgs> | null
  }


  /**
   * Model users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersMinAggregateOutputType = {
    id: string | null
    organization_id: string | null
    username: string | null
    password_hash: string | null
    email: string | null
    full_name: string | null
    phone: string | null
    status: string | null
    created_at: Date | null
    last_login: Date | null
    role_id: string | null
  }

  export type UsersMaxAggregateOutputType = {
    id: string | null
    organization_id: string | null
    username: string | null
    password_hash: string | null
    email: string | null
    full_name: string | null
    phone: string | null
    status: string | null
    created_at: Date | null
    last_login: Date | null
    role_id: string | null
  }

  export type UsersCountAggregateOutputType = {
    id: number
    organization_id: number
    username: number
    password_hash: number
    email: number
    full_name: number
    phone: number
    status: number
    created_at: number
    last_login: number
    role_id: number
    _all: number
  }


  export type UsersMinAggregateInputType = {
    id?: true
    organization_id?: true
    username?: true
    password_hash?: true
    email?: true
    full_name?: true
    phone?: true
    status?: true
    created_at?: true
    last_login?: true
    role_id?: true
  }

  export type UsersMaxAggregateInputType = {
    id?: true
    organization_id?: true
    username?: true
    password_hash?: true
    email?: true
    full_name?: true
    phone?: true
    status?: true
    created_at?: true
    last_login?: true
    role_id?: true
  }

  export type UsersCountAggregateInputType = {
    id?: true
    organization_id?: true
    username?: true
    password_hash?: true
    email?: true
    full_name?: true
    phone?: true
    status?: true
    created_at?: true
    last_login?: true
    role_id?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to aggregate.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type usersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usersWhereInput
    orderBy?: usersOrderByWithAggregationInput | usersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: usersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    id: string
    organization_id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone: string | null
    status: string
    created_at: Date
    last_login: Date | null
    role_id: string
    _count: UsersCountAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends usersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type usersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organization_id?: boolean
    username?: boolean
    password_hash?: boolean
    email?: boolean
    full_name?: boolean
    phone?: boolean
    status?: boolean
    created_at?: boolean
    last_login?: boolean
    role_id?: boolean
    reports?: boolean | users$reportsArgs<ExtArgs>
    requests_requests_requester_idTousers?: boolean | users$requests_requests_requester_idTousersArgs<ExtArgs>
    requests_requests_reviewed_byTousers?: boolean | users$requests_requests_reviewed_byTousersArgs<ExtArgs>
    sessions?: boolean | users$sessionsArgs<ExtArgs>
    trips?: boolean | users$tripsArgs<ExtArgs>
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
    roles?: boolean | rolesDefaultArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>

  export type usersSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organization_id?: boolean
    username?: boolean
    password_hash?: boolean
    email?: boolean
    full_name?: boolean
    phone?: boolean
    status?: boolean
    created_at?: boolean
    last_login?: boolean
    role_id?: boolean
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
    roles?: boolean | rolesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>

  export type usersSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organization_id?: boolean
    username?: boolean
    password_hash?: boolean
    email?: boolean
    full_name?: boolean
    phone?: boolean
    status?: boolean
    created_at?: boolean
    last_login?: boolean
    role_id?: boolean
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
    roles?: boolean | rolesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>

  export type usersSelectScalar = {
    id?: boolean
    organization_id?: boolean
    username?: boolean
    password_hash?: boolean
    email?: boolean
    full_name?: boolean
    phone?: boolean
    status?: boolean
    created_at?: boolean
    last_login?: boolean
    role_id?: boolean
  }

  export type usersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "organization_id" | "username" | "password_hash" | "email" | "full_name" | "phone" | "status" | "created_at" | "last_login" | "role_id", ExtArgs["result"]["users"]>
  export type usersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reports?: boolean | users$reportsArgs<ExtArgs>
    requests_requests_requester_idTousers?: boolean | users$requests_requests_requester_idTousersArgs<ExtArgs>
    requests_requests_reviewed_byTousers?: boolean | users$requests_requests_reviewed_byTousersArgs<ExtArgs>
    sessions?: boolean | users$sessionsArgs<ExtArgs>
    trips?: boolean | users$tripsArgs<ExtArgs>
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
    roles?: boolean | rolesDefaultArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type usersIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
    roles?: boolean | rolesDefaultArgs<ExtArgs>
  }
  export type usersIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
    roles?: boolean | rolesDefaultArgs<ExtArgs>
  }

  export type $usersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "users"
    objects: {
      reports: Prisma.$reportsPayload<ExtArgs>[]
      requests_requests_requester_idTousers: Prisma.$requestsPayload<ExtArgs>[]
      requests_requests_reviewed_byTousers: Prisma.$requestsPayload<ExtArgs>[]
      sessions: Prisma.$sessionsPayload<ExtArgs>[]
      trips: Prisma.$tripsPayload<ExtArgs>[]
      organizations: Prisma.$organizationsPayload<ExtArgs>
      roles: Prisma.$rolesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organization_id: string
      username: string
      password_hash: string
      email: string
      full_name: string
      phone: string | null
      status: string
      created_at: Date
      last_login: Date | null
      role_id: string
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type usersGetPayload<S extends boolean | null | undefined | usersDefaultArgs> = $Result.GetResult<Prisma.$usersPayload, S>

  type usersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<usersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface usersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['users'], meta: { name: 'users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {usersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usersFindUniqueArgs>(args: SelectSubset<T, usersFindUniqueArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs>(args: SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usersFindFirstArgs>(args?: SelectSubset<T, usersFindFirstArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs>(args?: SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends usersFindManyArgs>(args?: SelectSubset<T, usersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends usersCreateArgs>(args: SelectSubset<T, usersCreateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {usersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends usersCreateManyArgs>(args?: SelectSubset<T, usersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {usersCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends usersCreateManyAndReturnArgs>(args?: SelectSubset<T, usersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends usersDeleteArgs>(args: SelectSubset<T, usersDeleteArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends usersUpdateArgs>(args: SelectSubset<T, usersUpdateArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends usersDeleteManyArgs>(args?: SelectSubset<T, usersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends usersUpdateManyArgs>(args: SelectSubset<T, usersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {usersUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends usersUpdateManyAndReturnArgs>(args: SelectSubset<T, usersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends usersUpsertArgs>(args: SelectSubset<T, usersUpsertArgs<ExtArgs>>): Prisma__usersClient<$Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends usersCountArgs>(
      args?: Subset<T, usersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends usersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: usersGroupByArgs['orderBy'] }
        : { orderBy?: usersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the users model
   */
  readonly fields: usersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__usersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reports<T extends users$reportsArgs<ExtArgs> = {}>(args?: Subset<T, users$reportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$reportsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    requests_requests_requester_idTousers<T extends users$requests_requests_requester_idTousersArgs<ExtArgs> = {}>(args?: Subset<T, users$requests_requests_requester_idTousersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$requestsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    requests_requests_reviewed_byTousers<T extends users$requests_requests_reviewed_byTousersArgs<ExtArgs> = {}>(args?: Subset<T, users$requests_requests_reviewed_byTousersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$requestsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends users$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, users$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$sessionsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    trips<T extends users$tripsArgs<ExtArgs> = {}>(args?: Subset<T, users$tripsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    organizations<T extends organizationsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, organizationsDefaultArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    roles<T extends rolesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, rolesDefaultArgs<ExtArgs>>): Prisma__rolesClient<$Result.GetResult<Prisma.$rolesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the users model
   */
  interface usersFieldRefs {
    readonly id: FieldRef<"users", 'String'>
    readonly organization_id: FieldRef<"users", 'String'>
    readonly username: FieldRef<"users", 'String'>
    readonly password_hash: FieldRef<"users", 'String'>
    readonly email: FieldRef<"users", 'String'>
    readonly full_name: FieldRef<"users", 'String'>
    readonly phone: FieldRef<"users", 'String'>
    readonly status: FieldRef<"users", 'String'>
    readonly created_at: FieldRef<"users", 'DateTime'>
    readonly last_login: FieldRef<"users", 'DateTime'>
    readonly role_id: FieldRef<"users", 'String'>
  }
    

  // Custom InputTypes
  /**
   * users findUnique
   */
  export type usersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findUniqueOrThrow
   */
  export type usersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users findFirst
   */
  export type usersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findFirstOrThrow
   */
  export type usersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users findMany
   */
  export type usersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
     */
    cursor?: usersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * users create
   */
  export type usersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to create a users.
     */
    data: XOR<usersCreateInput, usersUncheckedCreateInput>
  }

  /**
   * users createMany
   */
  export type usersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * users createManyAndReturn
   */
  export type usersCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * users update
   */
  export type usersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The data needed to update a users.
     */
    data: XOR<usersUpdateInput, usersUncheckedUpdateInput>
    /**
     * Choose, which users to update.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users updateMany
   */
  export type usersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
  }

  /**
   * users updateManyAndReturn
   */
  export type usersUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>
    /**
     * Filter which users to update
     */
    where?: usersWhereInput
    /**
     * Limit how many users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * users upsert
   */
  export type usersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * The filter to search for the users to update in case it exists.
     */
    where: usersWhereUniqueInput
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
     */
    create: XOR<usersCreateInput, usersUncheckedCreateInput>
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usersUpdateInput, usersUncheckedUpdateInput>
  }

  /**
   * users delete
   */
  export type usersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
    /**
     * Filter which users to delete.
     */
    where: usersWhereUniqueInput
  }

  /**
   * users deleteMany
   */
  export type usersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which users to delete
     */
    where?: usersWhereInput
    /**
     * Limit how many users to delete.
     */
    limit?: number
  }

  /**
   * users.reports
   */
  export type users$reportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the reports
     */
    select?: reportsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the reports
     */
    omit?: reportsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: reportsInclude<ExtArgs> | null
    where?: reportsWhereInput
    orderBy?: reportsOrderByWithRelationInput | reportsOrderByWithRelationInput[]
    cursor?: reportsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReportsScalarFieldEnum | ReportsScalarFieldEnum[]
  }

  /**
   * users.requests_requests_requester_idTousers
   */
  export type users$requests_requests_requester_idTousersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsInclude<ExtArgs> | null
    where?: requestsWhereInput
    orderBy?: requestsOrderByWithRelationInput | requestsOrderByWithRelationInput[]
    cursor?: requestsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RequestsScalarFieldEnum | RequestsScalarFieldEnum[]
  }

  /**
   * users.requests_requests_reviewed_byTousers
   */
  export type users$requests_requests_reviewed_byTousersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsInclude<ExtArgs> | null
    where?: requestsWhereInput
    orderBy?: requestsOrderByWithRelationInput | requestsOrderByWithRelationInput[]
    cursor?: requestsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RequestsScalarFieldEnum | RequestsScalarFieldEnum[]
  }

  /**
   * users.sessions
   */
  export type users$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the sessions
     */
    select?: sessionsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the sessions
     */
    omit?: sessionsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sessionsInclude<ExtArgs> | null
    where?: sessionsWhereInput
    orderBy?: sessionsOrderByWithRelationInput | sessionsOrderByWithRelationInput[]
    cursor?: sessionsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionsScalarFieldEnum | SessionsScalarFieldEnum[]
  }

  /**
   * users.trips
   */
  export type users$tripsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the trips
     */
    select?: tripsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the trips
     */
    omit?: tripsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tripsInclude<ExtArgs> | null
    where?: tripsWhereInput
    orderBy?: tripsOrderByWithRelationInput | tripsOrderByWithRelationInput[]
    cursor?: tripsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TripsScalarFieldEnum | TripsScalarFieldEnum[]
  }

  /**
   * users without action
   */
  export type usersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null
  }


  /**
   * Model vehicles
   */

  export type AggregateVehicles = {
    _count: VehiclesCountAggregateOutputType | null
    _avg: VehiclesAvgAggregateOutputType | null
    _sum: VehiclesSumAggregateOutputType | null
    _min: VehiclesMinAggregateOutputType | null
    _max: VehiclesMaxAggregateOutputType | null
  }

  export type VehiclesAvgAggregateOutputType = {
    year: number | null
    capacity: number | null
    odometer: number | null
  }

  export type VehiclesSumAggregateOutputType = {
    year: number | null
    capacity: number | null
    odometer: number | null
  }

  export type VehiclesMinAggregateOutputType = {
    id: string | null
    plate_number: string | null
    model: string | null
    manufacturer: string | null
    year: number | null
    capacity: number | null
    odometer: number | null
    status: string | null
    fuel_type: string | null
    last_service_date: Date | null
    created_at: Date | null
    organization_id: string | null
  }

  export type VehiclesMaxAggregateOutputType = {
    id: string | null
    plate_number: string | null
    model: string | null
    manufacturer: string | null
    year: number | null
    capacity: number | null
    odometer: number | null
    status: string | null
    fuel_type: string | null
    last_service_date: Date | null
    created_at: Date | null
    organization_id: string | null
  }

  export type VehiclesCountAggregateOutputType = {
    id: number
    plate_number: number
    model: number
    manufacturer: number
    year: number
    capacity: number
    odometer: number
    status: number
    fuel_type: number
    last_service_date: number
    created_at: number
    organization_id: number
    _all: number
  }


  export type VehiclesAvgAggregateInputType = {
    year?: true
    capacity?: true
    odometer?: true
  }

  export type VehiclesSumAggregateInputType = {
    year?: true
    capacity?: true
    odometer?: true
  }

  export type VehiclesMinAggregateInputType = {
    id?: true
    plate_number?: true
    model?: true
    manufacturer?: true
    year?: true
    capacity?: true
    odometer?: true
    status?: true
    fuel_type?: true
    last_service_date?: true
    created_at?: true
    organization_id?: true
  }

  export type VehiclesMaxAggregateInputType = {
    id?: true
    plate_number?: true
    model?: true
    manufacturer?: true
    year?: true
    capacity?: true
    odometer?: true
    status?: true
    fuel_type?: true
    last_service_date?: true
    created_at?: true
    organization_id?: true
  }

  export type VehiclesCountAggregateInputType = {
    id?: true
    plate_number?: true
    model?: true
    manufacturer?: true
    year?: true
    capacity?: true
    odometer?: true
    status?: true
    fuel_type?: true
    last_service_date?: true
    created_at?: true
    organization_id?: true
    _all?: true
  }

  export type VehiclesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which vehicles to aggregate.
     */
    where?: vehiclesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicles to fetch.
     */
    orderBy?: vehiclesOrderByWithRelationInput | vehiclesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: vehiclesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned vehicles
    **/
    _count?: true | VehiclesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VehiclesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VehiclesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VehiclesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VehiclesMaxAggregateInputType
  }

  export type GetVehiclesAggregateType<T extends VehiclesAggregateArgs> = {
        [P in keyof T & keyof AggregateVehicles]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVehicles[P]>
      : GetScalarType<T[P], AggregateVehicles[P]>
  }




  export type vehiclesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: vehiclesWhereInput
    orderBy?: vehiclesOrderByWithAggregationInput | vehiclesOrderByWithAggregationInput[]
    by: VehiclesScalarFieldEnum[] | VehiclesScalarFieldEnum
    having?: vehiclesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VehiclesCountAggregateInputType | true
    _avg?: VehiclesAvgAggregateInputType
    _sum?: VehiclesSumAggregateInputType
    _min?: VehiclesMinAggregateInputType
    _max?: VehiclesMaxAggregateInputType
  }

  export type VehiclesGroupByOutputType = {
    id: string
    plate_number: string
    model: string
    manufacturer: string
    year: number
    capacity: number | null
    odometer: number
    status: string
    fuel_type: string | null
    last_service_date: Date | null
    created_at: Date
    organization_id: string
    _count: VehiclesCountAggregateOutputType | null
    _avg: VehiclesAvgAggregateOutputType | null
    _sum: VehiclesSumAggregateOutputType | null
    _min: VehiclesMinAggregateOutputType | null
    _max: VehiclesMaxAggregateOutputType | null
  }

  type GetVehiclesGroupByPayload<T extends vehiclesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VehiclesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VehiclesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VehiclesGroupByOutputType[P]>
            : GetScalarType<T[P], VehiclesGroupByOutputType[P]>
        }
      >
    >


  export type vehiclesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    plate_number?: boolean
    model?: boolean
    manufacturer?: boolean
    year?: boolean
    capacity?: boolean
    odometer?: boolean
    status?: boolean
    fuel_type?: boolean
    last_service_date?: boolean
    created_at?: boolean
    organization_id?: boolean
    requests?: boolean | vehicles$requestsArgs<ExtArgs>
    trips?: boolean | vehicles$tripsArgs<ExtArgs>
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
    _count?: boolean | VehiclesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicles"]>

  export type vehiclesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    plate_number?: boolean
    model?: boolean
    manufacturer?: boolean
    year?: boolean
    capacity?: boolean
    odometer?: boolean
    status?: boolean
    fuel_type?: boolean
    last_service_date?: boolean
    created_at?: boolean
    organization_id?: boolean
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicles"]>

  export type vehiclesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    plate_number?: boolean
    model?: boolean
    manufacturer?: boolean
    year?: boolean
    capacity?: boolean
    odometer?: boolean
    status?: boolean
    fuel_type?: boolean
    last_service_date?: boolean
    created_at?: boolean
    organization_id?: boolean
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicles"]>

  export type vehiclesSelectScalar = {
    id?: boolean
    plate_number?: boolean
    model?: boolean
    manufacturer?: boolean
    year?: boolean
    capacity?: boolean
    odometer?: boolean
    status?: boolean
    fuel_type?: boolean
    last_service_date?: boolean
    created_at?: boolean
    organization_id?: boolean
  }

  export type vehiclesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "plate_number" | "model" | "manufacturer" | "year" | "capacity" | "odometer" | "status" | "fuel_type" | "last_service_date" | "created_at" | "organization_id", ExtArgs["result"]["vehicles"]>
  export type vehiclesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requests?: boolean | vehicles$requestsArgs<ExtArgs>
    trips?: boolean | vehicles$tripsArgs<ExtArgs>
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
    _count?: boolean | VehiclesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type vehiclesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
  }
  export type vehiclesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organizations?: boolean | organizationsDefaultArgs<ExtArgs>
  }

  export type $vehiclesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "vehicles"
    objects: {
      requests: Prisma.$requestsPayload<ExtArgs>[]
      trips: Prisma.$tripsPayload<ExtArgs>[]
      organizations: Prisma.$organizationsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      plate_number: string
      model: string
      manufacturer: string
      year: number
      capacity: number | null
      odometer: number
      status: string
      fuel_type: string | null
      last_service_date: Date | null
      created_at: Date
      organization_id: string
    }, ExtArgs["result"]["vehicles"]>
    composites: {}
  }

  type vehiclesGetPayload<S extends boolean | null | undefined | vehiclesDefaultArgs> = $Result.GetResult<Prisma.$vehiclesPayload, S>

  type vehiclesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<vehiclesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VehiclesCountAggregateInputType | true
    }

  export interface vehiclesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['vehicles'], meta: { name: 'vehicles' } }
    /**
     * Find zero or one Vehicles that matches the filter.
     * @param {vehiclesFindUniqueArgs} args - Arguments to find a Vehicles
     * @example
     * // Get one Vehicles
     * const vehicles = await prisma.vehicles.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends vehiclesFindUniqueArgs>(args: SelectSubset<T, vehiclesFindUniqueArgs<ExtArgs>>): Prisma__vehiclesClient<$Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vehicles that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {vehiclesFindUniqueOrThrowArgs} args - Arguments to find a Vehicles
     * @example
     * // Get one Vehicles
     * const vehicles = await prisma.vehicles.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends vehiclesFindUniqueOrThrowArgs>(args: SelectSubset<T, vehiclesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__vehiclesClient<$Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehicles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehiclesFindFirstArgs} args - Arguments to find a Vehicles
     * @example
     * // Get one Vehicles
     * const vehicles = await prisma.vehicles.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends vehiclesFindFirstArgs>(args?: SelectSubset<T, vehiclesFindFirstArgs<ExtArgs>>): Prisma__vehiclesClient<$Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehicles that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehiclesFindFirstOrThrowArgs} args - Arguments to find a Vehicles
     * @example
     * // Get one Vehicles
     * const vehicles = await prisma.vehicles.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends vehiclesFindFirstOrThrowArgs>(args?: SelectSubset<T, vehiclesFindFirstOrThrowArgs<ExtArgs>>): Prisma__vehiclesClient<$Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Vehicles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehiclesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vehicles
     * const vehicles = await prisma.vehicles.findMany()
     * 
     * // Get first 10 Vehicles
     * const vehicles = await prisma.vehicles.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vehiclesWithIdOnly = await prisma.vehicles.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends vehiclesFindManyArgs>(args?: SelectSubset<T, vehiclesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vehicles.
     * @param {vehiclesCreateArgs} args - Arguments to create a Vehicles.
     * @example
     * // Create one Vehicles
     * const Vehicles = await prisma.vehicles.create({
     *   data: {
     *     // ... data to create a Vehicles
     *   }
     * })
     * 
     */
    create<T extends vehiclesCreateArgs>(args: SelectSubset<T, vehiclesCreateArgs<ExtArgs>>): Prisma__vehiclesClient<$Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Vehicles.
     * @param {vehiclesCreateManyArgs} args - Arguments to create many Vehicles.
     * @example
     * // Create many Vehicles
     * const vehicles = await prisma.vehicles.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends vehiclesCreateManyArgs>(args?: SelectSubset<T, vehiclesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vehicles and returns the data saved in the database.
     * @param {vehiclesCreateManyAndReturnArgs} args - Arguments to create many Vehicles.
     * @example
     * // Create many Vehicles
     * const vehicles = await prisma.vehicles.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vehicles and only return the `id`
     * const vehiclesWithIdOnly = await prisma.vehicles.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends vehiclesCreateManyAndReturnArgs>(args?: SelectSubset<T, vehiclesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Vehicles.
     * @param {vehiclesDeleteArgs} args - Arguments to delete one Vehicles.
     * @example
     * // Delete one Vehicles
     * const Vehicles = await prisma.vehicles.delete({
     *   where: {
     *     // ... filter to delete one Vehicles
     *   }
     * })
     * 
     */
    delete<T extends vehiclesDeleteArgs>(args: SelectSubset<T, vehiclesDeleteArgs<ExtArgs>>): Prisma__vehiclesClient<$Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vehicles.
     * @param {vehiclesUpdateArgs} args - Arguments to update one Vehicles.
     * @example
     * // Update one Vehicles
     * const vehicles = await prisma.vehicles.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends vehiclesUpdateArgs>(args: SelectSubset<T, vehiclesUpdateArgs<ExtArgs>>): Prisma__vehiclesClient<$Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Vehicles.
     * @param {vehiclesDeleteManyArgs} args - Arguments to filter Vehicles to delete.
     * @example
     * // Delete a few Vehicles
     * const { count } = await prisma.vehicles.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends vehiclesDeleteManyArgs>(args?: SelectSubset<T, vehiclesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehicles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehiclesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vehicles
     * const vehicles = await prisma.vehicles.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends vehiclesUpdateManyArgs>(args: SelectSubset<T, vehiclesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehicles and returns the data updated in the database.
     * @param {vehiclesUpdateManyAndReturnArgs} args - Arguments to update many Vehicles.
     * @example
     * // Update many Vehicles
     * const vehicles = await prisma.vehicles.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Vehicles and only return the `id`
     * const vehiclesWithIdOnly = await prisma.vehicles.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends vehiclesUpdateManyAndReturnArgs>(args: SelectSubset<T, vehiclesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Vehicles.
     * @param {vehiclesUpsertArgs} args - Arguments to update or create a Vehicles.
     * @example
     * // Update or create a Vehicles
     * const vehicles = await prisma.vehicles.upsert({
     *   create: {
     *     // ... data to create a Vehicles
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vehicles we want to update
     *   }
     * })
     */
    upsert<T extends vehiclesUpsertArgs>(args: SelectSubset<T, vehiclesUpsertArgs<ExtArgs>>): Prisma__vehiclesClient<$Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Vehicles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehiclesCountArgs} args - Arguments to filter Vehicles to count.
     * @example
     * // Count the number of Vehicles
     * const count = await prisma.vehicles.count({
     *   where: {
     *     // ... the filter for the Vehicles we want to count
     *   }
     * })
    **/
    count<T extends vehiclesCountArgs>(
      args?: Subset<T, vehiclesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VehiclesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vehicles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehiclesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VehiclesAggregateArgs>(args: Subset<T, VehiclesAggregateArgs>): Prisma.PrismaPromise<GetVehiclesAggregateType<T>>

    /**
     * Group by Vehicles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {vehiclesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends vehiclesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: vehiclesGroupByArgs['orderBy'] }
        : { orderBy?: vehiclesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, vehiclesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehiclesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the vehicles model
   */
  readonly fields: vehiclesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for vehicles.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__vehiclesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    requests<T extends vehicles$requestsArgs<ExtArgs> = {}>(args?: Subset<T, vehicles$requestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$requestsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    trips<T extends vehicles$tripsArgs<ExtArgs> = {}>(args?: Subset<T, vehicles$tripsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    organizations<T extends organizationsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, organizationsDefaultArgs<ExtArgs>>): Prisma__organizationsClient<$Result.GetResult<Prisma.$organizationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the vehicles model
   */
  interface vehiclesFieldRefs {
    readonly id: FieldRef<"vehicles", 'String'>
    readonly plate_number: FieldRef<"vehicles", 'String'>
    readonly model: FieldRef<"vehicles", 'String'>
    readonly manufacturer: FieldRef<"vehicles", 'String'>
    readonly year: FieldRef<"vehicles", 'Int'>
    readonly capacity: FieldRef<"vehicles", 'Int'>
    readonly odometer: FieldRef<"vehicles", 'Int'>
    readonly status: FieldRef<"vehicles", 'String'>
    readonly fuel_type: FieldRef<"vehicles", 'String'>
    readonly last_service_date: FieldRef<"vehicles", 'DateTime'>
    readonly created_at: FieldRef<"vehicles", 'DateTime'>
    readonly organization_id: FieldRef<"vehicles", 'String'>
  }
    

  // Custom InputTypes
  /**
   * vehicles findUnique
   */
  export type vehiclesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicles
     */
    select?: vehiclesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicles
     */
    omit?: vehiclesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehiclesInclude<ExtArgs> | null
    /**
     * Filter, which vehicles to fetch.
     */
    where: vehiclesWhereUniqueInput
  }

  /**
   * vehicles findUniqueOrThrow
   */
  export type vehiclesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicles
     */
    select?: vehiclesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicles
     */
    omit?: vehiclesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehiclesInclude<ExtArgs> | null
    /**
     * Filter, which vehicles to fetch.
     */
    where: vehiclesWhereUniqueInput
  }

  /**
   * vehicles findFirst
   */
  export type vehiclesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicles
     */
    select?: vehiclesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicles
     */
    omit?: vehiclesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehiclesInclude<ExtArgs> | null
    /**
     * Filter, which vehicles to fetch.
     */
    where?: vehiclesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicles to fetch.
     */
    orderBy?: vehiclesOrderByWithRelationInput | vehiclesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for vehicles.
     */
    cursor?: vehiclesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of vehicles.
     */
    distinct?: VehiclesScalarFieldEnum | VehiclesScalarFieldEnum[]
  }

  /**
   * vehicles findFirstOrThrow
   */
  export type vehiclesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicles
     */
    select?: vehiclesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicles
     */
    omit?: vehiclesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehiclesInclude<ExtArgs> | null
    /**
     * Filter, which vehicles to fetch.
     */
    where?: vehiclesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicles to fetch.
     */
    orderBy?: vehiclesOrderByWithRelationInput | vehiclesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for vehicles.
     */
    cursor?: vehiclesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of vehicles.
     */
    distinct?: VehiclesScalarFieldEnum | VehiclesScalarFieldEnum[]
  }

  /**
   * vehicles findMany
   */
  export type vehiclesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicles
     */
    select?: vehiclesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicles
     */
    omit?: vehiclesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehiclesInclude<ExtArgs> | null
    /**
     * Filter, which vehicles to fetch.
     */
    where?: vehiclesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of vehicles to fetch.
     */
    orderBy?: vehiclesOrderByWithRelationInput | vehiclesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing vehicles.
     */
    cursor?: vehiclesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` vehicles.
     */
    skip?: number
    distinct?: VehiclesScalarFieldEnum | VehiclesScalarFieldEnum[]
  }

  /**
   * vehicles create
   */
  export type vehiclesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicles
     */
    select?: vehiclesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicles
     */
    omit?: vehiclesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehiclesInclude<ExtArgs> | null
    /**
     * The data needed to create a vehicles.
     */
    data: XOR<vehiclesCreateInput, vehiclesUncheckedCreateInput>
  }

  /**
   * vehicles createMany
   */
  export type vehiclesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many vehicles.
     */
    data: vehiclesCreateManyInput | vehiclesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * vehicles createManyAndReturn
   */
  export type vehiclesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicles
     */
    select?: vehiclesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the vehicles
     */
    omit?: vehiclesOmit<ExtArgs> | null
    /**
     * The data used to create many vehicles.
     */
    data: vehiclesCreateManyInput | vehiclesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehiclesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * vehicles update
   */
  export type vehiclesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicles
     */
    select?: vehiclesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicles
     */
    omit?: vehiclesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehiclesInclude<ExtArgs> | null
    /**
     * The data needed to update a vehicles.
     */
    data: XOR<vehiclesUpdateInput, vehiclesUncheckedUpdateInput>
    /**
     * Choose, which vehicles to update.
     */
    where: vehiclesWhereUniqueInput
  }

  /**
   * vehicles updateMany
   */
  export type vehiclesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update vehicles.
     */
    data: XOR<vehiclesUpdateManyMutationInput, vehiclesUncheckedUpdateManyInput>
    /**
     * Filter which vehicles to update
     */
    where?: vehiclesWhereInput
    /**
     * Limit how many vehicles to update.
     */
    limit?: number
  }

  /**
   * vehicles updateManyAndReturn
   */
  export type vehiclesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicles
     */
    select?: vehiclesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the vehicles
     */
    omit?: vehiclesOmit<ExtArgs> | null
    /**
     * The data used to update vehicles.
     */
    data: XOR<vehiclesUpdateManyMutationInput, vehiclesUncheckedUpdateManyInput>
    /**
     * Filter which vehicles to update
     */
    where?: vehiclesWhereInput
    /**
     * Limit how many vehicles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehiclesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * vehicles upsert
   */
  export type vehiclesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicles
     */
    select?: vehiclesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicles
     */
    omit?: vehiclesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehiclesInclude<ExtArgs> | null
    /**
     * The filter to search for the vehicles to update in case it exists.
     */
    where: vehiclesWhereUniqueInput
    /**
     * In case the vehicles found by the `where` argument doesn't exist, create a new vehicles with this data.
     */
    create: XOR<vehiclesCreateInput, vehiclesUncheckedCreateInput>
    /**
     * In case the vehicles was found with the provided `where` argument, update it with this data.
     */
    update: XOR<vehiclesUpdateInput, vehiclesUncheckedUpdateInput>
  }

  /**
   * vehicles delete
   */
  export type vehiclesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicles
     */
    select?: vehiclesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicles
     */
    omit?: vehiclesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehiclesInclude<ExtArgs> | null
    /**
     * Filter which vehicles to delete.
     */
    where: vehiclesWhereUniqueInput
  }

  /**
   * vehicles deleteMany
   */
  export type vehiclesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which vehicles to delete
     */
    where?: vehiclesWhereInput
    /**
     * Limit how many vehicles to delete.
     */
    limit?: number
  }

  /**
   * vehicles.requests
   */
  export type vehicles$requestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the requests
     */
    select?: requestsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the requests
     */
    omit?: requestsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: requestsInclude<ExtArgs> | null
    where?: requestsWhereInput
    orderBy?: requestsOrderByWithRelationInput | requestsOrderByWithRelationInput[]
    cursor?: requestsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RequestsScalarFieldEnum | RequestsScalarFieldEnum[]
  }

  /**
   * vehicles.trips
   */
  export type vehicles$tripsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the trips
     */
    select?: tripsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the trips
     */
    omit?: tripsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tripsInclude<ExtArgs> | null
    where?: tripsWhereInput
    orderBy?: tripsOrderByWithRelationInput | tripsOrderByWithRelationInput[]
    cursor?: tripsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TripsScalarFieldEnum | TripsScalarFieldEnum[]
  }

  /**
   * vehicles without action
   */
  export type vehiclesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the vehicles
     */
    select?: vehiclesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the vehicles
     */
    omit?: vehiclesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: vehiclesInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const OrganizationsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    address: 'address',
    phone: 'phone',
    email: 'email',
    created_at: 'created_at'
  };

  export type OrganizationsScalarFieldEnum = (typeof OrganizationsScalarFieldEnum)[keyof typeof OrganizationsScalarFieldEnum]


  export const PermissionsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description'
  };

  export type PermissionsScalarFieldEnum = (typeof PermissionsScalarFieldEnum)[keyof typeof PermissionsScalarFieldEnum]


  export const ReportsScalarFieldEnum: {
    id: 'id',
    generated_by: 'generated_by',
    organization_id: 'organization_id',
    report_type: 'report_type',
    generated_at: 'generated_at',
    file_url: 'file_url',
    description: 'description'
  };

  export type ReportsScalarFieldEnum = (typeof ReportsScalarFieldEnum)[keyof typeof ReportsScalarFieldEnum]


  export const RequestsScalarFieldEnum: {
    id: 'id',
    vehicle_id: 'vehicle_id',
    requested_at: 'requested_at',
    trip_purpose: 'trip_purpose',
    start_location: 'start_location',
    end_location: 'end_location',
    start_date: 'start_date',
    end_date: 'end_date',
    status: 'status',
    reviewed_at: 'reviewed_at',
    comments: 'comments',
    requester_id: 'requester_id',
    reviewed_by: 'reviewed_by'
  };

  export type RequestsScalarFieldEnum = (typeof RequestsScalarFieldEnum)[keyof typeof RequestsScalarFieldEnum]


  export const Role_permissionsScalarFieldEnum: {
    id: 'id',
    role_id: 'role_id',
    permission_id: 'permission_id'
  };

  export type Role_permissionsScalarFieldEnum = (typeof Role_permissionsScalarFieldEnum)[keyof typeof Role_permissionsScalarFieldEnum]


  export const RolesScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description'
  };

  export type RolesScalarFieldEnum = (typeof RolesScalarFieldEnum)[keyof typeof RolesScalarFieldEnum]


  export const SessionsScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    token: 'token',
    created_at: 'created_at',
    expires_at: 'expires_at',
    is_active: 'is_active'
  };

  export type SessionsScalarFieldEnum = (typeof SessionsScalarFieldEnum)[keyof typeof SessionsScalarFieldEnum]


  export const TripsScalarFieldEnum: {
    id: 'id',
    request_id: 'request_id',
    vehicle_id: 'vehicle_id',
    start_odometer: 'start_odometer',
    end_odometer: 'end_odometer',
    start_time: 'start_time',
    end_time: 'end_time',
    fuel_used: 'fuel_used',
    trip_notes: 'trip_notes',
    created_at: 'created_at',
    driver_id: 'driver_id'
  };

  export type TripsScalarFieldEnum = (typeof TripsScalarFieldEnum)[keyof typeof TripsScalarFieldEnum]


  export const UsersScalarFieldEnum: {
    id: 'id',
    organization_id: 'organization_id',
    username: 'username',
    password_hash: 'password_hash',
    email: 'email',
    full_name: 'full_name',
    phone: 'phone',
    status: 'status',
    created_at: 'created_at',
    last_login: 'last_login',
    role_id: 'role_id'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const VehiclesScalarFieldEnum: {
    id: 'id',
    plate_number: 'plate_number',
    model: 'model',
    manufacturer: 'manufacturer',
    year: 'year',
    capacity: 'capacity',
    odometer: 'odometer',
    status: 'status',
    fuel_type: 'fuel_type',
    last_service_date: 'last_service_date',
    created_at: 'created_at',
    organization_id: 'organization_id'
  };

  export type VehiclesScalarFieldEnum = (typeof VehiclesScalarFieldEnum)[keyof typeof VehiclesScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type organizationsWhereInput = {
    AND?: organizationsWhereInput | organizationsWhereInput[]
    OR?: organizationsWhereInput[]
    NOT?: organizationsWhereInput | organizationsWhereInput[]
    id?: StringFilter<"organizations"> | string
    name?: StringFilter<"organizations"> | string
    address?: StringFilter<"organizations"> | string
    phone?: StringFilter<"organizations"> | string
    email?: StringFilter<"organizations"> | string
    created_at?: DateTimeFilter<"organizations"> | Date | string
    reports?: ReportsListRelationFilter
    users?: UsersListRelationFilter
    vehicles?: VehiclesListRelationFilter
  }

  export type organizationsOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    created_at?: SortOrder
    reports?: reportsOrderByRelationAggregateInput
    users?: usersOrderByRelationAggregateInput
    vehicles?: vehiclesOrderByRelationAggregateInput
  }

  export type organizationsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: organizationsWhereInput | organizationsWhereInput[]
    OR?: organizationsWhereInput[]
    NOT?: organizationsWhereInput | organizationsWhereInput[]
    name?: StringFilter<"organizations"> | string
    address?: StringFilter<"organizations"> | string
    phone?: StringFilter<"organizations"> | string
    email?: StringFilter<"organizations"> | string
    created_at?: DateTimeFilter<"organizations"> | Date | string
    reports?: ReportsListRelationFilter
    users?: UsersListRelationFilter
    vehicles?: VehiclesListRelationFilter
  }, "id">

  export type organizationsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    created_at?: SortOrder
    _count?: organizationsCountOrderByAggregateInput
    _max?: organizationsMaxOrderByAggregateInput
    _min?: organizationsMinOrderByAggregateInput
  }

  export type organizationsScalarWhereWithAggregatesInput = {
    AND?: organizationsScalarWhereWithAggregatesInput | organizationsScalarWhereWithAggregatesInput[]
    OR?: organizationsScalarWhereWithAggregatesInput[]
    NOT?: organizationsScalarWhereWithAggregatesInput | organizationsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"organizations"> | string
    name?: StringWithAggregatesFilter<"organizations"> | string
    address?: StringWithAggregatesFilter<"organizations"> | string
    phone?: StringWithAggregatesFilter<"organizations"> | string
    email?: StringWithAggregatesFilter<"organizations"> | string
    created_at?: DateTimeWithAggregatesFilter<"organizations"> | Date | string
  }

  export type permissionsWhereInput = {
    AND?: permissionsWhereInput | permissionsWhereInput[]
    OR?: permissionsWhereInput[]
    NOT?: permissionsWhereInput | permissionsWhereInput[]
    id?: StringFilter<"permissions"> | string
    name?: StringFilter<"permissions"> | string
    description?: StringNullableFilter<"permissions"> | string | null
    role_permissions?: Role_permissionsListRelationFilter
  }

  export type permissionsOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    role_permissions?: role_permissionsOrderByRelationAggregateInput
  }

  export type permissionsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: permissionsWhereInput | permissionsWhereInput[]
    OR?: permissionsWhereInput[]
    NOT?: permissionsWhereInput | permissionsWhereInput[]
    description?: StringNullableFilter<"permissions"> | string | null
    role_permissions?: Role_permissionsListRelationFilter
  }, "id" | "name">

  export type permissionsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    _count?: permissionsCountOrderByAggregateInput
    _max?: permissionsMaxOrderByAggregateInput
    _min?: permissionsMinOrderByAggregateInput
  }

  export type permissionsScalarWhereWithAggregatesInput = {
    AND?: permissionsScalarWhereWithAggregatesInput | permissionsScalarWhereWithAggregatesInput[]
    OR?: permissionsScalarWhereWithAggregatesInput[]
    NOT?: permissionsScalarWhereWithAggregatesInput | permissionsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"permissions"> | string
    name?: StringWithAggregatesFilter<"permissions"> | string
    description?: StringNullableWithAggregatesFilter<"permissions"> | string | null
  }

  export type reportsWhereInput = {
    AND?: reportsWhereInput | reportsWhereInput[]
    OR?: reportsWhereInput[]
    NOT?: reportsWhereInput | reportsWhereInput[]
    id?: StringFilter<"reports"> | string
    generated_by?: StringFilter<"reports"> | string
    organization_id?: StringFilter<"reports"> | string
    report_type?: StringFilter<"reports"> | string
    generated_at?: DateTimeFilter<"reports"> | Date | string
    file_url?: StringNullableFilter<"reports"> | string | null
    description?: StringNullableFilter<"reports"> | string | null
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
    organizations?: XOR<OrganizationsScalarRelationFilter, organizationsWhereInput>
  }

  export type reportsOrderByWithRelationInput = {
    id?: SortOrder
    generated_by?: SortOrder
    organization_id?: SortOrder
    report_type?: SortOrder
    generated_at?: SortOrder
    file_url?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    users?: usersOrderByWithRelationInput
    organizations?: organizationsOrderByWithRelationInput
  }

  export type reportsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: reportsWhereInput | reportsWhereInput[]
    OR?: reportsWhereInput[]
    NOT?: reportsWhereInput | reportsWhereInput[]
    generated_by?: StringFilter<"reports"> | string
    organization_id?: StringFilter<"reports"> | string
    report_type?: StringFilter<"reports"> | string
    generated_at?: DateTimeFilter<"reports"> | Date | string
    file_url?: StringNullableFilter<"reports"> | string | null
    description?: StringNullableFilter<"reports"> | string | null
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
    organizations?: XOR<OrganizationsScalarRelationFilter, organizationsWhereInput>
  }, "id">

  export type reportsOrderByWithAggregationInput = {
    id?: SortOrder
    generated_by?: SortOrder
    organization_id?: SortOrder
    report_type?: SortOrder
    generated_at?: SortOrder
    file_url?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    _count?: reportsCountOrderByAggregateInput
    _max?: reportsMaxOrderByAggregateInput
    _min?: reportsMinOrderByAggregateInput
  }

  export type reportsScalarWhereWithAggregatesInput = {
    AND?: reportsScalarWhereWithAggregatesInput | reportsScalarWhereWithAggregatesInput[]
    OR?: reportsScalarWhereWithAggregatesInput[]
    NOT?: reportsScalarWhereWithAggregatesInput | reportsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"reports"> | string
    generated_by?: StringWithAggregatesFilter<"reports"> | string
    organization_id?: StringWithAggregatesFilter<"reports"> | string
    report_type?: StringWithAggregatesFilter<"reports"> | string
    generated_at?: DateTimeWithAggregatesFilter<"reports"> | Date | string
    file_url?: StringNullableWithAggregatesFilter<"reports"> | string | null
    description?: StringNullableWithAggregatesFilter<"reports"> | string | null
  }

  export type requestsWhereInput = {
    AND?: requestsWhereInput | requestsWhereInput[]
    OR?: requestsWhereInput[]
    NOT?: requestsWhereInput | requestsWhereInput[]
    id?: StringFilter<"requests"> | string
    vehicle_id?: StringNullableFilter<"requests"> | string | null
    requested_at?: DateTimeFilter<"requests"> | Date | string
    trip_purpose?: StringFilter<"requests"> | string
    start_location?: StringFilter<"requests"> | string
    end_location?: StringFilter<"requests"> | string
    start_date?: DateTimeFilter<"requests"> | Date | string
    end_date?: DateTimeFilter<"requests"> | Date | string
    status?: StringFilter<"requests"> | string
    reviewed_at?: DateTimeNullableFilter<"requests"> | Date | string | null
    comments?: StringNullableFilter<"requests"> | string | null
    requester_id?: StringFilter<"requests"> | string
    reviewed_by?: StringNullableFilter<"requests"> | string | null
    users_requests_requester_idTousers?: XOR<UsersScalarRelationFilter, usersWhereInput>
    users_requests_reviewed_byTousers?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
    vehicles?: XOR<VehiclesNullableScalarRelationFilter, vehiclesWhereInput> | null
    trips?: TripsListRelationFilter
  }

  export type requestsOrderByWithRelationInput = {
    id?: SortOrder
    vehicle_id?: SortOrderInput | SortOrder
    requested_at?: SortOrder
    trip_purpose?: SortOrder
    start_location?: SortOrder
    end_location?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    status?: SortOrder
    reviewed_at?: SortOrderInput | SortOrder
    comments?: SortOrderInput | SortOrder
    requester_id?: SortOrder
    reviewed_by?: SortOrderInput | SortOrder
    users_requests_requester_idTousers?: usersOrderByWithRelationInput
    users_requests_reviewed_byTousers?: usersOrderByWithRelationInput
    vehicles?: vehiclesOrderByWithRelationInput
    trips?: tripsOrderByRelationAggregateInput
  }

  export type requestsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: requestsWhereInput | requestsWhereInput[]
    OR?: requestsWhereInput[]
    NOT?: requestsWhereInput | requestsWhereInput[]
    vehicle_id?: StringNullableFilter<"requests"> | string | null
    requested_at?: DateTimeFilter<"requests"> | Date | string
    trip_purpose?: StringFilter<"requests"> | string
    start_location?: StringFilter<"requests"> | string
    end_location?: StringFilter<"requests"> | string
    start_date?: DateTimeFilter<"requests"> | Date | string
    end_date?: DateTimeFilter<"requests"> | Date | string
    status?: StringFilter<"requests"> | string
    reviewed_at?: DateTimeNullableFilter<"requests"> | Date | string | null
    comments?: StringNullableFilter<"requests"> | string | null
    requester_id?: StringFilter<"requests"> | string
    reviewed_by?: StringNullableFilter<"requests"> | string | null
    users_requests_requester_idTousers?: XOR<UsersScalarRelationFilter, usersWhereInput>
    users_requests_reviewed_byTousers?: XOR<UsersNullableScalarRelationFilter, usersWhereInput> | null
    vehicles?: XOR<VehiclesNullableScalarRelationFilter, vehiclesWhereInput> | null
    trips?: TripsListRelationFilter
  }, "id">

  export type requestsOrderByWithAggregationInput = {
    id?: SortOrder
    vehicle_id?: SortOrderInput | SortOrder
    requested_at?: SortOrder
    trip_purpose?: SortOrder
    start_location?: SortOrder
    end_location?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    status?: SortOrder
    reviewed_at?: SortOrderInput | SortOrder
    comments?: SortOrderInput | SortOrder
    requester_id?: SortOrder
    reviewed_by?: SortOrderInput | SortOrder
    _count?: requestsCountOrderByAggregateInput
    _max?: requestsMaxOrderByAggregateInput
    _min?: requestsMinOrderByAggregateInput
  }

  export type requestsScalarWhereWithAggregatesInput = {
    AND?: requestsScalarWhereWithAggregatesInput | requestsScalarWhereWithAggregatesInput[]
    OR?: requestsScalarWhereWithAggregatesInput[]
    NOT?: requestsScalarWhereWithAggregatesInput | requestsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"requests"> | string
    vehicle_id?: StringNullableWithAggregatesFilter<"requests"> | string | null
    requested_at?: DateTimeWithAggregatesFilter<"requests"> | Date | string
    trip_purpose?: StringWithAggregatesFilter<"requests"> | string
    start_location?: StringWithAggregatesFilter<"requests"> | string
    end_location?: StringWithAggregatesFilter<"requests"> | string
    start_date?: DateTimeWithAggregatesFilter<"requests"> | Date | string
    end_date?: DateTimeWithAggregatesFilter<"requests"> | Date | string
    status?: StringWithAggregatesFilter<"requests"> | string
    reviewed_at?: DateTimeNullableWithAggregatesFilter<"requests"> | Date | string | null
    comments?: StringNullableWithAggregatesFilter<"requests"> | string | null
    requester_id?: StringWithAggregatesFilter<"requests"> | string
    reviewed_by?: StringNullableWithAggregatesFilter<"requests"> | string | null
  }

  export type role_permissionsWhereInput = {
    AND?: role_permissionsWhereInput | role_permissionsWhereInput[]
    OR?: role_permissionsWhereInput[]
    NOT?: role_permissionsWhereInput | role_permissionsWhereInput[]
    id?: StringFilter<"role_permissions"> | string
    role_id?: StringFilter<"role_permissions"> | string
    permission_id?: StringFilter<"role_permissions"> | string
    permissions?: XOR<PermissionsScalarRelationFilter, permissionsWhereInput>
    roles?: XOR<RolesScalarRelationFilter, rolesWhereInput>
  }

  export type role_permissionsOrderByWithRelationInput = {
    id?: SortOrder
    role_id?: SortOrder
    permission_id?: SortOrder
    permissions?: permissionsOrderByWithRelationInput
    roles?: rolesOrderByWithRelationInput
  }

  export type role_permissionsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    role_id_permission_id?: role_permissionsRole_idPermission_idCompoundUniqueInput
    AND?: role_permissionsWhereInput | role_permissionsWhereInput[]
    OR?: role_permissionsWhereInput[]
    NOT?: role_permissionsWhereInput | role_permissionsWhereInput[]
    role_id?: StringFilter<"role_permissions"> | string
    permission_id?: StringFilter<"role_permissions"> | string
    permissions?: XOR<PermissionsScalarRelationFilter, permissionsWhereInput>
    roles?: XOR<RolesScalarRelationFilter, rolesWhereInput>
  }, "id" | "role_id_permission_id">

  export type role_permissionsOrderByWithAggregationInput = {
    id?: SortOrder
    role_id?: SortOrder
    permission_id?: SortOrder
    _count?: role_permissionsCountOrderByAggregateInput
    _max?: role_permissionsMaxOrderByAggregateInput
    _min?: role_permissionsMinOrderByAggregateInput
  }

  export type role_permissionsScalarWhereWithAggregatesInput = {
    AND?: role_permissionsScalarWhereWithAggregatesInput | role_permissionsScalarWhereWithAggregatesInput[]
    OR?: role_permissionsScalarWhereWithAggregatesInput[]
    NOT?: role_permissionsScalarWhereWithAggregatesInput | role_permissionsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"role_permissions"> | string
    role_id?: StringWithAggregatesFilter<"role_permissions"> | string
    permission_id?: StringWithAggregatesFilter<"role_permissions"> | string
  }

  export type rolesWhereInput = {
    AND?: rolesWhereInput | rolesWhereInput[]
    OR?: rolesWhereInput[]
    NOT?: rolesWhereInput | rolesWhereInput[]
    id?: StringFilter<"roles"> | string
    name?: StringFilter<"roles"> | string
    description?: StringNullableFilter<"roles"> | string | null
    role_permissions?: Role_permissionsListRelationFilter
    users?: UsersListRelationFilter
  }

  export type rolesOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    role_permissions?: role_permissionsOrderByRelationAggregateInput
    users?: usersOrderByRelationAggregateInput
  }

  export type rolesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: rolesWhereInput | rolesWhereInput[]
    OR?: rolesWhereInput[]
    NOT?: rolesWhereInput | rolesWhereInput[]
    description?: StringNullableFilter<"roles"> | string | null
    role_permissions?: Role_permissionsListRelationFilter
    users?: UsersListRelationFilter
  }, "id" | "name">

  export type rolesOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    _count?: rolesCountOrderByAggregateInput
    _max?: rolesMaxOrderByAggregateInput
    _min?: rolesMinOrderByAggregateInput
  }

  export type rolesScalarWhereWithAggregatesInput = {
    AND?: rolesScalarWhereWithAggregatesInput | rolesScalarWhereWithAggregatesInput[]
    OR?: rolesScalarWhereWithAggregatesInput[]
    NOT?: rolesScalarWhereWithAggregatesInput | rolesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"roles"> | string
    name?: StringWithAggregatesFilter<"roles"> | string
    description?: StringNullableWithAggregatesFilter<"roles"> | string | null
  }

  export type sessionsWhereInput = {
    AND?: sessionsWhereInput | sessionsWhereInput[]
    OR?: sessionsWhereInput[]
    NOT?: sessionsWhereInput | sessionsWhereInput[]
    id?: StringFilter<"sessions"> | string
    user_id?: StringFilter<"sessions"> | string
    token?: StringFilter<"sessions"> | string
    created_at?: DateTimeFilter<"sessions"> | Date | string
    expires_at?: DateTimeFilter<"sessions"> | Date | string
    is_active?: BoolFilter<"sessions"> | boolean
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }

  export type sessionsOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    token?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    is_active?: SortOrder
    users?: usersOrderByWithRelationInput
  }

  export type sessionsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: sessionsWhereInput | sessionsWhereInput[]
    OR?: sessionsWhereInput[]
    NOT?: sessionsWhereInput | sessionsWhereInput[]
    user_id?: StringFilter<"sessions"> | string
    created_at?: DateTimeFilter<"sessions"> | Date | string
    expires_at?: DateTimeFilter<"sessions"> | Date | string
    is_active?: BoolFilter<"sessions"> | boolean
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
  }, "id" | "token">

  export type sessionsOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    token?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    is_active?: SortOrder
    _count?: sessionsCountOrderByAggregateInput
    _max?: sessionsMaxOrderByAggregateInput
    _min?: sessionsMinOrderByAggregateInput
  }

  export type sessionsScalarWhereWithAggregatesInput = {
    AND?: sessionsScalarWhereWithAggregatesInput | sessionsScalarWhereWithAggregatesInput[]
    OR?: sessionsScalarWhereWithAggregatesInput[]
    NOT?: sessionsScalarWhereWithAggregatesInput | sessionsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"sessions"> | string
    user_id?: StringWithAggregatesFilter<"sessions"> | string
    token?: StringWithAggregatesFilter<"sessions"> | string
    created_at?: DateTimeWithAggregatesFilter<"sessions"> | Date | string
    expires_at?: DateTimeWithAggregatesFilter<"sessions"> | Date | string
    is_active?: BoolWithAggregatesFilter<"sessions"> | boolean
  }

  export type tripsWhereInput = {
    AND?: tripsWhereInput | tripsWhereInput[]
    OR?: tripsWhereInput[]
    NOT?: tripsWhereInput | tripsWhereInput[]
    id?: StringFilter<"trips"> | string
    request_id?: StringNullableFilter<"trips"> | string | null
    vehicle_id?: StringFilter<"trips"> | string
    start_odometer?: IntFilter<"trips"> | number
    end_odometer?: IntNullableFilter<"trips"> | number | null
    start_time?: DateTimeFilter<"trips"> | Date | string
    end_time?: DateTimeNullableFilter<"trips"> | Date | string | null
    fuel_used?: FloatNullableFilter<"trips"> | number | null
    trip_notes?: StringNullableFilter<"trips"> | string | null
    created_at?: DateTimeFilter<"trips"> | Date | string
    driver_id?: StringFilter<"trips"> | string
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
    requests?: XOR<RequestsNullableScalarRelationFilter, requestsWhereInput> | null
    vehicles?: XOR<VehiclesScalarRelationFilter, vehiclesWhereInput>
  }

  export type tripsOrderByWithRelationInput = {
    id?: SortOrder
    request_id?: SortOrderInput | SortOrder
    vehicle_id?: SortOrder
    start_odometer?: SortOrder
    end_odometer?: SortOrderInput | SortOrder
    start_time?: SortOrder
    end_time?: SortOrderInput | SortOrder
    fuel_used?: SortOrderInput | SortOrder
    trip_notes?: SortOrderInput | SortOrder
    created_at?: SortOrder
    driver_id?: SortOrder
    users?: usersOrderByWithRelationInput
    requests?: requestsOrderByWithRelationInput
    vehicles?: vehiclesOrderByWithRelationInput
  }

  export type tripsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: tripsWhereInput | tripsWhereInput[]
    OR?: tripsWhereInput[]
    NOT?: tripsWhereInput | tripsWhereInput[]
    request_id?: StringNullableFilter<"trips"> | string | null
    vehicle_id?: StringFilter<"trips"> | string
    start_odometer?: IntFilter<"trips"> | number
    end_odometer?: IntNullableFilter<"trips"> | number | null
    start_time?: DateTimeFilter<"trips"> | Date | string
    end_time?: DateTimeNullableFilter<"trips"> | Date | string | null
    fuel_used?: FloatNullableFilter<"trips"> | number | null
    trip_notes?: StringNullableFilter<"trips"> | string | null
    created_at?: DateTimeFilter<"trips"> | Date | string
    driver_id?: StringFilter<"trips"> | string
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>
    requests?: XOR<RequestsNullableScalarRelationFilter, requestsWhereInput> | null
    vehicles?: XOR<VehiclesScalarRelationFilter, vehiclesWhereInput>
  }, "id">

  export type tripsOrderByWithAggregationInput = {
    id?: SortOrder
    request_id?: SortOrderInput | SortOrder
    vehicle_id?: SortOrder
    start_odometer?: SortOrder
    end_odometer?: SortOrderInput | SortOrder
    start_time?: SortOrder
    end_time?: SortOrderInput | SortOrder
    fuel_used?: SortOrderInput | SortOrder
    trip_notes?: SortOrderInput | SortOrder
    created_at?: SortOrder
    driver_id?: SortOrder
    _count?: tripsCountOrderByAggregateInput
    _avg?: tripsAvgOrderByAggregateInput
    _max?: tripsMaxOrderByAggregateInput
    _min?: tripsMinOrderByAggregateInput
    _sum?: tripsSumOrderByAggregateInput
  }

  export type tripsScalarWhereWithAggregatesInput = {
    AND?: tripsScalarWhereWithAggregatesInput | tripsScalarWhereWithAggregatesInput[]
    OR?: tripsScalarWhereWithAggregatesInput[]
    NOT?: tripsScalarWhereWithAggregatesInput | tripsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"trips"> | string
    request_id?: StringNullableWithAggregatesFilter<"trips"> | string | null
    vehicle_id?: StringWithAggregatesFilter<"trips"> | string
    start_odometer?: IntWithAggregatesFilter<"trips"> | number
    end_odometer?: IntNullableWithAggregatesFilter<"trips"> | number | null
    start_time?: DateTimeWithAggregatesFilter<"trips"> | Date | string
    end_time?: DateTimeNullableWithAggregatesFilter<"trips"> | Date | string | null
    fuel_used?: FloatNullableWithAggregatesFilter<"trips"> | number | null
    trip_notes?: StringNullableWithAggregatesFilter<"trips"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"trips"> | Date | string
    driver_id?: StringWithAggregatesFilter<"trips"> | string
  }

  export type usersWhereInput = {
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    id?: StringFilter<"users"> | string
    organization_id?: StringFilter<"users"> | string
    username?: StringFilter<"users"> | string
    password_hash?: StringFilter<"users"> | string
    email?: StringFilter<"users"> | string
    full_name?: StringFilter<"users"> | string
    phone?: StringNullableFilter<"users"> | string | null
    status?: StringFilter<"users"> | string
    created_at?: DateTimeFilter<"users"> | Date | string
    last_login?: DateTimeNullableFilter<"users"> | Date | string | null
    role_id?: StringFilter<"users"> | string
    reports?: ReportsListRelationFilter
    requests_requests_requester_idTousers?: RequestsListRelationFilter
    requests_requests_reviewed_byTousers?: RequestsListRelationFilter
    sessions?: SessionsListRelationFilter
    trips?: TripsListRelationFilter
    organizations?: XOR<OrganizationsScalarRelationFilter, organizationsWhereInput>
    roles?: XOR<RolesScalarRelationFilter, rolesWhereInput>
  }

  export type usersOrderByWithRelationInput = {
    id?: SortOrder
    organization_id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    phone?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrder
    last_login?: SortOrderInput | SortOrder
    role_id?: SortOrder
    reports?: reportsOrderByRelationAggregateInput
    requests_requests_requester_idTousers?: requestsOrderByRelationAggregateInput
    requests_requests_reviewed_byTousers?: requestsOrderByRelationAggregateInput
    sessions?: sessionsOrderByRelationAggregateInput
    trips?: tripsOrderByRelationAggregateInput
    organizations?: organizationsOrderByWithRelationInput
    roles?: rolesOrderByWithRelationInput
  }

  export type usersWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    AND?: usersWhereInput | usersWhereInput[]
    OR?: usersWhereInput[]
    NOT?: usersWhereInput | usersWhereInput[]
    organization_id?: StringFilter<"users"> | string
    password_hash?: StringFilter<"users"> | string
    full_name?: StringFilter<"users"> | string
    phone?: StringNullableFilter<"users"> | string | null
    status?: StringFilter<"users"> | string
    created_at?: DateTimeFilter<"users"> | Date | string
    last_login?: DateTimeNullableFilter<"users"> | Date | string | null
    role_id?: StringFilter<"users"> | string
    reports?: ReportsListRelationFilter
    requests_requests_requester_idTousers?: RequestsListRelationFilter
    requests_requests_reviewed_byTousers?: RequestsListRelationFilter
    sessions?: SessionsListRelationFilter
    trips?: TripsListRelationFilter
    organizations?: XOR<OrganizationsScalarRelationFilter, organizationsWhereInput>
    roles?: XOR<RolesScalarRelationFilter, rolesWhereInput>
  }, "id" | "username" | "email">

  export type usersOrderByWithAggregationInput = {
    id?: SortOrder
    organization_id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    phone?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrder
    last_login?: SortOrderInput | SortOrder
    role_id?: SortOrder
    _count?: usersCountOrderByAggregateInput
    _max?: usersMaxOrderByAggregateInput
    _min?: usersMinOrderByAggregateInput
  }

  export type usersScalarWhereWithAggregatesInput = {
    AND?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    OR?: usersScalarWhereWithAggregatesInput[]
    NOT?: usersScalarWhereWithAggregatesInput | usersScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"users"> | string
    organization_id?: StringWithAggregatesFilter<"users"> | string
    username?: StringWithAggregatesFilter<"users"> | string
    password_hash?: StringWithAggregatesFilter<"users"> | string
    email?: StringWithAggregatesFilter<"users"> | string
    full_name?: StringWithAggregatesFilter<"users"> | string
    phone?: StringNullableWithAggregatesFilter<"users"> | string | null
    status?: StringWithAggregatesFilter<"users"> | string
    created_at?: DateTimeWithAggregatesFilter<"users"> | Date | string
    last_login?: DateTimeNullableWithAggregatesFilter<"users"> | Date | string | null
    role_id?: StringWithAggregatesFilter<"users"> | string
  }

  export type vehiclesWhereInput = {
    AND?: vehiclesWhereInput | vehiclesWhereInput[]
    OR?: vehiclesWhereInput[]
    NOT?: vehiclesWhereInput | vehiclesWhereInput[]
    id?: StringFilter<"vehicles"> | string
    plate_number?: StringFilter<"vehicles"> | string
    model?: StringFilter<"vehicles"> | string
    manufacturer?: StringFilter<"vehicles"> | string
    year?: IntFilter<"vehicles"> | number
    capacity?: IntNullableFilter<"vehicles"> | number | null
    odometer?: IntFilter<"vehicles"> | number
    status?: StringFilter<"vehicles"> | string
    fuel_type?: StringNullableFilter<"vehicles"> | string | null
    last_service_date?: DateTimeNullableFilter<"vehicles"> | Date | string | null
    created_at?: DateTimeFilter<"vehicles"> | Date | string
    organization_id?: StringFilter<"vehicles"> | string
    requests?: RequestsListRelationFilter
    trips?: TripsListRelationFilter
    organizations?: XOR<OrganizationsScalarRelationFilter, organizationsWhereInput>
  }

  export type vehiclesOrderByWithRelationInput = {
    id?: SortOrder
    plate_number?: SortOrder
    model?: SortOrder
    manufacturer?: SortOrder
    year?: SortOrder
    capacity?: SortOrderInput | SortOrder
    odometer?: SortOrder
    status?: SortOrder
    fuel_type?: SortOrderInput | SortOrder
    last_service_date?: SortOrderInput | SortOrder
    created_at?: SortOrder
    organization_id?: SortOrder
    requests?: requestsOrderByRelationAggregateInput
    trips?: tripsOrderByRelationAggregateInput
    organizations?: organizationsOrderByWithRelationInput
  }

  export type vehiclesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    plate_number?: string
    AND?: vehiclesWhereInput | vehiclesWhereInput[]
    OR?: vehiclesWhereInput[]
    NOT?: vehiclesWhereInput | vehiclesWhereInput[]
    model?: StringFilter<"vehicles"> | string
    manufacturer?: StringFilter<"vehicles"> | string
    year?: IntFilter<"vehicles"> | number
    capacity?: IntNullableFilter<"vehicles"> | number | null
    odometer?: IntFilter<"vehicles"> | number
    status?: StringFilter<"vehicles"> | string
    fuel_type?: StringNullableFilter<"vehicles"> | string | null
    last_service_date?: DateTimeNullableFilter<"vehicles"> | Date | string | null
    created_at?: DateTimeFilter<"vehicles"> | Date | string
    organization_id?: StringFilter<"vehicles"> | string
    requests?: RequestsListRelationFilter
    trips?: TripsListRelationFilter
    organizations?: XOR<OrganizationsScalarRelationFilter, organizationsWhereInput>
  }, "id" | "plate_number">

  export type vehiclesOrderByWithAggregationInput = {
    id?: SortOrder
    plate_number?: SortOrder
    model?: SortOrder
    manufacturer?: SortOrder
    year?: SortOrder
    capacity?: SortOrderInput | SortOrder
    odometer?: SortOrder
    status?: SortOrder
    fuel_type?: SortOrderInput | SortOrder
    last_service_date?: SortOrderInput | SortOrder
    created_at?: SortOrder
    organization_id?: SortOrder
    _count?: vehiclesCountOrderByAggregateInput
    _avg?: vehiclesAvgOrderByAggregateInput
    _max?: vehiclesMaxOrderByAggregateInput
    _min?: vehiclesMinOrderByAggregateInput
    _sum?: vehiclesSumOrderByAggregateInput
  }

  export type vehiclesScalarWhereWithAggregatesInput = {
    AND?: vehiclesScalarWhereWithAggregatesInput | vehiclesScalarWhereWithAggregatesInput[]
    OR?: vehiclesScalarWhereWithAggregatesInput[]
    NOT?: vehiclesScalarWhereWithAggregatesInput | vehiclesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"vehicles"> | string
    plate_number?: StringWithAggregatesFilter<"vehicles"> | string
    model?: StringWithAggregatesFilter<"vehicles"> | string
    manufacturer?: StringWithAggregatesFilter<"vehicles"> | string
    year?: IntWithAggregatesFilter<"vehicles"> | number
    capacity?: IntNullableWithAggregatesFilter<"vehicles"> | number | null
    odometer?: IntWithAggregatesFilter<"vehicles"> | number
    status?: StringWithAggregatesFilter<"vehicles"> | string
    fuel_type?: StringNullableWithAggregatesFilter<"vehicles"> | string | null
    last_service_date?: DateTimeNullableWithAggregatesFilter<"vehicles"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"vehicles"> | Date | string
    organization_id?: StringWithAggregatesFilter<"vehicles"> | string
  }

  export type organizationsCreateInput = {
    id: string
    name: string
    address: string
    phone: string
    email: string
    created_at?: Date | string
    reports?: reportsCreateNestedManyWithoutOrganizationsInput
    users?: usersCreateNestedManyWithoutOrganizationsInput
    vehicles?: vehiclesCreateNestedManyWithoutOrganizationsInput
  }

  export type organizationsUncheckedCreateInput = {
    id: string
    name: string
    address: string
    phone: string
    email: string
    created_at?: Date | string
    reports?: reportsUncheckedCreateNestedManyWithoutOrganizationsInput
    users?: usersUncheckedCreateNestedManyWithoutOrganizationsInput
    vehicles?: vehiclesUncheckedCreateNestedManyWithoutOrganizationsInput
  }

  export type organizationsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: reportsUpdateManyWithoutOrganizationsNestedInput
    users?: usersUpdateManyWithoutOrganizationsNestedInput
    vehicles?: vehiclesUpdateManyWithoutOrganizationsNestedInput
  }

  export type organizationsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: reportsUncheckedUpdateManyWithoutOrganizationsNestedInput
    users?: usersUncheckedUpdateManyWithoutOrganizationsNestedInput
    vehicles?: vehiclesUncheckedUpdateManyWithoutOrganizationsNestedInput
  }

  export type organizationsCreateManyInput = {
    id: string
    name: string
    address: string
    phone: string
    email: string
    created_at?: Date | string
  }

  export type organizationsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type organizationsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type permissionsCreateInput = {
    id: string
    name: string
    description?: string | null
    role_permissions?: role_permissionsCreateNestedManyWithoutPermissionsInput
  }

  export type permissionsUncheckedCreateInput = {
    id: string
    name: string
    description?: string | null
    role_permissions?: role_permissionsUncheckedCreateNestedManyWithoutPermissionsInput
  }

  export type permissionsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    role_permissions?: role_permissionsUpdateManyWithoutPermissionsNestedInput
  }

  export type permissionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    role_permissions?: role_permissionsUncheckedUpdateManyWithoutPermissionsNestedInput
  }

  export type permissionsCreateManyInput = {
    id: string
    name: string
    description?: string | null
  }

  export type permissionsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type permissionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type reportsCreateInput = {
    id: string
    report_type: string
    generated_at?: Date | string
    file_url?: string | null
    description?: string | null
    users: usersCreateNestedOneWithoutReportsInput
    organizations: organizationsCreateNestedOneWithoutReportsInput
  }

  export type reportsUncheckedCreateInput = {
    id: string
    generated_by: string
    organization_id: string
    report_type: string
    generated_at?: Date | string
    file_url?: string | null
    description?: string | null
  }

  export type reportsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    report_type?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    users?: usersUpdateOneRequiredWithoutReportsNestedInput
    organizations?: organizationsUpdateOneRequiredWithoutReportsNestedInput
  }

  export type reportsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    generated_by?: StringFieldUpdateOperationsInput | string
    organization_id?: StringFieldUpdateOperationsInput | string
    report_type?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type reportsCreateManyInput = {
    id: string
    generated_by: string
    organization_id: string
    report_type: string
    generated_at?: Date | string
    file_url?: string | null
    description?: string | null
  }

  export type reportsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    report_type?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type reportsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    generated_by?: StringFieldUpdateOperationsInput | string
    organization_id?: StringFieldUpdateOperationsInput | string
    report_type?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type requestsCreateInput = {
    id: string
    requested_at?: Date | string
    trip_purpose: string
    start_location: string
    end_location: string
    start_date: Date | string
    end_date: Date | string
    status?: string
    reviewed_at?: Date | string | null
    comments?: string | null
    users_requests_requester_idTousers: usersCreateNestedOneWithoutRequests_requests_requester_idTousersInput
    users_requests_reviewed_byTousers?: usersCreateNestedOneWithoutRequests_requests_reviewed_byTousersInput
    vehicles?: vehiclesCreateNestedOneWithoutRequestsInput
    trips?: tripsCreateNestedManyWithoutRequestsInput
  }

  export type requestsUncheckedCreateInput = {
    id: string
    vehicle_id?: string | null
    requested_at?: Date | string
    trip_purpose: string
    start_location: string
    end_location: string
    start_date: Date | string
    end_date: Date | string
    status?: string
    reviewed_at?: Date | string | null
    comments?: string | null
    requester_id: string
    reviewed_by?: string | null
    trips?: tripsUncheckedCreateNestedManyWithoutRequestsInput
  }

  export type requestsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_purpose?: StringFieldUpdateOperationsInput | string
    start_location?: StringFieldUpdateOperationsInput | string
    end_location?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    users_requests_requester_idTousers?: usersUpdateOneRequiredWithoutRequests_requests_requester_idTousersNestedInput
    users_requests_reviewed_byTousers?: usersUpdateOneWithoutRequests_requests_reviewed_byTousersNestedInput
    vehicles?: vehiclesUpdateOneWithoutRequestsNestedInput
    trips?: tripsUpdateManyWithoutRequestsNestedInput
  }

  export type requestsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_id?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_purpose?: StringFieldUpdateOperationsInput | string
    start_location?: StringFieldUpdateOperationsInput | string
    end_location?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    requester_id?: StringFieldUpdateOperationsInput | string
    reviewed_by?: NullableStringFieldUpdateOperationsInput | string | null
    trips?: tripsUncheckedUpdateManyWithoutRequestsNestedInput
  }

  export type requestsCreateManyInput = {
    id: string
    vehicle_id?: string | null
    requested_at?: Date | string
    trip_purpose: string
    start_location: string
    end_location: string
    start_date: Date | string
    end_date: Date | string
    status?: string
    reviewed_at?: Date | string | null
    comments?: string | null
    requester_id: string
    reviewed_by?: string | null
  }

  export type requestsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_purpose?: StringFieldUpdateOperationsInput | string
    start_location?: StringFieldUpdateOperationsInput | string
    end_location?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type requestsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_id?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_purpose?: StringFieldUpdateOperationsInput | string
    start_location?: StringFieldUpdateOperationsInput | string
    end_location?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    requester_id?: StringFieldUpdateOperationsInput | string
    reviewed_by?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type role_permissionsCreateInput = {
    id: string
    permissions: permissionsCreateNestedOneWithoutRole_permissionsInput
    roles: rolesCreateNestedOneWithoutRole_permissionsInput
  }

  export type role_permissionsUncheckedCreateInput = {
    id: string
    role_id: string
    permission_id: string
  }

  export type role_permissionsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    permissions?: permissionsUpdateOneRequiredWithoutRole_permissionsNestedInput
    roles?: rolesUpdateOneRequiredWithoutRole_permissionsNestedInput
  }

  export type role_permissionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role_id?: StringFieldUpdateOperationsInput | string
    permission_id?: StringFieldUpdateOperationsInput | string
  }

  export type role_permissionsCreateManyInput = {
    id: string
    role_id: string
    permission_id: string
  }

  export type role_permissionsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type role_permissionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    role_id?: StringFieldUpdateOperationsInput | string
    permission_id?: StringFieldUpdateOperationsInput | string
  }

  export type rolesCreateInput = {
    id: string
    name: string
    description?: string | null
    role_permissions?: role_permissionsCreateNestedManyWithoutRolesInput
    users?: usersCreateNestedManyWithoutRolesInput
  }

  export type rolesUncheckedCreateInput = {
    id: string
    name: string
    description?: string | null
    role_permissions?: role_permissionsUncheckedCreateNestedManyWithoutRolesInput
    users?: usersUncheckedCreateNestedManyWithoutRolesInput
  }

  export type rolesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    role_permissions?: role_permissionsUpdateManyWithoutRolesNestedInput
    users?: usersUpdateManyWithoutRolesNestedInput
  }

  export type rolesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    role_permissions?: role_permissionsUncheckedUpdateManyWithoutRolesNestedInput
    users?: usersUncheckedUpdateManyWithoutRolesNestedInput
  }

  export type rolesCreateManyInput = {
    id: string
    name: string
    description?: string | null
  }

  export type rolesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type rolesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type sessionsCreateInput = {
    id: string
    token: string
    created_at?: Date | string
    expires_at: Date | string
    is_active?: boolean
    users: usersCreateNestedOneWithoutSessionsInput
  }

  export type sessionsUncheckedCreateInput = {
    id: string
    user_id: string
    token: string
    created_at?: Date | string
    expires_at: Date | string
    is_active?: boolean
  }

  export type sessionsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    users?: usersUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type sessionsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type sessionsCreateManyInput = {
    id: string
    user_id: string
    token: string
    created_at?: Date | string
    expires_at: Date | string
    is_active?: boolean
  }

  export type sessionsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type sessionsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type tripsCreateInput = {
    id: string
    start_odometer: number
    end_odometer?: number | null
    start_time: Date | string
    end_time?: Date | string | null
    fuel_used?: number | null
    trip_notes?: string | null
    created_at?: Date | string
    users: usersCreateNestedOneWithoutTripsInput
    requests?: requestsCreateNestedOneWithoutTripsInput
    vehicles: vehiclesCreateNestedOneWithoutTripsInput
  }

  export type tripsUncheckedCreateInput = {
    id: string
    request_id?: string | null
    vehicle_id: string
    start_odometer: number
    end_odometer?: number | null
    start_time: Date | string
    end_time?: Date | string | null
    fuel_used?: number | null
    trip_notes?: string | null
    created_at?: Date | string
    driver_id: string
  }

  export type tripsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_odometer?: IntFieldUpdateOperationsInput | number
    end_odometer?: NullableIntFieldUpdateOperationsInput | number | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fuel_used?: NullableFloatFieldUpdateOperationsInput | number | null
    trip_notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: usersUpdateOneRequiredWithoutTripsNestedInput
    requests?: requestsUpdateOneWithoutTripsNestedInput
    vehicles?: vehiclesUpdateOneRequiredWithoutTripsNestedInput
  }

  export type tripsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    request_id?: NullableStringFieldUpdateOperationsInput | string | null
    vehicle_id?: StringFieldUpdateOperationsInput | string
    start_odometer?: IntFieldUpdateOperationsInput | number
    end_odometer?: NullableIntFieldUpdateOperationsInput | number | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fuel_used?: NullableFloatFieldUpdateOperationsInput | number | null
    trip_notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    driver_id?: StringFieldUpdateOperationsInput | string
  }

  export type tripsCreateManyInput = {
    id: string
    request_id?: string | null
    vehicle_id: string
    start_odometer: number
    end_odometer?: number | null
    start_time: Date | string
    end_time?: Date | string | null
    fuel_used?: number | null
    trip_notes?: string | null
    created_at?: Date | string
    driver_id: string
  }

  export type tripsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_odometer?: IntFieldUpdateOperationsInput | number
    end_odometer?: NullableIntFieldUpdateOperationsInput | number | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fuel_used?: NullableFloatFieldUpdateOperationsInput | number | null
    trip_notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type tripsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    request_id?: NullableStringFieldUpdateOperationsInput | string | null
    vehicle_id?: StringFieldUpdateOperationsInput | string
    start_odometer?: IntFieldUpdateOperationsInput | number
    end_odometer?: NullableIntFieldUpdateOperationsInput | number | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fuel_used?: NullableFloatFieldUpdateOperationsInput | number | null
    trip_notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    driver_id?: StringFieldUpdateOperationsInput | string
  }

  export type usersCreateInput = {
    id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    reports?: reportsCreateNestedManyWithoutUsersInput
    requests_requests_requester_idTousers?: requestsCreateNestedManyWithoutUsers_requests_requester_idTousersInput
    requests_requests_reviewed_byTousers?: requestsCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput
    sessions?: sessionsCreateNestedManyWithoutUsersInput
    trips?: tripsCreateNestedManyWithoutUsersInput
    organizations: organizationsCreateNestedOneWithoutUsersInput
    roles: rolesCreateNestedOneWithoutUsersInput
  }

  export type usersUncheckedCreateInput = {
    id: string
    organization_id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    role_id: string
    reports?: reportsUncheckedCreateNestedManyWithoutUsersInput
    requests_requests_requester_idTousers?: requestsUncheckedCreateNestedManyWithoutUsers_requests_requester_idTousersInput
    requests_requests_reviewed_byTousers?: requestsUncheckedCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput
    sessions?: sessionsUncheckedCreateNestedManyWithoutUsersInput
    trips?: tripsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reports?: reportsUpdateManyWithoutUsersNestedInput
    requests_requests_requester_idTousers?: requestsUpdateManyWithoutUsers_requests_requester_idTousersNestedInput
    requests_requests_reviewed_byTousers?: requestsUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput
    sessions?: sessionsUpdateManyWithoutUsersNestedInput
    trips?: tripsUpdateManyWithoutUsersNestedInput
    organizations?: organizationsUpdateOneRequiredWithoutUsersNestedInput
    roles?: rolesUpdateOneRequiredWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organization_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role_id?: StringFieldUpdateOperationsInput | string
    reports?: reportsUncheckedUpdateManyWithoutUsersNestedInput
    requests_requests_requester_idTousers?: requestsUncheckedUpdateManyWithoutUsers_requests_requester_idTousersNestedInput
    requests_requests_reviewed_byTousers?: requestsUncheckedUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput
    sessions?: sessionsUncheckedUpdateManyWithoutUsersNestedInput
    trips?: tripsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateManyInput = {
    id: string
    organization_id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    role_id: string
  }

  export type usersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type usersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organization_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role_id?: StringFieldUpdateOperationsInput | string
  }

  export type vehiclesCreateInput = {
    id: string
    plate_number: string
    model: string
    manufacturer: string
    year: number
    capacity?: number | null
    odometer?: number
    status?: string
    fuel_type?: string | null
    last_service_date?: Date | string | null
    created_at?: Date | string
    requests?: requestsCreateNestedManyWithoutVehiclesInput
    trips?: tripsCreateNestedManyWithoutVehiclesInput
    organizations: organizationsCreateNestedOneWithoutVehiclesInput
  }

  export type vehiclesUncheckedCreateInput = {
    id: string
    plate_number: string
    model: string
    manufacturer: string
    year: number
    capacity?: number | null
    odometer?: number
    status?: string
    fuel_type?: string | null
    last_service_date?: Date | string | null
    created_at?: Date | string
    organization_id: string
    requests?: requestsUncheckedCreateNestedManyWithoutVehiclesInput
    trips?: tripsUncheckedCreateNestedManyWithoutVehiclesInput
  }

  export type vehiclesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    manufacturer?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    odometer?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    fuel_type?: NullableStringFieldUpdateOperationsInput | string | null
    last_service_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    requests?: requestsUpdateManyWithoutVehiclesNestedInput
    trips?: tripsUpdateManyWithoutVehiclesNestedInput
    organizations?: organizationsUpdateOneRequiredWithoutVehiclesNestedInput
  }

  export type vehiclesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    manufacturer?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    odometer?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    fuel_type?: NullableStringFieldUpdateOperationsInput | string | null
    last_service_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    organization_id?: StringFieldUpdateOperationsInput | string
    requests?: requestsUncheckedUpdateManyWithoutVehiclesNestedInput
    trips?: tripsUncheckedUpdateManyWithoutVehiclesNestedInput
  }

  export type vehiclesCreateManyInput = {
    id: string
    plate_number: string
    model: string
    manufacturer: string
    year: number
    capacity?: number | null
    odometer?: number
    status?: string
    fuel_type?: string | null
    last_service_date?: Date | string | null
    created_at?: Date | string
    organization_id: string
  }

  export type vehiclesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    manufacturer?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    odometer?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    fuel_type?: NullableStringFieldUpdateOperationsInput | string | null
    last_service_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type vehiclesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    manufacturer?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    odometer?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    fuel_type?: NullableStringFieldUpdateOperationsInput | string | null
    last_service_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    organization_id?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ReportsListRelationFilter = {
    every?: reportsWhereInput
    some?: reportsWhereInput
    none?: reportsWhereInput
  }

  export type UsersListRelationFilter = {
    every?: usersWhereInput
    some?: usersWhereInput
    none?: usersWhereInput
  }

  export type VehiclesListRelationFilter = {
    every?: vehiclesWhereInput
    some?: vehiclesWhereInput
    none?: vehiclesWhereInput
  }

  export type reportsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type usersOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type vehiclesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type organizationsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    created_at?: SortOrder
  }

  export type organizationsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    created_at?: SortOrder
  }

  export type organizationsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    created_at?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type Role_permissionsListRelationFilter = {
    every?: role_permissionsWhereInput
    some?: role_permissionsWhereInput
    none?: role_permissionsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type role_permissionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type permissionsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type permissionsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type permissionsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type UsersScalarRelationFilter = {
    is?: usersWhereInput
    isNot?: usersWhereInput
  }

  export type OrganizationsScalarRelationFilter = {
    is?: organizationsWhereInput
    isNot?: organizationsWhereInput
  }

  export type reportsCountOrderByAggregateInput = {
    id?: SortOrder
    generated_by?: SortOrder
    organization_id?: SortOrder
    report_type?: SortOrder
    generated_at?: SortOrder
    file_url?: SortOrder
    description?: SortOrder
  }

  export type reportsMaxOrderByAggregateInput = {
    id?: SortOrder
    generated_by?: SortOrder
    organization_id?: SortOrder
    report_type?: SortOrder
    generated_at?: SortOrder
    file_url?: SortOrder
    description?: SortOrder
  }

  export type reportsMinOrderByAggregateInput = {
    id?: SortOrder
    generated_by?: SortOrder
    organization_id?: SortOrder
    report_type?: SortOrder
    generated_at?: SortOrder
    file_url?: SortOrder
    description?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UsersNullableScalarRelationFilter = {
    is?: usersWhereInput | null
    isNot?: usersWhereInput | null
  }

  export type VehiclesNullableScalarRelationFilter = {
    is?: vehiclesWhereInput | null
    isNot?: vehiclesWhereInput | null
  }

  export type TripsListRelationFilter = {
    every?: tripsWhereInput
    some?: tripsWhereInput
    none?: tripsWhereInput
  }

  export type tripsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type requestsCountOrderByAggregateInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    requested_at?: SortOrder
    trip_purpose?: SortOrder
    start_location?: SortOrder
    end_location?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    status?: SortOrder
    reviewed_at?: SortOrder
    comments?: SortOrder
    requester_id?: SortOrder
    reviewed_by?: SortOrder
  }

  export type requestsMaxOrderByAggregateInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    requested_at?: SortOrder
    trip_purpose?: SortOrder
    start_location?: SortOrder
    end_location?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    status?: SortOrder
    reviewed_at?: SortOrder
    comments?: SortOrder
    requester_id?: SortOrder
    reviewed_by?: SortOrder
  }

  export type requestsMinOrderByAggregateInput = {
    id?: SortOrder
    vehicle_id?: SortOrder
    requested_at?: SortOrder
    trip_purpose?: SortOrder
    start_location?: SortOrder
    end_location?: SortOrder
    start_date?: SortOrder
    end_date?: SortOrder
    status?: SortOrder
    reviewed_at?: SortOrder
    comments?: SortOrder
    requester_id?: SortOrder
    reviewed_by?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PermissionsScalarRelationFilter = {
    is?: permissionsWhereInput
    isNot?: permissionsWhereInput
  }

  export type RolesScalarRelationFilter = {
    is?: rolesWhereInput
    isNot?: rolesWhereInput
  }

  export type role_permissionsRole_idPermission_idCompoundUniqueInput = {
    role_id: string
    permission_id: string
  }

  export type role_permissionsCountOrderByAggregateInput = {
    id?: SortOrder
    role_id?: SortOrder
    permission_id?: SortOrder
  }

  export type role_permissionsMaxOrderByAggregateInput = {
    id?: SortOrder
    role_id?: SortOrder
    permission_id?: SortOrder
  }

  export type role_permissionsMinOrderByAggregateInput = {
    id?: SortOrder
    role_id?: SortOrder
    permission_id?: SortOrder
  }

  export type rolesCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type rolesMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type rolesMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type sessionsCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    token?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    is_active?: SortOrder
  }

  export type sessionsMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    token?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    is_active?: SortOrder
  }

  export type sessionsMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    token?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    is_active?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type RequestsNullableScalarRelationFilter = {
    is?: requestsWhereInput | null
    isNot?: requestsWhereInput | null
  }

  export type VehiclesScalarRelationFilter = {
    is?: vehiclesWhereInput
    isNot?: vehiclesWhereInput
  }

  export type tripsCountOrderByAggregateInput = {
    id?: SortOrder
    request_id?: SortOrder
    vehicle_id?: SortOrder
    start_odometer?: SortOrder
    end_odometer?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    fuel_used?: SortOrder
    trip_notes?: SortOrder
    created_at?: SortOrder
    driver_id?: SortOrder
  }

  export type tripsAvgOrderByAggregateInput = {
    start_odometer?: SortOrder
    end_odometer?: SortOrder
    fuel_used?: SortOrder
  }

  export type tripsMaxOrderByAggregateInput = {
    id?: SortOrder
    request_id?: SortOrder
    vehicle_id?: SortOrder
    start_odometer?: SortOrder
    end_odometer?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    fuel_used?: SortOrder
    trip_notes?: SortOrder
    created_at?: SortOrder
    driver_id?: SortOrder
  }

  export type tripsMinOrderByAggregateInput = {
    id?: SortOrder
    request_id?: SortOrder
    vehicle_id?: SortOrder
    start_odometer?: SortOrder
    end_odometer?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    fuel_used?: SortOrder
    trip_notes?: SortOrder
    created_at?: SortOrder
    driver_id?: SortOrder
  }

  export type tripsSumOrderByAggregateInput = {
    start_odometer?: SortOrder
    end_odometer?: SortOrder
    fuel_used?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type RequestsListRelationFilter = {
    every?: requestsWhereInput
    some?: requestsWhereInput
    none?: requestsWhereInput
  }

  export type SessionsListRelationFilter = {
    every?: sessionsWhereInput
    some?: sessionsWhereInput
    none?: sessionsWhereInput
  }

  export type requestsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type sessionsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type usersCountOrderByAggregateInput = {
    id?: SortOrder
    organization_id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    phone?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    last_login?: SortOrder
    role_id?: SortOrder
  }

  export type usersMaxOrderByAggregateInput = {
    id?: SortOrder
    organization_id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    phone?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    last_login?: SortOrder
    role_id?: SortOrder
  }

  export type usersMinOrderByAggregateInput = {
    id?: SortOrder
    organization_id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    phone?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    last_login?: SortOrder
    role_id?: SortOrder
  }

  export type vehiclesCountOrderByAggregateInput = {
    id?: SortOrder
    plate_number?: SortOrder
    model?: SortOrder
    manufacturer?: SortOrder
    year?: SortOrder
    capacity?: SortOrder
    odometer?: SortOrder
    status?: SortOrder
    fuel_type?: SortOrder
    last_service_date?: SortOrder
    created_at?: SortOrder
    organization_id?: SortOrder
  }

  export type vehiclesAvgOrderByAggregateInput = {
    year?: SortOrder
    capacity?: SortOrder
    odometer?: SortOrder
  }

  export type vehiclesMaxOrderByAggregateInput = {
    id?: SortOrder
    plate_number?: SortOrder
    model?: SortOrder
    manufacturer?: SortOrder
    year?: SortOrder
    capacity?: SortOrder
    odometer?: SortOrder
    status?: SortOrder
    fuel_type?: SortOrder
    last_service_date?: SortOrder
    created_at?: SortOrder
    organization_id?: SortOrder
  }

  export type vehiclesMinOrderByAggregateInput = {
    id?: SortOrder
    plate_number?: SortOrder
    model?: SortOrder
    manufacturer?: SortOrder
    year?: SortOrder
    capacity?: SortOrder
    odometer?: SortOrder
    status?: SortOrder
    fuel_type?: SortOrder
    last_service_date?: SortOrder
    created_at?: SortOrder
    organization_id?: SortOrder
  }

  export type vehiclesSumOrderByAggregateInput = {
    year?: SortOrder
    capacity?: SortOrder
    odometer?: SortOrder
  }

  export type reportsCreateNestedManyWithoutOrganizationsInput = {
    create?: XOR<reportsCreateWithoutOrganizationsInput, reportsUncheckedCreateWithoutOrganizationsInput> | reportsCreateWithoutOrganizationsInput[] | reportsUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: reportsCreateOrConnectWithoutOrganizationsInput | reportsCreateOrConnectWithoutOrganizationsInput[]
    createMany?: reportsCreateManyOrganizationsInputEnvelope
    connect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
  }

  export type usersCreateNestedManyWithoutOrganizationsInput = {
    create?: XOR<usersCreateWithoutOrganizationsInput, usersUncheckedCreateWithoutOrganizationsInput> | usersCreateWithoutOrganizationsInput[] | usersUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: usersCreateOrConnectWithoutOrganizationsInput | usersCreateOrConnectWithoutOrganizationsInput[]
    createMany?: usersCreateManyOrganizationsInputEnvelope
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
  }

  export type vehiclesCreateNestedManyWithoutOrganizationsInput = {
    create?: XOR<vehiclesCreateWithoutOrganizationsInput, vehiclesUncheckedCreateWithoutOrganizationsInput> | vehiclesCreateWithoutOrganizationsInput[] | vehiclesUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: vehiclesCreateOrConnectWithoutOrganizationsInput | vehiclesCreateOrConnectWithoutOrganizationsInput[]
    createMany?: vehiclesCreateManyOrganizationsInputEnvelope
    connect?: vehiclesWhereUniqueInput | vehiclesWhereUniqueInput[]
  }

  export type reportsUncheckedCreateNestedManyWithoutOrganizationsInput = {
    create?: XOR<reportsCreateWithoutOrganizationsInput, reportsUncheckedCreateWithoutOrganizationsInput> | reportsCreateWithoutOrganizationsInput[] | reportsUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: reportsCreateOrConnectWithoutOrganizationsInput | reportsCreateOrConnectWithoutOrganizationsInput[]
    createMany?: reportsCreateManyOrganizationsInputEnvelope
    connect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
  }

  export type usersUncheckedCreateNestedManyWithoutOrganizationsInput = {
    create?: XOR<usersCreateWithoutOrganizationsInput, usersUncheckedCreateWithoutOrganizationsInput> | usersCreateWithoutOrganizationsInput[] | usersUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: usersCreateOrConnectWithoutOrganizationsInput | usersCreateOrConnectWithoutOrganizationsInput[]
    createMany?: usersCreateManyOrganizationsInputEnvelope
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
  }

  export type vehiclesUncheckedCreateNestedManyWithoutOrganizationsInput = {
    create?: XOR<vehiclesCreateWithoutOrganizationsInput, vehiclesUncheckedCreateWithoutOrganizationsInput> | vehiclesCreateWithoutOrganizationsInput[] | vehiclesUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: vehiclesCreateOrConnectWithoutOrganizationsInput | vehiclesCreateOrConnectWithoutOrganizationsInput[]
    createMany?: vehiclesCreateManyOrganizationsInputEnvelope
    connect?: vehiclesWhereUniqueInput | vehiclesWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type reportsUpdateManyWithoutOrganizationsNestedInput = {
    create?: XOR<reportsCreateWithoutOrganizationsInput, reportsUncheckedCreateWithoutOrganizationsInput> | reportsCreateWithoutOrganizationsInput[] | reportsUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: reportsCreateOrConnectWithoutOrganizationsInput | reportsCreateOrConnectWithoutOrganizationsInput[]
    upsert?: reportsUpsertWithWhereUniqueWithoutOrganizationsInput | reportsUpsertWithWhereUniqueWithoutOrganizationsInput[]
    createMany?: reportsCreateManyOrganizationsInputEnvelope
    set?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    disconnect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    delete?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    connect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    update?: reportsUpdateWithWhereUniqueWithoutOrganizationsInput | reportsUpdateWithWhereUniqueWithoutOrganizationsInput[]
    updateMany?: reportsUpdateManyWithWhereWithoutOrganizationsInput | reportsUpdateManyWithWhereWithoutOrganizationsInput[]
    deleteMany?: reportsScalarWhereInput | reportsScalarWhereInput[]
  }

  export type usersUpdateManyWithoutOrganizationsNestedInput = {
    create?: XOR<usersCreateWithoutOrganizationsInput, usersUncheckedCreateWithoutOrganizationsInput> | usersCreateWithoutOrganizationsInput[] | usersUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: usersCreateOrConnectWithoutOrganizationsInput | usersCreateOrConnectWithoutOrganizationsInput[]
    upsert?: usersUpsertWithWhereUniqueWithoutOrganizationsInput | usersUpsertWithWhereUniqueWithoutOrganizationsInput[]
    createMany?: usersCreateManyOrganizationsInputEnvelope
    set?: usersWhereUniqueInput | usersWhereUniqueInput[]
    disconnect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    delete?: usersWhereUniqueInput | usersWhereUniqueInput[]
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    update?: usersUpdateWithWhereUniqueWithoutOrganizationsInput | usersUpdateWithWhereUniqueWithoutOrganizationsInput[]
    updateMany?: usersUpdateManyWithWhereWithoutOrganizationsInput | usersUpdateManyWithWhereWithoutOrganizationsInput[]
    deleteMany?: usersScalarWhereInput | usersScalarWhereInput[]
  }

  export type vehiclesUpdateManyWithoutOrganizationsNestedInput = {
    create?: XOR<vehiclesCreateWithoutOrganizationsInput, vehiclesUncheckedCreateWithoutOrganizationsInput> | vehiclesCreateWithoutOrganizationsInput[] | vehiclesUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: vehiclesCreateOrConnectWithoutOrganizationsInput | vehiclesCreateOrConnectWithoutOrganizationsInput[]
    upsert?: vehiclesUpsertWithWhereUniqueWithoutOrganizationsInput | vehiclesUpsertWithWhereUniqueWithoutOrganizationsInput[]
    createMany?: vehiclesCreateManyOrganizationsInputEnvelope
    set?: vehiclesWhereUniqueInput | vehiclesWhereUniqueInput[]
    disconnect?: vehiclesWhereUniqueInput | vehiclesWhereUniqueInput[]
    delete?: vehiclesWhereUniqueInput | vehiclesWhereUniqueInput[]
    connect?: vehiclesWhereUniqueInput | vehiclesWhereUniqueInput[]
    update?: vehiclesUpdateWithWhereUniqueWithoutOrganizationsInput | vehiclesUpdateWithWhereUniqueWithoutOrganizationsInput[]
    updateMany?: vehiclesUpdateManyWithWhereWithoutOrganizationsInput | vehiclesUpdateManyWithWhereWithoutOrganizationsInput[]
    deleteMany?: vehiclesScalarWhereInput | vehiclesScalarWhereInput[]
  }

  export type reportsUncheckedUpdateManyWithoutOrganizationsNestedInput = {
    create?: XOR<reportsCreateWithoutOrganizationsInput, reportsUncheckedCreateWithoutOrganizationsInput> | reportsCreateWithoutOrganizationsInput[] | reportsUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: reportsCreateOrConnectWithoutOrganizationsInput | reportsCreateOrConnectWithoutOrganizationsInput[]
    upsert?: reportsUpsertWithWhereUniqueWithoutOrganizationsInput | reportsUpsertWithWhereUniqueWithoutOrganizationsInput[]
    createMany?: reportsCreateManyOrganizationsInputEnvelope
    set?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    disconnect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    delete?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    connect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    update?: reportsUpdateWithWhereUniqueWithoutOrganizationsInput | reportsUpdateWithWhereUniqueWithoutOrganizationsInput[]
    updateMany?: reportsUpdateManyWithWhereWithoutOrganizationsInput | reportsUpdateManyWithWhereWithoutOrganizationsInput[]
    deleteMany?: reportsScalarWhereInput | reportsScalarWhereInput[]
  }

  export type usersUncheckedUpdateManyWithoutOrganizationsNestedInput = {
    create?: XOR<usersCreateWithoutOrganizationsInput, usersUncheckedCreateWithoutOrganizationsInput> | usersCreateWithoutOrganizationsInput[] | usersUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: usersCreateOrConnectWithoutOrganizationsInput | usersCreateOrConnectWithoutOrganizationsInput[]
    upsert?: usersUpsertWithWhereUniqueWithoutOrganizationsInput | usersUpsertWithWhereUniqueWithoutOrganizationsInput[]
    createMany?: usersCreateManyOrganizationsInputEnvelope
    set?: usersWhereUniqueInput | usersWhereUniqueInput[]
    disconnect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    delete?: usersWhereUniqueInput | usersWhereUniqueInput[]
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    update?: usersUpdateWithWhereUniqueWithoutOrganizationsInput | usersUpdateWithWhereUniqueWithoutOrganizationsInput[]
    updateMany?: usersUpdateManyWithWhereWithoutOrganizationsInput | usersUpdateManyWithWhereWithoutOrganizationsInput[]
    deleteMany?: usersScalarWhereInput | usersScalarWhereInput[]
  }

  export type vehiclesUncheckedUpdateManyWithoutOrganizationsNestedInput = {
    create?: XOR<vehiclesCreateWithoutOrganizationsInput, vehiclesUncheckedCreateWithoutOrganizationsInput> | vehiclesCreateWithoutOrganizationsInput[] | vehiclesUncheckedCreateWithoutOrganizationsInput[]
    connectOrCreate?: vehiclesCreateOrConnectWithoutOrganizationsInput | vehiclesCreateOrConnectWithoutOrganizationsInput[]
    upsert?: vehiclesUpsertWithWhereUniqueWithoutOrganizationsInput | vehiclesUpsertWithWhereUniqueWithoutOrganizationsInput[]
    createMany?: vehiclesCreateManyOrganizationsInputEnvelope
    set?: vehiclesWhereUniqueInput | vehiclesWhereUniqueInput[]
    disconnect?: vehiclesWhereUniqueInput | vehiclesWhereUniqueInput[]
    delete?: vehiclesWhereUniqueInput | vehiclesWhereUniqueInput[]
    connect?: vehiclesWhereUniqueInput | vehiclesWhereUniqueInput[]
    update?: vehiclesUpdateWithWhereUniqueWithoutOrganizationsInput | vehiclesUpdateWithWhereUniqueWithoutOrganizationsInput[]
    updateMany?: vehiclesUpdateManyWithWhereWithoutOrganizationsInput | vehiclesUpdateManyWithWhereWithoutOrganizationsInput[]
    deleteMany?: vehiclesScalarWhereInput | vehiclesScalarWhereInput[]
  }

  export type role_permissionsCreateNestedManyWithoutPermissionsInput = {
    create?: XOR<role_permissionsCreateWithoutPermissionsInput, role_permissionsUncheckedCreateWithoutPermissionsInput> | role_permissionsCreateWithoutPermissionsInput[] | role_permissionsUncheckedCreateWithoutPermissionsInput[]
    connectOrCreate?: role_permissionsCreateOrConnectWithoutPermissionsInput | role_permissionsCreateOrConnectWithoutPermissionsInput[]
    createMany?: role_permissionsCreateManyPermissionsInputEnvelope
    connect?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
  }

  export type role_permissionsUncheckedCreateNestedManyWithoutPermissionsInput = {
    create?: XOR<role_permissionsCreateWithoutPermissionsInput, role_permissionsUncheckedCreateWithoutPermissionsInput> | role_permissionsCreateWithoutPermissionsInput[] | role_permissionsUncheckedCreateWithoutPermissionsInput[]
    connectOrCreate?: role_permissionsCreateOrConnectWithoutPermissionsInput | role_permissionsCreateOrConnectWithoutPermissionsInput[]
    createMany?: role_permissionsCreateManyPermissionsInputEnvelope
    connect?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type role_permissionsUpdateManyWithoutPermissionsNestedInput = {
    create?: XOR<role_permissionsCreateWithoutPermissionsInput, role_permissionsUncheckedCreateWithoutPermissionsInput> | role_permissionsCreateWithoutPermissionsInput[] | role_permissionsUncheckedCreateWithoutPermissionsInput[]
    connectOrCreate?: role_permissionsCreateOrConnectWithoutPermissionsInput | role_permissionsCreateOrConnectWithoutPermissionsInput[]
    upsert?: role_permissionsUpsertWithWhereUniqueWithoutPermissionsInput | role_permissionsUpsertWithWhereUniqueWithoutPermissionsInput[]
    createMany?: role_permissionsCreateManyPermissionsInputEnvelope
    set?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    disconnect?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    delete?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    connect?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    update?: role_permissionsUpdateWithWhereUniqueWithoutPermissionsInput | role_permissionsUpdateWithWhereUniqueWithoutPermissionsInput[]
    updateMany?: role_permissionsUpdateManyWithWhereWithoutPermissionsInput | role_permissionsUpdateManyWithWhereWithoutPermissionsInput[]
    deleteMany?: role_permissionsScalarWhereInput | role_permissionsScalarWhereInput[]
  }

  export type role_permissionsUncheckedUpdateManyWithoutPermissionsNestedInput = {
    create?: XOR<role_permissionsCreateWithoutPermissionsInput, role_permissionsUncheckedCreateWithoutPermissionsInput> | role_permissionsCreateWithoutPermissionsInput[] | role_permissionsUncheckedCreateWithoutPermissionsInput[]
    connectOrCreate?: role_permissionsCreateOrConnectWithoutPermissionsInput | role_permissionsCreateOrConnectWithoutPermissionsInput[]
    upsert?: role_permissionsUpsertWithWhereUniqueWithoutPermissionsInput | role_permissionsUpsertWithWhereUniqueWithoutPermissionsInput[]
    createMany?: role_permissionsCreateManyPermissionsInputEnvelope
    set?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    disconnect?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    delete?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    connect?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    update?: role_permissionsUpdateWithWhereUniqueWithoutPermissionsInput | role_permissionsUpdateWithWhereUniqueWithoutPermissionsInput[]
    updateMany?: role_permissionsUpdateManyWithWhereWithoutPermissionsInput | role_permissionsUpdateManyWithWhereWithoutPermissionsInput[]
    deleteMany?: role_permissionsScalarWhereInput | role_permissionsScalarWhereInput[]
  }

  export type usersCreateNestedOneWithoutReportsInput = {
    create?: XOR<usersCreateWithoutReportsInput, usersUncheckedCreateWithoutReportsInput>
    connectOrCreate?: usersCreateOrConnectWithoutReportsInput
    connect?: usersWhereUniqueInput
  }

  export type organizationsCreateNestedOneWithoutReportsInput = {
    create?: XOR<organizationsCreateWithoutReportsInput, organizationsUncheckedCreateWithoutReportsInput>
    connectOrCreate?: organizationsCreateOrConnectWithoutReportsInput
    connect?: organizationsWhereUniqueInput
  }

  export type usersUpdateOneRequiredWithoutReportsNestedInput = {
    create?: XOR<usersCreateWithoutReportsInput, usersUncheckedCreateWithoutReportsInput>
    connectOrCreate?: usersCreateOrConnectWithoutReportsInput
    upsert?: usersUpsertWithoutReportsInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutReportsInput, usersUpdateWithoutReportsInput>, usersUncheckedUpdateWithoutReportsInput>
  }

  export type organizationsUpdateOneRequiredWithoutReportsNestedInput = {
    create?: XOR<organizationsCreateWithoutReportsInput, organizationsUncheckedCreateWithoutReportsInput>
    connectOrCreate?: organizationsCreateOrConnectWithoutReportsInput
    upsert?: organizationsUpsertWithoutReportsInput
    connect?: organizationsWhereUniqueInput
    update?: XOR<XOR<organizationsUpdateToOneWithWhereWithoutReportsInput, organizationsUpdateWithoutReportsInput>, organizationsUncheckedUpdateWithoutReportsInput>
  }

  export type usersCreateNestedOneWithoutRequests_requests_requester_idTousersInput = {
    create?: XOR<usersCreateWithoutRequests_requests_requester_idTousersInput, usersUncheckedCreateWithoutRequests_requests_requester_idTousersInput>
    connectOrCreate?: usersCreateOrConnectWithoutRequests_requests_requester_idTousersInput
    connect?: usersWhereUniqueInput
  }

  export type usersCreateNestedOneWithoutRequests_requests_reviewed_byTousersInput = {
    create?: XOR<usersCreateWithoutRequests_requests_reviewed_byTousersInput, usersUncheckedCreateWithoutRequests_requests_reviewed_byTousersInput>
    connectOrCreate?: usersCreateOrConnectWithoutRequests_requests_reviewed_byTousersInput
    connect?: usersWhereUniqueInput
  }

  export type vehiclesCreateNestedOneWithoutRequestsInput = {
    create?: XOR<vehiclesCreateWithoutRequestsInput, vehiclesUncheckedCreateWithoutRequestsInput>
    connectOrCreate?: vehiclesCreateOrConnectWithoutRequestsInput
    connect?: vehiclesWhereUniqueInput
  }

  export type tripsCreateNestedManyWithoutRequestsInput = {
    create?: XOR<tripsCreateWithoutRequestsInput, tripsUncheckedCreateWithoutRequestsInput> | tripsCreateWithoutRequestsInput[] | tripsUncheckedCreateWithoutRequestsInput[]
    connectOrCreate?: tripsCreateOrConnectWithoutRequestsInput | tripsCreateOrConnectWithoutRequestsInput[]
    createMany?: tripsCreateManyRequestsInputEnvelope
    connect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
  }

  export type tripsUncheckedCreateNestedManyWithoutRequestsInput = {
    create?: XOR<tripsCreateWithoutRequestsInput, tripsUncheckedCreateWithoutRequestsInput> | tripsCreateWithoutRequestsInput[] | tripsUncheckedCreateWithoutRequestsInput[]
    connectOrCreate?: tripsCreateOrConnectWithoutRequestsInput | tripsCreateOrConnectWithoutRequestsInput[]
    createMany?: tripsCreateManyRequestsInputEnvelope
    connect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type usersUpdateOneRequiredWithoutRequests_requests_requester_idTousersNestedInput = {
    create?: XOR<usersCreateWithoutRequests_requests_requester_idTousersInput, usersUncheckedCreateWithoutRequests_requests_requester_idTousersInput>
    connectOrCreate?: usersCreateOrConnectWithoutRequests_requests_requester_idTousersInput
    upsert?: usersUpsertWithoutRequests_requests_requester_idTousersInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutRequests_requests_requester_idTousersInput, usersUpdateWithoutRequests_requests_requester_idTousersInput>, usersUncheckedUpdateWithoutRequests_requests_requester_idTousersInput>
  }

  export type usersUpdateOneWithoutRequests_requests_reviewed_byTousersNestedInput = {
    create?: XOR<usersCreateWithoutRequests_requests_reviewed_byTousersInput, usersUncheckedCreateWithoutRequests_requests_reviewed_byTousersInput>
    connectOrCreate?: usersCreateOrConnectWithoutRequests_requests_reviewed_byTousersInput
    upsert?: usersUpsertWithoutRequests_requests_reviewed_byTousersInput
    disconnect?: usersWhereInput | boolean
    delete?: usersWhereInput | boolean
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutRequests_requests_reviewed_byTousersInput, usersUpdateWithoutRequests_requests_reviewed_byTousersInput>, usersUncheckedUpdateWithoutRequests_requests_reviewed_byTousersInput>
  }

  export type vehiclesUpdateOneWithoutRequestsNestedInput = {
    create?: XOR<vehiclesCreateWithoutRequestsInput, vehiclesUncheckedCreateWithoutRequestsInput>
    connectOrCreate?: vehiclesCreateOrConnectWithoutRequestsInput
    upsert?: vehiclesUpsertWithoutRequestsInput
    disconnect?: vehiclesWhereInput | boolean
    delete?: vehiclesWhereInput | boolean
    connect?: vehiclesWhereUniqueInput
    update?: XOR<XOR<vehiclesUpdateToOneWithWhereWithoutRequestsInput, vehiclesUpdateWithoutRequestsInput>, vehiclesUncheckedUpdateWithoutRequestsInput>
  }

  export type tripsUpdateManyWithoutRequestsNestedInput = {
    create?: XOR<tripsCreateWithoutRequestsInput, tripsUncheckedCreateWithoutRequestsInput> | tripsCreateWithoutRequestsInput[] | tripsUncheckedCreateWithoutRequestsInput[]
    connectOrCreate?: tripsCreateOrConnectWithoutRequestsInput | tripsCreateOrConnectWithoutRequestsInput[]
    upsert?: tripsUpsertWithWhereUniqueWithoutRequestsInput | tripsUpsertWithWhereUniqueWithoutRequestsInput[]
    createMany?: tripsCreateManyRequestsInputEnvelope
    set?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    disconnect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    delete?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    connect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    update?: tripsUpdateWithWhereUniqueWithoutRequestsInput | tripsUpdateWithWhereUniqueWithoutRequestsInput[]
    updateMany?: tripsUpdateManyWithWhereWithoutRequestsInput | tripsUpdateManyWithWhereWithoutRequestsInput[]
    deleteMany?: tripsScalarWhereInput | tripsScalarWhereInput[]
  }

  export type tripsUncheckedUpdateManyWithoutRequestsNestedInput = {
    create?: XOR<tripsCreateWithoutRequestsInput, tripsUncheckedCreateWithoutRequestsInput> | tripsCreateWithoutRequestsInput[] | tripsUncheckedCreateWithoutRequestsInput[]
    connectOrCreate?: tripsCreateOrConnectWithoutRequestsInput | tripsCreateOrConnectWithoutRequestsInput[]
    upsert?: tripsUpsertWithWhereUniqueWithoutRequestsInput | tripsUpsertWithWhereUniqueWithoutRequestsInput[]
    createMany?: tripsCreateManyRequestsInputEnvelope
    set?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    disconnect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    delete?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    connect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    update?: tripsUpdateWithWhereUniqueWithoutRequestsInput | tripsUpdateWithWhereUniqueWithoutRequestsInput[]
    updateMany?: tripsUpdateManyWithWhereWithoutRequestsInput | tripsUpdateManyWithWhereWithoutRequestsInput[]
    deleteMany?: tripsScalarWhereInput | tripsScalarWhereInput[]
  }

  export type permissionsCreateNestedOneWithoutRole_permissionsInput = {
    create?: XOR<permissionsCreateWithoutRole_permissionsInput, permissionsUncheckedCreateWithoutRole_permissionsInput>
    connectOrCreate?: permissionsCreateOrConnectWithoutRole_permissionsInput
    connect?: permissionsWhereUniqueInput
  }

  export type rolesCreateNestedOneWithoutRole_permissionsInput = {
    create?: XOR<rolesCreateWithoutRole_permissionsInput, rolesUncheckedCreateWithoutRole_permissionsInput>
    connectOrCreate?: rolesCreateOrConnectWithoutRole_permissionsInput
    connect?: rolesWhereUniqueInput
  }

  export type permissionsUpdateOneRequiredWithoutRole_permissionsNestedInput = {
    create?: XOR<permissionsCreateWithoutRole_permissionsInput, permissionsUncheckedCreateWithoutRole_permissionsInput>
    connectOrCreate?: permissionsCreateOrConnectWithoutRole_permissionsInput
    upsert?: permissionsUpsertWithoutRole_permissionsInput
    connect?: permissionsWhereUniqueInput
    update?: XOR<XOR<permissionsUpdateToOneWithWhereWithoutRole_permissionsInput, permissionsUpdateWithoutRole_permissionsInput>, permissionsUncheckedUpdateWithoutRole_permissionsInput>
  }

  export type rolesUpdateOneRequiredWithoutRole_permissionsNestedInput = {
    create?: XOR<rolesCreateWithoutRole_permissionsInput, rolesUncheckedCreateWithoutRole_permissionsInput>
    connectOrCreate?: rolesCreateOrConnectWithoutRole_permissionsInput
    upsert?: rolesUpsertWithoutRole_permissionsInput
    connect?: rolesWhereUniqueInput
    update?: XOR<XOR<rolesUpdateToOneWithWhereWithoutRole_permissionsInput, rolesUpdateWithoutRole_permissionsInput>, rolesUncheckedUpdateWithoutRole_permissionsInput>
  }

  export type role_permissionsCreateNestedManyWithoutRolesInput = {
    create?: XOR<role_permissionsCreateWithoutRolesInput, role_permissionsUncheckedCreateWithoutRolesInput> | role_permissionsCreateWithoutRolesInput[] | role_permissionsUncheckedCreateWithoutRolesInput[]
    connectOrCreate?: role_permissionsCreateOrConnectWithoutRolesInput | role_permissionsCreateOrConnectWithoutRolesInput[]
    createMany?: role_permissionsCreateManyRolesInputEnvelope
    connect?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
  }

  export type usersCreateNestedManyWithoutRolesInput = {
    create?: XOR<usersCreateWithoutRolesInput, usersUncheckedCreateWithoutRolesInput> | usersCreateWithoutRolesInput[] | usersUncheckedCreateWithoutRolesInput[]
    connectOrCreate?: usersCreateOrConnectWithoutRolesInput | usersCreateOrConnectWithoutRolesInput[]
    createMany?: usersCreateManyRolesInputEnvelope
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
  }

  export type role_permissionsUncheckedCreateNestedManyWithoutRolesInput = {
    create?: XOR<role_permissionsCreateWithoutRolesInput, role_permissionsUncheckedCreateWithoutRolesInput> | role_permissionsCreateWithoutRolesInput[] | role_permissionsUncheckedCreateWithoutRolesInput[]
    connectOrCreate?: role_permissionsCreateOrConnectWithoutRolesInput | role_permissionsCreateOrConnectWithoutRolesInput[]
    createMany?: role_permissionsCreateManyRolesInputEnvelope
    connect?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
  }

  export type usersUncheckedCreateNestedManyWithoutRolesInput = {
    create?: XOR<usersCreateWithoutRolesInput, usersUncheckedCreateWithoutRolesInput> | usersCreateWithoutRolesInput[] | usersUncheckedCreateWithoutRolesInput[]
    connectOrCreate?: usersCreateOrConnectWithoutRolesInput | usersCreateOrConnectWithoutRolesInput[]
    createMany?: usersCreateManyRolesInputEnvelope
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
  }

  export type role_permissionsUpdateManyWithoutRolesNestedInput = {
    create?: XOR<role_permissionsCreateWithoutRolesInput, role_permissionsUncheckedCreateWithoutRolesInput> | role_permissionsCreateWithoutRolesInput[] | role_permissionsUncheckedCreateWithoutRolesInput[]
    connectOrCreate?: role_permissionsCreateOrConnectWithoutRolesInput | role_permissionsCreateOrConnectWithoutRolesInput[]
    upsert?: role_permissionsUpsertWithWhereUniqueWithoutRolesInput | role_permissionsUpsertWithWhereUniqueWithoutRolesInput[]
    createMany?: role_permissionsCreateManyRolesInputEnvelope
    set?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    disconnect?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    delete?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    connect?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    update?: role_permissionsUpdateWithWhereUniqueWithoutRolesInput | role_permissionsUpdateWithWhereUniqueWithoutRolesInput[]
    updateMany?: role_permissionsUpdateManyWithWhereWithoutRolesInput | role_permissionsUpdateManyWithWhereWithoutRolesInput[]
    deleteMany?: role_permissionsScalarWhereInput | role_permissionsScalarWhereInput[]
  }

  export type usersUpdateManyWithoutRolesNestedInput = {
    create?: XOR<usersCreateWithoutRolesInput, usersUncheckedCreateWithoutRolesInput> | usersCreateWithoutRolesInput[] | usersUncheckedCreateWithoutRolesInput[]
    connectOrCreate?: usersCreateOrConnectWithoutRolesInput | usersCreateOrConnectWithoutRolesInput[]
    upsert?: usersUpsertWithWhereUniqueWithoutRolesInput | usersUpsertWithWhereUniqueWithoutRolesInput[]
    createMany?: usersCreateManyRolesInputEnvelope
    set?: usersWhereUniqueInput | usersWhereUniqueInput[]
    disconnect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    delete?: usersWhereUniqueInput | usersWhereUniqueInput[]
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    update?: usersUpdateWithWhereUniqueWithoutRolesInput | usersUpdateWithWhereUniqueWithoutRolesInput[]
    updateMany?: usersUpdateManyWithWhereWithoutRolesInput | usersUpdateManyWithWhereWithoutRolesInput[]
    deleteMany?: usersScalarWhereInput | usersScalarWhereInput[]
  }

  export type role_permissionsUncheckedUpdateManyWithoutRolesNestedInput = {
    create?: XOR<role_permissionsCreateWithoutRolesInput, role_permissionsUncheckedCreateWithoutRolesInput> | role_permissionsCreateWithoutRolesInput[] | role_permissionsUncheckedCreateWithoutRolesInput[]
    connectOrCreate?: role_permissionsCreateOrConnectWithoutRolesInput | role_permissionsCreateOrConnectWithoutRolesInput[]
    upsert?: role_permissionsUpsertWithWhereUniqueWithoutRolesInput | role_permissionsUpsertWithWhereUniqueWithoutRolesInput[]
    createMany?: role_permissionsCreateManyRolesInputEnvelope
    set?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    disconnect?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    delete?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    connect?: role_permissionsWhereUniqueInput | role_permissionsWhereUniqueInput[]
    update?: role_permissionsUpdateWithWhereUniqueWithoutRolesInput | role_permissionsUpdateWithWhereUniqueWithoutRolesInput[]
    updateMany?: role_permissionsUpdateManyWithWhereWithoutRolesInput | role_permissionsUpdateManyWithWhereWithoutRolesInput[]
    deleteMany?: role_permissionsScalarWhereInput | role_permissionsScalarWhereInput[]
  }

  export type usersUncheckedUpdateManyWithoutRolesNestedInput = {
    create?: XOR<usersCreateWithoutRolesInput, usersUncheckedCreateWithoutRolesInput> | usersCreateWithoutRolesInput[] | usersUncheckedCreateWithoutRolesInput[]
    connectOrCreate?: usersCreateOrConnectWithoutRolesInput | usersCreateOrConnectWithoutRolesInput[]
    upsert?: usersUpsertWithWhereUniqueWithoutRolesInput | usersUpsertWithWhereUniqueWithoutRolesInput[]
    createMany?: usersCreateManyRolesInputEnvelope
    set?: usersWhereUniqueInput | usersWhereUniqueInput[]
    disconnect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    delete?: usersWhereUniqueInput | usersWhereUniqueInput[]
    connect?: usersWhereUniqueInput | usersWhereUniqueInput[]
    update?: usersUpdateWithWhereUniqueWithoutRolesInput | usersUpdateWithWhereUniqueWithoutRolesInput[]
    updateMany?: usersUpdateManyWithWhereWithoutRolesInput | usersUpdateManyWithWhereWithoutRolesInput[]
    deleteMany?: usersScalarWhereInput | usersScalarWhereInput[]
  }

  export type usersCreateNestedOneWithoutSessionsInput = {
    create?: XOR<usersCreateWithoutSessionsInput, usersUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: usersCreateOrConnectWithoutSessionsInput
    connect?: usersWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type usersUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<usersCreateWithoutSessionsInput, usersUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: usersCreateOrConnectWithoutSessionsInput
    upsert?: usersUpsertWithoutSessionsInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutSessionsInput, usersUpdateWithoutSessionsInput>, usersUncheckedUpdateWithoutSessionsInput>
  }

  export type usersCreateNestedOneWithoutTripsInput = {
    create?: XOR<usersCreateWithoutTripsInput, usersUncheckedCreateWithoutTripsInput>
    connectOrCreate?: usersCreateOrConnectWithoutTripsInput
    connect?: usersWhereUniqueInput
  }

  export type requestsCreateNestedOneWithoutTripsInput = {
    create?: XOR<requestsCreateWithoutTripsInput, requestsUncheckedCreateWithoutTripsInput>
    connectOrCreate?: requestsCreateOrConnectWithoutTripsInput
    connect?: requestsWhereUniqueInput
  }

  export type vehiclesCreateNestedOneWithoutTripsInput = {
    create?: XOR<vehiclesCreateWithoutTripsInput, vehiclesUncheckedCreateWithoutTripsInput>
    connectOrCreate?: vehiclesCreateOrConnectWithoutTripsInput
    connect?: vehiclesWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type usersUpdateOneRequiredWithoutTripsNestedInput = {
    create?: XOR<usersCreateWithoutTripsInput, usersUncheckedCreateWithoutTripsInput>
    connectOrCreate?: usersCreateOrConnectWithoutTripsInput
    upsert?: usersUpsertWithoutTripsInput
    connect?: usersWhereUniqueInput
    update?: XOR<XOR<usersUpdateToOneWithWhereWithoutTripsInput, usersUpdateWithoutTripsInput>, usersUncheckedUpdateWithoutTripsInput>
  }

  export type requestsUpdateOneWithoutTripsNestedInput = {
    create?: XOR<requestsCreateWithoutTripsInput, requestsUncheckedCreateWithoutTripsInput>
    connectOrCreate?: requestsCreateOrConnectWithoutTripsInput
    upsert?: requestsUpsertWithoutTripsInput
    disconnect?: requestsWhereInput | boolean
    delete?: requestsWhereInput | boolean
    connect?: requestsWhereUniqueInput
    update?: XOR<XOR<requestsUpdateToOneWithWhereWithoutTripsInput, requestsUpdateWithoutTripsInput>, requestsUncheckedUpdateWithoutTripsInput>
  }

  export type vehiclesUpdateOneRequiredWithoutTripsNestedInput = {
    create?: XOR<vehiclesCreateWithoutTripsInput, vehiclesUncheckedCreateWithoutTripsInput>
    connectOrCreate?: vehiclesCreateOrConnectWithoutTripsInput
    upsert?: vehiclesUpsertWithoutTripsInput
    connect?: vehiclesWhereUniqueInput
    update?: XOR<XOR<vehiclesUpdateToOneWithWhereWithoutTripsInput, vehiclesUpdateWithoutTripsInput>, vehiclesUncheckedUpdateWithoutTripsInput>
  }

  export type reportsCreateNestedManyWithoutUsersInput = {
    create?: XOR<reportsCreateWithoutUsersInput, reportsUncheckedCreateWithoutUsersInput> | reportsCreateWithoutUsersInput[] | reportsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: reportsCreateOrConnectWithoutUsersInput | reportsCreateOrConnectWithoutUsersInput[]
    createMany?: reportsCreateManyUsersInputEnvelope
    connect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
  }

  export type requestsCreateNestedManyWithoutUsers_requests_requester_idTousersInput = {
    create?: XOR<requestsCreateWithoutUsers_requests_requester_idTousersInput, requestsUncheckedCreateWithoutUsers_requests_requester_idTousersInput> | requestsCreateWithoutUsers_requests_requester_idTousersInput[] | requestsUncheckedCreateWithoutUsers_requests_requester_idTousersInput[]
    connectOrCreate?: requestsCreateOrConnectWithoutUsers_requests_requester_idTousersInput | requestsCreateOrConnectWithoutUsers_requests_requester_idTousersInput[]
    createMany?: requestsCreateManyUsers_requests_requester_idTousersInputEnvelope
    connect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
  }

  export type requestsCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput = {
    create?: XOR<requestsCreateWithoutUsers_requests_reviewed_byTousersInput, requestsUncheckedCreateWithoutUsers_requests_reviewed_byTousersInput> | requestsCreateWithoutUsers_requests_reviewed_byTousersInput[] | requestsUncheckedCreateWithoutUsers_requests_reviewed_byTousersInput[]
    connectOrCreate?: requestsCreateOrConnectWithoutUsers_requests_reviewed_byTousersInput | requestsCreateOrConnectWithoutUsers_requests_reviewed_byTousersInput[]
    createMany?: requestsCreateManyUsers_requests_reviewed_byTousersInputEnvelope
    connect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
  }

  export type sessionsCreateNestedManyWithoutUsersInput = {
    create?: XOR<sessionsCreateWithoutUsersInput, sessionsUncheckedCreateWithoutUsersInput> | sessionsCreateWithoutUsersInput[] | sessionsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: sessionsCreateOrConnectWithoutUsersInput | sessionsCreateOrConnectWithoutUsersInput[]
    createMany?: sessionsCreateManyUsersInputEnvelope
    connect?: sessionsWhereUniqueInput | sessionsWhereUniqueInput[]
  }

  export type tripsCreateNestedManyWithoutUsersInput = {
    create?: XOR<tripsCreateWithoutUsersInput, tripsUncheckedCreateWithoutUsersInput> | tripsCreateWithoutUsersInput[] | tripsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: tripsCreateOrConnectWithoutUsersInput | tripsCreateOrConnectWithoutUsersInput[]
    createMany?: tripsCreateManyUsersInputEnvelope
    connect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
  }

  export type organizationsCreateNestedOneWithoutUsersInput = {
    create?: XOR<organizationsCreateWithoutUsersInput, organizationsUncheckedCreateWithoutUsersInput>
    connectOrCreate?: organizationsCreateOrConnectWithoutUsersInput
    connect?: organizationsWhereUniqueInput
  }

  export type rolesCreateNestedOneWithoutUsersInput = {
    create?: XOR<rolesCreateWithoutUsersInput, rolesUncheckedCreateWithoutUsersInput>
    connectOrCreate?: rolesCreateOrConnectWithoutUsersInput
    connect?: rolesWhereUniqueInput
  }

  export type reportsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<reportsCreateWithoutUsersInput, reportsUncheckedCreateWithoutUsersInput> | reportsCreateWithoutUsersInput[] | reportsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: reportsCreateOrConnectWithoutUsersInput | reportsCreateOrConnectWithoutUsersInput[]
    createMany?: reportsCreateManyUsersInputEnvelope
    connect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
  }

  export type requestsUncheckedCreateNestedManyWithoutUsers_requests_requester_idTousersInput = {
    create?: XOR<requestsCreateWithoutUsers_requests_requester_idTousersInput, requestsUncheckedCreateWithoutUsers_requests_requester_idTousersInput> | requestsCreateWithoutUsers_requests_requester_idTousersInput[] | requestsUncheckedCreateWithoutUsers_requests_requester_idTousersInput[]
    connectOrCreate?: requestsCreateOrConnectWithoutUsers_requests_requester_idTousersInput | requestsCreateOrConnectWithoutUsers_requests_requester_idTousersInput[]
    createMany?: requestsCreateManyUsers_requests_requester_idTousersInputEnvelope
    connect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
  }

  export type requestsUncheckedCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput = {
    create?: XOR<requestsCreateWithoutUsers_requests_reviewed_byTousersInput, requestsUncheckedCreateWithoutUsers_requests_reviewed_byTousersInput> | requestsCreateWithoutUsers_requests_reviewed_byTousersInput[] | requestsUncheckedCreateWithoutUsers_requests_reviewed_byTousersInput[]
    connectOrCreate?: requestsCreateOrConnectWithoutUsers_requests_reviewed_byTousersInput | requestsCreateOrConnectWithoutUsers_requests_reviewed_byTousersInput[]
    createMany?: requestsCreateManyUsers_requests_reviewed_byTousersInputEnvelope
    connect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
  }

  export type sessionsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<sessionsCreateWithoutUsersInput, sessionsUncheckedCreateWithoutUsersInput> | sessionsCreateWithoutUsersInput[] | sessionsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: sessionsCreateOrConnectWithoutUsersInput | sessionsCreateOrConnectWithoutUsersInput[]
    createMany?: sessionsCreateManyUsersInputEnvelope
    connect?: sessionsWhereUniqueInput | sessionsWhereUniqueInput[]
  }

  export type tripsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<tripsCreateWithoutUsersInput, tripsUncheckedCreateWithoutUsersInput> | tripsCreateWithoutUsersInput[] | tripsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: tripsCreateOrConnectWithoutUsersInput | tripsCreateOrConnectWithoutUsersInput[]
    createMany?: tripsCreateManyUsersInputEnvelope
    connect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
  }

  export type reportsUpdateManyWithoutUsersNestedInput = {
    create?: XOR<reportsCreateWithoutUsersInput, reportsUncheckedCreateWithoutUsersInput> | reportsCreateWithoutUsersInput[] | reportsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: reportsCreateOrConnectWithoutUsersInput | reportsCreateOrConnectWithoutUsersInput[]
    upsert?: reportsUpsertWithWhereUniqueWithoutUsersInput | reportsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: reportsCreateManyUsersInputEnvelope
    set?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    disconnect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    delete?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    connect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    update?: reportsUpdateWithWhereUniqueWithoutUsersInput | reportsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: reportsUpdateManyWithWhereWithoutUsersInput | reportsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: reportsScalarWhereInput | reportsScalarWhereInput[]
  }

  export type requestsUpdateManyWithoutUsers_requests_requester_idTousersNestedInput = {
    create?: XOR<requestsCreateWithoutUsers_requests_requester_idTousersInput, requestsUncheckedCreateWithoutUsers_requests_requester_idTousersInput> | requestsCreateWithoutUsers_requests_requester_idTousersInput[] | requestsUncheckedCreateWithoutUsers_requests_requester_idTousersInput[]
    connectOrCreate?: requestsCreateOrConnectWithoutUsers_requests_requester_idTousersInput | requestsCreateOrConnectWithoutUsers_requests_requester_idTousersInput[]
    upsert?: requestsUpsertWithWhereUniqueWithoutUsers_requests_requester_idTousersInput | requestsUpsertWithWhereUniqueWithoutUsers_requests_requester_idTousersInput[]
    createMany?: requestsCreateManyUsers_requests_requester_idTousersInputEnvelope
    set?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    disconnect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    delete?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    connect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    update?: requestsUpdateWithWhereUniqueWithoutUsers_requests_requester_idTousersInput | requestsUpdateWithWhereUniqueWithoutUsers_requests_requester_idTousersInput[]
    updateMany?: requestsUpdateManyWithWhereWithoutUsers_requests_requester_idTousersInput | requestsUpdateManyWithWhereWithoutUsers_requests_requester_idTousersInput[]
    deleteMany?: requestsScalarWhereInput | requestsScalarWhereInput[]
  }

  export type requestsUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput = {
    create?: XOR<requestsCreateWithoutUsers_requests_reviewed_byTousersInput, requestsUncheckedCreateWithoutUsers_requests_reviewed_byTousersInput> | requestsCreateWithoutUsers_requests_reviewed_byTousersInput[] | requestsUncheckedCreateWithoutUsers_requests_reviewed_byTousersInput[]
    connectOrCreate?: requestsCreateOrConnectWithoutUsers_requests_reviewed_byTousersInput | requestsCreateOrConnectWithoutUsers_requests_reviewed_byTousersInput[]
    upsert?: requestsUpsertWithWhereUniqueWithoutUsers_requests_reviewed_byTousersInput | requestsUpsertWithWhereUniqueWithoutUsers_requests_reviewed_byTousersInput[]
    createMany?: requestsCreateManyUsers_requests_reviewed_byTousersInputEnvelope
    set?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    disconnect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    delete?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    connect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    update?: requestsUpdateWithWhereUniqueWithoutUsers_requests_reviewed_byTousersInput | requestsUpdateWithWhereUniqueWithoutUsers_requests_reviewed_byTousersInput[]
    updateMany?: requestsUpdateManyWithWhereWithoutUsers_requests_reviewed_byTousersInput | requestsUpdateManyWithWhereWithoutUsers_requests_reviewed_byTousersInput[]
    deleteMany?: requestsScalarWhereInput | requestsScalarWhereInput[]
  }

  export type sessionsUpdateManyWithoutUsersNestedInput = {
    create?: XOR<sessionsCreateWithoutUsersInput, sessionsUncheckedCreateWithoutUsersInput> | sessionsCreateWithoutUsersInput[] | sessionsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: sessionsCreateOrConnectWithoutUsersInput | sessionsCreateOrConnectWithoutUsersInput[]
    upsert?: sessionsUpsertWithWhereUniqueWithoutUsersInput | sessionsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: sessionsCreateManyUsersInputEnvelope
    set?: sessionsWhereUniqueInput | sessionsWhereUniqueInput[]
    disconnect?: sessionsWhereUniqueInput | sessionsWhereUniqueInput[]
    delete?: sessionsWhereUniqueInput | sessionsWhereUniqueInput[]
    connect?: sessionsWhereUniqueInput | sessionsWhereUniqueInput[]
    update?: sessionsUpdateWithWhereUniqueWithoutUsersInput | sessionsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: sessionsUpdateManyWithWhereWithoutUsersInput | sessionsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: sessionsScalarWhereInput | sessionsScalarWhereInput[]
  }

  export type tripsUpdateManyWithoutUsersNestedInput = {
    create?: XOR<tripsCreateWithoutUsersInput, tripsUncheckedCreateWithoutUsersInput> | tripsCreateWithoutUsersInput[] | tripsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: tripsCreateOrConnectWithoutUsersInput | tripsCreateOrConnectWithoutUsersInput[]
    upsert?: tripsUpsertWithWhereUniqueWithoutUsersInput | tripsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: tripsCreateManyUsersInputEnvelope
    set?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    disconnect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    delete?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    connect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    update?: tripsUpdateWithWhereUniqueWithoutUsersInput | tripsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: tripsUpdateManyWithWhereWithoutUsersInput | tripsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: tripsScalarWhereInput | tripsScalarWhereInput[]
  }

  export type organizationsUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<organizationsCreateWithoutUsersInput, organizationsUncheckedCreateWithoutUsersInput>
    connectOrCreate?: organizationsCreateOrConnectWithoutUsersInput
    upsert?: organizationsUpsertWithoutUsersInput
    connect?: organizationsWhereUniqueInput
    update?: XOR<XOR<organizationsUpdateToOneWithWhereWithoutUsersInput, organizationsUpdateWithoutUsersInput>, organizationsUncheckedUpdateWithoutUsersInput>
  }

  export type rolesUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<rolesCreateWithoutUsersInput, rolesUncheckedCreateWithoutUsersInput>
    connectOrCreate?: rolesCreateOrConnectWithoutUsersInput
    upsert?: rolesUpsertWithoutUsersInput
    connect?: rolesWhereUniqueInput
    update?: XOR<XOR<rolesUpdateToOneWithWhereWithoutUsersInput, rolesUpdateWithoutUsersInput>, rolesUncheckedUpdateWithoutUsersInput>
  }

  export type reportsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<reportsCreateWithoutUsersInput, reportsUncheckedCreateWithoutUsersInput> | reportsCreateWithoutUsersInput[] | reportsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: reportsCreateOrConnectWithoutUsersInput | reportsCreateOrConnectWithoutUsersInput[]
    upsert?: reportsUpsertWithWhereUniqueWithoutUsersInput | reportsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: reportsCreateManyUsersInputEnvelope
    set?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    disconnect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    delete?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    connect?: reportsWhereUniqueInput | reportsWhereUniqueInput[]
    update?: reportsUpdateWithWhereUniqueWithoutUsersInput | reportsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: reportsUpdateManyWithWhereWithoutUsersInput | reportsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: reportsScalarWhereInput | reportsScalarWhereInput[]
  }

  export type requestsUncheckedUpdateManyWithoutUsers_requests_requester_idTousersNestedInput = {
    create?: XOR<requestsCreateWithoutUsers_requests_requester_idTousersInput, requestsUncheckedCreateWithoutUsers_requests_requester_idTousersInput> | requestsCreateWithoutUsers_requests_requester_idTousersInput[] | requestsUncheckedCreateWithoutUsers_requests_requester_idTousersInput[]
    connectOrCreate?: requestsCreateOrConnectWithoutUsers_requests_requester_idTousersInput | requestsCreateOrConnectWithoutUsers_requests_requester_idTousersInput[]
    upsert?: requestsUpsertWithWhereUniqueWithoutUsers_requests_requester_idTousersInput | requestsUpsertWithWhereUniqueWithoutUsers_requests_requester_idTousersInput[]
    createMany?: requestsCreateManyUsers_requests_requester_idTousersInputEnvelope
    set?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    disconnect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    delete?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    connect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    update?: requestsUpdateWithWhereUniqueWithoutUsers_requests_requester_idTousersInput | requestsUpdateWithWhereUniqueWithoutUsers_requests_requester_idTousersInput[]
    updateMany?: requestsUpdateManyWithWhereWithoutUsers_requests_requester_idTousersInput | requestsUpdateManyWithWhereWithoutUsers_requests_requester_idTousersInput[]
    deleteMany?: requestsScalarWhereInput | requestsScalarWhereInput[]
  }

  export type requestsUncheckedUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput = {
    create?: XOR<requestsCreateWithoutUsers_requests_reviewed_byTousersInput, requestsUncheckedCreateWithoutUsers_requests_reviewed_byTousersInput> | requestsCreateWithoutUsers_requests_reviewed_byTousersInput[] | requestsUncheckedCreateWithoutUsers_requests_reviewed_byTousersInput[]
    connectOrCreate?: requestsCreateOrConnectWithoutUsers_requests_reviewed_byTousersInput | requestsCreateOrConnectWithoutUsers_requests_reviewed_byTousersInput[]
    upsert?: requestsUpsertWithWhereUniqueWithoutUsers_requests_reviewed_byTousersInput | requestsUpsertWithWhereUniqueWithoutUsers_requests_reviewed_byTousersInput[]
    createMany?: requestsCreateManyUsers_requests_reviewed_byTousersInputEnvelope
    set?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    disconnect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    delete?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    connect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    update?: requestsUpdateWithWhereUniqueWithoutUsers_requests_reviewed_byTousersInput | requestsUpdateWithWhereUniqueWithoutUsers_requests_reviewed_byTousersInput[]
    updateMany?: requestsUpdateManyWithWhereWithoutUsers_requests_reviewed_byTousersInput | requestsUpdateManyWithWhereWithoutUsers_requests_reviewed_byTousersInput[]
    deleteMany?: requestsScalarWhereInput | requestsScalarWhereInput[]
  }

  export type sessionsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<sessionsCreateWithoutUsersInput, sessionsUncheckedCreateWithoutUsersInput> | sessionsCreateWithoutUsersInput[] | sessionsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: sessionsCreateOrConnectWithoutUsersInput | sessionsCreateOrConnectWithoutUsersInput[]
    upsert?: sessionsUpsertWithWhereUniqueWithoutUsersInput | sessionsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: sessionsCreateManyUsersInputEnvelope
    set?: sessionsWhereUniqueInput | sessionsWhereUniqueInput[]
    disconnect?: sessionsWhereUniqueInput | sessionsWhereUniqueInput[]
    delete?: sessionsWhereUniqueInput | sessionsWhereUniqueInput[]
    connect?: sessionsWhereUniqueInput | sessionsWhereUniqueInput[]
    update?: sessionsUpdateWithWhereUniqueWithoutUsersInput | sessionsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: sessionsUpdateManyWithWhereWithoutUsersInput | sessionsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: sessionsScalarWhereInput | sessionsScalarWhereInput[]
  }

  export type tripsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<tripsCreateWithoutUsersInput, tripsUncheckedCreateWithoutUsersInput> | tripsCreateWithoutUsersInput[] | tripsUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: tripsCreateOrConnectWithoutUsersInput | tripsCreateOrConnectWithoutUsersInput[]
    upsert?: tripsUpsertWithWhereUniqueWithoutUsersInput | tripsUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: tripsCreateManyUsersInputEnvelope
    set?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    disconnect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    delete?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    connect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    update?: tripsUpdateWithWhereUniqueWithoutUsersInput | tripsUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: tripsUpdateManyWithWhereWithoutUsersInput | tripsUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: tripsScalarWhereInput | tripsScalarWhereInput[]
  }

  export type requestsCreateNestedManyWithoutVehiclesInput = {
    create?: XOR<requestsCreateWithoutVehiclesInput, requestsUncheckedCreateWithoutVehiclesInput> | requestsCreateWithoutVehiclesInput[] | requestsUncheckedCreateWithoutVehiclesInput[]
    connectOrCreate?: requestsCreateOrConnectWithoutVehiclesInput | requestsCreateOrConnectWithoutVehiclesInput[]
    createMany?: requestsCreateManyVehiclesInputEnvelope
    connect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
  }

  export type tripsCreateNestedManyWithoutVehiclesInput = {
    create?: XOR<tripsCreateWithoutVehiclesInput, tripsUncheckedCreateWithoutVehiclesInput> | tripsCreateWithoutVehiclesInput[] | tripsUncheckedCreateWithoutVehiclesInput[]
    connectOrCreate?: tripsCreateOrConnectWithoutVehiclesInput | tripsCreateOrConnectWithoutVehiclesInput[]
    createMany?: tripsCreateManyVehiclesInputEnvelope
    connect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
  }

  export type organizationsCreateNestedOneWithoutVehiclesInput = {
    create?: XOR<organizationsCreateWithoutVehiclesInput, organizationsUncheckedCreateWithoutVehiclesInput>
    connectOrCreate?: organizationsCreateOrConnectWithoutVehiclesInput
    connect?: organizationsWhereUniqueInput
  }

  export type requestsUncheckedCreateNestedManyWithoutVehiclesInput = {
    create?: XOR<requestsCreateWithoutVehiclesInput, requestsUncheckedCreateWithoutVehiclesInput> | requestsCreateWithoutVehiclesInput[] | requestsUncheckedCreateWithoutVehiclesInput[]
    connectOrCreate?: requestsCreateOrConnectWithoutVehiclesInput | requestsCreateOrConnectWithoutVehiclesInput[]
    createMany?: requestsCreateManyVehiclesInputEnvelope
    connect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
  }

  export type tripsUncheckedCreateNestedManyWithoutVehiclesInput = {
    create?: XOR<tripsCreateWithoutVehiclesInput, tripsUncheckedCreateWithoutVehiclesInput> | tripsCreateWithoutVehiclesInput[] | tripsUncheckedCreateWithoutVehiclesInput[]
    connectOrCreate?: tripsCreateOrConnectWithoutVehiclesInput | tripsCreateOrConnectWithoutVehiclesInput[]
    createMany?: tripsCreateManyVehiclesInputEnvelope
    connect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
  }

  export type requestsUpdateManyWithoutVehiclesNestedInput = {
    create?: XOR<requestsCreateWithoutVehiclesInput, requestsUncheckedCreateWithoutVehiclesInput> | requestsCreateWithoutVehiclesInput[] | requestsUncheckedCreateWithoutVehiclesInput[]
    connectOrCreate?: requestsCreateOrConnectWithoutVehiclesInput | requestsCreateOrConnectWithoutVehiclesInput[]
    upsert?: requestsUpsertWithWhereUniqueWithoutVehiclesInput | requestsUpsertWithWhereUniqueWithoutVehiclesInput[]
    createMany?: requestsCreateManyVehiclesInputEnvelope
    set?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    disconnect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    delete?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    connect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    update?: requestsUpdateWithWhereUniqueWithoutVehiclesInput | requestsUpdateWithWhereUniqueWithoutVehiclesInput[]
    updateMany?: requestsUpdateManyWithWhereWithoutVehiclesInput | requestsUpdateManyWithWhereWithoutVehiclesInput[]
    deleteMany?: requestsScalarWhereInput | requestsScalarWhereInput[]
  }

  export type tripsUpdateManyWithoutVehiclesNestedInput = {
    create?: XOR<tripsCreateWithoutVehiclesInput, tripsUncheckedCreateWithoutVehiclesInput> | tripsCreateWithoutVehiclesInput[] | tripsUncheckedCreateWithoutVehiclesInput[]
    connectOrCreate?: tripsCreateOrConnectWithoutVehiclesInput | tripsCreateOrConnectWithoutVehiclesInput[]
    upsert?: tripsUpsertWithWhereUniqueWithoutVehiclesInput | tripsUpsertWithWhereUniqueWithoutVehiclesInput[]
    createMany?: tripsCreateManyVehiclesInputEnvelope
    set?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    disconnect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    delete?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    connect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    update?: tripsUpdateWithWhereUniqueWithoutVehiclesInput | tripsUpdateWithWhereUniqueWithoutVehiclesInput[]
    updateMany?: tripsUpdateManyWithWhereWithoutVehiclesInput | tripsUpdateManyWithWhereWithoutVehiclesInput[]
    deleteMany?: tripsScalarWhereInput | tripsScalarWhereInput[]
  }

  export type organizationsUpdateOneRequiredWithoutVehiclesNestedInput = {
    create?: XOR<organizationsCreateWithoutVehiclesInput, organizationsUncheckedCreateWithoutVehiclesInput>
    connectOrCreate?: organizationsCreateOrConnectWithoutVehiclesInput
    upsert?: organizationsUpsertWithoutVehiclesInput
    connect?: organizationsWhereUniqueInput
    update?: XOR<XOR<organizationsUpdateToOneWithWhereWithoutVehiclesInput, organizationsUpdateWithoutVehiclesInput>, organizationsUncheckedUpdateWithoutVehiclesInput>
  }

  export type requestsUncheckedUpdateManyWithoutVehiclesNestedInput = {
    create?: XOR<requestsCreateWithoutVehiclesInput, requestsUncheckedCreateWithoutVehiclesInput> | requestsCreateWithoutVehiclesInput[] | requestsUncheckedCreateWithoutVehiclesInput[]
    connectOrCreate?: requestsCreateOrConnectWithoutVehiclesInput | requestsCreateOrConnectWithoutVehiclesInput[]
    upsert?: requestsUpsertWithWhereUniqueWithoutVehiclesInput | requestsUpsertWithWhereUniqueWithoutVehiclesInput[]
    createMany?: requestsCreateManyVehiclesInputEnvelope
    set?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    disconnect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    delete?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    connect?: requestsWhereUniqueInput | requestsWhereUniqueInput[]
    update?: requestsUpdateWithWhereUniqueWithoutVehiclesInput | requestsUpdateWithWhereUniqueWithoutVehiclesInput[]
    updateMany?: requestsUpdateManyWithWhereWithoutVehiclesInput | requestsUpdateManyWithWhereWithoutVehiclesInput[]
    deleteMany?: requestsScalarWhereInput | requestsScalarWhereInput[]
  }

  export type tripsUncheckedUpdateManyWithoutVehiclesNestedInput = {
    create?: XOR<tripsCreateWithoutVehiclesInput, tripsUncheckedCreateWithoutVehiclesInput> | tripsCreateWithoutVehiclesInput[] | tripsUncheckedCreateWithoutVehiclesInput[]
    connectOrCreate?: tripsCreateOrConnectWithoutVehiclesInput | tripsCreateOrConnectWithoutVehiclesInput[]
    upsert?: tripsUpsertWithWhereUniqueWithoutVehiclesInput | tripsUpsertWithWhereUniqueWithoutVehiclesInput[]
    createMany?: tripsCreateManyVehiclesInputEnvelope
    set?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    disconnect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    delete?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    connect?: tripsWhereUniqueInput | tripsWhereUniqueInput[]
    update?: tripsUpdateWithWhereUniqueWithoutVehiclesInput | tripsUpdateWithWhereUniqueWithoutVehiclesInput[]
    updateMany?: tripsUpdateManyWithWhereWithoutVehiclesInput | tripsUpdateManyWithWhereWithoutVehiclesInput[]
    deleteMany?: tripsScalarWhereInput | tripsScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type reportsCreateWithoutOrganizationsInput = {
    id: string
    report_type: string
    generated_at?: Date | string
    file_url?: string | null
    description?: string | null
    users: usersCreateNestedOneWithoutReportsInput
  }

  export type reportsUncheckedCreateWithoutOrganizationsInput = {
    id: string
    generated_by: string
    report_type: string
    generated_at?: Date | string
    file_url?: string | null
    description?: string | null
  }

  export type reportsCreateOrConnectWithoutOrganizationsInput = {
    where: reportsWhereUniqueInput
    create: XOR<reportsCreateWithoutOrganizationsInput, reportsUncheckedCreateWithoutOrganizationsInput>
  }

  export type reportsCreateManyOrganizationsInputEnvelope = {
    data: reportsCreateManyOrganizationsInput | reportsCreateManyOrganizationsInput[]
    skipDuplicates?: boolean
  }

  export type usersCreateWithoutOrganizationsInput = {
    id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    reports?: reportsCreateNestedManyWithoutUsersInput
    requests_requests_requester_idTousers?: requestsCreateNestedManyWithoutUsers_requests_requester_idTousersInput
    requests_requests_reviewed_byTousers?: requestsCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput
    sessions?: sessionsCreateNestedManyWithoutUsersInput
    trips?: tripsCreateNestedManyWithoutUsersInput
    roles: rolesCreateNestedOneWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutOrganizationsInput = {
    id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    role_id: string
    reports?: reportsUncheckedCreateNestedManyWithoutUsersInput
    requests_requests_requester_idTousers?: requestsUncheckedCreateNestedManyWithoutUsers_requests_requester_idTousersInput
    requests_requests_reviewed_byTousers?: requestsUncheckedCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput
    sessions?: sessionsUncheckedCreateNestedManyWithoutUsersInput
    trips?: tripsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutOrganizationsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutOrganizationsInput, usersUncheckedCreateWithoutOrganizationsInput>
  }

  export type usersCreateManyOrganizationsInputEnvelope = {
    data: usersCreateManyOrganizationsInput | usersCreateManyOrganizationsInput[]
    skipDuplicates?: boolean
  }

  export type vehiclesCreateWithoutOrganizationsInput = {
    id: string
    plate_number: string
    model: string
    manufacturer: string
    year: number
    capacity?: number | null
    odometer?: number
    status?: string
    fuel_type?: string | null
    last_service_date?: Date | string | null
    created_at?: Date | string
    requests?: requestsCreateNestedManyWithoutVehiclesInput
    trips?: tripsCreateNestedManyWithoutVehiclesInput
  }

  export type vehiclesUncheckedCreateWithoutOrganizationsInput = {
    id: string
    plate_number: string
    model: string
    manufacturer: string
    year: number
    capacity?: number | null
    odometer?: number
    status?: string
    fuel_type?: string | null
    last_service_date?: Date | string | null
    created_at?: Date | string
    requests?: requestsUncheckedCreateNestedManyWithoutVehiclesInput
    trips?: tripsUncheckedCreateNestedManyWithoutVehiclesInput
  }

  export type vehiclesCreateOrConnectWithoutOrganizationsInput = {
    where: vehiclesWhereUniqueInput
    create: XOR<vehiclesCreateWithoutOrganizationsInput, vehiclesUncheckedCreateWithoutOrganizationsInput>
  }

  export type vehiclesCreateManyOrganizationsInputEnvelope = {
    data: vehiclesCreateManyOrganizationsInput | vehiclesCreateManyOrganizationsInput[]
    skipDuplicates?: boolean
  }

  export type reportsUpsertWithWhereUniqueWithoutOrganizationsInput = {
    where: reportsWhereUniqueInput
    update: XOR<reportsUpdateWithoutOrganizationsInput, reportsUncheckedUpdateWithoutOrganizationsInput>
    create: XOR<reportsCreateWithoutOrganizationsInput, reportsUncheckedCreateWithoutOrganizationsInput>
  }

  export type reportsUpdateWithWhereUniqueWithoutOrganizationsInput = {
    where: reportsWhereUniqueInput
    data: XOR<reportsUpdateWithoutOrganizationsInput, reportsUncheckedUpdateWithoutOrganizationsInput>
  }

  export type reportsUpdateManyWithWhereWithoutOrganizationsInput = {
    where: reportsScalarWhereInput
    data: XOR<reportsUpdateManyMutationInput, reportsUncheckedUpdateManyWithoutOrganizationsInput>
  }

  export type reportsScalarWhereInput = {
    AND?: reportsScalarWhereInput | reportsScalarWhereInput[]
    OR?: reportsScalarWhereInput[]
    NOT?: reportsScalarWhereInput | reportsScalarWhereInput[]
    id?: StringFilter<"reports"> | string
    generated_by?: StringFilter<"reports"> | string
    organization_id?: StringFilter<"reports"> | string
    report_type?: StringFilter<"reports"> | string
    generated_at?: DateTimeFilter<"reports"> | Date | string
    file_url?: StringNullableFilter<"reports"> | string | null
    description?: StringNullableFilter<"reports"> | string | null
  }

  export type usersUpsertWithWhereUniqueWithoutOrganizationsInput = {
    where: usersWhereUniqueInput
    update: XOR<usersUpdateWithoutOrganizationsInput, usersUncheckedUpdateWithoutOrganizationsInput>
    create: XOR<usersCreateWithoutOrganizationsInput, usersUncheckedCreateWithoutOrganizationsInput>
  }

  export type usersUpdateWithWhereUniqueWithoutOrganizationsInput = {
    where: usersWhereUniqueInput
    data: XOR<usersUpdateWithoutOrganizationsInput, usersUncheckedUpdateWithoutOrganizationsInput>
  }

  export type usersUpdateManyWithWhereWithoutOrganizationsInput = {
    where: usersScalarWhereInput
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyWithoutOrganizationsInput>
  }

  export type usersScalarWhereInput = {
    AND?: usersScalarWhereInput | usersScalarWhereInput[]
    OR?: usersScalarWhereInput[]
    NOT?: usersScalarWhereInput | usersScalarWhereInput[]
    id?: StringFilter<"users"> | string
    organization_id?: StringFilter<"users"> | string
    username?: StringFilter<"users"> | string
    password_hash?: StringFilter<"users"> | string
    email?: StringFilter<"users"> | string
    full_name?: StringFilter<"users"> | string
    phone?: StringNullableFilter<"users"> | string | null
    status?: StringFilter<"users"> | string
    created_at?: DateTimeFilter<"users"> | Date | string
    last_login?: DateTimeNullableFilter<"users"> | Date | string | null
    role_id?: StringFilter<"users"> | string
  }

  export type vehiclesUpsertWithWhereUniqueWithoutOrganizationsInput = {
    where: vehiclesWhereUniqueInput
    update: XOR<vehiclesUpdateWithoutOrganizationsInput, vehiclesUncheckedUpdateWithoutOrganizationsInput>
    create: XOR<vehiclesCreateWithoutOrganizationsInput, vehiclesUncheckedCreateWithoutOrganizationsInput>
  }

  export type vehiclesUpdateWithWhereUniqueWithoutOrganizationsInput = {
    where: vehiclesWhereUniqueInput
    data: XOR<vehiclesUpdateWithoutOrganizationsInput, vehiclesUncheckedUpdateWithoutOrganizationsInput>
  }

  export type vehiclesUpdateManyWithWhereWithoutOrganizationsInput = {
    where: vehiclesScalarWhereInput
    data: XOR<vehiclesUpdateManyMutationInput, vehiclesUncheckedUpdateManyWithoutOrganizationsInput>
  }

  export type vehiclesScalarWhereInput = {
    AND?: vehiclesScalarWhereInput | vehiclesScalarWhereInput[]
    OR?: vehiclesScalarWhereInput[]
    NOT?: vehiclesScalarWhereInput | vehiclesScalarWhereInput[]
    id?: StringFilter<"vehicles"> | string
    plate_number?: StringFilter<"vehicles"> | string
    model?: StringFilter<"vehicles"> | string
    manufacturer?: StringFilter<"vehicles"> | string
    year?: IntFilter<"vehicles"> | number
    capacity?: IntNullableFilter<"vehicles"> | number | null
    odometer?: IntFilter<"vehicles"> | number
    status?: StringFilter<"vehicles"> | string
    fuel_type?: StringNullableFilter<"vehicles"> | string | null
    last_service_date?: DateTimeNullableFilter<"vehicles"> | Date | string | null
    created_at?: DateTimeFilter<"vehicles"> | Date | string
    organization_id?: StringFilter<"vehicles"> | string
  }

  export type role_permissionsCreateWithoutPermissionsInput = {
    id: string
    roles: rolesCreateNestedOneWithoutRole_permissionsInput
  }

  export type role_permissionsUncheckedCreateWithoutPermissionsInput = {
    id: string
    role_id: string
  }

  export type role_permissionsCreateOrConnectWithoutPermissionsInput = {
    where: role_permissionsWhereUniqueInput
    create: XOR<role_permissionsCreateWithoutPermissionsInput, role_permissionsUncheckedCreateWithoutPermissionsInput>
  }

  export type role_permissionsCreateManyPermissionsInputEnvelope = {
    data: role_permissionsCreateManyPermissionsInput | role_permissionsCreateManyPermissionsInput[]
    skipDuplicates?: boolean
  }

  export type role_permissionsUpsertWithWhereUniqueWithoutPermissionsInput = {
    where: role_permissionsWhereUniqueInput
    update: XOR<role_permissionsUpdateWithoutPermissionsInput, role_permissionsUncheckedUpdateWithoutPermissionsInput>
    create: XOR<role_permissionsCreateWithoutPermissionsInput, role_permissionsUncheckedCreateWithoutPermissionsInput>
  }

  export type role_permissionsUpdateWithWhereUniqueWithoutPermissionsInput = {
    where: role_permissionsWhereUniqueInput
    data: XOR<role_permissionsUpdateWithoutPermissionsInput, role_permissionsUncheckedUpdateWithoutPermissionsInput>
  }

  export type role_permissionsUpdateManyWithWhereWithoutPermissionsInput = {
    where: role_permissionsScalarWhereInput
    data: XOR<role_permissionsUpdateManyMutationInput, role_permissionsUncheckedUpdateManyWithoutPermissionsInput>
  }

  export type role_permissionsScalarWhereInput = {
    AND?: role_permissionsScalarWhereInput | role_permissionsScalarWhereInput[]
    OR?: role_permissionsScalarWhereInput[]
    NOT?: role_permissionsScalarWhereInput | role_permissionsScalarWhereInput[]
    id?: StringFilter<"role_permissions"> | string
    role_id?: StringFilter<"role_permissions"> | string
    permission_id?: StringFilter<"role_permissions"> | string
  }

  export type usersCreateWithoutReportsInput = {
    id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    requests_requests_requester_idTousers?: requestsCreateNestedManyWithoutUsers_requests_requester_idTousersInput
    requests_requests_reviewed_byTousers?: requestsCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput
    sessions?: sessionsCreateNestedManyWithoutUsersInput
    trips?: tripsCreateNestedManyWithoutUsersInput
    organizations: organizationsCreateNestedOneWithoutUsersInput
    roles: rolesCreateNestedOneWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutReportsInput = {
    id: string
    organization_id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    role_id: string
    requests_requests_requester_idTousers?: requestsUncheckedCreateNestedManyWithoutUsers_requests_requester_idTousersInput
    requests_requests_reviewed_byTousers?: requestsUncheckedCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput
    sessions?: sessionsUncheckedCreateNestedManyWithoutUsersInput
    trips?: tripsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutReportsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutReportsInput, usersUncheckedCreateWithoutReportsInput>
  }

  export type organizationsCreateWithoutReportsInput = {
    id: string
    name: string
    address: string
    phone: string
    email: string
    created_at?: Date | string
    users?: usersCreateNestedManyWithoutOrganizationsInput
    vehicles?: vehiclesCreateNestedManyWithoutOrganizationsInput
  }

  export type organizationsUncheckedCreateWithoutReportsInput = {
    id: string
    name: string
    address: string
    phone: string
    email: string
    created_at?: Date | string
    users?: usersUncheckedCreateNestedManyWithoutOrganizationsInput
    vehicles?: vehiclesUncheckedCreateNestedManyWithoutOrganizationsInput
  }

  export type organizationsCreateOrConnectWithoutReportsInput = {
    where: organizationsWhereUniqueInput
    create: XOR<organizationsCreateWithoutReportsInput, organizationsUncheckedCreateWithoutReportsInput>
  }

  export type usersUpsertWithoutReportsInput = {
    update: XOR<usersUpdateWithoutReportsInput, usersUncheckedUpdateWithoutReportsInput>
    create: XOR<usersCreateWithoutReportsInput, usersUncheckedCreateWithoutReportsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutReportsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutReportsInput, usersUncheckedUpdateWithoutReportsInput>
  }

  export type usersUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    requests_requests_requester_idTousers?: requestsUpdateManyWithoutUsers_requests_requester_idTousersNestedInput
    requests_requests_reviewed_byTousers?: requestsUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput
    sessions?: sessionsUpdateManyWithoutUsersNestedInput
    trips?: tripsUpdateManyWithoutUsersNestedInput
    organizations?: organizationsUpdateOneRequiredWithoutUsersNestedInput
    roles?: rolesUpdateOneRequiredWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    organization_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role_id?: StringFieldUpdateOperationsInput | string
    requests_requests_requester_idTousers?: requestsUncheckedUpdateManyWithoutUsers_requests_requester_idTousersNestedInput
    requests_requests_reviewed_byTousers?: requestsUncheckedUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput
    sessions?: sessionsUncheckedUpdateManyWithoutUsersNestedInput
    trips?: tripsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type organizationsUpsertWithoutReportsInput = {
    update: XOR<organizationsUpdateWithoutReportsInput, organizationsUncheckedUpdateWithoutReportsInput>
    create: XOR<organizationsCreateWithoutReportsInput, organizationsUncheckedCreateWithoutReportsInput>
    where?: organizationsWhereInput
  }

  export type organizationsUpdateToOneWithWhereWithoutReportsInput = {
    where?: organizationsWhereInput
    data: XOR<organizationsUpdateWithoutReportsInput, organizationsUncheckedUpdateWithoutReportsInput>
  }

  export type organizationsUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: usersUpdateManyWithoutOrganizationsNestedInput
    vehicles?: vehiclesUpdateManyWithoutOrganizationsNestedInput
  }

  export type organizationsUncheckedUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: usersUncheckedUpdateManyWithoutOrganizationsNestedInput
    vehicles?: vehiclesUncheckedUpdateManyWithoutOrganizationsNestedInput
  }

  export type usersCreateWithoutRequests_requests_requester_idTousersInput = {
    id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    reports?: reportsCreateNestedManyWithoutUsersInput
    requests_requests_reviewed_byTousers?: requestsCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput
    sessions?: sessionsCreateNestedManyWithoutUsersInput
    trips?: tripsCreateNestedManyWithoutUsersInput
    organizations: organizationsCreateNestedOneWithoutUsersInput
    roles: rolesCreateNestedOneWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutRequests_requests_requester_idTousersInput = {
    id: string
    organization_id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    role_id: string
    reports?: reportsUncheckedCreateNestedManyWithoutUsersInput
    requests_requests_reviewed_byTousers?: requestsUncheckedCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput
    sessions?: sessionsUncheckedCreateNestedManyWithoutUsersInput
    trips?: tripsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutRequests_requests_requester_idTousersInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutRequests_requests_requester_idTousersInput, usersUncheckedCreateWithoutRequests_requests_requester_idTousersInput>
  }

  export type usersCreateWithoutRequests_requests_reviewed_byTousersInput = {
    id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    reports?: reportsCreateNestedManyWithoutUsersInput
    requests_requests_requester_idTousers?: requestsCreateNestedManyWithoutUsers_requests_requester_idTousersInput
    sessions?: sessionsCreateNestedManyWithoutUsersInput
    trips?: tripsCreateNestedManyWithoutUsersInput
    organizations: organizationsCreateNestedOneWithoutUsersInput
    roles: rolesCreateNestedOneWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutRequests_requests_reviewed_byTousersInput = {
    id: string
    organization_id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    role_id: string
    reports?: reportsUncheckedCreateNestedManyWithoutUsersInput
    requests_requests_requester_idTousers?: requestsUncheckedCreateNestedManyWithoutUsers_requests_requester_idTousersInput
    sessions?: sessionsUncheckedCreateNestedManyWithoutUsersInput
    trips?: tripsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutRequests_requests_reviewed_byTousersInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutRequests_requests_reviewed_byTousersInput, usersUncheckedCreateWithoutRequests_requests_reviewed_byTousersInput>
  }

  export type vehiclesCreateWithoutRequestsInput = {
    id: string
    plate_number: string
    model: string
    manufacturer: string
    year: number
    capacity?: number | null
    odometer?: number
    status?: string
    fuel_type?: string | null
    last_service_date?: Date | string | null
    created_at?: Date | string
    trips?: tripsCreateNestedManyWithoutVehiclesInput
    organizations: organizationsCreateNestedOneWithoutVehiclesInput
  }

  export type vehiclesUncheckedCreateWithoutRequestsInput = {
    id: string
    plate_number: string
    model: string
    manufacturer: string
    year: number
    capacity?: number | null
    odometer?: number
    status?: string
    fuel_type?: string | null
    last_service_date?: Date | string | null
    created_at?: Date | string
    organization_id: string
    trips?: tripsUncheckedCreateNestedManyWithoutVehiclesInput
  }

  export type vehiclesCreateOrConnectWithoutRequestsInput = {
    where: vehiclesWhereUniqueInput
    create: XOR<vehiclesCreateWithoutRequestsInput, vehiclesUncheckedCreateWithoutRequestsInput>
  }

  export type tripsCreateWithoutRequestsInput = {
    id: string
    start_odometer: number
    end_odometer?: number | null
    start_time: Date | string
    end_time?: Date | string | null
    fuel_used?: number | null
    trip_notes?: string | null
    created_at?: Date | string
    users: usersCreateNestedOneWithoutTripsInput
    vehicles: vehiclesCreateNestedOneWithoutTripsInput
  }

  export type tripsUncheckedCreateWithoutRequestsInput = {
    id: string
    vehicle_id: string
    start_odometer: number
    end_odometer?: number | null
    start_time: Date | string
    end_time?: Date | string | null
    fuel_used?: number | null
    trip_notes?: string | null
    created_at?: Date | string
    driver_id: string
  }

  export type tripsCreateOrConnectWithoutRequestsInput = {
    where: tripsWhereUniqueInput
    create: XOR<tripsCreateWithoutRequestsInput, tripsUncheckedCreateWithoutRequestsInput>
  }

  export type tripsCreateManyRequestsInputEnvelope = {
    data: tripsCreateManyRequestsInput | tripsCreateManyRequestsInput[]
    skipDuplicates?: boolean
  }

  export type usersUpsertWithoutRequests_requests_requester_idTousersInput = {
    update: XOR<usersUpdateWithoutRequests_requests_requester_idTousersInput, usersUncheckedUpdateWithoutRequests_requests_requester_idTousersInput>
    create: XOR<usersCreateWithoutRequests_requests_requester_idTousersInput, usersUncheckedCreateWithoutRequests_requests_requester_idTousersInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutRequests_requests_requester_idTousersInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutRequests_requests_requester_idTousersInput, usersUncheckedUpdateWithoutRequests_requests_requester_idTousersInput>
  }

  export type usersUpdateWithoutRequests_requests_requester_idTousersInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reports?: reportsUpdateManyWithoutUsersNestedInput
    requests_requests_reviewed_byTousers?: requestsUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput
    sessions?: sessionsUpdateManyWithoutUsersNestedInput
    trips?: tripsUpdateManyWithoutUsersNestedInput
    organizations?: organizationsUpdateOneRequiredWithoutUsersNestedInput
    roles?: rolesUpdateOneRequiredWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutRequests_requests_requester_idTousersInput = {
    id?: StringFieldUpdateOperationsInput | string
    organization_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role_id?: StringFieldUpdateOperationsInput | string
    reports?: reportsUncheckedUpdateManyWithoutUsersNestedInput
    requests_requests_reviewed_byTousers?: requestsUncheckedUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput
    sessions?: sessionsUncheckedUpdateManyWithoutUsersNestedInput
    trips?: tripsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersUpsertWithoutRequests_requests_reviewed_byTousersInput = {
    update: XOR<usersUpdateWithoutRequests_requests_reviewed_byTousersInput, usersUncheckedUpdateWithoutRequests_requests_reviewed_byTousersInput>
    create: XOR<usersCreateWithoutRequests_requests_reviewed_byTousersInput, usersUncheckedCreateWithoutRequests_requests_reviewed_byTousersInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutRequests_requests_reviewed_byTousersInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutRequests_requests_reviewed_byTousersInput, usersUncheckedUpdateWithoutRequests_requests_reviewed_byTousersInput>
  }

  export type usersUpdateWithoutRequests_requests_reviewed_byTousersInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reports?: reportsUpdateManyWithoutUsersNestedInput
    requests_requests_requester_idTousers?: requestsUpdateManyWithoutUsers_requests_requester_idTousersNestedInput
    sessions?: sessionsUpdateManyWithoutUsersNestedInput
    trips?: tripsUpdateManyWithoutUsersNestedInput
    organizations?: organizationsUpdateOneRequiredWithoutUsersNestedInput
    roles?: rolesUpdateOneRequiredWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutRequests_requests_reviewed_byTousersInput = {
    id?: StringFieldUpdateOperationsInput | string
    organization_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role_id?: StringFieldUpdateOperationsInput | string
    reports?: reportsUncheckedUpdateManyWithoutUsersNestedInput
    requests_requests_requester_idTousers?: requestsUncheckedUpdateManyWithoutUsers_requests_requester_idTousersNestedInput
    sessions?: sessionsUncheckedUpdateManyWithoutUsersNestedInput
    trips?: tripsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type vehiclesUpsertWithoutRequestsInput = {
    update: XOR<vehiclesUpdateWithoutRequestsInput, vehiclesUncheckedUpdateWithoutRequestsInput>
    create: XOR<vehiclesCreateWithoutRequestsInput, vehiclesUncheckedCreateWithoutRequestsInput>
    where?: vehiclesWhereInput
  }

  export type vehiclesUpdateToOneWithWhereWithoutRequestsInput = {
    where?: vehiclesWhereInput
    data: XOR<vehiclesUpdateWithoutRequestsInput, vehiclesUncheckedUpdateWithoutRequestsInput>
  }

  export type vehiclesUpdateWithoutRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    manufacturer?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    odometer?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    fuel_type?: NullableStringFieldUpdateOperationsInput | string | null
    last_service_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trips?: tripsUpdateManyWithoutVehiclesNestedInput
    organizations?: organizationsUpdateOneRequiredWithoutVehiclesNestedInput
  }

  export type vehiclesUncheckedUpdateWithoutRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    manufacturer?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    odometer?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    fuel_type?: NullableStringFieldUpdateOperationsInput | string | null
    last_service_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    organization_id?: StringFieldUpdateOperationsInput | string
    trips?: tripsUncheckedUpdateManyWithoutVehiclesNestedInput
  }

  export type tripsUpsertWithWhereUniqueWithoutRequestsInput = {
    where: tripsWhereUniqueInput
    update: XOR<tripsUpdateWithoutRequestsInput, tripsUncheckedUpdateWithoutRequestsInput>
    create: XOR<tripsCreateWithoutRequestsInput, tripsUncheckedCreateWithoutRequestsInput>
  }

  export type tripsUpdateWithWhereUniqueWithoutRequestsInput = {
    where: tripsWhereUniqueInput
    data: XOR<tripsUpdateWithoutRequestsInput, tripsUncheckedUpdateWithoutRequestsInput>
  }

  export type tripsUpdateManyWithWhereWithoutRequestsInput = {
    where: tripsScalarWhereInput
    data: XOR<tripsUpdateManyMutationInput, tripsUncheckedUpdateManyWithoutRequestsInput>
  }

  export type tripsScalarWhereInput = {
    AND?: tripsScalarWhereInput | tripsScalarWhereInput[]
    OR?: tripsScalarWhereInput[]
    NOT?: tripsScalarWhereInput | tripsScalarWhereInput[]
    id?: StringFilter<"trips"> | string
    request_id?: StringNullableFilter<"trips"> | string | null
    vehicle_id?: StringFilter<"trips"> | string
    start_odometer?: IntFilter<"trips"> | number
    end_odometer?: IntNullableFilter<"trips"> | number | null
    start_time?: DateTimeFilter<"trips"> | Date | string
    end_time?: DateTimeNullableFilter<"trips"> | Date | string | null
    fuel_used?: FloatNullableFilter<"trips"> | number | null
    trip_notes?: StringNullableFilter<"trips"> | string | null
    created_at?: DateTimeFilter<"trips"> | Date | string
    driver_id?: StringFilter<"trips"> | string
  }

  export type permissionsCreateWithoutRole_permissionsInput = {
    id: string
    name: string
    description?: string | null
  }

  export type permissionsUncheckedCreateWithoutRole_permissionsInput = {
    id: string
    name: string
    description?: string | null
  }

  export type permissionsCreateOrConnectWithoutRole_permissionsInput = {
    where: permissionsWhereUniqueInput
    create: XOR<permissionsCreateWithoutRole_permissionsInput, permissionsUncheckedCreateWithoutRole_permissionsInput>
  }

  export type rolesCreateWithoutRole_permissionsInput = {
    id: string
    name: string
    description?: string | null
    users?: usersCreateNestedManyWithoutRolesInput
  }

  export type rolesUncheckedCreateWithoutRole_permissionsInput = {
    id: string
    name: string
    description?: string | null
    users?: usersUncheckedCreateNestedManyWithoutRolesInput
  }

  export type rolesCreateOrConnectWithoutRole_permissionsInput = {
    where: rolesWhereUniqueInput
    create: XOR<rolesCreateWithoutRole_permissionsInput, rolesUncheckedCreateWithoutRole_permissionsInput>
  }

  export type permissionsUpsertWithoutRole_permissionsInput = {
    update: XOR<permissionsUpdateWithoutRole_permissionsInput, permissionsUncheckedUpdateWithoutRole_permissionsInput>
    create: XOR<permissionsCreateWithoutRole_permissionsInput, permissionsUncheckedCreateWithoutRole_permissionsInput>
    where?: permissionsWhereInput
  }

  export type permissionsUpdateToOneWithWhereWithoutRole_permissionsInput = {
    where?: permissionsWhereInput
    data: XOR<permissionsUpdateWithoutRole_permissionsInput, permissionsUncheckedUpdateWithoutRole_permissionsInput>
  }

  export type permissionsUpdateWithoutRole_permissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type permissionsUncheckedUpdateWithoutRole_permissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type rolesUpsertWithoutRole_permissionsInput = {
    update: XOR<rolesUpdateWithoutRole_permissionsInput, rolesUncheckedUpdateWithoutRole_permissionsInput>
    create: XOR<rolesCreateWithoutRole_permissionsInput, rolesUncheckedCreateWithoutRole_permissionsInput>
    where?: rolesWhereInput
  }

  export type rolesUpdateToOneWithWhereWithoutRole_permissionsInput = {
    where?: rolesWhereInput
    data: XOR<rolesUpdateWithoutRole_permissionsInput, rolesUncheckedUpdateWithoutRole_permissionsInput>
  }

  export type rolesUpdateWithoutRole_permissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    users?: usersUpdateManyWithoutRolesNestedInput
  }

  export type rolesUncheckedUpdateWithoutRole_permissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    users?: usersUncheckedUpdateManyWithoutRolesNestedInput
  }

  export type role_permissionsCreateWithoutRolesInput = {
    id: string
    permissions: permissionsCreateNestedOneWithoutRole_permissionsInput
  }

  export type role_permissionsUncheckedCreateWithoutRolesInput = {
    id: string
    permission_id: string
  }

  export type role_permissionsCreateOrConnectWithoutRolesInput = {
    where: role_permissionsWhereUniqueInput
    create: XOR<role_permissionsCreateWithoutRolesInput, role_permissionsUncheckedCreateWithoutRolesInput>
  }

  export type role_permissionsCreateManyRolesInputEnvelope = {
    data: role_permissionsCreateManyRolesInput | role_permissionsCreateManyRolesInput[]
    skipDuplicates?: boolean
  }

  export type usersCreateWithoutRolesInput = {
    id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    reports?: reportsCreateNestedManyWithoutUsersInput
    requests_requests_requester_idTousers?: requestsCreateNestedManyWithoutUsers_requests_requester_idTousersInput
    requests_requests_reviewed_byTousers?: requestsCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput
    sessions?: sessionsCreateNestedManyWithoutUsersInput
    trips?: tripsCreateNestedManyWithoutUsersInput
    organizations: organizationsCreateNestedOneWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutRolesInput = {
    id: string
    organization_id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    reports?: reportsUncheckedCreateNestedManyWithoutUsersInput
    requests_requests_requester_idTousers?: requestsUncheckedCreateNestedManyWithoutUsers_requests_requester_idTousersInput
    requests_requests_reviewed_byTousers?: requestsUncheckedCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput
    sessions?: sessionsUncheckedCreateNestedManyWithoutUsersInput
    trips?: tripsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutRolesInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutRolesInput, usersUncheckedCreateWithoutRolesInput>
  }

  export type usersCreateManyRolesInputEnvelope = {
    data: usersCreateManyRolesInput | usersCreateManyRolesInput[]
    skipDuplicates?: boolean
  }

  export type role_permissionsUpsertWithWhereUniqueWithoutRolesInput = {
    where: role_permissionsWhereUniqueInput
    update: XOR<role_permissionsUpdateWithoutRolesInput, role_permissionsUncheckedUpdateWithoutRolesInput>
    create: XOR<role_permissionsCreateWithoutRolesInput, role_permissionsUncheckedCreateWithoutRolesInput>
  }

  export type role_permissionsUpdateWithWhereUniqueWithoutRolesInput = {
    where: role_permissionsWhereUniqueInput
    data: XOR<role_permissionsUpdateWithoutRolesInput, role_permissionsUncheckedUpdateWithoutRolesInput>
  }

  export type role_permissionsUpdateManyWithWhereWithoutRolesInput = {
    where: role_permissionsScalarWhereInput
    data: XOR<role_permissionsUpdateManyMutationInput, role_permissionsUncheckedUpdateManyWithoutRolesInput>
  }

  export type usersUpsertWithWhereUniqueWithoutRolesInput = {
    where: usersWhereUniqueInput
    update: XOR<usersUpdateWithoutRolesInput, usersUncheckedUpdateWithoutRolesInput>
    create: XOR<usersCreateWithoutRolesInput, usersUncheckedCreateWithoutRolesInput>
  }

  export type usersUpdateWithWhereUniqueWithoutRolesInput = {
    where: usersWhereUniqueInput
    data: XOR<usersUpdateWithoutRolesInput, usersUncheckedUpdateWithoutRolesInput>
  }

  export type usersUpdateManyWithWhereWithoutRolesInput = {
    where: usersScalarWhereInput
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyWithoutRolesInput>
  }

  export type usersCreateWithoutSessionsInput = {
    id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    reports?: reportsCreateNestedManyWithoutUsersInput
    requests_requests_requester_idTousers?: requestsCreateNestedManyWithoutUsers_requests_requester_idTousersInput
    requests_requests_reviewed_byTousers?: requestsCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput
    trips?: tripsCreateNestedManyWithoutUsersInput
    organizations: organizationsCreateNestedOneWithoutUsersInput
    roles: rolesCreateNestedOneWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutSessionsInput = {
    id: string
    organization_id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    role_id: string
    reports?: reportsUncheckedCreateNestedManyWithoutUsersInput
    requests_requests_requester_idTousers?: requestsUncheckedCreateNestedManyWithoutUsers_requests_requester_idTousersInput
    requests_requests_reviewed_byTousers?: requestsUncheckedCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput
    trips?: tripsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutSessionsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutSessionsInput, usersUncheckedCreateWithoutSessionsInput>
  }

  export type usersUpsertWithoutSessionsInput = {
    update: XOR<usersUpdateWithoutSessionsInput, usersUncheckedUpdateWithoutSessionsInput>
    create: XOR<usersCreateWithoutSessionsInput, usersUncheckedCreateWithoutSessionsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutSessionsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutSessionsInput, usersUncheckedUpdateWithoutSessionsInput>
  }

  export type usersUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reports?: reportsUpdateManyWithoutUsersNestedInput
    requests_requests_requester_idTousers?: requestsUpdateManyWithoutUsers_requests_requester_idTousersNestedInput
    requests_requests_reviewed_byTousers?: requestsUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput
    trips?: tripsUpdateManyWithoutUsersNestedInput
    organizations?: organizationsUpdateOneRequiredWithoutUsersNestedInput
    roles?: rolesUpdateOneRequiredWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    organization_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role_id?: StringFieldUpdateOperationsInput | string
    reports?: reportsUncheckedUpdateManyWithoutUsersNestedInput
    requests_requests_requester_idTousers?: requestsUncheckedUpdateManyWithoutUsers_requests_requester_idTousersNestedInput
    requests_requests_reviewed_byTousers?: requestsUncheckedUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput
    trips?: tripsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersCreateWithoutTripsInput = {
    id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    reports?: reportsCreateNestedManyWithoutUsersInput
    requests_requests_requester_idTousers?: requestsCreateNestedManyWithoutUsers_requests_requester_idTousersInput
    requests_requests_reviewed_byTousers?: requestsCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput
    sessions?: sessionsCreateNestedManyWithoutUsersInput
    organizations: organizationsCreateNestedOneWithoutUsersInput
    roles: rolesCreateNestedOneWithoutUsersInput
  }

  export type usersUncheckedCreateWithoutTripsInput = {
    id: string
    organization_id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    role_id: string
    reports?: reportsUncheckedCreateNestedManyWithoutUsersInput
    requests_requests_requester_idTousers?: requestsUncheckedCreateNestedManyWithoutUsers_requests_requester_idTousersInput
    requests_requests_reviewed_byTousers?: requestsUncheckedCreateNestedManyWithoutUsers_requests_reviewed_byTousersInput
    sessions?: sessionsUncheckedCreateNestedManyWithoutUsersInput
  }

  export type usersCreateOrConnectWithoutTripsInput = {
    where: usersWhereUniqueInput
    create: XOR<usersCreateWithoutTripsInput, usersUncheckedCreateWithoutTripsInput>
  }

  export type requestsCreateWithoutTripsInput = {
    id: string
    requested_at?: Date | string
    trip_purpose: string
    start_location: string
    end_location: string
    start_date: Date | string
    end_date: Date | string
    status?: string
    reviewed_at?: Date | string | null
    comments?: string | null
    users_requests_requester_idTousers: usersCreateNestedOneWithoutRequests_requests_requester_idTousersInput
    users_requests_reviewed_byTousers?: usersCreateNestedOneWithoutRequests_requests_reviewed_byTousersInput
    vehicles?: vehiclesCreateNestedOneWithoutRequestsInput
  }

  export type requestsUncheckedCreateWithoutTripsInput = {
    id: string
    vehicle_id?: string | null
    requested_at?: Date | string
    trip_purpose: string
    start_location: string
    end_location: string
    start_date: Date | string
    end_date: Date | string
    status?: string
    reviewed_at?: Date | string | null
    comments?: string | null
    requester_id: string
    reviewed_by?: string | null
  }

  export type requestsCreateOrConnectWithoutTripsInput = {
    where: requestsWhereUniqueInput
    create: XOR<requestsCreateWithoutTripsInput, requestsUncheckedCreateWithoutTripsInput>
  }

  export type vehiclesCreateWithoutTripsInput = {
    id: string
    plate_number: string
    model: string
    manufacturer: string
    year: number
    capacity?: number | null
    odometer?: number
    status?: string
    fuel_type?: string | null
    last_service_date?: Date | string | null
    created_at?: Date | string
    requests?: requestsCreateNestedManyWithoutVehiclesInput
    organizations: organizationsCreateNestedOneWithoutVehiclesInput
  }

  export type vehiclesUncheckedCreateWithoutTripsInput = {
    id: string
    plate_number: string
    model: string
    manufacturer: string
    year: number
    capacity?: number | null
    odometer?: number
    status?: string
    fuel_type?: string | null
    last_service_date?: Date | string | null
    created_at?: Date | string
    organization_id: string
    requests?: requestsUncheckedCreateNestedManyWithoutVehiclesInput
  }

  export type vehiclesCreateOrConnectWithoutTripsInput = {
    where: vehiclesWhereUniqueInput
    create: XOR<vehiclesCreateWithoutTripsInput, vehiclesUncheckedCreateWithoutTripsInput>
  }

  export type usersUpsertWithoutTripsInput = {
    update: XOR<usersUpdateWithoutTripsInput, usersUncheckedUpdateWithoutTripsInput>
    create: XOR<usersCreateWithoutTripsInput, usersUncheckedCreateWithoutTripsInput>
    where?: usersWhereInput
  }

  export type usersUpdateToOneWithWhereWithoutTripsInput = {
    where?: usersWhereInput
    data: XOR<usersUpdateWithoutTripsInput, usersUncheckedUpdateWithoutTripsInput>
  }

  export type usersUpdateWithoutTripsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reports?: reportsUpdateManyWithoutUsersNestedInput
    requests_requests_requester_idTousers?: requestsUpdateManyWithoutUsers_requests_requester_idTousersNestedInput
    requests_requests_reviewed_byTousers?: requestsUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput
    sessions?: sessionsUpdateManyWithoutUsersNestedInput
    organizations?: organizationsUpdateOneRequiredWithoutUsersNestedInput
    roles?: rolesUpdateOneRequiredWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutTripsInput = {
    id?: StringFieldUpdateOperationsInput | string
    organization_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role_id?: StringFieldUpdateOperationsInput | string
    reports?: reportsUncheckedUpdateManyWithoutUsersNestedInput
    requests_requests_requester_idTousers?: requestsUncheckedUpdateManyWithoutUsers_requests_requester_idTousersNestedInput
    requests_requests_reviewed_byTousers?: requestsUncheckedUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput
    sessions?: sessionsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type requestsUpsertWithoutTripsInput = {
    update: XOR<requestsUpdateWithoutTripsInput, requestsUncheckedUpdateWithoutTripsInput>
    create: XOR<requestsCreateWithoutTripsInput, requestsUncheckedCreateWithoutTripsInput>
    where?: requestsWhereInput
  }

  export type requestsUpdateToOneWithWhereWithoutTripsInput = {
    where?: requestsWhereInput
    data: XOR<requestsUpdateWithoutTripsInput, requestsUncheckedUpdateWithoutTripsInput>
  }

  export type requestsUpdateWithoutTripsInput = {
    id?: StringFieldUpdateOperationsInput | string
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_purpose?: StringFieldUpdateOperationsInput | string
    start_location?: StringFieldUpdateOperationsInput | string
    end_location?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    users_requests_requester_idTousers?: usersUpdateOneRequiredWithoutRequests_requests_requester_idTousersNestedInput
    users_requests_reviewed_byTousers?: usersUpdateOneWithoutRequests_requests_reviewed_byTousersNestedInput
    vehicles?: vehiclesUpdateOneWithoutRequestsNestedInput
  }

  export type requestsUncheckedUpdateWithoutTripsInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_id?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_purpose?: StringFieldUpdateOperationsInput | string
    start_location?: StringFieldUpdateOperationsInput | string
    end_location?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    requester_id?: StringFieldUpdateOperationsInput | string
    reviewed_by?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type vehiclesUpsertWithoutTripsInput = {
    update: XOR<vehiclesUpdateWithoutTripsInput, vehiclesUncheckedUpdateWithoutTripsInput>
    create: XOR<vehiclesCreateWithoutTripsInput, vehiclesUncheckedCreateWithoutTripsInput>
    where?: vehiclesWhereInput
  }

  export type vehiclesUpdateToOneWithWhereWithoutTripsInput = {
    where?: vehiclesWhereInput
    data: XOR<vehiclesUpdateWithoutTripsInput, vehiclesUncheckedUpdateWithoutTripsInput>
  }

  export type vehiclesUpdateWithoutTripsInput = {
    id?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    manufacturer?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    odometer?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    fuel_type?: NullableStringFieldUpdateOperationsInput | string | null
    last_service_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    requests?: requestsUpdateManyWithoutVehiclesNestedInput
    organizations?: organizationsUpdateOneRequiredWithoutVehiclesNestedInput
  }

  export type vehiclesUncheckedUpdateWithoutTripsInput = {
    id?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    manufacturer?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    odometer?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    fuel_type?: NullableStringFieldUpdateOperationsInput | string | null
    last_service_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    organization_id?: StringFieldUpdateOperationsInput | string
    requests?: requestsUncheckedUpdateManyWithoutVehiclesNestedInput
  }

  export type reportsCreateWithoutUsersInput = {
    id: string
    report_type: string
    generated_at?: Date | string
    file_url?: string | null
    description?: string | null
    organizations: organizationsCreateNestedOneWithoutReportsInput
  }

  export type reportsUncheckedCreateWithoutUsersInput = {
    id: string
    organization_id: string
    report_type: string
    generated_at?: Date | string
    file_url?: string | null
    description?: string | null
  }

  export type reportsCreateOrConnectWithoutUsersInput = {
    where: reportsWhereUniqueInput
    create: XOR<reportsCreateWithoutUsersInput, reportsUncheckedCreateWithoutUsersInput>
  }

  export type reportsCreateManyUsersInputEnvelope = {
    data: reportsCreateManyUsersInput | reportsCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type requestsCreateWithoutUsers_requests_requester_idTousersInput = {
    id: string
    requested_at?: Date | string
    trip_purpose: string
    start_location: string
    end_location: string
    start_date: Date | string
    end_date: Date | string
    status?: string
    reviewed_at?: Date | string | null
    comments?: string | null
    users_requests_reviewed_byTousers?: usersCreateNestedOneWithoutRequests_requests_reviewed_byTousersInput
    vehicles?: vehiclesCreateNestedOneWithoutRequestsInput
    trips?: tripsCreateNestedManyWithoutRequestsInput
  }

  export type requestsUncheckedCreateWithoutUsers_requests_requester_idTousersInput = {
    id: string
    vehicle_id?: string | null
    requested_at?: Date | string
    trip_purpose: string
    start_location: string
    end_location: string
    start_date: Date | string
    end_date: Date | string
    status?: string
    reviewed_at?: Date | string | null
    comments?: string | null
    reviewed_by?: string | null
    trips?: tripsUncheckedCreateNestedManyWithoutRequestsInput
  }

  export type requestsCreateOrConnectWithoutUsers_requests_requester_idTousersInput = {
    where: requestsWhereUniqueInput
    create: XOR<requestsCreateWithoutUsers_requests_requester_idTousersInput, requestsUncheckedCreateWithoutUsers_requests_requester_idTousersInput>
  }

  export type requestsCreateManyUsers_requests_requester_idTousersInputEnvelope = {
    data: requestsCreateManyUsers_requests_requester_idTousersInput | requestsCreateManyUsers_requests_requester_idTousersInput[]
    skipDuplicates?: boolean
  }

  export type requestsCreateWithoutUsers_requests_reviewed_byTousersInput = {
    id: string
    requested_at?: Date | string
    trip_purpose: string
    start_location: string
    end_location: string
    start_date: Date | string
    end_date: Date | string
    status?: string
    reviewed_at?: Date | string | null
    comments?: string | null
    users_requests_requester_idTousers: usersCreateNestedOneWithoutRequests_requests_requester_idTousersInput
    vehicles?: vehiclesCreateNestedOneWithoutRequestsInput
    trips?: tripsCreateNestedManyWithoutRequestsInput
  }

  export type requestsUncheckedCreateWithoutUsers_requests_reviewed_byTousersInput = {
    id: string
    vehicle_id?: string | null
    requested_at?: Date | string
    trip_purpose: string
    start_location: string
    end_location: string
    start_date: Date | string
    end_date: Date | string
    status?: string
    reviewed_at?: Date | string | null
    comments?: string | null
    requester_id: string
    trips?: tripsUncheckedCreateNestedManyWithoutRequestsInput
  }

  export type requestsCreateOrConnectWithoutUsers_requests_reviewed_byTousersInput = {
    where: requestsWhereUniqueInput
    create: XOR<requestsCreateWithoutUsers_requests_reviewed_byTousersInput, requestsUncheckedCreateWithoutUsers_requests_reviewed_byTousersInput>
  }

  export type requestsCreateManyUsers_requests_reviewed_byTousersInputEnvelope = {
    data: requestsCreateManyUsers_requests_reviewed_byTousersInput | requestsCreateManyUsers_requests_reviewed_byTousersInput[]
    skipDuplicates?: boolean
  }

  export type sessionsCreateWithoutUsersInput = {
    id: string
    token: string
    created_at?: Date | string
    expires_at: Date | string
    is_active?: boolean
  }

  export type sessionsUncheckedCreateWithoutUsersInput = {
    id: string
    token: string
    created_at?: Date | string
    expires_at: Date | string
    is_active?: boolean
  }

  export type sessionsCreateOrConnectWithoutUsersInput = {
    where: sessionsWhereUniqueInput
    create: XOR<sessionsCreateWithoutUsersInput, sessionsUncheckedCreateWithoutUsersInput>
  }

  export type sessionsCreateManyUsersInputEnvelope = {
    data: sessionsCreateManyUsersInput | sessionsCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type tripsCreateWithoutUsersInput = {
    id: string
    start_odometer: number
    end_odometer?: number | null
    start_time: Date | string
    end_time?: Date | string | null
    fuel_used?: number | null
    trip_notes?: string | null
    created_at?: Date | string
    requests?: requestsCreateNestedOneWithoutTripsInput
    vehicles: vehiclesCreateNestedOneWithoutTripsInput
  }

  export type tripsUncheckedCreateWithoutUsersInput = {
    id: string
    request_id?: string | null
    vehicle_id: string
    start_odometer: number
    end_odometer?: number | null
    start_time: Date | string
    end_time?: Date | string | null
    fuel_used?: number | null
    trip_notes?: string | null
    created_at?: Date | string
  }

  export type tripsCreateOrConnectWithoutUsersInput = {
    where: tripsWhereUniqueInput
    create: XOR<tripsCreateWithoutUsersInput, tripsUncheckedCreateWithoutUsersInput>
  }

  export type tripsCreateManyUsersInputEnvelope = {
    data: tripsCreateManyUsersInput | tripsCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type organizationsCreateWithoutUsersInput = {
    id: string
    name: string
    address: string
    phone: string
    email: string
    created_at?: Date | string
    reports?: reportsCreateNestedManyWithoutOrganizationsInput
    vehicles?: vehiclesCreateNestedManyWithoutOrganizationsInput
  }

  export type organizationsUncheckedCreateWithoutUsersInput = {
    id: string
    name: string
    address: string
    phone: string
    email: string
    created_at?: Date | string
    reports?: reportsUncheckedCreateNestedManyWithoutOrganizationsInput
    vehicles?: vehiclesUncheckedCreateNestedManyWithoutOrganizationsInput
  }

  export type organizationsCreateOrConnectWithoutUsersInput = {
    where: organizationsWhereUniqueInput
    create: XOR<organizationsCreateWithoutUsersInput, organizationsUncheckedCreateWithoutUsersInput>
  }

  export type rolesCreateWithoutUsersInput = {
    id: string
    name: string
    description?: string | null
    role_permissions?: role_permissionsCreateNestedManyWithoutRolesInput
  }

  export type rolesUncheckedCreateWithoutUsersInput = {
    id: string
    name: string
    description?: string | null
    role_permissions?: role_permissionsUncheckedCreateNestedManyWithoutRolesInput
  }

  export type rolesCreateOrConnectWithoutUsersInput = {
    where: rolesWhereUniqueInput
    create: XOR<rolesCreateWithoutUsersInput, rolesUncheckedCreateWithoutUsersInput>
  }

  export type reportsUpsertWithWhereUniqueWithoutUsersInput = {
    where: reportsWhereUniqueInput
    update: XOR<reportsUpdateWithoutUsersInput, reportsUncheckedUpdateWithoutUsersInput>
    create: XOR<reportsCreateWithoutUsersInput, reportsUncheckedCreateWithoutUsersInput>
  }

  export type reportsUpdateWithWhereUniqueWithoutUsersInput = {
    where: reportsWhereUniqueInput
    data: XOR<reportsUpdateWithoutUsersInput, reportsUncheckedUpdateWithoutUsersInput>
  }

  export type reportsUpdateManyWithWhereWithoutUsersInput = {
    where: reportsScalarWhereInput
    data: XOR<reportsUpdateManyMutationInput, reportsUncheckedUpdateManyWithoutUsersInput>
  }

  export type requestsUpsertWithWhereUniqueWithoutUsers_requests_requester_idTousersInput = {
    where: requestsWhereUniqueInput
    update: XOR<requestsUpdateWithoutUsers_requests_requester_idTousersInput, requestsUncheckedUpdateWithoutUsers_requests_requester_idTousersInput>
    create: XOR<requestsCreateWithoutUsers_requests_requester_idTousersInput, requestsUncheckedCreateWithoutUsers_requests_requester_idTousersInput>
  }

  export type requestsUpdateWithWhereUniqueWithoutUsers_requests_requester_idTousersInput = {
    where: requestsWhereUniqueInput
    data: XOR<requestsUpdateWithoutUsers_requests_requester_idTousersInput, requestsUncheckedUpdateWithoutUsers_requests_requester_idTousersInput>
  }

  export type requestsUpdateManyWithWhereWithoutUsers_requests_requester_idTousersInput = {
    where: requestsScalarWhereInput
    data: XOR<requestsUpdateManyMutationInput, requestsUncheckedUpdateManyWithoutUsers_requests_requester_idTousersInput>
  }

  export type requestsScalarWhereInput = {
    AND?: requestsScalarWhereInput | requestsScalarWhereInput[]
    OR?: requestsScalarWhereInput[]
    NOT?: requestsScalarWhereInput | requestsScalarWhereInput[]
    id?: StringFilter<"requests"> | string
    vehicle_id?: StringNullableFilter<"requests"> | string | null
    requested_at?: DateTimeFilter<"requests"> | Date | string
    trip_purpose?: StringFilter<"requests"> | string
    start_location?: StringFilter<"requests"> | string
    end_location?: StringFilter<"requests"> | string
    start_date?: DateTimeFilter<"requests"> | Date | string
    end_date?: DateTimeFilter<"requests"> | Date | string
    status?: StringFilter<"requests"> | string
    reviewed_at?: DateTimeNullableFilter<"requests"> | Date | string | null
    comments?: StringNullableFilter<"requests"> | string | null
    requester_id?: StringFilter<"requests"> | string
    reviewed_by?: StringNullableFilter<"requests"> | string | null
  }

  export type requestsUpsertWithWhereUniqueWithoutUsers_requests_reviewed_byTousersInput = {
    where: requestsWhereUniqueInput
    update: XOR<requestsUpdateWithoutUsers_requests_reviewed_byTousersInput, requestsUncheckedUpdateWithoutUsers_requests_reviewed_byTousersInput>
    create: XOR<requestsCreateWithoutUsers_requests_reviewed_byTousersInput, requestsUncheckedCreateWithoutUsers_requests_reviewed_byTousersInput>
  }

  export type requestsUpdateWithWhereUniqueWithoutUsers_requests_reviewed_byTousersInput = {
    where: requestsWhereUniqueInput
    data: XOR<requestsUpdateWithoutUsers_requests_reviewed_byTousersInput, requestsUncheckedUpdateWithoutUsers_requests_reviewed_byTousersInput>
  }

  export type requestsUpdateManyWithWhereWithoutUsers_requests_reviewed_byTousersInput = {
    where: requestsScalarWhereInput
    data: XOR<requestsUpdateManyMutationInput, requestsUncheckedUpdateManyWithoutUsers_requests_reviewed_byTousersInput>
  }

  export type sessionsUpsertWithWhereUniqueWithoutUsersInput = {
    where: sessionsWhereUniqueInput
    update: XOR<sessionsUpdateWithoutUsersInput, sessionsUncheckedUpdateWithoutUsersInput>
    create: XOR<sessionsCreateWithoutUsersInput, sessionsUncheckedCreateWithoutUsersInput>
  }

  export type sessionsUpdateWithWhereUniqueWithoutUsersInput = {
    where: sessionsWhereUniqueInput
    data: XOR<sessionsUpdateWithoutUsersInput, sessionsUncheckedUpdateWithoutUsersInput>
  }

  export type sessionsUpdateManyWithWhereWithoutUsersInput = {
    where: sessionsScalarWhereInput
    data: XOR<sessionsUpdateManyMutationInput, sessionsUncheckedUpdateManyWithoutUsersInput>
  }

  export type sessionsScalarWhereInput = {
    AND?: sessionsScalarWhereInput | sessionsScalarWhereInput[]
    OR?: sessionsScalarWhereInput[]
    NOT?: sessionsScalarWhereInput | sessionsScalarWhereInput[]
    id?: StringFilter<"sessions"> | string
    user_id?: StringFilter<"sessions"> | string
    token?: StringFilter<"sessions"> | string
    created_at?: DateTimeFilter<"sessions"> | Date | string
    expires_at?: DateTimeFilter<"sessions"> | Date | string
    is_active?: BoolFilter<"sessions"> | boolean
  }

  export type tripsUpsertWithWhereUniqueWithoutUsersInput = {
    where: tripsWhereUniqueInput
    update: XOR<tripsUpdateWithoutUsersInput, tripsUncheckedUpdateWithoutUsersInput>
    create: XOR<tripsCreateWithoutUsersInput, tripsUncheckedCreateWithoutUsersInput>
  }

  export type tripsUpdateWithWhereUniqueWithoutUsersInput = {
    where: tripsWhereUniqueInput
    data: XOR<tripsUpdateWithoutUsersInput, tripsUncheckedUpdateWithoutUsersInput>
  }

  export type tripsUpdateManyWithWhereWithoutUsersInput = {
    where: tripsScalarWhereInput
    data: XOR<tripsUpdateManyMutationInput, tripsUncheckedUpdateManyWithoutUsersInput>
  }

  export type organizationsUpsertWithoutUsersInput = {
    update: XOR<organizationsUpdateWithoutUsersInput, organizationsUncheckedUpdateWithoutUsersInput>
    create: XOR<organizationsCreateWithoutUsersInput, organizationsUncheckedCreateWithoutUsersInput>
    where?: organizationsWhereInput
  }

  export type organizationsUpdateToOneWithWhereWithoutUsersInput = {
    where?: organizationsWhereInput
    data: XOR<organizationsUpdateWithoutUsersInput, organizationsUncheckedUpdateWithoutUsersInput>
  }

  export type organizationsUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: reportsUpdateManyWithoutOrganizationsNestedInput
    vehicles?: vehiclesUpdateManyWithoutOrganizationsNestedInput
  }

  export type organizationsUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: reportsUncheckedUpdateManyWithoutOrganizationsNestedInput
    vehicles?: vehiclesUncheckedUpdateManyWithoutOrganizationsNestedInput
  }

  export type rolesUpsertWithoutUsersInput = {
    update: XOR<rolesUpdateWithoutUsersInput, rolesUncheckedUpdateWithoutUsersInput>
    create: XOR<rolesCreateWithoutUsersInput, rolesUncheckedCreateWithoutUsersInput>
    where?: rolesWhereInput
  }

  export type rolesUpdateToOneWithWhereWithoutUsersInput = {
    where?: rolesWhereInput
    data: XOR<rolesUpdateWithoutUsersInput, rolesUncheckedUpdateWithoutUsersInput>
  }

  export type rolesUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    role_permissions?: role_permissionsUpdateManyWithoutRolesNestedInput
  }

  export type rolesUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    role_permissions?: role_permissionsUncheckedUpdateManyWithoutRolesNestedInput
  }

  export type requestsCreateWithoutVehiclesInput = {
    id: string
    requested_at?: Date | string
    trip_purpose: string
    start_location: string
    end_location: string
    start_date: Date | string
    end_date: Date | string
    status?: string
    reviewed_at?: Date | string | null
    comments?: string | null
    users_requests_requester_idTousers: usersCreateNestedOneWithoutRequests_requests_requester_idTousersInput
    users_requests_reviewed_byTousers?: usersCreateNestedOneWithoutRequests_requests_reviewed_byTousersInput
    trips?: tripsCreateNestedManyWithoutRequestsInput
  }

  export type requestsUncheckedCreateWithoutVehiclesInput = {
    id: string
    requested_at?: Date | string
    trip_purpose: string
    start_location: string
    end_location: string
    start_date: Date | string
    end_date: Date | string
    status?: string
    reviewed_at?: Date | string | null
    comments?: string | null
    requester_id: string
    reviewed_by?: string | null
    trips?: tripsUncheckedCreateNestedManyWithoutRequestsInput
  }

  export type requestsCreateOrConnectWithoutVehiclesInput = {
    where: requestsWhereUniqueInput
    create: XOR<requestsCreateWithoutVehiclesInput, requestsUncheckedCreateWithoutVehiclesInput>
  }

  export type requestsCreateManyVehiclesInputEnvelope = {
    data: requestsCreateManyVehiclesInput | requestsCreateManyVehiclesInput[]
    skipDuplicates?: boolean
  }

  export type tripsCreateWithoutVehiclesInput = {
    id: string
    start_odometer: number
    end_odometer?: number | null
    start_time: Date | string
    end_time?: Date | string | null
    fuel_used?: number | null
    trip_notes?: string | null
    created_at?: Date | string
    users: usersCreateNestedOneWithoutTripsInput
    requests?: requestsCreateNestedOneWithoutTripsInput
  }

  export type tripsUncheckedCreateWithoutVehiclesInput = {
    id: string
    request_id?: string | null
    start_odometer: number
    end_odometer?: number | null
    start_time: Date | string
    end_time?: Date | string | null
    fuel_used?: number | null
    trip_notes?: string | null
    created_at?: Date | string
    driver_id: string
  }

  export type tripsCreateOrConnectWithoutVehiclesInput = {
    where: tripsWhereUniqueInput
    create: XOR<tripsCreateWithoutVehiclesInput, tripsUncheckedCreateWithoutVehiclesInput>
  }

  export type tripsCreateManyVehiclesInputEnvelope = {
    data: tripsCreateManyVehiclesInput | tripsCreateManyVehiclesInput[]
    skipDuplicates?: boolean
  }

  export type organizationsCreateWithoutVehiclesInput = {
    id: string
    name: string
    address: string
    phone: string
    email: string
    created_at?: Date | string
    reports?: reportsCreateNestedManyWithoutOrganizationsInput
    users?: usersCreateNestedManyWithoutOrganizationsInput
  }

  export type organizationsUncheckedCreateWithoutVehiclesInput = {
    id: string
    name: string
    address: string
    phone: string
    email: string
    created_at?: Date | string
    reports?: reportsUncheckedCreateNestedManyWithoutOrganizationsInput
    users?: usersUncheckedCreateNestedManyWithoutOrganizationsInput
  }

  export type organizationsCreateOrConnectWithoutVehiclesInput = {
    where: organizationsWhereUniqueInput
    create: XOR<organizationsCreateWithoutVehiclesInput, organizationsUncheckedCreateWithoutVehiclesInput>
  }

  export type requestsUpsertWithWhereUniqueWithoutVehiclesInput = {
    where: requestsWhereUniqueInput
    update: XOR<requestsUpdateWithoutVehiclesInput, requestsUncheckedUpdateWithoutVehiclesInput>
    create: XOR<requestsCreateWithoutVehiclesInput, requestsUncheckedCreateWithoutVehiclesInput>
  }

  export type requestsUpdateWithWhereUniqueWithoutVehiclesInput = {
    where: requestsWhereUniqueInput
    data: XOR<requestsUpdateWithoutVehiclesInput, requestsUncheckedUpdateWithoutVehiclesInput>
  }

  export type requestsUpdateManyWithWhereWithoutVehiclesInput = {
    where: requestsScalarWhereInput
    data: XOR<requestsUpdateManyMutationInput, requestsUncheckedUpdateManyWithoutVehiclesInput>
  }

  export type tripsUpsertWithWhereUniqueWithoutVehiclesInput = {
    where: tripsWhereUniqueInput
    update: XOR<tripsUpdateWithoutVehiclesInput, tripsUncheckedUpdateWithoutVehiclesInput>
    create: XOR<tripsCreateWithoutVehiclesInput, tripsUncheckedCreateWithoutVehiclesInput>
  }

  export type tripsUpdateWithWhereUniqueWithoutVehiclesInput = {
    where: tripsWhereUniqueInput
    data: XOR<tripsUpdateWithoutVehiclesInput, tripsUncheckedUpdateWithoutVehiclesInput>
  }

  export type tripsUpdateManyWithWhereWithoutVehiclesInput = {
    where: tripsScalarWhereInput
    data: XOR<tripsUpdateManyMutationInput, tripsUncheckedUpdateManyWithoutVehiclesInput>
  }

  export type organizationsUpsertWithoutVehiclesInput = {
    update: XOR<organizationsUpdateWithoutVehiclesInput, organizationsUncheckedUpdateWithoutVehiclesInput>
    create: XOR<organizationsCreateWithoutVehiclesInput, organizationsUncheckedCreateWithoutVehiclesInput>
    where?: organizationsWhereInput
  }

  export type organizationsUpdateToOneWithWhereWithoutVehiclesInput = {
    where?: organizationsWhereInput
    data: XOR<organizationsUpdateWithoutVehiclesInput, organizationsUncheckedUpdateWithoutVehiclesInput>
  }

  export type organizationsUpdateWithoutVehiclesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: reportsUpdateManyWithoutOrganizationsNestedInput
    users?: usersUpdateManyWithoutOrganizationsNestedInput
  }

  export type organizationsUncheckedUpdateWithoutVehiclesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: reportsUncheckedUpdateManyWithoutOrganizationsNestedInput
    users?: usersUncheckedUpdateManyWithoutOrganizationsNestedInput
  }

  export type reportsCreateManyOrganizationsInput = {
    id: string
    generated_by: string
    report_type: string
    generated_at?: Date | string
    file_url?: string | null
    description?: string | null
  }

  export type usersCreateManyOrganizationsInput = {
    id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
    role_id: string
  }

  export type vehiclesCreateManyOrganizationsInput = {
    id: string
    plate_number: string
    model: string
    manufacturer: string
    year: number
    capacity?: number | null
    odometer?: number
    status?: string
    fuel_type?: string | null
    last_service_date?: Date | string | null
    created_at?: Date | string
  }

  export type reportsUpdateWithoutOrganizationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    report_type?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    users?: usersUpdateOneRequiredWithoutReportsNestedInput
  }

  export type reportsUncheckedUpdateWithoutOrganizationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    generated_by?: StringFieldUpdateOperationsInput | string
    report_type?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type reportsUncheckedUpdateManyWithoutOrganizationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    generated_by?: StringFieldUpdateOperationsInput | string
    report_type?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type usersUpdateWithoutOrganizationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reports?: reportsUpdateManyWithoutUsersNestedInput
    requests_requests_requester_idTousers?: requestsUpdateManyWithoutUsers_requests_requester_idTousersNestedInput
    requests_requests_reviewed_byTousers?: requestsUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput
    sessions?: sessionsUpdateManyWithoutUsersNestedInput
    trips?: tripsUpdateManyWithoutUsersNestedInput
    roles?: rolesUpdateOneRequiredWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutOrganizationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role_id?: StringFieldUpdateOperationsInput | string
    reports?: reportsUncheckedUpdateManyWithoutUsersNestedInput
    requests_requests_requester_idTousers?: requestsUncheckedUpdateManyWithoutUsers_requests_requester_idTousersNestedInput
    requests_requests_reviewed_byTousers?: requestsUncheckedUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput
    sessions?: sessionsUncheckedUpdateManyWithoutUsersNestedInput
    trips?: tripsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateManyWithoutOrganizationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role_id?: StringFieldUpdateOperationsInput | string
  }

  export type vehiclesUpdateWithoutOrganizationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    manufacturer?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    odometer?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    fuel_type?: NullableStringFieldUpdateOperationsInput | string | null
    last_service_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    requests?: requestsUpdateManyWithoutVehiclesNestedInput
    trips?: tripsUpdateManyWithoutVehiclesNestedInput
  }

  export type vehiclesUncheckedUpdateWithoutOrganizationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    manufacturer?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    odometer?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    fuel_type?: NullableStringFieldUpdateOperationsInput | string | null
    last_service_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    requests?: requestsUncheckedUpdateManyWithoutVehiclesNestedInput
    trips?: tripsUncheckedUpdateManyWithoutVehiclesNestedInput
  }

  export type vehiclesUncheckedUpdateManyWithoutOrganizationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    manufacturer?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    capacity?: NullableIntFieldUpdateOperationsInput | number | null
    odometer?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    fuel_type?: NullableStringFieldUpdateOperationsInput | string | null
    last_service_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type role_permissionsCreateManyPermissionsInput = {
    id: string
    role_id: string
  }

  export type role_permissionsUpdateWithoutPermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    roles?: rolesUpdateOneRequiredWithoutRole_permissionsNestedInput
  }

  export type role_permissionsUncheckedUpdateWithoutPermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    role_id?: StringFieldUpdateOperationsInput | string
  }

  export type role_permissionsUncheckedUpdateManyWithoutPermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    role_id?: StringFieldUpdateOperationsInput | string
  }

  export type tripsCreateManyRequestsInput = {
    id: string
    vehicle_id: string
    start_odometer: number
    end_odometer?: number | null
    start_time: Date | string
    end_time?: Date | string | null
    fuel_used?: number | null
    trip_notes?: string | null
    created_at?: Date | string
    driver_id: string
  }

  export type tripsUpdateWithoutRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_odometer?: IntFieldUpdateOperationsInput | number
    end_odometer?: NullableIntFieldUpdateOperationsInput | number | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fuel_used?: NullableFloatFieldUpdateOperationsInput | number | null
    trip_notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: usersUpdateOneRequiredWithoutTripsNestedInput
    vehicles?: vehiclesUpdateOneRequiredWithoutTripsNestedInput
  }

  export type tripsUncheckedUpdateWithoutRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_id?: StringFieldUpdateOperationsInput | string
    start_odometer?: IntFieldUpdateOperationsInput | number
    end_odometer?: NullableIntFieldUpdateOperationsInput | number | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fuel_used?: NullableFloatFieldUpdateOperationsInput | number | null
    trip_notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    driver_id?: StringFieldUpdateOperationsInput | string
  }

  export type tripsUncheckedUpdateManyWithoutRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_id?: StringFieldUpdateOperationsInput | string
    start_odometer?: IntFieldUpdateOperationsInput | number
    end_odometer?: NullableIntFieldUpdateOperationsInput | number | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fuel_used?: NullableFloatFieldUpdateOperationsInput | number | null
    trip_notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    driver_id?: StringFieldUpdateOperationsInput | string
  }

  export type role_permissionsCreateManyRolesInput = {
    id: string
    permission_id: string
  }

  export type usersCreateManyRolesInput = {
    id: string
    organization_id: string
    username: string
    password_hash: string
    email: string
    full_name: string
    phone?: string | null
    status?: string
    created_at?: Date | string
    last_login?: Date | string | null
  }

  export type role_permissionsUpdateWithoutRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    permissions?: permissionsUpdateOneRequiredWithoutRole_permissionsNestedInput
  }

  export type role_permissionsUncheckedUpdateWithoutRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    permission_id?: StringFieldUpdateOperationsInput | string
  }

  export type role_permissionsUncheckedUpdateManyWithoutRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    permission_id?: StringFieldUpdateOperationsInput | string
  }

  export type usersUpdateWithoutRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reports?: reportsUpdateManyWithoutUsersNestedInput
    requests_requests_requester_idTousers?: requestsUpdateManyWithoutUsers_requests_requester_idTousersNestedInput
    requests_requests_reviewed_byTousers?: requestsUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput
    sessions?: sessionsUpdateManyWithoutUsersNestedInput
    trips?: tripsUpdateManyWithoutUsersNestedInput
    organizations?: organizationsUpdateOneRequiredWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateWithoutRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    organization_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reports?: reportsUncheckedUpdateManyWithoutUsersNestedInput
    requests_requests_requester_idTousers?: requestsUncheckedUpdateManyWithoutUsers_requests_requester_idTousersNestedInput
    requests_requests_reviewed_byTousers?: requestsUncheckedUpdateManyWithoutUsers_requests_reviewed_byTousersNestedInput
    sessions?: sessionsUncheckedUpdateManyWithoutUsersNestedInput
    trips?: tripsUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type usersUncheckedUpdateManyWithoutRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    organization_id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type reportsCreateManyUsersInput = {
    id: string
    organization_id: string
    report_type: string
    generated_at?: Date | string
    file_url?: string | null
    description?: string | null
  }

  export type requestsCreateManyUsers_requests_requester_idTousersInput = {
    id: string
    vehicle_id?: string | null
    requested_at?: Date | string
    trip_purpose: string
    start_location: string
    end_location: string
    start_date: Date | string
    end_date: Date | string
    status?: string
    reviewed_at?: Date | string | null
    comments?: string | null
    reviewed_by?: string | null
  }

  export type requestsCreateManyUsers_requests_reviewed_byTousersInput = {
    id: string
    vehicle_id?: string | null
    requested_at?: Date | string
    trip_purpose: string
    start_location: string
    end_location: string
    start_date: Date | string
    end_date: Date | string
    status?: string
    reviewed_at?: Date | string | null
    comments?: string | null
    requester_id: string
  }

  export type sessionsCreateManyUsersInput = {
    id: string
    token: string
    created_at?: Date | string
    expires_at: Date | string
    is_active?: boolean
  }

  export type tripsCreateManyUsersInput = {
    id: string
    request_id?: string | null
    vehicle_id: string
    start_odometer: number
    end_odometer?: number | null
    start_time: Date | string
    end_time?: Date | string | null
    fuel_used?: number | null
    trip_notes?: string | null
    created_at?: Date | string
  }

  export type reportsUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    report_type?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    organizations?: organizationsUpdateOneRequiredWithoutReportsNestedInput
  }

  export type reportsUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    organization_id?: StringFieldUpdateOperationsInput | string
    report_type?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type reportsUncheckedUpdateManyWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    organization_id?: StringFieldUpdateOperationsInput | string
    report_type?: StringFieldUpdateOperationsInput | string
    generated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    file_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type requestsUpdateWithoutUsers_requests_requester_idTousersInput = {
    id?: StringFieldUpdateOperationsInput | string
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_purpose?: StringFieldUpdateOperationsInput | string
    start_location?: StringFieldUpdateOperationsInput | string
    end_location?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    users_requests_reviewed_byTousers?: usersUpdateOneWithoutRequests_requests_reviewed_byTousersNestedInput
    vehicles?: vehiclesUpdateOneWithoutRequestsNestedInput
    trips?: tripsUpdateManyWithoutRequestsNestedInput
  }

  export type requestsUncheckedUpdateWithoutUsers_requests_requester_idTousersInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_id?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_purpose?: StringFieldUpdateOperationsInput | string
    start_location?: StringFieldUpdateOperationsInput | string
    end_location?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    reviewed_by?: NullableStringFieldUpdateOperationsInput | string | null
    trips?: tripsUncheckedUpdateManyWithoutRequestsNestedInput
  }

  export type requestsUncheckedUpdateManyWithoutUsers_requests_requester_idTousersInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_id?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_purpose?: StringFieldUpdateOperationsInput | string
    start_location?: StringFieldUpdateOperationsInput | string
    end_location?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    reviewed_by?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type requestsUpdateWithoutUsers_requests_reviewed_byTousersInput = {
    id?: StringFieldUpdateOperationsInput | string
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_purpose?: StringFieldUpdateOperationsInput | string
    start_location?: StringFieldUpdateOperationsInput | string
    end_location?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    users_requests_requester_idTousers?: usersUpdateOneRequiredWithoutRequests_requests_requester_idTousersNestedInput
    vehicles?: vehiclesUpdateOneWithoutRequestsNestedInput
    trips?: tripsUpdateManyWithoutRequestsNestedInput
  }

  export type requestsUncheckedUpdateWithoutUsers_requests_reviewed_byTousersInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_id?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_purpose?: StringFieldUpdateOperationsInput | string
    start_location?: StringFieldUpdateOperationsInput | string
    end_location?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    requester_id?: StringFieldUpdateOperationsInput | string
    trips?: tripsUncheckedUpdateManyWithoutRequestsNestedInput
  }

  export type requestsUncheckedUpdateManyWithoutUsers_requests_reviewed_byTousersInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicle_id?: NullableStringFieldUpdateOperationsInput | string | null
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_purpose?: StringFieldUpdateOperationsInput | string
    start_location?: StringFieldUpdateOperationsInput | string
    end_location?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    requester_id?: StringFieldUpdateOperationsInput | string
  }

  export type sessionsUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type sessionsUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type sessionsUncheckedUpdateManyWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type tripsUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_odometer?: IntFieldUpdateOperationsInput | number
    end_odometer?: NullableIntFieldUpdateOperationsInput | number | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fuel_used?: NullableFloatFieldUpdateOperationsInput | number | null
    trip_notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    requests?: requestsUpdateOneWithoutTripsNestedInput
    vehicles?: vehiclesUpdateOneRequiredWithoutTripsNestedInput
  }

  export type tripsUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    request_id?: NullableStringFieldUpdateOperationsInput | string | null
    vehicle_id?: StringFieldUpdateOperationsInput | string
    start_odometer?: IntFieldUpdateOperationsInput | number
    end_odometer?: NullableIntFieldUpdateOperationsInput | number | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fuel_used?: NullableFloatFieldUpdateOperationsInput | number | null
    trip_notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type tripsUncheckedUpdateManyWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    request_id?: NullableStringFieldUpdateOperationsInput | string | null
    vehicle_id?: StringFieldUpdateOperationsInput | string
    start_odometer?: IntFieldUpdateOperationsInput | number
    end_odometer?: NullableIntFieldUpdateOperationsInput | number | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fuel_used?: NullableFloatFieldUpdateOperationsInput | number | null
    trip_notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type requestsCreateManyVehiclesInput = {
    id: string
    requested_at?: Date | string
    trip_purpose: string
    start_location: string
    end_location: string
    start_date: Date | string
    end_date: Date | string
    status?: string
    reviewed_at?: Date | string | null
    comments?: string | null
    requester_id: string
    reviewed_by?: string | null
  }

  export type tripsCreateManyVehiclesInput = {
    id: string
    request_id?: string | null
    start_odometer: number
    end_odometer?: number | null
    start_time: Date | string
    end_time?: Date | string | null
    fuel_used?: number | null
    trip_notes?: string | null
    created_at?: Date | string
    driver_id: string
  }

  export type requestsUpdateWithoutVehiclesInput = {
    id?: StringFieldUpdateOperationsInput | string
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_purpose?: StringFieldUpdateOperationsInput | string
    start_location?: StringFieldUpdateOperationsInput | string
    end_location?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    users_requests_requester_idTousers?: usersUpdateOneRequiredWithoutRequests_requests_requester_idTousersNestedInput
    users_requests_reviewed_byTousers?: usersUpdateOneWithoutRequests_requests_reviewed_byTousersNestedInput
    trips?: tripsUpdateManyWithoutRequestsNestedInput
  }

  export type requestsUncheckedUpdateWithoutVehiclesInput = {
    id?: StringFieldUpdateOperationsInput | string
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_purpose?: StringFieldUpdateOperationsInput | string
    start_location?: StringFieldUpdateOperationsInput | string
    end_location?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    requester_id?: StringFieldUpdateOperationsInput | string
    reviewed_by?: NullableStringFieldUpdateOperationsInput | string | null
    trips?: tripsUncheckedUpdateManyWithoutRequestsNestedInput
  }

  export type requestsUncheckedUpdateManyWithoutVehiclesInput = {
    id?: StringFieldUpdateOperationsInput | string
    requested_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trip_purpose?: StringFieldUpdateOperationsInput | string
    start_location?: StringFieldUpdateOperationsInput | string
    end_location?: StringFieldUpdateOperationsInput | string
    start_date?: DateTimeFieldUpdateOperationsInput | Date | string
    end_date?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    comments?: NullableStringFieldUpdateOperationsInput | string | null
    requester_id?: StringFieldUpdateOperationsInput | string
    reviewed_by?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tripsUpdateWithoutVehiclesInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_odometer?: IntFieldUpdateOperationsInput | number
    end_odometer?: NullableIntFieldUpdateOperationsInput | number | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fuel_used?: NullableFloatFieldUpdateOperationsInput | number | null
    trip_notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: usersUpdateOneRequiredWithoutTripsNestedInput
    requests?: requestsUpdateOneWithoutTripsNestedInput
  }

  export type tripsUncheckedUpdateWithoutVehiclesInput = {
    id?: StringFieldUpdateOperationsInput | string
    request_id?: NullableStringFieldUpdateOperationsInput | string | null
    start_odometer?: IntFieldUpdateOperationsInput | number
    end_odometer?: NullableIntFieldUpdateOperationsInput | number | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fuel_used?: NullableFloatFieldUpdateOperationsInput | number | null
    trip_notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    driver_id?: StringFieldUpdateOperationsInput | string
  }

  export type tripsUncheckedUpdateManyWithoutVehiclesInput = {
    id?: StringFieldUpdateOperationsInput | string
    request_id?: NullableStringFieldUpdateOperationsInput | string | null
    start_odometer?: IntFieldUpdateOperationsInput | number
    end_odometer?: NullableIntFieldUpdateOperationsInput | number | null
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fuel_used?: NullableFloatFieldUpdateOperationsInput | number | null
    trip_notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    driver_id?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}