import createBill  from '../Controllers/BillController';
import { Router } from 'express';
const BillRouter = Router();

BillRouter.post('/create', createBill.createBill);
export default BillRouter;

