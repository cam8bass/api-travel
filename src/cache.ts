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

  public static delete<
    T extends Model<
      TourInterface | UserInterface | AccommodationInterface | ReviewInterface
    >
  >(Model: T, id: Types.ObjectId): number {
    const nodeCache = CacheManager.setupCache();
    const cacheKey = `${Model.modelName.toLowerCase()}:${id}`;
    return nodeCache.cache.del(cacheKey);
  }

  public static deleteAll(): void {
    const nodeCache = CacheManager.setupCache();
    return nodeCache.cache.flushAll();
  }

  public static compare(timeStampDb: Date, timeStampCache: Date): boolean {
    return timeStampDb > timeStampCache;
  }

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
