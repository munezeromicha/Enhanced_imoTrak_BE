// import { Request, Response, NextFunction } from 'express';
// import { createAuditLog } from '../services/auditService';
// import { position_accesses } from '../types/access';


// interface AuthenticatedRequest extends Request {
//   user?: {
//     user_id: string;
//     email: string;
//     position_id: string;
//     organization_id: string;
//     position_access: position_accesses;
//   };
// }

// export const auditLogger = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   const auditableMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
//   if (!auditableMethods.includes(req.method)) return next();

// //   const excludedRoutes = ['/login', '/register']; 
// //   if (excludedRoutes.includes(req.path)) return next();

//   // Wait until response finishes, then log
//   res.on('finish', async () => {
//     try {
//       await createAuditLog({
//         action: `${req.method} ${req.path}`,
//         userId: req.user?.user_id ?? 'anonymous',
//         table_name: 'unknown',
//         record_id: undefined,
//         ip_address: req.ip,
//         user_agent: req.headers['user-agent'],
//         previous_value: null, // can't be known here
//         new_value: null,
//       });
//     } catch (error) {
//       console.error('Auto audit failed:', error);
//     }
//   });

//   next();
// };
