import bcrypt from "bcryptjs";

const USER_KEY = "offlineUser";

export function saveOfflineUser(user) {
  const hash = bcrypt.hashSync(user.password, 10);

  const data = {
    emp_id: user.emp_id,
    name: user.name,
    hash
  };

  localStorage.setItem(USER_KEY, JSON.stringify(data));
}

export function getOfflineUser() {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  return JSON.parse(data);
}

export function offlineLogin(emp_id, password) {
  const user = getOfflineUser();
  if (!user) return false;

  if (user.emp_id !== emp_id) return false;

  return bcrypt.compareSync(password, user.hash);
}
