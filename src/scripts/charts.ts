// Funciones para manejar gráficos
function inicializarGraficos(): void {
    // Gráfico de categorías
    const categoriaCtx = document.getElementById('categoriaChart') as HTMLCanvasElement;
    if (categoriaCtx) {
        window.categoriaChart = new (window as any).Chart(categoriaCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context: any) {
                                return `${context.label}: $${window.formatearCLP(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico comparativo
    const comparativaCtx = document.getElementById('comparativaChart') as HTMLCanvasElement;
    if (comparativaCtx) {
        window.comparativaChart = new (window as any).Chart(comparativaCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Gastos', 'Suscripciones'],
                datasets: [{
                    label: 'Monto (CLP)',
                    data: [0, 0],
                    backgroundColor: ['#10B981', '#8B5CF6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value: any) {
                                return '$' + window.formatearCLP(value);
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context: any) {
                                return `Monto: $${window.formatearCLP(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    actualizarGraficos();
}

function actualizarGraficos(): void {
    if (!window.categoriaChart || !window.comparativaChart) return;
    
    // Actualizar gráfico de categorías
    const categorias: { [key: string]: number } = {};
    window.gastos.forEach(gasto => {
        categorias[gasto.categoria] = (categorias[gasto.categoria] || 0) + gasto.monto;
    });
    
    window.categoriaChart.data.labels = Object.keys(categorias);
    window.categoriaChart.data.datasets[0].data = Object.values(categorias);
    window.categoriaChart.update();
    
    // Actualizar gráfico comparativo
    const totalGastos = window.gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
    const totalSuscripciones = window.suscripciones.reduce((sum, suscripcion) => sum + suscripcion.monto, 0);
    
    window.comparativaChart.data.datasets[0].data = [totalGastos, totalSuscripciones];
    window.comparativaChart.update();
}

// Exportar funciones
window.inicializarGraficos = inicializarGraficos;
window.actualizarGraficos = actualizarGraficos;