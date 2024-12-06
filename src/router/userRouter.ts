import { Router } from "express";
import { authValidation, createValidation, updateValidation } from "../middleware/userValidation";
import { authentication, createUser, deleteUser, readUser, updateUser } from "../controller/userController";
import { verifyToken } from "../middleware/authorization";

const router = Router()

router.post(`/`, [createValidation], createUser)
router.get(`/`,[verifyToken], readUser)
router.put(`/:id`,[verifyToken, updateValidation],updateUser)
router.delete(`/:id`,[verifyToken], deleteUser)
router.post(`/api/auth/login`,[authValidation], authentication)

export default router
