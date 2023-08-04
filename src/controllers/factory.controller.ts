import { Response, Request, NextFunction } from "express";
import catchAsync from "../shared/utils/catchAsync.util";
import { Model, PopulateOptions, Types } from "mongoose";
import { EMPTY_RESULT } from "../shared/messages/error.message";
import AppError from "../shared/utils/AppError.util";
import QueryFilter from "../shared/utils/QueryFilter.util";
import {
  AccommodationInterface,
  ReviewInterface,
  TourInterface,
  UserInterface,
} from "../shared/interfaces";
import { bodyFilter } from "../shared/utils/bodyFilter";
import CacheManager from "../cache";
import QueryFilterCache from "../shared/utils/QueryFilterCache";

export const getAll = <
  T extends
    | UserInterface
    | TourInterface
    | ReviewInterface
    | AccommodationInterface
>(
  Model: Model<T>
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let data: T[] | [] = [];
    data = CacheManager.get(Model) as T[];

    if (!data) {
      data = await Model.find().lean();
      if (!data) {
        return next(new AppError(EMPTY_RESULT, 404));
      }
      CacheManager.set(Model, data);
    }

    // Si il y a une query
    if (Object.entries(req.query).length) {
      const filteredQuery = new QueryFilterCache(req.query, data)
        .filter()
        .field()
        .sort()
        .page();
      // Retourne le cache filtré
      data = filteredQuery.data;
    }

    res.status(200).json({
      status: "success",
      results: data.length,
      data,
    });
  });

export const getOne = <
  T extends
    | UserInterface
    | TourInterface
    | AccommodationInterface
    | ReviewInterface
>(
  Model: Model<T>,
  popOptions?: PopulateOptions[] | PopulateOptions
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = new Types.ObjectId(req.params.id);

    let data: T | null = null;

    data = CacheManager.get(Model, id) as T;

    if (!data) {
      data = (await Model.findById(id).populate(popOptions).lean()) as T;

      if (!data) {
        return next(new AppError(EMPTY_RESULT, 404));
      }

      CacheManager.set(Model, data, id);
    }

    res.status(200).json({
      status: "success",
      data,
    });
  });

export const deleteOne = <
  T extends
    | UserInterface
    | TourInterface
    | ReviewInterface
    | AccommodationInterface
>(
  Model: Model<T>
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id).select("_id").lean();

    if (!data) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      message: `Le document ayant l'identifiant ${id} a été supprimé avec succès.`,
    });
  });

// TODO: Voir pour mettre en place la modification du cache
export const updateOne = <
  T extends
    | UserInterface
    | TourInterface
    | AccommodationInterface
    | ReviewInterface
>(
  Model: Model<T>,
  ...fields: (keyof T)[]
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const filteredBody = bodyFilter(req.body, ...fields);

    const data = await Model.findByIdAndUpdate(id, filteredBody, {
      new: true,
      runValidators: true,
    }).lean();

    if (!data) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      data,
    });
  });

export const createOne = <
  T extends
    | UserInterface
    | TourInterface
    | ReviewInterface
    | AccommodationInterface
>(
  Model: Model<T>
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data,
    });
  });
