// ============================================================
// SQL
// ============================================================
function createSqlScript(W, H) {
    const fontSize = 11;
    const lineHeight = 15;
    const charWidth = 6.4;
    const paddingX = 6;
    const paddingY = 8;
    const maxLines = Math.floor((H - paddingY * 2) / lineHeight);
    const maxCols = Math.floor((W - paddingX * 2) / charWidth) - 1;
    const keywords = ['SELECT','FROM','WHERE','INSERT','UPDATE','DELETE','JOIN','VALUES','INTO','SET','AND','OR','NOT','NULL','LIKE','ORDER','GROUP','HAVING','LIMIT','UNION','DROP','TABLE','ALTER','CREATE'];
    const script = [];
    const groups = [];
    let groupCounter = 0;
    for (let line = 0; line < maxLines; line++) {
        let col = 0;
        const y = paddingY + line * lineHeight + fontSize;
        while (col < maxCols - 3) {
            const r = Math.random();
            if (r < 0.22 && col + 8 < maxCols) {
                const kw = keywords[Math.floor(Math.random() * keywords.length)];
                if (col + kw.length > maxCols - 1) break;
                groupCounter++;
                const groupChars = [];
                for (let i = 0; i < kw.length; i++) {
                    const c = { x: paddingX + col * charWidth, y, ch: kw[i], isKeyword: true, group: groupCounter, indexInGroup: i, groupLen: kw.length, correctAt: 0, retypeAt: 0 };
                    script.push(c); groupChars.push(c); col++;
                }
                groups.push({ id: groupCounter, chars: groupChars, correctAt: 0 });
                if (col < maxCols) { script.push({ x: paddingX + col * charWidth, y, ch: ' ', isKeyword: false, group: null, correctAt: 0, retypeAt: 0 }); col++; }
            } else if (r < 0.35) {
                const puncts = [',', '=', '(', ')', ';', '<', '>', '*', '.', '+', '-'];
                script.push({ x: paddingX + col * charWidth, y, ch: puncts[Math.floor(Math.random() * puncts.length)], isKeyword: false, group: null, correctAt: 0, retypeAt: 0 }); col++;
            } else if (r < 0.5) {
                const numLen = 1 + Math.floor(Math.random() * 3);
                for (let i = 0; i < numLen && col < maxCols; i++) { script.push({ x: paddingX + col * charWidth, y, ch: String(Math.floor(Math.random() * 10)), isKeyword: false, group: null, correctAt: 0, retypeAt: 0 }); col++; }
                if (col < maxCols) { script.push({ x: paddingX + col * charWidth, y, ch: ' ', isKeyword: false, group: null, correctAt: 0, retypeAt: 0 }); col++; }
            } else {
                const len = 2 + Math.floor(Math.random() * 4);
                if (col + len > maxCols) break;
                for (let i = 0; i < len; i++) { script.push({ x: paddingX + col * charWidth, y, ch: String.fromCharCode(97 + Math.floor(Math.random() * 26)), isKeyword: false, group: null, correctAt: 0, retypeAt: 0 }); col++; }
                if (col < maxCols) { script.push({ x: paddingX + col * charWidth, y, ch: ' ', isKeyword: false, group: null, correctAt: 0, retypeAt: 0 }); col++; }
            }
        }
    }
    const numGroups = groups.length;
    groups.forEach((g, i) => {
        const base = 0.55 + (i / Math.max(1, numGroups)) * 0.38;
        g.correctAt = base;
        g.chars.forEach((c, j) => { c.correctAt = base + (j / c.groupLen) * 0.02; c.retypeAt = c.correctAt + 0.015; });
    });
    return { script, groups };
}

function drawSqlAnimation(proc, now) {
    const c = document.getElementById('sql-canvas-' + proc.id);
    if (!c) return;
    const cctx = c.getContext('2d');
    const W = c.width, H = c.height;
    cctx.fillStyle = '#000';
    cctx.fillRect(0, 0, W, H);
    cctx.strokeStyle = 'rgba(0, 255, 0, 0.05)';
    cctx.lineWidth = 1;
    for (let y = 15; y < H; y += 15) { cctx.beginPath(); cctx.moveTo(0, y); cctx.lineTo(W, y); cctx.stroke(); }
    const script = proc.sqlScript;
    if (!script || script.length === 0) return;
    const progress = Math.min(1, (proc.animatedElapsed || 0) / proc.sqlDuration);
    const totalChars = script.length;
    const typingEnd = 0.55;
    const typingProgress = Math.min(1, progress / typingEnd);
    const charsTyped = Math.floor(typingProgress * totalChars);
    cctx.font = '11px Consolas, monospace';
    cctx.textBaseline = 'alphabetic';
    for (let i = 0; i < charsTyped; i++) {
        const ch = script[i];
        let color;
        if (ch.isKeyword) {
            if (progress < ch.correctAt) color = '#cc2222';
            else if (progress < ch.retypeAt) continue;
            else if (progress < ch.retypeAt + 0.02) color = '#ffff44';
            else color = '#33ff33';
        } else color = '#33ff33';
        cctx.fillStyle = color;
        cctx.fillText(ch.ch, ch.x, ch.y);
    }
    if (progress < typingEnd && Math.floor(now / 200) % 2 === 0) {
        const nextIdx = charsTyped;
        if (nextIdx < script.length) {
            const nextCh = script[nextIdx];
            cctx.fillStyle = '#33ff33';
            cctx.fillRect(nextCh.x - 6, nextCh.y - 10, 7, 12);
        }
    }
    const scanY = ((now / 15) % (H + 20)) - 10;
    const grad = cctx.createLinearGradient(0, scanY - 8, 0, scanY + 8);
    grad.addColorStop(0, 'rgba(0, 255, 0, 0)');
    grad.addColorStop(0.5, 'rgba(0, 255, 0, 0.12)');
    grad.addColorStop(1, 'rgba(0, 255, 0, 0)');
    cctx.fillStyle = grad;
    cctx.fillRect(0, scanY - 8, W, 16);
    if (progress >= 1) { cctx.strokeStyle = 'rgba(51, 255, 51, 0.6)'; cctx.lineWidth = 1; cctx.strokeRect(0.5, 0.5, W - 1, H - 1); }
    if (proc.isStalled) {
        cctx.strokeStyle = 'rgba(255, 204, 0, 0.5)';
        cctx.strokeRect(0.5, 0.5, W - 1, H - 1);
        cctx.font = '10px Consolas, monospace';
        cctx.fillStyle = '#ffcc00';
        cctx.textAlign = 'right';
        cctx.fillText('[STALLED]', W - 6, 13);
    }
}

// ============================================================
// SSH
// ============================================================
function createSshOrbs(W, H) {
    const orbs = [];
    const colors = [
        { name: 'red', rgb: [255, 68, 68], hex: '#ff4444' },
        { name: 'blue', rgb: [68, 136, 255], hex: '#4488ff' },
        { name: 'yellow', rgb: [255, 221, 68], hex: '#ffdd44' }
    ];
    const orbsPerColor = 5;
    const paddingX = 28;
    const paddingTop = 25;
    const paddingBottom = 25;
    const usableHeight = H - paddingTop - paddingBottom;
    const rowGap = usableHeight / colors.length;
    colors.forEach((color, colorIdx) => {
        const targetY = paddingTop + rowGap * (colorIdx + 0.5);
        for (let i = 0; i < orbsPerColor; i++) {
            const targetX = paddingX + (W - paddingX * 2) * (i / (orbsPerColor - 1));
            const startX = 30 + Math.random() * (W - 60);
            const startY = 25 + Math.random() * (H - 50);
            const midX = 24 + Math.random() * (W - 48);
            const midY = 20 + Math.random() * (H - 40);
            orbs.push({ color: color.name, rgb: color.rgb, hex: color.hex, startX, startY, midX, midY, targetX, targetY, x: startX, y: startY, r: 5.5 + Math.random() * 3.0, phase: Math.random() * Math.PI * 2, speedPhase: 0.7 + Math.random() * 0.7 });
        }
    });
    return orbs;
}

function quadBezier(p0, p1, p2, t) {
    const mt = 1 - t;
    return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
}

function drawSshAnimation(proc, now) {
    const c = document.getElementById('ssh-canvas-' + proc.id);
    if (!c) return;
    const cctx = c.getContext('2d');
    const W = c.width, H = c.height;
    cctx.fillStyle = '#000';
    cctx.fillRect(0, 0, W, H);
    cctx.strokeStyle = 'rgba(0, 255, 0, 0.04)';
    cctx.lineWidth = 1;
    for (let y = 15; y < H; y += 15) { cctx.beginPath(); cctx.moveTo(0, y); cctx.lineTo(W, y); cctx.stroke(); }
    for (let x = 20; x < W; x += 20) { cctx.beginPath(); cctx.moveTo(x, 0); cctx.lineTo(x, H); cctx.stroke(); }
    const orbs = proc.sshOrbs;
    if (!orbs || orbs.length === 0) return;
    const progress = Math.min(1, (proc.animatedElapsed || 0) / proc.sshDuration);
    const moveEnd = 0.85;
    const moveT = Math.min(1, progress / moveEnd);
    const eased = moveT < 0.5 ? 4 * moveT * moveT * moveT : 1 - Math.pow(-2 * moveT + 2, 3) / 2;
    orbs.forEach(o => {
        const baseX = quadBezier(o.startX, o.midX, o.targetX, eased);
        const baseY = quadBezier(o.startY, o.midY, o.targetY, eased);
        const wobbleStrength = Math.max(0, 1 - eased) * 22;
        const wobbleX = Math.sin(now / (300 / o.speedPhase) + o.phase) * wobbleStrength;
        const wobbleY = Math.cos(now / (350 / o.speedPhase) + o.phase * 1.7) * wobbleStrength;
        o.x = baseX + wobbleX;
        o.y = baseY + wobbleY;
    });
    const maxDist = 60;
    cctx.lineWidth = 0.7;
    for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
            const o1 = orbs[i], o2 = orbs[j];
            const d = Math.hypot(o1.x - o2.x, o1.y - o2.y);
            if (d < maxDist) {
                const alpha = (1 - d / maxDist) * 0.55;
                const sameColor = o1.color === o2.color;
                if (sameColor) cctx.strokeStyle = `rgba(${o1.rgb[0]}, ${o1.rgb[1]}, ${o1.rgb[2]}, ${alpha})`;
                else cctx.strokeStyle = `rgba(140, 140, 140, ${alpha * 0.35})`;
                cctx.beginPath(); cctx.moveTo(o1.x, o1.y); cctx.lineTo(o2.x, o2.y); cctx.stroke();
            }
        }
    }
    orbs.forEach(o => {
        const pulse = 0.9 + 0.15 * Math.sin(now / 400 * o.speedPhase + o.phase);
        const r = o.r * pulse;
        const grad = cctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r * 4);
        grad.addColorStop(0, `rgba(${o.rgb[0]}, ${o.rgb[1]}, ${o.rgb[2]}, 0.55)`);
        grad.addColorStop(0.5, `rgba(${o.rgb[0]}, ${o.rgb[1]}, ${o.rgb[2]}, 0.15)`);
        grad.addColorStop(1, `rgba(${o.rgb[0]}, ${o.rgb[1]}, ${o.rgb[2]}, 0)`);
        cctx.fillStyle = grad;
        cctx.beginPath(); cctx.arc(o.x, o.y, r * 4, 0, Math.PI * 2); cctx.fill();
        cctx.fillStyle = o.hex;
        cctx.beginPath(); cctx.arc(o.x, o.y, r, 0, Math.PI * 2); cctx.fill();
        cctx.fillStyle = `rgba(255, 255, 255, 0.7)`;
        cctx.beginPath(); cctx.arc(o.x - r * 0.3, o.y - r * 0.3, r * 0.3, 0, Math.PI * 2); cctx.fill();
    });
    const scanY = ((now / 12) % (H + 30)) - 15;
    const scanGrad = cctx.createLinearGradient(0, scanY - 10, 0, scanY + 10);
    scanGrad.addColorStop(0, 'rgba(0, 255, 0, 0)');
    scanGrad.addColorStop(0.5, 'rgba(0, 255, 0, 0.10)');
    scanGrad.addColorStop(1, 'rgba(0, 255, 0, 0)');
    cctx.fillStyle = scanGrad;
    cctx.fillRect(0, scanY - 10, W, 20);
    if (progress >= 1) { cctx.strokeStyle = 'rgba(51, 255, 51, 0.6)'; cctx.strokeRect(0.5, 0.5, W - 1, H - 1); }
    if (proc.isStalled) {
        cctx.strokeStyle = 'rgba(255, 204, 0, 0.5)';
        cctx.strokeRect(0.5, 0.5, W - 1, H - 1);
        cctx.font = '10px Consolas, monospace';
        cctx.fillStyle = '#ffcc00';
        cctx.textAlign = 'right';
        cctx.fillText('[STALLED]', W - 6, 13);
    }
}

// ============================================================
// HTTP
// ============================================================
function createHttpTree(W, H) {
    const NODE_W = 58;
    const NODE_H = 16;
    const BAR_H = 4;
    const BAR_GAP = 3;
    const MARGIN_X = 34;
    const LEVEL_SPACING = 48;
    const TOP_MARGIN = 20;
    const LEVEL_Y = [0, 1, 2, 3].map(i => TOP_MARGIN + i * LEVEL_SPACING);

    const headPool = ['<title>', '<meta>', '<link>', '<style>', '<script>'];
    const bodyPool = ['<div>', '<section>', '<header>', '<nav>', '<main>', '<footer>', '<form>', '<article>', '<aside>'];
    const childPool = {
        '<div>': ['<span>', '<p>', '<a>', '<button>'],
        '<section>': ['<h1>', '<p>', '<ul>'],
        '<header>': ['<h1>', '<nav>', '<span>'],
        '<nav>': ['<ul>', '<a>'],
        '<main>': ['<section>', '<article>', '<p>'],
        '<footer>': ['<p>', '<a>', '<span>'],
        '<form>': ['<input>', '<button>', '<label>'],
        '<article>': ['<h2>', '<p>', '<span>'],
        '<aside>': ['<p>', '<a>']
    };

    function rnd(n) { return Math.floor(Math.random() * n); }
    function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

    let id = 0;
    function mk(label, level, parent) {
        return { id: id++, label, level, parent, children: [], x: 0, y: LEVEL_Y[level] };
    }

    const root = mk('<html>', 0, null);
    const head = mk('<head>', 1, root);
    const body = mk('<body>', 1, root);
    root.children = [head, body];

    const headCandidates = shuffle(headPool);
    const numHead = 1 + rnd(2);
    for (let i = 0; i < numHead && i < headCandidates.length; i++) {
        head.children.push(mk(headCandidates[i], 2, head));
    }

    const bodyCandidates = shuffle(bodyPool);
    const numBody = 2;
    for (let i = 0; i < numBody && i < bodyCandidates.length; i++) {
        const label = bodyCandidates[i];
        const bodyChild = mk(label, 2, body);
        body.children.push(bodyChild);
        if (childPool[label] && Math.random() < 0.6) {
            const gcPool = shuffle(childPool[label]);
            bodyChild.children.push(mk(gcPool[0], 3, bodyChild));
        }
    }

    const leaves = [];
    function collect(node) {
        if (node.children.length === 0) leaves.push(node);
        else node.children.forEach(collect);
    }
    collect(root);
    const usable = W - MARGIN_X * 2;
    const n = leaves.length;
    const spacing = n > 1 ? usable / (n - 1) : 0;
    leaves.forEach((leaf, i) => { leaf.x = MARGIN_X + spacing * i; });
    function computeInternal(node) {
        if (node.children.length === 0) return;
        node.children.forEach(computeInternal);
        let sum = 0;
        node.children.forEach(c => sum += c.x);
        node.x = sum / node.children.length;
    }
    computeInternal(root);

    let maxLevel = 0;
    function getMaxLevel(node) {
        if (node.level > maxLevel) maxLevel = node.level;
        node.children.forEach(getMaxLevel);
    }
    getMaxLevel(root);

    return { root, maxLevel: maxLevel + 1, NODE_W, NODE_H, BAR_H, BAR_GAP, LEVEL_Y };
}

function drawHttpAnimation(proc, now) {
    const c = document.getElementById('http-canvas-' + proc.id);
    if (!c) return;
    const cctx = c.getContext('2d');
    const W = c.width, H = c.height;
    cctx.fillStyle = '#000';
    cctx.fillRect(0, 0, W, H);

    const tree = proc.httpTree;
    if (!tree) return;

    const { root, maxLevel, NODE_W, NODE_H, BAR_H, BAR_GAP, LEVEL_Y } = tree;
    const progress = Math.min(1, (proc.animatedElapsed || 0) / proc.httpDuration);
    const levelDuration = 1 / maxLevel;

    const activeLevel = Math.min(maxLevel - 1, Math.floor(progress / levelDuration));
    const treeTopY = LEVEL_Y[0];
    const treeBottomY = LEVEL_Y[maxLevel - 1];
    const spanH = treeBottomY - treeTopY;

    let cameraYTarget;
    if (spanH + 30 <= H) {
        cameraYTarget = (treeTopY + treeBottomY) / 2 - H / 2;
    } else {
        const activeY = LEVEL_Y[activeLevel];
        cameraYTarget = activeY - H / 2;
        const minCam = treeTopY - 15;
        const maxCam = treeBottomY - (H - 15);
        cameraYTarget = Math.max(minCam, Math.min(maxCam, cameraYTarget));
    }

    if (proc.cameraY === undefined) proc.cameraY = cameraYTarget;
    proc.cameraY += (cameraYTarget - proc.cameraY) * 0.07;

    cctx.save();
    cctx.translate(0, -proc.cameraY);

    cctx.strokeStyle = 'rgba(0, 255, 0, 0.04)';
    cctx.lineWidth = 1;
    const gridStartY = Math.floor((proc.cameraY - 20) / 15) * 15;
    const gridEndY = proc.cameraY + H + 20;
    for (let y = gridStartY; y < gridEndY; y += 15) {
        cctx.beginPath(); cctx.moveTo(0, y); cctx.lineTo(W, y); cctx.stroke();
    }
    for (let x = 20; x < W; x += 20) {
        cctx.beginPath(); cctx.moveTo(x, proc.cameraY - 20); cctx.lineTo(x, proc.cameraY + H + 20); cctx.stroke();
    }

    function getNodeState(node) {
        const levelStart = node.level * levelDuration;
        const levelEnd = (node.level + 1) * levelDuration;
        if (progress < levelStart) return { progress: 0, done: false, active: false };
        if (progress >= levelEnd) return { progress: 1, done: true, active: false };
        return { progress: (progress - levelStart) / levelDuration, done: false, active: true };
    }

    function drawEdge(parent, child, state) {
        let color;
        if (state.done) color = 'rgba(51,255,51,0.55)';
        else if (state.active) color = 'rgba(255,204,0,0.55)';
        else color = 'rgba(255,68,68,0.3)';
        cctx.strokeStyle = color;
        cctx.lineWidth = 1;
        cctx.beginPath();
        cctx.moveTo(parent.x, parent.y + NODE_H / 2 + BAR_GAP + BAR_H);
        cctx.lineTo(child.x, child.y - NODE_H / 2);
        cctx.stroke();
    }

    function drawNode(node) {
        const ns = getNodeState(node);
        let strokeColor, textColor, glow = false;
        if (ns.done) { strokeColor = '#33ff33'; textColor = '#33ff33'; glow = true; }
        else if (ns.active) { strokeColor = '#ffcc00'; textColor = '#ffcc00'; }
        else { strokeColor = '#ff4444'; textColor = '#ff4444'; }

        cctx.fillStyle = '#000';
        cctx.fillRect(node.x - NODE_W / 2, node.y - NODE_H / 2, NODE_W, NODE_H);
        if (glow) { cctx.shadowBlur = 4; cctx.shadowColor = strokeColor; }
        cctx.strokeStyle = strokeColor;
        cctx.lineWidth = 1;
        cctx.strokeRect(node.x - NODE_W / 2, node.y - NODE_H / 2, NODE_W, NODE_H);
        cctx.shadowBlur = 0;

        cctx.fillStyle = textColor;
        cctx.font = '9px Consolas, monospace';
        cctx.textAlign = 'center';
        cctx.textBaseline = 'middle';
        cctx.fillText(node.label, node.x, node.y);

        const barX = node.x - NODE_W / 2;
        const barY = node.y + NODE_H / 2 + BAR_GAP;
        cctx.fillStyle = '#000';
        cctx.fillRect(barX, barY, NODE_W, BAR_H);
        cctx.strokeStyle = ns.done ? '#33ff33' : 'rgba(0,255,0,0.4)';
        cctx.lineWidth = 1;
        cctx.strokeRect(barX + 0.5, barY + 0.5, NODE_W - 1, BAR_H - 1);

        if (ns.progress > 0) {
            const fillW = (NODE_W - 2) * ns.progress;
            let fillColor = ns.done ? '#33ff33' : (ns.active ? '#ffcc00' : '#ff4444');
            cctx.fillStyle = fillColor;
            cctx.fillRect(barX + 1, barY + 1, fillW, BAR_H - 2);
        }

        if (ns.done) {
            cctx.fillStyle = '#33ff33';
            cctx.font = 'bold 9px Consolas, monospace';
            cctx.textAlign = 'left';
            cctx.textBaseline = 'middle';
            cctx.fillText('✓', node.x + NODE_W / 2 + 2, node.y);
        }
    }

    function drawEdgesRecursive(node) {
        node.children.forEach(child => {
            drawEdge(node, child, getNodeState(child));
            drawEdgesRecursive(child);
        });
    }
    drawEdgesRecursive(root);

    function drawNodesRecursive(node) {
        drawNode(node);
        node.children.forEach(drawNodesRecursive);
    }
    drawNodesRecursive(root);

    cctx.restore();

    cctx.fillStyle = 'rgba(255, 204, 0, 0.7)';
    cctx.font = '9px Consolas, monospace';
    cctx.textAlign = 'left';
    cctx.textBaseline = 'top';
    cctx.fillText(`NIVEL ${activeLevel + 1}/${maxLevel}`, 5, 5);

    if (spanH + 30 > H) {
        cctx.fillStyle = 'rgba(0, 255, 0, 0.4)';
        cctx.textAlign = 'right';
        cctx.fillText('▼', W - 7, H - 14);
        cctx.fillText('▲', W - 7, 14);
    }

    if (progress >= 1) {
        cctx.strokeStyle = 'rgba(51, 255, 51, 0.6)';
        cctx.lineWidth = 1;
        cctx.strokeRect(0.5, 0.5, W - 1, H - 1);
    }
    if (proc.isStalled) {
        cctx.strokeStyle = 'rgba(255, 204, 0, 0.5)';
        cctx.lineWidth = 1;
        cctx.strokeRect(0.5, 0.5, W - 1, H - 1);
        cctx.font = '10px Consolas, monospace';
        cctx.fillStyle = '#ffcc00';
        cctx.textAlign = 'right';
        cctx.textBaseline = 'alphabetic';
        cctx.fillText('[STALLED]', W - 6, 13);
    }
}

// ============================================================
// FTP — Hack Mode
// ============================================================
function ftpRandInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function ftpPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function ftpShuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function createFtpAttack() {
    const oct = () => ftpRandInt(1, 254);
    const hostChoices = [
        () => `192.168.${ftpRandInt(0,255)}.${oct()}`,
        () => `192.168.${ftpRandInt(0,255)}.${oct()}`,
        () => `10.${ftpRandInt(0,255)}.${ftpRandInt(0,255)}.${oct()}`,
        () => `172.${ftpRandInt(16,31)}.${ftpRandInt(0,255)}.${oct()}`
    ];
    const host = ftpPick(hostChoices)();
    const port = ftpPick([21, 21, 21, 21, 2121, 8021, 2221]);

    const service = ftpPick([
        'vsftpd 2.3.4', 'vsftpd 3.0.3', 'vsftpd 3.0.5',
        'ProFTPD 1.3.5', 'ProFTPD 1.3.6', 'Pure-FTPd 1.0.49',
        'FileZilla Server 0.9.60', 'Serv-U 15.1.7', 'Wing FTP Server 6.3'
    ]);

    const cve = Math.random() < 0.45 ? ftpPick([
        'CVE-2011-2523', 'CVE-2015-3306', 'CVE-2019-18217', 'CVE-2020-9273', 'CVE-2021-3113'
    ]) : null;

    const usersPool = ['admin','root','user','ftp','ftpuser','guest','operator','sysadmin','webmaster','backup','deploy','test','pi','ubuntu','oracle','postgres','www-data','support'];
    const passesPool = ['admin','root','toor','123456','password','qwerty','letmein','welcome','changeme','hunter2','p@ssw0rd','12345678','letmein1','dragon','master','1234','admin123','pass123','secret','default','ftp','test','backup','server','12345'];

    const attemptsCount = ftpRandInt(4, 7);
    const attempts = [];
    const usedUsers = new Set();
    for (let i = 0; i < attemptsCount; i++) {
        let u, guard = 0;
        do { u = ftpPick(usersPool); guard++; } while (usedUsers.has(u) && guard < 30);
        usedUsers.add(u);
        attempts.push({ user: u, pass: ftpPick(passesPool) });
    }

    let successUser, guard = 0;
    do { successUser = ftpPick(usersPool); guard++; } while (usedUsers.has(successUser) && guard < 30);

    const successPass = ftpPick([
        'letmein123', 'ftp$ecure', 'S3cur3FTP!', 'adm1n2024', 'P@ssw0rd!',
        'sup3rs3cr3t', 'ftpserver', 'backup2024', 'TempPass!23', 'letmein_ftp',
        'd34db33f', 'mysql_root', 'c0rprate!', 'Backup#21', 'Root!FTP99',
        'Ftp_Adm1n', 'letmein2k24', 'S3rv3r_P4ss'
    ]);

    const filesPool = [
        { name: 'backup.tar.gz',   size: '22.0 KB' }, { name: 'database.sql',    size: '18.0 KB' },
        { name: 'shadow.txt',      size: '3.0 KB' },  { name: 'source_code.zip', size: '20.0 KB' },
        { name: 'config.cfg',      size: '3.0 KB' },  { name: 'users.db',        size: '15.0 KB' },
        { name: 'clientes.txt',    size: '10.0 KB' }, { name: 'passwd.txt',      size: '2.0 KB' },
        { name: 'claves.txt',      size: '4.0 KB' },  { name: 'secretos.txt',    size: '5.0 KB' },
        { name: 'planos.pdf',      size: '16.0 KB' }, { name: 'correos.eml',     size: '9.0 KB' },
        { name: 'informes.docx',   size: '14.0 KB' }, { name: 'inventario.txt',  size: '6.0 KB' },
        { name: 'facturas.txt',    size: '8.0 KB' }
    ];
    const files = ftpShuffle(filesPool).slice(0, ftpRandInt(3, 5));

    const logPool = [
        '/var/log/auth.log', '/var/log/syslog', '/var/log/vsftpd.log',
        '/var/log/secure', '/var/log/messages', '/var/log/wtmp',
        '/var/log/xferlog', '/var/log/btmp'
    ];
    const logs = ftpShuffle(logPool).slice(0, ftpRandInt(2, 4));
    const logEntries = ftpRandInt(18, 280);

    const firewallBypasses = ftpShuffle([
        'iptables rule injected', 'NAT redirect activated', 'Firewall signature evaded',
        'Conntrack table poisoned', 'Deep packet inspection bypassed', 'Snort IDS rule disabled',
        'Rate-limit threshold bypassed', 'Fail2ban list cleared', 'TCP fingerprint spoofed',
        'GeoIP filter bypassed'
    ]).slice(0, ftpRandInt(2, 4));

    const escalationTarget = ftpPick([
        '/usr/bin/passwd', '/usr/bin/sudo', '/usr/bin/find',
        '/usr/bin/pkexec', '/usr/bin/mount', '/usr/bin/vim.basic',
        '/usr/lib/policykit-1/polkit-agent-helper-1'
    ]);

    const wordlistSize = ftpRandInt(3000, 12000);

    return { host, port, service, cve, attempts, successUser, successPass,
             files, logs, logEntries, firewallBypasses, escalationTarget, wordlistSize };
}

function buildFtpLog(attack) {
    const log = [];
    const sections = [
        { name: 'recon', start: 0.00, end: 0.11 },
        { name: 'auth',  start: 0.12, end: 0.34 },
        { name: 'fw',    start: 0.35, end: 0.47 },
        { name: 'esc',   start: 0.48, end: 0.59 },
        { name: 'exfil', start: 0.60, end: 0.82 },
        { name: 'clean', start: 0.83, end: 0.99 }
    ];

    const recon = [
        { type: 'header', text: '>>> TARGET ACQUIRED' },
        { type: 'info',   text: '[*] Host: ' + attack.host + ':' + attack.port },
        { type: 'info',   text: '[*] Service: FTP (' + attack.service + ')' },
        attack.cve
            ? { type: 'warn', text: '[!] ' + attack.cve + ' detected' }
            : { type: 'info', text: '[*] No known CVE — manual exploitation' },
        { type: 'info',    text: '[*] Loading exploit module...' },
        { type: 'spinner', text: '[*] Compiling payload' }
    ];

    const auth = [
        { type: 'header', text: '>>> PHASE 1/5: AUTH BYPASS' },
        { type: 'info',   text: '[*] Trying anonymous login...' },
        { type: 'fail',   text: '[-] 530 Login incorrect' },
        { type: 'info',   text: '[*] Loading wordlist (' + attack.wordlistSize.toLocaleString() + ' entries)' },
        { type: 'info',   text: '[*] Starting brute-force attack:' }
    ];
    attack.attempts.forEach(a => {
        auth.push({ type: 'fail', text: '[-] ' + a.user.padEnd(9,' ') + ':' + a.pass.padEnd(12,' ') + ' FAIL' });
    });
    auth.push({ type: 'success', text: '[+] ' + attack.successUser.padEnd(9,' ') + ':' + attack.successPass.padEnd(12,' ') + ' MATCH!' });

    const fw = [
        { type: 'header', text: '>>> PHASE 2/5: FIREWALL BYPASS' },
        { type: 'info',   text: '[*] Sending malformed packets...' }
    ];
    attack.firewallBypasses.forEach(b => fw.push({ type: 'bypass', text: '[$] ' + b }));
    fw.push({ type: 'success', text: '[+] Perimeter breached' });

    const esc = [
        { type: 'header', text: '>>> PHASE 3/5: PRIVILEGE ESC.' },
        { type: 'info',   text: '[*] Enumerating SUID binaries...' },
        { type: 'warn',   text: '[!] Exploiting ' + attack.escalationTarget },
        { type: 'bypass', text: '[$] Kernel memory corruption' },
        { type: 'bypass', text: '[$] Escalation payload delivered' },
        { type: 'success',text: '[+] ROOT ACCESS GRANTED' }
    ];

    const exfil = [
        { type: 'header', text: '>>> PHASE 4/5: EXFILTRATION' },
        { type: 'info',   text: '[*] Scanning remote filesystem...' }
    ];
    attack.files.forEach(f => exfil.push({ type: 'file', text: f.name, size: f.size }));
    const totalSize = attack.files.reduce((a, f) => a + parseFloat(f.size), 0).toFixed(1);
    exfil.push({ type: 'success', text: '[+] ' + attack.files.length + ' files (' + totalSize + ' KB)' });

    const clean = [{ type: 'header', text: '>>> PHASE 5/5: LOG WIPING' }];
    attack.logs.forEach(l => clean.push({ type: 'info', text: '[*] Erasing ' + l }));
    clean.push({ type: 'info',    text: '[*] Overwriting inodes...' });
    clean.push({ type: 'success', text: '[+] ' + attack.logEntries + ' log entries wiped' });
    clean.push({ type: 'info',    text: '[*] Closing connection...' });
    clean.push({ type: 'success', text: '[+] TRACE CLEAN — SESSION ENDED' });
    clean.push({ type: 'end' });

    const map = { recon, auth, fw, esc, exfil, clean };

    sections.forEach(sec => {
        const lines = map[sec.name];
        log.push({ t: sec.start, type: 'sep' });
        const n = lines.length;
        for (let i = 0; i < n; i++) {
            const t = sec.start + (sec.end - sec.start) * (i / n);
            const lt = (i === n - 1) ? sec.end - 0.002 : t;
            log.push({ t: lt, ...lines[i] });
        }
    });

    log.sort((a, b) => a.t - b.t);
    return log;
}

function createFtpData(W, H) {
    const attack = createFtpAttack();
    const log = buildFtpLog(attack);
    return { W, H, attack, log };
}

const FTP_COLORS = {
    header:  '#33ffff', info: '#33ccff', success: '#33ff33',
    fail: '#ff3333', warn: '#ffcc00', bypass: '#ff44ff', file: '#33ff33'
};

function drawFtpAnimation(proc, now) {
    const c = document.getElementById('ftp-canvas-' + proc.id);
    if (!c || !proc.ftpData) return;
    const cctx = c.getContext('2d');
    const W = c.width, H = c.height;
    const data = proc.ftpData;
    const attack = data.attack;
    const log = data.log;
    const progress = Math.min(1, (proc.animatedElapsed || 0) / proc.ftpDuration);

    cctx.fillStyle = '#000'; cctx.fillRect(0, 0, W, H);
    cctx.strokeStyle = 'rgba(0,255,0,0.05)'; cctx.lineWidth = 1;
    for (let y = 10; y < H; y += 10) { cctx.beginPath(); cctx.moveTo(0, y); cctx.lineTo(W, y); cctx.stroke(); }

    const topH = 15;
    cctx.fillStyle = 'rgba(0,40,0,0.6)'; cctx.fillRect(0, 0, W, topH);
    cctx.strokeStyle = 'rgba(0,255,0,0.4)';
    cctx.beginPath(); cctx.moveTo(0, topH + 0.5); cctx.lineTo(W, topH + 0.5); cctx.stroke();

    cctx.font = 'bold 8px Consolas, monospace';
    cctx.textAlign = 'left'; cctx.textBaseline = 'middle';

    let statusText, statusColor;
    if (progress < 0.12)      { statusText = 'RECON';       statusColor = FTP_COLORS.info; }
    else if (progress < 0.34) { statusText = 'AUTH';        statusColor = FTP_COLORS.warn; }
    else if (progress < 0.47) { statusText = 'FIREWALL';    statusColor = FTP_COLORS.bypass; }
    else if (progress < 0.60) { statusText = 'ESCALATION';  statusColor = FTP_COLORS.bypass; }
    else if (progress < 0.83) { statusText = 'EXFIL';       statusColor = FTP_COLORS.success; }
    else if (progress < 1)    { statusText = 'CLEANUP';     statusColor = FTP_COLORS.success; }
    else                      { statusText = 'DONE';        statusColor = FTP_COLORS.success; }

    const blink = Math.floor(now / 500) % 2;
    cctx.fillStyle = blink ? statusColor : 'rgba(0,255,0,0.5)';
    cctx.fillText('▸ ' + statusText, 4, topH / 2);

    cctx.fillStyle = 'rgba(51, 204, 255, 0.7)';
    cctx.font = '7px Consolas, monospace';
    cctx.fillText(attack.host + ':' + attack.port, 70, topH / 2);

    const barW = 44;
    const barX = W - barW - 4;
    cctx.fillStyle = '#000'; cctx.fillRect(barX, 5, barW, 5);
    cctx.strokeStyle = 'rgba(0,255,0,0.6)'; cctx.strokeRect(barX + 0.5, 5.5, barW - 1, 4);
    cctx.fillStyle = progress >= 1 ? FTP_COLORS.success : FTP_COLORS.warn;
    cctx.fillRect(barX + 1, 6, (barW - 2) * progress, 3);

    const paddingTop = topH + 4;
    const paddingBottom = 3;
    const lineHeight = 10;
    const maxVisible = Math.floor((H - paddingTop - paddingBottom) / lineHeight);

    let currentIdx = 0;
    for (let i = 0; i < log.length; i++) {
        if (progress >= log[i].t) currentIdx = i + 1;
        else break;
    }
    const startIdx = Math.max(0, currentIdx - maxVisible + 1);

    let flashTriggered = false;
    for (let i = 0; i < log.length; i++) {
        const ev = log[i];
        if (ev.type === 'bypass' && Math.abs(progress - ev.t) < 0.006) { flashTriggered = true; break; }
    }

    cctx.font = '8px Consolas, monospace';
    cctx.textBaseline = 'alphabetic'; cctx.textAlign = 'left';
    for (let i = startIdx; i < log.length && i - startIdx < maxVisible; i++) {
        const ev = log[i];
        const y = paddingTop + (i - startIdx + 1) * lineHeight;
        ftpDrawLine(cctx, ev, i, log, y, now, progress, W);
    }

    if (progress >= log[log.length - 1].t) {
        const y = paddingTop + Math.min(maxVisible, log.length - startIdx) * lineHeight;
        if (Math.floor(now / 400) % 2 === 0) {
            cctx.fillStyle = FTP_COLORS.success;
            cctx.fillRect(4, y - 7, 5, 9);
        }
    }

    if (flashTriggered) {
        cctx.fillStyle = 'rgba(255, 68, 255, 0.10)';
        cctx.fillRect(0, 0, W, H);
    }

    if (progress >= 1) {
        cctx.strokeStyle = 'rgba(51,255,51,0.6)';
        cctx.lineWidth = 1;
        cctx.strokeRect(0.5, 0.5, W - 1, H - 1);
    }
    if (proc.isStalled) {
        cctx.strokeStyle = 'rgba(255,204,0,0.5)';
        cctx.strokeRect(0.5, 0.5, W - 1, H - 1);
        cctx.font = 'bold 9px Consolas, monospace';
        cctx.fillStyle = '#ffcc00';
        cctx.textAlign = 'right'; cctx.textBaseline = 'alphabetic';
        cctx.fillText('[STALLED]', W - 4, topH - 3);
    }
}

function ftpDrawLine(cctx, ev, idx, log, y, now, progress, W) {
    if (progress < ev.t) return;
    if (ev.type === 'sep') {
        cctx.strokeStyle = 'rgba(0,255,0,0.22)';
        cctx.setLineDash([3, 3]);
        cctx.beginPath(); cctx.moveTo(4, y - 3); cctx.lineTo(W - 4, y - 3); cctx.stroke();
        cctx.setLineDash([]); return;
    }
    if (ev.type === 'end') {
        cctx.fillStyle = FTP_COLORS.success;
        cctx.font = 'bold 8px Consolas, monospace';
        cctx.fillText('>>> ATTACK COMPLETE', 4, y); return;
    }
    const nextT = (idx + 1 < log.length) ? log[idx + 1].t : ev.t + 0.05;
    const lineT = Math.max(0.0001, nextT - ev.t);
    const lineProgress = Math.min(1, (progress - ev.t) / lineT);
    const isTyping = lineProgress < 1;
    const isCurrent = progress >= ev.t && progress < nextT;

    let color = FTP_COLORS.info;
    let bold = false;
    switch (ev.type) {
        case 'header':  color = FTP_COLORS.header;  bold = true; break;
        case 'info':    color = FTP_COLORS.info; break;
        case 'success': color = FTP_COLORS.success; break;
        case 'fail':    color = FTP_COLORS.fail; break;
        case 'warn':    color = FTP_COLORS.warn; break;
        case 'bypass':  color = FTP_COLORS.bypass; bold = true; break;
        case 'file':    color = FTP_COLORS.file; break;
        case 'spinner': color = FTP_COLORS.info; break;
    }
    cctx.fillStyle = color;
    cctx.font = (bold ? 'bold ' : '') + '8px Consolas, monospace';

    let text = ev.text || '';
    let visibleText = text;
    if (isTyping && ev.type !== 'spinner' && ev.type !== 'file') {
        visibleText = text.substring(0, Math.ceil(text.length * lineProgress));
    }

    if (ev.type === 'spinner') { ftpDrawSpinner(cctx, ev, idx, log, y, now, progress, color, W); return; }
    if (ev.type === 'file')    { ftpDrawFile(cctx, ev, idx, log, y, now, progress, color, W); return; }

    if (isCurrent && ev.type === 'bypass') {
        cctx.fillStyle = 'rgba(255,68,255,0.08)';
        cctx.fillRect(0, y - 8, W, 10);
        cctx.fillStyle = color;
    }
    cctx.fillText(visibleText, 4, y);
    if (isTyping && isCurrent && Math.floor(now / 200) % 2 === 0) {
        const w = cctx.measureText(visibleText).width;
        cctx.fillRect(4 + w + 1, y - 6, 5, 8);
    }
}

function ftpDrawSpinner(cctx, ev, idx, log, y, now, progress, color, W) {
    const nextT = (idx + 1 < log.length) ? log[idx + 1].t : ev.t + 0.05;
    const lineProgress = Math.min(1, (progress - ev.t) / (nextT - ev.t));
    cctx.fillStyle = color;
    cctx.font = '8px Consolas, monospace';
    cctx.fillText(ev.text, 4, y);
    const tw = cctx.measureText(ev.text).width;
    const barW = 50; const barX = 4 + tw + 4;
    cctx.fillStyle = '#000'; cctx.fillRect(barX, y - 6, barW, 7);
    cctx.strokeStyle = color; cctx.strokeRect(barX + 0.5, y - 5.5, barW - 1, 6);
    cctx.fillStyle = color; cctx.fillRect(barX + 1, y - 5, (barW - 2) * lineProgress, 5);
    cctx.fillText(Math.round(lineProgress * 100) + '%', barX + barW + 3, y);
}

function ftpDrawFile(cctx, ev, idx, log, y, now, progress, color, W) {
    const nextT = (idx + 1 < log.length) ? log[idx + 1].t : ev.t + 0.04;
    const lineProgress = Math.min(1, (progress - ev.t) / (nextT - ev.t));
    cctx.fillStyle = color;
    cctx.font = '8px Consolas, monospace';
    const prefix = '>>> ';
    cctx.fillText(prefix + ev.text, 4, y);
    const tw = cctx.measureText(prefix + ev.text).width;
    const barX = 4 + tw + 6;
    const barW = W - barX - 52;
    cctx.fillStyle = '#000'; cctx.fillRect(barX, y - 6, barW, 7);
    cctx.strokeStyle = 'rgba(0,255,0,0.5)'; cctx.strokeRect(barX + 0.5, y - 5.5, barW - 1, 6);
    const fillW = (barW - 2) * lineProgress;
    if (fillW > 0) {
        const grad = cctx.createLinearGradient(barX, 0, barX + fillW, 0);
        grad.addColorStop(0, '#33ff33'); grad.addColorStop(1, '#33ffff');
        cctx.fillStyle = grad;
        cctx.fillRect(barX + 1, y - 5, fillW, 5);
    }
    cctx.fillStyle = color;
    cctx.textAlign = 'right';
    cctx.fillText(ev.size, W - 4, y);
    cctx.textAlign = 'left';
    if (lineProgress >= 1) { cctx.fillStyle = FTP_COLORS.success; cctx.fillText('✓', barX + barW + 3, y); }
    else { cctx.fillStyle = FTP_COLORS.warn; cctx.fillText(Math.round(lineProgress * 100) + '%', barX + barW + 3, y); }
}

// ============================================================
// SMTP — Helix Matrix
// ============================================================
const SMTP_PHASES = [
    { t: 0.06, label: 'TCP',   c: 'CONNECT',      s: '220' },
    { t: 0.18, label: 'EHLO',  c: 'EHLO',         s: '250' },
    { t: 0.32, label: 'AUTH',  c: 'AUTH LOGIN',   s: '334' },
    { t: 0.45, label: 'MAIL',  c: 'MAIL FROM',    s: '250' },
    { t: 0.58, label: 'RCPT',  c: 'RCPT TO',      s: '250' },
    { t: 0.72, label: 'DATA',  c: 'DATA',         s: '354' },
    { t: 0.85, label: 'QUEUE', c: 'MSG END',      s: '250' },
    { t: 0.94, label: 'QUIT',  c: 'QUIT',         s: '221' }
];

const SMTP_POOL_A = 'EHLOAMRCDTUQIPSN0123456789'.split('');
const SMTP_POOL_B = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=_@.:-<>'.split('');

function createSmtpData() {
    const segments = 70;
    const points = [];
    for (let i = 0; i < segments; i++) {
        points.push({
            t: i / (segments - 1),
            ch1: SMTP_POOL_A[Math.floor(Math.random() * SMTP_POOL_A.length)],
            ch2: SMTP_POOL_B[Math.floor(Math.random() * SMTP_POOL_B.length)],
        });
    }
    return { points, segments };
}

function drawSmtpAnimation(proc, now) {
    const c = document.getElementById('smtp-canvas-' + proc.id);
    if (!c || !proc.smtpData) return;
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(0, 255, 0, 0.05)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const progress = Math.min(1, (proc.animatedElapsed || 0) / proc.smtpDuration);
    const t = (now - (proc.smtpStartTime || 0)) / 1000;
    const completed = progress >= 1;
    const frontT = progress;

    const labelColW = 38;
    const barAreaW = 24;
    const topMargin = 12;
    const bottomMargin = 46;
    const helixHeight = H - topMargin - bottomMargin;
    const cx = labelColW + (W - labelColW - barAreaW) / 2;

    const rotY = t * 0.9;
    const tiltX = Math.sin(t * 0.35) * 0.20;
    const focal = 380;
    const helixRadius = Math.max(28, Math.min(44, helixHeight * 0.25));

    const cosT = Math.cos(tiltX), sinT = Math.sin(tiltX);
    const points = proc.smtpData.points;
    const numPoints = points.length;

    SMTP_PHASES.forEach(ph => {
        const y0 = -helixHeight / 2 + ph.t * helixHeight;
        const screenY = H / 2 + y0 * cosT;
        const passed = frontT > ph.t;
        const atFront = Math.abs(frontT - ph.t) < 0.015 && !completed;
        const labelX = labelColW - 3;
        const helixEdgeX = cx - helixRadius - 3;

        ctx.strokeStyle = completed ? 'rgba(51, 255, 51, 0.35)' : (passed ? 'rgba(68, 221, 255, 0.4)' : 'rgba(120, 30, 30, 0.35)');
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.beginPath(); ctx.moveTo(labelX, screenY); ctx.lineTo(helixEdgeX, screenY); ctx.stroke();
        ctx.setLineDash([]);

        let dotColor;
        if (completed) dotColor = '#33ff33';
        else if (atFront) dotColor = '#ffffff';
        else if (passed) dotColor = '#44ddff';
        else dotColor = '#7a1e1e';

        if (atFront) { ctx.shadowBlur = 10; ctx.shadowColor = '#ffffff'; }
        else if (passed && !completed) { ctx.shadowBlur = 4; ctx.shadowColor = dotColor; }
        else ctx.shadowBlur = 0;

        ctx.fillStyle = dotColor;
        ctx.beginPath(); ctx.arc(labelX - 3, screenY, atFront ? 2.6 : 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.font = 'bold 8px Consolas, monospace';
        let labelColor;
        if (completed) labelColor = 'rgba(51, 255, 51, 0.95)';
        else if (atFront) labelColor = 'rgba(255, 255, 255, 1)';
        else if (passed) labelColor = 'rgba(68, 221, 255, 0.85)';
        else labelColor = 'rgba(140, 40, 40, 0.55)';
        ctx.fillStyle = labelColor;
        ctx.fillText(ph.label, labelX - 8, screenY - 4);

        if (passed || atFront || completed) {
            ctx.font = '6px Consolas, monospace';
            ctx.fillStyle = completed ? 'rgba(51, 255, 51, 0.6)' : (atFront ? 'rgba(255, 255, 255, 0.9)' : 'rgba(68, 221, 255, 0.55)');
            ctx.fillText(ph.s, labelX - 8, screenY + 5);
        }
    });

    const queue = [];
    for (let i = 0; i < numPoints; i++) {
        const p = points[i];
        const y0 = -helixHeight / 2 + p.t * helixHeight;
        const angleA = p.t * Math.PI * 5 + rotY;
        const angleB = angleA + Math.PI;

        const ax = Math.cos(angleA) * helixRadius;
        const az = Math.sin(angleA) * helixRadius;
        const bx = Math.cos(angleB) * helixRadius;
        const bz = Math.sin(angleB) * helixRadius;

        const ay2 = y0 * cosT - az * sinT;
        const az2 = y0 * sinT + az * cosT;
        const by2 = y0 * cosT - bz * sinT;
        const bz2 = y0 * sinT + bz * cosT;

        const aScale = focal / (focal + az2);
        const bScale = focal / (focal + bz2);

        const aScreenX = cx + ax * aScale;
        const aScreenY = H / 2 + ay2 * aScale;
        const bScreenX = cx + bx * bScale;
        const bScreenY = H / 2 + by2 * bScale;

        const done = p.t <= frontT;
        const atFront = Math.abs(p.t - frontT) < 0.02 && !completed;

        queue.push({ x: aScreenX, y: aScreenY, depth: az2, size: 7 * aScale, strand: 'A', ch: p.ch1, done, atFront });
        queue.push({ x: bScreenX, y: bScreenY, depth: bz2, size: 7 * bScale, strand: 'B', ch: p.ch2, done, atFront });
    }

    for (let i = 0; i < numPoints; i++) {
        const p = points[i];
        const y0 = -helixHeight / 2 + p.t * helixHeight;
        const angleA = p.t * Math.PI * 5 + rotY;
        const angleB = angleA + Math.PI;
        const ax = Math.cos(angleA) * helixRadius;
        const az = Math.sin(angleA) * helixRadius;
        const bx = Math.cos(angleB) * helixRadius;
        const bz = Math.sin(angleB) * helixRadius;

        const ay2 = y0 * cosT - az * sinT;
        const az2 = y0 * sinT + az * cosT;
        const by2 = y0 * cosT - bz * sinT;
        const bz2 = y0 * sinT + bz * cosT;

        const aScale = focal / (focal + az2);
        const bScale = focal / (focal + bz2);
        const aScreenX = cx + ax * aScale;
        const aScreenY = H / 2 + ay2 * aScale;
        const bScreenX = cx + bx * bScale;
        const bScreenY = H / 2 + by2 * bScale;

        const avgDepth = (az2 + bz2) / 2;
        const depthFade = Math.max(0, 1 - (avgDepth + helixRadius) / (2 * helixRadius)) * 0.55;

        const done = p.t <= frontT;
        const atFront = Math.abs(p.t - frontT) < 0.02 && !completed;

        let grad;
        if (completed) {
            grad = ctx.createLinearGradient(aScreenX, aScreenY, bScreenX, bScreenY);
            grad.addColorStop(0, `rgba(51, 255, 51, ${depthFade})`);
            grad.addColorStop(1, `rgba(51, 255, 51, ${depthFade * 0.6})`);
        } else if (atFront) {
            grad = ctx.createLinearGradient(aScreenX, aScreenY, bScreenX, bScreenY);
            grad.addColorStop(0, `rgba(255, 255, 255, 0.9)`);
            grad.addColorStop(0.5, `rgba(255, 255, 255, 0.7)`);
            grad.addColorStop(1, `rgba(255, 255, 255, 0.9)`);
        } else if (done) {
            grad = ctx.createLinearGradient(aScreenX, aScreenY, bScreenX, bScreenY);
            grad.addColorStop(0, `rgba(68, 221, 255, ${depthFade})`);
            grad.addColorStop(0.5, `rgba(255, 68, 221, ${depthFade * 0.85})`);
            grad.addColorStop(1, `rgba(255, 221, 68, ${depthFade})`);
        } else {
            const pendingAlpha = depthFade * 0.28;
            grad = ctx.createLinearGradient(aScreenX, aScreenY, bScreenX, bScreenY);
            grad.addColorStop(0, `rgba(120, 20, 20, ${pendingAlpha})`);
            grad.addColorStop(0.5, `rgba(140, 30, 40, ${pendingAlpha})`);
            grad.addColorStop(1, `rgba(120, 20, 20, ${pendingAlpha})`);
        }

        ctx.strokeStyle = grad;
        ctx.lineWidth = atFront ? 1.4 : 0.8;
        ctx.beginPath(); ctx.moveTo(aScreenX, aScreenY); ctx.lineTo(bScreenX, bScreenY); ctx.stroke();
    }

    queue.sort((a, b) => b.depth - a.depth);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    queue.forEach(item => {
        const depthNorm = (item.depth + helixRadius) / (2 * helixRadius);
        let rgb, alpha;
        if (completed) { rgb = [51, 255, 51]; alpha = (1 - depthNorm * 0.75); }
        else if (item.atFront) { rgb = [255, 255, 255]; alpha = 1.0; }
        else if (item.done) {
            rgb = item.strand === 'A' ? [68, 221, 255] : [255, 68, 221];
            alpha = (1 - depthNorm * 0.75) * 0.95;
        } else { rgb = [180, 30, 30]; alpha = (1 - depthNorm * 0.85) * 0.35; }

        const brighten = 1 - depthNorm * 0.45;
        const fr = Math.min(255, Math.floor(rgb[0] * brighten));
        const fg = Math.min(255, Math.floor(rgb[1] * brighten));
        const fb = Math.min(255, Math.floor(rgb[2] * brighten));

        if (item.atFront) { ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(255, 255, 255, 1)'; }
        else if (depthNorm < 0.35 && item.done) { ctx.shadowBlur = 6; ctx.shadowColor = `rgba(${fr}, ${fg}, ${fb}, ${alpha})`; }
        else if (completed && depthNorm < 0.35) { ctx.shadowBlur = 7; ctx.shadowColor = `rgba(51, 255, 51, ${alpha})`; }
        else ctx.shadowBlur = 0;

        const sizeBoost = item.atFront ? 1.35 : 1;
        ctx.font = `bold ${item.size * sizeBoost}px Consolas, monospace`;
        ctx.fillStyle = `rgba(${fr}, ${fg}, ${fb}, ${alpha})`;
        ctx.fillText(item.ch, item.x, item.y);

        if (!item.done && !completed && Math.random() < 0.006) {
            const pool = item.strand === 'A' ? SMTP_POOL_A : SMTP_POOL_B;
            const target = points.find(p => (item.strand === 'A' ? p.ch1 : p.ch2) === item.ch);
            if (target) {
                if (item.strand === 'A') target.ch1 = pool[Math.floor(Math.random() * pool.length)];
                else target.ch2 = pool[Math.floor(Math.random() * pool.length)];
            }
        }
    });
    ctx.shadowBlur = 0;

    if (!completed) {
        const y0 = -helixHeight / 2 + frontT * helixHeight;
        const frontScreenY = H / 2 + y0 * cosT;
        const lineRight = cx + helixRadius * 1.15 + 12;

        const frontGrad = ctx.createLinearGradient(0, frontScreenY - 8, 0, frontScreenY + 8);
        frontGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        frontGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
        frontGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = frontGrad;
        ctx.fillRect(labelColW, frontScreenY - 8, lineRight - labelColW, 16);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(labelColW, frontScreenY); ctx.lineTo(lineRight, frontScreenY); ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.moveTo(labelColW, frontScreenY - 3);
        ctx.lineTo(labelColW, frontScreenY + 3);
        ctx.lineTo(labelColW - 4, frontScreenY);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(lineRight, frontScreenY - 3);
        ctx.lineTo(lineRight, frontScreenY + 3);
        ctx.lineTo(lineRight + 4, frontScreenY);
        ctx.closePath(); ctx.fill();
    }

    ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + progress * 0.05})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx, topMargin - 6);
    ctx.lineTo(cx, H - bottomMargin + 6);
    ctx.stroke();

    const barX = W - 20;
    const barY = topMargin;
    const barW = 13;
    const barH = helixHeight;

    ctx.fillStyle = 'rgba(10, 20, 10, 1)';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX + 0.5, barY + 0.5, barW - 1, barH - 1);

    const fillH = barH * progress;
    const fillGrad = ctx.createLinearGradient(barX, barY, barX + barW, barY + fillH);
    if (completed) {
        fillGrad.addColorStop(0, '#33ff33'); fillGrad.addColorStop(1, '#33ff33');
    } else {
        fillGrad.addColorStop(0, '#44ddff');
        fillGrad.addColorStop(0.5, '#ff44dd');
        fillGrad.addColorStop(1, '#ffdd44');
    }
    ctx.fillStyle = fillGrad;
    ctx.fillRect(barX + 2, barY + 2, barW - 4, Math.max(0, fillH - 4));

    SMTP_PHASES.forEach(ph => {
        const my = barY + barH * ph.t;
        const passed = frontT > ph.t;
        ctx.strokeStyle = passed ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 255, 0, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(barX + barW - 4, my); ctx.lineTo(barX + barW, my); ctx.stroke();
    });

    if (!completed) {
        const frontY = barY + fillH;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(barX - 1, frontY - 1, barW + 2, 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(barX - 2, frontY - 2, barW + 4, 4);
    }

    ctx.fillStyle = completed ? '#33ff33' : '#44ddff';
    ctx.font = 'bold 8px Consolas, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(Math.floor(progress * 100) + '%', barX + barW / 2, barY - 3);

    const statusY = H - 42;
    const statusX = 6;
    const statusW = W - 12;
    const statusH = 36;

    ctx.fillStyle = 'rgba(0, 20, 0, 0.75)';
    ctx.fillRect(statusX, statusY, statusW, statusH);
    ctx.strokeStyle = completed ? 'rgba(51, 255, 51, 0.8)' : (progress > 0 ? 'rgba(68, 221, 255, 0.6)' : 'rgba(0, 255, 0, 0.35)');
    ctx.lineWidth = 1;
    ctx.strokeRect(statusX + 0.5, statusY + 0.5, statusW - 1, statusH - 1);

    let activePhase = SMTP_PHASES[0];
    for (let i = SMTP_PHASES.length - 1; i >= 0; i--) {
        if (frontT >= SMTP_PHASES[i].t) { activePhase = SMTP_PHASES[i]; break; }
    }

    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.font = 'bold 8px Consolas, monospace';
    const dotBlink = Math.floor(now / 300) % 2 === 0;
    ctx.fillStyle = completed ? '#33ff33' : '#44ddff';
    ctx.fillText('▸ SMTP', statusX + 6, statusY + 13);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText('·', statusX + 46, statusY + 13);

    ctx.fillStyle = completed ? '#33ff33' : '#ff44dd';
    ctx.fillText(activePhase.label, statusX + 56, statusY + 13);

    ctx.font = '7px Consolas, monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText('C ' + activePhase.c, statusX + 92, statusY + 13);

    ctx.textAlign = 'right';
    ctx.fillStyle = completed ? 'rgba(51, 255, 51, 0.85)' : 'rgba(255, 68, 221, 0.85)';
    ctx.fillText('S ' + activePhase.s, statusX + statusW - 6, statusY + 13);

    ctx.textAlign = 'left';
    ctx.font = '7px Consolas, monospace';

    let stream = '';
    SMTP_PHASES.forEach(ph => { if (frontT >= ph.t) stream += ph.label + ' '; });
    if (stream.length === 0) {
        stream = 'standby...';
        ctx.fillStyle = 'rgba(140, 40, 40, 0.7)';
    } else {
        ctx.fillStyle = '#33ff33';
    }
    ctx.fillText(stream.trim(), statusX + 6, statusY + 28);

    if (!completed && stream.length > 0 && dotBlink && stream !== 'standby...') {
        const w = ctx.measureText(stream.trim()).width;
        ctx.fillStyle = '#44ddff';
        ctx.fillRect(statusX + 6 + w + 4, statusY + 21, 4, 8);
    }

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(68, 221, 255, 0.55)';
    ctx.font = '7px Consolas, monospace';
    const processed = SMTP_PHASES.filter(ph => frontT >= ph.t).length;
    ctx.fillText(processed + '/' + SMTP_PHASES.length, statusX + statusW - 6, statusY + 28);

    if (proc.isStalled) {
        ctx.strokeStyle = 'rgba(255, 204, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
        ctx.font = '9px Consolas, monospace';
        ctx.fillStyle = '#ffcc00';
        ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
        ctx.fillText('[STALLED]', W - 5, 11);
    } else if (completed) {
        const pulse = 0.5 + 0.5 * Math.sin(now / 220);
        ctx.strokeStyle = `rgba(51, 255, 51, ${0.4 + pulse * 0.4})`;
        ctx.lineWidth = 1.4;
        ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
    }
}

// ============================================================
// TELNET — Phase Lock
// ============================================================
const TELNET_HEX = '0123456789ABCDEF'.split('');
function telnetRndHex() { return TELNET_HEX[Math.floor(Math.random() * 16)]; }
function telnetRndHexByte() { return telnetRndHex() + telnetRndHex(); }
function telnetLerp(a, b, t) { return a + (b - a) * t; }
function telnetClamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
function telnetSmoothstep(t) { t = telnetClamp01(t); return t * t * (3 - 2 * t); }
function telnetSmootherstep(t) { t = telnetClamp01(t); return t * t * t * (t * (t * 6 - 15) + 10); }

const TELNET_IAC_COLORS = {
    iac:  [255, 60, 60], do_: [255, 120, 60], dont: [255, 170, 60],
    will: [255, 60, 200], wont: [200, 60, 255]
};
function telnetPickIacType() {
    const r = Math.random();
    if (r < 0.30) return 'iac';
    if (r < 0.50) return 'do_';
    if (r < 0.65) return 'dont';
    if (r < 0.85) return 'will';
    return 'wont';
}
function telnetIacLabel(type) {
    return { iac: 'IAC', do_: 'DO', dont: 'DONT', will: 'WILL', wont: 'WONT' }[type] || '';
}

const TELNET_LOCK_COLOR_STOPS = [
    { t: 0.00, c: [68, 221, 255] }, { t: 0.25, c: [110, 130, 255] },
    { t: 0.50, c: [230, 90, 240] }, { t: 0.75, c: [255, 200, 90] },
    { t: 1.00, c: [51, 255, 51] }
];
function telnetLockColor(lockPct) {
    const s = TELNET_LOCK_COLOR_STOPS;
    for (let i = 0; i < s.length - 1; i++) {
        const a = s[i], b = s[i + 1];
        if (lockPct <= b.t) {
            const k = (lockPct - a.t) / (b.t - a.t);
            return [
                Math.round(telnetLerp(a.c[0], b.c[0], k)),
                Math.round(telnetLerp(a.c[1], b.c[1], k)),
                Math.round(telnetLerp(a.c[2], b.c[2], k))
            ];
        }
    }
    return s[s.length - 1].c;
}

const TELNET_TRI_VERTS = [
    { x: 0,         y: 1 },
    { x: -0.866025, y: -0.5 },
    { x: 0.866025,  y: -0.5 }
];
function telnetTrianglePoint(a) {
    const period = (2 * Math.PI) / 3;
    let aa = a % (2 * Math.PI);
    if (aa < 0) aa += 2 * Math.PI;
    const seg = Math.floor(aa / period);
    const t = (aa - seg * period) / period;
    const v1 = TELNET_TRI_VERTS[seg % 3];
    const v2 = TELNET_TRI_VERTS[(seg + 1) % 3];
    return { x: telnetLerp(v1.x, v2.x, t), y: telnetLerp(v1.y, v2.y, t) };
}

const TELNET_SQ_VERTS = [
    { x: 0.707106,  y: 0.707106 },
    { x: -0.707106, y: 0.707106 },
    { x: -0.707106, y: -0.707106 },
    { x: 0.707106,  y: -0.707106 }
];
function telnetSquarePoint(a) {
    const period = Math.PI / 2;
    let aa = a % (2 * Math.PI);
    if (aa < 0) aa += 2 * Math.PI;
    const seg = Math.floor(aa / period);
    const t = (aa - seg * period) / period;
    const v1 = TELNET_SQ_VERTS[seg % 4];
    const v2 = TELNET_SQ_VERTS[(seg + 1) % 4];
    return { x: telnetLerp(v1.x, v2.x, t), y: telnetLerp(v1.y, v2.y, t) };
}

function telnetImperfectCirclePoint(a) {
    const r = 1 + 0.14 * Math.sin(3 * a + 0.6) + 0.05 * Math.sin(5 * a);
    return { x: Math.cos(a) * r, y: Math.sin(a) * r };
}
function telnetCirclePoint(a) { return { x: Math.cos(a), y: Math.sin(a) }; }

const TELNET_SHAPE_KEYS = [
    { t: 0.00, kind: 'erratic' }, { t: 0.18, kind: 'erratic' },
    { t: 0.36, kind: 'triangle' }, { t: 0.52, kind: 'square' },
    { t: 0.72, kind: 'imperfect' }, { t: 0.92, kind: 'circle' },
    { t: 1.00, kind: 'circle' }
];

function telnetGetShape(kind, erratic, tri, sq, imp, cir) {
    switch (kind) {
        case 'erratic':   return erratic;
        case 'triangle':  return tri;
        case 'square':    return sq;
        case 'imperfect': return imp;
        case 'circle':    return cir;
    }
    return cir;
}

function telnetSampleShape(a, progress, now, errPhase) {
    const tx = now * 0.0007 + errPhase;
    const fx = 2.4 + Math.sin(tx * 1.10) * 1.2;
    const fy = 3.1 + Math.cos(tx * 0.83) * 1.3;
    const ph = Math.sin(tx * 0.47) * 1.7;
    const erratic = { x: Math.sin(fx * a + ph), y: Math.sin(fy * a + ph * 0.7) };
    const tri = telnetTrianglePoint(a);
    const sq  = telnetSquarePoint(a);
    const imp = telnetImperfectCirclePoint(a);
    const cir = telnetCirclePoint(a);

    for (let i = 0; i < TELNET_SHAPE_KEYS.length - 1; i++) {
        const A = TELNET_SHAPE_KEYS[i];
        const B = TELNET_SHAPE_KEYS[i + 1];
        if (progress <= B.t) {
            const p1 = telnetGetShape(A.kind, erratic, tri, sq, imp, cir);
            const p2 = telnetGetShape(B.kind, erratic, tri, sq, imp, cir);
            if (A.kind === B.kind) return p2;
            const span = B.t - A.t;
            const k = span <= 0 ? 0 : telnetSmoothstep((progress - A.t) / span);
            return { x: telnetLerp(p1.x, p2.x, k), y: telnetLerp(p1.y, p2.y, k) };
        }
    }
    return cir;
}

const TELNET_PHASES_HUD = [
    { t: 0.00, label: 'PROBE' }, { t: 0.14, label: 'NEGOTIATE' },
    { t: 0.38, label: 'TUNING' }, { t: 0.62, label: 'LOCKING' },
    { t: 0.86, label: 'AUTH' }, { t: 1.00, label: 'STABLE' }
];

function createTelnetData() {
    const errPhase = Math.random() * 1000;
    const trail = [];
    const maxTrail = 1200;
    let angle = 0;
    const iacEvents = [];

    const negCount = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < negCount; i++) {
        const t = 0.15 + Math.random() * 0.18;
        const type = telnetPickIacType();
        iacEvents.push({ t, type, label: telnetIacLabel(type), color: TELNET_IAC_COLORS[type], fired: false });
    }
    const bruteCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < bruteCount; i++) {
        const t = 0.42 + Math.random() * 0.22;
        const type = telnetPickIacType();
        iacEvents.push({ t, type, label: telnetIacLabel(type), color: TELNET_IAC_COLORS[type], fired: false });
    }
    iacEvents.sort((a, b) => a.t - b.t);

    const totalBytes = 300 + Math.floor(Math.random() * 120);
    const byteStream = [];
    for (let i = 0; i < totalBytes; i++) {
        const isIac = Math.random() < 0.11;
        byteStream.push({ hex: telnetRndHexByte(), iacType: isIac ? telnetPickIacType() : null });
    }

    return {
        errPhase, trail, maxTrail, angle,
        iacEvents, iacGlitches: [],
        byteStream, bytesProcessed: 0, totalBytes,
        lastNow: 0
    };
}

function drawTelnetAnimation(proc, now) {
    const c = document.getElementById('telnet-canvas-' + proc.id);
    if (!c || !proc.telnetData) return;
    const cctx = c.getContext('2d');
    const W = c.width, H = c.height;
    const data = proc.telnetData;

    const dt = Math.min(60, now - (data.lastNow || now));
    data.lastNow = now;

    const progress = Math.min(1, (proc.animatedElapsed || 0) / proc.telnetDuration);
    const completed = progress >= 1;
    const baseColor = telnetLockColor(progress);

    let activePhase = TELNET_PHASES_HUD[0];
    for (let i = TELNET_PHASES_HUD.length - 1; i >= 0; i--) {
        if (progress >= TELNET_PHASES_HUD[i].t) { activePhase = TELNET_PHASES_HUD[i]; break; }
    }

    data.iacEvents.forEach(ev => {
        if (!ev.fired && progress >= ev.t) {
            ev.fired = true;
            data.iacGlitches.push({ start: now, duration: 400, type: ev.type, color: ev.color, label: ev.label });
        }
    });
    data.iacGlitches = data.iacGlitches.filter(g => now - g.start < g.duration);

    let iacJitter = 0;
    let iacFlashIntensity = 0;
    let iacFlashColor = null;
    const iacGate = 1 - telnetSmootherstep(progress);
    data.iacGlitches.forEach(g => {
        const gt = (now - g.start) / g.duration;
        const amp = Math.sin(gt * Math.PI) * iacGate;
        iacJitter += amp * 0.22;
        if (amp > iacFlashIntensity) { iacFlashIntensity = amp; iacFlashColor = g.color; }
    });

    cctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    cctx.fillRect(0, 0, W, H);

    cctx.strokeStyle = 'rgba(0, 255, 0, 0.045)';
    cctx.lineWidth = 1;
    for (let x = 0; x < W; x += 14) { cctx.beginPath(); cctx.moveTo(x + 0.5, 0); cctx.lineTo(x + 0.5, H); cctx.stroke(); }
    for (let y = 0; y < H; y += 14) { cctx.beginPath(); cctx.moveTo(0, y + 0.5); cctx.lineTo(W, y + 0.5); cctx.stroke(); }

    const readoutY = 5;
    const readoutH = 16;
    const scopeTop = readoutY + readoutH + 6;
    const scopeBottom = H - 42;
    const scopeCX = W / 2;
    const scopeCY = (scopeTop + scopeBottom) / 2;
    const scopeRX = Math.min(W / 2 - 16, 92);
    const scopeRY = Math.min((scopeBottom - scopeTop) / 2 - 6, 78);

    const speedEase = telnetSmootherstep(Math.min(1, progress));
    const tipSpeed = telnetLerp(4.5, 1.3, speedEase);
    data.angle += (dt / 1000) * tipSpeed;

    const jitterBase = telnetLerp(0.36, 0.002, telnetSmootherstep(progress));
    const totalJitter = jitterBase + iacJitter * (1 - telnetSmootherstep(progress));

    const samplesThisFrame = 3;
    for (let s = 0; s < samplesThisFrame; s++) {
        const a = data.angle + s * 0.02;
        const pt = telnetSampleShape(a, progress, now, data.errPhase);
        const jx = (Math.random() - 0.5) * totalJitter * scopeRX * 1.4;
        const jy = (Math.random() - 0.5) * totalJitter * scopeRY * 1.4;
        let px = pt.x * scopeRX + jx;
        let py = pt.y * scopeRY + jy;
        px = Math.max(-scopeRX - 6, Math.min(scopeRX + 6, px));
        py = Math.max(-scopeRY - 6, Math.min(scopeRY + 6, py));

        let color;
        if (iacFlashIntensity > 0.35 && iacFlashColor) {
            const f = Math.min(1, iacFlashIntensity);
            color = [
                Math.round(telnetLerp(baseColor[0], iacFlashColor[0], f)),
                Math.round(telnetLerp(baseColor[1], iacFlashColor[1], f)),
                Math.round(telnetLerp(baseColor[2], iacFlashColor[2], f))
            ];
        } else color = baseColor;

        data.trail.push({ x: scopeCX + px, y: scopeCY + py, life: 1, color });
        if (data.trail.length > data.maxTrail) data.trail.shift();
    }

    const decay = 0.0025;
    for (let i = 0; i < data.trail.length; i++) data.trail[i].life -= decay;

    for (let i = 0; i < data.trail.length - 1; i++) {
        const p1 = data.trail[i];
        const p2 = data.trail[i + 1];
        if (p1.life <= 0) continue;
        const alpha = Math.max(0, p1.life);
        cctx.strokeStyle = `rgba(${p1.color[0]}, ${p1.color[1]}, ${p1.color[2]}, ${alpha * 0.85})`;
        cctx.lineWidth = 1 + alpha * 0.6;
        if (alpha > 0.82) {
            cctx.shadowBlur = 7;
            cctx.shadowColor = `rgba(${p1.color[0]}, ${p1.color[1]}, ${p1.color[2]}, ${alpha})`;
        }
        cctx.beginPath(); cctx.moveTo(p1.x, p1.y); cctx.lineTo(p2.x, p2.y); cctx.stroke();
        cctx.shadowBlur = 0;
    }

    if (data.trail.length > 0) {
        const tip = data.trail[data.trail.length - 1];
        cctx.fillStyle = `rgba(${tip.color[0]}, ${tip.color[1]}, ${tip.color[2]}, 1)`;
        cctx.shadowBlur = 16;
        cctx.shadowColor = `rgba(${tip.color[0]}, ${tip.color[1]}, ${tip.color[2]}, 1)`;
        cctx.beginPath(); cctx.arc(tip.x, tip.y, 2.4, 0, Math.PI * 2); cctx.fill();
        cctx.shadowBlur = 0;
    }

    if (!completed) {
        const ringR = Math.min(scopeRX, scopeRY) + 14;
        const ringAlpha = 0.08 + progress * 0.5;
        const ringColor = progress > 0.9 ? [51, 255, 51] : baseColor;
        cctx.strokeStyle = `rgba(${ringColor[0]}, ${ringColor[1]}, ${ringColor[2]}, ${ringAlpha})`;
        cctx.lineWidth = 1;
        cctx.setLineDash([3, 4]);
        cctx.beginPath(); cctx.arc(scopeCX, scopeCY, ringR, 0, Math.PI * 2); cctx.stroke();
        cctx.setLineDash([]);

        cctx.strokeStyle = `rgba(${ringColor[0]}, ${ringColor[1]}, ${ringColor[2]}, 0.85)`;
        cctx.lineWidth = 2;
        cctx.shadowBlur = 8;
        cctx.shadowColor = `rgba(${ringColor[0]}, ${ringColor[1]}, ${ringColor[2]}, 0.8)`;
        cctx.beginPath();
        cctx.arc(scopeCX, scopeCY, ringR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        cctx.stroke();
        cctx.shadowBlur = 0;

        const arcAngle = -Math.PI / 2 + Math.PI * 2 * progress;
        const arcX = scopeCX + Math.cos(arcAngle) * ringR;
        const arcY = scopeCY + Math.sin(arcAngle) * ringR;
        cctx.fillStyle = `rgba(${ringColor[0]}, ${ringColor[1]}, ${ringColor[2]}, 1)`;
        cctx.shadowBlur = 10;
        cctx.shadowColor = `rgba(${ringColor[0]}, ${ringColor[1]}, ${ringColor[2]}, 1)`;
        cctx.beginPath(); cctx.arc(arcX, arcY, 2.4, 0, Math.PI * 2); cctx.fill();
        cctx.shadowBlur = 0;
    }

    data.iacGlitches.forEach(g => {
        const gt = (now - g.start) / g.duration;
        const ease = Math.sin(gt * Math.PI);
        const y = scopeTop + 8 + gt * 12;
        const x = scopeCX + Math.sin(g.start / 40) * 20;
        const alpha = Math.min(1, ease * 1.6);
        cctx.font = 'bold 9px Consolas, monospace';
        cctx.textAlign = 'center'; cctx.textBaseline = 'middle';
        cctx.fillStyle = `rgba(${g.color[0]}, ${g.color[1]}, ${g.color[2]}, ${alpha})`;
        cctx.shadowBlur = 10 * ease;
        cctx.shadowColor = `rgba(${g.color[0]}, ${g.color[1]}, ${g.color[2]}, ${alpha})`;
        cctx.fillText(g.label, x, y);
        cctx.shadowBlur = 0;
    });

    cctx.fillStyle = 'rgba(0, 12, 0, 0.92)';
    cctx.fillRect(6, readoutY, W - 12, readoutH);
    cctx.strokeStyle = 'rgba(0, 255, 0, 0.4)';
    cctx.lineWidth = 1;
    cctx.strokeRect(6.5, readoutY + 0.5, W - 13, readoutH - 1);

    const newBytes = Math.floor(progress * data.totalBytes);
    if (newBytes > data.bytesProcessed) data.bytesProcessed = newBytes;
    const visible = data.bytesProcessed;
    const windowSize = 22;
    const startIdx = Math.max(0, visible - windowSize);
    const endIdx = visible;

    cctx.textAlign = 'left'; cctx.textBaseline = 'middle';
    cctx.font = 'bold 8px Consolas, monospace';

    let rx = 10;
    const step = 10.5;
    for (let i = startIdx; i < endIdx; i++) {
        if (rx + 6 > W - 10) break;
        const byte = data.byteStream[i];
        if (!byte) continue;
        const isIac = byte.iacType !== null;
        const col = isIac ? TELNET_IAC_COLORS[byte.iacType] : [100, 200, 230];
        const age = visible - i - 1;
        const fade = age < 2 ? 1 : Math.max(0.28, 1 - age * 0.06);
        if (age < 2 && !completed) {
            cctx.shadowBlur = 8;
            cctx.shadowColor = `rgba(${col[0]}, ${col[1]}, ${col[2]}, 0.9)`;
        }
        cctx.fillStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${fade})`;
        cctx.fillText(byte.hex, rx, readoutY + readoutH / 2);
        cctx.shadowBlur = 0;
        rx += step;
    }
    if (!completed && Math.floor(now / 300) % 2 === 0 && rx + 5 < W - 10) {
        cctx.fillStyle = '#44ddff';
        cctx.fillRect(rx + 0.5, readoutY + 3, 5, readoutH - 6);
    }

    const statusX = 6;
    const statusY = H - 38;
    const statusW = W - 12;
    const statusH = 32;

    cctx.fillStyle = 'rgba(0, 18, 0, 0.92)';
    cctx.fillRect(statusX, statusY, statusW, statusH);
    cctx.strokeStyle = completed ? 'rgba(51, 255, 51, 0.85)' : `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.7)`;
    cctx.lineWidth = 1;
    cctx.strokeRect(statusX + 0.5, statusY + 0.5, statusW - 1, statusH - 1);

    cctx.font = 'bold 8px Consolas, monospace';
    cctx.textAlign = 'left'; cctx.textBaseline = 'alphabetic';
    cctx.fillStyle = completed ? '#33ff33' : `rgb(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]})`;
    cctx.fillText('▸ TELNET', statusX + 6, statusY + 12);

    cctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    cctx.fillText('·', statusX + 52, statusY + 12);

    let phaseColor = '#44ddff';
    if (activePhase.label === 'NEGOTIATE') phaseColor = '#ff8844';
    else if (activePhase.label === 'TUNING') phaseColor = '#ffdd44';
    else if (activePhase.label === 'LOCKING') phaseColor = '#44ddff';
    else if (activePhase.label === 'AUTH') phaseColor = '#44ff88';
    else if (activePhase.label === 'STABLE') phaseColor = '#33ff33';
    if (completed) phaseColor = '#33ff33';
    cctx.fillStyle = phaseColor;
    cctx.fillText(activePhase.label, statusX + 62, statusY + 12);

    cctx.textAlign = 'right';
    cctx.font = '7px Consolas, monospace';
    cctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    cctx.fillText('lock ' + Math.round(progress * 100) + '%', statusX + statusW - 40, statusY + 12);

    cctx.font = 'bold 10px Consolas, monospace';
    cctx.fillStyle = completed ? '#33ff33' : `rgb(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]})`;
    cctx.fillText(Math.floor(progress * 100) + '%', statusX + statusW - 6, statusY + 12);

    cctx.textAlign = 'left';
    cctx.font = '7px Consolas, monospace';
    let pipeline = '';
    TELNET_PHASES_HUD.forEach(ph => {
        if (progress >= ph.t + 0.01) pipeline += ph.label + ' ';
    });
    if (pipeline.length === 0) {
        pipeline = 'waiting for socket...';
        cctx.fillStyle = 'rgba(140, 40, 40, 0.75)';
    } else {
        cctx.fillStyle = completed ? '#33ff33' : 'rgba(51, 255, 51, 0.75)';
    }
    cctx.fillText(pipeline.trim(), statusX + 6, statusY + 26);

    cctx.textAlign = 'right';
    cctx.fillStyle = 'rgba(100, 200, 230, 0.7)';
    cctx.fillText(visible + ' B', statusX + statusW - 6, statusY + 26);

    if (iacFlashIntensity > 0 && iacFlashColor) {
        cctx.fillStyle = `rgba(${iacFlashColor[0]}, ${iacFlashColor[1]}, ${iacFlashColor[2]}, ${iacFlashIntensity * 0.10})`;
        cctx.fillRect(0, 0, W, H);
    }

    if (completed) {
        const pulse = 0.5 + 0.5 * Math.sin(now / 220);
        cctx.strokeStyle = `rgba(51, 255, 51, ${0.4 + pulse * 0.4})`;
        cctx.lineWidth = 1.5;
        cctx.strokeRect(0.5, 0.5, W - 1, H - 1);

        cctx.textAlign = 'center';
        cctx.font = 'bold 10px Consolas, monospace';
        cctx.fillStyle = '#33ff33';
        cctx.shadowBlur = 12;
        cctx.shadowColor = 'rgba(51, 255, 51, 0.9)';
        cctx.fillText('✓ PHASE LOCK', W / 2, scopeTop + 12);
        cctx.shadowBlur = 0;
    }

    if (proc.isStalled) {
        cctx.strokeStyle = 'rgba(255, 204, 0, 0.5)';
        cctx.lineWidth = 1;
        cctx.strokeRect(0.5, 0.5, W - 1, H - 1);
        cctx.font = 'bold 9px Consolas, monospace';
        cctx.fillStyle = '#ffcc00';
        cctx.textAlign = 'right'; cctx.textBaseline = 'alphabetic';
        cctx.fillText('[STALLED]', W - 5, 11);
    }
}

// ============================================================
// DNS — Resolution Chain
// ============================================================
function dnsRi(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function dnsPick(a) { return a[Math.floor(Math.random() * a.length)]; }

const DNS_CLUSTER_X = [162, 184, 206, 228, 250];
const DNS_CLIENT_POS   = { x: 35,  y: 148 };
const DNS_RESOLVER_POS = { x: 100, y: 130 };
const DNS_ROOT_Y = 40;
const DNS_TLD_Y  = 80;
const DNS_AUTH_Y = 120;

const DNS_QUERY_STEPS = [
    { t: 0.04, from: 'client',   to: 'resolver', q: 'A? target',     color: '#33ccff' },
    { t: 0.14, from: 'resolver', to: 'root',     q: 'A? target',     color: '#33ccff' },
    { t: 0.26, from: 'root',     to: 'resolver', q: 'REF .local',    color: '#ffcc00' },
    { t: 0.38, from: 'resolver', to: 'tld',      q: 'A? .local',     color: '#33ccff' },
    { t: 0.50, from: 'tld',      to: 'resolver', q: 'REF ns1.corp',  color: '#ffcc00' },
    { t: 0.62, from: 'resolver', to: 'auth',     q: 'A? target',     color: '#33ccff' },
    { t: 0.74, from: 'auth',     to: 'resolver', q: 'ANS 10.0.0.42', color: '#33ff33' },
    { t: 0.86, from: 'resolver', to: 'client',   q: 'ANS 10.0.0.42', color: '#33ff33' }
];

function createDnsData() {
    const oct = () => dnsRi(1, 254);
    const target = dnsPick([
        `192.168.${dnsRi(0, 255)}.${oct()}`,
        `10.${dnsRi(0, 255)}.${dnsRi(0, 255)}.${oct()}`,
        `172.${dnsRi(16, 31)}.${dnsRi(0, 255)}.${oct()}`
    ]);
    const domain = dnsPick([
        'corp.local', 'internal.lan', 'corpnet.io', 'hq.company.com',
        'intranet.dev', 'ad.enterprise.net', 'office.local'
    ]);
    const service = dnsPick([
        'BIND 9.11.3', 'BIND 9.16.1', 'BIND 9.18.0',
        'Unbound 1.13.1', 'Unbound 1.15.0',
        'PowerDNS 4.5.2', 'PowerDNS 4.7.0',
        'dnsmasq 2.80', 'dnsmasq 2.86'
    ]);
    const cve = Math.random() < 0.5 ? dnsPick([
        'CVE-2020-8617', 'CVE-2020-8625', 'CVE-2021-25215',
        'CVE-2021-25216', 'CVE-2022-0635', 'CVE-2015-5477'
    ]) : null;

    const tickerDomains = [
        'www.google.com', 'api.github.com', 'cdn.cloudflare.net', 'mail.corp.local',
        'login.microsoft.com', 's3.amazonaws.com', 'registry.npmjs.org',
        'tracker.ads.net', 'dns.google', 'one.one.one.one',
        'cloud.sync.io', 'update.windows.com'
    ];

    const bgPackets = [];
    for (let i = 0; i < 16; i++) {
        bgPackets.push({
            edge: dnsRi(0, 3),
            t: Math.random(),
            speed: 0.15 + Math.random() * 0.25,
            size: 0.9 + Math.random() * 0.7,
            targetIdx: dnsRi(0, 4)
        });
    }

    return {
        target, domain, service, cve,
        poisonTTL: dnsRi(86400, 604800),
        tickerDomains, bgPackets,
        tickerLines: [], queryCounter: 0, lastTickerAt: 0
    };
}

function dnsGetPos(id, stepIdx) {
    if (id === 'client')   return DNS_CLIENT_POS;
    if (id === 'resolver') return DNS_RESOLVER_POS;
    const idx = (stepIdx * 2) % 5;
    if (id === 'root') return { x: DNS_CLUSTER_X[idx], y: DNS_ROOT_Y };
    if (id === 'tld')  return { x: DNS_CLUSTER_X[idx], y: DNS_TLD_Y };
    if (id === 'auth') return { x: DNS_CLUSTER_X[idx], y: DNS_AUTH_Y };
    return { x: 0, y: 0 };
}

function dnsGetActiveStep(p) {
    for (let i = 0; i < DNS_QUERY_STEPS.length; i++) {
        const step = DNS_QUERY_STEPS[i];
        const nextT = (i + 1 < DNS_QUERY_STEPS.length) ? DNS_QUERY_STEPS[i + 1].t : 1;
        if (p >= step.t && p < nextT) return { step, index: i, progress: (p - step.t) / (nextT - step.t) };
    }
    return { step: DNS_QUERY_STEPS[DNS_QUERY_STEPS.length - 1], index: DNS_QUERY_STEPS.length - 1, progress: 1 };
}

function drawDnsAnimation(proc, now) {
    const c = document.getElementById('dns-canvas-' + proc.id);
    if (!c || !proc.dnsData) return;
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height;
    const data = proc.dnsData;
    const p = Math.min(1, (proc.animatedElapsed || 0) / proc.dnsDuration);

    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.045)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 14) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 14) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke(); }

    dnsDrawTopBar(ctx, now, p, W, data);
    dnsDrawConnections(ctx);
    dnsDrawBgTraffic(ctx, data);
    dnsDrawActiveQuery(ctx, now, p);
    dnsDrawClientNode(ctx, p);
    dnsDrawResolverNode(ctx, now, p);
    dnsDrawCluster(ctx, 'root', p, DNS_ROOT_Y, '#ffcc00');
    dnsDrawCluster(ctx, 'tld',  p, DNS_TLD_Y,  '#ffaa33');
    dnsDrawCluster(ctx, 'auth', p, DNS_AUTH_Y, '#33ff33');

    ctx.font = 'bold 7px Consolas, monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 204, 0, 0.55)'; ctx.fillText('ROOT', 162, DNS_ROOT_Y - 14);
    ctx.fillStyle = 'rgba(255, 170, 51, 0.55)'; ctx.fillText('TLD', 162, DNS_TLD_Y - 14);
    ctx.fillStyle = 'rgba(51, 255, 51, 0.55)'; ctx.fillText('AUTH', 162, DNS_AUTH_Y - 14);

    dnsDrawCachePanel(ctx, p, data, H);
    dnsDrawTickerPanel(ctx, now, data, W, H);
    dnsDrawPoisonFlash(ctx, now, p, W);

    if (p >= 1) {
        const pulse = 0.5 + 0.5 * Math.sin(now / 220);
        ctx.strokeStyle = `rgba(51,255,51,${0.4 + pulse * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
    }
    if (proc.isStalled) {
        ctx.strokeStyle = 'rgba(255, 204, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
        ctx.font = 'bold 9px Consolas, monospace';
        ctx.fillStyle = '#ffcc00';
        ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
        ctx.fillText('[STALLED]', W - 5, 11);
    }
}

function dnsDrawTopBar(ctx, now, p, W, data) {
    ctx.fillStyle = 'rgba(0, 40, 0, 0.65)';
    ctx.fillRect(0, 0, W, 16);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.4)';
    ctx.beginPath(); ctx.moveTo(0, 16.5); ctx.lineTo(W, 16.5); ctx.stroke();

    let phase, phaseColor;
    if (p < 0.10)      { phase = 'QUERY';    phaseColor = '#33ccff'; }
    else if (p < 0.35) { phase = 'RESOLVE';  phaseColor = '#33ccff'; }
    else if (p < 0.55) { phase = 'REPLAY';   phaseColor = '#ffcc00'; }
    else if (p < 0.75) { phase = 'POISON';   phaseColor = '#ff44ff'; }
    else if (p < 0.92) { phase = 'CONFIRM';  phaseColor = '#33ff33'; }
    else               { phase = 'CACHED';   phaseColor = '#33ff33'; }

    const blink = Math.floor(now / 500) % 2;
    ctx.font = 'bold 8px Consolas, monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = blink ? phaseColor : 'rgba(0,255,0,0.5)';
    ctx.fillText('▸ ' + phase, 5, 8);

    ctx.fillStyle = 'rgba(51,204,255,0.75)';
    ctx.font = '7px Consolas, monospace';
    const info = data.domain + ' @ ' + data.target + ':53';
    ctx.fillText(info.length > 30 ? info.substring(0, 30) : info, 68, 8);

    const barW = 50;
    const barX = W - barW - 5;
    ctx.fillStyle = '#000'; ctx.fillRect(barX, 5, barW, 6);
    ctx.strokeStyle = 'rgba(0,255,0,0.6)'; ctx.strokeRect(barX + 0.5, 5.5, barW - 1, 5);
    ctx.fillStyle = p >= 1 ? '#33ff33' : '#ffcc00';
    ctx.fillRect(barX + 1, 6, (barW - 2) * p, 4);

    ctx.fillStyle = 'rgba(0,255,0,0.75)';
    ctx.font = 'bold 7px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(p * 100) + '%', barX + barW / 2, 8);
}

function dnsDrawConnections(ctx) {
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.10)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    ctx.beginPath();
    ctx.moveTo(DNS_CLIENT_POS.x, DNS_CLIENT_POS.y);
    ctx.lineTo(DNS_RESOLVER_POS.x, DNS_RESOLVER_POS.y);
    ctx.stroke();

    for (let i = 0; i < 5; i++) {
        ctx.beginPath(); ctx.moveTo(DNS_RESOLVER_POS.x, DNS_RESOLVER_POS.y); ctx.lineTo(DNS_CLUSTER_X[i], DNS_ROOT_Y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(DNS_RESOLVER_POS.x, DNS_RESOLVER_POS.y); ctx.lineTo(DNS_CLUSTER_X[i], DNS_TLD_Y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(DNS_RESOLVER_POS.x, DNS_RESOLVER_POS.y); ctx.lineTo(DNS_CLUSTER_X[i], DNS_AUTH_Y); ctx.stroke();
    }
    ctx.setLineDash([]);
}

function dnsDrawBgTraffic(ctx, data) {
    const dt = 16;
    data.bgPackets.forEach(pkt => {
        pkt.t += (pkt.speed * dt) / 800;
        if (pkt.t > 1) {
            pkt.t = 0;
            pkt.edge = dnsRi(0, 3);
            pkt.speed = 0.15 + Math.random() * 0.25;
            pkt.targetIdx = dnsRi(0, 4);
        }
        let from, to;
        if (pkt.edge === 0) { from = DNS_CLIENT_POS; to = DNS_RESOLVER_POS; }
        else if (pkt.edge === 1) { from = DNS_RESOLVER_POS; to = { x: DNS_CLUSTER_X[pkt.targetIdx], y: DNS_ROOT_Y }; }
        else if (pkt.edge === 2) { from = DNS_RESOLVER_POS; to = { x: DNS_CLUSTER_X[pkt.targetIdx], y: DNS_TLD_Y }; }
        else { from = DNS_RESOLVER_POS; to = { x: DNS_CLUSTER_X[pkt.targetIdx], y: DNS_AUTH_Y }; }

        const x = from.x + (to.x - from.x) * pkt.t;
        const y = from.y + (to.y - from.y) * pkt.t;
        const alpha = pkt.t < 0.1 ? pkt.t / 0.1 : (pkt.t > 0.9 ? (1 - pkt.t) / 0.1 : 1);

        ctx.fillStyle = `rgba(51, 204, 255, ${alpha * 0.35})`;
        ctx.beginPath(); ctx.arc(x, y, pkt.size, 0, Math.PI * 2); ctx.fill();
    });
}

function dnsDrawActiveQuery(ctx, now, p) {
    const active = dnsGetActiveStep(p);
    const step = active.step;
    const fromPos = dnsGetPos(step.from, active.index);
    const toPos   = dnsGetPos(step.to,   active.index);
    const prog = active.progress;

    const cx = fromPos.x + (toPos.x - fromPos.x) * prog;
    const cy = fromPos.y + (toPos.y - fromPos.y) * prog;

    ctx.strokeStyle = step.color;
    ctx.lineWidth = 1.8;
    ctx.shadowBlur = 8;
    ctx.shadowColor = step.color;
    ctx.beginPath(); ctx.moveTo(fromPos.x, fromPos.y); ctx.lineTo(cx, cy); ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = step.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = step.color;
    ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    const pulseR = 3 + Math.sin(now / 100) * 1.2;
    ctx.strokeStyle = step.color;
    ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(cx, cy, pulseR + 3, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;

    let label = step.q;
    if (step.q.indexOf('target') >= 0) label = step.q.replace('target', 'srv');
    if (step.q.indexOf('10.0.0.42') >= 0) label = 'ANS 10.x';

    ctx.font = 'bold 7px Consolas, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = step.color;
    ctx.shadowBlur = 5;
    ctx.shadowColor = step.color;
    ctx.fillText(label, cx, cy - 6);
    ctx.shadowBlur = 0;
}

function dnsDrawClientNode(ctx, p) {
    const pos = DNS_CLIENT_POS;
    const active = p > 0.04;
    const boxW = 54, boxH = 28;

    ctx.fillStyle = '#000';
    ctx.fillRect(pos.x - boxW / 2, pos.y - boxH / 2, boxW, boxH);
    ctx.strokeStyle = active ? '#33ccff' : 'rgba(0,80,80,0.5)';
    ctx.lineWidth = active ? 1.5 : 1;
    if (active) { ctx.shadowBlur = 5; ctx.shadowColor = '#33ccff'; }
    ctx.strokeRect(pos.x - boxW / 2, pos.y - boxH / 2, boxW, boxH);
    ctx.shadowBlur = 0;

    ctx.fillStyle = active ? '#33ccff' : 'rgba(51,204,255,0.4)';
    ctx.font = 'bold 9px Consolas, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('CLIENT', pos.x, pos.y - 6);

    ctx.font = '7px Consolas, monospace';
    ctx.fillStyle = active ? 'rgba(51,204,255,0.7)' : 'rgba(51,204,255,0.3)';
    ctx.fillText('127.0.0.1', pos.x, pos.y + 7);
}

function dnsDrawResolverNode(ctx, now, p) {
    const pos = DNS_RESOLVER_POS;
    const active = p > 0.04;
    const poisoned = p > 0.75;
    const boxW = 58, boxH = 30;

    ctx.fillStyle = '#000';
    ctx.fillRect(pos.x - boxW / 2, pos.y - boxH / 2, boxW, boxH);
    let color = poisoned ? '#ff44ff' : '#33ccff';

    ctx.strokeStyle = active ? color : 'rgba(0,80,80,0.5)';
    ctx.lineWidth = active ? 1.6 : 1;
    if (active) { ctx.shadowBlur = 7; ctx.shadowColor = color; }
    ctx.strokeRect(pos.x - boxW / 2, pos.y - boxH / 2, boxW, boxH);
    ctx.shadowBlur = 0;

    if (active) {
        const pulse = 1 + Math.sin(now / 250) * 0.05;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 1;
        ctx.strokeRect(pos.x - (boxW / 2) * pulse, pos.y - (boxH / 2) * pulse, boxW * pulse, boxH * pulse);
        ctx.globalAlpha = 1;
    }

    ctx.fillStyle = color;
    ctx.font = 'bold 9px Consolas, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('RESOLVER', pos.x, pos.y - 6);

    ctx.font = '7px Consolas, monospace';
    ctx.fillStyle = poisoned ? 'rgba(255,68,255,0.75)' : 'rgba(51,204,255,0.7)';
    ctx.fillText(poisoned ? 'ENVENENADO' : '8.8.8.8', pos.x, pos.y + 7);
}

function dnsDrawCluster(ctx, kind, p, clusterY, color) {
    const activeThreshold = kind === 'root' ? 0.14 : (kind === 'tld' ? 0.38 : 0.62);
    const rangeEnd = kind === 'root' ? 0.38 : (kind === 'tld' ? 0.62 : 0.86);
    const isInRange = p >= activeThreshold && p < rangeEnd;
    const active = dnsGetActiveStep(p);
    let targetIdx = -1;
    if (isInRange) {
        if ((kind === 'root' && (active.step.to === 'root' || active.step.from === 'root')) ||
            (kind === 'tld'  && (active.step.to === 'tld'  || active.step.from === 'tld')) ||
            (kind === 'auth' && (active.step.to === 'auth' || active.step.from === 'auth'))) {
            targetIdx = (active.index * 2) % 5;
        }
    }

    DNS_CLUSTER_X.forEach((cx, i) => {
        const isActive = p > activeThreshold;
        const isTargeted = i === targetIdx;
        const boxW = 16, boxH = 16;

        ctx.fillStyle = '#000';
        ctx.fillRect(cx - boxW / 2, clusterY - boxH / 2, boxW, boxH);

        let col = isActive ? color : 'rgba(0,80,80,0.35)';
        if (isTargeted) col = '#ffffff';

        ctx.strokeStyle = col;
        ctx.lineWidth = isTargeted ? 1.5 : 1;
        if (isTargeted) { ctx.shadowBlur = 8; ctx.shadowColor = color; }
        else if (isActive) { ctx.shadowBlur = 3; ctx.shadowColor = color; }
        ctx.strokeRect(cx - boxW / 2, clusterY - boxH / 2, boxW, boxH);
        ctx.shadowBlur = 0;

        ctx.fillStyle = col;
        ctx.font = 'bold 7px Consolas, monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText((i + 1).toString(), cx, clusterY);
    });
}

function dnsDrawCachePanel(ctx, p, data, H) {
    const x = 6, y = H - 68, w = 140, h = 62;

    ctx.fillStyle = 'rgba(0, 20, 0, 0.75)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

    ctx.font = 'bold 7px Consolas, monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(0, 255, 0, 0.65)';
    ctx.fillText('DNS CACHE', x + 5, y + 4);

    const state = p < 0.75 ? 'limpia' : (p < 0.92 ? 'contaminada' : 'envenenada');
    const stateColor = p < 0.75 ? 'rgba(100,200,100,0.7)' : (p < 0.92 ? '#ffcc00' : '#ff44ff');
    ctx.fillStyle = stateColor;
    ctx.textAlign = 'right';
    ctx.font = 'bold 7px Consolas, monospace';
    ctx.fillText(state.toUpperCase(), x + w - 5, y + 4);

    const entries = [
        { name: 'cache.corp.local', t: 0.25, ip: '10.0.0.1' },
        { name: 'api.corp.local',   t: 0.40, ip: '10.0.0.15' },
        { name: 'mail.corp.local',  t: 0.55, ip: '10.0.0.23' },
        { name: data.domain,        t: 0.80, ip: '6.6.6.6', poison: true }
    ];

    ctx.font = '7px Consolas, monospace';
    ctx.textBaseline = 'middle';
    let yRow = y + 16;
    entries.forEach(e => {
        if (p >= e.t) {
            const isPoison = !!e.poison && p > 0.75;
            ctx.fillStyle = isPoison ? '#ff44ff' : 'rgba(100, 220, 100, 0.75)';
            ctx.textAlign = 'left';
            const n = e.name.length > 18 ? e.name.substring(0, 18) : e.name;
            ctx.fillText(n, x + 5, yRow);
            ctx.textAlign = 'right';
            ctx.fillText(e.ip, x + w - 5, yRow);
            yRow += 11;
        }
    });
}

function dnsDrawTickerPanel(ctx, now, data, W, H) {
    const x = 150, y = H - 68, w = W - 150 - 6, h = 62;

    ctx.fillStyle = 'rgba(0, 20, 0, 0.75)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

    ctx.font = 'bold 7px Consolas, monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(0, 255, 0, 0.65)';
    ctx.fillText('QUERY LOG', x + 5, y + 4);

    if (now - data.lastTickerAt > 250) {
        data.lastTickerAt = now;
        const domain = dnsPick(data.tickerDomains);
        const type = dnsPick(['A', 'AAAA', 'CNAME', 'MX', 'TXT']);
        const ip = `${dnsRi(2, 250)}.${dnsRi(0, 255)}.${dnsRi(0, 255)}.${dnsRi(1, 254)}`;
        const t = new Date();
        const ts = `${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}:${String(t.getSeconds()).padStart(2,'0')}`;
        data.tickerLines.unshift(`[${ts}] ${type} ${domain} → ${ip}`);
        if (data.tickerLines.length > 4) data.tickerLines.pop();
        data.queryCounter++;
    }

    ctx.font = '6px Consolas, monospace';
    ctx.textBaseline = 'middle';
    let yRow = y + 16;
    data.tickerLines.forEach((line, i) => {
        const alpha = i === 0 ? 1 : Math.max(0.3, 1 - i * 0.2);
        ctx.fillStyle = i === 0 ? '#33ff33' : `rgba(100, 200, 100, ${alpha * 0.65})`;
        const truncated = line.length > 32 ? line.substring(0, 32) : line;
        ctx.textAlign = 'left';
        ctx.fillText(truncated, x + 5, yRow);
        yRow += 10;
    });

    ctx.fillStyle = 'rgba(51, 204, 255, 0.7)';
    ctx.font = 'bold 7px Consolas, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(data.queryCounter + ' q', x + w - 5, y + h - 6);
}

function dnsDrawPoisonFlash(ctx, now, p, W) {
    if (p > 0.72 && p < 0.78) {
        const t = (p - 0.72) / 0.06;
        const intensity = Math.sin(t * Math.PI);
        ctx.fillStyle = `rgba(255, 68, 255, ${intensity * 0.12})`;
        ctx.fillRect(0, 0, W, 260);
        ctx.fillStyle = `rgba(255, 68, 255, ${intensity * 0.9})`;
        ctx.font = 'bold 10px Consolas, monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.shadowBlur = 12 * intensity;
        ctx.shadowColor = '#ff44ff';
        ctx.fillText('▸ CACHE POISON INJECT ◂', W / 2, 26);
        ctx.shadowBlur = 0;
    }
    if (p > 0.78) {
        const blink = Math.floor(now / 400) % 2;
        if (blink) {
            ctx.fillStyle = 'rgba(255, 68, 255, 0.85)';
            ctx.font = 'bold 8px Consolas, monospace';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('⚠ CACHE POISONED', W / 2, 26);
        }
    }
}

// ============================================================
// PORTHACK — Análisis de puertos + Fusión RGB 5D
// ============================================================
const PORTHACK_PHASES = {
    red:    [0.00, 0.26],
    green:  [0.26, 0.52],
    blue:   [0.52, 0.78],
    fusion: [0.78, 1.00]
};

const PORTHACK_PORT_TIMING = {
    analyze: [0.00, 0.06],
    appear:  [0.06, 0.24],
    breach:  [0.24, 0.88],
    finish:  [0.88, 1.00]
};

const PORTHACK_FIG_OFFSETS = {
    red:   { x: -1.15, y:  0.55 },
    green: { x:  1.15, y:  0.55 },
    blue:  { x:  0.00, y: -1.20 }
};

const PORTHACK_RED_RGB   = [[255,180,180],[255,120,120],[255, 60, 60],[255, 30, 30],[255,  0,  0]];
const PORTHACK_GREEN_RGB = [[180,255,180],[120,255,120],[ 60,255, 60],[ 30,255, 30],[  0,255,  0]];
const PORTHACK_BLUE_RGB  = [[180,180,255],[120,120,255],[ 60, 60,255],[ 30, 30,255],[  0,  0,255]];

const PORTHACK_NOTES_RED   = [293.66, 369.99, 440.00, 587.33, 739.99];
const PORTHACK_NOTES_GREEN = [440.00, 554.37, 659.25, 880.00, 1108.73];
const PORTHACK_NOTES_BLUE  = [587.33, 739.99, 880.00, 1174.66, 1479.98];

function porthackBuildHypercube(N) {
    const numVerts = 1 << N;
    const verts = new Array(numVerts);
    for (let i = 0; i < numVerts; i++) {
        const v = new Array(N);
        for (let d = 0; d < N; d++) v[d] = (i & (1 << d)) ? 1 : -1;
        verts[i] = v;
    }
    const edges = [];
    for (let i = 0; i < numVerts; i++) {
        for (let j = i + 1; j < numVerts; j++) {
            const diff = i ^ j;
            if (diff !== 0 && (diff & (diff - 1)) === 0) {
                let d = 0;
                while (!(diff & (1 << d))) d++;
                edges.push([i, j, d]);
            }
        }
    }
    return { verts, edges, N };
}

const PORTHACK_HYPER5D = porthackBuildHypercube(5);

function porthackSmoothstep(t) { return t * t * (3 - 2 * t); }

function porthackComputeScales(progress, t0, t1) {
    const step = (t1 - t0) / 5;
    const s = [0, 0, 0, 0, 0];
    for (let d = 0; d < 5; d++) {
        const a = t0 + d * step;
        const b = a + step;
        if (progress <= a) s[d] = 0;
        else if (progress >= b) s[d] = 1;
        else s[d] = porthackSmoothstep((progress - a) / step);
    }
    return s;
}

function createPortHackRunConfig() {
    const allPlanes = [];
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) allPlanes.push([i, j]);
    for (let i = allPlanes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = allPlanes[i]; allPlanes[i] = allPlanes[j]; allPlanes[j] = tmp;
    }
    const chosen = allPlanes.slice(0, 6);
    const globalSpeed = 0.8 + Math.random() * 0.6;
    const rotations = chosen.map(p => ({
        i: p[0], j: p[1],
        speed: (0.10 + Math.random() * 0.22) * globalSpeed,
        phase: Math.random() * Math.PI * 2,
        dir: Math.random() < 0.5 ? -1 : 1
    }));
    const noise = [];
    const noiseAmp = 0.05 + Math.random() * 0.10;
    for (let v = 0; v < 32; v++) {
        const n = [];
        for (let d = 0; d < 5; d++) n.push((Math.random() - 0.5) * noiseAmp * 2);
        noise.push(n);
    }
    return { rotations, noise, perspective: 0.20 + Math.random() * 0.10 };
}

function createPortHackData(server, requestedPorts) {
    const ports = requestedPorts.map(portNum => {
        const p = server.ports.find(pt => pt.port === portNum);
        return { port: portNum, service: p ? p.service : 'UNKNOWN' };
    });
    return {
        targetIP: server.ip,
        ports: ports,
        runConfig: createPortHackRunConfig(),
        soundState: {
            redDims: new Set(),
            greenDims: new Set(),
            blueDims: new Set(),
            redSpawned: false,
            greenSpawned: false,
            blueSpawned: false,
            fusionSweep: false,
            fusionChord: false,
            portAppeared: new Set(),
            portBreachStart: new Set(),
            portOpened: new Set()
        }
    };
}

function porthackProjectHypercube(scales, runConfig, timeSeconds) {
    const verts = PORTHACK_HYPER5D.verts;
    const n = verts.length;
    const noise = runConfig.noise;
    const rotations = runConfig.rotations;
    const perspective = runConfig.perspective;
    const raw = new Array(n);
    for (let vi = 0; vi < n; vi++) {
        const src = verts[vi];
        const c = [0, 0, 0, 0, 0];
        for (let d = 0; d < 5; d++) c[d] = src[d] * scales[d] + noise[vi][d] * scales[d];
        for (let ri = 0; ri < rotations.length; ri++) {
            const r = rotations[ri];
            const x = c[r.i], y = c[r.j];
            const a = timeSeconds * r.speed * r.dir + r.phase;
            const cs = Math.cos(a), sn = Math.sin(a);
            c[r.i] = x * cs - y * sn;
            c[r.j] = x * sn + y * cs;
        }
        for (let d = 4; d >= 3; d--) {
            const w = 1 + c[d] * perspective;
            const inv = 1 / Math.max(0.1, w);
            for (let k = 0; k < d; k++) c[k] *= inv;
        }
        raw[vi] = { x: c[0], y: c[1], z: c[2] };
    }
    return raw;
}

function porthackGetPortState(idx, total, progress) {
    const appearStart = PORTHACK_PORT_TIMING.appear[0] + (idx / total) * (PORTHACK_PORT_TIMING.appear[1] - PORTHACK_PORT_TIMING.appear[0]);
    const appearEnd = appearStart + 0.015;
    const breachWindow = (PORTHACK_PORT_TIMING.breach[1] - PORTHACK_PORT_TIMING.breach[0]) / total;
    const breachStart = PORTHACK_PORT_TIMING.breach[0] + idx * breachWindow;
    const breachEnd = breachStart + breachWindow * 0.82;
    if (progress < appearStart) return 'pending';
    if (progress < appearEnd) return 'appearing';
    if (progress < breachStart) return 'blocked';
    if (progress < breachEnd) return 'breaching';
    return 'open';
}

function porthackGetPortBreakProgress(idx, total, progress) {
    const breachWindow = (PORTHACK_PORT_TIMING.breach[1] - PORTHACK_PORT_TIMING.breach[0]) / total;
    const breachStart = PORTHACK_PORT_TIMING.breach[0] + idx * breachWindow;
    const breachEnd = breachStart + breachWindow * 0.82;
    if (progress < breachStart) return 0;
    if (progress > breachEnd) return 1;
    return (progress - breachStart) / (breachEnd - breachStart);
}

// ---------- Audio helpers ----------
function porthackAudioOn() {
    return typeof audioCtx !== 'undefined' && audioCtx && audioCtx.state === 'running';
}

function porthackPlaySpawn(baseFreq) {
    if (!porthackAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq * 0.5, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, t + 0.7);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.06, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.95);
    } catch (e) {}
}

function porthackPlayDimension(freq) {
    if (!porthackAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'triangle'; osc2.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc2.frequency.setValueAtTime(freq * 2, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.045, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
        osc.connect(g); osc2.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc2.start(t);
        osc.stop(t + 1.05); osc2.stop(t + 1.05);
    } catch (e) {}
}

function porthackPlayFusionSweep(durationSec) {
    if (!porthackAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const dur = durationSec || 3.5;
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc1.type = 'sine'; osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(60, t);
        osc1.frequency.exponentialRampToValueAtTime(1100, t + dur);
        osc2.frequency.setValueAtTime(60 * 1.01, t);
        osc2.frequency.exponentialRampToValueAtTime(1100 * 1.01, t + dur);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.06, t + 0.3);
        g.gain.setValueAtTime(0.06, t + dur * 0.75);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc1.connect(g); osc2.connect(g); g.connect(audioCtx.destination);
        osc1.start(t); osc2.start(t);
        osc1.stop(t + dur + 0.1); osc2.stop(t + dur + 0.1);
    } catch (e) {}
}

function porthackPlayWhiteChord() {
    if (!porthackAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            const start = t + i * 0.06;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, start);
            g.gain.setValueAtTime(0, start);
            g.gain.linearRampToValueAtTime(0.05, start + 0.03);
            g.gain.exponentialRampToValueAtTime(0.0001, start + 2.0);
            osc.connect(g); g.connect(audioCtx.destination);
            osc.start(start); osc.stop(start + 2.1);
        });
    } catch (e) {}
}

function porthackPlayPortDetect() {
    if (!porthackAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1400, t);
        osc.frequency.exponentialRampToValueAtTime(900, t + 0.05);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.03, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.1);
    } catch (e) {}
}

function porthackPlayBreachStart() {
    if (!porthackAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.18);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.04, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.25);
    } catch (e) {}
}

function porthackPlayPortOpen() {
    if (!porthackAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sine'; osc2.type = 'sine';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(1320, t + 0.1);
        osc2.frequency.setValueAtTime(1760, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.045, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        osc.connect(g); osc2.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc2.start(t);
        osc.stop(t + 0.4); osc2.stop(t + 0.4);
    } catch (e) {}
}

function porthackUpdateSounds(progress, data, redScales, greenScales, blueScales) {
    if (!porthackAudioOn()) return;
    const s = data.soundState;

    if (!s.redSpawned && progress > 0.005) { s.redSpawned = true; porthackPlaySpawn(220); }
    if (!s.greenSpawned && progress >= PORTHACK_PHASES.green[0]) { s.greenSpawned = true; porthackPlaySpawn(330); }
    if (!s.blueSpawned && progress >= PORTHACK_PHASES.blue[0]) { s.blueSpawned = true; porthackPlaySpawn(440); }

    const figs = [
        { scales: redScales,   notes: PORTHACK_NOTES_RED,   bag: s.redDims },
        { scales: greenScales, notes: PORTHACK_NOTES_GREEN, bag: s.greenDims },
        { scales: blueScales,  notes: PORTHACK_NOTES_BLUE,  bag: s.blueDims }
    ];
    figs.forEach(f => {
        for (let d = 0; d < 5; d++) {
            if (f.scales[d] >= 0.5 && !f.bag.has(d)) {
                f.bag.add(d);
                porthackPlayDimension(f.notes[d]);
            }
        }
    });

    const total = data.ports.length;
    for (let i = 0; i < total; i++) {
        const state = porthackGetPortState(i, total, progress);
        if ((state === 'appearing' || state === 'blocked') && !s.portAppeared.has(i)) {
            s.portAppeared.add(i);
            porthackPlayPortDetect();
        }
        if (state === 'breaching' && !s.portBreachStart.has(i)) {
            s.portBreachStart.add(i);
            porthackPlayBreachStart();
        }
        if (state === 'open' && !s.portOpened.has(i)) {
            s.portOpened.add(i);
            porthackPlayPortOpen();
        }
    }

    if (!s.fusionSweep && progress >= PORTHACK_PHASES.fusion[0]) {
        s.fusionSweep = true;
        porthackPlayFusionSweep(3.0);
    }
    if (!s.fusionChord && progress >= 0.96) {
        s.fusionChord = true;
        porthackPlayWhiteChord();
    }
}

// ---------- Sub-dibujos ----------
function porthackDrawEdges(ctx, projected, scales, palette, baseAlpha) {
    const edges = PORTHACK_HYPER5D.edges;
    for (let d = 0; d < 5; d++) {
        const s = scales[d];
        if (s < 0.01) continue;
        const rgb = palette[d];
        const a = Math.min(1, s * 1.4) * baseAlpha;
        ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;
        ctx.lineWidth = d < 3 ? 1.1 : 0.8;
        ctx.beginPath();
        for (let ei = 0; ei < edges.length; ei++) {
            const e = edges[ei];
            if (e[2] !== d) continue;
            const p1 = projected[e[0]], p2 = projected[e[1]];
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
        }
        ctx.stroke();
    }
}

function porthackDrawVerts(ctx, projected, scales, color, radius) {
    const dims = scales.reduce((a, s) => a + (s > 0.5 ? 1 : 0), 0);
    if (dims === 0) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(projected[0].x, projected[0].y, radius * 2.0, 0, Math.PI * 2);
        ctx.fill();
        return;
    }
    ctx.fillStyle = color;
    for (let i = 0; i < projected.length; i++) {
        ctx.beginPath();
        ctx.arc(projected[i].x, projected[i].y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function porthackDrawPortRow(ctx, x, y, w, h, port, state, breakProgress) {
    let color, statusText, barFill;
    switch (state) {
        case 'pending': return;
        case 'appearing': color = '#ff3333'; statusText = 'DETECT';  barFill = 0.10; break;
        case 'blocked':   color = '#ff3333'; statusText = 'BLOCKED'; barFill = 0;    break;
        case 'breaching': color = '#ffcc00'; statusText = 'BREACH';  barFill = breakProgress; break;
        case 'open':      color = '#33ff33'; statusText = 'OPEN';    barFill = 1;    break;
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = color + 'AA';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

    ctx.font = 'bold 9px Consolas, monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(':' + port.port, x + 5, y + 9);

    ctx.font = '7px Consolas, monospace';
    ctx.fillStyle = 'rgba(200, 220, 200, 0.7)';
    ctx.fillText(port.service, x + 42, y + 9);

    ctx.textAlign = 'right';
    ctx.font = 'bold 8px Consolas, monospace';
    ctx.fillStyle = color;
    ctx.fillText(statusText, x + w - 5, y + 9);

    const barX = x + 5;
    const barY = y + h - 5;
    const barW = w - 10;
    const barH = 2;
    ctx.fillStyle = 'rgba(40, 0, 0, 0.7)';
    ctx.fillRect(barX, barY, barW, barH);
    if (barFill > 0) {
        ctx.fillStyle = color;
        ctx.fillRect(barX, barY, barW * barFill, barH);
    }
}

function porthackDrawPortsPanel(ctx, x, y, w, h, progress, ports) {
    ctx.fillStyle = 'rgba(0, 12, 0, 0.85)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

    ctx.font = 'bold 8px Consolas, monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(0, 255, 0, 0.75)';
    ctx.fillText('▸ PORT ANALYSIS', x + 6, y + 5);

    const total = ports.length;
    let openCount = 0;
    for (let i = 0; i < total; i++) {
        if (porthackGetPortState(i, total, progress) === 'open') openCount++;
    }
    ctx.textAlign = 'right';
    ctx.font = 'bold 8px Consolas, monospace';
    ctx.fillStyle = openCount === total ? '#33ff33' : '#ffcc00';
    ctx.fillText(`${openCount}/${total} OPEN`, x + w - 6, y + 5);

    ctx.strokeStyle = 'rgba(0, 255, 0, 0.25)';
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 18);
    ctx.lineTo(x + w - 5, y + 18);
    ctx.stroke();

    const rowStartY = y + 22;
    const rowHeight = 20;
    const rowGap = 2;
    const maxRows = Math.floor((h - 26) / (rowHeight + rowGap));
    const visibleRows = Math.min(total, maxRows);
    const rowH = visibleRows < total
        ? Math.max(14, (h - 26 - (visibleRows - 1) * rowGap) / visibleRows)
        : rowHeight;

    for (let i = 0; i < visibleRows; i++) {
        const rowY = rowStartY + i * (rowH + rowGap);
        const p = ports[i];
        const state = porthackGetPortState(i, total, progress);
        const breakProg = porthackGetPortBreakProgress(i, total, progress);
        porthackDrawPortRow(ctx, x + 5, rowY, w - 10, rowH, p, state, breakProg);
    }
}

function porthackRenderRGB(ctx, vx, vy, vw, vh, progress, now, data) {
    const runConfig = data.runConfig;
    const time = now / 1000;
    const cx = vx + vw / 2;
    const cy = vy + vh / 2;

    const redScales   = porthackComputeScales(progress, PORTHACK_PHASES.red[0],   PORTHACK_PHASES.red[1]);
    const greenScales = porthackComputeScales(progress, PORTHACK_PHASES.green[0], PORTHACK_PHASES.green[1]);
    const blueScales  = porthackComputeScales(progress, PORTHACK_PHASES.blue[0],  PORTHACK_PHASES.blue[1]);

    const fusionT =
        progress <= PORTHACK_PHASES.fusion[0] ? 0 :
        progress >= PORTHACK_PHASES.fusion[1] ? 1 :
        porthackSmoothstep((progress - PORTHACK_PHASES.fusion[0]) / (PORTHACK_PHASES.fusion[1] - PORTHACK_PHASES.fusion[0]));

    const redOffX   = PORTHACK_FIG_OFFSETS.red.x   * (1 - fusionT);
    const redOffY   = PORTHACK_FIG_OFFSETS.red.y   * (1 - fusionT);
    const greenOffX = PORTHACK_FIG_OFFSETS.green.x * (1 - fusionT);
    const greenOffY = PORTHACK_FIG_OFFSETS.green.y * (1 - fusionT);
    const blueOffX  = PORTHACK_FIG_OFFSETS.blue.x  * (1 - fusionT);
    const blueOffY  = PORTHACK_FIG_OFFSETS.blue.y  * (1 - fusionT);

    const redRaw   = porthackProjectHypercube(redScales,   runConfig, time);
    const greenRaw = porthackProjectHypercube(greenScales, runConfig, time);
    const blueRaw  = porthackProjectHypercube(blueScales,  runConfig, time);

    const BASE_SCALE = Math.min(vw, vh) * 0.135;

    function toScreen(arr, offX, offY) {
        for (let i = 0; i < arr.length; i++) {
            arr[i].x = cx + (arr[i].x + offX) * BASE_SCALE;
            arr[i].y = cy + (arr[i].y + offY) * BASE_SCALE;
        }
    }
    toScreen(redRaw, redOffX, redOffY);
    toScreen(greenRaw, greenOffX, greenOffY);
    toScreen(blueRaw, blueOffX, blueOffY);

    ctx.globalCompositeOperation = 'lighter';

    if (progress >= PORTHACK_PHASES.red[0] - 0.001) {
        porthackDrawEdges(ctx, redRaw, redScales, PORTHACK_RED_RGB, 0.95);
        porthackDrawVerts(ctx, redRaw, redScales, 'rgba(255, 200, 200, 0.9)', 1.1);
    }
    if (progress >= PORTHACK_PHASES.green[0]) {
        porthackDrawEdges(ctx, greenRaw, greenScales, PORTHACK_GREEN_RGB, 0.95);
        porthackDrawVerts(ctx, greenRaw, greenScales, 'rgba(200, 255, 200, 0.9)', 1.1);
    }
    if (progress >= PORTHACK_PHASES.blue[0]) {
        porthackDrawEdges(ctx, blueRaw, blueScales, PORTHACK_BLUE_RGB, 0.95);
        porthackDrawVerts(ctx, blueRaw, blueScales, 'rgba(200, 200, 255, 0.9)', 1.1);
    }

    ctx.globalCompositeOperation = 'source-over';

    if (progress > 0.96) {
        const k = (progress - 0.96) / 0.04;
        const flash = Math.sin(k * Math.PI) * 0.30;
        ctx.fillStyle = `rgba(255, 255, 255, ${flash})`;
        ctx.fillRect(vx, vy, vw, vh);
    }

    const scanY = vy + ((now / 18) % (vh + 20)) - 10;
    const grad = ctx.createLinearGradient(0, scanY - 8, 0, scanY + 8);
    grad.addColorStop(0, 'rgba(0, 255, 0, 0)');
    grad.addColorStop(0.5, 'rgba(0, 255, 0, 0.10)');
    grad.addColorStop(1, 'rgba(0, 255, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(vx, scanY - 8, vw, 16);
}

function drawPortHackAnimation(proc, now) {
    const c = document.getElementById('porthack-canvas-' + proc.id);
    if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height;
    const data = proc.portHackData;
    if (!data) return;

    const progress = Math.min(1, (proc.animatedElapsed || 0) / (proc.durationMs || 5000));

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    const HEADER_H = 16;
    const MAIN_TOP = HEADER_H;
    const MAIN_BOTTOM = 194;
    const ANIM_W = 140;
    const MAIN_H = MAIN_BOTTOM - MAIN_TOP;
    const PORTS_X = ANIM_W;
    const PORTS_W = W - ANIM_W;

    ctx.strokeStyle = 'rgba(0, 255, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let yy = MAIN_TOP; yy < MAIN_BOTTOM; yy += 15) {
        ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke();
    }
    for (let xx = 0; xx < W; xx += 20) {
        ctx.beginPath(); ctx.moveTo(xx, MAIN_TOP); ctx.lineTo(xx, MAIN_BOTTOM); ctx.stroke();
    }

    ctx.fillStyle = 'rgba(30, 15, 0, 0.92)';
    ctx.fillRect(0, 0, W, HEADER_H);
    ctx.fillStyle = 'rgba(180, 90, 30, 0.9)';
    ctx.fillRect(0, HEADER_H - 1, W, 1);

    ctx.font = 'bold 9px Consolas, monospace';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffaa55';
    ctx.fillText('app:PortHack', 5, HEADER_H / 2);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffcc44';
    ctx.fillText('tunnel', W / 2, HEADER_H / 2);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffaa55';
    ctx.fillText('IP: ' + data.targetIP, W - 5, HEADER_H / 2);

    ctx.strokeStyle = 'rgba(0, 255, 0, 0.25)';
    ctx.beginPath();
    ctx.moveTo(PORTS_X + 0.5, MAIN_TOP);
    ctx.lineTo(PORTS_X + 0.5, MAIN_BOTTOM);
    ctx.stroke();

    porthackRenderRGB(ctx, 0, MAIN_TOP, ANIM_W, MAIN_H, progress, now, data);

    porthackDrawPortsPanel(ctx, PORTS_X + 2, MAIN_TOP + 2, PORTS_W - 4, MAIN_H - 4, progress, data.ports);

    const PB_Y = MAIN_BOTTOM + 6;
    const PB_H = 12;
    const PB_X = 8;
    const PB_W = W - 16;

    ctx.fillStyle = '#000';
    ctx.fillRect(PB_X, PB_Y, PB_W, PB_H);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.55)';
    ctx.lineWidth = 1;
    ctx.strokeRect(PB_X + 0.5, PB_Y + 0.5, PB_W - 1, PB_H - 1);

    const fillW = Math.max(0, (PB_W - 4) * progress);
    if (fillW > 0) {
        const grad = ctx.createLinearGradient(PB_X, PB_Y, PB_X + PB_W, PB_Y);
        grad.addColorStop(0, '#33ff33');
        grad.addColorStop(0.5, '#33ffff');
        grad.addColorStop(1, '#33ff33');
        ctx.fillStyle = grad;
        ctx.fillRect(PB_X + 2, PB_Y + 2, fillW, PB_H - 4);
    }

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 10; i++) {
        const mx = PB_X + 2 + (PB_W - 4) * (i / 10);
        ctx.beginPath();
        ctx.moveTo(mx, PB_Y + 2);
        ctx.lineTo(mx, PB_Y + PB_H - 2);
        ctx.stroke();
    }

    ctx.font = 'bold 9px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.fillText(Math.floor(progress * 100) + '%', PB_X + PB_W / 2, PB_Y + PB_H / 2);

    const ST_Y = PB_Y + PB_H + 4;
    const ST_H = H - ST_Y - 2;

    ctx.fillStyle = 'rgba(0, 20, 0, 0.75)';
    ctx.fillRect(0, ST_Y, W, ST_H);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.35)';
    ctx.beginPath();
    ctx.moveTo(0, ST_Y + 0.5);
    ctx.lineTo(W, ST_Y + 0.5);
    ctx.stroke();

    let statusText, statusColor;
    if (progress < PORTHACK_PORT_TIMING.appear[0]) {
        statusText = 'ANALYZING TARGET...';
        statusColor = '#33ccff';
    } else if (progress < PORTHACK_PORT_TIMING.breach[0]) {
        const total = data.ports.length;
        let detected = 0;
        for (let i = 0; i < total; i++) {
            if (porthackGetPortState(i, total, progress) !== 'pending') detected++;
        }
        statusText = `SCANNING PORTS... ${detected}/${total}`;
        statusColor = '#ffcc00';
    } else if (progress < PORTHACK_PORT_TIMING.finish[0]) {
        const total = data.ports.length;
        let current = -1;
        for (let i = 0; i < total; i++) {
            if (porthackGetPortState(i, total, progress) === 'breaching') { current = i; break; }
        }
        if (current >= 0) {
            statusText = `BREACHING PORT :${data.ports[current].port}...`;
            statusColor = '#ffcc00';
        } else {
            let opened = 0;
            for (let i = 0; i < total; i++) {
                if (porthackGetPortState(i, total, progress) === 'open') opened++;
            }
            statusText = `OPENING PORTS... ${opened}/${total}`;
            statusColor = '#ffcc00';
        }
    } else if (progress < 1) {
        statusText = 'FINALIZING TUNNEL...';
        statusColor = '#33ff33';
    } else {
        statusText = '✓ TUNNEL ESTABLISHED — ACCESS GRANTED';
        statusColor = '#33ff33';
    }

    ctx.font = 'bold 9px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = statusColor;
    ctx.fillText(statusText, W / 2, ST_Y + ST_H / 2);

    if (progress < 1 && Math.floor(now / 400) % 2 === 0) {
        const tw = ctx.measureText(statusText).width;
        ctx.fillStyle = statusColor;
        ctx.fillRect(W / 2 + tw / 2 + 5, ST_Y + ST_H / 2 - 5, 5, 10);
    }

    if (progress >= 1) {
        ctx.strokeStyle = 'rgba(51, 255, 51, 0.7)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
    }

    if (proc.isStalled) {
        ctx.strokeStyle = 'rgba(255, 204, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
        ctx.font = 'bold 9px Consolas, monospace';
        ctx.fillStyle = '#ffcc00';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('[STALLED]', W - 5, 13);
    }

    if (!proc.isStalled) {
        porthackUpdateSounds(progress, data,
            porthackComputeScales(progress, PORTHACK_PHASES.red[0],   PORTHACK_PHASES.red[1]),
            porthackComputeScales(progress, PORTHACK_PHASES.green[0], PORTHACK_PHASES.green[1]),
            porthackComputeScales(progress, PORTHACK_PHASES.blue[0],  PORTHACK_PHASES.blue[1])
        );
    }
}

// ============================================================
// SISTEMA DE SONIDO POR ANIMACIÓN
// ============================================================

// ---------- Primitivas de audio ----------
function _soundBlip(freq, dur, type, vol) {
    if (!porthackAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + dur + 0.02);
    } catch (e) {}
}

function _soundPing(freq, dur, vol) {
    if (!porthackAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + dur + 0.02);
    } catch (e) {}
}

function _soundSweep(f1, f2, dur, type, vol) {
    if (!porthackAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = type || 'triangle';
        osc.frequency.setValueAtTime(f1, t);
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + dur + 0.03);
    } catch (e) {}
}

function _soundTick(vol) {
    if (!porthackAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1800, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.002);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.03);
    } catch (e) {}
}

function _soundKeyClick(vol) {
    if (!porthackAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(900 + Math.random() * 400, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.002);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.025);
    } catch (e) {}
}

// ============================================================
// MOTOR 1 — SQL
// ============================================================
function soundSqlEngine(proc, progress, now) {
    const st = proc.soundState.toolState;
    if (st.lastClickAt === undefined) st.lastClickAt = 0;
    if (st.lastGroupDone === undefined) st.lastGroupDone = -1;

    const typingEnd = 0.55;
    if (progress < typingEnd) {
        const interval = 45 + Math.random() * 25;
        if (now - st.lastClickAt > interval) {
            st.lastClickAt = now;
            _soundKeyClick(0.018);
        }
    }

    if (proc.sqlGroups) {
        const groups = proc.sqlGroups;
        for (let i = st.lastGroupDone + 1; i < groups.length; i++) {
            if (progress >= groups[i].correctAt) {
                const pitch = 700 + (i % 6) * 90;
                _soundPing(pitch, 0.14, 0.025);
                st.lastGroupDone = i;
            } else break;
        }
    }
}

// ============================================================
// MOTOR 2 — SSH
// ============================================================
function soundSshEngine(proc, progress, now) {
    const st = proc.soundState.toolState;
    if (st.lastBlipAt === undefined) st.lastBlipAt = 0;
    if (st.chordPlayed === undefined) st.chordPlayed = false;

    if (progress < 0.85) {
        const interval = 130 + progress * 380;
        if (now - st.lastBlipAt > interval) {
            st.lastBlipAt = now;
            const base = 320 + progress * 500;
            const jitter = (Math.random() - 0.5) * 90;
            _soundPing(base + jitter, 0.12, 0.018);
        }
    } else if (!st.chordPlayed) {
        st.chordPlayed = true;
        [523.25, 659.25, 783.99].forEach((f, i) => {
            setTimeout(() => _soundPing(f, 0.7, 0.028), i * 90);
        });
    }
}

// ============================================================
// MOTOR 3 — HTTP
// ============================================================
function soundHttpEngine(proc, progress, now) {
    const tree = proc.httpTree;
    if (!tree) return;
    const st = proc.soundState.toolState;
    if (st.lastTickAt === undefined) st.lastTickAt = 0;
    if (st.lastLevel === undefined) st.lastLevel = -1;

    const maxLevel = tree.maxLevel;
    const levelDuration = 1 / maxLevel;
    const activeLevel = Math.min(maxLevel - 1, Math.floor(progress / levelDuration));

    if (progress < 1 && now - st.lastTickAt > 110) {
        st.lastTickAt = now;
        _soundTick(0.012);
    }

    if (activeLevel > st.lastLevel) {
        if (st.lastLevel >= 0) {
            _soundSweep(220, 500 + activeLevel * 100, 0.35, 'triangle', 0.035);
        } else {
            _soundPing(440, 0.18, 0.025);
        }
        st.lastLevel = activeLevel;
    }
}

// ============================================================
// MOTOR 4 — FTP
// ============================================================
function soundFtpEngine(proc, progress, now) {
    const data = proc.ftpData;
    if (!data || !data.log) return;
    const st = proc.soundState.toolState;
    if (st.lastLogIdx === undefined) st.lastLogIdx = -1;

    const log = data.log;
    for (let i = st.lastLogIdx + 1; i < log.length; i++) {
        const ev = log[i];
        if (progress >= ev.t) {
            playFtpEventSound(ev.type);
            st.lastLogIdx = i;
        } else break;
    }
}

function playFtpEventSound(type) {
    switch (type) {
        case 'header':  _soundBlip(180, 0.18, 'square', 0.035); break;
        case 'info':    _soundBlip(880, 0.045, 'square', 0.012); break;
        case 'success': _soundPing(1200, 0.28, 0.028); break;
        case 'fail':    _soundBlip(120, 0.14, 'sawtooth', 0.028); break;
        case 'warn':    _soundBlip(660, 0.1, 'square', 0.022); break;
        case 'bypass':  _soundSweep(400, 1400, 0.25, 'sawtooth', 0.03); break;
        case 'file':    _soundSweep(800, 1600, 0.14, 'sine', 0.018); break;
        case 'spinner': _soundTick(0.018); break;
        case 'end':     _soundPing(1500, 0.55, 0.035); break;
        case 'sep':
        default: break;
    }
}

// ============================================================
// MOTOR 5 — SMTP
// ============================================================
function soundSmtpEngine(proc, progress, now) {
    const st = proc.soundState.toolState;
    if (st.lastPhase === undefined) st.lastPhase = -1;
    if (st.lastDroneAt === undefined) st.lastDroneAt = 0;

    const phases = SMTP_PHASES;

    for (let i = st.lastPhase + 1; i < phases.length; i++) {
        if (progress >= phases[i].t) {
            const f = 380 + i * 85;
            _soundBlip(f, 0.09, 'sine', 0.026);
            st.lastPhase = i;
        } else break;
    }

    if (progress < 1 && now - st.lastDroneAt > 380) {
        st.lastDroneAt = now;
        const freq = 180 + progress * 320;
        _soundBlip(freq, 0.25, 'triangle', 0.009);
    }
}

// ============================================================
// MOTOR 6 — TELNET
// ============================================================
function soundTelnetEngine(proc, progress, now) {
    const data = proc.telnetData;
    if (!data) return;
    const st = proc.soundState.toolState;
    if (!st.iacSoundDone) st.iacSoundDone = new Set();
    if (st.lastDroneAt === undefined) st.lastDroneAt = 0;

    if (progress < 0.95) {
        const interval = 200 + progress * 550;
        if (now - st.lastDroneAt > interval) {
            st.lastDroneAt = now;
            const freq = 260 + progress * 420;
            const jitterAmt = (1 - progress) * 120;
            const jitter = (Math.random() - 0.5) * jitterAmt;
            _soundBlip(freq + jitter, 0.12, 'sine', 0.011);
        }
    }

    if (data.iacEvents) {
        data.iacEvents.forEach((ev, idx) => {
            if (progress >= ev.t && !st.iacSoundDone.has(idx)) {
                st.iacSoundDone.add(idx);
                switch (ev.type) {
                    case 'iac':  _soundBlip(1400, 0.08, 'sawtooth', 0.028); break;
                    case 'do_':  _soundBlip(1100, 0.08, 'square', 0.024); break;
                    case 'dont': _soundBlip(900,  0.08, 'square', 0.024); break;
                    case 'will': _soundBlip(1300, 0.08, 'triangle', 0.024); break;
                    case 'wont': _soundBlip(1600, 0.08, 'triangle', 0.024); break;
                }
            }
        });
    }
}

// ============================================================
// MOTOR 7 — DNS
// ============================================================
function soundDnsEngine(proc, progress, now) {
    const st = proc.soundState.toolState;
    if (st.lastStep === undefined) st.lastStep = -1;
    if (st.poisonPlayed === undefined) st.poisonPlayed = false;
    if (st.lastBgAt === undefined) st.lastBgAt = 0;

    const steps = DNS_QUERY_STEPS;
    for (let i = st.lastStep + 1; i < steps.length; i++) {
        if (progress >= steps[i].t) {
            const color = steps[i].color;
            if (color === '#33ff33')       _soundPing(1200, 0.3, 0.03);
            else if (color === '#ffcc00')  _soundBlip(600, 0.12, 'triangle', 0.024);
            else                            _soundBlip(900, 0.1, 'sine', 0.024);
            st.lastStep = i;
        } else break;
    }

    if (!st.poisonPlayed && progress >= 0.74) {
        st.poisonPlayed = true;
        _soundSweep(220, 45, 0.55, 'sine', 0.045);
    }

    if (progress < 1 && now - st.lastBgAt > 550) {
        st.lastBgAt = now;
        _soundTick(0.006);
    }
}

// ============================================================
// MOTOR 8 — SCP (Descarga)
// ============================================================
function soundDownloadEngine(proc, progress, now) {
    const st = proc.soundState.toolState;
    if (st.dlLastTickAt === undefined) st.dlLastTickAt = 0;
    if (st.dlStartPlayed === undefined) st.dlStartPlayed = false;
    if (st.dlCompletePlayed === undefined) st.dlCompletePlayed = false;

    if (!st.dlStartPlayed) {
        st.dlStartPlayed = true;
        _soundSweep(1400, 400, 0.25, 'triangle', 0.05);
    }

    if (progress < 0.95) {
        const interval = 110 + Math.random() * 40;
        if (now - st.dlLastTickAt > interval) {
            st.dlLastTickAt = now;
            const freq = 1300 + Math.random() * 500;
            _soundBlip(freq, 0.028, 'square', 0.011);
        }
    }

    if (progress >= 1 && !st.dlCompletePlayed) {
        st.dlCompletePlayed = true;
        _soundPing(880, 0.09, 0.05);
        setTimeout(() => _soundPing(1320, 0.18, 0.055), 80);
    }
}

// ============================================================
// MOTOR 9 — UNZIP
// ============================================================
function soundUnzipEngine(proc, progress, now) {
    const st = proc.soundState.toolState;
    if (st.uzStartPlayed === undefined) st.uzStartPlayed = false;
    if (st.uzLastExtracted === undefined) st.uzLastExtracted = 0;
    if (st.uzCompletePlayed === undefined) st.uzCompletePlayed = false;

    if (!st.uzStartPlayed) {
        st.uzStartPlayed = true;
        _soundSweep(2600, 500, 0.35, 'sawtooth', 0.035);
    }

    const total = proc.totalFiles || (proc.zipContents || []).length || 0;
    if (total > 0) {
        const filesExtracted = Math.min(total, Math.floor(progress * total));
        while (st.uzLastExtracted < filesExtracted) {
            const idx = st.uzLastExtracted;
            const base = 620 + idx * 90;
            _soundBlip(base, 0.09, 'triangle', 0.045, base * 1.6);
            st.uzLastExtracted++;
        }
    }

    if (progress >= 1 && !st.uzCompletePlayed) {
        st.uzCompletePlayed = true;
        [660, 880, 1320].forEach((f, i) => {
            setTimeout(() => _soundPing(f, 0.16, 0.05), i * 90);
        });
    }
}

// ============================================================
// DISPATCHER — updateAnimSound
// ============================================================
function updateAnimSound(proc, toolName, progress, now) {
    if (!porthackAudioOn()) return;

    if (!proc.soundState) proc.soundState = {};
    if (!proc.soundState.toolState) proc.soundState.toolState = {};
    if (proc.soundState.stallSoundLastAt === undefined) proc.soundState.stallSoundLastAt = 0;
    if (proc.soundState.wasStalled === undefined) proc.soundState.wasStalled = false;
    const ss = proc.soundState;

    if (proc.isStalled) {
        if (!ss.wasStalled) {
            playStallSound();
            ss.stallSoundLastAt = now;
        } else if (now - ss.stallSoundLastAt > 600) {
            playStallSound();
            ss.stallSoundLastAt = now;
        }
        ss.wasStalled = true;
        return;
    }

    if (ss.wasStalled) {
        playStallRecoverSound();
        ss.wasStalled = false;
    }

    try {
        switch (toolName) {
            case 'sql_crack.exe':    soundSqlEngine(proc, progress, now);    break;
            case 'ssh_crack.exe':    soundSshEngine(proc, progress, now);    break;
            case 'http_crack.exe':   soundHttpEngine(proc, progress, now);   break;
            case 'ftp_crack.exe':    soundFtpEngine(proc, progress, now);    break;
            case 'smtp_crack.exe':   soundSmtpEngine(proc, progress, now);   break;
            case 'telnet_crack.exe': soundTelnetEngine(proc, progress, now); break;
            case 'dns_crack.exe':    soundDnsEngine(proc, progress, now);    break;
            case 'scp':
                if (proc.isDownload) soundDownloadEngine(proc, progress, now);
                break;
            case 'unzip':
                if (proc.isUnzip) soundUnzipEngine(proc, progress, now);
                break;
            case 'porthack':
                break;
        }
    } catch (soundErr) {
        console.warn('[audio] Error en motor de sonido:', soundErr);
    }
}

function playStallSound() {
    if (!porthackAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc2.type = 'square';
        osc.frequency.setValueAtTime(90, t);
        osc.frequency.linearRampToValueAtTime(60, t + 0.15);
        osc2.frequency.setValueAtTime(45, t);
        osc2.frequency.linearRampToValueAtTime(30, t + 0.15);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.035, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        osc.connect(g); osc2.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc2.start(t);
        osc.stop(t + 0.25); osc2.stop(t + 0.25);
    } catch (e) {}
}

function playStallRecoverSound() {
    if (!porthackAudioOn()) return;
    try {
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(660, t + 0.28);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.05, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + 0.4);
    } catch (e) {}
}

// ============================================================
// DOWNLOAD — Animación de transferencia
// ============================================================
function drawDownloadAnimation(proc, now) {
    const c = document.getElementById('dl-canvas-' + proc.id);
    if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(0, 255, 0, 0.06)';
    ctx.lineWidth = 1;
    for (let y = 8; y < H - 20; y += 8) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    const progress = Math.min(1, (proc.animatedElapsed || 0) / (proc.durationMs || 1));

    const srcX = 30, srcY = H / 2 - 6;
    const dstX = W - 30, dstY = H / 2 - 6;

    ctx.strokeStyle = 'rgba(51, 204, 255, 0.22)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(srcX + 10, srcY);
    ctx.lineTo(dstX - 10, dstY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#000';
    ctx.fillRect(srcX - 14, srcY - 8, 28, 16);
    ctx.strokeStyle = '#33ccff';
    ctx.lineWidth = 1;
    ctx.strokeRect(srcX - 14, srcY - 8, 28, 16);
    ctx.fillStyle = '#33ccff';
    ctx.font = 'bold 6px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('REMOTE', srcX, srcY);

    ctx.fillStyle = '#000';
    ctx.fillRect(dstX - 12, dstY - 8, 24, 16);
    ctx.strokeStyle = '#33ff33';
    ctx.strokeRect(dstX - 12, dstY - 8, 24, 16);
    ctx.fillStyle = '#33ff33';
    ctx.fillText('LOCAL', dstX, dstY);

    const numPackets = 14;
    const speed = 0.0009 + progress * 0.0011;
    for (let i = 0; i < numPackets; i++) {
        const phase = (now * speed + i / numPackets) % 1;
        if (phase > progress + 0.12) continue;

        const px = srcX + 10 + (dstX - srcX - 20) * phase;
        const py = srcY + Math.sin(phase * Math.PI * 2 + i * 0.7) * 5;

        const fade = phase > 0.9 ? (1 - phase) * 10 : (phase < 0.08 ? phase * 12 : 1);
        const alpha = Math.min(1, fade) * 0.95;

        ctx.shadowBlur = 6;
        ctx.shadowColor = '#33ccff';
        ctx.fillStyle = `rgba(120, 220, 255, ${alpha})`;
        ctx.fillRect(px - 2, py - 2, 4, 4);

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(px - 1, py - 1, 2, 2);
        ctx.shadowBlur = 0;
    }

    ctx.fillStyle = 'rgba(180, 220, 220, 0.65)';
    ctx.font = '7px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const name = (proc.fileName || '').length > 32 ? proc.fileName.substring(0, 30) + '...' : (proc.fileName || '');
    ctx.fillText(name, W / 2, 3);

    const barX = 20, barW = W - 40, barY = H - 14, barH = 6;
    ctx.fillStyle = '#000';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = 'rgba(51, 204, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX + 0.5, barY + 0.5, barW - 1, barH - 1);
    ctx.fillStyle = '#33ccff';
    ctx.fillRect(barX + 1, barY + 1, (barW - 2) * progress, barH - 2);

    ctx.font = 'bold 7px Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#33ccff';
    ctx.fillText(Math.floor(progress * 100) + '%', barX, barY - 1);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(51, 204, 255, 0.7)';
    ctx.fillText((proc.fileSizeKB || 0).toFixed(1) + ' KB', barX + barW, barY - 1);
}

// ============================================================
// UNZIP — Animación de extracción
// ============================================================
const UNZIP_CATEGORY_COLORS = {
    financiero:  '#ffcc44',
    personal:    '#ff44ff',
    corporativo: '#33ff33',
    basura:      '#88ff88'
};

function drawUnzipAnimation(proc, now) {
    const c = document.getElementById('uz-canvas-' + proc.id);
    if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255, 170, 68, 0.06)';
    ctx.lineWidth = 1;
    for (let y = 8; y < H - 22; y += 8) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    const progress = Math.min(1, (proc.animatedElapsed || 0) / (proc.durationMs || 1));
    const cy = (H - 26) / 2 + 10;

    const zipX = 36, zipW = 32, zipH = 40;
    const openAmount = Math.min(1, progress * 1.4);

    const pulse = 0.5 + 0.5 * Math.sin(now / 300);
    ctx.shadowBlur = 8 + pulse * 6;
    ctx.shadowColor = '#ffaa44';

    ctx.fillStyle = '#150800';
    ctx.fillRect(zipX - zipW / 2, cy - zipH / 2, zipW, zipH);
    ctx.strokeStyle = '#ffaa44';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(zipX - zipW / 2, cy - zipH / 2, zipW, zipH);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = '#ffaa44';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
        const ty = cy - zipH / 2 + 6 + i * 6;
        const opening = i < openAmount * 6;
        ctx.beginPath();
        ctx.moveTo(zipX - 7 + (opening ? 3 : 0), ty);
        ctx.lineTo(zipX + 7 - (opening ? 3 : 0), ty);
        ctx.stroke();
    }

    ctx.fillStyle = '#ffaa44';
    ctx.font = 'bold 7px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ZIP', zipX, cy);

    const numFiles = (proc.zipContents || []).length;
    if (numFiles > 0) {
        const filesToShow = Math.floor(progress * numFiles);
        const startX = zipX + 48;
        const endX = W - 32;
        const slotSpacing = numFiles > 1 ? (endX - startX) / (numFiles - 1) : 0;

        for (let i = 0; i < numFiles; i++) {
            const inner = proc.zipContents[i];
            const slotX = startX + slotSpacing * i;

            const appeared = i < filesToShow;
            const currentlyFlying = (i === filesToShow) && (progress < 1);

            let fx = slotX;
            let fy = cy;
            let scale = 1;
            let alpha = 1;

            if (currentlyFlying) {
                const t = (progress * numFiles) - i;
                if (t <= 0) continue;
                const ease = t * t * (3 - 2 * t);
                fx = zipX + (slotX - zipX) * ease;
                fy = cy + Math.sin(t * Math.PI) * -18;
                alpha = Math.min(1, t * 2.5);
                scale = 0.4 + ease * 0.6;
            } else if (!appeared) {
                continue;
            }

            const cardW = 26 * scale;
            const cardH = 32 * scale;

            const color = UNZIP_CATEGORY_COLORS[inner.category] || '#ffaa44';

            if (currentlyFlying) {
                ctx.shadowBlur = 14;
                ctx.shadowColor = color;
            }

            ctx.fillStyle = '#000';
            ctx.fillRect(fx - cardW / 2, fy - cardH / 2, cardW, cardH);
            ctx.strokeStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1.2;
            ctx.strokeRect(fx - cardW / 2, fy - cardH / 2, cardW, cardH);
            ctx.shadowBlur = 0;

            ctx.fillStyle = color;
            ctx.font = `bold ${Math.max(5, 6 * scale)}px Consolas, monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const shortName = inner.name.length > 9 ? inner.name.substring(0, 8) + '…' : inner.name;
            ctx.fillText(shortName, fx, fy - 2);

            const dotIdx = inner.name.lastIndexOf('.');
            if (dotIdx > 0) {
                const ext = inner.name.substring(dotIdx + 1).toUpperCase();
                ctx.font = `${Math.max(4, 5 * scale)}px Consolas, monospace`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.fillText(ext, fx, fy + 8 * scale);
            }

            ctx.globalAlpha = 1;

            if (appeared && !currentlyFlying) {
                ctx.fillStyle = '#33ff33';
                ctx.font = 'bold 8px Consolas, monospace';
                ctx.fillText('✓', fx + cardW / 2 + 5, fy);
            }
        }
    }

    ctx.fillStyle = 'rgba(255, 200, 100, 0.7)';
    ctx.font = '7px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const zname = (proc.zipName || '').length > 34 ? proc.zipName.substring(0, 32) + '...' : (proc.zipName || '');
    ctx.fillText(zname, W / 2, 3);

    const barX = 20, barW = W - 40, barY = H - 14, barH = 6;
    ctx.fillStyle = '#000';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = 'rgba(255, 170, 68, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX + 0.5, barY + 0.5, barW - 1, barH - 1);
    ctx.fillStyle = '#ffaa44';
    ctx.fillRect(barX + 1, barY + 1, (barW - 2) * progress, barH - 2);

    const extractedCount = Math.floor(progress * ((proc.zipContents || []).length));
    ctx.font = 'bold 7px Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#ffaa44';
    ctx.fillText(`${extractedCount}/${(proc.zipContents || []).length}`, barX, barY - 1);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 170, 68, 0.7)';
    ctx.fillText((proc.fileSizeKB || 0).toFixed(1) + ' KB', barX + barW, barY - 1);
}