import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  // Profile is only an entry point → directly open Menu
  useEffect(() => {
    navigate("/menu", { replace: true });
  }, [navigate]);

  return null;
}
