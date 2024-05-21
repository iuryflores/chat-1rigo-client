import React, { useState, useEffect } from "react";

import api from "../utils/api.utils.js";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";

export const LoginPage = ({
  setLoggedIn,
  handleSignup,
  message,
  setMessage,
}) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    setMessage(null);
    e.preventDefault();

    if (!email || !password) {
      setError("Necessário preencher usuário e senha!");
    } else {
      try {
        await api.login({ email, password });
        setLoggedIn(true);
        navigate(`/chat`);
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }
  };
  const [signupMode, setSignupMode] = useState(false);

  const signModeSwith = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setNewPassword("");
    setConfirmPassword("");
    setDocument("");
    setNewEmail("");
    setSignupMode(!signupMode);
    setError(null);
  };

  const [fullName, setFullName] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [document, setDocument] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (newPassword === confirmPassword) {
      try {
        await api.signup({
          fullName,
          confirmPassword,
          document,
          newEmail,
        });
        setMessage("Usuário criado com sucesso!");
        handleSignup(fullName, newPassword, document, newEmail);
        signModeSwith(false);
      } catch (error) {
        setError(error);
      }
    } else {
      setError("A senha e a confirmação de senha não são iguais.");
    }
  };

  const [passwordError, setPasswordError] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);

    // Validar a senha conforme seus critérios (8 caracteres, pelo menos um número, pelo menos um caractere especial).
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    const isValid = passwordRegex.test(newPassword);

    if (isValid) {
      setPasswordError("");
      setPasswordValid(true);
    } else {
      const passwordRequirements = [
        "Pelo menos 8 caracteres",
        "Pelo menos uma letra minúscula",
        "Pelo menos uma letra maiúscula",
        "Pelo menos um número",
        "Pelo menos um caractere especial (@$!%*#?&)",
      ];
      const errorHtml = passwordRequirements.map((requirement, index) => (
        <div key={index} className="text-normal">
          {requirement}
        </div>
      ));
      setPasswordError(
        <div className="passwordReq text-normal small">
          <strong> A senha deve atender aos seguintes requisitos:</strong>
          <small> {errorHtml}</small>
        </div>
      );
      setPasswordValid(false);
    }
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // const handleConfirmPassword = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (password === confirmPassword) {
  //       console.log(password);
  //       console.log(confirmPassword);

  //       await api.setPassword({
  //         confirmPassword,
  //         newEmail
  //       });
  //       setMessage("Sua senha foi definida com sucesso!");
  //       navigate("/");
  //     } else {
  //       setError("As senhas não coincidem. Por favor, corrija.");
  //     }
  //   } catch (error) {
  //     setError(error);
  //   }
  // };

  useEffect(() => {
    setTimeout(() => {
      setError(null);
      setMessage(null);
    }, 10000);
  }, [setError, setMessage]);

  return (
    <div className="d-flex flex-column">
      <div className="container d-flex flex-column align-items-start p-3">
        <h2
          className="no-margin"
          style={{ fontWeight: "bolder", textAlign: "left" }}
        >
          Portal{" "}
        </h2>
      </div>
      <div className="container" style={{ marginBottom: "100px" }}>
        {signupMode ? (
          <form onSubmit={handleSignupSubmit} className="p-3 login-form">
            <h5 className="mb-3 text-normal">Cadastro de usuário</h5>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Nome completo
              </label>
              <input
                type="text"
                className="form-control"
                placeholder=""
                value={fullName}
                autoComplete="fullName"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="document" className="form-label">
                CPF
              </label>
              <InputMask
                className="form-control mb-3"
                value={document}
                name="document"
                type="text"
                mask="999.999.999-99"
                onChange={(e) => setDocument(e.target.value)}
              />
            </div>{" "}
            <div className="mb-3">
              <label htmlFor="document" className="form-label">
                Email
              </label>
              <input
                className="form-control mb-3"
                value={newEmail}
                name="newEmail"
                type="newEmail"
                onChange={(e) => setNewEmail(e.target.value)}
                autoComplete="newEmail"
              />
            </div>
            <label htmlFor="newPassword" className="form-label">
              Senha
            </label>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder=""
                value={newPassword}
                autoComplete="current-password"
                onChange={handlePasswordChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Senha
              </label>
              <input
                type="password"
                className="form-control"
                placeholder=""
                value={confirmPassword}
                autoComplete="current-password"
                onChange={handleConfirmPasswordChange}
              />
            </div>
            {passwordError && (
              <div className="alert alert-danger mt-2">{passwordError}</div>
            )}
            <div className="d-flex flex-column align-items-center w-100 mt-3">
              {message && (
                <div className="alert alert-success d-flex flex-column align-items-center w-100 text-normal">
                  {message}
                </div>
              )}
              {error && (
                <div className="alert alert-danger d-flex flex-column align-items-center w-100 text-center text-normal">
                  {error}
                </div>
              )}
            </div>
            <div className="mt-3 d-flex flex-column mb-3">
              <button
                type="submit"
                className="btn buttons"
                disabled={!passwordValid}
              >
                Cadastrar
              </button>
            </div>
            <div className="mt-3 d-flex flex-column">
              <span className="d-flex flex-column align-items-center w-100">
                Já tem uma conta?{" "}
              </span>
              <span className="btn buttons-outline" onClick={signModeSwith}>
                {" "}
                Faça login
              </span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <p className="mt-3 w-100 text-left">
              Por favor, faça login com suas credenciais
            </p>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Senha"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-3 d-flex flex-column mb-3">
              <button type="submit" className="btn buttons">
                Entrar
              </button>
            </div>
            <div className="d-flex flex-column align-items-center w-100 mt-3">
              {message && (
                <div className="alert alert-success d-flex flex-column align-items-center w-100">
                  {message}
                </div>
              )}
              {error && (
                <div className="alert alert-danger d-flex flex-column align-items-center w-100 text-center">
                  {error}
                </div>
              )}
            </div>
            <div className="mt-3 d-flex flex-column">
              <span className="d-flex flex-column align-items-center w-100">
                Não tem uma conta?{" "}
              </span>
              <span className="btn buttons-outline" onClick={signModeSwith}>
                Cadastre-se
              </span>
            </div>
            <small>
              <div className="mt-3">
                <a href="/esqueceu-senha">Esqueceu a Senha?</a>
              </div>
              <div className="">
                <a href="/politica-de-privacidade">Política de Privacidade</a>
              </div>
            </small>
          </form>
        )}
      </div>
    </div>
  );
};
