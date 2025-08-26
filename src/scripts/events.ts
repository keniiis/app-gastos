// Event listeners y funciones de inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar la primera pestaña por defecto
    setTimeout(() => {
        const gastosTab = document.getElementById('gastos');
        if (gastosTab) gastosTab.style.display = "block";
    }, 100);
    
    // Inicializar datos
    window.mostrarGastos();
    window.mostrarSuscripciones();
    window.mostrarPerfiles();
    setTimeout(window.inicializarGraficos, 100);
    window.inicializarCalendario();
    
    // Event listeners para formularios
    const gastoForm = document.getElementById('gastoForm');
    if (gastoForm) gastoForm.addEventListener('submit', window.agregarGasto);
    
    const suscripcionForm = document.getElementById('suscripcionForm');
    if (suscripcionForm) suscripcionForm.addEventListener('submit', window.agregarSuscripcion);
    
    const perfilForm = document.getElementById('perfilForm');
    if (perfilForm) perfilForm.addEventListener('submit', window.agregarPerfil);
    
    const eventoForm = document.getElementById('eventoForm');
    if (eventoForm) eventoForm.addEventListener('submit', window.agregarEvento);
    
    // Event listeners para botones
    const limpiarDatosBtn = document.getElementById('limpiarDatos');
    if (limpiarDatosBtn) limpiarDatosBtn.addEventListener('click', limpiarTodosLosDatos);
    
    const mostrarFormularioPerfilBtn = document.getElementById('mostrarFormularioPerfilBtn');
    if (mostrarFormularioPerfilBtn) mostrarFormularioPerfilBtn.addEventListener('click', window.mostrarFormularioPerfil);
    
    const ocultarFormularioPerfilBtn = document.getElementById('ocultarFormularioPerfilBtn');
    if (ocultarFormularioPerfilBtn) ocultarFormularioPerfilBtn.addEventListener('click', window.ocultarFormularioPerfil);
    
    const calcularBtn = document.getElementById('calcularBtn');
    if (calcularBtn) calcularBtn.addEventListener('click', window.calcularInteresCompuesto);
    
    const mesAnterior = document.getElementById('mesAnterior');
    if (mesAnterior) mesAnterior.addEventListener('click', () => window.cambiarMes(-1));
    
    const mesSiguiente = document.getElementById('mesSiguiente');
    if (mesSiguiente) mesSiguiente.addEventListener('click', () => window.cambiarMes(1));
    
    const agregarEventoBtn = document.getElementById('agregarEventoBtn');
    if (agregarEventoBtn) agregarEventoBtn.addEventListener('click', window.agregarEventoCalendario);
    
    const cerrarModalBtn = document.getElementById('cerrarModalBtn');
    if (cerrarModalBtn) cerrarModalBtn.addEventListener('click', window.cerrarModalEvento);
    
    // Event listeners para el select personalizado
    const selectTrigger = document.getElementById('selectTrigger');
    const selectOptions = document.getElementById('selectOptions');
    
    if (selectTrigger && selectOptions) {
        // Abrir/cerrar el select
        selectTrigger.addEventListener('click', function() {
            selectOptions.classList.toggle('hidden');
        });
        
        // Cerrar el select al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!(e.target as Element).closest('.custom-select')) {
                selectOptions.classList.add('hidden');
            }
        });
        
        // Manejar la selección de opciones
        document.querySelectorAll('.select-option').forEach(option => {
            option.addEventListener('click', function() {
                // Remover selección previa
                document.querySelectorAll('.select-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Agregar selección actual
                this.classList.add('selected');
                
                // Actualizar el trigger
                const iconOrImage = this.querySelector('i, img');
                const clonedIconOrImage = iconOrImage?.cloneNode(true);
                const text = this.querySelector('span')?.textContent || '';
                
                selectTrigger.innerHTML = '';
                if (clonedIconOrImage) selectTrigger.appendChild(clonedIconOrImage);
                selectTrigger.appendChild(document.createTextNode(text));
                
                // Actualizar valor oculto
                const value = this.getAttribute('data-value') || '';
                const suscripcionServicio = document.getElementById('suscripcionServicio') as HTMLInputElement;
                if (suscripcionServicio) suscripcionServicio.value = value;
                
                // Mostrar/ocultar campo para "Otro"
                const otroServicioDiv = document.getElementById('otroServicioDiv');
                const otroServicio = document.getElementById('otroServicio') as HTMLInputElement;
                if (value === 'Otro') {
                    if (otroServicioDiv) otroServicioDiv.classList.remove('hidden');
                    if (otroServicio) otroServicio.required = true;
                } else {
                    if (otroServicioDiv) otroServicioDiv.classList.add('hidden');
                    if (otroServicio) otroServicio.required = false;
                }
                
                // Cerrar el select
                selectOptions.classList.add('hidden');
            });
        });
    }
    
    // Event listeners para formatear montos
    const montoInputs = ['gastoMonto', 'suscripcionMonto', 'perfilMeta', 'capitalInicial', 'ahorroMensual', 'eventoMonto', 'metaAhorro'];
    
    montoInputs.forEach(inputId => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        if (input) {
            input.addEventListener('blur', function() {
                if (this.value) {
                    const valor = window.convertirMontoANumero(this.value);
                    this.value = window.formatearCLP(valor);
                    if (inputId === 'metaAhorro') {
                        window.actualizarProgresoMeta();
                    }
                }
            });
            
            input.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9.]/g, '');
            });
        }
    });
    
    // Event listeners para las opciones de avatar
    document.querySelectorAll('.profile-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remover selección previa
            document.querySelectorAll('.profile-option').forEach(opt => {
                opt.classList.remove('border-blue-500', 'bg-blue-50');
                opt.classList.add('border-gray-200');
            });
            
            // Agregar selección actual
            this.classList.remove('border-gray-200');
            this.classList.add('border-blue-500', 'bg-blue-50');
            
            // Guardar el avatar seleccionado
            window.selectedAvatar = this.getAttribute('data-avatar') || '';
            const perfilAvatar = document.getElementById('perfilAvatar') as HTMLInputElement;
            if (perfilAvatar) perfilAvatar.value = window.selectedAvatar;
        });
    });
});

// Función para limpiar todos los datos
function limpiarTodosLosDatos(): void {
    if (confirm('¿Estás seguro de que deseas eliminar todos los datos? Esta acción no se puede deshacer.')) {
        // Limpiar arrays
        window.gastos = [];
        window.suscripciones = [];
        window.perfiles = [];
        window.eventosCalendario = [];
        
        // Limpiar localStorage
        localStorage.removeItem('gastos');
        localStorage.removeItem('suscripciones');
        localStorage.removeItem('perfiles');
        localStorage.removeItem('eventosCalendario');
        
        // Actualizar todas las vistas
        window.actualizarResumen();
        window.mostrarGastos();
        window.mostrarSuscripciones();
        window.mostrarPerfiles();
        window.inicializarCalendario();
        
        // Forzar actualización de los gráficos con datos vacíos
        setTimeout(() => {
            if (window.categoriaChart) {
                window.categoriaChart.data.labels = [];
                window.categoriaChart.data.datasets[0].data = [];
                window.categoriaChart.update();
            }
            
            if (window.comparativaChart) {
                window.comparativaChart.data.datasets[0].data = [0, 0];
                window.comparativaChart.update();
            }
        }, 100);
        
        window.mostrarNotificacion('Todos los datos han sido eliminados', 'warning');
    }
}

// Exportar función
window.limpiarTodosLosDatos = limpiarTodosLosDatos;