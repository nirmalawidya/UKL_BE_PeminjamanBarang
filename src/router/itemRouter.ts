import { Router } from "express";
import { verifyToken } from "../middleware/authorization";
import { createItem, deleteItem, readItem, updateItem } from "../controller/itemController";
import { createValidation, updateValidation } from "../middleware/itemValidation";
import authorizeAdmin from "../middleware/authorizeAdmin";

const router = Router()

router.post('/inventory', [verifyToken, authorizeAdmin, createValidation], createItem)
router.get('/inventory/:id?', [verifyToken], readItem)
router.put('/inventory/:id', [verifyToken, authorizeAdmin, updateValidation], updateItem)
router.delete('/inventory/:id', [verifyToken, authorizeAdmin], deleteItem)

export default router