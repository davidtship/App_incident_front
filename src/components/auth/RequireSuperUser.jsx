import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Snackbar, Alert, Slide } from "@mui/material";

const TransitionDown = (props) => <Slide {...props} direction="down" />;

export default function RequireSuperUser({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!user?.is_superuser) {
      setOpen(true);

      const timer = setTimeout(() => {
        setRedirect(true);
      }, 1500); // délai avant redirect

      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!user?.is_superuser && redirect) {
    return <Navigate to="/dashboards" replace />;
  }

  return (
    <>
      <Snackbar
        open={open}
        TransitionComponent={TransitionDown}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          ⛔ Accès refusé : vous n'êtes pas autorisé. Contactez l'administrateur.
        </Alert>
      </Snackbar>

      {user?.is_superuser && children}
    </>
  );
}