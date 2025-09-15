
export const ResponseMessage = {
  usernotfound: 'User not found!',
  unknown: 'Something bad happened!; Please try again!',

  postcreate: 'Post Created Successfully!',
  postupdate: 'Post Updated Successfully!',
  postdelete: 'Post Deleted Successfully!',
};

export const SKIP_TOKEN_AUTH_ROUTES = [
  '/auth/login',

  '/home/getall',
  '/home/getbyid',
];
