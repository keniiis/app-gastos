import type { EventoCalendario } from './types';

// Funciones para el calendario
function inicializarCalendario(): void {
    actualizarMesCalendario();
    generarDiasCalendario();
    mostrarEventosCalendario();
}

function actualizarMesCalendario(): void {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const mesActual = meses[window.mesActualCalendario.getMonth()];
    const añoActual = window.mesActualCalendario.getFullYear();
    const mesCalendarioElement = document.getElementById('mesCalendario');
    if (mesCalendarioElement) {
        mesCalendarioElement.textContent = `${mesActual} ${añoActual}`;
    }
}

function cambiarMes(direccion: number): void {
    window.mesActualCalendario.setMonth(window.mesActualCalendario.getMonth() + direccion);
    inicializarCalendario();
}

function generarDiasCalendario(): void {
    const diasCalendario = document.getElementById('diasCalendario');
    if (!diasCalendario) return;
    
    diasCalendario.innerHTML = '';
    
    const año = window.mesActualCalendario.getFullYear();
    const mes = window.mesActualCalendario.getMonth();
    
    // Obtener el primer día del mes
    const primerDia = new Date(año, mes, 1);
    const diaSemana = primerDia.getDay();
    
    // Obtener el último día del mes
    const ultimoDia = new Date(año, mes + 1, 0);
    const totalDias = ultimoDia.getDate();
    
    // Agregar celdas vacías al principio si es necesario
    for (let i = 0; i < diaSemana; i++) {
        const diaVacio = document.createElement('div');
        diaVacio.className = 'p-2';
        diasCalendario.appendChild(diaVacio);
    }
    
    // Agregar los días del mes
    for (let dia = 1; dia <= totalDias; dia++) {
        const diaElemento = document.createElement('div');
        diaElemento.className = 'calendar-day p-2 border border-gray-200 rounded-lg';
        
        const fechaActual = new Date(año, mes, dia);
        const fechaStr = fechaActual.toISOString().split('T')[0];
        
        // Verificar si hay eventos para este día
        const eventosDia = window.eventosCalendario.filter(evento => evento.fecha === fechaStr);
        
        if (eventosDia.length > 0) {
            // Determinar el tipo de evento para el color de fondo
            const tipoEvento = eventosDia[0].tipo;
            if (tipoEvento === 'ahorro') {
                diaElemento.classList.add('has-savings');
            } else if (tipoEvento === 'gasto') {
                diaElemento.classList.add('has-expense');
            }
            
            // Agregar indicador de evento
            const indicador = document.createElement('div');
            indicador.className = 'w-2 h-2 rounded-full mx-auto mt-1';
            
            if (tipoEvento === 'ahorro') {
                indicador.classList.add('bg-green-500');
            } else if (tipoEvento === 'meta') {
                indicador.classList.add('bg-yellow-500');
            } else if (tipoEvento === 'gasto') {
                indicador.classList.add('bg-red-500');
            }
            
            diaElemento.appendChild(indicador);
        }
        
        // Agregar el número del día
        const numeroDia = document.createElement('div');
        numeroDia.className = 'text-center font-medium';
        numeroDia.textContent = dia.toString();
        diaElemento.appendChild(numeroDia);
        
        diasCalendario.appendChild(diaElemento);
    }
}

function mostrarEventosCalendario(): void {
    const eventosDiv = document.getElementById('eventosCalendario');
    if (!eventosDiv) return;
    
    eventosDiv.innerHTML = '';
    
    if (window.eventosCalendario.length === 0) {
        eventosDiv.innerHTML = '<p class="text-gray-500 text-center py-4">No hay eventos registrados</p>';
        return;
    }
    
    const año = window.mesActualCalendario.getFullYear();
    const mes = window.mesActualCalendario.getMonth();
    
    // Filtrar eventos del mes actual
    const eventosMes = window.eventosCalendario.filter(evento => {
        const eventoFecha = new Date(evento.fecha);
        return eventoFecha.getFullYear() === año && eventoFecha.getMonth() === mes;
    });
    
    if (eventosMes.length === 0) {
        eventosDiv.innerHTML = '<p class="text-gray-500 text-center py-4">No hay eventos este mes</p>';
        return;
    }
    
    // Ordenar eventos por fecha
    eventosMes.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    
    eventosMes.forEach(evento => {
        const eventoElement = document.createElement('div');
        eventoElement.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg';
        
        let tipoIcono = '';
        let tipoColor = '';
        
        if (evento.tipo === 'ahorro') {
            tipoIcono = 'fa-piggy-bank';
            tipoColor = 'text-green-500';
        } else if (evento.tipo === 'meta') {
            tipoIcono = 'fa-flag-checkered';
            tipoColor = 'text-yellow-500';
        } else if (evento.tipo === 'gasto') {
            tipoIcono = 'fa-money-bill-wave';
            tipoColor = 'text-red-500';
        }
        
        const fecha = new Date(evento.fecha);
        const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
        
        eventoElement.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${tipoIcono} ${tipoColor} mr-3"></i>
                <div>
                    <p class="font-medium">${evento.descripcion}</p>
                    <p class="text-sm text-gray-500">${fechaFormateada}</p>
                </div>
            </div>
            <div class="flex items-center">
                <span class="font-bold ${tipoColor} mr-3">$${window.formatearCLP(evento.monto)}</span>
                <button onclick="eliminarEvento(${evento.id})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        eventosDiv.appendChild(eventoElement);
    });
}

function agregarEventoCalendario(): void {
    const modal = document.getElementById('modalEvento');
    if (modal) {
        modal.classList.remove('hidden');
        const form = document.getElementById('eventoForm') as HTMLFormElement;
        if (form) form.reset();
        
        // Establecer fecha actual por defecto
        const fechaActual = new Date().toISOString().split('T')[0];
        const eventoFecha = document.getElementById('eventoFecha') as HTMLInputElement;
        if (eventoFecha) eventoFecha.value = fechaActual;
    }
}

function cerrarModalEvento(): void {
    const modal = document.getElementById('modalEvento');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function agregarEvento(e: Event): void {
    e.preventDefault();
    
    const fechaElement = document.getElementById('eventoFecha') as HTMLInputElement;
    const descripcionElement = document.getElementById('eventoDescripcion') as HTMLInputElement;
    const montoElement = document.getElementById('eventoMonto') as HTMLInputElement;
    const tipoElement = document.getElementById('eventoTipo') as HTMLSelectElement;
    
    if (!fechaElement || !descripcionElement || !montoElement || !tipoElement) return;
    
    const evento: EventoCalendario = {
        id: Date.now(),
        fecha: fechaElement.value,
        descripcion: descripcionElement.value,
        monto: window.convertirMontoANumero(montoElement.value),
        tipo: tipoElement.value as 'ahorro' | 'meta' | 'gasto'
    };
    
    window.eventosCalendario.push(evento);
    localStorage.setItem('eventosCalendario', JSON.stringify(window.eventosCalendario));
    
    cerrarModalEvento();
    inicializarCalendario();
    
    window.mostrarNotificacion('Evento agregado correctamente', 'success');
}

function eliminarEvento(eventoId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
        window.eventosCalendario = window.eventosCalendario.filter(evento => evento.id !== eventoId);
        localStorage.setItem('eventosCalendario', JSON.stringify(window.eventosCalendario));
        inicializarCalendario();
        window.mostrarNotificacion('Evento eliminado', 'info');
    }
}

// Exportar funciones
window.inicializarCalendario = inicializarCalendario;
window.cambiarMes = cambiarMes;
window.agregarEventoCalendario = agregarEventoCalendario;
window.cerrarModalEvento = cerrarModalEvento;
window.agregarEvento = agregarEvento;
window.eliminarEvento = eliminarEvento;