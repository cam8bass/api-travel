import { Response, Request, NextFunction } from "express";
import catchAsync from "../shared/utils/catchAsync.util";
import { Model, PopulateOptions } from "mongoose";
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
    const filteredQuery = new QueryFilter(Model.find(), req.query)
      .filter()
      .sort()
      .field()
      .page();

    const doc = await filteredQuery.query;

    if (!doc) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        doc,
      },
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
    const id = req.params.id;
    const doc = await Model.findById(id).populate(popOptions);

    if (!doc) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
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
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      message: `Le document ayant l'identifiant ${id} a été supprimé avec succès.`,
    });
  });

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
    const doc = await Model.findByIdAndUpdate(id, filteredBody, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(EMPTY_RESULT, 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
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
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });
