// import { Request, Response, NextFunction } from "express";
// import jwt, { JsonWebTokenError } from "jsonwebtoken"; // Import JsonWebTokenError
// import { User } from "@data/user/models/user-model";

// export const isAuthenticated = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const { token } = req.cookies;
   

//     if (!token) {
//       res.status(401).json({
//         message: "Please login first",
//       });
//     } else {
//       const decoded: any = await jwt.verify(
//         token,
//         process.env.JWT_SECRET as string
//       );

//       // Cast error to JsonWebTokenError type
//       req.user = await User.findById(decoded._id);
//       next();
//     }
//   } catch (error) {
//     const jwtError = error as JsonWebTokenError; // Cast error to JsonWebTokenError type
//     res.status(500).json({
//       message: jwtError.message,
//     });
//   }
// };


