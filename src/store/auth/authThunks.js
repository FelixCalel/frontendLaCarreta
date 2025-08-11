import axios from "axios";
import { setAllowedRoutes } from "./SliceAuth";

const BASE_URL = import.meta.env.VITE_API_URL;

export const loadAllowedRoutes = () => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const roleId = state.auth?.roleId || localStorage.getItem("roleId");

      if (!roleId) {
        dispatch(setAllowedRoutes([]));
        return;
      }

      const token = localStorage.getItem("token");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const { data } = await axios.get(
        `${BASE_URL}/auth/permissions?roleId=${roleId}`,
        { headers }
      );

      const routes = Array.isArray(data?.routes) ? data.routes : [];
      dispatch(setAllowedRoutes(routes));
    } catch (err) {
      console.error("[loadAllowedRoutes] error:", err);
      dispatch(setAllowedRoutes([]));
    }
  };
};
