(function () {
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function inferTypeAndId(url) {
    try {
      const u = new URL(url);
      const path = u.pathname;
      if (/\/document\//.test(path)) return { type: 'docs', id: path.split('/d/')[1]?.split('/')[0] };
      if (/\/spreadsheets\//.test(path)) return { type: 'sheets', id: path.split('/d/')[1]?.split('/')[0] };
      if (/\/presentation\//.test(path)) return { type: 'slides', id: path.split('/d/')[1]?.split('/')[0] };
      return { type: null, id: null };
    } catch (e) {
      return { type: null, id: null };
    }
  }

  function toEmbedUrl(type, url, id) {
    // Prefer constructing known embed URLs when we can extract the document ID.
    if (id) {
      if (type === 'docs') return `https://docs.google.com/document/d/${id}/preview`;
      if (type === 'sheets') return `https://docs.google.com/spreadsheets/d/${id}/preview`;
      if (type === 'slides') return `https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false&delayms=3000`;
    }
    // Fallback: use provided URL. For best results, ensure it is a published/preview/embed URL.
    return url;
  }

  function renderEmbed(cfgRaw) {
    const cfg = Object.assign(
      {
        type: undefined, // 'docs' | 'sheets' | 'slides'
        url: '',
        title: '',
        description: '',
        showTitle: false,
        showDescription: false,
        height: 480,
      },
      cfgRaw || {}
    );

    const inferred = inferTypeAndId(cfg.url);
    const type = cfg.type || inferred.type || 'docs';
    const id = inferred.id;
    const embedUrl = toEmbedUrl(type, cfg.url, id);

    const titleEsc = escapeHtml(cfg.title);
    const descEsc = escapeHtml(cfg.description);

    const showTitle = !!cfg.showTitle;
    const showDescription = !!cfg.showDescription;
    const height = Number(cfg.height) > 0 ? Number(cfg.height) : 480;

    const allowFull = type === 'slides' ? ' allowfullscreen' : '';

    return `
<div class="gembed" data-type="${type}" data-title="${titleEsc}" data-description="${descEsc}">
  ${titleEsc ? `<div class="gembed-title" style="${showTitle ? '' : 'display:none;'}">${titleEsc}</div>` : ''}
  ${descEsc ? `<div class="gembed-description" style="${showDescription ? '' : 'display:none;'}">${descEsc}</div>` : ''}
  <div class="gembed-frame-wrap">
    <iframe class="gembed-frame" src="${embedUrl}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" width="100%" height="${height}" frameborder="0"${allowFull}></iframe>
  </div>
</div>`;
  }

  function replaceGEmbedBlocks(markdown) {
    const fenceRe = /```\s*(?:g(?:oogle)?-?embed)\s*\n([\s\S]*?)\n```/gi;
    return markdown.replace(fenceRe, function (_match, jsonText) {
      try {
        const cfg = JSON.parse(jsonText);
        if (!cfg || !cfg.url) return _match; // leave as-is if invalid
        return renderEmbed(cfg);
      } catch (e) {
        // Not valid JSON; leave original block to help users debug
        return _match;
      }
    });
  }

  function install(hook, vm) {
    hook.beforeEach(function (content) {
      return replaceGEmbedBlocks(content);
    });
  }

  if (!window.$docsify) window.$docsify = {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], install);
})();
