console.log("USANDO authService.js");

export async function loginRequest(email, password) {
  const response = await fetch("http://localhost:8000/usuaris/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error("Credenciales incorrectas");
  }

  return await response.json(); // aquí viene el token
}
