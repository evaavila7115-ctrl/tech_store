// Verificar si ya hay sesión activa
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'index.html';
    }
});

// Manejar envío del formulario
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const direccion = document.getElementById('direccion').value.trim();
    const terms = document.getElementById('terms').checked;
    
    // Validaciones
    if (!nombre || !email || !password || !confirmPassword) {
        showMessage('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('Por favor ingresa un email válido', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (!terms) {
        showMessage('Debes aceptar los términos y condiciones', 'error');
        return;
    }
    
    // Mostrar loading
    showLoading(true);
    
    try {
        // Verificar si el email ya existe
        const { data: existingUser, error: checkError } = await supabase
            .from('clientes_web')
            .select('email')
            .eq('email', email)
            .single();
        
        if (existingUser) {
            throw new Error('El email ya está registrado');
        }
        
        // Insertar nuevo usuario
        const { data, error } = await supabase
            .from('clientes_web')
            .insert([
                {
                    nombre: nombre,
                    apellido: apellido || null,
                    email: email,
                    password: password, // En producción usar bcrypt
                    telefono: telefono || null,
                    direccion: direccion || null
                }
            ])
            .select()
            .single();
        
        if (error) throw error;
        
        showMessage('¡Cuenta creada exitosamente! Redirigiendo al login...', 'success');
        
        // Redireccionar al login después de 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    } catch (error) {
        showLoading(false);
        console.error('Error:', error);
        
        if (error.message === 'El email ya está registrado') {
            showMessage('Este email ya está registrado. Intenta iniciar sesión', 'error');
        } else {
            showMessage('Error al crear la cuenta. Intenta nuevamente', 'error');
        }
    }
});

// Toggle password visibility
function togglePassword(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const iconId = fieldId === 'password' ? 'toggleIcon1' : 'toggleIcon2';
    const toggleIcon = document.getElementById(iconId);
    
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
    
    // Scroll al mensaje
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Ocultar después de 5 segundos (solo para errores)
    if (type === 'error') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
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

// Validación en tiempo real de contraseñas
document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const confirmPassword = this.value;
    
    if (confirmPassword && password !== confirmPassword) {
        this.style.borderColor = 'var(--error-color)';
    } else {
        this.style.borderColor = '';
    }
});

// Validación de email en tiempo real
document.getElementById('email').addEventListener('blur', function() {
    const email = this.value.trim();
    
    if (email && !validateEmail(email)) {
        this.style.borderColor = 'var(--error-color)';
        showMessage('Formato de email inválido', 'error');
    } else {
        this.style.borderColor = '';
    }
});