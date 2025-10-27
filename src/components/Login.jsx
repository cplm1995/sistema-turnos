import React, { useState, useEffect } from 'react'
import {
  CForm,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
} from "@coreui/react";
import { FaLock, FaUser } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [form, setForm] = useState({
      username: "",
      password: "",
    });
  
    const [loading, setLoading] = useState(false);
  
    // Manejar cambios en los inputs
    const handleChangeForm = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };
  
    // Quitar scroll solo en la pantalla de login
    useEffect(() => {
      document.body.classList.add("login-page");
      return () => {
        document.body.classList.remove("login-page");
      };
    }, []);
  
    // Manejar el inicio de sesión
    const handleSubmitForm = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          toast.error(data.message || "Usuario o contraseña incorrectos");
          return;
        }
  
        //  Verifica que el backend devuelva el usuario completo:
        // { token, user: { id, nombrecompleto, username, rol } }
        if (!data.token || !data.user) {
          toast.error("Respuesta inválida del servidor");
          return;
        }
  
        // Guardar token y usuario completo en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
  
        toast.success(
          `Bienvenido ${data.user.nombrecompleto || data.user.username}!`
        );
  
        // Redirigir al Dashboard
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } catch (error) {
        console.error("Error en login:", error);
        toast.error("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };


  return (
    <>
      <div>
        <div className="d-flex justify-content-center align-items-center vh-100">
          <ToastContainer position="top-right" autoClose={4000} />
          <CForm
            id="validationText"
            validated={true}
            onSubmit={handleSubmitForm}
            required
            className="p-4 shadow rounded bg-white"
            style={{ width: "320px" }}
          >
            <h4 className="text-center mb-4">Iniciar Sesión</h4>

            {/* Campo Usuario */}
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <FaUser />
              </CInputGroupText>
              <CFormInput
                type="text"
                placeholder="Ingrese usuario"
                autoComplete="username"
                name="username"
                value={form.username}
                onChange={handleChangeForm}
                required
              />
            </CInputGroup>

            {/* Campo Contraseña */}
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <FaLock />
              </CInputGroupText>
              <CFormInput
                type="password"
                placeholder="Contraseña"
                autoComplete="current-password"
                name="password"
                value={form.password}
                onChange={handleChangeForm}
                required
              />
            </CInputGroup>

            {/* Botón */}
            <CButton type='submit' color="primary" className="w-100">
              Ingresar
            </CButton>
          </CForm>
        </div>
      </div>
    </>
  );
};

export default Login;
