import { useEffect, useState } from "react";
import Login from "./Login"; // 1. Importamos el componente de seguridad

function App() {
  const [empleados, setEmpleados] = useState([]);
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  // --- ESTADO DE AUTENTICACIÓN ---
  const [estaLogueado, setEstaLogueado] = useState(false);

  // URL del backend en Render (tu URL real)
  const API_BASE_URL = "https://nexus-backend-xl9b.onrender.com";

  useEffect(() => {
    // Solo cargamos datos si el usuario ya entró al sistema
    if (estaLogueado) {
      cargarEmpleados();
    }
  }, [estaLogueado]);

  const cargarEmpleados = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/empleados`);
      if (!res.ok) throw new Error(`Error al cargar empleados: ${res.status}`);
      const data = await res.json();
      setEmpleados(data);
    } catch (err) {
      console.error("Error cargando empleados:", err);
      alert("No se pudieron cargar los empleados. Revisa si el backend está activo.");
    }
  };

  const enviarFormulario = async () => {
    if (!nombre || !codigo) {
      alert("Completa nombre y código");
      return;
    }

    const empleado = { nombre, codigo };
    const url = idSeleccionado 
      ? `${API_BASE_URL}/api/empleados/${idSeleccionado}`
      : `${API_BASE_URL}/api/empleados`;

    try {
      const response = await fetch(url, {
        method: idSeleccionado ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empleado)
      });

      if (response.ok) {
        alert(idSeleccionado ? "Registro actualizado con éxito" : "¡Sincronizado con éxito!");
        setIdSeleccionado(null);
        setNombre("");
        setCodigo("");
        await cargarEmpleados(); // recarga la lista
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert("Error al guardar: " + (errorData.message || response.statusText || "Revisa el backend"));
      }
    } catch (error) {
      console.error("Error en sincronizar:", error);
      alert("Error de conexión: " + error.message + ". Verifica que el backend esté activo.");
    }
  };

  const eliminarEmpleado = async (id) => {
    if (!window.confirm("¿ELIMINAR REGISTRO DEL SISTEMA?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/empleados/${id}`, { 
        method: "DELETE" 
      });

      if (response.ok) {
        alert("Registro eliminado");
        await cargarEmpleados();
      } else {
        alert("Error al eliminar");
      }
    } catch (err) {
      alert("Error de conexión al eliminar");
    }
  };

  const cerrarSesion = () => {
    setEstaLogueado(false);
  };

  const empleadosFiltrados = empleados.filter(emp => 
    emp.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- LÓGICA DE ACCESO ---
  if (!estaLogueado) {
    return <Login alLoguear={setEstaLogueado} />;
  }

  // Si está logueado, se muestra el Dashboard
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-cyan-50 font-sans selection:bg-cyan-500/30">
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative flex h-screen overflow-hidden border-cyan-900/30">
        {/* SIDEBAR */}
        <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-cyan-500/10 flex flex-col p-6 hidden md:flex">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
            <h1 className="text-xl font-black tracking-tighter uppercase">Nexus <span className="text-cyan-400">OS</span></h1>
          </div>
          <nav className="space-y-4 flex-1">
            <button className="w-full text-left px-4 py-2 bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-400">Dashboard</button>
            <button className="w-full text-left px-4 py-2 hover:bg-white/5 transition">Parametría</button>
            <button className="w-full text-left px-4 py-2 hover:bg-white/5 transition">Nómina V2</button>
          </nav>
          {/* Botón Salir */}
          <button
            onClick={cerrarSesion}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition mt-auto border-t border-white/5 pt-4"
          >
            Cerrar Terminal
          </button>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <header className="flex justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-4">
              <span className="text-xs text-cyan-500/50 font-mono tracking-widest uppercase">
                System Status: <span className="text-green-400">Encrypted</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold">Admin Core</p>
                <p className="text-[10px] text-gray-500 italic">Identidad Verificada</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 border border-white/20 shadow-[0_0_10px_rgba(6,182,212,0.3)]"></div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PANEL DE CAPTURA */}
            <section className="lg:col-span-1 space-y-6">
              <div className="bg-white/5 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  {idSeleccionado ? "Modificar Entidad" : "Ingreso de Datos"}
                </h2>
                <div className="space-y-4">
                  <input
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-cyan-500/50 outline-none transition-all text-white"
                    placeholder="Nombre del Agente"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                  />
                  <input
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-cyan-500/50 outline-none transition-all font-mono text-white"
                    placeholder="Código ID"
                    value={codigo}
                    onChange={e => setCodigo(e.target.value)}
                  />
                  <button
                    onClick={enviarFormulario}
                    className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
                      idSeleccionado
                        ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    }`}
                  >
                    {idSeleccionado ? "Actualizar Registro" : "Sincronizar"}
                  </button>
                  {idSeleccionado && (
                    <button 
                      onClick={() => {setIdSeleccionado(null); setNombre(""); setCodigo("");}} 
                      className="w-full text-[9px] text-gray-500 hover:text-white uppercase"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* PANEL DE DATOS */}
            <section className="lg:col-span-2">
              <div className="bg-black/20 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden shadow-inner">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                  <h3 className="font-bold tracking-tight text-xl italic text-gray-300">
                    Registros de <span className="text-cyan-400 underline decoration-cyan-500/30">Personal</span>
                  </h3>
                  <input
                    placeholder="Buscar agente..."
                    className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:ring-1 ring-cyan-500 outline-none w-full md:w-64 text-white"
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="text-[10px] uppercase text-gray-500 tracking-widest bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left">Ubicación</th>
                        <th className="px-6 py-4 text-left">Sujeto</th>
                        <th className="px-6 py-4 text-left">Código</th>
                        <th className="px-6 py-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {empleadosFiltrados.map((emp) => (
                        <tr key={emp.id} className="hover:bg-cyan-500/5 transition-all group">
                          <td className="px-6 py-4 font-mono text-xs text-cyan-500/50">#ID-{emp.id}</td>
                          <td className="px-6 py-4 font-bold text-gray-200">{emp.nombre}</td>
                          <td className="px-6 py-4">
                            <span className="bg-black/50 border border-cyan-500/30 text-cyan-400 text-[10px] px-2 py-1 rounded font-mono">
                              {emp.codigo}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex justify-center gap-4">
                            <button 
                              onClick={() => { 
                                setIdSeleccionado(emp.id); 
                                setNombre(emp.nombre); 
                                setCodigo(emp.codigo); 
                              }} 
                              className="text-blue-400 hover:text-blue-300 transition"
                            >
                              ✎
                            </button>
                            <button 
                              onClick={() => eliminarEmpleado(emp.id)} 
                              className="text-red-400 hover:text-red-300 transition"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
