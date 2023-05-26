import { NextFunction, Request, Response } from "express";
import Tour from "../models/tour.model";

export const getAllTours = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tours = await Tour.find();

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};

export const createTour = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tour = await Tour.create({
    title: req.body.title,
    summary: req.body.summary,
    description: req.body.description,
    price: req.body.price,
    duration: req.body.duration,
    maxGroupSize: req.body.maxGroupSize,
  });

  res.status(201).json({
    status: "success",
    data: {
      tour,
    },
  });
};

export const getTour = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const tour = await Tour.findById(id);

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

export const updateTour = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

export const deleteTour = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const tour = await Tour.findByIdAndDelete(id);

  res.status(200).json({
    status: "success",
    message: `Le document ayant l'identifiant ${id} a été supprimé avec succès.`,
  });
};
