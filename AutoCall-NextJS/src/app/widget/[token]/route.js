import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /widget/[token] or /widget/[token].js
 * Serves the standalone, embeddable JavaScript chat widget.
 */
export async function GET(request, { params }) {
    try {
        let { token } = await params;
        if (!token) {
            return new NextResponse('// AutoCall Widget: missing token', {
                status: 400,
                headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
            });
        }
        token = token.replace(/\.js$/, '');

        const widget = await prisma.websiteWidget.findUnique({
            where: { public_token: token },
            include: {
                agents: {
                    select: { name: true },
                },
            },
        });

        if (!widget || !widget.enabled) {
            return new NextResponse('// AutoCall Widget: disabled or not found', {
                status: 200,
                headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
            });
        }

        const origin = new URL(request.url).origin;
        const config = {
            token: widget.public_token,
            title: widget.title || 'Discussion en direct',
            welcomeMessage: widget.welcome_message || 'Bonjour ! En quoi puis-je vous aider aujourd’hui ?',
            primaryColor: widget.primary_color || '#18181b',
            position: widget.position || 'bottom-right',
            apiEndpoint: `${origin}/api/widget/${widget.public_token}/chat`,
            agentName: widget.agents?.name || widget.title || 'Conseiller IA',
        };

        const jsCode = `(function() {
    if (window.__autocall_widget_loaded) return;
    window.__autocall_widget_loaded = true;

    var CFG = ${JSON.stringify(config)};
    var isOpen = false;
    var messages = [];
    if (CFG.welcomeMessage) {
        messages.push({ role: 'assistant', text: CFG.welcomeMessage });
    }

    var style = document.createElement('style');
    style.innerHTML = [
        '#ac-w-btn { position: fixed; z-index: 999999; ' + (CFG.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;') + ' bottom: 20px; width: 54px; height: 54px; border-radius: 50%; background: ' + CFG.primaryColor + '; color: #fff; border: none; outline: none; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.16); display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, box-shadow 0.2s ease; }',
        '#ac-w-btn:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(0,0,0,0.22); }',
        '#ac-w-box { position: fixed; z-index: 999999; ' + (CFG.position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;') + ' bottom: 84px; width: 360px; max-width: calc(100vw - 32px); height: 500px; max-height: calc(100vh - 110px); background: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; display: none; flex-direction: column; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }',
        '#ac-w-hdr { background: ' + CFG.primaryColor + '; color: #ffffff; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; }',
        '#ac-w-hdr-title { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; }',
        '#ac-w-hdr-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block; }',
        '#ac-w-close { background: none; border: none; color: #ffffff; opacity: 0.8; cursor: pointer; padding: 4px; display: flex; }',
        '#ac-w-close:hover { opacity: 1; }',
        '#ac-w-body { flex: 1; padding: 14px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: #fafafa; }',
        '.ac-w-msg { max-width: 82%; padding: 10px 13px; border-radius: 14px; font-size: 13px; line-height: 1.45; word-wrap: break-word; }',
        '.ac-w-msg-asst { background: #ffffff; color: #1f2937; align-self: flex-start; border: 1px solid #e5e7eb; border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }',
        '.ac-w-msg-usr { background: ' + CFG.primaryColor + '; color: #ffffff; align-self: flex-end; border-bottom-right-radius: 4px; }',
        '#ac-w-footer { padding: 10px 12px; background: #ffffff; border-top: 1px solid #f3f4f6; display: flex; flex-direction: column; gap: 6px; }',
        '#ac-w-form { display: flex; align-items: center; gap: 8px; }',
        '#ac-w-input { flex: 1; height: 38px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; font-size: 13px; outline: none; color: #111827; }',
        '#ac-w-input:focus { border-color: #9ca3af; }',
        '#ac-w-send { width: 38px; height: 38px; border-radius: 10px; background: ' + CFG.primaryColor + '; color: #fff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }',
        '#ac-w-send:disabled { opacity: 0.4; cursor: not-allowed; }',
        '#ac-w-brand { text-align: center; font-size: 12px; color: #6b7280; letter-spacing: 0.1px; }',
        '.ac-w-typing { font-size: 12px; color: #6b7280; font-style: italic; padding: 4px 6px; }'
    ].join('\\n');
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.id = 'ac-w-btn';
    btn.setAttribute('aria-label', 'Ouvrir le chat');
    btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    document.body.appendChild(btn);

    var box = document.createElement('div');
    box.id = 'ac-w-box';
    box.innerHTML = [
        '<div id="ac-w-hdr">',
        '  <div id="ac-w-hdr-title"><span id="ac-w-hdr-dot"></span><span id="ac-w-title"></span></div>',
        '  <button id="ac-w-close" aria-label="Fermer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>',
        '</div>',
        '<div id="ac-w-body"></div>',
        '<div id="ac-w-footer">',
        '  <form id="ac-w-form">',
        '    <input type="text" id="ac-w-input" placeholder="Écrivez votre message..." autocomplete="off" />',
        '    <button type="submit" id="ac-w-send" aria-label="Envoyer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>',
        '  </form>',
        '  <div id="ac-w-brand">Sécurisé par AutoCall AI</div>',
        '</div>'
    ].join('');
    document.body.appendChild(box);
    document.getElementById('ac-w-title').textContent = CFG.title;

    var bodyEl = document.getElementById('ac-w-body');
    var inputEl = document.getElementById('ac-w-input');
    var formEl = document.getElementById('ac-w-form');
    var sendBtn = document.getElementById('ac-w-send');
    var closeBtn = document.getElementById('ac-w-close');

    function renderMessages() {
        bodyEl.innerHTML = '';
        messages.forEach(function(m) {
            var div = document.createElement('div');
            div.className = 'ac-w-msg ' + (m.role === 'usr' ? 'ac-w-msg-usr' : 'ac-w-msg-asst');
            div.textContent = m.text;
            bodyEl.appendChild(div);
        });
        bodyEl.scrollTop = bodyEl.scrollHeight;
    }
    renderMessages();

    function toggleBox() {
        isOpen = !isOpen;
        box.style.display = isOpen ? 'flex' : 'none';
        if (isOpen) {
            renderMessages();
            setTimeout(function() { inputEl.focus(); }, 100);
        }
    }

    btn.addEventListener('click', toggleBox);
    closeBtn.addEventListener('click', toggleBox);

    formEl.addEventListener('submit', function(e) {
        e.preventDefault();
        var val = (inputEl.value || '').trim();
        if (!val) return;

        messages.push({ role: 'usr', text: val });
        inputEl.value = '';
        renderMessages();

        var typing = document.createElement('div');
        typing.className = 'ac-w-typing';
        typing.textContent = CFG.agentName + ' écrit...';
        bodyEl.appendChild(typing);
        bodyEl.scrollTop = bodyEl.scrollHeight;

        sendBtn.disabled = true;

        fetch(CFG.apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: val })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (typing.parentNode) typing.parentNode.removeChild(typing);
            messages.push({ role: 'assistant', text: data.reply || 'Message bien reçu !' });
            renderMessages();
        })
        .catch(function() {
            if (typing.parentNode) typing.parentNode.removeChild(typing);
            messages.push({ role: 'assistant', text: 'Désolé, une petite erreur est survenue. Veuillez réessayer.' });
            renderMessages();
        })
        .finally(function() {
            sendBtn.disabled = false;
        });
    });
})();`;

        return new NextResponse(jsCode, {
            status: 200,
            headers: {
                'Content-Type': 'application/javascript; charset=utf-8',
                'Cache-Control': 'public, max-age=60',
            },
        });
    } catch (err) {
        console.error('[WidgetScript] Error generating widget JS:', err);
        return new NextResponse('// AutoCall Widget: error', {
            status: 500,
            headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
        });
    }
}
