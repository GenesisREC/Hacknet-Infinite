// ============================================================
// REVIEWS — Sistema de reviews con backend de Apps Script
// ============================================================

const REVIEWS_CONFIG = {
    endpoint: 'https://script.google.com/macros/s/AKfycbxaFMkiwiS39CpBMLy1eFJEcq7N-8rc98dVY-jZTVO5wXwjUQX-vFIG91SFkgRt1raRDg/exec',
    cacheMs: 30 * 1000,          // 30s de cache
    adminStorageKey: 'hacknet_reviews_admin_pw'
};

// ------------------------------------------------------------
// ESTADO
// ------------------------------------------------------------
const _reviewsState = {
    loaded: false,
    loading: false,
    error: null,
    reviews: [],
    lastFetch: 0,
    // Admin
    isAdmin: false,
    deletingId: null
};

// ------------------------------------------------------------
// FETCH helper (con CORS-safe config)
// ------------------------------------------------------------
async function reviewsFetch(payload) {
    const url = REVIEWS_CONFIG.endpoint;
    if (!url || url.indexOf('PEGA_ACÁ') === 0) {
        throw new Error('Endpoint no configurado. Editá reviews.js.');
    }
    // Usamos POST siempre: Apps Script lo maneja bien y evita problemas
    // de CORS con GET. Content-Type como texto plano para evitar preflight.
    const resp = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-store',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
    });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return await resp.json();
}

// ------------------------------------------------------------
// API PÚBLICA
// ------------------------------------------------------------
async function reviewsSubmit(category, author, text) {
    const result = await reviewsFetch({
        action: 'submit',
        category: category,
        author: author,
        text: text
    });
    if (!result.ok) throw new Error(result.error || 'Error al enviar.');
    // Forzar refresh la próxima vez que se abra la pestaña
    _reviewsState.lastFetch = 0;
    return result;
}

async function reviewsList(forceRefresh) {
    const now = Date.now();
    if (!forceRefresh && _reviewsState.loaded && (now - _reviewsState.lastFetch) < REVIEWS_CONFIG.cacheMs) {
        return _reviewsState.reviews;
    }
    const result = await reviewsFetch({ action: 'list' });
    if (!result.ok) throw new Error(result.error || 'Error al listar.');
    _reviewsState.reviews = result.reviews || [];
    _reviewsState.loaded = true;
    _reviewsState.lastFetch = now;
    return _reviewsState.reviews;
}

async function reviewsDelete(id, password) {
    const result = await reviewsFetch({
        action: 'delete',
        id: id,
        password: password
    });
    if (!result.ok) throw new Error(result.error || 'Error al borrar.');
    // Quitar localmente para no esperar al refresh
    _reviewsState.reviews = _reviewsState.reviews.filter(r => r.id !== id);
    return result;
}

// ------------------------------------------------------------
// RENDER — Pestaña REVIEWS de news.com
// ------------------------------------------------------------
async function renderReviewsTab(content) {
    // Si no está cargado, mostramos un loader y disparamos fetch
    if (!_reviewsState.loaded && !_reviewsState.loading) {
        _reviewsState.loading = true;
        renderReviewsLoading(content);
        try {
            await reviewsList(true);
        } catch (err) {
            _reviewsState.error = err.message || 'Error de conexión.';
        }
        _reviewsState.loading = false;
    }

    renderReviewsFull(content);
}

function renderReviewsLoading(content) {
    content.innerHTML = `
        <div class="reviews-hero">
            <div class="reviews-hero-title">REVIEWS DE LA COMUNIDAD</div>
            <div class="reviews-hero-sub">Cargando...</div>
        </div>
        <div class="reviews-empty">⏳ Cargando reviews...</div>
    `;
}

function renderReviewsFull(content) {
    const reviews = _reviewsState.reviews || [];
    const bugCount = reviews.filter(r => r.category === 'bug').length;
    const sugCount = reviews.filter(r => r.category === 'sugerencia').length;

    let html = '';

    // ---- HERO ----
    html += `<div class="reviews-hero">
        <div class="reviews-hero-title">REVIEWS DE LA COMUNIDAD</div>
        <div class="reviews-hero-sub">
            Sugerencias y reportes de bugs del juego.
            <span class="reviews-hero-counter">${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}</span>
        </div>
    </div>`;

    // ---- FORMULARIO ----
    html += `<div class="reviews-form">
        <div class="reviews-form-title">▸ ENVIAR REVIEW</div>
        <div class="reviews-form-row">
            <label class="reviews-form-label">Categoría</label>
            <div class="reviews-form-radios">
                <label class="reviews-radio">
                    <input type="radio" name="review-cat" value="sugerencia" checked>
                    <span>💡 Sugerencia</span>
                </label>
                <label class="reviews-radio">
                    <input type="radio" name="review-cat" value="bug">
                    <span>🐛 Bug</span>
                </label>
            </div>
        </div>
        <div class="reviews-form-row">
            <label class="reviews-form-label" for="review-author">Nombre</label>
            <input type="text" id="review-author" class="reviews-input"
                   placeholder="Anónimo" maxlength="30" autocomplete="off">
        </div>
        <div class="reviews-form-row">
            <label class="reviews-form-label" for="review-text">Mensaje</label>
            <textarea id="review-text" class="reviews-textarea"
                      placeholder="Contá qué bug encontraste o qué sugerencia tenés..."
                      maxlength="800" rows="4"></textarea>
            <div class="reviews-char-count"><span id="review-char-count">0</span> / 800</div>
        </div>
        <div class="reviews-form-actions">
            <button class="reviews-btn reviews-btn-send" id="review-send-btn">▸ ENVIAR REVIEW</button>
            <span class="reviews-form-msg" id="review-form-msg"></span>
        </div>
    </div>`;

    // ---- CONTROLES ADMIN ----
    if (_reviewsState.isAdmin) {
        html += `<div class="reviews-admin-bar">
            <span class="reviews-admin-badge">🔓 MODO ADMIN</span>
            <span class="reviews-admin-info">Click en [X] para borrar una review</span>
            <button class="reviews-btn reviews-btn-admin-out" id="review-admin-logout">SALIR DE ADMIN</button>
        </div>`;
    } else {
        html += `<div class="reviews-admin-bar reviews-admin-bar-locked">
            <button class="reviews-btn reviews-btn-admin-in" id="review-admin-login">🔒 LOGIN ADMIN</button>
        </div>`;
    }

    // ---- LISTA ----
    if (_reviewsState.error) {
        html += `<div class="reviews-empty reviews-empty-error">
            ⚠ ${_reviewsState.error}
            <br><button class="reviews-btn" id="review-retry-btn" style="margin-top:12px;">REINTENTAR</button>
        </div>`;
    } else if (reviews.length === 0) {
        html += `<div class="reviews-empty">
            <div class="reviews-empty-icon">📝</div>
            Todavía no hay reviews. ¡Sé el primero en mandar una!
        </div>`;
    } else {
        html += `<div class="reviews-list-header">
            <span>▸ ÚLTIMAS REVIEWS</span>
            <span class="reviews-list-stats">
                💡 ${sugCount} · 🐛 ${bugCount}
            </span>
        </div>`;
        html += `<div class="reviews-list">`;
        reviews.forEach(r => {
            const isBug = r.category === 'bug';
            const catClass = isBug ? 'reviews-cat-bug' : 'reviews-cat-sug';
            const catLabel = isBug ? '🐛 BUG' : '💡 SUGERENCIA';
            const catText = isBug ? 'BUG' : 'SUGERENCIA';
            const when = formatReviewsTime(r.timestamp);
            const safeAuthor = escapeHtml(r.author);
            const safeText = escapeHtml(r.text).replace(/\n/g, '<br>');

            html += `<div class="reviews-item ${catClass}" data-id="${r.id}">
                <div class="reviews-item-header">
                    <span class="reviews-item-cat ${catClass}-tag">${catText}</span>
                    <span class="reviews-item-author">${safeAuthor}</span>
                    <span class="reviews-item-time">${when}</span>
                    ${_reviewsState.isAdmin ? `<button class="reviews-item-del" data-del-id="${r.id}" title="Borrar">[X]</button>` : ''}
                </div>
                <div class="reviews-item-text">${safeText}</div>
            </div>`;
        });
        html += `</div>`;
    }

    content.innerHTML = html;
    wireReviewsUI(content);
}

// ------------------------------------------------------------
// WIRE — listeners
// ------------------------------------------------------------
function wireReviewsUI(content) {
    // ---- Contador de caracteres ----
    const textEl = content.querySelector('#review-text');
    const countEl = content.querySelector('#review-char-count');
    if (textEl && countEl) {
        textEl.addEventListener('input', () => {
            countEl.textContent = String(textEl.value.length);
        });
    }

    // ---- Enviar ----
    const sendBtn = content.querySelector('#review-send-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', async () => {
            const catEl = content.querySelector('input[name="review-cat"]:checked');
            const authorEl = content.querySelector('#review-author');
            const msgEl = content.querySelector('#review-form-msg');

            const category = catEl ? catEl.value : 'sugerencia';
            const author = authorEl ? authorEl.value.trim() : '';
            const text = textEl ? textEl.value.trim() : '';

            if (text.length < 4) {
                if (msgEl) { msgEl.textContent = '⚠ El mensaje es muy corto.'; msgEl.className = 'reviews-form-msg reviews-msg-error'; }
                return;
            }

            sendBtn.disabled = true;
            sendBtn.textContent = '⏳ ENVIANDO...';
            if (msgEl) { msgEl.textContent = ''; msgEl.className = 'reviews-form-msg'; }

            try {
                await reviewsSubmit(category, author, text);
                if (textEl) textEl.value = '';
                if (countEl) countEl.textContent = '0';
                if (msgEl) {
                    msgEl.textContent = '✓ ¡Gracias! Tu review fue enviada.';
                    msgEl.className = 'reviews-form-msg reviews-msg-ok';
                }
                try { if (typeof soundSuccess === 'function') soundSuccess(); } catch (e) {}
                // Refrescar lista
                await reviewsList(true);
                renderReviewsFull(content);
            } catch (err) {
                if (msgEl) {
                    msgEl.textContent = '⚠ ' + (err.message || 'Error al enviar.');
                    msgEl.className = 'reviews-form-msg reviews-msg-error';
                }
                try { if (typeof soundError === 'function') soundError(); } catch (e) {}
            } finally {
                sendBtn.disabled = false;
                sendBtn.textContent = '▸ ENVIAR REVIEW';
            }
        });
    }

    // ---- Login admin ----
    const loginBtn = content.querySelector('#review-admin-login');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const pw = prompt('Contraseña de administrador:');
            if (!pw) return;
            // Guardamos en sessionStorage y probamos con un fetch de delete "seco"
            // Más simple: probamos list con flag y si responde bien, hacemos un delete de prueba
            // Alternativa: pedir la lista igual y guardar. El password solo se valida
            // cuando el admin borra algo. Acá lo dejamos "optimista".
            try {
                sessionStorage.setItem(REVIEWS_CONFIG.adminStorageKey, pw);
            } catch (e) {}
            _reviewsState.isAdmin = true;
            renderReviewsFull(content);
            try { if (typeof soundSuccess === 'function') soundSuccess(); } catch (e) {}
        });
    }

    // ---- Logout admin ----
    const logoutBtn = content.querySelector('#review-admin-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            try { sessionStorage.removeItem(REVIEWS_CONFIG.adminStorageKey); } catch (e) {}
            _reviewsState.isAdmin = false;
            renderReviewsFull(content);
        });
    }

    // ---- Borrar (solo admin) ----
    content.querySelectorAll('[data-del-id]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = btn.getAttribute('data-del-id');
            if (!id) return;
            if (!confirm('¿Borrar esta review?')) return;

            let pw = '';
            try { pw = sessionStorage.getItem(REVIEWS_CONFIG.adminStorageKey) || ''; } catch (err) {}

            if (!pw) {
                pw = prompt('Contraseña de administrador:');
                if (!pw) return;
                try { sessionStorage.setItem(REVIEWS_CONFIG.adminStorageKey, pw); } catch (err) {}
            }

            btn.disabled = true;
            btn.textContent = '...';
            try {
                await reviewsDelete(id, pw);
                renderReviewsFull(content);
                try { if (typeof soundSuccess === 'function') soundSuccess(); } catch (e) {}
            } catch (err) {
                alert('Error al borrar: ' + (err.message || 'desconocido'));
                btn.disabled = false;
                btn.textContent = '[X]';
                // Si la contraseña era mala, limpiamos
                if (String(err.message || '').toLowerCase().indexOf('contraseña') >= 0) {
                    try { sessionStorage.removeItem(REVIEWS_CONFIG.adminStorageKey); } catch (e) {}
                    _reviewsState.isAdmin = false;
                    renderReviewsFull(content);
                }
            }
        });
    });

    // ---- Retry ----
    const retryBtn = content.querySelector('#review-retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', async () => {
            _reviewsState.error = null;
            _reviewsState.loaded = false;
            await renderReviewsTab(content);
        });
    }

    // ---- Restaurar admin si estaba logueado ----
    try {
        const savedPw = sessionStorage.getItem(REVIEWS_CONFIG.adminStorageKey);
        if (savedPw && !_reviewsState.isAdmin) {
            _reviewsState.isAdmin = true;
            // No re-render acá: ya está en el DOM, solo activamos el flag
            // Pero el botón [X] no se dibuja hasta re-render. Forzamos uno suave:
            setTimeout(() => renderReviewsFull(content), 50);
        }
    } catch (e) {}
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function formatReviewsTime(ts) {
    if (!ts) return '—';
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'ahora';
    if (mins < 60) return `hace ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `hace ${days} d`;
    // Fecha completa
    const d = new Date(ts);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ------------------------------------------------------------
// Exports
// ------------------------------------------------------------
window.renderReviewsTab = renderReviewsTab;
window.reviewsSubmit = reviewsSubmit;
window.reviewsList = reviewsList;
window.reviewsDelete = reviewsDelete;