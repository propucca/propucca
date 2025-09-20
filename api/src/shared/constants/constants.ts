export const ResponseMessage = {
  usernotfound: 'User not found!',
  unknown: 'Something bad happened!; Please try again!',
};

export const SKIP_TOKEN_AUTH_ROUTES = [
  '/auth/login',
  '/auth/signup',
  '/auth/forget-password',
  '/email/send-email',
  '/auth/send-otp',
  '/auth/verify-otp',
];
