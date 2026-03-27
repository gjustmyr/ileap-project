import {
	$ as po,
	A as et,
	Aa as C,
	B as ho,
	Ba as Ja,
	C as Va,
	Ca as Zt,
	D as Ua,
	Da as Qa,
	E as ja,
	Ea as Mr,
	F as he,
	Fa as el,
	G as $a,
	Ga as Re,
	H as te,
	Ha as $,
	I as T,
	Ia as Do,
	J as tt,
	Ja as Me,
	K as E,
	L as Ee,
	Lb as il,
	M as za,
	Ma as tl,
	N as S,
	Na as _n,
	Nb as ol,
	O as fo,
	Oa as Co,
	Ob as Et,
	P as _,
	Pa as Eo,
	Pb as sl,
	Q as y,
	Qa as nl,
	Qb as al,
	R as Sr,
	Ra as Tr,
	Rb as ll,
	S as Ha,
	Sb as ot,
	T as nt,
	U as we,
	Ua as _o,
	Ub as We,
	V as _e,
	Vb as An,
	Xb as ul,
	_ as rt,
	a as Oa,
	aa as Wt,
	ab as rl,
	b as Pa,
	ba as go,
	c as ka,
	d as so,
	da as Rr,
	e as ao,
	ea as ve,
	f as de,
	fa as qe,
	g as me,
	ga as mo,
	gb as ye,
	h as He,
	ha as Ga,
	hb as W,
	i as Q,
	ia as Ae,
	ib as Ct,
	j as D,
	ja as Cn,
	k as Dn,
	ka as qa,
	l as xa,
	la as wo,
	m as Na,
	ma as Wa,
	n as P,
	na as Yt,
	o as Ar,
	p as oe,
	pa as vo,
	q as lo,
	qa as Ya,
	r as La,
	ra as yo,
	s as uo,
	sa as Za,
	t as Ba,
	ta as En,
	u as xe,
	ua as Xa,
	v as bt,
	w as Ge,
	wa as Dt,
	x as co,
	xa as bo,
	y as Gt,
	ya as Ka,
	z as qt,
	za as Se,
	zb as it,
} from "./chunk-7LFKYCIU.js";
import { a as v, b as j, e as mf } from "./chunk-VB56BUGO.js";
var ew = mf(($e, Os) => {
	"use strict";
	(function (t, n) {
		typeof $e == "object" && typeof Os < "u"
			? (Os.exports = n())
			: typeof define == "function" && define.amd
				? define(n)
				: ((t = typeof globalThis < "u" ? globalThis : t || self),
					(t.Sweetalert2 = n()));
	})($e, function () {
		"use strict";
		function t(o, s, u) {
			if (typeof o == "function" ? o === s : o.has(s))
				return arguments.length < 3 ? s : u;
			throw new TypeError("Private element is not present on this object");
		}
		function n(o, s) {
			if (s.has(o))
				throw new TypeError(
					"Cannot initialize the same private elements twice on an object",
				);
		}
		function e(o, s) {
			return o.get(t(o, s));
		}
		function r(o, s, u) {
			(n(o, s), s.set(o, u));
		}
		function i(o, s, u) {
			return (o.set(t(o, s), u), u);
		}
		let l = 100,
			a = {},
			d = () => {
				a.previousActiveElement instanceof HTMLElement
					? (a.previousActiveElement.focus(), (a.previousActiveElement = null))
					: document.body && document.body.focus();
			},
			h = (o) =>
				new Promise((s) => {
					if (!o) return s();
					let u = window.scrollX,
						c = window.scrollY;
					((a.restoreFocusTimeout = setTimeout(() => {
						(d(), s());
					}, l)),
						window.scrollTo(u, c));
				}),
			g = "swal2-",
			f = [
				"container",
				"shown",
				"height-auto",
				"iosfix",
				"popup",
				"modal",
				"no-backdrop",
				"no-transition",
				"toast",
				"toast-shown",
				"show",
				"hide",
				"close",
				"title",
				"html-container",
				"actions",
				"confirm",
				"deny",
				"cancel",
				"footer",
				"icon",
				"icon-content",
				"image",
				"input",
				"file",
				"range",
				"select",
				"radio",
				"checkbox",
				"label",
				"textarea",
				"inputerror",
				"input-label",
				"validation-message",
				"progress-steps",
				"active-progress-step",
				"progress-step",
				"progress-step-line",
				"loader",
				"loading",
				"styled",
				"top",
				"top-start",
				"top-end",
				"top-left",
				"top-right",
				"center",
				"center-start",
				"center-end",
				"center-left",
				"center-right",
				"bottom",
				"bottom-start",
				"bottom-end",
				"bottom-left",
				"bottom-right",
				"grow-row",
				"grow-column",
				"grow-fullscreen",
				"rtl",
				"timer-progress-bar",
				"timer-progress-bar-container",
				"scrollbar-measure",
				"icon-success",
				"icon-warning",
				"icon-info",
				"icon-question",
				"icon-error",
				"draggable",
				"dragging",
			].reduce((o, s) => ((o[s] = g + s), o), {}),
			F = ["success", "warning", "info", "question", "error"].reduce(
				(o, s) => ((o[s] = g + s), o),
				{},
			),
			U = "SweetAlert2:",
			M = (o) => o.charAt(0).toUpperCase() + o.slice(1),
			b = (o) => {
				console.warn(`${U} ${typeof o == "object" ? o.join(" ") : o}`);
			},
			K = (o) => {
				console.error(`${U} ${o}`);
			},
			gt = [],
			H = (o) => {
				gt.includes(o) || (gt.push(o), b(o));
			},
			xt = (o, s = null) => {
				H(
					`"${o}" is deprecated and will be removed in the next major release.${s ? ` Use "${s}" instead.` : ""}`,
				);
			},
			Nt = (o) => (typeof o == "function" ? o() : o),
			pn = (o) => o && typeof o.toPromise == "function",
			gn = (o) => (pn(o) ? o.toPromise() : Promise.resolve(o)),
			Ui = (o) => o && Promise.resolve(o) === o,
			re = () => document.body.querySelector(`.${f.container}`),
			mn = (o) => {
				let s = re();
				return s ? s.querySelector(o) : null;
			},
			le = (o) => mn(`.${o}`),
			k = () => le(f.popup),
			Lt = () => le(f.icon),
			Vc = () => le(f["icon-content"]),
			Ps = () => le(f.title),
			ji = () => le(f["html-container"]),
			ks = () => le(f.image),
			$i = () => le(f["progress-steps"]),
			dr = () => le(f["validation-message"]),
			Pe = () => mn(`.${f.actions} .${f.confirm}`),
			Bt = () => mn(`.${f.actions} .${f.cancel}`),
			mt = () => mn(`.${f.actions} .${f.deny}`),
			Uc = () => le(f["input-label"]),
			Vt = () => mn(`.${f.loader}`),
			wn = () => le(f.actions),
			xs = () => le(f.footer),
			hr = () => le(f["timer-progress-bar"]),
			zi = () => le(f.close),
			jc = `
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`,
			Hi = () => {
				let o = k();
				if (!o) return [];
				let s = o.querySelectorAll(
						'[tabindex]:not([tabindex="-1"]):not([tabindex="0"])',
					),
					u = Array.from(s).sort((m, A) => {
						let O = parseInt(m.getAttribute("tabindex") || "0"),
							V = parseInt(A.getAttribute("tabindex") || "0");
						return O > V ? 1 : O < V ? -1 : 0;
					}),
					c = o.querySelectorAll(jc),
					p = Array.from(c).filter((m) => m.getAttribute("tabindex") !== "-1");
				return [...new Set(u.concat(p))].filter((m) => ie(m));
			},
			Gi = () =>
				ze(document.body, f.shown) &&
				!ze(document.body, f["toast-shown"]) &&
				!ze(document.body, f["no-backdrop"]),
			fr = () => {
				let o = k();
				return o ? ze(o, f.toast) : !1;
			},
			$c = () => {
				let o = k();
				return o ? o.hasAttribute("data-loading") : !1;
			},
			ue = (o, s) => {
				if (((o.textContent = ""), s)) {
					let c = new DOMParser().parseFromString(s, "text/html"),
						p = c.querySelector("head");
					p &&
						Array.from(p.childNodes).forEach((A) => {
							o.appendChild(A);
						});
					let m = c.querySelector("body");
					m &&
						Array.from(m.childNodes).forEach((A) => {
							A instanceof HTMLVideoElement || A instanceof HTMLAudioElement
								? o.appendChild(A.cloneNode(!0))
								: o.appendChild(A);
						});
				}
			},
			ze = (o, s) => {
				if (!s) return !1;
				let u = s.split(/\s+/);
				for (let c = 0; c < u.length; c++)
					if (!o.classList.contains(u[c])) return !1;
				return !0;
			},
			zc = (o, s) => {
				Array.from(o.classList).forEach((u) => {
					!Object.values(f).includes(u) &&
						!Object.values(F).includes(u) &&
						!Object.values(s.showClass || {}).includes(u) &&
						o.classList.remove(u);
				});
			},
			ce = (o, s, u) => {
				if ((zc(o, s), !s.customClass)) return;
				let c = s.customClass[u];
				if (c) {
					if (typeof c != "string" && !c.forEach) {
						b(
							`Invalid type of customClass.${u}! Expected string or iterable object, got "${typeof c}"`,
						);
						return;
					}
					x(o, c);
				}
			},
			pr = (o, s) => {
				if (!s) return null;
				switch (s) {
					case "select":
					case "textarea":
					case "file":
						return o.querySelector(`.${f.popup} > .${f[s]}`);
					case "checkbox":
						return o.querySelector(`.${f.popup} > .${f.checkbox} input`);
					case "radio":
						return (
							o.querySelector(`.${f.popup} > .${f.radio} input:checked`) ||
							o.querySelector(`.${f.popup} > .${f.radio} input:first-child`)
						);
					case "range":
						return o.querySelector(`.${f.popup} > .${f.range} input`);
					default:
						return o.querySelector(`.${f.popup} > .${f.input}`);
				}
			},
			Ns = (o) => {
				if ((o.focus(), o.type !== "file")) {
					let s = o.value;
					((o.value = ""), (o.value = s));
				}
			},
			Ls = (o, s, u) => {
				!o ||
					!s ||
					(typeof s == "string" && (s = s.split(/\s+/).filter(Boolean)),
					s.forEach((c) => {
						Array.isArray(o)
							? o.forEach((p) => {
									u ? p.classList.add(c) : p.classList.remove(c);
								})
							: u
								? o.classList.add(c)
								: o.classList.remove(c);
					}));
			},
			x = (o, s) => {
				Ls(o, s, !0);
			},
			ge = (o, s) => {
				Ls(o, s, !1);
			},
			Ke = (o, s) => {
				let u = Array.from(o.children);
				for (let c = 0; c < u.length; c++) {
					let p = u[c];
					if (p instanceof HTMLElement && ze(p, s)) return p;
				}
			},
			wt = (o, s, u) => {
				(u === `${parseInt(`${u}`)}` && (u = parseInt(u)),
					u || parseInt(`${u}`) === 0
						? o.style.setProperty(s, typeof u == "number" ? `${u}px` : u)
						: o.style.removeProperty(s));
			},
			J = (o, s = "flex") => {
				o && (o.style.display = s);
			},
			ee = (o) => {
				o && (o.style.display = "none");
			},
			qi = (o, s = "block") => {
				o &&
					new MutationObserver(() => {
						vn(o, o.innerHTML, s);
					}).observe(o, { childList: !0, subtree: !0 });
			},
			Bs = (o, s, u, c) => {
				let p = o.querySelector(s);
				p && p.style.setProperty(u, c);
			},
			vn = (o, s, u = "flex") => {
				s ? J(o, u) : ee(o);
			},
			ie = (o) =>
				!!(o && (o.offsetWidth || o.offsetHeight || o.getClientRects().length)),
			Hc = () => !ie(Pe()) && !ie(mt()) && !ie(Bt()),
			Wi = (o) => o.scrollHeight > o.clientHeight,
			Gc = (o, s) => {
				let u = o;
				for (; u && u !== s; ) {
					if (Wi(u)) return !0;
					u = u.parentElement;
				}
				return !1;
			},
			Vs = (o) => {
				let s = window.getComputedStyle(o),
					u = parseFloat(s.getPropertyValue("animation-duration") || "0"),
					c = parseFloat(s.getPropertyValue("transition-duration") || "0");
				return u > 0 || c > 0;
			},
			Yi = (o, s = !1) => {
				let u = hr();
				u &&
					ie(u) &&
					(s && ((u.style.transition = "none"), (u.style.width = "100%")),
					setTimeout(() => {
						((u.style.transition = `width ${o / 1e3}s linear`),
							(u.style.width = "0%"));
					}, 10));
			},
			qc = () => {
				let o = hr();
				if (!o) return;
				let s = parseInt(window.getComputedStyle(o).width);
				(o.style.removeProperty("transition"), (o.style.width = "100%"));
				let u = parseInt(window.getComputedStyle(o).width),
					c = (s / u) * 100;
				o.style.width = `${c}%`;
			},
			Wc = () => typeof window > "u" || typeof document > "u",
			Yc = `
 <div aria-labelledby="${f.title}" aria-describedby="${f["html-container"]}" class="${f.popup}" tabindex="-1">
   <button type="button" class="${f.close}"></button>
   <ul class="${f["progress-steps"]}"></ul>
   <div class="${f.icon}"></div>
   <img class="${f.image}" />
   <h2 class="${f.title}" id="${f.title}"></h2>
   <div class="${f["html-container"]}" id="${f["html-container"]}"></div>
   <input class="${f.input}" id="${f.input}" />
   <input type="file" class="${f.file}" />
   <div class="${f.range}">
     <input type="range" />
     <output></output>
   </div>
   <select class="${f.select}" id="${f.select}"></select>
   <div class="${f.radio}"></div>
   <label class="${f.checkbox}">
     <input type="checkbox" id="${f.checkbox}" />
     <span class="${f.label}"></span>
   </label>
   <textarea class="${f.textarea}" id="${f.textarea}"></textarea>
   <div class="${f["validation-message"]}" id="${f["validation-message"]}"></div>
   <div class="${f.actions}">
     <div class="${f.loader}"></div>
     <button type="button" class="${f.confirm}"></button>
     <button type="button" class="${f.deny}"></button>
     <button type="button" class="${f.cancel}"></button>
   </div>
   <div class="${f.footer}"></div>
   <div class="${f["timer-progress-bar-container"]}">
     <div class="${f["timer-progress-bar"]}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g, ""),
			Zc = () => {
				let o = re();
				return o
					? (o.remove(),
						ge(
							[document.documentElement, document.body],
							[f["no-backdrop"], f["toast-shown"], f["has-column"]],
						),
						!0)
					: !1;
			},
			vt = () => {
				a.currentInstance && a.currentInstance.resetValidationMessage();
			},
			Xc = () => {
				let o = k();
				if (!o) return;
				let s = Ke(o, f.input),
					u = Ke(o, f.file),
					c = o.querySelector(`.${f.range} input`),
					p = o.querySelector(`.${f.range} output`),
					m = Ke(o, f.select),
					A = o.querySelector(`.${f.checkbox} input`),
					O = Ke(o, f.textarea);
				(s && (s.oninput = vt),
					u && (u.onchange = vt),
					m && (m.onchange = vt),
					A && (A.onchange = vt),
					O && (O.oninput = vt),
					c &&
						p &&
						((c.oninput = () => {
							(vt(), (p.value = c.value));
						}),
						(c.onchange = () => {
							(vt(), (p.value = c.value));
						})));
			},
			Kc = (o) => {
				if (typeof o == "string") {
					let s = document.querySelector(o);
					if (!s) throw new Error(`Target element "${o}" not found`);
					return s;
				}
				return o;
			},
			Jc = (o) => {
				let s = k();
				s &&
					(s.setAttribute("role", o.toast ? "alert" : "dialog"),
					s.setAttribute("aria-live", o.toast ? "polite" : "assertive"),
					o.toast || s.setAttribute("aria-modal", "true"));
			},
			Qc = (o) => {
				window.getComputedStyle(o).direction === "rtl" &&
					(x(re(), f.rtl), (a.isRTL = !0));
			},
			ed = (o) => {
				let s = Zc();
				if (Wc()) {
					K("SweetAlert2 requires document to initialize");
					return;
				}
				let u = document.createElement("div");
				((u.className = f.container),
					s && x(u, f["no-transition"]),
					ue(u, Yc),
					(u.dataset.swal2Theme = o.theme));
				let c = Kc(o.target || "body");
				(c.appendChild(u),
					o.topLayer && (u.setAttribute("popover", ""), u.showPopover()),
					Jc(o),
					Qc(c),
					Xc());
			},
			Zi = (o, s) => {
				o instanceof HTMLElement
					? s.appendChild(o)
					: typeof o == "object"
						? td(o, s)
						: o && ue(s, o);
			},
			td = (o, s) => {
				"jquery" in o ? nd(s, o) : ue(s, o.toString());
			},
			nd = (o, s) => {
				if (((o.textContent = ""), 0 in s))
					for (let u = 0; u in s; u++) o.appendChild(s[u].cloneNode(!0));
				else o.appendChild(s.cloneNode(!0));
			},
			rd = (o, s) => {
				let u = wn(),
					c = Vt();
				!u ||
					!c ||
					(!s.showConfirmButton && !s.showDenyButton && !s.showCancelButton
						? ee(u)
						: J(u),
					ce(u, s, "actions"),
					id(u, c, s),
					ue(c, s.loaderHtml || ""),
					ce(c, s, "loader"));
			};
		function id(o, s, u) {
			let c = Pe(),
				p = mt(),
				m = Bt();
			!c ||
				!p ||
				!m ||
				(Ki(c, "confirm", u),
				Ki(p, "deny", u),
				Ki(m, "cancel", u),
				od(c, p, m, u),
				u.reverseButtons &&
					(u.toast
						? (o.insertBefore(m, c), o.insertBefore(p, c))
						: (o.insertBefore(m, s),
							o.insertBefore(p, s),
							o.insertBefore(c, s))));
		}
		function od(o, s, u, c) {
			if (!c.buttonsStyling) {
				ge([o, s, u], f.styled);
				return;
			}
			(x([o, s, u], f.styled),
				c.confirmButtonColor &&
					o.style.setProperty(
						"--swal2-confirm-button-background-color",
						c.confirmButtonColor,
					),
				c.denyButtonColor &&
					s.style.setProperty(
						"--swal2-deny-button-background-color",
						c.denyButtonColor,
					),
				c.cancelButtonColor &&
					u.style.setProperty(
						"--swal2-cancel-button-background-color",
						c.cancelButtonColor,
					),
				Xi(o),
				Xi(s),
				Xi(u));
		}
		function Xi(o) {
			let s = window.getComputedStyle(o);
			if (s.getPropertyValue("--swal2-action-button-focus-box-shadow")) return;
			let u = s.backgroundColor.replace(
				/rgba?\((\d+), (\d+), (\d+).*/,
				"rgba($1, $2, $3, 0.5)",
			);
			o.style.setProperty(
				"--swal2-action-button-focus-box-shadow",
				s.getPropertyValue("--swal2-outline").replace(/ rgba\(.*/, ` ${u}`),
			);
		}
		function Ki(o, s, u) {
			let c = M(s);
			(vn(o, u[`show${c}Button`], "inline-block"),
				ue(o, u[`${s}ButtonText`] || ""),
				o.setAttribute("aria-label", u[`${s}ButtonAriaLabel`] || ""),
				(o.className = f[s]),
				ce(o, u, `${s}Button`));
		}
		let sd = (o, s) => {
				let u = zi();
				u &&
					(ue(u, s.closeButtonHtml || ""),
					ce(u, s, "closeButton"),
					vn(u, s.showCloseButton),
					u.setAttribute("aria-label", s.closeButtonAriaLabel || ""));
			},
			ad = (o, s) => {
				let u = re();
				u &&
					(ld(u, s.backdrop),
					ud(u, s.position),
					cd(u, s.grow),
					ce(u, s, "container"));
			};
		function ld(o, s) {
			typeof s == "string"
				? (o.style.background = s)
				: s || x([document.documentElement, document.body], f["no-backdrop"]);
		}
		function ud(o, s) {
			s &&
				(s in f
					? x(o, f[s])
					: (b('The "position" parameter is not valid, defaulting to "center"'),
						x(o, f.center)));
		}
		function cd(o, s) {
			s && x(o, f[`grow-${s}`]);
		}
		var N = {
			innerParams: new WeakMap(),
			domCache: new WeakMap(),
			focusedElement: new WeakMap(),
		};
		let dd = [
				"input",
				"file",
				"range",
				"select",
				"radio",
				"checkbox",
				"textarea",
			],
			hd = (o, s) => {
				let u = k();
				if (!u) return;
				let c = N.innerParams.get(o),
					p = !c || s.input !== c.input;
				(dd.forEach((m) => {
					let A = Ke(u, f[m]);
					A && (gd(m, s.inputAttributes), (A.className = f[m]), p && ee(A));
				}),
					s.input && (p && fd(s), md(s)));
			},
			fd = (o) => {
				if (!o.input) return;
				if (!G[o.input]) {
					K(
						`Unexpected type of input! Expected ${Object.keys(G).join(" | ")}, got "${o.input}"`,
					);
					return;
				}
				let s = Us(o.input);
				if (!s) return;
				let u = G[o.input](s, o);
				(J(s),
					o.inputAutoFocus &&
						setTimeout(() => {
							Ns(u);
						}));
			},
			pd = (o) => {
				for (let s = 0; s < o.attributes.length; s++) {
					let u = o.attributes[s].name;
					["id", "type", "value", "style"].includes(u) || o.removeAttribute(u);
				}
			},
			gd = (o, s) => {
				let u = k();
				if (!u) return;
				let c = pr(u, o);
				if (c) {
					pd(c);
					for (let p in s) c.setAttribute(p, s[p]);
				}
			},
			md = (o) => {
				if (!o.input) return;
				let s = Us(o.input);
				s && ce(s, o, "input");
			},
			Ji = (o, s) => {
				!o.placeholder &&
					s.inputPlaceholder &&
					(o.placeholder = s.inputPlaceholder);
			},
			yn = (o, s, u) => {
				if (u.inputLabel) {
					let c = document.createElement("label"),
						p = f["input-label"];
					(c.setAttribute("for", o.id),
						(c.className = p),
						typeof u.customClass == "object" && x(c, u.customClass.inputLabel),
						(c.innerText = u.inputLabel),
						s.insertAdjacentElement("beforebegin", c));
				}
			},
			Us = (o) => {
				let s = k();
				if (s) return Ke(s, f[o] || f.input);
			},
			gr = (o, s) => {
				["string", "number"].includes(typeof s)
					? (o.value = `${s}`)
					: Ui(s) ||
						b(
							`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof s}"`,
						);
			},
			G = {};
		((G.text =
			G.email =
			G.password =
			G.number =
			G.tel =
			G.url =
			G.search =
			G.date =
			G["datetime-local"] =
			G.time =
			G.week =
			G.month =
				(o, s) => {
					let u = o;
					return (
						gr(u, s.inputValue),
						yn(u, u, s),
						Ji(u, s),
						(u.type = s.input),
						u
					);
				}),
			(G.file = (o, s) => {
				let u = o;
				return (yn(u, u, s), Ji(u, s), u);
			}),
			(G.range = (o, s) => {
				let u = o,
					c = u.querySelector("input"),
					p = u.querySelector("output");
				return (
					c && (gr(c, s.inputValue), (c.type = s.input), yn(c, o, s)),
					p && gr(p, s.inputValue),
					o
				);
			}),
			(G.select = (o, s) => {
				let u = o;
				if (((u.textContent = ""), s.inputPlaceholder)) {
					let c = document.createElement("option");
					(ue(c, s.inputPlaceholder),
						(c.value = ""),
						(c.disabled = !0),
						(c.selected = !0),
						u.appendChild(c));
				}
				return (yn(u, u, s), u);
			}),
			(G.radio = (o) => {
				let s = o;
				return ((s.textContent = ""), o);
			}),
			(G.checkbox = (o, s) => {
				let u = k();
				if (!u) throw new Error("Popup not found");
				let c = pr(u, "checkbox");
				if (!c) throw new Error("Checkbox input not found");
				((c.value = "1"), (c.checked = !!s.inputValue));
				let m = o.querySelector("span");
				if (m) {
					let A = s.inputPlaceholder || s.inputLabel;
					A && ue(m, A);
				}
				return c;
			}),
			(G.textarea = (o, s) => {
				let u = o;
				(gr(u, s.inputValue), Ji(u, s), yn(u, u, s));
				let c = (p) =>
					parseInt(window.getComputedStyle(p).marginLeft) +
					parseInt(window.getComputedStyle(p).marginRight);
				return (
					setTimeout(() => {
						if ("MutationObserver" in window) {
							let p = k();
							if (!p) return;
							let m = parseInt(window.getComputedStyle(p).width),
								A = () => {
									if (!document.body.contains(u)) return;
									let O = u.offsetWidth + c(u),
										V = k();
									V &&
										(O > m
											? (V.style.width = `${O}px`)
											: wt(V, "width", s.width));
								};
							new MutationObserver(A).observe(u, {
								attributes: !0,
								attributeFilter: ["style"],
							});
						}
					}),
					u
				);
			}));
		let wd = (o, s) => {
				let u = ji();
				u &&
					(qi(u),
					ce(u, s, "htmlContainer"),
					s.html
						? (Zi(s.html, u), J(u, "block"))
						: s.text
							? ((u.textContent = s.text), J(u, "block"))
							: ee(u),
					hd(o, s));
			},
			vd = (o, s) => {
				let u = xs();
				u &&
					(qi(u),
					vn(u, !!s.footer, "block"),
					s.footer && Zi(s.footer, u),
					ce(u, s, "footer"));
			},
			yd = (o, s) => {
				let u = N.innerParams.get(o),
					c = Lt();
				if (!c) return;
				if (u && s.icon === u.icon) {
					(zs(c, s), js(c, s));
					return;
				}
				if (!s.icon && !s.iconHtml) {
					ee(c);
					return;
				}
				if (s.icon && Object.keys(F).indexOf(s.icon) === -1) {
					(K(
						`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${s.icon}"`,
					),
						ee(c));
					return;
				}
				(J(c),
					zs(c, s),
					js(c, s),
					x(c, s.showClass && s.showClass.icon),
					window
						.matchMedia("(prefers-color-scheme: dark)")
						.addEventListener("change", $s));
			},
			js = (o, s) => {
				for (let [u, c] of Object.entries(F)) s.icon !== u && ge(o, c);
				(x(o, s.icon && F[s.icon]), Cd(o, s), $s(), ce(o, s, "icon"));
			},
			$s = () => {
				let o = k();
				if (!o) return;
				let s = window.getComputedStyle(o).getPropertyValue("background-color"),
					u = o.querySelectorAll(
						"[class^=swal2-success-circular-line], .swal2-success-fix",
					);
				for (let c = 0; c < u.length; c++) u[c].style.backgroundColor = s;
			},
			bd = (o) => `
  ${o.animation ? '<div class="swal2-success-circular-line-left"></div>' : ""}
  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
  <div class="swal2-success-ring"></div>
  ${o.animation ? '<div class="swal2-success-fix"></div>' : ""}
  ${o.animation ? '<div class="swal2-success-circular-line-right"></div>' : ""}
`,
			Dd = `
  <span class="swal2-x-mark">
    <span class="swal2-x-mark-line-left"></span>
    <span class="swal2-x-mark-line-right"></span>
  </span>
`,
			zs = (o, s) => {
				if (!s.icon && !s.iconHtml) return;
				let u = o.innerHTML,
					c = "";
				(s.iconHtml
					? (c = Hs(s.iconHtml))
					: s.icon === "success"
						? ((c = bd(s)), (u = u.replace(/ style=".*?"/g, "")))
						: s.icon === "error"
							? (c = Dd)
							: s.icon &&
								(c = Hs({ question: "?", warning: "!", info: "i" }[s.icon])),
					u.trim() !== c.trim() && ue(o, c));
			},
			Cd = (o, s) => {
				if (s.iconColor) {
					((o.style.color = s.iconColor), (o.style.borderColor = s.iconColor));
					for (let u of [
						".swal2-success-line-tip",
						".swal2-success-line-long",
						".swal2-x-mark-line-left",
						".swal2-x-mark-line-right",
					])
						Bs(o, u, "background-color", s.iconColor);
					Bs(o, ".swal2-success-ring", "border-color", s.iconColor);
				}
			},
			Hs = (o) => `<div class="${f["icon-content"]}">${o}</div>`,
			Ed = (o, s) => {
				let u = ks();
				if (u) {
					if (!s.imageUrl) {
						ee(u);
						return;
					}
					(J(u, ""),
						u.setAttribute("src", s.imageUrl),
						u.setAttribute("alt", s.imageAlt || ""),
						wt(u, "width", s.imageWidth),
						wt(u, "height", s.imageHeight),
						(u.className = f.image),
						ce(u, s, "image"));
				}
			},
			Qi = !1,
			Gs = 0,
			qs = 0,
			Ws = 0,
			Ys = 0,
			_d = (o) => {
				(o.addEventListener("mousedown", mr),
					document.body.addEventListener("mousemove", wr),
					o.addEventListener("mouseup", vr),
					o.addEventListener("touchstart", mr),
					document.body.addEventListener("touchmove", wr),
					o.addEventListener("touchend", vr));
			},
			Ad = (o) => {
				(o.removeEventListener("mousedown", mr),
					document.body.removeEventListener("mousemove", wr),
					o.removeEventListener("mouseup", vr),
					o.removeEventListener("touchstart", mr),
					document.body.removeEventListener("touchmove", wr),
					o.removeEventListener("touchend", vr));
			},
			mr = (o) => {
				let s = k();
				if (!s) return;
				let u = Lt();
				if (o.target === s || (u && u.contains(o.target))) {
					Qi = !0;
					let c = Zs(o);
					((Gs = c.clientX),
						(qs = c.clientY),
						(Ws = parseInt(s.style.insetInlineStart) || 0),
						(Ys = parseInt(s.style.insetBlockStart) || 0),
						x(s, "swal2-dragging"));
				}
			},
			wr = (o) => {
				let s = k();
				if (s && Qi) {
					let { clientX: u, clientY: c } = Zs(o),
						p = u - Gs;
					((s.style.insetInlineStart = `${Ws + (a.isRTL ? -p : p)}px`),
						(s.style.insetBlockStart = `${Ys + (c - qs)}px`));
				}
			},
			vr = () => {
				let o = k();
				((Qi = !1), ge(o, "swal2-dragging"));
			},
			Zs = (o) => {
				let s = 0,
					u = 0;
				return (
					o.type.startsWith("mouse")
						? ((s = o.clientX), (u = o.clientY))
						: o.type.startsWith("touch") &&
							((s = o.touches[0].clientX), (u = o.touches[0].clientY)),
					{ clientX: s, clientY: u }
				);
			},
			Sd = (o, s) => {
				let u = re(),
					c = k();
				if (!(!u || !c)) {
					if (s.toast) {
						(wt(u, "width", s.width), (c.style.width = "100%"));
						let p = Vt();
						p && c.insertBefore(p, Lt());
					} else wt(c, "width", s.width);
					(wt(c, "padding", s.padding),
						s.color && (c.style.color = s.color),
						s.background && (c.style.background = s.background),
						ee(dr()),
						Rd(c, s),
						s.draggable && !s.toast
							? (x(c, f.draggable), _d(c))
							: (ge(c, f.draggable), Ad(c)));
				}
			},
			Rd = (o, s) => {
				let u = s.showClass || {};
				((o.className = `${f.popup} ${ie(o) ? u.popup : ""}`),
					s.toast
						? (x([document.documentElement, document.body], f["toast-shown"]),
							x(o, f.toast))
						: x(o, f.modal),
					ce(o, s, "popup"),
					typeof s.customClass == "string" && x(o, s.customClass),
					s.icon && x(o, f[`icon-${s.icon}`]));
			},
			Md = (o, s) => {
				let u = $i();
				if (!u) return;
				let { progressSteps: c, currentProgressStep: p } = s;
				if (!c || c.length === 0 || p === void 0) {
					ee(u);
					return;
				}
				(J(u),
					(u.textContent = ""),
					p >= c.length &&
						b(
							"Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)",
						),
					c.forEach((m, A) => {
						let O = Td(m);
						if (
							(u.appendChild(O),
							A === p && x(O, f["active-progress-step"]),
							A !== c.length - 1)
						) {
							let V = Id(s);
							u.appendChild(V);
						}
					}));
			},
			Td = (o) => {
				let s = document.createElement("li");
				return (x(s, f["progress-step"]), ue(s, o), s);
			},
			Id = (o) => {
				let s = document.createElement("li");
				return (
					x(s, f["progress-step-line"]),
					o.progressStepsDistance && wt(s, "width", o.progressStepsDistance),
					s
				);
			},
			Fd = (o, s) => {
				let u = Ps();
				u &&
					(qi(u),
					vn(u, !!(s.title || s.titleText), "block"),
					s.title && Zi(s.title, u),
					s.titleText && (u.innerText = s.titleText),
					ce(u, s, "title"));
			},
			Xs = (o, s) => {
				var u;
				(Sd(o, s),
					ad(o, s),
					Md(o, s),
					yd(o, s),
					Ed(o, s),
					Fd(o, s),
					sd(o, s),
					wd(o, s),
					rd(o, s),
					vd(o, s));
				let c = k();
				(typeof s.didRender == "function" && c && s.didRender(c),
					(u = a.eventEmitter) === null ||
						u === void 0 ||
						u.emit("didRender", c));
			},
			Od = () => ie(k()),
			Ks = () => {
				var o;
				return (o = Pe()) === null || o === void 0 ? void 0 : o.click();
			},
			Pd = () => {
				var o;
				return (o = mt()) === null || o === void 0 ? void 0 : o.click();
			},
			kd = () => {
				var o;
				return (o = Bt()) === null || o === void 0 ? void 0 : o.click();
			},
			Ut = Object.freeze({
				cancel: "cancel",
				backdrop: "backdrop",
				close: "close",
				esc: "esc",
				timer: "timer",
			}),
			Js = (o) => {
				if (o.keydownTarget && o.keydownHandlerAdded && o.keydownHandler) {
					let s = o.keydownHandler;
					(o.keydownTarget.removeEventListener("keydown", s, {
						capture: o.keydownListenerCapture,
					}),
						(o.keydownHandlerAdded = !1));
				}
			},
			xd = (o, s, u) => {
				if ((Js(o), !s.toast)) {
					let c = (m) => Ld(s, m, u);
					o.keydownHandler = c;
					let p = s.keydownListenerCapture ? window : k();
					if (p) {
						((o.keydownTarget = p),
							(o.keydownListenerCapture = s.keydownListenerCapture));
						let m = c;
						(o.keydownTarget.addEventListener("keydown", m, {
							capture: o.keydownListenerCapture,
						}),
							(o.keydownHandlerAdded = !0));
					}
				}
			},
			eo = (o, s) => {
				var u;
				let c = Hi();
				if (c.length) {
					((o = o + s),
						o === -2 && (o = c.length - 1),
						o === c.length ? (o = 0) : o === -1 && (o = c.length - 1),
						c[o].focus());
					return;
				}
				(u = k()) === null || u === void 0 || u.focus();
			},
			Qs = ["ArrowRight", "ArrowDown"],
			Nd = ["ArrowLeft", "ArrowUp"],
			Ld = (o, s, u) => {
				o &&
					(s.isComposing ||
						s.keyCode === 229 ||
						(o.stopKeydownPropagation && s.stopPropagation(),
						s.key === "Enter"
							? Bd(s, o)
							: s.key === "Tab"
								? Vd(s)
								: [...Qs, ...Nd].includes(s.key)
									? Ud(s.key)
									: s.key === "Escape" && jd(s, o, u)));
			},
			Bd = (o, s) => {
				if (!Nt(s.allowEnterKey)) return;
				let u = k();
				if (!u || !s.input) return;
				let c = pr(u, s.input);
				if (
					o.target &&
					c &&
					o.target instanceof HTMLElement &&
					o.target.outerHTML === c.outerHTML
				) {
					if (["textarea", "file"].includes(s.input)) return;
					(Ks(), o.preventDefault());
				}
			},
			Vd = (o) => {
				let s = o.target,
					u = Hi(),
					c = -1;
				for (let p = 0; p < u.length; p++)
					if (s === u[p]) {
						c = p;
						break;
					}
				(o.shiftKey ? eo(c, -1) : eo(c, 1),
					o.stopPropagation(),
					o.preventDefault());
			},
			Ud = (o) => {
				let s = wn(),
					u = Pe(),
					c = mt(),
					p = Bt();
				if (!s || !u || !c || !p) return;
				let m = [u, c, p];
				if (
					document.activeElement instanceof HTMLElement &&
					!m.includes(document.activeElement)
				)
					return;
				let A = Qs.includes(o)
						? "nextElementSibling"
						: "previousElementSibling",
					O = document.activeElement;
				if (O) {
					for (let V = 0; V < s.children.length; V++) {
						if (((O = O[A]), !O)) return;
						if (O instanceof HTMLButtonElement && ie(O)) break;
					}
					O instanceof HTMLButtonElement && O.focus();
				}
			},
			jd = (o, s, u) => {
				(o.preventDefault(), Nt(s.allowEscapeKey) && u(Ut.esc));
			};
		var jt = {
			swalPromiseResolve: new WeakMap(),
			swalPromiseReject: new WeakMap(),
		};
		let $d = () => {
				let o = re();
				Array.from(document.body.children).forEach((u) => {
					u.contains(o) ||
						(u.hasAttribute("aria-hidden") &&
							u.setAttribute(
								"data-previous-aria-hidden",
								u.getAttribute("aria-hidden") || "",
							),
						u.setAttribute("aria-hidden", "true"));
				});
			},
			ea = () => {
				Array.from(document.body.children).forEach((s) => {
					s.hasAttribute("data-previous-aria-hidden")
						? (s.setAttribute(
								"aria-hidden",
								s.getAttribute("data-previous-aria-hidden") || "",
							),
							s.removeAttribute("data-previous-aria-hidden"))
						: s.removeAttribute("aria-hidden");
				});
			},
			ta = typeof window < "u" && !!window.GestureEvent,
			zd = () => {
				if (ta && !ze(document.body, f.iosfix)) {
					let o = document.body.scrollTop;
					((document.body.style.top = `${o * -1}px`),
						x(document.body, f.iosfix),
						Hd());
				}
			},
			Hd = () => {
				let o = re();
				if (!o) return;
				let s;
				((o.ontouchstart = (u) => {
					s = Gd(u);
				}),
					(o.ontouchmove = (u) => {
						s && (u.preventDefault(), u.stopPropagation());
					}));
			},
			Gd = (o) => {
				let s = o.target,
					u = re(),
					c = ji();
				return !u || !c || qd(o) || Wd(o)
					? !1
					: s === u ||
							(!Wi(u) &&
								s instanceof HTMLElement &&
								!Gc(s, c) &&
								s.tagName !== "INPUT" &&
								s.tagName !== "TEXTAREA" &&
								!(Wi(c) && c.contains(s)));
			},
			qd = (o) =>
				!!(
					o.touches &&
					o.touches.length &&
					o.touches[0].touchType === "stylus"
				),
			Wd = (o) => o.touches && o.touches.length > 1,
			Yd = () => {
				if (ze(document.body, f.iosfix)) {
					let o = parseInt(document.body.style.top, 10);
					(ge(document.body, f.iosfix),
						(document.body.style.top = ""),
						(document.body.scrollTop = o * -1));
				}
			},
			Zd = () => {
				let o = document.createElement("div");
				((o.className = f["scrollbar-measure"]), document.body.appendChild(o));
				let s = o.getBoundingClientRect().width - o.clientWidth;
				return (document.body.removeChild(o), s);
			},
			$t = null,
			Xd = (o) => {
				$t === null &&
					(document.body.scrollHeight > window.innerHeight || o === "scroll") &&
					(($t = parseInt(
						window
							.getComputedStyle(document.body)
							.getPropertyValue("padding-right"),
					)),
					(document.body.style.paddingRight = `${$t + Zd()}px`));
			},
			Kd = () => {
				$t !== null &&
					((document.body.style.paddingRight = `${$t}px`), ($t = null));
			};
		function na(o, s, u, c) {
			(fr() ? ia(o, c) : (h(u).then(() => ia(o, c)), Js(a)),
				ta
					? (s.setAttribute("style", "display:none !important"),
						s.removeAttribute("class"),
						(s.innerHTML = ""))
					: s.remove(),
				Gi() && (Kd(), Yd(), ea()),
				Jd());
		}
		function Jd() {
			ge(
				[document.documentElement, document.body],
				[f.shown, f["height-auto"], f["no-backdrop"], f["toast-shown"]],
			);
		}
		function Je(o) {
			o = eh(o);
			let s = jt.swalPromiseResolve.get(this),
				u = Qd(this);
			this.isAwaitingPromise ? o.isDismissed || (bn(this), s(o)) : u && s(o);
		}
		let Qd = (o) => {
			let s = k();
			if (!s) return !1;
			let u = N.innerParams.get(o);
			if (!u || ze(s, u.hideClass.popup)) return !1;
			(ge(s, u.showClass.popup), x(s, u.hideClass.popup));
			let c = re();
			return (
				ge(c, u.showClass.backdrop),
				x(c, u.hideClass.backdrop),
				th(o, s, u),
				!0
			);
		};
		function ra(o) {
			let s = jt.swalPromiseReject.get(this);
			(bn(this), s && s(o));
		}
		let bn = (o) => {
				o.isAwaitingPromise &&
					(delete o.isAwaitingPromise, N.innerParams.get(o) || o._destroy());
			},
			eh = (o) =>
				typeof o > "u"
					? { isConfirmed: !1, isDenied: !1, isDismissed: !0 }
					: Object.assign(
							{ isConfirmed: !1, isDenied: !1, isDismissed: !1 },
							o,
						),
			th = (o, s, u) => {
				var c;
				let p = re(),
					m = Vs(s);
				(typeof u.willClose == "function" && u.willClose(s),
					(c = a.eventEmitter) === null ||
						c === void 0 ||
						c.emit("willClose", s),
					m && p
						? nh(o, s, p, !!u.returnFocus, u.didClose)
						: p && na(o, p, !!u.returnFocus, u.didClose));
			},
			nh = (o, s, u, c, p) => {
				a.swalCloseEventFinishedCallback = na.bind(null, o, u, c, p);
				let m = function (A) {
					if (A.target === s) {
						var O;
						((O = a.swalCloseEventFinishedCallback) === null ||
							O === void 0 ||
							O.call(a),
							delete a.swalCloseEventFinishedCallback,
							s.removeEventListener("animationend", m),
							s.removeEventListener("transitionend", m));
					}
				};
				(s.addEventListener("animationend", m),
					s.addEventListener("transitionend", m));
			},
			ia = (o, s) => {
				setTimeout(() => {
					var u;
					(typeof s == "function" && s.bind(o.params)(),
						(u = a.eventEmitter) === null || u === void 0 || u.emit("didClose"),
						o._destroy && o._destroy());
				});
			},
			zt = (o) => {
				let s = k();
				if ((s || new _r(), (s = k()), !s)) return;
				let u = Vt();
				(fr() ? ee(Lt()) : rh(s, o),
					J(u),
					s.setAttribute("data-loading", "true"),
					s.setAttribute("aria-busy", "true"),
					s.focus());
			},
			rh = (o, s) => {
				let u = wn(),
					c = Vt();
				!u ||
					!c ||
					(!s && ie(Pe()) && (s = Pe()),
					J(u),
					s &&
						(ee(s),
						c.setAttribute("data-button-to-replace", s.className),
						u.insertBefore(c, s)),
					x([o, u], f.loading));
			},
			ih = (o, s) => {
				s.input === "select" || s.input === "radio"
					? uh(o, s)
					: ["text", "email", "number", "tel", "textarea"].some(
							(u) => u === s.input,
						) &&
						(pn(s.inputValue) || Ui(s.inputValue)) &&
						(zt(Pe()), ch(o, s));
			},
			oh = (o, s) => {
				let u = o.getInput();
				if (!u) return null;
				switch (s.input) {
					case "checkbox":
						return sh(u);
					case "radio":
						return ah(u);
					case "file":
						return lh(u);
					default:
						return s.inputAutoTrim ? u.value.trim() : u.value;
				}
			},
			sh = (o) => (o.checked ? 1 : 0),
			ah = (o) => (o.checked ? o.value : null),
			lh = (o) =>
				o.files && o.files.length
					? o.getAttribute("multiple") !== null
						? o.files
						: o.files[0]
					: null,
			uh = (o, s) => {
				let u = k();
				if (!u) return;
				let c = (p) => {
					s.input === "select"
						? dh(u, yr(p), s)
						: s.input === "radio" && hh(u, yr(p), s);
				};
				pn(s.inputOptions) || Ui(s.inputOptions)
					? (zt(Pe()),
						gn(s.inputOptions).then((p) => {
							(o.hideLoading(), c(p));
						}))
					: typeof s.inputOptions == "object"
						? c(s.inputOptions)
						: K(
								`Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof s.inputOptions}`,
							);
			},
			ch = (o, s) => {
				let u = o.getInput();
				u &&
					(ee(u),
					gn(s.inputValue)
						.then((c) => {
							((u.value =
								s.input === "number" ? `${parseFloat(c) || 0}` : `${c}`),
								J(u),
								u.focus(),
								o.hideLoading());
						})
						.catch((c) => {
							(K(`Error in inputValue promise: ${c}`),
								(u.value = ""),
								J(u),
								u.focus(),
								o.hideLoading());
						}));
			};
		function dh(o, s, u) {
			let c = Ke(o, f.select);
			if (!c) return;
			let p = (m, A, O) => {
				let V = document.createElement("option");
				((V.value = O),
					ue(V, A),
					(V.selected = oa(O, u.inputValue)),
					m.appendChild(V));
			};
			(s.forEach((m) => {
				let A = m[0],
					O = m[1];
				if (Array.isArray(O)) {
					let V = document.createElement("optgroup");
					((V.label = A),
						(V.disabled = !1),
						c.appendChild(V),
						O.forEach((Ht) => p(V, Ht[1], Ht[0])));
				} else p(c, O, A);
			}),
				c.focus());
		}
		function hh(o, s, u) {
			let c = Ke(o, f.radio);
			if (!c) return;
			s.forEach((m) => {
				let A = m[0],
					O = m[1],
					V = document.createElement("input"),
					Ht = document.createElement("label");
				((V.type = "radio"),
					(V.name = f.radio),
					(V.value = A),
					oa(A, u.inputValue) && (V.checked = !0));
				let oo = document.createElement("span");
				(ue(oo, O),
					(oo.className = f.label),
					Ht.appendChild(V),
					Ht.appendChild(oo),
					c.appendChild(Ht));
			});
			let p = c.querySelectorAll("input");
			p.length && p[0].focus();
		}
		let yr = (o) => {
				let s = [];
				return (
					o instanceof Map
						? o.forEach((u, c) => {
								let p = u;
								(typeof p == "object" && (p = yr(p)), s.push([c, p]));
							})
						: Object.keys(o).forEach((u) => {
								let c = o[u];
								(typeof c == "object" && (c = yr(c)), s.push([u, c]));
							}),
					s
				);
			},
			oa = (o, s) =>
				!!s && s !== null && s !== void 0 && s.toString() === o.toString(),
			fh = (o) => {
				let s = N.innerParams.get(o);
				(o.disableButtons(), s.input ? sa(o, "confirm") : no(o, !0));
			},
			ph = (o) => {
				let s = N.innerParams.get(o);
				(o.disableButtons(),
					s.returnInputValueOnDeny ? sa(o, "deny") : to(o, !1));
			},
			gh = (o, s) => {
				(o.disableButtons(), s(Ut.cancel));
			},
			sa = (o, s) => {
				let u = N.innerParams.get(o);
				if (!u.input) {
					K(
						`The "input" parameter is needed to be set when using returnInputValueOn${M(s)}`,
					);
					return;
				}
				let c = o.getInput(),
					p = oh(o, u);
				u.inputValidator
					? mh(o, p, s)
					: c && !c.checkValidity()
						? (o.enableButtons(),
							o.showValidationMessage(
								u.validationMessage || c.validationMessage,
							))
						: s === "deny"
							? to(o, p)
							: no(o, p);
			},
			mh = (o, s, u) => {
				let c = N.innerParams.get(o);
				(o.disableInput(),
					Promise.resolve()
						.then(() => gn(c.inputValidator(s, c.validationMessage)))
						.then((m) => {
							(o.enableButtons(),
								o.enableInput(),
								m
									? o.showValidationMessage(m)
									: u === "deny"
										? to(o, s)
										: no(o, s));
						}));
			},
			to = (o, s) => {
				let u = N.innerParams.get(o);
				(u.showLoaderOnDeny && zt(mt()),
					u.preDeny
						? ((o.isAwaitingPromise = !0),
							Promise.resolve()
								.then(() => gn(u.preDeny(s, u.validationMessage)))
								.then((p) => {
									p === !1
										? (o.hideLoading(), bn(o))
										: o.close({ isDenied: !0, value: typeof p > "u" ? s : p });
								})
								.catch((p) => la(o, p)))
						: o.close({ isDenied: !0, value: s }));
			},
			aa = (o, s) => {
				o.close({ isConfirmed: !0, value: s });
			},
			la = (o, s) => {
				o.rejectPromise(s);
			},
			no = (o, s) => {
				let u = N.innerParams.get(o);
				(u.showLoaderOnConfirm && zt(),
					u.preConfirm
						? (o.resetValidationMessage(),
							(o.isAwaitingPromise = !0),
							Promise.resolve()
								.then(() => gn(u.preConfirm(s, u.validationMessage)))
								.then((p) => {
									ie(dr()) || p === !1
										? (o.hideLoading(), bn(o))
										: aa(o, typeof p > "u" ? s : p);
								})
								.catch((p) => la(o, p)))
						: aa(o, s));
			};
		function br() {
			let o = N.innerParams.get(this);
			if (!o) return;
			let s = N.domCache.get(this);
			(ee(s.loader),
				fr() ? o.icon && J(Lt()) : wh(s),
				ge([s.popup, s.actions], f.loading),
				s.popup.removeAttribute("aria-busy"),
				s.popup.removeAttribute("data-loading"),
				(s.confirmButton.disabled = !1),
				(s.denyButton.disabled = !1),
				(s.cancelButton.disabled = !1));
			let u = N.focusedElement.get(this);
			u instanceof HTMLElement && (u.focus(), N.focusedElement.delete(this));
		}
		let wh = (o) => {
			let s = o.loader.getAttribute("data-button-to-replace"),
				u = s ? o.popup.getElementsByClassName(s) : [];
			u.length ? J(u[0], "inline-block") : Hc() && ee(o.actions);
		};
		function ua() {
			let o = N.innerParams.get(this),
				s = N.domCache.get(this);
			return s ? pr(s.popup, o.input) : null;
		}
		function ca(o, s, u) {
			let c = N.domCache.get(o);
			s.forEach((p) => {
				c[p].disabled = u;
			});
		}
		function da(o, s) {
			let u = k();
			if (!(!u || !o))
				if (o.type === "radio") {
					let c = u.querySelectorAll(`[name="${f.radio}"]`);
					for (let p = 0; p < c.length; p++) c[p].disabled = s;
				} else o.disabled = s;
		}
		function ha() {
			ca(this, ["confirmButton", "denyButton", "cancelButton"], !1);
			let o = N.focusedElement.get(this);
			o instanceof HTMLElement && (o.focus(), N.focusedElement.delete(this));
		}
		function fa() {
			(N.focusedElement.set(this, document.activeElement),
				ca(this, ["confirmButton", "denyButton", "cancelButton"], !0));
		}
		function pa() {
			da(this.getInput(), !1);
		}
		function ga() {
			da(this.getInput(), !0);
		}
		function ma(o) {
			let s = N.domCache.get(this),
				u = N.innerParams.get(this);
			(ue(s.validationMessage, o),
				(s.validationMessage.className = f["validation-message"]),
				u.customClass &&
					u.customClass.validationMessage &&
					x(s.validationMessage, u.customClass.validationMessage),
				J(s.validationMessage));
			let c = this.getInput();
			c &&
				(c.setAttribute("aria-invalid", "true"),
				c.setAttribute("aria-describedby", f["validation-message"]),
				Ns(c),
				x(c, f.inputerror));
		}
		function wa() {
			let o = N.domCache.get(this);
			o.validationMessage && ee(o.validationMessage);
			let s = this.getInput();
			s &&
				(s.removeAttribute("aria-invalid"),
				s.removeAttribute("aria-describedby"),
				ge(s, f.inputerror));
		}
		let Qe = {
				title: "",
				titleText: "",
				text: "",
				html: "",
				footer: "",
				icon: void 0,
				iconColor: void 0,
				iconHtml: void 0,
				template: void 0,
				toast: !1,
				draggable: !1,
				animation: !0,
				theme: "light",
				showClass: {
					popup: "swal2-show",
					backdrop: "swal2-backdrop-show",
					icon: "swal2-icon-show",
				},
				hideClass: {
					popup: "swal2-hide",
					backdrop: "swal2-backdrop-hide",
					icon: "swal2-icon-hide",
				},
				customClass: {},
				target: "body",
				color: void 0,
				backdrop: !0,
				heightAuto: !0,
				allowOutsideClick: !0,
				allowEscapeKey: !0,
				allowEnterKey: !0,
				stopKeydownPropagation: !0,
				keydownListenerCapture: !1,
				showConfirmButton: !0,
				showDenyButton: !1,
				showCancelButton: !1,
				preConfirm: void 0,
				preDeny: void 0,
				confirmButtonText: "OK",
				confirmButtonAriaLabel: "",
				confirmButtonColor: void 0,
				denyButtonText: "No",
				denyButtonAriaLabel: "",
				denyButtonColor: void 0,
				cancelButtonText: "Cancel",
				cancelButtonAriaLabel: "",
				cancelButtonColor: void 0,
				buttonsStyling: !0,
				reverseButtons: !1,
				focusConfirm: !0,
				focusDeny: !1,
				focusCancel: !1,
				returnFocus: !0,
				showCloseButton: !1,
				closeButtonHtml: "&times;",
				closeButtonAriaLabel: "Close this dialog",
				loaderHtml: "",
				showLoaderOnConfirm: !1,
				showLoaderOnDeny: !1,
				imageUrl: void 0,
				imageWidth: void 0,
				imageHeight: void 0,
				imageAlt: "",
				timer: void 0,
				timerProgressBar: !1,
				width: void 0,
				padding: void 0,
				background: void 0,
				input: void 0,
				inputPlaceholder: "",
				inputLabel: "",
				inputValue: "",
				inputOptions: {},
				inputAutoFocus: !0,
				inputAutoTrim: !0,
				inputAttributes: {},
				inputValidator: void 0,
				returnInputValueOnDeny: !1,
				validationMessage: void 0,
				grow: !1,
				position: "center",
				progressSteps: [],
				currentProgressStep: void 0,
				progressStepsDistance: void 0,
				willOpen: void 0,
				didOpen: void 0,
				didRender: void 0,
				willClose: void 0,
				didClose: void 0,
				didDestroy: void 0,
				scrollbarPadding: !0,
				topLayer: !1,
			},
			vh = [
				"allowEscapeKey",
				"allowOutsideClick",
				"background",
				"buttonsStyling",
				"cancelButtonAriaLabel",
				"cancelButtonColor",
				"cancelButtonText",
				"closeButtonAriaLabel",
				"closeButtonHtml",
				"color",
				"confirmButtonAriaLabel",
				"confirmButtonColor",
				"confirmButtonText",
				"currentProgressStep",
				"customClass",
				"denyButtonAriaLabel",
				"denyButtonColor",
				"denyButtonText",
				"didClose",
				"didDestroy",
				"draggable",
				"footer",
				"hideClass",
				"html",
				"icon",
				"iconColor",
				"iconHtml",
				"imageAlt",
				"imageHeight",
				"imageUrl",
				"imageWidth",
				"preConfirm",
				"preDeny",
				"progressSteps",
				"returnFocus",
				"reverseButtons",
				"showCancelButton",
				"showCloseButton",
				"showConfirmButton",
				"showDenyButton",
				"text",
				"title",
				"titleText",
				"theme",
				"willClose",
			],
			yh = { allowEnterKey: void 0 },
			bh = [
				"allowOutsideClick",
				"allowEnterKey",
				"backdrop",
				"draggable",
				"focusConfirm",
				"focusDeny",
				"focusCancel",
				"returnFocus",
				"heightAuto",
				"keydownListenerCapture",
			],
			va = (o) => Object.prototype.hasOwnProperty.call(Qe, o),
			ya = (o) => vh.indexOf(o) !== -1,
			ba = (o) => yh[o],
			Dh = (o) => {
				va(o) || b(`Unknown parameter "${o}"`);
			},
			Ch = (o) => {
				bh.includes(o) && b(`The parameter "${o}" is incompatible with toasts`);
			},
			Eh = (o) => {
				let s = ba(o);
				s && xt(o, s);
			},
			Da = (o) => {
				(o.backdrop === !1 &&
					o.allowOutsideClick &&
					b(
						'"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`',
					),
					o.theme &&
						![
							"light",
							"dark",
							"auto",
							"minimal",
							"borderless",
							"bootstrap-4",
							"bootstrap-4-light",
							"bootstrap-4-dark",
							"bootstrap-5",
							"bootstrap-5-light",
							"bootstrap-5-dark",
							"material-ui",
							"material-ui-light",
							"material-ui-dark",
							"embed-iframe",
							"bulma",
							"bulma-light",
							"bulma-dark",
						].includes(o.theme) &&
						b(`Invalid theme "${o.theme}"`));
				for (let s in o) (Dh(s), o.toast && Ch(s), Eh(s));
			};
		function Ca(o) {
			let s = re(),
				u = k(),
				c = N.innerParams.get(this);
			if (!u || ze(u, c.hideClass.popup)) {
				b(
					"You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.",
				);
				return;
			}
			let p = _h(o),
				m = Object.assign({}, c, p);
			(Da(m),
				s && (s.dataset.swal2Theme = m.theme),
				Xs(this, m),
				N.innerParams.set(this, m),
				Object.defineProperties(this, {
					params: {
						value: Object.assign({}, this.params, o),
						writable: !1,
						enumerable: !0,
					},
				}));
		}
		let _h = (o) => {
			let s = {};
			return (
				Object.keys(o).forEach((u) => {
					if (ya(u)) {
						let c = o;
						s[u] = c[u];
					} else b(`Invalid parameter to update: ${u}`);
				}),
				s
			);
		};
		function Ea() {
			var o;
			let s = N.domCache.get(this),
				u = N.innerParams.get(this);
			if (!u) {
				_a(this);
				return;
			}
			(s.popup &&
				a.swalCloseEventFinishedCallback &&
				(a.swalCloseEventFinishedCallback(),
				delete a.swalCloseEventFinishedCallback),
				typeof u.didDestroy == "function" && u.didDestroy(),
				(o = a.eventEmitter) === null || o === void 0 || o.emit("didDestroy"),
				Ah(this));
		}
		let Ah = (o) => {
				(_a(o),
					delete o.params,
					delete a.keydownHandler,
					delete a.keydownTarget,
					delete a.currentInstance);
			},
			_a = (o) => {
				o.isAwaitingPromise
					? (ro(N, o), (o.isAwaitingPromise = !0))
					: (ro(jt, o),
						ro(N, o),
						delete o.isAwaitingPromise,
						delete o.disableButtons,
						delete o.enableButtons,
						delete o.getInput,
						delete o.disableInput,
						delete o.enableInput,
						delete o.hideLoading,
						delete o.disableLoading,
						delete o.showValidationMessage,
						delete o.resetValidationMessage,
						delete o.close,
						delete o.closePopup,
						delete o.closeModal,
						delete o.closeToast,
						delete o.rejectPromise,
						delete o.update,
						delete o._destroy);
			},
			ro = (o, s) => {
				for (let u in o) o[u].delete(s);
			};
		var Sh = Object.freeze({
			__proto__: null,
			_destroy: Ea,
			close: Je,
			closeModal: Je,
			closePopup: Je,
			closeToast: Je,
			disableButtons: fa,
			disableInput: ga,
			disableLoading: br,
			enableButtons: ha,
			enableInput: pa,
			getInput: ua,
			handleAwaitingPromise: bn,
			hideLoading: br,
			rejectPromise: ra,
			resetValidationMessage: wa,
			showValidationMessage: ma,
			update: Ca,
		});
		let Rh = (o, s, u) => {
				o.toast ? Mh(o, s, u) : (Ih(s), Fh(s), Oh(o, s, u));
			},
			Mh = (o, s, u) => {
				s.popup.onclick = () => {
					(o && (Th(o) || o.timer || o.input)) || u(Ut.close);
				};
			},
			Th = (o) =>
				!!(
					o.showConfirmButton ||
					o.showDenyButton ||
					o.showCancelButton ||
					o.showCloseButton
				),
			Dr = !1,
			Ih = (o) => {
				o.popup.onmousedown = () => {
					o.container.onmouseup = function (s) {
						((o.container.onmouseup = () => {}),
							s.target === o.container && (Dr = !0));
					};
				};
			},
			Fh = (o) => {
				o.container.onmousedown = (s) => {
					(s.target === o.container && s.preventDefault(),
						(o.popup.onmouseup = function (u) {
							((o.popup.onmouseup = () => {}),
								(u.target === o.popup ||
									(u.target instanceof HTMLElement &&
										o.popup.contains(u.target))) &&
									(Dr = !0));
						}));
				};
			},
			Oh = (o, s, u) => {
				s.container.onclick = (c) => {
					if (Dr) {
						Dr = !1;
						return;
					}
					c.target === s.container && Nt(o.allowOutsideClick) && u(Ut.backdrop);
				};
			},
			Ph = (o) => typeof o == "object" && o !== null && "jquery" in o,
			Aa = (o) => o instanceof Element || Ph(o),
			kh = (o) => {
				let s = {};
				return (
					typeof o[0] == "object" && !Aa(o[0])
						? Object.assign(s, o[0])
						: ["title", "html", "icon"].forEach((u, c) => {
								let p = o[c];
								typeof p == "string" || Aa(p)
									? (s[u] = p)
									: p !== void 0 &&
										K(
											`Unexpected type of ${u}! Expected "string" or "Element", got ${typeof p}`,
										);
							}),
					s
				);
			};
		function xh(...o) {
			return new this(...o);
		}
		function Nh(o) {
			class s extends this {
				_main(c, p) {
					return super._main(c, Object.assign({}, o, p));
				}
			}
			return s;
		}
		let Lh = () => a.timeout && a.timeout.getTimerLeft(),
			Sa = () => {
				if (a.timeout) return (qc(), a.timeout.stop());
			},
			Ra = () => {
				if (a.timeout) {
					let o = a.timeout.start();
					return (Yi(o), o);
				}
			},
			Bh = () => {
				let o = a.timeout;
				return o && (o.running ? Sa() : Ra());
			},
			Vh = (o) => {
				if (a.timeout) {
					let s = a.timeout.increase(o);
					return (Yi(s, !0), s);
				}
			},
			Uh = () => !!(a.timeout && a.timeout.isRunning()),
			Ma = !1,
			io = {};
		function jh(o = "data-swal-template") {
			((io[o] = this),
				Ma || (document.body.addEventListener("click", $h), (Ma = !0)));
		}
		let $h = (o) => {
			for (let s = o.target; s && s !== document; s = s.parentNode)
				for (let u in io) {
					let c = s.getAttribute && s.getAttribute(u);
					if (c) {
						io[u].fire({ template: c });
						return;
					}
				}
		};
		class zh {
			constructor() {
				this.events = {};
			}
			_getHandlersByEventName(s) {
				return (
					typeof this.events[s] > "u" && (this.events[s] = []),
					this.events[s]
				);
			}
			on(s, u) {
				let c = this._getHandlersByEventName(s);
				c.includes(u) || c.push(u);
			}
			once(s, u) {
				let c = (...p) => {
					(this.removeListener(s, c), u.apply(this, p));
				};
				this.on(s, c);
			}
			emit(s, ...u) {
				this._getHandlersByEventName(s).forEach((c) => {
					try {
						c.apply(this, u);
					} catch (p) {
						console.error(p);
					}
				});
			}
			removeListener(s, u) {
				let c = this._getHandlersByEventName(s),
					p = c.indexOf(u);
				p > -1 && c.splice(p, 1);
			}
			removeAllListeners(s) {
				this.events[s] !== void 0 && (this.events[s].length = 0);
			}
			reset() {
				this.events = {};
			}
		}
		a.eventEmitter = new zh();
		var Hh = Object.freeze({
			__proto__: null,
			argsToParams: kh,
			bindClickHandler: jh,
			clickCancel: kd,
			clickConfirm: Ks,
			clickDeny: Pd,
			enableLoading: zt,
			fire: xh,
			getActions: wn,
			getCancelButton: Bt,
			getCloseButton: zi,
			getConfirmButton: Pe,
			getContainer: re,
			getDenyButton: mt,
			getFocusableElements: Hi,
			getFooter: xs,
			getHtmlContainer: ji,
			getIcon: Lt,
			getIconContent: Vc,
			getImage: ks,
			getInputLabel: Uc,
			getLoader: Vt,
			getPopup: k,
			getProgressSteps: $i,
			getTimerLeft: Lh,
			getTimerProgressBar: hr,
			getTitle: Ps,
			getValidationMessage: dr,
			increaseTimer: Vh,
			isDeprecatedParameter: ba,
			isLoading: $c,
			isTimerRunning: Uh,
			isUpdatableParameter: ya,
			isValidParameter: va,
			isVisible: Od,
			mixin: Nh,
			off: (o, s) => {
				if (a.eventEmitter) {
					if (!o) {
						a.eventEmitter.reset();
						return;
					}
					s
						? a.eventEmitter.removeListener(o, s)
						: a.eventEmitter.removeAllListeners(o);
				}
			},
			on: (o, s) => {
				a.eventEmitter && a.eventEmitter.on(o, s);
			},
			once: (o, s) => {
				a.eventEmitter && a.eventEmitter.once(o, s);
			},
			resumeTimer: Ra,
			showLoading: zt,
			stopTimer: Sa,
			toggleTimer: Bh,
		});
		class Gh {
			constructor(s, u) {
				((this.callback = s),
					(this.remaining = u),
					(this.running = !1),
					this.start());
			}
			start() {
				return (
					this.running ||
						((this.running = !0),
						(this.started = new Date()),
						(this.id = setTimeout(this.callback, this.remaining))),
					this.remaining
				);
			}
			stop() {
				return (
					this.started &&
						this.running &&
						((this.running = !1),
						clearTimeout(this.id),
						(this.remaining -= new Date().getTime() - this.started.getTime())),
					this.remaining
				);
			}
			increase(s) {
				let u = this.running;
				return (
					u && this.stop(),
					(this.remaining += s),
					u && this.start(),
					this.remaining
				);
			}
			getTimerLeft() {
				return (this.running && (this.stop(), this.start()), this.remaining);
			}
			isRunning() {
				return this.running;
			}
		}
		let Ta = ["swal-title", "swal-html", "swal-footer"],
			qh = (o) => {
				let s =
					typeof o.template == "string"
						? document.querySelector(o.template)
						: o.template;
				if (!s) return {};
				let u = s.content;
				return (
					ef(u),
					Object.assign(Wh(u), Yh(u), Zh(u), Xh(u), Kh(u), Jh(u), Qh(u, Ta))
				);
			},
			Wh = (o) => {
				let s = {};
				return (
					Array.from(o.querySelectorAll("swal-param")).forEach((c) => {
						yt(c, ["name", "value"]);
						let p = c.getAttribute("name"),
							m = c.getAttribute("value");
						!p ||
							!m ||
							(p in Qe && typeof Qe[p] == "boolean"
								? (s[p] = m !== "false")
								: p in Qe && typeof Qe[p] == "object"
									? (s[p] = JSON.parse(m))
									: (s[p] = m));
					}),
					s
				);
			},
			Yh = (o) => {
				let s = {};
				return (
					Array.from(o.querySelectorAll("swal-function-param")).forEach((c) => {
						let p = c.getAttribute("name"),
							m = c.getAttribute("value");
						!p || !m || (s[p] = new Function(`return ${m}`)());
					}),
					s
				);
			},
			Zh = (o) => {
				let s = {};
				return (
					Array.from(o.querySelectorAll("swal-button")).forEach((c) => {
						yt(c, ["type", "color", "aria-label"]);
						let p = c.getAttribute("type");
						if (!(!p || !["confirm", "cancel", "deny"].includes(p))) {
							if (
								((s[`${p}ButtonText`] = c.innerHTML),
								(s[`show${M(p)}Button`] = !0),
								c.hasAttribute("color"))
							) {
								let m = c.getAttribute("color");
								m !== null && (s[`${p}ButtonColor`] = m);
							}
							if (c.hasAttribute("aria-label")) {
								let m = c.getAttribute("aria-label");
								m !== null && (s[`${p}ButtonAriaLabel`] = m);
							}
						}
					}),
					s
				);
			},
			Xh = (o) => {
				let s = {},
					u = o.querySelector("swal-image");
				return (
					u &&
						(yt(u, ["src", "width", "height", "alt"]),
						u.hasAttribute("src") &&
							(s.imageUrl = u.getAttribute("src") || void 0),
						u.hasAttribute("width") &&
							(s.imageWidth = u.getAttribute("width") || void 0),
						u.hasAttribute("height") &&
							(s.imageHeight = u.getAttribute("height") || void 0),
						u.hasAttribute("alt") &&
							(s.imageAlt = u.getAttribute("alt") || void 0)),
					s
				);
			},
			Kh = (o) => {
				let s = {},
					u = o.querySelector("swal-icon");
				return (
					u &&
						(yt(u, ["type", "color"]),
						u.hasAttribute("type") && (s.icon = u.getAttribute("type")),
						u.hasAttribute("color") && (s.iconColor = u.getAttribute("color")),
						(s.iconHtml = u.innerHTML)),
					s
				);
			},
			Jh = (o) => {
				let s = {},
					u = o.querySelector("swal-input");
				u &&
					(yt(u, ["type", "label", "placeholder", "value"]),
					(s.input = u.getAttribute("type") || "text"),
					u.hasAttribute("label") && (s.inputLabel = u.getAttribute("label")),
					u.hasAttribute("placeholder") &&
						(s.inputPlaceholder = u.getAttribute("placeholder")),
					u.hasAttribute("value") && (s.inputValue = u.getAttribute("value")));
				let c = Array.from(o.querySelectorAll("swal-input-option"));
				return (
					c.length &&
						((s.inputOptions = {}),
						c.forEach((p) => {
							yt(p, ["value"]);
							let m = p.getAttribute("value");
							if (!m) return;
							let A = p.innerHTML;
							s.inputOptions[m] = A;
						})),
					s
				);
			},
			Qh = (o, s) => {
				let u = {};
				for (let c in s) {
					let p = s[c],
						m = o.querySelector(p);
					m && (yt(m, []), (u[p.replace(/^swal-/, "")] = m.innerHTML.trim()));
				}
				return u;
			},
			ef = (o) => {
				let s = Ta.concat([
					"swal-param",
					"swal-function-param",
					"swal-button",
					"swal-image",
					"swal-icon",
					"swal-input",
					"swal-input-option",
				]);
				Array.from(o.children).forEach((u) => {
					let c = u.tagName.toLowerCase();
					s.includes(c) || b(`Unrecognized element <${c}>`);
				});
			},
			yt = (o, s) => {
				Array.from(o.attributes).forEach((u) => {
					s.indexOf(u.name) === -1 &&
						b([
							`Unrecognized attribute "${u.name}" on <${o.tagName.toLowerCase()}>.`,
							`${s.length ? `Allowed attributes are: ${s.join(", ")}` : "To set the value, use HTML within the element."}`,
						]);
				});
			},
			Ia = 10,
			tf = (o) => {
				var s, u;
				let c = re(),
					p = k();
				if (!c || !p) return;
				(typeof o.willOpen == "function" && o.willOpen(p),
					(s = a.eventEmitter) === null ||
						s === void 0 ||
						s.emit("willOpen", p));
				let A = window.getComputedStyle(document.body).overflowY;
				if (
					(of(c, p, o),
					setTimeout(() => {
						nf(c, p);
					}, Ia),
					Gi() &&
						(rf(c, o.scrollbarPadding !== void 0 ? o.scrollbarPadding : !1, A),
						$d()),
					!fr() &&
						!a.previousActiveElement &&
						(a.previousActiveElement = document.activeElement),
					typeof o.didOpen == "function")
				) {
					let O = o.didOpen;
					setTimeout(() => O(p));
				}
				(u = a.eventEmitter) === null || u === void 0 || u.emit("didOpen", p);
			},
			Cr = (o) => {
				let s = k();
				if (!s || o.target !== s) return;
				let u = re();
				u &&
					(s.removeEventListener("animationend", Cr),
					s.removeEventListener("transitionend", Cr),
					(u.style.overflowY = "auto"),
					ge(u, f["no-transition"]));
			},
			nf = (o, s) => {
				Vs(s)
					? ((o.style.overflowY = "hidden"),
						s.addEventListener("animationend", Cr),
						s.addEventListener("transitionend", Cr))
					: (o.style.overflowY = "auto");
			},
			rf = (o, s, u) => {
				(zd(),
					s && u !== "hidden" && Xd(u),
					setTimeout(() => {
						o.scrollTop = 0;
					}));
			},
			of = (o, s, u) => {
				var c;
				((c = u.showClass) !== null &&
					c !== void 0 &&
					c.backdrop &&
					x(o, u.showClass.backdrop),
					u.animation
						? (s.style.setProperty("opacity", "0", "important"),
							J(s, "grid"),
							setTimeout(() => {
								var p;
								((p = u.showClass) !== null &&
									p !== void 0 &&
									p.popup &&
									x(s, u.showClass.popup),
									s.style.removeProperty("opacity"));
							}, Ia))
						: J(s, "grid"),
					x([document.documentElement, document.body], f.shown),
					u.heightAuto &&
						u.backdrop &&
						!u.toast &&
						x([document.documentElement, document.body], f["height-auto"]));
			};
		var Fa = {
			email: (o, s) =>
				/^[a-zA-Z0-9.+_'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/.test(o)
					? Promise.resolve()
					: Promise.resolve(s || "Invalid email address"),
			url: (o, s) =>
				/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(
					o,
				)
					? Promise.resolve()
					: Promise.resolve(s || "Invalid URL"),
		};
		function sf(o) {
			o.inputValidator ||
				(o.input === "email" && (o.inputValidator = Fa.email),
				o.input === "url" && (o.inputValidator = Fa.url));
		}
		function af(o) {
			(!o.target ||
				(typeof o.target == "string" && !document.querySelector(o.target)) ||
				(typeof o.target != "string" && !o.target.appendChild)) &&
				(b('Target parameter is not valid, defaulting to "body"'),
				(o.target = "body"));
		}
		function lf(o) {
			(sf(o),
				o.showLoaderOnConfirm &&
					!o.preConfirm &&
					b(`showLoaderOnConfirm is set to true, but preConfirm is not defined.
showLoaderOnConfirm should be used together with preConfirm, see usage example:
https://sweetalert2.github.io/#ajax-request`),
				af(o),
				typeof o.title == "string" &&
					(o.title = o.title
						.split(
							`
`,
						)
						.join("<br />")),
				ed(o));
		}
		let ke;
		var Er = new WeakMap();
		class q {
			constructor(...s) {
				if (
					(r(
						this,
						Er,
						Promise.resolve({ isConfirmed: !1, isDenied: !1, isDismissed: !0 }),
					),
					typeof window > "u")
				)
					return;
				ke = this;
				let u = Object.freeze(this.constructor.argsToParams(s));
				((this.params = u),
					(this.isAwaitingPromise = !1),
					i(Er, this, this._main(ke.params)));
			}
			_main(s, u = {}) {
				if ((Da(Object.assign({}, u, s)), a.currentInstance)) {
					let m = jt.swalPromiseResolve.get(a.currentInstance),
						{ isAwaitingPromise: A } = a.currentInstance;
					(a.currentInstance._destroy(),
						A || m({ isDismissed: !0 }),
						Gi() && ea());
				}
				a.currentInstance = ke;
				let c = cf(s, u);
				(lf(c),
					Object.freeze(c),
					a.timeout && (a.timeout.stop(), delete a.timeout),
					clearTimeout(a.restoreFocusTimeout));
				let p = df(ke);
				return (Xs(ke, c), N.innerParams.set(ke, c), uf(ke, p, c));
			}
			then(s) {
				return e(Er, this).then(s);
			}
			finally(s) {
				return e(Er, this).finally(s);
			}
		}
		let uf = (o, s, u) =>
				new Promise((c, p) => {
					let m = (A) => {
						o.close({
							isDismissed: !0,
							dismiss: A,
							isConfirmed: !1,
							isDenied: !1,
						});
					};
					(jt.swalPromiseResolve.set(o, c),
						jt.swalPromiseReject.set(o, p),
						(s.confirmButton.onclick = () => {
							fh(o);
						}),
						(s.denyButton.onclick = () => {
							ph(o);
						}),
						(s.cancelButton.onclick = () => {
							gh(o, m);
						}),
						(s.closeButton.onclick = () => {
							m(Ut.close);
						}),
						Rh(u, s, m),
						xd(a, u, m),
						ih(o, u),
						tf(u),
						hf(a, u, m),
						ff(s, u),
						setTimeout(() => {
							s.container.scrollTop = 0;
						}));
				}),
			cf = (o, s) => {
				let u = qh(o),
					c = Object.assign({}, Qe, s, u, o);
				return (
					(c.showClass = Object.assign({}, Qe.showClass, c.showClass)),
					(c.hideClass = Object.assign({}, Qe.hideClass, c.hideClass)),
					c.animation === !1 &&
						((c.showClass = { backdrop: "swal2-noanimation" }),
						(c.hideClass = {})),
					c
				);
			},
			df = (o) => {
				let s = {
					popup: k(),
					container: re(),
					actions: wn(),
					confirmButton: Pe(),
					denyButton: mt(),
					cancelButton: Bt(),
					loader: Vt(),
					closeButton: zi(),
					validationMessage: dr(),
					progressSteps: $i(),
				};
				return (N.domCache.set(o, s), s);
			},
			hf = (o, s, u) => {
				let c = hr();
				(ee(c),
					s.timer &&
						((o.timeout = new Gh(() => {
							(u("timer"), delete o.timeout);
						}, s.timer)),
						s.timerProgressBar &&
							c &&
							(J(c),
							ce(c, s, "timerProgressBar"),
							setTimeout(() => {
								o.timeout && o.timeout.running && Yi(s.timer);
							}))));
			},
			ff = (o, s) => {
				if (!s.toast) {
					if (!Nt(s.allowEnterKey)) {
						(xt("allowEnterKey", "preConfirm: () => false"), o.popup.focus());
						return;
					}
					pf(o) || gf(o, s) || eo(-1, 1);
				}
			},
			pf = (o) => {
				let s = Array.from(o.popup.querySelectorAll("[autofocus]"));
				for (let u of s)
					if (u instanceof HTMLElement && ie(u)) return (u.focus(), !0);
				return !1;
			},
			gf = (o, s) =>
				s.focusDeny && ie(o.denyButton)
					? (o.denyButton.focus(), !0)
					: s.focusCancel && ie(o.cancelButton)
						? (o.cancelButton.focus(), !0)
						: s.focusConfirm && ie(o.confirmButton)
							? (o.confirmButton.focus(), !0)
							: !1;
		((q.prototype.disableButtons = fa),
			(q.prototype.enableButtons = ha),
			(q.prototype.getInput = ua),
			(q.prototype.disableInput = ga),
			(q.prototype.enableInput = pa),
			(q.prototype.hideLoading = br),
			(q.prototype.disableLoading = br),
			(q.prototype.showValidationMessage = ma),
			(q.prototype.resetValidationMessage = wa),
			(q.prototype.close = Je),
			(q.prototype.closePopup = Je),
			(q.prototype.closeModal = Je),
			(q.prototype.closeToast = Je),
			(q.prototype.rejectPromise = ra),
			(q.prototype.update = Ca),
			(q.prototype._destroy = Ea),
			Object.assign(q, Hh),
			Object.keys(Sh).forEach((o) => {
				q[o] = function (...s) {
					if (ke && ke[o]) return ke[o](...s);
				};
			}),
			(q.DismissReason = Ut),
			(q.version = "11.26.20"));
		let _r = q;
		return ((_r.default = _r), _r);
	});
	typeof $e < "u" &&
		$e.Sweetalert2 &&
		($e.swal = $e.sweetAlert = $e.Swal = $e.SweetAlert = $e.Sweetalert2);
	typeof document < "u" &&
		(function (t, n) {
			var e = t.createElement("style");
			if ((t.getElementsByTagName("head")[0].appendChild(e), e.styleSheet))
				e.styleSheet.disabled || (e.styleSheet.cssText = n);
			else
				try {
					e.innerHTML = n;
				} catch {
					e.innerText = n;
				}
		})(
			document,
			':root{--swal2-outline: 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-container-padding: 0.625em;--swal2-backdrop: rgba(0, 0, 0, 0.4);--swal2-backdrop-transition: background-color 0.15s;--swal2-width: 32em;--swal2-padding: 0 0 1.25em;--swal2-border: none;--swal2-border-radius: 0.3125rem;--swal2-background: white;--swal2-color: #545454;--swal2-show-animation: swal2-show 0.3s;--swal2-hide-animation: swal2-hide 0.15s forwards;--swal2-icon-zoom: 1;--swal2-icon-animations: true;--swal2-title-padding: 0.8em 1em 0;--swal2-html-container-padding: 1em 1.6em 0.3em;--swal2-input-border: 1px solid #d9d9d9;--swal2-input-border-radius: 0.1875em;--swal2-input-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-background: transparent;--swal2-input-transition: border-color 0.2s, box-shadow 0.2s;--swal2-input-hover-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-focus-border: 1px solid #b4dbed;--swal2-input-focus-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-progress-step-background: #add8e6;--swal2-validation-message-background: #f0f0f0;--swal2-validation-message-color: #666;--swal2-footer-border-color: #eee;--swal2-footer-background: transparent;--swal2-footer-color: inherit;--swal2-timer-progress-bar-background: rgba(0, 0, 0, 0.3);--swal2-close-button-position: initial;--swal2-close-button-inset: auto;--swal2-close-button-font-size: 2.5em;--swal2-close-button-color: #ccc;--swal2-close-button-transition: color 0.2s, box-shadow 0.2s;--swal2-close-button-outline: initial;--swal2-close-button-box-shadow: inset 0 0 0 3px transparent;--swal2-close-button-focus-box-shadow: inset var(--swal2-outline);--swal2-close-button-hover-transform: none;--swal2-actions-justify-content: center;--swal2-actions-width: auto;--swal2-actions-margin: 1.25em auto 0;--swal2-actions-padding: 0;--swal2-actions-border-radius: 0;--swal2-actions-background: transparent;--swal2-action-button-transition: background-color 0.2s, box-shadow 0.2s;--swal2-action-button-hover: black 10%;--swal2-action-button-active: black 10%;--swal2-confirm-button-box-shadow: none;--swal2-confirm-button-border-radius: 0.25em;--swal2-confirm-button-background-color: #7066e0;--swal2-confirm-button-color: #fff;--swal2-deny-button-box-shadow: none;--swal2-deny-button-border-radius: 0.25em;--swal2-deny-button-background-color: #dc3741;--swal2-deny-button-color: #fff;--swal2-cancel-button-box-shadow: none;--swal2-cancel-button-border-radius: 0.25em;--swal2-cancel-button-background-color: #6e7881;--swal2-cancel-button-color: #fff;--swal2-toast-show-animation: swal2-toast-show 0.5s;--swal2-toast-hide-animation: swal2-toast-hide 0.1s forwards;--swal2-toast-border: none;--swal2-toast-box-shadow: 0 0 1px hsl(0deg 0% 0% / 0.075), 0 1px 2px hsl(0deg 0% 0% / 0.075), 1px 2px 4px hsl(0deg 0% 0% / 0.075), 1px 3px 8px hsl(0deg 0% 0% / 0.075), 2px 4px 16px hsl(0deg 0% 0% / 0.075)}[data-swal2-theme=dark]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}@media(prefers-color-scheme: dark){[data-swal2-theme=auto]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px var(--swal2-backdrop)}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}@media print{body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown) .swal2-container{position:static !important}}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:"top-start     top            top-end" "center-start  center         center-end" "bottom-start  bottom-center  bottom-end";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:var(--swal2-container-padding);overflow-x:hidden;transition:var(--swal2-backdrop-transition);-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:var(--swal2-backdrop)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;place-self:start center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;place-self:start end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;place-self:center center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;place-self:center end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;place-self:end center}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;place-self:end end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container)[popover]{width:auto;border:0}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:var(--swal2-width);max-width:100%;padding:var(--swal2-padding);border:var(--swal2-border);border-radius:var(--swal2-border-radius);background:var(--swal2-background);color:var(--swal2-color);font-family:inherit;font-size:1rem;container-name:swal2-popup}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable{cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable div:where(.swal2-icon){cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging{cursor:grabbing}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging div:where(.swal2-icon){cursor:grabbing}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:var(--swal2-title-padding);color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;overflow-wrap:break-word;cursor:initial}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:var(--swal2-actions-justify-content);width:var(--swal2-actions-width);margin:var(--swal2-actions-margin);padding:var(--swal2-actions-padding);border-radius:var(--swal2-actions-border-radius);background:var(--swal2-actions-background)}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:var(--swal2-action-button-transition);border:none;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm){border-radius:var(--swal2-confirm-button-border-radius);background:initial;background-color:var(--swal2-confirm-button-background-color);box-shadow:var(--swal2-confirm-button-box-shadow);color:var(--swal2-confirm-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):hover{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):active{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny){border-radius:var(--swal2-deny-button-border-radius);background:initial;background-color:var(--swal2-deny-button-background-color);box-shadow:var(--swal2-deny-button-box-shadow);color:var(--swal2-deny-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):hover{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):active{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel){border-radius:var(--swal2-cancel-button-border-radius);background:initial;background-color:var(--swal2-cancel-button-background-color);box-shadow:var(--swal2-cancel-button-box-shadow);color:var(--swal2-cancel-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):hover{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):active{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):focus-visible{outline:none;box-shadow:var(--swal2-action-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-styled)[disabled]:not(.swal2-loading){opacity:.4}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid var(--swal2-footer-border-color);background:var(--swal2-footer-background);color:var(--swal2-footer-color);font-size:1em;text-align:center;cursor:initial}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:var(--swal2-border-radius);border-bottom-left-radius:var(--swal2-border-radius)}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:var(--swal2-timer-progress-bar-background)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em;cursor:initial}div:where(.swal2-container) button:where(.swal2-close){position:var(--swal2-close-button-position);inset:var(--swal2-close-button-inset);z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:var(--swal2-close-button-transition);border:none;border-radius:var(--swal2-border-radius);outline:var(--swal2-close-button-outline);background:rgba(0,0,0,0);color:var(--swal2-close-button-color);font-family:monospace;font-size:var(--swal2-close-button-font-size);cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:var(--swal2-close-button-hover-transform);background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus-visible{outline:none;box-shadow:var(--swal2-close-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-html-container){z-index:1;justify-content:center;margin:0;padding:var(--swal2-html-container-padding);overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;overflow-wrap:break-word;word-break:break-word;cursor:initial}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:var(--swal2-input-transition);border:var(--swal2-input-border);border-radius:var(--swal2-input-border-radius);background:var(--swal2-input-background);box-shadow:var(--swal2-input-box-shadow);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):hover,div:where(.swal2-container) input:where(.swal2-file):hover,div:where(.swal2-container) textarea:where(.swal2-textarea):hover{box-shadow:var(--swal2-input-hover-box-shadow)}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:var(--swal2-input-focus-border);outline:none;box-shadow:var(--swal2-input-focus-box-shadow)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:var(--swal2-background)}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:var(--swal2-input-background);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:var(--swal2-input-background);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:var(--swal2-background);color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:var(--swal2-validation-message-background);color:var(--swal2-validation-message-color);font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:var(--swal2-progress-step-background);color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:var(--swal2-progress-step-background)}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;zoom:var(--swal2-icon-zoom);border:.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}}div:where(.swal2-icon).swal2-warning{border-color:#f8bb86;color:#f8bb86}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}}div:where(.swal2-icon).swal2-info{border-color:#3fc3ee;color:#3fc3ee}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}}div:where(.swal2-icon).swal2-question{border-color:#87adbd;color:#87adbd}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:var(--swal2-show-animation)}.swal2-hide{animation:var(--swal2-hide-animation)}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;border:var(--swal2-toast-border);background:var(--swal2-background);box-shadow:var(--swal2-toast-box-shadow);pointer-events:all}.swal2-toast>*{grid-column:2}.swal2-toast h2:where(.swal2-title){margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-toast .swal2-loading{justify-content:center}.swal2-toast input:where(.swal2-input){height:2em;margin:.5em;font-size:1em}.swal2-toast .swal2-validation-message{font-size:1em}.swal2-toast div:where(.swal2-footer){margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-toast button:where(.swal2-close){grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-toast div:where(.swal2-html-container){margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-toast div:where(.swal2-html-container):empty{padding:0}.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-toast div:where(.swal2-actions){justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-toast button:where(.swal2-styled){margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;border-radius:50%}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}@container swal2-popup style(--swal2-icon-animations:true){.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}}.swal2-toast.swal2-show{animation:var(--swal2-toast-show-animation)}.swal2-toast.swal2-hide{animation:var(--swal2-toast-hide-animation)}@keyframes swal2-show{0%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}100%{transform:translate3d(0, 0, 0) scale(1);opacity:1}}@keyframes swal2-hide{0%{transform:translate3d(0, 0, 0) scale(1);opacity:1}100%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}',
		);
});
var Y = new S("");
var hl = null;
function be() {
	return hl;
}
function Ao(t) {
	hl ??= t;
}
var Sn = class {},
	Rn = (() => {
		class t {
			historyGo(e) {
				throw new Error("");
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = E({
				token: t,
				factory: () => y(fl),
				providedIn: "platform",
			});
		}
		return t;
	})(),
	So = new S(""),
	fl = (() => {
		class t extends Rn {
			_location;
			_history;
			_doc = y(Y);
			constructor() {
				(super(),
					(this._location = window.location),
					(this._history = window.history));
			}
			getBaseHrefFromDOM() {
				return be().getBaseHref(this._doc);
			}
			onPopState(e) {
				let r = be().getGlobalEventTarget(this._doc, "window");
				return (
					r.addEventListener("popstate", e, !1),
					() => r.removeEventListener("popstate", e)
				);
			}
			onHashChange(e) {
				let r = be().getGlobalEventTarget(this._doc, "window");
				return (
					r.addEventListener("hashchange", e, !1),
					() => r.removeEventListener("hashchange", e)
				);
			}
			get href() {
				return this._location.href;
			}
			get protocol() {
				return this._location.protocol;
			}
			get hostname() {
				return this._location.hostname;
			}
			get port() {
				return this._location.port;
			}
			get pathname() {
				return this._location.pathname;
			}
			get search() {
				return this._location.search;
			}
			get hash() {
				return this._location.hash;
			}
			set pathname(e) {
				this._location.pathname = e;
			}
			pushState(e, r, i) {
				this._history.pushState(e, r, i);
			}
			replaceState(e, r, i) {
				this._history.replaceState(e, r, i);
			}
			forward() {
				this._history.forward();
			}
			back() {
				this._history.back();
			}
			historyGo(e = 0) {
				this._history.go(e);
			}
			getState() {
				return this._history.state;
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = E({
				token: t,
				factory: () => new t(),
				providedIn: "platform",
			});
		}
		return t;
	})();
function Ir(t, n) {
	return t
		? n
			? t.endsWith("/")
				? n.startsWith("/")
					? t + n.slice(1)
					: t + n
				: n.startsWith("/")
					? t + n
					: `${t}/${n}`
			: t
		: n;
}
function cl(t) {
	let n = t.search(/#|\?|$/);
	return t[n - 1] === "/" ? t.slice(0, n - 1) + t.slice(n) : t;
}
function Te(t) {
	return t && t[0] !== "?" ? `?${t}` : t;
}
var Ie = (() => {
		class t {
			historyGo(e) {
				throw new Error("");
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = E({ token: t, factory: () => y(Or), providedIn: "root" });
		}
		return t;
	})(),
	Fr = new S(""),
	Or = (() => {
		class t extends Ie {
			_platformLocation;
			_baseHref;
			_removeListenerFns = [];
			constructor(e, r) {
				(super(),
					(this._platformLocation = e),
					(this._baseHref =
						r ??
						this._platformLocation.getBaseHrefFromDOM() ??
						y(Y).location?.origin ??
						""));
			}
			ngOnDestroy() {
				for (; this._removeListenerFns.length; )
					this._removeListenerFns.pop()();
			}
			onPopState(e) {
				this._removeListenerFns.push(
					this._platformLocation.onPopState(e),
					this._platformLocation.onHashChange(e),
				);
			}
			getBaseHref() {
				return this._baseHref;
			}
			prepareExternalUrl(e) {
				return Ir(this._baseHref, e);
			}
			path(e = !1) {
				let r =
						this._platformLocation.pathname + Te(this._platformLocation.search),
					i = this._platformLocation.hash;
				return i && e ? `${r}${i}` : r;
			}
			pushState(e, r, i, l) {
				let a = this.prepareExternalUrl(i + Te(l));
				this._platformLocation.pushState(e, r, a);
			}
			replaceState(e, r, i, l) {
				let a = this.prepareExternalUrl(i + Te(l));
				this._platformLocation.replaceState(e, r, a);
			}
			forward() {
				this._platformLocation.forward();
			}
			back() {
				this._platformLocation.back();
			}
			getState() {
				return this._platformLocation.getState();
			}
			historyGo(e = 0) {
				this._platformLocation.historyGo?.(e);
			}
			static ɵfac = function (r) {
				return new (r || t)(_(Rn), _(Fr, 8));
			};
			static ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})(),
	at = (() => {
		class t {
			_subject = new de();
			_basePath;
			_locationStrategy;
			_urlChangeListeners = [];
			_urlChangeSubscription = null;
			constructor(e) {
				this._locationStrategy = e;
				let r = this._locationStrategy.getBaseHref();
				((this._basePath = yf(cl(dl(r)))),
					this._locationStrategy.onPopState((i) => {
						this._subject.next({
							url: this.path(!0),
							pop: !0,
							state: i.state,
							type: i.type,
						});
					}));
			}
			ngOnDestroy() {
				(this._urlChangeSubscription?.unsubscribe(),
					(this._urlChangeListeners = []));
			}
			path(e = !1) {
				return this.normalize(this._locationStrategy.path(e));
			}
			getState() {
				return this._locationStrategy.getState();
			}
			isCurrentPathEqualTo(e, r = "") {
				return this.path() == this.normalize(e + Te(r));
			}
			normalize(e) {
				return t.stripTrailingSlash(vf(this._basePath, dl(e)));
			}
			prepareExternalUrl(e) {
				return (
					e && e[0] !== "/" && (e = "/" + e),
					this._locationStrategy.prepareExternalUrl(e)
				);
			}
			go(e, r = "", i = null) {
				(this._locationStrategy.pushState(i, "", e, r),
					this._notifyUrlChangeListeners(
						this.prepareExternalUrl(e + Te(r)),
						i,
					));
			}
			replaceState(e, r = "", i = null) {
				(this._locationStrategy.replaceState(i, "", e, r),
					this._notifyUrlChangeListeners(
						this.prepareExternalUrl(e + Te(r)),
						i,
					));
			}
			forward() {
				this._locationStrategy.forward();
			}
			back() {
				this._locationStrategy.back();
			}
			historyGo(e = 0) {
				this._locationStrategy.historyGo?.(e);
			}
			onUrlChange(e) {
				return (
					this._urlChangeListeners.push(e),
					(this._urlChangeSubscription ??= this.subscribe((r) => {
						this._notifyUrlChangeListeners(r.url, r.state);
					})),
					() => {
						let r = this._urlChangeListeners.indexOf(e);
						(this._urlChangeListeners.splice(r, 1),
							this._urlChangeListeners.length === 0 &&
								(this._urlChangeSubscription?.unsubscribe(),
								(this._urlChangeSubscription = null)));
					}
				);
			}
			_notifyUrlChangeListeners(e = "", r) {
				this._urlChangeListeners.forEach((i) => i(e, r));
			}
			subscribe(e, r, i) {
				return this._subject.subscribe({
					next: e,
					error: r ?? void 0,
					complete: i ?? void 0,
				});
			}
			static normalizeQueryParams = Te;
			static joinWithSlash = Ir;
			static stripTrailingSlash = cl;
			static ɵfac = function (r) {
				return new (r || t)(_(Ie));
			};
			static ɵprov = E({ token: t, factory: () => wf(), providedIn: "root" });
		}
		return t;
	})();
function wf() {
	return new at(_(Ie));
}
function vf(t, n) {
	if (!t || !n.startsWith(t)) return n;
	let e = n.substring(t.length);
	return e === "" || ["/", ";", "?", "#"].includes(e[0]) ? e : n;
}
function dl(t) {
	return t.replace(/\/index.html$/, "");
}
function yf(t) {
	if (new RegExp("^(https?:)?//").test(t)) {
		let [, e] = t.split(/\/\/[^\/]+/);
		return e;
	}
	return t;
}
var Fo = (() => {
	class t extends Ie {
		_platformLocation;
		_baseHref = "";
		_removeListenerFns = [];
		constructor(e, r) {
			(super(),
				(this._platformLocation = e),
				r != null && (this._baseHref = r));
		}
		ngOnDestroy() {
			for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
		}
		onPopState(e) {
			this._removeListenerFns.push(
				this._platformLocation.onPopState(e),
				this._platformLocation.onHashChange(e),
			);
		}
		getBaseHref() {
			return this._baseHref;
		}
		path(e = !1) {
			let r = this._platformLocation.hash ?? "#";
			return r.length > 0 ? r.substring(1) : r;
		}
		prepareExternalUrl(e) {
			let r = Ir(this._baseHref, e);
			return r.length > 0 ? "#" + r : r;
		}
		pushState(e, r, i, l) {
			let a =
				this.prepareExternalUrl(i + Te(l)) || this._platformLocation.pathname;
			this._platformLocation.pushState(e, r, a);
		}
		replaceState(e, r, i, l) {
			let a =
				this.prepareExternalUrl(i + Te(l)) || this._platformLocation.pathname;
			this._platformLocation.replaceState(e, r, a);
		}
		forward() {
			this._platformLocation.forward();
		}
		back() {
			this._platformLocation.back();
		}
		getState() {
			return this._platformLocation.getState();
		}
		historyGo(e = 0) {
			this._platformLocation.historyGo?.(e);
		}
		static ɵfac = function (r) {
			return new (r || t)(_(Rn), _(Fr, 8));
		};
		static ɵprov = E({ token: t, factory: t.ɵfac });
	}
	return t;
})();
var ne = (function (t) {
		return (
			(t[(t.Format = 0)] = "Format"),
			(t[(t.Standalone = 1)] = "Standalone"),
			t
		);
	})(ne || {}),
	B = (function (t) {
		return (
			(t[(t.Narrow = 0)] = "Narrow"),
			(t[(t.Abbreviated = 1)] = "Abbreviated"),
			(t[(t.Wide = 2)] = "Wide"),
			(t[(t.Short = 3)] = "Short"),
			t
		);
	})(B || {}),
	se = (function (t) {
		return (
			(t[(t.Short = 0)] = "Short"),
			(t[(t.Medium = 1)] = "Medium"),
			(t[(t.Long = 2)] = "Long"),
			(t[(t.Full = 3)] = "Full"),
			t
		);
	})(se || {}),
	Ze = {
		Decimal: 0,
		Group: 1,
		List: 2,
		PercentSign: 3,
		PlusSign: 4,
		MinusSign: 5,
		Exponential: 6,
		SuperscriptingExponent: 7,
		PerMille: 8,
		Infinity: 9,
		NaN: 10,
		TimeSeparator: 11,
		CurrencyDecimal: 12,
		CurrencyGroup: 13,
	};
function vl(t) {
	return ye(t)[W.LocaleId];
}
function yl(t, n, e) {
	let r = ye(t),
		i = [r[W.DayPeriodsFormat], r[W.DayPeriodsStandalone]],
		l = De(i, n);
	return De(l, e);
}
function bl(t, n, e) {
	let r = ye(t),
		i = [r[W.DaysFormat], r[W.DaysStandalone]],
		l = De(i, n);
	return De(l, e);
}
function Dl(t, n, e) {
	let r = ye(t),
		i = [r[W.MonthsFormat], r[W.MonthsStandalone]],
		l = De(i, n);
	return De(l, e);
}
function Cl(t, n) {
	let r = ye(t)[W.Eras];
	return De(r, n);
}
function Mn(t, n) {
	let e = ye(t);
	return De(e[W.DateFormat], n);
}
function Tn(t, n) {
	let e = ye(t);
	return De(e[W.TimeFormat], n);
}
function In(t, n) {
	let r = ye(t)[W.DateTimeFormat];
	return De(r, n);
}
function Fn(t, n) {
	let e = ye(t),
		r = e[W.NumberSymbols][n];
	if (typeof r > "u") {
		if (n === Ze.CurrencyDecimal) return e[W.NumberSymbols][Ze.Decimal];
		if (n === Ze.CurrencyGroup) return e[W.NumberSymbols][Ze.Group];
	}
	return r;
}
function El(t) {
	if (!t[W.ExtraData])
		throw new Error(
			`Missing extra locale data for the locale "${t[W.LocaleId]}". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`,
		);
}
function _l(t) {
	let n = ye(t);
	return (
		El(n),
		(n[W.ExtraData][2] || []).map((r) =>
			typeof r == "string" ? Ro(r) : [Ro(r[0]), Ro(r[1])],
		)
	);
}
function Al(t, n, e) {
	let r = ye(t);
	El(r);
	let i = [r[W.ExtraData][0], r[W.ExtraData][1]],
		l = De(i, n) || [];
	return De(l, e) || [];
}
function De(t, n) {
	for (let e = n; e > -1; e--) if (typeof t[e] < "u") return t[e];
	throw new Error("Locale data API: locale data undefined");
}
function Ro(t) {
	let [n, e] = t.split(":");
	return { hours: +n, minutes: +e };
}
var bf =
		/^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,
	Pr = {},
	Df =
		/((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
function Sl(t, n, e, r) {
	let i = If(t);
	n = Ye(e, n) || n;
	let a = [],
		d;
	for (; n; )
		if (((d = Df.exec(n)), d)) {
			a = a.concat(d.slice(1));
			let w = a.pop();
			if (!w) break;
			n = w;
		} else {
			a.push(n);
			break;
		}
	let h = i.getTimezoneOffset();
	r && ((h = Ml(r, h)), (i = Tf(i, r)));
	let g = "";
	return (
		a.forEach((w) => {
			let f = Rf(w);
			g += f
				? f(i, e, h)
				: w === "''"
					? "'"
					: w.replace(/(^'|'$)/g, "").replace(/''/g, "'");
		}),
		g
	);
}
function Br(t, n, e) {
	let r = new Date(0);
	return (r.setFullYear(t, n, e), r.setHours(0, 0, 0), r);
}
function Ye(t, n) {
	let e = vl(t);
	if (((Pr[e] ??= {}), Pr[e][n])) return Pr[e][n];
	let r = "";
	switch (n) {
		case "shortDate":
			r = Mn(t, se.Short);
			break;
		case "mediumDate":
			r = Mn(t, se.Medium);
			break;
		case "longDate":
			r = Mn(t, se.Long);
			break;
		case "fullDate":
			r = Mn(t, se.Full);
			break;
		case "shortTime":
			r = Tn(t, se.Short);
			break;
		case "mediumTime":
			r = Tn(t, se.Medium);
			break;
		case "longTime":
			r = Tn(t, se.Long);
			break;
		case "fullTime":
			r = Tn(t, se.Full);
			break;
		case "short":
			let i = Ye(t, "shortTime"),
				l = Ye(t, "shortDate");
			r = kr(In(t, se.Short), [i, l]);
			break;
		case "medium":
			let a = Ye(t, "mediumTime"),
				d = Ye(t, "mediumDate");
			r = kr(In(t, se.Medium), [a, d]);
			break;
		case "long":
			let h = Ye(t, "longTime"),
				g = Ye(t, "longDate");
			r = kr(In(t, se.Long), [h, g]);
			break;
		case "full":
			let w = Ye(t, "fullTime"),
				f = Ye(t, "fullDate");
			r = kr(In(t, se.Full), [w, f]);
			break;
	}
	return (r && (Pr[e][n] = r), r);
}
function kr(t, n) {
	return (
		n &&
			(t = t.replace(/\{([^}]+)}/g, function (e, r) {
				return n != null && r in n ? n[r] : e;
			})),
		t
	);
}
function Fe(t, n, e = "-", r, i) {
	let l = "";
	(t < 0 || (i && t <= 0)) && (i ? (t = -t + 1) : ((t = -t), (l = e)));
	let a = String(t);
	for (; a.length < n; ) a = "0" + a;
	return (r && (a = a.slice(a.length - n)), l + a);
}
function Cf(t, n) {
	return Fe(t, 3).substring(0, n);
}
function Z(t, n, e = 0, r = !1, i = !1) {
	return function (l, a) {
		let d = Ef(t, l);
		if (((e > 0 || d > -e) && (d += e), t === 3))
			d === 0 && e === -12 && (d = 12);
		else if (t === 6) return Cf(d, n);
		let h = Fn(a, Ze.MinusSign);
		return Fe(d, n, h, r, i);
	};
}
function Ef(t, n) {
	switch (t) {
		case 0:
			return n.getFullYear();
		case 1:
			return n.getMonth();
		case 2:
			return n.getDate();
		case 3:
			return n.getHours();
		case 4:
			return n.getMinutes();
		case 5:
			return n.getSeconds();
		case 6:
			return n.getMilliseconds();
		case 7:
			return n.getDay();
		default:
			throw new Error(`Unknown DateType value "${t}".`);
	}
}
function z(t, n, e = ne.Format, r = !1) {
	return function (i, l) {
		return _f(i, l, t, n, e, r);
	};
}
function _f(t, n, e, r, i, l) {
	switch (e) {
		case 2:
			return Dl(n, i, r)[t.getMonth()];
		case 1:
			return bl(n, i, r)[t.getDay()];
		case 0:
			let a = t.getHours(),
				d = t.getMinutes();
			if (l) {
				let g = _l(n),
					w = Al(n, i, r),
					f = g.findIndex((I) => {
						if (Array.isArray(I)) {
							let [F, U] = I,
								M = a >= F.hours && d >= F.minutes,
								b = a < U.hours || (a === U.hours && d < U.minutes);
							if (F.hours < U.hours) {
								if (M && b) return !0;
							} else if (M || b) return !0;
						} else if (I.hours === a && I.minutes === d) return !0;
						return !1;
					});
				if (f !== -1) return w[f];
			}
			return yl(n, i, r)[a < 12 ? 0 : 1];
		case 3:
			return Cl(n, r)[t.getFullYear() <= 0 ? 0 : 1];
		default:
			let h = e;
			throw new Error(`unexpected translation type ${h}`);
	}
}
function xr(t) {
	return function (n, e, r) {
		let i = -1 * r,
			l = Fn(e, Ze.MinusSign),
			a = i > 0 ? Math.floor(i / 60) : Math.ceil(i / 60);
		switch (t) {
			case 0:
				return (i >= 0 ? "+" : "") + Fe(a, 2, l) + Fe(Math.abs(i % 60), 2, l);
			case 1:
				return "GMT" + (i >= 0 ? "+" : "") + Fe(a, 1, l);
			case 2:
				return (
					"GMT" +
					(i >= 0 ? "+" : "") +
					Fe(a, 2, l) +
					":" +
					Fe(Math.abs(i % 60), 2, l)
				);
			case 3:
				return r === 0
					? "Z"
					: (i >= 0 ? "+" : "") +
							Fe(a, 2, l) +
							":" +
							Fe(Math.abs(i % 60), 2, l);
			default:
				throw new Error(`Unknown zone width "${t}"`);
		}
	};
}
var Af = 0,
	Lr = 4;
function Sf(t) {
	let n = Br(t, Af, 1).getDay();
	return Br(t, 0, 1 + (n <= Lr ? Lr : Lr + 7) - n);
}
function Rl(t) {
	let n = t.getDay(),
		e = n === 0 ? -3 : Lr - n;
	return Br(t.getFullYear(), t.getMonth(), t.getDate() + e);
}
function Mo(t, n = !1) {
	return function (e, r) {
		let i;
		if (n) {
			let l = new Date(e.getFullYear(), e.getMonth(), 1).getDay() - 1,
				a = e.getDate();
			i = 1 + Math.floor((a + l) / 7);
		} else {
			let l = Rl(e),
				a = Sf(l.getFullYear()),
				d = l.getTime() - a.getTime();
			i = 1 + Math.round(d / 6048e5);
		}
		return Fe(i, t, Fn(r, Ze.MinusSign));
	};
}
function Nr(t, n = !1) {
	return function (e, r) {
		let l = Rl(e).getFullYear();
		return Fe(l, t, Fn(r, Ze.MinusSign), n);
	};
}
var To = {};
function Rf(t) {
	if (To[t]) return To[t];
	let n;
	switch (t) {
		case "G":
		case "GG":
		case "GGG":
			n = z(3, B.Abbreviated);
			break;
		case "GGGG":
			n = z(3, B.Wide);
			break;
		case "GGGGG":
			n = z(3, B.Narrow);
			break;
		case "y":
			n = Z(0, 1, 0, !1, !0);
			break;
		case "yy":
			n = Z(0, 2, 0, !0, !0);
			break;
		case "yyy":
			n = Z(0, 3, 0, !1, !0);
			break;
		case "yyyy":
			n = Z(0, 4, 0, !1, !0);
			break;
		case "Y":
			n = Nr(1);
			break;
		case "YY":
			n = Nr(2, !0);
			break;
		case "YYY":
			n = Nr(3);
			break;
		case "YYYY":
			n = Nr(4);
			break;
		case "M":
		case "L":
			n = Z(1, 1, 1);
			break;
		case "MM":
		case "LL":
			n = Z(1, 2, 1);
			break;
		case "MMM":
			n = z(2, B.Abbreviated);
			break;
		case "MMMM":
			n = z(2, B.Wide);
			break;
		case "MMMMM":
			n = z(2, B.Narrow);
			break;
		case "LLL":
			n = z(2, B.Abbreviated, ne.Standalone);
			break;
		case "LLLL":
			n = z(2, B.Wide, ne.Standalone);
			break;
		case "LLLLL":
			n = z(2, B.Narrow, ne.Standalone);
			break;
		case "w":
			n = Mo(1);
			break;
		case "ww":
			n = Mo(2);
			break;
		case "W":
			n = Mo(1, !0);
			break;
		case "d":
			n = Z(2, 1);
			break;
		case "dd":
			n = Z(2, 2);
			break;
		case "c":
		case "cc":
			n = Z(7, 1);
			break;
		case "ccc":
			n = z(1, B.Abbreviated, ne.Standalone);
			break;
		case "cccc":
			n = z(1, B.Wide, ne.Standalone);
			break;
		case "ccccc":
			n = z(1, B.Narrow, ne.Standalone);
			break;
		case "cccccc":
			n = z(1, B.Short, ne.Standalone);
			break;
		case "E":
		case "EE":
		case "EEE":
			n = z(1, B.Abbreviated);
			break;
		case "EEEE":
			n = z(1, B.Wide);
			break;
		case "EEEEE":
			n = z(1, B.Narrow);
			break;
		case "EEEEEE":
			n = z(1, B.Short);
			break;
		case "a":
		case "aa":
		case "aaa":
			n = z(0, B.Abbreviated);
			break;
		case "aaaa":
			n = z(0, B.Wide);
			break;
		case "aaaaa":
			n = z(0, B.Narrow);
			break;
		case "b":
		case "bb":
		case "bbb":
			n = z(0, B.Abbreviated, ne.Standalone, !0);
			break;
		case "bbbb":
			n = z(0, B.Wide, ne.Standalone, !0);
			break;
		case "bbbbb":
			n = z(0, B.Narrow, ne.Standalone, !0);
			break;
		case "B":
		case "BB":
		case "BBB":
			n = z(0, B.Abbreviated, ne.Format, !0);
			break;
		case "BBBB":
			n = z(0, B.Wide, ne.Format, !0);
			break;
		case "BBBBB":
			n = z(0, B.Narrow, ne.Format, !0);
			break;
		case "h":
			n = Z(3, 1, -12);
			break;
		case "hh":
			n = Z(3, 2, -12);
			break;
		case "H":
			n = Z(3, 1);
			break;
		case "HH":
			n = Z(3, 2);
			break;
		case "m":
			n = Z(4, 1);
			break;
		case "mm":
			n = Z(4, 2);
			break;
		case "s":
			n = Z(5, 1);
			break;
		case "ss":
			n = Z(5, 2);
			break;
		case "S":
			n = Z(6, 1);
			break;
		case "SS":
			n = Z(6, 2);
			break;
		case "SSS":
			n = Z(6, 3);
			break;
		case "Z":
		case "ZZ":
		case "ZZZ":
			n = xr(0);
			break;
		case "ZZZZZ":
			n = xr(3);
			break;
		case "O":
		case "OO":
		case "OOO":
		case "z":
		case "zz":
		case "zzz":
			n = xr(1);
			break;
		case "OOOO":
		case "ZZZZ":
		case "zzzz":
			n = xr(2);
			break;
		default:
			return null;
	}
	return ((To[t] = n), n);
}
function Ml(t, n) {
	t = t.replace(/:/g, "");
	let e = Date.parse("Jan 01, 1970 00:00:00 " + t) / 6e4;
	return isNaN(e) ? n : e;
}
function Mf(t, n) {
	return ((t = new Date(t.getTime())), t.setMinutes(t.getMinutes() + n), t);
}
function Tf(t, n, e) {
	let i = t.getTimezoneOffset(),
		l = Ml(n, i);
	return Mf(t, -1 * (l - i));
}
function If(t) {
	if (pl(t)) return t;
	if (typeof t == "number" && !isNaN(t)) return new Date(t);
	if (typeof t == "string") {
		if (((t = t.trim()), /^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(t))) {
			let [i, l = 1, a = 1] = t.split("-").map((d) => +d);
			return Br(i, l - 1, a);
		}
		let e = parseFloat(t);
		if (!isNaN(t - e)) return new Date(e);
		let r;
		if ((r = t.match(bf))) return Ff(r);
	}
	let n = new Date(t);
	if (!pl(n)) throw new Error(`Unable to convert "${t}" into a date`);
	return n;
}
function Ff(t) {
	let n = new Date(0),
		e = 0,
		r = 0,
		i = t[8] ? n.setUTCFullYear : n.setFullYear,
		l = t[8] ? n.setUTCHours : n.setHours;
	(t[9] && ((e = Number(t[9] + t[10])), (r = Number(t[9] + t[11]))),
		i.call(n, Number(t[1]), Number(t[2]) - 1, Number(t[3])));
	let a = Number(t[4] || 0) - e,
		d = Number(t[5] || 0) - r,
		h = Number(t[6] || 0),
		g = Math.floor(parseFloat("0." + (t[7] || 0)) * 1e3);
	return (l.call(n, a, d, h, g), n);
}
function pl(t) {
	return t instanceof Date && !isNaN(t.valueOf());
}
var Io = /\s+/,
	gl = [],
	Of = (() => {
		class t {
			_ngEl;
			_renderer;
			initialClasses = gl;
			rawClass;
			stateMap = new Map();
			constructor(e, r) {
				((this._ngEl = e), (this._renderer = r));
			}
			set klass(e) {
				this.initialClasses = e != null ? e.trim().split(Io) : gl;
			}
			set ngClass(e) {
				this.rawClass = typeof e == "string" ? e.trim().split(Io) : e;
			}
			ngDoCheck() {
				for (let r of this.initialClasses) this._updateState(r, !0);
				let e = this.rawClass;
				if (Array.isArray(e) || e instanceof Set)
					for (let r of e) this._updateState(r, !0);
				else if (e != null)
					for (let r of Object.keys(e)) this._updateState(r, !!e[r]);
				this._applyStateDiff();
			}
			_updateState(e, r) {
				let i = this.stateMap.get(e);
				i !== void 0
					? (i.enabled !== r && ((i.changed = !0), (i.enabled = r)),
						(i.touched = !0))
					: this.stateMap.set(e, { enabled: r, changed: !0, touched: !0 });
			}
			_applyStateDiff() {
				for (let e of this.stateMap) {
					let r = e[0],
						i = e[1];
					(i.changed
						? (this._toggleClass(r, i.enabled), (i.changed = !1))
						: i.touched ||
							(i.enabled && this._toggleClass(r, !1), this.stateMap.delete(r)),
						(i.touched = !1));
				}
			}
			_toggleClass(e, r) {
				((e = e.trim()),
					e.length > 0 &&
						e.split(Io).forEach((i) => {
							r
								? this._renderer.addClass(this._ngEl.nativeElement, i)
								: this._renderer.removeClass(this._ngEl.nativeElement, i);
						}));
			}
			static ɵfac = function (r) {
				return new (r || t)(C(Ae), C(Se));
			};
			static ɵdir = $({
				type: t,
				selectors: [["", "ngClass", ""]],
				inputs: { klass: [0, "class", "klass"], ngClass: "ngClass" },
			});
		}
		return t;
	})();
var Vr = class {
		$implicit;
		ngForOf;
		index;
		count;
		constructor(n, e, r, i) {
			((this.$implicit = n),
				(this.ngForOf = e),
				(this.index = r),
				(this.count = i));
		}
		get first() {
			return this.index === 0;
		}
		get last() {
			return this.index === this.count - 1;
		}
		get even() {
			return this.index % 2 === 0;
		}
		get odd() {
			return !this.even;
		}
	},
	Tl = (() => {
		class t {
			_viewContainer;
			_template;
			_differs;
			set ngForOf(e) {
				((this._ngForOf = e), (this._ngForOfDirty = !0));
			}
			set ngForTrackBy(e) {
				this._trackByFn = e;
			}
			get ngForTrackBy() {
				return this._trackByFn;
			}
			_ngForOf = null;
			_ngForOfDirty = !0;
			_differ = null;
			_trackByFn;
			constructor(e, r, i) {
				((this._viewContainer = e), (this._template = r), (this._differs = i));
			}
			set ngForTemplate(e) {
				e && (this._template = e);
			}
			ngDoCheck() {
				if (this._ngForOfDirty) {
					this._ngForOfDirty = !1;
					let e = this._ngForOf;
					!this._differ &&
						e &&
						(this._differ = this._differs.find(e).create(this.ngForTrackBy));
				}
				if (this._differ) {
					let e = this._differ.diff(this._ngForOf);
					e && this._applyChanges(e);
				}
			}
			_applyChanges(e) {
				let r = this._viewContainer;
				e.forEachOperation((i, l, a) => {
					if (i.previousIndex == null)
						r.createEmbeddedView(
							this._template,
							new Vr(i.item, this._ngForOf, -1, -1),
							a === null ? void 0 : a,
						);
					else if (a == null) r.remove(l === null ? void 0 : l);
					else if (l !== null) {
						let d = r.get(l);
						(r.move(d, a), ml(d, i));
					}
				});
				for (let i = 0, l = r.length; i < l; i++) {
					let d = r.get(i).context;
					((d.index = i), (d.count = l), (d.ngForOf = this._ngForOf));
				}
				e.forEachIdentityChange((i) => {
					let l = r.get(i.currentIndex);
					ml(l, i);
				});
			}
			static ngTemplateContextGuard(e, r) {
				return !0;
			}
			static ɵfac = function (r) {
				return new (r || t)(C(Zt), C(bo), C(sl));
			};
			static ɵdir = $({
				type: t,
				selectors: [["", "ngFor", "", "ngForOf", ""]],
				inputs: {
					ngForOf: "ngForOf",
					ngForTrackBy: "ngForTrackBy",
					ngForTemplate: "ngForTemplate",
				},
			});
		}
		return t;
	})();
function ml(t, n) {
	t.context.$implicit = n.item;
}
var Pf = (() => {
		class t {
			_viewContainer;
			_context = new Ur();
			_thenTemplateRef = null;
			_elseTemplateRef = null;
			_thenViewRef = null;
			_elseViewRef = null;
			constructor(e, r) {
				((this._viewContainer = e), (this._thenTemplateRef = r));
			}
			set ngIf(e) {
				((this._context.$implicit = this._context.ngIf = e),
					this._updateView());
			}
			set ngIfThen(e) {
				(wl(e, !1),
					(this._thenTemplateRef = e),
					(this._thenViewRef = null),
					this._updateView());
			}
			set ngIfElse(e) {
				(wl(e, !1),
					(this._elseTemplateRef = e),
					(this._elseViewRef = null),
					this._updateView());
			}
			_updateView() {
				this._context.$implicit
					? this._thenViewRef ||
						(this._viewContainer.clear(),
						(this._elseViewRef = null),
						this._thenTemplateRef &&
							(this._thenViewRef = this._viewContainer.createEmbeddedView(
								this._thenTemplateRef,
								this._context,
							)))
					: this._elseViewRef ||
						(this._viewContainer.clear(),
						(this._thenViewRef = null),
						this._elseTemplateRef &&
							(this._elseViewRef = this._viewContainer.createEmbeddedView(
								this._elseTemplateRef,
								this._context,
							)));
			}
			static ngIfUseIfTypeGuard;
			static ngTemplateGuard_ngIf;
			static ngTemplateContextGuard(e, r) {
				return !0;
			}
			static ɵfac = function (r) {
				return new (r || t)(C(Zt), C(bo));
			};
			static ɵdir = $({
				type: t,
				selectors: [["", "ngIf", ""]],
				inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" },
			});
		}
		return t;
	})(),
	Ur = class {
		$implicit = null;
		ngIf = null;
	};
function wl(t, n) {
	if (t && !t.createEmbeddedView) throw new T(2020, !1);
}
var kf = (() => {
		class t {
			_ngEl;
			_differs;
			_renderer;
			_ngStyle = null;
			_differ = null;
			constructor(e, r, i) {
				((this._ngEl = e), (this._differs = r), (this._renderer = i));
			}
			set ngStyle(e) {
				((this._ngStyle = e),
					!this._differ &&
						e &&
						(this._differ = this._differs.find(e).create()));
			}
			ngDoCheck() {
				if (this._differ) {
					let e = this._differ.diff(this._ngStyle);
					e && this._applyChanges(e);
				}
			}
			_setStyle(e, r) {
				let [i, l] = e.split("."),
					a = i.indexOf("-") === -1 ? void 0 : Dt.DashCase;
				r != null
					? this._renderer.setStyle(
							this._ngEl.nativeElement,
							i,
							l ? `${r}${l}` : r,
							a,
						)
					: this._renderer.removeStyle(this._ngEl.nativeElement, i, a);
			}
			_applyChanges(e) {
				(e.forEachRemovedItem((r) => this._setStyle(r.key, null)),
					e.forEachAddedItem((r) => this._setStyle(r.key, r.currentValue)),
					e.forEachChangedItem((r) => this._setStyle(r.key, r.currentValue)));
			}
			static ɵfac = function (r) {
				return new (r || t)(C(Ae), C(al), C(Se));
			};
			static ɵdir = $({
				type: t,
				selectors: [["", "ngStyle", ""]],
				inputs: { ngStyle: "ngStyle" },
			});
		}
		return t;
	})(),
	xf = (() => {
		class t {
			_viewContainerRef;
			_viewRef = null;
			ngTemplateOutletContext = null;
			ngTemplateOutlet = null;
			ngTemplateOutletInjector = null;
			constructor(e) {
				this._viewContainerRef = e;
			}
			ngOnChanges(e) {
				if (this._shouldRecreateView(e)) {
					let r = this._viewContainerRef;
					if (
						(this._viewRef && r.remove(r.indexOf(this._viewRef)),
						!this.ngTemplateOutlet)
					) {
						this._viewRef = null;
						return;
					}
					let i = this._createContextForwardProxy();
					this._viewRef = r.createEmbeddedView(this.ngTemplateOutlet, i, {
						injector: this.ngTemplateOutletInjector ?? void 0,
					});
				}
			}
			_shouldRecreateView(e) {
				return !!e.ngTemplateOutlet || !!e.ngTemplateOutletInjector;
			}
			_createContextForwardProxy() {
				return new Proxy(
					{},
					{
						set: (e, r, i) =>
							this.ngTemplateOutletContext
								? Reflect.set(this.ngTemplateOutletContext, r, i)
								: !1,
						get: (e, r, i) => {
							if (this.ngTemplateOutletContext)
								return Reflect.get(this.ngTemplateOutletContext, r, i);
						},
					},
				);
			}
			static ɵfac = function (r) {
				return new (r || t)(C(Zt));
			};
			static ɵdir = $({
				type: t,
				selectors: [["", "ngTemplateOutlet", ""]],
				inputs: {
					ngTemplateOutletContext: "ngTemplateOutletContext",
					ngTemplateOutlet: "ngTemplateOutlet",
					ngTemplateOutletInjector: "ngTemplateOutletInjector",
				},
				features: [_e],
			});
		}
		return t;
	})();
function Il(t, n) {
	return new T(2100, !1);
}
var Nf =
		/(?:[0-9A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])\S*/g,
	Lf = (() => {
		class t {
			transform(e) {
				if (e == null) return null;
				if (typeof e != "string") throw Il(t, e);
				return e.replace(
					Nf,
					(r) => r[0].toUpperCase() + r.slice(1).toLowerCase(),
				);
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵpipe = Do({ name: "titlecase", type: t, pure: !0 });
		}
		return t;
	})();
var Bf = "mediumDate",
	Fl = new S(""),
	Ol = new S(""),
	Vf = (() => {
		class t {
			locale;
			defaultTimezone;
			defaultOptions;
			constructor(e, r, i) {
				((this.locale = e),
					(this.defaultTimezone = r),
					(this.defaultOptions = i));
			}
			transform(e, r, i, l) {
				if (e == null || e === "" || e !== e) return null;
				try {
					let a = r ?? this.defaultOptions?.dateFormat ?? Bf,
						d =
							i ??
							this.defaultOptions?.timezone ??
							this.defaultTimezone ??
							void 0;
					return Sl(e, a, l || this.locale, d);
				} catch (a) {
					throw Il(t, a.message);
				}
			}
			static ɵfac = function (r) {
				return new (r || t)(C(ol, 16), C(Fl, 24), C(Ol, 24));
			};
			static ɵpipe = Do({ name: "date", type: t, pure: !0 });
		}
		return t;
	})();
var Pl = (() => {
	class t {
		static ɵfac = function (r) {
			return new (r || t)();
		};
		static ɵmod = Re({ type: t });
		static ɵinj = Ee({});
	}
	return t;
})();
function On(t, n) {
	n = encodeURIComponent(n);
	for (let e of t.split(";")) {
		let r = e.indexOf("="),
			[i, l] = r == -1 ? [e, ""] : [e.slice(0, r), e.slice(r + 1)];
		if (i.trim() === n) return decodeURIComponent(l);
	}
	return null;
}
var jr = "browser",
	kl = "server";
function Uf(t) {
	return t === jr;
}
function $r(t) {
	return t === kl;
}
var _t = class {};
var xl = (() => {
		class t {
			static ɵprov = E({
				token: t,
				providedIn: "root",
				factory: () => new Oo(y(Y), window),
			});
		}
		return t;
	})(),
	Oo = class {
		document;
		window;
		offset = () => [0, 0];
		constructor(n, e) {
			((this.document = n), (this.window = e));
		}
		setOffset(n) {
			Array.isArray(n) ? (this.offset = () => n) : (this.offset = n);
		}
		getScrollPosition() {
			return [this.window.scrollX, this.window.scrollY];
		}
		scrollToPosition(n) {
			this.window.scrollTo(n[0], n[1]);
		}
		scrollToAnchor(n) {
			let e = zf(this.document, n);
			e && (this.scrollToElement(e), e.focus());
		}
		setHistoryScrollRestoration(n) {
			this.window.history.scrollRestoration = n;
		}
		scrollToElement(n) {
			let e = n.getBoundingClientRect(),
				r = e.left + this.window.pageXOffset,
				i = e.top + this.window.pageYOffset,
				l = this.offset();
			this.window.scrollTo(r - l[0], i - l[1]);
		}
	};
function zf(t, n) {
	let e = t.getElementById(n) || t.getElementsByName(n)[0];
	if (e) return e;
	if (
		typeof t.createTreeWalker == "function" &&
		t.body &&
		typeof t.body.attachShadow == "function"
	) {
		let r = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT),
			i = r.currentNode;
		for (; i; ) {
			let l = i.shadowRoot;
			if (l) {
				let a = l.getElementById(n) || l.querySelector(`[name="${n}"]`);
				if (a) return a;
			}
			i = r.nextNode();
		}
	}
	return null;
}
var Gr = new S(""),
	No = (() => {
		class t {
			_zone;
			_plugins;
			_eventNameToPlugin = new Map();
			constructor(e, r) {
				((this._zone = r),
					e.forEach((i) => {
						i.manager = this;
					}),
					(this._plugins = e.slice().reverse()));
			}
			addEventListener(e, r, i, l) {
				return this._findPluginFor(r).addEventListener(e, r, i, l);
			}
			getZone() {
				return this._zone;
			}
			_findPluginFor(e) {
				let r = this._eventNameToPlugin.get(e);
				if (r) return r;
				if (((r = this._plugins.find((l) => l.supports(e))), !r))
					throw new T(5101, !1);
				return (this._eventNameToPlugin.set(e, r), r);
			}
			static ɵfac = function (r) {
				return new (r || t)(_(Gr), _(qe));
			};
			static ɵprov = E({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	Pn = class {
		_doc;
		constructor(n) {
			this._doc = n;
		}
		manager;
	},
	zr = "ng-app-id";
function Nl(t) {
	for (let n of t) n.remove();
}
function Ll(t, n) {
	let e = n.createElement("style");
	return ((e.textContent = t), e);
}
function Gf(t, n, e, r) {
	let i = t.head?.querySelectorAll(`style[${zr}="${n}"],link[${zr}="${n}"]`);
	if (i)
		for (let l of i)
			(l.removeAttribute(zr),
				l instanceof HTMLLinkElement
					? r.set(l.href.slice(l.href.lastIndexOf("/") + 1), {
							usage: 0,
							elements: [l],
						})
					: l.textContent && e.set(l.textContent, { usage: 0, elements: [l] }));
}
function ko(t, n) {
	let e = n.createElement("link");
	return (e.setAttribute("rel", "stylesheet"), e.setAttribute("href", t), e);
}
var Lo = (() => {
		class t {
			doc;
			appId;
			nonce;
			inline = new Map();
			external = new Map();
			hosts = new Set();
			isServer;
			constructor(e, r, i, l = {}) {
				((this.doc = e),
					(this.appId = r),
					(this.nonce = i),
					(this.isServer = $r(l)),
					Gf(e, r, this.inline, this.external),
					this.hosts.add(e.head));
			}
			addStyles(e, r) {
				for (let i of e) this.addUsage(i, this.inline, Ll);
				r?.forEach((i) => this.addUsage(i, this.external, ko));
			}
			removeStyles(e, r) {
				for (let i of e) this.removeUsage(i, this.inline);
				r?.forEach((i) => this.removeUsage(i, this.external));
			}
			addUsage(e, r, i) {
				let l = r.get(e);
				l
					? l.usage++
					: r.set(e, {
							usage: 1,
							elements: [...this.hosts].map((a) =>
								this.addElement(a, i(e, this.doc)),
							),
						});
			}
			removeUsage(e, r) {
				let i = r.get(e);
				i && (i.usage--, i.usage <= 0 && (Nl(i.elements), r.delete(e)));
			}
			ngOnDestroy() {
				for (let [, { elements: e }] of [...this.inline, ...this.external])
					Nl(e);
				this.hosts.clear();
			}
			addHost(e) {
				this.hosts.add(e);
				for (let [r, { elements: i }] of this.inline)
					i.push(this.addElement(e, Ll(r, this.doc)));
				for (let [r, { elements: i }] of this.external)
					i.push(this.addElement(e, ko(r, this.doc)));
			}
			removeHost(e) {
				this.hosts.delete(e);
			}
			addElement(e, r) {
				return (
					this.nonce && r.setAttribute("nonce", this.nonce),
					this.isServer && r.setAttribute(zr, this.appId),
					e.appendChild(r)
				);
			}
			static ɵfac = function (r) {
				return new (r || t)(_(Y), _(wo), _(vo, 8), _(Yt));
			};
			static ɵprov = E({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	Po = {
		svg: "http://www.w3.org/2000/svg",
		xhtml: "http://www.w3.org/1999/xhtml",
		xlink: "http://www.w3.org/1999/xlink",
		xml: "http://www.w3.org/XML/1998/namespace",
		xmlns: "http://www.w3.org/2000/xmlns/",
		math: "http://www.w3.org/1998/Math/MathML",
	},
	Bo = /%COMP%/g;
var Vl = "%COMP%",
	qf = `_nghost-${Vl}`,
	Wf = `_ngcontent-${Vl}`,
	Yf = !0,
	Zf = new S("", { providedIn: "root", factory: () => Yf });
function Xf(t) {
	return Wf.replace(Bo, t);
}
function Kf(t) {
	return qf.replace(Bo, t);
}
function Ul(t, n) {
	return n.map((e) => e.replace(Bo, t));
}
var Vo = (() => {
		class t {
			eventManager;
			sharedStylesHost;
			appId;
			removeStylesOnCompDestroy;
			doc;
			platformId;
			ngZone;
			nonce;
			tracingService;
			rendererByCompId = new Map();
			defaultRenderer;
			platformIsServer;
			constructor(e, r, i, l, a, d, h, g = null, w = null) {
				((this.eventManager = e),
					(this.sharedStylesHost = r),
					(this.appId = i),
					(this.removeStylesOnCompDestroy = l),
					(this.doc = a),
					(this.platformId = d),
					(this.ngZone = h),
					(this.nonce = g),
					(this.tracingService = w),
					(this.platformIsServer = $r(d)),
					(this.defaultRenderer = new kn(
						e,
						a,
						h,
						this.platformIsServer,
						this.tracingService,
					)));
			}
			createRenderer(e, r) {
				if (!e || !r) return this.defaultRenderer;
				this.platformIsServer &&
					r.encapsulation === En.ShadowDom &&
					(r = j(v({}, r), { encapsulation: En.Emulated }));
				let i = this.getOrCreateRenderer(e, r);
				return (
					i instanceof Hr
						? i.applyToHost(e)
						: i instanceof xn && i.applyStyles(),
					i
				);
			}
			getOrCreateRenderer(e, r) {
				let i = this.rendererByCompId,
					l = i.get(r.id);
				if (!l) {
					let a = this.doc,
						d = this.ngZone,
						h = this.eventManager,
						g = this.sharedStylesHost,
						w = this.removeStylesOnCompDestroy,
						f = this.platformIsServer,
						I = this.tracingService;
					switch (r.encapsulation) {
						case En.Emulated:
							l = new Hr(h, g, r, this.appId, w, a, d, f, I);
							break;
						case En.ShadowDom:
							return new xo(h, g, e, r, a, d, this.nonce, f, I);
						default:
							l = new xn(h, g, r, w, a, d, f, I);
							break;
					}
					i.set(r.id, l);
				}
				return l;
			}
			ngOnDestroy() {
				this.rendererByCompId.clear();
			}
			componentReplaced(e) {
				this.rendererByCompId.delete(e);
			}
			static ɵfac = function (r) {
				return new (r || t)(
					_(No),
					_(Lo),
					_(wo),
					_(Zf),
					_(Y),
					_(Yt),
					_(qe),
					_(vo),
					_(Ya, 8),
				);
			};
			static ɵprov = E({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	kn = class {
		eventManager;
		doc;
		ngZone;
		platformIsServer;
		tracingService;
		data = Object.create(null);
		throwOnSyntheticProps = !0;
		constructor(n, e, r, i, l) {
			((this.eventManager = n),
				(this.doc = e),
				(this.ngZone = r),
				(this.platformIsServer = i),
				(this.tracingService = l));
		}
		destroy() {}
		destroyNode = null;
		createElement(n, e) {
			return e
				? this.doc.createElementNS(Po[e] || e, n)
				: this.doc.createElement(n);
		}
		createComment(n) {
			return this.doc.createComment(n);
		}
		createText(n) {
			return this.doc.createTextNode(n);
		}
		appendChild(n, e) {
			(Bl(n) ? n.content : n).appendChild(e);
		}
		insertBefore(n, e, r) {
			n && (Bl(n) ? n.content : n).insertBefore(e, r);
		}
		removeChild(n, e) {
			e.remove();
		}
		selectRootElement(n, e) {
			let r = typeof n == "string" ? this.doc.querySelector(n) : n;
			if (!r) throw new T(-5104, !1);
			return (e || (r.textContent = ""), r);
		}
		parentNode(n) {
			return n.parentNode;
		}
		nextSibling(n) {
			return n.nextSibling;
		}
		setAttribute(n, e, r, i) {
			if (i) {
				e = i + ":" + e;
				let l = Po[i];
				l ? n.setAttributeNS(l, e, r) : n.setAttribute(e, r);
			} else n.setAttribute(e, r);
		}
		removeAttribute(n, e, r) {
			if (r) {
				let i = Po[r];
				i ? n.removeAttributeNS(i, e) : n.removeAttribute(`${r}:${e}`);
			} else n.removeAttribute(e);
		}
		addClass(n, e) {
			n.classList.add(e);
		}
		removeClass(n, e) {
			n.classList.remove(e);
		}
		setStyle(n, e, r, i) {
			i & (Dt.DashCase | Dt.Important)
				? n.style.setProperty(e, r, i & Dt.Important ? "important" : "")
				: (n.style[e] = r);
		}
		removeStyle(n, e, r) {
			r & Dt.DashCase ? n.style.removeProperty(e) : (n.style[e] = "");
		}
		setProperty(n, e, r) {
			n != null && (n[e] = r);
		}
		setValue(n, e) {
			n.nodeValue = e;
		}
		listen(n, e, r, i) {
			if (
				typeof n == "string" &&
				((n = be().getGlobalEventTarget(this.doc, n)), !n)
			)
				throw new T(5102, !1);
			let l = this.decoratePreventDefault(r);
			return (
				this.tracingService?.wrapEventListener &&
					(l = this.tracingService.wrapEventListener(n, e, l)),
				this.eventManager.addEventListener(n, e, l, i)
			);
		}
		decoratePreventDefault(n) {
			return (e) => {
				if (e === "__ngUnwrap__") return n;
				(this.platformIsServer ? this.ngZone.runGuarded(() => n(e)) : n(e)) ===
					!1 && e.preventDefault();
			};
		}
	};
function Bl(t) {
	return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var xo = class extends kn {
		sharedStylesHost;
		hostEl;
		shadowRoot;
		constructor(n, e, r, i, l, a, d, h, g) {
			(super(n, l, a, h, g),
				(this.sharedStylesHost = e),
				(this.hostEl = r),
				(this.shadowRoot = r.attachShadow({ mode: "open" })),
				this.sharedStylesHost.addHost(this.shadowRoot));
			let w = i.styles;
			w = Ul(i.id, w);
			for (let I of w) {
				let F = document.createElement("style");
				(d && F.setAttribute("nonce", d),
					(F.textContent = I),
					this.shadowRoot.appendChild(F));
			}
			let f = i.getExternalStyles?.();
			if (f)
				for (let I of f) {
					let F = ko(I, l);
					(d && F.setAttribute("nonce", d), this.shadowRoot.appendChild(F));
				}
		}
		nodeOrShadowRoot(n) {
			return n === this.hostEl ? this.shadowRoot : n;
		}
		appendChild(n, e) {
			return super.appendChild(this.nodeOrShadowRoot(n), e);
		}
		insertBefore(n, e, r) {
			return super.insertBefore(this.nodeOrShadowRoot(n), e, r);
		}
		removeChild(n, e) {
			return super.removeChild(null, e);
		}
		parentNode(n) {
			return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)));
		}
		destroy() {
			this.sharedStylesHost.removeHost(this.shadowRoot);
		}
	},
	xn = class extends kn {
		sharedStylesHost;
		removeStylesOnCompDestroy;
		styles;
		styleUrls;
		constructor(n, e, r, i, l, a, d, h, g) {
			(super(n, l, a, d, h),
				(this.sharedStylesHost = e),
				(this.removeStylesOnCompDestroy = i));
			let w = r.styles;
			((this.styles = g ? Ul(g, w) : w),
				(this.styleUrls = r.getExternalStyles?.(g)));
		}
		applyStyles() {
			this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
		}
		destroy() {
			this.removeStylesOnCompDestroy &&
				this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
		}
	},
	Hr = class extends xn {
		contentAttr;
		hostAttr;
		constructor(n, e, r, i, l, a, d, h, g) {
			let w = i + "-" + r.id;
			(super(n, e, r, l, a, d, h, g, w),
				(this.contentAttr = Xf(w)),
				(this.hostAttr = Kf(w)));
		}
		applyToHost(n) {
			(this.applyStyles(), this.setAttribute(n, this.hostAttr, ""));
		}
		createElement(n, e) {
			let r = super.createElement(n, e);
			return (super.setAttribute(r, this.contentAttr, ""), r);
		}
	};
var qr = class t extends Sn {
		supportsDOMEvents = !0;
		static makeCurrent() {
			Ao(new t());
		}
		onAndCancel(n, e, r, i) {
			return (
				n.addEventListener(e, r, i),
				() => {
					n.removeEventListener(e, r, i);
				}
			);
		}
		dispatchEvent(n, e) {
			n.dispatchEvent(e);
		}
		remove(n) {
			n.remove();
		}
		createElement(n, e) {
			return ((e = e || this.getDefaultDocument()), e.createElement(n));
		}
		createHtmlDocument() {
			return document.implementation.createHTMLDocument("fakeTitle");
		}
		getDefaultDocument() {
			return document;
		}
		isElementNode(n) {
			return n.nodeType === Node.ELEMENT_NODE;
		}
		isShadowRoot(n) {
			return n instanceof DocumentFragment;
		}
		getGlobalEventTarget(n, e) {
			return e === "window"
				? window
				: e === "document"
					? n
					: e === "body"
						? n.body
						: null;
		}
		getBaseHref(n) {
			let e = Jf();
			return e == null ? null : Qf(e);
		}
		resetBaseElement() {
			Nn = null;
		}
		getUserAgent() {
			return window.navigator.userAgent;
		}
		getCookie(n) {
			return On(document.cookie, n);
		}
	},
	Nn = null;
function Jf() {
	return (
		(Nn = Nn || document.head.querySelector("base")),
		Nn ? Nn.getAttribute("href") : null
	);
}
function Qf(t) {
	return new URL(t, document.baseURI).pathname;
}
var ep = (() => {
		class t {
			build() {
				return new XMLHttpRequest();
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = E({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	$l = (() => {
		class t extends Pn {
			constructor(e) {
				super(e);
			}
			supports(e) {
				return !0;
			}
			addEventListener(e, r, i, l) {
				return (
					e.addEventListener(r, i, l),
					() => this.removeEventListener(e, r, i, l)
				);
			}
			removeEventListener(e, r, i, l) {
				return e.removeEventListener(r, i, l);
			}
			static ɵfac = function (r) {
				return new (r || t)(_(Y));
			};
			static ɵprov = E({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	jl = ["alt", "control", "meta", "shift"],
	tp = {
		"\b": "Backspace",
		"	": "Tab",
		"\x7F": "Delete",
		"\x1B": "Escape",
		Del: "Delete",
		Esc: "Escape",
		Left: "ArrowLeft",
		Right: "ArrowRight",
		Up: "ArrowUp",
		Down: "ArrowDown",
		Menu: "ContextMenu",
		Scroll: "ScrollLock",
		Win: "OS",
	},
	np = {
		alt: (t) => t.altKey,
		control: (t) => t.ctrlKey,
		meta: (t) => t.metaKey,
		shift: (t) => t.shiftKey,
	},
	zl = (() => {
		class t extends Pn {
			constructor(e) {
				super(e);
			}
			supports(e) {
				return t.parseEventName(e) != null;
			}
			addEventListener(e, r, i, l) {
				let a = t.parseEventName(r),
					d = t.eventCallback(a.fullKey, i, this.manager.getZone());
				return this.manager
					.getZone()
					.runOutsideAngular(() => be().onAndCancel(e, a.domEventName, d, l));
			}
			static parseEventName(e) {
				let r = e.toLowerCase().split("."),
					i = r.shift();
				if (r.length === 0 || !(i === "keydown" || i === "keyup")) return null;
				let l = t._normalizeKey(r.pop()),
					a = "",
					d = r.indexOf("code");
				if (
					(d > -1 && (r.splice(d, 1), (a = "code.")),
					jl.forEach((g) => {
						let w = r.indexOf(g);
						w > -1 && (r.splice(w, 1), (a += g + "."));
					}),
					(a += l),
					r.length != 0 || l.length === 0)
				)
					return null;
				let h = {};
				return ((h.domEventName = i), (h.fullKey = a), h);
			}
			static matchEventFullKeyCode(e, r) {
				let i = tp[e.key] || e.key,
					l = "";
				return (
					r.indexOf("code.") > -1 && ((i = e.code), (l = "code.")),
					i == null || !i
						? !1
						: ((i = i.toLowerCase()),
							i === " " ? (i = "space") : i === "." && (i = "dot"),
							jl.forEach((a) => {
								if (a !== i) {
									let d = np[a];
									d(e) && (l += a + ".");
								}
							}),
							(l += i),
							l === r)
				);
			}
			static eventCallback(e, r, i) {
				return (l) => {
					t.matchEventFullKeyCode(l, e) && i.runGuarded(() => r(l));
				};
			}
			static _normalizeKey(e) {
				return e === "esc" ? "escape" : e;
			}
			static ɵfac = function (r) {
				return new (r || t)(_(Y));
			};
			static ɵprov = E({ token: t, factory: t.ɵfac });
		}
		return t;
	})();
function rp(t, n, e) {
	return ll(v({ rootComponent: t, platformRef: e?.platformRef }, ip(n)));
}
function ip(t) {
	return {
		appProviders: [...up, ...(t?.providers ?? [])],
		platformProviders: lp,
	};
}
function op() {
	qr.makeCurrent();
}
function sp() {
	return new mo();
}
function ap() {
	return (qa(document), document);
}
var lp = [
	{ provide: Yt, useValue: jr },
	{ provide: Wa, useValue: op, multi: !0 },
	{ provide: Y, useFactory: ap },
];
var up = [
	{ provide: Ha, useValue: "root" },
	{ provide: mo, useFactory: sp },
	{ provide: Gr, useClass: $l, multi: !0, deps: [Y] },
	{ provide: Gr, useClass: zl, multi: !0, deps: [Y] },
	Vo,
	Lo,
	No,
	{ provide: Ka, useExisting: Vo },
	{ provide: _t, useClass: ep },
	[],
];
var Kt = class {},
	Ln = class {},
	lt = class t {
		headers;
		normalizedNames = new Map();
		lazyInit;
		lazyUpdate = null;
		constructor(n) {
			n
				? typeof n == "string"
					? (this.lazyInit = () => {
							((this.headers = new Map()),
								n
									.split(
										`
`,
									)
									.forEach((e) => {
										let r = e.indexOf(":");
										if (r > 0) {
											let i = e.slice(0, r),
												l = e.slice(r + 1).trim();
											this.addHeaderEntry(i, l);
										}
									}));
						})
					: typeof Headers < "u" && n instanceof Headers
						? ((this.headers = new Map()),
							n.forEach((e, r) => {
								this.addHeaderEntry(r, e);
							}))
						: (this.lazyInit = () => {
								((this.headers = new Map()),
									Object.entries(n).forEach(([e, r]) => {
										this.setHeaderEntries(e, r);
									}));
							})
				: (this.headers = new Map());
		}
		has(n) {
			return (this.init(), this.headers.has(n.toLowerCase()));
		}
		get(n) {
			this.init();
			let e = this.headers.get(n.toLowerCase());
			return e && e.length > 0 ? e[0] : null;
		}
		keys() {
			return (this.init(), Array.from(this.normalizedNames.values()));
		}
		getAll(n) {
			return (this.init(), this.headers.get(n.toLowerCase()) || null);
		}
		append(n, e) {
			return this.clone({ name: n, value: e, op: "a" });
		}
		set(n, e) {
			return this.clone({ name: n, value: e, op: "s" });
		}
		delete(n, e) {
			return this.clone({ name: n, value: e, op: "d" });
		}
		maybeSetNormalizedName(n, e) {
			this.normalizedNames.has(e) || this.normalizedNames.set(e, n);
		}
		init() {
			this.lazyInit &&
				(this.lazyInit instanceof t
					? this.copyFrom(this.lazyInit)
					: this.lazyInit(),
				(this.lazyInit = null),
				this.lazyUpdate &&
					(this.lazyUpdate.forEach((n) => this.applyUpdate(n)),
					(this.lazyUpdate = null)));
		}
		copyFrom(n) {
			(n.init(),
				Array.from(n.headers.keys()).forEach((e) => {
					(this.headers.set(e, n.headers.get(e)),
						this.normalizedNames.set(e, n.normalizedNames.get(e)));
				}));
		}
		clone(n) {
			let e = new t();
			return (
				(e.lazyInit =
					this.lazyInit && this.lazyInit instanceof t ? this.lazyInit : this),
				(e.lazyUpdate = (this.lazyUpdate || []).concat([n])),
				e
			);
		}
		applyUpdate(n) {
			let e = n.name.toLowerCase();
			switch (n.op) {
				case "a":
				case "s":
					let r = n.value;
					if ((typeof r == "string" && (r = [r]), r.length === 0)) return;
					this.maybeSetNormalizedName(n.name, e);
					let i = (n.op === "a" ? this.headers.get(e) : void 0) || [];
					(i.push(...r), this.headers.set(e, i));
					break;
				case "d":
					let l = n.value;
					if (!l) (this.headers.delete(e), this.normalizedNames.delete(e));
					else {
						let a = this.headers.get(e);
						if (!a) return;
						((a = a.filter((d) => l.indexOf(d) === -1)),
							a.length === 0
								? (this.headers.delete(e), this.normalizedNames.delete(e))
								: this.headers.set(e, a));
					}
					break;
			}
		}
		addHeaderEntry(n, e) {
			let r = n.toLowerCase();
			(this.maybeSetNormalizedName(n, r),
				this.headers.has(r)
					? this.headers.get(r).push(e)
					: this.headers.set(r, [e]));
		}
		setHeaderEntries(n, e) {
			let r = (Array.isArray(e) ? e : [e]).map((l) => l.toString()),
				i = n.toLowerCase();
			(this.headers.set(i, r), this.maybeSetNormalizedName(n, i));
		}
		forEach(n) {
			(this.init(),
				Array.from(this.normalizedNames.keys()).forEach((e) =>
					n(this.normalizedNames.get(e), this.headers.get(e)),
				));
		}
	};
var Yr = class {
	encodeKey(n) {
		return Hl(n);
	}
	encodeValue(n) {
		return Hl(n);
	}
	decodeKey(n) {
		return decodeURIComponent(n);
	}
	decodeValue(n) {
		return decodeURIComponent(n);
	}
};
function cp(t, n) {
	let e = new Map();
	return (
		t.length > 0 &&
			t
				.replace(/^\?/, "")
				.split("&")
				.forEach((i) => {
					let l = i.indexOf("="),
						[a, d] =
							l == -1
								? [n.decodeKey(i), ""]
								: [n.decodeKey(i.slice(0, l)), n.decodeValue(i.slice(l + 1))],
						h = e.get(a) || [];
					(h.push(d), e.set(a, h));
				}),
		e
	);
}
var dp = /%(\d[a-f0-9])/gi,
	hp = {
		40: "@",
		"3A": ":",
		24: "$",
		"2C": ",",
		"3B": ";",
		"3D": "=",
		"3F": "?",
		"2F": "/",
	};
function Hl(t) {
	return encodeURIComponent(t).replace(dp, (n, e) => hp[e] ?? n);
}
function Wr(t) {
	return `${t}`;
}
var Xe = class t {
	map;
	encoder;
	updates = null;
	cloneFrom = null;
	constructor(n = {}) {
		if (((this.encoder = n.encoder || new Yr()), n.fromString)) {
			if (n.fromObject) throw new T(2805, !1);
			this.map = cp(n.fromString, this.encoder);
		} else
			n.fromObject
				? ((this.map = new Map()),
					Object.keys(n.fromObject).forEach((e) => {
						let r = n.fromObject[e],
							i = Array.isArray(r) ? r.map(Wr) : [Wr(r)];
						this.map.set(e, i);
					}))
				: (this.map = null);
	}
	has(n) {
		return (this.init(), this.map.has(n));
	}
	get(n) {
		this.init();
		let e = this.map.get(n);
		return e ? e[0] : null;
	}
	getAll(n) {
		return (this.init(), this.map.get(n) || null);
	}
	keys() {
		return (this.init(), Array.from(this.map.keys()));
	}
	append(n, e) {
		return this.clone({ param: n, value: e, op: "a" });
	}
	appendAll(n) {
		let e = [];
		return (
			Object.keys(n).forEach((r) => {
				let i = n[r];
				Array.isArray(i)
					? i.forEach((l) => {
							e.push({ param: r, value: l, op: "a" });
						})
					: e.push({ param: r, value: i, op: "a" });
			}),
			this.clone(e)
		);
	}
	set(n, e) {
		return this.clone({ param: n, value: e, op: "s" });
	}
	delete(n, e) {
		return this.clone({ param: n, value: e, op: "d" });
	}
	toString() {
		return (
			this.init(),
			this.keys()
				.map((n) => {
					let e = this.encoder.encodeKey(n);
					return this.map
						.get(n)
						.map((r) => e + "=" + this.encoder.encodeValue(r))
						.join("&");
				})
				.filter((n) => n !== "")
				.join("&")
		);
	}
	clone(n) {
		let e = new t({ encoder: this.encoder });
		return (
			(e.cloneFrom = this.cloneFrom || this),
			(e.updates = (this.updates || []).concat(n)),
			e
		);
	}
	init() {
		(this.map === null && (this.map = new Map()),
			this.cloneFrom !== null &&
				(this.cloneFrom.init(),
				this.cloneFrom
					.keys()
					.forEach((n) => this.map.set(n, this.cloneFrom.map.get(n))),
				this.updates.forEach((n) => {
					switch (n.op) {
						case "a":
						case "s":
							let e = (n.op === "a" ? this.map.get(n.param) : void 0) || [];
							(e.push(Wr(n.value)), this.map.set(n.param, e));
							break;
						case "d":
							if (n.value !== void 0) {
								let r = this.map.get(n.param) || [],
									i = r.indexOf(Wr(n.value));
								(i !== -1 && r.splice(i, 1),
									r.length > 0
										? this.map.set(n.param, r)
										: this.map.delete(n.param));
							} else {
								this.map.delete(n.param);
								break;
							}
					}
				}),
				(this.cloneFrom = this.updates = null)));
	}
};
var Zr = class {
	map = new Map();
	set(n, e) {
		return (this.map.set(n, e), this);
	}
	get(n) {
		return (
			this.map.has(n) || this.map.set(n, n.defaultValue()),
			this.map.get(n)
		);
	}
	delete(n) {
		return (this.map.delete(n), this);
	}
	has(n) {
		return this.map.has(n);
	}
	keys() {
		return this.map.keys();
	}
};
function fp(t) {
	switch (t) {
		case "DELETE":
		case "GET":
		case "HEAD":
		case "OPTIONS":
		case "JSONP":
			return !1;
		default:
			return !0;
	}
}
function Gl(t) {
	return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer;
}
function ql(t) {
	return typeof Blob < "u" && t instanceof Blob;
}
function Wl(t) {
	return typeof FormData < "u" && t instanceof FormData;
}
function pp(t) {
	return typeof URLSearchParams < "u" && t instanceof URLSearchParams;
}
var Yl = "Content-Type",
	Zl = "Accept",
	Xl = "X-Request-URL",
	Kl = "text/plain",
	Jl = "application/json",
	gp = `${Jl}, ${Kl}, */*`,
	Xt = class t {
		url;
		body = null;
		headers;
		context;
		reportProgress = !1;
		withCredentials = !1;
		responseType = "json";
		method;
		params;
		urlWithParams;
		transferCache;
		constructor(n, e, r, i) {
			((this.url = e), (this.method = n.toUpperCase()));
			let l;
			if (
				(fp(this.method) || i
					? ((this.body = r !== void 0 ? r : null), (l = i))
					: (l = r),
				l &&
					((this.reportProgress = !!l.reportProgress),
					(this.withCredentials = !!l.withCredentials),
					l.responseType && (this.responseType = l.responseType),
					l.headers && (this.headers = l.headers),
					l.context && (this.context = l.context),
					l.params && (this.params = l.params),
					(this.transferCache = l.transferCache)),
				(this.headers ??= new lt()),
				(this.context ??= new Zr()),
				!this.params)
			)
				((this.params = new Xe()), (this.urlWithParams = e));
			else {
				let a = this.params.toString();
				if (a.length === 0) this.urlWithParams = e;
				else {
					let d = e.indexOf("?"),
						h = d === -1 ? "?" : d < e.length - 1 ? "&" : "";
					this.urlWithParams = e + h + a;
				}
			}
		}
		serializeBody() {
			return this.body === null
				? null
				: typeof this.body == "string" ||
					  Gl(this.body) ||
					  ql(this.body) ||
					  Wl(this.body) ||
					  pp(this.body)
					? this.body
					: this.body instanceof Xe
						? this.body.toString()
						: typeof this.body == "object" ||
							  typeof this.body == "boolean" ||
							  Array.isArray(this.body)
							? JSON.stringify(this.body)
							: this.body.toString();
		}
		detectContentTypeHeader() {
			return this.body === null || Wl(this.body)
				? null
				: ql(this.body)
					? this.body.type || null
					: Gl(this.body)
						? null
						: typeof this.body == "string"
							? Kl
							: this.body instanceof Xe
								? "application/x-www-form-urlencoded;charset=UTF-8"
								: typeof this.body == "object" ||
									  typeof this.body == "number" ||
									  typeof this.body == "boolean"
									? Jl
									: null;
		}
		clone(n = {}) {
			let e = n.method || this.method,
				r = n.url || this.url,
				i = n.responseType || this.responseType,
				l = n.transferCache ?? this.transferCache,
				a = n.body !== void 0 ? n.body : this.body,
				d = n.withCredentials ?? this.withCredentials,
				h = n.reportProgress ?? this.reportProgress,
				g = n.headers || this.headers,
				w = n.params || this.params,
				f = n.context ?? this.context;
			return (
				n.setHeaders !== void 0 &&
					(g = Object.keys(n.setHeaders).reduce(
						(I, F) => I.set(F, n.setHeaders[F]),
						g,
					)),
				n.setParams &&
					(w = Object.keys(n.setParams).reduce(
						(I, F) => I.set(F, n.setParams[F]),
						w,
					)),
				new t(e, r, a, {
					params: w,
					headers: g,
					context: f,
					reportProgress: h,
					responseType: i,
					withCredentials: d,
					transferCache: l,
				})
			);
		}
	},
	At = (function (t) {
		return (
			(t[(t.Sent = 0)] = "Sent"),
			(t[(t.UploadProgress = 1)] = "UploadProgress"),
			(t[(t.ResponseHeader = 2)] = "ResponseHeader"),
			(t[(t.DownloadProgress = 3)] = "DownloadProgress"),
			(t[(t.Response = 4)] = "Response"),
			(t[(t.User = 5)] = "User"),
			t
		);
	})(At || {}),
	Jt = class {
		headers;
		status;
		statusText;
		url;
		ok;
		type;
		constructor(n, e = 200, r = "OK") {
			((this.headers = n.headers || new lt()),
				(this.status = n.status !== void 0 ? n.status : e),
				(this.statusText = n.statusText || r),
				(this.url = n.url || null),
				(this.ok = this.status >= 200 && this.status < 300));
		}
	},
	Xr = class t extends Jt {
		constructor(n = {}) {
			super(n);
		}
		type = At.ResponseHeader;
		clone(n = {}) {
			return new t({
				headers: n.headers || this.headers,
				status: n.status !== void 0 ? n.status : this.status,
				statusText: n.statusText || this.statusText,
				url: n.url || this.url || void 0,
			});
		}
	},
	Bn = class t extends Jt {
		body;
		constructor(n = {}) {
			(super(n), (this.body = n.body !== void 0 ? n.body : null));
		}
		type = At.Response;
		clone(n = {}) {
			return new t({
				body: n.body !== void 0 ? n.body : this.body,
				headers: n.headers || this.headers,
				status: n.status !== void 0 ? n.status : this.status,
				statusText: n.statusText || this.statusText,
				url: n.url || this.url || void 0,
			});
		}
	},
	Vn = class extends Jt {
		name = "HttpErrorResponse";
		message;
		error;
		ok = !1;
		constructor(n) {
			(super(n, 0, "Unknown Error"),
				this.status >= 200 && this.status < 300
					? (this.message = `Http failure during parsing for ${n.url || "(unknown url)"}`)
					: (this.message = `Http failure response for ${n.url || "(unknown url)"}: ${n.status} ${n.statusText}`),
				(this.error = n.error || null));
		}
	},
	mp = 200,
	wp = 204;
function Uo(t, n) {
	return {
		body: n,
		headers: t.headers,
		context: t.context,
		observe: t.observe,
		params: t.params,
		reportProgress: t.reportProgress,
		responseType: t.responseType,
		withCredentials: t.withCredentials,
		transferCache: t.transferCache,
	};
}
var Ql = (() => {
	class t {
		handler;
		constructor(e) {
			this.handler = e;
		}
		request(e, r, i = {}) {
			let l;
			if (e instanceof Xt) l = e;
			else {
				let h;
				i.headers instanceof lt ? (h = i.headers) : (h = new lt(i.headers));
				let g;
				(i.params &&
					(i.params instanceof Xe
						? (g = i.params)
						: (g = new Xe({ fromObject: i.params }))),
					(l = new Xt(e, r, i.body !== void 0 ? i.body : null, {
						headers: h,
						context: i.context,
						params: g,
						reportProgress: i.reportProgress,
						responseType: i.responseType || "json",
						withCredentials: i.withCredentials,
						transferCache: i.transferCache,
					})));
			}
			let a = D(l).pipe(Ge((h) => this.handler.handle(h)));
			if (e instanceof Xt || i.observe === "events") return a;
			let d = a.pipe(xe((h) => h instanceof Bn));
			switch (i.observe || "body") {
				case "body":
					switch (l.responseType) {
						case "arraybuffer":
							return d.pipe(
								P((h) => {
									if (h.body !== null && !(h.body instanceof ArrayBuffer))
										throw new T(2806, !1);
									return h.body;
								}),
							);
						case "blob":
							return d.pipe(
								P((h) => {
									if (h.body !== null && !(h.body instanceof Blob))
										throw new T(2807, !1);
									return h.body;
								}),
							);
						case "text":
							return d.pipe(
								P((h) => {
									if (h.body !== null && typeof h.body != "string")
										throw new T(2808, !1);
									return h.body;
								}),
							);
						case "json":
						default:
							return d.pipe(P((h) => h.body));
					}
				case "response":
					return d;
				default:
					throw new T(2809, !1);
			}
		}
		delete(e, r = {}) {
			return this.request("DELETE", e, r);
		}
		get(e, r = {}) {
			return this.request("GET", e, r);
		}
		head(e, r = {}) {
			return this.request("HEAD", e, r);
		}
		jsonp(e, r) {
			return this.request("JSONP", e, {
				params: new Xe().append(r, "JSONP_CALLBACK"),
				observe: "body",
				responseType: "json",
			});
		}
		options(e, r = {}) {
			return this.request("OPTIONS", e, r);
		}
		patch(e, r, i = {}) {
			return this.request("PATCH", e, Uo(i, r));
		}
		post(e, r, i = {}) {
			return this.request("POST", e, Uo(i, r));
		}
		put(e, r, i = {}) {
			return this.request("PUT", e, Uo(i, r));
		}
		static ɵfac = function (r) {
			return new (r || t)(_(Kt));
		};
		static ɵprov = E({ token: t, factory: t.ɵfac });
	}
	return t;
})();
var vp = new S("");
function yp(t, n) {
	return n(t);
}
function bp(t, n, e) {
	return (r, i) => we(e, () => n(r, (l) => t(l, i)));
}
var $o = new S(""),
	eu = new S(""),
	tu = new S("", { providedIn: "root", factory: () => !0 });
var Kr = (() => {
	class t extends Kt {
		backend;
		injector;
		chain = null;
		pendingTasks = y(Rr);
		contributeToStability = y(tu);
		constructor(e, r) {
			(super(), (this.backend = e), (this.injector = r));
		}
		handle(e) {
			if (this.chain === null) {
				let r = Array.from(
					new Set([...this.injector.get($o), ...this.injector.get(eu, [])]),
				);
				this.chain = r.reduceRight((i, l) => bp(i, l, this.injector), yp);
			}
			if (this.contributeToStability) {
				let r = this.pendingTasks.add();
				return this.chain(e, (i) => this.backend.handle(i)).pipe(
					qt(() => this.pendingTasks.remove(r)),
				);
			} else return this.chain(e, (r) => this.backend.handle(r));
		}
		static ɵfac = function (r) {
			return new (r || t)(_(Ln), _(nt));
		};
		static ɵprov = E({ token: t, factory: t.ɵfac });
	}
	return t;
})();
var Dp = /^\)\]\}',?\n/,
	Cp = RegExp(`^${Xl}:`, "m");
function Ep(t) {
	return "responseURL" in t && t.responseURL
		? t.responseURL
		: Cp.test(t.getAllResponseHeaders())
			? t.getResponseHeader(Xl)
			: null;
}
var jo = (() => {
		class t {
			xhrFactory;
			constructor(e) {
				this.xhrFactory = e;
			}
			handle(e) {
				if (e.method === "JSONP") throw new T(-2800, !1);
				let r = this.xhrFactory;
				return (r.ɵloadImpl ? Q(r.ɵloadImpl()) : D(null)).pipe(
					he(
						() =>
							new ka((l) => {
								let a = r.build();
								if (
									(a.open(e.method, e.urlWithParams),
									e.withCredentials && (a.withCredentials = !0),
									e.headers.forEach((M, b) =>
										a.setRequestHeader(M, b.join(",")),
									),
									e.headers.has(Zl) || a.setRequestHeader(Zl, gp),
									!e.headers.has(Yl))
								) {
									let M = e.detectContentTypeHeader();
									M !== null && a.setRequestHeader(Yl, M);
								}
								if (e.responseType) {
									let M = e.responseType.toLowerCase();
									a.responseType = M !== "json" ? M : "text";
								}
								let d = e.serializeBody(),
									h = null,
									g = () => {
										if (h !== null) return h;
										let M = a.statusText || "OK",
											b = new lt(a.getAllResponseHeaders()),
											K = Ep(a) || e.url;
										return (
											(h = new Xr({
												headers: b,
												status: a.status,
												statusText: M,
												url: K,
											})),
											h
										);
									},
									w = () => {
										let { headers: M, status: b, statusText: K, url: gt } = g(),
											H = null;
										(b !== wp &&
											(H =
												typeof a.response > "u" ? a.responseText : a.response),
											b === 0 && (b = H ? mp : 0));
										let xt = b >= 200 && b < 300;
										if (e.responseType === "json" && typeof H == "string") {
											let Nt = H;
											H = H.replace(Dp, "");
											try {
												H = H !== "" ? JSON.parse(H) : null;
											} catch (pn) {
												((H = Nt),
													xt && ((xt = !1), (H = { error: pn, text: H })));
											}
										}
										xt
											? (l.next(
													new Bn({
														body: H,
														headers: M,
														status: b,
														statusText: K,
														url: gt || void 0,
													}),
												),
												l.complete())
											: l.error(
													new Vn({
														error: H,
														headers: M,
														status: b,
														statusText: K,
														url: gt || void 0,
													}),
												);
									},
									f = (M) => {
										let { url: b } = g(),
											K = new Vn({
												error: M,
												status: a.status || 0,
												statusText: a.statusText || "Unknown Error",
												url: b || void 0,
											});
										l.error(K);
									},
									I = !1,
									F = (M) => {
										I || (l.next(g()), (I = !0));
										let b = { type: At.DownloadProgress, loaded: M.loaded };
										(M.lengthComputable && (b.total = M.total),
											e.responseType === "text" &&
												a.responseText &&
												(b.partialText = a.responseText),
											l.next(b));
									},
									U = (M) => {
										let b = { type: At.UploadProgress, loaded: M.loaded };
										(M.lengthComputable && (b.total = M.total), l.next(b));
									};
								return (
									a.addEventListener("load", w),
									a.addEventListener("error", f),
									a.addEventListener("timeout", f),
									a.addEventListener("abort", f),
									e.reportProgress &&
										(a.addEventListener("progress", F),
										d !== null &&
											a.upload &&
											a.upload.addEventListener("progress", U)),
									a.send(d),
									l.next({ type: At.Sent }),
									() => {
										(a.removeEventListener("error", f),
											a.removeEventListener("abort", f),
											a.removeEventListener("load", w),
											a.removeEventListener("timeout", f),
											e.reportProgress &&
												(a.removeEventListener("progress", F),
												d !== null &&
													a.upload &&
													a.upload.removeEventListener("progress", U)),
											a.readyState !== a.DONE && a.abort());
									}
								);
							}),
					),
				);
			}
			static ɵfac = function (r) {
				return new (r || t)(_(_t));
			};
			static ɵprov = E({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	nu = new S(""),
	_p = "XSRF-TOKEN",
	Ap = new S("", { providedIn: "root", factory: () => _p }),
	Sp = "X-XSRF-TOKEN",
	Rp = new S("", { providedIn: "root", factory: () => Sp }),
	Un = class {},
	Mp = (() => {
		class t {
			doc;
			cookieName;
			lastCookieString = "";
			lastToken = null;
			parseCount = 0;
			constructor(e, r) {
				((this.doc = e), (this.cookieName = r));
			}
			getToken() {
				let e = this.doc.cookie || "";
				return (
					e !== this.lastCookieString &&
						(this.parseCount++,
						(this.lastToken = On(e, this.cookieName)),
						(this.lastCookieString = e)),
					this.lastToken
				);
			}
			static ɵfac = function (r) {
				return new (r || t)(_(Y), _(Ap));
			};
			static ɵprov = E({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	Tp = /^(?:https?:)?\/\//i;
function Ip(t, n) {
	if (!y(nu) || t.method === "GET" || t.method === "HEAD" || Tp.test(t.url))
		return n(t);
	let e = y(Un).getToken(),
		r = y(Rp);
	return (
		e != null &&
			!t.headers.has(r) &&
			(t = t.clone({ headers: t.headers.set(r, e) })),
		n(t)
	);
}
var zo = (function (t) {
	return (
		(t[(t.Interceptors = 0)] = "Interceptors"),
		(t[(t.LegacyInterceptors = 1)] = "LegacyInterceptors"),
		(t[(t.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
		(t[(t.NoXsrfProtection = 3)] = "NoXsrfProtection"),
		(t[(t.JsonpSupport = 4)] = "JsonpSupport"),
		(t[(t.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
		(t[(t.Fetch = 6)] = "Fetch"),
		t
	);
})(zo || {});
function Fp(t, n) {
	return { ɵkind: t, ɵproviders: n };
}
function Op(...t) {
	let n = [
		Ql,
		jo,
		Kr,
		{ provide: Kt, useExisting: Kr },
		{ provide: Ln, useFactory: () => y(vp, { optional: !0 }) ?? y(jo) },
		{ provide: $o, useValue: Ip, multi: !0 },
		{ provide: nu, useValue: !0 },
		{ provide: Un, useClass: Mp },
	];
	for (let e of t) n.push(...e.ɵproviders);
	return Sr(n);
}
function Pp(t) {
	return Fp(
		zo.Interceptors,
		t.map((n) => ({ provide: $o, useValue: n, multi: !0 })),
	);
}
var ru = (() => {
	class t {
		_doc;
		constructor(e) {
			this._doc = e;
		}
		getTitle() {
			return this._doc.title;
		}
		setTitle(e) {
			this._doc.title = e || "";
		}
		static ɵfac = function (r) {
			return new (r || t)(_(Y));
		};
		static ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" });
	}
	return t;
})();
var R = "primary",
	Qn = Symbol("RouteTitle"),
	Yo = class {
		params;
		constructor(n) {
			this.params = n || {};
		}
		has(n) {
			return Object.prototype.hasOwnProperty.call(this.params, n);
		}
		get(n) {
			if (this.has(n)) {
				let e = this.params[n];
				return Array.isArray(e) ? e[0] : e;
			}
			return null;
		}
		getAll(n) {
			if (this.has(n)) {
				let e = this.params[n];
				return Array.isArray(e) ? e : [e];
			}
			return [];
		}
		get keys() {
			return Object.keys(this.params);
		}
	};
function Mt(t) {
	return new Yo(t);
}
function du(t, n, e) {
	let r = e.path.split("/");
	if (
		r.length > t.length ||
		(e.pathMatch === "full" && (n.hasChildren() || r.length < t.length))
	)
		return null;
	let i = {};
	for (let l = 0; l < r.length; l++) {
		let a = r[l],
			d = t[l];
		if (a[0] === ":") i[a.substring(1)] = d;
		else if (a !== d.path) return null;
	}
	return { consumed: t.slice(0, r.length), posParams: i };
}
function xp(t, n) {
	if (t.length !== n.length) return !1;
	for (let e = 0; e < t.length; ++e) if (!Ne(t[e], n[e])) return !1;
	return !0;
}
function Ne(t, n) {
	let e = t ? Zo(t) : void 0,
		r = n ? Zo(n) : void 0;
	if (!e || !r || e.length != r.length) return !1;
	let i;
	for (let l = 0; l < e.length; l++)
		if (((i = e[l]), !hu(t[i], n[i]))) return !1;
	return !0;
}
function Zo(t) {
	return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function hu(t, n) {
	if (Array.isArray(t) && Array.isArray(n)) {
		if (t.length !== n.length) return !1;
		let e = [...t].sort(),
			r = [...n].sort();
		return e.every((i, l) => r[l] === i);
	} else return t === n;
}
function fu(t) {
	return t.length > 0 ? t[t.length - 1] : null;
}
function ft(t) {
	return xa(t) ? t : _n(t) ? Q(Promise.resolve(t)) : D(t);
}
var Np = { exact: gu, subset: mu },
	pu = { exact: Lp, subset: Bp, ignored: () => !0 };
function iu(t, n, e) {
	return (
		Np[e.paths](t.root, n.root, e.matrixParams) &&
		pu[e.queryParams](t.queryParams, n.queryParams) &&
		!(e.fragment === "exact" && t.fragment !== n.fragment)
	);
}
function Lp(t, n) {
	return Ne(t, n);
}
function gu(t, n, e) {
	if (
		!St(t.segments, n.segments) ||
		!ei(t.segments, n.segments, e) ||
		t.numberOfChildren !== n.numberOfChildren
	)
		return !1;
	for (let r in n.children)
		if (!t.children[r] || !gu(t.children[r], n.children[r], e)) return !1;
	return !0;
}
function Bp(t, n) {
	return (
		Object.keys(n).length <= Object.keys(t).length &&
		Object.keys(n).every((e) => hu(t[e], n[e]))
	);
}
function mu(t, n, e) {
	return wu(t, n, n.segments, e);
}
function wu(t, n, e, r) {
	if (t.segments.length > e.length) {
		let i = t.segments.slice(0, e.length);
		return !(!St(i, e) || n.hasChildren() || !ei(i, e, r));
	} else if (t.segments.length === e.length) {
		if (!St(t.segments, e) || !ei(t.segments, e, r)) return !1;
		for (let i in n.children)
			if (!t.children[i] || !mu(t.children[i], n.children[i], r)) return !1;
		return !0;
	} else {
		let i = e.slice(0, t.segments.length),
			l = e.slice(t.segments.length);
		return !St(t.segments, i) || !ei(t.segments, i, r) || !t.children[R]
			? !1
			: wu(t.children[R], n, l, r);
	}
}
function ei(t, n, e) {
	return n.every((r, i) => pu[e](t[i].parameters, r.parameters));
}
var Be = class {
		root;
		queryParams;
		fragment;
		_queryParamMap;
		constructor(n = new L([], {}), e = {}, r = null) {
			((this.root = n), (this.queryParams = e), (this.fragment = r));
		}
		get queryParamMap() {
			return (
				(this._queryParamMap ??= Mt(this.queryParams)),
				this._queryParamMap
			);
		}
		toString() {
			return jp.serialize(this);
		}
	},
	L = class {
		segments;
		children;
		parent = null;
		constructor(n, e) {
			((this.segments = n),
				(this.children = e),
				Object.values(e).forEach((r) => (r.parent = this)));
		}
		hasChildren() {
			return this.numberOfChildren > 0;
		}
		get numberOfChildren() {
			return Object.keys(this.children).length;
		}
		toString() {
			return ti(this);
		}
	},
	ut = class {
		path;
		parameters;
		_parameterMap;
		constructor(n, e) {
			((this.path = n), (this.parameters = e));
		}
		get parameterMap() {
			return ((this._parameterMap ??= Mt(this.parameters)), this._parameterMap);
		}
		toString() {
			return yu(this);
		}
	};
function Vp(t, n) {
	return St(t, n) && t.every((e, r) => Ne(e.parameters, n[r].parameters));
}
function St(t, n) {
	return t.length !== n.length ? !1 : t.every((e, r) => e.path === n[r].path);
}
function Up(t, n) {
	let e = [];
	return (
		Object.entries(t.children).forEach(([r, i]) => {
			r === R && (e = e.concat(n(i, r)));
		}),
		Object.entries(t.children).forEach(([r, i]) => {
			r !== R && (e = e.concat(n(i, r)));
		}),
		e
	);
}
var Tt = (() => {
		class t {
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = E({
				token: t,
				factory: () => new ct(),
				providedIn: "root",
			});
		}
		return t;
	})(),
	ct = class {
		parse(n) {
			let e = new Ko(n);
			return new Be(
				e.parseRootSegment(),
				e.parseQueryParams(),
				e.parseFragment(),
			);
		}
		serialize(n) {
			let e = `/${jn(n.root, !0)}`,
				r = Hp(n.queryParams),
				i = typeof n.fragment == "string" ? `#${$p(n.fragment)}` : "";
			return `${e}${r}${i}`;
		}
	},
	jp = new ct();
function ti(t) {
	return t.segments.map((n) => yu(n)).join("/");
}
function jn(t, n) {
	if (!t.hasChildren()) return ti(t);
	if (n) {
		let e = t.children[R] ? jn(t.children[R], !1) : "",
			r = [];
		return (
			Object.entries(t.children).forEach(([i, l]) => {
				i !== R && r.push(`${i}:${jn(l, !1)}`);
			}),
			r.length > 0 ? `${e}(${r.join("//")})` : e
		);
	} else {
		let e = Up(t, (r, i) =>
			i === R ? [jn(t.children[R], !1)] : [`${i}:${jn(r, !1)}`],
		);
		return Object.keys(t.children).length === 1 && t.children[R] != null
			? `${ti(t)}/${e[0]}`
			: `${ti(t)}/(${e.join("//")})`;
	}
}
function vu(t) {
	return encodeURIComponent(t)
		.replace(/%40/g, "@")
		.replace(/%3A/gi, ":")
		.replace(/%24/g, "$")
		.replace(/%2C/gi, ",");
}
function Jr(t) {
	return vu(t).replace(/%3B/gi, ";");
}
function $p(t) {
	return encodeURI(t);
}
function Xo(t) {
	return vu(t)
		.replace(/\(/g, "%28")
		.replace(/\)/g, "%29")
		.replace(/%26/gi, "&");
}
function ni(t) {
	return decodeURIComponent(t);
}
function ou(t) {
	return ni(t.replace(/\+/g, "%20"));
}
function yu(t) {
	return `${Xo(t.path)}${zp(t.parameters)}`;
}
function zp(t) {
	return Object.entries(t)
		.map(([n, e]) => `;${Xo(n)}=${Xo(e)}`)
		.join("");
}
function Hp(t) {
	let n = Object.entries(t)
		.map(([e, r]) =>
			Array.isArray(r)
				? r.map((i) => `${Jr(e)}=${Jr(i)}`).join("&")
				: `${Jr(e)}=${Jr(r)}`,
		)
		.filter((e) => e);
	return n.length ? `?${n.join("&")}` : "";
}
var Gp = /^[^\/()?;#]+/;
function Ho(t) {
	let n = t.match(Gp);
	return n ? n[0] : "";
}
var qp = /^[^\/()?;=#]+/;
function Wp(t) {
	let n = t.match(qp);
	return n ? n[0] : "";
}
var Yp = /^[^=?&#]+/;
function Zp(t) {
	let n = t.match(Yp);
	return n ? n[0] : "";
}
var Xp = /^[^&#]+/;
function Kp(t) {
	let n = t.match(Xp);
	return n ? n[0] : "";
}
var Ko = class {
	url;
	remaining;
	constructor(n) {
		((this.url = n), (this.remaining = n));
	}
	parseRootSegment() {
		return (
			this.consumeOptional("/"),
			this.remaining === "" ||
			this.peekStartsWith("?") ||
			this.peekStartsWith("#")
				? new L([], {})
				: new L([], this.parseChildren())
		);
	}
	parseQueryParams() {
		let n = {};
		if (this.consumeOptional("?"))
			do this.parseQueryParam(n);
			while (this.consumeOptional("&"));
		return n;
	}
	parseFragment() {
		return this.consumeOptional("#")
			? decodeURIComponent(this.remaining)
			: null;
	}
	parseChildren() {
		if (this.remaining === "") return {};
		this.consumeOptional("/");
		let n = [];
		for (
			this.peekStartsWith("(") || n.push(this.parseSegment());
			this.peekStartsWith("/") &&
			!this.peekStartsWith("//") &&
			!this.peekStartsWith("/(");
		)
			(this.capture("/"), n.push(this.parseSegment()));
		let e = {};
		this.peekStartsWith("/(") &&
			(this.capture("/"), (e = this.parseParens(!0)));
		let r = {};
		return (
			this.peekStartsWith("(") && (r = this.parseParens(!1)),
			(n.length > 0 || Object.keys(e).length > 0) && (r[R] = new L(n, e)),
			r
		);
	}
	parseSegment() {
		let n = Ho(this.remaining);
		if (n === "" && this.peekStartsWith(";")) throw new T(4009, !1);
		return (this.capture(n), new ut(ni(n), this.parseMatrixParams()));
	}
	parseMatrixParams() {
		let n = {};
		for (; this.consumeOptional(";"); ) this.parseParam(n);
		return n;
	}
	parseParam(n) {
		let e = Wp(this.remaining);
		if (!e) return;
		this.capture(e);
		let r = "";
		if (this.consumeOptional("=")) {
			let i = Ho(this.remaining);
			i && ((r = i), this.capture(r));
		}
		n[ni(e)] = ni(r);
	}
	parseQueryParam(n) {
		let e = Zp(this.remaining);
		if (!e) return;
		this.capture(e);
		let r = "";
		if (this.consumeOptional("=")) {
			let a = Kp(this.remaining);
			a && ((r = a), this.capture(r));
		}
		let i = ou(e),
			l = ou(r);
		if (n.hasOwnProperty(i)) {
			let a = n[i];
			(Array.isArray(a) || ((a = [a]), (n[i] = a)), a.push(l));
		} else n[i] = l;
	}
	parseParens(n) {
		let e = {};
		for (
			this.capture("(");
			!this.consumeOptional(")") && this.remaining.length > 0;
		) {
			let r = Ho(this.remaining),
				i = this.remaining[r.length];
			if (i !== "/" && i !== ")" && i !== ";") throw new T(4010, !1);
			let l;
			r.indexOf(":") > -1
				? ((l = r.slice(0, r.indexOf(":"))), this.capture(l), this.capture(":"))
				: n && (l = R);
			let a = this.parseChildren();
			((e[l] = Object.keys(a).length === 1 ? a[R] : new L([], a)),
				this.consumeOptional("//"));
		}
		return e;
	}
	peekStartsWith(n) {
		return this.remaining.startsWith(n);
	}
	consumeOptional(n) {
		return this.peekStartsWith(n)
			? ((this.remaining = this.remaining.substring(n.length)), !0)
			: !1;
	}
	capture(n) {
		if (!this.consumeOptional(n)) throw new T(4011, !1);
	}
};
function bu(t) {
	return t.segments.length > 0 ? new L([], { [R]: t }) : t;
}
function Du(t) {
	let n = {};
	for (let [r, i] of Object.entries(t.children)) {
		let l = Du(i);
		if (r === R && l.segments.length === 0 && l.hasChildren())
			for (let [a, d] of Object.entries(l.children)) n[a] = d;
		else (l.segments.length > 0 || l.hasChildren()) && (n[r] = l);
	}
	let e = new L(t.segments, n);
	return Jp(e);
}
function Jp(t) {
	if (t.numberOfChildren === 1 && t.children[R]) {
		let n = t.children[R];
		return new L(t.segments.concat(n.segments), n.children);
	}
	return t;
}
function dt(t) {
	return t instanceof Be;
}
function Cu(t, n, e = null, r = null) {
	let i = Eu(t);
	return _u(i, n, e, r);
}
function Eu(t) {
	let n;
	function e(l) {
		let a = {};
		for (let h of l.children) {
			let g = e(h);
			a[h.outlet] = g;
		}
		let d = new L(l.url, a);
		return (l === t && (n = d), d);
	}
	let r = e(t.root),
		i = bu(r);
	return n ?? i;
}
function _u(t, n, e, r) {
	let i = t;
	for (; i.parent; ) i = i.parent;
	if (n.length === 0) return Go(i, i, i, e, r);
	let l = Qp(n);
	if (l.toRoot()) return Go(i, i, new L([], {}), e, r);
	let a = eg(l, i, t),
		d = a.processChildren
			? zn(a.segmentGroup, a.index, l.commands)
			: Su(a.segmentGroup, a.index, l.commands);
	return Go(i, a.segmentGroup, d, e, r);
}
function ii(t) {
	return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function Gn(t) {
	return typeof t == "object" && t != null && t.outlets;
}
function Go(t, n, e, r, i) {
	let l = {};
	r &&
		Object.entries(r).forEach(([h, g]) => {
			l[h] = Array.isArray(g) ? g.map((w) => `${w}`) : `${g}`;
		});
	let a;
	t === n ? (a = e) : (a = Au(t, n, e));
	let d = bu(Du(a));
	return new Be(d, l, i);
}
function Au(t, n, e) {
	let r = {};
	return (
		Object.entries(t.children).forEach(([i, l]) => {
			l === n ? (r[i] = e) : (r[i] = Au(l, n, e));
		}),
		new L(t.segments, r)
	);
}
var oi = class {
	isAbsolute;
	numberOfDoubleDots;
	commands;
	constructor(n, e, r) {
		if (
			((this.isAbsolute = n),
			(this.numberOfDoubleDots = e),
			(this.commands = r),
			n && r.length > 0 && ii(r[0]))
		)
			throw new T(4003, !1);
		let i = r.find(Gn);
		if (i && i !== fu(r)) throw new T(4004, !1);
	}
	toRoot() {
		return (
			this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
		);
	}
};
function Qp(t) {
	if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
		return new oi(!0, 0, t);
	let n = 0,
		e = !1,
		r = t.reduce((i, l, a) => {
			if (typeof l == "object" && l != null) {
				if (l.outlets) {
					let d = {};
					return (
						Object.entries(l.outlets).forEach(([h, g]) => {
							d[h] = typeof g == "string" ? g.split("/") : g;
						}),
						[...i, { outlets: d }]
					);
				}
				if (l.segmentPath) return [...i, l.segmentPath];
			}
			return typeof l != "string"
				? [...i, l]
				: a === 0
					? (l.split("/").forEach((d, h) => {
							(h == 0 && d === ".") ||
								(h == 0 && d === ""
									? (e = !0)
									: d === ".."
										? n++
										: d != "" && i.push(d));
						}),
						i)
					: [...i, l];
		}, []);
	return new oi(e, n, r);
}
var tn = class {
	segmentGroup;
	processChildren;
	index;
	constructor(n, e, r) {
		((this.segmentGroup = n), (this.processChildren = e), (this.index = r));
	}
};
function eg(t, n, e) {
	if (t.isAbsolute) return new tn(n, !0, 0);
	if (!e) return new tn(n, !1, NaN);
	if (e.parent === null) return new tn(e, !0, 0);
	let r = ii(t.commands[0]) ? 0 : 1,
		i = e.segments.length - 1 + r;
	return tg(e, i, t.numberOfDoubleDots);
}
function tg(t, n, e) {
	let r = t,
		i = n,
		l = e;
	for (; l > i; ) {
		if (((l -= i), (r = r.parent), !r)) throw new T(4005, !1);
		i = r.segments.length;
	}
	return new tn(r, !1, i - l);
}
function ng(t) {
	return Gn(t[0]) ? t[0].outlets : { [R]: t };
}
function Su(t, n, e) {
	if (((t ??= new L([], {})), t.segments.length === 0 && t.hasChildren()))
		return zn(t, n, e);
	let r = rg(t, n, e),
		i = e.slice(r.commandIndex);
	if (r.match && r.pathIndex < t.segments.length) {
		let l = new L(t.segments.slice(0, r.pathIndex), {});
		return (
			(l.children[R] = new L(t.segments.slice(r.pathIndex), t.children)),
			zn(l, 0, i)
		);
	} else
		return r.match && i.length === 0
			? new L(t.segments, {})
			: r.match && !t.hasChildren()
				? Jo(t, n, e)
				: r.match
					? zn(t, 0, i)
					: Jo(t, n, e);
}
function zn(t, n, e) {
	if (e.length === 0) return new L(t.segments, {});
	{
		let r = ng(e),
			i = {};
		if (
			Object.keys(r).some((l) => l !== R) &&
			t.children[R] &&
			t.numberOfChildren === 1 &&
			t.children[R].segments.length === 0
		) {
			let l = zn(t.children[R], n, e);
			return new L(t.segments, l.children);
		}
		return (
			Object.entries(r).forEach(([l, a]) => {
				(typeof a == "string" && (a = [a]),
					a !== null && (i[l] = Su(t.children[l], n, a)));
			}),
			Object.entries(t.children).forEach(([l, a]) => {
				r[l] === void 0 && (i[l] = a);
			}),
			new L(t.segments, i)
		);
	}
}
function rg(t, n, e) {
	let r = 0,
		i = n,
		l = { match: !1, pathIndex: 0, commandIndex: 0 };
	for (; i < t.segments.length; ) {
		if (r >= e.length) return l;
		let a = t.segments[i],
			d = e[r];
		if (Gn(d)) break;
		let h = `${d}`,
			g = r < e.length - 1 ? e[r + 1] : null;
		if (i > 0 && h === void 0) break;
		if (h && g && typeof g == "object" && g.outlets === void 0) {
			if (!au(h, g, a)) return l;
			r += 2;
		} else {
			if (!au(h, {}, a)) return l;
			r++;
		}
		i++;
	}
	return { match: !0, pathIndex: i, commandIndex: r };
}
function Jo(t, n, e) {
	let r = t.segments.slice(0, n),
		i = 0;
	for (; i < e.length; ) {
		let l = e[i];
		if (Gn(l)) {
			let h = ig(l.outlets);
			return new L(r, h);
		}
		if (i === 0 && ii(e[0])) {
			let h = t.segments[n];
			(r.push(new ut(h.path, su(e[0]))), i++);
			continue;
		}
		let a = Gn(l) ? l.outlets[R] : `${l}`,
			d = i < e.length - 1 ? e[i + 1] : null;
		a && d && ii(d)
			? (r.push(new ut(a, su(d))), (i += 2))
			: (r.push(new ut(a, {})), i++);
	}
	return new L(r, {});
}
function ig(t) {
	let n = {};
	return (
		Object.entries(t).forEach(([e, r]) => {
			(typeof r == "string" && (r = [r]),
				r !== null && (n[e] = Jo(new L([], {}), 0, r)));
		}),
		n
	);
}
function su(t) {
	let n = {};
	return (Object.entries(t).forEach(([e, r]) => (n[e] = `${r}`)), n);
}
function au(t, n, e) {
	return t == e.path && Ne(n, e.parameters);
}
var ri = "imperative",
	X = (function (t) {
		return (
			(t[(t.NavigationStart = 0)] = "NavigationStart"),
			(t[(t.NavigationEnd = 1)] = "NavigationEnd"),
			(t[(t.NavigationCancel = 2)] = "NavigationCancel"),
			(t[(t.NavigationError = 3)] = "NavigationError"),
			(t[(t.RoutesRecognized = 4)] = "RoutesRecognized"),
			(t[(t.ResolveStart = 5)] = "ResolveStart"),
			(t[(t.ResolveEnd = 6)] = "ResolveEnd"),
			(t[(t.GuardsCheckStart = 7)] = "GuardsCheckStart"),
			(t[(t.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
			(t[(t.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
			(t[(t.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
			(t[(t.ChildActivationStart = 11)] = "ChildActivationStart"),
			(t[(t.ChildActivationEnd = 12)] = "ChildActivationEnd"),
			(t[(t.ActivationStart = 13)] = "ActivationStart"),
			(t[(t.ActivationEnd = 14)] = "ActivationEnd"),
			(t[(t.Scroll = 15)] = "Scroll"),
			(t[(t.NavigationSkipped = 16)] = "NavigationSkipped"),
			t
		);
	})(X || {}),
	pe = class {
		id;
		url;
		constructor(n, e) {
			((this.id = n), (this.url = e));
		}
	},
	ht = class extends pe {
		type = X.NavigationStart;
		navigationTrigger;
		restoredState;
		constructor(n, e, r = "imperative", i = null) {
			(super(n, e), (this.navigationTrigger = r), (this.restoredState = i));
		}
		toString() {
			return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
		}
	},
	Ce = class extends pe {
		urlAfterRedirects;
		type = X.NavigationEnd;
		constructor(n, e, r) {
			(super(n, e), (this.urlAfterRedirects = r));
		}
		toString() {
			return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
		}
	},
	ae = (function (t) {
		return (
			(t[(t.Redirect = 0)] = "Redirect"),
			(t[(t.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
			(t[(t.NoDataFromResolver = 2)] = "NoDataFromResolver"),
			(t[(t.GuardRejected = 3)] = "GuardRejected"),
			t
		);
	})(ae || {}),
	rn = (function (t) {
		return (
			(t[(t.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
			(t[(t.IgnoredByUrlHandlingStrategy = 1)] =
				"IgnoredByUrlHandlingStrategy"),
			t
		);
	})(rn || {}),
	Le = class extends pe {
		reason;
		code;
		type = X.NavigationCancel;
		constructor(n, e, r, i) {
			(super(n, e), (this.reason = r), (this.code = i));
		}
		toString() {
			return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
		}
	},
	Ve = class extends pe {
		reason;
		code;
		type = X.NavigationSkipped;
		constructor(n, e, r, i) {
			(super(n, e), (this.reason = r), (this.code = i));
		}
	},
	on = class extends pe {
		error;
		target;
		type = X.NavigationError;
		constructor(n, e, r, i) {
			(super(n, e), (this.error = r), (this.target = i));
		}
		toString() {
			return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
		}
	},
	qn = class extends pe {
		urlAfterRedirects;
		state;
		type = X.RoutesRecognized;
		constructor(n, e, r, i) {
			(super(n, e), (this.urlAfterRedirects = r), (this.state = i));
		}
		toString() {
			return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	si = class extends pe {
		urlAfterRedirects;
		state;
		type = X.GuardsCheckStart;
		constructor(n, e, r, i) {
			(super(n, e), (this.urlAfterRedirects = r), (this.state = i));
		}
		toString() {
			return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	ai = class extends pe {
		urlAfterRedirects;
		state;
		shouldActivate;
		type = X.GuardsCheckEnd;
		constructor(n, e, r, i, l) {
			(super(n, e),
				(this.urlAfterRedirects = r),
				(this.state = i),
				(this.shouldActivate = l));
		}
		toString() {
			return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
		}
	},
	li = class extends pe {
		urlAfterRedirects;
		state;
		type = X.ResolveStart;
		constructor(n, e, r, i) {
			(super(n, e), (this.urlAfterRedirects = r), (this.state = i));
		}
		toString() {
			return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	ui = class extends pe {
		urlAfterRedirects;
		state;
		type = X.ResolveEnd;
		constructor(n, e, r, i) {
			(super(n, e), (this.urlAfterRedirects = r), (this.state = i));
		}
		toString() {
			return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	ci = class {
		route;
		type = X.RouteConfigLoadStart;
		constructor(n) {
			this.route = n;
		}
		toString() {
			return `RouteConfigLoadStart(path: ${this.route.path})`;
		}
	},
	di = class {
		route;
		type = X.RouteConfigLoadEnd;
		constructor(n) {
			this.route = n;
		}
		toString() {
			return `RouteConfigLoadEnd(path: ${this.route.path})`;
		}
	},
	hi = class {
		snapshot;
		type = X.ChildActivationStart;
		constructor(n) {
			this.snapshot = n;
		}
		toString() {
			return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
		}
	},
	fi = class {
		snapshot;
		type = X.ChildActivationEnd;
		constructor(n) {
			this.snapshot = n;
		}
		toString() {
			return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
		}
	},
	pi = class {
		snapshot;
		type = X.ActivationStart;
		constructor(n) {
			this.snapshot = n;
		}
		toString() {
			return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
		}
	},
	gi = class {
		snapshot;
		type = X.ActivationEnd;
		constructor(n) {
			this.snapshot = n;
		}
		toString() {
			return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
		}
	},
	sn = class {
		routerEvent;
		position;
		anchor;
		type = X.Scroll;
		constructor(n, e, r) {
			((this.routerEvent = n), (this.position = e), (this.anchor = r));
		}
		toString() {
			let n = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
			return `Scroll(anchor: '${this.anchor}', position: '${n}')`;
		}
	},
	Wn = class {},
	an = class {
		url;
		navigationBehaviorOptions;
		constructor(n, e) {
			((this.url = n), (this.navigationBehaviorOptions = e));
		}
	};
function og(t, n) {
	return (
		t.providers &&
			!t._injector &&
			(t._injector = Mr(t.providers, n, `Route: ${t.path}`)),
		t._injector ?? n
	);
}
function Oe(t) {
	return t.outlet || R;
}
function sg(t, n) {
	let e = t.filter((r) => Oe(r) === n);
	return (e.push(...t.filter((r) => Oe(r) !== n)), e);
}
function er(t) {
	if (!t) return null;
	if (t.routeConfig?._injector) return t.routeConfig._injector;
	for (let n = t.parent; n; n = n.parent) {
		let e = n.routeConfig;
		if (e?._loadedInjector) return e._loadedInjector;
		if (e?._injector) return e._injector;
	}
	return null;
}
var mi = class {
		rootInjector;
		outlet = null;
		route = null;
		children;
		attachRef = null;
		get injector() {
			return er(this.route?.snapshot) ?? this.rootInjector;
		}
		constructor(n) {
			((this.rootInjector = n), (this.children = new It(this.rootInjector)));
		}
	},
	It = (() => {
		class t {
			rootInjector;
			contexts = new Map();
			constructor(e) {
				this.rootInjector = e;
			}
			onChildOutletCreated(e, r) {
				let i = this.getOrCreateContext(e);
				((i.outlet = r), this.contexts.set(e, i));
			}
			onChildOutletDestroyed(e) {
				let r = this.getContext(e);
				r && ((r.outlet = null), (r.attachRef = null));
			}
			onOutletDeactivated() {
				let e = this.contexts;
				return ((this.contexts = new Map()), e);
			}
			onOutletReAttached(e) {
				this.contexts = e;
			}
			getOrCreateContext(e) {
				let r = this.getContext(e);
				return (
					r || ((r = new mi(this.rootInjector)), this.contexts.set(e, r)),
					r
				);
			}
			getContext(e) {
				return this.contexts.get(e) || null;
			}
			static ɵfac = function (r) {
				return new (r || t)(_(nt));
			};
			static ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})(),
	wi = class {
		_root;
		constructor(n) {
			this._root = n;
		}
		get root() {
			return this._root.value;
		}
		parent(n) {
			let e = this.pathFromRoot(n);
			return e.length > 1 ? e[e.length - 2] : null;
		}
		children(n) {
			let e = Qo(n, this._root);
			return e ? e.children.map((r) => r.value) : [];
		}
		firstChild(n) {
			let e = Qo(n, this._root);
			return e && e.children.length > 0 ? e.children[0].value : null;
		}
		siblings(n) {
			let e = es(n, this._root);
			return e.length < 2
				? []
				: e[e.length - 2].children.map((i) => i.value).filter((i) => i !== n);
		}
		pathFromRoot(n) {
			return es(n, this._root).map((e) => e.value);
		}
	};
function Qo(t, n) {
	if (t === n.value) return n;
	for (let e of n.children) {
		let r = Qo(t, e);
		if (r) return r;
	}
	return null;
}
function es(t, n) {
	if (t === n.value) return [n];
	for (let e of n.children) {
		let r = es(t, e);
		if (r.length) return (r.unshift(n), r);
	}
	return [];
}
var fe = class {
	value;
	children;
	constructor(n, e) {
		((this.value = n), (this.children = e));
	}
	toString() {
		return `TreeNode(${this.value})`;
	}
};
function en(t) {
	let n = {};
	return (t && t.children.forEach((e) => (n[e.value.outlet] = e)), n);
}
var Yn = class extends wi {
	snapshot;
	constructor(n, e) {
		(super(n), (this.snapshot = e), ls(this, n));
	}
	toString() {
		return this.snapshot.toString();
	}
};
function Ru(t) {
	let n = ag(t),
		e = new me([new ut("", {})]),
		r = new me({}),
		i = new me({}),
		l = new me({}),
		a = new me(""),
		d = new Ue(e, r, l, a, i, R, t, n.root);
	return ((d.snapshot = n.root), new Yn(new fe(d, []), n));
}
function ag(t) {
	let n = {},
		e = {},
		r = {},
		i = "",
		l = new Rt([], n, r, i, e, R, t, null, {});
	return new Zn("", new fe(l, []));
}
var Ue = class {
	urlSubject;
	paramsSubject;
	queryParamsSubject;
	fragmentSubject;
	dataSubject;
	outlet;
	component;
	snapshot;
	_futureSnapshot;
	_routerState;
	_paramMap;
	_queryParamMap;
	title;
	url;
	params;
	queryParams;
	fragment;
	data;
	constructor(n, e, r, i, l, a, d, h) {
		((this.urlSubject = n),
			(this.paramsSubject = e),
			(this.queryParamsSubject = r),
			(this.fragmentSubject = i),
			(this.dataSubject = l),
			(this.outlet = a),
			(this.component = d),
			(this._futureSnapshot = h),
			(this.title = this.dataSubject?.pipe(P((g) => g[Qn])) ?? D(void 0)),
			(this.url = n),
			(this.params = e),
			(this.queryParams = r),
			(this.fragment = i),
			(this.data = l));
	}
	get routeConfig() {
		return this._futureSnapshot.routeConfig;
	}
	get root() {
		return this._routerState.root;
	}
	get parent() {
		return this._routerState.parent(this);
	}
	get firstChild() {
		return this._routerState.firstChild(this);
	}
	get children() {
		return this._routerState.children(this);
	}
	get pathFromRoot() {
		return this._routerState.pathFromRoot(this);
	}
	get paramMap() {
		return (
			(this._paramMap ??= this.params.pipe(P((n) => Mt(n)))),
			this._paramMap
		);
	}
	get queryParamMap() {
		return (
			(this._queryParamMap ??= this.queryParams.pipe(P((n) => Mt(n)))),
			this._queryParamMap
		);
	}
	toString() {
		return this.snapshot
			? this.snapshot.toString()
			: `Future(${this._futureSnapshot})`;
	}
};
function vi(t, n, e = "emptyOnly") {
	let r,
		{ routeConfig: i } = t;
	return (
		n !== null &&
		(e === "always" ||
			i?.path === "" ||
			(!n.component && !n.routeConfig?.loadComponent))
			? (r = {
					params: v(v({}, n.params), t.params),
					data: v(v({}, n.data), t.data),
					resolve: v(v(v(v({}, t.data), n.data), i?.data), t._resolvedData),
				})
			: (r = {
					params: v({}, t.params),
					data: v({}, t.data),
					resolve: v(v({}, t.data), t._resolvedData ?? {}),
				}),
		i && Tu(i) && (r.resolve[Qn] = i.title),
		r
	);
}
var Rt = class {
		url;
		params;
		queryParams;
		fragment;
		data;
		outlet;
		component;
		routeConfig;
		_resolve;
		_resolvedData;
		_routerState;
		_paramMap;
		_queryParamMap;
		get title() {
			return this.data?.[Qn];
		}
		constructor(n, e, r, i, l, a, d, h, g) {
			((this.url = n),
				(this.params = e),
				(this.queryParams = r),
				(this.fragment = i),
				(this.data = l),
				(this.outlet = a),
				(this.component = d),
				(this.routeConfig = h),
				(this._resolve = g));
		}
		get root() {
			return this._routerState.root;
		}
		get parent() {
			return this._routerState.parent(this);
		}
		get firstChild() {
			return this._routerState.firstChild(this);
		}
		get children() {
			return this._routerState.children(this);
		}
		get pathFromRoot() {
			return this._routerState.pathFromRoot(this);
		}
		get paramMap() {
			return ((this._paramMap ??= Mt(this.params)), this._paramMap);
		}
		get queryParamMap() {
			return (
				(this._queryParamMap ??= Mt(this.queryParams)),
				this._queryParamMap
			);
		}
		toString() {
			let n = this.url.map((r) => r.toString()).join("/"),
				e = this.routeConfig ? this.routeConfig.path : "";
			return `Route(url:'${n}', path:'${e}')`;
		}
	},
	Zn = class extends wi {
		url;
		constructor(n, e) {
			(super(e), (this.url = n), ls(this, e));
		}
		toString() {
			return Mu(this._root);
		}
	};
function ls(t, n) {
	((n.value._routerState = t), n.children.forEach((e) => ls(t, e)));
}
function Mu(t) {
	let n = t.children.length > 0 ? ` { ${t.children.map(Mu).join(", ")} } ` : "";
	return `${t.value}${n}`;
}
function qo(t) {
	if (t.snapshot) {
		let n = t.snapshot,
			e = t._futureSnapshot;
		((t.snapshot = e),
			Ne(n.queryParams, e.queryParams) ||
				t.queryParamsSubject.next(e.queryParams),
			n.fragment !== e.fragment && t.fragmentSubject.next(e.fragment),
			Ne(n.params, e.params) || t.paramsSubject.next(e.params),
			xp(n.url, e.url) || t.urlSubject.next(e.url),
			Ne(n.data, e.data) || t.dataSubject.next(e.data));
	} else
		((t.snapshot = t._futureSnapshot),
			t.dataSubject.next(t._futureSnapshot.data));
}
function ts(t, n) {
	let e = Ne(t.params, n.params) && Vp(t.url, n.url),
		r = !t.parent != !n.parent;
	return e && !r && (!t.parent || ts(t.parent, n.parent));
}
function Tu(t) {
	return typeof t.title == "string" || t.title === null;
}
var Iu = new S(""),
	us = (() => {
		class t {
			activated = null;
			get activatedComponentRef() {
				return this.activated;
			}
			_activatedRoute = null;
			name = R;
			activateEvents = new ve();
			deactivateEvents = new ve();
			attachEvents = new ve();
			detachEvents = new ve();
			routerOutletData = Ga(void 0);
			parentContexts = y(It);
			location = y(Zt);
			changeDetector = y(Et);
			inputBinder = y(tr, { optional: !0 });
			supportsBindingToComponentInputs = !0;
			ngOnChanges(e) {
				if (e.name) {
					let { firstChange: r, previousValue: i } = e.name;
					if (r) return;
					(this.isTrackedInParentContexts(i) &&
						(this.deactivate(), this.parentContexts.onChildOutletDestroyed(i)),
						this.initializeOutletWithName());
				}
			}
			ngOnDestroy() {
				(this.isTrackedInParentContexts(this.name) &&
					this.parentContexts.onChildOutletDestroyed(this.name),
					this.inputBinder?.unsubscribeFromRouteData(this));
			}
			isTrackedInParentContexts(e) {
				return this.parentContexts.getContext(e)?.outlet === this;
			}
			ngOnInit() {
				this.initializeOutletWithName();
			}
			initializeOutletWithName() {
				if (
					(this.parentContexts.onChildOutletCreated(this.name, this),
					this.activated)
				)
					return;
				let e = this.parentContexts.getContext(this.name);
				e?.route &&
					(e.attachRef
						? this.attach(e.attachRef, e.route)
						: this.activateWith(e.route, e.injector));
			}
			get isActivated() {
				return !!this.activated;
			}
			get component() {
				if (!this.activated) throw new T(4012, !1);
				return this.activated.instance;
			}
			get activatedRoute() {
				if (!this.activated) throw new T(4012, !1);
				return this._activatedRoute;
			}
			get activatedRouteData() {
				return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
			}
			detach() {
				if (!this.activated) throw new T(4012, !1);
				this.location.detach();
				let e = this.activated;
				return (
					(this.activated = null),
					(this._activatedRoute = null),
					this.detachEvents.emit(e.instance),
					e
				);
			}
			attach(e, r) {
				((this.activated = e),
					(this._activatedRoute = r),
					this.location.insert(e.hostView),
					this.inputBinder?.bindActivatedRouteToOutletComponent(this),
					this.attachEvents.emit(e.instance));
			}
			deactivate() {
				if (this.activated) {
					let e = this.component;
					(this.activated.destroy(),
						(this.activated = null),
						(this._activatedRoute = null),
						this.deactivateEvents.emit(e));
				}
			}
			activateWith(e, r) {
				if (this.isActivated) throw new T(4013, !1);
				this._activatedRoute = e;
				let i = this.location,
					a = e.snapshot.component,
					d = this.parentContexts.getOrCreateContext(this.name).children,
					h = new ns(e, d, i.injector, this.routerOutletData);
				((this.activated = i.createComponent(a, {
					index: i.length,
					injector: h,
					environmentInjector: r,
				})),
					this.changeDetector.markForCheck(),
					this.inputBinder?.bindActivatedRouteToOutletComponent(this),
					this.activateEvents.emit(this.activated.instance));
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵdir = $({
				type: t,
				selectors: [["router-outlet"]],
				inputs: { name: "name", routerOutletData: [1, "routerOutletData"] },
				outputs: {
					activateEvents: "activate",
					deactivateEvents: "deactivate",
					attachEvents: "attach",
					detachEvents: "detach",
				},
				exportAs: ["outlet"],
				features: [_e],
			});
		}
		return t;
	})(),
	ns = class {
		route;
		childContexts;
		parent;
		outletData;
		constructor(n, e, r, i) {
			((this.route = n),
				(this.childContexts = e),
				(this.parent = r),
				(this.outletData = i));
		}
		get(n, e) {
			return n === Ue
				? this.route
				: n === It
					? this.childContexts
					: n === Iu
						? this.outletData
						: this.parent.get(n, e);
		}
	},
	tr = new S(""),
	cs = (() => {
		class t {
			outletDataSubscriptions = new Map();
			bindActivatedRouteToOutletComponent(e) {
				(this.unsubscribeFromRouteData(e), this.subscribeToRouteData(e));
			}
			unsubscribeFromRouteData(e) {
				(this.outletDataSubscriptions.get(e)?.unsubscribe(),
					this.outletDataSubscriptions.delete(e));
			}
			subscribeToRouteData(e) {
				let { activatedRoute: r } = e,
					i = Ar([r.queryParams, r.params, r.data])
						.pipe(
							he(
								([l, a, d], h) => (
									(d = v(v(v({}, l), a), d)),
									h === 0 ? D(d) : Promise.resolve(d)
								),
							),
						)
						.subscribe((l) => {
							if (
								!e.isActivated ||
								!e.activatedComponentRef ||
								e.activatedRoute !== r ||
								r.component === null
							) {
								this.unsubscribeFromRouteData(e);
								return;
							}
							let a = ul(r.component);
							if (!a) {
								this.unsubscribeFromRouteData(e);
								return;
							}
							for (let { templateName: d } of a.inputs)
								e.activatedComponentRef.setInput(d, l[d]);
						});
				this.outletDataSubscriptions.set(e, i);
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = E({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	ds = (() => {
		class t {
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵcmp = el({
				type: t,
				selectors: [["ng-component"]],
				exportAs: ["emptyRouterOutlet"],
				decls: 1,
				vars: 0,
				template: function (r, i) {
					r & 1 && rl(0, "router-outlet");
				},
				dependencies: [us],
				encapsulation: 2,
			});
		}
		return t;
	})();
function hs(t) {
	let n = t.children && t.children.map(hs),
		e = n ? j(v({}, t), { children: n }) : v({}, t);
	return (
		!e.component &&
			!e.loadComponent &&
			(n || e.loadChildren) &&
			e.outlet &&
			e.outlet !== R &&
			(e.component = ds),
		e
	);
}
function lg(t, n, e) {
	let r = Xn(t, n._root, e ? e._root : void 0);
	return new Yn(r, n);
}
function Xn(t, n, e) {
	if (e && t.shouldReuseRoute(n.value, e.value.snapshot)) {
		let r = e.value;
		r._futureSnapshot = n.value;
		let i = ug(t, n, e);
		return new fe(r, i);
	} else {
		if (t.shouldAttach(n.value)) {
			let l = t.retrieve(n.value);
			if (l !== null) {
				let a = l.route;
				return (
					(a.value._futureSnapshot = n.value),
					(a.children = n.children.map((d) => Xn(t, d))),
					a
				);
			}
		}
		let r = cg(n.value),
			i = n.children.map((l) => Xn(t, l));
		return new fe(r, i);
	}
}
function ug(t, n, e) {
	return n.children.map((r) => {
		for (let i of e.children)
			if (t.shouldReuseRoute(r.value, i.value.snapshot)) return Xn(t, r, i);
		return Xn(t, r);
	});
}
function cg(t) {
	return new Ue(
		new me(t.url),
		new me(t.params),
		new me(t.queryParams),
		new me(t.fragment),
		new me(t.data),
		t.outlet,
		t.component,
		t,
	);
}
var ln = class {
		redirectTo;
		navigationBehaviorOptions;
		constructor(n, e) {
			((this.redirectTo = n), (this.navigationBehaviorOptions = e));
		}
	},
	Fu = "ngNavigationCancelingError";
function yi(t, n) {
	let { redirectTo: e, navigationBehaviorOptions: r } = dt(n)
			? { redirectTo: n, navigationBehaviorOptions: void 0 }
			: n,
		i = Ou(!1, ae.Redirect);
	return ((i.url = e), (i.navigationBehaviorOptions = r), i);
}
function Ou(t, n) {
	let e = new Error(`NavigationCancelingError: ${t || ""}`);
	return ((e[Fu] = !0), (e.cancellationCode = n), e);
}
function dg(t) {
	return Pu(t) && dt(t.url);
}
function Pu(t) {
	return !!t && t[Fu];
}
var hg = (t, n, e, r) =>
		P(
			(i) => (
				new rs(n, i.targetRouterState, i.currentRouterState, e, r).activate(t),
				i
			),
		),
	rs = class {
		routeReuseStrategy;
		futureState;
		currState;
		forwardEvent;
		inputBindingEnabled;
		constructor(n, e, r, i, l) {
			((this.routeReuseStrategy = n),
				(this.futureState = e),
				(this.currState = r),
				(this.forwardEvent = i),
				(this.inputBindingEnabled = l));
		}
		activate(n) {
			let e = this.futureState._root,
				r = this.currState ? this.currState._root : null;
			(this.deactivateChildRoutes(e, r, n),
				qo(this.futureState.root),
				this.activateChildRoutes(e, r, n));
		}
		deactivateChildRoutes(n, e, r) {
			let i = en(e);
			(n.children.forEach((l) => {
				let a = l.value.outlet;
				(this.deactivateRoutes(l, i[a], r), delete i[a]);
			}),
				Object.values(i).forEach((l) => {
					this.deactivateRouteAndItsChildren(l, r);
				}));
		}
		deactivateRoutes(n, e, r) {
			let i = n.value,
				l = e ? e.value : null;
			if (i === l)
				if (i.component) {
					let a = r.getContext(i.outlet);
					a && this.deactivateChildRoutes(n, e, a.children);
				} else this.deactivateChildRoutes(n, e, r);
			else l && this.deactivateRouteAndItsChildren(e, r);
		}
		deactivateRouteAndItsChildren(n, e) {
			n.value.component &&
			this.routeReuseStrategy.shouldDetach(n.value.snapshot)
				? this.detachAndStoreRouteSubtree(n, e)
				: this.deactivateRouteAndOutlet(n, e);
		}
		detachAndStoreRouteSubtree(n, e) {
			let r = e.getContext(n.value.outlet),
				i = r && n.value.component ? r.children : e,
				l = en(n);
			for (let a of Object.values(l)) this.deactivateRouteAndItsChildren(a, i);
			if (r && r.outlet) {
				let a = r.outlet.detach(),
					d = r.children.onOutletDeactivated();
				this.routeReuseStrategy.store(n.value.snapshot, {
					componentRef: a,
					route: n,
					contexts: d,
				});
			}
		}
		deactivateRouteAndOutlet(n, e) {
			let r = e.getContext(n.value.outlet),
				i = r && n.value.component ? r.children : e,
				l = en(n);
			for (let a of Object.values(l)) this.deactivateRouteAndItsChildren(a, i);
			r &&
				(r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
				(r.attachRef = null),
				(r.route = null));
		}
		activateChildRoutes(n, e, r) {
			let i = en(e);
			(n.children.forEach((l) => {
				(this.activateRoutes(l, i[l.value.outlet], r),
					this.forwardEvent(new gi(l.value.snapshot)));
			}),
				n.children.length && this.forwardEvent(new fi(n.value.snapshot)));
		}
		activateRoutes(n, e, r) {
			let i = n.value,
				l = e ? e.value : null;
			if ((qo(i), i === l))
				if (i.component) {
					let a = r.getOrCreateContext(i.outlet);
					this.activateChildRoutes(n, e, a.children);
				} else this.activateChildRoutes(n, e, r);
			else if (i.component) {
				let a = r.getOrCreateContext(i.outlet);
				if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
					let d = this.routeReuseStrategy.retrieve(i.snapshot);
					(this.routeReuseStrategy.store(i.snapshot, null),
						a.children.onOutletReAttached(d.contexts),
						(a.attachRef = d.componentRef),
						(a.route = d.route.value),
						a.outlet && a.outlet.attach(d.componentRef, d.route.value),
						qo(d.route.value),
						this.activateChildRoutes(n, null, a.children));
				} else
					((a.attachRef = null),
						(a.route = i),
						a.outlet && a.outlet.activateWith(i, a.injector),
						this.activateChildRoutes(n, null, a.children));
			} else this.activateChildRoutes(n, null, r);
		}
	},
	bi = class {
		path;
		route;
		constructor(n) {
			((this.path = n), (this.route = this.path[this.path.length - 1]));
		}
	},
	nn = class {
		component;
		route;
		constructor(n, e) {
			((this.component = n), (this.route = e));
		}
	};
function fg(t, n, e) {
	let r = t._root,
		i = n ? n._root : null;
	return $n(r, i, e, [r.value]);
}
function pg(t) {
	let n = t.routeConfig ? t.routeConfig.canActivateChild : null;
	return !n || n.length === 0 ? null : { node: t, guards: n };
}
function cn(t, n) {
	let e = Symbol(),
		r = n.get(t, e);
	return r === e ? (typeof t == "function" && !za(t) ? t : n.get(t)) : r;
}
function $n(
	t,
	n,
	e,
	r,
	i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
	let l = en(n);
	return (
		t.children.forEach((a) => {
			(gg(a, l[a.value.outlet], e, r.concat([a.value]), i),
				delete l[a.value.outlet]);
		}),
		Object.entries(l).forEach(([a, d]) => Hn(d, e.getContext(a), i)),
		i
	);
}
function gg(
	t,
	n,
	e,
	r,
	i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
	let l = t.value,
		a = n ? n.value : null,
		d = e ? e.getContext(t.value.outlet) : null;
	if (a && l.routeConfig === a.routeConfig) {
		let h = mg(a, l, l.routeConfig.runGuardsAndResolvers);
		(h
			? i.canActivateChecks.push(new bi(r))
			: ((l.data = a.data), (l._resolvedData = a._resolvedData)),
			l.component ? $n(t, n, d ? d.children : null, r, i) : $n(t, n, e, r, i),
			h &&
				d &&
				d.outlet &&
				d.outlet.isActivated &&
				i.canDeactivateChecks.push(new nn(d.outlet.component, a)));
	} else
		(a && Hn(n, d, i),
			i.canActivateChecks.push(new bi(r)),
			l.component
				? $n(t, null, d ? d.children : null, r, i)
				: $n(t, null, e, r, i));
	return i;
}
function mg(t, n, e) {
	if (typeof e == "function") return e(t, n);
	switch (e) {
		case "pathParamsChange":
			return !St(t.url, n.url);
		case "pathParamsOrQueryParamsChange":
			return !St(t.url, n.url) || !Ne(t.queryParams, n.queryParams);
		case "always":
			return !0;
		case "paramsOrQueryParamsChange":
			return !ts(t, n) || !Ne(t.queryParams, n.queryParams);
		case "paramsChange":
		default:
			return !ts(t, n);
	}
}
function Hn(t, n, e) {
	let r = en(t),
		i = t.value;
	(Object.entries(r).forEach(([l, a]) => {
		i.component
			? n
				? Hn(a, n.children.getContext(l), e)
				: Hn(a, null, e)
			: Hn(a, n, e);
	}),
		i.component
			? n && n.outlet && n.outlet.isActivated
				? e.canDeactivateChecks.push(new nn(n.outlet.component, i))
				: e.canDeactivateChecks.push(new nn(null, i))
			: e.canDeactivateChecks.push(new nn(null, i)));
}
function nr(t) {
	return typeof t == "function";
}
function wg(t) {
	return typeof t == "boolean";
}
function vg(t) {
	return t && nr(t.canLoad);
}
function yg(t) {
	return t && nr(t.canActivate);
}
function bg(t) {
	return t && nr(t.canActivateChild);
}
function Dg(t) {
	return t && nr(t.canDeactivate);
}
function Cg(t) {
	return t && nr(t.canMatch);
}
function ku(t) {
	return t instanceof Na || t?.name === "EmptyError";
}
var Qr = Symbol("INITIAL_VALUE");
function un() {
	return he((t) =>
		Ar(t.map((n) => n.pipe(Gt(1), ja(Qr)))).pipe(
			P((n) => {
				for (let e of n)
					if (e !== !0) {
						if (e === Qr) return Qr;
						if (e === !1 || Eg(e)) return e;
					}
				return !0;
			}),
			xe((n) => n !== Qr),
			Gt(1),
		),
	);
}
function Eg(t) {
	return dt(t) || t instanceof ln;
}
function _g(t, n) {
	return oe((e) => {
		let {
			targetSnapshot: r,
			currentSnapshot: i,
			guards: { canActivateChecks: l, canDeactivateChecks: a },
		} = e;
		return a.length === 0 && l.length === 0
			? D(j(v({}, e), { guardsResult: !0 }))
			: Ag(a, r, i, t).pipe(
					oe((d) => (d && wg(d) ? Sg(r, l, t, n) : D(d))),
					P((d) => j(v({}, e), { guardsResult: d })),
				);
	});
}
function Ag(t, n, e, r) {
	return Q(t).pipe(
		oe((i) => Fg(i.component, i.route, e, n, r)),
		et((i) => i !== !0, !0),
	);
}
function Sg(t, n, e, r) {
	return Q(n).pipe(
		Ge((i) =>
			La(
				Mg(i.route.parent, r),
				Rg(i.route, r),
				Ig(t, i.path, e),
				Tg(t, i.route, e),
			),
		),
		et((i) => i !== !0, !0),
	);
}
function Rg(t, n) {
	return (t !== null && n && n(new pi(t)), D(!0));
}
function Mg(t, n) {
	return (t !== null && n && n(new hi(t)), D(!0));
}
function Tg(t, n, e) {
	let r = n.routeConfig ? n.routeConfig.canActivate : null;
	if (!r || r.length === 0) return D(!0);
	let i = r.map((l) =>
		uo(() => {
			let a = er(n) ?? e,
				d = cn(l, a),
				h = yg(d) ? d.canActivate(n, t) : we(a, () => d(n, t));
			return ft(h).pipe(et());
		}),
	);
	return D(i).pipe(un());
}
function Ig(t, n, e) {
	let r = n[n.length - 1],
		l = n
			.slice(0, n.length - 1)
			.reverse()
			.map((a) => pg(a))
			.filter((a) => a !== null)
			.map((a) =>
				uo(() => {
					let d = a.guards.map((h) => {
						let g = er(a.node) ?? e,
							w = cn(h, g),
							f = bg(w) ? w.canActivateChild(r, t) : we(g, () => w(r, t));
						return ft(f).pipe(et());
					});
					return D(d).pipe(un());
				}),
			);
	return D(l).pipe(un());
}
function Fg(t, n, e, r, i) {
	let l = n && n.routeConfig ? n.routeConfig.canDeactivate : null;
	if (!l || l.length === 0) return D(!0);
	let a = l.map((d) => {
		let h = er(n) ?? i,
			g = cn(d, h),
			w = Dg(g) ? g.canDeactivate(t, n, e, r) : we(h, () => g(t, n, e, r));
		return ft(w).pipe(et());
	});
	return D(a).pipe(un());
}
function Og(t, n, e, r) {
	let i = n.canLoad;
	if (i === void 0 || i.length === 0) return D(!0);
	let l = i.map((a) => {
		let d = cn(a, t),
			h = vg(d) ? d.canLoad(n, e) : we(t, () => d(n, e));
		return ft(h);
	});
	return D(l).pipe(un(), xu(r));
}
function xu(t) {
	return Pa(
		te((n) => {
			if (typeof n != "boolean") throw yi(t, n);
		}),
		P((n) => n === !0),
	);
}
function Pg(t, n, e, r) {
	let i = n.canMatch;
	if (!i || i.length === 0) return D(!0);
	let l = i.map((a) => {
		let d = cn(a, t),
			h = Cg(d) ? d.canMatch(n, e) : we(t, () => d(n, e));
		return ft(h);
	});
	return D(l).pipe(un(), xu(r));
}
var Kn = class {
		segmentGroup;
		constructor(n) {
			this.segmentGroup = n || null;
		}
	},
	Jn = class extends Error {
		urlTree;
		constructor(n) {
			(super(), (this.urlTree = n));
		}
	};
function Qt(t) {
	return Dn(new Kn(t));
}
function kg(t) {
	return Dn(new T(4e3, !1));
}
function xg(t) {
	return Dn(Ou(!1, ae.GuardRejected));
}
var is = class {
		urlSerializer;
		urlTree;
		constructor(n, e) {
			((this.urlSerializer = n), (this.urlTree = e));
		}
		lineralizeSegments(n, e) {
			let r = [],
				i = e.root;
			for (;;) {
				if (((r = r.concat(i.segments)), i.numberOfChildren === 0)) return D(r);
				if (i.numberOfChildren > 1 || !i.children[R])
					return kg(`${n.redirectTo}`);
				i = i.children[R];
			}
		}
		applyRedirectCommands(n, e, r, i, l) {
			if (typeof e != "string") {
				let d = e,
					{
						queryParams: h,
						fragment: g,
						routeConfig: w,
						url: f,
						outlet: I,
						params: F,
						data: U,
						title: M,
					} = i,
					b = we(l, () =>
						d({
							params: F,
							data: U,
							queryParams: h,
							fragment: g,
							routeConfig: w,
							url: f,
							outlet: I,
							title: M,
						}),
					);
				if (b instanceof Be) throw new Jn(b);
				e = b;
			}
			let a = this.applyRedirectCreateUrlTree(
				e,
				this.urlSerializer.parse(e),
				n,
				r,
			);
			if (e[0] === "/") throw new Jn(a);
			return a;
		}
		applyRedirectCreateUrlTree(n, e, r, i) {
			let l = this.createSegmentGroup(n, e.root, r, i);
			return new Be(
				l,
				this.createQueryParams(e.queryParams, this.urlTree.queryParams),
				e.fragment,
			);
		}
		createQueryParams(n, e) {
			let r = {};
			return (
				Object.entries(n).forEach(([i, l]) => {
					if (typeof l == "string" && l[0] === ":") {
						let d = l.substring(1);
						r[i] = e[d];
					} else r[i] = l;
				}),
				r
			);
		}
		createSegmentGroup(n, e, r, i) {
			let l = this.createSegments(n, e.segments, r, i),
				a = {};
			return (
				Object.entries(e.children).forEach(([d, h]) => {
					a[d] = this.createSegmentGroup(n, h, r, i);
				}),
				new L(l, a)
			);
		}
		createSegments(n, e, r, i) {
			return e.map((l) =>
				l.path[0] === ":"
					? this.findPosParam(n, l, i)
					: this.findOrReturn(l, r),
			);
		}
		findPosParam(n, e, r) {
			let i = r[e.path.substring(1)];
			if (!i) throw new T(4001, !1);
			return i;
		}
		findOrReturn(n, e) {
			let r = 0;
			for (let i of e) {
				if (i.path === n.path) return (e.splice(r), i);
				r++;
			}
			return n;
		}
	},
	os = {
		matched: !1,
		consumedSegments: [],
		remainingSegments: [],
		parameters: {},
		positionalParamSegments: {},
	};
function Ng(t, n, e, r, i) {
	let l = Nu(t, n, e);
	return l.matched
		? ((r = og(n, r)),
			Pg(r, n, e, i).pipe(P((a) => (a === !0 ? l : v({}, os)))))
		: D(l);
}
function Nu(t, n, e) {
	if (n.path === "**") return Lg(e);
	if (n.path === "")
		return n.pathMatch === "full" && (t.hasChildren() || e.length > 0)
			? v({}, os)
			: {
					matched: !0,
					consumedSegments: [],
					remainingSegments: e,
					parameters: {},
					positionalParamSegments: {},
				};
	let i = (n.matcher || du)(e, t, n);
	if (!i) return v({}, os);
	let l = {};
	Object.entries(i.posParams ?? {}).forEach(([d, h]) => {
		l[d] = h.path;
	});
	let a =
		i.consumed.length > 0
			? v(v({}, l), i.consumed[i.consumed.length - 1].parameters)
			: l;
	return {
		matched: !0,
		consumedSegments: i.consumed,
		remainingSegments: e.slice(i.consumed.length),
		parameters: a,
		positionalParamSegments: i.posParams ?? {},
	};
}
function Lg(t) {
	return {
		matched: !0,
		parameters: t.length > 0 ? fu(t).parameters : {},
		consumedSegments: t,
		remainingSegments: [],
		positionalParamSegments: {},
	};
}
function lu(t, n, e, r) {
	return e.length > 0 && Ug(t, e, r)
		? {
				segmentGroup: new L(n, Vg(r, new L(e, t.children))),
				slicedSegments: [],
			}
		: e.length === 0 && jg(t, e, r)
			? {
					segmentGroup: new L(t.segments, Bg(t, e, r, t.children)),
					slicedSegments: e,
				}
			: { segmentGroup: new L(t.segments, t.children), slicedSegments: e };
}
function Bg(t, n, e, r) {
	let i = {};
	for (let l of e)
		if (Ci(t, n, l) && !r[Oe(l)]) {
			let a = new L([], {});
			i[Oe(l)] = a;
		}
	return v(v({}, r), i);
}
function Vg(t, n) {
	let e = {};
	e[R] = n;
	for (let r of t)
		if (r.path === "" && Oe(r) !== R) {
			let i = new L([], {});
			e[Oe(r)] = i;
		}
	return e;
}
function Ug(t, n, e) {
	return e.some((r) => Ci(t, n, r) && Oe(r) !== R);
}
function jg(t, n, e) {
	return e.some((r) => Ci(t, n, r));
}
function Ci(t, n, e) {
	return (t.hasChildren() || n.length > 0) && e.pathMatch === "full"
		? !1
		: e.path === "";
}
function $g(t, n, e) {
	return n.length === 0 && !t.children[e];
}
var ss = class {};
function zg(t, n, e, r, i, l, a = "emptyOnly") {
	return new as(t, n, e, r, i, a, l).recognize();
}
var Hg = 31,
	as = class {
		injector;
		configLoader;
		rootComponentType;
		config;
		urlTree;
		paramsInheritanceStrategy;
		urlSerializer;
		applyRedirects;
		absoluteRedirectCount = 0;
		allowRedirects = !0;
		constructor(n, e, r, i, l, a, d) {
			((this.injector = n),
				(this.configLoader = e),
				(this.rootComponentType = r),
				(this.config = i),
				(this.urlTree = l),
				(this.paramsInheritanceStrategy = a),
				(this.urlSerializer = d),
				(this.applyRedirects = new is(this.urlSerializer, this.urlTree)));
		}
		noMatchError(n) {
			return new T(4002, `'${n.segmentGroup}'`);
		}
		recognize() {
			let n = lu(this.urlTree.root, [], [], this.config).segmentGroup;
			return this.match(n).pipe(
				P(({ children: e, rootSnapshot: r }) => {
					let i = new fe(r, e),
						l = new Zn("", i),
						a = Cu(r, [], this.urlTree.queryParams, this.urlTree.fragment);
					return (
						(a.queryParams = this.urlTree.queryParams),
						(l.url = this.urlSerializer.serialize(a)),
						{ state: l, tree: a }
					);
				}),
			);
		}
		match(n) {
			let e = new Rt(
				[],
				Object.freeze({}),
				Object.freeze(v({}, this.urlTree.queryParams)),
				this.urlTree.fragment,
				Object.freeze({}),
				R,
				this.rootComponentType,
				null,
				{},
			);
			return this.processSegmentGroup(this.injector, this.config, n, R, e).pipe(
				P((r) => ({ children: r, rootSnapshot: e })),
				bt((r) => {
					if (r instanceof Jn)
						return ((this.urlTree = r.urlTree), this.match(r.urlTree.root));
					throw r instanceof Kn ? this.noMatchError(r) : r;
				}),
			);
		}
		processSegmentGroup(n, e, r, i, l) {
			return r.segments.length === 0 && r.hasChildren()
				? this.processChildren(n, e, r, l)
				: this.processSegment(n, e, r, r.segments, i, !0, l).pipe(
						P((a) => (a instanceof fe ? [a] : [])),
					);
		}
		processChildren(n, e, r, i) {
			let l = [];
			for (let a of Object.keys(r.children))
				a === "primary" ? l.unshift(a) : l.push(a);
			return Q(l).pipe(
				Ge((a) => {
					let d = r.children[a],
						h = sg(e, a);
					return this.processSegmentGroup(n, h, d, a, i);
				}),
				Ua((a, d) => (a.push(...d), a)),
				co(null),
				Va(),
				oe((a) => {
					if (a === null) return Qt(r);
					let d = Lu(a);
					return (Gg(d), D(d));
				}),
			);
		}
		processSegment(n, e, r, i, l, a, d) {
			return Q(e).pipe(
				Ge((h) =>
					this.processSegmentAgainstRoute(
						h._injector ?? n,
						e,
						h,
						r,
						i,
						l,
						a,
						d,
					).pipe(
						bt((g) => {
							if (g instanceof Kn) return D(null);
							throw g;
						}),
					),
				),
				et((h) => !!h),
				bt((h) => {
					if (ku(h)) return $g(r, i, l) ? D(new ss()) : Qt(r);
					throw h;
				}),
			);
		}
		processSegmentAgainstRoute(n, e, r, i, l, a, d, h) {
			return Oe(r) !== a && (a === R || !Ci(i, l, r))
				? Qt(i)
				: r.redirectTo === void 0
					? this.matchSegmentAgainstRoute(n, i, r, l, a, h)
					: this.allowRedirects && d
						? this.expandSegmentAgainstRouteUsingRedirect(n, i, e, r, l, a, h)
						: Qt(i);
		}
		expandSegmentAgainstRouteUsingRedirect(n, e, r, i, l, a, d) {
			let {
				matched: h,
				parameters: g,
				consumedSegments: w,
				positionalParamSegments: f,
				remainingSegments: I,
			} = Nu(e, i, l);
			if (!h) return Qt(e);
			typeof i.redirectTo == "string" &&
				i.redirectTo[0] === "/" &&
				(this.absoluteRedirectCount++,
				this.absoluteRedirectCount > Hg && (this.allowRedirects = !1));
			let F = new Rt(
					l,
					g,
					Object.freeze(v({}, this.urlTree.queryParams)),
					this.urlTree.fragment,
					uu(i),
					Oe(i),
					i.component ?? i._loadedComponent ?? null,
					i,
					cu(i),
				),
				U = vi(F, d, this.paramsInheritanceStrategy);
			((F.params = Object.freeze(U.params)), (F.data = Object.freeze(U.data)));
			let M = this.applyRedirects.applyRedirectCommands(
				w,
				i.redirectTo,
				f,
				F,
				n,
			);
			return this.applyRedirects
				.lineralizeSegments(i, M)
				.pipe(oe((b) => this.processSegment(n, r, e, b.concat(I), a, !1, d)));
		}
		matchSegmentAgainstRoute(n, e, r, i, l, a) {
			let d = Ng(e, r, i, n, this.urlSerializer);
			return (
				r.path === "**" && (e.children = {}),
				d.pipe(
					he((h) =>
						h.matched
							? ((n = r._injector ?? n),
								this.getChildConfig(n, r, i).pipe(
									he(({ routes: g }) => {
										let w = r._loadedInjector ?? n,
											{
												parameters: f,
												consumedSegments: I,
												remainingSegments: F,
											} = h,
											U = new Rt(
												I,
												f,
												Object.freeze(v({}, this.urlTree.queryParams)),
												this.urlTree.fragment,
												uu(r),
												Oe(r),
												r.component ?? r._loadedComponent ?? null,
												r,
												cu(r),
											),
											M = vi(U, a, this.paramsInheritanceStrategy);
										((U.params = Object.freeze(M.params)),
											(U.data = Object.freeze(M.data)));
										let { segmentGroup: b, slicedSegments: K } = lu(e, I, F, g);
										if (K.length === 0 && b.hasChildren())
											return this.processChildren(w, g, b, U).pipe(
												P((H) => new fe(U, H)),
											);
										if (g.length === 0 && K.length === 0)
											return D(new fe(U, []));
										let gt = Oe(r) === l;
										return this.processSegment(
											w,
											g,
											b,
											K,
											gt ? R : l,
											!0,
											U,
										).pipe(P((H) => new fe(U, H instanceof fe ? [H] : [])));
									}),
								))
							: Qt(e),
					),
				)
			);
		}
		getChildConfig(n, e, r) {
			return e.children
				? D({ routes: e.children, injector: n })
				: e.loadChildren
					? e._loadedRoutes !== void 0
						? D({ routes: e._loadedRoutes, injector: e._loadedInjector })
						: Og(n, e, r, this.urlSerializer).pipe(
								oe((i) =>
									i
										? this.configLoader.loadChildren(n, e).pipe(
												te((l) => {
													((e._loadedRoutes = l.routes),
														(e._loadedInjector = l.injector));
												}),
											)
										: xg(e),
								),
							)
					: D({ routes: [], injector: n });
		}
	};
function Gg(t) {
	t.sort((n, e) =>
		n.value.outlet === R
			? -1
			: e.value.outlet === R
				? 1
				: n.value.outlet.localeCompare(e.value.outlet),
	);
}
function qg(t) {
	let n = t.value.routeConfig;
	return n && n.path === "";
}
function Lu(t) {
	let n = [],
		e = new Set();
	for (let r of t) {
		if (!qg(r)) {
			n.push(r);
			continue;
		}
		let i = n.find((l) => r.value.routeConfig === l.value.routeConfig);
		i !== void 0 ? (i.children.push(...r.children), e.add(i)) : n.push(r);
	}
	for (let r of e) {
		let i = Lu(r.children);
		n.push(new fe(r.value, i));
	}
	return n.filter((r) => !e.has(r));
}
function uu(t) {
	return t.data || {};
}
function cu(t) {
	return t.resolve || {};
}
function Wg(t, n, e, r, i, l) {
	return oe((a) =>
		zg(t, n, e, r, a.extractedUrl, i, l).pipe(
			P(({ state: d, tree: h }) =>
				j(v({}, a), { targetSnapshot: d, urlAfterRedirects: h }),
			),
		),
	);
}
function Yg(t, n) {
	return oe((e) => {
		let {
			targetSnapshot: r,
			guards: { canActivateChecks: i },
		} = e;
		if (!i.length) return D(e);
		let l = new Set(i.map((h) => h.route)),
			a = new Set();
		for (let h of l) if (!a.has(h)) for (let g of Bu(h)) a.add(g);
		let d = 0;
		return Q(a).pipe(
			Ge((h) =>
				l.has(h)
					? Zg(h, r, t, n)
					: ((h.data = vi(h, h.parent, t).resolve), D(void 0)),
			),
			te(() => d++),
			ho(1),
			oe((h) => (d === a.size ? D(e) : He)),
		);
	});
}
function Bu(t) {
	let n = t.children.map((e) => Bu(e)).flat();
	return [t, ...n];
}
function Zg(t, n, e, r) {
	let i = t.routeConfig,
		l = t._resolve;
	return (
		i?.title !== void 0 && !Tu(i) && (l[Qn] = i.title),
		Xg(l, t, n, r).pipe(
			P(
				(a) => (
					(t._resolvedData = a),
					(t.data = vi(t, t.parent, e).resolve),
					null
				),
			),
		)
	);
}
function Xg(t, n, e, r) {
	let i = Zo(t);
	if (i.length === 0) return D({});
	let l = {};
	return Q(i).pipe(
		oe((a) =>
			Kg(t[a], n, e, r).pipe(
				et(),
				te((d) => {
					if (d instanceof ln) throw yi(new ct(), d);
					l[a] = d;
				}),
			),
		),
		ho(1),
		P(() => l),
		bt((a) => (ku(a) ? He : Dn(a))),
	);
}
function Kg(t, n, e, r) {
	let i = er(n) ?? r,
		l = cn(t, i),
		a = l.resolve ? l.resolve(n, e) : we(i, () => l(n, e));
	return ft(a);
}
function Wo(t) {
	return he((n) => {
		let e = t(n);
		return e ? Q(e).pipe(P(() => n)) : D(n);
	});
}
var fs = (() => {
		class t {
			buildTitle(e) {
				let r,
					i = e.root;
				for (; i !== void 0; )
					((r = this.getResolvedTitleForRoute(i) ?? r),
						(i = i.children.find((l) => l.outlet === R)));
				return r;
			}
			getResolvedTitleForRoute(e) {
				return e.data[Qn];
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = E({ token: t, factory: () => y(Vu), providedIn: "root" });
		}
		return t;
	})(),
	Vu = (() => {
		class t extends fs {
			title;
			constructor(e) {
				(super(), (this.title = e));
			}
			updateTitle(e) {
				let r = this.buildTitle(e);
				r !== void 0 && this.title.setTitle(r);
			}
			static ɵfac = function (r) {
				return new (r || t)(_(ru));
			};
			static ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})(),
	Ft = new S("", { providedIn: "root", factory: () => ({}) }),
	Ot = new S(""),
	Ei = (() => {
		class t {
			componentLoaders = new WeakMap();
			childrenLoaders = new WeakMap();
			onLoadStartListener;
			onLoadEndListener;
			compiler = y(il);
			loadComponent(e) {
				if (this.componentLoaders.get(e)) return this.componentLoaders.get(e);
				if (e._loadedComponent) return D(e._loadedComponent);
				this.onLoadStartListener && this.onLoadStartListener(e);
				let r = ft(e.loadComponent()).pipe(
						P(ju),
						te((l) => {
							(this.onLoadEndListener && this.onLoadEndListener(e),
								(e._loadedComponent = l));
						}),
						qt(() => {
							this.componentLoaders.delete(e);
						}),
					),
					i = new ao(r, () => new de()).pipe(so());
				return (this.componentLoaders.set(e, i), i);
			}
			loadChildren(e, r) {
				if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
				if (r._loadedRoutes)
					return D({ routes: r._loadedRoutes, injector: r._loadedInjector });
				this.onLoadStartListener && this.onLoadStartListener(r);
				let l = Uu(r, this.compiler, e, this.onLoadEndListener).pipe(
						qt(() => {
							this.childrenLoaders.delete(r);
						}),
					),
					a = new ao(l, () => new de()).pipe(so());
				return (this.childrenLoaders.set(r, a), a);
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})();
function Uu(t, n, e, r) {
	return ft(t.loadChildren()).pipe(
		P(ju),
		oe((i) =>
			i instanceof Qa || Array.isArray(i) ? D(i) : Q(n.compileModuleAsync(i)),
		),
		P((i) => {
			r && r(t);
			let l,
				a,
				d = !1;
			return (
				Array.isArray(i)
					? ((a = i), (d = !0))
					: ((l = i.create(e).injector),
						(a = l.get(Ot, [], { optional: !0, self: !0 }).flat())),
				{ routes: a.map(hs), injector: l }
			);
		}),
	);
}
function Jg(t) {
	return t && typeof t == "object" && "default" in t;
}
function ju(t) {
	return Jg(t) ? t.default : t;
}
var _i = (() => {
		class t {
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = E({ token: t, factory: () => y(Qg), providedIn: "root" });
		}
		return t;
	})(),
	Qg = (() => {
		class t {
			shouldProcessUrl(e) {
				return !0;
			}
			extract(e) {
				return e;
			}
			merge(e, r) {
				return e;
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})(),
	ps = new S(""),
	gs = new S("");
function $u(t, n, e) {
	let r = t.get(gs),
		i = t.get(Y);
	return t.get(qe).runOutsideAngular(() => {
		if (!i.startViewTransition || r.skipNextTransition)
			return ((r.skipNextTransition = !1), new Promise((g) => setTimeout(g)));
		let l,
			a = new Promise((g) => {
				l = g;
			}),
			d = i.startViewTransition(() => (l(), em(t))),
			{ onViewTransitionCreated: h } = r;
		return (h && we(t, () => h({ transition: d, from: n, to: e })), a);
	});
}
function em(t) {
	return new Promise((n) => {
		Za({ read: () => setTimeout(n) }, { injector: t });
	});
}
var ms = new S(""),
	Ai = (() => {
		class t {
			currentNavigation = null;
			currentTransition = null;
			lastSuccessfulNavigation = null;
			events = new de();
			transitionAbortSubject = new de();
			configLoader = y(Ei);
			environmentInjector = y(nt);
			destroyRef = y(go);
			urlSerializer = y(Tt);
			rootContexts = y(It);
			location = y(at);
			inputBindingEnabled = y(tr, { optional: !0 }) !== null;
			titleStrategy = y(fs);
			options = y(Ft, { optional: !0 }) || {};
			paramsInheritanceStrategy =
				this.options.paramsInheritanceStrategy || "emptyOnly";
			urlHandlingStrategy = y(_i);
			createViewTransition = y(ps, { optional: !0 });
			navigationErrorHandler = y(ms, { optional: !0 });
			navigationId = 0;
			get hasRequestedNavigation() {
				return this.navigationId !== 0;
			}
			transitions;
			afterPreactivation = () => D(void 0);
			rootComponentType = null;
			destroyed = !1;
			constructor() {
				let e = (i) => this.events.next(new ci(i)),
					r = (i) => this.events.next(new di(i));
				((this.configLoader.onLoadEndListener = r),
					(this.configLoader.onLoadStartListener = e),
					this.destroyRef.onDestroy(() => {
						this.destroyed = !0;
					}));
			}
			complete() {
				this.transitions?.complete();
			}
			handleNavigationRequest(e) {
				let r = ++this.navigationId;
				this.transitions?.next(
					j(v({}, e), {
						extractedUrl: this.urlHandlingStrategy.extract(e.rawUrl),
						targetSnapshot: null,
						targetRouterState: null,
						guards: { canActivateChecks: [], canDeactivateChecks: [] },
						guardsResult: null,
						id: r,
					}),
				);
			}
			setupNavigations(e) {
				return (
					(this.transitions = new me(null)),
					this.transitions.pipe(
						xe((r) => r !== null),
						he((r) => {
							let i = !1,
								l = !1;
							return D(r).pipe(
								he((a) => {
									if (this.navigationId > r.id)
										return (
											this.cancelNavigationTransition(
												r,
												"",
												ae.SupersededByNewNavigation,
											),
											He
										);
									((this.currentTransition = r),
										(this.currentNavigation = {
											id: a.id,
											initialUrl: a.rawUrl,
											extractedUrl: a.extractedUrl,
											targetBrowserUrl:
												typeof a.extras.browserUrl == "string"
													? this.urlSerializer.parse(a.extras.browserUrl)
													: a.extras.browserUrl,
											trigger: a.source,
											extras: a.extras,
											previousNavigation: this.lastSuccessfulNavigation
												? j(v({}, this.lastSuccessfulNavigation), {
														previousNavigation: null,
													})
												: null,
										}));
									let d =
											!e.navigated ||
											this.isUpdatingInternalState() ||
											this.isUpdatedBrowserUrl(),
										h = a.extras.onSameUrlNavigation ?? e.onSameUrlNavigation;
									if (!d && h !== "reload") {
										let g = "";
										return (
											this.events.next(
												new Ve(
													a.id,
													this.urlSerializer.serialize(a.rawUrl),
													g,
													rn.IgnoredSameUrlNavigation,
												),
											),
											a.resolve(!1),
											He
										);
									}
									if (this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl))
										return D(a).pipe(
											he(
												(g) => (
													this.events.next(
														new ht(
															g.id,
															this.urlSerializer.serialize(g.extractedUrl),
															g.source,
															g.restoredState,
														),
													),
													g.id !== this.navigationId ? He : Promise.resolve(g)
												),
											),
											Wg(
												this.environmentInjector,
												this.configLoader,
												this.rootComponentType,
												e.config,
												this.urlSerializer,
												this.paramsInheritanceStrategy,
											),
											te((g) => {
												((r.targetSnapshot = g.targetSnapshot),
													(r.urlAfterRedirects = g.urlAfterRedirects),
													(this.currentNavigation = j(
														v({}, this.currentNavigation),
														{ finalUrl: g.urlAfterRedirects },
													)));
												let w = new qn(
													g.id,
													this.urlSerializer.serialize(g.extractedUrl),
													this.urlSerializer.serialize(g.urlAfterRedirects),
													g.targetSnapshot,
												);
												this.events.next(w);
											}),
										);
									if (
										d &&
										this.urlHandlingStrategy.shouldProcessUrl(a.currentRawUrl)
									) {
										let {
												id: g,
												extractedUrl: w,
												source: f,
												restoredState: I,
												extras: F,
											} = a,
											U = new ht(g, this.urlSerializer.serialize(w), f, I);
										this.events.next(U);
										let M = Ru(this.rootComponentType).snapshot;
										return (
											(this.currentTransition = r =
												j(v({}, a), {
													targetSnapshot: M,
													urlAfterRedirects: w,
													extras: j(v({}, F), {
														skipLocationChange: !1,
														replaceUrl: !1,
													}),
												})),
											(this.currentNavigation.finalUrl = w),
											D(r)
										);
									} else {
										let g = "";
										return (
											this.events.next(
												new Ve(
													a.id,
													this.urlSerializer.serialize(a.extractedUrl),
													g,
													rn.IgnoredByUrlHandlingStrategy,
												),
											),
											a.resolve(!1),
											He
										);
									}
								}),
								te((a) => {
									let d = new si(
										a.id,
										this.urlSerializer.serialize(a.extractedUrl),
										this.urlSerializer.serialize(a.urlAfterRedirects),
										a.targetSnapshot,
									);
									this.events.next(d);
								}),
								P(
									(a) => (
										(this.currentTransition = r =
											j(v({}, a), {
												guards: fg(
													a.targetSnapshot,
													a.currentSnapshot,
													this.rootContexts,
												),
											})),
										r
									),
								),
								_g(this.environmentInjector, (a) => this.events.next(a)),
								te((a) => {
									if (
										((r.guardsResult = a.guardsResult),
										a.guardsResult && typeof a.guardsResult != "boolean")
									)
										throw yi(this.urlSerializer, a.guardsResult);
									let d = new ai(
										a.id,
										this.urlSerializer.serialize(a.extractedUrl),
										this.urlSerializer.serialize(a.urlAfterRedirects),
										a.targetSnapshot,
										!!a.guardsResult,
									);
									this.events.next(d);
								}),
								xe((a) =>
									a.guardsResult
										? !0
										: (this.cancelNavigationTransition(a, "", ae.GuardRejected),
											!1),
								),
								Wo((a) => {
									if (a.guards.canActivateChecks.length !== 0)
										return D(a).pipe(
											te((d) => {
												let h = new li(
													d.id,
													this.urlSerializer.serialize(d.extractedUrl),
													this.urlSerializer.serialize(d.urlAfterRedirects),
													d.targetSnapshot,
												);
												this.events.next(h);
											}),
											he((d) => {
												let h = !1;
												return D(d).pipe(
													Yg(
														this.paramsInheritanceStrategy,
														this.environmentInjector,
													),
													te({
														next: () => (h = !0),
														complete: () => {
															h ||
																this.cancelNavigationTransition(
																	d,
																	"",
																	ae.NoDataFromResolver,
																);
														},
													}),
												);
											}),
											te((d) => {
												let h = new ui(
													d.id,
													this.urlSerializer.serialize(d.extractedUrl),
													this.urlSerializer.serialize(d.urlAfterRedirects),
													d.targetSnapshot,
												);
												this.events.next(h);
											}),
										);
								}),
								Wo((a) => {
									let d = (h) => {
										let g = [];
										h.routeConfig?.loadComponent &&
											!h.routeConfig._loadedComponent &&
											g.push(
												this.configLoader.loadComponent(h.routeConfig).pipe(
													te((w) => {
														h.component = w;
													}),
													P(() => {}),
												),
											);
										for (let w of h.children) g.push(...d(w));
										return g;
									};
									return Ar(d(a.targetSnapshot.root)).pipe(co(null), Gt(1));
								}),
								Wo(() => this.afterPreactivation()),
								he(() => {
									let { currentSnapshot: a, targetSnapshot: d } = r,
										h = this.createViewTransition?.(
											this.environmentInjector,
											a.root,
											d.root,
										);
									return h ? Q(h).pipe(P(() => r)) : D(r);
								}),
								P((a) => {
									let d = lg(
										e.routeReuseStrategy,
										a.targetSnapshot,
										a.currentRouterState,
									);
									return (
										(this.currentTransition = r =
											j(v({}, a), { targetRouterState: d })),
										(this.currentNavigation.targetRouterState = d),
										r
									);
								}),
								te(() => {
									this.events.next(new Wn());
								}),
								hg(
									this.rootContexts,
									e.routeReuseStrategy,
									(a) => this.events.next(a),
									this.inputBindingEnabled,
								),
								Gt(1),
								te({
									next: (a) => {
										((i = !0),
											(this.lastSuccessfulNavigation = this.currentNavigation),
											this.events.next(
												new Ce(
													a.id,
													this.urlSerializer.serialize(a.extractedUrl),
													this.urlSerializer.serialize(a.urlAfterRedirects),
												),
											),
											this.titleStrategy?.updateTitle(
												a.targetRouterState.snapshot,
											),
											a.resolve(!0));
									},
									complete: () => {
										i = !0;
									},
								}),
								$a(
									this.transitionAbortSubject.pipe(
										te((a) => {
											throw a;
										}),
									),
								),
								qt(() => {
									(!i &&
										!l &&
										this.cancelNavigationTransition(
											r,
											"",
											ae.SupersededByNewNavigation,
										),
										this.currentTransition?.id === r.id &&
											((this.currentNavigation = null),
											(this.currentTransition = null)));
								}),
								bt((a) => {
									if (this.destroyed) return (r.resolve(!1), He);
									if (((l = !0), Pu(a)))
										(this.events.next(
											new Le(
												r.id,
												this.urlSerializer.serialize(r.extractedUrl),
												a.message,
												a.cancellationCode,
											),
										),
											dg(a)
												? this.events.next(
														new an(a.url, a.navigationBehaviorOptions),
													)
												: r.resolve(!1));
									else {
										let d = new on(
											r.id,
											this.urlSerializer.serialize(r.extractedUrl),
											a,
											r.targetSnapshot ?? void 0,
										);
										try {
											let h = we(this.environmentInjector, () =>
												this.navigationErrorHandler?.(d),
											);
											if (h instanceof ln) {
												let { message: g, cancellationCode: w } = yi(
													this.urlSerializer,
													h,
												);
												(this.events.next(
													new Le(
														r.id,
														this.urlSerializer.serialize(r.extractedUrl),
														g,
														w,
													),
												),
													this.events.next(
														new an(h.redirectTo, h.navigationBehaviorOptions),
													));
											} else throw (this.events.next(d), a);
										} catch (h) {
											this.options.resolveNavigationPromiseOnError
												? r.resolve(!1)
												: r.reject(h);
										}
									}
									return He;
								}),
							);
						}),
					)
				);
			}
			cancelNavigationTransition(e, r, i) {
				let l = new Le(
					e.id,
					this.urlSerializer.serialize(e.extractedUrl),
					r,
					i,
				);
				(this.events.next(l), e.resolve(!1));
			}
			isUpdatingInternalState() {
				return (
					this.currentTransition?.extractedUrl.toString() !==
					this.currentTransition?.currentUrlTree.toString()
				);
			}
			isUpdatedBrowserUrl() {
				let e = this.urlHandlingStrategy.extract(
						this.urlSerializer.parse(this.location.path(!0)),
					),
					r =
						this.currentNavigation?.targetBrowserUrl ??
						this.currentNavigation?.extractedUrl;
				return (
					e.toString() !== r?.toString() &&
					!this.currentNavigation?.extras.skipLocationChange
				);
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})();
function tm(t) {
	return t !== ri;
}
var zu = (() => {
		class t {
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = E({ token: t, factory: () => y(nm), providedIn: "root" });
		}
		return t;
	})(),
	Di = class {
		shouldDetach(n) {
			return !1;
		}
		store(n, e) {}
		shouldAttach(n) {
			return !1;
		}
		retrieve(n) {
			return null;
		}
		shouldReuseRoute(n, e) {
			return n.routeConfig === e.routeConfig;
		}
	},
	nm = (() => {
		class t extends Di {
			static ɵfac = (() => {
				let e;
				return function (i) {
					return (e || (e = rt(t)))(i || t);
				};
			})();
			static ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})(),
	Hu = (() => {
		class t {
			urlSerializer = y(Tt);
			options = y(Ft, { optional: !0 }) || {};
			canceledNavigationResolution =
				this.options.canceledNavigationResolution || "replace";
			location = y(at);
			urlHandlingStrategy = y(_i);
			urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
			currentUrlTree = new Be();
			getCurrentUrlTree() {
				return this.currentUrlTree;
			}
			rawUrlTree = this.currentUrlTree;
			getRawUrlTree() {
				return this.rawUrlTree;
			}
			createBrowserPath({ finalUrl: e, initialUrl: r, targetBrowserUrl: i }) {
				let l = e !== void 0 ? this.urlHandlingStrategy.merge(e, r) : r,
					a = i ?? l;
				return a instanceof Be ? this.urlSerializer.serialize(a) : a;
			}
			commitTransition({ targetRouterState: e, finalUrl: r, initialUrl: i }) {
				r && e
					? ((this.currentUrlTree = r),
						(this.rawUrlTree = this.urlHandlingStrategy.merge(r, i)),
						(this.routerState = e))
					: (this.rawUrlTree = i);
			}
			routerState = Ru(null);
			getRouterState() {
				return this.routerState;
			}
			stateMemento = this.createStateMemento();
			updateStateMemento() {
				this.stateMemento = this.createStateMemento();
			}
			createStateMemento() {
				return {
					rawUrlTree: this.rawUrlTree,
					currentUrlTree: this.currentUrlTree,
					routerState: this.routerState,
				};
			}
			resetInternalState({ finalUrl: e }) {
				((this.routerState = this.stateMemento.routerState),
					(this.currentUrlTree = this.stateMemento.currentUrlTree),
					(this.rawUrlTree = this.urlHandlingStrategy.merge(
						this.currentUrlTree,
						e ?? this.rawUrlTree,
					)));
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = E({ token: t, factory: () => y(rm), providedIn: "root" });
		}
		return t;
	})(),
	rm = (() => {
		class t extends Hu {
			currentPageId = 0;
			lastSuccessfulId = -1;
			restoredState() {
				return this.location.getState();
			}
			get browserPageId() {
				return this.canceledNavigationResolution !== "computed"
					? this.currentPageId
					: (this.restoredState()?.ɵrouterPageId ?? this.currentPageId);
			}
			registerNonRouterCurrentEntryChangeListener(e) {
				return this.location.subscribe((r) => {
					r.type === "popstate" &&
						setTimeout(() => {
							e(r.url, r.state, "popstate");
						});
				});
			}
			handleRouterEvent(e, r) {
				e instanceof ht
					? this.updateStateMemento()
					: e instanceof Ve
						? this.commitTransition(r)
						: e instanceof qn
							? this.urlUpdateStrategy === "eager" &&
								(r.extras.skipLocationChange ||
									this.setBrowserUrl(this.createBrowserPath(r), r))
							: e instanceof Wn
								? (this.commitTransition(r),
									this.urlUpdateStrategy === "deferred" &&
										!r.extras.skipLocationChange &&
										this.setBrowserUrl(this.createBrowserPath(r), r))
								: e instanceof Le &&
									  (e.code === ae.GuardRejected ||
											e.code === ae.NoDataFromResolver)
									? this.restoreHistory(r)
									: e instanceof on
										? this.restoreHistory(r, !0)
										: e instanceof Ce &&
											((this.lastSuccessfulId = e.id),
											(this.currentPageId = this.browserPageId));
			}
			setBrowserUrl(e, { extras: r, id: i }) {
				let { replaceUrl: l, state: a } = r;
				if (this.location.isCurrentPathEqualTo(e) || l) {
					let d = this.browserPageId,
						h = v(v({}, a), this.generateNgRouterState(i, d));
					this.location.replaceState(e, "", h);
				} else {
					let d = v(
						v({}, a),
						this.generateNgRouterState(i, this.browserPageId + 1),
					);
					this.location.go(e, "", d);
				}
			}
			restoreHistory(e, r = !1) {
				if (this.canceledNavigationResolution === "computed") {
					let i = this.browserPageId,
						l = this.currentPageId - i;
					l !== 0
						? this.location.historyGo(l)
						: this.getCurrentUrlTree() === e.finalUrl &&
							l === 0 &&
							(this.resetInternalState(e), this.resetUrlToCurrentUrlTree());
				} else
					this.canceledNavigationResolution === "replace" &&
						(r && this.resetInternalState(e), this.resetUrlToCurrentUrlTree());
			}
			resetUrlToCurrentUrlTree() {
				this.location.replaceState(
					this.urlSerializer.serialize(this.getRawUrlTree()),
					"",
					this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
				);
			}
			generateNgRouterState(e, r) {
				return this.canceledNavigationResolution === "computed"
					? { navigationId: e, ɵrouterPageId: r }
					: { navigationId: e };
			}
			static ɵfac = (() => {
				let e;
				return function (i) {
					return (e || (e = rt(t)))(i || t);
				};
			})();
			static ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})();
function Si(t, n) {
	t.events
		.pipe(
			xe(
				(e) =>
					e instanceof Ce ||
					e instanceof Le ||
					e instanceof on ||
					e instanceof Ve,
			),
			P((e) =>
				e instanceof Ce || e instanceof Ve
					? 0
					: (
								e instanceof Le
									? e.code === ae.Redirect ||
										e.code === ae.SupersededByNewNavigation
									: !1
						  )
						? 2
						: 1,
			),
			xe((e) => e !== 2),
			Gt(1),
		)
		.subscribe(() => {
			n();
		});
}
var im = {
		paths: "exact",
		fragment: "ignored",
		matrixParams: "ignored",
		queryParams: "exact",
	},
	om = {
		paths: "subset",
		fragment: "ignored",
		matrixParams: "ignored",
		queryParams: "subset",
	},
	je = (() => {
		class t {
			get currentUrlTree() {
				return this.stateManager.getCurrentUrlTree();
			}
			get rawUrlTree() {
				return this.stateManager.getRawUrlTree();
			}
			disposed = !1;
			nonRouterCurrentEntryChangeSubscription;
			console = y(tl);
			stateManager = y(Hu);
			options = y(Ft, { optional: !0 }) || {};
			pendingTasks = y(Rr);
			urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
			navigationTransitions = y(Ai);
			urlSerializer = y(Tt);
			location = y(at);
			urlHandlingStrategy = y(_i);
			_events = new de();
			get events() {
				return this._events;
			}
			get routerState() {
				return this.stateManager.getRouterState();
			}
			navigated = !1;
			routeReuseStrategy = y(zu);
			onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore";
			config = y(Ot, { optional: !0 })?.flat() ?? [];
			componentInputBindingEnabled = !!y(tr, { optional: !0 });
			constructor() {
				(this.resetConfig(this.config),
					this.navigationTransitions.setupNavigations(this).subscribe({
						error: (e) => {
							this.console.warn(e);
						},
					}),
					this.subscribeToNavigationEvents());
			}
			eventsSubscription = new Oa();
			subscribeToNavigationEvents() {
				let e = this.navigationTransitions.events.subscribe((r) => {
					try {
						let i = this.navigationTransitions.currentTransition,
							l = this.navigationTransitions.currentNavigation;
						if (i !== null && l !== null) {
							if (
								(this.stateManager.handleRouterEvent(r, l),
								r instanceof Le &&
									r.code !== ae.Redirect &&
									r.code !== ae.SupersededByNewNavigation)
							)
								this.navigated = !0;
							else if (r instanceof Ce) this.navigated = !0;
							else if (r instanceof an) {
								let a = r.navigationBehaviorOptions,
									d = this.urlHandlingStrategy.merge(r.url, i.currentRawUrl),
									h = v(
										{
											browserUrl: i.extras.browserUrl,
											info: i.extras.info,
											skipLocationChange: i.extras.skipLocationChange,
											replaceUrl:
												i.extras.replaceUrl ||
												this.urlUpdateStrategy === "eager" ||
												tm(i.source),
										},
										a,
									);
								this.scheduleNavigation(d, ri, null, h, {
									resolve: i.resolve,
									reject: i.reject,
									promise: i.promise,
								});
							}
						}
						am(r) && this._events.next(r);
					} catch (i) {
						this.navigationTransitions.transitionAbortSubject.next(i);
					}
				});
				this.eventsSubscription.add(e);
			}
			resetRootComponentType(e) {
				((this.routerState.root.component = e),
					(this.navigationTransitions.rootComponentType = e));
			}
			initialNavigation() {
				(this.setUpLocationChangeListener(),
					this.navigationTransitions.hasRequestedNavigation ||
						this.navigateToSyncWithBrowser(
							this.location.path(!0),
							ri,
							this.stateManager.restoredState(),
						));
			}
			setUpLocationChangeListener() {
				this.nonRouterCurrentEntryChangeSubscription ??=
					this.stateManager.registerNonRouterCurrentEntryChangeListener(
						(e, r, i) => {
							this.navigateToSyncWithBrowser(e, i, r);
						},
					);
			}
			navigateToSyncWithBrowser(e, r, i) {
				let l = { replaceUrl: !0 },
					a = i?.navigationId ? i : null;
				if (i) {
					let h = v({}, i);
					(delete h.navigationId,
						delete h.ɵrouterPageId,
						Object.keys(h).length !== 0 && (l.state = h));
				}
				let d = this.parseUrl(e);
				this.scheduleNavigation(d, r, a, l);
			}
			get url() {
				return this.serializeUrl(this.currentUrlTree);
			}
			getCurrentNavigation() {
				return this.navigationTransitions.currentNavigation;
			}
			get lastSuccessfulNavigation() {
				return this.navigationTransitions.lastSuccessfulNavigation;
			}
			resetConfig(e) {
				((this.config = e.map(hs)), (this.navigated = !1));
			}
			ngOnDestroy() {
				this.dispose();
			}
			dispose() {
				(this._events.unsubscribe(),
					this.navigationTransitions.complete(),
					this.nonRouterCurrentEntryChangeSubscription &&
						(this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
						(this.nonRouterCurrentEntryChangeSubscription = void 0)),
					(this.disposed = !0),
					this.eventsSubscription.unsubscribe());
			}
			createUrlTree(e, r = {}) {
				let {
						relativeTo: i,
						queryParams: l,
						fragment: a,
						queryParamsHandling: d,
						preserveFragment: h,
					} = r,
					g = h ? this.currentUrlTree.fragment : a,
					w = null;
				switch (d ?? this.options.defaultQueryParamsHandling) {
					case "merge":
						w = v(v({}, this.currentUrlTree.queryParams), l);
						break;
					case "preserve":
						w = this.currentUrlTree.queryParams;
						break;
					default:
						w = l || null;
				}
				w !== null && (w = this.removeEmptyProps(w));
				let f;
				try {
					let I = i ? i.snapshot : this.routerState.snapshot.root;
					f = Eu(I);
				} catch {
					((typeof e[0] != "string" || e[0][0] !== "/") && (e = []),
						(f = this.currentUrlTree.root));
				}
				return _u(f, e, w, g ?? null);
			}
			navigateByUrl(e, r = { skipLocationChange: !1 }) {
				let i = dt(e) ? e : this.parseUrl(e),
					l = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
				return this.scheduleNavigation(l, ri, null, r);
			}
			navigate(e, r = { skipLocationChange: !1 }) {
				return (sm(e), this.navigateByUrl(this.createUrlTree(e, r), r));
			}
			serializeUrl(e) {
				return this.urlSerializer.serialize(e);
			}
			parseUrl(e) {
				try {
					return this.urlSerializer.parse(e);
				} catch {
					return this.urlSerializer.parse("/");
				}
			}
			isActive(e, r) {
				let i;
				if (
					(r === !0 ? (i = v({}, im)) : r === !1 ? (i = v({}, om)) : (i = r),
					dt(e))
				)
					return iu(this.currentUrlTree, e, i);
				let l = this.parseUrl(e);
				return iu(this.currentUrlTree, l, i);
			}
			removeEmptyProps(e) {
				return Object.entries(e).reduce(
					(r, [i, l]) => (l != null && (r[i] = l), r),
					{},
				);
			}
			scheduleNavigation(e, r, i, l, a) {
				if (this.disposed) return Promise.resolve(!1);
				let d, h, g;
				a
					? ((d = a.resolve), (h = a.reject), (g = a.promise))
					: (g = new Promise((f, I) => {
							((d = f), (h = I));
						}));
				let w = this.pendingTasks.add();
				return (
					Si(this, () => {
						queueMicrotask(() => this.pendingTasks.remove(w));
					}),
					this.navigationTransitions.handleNavigationRequest({
						source: r,
						restoredState: i,
						currentUrlTree: this.currentUrlTree,
						currentRawUrl: this.currentUrlTree,
						rawUrl: e,
						extras: l,
						resolve: d,
						reject: h,
						promise: g,
						currentSnapshot: this.routerState.snapshot,
						currentRouterState: this.routerState,
					}),
					g.catch((f) => Promise.reject(f))
				);
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})();
function sm(t) {
	for (let n = 0; n < t.length; n++) if (t[n] == null) throw new T(4008, !1);
}
function am(t) {
	return !(t instanceof Wn) && !(t instanceof an);
}
var Gu = (() => {
	class t {
		router;
		route;
		tabIndexAttribute;
		renderer;
		el;
		locationStrategy;
		href = null;
		target;
		queryParams;
		fragment;
		queryParamsHandling;
		state;
		info;
		relativeTo;
		isAnchorElement;
		subscription;
		onChanges = new de();
		constructor(e, r, i, l, a, d) {
			((this.router = e),
				(this.route = r),
				(this.tabIndexAttribute = i),
				(this.renderer = l),
				(this.el = a),
				(this.locationStrategy = d));
			let h = a.nativeElement.tagName?.toLowerCase();
			((this.isAnchorElement = h === "a" || h === "area"),
				this.isAnchorElement
					? (this.subscription = e.events.subscribe((g) => {
							g instanceof Ce && this.updateHref();
						}))
					: this.setTabIndexIfNotOnNativeEl("0"));
		}
		preserveFragment = !1;
		skipLocationChange = !1;
		replaceUrl = !1;
		setTabIndexIfNotOnNativeEl(e) {
			this.tabIndexAttribute != null ||
				this.isAnchorElement ||
				this.applyAttributeValue("tabindex", e);
		}
		ngOnChanges(e) {
			(this.isAnchorElement && this.updateHref(), this.onChanges.next(this));
		}
		routerLinkInput = null;
		set routerLink(e) {
			e == null
				? ((this.routerLinkInput = null), this.setTabIndexIfNotOnNativeEl(null))
				: (dt(e)
						? (this.routerLinkInput = e)
						: (this.routerLinkInput = Array.isArray(e) ? e : [e]),
					this.setTabIndexIfNotOnNativeEl("0"));
		}
		onClick(e, r, i, l, a) {
			let d = this.urlTree;
			if (
				d === null ||
				(this.isAnchorElement &&
					(e !== 0 ||
						r ||
						i ||
						l ||
						a ||
						(typeof this.target == "string" && this.target != "_self")))
			)
				return !0;
			let h = {
				skipLocationChange: this.skipLocationChange,
				replaceUrl: this.replaceUrl,
				state: this.state,
				info: this.info,
			};
			return (this.router.navigateByUrl(d, h), !this.isAnchorElement);
		}
		ngOnDestroy() {
			this.subscription?.unsubscribe();
		}
		updateHref() {
			let e = this.urlTree;
			this.href =
				e !== null && this.locationStrategy
					? this.locationStrategy?.prepareExternalUrl(
							this.router.serializeUrl(e),
						)
					: null;
			let r =
				this.href === null
					? null
					: Xa(this.href, this.el.nativeElement.tagName.toLowerCase(), "href");
			this.applyAttributeValue("href", r);
		}
		applyAttributeValue(e, r) {
			let i = this.renderer,
				l = this.el.nativeElement;
			r !== null ? i.setAttribute(l, e, r) : i.removeAttribute(l, e);
		}
		get urlTree() {
			return this.routerLinkInput === null
				? null
				: dt(this.routerLinkInput)
					? this.routerLinkInput
					: this.router.createUrlTree(this.routerLinkInput, {
							relativeTo:
								this.relativeTo !== void 0 ? this.relativeTo : this.route,
							queryParams: this.queryParams,
							fragment: this.fragment,
							queryParamsHandling: this.queryParamsHandling,
							preserveFragment: this.preserveFragment,
						});
		}
		static ɵfac = function (r) {
			return new (r || t)(C(je), C(Ue), po("tabindex"), C(Se), C(Ae), C(Ie));
		};
		static ɵdir = $({
			type: t,
			selectors: [["", "routerLink", ""]],
			hostVars: 1,
			hostBindings: function (r, i) {
				(r & 1 &&
					Ct("click", function (a) {
						return i.onClick(
							a.button,
							a.ctrlKey,
							a.shiftKey,
							a.altKey,
							a.metaKey,
						);
					}),
					r & 2 && Tr("target", i.target));
			},
			inputs: {
				target: "target",
				queryParams: "queryParams",
				fragment: "fragment",
				queryParamsHandling: "queryParamsHandling",
				state: "state",
				info: "info",
				relativeTo: "relativeTo",
				preserveFragment: [2, "preserveFragment", "preserveFragment", ot],
				skipLocationChange: [2, "skipLocationChange", "skipLocationChange", ot],
				replaceUrl: [2, "replaceUrl", "replaceUrl", ot],
				routerLink: "routerLink",
			},
			features: [_e],
		});
	}
	return t;
})();
var rr = class {};
var qu = (() => {
		class t {
			router;
			injector;
			preloadingStrategy;
			loader;
			subscription;
			constructor(e, r, i, l) {
				((this.router = e),
					(this.injector = r),
					(this.preloadingStrategy = i),
					(this.loader = l));
			}
			setUpPreloading() {
				this.subscription = this.router.events
					.pipe(
						xe((e) => e instanceof Ce),
						Ge(() => this.preload()),
					)
					.subscribe(() => {});
			}
			preload() {
				return this.processRoutes(this.injector, this.router.config);
			}
			ngOnDestroy() {
				this.subscription && this.subscription.unsubscribe();
			}
			processRoutes(e, r) {
				let i = [];
				for (let l of r) {
					l.providers &&
						!l._injector &&
						(l._injector = Mr(l.providers, e, `Route: ${l.path}`));
					let a = l._injector ?? e,
						d = l._loadedInjector ?? a;
					(((l.loadChildren && !l._loadedRoutes && l.canLoad === void 0) ||
						(l.loadComponent && !l._loadedComponent)) &&
						i.push(this.preloadConfig(a, l)),
						(l.children || l._loadedRoutes) &&
							i.push(this.processRoutes(d, l.children ?? l._loadedRoutes)));
				}
				return Q(i).pipe(lo());
			}
			preloadConfig(e, r) {
				return this.preloadingStrategy.preload(r, () => {
					let i;
					r.loadChildren && r.canLoad === void 0
						? (i = this.loader.loadChildren(e, r))
						: (i = D(null));
					let l = i.pipe(
						oe((a) =>
							a === null
								? D(void 0)
								: ((r._loadedRoutes = a.routes),
									(r._loadedInjector = a.injector),
									this.processRoutes(a.injector ?? e, a.routes)),
						),
					);
					if (r.loadComponent && !r._loadedComponent) {
						let a = this.loader.loadComponent(r);
						return Q([l, a]).pipe(lo());
					} else return l;
				});
			}
			static ɵfac = function (r) {
				return new (r || t)(_(je), _(nt), _(rr), _(Ei));
			};
			static ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})(),
	Wu = new S(""),
	lm = (() => {
		class t {
			urlSerializer;
			transitions;
			viewportScroller;
			zone;
			options;
			routerEventsSubscription;
			scrollEventsSubscription;
			lastId = 0;
			lastSource = "imperative";
			restoredId = 0;
			store = {};
			constructor(e, r, i, l, a = {}) {
				((this.urlSerializer = e),
					(this.transitions = r),
					(this.viewportScroller = i),
					(this.zone = l),
					(this.options = a),
					(a.scrollPositionRestoration ||= "disabled"),
					(a.anchorScrolling ||= "disabled"));
			}
			init() {
				(this.options.scrollPositionRestoration !== "disabled" &&
					this.viewportScroller.setHistoryScrollRestoration("manual"),
					(this.routerEventsSubscription = this.createScrollEvents()),
					(this.scrollEventsSubscription = this.consumeScrollEvents()));
			}
			createScrollEvents() {
				return this.transitions.events.subscribe((e) => {
					e instanceof ht
						? ((this.store[this.lastId] =
								this.viewportScroller.getScrollPosition()),
							(this.lastSource = e.navigationTrigger),
							(this.restoredId = e.restoredState
								? e.restoredState.navigationId
								: 0))
						: e instanceof Ce
							? ((this.lastId = e.id),
								this.scheduleScrollEvent(
									e,
									this.urlSerializer.parse(e.urlAfterRedirects).fragment,
								))
							: e instanceof Ve &&
								e.code === rn.IgnoredSameUrlNavigation &&
								((this.lastSource = void 0),
								(this.restoredId = 0),
								this.scheduleScrollEvent(
									e,
									this.urlSerializer.parse(e.url).fragment,
								));
				});
			}
			consumeScrollEvents() {
				return this.transitions.events.subscribe((e) => {
					e instanceof sn &&
						(e.position
							? this.options.scrollPositionRestoration === "top"
								? this.viewportScroller.scrollToPosition([0, 0])
								: this.options.scrollPositionRestoration === "enabled" &&
									this.viewportScroller.scrollToPosition(e.position)
							: e.anchor && this.options.anchorScrolling === "enabled"
								? this.viewportScroller.scrollToAnchor(e.anchor)
								: this.options.scrollPositionRestoration !== "disabled" &&
									this.viewportScroller.scrollToPosition([0, 0]));
				});
			}
			scheduleScrollEvent(e, r) {
				this.zone.runOutsideAngular(() => {
					setTimeout(() => {
						this.zone.run(() => {
							this.transitions.events.next(
								new sn(
									e,
									this.lastSource === "popstate"
										? this.store[this.restoredId]
										: null,
									r,
								),
							);
						});
					}, 0);
				});
			}
			ngOnDestroy() {
				(this.routerEventsSubscription?.unsubscribe(),
					this.scrollEventsSubscription?.unsubscribe());
			}
			static ɵfac = function (r) {
				Ja();
			};
			static ɵprov = E({ token: t, factory: t.ɵfac });
		}
		return t;
	})();
function um(t, ...n) {
	return Sr([
		{ provide: Ot, multi: !0, useValue: t },
		[],
		{ provide: Ue, useFactory: Yu, deps: [je] },
		{ provide: Eo, multi: !0, useFactory: Zu },
		n.map((e) => e.ɵproviders),
	]);
}
function Yu(t) {
	return t.routerState.root;
}
function ir(t, n) {
	return { ɵkind: t, ɵproviders: n };
}
function Zu() {
	let t = y(Wt);
	return (n) => {
		let e = t.get(nl);
		if (n !== e.components[0]) return;
		let r = t.get(je),
			i = t.get(Xu);
		(t.get(vs) === 1 && r.initialNavigation(),
			t.get(Qu, null, fo.Optional)?.setUpPreloading(),
			t.get(Wu, null, fo.Optional)?.init(),
			r.resetRootComponentType(e.componentTypes[0]),
			i.closed || (i.next(), i.complete(), i.unsubscribe()));
	};
}
var Xu = new S("", { factory: () => new de() }),
	vs = new S("", { providedIn: "root", factory: () => 1 });
function Ku() {
	let t = [
		{ provide: vs, useValue: 0 },
		Co(() => {
			let n = y(Wt);
			return n.get(So, Promise.resolve()).then(
				() =>
					new Promise((r) => {
						let i = n.get(je),
							l = n.get(Xu);
						(Si(i, () => {
							r(!0);
						}),
							(n.get(Ai).afterPreactivation = () => (
								r(!0),
								l.closed ? D(void 0) : l
							)),
							i.initialNavigation());
					}),
			);
		}),
	];
	return ir(2, t);
}
function Ju() {
	let t = [
		Co(() => {
			y(je).setUpLocationChangeListener();
		}),
		{ provide: vs, useValue: 2 },
	];
	return ir(3, t);
}
var Qu = new S("");
function ec(t) {
	return ir(0, [
		{ provide: Qu, useExisting: qu },
		{ provide: rr, useExisting: t },
	]);
}
function tc() {
	return ir(8, [cs, { provide: tr, useExisting: cs }]);
}
function nc(t) {
	yo("NgRouterViewTransitions");
	let n = [
		{ provide: ps, useValue: $u },
		{
			provide: gs,
			useValue: v({ skipNextTransition: !!t?.skipInitialTransition }, t),
		},
	];
	return ir(9, n);
}
var rc = [
		at,
		{ provide: Tt, useClass: ct },
		je,
		It,
		{ provide: Ue, useFactory: Yu, deps: [je] },
		Ei,
		[],
	],
	cm = (() => {
		class t {
			constructor() {}
			static forRoot(e, r) {
				return {
					ngModule: t,
					providers: [
						rc,
						[],
						{ provide: Ot, multi: !0, useValue: e },
						[],
						r?.errorHandler ? { provide: ms, useValue: r.errorHandler } : [],
						{ provide: Ft, useValue: r || {} },
						r?.useHash ? hm() : fm(),
						dm(),
						r?.preloadingStrategy ? ec(r.preloadingStrategy).ɵproviders : [],
						r?.initialNavigation ? pm(r) : [],
						r?.bindToComponentInputs ? tc().ɵproviders : [],
						r?.enableViewTransitions ? nc().ɵproviders : [],
						gm(),
					],
				};
			}
			static forChild(e) {
				return {
					ngModule: t,
					providers: [{ provide: Ot, multi: !0, useValue: e }],
				};
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵmod = Re({ type: t });
			static ɵinj = Ee({});
		}
		return t;
	})();
function dm() {
	return {
		provide: Wu,
		useFactory: () => {
			let t = y(xl),
				n = y(qe),
				e = y(Ft),
				r = y(Ai),
				i = y(Tt);
			return (
				e.scrollOffset && t.setOffset(e.scrollOffset),
				new lm(i, r, t, n, e)
			);
		},
	};
}
function hm() {
	return { provide: Ie, useClass: Fo };
}
function fm() {
	return { provide: Ie, useClass: Or };
}
function pm(t) {
	return [
		t.initialNavigation === "disabled" ? Ju().ɵproviders : [],
		t.initialNavigation === "enabledBlocking" ? Ku().ɵproviders : [],
	];
}
var ws = new S("");
function gm() {
	return [
		{ provide: ws, useFactory: Zu },
		{ provide: Eo, multi: !0, useExisting: ws },
	];
}
var pc = (() => {
		class t {
			_renderer;
			_elementRef;
			onChange = (e) => {};
			onTouched = () => {};
			constructor(e, r) {
				((this._renderer = e), (this._elementRef = r));
			}
			setProperty(e, r) {
				this._renderer.setProperty(this._elementRef.nativeElement, e, r);
			}
			registerOnTouched(e) {
				this.onTouched = e;
			}
			registerOnChange(e) {
				this.onChange = e;
			}
			setDisabledState(e) {
				this.setProperty("disabled", e);
			}
			static ɵfac = function (r) {
				return new (r || t)(C(Se), C(Ae));
			};
			static ɵdir = $({ type: t });
		}
		return t;
	})(),
	As = (() => {
		class t extends pc {
			static ɵfac = (() => {
				let e;
				return function (i) {
					return (e || (e = rt(t)))(i || t);
				};
			})();
			static ɵdir = $({ type: t, features: [Me] });
		}
		return t;
	})(),
	cr = new S("");
var mm = { provide: cr, useExisting: tt(() => gc), multi: !0 };
function wm() {
	let t = be() ? be().getUserAgent() : "";
	return /android (\d+)/.test(t.toLowerCase());
}
var vm = new S(""),
	gc = (() => {
		class t extends pc {
			_compositionMode;
			_composing = !1;
			constructor(e, r, i) {
				(super(e, r),
					(this._compositionMode = i),
					this._compositionMode == null && (this._compositionMode = !wm()));
			}
			writeValue(e) {
				let r = e ?? "";
				this.setProperty("value", r);
			}
			_handleInput(e) {
				(!this._compositionMode ||
					(this._compositionMode && !this._composing)) &&
					this.onChange(e);
			}
			_compositionStart() {
				this._composing = !0;
			}
			_compositionEnd(e) {
				((this._composing = !1), this._compositionMode && this.onChange(e));
			}
			static ɵfac = function (r) {
				return new (r || t)(C(Se), C(Ae), C(vm, 8));
			};
			static ɵdir = $({
				type: t,
				selectors: [
					["input", "formControlName", "", 3, "type", "checkbox"],
					["textarea", "formControlName", ""],
					["input", "formControl", "", 3, "type", "checkbox"],
					["textarea", "formControl", ""],
					["input", "ngModel", "", 3, "type", "checkbox"],
					["textarea", "ngModel", ""],
					["", "ngDefaultControl", ""],
				],
				hostBindings: function (r, i) {
					r & 1 &&
						Ct("input", function (a) {
							return i._handleInput(a.target.value);
						})("blur", function () {
							return i.onTouched();
						})("compositionstart", function () {
							return i._compositionStart();
						})("compositionend", function (a) {
							return i._compositionEnd(a.target.value);
						});
				},
				standalone: !1,
				features: [it([mm]), Me],
			});
		}
		return t;
	})();
function Ss(t) {
	return t == null || Rs(t) === 0;
}
function Rs(t) {
	return t == null
		? null
		: Array.isArray(t) || typeof t == "string"
			? t.length
			: t instanceof Set
				? t.size
				: null;
}
var Ni = new S(""),
	Ms = new S(""),
	ym =
		/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
	ic = class {
		static min(n) {
			return bm(n);
		}
		static max(n) {
			return Dm(n);
		}
		static required(n) {
			return mc(n);
		}
		static requiredTrue(n) {
			return Cm(n);
		}
		static email(n) {
			return Em(n);
		}
		static minLength(n) {
			return _m(n);
		}
		static maxLength(n) {
			return Am(n);
		}
		static pattern(n) {
			return Sm(n);
		}
		static nullValidator(n) {
			return Mi();
		}
		static compose(n) {
			return Cc(n);
		}
		static composeAsync(n) {
			return _c(n);
		}
	};
function bm(t) {
	return (n) => {
		if (n.value == null || t == null) return null;
		let e = parseFloat(n.value);
		return !isNaN(e) && e < t ? { min: { min: t, actual: n.value } } : null;
	};
}
function Dm(t) {
	return (n) => {
		if (n.value == null || t == null) return null;
		let e = parseFloat(n.value);
		return !isNaN(e) && e > t ? { max: { max: t, actual: n.value } } : null;
	};
}
function mc(t) {
	return Ss(t.value) ? { required: !0 } : null;
}
function Cm(t) {
	return t.value === !0 ? null : { required: !0 };
}
function Em(t) {
	return Ss(t.value) || ym.test(t.value) ? null : { email: !0 };
}
function _m(t) {
	return (n) => {
		let e = n.value?.length ?? Rs(n.value);
		return e === null || e === 0
			? null
			: e < t
				? { minlength: { requiredLength: t, actualLength: e } }
				: null;
	};
}
function Am(t) {
	return (n) => {
		let e = n.value?.length ?? Rs(n.value);
		return e !== null && e > t
			? { maxlength: { requiredLength: t, actualLength: e } }
			: null;
	};
}
function Sm(t) {
	if (!t) return Mi;
	let n, e;
	return (
		typeof t == "string"
			? ((e = ""),
				t.charAt(0) !== "^" && (e += "^"),
				(e += t),
				t.charAt(t.length - 1) !== "$" && (e += "$"),
				(n = new RegExp(e)))
			: ((e = t.toString()), (n = t)),
		(r) => {
			if (Ss(r.value)) return null;
			let i = r.value;
			return n.test(i)
				? null
				: { pattern: { requiredPattern: e, actualValue: i } };
		}
	);
}
function Mi(t) {
	return null;
}
function wc(t) {
	return t != null;
}
function vc(t) {
	return _n(t) ? Q(t) : t;
}
function yc(t) {
	let n = {};
	return (
		t.forEach((e) => {
			n = e != null ? v(v({}, n), e) : n;
		}),
		Object.keys(n).length === 0 ? null : n
	);
}
function bc(t, n) {
	return n.map((e) => e(t));
}
function Rm(t) {
	return !t.validate;
}
function Dc(t) {
	return t.map((n) => (Rm(n) ? n : (e) => n.validate(e)));
}
function Cc(t) {
	if (!t) return null;
	let n = t.filter(wc);
	return n.length == 0
		? null
		: function (e) {
				return yc(bc(e, n));
			};
}
function Ec(t) {
	return t != null ? Cc(Dc(t)) : null;
}
function _c(t) {
	if (!t) return null;
	let n = t.filter(wc);
	return n.length == 0
		? null
		: function (e) {
				let r = bc(e, n).map(vc);
				return Ba(r).pipe(P(yc));
			};
}
function Ac(t) {
	return t != null ? _c(Dc(t)) : null;
}
function oc(t, n) {
	return t === null ? [n] : Array.isArray(t) ? [...t, n] : [t, n];
}
function Sc(t) {
	return t._rawValidators;
}
function Rc(t) {
	return t._rawAsyncValidators;
}
function ys(t) {
	return t ? (Array.isArray(t) ? t : [t]) : [];
}
function Ti(t, n) {
	return Array.isArray(t) ? t.includes(n) : t === n;
}
function sc(t, n) {
	let e = ys(n);
	return (
		ys(t).forEach((i) => {
			Ti(e, i) || e.push(i);
		}),
		e
	);
}
function ac(t, n) {
	return ys(n).filter((e) => !Ti(t, e));
}
var Ii = class {
		get value() {
			return this.control ? this.control.value : null;
		}
		get valid() {
			return this.control ? this.control.valid : null;
		}
		get invalid() {
			return this.control ? this.control.invalid : null;
		}
		get pending() {
			return this.control ? this.control.pending : null;
		}
		get disabled() {
			return this.control ? this.control.disabled : null;
		}
		get enabled() {
			return this.control ? this.control.enabled : null;
		}
		get errors() {
			return this.control ? this.control.errors : null;
		}
		get pristine() {
			return this.control ? this.control.pristine : null;
		}
		get dirty() {
			return this.control ? this.control.dirty : null;
		}
		get touched() {
			return this.control ? this.control.touched : null;
		}
		get status() {
			return this.control ? this.control.status : null;
		}
		get untouched() {
			return this.control ? this.control.untouched : null;
		}
		get statusChanges() {
			return this.control ? this.control.statusChanges : null;
		}
		get valueChanges() {
			return this.control ? this.control.valueChanges : null;
		}
		get path() {
			return null;
		}
		_composedValidatorFn;
		_composedAsyncValidatorFn;
		_rawValidators = [];
		_rawAsyncValidators = [];
		_setValidators(n) {
			((this._rawValidators = n || []),
				(this._composedValidatorFn = Ec(this._rawValidators)));
		}
		_setAsyncValidators(n) {
			((this._rawAsyncValidators = n || []),
				(this._composedAsyncValidatorFn = Ac(this._rawAsyncValidators)));
		}
		get validator() {
			return this._composedValidatorFn || null;
		}
		get asyncValidator() {
			return this._composedAsyncValidatorFn || null;
		}
		_onDestroyCallbacks = [];
		_registerOnDestroy(n) {
			this._onDestroyCallbacks.push(n);
		}
		_invokeOnDestroyCallbacks() {
			(this._onDestroyCallbacks.forEach((n) => n()),
				(this._onDestroyCallbacks = []));
		}
		reset(n = void 0) {
			this.control && this.control.reset(n);
		}
		hasError(n, e) {
			return this.control ? this.control.hasError(n, e) : !1;
		}
		getError(n, e) {
			return this.control ? this.control.getError(n, e) : null;
		}
	},
	Pt = class extends Ii {
		name;
		get formDirective() {
			return null;
		}
		get path() {
			return null;
		}
	},
	kt = class extends Ii {
		_parent = null;
		name = null;
		valueAccessor = null;
	},
	Fi = class {
		_cd;
		constructor(n) {
			this._cd = n;
		}
		get isTouched() {
			return (this._cd?.control?._touched?.(), !!this._cd?.control?.touched);
		}
		get isUntouched() {
			return !!this._cd?.control?.untouched;
		}
		get isPristine() {
			return (this._cd?.control?._pristine?.(), !!this._cd?.control?.pristine);
		}
		get isDirty() {
			return !!this._cd?.control?.dirty;
		}
		get isValid() {
			return (this._cd?.control?._status?.(), !!this._cd?.control?.valid);
		}
		get isInvalid() {
			return !!this._cd?.control?.invalid;
		}
		get isPending() {
			return !!this._cd?.control?.pending;
		}
		get isSubmitted() {
			return (this._cd?._submitted?.(), !!this._cd?.submitted);
		}
	},
	Mm = {
		"[class.ng-untouched]": "isUntouched",
		"[class.ng-touched]": "isTouched",
		"[class.ng-pristine]": "isPristine",
		"[class.ng-dirty]": "isDirty",
		"[class.ng-valid]": "isValid",
		"[class.ng-invalid]": "isInvalid",
		"[class.ng-pending]": "isPending",
	},
	Q0 = j(v({}, Mm), { "[class.ng-submitted]": "isSubmitted" }),
	eb = (() => {
		class t extends Fi {
			constructor(e) {
				super(e);
			}
			static ɵfac = function (r) {
				return new (r || t)(C(kt, 2));
			};
			static ɵdir = $({
				type: t,
				selectors: [
					["", "formControlName", ""],
					["", "ngModel", ""],
					["", "formControl", ""],
				],
				hostVars: 14,
				hostBindings: function (r, i) {
					r & 2 &&
						_o("ng-untouched", i.isUntouched)("ng-touched", i.isTouched)(
							"ng-pristine",
							i.isPristine,
						)("ng-dirty", i.isDirty)("ng-valid", i.isValid)(
							"ng-invalid",
							i.isInvalid,
						)("ng-pending", i.isPending);
				},
				standalone: !1,
				features: [Me],
			});
		}
		return t;
	})(),
	tb = (() => {
		class t extends Fi {
			constructor(e) {
				super(e);
			}
			static ɵfac = function (r) {
				return new (r || t)(C(Pt, 10));
			};
			static ɵdir = $({
				type: t,
				selectors: [
					["", "formGroupName", ""],
					["", "formArrayName", ""],
					["", "ngModelGroup", ""],
					["", "formGroup", ""],
					["form", 3, "ngNoForm", ""],
					["", "ngForm", ""],
				],
				hostVars: 16,
				hostBindings: function (r, i) {
					r & 2 &&
						_o("ng-untouched", i.isUntouched)("ng-touched", i.isTouched)(
							"ng-pristine",
							i.isPristine,
						)("ng-dirty", i.isDirty)("ng-valid", i.isValid)(
							"ng-invalid",
							i.isInvalid,
						)("ng-pending", i.isPending)("ng-submitted", i.isSubmitted);
				},
				standalone: !1,
				features: [Me],
			});
		}
		return t;
	})();
var or = "VALID",
	Ri = "INVALID",
	dn = "PENDING",
	sr = "DISABLED",
	pt = class {},
	Oi = class extends pt {
		value;
		source;
		constructor(n, e) {
			(super(), (this.value = n), (this.source = e));
		}
	},
	ar = class extends pt {
		pristine;
		source;
		constructor(n, e) {
			(super(), (this.pristine = n), (this.source = e));
		}
	},
	lr = class extends pt {
		touched;
		source;
		constructor(n, e) {
			(super(), (this.touched = n), (this.source = e));
		}
	},
	hn = class extends pt {
		status;
		source;
		constructor(n, e) {
			(super(), (this.status = n), (this.source = e));
		}
	},
	bs = class extends pt {
		source;
		constructor(n) {
			(super(), (this.source = n));
		}
	},
	Ds = class extends pt {
		source;
		constructor(n) {
			(super(), (this.source = n));
		}
	};
function Ts(t) {
	return (Li(t) ? t.validators : t) || null;
}
function Tm(t) {
	return Array.isArray(t) ? Ec(t) : t || null;
}
function Is(t, n) {
	return (Li(n) ? n.asyncValidators : t) || null;
}
function Im(t) {
	return Array.isArray(t) ? Ac(t) : t || null;
}
function Li(t) {
	return t != null && !Array.isArray(t) && typeof t == "object";
}
function Mc(t, n, e) {
	let r = t.controls;
	if (!(n ? Object.keys(r) : r).length) throw new T(1e3, "");
	if (!r[e]) throw new T(1001, "");
}
function Tc(t, n, e) {
	t._forEachChild((r, i) => {
		if (e[i] === void 0) throw new T(1002, "");
	});
}
var fn = class {
		_pendingDirty = !1;
		_hasOwnPendingAsyncValidator = null;
		_pendingTouched = !1;
		_onCollectionChange = () => {};
		_updateOn;
		_parent = null;
		_asyncValidationSubscription;
		_composedValidatorFn;
		_composedAsyncValidatorFn;
		_rawValidators;
		_rawAsyncValidators;
		value;
		constructor(n, e) {
			(this._assignValidators(n), this._assignAsyncValidators(e));
		}
		get validator() {
			return this._composedValidatorFn;
		}
		set validator(n) {
			this._rawValidators = this._composedValidatorFn = n;
		}
		get asyncValidator() {
			return this._composedAsyncValidatorFn;
		}
		set asyncValidator(n) {
			this._rawAsyncValidators = this._composedAsyncValidatorFn = n;
		}
		get parent() {
			return this._parent;
		}
		get status() {
			return We(this.statusReactive);
		}
		set status(n) {
			We(() => this.statusReactive.set(n));
		}
		_status = An(() => this.statusReactive());
		statusReactive = Cn(void 0);
		get valid() {
			return this.status === or;
		}
		get invalid() {
			return this.status === Ri;
		}
		get pending() {
			return this.status == dn;
		}
		get disabled() {
			return this.status === sr;
		}
		get enabled() {
			return this.status !== sr;
		}
		errors;
		get pristine() {
			return We(this.pristineReactive);
		}
		set pristine(n) {
			We(() => this.pristineReactive.set(n));
		}
		_pristine = An(() => this.pristineReactive());
		pristineReactive = Cn(!0);
		get dirty() {
			return !this.pristine;
		}
		get touched() {
			return We(this.touchedReactive);
		}
		set touched(n) {
			We(() => this.touchedReactive.set(n));
		}
		_touched = An(() => this.touchedReactive());
		touchedReactive = Cn(!1);
		get untouched() {
			return !this.touched;
		}
		_events = new de();
		events = this._events.asObservable();
		valueChanges;
		statusChanges;
		get updateOn() {
			return this._updateOn
				? this._updateOn
				: this.parent
					? this.parent.updateOn
					: "change";
		}
		setValidators(n) {
			this._assignValidators(n);
		}
		setAsyncValidators(n) {
			this._assignAsyncValidators(n);
		}
		addValidators(n) {
			this.setValidators(sc(n, this._rawValidators));
		}
		addAsyncValidators(n) {
			this.setAsyncValidators(sc(n, this._rawAsyncValidators));
		}
		removeValidators(n) {
			this.setValidators(ac(n, this._rawValidators));
		}
		removeAsyncValidators(n) {
			this.setAsyncValidators(ac(n, this._rawAsyncValidators));
		}
		hasValidator(n) {
			return Ti(this._rawValidators, n);
		}
		hasAsyncValidator(n) {
			return Ti(this._rawAsyncValidators, n);
		}
		clearValidators() {
			this.validator = null;
		}
		clearAsyncValidators() {
			this.asyncValidator = null;
		}
		markAsTouched(n = {}) {
			let e = this.touched === !1;
			this.touched = !0;
			let r = n.sourceControl ?? this;
			(this._parent &&
				!n.onlySelf &&
				this._parent.markAsTouched(j(v({}, n), { sourceControl: r })),
				e && n.emitEvent !== !1 && this._events.next(new lr(!0, r)));
		}
		markAllAsTouched(n = {}) {
			(this.markAsTouched({
				onlySelf: !0,
				emitEvent: n.emitEvent,
				sourceControl: this,
			}),
				this._forEachChild((e) => e.markAllAsTouched(n)));
		}
		markAsUntouched(n = {}) {
			let e = this.touched === !0;
			((this.touched = !1), (this._pendingTouched = !1));
			let r = n.sourceControl ?? this;
			(this._forEachChild((i) => {
				i.markAsUntouched({
					onlySelf: !0,
					emitEvent: n.emitEvent,
					sourceControl: r,
				});
			}),
				this._parent && !n.onlySelf && this._parent._updateTouched(n, r),
				e && n.emitEvent !== !1 && this._events.next(new lr(!1, r)));
		}
		markAsDirty(n = {}) {
			let e = this.pristine === !0;
			this.pristine = !1;
			let r = n.sourceControl ?? this;
			(this._parent &&
				!n.onlySelf &&
				this._parent.markAsDirty(j(v({}, n), { sourceControl: r })),
				e && n.emitEvent !== !1 && this._events.next(new ar(!1, r)));
		}
		markAsPristine(n = {}) {
			let e = this.pristine === !1;
			((this.pristine = !0), (this._pendingDirty = !1));
			let r = n.sourceControl ?? this;
			(this._forEachChild((i) => {
				i.markAsPristine({ onlySelf: !0, emitEvent: n.emitEvent });
			}),
				this._parent && !n.onlySelf && this._parent._updatePristine(n, r),
				e && n.emitEvent !== !1 && this._events.next(new ar(!0, r)));
		}
		markAsPending(n = {}) {
			this.status = dn;
			let e = n.sourceControl ?? this;
			(n.emitEvent !== !1 &&
				(this._events.next(new hn(this.status, e)),
				this.statusChanges.emit(this.status)),
				this._parent &&
					!n.onlySelf &&
					this._parent.markAsPending(j(v({}, n), { sourceControl: e })));
		}
		disable(n = {}) {
			let e = this._parentMarkedDirty(n.onlySelf);
			((this.status = sr),
				(this.errors = null),
				this._forEachChild((i) => {
					i.disable(j(v({}, n), { onlySelf: !0 }));
				}),
				this._updateValue());
			let r = n.sourceControl ?? this;
			(n.emitEvent !== !1 &&
				(this._events.next(new Oi(this.value, r)),
				this._events.next(new hn(this.status, r)),
				this.valueChanges.emit(this.value),
				this.statusChanges.emit(this.status)),
				this._updateAncestors(j(v({}, n), { skipPristineCheck: e }), this),
				this._onDisabledChange.forEach((i) => i(!0)));
		}
		enable(n = {}) {
			let e = this._parentMarkedDirty(n.onlySelf);
			((this.status = or),
				this._forEachChild((r) => {
					r.enable(j(v({}, n), { onlySelf: !0 }));
				}),
				this.updateValueAndValidity({ onlySelf: !0, emitEvent: n.emitEvent }),
				this._updateAncestors(j(v({}, n), { skipPristineCheck: e }), this),
				this._onDisabledChange.forEach((r) => r(!1)));
		}
		_updateAncestors(n, e) {
			this._parent &&
				!n.onlySelf &&
				(this._parent.updateValueAndValidity(n),
				n.skipPristineCheck || this._parent._updatePristine({}, e),
				this._parent._updateTouched({}, e));
		}
		setParent(n) {
			this._parent = n;
		}
		getRawValue() {
			return this.value;
		}
		updateValueAndValidity(n = {}) {
			if ((this._setInitialStatus(), this._updateValue(), this.enabled)) {
				let r = this._cancelExistingSubscription();
				((this.errors = this._runValidator()),
					(this.status = this._calculateStatus()),
					(this.status === or || this.status === dn) &&
						this._runAsyncValidator(r, n.emitEvent));
			}
			let e = n.sourceControl ?? this;
			(n.emitEvent !== !1 &&
				(this._events.next(new Oi(this.value, e)),
				this._events.next(new hn(this.status, e)),
				this.valueChanges.emit(this.value),
				this.statusChanges.emit(this.status)),
				this._parent &&
					!n.onlySelf &&
					this._parent.updateValueAndValidity(
						j(v({}, n), { sourceControl: e }),
					));
		}
		_updateTreeValidity(n = { emitEvent: !0 }) {
			(this._forEachChild((e) => e._updateTreeValidity(n)),
				this.updateValueAndValidity({ onlySelf: !0, emitEvent: n.emitEvent }));
		}
		_setInitialStatus() {
			this.status = this._allControlsDisabled() ? sr : or;
		}
		_runValidator() {
			return this.validator ? this.validator(this) : null;
		}
		_runAsyncValidator(n, e) {
			if (this.asyncValidator) {
				((this.status = dn),
					(this._hasOwnPendingAsyncValidator = { emitEvent: e !== !1 }));
				let r = vc(this.asyncValidator(this));
				this._asyncValidationSubscription = r.subscribe((i) => {
					((this._hasOwnPendingAsyncValidator = null),
						this.setErrors(i, { emitEvent: e, shouldHaveEmitted: n }));
				});
			}
		}
		_cancelExistingSubscription() {
			if (this._asyncValidationSubscription) {
				this._asyncValidationSubscription.unsubscribe();
				let n = this._hasOwnPendingAsyncValidator?.emitEvent ?? !1;
				return ((this._hasOwnPendingAsyncValidator = null), n);
			}
			return !1;
		}
		setErrors(n, e = {}) {
			((this.errors = n),
				this._updateControlsErrors(
					e.emitEvent !== !1,
					this,
					e.shouldHaveEmitted,
				));
		}
		get(n) {
			let e = n;
			return e == null ||
				(Array.isArray(e) || (e = e.split(".")), e.length === 0)
				? null
				: e.reduce((r, i) => r && r._find(i), this);
		}
		getError(n, e) {
			let r = e ? this.get(e) : this;
			return r && r.errors ? r.errors[n] : null;
		}
		hasError(n, e) {
			return !!this.getError(n, e);
		}
		get root() {
			let n = this;
			for (; n._parent; ) n = n._parent;
			return n;
		}
		_updateControlsErrors(n, e, r) {
			((this.status = this._calculateStatus()),
				n && this.statusChanges.emit(this.status),
				(n || r) && this._events.next(new hn(this.status, e)),
				this._parent && this._parent._updateControlsErrors(n, e, r));
		}
		_initObservables() {
			((this.valueChanges = new ve()), (this.statusChanges = new ve()));
		}
		_calculateStatus() {
			return this._allControlsDisabled()
				? sr
				: this.errors
					? Ri
					: this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(dn)
						? dn
						: this._anyControlsHaveStatus(Ri)
							? Ri
							: or;
		}
		_anyControlsHaveStatus(n) {
			return this._anyControls((e) => e.status === n);
		}
		_anyControlsDirty() {
			return this._anyControls((n) => n.dirty);
		}
		_anyControlsTouched() {
			return this._anyControls((n) => n.touched);
		}
		_updatePristine(n, e) {
			let r = !this._anyControlsDirty(),
				i = this.pristine !== r;
			((this.pristine = r),
				this._parent && !n.onlySelf && this._parent._updatePristine(n, e),
				i && this._events.next(new ar(this.pristine, e)));
		}
		_updateTouched(n = {}, e) {
			((this.touched = this._anyControlsTouched()),
				this._events.next(new lr(this.touched, e)),
				this._parent && !n.onlySelf && this._parent._updateTouched(n, e));
		}
		_onDisabledChange = [];
		_registerOnCollectionChange(n) {
			this._onCollectionChange = n;
		}
		_setUpdateStrategy(n) {
			Li(n) && n.updateOn != null && (this._updateOn = n.updateOn);
		}
		_parentMarkedDirty(n) {
			let e = this._parent && this._parent.dirty;
			return !n && !!e && !this._parent._anyControlsDirty();
		}
		_find(n) {
			return null;
		}
		_assignValidators(n) {
			((this._rawValidators = Array.isArray(n) ? n.slice() : n),
				(this._composedValidatorFn = Tm(this._rawValidators)));
		}
		_assignAsyncValidators(n) {
			((this._rawAsyncValidators = Array.isArray(n) ? n.slice() : n),
				(this._composedAsyncValidatorFn = Im(this._rawAsyncValidators)));
		}
	},
	Pi = class extends fn {
		constructor(n, e, r) {
			(super(Ts(e), Is(r, e)),
				(this.controls = n),
				this._initObservables(),
				this._setUpdateStrategy(e),
				this._setUpControls(),
				this.updateValueAndValidity({
					onlySelf: !0,
					emitEvent: !!this.asyncValidator,
				}));
		}
		controls;
		registerControl(n, e) {
			return this.controls[n]
				? this.controls[n]
				: ((this.controls[n] = e),
					e.setParent(this),
					e._registerOnCollectionChange(this._onCollectionChange),
					e);
		}
		addControl(n, e, r = {}) {
			(this.registerControl(n, e),
				this.updateValueAndValidity({ emitEvent: r.emitEvent }),
				this._onCollectionChange());
		}
		removeControl(n, e = {}) {
			(this.controls[n] &&
				this.controls[n]._registerOnCollectionChange(() => {}),
				delete this.controls[n],
				this.updateValueAndValidity({ emitEvent: e.emitEvent }),
				this._onCollectionChange());
		}
		setControl(n, e, r = {}) {
			(this.controls[n] &&
				this.controls[n]._registerOnCollectionChange(() => {}),
				delete this.controls[n],
				e && this.registerControl(n, e),
				this.updateValueAndValidity({ emitEvent: r.emitEvent }),
				this._onCollectionChange());
		}
		contains(n) {
			return this.controls.hasOwnProperty(n) && this.controls[n].enabled;
		}
		setValue(n, e = {}) {
			(Tc(this, !0, n),
				Object.keys(n).forEach((r) => {
					(Mc(this, !0, r),
						this.controls[r].setValue(n[r], {
							onlySelf: !0,
							emitEvent: e.emitEvent,
						}));
				}),
				this.updateValueAndValidity(e));
		}
		patchValue(n, e = {}) {
			n != null &&
				(Object.keys(n).forEach((r) => {
					let i = this.controls[r];
					i && i.patchValue(n[r], { onlySelf: !0, emitEvent: e.emitEvent });
				}),
				this.updateValueAndValidity(e));
		}
		reset(n = {}, e = {}) {
			(this._forEachChild((r, i) => {
				r.reset(n ? n[i] : null, { onlySelf: !0, emitEvent: e.emitEvent });
			}),
				this._updatePristine(e, this),
				this._updateTouched(e, this),
				this.updateValueAndValidity(e));
		}
		getRawValue() {
			return this._reduceChildren(
				{},
				(n, e, r) => ((n[r] = e.getRawValue()), n),
			);
		}
		_syncPendingControls() {
			let n = this._reduceChildren(!1, (e, r) =>
				r._syncPendingControls() ? !0 : e,
			);
			return (n && this.updateValueAndValidity({ onlySelf: !0 }), n);
		}
		_forEachChild(n) {
			Object.keys(this.controls).forEach((e) => {
				let r = this.controls[e];
				r && n(r, e);
			});
		}
		_setUpControls() {
			this._forEachChild((n) => {
				(n.setParent(this),
					n._registerOnCollectionChange(this._onCollectionChange));
			});
		}
		_updateValue() {
			this.value = this._reduceValue();
		}
		_anyControls(n) {
			for (let [e, r] of Object.entries(this.controls))
				if (this.contains(e) && n(r)) return !0;
			return !1;
		}
		_reduceValue() {
			let n = {};
			return this._reduceChildren(
				n,
				(e, r, i) => ((r.enabled || this.disabled) && (e[i] = r.value), e),
			);
		}
		_reduceChildren(n, e) {
			let r = n;
			return (
				this._forEachChild((i, l) => {
					r = e(r, i, l);
				}),
				r
			);
		}
		_allControlsDisabled() {
			for (let n of Object.keys(this.controls))
				if (this.controls[n].enabled) return !1;
			return Object.keys(this.controls).length > 0 || this.disabled;
		}
		_find(n) {
			return this.controls.hasOwnProperty(n) ? this.controls[n] : null;
		}
	};
var Cs = class extends Pi {};
var Bi = new S("", { providedIn: "root", factory: () => Vi }),
	Vi = "always";
function Ic(t, n) {
	return [...n.path, t];
}
function Es(t, n, e = Vi) {
	(Fs(t, n),
		n.valueAccessor.writeValue(t.value),
		(t.disabled || e === "always") &&
			n.valueAccessor.setDisabledState?.(t.disabled),
		Om(t, n),
		km(t, n),
		Pm(t, n),
		Fm(t, n));
}
function lc(t, n, e = !0) {
	let r = () => {};
	(n.valueAccessor &&
		(n.valueAccessor.registerOnChange(r), n.valueAccessor.registerOnTouched(r)),
		xi(t, n),
		t &&
			(n._invokeOnDestroyCallbacks(), t._registerOnCollectionChange(() => {})));
}
function ki(t, n) {
	t.forEach((e) => {
		e.registerOnValidatorChange && e.registerOnValidatorChange(n);
	});
}
function Fm(t, n) {
	if (n.valueAccessor.setDisabledState) {
		let e = (r) => {
			n.valueAccessor.setDisabledState(r);
		};
		(t.registerOnDisabledChange(e),
			n._registerOnDestroy(() => {
				t._unregisterOnDisabledChange(e);
			}));
	}
}
function Fs(t, n) {
	let e = Sc(t);
	n.validator !== null
		? t.setValidators(oc(e, n.validator))
		: typeof e == "function" && t.setValidators([e]);
	let r = Rc(t);
	n.asyncValidator !== null
		? t.setAsyncValidators(oc(r, n.asyncValidator))
		: typeof r == "function" && t.setAsyncValidators([r]);
	let i = () => t.updateValueAndValidity();
	(ki(n._rawValidators, i), ki(n._rawAsyncValidators, i));
}
function xi(t, n) {
	let e = !1;
	if (t !== null) {
		if (n.validator !== null) {
			let i = Sc(t);
			if (Array.isArray(i) && i.length > 0) {
				let l = i.filter((a) => a !== n.validator);
				l.length !== i.length && ((e = !0), t.setValidators(l));
			}
		}
		if (n.asyncValidator !== null) {
			let i = Rc(t);
			if (Array.isArray(i) && i.length > 0) {
				let l = i.filter((a) => a !== n.asyncValidator);
				l.length !== i.length && ((e = !0), t.setAsyncValidators(l));
			}
		}
	}
	let r = () => {};
	return (ki(n._rawValidators, r), ki(n._rawAsyncValidators, r), e);
}
function Om(t, n) {
	n.valueAccessor.registerOnChange((e) => {
		((t._pendingValue = e),
			(t._pendingChange = !0),
			(t._pendingDirty = !0),
			t.updateOn === "change" && Fc(t, n));
	});
}
function Pm(t, n) {
	n.valueAccessor.registerOnTouched(() => {
		((t._pendingTouched = !0),
			t.updateOn === "blur" && t._pendingChange && Fc(t, n),
			t.updateOn !== "submit" && t.markAsTouched());
	});
}
function Fc(t, n) {
	(t._pendingDirty && t.markAsDirty(),
		t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
		n.viewToModelUpdate(t._pendingValue),
		(t._pendingChange = !1));
}
function km(t, n) {
	let e = (r, i) => {
		(n.valueAccessor.writeValue(r), i && n.viewToModelUpdate(r));
	};
	(t.registerOnChange(e),
		n._registerOnDestroy(() => {
			t._unregisterOnChange(e);
		}));
}
function xm(t, n) {
	(t == null, Fs(t, n));
}
function Nm(t, n) {
	return xi(t, n);
}
function Oc(t, n) {
	if (!t.hasOwnProperty("model")) return !1;
	let e = t.model;
	return e.isFirstChange() ? !0 : !Object.is(n, e.currentValue);
}
function Lm(t) {
	return Object.getPrototypeOf(t.constructor) === As;
}
function Bm(t, n) {
	(t._syncPendingControls(),
		n.forEach((e) => {
			let r = e.control;
			r.updateOn === "submit" &&
				r._pendingChange &&
				(e.viewToModelUpdate(r._pendingValue), (r._pendingChange = !1));
		}));
}
function Pc(t, n) {
	if (!n) return null;
	Array.isArray(n);
	let e, r, i;
	return (
		n.forEach((l) => {
			l.constructor === gc ? (e = l) : Lm(l) ? (r = l) : (i = l);
		}),
		i || r || e || null
	);
}
function Vm(t, n) {
	let e = t.indexOf(n);
	e > -1 && t.splice(e, 1);
}
function uc(t, n) {
	let e = t.indexOf(n);
	e > -1 && t.splice(e, 1);
}
function cc(t) {
	return (
		typeof t == "object" &&
		t !== null &&
		Object.keys(t).length === 2 &&
		"value" in t &&
		"disabled" in t
	);
}
var ur = class extends fn {
	defaultValue = null;
	_onChange = [];
	_pendingValue;
	_pendingChange = !1;
	constructor(n = null, e, r) {
		(super(Ts(e), Is(r, e)),
			this._applyFormState(n),
			this._setUpdateStrategy(e),
			this._initObservables(),
			this.updateValueAndValidity({
				onlySelf: !0,
				emitEvent: !!this.asyncValidator,
			}),
			Li(e) &&
				(e.nonNullable || e.initialValueIsDefault) &&
				(cc(n) ? (this.defaultValue = n.value) : (this.defaultValue = n)));
	}
	setValue(n, e = {}) {
		((this.value = this._pendingValue = n),
			this._onChange.length &&
				e.emitModelToViewChange !== !1 &&
				this._onChange.forEach((r) =>
					r(this.value, e.emitViewToModelChange !== !1),
				),
			this.updateValueAndValidity(e));
	}
	patchValue(n, e = {}) {
		this.setValue(n, e);
	}
	reset(n = this.defaultValue, e = {}) {
		(this._applyFormState(n),
			this.markAsPristine(e),
			this.markAsUntouched(e),
			this.setValue(this.value, e),
			(this._pendingChange = !1));
	}
	_updateValue() {}
	_anyControls(n) {
		return !1;
	}
	_allControlsDisabled() {
		return this.disabled;
	}
	registerOnChange(n) {
		this._onChange.push(n);
	}
	_unregisterOnChange(n) {
		uc(this._onChange, n);
	}
	registerOnDisabledChange(n) {
		this._onDisabledChange.push(n);
	}
	_unregisterOnDisabledChange(n) {
		uc(this._onDisabledChange, n);
	}
	_forEachChild(n) {}
	_syncPendingControls() {
		return this.updateOn === "submit" &&
			(this._pendingDirty && this.markAsDirty(),
			this._pendingTouched && this.markAsTouched(),
			this._pendingChange)
			? (this.setValue(this._pendingValue, {
					onlySelf: !0,
					emitModelToViewChange: !1,
				}),
				!0)
			: !1;
	}
	_applyFormState(n) {
		cc(n)
			? ((this.value = this._pendingValue = n.value),
				n.disabled
					? this.disable({ onlySelf: !0, emitEvent: !1 })
					: this.enable({ onlySelf: !0, emitEvent: !1 }))
			: (this.value = this._pendingValue = n);
	}
};
var Um = (t) => t instanceof ur;
var jm = { provide: kt, useExisting: tt(() => $m) },
	dc = Promise.resolve(),
	$m = (() => {
		class t extends kt {
			_changeDetectorRef;
			callSetDisabledState;
			control = new ur();
			static ngAcceptInputType_isDisabled;
			_registered = !1;
			viewModel;
			name = "";
			isDisabled;
			model;
			options;
			update = new ve();
			constructor(e, r, i, l, a, d) {
				(super(),
					(this._changeDetectorRef = a),
					(this.callSetDisabledState = d),
					(this._parent = e),
					this._setValidators(r),
					this._setAsyncValidators(i),
					(this.valueAccessor = Pc(this, l)));
			}
			ngOnChanges(e) {
				if ((this._checkForErrors(), !this._registered || "name" in e)) {
					if (this._registered && (this._checkName(), this.formDirective)) {
						let r = e.name.previousValue;
						this.formDirective.removeControl({
							name: r,
							path: this._getPath(r),
						});
					}
					this._setUpControl();
				}
				("isDisabled" in e && this._updateDisabled(e),
					Oc(e, this.viewModel) &&
						(this._updateValue(this.model), (this.viewModel = this.model)));
			}
			ngOnDestroy() {
				this.formDirective && this.formDirective.removeControl(this);
			}
			get path() {
				return this._getPath(this.name);
			}
			get formDirective() {
				return this._parent ? this._parent.formDirective : null;
			}
			viewToModelUpdate(e) {
				((this.viewModel = e), this.update.emit(e));
			}
			_setUpControl() {
				(this._setUpdateStrategy(),
					this._isStandalone()
						? this._setUpStandalone()
						: this.formDirective.addControl(this),
					(this._registered = !0));
			}
			_setUpdateStrategy() {
				this.options &&
					this.options.updateOn != null &&
					(this.control._updateOn = this.options.updateOn);
			}
			_isStandalone() {
				return !this._parent || !!(this.options && this.options.standalone);
			}
			_setUpStandalone() {
				(Es(this.control, this, this.callSetDisabledState),
					this.control.updateValueAndValidity({ emitEvent: !1 }));
			}
			_checkForErrors() {
				this._checkName();
			}
			_checkName() {
				(this.options && this.options.name && (this.name = this.options.name),
					!this._isStandalone() && this.name);
			}
			_updateValue(e) {
				dc.then(() => {
					(this.control.setValue(e, { emitViewToModelChange: !1 }),
						this._changeDetectorRef?.markForCheck());
				});
			}
			_updateDisabled(e) {
				let r = e.isDisabled.currentValue,
					i = r !== 0 && ot(r);
				dc.then(() => {
					(i && !this.control.disabled
						? this.control.disable()
						: !i && this.control.disabled && this.control.enable(),
						this._changeDetectorRef?.markForCheck());
				});
			}
			_getPath(e) {
				return this._parent ? Ic(e, this._parent) : [e];
			}
			static ɵfac = function (r) {
				return new (r || t)(
					C(Pt, 9),
					C(Ni, 10),
					C(Ms, 10),
					C(cr, 10),
					C(Et, 8),
					C(Bi, 8),
				);
			};
			static ɵdir = $({
				type: t,
				selectors: [
					["", "ngModel", "", 3, "formControlName", "", 3, "formControl", ""],
				],
				inputs: {
					name: "name",
					isDisabled: [0, "disabled", "isDisabled"],
					model: [0, "ngModel", "model"],
					options: [0, "ngModelOptions", "options"],
				},
				outputs: { update: "ngModelChange" },
				exportAs: ["ngModel"],
				standalone: !1,
				features: [it([jm]), Me, _e],
			});
		}
		return t;
	})();
var rb = (() => {
	class t {
		static ɵfac = function (r) {
			return new (r || t)();
		};
		static ɵdir = $({
			type: t,
			selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
			hostAttrs: ["novalidate", ""],
			standalone: !1,
		});
	}
	return t;
})();
var kc = new S("");
var zm = { provide: Pt, useExisting: tt(() => Hm) },
	Hm = (() => {
		class t extends Pt {
			callSetDisabledState;
			get submitted() {
				return We(this._submittedReactive);
			}
			set submitted(e) {
				this._submittedReactive.set(e);
			}
			_submitted = An(() => this._submittedReactive());
			_submittedReactive = Cn(!1);
			_oldForm;
			_onCollectionChange = () => this._updateDomValue();
			directives = [];
			form = null;
			ngSubmit = new ve();
			constructor(e, r, i) {
				(super(),
					(this.callSetDisabledState = i),
					this._setValidators(e),
					this._setAsyncValidators(r));
			}
			ngOnChanges(e) {
				e.hasOwnProperty("form") &&
					(this._updateValidators(),
					this._updateDomValue(),
					this._updateRegistrations(),
					(this._oldForm = this.form));
			}
			ngOnDestroy() {
				this.form &&
					(xi(this.form, this),
					this.form._onCollectionChange === this._onCollectionChange &&
						this.form._registerOnCollectionChange(() => {}));
			}
			get formDirective() {
				return this;
			}
			get control() {
				return this.form;
			}
			get path() {
				return [];
			}
			addControl(e) {
				let r = this.form.get(e.path);
				return (
					Es(r, e, this.callSetDisabledState),
					r.updateValueAndValidity({ emitEvent: !1 }),
					this.directives.push(e),
					r
				);
			}
			getControl(e) {
				return this.form.get(e.path);
			}
			removeControl(e) {
				(lc(e.control || null, e, !1), Vm(this.directives, e));
			}
			addFormGroup(e) {
				this._setUpFormContainer(e);
			}
			removeFormGroup(e) {
				this._cleanUpFormContainer(e);
			}
			getFormGroup(e) {
				return this.form.get(e.path);
			}
			addFormArray(e) {
				this._setUpFormContainer(e);
			}
			removeFormArray(e) {
				this._cleanUpFormContainer(e);
			}
			getFormArray(e) {
				return this.form.get(e.path);
			}
			updateModel(e, r) {
				this.form.get(e.path).setValue(r);
			}
			onSubmit(e) {
				return (
					this._submittedReactive.set(!0),
					Bm(this.form, this.directives),
					this.ngSubmit.emit(e),
					this.form._events.next(new bs(this.control)),
					e?.target?.method === "dialog"
				);
			}
			onReset() {
				this.resetForm();
			}
			resetForm(e = void 0) {
				(this.form.reset(e),
					this._submittedReactive.set(!1),
					this.form._events.next(new Ds(this.form)));
			}
			_updateDomValue() {
				(this.directives.forEach((e) => {
					let r = e.control,
						i = this.form.get(e.path);
					r !== i &&
						(lc(r || null, e),
						Um(i) && (Es(i, e, this.callSetDisabledState), (e.control = i)));
				}),
					this.form._updateTreeValidity({ emitEvent: !1 }));
			}
			_setUpFormContainer(e) {
				let r = this.form.get(e.path);
				(xm(r, e), r.updateValueAndValidity({ emitEvent: !1 }));
			}
			_cleanUpFormContainer(e) {
				if (this.form) {
					let r = this.form.get(e.path);
					r && Nm(r, e) && r.updateValueAndValidity({ emitEvent: !1 });
				}
			}
			_updateRegistrations() {
				(this.form._registerOnCollectionChange(this._onCollectionChange),
					this._oldForm && this._oldForm._registerOnCollectionChange(() => {}));
			}
			_updateValidators() {
				(Fs(this.form, this), this._oldForm && xi(this._oldForm, this));
			}
			static ɵfac = function (r) {
				return new (r || t)(C(Ni, 10), C(Ms, 10), C(Bi, 8));
			};
			static ɵdir = $({
				type: t,
				selectors: [["", "formGroup", ""]],
				hostBindings: function (r, i) {
					r & 1 &&
						Ct("submit", function (a) {
							return i.onSubmit(a);
						})("reset", function () {
							return i.onReset();
						});
				},
				inputs: { form: [0, "formGroup", "form"] },
				outputs: { ngSubmit: "ngSubmit" },
				exportAs: ["ngForm"],
				standalone: !1,
				features: [it([zm]), Me, _e],
			});
		}
		return t;
	})();
var Gm = { provide: kt, useExisting: tt(() => qm) },
	qm = (() => {
		class t extends kt {
			_ngModelWarningConfig;
			_added = !1;
			viewModel;
			control;
			name = null;
			set isDisabled(e) {}
			model;
			update = new ve();
			static _ngModelWarningSentOnce = !1;
			_ngModelWarningSent = !1;
			constructor(e, r, i, l, a) {
				(super(),
					(this._ngModelWarningConfig = a),
					(this._parent = e),
					this._setValidators(r),
					this._setAsyncValidators(i),
					(this.valueAccessor = Pc(this, l)));
			}
			ngOnChanges(e) {
				(this._added || this._setUpControl(),
					Oc(e, this.viewModel) &&
						((this.viewModel = this.model),
						this.formDirective.updateModel(this, this.model)));
			}
			ngOnDestroy() {
				this.formDirective && this.formDirective.removeControl(this);
			}
			viewToModelUpdate(e) {
				((this.viewModel = e), this.update.emit(e));
			}
			get path() {
				return Ic(
					this.name == null ? this.name : this.name.toString(),
					this._parent,
				);
			}
			get formDirective() {
				return this._parent ? this._parent.formDirective : null;
			}
			_setUpControl() {
				((this.control = this.formDirective.addControl(this)),
					(this._added = !0));
			}
			static ɵfac = function (r) {
				return new (r || t)(
					C(Pt, 13),
					C(Ni, 10),
					C(Ms, 10),
					C(cr, 10),
					C(kc, 8),
				);
			};
			static ɵdir = $({
				type: t,
				selectors: [["", "formControlName", ""]],
				inputs: {
					name: [0, "formControlName", "name"],
					isDisabled: [0, "disabled", "isDisabled"],
					model: [0, "ngModel", "model"],
				},
				outputs: { update: "ngModelChange" },
				standalone: !1,
				features: [it([Gm]), Me, _e],
			});
		}
		return t;
	})();
var Wm = { provide: cr, useExisting: tt(() => Nc), multi: !0 };
function xc(t, n) {
	return t == null
		? `${n}`
		: (n && typeof n == "object" && (n = "Object"), `${t}: ${n}`.slice(0, 50));
}
function Ym(t) {
	return t.split(":")[0];
}
var Nc = (() => {
		class t extends As {
			value;
			_optionMap = new Map();
			_idCounter = 0;
			set compareWith(e) {
				this._compareWith = e;
			}
			_compareWith = Object.is;
			writeValue(e) {
				this.value = e;
				let r = this._getOptionId(e),
					i = xc(r, e);
				this.setProperty("value", i);
			}
			registerOnChange(e) {
				this.onChange = (r) => {
					((this.value = this._getOptionValue(r)), e(this.value));
				};
			}
			_registerOption() {
				return (this._idCounter++).toString();
			}
			_getOptionId(e) {
				for (let r of this._optionMap.keys())
					if (this._compareWith(this._optionMap.get(r), e)) return r;
				return null;
			}
			_getOptionValue(e) {
				let r = Ym(e);
				return this._optionMap.has(r) ? this._optionMap.get(r) : e;
			}
			static ɵfac = (() => {
				let e;
				return function (i) {
					return (e || (e = rt(t)))(i || t);
				};
			})();
			static ɵdir = $({
				type: t,
				selectors: [
					["select", "formControlName", "", 3, "multiple", ""],
					["select", "formControl", "", 3, "multiple", ""],
					["select", "ngModel", "", 3, "multiple", ""],
				],
				hostBindings: function (r, i) {
					r & 1 &&
						Ct("change", function (a) {
							return i.onChange(a.target.value);
						})("blur", function () {
							return i.onTouched();
						});
				},
				inputs: { compareWith: "compareWith" },
				standalone: !1,
				features: [it([Wm]), Me],
			});
		}
		return t;
	})(),
	ib = (() => {
		class t {
			_element;
			_renderer;
			_select;
			id;
			constructor(e, r, i) {
				((this._element = e),
					(this._renderer = r),
					(this._select = i),
					this._select && (this.id = this._select._registerOption()));
			}
			set ngValue(e) {
				this._select != null &&
					(this._select._optionMap.set(this.id, e),
					this._setElementValue(xc(this.id, e)),
					this._select.writeValue(this._select.value));
			}
			set value(e) {
				(this._setElementValue(e),
					this._select && this._select.writeValue(this._select.value));
			}
			_setElementValue(e) {
				this._renderer.setProperty(this._element.nativeElement, "value", e);
			}
			ngOnDestroy() {
				this._select &&
					(this._select._optionMap.delete(this.id),
					this._select.writeValue(this._select.value));
			}
			static ɵfac = function (r) {
				return new (r || t)(C(Ae), C(Se), C(Nc, 9));
			};
			static ɵdir = $({
				type: t,
				selectors: [["option"]],
				inputs: { ngValue: "ngValue", value: "value" },
				standalone: !1,
			});
		}
		return t;
	})(),
	Zm = { provide: cr, useExisting: tt(() => Lc), multi: !0 };
function hc(t, n) {
	return t == null
		? `${n}`
		: (typeof n == "string" && (n = `'${n}'`),
			n && typeof n == "object" && (n = "Object"),
			`${t}: ${n}`.slice(0, 50));
}
function Xm(t) {
	return t.split(":")[0];
}
var Lc = (() => {
		class t extends As {
			value;
			_optionMap = new Map();
			_idCounter = 0;
			set compareWith(e) {
				this._compareWith = e;
			}
			_compareWith = Object.is;
			writeValue(e) {
				this.value = e;
				let r;
				if (Array.isArray(e)) {
					let i = e.map((l) => this._getOptionId(l));
					r = (l, a) => {
						l._setSelected(i.indexOf(a.toString()) > -1);
					};
				} else
					r = (i, l) => {
						i._setSelected(!1);
					};
				this._optionMap.forEach(r);
			}
			registerOnChange(e) {
				this.onChange = (r) => {
					let i = [],
						l = r.selectedOptions;
					if (l !== void 0) {
						let a = l;
						for (let d = 0; d < a.length; d++) {
							let h = a[d],
								g = this._getOptionValue(h.value);
							i.push(g);
						}
					} else {
						let a = r.options;
						for (let d = 0; d < a.length; d++) {
							let h = a[d];
							if (h.selected) {
								let g = this._getOptionValue(h.value);
								i.push(g);
							}
						}
					}
					((this.value = i), e(i));
				};
			}
			_registerOption(e) {
				let r = (this._idCounter++).toString();
				return (this._optionMap.set(r, e), r);
			}
			_getOptionId(e) {
				for (let r of this._optionMap.keys())
					if (this._compareWith(this._optionMap.get(r)._value, e)) return r;
				return null;
			}
			_getOptionValue(e) {
				let r = Xm(e);
				return this._optionMap.has(r) ? this._optionMap.get(r)._value : e;
			}
			static ɵfac = (() => {
				let e;
				return function (i) {
					return (e || (e = rt(t)))(i || t);
				};
			})();
			static ɵdir = $({
				type: t,
				selectors: [
					["select", "multiple", "", "formControlName", ""],
					["select", "multiple", "", "formControl", ""],
					["select", "multiple", "", "ngModel", ""],
				],
				hostBindings: function (r, i) {
					r & 1 &&
						Ct("change", function (a) {
							return i.onChange(a.target);
						})("blur", function () {
							return i.onTouched();
						});
				},
				inputs: { compareWith: "compareWith" },
				standalone: !1,
				features: [it([Zm]), Me],
			});
		}
		return t;
	})(),
	ob = (() => {
		class t {
			_element;
			_renderer;
			_select;
			id;
			_value;
			constructor(e, r, i) {
				((this._element = e),
					(this._renderer = r),
					(this._select = i),
					this._select && (this.id = this._select._registerOption(this)));
			}
			set ngValue(e) {
				this._select != null &&
					((this._value = e),
					this._setElementValue(hc(this.id, e)),
					this._select.writeValue(this._select.value));
			}
			set value(e) {
				this._select
					? ((this._value = e),
						this._setElementValue(hc(this.id, e)),
						this._select.writeValue(this._select.value))
					: this._setElementValue(e);
			}
			_setElementValue(e) {
				this._renderer.setProperty(this._element.nativeElement, "value", e);
			}
			_setSelected(e) {
				this._renderer.setProperty(this._element.nativeElement, "selected", e);
			}
			ngOnDestroy() {
				this._select &&
					(this._select._optionMap.delete(this.id),
					this._select.writeValue(this._select.value));
			}
			static ɵfac = function (r) {
				return new (r || t)(C(Ae), C(Se), C(Lc, 9));
			};
			static ɵdir = $({
				type: t,
				selectors: [["option"]],
				inputs: { ngValue: "ngValue", value: "value" },
				standalone: !1,
			});
		}
		return t;
	})();
var Km = (() => {
	class t {
		_validator = Mi;
		_onChange;
		_enabled;
		ngOnChanges(e) {
			if (this.inputName in e) {
				let r = this.normalizeInput(e[this.inputName].currentValue);
				((this._enabled = this.enabled(r)),
					(this._validator = this._enabled ? this.createValidator(r) : Mi),
					this._onChange && this._onChange());
			}
		}
		validate(e) {
			return this._validator(e);
		}
		registerOnValidatorChange(e) {
			this._onChange = e;
		}
		enabled(e) {
			return e != null;
		}
		static ɵfac = function (r) {
			return new (r || t)();
		};
		static ɵdir = $({ type: t, features: [_e] });
	}
	return t;
})();
var Jm = { provide: Ni, useExisting: tt(() => Qm), multi: !0 };
var Qm = (() => {
	class t extends Km {
		required;
		inputName = "required";
		normalizeInput = ot;
		createValidator = (e) => mc;
		enabled(e) {
			return e;
		}
		static ɵfac = (() => {
			let e;
			return function (i) {
				return (e || (e = rt(t)))(i || t);
			};
		})();
		static ɵdir = $({
			type: t,
			selectors: [
				["", "required", "", "formControlName", "", 3, "type", "checkbox"],
				["", "required", "", "formControl", "", 3, "type", "checkbox"],
				["", "required", "", "ngModel", "", 3, "type", "checkbox"],
			],
			hostVars: 1,
			hostBindings: function (r, i) {
				r & 2 && Tr("required", i._enabled ? "" : null);
			},
			inputs: { required: "required" },
			standalone: !1,
			features: [it([Jm]), Me],
		});
	}
	return t;
})();
var Bc = (() => {
		class t {
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵmod = Re({ type: t });
			static ɵinj = Ee({});
		}
		return t;
	})(),
	_s = class extends fn {
		constructor(n, e, r) {
			(super(Ts(e), Is(r, e)),
				(this.controls = n),
				this._initObservables(),
				this._setUpdateStrategy(e),
				this._setUpControls(),
				this.updateValueAndValidity({
					onlySelf: !0,
					emitEvent: !!this.asyncValidator,
				}));
		}
		controls;
		at(n) {
			return this.controls[this._adjustIndex(n)];
		}
		push(n, e = {}) {
			(this.controls.push(n),
				this._registerControl(n),
				this.updateValueAndValidity({ emitEvent: e.emitEvent }),
				this._onCollectionChange());
		}
		insert(n, e, r = {}) {
			(this.controls.splice(n, 0, e),
				this._registerControl(e),
				this.updateValueAndValidity({ emitEvent: r.emitEvent }));
		}
		removeAt(n, e = {}) {
			let r = this._adjustIndex(n);
			(r < 0 && (r = 0),
				this.controls[r] &&
					this.controls[r]._registerOnCollectionChange(() => {}),
				this.controls.splice(r, 1),
				this.updateValueAndValidity({ emitEvent: e.emitEvent }));
		}
		setControl(n, e, r = {}) {
			let i = this._adjustIndex(n);
			(i < 0 && (i = 0),
				this.controls[i] &&
					this.controls[i]._registerOnCollectionChange(() => {}),
				this.controls.splice(i, 1),
				e && (this.controls.splice(i, 0, e), this._registerControl(e)),
				this.updateValueAndValidity({ emitEvent: r.emitEvent }),
				this._onCollectionChange());
		}
		get length() {
			return this.controls.length;
		}
		setValue(n, e = {}) {
			(Tc(this, !1, n),
				n.forEach((r, i) => {
					(Mc(this, !1, i),
						this.at(i).setValue(r, { onlySelf: !0, emitEvent: e.emitEvent }));
				}),
				this.updateValueAndValidity(e));
		}
		patchValue(n, e = {}) {
			n != null &&
				(n.forEach((r, i) => {
					this.at(i) &&
						this.at(i).patchValue(r, { onlySelf: !0, emitEvent: e.emitEvent });
				}),
				this.updateValueAndValidity(e));
		}
		reset(n = [], e = {}) {
			(this._forEachChild((r, i) => {
				r.reset(n[i], { onlySelf: !0, emitEvent: e.emitEvent });
			}),
				this._updatePristine(e, this),
				this._updateTouched(e, this),
				this.updateValueAndValidity(e));
		}
		getRawValue() {
			return this.controls.map((n) => n.getRawValue());
		}
		clear(n = {}) {
			this.controls.length < 1 ||
				(this._forEachChild((e) => e._registerOnCollectionChange(() => {})),
				this.controls.splice(0),
				this.updateValueAndValidity({ emitEvent: n.emitEvent }));
		}
		_adjustIndex(n) {
			return n < 0 ? n + this.length : n;
		}
		_syncPendingControls() {
			let n = this.controls.reduce(
				(e, r) => (r._syncPendingControls() ? !0 : e),
				!1,
			);
			return (n && this.updateValueAndValidity({ onlySelf: !0 }), n);
		}
		_forEachChild(n) {
			this.controls.forEach((e, r) => {
				n(e, r);
			});
		}
		_updateValue() {
			this.value = this.controls
				.filter((n) => n.enabled || this.disabled)
				.map((n) => n.value);
		}
		_anyControls(n) {
			return this.controls.some((e) => e.enabled && n(e));
		}
		_setUpControls() {
			this._forEachChild((n) => this._registerControl(n));
		}
		_allControlsDisabled() {
			for (let n of this.controls) if (n.enabled) return !1;
			return this.controls.length > 0 || this.disabled;
		}
		_registerControl(n) {
			(n.setParent(this),
				n._registerOnCollectionChange(this._onCollectionChange));
		}
		_find(n) {
			return this.at(n) ?? null;
		}
	};
function fc(t) {
	return (
		!!t &&
		(t.asyncValidators !== void 0 ||
			t.validators !== void 0 ||
			t.updateOn !== void 0)
	);
}
var sb = (() => {
	class t {
		useNonNullable = !1;
		get nonNullable() {
			let e = new t();
			return ((e.useNonNullable = !0), e);
		}
		group(e, r = null) {
			let i = this._reduceControls(e),
				l = {};
			return (
				fc(r)
					? (l = r)
					: r !== null &&
						((l.validators = r.validator),
						(l.asyncValidators = r.asyncValidator)),
				new Pi(i, l)
			);
		}
		record(e, r = null) {
			let i = this._reduceControls(e);
			return new Cs(i, r);
		}
		control(e, r, i) {
			let l = {};
			return this.useNonNullable
				? (fc(r) ? (l = r) : ((l.validators = r), (l.asyncValidators = i)),
					new ur(e, j(v({}, l), { nonNullable: !0 })))
				: new ur(e, r, i);
		}
		array(e, r, i) {
			let l = e.map((a) => this._createControl(a));
			return new _s(l, r, i);
		}
		_reduceControls(e) {
			let r = {};
			return (
				Object.keys(e).forEach((i) => {
					r[i] = this._createControl(e[i]);
				}),
				r
			);
		}
		_createControl(e) {
			if (e instanceof ur) return e;
			if (e instanceof fn) return e;
			if (Array.isArray(e)) {
				let r = e[0],
					i = e.length > 1 ? e[1] : null,
					l = e.length > 2 ? e[2] : null;
				return this.control(r, i, l);
			} else return this.control(e);
		}
		static ɵfac = function (r) {
			return new (r || t)();
		};
		static ɵprov = E({ token: t, factory: t.ɵfac, providedIn: "root" });
	}
	return t;
})();
var ab = (() => {
		class t {
			static withConfig(e) {
				return {
					ngModule: t,
					providers: [{ provide: Bi, useValue: e.callSetDisabledState ?? Vi }],
				};
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵmod = Re({ type: t });
			static ɵinj = Ee({ imports: [Bc] });
		}
		return t;
	})(),
	lb = (() => {
		class t {
			static withConfig(e) {
				return {
					ngModule: t,
					providers: [
						{
							provide: kc,
							useValue: e.warnOnNgModelWithFormControl ?? "always",
						},
						{ provide: Bi, useValue: e.callSetDisabledState ?? Vi },
					],
				};
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵmod = Re({ type: t });
			static ɵinj = Ee({ imports: [Bc] });
		}
		return t;
	})();
var db = { production: !1, apiUrl: "http://localhost:3000/api" };
export {
	Y as a,
	Of as b,
	Tl as c,
	Pf as d,
	kf as e,
	xf as f,
	Lf as g,
	Vf as h,
	Pl as i,
	Uf as j,
	$r as k,
	Vo as l,
	rp as m,
	lt as n,
	Xe as o,
	Ql as p,
	Op as q,
	Pp as r,
	Ue as s,
	us as t,
	je as u,
	Gu as v,
	um as w,
	cm as x,
	cr as y,
	gc as z,
	ic as A,
	kt as B,
	eb as C,
	tb as D,
	$m as E,
	rb as F,
	Hm as G,
	qm as H,
	Nc as I,
	ib as J,
	ob as K,
	Qm as L,
	sb as M,
	ab as N,
	lb as O,
	db as P,
	ew as Q,
};
