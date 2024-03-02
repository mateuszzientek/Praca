import { Request, Response, NextFunction } from 'express';
import {validationResult, ValidationChain } from "express-validator";

const validateWithReq = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      await Promise.all(validations.map((validation) => validation.run(req)));
  
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
  
      const translatedErrors = errors.array().map((error) => {
        return {
          ...error,
          msg: req.t(error.msg),
        };
      });
  
      res.status(400).json({ errors: translatedErrors });
    };
  };

module.exports = validateWithReq;