import type { Perfil, EventoCalendario } from './types';

// Funciones para manejar perfiles de ahorro
function agregarPerfil(e: Event): void {
    e.preventDefault();
    
    if (!window.selectedAvatar) {
        window.mostrarNotificacion('Por favor selecciona un avatar', 'warning');
        return;
    }
    
    const nombreElement = document.getElementById('perfilNombre') as HTMLInputElement;
    const metaElement = document.getElementById('perfilMeta') as HTMLInputElement;
    
    if (!nombreElement || !metaElement) return;
    
    const perfil: Perfil = {
        id: Date.now(),
        nombre: nombreElement.value,
        meta: window.convertirMontoANumero(metaElement.value),
        avatar: window.selectedAvatar,
        ahorroActual: 0,
        fechaCreacion: new Date().toISOString().split('T')[0]
    };
    
    window.perfiles.push(perfil);
    localStorage.setItem('perfiles', JSON.stringify(window.perfiles));
    
    const form = document.getElementById('perfilForm') as HTMLFormElement;
    if (form) form.reset();
    
    ocultarFormularioPerfil();
    mostrarPerfiles();
    
    window.mostrarNotificacion('Perfil creado correctamente', 'success');
}

function mostrarPerfiles(): void {
    const perfilesList = document.getElementById('perfilesList');
    if (!perfilesList) return;
    
    perfilesList.innerHTML = '';
    
    if (window.perfiles.length === 0) {
        perfilesList.innerHTML = '<p class="text-gray-500 text-center col-span-3 py-8">No hay perfiles de ahorro creados</p>';
        return;
    }
    
    window.perfiles.forEach(perfil => {
        const progreso = Math.min(100, (perfil.ahorroActual / perfil.meta) * 100);
        const avatarIcon = getAvatarIcon(perfil.avatar);
        
        const perfilElement = document.createElement('div');
        perfilElement.className = 'profile-card bg-white rounded-xl shadow p-6';
        perfilElement.innerHTML = `
            <div class="flex items-center mb-4">
                <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    ${avatarIcon}
                </div>
                <div>
                    <h3 class="text-lg font-bold text-gray-800">${perfil.nombre}</h3>
                    <p class="text-sm text-gray-500">Creado el ${formatearFecha(perfil.fechaCreacion)}</p>
                </div>
            </div>
            
            <div class="mb-4">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Ahorro actual</span>
                    <span>$${window.formatearCLP(perfil.ahorroActual)}</span>
                </div>
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Meta</span>
                    <span>$${window.formatearCLP(perfil.meta)}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div class="bg-green-500 h-2 rounded-full" style="width: ${progreso}%"></div>
                </div>
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>${Math.round(progreso)}%</span>
                    <span>100%</span>
                </div>
            </div>
            
            <div class="flex space-x-2">
                <button onclick="agregarAhorro(${perfil.id})" class="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-lg transition duration-200 text-sm">
                    <i class="fas fa-plus mr-1"></i>
                    Ahorrar
                </button>
                <button onclick="eliminarPerfil(${perfil.id})" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg transition duration-200 text-sm">
                    <i class="fas fa-trash-alt mr-1"></i>
                    Eliminar
                </button>
            </div>
        `;
        perfilesList.appendChild(perfilElement);
    });
}

function getAvatarIcon(avatarType: string): string {
    const icons: { [key: string]: string } = {
        boy: '<i class="fas fa-boy text-3xl text-blue-500"></i>',
        girl: '<i class="fas fa-girl text-3xl text-pink-500"></i>',
        cat: '<i class="fas fa-cat text-3xl text-yellow-500"></i>',
        dog: '<i class="fas fa-dog text-3xl text-brown-500"></i>',
        rocket: '<i class="fas fa-rocket text-3xl text-purple-500"></i>',
        star: '<i class="fas fa-star text-3xl text-yellow-400"></i>',
        heart: '<i class="fas fa-heart text-3xl text-red-500"></i>',
        crown: '<i class="fas fa-crown text-3xl text-yellow-500"></i>'
    };
    return icons[avatarType] || icons.boy;
}

function formatearFecha(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
}

function mostrarFormularioPerfil(): void {
    const formulario = document.getElementById('formularioPerfil');
    if (formulario) {
        formulario.classList.remove('hidden');
        const form = document.getElementById('perfilForm') as HTMLFormElement;
        if (form) form.reset();
        
        document.querySelectorAll('.profile-option').forEach(opt => {
            opt.classList.remove('border-blue-500', 'bg-blue-50');
            opt.classList.add('border-gray-200');
        });
        window.selectedAvatar = '';
    }
}

function ocultarFormularioPerfil(): void {
    const formulario = document.getElementById('formularioPerfil');
    if (formulario) {
        formulario.classList.add('hidden');
    }
}

function agregarAhorro(perfilId: number): void {
    const monto = prompt('Ingrese el monto a ahorrar (CLP):', '0');
    if (monto === null) return;
    
    const montoNum = window.convertirMontoANumero(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
        window.mostrarNotificacion('Monto inválido', 'warning');
        return;
    }
    
    const perfil = window.perfiles.find(p => p.id === perfilId);
    if (perfil) {
        perfil.ahorroActual += montoNum;
        localStorage.setItem('perfiles', JSON.stringify(window.perfiles));
        mostrarPerfiles();
        window.mostrarNotificacion(`Ahorro de $${window.formatearCLP(montoNum)} agregado correctamente`, 'success');
        
        // Agregar evento al calendario
        const evento: EventoCalendario = {
            id: Date.now(),
            fecha: new Date().toISOString().split('T')[0],
            descripcion: `Ahorro de ${perfil.nombre}`,
            monto: montoNum,
            tipo: 'ahorro'
        };
        window.eventosCalendario.push(evento);
        localStorage.setItem('eventosCalendario', JSON.stringify(window.eventosCalendario));
    }
}

function eliminarPerfil(perfilId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este perfil?')) {
        window.perfiles = window.perfiles.filter(perfil => perfil.id !== perfilId);
        localStorage.setItem('perfiles', JSON.stringify(window.perfiles));
        mostrarPerfiles();
        window.mostrarNotificacion('Perfil eliminado', 'info');
    }
}

// Exportar funciones
window.agregarPerfil = agregarPerfil;
window.mostrarPerfiles = mostrarPerfiles;
window.mostrarFormularioPerfil = mostrarFormularioPerfil;
window.ocultarFormularioPerfil = ocultarFormularioPerfil;
window.agregarAhorro = agregarAhorro;
window.eliminarPerfil = eliminarPerfil;