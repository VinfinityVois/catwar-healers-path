// ==UserScript==
// @name         Тропа Целителя: Калькуляторы и Болезни
// @namespace    catwar-healer
// @version      1.9.5
// @description  Справочник болезней/трав с иконками, калькуляторы ЦУ/грязи/смеси/костоправов, последовательность действий. Отдельный виджет.
// @author       Древняя Мечта 1702183
// @match        http*://*.catwar.net/cw3/*
// @match        http*://*.catwar.su/cw3/*
// @exclude      http*://*.catwar.net/cw3/jagd*
// @exclude      http*://*.catwar.su/cw3/jagd*
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      i.ibb.co
// @updateURL    https://raw.githubusercontent.com/VinfinityVois/catwar-healers-path/main/cwh-toolkit.user.js
// @downloadURL  https://raw.githubusercontent.com/VinfinityVois/catwar-healers-path/main/cwh-toolkit.user.js
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // только игровая (поле #cages) — не охота / не прочие cw3-страницы
  const _href = String(location.href || '');
  const _path = String(location.pathname || '');
  if (/\/cw3\/jagd/i.test(_href) || /\/cw3\/jagd/i.test(_path)) return;
  if (!/\/cw3\/?$/i.test(_path) && !/\/cw3\/($|\?|#)/i.test(_href) && !document.getElementById('cages')) {
    // если нет карты — всё равно подождём init, но на jagd уже вышли
  }

  /* ========================================================================
     КАРТИНКИ (прямые ссылки i.ibb.co)
     ======================================================================== */
  const IMG = {
    'Пижма': 'https://i.ibb.co/Y72708ck/image.webp',
    'Мёд': 'https://i.ibb.co/MyWgnBjK/image.webp',
    'Кошачья мята': 'https://i.ibb.co/DHksDtbp/image.webp',
    'Бурачник': 'https://i.ibb.co/LFfN7FW/image.webp',
    'Мать-и-мачеха': 'https://i.ibb.co/MWqQzK4/image.webp',
    'Рябина': 'https://i.ibb.co/j9dtkNXX/image.webp',
    'Одуванчик': 'https://i.ibb.co/Q3SK7Pzz/image.webp',
    'Крапива': 'https://i.ibb.co/C342CN7g/image.webp',
    'Мятлик': 'https://i.ibb.co/G4x7pbkk/image.webp',
    'Шиповник': 'https://i.ibb.co/9kkXGShS/image.webp',
    'Лопух': 'https://i.ibb.co/XZR9jxS4/image.webp',
    'Паутина': 'https://i.ibb.co/cK6kntmj/image.webp',
    'Клевер': 'https://i.ibb.co/1fYPM21P/image.webp',
    'Щавель': 'https://i.ibb.co/zWzqJxGq/image.webp',
    'Незабудка': 'https://i.ibb.co/WWLFVRdb/image.webp',
    'Тысячелистник': 'https://i.ibb.co/NnGTxn0s/image.webp',
    'Подорожник': 'https://i.ibb.co/NgTD7FdT/image.webp',
    'Мох': 'https://i.ibb.co/mCHScSzK/image.webp',
    'Водяной мох': 'https://i.ibb.co/zVRQWDnc/image.webp',
    'Наполненный водой мох': 'https://i.ibb.co/dwvvfKFm/image.webp',
    'Наполненный мышиной желчью мох': 'https://i.ibb.co/HTK9gmtZ/image.webp',
    'Использованный мох': 'https://i.ibb.co/wxLc38r/image.webp',
    'Костоправ': 'https://i.ibb.co/j9VJLSJc/image.webp',
    'Костоправ2': 'https://i.ibb.co/JRYWffjL/2.webp',
    'Календула': 'https://i.ibb.co/tMcpW5Jm/image.webp',
    'Лаванда': 'https://i.ibb.co/WW7DMQvm/image.webp',
    'Ромашка': 'https://i.ibb.co/0pgjm9X3/image.webp',
    'Медвежий лук': 'https://i.ibb.co/G4vcd89z/image.webp',
    'Еловые иглы': 'https://i.ibb.co/pvPrPnBw/image.webp',
    'Хвощ': 'https://i.ibb.co/xtY7hfCC/image.webp',
    'Мак': 'https://i.ibb.co/HLF69KBz/image.webp',
    'Петрушка': 'https://i.ibb.co/j9TV6VsX/image.webp',
    'Крепкая ветка': 'https://i.ibb.co/qLWWY3ZZ/image.webp',
    'Целебная водоросль': 'https://i.ibb.co/nM63KfQc/2.webp',
    'Плотная водоросль': 'https://i.ibb.co/M5pwf6fg/image.webp',
    'Смерть-ягоды': 'https://i.ibb.co/j9CtSY29/image.webp',
    'Разжёванный корень': 'https://i.ibb.co/q3mDp2Ft/image.webp',
    'Разжёванный стебель': 'https://i.ibb.co/p6xy6gTF/image.webp',
    'Разжёванная трава': 'https://i.ibb.co/G4sh9Kkf/image.webp',
    'Разжёванные листья': 'https://i.ibb.co/23mLC1bs/image.webp',
    'Разжёванные ягоды': 'https://i.ibb.co/Xkt49HHZ/image.webp',
    'Семена': 'https://i.ibb.co/W4ZVwDY4/image.webp',
    'Сок': 'https://i.ibb.co/Mxgv9MtD/image.webp',
    'Корень': 'https://i.ibb.co/84x1vbqQ/image.webp',
    'Листья': 'https://i.ibb.co/6Rjx4mqn/image.webp',
    'Ягоды': 'https://i.ibb.co/7tBHvG9B/image.webp',
    'Стебель': 'https://i.ibb.co/p6xy6gTF/image.webp',
    'Вьюнок': 'https://i.ibb.co/8DZjS3Sf/566.webp',
  };

  // Мыши для анимации у мха с желчью
  const MICE = [
    { name: 'хилая мышь', src: 'https://i.ibb.co/23fPz76J/image.webp' },
    { name: 'обычная мышь', src: 'https://i.ibb.co/HL6SfZGd/image.webp' },
    { name: 'упитанная мышь', src: 'https://i.ibb.co/ZRSmncbp/image.webp' },
  ];

  // Две модели целебной водоросли — чередуем
  const ALGAE = [
    { name: 'Целебная водоросль', src: 'https://i.ibb.co/nM63KfQc/2.webp' },
    { name: 'Целебная водоросль', src: 'https://i.ibb.co/XxFP1nGw/image.webp' },
  ];


  /* ---- Звуки и утилиты автоматизации ---- */
  function cwhBeep(kind) {
    if (!GM_getValue('cwh_sound', true)) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!window._cwhAudioCtx) window._cwhAudioCtx = new Ctx();
      const ctx = window._cwhAudioCtx;
      if (ctx.state === 'suspended') ctx.resume();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      const now = ctx.currentTime;
      if (kind === 'warn') {
        o.frequency.setValueAtTime(520, now);
        o.frequency.linearRampToValueAtTime(320, now + 0.18);
        g.gain.setValueAtTime(0.15, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        o.start(now); o.stop(now + 0.36);
      } else if (kind === 'ok') {
        o.type = 'sine';
        o.frequency.setValueAtTime(660, now);
        o.frequency.linearRampToValueAtTime(880, now + 0.1);
        g.gain.setValueAtTime(0.1, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        o.start(now); o.stop(now + 0.22);
      } else if (kind === 'done') {
        o.type = 'triangle';
        o.frequency.setValueAtTime(523, now);
        o.frequency.setValueAtTime(659, now + 0.12);
        o.frequency.setValueAtTime(784, now + 0.24);
        g.gain.setValueAtTime(0.12, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        o.start(now); o.stop(now + 0.42);
      } else {
        o.frequency.value = 480;
        g.gain.setValueAtTime(0.07, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        o.start(now); o.stop(now + 0.11);
      }
    } catch (e) {}
  }

  function getCuPct() {
    const c = Math.max(0, Math.min(9, +GM_getValue('cwh_cu', 5)));
    return CU_PCT[c] || 26;
  }
  function setCuLevel(v) {
    v = Math.max(0, Math.min(9, +v || 0));
    GM_setValue('cwh_cu', v);
    if (typeof panel !== 'undefined' && panel) {
      panel.querySelectorAll('#cwh-cu-in, #cwh-cu2').forEach(inp => { if (+inp.value !== v) inp.value = v; });
      panel.querySelectorAll('#cwh-cu-out').forEach(out => { out.value = (CU_PCT[v] || '?') + '%'; });
    }
    return v;
  }

  function isPodsobkaLocation() {
    try {
      const cages = document.getElementById('cages');
      if (!cages) return false;
      // ТОЛЬКО игровая карта / переходы — без текста виджета #cwh-widget
      const mapRoot = document.getElementById('cages_div')
        || document.getElementById('tr_field')
        || document.getElementById('main_table')
        || cages.parentElement;
      if (!mapRoot) return false;
      // клонируем текст без нашего виджета
      let t = '';
      const walk = document.createTreeWalker(mapRoot, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null);
      let n;
      while ((n = walk.nextNode())) {
        if (n.nodeType === 1) {
          if (n.id === 'cwh-widget' || (n.closest && n.closest('#cwh-widget'))) {
            // skip subtree: jump by continuing without reading children... TreeWalker still enters
          }
        }
        if (n.nodeType === 3) {
          const p = n.parentElement;
          if (p && p.closest && p.closest('#cwh-widget')) continue;
          t += n.nodeValue + '\n';
        }
      }
      // подписи клеток на подсобке
      const hasMoss1 = /Мох\s*1/i.test(t);
      const hasMoss2 = /Мох\s*2/i.test(t);
      const hasMoss3 = /Мох\s*3/i.test(t);
      const hasShchel = /Щель в полу/i.test(t);
      // выходы «Подсобка» на самой подсобке обычно ≥2
      const podExits = (t.match(/\bПодсобка\b/g) || []).length;
      if ((hasMoss1 && hasMoss2) || (hasMoss1 && hasMoss3) || (hasMoss2 && hasMoss3)) {
        if (hasShchel || podExits >= 1) return true;
      }
      // ещё признак: фон подсобки + щель
      if (hasShchel && hasMoss1) return true;
      return false;
    } catch (e) { return false; }
  }

  function scanMouthItems() {
    const list = document.getElementById('itemList');
    const out = [];
    if (!list) return out;
    list.querySelectorAll('.itemInMouth').forEach(el => {
      const tid = (typeof thingIdFromEl === 'function') ? thingIdFromEl(el) : null;
      const h = tid ? HERBS.find(x => String(x.id) === String(tid)) : null;
      let name = h ? h.name : '';
      if (!name) {
        const img = el.querySelector('img');
        name = (img && (img.alt || img.title)) || ('#' + (tid || '?'));
      }
      out.push({ el: el, id: el.id, tid: tid, herb: h, name: name });
    });
    return out;
  }

  const RES_GROUPS = {
    // type id из things/N.png (скрины + wiki)
    mice:     { name: 'Мыши',              ids: ['17763'] },
    rot:      { name: 'Гниль',              ids: ['180'] },
    moss:     { name: 'Мох',               ids: ['75','76','77'] },
    bile:     { name: 'Мох с желчью',      ids: ['78'] },
    waterMoss:{ name: 'Водяной мох',       ids: ['95'] },
    web:      { name: 'Паутина',           ids: ['20'] },
    cough:    { name: 'Кашель',            ids: ['13','23','26','110','115','24'] },
    poison:   { name: 'Отравление',        ids: ['17','109','112','116'] },
    wounds:   { name: 'Раны / кровоток',   ids: ['15','16','19','25','104','106','108','111','119'] },
    branches: { name: 'Крепкая ветка',     ids: ['565'] },
    vine:     { name: 'Вьюнки',            ids: ['566'] },
    algae:    { name: 'Водоросли',         ids: ['3993','21'] },  // 3993 плотная, 21 целебная
    kost:     { name: 'Костоправы',        ids: ['562'] },
    // камни-слои (не ресурс для счётчика трав)
    // 417, 418 — камни под кучами
  };

  function pullThingIdsFromString(st, into) {
    if (!st) return;
    // каждое things/N = слой (с расширением или без)
    const re = /things\/(\d+)(?:\.(?:png|webp|gif|jpe?g))?/gi;
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(String(st)))) into.push(m[1]);
  }
  function pullThingIdsFromEl(el, into) {
    if (!el) return;
    const attrStyle = el.getAttribute && el.getAttribute('style');
    if (attrStyle) pullThingIdsFromString(attrStyle, into);
    else if (el.style) {
      pullThingIdsFromString(el.style.backgroundImage || '', into);
      pullThingIdsFromString(el.style.cssText || '', into);
    }
    pullThingIdsFromString(el.getAttribute && el.getAttribute('background'), into);
    if (el.tagName === 'IMG' && el.src) pullThingIdsFromString(el.src, into);
  }
  /** клетка 6×10: все .cage_items и потомки со style — без computed (×2) */
  function pullThingIdsFromCell(td, into) {
    if (!td) return;
    const seen = new Set();
    function visit(el) {
      if (!el || el.nodeType !== 1 || seen.has(el)) return;
      seen.add(el);
      pullThingIdsFromEl(el, into);
    }
    visit(td);
    try {
      td.querySelectorAll('.cage_items, [style], [background], img').forEach(visit);
    } catch (e) {}
  }
  /** все слои things/N на поле (сетка 6 рядов × 10 колонок).
   *  Каждый url() в background = 1 предмет. Без computed, без схлопывания одинаковых. */
  function scanFieldThingIds() {
    const ids = [];
    const table = document.getElementById('cages');
    if (!table) {
      document.querySelectorAll('.cage_items').forEach(function(ci) {
        pullThingIdsFromEl(ci, ids);
      });
      return ids;
    }
    // сетка 6×10: каждая клетка, все слои
    const rows = table.querySelectorAll(':scope > tbody > tr, :scope > tr');
    rows.forEach(function(tr) {
      const cells = tr.querySelectorAll(':scope > td.cage, :scope > td');
      cells.forEach(function(td) {
        if (typeof pullThingIdsFromCell === 'function') pullThingIdsFromCell(td, ids);
        else {
          td.querySelectorAll('.cage_items').forEach(function(ci) { pullThingIdsFromEl(ci, ids); });
          pullThingIdsFromEl(td, ids);
        }
      });
    });
    return ids;
  }

  /** поклеточный скан 6×10: все слои без схлопывания одинаковых id */
  function scanFieldLayersByCell() {
    const out = [];
    const table = document.getElementById('cages');
    if (!table) return out;
    const rows = table.querySelectorAll(':scope > tbody > tr, :scope > tr');
    rows.forEach(function(tr, ri) {
      const cells = tr.querySelectorAll(':scope > td.cage, :scope > td');
      cells.forEach(function(td, ci) {
        const tids = [];
        if (typeof pullThingIdsFromCell === 'function') pullThingIdsFromCell(td, tids);
        else {
          td.querySelectorAll('.cage_items').forEach(function(ciEl) { pullThingIdsFromEl(ciEl, tids); });
          pullThingIdsFromEl(td, tids);
        }
        if (tids.length) out.push({ r: ri + 1, c: ci + 1, ids: tids });
      });
    });
    return out;
  }

  function scanPodsobkaByCells() {
    const counts = {};
    Object.keys(RES_GROUPS).forEach(k => { counts[k] = 0; });
    counts.stones = 0;
    let fieldItems = 0;
    const table = document.getElementById('cages');
    const allIds = scanFieldThingIds();
    fieldItems = allIds.length;

    // основной подсчёт — по type id (things/N.png) на всём поле
    const byType = countByGroups(allIds);
    Object.keys(RES_GROUPS).forEach(k => {
      counts[k] = byType[k] || 0;
    });

    // доп. по клеткам схемы: только id, входящие в группу (не камни/чужие слои)
    if (table && typeof PODSOBKA_CELLS !== 'undefined') {
      const re = /things\/(\d+)\.png/gi;
      const sets = {};
      Object.keys(RES_GROUPS).forEach(k => {
        sets[k] = new Set((RES_GROUPS[k].ids || []).map(String));
      });
      // сброс категорий, которые считаем строго по своим клеткам схемы
      const cellKeys = {};
      PODSOBKA_CELLS.forEach(function(cell) {
        if (cell.key !== 'stones') cellKeys[cell.key] = true;
      });
      Object.keys(cellKeys).forEach(function(k) { counts[k] = 0; });

      PODSOBKA_CELLS.forEach(function(cell) {
        const tr = table.querySelector(':scope > tbody > tr:nth-of-type(' + cell.r + '), :scope > tr:nth-of-type(' + cell.r + ')');
        if (!tr) return;
        const td = tr.querySelector(':scope > td:nth-of-type(' + cell.c + ')');
        if (!td) return;
        const tids = [];
        if (typeof pullThingIdsFromCell === 'function') pullThingIdsFromCell(td, tids);
        else {
          td.querySelectorAll('.cage_items').forEach(function(el) {
            pullThingIdsFromEl(el, tids);
          });
          pullThingIdsFromEl(td, tids);
        }
        if (cell.key === 'stones') {
          counts.stones = (counts.stones || 0) + tids.length;
          return;
        }
        const set = sets[cell.key];
        if (!set) return;
        let n = 0;
        tids.forEach(function(id) {
          // камни-слои 417/418 не считаем как ресурс
          if (id === '417' || id === '418') return;
          if (set.has(String(id))) n++;
        });
        counts[cell.key] = (counts[cell.key] || 0) + n;
      });
      // для категорий без своей клетки — оставляем field-wide byType
      Object.keys(RES_GROUPS).forEach(function(k) {
        if (!cellKeys[k] && (byType[k] || 0) > (counts[k] || 0)) {
          counts[k] = byType[k];
        }
      });
    }

    return {
      counts: counts,
      fieldItems: fieldItems,
      allIds: allIds
    };
  }

  function savePodsobkaSnap(data) {
    GM_setValue('cwh_pod_snap', JSON.stringify({
      counts: data.counts || {},
      fieldItems: data.fieldItems || 0,
      ts: Date.now()
    }));
  }
  function loadPodsobkaSnap() {
    try {
      return JSON.parse(GM_getValue('cwh_pod_snap', 'null') || 'null');
    } catch (e) { return null; }
  }

  function countByGroups(tidList) {
    const out = {};
    Object.keys(RES_GROUPS).forEach(k => { out[k] = 0; });
    const sets = {};
    Object.keys(RES_GROUPS).forEach(k => {
      sets[k] = new Set(RES_GROUPS[k].ids.map(String));
    });
    (tidList || []).forEach(t => {
      const s = String(t);
      Object.keys(sets).forEach(k => {
        if (sets[k].has(s)) out[k]++;
      });
    });
    return out;
  }

  function dutyResourceCounts() {
    const mouth = scanMouthItems();
    // слои с клеток (видимые) — для ориентира; точный учёт только через рот
    let fieldIds = scanFieldThingIds();
    try {
      const cells = scanFieldLayersByCell();
      const fromCells = [];
      cells.forEach(function(cell) { (cell.ids || []).forEach(function(id) { fromCells.push(id); }); });
      if (fromCells.length > fieldIds.length) fieldIds = fromCells;
    } catch (e) {}
    const mouthTids = mouth.map(x => x.tid).filter(Boolean);
    // мыши во рту часто без type id в HERBS — считаем по имени
    const miceMouth = mouth.filter(x => /мышь/i.test(x.name || '')).length;

    const field = countByGroups(fieldIds);
    const mouthG = countByGroups(mouthTids);
    mouthG.mice += miceMouth;

    const now = {};
    Object.keys(RES_GROUPS).forEach(k => {
      now[k] = (field[k] || 0) + (mouthG[k] || 0);
    });

    return {
      now: now,
      field: field,
      mouth: mouthG,
      mouthItems: mouth.length,
      fieldItems: fieldIds.length,
      // legacy keys for старый UI
      mice: now.mice,
      moss: now.moss,
      bile: now.bile,
      web: now.web,
      cough: now.cough,
      poison: now.poison,
      wounds: now.wounds
    };
  }

  function isDutyActive() {
    return !!GM_getValue('cwh_duty_active', false);
  }
  function getDutyStartSnap() {
    try { return JSON.parse(GM_getValue('cwh_duty_start', '{}') || '{}') || {}; }
    catch (e) { return {}; }
  }
  function getDutyPicked() {
    try { return JSON.parse(GM_getValue('cwh_duty_picked', '{}') || '{}') || {}; }
    catch (e) { return {}; }
  }
  function setDutyPicked(obj) {
    GM_setValue('cwh_duty_picked', JSON.stringify(obj || {}));
  }

  let _locKey = '';
  let _locBaseline = null;


  function getLocationTitleText() {
    try {
      const mapRoot = document.getElementById('cages_div')
        || document.getElementById('tr_field')
        || document.getElementById('main_table')
        || document.getElementById('cages');
      if (!mapRoot) return '';
      let t = '';
      // имена переходов
      mapRoot.querySelectorAll('.move_name, .cage_name').forEach(function(el) {
        t += ' ' + (el.textContent || '');
      });
      t += ' ' + (mapRoot.innerText || '');
      return t;
    } catch (e) { return ''; }
  }

  /** локации, где считаем ресурсы: Подсобка, Цветочный бар, Заброшенный порт */
  function isResourceCountLocation() {
    if (typeof isPodsobkaLocation === 'function' && isPodsobkaLocation()) return true;
    const t = getLocationTitleText();
    if (/Цветочн\w*\s*бар/i.test(t)) return true;
    if (/Заброшенн\w*\s*порт/i.test(t)) return true;
    // фон/подпись
    try {
      const bg = (document.getElementById('cages_div') || {}).style;
      const bi = (bg && bg.backgroundImage) || '';
      if (/bar|port|flower/i.test(bi)) { /* weak */ }
    } catch (e) {}
    return false;
  }

  function locationKey() {
    const el = document.querySelector('#cages_div');
    const img = el && el.style && el.style.backgroundImage ? el.style.backgroundImage : '';
    let name = '';
    try {
      const t = document.body.innerText || '';
      const m = t.match(/Подсобка|Мох\s*[123]|Цветочный бар|Заброшенный порт|Чащоба|Пещер|Тоннель|Лаз|Побережье|Свинарник/i);
      if (m) name = m[0];
    } catch (e) {}
    return name + '|' + img.slice(0, 100);
  }

  function emptyGroups() {
    const o = {};
    Object.keys(RES_GROUPS).forEach(k => { o[k] = 0; });
    return o;
  }

  /* ---- точный учёт «собрано»: по уникальным предметам, прошедшим через рот ----
     Кучи на поле рисуются декоративно (фикс. число иконок-слоёв, не равное
     реальному остатку), поэтому единственный надёжный источник — рот: каждый
     поднятый предмет получает свой уникальный id в DOM, и мы просто ни разу
     не считаем его дважды (как при ручном подсчёте «поднял — насчитал+1»). */
  function getSeenIds() {
    try { return JSON.parse(GM_getValue('cwh_duty_seen_ids', '{}') || '{}') || {}; }
    catch (e) { return {}; }
  }
  function setSeenIds(obj) {
    GM_setValue('cwh_duty_seen_ids', JSON.stringify(obj || {}));
  }
  const _mouthElIds = new WeakMap();
  let _mouthIdCounter = 0;
  /** стабильный id предмета во рту: берём id из DOM, а если его нет —
   *  привязываем к самому DOM-узлу (WeakMap), чтобы не путать/не задваивать при перескане */
  function stableMouthId(item) {
    if (item.id) return item.id;
    if (item.el && _mouthElIds.has(item.el)) return _mouthElIds.get(item.el);
    const gen = 'gen:' + (++_mouthIdCounter) + ':' + Date.now();
    if (item.el) _mouthElIds.set(item.el, gen);
    return gen;
  }
  function resKeyForMouthItem(item) {
    const name = item.name || '';
    if (/мышь/i.test(name)) return 'mice';
    if (item.tid) {
      const tid = String(item.tid);
      for (const k of Object.keys(RES_GROUPS)) {
        if ((RES_GROUPS[k].ids || []).map(String).includes(tid)) return k;
      }
    }
    if (/желч/i.test(name)) return 'bile';
    if (/мох/i.test(name)) return 'moss';
    if (/паутин/i.test(name)) return 'web';
    return null;
  }
  /** вызывать периодически, пока дежурство активно: +1 за каждый НОВЫЙ предмет во рту */
  function trackMouthPickups() {
    if (!isDutyActive()) return;
    const mouth = scanMouthItems();
    if (!mouth.length) return;
    const seen = getSeenIds();
    const picked = getDutyPicked();
    let changed = false;
    mouth.forEach(function(item) {
      const key = resKeyForMouthItem(item);
      if (!key) return;
      const id = stableMouthId(item);
      if (!id) return;
      seen[key] = seen[key] || [];
      if (seen[key].indexOf(id) === -1) {
        seen[key].push(id);
        picked[key] = (picked[key] || 0) + 1;
        changed = true;
      }
    });
    if (changed) {
      setSeenIds(seen);
      setDutyPicked(picked);
    }
  }
  /** ручной ввод «было» — то единственное число, которое знает только сам игрок */
  function setDutyStartValue(key, val) {
    const s = getDutyStartSnap();
    s[key] = Math.max(0, parseInt(val, 10) || 0);
    GM_setValue('cwh_duty_start', JSON.stringify(s));
    return s;
  }
  function setDutyPickedValue(key, val) {
    const s = getDutyPicked();
    s[key] = Math.max(0, parseInt(val, 10) || 0);
    setDutyPicked(s);
    return s;
  }
  /** снимок слоёв с текущего поля → «было» (опционально) */
  function snapshotFieldToWas() {
    const snap = emptyGroups();
    try {
      const c = dutyResourceCounts();
      Object.keys(snap).forEach(function(k) {
        snap[k] = (c.field && c.field[k]) || 0;
      });
    } catch (e) {}
    GM_setValue('cwh_duty_start', JSON.stringify(snap));
    return snap;
  }

  /** старт дежурства: «было» вводится вручную (см. setDutyStartValue), тут только обнуляем счётчики */
  function startDuty() {
    GM_setValue('cwh_duty_active', true);
    // «было» — вручную (или кнопка «снимок с поля»); сбор обнуляем
    GM_setValue('cwh_duty_start', JSON.stringify(emptyGroups()));
    setDutyPicked(emptyGroups());
    setSeenIds({});
    _locKey = locationKey();
    _locBaseline = null;
    cwhBeep('ok');
    try { renderDutyMini(); } catch (e) {}
  }

  /** конец дежурства: скрываем дельты, оставляем только текущие числа */
  function endDuty() {
    GM_setValue('cwh_duty_active', false);
    GM_setValue('cwh_duty_start', '{}');
    setDutyPicked(emptyGroups());
    _locBaseline = null;
    _locKey = '';
    cwhBeep('done');
    try { renderDutyMini(); } catch (e) {}
  }

  /** УСТАРЕЛО (не используется): раньше копило «подобрано» по убыванию декоративных
   *  значков куч на поле — оказалось ненадёжно, значки не отражают реальный остаток.
   *  Заменено на trackMouthPickups() — точный счёт по уникальным предметам во рту. */


  function buildDutyReport() {
    const c = dutyResourceCounts();
    const checked = GM_getValue('cwh_duty_checklist', []) || [];
    const stones = GM_getValue('cwh_stones_done', {}) || {};
    const stoneIds = ['43415891','68735202','43484506','60721354','66188223','61998519','60770785','65436930','61968903','62033307','64534742'];
    const stonesOk = stoneIds.filter(function(id) { return stones[id]; }).length;
    return [
      '— Отчёт дежурства (Целитель) —',
      'Мыши: ' + c.mice + ' (цель ≥35)',
      'Мох: ' + c.moss + ' · с желчью: ' + c.bile,
      'Паутина: ' + c.web,
      'Камни: ' + stonesOk + '/' + stoneIds.length,
      'Чеклист: ' + checked.filter(Boolean).length + ' пунктов',
      'Время: ' + new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }) + ' МСК'
    ].join('\\n');
  }

  function countThingsInCell(r, c, idSet) {
    const table = document.getElementById('cages');
    if (!table) return 0;
    const tr = table.querySelector('tr:nth-of-type(' + r + ')');
    if (!tr) return 0;
    const td = tr.querySelector('td:nth-of-type(' + c + '), td.cage:nth-of-type(' + c + ')');
    if (!td) return 0;
    let n = 0;
    const re = /things\/(\d+)\./gi;
    td.querySelectorAll('.cage_items').forEach(function(el) {
      const st = el.getAttribute('style') || '';
      let m;
      re.lastIndex = 0;
      while ((m = re.exec(st))) {
        if (!idSet || idSet.has(String(m[1]))) n++;
      }
      // img fallback
      el.querySelectorAll('img').forEach(function(img) {
        const mm = (img.src || '').match(/things\/(\d+)\./i);
        if (mm && (!idSet || idSet.has(String(mm[1])))) n++;
      });
    });
    return n;
  }

  function getNettleManual() {
    try {
      return JSON.parse(GM_getValue('cwh_nettle_manual', '{}') || '{}') || {};
    } catch (e) { return {}; }
  }
  function setNettleManual(obj) {
    GM_setValue('cwh_nettle_manual', JSON.stringify(obj || {}));
  }

  function countNettleEverywhere() {
    // id 17 = Крапива — слои на поле (ориентир)
    const NETTLE = new Set(['17']);
    const inPoisonScan = isPodsobkaLocation() ? countThingsInCell(6, 3, NETTLE) : 0;
    const inWoundsScan = isPodsobkaLocation() ? countThingsInCell(6, 5, NETTLE) : 0;
    const poisonIds = new Set((RES_GROUPS.poison && RES_GROUPS.poison.ids || []).map(String));
    const woundIds = new Set((RES_GROUPS.wounds && RES_GROUPS.wounds.ids || []).map(String));
    poisonIds.add('17');
    woundIds.add('17');
    const poisonScan = isPodsobkaLocation() ? countThingsInCell(6, 3, poisonIds) : 0;
    const woundsScan = isPodsobkaLocation() ? countThingsInCell(6, 5, woundIds) : 0;
    let inMouth = 0;
    try {
      (scanMouthItems() || []).forEach(function(it) {
        if (String(it.tid) === '17' || /крапив/i.test(it.name || '')) inMouth++;
      });
    } catch (e) {}
    let onField = 0;
    try {
      document.querySelectorAll('#cages .cage_items').forEach(function(el) {
        const st = el.getAttribute('style') || '';
        const re = /things\/(\d+)\./gi;
        let m;
        while ((m = re.exec(st))) {
          if (m[1] === '17') onField++;
        }
      });
    } catch (e) {}

    // учёт из счётчика дежурства: сейчас = было + сбор
    let dutyPoison = null, dutyWounds = null;
    try {
      const start = typeof getDutyStartSnap === 'function' ? getDutyStartSnap() : {};
      const picked = typeof getDutyPicked === 'function' ? getDutyPicked() : {};
      dutyPoison = (start.poison || 0) + (picked.poison || 0);
      dutyWounds = (start.wounds || 0) + (picked.wounds || 0);
    } catch (e) {}

    // ручные числа крапивы / куч (приоритет)
    const man = getNettleManual();

    // итоговые кучи для решения «куда меньше»
    const poisonPile = man.poisonPile != null && man.poisonPile !== ''
      ? (+man.poisonPile || 0)
      : (dutyPoison != null && (dutyPoison > 0 || isDutyActive()) ? dutyPoison : poisonScan);
    const woundsPile = man.woundsPile != null && man.woundsPile !== ''
      ? (+man.woundsPile || 0)
      : (dutyWounds != null && (dutyWounds > 0 || isDutyActive()) ? dutyWounds : woundsScan);

    const inPoison = man.inPoison != null && man.inPoison !== ''
      ? (+man.inPoison || 0) : inPoisonScan;
    const inWounds = man.inWounds != null && man.inWounds !== ''
      ? (+man.inWounds || 0) : inWoundsScan;

    return {
      inPoison: inPoison,
      inWounds: inWounds,
      poisonPile: poisonPile,
      woundsPile: woundsPile,
      inMouth: inMouth,
      onField: onField,
      totalKnown: inPoison + inWounds + inMouth,
      source: (man.poisonPile != null || man.woundsPile != null) ? 'manual'
        : ((dutyPoison > 0 || dutyWounds > 0 || isDutyActive()) ? 'duty' : 'scan'),
      dutyPoison: dutyPoison,
      dutyWounds: dutyWounds,
      poisonScan: poisonScan,
      woundsScan: woundsScan
    };
  }

  function nettleAdvice() {
    const c = countNettleEverywhere();
    // по памятке: кладём в ту кучу, где трав меньше
    let where = 'poison';
    let label = '→ куча Отравление (там меньше: ' + c.poisonPile + ' < ' + c.woundsPile + ')';
    if (c.woundsPile < c.poisonPile) {
      where = 'wounds';
      label = '→ куча Раны (там меньше: ' + c.woundsPile + ' < ' + c.poisonPile + ')';
    } else if (c.woundsPile === c.poisonPile) {
      where = 'either';
      label = '→ любая куча (поровну: отрав. ' + c.poisonPile + ' / раны ' + c.woundsPile + ')';
    }
    return Object.assign({}, c, { where: where, label: label });
  }

  function sortCategoryForHerb(h) {
    if (!h) return null;
    // Крапива — особое правило из памятки
    if (h.name === 'Крапива') {
      try {
        const a = nettleAdvice();
        return { key: a.where === 'wounds' ? 'wounds' : 'poison', label: a.label, nettle: a };
      } catch (e) {
        return { key: 'poison', label: '→ Отравление или Раны (куда меньше)' };
      }
    }
    const t = (h.treats || []).join(' ').toLowerCase();
    if (/кашл/i.test(t)) return { key: 'cough', label: '→ куча Кашель' };
    if (/отрав/i.test(t)) return { key: 'poison', label: '→ куча Отравление' };
    if (/ран|пу|кровот/i.test(t)) return { key: 'wounds', label: '→ куча Раны' };
    if (/гряз|блох/i.test(t) || /желчью/i.test(h.name)) return { key: 'bile', label: '→ Мох с желчью' };
    if (/паутин/i.test(h.name)) return { key: 'web', label: '→ Паутина (сверху)' };
    if (/мох/i.test(h.name) && !/желч/i.test(h.name)) return { key: 'moss', label: '→ Мох' };
    if (/ветк/i.test(h.name)) return { key: 'branches', label: '→ Веточки' };
    if (/вьюн/i.test(h.name)) return { key: 'vine', label: '→ Вьюнки' };
    if (/костоправ/i.test(h.name)) return { key: 'kost', label: '→ Костоправы' };
    return null;
  }


  // Для анимации костоправа: компоненты и результат
  const KOST_CYCLE = {
    // чередование двух рецептов
    recipes: [
      {
        name: 'вьюнковый',
        // 2 ветки + вьюнок  ИЛИ  2 ветки + плотная водоросль
        comps: [
          { name: 'Крепкая ветка', src: 'https://i.ibb.co/qLWWY3ZZ/image.webp' },
          { name: 'Крепкая ветка', src: 'https://i.ibb.co/qLWWY3ZZ/image.webp' },
          { name: 'Вьюнок', src: 'https://i.ibb.co/8DZjS3Sf/566.webp' },
        ],
        altComp: { name: 'Плотная водоросль', src: 'https://i.ibb.co/M5pwf6fg/image.webp' },
        result: { name: 'Костоправ (вьюнковый)', src: 'https://i.ibb.co/j9VJLSJc/image.webp' }
      },
      {
        name: 'паутинный',
        comps: [
          { name: 'Крепкая ветка', src: 'https://i.ibb.co/qLWWY3ZZ/image.webp' },
          { name: 'Паутина', src: 'https://i.ibb.co/cK6kntmj/image.webp' },
        ],
        result: { name: 'Костоправ (паутинный)', src: 'https://i.ibb.co/JRYWffjL/2.webp' }
      }
    ]
  };

  // Модели котов + оверлеи травм (уже с прозрачностью / поверх базы)
  const CAT_MODELS = {
    adult: 'https://i.ibb.co/5WrhYyWB/image.png',
    kitten: 'https://i.ibb.co/CKwh4xfF/image.png'
  };
  const OVERLAYS = {
    dirt: {
      adult: [
        'https://i.ibb.co/PGs9GSnr/1.webp',
        'https://i.ibb.co/zVbrJTPf/2.webp',
        'https://i.ibb.co/zwmkFGZ/3.webp',
        'https://i.ibb.co/Q7TF2BCH/4.webp'
      ],
      kitten: [
        'https://i.ibb.co/nsrjtwDS/1.webp',
        'https://i.ibb.co/5g0s5Bpy/2.webp',
        'https://i.ibb.co/ksPnyJQ3/3.webp',
        'https://i.ibb.co/R4t1NcbF/4.webp'
      ]
    },
    cough: {
      adult: ['https://i.ibb.co/YTW0Vmt2/image.webp'],
      kitten: ['https://i.ibb.co/cPL74WZ/image.webp']
    },
    poison: {
      adult: ['https://i.ibb.co/Y4c27QT8/image.webp'],
      kitten: ['https://i.ibb.co/vCfcKZXg/image.webp']
    },
    fracture: {
      adult: [
        'https://i.ibb.co/Dgb1Dyw8/1.webp',
        'https://i.ibb.co/mrhhGy4X/2.webp',
        'https://i.ibb.co/ZwdJdH2/3.webp',
        'https://i.ibb.co/H6SbBhG/4.webp'
      ],
      kitten: [
        'https://i.ibb.co/NgxNQV34/1.webp',
        'https://i.ibb.co/Xxts8w4V/2.webp',
        'https://i.ibb.co/FLSYSkJn/3.webp',
        'https://i.ibb.co/cSjwTscy/4.webp'
      ]
    },
    wounds: {  // id болезни 'wounds'

      adult: [
        'https://i.ibb.co/sv71HYbM/1.webp',
        'https://i.ibb.co/xqzHNqTx/2.webp',
        'https://i.ibb.co/27V5gXcv/3.webp',
        'https://i.ibb.co/wNJNv2DH/4.webp'
      ],
      kitten: [
        'https://i.ibb.co/wFQwYBpm/1.webp',
        'https://i.ibb.co/tTHKDjR5/2.webp',
        'https://i.ibb.co/Xfc95Cwz/3.webp',
        'https://i.ibb.co/wNgXWgLD/4.webp'
      ]
    },
    drown: {
      adult: [
        'https://i.ibb.co/RpSX2DkW/1.webp',
        'https://i.ibb.co/ynCc8PxT/2.webp',
        'https://i.ibb.co/SDxXtp09/3.webp',
        'https://i.ibb.co/Jw79pTXq/4.webp'
      ],
      kitten: [
        'https://i.ibb.co/21bsbfKt/1.webp',
        'https://i.ibb.co/YTbySz63/2.webp',
        'https://i.ibb.co/pvknTr7S/3.webp',
        'https://i.ibb.co/0yHpRK41/4.webp'
      ]
    },
    bruise: {
      // ушибы — визуально как лёгкие переломы/поза; используем 1 ст перелома
      adult: ['https://i.ibb.co/Dgb1Dyw8/1.webp'],
      kitten: ['https://i.ibb.co/NgxNQV34/1.webp']
    }
  };


  /** Блок превью кота+травмы для любой вкладки */
  function catPreviewBlock(diseaseId, opts) {
    opts = opts || {};
    const age = opts.age || GM_getValue('cwh_cat_age', 'adult');
    const hp = opts.hp != null ? opts.hp : null;
    const ov = OVERLAYS[diseaseId];
    if (!ov && !(hp != null && (hp <= 0 || hp >= 100))) {
      return '<div class="cwh-note">Нет модели для этого типа</div>';
    }
    const stages = ov ? (ov.adult || []).length : 0;
    const st = opts.stage || 1;
    let html = '<div class="cwh-cat-preview" data-did="' + diseaseId + '" data-hp="' + (hp != null ? hp : '') + '">'
      + '<div class="cwh-age-btns">'
      + '<button type="button" data-age="adult" class="' + (age==='adult'?'on':'') + '">Взрослый (≥4л)</button>'
      + '<button type="button" data-age="kitten" class="' + (age==='kitten'?'on':'') + '">Котёнок (&lt;4л)</button>'
      + '</div>'
      + '<div class="cwh-cat-view">' + catPreviewHtml(diseaseId, st, age, hp) + '</div>';
    if (stages > 1 && !(hp != null && (hp <= 0 || hp >= 100))) {
      html += '<div class="cwh-stage-btns">';
      for (let i = 1; i <= stages; i++) {
        html += '<button type="button" data-st="' + i + '" class="' + (i===st?'on':'') + '">' + i + ' ст</button>';
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }
  function bindCatPreview(root) {
    if (!root) return;
    root.querySelectorAll('.cwh-cat-preview').forEach(box => {
      const did = box.dataset.did;
      let curAge = GM_getValue('cwh_cat_age', 'adult');
      let curSt = 1;
      const onBtn = box.querySelector('.cwh-stage-btns button.on');
      if (onBtn) curSt = +onBtn.dataset.st || 1;
      const view = box.querySelector('.cwh-cat-view');
      function redraw() {
        const hpAttr = box.dataset.hp;
        const hp = hpAttr === '' || hpAttr == null ? null : +hpAttr;
        if (view) view.innerHTML = catPreviewHtml(did, curSt, curAge, hp);
      }
      box.querySelectorAll('.cwh-age-btns button').forEach(btn => {
        btn.onclick = () => {
          curAge = btn.dataset.age;
          GM_setValue('cwh_cat_age', curAge);
          box.querySelectorAll('.cwh-age-btns button').forEach(b => b.classList.toggle('on', b === btn));
          curSt = 1;
          const stBox = box.querySelector('.cwh-stage-btns');
          if (stBox) stBox.querySelectorAll('button').forEach((b, i) => b.classList.toggle('on', i === 0));
          redraw();
        };
      });
      box.querySelectorAll('.cwh-stage-btns button').forEach(btn => {
        btn.onclick = () => {
          curSt = +btn.dataset.st;
          box.querySelectorAll('.cwh-stage-btns button').forEach(b => b.classList.toggle('on', b === btn));
          redraw();
        };
      });
    });
  }
  /** тип калькулятора → id оверлея */
  function calcTypeToDisease(type) {
    if (type === 'wound') return 'wounds';
    if (type === 'poison') return 'poison';
    if (type === 'dirt') return 'dirt';
    if (type === 'cough') return 'cough';
    return 'wounds';
  }

  function catPreviewHtml(diseaseId, stage, age, hp) {
    const base = age === 'kitten' ? CAT_MODELS.kitten : CAT_MODELS.adult;
    const h = age === 'kitten' ? 140 : 180;
    // 100% — здоровая модель без оверлея
    if (hp != null && hp >= 100) {
      return '<div class="cwh-cat-stage" style="height:' + h + 'px">'
        + '<img class="base" src="' + base + '" alt="кот" style="height:' + h + 'px">'
        + '</div>'
        + '<div class="cwh-cat-label" style="color:#9fd66c">Здоров (100%)</div>';
    }
    // 0% — мёртв
    if (hp != null && hp <= 0) {
      return '<div class="cwh-cat-stage" style="height:' + h + 'px;opacity:.45;filter:grayscale(1)">'
        + '<img class="base" src="' + base + '" alt="кот" style="height:' + h + 'px">'
        + '</div>'
        + '<div class="cwh-cat-label" style="color:#e88">Мёртв (0% HP)</div>';
    }
    const ovMap = OVERLAYS[diseaseId];
    if (!ovMap) {
      return '<div class="cwh-cat-stage" style="height:' + h + 'px">'
        + '<img class="base" src="' + base + '" alt="кот" style="height:' + h + 'px">'
        + '</div>';
    }
    const list = ovMap[age] || ovMap.adult || [];
    const st = Math.max(0, Math.min(list.length - 1, (stage || 1) - 1));
    const ov = list[st] || list[0];
    return '<div class="cwh-cat-stage" style="height:' + h + 'px">'
      + '<img class="base" src="' + base + '" alt="кот" style="height:' + h + 'px">'
      + (ov ? '<img class="overlay" src="' + ov + '" alt="травма" style="height:' + h + 'px">' : '')
      + '</div>';
  }



  const KOST_VINE = IMG['Костоправ'];
  const KOST_SPIDER = IMG['Костоправ2'];
  const CAT_KITTEN = 'https://i.ibb.co/CKwh4xfF/image.png';
  const CAT_ADULT  = 'https://i.ibb.co/5WrhYyWB/image.png';
  // оверлеи травм (абстрактные спрайты стадий) — приближённо 1..4
  const OVERLAY = {
    wound: [
      'https://i.ibb.co/yFVrMd68/3F3F-1.jpg',
      'https://i.ibb.co/JLrY4tN/3F3F-2.jpg',
      'https://i.ibb.co/0VdDN3Rb/3F3F-3.jpg',
      'https://i.ibb.co/Kx4mMW3f/3F3F-4.jpg'
    ],
    fracture: [
      'https://i.ibb.co/zH5kKKc0/3F3F3F3F.jpg',
      'https://i.ibb.co/mr1ZL5q2/3-F3-F3-F3-F-2.jpg',
      'https://i.ibb.co/QvCnT3pk/3-F3-F3-F3-F-16.jpg',
      'https://i.ibb.co/YBF87HZK/3-F3-F3-F3-F-26.jpg'
    ],
    poison: 'https://i.ibb.co/dsR1kXLK/image.jpg',
    cough: 'https://i.ibb.co/dwR0pZCC/3.jpg',
    dirt: [
      'https://i.ibb.co/N2mcXBdb/3-F3-F3-F3-F1.jpg',
      'https://i.ibb.co/8RkdxMM/3-F3-F3-F3-F2.jpg',
      'https://i.ibb.co/0VrJyX82/3-F3-F3-F3-F3.jpg',
      'https://i.ibb.co/kgFyJ3Gz/3-F3-F3-F3-F3-F-4.jpg'
    ]
  };


  function icon(name, size = 64) {
    const base = String(name || '').replace(/\s*\([^)]*\)\s*$/, '').trim();
    const src = IMG[name] || IMG[base] || IMG[(name || '').replace(/ё/g, 'е')] || IMG[base.replace(/ё/g, 'е')] || '';
    if (!src) return '';
    const cycle = (base === 'Целебная водоросль' || name === 'Целебная водоросль') ? ' cwh-cycle-algae' : '';
    return `<img class="cwh-icon${cycle}" src="${src}" alt="${base || name}" data-full="${src}" style="width:${size}px;height:${size}px;object-fit:contain;border-radius:8px;vertical-align:middle;margin-right:8px;background:rgba(0,0,0,.35);cursor:zoom-in;">`;
  }

  /* ========================================================================
     ДАННЫЕ
     ======================================================================== */

  // % за 1 дозу при ранах/ПУ от уровня ЦУ (0–9). При необходимости поправь.
  const CU_PCT = [10, 14, 18, 22, 26, 30, 34, 38, 42, 46];

  // Луны → примерный рост модельки (из памятки)
  const MOONS_GROWTH = {
    0: 45, 1: 47, 2: 50, 3: 52, 4: 55, 5: 60, 6: 65, 7: 66, 8: 68, 9: 70, 10: 71,
    // дальше по скринам: ~80% около 35л, 86% ~65–72, 88% ~95–109, 90% ~125–139, 91% ~140–154,
    // 92% ~155–169, 93% ~170–199, 94% ~183–199, 95% ~200–209, 96% ~210–219, 97% ~220–229,
    // 98% ~230–244, 99% ~245–249, 100% = 250
  };

  function growthByMoons(m) {
    if (MOONS_GROWTH[m] != null) return MOONS_GROWTH[m];
    if (m <= 10) return 45 + m * 2.6;
    if (m < 35) return 71 + (m - 10) * 0.36;
    if (m < 65) return 80 + (m - 35) * 0.2;
    if (m < 95) return 86 + (m - 65) * 0.07;
    if (m < 125) return 88 + (m - 95) * 0.067;
    if (m < 155) return 90 + (m - 125) * 0.033;
    if (m < 200) return 92 + (m - 155) * 0.044;
    if (m < 220) return 95 + (m - 200) * 0.05;
    if (m < 245) return 97 + (m - 220) * 0.04;
    if (m < 250) return 99;
    return 100;
  }

  function maxKostoprav(moons) {
    if (moons >= 200) return 5;
    if (moons >= 50) return 4;
    if (moons >= 12) return 3;
    if (moons >= 6) return 2;
    return 1;
  }

  // Хил-доля за 1 вьюнковый костоправ; столбец i → (i+1)*6 часов. Из https://reireirei72.github.io/extrastuff/bonesetter/
  const KOST_TABLE = {
    5: [0.21, 0.49, 0.83, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    6: [0.01, 0.31, 0.52, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    7: [0.0, 0.23, 0.45, 0.59, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    8: [0.0, 0.16, 0.37, 0.53, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    9: [0.0, 0.08, 0.3, 0.48, 0.56, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    10: [0.0, 0.03, 0.23, 0.4, 0.52, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    11: [0.0, 0.0, 0.17, 0.35, 0.48, 0.56, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    12: [0.0, 0.0, 0.1, 0.28, 0.46, 0.52, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    13: [0.0, 0.0, 0.1, 0.27, 0.44, 0.52, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    14: [0.0, 0.0, 0.09, 0.27, 0.41, 0.51, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    15: [0.0, 0.0, 0.09, 0.26, 0.4, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    16: [0.0, 0.0, 0.09, 0.26, 0.38, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    17: [0.0, 0.0, 0.09, 0.26, 0.38, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    18: [0.0, 0.0, 0.08, 0.25, 0.38, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    19: [0.0, 0.0, 0.08, 0.25, 0.38, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    20: [0.0, 0.0, 0.03, 0.21, 0.36, 0.47, 0.55, 0.5, 0.5, 0.5, 0.5, 0.5],
    21: [0.0, 0.0, null, 0.21, null, 0.46, null, 0.5, 0.5, 0.5, 0.5, 0.5],
    22: [0.0, 0.0, null, 0.2, null, 0.45, 0.55, 0.5, 0.5, 0.5, 0.5, 0.5],
    23: [0.0, 0.0, 0.02, 0.2, 0.34, 0.45, 0.54, 0.5, 0.5, 0.5, 0.5, 0.5],
    24: [0.0, 0.0, 0.0, null, null, null, null, 0.5, 0.5, 0.5, 0.5, 0.5],
    25: [0.0, 0.0, 0.0, 0.18, 0.34, 0.43, null, 0.5, 0.5, 0.5, 0.5, 0.5],
    26: [0.0, 0.0, 0.0, 0.18, null, 0.43, null, 0.5, 0.5, 0.5, 0.5, 0.5],
    27: [0.0, 0.0, 0.0, 0.18, 0.32, 0.43, null, 0.5, 0.5, 0.5, 0.5, 0.5],
    28: [0.0, 0.0, 0.0, 0.12, 0.3, 0.43, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    29: [0.0, 0.0, 0.0, 0.12, 0.28, 0.43, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    30: [0.0, 0.0, 0.0, 0.12, null, null, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    31: [0.0, 0.0, 0.0, 0.12, null, 0.4, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    32: [0.0, 0.0, 0.0, 0.11, 0.26, 0.4, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    33: [0.0, 0.0, 0.0, 0.1, 0.26, 0.4, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    34: [0.0, 0.0, 0.0, 0.1, null, null, null, 0.56, 0.5, 0.5, 0.5, 0.5],
    35: [0.0, 0.0, 0.0, null, 0.24, null, null, null, 0.5, 0.5, 0.5, 0.5],
    36: [0.0, 0.0, 0.0, null, null, null, null, null, 0.5, 0.5, 0.5, 0.5],
    37: [0.0, 0.0, 0.0, 0.05, 0.22, 0.39, 0.46, 0.52, 0.5, 0.5, 0.5, 0.5],
    38: [0.0, 0.0, 0.0, null, null, null, null, null, 0.5, 0.5, 0.5, 0.5],
    39: [0.0, 0.0, 0.0, 0.04, null, 0.35, 0.45, null, 0.5, 0.5, 0.5, 0.5],
    40: [0.0, 0.0, 0.0, 0.03, null, null, 0.45, null, 0.5, 0.5, 0.5, 0.5],
    41: [0.0, 0.0, 0.0, 0.03, null, null, 0.45, null, 0.5, 0.5, 0.5, 0.5],
    42: [0.0, 0.0, 0.0, 0.03, 0.18, 0.32, null, null, 0.5, 0.5, 0.5, 0.5],
    43: [0.0, 0.0, 0.0, 0.03, 0.18, 0.3, null, null, 0.5, 0.5, 0.5, 0.5],
    44: [0.0, 0.0, 0.0, 0.02, 0.16, 0.3, 0.42, 0.51, 0.5, 0.5, 0.5, 0.5],
    45: [0.0, 0.0, 0.0, 0.0, 0.16, 0.3, null, 0.5, 0.5, 0.5, 0.5, 0.5],
    46: [0.0, 0.0, 0.0, 0.0, 0.16, null, null, null, null, 0.5, 0.5, 0.5],
    47: [0.0, 0.0, 0.0, 0.0, 0.16, 0.27, 0.4, null, null, 0.5, 0.5, 0.5],
    48: [0.0, 0.0, 0.0, 0.0, null, 0.27, 0.38, null, null, 0.5, 0.5, 0.5],
    49: [0.0, 0.0, 0.0, 0.0, null, 0.27, null, null, null, 0.5, 0.5, 0.5],
    50: [0.0, 0.0, 0.0, 0.0, null, 0.27, 0.37, 0.48, 0.53, 0.5, 0.5, 0.5],
    51: [0.0, 0.0, 0.0, 0.0, 0.14, 0.27, null, null, null, 0.5, 0.5, 0.5],
    52: [0.0, 0.0, 0.0, 0.0, null, null, null, null, null, 0.5, 0.5, 0.5],
    53: [0.0, 0.0, 0.0, 0.0, null, null, null, null, null, 0.5, 0.5, 0.5],
    54: [0.0, 0.0, 0.0, 0.0, null, null, null, null, null, 0.5, 0.5, 0.5],
    55: [0.0, 0.0, 0.0, 0.0, null, null, null, null, null, 0.5, 0.5, 0.5],
    56: [0.0, 0.0, 0.0, 0.0, 0.1, 0.25, null, null, null, 0.5, 0.5, 0.5],
    57: [0.0, 0.0, 0.0, 0.0, 0.1, null, 0.36, null, null, 0.5, 0.5, 0.5],
    58: [0.0, 0.0, 0.0, 0.0, 0.1, null, 0.36, null, null, 0.5, 0.5, 0.5],
    59: [0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, 0.5, 0.5, 0.5],
    60: [0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, 0.52, 0.5, 0.5, 0.5],
    61: [0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, 0.5, 0.5, 0.5],
    62: [0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, 0.5, 0.5, 0.5],
    63: [0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, 0.5, 0.5, 0.5],
    64: [0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, 0.5, 0.5, 0.5],
    65: [0.0, 0.0, 0.0, 0.0, 0.08, null, null, null, null, 0.5, 0.5, 0.5],
    66: [0.0, 0.0, 0.0, 0.0, 0.08, null, null, null, null, 0.5, 0.5, 0.5],
    67: [0.0, 0.0, 0.0, 0.0, 0.08, null, null, null, null, 0.5, 0.5, 0.5],
    68: [0.0, 0.0, 0.0, 0.0, 0.08, null, null, null, null, 0.5, 0.5, 0.5],
    69: [0.0, 0.0, 0.0, 0.0, 0.06, 0.23, 0.34, null, null, 0.5, 0.5, 0.5],
    70: [0.0, 0.0, 0.0, 0.0, 0.06, 0.23, 0.34, 0.46, 0.5, 0.5, 0.5, 0.5],
    71: [0.0, 0.0, 0.0, 0.0, 0.06, 0.23, 0.34, 0.46, 0.5, 0.5, 0.5, 0.5],
    72: [0.0, 0.0, 0.0, 0.0, 0.06, 0.23, 0.34, 0.46, 0.5, 0.5, 0.5, 0.5],
    73: [0.0, 0.0, 0.0, 0.0, 0.06, 0.23, 0.34, 0.46, 0.5, 0.5, 0.5, 0.5],
    74: [0.0, 0.0, 0.0, 0.0, 0.06, 0.23, 0.34, 0.46, 0.5, 0.5, 0.5, 0.5],
    75: [0.0, 0.0, 0.0, 0.0, 0.06, 0.23, 0.34, 0.46, 0.49, 0.54, 0.5, 0.5],
    76: [0.0, 0.0, 0.0, 0.0, 0.06, 0.23, 0.34, 0.46, 0.49, 0.54, 0.5, 0.5],
    77: [0.0, 0.0, 0.0, 0.0, 0.06, 0.23, 0.34, 0.46, 0.49, 0.54, 0.5, 0.5],
    78: [0.0, 0.0, 0.0, 0.0, 0.06, 0.23, 0.34, 0.46, 0.49, 0.54, 0.5, 0.5],
    79: [0.0, 0.0, 0.0, 0.0, 0.06, 0.23, 0.32, 0.46, 0.49, 0.54, 0.5, 0.5],
    80: [0.0, 0.0, 0.0, 0.0, 0.05, 0.19, null, 0.46, 0.49, 0.54, 0.5, 0.5],
    81: [0.0, 0.0, 0.0, 0.0, 0.05, 0.19, null, 0.46, 0.49, 0.54, 0.5, 0.5],
    82: [0.0, 0.0, 0.0, 0.0, 0.05, 0.19, null, 0.46, null, 0.54, 0.5, 0.5],
    83: [0.0, 0.0, 0.0, 0.0, 0.05, 0.19, null, 0.46, null, 0.54, 0.5, 0.5],
    84: [0.0, 0.0, 0.0, 0.0, 0.05, 0.19, null, 0.46, null, 0.54, 0.5, 0.5],
    85: [0.0, 0.0, 0.0, 0.0, 0.05, 0.19, null, 0.46, null, 0.54, 0.5, 0.5],
    86: [0.0, 0.0, 0.0, 0.0, 0.05, 0.19, null, 0.46, null, 0.54, 0.5, 0.5],
    87: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, null, null, null, 0.54, 0.5, 0.5],
    88: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, null, null, null, 0.54, 0.5, 0.5],
    89: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, 0.31, 0.41, 0.48, 0.54, 0.5, 0.5],
    90: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, 0.31, 0.41, null, 0.54, 0.5, 0.5],
    91: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, 0.31, 0.41, null, 0.54, 0.5, 0.5],
    92: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, 0.31, 0.41, null, null, 0.5, 0.5],
    93: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, 0.31, 0.41, null, null, 0.5, 0.5],
    94: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, 0.31, 0.41, null, null, 0.5, 0.5],
    95: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, 0.31, 0.41, null, null, 0.5, 0.5],
    96: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, 0.31, null, null, null, 0.5, 0.5],
    97: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, 0.31, null, null, null, 0.5, 0.5],
    98: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, 0.31, null, null, null, 0.5, 0.5],
    99: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, 0.31, null, null, null, 0.5, 0.5],
    100: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, null, null, null, null, 0.5, 0.5],
    101: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, null, null, null, null, 0.5, 0.5],
    102: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, null, null, null, null, 0.5, 0.5],
    103: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, null, null, null, null, 0.5, 0.5],
    104: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, null, null, null, null, 0.5, 0.5],
    105: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, null, null, null, null, 0.5, 0.5],
    106: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, null, null, null, null, 0.5, 0.5],
    107: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, null, null, null, null, 0.5, 0.5],
    108: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, 0.3, null, 0.46, null, 0.5, 0.5],
    109: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, null, null, null, null, 0.5, 0.5],
    110: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, null, null, null, null, 0.5, 0.5],
    111: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, null, null, null, null, 0.5, 0.5],
    112: [0.0, 0.0, 0.0, 0.0, 0.03, 0.19, null, null, null, null, 0.5, 0.5],
    113: [0.0, 0.0, 0.0, 0.0, 0.03, 0.14, null, 0.38, null, null, 0.5, 0.5],
    114: [0.0, 0.0, 0.0, 0.0, 0.03, 0.14, null, null, null, 0.52, 0.5, 0.5],
    115: [0.0, 0.0, 0.0, 0.0, 0.02, null, 0.24, null, 0.46, null, 0.5, 0.5],
    116: [0.0, 0.0, 0.0, 0.0, 0.02, null, 0.24, null, null, null, 0.5, 0.5],
    117: [0.0, 0.0, 0.0, 0.0, 0.02, null, 0.24, null, null, null, 0.5, 0.5],
    118: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, 0.24, null, null, null, 0.5, 0.5],
    119: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, 0.24, null, null, null, 0.5, 0.5],
    120: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, 0.24, 0.37, null, null, 0.5, 0.5],
    121: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, 0.24, null, null, null, 0.5, 0.5],
    122: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, 0.24, null, null, null, 0.5, 0.5],
    123: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, 0.24, null, null, null, 0.5, 0.5],
    124: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, 0.24, null, null, null, 0.5, 0.5],
    125: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, 0.24, null, null, null, 0.5, 0.5],
    126: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, 0.24, null, null, null, 0.5, 0.5],
    127: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, 0.24, null, null, null, 0.5, 0.5],
    128: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, 0.24, 0.36, 0.45, 0.5, 0.5, 0.5],
    129: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    130: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    131: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    132: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    133: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    134: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    135: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    136: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    137: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, 0.24, null, null, 0.5, 0.5, 0.5],
    138: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    139: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    140: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    141: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, 0.43, 0.5, 0.5, 0.5],
    142: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    143: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    144: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    145: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    146: [0.0, 0.0, 0.0, 0.0, 0.02, 0.12, null, null, null, 0.5, 0.5, 0.5],
    147: [0.0, 0.0, 0.0, 0.0, 0.0, 0.12, null, null, null, 0.5, 0.5, 0.5],
    148: [0.0, 0.0, 0.0, 0.0, 0.0, 0.12, null, null, null, 0.5, 0.5, 0.5],
    149: [0.0, 0.0, 0.0, 0.0, 0.0, 0.12, null, 0.35, 0.42, 0.5, 0.5, 0.5],
    150: [0.0, 0.0, 0.0, 0.0, 0.0, null, null, null, null, null, null, 0.5],
    151: [0.0, 0.0, 0.0, 0.0, 0.0, null, null, null, null, null, null, 0.5],
    152: [0.0, 0.0, 0.0, 0.0, 0.0, null, 0.21, null, null, null, null, 0.5],
    153: [0.0, 0.0, 0.0, 0.0, 0.0, null, 0.21, null, null, null, null, 0.5],
    154: [0.0, 0.0, 0.0, 0.0, 0.0, null, 0.21, null, null, null, null, 0.5],
    155: [0.0, 0.0, 0.0, 0.0, 0.0, null, 0.21, null, null, null, null, 0.5],
    156: [0.0, 0.0, 0.0, 0.0, 0.0, null, 0.21, null, null, null, null, 0.5],
    157: [0.0, 0.0, 0.0, 0.0, 0.0, null, 0.21, null, null, null, null, 0.5],
    158: [0.0, 0.0, 0.0, 0.0, 0.0, null, 0.21, null, null, null, null, 0.5],
    159: [0.0, 0.0, 0.0, 0.0, 0.0, null, 0.21, null, null, null, null, 0.5],
    160: [0.0, 0.0, 0.0, 0.0, 0.0, 0.05, 0.21, null, null, null, null, 0.5],
    161: [0.0, 0.0, 0.0, 0.0, 0.0, 0.05, null, null, null, null, null, 0.5],
    162: [0.0, 0.0, 0.0, 0.0, 0.0, 0.05, null, null, null, null, null, 0.5],
    163: [0.0, 0.0, 0.0, 0.0, 0.0, 0.05, null, null, null, null, null, 0.5],
    164: [0.0, 0.0, 0.0, 0.0, 0.0, 0.05, null, null, null, null, null, 0.5],
    165: [0.0, 0.0, 0.0, 0.0, 0.0, 0.05, null, null, null, null, null, 0.5],
    166: [0.0, 0.0, 0.0, 0.0, 0.0, 0.05, null, null, 0.39, null, null, 0.5],
    167: [0.0, 0.0, 0.0, 0.0, 0.0, 0.05, null, null, null, null, null, 0.5],
    168: [0.0, 0.0, 0.0, 0.0, 0.0, 0.05, null, null, null, null, null, 0.5],
    169: [0.0, 0.0, 0.0, 0.0, 0.0, 0.05, null, null, null, null, null, 0.5],
    170: [0.0, 0.0, 0.0, 0.0, 0.0, 0.02, null, 0.32, null, null, null, 0.5],
    171: [0.0, 0.0, 0.0, 0.0, 0.0, 0.02, 0.17, null, null, null, null, 0.5],
    172: [0.0, 0.0, 0.0, 0.0, 0.0, 0.02, null, null, null, null, null, 0.5],
    173: [0.0, 0.0, 0.0, 0.0, 0.0, 0.02, null, null, null, null, null, 0.5],
    174: [0.0, 0.0, 0.0, 0.0, 0.0, 0.02, null, null, null, null, null, 0.5],
    175: [0.0, 0.0, 0.0, 0.0, 0.0, 0.02, null, null, null, null, null, 0.5],
    176: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, null, null, null, null, 0.5],
    177: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, null, null, null, null, 0.5],
    178: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, null, null, null, null, 0.5],
    179: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, null, null, null, null, 0.5],
    180: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, null, null, null, null, 0.5],
    181: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, null, 0.38, null, null, 0.5],
    182: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, null, null, null, null, 0.5],
    183: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, null, null, null, null, 0.5],
    184: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, null, null, 0.5],
    185: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, null, null, 0.5],
    186: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, null, null, 0.5],
    187: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, 0.48, 0.5, 0.5],
    188: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, null, 0.5, null],
    189: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, null, 0.5, null],
    190: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, null, 0.5, null],
    191: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, null, 0.5, null],
    192: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, null, 0.5, null],
    193: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, null, 0.5, null],
    194: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, null, 0.5, null],
    195: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, null, 0.5, null],
    196: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, null, 0.5, null],
    197: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, null, 0.5, null],
    198: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, null, 0.5, null],
    199: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, null, 0.5, null],
    200: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.14, null, null, 0.46, 0.5, 0.53],
    201: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.23, 0.33, 0.42, null, 0.53],
    202: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, 0.53],
    203: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, 0.53],
    204: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    205: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    206: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    207: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    208: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    209: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    210: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.2, null, null, null, null],
    211: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    212: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    213: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    214: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    215: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.19, 0.3, null, null, null],
    216: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, 0.3, null, null, null],
    217: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, 0.3, null, null, null],
    218: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, 0.3, null, null, null],
    219: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, 0.3, null, null, null],
    220: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, 0.3, null, null, null],
    221: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, 0.3, null, null, null],
    222: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, 0.3, null, null, null],
    223: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, 0.3, null, null, null],
    224: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, 0.3, null, null, null],
    225: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, 0.3, null, null, null],
    226: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, 0.3, null, null, null],
    227: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.17, 0.3, null, null, null],
    228: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.17, 0.3, null, null, null],
    229: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.17, 0.3, null, 0.44, null],
    230: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.17, 0.3, null, null, null],
    231: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.17, 0.3, null, null, null],
    232: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.17, 0.3, null, null, null],
    233: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    234: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    235: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    236: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    237: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    238: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    239: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    240: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.15, 0.24, null, null, null],
    241: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    242: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    243: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null, null],
    244: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, null, null, null, null, null],
    245: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, null, null, null, null, null],
    246: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, null, null, null, null, null],
    247: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, null, null, null, null, null],
    248: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, null, null, null, null, null],
    249: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, null, null, null, null, null],
    250: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    251: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    252: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    253: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    254: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    255: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    256: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    257: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    258: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    259: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    260: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    261: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    262: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    263: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    264: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    265: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    266: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    267: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    268: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    269: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, 0.23, null, 0.43, null],
    270: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, 0.39, null, null],
    271: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, 0.34, null, null],
    272: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, 0.5],
    273: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    274: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, null, 0.1, null, null, null, null],
    275: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, null, null, null, null],
  };

  /** Доля хила (0..1) за 1 вьюнковый костоправ при age лун и hours часов */
  function kostHealFraction(moons, hours) {
    let age = Math.round(+moons || 0);
    if (age < 5) age = 5;
    if (age > 275) age = 275;
    let row = KOST_TABLE[age];
    if (!row) {
      // ближайший ключ
      const keys = Object.keys(KOST_TABLE).map(Number).sort((a,b)=>a-b);
      let best = keys[0];
      for (const k of keys) { if (Math.abs(k - age) < Math.abs(best - age)) best = k; }
      row = KOST_TABLE[best].slice();
      age = best;
    } else {
      row = row.slice();
    }
    // заполняем null из старших возрастов (как в референсе)
    for (let i = 0; i < row.length; i++) {
      if (row[i] == null) {
        for (let k = 1; k < 270; k++) {
          const check = KOST_TABLE[age + k];
          if (check && check[i] != null) { row[i] = check[i]; break; }
        }
      }
    }
    // столбцы: i → (i+1)*6 часов
    const h = Math.max(1, +hours || 6);
    // индекс: hours/6 - 1
    let idx = Math.round(h / 6) - 1;
    if (idx < 0) idx = 0;
    if (idx >= row.length) idx = row.length - 1;
    // линейная интерполяция между соседними, если hours не кратно 6
    const lo = Math.floor(h / 6) - 1;
    const hi = lo + 1;
    const fracLo = (lo >= 0 && lo < row.length && row[lo] != null) ? row[lo] : null;
    const fracHi = (hi >= 0 && hi < row.length && row[hi] != null) ? row[hi] : null;
    if (fracLo != null && fracHi != null && h % 6 !== 0) {
      const t = (h - (lo + 1) * 6) / 6;
      return fracLo + (fracHi - fracLo) * Math.max(0, Math.min(1, t));
    }
    const v = row[idx];
    return v != null ? v : 0;
  }


  function fractureDegree(hp) {
    if (hp >= 90) return { deg: 0, name: 'Ушибы (часто сами)' };
    if (hp >= 75) return { deg: 1, name: '1 степень' };
    if (hp >= 50) return { deg: 2, name: '2 степень' };
    if (hp >= 25) return { deg: 3, name: '3 степень' };
    return { deg: 4, name: '4 степень' };
  }

  const HERBS = [
    { name: 'Мёд', id: 110, treats: ['кашель'], fixedPct: 3, note: 'Кашель. Есть как дичь, не жевать/делить', prep: 'рецепт отсутствует — есть как есть', recipe: 'есть как дичь' },
    { name: 'Пижма', id: 115, treats: ['кашель'], fixedPct: 5, note: 'Кашель', prep: 'разделить на стебель', recipe: 'целую → разделить → стебель' },
    { name: 'Кошачья мята', id: 13, treats: ['кашель'], fixedPct: 10, note: 'Кашель (в смеси ×2)', prep: 'разделить на листья', recipe: 'целую → разделить → листья' },
    { name: 'Бурачник', id: 23, treats: ['кашель'], fixedPct: 5, note: 'Кашель', prep: 'разделить на листья', recipe: 'целый → разделить → листья' },
    { name: 'Мать-и-мачеха', id: 26, treats: ['кашель'], fixedPct: 5, note: 'Кашель, основа смеси', prep: 'разделить на листья и разжевать', recipe: 'целую → разделить → листья → разжевать' },
    { name: 'Мятлик', id: 109, treats: ['отравление'], fixedPct: 5, note: 'Отравление', prep: 'разделить на семена', recipe: 'целый → разделить → семена' },
    { name: 'Рябина', id: 116, treats: ['отравление'], fixedPct: 10, note: 'Отравление', prep: 'разделить на ягоды', recipe: 'целую → разделить → ягоды' },
    { name: 'Одуванчик', id: 112, treats: ['отравление'], fixedPct: 10, note: 'Отравление', prep: 'разделить на листья и разжевать', recipe: 'целый → разделить → листья → разжевать' },
    { name: 'Крапива', id: 17, treats: ['отравление', 'раны', 'переломы'], fixedPct: 10, note: 'Отравление 10% (семена). Раны/ПУ — от ЦУ', prep: 'отравление: семена; раны: листья+разжевать', recipe: 'отрав.: разделить→семена | раны: разделить→листья→разжевать' },
    { name: 'Клевер', id: 106, treats: ['раны', 'переломы'], fixedPct: null, note: 'Раны / ПУ (от ЦУ)', prep: 'разделить на листья и разжевать', recipe: 'целый → разделить → листья → разжевать' },
    { name: 'Незабудка', id: 111, treats: ['раны', 'кровотечение', 'переломы'], fixedPct: null, note: 'Раны / кровотечение / ПУ (от ЦУ)', prep: 'разделить на листья и разжевать', recipe: 'целую → разделить → листья → разжевать' },
    { name: 'Тысячелистник', id: 25, treats: ['кровотечение'], fixedPct: null, note: 'Только кровотечение (−1 ед.), не раны', prep: 'разделить на листья и разжевать', recipe: 'целый → разделить → листья → разжевать' },
    { name: 'Паутина', id: 20, treats: ['раны', 'кровотечение', 'переломы'], fixedPct: null, note: 'Раны / ПУ (от ЦУ). Наложить действием', prep: 'наложить специальным действием', recipe: 'просто наложить' },
    { name: 'Шиповник', id: 119, treats: ['раны', 'переломы'], fixedPct: null, note: 'Раны / ПУ (от ЦУ)', prep: 'разделить на листья и разжевать', recipe: 'целый → разделить → листья → разжевать' },
    { name: 'Лопух', id: 108, treats: ['раны', 'переломы'], fixedPct: null, note: 'Раны / ПУ (от ЦУ)', prep: 'разделить на корень и разжевать', recipe: 'целый → разделить → корень → разжевать' },
    { name: 'Щавель', id: 19, treats: ['раны', 'переломы'], fixedPct: null, note: 'Раны / ПУ (от ЦУ)', prep: 'разделить на сок', recipe: 'целый → разделить → сок' },
    { name: 'Подорожник', id: 15, treats: ['раны', 'переломы'], fixedPct: null, note: 'Раны / ПУ (от ЦУ)', prep: 'разделить на листья и разжевать', recipe: 'целый → разделить → листья → разжевать' },
    { name: 'Мох', id: 75, treats: [], fixedPct: null, note: 'Только ресурс. Без мыши бесполезен — для лечения нужен мох с мышиной желчью', prep: 'наполнить желчью мыши', recipe: 'мох + мышь → мох с желчью' },
    { name: 'Наполненный мышиной желчью мох', id: 78, treats: ['грязь', 'блохи'], fixedPct: 2.66, note: 'Грязь / блохи. ЦУ 0 → 0%', prep: 'обычный мох (не водяной) + мышь', recipe: 'мох + мышь (дичь)' },
    { name: 'Костоправ', id: 562, treats: ['ушибы'], fixedPct: null, note: 'Ушибы (ЛУ). Накладывает больной сам. Не зависит от ЦУ', prep: 'вьюнковый или паутинный', recipe: 'вьюн: 2×ветка + вьюнок (или плотная водоросль) | паутин: 1×ветка + паутина' },
    { name: 'Крепкая ветка', id: 565, treats: [], fixedPct: null, note: 'Для костоправа', prep: 'компонент', recipe: '—' },
    { name: 'Календула', id: 16, treats: ['раны'], fixedPct: null, note: 'Раны', prep: 'как есть', recipe: '—' },
    { name: 'Лаванда', id: 104, treats: ['раны'], fixedPct: null, note: 'Раны', prep: 'как есть', recipe: '—' },
    { name: 'Ромашка', id: 24, treats: ['раны', 'кашель'], fixedPct: null, note: 'Универсальная', prep: 'как есть', recipe: '—' },
    { name: 'Целебная водоросль', id: 21, treats: ['отравление'], fixedPct: 10, note: 'Отравление. Разжевать → съесть', prep: 'разжевать → съесть', recipe: 'разжевать → съесть' },
  ];

  const DISEASES = [
    {
      id: 'cough', name: 'Кашель',
      causes: 'Холод, питьё из лужи в холод, офф вне спальных локаций при «смертельно холодно»',
      visual: 'Красная точка / пятна на коте (взрослый, спящий, котёнок)',
      treatments: ['Пижма', 'Мёд', 'Кошачья мята', 'Бурачник', 'Мать-и-мачеха', 'Смесь (см. калькулятор)'],
      notes: 'Фиксированный % за траву. Смесь сильнее отдельных. ЦУ почти не влияет.'
    },
    {
      id: 'poison', name: 'Отравление',
      causes: 'Плохая еда, падаль, кости, «смерть-ягоды», некоторые предметы с ныряния. Неразделённая трава −50% HP.',
      visual: 'Зелёный оттенок / зелёные пятна',
      treatments: ['Рябина', 'Одуванчик', 'Крапива', 'Мятлик', 'Целебная водоросль'],
      notes: 'Фиксированный % за траву. Водоросль: разжевать → съесть.'
    },
    {
      id: 'wounds', name: 'Раны',
      causes: 'Бои, царапины, укусы, животные при нырянии (1 стадия)',
      visual: 'Красные раны 1–4 стадии',
      treatments: ['Шиповник', 'Крапива', 'Лопух', 'Паутина', 'Клевер', 'Щавель', 'Незабудка', 'Тысячелистник', 'Подорожник', 'Календула', 'Ромашка'],
      notes: '% зависит от ЦУ. Действие «Наложить траву» (трава во рту).'
    },
    {
      id: 'fracture', name: 'Переломы (падение)',
      causes: 'Падение с лазательных локаций (дерево, скала и т.п.)',
      visual: 'Искажённая поза / «сломанные» узоры 1–4 ст.',
      treatments: ['Костоправ (вьюнковый или паутинный)'],
      notes: 'Костоправ НЕ хиляет переломы, полученные ВО ВРЕМЯ ношения. 1 ст. (ушибы) при малом уроне может пройти сама. Среднее ~½ луны (2 дня), мин 5 ч, макс 5 дней.'
    },

    {
      id: 'drown', name: 'Утопление',
      causes: 'Опасные воды при сне ≥45 мин / критический сон у воды; укусы существ со дна',
      visual: 'Порезы на теле, стадии 1–4 (ссадины → смертельные травмы)',
      treatments: ['Шиповник', 'Крапива', 'Лопух', 'Паутина', 'Клевер', 'Щавель', 'Незабудка', 'Подорожник', 'Травы как при ранах (от ЦУ)'],
      notes: 'Это НЕ переломы от падения: лечатся травами на раны/ПУ (наложить траву), а не костоправом. Чем больше порезов — тем меньше HP.'
    },
    {
      id: 'dirt', name: 'Грязь / блохи',
      causes: 'Копание (1–25 / 26–50 / 51–75 / 76+ действий → стадии 1–4)',
      visual: 'Коричневый оверлей на шерсти (стадии 1–4)',
      treatments: ['Наполненный мышиной желчью мох'],
      notes: '~2.66% чистоты за действие. На 100% ≈ 38 действий.'
    }
  ];

  const COUGH_MIX = [
    { name: 'Пижма', qty: 1 },
    { name: 'Мать-и-мачеха', qty: 1 },
    { name: 'Бурачник', qty: 1 },
    { name: 'Кошачья мята', qty: 2 }
  ];

  /* ========================================================================
     СТИЛИ
     ======================================================================== */
  const STYLE = `
    #cwh-widget * { box-sizing: border-box; margin: 0; padding: 0; }
    #cwh-widget {
      font: 12px/1.45 "Segoe UI", system-ui, -apple-system, sans-serif;
      background: linear-gradient(170deg, #1b1c1f 0%, #17181a 50%, #121316 100%);
      color: #d7dade;
      border: 1px solid rgba(150,155,162,.25);
      border-radius: 14px;
      box-shadow: 0 4px 24px rgba(0,0,0,.5);
      user-select: none;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      resize: both;
      min-width: 300px;
      min-height: 240px;
      width: 380px;
      height: 520px;
      backdrop-filter: blur(8px);
      z-index: 99999;
      position: fixed;
    }
    #cwh-widget .cwh-header {
      flex-shrink: 0; cursor: move;
      background: linear-gradient(180deg, rgba(150,155,162,.12), rgba(150,155,162,.04));
      padding: 6px 10px;
      display: flex; align-items: center; gap: 8px;
      font-weight: 600; font-size: 12px; letter-spacing: .4px; color: #a6adb5;
      border-bottom: 1px solid rgba(150,155,162,.12);
      border-radius: 14px 14px 0 0;
      min-height: 36px;
    }
    #cwh-widget .cwh-title {
      flex-shrink: 0;
      white-space: nowrap;
    }
    #cwh-widget .cwh-head-btns {
      display: flex; gap: 4px; flex-shrink: 0; margin-left: auto;
    }
    #cwh-widget .cwh-btn {
      cursor: pointer; width: 24px; height: 24px;
      display: inline-flex; align-items: center; justify-content: center;
      border-radius: 6px; opacity: .5; font-size: 14px; color: #a6adb5;
      transition: all .2s; background: transparent; border: none;
    }
    #cwh-widget .cwh-btn:hover { opacity: 1; background: rgba(255,255,255,.08); }

    /* --- свёрнутый виджет --- */
    #cwh-widget[data-collapsed="1"] {
      min-width: 300px !important;
      width: 360px !important;
      min-height: 0 !important;
      height: auto !important;
      max-height: none !important;
      resize: none !important;
      overflow: hidden !important;
    }
    #cwh-widget[data-collapsed="1"] .cwh-header {
      padding: 6px 10px;
      font-size: 11px;
      border-radius: 12px 12px 0 0;
    }
    #cwh-widget[data-collapsed="1"] .cwh-body { display: none !important; }
    #cwh-widget .cwh-title {
      flex-shrink: 0;
      white-space: nowrap;
      line-height: 1.2;
    }
    #cwh-widget .cwh-header-btns {
      display: flex;
      gap: 2px;
      flex-shrink: 0;
      align-self: center;
      margin-left: 0;
    }
    #cwh-widget .cwh-header-right {
      display: flex;
      align-items: center;
      gap: 2px;
      margin-left: 8px;
      min-width: 0;
      flex: 1 1 auto;
      justify-content: flex-end;
      width: 100%;
    }
    #cwh-widget .cwh-title {
      flex-shrink: 0;
      white-space: nowrap;
      line-height: 1.2;
    }
    #cwh-widget .cwh-header-btns {
      display: flex;
      gap: 2px;
      flex-shrink: 0;
      align-self: center;
      margin-left: 0;
    }
    /* лоза на всю ширину между «Целитель» и кнопками, тянется с окном */
    #cwh-widget .cwh-season-vine {
      display: block !important;
      flex: 1 1 auto;
      width: auto;
      min-width: 48px;
      max-width: none;
      height: 40px;
      overflow: hidden;
      pointer-events: none;
      line-height: 0;
      margin: 0 2px 0 0;
      padding: 0;
      opacity: 1;
      align-self: center;
    }
    #cwh-widget .cwh-season-vine svg {
      width: 100%;
      height: 100%;
      display: block;
      /* конец лозы у кнопки – */
      object-fit: contain;
      object-position: right center;
    }
    #cwh-widget[data-collapsed="1"] .cwh-season-vine {
      height: 38px;
    }
    #cwh-widget[data-collapsed="1"] .cwh-header {
      padding: 4px 8px 4px 10px;
      align-items: center;
      border-radius: 12px;
      border-bottom: none;
      min-height: 40px;
    }
    #cwh-widget[data-collapsed="1"].cwh-duty-on .cwh-header {
      border-radius: 12px 12px 0 0;
      border-bottom: 1px solid rgba(150,155,162,.1);
    }
    #cwh-widget .cwh-season-vine svg {
      width: 100%;
      height: 100%;
      display: block;
      /* конец лозы у кнопки – */
      object-fit: contain;
      object-position: right center;
    }
    #cwh-widget .cwh-duty-mini {
      display: none;
      flex-direction: column;
      gap: 6px;
      padding: 8px 10px 10px;
      background: rgba(0,0,0,.25);
      border-top: 1px solid rgba(127,174,92,.2);
    }
    #cwh-widget[data-collapsed="1"].cwh-duty-on .cwh-duty-mini { display: flex; }
    #cwh-widget .cwh-duty-mini-title {
      font-size: 10px;
      font-weight: 700;
      color: #9fd66c;
      letter-spacing: .3px;
      text-transform: uppercase;
    }
    #cwh-widget .cwh-duty-mini-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 11px;
      color: #c5cbd2;
      line-height: 1.35;
      cursor: pointer;
      user-select: none;
      padding: 4px 6px;
      margin: 0 -6px;
      border-radius: 6px;
      transition: background .15s;
    }
    #cwh-widget .cwh-duty-mini-item:hover {
      background: rgba(127,174,92,.12);
    }
    #cwh-widget .cwh-duty-mini-item.done { color: #6b7280; text-decoration: line-through; }
    #cwh-widget .cwh-duty-mini-item .mark {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      margin-top: 1px;
      border-radius: 4px;
      border: 1.5px solid rgba(150,155,162,.45);
      background: rgba(0,0,0,.25);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: #9ccc65;
      line-height: 1;
    }
    #cwh-widget .cwh-duty-mini-item.done .mark {
      border-color: rgba(127,174,92,.7);
      background: rgba(127,174,92,.18);
    }
    #cwh-widget .cwh-duty-mini-end {
      margin-top: 4px;
      width: 100%;
      padding: 7px 10px;
      border-radius: 8px;
      border: 1px solid rgba(232,160,96,.45);
      background: rgba(232,160,96,.12);
      color: #e8a060;
      font: 600 11px/1 "Segoe UI", system-ui, sans-serif;
      cursor: pointer;
    }
    #cwh-widget .cwh-duty-mini-end:hover { background: rgba(232,160,96,.22); }
    #cwh-widget .cwh-duty-mini-note {
      font-size: 10px;
      color: #e8a060;
      margin-top: 2px;
    }

    #cwh-widget .cwh-body {
      padding: 10px 12px; overflow-y: auto; flex: 1 1 auto; min-height: 0;
      scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
    }
    #cwh-widget .cwh-body::-webkit-scrollbar { width: 4px; }
    #cwh-widget .cwh-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }

    #cwh-widget .cwh-tabs {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 4px;
      margin-bottom: 10px;
      background: rgba(255,255,255,.03);
      border-radius: 10px;
      padding: 4px;
      width: 100%;
      box-sizing: border-box;
    }
    #cwh-widget .cwh-tab {
      flex: 1 1 auto;
      min-width: 64px;
      max-width: 100%;
      text-align: center;
      padding: 6px 8px;
      border-radius: 8px;
      background: transparent;
      border: 1px solid transparent;
      font-size: 10.5px;
      cursor: pointer;
      color: #8a9096;
      transition: all .25s;
      white-space: nowrap;
    }
    #cwh-widget .cwh-tab:hover { background: rgba(255,255,255,.06); }
    #cwh-widget .cwh-tab.active {
      border-color: #7fae5c; background: rgba(127,174,92,.15); color: #d7dade;
      box-shadow: 0 0 16px rgba(127,174,92,.1);
    }

    #cwh-widget .cwh-section-title {
      font-size: 10px; text-transform: uppercase; letter-spacing: 1.1px;
      color: #8e969e; font-weight: 700; margin: 10px 0 6px;
      padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,.05);
    }
    #cwh-widget .cwh-card {
      background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06);
      border-radius: 10px; padding: 8px 10px; margin-bottom: 6px;
      display: flex; gap: 8px; align-items: flex-start;
    }
    #cwh-widget .cwh-card:hover { background: rgba(255,255,255,.05); }
    #cwh-widget .cwh-card-body { flex: 1; min-width: 0; }
    #cwh-widget .cwh-card-title { font-weight: 600; color: #e8eaed; margin-bottom: 2px; }
    #cwh-widget .cwh-card-meta { font-size: 11px; color: #a6adb5; line-height: 1.4; }
    #cwh-widget .cwh-pill {
      display: inline-block; font-size: 9px; font-weight: 700; text-transform: uppercase;
      padding: 2px 7px; border-radius: 100px; margin: 2px 3px 0 0;
      background: rgba(127,174,92,.2); color: #9fd66c;
    }
    #cwh-widget label { display: block; font-size: 11px; color: #a6adb5; margin-bottom: 3px; }
    #cwh-widget input, #cwh-widget select {
      width: 100%; padding: 6px 8px; border-radius: 8px;
      background: rgba(0,0,0,.35); border: 1px solid rgba(150,155,162,.2);
      color: #e8eaed; font-size: 12px; margin-bottom: 8px;
    }
    #cwh-widget input:focus, #cwh-widget select:focus { outline: none; border-color: #7fae5c; }
    #cwh-widget .cwh-row { display: flex; gap: 8px; }
    #cwh-widget .cwh-row > * { flex: 1; }
    #cwh-widget .cwh-result {
      background: rgba(127,174,92,.12); border: 1px solid rgba(127,174,92,.3);
      border-radius: 10px; padding: 10px; margin-top: 8px;
      font-size: 13px; color: #d8ffd8; line-height: 1.5;
    }
    #cwh-widget .cwh-result strong { color: #9fd66c; }
    #cwh-widget .cwh-check {
      display: flex; align-items: center; gap: 8px; padding: 5px 0; font-size: 12px; cursor: pointer;
    }
    #cwh-widget .cwh-check input { width: auto; margin: 0; }

    /* подписи во рту — не перекрывают карточки/окна игры */
    #itemList { position: relative; z-index: 1; }
    #itemList .itemInMouth {
      position: relative;
      overflow: visible;
      z-index: 0;
    }
    #itemList .cwh-info-label { display: none !important; }
    #itemList .cwh-spoil-label,
    #itemList .cwh-info-label.x {
      display: none !important;
    }
    .cwh-spoil-label {
      z-index: 0 !important;
    }
    /* легенда поля — ниже всплывашек персонажа */

    /* Скользкий туннель — НЕ ХОДИТЬ (переходы .move_parent / .move_name) */
    #cages td.cage.cwh-no-go,
    .move_parent.cwh-no-go,
    span.move_parent.cwh-no-go {
      position: relative !important;
      pointer-events: none !important;
      cursor: not-allowed !important;
    }
    #cages td.cage.cwh-no-go * ,
    .move_parent.cwh-no-go * {
      pointer-events: none !important;
    }
    #cages td.cage.cwh-no-go {
      outline: 2px solid #c62828 !important;
      outline-offset: -2px;
      box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.78) !important;
    }
    .move_parent.cwh-no-go {
      outline: 2px solid #c62828 !important;
      outline-offset: -1px;
      border-radius: 2px;
      box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.78) !important;
      background-color: rgba(0, 0, 0, 0.78) !important;
    }
    .move_parent.cwh-no-go .move_name,
    #cages td.cage.cwh-no-go .move_name {
      opacity: 0 !important;
    }
    .cwh-no-go-name {
      position: absolute !important;
      left: 50% !important;
      bottom: 4px !important;
      transform: translateX(-50%) !important;
      z-index: 30 !important;
      pointer-events: none !important;
      text-align: center !important;
      font: 700 10px/1.2 "Segoe UI", system-ui, sans-serif !important;
      color: #ffb3b3 !important;
      text-shadow: 0 0 4px #000, 0 1px 2px #000, 0 0 6px rgba(0,0,0,.9) !important;
      white-space: nowrap !important;
      max-width: 94% !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
    .move_parent.cwh-no-go .move_img {
      opacity: 0.35 !important;
      filter: grayscale(0.8) brightness(0.5);
    }
    .cwh-no-go-toast {
      position: fixed !important;
      left: 50% !important;
      top: 14px !important;
      transform: translateX(-50%) !important;
      z-index: 1000002 !important;
      background: linear-gradient(180deg, rgba(50,20,20,.96), rgba(28,12,12,.98)) !important;
      border: 1px solid rgba(220,90,90,.6) !important;
      color: #ffb3b3 !important;
      font: 700 12px/1.3 "Segoe UI", system-ui, sans-serif !important;
      padding: 8px 14px !important;
      border-radius: 10px !important;
      box-shadow: 0 6px 20px rgba(0,0,0,.5) !important;
      pointer-events: none !important;
      text-align: center !important;
      opacity: 0;
      transition: opacity .2s ease;
    }
    .cwh-no-go-toast.show { opacity: 1; }

    .cwh-no-go-label {
      position: absolute !important;
      left: 50% !important;
      top: 58% !important;
      transform: translate(-50%, -50%) !important;
      z-index: 30 !important;
      pointer-events: none !important;
      text-align: center !important;
      font: 900 11px/1.2 "Segoe UI", system-ui, sans-serif !important;
      color: #ff1744 !important;
      text-shadow: 0 0 4px #000, 0 0 8px #000, 0 1px 2px #000 !important;
      letter-spacing: 0.5px !important;
      white-space: nowrap !important;
      text-transform: uppercase !important;
    }

    #cages td.cage::before,
    #cages td.cage::after {
      z-index: 0 !important;
      pointer-events: none !important;
    }
    .cwh-spoil-label {
      display: block;
      text-align: center;
      margin: 3px auto 0;
      max-width: 78px;
      padding: 2px 5px;
      border-radius: 8px;
      font: 600 9px/1.2 "Segoe UI", system-ui, sans-serif;
      letter-spacing: .2px;
      color: #c8e6a0;
      background: linear-gradient(180deg, rgba(30,32,36,.92), rgba(18,19,22,.95));
      border: 1px solid rgba(127,174,92,.35);
      box-shadow: 0 2px 8px rgba(0,0,0,.35);
      pointer-events: none;
      white-space: normal;
      line-height: 1.15;
    }
    .cwh-spoil-label.warn {
      color: #ffb0b0;
      border-color: rgba(220,90,90,.45);
      background: linear-gradient(180deg, rgba(50,24,24,.95), rgba(28,14,14,.98));
    }
    .cwh-spoil-label.soft {
      color: #a6adb5;
      border-color: rgba(150,155,162,.25);
      font-weight: 500;
    }
    .cwh-info-label {
      display: block;
      text-align: center;
      margin: 2px auto 0;
      max-width: 88px;
      padding: 2px 4px;
      border-radius: 7px;
      font: 600 8.5px/1.2 "Segoe UI", system-ui, sans-serif;
      color: #d7dade;
      background: linear-gradient(180deg, rgba(28,30,34,.94), rgba(16,17,20,.97));
      border: 1px solid rgba(150,155,162,.3);
      box-shadow: 0 2px 6px rgba(0,0,0,.35);
      pointer-events: none;
      white-space: normal;
      line-height: 1.15;
    }
    .cwh-info-label .cwh-info-treats {
      display: block;
      margin-top: 1px;
      color: #9fd66c;
      font-weight: 600;
      font-size: 8px;
    }
    .cwh-info-label.cwh-info-res .cwh-info-treats {
      color: #a6adb5;
      font-weight: 500;
    }

    #cwh-widget .cwh-check-wrap {
      margin: 0 0 12px;
      border-radius: 12px;
      border: 1px solid rgba(127,174,92,.35);
      background: linear-gradient(180deg, rgba(36,44,32,.95), rgba(20,24,18,.98));
      overflow: hidden;
    }
    #cwh-widget .cwh-check-wrap.cwh-duty-done {
      border-color: rgba(159,214,108,.7);
      box-shadow: 0 0 12px rgba(127,174,92,.2);
    }
    #cwh-widget .cwh-check-sum {
      cursor: pointer;
      list-style: none;
      padding: 10px 12px;
      font: 600 12px/1.3 "Segoe UI", system-ui, sans-serif;
      color: #c8e6a0;
      user-select: none;
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
    }
    #cwh-widget .cwh-check-sum::-webkit-details-marker { display: none; }
    #cwh-widget .cwh-check-sum::after {
      content: '▸'; font-size: 11px; color: #8e969e; transition: transform .15s;
    }
    #cwh-widget .cwh-check-wrap[open] .cwh-check-sum::after { transform: rotate(90deg); }
    #cwh-widget .cwh-check-progress {
      font-weight: 700; color: #9fd66c; font-variant-numeric: tabular-nums;
      margin-left: auto; margin-right: 6px;
    }
    #cwh-widget .cwh-check-list {
      padding: 4px 10px 12px;
      display: flex; flex-direction: column; gap: 6px;
      border-top: 1px solid rgba(150,155,162,.12);
    }
    #cwh-widget .cwh-check-item {
      display: flex; align-items: flex-start; gap: 8px;
      font: 12px/1.35 "Segoe UI", system-ui, sans-serif;
      color: #c5cacf; cursor: pointer;
      padding: 6px 8px; border-radius: 8px;
      background: rgba(255,255,255,.03);
    }
    #cwh-widget .cwh-check-item:hover { background: rgba(255,255,255,.06); }
    #cwh-widget .cwh-check-item input {
      margin-top: 2px; accent-color: #7fae5c; width: 15px; height: 15px; flex-shrink: 0;
    }
    #cwh-widget .cwh-check-item input:checked + span {
      color: #9fd66c; text-decoration: line-through; opacity: .85;
    }
    #cwh-widget .cwh-memo-hl {
      color: #9fd66c; font-weight: 700;
    }
    #cwh-widget .cwh-memo-item {
      color: #b8d99a; font-weight: 600; cursor: help;
      border-bottom: 1px dashed rgba(127,174,92,.45);
      padding: 0 1px;
    }
    #cwh-widget .cwh-memo-item:hover {
      color: #d4f0a8;
      border-bottom-color: rgba(159,214,108,.85);
    }
    #cwh-widget .cwh-flow {
      display: flex; flex-direction: column; gap: 0; margin: 4px 0 14px;
      border-left: 2px solid rgba(127,174,92,.35);
      padding-left: 0;
    }
    #cwh-widget .cwh-flow-step {
      position: relative;
      margin: 0 0 0 12px;
      padding: 10px 12px 12px 16px;
      border-radius: 0 10px 10px 0;
      background: rgba(255,255,255,.03);
      border: 1px solid rgba(150,155,162,.1);
      border-left: none;
    }
    #cwh-widget .cwh-flow-step + .cwh-flow-step { margin-top: 8px; }
    #cwh-widget .cwh-flow-n {
      position: absolute; left: -25px; top: 10px;
      width: 22px; height: 22px; border-radius: 50%;
      background: #1e241c; border: 2px solid rgba(127,174,92,.65);
      color: #9fd66c; font: 700 11px/18px "Segoe UI",sans-serif;
      text-align: center;
    }
    #cwh-widget .cwh-flow-title {
      color: #c8e6a0; font: 600 12px/1.3 "Segoe UI",sans-serif;
      margin: 0 0 4px;
    }
    #cwh-widget .cwh-flow-body {
      color: #aeb4bb; font: 11.5px/1.45 "Segoe UI",sans-serif;
    }
    #cwh-widget .cwh-flow-pts {
      display: inline-block; margin-top: 4px;
      padding: 2px 7px; border-radius: 999px;
      background: rgba(127,174,92,.15); color: #9fd66c;
      font: 600 10px/1.3 "Segoe UI",sans-serif;
    }
    #cwh-widget .cwh-memo-step {
      margin: 0 0 10px; padding: 8px 10px;
      border-radius: 10px;
      background: rgba(255,255,255,.03);
      border: 1px solid rgba(150,155,162,.12);
    }
    #cwh-widget .cwh-memo-step b.num {
      color: #9fd66c; font-size: 13px;
    }
    #cwh-widget .cwh-leg-grid {
      display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0 10px;
    }
    #cwh-widget .cwh-leg-chip {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 8px; border-radius: 999px;
      font: 600 10.5px/1.2 "Segoe UI",sans-serif;
      color: #d7dade;
      background: rgba(0,0,0,.35);
      border: 1px solid color-mix(in srgb, var(--c) 55%, transparent);
    }
    #cwh-widget .cwh-leg-chip i {
      width: 9px; height: 9px; border-radius: 50%;
      box-shadow: 0 0 6px var(--c);
    }
    #cwh-widget .cwh-legend-toggle {
      display: block; width: 100%; margin: 6px 0 10px;
      padding: 8px 12px; border-radius: 10px; cursor: pointer;
      font: 600 12px/1.3 "Segoe UI",sans-serif;
      color: #aeb4bb;
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(150,155,162,.25);
    }
    #cwh-widget .cwh-legend-toggle.on {
      color: #c8e6a0;
      border-color: rgba(127,174,92,.55);
      background: rgba(127,174,92,.12);
    }
    #cwh-widget .cwh-link-row {
      display: flex; flex-direction: column; gap: 6px; margin: 8px 0 10px;
    }
    #cwh-widget .cwh-link-btn {
      display: block;
      text-align: center;
      text-decoration: none;
      padding: 8px 12px;
      border-radius: 10px;
      font: 600 12px/1.3 "Segoe UI", system-ui, sans-serif;
      color: #c8e6a0;
      background: linear-gradient(180deg, rgba(40,48,36,.95), rgba(22,26,20,.98));
      border: 1px solid rgba(127,174,92,.4);
      box-shadow: 0 2px 10px rgba(0,0,0,.35);
      transition: background .15s, border-color .15s, color .15s;
    }
    #cwh-widget .cwh-link-btn:hover {
      color: #e8f5d0;
      border-color: rgba(159,214,108,.65);
      background: linear-gradient(180deg, rgba(55,70,45,.98), rgba(30,38,26,.98));
    }
    #cwh-widget .cwh-note {
      font-size: 11px; color: #8e969e; font-style: italic; margin-top: 6px; line-height: 1.4;
    }
    #cwh-widget .cwh-step {
      background: rgba(255,255,255,.03); border-left: 3px solid #7fae5c;
      padding: 8px 10px; margin-bottom: 6px; border-radius: 0 8px 8px 0;
    }
    #cwh-widget .cwh-step b { color: #9fd66c; }

    #cwh-toggle {
      position: fixed; bottom: 18px; right: 18px; z-index: 99998;
      left: auto; top: auto;
      width: 42px; height: 42px; border-radius: 50%;
      background: linear-gradient(145deg, #2a2c30, #1b1c1f);
      border: 1px solid rgba(127,174,92,.4);
      color: #9fd66c; font-size: 18px; cursor: grab;
      box-shadow: 0 4px 16px rgba(0,0,0,.4);
      display: flex; align-items: center; justify-content: center;
      user-select: none;
    }
    #cwh-toggle:hover { border-color: #9fd66c; }
    #cwh-toggle:active { cursor: grabbing; }

    /* ===== MOBILE / TOUCH ===== */
    #cwh-widget, #cwh-toggle {
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    #cwh-widget .cwh-header {
      touch-action: none; /* drag */
    }
    #cwh-widget .cwh-btn {
      min-width: 36px;
      min-height: 36px;
    }
    #cwh-widget .cwh-tabs {
      overflow-x: visible;
      flex-wrap: wrap;
      justify-content: center;
    }
    #cwh-widget .cwh-tab {
      flex: 1 1 calc(33.333% - 6px);
      min-width: 72px;
      white-space: nowrap;
      min-height: 34px;
      padding: 6px 10px;
    }
    #cwh-widget .cwh-duty-mini-item {
      min-height: 36px;
      align-items: center;
    }
    #cwh-widget .cwh-duty-mini-end {
      min-height: 44px;
      font-size: 13px;
    }
    #cwh-toggle {
      width: 48px; height: 48px;
      bottom: max(16px, env(safe-area-inset-bottom, 0px));
      right: max(16px, env(safe-area-inset-right, 0px));
      font-size: 20px;
    }

    @media (max-width: 720px) {
      #cwh-widget {
        min-width: 260px !important;
        width: min(100vw - 12px, 420px) !important;
        max-width: calc(100vw - 8px) !important;
        max-height: calc(100vh - 8px) !important;
        min-height: 200px;
        height: min(72vh, 560px);
        border-radius: 12px;
        font-size: 13px;
        resize: none; /* на телефоне ресайз неудобен */
      }
      #cwh-widget[data-collapsed="1"] {
        min-width: 200px !important;
        width: min(92vw, 360px) !important;
        max-width: calc(100vw - 8px) !important;
      }
      #cwh-widget .cwh-header {
        padding: 8px 10px;
        min-height: 44px;
      }
      #cwh-widget .cwh-title { font-size: 13px; }
      #cwh-widget .cwh-body {
        padding: 8px 10px 12px;
        -webkit-overflow-scrolling: touch;
      }
      #cwh-widget .cwh-card {
        padding: 10px;
      }
      #cwh-widget .cwh-card-title { font-size: 13px; }
      #cwh-widget .cwh-card-meta { font-size: 12px; }
      #cwh-widget .cwh-tabs {
        justify-content: center;
        flex-wrap: wrap;
      }
      #cwh-widget .cwh-tab {
        font-size: 12px;
        padding: 8px 10px;
        min-height: 38px;
        flex: 1 1 calc(33.333% - 6px);
        min-width: 70px;
      }
      #cwh-widget .cwh-disease-grid {
        grid-template-columns: 1fr;
      }
      #cwh-widget .cwh-season-vine {
        height: 32px;
        max-width: 45%;
      }
      #cwh-widget input[type=number],
      #cwh-widget input[type=text],
      #cwh-widget select {
        font-size: 16px !important; /* iOS не зумит */
        min-height: 40px;
      }
      #cwh-widget .cwh-check-item,
      #cwh-widget label.cwh-check {
        min-height: 40px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
      }
      #cwh-widget .cwh-check-item input,
      #cwh-widget input[type=checkbox] {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }
      #cwh-widget button,
      #cwh-widget .cwh-collapse-btn,
      #cwh-widget .cwh-legend-toggle,
      #cwh-widget .cwh-link-btn {
        min-height: 40px;
        font-size: 13px;
      }
      #cwh-widget .cwh-cat-preview {
        max-width: 100%;
      }
      #cwh-widget .cwh-cat-view {
        transform: scale(1);
        max-width: 100%;
        overflow: hidden;
      }
    }

    @media (max-width: 420px) {
      #cwh-widget .cwh-tab {
        flex: 1 1 calc(50% - 6px);
        min-width: 56px;
        font-size: 11px;
        padding: 8px 6px;
      }
      #cwh-widget {
        left: 4px !important;
        right: 4px;
        width: calc(100vw - 8px) !important;
        max-width: calc(100vw - 8px) !important;
      }
      #cwh-widget[data-collapsed="1"] {
        width: calc(100vw - 16px) !important;
        left: 8px !important;
      }
      #cwh-widget .cwh-season-vine {
        display: none !important; /* на очень узких — место кнопкам */
      }
    }

    @media (hover: none) and (pointer: coarse) {
      #cwh-widget .cwh-card:hover { background: rgba(255,255,255,.03); }
      #cwh-widget .cwh-btn {
        opacity: .85;
        min-width: 40px;
        min-height: 40px;
      }
      #cwh-widget .cwh-duty-mini-item:active {
        background: rgba(127,174,92,.18);
      }
    }


    #cwh-widget .cwh-disease-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
    }
    #cwh-widget .cwh-disease-card {
      background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06);
      border-radius: 10px; padding: 10px 8px; text-align: center;
    }
    #cwh-widget .cwh-disease-card .cwh-d-icon {
      width: 56px; height: 56px; object-fit: contain; margin: 0 auto 6px;
      border-radius: 8px; background: rgba(0,0,0,.3); display: block;
    }
    #cwh-widget .cwh-disease-card .cwh-d-name { font-weight: 600; color: #e8eaed; font-size: 12px; }
    #cwh-widget .cwh-disease-card .cwh-d-sub { font-size: 10px; color: #8e969e; margin-top: 3px; line-height: 1.3; }


    #cwh-widget .cwh-filter-row {
      display: flex; flex-wrap: wrap; gap: 6px; margin: 4px 0 12px;
    }
    #cwh-widget button.cwh-filter-btn {
      all: unset;
      box-sizing: border-box;
      display: inline-flex; align-items: center; justify-content: center;
      background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
      border: 1px solid rgba(127,174,92,.25) !important;
      color: #c8cdd2 !important;
      border-radius: 10px;
      padding: 6px 12px;
      font: 600 11px/1.2 "Segoe UI", system-ui, sans-serif;
      cursor: pointer;
      transition: border-color .15s, background .15s, color .15s, box-shadow .15s;
    }
    #cwh-widget button.cwh-filter-btn:hover {
      border-color: rgba(127,174,92,.55) !important;
      color: #e8eaed !important;
      background: rgba(127,174,92,.1);
    }
    #cwh-widget button.cwh-filter-btn.on {
      border-color: #7fae5c !important;
      color: #9fd66c !important;
      background: rgba(127,174,92,.18);
      box-shadow: 0 0 12px rgba(127,174,92,.15);
    }
    #cwh-widget .cwh-result.bad {
      border-color: rgba(220,80,80,.45);
      background: rgba(180,40,40,.12);
    }
    #cwh-widget .cwh-result.bad strong { color: #ff8a8a; }
    #cwh-widget .cwh-result.good {
      border-color: rgba(127,174,92,.45);
      background: rgba(127,174,92,.12);
    }

    #cwh-widget .cwh-pick-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
      gap: 8px;
      margin: 8px 0 12px;
    }
    #cwh-widget .cwh-pick-card {
      display: flex; flex-direction: column; align-items: center;
      background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
      border-radius: 10px; padding: 8px 6px; cursor: pointer;
      transition: border-color .15s, background .15s;
      text-align: center;
    }
    #cwh-widget .cwh-pick-card:hover { border-color: rgba(127,174,92,.4); }
    #cwh-widget .cwh-pick-card.on {
      border-color: #7fae5c; background: rgba(127,174,92,.12);
    }
    #cwh-widget .cwh-pick-card .per {
      font-size: 11px; color: #9fd66c; font-weight: 600; margin-bottom: 4px;
    }
    #cwh-widget .cwh-pick-card .name {
      font-size: 10px; color: #c8cdd2; margin: 4px 0 2px; line-height: 1.2;
      max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    #cwh-widget .cwh-pick-card input[type=number] {
      width: 48px; text-align: center; margin-top: 2px; padding: 2px 4px;
      font-size: 11px;
    }
    #cwh-widget .cwh-pick-card .tot {
      font-size: 10px; color: #a6adb5; margin-top: 2px;
    }
    #cwh-widget .cwh-pick-card input[type=checkbox] {
      accent-color: #7fae5c; margin-top: 4px;
    }
    #cwh-widget .cwh-mix-row {
      display: flex; flex-wrap: nowrap; align-items: stretch; gap: 8px;
      padding: 8px 0; overflow-x: auto;
    }
    #cwh-widget .cwh-mix-row label.cwh-check {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
      border-radius: 10px; padding: 8px 10px;
      font-size: 10px; text-align: center; min-width: 72px; flex-shrink: 0;
      cursor: pointer; transition: border-color .2s, background .2s;
    }
    #cwh-widget .cwh-mix-row label.cwh-check:hover {
      border-color: rgba(127,174,92,.4); background: rgba(127,174,92,.08);
    }
    #cwh-widget .cwh-mix-row label.cwh-check:has(input:checked) {
      border-color: #7fae5c; background: rgba(127,174,92,.15);
      box-shadow: 0 0 12px rgba(127,174,92,.12);
    }
    #cwh-widget .cwh-mix-row label.cwh-check input {
      margin: 0; width: 16px; height: 16px; accent-color: #7fae5c;
      cursor: pointer;
    }

    #cwh-widget .cwh-cat-preview {
      display: flex; flex-direction: column; align-items: center;
      margin-top: 10px; padding: 12px; background: rgba(0,0,0,.3);
      border-radius: 12px; border: 1px solid rgba(255,255,255,.08);
    }
    #cwh-widget .cwh-cat-stage {
      position: relative; display: inline-flex; align-items: flex-end; justify-content: center;
      min-width: 120px;
    }
    #cwh-widget .cwh-cat-stage img.base {
      object-fit: contain; border-radius: 8px;
      background: transparent; image-rendering: auto;
      max-width: 220px;
    }
    #cwh-widget .cwh-cat-stage .overlay {
      position: absolute; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      object-fit: contain; pointer-events: none;
      max-width: 220px;
    }
    #cwh-widget .cwh-stage-btns {
      display: flex; gap: 4px; margin-top: 8px; flex-wrap: wrap; justify-content: center;
    }
    #cwh-widget .cwh-stage-btns button {
      background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12);
      color: #c8cdd2; border-radius: 6px; padding: 3px 8px; font-size: 11px; cursor: pointer;
    }
    #cwh-widget .cwh-stage-btns button.on {
      border-color: #7fae5c; color: #9fd66c; background: rgba(127,174,92,.15);
    }
    #cwh-widget .cwh-age-btns {
      display: flex; gap: 6px; margin-bottom: 6px;
    }
    #cwh-widget .cwh-age-btns button {
      background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12);
      color: #c8cdd2; border-radius: 6px; padding: 3px 10px; font-size: 11px; cursor: pointer;
    }
    #cwh-widget .cwh-age-btns button.on {
      border-color: #7fae5c; color: #9fd66c; background: rgba(127,174,92,.15);
    }
    #cwh-widget .cwh-cat-label {
      margin-top: 6px; font-size: 11px; color: #a6adb5; text-align: center;
    }
    #cwh-widget .cwh-stack { line-height: 1.7; }
    #cwh-widget .cwh-stack div { padding: 2px 0; }


    #cwh-widget .cwh-icon {
      transition: box-shadow .12s;
      position: relative;
    }
    #cwh-widget .cwh-icon:hover {
      box-shadow: 0 0 0 2px rgba(127,174,92,.5);
    }
    #cwh-zoom-wrap {
      position: fixed; z-index: 1000001; pointer-events: none;
      display: none; flex-direction: column; align-items: center;
      background: #1b1c1f; border: 1px solid rgba(127,174,92,.45);
      border-radius: 12px; box-shadow: 0 8px 28px rgba(0,0,0,.65);
      padding: 8px; max-width: 160px;
    }
    #cwh-zoom-wrap img {
      width: 88px; height: 88px; object-fit: contain;
      border-radius: 8px; background: rgba(0,0,0,.35);
    }
    #cwh-zoom-wrap .cwh-zoom-txt {
      margin-top: 6px; font: 11px/1.35 "Segoe UI", sans-serif;
      color: #d7dade; text-align: center;
    }
    #cwh-zoom-wrap .cwh-zoom-txt b { color: #9fd66c; }
    #cwh-widget .cwh-recipe-flow {
      display: flex; flex-wrap: wrap; align-items: center; gap: 4px;
      margin-top: 6px;
    }
    #cwh-widget .cwh-recipe-flow .cwh-arrow {
      color: #8e969e; font-size: 14px; padding: 0 2px;
    }
    #cwh-widget .cwh-recipe-flow img {
      width: 40px; height: 40px; object-fit: contain;
      border-radius: 6px; background: rgba(0,0,0,.35);
    }

    .cwh-pct-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 2px 8px;
      border-radius: 999px;
      font: 700 14px/1.1 "Segoe UI", system-ui, sans-serif;
      white-space: nowrap;
      letter-spacing: 0;
      flex-shrink: 0;
    }
    .cwh-pct-badge.fix {
      color: #e8ffc8;
      background: rgba(127,174,92,.28);
      border: 1px solid rgba(159,214,108,.5);
    }
    .cwh-pct-badge.cu {
      color: #d0f0ff;
      background: rgba(56,189,248,.22);
      border: 1px solid rgba(125,211,252,.5);
    }
    .cwh-pct-badge.res {
      color: #c4c9ce;
      background: rgba(150,155,162,.14);
      border: 1px solid rgba(150,155,162,.3);
    }
    .cwh-pct-wrap {
      display: inline-flex;
      gap: 4px;
      flex-shrink: 0;
      margin-left: auto;
    }
    #cwh-widget .cwh-card-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-weight: 600;
      color: #e8eaed;
      margin-bottom: 2px;
      width: 100%;
    }
    #cwh-widget .cwh-card-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .cwh-sort-hint { color: #fbbf24; font-size: 10px; margin: 2px 0 4px; font-weight: 600; }
    .cwh-info-sort { display: block; margin-top: 2px; color: #fbbf24; font-size: 8px; font-weight: 600; }
    .cwh-collapse { margin: 8px 0; }
    .cwh-collapse-btn {
      width: 100%; text-align: left; cursor: pointer;
      background: rgba(127,174,92,.12); border: 1px solid rgba(127,174,92,.3);
      color: #c8e6a0; border-radius: 10px; padding: 8px 12px;
      font: 600 12px/1.3 "Segoe UI",sans-serif;
    }
    .cwh-collapse-btn:hover { background: rgba(127,174,92,.2); }
    .cwh-collapse-body { margin-top: 6px; }

    #cwh-widget .cwh-counts-wrap {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 10px 12px;
      border-radius: 12px;
      border: 1px solid rgba(127,174,92,.3);
      background: linear-gradient(180deg, rgba(30,34,28,.95), rgba(18,20,16,.98));
      margin-bottom: 10px;
    }
    #cwh-widget .cwh-counts-grid {
      display: flex;
      flex-direction: column;
      gap: 5px;
      width: 100%;
      min-width: 0;
      font-size: 12px;
      line-height: 1.4;
      color: #d7dade;
    }
    #cwh-widget .cwh-count-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      width: 100%;
    }
    #cwh-widget .cwh-count-label {
      color: #a6adb5;
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #cwh-widget .cwh-count-val {
      flex-shrink: 0;
      font-variant-numeric: tabular-nums;
      color: #e8eaed;
    }
    #cwh-widget .cwh-count-mice { margin-bottom: 4px; }
    #cwh-widget .cwh-count-bar {
      height: 6px;
      border-radius: 4px;
      background: rgba(255,255,255,.08);
      overflow: hidden;
      margin-top: 4px;
    }
    #cwh-widget .cwh-count-bar i {
      display: block;
      height: 100%;
      border-radius: 4px;
      min-width: 0;
    }
    #cwh-widget .cwh-count-foot {
      margin-top: 4px;
      padding-top: 6px;
      border-top: 1px solid rgba(255,255,255,.06);
      font-size: 11px;
      color: #8e969e;
    }
    #cwh-widget .cwh-counts-wrap .cwh-link-btn {
      width: 100%;
      margin: 0;
    }

    #cwh-widget .cwh-count-sec {
      margin: 10px 0 4px;
      padding-top: 8px;
      border-top: 1px solid rgba(255,255,255,.08);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .4px;
      text-transform: uppercase;
      color: #9fd66c;
    }
    #cwh-widget .cwh-counts-actions {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    #cwh-widget .cwh-counts-actions .cwh-link-btn {
      width: 100%;
      margin: 0;
    }

    #cwh-widget .cwh-count-row3 .cwh-count-tri {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-variant-numeric: tabular-nums;
      flex-shrink: 0;
    }
    #cwh-widget .cwh-count-row3 .cwh-t {
      min-width: 1.2em;
      text-align: center;
      font-weight: 700;
      color: #e8eaed;
    }
    #cwh-widget .cwh-count-row3 .cwh-t.was { color: #8e969e; font-weight: 600; }
    #cwh-widget .cwh-count-row3 .cwh-t.pick { color: #9fd66c; }
    #cwh-widget .cwh-count-row3 .cwh-t.now { color: #e8eaed; }
    #cwh-widget .cwh-count-row3 .cwh-t.sep { color: #5c636a; font-weight: 400; min-width: 0; }
    #cwh-widget .cwh-count-legend {
      font-size: 10px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    #cwh-widget .cwh-pct-badge {
      padding: 5px 12px !important;
      font-size: 14px !important;
      line-height: 1.2 !important;
      letter-spacing: 0.3px;
    }

    #cwh-widget .cwh-duty-btns { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
    #cwh-widget .cwh-duty-banner {
      font-size: 11px; color: #8e969e; text-align: center; padding: 4px 6px;
      border-radius: 8px; background: rgba(255,255,255,.04);
    }
    #cwh-widget .cwh-duty-banner.on {
      color: #c8e6a0; background: rgba(127,174,92,.12);
      border: 1px solid rgba(127,174,92,.3);
    }
    #cwh-widget .cwh-duty-start { border-color: rgba(127,174,92,.45) !important; color: #c8e6a0 !important; }
    #cwh-widget .cwh-duty-end { border-color: rgba(232,160,96,.45) !important; color: #e8a060 !important; }
    #cwh-widget .cwh-count-head2 {
      display: grid;
      grid-template-columns: 1fr 44px 44px 44px;
      gap: 4px;
      font-size: 10px;
      color: #6b7280;
      margin-bottom: 4px;
      text-align: center;
    }
    #cwh-widget .cwh-count-head2 span:first-child { text-align: left; }
    #cwh-widget .cwh-count-cols {
      display: grid !important;
      grid-template-columns: 1fr 44px 44px 44px;
      gap: 4px;
      align-items: center;
    }
    #cwh-widget .cwh-count-cols .cwh-count-label { justify-self: start; }
    #cwh-widget .cwh-c {
      text-align: center;
      font-variant-numeric: tabular-nums;
      font-weight: 600;
      color: #c4c9ce;
      font-size: 12px;
    }
    #cwh-widget .cwh-c.was { color: #8e969e; }
    #cwh-widget .cwh-c.now { color: #e8eaed; }
    #cwh-widget .cwh-c.got { color: #9fd66c; }
    #cwh-widget .cwh-start-input {
      width: 40px;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.16);
      border-radius: 5px;
      color: #e8eaed;
      font: 600 12px/1.2 inherit;
      text-align: center;
      padding: 2px 0;
    }
    #cwh-widget .cwh-start-input:focus {
      outline: none;
      border-color: rgba(159,214,108,.6);
      background: rgba(159,214,108,.08);
    }
`;

  /* ========================================================================
     UI
     ======================================================================== */
  function injectStyle() {
    if (document.getElementById('cwh-style')) return;
    const s = document.createElement('style');
    s.id = 'cwh-style';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  let panel, body, currentTab = 'diseases';

  function makeDraggable(el, handle) {
    let dragging = false, offX = 0, offY = 0;
    function point(e) {
      const t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
      return { x: t.clientX, y: t.clientY };
    }
    function onStart(e) {
      if (e.type === 'mousedown' && e.button !== 0) return;
      // не стартовать драга с кнопок шапки
      if (e.target && e.target.closest && e.target.closest('.cwh-btn, button, a, input, select, textarea, .cwh-duty-mini-item, .cwh-duty-mini-end')) return;
      dragging = true;
      const pt = point(e);
      const r = el.getBoundingClientRect();
      offX = pt.x - r.left;
      offY = pt.y - r.top;
      try { e.preventDefault(); } catch (err) {}
    }
    function onMove(e) {
      if (!dragging) return;
      const pt = point(e);
      let left = pt.x - offX;
      let top = pt.y - offY;
      const w = el.offsetWidth || 360;
      left = Math.max(0, Math.min(window.innerWidth - Math.min(w, window.innerWidth), left));
      top = Math.max(0, Math.min(window.innerHeight - 42, top));
      el.style.left = left + 'px';
      el.style.top = top + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
      try { e.preventDefault(); } catch (err) {}
    }
    function onEnd() {
      if (!dragging) return;
      dragging = false;
      if (typeof clampPanel === 'function') clampPanel();
      savePos();
    }
    handle.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    handle.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
    document.addEventListener('touchcancel', onEnd);
  }

  function clampPanel() {
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const isMobile = vw <= 720 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
    const minW = isMobile ? Math.min(280, vw - 8) : 280;
    const maxL = Math.max(0, vw - Math.min(r.width || minW, vw));
    const maxT = Math.max(0, vh - 48);
    let left = parseFloat(panel.style.left);
    let top = parseFloat(panel.style.top);
    if (isNaN(left)) left = r.left;
    if (isNaN(top)) top = r.top;
    left = Math.max(0, Math.min(maxL, left));
    top = Math.max(0, Math.min(maxT, top));
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
    const maxW = Math.max(minW, vw - left - 4);
    const maxH = Math.max(160, vh - top - 4);
    if (panel.offsetWidth > maxW) panel.style.width = maxW + 'px';
    if (panel.dataset.collapsed !== '1' && panel.offsetHeight > maxH) {
      panel.style.height = maxH + 'px';
    }
    if (isMobile && panel.dataset.collapsed !== '1') {
      // на телефоне не шире экрана
      if (panel.offsetWidth > vw - 8) panel.style.width = (vw - 8) + 'px';
    }
  }

  function savePos() {
    if (!panel) return;
    clampPanel();
    GM_setValue('cwh_pos', {
      left: panel.style.left, top: panel.style.top,
      width: panel.style.width, height: panel.style.height
    });
  }

  function loadPos() {
    const p = GM_getValue('cwh_pos', null);
    if (!p || !panel) return;
    if (p.left) panel.style.left = p.left;
    if (p.top) panel.style.top = p.top;
    if (p.width) panel.style.width = p.width;
    if (p.height) panel.style.height = p.height;
    clampPanel();
  }


  function getSeasonMSK() {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Moscow', month: 'numeric'
      }).formatToParts(new Date());
      const m = +((parts.find(p => p.type === 'month') || {}).value || (new Date().getMonth() + 1));
      if (m >= 3 && m <= 5) return 'spring';
      if (m >= 6 && m <= 8) return 'summer';
      if (m >= 9 && m <= 11) return 'autumn';
      return 'winter';
    } catch (e) {
      const m = new Date().getMonth() + 1;
      if (m >= 3 && m <= 5) return 'spring';
      if (m >= 6 && m <= 8) return 'summer';
      if (m >= 9 && m <= 11) return 'autumn';
      return 'winter';
    }
  }

  /** компактные сезонные лозы (viewBox 1200×320 → полоска) */
  const SEASON_VINE_SVG_SHORT = {
    spring: "<svg width=\"100%\" height=\"100%\" preserveAspectRatio=\"none\" viewBox=\"0 0 1200 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<defs>\n<style>\n      .spring-vine-glow {\n        stroke: #4ade80;\n        stroke-width: 9;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        opacity: 0.3;\n        filter: blur(2px);\n        stroke-dasharray: 1800;\n        stroke-dashoffset: 1800;\n        animation: growStem 3.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;\n      }\n      .spring-vine-main {\n        stroke: #2e7d32;\n        stroke-width: 6;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        stroke-dasharray: 1800;\n        stroke-dashoffset: 1800;\n        animation: growStem 3.8s cubic-bezier(0.4, 0, 0.2, 1) forwards, springBreeze 6s ease-in-out infinite 3.8s;\n        transform-origin: 50% 50%;\n      }\n      .spring-vine-accent {\n        stroke: #66bb6a;\n        stroke-width: 2.2;\n        stroke-linecap: round;\n        fill: none;\n        stroke-dasharray: 1800;\n        stroke-dashoffset: 1800;\n        animation: growStem 4.0s cubic-bezier(0.4, 0, 0.2, 1) forwards;\n      }\n      .spring-leaf-group {\n        opacity: 0;\n        animation: leafUnfold 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n        transform-origin: center;\n      }\n      .leaf-lime { fill: #81c784; }\n      .leaf-emerald { fill: #388e3c; }\n      .leaf-vein-green {\n        fill: none;\n        stroke: #1b5e20;\n        stroke-width: 1.3;\n        stroke-linecap: round;\n      }\n      .spring-flower-bloom {\n        opacity: 0;\n        animation: flowerPop 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n        transform-origin: center;\n      }\n      .spring-pollen {\n        animation: pollenDrift 3.5s ease-in-out infinite alternate;\n      }\n\n      @keyframes growStem { to { stroke-dashoffset: 0; } }\n      @keyframes leafUnfold {\n        0% { transform: scale(0) rotate(-20deg); opacity: 0; }\n        80% { transform: scale(1.12) rotate(3deg); opacity: 1; }\n        100% { transform: scale(1) rotate(0deg); opacity: 1; }\n      }\n      @keyframes flowerPop {\n        0% { transform: scale(0) rotate(-40deg); opacity: 0; }\n        75% { transform: scale(1.2) rotate(8deg); opacity: 1; }\n        100% { transform: scale(1) rotate(0deg); opacity: 1; }\n      }\n      @keyframes springBreeze {\n        0%, 100% { transform: translateY(0) rotate(0deg); }\n        50% { transform: translateY(-4px) rotate(0.35deg); }\n      }\n      @keyframes pollenDrift {\n        0% { transform: translate(0, 0); opacity: 0.3; }\n        100% { transform: translate(12px, -15px); opacity: 0.85; filter: drop-shadow(0 0 3px #81c784); }\n      }\n    </style>\n</defs>\n<g>\n<!-- Glow underlay -->\n<path class=\"spring-vine-glow\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145\"></path>\n<!-- Main stem -->\n<path class=\"spring-vine-main\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145\"></path>\n<!-- Thin top highlight vein -->\n<path class=\"spring-vine-accent\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145\"></path>\n<!-- Spring leaves (elongated lanceolate) -->\n<!-- Node 1 -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 1.0s; transform-origin: 100px 145px;\">\n<path class=\"leaf-emerald\" d=\"M 100,145 C 80,105 100,60 135,75 C 145,105 125,145 100,145 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 100,145 Q 115,105 135,75\"></path>\n</g>\n<g class=\"spring-leaf-group\" style=\"animation-delay: 1.2s; transform-origin: 110px 150px;\">\n<path class=\"leaf-lime\" d=\"M 110,150 C 135,125 170,115 185,135 C 170,155 140,165 110,150 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 110,150 Q 145,135 185,135\"></path>\n</g>\n<!-- Node 2 -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 1.5s; transform-origin: 210px 95px;\">\n<path class=\"leaf-emerald\" d=\"M 210,95 C 190,55 220,25 255,40 C 260,75 235,105 210,95 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 210,95 Q 230,60 255,40\"></path>\n</g>\n<g class=\"spring-leaf-group\" style=\"animation-delay: 1.7s; transform-origin: 220px 102px;\">\n<path class=\"leaf-lime\" d=\"M 220,102 C 250,85 285,85 295,110 C 275,125 245,125 220,102 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 220,102 Q 255,95 295,110\"></path>\n</g>\n<!-- Node 3 -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 1.9s; transform-origin: 320px 155px;\">\n<path class=\"leaf-emerald\" d=\"M 320,155 C 305,115 330,85 365,100 C 375,130 350,165 320,155 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 320,155 Q 340,120 365,100\"></path>\n</g>\n<g class=\"spring-leaf-group\" style=\"animation-delay: 2.1s; transform-origin: 330px 165px;\">\n<path class=\"leaf-lime\" d=\"M 330,165 C 355,145 390,145 405,170 C 385,185 355,185 330,165 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 330,165 Q 365,155 405,170\"></path>\n</g>\n<!-- Node 4 -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 2.3s; transform-origin: 440px 225px;\">\n<path class=\"leaf-emerald\" d=\"M 440,225 C 415,250 425,285 455,280 C 475,260 465,230 440,225 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 440,225 Q 435,260 455,280\"></path>\n</g>\n<g class=\"spring-leaf-group\" style=\"animation-delay: 2.5s; transform-origin: 450px 220px;\">\n<path class=\"leaf-lime\" d=\"M 450,220 C 480,215 510,230 515,255 C 495,265 470,250 450,220 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 450,220 Q 485,230 515,255\"></path>\n</g>\n<!-- Node 5 -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 2.7s; transform-origin: 580px 185px;\">\n<path class=\"leaf-emerald\" d=\"M 580,185 C 565,145 590,120 625,135 C 635,165 610,195 580,185 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 580,185 Q 600,150 625,135\"></path>\n</g>\n<g class=\"spring-leaf-group\" style=\"animation-delay: 2.9s; transform-origin: 590px 190px;\">\n<path class=\"leaf-lime\" d=\"M 590,190 C 620,180 650,195 655,220 C 635,230 605,220 590,190 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 590,190 Q 625,195 655,220\"></path>\n</g>\n<!-- Node 6 -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 3.1s; transform-origin: 690px 100px;\">\n<path class=\"leaf-lime\" d=\"M 690,100 C 670,60 700,30 735,45 C 745,75 720,110 690,100 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 690,100 Q 710,65 735,45\"></path>\n</g>\n<g class=\"spring-leaf-group\" style=\"animation-delay: 3.3s; transform-origin: 700px 105px;\">\n<path class=\"leaf-emerald\" d=\"M 700,105 C 730,90 765,95 775,120 C 755,135 725,130 700,105 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 700,105 Q 735,105 775,120\"></path>\n</g>\n<!-- Node 7 -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 3.5s; transform-origin: 840px 140px;\">\n<path class=\"leaf-emerald\" d=\"M 840,140 C 825,100 850,75 885,90 C 895,120 870,150 840,140 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 840,140 Q 860,105 885,90\"></path>\n</g>\n<g class=\"spring-leaf-group\" style=\"animation-delay: 3.6s; transform-origin: 850px 145px;\">\n<path class=\"leaf-lime\" d=\"M 850,145 C 880,130 910,135 915,155 C 900,170 875,165 850,145 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 850,145 Q 880,140 915,155\"></path>\n</g>\n<!-- Node 8 -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 3.7s; transform-origin: 960px 220px;\">\n<path class=\"leaf-lime\" d=\"M 960,220 C 940,250 955,280 985,275 C 1005,255 990,225 960,220 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 960,220 Q 965,255 985,275\"></path>\n</g>\n<!-- Node 9 Tip -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 3.9s; transform-origin: 1110px 175px;\">\n<path class=\"leaf-emerald\" d=\"M 1110,175 C 1130,145 1160,145 1175,160 C 1160,185 1135,190 1110,175 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 1110,175 Q 1145,155 1175,160\"></path>\n</g>\n<!-- 🌸 КРУПНЫЕ ВЕСЕННИЕ ЦВЕТЫ (Масштаб увеличен в 1.8x раз) -->\n<!-- Flower 1 (crest 1) -->\n<g class=\"spring-flower-bloom\" style=\"animation-delay: 2.1s; transform-origin: 175px 85px;\">\n<g transform=\"translate(175, 85) scale(1.75)\">\n<path d=\"M 0,0 C -8,-14 8,-14 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 14,-8 14,8 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 8,14 -8,14 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C -14,8 -14,-8 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<circle cx=\"0\" cy=\"0\" fill=\"#f43f5e\" r=\"3.4\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"1.6\"></circle>\n</g>\n</g>\n<!-- Flower 2 (lower valley 1) -->\n<g class=\"spring-flower-bloom\" style=\"animation-delay: 2.6s; transform-origin: 410px 240px;\">\n<g transform=\"translate(410, 240) scale(1.8)\">\n<path d=\"M 0,0 C -9,-15 9,-15 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 15,-9 15,9 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 9,15 -9,15 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C -15,9 -15,-9 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<circle cx=\"0\" cy=\"0\" fill=\"#f43f5e\" r=\"3.4\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"1.6\"></circle>\n</g>\n</g>\n<!-- Flower 3 (crest 2) -->\n<g class=\"spring-flower-bloom\" style=\"animation-delay: 3.2s; transform-origin: 750px 80px;\">\n<g transform=\"translate(750, 80) scale(1.75)\">\n<path d=\"M 0,0 C -9,-15 9,-15 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 15,-9 15,9 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 9,15 -9,15 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C -15,9 -15,-9 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<circle cx=\"0\" cy=\"0\" fill=\"#f43f5e\" r=\"3.4\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"1.6\"></circle>\n</g>\n</g>\n<!-- Flower 4 (lower valley 2) -->\n<g class=\"spring-flower-bloom\" style=\"animation-delay: 3.6s; transform-origin: 1010px 245px;\">\n<g transform=\"translate(1010, 245) scale(1.7)\">\n<path d=\"M 0,0 C -8,-14 8,-14 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 14,-8 14,8 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 8,14 -8,14 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C -14,8 -14,-8 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<circle cx=\"0\" cy=\"0\" fill=\"#f43f5e\" r=\"3.2\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"1.5\"></circle>\n</g>\n</g>\n<!-- Floating spring pollen dots -->\n<g class=\"spring-pollen\">\n<circle cx=\"160\" cy=\"70\" fill=\"#f472b6\" opacity=\"0.85\" r=\"3\"></circle>\n<circle cx=\"380\" cy=\"115\" fill=\"#86efac\" opacity=\"0.8\" r=\"3.5\"></circle>\n<circle cx=\"640\" cy=\"110\" fill=\"#fbcfe8\" opacity=\"0.9\" r=\"3\"></circle>\n<circle cx=\"860\" cy=\"65\" fill=\"#86efac\" opacity=\"0.8\" r=\"3.5\"></circle>\n<circle cx=\"1060\" cy=\"205\" fill=\"#f472b6\" opacity=\"0.85\" r=\"3\"></circle>\n</g>\n</g>\n</svg>",
    summer: "<svg width=\"100%\" height=\"100%\" preserveAspectRatio=\"none\" viewBox=\"0 0 1200 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<defs>\n<style>\n      .summer-vine-glow {\n        stroke: #84cc16;\n        stroke-width: 9;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        opacity: 0.35;\n        filter: blur(2px);\n        stroke-dasharray: 1800;\n        stroke-dashoffset: 1800;\n        animation: growSummerStem 3.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;\n      }\n      .summer-vine-main {\n        stroke: #166534;\n        stroke-width: 6.5;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        stroke-dasharray: 1800;\n        stroke-dashoffset: 1800;\n        animation: growSummerStem 3.8s cubic-bezier(0.4, 0, 0.2, 1) forwards, summerSway 5.5s ease-in-out infinite 3.8s;\n        transform-origin: 50% 50%;\n      }\n      .summer-vine-accent {\n        stroke: #22c55e;\n        stroke-width: 2.2;\n        stroke-linecap: round;\n        fill: none;\n        stroke-dasharray: 1800;\n        stroke-dashoffset: 1800;\n        animation: growSummerStem 4.0s cubic-bezier(0.4, 0, 0.2, 1) forwards;\n      }\n      .summer-leaf-group {\n        opacity: 0;\n        animation: summerLeafBloom 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n        transform-origin: center;\n      }\n      .leaf-deep-summer { fill: #15803d; }\n      .leaf-bright-summer { fill: #4ade80; }\n      .leaf-vein-dark {\n        fill: none;\n        stroke: #14532d;\n        stroke-width: 1.3;\n        stroke-linecap: round;\n      }\n\n      /* 🌻 КРУПНЫЕ ЯРКИЕ ЗОЛОТИСТО-ЖЁЛТЫЕ ЛЕТНИЕ ЦВЕТЫ */\n      .yellow-flower-bloom {\n        opacity: 0;\n        animation: flowerPop 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n        transform-origin: center;\n      }\n      .firefly-glow {\n        animation: fireflyFlicker 3.2s ease-in-out infinite alternate;\n      }\n\n      @keyframes growSummerStem { to { stroke-dashoffset: 0; } }\n      @keyframes summerLeafBloom {\n        0% { transform: scale(0) rotate(-20deg); opacity: 0; }\n        80% { transform: scale(1.12) rotate(3deg); opacity: 1; }\n        100% { transform: scale(1) rotate(0deg); opacity: 1; }\n      }\n      @keyframes flowerPop {\n        0% { transform: scale(0) rotate(-40deg); opacity: 0; }\n        75% { transform: scale(1.22) rotate(8deg); opacity: 1; }\n        100% { transform: scale(1) rotate(0deg); opacity: 1; }\n      }\n      @keyframes summerSway {\n        0%, 100% { transform: translateY(0) rotate(0deg); }\n        50% { transform: translateY(-4px) rotate(0.4deg); }\n      }\n      @keyframes fireflyFlicker {\n        0% { transform: translate(0, 0); opacity: 0.3; }\n        100% { transform: translate(14px, -16px); opacity: 0.9; filter: drop-shadow(0 0 4px #eab308); }\n      }\n    </style>\n</defs>\n<g>\n<!-- Glow underlay -->\n<path class=\"summer-vine-glow\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145\"></path>\n<!-- Main summer stem -->\n<path class=\"summer-vine-main\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145\"></path>\n<!-- Highlight vein -->\n<path class=\"summer-vine-accent\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145\"></path>\n<!-- Lush elongated summer leaves -->\n<!-- Node 1 -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 1.0s; transform-origin: 100px 145px;\">\n<path class=\"leaf-deep-summer\" d=\"M 100,145 C 80,105 100,60 135,75 C 145,105 125,145 100,145 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 100,145 Q 115,105 135,75\"></path>\n</g>\n<g class=\"summer-leaf-group\" style=\"animation-delay: 1.2s; transform-origin: 110px 150px;\">\n<path class=\"leaf-bright-summer\" d=\"M 110,150 C 135,125 170,115 185,135 C 170,155 140,165 110,150 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 110,150 Q 145,135 185,135\"></path>\n</g>\n<!-- Node 2 -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 1.5s; transform-origin: 210px 95px;\">\n<path class=\"leaf-deep-summer\" d=\"M 210,95 C 190,55 220,25 255,40 C 260,75 235,105 210,95 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 210,95 Q 230,60 255,40\"></path>\n</g>\n<g class=\"summer-leaf-group\" style=\"animation-delay: 1.7s; transform-origin: 220px 102px;\">\n<path class=\"leaf-bright-summer\" d=\"M 220,102 C 250,85 285,85 295,110 C 275,125 245,125 220,102 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 220,102 Q 255,95 295,110\"></path>\n</g>\n<!-- Node 3 -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 1.9s; transform-origin: 320px 155px;\">\n<path class=\"leaf-deep-summer\" d=\"M 320,155 C 305,115 330,85 365,100 C 375,130 350,165 320,155 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 320,155 Q 340,120 365,100\"></path>\n</g>\n<g class=\"summer-leaf-group\" style=\"animation-delay: 2.1s; transform-origin: 330px 165px;\">\n<path class=\"leaf-bright-summer\" d=\"M 330,165 C 355,145 390,145 405,170 C 385,185 355,185 330,165 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 330,165 Q 365,155 405,170\"></path>\n</g>\n<!-- Node 4 -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 2.3s; transform-origin: 440px 225px;\">\n<path class=\"leaf-deep-summer\" d=\"M 440,225 C 415,250 425,285 455,280 C 475,260 465,230 440,225 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 440,225 Q 435,260 455,280\"></path>\n</g>\n<g class=\"summer-leaf-group\" style=\"animation-delay: 2.5s; transform-origin: 450px 220px;\">\n<path class=\"leaf-bright-summer\" d=\"M 450,220 C 480,215 510,230 515,255 C 495,265 470,250 450,220 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 450,220 Q 485,230 515,255\"></path>\n</g>\n<!-- Node 5 -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 2.7s; transform-origin: 580px 185px;\">\n<path class=\"leaf-deep-summer\" d=\"M 580,185 C 565,145 590,120 625,135 C 635,165 610,195 580,185 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 580,185 Q 600,150 625,135\"></path>\n</g>\n<g class=\"summer-leaf-group\" style=\"animation-delay: 2.9s; transform-origin: 590px 190px;\">\n<path class=\"leaf-bright-summer\" d=\"M 590,190 C 620,180 650,195 655,220 C 635,230 605,220 590,190 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 590,190 Q 625,195 655,220\"></path>\n</g>\n<!-- Node 6 -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 3.1s; transform-origin: 690px 100px;\">\n<path class=\"leaf-bright-summer\" d=\"M 690,100 C 670,60 700,30 735,45 C 745,75 720,110 690,100 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 690,100 Q 710,65 735,45\"></path>\n</g>\n<g class=\"summer-leaf-group\" style=\"animation-delay: 3.3s; transform-origin: 700px 105px;\">\n<path class=\"leaf-deep-summer\" d=\"M 700,105 C 730,90 765,95 775,120 C 755,135 725,130 700,105 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 700,105 Q 735,105 775,120\"></path>\n</g>\n<!-- Node 7 -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 3.5s; transform-origin: 840px 140px;\">\n<path class=\"leaf-deep-summer\" d=\"M 840,140 C 825,100 850,75 885,90 C 895,120 870,150 840,140 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 840,140 Q 860,105 885,90\"></path>\n</g>\n<g class=\"summer-leaf-group\" style=\"animation-delay: 3.6s; transform-origin: 850px 145px;\">\n<path class=\"leaf-bright-summer\" d=\"M 850,145 C 880,130 910,135 915,155 C 900,170 875,165 850,145 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 850,145 Q 880,140 915,155\"></path>\n</g>\n<!-- Node 8 -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 3.7s; transform-origin: 960px 220px;\">\n<path class=\"leaf-bright-summer\" d=\"M 960,220 C 940,250 955,280 985,275 C 1005,255 990,225 960,220 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 960,220 Q 965,255 985,275\"></path>\n</g>\n<!-- Node 9 Tip -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 3.9s; transform-origin: 1110px 175px;\">\n<path class=\"leaf-deep-summer\" d=\"M 1110,175 C 1130,145 1160,145 1175,160 C 1160,185 1135,190 1110,175 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 1110,175 Q 1145,155 1175,160\"></path>\n</g>\n<!-- 🌻 КРУПНЫЕ СИЯЮЩИЕ ЖЁЛТЫЕ ЦВЕТЫ (Масштаб увеличен в ~1.75x раза) -->\n<!-- Flower 1 (crest 1) -->\n<g class=\"yellow-flower-bloom\" style=\"animation-delay: 2.1s; transform-origin: 175px 85px;\">\n<g transform=\"translate(175, 85) scale(1.75)\">\n<circle cx=\"0\" cy=\"-9\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"8.5\" cy=\"-2.8\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"5.3\" cy=\"7.2\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-5.3\" cy=\"7.2\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-8.5\" cy=\"-2.8\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#ea580c\" r=\"4.3\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"2.2\"></circle>\n</g>\n</g>\n<!-- Flower 2 (lower valley 1) -->\n<g class=\"yellow-flower-bloom\" style=\"animation-delay: 2.6s; transform-origin: 410px 240px;\">\n<g transform=\"translate(410, 240) scale(1.8)\">\n<circle cx=\"0\" cy=\"-9\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"8.5\" cy=\"-2.8\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"5.3\" cy=\"7.2\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-5.3\" cy=\"7.2\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-8.5\" cy=\"-2.8\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#ea580c\" r=\"4.3\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"2.2\"></circle>\n</g>\n</g>\n<!-- Flower 3 (crest 2) -->\n<g class=\"yellow-flower-bloom\" style=\"animation-delay: 3.2s; transform-origin: 750px 80px;\">\n<g transform=\"translate(750, 80) scale(1.75)\">\n<circle cx=\"0\" cy=\"-9\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"8.5\" cy=\"-2.8\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"5.3\" cy=\"7.2\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-5.3\" cy=\"7.2\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-8.5\" cy=\"-2.8\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#ea580c\" r=\"4.3\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"2.2\"></circle>\n</g>\n</g>\n<!-- Flower 4 (lower valley 2) -->\n<g class=\"yellow-flower-bloom\" style=\"animation-delay: 3.6s; transform-origin: 1010px 245px;\">\n<g transform=\"translate(1010, 245) scale(1.7)\">\n<circle cx=\"0\" cy=\"-8.5\" fill=\"#facc15\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"8\" cy=\"-2.5\" fill=\"#eab308\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"5\" cy=\"7\" fill=\"#facc15\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-5\" cy=\"7\" fill=\"#eab308\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-8\" cy=\"-2.5\" fill=\"#facc15\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#ea580c\" r=\"4.0\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"2.0\"></circle>\n</g>\n</g>\n<!-- Summer fireflies / golden pollen -->\n<g class=\"firefly-glow\">\n<circle cx=\"165\" cy=\"70\" fill=\"#fef08a\" opacity=\"0.9\" r=\"3.5\"></circle>\n<circle cx=\"370\" cy=\"115\" fill=\"#fde047\" opacity=\"0.85\" r=\"4\"></circle>\n<circle cx=\"630\" cy=\"110\" fill=\"#fef08a\" opacity=\"0.9\" r=\"3.2\"></circle>\n<circle cx=\"855\" cy=\"65\" fill=\"#facc15\" opacity=\"0.85\" r=\"4\"></circle>\n<circle cx=\"1065\" cy=\"205\" fill=\"#fde047\" opacity=\"0.9\" r=\"3.5\"></circle>\n</g>\n</g>\n</svg>",
    autumn: "<svg width=\"100%\" height=\"100%\" preserveAspectRatio=\"none\" viewBox=\"0 0 1200 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<defs>\n<style>\n      .autumn-stem-glow {\n        stroke: #d97706;\n        stroke-width: 10;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        opacity: 0.35;\n        filter: blur(2px);\n        stroke-dasharray: 1800;\n        stroke-dashoffset: 1800;\n        animation: growStem 3.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;\n      }\n      .autumn-main-stem {\n        stroke: #5d4037;\n        stroke-width: 6.5;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        stroke-dasharray: 1800;\n        stroke-dashoffset: 1800;\n        animation: growStem 3.8s cubic-bezier(0.4, 0, 0.2, 1) forwards, autumnBreeze 6s ease-in-out infinite 3.8s;\n        transform-origin: 50% 50%;\n      }\n      .autumn-sub-tendril {\n        stroke: #8d6e63;\n        stroke-width: 3;\n        stroke-linecap: round;\n        fill: none;\n        stroke-dasharray: 260;\n        stroke-dashoffset: 260;\n        animation: growStem 2.2s ease forwards 1.4s;\n      }\n\n      /* Elongated autumn leaves in warm seasonal palette */\n      .autumn-leaf {\n        opacity: 0;\n        animation: leafBloom 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n        transform-origin: center;\n      }\n      .leaf-crimson { fill: #c62828; }\n      .leaf-amber { fill: #f57f17; }\n      .leaf-terracotta { fill: #d84315; }\n      .leaf-gold { fill: #ffb300; }\n      .leaf-russet { fill: #8d6e63; }\n      .leaf-copper { fill: #e65100; }\n\n      .leaf-vein-dark {\n        fill: none;\n        stroke: #7f0000;\n        stroke-width: 1.3;\n        stroke-linecap: round;\n      }\n      .leaf-vein-gold {\n        fill: none;\n        stroke: #b26a00;\n        stroke-width: 1.3;\n        stroke-linecap: round;\n      }\n      .leaf-vein-russet {\n        fill: none;\n        stroke: #bf360c;\n        stroke-width: 1.3;\n        stroke-linecap: round;\n      }\n\n      /* Rowan / Autumn Berry clusters */\n      .rowan-berry {\n        opacity: 0;\n        animation: berryRipen 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n        transform-origin: center;\n      }\n\n      /* Swirling & drifting falling leaves */\n      .drifting-leaf-1 {\n        animation: autumnDrift1 6.5s linear infinite 2.2s;\n        transform-origin: center;\n      }\n      .drifting-leaf-2 {\n        animation: autumnDrift2 7.8s linear infinite 3.5s;\n        transform-origin: center;\n      }\n      .drifting-leaf-3 {\n        animation: autumnDrift3 7.0s linear infinite 1.6s;\n        transform-origin: center;\n      }\n\n      /* Amber warm spores / embers */\n      .autumn-spore {\n        animation: sporeGlow 3.5s ease-in-out infinite alternate;\n      }\n\n      @keyframes growStem {\n        to { stroke-dashoffset: 0; }\n      }\n      @keyframes leafBloom {\n        0% { transform: scale(0) rotate(-22deg); opacity: 0; }\n        75% { transform: scale(1.15) rotate(3deg); opacity: 1; }\n        100% { transform: scale(1) rotate(0deg); opacity: 1; }\n      }\n      @keyframes berryRipen {\n        0% { transform: scale(0); opacity: 0; }\n        100% { transform: scale(1); opacity: 1; }\n      }\n      @keyframes autumnBreeze {\n        0%, 100% { transform: translateY(0) rotate(0deg); }\n        50% { transform: translateY(-4px) rotate(0.35deg); }\n      }\n      @keyframes sporeGlow {\n        0% { transform: translate(0, 0); opacity: 0.3; }\n        100% { transform: translate(14px, -16px); opacity: 0.85; filter: drop-shadow(0 0 4px #f59e0b); }\n      }\n      @keyframes autumnDrift1 {\n        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }\n        35% { transform: translate(65px, 35px) rotate(45deg); }\n        70% { transform: translate(145px, 85px) rotate(110deg); opacity: 0.9; }\n        100% { transform: translate(235px, 150px) rotate(190deg); opacity: 0; }\n      }\n      @keyframes autumnDrift2 {\n        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }\n        35% { transform: translate(60px, 40px) rotate(-40deg); }\n        75% { transform: translate(140px, 90px) rotate(-100deg); opacity: 0.85; }\n        100% { transform: translate(230px, 150px) rotate(-170deg); opacity: 0; }\n      }\n      @keyframes autumnDrift3 {\n        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }\n        40% { transform: translate(75px, 35px) rotate(40deg); }\n        80% { transform: translate(160px, 95px) rotate(105deg); opacity: 0.8; }\n        100% { transform: translate(245px, 155px) rotate(160deg); opacity: 0; }\n      }\n    </style>\n</defs>\n<g>\n<!-- Soft warm amber under-glow -->\n<path class=\"autumn-stem-glow\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145\"></path>\n<!-- Main woody runner stem matching Spring/Summer/Winter path -->\n<path class=\"autumn-main-stem\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145\"></path>\n<!-- Delicate woody tendrils branching out -->\n<path class=\"autumn-sub-tendril\" d=\"M 190,105 Q 215,60 185,45 T 160,75\" style=\"animation-delay: 1.4s;\"></path>\n<path class=\"autumn-sub-tendril\" d=\"M 475,225 Q 505,270 540,255 T 525,220\" style=\"animation-delay: 2.0s;\"></path>\n<path class=\"autumn-sub-tendril\" d=\"M 755,95 Q 785,50 825,65 T 805,100\" style=\"animation-delay: 2.6s;\"></path>\n<path class=\"autumn-sub-tendril\" d=\"M 1025,230 Q 1055,275 1095,260 T 1075,225\" style=\"animation-delay: 3.2s;\"></path>\n<!-- 🍂 Elongated (lanceolate) leaves exactly in the layout and rhythm of Spring/Summer, colored in rich Autumn hues -->\n<!-- Node 1: x: 100-110, y: 145-150 -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 1.0s; transform-origin: 100px 145px;\">\n<path class=\"leaf-crimson\" d=\"M 100,145 C 80,105 100,60 135,75 C 145,105 125,145 100,145 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 100,145 Q 115,105 135,75\"></path>\n</g>\n<g class=\"autumn-leaf\" style=\"animation-delay: 1.2s; transform-origin: 110px 150px;\">\n<path class=\"leaf-amber\" d=\"M 110,150 C 135,125 170,115 185,135 C 170,155 140,165 110,150 Z\"></path>\n<path class=\"leaf-vein-gold\" d=\"M 110,150 Q 145,135 185,135\"></path>\n</g>\n<!-- Node 2: x: 210-220, y: 95-102 -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 1.5s; transform-origin: 210px 95px;\">\n<path class=\"leaf-terracotta\" d=\"M 210,95 C 190,55 220,25 255,40 C 260,75 235,105 210,95 Z\"></path>\n<path class=\"leaf-vein-russet\" d=\"M 210,95 Q 230,60 255,40\"></path>\n</g>\n<g class=\"autumn-leaf\" style=\"animation-delay: 1.7s; transform-origin: 220px 102px;\">\n<path class=\"leaf-gold\" d=\"M 220,102 C 250,85 285,85 295,110 C 275,125 245,125 220,102 Z\"></path>\n<path class=\"leaf-vein-gold\" d=\"M 220,102 Q 255,95 295,110\"></path>\n</g>\n<!-- Node 3: x: 320-330, y: 155-165 -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 1.9s; transform-origin: 320px 155px;\">\n<path class=\"leaf-copper\" d=\"M 320,155 C 305,115 330,85 365,100 C 375,130 350,165 320,155 Z\"></path>\n<path class=\"leaf-vein-russet\" d=\"M 320,155 Q 340,120 365,100\"></path>\n</g>\n<g class=\"autumn-leaf\" style=\"animation-delay: 2.1s; transform-origin: 330px 165px;\">\n<path class=\"leaf-amber\" d=\"M 330,165 C 355,145 390,145 405,170 C 385,185 355,185 330,165 Z\"></path>\n<path class=\"leaf-vein-gold\" d=\"M 330,165 Q 365,155 405,170\"></path>\n</g>\n<!-- Node 4: x: 440-450, y: 220-225 -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 2.3s; transform-origin: 440px 225px;\">\n<path class=\"leaf-crimson\" d=\"M 440,225 C 415,250 425,285 455,280 C 475,260 465,230 440,225 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 440,225 Q 435,260 455,280\"></path>\n</g>\n<g class=\"autumn-leaf\" style=\"animation-delay: 2.5s; transform-origin: 450px 220px;\">\n<path class=\"leaf-gold\" d=\"M 450,220 C 480,215 510,230 515,255 C 495,265 470,250 450,220 Z\"></path>\n<path class=\"leaf-vein-gold\" d=\"M 450,220 Q 485,230 515,255\"></path>\n</g>\n<!-- Node 5: x: 580-590, y: 185-190 -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 2.7s; transform-origin: 580px 185px;\">\n<path class=\"leaf-terracotta\" d=\"M 580,185 C 565,145 590,120 625,135 C 635,165 610,195 580,185 Z\"></path>\n<path class=\"leaf-vein-russet\" d=\"M 580,185 Q 600,150 625,135\"></path>\n</g>\n<g class=\"autumn-leaf\" style=\"animation-delay: 2.9s; transform-origin: 590px 190px;\">\n<path class=\"leaf-amber\" d=\"M 590,190 C 620,180 650,195 655,220 C 635,230 605,220 590,190 Z\"></path>\n<path class=\"leaf-vein-gold\" d=\"M 590,190 Q 625,195 655,220\"></path>\n</g>\n<!-- Node 6: x: 690-700, y: 100-105 -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 3.1s; transform-origin: 690px 100px;\">\n<path class=\"leaf-copper\" d=\"M 690,100 C 670,60 700,30 735,45 C 745,75 720,110 690,100 Z\"></path>\n<path class=\"leaf-vein-russet\" d=\"M 690,100 Q 710,65 735,45\"></path>\n</g>\n<g class=\"autumn-leaf\" style=\"animation-delay: 3.3s; transform-origin: 700px 105px;\">\n<path class=\"leaf-crimson\" d=\"M 700,105 C 730,90 765,95 775,120 C 755,135 725,130 700,105 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 700,105 Q 735,105 775,120\"></path>\n</g>\n<!-- Node 7: x: 840, y: 140 -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 3.5s; transform-origin: 840px 140px;\">\n<path class=\"leaf-terracotta\" d=\"M 840,140 C 825,100 850,75 885,90 C 895,120 870,150 840,140 Z\"></path>\n<path class=\"leaf-vein-russet\" d=\"M 840,140 Q 860,105 885,90\"></path>\n</g>\n<g class=\"autumn-leaf\" style=\"animation-delay: 3.6s; transform-origin: 850px 145px;\">\n<path class=\"leaf-gold\" d=\"M 850,145 C 880,130 910,135 915,155 C 900,170 875,165 850,145 Z\"></path>\n<path class=\"leaf-vein-gold\" d=\"M 850,145 Q 880,140 915,155\"></path>\n</g>\n<!-- Node 8: x: 960, y: 220 -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 3.7s; transform-origin: 960px 220px;\">\n<path class=\"leaf-amber\" d=\"M 960,220 C 940,250 955,280 985,275 C 1005,255 990,225 960,220 Z\"></path>\n<path class=\"leaf-vein-gold\" d=\"M 960,220 Q 965,255 985,275\"></path>\n</g>\n<!-- Node 9 Tip: x: 1110, y: 175 -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 3.9s; transform-origin: 1110px 175px;\">\n<path class=\"leaf-crimson\" d=\"M 1110,175 C 1130,145 1160,145 1175,160 C 1160,185 1135,190 1110,175 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 1110,175 Q 1145,155 1175,160\"></path>\n</g>\n<!-- 🍒 Rowan / Autumn Berries clusters nestled like blossoms in Spring and yellow flowers in Summer -->\n<!-- Cluster 1 (near crest 1) -->\n<g class=\"rowan-berry\" style=\"animation-delay: 2.1s;\">\n<circle cx=\"215\" cy=\"74\" fill=\"#d32f2f\" r=\"5.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"224\" cy=\"70\" fill=\"#e53935\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"219\" cy=\"82\" fill=\"#c62828\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"227\" cy=\"80\" fill=\"#d32f2f\" r=\"4.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"217\" cy=\"72\" fill=\"#ffcdd2\" opacity=\"0.8\" r=\"1.5\"></circle>\n</g>\n<!-- Cluster 2 (near lower wave dip) -->\n<g class=\"rowan-berry\" style=\"animation-delay: 2.8s;\">\n<circle cx=\"505\" cy=\"245\" fill=\"#d32f2f\" r=\"6\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"515\" cy=\"242\" fill=\"#e53935\" r=\"5.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"510\" cy=\"254\" fill=\"#c62828\" r=\"5.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"521\" cy=\"252\" fill=\"#d32f2f\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"508\" cy=\"243\" fill=\"#ffcdd2\" opacity=\"0.8\" r=\"1.6\"></circle>\n</g>\n<!-- Cluster 3 (near crest 2) -->\n<g class=\"rowan-berry\" style=\"animation-delay: 3.4s;\">\n<circle cx=\"788\" cy=\"76\" fill=\"#d32f2f\" r=\"5.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"798\" cy=\"73\" fill=\"#e53935\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"793\" cy=\"84\" fill=\"#c62828\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"803\" cy=\"82\" fill=\"#d32f2f\" r=\"4.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"790\" cy=\"74\" fill=\"#ffcdd2\" opacity=\"0.8\" r=\"1.5\"></circle>\n</g>\n<!-- Cluster 4 (near right lower dip) -->\n<g class=\"rowan-berry\" style=\"animation-delay: 3.8s;\">\n<circle cx=\"1010\" cy=\"245\" fill=\"#d32f2f\" r=\"5.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"1020\" cy=\"242\" fill=\"#e53935\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"1015\" cy=\"253\" fill=\"#c62828\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"1012\" cy=\"243\" fill=\"#ffcdd2\" opacity=\"0.8\" r=\"1.5\"></circle>\n</g>\n<!-- 🍂 Gently Drifting & Swirling Autumn Leaves floating in breeze -->\n<!-- Drifting Leaf 1 (Golden-amber) -->\n<g class=\"drifting-leaf-1\">\n<g transform=\"translate(285, 90) scale(0.65)\">\n<path class=\"leaf-amber\" d=\"M 0,0 C -15,-25 10,-35 25,-15 C 40,-35 60,-15 45,10 C 50,30 20,35 20,20 C 10,35 -15,25 -10,0 Z\"></path>\n</g>\n</g>\n<!-- Drifting Leaf 2 (Crimson-red) -->\n<g class=\"drifting-leaf-2\">\n<g transform=\"translate(635, 95) scale(0.68)\">\n<path class=\"leaf-crimson\" d=\"M 0,0 C -15,-25 10,-35 25,-15 C 40,-35 60,-15 45,10 C 50,30 20,35 20,20 C 10,35 -15,25 -10,0 Z\"></path>\n</g>\n</g>\n<!-- Drifting Leaf 3 (Terracotta) -->\n<g class=\"drifting-leaf-3\">\n<g transform=\"translate(915, 175) scale(0.62)\">\n<path class=\"leaf-terracotta\" d=\"M 0,0 C -15,-25 10,-35 25,-15 C 40,-35 60,-15 45,10 C 50,30 20,35 20,20 C 10,35 -15,25 -10,0 Z\"></path>\n</g>\n</g>\n<!-- Ambient glowing autumn spores / golden pollen particles -->\n<g class=\"autumn-spore\">\n<circle cx=\"170\" cy=\"80\" fill=\"#f59e0b\" opacity=\"0.85\" r=\"2.5\"></circle>\n<circle cx=\"370\" cy=\"115\" fill=\"#fbbf24\" opacity=\"0.8\" r=\"3\"></circle>\n<circle cx=\"630\" cy=\"120\" fill=\"#ea580c\" opacity=\"0.85\" r=\"2.5\"></circle>\n<circle cx=\"850\" cy=\"70\" fill=\"#f59e0b\" opacity=\"0.8\" r=\"3\"></circle>\n<circle cx=\"1060\" cy=\"210\" fill=\"#fbbf24\" opacity=\"0.75\" r=\"2.5\"></circle>\n</g>\n</g>\n</svg>",
    winter: "<svg width=\"100%\" height=\"100%\" preserveAspectRatio=\"none\" viewBox=\"0 0 1200 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<defs>\n<style>\n      .winter-frost-glow {\n        stroke: #38bdf8;\n        stroke-width: 9;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        opacity: 0.4;\n        filter: blur(3px);\n        stroke-dasharray: 1800;\n        stroke-dashoffset: 1800;\n        animation: growFrostStem 3.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;\n      }\n      .winter-frost-stem {\n        stroke: #bae6fd;\n        stroke-width: 6;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        stroke-dasharray: 1800;\n        stroke-dashoffset: 1800;\n        animation: growFrostStem 3.8s cubic-bezier(0.4, 0, 0.2, 1) forwards, winterShiver 5.5s ease-in-out infinite 3.8s;\n        transform-origin: 50% 50%;\n      }\n      .winter-core-vein {\n        stroke: #ffffff;\n        stroke-width: 2.2;\n        stroke-linecap: round;\n        fill: none;\n        stroke-dasharray: 1800;\n        stroke-dashoffset: 1800;\n        animation: growFrostStem 4.0s cubic-bezier(0.4, 0, 0.2, 1) forwards;\n      }\n\n      /* Translucent white leaves (68-72% opacity) matching spring/summer elongated shape */\n      .winter-leaf-group {\n        opacity: 0;\n        animation: leafFrostCrystallize 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n        transform-origin: center;\n      }\n      .white-leaf-70 {\n        fill: #ffffff;\n        fill-opacity: 0.70;\n        stroke: #7dd3fc;\n        stroke-width: 1.5;\n        filter: drop-shadow(0 0 3px rgba(186, 230, 253, 0.5));\n      }\n      .white-leaf-65 {\n        fill: #f0f9ff;\n        fill-opacity: 0.68;\n        stroke: #38bdf8;\n        stroke-width: 1.4;\n        filter: drop-shadow(0 0 3px rgba(186, 230, 253, 0.5));\n      }\n      .white-leaf-vein {\n        fill: none;\n        stroke: #0284c7;\n        stroke-width: 1.2;\n        stroke-linecap: round;\n        opacity: 0.65;\n      }\n\n      /* Dancing snowflakes */\n      .snow-drift-1 { animation: driftSnow1 4.5s linear infinite; }\n      .snow-drift-2 { animation: driftSnow2 5.8s linear infinite 1.5s; }\n      .snow-drift-3 { animation: driftSnow3 5.0s linear infinite 2.8s; }\n\n      @keyframes growFrostStem { to { stroke-dashoffset: 0; } }\n      @keyframes leafFrostCrystallize {\n        0% { transform: scale(0) rotate(-18deg); opacity: 0; }\n        80% { transform: scale(1.12) rotate(3deg); opacity: 0.95; }\n        100% { transform: scale(1) rotate(0deg); opacity: 1; }\n      }\n      @keyframes winterShiver {\n        0%, 100% { transform: translateY(0) rotate(0deg); }\n        50% { transform: translateY(-3px) rotate(0.25deg); }\n      }\n      @keyframes driftSnow1 {\n        0% { transform: translate(0, -15px); opacity: 0; }\n        25% { opacity: 0.95; }\n        75% { opacity: 0.95; }\n        100% { transform: translate(45px, 115px) rotate(180deg); opacity: 0; }\n      }\n      @keyframes driftSnow2 {\n        0% { transform: translate(0, -15px); opacity: 0; }\n        25% { opacity: 0.9; }\n        75% { opacity: 0.9; }\n        100% { transform: translate(-40px, 125px) rotate(-180deg); opacity: 0; }\n      }\n      @keyframes driftSnow3 {\n        0% { transform: translate(0, -20px); opacity: 0; }\n        25% { opacity: 1; }\n        75% { opacity: 1; }\n        100% { transform: translate(35px, 130px) rotate(160deg); opacity: 0; }\n      }\n    </style>\n</defs>\n<g>\n<!-- Cyan glow underlay -->\n<path class=\"winter-frost-glow\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145\"></path>\n<!-- Frosted ice stem -->\n<path class=\"winter-frost-stem\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145\"></path>\n<!-- Crisp white vein -->\n<path class=\"winter-core-vein\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145\"></path>\n<!-- ❄️ Translucent White Leaves (form identical to spring & summer, 68-72% white opacity) -->\n<!-- Node 1 -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 1.0s; transform-origin: 100px 145px;\">\n<path class=\"white-leaf-70\" d=\"M 100,145 C 80,105 100,60 135,75 C 145,105 125,145 100,145 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 100,145 Q 115,105 135,75\"></path>\n</g>\n<g class=\"winter-leaf-group\" style=\"animation-delay: 1.2s; transform-origin: 110px 150px;\">\n<path class=\"white-leaf-65\" d=\"M 110,150 C 135,125 170,115 185,135 C 170,155 140,165 110,150 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 110,150 Q 145,135 185,135\"></path>\n</g>\n<!-- Node 2 -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 1.5s; transform-origin: 210px 95px;\">\n<path class=\"white-leaf-70\" d=\"M 210,95 C 190,55 220,25 255,40 C 260,75 235,105 210,95 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 210,95 Q 230,60 255,40\"></path>\n</g>\n<g class=\"winter-leaf-group\" style=\"animation-delay: 1.7s; transform-origin: 220px 102px;\">\n<path class=\"white-leaf-65\" d=\"M 220,102 C 250,85 285,85 295,110 C 275,125 245,125 220,102 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 220,102 Q 255,95 295,110\"></path>\n</g>\n<!-- Node 3 -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 1.9s; transform-origin: 320px 155px;\">\n<path class=\"white-leaf-70\" d=\"M 320,155 C 305,115 330,85 365,100 C 375,130 350,165 320,155 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 320,155 Q 340,120 365,100\"></path>\n</g>\n<g class=\"winter-leaf-group\" style=\"animation-delay: 2.1s; transform-origin: 330px 165px;\">\n<path class=\"white-leaf-65\" d=\"M 330,165 C 355,145 390,145 405,170 C 385,185 355,185 330,165 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 330,165 Q 365,155 405,170\"></path>\n</g>\n<!-- Node 4 -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 2.3s; transform-origin: 440px 225px;\">\n<path class=\"white-leaf-70\" d=\"M 440,225 C 415,250 425,285 455,280 C 475,260 465,230 440,225 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 440,225 Q 435,260 455,280\"></path>\n</g>\n<g class=\"winter-leaf-group\" style=\"animation-delay: 2.5s; transform-origin: 450px 220px;\">\n<path class=\"white-leaf-65\" d=\"M 450,220 C 480,215 510,230 515,255 C 495,265 470,250 450,220 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 450,220 Q 485,230 515,255\"></path>\n</g>\n<!-- Node 5 -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 2.7s; transform-origin: 580px 185px;\">\n<path class=\"white-leaf-70\" d=\"M 580,185 C 565,145 590,120 625,135 C 635,165 610,195 580,185 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 580,185 Q 600,150 625,135\"></path>\n</g>\n<g class=\"winter-leaf-group\" style=\"animation-delay: 2.9s; transform-origin: 590px 190px;\">\n<path class=\"white-leaf-65\" d=\"M 590,190 C 620,180 650,195 655,220 C 635,230 605,220 590,190 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 590,190 Q 625,195 655,220\"></path>\n</g>\n<!-- Node 6 -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 3.1s; transform-origin: 690px 100px;\">\n<path class=\"white-leaf-65\" d=\"M 690,100 C 670,60 700,30 735,45 C 745,75 720,110 690,100 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 690,100 Q 710,65 735,45\"></path>\n</g>\n<g class=\"winter-leaf-group\" style=\"animation-delay: 3.3s; transform-origin: 700px 105px;\">\n<path class=\"white-leaf-70\" d=\"M 700,105 C 730,90 765,95 775,120 C 755,135 725,130 700,105 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 700,105 Q 735,105 775,120\"></path>\n</g>\n<!-- Node 7 -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 3.5s; transform-origin: 840px 140px;\">\n<path class=\"white-leaf-70\" d=\"M 840,140 C 825,100 850,75 885,90 C 895,120 870,150 840,140 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 840,140 Q 860,105 885,90\"></path>\n</g>\n<g class=\"winter-leaf-group\" style=\"animation-delay: 3.6s; transform-origin: 850px 145px;\">\n<path class=\"white-leaf-65\" d=\"M 850,145 C 880,130 910,135 915,155 C 900,170 875,165 850,145 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 850,145 Q 880,140 915,155\"></path>\n</g>\n<!-- Node 8 -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 3.7s; transform-origin: 960px 220px;\">\n<path class=\"white-leaf-65\" d=\"M 960,220 C 940,250 955,280 985,275 C 1005,255 990,225 960,220 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 960,220 Q 965,255 985,275\"></path>\n</g>\n<!-- Node 9 Tip -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 3.9s; transform-origin: 1110px 175px;\">\n<path class=\"white-leaf-70\" d=\"M 1110,175 C 1130,145 1160,145 1175,160 C 1160,185 1135,190 1110,175 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 1110,175 Q 1145,155 1175,160\"></path>\n</g>\n<!-- ❄️ Swirling crystalline snowflakes -->\n<g class=\"snow-drift-1\" transform=\"translate(180, 75)\">\n<g stroke=\"#ffffff\" stroke-linecap=\"round\" stroke-width=\"1.6\">\n<line x1=\"-8\" x2=\"8\" y1=\"0\" y2=\"0\"></line>\n<line x1=\"0\" x2=\"0\" y1=\"-8\" y2=\"8\"></line>\n<line x1=\"-6\" x2=\"6\" y1=\"-6\" y2=\"6\"></line>\n<line x1=\"-6\" x2=\"6\" y1=\"6\" y2=\"-6\"></line>\n</g>\n<circle cx=\"0\" cy=\"0\" fill=\"#38bdf8\" r=\"2.2\"></circle>\n</g>\n<g class=\"snow-drift-2\" transform=\"translate(530, 115)\">\n<g stroke=\"#ffffff\" stroke-linecap=\"round\" stroke-width=\"1.6\">\n<line x1=\"-9\" x2=\"9\" y1=\"0\" y2=\"0\"></line>\n<line x1=\"0\" x2=\"0\" y1=\"-9\" y2=\"9\"></line>\n<line x1=\"-6.5\" x2=\"6.5\" y1=\"-6.5\" y2=\"6.5\"></line>\n<line x1=\"-6.5\" x2=\"6.5\" y1=\"6.5\" y2=\"-6.5\"></line>\n</g>\n<circle cx=\"0\" cy=\"0\" fill=\"#38bdf8\" r=\"2.2\"></circle>\n</g>\n<g class=\"snow-drift-3\" transform=\"translate(830, 70)\">\n<g stroke=\"#ffffff\" stroke-linecap=\"round\" stroke-width=\"1.6\">\n<line x1=\"-8\" x2=\"8\" y1=\"0\" y2=\"0\"></line>\n<line x1=\"0\" x2=\"0\" y1=\"-8\" y2=\"8\"></line>\n<line x1=\"-6\" x2=\"6\" y1=\"-6\" y2=\"6\"></line>\n<line x1=\"-6\" x2=\"6\" y1=\"6\" y2=\"-6\"></line>\n</g>\n<circle cx=\"0\" cy=\"0\" fill=\"#38bdf8\" r=\"2.2\"></circle>\n</g>\n<!-- Ambient falling snow specks -->\n<g class=\"snow-drift-1\">\n<circle cx=\"280\" cy=\"65\" fill=\"#ffffff\" opacity=\"0.9\" r=\"3\"></circle>\n<circle cx=\"680\" cy=\"80\" fill=\"#e0f2fe\" opacity=\"0.85\" r=\"2.5\"></circle>\n<circle cx=\"990\" cy=\"140\" fill=\"#ffffff\" opacity=\"0.9\" r=\"3\"></circle>\n</g>\n<g class=\"snow-drift-2\">\n<circle cx=\"370\" cy=\"110\" fill=\"#bae6fd\" opacity=\"0.9\" r=\"2.5\"></circle>\n<circle cx=\"770\" cy=\"60\" fill=\"#ffffff\" opacity=\"0.95\" r=\"3\"></circle>\n<circle cx=\"1080\" cy=\"170\" fill=\"#e0f2fe\" opacity=\"0.85\" r=\"2.5\"></circle>\n</g>\n</g>\n</svg>"
  };

  const SEASON_VINE_SVG_LONG = {
    spring: "<svg width=\"100%\" height=\"100%\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 2400 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<defs>\n<style>\n      .spring-vine-glow {\n        stroke: #4ade80;\n        stroke-width: 9;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        opacity: 0.3;\n        filter: blur(2px);\n        stroke-dasharray: 3600;\n        stroke-dashoffset: 3600;\n        animation: growStemSpring 4.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;\n      }\n      .spring-vine-main {\n        stroke: #2e7d32;\n        stroke-width: 6;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        stroke-dasharray: 3600;\n        stroke-dashoffset: 3600;\n        animation: growStemSpring 4.6s cubic-bezier(0.4, 0, 0.2, 1) forwards, springBreeze 6.5s ease-in-out infinite 4.6s;\n        transform-origin: 50% 50%;\n      }\n      .spring-vine-accent {\n        stroke: #66bb6a;\n        stroke-width: 2.2;\n        stroke-linecap: round;\n        fill: none;\n        stroke-dasharray: 3600;\n        stroke-dashoffset: 3600;\n        animation: growStemSpring 4.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;\n      }\n      .spring-leaf-group {\n        opacity: 0;\n        animation: leafUnfold 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n        transform-origin: center;\n      }\n      .leaf-lime { fill: #81c784; }\n      .leaf-emerald { fill: #388e3c; }\n      .leaf-vein-green {\n        fill: none;\n        stroke: #1b5e20;\n        stroke-width: 1.3;\n        stroke-linecap: round;\n      }\n      .spring-flower-bloom {\n        opacity: 0;\n        animation: flowerPop 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n        transform-origin: center;\n      }\n      .spring-pollen {\n        animation: pollenDrift 3.8s ease-in-out infinite alternate;\n      }\n\n      @keyframes growStemSpring { to { stroke-dashoffset: 0; } }\n      @keyframes leafUnfold {\n        0% { transform: scale(0) rotate(-20deg); opacity: 0; }\n        80% { transform: scale(1.12) rotate(3deg); opacity: 1; }\n        100% { transform: scale(1) rotate(0deg); opacity: 1; }\n      }\n      @keyframes flowerPop {\n        0% { transform: scale(0) rotate(-40deg); opacity: 0; }\n        75% { transform: scale(1.22) rotate(8deg); opacity: 1; }\n        100% { transform: scale(1) rotate(0deg); opacity: 1; }\n      }\n      @keyframes springBreeze {\n        0%, 100% { transform: translateY(0) rotate(0deg); }\n        50% { transform: translateY(-4px) rotate(0.25deg); }\n      }\n      @keyframes pollenDrift {\n        0% { transform: translate(0, 0); opacity: 0.3; }\n        100% { transform: translate(14px, -18px); opacity: 0.9; filter: drop-shadow(0 0 3px #81c784); }\n      }\n    </style>\n</defs>\n<g>\n<!-- Extended Path (2400px ultra-long double wave) -->\n<path class=\"spring-vine-glow\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145 C 1255,75 1340,80 1445,165 C 1545,245 1630,240 1725,150 C 1815,65 1905,80 2005,175 C 2085,255 2175,240 2360,145\"></path>\n<path class=\"spring-vine-main\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145 C 1255,75 1340,80 1445,165 C 1545,245 1630,240 1725,150 C 1815,65 1905,80 2005,175 C 2085,255 2175,240 2360,145\"></path>\n<path class=\"spring-vine-accent\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145 C 1255,75 1340,80 1445,165 C 1545,245 1630,240 1725,150 C 1815,65 1905,80 2005,175 C 2085,255 2175,240 2360,145\"></path>\n<!-- Node 1 -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 0.8s; transform-origin: 100px 145px;\">\n<path class=\"leaf-emerald\" d=\"M 100,145 C 80,105 100,60 135,75 C 145,105 125,145 100,145 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 100,145 Q 115,105 135,75\"></path>\n</g>\n<g class=\"spring-leaf-group\" style=\"animation-delay: 1.0s; transform-origin: 110px 150px;\">\n<path class=\"leaf-lime\" d=\"M 110,150 C 135,125 170,115 185,135 C 170,155 140,165 110,150 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 110,150 Q 145,135 185,135\"></path>\n</g>\n<!-- Node 2 -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 1.2s; transform-origin: 210px 95px;\">\n<path class=\"leaf-emerald\" d=\"M 210,95 C 190,55 220,25 255,40 C 260,75 235,105 210,95 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 210,95 Q 230,60 255,40\"></path>\n</g>\n<g class=\"spring-leaf-group\" style=\"animation-delay: 1.4s; transform-origin: 220px 102px;\">\n<path class=\"leaf-lime\" d=\"M 220,102 C 250,85 285,85 295,110 C 275,125 245,125 220,102 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 220,102 Q 255,95 295,110\"></path>\n</g>\n<!-- Flower 1 (crest 1) -->\n<g class=\"spring-flower-bloom\" style=\"animation-delay: 1.5s; transform-origin: 175px 85px;\">\n<g transform=\"translate(175, 85) scale(1.8)\">\n<path d=\"M 0,0 C -8,-14 8,-14 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 14,-8 14,8 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 8,14 -8,14 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C -14,8 -14,-8 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<circle cx=\"0\" cy=\"0\" fill=\"#f43f5e\" r=\"3.4\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"1.6\"></circle>\n</g>\n</g>\n<!-- Node 3 -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 1.7s; transform-origin: 320px 155px;\">\n<path class=\"leaf-emerald\" d=\"M 320,155 C 305,115 330,85 365,100 C 375,130 350,165 320,155 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 320,155 Q 340,120 365,100\"></path>\n</g>\n<g class=\"spring-leaf-group\" style=\"animation-delay: 1.9s; transform-origin: 330px 165px;\">\n<path class=\"leaf-lime\" d=\"M 330,165 C 355,145 390,145 405,170 C 385,185 355,185 330,165 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 330,165 Q 365,155 405,170\"></path>\n</g>\n<!-- Node 4 & Flower 2 -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 2.1s; transform-origin: 440px 225px;\">\n<path class=\"leaf-emerald\" d=\"M 440,225 C 415,250 425,285 455,280 C 475,260 465,230 440,225 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 440,225 Q 435,260 455,280\"></path>\n</g>\n<g class=\"spring-flower-bloom\" style=\"animation-delay: 2.2s; transform-origin: 410px 240px;\">\n<g transform=\"translate(410, 240) scale(1.8)\">\n<path d=\"M 0,0 C -9,-15 9,-15 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 15,-9 15,9 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 9,15 -9,15 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C -15,9 -15,-9 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<circle cx=\"0\" cy=\"0\" fill=\"#f43f5e\" r=\"3.4\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"1.6\"></circle>\n</g>\n</g>\n<!-- Node 5 & Node 6 -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 2.4s; transform-origin: 580px 185px;\">\n<path class=\"leaf-emerald\" d=\"M 580,185 C 565,145 590,120 625,135 C 635,165 610,195 580,185 Z\"></path>\n</g>\n<g class=\"spring-leaf-group\" style=\"animation-delay: 2.6s; transform-origin: 690px 100px;\">\n<path class=\"leaf-lime\" d=\"M 690,100 C 670,60 700,30 735,45 C 745,75 720,110 690,100 Z\"></path>\n</g>\n<!-- Flower 3 -->\n<g class=\"spring-flower-bloom\" style=\"animation-delay: 2.7s; transform-origin: 750px 80px;\">\n<g transform=\"translate(750, 80) scale(1.8)\">\n<path d=\"M 0,0 C -9,-15 9,-15 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 15,-9 15,9 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 9,15 -9,15 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C -15,9 -15,-9 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<circle cx=\"0\" cy=\"0\" fill=\"#f43f5e\" r=\"3.4\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"1.6\"></circle>\n</g>\n</g>\n<!-- Node 7, 8 & Flower 4 -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 2.9s; transform-origin: 840px 140px;\">\n<path class=\"leaf-emerald\" d=\"M 840,140 C 825,100 850,75 885,90 C 895,120 870,150 840,140 Z\"></path>\n</g>\n<g class=\"spring-flower-bloom\" style=\"animation-delay: 3.1s; transform-origin: 1010px 245px;\">\n<g transform=\"translate(1010, 245) scale(1.8)\">\n<path d=\"M 0,0 C -8,-14 8,-14 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 14,-8 14,8 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 8,14 -8,14 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C -14,8 -14,-8 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<circle cx=\"0\" cy=\"0\" fill=\"#f43f5e\" r=\"3.4\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"1.6\"></circle>\n</g>\n</g>\n<!-- CONTINUATION INTO ULTRA-LONG SECTION (1200px -> 2400px) -->\n<!-- Node 10 (Crest 3) -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 3.3s; transform-origin: 1210px 95px;\">\n<path class=\"leaf-emerald\" d=\"M 1210,95 C 1190,55 1220,25 1255,40 C 1260,75 1235,105 1210,95 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 1210,95 Q 1230,60 1255,40\"></path>\n</g>\n<g class=\"spring-leaf-group\" style=\"animation-delay: 3.4s; transform-origin: 1220px 102px;\">\n<path class=\"leaf-lime\" d=\"M 1220,102 C 1250,85 1285,85 1295,110 C 1275,125 1245,125 1220,102 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 1220,102 Q 1255,95 1295,110\"></path>\n</g>\n<!-- Flower 5 (Crest 3) -->\n<g class=\"spring-flower-bloom\" style=\"animation-delay: 3.5s; transform-origin: 1285px 85px;\">\n<g transform=\"translate(1285, 85) scale(1.8)\">\n<path d=\"M 0,0 C -8,-14 8,-14 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 14,-8 14,8 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 8,14 -8,14 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C -14,8 -14,-8 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<circle cx=\"0\" cy=\"0\" fill=\"#f43f5e\" r=\"3.4\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"1.6\"></circle>\n</g>\n</g>\n<!-- Node 11 (Valley 3) -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 3.7s; transform-origin: 1440px 225px;\">\n<path class=\"leaf-emerald\" d=\"M 1440,225 C 1415,250 1425,285 1455,280 C 1475,260 1465,230 1440,225 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 1440,225 Q 1435,260 1455,280\"></path>\n</g>\n<g class=\"spring-leaf-group\" style=\"animation-delay: 3.8s; transform-origin: 1450px 220px;\">\n<path class=\"leaf-lime\" d=\"M 1450,220 C 1480,215 1510,230 1515,255 C 1495,265 1470,250 1450,220 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 1450,220 Q 1485,230 1515,255\"></path>\n</g>\n<!-- Flower 6 (Valley 3) -->\n<g class=\"spring-flower-bloom\" style=\"animation-delay: 3.9s; transform-origin: 1520px 240px;\">\n<g transform=\"translate(1520, 240) scale(1.8)\">\n<path d=\"M 0,0 C -9,-15 9,-15 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 15,-9 15,9 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 9,15 -9,15 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C -15,9 -15,-9 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<circle cx=\"0\" cy=\"0\" fill=\"#f43f5e\" r=\"3.4\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"1.6\"></circle>\n</g>\n</g>\n<!-- Node 12 & 13 (Crest 4) -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 4.0s; transform-origin: 1690px 100px;\">\n<path class=\"leaf-lime\" d=\"M 1690,100 C 1670,60 1700,30 1735,45 C 1745,75 1720,110 1690,100 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 1690,100 Q 1710,65 1735,45\"></path>\n</g>\n<g class=\"spring-leaf-group\" style=\"animation-delay: 4.1s; transform-origin: 1700px 105px;\">\n<path class=\"leaf-emerald\" d=\"M 1700,105 C 1730,90 1765,95 1775,120 C 1755,135 1725,130 1700,105 Z\"></path>\n</g>\n<!-- Flower 7 (Crest 4) -->\n<g class=\"spring-flower-bloom\" style=\"animation-delay: 4.2s; transform-origin: 1850px 80px;\">\n<g transform=\"translate(1850, 80) scale(1.85)\">\n<path d=\"M 0,0 C -9,-15 9,-15 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 15,-9 15,9 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 9,15 -9,15 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C -15,9 -15,-9 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<circle cx=\"0\" cy=\"0\" fill=\"#f43f5e\" r=\"3.4\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"1.6\"></circle>\n</g>\n</g>\n<!-- Node 14 & Flower 8 (Valley 4) -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 4.3s; transform-origin: 2060px 220px;\">\n<path class=\"leaf-lime\" d=\"M 2060,220 C 2040,250 2055,280 2085,275 C 2105,255 2090,225 2060,220 Z\"></path>\n</g>\n<g class=\"spring-flower-bloom\" style=\"animation-delay: 4.4s; transform-origin: 2120px 245px;\">\n<g transform=\"translate(2120, 245) scale(1.8)\">\n<path d=\"M 0,0 C -8,-14 8,-14 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 14,-8 14,8 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C 8,14 -8,14 0,0\" fill=\"#fbcfe8\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<path d=\"M 0,0 C -14,8 -14,-8 0,0\" fill=\"#fce7f3\" stroke=\"#f472b6\" stroke-width=\"0.8\"></path>\n<circle cx=\"0\" cy=\"0\" fill=\"#f43f5e\" r=\"3.4\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"1.6\"></circle>\n</g>\n</g>\n<!-- Tip at 2350px -->\n<g class=\"spring-leaf-group\" style=\"animation-delay: 4.5s; transform-origin: 2310px 175px;\">\n<path class=\"leaf-emerald\" d=\"M 2310,175 C 2330,145 2360,145 2375,160 C 2360,185 2335,190 2310,175 Z\"></path>\n<path class=\"leaf-vein-green\" d=\"M 2310,175 Q 2345,155 2375,160\"></path>\n</g>\n<!-- Floating pollen across the 2400px span -->\n<g class=\"spring-pollen\">\n<circle cx=\"160\" cy=\"70\" fill=\"#f472b6\" opacity=\"0.85\" r=\"3.2\"></circle>\n<circle cx=\"380\" cy=\"115\" fill=\"#86efac\" opacity=\"0.8\" r=\"3.5\"></circle>\n<circle cx=\"640\" cy=\"110\" fill=\"#fbcfe8\" opacity=\"0.9\" r=\"3.2\"></circle>\n<circle cx=\"860\" cy=\"65\" fill=\"#86efac\" opacity=\"0.8\" r=\"3.5\"></circle>\n<circle cx=\"1060\" cy=\"205\" fill=\"#f472b6\" opacity=\"0.85\" r=\"3.2\"></circle>\n<circle cx=\"1270\" cy=\"70\" fill=\"#f472b6\" opacity=\"0.85\" r=\"3.2\"></circle>\n<circle cx=\"1540\" cy=\"115\" fill=\"#86efac\" opacity=\"0.8\" r=\"3.5\"></circle>\n<circle cx=\"1860\" cy=\"65\" fill=\"#fbcfe8\" opacity=\"0.9\" r=\"3.2\"></circle>\n<circle cx=\"2160\" cy=\"210\" fill=\"#86efac\" opacity=\"0.8\" r=\"3.5\"></circle>\n</g>\n</g>\n</svg>",
    summer: "<svg width=\"100%\" height=\"100%\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 2400 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<defs>\n<style>\n      .summer-vine-glow {\n        stroke: #84cc16;\n        stroke-width: 9;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        opacity: 0.35;\n        filter: blur(2px);\n        stroke-dasharray: 3600;\n        stroke-dashoffset: 3600;\n        animation: growSummerStem 4.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;\n      }\n      .summer-vine-main {\n        stroke: #166534;\n        stroke-width: 6.5;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        stroke-dasharray: 3600;\n        stroke-dashoffset: 3600;\n        animation: growSummerStem 4.6s cubic-bezier(0.4, 0, 0.2, 1) forwards, summerSway 6s ease-in-out infinite 4.6s;\n        transform-origin: 50% 50%;\n      }\n      .summer-vine-accent {\n        stroke: #22c55e;\n        stroke-width: 2.2;\n        stroke-linecap: round;\n        fill: none;\n        stroke-dasharray: 3600;\n        stroke-dashoffset: 3600;\n        animation: growSummerStem 4.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;\n      }\n      .summer-leaf-group {\n        opacity: 0;\n        animation: summerLeafBloom 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n        transform-origin: center;\n      }\n      .leaf-deep-summer { fill: #15803d; }\n      .leaf-bright-summer { fill: #4ade80; }\n      .leaf-vein-dark {\n        fill: none;\n        stroke: #14532d;\n        stroke-width: 1.3;\n        stroke-linecap: round;\n      }\n      .yellow-flower-bloom {\n        opacity: 0;\n        animation: flowerPop 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n        transform-origin: center;\n      }\n      .firefly-glow {\n        animation: fireflyFlicker 3.5s ease-in-out infinite alternate;\n      }\n\n      @keyframes growSummerStem { to { stroke-dashoffset: 0; } }\n      @keyframes summerLeafBloom {\n        0% { transform: scale(0) rotate(-20deg); opacity: 0; }\n        80% { transform: scale(1.12) rotate(3deg); opacity: 1; }\n        100% { transform: scale(1) rotate(0deg); opacity: 1; }\n      }\n      @keyframes flowerPop {\n        0% { transform: scale(0) rotate(-40deg); opacity: 0; }\n        75% { transform: scale(1.22) rotate(8deg); opacity: 1; }\n        100% { transform: scale(1) rotate(0deg); opacity: 1; }\n      }\n      @keyframes summerSway {\n        0%, 100% { transform: translateY(0) rotate(0deg); }\n        50% { transform: translateY(-4px) rotate(0.25deg); }\n      }\n      @keyframes fireflyFlicker {\n        0% { transform: translate(0, 0); opacity: 0.3; }\n        100% { transform: translate(14px, -16px); opacity: 0.9; filter: drop-shadow(0 0 4px #eab308); }\n      }\n    </style>\n</defs>\n<g>\n<!-- Extended Path (2400px ultra-long double wave) -->\n<path class=\"summer-vine-glow\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145 C 1255,75 1340,80 1445,165 C 1545,245 1630,240 1725,150 C 1815,65 1905,80 2005,175 C 2085,255 2175,240 2360,145\"></path>\n<path class=\"summer-vine-main\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145 C 1255,75 1340,80 1445,165 C 1545,245 1630,240 1725,150 C 1815,65 1905,80 2005,175 C 2085,255 2175,240 2360,145\"></path>\n<path class=\"summer-vine-accent\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145 C 1255,75 1340,80 1445,165 C 1545,245 1630,240 1725,150 C 1815,65 1905,80 2005,175 C 2085,255 2175,240 2360,145\"></path>\n<!-- Node 1 -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 0.8s; transform-origin: 100px 145px;\">\n<path class=\"leaf-deep-summer\" d=\"M 100,145 C 80,105 100,60 135,75 C 145,105 125,145 100,145 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 100,145 Q 115,105 135,75\"></path>\n</g>\n<g class=\"summer-leaf-group\" style=\"animation-delay: 1.0s; transform-origin: 110px 150px;\">\n<path class=\"leaf-bright-summer\" d=\"M 110,150 C 135,125 170,115 185,135 C 170,155 140,165 110,150 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 110,150 Q 145,135 185,135\"></path>\n</g>\n<!-- Node 2 -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 1.2s; transform-origin: 210px 95px;\">\n<path class=\"leaf-deep-summer\" d=\"M 210,95 C 190,55 220,25 255,40 C 260,75 235,105 210,95 Z\"></path>\n<path class=\"leaf-vein-dark\" d=\"M 210,95 Q 230,60 255,40\"></path>\n</g>\n<!-- Yellow Flower 1 (crest 1) -->\n<g class=\"yellow-flower-bloom\" style=\"animation-delay: 1.4s; transform-origin: 175px 85px;\">\n<g transform=\"translate(175, 85) scale(1.8)\">\n<circle cx=\"0\" cy=\"-9\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"8.5\" cy=\"-2.8\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"5.3\" cy=\"7.2\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-5.3\" cy=\"7.2\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-8.5\" cy=\"-2.8\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#ea580c\" r=\"4.3\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"2.2\"></circle>\n</g>\n</g>\n<!-- Node 3 & 4 -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 1.6s; transform-origin: 320px 155px;\">\n<path class=\"leaf-deep-summer\" d=\"M 320,155 C 305,115 330,85 365,100 C 375,130 350,165 320,155 Z\"></path>\n</g>\n<g class=\"summer-leaf-group\" style=\"animation-delay: 1.8s; transform-origin: 330px 165px;\">\n<path class=\"leaf-bright-summer\" d=\"M 330,165 C 355,145 390,145 405,170 C 385,185 355,185 330,165 Z\"></path>\n</g>\n<!-- Yellow Flower 2 (valley 1) -->\n<g class=\"yellow-flower-bloom\" style=\"animation-delay: 2.0s; transform-origin: 410px 240px;\">\n<g transform=\"translate(410, 240) scale(1.85)\">\n<circle cx=\"0\" cy=\"-9\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"8.5\" cy=\"-2.8\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"5.3\" cy=\"7.2\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-5.3\" cy=\"7.2\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-8.5\" cy=\"-2.8\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#ea580c\" r=\"4.3\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"2.2\"></circle>\n</g>\n</g>\n<!-- Node 5 & 6 -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 2.3s; transform-origin: 580px 185px;\">\n<path class=\"leaf-deep-summer\" d=\"M 580,185 C 565,145 590,120 625,135 C 635,165 610,195 580,185 Z\"></path>\n</g>\n<g class=\"summer-leaf-group\" style=\"animation-delay: 2.5s; transform-origin: 690px 100px;\">\n<path class=\"leaf-bright-summer\" d=\"M 690,100 C 670,60 700,30 735,45 C 745,75 720,110 690,100 Z\"></path>\n</g>\n<!-- Yellow Flower 3 (crest 2) -->\n<g class=\"yellow-flower-bloom\" style=\"animation-delay: 2.7s; transform-origin: 750px 80px;\">\n<g transform=\"translate(750, 80) scale(1.8)\">\n<circle cx=\"0\" cy=\"-9\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"8.5\" cy=\"-2.8\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"5.3\" cy=\"7.2\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-5.3\" cy=\"7.2\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-8.5\" cy=\"-2.8\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#ea580c\" r=\"4.3\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"2.2\"></circle>\n</g>\n</g>\n<!-- Node 7 & Yellow Flower 4 (valley 2) -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 3.0s; transform-origin: 840px 140px;\">\n<path class=\"leaf-deep-summer\" d=\"M 840,140 C 825,100 850,75 885,90 C 895,120 870,150 840,140 Z\"></path>\n</g>\n<g class=\"yellow-flower-bloom\" style=\"animation-delay: 3.2s; transform-origin: 1010px 245px;\">\n<g transform=\"translate(1010, 245) scale(1.75)\">\n<circle cx=\"0\" cy=\"-8.5\" fill=\"#facc15\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"8\" cy=\"-2.5\" fill=\"#eab308\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"5\" cy=\"7\" fill=\"#facc15\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-5\" cy=\"7\" fill=\"#eab308\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-8\" cy=\"-2.5\" fill=\"#facc15\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#ea580c\" r=\"4.0\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"2.0\"></circle>\n</g>\n</g>\n<!-- EXTENSION (1200px -> 2400px) -->\n<!-- Node 10 & Yellow Flower 5 (crest 3) -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 3.4s; transform-origin: 1210px 95px;\">\n<path class=\"leaf-deep-summer\" d=\"M 1210,95 C 1190,55 1220,25 1255,40 C 1260,75 1235,105 1210,95 Z\"></path>\n</g>\n<g class=\"yellow-flower-bloom\" style=\"animation-delay: 3.5s; transform-origin: 1280px 85px;\">\n<g transform=\"translate(1280, 85) scale(1.8)\">\n<circle cx=\"0\" cy=\"-9\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"8.5\" cy=\"-2.8\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"5.3\" cy=\"7.2\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-5.3\" cy=\"7.2\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-8.5\" cy=\"-2.8\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#ea580c\" r=\"4.3\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"2.2\"></circle>\n</g>\n</g>\n<!-- Node 11 & Yellow Flower 6 (valley 3) -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 3.7s; transform-origin: 1440px 225px;\">\n<path class=\"leaf-bright-summer\" d=\"M 1440,225 C 1415,250 1425,285 1455,280 C 1475,260 1465,230 1440,225 Z\"></path>\n</g>\n<g class=\"yellow-flower-bloom\" style=\"animation-delay: 3.8s; transform-origin: 1515px 240px;\">\n<g transform=\"translate(1515, 240) scale(1.85)\">\n<circle cx=\"0\" cy=\"-9\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"8.5\" cy=\"-2.8\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"5.3\" cy=\"7.2\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-5.3\" cy=\"7.2\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-8.5\" cy=\"-2.8\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#ea580c\" r=\"4.3\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"2.2\"></circle>\n</g>\n</g>\n<!-- Node 12 & Yellow Flower 7 (crest 4) -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 4.0s; transform-origin: 1690px 100px;\">\n<path class=\"leaf-deep-summer\" d=\"M 1690,100 C 1670,60 1700,30 1735,45 C 1745,75 1720,110 1690,100 Z\"></path>\n</g>\n<g class=\"yellow-flower-bloom\" style=\"animation-delay: 4.1s; transform-origin: 1850px 80px;\">\n<g transform=\"translate(1850, 80) scale(1.8)\">\n<circle cx=\"0\" cy=\"-9\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"8.5\" cy=\"-2.8\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"5.3\" cy=\"7.2\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-5.3\" cy=\"7.2\" fill=\"#eab308\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-8.5\" cy=\"-2.8\" fill=\"#facc15\" r=\"6.5\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#ea580c\" r=\"4.3\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"2.2\"></circle>\n</g>\n</g>\n<!-- Yellow Flower 8 (valley 4) -->\n<g class=\"yellow-flower-bloom\" style=\"animation-delay: 4.3s; transform-origin: 2110px 245px;\">\n<g transform=\"translate(2110, 245) scale(1.8)\">\n<circle cx=\"0\" cy=\"-8.5\" fill=\"#facc15\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"8\" cy=\"-2.5\" fill=\"#eab308\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"5\" cy=\"7\" fill=\"#facc15\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-5\" cy=\"7\" fill=\"#eab308\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"-8\" cy=\"-2.5\" fill=\"#facc15\" r=\"6\" stroke=\"#ca8a04\" stroke-width=\"0.8\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#ea580c\" r=\"4.0\"></circle>\n<circle cx=\"0\" cy=\"0\" fill=\"#fef08a\" r=\"2.0\"></circle>\n</g>\n</g>\n<!-- Tip at 2350px -->\n<g class=\"summer-leaf-group\" style=\"animation-delay: 4.5s; transform-origin: 2310px 175px;\">\n<path class=\"leaf-deep-summer\" d=\"M 2310,175 C 2330,145 2360,145 2375,160 C 2360,185 2335,190 2310,175 Z\"></path>\n</g>\n<!-- Fireflies and golden pollen -->\n<g class=\"firefly-glow\">\n<circle cx=\"165\" cy=\"70\" fill=\"#fef08a\" opacity=\"0.9\" r=\"3.8\"></circle>\n<circle cx=\"370\" cy=\"115\" fill=\"#fde047\" opacity=\"0.85\" r=\"4.2\"></circle>\n<circle cx=\"630\" cy=\"110\" fill=\"#fef08a\" opacity=\"0.9\" r=\"3.5\"></circle>\n<circle cx=\"855\" cy=\"65\" fill=\"#facc15\" opacity=\"0.85\" r=\"4.2\"></circle>\n<circle cx=\"1065\" cy=\"205\" fill=\"#fde047\" opacity=\"0.9\" r=\"3.8\"></circle>\n<circle cx=\"1290\" cy=\"70\" fill=\"#fef08a\" opacity=\"0.9\" r=\"4.0\"></circle>\n<circle cx=\"1520\" cy=\"115\" fill=\"#fde047\" opacity=\"0.85\" r=\"4.2\"></circle>\n<circle cx=\"1870\" cy=\"65\" fill=\"#facc15\" opacity=\"0.85\" r=\"4.0\"></circle>\n<circle cx=\"2150\" cy=\"210\" fill=\"#fde047\" opacity=\"0.9\" r=\"3.8\"></circle>\n</g>\n</g>\n</svg>",
    autumn: "<svg width=\"100%\" height=\"100%\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 2400 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<defs>\n<style>\n      .autumn-stem-glow {\n        stroke: #d97706;\n        stroke-width: 10;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        opacity: 0.35;\n        filter: blur(2px);\n        stroke-dasharray: 3600;\n        stroke-dashoffset: 3600;\n        animation: growStemAutumn 4.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;\n      }\n      .autumn-main-stem {\n        stroke: #5d4037;\n        stroke-width: 6.5;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        stroke-dasharray: 3600;\n        stroke-dashoffset: 3600;\n        animation: growStemAutumn 4.6s cubic-bezier(0.4, 0, 0.2, 1) forwards, autumnBreeze 6.5s ease-in-out infinite 4.6s;\n        transform-origin: 50% 50%;\n      }\n      .autumn-sub-tendril {\n        stroke: #8d6e63;\n        stroke-width: 3;\n        stroke-linecap: round;\n        fill: none;\n        stroke-dasharray: 260;\n        stroke-dashoffset: 260;\n        animation: growStemAutumn 2.2s ease forwards 1.4s;\n      }\n      .autumn-leaf {\n        opacity: 0;\n        animation: leafBloom 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n        transform-origin: center;\n      }\n      .leaf-crimson { fill: #c62828; }\n      .leaf-amber { fill: #f57f17; }\n      .leaf-terracotta { fill: #d84315; }\n      .leaf-gold { fill: #ffb300; }\n      .leaf-copper { fill: #e65100; }\n\n      .leaf-vein-dark { fill: none; stroke: #7f0000; stroke-width: 1.3; stroke-linecap: round; }\n      .leaf-vein-gold { fill: none; stroke: #b26a00; stroke-width: 1.3; stroke-linecap: round; }\n      .leaf-vein-russet { fill: none; stroke: #bf360c; stroke-width: 1.3; stroke-linecap: round; }\n\n      .rowan-berry {\n        opacity: 0;\n        animation: berryRipen 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n        transform-origin: center;\n      }\n      .drifting-leaf-1 { animation: autumnDrift1 6.5s linear infinite 2.2s; transform-origin: center; }\n      .drifting-leaf-2 { animation: autumnDrift2 7.8s linear infinite 3.5s; transform-origin: center; }\n      .drifting-leaf-3 { animation: autumnDrift3 7.0s linear infinite 1.6s; transform-origin: center; }\n\n      .autumn-spore {\n        animation: sporeGlow 3.5s ease-in-out infinite alternate;\n      }\n\n      @keyframes growStemAutumn { to { stroke-dashoffset: 0; } }\n      @keyframes leafBloom {\n        0% { transform: scale(0) rotate(-22deg); opacity: 0; }\n        75% { transform: scale(1.15) rotate(3deg); opacity: 1; }\n        100% { transform: scale(1) rotate(0deg); opacity: 1; }\n      }\n      @keyframes berryRipen {\n        0% { transform: scale(0); opacity: 0; }\n        100% { transform: scale(1); opacity: 1; }\n      }\n      @keyframes autumnBreeze {\n        0%, 100% { transform: translateY(0) rotate(0deg); }\n        50% { transform: translateY(-4px) rotate(0.25deg); }\n      }\n      @keyframes sporeGlow {\n        0% { transform: translate(0, 0); opacity: 0.3; }\n        100% { transform: translate(14px, -16px); opacity: 0.85; filter: drop-shadow(0 0 4px #f59e0b); }\n      }\n      @keyframes autumnDrift1 {\n        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }\n        50% { transform: translate(145px, 85px) rotate(110deg); opacity: 0.9; }\n        100% { transform: translate(255px, 160px) rotate(190deg); opacity: 0; }\n      }\n      @keyframes autumnDrift2 {\n        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }\n        50% { transform: translate(140px, 90px) rotate(-100deg); opacity: 0.85; }\n        100% { transform: translate(250px, 160px) rotate(-170deg); opacity: 0; }\n      }\n      @keyframes autumnDrift3 {\n        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }\n        50% { transform: translate(160px, 95px) rotate(105deg); opacity: 0.8; }\n        100% { transform: translate(265px, 165px) rotate(160deg); opacity: 0; }\n      }\n    </style>\n</defs>\n<g>\n<!-- Extended Path (2400px ultra-long double wave) -->\n<path class=\"autumn-stem-glow\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145 C 1255,75 1340,80 1445,165 C 1545,245 1630,240 1725,150 C 1815,65 1905,80 2005,175 C 2085,255 2175,240 2360,145\"></path>\n<path class=\"autumn-main-stem\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145 C 1255,75 1340,80 1445,165 C 1545,245 1630,240 1725,150 C 1815,65 1905,80 2005,175 C 2085,255 2175,240 2360,145\"></path>\n<!-- Delicate Woody Tendrils -->\n<path class=\"autumn-sub-tendril\" d=\"M 190,105 Q 215,60 185,45 T 160,75\" style=\"animation-delay: 1.2s;\"></path>\n<path class=\"autumn-sub-tendril\" d=\"M 475,225 Q 505,270 540,255 T 525,220\" style=\"animation-delay: 1.8s;\"></path>\n<path class=\"autumn-sub-tendril\" d=\"M 755,95 Q 785,50 825,65 T 805,100\" style=\"animation-delay: 2.4s;\"></path>\n<path class=\"autumn-sub-tendril\" d=\"M 1025,230 Q 1055,275 1095,260 T 1075,225\" style=\"animation-delay: 3.0s;\"></path>\n<path class=\"autumn-sub-tendril\" d=\"M 1390,105 Q 1415,60 1385,45 T 1360,75\" style=\"animation-delay: 3.5s;\"></path>\n<path class=\"autumn-sub-tendril\" d=\"M 1675,225 Q 1705,270 1740,255 T 1725,220\" style=\"animation-delay: 3.9s;\"></path>\n<path class=\"autumn-sub-tendril\" d=\"M 1955,95 Q 1985,50 2025,65 T 2005,100\" style=\"animation-delay: 4.2s;\"></path>\n<!-- Node 1 & 2 -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 0.8s; transform-origin: 100px 145px;\">\n<path class=\"leaf-crimson\" d=\"M 100,145 C 80,105 100,60 135,75 C 145,105 125,145 100,145 Z\"></path>\n</g>\n<g class=\"autumn-leaf\" style=\"animation-delay: 1.0s; transform-origin: 110px 150px;\">\n<path class=\"leaf-amber\" d=\"M 110,150 C 135,125 170,115 185,135 C 170,155 140,165 110,150 Z\"></path>\n</g>\n<g class=\"autumn-leaf\" style=\"animation-delay: 1.2s; transform-origin: 210px 95px;\">\n<path class=\"leaf-terracotta\" d=\"M 210,95 C 190,55 220,25 255,40 C 260,75 235,105 210,95 Z\"></path>\n</g>\n<!-- Rowan Berries 1 -->\n<g class=\"rowan-berry\" style=\"animation-delay: 1.4s;\">\n<circle cx=\"215\" cy=\"74\" fill=\"#d32f2f\" r=\"5.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"224\" cy=\"70\" fill=\"#e53935\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"219\" cy=\"82\" fill=\"#c62828\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"217\" cy=\"72\" fill=\"#ffcdd2\" opacity=\"0.8\" r=\"1.5\"></circle>\n</g>\n<!-- Node 3 & 4 -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 1.6s; transform-origin: 320px 155px;\">\n<path class=\"leaf-copper\" d=\"M 320,155 C 305,115 330,85 365,100 C 375,130 350,165 320,155 Z\"></path>\n</g>\n<g class=\"autumn-leaf\" style=\"animation-delay: 1.8s; transform-origin: 440px 225px;\">\n<path class=\"leaf-crimson\" d=\"M 440,225 C 415,250 425,285 455,280 C 475,260 465,230 440,225 Z\"></path>\n</g>\n<!-- Rowan Berries 2 -->\n<g class=\"rowan-berry\" style=\"animation-delay: 2.0s;\">\n<circle cx=\"505\" cy=\"245\" fill=\"#d32f2f\" r=\"6\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"515\" cy=\"242\" fill=\"#e53935\" r=\"5.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"510\" cy=\"254\" fill=\"#c62828\" r=\"5.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"508\" cy=\"243\" fill=\"#ffcdd2\" opacity=\"0.8\" r=\"1.6\"></circle>\n</g>\n<!-- Node 5 & 6 -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 2.2s; transform-origin: 580px 185px;\">\n<path class=\"leaf-terracotta\" d=\"M 580,185 C 565,145 590,120 625,135 C 635,165 610,195 580,185 Z\"></path>\n</g>\n<g class=\"autumn-leaf\" style=\"animation-delay: 2.4s; transform-origin: 690px 100px;\">\n<path class=\"leaf-copper\" d=\"M 690,100 C 670,60 700,30 735,45 C 745,75 720,110 690,100 Z\"></path>\n</g>\n<!-- Rowan Berries 3 -->\n<g class=\"rowan-berry\" style=\"animation-delay: 2.6s;\">\n<circle cx=\"788\" cy=\"76\" fill=\"#d32f2f\" r=\"5.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"798\" cy=\"73\" fill=\"#e53935\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"793\" cy=\"84\" fill=\"#c62828\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"790\" cy=\"74\" fill=\"#ffcdd2\" opacity=\"0.8\" r=\"1.5\"></circle>\n</g>\n<!-- Node 7 & Rowan Berries 4 -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 2.9s; transform-origin: 840px 140px;\">\n<path class=\"leaf-terracotta\" d=\"M 840,140 C 825,100 850,75 885,90 C 895,120 870,150 840,140 Z\"></path>\n</g>\n<g class=\"rowan-berry\" style=\"animation-delay: 3.1s;\">\n<circle cx=\"1010\" cy=\"245\" fill=\"#d32f2f\" r=\"5.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"1020\" cy=\"242\" fill=\"#e53935\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"1015\" cy=\"253\" fill=\"#c62828\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n</g>\n<!-- EXTENSION (1200px -> 2400px) -->\n<!-- Node 10 & Rowan Berries 5 (crest 3) -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 3.4s; transform-origin: 1210px 95px;\">\n<path class=\"leaf-crimson\" d=\"M 1210,95 C 1190,55 1220,25 1255,40 C 1260,75 1235,105 1210,95 Z\"></path>\n</g>\n<g class=\"rowan-berry\" style=\"animation-delay: 3.5s;\">\n<circle cx=\"1275\" cy=\"74\" fill=\"#d32f2f\" r=\"5.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"1285\" cy=\"70\" fill=\"#e53935\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"1280\" cy=\"82\" fill=\"#c62828\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n</g>\n<!-- Node 11 & Rowan Berries 6 (valley 3) -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 3.7s; transform-origin: 1440px 225px;\">\n<path class=\"leaf-amber\" d=\"M 1440,225 C 1415,250 1425,285 1455,280 C 1475,260 1465,230 1440,225 Z\"></path>\n</g>\n<g class=\"rowan-berry\" style=\"animation-delay: 3.8s;\">\n<circle cx=\"1510\" cy=\"245\" fill=\"#d32f2f\" r=\"6\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"1520\" cy=\"242\" fill=\"#e53935\" r=\"5.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"1515\" cy=\"254\" fill=\"#c62828\" r=\"5.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n</g>\n<!-- Node 12 & Rowan Berries 7 (crest 4) -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 4.0s; transform-origin: 1690px 100px;\">\n<path class=\"leaf-copper\" d=\"M 1690,100 C 1670,60 1700,30 1735,45 C 1745,75 1720,110 1690,100 Z\"></path>\n</g>\n<g class=\"rowan-berry\" style=\"animation-delay: 4.1s;\">\n<circle cx=\"1845\" cy=\"76\" fill=\"#d32f2f\" r=\"5.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"1855\" cy=\"73\" fill=\"#e53935\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"1850\" cy=\"84\" fill=\"#c62828\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n</g>\n<!-- Rowan Berries 8 (valley 4) -->\n<g class=\"rowan-berry\" style=\"animation-delay: 4.3s;\">\n<circle cx=\"2110\" cy=\"245\" fill=\"#d32f2f\" r=\"5.5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"2120\" cy=\"242\" fill=\"#e53935\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n<circle cx=\"2115\" cy=\"253\" fill=\"#c62828\" r=\"5\" stroke=\"#8b0000\" stroke-width=\"1\"></circle>\n</g>\n<!-- Tip at 2350px -->\n<g class=\"autumn-leaf\" style=\"animation-delay: 4.5s; transform-origin: 2310px 175px;\">\n<path class=\"leaf-crimson\" d=\"M 2310,175 C 2330,145 2360,145 2375,160 C 2360,185 2335,190 2310,175 Z\"></path>\n</g>\n<!-- Drifting Autumn Leaves -->\n<g class=\"drifting-leaf-1\">\n<g transform=\"translate(285, 90) scale(0.65)\"><path class=\"leaf-amber\" d=\"M 0,0 C -15,-25 10,-35 25,-15 C 40,-35 60,-15 45,10 C 50,30 20,35 20,20 C 10,35 -15,25 -10,0 Z\"></path></g>\n</g>\n<g class=\"drifting-leaf-2\">\n<g transform=\"translate(635, 95) scale(0.68)\"><path class=\"leaf-crimson\" d=\"M 0,0 C -15,-25 10,-35 25,-15 C 40,-35 60,-15 45,10 C 50,30 20,35 20,20 C 10,35 -15,25 -10,0 Z\"></path></g>\n</g>\n<g class=\"drifting-leaf-3\">\n<g transform=\"translate(1385, 90) scale(0.65)\"><path class=\"leaf-gold\" d=\"M 0,0 C -15,-25 10,-35 25,-15 C 40,-35 60,-15 45,10 C 50,30 20,35 20,20 C 10,35 -15,25 -10,0 Z\"></path></g>\n</g>\n<g class=\"drifting-leaf-1\">\n<g transform=\"translate(1820, 95) scale(0.68)\"><path class=\"leaf-copper\" d=\"M 0,0 C -15,-25 10,-35 25,-15 C 40,-35 60,-15 45,10 C 50,30 20,35 20,20 C 10,35 -15,25 -10,0 Z\"></path></g>\n</g>\n<!-- Ambient glowing spores across 2400px -->\n<g class=\"autumn-spore\">\n<circle cx=\"170\" cy=\"80\" fill=\"#f59e0b\" opacity=\"0.85\" r=\"2.5\"></circle>\n<circle cx=\"370\" cy=\"115\" fill=\"#fbbf24\" opacity=\"0.8\" r=\"3.0\"></circle>\n<circle cx=\"630\" cy=\"120\" fill=\"#ea580c\" opacity=\"0.85\" r=\"2.5\"></circle>\n<circle cx=\"850\" cy=\"70\" fill=\"#f59e0b\" opacity=\"0.8\" r=\"3.0\"></circle>\n<circle cx=\"1060\" cy=\"210\" fill=\"#fbbf24\" opacity=\"0.75\" r=\"2.5\"></circle>\n<circle cx=\"1370\" cy=\"80\" fill=\"#f59e0b\" opacity=\"0.85\" r=\"2.5\"></circle>\n<circle cx=\"1630\" cy=\"120\" fill=\"#ea580c\" opacity=\"0.85\" r=\"2.5\"></circle>\n<circle cx=\"1850\" cy=\"70\" fill=\"#f59e0b\" opacity=\"0.8\" r=\"3.0\"></circle>\n<circle cx=\"2160\" cy=\"210\" fill=\"#fbbf24\" opacity=\"0.75\" r=\"2.5\"></circle>\n</g>\n</g>\n</svg>",
    winter: "<svg width=\"100%\" height=\"100%\" preserveAspectRatio=\"xMidYMid meet\" viewBox=\"0 0 2400 320\" xmlns=\"http://www.w3.org/2000/svg\">\n<defs>\n<style>\n      .winter-frost-glow {\n        stroke: #38bdf8;\n        stroke-width: 9;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        opacity: 0.4;\n        filter: blur(3px);\n        stroke-dasharray: 3600;\n        stroke-dashoffset: 3600;\n        animation: growFrostStem 4.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;\n      }\n      .winter-frost-stem {\n        stroke: #bae6fd;\n        stroke-width: 6;\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        fill: none;\n        stroke-dasharray: 3600;\n        stroke-dashoffset: 3600;\n        animation: growFrostStem 4.6s cubic-bezier(0.4, 0, 0.2, 1) forwards, winterShiver 6s ease-in-out infinite 4.6s;\n        transform-origin: 50% 50%;\n      }\n      .winter-core-vein {\n        stroke: #ffffff;\n        stroke-width: 2.2;\n        stroke-linecap: round;\n        fill: none;\n        stroke-dasharray: 3600;\n        stroke-dashoffset: 3600;\n        animation: growFrostStem 4.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;\n      }\n\n      /* Translucent white leaves (68-72% opacity) */\n      .winter-leaf-group {\n        opacity: 0;\n        animation: leafFrostCrystallize 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n        transform-origin: center;\n      }\n      .white-leaf-70 {\n        fill: #ffffff;\n        fill-opacity: 0.70;\n        stroke: #7dd3fc;\n        stroke-width: 1.5;\n        filter: drop-shadow(0 0 3px rgba(186, 230, 253, 0.5));\n      }\n      .white-leaf-65 {\n        fill: #f0f9ff;\n        fill-opacity: 0.68;\n        stroke: #38bdf8;\n        stroke-width: 1.4;\n        filter: drop-shadow(0 0 3px rgba(186, 230, 253, 0.5));\n      }\n      .white-leaf-vein {\n        fill: none;\n        stroke: #0284c7;\n        stroke-width: 1.2;\n        stroke-linecap: round;\n        opacity: 0.65;\n      }\n\n      /* Dancing snowflakes across the extended canvas */\n      .snow-drift-1 { animation: driftSnow1 4.8s linear infinite; }\n      .snow-drift-2 { animation: driftSnow2 6.0s linear infinite 1.5s; }\n      .snow-drift-3 { animation: driftSnow3 5.4s linear infinite 2.5s; }\n\n      @keyframes growFrostStem { to { stroke-dashoffset: 0; } }\n      @keyframes leafFrostCrystallize {\n        0% { transform: scale(0) rotate(-18deg); opacity: 0; }\n        80% { transform: scale(1.12) rotate(3deg); opacity: 0.95; }\n        100% { transform: scale(1) rotate(0deg); opacity: 1; }\n      }\n      @keyframes winterShiver {\n        0%, 100% { transform: translateY(0) rotate(0deg); }\n        50% { transform: translateY(-3px) rotate(0.2deg); }\n      }\n      @keyframes driftSnow1 {\n        0% { transform: translate(0, -15px); opacity: 0; }\n        25% { opacity: 0.95; }\n        75% { opacity: 0.95; }\n        100% { transform: translate(45px, 115px) rotate(180deg); opacity: 0; }\n      }\n      @keyframes driftSnow2 {\n        0% { transform: translate(0, -15px); opacity: 0; }\n        25% { opacity: 0.9; }\n        75% { opacity: 0.9; }\n        100% { transform: translate(-40px, 125px) rotate(-180deg); opacity: 0; }\n      }\n      @keyframes driftSnow3 {\n        0% { transform: translate(0, -20px); opacity: 0; }\n        25% { opacity: 1; }\n        75% { opacity: 1; }\n        100% { transform: translate(35px, 130px) rotate(160deg); opacity: 0; }\n      }\n    </style>\n</defs>\n<g>\n<!-- Extended Path (2400px ultra-long double wave) -->\n<path class=\"winter-frost-glow\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145 C 1255,75 1340,80 1445,165 C 1545,245 1630,240 1725,150 C 1815,65 1905,80 2005,175 C 2085,255 2175,240 2360,145\"></path>\n<path class=\"winter-frost-stem\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145 C 1255,75 1340,80 1445,165 C 1545,245 1630,240 1725,150 C 1815,65 1905,80 2005,175 C 2085,255 2175,240 2360,145\"></path>\n<path class=\"winter-core-vein\" d=\"M 40,165 C 145,75 230,80 335,165 C 435,245 520,240 615,150 C 705,65 795,80 895,175 C 975,255 1065,240 1160,145 C 1255,75 1340,80 1445,165 C 1545,245 1630,240 1725,150 C 1815,65 1905,80 2005,175 C 2085,255 2175,240 2360,145\"></path>\n<!-- Node 1 -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 0.8s; transform-origin: 100px 145px;\">\n<path class=\"white-leaf-70\" d=\"M 100,145 C 80,105 100,60 135,75 C 145,105 125,145 100,145 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 100,145 Q 115,105 135,75\"></path>\n</g>\n<g class=\"winter-leaf-group\" style=\"animation-delay: 1.0s; transform-origin: 110px 150px;\">\n<path class=\"white-leaf-65\" d=\"M 110,150 C 135,125 170,115 185,135 C 170,155 140,165 110,150 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 110,150 Q 145,135 185,135\"></path>\n</g>\n<!-- Node 2 -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 1.2s; transform-origin: 210px 95px;\">\n<path class=\"white-leaf-70\" d=\"M 210,95 C 190,55 220,25 255,40 C 260,75 235,105 210,95 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 210,95 Q 230,60 255,40\"></path>\n</g>\n<g class=\"winter-leaf-group\" style=\"animation-delay: 1.4s; transform-origin: 220px 102px;\">\n<path class=\"white-leaf-65\" d=\"M 220,102 C 250,85 285,85 295,110 C 275,125 245,125 220,102 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 220,102 Q 255,95 295,110\"></path>\n</g>\n<!-- Snowflake 1 (crest 1) -->\n<g class=\"snow-drift-1\" transform=\"translate(180, 75)\">\n<g stroke=\"#ffffff\" stroke-linecap=\"round\" stroke-width=\"1.8\">\n<line x1=\"-8\" x2=\"8\" y1=\"0\" y2=\"0\"></line>\n<line x1=\"0\" x2=\"0\" y1=\"-8\" y2=\"8\"></line>\n<line x1=\"-6\" x2=\"6\" y1=\"-6\" y2=\"6\"></line>\n<line x1=\"-6\" x2=\"6\" y1=\"6\" y2=\"-6\"></line>\n</g>\n<circle cx=\"0\" cy=\"0\" fill=\"#38bdf8\" r=\"2.2\"></circle>\n</g>\n<!-- Node 3 & 4 -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 1.6s; transform-origin: 320px 155px;\">\n<path class=\"white-leaf-70\" d=\"M 320,155 C 305,115 330,85 365,100 C 375,130 350,165 320,155 Z\"></path>\n</g>\n<g class=\"winter-leaf-group\" style=\"animation-delay: 1.8s; transform-origin: 440px 225px;\">\n<path class=\"white-leaf-70\" d=\"M 440,225 C 415,250 425,285 455,280 C 475,260 465,230 440,225 Z\"></path>\n</g>\n<!-- Snowflake 2 (valley 1) -->\n<g class=\"snow-drift-2\" transform=\"translate(530, 115)\">\n<g stroke=\"#ffffff\" stroke-linecap=\"round\" stroke-width=\"1.8\">\n<line x1=\"-9\" x2=\"9\" y1=\"0\" y2=\"0\"></line>\n<line x1=\"0\" x2=\"0\" y1=\"-9\" y2=\"9\"></line>\n<line x1=\"-6.5\" x2=\"6.5\" y1=\"-6.5\" y2=\"6.5\"></line>\n<line x1=\"-6.5\" x2=\"6.5\" y1=\"6.5\" y2=\"-6.5\"></line>\n</g>\n<circle cx=\"0\" cy=\"0\" fill=\"#38bdf8\" r=\"2.2\"></circle>\n</g>\n<!-- Node 5 & 6 -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 2.1s; transform-origin: 580px 185px;\">\n<path class=\"white-leaf-70\" d=\"M 580,185 C 565,145 590,120 625,135 C 635,165 610,195 580,185 Z\"></path>\n</g>\n<g class=\"winter-leaf-group\" style=\"animation-delay: 2.3s; transform-origin: 690px 100px;\">\n<path class=\"white-leaf-65\" d=\"M 690,100 C 670,60 700,30 735,45 C 745,75 720,110 690,100 Z\"></path>\n</g>\n<!-- Snowflake 3 (crest 2) -->\n<g class=\"snow-drift-3\" transform=\"translate(830, 70)\">\n<g stroke=\"#ffffff\" stroke-linecap=\"round\" stroke-width=\"1.8\">\n<line x1=\"-8\" x2=\"8\" y1=\"0\" y2=\"0\"></line>\n<line x1=\"0\" x2=\"0\" y1=\"-8\" y2=\"8\"></line>\n<line x1=\"-6\" x2=\"6\" y1=\"-6\" y2=\"6\"></line>\n<line x1=\"-6\" x2=\"6\" y1=\"6\" y2=\"-6\"></line>\n</g>\n<circle cx=\"0\" cy=\"0\" fill=\"#38bdf8\" r=\"2.2\"></circle>\n</g>\n<!-- Node 7 & 8 -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 2.6s; transform-origin: 840px 140px;\">\n<path class=\"white-leaf-70\" d=\"M 840,140 C 825,100 850,75 885,90 C 895,120 870,150 840,140 Z\"></path>\n</g>\n<g class=\"winter-leaf-group\" style=\"animation-delay: 2.8s; transform-origin: 960px 220px;\">\n<path class=\"white-leaf-65\" d=\"M 960,220 C 940,250 955,280 985,275 C 1005,255 990,225 960,220 Z\"></path>\n</g>\n<!-- EXTENSION (1200px -> 2400px) -->\n<!-- Node 10 (crest 3) -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 3.2s; transform-origin: 1210px 95px;\">\n<path class=\"white-leaf-70\" d=\"M 1210,95 C 1190,55 1220,25 1255,40 C 1260,75 1235,105 1210,95 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 1210,95 Q 1230,60 1255,40\"></path>\n</g>\n<g class=\"winter-leaf-group\" style=\"animation-delay: 3.3s; transform-origin: 1220px 102px;\">\n<path class=\"white-leaf-65\" d=\"M 1220,102 C 1250,85 1285,85 1295,110 C 1275,125 1245,125 1220,102 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 1220,102 Q 1255,95 1295,110\"></path>\n</g>\n<!-- Snowflake 4 (crest 3) -->\n<g class=\"snow-drift-1\" transform=\"translate(1290, 75)\">\n<g stroke=\"#ffffff\" stroke-linecap=\"round\" stroke-width=\"1.8\">\n<line x1=\"-8\" x2=\"8\" y1=\"0\" y2=\"0\"></line>\n<line x1=\"0\" x2=\"0\" y1=\"-8\" y2=\"8\"></line>\n<line x1=\"-6\" x2=\"6\" y1=\"-6\" y2=\"6\"></line>\n<line x1=\"-6\" x2=\"6\" y1=\"6\" y2=\"-6\"></line>\n</g>\n<circle cx=\"0\" cy=\"0\" fill=\"#38bdf8\" r=\"2.2\"></circle>\n</g>\n<!-- Node 11 (valley 3) -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 3.6s; transform-origin: 1440px 225px;\">\n<path class=\"white-leaf-70\" d=\"M 1440,225 C 1415,250 1425,285 1455,280 C 1475,260 1465,230 1440,225 Z\"></path>\n</g>\n<!-- Snowflake 5 (valley 3) -->\n<g class=\"snow-drift-2\" transform=\"translate(1530, 120)\">\n<g stroke=\"#ffffff\" stroke-linecap=\"round\" stroke-width=\"1.8\">\n<line x1=\"-9\" x2=\"9\" y1=\"0\" y2=\"0\"></line>\n<line x1=\"0\" x2=\"0\" y1=\"-9\" y2=\"9\"></line>\n<line x1=\"-6.5\" x2=\"6.5\" y1=\"-6.5\" y2=\"6.5\"></line>\n<line x1=\"-6.5\" x2=\"6.5\" y1=\"6.5\" y2=\"-6.5\"></line>\n</g>\n<circle cx=\"0\" cy=\"0\" fill=\"#38bdf8\" r=\"2.2\"></circle>\n</g>\n<!-- Node 12 & 13 (crest 4) -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 3.9s; transform-origin: 1690px 100px;\">\n<path class=\"white-leaf-65\" d=\"M 1690,100 C 1670,60 1700,30 1735,45 C 1745,75 1720,110 1690,100 Z\"></path>\n</g>\n<g class=\"winter-leaf-group\" style=\"animation-delay: 4.1s; transform-origin: 1700px 105px;\">\n<path class=\"white-leaf-70\" d=\"M 1700,105 C 1730,90 1765,95 1775,120 C 1755,135 1725,130 1700,105 Z\"></path>\n</g>\n<!-- Snowflake 6 (crest 4) -->\n<g class=\"snow-drift-3\" transform=\"translate(1860, 70)\">\n<g stroke=\"#ffffff\" stroke-linecap=\"round\" stroke-width=\"1.8\">\n<line x1=\"-8\" x2=\"8\" y1=\"0\" y2=\"0\"></line>\n<line x1=\"0\" x2=\"0\" y1=\"-8\" y2=\"8\"></line>\n<line x1=\"-6\" x2=\"6\" y1=\"-6\" y2=\"6\"></line>\n<line x1=\"-6\" x2=\"6\" y1=\"6\" y2=\"-6\"></line>\n</g>\n<circle cx=\"0\" cy=\"0\" fill=\"#38bdf8\" r=\"2.2\"></circle>\n</g>\n<!-- Node 14 & Tip at 2350px -->\n<g class=\"winter-leaf-group\" style=\"animation-delay: 4.3s; transform-origin: 2060px 220px;\">\n<path class=\"white-leaf-65\" d=\"M 2060,220 C 2040,250 2055,280 2085,275 C 2105,255 2090,225 2060,220 Z\"></path>\n</g>\n<g class=\"winter-leaf-group\" style=\"animation-delay: 4.5s; transform-origin: 2310px 175px;\">\n<path class=\"white-leaf-70\" d=\"M 2310,175 C 2330,145 2360,145 2375,160 C 2360,185 2335,190 2310,175 Z\"></path>\n<path class=\"white-leaf-vein\" d=\"M 2310,175 Q 2345,155 2375,160\"></path>\n</g>\n<!-- Drifting snow specks across 2400px -->\n<g class=\"snow-drift-1\">\n<circle cx=\"280\" cy=\"65\" fill=\"#ffffff\" opacity=\"0.9\" r=\"3.0\"></circle>\n<circle cx=\"680\" cy=\"80\" fill=\"#e0f2fe\" opacity=\"0.85\" r=\"2.5\"></circle>\n<circle cx=\"990\" cy=\"140\" fill=\"#ffffff\" opacity=\"0.9\" r=\"3.0\"></circle>\n<circle cx=\"1380\" cy=\"65\" fill=\"#ffffff\" opacity=\"0.9\" r=\"3.0\"></circle>\n<circle cx=\"1780\" cy=\"80\" fill=\"#e0f2fe\" opacity=\"0.85\" r=\"2.5\"></circle>\n<circle cx=\"2190\" cy=\"140\" fill=\"#ffffff\" opacity=\"0.9\" r=\"3.0\"></circle>\n</g>\n<g class=\"snow-drift-2\">\n<circle cx=\"370\" cy=\"110\" fill=\"#bae6fd\" opacity=\"0.9\" r=\"2.5\"></circle>\n<circle cx=\"770\" cy=\"60\" fill=\"#ffffff\" opacity=\"0.95\" r=\"3.0\"></circle>\n<circle cx=\"1080\" cy=\"170\" fill=\"#e0f2fe\" opacity=\"0.85\" r=\"2.5\"></circle>\n<circle cx=\"1470\" cy=\"110\" fill=\"#bae6fd\" opacity=\"0.9\" r=\"2.5\"></circle>\n<circle cx=\"1970\" cy=\"60\" fill=\"#ffffff\" opacity=\"0.95\" r=\"3.0\"></circle>\n<circle cx=\"2280\" cy=\"170\" fill=\"#e0f2fe\" opacity=\"0.85\" r=\"2.5\"></circle>\n</g>\n</g>\n</svg>"
  };

  function seasonVineHTML(forceLen) {
    const s = getSeasonMSK();
    const vineEl = document.getElementById('cwh-season-vine');
    let w = 0;
    try {
      w = vineEl ? (vineEl.clientWidth || vineEl.offsetWidth || 0) : 0;
      if (!w) {
        const panel = document.getElementById('cwh-widget');
        if (panel) w = Math.max(0, (panel.clientWidth || 0) - 120);
      }
    } catch (e) {}
    const useLong = forceLen === 'long' || (forceLen !== 'short' && w >= 260);
    const pack = useLong ? SEASON_VINE_SVG_LONG : SEASON_VINE_SVG_SHORT;
    let svg = pack[s] || pack.autumn || SEASON_VINE_SVG_SHORT.autumn;
    svg = String(svg)
      .replace(/preserveAspectRatio="[^"]*"/gi, 'preserveAspectRatio="xMaxYMid meet"')
      .replace(/preserveAspectRatio='[^']*'/gi, "preserveAspectRatio='xMaxYMid meet'");
    if (!/preserveAspectRatio=/i.test(svg)) {
      svg = svg.replace(/<svg\b/i, '<svg preserveAspectRatio="xMaxYMid meet"');
    }
    return svg;
  }

  function refreshSeasonVine() {
    const vine = document.getElementById('cwh-season-vine');
    if (!vine) return;
    const w = vine.clientWidth || vine.offsetWidth || 0;
    const useLong = w >= 260;
    const next = seasonVineHTML(useLong ? 'long' : 'short');
    const tag = useLong ? 'long' : 'short';
    if (vine.getAttribute('data-len') === tag && vine.innerHTML) return;
    vine.innerHTML = next;
    vine.setAttribute('data-len', tag);
  }

  function startSeasonVineWatch() {
    const vine = document.getElementById('cwh-season-vine');
    const panel = document.getElementById('cwh-widget');
    if (!vine || !panel) return;
    refreshSeasonVine();
    if (window._cwhVineRO) try { window._cwhVineRO.disconnect(); } catch (e) {}
    const ro = new ResizeObserver(function() {
      clearTimeout(window._cwhVineT);
      window._cwhVineT = setTimeout(refreshSeasonVine, 100);
    });
    ro.observe(panel);
    ro.observe(vine);
    window._cwhVineRO = ro;
  }


  const DUTY_MINI_GOALS = [
    { id: '1', text: 'Мыши ≥35 (+ мох)' },
    { id: '2', text: 'Сбор ресов после 17:00' },
    { id: '3', text: 'Сортировка трав' },
    { id: '4', text: 'Приборка / желчь / костоправы' },
    { id: '5', text: 'Камни → конец' },
  ];

  function getDutyChecksState() {
    try { return JSON.parse(GM_getValue('cwh_duty_checks', '{}') || '{}') || {}; }
    catch (e) { return {}; }
  }
  function setDutyCheck(id, val) {
    const state = getDutyChecksState();
    state[String(id)] = !!val;
    GM_setValue('cwh_duty_checks', JSON.stringify(state));
  }

  function renderDutyMini() {
    const box = document.getElementById('cwh-duty-mini');
    const panel = document.getElementById('cwh-widget');
    if (!box || !panel) return;
    const active = typeof isDutyActive === 'function' && isDutyActive();
    panel.classList.toggle('cwh-duty-on', !!active);
    if (!active) {
      box.innerHTML = '';
      return;
    }
    const state = getDutyChecksState();
    let html = '<div class="cwh-duty-mini-title">Дежурство · цели</div>';
    DUTY_MINI_GOALS.forEach(function(g) {
      const done = !!state[g.id];
      html += '<div class="cwh-duty-mini-item' + (done ? ' done' : '') + '" data-duty-id="' + g.id + '" role="checkbox" aria-checked="' + (done ? 'true' : 'false') + '" tabindex="0">'
        + '<span class="mark">' + (done ? '✓' : '') + '</span>'
        + '<span>' + g.text + '</span></div>';
    });
    html += '<div class="cwh-duty-mini-note">⚠ завершить до полуночи МСК</div>';
    html += '<button type="button" class="cwh-duty-mini-end" id="cwh-duty-mini-end">⏹ Завершить дежурство</button>';
    box.innerHTML = html;

    // клики по пунктам
    box.querySelectorAll('.cwh-duty-mini-item[data-duty-id]').forEach(function(row) {
      row.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        const id = row.getAttribute('data-duty-id');
        const cur = getDutyChecksState();
        const next = !cur[id];
        setDutyCheck(id, next);
        if (typeof cwhBeep === 'function') cwhBeep(next ? 'ok' : 'tick');
        renderDutyMini();
      };
      row.onkeydown = function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          row.click();
        }
      };
    });

    const endB = box.querySelector('#cwh-duty-mini-end');
    if (endB) {
      endB.onclick = function(e) {
        e.stopPropagation();
        if (typeof endDuty === 'function') endDuty();
        expandWidget(true);
        try {
          currentTab = 'memo';
          if (typeof render === 'function') render();
        } catch (err) {}
        if (typeof cwhBeep === 'function') cwhBeep('done');
      };
    }
  }

  function expandWidget(toMemo) {
    const panel = document.getElementById('cwh-widget');
    if (!panel) return;
    const b = panel.querySelector('.cwh-body');
    if (b) {
      b.style.display = 'block';
      b.style.visibility = 'visible';
      b.style.flex = '1 1 auto';
    }
    panel.style.maxHeight = '';
    panel.style.minHeight = '240px';
    panel.style.height = GM_getValue('cwh_h', '520px');
    panel.style.width = GM_getValue('cwh_w', '380px') || '380px';
    panel.style.resize = 'both';
    panel.style.overflow = 'hidden';
    panel.dataset.collapsed = '0';
    panel.classList.remove('cwh-duty-on');
    const vine = panel.querySelector('#cwh-season-vine');
    if (vine) {
      if (!vine.innerHTML) vine.innerHTML = seasonVineHTML();
      vine.style.display = 'block';
    }
    if (toMemo) {
      setTimeout(function() {
        const counts = document.getElementById('cwh-duty-counts');
        if (counts) counts.scrollIntoView({ block: 'nearest' });
      }, 200);
    }
  }

  function collapseWidget() {
    const panel = document.getElementById('cwh-widget');
    if (!panel) return;
    GM_setValue('cwh_h', Math.max(panel.offsetHeight, 240) + 'px');
    GM_setValue('cwh_w', Math.max(panel.offsetWidth, 300) + 'px');
    const b = panel.querySelector('.cwh-body');
    if (b) {
      b.style.display = 'none';
      b.style.visibility = 'hidden';
    }
    panel.style.height = 'auto';
    panel.style.minHeight = '0';
    panel.style.maxHeight = 'none';
    panel.style.width = '250px';
    panel.style.resize = 'none';
    panel.style.overflow = 'hidden';
    panel.dataset.collapsed = '1';
    const vine = panel.querySelector('#cwh-season-vine');
    if (vine) {
      vine.innerHTML = seasonVineHTML();
      vine.style.display = 'block';
    }
    renderDutyMini();
  }


  function createPanel() {
    injectStyle();
    if (document.getElementById('cwh-widget')) return;

    panel = document.createElement('div');
    panel.id = 'cwh-widget';
    panel.style.left = '40px';
    panel.style.top = '80px';
    panel.innerHTML = `
      <div class="cwh-header">
        <span class="cwh-title">⚕ Целитель</span>
        <div class="cwh-header-right">
          <div class="cwh-season-vine" id="cwh-season-vine"></div>
          <div class="cwh-header-btns">
            <button class="cwh-btn" id="cwh-min" title="Свернуть">–</button>
            <button class="cwh-btn" id="cwh-close" title="Скрыть">×</button>
          </div>
        </div>
      </div>
      <div class="cwh-duty-mini" id="cwh-duty-mini"></div>
      <div class="cwh-body" id="cwh-body"></div>
    `;
    document.body.appendChild(panel);
    body = panel.querySelector('#cwh-body');
    makeDraggable(panel, panel.querySelector('.cwh-header'));

    panel.querySelector('#cwh-close').onclick = () => {
      panel.style.display = 'none';
      GM_setValue('cwh_open', false);
    };
    panel.querySelector('#cwh-min').onclick = () => {
      const collapsed = panel.dataset.collapsed === '1';
      if (collapsed) expandWidget(false);
      else collapseWidget();
    };
    // лоза всегда в шапке (short/long по ширине)
    const vine0 = panel.querySelector('#cwh-season-vine');
    if (vine0) {
      vine0.innerHTML = seasonVineHTML();
      try { startSeasonVineWatch(); } catch (e) {}
    }


    const ro = new ResizeObserver(() => {
      clearTimeout(panel._rt);
      panel._rt = setTimeout(savePos, 300);
    });
    ro.observe(panel);
    loadPos();
    // мобильный: при повороте/ресайзе не уезжать за экран
    if (!window._cwhResizeBound) {
      window._cwhResizeBound = true;
      const onView = function() {
        clearTimeout(window._cwhViewT);
        window._cwhViewT = setTimeout(function() {
          try { clampPanel(); } catch (e) {}
        }, 150);
      };
      window.addEventListener('resize', onView);
      window.addEventListener('orientationchange', onView);
    }
    // старт: если мобильный и нет сохранённой позиции — прижать к низу
    try {
      const vw = window.innerWidth;
      if (vw <= 720 && !GM_getValue('cwh_pos', null)) {
        panel.style.width = Math.min(vw - 12, 400) + 'px';
        panel.style.height = Math.min(window.innerHeight * 0.7, 520) + 'px';
        panel.style.left = '6px';
        panel.style.top = Math.max(8, window.innerHeight - panel.offsetHeight - 60) + 'px';
      }
    } catch (e) {}
    render();
  }

  function createToggle() {
    if (document.getElementById('cwh-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'cwh-toggle';
    btn.title = 'Целитель (перетаскивай)';
    btn.textContent = '⚕';

    // restore position
    const saved = GM_getValue('cwh_toggle_pos', null);
    if (saved && saved.left != null && saved.top != null) {
      btn.style.left = saved.left;
      btn.style.top = saved.top;
      btn.style.right = 'auto';
      btn.style.bottom = 'auto';
    }

    let drag = false, moved = false, ox = 0, oy = 0;
    function togPoint(e) {
      const t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
      return { x: t.clientX, y: t.clientY };
    }
    function togStart(e) {
      if (e.type === 'mousedown' && e.button !== 0) return;
      drag = true; moved = false;
      const r = btn.getBoundingClientRect();
      const pt = togPoint(e);
      ox = pt.x - r.left;
      oy = pt.y - r.top;
      try { e.preventDefault(); } catch (err) {}
    }
    function togMove(e) {
      if (!drag) return;
      moved = true;
      const size = btn.offsetWidth || 48;
      const pt = togPoint(e);
      let x = pt.x - ox;
      let y = pt.y - oy;
      x = Math.max(0, Math.min(window.innerWidth - size, x));
      y = Math.max(0, Math.min(window.innerHeight - size, y));
      btn.style.left = x + 'px';
      btn.style.top = y + 'px';
      btn.style.right = 'auto';
      btn.style.bottom = 'auto';
      try { e.preventDefault(); } catch (err) {}
    }
    function togEnd() {
      if (!drag) return;
      drag = false;
      if (moved) {
        GM_setValue('cwh_toggle_pos', { left: btn.style.left, top: btn.style.top });
      }
    }
    btn.addEventListener('mousedown', togStart);
    document.addEventListener('mousemove', togMove);
    document.addEventListener('mouseup', togEnd);
    btn.addEventListener('touchstart', togStart, { passive: false });
    document.addEventListener('touchmove', togMove, { passive: false });
    document.addEventListener('touchend', togEnd);
    document.addEventListener('touchcancel', togEnd);

    btn.addEventListener('click', e => {
      if (moved) { e.preventDefault(); e.stopPropagation(); return; }
      if (!panel) createPanel();
      const open = panel.style.display === 'none';
      panel.style.display = open ? 'flex' : 'none';
      GM_setValue('cwh_open', open);
      if (open) try { clampPanel(); } catch (err) {}
    });

    document.body.appendChild(btn);
  }

  /* ========================================================================
     РЕНДЕР
     ======================================================================== */
  function render() {
    if (!body) return;
    body.innerHTML = `
      <div class="cwh-tabs">
        <div class="cwh-tab ${currentTab==='diseases'?'active':''}" data-tab="diseases">Болезни</div>
        <div class="cwh-tab ${currentTab==='herbs'?'active':''}" data-tab="herbs">Травы</div>
        <div class="cwh-tab ${currentTab==='calc'?'active':''}" data-tab="calc">Кальк.</div>
        <div class="cwh-tab ${currentTab==='kost'?'active':''}" data-tab="kost">Костоправ</div>
        <div class="cwh-tab ${currentTab==='seq'?'active':''}" data-tab="seq">Действия</div>
        <div class="cwh-tab ${currentTab==='memo'?'active':''}" data-tab="memo">Памятка</div>
      </div>
      <div id="cwh-content"></div>
    `;
    body.querySelectorAll('.cwh-tab').forEach(t => {
      t.onclick = () => { currentTab = t.dataset.tab; render(); };
    });
    const content = body.querySelector('#cwh-content');
    if (currentTab === 'diseases') renderDiseases(content);
    else if (currentTab === 'herbs') renderHerbs(content);
    else if (currentTab === 'calc') renderCalc(content);
    else if (currentTab === 'kost') renderKost(content);
    else if (currentTab === 'seq') renderSeq(content);
    else renderMemo(content);
  }

  function renderDiseases(el) {
    const age = GM_getValue('cwh_cat_age', 'adult');
    el.innerHTML = DISEASES.map(d => {
      const ov = OVERLAYS[d.id];
      const stages = ov ? (ov.adult || []).length : 0;
      let preview = '';
      if (ov) {
        const st = 1;
        preview = '<div class="cwh-cat-preview" data-did="' + d.id + '">'
          + '<div class="cwh-age-btns">'
          + '<button type="button" data-age="adult" class="' + (age==='adult'?'on':'') + '">Взрослый (≥4л)</button>'
          + '<button type="button" data-age="kitten" class="' + (age==='kitten'?'on':'') + '">Котёнок (&lt;4л)</button>'
          + '</div>'
          + '<div class="cwh-cat-view">' + catPreviewHtml(d.id, st, age) + '</div>'
          + (stages > 1
            ? '<div class="cwh-stage-btns">' + Array.from({length: stages}, (_, i) =>
                '<button type="button" data-st="' + (i+1) + '" class="' + (i===0?'on':'') + '">' + (i+1) + ' ст</button>'
              ).join('') + '</div>'
            : '')
          + '</div>';
      }
      return `
      <div class="cwh-card cwh-disease-card" data-id="${d.id}">
        <div class="cwh-card-body">
          <div class="cwh-card-title">${d.name}</div>
          <div class="cwh-card-meta">
            <b>Причины:</b> ${d.causes}<br>
            <b>Вид:</b> ${d.visual}<br>
            <b>Лечение:</b> ${d.treatments.join(', ')}
          </div>
          <div class="cwh-note">${d.notes}</div>
          ${preview}
        </div>
      </div>`;
    }).join('');

    el.querySelectorAll('.cwh-cat-preview').forEach(box => {
      const did = box.dataset.did;
      let curAge = GM_getValue('cwh_cat_age', 'adult');
      let curSt = 1;
      const view = box.querySelector('.cwh-cat-view');
      function redraw() {
        view.innerHTML = catPreviewHtml(did, curSt, curAge);
      }
      box.querySelectorAll('.cwh-age-btns button').forEach(btn => {
        btn.onclick = () => {
          curAge = btn.dataset.age;
          GM_setValue('cwh_cat_age', curAge);
          box.querySelectorAll('.cwh-age-btns button').forEach(b => b.classList.toggle('on', b === btn));
          // reset stage buttons length may differ
          curSt = 1;
          const stBox = box.querySelector('.cwh-stage-btns');
          if (stBox) {
            stBox.querySelectorAll('button').forEach((b, i) => b.classList.toggle('on', i === 0));
          }
          redraw();
        };
      });
      box.querySelectorAll('.cwh-stage-btns button').forEach(btn => {
        btn.onclick = () => {
          curSt = +btn.dataset.st;
          box.querySelectorAll('.cwh-stage-btns button').forEach(b => b.classList.toggle('on', b === btn));
          redraw();
        };
      });
    });
  }

  function renderHerbs(el) {
    const cu = +GM_getValue('cwh_cu', 5);
    const filter = GM_getValue('cwh_herb_filter', 'all');
    const FILTERS = [
      { id: 'all', label: 'Все' },
      { id: 'кашель', label: 'Кашель' },
      { id: 'отравление', label: 'Отравление' },
      { id: 'раны', label: 'Раны / ПУ' },
      { id: 'кровотечение', label: 'Кровотечение' },
      { id: 'грязь', label: 'Грязь / блохи' },
      { id: 'ресурс', label: 'Ресурс' },
    ];
    let html = ''
      + '<div class="cwh-section-title">Уровень ЦУ (раны / ПУ)</div>'
      + '<div class="cwh-row"><div><label>ЦУ 0–9</label>'
      + '<input type="number" id="cwh-cu-in" min="0" max="9" value="' + cu + '"></div>'
      + '<div><label>% за 1 дозу</label>'
      + '<input type="text" id="cwh-cu-out" readonly value="' + (CU_PCT[cu] || '?') + '%"></div></div>'
      + '<div class="cwh-section-title">Фильтр</div>'
      + '<div class="cwh-filter-row" id="cwh-herb-filters">'
      + FILTERS.map(f => '<button type="button" class="cwh-filter-btn' + (filter===f.id?' on':'') + '" data-f="' + f.id + '">' + f.label + '</button>').join('')
      + '</div>'
      + '<div class="cwh-section-title">Список трав</div>'
      + '<div id="cwh-herb-list"></div>';
    el.innerHTML = html;

    function matchFilter(h, f) {
      if (f === 'all') return true;
      if (f === 'ресурс') return !(h.treats && h.treats.length);
      const treats = (h.treats || []).join(' ').toLowerCase();
      if (f === 'раны') return /ран|пу/i.test(treats);
      if (f === 'грязь') return /гряз|блох/i.test(treats) || /желчью/i.test(h.name);
      return treats.indexOf(f) !== -1;
    }
    function drawList() {
      const f = GM_getValue('cwh_herb_filter', 'all');
      const c = Math.max(0, Math.min(9, +el.querySelector('#cwh-cu-in').value || 0));
      let listHtml = '';
      HERBS.filter(h => matchFilter(h, f)).forEach(h => {
        const cuPct = CU_PCT[c] || '?';
        let pctBadge = '';
        // Крапива: семена фикс 10% отрав., листья — от ЦУ на раны
        if (h.name === 'Крапива') {
          pctBadge = '<span class="cwh-pct-badge fix">10%</span>'
            + '<span class="cwh-pct-badge cu">' + cuPct + '% · ЦУ ' + c + '</span>';
        } else if (h.fixedPct != null) {
          pctBadge = '<span class="cwh-pct-badge fix">' + h.fixedPct + '%</span>';
        } else if (h.treats && h.treats.length) {
          pctBadge = '<span class="cwh-pct-badge cu">' + cuPct + '% · ЦУ ' + c + '</span>';
        } else {
          pctBadge = '<span class="cwh-pct-badge res">ресурс</span>';
        }
        const sc = typeof sortCategoryForHerb === 'function' ? sortCategoryForHerb(h) : null;
        const sortLine = sc ? '<div class="cwh-sort-hint">' + sc.label + '</div>' : '';
        const pills = (h.treats || []).map(t => '<span class="cwh-pill">' + t + '</span>').join('')
          || '<span class="cwh-pill">ресурс</span>';
        listHtml += '<div class="cwh-card">' + icon(h.name, 64)
          + '<div class="cwh-card-body">'
          + '<div class="cwh-card-title"><span class="cwh-card-name">' + h.name + '</span>'
          + '<span class="cwh-pct-wrap">' + pctBadge + '</span></div>'
          + '<div class="cwh-card-meta">' + (h.note || '') + ' · ' + (h.prep || '') + (h.id ? ' · ID ' + h.id : '') + '</div>'
          + sortLine
          + '<div>' + pills + '</div></div></div>';
      });
      el.querySelector('#cwh-herb-list').innerHTML = listHtml || '<div class="cwh-note">Ничего не найдено</div>';
    }
    el.querySelectorAll('.cwh-filter-btn').forEach(btn => {
      btn.onclick = () => {
        GM_setValue('cwh_herb_filter', btn.dataset.f);
        el.querySelectorAll('.cwh-filter-btn').forEach(b => b.classList.toggle('on', b === btn));
        drawList();
      };
    });
    const inp = el.querySelector('#cwh-cu-in');
    const out = el.querySelector('#cwh-cu-out');
    inp.oninput = () => {
      const v = setCuLevel(inp.value);
      out.value = (CU_PCT[v] || '?') + '%';
      drawList();
    };
    drawList();
  }

  function renderCalc(el) {
    const cu = +GM_getValue('cwh_cu', 5);
    const cuPct = CU_PCT[cu] || 20;

    // пулы трав по типу
    const POOLS = {
      wound: HERBS.filter(h => (h.treats||[]).some(t => /ран|пу|кровот/i.test(t)) && (h.fixedPct == null || h.name === 'Крапива')),
      cough: HERBS.filter(h => (h.treats||[]).some(t => /кашл/i.test(t))),
      poison: HERBS.filter(h => (h.treats||[]).some(t => /отрав/i.test(t))),
      dirt: HERBS.filter(h => /мышиной желчью/i.test(h.name)),
    };

    function healOf(h, type) {
      // % от актуального ЦУ для ран/ПУ; фикс для кашля/отравления
      const liveCu = Math.max(0, Math.min(9, +(el.querySelector('#cwh-cu2') || {}).value || +GM_getValue('cwh_cu', 5)));
      const livePct = CU_PCT[liveCu] || cuPct;
      if (type === 'dirt') return 2.66;
      // Крапива: отравление = 10% (семена), раны = от ЦУ (листья)
      if (h && h.name === 'Крапива') {
        if (type === 'poison') return 10;
        if (type === 'wound') return livePct;
      }
      if (type === 'wound') return (h.fixedPct != null && !(h.treats||[]).some(t => /ран|пу/i.test(t))) ? h.fixedPct : livePct;
      // для ран с fixedPct null — ЦУ; если у травы только раны и fixed null — ЦУ
      if (type === 'wound') return livePct;
      if (h.fixedPct != null) return h.fixedPct;
      if (type === 'cough') return h.fixedPct || 5;
      if (type === 'poison') return h.fixedPct || 7;
      return livePct;
    }

    el.innerHTML = `
      <div class="cwh-section-title">Калькулятор лечения</div>
      <div class="cwh-row">
        <div>
          <label>Текущее HP %</label>
          <input type="number" id="cwh-hp" min="0" max="100" value="50">
        </div>
        <div>
          <label>ЦУ (для ран/ПУ) → % хила</label>
          <input type="number" id="cwh-cu2" min="0" max="9" value="${cu}">
        </div>
      </div>
      <div class="cwh-note" id="cwh-cu-live">Сейчас ЦУ ${cu} = <b>${cuPct}%</b> за 1 дозу (раны/ПУ). Меняется сразу при смене ЦУ.</div>
      <button type="button" class="cwh-link-btn" id="cwh-from-mouth" style="margin:6px 0 10px;width:100%">📥 Взять травы из рта</button>
      <label>Тип травмы</label>
      <select id="cwh-type">
        <option value="wound">Раны / ПУ / кровотечение</option>
        <option value="poison">Отравление</option>
        <option value="dirt">Грязь / блохи</option>
      </select>

      <div class="cwh-section-title">Модель (травма)</div>
      <div id="cwh-calc-cat"></div>

      <div class="cwh-section-title">Рекомендации (авто)</div>
      <div class="cwh-result" id="cwh-auto">—</div>

      <div class="cwh-section-title">Свой набор</div>
      <div class="cwh-note">Отметь травы и укажи количество — увидишь суммарный хил.</div>
      <div id="cwh-pick"></div>
      <div class="cwh-result" id="cwh-custom">—</div>

      <div class="cwh-section-title">Смесь от кашля (70%)</div>
      <div id="cwh-mix" class="cwh-mix-row">
        ${COUGH_MIX.map((m, i) => `
          <label class="cwh-check">
            <input type="checkbox" data-i="${i}">
            ${icon(m.name, 44)}
            <span>${m.qty > 1 ? m.qty + '× ' : ''}${m.name}</span>
          </label>
        `).join('')}
      </div>
      <div class="cwh-result" id="cwh-res-mix">Отметьте компоненты смеси</div>
      <div class="cwh-note">Смесь без разделения → <b>70% HP</b> (5 мест во рту)</div>
    `;

    const hpEl = el.querySelector('#cwh-hp');
    const cuEl = el.querySelector('#cwh-cu2');
    const typeEl = el.querySelector('#cwh-type');
    const pickEl = el.querySelector('#cwh-pick');
    const autoEl = el.querySelector('#cwh-auto');
    const customEl = el.querySelector('#cwh-custom');

    function rebuildPick() {
      const type = typeEl.value;
      // не показываем компоненты смеси отдельно в «своём наборе» для кашля — смесь ниже
      let pool = (POOLS[type] || []).slice();
      if (type === 'cough') {
        // оставляем травы кашля, но смесь — отдельный блок с чекбоксами
      }
      pickEl.innerHTML = '<div class="cwh-pick-grid">' + pool.map((h, i) => {
        const per = healOf(h, type);
        return '<label class="cwh-pick-card" data-i="' + i + '">'
          + '<div class="per">' + (Math.round(per*10)/10) + '% / шт</div>'
          + icon(h.name, 48)
          + '<div class="name" title="' + h.name + '">' + h.name + '</div>'
          + '<input type="number" class="cwh-pick-qty" data-i="' + i + '" min="1" max="' + (type === 'dirt' ? 50 : 20) + '" value="1" disabled>'
          + '<div class="tot cwh-pick-tot" data-i="' + i + '">—</div>'
          + '<input type="checkbox" class="cwh-pick-cb" data-i="' + i + '">'
          + '</label>';
      }).join('') + '</div>';

      pickEl.querySelectorAll('.cwh-pick-cb').forEach(cb => {
        cb.onchange = () => {
          const card = cb.closest('.cwh-pick-card');
          const qty = pickEl.querySelector('.cwh-pick-qty[data-i="'+cb.dataset.i+'"]');
          qty.disabled = !cb.checked;
          card.classList.toggle('on', cb.checked);
          updateCardTot(cb.dataset.i);
          recalcCustom();
        };
      });
      pickEl.querySelectorAll('.cwh-pick-qty').forEach(q => {
        q.oninput = () => { updateCardTot(q.dataset.i); recalcCustom(); };
        q.onclick = e => e.stopPropagation();
      });
    }
    function updateCardTot(i) {
      const type = typeEl.value;
      const pool = POOLS[type] || [];
      const h = pool[+i];
      if (!h) return;
      const cb = pickEl.querySelector('.cwh-pick-cb[data-i="'+i+'"]');
      const qtyEl = pickEl.querySelector('.cwh-pick-qty[data-i="'+i+'"]');
      const totEl = pickEl.querySelector('.cwh-pick-tot[data-i="'+i+'"]');
      if (!cb || !cb.checked) { if (totEl) totEl.textContent = '—'; return; }
      const per = healOf(h, type);
      const qty = Math.max(1, +qtyEl.value || 1);
      totEl.textContent = '= ' + (Math.round(per * qty * 10) / 10) + '%';
    }

    function recalcAuto() {
      const hp = Math.max(0, Math.min(100, +hpEl.value || 0));
      const need = 100 - hp;
      const type = typeEl.value;
      const c = Math.max(0, Math.min(9, +cuEl.value || 0));
      GM_setValue('cwh_cu', c);
      const pool = POOLS[type] || [];
      if (!pool.length) { autoEl.innerHTML = '—'; return; }

      // сортируем: сначала более сильные
      const ranked = pool.map(h => ({ h, per: healOf(h, type) }))
        .sort((a,b) => b.per - a.per);

      let left = need;
      const plan = [];
      // жадно: берём лучшие
      for (const {h, per} of ranked) {
        if (left <= 0) break;
        if (per <= 0) continue;
        const n = Math.ceil(left / per);
        // для смеси-кашля особый случай
        plan.push({ name: h.name, n, per, total: Math.round(n * per * 10) / 10 });
        left -= n * per;
      }

      // если кашель — предложить смесь
      let mixNote = '';
      if (type === 'cough' && need <= 70) {
        mixNote = '<div style="margin-top:6px;color:#9fd66c">💡 Или <b>смесь от кашля</b> → 70% за раз</div>';
      }

      if (!plan.length) {
        autoEl.innerHTML = 'Нечего предложить';
        return;
      }

      const best = ranked[0];
      const nBest = Math.ceil(need / best.per);
      let html = '<div style="margin-bottom:8px">Нужно: <b>' + need + '%</b>';
      if (type === 'wound') html += ' · ЦУ ' + c + ' = <b>' + (CU_PCT[c]||'?') + '%</b>/доза';
      html += '</div>';
      html += '<div class="cwh-pick-grid">';
      ranked.forEach(({h, per}, idx) => {
        const n = Math.ceil(need / per);
        const tot = Math.round(n * per * 10) / 10;
        const isBest = idx === 0;
        html += '<div class="cwh-pick-card' + (isBest ? ' on' : '') + '" style="cursor:default">'
          + '<div class="per">' + (Math.round(per*10)/10) + '% / шт</div>'
          + icon(h.name, 48)
          + '<div class="name" title="' + h.name + '">' + h.name + '</div>'
          + '<div style="font-size:12px;color:#e8eaed;margin-top:2px">× <b>' + n + '</b></div>'
          + '<div class="tot" style="color:#9fd66c">= ' + tot + '%</div>'
          + (isBest ? '<div style="font-size:9px;color:#9fd66c;margin-top:2px">лучше</div>' : '')
          + '</div>';
      });
      html += '</div>';
      html += mixNote;
      autoEl.innerHTML = html;
    }

    function recalcCustom() {
      const hp = Math.max(0, Math.min(100, +hpEl.value || 0));
      const need = 100 - hp;
      const type = typeEl.value;
      const pool = POOLS[type] || [];
      let sum = 0;
      let lines = [];
      pickEl.querySelectorAll('.cwh-pick-cb').forEach(cb => {
        const i = +cb.dataset.i;
        const h = pool[i];
        const totCell = pickEl.querySelector('.cwh-pick-tot[data-i="'+i+'"]');
        if (!cb.checked || !h) {
          if (totCell) totCell.textContent = '—';
          return;
        }
        const qty = Math.max(1, +pickEl.querySelector('.cwh-pick-qty[data-i="'+i+'"]').value || 1);
        const per = healOf(h, type);
        const tot = Math.round(per * qty * 10) / 10;
        sum += tot;
        if (totCell) totCell.innerHTML = '<b>' + tot + '%</b>';
        lines.push({ name: h.name, qty: qty, per: per, tot: tot });
      });
      sum = Math.round(sum * 10) / 10;
      if (!lines.length) {
        customEl.innerHTML = 'Отметьте травы и количество';
        return;
      }
      const ok = sum >= need;
      customEl.innerHTML = '<div style="padding:8px;border-radius:8px;background:'
        + (ok ? 'rgba(127,174,92,.15)' : 'rgba(200,80,80,.12)') + '">'
        + 'Сумма: <b style="font-size:15px">' + sum + '%</b> · нужно <b>' + need + '%</b> → '
        + (ok ? '<b style="color:#9fd66c">хватит ✓</b>' : '<b style="color:#e88">не хватает ≈ ' + (Math.round((need-sum)*10)/10) + '%</b>')
        + '</div>';
    }

    const catBox = el.querySelector('#cwh-calc-cat');

    // ЦУ → сразу % хила
    function refreshCuLive() {
      const v = setCuLevel(cuEl.value);
      const pct = CU_PCT[v] || '?';
      const live = el.querySelector('#cwh-cu-live');
      if (live) live.innerHTML = 'Сейчас ЦУ <b>' + v + '</b> = <b>' + pct + '%</b> за 1 дозу (раны/ПУ). Меняется сразу при смене ЦУ.';
      rebuildPick();
      recalcAuto && recalcAuto();
      recalcCustom && recalcCustom();
      updateCalcCat();
    }
    cuEl.oninput = refreshCuLive;
    cuEl.onchange = refreshCuLive;
    hpEl.oninput = () => { recalcAuto && recalcAuto(); recalcCustom && recalcCustom(); updateCalcCat(); };

    // из рта
    const mouthBtn = el.querySelector('#cwh-from-mouth');
    if (mouthBtn) mouthBtn.onclick = function() {
      const items = scanMouthItems();
      const type = typeEl.value;
      const pool = POOLS[type] || [];
      if (!items.length) { cwhBeep('warn'); mouthBtn.textContent = '📥 Во рту пусто'; return; }
      // сбросить выбор
      pickEl.querySelectorAll('.cwh-pick-cb').forEach(cb => { cb.checked = false; cb.onchange && cb.onchange(); });
      let matched = 0;
      items.forEach(it => {
        if (!it.herb) return;
        const idx = pool.findIndex(h => h.name === it.herb.name || String(h.id) === String(it.tid));
        if (idx < 0) return;
        const cb = pickEl.querySelector('.cwh-pick-cb[data-i="'+idx+'"]');
        const qty = pickEl.querySelector('.cwh-pick-qty[data-i="'+idx+'"]');
        if (!cb) return;
        if (!cb.checked) { cb.checked = true; cb.onchange && cb.onchange(); }
        if (qty) qty.value = Math.min(50, (+qty.value || 0) + 1);
        updateCardTot(String(idx));
        matched++;
      });
      recalcCustom && recalcCustom();
      if (matched) { cwhBeep('ok'); mouthBtn.textContent = '📥 Из рта: +' + matched + ' поз.'; }
      else { cwhBeep('warn'); mouthBtn.textContent = '📥 Нет трав для этого типа'; }
      setTimeout(() => { mouthBtn.textContent = '📥 Взять травы из рта'; }, 2500);
    };

        function updateCalcCat() {
      const did = calcTypeToDisease(typeEl.value);
      // стадия по HP для dirt/wounds: грубо 4 ступени
      const hp = Math.max(0, Math.min(100, +hpEl.value || 0));
      let st = 1;
      if (did === 'dirt' || did === 'wounds') {
        if (hp < 25) st = 4;
        else if (hp < 50) st = 3;
        else if (hp < 75) st = 2;
        else st = 1;
      }
      catBox.innerHTML = catPreviewBlock(did, { stage: st, hp: hp });
      bindCatPreview(catBox);
    }
    function fullRecalc() {
      rebuildPick();
      recalcAuto();
      recalcCustom();
      updateCalcCat();
    }
    hpEl.oninput = () => { recalcAuto(); recalcCustom(); updateCalcCat(); };
    cuEl.oninput = fullRecalc;
    typeEl.onchange = fullRecalc;

    const mixBoxes = el.querySelectorAll('#cwh-mix input[type=checkbox]');
    const mixRes = el.querySelector('#cwh-res-mix');
    function recalcMix() {
      const n = [...mixBoxes].filter(b => b.checked).length;
      if (n === COUGH_MIX.length) {
        mixRes.innerHTML = '<strong style="color:#9fd66c">Смесь полная</strong> — можно использовать → <b>70% HP</b>';
      } else {
        mixRes.innerHTML = 'Собрано <b>' + n + '</b> из <b>' + COUGH_MIX.length + '</b> компонентов';
      }
    }
    mixBoxes.forEach(b => { b.onchange = recalcMix; });
    recalcMix();

    fullRecalc();
  }

  function renderKost(el) {
    const vineSrc = IMG['Костоправ'] || '';
    const spiderSrc = IMG['Костоправ2'] || vineSrc;
    el.innerHTML = ''
      + '<div class="cwh-section-title">Калькулятор костоправа</div>'
      + '<div class="cwh-row"><div><label>Луны</label><input type="number" id="k-moons" min="0" value="12"></div>'
      + '<div><label>Рост % (авто)</label><input type="number" id="k-growth" min="0" max="100" value="68"></div></div>'
      + '<div class="cwh-row"><div><label>Текущее HP %</label><input type="number" id="k-hp" min="0" max="100" value="40"></div>'
      + '<div><label>Тип</label><div style="display:flex;align-items:center;gap:8px;">'
      + '<select id="k-type" style="flex:1"><option value="vine">Вьюнковый</option><option value="spider">Паутинный (+15%)</option></select>'
      + '<img id="k-type-img" class="cwh-icon" src="' + vineSrc + '" data-full="' + vineSrc + '" alt="Костоправ" style="width:52px;height:52px;object-fit:contain;border-radius:8px;background:rgba(255,255,255,.06);">'
      + '</div></div></div>'
      + '<div class="cwh-row"><div><label>Часов ношения</label><input type="number" id="k-hours" min="1" value="24"></div>'
      + '<div><label>Кол-во</label><input type="number" id="k-num" min="1" max="5" value="1"></div></div>'
      + '<div style="display:flex;align-items:center;gap:8px;margin:8px 0;justify-content:center">'+ '<img class="cwh-icon cwh-cycle-kost-comp" src="' + spiderSrc + '" data-full="' + spiderSrc + '" alt="Паутина" style="width:44px;height:44px;object-fit:contain;border-radius:8px;background:rgba(0,0,0,.3)">'+ '<span style="color:#8e969e">↔</span>'+ '<img class="cwh-icon cwh-cycle-kost-res" src="' + vineSrc + '" data-full="' + vineSrc + '" alt="Костоправ" style="width:44px;height:44px;object-fit:contain;border-radius:8px;background:rgba(0,0,0,.3)">'+ '</div>'+ '<div class="cwh-result" id="k-res">—</div>'
      + '<div class="cwh-result" id="k-deg" style="margin-top:6px">—</div>'
      + '<div class="cwh-section-title">Модель (перелом / ЛУ)</div>'
      + '<div id="k-cat"></div>'
      + '<div class="cwh-note">• Не хиляет переломы, полученные во время ношения.<br>• Среднее ~2 дня, мин 5 ч, макс 5 дней.<br>• Не перенашивай — есть лимит хила.</div>';

    const moonsInp = el.querySelector('#k-moons');
    const growthInp = el.querySelector('#k-growth');
    const typeSel = el.querySelector('#k-type');
    const typeImg = el.querySelector('#k-type-img');

    function updateTypeImg() {
      const src = typeSel.value === 'spider' ? spiderSrc : vineSrc;
      typeImg.src = src; typeImg.dataset.full = src;
      const lab = el.querySelector('#k-type-label');
      if (lab) lab.textContent = typeSel.value === 'spider' ? 'паутинный' : 'вьюнковый';
    }
    typeSel.onchange = function() { updateTypeImg(); recalc(); };
    moonsInp.oninput = function() {
      growthInp.value = Math.round(growthByMoons(+moonsInp.value || 0));
      recalc();
    };

    function recalc() {
      const moons = +moonsInp.value || 0;
      const growth = +growthInp.value || 50;
      const hp = Math.max(0, Math.min(100, +el.querySelector('#k-hp').value || 0));
      const type = typeSel.value;
      const hours = Math.max(1, +el.querySelector('#k-hours').value || 24);
      const maxN = maxKostoprav(moons);
      let num = +el.querySelector('#k-num').value || 1;
      if (num < 1) num = 1;
      if (num > maxN) {
        num = maxN;
        el.querySelector('#k-num').value = maxN;
      }
      // ограничение input max
      const numInp = el.querySelector('#k-num');
      if (numInp) { numInp.max = maxN; numInp.title = 'Макс. по лунам: ' + maxN; }

      const deg = fractureDegree(hp);
      el.querySelector('#k-deg').innerHTML = 'HP <strong>' + hp + '%</strong> → <strong>' + deg.name + '</strong> · макс. костоправов: <strong>' + maxN + '</strong>';

      const need = Math.max(0, 100 - hp);
      // доля хила за 1 вьюнковый из таблицы
      let frac = kostHealFraction(moons, hours);
      if (type === 'spider') frac *= 1.15;
      // потолок разумный
      if (frac > 1.2) frac = 1.2;
      const perOne = Math.round(frac * 1000) / 10; // %
      const total = Math.round(perOne * num * 10) / 10;
      const ok = total >= need - 0.05;

      // рекомендация: сколько нужно при этих часах
      let needNum = perOne > 0 ? Math.ceil(need / perOne) : maxN;
      if (needNum < 1) needNum = 1;
      const needNumClamped = Math.min(needNum, maxN);
      const healIfRecommend = Math.round(perOne * needNumClamped * 10) / 10;

      // подбор оптимальных часов при maxN слотах
      let bestHours = hours;
      let bestFrac = frac;
      let bestNum = needNumClamped;
      const hourOptions = [6,9,12,15,18,21,24,30,36,42,48,54,60,66,72];
      for (const h of hourOptions) {
        let f = kostHealFraction(moons, h);
        if (type === 'spider') f *= 1.15;
        if (f > 1.2) f = 1.2;
        const p = f * 100;
        if (p <= 0) continue;
        const n = Math.min(maxN, Math.ceil(need / p));
        if (p * n >= need - 0.05) {
          // берём минимальные часы среди тех, что хватает
          if (h < bestHours || (bestFrac * 100 * bestNum < need - 0.05)) {
            bestHours = h;
            bestFrac = f;
            bestNum = n;
          }
          break; // hourOptions sorted ascending
        }
      }

      const kRes = el.querySelector('#k-res');
      kRes.className = 'cwh-result ' + (ok ? 'good' : 'bad');
      let html = 'Хил за <strong>' + hours + ' ч</strong> (' + num + ' шт., '
        + (type === 'spider' ? 'паутинный ×1.15' : 'вьюнковый') + '):<br>'
        + '<strong style="color:' + (ok ? '#9fd66c' : '#ff8a8a') + '">≈ ' + total.toFixed(1) + '%</strong>'
        + ' <span style="opacity:.8">(' + perOne + '% × ' + num + ')</span>'
        + (ok
          ? ' — <span style="color:#9fd66c">хватит</span>'
          : (' — <span style="color:#ff8a8a;font-weight:600">не хватает ≈ ' + (need - total).toFixed(1) + '%</span>'));
      html += '<br><span style="font-size:11px;opacity:.85">Нужно залечить: <b>' + need + '%</b></span>';
      if (needNum > maxN) {
        html += '<br><span style="color:#ff8a8a;font-size:12px">⚠ При ' + hours + ' ч нужно <b>' + needNum + '</b> шт., но по лунам максимум <b>' + maxN + '</b> → вылечит ≈ <b>' + healIfRecommend + '%</b></span>';
      } else if (needNum !== num) {
        html += '<br><span style="color:#9fd66c;font-size:12px">💡 Рекомендация: выдать <b>' + needNum + '</b> шт. на <b>' + hours + ' ч</b> (≈' + (Math.round(perOne*needNum*10)/10) + '%)</span>';
      }
      if (bestHours !== hours || bestNum !== num) {
        const bp = Math.round(bestFrac * 1000) / 10;
        html += '<br><span style="color:#c8e6a0;font-size:11px">Оптимум: <b>' + bestNum + '</b> шт. × <b>' + bestHours + ' ч</b> → ≈' + (Math.round(bp*bestNum*10)/10) + '%</span>';
      }
      html += '<br><span style="font-size:10px;opacity:.65">Таблица: reireirei72 bonesetter · паутинный ≈ +15%</span>';
      kRes.innerHTML = html;
    }
    const kCat = el.querySelector('#k-cat');
    function updateKostCat() {
      if (!kCat) return;
      const moons = +moonsInp.value || 0;
      const hp = +el.querySelector('#k-hp').value || 0;
      const age = moons < 4 ? 'kitten' : 'adult';
      GM_setValue('cwh_cat_age', age);
      let st = 1;
      if (hp < 25) st = 4;
      else if (hp < 50) st = 3;
      else if (hp < 75) st = 2;
      else st = 1;
      kCat.innerHTML = catPreviewBlock('fracture', { stage: st, hp: hp, age: age });
      const box = kCat.querySelector('.cwh-cat-preview');
      if (box) {
        const view = box.querySelector('.cwh-cat-view');
        if (view) view.innerHTML = catPreviewHtml('fracture', st, age, hp);
        box.querySelectorAll('.cwh-age-btns button').forEach(b => {
          b.classList.toggle('on', b.dataset.age === age);
        });
        box.querySelectorAll('.cwh-stage-btns button').forEach(b => {
          b.classList.toggle('on', +b.dataset.st === st);
        });
        bindCatPreview(kCat);
      }
    }
    function doRecalc() {
      recalc();
      updateKostCat();
    }
    ['k-growth','k-hp','k-hours','k-num'].forEach(function(id) {
      el.querySelector('#' + id).oninput = doRecalc;
      el.querySelector('#' + id).onchange = doRecalc;
    });
    moonsInp.oninput = function() {
      growthInp.value = Math.round(growthByMoons(+moonsInp.value || 0));
      doRecalc();
    };
    typeSel.onchange = function() { updateTypeImg(); doRecalc(); };

    growthInp.value = Math.round(growthByMoons(+moonsInp.value || 12));
    updateTypeImg();
    doRecalc();
    startIconCycles();
  }

  function renderSeq(el) {
    function flow(parts) {
      return '<div class="cwh-recipe-flow">' + parts.map(p => {
        if (p === '→' || p === '+') return '<span class="cwh-arrow">' + p + '</span>';
        if (p === '__MOUSE__') {
          return '<img class="cwh-icon cwh-cycle-mouse" src="' + MICE[0].src + '" alt="' + MICE[0].name + '" data-full="' + MICE[0].src + '" title="' + MICE[0].name + '" style="width:40px;height:40px;object-fit:contain;border-radius:6px;background:rgba(0,0,0,.35);">';
        }
        if (p === '__KOST_FLOW__') {
          return '<span class="cwh-kost-flow-wrap" id="cwh-kost-flow"></span>';
        }
        const src = IMG[p] || IMG[p.replace(/ё/g,'е')];
        if (p === 'Целебная водоросль' && typeof ALGAE !== 'undefined') {
          return '<img class="cwh-icon cwh-cycle-algae" src="' + ALGAE[0].src + '" alt="' + p + '" data-full="' + ALGAE[0].src + '" title="' + p + '">';
        }
        if (src) return '<img class="cwh-icon" src="' + src + '" alt="' + p + '" data-full="' + src + '" title="' + p + '">';
        return '<span style="font-size:11px;color:#a6adb5">' + p + '</span>';
      }).join('') + '</div>';
    }
    // mode: in = внутрь, out = на шерсть, craft = крафт
    const rows = [
      { name: 'Мёд', treat: 'кашель', pct: '3%', recipe: 'есть как дичь (не делить, не жевать)', parts: ['Мёд'], tags: ['кашель'], mode: 'in' },
      { name: 'Пижма', treat: 'кашель', pct: '5%', recipe: 'целую → разделить → стебель → съесть', parts: ['Пижма', '→', 'Стебель'], tags: ['кашель'], mode: 'in' },
      { name: 'Кошачья мята', treat: 'кашель', pct: '10%', recipe: 'целую → разделить → листья → съесть', parts: ['Кошачья мята', '→', 'Листья'], tags: ['кашель'], mode: 'in' },
      { name: 'Бурачник', treat: 'кашель', pct: '5%', recipe: 'целый → разделить → листья → съесть', parts: ['Бурачник', '→', 'Листья'], tags: ['кашель'], mode: 'in' },
      { name: 'Мать-и-мачеха', treat: 'кашель', pct: '5%', recipe: 'целую → разделить → листья → разжевать → съесть', parts: ['Мать-и-мачеха', '→', 'Листья', '→', 'Разжёванные листья'], tags: ['кашель'], mode: 'in' },
      { name: 'Мятлик', treat: 'отравление', pct: '5%', recipe: 'целый → разделить → семена → съесть', parts: ['Мятлик', '→', 'Семена'], tags: ['отравление'], mode: 'in' },
      { name: 'Целебная водоросль', treat: 'отравление', pct: '10%', recipe: 'разжевать → съесть', parts: ['Целебная водоросль'], tags: ['отравление'], mode: 'in' },
      { name: 'Рябина', treat: 'отравление', pct: '10%', recipe: 'целую → разделить → ягоды → съесть', parts: ['Рябина', '→', 'Ягоды'], tags: ['отравление'], mode: 'in' },
      { name: 'Одуванчик', treat: 'отравление', pct: '10%', recipe: 'целый → разделить → листья → разжевать → съесть', parts: ['Одуванчик', '→', 'Листья', '→', 'Разжёванные листья'], tags: ['отравление'], mode: 'in' },
      { name: 'Крапива (отравление)', treat: 'отравление', pct: '10%', recipe: 'Разделить → Семена → Съесть', parts: ['Крапива', '→', 'Семена'], tags: ['отравление'], mode: 'in' },
      { name: 'Шиповник', treat: 'раны / утопление', pct: 'от ЦУ', recipe: 'разделить → листья → разжевать → наложить на шерсть', parts: ['Шиповник', '→', 'Листья', '→', 'Разжёванные листья'], tags: ['раны', 'утопление'], mode: 'out' },
      { name: 'Щавель', treat: 'раны / утопление', pct: 'от ЦУ', recipe: 'разделить → сок → наложить на шерсть', parts: ['Щавель', '→', 'Сок'], tags: ['раны', 'утопление'], mode: 'out' },
      { name: 'Лопух', treat: 'раны / утопление', pct: 'от ЦУ', recipe: 'разделить → корень → разжевать → наложить на шерсть', parts: ['Лопух', '→', 'Корень', '→', 'Разжёванный корень'], tags: ['раны', 'утопление'], mode: 'out' },
      { name: 'Клевер', treat: 'раны / утопление', pct: 'от ЦУ', recipe: 'разделить → листья → разжевать → наложить на шерсть', parts: ['Клевер', '→', 'Листья', '→', 'Разжёванные листья'], tags: ['раны', 'утопление'], mode: 'out' },
      { name: 'Подорожник', treat: 'раны / утопление', pct: 'от ЦУ', recipe: 'разделить → листья → разжевать → наложить на шерсть', parts: ['Подорожник', '→', 'Листья', '→', 'Разжёванные листья'], tags: ['раны', 'утопление'], mode: 'out' },
      { name: 'Незабудка', treat: 'раны / кровотечение', pct: 'от ЦУ', recipe: 'разделить → листья → разжевать → наложить на шерсть', parts: ['Незабудка', '→', 'Листья', '→', 'Разжёванные листья'], tags: ['раны', 'кровотечение'], mode: 'out' },
      { name: 'Крапива (раны / кровотечение)', treat: 'раны / кровотечение', pct: 'от ЦУ', recipe: 'Разделить → Листья → Разжевать → Наложить на шерсть', parts: ['Крапива', '→', 'Листья', '→', 'Разжёванные листья'], tags: ['раны', 'кровотечение'], mode: 'out' },
      { name: 'Паутина', treat: 'раны / утопление / кровотечение', pct: 'от ЦУ', recipe: 'наложить на шерсть (не делить)', parts: ['Паутина'], tags: ['раны', 'утопление', 'кровотечение'], mode: 'out' },
      { name: 'Тысячелистник', treat: 'только кровотечение', pct: '−1 ед. кровотечения', recipe: 'разделить → листья → разжевать → наложить на шерсть', parts: ['Тысячелистник', '→', 'Листья', '→', 'Разжёванные листья'], tags: ['кровотечение'], mode: 'out' },
      { name: 'Наполненный мышиной желчью мох', treat: 'грязь / блохи', pct: '~2.66%', recipe: 'обычный мох + мышь', parts: ['Мох', '+', '__MOUSE__', '→', 'Наполненный мышиной желчью мох'], tags: ['грязь'], mode: 'out', cycle: 'mouse' },
      { name: 'Костоправ', treat: 'переломы (падение)', pct: 'сам больной', recipe: 'вьюн: 2×ветка + вьюнок (или водоросль) · паутин: 1×ветка + паутина', parts: ['__KOST_FLOW__'], tags: ['переломы'], mode: 'craft', cycle: 'kost' },
    ];
    const FILTERS = [
      { id: 'all', label: 'Все' },
      { id: 'кашель', label: 'Кашель' },
      { id: 'отравление', label: 'Отравление' },
      { id: 'раны', label: 'Раны' },
      { id: 'утопление', label: 'Утопление' },
      { id: 'кровотечение', label: 'Кровотечение' },
      { id: 'грязь', label: 'Грязь' },
      { id: 'переломы', label: 'Переломы' },
    ];
    const filter = GM_getValue('cwh_seq_filter', 'all');
    const modeLabel = { in: '🥣 Внутрь', out: '🩹 На шерсть', both: '🥣 / 🩹', craft: '🔧 Крафт' };

    el.innerHTML = '<div class="cwh-section-title">Фильтр</div>'
      + '<div class="cwh-filter-row">' + FILTERS.map(f =>
        '<button type="button" class="cwh-filter-btn' + (filter===f.id?' on':'') + '" data-f="' + f.id + '">' + f.label + '</button>'
      ).join('') + '</div>'
      + '<div id="cwh-seq-list"></div>'
      + '<div class="cwh-section-title">Смесь от кашля — 70% (внутрь)</div>'
      + '<div class="cwh-card"><div class="cwh-card-body">'
      + '<div class="cwh-card-meta" style="margin-bottom:6px"><span class="cwh-pill">🥣 Внутрь</span> Смешать <b>без</b> разделения (5 мест во рту):</div>'
      + flow(['Пижма', '+', 'Мать-и-мачеха', '+', 'Бурачник', '+', 'Кошачья мята', '+', 'Кошачья мята'])
      + '<div class="cwh-card-meta" style="margin-top:8px">Съесть как дичь → <b>70% HP</b></div></div></div>'
      + '<div class="cwh-section-title">Общий порядок</div>'
      + '<div class="cwh-step"><b>1.</b> Взять траву во рот.</div>'
      + '<div class="cwh-step"><b>2.</b> Разделить (если нужно).</div>'
      + '<div class="cwh-step"><b>3.</b> Разжевать (если нужно).</div>'
      + '<div class="cwh-step"><b>4.</b> Съесть (внутрь) или «Наложить траву» / на шерсть.</div>'
      + '<div class="cwh-note">Неразделённую траву есть нельзя → −50% HP. Падаль/кости → −75%.</div>';

    function drawList() {
      const f = GM_getValue('cwh_seq_filter', 'all');
      const list = el.querySelector('#cwh-seq-list');
      let html = '';
      const cu = +GM_getValue('cwh_cu', 5);
      const cuPct = CU_PCT[cu] || '?';
      rows.filter(r => f === 'all' || (r.tags || []).indexOf(f) !== -1).forEach(r => {
        const ml = modeLabel[r.mode] || '';
        let pctShow = r.pct || '';
        if (/от\s*ЦУ/i.test(pctShow)) pctShow = cuPct + '% · ЦУ ' + cu;
        let pctClass = 'fix';
        if (/ЦУ/i.test(pctShow)) pctClass = 'cu';
        else if (/ресурс|сам/i.test(pctShow)) pctClass = 'res';
        html += '<div class="cwh-card">' + icon(r.name.replace(/\s*\([^)]*\)\s*$/, ''), 64)
          + '<div class="cwh-card-body">'
          + '<div class="cwh-card-title"><span class="cwh-card-name">' + r.name + '</span>'
          + '<span class="cwh-pct-badge ' + pctClass + '">' + pctShow + '</span></div>'
          + '<div class="cwh-card-meta"><span class="cwh-pill">' + ml + '</span> <b>Лечит:</b> ' + r.treat + '</div>'
          + '<div class="cwh-card-meta">' + r.recipe + '</div>'
          + flow(r.parts) + '</div></div>';
      });
      list.innerHTML = html || '<div class="cwh-note">Ничего в этом фильтре</div>';
      startIconCycles();
    }
    el.querySelectorAll('.cwh-filter-btn').forEach(btn => {
      btn.onclick = () => {
        GM_setValue('cwh_seq_filter', btn.dataset.f);
        el.querySelectorAll('.cwh-filter-btn').forEach(b => b.classList.toggle('on', b === btn));
        drawList();
      };
    });
    drawList();
  }

  function renderMemo(el) {
    const growth = [
      [0, '45%'], [1, '47%'], [2, '50%'], [3, '52%'], [4, '55%'],
      [5, '60%'], [6, '65%'], [7, '66%'], [8, '68%'], [9, '70%'],
      [10, '71%'], ['~35', '80%'], ['~65', '86%'], ['~95', '88%'],
      ['~125', '90%'], ['~200', '95%'], ['~250', '100%']
    ];
    const limits = [
      [0, 1], [6, 2], [12, 3], [50, 4], [200, 5]
    ];
    const degrees = [
      ['≥ 90%', 'ушибы (часто сами)'],
      ['80–75%', '1 степень'],
      ['74–50%', '2 степень'],
      ['49–25%', '3 степень'],
      ['24–1%', '4 степень']
    ];

    el.innerHTML = `
      <div class="cwh-memo-rules">
        <div class="cwh-section-title">Главные правила</div>
        <div class="cwh-card cwh-memo-rules-card">
          <ul class="cwh-memo-list">
            <li>Ориентир — <b>рост модели</b> (связан с лунами).</li>
            <li>Нужно залечить: <b>100 − текущее HP</b>.</li>
            <li>Костоправ <b>не лечит</b> переломы, полученные во время ношения.</li>
            <li>Среднее лечение переломов ≈ <b>½ луны</b> (2 дня). 5 ч → 5 дней.</li>
            <li>Кровотечение с высоты 2+ = <b>1%</b> фактора перелома.</li>
            <li>Не перенавешивай костоправы — есть <b>лимит хила</b>.</li>
          </ul>
        </div>

        <div class="cwh-section-title">Луны → рост</div>
        <div class="cwh-card cwh-memo-table-card">
          <div class="cwh-memo-table">
            ${growth.map(([m, p]) =>
              '<div class="cwh-memo-row"><span class="cwh-memo-k">' + m + ' лун</span>'
              + '<span class="cwh-memo-arrow">→</span>'
              + '<span class="cwh-memo-v">' + p + '</span></div>'
            ).join('')}
          </div>
        </div>

        <div class="cwh-section-title">Лимит костоправов</div>
        <div class="cwh-card cwh-memo-table-card">
          <div class="cwh-memo-table cwh-memo-table-limits">
            ${limits.map(([m, n]) =>
              '<div class="cwh-memo-row"><span class="cwh-memo-k">' + m + ' лун</span>'
              + '<span class="cwh-memo-arrow">→</span>'
              + '<span class="cwh-memo-v cwh-memo-lim">' + n + '</span></div>'
            ).join('')}
          </div>
        </div>

        <div class="cwh-section-title">Степени переломов по HP</div>
        <div class="cwh-card cwh-memo-table-card">
          <div class="cwh-memo-table">
            ${degrees.map(([hp, d]) =>
              '<div class="cwh-memo-row"><span class="cwh-memo-k cwh-memo-hp">' + hp + '</span>'
              + '<span class="cwh-memo-arrow">—</span>'
              + '<span class="cwh-memo-v">' + d + '</span></div>'
            ).join('')}
          </div>
        </div>

        <div class="cwh-card cwh-memo-note-card">
          <div class="cwh-memo-note">
            Паутинный костоправ <b>+15%</b> к вьюнковому.<br>
            Полные таблицы % по часам — в Google-памятке.
          </div>
        </div>
      </div>
    `;
  }



  function refreshNettleBox(root) {
    const box = (root && root.querySelector('#cwh-nettle-box')) || document.getElementById('cwh-nettle-box');
    if (!box) return;
    const a = nettleAdvice();
    const man = getNettleManual();
    const img = (typeof IMG !== 'undefined' && IMG['Крапива']) ? IMG['Крапива'] : '';
    const whereColor = a.where === 'wounds' ? '#e85d5d' : (a.where === 'poison' ? '#b07cff' : '#9fd66c');
    const srcLabel = a.source === 'manual' ? 'ручной ввод'
      : (a.source === 'duty' ? 'счётчик дежурства (было+сбор)' : 'скан клеток');
    const v = function(key, fallback) {
      if (man[key] != null && man[key] !== '') return man[key];
      return fallback;
    };
    box.innerHTML = ''
      + (img ? '<img src="' + img + '" style="width:36px;height:36px;object-fit:contain;border-radius:6px;float:left;margin:0 8px 4px 0;background:#000">' : '')
      + '<b style="color:#e8eaed">Крапива</b> — отрав. 10% (семена) · раны/ПУ %ЦУ (листья)<br>'
      + '<span style="color:#8e969e">Куда класть: в кучу, где <b>трав меньше</b></span><br>'
      + '<div style="margin-top:6px;padding:6px 8px;border-radius:8px;background:rgba(0,0,0,.25);border:1px solid ' + whereColor + '55">'
      + '<b style="color:' + whereColor + '">' + a.label + '</b>'
      + '<div style="font-size:10px;color:#8e969e;margin:4px 0 6px">источник: ' + srcLabel + '</div>'
      + '<div style="display:grid;grid-template-columns:1fr 52px 52px;gap:4px;align-items:center;font-size:11px">'
      + '<span></span><span style="text-align:center;color:#8e969e">всего</span><span style="text-align:center;color:#8e969e">крапива</span>'
      + '<span style="color:#b07cff">Отравление</span>'
      + '<input type="number" min="0" class="cwh-nettle-in" data-k="poisonPile" value="' + v('poisonPile', a.poisonPile) + '" style="width:48px;text-align:center;background:rgba(255,255,255,.06);border:1px solid rgba(176,124,255,.35);border-radius:5px;color:#e8eaed;font:600 12px/1.2 inherit;padding:2px 0">'
      + '<input type="number" min="0" class="cwh-nettle-in" data-k="inPoison" value="' + v('inPoison', a.inPoison) + '" style="width:48px;text-align:center;background:rgba(255,255,255,.06);border:1px solid rgba(176,124,255,.35);border-radius:5px;color:#e8eaed;font:600 12px/1.2 inherit;padding:2px 0">'
      + '<span style="color:#e85d5d">Раны</span>'
      + '<input type="number" min="0" class="cwh-nettle-in" data-k="woundsPile" value="' + v('woundsPile', a.woundsPile) + '" style="width:48px;text-align:center;background:rgba(255,255,255,.06);border:1px solid rgba(232,93,93,.35);border-radius:5px;color:#e8eaed;font:600 12px/1.2 inherit;padding:2px 0">'
      + '<input type="number" min="0" class="cwh-nettle-in" data-k="inWounds" value="' + v('inWounds', a.inWounds) + '" style="width:48px;text-align:center;background:rgba(255,255,255,.06);border:1px solid rgba(232,93,93,.35);border-radius:5px;color:#e8eaed;font:600 12px/1.2 inherit;padding:2px 0">'
      + '</div>'
      + '<div style="margin-top:6px;font-size:11px">Во рту: <b>' + a.inMouth + '</b>'
      + ' · скан клеток: отрав. ' + a.poisonScan + ' / раны ' + a.woundsScan + '</div>'
      + '<button type="button" class="cwh-link-btn" id="cwh-nettle-from-duty" style="margin-top:6px;width:100%;font-size:11px">📥 Подставить из счётчика (отрав./раны)</button>'
      + '<button type="button" class="cwh-link-btn" id="cwh-nettle-clear" style="margin-top:4px;width:100%;font-size:11px">Сбросить ручной ввод</button>'
      + '</div>'
      + '<div style="clear:both"></div>';

    box.querySelectorAll('.cwh-nettle-in').forEach(function(inp) {
      inp.addEventListener('change', function() {
        const m = getNettleManual();
        const k = inp.getAttribute('data-k');
        m[k] = Math.max(0, parseInt(inp.value, 10) || 0);
        setNettleManual(m);
        refreshNettleBox(root);
      });
      inp.addEventListener('click', function(e) { e.stopPropagation(); });
    });
    const fromDuty = box.querySelector('#cwh-nettle-from-duty');
    if (fromDuty) fromDuty.onclick = function() {
      const m = getNettleManual();
      try {
        const start = getDutyStartSnap();
        const picked = getDutyPicked();
        m.poisonPile = (start.poison || 0) + (picked.poison || 0);
        m.woundsPile = (start.wounds || 0) + (picked.wounds || 0);
      } catch (e) {}
      setNettleManual(m);
      refreshNettleBox(root);
      try { cwhBeep('ok'); } catch (e) {}
    };
    const clr = box.querySelector('#cwh-nettle-clear');
    if (clr) clr.onclick = function() {
      setNettleManual({});
      refreshNettleBox(root);
    };
  }

  function bindDutyCheck(root) {
    if (!root) return;
    const KEY = 'cwh_duty_checks';
    let state = {};
    try { state = JSON.parse(GM_getValue(KEY, '{}') || '{}') || {}; } catch (e) { state = {}; }
    const boxes = root.querySelectorAll('#cwh-duty-list input[type=checkbox][data-duty]');
    function updProg() {
      const total = boxes.length;
      let done = 0;
      boxes.forEach(cb => { if (cb.checked) done++; });
      const el = root.querySelector('#cwh-duty-prog');
      if (el) el.textContent = done + '/' + total;
      const wrap = root.querySelector('#cwh-duty-check');
      if (wrap) wrap.classList.toggle('cwh-duty-done', total > 0 && done === total);
    }
    boxes.forEach(cb => {
      const id = cb.dataset.duty;
      cb.checked = !!state[id];
      cb.onchange = () => {
        state[id] = cb.checked;
        GM_setValue(KEY, JSON.stringify(state));
        updProg();
      };
    });
    const reset = root.querySelector('#cwh-duty-reset');
    if (reset) {
      reset.onclick = () => {
        state = {};
        GM_setValue(KEY, '{}');
        boxes.forEach(cb => { cb.checked = false; });
        updProg();
      };
    }
    // restore open state
    const det = root.querySelector('#cwh-duty-check');
    if (det) {
      det.open = !!GM_getValue('cwh_duty_open', true);
      det.addEventListener('toggle', () => {
        GM_setValue('cwh_duty_open', det.open);
      });
    }
    updProg();
  }

  /* ========================================================================
     ПОДСКАЗКИ ПРИ НАВЕДЕНИИ
     ======================================================================== */

  let tipEl = null;
  function ensureTip() {
    if (tipEl) return tipEl;
    tipEl = document.createElement('div');
    tipEl.id = 'cwh-tip';
    tipEl.style.zIndex = '1000001';
    tipEl.style.cssText = `
      position:fixed;z-index:1000001;max-width:280px;
      background:#1b1c1f;color:#d7dade;border:1px solid rgba(127,174,92,.4);
      border-radius:10px;padding:8px 10px;font:11px/1.4 "Segoe UI",sans-serif;
      box-shadow:0 4px 16px rgba(0,0,0,.5);pointer-events:none;display:none;
    `;
    document.body.appendChild(tipEl);
    return tipEl;
  }

  function findInfo(text) {
    if (!text) return null;
    const t = text.toLowerCase().replace(/\s+/g, ' ').trim();
    if (t.length < 3) return null;
    const sorted = [...HERBS].sort((a, b) => b.name.length - a.name.length);
    for (const h of sorted) {
      const n = h.name.toLowerCase();
      if (t === n || t.indexOf(n) !== -1) {
        // отсекаем слишком общие совпадения в длинном мусоре
        if (t.length > n.length + 40) continue;
        const cu = +GM_getValue('cwh_cu', 5);
        const pct = h.fixedPct != null ? h.fixedPct + '%' : (CU_PCT[cu] + '% ЦУ');
        const src = IMG[h.name] || '';
        return (src ? `<img src="${src}" style="width:36px;height:36px;object-fit:contain;border-radius:6px;vertical-align:middle;margin-right:6px;background:#000;">` : '') +
          `<b>${h.name}</b><br>${h.note || ''}<br>≈ ${pct}<br>${(h.treats || []).join(', ')}`;
      }
    }
    for (const d of DISEASES) {
      const n = d.name.toLowerCase();
      if (t.indexOf(n) !== -1 && t.length < 80) {
        return `<b>${d.name}</b><br>${d.treatments.slice(0, 3).join(', ')}`;
      }
    }
    return null;
  }

  function onMove(e) {
    let wrap = document.getElementById('cwh-zoom-wrap');
    const tip = document.getElementById('cwh-tip');
    const tipEl = ensureTip();

    // Исключение: трава во рту — подсказка «что / от чего»
    const mouth = null; // подсказки во рту отключены
    if (mouth) {
      if (!wrap) {
        wrap = document.createElement('div');
        wrap.id = 'cwh-zoom-wrap';
        wrap.innerHTML = '<img alt=""><div class="cwh-zoom-txt"></div>';
        document.body.appendChild(wrap);
      }
      const img = mouth.querySelector('img');
      let tid = null;
      if (img && img.src) {
        const mm = img.src.match(/things\/(\d+)\./i);
        if (mm) tid = mm[1];
      }
      const h = tid ? HERBS.find(x => String(x.id) === String(tid)) : null;
      let title = h ? h.name : (img && (img.alt || img.title)) || 'Предмет';
      let body = '';
      if (h) {
        const treats = (h.treats && h.treats.length) ? h.treats.join(', ') : 'ресурс (не лечит сам по себе)';
        const cu = +GM_getValue('cwh_cu', 5);
        const cuPct = (typeof CU_PCT !== 'undefined' ? CU_PCT[cu] : null) || getCuPct();
        let pct;
        if (h.name === 'Крапива') {
          pct = 'отрав. 10% (семена) · раны/ПУ ' + cuPct + '% ЦУ (листья)';
          treats = 'отравление, раны, переломы, кровоток';
          try {
            const a = nettleAdvice();
            treats += '<br><span style="color:#9fd66c">' + a.label + '</span>'
              + '<br><span style="color:#8e969e">в кучах: отрав. ' + a.poisonPile
              + ' · раны ' + a.woundsPile + ' · крапива: отрав.' + a.inPoison
              + ' / раны ' + a.inWounds + ' · рот ' + a.inMouth + '</span>';
          } catch (e) {}
        } else if (h.fixedPct != null) pct = '≈ ' + h.fixedPct + '%';
        else if (h.treats && h.treats.length) pct = '≈ ' + cuPct + '% (ЦУ ' + cu + ')';
        else pct = 'ресурс';
        body = '<b>' + h.name + '</b><br>Лечит: ' + treats
          + '<br>' + pct
          + (h.prep ? '<br><span style="color:#8e969e">' + h.prep + '</span>' : '');
      } else {
        // легенда по type id
        let leg = null;
        if (tid && typeof FIELD_LEGEND !== 'undefined') {
          for (const L of FIELD_LEGEND) {
            if ((L.types || []).indexOf(String(tid)) !== -1) { leg = L; break; }
          }
        }
        body = leg
          ? ('<b>' + (title || leg.name) + '</b><br>Категория: ' + leg.name)
          : ('<b>' + title + '</b>');
      }
      if (img && img.src) {
        wrap.querySelector('img').src = img.src;
        wrap.querySelector('img').style.display = 'block';
      } else {
        wrap.querySelector('img').style.display = 'none';
      }
      wrap.querySelector('.cwh-zoom-txt').innerHTML = body;
      wrap.style.zIndex = '1000001'; wrap.style.display = 'flex';
      wrap.style.left = Math.min(e.clientX + 14, window.innerWidth - 200) + 'px';
      wrap.style.top = Math.min(e.clientY + 14, window.innerHeight - 140) + 'px';
      tipEl.style.display = 'none';
      return;
    }

    // Остальные подсказки — ТОЛЬКО внутри виджета
    const inWidget = e.target.closest && e.target.closest('#cwh-widget');
    if (!inWidget) {
      if (wrap) wrap.style.display = 'none';
      if (tip) tip.style.display = 'none';
      return;
    }

    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'cwh-zoom-wrap';
      wrap.innerHTML = '<img alt=""><div class="cwh-zoom-txt"></div>';
      document.body.appendChild(wrap);
    }

    // 0) памятка — имя ресурса с картинкой
    const memoItem = e.target.closest && e.target.closest('.cwh-memo-item');
    if (memoItem) {
      const nm = memoItem.dataset.name || memoItem.textContent || '';
      let src = memoItem.dataset.img || IMG[nm] || '';
      if (!src && nm === 'Целебная водоросль' && typeof ALGAE !== 'undefined') src = ALGAE[0].src;
      if (src) {
        wrap.querySelector('img').src = src;
        wrap.querySelector('img').style.display = 'block';
      } else {
        wrap.querySelector('img').style.display = 'none';
      }
      let txt = '<b>' + nm + '</b>';
      const info = findInfo(nm);
      if (info) txt = info.replace(/<img[^>]*>/gi, '').trim();
      wrap.querySelector('.cwh-zoom-txt').innerHTML = txt;
      wrap.style.zIndex = '1000001'; wrap.style.display = 'flex';
      wrap.style.left = Math.min(e.clientX + 14, window.innerWidth - 170) + 'px';
      wrap.style.top = Math.min(e.clientY + 14, window.innerHeight - 160) + 'px';
      tipEl.style.display = 'none';
      return;
    }

    // 1) иконка травы — превью + подпись
    if (e.target.classList && e.target.classList.contains('cwh-icon')) {
      const nm = e.target.alt || '';
      const src = e.target.dataset.full || e.target.src;
      wrap.querySelector('img').src = src;
      wrap.querySelector('img').style.display = 'block';
      let txt = nm ? ('<b>' + nm + '</b>') : '';
      const info = nm ? findInfo(nm) : null;
      if (info) txt = info.replace(/<img[^>]*>/gi, '').trim();
      wrap.querySelector('.cwh-zoom-txt').innerHTML = txt;
      wrap.style.zIndex = '1000001'; wrap.style.display = 'flex';
      wrap.style.left = Math.min(e.clientX + 14, window.innerWidth - 170) + 'px';
      wrap.style.top = Math.min(e.clientY + 14, window.innerHeight - 160) + 'px';
      tipEl.style.display = 'none';
      return;
    }

    // 2) карточка болезни — галерея трав с подписями
    const dcard = e.target.closest && e.target.closest('.cwh-disease-card');
    if (dcard) {
      const id = dcard.dataset.id;
      const d = DISEASES.find(x => x.id === id);
      if (d) {
        let html = '<div style="font-weight:600;margin-bottom:6px;color:#9fd66c">' + d.name + '</div>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:220px">';
        (d.treatments || []).forEach(t => {
          let label = t;
          let src = IMG[t] || '';
          let h = HERBS.find(x => x.name === t);
          if (!h) {
            const matches = HERBS.filter(x => t.toLowerCase().indexOf(x.name.toLowerCase()) !== -1)
              .sort((a, b) => b.name.length - a.name.length);
            h = matches[0];
          }
          if (h) {
            label = h.name;
            src = IMG[h.name] || src;
          }
          if (!src) return;
          html += '<div style="text-align:center;width:72px">'
            + '<img src="' + src + '" style="width:52px;height:52px;object-fit:contain;border-radius:6px;background:#000">'
            + '<div style="font-size:9px;color:#a6adb5;margin-top:2px;line-height:1.2">' + label + '</div></div>';
        });
        html += '</div>';
        html += '<div style="margin-top:6px;font-size:10px;color:#8e969e;max-width:220px">' + (d.notes || '') + '</div>';
        tipEl.innerHTML = html;
        tipEl.style.display = 'block';
        tipEl.style.left = Math.min(e.clientX + 12, window.innerWidth - 250) + 'px';
        tipEl.style.top = Math.min(e.clientY + 12, window.innerHeight - 200) + 'px';
        wrap.style.display = 'none';
        return;
      }
    }

    wrap.style.display = 'none';
    tipEl.style.display = 'none';
  }

  /* ========================================================================
     СТАРТ
     ======================================================================== */

  let _cycleTimer = null;
  function startIconCycles() {
    if (_cycleTimer) clearInterval(_cycleTimer);
    let mi = 0;

    function imgTag(o) {
      return '<img class="cwh-icon" src="' + o.src + '" alt="' + o.name + '" data-full="' + o.src
        + '" title="' + o.name + '" style="width:40px;height:40px;object-fit:contain;border-radius:6px;background:rgba(0,0,0,.35)">';
    }
    function renderKostFlow(recipeIdx, altVine) {
      const wrap = document.getElementById('cwh-kost-flow');
      if (!wrap || !KOST_CYCLE.recipes) return;
      const r = KOST_CYCLE.recipes[recipeIdx % KOST_CYCLE.recipes.length];
      let html = '';
      if (r.name === 'вьюнковый') {
        const third = altVine ? r.altComp : r.comps[2];
        html += imgTag(r.comps[0]) + '<span class="cwh-arrow">+</span>'
          + imgTag(r.comps[1]) + '<span class="cwh-arrow">+</span>' + imgTag(third);
      } else {
        html += imgTag(r.comps[0]) + '<span class="cwh-arrow">+</span>' + imgTag(r.comps[1]);
      }
      html += '<span class="cwh-arrow">→</span>' + imgTag(r.result);
      html += '<span style="font-size:10px;color:#8e969e;margin-left:6px">' + r.name + '</span>';
      wrap.innerHTML = html;
    }

    // timeline: spider 3s | vine+вьюнок 5s | vine+водоросль 5s | repeat
    // phases: 0=spider, 1=vine1, 2=vine2
    renderKostFlow(1, false); // start spider is recipes[1]; use phase machine
    // recipes[0]=vine, [1]=spider — show spider first briefly then long vine
    let phase = 0; // 0 spider, 1 vine+вьюнок, 2 vine+водоросль
    renderKostFlow(1, false); // spider

    let ai = 0;
    _cycleTimer = setInterval(function() {
      // mice
      mi = (mi + 1) % MICE.length;
      document.querySelectorAll('.cwh-cycle-mouse').forEach(function(img) {
        img.src = MICE[mi].src; img.dataset.full = MICE[mi].src;
        img.alt = MICE[mi].name; img.title = MICE[mi].name;
      });
      // целебная водоросль — ТОЛЬКО элементы с классом cwh-cycle-algae
      if (typeof ALGAE !== 'undefined' && ALGAE.length) {
        ai = (ai + 1) % ALGAE.length;
        document.querySelectorAll('img.cwh-cycle-algae').forEach(function(img) {
          img.src = ALGAE[ai].src;
          img.dataset.full = ALGAE[ai].src;
          img.alt = ALGAE[ai].name;
          img.title = ALGAE[ai].name;
        });
      }
    }, 2800);

    // separate timer with variable delays for kost
    if (window._kostTimer) clearTimeout(window._kostTimer);
    function nextKost() {
      phase = (phase + 1) % 3;
      let delay;
      if (phase === 0) {
        renderKostFlow(1, false); // spider — короче
        delay = 2500;
      } else if (phase === 1) {
        renderKostFlow(0, false); // vine + вьюнок — дольше
        delay = 8000;
      } else {
        renderKostFlow(0, true); // vine + водоросль — дольше
        delay = 8000;
      }
      // sync calc strip
      const r = KOST_CYCLE.recipes[phase === 0 ? 1 : 0];
      document.querySelectorAll('.cwh-cycle-kost-comp').forEach(function(img) {
        const c = r.comps[r.comps.length - 1];
        img.src = c.src; img.dataset.full = c.src; img.alt = c.name; img.title = c.name;
      });
      document.querySelectorAll('.cwh-cycle-kost-res').forEach(function(img) {
        img.src = r.result.src; img.dataset.full = r.result.src;
        img.alt = r.result.name; img.title = r.result.name;
      });
      window._kostTimer = setTimeout(nextKost, delay);
    }
    window._kostTimer = setTimeout(nextKost, 3000);
  }










  /* ---- Цветная легенда подсобки: клетки по координатам (как перенос в UwU) ---- */
  // Цвета категорий
  const LEGEND_COLORS = {
      branches: { name: 'Крепкая ветка',        color: '#7ecf6a', short: 'Ветки' },
      moss:     { name: 'Мох',                  color: '#8b9a5b', short: 'Мох' },
      mice:     { name: 'Мыши',                 color: '#c4a574', short: 'Мыши' },
      bile:     { name: 'Мох с желчью',         color: '#e8d44a', short: 'Желчь' },
      cough:    { name: 'Кашель',               color: '#6ec8e0', short: 'Кашель' },
      poison:   { name: 'Отравление',           color: '#b07cff', short: 'Отравл.' },
      wounds:   { name: 'Раны и кровоток',      color: '#e85d5d', short: 'Раны+кр' },
      vine:     { name: 'Вьюнки',               color: '#3dba7a', short: 'Вьюнки' },
      kost:     { name: 'Костоправы',           color: '#e8d5a3', short: 'Костопр' },
      web:      { name: 'Паутина',              color: '#d0d4d8', short: 'Паутина' },
      stones:   { name: 'Камни',                color: '#9aa0a6', short: 'Камни' },
      algae:    { name: 'Водоросли',            color: '#5ad4c8', short: 'Водорос' },
    };

  // Подсобка: ряд/колонка 1-based (#cages tr/td nth-of-type)
  // Сопоставлено со схемой куч (низ = ряд 6, слева направо по подписям)
  const PODSOBKA_CELLS = [
      // веточки слева (НЕ цветочный бар r4c1)
      { r: 3, c: 1, key: 'branches' },
      // мох / мыши
      { r: 5, c: 1, key: 'moss' },
      { r: 5, c: 2, key: 'mice' },
      // нижний ряд: без «Щель в полу» (c4) и без выходов «Подсобка» (c9–c10)
      { r: 6, c: 1, key: 'bile' },
      { r: 6, c: 2, key: 'cough' },
      { r: 6, c: 3, key: 'poison' },
      // c4 — щель, пропускаем
      { r: 6, c: 5, key: 'wounds' },
      { r: 6, c: 6, key: 'vine' },
      { r: 6, c: 7, key: 'branches' }, // крепкие ветки (бывш. «палки»)
      { r: 6, c: 8, key: 'kost' },
      // паутина чуть выше справа (не клетка выхода)
      { r: 5, c: 9, key: 'web' },
      // камни справа (одна клетка, без наложки на персонажа)
      { r: 4, c: 10, key: 'stones' },
    ];

  // запасной вариант по things/N.png (другие локации / если куча открыта)
  const FIELD_LEGEND = [
      { id: 'branches', name: 'Крепкая ветка',     color: '#7ecf6a', types: ['565'] },
      { id: 'moss',     name: 'Мох',                color: '#8b9a5b', types: ['75','76','77'] },
      { id: 'bile',     name: 'Мох с желчью',       color: '#e8d44a', types: ['78'] },
      { id: 'cough',    name: 'Кашель',             color: '#6ec8e0', types: ['13','23','26','110','115','24'] },
      { id: 'poison',   name: 'Отравление',         color: '#b07cff', types: ['17','109','112','116'] },
      { id: 'wounds',   name: 'Раны / кровоток',    color: '#e85d5d', types: ['15','16','19','25','104','106','108','111','119'] },
      { id: 'vine',     name: 'Вьюнки',             color: '#3dba7a', types: ['566'] },
      { id: 'algae',    name: 'Водоросли',          color: '#5ad4c8', types: ['3993','21'] },
      { id: 'kost',     name: 'Костоправы',         color: '#e8d5a3', types: ['562'] },
      { id: 'web',      name: 'Паутина',            color: '#d0d4d8', types: ['20'] },
    ];

  function hexToRGBA(hex, alpha) {
    const h = String(hex || '').replace('#', '');
    if (h.length < 6) return 'rgba(127,174,92,' + alpha + ')';
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  function legendChipsHtml() {
    return Object.keys(LEGEND_COLORS).map(k => {
      const L = LEGEND_COLORS[k];
      return '<span class="cwh-leg-chip" style="--c:' + L.color + '">'
        + '<i style="background:' + L.color + '"></i>' + L.name + '</span>';
    }).join('');
  }

  function buildFieldLegendCSS() {
    let css = '';
    // 1) фиксированные клетки подсобки — заливка td.cage через ::before (как UwU-перенос)
    css += '#cages > tbody > tr > td.cage { position: relative; }\n';
    css += '#cages > tbody > tr > td.cage::before {'
      + 'content:""; position:absolute; inset:0; pointer-events:none; z-index:0;'
      + 'border-radius:2px;}\n';
    css += '#cages > tbody > tr > td.cage .cage_items { position:relative; z-index:1; }\n';
    // подписи легенды ниже игровых карточек персонажа
    css += '#cages > tbody > tr > td.cage::after { z-index:1 !important; }\n';


    PODSOBKA_CELLS.forEach(cell => {
      const L = LEGEND_COLORS[cell.key];
      if (!L) return;
      const bg = hexToRGBA(L.color, 0.5);
      const edge = hexToRGBA(L.color, 0.95);
      const short = L.short || L.name.split(' ')[0].slice(0, 8);
      css += '#cages > tbody > tr:nth-of-type(' + cell.r + ') > td:nth-of-type(' + cell.c + ')::before {'
        + 'background-color:' + bg + ' !important;'
        + 'box-shadow:inset 0 0 0 2px ' + edge + ';'
        + '}\n';
      css += '#cages > tbody > tr:nth-of-type(' + cell.r + ') > td:nth-of-type(' + cell.c + ')::after {'
        + 'content:"' + short + '";'
        + 'position:absolute; left:50%; bottom:3px; transform:translateX(-50%);'
        + 'z-index:3; pointer-events:none;'
        + 'font:700 9px/1 "Segoe UI",sans-serif; color:#fff;'
        + 'text-shadow:0 0 3px #000,0 1px 2px #000;'
        + 'white-space:nowrap;'
        + '}\n';
    });

    // things/N.png на других локациях НЕ красим — только фиксированные клетки Подсобки
    return css;
  }

  /** preference: want legend when in Подсобка (default on) */
  function legendWanted() {
    return GM_getValue('cwh_legend_auto', true) !== false;
  }


  const NO_GO_LOCATIONS = [
    { re: /скользк\S*\s*туннел/i, name: 'Скользкий туннель', warn: 'НЕ ХОДИТЬ' },
  ];

  function clearNoGoNode(node) {
    if (!node) return;
    node.classList.remove('cwh-no-go');
    node.querySelectorAll('.cwh-no-go-label, .cwh-no-go-name').forEach(function(n) { n.remove(); });
    node.querySelectorAll('.move_name').forEach(function(mn) {
      try { mn.style.opacity = ''; } catch (e) {}
    });
  }

  function markNoGoLocations() {
    // Подсобка: соседний «Скользкий туннель» — не опасный КБО-переход, не красим
    const inPodsobka = (typeof isPodsobkaLocation === 'function') && isPodsobkaLocation();
    const activeParents = new Set();

    if (!inPodsobka) {
      // только игровые подписи переходов — не наши метки
      document.querySelectorAll('.move_name, span.move_name').forEach(function(el) {
        // пропуск наших инъекций
        if (el.closest && el.closest('#cwh-widget')) return;
        if (el.classList && (el.classList.contains('cwh-no-go-label') || el.classList.contains('cwh-no-go-name'))) return;
        const t = (el.textContent || el.innerText || '').replace(/\s+/g, ' ').trim();
        if (!t) return;
        let hit = null;
        for (let i = 0; i < NO_GO_LOCATIONS.length; i++) {
          if (NO_GO_LOCATIONS[i].re.test(t)) { hit = NO_GO_LOCATIONS[i]; break; }
        }
        if (!hit) return;

        const parent = el.closest('.move_parent') || el.parentElement;
        if (!parent) return;
        parent.classList.add('cwh-no-go');
        activeParents.add(parent);

        const td = el.closest('#cages td.cage, #cages td, td.cage');
        if (td) {
          td.classList.add('cwh-no-go');
          activeParents.add(td);
        }

        const host = parent.classList.contains('move_parent') ? parent : (td || parent);
        if (host && getComputedStyle(host).position === 'static') {
          try { host.style.position = 'relative'; } catch (e) {}
        }
        let lab = host.querySelector(':scope > .cwh-no-go-label');
        if (!lab) {
          lab = document.createElement('div');
          lab.className = 'cwh-no-go-label';
          lab.setAttribute('data-cwh', '1');
          host.appendChild(lab);
        }
        if (lab.textContent !== hit.warn) lab.textContent = hit.warn;
        el.style.opacity = '0';

        if (td && td !== host) {
          if (getComputedStyle(td).position === 'static') {
            try { td.style.position = 'relative'; } catch (e2) {}
          }
          let nameLab = td.querySelector(':scope > .cwh-no-go-name');
          if (!nameLab) {
            nameLab = document.createElement('div');
            nameLab.className = 'cwh-no-go-name';
            nameLab.setAttribute('data-cwh', '1');
            td.appendChild(nameLab);
          }
          if (nameLab.textContent !== t) nameLab.textContent = t;
        }
      });
    }

    // Снять ВСЁ, что не в activeParents.
    // Важно: НЕ смотреть node.textContent — там наши же «Скользкий/НЕ ХОДИТЬ»
    // и из‑за этого метка залипала до F5.
    document.querySelectorAll('.cwh-no-go').forEach(function(node) {
      if (!inPodsobka && activeParents.has(node)) return;
      clearNoGoNode(node);
    });
    // сироты-метки без родителя с классом
    document.querySelectorAll('.cwh-no-go-label, .cwh-no-go-name').forEach(function(n) {
      const p = n.parentElement;
      if (!p || !p.classList.contains('cwh-no-go')) n.remove();
    });

    window._cwhNoGoActive = document.querySelectorAll('.cwh-no-go').length > 0;
  }

  function showNoGoToast(text) {
    let t = document.getElementById('cwh-no-go-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'cwh-no-go-toast';
      t.className = 'cwh-no-go-toast';
      document.body.appendChild(t);
    }
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(window._cwhNoGoToastT);
    window._cwhNoGoToastT = setTimeout(function() {
      t.classList.remove('show');
    }, 1600);
  }

  /** блокируем клики (реальные и программные .click()) по запрещённым переходам */
  function initNoGoClickBlock() {
    if (window._cwhNoGoClickBound) return;
    window._cwhNoGoClickBound = true;
    document.addEventListener('click', function(e) {
      const el = e.target && e.target.closest && e.target.closest('.cwh-no-go, .move_parent.cwh-no-go, td.cage.cwh-no-go');
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      cwhBeep('warn');
      showNoGoToast('⛔ Переход запрещён: Скользкий туннель');
    }, true); // capture-фаза — раньше обработчика самой игры
  }

  /** блокируем перемещение по клеточкам клавишами WASD / стрелками,
   *  если рядом (на экране) есть запрещённый переход — направление неизвестно,
   *  поэтому на время блокируются все клавиши движения */
  function initNoGoKeyBlock() {
    if (window._cwhNoGoKeyBound) return;
    window._cwhNoGoKeyBound = true;
    const MOVE_KEYS = new Set(['w','a','s','d','ц','ф','ы','в','arrowup','arrowdown','arrowleft','arrowright']);
    document.addEventListener('keydown', function(e) {
      if (!window._cwhNoGoActive) return;
      const tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) return; // не мешаем набору текста
      const k = (e.key || '').toLowerCase();
      if (!MOVE_KEYS.has(k)) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      cwhBeep('warn');
      showNoGoToast('⛔ Движение WASD заблокировано рядом со Скользким туннелем');
    }, true); // capture-фаза
  }

  initNoGoClickBlock();
  initNoGoKeyBlock();

  function applyFieldLegend() {
      const want = legendWanted();
      const here = isPodsobkaLocation();
      // СТРОГО только локация «Подсобка»
      const on = !!(want && here);
      let styleEl = document.getElementById('cwh-resourcesStyle');
      if (on) {
        // ВАЖНО: пересоздаём всегда, если элемента нет,
        // и обновляем содержимое, если оно изменилось
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'cwh-resourcesStyle';
          document.head.appendChild(styleEl);
        }
        const css = buildFieldLegendCSS();
        if (styleEl.textContent !== css) styleEl.textContent = css;
      } else if (styleEl) {
        styleEl.textContent = '';
        styleEl.remove();
      }
      const btn = document.getElementById('cwh-legend-toggle');
      if (btn) {
        btn.classList.toggle('on', on);
        if (!want) {
          btn.textContent = '○ Легенда ВЫКЛ';
        } else if (here) {
          btn.textContent = '● Легенда · Подсобка';
        } else {
          btn.textContent = '○ Легенда · только в Подсобке';
        }
      }
      try { markNoGoLocations(); } catch (e) {}
    }

  if (!window._cwhNoGoTimer) {
    window._cwhNoGoTimer = setInterval(function() {
      try { markNoGoLocations(); } catch (e) {}
    }, 800);
  }
  // отдельный observer на переходы
  if (!window._cwhNoGoObs) {
    try {
      window._cwhNoGoObs = new MutationObserver(function() {
        clearTimeout(window._cwhNoGoDeb);
        window._cwhNoGoDeb = setTimeout(function() {
          try { markNoGoLocations(); } catch (e) {}
        }, 100);
      });
      const root = document.getElementById('cages') || document.getElementById('cages_div') || document.body;
      window._cwhNoGoObs.observe(root, { childList: true, subtree: true, characterData: true });
    } catch (e) {}
  }

  function setFieldLegend(want) {
    GM_setValue('cwh_legend_auto', !!want);
    GM_setValue('cwh_field_legend', false); // больше не форсим глобально
    applyFieldLegend();
  }

  function startFieldLegend() {
      applyFieldLegend();
      if (!window._cwhLegTick) {
        window._cwhLegTick = setInterval(function() {
          applyFieldLegend();
        }, 800);
      }
      // смена фона локации / переход на подсобку
      if (!window._cwhLegObs) {
        const boot = function() {
          const div = document.getElementById('cages_div');
          if (!div) { setTimeout(boot, 800); return; }
          const obs = new MutationObserver(function() {
            applyFieldLegend();
            try { markNoGoLocations(); } catch (e) {}
          });
          obs.observe(div, { attributes: true, attributeFilter: ['style', 'class'] });
          window._cwhLegObs = obs;
        };
        boot();
      }
    }

  /* ---- Срок порчи во рту (тихий опрос, без дёрганья UI) ---- */
  const spoilCache = Object.create(null);
  let _spoilBusy = false;
  let _probeRunning = false;
  let _lastMouthSig = '';
  let _userActionUntil = 0; // не трогаем рот после действий пользователя

  const PERISHABLE_THING_IDS = new Set([
    '13','23','26','110','115','24',
    '17','109','112','116','21',
    '15','16','19','25','104','106','108','111','119',
    '18','22','61','105','113','107','114','117','118',
    '75','76','77','95',
    '566','3993',
    '121','122','123','124','125','126','128','129','130','131','132',
  ]);

  function formatRemain(totalMin) {
    if (totalMin == null || totalMin < 0) totalMin = 0;
    const h = Math.floor(totalMin / 60);
    const m = Math.floor(totalMin % 60);
    if (h <= 0) return m + ' мин';
    if (m === 0) return h + ' ч';
    return h + ' ч ' + m + ' мин';
  }

  function parseSpoilText(raw) {
    if (!raw) return null;
    // «через 17 ч.» / «через 16 ч 30 мин» / «через 30 мин»
    let m = raw.match(/через\s+(\d+)\s*ч(?:\.|аса?|ов)?(?:\s+(\d+)\s*мин)?/i);
    if (m) {
      const hours = +m[1];
      const mins = m[2] != null ? +m[2] : 0;
      const totalMin = hours * 60 + mins;
      return { hours, mins, totalMin, text: formatRemain(totalMin), soft: false, fetchedAt: Date.now() };
    }
    m = raw.match(/через\s+(\d+)\s*мин/i);
    if (m) {
      const totalMin = +m[1];
      return { hours: 0, mins: totalMin, totalMin, text: formatRemain(totalMin), soft: false, fetchedAt: Date.now() };
    }
    m = raw.match(/через\s+(\d+)\s*д(?:ень|ня|ней)?(?:\s+(\d+)\s*ч)?(?:\s+(\d+)\s*мин)?/i);
    if (m) {
      const totalMin = (+m[1]) * 24 * 60 + (+m[2] || 0) * 60 + (+m[3] || 0);
      return { hours: totalMin / 60, mins: totalMin % 60, totalMin, text: formatRemain(totalMin), soft: false, fetchedAt: Date.now() };
    }
    return null;
  }

  function liveSpoilInfo(info) {
    if (!info || info.soft || info.totalMin == null) return info;
    const elapsed = Math.floor((Date.now() - (info.fetchedAt || Date.now())) / 60000);
    const left = Math.max(0, info.totalMin - elapsed);
    return Object.assign({}, info, {
      hours: left / 60,
      text: formatRemain(left),
      totalMinLeft: left
    });
  }

  function extractSpoilFromHtml(html) {
    if (!html || typeof html !== 'string') return null;
    const m = html.match(/Превратится в (?:пад[ае]ль|гниль)[^<\n]{0,60}/i)
      || html.match(/через\s+\d+\s*ч[^<\n]{0,20}/i);
    if (!m) return null;
    return parseSpoilText(m[0]);
  }

  function thingIdFromEl(el) {
    if (!el) return null;
    const img = el.querySelector('img');
    if (img && img.src) {
      const m = img.src.match(/things\/(\d+)\./i);
      if (m) return m[1];
    }
    // style background things/N.png
    const st = (el.getAttribute && el.getAttribute('style')) || (el.style && el.style.cssText) || '';
    let m = String(st).match(/things\/(\d+)\./i);
    if (m) return m[1];
    // «[17763]» / type в title/alt/text
    const raw = [
      el.id || '',
      el.title || '',
      el.getAttribute && el.getAttribute('title') || '',
      img && (img.alt || img.title || '') || '',
      el.textContent || ''
    ].join(' ');
    m = raw.match(/\[(\d{2,})\]/);
    if (m) return m[1];
    m = raw.match(/things\/(\d+)/i);
    if (m) return m[1];
    return null;
  }

  function isPerishableEl(el) {
    const tid = thingIdFromEl(el);
    return tid && PERISHABLE_THING_IDS.has(tid);
  }

  function herbInfoFromEl(el) {
    const tid = thingIdFromEl(el);
    if (!tid) return null;
    const ts = String(tid);
    // мышь type 17763 — НЕ гниль
    if (ts === '17763' || (RES_GROUPS.mice && RES_GROUPS.mice.ids.indexOf(ts) !== -1)) {
      return { name: 'Мышь', treats: 'охота / желчь', isRes: true, pct: '' };
    }
    // гниль type 180
    if (ts === '180' || (RES_GROUPS.rot && RES_GROUPS.rot.ids.indexOf(ts) !== -1)) {
      return { name: 'Гниль', treats: 'смешать / убрать', isRes: true, pct: '' };
    }
    if (ts === '565') {
      return { name: 'Крепкая ветка', treats: 'костоправ', isRes: true, pct: '' };
    }
    if (ts === '3993') {
      return { name: 'Плотная водоросль', treats: 'костоправ / ресурс', isRes: true, pct: '' };
    }
    if (ts === '21') {
      return { name: 'Целебная водоросль', treats: 'отравление', isRes: false, pct: '10%' };
    }
    if (ts === '417' || ts === '418') {
      return { name: 'Камень', treats: 'слой / не ресурс', isRes: true, pct: '' };
    }
    const h = HERBS.find(x => String(x.id) === String(tid));
    if (h) {
      let treats = (h.treats && h.treats.length)
        ? h.treats.join(', ')
        : 'ресурс';
      const cu = +GM_getValue('cwh_cu', 5);
      const cuPct = CU_PCT[cu] || getCuPct();
      let pct = '';
      if (h.name === 'Крапива') {
        // и отравление, и раны / ПУ / кровоток — не только «от ран»
        treats = 'отравление · раны · ПУ · кровоток';
        pct = 'отрав.10% / раны ' + cuPct + '%ЦУ';
        try {
          const a = nettleAdvice();
          treats = treats + ' · ' + a.label;
        } catch (e) {}
      } else if (h.fixedPct != null) pct = h.fixedPct + '%';
      else if (h.treats && h.treats.length) pct = cuPct + '%ЦУ';
      return { name: h.name, treats: treats, isRes: !(h.treats && h.treats.length), herb: h, pct: pct };
    }
    // легенда по type
    if (typeof FIELD_LEGEND !== 'undefined') {
      for (const L of FIELD_LEGEND) {
        if ((L.types || []).indexOf(String(tid)) !== -1) {
          return { name: L.name, treats: L.name, isRes: true };
        }
      }
    }
    return null;
  }

  function renderSpoilLabels() {
    if (_spoilBusy) return;
    const list = document.getElementById('itemList');
    if (!list) return;
    _spoilBusy = true;
    try {
      const alive = new Set();
      list.querySelectorAll('.itemInMouth').forEach(el => {
        if (!el.id) return;
        alive.add(el.id);

        // подсказки «что / от чего» во рту отключены по запросу
        const oldInfo = el.querySelector(':scope > .cwh-info-label');
        if (oldInfo) oldInfo.remove();

        // --- срок порчи (оставляем) ---
        let lab = el.querySelector(':scope > .cwh-spoil-label');
        let info = spoilCache[el.id];
        if (!info && isPerishableEl(el)) {
          info = { hours: 999, text: '…', soft: true };
        }
        if (!info) {
          if (lab) lab.remove();
          return;
        }
        if (!info.soft) info = liveSpoilInfo(info);
        if (!lab) {
          lab = document.createElement('div');
          lab.className = 'cwh-spoil-label';
          lab.setAttribute('data-cwh', '1');
          el.appendChild(lab);
        }
        const txt = info.soft ? (info.text || 'гниёт') : info.text;
        if (lab.textContent !== txt) lab.textContent = txt;
        const leftH = info.totalMinLeft != null ? info.totalMinLeft / 60 : info.hours;
        const isWarn = !info.soft && leftH <= 3;
        lab.classList.toggle('warn', isWarn);
        lab.classList.toggle('soft', !!info.soft);
        lab.title = info.soft ? 'Скоропорт' : ('До порчи ≈ ' + info.text);
        if (isWarn && el.id) {
          const key = 'warn_' + el.id;
          const last = window._cwhSpoilWarned || (window._cwhSpoilWarned = {});
          if (!last[key] || Date.now() - last[key] > 120000) {
            last[key] = Date.now();
            cwhBeep('warn');
          }
        }
      });
      Object.keys(spoilCache).forEach(id => {
        if (!alive.has(id)) delete spoilCache[id];
      });
      try { refreshNettleBox(); } catch (e) {}
      try { trackMouthPickups(); } catch (e) {}
    } finally {
      _spoilBusy = false;
    }
  }

  function probeMouthItems() {
    if (_probeRunning) return;
    if (Date.now() < _userActionUntil) return;
    const list = document.getElementById('itemList');
    if (!list) return;
    const items = Array.from(list.querySelectorAll('.itemInMouth'))
      .filter(el => el.id && isPerishableEl(el));
    if (!items.length) {
      renderSpoilLabels();
      return;
    }
    // только те, у кого ещё нет точного срока
    const need = items.filter(el => {
      const c = spoilCache[el.id];
      if (!c || c.soft) return true;
      // повторный опрос если прошло ≥10 мин с прошлого чтения
      if (c.fetchedAt && (Date.now() - c.fetchedAt) >= 10 * 60 * 1000) return true;
      return false;
    });
    const sig = items.map(el => el.id).sort().join(',');
    if (!need.length) {
      _lastMouthSig = sig;
      renderSpoilLabels();
      return;
    }
    if (sig === _lastMouthSig && !need.length) {
      renderSpoilLabels();
      return;
    }
    _lastMouthSig = sig;
    _probeRunning = true;

    const th = document.getElementById('thdey');
    const prevActiveId = (list.querySelector('.active_thing') || {}).id || null;
    // не трогаем visibility thdey — только opacity, меньше дёрганий
    const prevOp = th ? th.style.opacity : '';
    if (th) th.style.opacity = '0';

    let i = 0;
    function finish() {
      // восстанавливаем выбор ТОЛЬКО если тот же предмет ещё во рту
      if (prevActiveId) {
        const still = document.getElementById(prevActiveId);
        if (still && still.classList.contains('itemInMouth')) {
          try { still.click(); } catch (e) {}
        }
      }
      setTimeout(() => {
        if (th) th.style.opacity = prevOp || '';
        _probeRunning = false;
        renderSpoilLabels();
      }, 60);
    }

    function step() {
      if (Date.now() < _userActionUntil) {
        // пользователь кликнул действие — прерываем опрос
        if (th) th.style.opacity = prevOp || '';
        _probeRunning = false;
        return;
      }
      if (i >= need.length) {
        finish();
        return;
      }
      const el = need[i++];
      if (!el.isConnected) {
        setTimeout(step, 20);
        return;
      }
      try { el.click(); } catch (e) {}
      setTimeout(() => {
        const t = th ? (th.innerText || th.textContent || '') : '';
        const info = parseSpoilText(t) || extractSpoilFromHtml(t);
        if (el.id) {
          spoilCache[el.id] = info || { hours: 999, text: 'гниёт', soft: true };
        }
        renderSpoilLabels();
        setTimeout(step, 70);
      }, 100);
    }
    setTimeout(step, 200);
  }

  function startSpoilWatcher() {
    try {
      const XO = XMLHttpRequest.prototype.open;
      const XS = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function(method, url) {
        this._cwhUrl = url;
        return XO.apply(this, arguments);
      };
      XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
          try {
            const info = extractSpoilFromHtml(this.responseText || '');
            if (!info) return;
            let id = null;
            const um = String(this._cwhUrl || '').match(/[?&](?:id|thing|object)=(\d+)/i);
            if (um) id = um[1];
            const active = document.querySelector('#itemList .active_thing');
            if (!id && active) id = active.id;
            if (id) {
              spoilCache[id] = info;
              renderSpoilLabels();
            }
          } catch (e) {}
        });
        return XS.apply(this, arguments);
      };
    } catch (e) {}

    // действия в thdey / кнопки рта — пауза опроса 2.5 с
    document.addEventListener('click', e => {
      const t = e.target;
      if (!t) return;
      // ссылки действий: Положить, Съесть, Смешивать и т.д.
      const act = t.closest && t.closest('#thdey, #mix, #ctdey, a, button, input');
      if (act && !t.closest('#itemList')) {
        _userActionUntil = Date.now() + 2500;
        return;
      }
      if (_probeRunning) return;
      const it = t.closest && t.closest('#itemList .itemInMouth');
      if (!it) return;
      setTimeout(() => {
        const th = document.getElementById('thdey');
        if (!th) return;
        const info = parseSpoilText(th.innerText || '') || extractSpoilFromHtml(th.innerText || '');
        if (info && it.id) {
          spoilCache[it.id] = info;
          renderSpoilLabels();
        }
      }, 180);
    }, true);

    const boot = () => {
      const list = document.getElementById('itemList');
      if (!list) { setTimeout(boot, 800); return; }
      let t = null;
      const schedule = () => {
        if (t) clearTimeout(t);
        // длинный debounce — после «положить на землю» рот стабилизируется
        t = setTimeout(() => {
          renderSpoilLabels();
          if (Date.now() >= _userActionUntil) probeMouthItems();
        }, 900);
      };
      const obs = new MutationObserver(muts => {
        for (const m of muts) {
          if (m.target && m.target.classList && (m.target.classList.contains('cwh-spoil-label') || m.target.classList.contains('cwh-info-label'))) return;
          for (const n of m.addedNodes || []) {
            if (n.classList && (n.classList.contains('cwh-spoil-label') || n.classList.contains('cwh-info-label'))) return;
          }
        }
        schedule();
      });
      obs.observe(list, { childList: true, subtree: false });
      schedule();
      // каждую минуту обновляем подписи (часы + минуты)
      if (!window._cwhSpoilTick) {
        window._cwhSpoilTick = setInterval(renderSpoilLabels, 30000);
      }
    };
    boot();
  }

  function init() {
    // не показываем виджет вне игровой с полем
    if (/\/cw3\/jagd/i.test(location.href)) return;
    if (!document.getElementById('cages') && !document.getElementById('cages_div')) {
      // подождать карту один раз; на jagd cages нет — не создаём UI
      setTimeout(function() {
        if (/\/cw3\/jagd/i.test(location.href)) return;
        if (!document.getElementById('cages') && !document.getElementById('cages_div')) return;
        injectStyle();
        createToggle();
        startSpoilWatcher();
        startFieldLegend();
        window.addEventListener('resize', function() { if (panel) clampPanel(); });
        if (GM_getValue('cwh_open', false)) {
          createPanel();
          if (panel) panel.style.display = 'flex';
        }
        document.addEventListener('mousemove', onMove, { passive: true });
      }, 1200);
      return;
    }
    injectStyle();
    createToggle();
    startSpoilWatcher();
    startFieldLegend();
    window.addEventListener('resize', () => { if (panel) clampPanel(); });
    if (GM_getValue('cwh_open', false)) {
      createPanel();
      if (panel) panel.style.display = 'flex';
    }
    document.addEventListener('mousemove', onMove, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();