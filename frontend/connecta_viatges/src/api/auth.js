export async function loginRequest(email, password) {
  const res = await fetch("http://localhost:8000/usuaris/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    throw new Error("Credenciales incorrectas");
  }

  return await res.json();
}
