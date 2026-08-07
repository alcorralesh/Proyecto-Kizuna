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
  const scriptUrl = new URL(document.currentScript?.src || location.href);
  const appBaseUrl = new URL('./', scriptUrl);
  let requestedMessageId = new URLSearchParams(location.search).get('message');

  const escape = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
  const currentIso = () => new Date().toISOString();
  const active = message => new Date(message.published_at) <= new Date()
    && (!message.expires_at || new Date(message.expires_at) > new Date());
  const storedInMailbox = message => message.display_mode === 'mailbox' || Boolean(message.saved_to_mailbox_at);
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
    if (!client || !id) return false;
    const row = messages.find(message => message.id === id);
    const previous = row ? Object.fromEntries(Object.keys(changes).map(key => [key, row[key]])) : null;
    if (row) Object.assign(row, changes);
    notify();
    const { error } = await client.from('expedient_messages').update(changes).eq('id', id);
    if (error) {
      if (row && previous) Object.assign(row, previous);
      notify();
      console.warn('No se pudo actualizar el estado del mensaje.', error);
      return false;
    }
    return true;
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
  const messageDestination = message => {
    if (!message?.deep_link) return '';
    try {
      const destination = new URL(message.deep_link, appBaseUrl);
      if (destination.origin !== location.origin) return '';
      return destination.href;
    } catch {
      return '';
    }
  };
  const isCurrentDestination = destination => {
    if (!destination) return false;
    try {
      const current = new URL(location.href);
      const target = new URL(destination);
      current.searchParams.delete('message');
      target.searchParams.delete('message');
      return current.origin === target.origin &&
        current.pathname === target.pathname &&
        current.search === target.search &&
        current.hash === target.hash;
    } catch {
      return false;
    }
  };
  const clearRequestedMessage = () => {
    if (!requestedMessageId) return;
    const url = new URL(location.href);
    url.searchParams.delete('message');
    history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
    requestedMessageId = null;
  };
  const showNextNotice = async () => {
    clearTimeout(noticeTimer);
    if (!client || !userId || document.querySelector('#recipient-message-notice')) return;
    if (isBusy()) {
      deferNotice();
      return;
    }
    const requested = requestedMessageId
      ? messages.find(item => item.id === requestedMessageId && active(item))
      : null;
    const message = requested || sorted(messages).reverse().find(item =>
      !['mailbox', 'push'].includes(item.display_mode) && !item.dismissed_at && !item.acknowledged_at);
    if (!message) return;
    const destination = messageDestination(message);
    if (requested && message.deep_link && isCurrentDestination(destination)) {
      clearRequestedMessage();
      if (!message.read_at) await patch(message.id, { read_at: currentIso() });
      return;
    }
    const root = document.createElement('aside');
    root.id = 'recipient-message-notice';
    root.className = `recipient-message-notice mode-${requested ? 'modal' : message.display_mode} priority-${message.priority}`;
    root.setAttribute('role', requested || message.display_mode === 'modal' ? 'alertdialog' : 'status');
    root.setAttribute('aria-live', message.priority === 'urgent' ? 'assertive' : 'polite');
    root.innerHTML = `<article>
      <header><span>${escape(messageLabel(message))}</span><button type="button" data-message-dismiss aria-label="Cerrar aviso">×</button></header>
      <p class="recipient-message-source">DIVISIÓN DE ARCHIVOS TEMPORALES</p>
      <h2>${escape(message.subject)}</h2>
      <p class="recipient-message-body">${escape(message.body).replace(/\n/g, '<br>')}</p>
      <footer>
        <button type="button" data-message-mailbox>Guardar y ver en el buzón</button>
        ${destination ? `<button type="button" data-message-destination>${context === 'public' && /\/expediente\//.test(destination) ? 'Abrir expediente' : 'Abrir destino'}</button>` : ''}
        ${message.requires_ack ? '<button type="button" data-message-ack>Confirmar recepción</button>' : '<button type="button" data-message-read>Entendido</button>'}
      </footer>
    </article>`;
    const noticeFooter = root.querySelector('footer');
    noticeFooter.dataset.actionCount = String(noticeFooter.querySelectorAll('button').length);
    document.body.appendChild(root);
    if (requested) clearRequestedMessage();
    requestAnimationFrame(() => root.classList.add('visible'));
    if (!message.displayed_at) await patch(message.id, { displayed_at: currentIso() });
    const close = async changes => {
      const updated = await patch(message.id, changes);
      if (!updated) return false;
      root.classList.remove('visible');
      setTimeout(() => {
        root.remove();
        deferNotice();
      }, 260);
      return true;
    };
    root.querySelector('[data-message-dismiss]').onclick = () => close({ dismissed_at: currentIso() });
    root.querySelector('[data-message-read]')?.addEventListener('click', () =>
      close({ read_at: currentIso(), dismissed_at: currentIso() }));
    root.querySelector('[data-message-ack]')?.addEventListener('click', () =>
      close({ read_at: currentIso(), acknowledged_at: currentIso(), dismissed_at: currentIso() }));
    root.querySelector('[data-message-mailbox]').onclick = async () => {
      const saved = await close({ read_at: message.read_at || currentIso(), saved_to_mailbox_at: message.saved_to_mailbox_at || currentIso(), dismissed_at: currentIso() });
      if (saved) document.dispatchEvent(new CustomEvent('kizuna:open-recipient-mailbox', { detail: message }));
    };
    root.querySelector('[data-message-destination]')?.addEventListener('click', async () => {
      await patch(message.id, { read_at: message.read_at || currentIso(), dismissed_at: currentIso() });
      location.href = destination;
    });
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
    list: () => sorted(messages).filter(storedInMailbox),
    unreadCount: () => messages.filter(message => active(message) && storedInMailbox(message) && !message.read_at).length,
    markRead: id => patch(id, { read_at: currentIso() }),
    acknowledge: id => patch(id, { read_at: currentIso(), acknowledged_at: currentIso() }),
    dismiss: id => patch(id, { dismissed_at: currentIso() }),
    destination: id => messageDestination(messages.find(message => message.id === id)),
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
  window.KizunaRecipientMessages = api;
})();
