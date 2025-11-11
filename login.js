// Verificar si ya hay sesión activa
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'index.html';
    }
});

// Manejar envío del formulario
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validaciones
    if (!email || !password) {
        showMessage('Por favor completa todos los campos', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('Por favor ingresa un email válido', 'error');
        return;
    }
    
    // Mostrar loading
    showLoading(true);
    
    try {
        // Buscar usuario en Supabase
        const { data: usuarios, error } = await supabase
            .from('clientes_web')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error) {
            throw new Error('Usuario no encontrado');
        }
        
        // Verificar contraseña (simple - en producción usar bcrypt)
        if (usuarios.password !== password) {
            throw new Error('Contraseña incorrecta');
        }
        
        // Guardar sesión
        const userData = {
            id: usuarios.id,
            nombre: usuarios.nombre,
            apellido: usuarios.apellido,
            email: usuarios.email,
            telefono: usuarios.telefono,
            direccion: usuarios.direccion
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        if (remember) {
            localStorage.setItem('rememberUser', 'true');
        }
        
        showMessage('¡Inicio de sesión exitoso!', 'success');
        
        // Redireccionar después de 1 segundo
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        showLoading(false);
        console.error('Error:', error);
        
        if (error.message === 'Usuario no encontrado') {
            showMessage('No existe una cuenta con este email', 'error');
        } else if (error.message === 'Contraseña incorrecta') {
            showMessage('Contraseña incorrecta. Intenta nuevamente', 'error');
        } else {
            showMessage('Error al iniciar sesión. Intenta nuevamente', 'error');
        }
    }
});

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Mostrar mensaje
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Mostrar/ocultar loading
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

// Enter key para submit
document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
});