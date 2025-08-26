import type { Gasto, Suscripcion, Perfil, EventoCalendario, TipoNotificacion } from './types';

// Variables globales
let gastos: Gasto[] = JSON.parse(localStorage.getItem('gastos') || '[]');
let suscripciones: Suscripcion[] = JSON.parse(localStorage.getItem('suscripciones') || '[]');
let perfiles: Perfil[] = JSON.parse(localStorage.getItem('perfiles') || '[]');
let eventosCalendario: EventoCalendario[] = JSON.parse(localStorage.getItem('eventosCalendario') || '[]');
let categoriaChart: any;
let comparativaChart: any;
let mesActualCalendario: Date = new Date();
let selectedAvatar: string = '';

// Función para convertir monto en formato chileno a número
function convertirMontoANumero(montoStr: string): number {
    return parseInt(montoStr.replace(/\./g, ''), 10) || 0;
}

// Función para formatear número a formato chileno (0.000)
function formatearCLP(monto: number): string {
    const montoEntero = Math.round(Number(monto));
    return montoEntero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Función para mostrar el mes actual
function mostrarMesActual(): void {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const fechaActual = new Date();
    const mesActual = meses[fechaActual.getMonth()];
    const currentMonthElement = document.getElementById('currentMonth');
    if (currentMonthElement) {
        currentMonthElement.textContent = mesActual + ' ' + fechaActual.getFullYear();
    }
}

// Función para actualizar resumen
function actualizarResumen(): void {
    const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
    const totalSuscripciones = suscripciones.reduce((sum, suscripcion) => sum + suscripcion.monto, 0);
    const totalMensual = totalGastos + totalSuscripciones;
    
    const totalGastosElement = document.getElementById('totalGastos');
    const totalSuscripcionesElement = document.getElementById('totalSuscripciones');
    const totalMensualElement = document.getElementById('totalMensual');
    
    if (totalGastosElement) totalGastosElement.textContent = `$${formatearCLP(totalGastos)}`;
    if (totalSuscripcionesElement) totalSuscripcionesElement.textContent = `$${formatearCLP(totalSuscripciones)}`;
    if (totalMensualElement) totalMensualElement.textContent = `$${formatearCLP(totalMensual)}`;
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje: string, tipo: TipoNotificacion): void {
    const notificacion = document.createElement('div');
    notificacion.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
        tipo === 'success' ? 'bg-green-500' : 
        tipo === 'warning' ? 'bg-yellow-500' : 
        tipo === 'info' ? 'bg-blue-500' : 'bg-red-500'
    }`;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Exportar funciones para uso global
window.convertirMontoANumero = convertirMontoANumero;
window.formatearCLP = formatearCLP;
window.mostrarNotificacion = mostrarNotificacion;
window.actualizarResumen = actualizarResumen;
window.gastos = gastos;
window.suscripciones = suscripciones;
window.perfiles = perfiles;
window.eventosCalendario = eventosCalendario;
window.mesActualCalendario = mesActualCalendario;
window.selectedAvatar = selectedAvatar;
window.categoriaChart = categoriaChart;
window.comparativaChart = comparativaChart;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    mostrarMesActual();
    actualizarResumen();
});