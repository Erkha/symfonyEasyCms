import('./custom.js');
import('./contact-form-script.js');
import('./form-validator.min.js');
import('./images-loded.min.js');
import('./isotope.min.js');
import('./main.js');
import('./owl.carousel.min.js');
import('./responsiveslides.min.js');
import('./slider-index.js');
import('./smoothscroll.js');
import('./TweenMax.min.js');
import('./scroll.js');


var $ = require('jquery');
require('popper.js');
require('bootstrap');

/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
!function (a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto)
}(function (a) {
    var b, c, d, e, f, g, h = "Close", i = "BeforeClose", j = "AfterClose", k = "BeforeAppend", l = "MarkupParse",
        m = "Open", n = "Change", o = "mfp", p = "." + o, q = "mfp-ready", r = "mfp-removing", s = "mfp-prevent-close",
        t = function () {
        }, u = !!window.jQuery, v = a(window), w = function (a, c) {
            b.ev.on(o + a + p, c)
        }, x = function (b, c, d, e) {
            var f = document.createElement("div");
            return f.className = "mfp-" + b, d && (f.innerHTML = d), e ? c && c.appendChild(f) : (f = a(f), c && f.appendTo(c)), f
        }, y = function (c, d) {
            b.ev.triggerHandler(o + c, d), b.st.callbacks && (c = c.charAt(0).toLowerCase() + c.slice(1), b.st.callbacks[c] && b.st.callbacks[c].apply(b, a.isArray(d) ? d : [d]))
        }, z = function (c) {
            return c === g && b.currTemplate.closeBtn || (b.currTemplate.closeBtn = a(b.st.closeMarkup.replace("%title%", b.st.tClose)), g = c), b.currTemplate.closeBtn
        }, A = function () {
            a.magnificPopup.instance || (b = new t, b.init(), a.magnificPopup.instance = b)
        }, B = function () {
            var a = document.createElement("p").style, b = ["ms", "O", "Moz", "Webkit"];
            if (void 0 !== a.transition) return !0;
            for (; b.length;) if (b.pop() + "Transition" in a) return !0;
            return !1
        };
    t.prototype = {
        constructor: t, init: function () {
            var c = navigator.appVersion;
            b.isLowIE = b.isIE8 = document.all && !document.addEventListener, b.isAndroid = /android/gi.test(c), b.isIOS = /iphone|ipad|ipod/gi.test(c), b.supportsTransition = B(), b.probablyMobile = b.isAndroid || b.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), d = a(document), b.popupsCache = {}
        }, open: function (c) {
            var e;
            if (c.isObj === !1) {
                b.items = c.items.toArray(), b.index = 0;
                var g, h = c.items;
                for (e = 0; e < h.length; e++) if (g = h[e], g.parsed && (g = g.el[0]), g === c.el[0]) {
                    b.index = e;
                    break
                }
            } else b.items = a.isArray(c.items) ? c.items : [c.items], b.index = c.index || 0;
            if (b.isOpen) return void b.updateItemHTML();
            b.types = [], f = "", c.mainEl && c.mainEl.length ? b.ev = c.mainEl.eq(0) : b.ev = d, c.key ? (b.popupsCache[c.key] || (b.popupsCache[c.key] = {}), b.currTemplate = b.popupsCache[c.key]) : b.currTemplate = {}, b.st = a.extend(!0, {}, a.magnificPopup.defaults, c), b.fixedContentPos = "auto" === b.st.fixedContentPos ? !b.probablyMobile : b.st.fixedContentPos, b.st.modal && (b.st.closeOnContentClick = !1, b.st.closeOnBgClick = !1, b.st.showCloseBtn = !1, b.st.enableEscapeKey = !1), b.bgOverlay || (b.bgOverlay = x("bg").on("click" + p, function () {
                b.close()
            }), b.wrap = x("wrap").attr("tabindex", -1).on("click" + p, function (a) {
                b._checkIfClose(a.target) && b.close()
            }), b.container = x("container", b.wrap)), b.contentContainer = x("content"), b.st.preloader && (b.preloader = x("preloader", b.container, b.st.tLoading));
            var i = a.magnificPopup.modules;
            for (e = 0; e < i.length; e++) {
                var j = i[e];
                j = j.charAt(0).toUpperCase() + j.slice(1), b["init" + j].call(b)
            }
            y("BeforeOpen"), b.st.showCloseBtn && (b.st.closeBtnInside ? (w(l, function (a, b, c, d) {
                c.close_replaceWith = z(d.type)
            }), f += " mfp-close-btn-in") : b.wrap.append(z())), b.st.alignTop && (f += " mfp-align-top"), b.fixedContentPos ? b.wrap.css({
                overflow: b.st.overflowY,
                overflowX: "hidden",
                overflowY: b.st.overflowY
            }) : b.wrap.css({
                top: v.scrollTop(),
                position: "absolute"
            }), (b.st.fixedBgPos === !1 || "auto" === b.st.fixedBgPos && !b.fixedContentPos) && b.bgOverlay.css({
                height: d.height(),
                position: "absolute"
            }), b.st.enableEscapeKey && d.on("keyup" + p, function (a) {
                27 === a.keyCode && b.close()
            }), v.on("resize" + p, function () {
                b.updateSize()
            }), b.st.closeOnContentClick || (f += " mfp-auto-cursor"), f && b.wrap.addClass(f);
            var k = b.wH = v.height(), n = {};
            if (b.fixedContentPos && b._hasScrollBar(k)) {
                var o = b._getScrollbarSize();
                o && (n.marginRight = o)
            }
            b.fixedContentPos && (b.isIE7 ? a("body, html").css("overflow", "hidden") : n.overflow = "hidden");
            var r = b.st.mainClass;
            return b.isIE7 && (r += " mfp-ie7"), r && b._addClassToMFP(r), b.updateItemHTML(), y("BuildControls"), a("html").css(n), b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo || a(document.body)), b._lastFocusedEl = document.activeElement, setTimeout(function () {
                b.content ? (b._addClassToMFP(q), b._setFocus()) : b.bgOverlay.addClass(q), d.on("focusin" + p, b._onFocusIn)
            }, 16), b.isOpen = !0, b.updateSize(k), y(m), c
        }, close: function () {
            b.isOpen && (y(i), b.isOpen = !1, b.st.removalDelay && !b.isLowIE && b.supportsTransition ? (b._addClassToMFP(r), setTimeout(function () {
                b._close()
            }, b.st.removalDelay)) : b._close())
        }, _close: function () {
            y(h);
            var c = r + " " + q + " ";
            if (b.bgOverlay.detach(), b.wrap.detach(), b.container.empty(), b.st.mainClass && (c += b.st.mainClass + " "), b._removeClassFromMFP(c), b.fixedContentPos) {
                var e = {marginRight: ""};
                b.isIE7 ? a("body, html").css("overflow", "") : e.overflow = "", a("html").css(e)
            }
            d.off("keyup" + p + " focusin" + p), b.ev.off(p), b.wrap.attr("class", "mfp-wrap").removeAttr("style"), b.bgOverlay.attr("class", "mfp-bg"), b.container.attr("class", "mfp-container"), !b.st.showCloseBtn || b.st.closeBtnInside && b.currTemplate[b.currItem.type] !== !0 || b.currTemplate.closeBtn && b.currTemplate.closeBtn.detach(), b.st.autoFocusLast && b._lastFocusedEl && a(b._lastFocusedEl).focus(), b.currItem = null, b.content = null, b.currTemplate = null, b.prevHeight = 0, y(j)
        }, updateSize: function (a) {
            if (b.isIOS) {
                var c = document.documentElement.clientWidth / window.innerWidth, d = window.innerHeight * c;
                b.wrap.css("height", d), b.wH = d
            } else b.wH = a || v.height();
            b.fixedContentPos || b.wrap.css("height", b.wH), y("Resize")
        }, updateItemHTML: function () {
            var c = b.items[b.index];
            b.contentContainer.detach(), b.content && b.content.detach(), c.parsed || (c = b.parseEl(b.index));
            var d = c.type;
            if (y("BeforeChange", [b.currItem ? b.currItem.type : "", d]), b.currItem = c, !b.currTemplate[d]) {
                var f = b.st[d] ? b.st[d].markup : !1;
                y("FirstMarkupParse", f), f ? b.currTemplate[d] = a(f) : b.currTemplate[d] = !0
            }
            e && e !== c.type && b.container.removeClass("mfp-" + e + "-holder");
            var g = b["get" + d.charAt(0).toUpperCase() + d.slice(1)](c, b.currTemplate[d]);
            b.appendContent(g, d), c.preloaded = !0, y(n, c), e = c.type, b.container.prepend(b.contentContainer), y("AfterChange")
        }, appendContent: function (a, c) {
            b.content = a, a ? b.st.showCloseBtn && b.st.closeBtnInside && b.currTemplate[c] === !0 ? b.content.find(".mfp-close").length || b.content.append(z()) : b.content = a : b.content = "", y(k), b.container.addClass("mfp-" + c + "-holder"), b.contentContainer.append(b.content)
        }, parseEl: function (c) {
            var d, e = b.items[c];
            if (e.tagName ? e = {el: a(e)} : (d = e.type, e = {data: e, src: e.src}), e.el) {
                for (var f = b.types, g = 0; g < f.length; g++) if (e.el.hasClass("mfp-" + f[g])) {
                    d = f[g];
                    break
                }
                e.src = e.el.attr("data-mfp-src"), e.src || (e.src = e.el.attr("href"))
            }
            return e.type = d || b.st.type || "inline", e.index = c, e.parsed = !0, b.items[c] = e, y("ElementParse", e), b.items[c]
        }, addGroup: function (a, c) {
            var d = function (d) {
                d.mfpEl = this, b._openClick(d, a, c)
            };
            c || (c = {});
            var e = "click.magnificPopup";
            c.mainEl = a, c.items ? (c.isObj = !0, a.off(e).on(e, d)) : (c.isObj = !1, c.delegate ? a.off(e).on(e, c.delegate, d) : (c.items = a, a.off(e).on(e, d)))
        }, _openClick: function (c, d, e) {
            var f = void 0 !== e.midClick ? e.midClick : a.magnificPopup.defaults.midClick;
            if (f || !(2 === c.which || c.ctrlKey || c.metaKey || c.altKey || c.shiftKey)) {
                var g = void 0 !== e.disableOn ? e.disableOn : a.magnificPopup.defaults.disableOn;
                if (g) if (a.isFunction(g)) {
                    if (!g.call(b)) return !0
                } else if (v.width() < g) return !0;
                c.type && (c.preventDefault(), b.isOpen && c.stopPropagation()), e.el = a(c.mfpEl), e.delegate && (e.items = d.find(e.delegate)), b.open(e)
            }
        }, updateStatus: function (a, d) {
            if (b.preloader) {
                c !== a && b.container.removeClass("mfp-s-" + c), d || "loading" !== a || (d = b.st.tLoading);
                var e = {status: a, text: d};
                y("UpdateStatus", e), a = e.status, d = e.text, b.preloader.html(d), b.preloader.find("a").on("click", function (a) {
                    a.stopImmediatePropagation()
                }), b.container.addClass("mfp-s-" + a), c = a
            }
        }, _checkIfClose: function (c) {
            if (!a(c).hasClass(s)) {
                var d = b.st.closeOnContentClick, e = b.st.closeOnBgClick;
                if (d && e) return !0;
                if (!b.content || a(c).hasClass("mfp-close") || b.preloader && c === b.preloader[0]) return !0;
                if (c === b.content[0] || a.contains(b.content[0], c)) {
                    if (d) return !0
                } else if (e && a.contains(document, c)) return !0;
                return !1
            }
        }, _addClassToMFP: function (a) {
            b.bgOverlay.addClass(a), b.wrap.addClass(a)
        }, _removeClassFromMFP: function (a) {
            this.bgOverlay.removeClass(a), b.wrap.removeClass(a)
        }, _hasScrollBar: function (a) {
            return (b.isIE7 ? d.height() : document.body.scrollHeight) > (a || v.height())
        }, _setFocus: function () {
            (b.st.focus ? b.content.find(b.st.focus).eq(0) : b.wrap).focus()
        }, _onFocusIn: function (c) {
            return c.target === b.wrap[0] || a.contains(b.wrap[0], c.target) ? void 0 : (b._setFocus(), !1)
        }, _parseMarkup: function (b, c, d) {
            var e;
            d.data && (c = a.extend(d.data, c)), y(l, [b, c, d]), a.each(c, function (c, d) {
                if (void 0 === d || d === !1) return !0;
                if (e = c.split("_"), e.length > 1) {
                    var f = b.find(p + "-" + e[0]);
                    if (f.length > 0) {
                        var g = e[1];
                        "replaceWith" === g ? f[0] !== d[0] && f.replaceWith(d) : "img" === g ? f.is("img") ? f.attr("src", d) : f.replaceWith(a("<img>").attr("src", d).attr("class", f.attr("class"))) : f.attr(e[1], d)
                    }
                } else b.find(p + "-" + c).html(d)
            })
        }, _getScrollbarSize: function () {
            if (void 0 === b.scrollbarSize) {
                var a = document.createElement("div");
                a.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(a), b.scrollbarSize = a.offsetWidth - a.clientWidth, document.body.removeChild(a)
            }
            return b.scrollbarSize
        }
    }, a.magnificPopup = {
        instance: null,
        proto: t.prototype,
        modules: [],
        open: function (b, c) {
            return A(), b = b ? a.extend(!0, {}, b) : {}, b.isObj = !0, b.index = c || 0, this.instance.open(b)
        },
        close: function () {
            return a.magnificPopup.instance && a.magnificPopup.instance.close()
        },
        registerModule: function (b, c) {
            c.options && (a.magnificPopup.defaults[b] = c.options), a.extend(this.proto, c.proto), this.modules.push(b)
        },
        defaults: {
            disableOn: 0,
            key: null,
            midClick: !1,
            mainClass: "",
            preloader: !0,
            focus: "",
            closeOnContentClick: !1,
            closeOnBgClick: !0,
            closeBtnInside: !0,
            showCloseBtn: !0,
            enableEscapeKey: !0,
            modal: !1,
            alignTop: !1,
            removalDelay: 0,
            prependTo: null,
            fixedContentPos: "auto",
            fixedBgPos: "auto",
            overflowY: "auto",
            closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
            tClose: "Close (Esc)",
            tLoading: "Loading...",
            autoFocusLast: !0
        }
    }, a.fn.magnificPopup = function (c) {
        A();
        var d = a(this);
        if ("string" == typeof c) if ("open" === c) {
            var e, f = u ? d.data("magnificPopup") : d[0].magnificPopup, g = parseInt(arguments[1], 10) || 0;
            f.items ? e = f.items[g] : (e = d, f.delegate && (e = e.find(f.delegate)), e = e.eq(g)), b._openClick({mfpEl: e}, d, f)
        } else b.isOpen && b[c].apply(b, Array.prototype.slice.call(arguments, 1)); else c = a.extend(!0, {}, c), u ? d.data("magnificPopup", c) : d[0].magnificPopup = c, b.addGroup(d, c);
        return d
    };
    var C, D, E, F = "inline", G = function () {
        E && (D.after(E.addClass(C)).detach(), E = null)
    };
    a.magnificPopup.registerModule(F, {
        options: {hiddenClass: "hide", markup: "", tNotFound: "Content not found"},
        proto: {
            initInline: function () {
                b.types.push(F), w(h + "." + F, function () {
                    G()
                })
            }, getInline: function (c, d) {
                if (G(), c.src) {
                    var e = b.st.inline, f = a(c.src);
                    if (f.length) {
                        var g = f[0].parentNode;
                        g && g.tagName && (D || (C = e.hiddenClass, D = x(C), C = "mfp-" + C), E = f.after(D).detach().removeClass(C)), b.updateStatus("ready")
                    } else b.updateStatus("error", e.tNotFound), f = a("<div>");
                    return c.inlineElement = f, f
                }
                return b.updateStatus("ready"), b._parseMarkup(d, {}, c), d
            }
        }
    });
    var H, I = "ajax", J = function () {
        H && a(document.body).removeClass(H)
    }, K = function () {
        J(), b.req && b.req.abort()
    };
    a.magnificPopup.registerModule(I, {
        options: {
            settings: null,
            cursor: "mfp-ajax-cur",
            tError: '<a href="%url%">The content</a> could not be loaded.'
        }, proto: {
            initAjax: function () {
                b.types.push(I), H = b.st.ajax.cursor, w(h + "." + I, K), w("BeforeChange." + I, K)
            }, getAjax: function (c) {
                H && a(document.body).addClass(H), b.updateStatus("loading");
                var d = a.extend({
                    url: c.src, success: function (d, e, f) {
                        var g = {data: d, xhr: f};
                        y("ParseAjax", g), b.appendContent(a(g.data), I), c.finished = !0, J(), b._setFocus(), setTimeout(function () {
                            b.wrap.addClass(q)
                        }, 16), b.updateStatus("ready"), y("AjaxContentAdded")
                    }, error: function () {
                        J(), c.finished = c.loadError = !0, b.updateStatus("error", b.st.ajax.tError.replace("%url%", c.src))
                    }
                }, b.st.ajax.settings);
                return b.req = a.ajax(d), ""
            }
        }
    });
    var L, M = function (c) {
        if (c.data && void 0 !== c.data.title) return c.data.title;
        var d = b.st.image.titleSrc;
        if (d) {
            if (a.isFunction(d)) return d.call(b, c);
            if (c.el) return c.el.attr(d) || ""
        }
        return ""
    };
    a.magnificPopup.registerModule("image", {
        options: {
            markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
            cursor: "mfp-zoom-out-cur",
            titleSrc: "title",
            verticalFit: !0,
            tError: '<a href="%url%">The image</a> could not be loaded.'
        }, proto: {
            initImage: function () {
                var c = b.st.image, d = ".image";
                b.types.push("image"), w(m + d, function () {
                    "image" === b.currItem.type && c.cursor && a(document.body).addClass(c.cursor)
                }), w(h + d, function () {
                    c.cursor && a(document.body).removeClass(c.cursor), v.off("resize" + p)
                }), w("Resize" + d, b.resizeImage), b.isLowIE && w("AfterChange", b.resizeImage)
            }, resizeImage: function () {
                var a = b.currItem;
                if (a && a.img && b.st.image.verticalFit) {
                    var c = 0;
                    b.isLowIE && (c = parseInt(a.img.css("padding-top"), 10) + parseInt(a.img.css("padding-bottom"), 10)), a.img.css("max-height", b.wH - c)
                }
            }, _onImageHasSize: function (a) {
                a.img && (a.hasSize = !0, L && clearInterval(L), a.isCheckingImgSize = !1, y("ImageHasSize", a), a.imgHidden && (b.content && b.content.removeClass("mfp-loading"), a.imgHidden = !1))
            }, findImageSize: function (a) {
                var c = 0, d = a.img[0], e = function (f) {
                    L && clearInterval(L), L = setInterval(function () {
                        return d.naturalWidth > 0 ? void b._onImageHasSize(a) : (c > 200 && clearInterval(L), c++, void (3 === c ? e(10) : 40 === c ? e(50) : 100 === c && e(500)))
                    }, f)
                };
                e(1)
            }, getImage: function (c, d) {
                var e = 0, f = function () {
                    c && (c.img[0].complete ? (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("ready")), c.hasSize = !0, c.loaded = !0, y("ImageLoadComplete")) : (e++, 200 > e ? setTimeout(f, 100) : g()))
                }, g = function () {
                    c && (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("error", h.tError.replace("%url%", c.src))), c.hasSize = !0, c.loaded = !0, c.loadError = !0)
                }, h = b.st.image, i = d.find(".mfp-img");
                if (i.length) {
                    var j = document.createElement("img");
                    j.className = "mfp-img", c.el && c.el.find("img").length && (j.alt = c.el.find("img").attr("alt")), c.img = a(j).on("load.mfploader", f).on("error.mfploader", g), j.src = c.src, i.is("img") && (c.img = c.img.clone()), j = c.img[0], j.naturalWidth > 0 ? c.hasSize = !0 : j.width || (c.hasSize = !1)
                }
                return b._parseMarkup(d, {
                    title: M(c),
                    img_replaceWith: c.img
                }, c), b.resizeImage(), c.hasSize ? (L && clearInterval(L), c.loadError ? (d.addClass("mfp-loading"), b.updateStatus("error", h.tError.replace("%url%", c.src))) : (d.removeClass("mfp-loading"), b.updateStatus("ready")), d) : (b.updateStatus("loading"), c.loading = !0, c.hasSize || (c.imgHidden = !0, d.addClass("mfp-loading"), b.findImageSize(c)), d)
            }
        }
    });
    var N, O = function () {
        return void 0 === N && (N = void 0 !== document.createElement("p").style.MozTransform), N
    };
    a.magnificPopup.registerModule("zoom", {
        options: {
            enabled: !1, easing: "ease-in-out", duration: 300, opener: function (a) {
                return a.is("img") ? a : a.find("img")
            }
        }, proto: {
            initZoom: function () {
                var a, c = b.st.zoom, d = ".zoom";
                if (c.enabled && b.supportsTransition) {
                    var e, f, g = c.duration, j = function (a) {
                        var b = a.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
                            d = "all " + c.duration / 1e3 + "s " + c.easing, e = {
                                position: "fixed",
                                zIndex: 9999,
                                left: 0,
                                top: 0,
                                "-webkit-backface-visibility": "hidden"
                            }, f = "transition";
                        return e["-webkit-" + f] = e["-moz-" + f] = e["-o-" + f] = e[f] = d, b.css(e), b
                    }, k = function () {
                        b.content.css("visibility", "visible")
                    };
                    w("BuildControls" + d, function () {
                        if (b._allowZoom()) {
                            if (clearTimeout(e), b.content.css("visibility", "hidden"), a = b._getItemToZoom(), !a) return void k();
                            f = j(a), f.css(b._getOffset()), b.wrap.append(f), e = setTimeout(function () {
                                f.css(b._getOffset(!0)), e = setTimeout(function () {
                                    k(), setTimeout(function () {
                                        f.remove(), a = f = null, y("ZoomAnimationEnded")
                                    }, 16)
                                }, g)
                            }, 16)
                        }
                    }), w(i + d, function () {
                        if (b._allowZoom()) {
                            if (clearTimeout(e), b.st.removalDelay = g, !a) {
                                if (a = b._getItemToZoom(), !a) return;
                                f = j(a)
                            }
                            f.css(b._getOffset(!0)), b.wrap.append(f), b.content.css("visibility", "hidden"), setTimeout(function () {
                                f.css(b._getOffset())
                            }, 16)
                        }
                    }), w(h + d, function () {
                        b._allowZoom() && (k(), f && f.remove(), a = null)
                    })
                }
            }, _allowZoom: function () {
                return "image" === b.currItem.type
            }, _getItemToZoom: function () {
                return b.currItem.hasSize ? b.currItem.img : !1
            }, _getOffset: function (c) {
                var d;
                d = c ? b.currItem.img : b.st.zoom.opener(b.currItem.el || b.currItem);
                var e = d.offset(), f = parseInt(d.css("padding-top"), 10), g = parseInt(d.css("padding-bottom"), 10);
                e.top -= a(window).scrollTop() - f;
                var h = {width: d.width(), height: (u ? d.innerHeight() : d[0].offsetHeight) - g - f};
                return O() ? h["-moz-transform"] = h.transform = "translate(" + e.left + "px," + e.top + "px)" : (h.left = e.left, h.top = e.top), h
            }
        }
    });
    var P = "iframe", Q = "//about:blank", R = function (a) {
        if (b.currTemplate[P]) {
            var c = b.currTemplate[P].find("iframe");
            c.length && (a || (c[0].src = Q), b.isIE8 && c.css("display", a ? "block" : "none"))
        }
    };
    a.magnificPopup.registerModule(P, {
        options: {
            markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
            srcAction: "iframe_src",
            patterns: {
                youtube: {index: "youtube.com", id: "v=", src: "//www.youtube.com/embed/%id%?autoplay=1"},
                vimeo: {index: "vimeo.com/", id: "/", src: "//player.vimeo.com/video/%id%?autoplay=1"},
                gmaps: {index: "//maps.google.", src: "%id%&output=embed"}
            }
        }, proto: {
            initIframe: function () {
                b.types.push(P), w("BeforeChange", function (a, b, c) {
                    b !== c && (b === P ? R() : c === P && R(!0))
                }), w(h + "." + P, function () {
                    R()
                })
            }, getIframe: function (c, d) {
                var e = c.src, f = b.st.iframe;
                a.each(f.patterns, function () {
                    return e.indexOf(this.index) > -1 ? (this.id && (e = "string" == typeof this.id ? e.substr(e.lastIndexOf(this.id) + this.id.length, e.length) : this.id.call(this, e)), e = this.src.replace("%id%", e), !1) : void 0
                });
                var g = {};
                return f.srcAction && (g[f.srcAction] = e), b._parseMarkup(d, g, c), b.updateStatus("ready"), d
            }
        }
    });
    var S = function (a) {
        var c = b.items.length;
        return a > c - 1 ? a - c : 0 > a ? c + a : a
    }, T = function (a, b, c) {
        return a.replace(/%curr%/gi, b + 1).replace(/%total%/gi, c)
    };
    a.magnificPopup.registerModule("gallery", {
        options: {
            enabled: !1,
            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
            preload: [0, 2],
            navigateByImgClick: !0,
            arrows: !0,
            tPrev: "Previous (Left arrow key)",
            tNext: "Next (Right arrow key)",
            tCounter: "%curr% of %total%"
        }, proto: {
            initGallery: function () {
                var c = b.st.gallery, e = ".mfp-gallery";
                return b.direction = !0, c && c.enabled ? (f += " mfp-gallery", w(m + e, function () {
                    c.navigateByImgClick && b.wrap.on("click" + e, ".mfp-img", function () {
                        return b.items.length > 1 ? (b.next(), !1) : void 0
                    }), d.on("keydown" + e, function (a) {
                        37 === a.keyCode ? b.prev() : 39 === a.keyCode && b.next()
                    })
                }), w("UpdateStatus" + e, function (a, c) {
                    c.text && (c.text = T(c.text, b.currItem.index, b.items.length))
                }), w(l + e, function (a, d, e, f) {
                    var g = b.items.length;
                    e.counter = g > 1 ? T(c.tCounter, f.index, g) : ""
                }), w("BuildControls" + e, function () {
                    if (b.items.length > 1 && c.arrows && !b.arrowLeft) {
                        var d = c.arrowMarkup,
                            e = b.arrowLeft = a(d.replace(/%title%/gi, c.tPrev).replace(/%dir%/gi, "left")).addClass(s),
                            f = b.arrowRight = a(d.replace(/%title%/gi, c.tNext).replace(/%dir%/gi, "right")).addClass(s);
                        e.click(function () {
                            b.prev()
                        }), f.click(function () {
                            b.next()
                        }), b.container.append(e.add(f))
                    }
                }), w(n + e, function () {
                    b._preloadTimeout && clearTimeout(b._preloadTimeout), b._preloadTimeout = setTimeout(function () {
                        b.preloadNearbyImages(), b._preloadTimeout = null
                    }, 16)
                }), void w(h + e, function () {
                    d.off(e), b.wrap.off("click" + e), b.arrowRight = b.arrowLeft = null
                })) : !1
            }, next: function () {
                b.direction = !0, b.index = S(b.index + 1), b.updateItemHTML()
            }, prev: function () {
                b.direction = !1, b.index = S(b.index - 1), b.updateItemHTML()
            }, goTo: function (a) {
                b.direction = a >= b.index, b.index = a, b.updateItemHTML()
            }, preloadNearbyImages: function () {
                var a, c = b.st.gallery.preload, d = Math.min(c[0], b.items.length), e = Math.min(c[1], b.items.length);
                for (a = 1; a <= (b.direction ? e : d); a++) b._preloadItem(b.index + a);
                for (a = 1; a <= (b.direction ? d : e); a++) b._preloadItem(b.index - a)
            }, _preloadItem: function (c) {
                if (c = S(c), !b.items[c].preloaded) {
                    var d = b.items[c];
                    d.parsed || (d = b.parseEl(c)), y("LazyLoad", d), "image" === d.type && (d.img = a('<img class="mfp-img" />').on("load.mfploader", function () {
                        d.hasSize = !0
                    }).on("error.mfploader", function () {
                        d.hasSize = !0, d.loadError = !0, y("LazyLoadError", d)
                    }).attr("src", d.src)), d.preloaded = !0
                }
            }
        }
    });
    var U = "retina";
    a.magnificPopup.registerModule(U, {
        options: {
            replaceSrc: function (a) {
                return a.src.replace(/\.\w+$/, function (a) {
                    return "@2x" + a
                })
            }, ratio: 1
        }, proto: {
            initRetina: function () {
                if (window.devicePixelRatio > 1) {
                    var a = b.st.retina, c = a.ratio;
                    c = isNaN(c) ? c() : c, c > 1 && (w("ImageHasSize." + U, function (a, b) {
                        b.img.css({"max-width": b.img[0].naturalWidth / c, width: "100%"})
                    }), w("ElementParse." + U, function (b, d) {
                        d.src = a.replaceSrc(d, c)
                    }))
                }
            }
        }
    }), A()
});

/* PgSlider */
(function (d, c, b, e) {
    function a(f, h, g) {
        if (h.charAt(0) === "*") {
            f[h.substring(1)] = g
        } else {
            f["-ms-" + h] = g;
            f["-webkit-" + h] = g;
            f[h] = g
        }
    }

    d.fn.precss = function (g) {
        var f = {};
        if (arguments.length === 1) {
            for (style in g) {
                if (g.hasOwnProperty(style)) {
                    a(f, style, g[style])
                }
            }
        } else {
            a(f, arguments[0], arguments[1])
        }
        this.css(f);
        return this
    }
})(jQuery, window, document);
(function (d, f, g, a) {
    var c = function (n) {
        var m = false;
        var l = "Webkit Moz ms O".split(" ");
        var o = g.createElement("div");
        var j = null;
        n = n.toLowerCase();
        if (o.style[n]) {
            m = true
        }
        if (m === false) {
            j = n.charAt(0).toUpperCase() + n.substr(1);
            for (var k = 0; k < l.length; k++) {
                if (o.style[l[k] + j] !== a) {
                    m = true;
                    break
                }
            }
        }
        return m
    };
    var i = {};
    i.animation = c("animation");
    i.transition = c("transition");
    i.transform = c("transform");
    var e = "pogoSlider";
    var b = {
        autoplayTimeout: 4000,
        autoplay: true,
        baseZindex: 1,
        displayProgess: true,
        onSlideStart: null,
        onSlideEnd: null,
        onSliderPause: null,
        onSliderResume: null,
        slideTransition: "slide",
        slideTransitionDuration: 1000,
        elementTransitionStart: 500,
        elementTransitionDuration: 1000,
        elementTransitionIn: "slideUp",
        elementTransitionOut: "slideDown",
        generateButtons: true,
        buttonPosition: "CenterHorizontal",
        generateNav: true,
        navPosition: "Bottom",
        preserveTargetSize: false,
        targetWidth: 1000,
        targetHeight: 300,
        responsive: false,
        pauseOnHover: true
    };

    function h(k, j) {
        this.element = k;
        this.$element = d(k);
        this.settings = d.extend({}, b, j);
        this.currentSlideIndex = 0;
        this.prevSlideIndex = 0;
        this.slideTimeoutId = 0;
        this.slides = [];
        this.calls = [];
        this.paused = false;
        this.navigating = false;
        this.slideStartTime = null;
        this.slideTimeRemaining = 0;
        this._init()
    }

    h.prototype = {
        _init: function () {
            var k = this;
            k.$element.find(".pogoSlider-slide").each(function () {
                var n = [];
                var o = 0;
                d(this).data("original-styles", d(this).attr("style"));
                d(this).find(".pogoSlider-slide-element").each(function () {
                    var p = parseInt(d(this).data("start")) !== a ? d(this).data("start") : k.settings.elementTransitionStart;
                    var q = parseInt(d(this).data("duration")) || k.settings.elementTransitionDuration;
                    if ((p + q) > o) {
                        o = (p + q)
                    }
                    n.push({
                        $element: d(this),
                        element: this,
                        startTime: p,
                        duration: q,
                        transitionIn: d(this).data("in") || k.settings.elementTransitionIn,
                        transitionOut: d(this).data("out") || k.settings.elementTransitionOut
                    });
                    d(this).css("opacity", 0)
                });
                var m = {
                    $element: d(this),
                    element: this,
                    transition: d(this).data("transition") || k.settings.slideTransition,
                    duration: parseInt(d(this).data("duration")) || k.settings.slideTransitionDuration,
                    elementTransitionDuration: o,
                    totalSlideDuration: k.settings.autoplayTimeout + o,
                    children: n
                };
                k.slides.push(m)
            });
            k.numSlides = k.slides.length;
            k.slides[0].$element.css("opacity", 1);
            if (k.settings.autoplay && k.settings.displayProgess) {
                k._createProgessBar()
            }
            k.$element.css("padding-bottom", (100 / (k.settings.targetWidth / k.settings.targetHeight)) + "%");
            var j = k.$element.find("img").length;
            if (j > 0) {
                var l = 0;
                k.$element.prepend('<div class="pogoSlider-loading"><div class="pogoSlider-loading-icon"></div></div>');
                k.$element.find("img").one("load", function () {
                    if (++l === j) {
                        d(".pogoSlider-loading").remove();
                        k._onSliderReady()
                    }
                }).each(function () {
                    if (this.complete) {
                        d(this).trigger("load")
                    }
                })
            } else {
                k._onSliderReady()
            }
        }, _onSliderReady: function () {
            var j = this;
            if (j.settings.autoplay) {
                j.slideStartTime = new Date();
                j.slideTimeRemaining = j.slides[0].totalSlideDuration;
                j._slideTimeout(j.slideTimeRemaining)
            }
            if (j.settings.generateButtons && j.slides.length > 1) {
                j._createDirButtons()
            }
            if (j.settings.generateNav && j.slides.length > 1) {
                j._createNavigation()
            }
            if (j.settings.preserveTargetSize) {
                j._preserveTargetSize();
                if (j.settings.responsive) {
                    d(f).on("resize", function () {
                        j._preserveTargetSize()
                    })
                }
            }
            if (j.settings.pauseOnHover) {
                j.$element.on("mouseenter", function () {
                    j.pause()
                });
                j.$element.on("mouseleave", function () {
                    j.resume()
                })
            }
            j._onSlideStart(0)
        }, _createDirButtons: function () {
            var j = this;
            j.$element.addClass("pogoSlider--dir" + j.settings.buttonPosition);
            d('<button class="pogoSlider-dir-btn pogoSlider-dir-btn--prev"></button>').appendTo(j.$element).on("click", function () {
                j.prevSlide()
            });
            d('<button class="pogoSlider-dir-btn pogoSlider-dir-btn--next"></button>').appendTo(j.$element).on("click", function () {
                j.nextSlide()
            })
        }, _createNavigation: function () {
            var j = this;
            j.$element.addClass("pogoSlider--nav" + j.settings.navPosition);
            var l = d('<ul class="pogoSlider-nav"></ul>').appendTo(j.$element);
            for (var k = 0; k < j.slides.length; k++) {
                d('<li data-num="' + k + '"><button class="pogoSlider-nav-btn"></button></li>').appendTo(l).on("click", function () {
                    j.toSlide(d(this).data("num"))
                })
            }
        }, getAppliedProps: function (o) {
            var y = g.styleSheets;
            var m = new RegExp("{(.+)}");
            o.matches = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.msMatchesSelector || o.oMatchesSelector;
            var p = o.getAttribute("style").replace(/ /g, "").split(";");
            var w = [];
            for (var q = 0; q < p.length; q++) {
                var x = p[q].split(":")[0];
                if (x && w.indexOf(x) === -1) {
                    w.push(x)
                }
            }
            for (var v in y) {
                if (y.hasOwnProperty(v)) {
                    var u = y[v].rules || y[v].cssRules;
                    for (var l in u) {
                        if (o.matches(u[l].selectorText)) {
                            var t = m.exec(u[l].cssText.replace(/ /g, ""));
                            if (t) {
                                var z = t[1].split(";");
                                for (var s = 0; s < z.length; s++) {
                                    var n = z[s].split(":")[0];
                                    if (n && w.indexOf(n) === -1) {
                                        w.push(n)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return w
        }, _preserveTargetSize: function () {
            var k = this;
            var n = new RegExp("px|%|em", "i");
            var l = new RegExp("[0-9]*.?[0-9]+");
            var j = new RegExp("px", "i");
            var m = 1;
            if (this.scaledBy) {
                m = (this.$element.width() / this.settings.targetWidth) / this.scaledBy
            } else {
                m = this.$element.width() / this.settings.targetWidth
            }
            this.scaledBy = this.$element.width() / this.settings.targetWidth;
            this.$element.find(".pogoSlider-slide-element").each(function () {
                var p = f.getComputedStyle(this);
                var r = k.getAppliedProps(this);
                var u = {};
                if (!d.data(k, "originalStyles")) {
                    d.data(k, "originalStyles", d(this).attr("style"))
                }
                for (var s = 0; s < r.length; s++) {
                    var o = p.getPropertyValue(r[s]);
                    if (n.test(o) && l.test(o)) {
                        var t = l.exec(o);
                        var q = n.exec(o);
                        if (j.test(q[0])) {
                            u[r[s]] = Math.ceil(t[0] * m) + q[0]
                        } else {
                            u[r[s]] = (t[0] * m) + q[0]
                        }
                    }
                }
                d(this).css(u)
            })
        }, _createProgessBar: function () {
            var k = "";
            k += '<div class="pogoSlider-progressBar">';
            k += '<div class="pogoSlider-progressBar-duration"></div>';
            k += "</div>";
            for (var j = 0; j < this.slides.length; j++) {
                this.slides[j].$element.prepend(k)
            }
        }, _slideTimeout: function (j) {
            var k = this;
            var l;
            l = k.slideTimeoutId = setTimeout(function () {
                if (!k.paused && l === k.slideTimeoutId) {
                    k._changeToNext()
                }
            }, j)
        }, pause: function () {
            if (this.settings.autoplay) {
                this.paused = true;
                clearTimeout(this.slideTimeoutId);
                if (this.settings.displayProgess) {
                    this.$element.find(".pogoSlider-progressBar-duration").stop(true)
                }
                this.slidePauseTime = new Date();
                this.slideTimeRemaining = this.slideTimeRemaining - ((new Date()) - this.slideStartTime);
                for (var j = 0; j < this.slides[this.currentSlideIndex].children.length; j++) {
                    this.slides[this.currentSlideIndex].children[j].$element.precss("animation-play-state", "paused")
                }
                if (this.settings.onSliderPause) {
                    this.settings.onSliderPause.apply(this)
                }
            }
        }, resume: function () {
            if (this.settings.autoplay) {
                this.paused = false;
                this.slideStartTime = new Date();
                for (var j = 0; j < this.slides[this.currentSlideIndex].children.length; j++) {
                    this.slides[this.currentSlideIndex].children[j].$element.precss("animation-play-state", "")
                }
                if (this.slideTimeRemaining > 0 && !this.navigating) {
                    if (this.settings.displayProgess) {
                        this.$element.find(".pogoSlider-progressBar-duration").animate({"width": "100%"}, this.slideTimeRemaining, "linear")
                    }
                    this._slideTimeout(this.slideTimeRemaining)
                }
                if (this.settings.onSliderResume) {
                    this.settings.onSliderResume.apply(this)
                }
            }
        }, nextSlide: function () {
            if (!this.navigating) {
                clearTimeout(this.slideTimeoutId);
                this.prevSlideIndex = this.currentSlideIndex;
                if (++this.currentSlideIndex > (this.numSlides - 1)) {
                    this.currentSlideIndex = 0
                }
                this._changeSlide(this.prevSlideIndex, this.currentSlideIndex)
            }
        }, prevSlide: function () {
            if (!this.navigating) {
                clearTimeout(this.slideTimeoutId);
                this.prevSlideIndex = this.currentSlideIndex;
                if (--this.currentSlideIndex < 0) {
                    this.currentSlideIndex = this.numSlides - 1
                }
                this._changeSlide(this.prevSlideIndex, this.currentSlideIndex)
            }
        }, toSlide: function (j) {
            if (!this.navigating) {
                clearTimeout(this.slideTimeoutId);
                if (j === this.currentSlideIndex || j > (this.slides.length - 1)) {
                    return
                }
                this.prevSlideIndex = this.currentSlideIndex;
                this.currentSlideIndex = j;
                this._changeSlide(this.prevSlideIndex, this.currentSlideIndex)
            }
        }, destroy: function () {
            this.paused = true;
            clearTimeout(this.slideTimeoutId);
            d.removeData(this.element, "plugin_" + e)
        }, _changeToNext: function () {
            this.prevSlideIndex = this.currentSlideIndex;
            if (++this.currentSlideIndex > (this.numSlides - 1)) {
                this.currentSlideIndex = 0
            }
            this._changeSlide(this.prevSlideIndex, this.currentSlideIndex)
        }, _changeSlide: function (m, o) {
            var j = this;
            var n;
            j._onSlideEnd(m);
            j.navigating = true;
            if (i.animation && i.transition && i.transform) {
                n = j.slideTransitions
            } else {
                n = j.compatSlideTransitions
            }
            var k = n[j.slides[o].transition] ? j.slides[o].transition : "slide";
            var l = n[k].apply(j, [m, o]);
            setTimeout(function () {
                if (l) {
                    l()
                }
                j.navigating = false;
                j._slideCleanup(m, false);
                j._slideElementCleanup(m);
                if (j.settings.autoplay) {
                    j._slideTimeout(j.slides[o].totalSlideDuration)
                }
                j._onSlideStart(o)
            }, j.slides[o].duration)
        }, _onSlideStart: function (k) {
            this.slides[k].$element.css("z-index", 1);
            if (this.settings.autoplay) {
                this.slideStartTime = new Date();
                this.slideTimeRemaining = this.slides[k].totalSlideDuration;
                if (this.settings.displayProgess && !this.paused) {
                    this.slides[k].$element.find(".pogoSlider-progressBar-duration").css("width", "0").animate({"width": "100%"}, this.slideTimeRemaining, "linear")
                }
            }
            if (this.slides[k].children.length > 0) {
                this._slideElementsTransitionIn(k)
            }
            if (this.paused) {
                for (var j = 0; j < this.slides[k].children.length; j++) {
                    this.slides[k].children[j].$element.precss("animation-play-state", "paused")
                }
            }
            if (this.settings.generateNav) {
                this.$element.find(".pogoSlider-nav-btn").removeClass("pogoSlider-nav-btn--selected");
                this.$element.find(".pogoSlider-nav-btn").eq(k).addClass("pogoSlider-nav-btn--selected")
            }
            if (this.settings.onSlideStart) {
                this.settings.onSlideStart.apply(this)
            }
        }, _onSlideEnd: function (l) {
            var k;
            if (this.settings.autoplay) {
                if (this.settings.displayProgess) {
                    this.slides[l].$element.find(".pogoSlider-progressBar-duration").stop(true).css("width", "0")
                }
            }
            if (this.paused) {
                k = this.slides[l].totalSlideDuration - this.slideTimeRemaining;
                for (var j = 0; j < this.slides[l].children.length;
                     j++) {
                    this.slides[l].children[j].$element.precss("animation-play-state", "")
                }
            } else {
                k = this.slides[l].totalSlideDuration - (this.slideTimeRemaining - ((new Date()) - this.slideStartTime))
            }
            if (this.slides[l].children.length > 0 && k > this.slides[l].elementTransitionDuration) {
                this._slideElementsTransitionOut(l)
            }
            if (this.settings.onSlideEnd) {
                this.settings.onSlideEnd.apply(this)
            }
        }, _slideElementsTransitionIn: function (l) {
            for (var j = 0; j < this.slides[l].children.length; j++) {
                var k = this.slides[l].children[j];
                k.$element.precss({
                    "*opacity": 1,
                    "animation-duration": k.duration + "ms",
                    "animation-delay": k.startTime + "ms"
                }).addClass("pogoSlider-animation-" + k.transitionIn + "In")
            }
        }, _slideElementsTransitionOut: function (l) {
            for (var j = 0; j < this.slides[l].children.length; j++) {
                var k = this.slides[l].children[j];
                k.$element.precss("animation-delay", "").removeClass("pogoSlider-animation-" + k.transitionIn + "In").addClass("pogoSlider-animation-" + k.transitionOut + "Out")
            }
        }, _slideCleanup: function (k, j) {
            if (this.slides[k].$element.find(".pogoSlider-slide-slice").length > 0) {
                this._removeSlideSlices(k)
            }
            this.slides[k].$element.attr("style", this.slides[k].$element.data("original-styles")).css("opacity", j ? "1" : "0")
        }, _slideElementCleanup: function (m) {
            var j = function (n, o) {
                return (o.match(/pogoSlider-(?:(?:transition)|(?:animation))(?:-[a-zA-Z0-9]+)?(?:--[a-z]+)?/gi) || []).join(" ")
            };
            var l = function (n, o) {
                return o.replace(/(?:-webkit-)?(?:-ms-)?((?:transition)|(?:animation))[^;]+;/g, "")
            };
            this.slides[m].$element.find(".pogoSlider-progressBar-duration").css("width", "0");
            for (var k = 0; k < this.slides[m].children.length; k++) {
                this.slides[m].children[k].$element.removeClass(j).attr("style", l).css("opacity", 0)
            }
        }, _createSlideSlices: function (A, q, r) {
            var p = r * q;
            var n = 100 / r;
            var l = 100 / q;
            var t = 100 * r;
            var s = 100 * q;
            var C = this.slides[A].$element;
            var B = C.attr("style");
            var m;
            if (this.paused) {
                m = this.slides[A].totalSlideDuration - this.slideTimeRemaining
            } else {
                m = this.slides[A].totalSlideDuration - (this.slideTimeRemaining - ((new Date()) - this.slideStartTime))
            }
            if (A === this.prevSlideIndex && this.slides[A].children.length > 0 && m < this.slides[A].elementTransitionDuration) {
                for (var x = 0; x < this.slides[A].children.length; x++) {
                    var k = (this.slides[A].children[x].startTime - m) + "ms";
                    this.slides[A].children[x].$element.precss("animation-delay", k)
                }
            }
            C.children().wrapAll('<div class="pogoSlider-slide-slice" style="' + "width:" + n + "%;height:" + l + "%;top:0%;left:0%;" + '"/>').wrapAll('<div class="pogoSlider-slide-slice-inner" style="' + B + "width:" + t + "%;height:" + s + "%;top:0%;left:0%;" + '"/>');
            C.attr("style", function (j, D) {
                return D.replace(/(?:background)[^;]+;/g, "")
            });
            for (var w = 0; w < p; w++) {
                var o = w % q;
                var z = Math.floor(w / q);
                var u = "width:" + n + "%;height:" + l + "%;top:" + (l * o) + "%;left:" + (n * z) + "%;";
                var v = "width:" + t + "%;height:" + s + "%;top:-" + (100 * o) + "%;left:-" + (100 * z) + "%;";
                var y = "";
                if (this.settings.preserveTargetSize) {
                    y = "background-size:" + this.$element.width() + "px " + parseFloat(this.$element.css("padding-bottom")) + "px;";
                    console.log(y)
                }
                C.find(".pogoSlider-slide-slice").last().clone(true, true).appendTo(this.slides[A].element).attr("style", u).find(".pogoSlider-slide-slice-inner").attr("style", B + v + y)
            }
        }, _removeSlideSlices: function (l) {
            var j = this;
            var k = j.slides[l].$element;
            k.attr("style", k.data("original-styles"));
            k.find(".pogoSlider-slide-slice").not(":first").remove();
            k.find(".pogoSlider-slide-slice-inner").children().unwrap();
            k.find(".pogoSlider-slide-slice").children().unwrap()
        }, _generateARandomArray: function (q) {
            var l = [];
            for (var p = 0; p < q; p++) {
                l.push(p)
            }
            for (var o = l.length - 1; o > 0; o--) {
                var n = Math.floor(Math.random() * (o + 1));
                var m = l[o];
                l[o] = l[n];
                l[n] = m
            }
            return l
        }, slideTransitions: {
            fade: function (j, l) {
                var k = this.slides[l];
                this.slides[j].$element.precss({"*opacity": "0", "transition-duration": k.duration + "ms"});
                k.$element.precss({"*opacity": "1", "transition-duration": k.duration + "ms"})
            }, slide: function (j, k) {
                var l;
                if (k === 0 && j === this.slides.length - 1) {
                    l = "slideLeft"
                } else {
                    if (j === 0 && k === this.slides.length - 1) {
                        l = "slideRight"
                    } else {
                        if (k > j) {
                            l = "slideLeft"
                        } else {
                            l = "slideRight"
                        }
                    }
                }
                return this.slideTransitions[l].apply(this, [j, k])
            }, verticalSlide: function (j, k) {
                var l;
                if (k === 0 && j === this.slides.length - 1) {
                    l = "slideUp"
                } else {
                    if (j === 0 && k === this.slides.length - 1) {
                        l = "slideDown"
                    } else {
                        if (k > j) {
                            l = "slideUp"
                        } else {
                            l = "slideDown"
                        }
                    }
                }
                return this.slideTransitions[l].apply(this, [j, k])
            }, slideLeft: function (k, m) {
                var j = this;
                var l = j.slides[m];
                j.slides[k].$element.precss("animation-duration", l.duration + "ms").addClass("pogoSlider-animation-leftOut");
                l.$element.precss({
                    "*opacity": "1",
                    "animation-duration": l.duration + "ms"
                }).addClass("pogoSlider-animation-leftIn");
                return function () {
                    j.slides[k].$element.removeClass("pogoSlider-animation-leftOut");
                    l.$element.attr("style", l.$element.data("original-styles")).css("opacity", "1").removeClass("pogoSlider-animation-leftIn")
                }
            }, slideRight: function (k, m) {
                var j = this;
                var l = j.slides[m];
                j.slides[k].$element.precss("animation-duration", l.duration + "ms").addClass("pogoSlider-animation-rightOut");
                l.$element.precss({
                    "*opacity": "1",
                    "animation-duration": l.duration + "ms"
                }).addClass("pogoSlider-animation-rightIn");
                return function () {
                    j.slides[k].$element.removeClass("pogoSlider-animation-rightOut");
                    l.$element.attr("style", l.$element.data("original-styles")).css("opacity", "1").removeClass("pogoSlider-animation-rightIn")
                }
            }, slideUp: function (k, m) {
                var j = this;
                var l = j.slides[m];
                j.slides[k].$element.precss("animation-duration", l.duration + "ms").addClass("pogoSlider-animation-upOut");
                l.$element.precss({
                    "*opacity": "1",
                    "animation-duration": l.duration + "ms"
                }).addClass("pogoSlider-animation-upIn");
                return function () {
                    j.slides[k].$element.removeClass("pogoSlider-animation-upOut");
                    l.$element.attr("style", l.$element.data("original-styles")).css("opacity", "1").removeClass("pogoSlider-animation-upIn")
                }
            }, slideDown: function (k, m) {
                var j = this;
                var l = j.slides[m];
                j.slides[k].$element.precss("animation-duration", l.duration + "ms").addClass("pogoSlider-animation-downOut");
                l.$element.precss({
                    "*opacity": "1",
                    "animation-duration": l.duration + "ms"
                }).addClass("pogoSlider-animation-downIn");
                return function () {
                    j.slides[k].$element.removeClass("pogoSlider-animation-downOut");
                    l.$element.attr("style", l.$element.data("original-styles")).css("opacity", "1").removeClass("pogoSlider-animation-downIn")
                }
            }, slideRevealLeft: function (k, m) {
                var j = this;
                var l = j.slides[m];
                j.slides[k].$element.precss({
                    "*z-index": j.settings.baseZindex + 1,
                    "animation-duration": l.duration + "ms"
                }).addClass("pogoSlider-animation-leftOut");
                l.$element.css({"opacity": 1, "z-index": j.settings.baseZindex});
                return function () {
                    j.slides[k].$element.removeClass("pogoSlider-animation-leftOut")
                }
            }, slideRevealRight: function (k, m) {
                var j = this;
                var l = j.slides[m];
                j.slides[k].$element.precss({
                    "*z-index": j.settings.baseZindex + 1,
                    "animation-duration": l.duration + "ms"
                }).addClass("pogoSlider-animation-rightOut");
                l.$element.css({"opacity": 1, "z-index": j.settings.baseZindex});
                return function () {
                    j.slides[k].$element.removeClass("pogoSlider-animation-rightOut")
                }
            }, slideOverLeft: function (j, l) {
                var k = this.slides[l];
                k.$element.precss({
                    "*opacity": "1",
                    "*z-index": this.settings.baseZindex + 1,
                    "animation-duration": k.duration + "ms"
                }).addClass("pogoSlider-animation-leftIn");
                return function () {
                    k.$element.attr("style", k.$element.data("original-styles")).css("opacity", "1").removeClass("pogoSlider-animation-leftIn")
                }
            }, slideOverRight: function (j, l) {
                var k = this.slides[l];
                k.$element.precss({
                    "*opacity": "1",
                    "*z-index": this.settings.baseZindex + 1,
                    "animation-duration": k.duration + "ms"
                }).addClass("pogoSlider-animation-rightIn");
                return function () {
                    k.$element.attr("style", k.$element.data("original-styles")).css("opacity", "1").removeClass("pogoSlider-animation-rightIn")
                }
            }, expandReveal: function (k, m) {
                var j = this;
                var l = j.slides[m];
                j.$element.css("overflow", "visible");
                j.slides[k].$element.precss({
                    "*z-index": j.settings.baseZindex + 1,
                    "animation-duration": l.duration + "ms"
                }).addClass("pogoSlider-animation-expandReveal");
                l.$element.css({"opacity": 1, "z-index": j.settings.baseZindex});
                return function () {
                    j.$element.css("overflow", "");
                    j.slides[k].$element.removeClass("pogoSlider-animation-expandReveal")
                }
            }, shrinkReveal: function (k, m) {
                var j = this;
                var l = j.slides[m];
                j.slides[k].$element.precss({
                    "*z-index": j.settings.baseZindex + 1,
                    "animation-duration": l.duration + "ms"
                }).addClass("pogoSlider-animation-shrinkReveal");
                l.$element.css({"opacity": 1, "z-index": j.settings.baseZindex});
                return function () {
                    j.slides[k].$element.removeClass("pogoSlider-animation-shrinkReveal")
                }
            }, verticalSplitReveal: function (l, n) {
                var k = this;
                var m = k.slides[n];
                k.slides[l].$element.css("z-index", k.settings.baseZindex + 1);
                m.$element.css({"opacity": 1, "z-index": k.settings.baseZindex});
                k._createSlideSlices(l, 1, 2);
                var j = k.slides[l].$element.find(".pogoSlider-slide-slice");
                j.precss("animation-duration", m.duration + "ms");
                j.eq(0).addClass("pogoSlider-animation-leftOut");
                j.eq(1).addClass("pogoSlider-animation-rightOut")
            }, horizontalSplitReveal: function (l, n) {
                var k = this;
                var m = k.slides[n];
                k.slides[l].$element.css("z-index", k.settings.baseZindex + 1);
                m.$element.css({"opacity": 1, "z-index": k.settings.baseZindex});
                k._createSlideSlices(l, 2, 1);
                var j = k.slides[l].$element.find(".pogoSlider-slide-slice");
                j.precss("animation-duration", m.duration + "ms");
                j.eq(0).addClass("pogoSlider-animation-upOut");
                j.eq(1).addClass("pogoSlider-animation-downOut")
            }, zipReveal: function (l, n) {
                var k = this;
                var m = k.slides[n];
                k.slides[l].$element.css("z-index", k.settings.baseZindex + 1);
                m.$element.css({"opacity": 1, "z-index": k.settings.baseZindex});
                k._createSlideSlices(l, 1, Math.round(k.$element.width() / 100));
                var j = k.slides[l].$element.find(".pogoSlider-slide-slice");
                j.precss("animation-duration", m.duration + "ms");
                j.each(function (o) {
                    if (o % 2 === 0) {
                        d(this).addClass("pogoSlider-animation-upOut")
                    } else {
                        d(this).addClass("pogoSlider-animation-downOut")
                    }
                })
            }, barRevealDown: function (j, k) {
                return this.slideTransitions["barReveal"].apply(this, [j, k, "down"])
            }, barRevealUp: function (j, k) {
                return this.slideTransitions["barReveal"].apply(this, [j, k, "up"])
            }, barReveal: function (o, q, n) {
                var k = this;
                var p = k.slides[q];
                k.slides[o].$element.css("z-index", k.settings.baseZindex + 1);
                p.$element.css({"opacity": 1, "z-index": k.settings.baseZindex});
                k._createSlideSlices(o, 1, Math.round(k.$element.width() / 100));
                var j = k.slides[o].$element.find(".pogoSlider-slide-slice");
                var l = p.duration / (j.length + 1);
                var m = l * 2;
                j.precss("animation-duration", m + "ms");
                j.each(function (r) {
                    if (n === "down") {
                        d(this).addClass("pogoSlider-animation-downOut").precss("animation-delay", l * r + "ms")
                    } else {
                        d(this).addClass("pogoSlider-animation-upOut").precss("animation-delay", l * r + "ms")
                    }
                })
            }, blocksReveal: function (k, j) {
                var u = this;
                var q = u.slides[j];
                var t = 0;
                if (u.settings.preserveTargetSize) {
                    t = parseFloat(u.$element.css("padding-bottom"))
                } else {
                    t = u.$element.height()
                }
                var r = Math.round(t / 100);
                var l = Math.round(u.$element.width() / 100);
                u.slides[k].$element.css("z-index", u.settings.baseZindex + 1);
                q.$element.css({"opacity": 1, "z-index": u.settings.baseZindex});
                var p = u._generateARandomArray(r * l);
                u._createSlideSlices(k, r, l);
                var n = u.slides[k].$element.find(".pogoSlider-slide-slice");
                var o = q.duration / (n.length + 1);
                var s = o * 2;
                n.precss("animation-duration", s + "ms");
                for (var m = 0; m < n.length; m++) {
                    n.eq(p.pop()).precss("animation-delay", (o * m) + "ms").addClass("pogoSlider-animation-blocksReveal")
                }
            }, fold: function (j, k) {
                var l;
                if (k === 0 && j === this.slides.length - 1) {
                    l = "foldLeft"
                } else {
                    if (j === 0 && k === this.slides.length - 1) {
                        l = "foldRight"
                    } else {
                        if (k > j) {
                            l = "foldLeft"
                        } else {
                            l = "foldRight"
                        }
                    }
                }
                return this.slideTransitions[l].apply(this, [j, k])
            }, foldRight: function (l, k) {
                var s = this;
                var q = s.slides[k];
                var m = s.slides[l];
                s.$element.css("overflow", "visible");
                m.$element.css({"overflow": "visible", "z-index": s.settings.baseZindex});
                q.$element.css({"opacity": 1, "overflow": "visible", "z-index": s.settings.baseZindex + 1});
                s._createSlideSlices(l, 1, 2);
                var r = m.$element.find(".pogoSlider-slide-slice");
                s._createSlideSlices(k, 1, 2);
                var o = s.slides[k].$element.find(".pogoSlider-slide-slice");
                var n = r.eq(0);
                var p = o.eq(0);
                var j = o.eq(1);
                q.$element.prepend(n.detach());
                m.$element.prepend(p.detach());
                n.addClass("pogoSlider-animation-foldInRight").precss("animation-duration", q.duration + "ms");
                j.addClass("pogoSlider-animation-foldOutRight").precss("animation-duration", q.duration + "ms");
                return function () {
                    s.$element.css("overflow", "");
                    q.$element.prepend(p.detach());
                    m.$element.prepend(n.detach());
                    s._slideCleanup(k, true)
                }
            }, foldLeft: function (l, k) {
                var s = this;
                var q = s.slides[k];
                var m = s.slides[l];
                s.$element.css("overflow", "visible");
                m.$element.css({"overflow": "visible", "z-index": s.settings.baseZindex});
                q.$element.css({"opacity": 1, "overflow": "visible", "z-index": s.settings.baseZindex + 1});
                s._createSlideSlices(l, 1, 2);
                var r = m.$element.find(".pogoSlider-slide-slice");
                s._createSlideSlices(k, 1, 2);
                var n = s.slides[k].$element.find(".pogoSlider-slide-slice");
                var p = r.eq(1);
                var o = n.eq(0);
                var j = n.eq(1);
                q.$element.append(p.detach());
                m.$element.append(j.detach());
                p.addClass("pogoSlider-animation-foldInLeft").precss("animation-duration", q.duration + "ms");
                o.addClass("pogoSlider-animation-foldOutLeft").precss("animation-duration", q.duration + "ms");
                return function () {
                    s.$element.css("overflow", "");
                    s._slideCleanup(k, true)
                }
            }
        }, compatSlideTransitions: {
            fade: function (j, l) {
                var k = this.slides[l];
                this.slides[j].$element.animate({opacity: 0}, k.duration);
                k.$element.animate({opacity: 1}, k.duration)
            }, slide: function (j, k) {
                var l;
                if (j > k && j === this.slides.length - 1 && k === 0) {
                    l = "slideLeft"
                } else {
                    if (j < k && j === 0 && k === this.slides.length - 1) {
                        l = "slideRight"
                    } else {
                        if (j < k) {
                            l = "slideLeft"
                        } else {
                            l = "slideRight"
                        }
                    }
                }
                return this.slideTransitions[l].apply(this, [j, k])
            }, verticalSlide: function (j, k) {
                var l;
                if (j > k && j === this.slides.length - 1 && k === 0) {
                    l = "slideUp"
                } else {
                    if (j < k && j === 0 && k === this.slides.length - 1) {
                        l = "slideDown"
                    } else {
                        if (j < k) {
                            l = "slideUp"
                        } else {
                            l = "slideDown"
                        }
                    }
                }
                return this.slideTransitions[l].apply(this, [j, k])
            }, slideLeft: function (j, l) {
                var k = this.slides[l];
                this.slides[j].$element.animate({left: "-100%"}, k.duration);
                k.$element.css({left: "100%", "opacity": 1}).animate({left: 0}, k.duration)
            }, slideRight: function (j, l) {
                var k = this.slides[l];
                this.slides[j].$element.animate({left: "100%"}, k.duration);
                k.$element.css({left: "-100%", "opacity": 1}).animate({left: 0}, k.duration)
            }, slideUp: function (j, l) {
                var k = this.slides[l];
                this.slides[j].$element.animate({top: "-100%"}, k.duration);
                k.$element.css({top: "100%", "opacity": 1}).animate({top: "0"}, k.duration)
            }, slideDown: function (j, l) {
                var k = this.slides[l];
                this.slides[j].$element.animate({top: "100%"}, k.duration);
                k.$element.css({top: "-100%", "opacity": 1}).animate({top: "0"}, k.duration)
            }, slideRevealLeft: function (j, l) {
                var k = this.slides[l];
                this.slides[j].$element.css("z-index", this.settings.baseZindex + 1).animate({left: "-100%"}, k.duration);
                k.$element.css({"opacity": 1, "z-index": this.settings.baseZindex})
            }, slideRevealRight: function (j, l) {
                var k = this.slides[l];
                this.slides[j].$element.css("z-index", this.settings.baseZindex + 1).animate({left: "100%"}, k.duration);
                k.$element.css({"opacity": 1, "z-index": this.settings.baseZindex})
            }, slideOverLeft: function (j, l) {
                var k = this.slides[l];
                k.$element.css({
                    "opacity": 1,
                    "z-index": this.settings.baseZindex,
                    "left": "100%"
                }).animate({"left": 0}, k.duration)
            }, slideOverRight: function (j, l) {
                var k = this.slides[l];
                k.$element.css({
                    "opacity": 1,
                    "z-index": this.settings.baseZindex,
                    "right": "100%"
                }).animate({"right": 0}, k.duration)
            }, expandReveal: function (j, l) {
                var k = this.slides[l];
                this.slides[j].$element.css("z-index", this.settings.baseZindex + 1).animate({
                    width: "120%",
                    height: "120%",
                    "left": "-10%",
                    "top": "-10%",
                    opacity: 0
                }, k.duration);
                k.$element.css({"opacity": 1, "z-index": this.settings.baseZindex})
            }, shrinkReveal: function (j, l) {
                var k = this.slides[l];
                this.slides[j].$element.css("z-index", this.settings.baseZindex + 1).animate({
                    width: "50%",
                    height: "50%",
                    "left": "25%",
                    "top": "25%",
                    opacity: 0
                }, k.duration);
                k.$element.css({"opacity": 1, "z-index": this.settings.baseZindex})
            }, verticalSplitReveal: function (l, n) {
                var k = this;
                var m = k.slides[n];
                k.slides[l].$element.css("z-index", k.settings.baseZindex + 1);
                m.$element.css({"opacity": 1, "z-index": k.settings.baseZindex});
                k._createSlideSlices(l, 1, 2);
                var j = k.slides[l].$element.find(".pogoSlider-slide-slice");
                j.eq(0).animate({"left": "-50%"}, m.duration);
                j.eq(1).animate({"left": "100%"}, m.duration)
            }, horizontalSplitReveal: function (l, n) {
                var k = this;
                var m = k.slides[n];
                k.slides[l].$element.css("z-index", k.settings.baseZindex + 1);
                m.$element.css({"opacity": 1, "z-index": k.settings.baseZindex});
                k._createSlideSlices(l, 2, 1);
                var j = k.slides[l].$element.find(".pogoSlider-slide-slice");
                j.eq(0).animate({"top": "-50%"}, m.duration);
                j.eq(1).animate({"top": "100%"}, m.duration)
            }, zipReveal: function (n, p) {
                var m = this;
                var o = m.slides[p];
                m.slides[n].$element.css("z-index", m.settings.baseZindex + 1);
                o.$element.css({"opacity": 1, "z-index": m.settings.baseZindex});
                m._createSlideSlices(n, 1, Math.round(m.$element.width() / 100));
                var l = m.slides[n].$element.find(".pogoSlider-slide-slice");
                var k = o.duration / (l.length + 1);
                var j = k * 2;
                l.each(function (q) {
                    if (q % 2 === 0) {
                        d(this).delay(k * q).animate({"top": "100%"}, j)
                    } else {
                        d(this).delay(k * q).animate({"top": "-100%"}, j)
                    }
                })
            }, barRevealDown: function (j, k) {
                return this.slideTransitions["barReveal"].apply(this, [j, k, "down"])
            }, barRevealUp: function (j, k) {
                return this.slideTransitions["barReveal"].apply(this, [j, k, "up"])
            }, barReveal: function (o, q, n) {
                var m = this;
                var p = m.slides[q];
                m.slides[o].$element.css("z-index", m.settings.baseZindex + 1);
                p.$element.css({"opacity": 1, "z-index": m.settings.baseZindex});
                m._createSlideSlices(o, 1, Math.round(m.$element.width() / 100));
                var l = m.slides[o].$element.find(".pogoSlider-slide-slice");
                var k = p.duration / (l.length + 1);
                var j = k * 2;
                l.each(function (r) {
                    if (n === "down") {
                        d(this).delay(k * r).animate({"top": "100%"}, j)
                    } else {
                        d(this).delay(k * r).animate({"top": "-100%"}, j)
                    }
                })
            }
        }
    };
    d.fn[e] = function (j) {
        this.each(function () {
            if (!d.data(this, "plugin_" + e)) {
                d.data(this, "plugin_" + e, new h(this, j))
            }
        });
        return this
    }
})(jQuery, window, document);



