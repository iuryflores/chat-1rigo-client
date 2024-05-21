import axios from "axios";
import { io } from "socket.io-client";

const BASE_URL = "https://ritdscfinance.iuryflores.dev.br/";
const BASE_HOMOLOG = "http://localhost:9002/";
const TOKEN_COOKIE_NAME = "token";
const USER_ID_COOKIE_NAME = "userId";

const ambienteAtual = "homolog";

class Api {
  constructor() {
    this.api = axios.create({
      baseURL: ambienteAtual === "prd" ? BASE_URL : BASE_HOMOLOG,
    });
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();

    this.socket = null;
  }
  setupWebSocket(token) {
    this.socket = io(ambienteAtual === "prd" ? BASE_URL : BASE_HOMOLOG, {
      auth: { token },
    });
    this.socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });
    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });
    this.socket.on("paymentConfirmed", (data) => {
      console.log("Payment confirmed: ", data);
    });
  }
  connectToSocket(token) {
    if (!this.socket) {
      this.setupWebSocket(token);
    } else {
      this.socket.connect();
    }
  }
  disconnectFromSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
  setupRequestInterceptor() {
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(TOKEN_COOKIE_NAME);
        if (token) {
          config.headers = {
            Authorization: `Bearer ${token}`,
          };
        }
        return config;
      },
      (error) => {
        console.error("Erro na interceptação de requisição:", error);
        return Promise.reject(error);
      }
    );
  }
  setupResponseInterceptor() {
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }
  handleUnauthorized() {
    this.clearLocalStorage();
    window.location = "/login/";
  }
  login = async (loginInfo) => {
    try {
      const { data } = await this.api.post("/auth/login", loginInfo);
      const expirationTimeInSeconds =
        data.expirationTimestamp - Math.floor(Date.now() / 1000);
      this.setCookie(TOKEN_COOKIE_NAME, data.token, expirationTimeInSeconds);
      localStorage.setItem(USER_ID_COOKIE_NAME, data.id);
      localStorage.setItem(TOKEN_COOKIE_NAME, data.token);
      console.log(data);
      this.connectToSocket(data.token);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  setCookie(name, value, maxAge) {
    document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; Secure; HttpOnly; SameSite=Strict`;
  }
  clearLocalStorage() {
    localStorage.removeItem(TOKEN_COOKIE_NAME);
    localStorage.removeItem(USER_ID_COOKIE_NAME);
    localStorage.removeItem("tokenExpirationTimestamp");
  }
  signup = async (signupInfo) => {
    try {
      const { data } = await this.api.post("/auth/signup", signupInfo);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
  getUserData = async (id) => {
    try {
      const { data } = await this.api.get(`/user/private/${id}`);
      return data;
    } catch (error) {
      throw error.response.data.msg;
    }
  };
}
/* eslint-disable-next-line*/
export default new Api();
