import React, { useEffect, useState } from "react";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem("visited");
    if (!visited) {
      setOpen(true);
      localStorage.setItem("visited", "true");
    }
  }, []);

  if (!open) return null;

  return (
    <div onClick={() => setOpen(false)}>
      Bem vindo!
    </div>
  );
}
