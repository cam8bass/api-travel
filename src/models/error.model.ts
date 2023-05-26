import { Response } from "express";
import { AppErrorInterface } from "../shared/interfaces";
import AppError from "../shared/utils/AppError.util";

export const handleErrorDev = (err: AppErrorInterface, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

export const handleErrorProd = (err: AppErrorInterface, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "Error",
      message: "Une erreur s'est produite. Veuillez réessayer plus tard.",
    });
  }
};

export const handleCastError = (err: any): AppError => {
  return new AppError(
    `Désolé, une erreur est survenue. L'url attend une donnée de type ${err.path}. Veuillez vérifier: ${err.value} ou essayer une autre requête`,
    400
  );
};

export const handleValidationError = (err: any): AppError => {
  const value = Object.values(err.errors)
    .map((el: any) => el.message)
    .join(", ");

  return new AppError(
    `Désolé, la validation a échoué en raison de champs obligatoires manquants. Veuillez vérifier les champs suivants : ${value}`,
    400
  );
};

export const handleDuplicateError = (err: any): AppError => {
  const value = err.message.match(/{([^}]+)}/)[0].trim();

  return new AppError(`Désolé, une erreur est survenue lors de la création de l'élément. Un élément possède déjà la valeur ${value}. Veuillez vérifier les données saisies et réessayer.`, 400);
};
