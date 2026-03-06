import React, { useState } from "react";

function Login({ alLoguear }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const manejarLogin = () => {
    // Simulación de acceso (luego lo conectaremos a la DB de Spring Boot)
    if (user === "admin" && pass === "1234") {
      alLoguear(true);
    } else {
      alert("ERROR DE AUTENTICACIÓN: Acceso denegado al núcleo.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/10 blur-[120px] rounded-full"></div>

      <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[2rem] border border-cyan-500/20 shadow-[0_0_80px_rgba(6,182,212,0.1)] w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-cyan-600 to-blue-500 rounded-2xl mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center">
             <span className="text-white text-3xl font-black">N</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Nexus <span className="text-cyan-400">Security</span></h1>
          <div className="h-1 w-20 bg-cyan-500 mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/60 ml-1 mb-2 block font-bold">Protocolo de Usuario</label>
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-500 focus:ring-1 ring-cyan-500/30 transition-all placeholder:text-gray-700"
              onChange={(e) => setUser(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/60 ml-1 mb-2 block font-bold">Clave de Encriptación</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-cyan-500 focus:ring-1 ring-cyan-500/30 transition-all placeholder:text-gray-700"
              onChange={(e) => setPass(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && manejarLogin()}
            />
          </div>

          <button
            onClick={manejarLogin}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0a0f1a] font-black py-4 rounded-xl uppercase tracking-[0.3em] text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] active:scale-95 mt-4"
          >
            Validar Acceso
          </button>
        </div>

        <p className="text-center text-[9px] text-gray-600 mt-8 uppercase tracking-widest">
          Sistema de Control de Personal v2.6 // Siesa Compatible
        </p>
      </div>
    </div>
  );
}

export default Login;