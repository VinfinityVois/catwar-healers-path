// ==UserScript==
// @name         cwh-toolkit.user.js
// @namespace    catwar-healer
// @version      1.9.3
// @description  Справочник болезней/трав, калькулятор ЦУ/грязи/смеси/костоправов, последовательность действий.
// @author       Древняя Мечта 1702183
// @match        http*://*.catwar.net/cw3/*
// @match        http*://*.catwar.su/cw3/*
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      i.ibb.co
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

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
    'Целебная водоросль': 'https://i.ibb.co/nNbRdP14/image.webp',
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
    const src = IMG[name] || IMG[name.replace(/ё/g, 'е')] || '';
    if (!src) return '';
    return `<img class="cwh-icon" src="${src}" alt="${name}" data-full="${src}" style="width:${size}px;height:${size}px;object-fit:contain;border-radius:8px;vertical-align:middle;margin-right:8px;background:rgba(0,0,0,.35);cursor:zoom-in;">`;
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
    { name: 'Мох', id: 3, treats: [], fixedPct: null, note: 'Только ресурс. Без мыши бесполезен — для лечения нужен мох с мышиной желчью', prep: 'наполнить желчью мыши', recipe: 'мох + мышь → мох с желчью' },
    { name: 'Наполненный мышиной желчью мох', id: 78, treats: ['грязь', 'блохи'], fixedPct: 2.66, note: 'Грязь / блохи. ЦУ 0 → 0%', prep: 'обычный мох (не водяной) + мышь', recipe: 'мох + мышь (дичь)' },
    { name: 'Костоправ', id: 562, treats: ['ушибы'], fixedPct: null, note: 'Ушибы (ЛУ). Накладывает больной сам. Не зависит от ЦУ', prep: 'вьюнковый или паутинный', recipe: 'вьюн: 2×ветка + вьюнок (или плотная водоросль) | паутин: 1×ветка + паутина' },
    { name: 'Крепкая ветка', id: 565, treats: [], fixedPct: null, note: 'Для костоправа', prep: 'компонент', recipe: '—' },
    { name: 'Календула', id: 16, treats: ['раны'], fixedPct: null, note: 'Раны', prep: 'как есть', recipe: '—' },
    { name: 'Лаванда', id: 104, treats: ['раны'], fixedPct: null, note: 'Раны', prep: 'как есть', recipe: '—' },
    { name: 'Ромашка', id: 24, treats: ['раны', 'кашель'], fixedPct: null, note: 'Универсальная', prep: 'как есть', recipe: '—' },
    { name: 'Целебная водоросль', id: 21, treats: ['раны'], fixedPct: null, note: 'Ныряние', prep: 'как есть', recipe: '—' },
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
      treatments: ['Рябина', 'Одуванчик', 'Крапива', 'Мятлик'],
      notes: 'Фиксированный % за траву.'
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
      padding: 10px 14px;
      display: flex; justify-content: space-between; align-items: center;
      font-weight: 600; font-size: 12px; letter-spacing: .4px; color: #a6adb5;
      border-bottom: 1px solid rgba(150,155,162,.12);
      border-radius: 14px 14px 0 0;
    }
    #cwh-widget .cwh-btn {
      cursor: pointer; width: 24px; height: 24px;
      display: inline-flex; align-items: center; justify-content: center;
      border-radius: 6px; opacity: .5; font-size: 14px; color: #a6adb5;
      transition: all .2s; background: transparent; border: none;
    }
    #cwh-widget .cwh-btn:hover { opacity: 1; background: rgba(255,255,255,.08); }
    #cwh-widget .cwh-body {
      padding: 10px 12px; overflow-y: auto; flex: 1 1 auto; min-height: 0;
      scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
    }
    #cwh-widget .cwh-body::-webkit-scrollbar { width: 4px; }
    #cwh-widget .cwh-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }

    #cwh-widget .cwh-tabs {
      display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px;
      background: rgba(255,255,255,.03); border-radius: 10px; padding: 4px;
    }
    #cwh-widget .cwh-tab {
      flex: 1; min-width: 56px; text-align: center; padding: 6px 4px; border-radius: 8px;
      background: transparent; border: 1px solid transparent;
      font-size: 10.5px; cursor: pointer; color: #8a9096; transition: all .25s;
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
      position: fixed; z-index: 100001; pointer-events: none;
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
    handle.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      dragging = true;
      offX = e.clientX - el.offsetLeft;
      offY = e.clientY - el.offsetTop;
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      el.style.left = (e.clientX - offX) + 'px';
      el.style.top = (e.clientY - offY) + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      savePos();
    });
  }

  function savePos() {
    if (!panel) return;
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
        <span>⚕ Целитель v1.9</span>
        <div style="display:flex;gap:4px;">
          <button class="cwh-btn" id="cwh-min" title="Свернуть">–</button>
          <button class="cwh-btn" id="cwh-close" title="Скрыть">×</button>
        </div>
      </div>
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
      const b = panel.querySelector('.cwh-body');
      const collapsed = panel.dataset.collapsed === '1';
      if (collapsed) {
        // expand
        b.style.display = 'block';
        b.style.visibility = 'visible';
        b.style.flex = '1 1 auto';
        panel.style.maxHeight = '';
        panel.style.minHeight = '240px';
        panel.style.height = GM_getValue('cwh_h', '520px');
        panel.style.resize = 'both';
        panel.style.overflow = 'hidden';
        panel.dataset.collapsed = '0';
      } else {
        // collapse — only header
        GM_setValue('cwh_h', Math.max(panel.offsetHeight, 240) + 'px');
        b.style.display = 'none';
        b.style.visibility = 'hidden';
        panel.style.height = '42px';
        panel.style.minHeight = '42px';
        panel.style.maxHeight = '42px';
        panel.style.resize = 'none';
        panel.style.overflow = 'hidden';
        panel.dataset.collapsed = '1';
      }
    };

    const ro = new ResizeObserver(() => {
      clearTimeout(panel._rt);
      panel._rt = setTimeout(savePos, 300);
    });
    ro.observe(panel);
    loadPos();
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
    btn.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      drag = true; moved = false;
      const r = btn.getBoundingClientRect();
      ox = e.clientX - r.left;
      oy = e.clientY - r.top;
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!drag) return;
      moved = true;
      const size = 42;
      let x = e.clientX - ox;
      let y = e.clientY - oy;
      x = Math.max(0, Math.min(window.innerWidth - size, x));
      y = Math.max(0, Math.min(window.innerHeight - size, y));
      btn.style.left = x + 'px';
      btn.style.top = y + 'px';
      btn.style.right = 'auto';
      btn.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => {
      if (!drag) return;
      drag = false;
      if (moved) {
        GM_setValue('cwh_toggle_pos', { left: btn.style.left, top: btn.style.top });
      }
    });

    btn.addEventListener('click', e => {
      if (moved) { e.preventDefault(); e.stopPropagation(); return; }
      if (!panel) createPanel();
      const open = panel.style.display === 'none';
      panel.style.display = open ? 'flex' : 'none';
      GM_setValue('cwh_open', open);
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
    let html = ''
      + '<div class="cwh-section-title">Уровень ЦУ (раны / ПУ)</div>'
      + '<div class="cwh-row"><div><label>ЦУ 0–9</label>'
      + '<input type="number" id="cwh-cu-in" min="0" max="9" value="' + cu + '"></div>'
      + '<div><label>% за 1 дозу</label>'
      + '<input type="text" id="cwh-cu-out" readonly value="' + (CU_PCT[cu] || '?') + '%"></div></div>'
      + '<div class="cwh-section-title">Список трав (иконки)</div>';
    HERBS.forEach(h => {
      const pct = h.fixedPct != null ? h.fixedPct + '%' : (CU_PCT[cu] + '% ЦУ');
      const pills = (h.treats || []).map(t => '<span class="cwh-pill">' + t + '</span>').join('');
      html += '<div class="cwh-card">' + icon(h.name, 64)
        + '<div class="cwh-card-body">'
        + '<div class="cwh-card-title">' + h.name + ' <span style="float:right;color:#9fd66c;font-size:11px">' + pct + '</span></div>'
        + '<div class="cwh-card-meta">' + (h.note || '') + ' · ' + (h.prep || '') + (h.id ? ' · ID ' + h.id : '') + '</div>'
        + '<div>' + pills + '</div></div></div>';
    });
    el.innerHTML = html;
    const inp = el.querySelector('#cwh-cu-in');
    const out = el.querySelector('#cwh-cu-out');
    inp.oninput = () => {
      let v = Math.max(0, Math.min(9, +inp.value || 0));
      inp.value = v;
      GM_setValue('cwh_cu', v);
      out.value = (CU_PCT[v] || '?') + '%';
    };
  }

  function renderCalc(el) {
    const cu = +GM_getValue('cwh_cu', 5);
    const cuPct = CU_PCT[cu] || 20;

    // пулы трав по типу
    const POOLS = {
      wound: HERBS.filter(h => (h.treats||[]).some(t => /ран|пу|кровот/i.test(t)) && h.fixedPct == null),
      cough: HERBS.filter(h => (h.treats||[]).some(t => /кашл/i.test(t))),
      poison: HERBS.filter(h => (h.treats||[]).some(t => /отрав/i.test(t))),
      dirt: HERBS.filter(h => /мышиной желчью/i.test(h.name)),
    };

    function healOf(h, type) {
      if (type === 'dirt') return 2.66;
      if (h.fixedPct != null) return h.fixedPct;
      if (type === 'wound') return cuPct;
      if (type === 'cough') return h.fixedPct || 5;
      if (type === 'poison') return h.fixedPct || 7;
      return cuPct;
    }

    el.innerHTML = `
      <div class="cwh-section-title">Калькулятор лечения</div>
      <div class="cwh-row">
        <div>
          <label>Текущее HP %</label>
          <input type="number" id="cwh-hp" min="0" max="100" value="50">
        </div>
        <div>
          <label>ЦУ (для ран/ПУ)</label>
          <input type="number" id="cwh-cu2" min="0" max="9" value="${cu}">
        </div>
      </div>
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
      let html = '<div>Нужно: <b>' + need + '%</b>';
      if (type === 'wound') html += ' · ЦУ ' + c + ' = <b>' + (CU_PCT[c]||'?') + '%</b>/доза';
      html += '</div>';
      html += '<div style="margin:8px 0;padding:8px;background:rgba(127,174,92,.1);border-radius:8px;display:flex;align-items:center;gap:8px">'
        + icon(best.h.name, 40)
        + '<div><b>' + best.h.name + '</b> × <b>' + nBest + '</b><br>'
        + '<span style="color:#9fd66c">' + best.per + '% × ' + nBest + ' = <b>'
        + (Math.round(nBest*best.per*10)/10) + '%</b></span></div></div>';
      html += '<div style="font-size:11px;color:#a6adb5;margin-bottom:4px">Все варианты:</div>';
      ranked.forEach(({h, per}) => {
        const n = Math.ceil(need / per);
        const tot = Math.round(n*per*10)/10;
        html += '<div style="display:flex;align-items:center;gap:6px;margin:3px 0;font-size:11px">'
          + icon(h.name, 28)
          + '<span style="flex:1">' + h.name + '</span>'
          + '<span style="color:#9fd66c">' + per + '%</span>'
          + '<span>×' + n + '</span>'
          + '<span style="min-width:48px;text-align:right"><b>' + tot + '%</b></span></div>';
      });
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
      const hp = +el.querySelector('#k-hp').value || 0;
      const type = typeSel.value;
      const hours = +el.querySelector('#k-hours').value || 24;
      let num = +el.querySelector('#k-num').value || 1;
      const maxN = maxKostoprav(moons);
      if (num > maxN) num = maxN;
      const deg = fractureDegree(hp);
      el.querySelector('#k-deg').innerHTML = 'HP <strong>' + hp + '%</strong> → <strong>' + deg.name + '</strong> · макс. костоправов: <strong>' + maxN + '</strong>';

      let base = hours <= 6 ? 15 + growth * 0.15
        : hours <= 12 ? 25 + growth * 0.25
        : hours <= 24 ? 40 + growth * 0.3
        : hours <= 36 ? 50 + growth * 0.25
        : hours <= 48 ? 58 + growth * 0.2
        : 65 + growth * 0.15;
      base = Math.min(95, base);
      if (type === 'spider') base *= 1.15;
      base = Math.min(100, base);
      let total = base;
      for (let i = 1; i < num; i++) total += base * 0.35;
      total = Math.min(110, total);
      const need = 100 - hp;
      const ok = total >= need;
      el.querySelector('#k-res').innerHTML = 'Оценка хила за <strong>' + hours + ' ч</strong> (' + num + ' шт., '
        + (type === 'spider' ? 'паутинный' : 'вьюнковый') + '):<br><strong>≈ ' + total.toFixed(1) + '%</strong>'
        + (ok ? ' — должно хватить' : (' — не хватает ≈ ' + (need - total).toFixed(1) + '%'))
        + '<br><span style="font-size:11px;opacity:.75">Ориентир. Сверяй с таблицей памятки.</span>';
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
          // контейнер, который перерисовывает startIconCycles
          return '<span class="cwh-kost-flow-wrap" id="cwh-kost-flow"></span>';
        }
        const src = IMG[p] || IMG[p.replace(/ё/g,'е')];
        if (src) return '<img class="cwh-icon" src="' + src + '" alt="' + p + '" data-full="' + src + '" title="' + p + '">';
        return '<span style="font-size:11px;color:#a6adb5">' + p + '</span>';
      }).join('') + '</div>';
    }
    const rows = [
      { name: 'Мёд', treat: 'кашель', pct: '3%', recipe: 'есть как дичь (не делить, не жевать)', parts: ['Мёд'] },
      { name: 'Пижма', treat: 'кашель', pct: '5%', recipe: 'целую → разделить → стебель', parts: ['Пижма', '→', 'Стебель'] },
      { name: 'Кошачья мята', treat: 'кашель', pct: '10%', recipe: 'целую → разделить → листья', parts: ['Кошачья мята', '→', 'Листья'] },
      { name: 'Бурачник', treat: 'кашель', pct: '5%', recipe: 'целый → разделить → листья', parts: ['Бурачник', '→', 'Листья'] },
      { name: 'Мать-и-мачеха', treat: 'кашель', pct: '5%', recipe: 'целую → разделить → листья → разжевать', parts: ['Мать-и-мачеха', '→', 'Листья', '→', 'Разжёванные листья'] },
      { name: 'Мятлик', treat: 'отравление', pct: '5%', recipe: 'целый → разделить → семена', parts: ['Мятлик', '→', 'Семена'] },
      { name: 'Рябина', treat: 'отравление', pct: '10%', recipe: 'целую → разделить → ягоды', parts: ['Рябина', '→', 'Ягоды'] },
      { name: 'Одуванчик', treat: 'отравление', pct: '10%', recipe: 'целый → разделить → листья → разжевать', parts: ['Одуванчик', '→', 'Листья', '→', 'Разжёванные листья'] },
      { name: 'Крапива', treat: 'отрав. / раны+ПУ', pct: 'отрав. 10%; раны — ЦУ', recipe: 'отрав.: семена · раны: листья→разжевать', parts: ['Крапива', '→', 'Семена'] },
      { name: 'Клевер', treat: 'раны / ПУ', pct: 'от ЦУ', recipe: 'целый → разделить → листья → разжевать', parts: ['Клевер', '→', 'Листья', '→', 'Разжёванные листья'] },
      { name: 'Незабудка', treat: 'раны / кровот. / ПУ', pct: 'от ЦУ', recipe: 'целую → разделить → листья → разжевать', parts: ['Незабудка', '→', 'Листья', '→', 'Разжёванные листья'] },
      { name: 'Тысячелистник', treat: 'только кровотечение', pct: '−1 ед.', recipe: 'целый → разделить → листья → разжевать', parts: ['Тысячелистник', '→', 'Листья', '→', 'Разжёванные листья'] },
      { name: 'Паутина', treat: 'раны / кровот. / ПУ', pct: 'от ЦУ', recipe: 'наложить действием (не делить)', parts: ['Паутина'] },
      { name: 'Шиповник', treat: 'раны / ПУ', pct: 'от ЦУ', recipe: 'целый → разделить → листья → разжевать', parts: ['Шиповник', '→', 'Листья', '→', 'Разжёванные листья'] },
      { name: 'Лопух', treat: 'раны / ПУ', pct: 'от ЦУ', recipe: 'целый → разделить → корень → разжевать', parts: ['Лопух', '→', 'Корень', '→', 'Разжёванный корень'] },
      { name: 'Щавель', treat: 'раны / ПУ', pct: 'от ЦУ', recipe: 'целый → разделить → сок', parts: ['Щавель', '→', 'Сок'] },
      { name: 'Подорожник', treat: 'раны / ПУ', pct: 'от ЦУ', recipe: 'целый → разделить → листья → разжевать', parts: ['Подорожник', '→', 'Листья', '→', 'Разжёванные листья'] },
      { name: 'Наполненный мышиной желчью мох', treat: 'грязь / блохи', pct: '~2.66%', recipe: 'обычный мох + мышь', parts: ['Мох', '+', '__MOUSE__', '→', 'Наполненный мышиной желчью мох'], cycle: 'mouse' },
      { name: 'Костоправ', treat: 'ушибы (ЛУ)', pct: 'сам больной', recipe: 'вьюн: 2×ветка + вьюнок (или плотная водоросль) · паутин: 1×ветка + паутина', parts: ['__KOST_FLOW__'], cycle: 'kost' },
    ];
    let html = '<div class="cwh-section-title">Рецепты (картинки шагов)</div>';
    rows.forEach(r => {
      html += '<div class="cwh-card">' + icon(r.name, 64)
        + '<div class="cwh-card-body">'
        + '<div class="cwh-card-title">' + r.name + '<span style="float:right;color:#9fd66c;font-size:11px">' + r.pct + '</span></div>'
        + '<div class="cwh-card-meta"><b>Лечит:</b> ' + r.treat + '</div>'
        + '<div class="cwh-card-meta">' + r.recipe + '</div>'
        + flow(r.parts) + '</div></div>';
    });
    html += '<div class="cwh-section-title">Смесь от кашля — 70%</div>'
      + '<div class="cwh-card"><div class="cwh-card-body">'
      + '<div class="cwh-card-meta" style="margin-bottom:6px">Смешать <b>без</b> разделения и разжёвывания (5 мест во рту):</div>'
      + flow(['Пижма', '+', 'Мать-и-мачеха', '+', 'Бурачник', '+', 'Кошачья мята', '+', 'Кошачья мята'])
      + '<div class="cwh-card-meta" style="margin-top:8px">Съесть как дичь → <b>70% HP</b></div></div></div>'
      + '<div class="cwh-section-title">Общий порядок</div>'
      + '<div class="cwh-step"><b>1.</b> Взять траву во рот.</div>'
      + '<div class="cwh-step"><b>2.</b> Разделить (если нужно).</div>'
      + '<div class="cwh-step"><b>3.</b> Разжевать (если нужно).</div>'
      + '<div class="cwh-step"><b>4.</b> Наложить / съесть смесь / надеть костоправ.</div>'
      + '<div class="cwh-note">Неразделённую траву есть нельзя → −50% HP. Падаль/кости → −75%.</div>';
    el.innerHTML = html;
    startIconCycles();
  }

  function renderMemo(el) {
    el.innerHTML = `
      <div class="cwh-section-title">Главные правила</div>
      <div class="cwh-card"><div class="cwh-card-body cwh-card-meta">
        • Ориентир — <b>рост модельки</b> (связан с лунами).<br>
        • Нужно залечить: 100 − текущее HP.<br>
        • Костоправ не лечит переломы, полученные во время ношения.<br>
        • Среднее лечение переломов ≈ ½ луны (2 дня), 5 ч – 5 дней.<br>
        • Кровотечение с высоты 2+ ≈ 1% фактора перелома.<br>
        • Не перенашивай костоправы — есть лимит хила.
      </div></div>

      <div class="cwh-section-title">Луны → рост</div>
      <div class="cwh-card"><div class="cwh-card-body cwh-card-meta" style="line-height:1.85;font-variant-numeric:tabular-nums">
        0 лун → 45%<br>
        1 → 47%<br>
        2 → 50%<br>
        3 → 52%<br>
        4 → 55%<br>
        5 → 60%<br>
        6 → 65%<br>
        7 → 66%<br>
        8 → 68%<br>
        9 → 70%<br>
        10 → 71%<br>
        ~35 → 80%<br>
        ~65 → 86%<br>
        ~95 → 88%<br>
        ~125 → 90%<br>
        ~200 → 95%<br>
        ~250 → 100%
      </div></div>

      <div class="cwh-section-title">Лимит костоправов</div>
      <div class="cwh-card"><div class="cwh-card-body cwh-card-meta" style="line-height:1.7">
        0 лун → 1<br>
        6 лун → 2<br>
        12 лун → 3<br>
        50 лун → 4<br>
        200 лун → 5
      </div></div>

      <div class="cwh-section-title">Степени переломов по HP</div>
      <div class="cwh-card"><div class="cwh-card-body cwh-card-meta" style="line-height:1.7">
        ≥ 90% — ушибы (часто сами)<br>
        89–75% — 1 степень<br>
        74–50% — 2 степень<br>
        49–25% — 3 степень<br>
        24–1% — 4 степень
      </div></div>

      <div class="cwh-note">Паутинный костоправ ≈ +15% к вьюнковому. Полные таблицы % по часам — в Google-памятке.</div>
    `;
  }

  /* ========================================================================
     ПОДСКАЗКИ ПРИ НАВЕДЕНИИ
     ======================================================================== */

  let tipEl = null;
  function ensureTip() {
    if (tipEl) return tipEl;
    tipEl = document.createElement('div');
    tipEl.id = 'cwh-tip';
    tipEl.style.cssText = `
      position:fixed;z-index:100000;max-width:280px;
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
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'cwh-zoom-wrap';
      wrap.innerHTML = '<img alt=""><div class="cwh-zoom-txt"></div>';
      document.body.appendChild(wrap);
    }
    const tip = ensureTip();

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
      wrap.style.display = 'flex';
      wrap.style.left = Math.min(e.clientX + 14, window.innerWidth - 170) + 'px';
      wrap.style.top = Math.min(e.clientY + 14, window.innerHeight - 160) + 'px';
      tip.style.display = 'none';
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
          // сначала точное имя в IMG / HERBS, иначе самое длинное совпадение (чтобы «мох» не перебивал «мох с желчью»)
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
        tip.innerHTML = html;
        tip.style.display = 'block';
        tip.style.left = Math.min(e.clientX + 12, window.innerWidth - 250) + 'px';
        tip.style.top = Math.min(e.clientY + 12, window.innerHeight - 200) + 'px';
        wrap.style.display = 'none';
        return;
      }
    }

    wrap.style.display = 'none';

    // 3) подсказки на странице игры (вне виджета)
    if (e.target.closest && e.target.closest('#cwh-widget')) {
      tip.style.display = 'none';
      return;
    }

    let el = e.target, info = null;
    for (let i = 0; i < 4 && el; i++) {
      const raw = (el.getAttribute && (el.getAttribute('title') || el.getAttribute('alt'))) || '';
      let txt = raw;
      if (!txt && el.childNodes && el.childNodes.length <= 3) {
        txt = (el.textContent || '').trim().slice(0, 60);
      }
      if (txt && txt.length >= 3 && txt.length < 80) {
        info = findInfo(txt);
        if (info) break;
      }
      el = el.parentElement;
    }
    if (info) {
      tip.innerHTML = info;
      tip.style.display = 'block';
      tip.style.left = Math.min(e.clientX + 12, window.innerWidth - 290) + 'px';
      tip.style.top = Math.min(e.clientY + 12, window.innerHeight - 120) + 'px';
    } else {
      tip.style.display = 'none';
    }
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

    _cycleTimer = setInterval(function() {
      // mice always
      mi = (mi + 1) % MICE.length;
      document.querySelectorAll('.cwh-cycle-mouse').forEach(function(img) {
        img.src = MICE[mi].src; img.dataset.full = MICE[mi].src;
        img.alt = MICE[mi].name; img.title = MICE[mi].name;
      });
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

  function init() {
    injectStyle();
    createToggle();
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
