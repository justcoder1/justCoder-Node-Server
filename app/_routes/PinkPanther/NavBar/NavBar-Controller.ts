import type { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler"; // See notes in _Root

import type { T_Roles } from "../Roles/Roles-Model";
import RoleSchema from "../Roles/Roles-Model";
import type { T_NavBar } from "./NavBar-Model";
import NavBarSchema from "./NavBar-Model";

const getNavBars = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userAllowedTabs: T_Roles = await RoleSchema.findOne({ _id: req.query.roleId });
  const navBars: T_NavBar[] = await NavBarSchema.find().sort({ id: "asc" });

  // reduce the navbar tabs by userRole
  const allowedTabs = navBars.filter(({ _id }) => userAllowedTabs.navBarIds.includes(_id));
  res.status(200).json({ status: "success", data: allowedTabs });
});

export default getNavBars;
