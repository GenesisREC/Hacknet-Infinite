// ============================================================
// EXPLORER — Navegador visual de archivos
// ============================================================
// Se abre con "explorer" o "ex". Muestra el FS actual (local o
// remoto según gameState.isConnected) como un explorador visual
// con íconos. Refleja y es reflejado por el CWD de la terminal.
// ============================================================

const Explorer = {
    open: false,
    loading: false,
    loadingTimer: null,
    previewingFile: null
};

// ------------------------------------------------------------
// Fallback de escapeHtml (si reviews.js no está cargado)
// ------------------------------------------------------------
if (typeof escapeHtml === 'undefined') {
    window.escapeHtml = function(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };
}

// ------------------------------------------------------------
// API pública
// ------------------------------------------------------------
function toggleExplorer() {
    if (Explorer.open) closeExplorer();
    else openExplorer();
}

function openExplorer() {
    if (Explorer.open) return;
    const panel = document.getElementById('explorer-panel');
    if (!panel) {
        output.innerHTML += `<span class="text-error">[✗] Explorer no disponible.</span><br>`;
        return;
    }

    Explorer.open = true;
    Explorer.previewingFile = null;

    panel.style.display = 'flex';
    panel.classList.remove('explorer-open');
    void panel.offsetWidth;
    panel.classList.add('explorer-open');

    // Loader
    Explorer.loading = true;
    const loadingEl = document.getElementById('explorer-loading');
    const listEl = document.getElementById('explorer-list');
    if (loadingEl) loadingEl.style.display = 'flex';
    if (listEl) listEl.style.display = 'none';

    output.innerHTML += `<span class="text-info">[📁] Explorer abierto. Navegá visualmente. Escribí "explorer" de nuevo o apretá [X] para cerrarlo.</span><br>`;
    output.scrollTop = output.scrollHeight;

    try { if (typeof soundSuccess === 'function') soundSuccess(); } catch (e) {}

    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    const loadMs = isMobile ? 400 : 650;

    if (Explorer.loadingTimer) clearTimeout(Explorer.loadingTimer);
    Explorer.loadingTimer = setTimeout(() => {
        Explorer.loading = false;
        if (loadingEl) loadingEl.style.display = 'none';
        if (listEl) listEl.style.display = 'block';
        renderExplorer();
    }, loadMs);

    document.body.classList.add('explorer-active');
    updateUI();
}

function closeExplorer() {
    if (!Explorer.open) return;
    Explorer.open = false;
    Explorer.loading = false;
    Explorer.previewingFile = null;
    if (Explorer.loadingTimer) {
        clearTimeout(Explorer.loadingTimer);
        Explorer.loadingTimer = null;
    }
    const panel = document.getElementById('explorer-panel');
    if (panel) {
        panel.classList.remove('explorer-open');
        panel.style.display = 'none';
    }
    document.body.classList.remove('explorer-active');
    output.innerHTML += `<span class="text-muted">[📁] Explorer cerrado.</span><br>`;
    output.scrollTop = output.scrollHeight;
    updateUI();
}

// ------------------------------------------------------------
// Render
// ------------------------------------------------------------
function renderExplorer() {
    if (!Explorer.open || Explorer.loading) return;

    const fs = getCurrentFS();
    const cwd = getCurrentCWD();
    const cwdNode = fs[cwd];

    const pathEl = document.getElementById('explorer-path');
    if (pathEl) pathEl.textContent = cwd;

    const listEl = document.getElementById('explorer-list');
    if (!listEl) return;

    if (!cwdNode || cwdNode.type !== 'dir') {
        listEl.innerHTML = `<div class="explorer-empty">Directorio no encontrado: <code>${escapeHtml(cwd)}</code></div>`;
        return;
    }

    const children = cwdNode.children || [];
    if (children.length === 0) {
        listEl.innerHTML = `<div class="explorer-empty">Carpeta vacía</div>`;
        return;
    }

    const items = children.map(name => {
        const path = cwd === '/' ? '/' + name : cwd + '/' + name;
        const node = fs[path];
        return { name, path, node };
    }).filter(it => it.node);

    const dirs  = items.filter(it => it.node.type === 'dir').sort((a, b) => a.name.localeCompare(b.name));
    const files = items.filter(it => it.node.type === 'file').sort((a, b) => a.name.localeCompare(b.name));

    let html = '';

    if (cwd !== '/') {
        html += `<div class="explorer-item explorer-item-up" data-action="up">
            <div class="explorer-item-icon">⬆</div>
            <div class="explorer-item-info">
                <div class="explorer-item-name">.. (volver)</div>
                <div class="explorer-item-meta">Subir un nivel</div>
            </div>
            <div class="explorer-item-arrow">▸</div>
        </div>`;
    }

    dirs.forEach(d => {
        const count = (d.node.children || []).length;
        html += `<div class="explorer-item explorer-item-dir" data-path="${escapeAttr(d.path)}" data-type="dir">
            <div class="explorer-item-info">
                <div class="explorer-item-name">${escapeHtml(d.name)}</div>
                <div class="explorer-item-meta">Carpeta · ${count} elemento${count === 1 ? '' : 's'}</div>
            </div>
            <div class="explorer-item-arrow">▸</div>
        </div>`;
    });

            files.forEach(f => {
        const node = f.node;
        let meta = '', icon = '[F]', extraClass = '';
        if (node.isExecutable) {
            meta = `Ejecutable · v${(node.version || 1.0).toFixed(1)} · ${formatSize(node.size || 0)}`;
            icon = '[*]'; extraClass = 'explorer-item-exe';
        } else if (node.isTraceLog) {
            meta = `Log de rastreo · ${formatSize(node.size || 0)}`;
            icon = '[!]'; extraClass = 'explorer-item-trace';
        } else if (node.isProtectedZip) {
            meta = `ZIP protegido · ${formatSize(node.size || 0)}`;
            icon = '[Z]'; extraClass = 'explorer-item-zip';
        } else if (node.isOpenZip) {
            const n = (node.zipContents || []).length;
            meta = `ZIP · ${n} archivo${n === 1 ? '' : 's'} · ${formatSize(node.size || 0)}`;
            icon = '[Z]'; extraClass = 'explorer-item-zip';
        } else {
            meta = `${formatSize(node.size || 0)}${node.category ? ' · ' + node.category : ''}`;
        }
        html += `<div class="explorer-item explorer-item-file ${extraClass}" data-path="${escapeAttr(f.path)}" data-type="file">
            <div class="explorer-item-icon">${icon}</div>
            <div class="explorer-item-info">
                <div class="explorer-item-name">${escapeHtml(f.name)}</div>
                <div class="explorer-item-meta">${meta}</div>
            </div>
            <div class="explorer-item-arrow">▸</div>
        </div>`;
    });

    if (Explorer.previewingFile) {
        const pf = Explorer.previewingFile;
        const previewNode = fs[pf.path];
        if (previewNode && previewNode.type === 'file') {
            html += renderExplorerPreview(previewNode, pf.path);
        }
    }

    listEl.innerHTML = html;

    listEl.querySelectorAll('[data-path]').forEach(el => {
        el.addEventListener('click', () => {
            const path = el.getAttribute('data-path');
            const type = el.getAttribute('data-type');
            if (type === 'dir') navigateExplorer(path);
            else {
                Explorer.previewingFile = { path };
                renderExplorer();
                try { if (typeof soundKeyClick === 'function') soundKeyClick(); } catch (e) {}
            }
        });
    });

    const upEl = listEl.querySelector('[data-action="up"]');
    if (upEl) {
        upEl.addEventListener('click', () => {
            const parent = cwd.substring(0, cwd.lastIndexOf('/')) || '/';
            navigateExplorer(parent);
        });
    }

    const closePrevBtn = listEl.querySelector('#explorer-preview-close');
    if (closePrevBtn) {
        closePrevBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            Explorer.previewingFile = null;
            renderExplorer();
        });
    }
}

function renderExplorerPreview(node, path) {
    const name = path.substring(path.lastIndexOf('/') + 1);
    let previewContent = '';
    let previewClass = '';

        if (node.isProtectedZip) {
        previewContent = 'ZIP protegido. Requiere contraseña.\n\nUsá: unzip ' + name + ' TU_CLAVE';
        previewClass = 'explorer-preview-warn';
    } else if (node.isOpenZip) {
        const files = (node.zipContents || []).map(f => '  · ' + f.name + ' (' + formatSize(f.size) + ')').join('\n');
        previewContent = 'ZIP sin contraseña. Contiene ' + (node.zipContents || []).length + ' archivo(s):\n\n' + files + '\n\nUsá: unzip ' + name;
        previewClass = 'explorer-preview-warn';
    } else if (node.isTraceLog) {
        previewContent = node.content || '(sin contenido)';
        previewClass = 'explorer-preview-error';
    } else if (node.isExecutable) {
        previewContent = node.content || `Ejecutable v${(node.version || 1.0).toFixed(1)}`;
        previewClass = 'explorer-preview-exe';
    } else if (isBinaryFile(name)) {
        previewContent = generateBinaryPreview(name, node.size || 1);
        previewClass = 'explorer-preview-bin';
    } else {
        previewContent = node.content || '(sin contenido)';
    }

    const maxLen = 1200;
    const truncated = previewContent.length > maxLen
        ? previewContent.substring(0, maxLen) + '\n\n[...truncado]'
        : previewContent;

    return `<div class="explorer-preview">
        <div class="explorer-preview-header">
            <span class="explorer-preview-title">👁 ${escapeHtml(name)}</span>
            <button class="explorer-preview-close" id="explorer-preview-close">[X]</button>
        </div>
        <pre class="explorer-preview-body ${previewClass}">${escapeHtml(truncated)}</pre>
    </div>`;
}

function navigateExplorer(path) {
    const fs = getCurrentFS();
    if (!fs[path] || fs[path].type !== 'dir') return;
    setCurrentCWD(path);
    Explorer.previewingFile = null;

    // Mini re-load
    Explorer.loading = true;
    const loadingEl = document.getElementById('explorer-loading');
    const listEl = document.getElementById('explorer-list');
    if (loadingEl) loadingEl.style.display = 'flex';
    if (listEl) listEl.style.display = 'none';
    if (Explorer.loadingTimer) clearTimeout(Explorer.loadingTimer);
    Explorer.loadingTimer = setTimeout(() => {
        Explorer.loading = false;
        if (loadingEl) loadingEl.style.display = 'none';
        if (listEl) listEl.style.display = 'block';
        renderExplorer();
    }, 220);

    updateUI();
    try { if (typeof soundKeyClick === 'function') soundKeyClick(); } catch (e) {}
}

function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;');
}

window.toggleExplorer = toggleExplorer;
window.openExplorer = openExplorer;
window.closeExplorer = closeExplorer;
window.renderExplorer = renderExplorer;