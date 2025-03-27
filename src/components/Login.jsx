import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();



  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch("https://chamados-softline-k3bsb.ondigitalocean.app/usuario/login", {
// https://chamados-softline-k3bsb.ondigitalocean.app
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: login, password }),
      });

      if (!response.ok) {
        setError('Login ou senha inválidos.');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      const decodedToken = jwtDecode(data.token);
      console.log("Token decodificado:", decodedToken);

      const roles = decodedToken.roles || [];

      // Redirecionamento com base na role do usuário
      if (roles.includes('ADMIN')) {
        navigate('/components/adminSoftLine/AdminSoftLineListagem');
      } else if (roles.includes('USER')) {
        navigate('/components/user/UsuarioListagem');
      } else if (roles.includes('USERSOFTLINE')) {
        navigate('/components/userSoftline/UserSoftlineListagem');
      } else if (roles.includes('IMPLANTACAO')) {
        navigate('/components/implantacao/ListagemImplantacao');
      } else if (roles.includes('CUSTOMIZACAO')) {
        navigate('/components/customizacao/ListagemCustomizacao');
      } else {
        setError("Erro ao obter dados do usuário.");
      }
    } catch (error) {
      setError('Erro ao conectar ao servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundImage: "url('/img1.jpg')", // Usa a imagem local
      backgroundSize: "cover", // Garante que a imagem cubra toda a tela
      backgroundPosition: "center", // Centraliza a imagem
    }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.9)", // Fundo branco com transparência
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        width: "350px"
      }}>
        <div style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center"
        }}>
          <img
            src="/soft_line_logo.jpg"
            alt="Soft Line Logo"
            style={{
              maxWidth: "100px",
              height: "auto",
              marginBottom: "20px"
            }}
          />
        </div>
        <h2 style={{ marginBottom: "20px" }}>Login</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            placeholder="Email"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="rounded-pill"
            style={{
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-pill"
            style={{
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            className=" rounded-pill"
            style={{
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
          >
            {isLoading ? "Carregando..." : "Entrar"}
          </button>
        </form>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;