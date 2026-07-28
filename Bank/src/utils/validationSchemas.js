import Joi from 'joi';

/**
 * User Validation Schema
 */
export const userSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(15).optional(),
  address: Joi.string().max(255).optional(),
  city: Joi.string().max(100).optional(),
  state: Joi.string().max(100).optional(),
  postalCode: Joi.string().max(20).optional(),
  country: Joi.string().max(100).optional()
});

export const userUpdateSchema = userSchema.fork(
  ['firstName', 'lastName', 'email'],
  (schema) => schema.optional()
);

/**
 * Account Validation Schema
 */
export const accountSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  accountNumber: Joi.string().min(8).max(20).required(),
  accountType: Joi.string().valid('SAVINGS', 'CHECKING', 'BUSINESS', 'INVESTMENT').required(),
  currency: Joi.string().length(3).default('USD')
});

export const accountUpdateSchema = Joi.object({
  accountType: Joi.string().valid('SAVINGS', 'CHECKING', 'BUSINESS', 'INVESTMENT').optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'FROZEN', 'CLOSED').optional()
});

/**
 * Transaction Validation Schema
 */
export const transactionSchema = Joi.object({
  accountId: Joi.string().uuid().required(),
  transactionType: Joi.string().valid('DEPOSIT', 'WITHDRAWAL').required(),
  amount: Joi.number().positive().precision(2).required(),
  description: Joi.string().max(255).optional()
});

/**
 * Transfer Validation Schema
 */
export const transferSchema = Joi.object({
  fromAccountId: Joi.string().uuid().required(),
  toAccountId: Joi.string().uuid().required(),
  amount: Joi.number().positive().precision(2).required(),
  description: Joi.string().max(255).optional()
});

export const transferUpdateSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED').required()
});

/**
 * Query Validation Schemas
 */
export const paginationSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(50),
  offset: Joi.number().integer().min(0).default(0)
});

export default {
  userSchema,
  userUpdateSchema,
  accountSchema,
  accountUpdateSchema,
  transactionSchema,
  transferSchema,
  transferUpdateSchema,
  paginationSchema
};
