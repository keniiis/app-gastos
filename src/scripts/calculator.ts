// Funciones para la calculadora de interés compuesto
function calcularInteresCompuesto(): void {
    const capitalInicialElement = document.getElementById('capitalInicial') as HTMLInputElement;
    const ahorroMensualElement = document.getElementById('ahorroMensual') as HTMLInputElement;
    const tasaInteresElement = document.getElementById('tasaInteres') as HTMLInputElement;
    const periodoAniosElement = document.getElementById('periodoAnios') as HTMLInputElement;
    
    if (!capitalInicialElement || !ahorroMensualElement || !tasaInteresElement || !periodoAniosElement) return;
    
    const capitalInicial = window.convertirMontoANumero(capitalInicialElement.value);
    const ahorroMensual = window.convertirMontoANumero(ahorroMensualElement.value);
    const tasaInteres = parseFloat(tasaInteresElement.value) / 100;
    const periodoAnios = parseInt(periodoAniosElement.value);
    
    const meses = periodoAnios * 12;
    const tasaMensual = tasaInteres / 12;
    
    let capitalFinal = capitalInicial;
    
    for (let i = 0; i < meses; i++) {
        capitalFinal = capitalFinal * (1 + tasaMensual) + ahorroMensual;
    }
    
    const totalAhorrado = capitalInicial + (ahorroMensual * meses);
    const interesesGenerados = capitalFinal - totalAhorrado;
    
    const capitalFinalElement = document.getElementById('capitalFinal');
    const totalAhorradoElement = document.getElementById('totalAhorrado');
    const interesesGeneradosElement = document.getElementById('interesesGenerados');
    
    if (capitalFinalElement) capitalFinalElement.textContent = `$${window.formatearCLP(capitalFinal)}`;
    if (totalAhorradoElement) totalAhorradoElement.textContent = `$${window.formatearCLP(totalAhorrado)}`;
    if (interesesGeneradosElement) interesesGeneradosElement.textContent = `$${window.formatearCLP(interesesGenerados)}`;
    
    actualizarProgresoMeta();
}

function actualizarProgresoMeta(): void {
    const metaAhorroElement = document.getElementById('metaAhorro') as HTMLInputElement;
    const capitalFinalElement = document.getElementById('capitalFinal');
    
    if (!metaAhorroElement || !capitalFinalElement) return;
    
    const metaAhorro = window.convertirMontoANumero(metaAhorroElement.value);
    const capitalFinal = window.convertirMontoANumero(capitalFinalElement.textContent?.replace('$', '') || '0');
    
    const barraProgreso = document.getElementById('barraProgreso') as HTMLElement;
    const porcentajeMeta = document.getElementById('porcentajeMeta');
    
    if (metaAhorro > 0) {
        const porcentaje = Math.min(100, (capitalFinal / metaAhorro) * 100);
        if (barraProgreso) barraProgreso.style.width = `${porcentaje}%`;
        if (porcentajeMeta) porcentajeMeta.textContent = `${Math.round(porcentaje)}%`;
    } else {
        if (barraProgreso) barraProgreso.style.width = '0%';
        if (porcentajeMeta) porcentajeMeta.textContent = '0%';
    }
}

// Exportar funciones
window.calcularInteresCompuesto = calcularInteresCompuesto;
window.actualizarProgresoMeta = actualizarProgresoMeta;