import { emailLogin, googleLogin } from './mutations/login';
import { emailSignup } from './mutations/signup';
import { logout } from './mutations/logout';
import { validateEmail } from './queries/validateEmail';
import { refreshToken } from './queries/refreshToken';

export const authAPI = {
  emailLogin,
  googleLogin,
  emailSignup,
  validateEmail,
  refreshToken,
  logout,
};

