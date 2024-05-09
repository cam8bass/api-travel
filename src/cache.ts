import NodeCache from "node-cache";
import { Model, Types } from "mongoose";
import {
  AccommodationInterface,
  ReviewInterface,
  TourInterface,
  UserInterface,
} from "./shared/interfaces";

class CacheManager {
  private cache: NodeCache;
  private static nodeCache: CacheManager | null = null;

  private constructor() {
    this.cache = new NodeCache({
      stdTTL: 600,
      checkperiod: 60,
      maxKeys: 1000,
      deleteOnExpire: true,
      useClones: true,
    });
  }

  /**
   * Retrieves a cached value based on the provided model and optional ID.
   * If an ID is provided, it attempts to fetch a single document from the cache.
   * If no ID is provided, it fetches all documents of the specified model type.
   *
   * @param Model - The Mongoose model corresponding to the type of the document(s) to retrieve.
   * @param id - Optional. The unique identifier of the document to retrieve. If omitted, all documents of the model type are retrieved.
   * @returns {T | T[] | undefined} - The cached document(s) if found, otherwise undefined. The return type is either a single document (T), an array of documents (T[]), or undefined if the cache does not contain the requested document(s).
   */
  public static get<
    T extends
      | UserInterface
      | TourInterface
      | AccommodationInterface
      | ReviewInterface
  >(Model: Model<T>, id?: Types.ObjectId): T | T[] | undefined {
    const nodeCache = CacheManager.setupCache();
    const cacheKey = `${Model.modelName.toLowerCase()}:${id ? id : "all"}`;

    return nodeCache.cache.get<T | T[]>(cacheKey);
  }

  /**
   * Caches a document or an array of documents under a specific model with an optional time-to-live (TTL).
   * If an ID is provided, it caches a single document. Without an ID, it assumes caching all documents of the model type.
   *
   * @param Model - The Mongoose model corresponding to the document(s) being cached.
   * @param value - The document (or documents) to cache. Can be a single document or an array of documents.
   * @param id - Optional. The unique identifier of the document. If omitted, the method assumes caching all documents of the model type.
   * @param ttl - Optional. The time-to-live in seconds for the cached document(s). If omitted, the default TTL of the cache is used.
   * @returns {boolean} - Returns `true` if the document(s) were successfully cached, otherwise `false`.
   */
  public static set<
    T extends
      | UserInterface
      | TourInterface
      | AccommodationInterface
      | ReviewInterface
  >(
    Model: Model<T>,
    value: T | T[],
    id?: Types.ObjectId,
    ttl?: number
  ): boolean {
    const nodeCache = CacheManager.setupCache();
    const cacheKey = `${Model.modelName.toLowerCase()}:${id ? id : "all"}`;
    return nodeCache.cache.set<T | T[]>(cacheKey, value, ttl);
  }

  /**
   * Deletes a cached document based on the provided model and ID.
   *
   * This method constructs a cache key using the model name and the provided ID,
   * then attempts to delete the document associated with that key from the cache.
   *
   * @param Model - The Mongoose model corresponding to the document being deleted.
   * @param id - The unique identifier of the document to delete from the cache.
   * @returns {number} - The number of deleted entries. A return value of 1 indicates
   * that the document was successfully deleted, while 0 indicates that the document
   * was not found in the cache.
   */
  public static delete<
    T extends Model<
      TourInterface | UserInterface | AccommodationInterface | ReviewInterface
    >
  >(Model: T, id: Types.ObjectId): number {
    const nodeCache = CacheManager.setupCache();
    const cacheKey = `${Model.modelName.toLowerCase()}:${id}`;
    return nodeCache.cache.del(cacheKey);
  }

  /**
   * Deletes all entries from the cache.
   * This method flushes the entire cache, removing all stored documents regardless of their model type.
   * It is useful for clearing the cache completely, for instance, when a major update occurs or for maintenance purposes.
   */
  public static deleteAll(): void {
    const nodeCache = CacheManager.setupCache();
    return nodeCache.cache.flushAll();
  }

  /**
   * Compares two timestamps to determine if the database timestamp is more recent than the cache timestamp.
   *
   * This method is useful for cache invalidation checks, where it's necessary to determine if the data in the cache
   * is older than the data in the database.
   *
   * @param timeStampDb The timestamp from the database.
   * @param timeStampCache The timestamp from the cache.
   * @returns {boolean} Returns `true` if the database timestamp is more recent than the cache timestamp, otherwise `false`.
   */
  public static compare(timeStampDb: Date, timeStampCache: Date): boolean {
    return timeStampDb > timeStampCache;
  }

  /**
   * Initializes or retrieves the existing instance of the CacheManager.
   * This method ensures that only one instance of the CacheManager exists within the application (singleton pattern).
   * If an instance does not already exist, it creates a new one and stores it in a static property for future access.
   * This approach prevents multiple instances of the cache from being created, which could lead to inconsistent cache states.
   *
   * @returns {CacheManager} The single instance of the CacheManager.
   */
  private static setupCache(): CacheManager {
    if (!CacheManager.nodeCache) {
      CacheManager.nodeCache = new CacheManager();
    }
    return CacheManager.nodeCache;
  }
}

export default CacheManager;

// class CacheManager {
//   private cache: NodeCache;
//   private static nodeCache: CacheManager | null = null;

//   private constructor() {
//     this.cache = new NodeCache({
//       stdTTL: 600,
//       checkperiod: 60,
//       maxKeys: 1000,
//       deleteOnExpire: true,
//       useClones: true,
//     });
//   }

//   public static getAll<
//     T extends
//       | UserInterface
//       | TourInterface
//       | AccommodationInterface
//       | ReviewInterface

//   >(Model: Model<T>): T[] | undefined {
//     const nodeCache = CacheManager.setupCache();
//     const cacheKey = `${Model.modelName.toLowerCase()}:all`;

//     return nodeCache.cache.get<T[]>(cacheKey);
//   }

//   public static get<
//     T extends
//       | UserInterface
//       | TourInterface
//       | AccommodationInterface
//       | ReviewInterface
//   >(Model: Model<T>, id: Types.ObjectId): T | undefined {
//     const nodeCache = CacheManager.setupCache();
//     const cacheKey = `${Model.modelName.toLowerCase()}:${id}`;

//     return nodeCache.cache.get<T>(cacheKey);
//   }

//   public static setAll<
//     T extends
//       | UserInterface
//       | TourInterface
//       | AccommodationInterface
//       | ReviewInterface

//   >(Model: Model<T>, value: T[], ttl?: number): boolean {
//     const nodeCache = CacheManager.setupCache();
//     const cacheKey = `${Model.modelName.toLowerCase()}:all`;
//     return nodeCache.cache.set<T[]>(cacheKey, value, ttl);
//   }

//   public static set<
//     T extends
//       | UserInterface
//       | TourInterface
//       | AccommodationInterface
//       | ReviewInterface
//   >(Model: Model<T>, id: Types.ObjectId, value: T, ttl?: number): boolean {
//     const nodeCache = CacheManager.setupCache();
//     const cacheKey = `${Model.modelName.toLowerCase()}:${id}`;
//     return nodeCache.cache.set<T>(cacheKey, value, ttl);
//   }

//   public static delete<
//     T extends Model<
//       TourInterface | UserInterface | AccommodationInterface | ReviewInterface
//     >
//   >(Model: T, id: Types.ObjectId): number {
//     const nodeCache = CacheManager.setupCache();
//     const cacheKey = `${Model.modelName.toLowerCase()}:${id}`;
//     return nodeCache.cache.del(cacheKey);
//   }

//   public static deleteAll(): void {
//     const nodeCache = CacheManager.setupCache();
//     return nodeCache.cache.flushAll();
//   }

//   public static compare(timeStampDb: Date, timeStampCache: Date): boolean {
//     return timeStampDb > timeStampCache;
//   }

//   private static setupCache(): CacheManager {
//     if (!CacheManager.nodeCache) {
//       CacheManager.nodeCache = new CacheManager();
//     }
//     return CacheManager.nodeCache;
//   }
// }

// export default CacheManager;
