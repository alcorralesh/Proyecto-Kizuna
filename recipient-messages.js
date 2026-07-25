(() => {
  if (window.KizunaRecipientMessages) return;

  let client = null;
  let userId = null;
  let channel = null;
  let messages = [];
  let context = 'public';
  let onChange = null;
  let noticeTimer = 0;
  const listeners = new Set();

  const escape = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
  const currentIso = () => new Date().toISOString();
  const active = message => new Date(message.published_at) <= new Date()
    && (!message.expires_at || new Date(message.expires_at) > new Date());
  const sorted = rows => [...rows].filter(active).sort((a, b) =>
    new Date(b.published_at) - new Date(a.published_at));
  const isBusy = () => Boolean(
    document.querySelector('dialog[open], #alberto-letter, #alberto-decision, #kizuna-finale, .alt00-viewer, body.alberto-overlay-open')
  );
  const notify = () => {
    const snapshot = api.list();
    onChange?.(snapshot);
    listeners.forEach(listener => listener(snapshot));
    document.dispatchEvent(new CustomEvent('kizuna:recipient-messages', { detail: snapshot }));
  };
  const patch = async (id, changes) => {
    if (!client || !id) return;
    const row = messages.find(message => message.id === id);
    if (row) Object.assign(row, changes);
    notify();
    const { error } = await client.from('expedient_messages').update(changes).eq('id', id);
    if (error) console.warn('No se pudo actualizar el estado del mensaje.', error);
  };
  const removeNotice = () => document.querySelector('#recipient-message-notice')?.remove();
  const deferNotice = () => {
    clearTimeout(noticeTimer);
    noticeTimer = window.setTimeout(showNextNotice, 900);
  };
  const messageLabel = message => ({
    banner: 'COMUNICACIÓN DEL ARCHIVO',
    highlight: 'MENSAJE DESTACADO',
    modal: 'ATENCIÓN DEL DESTINATARIO'
  }[message.display_mode] || 'NUEVO MENSAJE');
  const showNextNotice = async () => {
    clearTimeout(noticeTimer);
    if (!client || !userId || document.querySelector('#recipient-message-notice')) return;
    if (isBusy()) {
      deferNotice();
      return;
    }
    const message = sorted(messages).reverse().find(item =>
      item.display_mode !== 'mailbox' && !item.dismissed_at && !item.acknowledged_at);
    if (!message) return;
    const root = document.createElement('aside');
    root.id = 'recipient-message-notice';
    root.className = `recipient-message-notice mode-${message.display_mode} priority-${message.priority}`;
    root.setAttribute('role', message.display_mode === 'modal' ? 'alertdialog' : 'status');
    root.setAttribute('aria-live', message.priority === 'urgent' ? 'assertive' : 'polite');
    root.innerHTML = `<article>
      <header><span>${escape(messageLabel(message))}</span><button type="button" data-message-dismiss aria-label="Cerrar aviso">×</button></header>
      <p class="recipient-message-source">DIVISIÓN DE ARCHIVOS TEMPORALES</p>
      <h2>${escape(message.subject)}</h2>
      <p class="recipient-message-body">${escape(message.body).replace(/\n/g, '<br>')}</p>
      <footer>
        <button type="button" data-message-mailbox>Guardar y ver en el buzón</button>
        ${message.requires_ack ? '<button type="button" data-message-ack>Confirmar recepción</button>' : '<button type="button" data-message-read>Entendido</button>'}
      </footer>
    </article>`;
    document.body.appendChild(root);
    requestAnimationFrame(() => root.classList.add('visible'));
    if (!message.displayed_at) await patch(message.id, { displayed_at: currentIso() });
    const close = async changes => {
      root.classList.remove('visible');
      await patch(message.id, changes);
      setTimeout(() => {
        root.remove();
        deferNotice();
      }, 260);
    };
    root.querySelector('[data-message-dismiss]').onclick = () => close({ dismissed_at: currentIso() });
    root.querySelector('[data-message-read]')?.addEventListener('click', () =>
      close({ read_at: currentIso(), dismissed_at: currentIso() }));
    root.querySelector('[data-message-ack]')?.addEventListener('click', () =>
      close({ read_at: currentIso(), acknowledged_at: currentIso(), dismissed_at: currentIso() }));
    root.querySelector('[data-message-mailbox]').onclick = async () => {
      await close({ read_at: message.read_at || currentIso(), dismissed_at: currentIso() });
      document.dispatchEvent(new CustomEvent('kizuna:open-recipient-mailbox', { detail: message }));
    };
  };
  const stop = async () => {
    clearTimeout(noticeTimer);
    removeNotice();
    if (channel && client) await client.removeChannel(channel);
    channel = null;
    client = null;
    userId = null;
    messages = [];
    notify();
  };
  const connect = async options => {
    await stop();
    client = options.client;
    userId = options.userId;
    context = options.context || 'public';
    onChange = options.onChange || null;
    if (!client || !userId) return [];
    const { data, error } = await client.from('expedient_messages')
      .select('*')
      .eq('user_id', userId)
      .lte('published_at', currentIso())
      .order('published_at', { ascending: false });
    if (error) {
      console.warn('No se pudieron cargar las comunicaciones del destinatario.', error);
      return [];
    }
    messages = sorted(data || []);
    notify();
    channel = client.channel(`recipient-messages-${userId}-${context}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'expedient_messages', filter: `user_id=eq.${userId}`
      }, payload => {
        if (payload.eventType === 'DELETE') messages = messages.filter(item => item.id !== payload.old.id);
        else {
          const index = messages.findIndex(item => item.id === payload.new.id);
          if (index >= 0) messages[index] = payload.new;
          else messages.push(payload.new);
          messages = sorted(messages);
        }
        notify();
        deferNotice();
      }).subscribe();
    deferNotice();
    return api.list();
  };

  const api = {
    connect,
    stop,
    list: () => sorted(messages),
    unreadCount: () => messages.filter(message => active(message) && !message.read_at).length,
    markRead: id => patch(id, { read_at: currentIso() }),
    acknowledge: id => patch(id, { read_at: currentIso(), acknowledged_at: currentIso() }),
    dismiss: id => patch(id, { dismissed_at: currentIso() }),
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
  window.KizunaRecipientMessages = api;
})();
