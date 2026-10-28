import React, { useState } from "react";
import HomeScreen from "./src/screens/HomeScreen";
import RetiradaScreen from "./src/screens/RetiradaScreen";

export default function App() {
  const [tela, setTela] = useState<"inicio" | "retirada">("inicio");

  if (tela === "retirada") {
    return <RetiradaScreen onVoltarInicio={() => setTela("inicio")} />;
  }

  return <HomeScreen onNovaRetirada={() => setTela("retirada")} />;
}
