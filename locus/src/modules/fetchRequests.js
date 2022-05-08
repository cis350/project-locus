async function register(firstName, lastName, email, password, year, major) {
  const result = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userFirstName: firstName,
      userLastName: lastName,
      userEmail: email,
      userPassword: password,
      userYear: year,
      userMajor: major,
      lockoutStatus: new Date(),
    }),
  });
  const resultJson = await result.json();
  return { status: result.status, jsonContent: resultJson };
}

async function login(userEmail, userPassword) {
  const result = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userEmail,
      password: userPassword,
    }),
  });
  const resultJson = await result.json();
  return { status: result.status, jsonContent: resultJson };
}

async function getUserId(userEmail) {
  const result = await fetch(`/id/${userEmail}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const resultJson = await result.json();
  return { status: result.status, jsonContent: resultJson };
}

async function getLockout(userEmail) {
  const result = await fetch(`/lockout/${userEmail}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const resultJson = await result.json();
  return { status: result.status, jsonContent: resultJson };
}

async function updateLockout(userEmail, lockout) {
  const result = await fetch(`/lockoutupdate/${userEmail}/${lockout}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  const resultJson = await result.json();
  return { status: result.status, jsonContent: resultJson };
}

module.exports = {
  register, login, getUserId, getLockout, updateLockout,
};