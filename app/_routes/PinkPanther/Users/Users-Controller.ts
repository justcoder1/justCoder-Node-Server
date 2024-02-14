import asyncHandler from "express-async-handler";
import UserSchema from "./Users-Model";

export const getUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await UserSchema.find();

    res.status(200).json({ data: users });
  } catch (err) {
    return next(res.status(500).json({ error: `Data not found` }));
  }
});

export const getUser = asyncHandler(async (req, res, next) => {
  const User = await UserSchema.findById(req.params.id);

  if (!User) {
    return next(res.status(404).json({ error: `Data not found with id of ${req.params.id}` }));
  }

  res.status(200).json({ success: true, data: User });
});

export const createUser = asyncHandler(async (req, res, next) => {
  const createUser = await UserSchema.create(req.body);

  res.status(201).json({ success: true, data: createUser });
});

export const updateUser = asyncHandler(async (req, res, next) => {
  let updateUser = await UserSchema.findById(req.params.id);

  if (!updateUser) {
    return next(res.status(404).json({ error: `Data not found with id of ${req.params.id}` }));
  }

  updateUser = await UserSchema.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: updateUser });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  let deleteUser = await UserSchema.findById(req.params.id);

  if (!deleteUser) {
    return next(res.status(404).json({ error: `Data not found with id of ${req.params.id}` }));
  }

  // deleteUser.remove();
  res.status(200).json({ success: true, data: {} });
});

export default getUsers;