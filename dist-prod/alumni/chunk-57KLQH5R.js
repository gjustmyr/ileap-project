import {
	$ as ze,
	A as ne,
	B as Ae,
	Ba as _e,
	C as de,
	Ca as lr,
	D as er,
	Da as Ti,
	E as je,
	Ea as qe,
	F as $e,
	Fa as I,
	G as ve,
	Ga as _i,
	H as tr,
	Ha as We,
	I as gi,
	Ia as Ii,
	J as mi,
	Ja as Kt,
	Jb as ki,
	K as vi,
	Ka as Mi,
	L as z,
	La as Ie,
	Lb as xi,
	M as Di,
	Ma as re,
	Mb as dt,
	N as k,
	Na as dr,
	Nb as Ui,
	O as E,
	Ob as Bi,
	Pb as ji,
	Q as g,
	Qa as Fi,
	Qb as ht,
	R as Te,
	Ra as hr,
	S as yi,
	Sa as fr,
	T as D,
	Ta as pr,
	U as nr,
	Ua as Oi,
	V as p,
	Va as Pi,
	Vb as $i,
	W as d,
	X as Zt,
	Y as wi,
	Z as De,
	_ as q,
	a as h,
	b as U,
	cb as Ni,
	da as rr,
	ea as ir,
	fa as ct,
	g as ci,
	ga as or,
	h as li,
	hb as W,
	i as di,
	ia as Yt,
	ib as M,
	j as Kn,
	ja as Ve,
	jb as Li,
	k as Xn,
	ka as he,
	l as K,
	la as sr,
	m as G,
	ma as Ci,
	n as le,
	na as He,
	o as L,
	p as f,
	pa as Ei,
	q as ut,
	qa as ar,
	r as hi,
	ra as Si,
	s as fi,
	sa as Ge,
	t as S,
	u as Wt,
	ua as ur,
	v as B,
	va as Ri,
	w as Jn,
	wa as cr,
	x as pi,
	xa as bi,
	y as Qn,
	ya as lt,
	za as Ai,
} from "./chunk-XHVVG3FB.js";
var F = new D("");
var Hi = null;
function fe() {
	return Hi;
}
function gr(t) {
	Hi ??= t;
}
var ft = class {},
	pt = (() => {
		class t {
			historyGo(e) {
				throw new Error("");
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = g({
				token: t,
				factory: () => d(Gi),
				providedIn: "platform",
			});
		}
		return t;
	})(),
	mr = new D(""),
	Gi = (() => {
		class t extends pt {
			_location;
			_history;
			_doc = d(F);
			constructor() {
				(super(),
					(this._location = window.location),
					(this._history = window.history));
			}
			getBaseHrefFromDOM() {
				return fe().getBaseHref(this._doc);
			}
			onPopState(e) {
				let r = fe().getGlobalEventTarget(this._doc, "window");
				return (
					r.addEventListener("popstate", e, !1),
					() => r.removeEventListener("popstate", e)
				);
			}
			onHashChange(e) {
				let r = fe().getGlobalEventTarget(this._doc, "window");
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
			static ɵprov = g({
				token: t,
				factory: () => new t(),
				providedIn: "platform",
			});
		}
		return t;
	})();
function Xt(t, n) {
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
function zi(t) {
	let n = t.search(/#|\?|$/);
	return t[n - 1] === "/" ? t.slice(0, n - 1) + t.slice(n) : t;
}
function X(t) {
	return t && t[0] !== "?" ? `?${t}` : t;
}
var J = (() => {
		class t {
			historyGo(e) {
				throw new Error("");
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = g({ token: t, factory: () => d(Qt), providedIn: "root" });
		}
		return t;
	})(),
	Jt = new D(""),
	Qt = (() => {
		class t extends J {
			_platformLocation;
			_baseHref;
			_removeListenerFns = [];
			constructor(e, r) {
				(super(),
					(this._platformLocation = e),
					(this._baseHref =
						r ??
						this._platformLocation.getBaseHrefFromDOM() ??
						d(F).location?.origin ??
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
				return Xt(this._baseHref, e);
			}
			path(e = !1) {
				let r =
						this._platformLocation.pathname + X(this._platformLocation.search),
					i = this._platformLocation.hash;
				return i && e ? `${r}${i}` : r;
			}
			pushState(e, r, i, o) {
				let s = this.prepareExternalUrl(i + X(o));
				this._platformLocation.pushState(e, r, s);
			}
			replaceState(e, r, i, o) {
				let s = this.prepareExternalUrl(i + X(o));
				this._platformLocation.replaceState(e, r, s);
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
				return new (r || t)(p(pt), p(Jt, 8));
			};
			static ɵprov = g({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})(),
	ye = (() => {
		class t {
			_subject = new K();
			_basePath;
			_locationStrategy;
			_urlChangeListeners = [];
			_urlChangeSubscription = null;
			constructor(e) {
				this._locationStrategy = e;
				let r = this._locationStrategy.getBaseHref();
				((this._basePath = $s(zi(Vi(r)))),
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
				return this.path() == this.normalize(e + X(r));
			}
			normalize(e) {
				return t.stripTrailingSlash(js(this._basePath, Vi(e)));
			}
			prepareExternalUrl(e) {
				return (
					e && e[0] !== "/" && (e = "/" + e),
					this._locationStrategy.prepareExternalUrl(e)
				);
			}
			go(e, r = "", i = null) {
				(this._locationStrategy.pushState(i, "", e, r),
					this._notifyUrlChangeListeners(this.prepareExternalUrl(e + X(r)), i));
			}
			replaceState(e, r = "", i = null) {
				(this._locationStrategy.replaceState(i, "", e, r),
					this._notifyUrlChangeListeners(this.prepareExternalUrl(e + X(r)), i));
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
			static normalizeQueryParams = X;
			static joinWithSlash = Xt;
			static stripTrailingSlash = zi;
			static ɵfac = function (r) {
				return new (r || t)(p(J));
			};
			static ɵprov = g({ token: t, factory: () => Bs(), providedIn: "root" });
		}
		return t;
	})();
function Bs() {
	return new ye(p(J));
}
function js(t, n) {
	if (!t || !n.startsWith(t)) return n;
	let e = n.substring(t.length);
	return e === "" || ["/", ";", "?", "#"].includes(e[0]) ? e : n;
}
function Vi(t) {
	return t.replace(/\/index.html$/, "");
}
function $s(t) {
	if (new RegExp("^(https?:)?//").test(t)) {
		let [, e] = t.split(/\/\/[^\/]+/);
		return e;
	}
	return t;
}
var Cr = (() => {
	class t extends J {
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
			let r = Xt(this._baseHref, e);
			return r.length > 0 ? "#" + r : r;
		}
		pushState(e, r, i, o) {
			let s =
				this.prepareExternalUrl(i + X(o)) || this._platformLocation.pathname;
			this._platformLocation.pushState(e, r, s);
		}
		replaceState(e, r, i, o) {
			let s =
				this.prepareExternalUrl(i + X(o)) || this._platformLocation.pathname;
			this._platformLocation.replaceState(e, r, s);
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
			return new (r || t)(p(pt), p(Jt, 8));
		};
		static ɵprov = g({ token: t, factory: t.ɵfac });
	}
	return t;
})();
var x = (function (t) {
		return (
			(t[(t.Format = 0)] = "Format"),
			(t[(t.Standalone = 1)] = "Standalone"),
			t
		);
	})(x || {}),
	A = (function (t) {
		return (
			(t[(t.Narrow = 0)] = "Narrow"),
			(t[(t.Abbreviated = 1)] = "Abbreviated"),
			(t[(t.Wide = 2)] = "Wide"),
			(t[(t.Short = 3)] = "Short"),
			t
		);
	})(A || {}),
	j = (function (t) {
		return (
			(t[(t.Short = 0)] = "Short"),
			(t[(t.Medium = 1)] = "Medium"),
			(t[(t.Long = 2)] = "Long"),
			(t[(t.Full = 3)] = "Full"),
			t
		);
	})(j || {}),
	ge = {
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
function Ki(t) {
	return W(t)[M.LocaleId];
}
function Xi(t, n, e) {
	let r = W(t),
		i = [r[M.DayPeriodsFormat], r[M.DayPeriodsStandalone]],
		o = Z(i, n);
	return Z(o, e);
}
function Ji(t, n, e) {
	let r = W(t),
		i = [r[M.DaysFormat], r[M.DaysStandalone]],
		o = Z(i, n);
	return Z(o, e);
}
function Qi(t, n, e) {
	let r = W(t),
		i = [r[M.MonthsFormat], r[M.MonthsStandalone]],
		o = Z(i, n);
	return Z(o, e);
}
function eo(t, n) {
	let r = W(t)[M.Eras];
	return Z(r, n);
}
function gt(t, n) {
	let e = W(t);
	return Z(e[M.DateFormat], n);
}
function mt(t, n) {
	let e = W(t);
	return Z(e[M.TimeFormat], n);
}
function vt(t, n) {
	let r = W(t)[M.DateTimeFormat];
	return Z(r, n);
}
function Dt(t, n) {
	let e = W(t),
		r = e[M.NumberSymbols][n];
	if (typeof r > "u") {
		if (n === ge.CurrencyDecimal) return e[M.NumberSymbols][ge.Decimal];
		if (n === ge.CurrencyGroup) return e[M.NumberSymbols][ge.Group];
	}
	return r;
}
function to(t) {
	if (!t[M.ExtraData])
		throw new Error(
			`Missing extra locale data for the locale "${t[M.LocaleId]}". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`,
		);
}
function no(t) {
	let n = W(t);
	return (
		to(n),
		(n[M.ExtraData][2] || []).map((r) =>
			typeof r == "string" ? vr(r) : [vr(r[0]), vr(r[1])],
		)
	);
}
function ro(t, n, e) {
	let r = W(t);
	to(r);
	let i = [r[M.ExtraData][0], r[M.ExtraData][1]],
		o = Z(i, n) || [];
	return Z(o, e) || [];
}
function Z(t, n) {
	for (let e = n; e > -1; e--) if (typeof t[e] < "u") return t[e];
	throw new Error("Locale data API: locale data undefined");
}
function vr(t) {
	let [n, e] = t.split(":");
	return { hours: +n, minutes: +e };
}
var zs =
		/^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,
	en = {},
	Vs =
		/((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
function io(t, n, e, r) {
	let i = Js(t);
	n = pe(e, n) || n;
	let s = [],
		a;
	for (; n; )
		if (((a = Vs.exec(n)), a)) {
			s = s.concat(a.slice(1));
			let l = s.pop();
			if (!l) break;
			n = l;
		} else {
			s.push(n);
			break;
		}
	let u = i.getTimezoneOffset();
	r && ((u = so(r, u)), (i = Xs(i, r)));
	let c = "";
	return (
		s.forEach((l) => {
			let m = Ys(l);
			c += m
				? m(i, e, u)
				: l === "''"
					? "'"
					: l.replace(/(^'|'$)/g, "").replace(/''/g, "'");
		}),
		c
	);
}
function sn(t, n, e) {
	let r = new Date(0);
	return (r.setFullYear(t, n, e), r.setHours(0, 0, 0), r);
}
function pe(t, n) {
	let e = Ki(t);
	if (((en[e] ??= {}), en[e][n])) return en[e][n];
	let r = "";
	switch (n) {
		case "shortDate":
			r = gt(t, j.Short);
			break;
		case "mediumDate":
			r = gt(t, j.Medium);
			break;
		case "longDate":
			r = gt(t, j.Long);
			break;
		case "fullDate":
			r = gt(t, j.Full);
			break;
		case "shortTime":
			r = mt(t, j.Short);
			break;
		case "mediumTime":
			r = mt(t, j.Medium);
			break;
		case "longTime":
			r = mt(t, j.Long);
			break;
		case "fullTime":
			r = mt(t, j.Full);
			break;
		case "short":
			let i = pe(t, "shortTime"),
				o = pe(t, "shortDate");
			r = tn(vt(t, j.Short), [i, o]);
			break;
		case "medium":
			let s = pe(t, "mediumTime"),
				a = pe(t, "mediumDate");
			r = tn(vt(t, j.Medium), [s, a]);
			break;
		case "long":
			let u = pe(t, "longTime"),
				c = pe(t, "longDate");
			r = tn(vt(t, j.Long), [u, c]);
			break;
		case "full":
			let l = pe(t, "fullTime"),
				m = pe(t, "fullDate");
			r = tn(vt(t, j.Full), [l, m]);
			break;
	}
	return (r && (en[e][n] = r), r);
}
function tn(t, n) {
	return (
		n &&
			(t = t.replace(/\{([^}]+)}/g, function (e, r) {
				return n != null && r in n ? n[r] : e;
			})),
		t
	);
}
function Q(t, n, e = "-", r, i) {
	let o = "";
	(t < 0 || (i && t <= 0)) && (i ? (t = -t + 1) : ((t = -t), (o = e)));
	let s = String(t);
	for (; s.length < n; ) s = "0" + s;
	return (r && (s = s.slice(s.length - n)), o + s);
}
function Hs(t, n) {
	return Q(t, 3).substring(0, n);
}
function O(t, n, e = 0, r = !1, i = !1) {
	return function (o, s) {
		let a = Gs(t, o);
		if (((e > 0 || a > -e) && (a += e), t === 3))
			a === 0 && e === -12 && (a = 12);
		else if (t === 6) return Hs(a, n);
		let u = Dt(s, ge.MinusSign);
		return Q(a, n, u, r, i);
	};
}
function Gs(t, n) {
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
function T(t, n, e = x.Format, r = !1) {
	return function (i, o) {
		return qs(i, o, t, n, e, r);
	};
}
function qs(t, n, e, r, i, o) {
	switch (e) {
		case 2:
			return Qi(n, i, r)[t.getMonth()];
		case 1:
			return Ji(n, i, r)[t.getDay()];
		case 0:
			let s = t.getHours(),
				a = t.getMinutes();
			if (o) {
				let c = no(n),
					l = ro(n, i, r),
					m = c.findIndex((y) => {
						if (Array.isArray(y)) {
							let [b, _] = y,
								w = s >= b.hours && a >= b.minutes,
								C = s < _.hours || (s === _.hours && a < _.minutes);
							if (b.hours < _.hours) {
								if (w && C) return !0;
							} else if (w || C) return !0;
						} else if (y.hours === s && y.minutes === a) return !0;
						return !1;
					});
				if (m !== -1) return l[m];
			}
			return Xi(n, i, r)[s < 12 ? 0 : 1];
		case 3:
			return eo(n, r)[t.getFullYear() <= 0 ? 0 : 1];
		default:
			let u = e;
			throw new Error(`unexpected translation type ${u}`);
	}
}
function nn(t) {
	return function (n, e, r) {
		let i = -1 * r,
			o = Dt(e, ge.MinusSign),
			s = i > 0 ? Math.floor(i / 60) : Math.ceil(i / 60);
		switch (t) {
			case 0:
				return (i >= 0 ? "+" : "") + Q(s, 2, o) + Q(Math.abs(i % 60), 2, o);
			case 1:
				return "GMT" + (i >= 0 ? "+" : "") + Q(s, 1, o);
			case 2:
				return (
					"GMT" +
					(i >= 0 ? "+" : "") +
					Q(s, 2, o) +
					":" +
					Q(Math.abs(i % 60), 2, o)
				);
			case 3:
				return r === 0
					? "Z"
					: (i >= 0 ? "+" : "") + Q(s, 2, o) + ":" + Q(Math.abs(i % 60), 2, o);
			default:
				throw new Error(`Unknown zone width "${t}"`);
		}
	};
}
var Ws = 0,
	on = 4;
function Zs(t) {
	let n = sn(t, Ws, 1).getDay();
	return sn(t, 0, 1 + (n <= on ? on : on + 7) - n);
}
function oo(t) {
	let n = t.getDay(),
		e = n === 0 ? -3 : on - n;
	return sn(t.getFullYear(), t.getMonth(), t.getDate() + e);
}
function Dr(t, n = !1) {
	return function (e, r) {
		let i;
		if (n) {
			let o = new Date(e.getFullYear(), e.getMonth(), 1).getDay() - 1,
				s = e.getDate();
			i = 1 + Math.floor((s + o) / 7);
		} else {
			let o = oo(e),
				s = Zs(o.getFullYear()),
				a = o.getTime() - s.getTime();
			i = 1 + Math.round(a / 6048e5);
		}
		return Q(i, t, Dt(r, ge.MinusSign));
	};
}
function rn(t, n = !1) {
	return function (e, r) {
		let o = oo(e).getFullYear();
		return Q(o, t, Dt(r, ge.MinusSign), n);
	};
}
var yr = {};
function Ys(t) {
	if (yr[t]) return yr[t];
	let n;
	switch (t) {
		case "G":
		case "GG":
		case "GGG":
			n = T(3, A.Abbreviated);
			break;
		case "GGGG":
			n = T(3, A.Wide);
			break;
		case "GGGGG":
			n = T(3, A.Narrow);
			break;
		case "y":
			n = O(0, 1, 0, !1, !0);
			break;
		case "yy":
			n = O(0, 2, 0, !0, !0);
			break;
		case "yyy":
			n = O(0, 3, 0, !1, !0);
			break;
		case "yyyy":
			n = O(0, 4, 0, !1, !0);
			break;
		case "Y":
			n = rn(1);
			break;
		case "YY":
			n = rn(2, !0);
			break;
		case "YYY":
			n = rn(3);
			break;
		case "YYYY":
			n = rn(4);
			break;
		case "M":
		case "L":
			n = O(1, 1, 1);
			break;
		case "MM":
		case "LL":
			n = O(1, 2, 1);
			break;
		case "MMM":
			n = T(2, A.Abbreviated);
			break;
		case "MMMM":
			n = T(2, A.Wide);
			break;
		case "MMMMM":
			n = T(2, A.Narrow);
			break;
		case "LLL":
			n = T(2, A.Abbreviated, x.Standalone);
			break;
		case "LLLL":
			n = T(2, A.Wide, x.Standalone);
			break;
		case "LLLLL":
			n = T(2, A.Narrow, x.Standalone);
			break;
		case "w":
			n = Dr(1);
			break;
		case "ww":
			n = Dr(2);
			break;
		case "W":
			n = Dr(1, !0);
			break;
		case "d":
			n = O(2, 1);
			break;
		case "dd":
			n = O(2, 2);
			break;
		case "c":
		case "cc":
			n = O(7, 1);
			break;
		case "ccc":
			n = T(1, A.Abbreviated, x.Standalone);
			break;
		case "cccc":
			n = T(1, A.Wide, x.Standalone);
			break;
		case "ccccc":
			n = T(1, A.Narrow, x.Standalone);
			break;
		case "cccccc":
			n = T(1, A.Short, x.Standalone);
			break;
		case "E":
		case "EE":
		case "EEE":
			n = T(1, A.Abbreviated);
			break;
		case "EEEE":
			n = T(1, A.Wide);
			break;
		case "EEEEE":
			n = T(1, A.Narrow);
			break;
		case "EEEEEE":
			n = T(1, A.Short);
			break;
		case "a":
		case "aa":
		case "aaa":
			n = T(0, A.Abbreviated);
			break;
		case "aaaa":
			n = T(0, A.Wide);
			break;
		case "aaaaa":
			n = T(0, A.Narrow);
			break;
		case "b":
		case "bb":
		case "bbb":
			n = T(0, A.Abbreviated, x.Standalone, !0);
			break;
		case "bbbb":
			n = T(0, A.Wide, x.Standalone, !0);
			break;
		case "bbbbb":
			n = T(0, A.Narrow, x.Standalone, !0);
			break;
		case "B":
		case "BB":
		case "BBB":
			n = T(0, A.Abbreviated, x.Format, !0);
			break;
		case "BBBB":
			n = T(0, A.Wide, x.Format, !0);
			break;
		case "BBBBB":
			n = T(0, A.Narrow, x.Format, !0);
			break;
		case "h":
			n = O(3, 1, -12);
			break;
		case "hh":
			n = O(3, 2, -12);
			break;
		case "H":
			n = O(3, 1);
			break;
		case "HH":
			n = O(3, 2);
			break;
		case "m":
			n = O(4, 1);
			break;
		case "mm":
			n = O(4, 2);
			break;
		case "s":
			n = O(5, 1);
			break;
		case "ss":
			n = O(5, 2);
			break;
		case "S":
			n = O(6, 1);
			break;
		case "SS":
			n = O(6, 2);
			break;
		case "SSS":
			n = O(6, 3);
			break;
		case "Z":
		case "ZZ":
		case "ZZZ":
			n = nn(0);
			break;
		case "ZZZZZ":
			n = nn(3);
			break;
		case "O":
		case "OO":
		case "OOO":
		case "z":
		case "zz":
		case "zzz":
			n = nn(1);
			break;
		case "OOOO":
		case "ZZZZ":
		case "zzzz":
			n = nn(2);
			break;
		default:
			return null;
	}
	return ((yr[t] = n), n);
}
function so(t, n) {
	t = t.replace(/:/g, "");
	let e = Date.parse("Jan 01, 1970 00:00:00 " + t) / 6e4;
	return isNaN(e) ? n : e;
}
function Ks(t, n) {
	return ((t = new Date(t.getTime())), t.setMinutes(t.getMinutes() + n), t);
}
function Xs(t, n, e) {
	let i = t.getTimezoneOffset(),
		o = so(n, i);
	return Ks(t, -1 * (o - i));
}
function Js(t) {
	if (qi(t)) return t;
	if (typeof t == "number" && !isNaN(t)) return new Date(t);
	if (typeof t == "string") {
		if (((t = t.trim()), /^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(t))) {
			let [i, o = 1, s = 1] = t.split("-").map((a) => +a);
			return sn(i, o - 1, s);
		}
		let e = parseFloat(t);
		if (!isNaN(t - e)) return new Date(e);
		let r;
		if ((r = t.match(zs))) return Qs(r);
	}
	let n = new Date(t);
	if (!qi(n)) throw new Error(`Unable to convert "${t}" into a date`);
	return n;
}
function Qs(t) {
	let n = new Date(0),
		e = 0,
		r = 0,
		i = t[8] ? n.setUTCFullYear : n.setFullYear,
		o = t[8] ? n.setUTCHours : n.setHours;
	(t[9] && ((e = Number(t[9] + t[10])), (r = Number(t[9] + t[11]))),
		i.call(n, Number(t[1]), Number(t[2]) - 1, Number(t[3])));
	let s = Number(t[4] || 0) - e,
		a = Number(t[5] || 0) - r,
		u = Number(t[6] || 0),
		c = Math.floor(parseFloat("0." + (t[7] || 0)) * 1e3);
	return (o.call(n, s, a, u, c), n);
}
function qi(t) {
	return t instanceof Date && !isNaN(t.valueOf());
}
var wr = /\s+/,
	Wi = [],
	ea = (() => {
		class t {
			_ngEl;
			_renderer;
			initialClasses = Wi;
			rawClass;
			stateMap = new Map();
			constructor(e, r) {
				((this._ngEl = e), (this._renderer = r));
			}
			set klass(e) {
				this.initialClasses = e != null ? e.trim().split(wr) : Wi;
			}
			set ngClass(e) {
				this.rawClass = typeof e == "string" ? e.trim().split(wr) : e;
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
						e.split(wr).forEach((i) => {
							r
								? this._renderer.addClass(this._ngEl.nativeElement, i)
								: this._renderer.removeClass(this._ngEl.nativeElement, i);
						}));
			}
			static ɵfac = function (r) {
				return new (r || t)(I(He), I(qe));
			};
			static ɵdir = re({
				type: t,
				selectors: [["", "ngClass", ""]],
				inputs: { klass: [0, "class", "klass"], ngClass: "ngClass" },
			});
		}
		return t;
	})();
var an = class {
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
	ao = (() => {
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
				e.forEachOperation((i, o, s) => {
					if (i.previousIndex == null)
						r.createEmbeddedView(
							this._template,
							new an(i.item, this._ngForOf, -1, -1),
							s === null ? void 0 : s,
						);
					else if (s == null) r.remove(o === null ? void 0 : o);
					else if (o !== null) {
						let a = r.get(o);
						(r.move(a, s), Zi(a, i));
					}
				});
				for (let i = 0, o = r.length; i < o; i++) {
					let a = r.get(i).context;
					((a.index = i), (a.count = o), (a.ngForOf = this._ngForOf));
				}
				e.forEachIdentityChange((i) => {
					let o = r.get(i.currentIndex);
					Zi(o, i);
				});
			}
			static ngTemplateContextGuard(e, r) {
				return !0;
			}
			static ɵfac = function (r) {
				return new (r || t)(I(We), I(lr), I(Ui));
			};
			static ɵdir = re({
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
function Zi(t, n) {
	t.context.$implicit = n.item;
}
var ta = (() => {
		class t {
			_viewContainer;
			_context = new un();
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
				(Yi(e, !1),
					(this._thenTemplateRef = e),
					(this._thenViewRef = null),
					this._updateView());
			}
			set ngIfElse(e) {
				(Yi(e, !1),
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
				return new (r || t)(I(We), I(lr));
			};
			static ɵdir = re({
				type: t,
				selectors: [["", "ngIf", ""]],
				inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" },
			});
		}
		return t;
	})(),
	un = class {
		$implicit = null;
		ngIf = null;
	};
function Yi(t, n) {
	if (t && !t.createEmbeddedView) throw new E(2020, !1);
}
var na = (() => {
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
				let [i, o] = e.split("."),
					s = i.indexOf("-") === -1 ? void 0 : _e.DashCase;
				r != null
					? this._renderer.setStyle(
							this._ngEl.nativeElement,
							i,
							o ? `${r}${o}` : r,
							s,
						)
					: this._renderer.removeStyle(this._ngEl.nativeElement, i, s);
			}
			_applyChanges(e) {
				(e.forEachRemovedItem((r) => this._setStyle(r.key, null)),
					e.forEachAddedItem((r) => this._setStyle(r.key, r.currentValue)),
					e.forEachChangedItem((r) => this._setStyle(r.key, r.currentValue)));
			}
			static ɵfac = function (r) {
				return new (r || t)(I(He), I(Bi), I(qe));
			};
			static ɵdir = re({
				type: t,
				selectors: [["", "ngStyle", ""]],
				inputs: { ngStyle: "ngStyle" },
			});
		}
		return t;
	})(),
	ra = (() => {
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
				return new (r || t)(I(We));
			};
			static ɵdir = re({
				type: t,
				selectors: [["", "ngTemplateOutlet", ""]],
				inputs: {
					ngTemplateOutletContext: "ngTemplateOutletContext",
					ngTemplateOutlet: "ngTemplateOutlet",
					ngTemplateOutletInjector: "ngTemplateOutletInjector",
				},
				features: [ze],
			});
		}
		return t;
	})();
function uo(t, n) {
	return new E(2100, !1);
}
var ia =
		/(?:[0-9A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])\S*/g,
	oa = (() => {
		class t {
			transform(e) {
				if (e == null) return null;
				if (typeof e != "string") throw uo(t, e);
				return e.replace(
					ia,
					(r) => r[0].toUpperCase() + r.slice(1).toLowerCase(),
				);
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵpipe = dr({ name: "titlecase", type: t, pure: !0 });
		}
		return t;
	})();
var sa = "mediumDate",
	co = new D(""),
	lo = new D(""),
	aa = (() => {
		class t {
			locale;
			defaultTimezone;
			defaultOptions;
			constructor(e, r, i) {
				((this.locale = e),
					(this.defaultTimezone = r),
					(this.defaultOptions = i));
			}
			transform(e, r, i, o) {
				if (e == null || e === "" || e !== e) return null;
				try {
					let s = r ?? this.defaultOptions?.dateFormat ?? sa,
						a =
							i ??
							this.defaultOptions?.timezone ??
							this.defaultTimezone ??
							void 0;
					return io(e, s, o || this.locale, a);
				} catch (s) {
					throw uo(t, s.message);
				}
			}
			static ɵfac = function (r) {
				return new (r || t)(I(xi, 16), I(co, 24), I(lo, 24));
			};
			static ɵpipe = dr({ name: "date", type: t, pure: !0 });
		}
		return t;
	})();
var ho = (() => {
	class t {
		static ɵfac = function (r) {
			return new (r || t)();
		};
		static ɵmod = Ie({ type: t });
		static ɵinj = Te({});
	}
	return t;
})();
function yt(t, n) {
	n = encodeURIComponent(n);
	for (let e of t.split(";")) {
		let r = e.indexOf("="),
			[i, o] = r == -1 ? [e, ""] : [e.slice(0, r), e.slice(r + 1)];
		if (i.trim() === n) return decodeURIComponent(o);
	}
	return null;
}
var cn = "browser",
	fo = "server";
function ua(t) {
	return t === cn;
}
function ln(t) {
	return t === fo;
}
var Fe = class {};
var po = (() => {
		class t {
			static ɵprov = g({
				token: t,
				providedIn: "root",
				factory: () => new Er(d(F), window),
			});
		}
		return t;
	})(),
	Er = class {
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
			let e = la(this.document, n);
			e && (this.scrollToElement(e), e.focus());
		}
		setHistoryScrollRestoration(n) {
			this.window.history.scrollRestoration = n;
		}
		scrollToElement(n) {
			let e = n.getBoundingClientRect(),
				r = e.left + this.window.pageXOffset,
				i = e.top + this.window.pageYOffset,
				o = this.offset();
			this.window.scrollTo(r - o[0], i - o[1]);
		}
	};
function la(t, n) {
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
			let o = i.shadowRoot;
			if (o) {
				let s = o.getElementById(n) || o.querySelector(`[name="${n}"]`);
				if (s) return s;
			}
			i = r.nextNode();
		}
	}
	return null;
}
var fn = new D(""),
	Ar = (() => {
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
			addEventListener(e, r, i, o) {
				return this._findPluginFor(r).addEventListener(e, r, i, o);
			}
			getZone() {
				return this._zone;
			}
			_findPluginFor(e) {
				let r = this._eventNameToPlugin.get(e);
				if (r) return r;
				if (((r = this._plugins.find((o) => o.supports(e))), !r))
					throw new E(5101, !1);
				return (this._eventNameToPlugin.set(e, r), r);
			}
			static ɵfac = function (r) {
				return new (r || t)(p(fn), p(he));
			};
			static ɵprov = g({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	wt = class {
		_doc;
		constructor(n) {
			this._doc = n;
		}
		manager;
	},
	dn = "ng-app-id";
function go(t) {
	for (let n of t) n.remove();
}
function mo(t, n) {
	let e = n.createElement("style");
	return ((e.textContent = t), e);
}
function ha(t, n, e, r) {
	let i = t.head?.querySelectorAll(`style[${dn}="${n}"],link[${dn}="${n}"]`);
	if (i)
		for (let o of i)
			(o.removeAttribute(dn),
				o instanceof HTMLLinkElement
					? r.set(o.href.slice(o.href.lastIndexOf("/") + 1), {
							usage: 0,
							elements: [o],
						})
					: o.textContent && e.set(o.textContent, { usage: 0, elements: [o] }));
}
function Rr(t, n) {
	let e = n.createElement("link");
	return (e.setAttribute("rel", "stylesheet"), e.setAttribute("href", t), e);
}
var Tr = (() => {
		class t {
			doc;
			appId;
			nonce;
			inline = new Map();
			external = new Map();
			hosts = new Set();
			isServer;
			constructor(e, r, i, o = {}) {
				((this.doc = e),
					(this.appId = r),
					(this.nonce = i),
					(this.isServer = ln(o)),
					ha(e, r, this.inline, this.external),
					this.hosts.add(e.head));
			}
			addStyles(e, r) {
				for (let i of e) this.addUsage(i, this.inline, mo);
				r?.forEach((i) => this.addUsage(i, this.external, Rr));
			}
			removeStyles(e, r) {
				for (let i of e) this.removeUsage(i, this.inline);
				r?.forEach((i) => this.removeUsage(i, this.external));
			}
			addUsage(e, r, i) {
				let o = r.get(e);
				o
					? o.usage++
					: r.set(e, {
							usage: 1,
							elements: [...this.hosts].map((s) =>
								this.addElement(s, i(e, this.doc)),
							),
						});
			}
			removeUsage(e, r) {
				let i = r.get(e);
				i && (i.usage--, i.usage <= 0 && (go(i.elements), r.delete(e)));
			}
			ngOnDestroy() {
				for (let [, { elements: e }] of [...this.inline, ...this.external])
					go(e);
				this.hosts.clear();
			}
			addHost(e) {
				this.hosts.add(e);
				for (let [r, { elements: i }] of this.inline)
					i.push(this.addElement(e, mo(r, this.doc)));
				for (let [r, { elements: i }] of this.external)
					i.push(this.addElement(e, Rr(r, this.doc)));
			}
			removeHost(e) {
				this.hosts.delete(e);
			}
			addElement(e, r) {
				return (
					this.nonce && r.setAttribute("nonce", this.nonce),
					this.isServer && r.setAttribute(dn, this.appId),
					e.appendChild(r)
				);
			}
			static ɵfac = function (r) {
				return new (r || t)(p(F), p(ar), p(ur, 8), p(Ge));
			};
			static ɵprov = g({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	Sr = {
		svg: "http://www.w3.org/2000/svg",
		xhtml: "http://www.w3.org/1999/xhtml",
		xlink: "http://www.w3.org/1999/xlink",
		xml: "http://www.w3.org/XML/1998/namespace",
		xmlns: "http://www.w3.org/2000/xmlns/",
		math: "http://www.w3.org/1998/Math/MathML",
	},
	_r = /%COMP%/g;
var Do = "%COMP%",
	fa = `_nghost-${Do}`,
	pa = `_ngcontent-${Do}`,
	ga = !0,
	ma = new D("", { providedIn: "root", factory: () => ga });
function va(t) {
	return pa.replace(_r, t);
}
function Da(t) {
	return fa.replace(_r, t);
}
function yo(t, n) {
	return n.map((e) => e.replace(_r, t));
}
var Ir = (() => {
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
			constructor(e, r, i, o, s, a, u, c = null, l = null) {
				((this.eventManager = e),
					(this.sharedStylesHost = r),
					(this.appId = i),
					(this.removeStylesOnCompDestroy = o),
					(this.doc = s),
					(this.platformId = a),
					(this.ngZone = u),
					(this.nonce = c),
					(this.tracingService = l),
					(this.platformIsServer = ln(a)),
					(this.defaultRenderer = new Ct(
						e,
						s,
						u,
						this.platformIsServer,
						this.tracingService,
					)));
			}
			createRenderer(e, r) {
				if (!e || !r) return this.defaultRenderer;
				this.platformIsServer &&
					r.encapsulation === lt.ShadowDom &&
					(r = U(h({}, r), { encapsulation: lt.Emulated }));
				let i = this.getOrCreateRenderer(e, r);
				return (
					i instanceof hn
						? i.applyToHost(e)
						: i instanceof Et && i.applyStyles(),
					i
				);
			}
			getOrCreateRenderer(e, r) {
				let i = this.rendererByCompId,
					o = i.get(r.id);
				if (!o) {
					let s = this.doc,
						a = this.ngZone,
						u = this.eventManager,
						c = this.sharedStylesHost,
						l = this.removeStylesOnCompDestroy,
						m = this.platformIsServer,
						y = this.tracingService;
					switch (r.encapsulation) {
						case lt.Emulated:
							o = new hn(u, c, r, this.appId, l, s, a, m, y);
							break;
						case lt.ShadowDom:
							return new br(u, c, e, r, s, a, this.nonce, m, y);
						default:
							o = new Et(u, c, r, l, s, a, m, y);
							break;
					}
					i.set(r.id, o);
				}
				return o;
			}
			ngOnDestroy() {
				this.rendererByCompId.clear();
			}
			componentReplaced(e) {
				this.rendererByCompId.delete(e);
			}
			static ɵfac = function (r) {
				return new (r || t)(
					p(Ar),
					p(Tr),
					p(ar),
					p(ma),
					p(F),
					p(Ge),
					p(he),
					p(ur),
					p(Ri, 8),
				);
			};
			static ɵprov = g({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	Ct = class {
		eventManager;
		doc;
		ngZone;
		platformIsServer;
		tracingService;
		data = Object.create(null);
		throwOnSyntheticProps = !0;
		constructor(n, e, r, i, o) {
			((this.eventManager = n),
				(this.doc = e),
				(this.ngZone = r),
				(this.platformIsServer = i),
				(this.tracingService = o));
		}
		destroy() {}
		destroyNode = null;
		createElement(n, e) {
			return e
				? this.doc.createElementNS(Sr[e] || e, n)
				: this.doc.createElement(n);
		}
		createComment(n) {
			return this.doc.createComment(n);
		}
		createText(n) {
			return this.doc.createTextNode(n);
		}
		appendChild(n, e) {
			(vo(n) ? n.content : n).appendChild(e);
		}
		insertBefore(n, e, r) {
			n && (vo(n) ? n.content : n).insertBefore(e, r);
		}
		removeChild(n, e) {
			e.remove();
		}
		selectRootElement(n, e) {
			let r = typeof n == "string" ? this.doc.querySelector(n) : n;
			if (!r) throw new E(-5104, !1);
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
				let o = Sr[i];
				o ? n.setAttributeNS(o, e, r) : n.setAttribute(e, r);
			} else n.setAttribute(e, r);
		}
		removeAttribute(n, e, r) {
			if (r) {
				let i = Sr[r];
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
			i & (_e.DashCase | _e.Important)
				? n.style.setProperty(e, r, i & _e.Important ? "important" : "")
				: (n.style[e] = r);
		}
		removeStyle(n, e, r) {
			r & _e.DashCase ? n.style.removeProperty(e) : (n.style[e] = "");
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
				((n = fe().getGlobalEventTarget(this.doc, n)), !n)
			)
				throw new E(5102, !1);
			let o = this.decoratePreventDefault(r);
			return (
				this.tracingService?.wrapEventListener &&
					(o = this.tracingService.wrapEventListener(n, e, o)),
				this.eventManager.addEventListener(n, e, o, i)
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
function vo(t) {
	return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var br = class extends Ct {
		sharedStylesHost;
		hostEl;
		shadowRoot;
		constructor(n, e, r, i, o, s, a, u, c) {
			(super(n, o, s, u, c),
				(this.sharedStylesHost = e),
				(this.hostEl = r),
				(this.shadowRoot = r.attachShadow({ mode: "open" })),
				this.sharedStylesHost.addHost(this.shadowRoot));
			let l = i.styles;
			l = yo(i.id, l);
			for (let y of l) {
				let b = document.createElement("style");
				(a && b.setAttribute("nonce", a),
					(b.textContent = y),
					this.shadowRoot.appendChild(b));
			}
			let m = i.getExternalStyles?.();
			if (m)
				for (let y of m) {
					let b = Rr(y, o);
					(a && b.setAttribute("nonce", a), this.shadowRoot.appendChild(b));
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
	Et = class extends Ct {
		sharedStylesHost;
		removeStylesOnCompDestroy;
		styles;
		styleUrls;
		constructor(n, e, r, i, o, s, a, u, c) {
			(super(n, o, s, a, u),
				(this.sharedStylesHost = e),
				(this.removeStylesOnCompDestroy = i));
			let l = r.styles;
			((this.styles = c ? yo(c, l) : l),
				(this.styleUrls = r.getExternalStyles?.(c)));
		}
		applyStyles() {
			this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
		}
		destroy() {
			this.removeStylesOnCompDestroy &&
				this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
		}
	},
	hn = class extends Et {
		contentAttr;
		hostAttr;
		constructor(n, e, r, i, o, s, a, u, c) {
			let l = i + "-" + r.id;
			(super(n, e, r, o, s, a, u, c, l),
				(this.contentAttr = va(l)),
				(this.hostAttr = Da(l)));
		}
		applyToHost(n) {
			(this.applyStyles(), this.setAttribute(n, this.hostAttr, ""));
		}
		createElement(n, e) {
			let r = super.createElement(n, e);
			return (super.setAttribute(r, this.contentAttr, ""), r);
		}
	};
var pn = class t extends ft {
		supportsDOMEvents = !0;
		static makeCurrent() {
			gr(new t());
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
			let e = ya();
			return e == null ? null : wa(e);
		}
		resetBaseElement() {
			St = null;
		}
		getUserAgent() {
			return window.navigator.userAgent;
		}
		getCookie(n) {
			return yt(document.cookie, n);
		}
	},
	St = null;
function ya() {
	return (
		(St = St || document.head.querySelector("base")),
		St ? St.getAttribute("href") : null
	);
}
function wa(t) {
	return new URL(t, document.baseURI).pathname;
}
var Ca = (() => {
		class t {
			build() {
				return new XMLHttpRequest();
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = g({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	Co = (() => {
		class t extends wt {
			constructor(e) {
				super(e);
			}
			supports(e) {
				return !0;
			}
			addEventListener(e, r, i, o) {
				return (
					e.addEventListener(r, i, o),
					() => this.removeEventListener(e, r, i, o)
				);
			}
			removeEventListener(e, r, i, o) {
				return e.removeEventListener(r, i, o);
			}
			static ɵfac = function (r) {
				return new (r || t)(p(F));
			};
			static ɵprov = g({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	wo = ["alt", "control", "meta", "shift"],
	Ea = {
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
	Sa = {
		alt: (t) => t.altKey,
		control: (t) => t.ctrlKey,
		meta: (t) => t.metaKey,
		shift: (t) => t.shiftKey,
	},
	Eo = (() => {
		class t extends wt {
			constructor(e) {
				super(e);
			}
			supports(e) {
				return t.parseEventName(e) != null;
			}
			addEventListener(e, r, i, o) {
				let s = t.parseEventName(r),
					a = t.eventCallback(s.fullKey, i, this.manager.getZone());
				return this.manager
					.getZone()
					.runOutsideAngular(() => fe().onAndCancel(e, s.domEventName, a, o));
			}
			static parseEventName(e) {
				let r = e.toLowerCase().split("."),
					i = r.shift();
				if (r.length === 0 || !(i === "keydown" || i === "keyup")) return null;
				let o = t._normalizeKey(r.pop()),
					s = "",
					a = r.indexOf("code");
				if (
					(a > -1 && (r.splice(a, 1), (s = "code.")),
					wo.forEach((c) => {
						let l = r.indexOf(c);
						l > -1 && (r.splice(l, 1), (s += c + "."));
					}),
					(s += o),
					r.length != 0 || o.length === 0)
				)
					return null;
				let u = {};
				return ((u.domEventName = i), (u.fullKey = s), u);
			}
			static matchEventFullKeyCode(e, r) {
				let i = Ea[e.key] || e.key,
					o = "";
				return (
					r.indexOf("code.") > -1 && ((i = e.code), (o = "code.")),
					i == null || !i
						? !1
						: ((i = i.toLowerCase()),
							i === " " ? (i = "space") : i === "." && (i = "dot"),
							wo.forEach((s) => {
								if (s !== i) {
									let a = Sa[s];
									a(e) && (o += s + ".");
								}
							}),
							(o += i),
							o === r)
				);
			}
			static eventCallback(e, r, i) {
				return (o) => {
					t.matchEventFullKeyCode(o, e) && i.runGuarded(() => r(o));
				};
			}
			static _normalizeKey(e) {
				return e === "esc" ? "escape" : e;
			}
			static ɵfac = function (r) {
				return new (r || t)(p(F));
			};
			static ɵprov = g({ token: t, factory: t.ɵfac });
		}
		return t;
	})();
function Ra(t, n, e) {
	return ji(h({ rootComponent: t, platformRef: e?.platformRef }, ba(n)));
}
function ba(t) {
	return {
		appProviders: [...Ma, ...(t?.providers ?? [])],
		platformProviders: Ia,
	};
}
function Aa() {
	pn.makeCurrent();
}
function Ta() {
	return new sr();
}
function _a() {
	return (Ei(document), document);
}
var Ia = [
	{ provide: Ge, useValue: cn },
	{ provide: Si, useValue: Aa, multi: !0 },
	{ provide: F, useFactory: _a },
];
var Ma = [
	{ provide: wi, useValue: "root" },
	{ provide: sr, useFactory: Ta },
	{ provide: fn, useClass: Co, multi: !0, deps: [F] },
	{ provide: fn, useClass: Eo, multi: !0, deps: [F] },
	Ir,
	Tr,
	Ar,
	{ provide: Ti, useExisting: Ir },
	{ provide: Fe, useClass: Ca },
	[],
];
var Ye = class {},
	Rt = class {},
	we = class t {
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
												o = e.slice(r + 1).trim();
											this.addHeaderEntry(i, o);
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
					let o = n.value;
					if (!o) (this.headers.delete(e), this.normalizedNames.delete(e));
					else {
						let s = this.headers.get(e);
						if (!s) return;
						((s = s.filter((a) => o.indexOf(a) === -1)),
							s.length === 0
								? (this.headers.delete(e), this.normalizedNames.delete(e))
								: this.headers.set(e, s));
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
			let r = (Array.isArray(e) ? e : [e]).map((o) => o.toString()),
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
var mn = class {
	encodeKey(n) {
		return So(n);
	}
	encodeValue(n) {
		return So(n);
	}
	decodeKey(n) {
		return decodeURIComponent(n);
	}
	decodeValue(n) {
		return decodeURIComponent(n);
	}
};
function Fa(t, n) {
	let e = new Map();
	return (
		t.length > 0 &&
			t
				.replace(/^\?/, "")
				.split("&")
				.forEach((i) => {
					let o = i.indexOf("="),
						[s, a] =
							o == -1
								? [n.decodeKey(i), ""]
								: [n.decodeKey(i.slice(0, o)), n.decodeValue(i.slice(o + 1))],
						u = e.get(s) || [];
					(u.push(a), e.set(s, u));
				}),
		e
	);
}
var Oa = /%(\d[a-f0-9])/gi,
	Pa = {
		40: "@",
		"3A": ":",
		24: "$",
		"2C": ",",
		"3B": ";",
		"3D": "=",
		"3F": "?",
		"2F": "/",
	};
function So(t) {
	return encodeURIComponent(t).replace(Oa, (n, e) => Pa[e] ?? n);
}
function gn(t) {
	return `${t}`;
}
var me = class t {
	map;
	encoder;
	updates = null;
	cloneFrom = null;
	constructor(n = {}) {
		if (((this.encoder = n.encoder || new mn()), n.fromString)) {
			if (n.fromObject) throw new E(2805, !1);
			this.map = Fa(n.fromString, this.encoder);
		} else
			n.fromObject
				? ((this.map = new Map()),
					Object.keys(n.fromObject).forEach((e) => {
						let r = n.fromObject[e],
							i = Array.isArray(r) ? r.map(gn) : [gn(r)];
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
					? i.forEach((o) => {
							e.push({ param: r, value: o, op: "a" });
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
							(e.push(gn(n.value)), this.map.set(n.param, e));
							break;
						case "d":
							if (n.value !== void 0) {
								let r = this.map.get(n.param) || [],
									i = r.indexOf(gn(n.value));
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
var vn = class {
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
function Na(t) {
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
function Ro(t) {
	return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer;
}
function bo(t) {
	return typeof Blob < "u" && t instanceof Blob;
}
function Ao(t) {
	return typeof FormData < "u" && t instanceof FormData;
}
function La(t) {
	return typeof URLSearchParams < "u" && t instanceof URLSearchParams;
}
var To = "Content-Type",
	_o = "Accept",
	Io = "X-Request-URL",
	Mo = "text/plain",
	Fo = "application/json",
	ka = `${Fo}, ${Mo}, */*`,
	Ze = class t {
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
			let o;
			if (
				(Na(this.method) || i
					? ((this.body = r !== void 0 ? r : null), (o = i))
					: (o = r),
				o &&
					((this.reportProgress = !!o.reportProgress),
					(this.withCredentials = !!o.withCredentials),
					o.responseType && (this.responseType = o.responseType),
					o.headers && (this.headers = o.headers),
					o.context && (this.context = o.context),
					o.params && (this.params = o.params),
					(this.transferCache = o.transferCache)),
				(this.headers ??= new we()),
				(this.context ??= new vn()),
				!this.params)
			)
				((this.params = new me()), (this.urlWithParams = e));
			else {
				let s = this.params.toString();
				if (s.length === 0) this.urlWithParams = e;
				else {
					let a = e.indexOf("?"),
						u = a === -1 ? "?" : a < e.length - 1 ? "&" : "";
					this.urlWithParams = e + u + s;
				}
			}
		}
		serializeBody() {
			return this.body === null
				? null
				: typeof this.body == "string" ||
					  Ro(this.body) ||
					  bo(this.body) ||
					  Ao(this.body) ||
					  La(this.body)
					? this.body
					: this.body instanceof me
						? this.body.toString()
						: typeof this.body == "object" ||
							  typeof this.body == "boolean" ||
							  Array.isArray(this.body)
							? JSON.stringify(this.body)
							: this.body.toString();
		}
		detectContentTypeHeader() {
			return this.body === null || Ao(this.body)
				? null
				: bo(this.body)
					? this.body.type || null
					: Ro(this.body)
						? null
						: typeof this.body == "string"
							? Mo
							: this.body instanceof me
								? "application/x-www-form-urlencoded;charset=UTF-8"
								: typeof this.body == "object" ||
									  typeof this.body == "number" ||
									  typeof this.body == "boolean"
									? Fo
									: null;
		}
		clone(n = {}) {
			let e = n.method || this.method,
				r = n.url || this.url,
				i = n.responseType || this.responseType,
				o = n.transferCache ?? this.transferCache,
				s = n.body !== void 0 ? n.body : this.body,
				a = n.withCredentials ?? this.withCredentials,
				u = n.reportProgress ?? this.reportProgress,
				c = n.headers || this.headers,
				l = n.params || this.params,
				m = n.context ?? this.context;
			return (
				n.setHeaders !== void 0 &&
					(c = Object.keys(n.setHeaders).reduce(
						(y, b) => y.set(b, n.setHeaders[b]),
						c,
					)),
				n.setParams &&
					(l = Object.keys(n.setParams).reduce(
						(y, b) => y.set(b, n.setParams[b]),
						l,
					)),
				new t(e, r, s, {
					params: l,
					headers: c,
					context: m,
					reportProgress: u,
					responseType: i,
					withCredentials: a,
					transferCache: o,
				})
			);
		}
	},
	Oe = (function (t) {
		return (
			(t[(t.Sent = 0)] = "Sent"),
			(t[(t.UploadProgress = 1)] = "UploadProgress"),
			(t[(t.ResponseHeader = 2)] = "ResponseHeader"),
			(t[(t.DownloadProgress = 3)] = "DownloadProgress"),
			(t[(t.Response = 4)] = "Response"),
			(t[(t.User = 5)] = "User"),
			t
		);
	})(Oe || {}),
	Ke = class {
		headers;
		status;
		statusText;
		url;
		ok;
		type;
		constructor(n, e = 200, r = "OK") {
			((this.headers = n.headers || new we()),
				(this.status = n.status !== void 0 ? n.status : e),
				(this.statusText = n.statusText || r),
				(this.url = n.url || null),
				(this.ok = this.status >= 200 && this.status < 300));
		}
	},
	Dn = class t extends Ke {
		constructor(n = {}) {
			super(n);
		}
		type = Oe.ResponseHeader;
		clone(n = {}) {
			return new t({
				headers: n.headers || this.headers,
				status: n.status !== void 0 ? n.status : this.status,
				statusText: n.statusText || this.statusText,
				url: n.url || this.url || void 0,
			});
		}
	},
	bt = class t extends Ke {
		body;
		constructor(n = {}) {
			(super(n), (this.body = n.body !== void 0 ? n.body : null));
		}
		type = Oe.Response;
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
	At = class extends Ke {
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
	xa = 200,
	Ua = 204;
function Mr(t, n) {
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
var Oo = (() => {
	class t {
		handler;
		constructor(e) {
			this.handler = e;
		}
		request(e, r, i = {}) {
			let o;
			if (e instanceof Ze) o = e;
			else {
				let u;
				i.headers instanceof we ? (u = i.headers) : (u = new we(i.headers));
				let c;
				(i.params &&
					(i.params instanceof me
						? (c = i.params)
						: (c = new me({ fromObject: i.params }))),
					(o = new Ze(e, r, i.body !== void 0 ? i.body : null, {
						headers: u,
						context: i.context,
						params: c,
						reportProgress: i.reportProgress,
						responseType: i.responseType || "json",
						withCredentials: i.withCredentials,
						transferCache: i.transferCache,
					})));
			}
			let s = f(o).pipe(de((u) => this.handler.handle(u)));
			if (e instanceof Ze || i.observe === "events") return s;
			let a = s.pipe(ne((u) => u instanceof bt));
			switch (i.observe || "body") {
				case "body":
					switch (o.responseType) {
						case "arraybuffer":
							return a.pipe(
								S((u) => {
									if (u.body !== null && !(u.body instanceof ArrayBuffer))
										throw new E(2806, !1);
									return u.body;
								}),
							);
						case "blob":
							return a.pipe(
								S((u) => {
									if (u.body !== null && !(u.body instanceof Blob))
										throw new E(2807, !1);
									return u.body;
								}),
							);
						case "text":
							return a.pipe(
								S((u) => {
									if (u.body !== null && typeof u.body != "string")
										throw new E(2808, !1);
									return u.body;
								}),
							);
						case "json":
						default:
							return a.pipe(S((u) => u.body));
					}
				case "response":
					return a;
				default:
					throw new E(2809, !1);
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
				params: new me().append(r, "JSONP_CALLBACK"),
				observe: "body",
				responseType: "json",
			});
		}
		options(e, r = {}) {
			return this.request("OPTIONS", e, r);
		}
		patch(e, r, i = {}) {
			return this.request("PATCH", e, Mr(i, r));
		}
		post(e, r, i = {}) {
			return this.request("POST", e, Mr(i, r));
		}
		put(e, r, i = {}) {
			return this.request("PUT", e, Mr(i, r));
		}
		static ɵfac = function (r) {
			return new (r || t)(p(Ye));
		};
		static ɵprov = g({ token: t, factory: t.ɵfac });
	}
	return t;
})();
var Ba = new D("");
function ja(t, n) {
	return n(t);
}
function $a(t, n, e) {
	return (r, i) => q(e, () => n(r, (o) => t(o, i)));
}
var Or = new D(""),
	Po = new D(""),
	No = new D("", { providedIn: "root", factory: () => !0 });
var yn = (() => {
	class t extends Ye {
		backend;
		injector;
		chain = null;
		pendingTasks = d(Yt);
		contributeToStability = d(No);
		constructor(e, r) {
			(super(), (this.backend = e), (this.injector = r));
		}
		handle(e) {
			if (this.chain === null) {
				let r = Array.from(
					new Set([...this.injector.get(Or), ...this.injector.get(Po, [])]),
				);
				this.chain = r.reduceRight((i, o) => $a(i, o, this.injector), ja);
			}
			if (this.contributeToStability) {
				let r = this.pendingTasks.add();
				return this.chain(e, (i) => this.backend.handle(i)).pipe(
					$e(() => this.pendingTasks.remove(r)),
				);
			} else return this.chain(e, (r) => this.backend.handle(r));
		}
		static ɵfac = function (r) {
			return new (r || t)(p(Rt), p(De));
		};
		static ɵprov = g({ token: t, factory: t.ɵfac });
	}
	return t;
})();
var za = /^\)\]\}',?\n/,
	Va = RegExp(`^${Io}:`, "m");
function Ha(t) {
	return "responseURL" in t && t.responseURL
		? t.responseURL
		: Va.test(t.getAllResponseHeaders())
			? t.getResponseHeader(Io)
			: null;
}
var Fr = (() => {
		class t {
			xhrFactory;
			constructor(e) {
				this.xhrFactory = e;
			}
			handle(e) {
				if (e.method === "JSONP") throw new E(-2800, !1);
				let r = this.xhrFactory;
				return (r.ɵloadImpl ? L(r.ɵloadImpl()) : f(null)).pipe(
					z(
						() =>
							new di((o) => {
								let s = r.build();
								if (
									(s.open(e.method, e.urlWithParams),
									e.withCredentials && (s.withCredentials = !0),
									e.headers.forEach((w, C) =>
										s.setRequestHeader(w, C.join(",")),
									),
									e.headers.has(_o) || s.setRequestHeader(_o, ka),
									!e.headers.has(To))
								) {
									let w = e.detectContentTypeHeader();
									w !== null && s.setRequestHeader(To, w);
								}
								if (e.responseType) {
									let w = e.responseType.toLowerCase();
									s.responseType = w !== "json" ? w : "text";
								}
								let a = e.serializeBody(),
									u = null,
									c = () => {
										if (u !== null) return u;
										let w = s.statusText || "OK",
											C = new we(s.getAllResponseHeaders()),
											te = Ha(s) || e.url;
										return (
											(u = new Dn({
												headers: C,
												status: s.status,
												statusText: w,
												url: te,
											})),
											u
										);
									},
									l = () => {
										let {
												headers: w,
												status: C,
												statusText: te,
												url: qt,
											} = c(),
											P = null;
										(C !== Ua &&
											(P =
												typeof s.response > "u" ? s.responseText : s.response),
											C === 0 && (C = P ? xa : 0));
										let Yn = C >= 200 && C < 300;
										if (e.responseType === "json" && typeof P == "string") {
											let xs = P;
											P = P.replace(za, "");
											try {
												P = P !== "" ? JSON.parse(P) : null;
											} catch (Us) {
												((P = xs),
													Yn && ((Yn = !1), (P = { error: Us, text: P })));
											}
										}
										Yn
											? (o.next(
													new bt({
														body: P,
														headers: w,
														status: C,
														statusText: te,
														url: qt || void 0,
													}),
												),
												o.complete())
											: o.error(
													new At({
														error: P,
														headers: w,
														status: C,
														statusText: te,
														url: qt || void 0,
													}),
												);
									},
									m = (w) => {
										let { url: C } = c(),
											te = new At({
												error: w,
												status: s.status || 0,
												statusText: s.statusText || "Unknown Error",
												url: C || void 0,
											});
										o.error(te);
									},
									y = !1,
									b = (w) => {
										y || (o.next(c()), (y = !0));
										let C = { type: Oe.DownloadProgress, loaded: w.loaded };
										(w.lengthComputable && (C.total = w.total),
											e.responseType === "text" &&
												s.responseText &&
												(C.partialText = s.responseText),
											o.next(C));
									},
									_ = (w) => {
										let C = { type: Oe.UploadProgress, loaded: w.loaded };
										(w.lengthComputable && (C.total = w.total), o.next(C));
									};
								return (
									s.addEventListener("load", l),
									s.addEventListener("error", m),
									s.addEventListener("timeout", m),
									s.addEventListener("abort", m),
									e.reportProgress &&
										(s.addEventListener("progress", b),
										a !== null &&
											s.upload &&
											s.upload.addEventListener("progress", _)),
									s.send(a),
									o.next({ type: Oe.Sent }),
									() => {
										(s.removeEventListener("error", m),
											s.removeEventListener("abort", m),
											s.removeEventListener("load", l),
											s.removeEventListener("timeout", m),
											e.reportProgress &&
												(s.removeEventListener("progress", b),
												a !== null &&
													s.upload &&
													s.upload.removeEventListener("progress", _)),
											s.readyState !== s.DONE && s.abort());
									}
								);
							}),
					),
				);
			}
			static ɵfac = function (r) {
				return new (r || t)(p(Fe));
			};
			static ɵprov = g({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	Lo = new D(""),
	Ga = "XSRF-TOKEN",
	qa = new D("", { providedIn: "root", factory: () => Ga }),
	Wa = "X-XSRF-TOKEN",
	Za = new D("", { providedIn: "root", factory: () => Wa }),
	Tt = class {},
	Ya = (() => {
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
						(this.lastToken = yt(e, this.cookieName)),
						(this.lastCookieString = e)),
					this.lastToken
				);
			}
			static ɵfac = function (r) {
				return new (r || t)(p(F), p(qa));
			};
			static ɵprov = g({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	Ka = /^(?:https?:)?\/\//i;
function Xa(t, n) {
	if (!d(Lo) || t.method === "GET" || t.method === "HEAD" || Ka.test(t.url))
		return n(t);
	let e = d(Tt).getToken(),
		r = d(Za);
	return (
		e != null &&
			!t.headers.has(r) &&
			(t = t.clone({ headers: t.headers.set(r, e) })),
		n(t)
	);
}
var Pr = (function (t) {
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
})(Pr || {});
function Ja(t, n) {
	return { ɵkind: t, ɵproviders: n };
}
function Qa(...t) {
	let n = [
		Oo,
		Fr,
		yn,
		{ provide: Ye, useExisting: yn },
		{ provide: Rt, useFactory: () => d(Ba, { optional: !0 }) ?? d(Fr) },
		{ provide: Or, useValue: Xa, multi: !0 },
		{ provide: Lo, useValue: !0 },
		{ provide: Tt, useClass: Ya },
	];
	for (let e of t) n.push(...e.ɵproviders);
	return Zt(n);
}
function eu(t) {
	return Ja(
		Pr.Interceptors,
		t.map((n) => ({ provide: Or, useValue: n, multi: !0 })),
	);
}
var ko = (() => {
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
			return new (r || t)(p(F));
		};
		static ɵprov = g({ token: t, factory: t.ɵfac, providedIn: "root" });
	}
	return t;
})();
var v = "primary",
	jt = Symbol("RouteTitle"),
	Ur = class {
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
function Le(t) {
	return new Ur(t);
}
function Ho(t, n, e) {
	let r = e.path.split("/");
	if (
		r.length > t.length ||
		(e.pathMatch === "full" && (n.hasChildren() || r.length < t.length))
	)
		return null;
	let i = {};
	for (let o = 0; o < r.length; o++) {
		let s = r[o],
			a = t[o];
		if (s[0] === ":") i[s.substring(1)] = a;
		else if (s !== a.path) return null;
	}
	return { consumed: t.slice(0, r.length), posParams: i };
}
function nu(t, n) {
	if (t.length !== n.length) return !1;
	for (let e = 0; e < t.length; ++e) if (!ie(t[e], n[e])) return !1;
	return !0;
}
function ie(t, n) {
	let e = t ? Br(t) : void 0,
		r = n ? Br(n) : void 0;
	if (!e || !r || e.length != r.length) return !1;
	let i;
	for (let o = 0; o < e.length; o++)
		if (((i = e[o]), !Go(t[i], n[i]))) return !1;
	return !0;
}
function Br(t) {
	return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function Go(t, n) {
	if (Array.isArray(t) && Array.isArray(n)) {
		if (t.length !== n.length) return !1;
		let e = [...t].sort(),
			r = [...n].sort();
		return e.every((i, o) => r[o] === i);
	} else return t === n;
}
function qo(t) {
	return t.length > 0 ? t[t.length - 1] : null;
}
function be(t) {
	return hi(t) ? t : hr(t) ? L(Promise.resolve(t)) : f(t);
}
var ru = { exact: Zo, subset: Yo },
	Wo = { exact: iu, subset: ou, ignored: () => !0 };
function xo(t, n, e) {
	return (
		ru[e.paths](t.root, n.root, e.matrixParams) &&
		Wo[e.queryParams](t.queryParams, n.queryParams) &&
		!(e.fragment === "exact" && t.fragment !== n.fragment)
	);
}
function iu(t, n) {
	return ie(t, n);
}
function Zo(t, n, e) {
	if (
		!Pe(t.segments, n.segments) ||
		!En(t.segments, n.segments, e) ||
		t.numberOfChildren !== n.numberOfChildren
	)
		return !1;
	for (let r in n.children)
		if (!t.children[r] || !Zo(t.children[r], n.children[r], e)) return !1;
	return !0;
}
function ou(t, n) {
	return (
		Object.keys(n).length <= Object.keys(t).length &&
		Object.keys(n).every((e) => Go(t[e], n[e]))
	);
}
function Yo(t, n, e) {
	return Ko(t, n, n.segments, e);
}
function Ko(t, n, e, r) {
	if (t.segments.length > e.length) {
		let i = t.segments.slice(0, e.length);
		return !(!Pe(i, e) || n.hasChildren() || !En(i, e, r));
	} else if (t.segments.length === e.length) {
		if (!Pe(t.segments, e) || !En(t.segments, e, r)) return !1;
		for (let i in n.children)
			if (!t.children[i] || !Yo(t.children[i], n.children[i], r)) return !1;
		return !0;
	} else {
		let i = e.slice(0, t.segments.length),
			o = e.slice(t.segments.length);
		return !Pe(t.segments, i) || !En(t.segments, i, r) || !t.children[v]
			? !1
			: Ko(t.children[v], n, o, r);
	}
}
function En(t, n, e) {
	return n.every((r, i) => Wo[e](t[i].parameters, r.parameters));
}
var se = class {
		root;
		queryParams;
		fragment;
		_queryParamMap;
		constructor(n = new R([], {}), e = {}, r = null) {
			((this.root = n), (this.queryParams = e), (this.fragment = r));
		}
		get queryParamMap() {
			return (
				(this._queryParamMap ??= Le(this.queryParams)),
				this._queryParamMap
			);
		}
		toString() {
			return uu.serialize(this);
		}
	},
	R = class {
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
			return Sn(this);
		}
	},
	Ce = class {
		path;
		parameters;
		_parameterMap;
		constructor(n, e) {
			((this.path = n), (this.parameters = e));
		}
		get parameterMap() {
			return ((this._parameterMap ??= Le(this.parameters)), this._parameterMap);
		}
		toString() {
			return Jo(this);
		}
	};
function su(t, n) {
	return Pe(t, n) && t.every((e, r) => ie(e.parameters, n[r].parameters));
}
function Pe(t, n) {
	return t.length !== n.length ? !1 : t.every((e, r) => e.path === n[r].path);
}
function au(t, n) {
	let e = [];
	return (
		Object.entries(t.children).forEach(([r, i]) => {
			r === v && (e = e.concat(n(i, r)));
		}),
		Object.entries(t.children).forEach(([r, i]) => {
			r !== v && (e = e.concat(n(i, r)));
		}),
		e
	);
}
var ke = (() => {
		class t {
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = g({
				token: t,
				factory: () => new Ee(),
				providedIn: "root",
			});
		}
		return t;
	})(),
	Ee = class {
		parse(n) {
			let e = new $r(n);
			return new se(
				e.parseRootSegment(),
				e.parseQueryParams(),
				e.parseFragment(),
			);
		}
		serialize(n) {
			let e = `/${_t(n.root, !0)}`,
				r = du(n.queryParams),
				i = typeof n.fragment == "string" ? `#${cu(n.fragment)}` : "";
			return `${e}${r}${i}`;
		}
	},
	uu = new Ee();
function Sn(t) {
	return t.segments.map((n) => Jo(n)).join("/");
}
function _t(t, n) {
	if (!t.hasChildren()) return Sn(t);
	if (n) {
		let e = t.children[v] ? _t(t.children[v], !1) : "",
			r = [];
		return (
			Object.entries(t.children).forEach(([i, o]) => {
				i !== v && r.push(`${i}:${_t(o, !1)}`);
			}),
			r.length > 0 ? `${e}(${r.join("//")})` : e
		);
	} else {
		let e = au(t, (r, i) =>
			i === v ? [_t(t.children[v], !1)] : [`${i}:${_t(r, !1)}`],
		);
		return Object.keys(t.children).length === 1 && t.children[v] != null
			? `${Sn(t)}/${e[0]}`
			: `${Sn(t)}/(${e.join("//")})`;
	}
}
function Xo(t) {
	return encodeURIComponent(t)
		.replace(/%40/g, "@")
		.replace(/%3A/gi, ":")
		.replace(/%24/g, "$")
		.replace(/%2C/gi, ",");
}
function wn(t) {
	return Xo(t).replace(/%3B/gi, ";");
}
function cu(t) {
	return encodeURI(t);
}
function jr(t) {
	return Xo(t)
		.replace(/\(/g, "%28")
		.replace(/\)/g, "%29")
		.replace(/%26/gi, "&");
}
function Rn(t) {
	return decodeURIComponent(t);
}
function Uo(t) {
	return Rn(t.replace(/\+/g, "%20"));
}
function Jo(t) {
	return `${jr(t.path)}${lu(t.parameters)}`;
}
function lu(t) {
	return Object.entries(t)
		.map(([n, e]) => `;${jr(n)}=${jr(e)}`)
		.join("");
}
function du(t) {
	let n = Object.entries(t)
		.map(([e, r]) =>
			Array.isArray(r)
				? r.map((i) => `${wn(e)}=${wn(i)}`).join("&")
				: `${wn(e)}=${wn(r)}`,
		)
		.filter((e) => e);
	return n.length ? `?${n.join("&")}` : "";
}
var hu = /^[^\/()?;#]+/;
function Nr(t) {
	let n = t.match(hu);
	return n ? n[0] : "";
}
var fu = /^[^\/()?;=#]+/;
function pu(t) {
	let n = t.match(fu);
	return n ? n[0] : "";
}
var gu = /^[^=?&#]+/;
function mu(t) {
	let n = t.match(gu);
	return n ? n[0] : "";
}
var vu = /^[^&#]+/;
function Du(t) {
	let n = t.match(vu);
	return n ? n[0] : "";
}
var $r = class {
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
				? new R([], {})
				: new R([], this.parseChildren())
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
			(n.length > 0 || Object.keys(e).length > 0) && (r[v] = new R(n, e)),
			r
		);
	}
	parseSegment() {
		let n = Nr(this.remaining);
		if (n === "" && this.peekStartsWith(";")) throw new E(4009, !1);
		return (this.capture(n), new Ce(Rn(n), this.parseMatrixParams()));
	}
	parseMatrixParams() {
		let n = {};
		for (; this.consumeOptional(";"); ) this.parseParam(n);
		return n;
	}
	parseParam(n) {
		let e = pu(this.remaining);
		if (!e) return;
		this.capture(e);
		let r = "";
		if (this.consumeOptional("=")) {
			let i = Nr(this.remaining);
			i && ((r = i), this.capture(r));
		}
		n[Rn(e)] = Rn(r);
	}
	parseQueryParam(n) {
		let e = mu(this.remaining);
		if (!e) return;
		this.capture(e);
		let r = "";
		if (this.consumeOptional("=")) {
			let s = Du(this.remaining);
			s && ((r = s), this.capture(r));
		}
		let i = Uo(e),
			o = Uo(r);
		if (n.hasOwnProperty(i)) {
			let s = n[i];
			(Array.isArray(s) || ((s = [s]), (n[i] = s)), s.push(o));
		} else n[i] = o;
	}
	parseParens(n) {
		let e = {};
		for (
			this.capture("(");
			!this.consumeOptional(")") && this.remaining.length > 0;
		) {
			let r = Nr(this.remaining),
				i = this.remaining[r.length];
			if (i !== "/" && i !== ")" && i !== ";") throw new E(4010, !1);
			let o;
			r.indexOf(":") > -1
				? ((o = r.slice(0, r.indexOf(":"))), this.capture(o), this.capture(":"))
				: n && (o = v);
			let s = this.parseChildren();
			((e[o] = Object.keys(s).length === 1 ? s[v] : new R([], s)),
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
		if (!this.consumeOptional(n)) throw new E(4011, !1);
	}
};
function Qo(t) {
	return t.segments.length > 0 ? new R([], { [v]: t }) : t;
}
function es(t) {
	let n = {};
	for (let [r, i] of Object.entries(t.children)) {
		let o = es(i);
		if (r === v && o.segments.length === 0 && o.hasChildren())
			for (let [s, a] of Object.entries(o.children)) n[s] = a;
		else (o.segments.length > 0 || o.hasChildren()) && (n[r] = o);
	}
	let e = new R(t.segments, n);
	return yu(e);
}
function yu(t) {
	if (t.numberOfChildren === 1 && t.children[v]) {
		let n = t.children[v];
		return new R(t.segments.concat(n.segments), n.children);
	}
	return t;
}
function Se(t) {
	return t instanceof se;
}
function ts(t, n, e = null, r = null) {
	let i = ns(t);
	return rs(i, n, e, r);
}
function ns(t) {
	let n;
	function e(o) {
		let s = {};
		for (let u of o.children) {
			let c = e(u);
			s[u.outlet] = c;
		}
		let a = new R(o.url, s);
		return (o === t && (n = a), a);
	}
	let r = e(t.root),
		i = Qo(r);
	return n ?? i;
}
function rs(t, n, e, r) {
	let i = t;
	for (; i.parent; ) i = i.parent;
	if (n.length === 0) return Lr(i, i, i, e, r);
	let o = wu(n);
	if (o.toRoot()) return Lr(i, i, new R([], {}), e, r);
	let s = Cu(o, i, t),
		a = s.processChildren
			? Mt(s.segmentGroup, s.index, o.commands)
			: os(s.segmentGroup, s.index, o.commands);
	return Lr(i, s.segmentGroup, a, e, r);
}
function An(t) {
	return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function Ot(t) {
	return typeof t == "object" && t != null && t.outlets;
}
function Lr(t, n, e, r, i) {
	let o = {};
	r &&
		Object.entries(r).forEach(([u, c]) => {
			o[u] = Array.isArray(c) ? c.map((l) => `${l}`) : `${c}`;
		});
	let s;
	t === n ? (s = e) : (s = is(t, n, e));
	let a = Qo(es(s));
	return new se(a, o, i);
}
function is(t, n, e) {
	let r = {};
	return (
		Object.entries(t.children).forEach(([i, o]) => {
			o === n ? (r[i] = e) : (r[i] = is(o, n, e));
		}),
		new R(t.segments, r)
	);
}
var Tn = class {
	isAbsolute;
	numberOfDoubleDots;
	commands;
	constructor(n, e, r) {
		if (
			((this.isAbsolute = n),
			(this.numberOfDoubleDots = e),
			(this.commands = r),
			n && r.length > 0 && An(r[0]))
		)
			throw new E(4003, !1);
		let i = r.find(Ot);
		if (i && i !== qo(r)) throw new E(4004, !1);
	}
	toRoot() {
		return (
			this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
		);
	}
};
function wu(t) {
	if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
		return new Tn(!0, 0, t);
	let n = 0,
		e = !1,
		r = t.reduce((i, o, s) => {
			if (typeof o == "object" && o != null) {
				if (o.outlets) {
					let a = {};
					return (
						Object.entries(o.outlets).forEach(([u, c]) => {
							a[u] = typeof c == "string" ? c.split("/") : c;
						}),
						[...i, { outlets: a }]
					);
				}
				if (o.segmentPath) return [...i, o.segmentPath];
			}
			return typeof o != "string"
				? [...i, o]
				: s === 0
					? (o.split("/").forEach((a, u) => {
							(u == 0 && a === ".") ||
								(u == 0 && a === ""
									? (e = !0)
									: a === ".."
										? n++
										: a != "" && i.push(a));
						}),
						i)
					: [...i, o];
		}, []);
	return new Tn(e, n, r);
}
var Qe = class {
	segmentGroup;
	processChildren;
	index;
	constructor(n, e, r) {
		((this.segmentGroup = n), (this.processChildren = e), (this.index = r));
	}
};
function Cu(t, n, e) {
	if (t.isAbsolute) return new Qe(n, !0, 0);
	if (!e) return new Qe(n, !1, NaN);
	if (e.parent === null) return new Qe(e, !0, 0);
	let r = An(t.commands[0]) ? 0 : 1,
		i = e.segments.length - 1 + r;
	return Eu(e, i, t.numberOfDoubleDots);
}
function Eu(t, n, e) {
	let r = t,
		i = n,
		o = e;
	for (; o > i; ) {
		if (((o -= i), (r = r.parent), !r)) throw new E(4005, !1);
		i = r.segments.length;
	}
	return new Qe(r, !1, i - o);
}
function Su(t) {
	return Ot(t[0]) ? t[0].outlets : { [v]: t };
}
function os(t, n, e) {
	if (((t ??= new R([], {})), t.segments.length === 0 && t.hasChildren()))
		return Mt(t, n, e);
	let r = Ru(t, n, e),
		i = e.slice(r.commandIndex);
	if (r.match && r.pathIndex < t.segments.length) {
		let o = new R(t.segments.slice(0, r.pathIndex), {});
		return (
			(o.children[v] = new R(t.segments.slice(r.pathIndex), t.children)),
			Mt(o, 0, i)
		);
	} else
		return r.match && i.length === 0
			? new R(t.segments, {})
			: r.match && !t.hasChildren()
				? zr(t, n, e)
				: r.match
					? Mt(t, 0, i)
					: zr(t, n, e);
}
function Mt(t, n, e) {
	if (e.length === 0) return new R(t.segments, {});
	{
		let r = Su(e),
			i = {};
		if (
			Object.keys(r).some((o) => o !== v) &&
			t.children[v] &&
			t.numberOfChildren === 1 &&
			t.children[v].segments.length === 0
		) {
			let o = Mt(t.children[v], n, e);
			return new R(t.segments, o.children);
		}
		return (
			Object.entries(r).forEach(([o, s]) => {
				(typeof s == "string" && (s = [s]),
					s !== null && (i[o] = os(t.children[o], n, s)));
			}),
			Object.entries(t.children).forEach(([o, s]) => {
				r[o] === void 0 && (i[o] = s);
			}),
			new R(t.segments, i)
		);
	}
}
function Ru(t, n, e) {
	let r = 0,
		i = n,
		o = { match: !1, pathIndex: 0, commandIndex: 0 };
	for (; i < t.segments.length; ) {
		if (r >= e.length) return o;
		let s = t.segments[i],
			a = e[r];
		if (Ot(a)) break;
		let u = `${a}`,
			c = r < e.length - 1 ? e[r + 1] : null;
		if (i > 0 && u === void 0) break;
		if (u && c && typeof c == "object" && c.outlets === void 0) {
			if (!jo(u, c, s)) return o;
			r += 2;
		} else {
			if (!jo(u, {}, s)) return o;
			r++;
		}
		i++;
	}
	return { match: !0, pathIndex: i, commandIndex: r };
}
function zr(t, n, e) {
	let r = t.segments.slice(0, n),
		i = 0;
	for (; i < e.length; ) {
		let o = e[i];
		if (Ot(o)) {
			let u = bu(o.outlets);
			return new R(r, u);
		}
		if (i === 0 && An(e[0])) {
			let u = t.segments[n];
			(r.push(new Ce(u.path, Bo(e[0]))), i++);
			continue;
		}
		let s = Ot(o) ? o.outlets[v] : `${o}`,
			a = i < e.length - 1 ? e[i + 1] : null;
		s && a && An(a)
			? (r.push(new Ce(s, Bo(a))), (i += 2))
			: (r.push(new Ce(s, {})), i++);
	}
	return new R(r, {});
}
function bu(t) {
	let n = {};
	return (
		Object.entries(t).forEach(([e, r]) => {
			(typeof r == "string" && (r = [r]),
				r !== null && (n[e] = zr(new R([], {}), 0, r)));
		}),
		n
	);
}
function Bo(t) {
	let n = {};
	return (Object.entries(t).forEach(([e, r]) => (n[e] = `${r}`)), n);
}
function jo(t, n, e) {
	return t == e.path && ie(n, e.parameters);
}
var bn = "imperative",
	N = (function (t) {
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
	})(N || {}),
	H = class {
		id;
		url;
		constructor(n, e) {
			((this.id = n), (this.url = e));
		}
	},
	Re = class extends H {
		type = N.NavigationStart;
		navigationTrigger;
		restoredState;
		constructor(n, e, r = "imperative", i = null) {
			(super(n, e), (this.navigationTrigger = r), (this.restoredState = i));
		}
		toString() {
			return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
		}
	},
	Y = class extends H {
		urlAfterRedirects;
		type = N.NavigationEnd;
		constructor(n, e, r) {
			(super(n, e), (this.urlAfterRedirects = r));
		}
		toString() {
			return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
		}
	},
	$ = (function (t) {
		return (
			(t[(t.Redirect = 0)] = "Redirect"),
			(t[(t.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
			(t[(t.NoDataFromResolver = 2)] = "NoDataFromResolver"),
			(t[(t.GuardRejected = 3)] = "GuardRejected"),
			t
		);
	})($ || {}),
	tt = (function (t) {
		return (
			(t[(t.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
			(t[(t.IgnoredByUrlHandlingStrategy = 1)] =
				"IgnoredByUrlHandlingStrategy"),
			t
		);
	})(tt || {}),
	oe = class extends H {
		reason;
		code;
		type = N.NavigationCancel;
		constructor(n, e, r, i) {
			(super(n, e), (this.reason = r), (this.code = i));
		}
		toString() {
			return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
		}
	},
	ae = class extends H {
		reason;
		code;
		type = N.NavigationSkipped;
		constructor(n, e, r, i) {
			(super(n, e), (this.reason = r), (this.code = i));
		}
	},
	nt = class extends H {
		error;
		target;
		type = N.NavigationError;
		constructor(n, e, r, i) {
			(super(n, e), (this.error = r), (this.target = i));
		}
		toString() {
			return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
		}
	},
	Pt = class extends H {
		urlAfterRedirects;
		state;
		type = N.RoutesRecognized;
		constructor(n, e, r, i) {
			(super(n, e), (this.urlAfterRedirects = r), (this.state = i));
		}
		toString() {
			return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	_n = class extends H {
		urlAfterRedirects;
		state;
		type = N.GuardsCheckStart;
		constructor(n, e, r, i) {
			(super(n, e), (this.urlAfterRedirects = r), (this.state = i));
		}
		toString() {
			return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	In = class extends H {
		urlAfterRedirects;
		state;
		shouldActivate;
		type = N.GuardsCheckEnd;
		constructor(n, e, r, i, o) {
			(super(n, e),
				(this.urlAfterRedirects = r),
				(this.state = i),
				(this.shouldActivate = o));
		}
		toString() {
			return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
		}
	},
	Mn = class extends H {
		urlAfterRedirects;
		state;
		type = N.ResolveStart;
		constructor(n, e, r, i) {
			(super(n, e), (this.urlAfterRedirects = r), (this.state = i));
		}
		toString() {
			return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	Fn = class extends H {
		urlAfterRedirects;
		state;
		type = N.ResolveEnd;
		constructor(n, e, r, i) {
			(super(n, e), (this.urlAfterRedirects = r), (this.state = i));
		}
		toString() {
			return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
		}
	},
	On = class {
		route;
		type = N.RouteConfigLoadStart;
		constructor(n) {
			this.route = n;
		}
		toString() {
			return `RouteConfigLoadStart(path: ${this.route.path})`;
		}
	},
	Pn = class {
		route;
		type = N.RouteConfigLoadEnd;
		constructor(n) {
			this.route = n;
		}
		toString() {
			return `RouteConfigLoadEnd(path: ${this.route.path})`;
		}
	},
	Nn = class {
		snapshot;
		type = N.ChildActivationStart;
		constructor(n) {
			this.snapshot = n;
		}
		toString() {
			return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
		}
	},
	Ln = class {
		snapshot;
		type = N.ChildActivationEnd;
		constructor(n) {
			this.snapshot = n;
		}
		toString() {
			return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
		}
	},
	kn = class {
		snapshot;
		type = N.ActivationStart;
		constructor(n) {
			this.snapshot = n;
		}
		toString() {
			return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
		}
	},
	xn = class {
		snapshot;
		type = N.ActivationEnd;
		constructor(n) {
			this.snapshot = n;
		}
		toString() {
			return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
		}
	},
	rt = class {
		routerEvent;
		position;
		anchor;
		type = N.Scroll;
		constructor(n, e, r) {
			((this.routerEvent = n), (this.position = e), (this.anchor = r));
		}
		toString() {
			let n = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
			return `Scroll(anchor: '${this.anchor}', position: '${n}')`;
		}
	},
	Nt = class {},
	it = class {
		url;
		navigationBehaviorOptions;
		constructor(n, e) {
			((this.url = n), (this.navigationBehaviorOptions = e));
		}
	};
function Au(t, n) {
	return (
		t.providers &&
			!t._injector &&
			(t._injector = Kt(t.providers, n, `Route: ${t.path}`)),
		t._injector ?? n
	);
}
function ee(t) {
	return t.outlet || v;
}
function Tu(t, n) {
	let e = t.filter((r) => ee(r) === n);
	return (e.push(...t.filter((r) => ee(r) !== n)), e);
}
function $t(t) {
	if (!t) return null;
	if (t.routeConfig?._injector) return t.routeConfig._injector;
	for (let n = t.parent; n; n = n.parent) {
		let e = n.routeConfig;
		if (e?._loadedInjector) return e._loadedInjector;
		if (e?._injector) return e._injector;
	}
	return null;
}
var Un = class {
		rootInjector;
		outlet = null;
		route = null;
		children;
		attachRef = null;
		get injector() {
			return $t(this.route?.snapshot) ?? this.rootInjector;
		}
		constructor(n) {
			((this.rootInjector = n), (this.children = new xe(this.rootInjector)));
		}
	},
	xe = (() => {
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
					r || ((r = new Un(this.rootInjector)), this.contexts.set(e, r)),
					r
				);
			}
			getContext(e) {
				return this.contexts.get(e) || null;
			}
			static ɵfac = function (r) {
				return new (r || t)(p(De));
			};
			static ɵprov = g({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})(),
	Bn = class {
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
			let e = Vr(n, this._root);
			return e ? e.children.map((r) => r.value) : [];
		}
		firstChild(n) {
			let e = Vr(n, this._root);
			return e && e.children.length > 0 ? e.children[0].value : null;
		}
		siblings(n) {
			let e = Hr(n, this._root);
			return e.length < 2
				? []
				: e[e.length - 2].children.map((i) => i.value).filter((i) => i !== n);
		}
		pathFromRoot(n) {
			return Hr(n, this._root).map((e) => e.value);
		}
	};
function Vr(t, n) {
	if (t === n.value) return n;
	for (let e of n.children) {
		let r = Vr(t, e);
		if (r) return r;
	}
	return null;
}
function Hr(t, n) {
	if (t === n.value) return [n];
	for (let e of n.children) {
		let r = Hr(t, e);
		if (r.length) return (r.unshift(n), r);
	}
	return [];
}
var V = class {
	value;
	children;
	constructor(n, e) {
		((this.value = n), (this.children = e));
	}
	toString() {
		return `TreeNode(${this.value})`;
	}
};
function Je(t) {
	let n = {};
	return (t && t.children.forEach((e) => (n[e.value.outlet] = e)), n);
}
var Lt = class extends Bn {
	snapshot;
	constructor(n, e) {
		(super(n), (this.snapshot = e), Jr(this, n));
	}
	toString() {
		return this.snapshot.toString();
	}
};
function ss(t) {
	let n = _u(t),
		e = new G([new Ce("", {})]),
		r = new G({}),
		i = new G({}),
		o = new G({}),
		s = new G(""),
		a = new ue(e, r, o, s, i, v, t, n.root);
	return ((a.snapshot = n.root), new Lt(new V(a, []), n));
}
function _u(t) {
	let n = {},
		e = {},
		r = {},
		i = "",
		o = new Ne([], n, r, i, e, v, t, null, {});
	return new kt("", new V(o, []));
}
var ue = class {
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
	constructor(n, e, r, i, o, s, a, u) {
		((this.urlSubject = n),
			(this.paramsSubject = e),
			(this.queryParamsSubject = r),
			(this.fragmentSubject = i),
			(this.dataSubject = o),
			(this.outlet = s),
			(this.component = a),
			(this._futureSnapshot = u),
			(this.title = this.dataSubject?.pipe(S((c) => c[jt])) ?? f(void 0)),
			(this.url = n),
			(this.params = e),
			(this.queryParams = r),
			(this.fragment = i),
			(this.data = o));
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
			(this._paramMap ??= this.params.pipe(S((n) => Le(n)))),
			this._paramMap
		);
	}
	get queryParamMap() {
		return (
			(this._queryParamMap ??= this.queryParams.pipe(S((n) => Le(n)))),
			this._queryParamMap
		);
	}
	toString() {
		return this.snapshot
			? this.snapshot.toString()
			: `Future(${this._futureSnapshot})`;
	}
};
function jn(t, n, e = "emptyOnly") {
	let r,
		{ routeConfig: i } = t;
	return (
		n !== null &&
		(e === "always" ||
			i?.path === "" ||
			(!n.component && !n.routeConfig?.loadComponent))
			? (r = {
					params: h(h({}, n.params), t.params),
					data: h(h({}, n.data), t.data),
					resolve: h(h(h(h({}, t.data), n.data), i?.data), t._resolvedData),
				})
			: (r = {
					params: h({}, t.params),
					data: h({}, t.data),
					resolve: h(h({}, t.data), t._resolvedData ?? {}),
				}),
		i && us(i) && (r.resolve[jt] = i.title),
		r
	);
}
var Ne = class {
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
			return this.data?.[jt];
		}
		constructor(n, e, r, i, o, s, a, u, c) {
			((this.url = n),
				(this.params = e),
				(this.queryParams = r),
				(this.fragment = i),
				(this.data = o),
				(this.outlet = s),
				(this.component = a),
				(this.routeConfig = u),
				(this._resolve = c));
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
			return ((this._paramMap ??= Le(this.params)), this._paramMap);
		}
		get queryParamMap() {
			return (
				(this._queryParamMap ??= Le(this.queryParams)),
				this._queryParamMap
			);
		}
		toString() {
			let n = this.url.map((r) => r.toString()).join("/"),
				e = this.routeConfig ? this.routeConfig.path : "";
			return `Route(url:'${n}', path:'${e}')`;
		}
	},
	kt = class extends Bn {
		url;
		constructor(n, e) {
			(super(e), (this.url = n), Jr(this, e));
		}
		toString() {
			return as(this._root);
		}
	};
function Jr(t, n) {
	((n.value._routerState = t), n.children.forEach((e) => Jr(t, e)));
}
function as(t) {
	let n = t.children.length > 0 ? ` { ${t.children.map(as).join(", ")} } ` : "";
	return `${t.value}${n}`;
}
function kr(t) {
	if (t.snapshot) {
		let n = t.snapshot,
			e = t._futureSnapshot;
		((t.snapshot = e),
			ie(n.queryParams, e.queryParams) ||
				t.queryParamsSubject.next(e.queryParams),
			n.fragment !== e.fragment && t.fragmentSubject.next(e.fragment),
			ie(n.params, e.params) || t.paramsSubject.next(e.params),
			nu(n.url, e.url) || t.urlSubject.next(e.url),
			ie(n.data, e.data) || t.dataSubject.next(e.data));
	} else
		((t.snapshot = t._futureSnapshot),
			t.dataSubject.next(t._futureSnapshot.data));
}
function Gr(t, n) {
	let e = ie(t.params, n.params) && su(t.url, n.url),
		r = !t.parent != !n.parent;
	return e && !r && (!t.parent || Gr(t.parent, n.parent));
}
function us(t) {
	return typeof t.title == "string" || t.title === null;
}
var cs = new D(""),
	Qr = (() => {
		class t {
			activated = null;
			get activatedComponentRef() {
				return this.activated;
			}
			_activatedRoute = null;
			name = v;
			activateEvents = new Ve();
			deactivateEvents = new Ve();
			attachEvents = new Ve();
			detachEvents = new Ve();
			routerOutletData = Ci(void 0);
			parentContexts = d(xe);
			location = d(We);
			changeDetector = d(dt);
			inputBinder = d(zt, { optional: !0 });
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
				if (!this.activated) throw new E(4012, !1);
				return this.activated.instance;
			}
			get activatedRoute() {
				if (!this.activated) throw new E(4012, !1);
				return this._activatedRoute;
			}
			get activatedRouteData() {
				return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
			}
			detach() {
				if (!this.activated) throw new E(4012, !1);
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
				if (this.isActivated) throw new E(4013, !1);
				this._activatedRoute = e;
				let i = this.location,
					s = e.snapshot.component,
					a = this.parentContexts.getOrCreateContext(this.name).children,
					u = new qr(e, a, i.injector, this.routerOutletData);
				((this.activated = i.createComponent(s, {
					index: i.length,
					injector: u,
					environmentInjector: r,
				})),
					this.changeDetector.markForCheck(),
					this.inputBinder?.bindActivatedRouteToOutletComponent(this),
					this.activateEvents.emit(this.activated.instance));
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵdir = re({
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
				features: [ze],
			});
		}
		return t;
	})(),
	qr = class {
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
			return n === ue
				? this.route
				: n === xe
					? this.childContexts
					: n === cs
						? this.outletData
						: this.parent.get(n, e);
		}
	},
	zt = new D(""),
	ei = (() => {
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
					i = Wt([r.queryParams, r.params, r.data])
						.pipe(
							z(
								([o, s, a], u) => (
									(a = h(h(h({}, o), s), a)),
									u === 0 ? f(a) : Promise.resolve(a)
								),
							),
						)
						.subscribe((o) => {
							if (
								!e.isActivated ||
								!e.activatedComponentRef ||
								e.activatedRoute !== r ||
								r.component === null
							) {
								this.unsubscribeFromRouteData(e);
								return;
							}
							let s = $i(r.component);
							if (!s) {
								this.unsubscribeFromRouteData(e);
								return;
							}
							for (let { templateName: a } of s.inputs)
								e.activatedComponentRef.setInput(a, o[a]);
						});
				this.outletDataSubscriptions.set(e, i);
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = g({ token: t, factory: t.ɵfac });
		}
		return t;
	})(),
	ti = (() => {
		class t {
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵcmp = Mi({
				type: t,
				selectors: [["ng-component"]],
				exportAs: ["emptyRouterOutlet"],
				decls: 1,
				vars: 0,
				template: function (r, i) {
					r & 1 && Ni(0, "router-outlet");
				},
				dependencies: [Qr],
				encapsulation: 2,
			});
		}
		return t;
	})();
function ni(t) {
	let n = t.children && t.children.map(ni),
		e = n ? U(h({}, t), { children: n }) : h({}, t);
	return (
		!e.component &&
			!e.loadComponent &&
			(n || e.loadChildren) &&
			e.outlet &&
			e.outlet !== v &&
			(e.component = ti),
		e
	);
}
function Iu(t, n, e) {
	let r = xt(t, n._root, e ? e._root : void 0);
	return new Lt(r, n);
}
function xt(t, n, e) {
	if (e && t.shouldReuseRoute(n.value, e.value.snapshot)) {
		let r = e.value;
		r._futureSnapshot = n.value;
		let i = Mu(t, n, e);
		return new V(r, i);
	} else {
		if (t.shouldAttach(n.value)) {
			let o = t.retrieve(n.value);
			if (o !== null) {
				let s = o.route;
				return (
					(s.value._futureSnapshot = n.value),
					(s.children = n.children.map((a) => xt(t, a))),
					s
				);
			}
		}
		let r = Fu(n.value),
			i = n.children.map((o) => xt(t, o));
		return new V(r, i);
	}
}
function Mu(t, n, e) {
	return n.children.map((r) => {
		for (let i of e.children)
			if (t.shouldReuseRoute(r.value, i.value.snapshot)) return xt(t, r, i);
		return xt(t, r);
	});
}
function Fu(t) {
	return new ue(
		new G(t.url),
		new G(t.params),
		new G(t.queryParams),
		new G(t.fragment),
		new G(t.data),
		t.outlet,
		t.component,
		t,
	);
}
var ot = class {
		redirectTo;
		navigationBehaviorOptions;
		constructor(n, e) {
			((this.redirectTo = n), (this.navigationBehaviorOptions = e));
		}
	},
	ls = "ngNavigationCancelingError";
function $n(t, n) {
	let { redirectTo: e, navigationBehaviorOptions: r } = Se(n)
			? { redirectTo: n, navigationBehaviorOptions: void 0 }
			: n,
		i = ds(!1, $.Redirect);
	return ((i.url = e), (i.navigationBehaviorOptions = r), i);
}
function ds(t, n) {
	let e = new Error(`NavigationCancelingError: ${t || ""}`);
	return ((e[ls] = !0), (e.cancellationCode = n), e);
}
function Ou(t) {
	return hs(t) && Se(t.url);
}
function hs(t) {
	return !!t && t[ls];
}
var Pu = (t, n, e, r) =>
		S(
			(i) => (
				new Wr(n, i.targetRouterState, i.currentRouterState, e, r).activate(t),
				i
			),
		),
	Wr = class {
		routeReuseStrategy;
		futureState;
		currState;
		forwardEvent;
		inputBindingEnabled;
		constructor(n, e, r, i, o) {
			((this.routeReuseStrategy = n),
				(this.futureState = e),
				(this.currState = r),
				(this.forwardEvent = i),
				(this.inputBindingEnabled = o));
		}
		activate(n) {
			let e = this.futureState._root,
				r = this.currState ? this.currState._root : null;
			(this.deactivateChildRoutes(e, r, n),
				kr(this.futureState.root),
				this.activateChildRoutes(e, r, n));
		}
		deactivateChildRoutes(n, e, r) {
			let i = Je(e);
			(n.children.forEach((o) => {
				let s = o.value.outlet;
				(this.deactivateRoutes(o, i[s], r), delete i[s]);
			}),
				Object.values(i).forEach((o) => {
					this.deactivateRouteAndItsChildren(o, r);
				}));
		}
		deactivateRoutes(n, e, r) {
			let i = n.value,
				o = e ? e.value : null;
			if (i === o)
				if (i.component) {
					let s = r.getContext(i.outlet);
					s && this.deactivateChildRoutes(n, e, s.children);
				} else this.deactivateChildRoutes(n, e, r);
			else o && this.deactivateRouteAndItsChildren(e, r);
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
				o = Je(n);
			for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
			if (r && r.outlet) {
				let s = r.outlet.detach(),
					a = r.children.onOutletDeactivated();
				this.routeReuseStrategy.store(n.value.snapshot, {
					componentRef: s,
					route: n,
					contexts: a,
				});
			}
		}
		deactivateRouteAndOutlet(n, e) {
			let r = e.getContext(n.value.outlet),
				i = r && n.value.component ? r.children : e,
				o = Je(n);
			for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
			r &&
				(r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
				(r.attachRef = null),
				(r.route = null));
		}
		activateChildRoutes(n, e, r) {
			let i = Je(e);
			(n.children.forEach((o) => {
				(this.activateRoutes(o, i[o.value.outlet], r),
					this.forwardEvent(new xn(o.value.snapshot)));
			}),
				n.children.length && this.forwardEvent(new Ln(n.value.snapshot)));
		}
		activateRoutes(n, e, r) {
			let i = n.value,
				o = e ? e.value : null;
			if ((kr(i), i === o))
				if (i.component) {
					let s = r.getOrCreateContext(i.outlet);
					this.activateChildRoutes(n, e, s.children);
				} else this.activateChildRoutes(n, e, r);
			else if (i.component) {
				let s = r.getOrCreateContext(i.outlet);
				if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
					let a = this.routeReuseStrategy.retrieve(i.snapshot);
					(this.routeReuseStrategy.store(i.snapshot, null),
						s.children.onOutletReAttached(a.contexts),
						(s.attachRef = a.componentRef),
						(s.route = a.route.value),
						s.outlet && s.outlet.attach(a.componentRef, a.route.value),
						kr(a.route.value),
						this.activateChildRoutes(n, null, s.children));
				} else
					((s.attachRef = null),
						(s.route = i),
						s.outlet && s.outlet.activateWith(i, s.injector),
						this.activateChildRoutes(n, null, s.children));
			} else this.activateChildRoutes(n, null, r);
		}
	},
	zn = class {
		path;
		route;
		constructor(n) {
			((this.path = n), (this.route = this.path[this.path.length - 1]));
		}
	},
	et = class {
		component;
		route;
		constructor(n, e) {
			((this.component = n), (this.route = e));
		}
	};
function Nu(t, n, e) {
	let r = t._root,
		i = n ? n._root : null;
	return It(r, i, e, [r.value]);
}
function Lu(t) {
	let n = t.routeConfig ? t.routeConfig.canActivateChild : null;
	return !n || n.length === 0 ? null : { node: t, guards: n };
}
function at(t, n) {
	let e = Symbol(),
		r = n.get(t, e);
	return r === e ? (typeof t == "function" && !yi(t) ? t : n.get(t)) : r;
}
function It(
	t,
	n,
	e,
	r,
	i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
	let o = Je(n);
	return (
		t.children.forEach((s) => {
			(ku(s, o[s.value.outlet], e, r.concat([s.value]), i),
				delete o[s.value.outlet]);
		}),
		Object.entries(o).forEach(([s, a]) => Ft(a, e.getContext(s), i)),
		i
	);
}
function ku(
	t,
	n,
	e,
	r,
	i = { canDeactivateChecks: [], canActivateChecks: [] },
) {
	let o = t.value,
		s = n ? n.value : null,
		a = e ? e.getContext(t.value.outlet) : null;
	if (s && o.routeConfig === s.routeConfig) {
		let u = xu(s, o, o.routeConfig.runGuardsAndResolvers);
		(u
			? i.canActivateChecks.push(new zn(r))
			: ((o.data = s.data), (o._resolvedData = s._resolvedData)),
			o.component ? It(t, n, a ? a.children : null, r, i) : It(t, n, e, r, i),
			u &&
				a &&
				a.outlet &&
				a.outlet.isActivated &&
				i.canDeactivateChecks.push(new et(a.outlet.component, s)));
	} else
		(s && Ft(n, a, i),
			i.canActivateChecks.push(new zn(r)),
			o.component
				? It(t, null, a ? a.children : null, r, i)
				: It(t, null, e, r, i));
	return i;
}
function xu(t, n, e) {
	if (typeof e == "function") return e(t, n);
	switch (e) {
		case "pathParamsChange":
			return !Pe(t.url, n.url);
		case "pathParamsOrQueryParamsChange":
			return !Pe(t.url, n.url) || !ie(t.queryParams, n.queryParams);
		case "always":
			return !0;
		case "paramsOrQueryParamsChange":
			return !Gr(t, n) || !ie(t.queryParams, n.queryParams);
		case "paramsChange":
		default:
			return !Gr(t, n);
	}
}
function Ft(t, n, e) {
	let r = Je(t),
		i = t.value;
	(Object.entries(r).forEach(([o, s]) => {
		i.component
			? n
				? Ft(s, n.children.getContext(o), e)
				: Ft(s, null, e)
			: Ft(s, n, e);
	}),
		i.component
			? n && n.outlet && n.outlet.isActivated
				? e.canDeactivateChecks.push(new et(n.outlet.component, i))
				: e.canDeactivateChecks.push(new et(null, i))
			: e.canDeactivateChecks.push(new et(null, i)));
}
function Vt(t) {
	return typeof t == "function";
}
function Uu(t) {
	return typeof t == "boolean";
}
function Bu(t) {
	return t && Vt(t.canLoad);
}
function ju(t) {
	return t && Vt(t.canActivate);
}
function $u(t) {
	return t && Vt(t.canActivateChild);
}
function zu(t) {
	return t && Vt(t.canDeactivate);
}
function Vu(t) {
	return t && Vt(t.canMatch);
}
function fs(t) {
	return t instanceof fi || t?.name === "EmptyError";
}
var Cn = Symbol("INITIAL_VALUE");
function st() {
	return z((t) =>
		Wt(t.map((n) => n.pipe(je(1), vi(Cn)))).pipe(
			S((n) => {
				for (let e of n)
					if (e !== !0) {
						if (e === Cn) return Cn;
						if (e === !1 || Hu(e)) return e;
					}
				return !0;
			}),
			ne((n) => n !== Cn),
			je(1),
		),
	);
}
function Hu(t) {
	return Se(t) || t instanceof ot;
}
function Gu(t, n) {
	return B((e) => {
		let {
			targetSnapshot: r,
			currentSnapshot: i,
			guards: { canActivateChecks: o, canDeactivateChecks: s },
		} = e;
		return s.length === 0 && o.length === 0
			? f(U(h({}, e), { guardsResult: !0 }))
			: qu(s, r, i, t).pipe(
					B((a) => (a && Uu(a) ? Wu(r, o, t, n) : f(a))),
					S((a) => U(h({}, e), { guardsResult: a })),
				);
	});
}
function qu(t, n, e, r) {
	return L(t).pipe(
		B((i) => Ju(i.component, i.route, e, n, r)),
		ve((i) => i !== !0, !0),
	);
}
function Wu(t, n, e, r) {
	return L(n).pipe(
		de((i) =>
			pi(
				Yu(i.route.parent, r),
				Zu(i.route, r),
				Xu(t, i.path, e),
				Ku(t, i.route, e),
			),
		),
		ve((i) => i !== !0, !0),
	);
}
function Zu(t, n) {
	return (t !== null && n && n(new kn(t)), f(!0));
}
function Yu(t, n) {
	return (t !== null && n && n(new Nn(t)), f(!0));
}
function Ku(t, n, e) {
	let r = n.routeConfig ? n.routeConfig.canActivate : null;
	if (!r || r.length === 0) return f(!0);
	let i = r.map((o) =>
		Qn(() => {
			let s = $t(n) ?? e,
				a = at(o, s),
				u = ju(a) ? a.canActivate(n, t) : q(s, () => a(n, t));
			return be(u).pipe(ve());
		}),
	);
	return f(i).pipe(st());
}
function Xu(t, n, e) {
	let r = n[n.length - 1],
		o = n
			.slice(0, n.length - 1)
			.reverse()
			.map((s) => Lu(s))
			.filter((s) => s !== null)
			.map((s) =>
				Qn(() => {
					let a = s.guards.map((u) => {
						let c = $t(s.node) ?? e,
							l = at(u, c),
							m = $u(l) ? l.canActivateChild(r, t) : q(c, () => l(r, t));
						return be(m).pipe(ve());
					});
					return f(a).pipe(st());
				}),
			);
	return f(o).pipe(st());
}
function Ju(t, n, e, r, i) {
	let o = n && n.routeConfig ? n.routeConfig.canDeactivate : null;
	if (!o || o.length === 0) return f(!0);
	let s = o.map((a) => {
		let u = $t(n) ?? i,
			c = at(a, u),
			l = zu(c) ? c.canDeactivate(t, n, e, r) : q(u, () => c(t, n, e, r));
		return be(l).pipe(ve());
	});
	return f(s).pipe(st());
}
function Qu(t, n, e, r) {
	let i = n.canLoad;
	if (i === void 0 || i.length === 0) return f(!0);
	let o = i.map((s) => {
		let a = at(s, t),
			u = Bu(a) ? a.canLoad(n, e) : q(t, () => a(n, e));
		return be(u);
	});
	return f(o).pipe(st(), ps(r));
}
function ps(t) {
	return li(
		k((n) => {
			if (typeof n != "boolean") throw $n(t, n);
		}),
		S((n) => n === !0),
	);
}
function ec(t, n, e, r) {
	let i = n.canMatch;
	if (!i || i.length === 0) return f(!0);
	let o = i.map((s) => {
		let a = at(s, t),
			u = Vu(a) ? a.canMatch(n, e) : q(t, () => a(n, e));
		return be(u);
	});
	return f(o).pipe(st(), ps(r));
}
var Ut = class {
		segmentGroup;
		constructor(n) {
			this.segmentGroup = n || null;
		}
	},
	Bt = class extends Error {
		urlTree;
		constructor(n) {
			(super(), (this.urlTree = n));
		}
	};
function Xe(t) {
	return ut(new Ut(t));
}
function tc(t) {
	return ut(new E(4e3, !1));
}
function nc(t) {
	return ut(ds(!1, $.GuardRejected));
}
var Zr = class {
		urlSerializer;
		urlTree;
		constructor(n, e) {
			((this.urlSerializer = n), (this.urlTree = e));
		}
		lineralizeSegments(n, e) {
			let r = [],
				i = e.root;
			for (;;) {
				if (((r = r.concat(i.segments)), i.numberOfChildren === 0)) return f(r);
				if (i.numberOfChildren > 1 || !i.children[v])
					return tc(`${n.redirectTo}`);
				i = i.children[v];
			}
		}
		applyRedirectCommands(n, e, r, i, o) {
			if (typeof e != "string") {
				let a = e,
					{
						queryParams: u,
						fragment: c,
						routeConfig: l,
						url: m,
						outlet: y,
						params: b,
						data: _,
						title: w,
					} = i,
					C = q(o, () =>
						a({
							params: b,
							data: _,
							queryParams: u,
							fragment: c,
							routeConfig: l,
							url: m,
							outlet: y,
							title: w,
						}),
					);
				if (C instanceof se) throw new Bt(C);
				e = C;
			}
			let s = this.applyRedirectCreateUrlTree(
				e,
				this.urlSerializer.parse(e),
				n,
				r,
			);
			if (e[0] === "/") throw new Bt(s);
			return s;
		}
		applyRedirectCreateUrlTree(n, e, r, i) {
			let o = this.createSegmentGroup(n, e.root, r, i);
			return new se(
				o,
				this.createQueryParams(e.queryParams, this.urlTree.queryParams),
				e.fragment,
			);
		}
		createQueryParams(n, e) {
			let r = {};
			return (
				Object.entries(n).forEach(([i, o]) => {
					if (typeof o == "string" && o[0] === ":") {
						let a = o.substring(1);
						r[i] = e[a];
					} else r[i] = o;
				}),
				r
			);
		}
		createSegmentGroup(n, e, r, i) {
			let o = this.createSegments(n, e.segments, r, i),
				s = {};
			return (
				Object.entries(e.children).forEach(([a, u]) => {
					s[a] = this.createSegmentGroup(n, u, r, i);
				}),
				new R(o, s)
			);
		}
		createSegments(n, e, r, i) {
			return e.map((o) =>
				o.path[0] === ":"
					? this.findPosParam(n, o, i)
					: this.findOrReturn(o, r),
			);
		}
		findPosParam(n, e, r) {
			let i = r[e.path.substring(1)];
			if (!i) throw new E(4001, !1);
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
	Yr = {
		matched: !1,
		consumedSegments: [],
		remainingSegments: [],
		parameters: {},
		positionalParamSegments: {},
	};
function rc(t, n, e, r, i) {
	let o = gs(t, n, e);
	return o.matched
		? ((r = Au(n, r)),
			ec(r, n, e, i).pipe(S((s) => (s === !0 ? o : h({}, Yr)))))
		: f(o);
}
function gs(t, n, e) {
	if (n.path === "**") return ic(e);
	if (n.path === "")
		return n.pathMatch === "full" && (t.hasChildren() || e.length > 0)
			? h({}, Yr)
			: {
					matched: !0,
					consumedSegments: [],
					remainingSegments: e,
					parameters: {},
					positionalParamSegments: {},
				};
	let i = (n.matcher || Ho)(e, t, n);
	if (!i) return h({}, Yr);
	let o = {};
	Object.entries(i.posParams ?? {}).forEach(([a, u]) => {
		o[a] = u.path;
	});
	let s =
		i.consumed.length > 0
			? h(h({}, o), i.consumed[i.consumed.length - 1].parameters)
			: o;
	return {
		matched: !0,
		consumedSegments: i.consumed,
		remainingSegments: e.slice(i.consumed.length),
		parameters: s,
		positionalParamSegments: i.posParams ?? {},
	};
}
function ic(t) {
	return {
		matched: !0,
		parameters: t.length > 0 ? qo(t).parameters : {},
		consumedSegments: t,
		remainingSegments: [],
		positionalParamSegments: {},
	};
}
function $o(t, n, e, r) {
	return e.length > 0 && ac(t, e, r)
		? {
				segmentGroup: new R(n, sc(r, new R(e, t.children))),
				slicedSegments: [],
			}
		: e.length === 0 && uc(t, e, r)
			? {
					segmentGroup: new R(t.segments, oc(t, e, r, t.children)),
					slicedSegments: e,
				}
			: { segmentGroup: new R(t.segments, t.children), slicedSegments: e };
}
function oc(t, n, e, r) {
	let i = {};
	for (let o of e)
		if (Hn(t, n, o) && !r[ee(o)]) {
			let s = new R([], {});
			i[ee(o)] = s;
		}
	return h(h({}, r), i);
}
function sc(t, n) {
	let e = {};
	e[v] = n;
	for (let r of t)
		if (r.path === "" && ee(r) !== v) {
			let i = new R([], {});
			e[ee(r)] = i;
		}
	return e;
}
function ac(t, n, e) {
	return e.some((r) => Hn(t, n, r) && ee(r) !== v);
}
function uc(t, n, e) {
	return e.some((r) => Hn(t, n, r));
}
function Hn(t, n, e) {
	return (t.hasChildren() || n.length > 0) && e.pathMatch === "full"
		? !1
		: e.path === "";
}
function cc(t, n, e) {
	return n.length === 0 && !t.children[e];
}
var Kr = class {};
function lc(t, n, e, r, i, o, s = "emptyOnly") {
	return new Xr(t, n, e, r, i, s, o).recognize();
}
var dc = 31,
	Xr = class {
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
		constructor(n, e, r, i, o, s, a) {
			((this.injector = n),
				(this.configLoader = e),
				(this.rootComponentType = r),
				(this.config = i),
				(this.urlTree = o),
				(this.paramsInheritanceStrategy = s),
				(this.urlSerializer = a),
				(this.applyRedirects = new Zr(this.urlSerializer, this.urlTree)));
		}
		noMatchError(n) {
			return new E(4002, `'${n.segmentGroup}'`);
		}
		recognize() {
			let n = $o(this.urlTree.root, [], [], this.config).segmentGroup;
			return this.match(n).pipe(
				S(({ children: e, rootSnapshot: r }) => {
					let i = new V(r, e),
						o = new kt("", i),
						s = ts(r, [], this.urlTree.queryParams, this.urlTree.fragment);
					return (
						(s.queryParams = this.urlTree.queryParams),
						(o.url = this.urlSerializer.serialize(s)),
						{ state: o, tree: s }
					);
				}),
			);
		}
		match(n) {
			let e = new Ne(
				[],
				Object.freeze({}),
				Object.freeze(h({}, this.urlTree.queryParams)),
				this.urlTree.fragment,
				Object.freeze({}),
				v,
				this.rootComponentType,
				null,
				{},
			);
			return this.processSegmentGroup(this.injector, this.config, n, v, e).pipe(
				S((r) => ({ children: r, rootSnapshot: e })),
				Ae((r) => {
					if (r instanceof Bt)
						return ((this.urlTree = r.urlTree), this.match(r.urlTree.root));
					throw r instanceof Ut ? this.noMatchError(r) : r;
				}),
			);
		}
		processSegmentGroup(n, e, r, i, o) {
			return r.segments.length === 0 && r.hasChildren()
				? this.processChildren(n, e, r, o)
				: this.processSegment(n, e, r, r.segments, i, !0, o).pipe(
						S((s) => (s instanceof V ? [s] : [])),
					);
		}
		processChildren(n, e, r, i) {
			let o = [];
			for (let s of Object.keys(r.children))
				s === "primary" ? o.unshift(s) : o.push(s);
			return L(o).pipe(
				de((s) => {
					let a = r.children[s],
						u = Tu(e, s);
					return this.processSegmentGroup(n, u, a, s, i);
				}),
				mi((s, a) => (s.push(...a), s)),
				er(null),
				gi(),
				B((s) => {
					if (s === null) return Xe(r);
					let a = ms(s);
					return (hc(a), f(a));
				}),
			);
		}
		processSegment(n, e, r, i, o, s, a) {
			return L(e).pipe(
				de((u) =>
					this.processSegmentAgainstRoute(
						u._injector ?? n,
						e,
						u,
						r,
						i,
						o,
						s,
						a,
					).pipe(
						Ae((c) => {
							if (c instanceof Ut) return f(null);
							throw c;
						}),
					),
				),
				ve((u) => !!u),
				Ae((u) => {
					if (fs(u)) return cc(r, i, o) ? f(new Kr()) : Xe(r);
					throw u;
				}),
			);
		}
		processSegmentAgainstRoute(n, e, r, i, o, s, a, u) {
			return ee(r) !== s && (s === v || !Hn(i, o, r))
				? Xe(i)
				: r.redirectTo === void 0
					? this.matchSegmentAgainstRoute(n, i, r, o, s, u)
					: this.allowRedirects && a
						? this.expandSegmentAgainstRouteUsingRedirect(n, i, e, r, o, s, u)
						: Xe(i);
		}
		expandSegmentAgainstRouteUsingRedirect(n, e, r, i, o, s, a) {
			let {
				matched: u,
				parameters: c,
				consumedSegments: l,
				positionalParamSegments: m,
				remainingSegments: y,
			} = gs(e, i, o);
			if (!u) return Xe(e);
			typeof i.redirectTo == "string" &&
				i.redirectTo[0] === "/" &&
				(this.absoluteRedirectCount++,
				this.absoluteRedirectCount > dc && (this.allowRedirects = !1));
			let b = new Ne(
					o,
					c,
					Object.freeze(h({}, this.urlTree.queryParams)),
					this.urlTree.fragment,
					zo(i),
					ee(i),
					i.component ?? i._loadedComponent ?? null,
					i,
					Vo(i),
				),
				_ = jn(b, a, this.paramsInheritanceStrategy);
			((b.params = Object.freeze(_.params)), (b.data = Object.freeze(_.data)));
			let w = this.applyRedirects.applyRedirectCommands(
				l,
				i.redirectTo,
				m,
				b,
				n,
			);
			return this.applyRedirects
				.lineralizeSegments(i, w)
				.pipe(B((C) => this.processSegment(n, r, e, C.concat(y), s, !1, a)));
		}
		matchSegmentAgainstRoute(n, e, r, i, o, s) {
			let a = rc(e, r, i, n, this.urlSerializer);
			return (
				r.path === "**" && (e.children = {}),
				a.pipe(
					z((u) =>
						u.matched
							? ((n = r._injector ?? n),
								this.getChildConfig(n, r, i).pipe(
									z(({ routes: c }) => {
										let l = r._loadedInjector ?? n,
											{
												parameters: m,
												consumedSegments: y,
												remainingSegments: b,
											} = u,
											_ = new Ne(
												y,
												m,
												Object.freeze(h({}, this.urlTree.queryParams)),
												this.urlTree.fragment,
												zo(r),
												ee(r),
												r.component ?? r._loadedComponent ?? null,
												r,
												Vo(r),
											),
											w = jn(_, s, this.paramsInheritanceStrategy);
										((_.params = Object.freeze(w.params)),
											(_.data = Object.freeze(w.data)));
										let { segmentGroup: C, slicedSegments: te } = $o(
											e,
											y,
											b,
											c,
										);
										if (te.length === 0 && C.hasChildren())
											return this.processChildren(l, c, C, _).pipe(
												S((P) => new V(_, P)),
											);
										if (c.length === 0 && te.length === 0)
											return f(new V(_, []));
										let qt = ee(r) === o;
										return this.processSegment(
											l,
											c,
											C,
											te,
											qt ? v : o,
											!0,
											_,
										).pipe(S((P) => new V(_, P instanceof V ? [P] : [])));
									}),
								))
							: Xe(e),
					),
				)
			);
		}
		getChildConfig(n, e, r) {
			return e.children
				? f({ routes: e.children, injector: n })
				: e.loadChildren
					? e._loadedRoutes !== void 0
						? f({ routes: e._loadedRoutes, injector: e._loadedInjector })
						: Qu(n, e, r, this.urlSerializer).pipe(
								B((i) =>
									i
										? this.configLoader.loadChildren(n, e).pipe(
												k((o) => {
													((e._loadedRoutes = o.routes),
														(e._loadedInjector = o.injector));
												}),
											)
										: nc(e),
								),
							)
					: f({ routes: [], injector: n });
		}
	};
function hc(t) {
	t.sort((n, e) =>
		n.value.outlet === v
			? -1
			: e.value.outlet === v
				? 1
				: n.value.outlet.localeCompare(e.value.outlet),
	);
}
function fc(t) {
	let n = t.value.routeConfig;
	return n && n.path === "";
}
function ms(t) {
	let n = [],
		e = new Set();
	for (let r of t) {
		if (!fc(r)) {
			n.push(r);
			continue;
		}
		let i = n.find((o) => r.value.routeConfig === o.value.routeConfig);
		i !== void 0 ? (i.children.push(...r.children), e.add(i)) : n.push(r);
	}
	for (let r of e) {
		let i = ms(r.children);
		n.push(new V(r.value, i));
	}
	return n.filter((r) => !e.has(r));
}
function zo(t) {
	return t.data || {};
}
function Vo(t) {
	return t.resolve || {};
}
function pc(t, n, e, r, i, o) {
	return B((s) =>
		lc(t, n, e, r, s.extractedUrl, i, o).pipe(
			S(({ state: a, tree: u }) =>
				U(h({}, s), { targetSnapshot: a, urlAfterRedirects: u }),
			),
		),
	);
}
function gc(t, n) {
	return B((e) => {
		let {
			targetSnapshot: r,
			guards: { canActivateChecks: i },
		} = e;
		if (!i.length) return f(e);
		let o = new Set(i.map((u) => u.route)),
			s = new Set();
		for (let u of o) if (!s.has(u)) for (let c of vs(u)) s.add(c);
		let a = 0;
		return L(s).pipe(
			de((u) =>
				o.has(u)
					? mc(u, r, t, n)
					: ((u.data = jn(u, u.parent, t).resolve), f(void 0)),
			),
			k(() => a++),
			tr(1),
			B((u) => (a === s.size ? f(e) : le)),
		);
	});
}
function vs(t) {
	let n = t.children.map((e) => vs(e)).flat();
	return [t, ...n];
}
function mc(t, n, e, r) {
	let i = t.routeConfig,
		o = t._resolve;
	return (
		i?.title !== void 0 && !us(i) && (o[jt] = i.title),
		vc(o, t, n, r).pipe(
			S(
				(s) => (
					(t._resolvedData = s),
					(t.data = jn(t, t.parent, e).resolve),
					null
				),
			),
		)
	);
}
function vc(t, n, e, r) {
	let i = Br(t);
	if (i.length === 0) return f({});
	let o = {};
	return L(i).pipe(
		B((s) =>
			Dc(t[s], n, e, r).pipe(
				ve(),
				k((a) => {
					if (a instanceof ot) throw $n(new Ee(), a);
					o[s] = a;
				}),
			),
		),
		tr(1),
		S(() => o),
		Ae((s) => (fs(s) ? le : ut(s))),
	);
}
function Dc(t, n, e, r) {
	let i = $t(n) ?? r,
		o = at(t, i),
		s = o.resolve ? o.resolve(n, e) : q(i, () => o(n, e));
	return be(s);
}
function xr(t) {
	return z((n) => {
		let e = t(n);
		return e ? L(e).pipe(S(() => n)) : f(n);
	});
}
var ri = (() => {
		class t {
			buildTitle(e) {
				let r,
					i = e.root;
				for (; i !== void 0; )
					((r = this.getResolvedTitleForRoute(i) ?? r),
						(i = i.children.find((o) => o.outlet === v)));
				return r;
			}
			getResolvedTitleForRoute(e) {
				return e.data[jt];
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = g({ token: t, factory: () => d(Ds), providedIn: "root" });
		}
		return t;
	})(),
	Ds = (() => {
		class t extends ri {
			title;
			constructor(e) {
				(super(), (this.title = e));
			}
			updateTitle(e) {
				let r = this.buildTitle(e);
				r !== void 0 && this.title.setTitle(r);
			}
			static ɵfac = function (r) {
				return new (r || t)(p(ko));
			};
			static ɵprov = g({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})(),
	Ue = new D("", { providedIn: "root", factory: () => ({}) }),
	Be = new D(""),
	Gn = (() => {
		class t {
			componentLoaders = new WeakMap();
			childrenLoaders = new WeakMap();
			onLoadStartListener;
			onLoadEndListener;
			compiler = d(ki);
			loadComponent(e) {
				if (this.componentLoaders.get(e)) return this.componentLoaders.get(e);
				if (e._loadedComponent) return f(e._loadedComponent);
				this.onLoadStartListener && this.onLoadStartListener(e);
				let r = be(e.loadComponent()).pipe(
						S(ws),
						k((o) => {
							(this.onLoadEndListener && this.onLoadEndListener(e),
								(e._loadedComponent = o));
						}),
						$e(() => {
							this.componentLoaders.delete(e);
						}),
					),
					i = new Xn(r, () => new K()).pipe(Kn());
				return (this.componentLoaders.set(e, i), i);
			}
			loadChildren(e, r) {
				if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
				if (r._loadedRoutes)
					return f({ routes: r._loadedRoutes, injector: r._loadedInjector });
				this.onLoadStartListener && this.onLoadStartListener(r);
				let o = ys(r, this.compiler, e, this.onLoadEndListener).pipe(
						$e(() => {
							this.childrenLoaders.delete(r);
						}),
					),
					s = new Xn(o, () => new K()).pipe(Kn());
				return (this.childrenLoaders.set(r, s), s);
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = g({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})();
function ys(t, n, e, r) {
	return be(t.loadChildren()).pipe(
		S(ws),
		B((i) =>
			i instanceof Ii || Array.isArray(i) ? f(i) : L(n.compileModuleAsync(i)),
		),
		S((i) => {
			r && r(t);
			let o,
				s,
				a = !1;
			return (
				Array.isArray(i)
					? ((s = i), (a = !0))
					: ((o = i.create(e).injector),
						(s = o.get(Be, [], { optional: !0, self: !0 }).flat())),
				{ routes: s.map(ni), injector: o }
			);
		}),
	);
}
function yc(t) {
	return t && typeof t == "object" && "default" in t;
}
function ws(t) {
	return yc(t) ? t.default : t;
}
var qn = (() => {
		class t {
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = g({ token: t, factory: () => d(wc), providedIn: "root" });
		}
		return t;
	})(),
	wc = (() => {
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
			static ɵprov = g({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})(),
	ii = new D(""),
	oi = new D("");
function Cs(t, n, e) {
	let r = t.get(oi),
		i = t.get(F);
	return t.get(he).runOutsideAngular(() => {
		if (!i.startViewTransition || r.skipNextTransition)
			return ((r.skipNextTransition = !1), new Promise((c) => setTimeout(c)));
		let o,
			s = new Promise((c) => {
				o = c;
			}),
			a = i.startViewTransition(() => (o(), Cc(t))),
			{ onViewTransitionCreated: u } = r;
		return (u && q(t, () => u({ transition: a, from: n, to: e })), s);
	});
}
function Cc(t) {
	return new Promise((n) => {
		bi({ read: () => setTimeout(n) }, { injector: t });
	});
}
var si = new D(""),
	Wn = (() => {
		class t {
			currentNavigation = null;
			currentTransition = null;
			lastSuccessfulNavigation = null;
			events = new K();
			transitionAbortSubject = new K();
			configLoader = d(Gn);
			environmentInjector = d(De);
			destroyRef = d(or);
			urlSerializer = d(ke);
			rootContexts = d(xe);
			location = d(ye);
			inputBindingEnabled = d(zt, { optional: !0 }) !== null;
			titleStrategy = d(ri);
			options = d(Ue, { optional: !0 }) || {};
			paramsInheritanceStrategy =
				this.options.paramsInheritanceStrategy || "emptyOnly";
			urlHandlingStrategy = d(qn);
			createViewTransition = d(ii, { optional: !0 });
			navigationErrorHandler = d(si, { optional: !0 });
			navigationId = 0;
			get hasRequestedNavigation() {
				return this.navigationId !== 0;
			}
			transitions;
			afterPreactivation = () => f(void 0);
			rootComponentType = null;
			destroyed = !1;
			constructor() {
				let e = (i) => this.events.next(new On(i)),
					r = (i) => this.events.next(new Pn(i));
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
					U(h({}, e), {
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
					(this.transitions = new G(null)),
					this.transitions.pipe(
						ne((r) => r !== null),
						z((r) => {
							let i = !1,
								o = !1;
							return f(r).pipe(
								z((s) => {
									if (this.navigationId > r.id)
										return (
											this.cancelNavigationTransition(
												r,
												"",
												$.SupersededByNewNavigation,
											),
											le
										);
									((this.currentTransition = r),
										(this.currentNavigation = {
											id: s.id,
											initialUrl: s.rawUrl,
											extractedUrl: s.extractedUrl,
											targetBrowserUrl:
												typeof s.extras.browserUrl == "string"
													? this.urlSerializer.parse(s.extras.browserUrl)
													: s.extras.browserUrl,
											trigger: s.source,
											extras: s.extras,
											previousNavigation: this.lastSuccessfulNavigation
												? U(h({}, this.lastSuccessfulNavigation), {
														previousNavigation: null,
													})
												: null,
										}));
									let a =
											!e.navigated ||
											this.isUpdatingInternalState() ||
											this.isUpdatedBrowserUrl(),
										u = s.extras.onSameUrlNavigation ?? e.onSameUrlNavigation;
									if (!a && u !== "reload") {
										let c = "";
										return (
											this.events.next(
												new ae(
													s.id,
													this.urlSerializer.serialize(s.rawUrl),
													c,
													tt.IgnoredSameUrlNavigation,
												),
											),
											s.resolve(!1),
											le
										);
									}
									if (this.urlHandlingStrategy.shouldProcessUrl(s.rawUrl))
										return f(s).pipe(
											z(
												(c) => (
													this.events.next(
														new Re(
															c.id,
															this.urlSerializer.serialize(c.extractedUrl),
															c.source,
															c.restoredState,
														),
													),
													c.id !== this.navigationId ? le : Promise.resolve(c)
												),
											),
											pc(
												this.environmentInjector,
												this.configLoader,
												this.rootComponentType,
												e.config,
												this.urlSerializer,
												this.paramsInheritanceStrategy,
											),
											k((c) => {
												((r.targetSnapshot = c.targetSnapshot),
													(r.urlAfterRedirects = c.urlAfterRedirects),
													(this.currentNavigation = U(
														h({}, this.currentNavigation),
														{ finalUrl: c.urlAfterRedirects },
													)));
												let l = new Pt(
													c.id,
													this.urlSerializer.serialize(c.extractedUrl),
													this.urlSerializer.serialize(c.urlAfterRedirects),
													c.targetSnapshot,
												);
												this.events.next(l);
											}),
										);
									if (
										a &&
										this.urlHandlingStrategy.shouldProcessUrl(s.currentRawUrl)
									) {
										let {
												id: c,
												extractedUrl: l,
												source: m,
												restoredState: y,
												extras: b,
											} = s,
											_ = new Re(c, this.urlSerializer.serialize(l), m, y);
										this.events.next(_);
										let w = ss(this.rootComponentType).snapshot;
										return (
											(this.currentTransition = r =
												U(h({}, s), {
													targetSnapshot: w,
													urlAfterRedirects: l,
													extras: U(h({}, b), {
														skipLocationChange: !1,
														replaceUrl: !1,
													}),
												})),
											(this.currentNavigation.finalUrl = l),
											f(r)
										);
									} else {
										let c = "";
										return (
											this.events.next(
												new ae(
													s.id,
													this.urlSerializer.serialize(s.extractedUrl),
													c,
													tt.IgnoredByUrlHandlingStrategy,
												),
											),
											s.resolve(!1),
											le
										);
									}
								}),
								k((s) => {
									let a = new _n(
										s.id,
										this.urlSerializer.serialize(s.extractedUrl),
										this.urlSerializer.serialize(s.urlAfterRedirects),
										s.targetSnapshot,
									);
									this.events.next(a);
								}),
								S(
									(s) => (
										(this.currentTransition = r =
											U(h({}, s), {
												guards: Nu(
													s.targetSnapshot,
													s.currentSnapshot,
													this.rootContexts,
												),
											})),
										r
									),
								),
								Gu(this.environmentInjector, (s) => this.events.next(s)),
								k((s) => {
									if (
										((r.guardsResult = s.guardsResult),
										s.guardsResult && typeof s.guardsResult != "boolean")
									)
										throw $n(this.urlSerializer, s.guardsResult);
									let a = new In(
										s.id,
										this.urlSerializer.serialize(s.extractedUrl),
										this.urlSerializer.serialize(s.urlAfterRedirects),
										s.targetSnapshot,
										!!s.guardsResult,
									);
									this.events.next(a);
								}),
								ne((s) =>
									s.guardsResult
										? !0
										: (this.cancelNavigationTransition(s, "", $.GuardRejected),
											!1),
								),
								xr((s) => {
									if (s.guards.canActivateChecks.length !== 0)
										return f(s).pipe(
											k((a) => {
												let u = new Mn(
													a.id,
													this.urlSerializer.serialize(a.extractedUrl),
													this.urlSerializer.serialize(a.urlAfterRedirects),
													a.targetSnapshot,
												);
												this.events.next(u);
											}),
											z((a) => {
												let u = !1;
												return f(a).pipe(
													gc(
														this.paramsInheritanceStrategy,
														this.environmentInjector,
													),
													k({
														next: () => (u = !0),
														complete: () => {
															u ||
																this.cancelNavigationTransition(
																	a,
																	"",
																	$.NoDataFromResolver,
																);
														},
													}),
												);
											}),
											k((a) => {
												let u = new Fn(
													a.id,
													this.urlSerializer.serialize(a.extractedUrl),
													this.urlSerializer.serialize(a.urlAfterRedirects),
													a.targetSnapshot,
												);
												this.events.next(u);
											}),
										);
								}),
								xr((s) => {
									let a = (u) => {
										let c = [];
										u.routeConfig?.loadComponent &&
											!u.routeConfig._loadedComponent &&
											c.push(
												this.configLoader.loadComponent(u.routeConfig).pipe(
													k((l) => {
														u.component = l;
													}),
													S(() => {}),
												),
											);
										for (let l of u.children) c.push(...a(l));
										return c;
									};
									return Wt(a(s.targetSnapshot.root)).pipe(er(null), je(1));
								}),
								xr(() => this.afterPreactivation()),
								z(() => {
									let { currentSnapshot: s, targetSnapshot: a } = r,
										u = this.createViewTransition?.(
											this.environmentInjector,
											s.root,
											a.root,
										);
									return u ? L(u).pipe(S(() => r)) : f(r);
								}),
								S((s) => {
									let a = Iu(
										e.routeReuseStrategy,
										s.targetSnapshot,
										s.currentRouterState,
									);
									return (
										(this.currentTransition = r =
											U(h({}, s), { targetRouterState: a })),
										(this.currentNavigation.targetRouterState = a),
										r
									);
								}),
								k(() => {
									this.events.next(new Nt());
								}),
								Pu(
									this.rootContexts,
									e.routeReuseStrategy,
									(s) => this.events.next(s),
									this.inputBindingEnabled,
								),
								je(1),
								k({
									next: (s) => {
										((i = !0),
											(this.lastSuccessfulNavigation = this.currentNavigation),
											this.events.next(
												new Y(
													s.id,
													this.urlSerializer.serialize(s.extractedUrl),
													this.urlSerializer.serialize(s.urlAfterRedirects),
												),
											),
											this.titleStrategy?.updateTitle(
												s.targetRouterState.snapshot,
											),
											s.resolve(!0));
									},
									complete: () => {
										i = !0;
									},
								}),
								Di(
									this.transitionAbortSubject.pipe(
										k((s) => {
											throw s;
										}),
									),
								),
								$e(() => {
									(!i &&
										!o &&
										this.cancelNavigationTransition(
											r,
											"",
											$.SupersededByNewNavigation,
										),
										this.currentTransition?.id === r.id &&
											((this.currentNavigation = null),
											(this.currentTransition = null)));
								}),
								Ae((s) => {
									if (this.destroyed) return (r.resolve(!1), le);
									if (((o = !0), hs(s)))
										(this.events.next(
											new oe(
												r.id,
												this.urlSerializer.serialize(r.extractedUrl),
												s.message,
												s.cancellationCode,
											),
										),
											Ou(s)
												? this.events.next(
														new it(s.url, s.navigationBehaviorOptions),
													)
												: r.resolve(!1));
									else {
										let a = new nt(
											r.id,
											this.urlSerializer.serialize(r.extractedUrl),
											s,
											r.targetSnapshot ?? void 0,
										);
										try {
											let u = q(this.environmentInjector, () =>
												this.navigationErrorHandler?.(a),
											);
											if (u instanceof ot) {
												let { message: c, cancellationCode: l } = $n(
													this.urlSerializer,
													u,
												);
												(this.events.next(
													new oe(
														r.id,
														this.urlSerializer.serialize(r.extractedUrl),
														c,
														l,
													),
												),
													this.events.next(
														new it(u.redirectTo, u.navigationBehaviorOptions),
													));
											} else throw (this.events.next(a), s);
										} catch (u) {
											this.options.resolveNavigationPromiseOnError
												? r.resolve(!1)
												: r.reject(u);
										}
									}
									return le;
								}),
							);
						}),
					)
				);
			}
			cancelNavigationTransition(e, r, i) {
				let o = new oe(
					e.id,
					this.urlSerializer.serialize(e.extractedUrl),
					r,
					i,
				);
				(this.events.next(o), e.resolve(!1));
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
			static ɵprov = g({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})();
function Ec(t) {
	return t !== bn;
}
var Es = (() => {
		class t {
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = g({ token: t, factory: () => d(Sc), providedIn: "root" });
		}
		return t;
	})(),
	Vn = class {
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
	Sc = (() => {
		class t extends Vn {
			static ɵfac = (() => {
				let e;
				return function (i) {
					return (e || (e = rr(t)))(i || t);
				};
			})();
			static ɵprov = g({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})(),
	Ss = (() => {
		class t {
			urlSerializer = d(ke);
			options = d(Ue, { optional: !0 }) || {};
			canceledNavigationResolution =
				this.options.canceledNavigationResolution || "replace";
			location = d(ye);
			urlHandlingStrategy = d(qn);
			urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
			currentUrlTree = new se();
			getCurrentUrlTree() {
				return this.currentUrlTree;
			}
			rawUrlTree = this.currentUrlTree;
			getRawUrlTree() {
				return this.rawUrlTree;
			}
			createBrowserPath({ finalUrl: e, initialUrl: r, targetBrowserUrl: i }) {
				let o = e !== void 0 ? this.urlHandlingStrategy.merge(e, r) : r,
					s = i ?? o;
				return s instanceof se ? this.urlSerializer.serialize(s) : s;
			}
			commitTransition({ targetRouterState: e, finalUrl: r, initialUrl: i }) {
				r && e
					? ((this.currentUrlTree = r),
						(this.rawUrlTree = this.urlHandlingStrategy.merge(r, i)),
						(this.routerState = e))
					: (this.rawUrlTree = i);
			}
			routerState = ss(null);
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
			static ɵprov = g({ token: t, factory: () => d(Rc), providedIn: "root" });
		}
		return t;
	})(),
	Rc = (() => {
		class t extends Ss {
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
				e instanceof Re
					? this.updateStateMemento()
					: e instanceof ae
						? this.commitTransition(r)
						: e instanceof Pt
							? this.urlUpdateStrategy === "eager" &&
								(r.extras.skipLocationChange ||
									this.setBrowserUrl(this.createBrowserPath(r), r))
							: e instanceof Nt
								? (this.commitTransition(r),
									this.urlUpdateStrategy === "deferred" &&
										!r.extras.skipLocationChange &&
										this.setBrowserUrl(this.createBrowserPath(r), r))
								: e instanceof oe &&
									  (e.code === $.GuardRejected ||
											e.code === $.NoDataFromResolver)
									? this.restoreHistory(r)
									: e instanceof nt
										? this.restoreHistory(r, !0)
										: e instanceof Y &&
											((this.lastSuccessfulId = e.id),
											(this.currentPageId = this.browserPageId));
			}
			setBrowserUrl(e, { extras: r, id: i }) {
				let { replaceUrl: o, state: s } = r;
				if (this.location.isCurrentPathEqualTo(e) || o) {
					let a = this.browserPageId,
						u = h(h({}, s), this.generateNgRouterState(i, a));
					this.location.replaceState(e, "", u);
				} else {
					let a = h(
						h({}, s),
						this.generateNgRouterState(i, this.browserPageId + 1),
					);
					this.location.go(e, "", a);
				}
			}
			restoreHistory(e, r = !1) {
				if (this.canceledNavigationResolution === "computed") {
					let i = this.browserPageId,
						o = this.currentPageId - i;
					o !== 0
						? this.location.historyGo(o)
						: this.getCurrentUrlTree() === e.finalUrl &&
							o === 0 &&
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
					return (e || (e = rr(t)))(i || t);
				};
			})();
			static ɵprov = g({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})();
function Zn(t, n) {
	t.events
		.pipe(
			ne(
				(e) =>
					e instanceof Y ||
					e instanceof oe ||
					e instanceof nt ||
					e instanceof ae,
			),
			S((e) =>
				e instanceof Y || e instanceof ae
					? 0
					: (
								e instanceof oe
									? e.code === $.Redirect ||
										e.code === $.SupersededByNewNavigation
									: !1
						  )
						? 2
						: 1,
			),
			ne((e) => e !== 2),
			je(1),
		)
		.subscribe(() => {
			n();
		});
}
var bc = {
		paths: "exact",
		fragment: "ignored",
		matrixParams: "ignored",
		queryParams: "exact",
	},
	Ac = {
		paths: "subset",
		fragment: "ignored",
		matrixParams: "ignored",
		queryParams: "subset",
	},
	ce = (() => {
		class t {
			get currentUrlTree() {
				return this.stateManager.getCurrentUrlTree();
			}
			get rawUrlTree() {
				return this.stateManager.getRawUrlTree();
			}
			disposed = !1;
			nonRouterCurrentEntryChangeSubscription;
			console = d(Fi);
			stateManager = d(Ss);
			options = d(Ue, { optional: !0 }) || {};
			pendingTasks = d(Yt);
			urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
			navigationTransitions = d(Wn);
			urlSerializer = d(ke);
			location = d(ye);
			urlHandlingStrategy = d(qn);
			_events = new K();
			get events() {
				return this._events;
			}
			get routerState() {
				return this.stateManager.getRouterState();
			}
			navigated = !1;
			routeReuseStrategy = d(Es);
			onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore";
			config = d(Be, { optional: !0 })?.flat() ?? [];
			componentInputBindingEnabled = !!d(zt, { optional: !0 });
			constructor() {
				(this.resetConfig(this.config),
					this.navigationTransitions.setupNavigations(this).subscribe({
						error: (e) => {
							this.console.warn(e);
						},
					}),
					this.subscribeToNavigationEvents());
			}
			eventsSubscription = new ci();
			subscribeToNavigationEvents() {
				let e = this.navigationTransitions.events.subscribe((r) => {
					try {
						let i = this.navigationTransitions.currentTransition,
							o = this.navigationTransitions.currentNavigation;
						if (i !== null && o !== null) {
							if (
								(this.stateManager.handleRouterEvent(r, o),
								r instanceof oe &&
									r.code !== $.Redirect &&
									r.code !== $.SupersededByNewNavigation)
							)
								this.navigated = !0;
							else if (r instanceof Y) this.navigated = !0;
							else if (r instanceof it) {
								let s = r.navigationBehaviorOptions,
									a = this.urlHandlingStrategy.merge(r.url, i.currentRawUrl),
									u = h(
										{
											browserUrl: i.extras.browserUrl,
											info: i.extras.info,
											skipLocationChange: i.extras.skipLocationChange,
											replaceUrl:
												i.extras.replaceUrl ||
												this.urlUpdateStrategy === "eager" ||
												Ec(i.source),
										},
										s,
									);
								this.scheduleNavigation(a, bn, null, u, {
									resolve: i.resolve,
									reject: i.reject,
									promise: i.promise,
								});
							}
						}
						_c(r) && this._events.next(r);
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
							bn,
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
				let o = { replaceUrl: !0 },
					s = i?.navigationId ? i : null;
				if (i) {
					let u = h({}, i);
					(delete u.navigationId,
						delete u.ɵrouterPageId,
						Object.keys(u).length !== 0 && (o.state = u));
				}
				let a = this.parseUrl(e);
				this.scheduleNavigation(a, r, s, o);
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
				((this.config = e.map(ni)), (this.navigated = !1));
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
						queryParams: o,
						fragment: s,
						queryParamsHandling: a,
						preserveFragment: u,
					} = r,
					c = u ? this.currentUrlTree.fragment : s,
					l = null;
				switch (a ?? this.options.defaultQueryParamsHandling) {
					case "merge":
						l = h(h({}, this.currentUrlTree.queryParams), o);
						break;
					case "preserve":
						l = this.currentUrlTree.queryParams;
						break;
					default:
						l = o || null;
				}
				l !== null && (l = this.removeEmptyProps(l));
				let m;
				try {
					let y = i ? i.snapshot : this.routerState.snapshot.root;
					m = ns(y);
				} catch {
					((typeof e[0] != "string" || e[0][0] !== "/") && (e = []),
						(m = this.currentUrlTree.root));
				}
				return rs(m, e, l, c ?? null);
			}
			navigateByUrl(e, r = { skipLocationChange: !1 }) {
				let i = Se(e) ? e : this.parseUrl(e),
					o = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
				return this.scheduleNavigation(o, bn, null, r);
			}
			navigate(e, r = { skipLocationChange: !1 }) {
				return (Tc(e), this.navigateByUrl(this.createUrlTree(e, r), r));
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
					(r === !0 ? (i = h({}, bc)) : r === !1 ? (i = h({}, Ac)) : (i = r),
					Se(e))
				)
					return xo(this.currentUrlTree, e, i);
				let o = this.parseUrl(e);
				return xo(this.currentUrlTree, o, i);
			}
			removeEmptyProps(e) {
				return Object.entries(e).reduce(
					(r, [i, o]) => (o != null && (r[i] = o), r),
					{},
				);
			}
			scheduleNavigation(e, r, i, o, s) {
				if (this.disposed) return Promise.resolve(!1);
				let a, u, c;
				s
					? ((a = s.resolve), (u = s.reject), (c = s.promise))
					: (c = new Promise((m, y) => {
							((a = m), (u = y));
						}));
				let l = this.pendingTasks.add();
				return (
					Zn(this, () => {
						queueMicrotask(() => this.pendingTasks.remove(l));
					}),
					this.navigationTransitions.handleNavigationRequest({
						source: r,
						restoredState: i,
						currentUrlTree: this.currentUrlTree,
						currentRawUrl: this.currentUrlTree,
						rawUrl: e,
						extras: o,
						resolve: a,
						reject: u,
						promise: c,
						currentSnapshot: this.routerState.snapshot,
						currentRouterState: this.routerState,
					}),
					c.catch((m) => Promise.reject(m))
				);
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵprov = g({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})();
function Tc(t) {
	for (let n = 0; n < t.length; n++) if (t[n] == null) throw new E(4008, !1);
}
function _c(t) {
	return !(t instanceof Nt) && !(t instanceof it);
}
var Rs = (() => {
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
		onChanges = new K();
		constructor(e, r, i, o, s, a) {
			((this.router = e),
				(this.route = r),
				(this.tabIndexAttribute = i),
				(this.renderer = o),
				(this.el = s),
				(this.locationStrategy = a));
			let u = s.nativeElement.tagName?.toLowerCase();
			((this.isAnchorElement = u === "a" || u === "area"),
				this.isAnchorElement
					? (this.subscription = e.events.subscribe((c) => {
							c instanceof Y && this.updateHref();
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
				: (Se(e)
						? (this.routerLinkInput = e)
						: (this.routerLinkInput = Array.isArray(e) ? e : [e]),
					this.setTabIndexIfNotOnNativeEl("0"));
		}
		onClick(e, r, i, o, s) {
			let a = this.urlTree;
			if (
				a === null ||
				(this.isAnchorElement &&
					(e !== 0 ||
						r ||
						i ||
						o ||
						s ||
						(typeof this.target == "string" && this.target != "_self")))
			)
				return !0;
			let u = {
				skipLocationChange: this.skipLocationChange,
				replaceUrl: this.replaceUrl,
				state: this.state,
				info: this.info,
			};
			return (this.router.navigateByUrl(a, u), !this.isAnchorElement);
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
					: Ai(this.href, this.el.nativeElement.tagName.toLowerCase(), "href");
			this.applyAttributeValue("href", r);
		}
		applyAttributeValue(e, r) {
			let i = this.renderer,
				o = this.el.nativeElement;
			r !== null ? i.setAttribute(o, e, r) : i.removeAttribute(o, e);
		}
		get urlTree() {
			return this.routerLinkInput === null
				? null
				: Se(this.routerLinkInput)
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
			return new (r || t)(I(ce), I(ue), ir("tabindex"), I(qe), I(He), I(J));
		};
		static ɵdir = re({
			type: t,
			selectors: [["", "routerLink", ""]],
			hostVars: 1,
			hostBindings: function (r, i) {
				(r & 1 &&
					Li("click", function (s) {
						return i.onClick(
							s.button,
							s.ctrlKey,
							s.shiftKey,
							s.altKey,
							s.metaKey,
						);
					}),
					r & 2 && Pi("target", i.target));
			},
			inputs: {
				target: "target",
				queryParams: "queryParams",
				fragment: "fragment",
				queryParamsHandling: "queryParamsHandling",
				state: "state",
				info: "info",
				relativeTo: "relativeTo",
				preserveFragment: [2, "preserveFragment", "preserveFragment", ht],
				skipLocationChange: [2, "skipLocationChange", "skipLocationChange", ht],
				replaceUrl: [2, "replaceUrl", "replaceUrl", ht],
				routerLink: "routerLink",
			},
			features: [ze],
		});
	}
	return t;
})();
var Ht = class {};
var bs = (() => {
		class t {
			router;
			injector;
			preloadingStrategy;
			loader;
			subscription;
			constructor(e, r, i, o) {
				((this.router = e),
					(this.injector = r),
					(this.preloadingStrategy = i),
					(this.loader = o));
			}
			setUpPreloading() {
				this.subscription = this.router.events
					.pipe(
						ne((e) => e instanceof Y),
						de(() => this.preload()),
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
				for (let o of r) {
					o.providers &&
						!o._injector &&
						(o._injector = Kt(o.providers, e, `Route: ${o.path}`));
					let s = o._injector ?? e,
						a = o._loadedInjector ?? s;
					(((o.loadChildren && !o._loadedRoutes && o.canLoad === void 0) ||
						(o.loadComponent && !o._loadedComponent)) &&
						i.push(this.preloadConfig(s, o)),
						(o.children || o._loadedRoutes) &&
							i.push(this.processRoutes(a, o.children ?? o._loadedRoutes)));
				}
				return L(i).pipe(Jn());
			}
			preloadConfig(e, r) {
				return this.preloadingStrategy.preload(r, () => {
					let i;
					r.loadChildren && r.canLoad === void 0
						? (i = this.loader.loadChildren(e, r))
						: (i = f(null));
					let o = i.pipe(
						B((s) =>
							s === null
								? f(void 0)
								: ((r._loadedRoutes = s.routes),
									(r._loadedInjector = s.injector),
									this.processRoutes(s.injector ?? e, s.routes)),
						),
					);
					if (r.loadComponent && !r._loadedComponent) {
						let s = this.loader.loadComponent(r);
						return L([o, s]).pipe(Jn());
					} else return o;
				});
			}
			static ɵfac = function (r) {
				return new (r || t)(p(ce), p(De), p(Ht), p(Gn));
			};
			static ɵprov = g({ token: t, factory: t.ɵfac, providedIn: "root" });
		}
		return t;
	})(),
	As = new D(""),
	Ic = (() => {
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
			constructor(e, r, i, o, s = {}) {
				((this.urlSerializer = e),
					(this.transitions = r),
					(this.viewportScroller = i),
					(this.zone = o),
					(this.options = s),
					(s.scrollPositionRestoration ||= "disabled"),
					(s.anchorScrolling ||= "disabled"));
			}
			init() {
				(this.options.scrollPositionRestoration !== "disabled" &&
					this.viewportScroller.setHistoryScrollRestoration("manual"),
					(this.routerEventsSubscription = this.createScrollEvents()),
					(this.scrollEventsSubscription = this.consumeScrollEvents()));
			}
			createScrollEvents() {
				return this.transitions.events.subscribe((e) => {
					e instanceof Re
						? ((this.store[this.lastId] =
								this.viewportScroller.getScrollPosition()),
							(this.lastSource = e.navigationTrigger),
							(this.restoredId = e.restoredState
								? e.restoredState.navigationId
								: 0))
						: e instanceof Y
							? ((this.lastId = e.id),
								this.scheduleScrollEvent(
									e,
									this.urlSerializer.parse(e.urlAfterRedirects).fragment,
								))
							: e instanceof ae &&
								e.code === tt.IgnoredSameUrlNavigation &&
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
					e instanceof rt &&
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
								new rt(
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
				_i();
			};
			static ɵprov = g({ token: t, factory: t.ɵfac });
		}
		return t;
	})();
function Mc(t, ...n) {
	return Zt([
		{ provide: Be, multi: !0, useValue: t },
		[],
		{ provide: ue, useFactory: Ts, deps: [ce] },
		{ provide: pr, multi: !0, useFactory: _s },
		n.map((e) => e.ɵproviders),
	]);
}
function Ts(t) {
	return t.routerState.root;
}
function Gt(t, n) {
	return { ɵkind: t, ɵproviders: n };
}
function _s() {
	let t = d(ct);
	return (n) => {
		let e = t.get(Oi);
		if (n !== e.components[0]) return;
		let r = t.get(ce),
			i = t.get(Is);
		(t.get(ui) === 1 && r.initialNavigation(),
			t.get(Os, null, nr.Optional)?.setUpPreloading(),
			t.get(As, null, nr.Optional)?.init(),
			r.resetRootComponentType(e.componentTypes[0]),
			i.closed || (i.next(), i.complete(), i.unsubscribe()));
	};
}
var Is = new D("", { factory: () => new K() }),
	ui = new D("", { providedIn: "root", factory: () => 1 });
function Ms() {
	let t = [
		{ provide: ui, useValue: 0 },
		fr(() => {
			let n = d(ct);
			return n.get(mr, Promise.resolve()).then(
				() =>
					new Promise((r) => {
						let i = n.get(ce),
							o = n.get(Is);
						(Zn(i, () => {
							r(!0);
						}),
							(n.get(Wn).afterPreactivation = () => (
								r(!0),
								o.closed ? f(void 0) : o
							)),
							i.initialNavigation());
					}),
			);
		}),
	];
	return Gt(2, t);
}
function Fs() {
	let t = [
		fr(() => {
			d(ce).setUpLocationChangeListener();
		}),
		{ provide: ui, useValue: 2 },
	];
	return Gt(3, t);
}
var Os = new D("");
function Ps(t) {
	return Gt(0, [
		{ provide: Os, useExisting: bs },
		{ provide: Ht, useExisting: t },
	]);
}
function Ns() {
	return Gt(8, [ei, { provide: zt, useExisting: ei }]);
}
function Ls(t) {
	cr("NgRouterViewTransitions");
	let n = [
		{ provide: ii, useValue: Cs },
		{
			provide: oi,
			useValue: h({ skipNextTransition: !!t?.skipInitialTransition }, t),
		},
	];
	return Gt(9, n);
}
var ks = [
		ye,
		{ provide: ke, useClass: Ee },
		ce,
		xe,
		{ provide: ue, useFactory: Ts, deps: [ce] },
		Gn,
		[],
	],
	Fc = (() => {
		class t {
			constructor() {}
			static forRoot(e, r) {
				return {
					ngModule: t,
					providers: [
						ks,
						[],
						{ provide: Be, multi: !0, useValue: e },
						[],
						r?.errorHandler ? { provide: si, useValue: r.errorHandler } : [],
						{ provide: Ue, useValue: r || {} },
						r?.useHash ? Pc() : Nc(),
						Oc(),
						r?.preloadingStrategy ? Ps(r.preloadingStrategy).ɵproviders : [],
						r?.initialNavigation ? Lc(r) : [],
						r?.bindToComponentInputs ? Ns().ɵproviders : [],
						r?.enableViewTransitions ? Ls().ɵproviders : [],
						kc(),
					],
				};
			}
			static forChild(e) {
				return {
					ngModule: t,
					providers: [{ provide: Be, multi: !0, useValue: e }],
				};
			}
			static ɵfac = function (r) {
				return new (r || t)();
			};
			static ɵmod = Ie({ type: t });
			static ɵinj = Te({});
		}
		return t;
	})();
function Oc() {
	return {
		provide: As,
		useFactory: () => {
			let t = d(po),
				n = d(he),
				e = d(Ue),
				r = d(Wn),
				i = d(ke);
			return (
				e.scrollOffset && t.setOffset(e.scrollOffset),
				new Ic(i, r, t, n, e)
			);
		},
	};
}
function Pc() {
	return { provide: J, useClass: Cr };
}
function Nc() {
	return { provide: J, useClass: Qt };
}
function Lc(t) {
	return [
		t.initialNavigation === "disabled" ? Fs().ɵproviders : [],
		t.initialNavigation === "enabledBlocking" ? Ms().ɵproviders : [],
	];
}
var ai = new D("");
function kc() {
	return [
		{ provide: ai, useFactory: _s },
		{ provide: pr, multi: !0, useExisting: ai },
	];
}
var wf = { production: !1, apiUrl: "http://localhost:3000/api" };
export {
	F as a,
	fe as b,
	ea as c,
	ao as d,
	ta as e,
	na as f,
	ra as g,
	oa as h,
	aa as i,
	ho as j,
	ua as k,
	ln as l,
	Ir as m,
	Ra as n,
	we as o,
	Oo as p,
	Qa as q,
	eu as r,
	ue as s,
	Qr as t,
	ce as u,
	Rs as v,
	Mc as w,
	Fc as x,
	wf as y,
};
