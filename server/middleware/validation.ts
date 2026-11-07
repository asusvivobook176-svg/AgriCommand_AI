/**
 * Zod Request Validation Middleware for AgriCommand AI Server
 */
import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = (result.error as any).issues || (result.error as any).errors || [];
      return res.status(400).json({
        error: 'Validation failed',
        details: issues.map((e: any) => ({
          path: Array.isArray(e.path) ? e.path.join('.') : String(e.path || ''),
          message: e.message
        }))
      });
    }
    req.body = result.data;
    next();
  };
};

export const FarmerSubmissionSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(8, 'Phone number is required'),
  state: z.string().default('Tamil Nadu'),
  district: z.string().min(2, 'District is required'),
  village: z.string().min(2, 'Village is required'),
  landSizeAcres: z.number().positive('Land size must be positive').or(z.string().transform(v => parseFloat(v) || 1.0)),
  soilType: z.string().min(2, 'Soil type is required'),
  waterAvailability: z.string().default('Limited'),
  irrigationSource: z.string().min(2, 'Irrigation source is required'),
  previousCrop: z.string().default('Groundnut'),
  currentSeason: z.string().default('Summer 2026'),
  preferredCrop: z.string().optional().default('Drought-resilient cash crop'),
  category: z.string().default('Crop selection'),
  problemDescription: z.string().min(10, 'Problem description must be at least 10 characters'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).default('High')
});

export const ApprovalSubmissionSchema = z.object({
  decision: z.enum(['Approved', 'Rejected', 'Revision Requested']),
  comments: z.string().optional().default(''),
  reviewerName: z.string().default('Dr. Sundaram (Agri Coordinator)')
});
