/* default 主题 · 原生搜索（无依赖）：
 * 拉取 /search.json，按空格分词过滤标题/正文/标签/分类，/regex/ 支持正则。
 * 摘要以最早命中的关键词为中心截取（关键词靠后也能在预览中高亮）。
 * 由 Layout 底部脚本在 #search-input 上绑定 input 事件调用 window.searchArticles。
 */
(function () {
  "use strict";

  var cache = null;
  var cacheUrl = "";

  function loadIndex(url, cb) {
    if (cache && cacheUrl === url) {
      cb(cache);
      return;
    }
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error("search.json " + r.status);
        return r.json();
      })
      .then(function (data) {
        cache = data;
        cacheUrl = url;
        cb(data);
      })
      .catch(function (err) {
        console.error("搜索索引加载失败:", err);
        cb([]);
      });
  }

  function parseKeywords(raw) {
    var kws = [];
    raw.split(/\s+/).forEach(function (kw) {
      kw = kw.trim();
      if (!kw) return;
      kws.push(kw);
    });
    return kws;
  }

  function isRegex(kw) {
    return kw.length > 2 && kw[0] === "/" && kw[kw.length - 1] === "/";
  }

  function compile(kw) {
    if (isRegex(kw)) {
      try {
        return { re: new RegExp(kw.slice(1, -1), "i"), plain: null };
      } catch (e) {
        return { re: null, plain: kw.toLowerCase() };
      }
    }
    return { re: null, plain: kw.toLowerCase() };
  }

  function match(item, comps) {
    var haystack = (
      item.title +
      " " +
      item.content +
      " " +
      (item.tags || []).join(" ") +
      " " +
      (item.categories || []).join(" ")
    ).toLowerCase();
    for (var i = 0; i < comps.length; i++) {
      var c = comps[i];
      if (c.re) {
        if (!c.re.test(item.title + " " + item.content)) return false;
      } else if (haystack.indexOf(c.plain) === -1) {
        return false;
      }
    }
    return true;
  }

  /**
   * 摘要：以最早命中的关键词为中心截取 ~maxLen 窗口，并保证完整包含关键词
   * （避免截断破坏高亮）。前后截断处用 … 标注；未命中（理论上不会发生）回退为从头截断。
   */
  function excerptAround(content, comps, maxLen) {
    var pos = -1;
    var kwLen = 1;
    for (var i = 0; i < comps.length; i++) {
      var c = comps[i];
      var m = c.re
        ? c.re.exec(content)
        : c.plain
          ? new RegExp(escapeRegExp(c.plain), "i").exec(content)
          : null;
      if (m && (pos === -1 || m.index < pos)) {
        pos = m.index;
        kwLen = m[0].length || 1;
      }
    }
    if (pos === -1) {
      if (content.length <= maxLen) return content;
      return content.slice(0, maxLen) + "…";
    }
    var lead = Math.floor(maxLen * 0.35);
    var start = Math.max(0, pos - lead);
    var end = Math.min(content.length, start + maxLen);
    if (end < pos + kwLen) end = Math.min(content.length, pos + kwLen);
    var out = content.slice(start, end);
    if (start > 0) out = "…" + out;
    if (end < content.length) out += "…";
    return out;
  }

  function render(items, container, comps) {
    if (items.length === 0) {
      container.innerHTML = '<p class="search-empty">无结果</p>';
      return;
    }
    var html = "";
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var excerpt = excerptAround(it.content, comps, 160);
      html +=
        '<a class="search-item" href="' +
        it.url +
        '">' +
        '<div class="search-item-title">' +
        highlight(escapeHtml(it.title), comps) +
        "</div>" +
        '<p class="search-item-excerpt">' +
        highlight(escapeHtml(excerpt), comps) +
        "</p>" +
        '<div class="search-item-meta">' +
        (it.date ? escapeHtml(it.date) + " · " : "") +
        (it.tags || []).map(escapeHtml).join(" / ") +
        "</div>" +
        "</a>";
    }
    container.innerHTML = html;
  }

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /** 关键词高亮（在已转义文本上操作，安全）；/regex/ 关键词跳过 */
  function highlight(text, comps) {
    var result = text;
    for (var i = 0; i < comps.length; i++) {
      var c = comps[i];
      if (!c.plain) continue;
      result = result.replace(
        new RegExp("(" + escapeRegExp(c.plain) + ")", "gi"),
        "<mark>$1</mark>",
      );
    }
    return result;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  window.searchArticles = function (raw, url) {
    var container = document.getElementById("search-results");
    if (!container) return;
    var kws = parseKeywords(raw);
    if (kws.length === 0) {
      container.innerHTML = "";
      return;
    }
    var comps = kws.map(compile);
    loadIndex(url || "/search.json", function (index) {
      var hits = index.filter(function (it) {
        return match(it, comps);
      });
      render(hits, container, comps);
    });
  };
})();
