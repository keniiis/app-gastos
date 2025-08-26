// Tipos globales para la aplicación
export interface Gasto {
  id: number;
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
}

export interface Suscripcion {
  id: number;
  servicio: string;
  monto: number;
  fecha: string;
  imagen?: string;
}

export interface Perfil {
  id: number;
  nombre: string;
  meta: number;
  avatar: string;
  ahorroActual: number;
  fechaCreacion: string;
}

export interface EventoCalendario {
  id: number;
  fecha: string;
  descripcion: string;
  monto: number;
  tipo: 'ahorro' | 'meta' | 'gasto';
}

export type TipoNotificacion = 'success' | 'warning' | 'info' | 'error';

export interface GlobalState {
  gastos: Gasto[];
  suscripciones: Suscripcion[];
  perfiles: Perfil[];
  eventosCalendario: EventoCalendario[];
  mesActualCalendario: Date;
  selectedAvatar: string;
  categoriaChart: any;
  comparativaChart: any;
}

// Declaraciones globales para window
declare global {
  interface Window {
    convertirMontoANumero: (montoStr: string) => number;
    formatearCLP: (monto: number) => string;
    mostrarNotificacion: (mensaje: string, tipo: TipoNotificacion) => void;
    actualizarResumen: () => void;
    gastos: Gasto[];
    suscripciones: Suscripcion[];
    perfiles: Perfil[];
    eventosCalendario: EventoCalendario[];
    mesActualCalendario: Date;
    selectedAvatar: string;
    categoriaChart: any;
    comparativaChart: any;
    inicializarGraficos: () => void;
    actualizarGraficos: () => void;
    agregarGasto: (e: Event) => void;
    mostrarGastos: () => void;
    eliminarGasto: (id: number) => void;
    agregarSuscripcion: (e: Event) => void;
    mostrarSuscripciones: () => void;
    eliminarSuscripcion: (id: number) => void;
    agregarPerfil: (e: Event) => void;
    mostrarPerfiles: () => void;
    mostrarFormularioPerfil: () => void;
    ocultarFormularioPerfil: () => void;
    agregarAhorro: (perfilId: number) => void;
    eliminarPerfil: (perfilId: number) => void;
    calcularInteresCompuesto: () => void;
    actualizarProgresoMeta: () => void;
    inicializarCalendario: () => void;
    cambiarMes: (direccion: number) => void;
    agregarEventoCalendario: () => void;
    cerrarModalEvento: () => void;
    agregarEvento: (e: Event) => void;
    eliminarEvento: (eventoId: number) => void;
    limpiarTodosLosDatos: () => void;
  }
}