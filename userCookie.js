import cookies from 'js-cookie';
//user cookies
export const getUserOnBoardFromCookie = () => {
  const cookie = cookies.get('onboardingUser');
  if (!cookie) {
    return null;
  }
  return cookie;
};

export const setUserOnBoardCookie = token => {
  cookies.set('onboardingUser', token);
};


export const removeUserOnBoardCookie = () => cookies.remove('onboardingUser');

