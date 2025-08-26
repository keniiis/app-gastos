import type { Gasto } from './types';

// Funciones para manejar gastos
function agregarGasto(e: Event): void {
    e.preventDefault();
    
    const descripcionElement = document.getElementById('gastoDescripcion') as HTMLInputElement;
    const montoElement = document.getElementById('gastoMonto') as HTMLInputElement;
    const categoriaElement = document.getElementById('gastoCategoria') as HTMLSelectElement;
    
    if (!descripcionElement || !montoElement || !categoriaElement) return;
    
    const gasto: Gasto = {
        id: Date.now(),
        descripcion: descripcionElement.value,
        monto: window.convertirMontoANumero(montoElement.value),
        categoria: categoriaElement.value,
        fecha: new Date().toISOString().split('T')[0]
    };
    
    window.gastos.unshift(gasto);
    localStorage.setItem('gastos', JSON.stringify(window.gastos));
    
    const form = document.getElementById('gastoForm') as HTMLFormElement;
    if (form) form.reset();
    
    window.actualizarResumen();
    mostrarGastos();
    window.actualizarGraficos();
    
    window.mostrarNotificacion('Gasto agregado correctamente', 'success');
}

function mostrarGastos(): void {
    const gastosList = document.getElementById('gastosList');
    if (!gastosList) return;
    
    gastosList.innerHTML = '';
    
    if (window.gastos.length === 0) {
        gastosList.innerHTML = '<p class="text-muted-foreground text-center py-4">No hay gastos registrados</p>';
        return;
    }
    
    window.gastos.forEach(gasto => {
        const gastoElement = document.createElement('div');
        gastoElement.className = 'flex justify-between items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors';
        gastoElement.innerHTML = `
            <div>
                <p class="font-medium">${gasto.descripcion}</p>
                <p class="text-sm text-muted-foreground">${gasto.categoria} • ${gasto.fecha}</p>
            </div>
            <div class="flex items-center">
                <span class="font-bold text-destructive mr-3">$${window.formatearCLP(gasto.monto)}</span>
                <button onclick="eliminarGasto(${gasto.id})" class="text-destructive hover:text-destructive/80 transition-colors">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        gastosList.appendChild(gastoElement);
    });
}

function eliminarGasto(id: number): void {
    window.gastos = window.gastos.filter(gasto => gasto.id !== id);
    localStorage.setItem('gastos', JSON.stringify(window.gastos));
    window.actualizarResumen();
    mostrarGastos();
    window.actualizarGraficos();
    window.mostrarNotificacion('Gasto eliminado', 'info');
}

// Exportar funciones
window.agregarGasto = agregarGasto;
window.mostrarGastos = mostrarGastos;
window.eliminarGasto = eliminarGasto;