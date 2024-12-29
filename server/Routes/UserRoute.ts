import test from '../Controllers/UserController';
import signup from '../Controllers/UserController';
import login from '../Controllers/UserController';
import { Router } from 'express';
const UserRoute = Router();

UserRoute.get('/', test.test);
UserRoute.post('/signup', signup.signup);
UserRoute.post('/login', login.login);
export default UserRoute;
