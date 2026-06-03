import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateTask = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "error_validacion",
          errors: error.issues.map(err => ({
            campo: err.path[0],
            mensaje: err.message
          }))
        });
        return;
      }
      next(error);
    }
  };
};