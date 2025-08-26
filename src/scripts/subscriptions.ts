import type { Suscripcion } from './types';

// Funciones para manejar suscripciones
function agregarSuscripcion(e: Event): void {
    e.preventDefault();
    
    const servicioElement = document.getElementById('suscripcionServicio') as HTMLInputElement;
    const montoElement = document.getElementById('suscripcionMonto') as HTMLInputElement;
    const fechaElement = document.getElementById('suscripcionFecha') as HTMLInputElement;
    const otroServicioElement = document.getElementById('otroServicio') as HTMLInputElement;
    
    if (!servicioElement || !montoElement || !fechaElement) return;
    
    let servicio = servicioElement.value;
    let imagenUrl = '';
    
    // Obtener la URL de la imagen si no es "Otro"
    if (servicio !== 'Otro') {
        const selectedOption = document.querySelector(`.select-option[data-value="${servicio}"]`) as HTMLElement;
        if (selectedOption) {
            imagenUrl = selectedOption.getAttribute('data-image') || '';
        }
    } else {
        servicio = otroServicioElement?.value || '';
    }
    
    const suscripcion: Suscripcion = {
        id: Date.now(),
        servicio: servicio,
        monto: window.convertirMontoANumero(montoElement.value),
        fecha: fechaElement.value,
        imagen: imagenUrl
    };
    
    window.suscripciones.unshift(suscripcion);
    localStorage.setItem('suscripciones', JSON.stringify(window.suscripciones));
    
    // Resetear formulario
    const form = document.getElementById('suscripcionForm') as HTMLFormElement;
    if (form) form.reset();
    
    const otroServicioDiv = document.getElementById('otroServicioDiv');
    if (otroServicioDiv) otroServicioDiv.classList.add('hidden');
    
    const selectTrigger = document.getElementById('selectTrigger');
    if (selectTrigger) {
        selectTrigger.innerHTML = '<i class="fas fa-chevron-down text-gray-400"></i><span>Seleccionar servicio</span>';
    }
    
    document.querySelectorAll('.select-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    window.actualizarResumen();
    mostrarSuscripciones();
    window.actualizarGraficos();
    
    window.mostrarNotificacion('Suscripción agregada correctamente', 'success');
}

function mostrarSuscripciones(): void {
    const suscripcionesList = document.getElementById('suscripcionesList');
    if (!suscripcionesList) return;
    
    suscripcionesList.innerHTML = '';
    
    if (window.suscripciones.length === 0) {
        suscripcionesList.innerHTML = '<p class="text-gray-500 text-center py-4">No hay suscripciones registradas</p>';
        return;
    }
    
    window.suscripciones.forEach(suscripcion => {
        const suscripcionElement = document.createElement('div');
        suscripcionElement.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition';
        
        // Determinar el ícono o imagen según el servicio
        let iconoHtml = '';
        if (suscripcion.imagen) {
            iconoHtml = `<img src="${suscripcion.imagen}" alt="${suscripcion.servicio}" class="w-6 h-6 object-contain mr-2" onerror="this.onerror=null; this.src=''; this.className='fas fa-globe text-purple-500 mr-2';">`;
        } else {
            iconoHtml = '<i class="fas fa-globe text-purple-500 mr-2"></i>';
        }
        
        suscripcionElement.innerHTML = `
            <div>
                <p class="font-medium flex items-center">
                    ${iconoHtml}
                    ${suscripcion.servicio}
                </p>
                <p class="text-sm text-gray-500">Renovación: ${suscripcion.fecha}</p>
            </div>
            <div class="flex items-center">
                <span class="font-bold text-purple-600 mr-3">$${window.formatearCLP(suscripcion.monto)}</span>
                <button onclick="eliminarSuscripcion(${suscripcion.id})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        suscripcionesList.appendChild(suscripcionElement);
    });
}

function eliminarSuscripcion(id: number): void {
    window.suscripciones = window.suscripciones.filter(suscripcion => suscripcion.id !== id);
    localStorage.setItem('suscripciones', JSON.stringify(window.suscripciones));
    window.actualizarResumen();
    mostrarSuscripciones();
    window.actualizarGraficos();
    window.mostrarNotificacion('Suscripción eliminada', 'info');
}

// Exportar funciones
window.agregarSuscripcion = agregarSuscripcion;
window.mostrarSuscripciones = mostrarSuscripciones;
window.eliminarSuscripcion = eliminarSuscripcion;