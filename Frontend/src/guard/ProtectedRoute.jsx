import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useEffect } from "react";
import { useState } from "react";

export default function ProtectedRoute({ children, allowRoles = [] }) {
  const { user, authenticated } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);

  useEffect(()=>{
    setChecked(true)
  },[])

  if (checked && !authenticated) return <Navigate to={"/login"} />;

  if (checked && allowRoles && !allowRoles.includes(user.role))
    return <Navigate to={"/login"} />;

  if (checked) {
      return children;
  }
}
