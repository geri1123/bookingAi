
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model AiSettings
 * 
 */
export type AiSettings = $Result.DefaultSelection<Prisma.$AiSettingsPayload>
/**
 * Model Conversation
 * 
 */
export type Conversation = $Result.DefaultSelection<Prisma.$ConversationPayload>
/**
 * Model BookingIntent
 * 
 */
export type BookingIntent = $Result.DefaultSelection<Prisma.$BookingIntentPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const CommunicationChannel: {
  WHATSAPP: 'WHATSAPP',
  VOICE: 'VOICE'
};

export type CommunicationChannel = (typeof CommunicationChannel)[keyof typeof CommunicationChannel]


export const ConversationStatus: {
  ACTIVE: 'ACTIVE',
  AWAITING_CONFIRMATION: 'AWAITING_CONFIRMATION',
  CLOSED: 'CLOSED'
};

export type ConversationStatus = (typeof ConversationStatus)[keyof typeof ConversationStatus]


export const BookingIntentStatus: {
  COLLECTING: 'COLLECTING',
  CONFIRMED: 'CONFIRMED',
  FAILED: 'FAILED'
};

export type BookingIntentStatus = (typeof BookingIntentStatus)[keyof typeof BookingIntentStatus]

}

export type CommunicationChannel = $Enums.CommunicationChannel

export const CommunicationChannel: typeof $Enums.CommunicationChannel

export type ConversationStatus = $Enums.ConversationStatus

export const ConversationStatus: typeof $Enums.ConversationStatus

export type BookingIntentStatus = $Enums.BookingIntentStatus

export const BookingIntentStatus: typeof $Enums.BookingIntentStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more AiSettings
 * const aiSettings = await prisma.aiSettings.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more AiSettings
   * const aiSettings = await prisma.aiSettings.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
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
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.aiSettings`: Exposes CRUD operations for the **AiSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiSettings
    * const aiSettings = await prisma.aiSettings.findMany()
    * ```
    */
  get aiSettings(): Prisma.AiSettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.conversation`: Exposes CRUD operations for the **Conversation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Conversations
    * const conversations = await prisma.conversation.findMany()
    * ```
    */
  get conversation(): Prisma.ConversationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bookingIntent`: Exposes CRUD operations for the **BookingIntent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BookingIntents
    * const bookingIntents = await prisma.bookingIntent.findMany()
    * ```
    */
  get bookingIntent(): Prisma.BookingIntentDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
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
    AiSettings: 'AiSettings',
    Conversation: 'Conversation',
    BookingIntent: 'BookingIntent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "aiSettings" | "conversation" | "bookingIntent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      AiSettings: {
        payload: Prisma.$AiSettingsPayload<ExtArgs>
        fields: Prisma.AiSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSettingsPayload>
          }
          findFirst: {
            args: Prisma.AiSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSettingsPayload>
          }
          findMany: {
            args: Prisma.AiSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSettingsPayload>[]
          }
          create: {
            args: Prisma.AiSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSettingsPayload>
          }
          createMany: {
            args: Prisma.AiSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiSettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSettingsPayload>[]
          }
          delete: {
            args: Prisma.AiSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSettingsPayload>
          }
          update: {
            args: Prisma.AiSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSettingsPayload>
          }
          deleteMany: {
            args: Prisma.AiSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiSettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSettingsPayload>[]
          }
          upsert: {
            args: Prisma.AiSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiSettingsPayload>
          }
          aggregate: {
            args: Prisma.AiSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiSettings>
          }
          groupBy: {
            args: Prisma.AiSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<AiSettingsCountAggregateOutputType> | number
          }
        }
      }
      Conversation: {
        payload: Prisma.$ConversationPayload<ExtArgs>
        fields: Prisma.ConversationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConversationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConversationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          findFirst: {
            args: Prisma.ConversationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConversationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          findMany: {
            args: Prisma.ConversationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          create: {
            args: Prisma.ConversationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          createMany: {
            args: Prisma.ConversationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConversationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          delete: {
            args: Prisma.ConversationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          update: {
            args: Prisma.ConversationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          deleteMany: {
            args: Prisma.ConversationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConversationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConversationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>[]
          }
          upsert: {
            args: Prisma.ConversationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationPayload>
          }
          aggregate: {
            args: Prisma.ConversationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConversation>
          }
          groupBy: {
            args: Prisma.ConversationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConversationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConversationCountArgs<ExtArgs>
            result: $Utils.Optional<ConversationCountAggregateOutputType> | number
          }
        }
      }
      BookingIntent: {
        payload: Prisma.$BookingIntentPayload<ExtArgs>
        fields: Prisma.BookingIntentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingIntentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingIntentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingIntentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingIntentPayload>
          }
          findFirst: {
            args: Prisma.BookingIntentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingIntentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingIntentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingIntentPayload>
          }
          findMany: {
            args: Prisma.BookingIntentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingIntentPayload>[]
          }
          create: {
            args: Prisma.BookingIntentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingIntentPayload>
          }
          createMany: {
            args: Prisma.BookingIntentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingIntentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingIntentPayload>[]
          }
          delete: {
            args: Prisma.BookingIntentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingIntentPayload>
          }
          update: {
            args: Prisma.BookingIntentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingIntentPayload>
          }
          deleteMany: {
            args: Prisma.BookingIntentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingIntentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookingIntentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingIntentPayload>[]
          }
          upsert: {
            args: Prisma.BookingIntentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingIntentPayload>
          }
          aggregate: {
            args: Prisma.BookingIntentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookingIntent>
          }
          groupBy: {
            args: Prisma.BookingIntentGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingIntentGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingIntentCountArgs<ExtArgs>
            result: $Utils.Optional<BookingIntentCountAggregateOutputType> | number
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
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
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
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
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
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    aiSettings?: AiSettingsOmit
    conversation?: ConversationOmit
    bookingIntent?: BookingIntentOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
   * Count Type ConversationCountOutputType
   */

  export type ConversationCountOutputType = {
    bookingIntents: number
  }

  export type ConversationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookingIntents?: boolean | ConversationCountOutputTypeCountBookingIntentsArgs
  }

  // Custom InputTypes
  /**
   * ConversationCountOutputType without action
   */
  export type ConversationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationCountOutputType
     */
    select?: ConversationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ConversationCountOutputType without action
   */
  export type ConversationCountOutputTypeCountBookingIntentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingIntentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model AiSettings
   */

  export type AggregateAiSettings = {
    _count: AiSettingsCountAggregateOutputType | null
    _min: AiSettingsMinAggregateOutputType | null
    _max: AiSettingsMaxAggregateOutputType | null
  }

  export type AiSettingsMinAggregateOutputType = {
    id: string | null
    businessId: string | null
    systemPrompt: string | null
    language: string | null
    isEnabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiSettingsMaxAggregateOutputType = {
    id: string | null
    businessId: string | null
    systemPrompt: string | null
    language: string | null
    isEnabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiSettingsCountAggregateOutputType = {
    id: number
    businessId: number
    systemPrompt: number
    language: number
    isEnabled: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AiSettingsMinAggregateInputType = {
    id?: true
    businessId?: true
    systemPrompt?: true
    language?: true
    isEnabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiSettingsMaxAggregateInputType = {
    id?: true
    businessId?: true
    systemPrompt?: true
    language?: true
    isEnabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiSettingsCountAggregateInputType = {
    id?: true
    businessId?: true
    systemPrompt?: true
    language?: true
    isEnabled?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AiSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiSettings to aggregate.
     */
    where?: AiSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiSettings to fetch.
     */
    orderBy?: AiSettingsOrderByWithRelationInput | AiSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiSettings
    **/
    _count?: true | AiSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiSettingsMaxAggregateInputType
  }

  export type GetAiSettingsAggregateType<T extends AiSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateAiSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiSettings[P]>
      : GetScalarType<T[P], AggregateAiSettings[P]>
  }




  export type AiSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiSettingsWhereInput
    orderBy?: AiSettingsOrderByWithAggregationInput | AiSettingsOrderByWithAggregationInput[]
    by: AiSettingsScalarFieldEnum[] | AiSettingsScalarFieldEnum
    having?: AiSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiSettingsCountAggregateInputType | true
    _min?: AiSettingsMinAggregateInputType
    _max?: AiSettingsMaxAggregateInputType
  }

  export type AiSettingsGroupByOutputType = {
    id: string
    businessId: string
    systemPrompt: string | null
    language: string | null
    isEnabled: boolean
    createdAt: Date
    updatedAt: Date
    _count: AiSettingsCountAggregateOutputType | null
    _min: AiSettingsMinAggregateOutputType | null
    _max: AiSettingsMaxAggregateOutputType | null
  }

  type GetAiSettingsGroupByPayload<T extends AiSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], AiSettingsGroupByOutputType[P]>
        }
      >
    >


  export type AiSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    systemPrompt?: boolean
    language?: boolean
    isEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiSettings"]>

  export type AiSettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    systemPrompt?: boolean
    language?: boolean
    isEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiSettings"]>

  export type AiSettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    systemPrompt?: boolean
    language?: boolean
    isEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiSettings"]>

  export type AiSettingsSelectScalar = {
    id?: boolean
    businessId?: boolean
    systemPrompt?: boolean
    language?: boolean
    isEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AiSettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "businessId" | "systemPrompt" | "language" | "isEnabled" | "createdAt" | "updatedAt", ExtArgs["result"]["aiSettings"]>

  export type $AiSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiSettings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessId: string
      systemPrompt: string | null
      language: string | null
      isEnabled: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["aiSettings"]>
    composites: {}
  }

  type AiSettingsGetPayload<S extends boolean | null | undefined | AiSettingsDefaultArgs> = $Result.GetResult<Prisma.$AiSettingsPayload, S>

  type AiSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiSettingsCountAggregateInputType | true
    }

  export interface AiSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiSettings'], meta: { name: 'AiSettings' } }
    /**
     * Find zero or one AiSettings that matches the filter.
     * @param {AiSettingsFindUniqueArgs} args - Arguments to find a AiSettings
     * @example
     * // Get one AiSettings
     * const aiSettings = await prisma.aiSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiSettingsFindUniqueArgs>(args: SelectSubset<T, AiSettingsFindUniqueArgs<ExtArgs>>): Prisma__AiSettingsClient<$Result.GetResult<Prisma.$AiSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiSettingsFindUniqueOrThrowArgs} args - Arguments to find a AiSettings
     * @example
     * // Get one AiSettings
     * const aiSettings = await prisma.aiSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, AiSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiSettingsClient<$Result.GetResult<Prisma.$AiSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSettingsFindFirstArgs} args - Arguments to find a AiSettings
     * @example
     * // Get one AiSettings
     * const aiSettings = await prisma.aiSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiSettingsFindFirstArgs>(args?: SelectSubset<T, AiSettingsFindFirstArgs<ExtArgs>>): Prisma__AiSettingsClient<$Result.GetResult<Prisma.$AiSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSettingsFindFirstOrThrowArgs} args - Arguments to find a AiSettings
     * @example
     * // Get one AiSettings
     * const aiSettings = await prisma.aiSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, AiSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiSettingsClient<$Result.GetResult<Prisma.$AiSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiSettings
     * const aiSettings = await prisma.aiSettings.findMany()
     * 
     * // Get first 10 AiSettings
     * const aiSettings = await prisma.aiSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiSettingsWithIdOnly = await prisma.aiSettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiSettingsFindManyArgs>(args?: SelectSubset<T, AiSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiSettings.
     * @param {AiSettingsCreateArgs} args - Arguments to create a AiSettings.
     * @example
     * // Create one AiSettings
     * const AiSettings = await prisma.aiSettings.create({
     *   data: {
     *     // ... data to create a AiSettings
     *   }
     * })
     * 
     */
    create<T extends AiSettingsCreateArgs>(args: SelectSubset<T, AiSettingsCreateArgs<ExtArgs>>): Prisma__AiSettingsClient<$Result.GetResult<Prisma.$AiSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiSettings.
     * @param {AiSettingsCreateManyArgs} args - Arguments to create many AiSettings.
     * @example
     * // Create many AiSettings
     * const aiSettings = await prisma.aiSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiSettingsCreateManyArgs>(args?: SelectSubset<T, AiSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiSettings and returns the data saved in the database.
     * @param {AiSettingsCreateManyAndReturnArgs} args - Arguments to create many AiSettings.
     * @example
     * // Create many AiSettings
     * const aiSettings = await prisma.aiSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiSettings and only return the `id`
     * const aiSettingsWithIdOnly = await prisma.aiSettings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiSettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, AiSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiSettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiSettings.
     * @param {AiSettingsDeleteArgs} args - Arguments to delete one AiSettings.
     * @example
     * // Delete one AiSettings
     * const AiSettings = await prisma.aiSettings.delete({
     *   where: {
     *     // ... filter to delete one AiSettings
     *   }
     * })
     * 
     */
    delete<T extends AiSettingsDeleteArgs>(args: SelectSubset<T, AiSettingsDeleteArgs<ExtArgs>>): Prisma__AiSettingsClient<$Result.GetResult<Prisma.$AiSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiSettings.
     * @param {AiSettingsUpdateArgs} args - Arguments to update one AiSettings.
     * @example
     * // Update one AiSettings
     * const aiSettings = await prisma.aiSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiSettingsUpdateArgs>(args: SelectSubset<T, AiSettingsUpdateArgs<ExtArgs>>): Prisma__AiSettingsClient<$Result.GetResult<Prisma.$AiSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiSettings.
     * @param {AiSettingsDeleteManyArgs} args - Arguments to filter AiSettings to delete.
     * @example
     * // Delete a few AiSettings
     * const { count } = await prisma.aiSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiSettingsDeleteManyArgs>(args?: SelectSubset<T, AiSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiSettings
     * const aiSettings = await prisma.aiSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiSettingsUpdateManyArgs>(args: SelectSubset<T, AiSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiSettings and returns the data updated in the database.
     * @param {AiSettingsUpdateManyAndReturnArgs} args - Arguments to update many AiSettings.
     * @example
     * // Update many AiSettings
     * const aiSettings = await prisma.aiSettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiSettings and only return the `id`
     * const aiSettingsWithIdOnly = await prisma.aiSettings.updateManyAndReturn({
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
    updateManyAndReturn<T extends AiSettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, AiSettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiSettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiSettings.
     * @param {AiSettingsUpsertArgs} args - Arguments to update or create a AiSettings.
     * @example
     * // Update or create a AiSettings
     * const aiSettings = await prisma.aiSettings.upsert({
     *   create: {
     *     // ... data to create a AiSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiSettings we want to update
     *   }
     * })
     */
    upsert<T extends AiSettingsUpsertArgs>(args: SelectSubset<T, AiSettingsUpsertArgs<ExtArgs>>): Prisma__AiSettingsClient<$Result.GetResult<Prisma.$AiSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSettingsCountArgs} args - Arguments to filter AiSettings to count.
     * @example
     * // Count the number of AiSettings
     * const count = await prisma.aiSettings.count({
     *   where: {
     *     // ... the filter for the AiSettings we want to count
     *   }
     * })
    **/
    count<T extends AiSettingsCountArgs>(
      args?: Subset<T, AiSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AiSettingsAggregateArgs>(args: Subset<T, AiSettingsAggregateArgs>): Prisma.PrismaPromise<GetAiSettingsAggregateType<T>>

    /**
     * Group by AiSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiSettingsGroupByArgs} args - Group by arguments.
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
      T extends AiSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiSettingsGroupByArgs['orderBy'] }
        : { orderBy?: AiSettingsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AiSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiSettings model
   */
  readonly fields: AiSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the AiSettings model
   */
  interface AiSettingsFieldRefs {
    readonly id: FieldRef<"AiSettings", 'String'>
    readonly businessId: FieldRef<"AiSettings", 'String'>
    readonly systemPrompt: FieldRef<"AiSettings", 'String'>
    readonly language: FieldRef<"AiSettings", 'String'>
    readonly isEnabled: FieldRef<"AiSettings", 'Boolean'>
    readonly createdAt: FieldRef<"AiSettings", 'DateTime'>
    readonly updatedAt: FieldRef<"AiSettings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiSettings findUnique
   */
  export type AiSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSettings
     */
    select?: AiSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiSettings
     */
    omit?: AiSettingsOmit<ExtArgs> | null
    /**
     * Filter, which AiSettings to fetch.
     */
    where: AiSettingsWhereUniqueInput
  }

  /**
   * AiSettings findUniqueOrThrow
   */
  export type AiSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSettings
     */
    select?: AiSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiSettings
     */
    omit?: AiSettingsOmit<ExtArgs> | null
    /**
     * Filter, which AiSettings to fetch.
     */
    where: AiSettingsWhereUniqueInput
  }

  /**
   * AiSettings findFirst
   */
  export type AiSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSettings
     */
    select?: AiSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiSettings
     */
    omit?: AiSettingsOmit<ExtArgs> | null
    /**
     * Filter, which AiSettings to fetch.
     */
    where?: AiSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiSettings to fetch.
     */
    orderBy?: AiSettingsOrderByWithRelationInput | AiSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiSettings.
     */
    cursor?: AiSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiSettings.
     */
    distinct?: AiSettingsScalarFieldEnum | AiSettingsScalarFieldEnum[]
  }

  /**
   * AiSettings findFirstOrThrow
   */
  export type AiSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSettings
     */
    select?: AiSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiSettings
     */
    omit?: AiSettingsOmit<ExtArgs> | null
    /**
     * Filter, which AiSettings to fetch.
     */
    where?: AiSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiSettings to fetch.
     */
    orderBy?: AiSettingsOrderByWithRelationInput | AiSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiSettings.
     */
    cursor?: AiSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiSettings.
     */
    distinct?: AiSettingsScalarFieldEnum | AiSettingsScalarFieldEnum[]
  }

  /**
   * AiSettings findMany
   */
  export type AiSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSettings
     */
    select?: AiSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiSettings
     */
    omit?: AiSettingsOmit<ExtArgs> | null
    /**
     * Filter, which AiSettings to fetch.
     */
    where?: AiSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiSettings to fetch.
     */
    orderBy?: AiSettingsOrderByWithRelationInput | AiSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiSettings.
     */
    cursor?: AiSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiSettings.
     */
    distinct?: AiSettingsScalarFieldEnum | AiSettingsScalarFieldEnum[]
  }

  /**
   * AiSettings create
   */
  export type AiSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSettings
     */
    select?: AiSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiSettings
     */
    omit?: AiSettingsOmit<ExtArgs> | null
    /**
     * The data needed to create a AiSettings.
     */
    data: XOR<AiSettingsCreateInput, AiSettingsUncheckedCreateInput>
  }

  /**
   * AiSettings createMany
   */
  export type AiSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiSettings.
     */
    data: AiSettingsCreateManyInput | AiSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiSettings createManyAndReturn
   */
  export type AiSettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSettings
     */
    select?: AiSettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiSettings
     */
    omit?: AiSettingsOmit<ExtArgs> | null
    /**
     * The data used to create many AiSettings.
     */
    data: AiSettingsCreateManyInput | AiSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiSettings update
   */
  export type AiSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSettings
     */
    select?: AiSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiSettings
     */
    omit?: AiSettingsOmit<ExtArgs> | null
    /**
     * The data needed to update a AiSettings.
     */
    data: XOR<AiSettingsUpdateInput, AiSettingsUncheckedUpdateInput>
    /**
     * Choose, which AiSettings to update.
     */
    where: AiSettingsWhereUniqueInput
  }

  /**
   * AiSettings updateMany
   */
  export type AiSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiSettings.
     */
    data: XOR<AiSettingsUpdateManyMutationInput, AiSettingsUncheckedUpdateManyInput>
    /**
     * Filter which AiSettings to update
     */
    where?: AiSettingsWhereInput
    /**
     * Limit how many AiSettings to update.
     */
    limit?: number
  }

  /**
   * AiSettings updateManyAndReturn
   */
  export type AiSettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSettings
     */
    select?: AiSettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiSettings
     */
    omit?: AiSettingsOmit<ExtArgs> | null
    /**
     * The data used to update AiSettings.
     */
    data: XOR<AiSettingsUpdateManyMutationInput, AiSettingsUncheckedUpdateManyInput>
    /**
     * Filter which AiSettings to update
     */
    where?: AiSettingsWhereInput
    /**
     * Limit how many AiSettings to update.
     */
    limit?: number
  }

  /**
   * AiSettings upsert
   */
  export type AiSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSettings
     */
    select?: AiSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiSettings
     */
    omit?: AiSettingsOmit<ExtArgs> | null
    /**
     * The filter to search for the AiSettings to update in case it exists.
     */
    where: AiSettingsWhereUniqueInput
    /**
     * In case the AiSettings found by the `where` argument doesn't exist, create a new AiSettings with this data.
     */
    create: XOR<AiSettingsCreateInput, AiSettingsUncheckedCreateInput>
    /**
     * In case the AiSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiSettingsUpdateInput, AiSettingsUncheckedUpdateInput>
  }

  /**
   * AiSettings delete
   */
  export type AiSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSettings
     */
    select?: AiSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiSettings
     */
    omit?: AiSettingsOmit<ExtArgs> | null
    /**
     * Filter which AiSettings to delete.
     */
    where: AiSettingsWhereUniqueInput
  }

  /**
   * AiSettings deleteMany
   */
  export type AiSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiSettings to delete
     */
    where?: AiSettingsWhereInput
    /**
     * Limit how many AiSettings to delete.
     */
    limit?: number
  }

  /**
   * AiSettings without action
   */
  export type AiSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiSettings
     */
    select?: AiSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiSettings
     */
    omit?: AiSettingsOmit<ExtArgs> | null
  }


  /**
   * Model Conversation
   */

  export type AggregateConversation = {
    _count: ConversationCountAggregateOutputType | null
    _min: ConversationMinAggregateOutputType | null
    _max: ConversationMaxAggregateOutputType | null
  }

  export type ConversationMinAggregateOutputType = {
    id: string | null
    businessId: string | null
    customerPhone: string | null
    channel: $Enums.CommunicationChannel | null
    status: $Enums.ConversationStatus | null
    handedOff: boolean | null
    lastMessageAt: Date | null
    createdAt: Date | null
  }

  export type ConversationMaxAggregateOutputType = {
    id: string | null
    businessId: string | null
    customerPhone: string | null
    channel: $Enums.CommunicationChannel | null
    status: $Enums.ConversationStatus | null
    handedOff: boolean | null
    lastMessageAt: Date | null
    createdAt: Date | null
  }

  export type ConversationCountAggregateOutputType = {
    id: number
    businessId: number
    customerPhone: number
    channel: number
    status: number
    messages: number
    handedOff: number
    lastMessageAt: number
    createdAt: number
    _all: number
  }


  export type ConversationMinAggregateInputType = {
    id?: true
    businessId?: true
    customerPhone?: true
    channel?: true
    status?: true
    handedOff?: true
    lastMessageAt?: true
    createdAt?: true
  }

  export type ConversationMaxAggregateInputType = {
    id?: true
    businessId?: true
    customerPhone?: true
    channel?: true
    status?: true
    handedOff?: true
    lastMessageAt?: true
    createdAt?: true
  }

  export type ConversationCountAggregateInputType = {
    id?: true
    businessId?: true
    customerPhone?: true
    channel?: true
    status?: true
    messages?: true
    handedOff?: true
    lastMessageAt?: true
    createdAt?: true
    _all?: true
  }

  export type ConversationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conversation to aggregate.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Conversations
    **/
    _count?: true | ConversationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConversationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConversationMaxAggregateInputType
  }

  export type GetConversationAggregateType<T extends ConversationAggregateArgs> = {
        [P in keyof T & keyof AggregateConversation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConversation[P]>
      : GetScalarType<T[P], AggregateConversation[P]>
  }




  export type ConversationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationWhereInput
    orderBy?: ConversationOrderByWithAggregationInput | ConversationOrderByWithAggregationInput[]
    by: ConversationScalarFieldEnum[] | ConversationScalarFieldEnum
    having?: ConversationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConversationCountAggregateInputType | true
    _min?: ConversationMinAggregateInputType
    _max?: ConversationMaxAggregateInputType
  }

  export type ConversationGroupByOutputType = {
    id: string
    businessId: string
    customerPhone: string
    channel: $Enums.CommunicationChannel
    status: $Enums.ConversationStatus
    messages: JsonValue
    handedOff: boolean
    lastMessageAt: Date
    createdAt: Date
    _count: ConversationCountAggregateOutputType | null
    _min: ConversationMinAggregateOutputType | null
    _max: ConversationMaxAggregateOutputType | null
  }

  type GetConversationGroupByPayload<T extends ConversationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConversationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConversationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConversationGroupByOutputType[P]>
            : GetScalarType<T[P], ConversationGroupByOutputType[P]>
        }
      >
    >


  export type ConversationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    customerPhone?: boolean
    channel?: boolean
    status?: boolean
    messages?: boolean
    handedOff?: boolean
    lastMessageAt?: boolean
    createdAt?: boolean
    bookingIntents?: boolean | Conversation$bookingIntentsArgs<ExtArgs>
    _count?: boolean | ConversationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    customerPhone?: boolean
    channel?: boolean
    status?: boolean
    messages?: boolean
    handedOff?: boolean
    lastMessageAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    customerPhone?: boolean
    channel?: boolean
    status?: boolean
    messages?: boolean
    handedOff?: boolean
    lastMessageAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["conversation"]>

  export type ConversationSelectScalar = {
    id?: boolean
    businessId?: boolean
    customerPhone?: boolean
    channel?: boolean
    status?: boolean
    messages?: boolean
    handedOff?: boolean
    lastMessageAt?: boolean
    createdAt?: boolean
  }

  export type ConversationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "businessId" | "customerPhone" | "channel" | "status" | "messages" | "handedOff" | "lastMessageAt" | "createdAt", ExtArgs["result"]["conversation"]>
  export type ConversationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookingIntents?: boolean | Conversation$bookingIntentsArgs<ExtArgs>
    _count?: boolean | ConversationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ConversationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ConversationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ConversationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Conversation"
    objects: {
      bookingIntents: Prisma.$BookingIntentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessId: string
      customerPhone: string
      channel: $Enums.CommunicationChannel
      status: $Enums.ConversationStatus
      messages: Prisma.JsonValue
      handedOff: boolean
      lastMessageAt: Date
      createdAt: Date
    }, ExtArgs["result"]["conversation"]>
    composites: {}
  }

  type ConversationGetPayload<S extends boolean | null | undefined | ConversationDefaultArgs> = $Result.GetResult<Prisma.$ConversationPayload, S>

  type ConversationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConversationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConversationCountAggregateInputType | true
    }

  export interface ConversationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Conversation'], meta: { name: 'Conversation' } }
    /**
     * Find zero or one Conversation that matches the filter.
     * @param {ConversationFindUniqueArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConversationFindUniqueArgs>(args: SelectSubset<T, ConversationFindUniqueArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Conversation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConversationFindUniqueOrThrowArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConversationFindUniqueOrThrowArgs>(args: SelectSubset<T, ConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Conversation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindFirstArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConversationFindFirstArgs>(args?: SelectSubset<T, ConversationFindFirstArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Conversation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindFirstOrThrowArgs} args - Arguments to find a Conversation
     * @example
     * // Get one Conversation
     * const conversation = await prisma.conversation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConversationFindFirstOrThrowArgs>(args?: SelectSubset<T, ConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Conversations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Conversations
     * const conversations = await prisma.conversation.findMany()
     * 
     * // Get first 10 Conversations
     * const conversations = await prisma.conversation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conversationWithIdOnly = await prisma.conversation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConversationFindManyArgs>(args?: SelectSubset<T, ConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Conversation.
     * @param {ConversationCreateArgs} args - Arguments to create a Conversation.
     * @example
     * // Create one Conversation
     * const Conversation = await prisma.conversation.create({
     *   data: {
     *     // ... data to create a Conversation
     *   }
     * })
     * 
     */
    create<T extends ConversationCreateArgs>(args: SelectSubset<T, ConversationCreateArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Conversations.
     * @param {ConversationCreateManyArgs} args - Arguments to create many Conversations.
     * @example
     * // Create many Conversations
     * const conversation = await prisma.conversation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConversationCreateManyArgs>(args?: SelectSubset<T, ConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Conversations and returns the data saved in the database.
     * @param {ConversationCreateManyAndReturnArgs} args - Arguments to create many Conversations.
     * @example
     * // Create many Conversations
     * const conversation = await prisma.conversation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Conversations and only return the `id`
     * const conversationWithIdOnly = await prisma.conversation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConversationCreateManyAndReturnArgs>(args?: SelectSubset<T, ConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Conversation.
     * @param {ConversationDeleteArgs} args - Arguments to delete one Conversation.
     * @example
     * // Delete one Conversation
     * const Conversation = await prisma.conversation.delete({
     *   where: {
     *     // ... filter to delete one Conversation
     *   }
     * })
     * 
     */
    delete<T extends ConversationDeleteArgs>(args: SelectSubset<T, ConversationDeleteArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Conversation.
     * @param {ConversationUpdateArgs} args - Arguments to update one Conversation.
     * @example
     * // Update one Conversation
     * const conversation = await prisma.conversation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConversationUpdateArgs>(args: SelectSubset<T, ConversationUpdateArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Conversations.
     * @param {ConversationDeleteManyArgs} args - Arguments to filter Conversations to delete.
     * @example
     * // Delete a few Conversations
     * const { count } = await prisma.conversation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConversationDeleteManyArgs>(args?: SelectSubset<T, ConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Conversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Conversations
     * const conversation = await prisma.conversation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConversationUpdateManyArgs>(args: SelectSubset<T, ConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Conversations and returns the data updated in the database.
     * @param {ConversationUpdateManyAndReturnArgs} args - Arguments to update many Conversations.
     * @example
     * // Update many Conversations
     * const conversation = await prisma.conversation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Conversations and only return the `id`
     * const conversationWithIdOnly = await prisma.conversation.updateManyAndReturn({
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
    updateManyAndReturn<T extends ConversationUpdateManyAndReturnArgs>(args: SelectSubset<T, ConversationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Conversation.
     * @param {ConversationUpsertArgs} args - Arguments to update or create a Conversation.
     * @example
     * // Update or create a Conversation
     * const conversation = await prisma.conversation.upsert({
     *   create: {
     *     // ... data to create a Conversation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Conversation we want to update
     *   }
     * })
     */
    upsert<T extends ConversationUpsertArgs>(args: SelectSubset<T, ConversationUpsertArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Conversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationCountArgs} args - Arguments to filter Conversations to count.
     * @example
     * // Count the number of Conversations
     * const count = await prisma.conversation.count({
     *   where: {
     *     // ... the filter for the Conversations we want to count
     *   }
     * })
    **/
    count<T extends ConversationCountArgs>(
      args?: Subset<T, ConversationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConversationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Conversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ConversationAggregateArgs>(args: Subset<T, ConversationAggregateArgs>): Prisma.PrismaPromise<GetConversationAggregateType<T>>

    /**
     * Group by Conversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationGroupByArgs} args - Group by arguments.
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
      T extends ConversationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConversationGroupByArgs['orderBy'] }
        : { orderBy?: ConversationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Conversation model
   */
  readonly fields: ConversationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Conversation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConversationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bookingIntents<T extends Conversation$bookingIntentsArgs<ExtArgs> = {}>(args?: Subset<T, Conversation$bookingIntentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingIntentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Conversation model
   */
  interface ConversationFieldRefs {
    readonly id: FieldRef<"Conversation", 'String'>
    readonly businessId: FieldRef<"Conversation", 'String'>
    readonly customerPhone: FieldRef<"Conversation", 'String'>
    readonly channel: FieldRef<"Conversation", 'CommunicationChannel'>
    readonly status: FieldRef<"Conversation", 'ConversationStatus'>
    readonly messages: FieldRef<"Conversation", 'Json'>
    readonly handedOff: FieldRef<"Conversation", 'Boolean'>
    readonly lastMessageAt: FieldRef<"Conversation", 'DateTime'>
    readonly createdAt: FieldRef<"Conversation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Conversation findUnique
   */
  export type ConversationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation findUniqueOrThrow
   */
  export type ConversationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation findFirst
   */
  export type ConversationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation findFirstOrThrow
   */
  export type ConversationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversation to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation findMany
   */
  export type ConversationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter, which Conversations to fetch.
     */
    where?: ConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Conversations to fetch.
     */
    orderBy?: ConversationOrderByWithRelationInput | ConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Conversations.
     */
    cursor?: ConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Conversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Conversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Conversations.
     */
    distinct?: ConversationScalarFieldEnum | ConversationScalarFieldEnum[]
  }

  /**
   * Conversation create
   */
  export type ConversationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The data needed to create a Conversation.
     */
    data: XOR<ConversationCreateInput, ConversationUncheckedCreateInput>
  }

  /**
   * Conversation createMany
   */
  export type ConversationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Conversations.
     */
    data: ConversationCreateManyInput | ConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Conversation createManyAndReturn
   */
  export type ConversationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * The data used to create many Conversations.
     */
    data: ConversationCreateManyInput | ConversationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Conversation update
   */
  export type ConversationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The data needed to update a Conversation.
     */
    data: XOR<ConversationUpdateInput, ConversationUncheckedUpdateInput>
    /**
     * Choose, which Conversation to update.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation updateMany
   */
  export type ConversationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Conversations.
     */
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyInput>
    /**
     * Filter which Conversations to update
     */
    where?: ConversationWhereInput
    /**
     * Limit how many Conversations to update.
     */
    limit?: number
  }

  /**
   * Conversation updateManyAndReturn
   */
  export type ConversationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * The data used to update Conversations.
     */
    data: XOR<ConversationUpdateManyMutationInput, ConversationUncheckedUpdateManyInput>
    /**
     * Filter which Conversations to update
     */
    where?: ConversationWhereInput
    /**
     * Limit how many Conversations to update.
     */
    limit?: number
  }

  /**
   * Conversation upsert
   */
  export type ConversationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * The filter to search for the Conversation to update in case it exists.
     */
    where: ConversationWhereUniqueInput
    /**
     * In case the Conversation found by the `where` argument doesn't exist, create a new Conversation with this data.
     */
    create: XOR<ConversationCreateInput, ConversationUncheckedCreateInput>
    /**
     * In case the Conversation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConversationUpdateInput, ConversationUncheckedUpdateInput>
  }

  /**
   * Conversation delete
   */
  export type ConversationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
    /**
     * Filter which Conversation to delete.
     */
    where: ConversationWhereUniqueInput
  }

  /**
   * Conversation deleteMany
   */
  export type ConversationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Conversations to delete
     */
    where?: ConversationWhereInput
    /**
     * Limit how many Conversations to delete.
     */
    limit?: number
  }

  /**
   * Conversation.bookingIntents
   */
  export type Conversation$bookingIntentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingIntent
     */
    select?: BookingIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingIntent
     */
    omit?: BookingIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIntentInclude<ExtArgs> | null
    where?: BookingIntentWhereInput
    orderBy?: BookingIntentOrderByWithRelationInput | BookingIntentOrderByWithRelationInput[]
    cursor?: BookingIntentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingIntentScalarFieldEnum | BookingIntentScalarFieldEnum[]
  }

  /**
   * Conversation without action
   */
  export type ConversationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Conversation
     */
    select?: ConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Conversation
     */
    omit?: ConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationInclude<ExtArgs> | null
  }


  /**
   * Model BookingIntent
   */

  export type AggregateBookingIntent = {
    _count: BookingIntentCountAggregateOutputType | null
    _min: BookingIntentMinAggregateOutputType | null
    _max: BookingIntentMaxAggregateOutputType | null
  }

  export type BookingIntentMinAggregateOutputType = {
    id: string | null
    conversationId: string | null
    businessId: string | null
    status: $Enums.BookingIntentStatus | null
    reservationId: string | null
    failureReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookingIntentMaxAggregateOutputType = {
    id: string | null
    conversationId: string | null
    businessId: string | null
    status: $Enums.BookingIntentStatus | null
    reservationId: string | null
    failureReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BookingIntentCountAggregateOutputType = {
    id: number
    conversationId: number
    businessId: number
    status: number
    payload: number
    reservationId: number
    failureReason: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BookingIntentMinAggregateInputType = {
    id?: true
    conversationId?: true
    businessId?: true
    status?: true
    reservationId?: true
    failureReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookingIntentMaxAggregateInputType = {
    id?: true
    conversationId?: true
    businessId?: true
    status?: true
    reservationId?: true
    failureReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BookingIntentCountAggregateInputType = {
    id?: true
    conversationId?: true
    businessId?: true
    status?: true
    payload?: true
    reservationId?: true
    failureReason?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BookingIntentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingIntent to aggregate.
     */
    where?: BookingIntentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingIntents to fetch.
     */
    orderBy?: BookingIntentOrderByWithRelationInput | BookingIntentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingIntentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingIntents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingIntents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BookingIntents
    **/
    _count?: true | BookingIntentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingIntentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingIntentMaxAggregateInputType
  }

  export type GetBookingIntentAggregateType<T extends BookingIntentAggregateArgs> = {
        [P in keyof T & keyof AggregateBookingIntent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookingIntent[P]>
      : GetScalarType<T[P], AggregateBookingIntent[P]>
  }




  export type BookingIntentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingIntentWhereInput
    orderBy?: BookingIntentOrderByWithAggregationInput | BookingIntentOrderByWithAggregationInput[]
    by: BookingIntentScalarFieldEnum[] | BookingIntentScalarFieldEnum
    having?: BookingIntentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingIntentCountAggregateInputType | true
    _min?: BookingIntentMinAggregateInputType
    _max?: BookingIntentMaxAggregateInputType
  }

  export type BookingIntentGroupByOutputType = {
    id: string
    conversationId: string
    businessId: string
    status: $Enums.BookingIntentStatus
    payload: JsonValue
    reservationId: string | null
    failureReason: string | null
    createdAt: Date
    updatedAt: Date
    _count: BookingIntentCountAggregateOutputType | null
    _min: BookingIntentMinAggregateOutputType | null
    _max: BookingIntentMaxAggregateOutputType | null
  }

  type GetBookingIntentGroupByPayload<T extends BookingIntentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingIntentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingIntentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingIntentGroupByOutputType[P]>
            : GetScalarType<T[P], BookingIntentGroupByOutputType[P]>
        }
      >
    >


  export type BookingIntentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    businessId?: boolean
    status?: boolean
    payload?: boolean
    reservationId?: boolean
    failureReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingIntent"]>

  export type BookingIntentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    businessId?: boolean
    status?: boolean
    payload?: boolean
    reservationId?: boolean
    failureReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingIntent"]>

  export type BookingIntentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    conversationId?: boolean
    businessId?: boolean
    status?: boolean
    payload?: boolean
    reservationId?: boolean
    failureReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingIntent"]>

  export type BookingIntentSelectScalar = {
    id?: boolean
    conversationId?: boolean
    businessId?: boolean
    status?: boolean
    payload?: boolean
    reservationId?: boolean
    failureReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BookingIntentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "conversationId" | "businessId" | "status" | "payload" | "reservationId" | "failureReason" | "createdAt" | "updatedAt", ExtArgs["result"]["bookingIntent"]>
  export type BookingIntentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }
  export type BookingIntentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }
  export type BookingIntentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    conversation?: boolean | ConversationDefaultArgs<ExtArgs>
  }

  export type $BookingIntentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BookingIntent"
    objects: {
      conversation: Prisma.$ConversationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      conversationId: string
      businessId: string
      status: $Enums.BookingIntentStatus
      payload: Prisma.JsonValue
      reservationId: string | null
      failureReason: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["bookingIntent"]>
    composites: {}
  }

  type BookingIntentGetPayload<S extends boolean | null | undefined | BookingIntentDefaultArgs> = $Result.GetResult<Prisma.$BookingIntentPayload, S>

  type BookingIntentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookingIntentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookingIntentCountAggregateInputType | true
    }

  export interface BookingIntentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BookingIntent'], meta: { name: 'BookingIntent' } }
    /**
     * Find zero or one BookingIntent that matches the filter.
     * @param {BookingIntentFindUniqueArgs} args - Arguments to find a BookingIntent
     * @example
     * // Get one BookingIntent
     * const bookingIntent = await prisma.bookingIntent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingIntentFindUniqueArgs>(args: SelectSubset<T, BookingIntentFindUniqueArgs<ExtArgs>>): Prisma__BookingIntentClient<$Result.GetResult<Prisma.$BookingIntentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BookingIntent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookingIntentFindUniqueOrThrowArgs} args - Arguments to find a BookingIntent
     * @example
     * // Get one BookingIntent
     * const bookingIntent = await prisma.bookingIntent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingIntentFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingIntentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingIntentClient<$Result.GetResult<Prisma.$BookingIntentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BookingIntent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingIntentFindFirstArgs} args - Arguments to find a BookingIntent
     * @example
     * // Get one BookingIntent
     * const bookingIntent = await prisma.bookingIntent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingIntentFindFirstArgs>(args?: SelectSubset<T, BookingIntentFindFirstArgs<ExtArgs>>): Prisma__BookingIntentClient<$Result.GetResult<Prisma.$BookingIntentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BookingIntent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingIntentFindFirstOrThrowArgs} args - Arguments to find a BookingIntent
     * @example
     * // Get one BookingIntent
     * const bookingIntent = await prisma.bookingIntent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingIntentFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingIntentFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingIntentClient<$Result.GetResult<Prisma.$BookingIntentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BookingIntents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingIntentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BookingIntents
     * const bookingIntents = await prisma.bookingIntent.findMany()
     * 
     * // Get first 10 BookingIntents
     * const bookingIntents = await prisma.bookingIntent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingIntentWithIdOnly = await prisma.bookingIntent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingIntentFindManyArgs>(args?: SelectSubset<T, BookingIntentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingIntentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BookingIntent.
     * @param {BookingIntentCreateArgs} args - Arguments to create a BookingIntent.
     * @example
     * // Create one BookingIntent
     * const BookingIntent = await prisma.bookingIntent.create({
     *   data: {
     *     // ... data to create a BookingIntent
     *   }
     * })
     * 
     */
    create<T extends BookingIntentCreateArgs>(args: SelectSubset<T, BookingIntentCreateArgs<ExtArgs>>): Prisma__BookingIntentClient<$Result.GetResult<Prisma.$BookingIntentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BookingIntents.
     * @param {BookingIntentCreateManyArgs} args - Arguments to create many BookingIntents.
     * @example
     * // Create many BookingIntents
     * const bookingIntent = await prisma.bookingIntent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingIntentCreateManyArgs>(args?: SelectSubset<T, BookingIntentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BookingIntents and returns the data saved in the database.
     * @param {BookingIntentCreateManyAndReturnArgs} args - Arguments to create many BookingIntents.
     * @example
     * // Create many BookingIntents
     * const bookingIntent = await prisma.bookingIntent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BookingIntents and only return the `id`
     * const bookingIntentWithIdOnly = await prisma.bookingIntent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingIntentCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingIntentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingIntentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BookingIntent.
     * @param {BookingIntentDeleteArgs} args - Arguments to delete one BookingIntent.
     * @example
     * // Delete one BookingIntent
     * const BookingIntent = await prisma.bookingIntent.delete({
     *   where: {
     *     // ... filter to delete one BookingIntent
     *   }
     * })
     * 
     */
    delete<T extends BookingIntentDeleteArgs>(args: SelectSubset<T, BookingIntentDeleteArgs<ExtArgs>>): Prisma__BookingIntentClient<$Result.GetResult<Prisma.$BookingIntentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BookingIntent.
     * @param {BookingIntentUpdateArgs} args - Arguments to update one BookingIntent.
     * @example
     * // Update one BookingIntent
     * const bookingIntent = await prisma.bookingIntent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingIntentUpdateArgs>(args: SelectSubset<T, BookingIntentUpdateArgs<ExtArgs>>): Prisma__BookingIntentClient<$Result.GetResult<Prisma.$BookingIntentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BookingIntents.
     * @param {BookingIntentDeleteManyArgs} args - Arguments to filter BookingIntents to delete.
     * @example
     * // Delete a few BookingIntents
     * const { count } = await prisma.bookingIntent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingIntentDeleteManyArgs>(args?: SelectSubset<T, BookingIntentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookingIntents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingIntentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BookingIntents
     * const bookingIntent = await prisma.bookingIntent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingIntentUpdateManyArgs>(args: SelectSubset<T, BookingIntentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookingIntents and returns the data updated in the database.
     * @param {BookingIntentUpdateManyAndReturnArgs} args - Arguments to update many BookingIntents.
     * @example
     * // Update many BookingIntents
     * const bookingIntent = await prisma.bookingIntent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BookingIntents and only return the `id`
     * const bookingIntentWithIdOnly = await prisma.bookingIntent.updateManyAndReturn({
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
    updateManyAndReturn<T extends BookingIntentUpdateManyAndReturnArgs>(args: SelectSubset<T, BookingIntentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingIntentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BookingIntent.
     * @param {BookingIntentUpsertArgs} args - Arguments to update or create a BookingIntent.
     * @example
     * // Update or create a BookingIntent
     * const bookingIntent = await prisma.bookingIntent.upsert({
     *   create: {
     *     // ... data to create a BookingIntent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BookingIntent we want to update
     *   }
     * })
     */
    upsert<T extends BookingIntentUpsertArgs>(args: SelectSubset<T, BookingIntentUpsertArgs<ExtArgs>>): Prisma__BookingIntentClient<$Result.GetResult<Prisma.$BookingIntentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BookingIntents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingIntentCountArgs} args - Arguments to filter BookingIntents to count.
     * @example
     * // Count the number of BookingIntents
     * const count = await prisma.bookingIntent.count({
     *   where: {
     *     // ... the filter for the BookingIntents we want to count
     *   }
     * })
    **/
    count<T extends BookingIntentCountArgs>(
      args?: Subset<T, BookingIntentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingIntentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BookingIntent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingIntentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BookingIntentAggregateArgs>(args: Subset<T, BookingIntentAggregateArgs>): Prisma.PrismaPromise<GetBookingIntentAggregateType<T>>

    /**
     * Group by BookingIntent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingIntentGroupByArgs} args - Group by arguments.
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
      T extends BookingIntentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingIntentGroupByArgs['orderBy'] }
        : { orderBy?: BookingIntentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BookingIntentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingIntentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BookingIntent model
   */
  readonly fields: BookingIntentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BookingIntent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingIntentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    conversation<T extends ConversationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConversationDefaultArgs<ExtArgs>>): Prisma__ConversationClient<$Result.GetResult<Prisma.$ConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the BookingIntent model
   */
  interface BookingIntentFieldRefs {
    readonly id: FieldRef<"BookingIntent", 'String'>
    readonly conversationId: FieldRef<"BookingIntent", 'String'>
    readonly businessId: FieldRef<"BookingIntent", 'String'>
    readonly status: FieldRef<"BookingIntent", 'BookingIntentStatus'>
    readonly payload: FieldRef<"BookingIntent", 'Json'>
    readonly reservationId: FieldRef<"BookingIntent", 'String'>
    readonly failureReason: FieldRef<"BookingIntent", 'String'>
    readonly createdAt: FieldRef<"BookingIntent", 'DateTime'>
    readonly updatedAt: FieldRef<"BookingIntent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BookingIntent findUnique
   */
  export type BookingIntentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingIntent
     */
    select?: BookingIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingIntent
     */
    omit?: BookingIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIntentInclude<ExtArgs> | null
    /**
     * Filter, which BookingIntent to fetch.
     */
    where: BookingIntentWhereUniqueInput
  }

  /**
   * BookingIntent findUniqueOrThrow
   */
  export type BookingIntentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingIntent
     */
    select?: BookingIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingIntent
     */
    omit?: BookingIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIntentInclude<ExtArgs> | null
    /**
     * Filter, which BookingIntent to fetch.
     */
    where: BookingIntentWhereUniqueInput
  }

  /**
   * BookingIntent findFirst
   */
  export type BookingIntentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingIntent
     */
    select?: BookingIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingIntent
     */
    omit?: BookingIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIntentInclude<ExtArgs> | null
    /**
     * Filter, which BookingIntent to fetch.
     */
    where?: BookingIntentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingIntents to fetch.
     */
    orderBy?: BookingIntentOrderByWithRelationInput | BookingIntentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingIntents.
     */
    cursor?: BookingIntentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingIntents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingIntents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingIntents.
     */
    distinct?: BookingIntentScalarFieldEnum | BookingIntentScalarFieldEnum[]
  }

  /**
   * BookingIntent findFirstOrThrow
   */
  export type BookingIntentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingIntent
     */
    select?: BookingIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingIntent
     */
    omit?: BookingIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIntentInclude<ExtArgs> | null
    /**
     * Filter, which BookingIntent to fetch.
     */
    where?: BookingIntentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingIntents to fetch.
     */
    orderBy?: BookingIntentOrderByWithRelationInput | BookingIntentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingIntents.
     */
    cursor?: BookingIntentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingIntents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingIntents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingIntents.
     */
    distinct?: BookingIntentScalarFieldEnum | BookingIntentScalarFieldEnum[]
  }

  /**
   * BookingIntent findMany
   */
  export type BookingIntentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingIntent
     */
    select?: BookingIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingIntent
     */
    omit?: BookingIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIntentInclude<ExtArgs> | null
    /**
     * Filter, which BookingIntents to fetch.
     */
    where?: BookingIntentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingIntents to fetch.
     */
    orderBy?: BookingIntentOrderByWithRelationInput | BookingIntentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BookingIntents.
     */
    cursor?: BookingIntentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingIntents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingIntents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingIntents.
     */
    distinct?: BookingIntentScalarFieldEnum | BookingIntentScalarFieldEnum[]
  }

  /**
   * BookingIntent create
   */
  export type BookingIntentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingIntent
     */
    select?: BookingIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingIntent
     */
    omit?: BookingIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIntentInclude<ExtArgs> | null
    /**
     * The data needed to create a BookingIntent.
     */
    data: XOR<BookingIntentCreateInput, BookingIntentUncheckedCreateInput>
  }

  /**
   * BookingIntent createMany
   */
  export type BookingIntentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BookingIntents.
     */
    data: BookingIntentCreateManyInput | BookingIntentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BookingIntent createManyAndReturn
   */
  export type BookingIntentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingIntent
     */
    select?: BookingIntentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BookingIntent
     */
    omit?: BookingIntentOmit<ExtArgs> | null
    /**
     * The data used to create many BookingIntents.
     */
    data: BookingIntentCreateManyInput | BookingIntentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIntentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookingIntent update
   */
  export type BookingIntentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingIntent
     */
    select?: BookingIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingIntent
     */
    omit?: BookingIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIntentInclude<ExtArgs> | null
    /**
     * The data needed to update a BookingIntent.
     */
    data: XOR<BookingIntentUpdateInput, BookingIntentUncheckedUpdateInput>
    /**
     * Choose, which BookingIntent to update.
     */
    where: BookingIntentWhereUniqueInput
  }

  /**
   * BookingIntent updateMany
   */
  export type BookingIntentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BookingIntents.
     */
    data: XOR<BookingIntentUpdateManyMutationInput, BookingIntentUncheckedUpdateManyInput>
    /**
     * Filter which BookingIntents to update
     */
    where?: BookingIntentWhereInput
    /**
     * Limit how many BookingIntents to update.
     */
    limit?: number
  }

  /**
   * BookingIntent updateManyAndReturn
   */
  export type BookingIntentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingIntent
     */
    select?: BookingIntentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BookingIntent
     */
    omit?: BookingIntentOmit<ExtArgs> | null
    /**
     * The data used to update BookingIntents.
     */
    data: XOR<BookingIntentUpdateManyMutationInput, BookingIntentUncheckedUpdateManyInput>
    /**
     * Filter which BookingIntents to update
     */
    where?: BookingIntentWhereInput
    /**
     * Limit how many BookingIntents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIntentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookingIntent upsert
   */
  export type BookingIntentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingIntent
     */
    select?: BookingIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingIntent
     */
    omit?: BookingIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIntentInclude<ExtArgs> | null
    /**
     * The filter to search for the BookingIntent to update in case it exists.
     */
    where: BookingIntentWhereUniqueInput
    /**
     * In case the BookingIntent found by the `where` argument doesn't exist, create a new BookingIntent with this data.
     */
    create: XOR<BookingIntentCreateInput, BookingIntentUncheckedCreateInput>
    /**
     * In case the BookingIntent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingIntentUpdateInput, BookingIntentUncheckedUpdateInput>
  }

  /**
   * BookingIntent delete
   */
  export type BookingIntentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingIntent
     */
    select?: BookingIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingIntent
     */
    omit?: BookingIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIntentInclude<ExtArgs> | null
    /**
     * Filter which BookingIntent to delete.
     */
    where: BookingIntentWhereUniqueInput
  }

  /**
   * BookingIntent deleteMany
   */
  export type BookingIntentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingIntents to delete
     */
    where?: BookingIntentWhereInput
    /**
     * Limit how many BookingIntents to delete.
     */
    limit?: number
  }

  /**
   * BookingIntent without action
   */
  export type BookingIntentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingIntent
     */
    select?: BookingIntentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingIntent
     */
    omit?: BookingIntentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIntentInclude<ExtArgs> | null
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


  export const AiSettingsScalarFieldEnum: {
    id: 'id',
    businessId: 'businessId',
    systemPrompt: 'systemPrompt',
    language: 'language',
    isEnabled: 'isEnabled',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AiSettingsScalarFieldEnum = (typeof AiSettingsScalarFieldEnum)[keyof typeof AiSettingsScalarFieldEnum]


  export const ConversationScalarFieldEnum: {
    id: 'id',
    businessId: 'businessId',
    customerPhone: 'customerPhone',
    channel: 'channel',
    status: 'status',
    messages: 'messages',
    handedOff: 'handedOff',
    lastMessageAt: 'lastMessageAt',
    createdAt: 'createdAt'
  };

  export type ConversationScalarFieldEnum = (typeof ConversationScalarFieldEnum)[keyof typeof ConversationScalarFieldEnum]


  export const BookingIntentScalarFieldEnum: {
    id: 'id',
    conversationId: 'conversationId',
    businessId: 'businessId',
    status: 'status',
    payload: 'payload',
    reservationId: 'reservationId',
    failureReason: 'failureReason',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BookingIntentScalarFieldEnum = (typeof BookingIntentScalarFieldEnum)[keyof typeof BookingIntentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'CommunicationChannel'
   */
  export type EnumCommunicationChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CommunicationChannel'>
    


  /**
   * Reference to a field of type 'CommunicationChannel[]'
   */
  export type ListEnumCommunicationChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CommunicationChannel[]'>
    


  /**
   * Reference to a field of type 'ConversationStatus'
   */
  export type EnumConversationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationStatus'>
    


  /**
   * Reference to a field of type 'ConversationStatus[]'
   */
  export type ListEnumConversationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConversationStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'BookingIntentStatus'
   */
  export type EnumBookingIntentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingIntentStatus'>
    


  /**
   * Reference to a field of type 'BookingIntentStatus[]'
   */
  export type ListEnumBookingIntentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingIntentStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type AiSettingsWhereInput = {
    AND?: AiSettingsWhereInput | AiSettingsWhereInput[]
    OR?: AiSettingsWhereInput[]
    NOT?: AiSettingsWhereInput | AiSettingsWhereInput[]
    id?: StringFilter<"AiSettings"> | string
    businessId?: StringFilter<"AiSettings"> | string
    systemPrompt?: StringNullableFilter<"AiSettings"> | string | null
    language?: StringNullableFilter<"AiSettings"> | string | null
    isEnabled?: BoolFilter<"AiSettings"> | boolean
    createdAt?: DateTimeFilter<"AiSettings"> | Date | string
    updatedAt?: DateTimeFilter<"AiSettings"> | Date | string
  }

  export type AiSettingsOrderByWithRelationInput = {
    id?: SortOrder
    businessId?: SortOrder
    systemPrompt?: SortOrderInput | SortOrder
    language?: SortOrderInput | SortOrder
    isEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    businessId?: string
    AND?: AiSettingsWhereInput | AiSettingsWhereInput[]
    OR?: AiSettingsWhereInput[]
    NOT?: AiSettingsWhereInput | AiSettingsWhereInput[]
    systemPrompt?: StringNullableFilter<"AiSettings"> | string | null
    language?: StringNullableFilter<"AiSettings"> | string | null
    isEnabled?: BoolFilter<"AiSettings"> | boolean
    createdAt?: DateTimeFilter<"AiSettings"> | Date | string
    updatedAt?: DateTimeFilter<"AiSettings"> | Date | string
  }, "id" | "businessId">

  export type AiSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    businessId?: SortOrder
    systemPrompt?: SortOrderInput | SortOrder
    language?: SortOrderInput | SortOrder
    isEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AiSettingsCountOrderByAggregateInput
    _max?: AiSettingsMaxOrderByAggregateInput
    _min?: AiSettingsMinOrderByAggregateInput
  }

  export type AiSettingsScalarWhereWithAggregatesInput = {
    AND?: AiSettingsScalarWhereWithAggregatesInput | AiSettingsScalarWhereWithAggregatesInput[]
    OR?: AiSettingsScalarWhereWithAggregatesInput[]
    NOT?: AiSettingsScalarWhereWithAggregatesInput | AiSettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiSettings"> | string
    businessId?: StringWithAggregatesFilter<"AiSettings"> | string
    systemPrompt?: StringNullableWithAggregatesFilter<"AiSettings"> | string | null
    language?: StringNullableWithAggregatesFilter<"AiSettings"> | string | null
    isEnabled?: BoolWithAggregatesFilter<"AiSettings"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"AiSettings"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AiSettings"> | Date | string
  }

  export type ConversationWhereInput = {
    AND?: ConversationWhereInput | ConversationWhereInput[]
    OR?: ConversationWhereInput[]
    NOT?: ConversationWhereInput | ConversationWhereInput[]
    id?: StringFilter<"Conversation"> | string
    businessId?: StringFilter<"Conversation"> | string
    customerPhone?: StringFilter<"Conversation"> | string
    channel?: EnumCommunicationChannelFilter<"Conversation"> | $Enums.CommunicationChannel
    status?: EnumConversationStatusFilter<"Conversation"> | $Enums.ConversationStatus
    messages?: JsonFilter<"Conversation">
    handedOff?: BoolFilter<"Conversation"> | boolean
    lastMessageAt?: DateTimeFilter<"Conversation"> | Date | string
    createdAt?: DateTimeFilter<"Conversation"> | Date | string
    bookingIntents?: BookingIntentListRelationFilter
  }

  export type ConversationOrderByWithRelationInput = {
    id?: SortOrder
    businessId?: SortOrder
    customerPhone?: SortOrder
    channel?: SortOrder
    status?: SortOrder
    messages?: SortOrder
    handedOff?: SortOrder
    lastMessageAt?: SortOrder
    createdAt?: SortOrder
    bookingIntents?: BookingIntentOrderByRelationAggregateInput
  }

  export type ConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    businessId_customerPhone?: ConversationBusinessIdCustomerPhoneCompoundUniqueInput
    AND?: ConversationWhereInput | ConversationWhereInput[]
    OR?: ConversationWhereInput[]
    NOT?: ConversationWhereInput | ConversationWhereInput[]
    businessId?: StringFilter<"Conversation"> | string
    customerPhone?: StringFilter<"Conversation"> | string
    channel?: EnumCommunicationChannelFilter<"Conversation"> | $Enums.CommunicationChannel
    status?: EnumConversationStatusFilter<"Conversation"> | $Enums.ConversationStatus
    messages?: JsonFilter<"Conversation">
    handedOff?: BoolFilter<"Conversation"> | boolean
    lastMessageAt?: DateTimeFilter<"Conversation"> | Date | string
    createdAt?: DateTimeFilter<"Conversation"> | Date | string
    bookingIntents?: BookingIntentListRelationFilter
  }, "id" | "businessId_customerPhone">

  export type ConversationOrderByWithAggregationInput = {
    id?: SortOrder
    businessId?: SortOrder
    customerPhone?: SortOrder
    channel?: SortOrder
    status?: SortOrder
    messages?: SortOrder
    handedOff?: SortOrder
    lastMessageAt?: SortOrder
    createdAt?: SortOrder
    _count?: ConversationCountOrderByAggregateInput
    _max?: ConversationMaxOrderByAggregateInput
    _min?: ConversationMinOrderByAggregateInput
  }

  export type ConversationScalarWhereWithAggregatesInput = {
    AND?: ConversationScalarWhereWithAggregatesInput | ConversationScalarWhereWithAggregatesInput[]
    OR?: ConversationScalarWhereWithAggregatesInput[]
    NOT?: ConversationScalarWhereWithAggregatesInput | ConversationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Conversation"> | string
    businessId?: StringWithAggregatesFilter<"Conversation"> | string
    customerPhone?: StringWithAggregatesFilter<"Conversation"> | string
    channel?: EnumCommunicationChannelWithAggregatesFilter<"Conversation"> | $Enums.CommunicationChannel
    status?: EnumConversationStatusWithAggregatesFilter<"Conversation"> | $Enums.ConversationStatus
    messages?: JsonWithAggregatesFilter<"Conversation">
    handedOff?: BoolWithAggregatesFilter<"Conversation"> | boolean
    lastMessageAt?: DateTimeWithAggregatesFilter<"Conversation"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Conversation"> | Date | string
  }

  export type BookingIntentWhereInput = {
    AND?: BookingIntentWhereInput | BookingIntentWhereInput[]
    OR?: BookingIntentWhereInput[]
    NOT?: BookingIntentWhereInput | BookingIntentWhereInput[]
    id?: StringFilter<"BookingIntent"> | string
    conversationId?: StringFilter<"BookingIntent"> | string
    businessId?: StringFilter<"BookingIntent"> | string
    status?: EnumBookingIntentStatusFilter<"BookingIntent"> | $Enums.BookingIntentStatus
    payload?: JsonFilter<"BookingIntent">
    reservationId?: StringNullableFilter<"BookingIntent"> | string | null
    failureReason?: StringNullableFilter<"BookingIntent"> | string | null
    createdAt?: DateTimeFilter<"BookingIntent"> | Date | string
    updatedAt?: DateTimeFilter<"BookingIntent"> | Date | string
    conversation?: XOR<ConversationScalarRelationFilter, ConversationWhereInput>
  }

  export type BookingIntentOrderByWithRelationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    businessId?: SortOrder
    status?: SortOrder
    payload?: SortOrder
    reservationId?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    conversation?: ConversationOrderByWithRelationInput
  }

  export type BookingIntentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    reservationId?: string
    AND?: BookingIntentWhereInput | BookingIntentWhereInput[]
    OR?: BookingIntentWhereInput[]
    NOT?: BookingIntentWhereInput | BookingIntentWhereInput[]
    conversationId?: StringFilter<"BookingIntent"> | string
    businessId?: StringFilter<"BookingIntent"> | string
    status?: EnumBookingIntentStatusFilter<"BookingIntent"> | $Enums.BookingIntentStatus
    payload?: JsonFilter<"BookingIntent">
    failureReason?: StringNullableFilter<"BookingIntent"> | string | null
    createdAt?: DateTimeFilter<"BookingIntent"> | Date | string
    updatedAt?: DateTimeFilter<"BookingIntent"> | Date | string
    conversation?: XOR<ConversationScalarRelationFilter, ConversationWhereInput>
  }, "id" | "reservationId">

  export type BookingIntentOrderByWithAggregationInput = {
    id?: SortOrder
    conversationId?: SortOrder
    businessId?: SortOrder
    status?: SortOrder
    payload?: SortOrder
    reservationId?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BookingIntentCountOrderByAggregateInput
    _max?: BookingIntentMaxOrderByAggregateInput
    _min?: BookingIntentMinOrderByAggregateInput
  }

  export type BookingIntentScalarWhereWithAggregatesInput = {
    AND?: BookingIntentScalarWhereWithAggregatesInput | BookingIntentScalarWhereWithAggregatesInput[]
    OR?: BookingIntentScalarWhereWithAggregatesInput[]
    NOT?: BookingIntentScalarWhereWithAggregatesInput | BookingIntentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BookingIntent"> | string
    conversationId?: StringWithAggregatesFilter<"BookingIntent"> | string
    businessId?: StringWithAggregatesFilter<"BookingIntent"> | string
    status?: EnumBookingIntentStatusWithAggregatesFilter<"BookingIntent"> | $Enums.BookingIntentStatus
    payload?: JsonWithAggregatesFilter<"BookingIntent">
    reservationId?: StringNullableWithAggregatesFilter<"BookingIntent"> | string | null
    failureReason?: StringNullableWithAggregatesFilter<"BookingIntent"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"BookingIntent"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BookingIntent"> | Date | string
  }

  export type AiSettingsCreateInput = {
    id?: string
    businessId: string
    systemPrompt?: string | null
    language?: string | null
    isEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiSettingsUncheckedCreateInput = {
    id?: string
    businessId: string
    systemPrompt?: string | null
    language?: string | null
    isEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiSettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    systemPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiSettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    systemPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiSettingsCreateManyInput = {
    id?: string
    businessId: string
    systemPrompt?: string | null
    language?: string | null
    isEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiSettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    systemPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiSettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    systemPrompt?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationCreateInput = {
    id?: string
    businessId: string
    customerPhone: string
    channel: $Enums.CommunicationChannel
    status?: $Enums.ConversationStatus
    messages?: JsonNullValueInput | InputJsonValue
    handedOff?: boolean
    lastMessageAt?: Date | string
    createdAt?: Date | string
    bookingIntents?: BookingIntentCreateNestedManyWithoutConversationInput
  }

  export type ConversationUncheckedCreateInput = {
    id?: string
    businessId: string
    customerPhone: string
    channel: $Enums.CommunicationChannel
    status?: $Enums.ConversationStatus
    messages?: JsonNullValueInput | InputJsonValue
    handedOff?: boolean
    lastMessageAt?: Date | string
    createdAt?: Date | string
    bookingIntents?: BookingIntentUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ConversationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    channel?: EnumCommunicationChannelFieldUpdateOperationsInput | $Enums.CommunicationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    messages?: JsonNullValueInput | InputJsonValue
    handedOff?: BoolFieldUpdateOperationsInput | boolean
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookingIntents?: BookingIntentUpdateManyWithoutConversationNestedInput
  }

  export type ConversationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    channel?: EnumCommunicationChannelFieldUpdateOperationsInput | $Enums.CommunicationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    messages?: JsonNullValueInput | InputJsonValue
    handedOff?: BoolFieldUpdateOperationsInput | boolean
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookingIntents?: BookingIntentUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ConversationCreateManyInput = {
    id?: string
    businessId: string
    customerPhone: string
    channel: $Enums.CommunicationChannel
    status?: $Enums.ConversationStatus
    messages?: JsonNullValueInput | InputJsonValue
    handedOff?: boolean
    lastMessageAt?: Date | string
    createdAt?: Date | string
  }

  export type ConversationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    channel?: EnumCommunicationChannelFieldUpdateOperationsInput | $Enums.CommunicationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    messages?: JsonNullValueInput | InputJsonValue
    handedOff?: BoolFieldUpdateOperationsInput | boolean
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    channel?: EnumCommunicationChannelFieldUpdateOperationsInput | $Enums.CommunicationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    messages?: JsonNullValueInput | InputJsonValue
    handedOff?: BoolFieldUpdateOperationsInput | boolean
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingIntentCreateInput = {
    id?: string
    businessId: string
    status?: $Enums.BookingIntentStatus
    payload?: JsonNullValueInput | InputJsonValue
    reservationId?: string | null
    failureReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    conversation: ConversationCreateNestedOneWithoutBookingIntentsInput
  }

  export type BookingIntentUncheckedCreateInput = {
    id?: string
    conversationId: string
    businessId: string
    status?: $Enums.BookingIntentStatus
    payload?: JsonNullValueInput | InputJsonValue
    reservationId?: string | null
    failureReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingIntentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumBookingIntentStatusFieldUpdateOperationsInput | $Enums.BookingIntentStatus
    payload?: JsonNullValueInput | InputJsonValue
    reservationId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    conversation?: ConversationUpdateOneRequiredWithoutBookingIntentsNestedInput
  }

  export type BookingIntentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumBookingIntentStatusFieldUpdateOperationsInput | $Enums.BookingIntentStatus
    payload?: JsonNullValueInput | InputJsonValue
    reservationId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingIntentCreateManyInput = {
    id?: string
    conversationId: string
    businessId: string
    status?: $Enums.BookingIntentStatus
    payload?: JsonNullValueInput | InputJsonValue
    reservationId?: string | null
    failureReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingIntentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumBookingIntentStatusFieldUpdateOperationsInput | $Enums.BookingIntentStatus
    payload?: JsonNullValueInput | InputJsonValue
    reservationId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingIntentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumBookingIntentStatusFieldUpdateOperationsInput | $Enums.BookingIntentStatus
    payload?: JsonNullValueInput | InputJsonValue
    reservationId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AiSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    systemPrompt?: SortOrder
    language?: SortOrder
    isEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    systemPrompt?: SortOrder
    language?: SortOrder
    isEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    systemPrompt?: SortOrder
    language?: SortOrder
    isEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type EnumCommunicationChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.CommunicationChannel | EnumCommunicationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.CommunicationChannel[] | ListEnumCommunicationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommunicationChannel[] | ListEnumCommunicationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumCommunicationChannelFilter<$PrismaModel> | $Enums.CommunicationChannel
  }

  export type EnumConversationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationStatus | EnumConversationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationStatusFilter<$PrismaModel> | $Enums.ConversationStatus
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BookingIntentListRelationFilter = {
    every?: BookingIntentWhereInput
    some?: BookingIntentWhereInput
    none?: BookingIntentWhereInput
  }

  export type BookingIntentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConversationBusinessIdCustomerPhoneCompoundUniqueInput = {
    businessId: string
    customerPhone: string
  }

  export type ConversationCountOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    customerPhone?: SortOrder
    channel?: SortOrder
    status?: SortOrder
    messages?: SortOrder
    handedOff?: SortOrder
    lastMessageAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ConversationMaxOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    customerPhone?: SortOrder
    channel?: SortOrder
    status?: SortOrder
    handedOff?: SortOrder
    lastMessageAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ConversationMinOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    customerPhone?: SortOrder
    channel?: SortOrder
    status?: SortOrder
    handedOff?: SortOrder
    lastMessageAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumCommunicationChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CommunicationChannel | EnumCommunicationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.CommunicationChannel[] | ListEnumCommunicationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommunicationChannel[] | ListEnumCommunicationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumCommunicationChannelWithAggregatesFilter<$PrismaModel> | $Enums.CommunicationChannel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCommunicationChannelFilter<$PrismaModel>
    _max?: NestedEnumCommunicationChannelFilter<$PrismaModel>
  }

  export type EnumConversationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationStatus | EnumConversationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ConversationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConversationStatusFilter<$PrismaModel>
    _max?: NestedEnumConversationStatusFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumBookingIntentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingIntentStatus | EnumBookingIntentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingIntentStatus[] | ListEnumBookingIntentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingIntentStatus[] | ListEnumBookingIntentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingIntentStatusFilter<$PrismaModel> | $Enums.BookingIntentStatus
  }

  export type ConversationScalarRelationFilter = {
    is?: ConversationWhereInput
    isNot?: ConversationWhereInput
  }

  export type BookingIntentCountOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    businessId?: SortOrder
    status?: SortOrder
    payload?: SortOrder
    reservationId?: SortOrder
    failureReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingIntentMaxOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    businessId?: SortOrder
    status?: SortOrder
    reservationId?: SortOrder
    failureReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BookingIntentMinOrderByAggregateInput = {
    id?: SortOrder
    conversationId?: SortOrder
    businessId?: SortOrder
    status?: SortOrder
    reservationId?: SortOrder
    failureReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumBookingIntentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingIntentStatus | EnumBookingIntentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingIntentStatus[] | ListEnumBookingIntentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingIntentStatus[] | ListEnumBookingIntentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingIntentStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingIntentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookingIntentStatusFilter<$PrismaModel>
    _max?: NestedEnumBookingIntentStatusFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BookingIntentCreateNestedManyWithoutConversationInput = {
    create?: XOR<BookingIntentCreateWithoutConversationInput, BookingIntentUncheckedCreateWithoutConversationInput> | BookingIntentCreateWithoutConversationInput[] | BookingIntentUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: BookingIntentCreateOrConnectWithoutConversationInput | BookingIntentCreateOrConnectWithoutConversationInput[]
    createMany?: BookingIntentCreateManyConversationInputEnvelope
    connect?: BookingIntentWhereUniqueInput | BookingIntentWhereUniqueInput[]
  }

  export type BookingIntentUncheckedCreateNestedManyWithoutConversationInput = {
    create?: XOR<BookingIntentCreateWithoutConversationInput, BookingIntentUncheckedCreateWithoutConversationInput> | BookingIntentCreateWithoutConversationInput[] | BookingIntentUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: BookingIntentCreateOrConnectWithoutConversationInput | BookingIntentCreateOrConnectWithoutConversationInput[]
    createMany?: BookingIntentCreateManyConversationInputEnvelope
    connect?: BookingIntentWhereUniqueInput | BookingIntentWhereUniqueInput[]
  }

  export type EnumCommunicationChannelFieldUpdateOperationsInput = {
    set?: $Enums.CommunicationChannel
  }

  export type EnumConversationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ConversationStatus
  }

  export type BookingIntentUpdateManyWithoutConversationNestedInput = {
    create?: XOR<BookingIntentCreateWithoutConversationInput, BookingIntentUncheckedCreateWithoutConversationInput> | BookingIntentCreateWithoutConversationInput[] | BookingIntentUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: BookingIntentCreateOrConnectWithoutConversationInput | BookingIntentCreateOrConnectWithoutConversationInput[]
    upsert?: BookingIntentUpsertWithWhereUniqueWithoutConversationInput | BookingIntentUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: BookingIntentCreateManyConversationInputEnvelope
    set?: BookingIntentWhereUniqueInput | BookingIntentWhereUniqueInput[]
    disconnect?: BookingIntentWhereUniqueInput | BookingIntentWhereUniqueInput[]
    delete?: BookingIntentWhereUniqueInput | BookingIntentWhereUniqueInput[]
    connect?: BookingIntentWhereUniqueInput | BookingIntentWhereUniqueInput[]
    update?: BookingIntentUpdateWithWhereUniqueWithoutConversationInput | BookingIntentUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: BookingIntentUpdateManyWithWhereWithoutConversationInput | BookingIntentUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: BookingIntentScalarWhereInput | BookingIntentScalarWhereInput[]
  }

  export type BookingIntentUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: XOR<BookingIntentCreateWithoutConversationInput, BookingIntentUncheckedCreateWithoutConversationInput> | BookingIntentCreateWithoutConversationInput[] | BookingIntentUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: BookingIntentCreateOrConnectWithoutConversationInput | BookingIntentCreateOrConnectWithoutConversationInput[]
    upsert?: BookingIntentUpsertWithWhereUniqueWithoutConversationInput | BookingIntentUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: BookingIntentCreateManyConversationInputEnvelope
    set?: BookingIntentWhereUniqueInput | BookingIntentWhereUniqueInput[]
    disconnect?: BookingIntentWhereUniqueInput | BookingIntentWhereUniqueInput[]
    delete?: BookingIntentWhereUniqueInput | BookingIntentWhereUniqueInput[]
    connect?: BookingIntentWhereUniqueInput | BookingIntentWhereUniqueInput[]
    update?: BookingIntentUpdateWithWhereUniqueWithoutConversationInput | BookingIntentUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: BookingIntentUpdateManyWithWhereWithoutConversationInput | BookingIntentUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: BookingIntentScalarWhereInput | BookingIntentScalarWhereInput[]
  }

  export type ConversationCreateNestedOneWithoutBookingIntentsInput = {
    create?: XOR<ConversationCreateWithoutBookingIntentsInput, ConversationUncheckedCreateWithoutBookingIntentsInput>
    connectOrCreate?: ConversationCreateOrConnectWithoutBookingIntentsInput
    connect?: ConversationWhereUniqueInput
  }

  export type EnumBookingIntentStatusFieldUpdateOperationsInput = {
    set?: $Enums.BookingIntentStatus
  }

  export type ConversationUpdateOneRequiredWithoutBookingIntentsNestedInput = {
    create?: XOR<ConversationCreateWithoutBookingIntentsInput, ConversationUncheckedCreateWithoutBookingIntentsInput>
    connectOrCreate?: ConversationCreateOrConnectWithoutBookingIntentsInput
    upsert?: ConversationUpsertWithoutBookingIntentsInput
    connect?: ConversationWhereUniqueInput
    update?: XOR<XOR<ConversationUpdateToOneWithWhereWithoutBookingIntentsInput, ConversationUpdateWithoutBookingIntentsInput>, ConversationUncheckedUpdateWithoutBookingIntentsInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedEnumCommunicationChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.CommunicationChannel | EnumCommunicationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.CommunicationChannel[] | ListEnumCommunicationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommunicationChannel[] | ListEnumCommunicationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumCommunicationChannelFilter<$PrismaModel> | $Enums.CommunicationChannel
  }

  export type NestedEnumConversationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationStatus | EnumConversationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationStatusFilter<$PrismaModel> | $Enums.ConversationStatus
  }

  export type NestedEnumCommunicationChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CommunicationChannel | EnumCommunicationChannelFieldRefInput<$PrismaModel>
    in?: $Enums.CommunicationChannel[] | ListEnumCommunicationChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.CommunicationChannel[] | ListEnumCommunicationChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumCommunicationChannelWithAggregatesFilter<$PrismaModel> | $Enums.CommunicationChannel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumCommunicationChannelFilter<$PrismaModel>
    _max?: NestedEnumCommunicationChannelFilter<$PrismaModel>
  }

  export type NestedEnumConversationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConversationStatus | EnumConversationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConversationStatus[] | ListEnumConversationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumConversationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ConversationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConversationStatusFilter<$PrismaModel>
    _max?: NestedEnumConversationStatusFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumBookingIntentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingIntentStatus | EnumBookingIntentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingIntentStatus[] | ListEnumBookingIntentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingIntentStatus[] | ListEnumBookingIntentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingIntentStatusFilter<$PrismaModel> | $Enums.BookingIntentStatus
  }

  export type NestedEnumBookingIntentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingIntentStatus | EnumBookingIntentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingIntentStatus[] | ListEnumBookingIntentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingIntentStatus[] | ListEnumBookingIntentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingIntentStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingIntentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookingIntentStatusFilter<$PrismaModel>
    _max?: NestedEnumBookingIntentStatusFilter<$PrismaModel>
  }

  export type BookingIntentCreateWithoutConversationInput = {
    id?: string
    businessId: string
    status?: $Enums.BookingIntentStatus
    payload?: JsonNullValueInput | InputJsonValue
    reservationId?: string | null
    failureReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingIntentUncheckedCreateWithoutConversationInput = {
    id?: string
    businessId: string
    status?: $Enums.BookingIntentStatus
    payload?: JsonNullValueInput | InputJsonValue
    reservationId?: string | null
    failureReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingIntentCreateOrConnectWithoutConversationInput = {
    where: BookingIntentWhereUniqueInput
    create: XOR<BookingIntentCreateWithoutConversationInput, BookingIntentUncheckedCreateWithoutConversationInput>
  }

  export type BookingIntentCreateManyConversationInputEnvelope = {
    data: BookingIntentCreateManyConversationInput | BookingIntentCreateManyConversationInput[]
    skipDuplicates?: boolean
  }

  export type BookingIntentUpsertWithWhereUniqueWithoutConversationInput = {
    where: BookingIntentWhereUniqueInput
    update: XOR<BookingIntentUpdateWithoutConversationInput, BookingIntentUncheckedUpdateWithoutConversationInput>
    create: XOR<BookingIntentCreateWithoutConversationInput, BookingIntentUncheckedCreateWithoutConversationInput>
  }

  export type BookingIntentUpdateWithWhereUniqueWithoutConversationInput = {
    where: BookingIntentWhereUniqueInput
    data: XOR<BookingIntentUpdateWithoutConversationInput, BookingIntentUncheckedUpdateWithoutConversationInput>
  }

  export type BookingIntentUpdateManyWithWhereWithoutConversationInput = {
    where: BookingIntentScalarWhereInput
    data: XOR<BookingIntentUpdateManyMutationInput, BookingIntentUncheckedUpdateManyWithoutConversationInput>
  }

  export type BookingIntentScalarWhereInput = {
    AND?: BookingIntentScalarWhereInput | BookingIntentScalarWhereInput[]
    OR?: BookingIntentScalarWhereInput[]
    NOT?: BookingIntentScalarWhereInput | BookingIntentScalarWhereInput[]
    id?: StringFilter<"BookingIntent"> | string
    conversationId?: StringFilter<"BookingIntent"> | string
    businessId?: StringFilter<"BookingIntent"> | string
    status?: EnumBookingIntentStatusFilter<"BookingIntent"> | $Enums.BookingIntentStatus
    payload?: JsonFilter<"BookingIntent">
    reservationId?: StringNullableFilter<"BookingIntent"> | string | null
    failureReason?: StringNullableFilter<"BookingIntent"> | string | null
    createdAt?: DateTimeFilter<"BookingIntent"> | Date | string
    updatedAt?: DateTimeFilter<"BookingIntent"> | Date | string
  }

  export type ConversationCreateWithoutBookingIntentsInput = {
    id?: string
    businessId: string
    customerPhone: string
    channel: $Enums.CommunicationChannel
    status?: $Enums.ConversationStatus
    messages?: JsonNullValueInput | InputJsonValue
    handedOff?: boolean
    lastMessageAt?: Date | string
    createdAt?: Date | string
  }

  export type ConversationUncheckedCreateWithoutBookingIntentsInput = {
    id?: string
    businessId: string
    customerPhone: string
    channel: $Enums.CommunicationChannel
    status?: $Enums.ConversationStatus
    messages?: JsonNullValueInput | InputJsonValue
    handedOff?: boolean
    lastMessageAt?: Date | string
    createdAt?: Date | string
  }

  export type ConversationCreateOrConnectWithoutBookingIntentsInput = {
    where: ConversationWhereUniqueInput
    create: XOR<ConversationCreateWithoutBookingIntentsInput, ConversationUncheckedCreateWithoutBookingIntentsInput>
  }

  export type ConversationUpsertWithoutBookingIntentsInput = {
    update: XOR<ConversationUpdateWithoutBookingIntentsInput, ConversationUncheckedUpdateWithoutBookingIntentsInput>
    create: XOR<ConversationCreateWithoutBookingIntentsInput, ConversationUncheckedCreateWithoutBookingIntentsInput>
    where?: ConversationWhereInput
  }

  export type ConversationUpdateToOneWithWhereWithoutBookingIntentsInput = {
    where?: ConversationWhereInput
    data: XOR<ConversationUpdateWithoutBookingIntentsInput, ConversationUncheckedUpdateWithoutBookingIntentsInput>
  }

  export type ConversationUpdateWithoutBookingIntentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    channel?: EnumCommunicationChannelFieldUpdateOperationsInput | $Enums.CommunicationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    messages?: JsonNullValueInput | InputJsonValue
    handedOff?: BoolFieldUpdateOperationsInput | boolean
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationUncheckedUpdateWithoutBookingIntentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerPhone?: StringFieldUpdateOperationsInput | string
    channel?: EnumCommunicationChannelFieldUpdateOperationsInput | $Enums.CommunicationChannel
    status?: EnumConversationStatusFieldUpdateOperationsInput | $Enums.ConversationStatus
    messages?: JsonNullValueInput | InputJsonValue
    handedOff?: BoolFieldUpdateOperationsInput | boolean
    lastMessageAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingIntentCreateManyConversationInput = {
    id?: string
    businessId: string
    status?: $Enums.BookingIntentStatus
    payload?: JsonNullValueInput | InputJsonValue
    reservationId?: string | null
    failureReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingIntentUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumBookingIntentStatusFieldUpdateOperationsInput | $Enums.BookingIntentStatus
    payload?: JsonNullValueInput | InputJsonValue
    reservationId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingIntentUncheckedUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumBookingIntentStatusFieldUpdateOperationsInput | $Enums.BookingIntentStatus
    payload?: JsonNullValueInput | InputJsonValue
    reservationId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingIntentUncheckedUpdateManyWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumBookingIntentStatusFieldUpdateOperationsInput | $Enums.BookingIntentStatus
    payload?: JsonNullValueInput | InputJsonValue
    reservationId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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