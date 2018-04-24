
export const handleFbResponse = res =>
  // console.log(`Facebook response: ${JSON.stringify(res)}`);
  fetch(`/api/users/login?token=${res.accessToken}&email=${res.email}&name=${res.name}&userId=${res.id}`);

export const getUser = async (token) => {
  // get user from token
  const res = await fetch('/api/users/me', {
    headers: { 'x-auth-token': token },
  });

  // token probably expired
  if (res.status === 401) {
    localStorage.removeItem('jwtToken');
    return null;
  }

  return res.json();
};

