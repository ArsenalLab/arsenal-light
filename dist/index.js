export { noSandbox } from './chunk-LX5WGPGN.js';
export { AgentSession, BobAcpSession, interactivePermissionHandler } from './chunk-MNYUFY6G.js';
import { parseAcpUpdate } from './chunk-236ZH5LO.js';
export { bob } from './chunk-236ZH5LO.js';
import { __export } from './chunk-PZ5AY32C.js';
import { writeFile, mkdir, readFile, rm, readdir, mkdtemp, stat, realpath } from 'fs/promises';
import path2, { join as join$1, normalize, basename, dirname, posix, relative, isAbsolute, resolve } from 'path';
import * as clack from '@clack/prompts';
import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { styleText } from 'util';
import { randomBytes } from 'crypto';
import { tmpdir, constants } from 'os';
import { PassThrough, Writable, Readable } from 'stream';
import { ndJsonStream, client } from '@agentclientprotocol/sdk';
import { execFile, exec, spawn } from 'child_process';

// node_modules/effect/dist/esm/Function.js
var isFunction = (input) => typeof input === "function";
var dual = function(arity, body) {
  if (typeof arity === "function") {
    return function() {
      if (arity(arguments)) {
        return body.apply(this, arguments);
      }
      return (self) => body(self, ...arguments);
    };
  }
  switch (arity) {
    case 0:
    case 1:
      throw new RangeError(`Invalid arity ${arity}`);
    case 2:
      return function(a, b) {
        if (arguments.length >= 2) {
          return body(a, b);
        }
        return function(self) {
          return body(self, a);
        };
      };
    case 3:
      return function(a, b, c) {
        if (arguments.length >= 3) {
          return body(a, b, c);
        }
        return function(self) {
          return body(self, a, b);
        };
      };
    case 4:
      return function(a, b, c, d) {
        if (arguments.length >= 4) {
          return body(a, b, c, d);
        }
        return function(self) {
          return body(self, a, b, c);
        };
      };
    case 5:
      return function(a, b, c, d, e) {
        if (arguments.length >= 5) {
          return body(a, b, c, d, e);
        }
        return function(self) {
          return body(self, a, b, c, d);
        };
      };
    default:
      return function() {
        if (arguments.length >= arity) {
          return body.apply(this, arguments);
        }
        const args2 = arguments;
        return function(self) {
          return body(self, ...args2);
        };
      };
  }
};
var identity = (a) => a;
var constant = (value) => () => value;
var constTrue = /* @__PURE__ */ constant(true);
var constFalse = /* @__PURE__ */ constant(false);
var constNull = /* @__PURE__ */ constant(null);
var constUndefined = /* @__PURE__ */ constant(void 0);
var constVoid = constUndefined;
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
  switch (arguments.length) {
    case 1:
      return a;
    case 2:
      return ab(a);
    case 3:
      return bc(ab(a));
    case 4:
      return cd(bc(ab(a)));
    case 5:
      return de(cd(bc(ab(a))));
    case 6:
      return ef(de(cd(bc(ab(a)))));
    case 7:
      return fg(ef(de(cd(bc(ab(a))))));
    case 8:
      return gh(fg(ef(de(cd(bc(ab(a)))))));
    case 9:
      return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
    default: {
      let ret = arguments[0];
      for (let i = 1; i < arguments.length; i++) {
        ret = arguments[i](ret);
      }
      return ret;
    }
  }
}

// node_modules/effect/dist/esm/Equivalence.js
var make = (isEquivalent) => (self, that) => self === that || isEquivalent(self, that);
var isStrictEquivalent = (x, y) => x === y;
var strict = () => isStrictEquivalent;
var number = /* @__PURE__ */ strict();
var mapInput = /* @__PURE__ */ dual(2, (self, f) => make((x, y) => self(f(x), f(y))));
var array = (item) => make((self, that) => {
  if (self.length !== that.length) {
    return false;
  }
  for (let i = 0; i < self.length; i++) {
    const isEq = item(self[i], that[i]);
    if (!isEq) {
      return false;
    }
  }
  return true;
});

// node_modules/effect/dist/esm/internal/doNotation.js
var let_ = (map25) => dual(3, (self, name, f) => map25(self, (a) => ({
  ...a,
  [name]: f(a)
})));
var bindTo = (map25) => dual(2, (self, name) => map25(self, (a) => ({
  [name]: a
})));
var bind = (map25, flatMap20) => dual(3, (self, name, f) => flatMap20(self, (a) => map25(f(a), (b) => ({
  ...a,
  [name]: b
}))));

// node_modules/effect/dist/esm/GlobalValue.js
var globalStoreId = `effect/GlobalValue`;
var globalStore;
var globalValue = (id3, compute) => {
  if (!globalStore) {
    globalThis[globalStoreId] ??= /* @__PURE__ */ new Map();
    globalStore = globalThis[globalStoreId];
  }
  if (!globalStore.has(id3)) {
    globalStore.set(id3, compute());
  }
  return globalStore.get(id3);
};

// node_modules/effect/dist/esm/Predicate.js
var isString = (input) => typeof input === "string";
var isNumber = (input) => typeof input === "number";
var isBoolean = (input) => typeof input === "boolean";
var isBigInt = (input) => typeof input === "bigint";
var isSymbol = (input) => typeof input === "symbol";
var isFunction2 = isFunction;
var isUndefined = (input) => input === void 0;
var isNever = (_) => false;
var isRecordOrArray = (input) => typeof input === "object" && input !== null;
var isObject = (input) => isRecordOrArray(input) || isFunction2(input);
var hasProperty = /* @__PURE__ */ dual(2, (self, property) => isObject(self) && property in self);
var isTagged = /* @__PURE__ */ dual(2, (self, tag2) => hasProperty(self, "_tag") && self["_tag"] === tag2);
var isNullable = (input) => input === null || input === void 0;
var isNotNullable = (input) => input !== null && input !== void 0;
var isDate = (input) => input instanceof Date;
var isIterable = (input) => typeof input === "string" || hasProperty(input, Symbol.iterator);
var isRecord = (input) => isRecordOrArray(input) && !Array.isArray(input);
var isPromiseLike = (input) => hasProperty(input, "then") && isFunction2(input.then);

// node_modules/effect/dist/esm/internal/errors.js
var getBugErrorMessage = (message) => `BUG: ${message} - please report an issue at https://github.com/Effect-TS/effect/issues`;

// node_modules/effect/dist/esm/Utils.js
var GenKindTypeId = /* @__PURE__ */ Symbol.for("effect/Gen/GenKind");
var isGenKind = (u) => isObject(u) && GenKindTypeId in u;
var GenKindImpl = class {
  value;
  constructor(value) {
    this.value = value;
  }
  /**
   * @since 2.0.0
   */
  get _F() {
    return identity;
  }
  /**
   * @since 2.0.0
   */
  get _R() {
    return (_) => _;
  }
  /**
   * @since 2.0.0
   */
  get _O() {
    return (_) => _;
  }
  /**
   * @since 2.0.0
   */
  get _E() {
    return (_) => _;
  }
  /**
   * @since 2.0.0
   */
  [GenKindTypeId] = GenKindTypeId;
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new SingleShotGen(this);
  }
};
var SingleShotGen = class _SingleShotGen {
  self;
  called = false;
  constructor(self) {
    this.self = self;
  }
  /**
   * @since 2.0.0
   */
  next(a) {
    return this.called ? {
      value: a,
      done: true
    } : (this.called = true, {
      value: this.self,
      done: false
    });
  }
  /**
   * @since 2.0.0
   */
  return(a) {
    return {
      value: a,
      done: true
    };
  }
  /**
   * @since 2.0.0
   */
  throw(e) {
    throw e;
  }
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new _SingleShotGen(this.self);
  }
};
var adapter = () => function() {
  let x = arguments[0];
  for (let i = 1; i < arguments.length; i++) {
    x = arguments[i](x);
  }
  return new GenKindImpl(x);
};
var defaultIncHi = 335903614;
var defaultIncLo = 4150755663;
var MUL_HI = 1481765933 >>> 0;
var MUL_LO = 1284865837 >>> 0;
var BIT_53 = 9007199254740992;
var BIT_27 = 134217728;
var PCGRandom = class {
  _state;
  constructor(seedHi, seedLo, incHi, incLo) {
    if (isNullable(seedLo) && isNullable(seedHi)) {
      seedLo = Math.random() * 4294967295 >>> 0;
      seedHi = 0;
    } else if (isNullable(seedLo)) {
      seedLo = seedHi;
      seedHi = 0;
    }
    if (isNullable(incLo) && isNullable(incHi)) {
      incLo = this._state ? this._state[3] : defaultIncLo;
      incHi = this._state ? this._state[2] : defaultIncHi;
    } else if (isNullable(incLo)) {
      incLo = incHi;
      incHi = 0;
    }
    this._state = new Int32Array([0, 0, incHi >>> 0, ((incLo || 0) | 1) >>> 0]);
    this._next();
    add64(this._state, this._state[0], this._state[1], seedHi >>> 0, seedLo >>> 0);
    this._next();
    return this;
  }
  /**
   * Returns a copy of the internal state of this random number generator as a
   * JavaScript Array.
   *
   * @category getters
   * @since 2.0.0
   */
  getState() {
    return [this._state[0], this._state[1], this._state[2], this._state[3]];
  }
  /**
   * Restore state previously retrieved using `getState()`.
   *
   * @since 2.0.0
   */
  setState(state) {
    this._state[0] = state[0];
    this._state[1] = state[1];
    this._state[2] = state[2];
    this._state[3] = state[3] | 1;
  }
  /**
   * Get a uniformly distributed 32 bit integer between [0, max).
   *
   * @category getter
   * @since 2.0.0
   */
  integer(max6) {
    return Math.round(this.number() * Number.MAX_SAFE_INTEGER) % max6;
  }
  /**
   * Get a uniformly distributed IEEE-754 double between 0.0 and 1.0, with
   * 53 bits of precision (every bit of the mantissa is randomized).
   *
   * @category getters
   * @since 2.0.0
   */
  number() {
    const hi = (this._next() & 67108863) * 1;
    const lo = (this._next() & 134217727) * 1;
    return (hi * BIT_27 + lo) / BIT_53;
  }
  /** @internal */
  _next() {
    const oldHi = this._state[0] >>> 0;
    const oldLo = this._state[1] >>> 0;
    mul64(this._state, oldHi, oldLo, MUL_HI, MUL_LO);
    add64(this._state, this._state[0], this._state[1], this._state[2], this._state[3]);
    let xsHi = oldHi >>> 18;
    let xsLo = (oldLo >>> 18 | oldHi << 14) >>> 0;
    xsHi = (xsHi ^ oldHi) >>> 0;
    xsLo = (xsLo ^ oldLo) >>> 0;
    const xorshifted = (xsLo >>> 27 | xsHi << 5) >>> 0;
    const rot = oldHi >>> 27;
    const rot2 = (-rot >>> 0 & 31) >>> 0;
    return (xorshifted >>> rot | xorshifted << rot2) >>> 0;
  }
};
function mul64(out, aHi, aLo, bHi, bLo) {
  let c1 = (aLo >>> 16) * (bLo & 65535) >>> 0;
  let c0 = (aLo & 65535) * (bLo >>> 16) >>> 0;
  let lo = (aLo & 65535) * (bLo & 65535) >>> 0;
  let hi = (aLo >>> 16) * (bLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16)) >>> 0;
  c0 = c0 << 16 >>> 0;
  lo = lo + c0 >>> 0;
  if (lo >>> 0 < c0 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  c1 = c1 << 16 >>> 0;
  lo = lo + c1 >>> 0;
  if (lo >>> 0 < c1 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  hi = hi + Math.imul(aLo, bHi) >>> 0;
  hi = hi + Math.imul(aHi, bLo) >>> 0;
  out[0] = hi;
  out[1] = lo;
}
function add64(out, aHi, aLo, bHi, bLo) {
  let hi = aHi + bHi >>> 0;
  const lo = aLo + bLo >>> 0;
  if (lo >>> 0 < aLo >>> 0) {
    hi = hi + 1 | 0;
  }
  out[0] = hi;
  out[1] = lo;
}
var YieldWrapTypeId = /* @__PURE__ */ Symbol.for("effect/Utils/YieldWrap");
var YieldWrap = class {
  /**
   * @since 3.0.6
   */
  #value;
  constructor(value) {
    this.#value = value;
  }
  /**
   * @since 3.0.6
   */
  [YieldWrapTypeId]() {
    return this.#value;
  }
};
function yieldWrapGet(self) {
  if (typeof self === "object" && self !== null && YieldWrapTypeId in self) {
    return self[YieldWrapTypeId]();
  }
  throw new Error(getBugErrorMessage("yieldWrapGet"));
}
var structuralRegionState = /* @__PURE__ */ globalValue("effect/Utils/isStructuralRegion", () => ({
  enabled: false,
  tester: void 0
}));
var standard = {
  effect_internal_function: (body) => {
    return body();
  }
};
var forced = {
  effect_internal_function: (body) => {
    try {
      return body();
    } finally {
    }
  }
};
var isNotOptimizedAway = /* @__PURE__ */ standard.effect_internal_function(() => new Error().stack)?.includes("effect_internal_function") === true;
var internalCall = isNotOptimizedAway ? standard.effect_internal_function : forced.effect_internal_function;
var genConstructor = function* () {
}.constructor;
var isGeneratorFunction = (u) => isObject(u) && u.constructor === genConstructor;

// node_modules/effect/dist/esm/Hash.js
var randomHashCache = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap());
var symbol = /* @__PURE__ */ Symbol.for("effect/Hash");
var hash = (self) => {
  if (structuralRegionState.enabled === true) {
    return 0;
  }
  switch (typeof self) {
    case "number":
      return number2(self);
    case "bigint":
      return string(self.toString(10));
    case "boolean":
      return string(String(self));
    case "symbol":
      return string(String(self));
    case "string":
      return string(self);
    case "undefined":
      return string("undefined");
    case "function":
    case "object": {
      if (self === null) {
        return string("null");
      } else if (self instanceof Date) {
        if (Number.isNaN(self.getTime())) {
          return string("Invalid Date");
        }
        return hash(self.toISOString());
      } else if (self instanceof URL) {
        return hash(self.href);
      } else if (isHash(self)) {
        return self[symbol]();
      } else {
        return random(self);
      }
    }
    default:
      throw new Error(`BUG: unhandled typeof ${typeof self} - please report an issue at https://github.com/Effect-TS/effect/issues`);
  }
};
var random = (self) => {
  if (!randomHashCache.has(self)) {
    randomHashCache.set(self, number2(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)));
  }
  return randomHashCache.get(self);
};
var combine = (b) => (self) => self * 53 ^ b;
var optimize = (n) => n & 3221225471 | n >>> 1 & 1073741824;
var isHash = (u) => hasProperty(u, symbol);
var number2 = (n) => {
  if (n !== n || n === Infinity) {
    return 0;
  }
  let h = n | 0;
  if (h !== n) {
    h ^= n * 4294967295;
  }
  while (n > 4294967295) {
    h ^= n /= 4294967295;
  }
  return optimize(h);
};
var string = (str) => {
  let h = 5381, i = str.length;
  while (i) {
    h = h * 33 ^ str.charCodeAt(--i);
  }
  return optimize(h);
};
var structureKeys = (o, keys5) => {
  let h = 12289;
  for (let i = 0; i < keys5.length; i++) {
    h ^= pipe(string(keys5[i]), combine(hash(o[keys5[i]])));
  }
  return optimize(h);
};
var structure = (o) => structureKeys(o, Object.keys(o));
var array2 = (arr) => {
  let h = 6151;
  for (let i = 0; i < arr.length; i++) {
    h = pipe(h, combine(hash(arr[i])));
  }
  return optimize(h);
};
var cached = function() {
  if (arguments.length === 1) {
    const self2 = arguments[0];
    return function(hash3) {
      Object.defineProperty(self2, symbol, {
        value() {
          return hash3;
        },
        enumerable: false
      });
      return hash3;
    };
  }
  const self = arguments[0];
  const hash2 = arguments[1];
  Object.defineProperty(self, symbol, {
    value() {
      return hash2;
    },
    enumerable: false
  });
  return hash2;
};

// node_modules/effect/dist/esm/Equal.js
var symbol2 = /* @__PURE__ */ Symbol.for("effect/Equal");
function equals() {
  if (arguments.length === 1) {
    return (self) => compareBoth(self, arguments[0]);
  }
  return compareBoth(arguments[0], arguments[1]);
}
function compareBoth(self, that) {
  if (self === that) {
    return true;
  }
  const selfType = typeof self;
  if (selfType !== typeof that) {
    return false;
  }
  if (selfType === "object" || selfType === "function") {
    if (self !== null && that !== null) {
      if (isEqual(self) && isEqual(that)) {
        if (hash(self) === hash(that) && self[symbol2](that)) {
          return true;
        } else {
          return structuralRegionState.enabled && structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
        }
      } else if (self instanceof Date && that instanceof Date) {
        const t1 = self.getTime();
        const t2 = that.getTime();
        return t1 === t2 || Number.isNaN(t1) && Number.isNaN(t2);
      } else if (self instanceof URL && that instanceof URL) {
        return self.href === that.href;
      }
    }
    if (structuralRegionState.enabled) {
      if (Array.isArray(self) && Array.isArray(that)) {
        return self.length === that.length && self.every((v, i) => compareBoth(v, that[i]));
      }
      if (Object.getPrototypeOf(self) === Object.prototype && Object.getPrototypeOf(that) === Object.prototype) {
        const keysSelf = Object.keys(self);
        const keysThat = Object.keys(that);
        if (keysSelf.length === keysThat.length) {
          for (const key of keysSelf) {
            if (!(key in that && compareBoth(self[key], that[key]))) {
              return structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
            }
          }
          return true;
        }
      }
      return structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
    }
  }
  return structuralRegionState.enabled && structuralRegionState.tester ? structuralRegionState.tester(self, that) : false;
}
var isEqual = (u) => hasProperty(u, symbol2);
var equivalence = () => equals;

// node_modules/effect/dist/esm/Inspectable.js
var NodeInspectSymbol = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
var toJSON = (x) => {
  try {
    if (hasProperty(x, "toJSON") && isFunction2(x["toJSON"]) && x["toJSON"].length === 0) {
      return x.toJSON();
    } else if (Array.isArray(x)) {
      return x.map(toJSON);
    }
  } catch {
    return {};
  }
  return redact(x);
};
var CIRCULAR = "[Circular]";
function formatDate(date) {
  try {
    return date.toISOString();
  } catch {
    return "Invalid Date";
  }
}
function safeToString(input) {
  try {
    const s = input.toString();
    return typeof s === "string" ? s : String(s);
  } catch {
    return "[toString threw]";
  }
}
function formatPropertyKey(name) {
  return isString(name) ? JSON.stringify(name) : String(name);
}
function formatUnknown(input, options) {
  const seen = /* @__PURE__ */ new WeakSet();
  const wrap = (v, body) => {
    const ctor = v?.constructor;
    return ctor && ctor !== Object.prototype.constructor && ctor.name ? `${ctor.name}(${body})` : body;
  };
  const ownKeys = (o) => {
    try {
      return Reflect.ownKeys(o);
    } catch {
      return ["[ownKeys threw]"];
    }
  };
  function go2(v, d = 0) {
    if (Array.isArray(v)) {
      if (seen.has(v)) return CIRCULAR;
      seen.add(v);
      return `[${v.map((x) => go2(x, d)).join(",")}]`;
    }
    if (isDate(v)) return formatDate(v);
    if (hasProperty(v, "toString") && isFunction2(v["toString"]) && v["toString"] !== Object.prototype.toString && v["toString"] !== Array.prototype.toString) {
      const s = safeToString(v);
      if (v instanceof Error && v.cause) {
        return `${s} (cause: ${go2(v.cause, d)})`;
      }
      return s;
    }
    if (isString(v)) return JSON.stringify(v);
    if (isNumber(v) || v == null || isBoolean(v) || isSymbol(v)) return String(v);
    if (isBigInt(v)) return String(v) + "n";
    if (v instanceof Set || v instanceof Map) {
      if (seen.has(v)) return CIRCULAR;
      seen.add(v);
      return `${v.constructor.name}(${go2(Array.from(v), d)})`;
    }
    if (isObject(v)) {
      if (seen.has(v)) return CIRCULAR;
      seen.add(v);
      const keys5 = ownKeys(v);
      {
        const body2 = `{${keys5.map((k) => `${formatPropertyKey(k)}:${go2(v[k], d)}`).join(",")}}`;
        return wrap(v, body2);
      }
    }
    return String(v);
  }
  return go2(input, 0);
}
var format = (x) => JSON.stringify(x, null, 2);
var toStringUnknown = (u, whitespace = 2) => {
  if (typeof u === "string") {
    return u;
  }
  try {
    return typeof u === "object" ? stringifyCircular(u, whitespace) : String(u);
  } catch {
    return String(u);
  }
};
var stringifyCircular = (obj, whitespace) => {
  let cache = [];
  const retVal = JSON.stringify(obj, (_key, value) => typeof value === "object" && value !== null ? cache.includes(value) ? void 0 : cache.push(value) && (redactableState.fiberRefs !== void 0 && isRedactable(value) ? value[symbolRedactable](redactableState.fiberRefs) : value) : value, whitespace);
  cache = void 0;
  return retVal;
};
var symbolRedactable = /* @__PURE__ */ Symbol.for("effect/Inspectable/Redactable");
var isRedactable = (u) => typeof u === "object" && u !== null && symbolRedactable in u;
var redactableState = /* @__PURE__ */ globalValue("effect/Inspectable/redactableState", () => ({
  fiberRefs: void 0
}));
var withRedactableContext = (context7, f) => {
  const prev = redactableState.fiberRefs;
  redactableState.fiberRefs = context7;
  try {
    return f();
  } finally {
    redactableState.fiberRefs = prev;
  }
};
var redact = (u) => {
  if (isRedactable(u) && redactableState.fiberRefs !== void 0) {
    return u[symbolRedactable](redactableState.fiberRefs);
  }
  return u;
};

// node_modules/effect/dist/esm/Pipeable.js
var pipeArguments = (self, args2) => {
  switch (args2.length) {
    case 0:
      return self;
    case 1:
      return args2[0](self);
    case 2:
      return args2[1](args2[0](self));
    case 3:
      return args2[2](args2[1](args2[0](self)));
    case 4:
      return args2[3](args2[2](args2[1](args2[0](self))));
    case 5:
      return args2[4](args2[3](args2[2](args2[1](args2[0](self)))));
    case 6:
      return args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self))))));
    case 7:
      return args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self)))))));
    case 8:
      return args2[7](args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self))))))));
    case 9:
      return args2[8](args2[7](args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self)))))))));
    default: {
      let ret = self;
      for (let i = 0, len = args2.length; i < len; i++) {
        ret = args2[i](ret);
      }
      return ret;
    }
  }
};

// node_modules/effect/dist/esm/internal/opCodes/effect.js
var OP_ASYNC = "Async";
var OP_COMMIT = "Commit";
var OP_FAILURE = "Failure";
var OP_ON_FAILURE = "OnFailure";
var OP_ON_SUCCESS = "OnSuccess";
var OP_ON_SUCCESS_AND_FAILURE = "OnSuccessAndFailure";
var OP_SUCCESS = "Success";
var OP_SYNC = "Sync";
var OP_TAG = "Tag";
var OP_UPDATE_RUNTIME_FLAGS = "UpdateRuntimeFlags";
var OP_WHILE = "While";
var OP_ITERATOR = "Iterator";
var OP_WITH_RUNTIME = "WithRuntime";
var OP_YIELD = "Yield";
var OP_REVERT_FLAGS = "RevertFlags";

// node_modules/effect/dist/esm/internal/version.js
var moduleVersion = "3.20.0";
var getCurrentVersion = () => moduleVersion;

// node_modules/effect/dist/esm/internal/effectable.js
var EffectTypeId = /* @__PURE__ */ Symbol.for("effect/Effect");
var StreamTypeId = /* @__PURE__ */ Symbol.for("effect/Stream");
var SinkTypeId = /* @__PURE__ */ Symbol.for("effect/Sink");
var ChannelTypeId = /* @__PURE__ */ Symbol.for("effect/Channel");
var effectVariance = {
  /* c8 ignore next */
  _R: (_) => _,
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _,
  _V: /* @__PURE__ */ getCurrentVersion()
};
var sinkVariance = {
  /* c8 ignore next */
  _A: (_) => _,
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _L: (_) => _,
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _R: (_) => _
};
var channelVariance = {
  /* c8 ignore next */
  _Env: (_) => _,
  /* c8 ignore next */
  _InErr: (_) => _,
  /* c8 ignore next */
  _InElem: (_) => _,
  /* c8 ignore next */
  _InDone: (_) => _,
  /* c8 ignore next */
  _OutErr: (_) => _,
  /* c8 ignore next */
  _OutElem: (_) => _,
  /* c8 ignore next */
  _OutDone: (_) => _
};
var EffectPrototype = {
  [EffectTypeId]: effectVariance,
  [StreamTypeId]: effectVariance,
  [SinkTypeId]: sinkVariance,
  [ChannelTypeId]: channelVariance,
  [symbol2](that) {
    return this === that;
  },
  [symbol]() {
    return cached(this, random(this));
  },
  [Symbol.iterator]() {
    return new SingleShotGen(new YieldWrap(this));
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var StructuralPrototype = {
  [symbol]() {
    return cached(this, structure(this));
  },
  [symbol2](that) {
    const selfKeys = Object.keys(this);
    const thatKeys = Object.keys(that);
    if (selfKeys.length !== thatKeys.length) {
      return false;
    }
    for (const key of selfKeys) {
      if (!(key in that && equals(this[key], that[key]))) {
        return false;
      }
    }
    return true;
  }
};
var CommitPrototype = {
  ...EffectPrototype,
  _op: OP_COMMIT
};
var StructuralCommitPrototype = {
  ...CommitPrototype,
  ...StructuralPrototype
};
var Base = /* @__PURE__ */ (function() {
  function Base3() {
  }
  Base3.prototype = CommitPrototype;
  return Base3;
})();

// node_modules/effect/dist/esm/internal/option.js
var TypeId = /* @__PURE__ */ Symbol.for("effect/Option");
var CommonProto = {
  ...EffectPrototype,
  [TypeId]: {
    _A: (_) => _
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};
var SomeProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "Some",
  _op: "Some",
  [symbol2](that) {
    return isOption(that) && isSome(that) && equals(this.value, that.value);
  },
  [symbol]() {
    return cached(this, combine(hash(this._tag))(hash(this.value)));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: toJSON(this.value)
    };
  }
});
var NoneHash = /* @__PURE__ */ hash("None");
var NoneProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "None",
  _op: "None",
  [symbol2](that) {
    return isOption(that) && isNone(that);
  },
  [symbol]() {
    return NoneHash;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
});
var isOption = (input) => hasProperty(input, TypeId);
var isNone = (fa) => fa._tag === "None";
var isSome = (fa) => fa._tag === "Some";
var none = /* @__PURE__ */ Object.create(NoneProto);
var some = (value) => {
  const a = Object.create(SomeProto);
  a.value = value;
  return a;
};

// node_modules/effect/dist/esm/internal/either.js
var TypeId2 = /* @__PURE__ */ Symbol.for("effect/Either");
var CommonProto2 = {
  ...EffectPrototype,
  [TypeId2]: {
    _R: (_) => _
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};
var RightProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Right",
  _op: "Right",
  [symbol2](that) {
    return isEither(that) && isRight(that) && equals(this.right, that.right);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: toJSON(this.right)
    };
  }
});
var LeftProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Left",
  _op: "Left",
  [symbol2](that) {
    return isEither(that) && isLeft(that) && equals(this.left, that.left);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: toJSON(this.left)
    };
  }
});
var isEither = (input) => hasProperty(input, TypeId2);
var isLeft = (ma) => ma._tag === "Left";
var isRight = (ma) => ma._tag === "Right";
var left = (left3) => {
  const a = Object.create(LeftProto);
  a.left = left3;
  return a;
};
var right = (right3) => {
  const a = Object.create(RightProto);
  a.right = right3;
  return a;
};
var getLeft = (self) => isRight(self) ? none : some(self.left);
var getRight = (self) => isLeft(self) ? none : some(self.right);
var fromOption = /* @__PURE__ */ dual(2, (self, onNone) => isNone(self) ? left(onNone()) : right(self.value));

// node_modules/effect/dist/esm/Either.js
var right2 = right;
var left2 = left;
var fromOption2 = fromOption;
var isEither2 = isEither;
var isLeft2 = isLeft;
var isRight2 = isRight;
var mapLeft = /* @__PURE__ */ dual(2, (self, f) => isLeft2(self) ? left2(f(self.left)) : right2(self.right));
var map = /* @__PURE__ */ dual(2, (self, f) => isRight2(self) ? right2(f(self.right)) : left2(self.left));
var match = /* @__PURE__ */ dual(2, (self, {
  onLeft,
  onRight
}) => isLeft2(self) ? onLeft(self.left) : onRight(self.right));
var merge = /* @__PURE__ */ match({
  onLeft: identity,
  onRight: identity
});
var getOrThrowWith = /* @__PURE__ */ dual(2, (self, onLeft) => {
  if (isRight2(self)) {
    return self.right;
  }
  throw onLeft(self.left);
});
var getOrThrow = /* @__PURE__ */ getOrThrowWith(() => new Error("getOrThrow called on a Left"));
var all = (input) => {
  if (Symbol.iterator in input) {
    const out2 = [];
    for (const e of input) {
      if (isLeft2(e)) {
        return e;
      }
      out2.push(e.right);
    }
    return right2(out2);
  }
  const out = {};
  for (const key of Object.keys(input)) {
    const e = input[key];
    if (isLeft2(e)) {
      return e;
    }
    out[key] = e.right;
  }
  return right2(out);
};

// node_modules/effect/dist/esm/internal/array.js
var isNonEmptyArray = (self) => self.length > 0;

// node_modules/effect/dist/esm/Option.js
var Option_exports = {};
__export(Option_exports, {
  Do: () => Do,
  TypeId: () => TypeId3,
  all: () => all3,
  andThen: () => andThen,
  ap: () => ap,
  as: () => as,
  asVoid: () => asVoid,
  bind: () => bind2,
  bindTo: () => bindTo2,
  composeK: () => composeK,
  contains: () => contains,
  containsWith: () => containsWith,
  exists: () => exists,
  filter: () => filter,
  filterMap: () => filterMap,
  firstSomeOf: () => firstSomeOf,
  flatMap: () => flatMap,
  flatMapNullable: () => flatMapNullable,
  flatten: () => flatten,
  fromIterable: () => fromIterable,
  fromNullable: () => fromNullable,
  gen: () => gen,
  getEquivalence: () => getEquivalence,
  getLeft: () => getLeft2,
  getOrElse: () => getOrElse,
  getOrNull: () => getOrNull,
  getOrThrow: () => getOrThrow2,
  getOrThrowWith: () => getOrThrowWith2,
  getOrUndefined: () => getOrUndefined,
  getOrder: () => getOrder,
  getRight: () => getRight2,
  isNone: () => isNone2,
  isOption: () => isOption2,
  isSome: () => isSome2,
  let: () => let_2,
  lift2: () => lift2,
  liftNullable: () => liftNullable,
  liftPredicate: () => liftPredicate,
  liftThrowable: () => liftThrowable,
  map: () => map2,
  match: () => match2,
  mergeWith: () => mergeWith,
  none: () => none2,
  orElse: () => orElse,
  orElseEither: () => orElseEither,
  orElseSome: () => orElseSome,
  partitionMap: () => partitionMap,
  product: () => product,
  productMany: () => productMany,
  reduceCompact: () => reduceCompact,
  some: () => some2,
  tap: () => tap,
  toArray: () => toArray,
  toRefinement: () => toRefinement,
  void: () => void_,
  zipLeft: () => zipLeft,
  zipRight: () => zipRight,
  zipWith: () => zipWith
});

// node_modules/effect/dist/esm/Order.js
var make2 = (compare2) => (self, that) => self === that ? 0 : compare2(self, that);
var number3 = /* @__PURE__ */ make2((self, that) => self < that ? -1 : 1);
var mapInput2 = /* @__PURE__ */ dual(2, (self, f) => make2((b1, b2) => self(f(b1), f(b2))));
var all2 = (collection) => {
  return make2((x, y) => {
    const len = Math.min(x.length, y.length);
    let collectionLength = 0;
    for (const O of collection) {
      if (collectionLength >= len) {
        break;
      }
      const o = O(x[collectionLength], y[collectionLength]);
      if (o !== 0) {
        return o;
      }
      collectionLength++;
    }
    return 0;
  });
};
var tuple = (...elements) => all2(elements);
var lessThan = (O) => dual(2, (self, that) => O(self, that) === -1);
var greaterThan = (O) => dual(2, (self, that) => O(self, that) === 1);
var min = (O) => dual(2, (self, that) => self === that || O(self, that) < 1 ? self : that);
var max = (O) => dual(2, (self, that) => self === that || O(self, that) > -1 ? self : that);
var clamp = (O) => dual(2, (self, options) => min(O)(options.maximum, max(O)(options.minimum, self)));
var between = (O) => dual(2, (self, options) => !lessThan(O)(self, options.minimum) && !greaterThan(O)(self, options.maximum));

// node_modules/effect/dist/esm/Option.js
var TypeId3 = /* @__PURE__ */ Symbol.for("effect/Option");
var none2 = () => none;
var some2 = some;
var isOption2 = isOption;
var isNone2 = isNone;
var isSome2 = isSome;
var match2 = /* @__PURE__ */ dual(2, (self, {
  onNone,
  onSome
}) => isNone2(self) ? onNone() : onSome(self.value));
var toRefinement = (f) => (a) => isSome2(f(a));
var fromIterable = (collection) => {
  for (const a of collection) {
    return some2(a);
  }
  return none2();
};
var getRight2 = getRight;
var getLeft2 = getLeft;
var getOrElse = /* @__PURE__ */ dual(2, (self, onNone) => isNone2(self) ? onNone() : self.value);
var orElse = /* @__PURE__ */ dual(2, (self, that) => isNone2(self) ? that() : self);
var orElseSome = /* @__PURE__ */ dual(2, (self, onNone) => isNone2(self) ? some2(onNone()) : self);
var orElseEither = /* @__PURE__ */ dual(2, (self, that) => isNone2(self) ? map2(that(), right) : map2(self, left));
var firstSomeOf = (collection) => {
  let out = none2();
  for (out of collection) {
    if (isSome2(out)) {
      return out;
    }
  }
  return out;
};
var fromNullable = (nullableValue) => nullableValue == null ? none2() : some2(nullableValue);
var liftNullable = (f) => (...a) => fromNullable(f(...a));
var getOrNull = /* @__PURE__ */ getOrElse(constNull);
var getOrUndefined = /* @__PURE__ */ getOrElse(constUndefined);
var liftThrowable = (f) => (...a) => {
  try {
    return some2(f(...a));
  } catch {
    return none2();
  }
};
var getOrThrowWith2 = /* @__PURE__ */ dual(2, (self, onNone) => {
  if (isSome2(self)) {
    return self.value;
  }
  throw onNone();
});
var getOrThrow2 = /* @__PURE__ */ getOrThrowWith2(() => new Error("getOrThrow called on a None"));
var map2 = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : some2(f(self.value)));
var as = /* @__PURE__ */ dual(2, (self, b) => map2(self, () => b));
var asVoid = /* @__PURE__ */ as(void 0);
var void_ = /* @__PURE__ */ some2(void 0);
var flatMap = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : f(self.value));
var andThen = /* @__PURE__ */ dual(2, (self, f) => flatMap(self, (a) => {
  const b = isFunction(f) ? f(a) : f;
  return isOption2(b) ? b : some2(b);
}));
var flatMapNullable = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : fromNullable(f(self.value)));
var flatten = /* @__PURE__ */ flatMap(identity);
var zipRight = /* @__PURE__ */ dual(2, (self, that) => flatMap(self, () => that));
var zipLeft = /* @__PURE__ */ dual(2, (self, that) => tap(self, () => that));
var composeK = /* @__PURE__ */ dual(2, (afb, bfc) => (a) => flatMap(afb(a), bfc));
var tap = /* @__PURE__ */ dual(2, (self, f) => flatMap(self, (a) => map2(f(a), () => a)));
var product = (self, that) => isSome2(self) && isSome2(that) ? some2([self.value, that.value]) : none2();
var productMany = (self, collection) => {
  if (isNone2(self)) {
    return none2();
  }
  const out = [self.value];
  for (const o of collection) {
    if (isNone2(o)) {
      return none2();
    }
    out.push(o.value);
  }
  return some2(out);
};
var all3 = (input) => {
  if (Symbol.iterator in input) {
    const out2 = [];
    for (const o of input) {
      if (isNone2(o)) {
        return none2();
      }
      out2.push(o.value);
    }
    return some2(out2);
  }
  const out = {};
  for (const key of Object.keys(input)) {
    const o = input[key];
    if (isNone2(o)) {
      return none2();
    }
    out[key] = o.value;
  }
  return some2(out);
};
var zipWith = /* @__PURE__ */ dual(3, (self, that, f) => map2(product(self, that), ([a, b]) => f(a, b)));
var ap = /* @__PURE__ */ dual(2, (self, that) => zipWith(self, that, (f, a) => f(a)));
var reduceCompact = /* @__PURE__ */ dual(3, (self, b, f) => {
  let out = b;
  for (const oa of self) {
    if (isSome2(oa)) {
      out = f(out, oa.value);
    }
  }
  return out;
});
var toArray = (self) => isNone2(self) ? [] : [self.value];
var partitionMap = /* @__PURE__ */ dual(2, (self, f) => {
  if (isNone2(self)) {
    return [none2(), none2()];
  }
  const e = f(self.value);
  return isLeft(e) ? [some2(e.left), none2()] : [none2(), some2(e.right)];
});
var filterMap = flatMap;
var filter = /* @__PURE__ */ dual(2, (self, predicate) => filterMap(self, (b) => predicate(b) ? some(b) : none));
var getEquivalence = (isEquivalent) => make((x, y) => isNone2(x) ? isNone2(y) : isNone2(y) ? false : isEquivalent(x.value, y.value));
var getOrder = (O) => make2((self, that) => isSome2(self) ? isSome2(that) ? O(self.value, that.value) : 1 : -1);
var lift2 = (f) => dual(2, (self, that) => zipWith(self, that, f));
var liftPredicate = /* @__PURE__ */ dual(2, (b, predicate) => predicate(b) ? some2(b) : none2());
var containsWith = (isEquivalent) => dual(2, (self, a) => isNone2(self) ? false : isEquivalent(self.value, a));
var _equivalence = /* @__PURE__ */ equivalence();
var contains = /* @__PURE__ */ containsWith(_equivalence);
var exists = /* @__PURE__ */ dual(2, (self, refinement) => isNone2(self) ? false : refinement(self.value));
var bindTo2 = /* @__PURE__ */ bindTo(map2);
var let_2 = /* @__PURE__ */ let_(map2);
var bind2 = /* @__PURE__ */ bind(map2, flatMap);
var Do = /* @__PURE__ */ some2({});
var adapter2 = /* @__PURE__ */ adapter();
var gen = (...args2) => {
  const f = args2.length === 1 ? args2[0] : args2[1].bind(args2[0]);
  const iterator = f(adapter2);
  let state = iterator.next();
  while (!state.done) {
    const current = isGenKind(state.value) ? state.value.value : yieldWrapGet(state.value);
    if (isNone2(current)) {
      return current;
    }
    state = iterator.next(current.value);
  }
  return some2(state.value);
};
var mergeWith = (f) => (o1, o2) => {
  if (isNone2(o1)) {
    return o2;
  } else if (isNone2(o2)) {
    return o1;
  }
  return some2(f(o1.value, o2.value));
};

// node_modules/effect/dist/esm/Tuple.js
var make3 = (...elements) => elements;

// node_modules/effect/dist/esm/Array.js
var allocate = (n) => new Array(n);
var makeBy = /* @__PURE__ */ dual(2, (n, f) => {
  const max6 = Math.max(1, Math.floor(n));
  const out = new Array(max6);
  for (let i = 0; i < max6; i++) {
    out[i] = f(i);
  }
  return out;
});
var fromIterable2 = (collection) => Array.isArray(collection) ? collection : Array.from(collection);
var ensure = (self) => Array.isArray(self) ? self : [self];
var matchLeft = /* @__PURE__ */ dual(2, (self, {
  onEmpty,
  onNonEmpty
}) => isNonEmptyReadonlyArray(self) ? onNonEmpty(headNonEmpty(self), tailNonEmpty(self)) : onEmpty());
var prepend = /* @__PURE__ */ dual(2, (self, head6) => [head6, ...self]);
var append = /* @__PURE__ */ dual(2, (self, last5) => [...self, last5]);
var appendAll = /* @__PURE__ */ dual(2, (self, that) => fromIterable2(self).concat(fromIterable2(that)));
var isArray = Array.isArray;
var isEmptyArray = (self) => self.length === 0;
var isEmptyReadonlyArray = isEmptyArray;
var isNonEmptyArray2 = isNonEmptyArray;
var isNonEmptyReadonlyArray = isNonEmptyArray;
var isOutOfBounds = (i, as13) => i < 0 || i >= as13.length;
var clamp2 = (i, as13) => Math.floor(Math.min(Math.max(0, i), as13.length));
var get = /* @__PURE__ */ dual(2, (self, index) => {
  const i = Math.floor(index);
  return isOutOfBounds(i, self) ? none2() : some2(self[i]);
});
var unsafeGet = /* @__PURE__ */ dual(2, (self, index) => {
  const i = Math.floor(index);
  if (isOutOfBounds(i, self)) {
    throw new Error(`Index ${i} out of bounds`);
  }
  return self[i];
});
var head = /* @__PURE__ */ get(0);
var headNonEmpty = /* @__PURE__ */ unsafeGet(0);
var last = (self) => isNonEmptyReadonlyArray(self) ? some2(lastNonEmpty(self)) : none2();
var lastNonEmpty = (self) => self[self.length - 1];
var tailNonEmpty = (self) => self.slice(1);
var spanIndex = (self, predicate) => {
  let i = 0;
  for (const a of self) {
    if (!predicate(a, i)) {
      break;
    }
    i++;
  }
  return i;
};
var span = /* @__PURE__ */ dual(2, (self, predicate) => splitAt(self, spanIndex(self, predicate)));
var drop = /* @__PURE__ */ dual(2, (self, n) => {
  const input = fromIterable2(self);
  return input.slice(clamp2(n, input), input.length);
});
var reverse = (self) => Array.from(self).reverse();
var sort = /* @__PURE__ */ dual(2, (self, O) => {
  const out = Array.from(self);
  out.sort(O);
  return out;
});
var zip = /* @__PURE__ */ dual(2, (self, that) => zipWith2(self, that, make3));
var zipWith2 = /* @__PURE__ */ dual(3, (self, that, f) => {
  const as13 = fromIterable2(self);
  const bs = fromIterable2(that);
  if (isNonEmptyReadonlyArray(as13) && isNonEmptyReadonlyArray(bs)) {
    const out = [f(headNonEmpty(as13), headNonEmpty(bs))];
    const len = Math.min(as13.length, bs.length);
    for (let i = 1; i < len; i++) {
      out[i] = f(as13[i], bs[i]);
    }
    return out;
  }
  return [];
});
var _equivalence2 = /* @__PURE__ */ equivalence();
var splitAt = /* @__PURE__ */ dual(2, (self, n) => {
  const input = Array.from(self);
  const _n = Math.floor(n);
  if (isNonEmptyReadonlyArray(input)) {
    if (_n >= 1) {
      return splitNonEmptyAt(input, _n);
    }
    return [[], input];
  }
  return [input, []];
});
var splitNonEmptyAt = /* @__PURE__ */ dual(2, (self, n) => {
  const _n = Math.max(1, Math.floor(n));
  return _n >= self.length ? [copy(self), []] : [prepend(self.slice(1, _n), headNonEmpty(self)), self.slice(_n)];
});
var copy = (self) => self.slice();
var unionWith = /* @__PURE__ */ dual(3, (self, that, isEquivalent) => {
  const a = fromIterable2(self);
  const b = fromIterable2(that);
  if (isNonEmptyReadonlyArray(a)) {
    if (isNonEmptyReadonlyArray(b)) {
      const dedupe2 = dedupeWith(isEquivalent);
      return dedupe2(appendAll(a, b));
    }
    return a;
  }
  return b;
});
var union = /* @__PURE__ */ dual(2, (self, that) => unionWith(self, that, _equivalence2));
var empty = () => [];
var of = (a) => [a];
var map3 = /* @__PURE__ */ dual(2, (self, f) => self.map(f));
var flatMap2 = /* @__PURE__ */ dual(2, (self, f) => {
  if (isEmptyReadonlyArray(self)) {
    return [];
  }
  const out = [];
  for (let i = 0; i < self.length; i++) {
    const inner = f(self[i], i);
    for (let j = 0; j < inner.length; j++) {
      out.push(inner[j]);
    }
  }
  return out;
});
var flatten2 = /* @__PURE__ */ flatMap2(identity);
var filterMap2 = /* @__PURE__ */ dual(2, (self, f) => {
  const as13 = fromIterable2(self);
  const out = [];
  for (let i = 0; i < as13.length; i++) {
    const o = f(as13[i], i);
    if (isSome2(o)) {
      out.push(o.value);
    }
  }
  return out;
});
var partitionMap2 = /* @__PURE__ */ dual(2, (self, f) => {
  const left3 = [];
  const right3 = [];
  const as13 = fromIterable2(self);
  for (let i = 0; i < as13.length; i++) {
    const e = f(as13[i], i);
    if (isLeft2(e)) {
      left3.push(e.left);
    } else {
      right3.push(e.right);
    }
  }
  return [left3, right3];
});
var getSomes = /* @__PURE__ */ filterMap2(identity);
var filter2 = /* @__PURE__ */ dual(2, (self, predicate) => {
  const as13 = fromIterable2(self);
  const out = [];
  for (let i = 0; i < as13.length; i++) {
    if (predicate(as13[i], i)) {
      out.push(as13[i]);
    }
  }
  return out;
});
var reduce = /* @__PURE__ */ dual(3, (self, b, f) => fromIterable2(self).reduce((b2, a, i) => f(b2, a, i), b));
var reduceRight = /* @__PURE__ */ dual(3, (self, b, f) => fromIterable2(self).reduceRight((b2, a, i) => f(b2, a, i), b));
var unfold = (b, f) => {
  const out = [];
  let next4 = b;
  let o;
  while (isSome2(o = f(next4))) {
    const [a, b2] = o.value;
    out.push(a);
    next4 = b2;
  }
  return out;
};
var getEquivalence2 = array;
var dedupeWith = /* @__PURE__ */ dual(2, (self, isEquivalent) => {
  const input = fromIterable2(self);
  if (isNonEmptyReadonlyArray(input)) {
    const out = [headNonEmpty(input)];
    const rest = tailNonEmpty(input);
    for (const r of rest) {
      if (out.every((a) => !isEquivalent(r, a))) {
        out.push(r);
      }
    }
    return out;
  }
  return [];
});
var dedupe = (self) => dedupeWith(self, equivalence());
var join = /* @__PURE__ */ dual(2, (self, sep) => fromIterable2(self).join(sep));

// node_modules/effect/dist/esm/internal/schema/util.js
var getKeysForIndexSignature = (input, parameter) => {
  switch (parameter._tag) {
    case "StringKeyword":
    case "TemplateLiteral":
      return Object.keys(input);
    case "SymbolKeyword":
      return Object.getOwnPropertySymbols(input);
    case "Refinement":
      return getKeysForIndexSignature(input, parameter.from);
  }
};
var memoizeThunk = (f) => {
  let done10 = false;
  let a;
  return () => {
    if (done10) {
      return a;
    }
    a = f();
    done10 = true;
    return a;
  };
};
var isNonEmpty = (x) => Array.isArray(x);
var formatPathKey = (key) => `[${formatPropertyKey(key)}]`;
var formatPath = (path3) => isNonEmpty(path3) ? path3.map(formatPathKey).join("") : formatPathKey(path3);

// node_modules/effect/dist/esm/internal/schema/errors.js
var getErrorMessage = (reason, details, path3, ast) => {
  let out = reason;
  if (path3 && isNonEmptyReadonlyArray(path3)) {
    out += `
at path: ${formatPath(path3)}`;
  }
  if (details !== void 0) {
    out += `
details: ${details}`;
  }
  if (ast) {
    out += `
schema (${ast._tag}): ${ast}`;
  }
  return out;
};
var getSchemaExtendErrorMessage = (x, y, path3) => getErrorMessage("Unsupported schema or overlapping types", `cannot extend ${x} with ${y}`, path3);
var getASTUnsupportedKeySchemaErrorMessage = (ast) => getErrorMessage("Unsupported key schema", void 0, void 0, ast);
var getASTUnsupportedLiteralErrorMessage = (literal) => getErrorMessage("Unsupported literal", `literal value: ${formatUnknown(literal)}`);
var getASTDuplicateIndexSignatureErrorMessage = (type) => getErrorMessage("Duplicate index signature", `${type} index signature`);
var getASTIndexSignatureParameterErrorMessage = /* @__PURE__ */ getErrorMessage("Unsupported index signature parameter", "An index signature parameter type must be `string`, `symbol`, a template literal type or a refinement of the previous types");
var getASTRequiredElementFollowinAnOptionalElementErrorMessage = /* @__PURE__ */ getErrorMessage("Invalid element", "A required element cannot follow an optional element. ts(1257)");
var getASTDuplicatePropertySignatureTransformationErrorMessage = (key) => getErrorMessage("Duplicate property signature transformation", `Duplicate key ${formatUnknown(key)}`);
var getASTDuplicatePropertySignatureErrorMessage = (key) => getErrorMessage("Duplicate property signature", `Duplicate key ${formatUnknown(key)}`);

// node_modules/effect/dist/esm/Number.js
var Order = number3;

// node_modules/effect/dist/esm/RegExp.js
var escape = (string2) => string2.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&");

// node_modules/effect/dist/esm/SchemaAST.js
var TypeConstructorAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/TypeConstructor");
var BrandAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Brand");
var SchemaIdAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/SchemaId");
var MessageAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Message");
var MissingMessageAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/MissingMessage");
var IdentifierAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Identifier");
var TitleAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Title");
var AutoTitleAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/AutoTitle");
var DescriptionAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Description");
var ExamplesAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Examples");
var DefaultAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Default");
var JSONSchemaAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/JSONSchema");
var ArbitraryAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Arbitrary");
var PrettyAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Pretty");
var EquivalenceAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Equivalence");
var DocumentationAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Documentation");
var ConcurrencyAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Concurrency");
var BatchingAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Batching");
var ParseIssueTitleAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/ParseIssueTitle");
var ParseOptionsAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/ParseOptions");
var DecodingFallbackAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/DecodingFallback");
var SurrogateAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/Surrogate");
var StableFilterAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/StableFilter");
var getAnnotation = /* @__PURE__ */ dual(2, (annotated, key) => Object.prototype.hasOwnProperty.call(annotated.annotations, key) ? some2(annotated.annotations[key]) : none2());
var getBrandAnnotation = /* @__PURE__ */ getAnnotation(BrandAnnotationId);
var getMessageAnnotation = /* @__PURE__ */ getAnnotation(MessageAnnotationId);
var getMissingMessageAnnotation = /* @__PURE__ */ getAnnotation(MissingMessageAnnotationId);
var getTitleAnnotation = /* @__PURE__ */ getAnnotation(TitleAnnotationId);
var getAutoTitleAnnotation = /* @__PURE__ */ getAnnotation(AutoTitleAnnotationId);
var getIdentifierAnnotation = /* @__PURE__ */ getAnnotation(IdentifierAnnotationId);
var getDescriptionAnnotation = /* @__PURE__ */ getAnnotation(DescriptionAnnotationId);
var getConcurrencyAnnotation = /* @__PURE__ */ getAnnotation(ConcurrencyAnnotationId);
var getBatchingAnnotation = /* @__PURE__ */ getAnnotation(BatchingAnnotationId);
var getParseIssueTitleAnnotation = /* @__PURE__ */ getAnnotation(ParseIssueTitleAnnotationId);
var getParseOptionsAnnotation = /* @__PURE__ */ getAnnotation(ParseOptionsAnnotationId);
var getDecodingFallbackAnnotation = /* @__PURE__ */ getAnnotation(DecodingFallbackAnnotationId);
var getSurrogateAnnotation = /* @__PURE__ */ getAnnotation(SurrogateAnnotationId);
var getStableFilterAnnotation = /* @__PURE__ */ getAnnotation(StableFilterAnnotationId);
var hasStableFilter = (annotated) => exists(getStableFilterAnnotation(annotated), (b) => b === true);
var JSONIdentifierAnnotationId = /* @__PURE__ */ Symbol.for("effect/annotation/JSONIdentifier");
var getJSONIdentifierAnnotation = /* @__PURE__ */ getAnnotation(JSONIdentifierAnnotationId);
var getJSONIdentifier = (annotated) => orElse(getJSONIdentifierAnnotation(annotated), () => getIdentifierAnnotation(annotated));
var Declaration = class {
  typeParameters;
  decodeUnknown;
  encodeUnknown;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "Declaration";
  constructor(typeParameters, decodeUnknown3, encodeUnknown2, annotations2 = {}) {
    this.typeParameters = typeParameters;
    this.decodeUnknown = decodeUnknown3;
    this.encodeUnknown = encodeUnknown2;
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse(getExpected(this), () => "<declaration schema>");
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      typeParameters: this.typeParameters.map((ast) => ast.toJSON()),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var createASTGuard = (tag2) => (ast) => ast._tag === tag2;
var Literal = class {
  literal;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "Literal";
  constructor(literal, annotations2 = {}) {
    this.literal = literal;
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse(getExpected(this), () => formatUnknown(this.literal));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      literal: isBigInt(this.literal) ? String(this.literal) : this.literal,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var isLiteral = /* @__PURE__ */ createASTGuard("Literal");
var UniqueSymbol = class {
  symbol;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "UniqueSymbol";
  constructor(symbol3, annotations2 = {}) {
    this.symbol = symbol3;
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse(getExpected(this), () => formatUnknown(this.symbol));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      symbol: String(this.symbol),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var UndefinedKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "UndefinedKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var undefinedKeyword = /* @__PURE__ */ new UndefinedKeyword({
  [TitleAnnotationId]: "undefined"
});
var NeverKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "NeverKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var neverKeyword = /* @__PURE__ */ new NeverKeyword({
  [TitleAnnotationId]: "never"
});
var UnknownKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "UnknownKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var unknownKeyword = /* @__PURE__ */ new UnknownKeyword({
  [TitleAnnotationId]: "unknown"
});
var AnyKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "AnyKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var anyKeyword = /* @__PURE__ */ new AnyKeyword({
  [TitleAnnotationId]: "any"
});
var StringKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "StringKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var stringKeyword = /* @__PURE__ */ new StringKeyword({
  [TitleAnnotationId]: "string",
  [DescriptionAnnotationId]: "a string"
});
var isStringKeyword = /* @__PURE__ */ createASTGuard("StringKeyword");
var NumberKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "NumberKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var numberKeyword = /* @__PURE__ */ new NumberKeyword({
  [TitleAnnotationId]: "number",
  [DescriptionAnnotationId]: "a number"
});
var isNumberKeyword = /* @__PURE__ */ createASTGuard("NumberKeyword");
var BooleanKeyword = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "BooleanKeyword";
  constructor(annotations2 = {}) {
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return formatKeyword(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var booleanKeyword = /* @__PURE__ */ new BooleanKeyword({
  [TitleAnnotationId]: "boolean",
  [DescriptionAnnotationId]: "a boolean"
});
var isBooleanKeyword = /* @__PURE__ */ createASTGuard("BooleanKeyword");
var isSymbolKeyword = /* @__PURE__ */ createASTGuard("SymbolKeyword");
var Type = class {
  type;
  annotations;
  constructor(type, annotations2 = {}) {
    this.type = type;
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      type: this.type.toJSON(),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return String(this.type);
  }
};
var OptionalType = class extends Type {
  isOptional;
  constructor(type, isOptional, annotations2 = {}) {
    super(type, annotations2);
    this.isOptional = isOptional;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      type: this.type.toJSON(),
      isOptional: this.isOptional,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return String(this.type) + (this.isOptional ? "?" : "");
  }
};
var getRestASTs = (rest) => rest.map((annotatedAST) => annotatedAST.type);
var TupleType = class {
  elements;
  rest;
  isReadonly;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "TupleType";
  constructor(elements, rest, isReadonly, annotations2 = {}) {
    this.elements = elements;
    this.rest = rest;
    this.isReadonly = isReadonly;
    this.annotations = annotations2;
    let hasOptionalElement = false;
    let hasIllegalRequiredElement = false;
    for (const e of elements) {
      if (e.isOptional) {
        hasOptionalElement = true;
      } else if (hasOptionalElement) {
        hasIllegalRequiredElement = true;
        break;
      }
    }
    if (hasIllegalRequiredElement || hasOptionalElement && rest.length > 1) {
      throw new Error(getASTRequiredElementFollowinAnOptionalElementErrorMessage);
    }
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse(getExpected(this), () => formatTuple(this));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      elements: this.elements.map((e) => e.toJSON()),
      rest: this.rest.map((ast) => ast.toJSON()),
      isReadonly: this.isReadonly,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var formatTuple = (ast) => {
  const formattedElements = ast.elements.map(String).join(", ");
  return matchLeft(ast.rest, {
    onEmpty: () => `readonly [${formattedElements}]`,
    onNonEmpty: (head6, tail) => {
      const formattedHead = String(head6);
      const wrappedHead = formattedHead.includes(" | ") ? `(${formattedHead})` : formattedHead;
      if (tail.length > 0) {
        const formattedTail = tail.map(String).join(", ");
        if (ast.elements.length > 0) {
          return `readonly [${formattedElements}, ...${wrappedHead}[], ${formattedTail}]`;
        } else {
          return `readonly [...${wrappedHead}[], ${formattedTail}]`;
        }
      } else {
        if (ast.elements.length > 0) {
          return `readonly [${formattedElements}, ...${wrappedHead}[]]`;
        } else {
          return `ReadonlyArray<${formattedHead}>`;
        }
      }
    }
  });
};
var PropertySignature = class extends OptionalType {
  name;
  isReadonly;
  constructor(name, type, isOptional, isReadonly, annotations2) {
    super(type, isOptional, annotations2);
    this.name = name;
    this.isReadonly = isReadonly;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return (this.isReadonly ? "readonly " : "") + String(this.name) + (this.isOptional ? "?" : "") + ": " + this.type;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      name: String(this.name),
      type: this.type.toJSON(),
      isOptional: this.isOptional,
      isReadonly: this.isReadonly,
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var isParameter = (ast) => {
  switch (ast._tag) {
    case "StringKeyword":
    case "SymbolKeyword":
    case "TemplateLiteral":
      return true;
    case "Refinement":
      return isParameter(ast.from);
  }
  return false;
};
var IndexSignature = class {
  type;
  isReadonly;
  /**
   * @since 3.10.0
   */
  parameter;
  constructor(parameter, type, isReadonly) {
    this.type = type;
    this.isReadonly = isReadonly;
    if (isParameter(parameter)) {
      this.parameter = parameter;
    } else {
      throw new Error(getASTIndexSignatureParameterErrorMessage);
    }
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return (this.isReadonly ? "readonly " : "") + `[x: ${this.parameter}]: ${this.type}`;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      parameter: this.parameter.toJSON(),
      type: this.type.toJSON(),
      isReadonly: this.isReadonly
    };
  }
};
var TypeLiteral = class {
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "TypeLiteral";
  /**
   * @since 3.10.0
   */
  propertySignatures;
  /**
   * @since 3.10.0
   */
  indexSignatures;
  constructor(propertySignatures, indexSignatures, annotations2 = {}) {
    this.annotations = annotations2;
    const keys5 = {};
    for (let i = 0; i < propertySignatures.length; i++) {
      const name = propertySignatures[i].name;
      if (Object.prototype.hasOwnProperty.call(keys5, name)) {
        throw new Error(getASTDuplicatePropertySignatureErrorMessage(name));
      }
      keys5[name] = null;
    }
    const parameters = {
      string: false,
      symbol: false
    };
    for (let i = 0; i < indexSignatures.length; i++) {
      const encodedParameter = getEncodedParameter(indexSignatures[i].parameter);
      if (isStringKeyword(encodedParameter)) {
        if (parameters.string) {
          throw new Error(getASTDuplicateIndexSignatureErrorMessage("string"));
        }
        parameters.string = true;
      } else if (isSymbolKeyword(encodedParameter)) {
        if (parameters.symbol) {
          throw new Error(getASTDuplicateIndexSignatureErrorMessage("symbol"));
        }
        parameters.symbol = true;
      }
    }
    this.propertySignatures = propertySignatures;
    this.indexSignatures = indexSignatures;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse(getExpected(this), () => formatTypeLiteral(this));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      propertySignatures: this.propertySignatures.map((ps) => ps.toJSON()),
      indexSignatures: this.indexSignatures.map((ps) => ps.toJSON()),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var formatIndexSignatures = (iss) => iss.map(String).join("; ");
var formatTypeLiteral = (ast) => {
  if (ast.propertySignatures.length > 0) {
    const pss = ast.propertySignatures.map(String).join("; ");
    if (ast.indexSignatures.length > 0) {
      return `{ ${pss}; ${formatIndexSignatures(ast.indexSignatures)} }`;
    } else {
      return `{ ${pss} }`;
    }
  } else {
    if (ast.indexSignatures.length > 0) {
      return `{ ${formatIndexSignatures(ast.indexSignatures)} }`;
    } else {
      return "{}";
    }
  }
};
var isTypeLiteral = /* @__PURE__ */ createASTGuard("TypeLiteral");
var sortCandidates = /* @__PURE__ */ sort(/* @__PURE__ */ mapInput2(Order, (ast) => {
  switch (ast._tag) {
    case "AnyKeyword":
      return 0;
    case "UnknownKeyword":
      return 1;
    case "ObjectKeyword":
      return 2;
    case "StringKeyword":
    case "NumberKeyword":
    case "BooleanKeyword":
    case "BigIntKeyword":
    case "SymbolKeyword":
      return 3;
  }
  return 4;
}));
var literalMap = {
  string: "StringKeyword",
  number: "NumberKeyword",
  boolean: "BooleanKeyword",
  bigint: "BigIntKeyword"
};
var flatten3 = (candidates) => flatMap2(candidates, (ast) => isUnion(ast) ? flatten3(ast.types) : [ast]);
var unify = (candidates) => {
  const cs = sortCandidates(candidates);
  const out = [];
  const uniques = {};
  const literals = [];
  for (const ast of cs) {
    switch (ast._tag) {
      case "NeverKeyword":
        break;
      case "AnyKeyword":
        return [anyKeyword];
      case "UnknownKeyword":
        return [unknownKeyword];
      // uniques
      case "ObjectKeyword":
      case "UndefinedKeyword":
      case "VoidKeyword":
      case "StringKeyword":
      case "NumberKeyword":
      case "BooleanKeyword":
      case "BigIntKeyword":
      case "SymbolKeyword": {
        if (!uniques[ast._tag]) {
          uniques[ast._tag] = ast;
          out.push(ast);
        }
        break;
      }
      case "Literal": {
        const type = typeof ast.literal;
        switch (type) {
          case "string":
          case "number":
          case "bigint":
          case "boolean": {
            const _tag = literalMap[type];
            if (!uniques[_tag] && !literals.includes(ast.literal)) {
              literals.push(ast.literal);
              out.push(ast);
            }
            break;
          }
          // null
          case "object": {
            if (!literals.includes(ast.literal)) {
              literals.push(ast.literal);
              out.push(ast);
            }
            break;
          }
        }
        break;
      }
      case "UniqueSymbol": {
        if (!uniques["SymbolKeyword"] && !literals.includes(ast.symbol)) {
          literals.push(ast.symbol);
          out.push(ast);
        }
        break;
      }
      case "TupleType": {
        if (!uniques["ObjectKeyword"]) {
          out.push(ast);
        }
        break;
      }
      case "TypeLiteral": {
        if (ast.propertySignatures.length === 0 && ast.indexSignatures.length === 0) {
          if (!uniques["{}"]) {
            uniques["{}"] = ast;
            out.push(ast);
          }
        } else if (!uniques["ObjectKeyword"]) {
          out.push(ast);
        }
        break;
      }
      default:
        out.push(ast);
    }
  }
  return out;
};
var Union = class _Union {
  types;
  annotations;
  static make = (types, annotations2) => {
    return isMembers(types) ? new _Union(types, annotations2) : types.length === 1 ? types[0] : neverKeyword;
  };
  /** @internal */
  static unify = (candidates, annotations2) => {
    return _Union.make(unify(flatten3(candidates)), annotations2);
  };
  /**
   * @since 3.10.0
   */
  _tag = "Union";
  constructor(types, annotations2 = {}) {
    this.types = types;
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse(getExpected(this), () => this.types.map(String).join(" | "));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      types: this.types.map((ast) => ast.toJSON()),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var mapMembers = (members, f) => members.map(f);
var isMembers = (as13) => as13.length > 1;
var isUnion = /* @__PURE__ */ createASTGuard("Union");
var toJSONMemoMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Schema/AST/toJSONMemoMap"), () => /* @__PURE__ */ new WeakMap());
var Suspend = class {
  f;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "Suspend";
  constructor(f, annotations2 = {}) {
    this.f = f;
    this.annotations = annotations2;
    this.f = memoizeThunk(f);
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getExpected(this).pipe(orElse(() => flatMap(liftThrowable(this.f)(), (ast) => getExpected(ast))), getOrElse(() => "<suspended schema>"));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    const ast = this.f();
    let out = toJSONMemoMap.get(ast);
    if (out) {
      return out;
    }
    toJSONMemoMap.set(ast, {
      _tag: this._tag
    });
    out = {
      _tag: this._tag,
      ast: ast.toJSON(),
      annotations: toJSONAnnotations(this.annotations)
    };
    toJSONMemoMap.set(ast, out);
    return out;
  }
};
var Refinement = class {
  from;
  filter;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "Refinement";
  constructor(from, filter12, annotations2 = {}) {
    this.from = from;
    this.filter = filter12;
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getIdentifierAnnotation(this).pipe(getOrElse(() => match2(getOrElseExpected(this), {
      onNone: () => `{ ${this.from} | filter }`,
      onSome: (expected) => isRefinement(this.from) ? String(this.from) + " & " + expected : expected
    })));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      from: this.from.toJSON(),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var isRefinement = /* @__PURE__ */ createASTGuard("Refinement");
var defaultParseOption = {};
var Transformation = class {
  from;
  to;
  transformation;
  annotations;
  /**
   * @since 3.10.0
   */
  _tag = "Transformation";
  constructor(from, to, transformation, annotations2 = {}) {
    this.from = from;
    this.to = to;
    this.transformation = transformation;
    this.annotations = annotations2;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return getOrElse(getExpected(this), () => `(${String(this.from)} <-> ${String(this.to)})`);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      from: this.from.toJSON(),
      to: this.to.toJSON(),
      annotations: toJSONAnnotations(this.annotations)
    };
  }
};
var isTransformation = /* @__PURE__ */ createASTGuard("Transformation");
var FinalTransformation = class {
  decode;
  encode;
  /**
   * @since 3.10.0
   */
  _tag = "FinalTransformation";
  constructor(decode2, encode) {
    this.decode = decode2;
    this.encode = encode;
  }
};
var createTransformationGuard = (tag2) => (ast) => ast._tag === tag2;
var ComposeTransformation = class {
  /**
   * @since 3.10.0
   */
  _tag = "ComposeTransformation";
};
var composeTransformation = /* @__PURE__ */ new ComposeTransformation();
var PropertySignatureTransformation = class {
  from;
  to;
  decode;
  encode;
  constructor(from, to, decode2, encode) {
    this.from = from;
    this.to = to;
    this.decode = decode2;
    this.encode = encode;
  }
};
var TypeLiteralTransformation = class {
  propertySignatureTransformations;
  /**
   * @since 3.10.0
   */
  _tag = "TypeLiteralTransformation";
  constructor(propertySignatureTransformations) {
    this.propertySignatureTransformations = propertySignatureTransformations;
    const fromKeys = {};
    const toKeys = {};
    for (const pst of propertySignatureTransformations) {
      const from = pst.from;
      if (fromKeys[from]) {
        throw new Error(getASTDuplicatePropertySignatureTransformationErrorMessage(from));
      }
      fromKeys[from] = true;
      const to = pst.to;
      if (toKeys[to]) {
        throw new Error(getASTDuplicatePropertySignatureTransformationErrorMessage(to));
      }
      toKeys[to] = true;
    }
  }
};
var isTypeLiteralTransformation = /* @__PURE__ */ createTransformationGuard("TypeLiteralTransformation");
var annotations = (ast, overrides) => {
  const d = Object.getOwnPropertyDescriptors(ast);
  const base = {
    ...ast.annotations
  };
  delete base[IdentifierAnnotationId];
  const value = {
    ...base,
    ...overrides
  };
  const surrogate = getSurrogateAnnotation(ast);
  if (isSome2(surrogate)) {
    value[SurrogateAnnotationId] = annotations(surrogate.value, overrides);
  }
  d.annotations.value = value;
  return Object.create(Object.getPrototypeOf(ast), d);
};
var STRING_KEYWORD_PATTERN = "[\\s\\S]*?";
var NUMBER_KEYWORD_PATTERN = "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?";
var getTemplateLiteralSpanTypePattern = (type, capture2) => {
  switch (type._tag) {
    case "Literal":
      return escape(String(type.literal));
    case "StringKeyword":
      return STRING_KEYWORD_PATTERN;
    case "NumberKeyword":
      return NUMBER_KEYWORD_PATTERN;
    case "TemplateLiteral":
      return getTemplateLiteralPattern(type);
    case "Union":
      return type.types.map((type2) => getTemplateLiteralSpanTypePattern(type2)).join("|");
  }
};
var handleTemplateLiteralSpanTypeParens = (type, s, capture2, top) => {
  if (isUnion(type)) ; else {
    return s;
  }
  return `(${s})`;
};
var getTemplateLiteralPattern = (ast, capture2, top) => {
  let pattern2 = ``;
  if (ast.head !== "") {
    const head6 = escape(ast.head);
    pattern2 += head6;
  }
  for (const span4 of ast.spans) {
    const spanPattern = getTemplateLiteralSpanTypePattern(span4.type);
    pattern2 += handleTemplateLiteralSpanTypeParens(span4.type, spanPattern);
    if (span4.literal !== "") {
      const literal = escape(span4.literal);
      pattern2 += literal;
    }
  }
  return pattern2;
};
var getTemplateLiteralRegExp = (ast) => new RegExp(`^${getTemplateLiteralPattern(ast)}$`);
var record = (key, value) => {
  const propertySignatures = [];
  const indexSignatures = [];
  const go2 = (key2) => {
    switch (key2._tag) {
      case "NeverKeyword":
        break;
      case "StringKeyword":
      case "SymbolKeyword":
      case "TemplateLiteral":
      case "Refinement":
        indexSignatures.push(new IndexSignature(key2, value, true));
        break;
      case "Literal":
        if (isString(key2.literal) || isNumber(key2.literal)) {
          propertySignatures.push(new PropertySignature(key2.literal, value, false, true));
        } else {
          throw new Error(getASTUnsupportedLiteralErrorMessage(key2.literal));
        }
        break;
      case "Enums": {
        for (const [_, name] of key2.enums) {
          propertySignatures.push(new PropertySignature(name, value, false, true));
        }
        break;
      }
      case "UniqueSymbol":
        propertySignatures.push(new PropertySignature(key2.symbol, value, false, true));
        break;
      case "Union":
        key2.types.forEach(go2);
        break;
      default:
        throw new Error(getASTUnsupportedKeySchemaErrorMessage(key2));
    }
  };
  go2(key);
  return {
    propertySignatures,
    indexSignatures
  };
};
var pickAnnotations = (annotationIds) => (annotated) => {
  let out = void 0;
  for (const id3 of annotationIds) {
    if (Object.prototype.hasOwnProperty.call(annotated.annotations, id3)) {
      if (out === void 0) {
        out = {};
      }
      out[id3] = annotated.annotations[id3];
    }
  }
  return out;
};
var omitAnnotations = (annotationIds) => (annotated) => {
  const out = {
    ...annotated.annotations
  };
  for (const id3 of annotationIds) {
    delete out[id3];
  }
  return out;
};
var preserveTransformationAnnotations = /* @__PURE__ */ pickAnnotations([ExamplesAnnotationId, DefaultAnnotationId, JSONSchemaAnnotationId, ArbitraryAnnotationId, PrettyAnnotationId, EquivalenceAnnotationId]);
var typeAST = (ast) => {
  switch (ast._tag) {
    case "Declaration": {
      const typeParameters = changeMap(ast.typeParameters, typeAST);
      return typeParameters === ast.typeParameters ? ast : new Declaration(typeParameters, ast.decodeUnknown, ast.encodeUnknown, ast.annotations);
    }
    case "TupleType": {
      const elements = changeMap(ast.elements, (e) => {
        const type = typeAST(e.type);
        return type === e.type ? e : new OptionalType(type, e.isOptional);
      });
      const restASTs = getRestASTs(ast.rest);
      const rest = changeMap(restASTs, typeAST);
      return elements === ast.elements && rest === restASTs ? ast : new TupleType(elements, rest.map((type) => new Type(type)), ast.isReadonly, ast.annotations);
    }
    case "TypeLiteral": {
      const propertySignatures = changeMap(ast.propertySignatures, (p) => {
        const type = typeAST(p.type);
        return type === p.type ? p : new PropertySignature(p.name, type, p.isOptional, p.isReadonly);
      });
      const indexSignatures = changeMap(ast.indexSignatures, (is2) => {
        const type = typeAST(is2.type);
        return type === is2.type ? is2 : new IndexSignature(is2.parameter, type, is2.isReadonly);
      });
      return propertySignatures === ast.propertySignatures && indexSignatures === ast.indexSignatures ? ast : new TypeLiteral(propertySignatures, indexSignatures, ast.annotations);
    }
    case "Union": {
      const types = changeMap(ast.types, typeAST);
      return types === ast.types ? ast : Union.make(types, ast.annotations);
    }
    case "Suspend":
      return new Suspend(() => typeAST(ast.f()), ast.annotations);
    case "Refinement": {
      const from = typeAST(ast.from);
      return from === ast.from ? ast : new Refinement(from, ast.filter, ast.annotations);
    }
    case "Transformation": {
      const preserve = preserveTransformationAnnotations(ast);
      return typeAST(preserve !== void 0 ? annotations(ast.to, preserve) : ast.to);
    }
  }
  return ast;
};
function changeMap(as13, f) {
  let changed = false;
  const out = allocate(as13.length);
  for (let i = 0; i < as13.length; i++) {
    const a = as13[i];
    const fa = f(a);
    if (fa !== a) {
      changed = true;
    }
    out[i] = fa;
  }
  return changed ? out : as13;
}
var encodedAST_ = (ast, isBound) => {
  switch (ast._tag) {
    case "Declaration": {
      const typeParameters = changeMap(ast.typeParameters, (ast2) => encodedAST_(ast2));
      return typeParameters === ast.typeParameters ? ast : new Declaration(typeParameters, ast.decodeUnknown, ast.encodeUnknown);
    }
    case "TupleType": {
      const elements = changeMap(ast.elements, (e) => {
        const type = encodedAST_(e.type);
        return type === e.type ? e : new OptionalType(type, e.isOptional);
      });
      const restASTs = getRestASTs(ast.rest);
      const rest = changeMap(restASTs, (ast2) => encodedAST_(ast2));
      return elements === ast.elements && rest === restASTs ? ast : new TupleType(elements, rest.map((ast2) => new Type(ast2)), ast.isReadonly);
    }
    case "TypeLiteral": {
      const propertySignatures = changeMap(ast.propertySignatures, (ps) => {
        const type = encodedAST_(ps.type);
        return type === ps.type ? ps : new PropertySignature(ps.name, type, ps.isOptional, ps.isReadonly);
      });
      const indexSignatures = changeMap(ast.indexSignatures, (is2) => {
        const type = encodedAST_(is2.type);
        return type === is2.type ? is2 : new IndexSignature(is2.parameter, type, is2.isReadonly);
      });
      return propertySignatures === ast.propertySignatures && indexSignatures === ast.indexSignatures ? ast : new TypeLiteral(propertySignatures, indexSignatures);
    }
    case "Union": {
      const types = changeMap(ast.types, (ast2) => encodedAST_(ast2));
      return types === ast.types ? ast : Union.make(types);
    }
    case "Suspend": {
      let borrowedAnnotations = void 0;
      const identifier2 = getJSONIdentifier(ast);
      if (isSome2(identifier2)) {
        const suffix = "";
        borrowedAnnotations = {
          [JSONIdentifierAnnotationId]: `${identifier2.value}Encoded${suffix}`
        };
      }
      return new Suspend(() => encodedAST_(ast.f()), borrowedAnnotations);
    }
    case "Refinement": {
      const from = encodedAST_(ast.from);
      {
        return from;
      }
    }
    case "Transformation":
      return encodedAST_(ast.from);
  }
  return ast;
};
var encodedAST = (ast) => encodedAST_(ast);
var toJSONAnnotations = (annotations2) => {
  const out = {};
  for (const k of Object.getOwnPropertySymbols(annotations2)) {
    out[String(k)] = annotations2[k];
  }
  return out;
};
var getEncodedParameter = (ast) => {
  switch (ast._tag) {
    case "StringKeyword":
    case "SymbolKeyword":
    case "TemplateLiteral":
      return ast;
    case "Refinement":
      return getEncodedParameter(ast.from);
  }
};
var formatKeyword = (ast) => getOrElse(getExpected(ast), () => ast._tag);
function getBrands(ast) {
  return match2(getBrandAnnotation(ast), {
    onNone: () => "",
    onSome: (brands) => brands.map((brand) => ` & Brand<${formatUnknown(brand)}>`).join("")
  });
}
var getOrElseExpected = (ast) => getTitleAnnotation(ast).pipe(orElse(() => getDescriptionAnnotation(ast)), orElse(() => getAutoTitleAnnotation(ast)), map2((s) => s + getBrands(ast)));
var getExpected = (ast) => orElse(getIdentifierAnnotation(ast), () => getOrElseExpected(ast));

// node_modules/effect/dist/esm/Boolean.js
var not = (self) => !self;

// node_modules/effect/dist/esm/Brand.js
var RefinedConstructorsTypeId = /* @__PURE__ */ Symbol.for("effect/Brand/Refined");
var nominal = () => {
  return Object.assign((args2) => args2, {
    [RefinedConstructorsTypeId]: RefinedConstructorsTypeId,
    option: (args2) => some2(args2),
    either: (args2) => right2(args2),
    is: (_args) => true
  });
};

// node_modules/effect/dist/esm/Context.js
var Context_exports = {};
__export(Context_exports, {
  GenericTag: () => GenericTag,
  Reference: () => Reference2,
  ReferenceTypeId: () => ReferenceTypeId2,
  Tag: () => Tag2,
  TagTypeId: () => TagTypeId2,
  add: () => add2,
  empty: () => empty3,
  get: () => get3,
  getOption: () => getOption2,
  getOrElse: () => getOrElse3,
  isContext: () => isContext2,
  isReference: () => isReference2,
  isTag: () => isTag2,
  make: () => make5,
  merge: () => merge3,
  mergeAll: () => mergeAll2,
  omit: () => omit2,
  pick: () => pick2,
  unsafeGet: () => unsafeGet3,
  unsafeMake: () => unsafeMake
});

// node_modules/effect/dist/esm/internal/context.js
var TagTypeId = /* @__PURE__ */ Symbol.for("effect/Context/Tag");
var ReferenceTypeId = /* @__PURE__ */ Symbol.for("effect/Context/Reference");
var STMSymbolKey = "effect/STM";
var STMTypeId = /* @__PURE__ */ Symbol.for(STMSymbolKey);
var TagProto = {
  ...EffectPrototype,
  _op: "Tag",
  [STMTypeId]: effectVariance,
  [TagTypeId]: {
    _Service: (_) => _,
    _Identifier: (_) => _
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Tag",
      key: this.key,
      stack: this.stack
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  of(self) {
    return self;
  },
  context(self) {
    return make4(this, self);
  }
};
var ReferenceProto = {
  ...TagProto,
  [ReferenceTypeId]: ReferenceTypeId
};
var makeGenericTag = (key) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error();
  Error.stackTraceLimit = limit;
  const tag2 = Object.create(TagProto);
  Object.defineProperty(tag2, "stack", {
    get() {
      return creationError.stack;
    }
  });
  tag2.key = key;
  return tag2;
};
var Tag = (id3) => () => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error();
  Error.stackTraceLimit = limit;
  function TagClass() {
  }
  Object.setPrototypeOf(TagClass, TagProto);
  TagClass.key = id3;
  Object.defineProperty(TagClass, "stack", {
    get() {
      return creationError.stack;
    }
  });
  return TagClass;
};
var Reference = () => (id3, options) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error();
  Error.stackTraceLimit = limit;
  function ReferenceClass() {
  }
  Object.setPrototypeOf(ReferenceClass, ReferenceProto);
  ReferenceClass.key = id3;
  ReferenceClass.defaultValue = options.defaultValue;
  Object.defineProperty(ReferenceClass, "stack", {
    get() {
      return creationError.stack;
    }
  });
  return ReferenceClass;
};
var TypeId4 = /* @__PURE__ */ Symbol.for("effect/Context");
var ContextProto = {
  [TypeId4]: {
    _Services: (_) => _
  },
  [symbol2](that) {
    if (isContext(that)) {
      if (this.unsafeMap.size === that.unsafeMap.size) {
        for (const k of this.unsafeMap.keys()) {
          if (!that.unsafeMap.has(k) || !equals(this.unsafeMap.get(k), that.unsafeMap.get(k))) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  },
  [symbol]() {
    return cached(this, number2(this.unsafeMap.size));
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.unsafeMap).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var makeContext = (unsafeMap) => {
  const context7 = Object.create(ContextProto);
  context7.unsafeMap = unsafeMap;
  return context7;
};
var serviceNotFoundError = (tag2) => {
  const error = new Error(`Service not found${tag2.key ? `: ${String(tag2.key)}` : ""}`);
  if (tag2.stack) {
    const lines = tag2.stack.split("\n");
    if (lines.length > 2) {
      const afterAt = lines[2].match(/at (.*)/);
      if (afterAt) {
        error.message = error.message + ` (defined at ${afterAt[1]})`;
      }
    }
  }
  if (error.stack) {
    const lines = error.stack.split("\n");
    lines.splice(1, 3);
    error.stack = lines.join("\n");
  }
  return error;
};
var isContext = (u) => hasProperty(u, TypeId4);
var isTag = (u) => hasProperty(u, TagTypeId);
var isReference = (u) => hasProperty(u, ReferenceTypeId);
var _empty = /* @__PURE__ */ makeContext(/* @__PURE__ */ new Map());
var empty2 = () => _empty;
var make4 = (tag2, service3) => makeContext(/* @__PURE__ */ new Map([[tag2.key, service3]]));
var add = /* @__PURE__ */ dual(3, (self, tag2, service3) => {
  const map25 = new Map(self.unsafeMap);
  map25.set(tag2.key, service3);
  return makeContext(map25);
});
var defaultValueCache = /* @__PURE__ */ globalValue("effect/Context/defaultValueCache", () => /* @__PURE__ */ new Map());
var getDefaultValue = (tag2) => {
  if (defaultValueCache.has(tag2.key)) {
    return defaultValueCache.get(tag2.key);
  }
  const value = tag2.defaultValue();
  defaultValueCache.set(tag2.key, value);
  return value;
};
var unsafeGetReference = (self, tag2) => {
  return self.unsafeMap.has(tag2.key) ? self.unsafeMap.get(tag2.key) : getDefaultValue(tag2);
};
var unsafeGet2 = /* @__PURE__ */ dual(2, (self, tag2) => {
  if (!self.unsafeMap.has(tag2.key)) {
    if (ReferenceTypeId in tag2) return getDefaultValue(tag2);
    throw serviceNotFoundError(tag2);
  }
  return self.unsafeMap.get(tag2.key);
});
var get2 = unsafeGet2;
var getOrElse2 = /* @__PURE__ */ dual(3, (self, tag2, orElse12) => {
  if (!self.unsafeMap.has(tag2.key)) {
    return isReference(tag2) ? getDefaultValue(tag2) : orElse12();
  }
  return self.unsafeMap.get(tag2.key);
});
var getOption = /* @__PURE__ */ dual(2, (self, tag2) => {
  if (!self.unsafeMap.has(tag2.key)) {
    return isReference(tag2) ? some(getDefaultValue(tag2)) : none;
  }
  return some(self.unsafeMap.get(tag2.key));
});
var merge2 = /* @__PURE__ */ dual(2, (self, that) => {
  const map25 = new Map(self.unsafeMap);
  for (const [tag2, s] of that.unsafeMap) {
    map25.set(tag2, s);
  }
  return makeContext(map25);
});
var mergeAll = (...ctxs) => {
  const map25 = /* @__PURE__ */ new Map();
  for (let i = 0; i < ctxs.length; i++) {
    ctxs[i].unsafeMap.forEach((value, key) => {
      map25.set(key, value);
    });
  }
  return makeContext(map25);
};
var pick = (...tags) => (self) => {
  const tagSet = new Set(tags.map((_) => _.key));
  const newEnv = /* @__PURE__ */ new Map();
  for (const [tag2, s] of self.unsafeMap.entries()) {
    if (tagSet.has(tag2)) {
      newEnv.set(tag2, s);
    }
  }
  return makeContext(newEnv);
};
var omit = (...tags) => (self) => {
  const newEnv = new Map(self.unsafeMap);
  for (const tag2 of tags) {
    newEnv.delete(tag2.key);
  }
  return makeContext(newEnv);
};

// node_modules/effect/dist/esm/Context.js
var TagTypeId2 = TagTypeId;
var ReferenceTypeId2 = ReferenceTypeId;
var GenericTag = makeGenericTag;
var unsafeMake = makeContext;
var isContext2 = isContext;
var isTag2 = isTag;
var isReference2 = isReference;
var empty3 = empty2;
var make5 = make4;
var add2 = add;
var get3 = get2;
var getOrElse3 = getOrElse2;
var unsafeGet3 = unsafeGet2;
var getOption2 = getOption;
var merge3 = merge2;
var mergeAll2 = mergeAll;
var pick2 = pick;
var omit2 = omit;
var Tag2 = Tag;
var Reference2 = Reference;

// node_modules/effect/dist/esm/Deferred.js
var Deferred_exports = {};
__export(Deferred_exports, {
  DeferredTypeId: () => DeferredTypeId2,
  await: () => _await,
  complete: () => complete,
  completeWith: () => completeWith,
  die: () => die3,
  dieSync: () => dieSync2,
  done: () => done2,
  fail: () => fail3,
  failCause: () => failCause2,
  failCauseSync: () => failCauseSync2,
  failSync: () => failSync2,
  interrupt: () => interrupt3,
  interruptWith: () => interruptWith2,
  isDone: () => isDone,
  make: () => make18,
  makeAs: () => makeAs,
  poll: () => poll,
  succeed: () => succeed2,
  sync: () => sync2,
  unsafeDone: () => unsafeDone,
  unsafeMake: () => unsafeMake4
});

// node_modules/effect/dist/esm/Chunk.js
var TypeId5 = /* @__PURE__ */ Symbol.for("effect/Chunk");
function copy2(src, srcPos, dest, destPos, len) {
  for (let i = srcPos; i < Math.min(src.length, srcPos + len); i++) {
    dest[destPos + i - srcPos] = src[i];
  }
  return dest;
}
var emptyArray = [];
var getEquivalence3 = (isEquivalent) => make((self, that) => self.length === that.length && toReadonlyArray(self).every((value, i) => isEquivalent(value, unsafeGet4(that, i))));
var _equivalence3 = /* @__PURE__ */ getEquivalence3(equals);
var ChunkProto = {
  [TypeId5]: {
    _A: (_) => _
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Chunk",
      values: toReadonlyArray(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol2](that) {
    return isChunk(that) && _equivalence3(this, that);
  },
  [symbol]() {
    return cached(this, array2(toReadonlyArray(this)));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray": {
        return this.backing.array[Symbol.iterator]();
      }
      case "IEmpty": {
        return emptyArray[Symbol.iterator]();
      }
      default: {
        return toReadonlyArray(this)[Symbol.iterator]();
      }
    }
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeChunk = (backing) => {
  const chunk3 = Object.create(ChunkProto);
  chunk3.backing = backing;
  switch (backing._tag) {
    case "IEmpty": {
      chunk3.length = 0;
      chunk3.depth = 0;
      chunk3.left = chunk3;
      chunk3.right = chunk3;
      break;
    }
    case "IConcat": {
      chunk3.length = backing.left.length + backing.right.length;
      chunk3.depth = 1 + Math.max(backing.left.depth, backing.right.depth);
      chunk3.left = backing.left;
      chunk3.right = backing.right;
      break;
    }
    case "IArray": {
      chunk3.length = backing.array.length;
      chunk3.depth = 0;
      chunk3.left = _empty2;
      chunk3.right = _empty2;
      break;
    }
    case "ISingleton": {
      chunk3.length = 1;
      chunk3.depth = 0;
      chunk3.left = _empty2;
      chunk3.right = _empty2;
      break;
    }
    case "ISlice": {
      chunk3.length = backing.length;
      chunk3.depth = backing.chunk.depth + 1;
      chunk3.left = _empty2;
      chunk3.right = _empty2;
      break;
    }
  }
  return chunk3;
};
var isChunk = (u) => hasProperty(u, TypeId5);
var _empty2 = /* @__PURE__ */ makeChunk({
  _tag: "IEmpty"
});
var empty4 = () => _empty2;
var make6 = (...as13) => unsafeFromNonEmptyArray(as13);
var of2 = (a) => makeChunk({
  _tag: "ISingleton",
  a
});
var fromIterable3 = (self) => isChunk(self) ? self : unsafeFromArray(fromIterable2(self));
var copyToArray = (self, array4, initial) => {
  switch (self.backing._tag) {
    case "IArray": {
      copy2(self.backing.array, 0, array4, initial, self.length);
      break;
    }
    case "IConcat": {
      copyToArray(self.left, array4, initial);
      copyToArray(self.right, array4, initial + self.left.length);
      break;
    }
    case "ISingleton": {
      array4[initial] = self.backing.a;
      break;
    }
    case "ISlice": {
      let i = 0;
      let j = initial;
      while (i < self.length) {
        array4[j] = unsafeGet4(self, i);
        i += 1;
        j += 1;
      }
      break;
    }
  }
};
var toReadonlyArray_ = (self) => {
  switch (self.backing._tag) {
    case "IEmpty": {
      return emptyArray;
    }
    case "IArray": {
      return self.backing.array;
    }
    default: {
      const arr = new Array(self.length);
      copyToArray(self, arr, 0);
      self.backing = {
        _tag: "IArray",
        array: arr
      };
      self.left = _empty2;
      self.right = _empty2;
      self.depth = 0;
      return arr;
    }
  }
};
var toReadonlyArray = toReadonlyArray_;
var reverseChunk = (self) => {
  switch (self.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return self;
    case "IArray": {
      return makeChunk({
        _tag: "IArray",
        array: reverse(self.backing.array)
      });
    }
    case "IConcat": {
      return makeChunk({
        _tag: "IConcat",
        left: reverse2(self.backing.right),
        right: reverse2(self.backing.left)
      });
    }
    case "ISlice":
      return unsafeFromArray(reverse(toReadonlyArray(self)));
  }
};
var reverse2 = reverseChunk;
var get4 = /* @__PURE__ */ dual(2, (self, index) => index < 0 || index >= self.length ? none2() : some2(unsafeGet4(self, index)));
var unsafeFromArray = (self) => self.length === 0 ? empty4() : self.length === 1 ? of2(self[0]) : makeChunk({
  _tag: "IArray",
  array: self
});
var unsafeFromNonEmptyArray = (self) => unsafeFromArray(self);
var unsafeGet4 = /* @__PURE__ */ dual(2, (self, index) => {
  switch (self.backing._tag) {
    case "IEmpty": {
      throw new Error(`Index out of bounds`);
    }
    case "ISingleton": {
      if (index !== 0) {
        throw new Error(`Index out of bounds`);
      }
      return self.backing.a;
    }
    case "IArray": {
      if (index >= self.length || index < 0) {
        throw new Error(`Index out of bounds`);
      }
      return self.backing.array[index];
    }
    case "IConcat": {
      return index < self.left.length ? unsafeGet4(self.left, index) : unsafeGet4(self.right, index - self.left.length);
    }
    case "ISlice": {
      return unsafeGet4(self.backing.chunk, index + self.backing.offset);
    }
  }
});
var append2 = /* @__PURE__ */ dual(2, (self, a) => appendAll2(self, of2(a)));
var prepend2 = /* @__PURE__ */ dual(2, (self, elem) => appendAll2(of2(elem), self));
var drop2 = /* @__PURE__ */ dual(2, (self, n) => {
  if (n <= 0) {
    return self;
  } else if (n >= self.length) {
    return _empty2;
  } else {
    switch (self.backing._tag) {
      case "ISlice": {
        return makeChunk({
          _tag: "ISlice",
          chunk: self.backing.chunk,
          offset: self.backing.offset + n,
          length: self.backing.length - n
        });
      }
      case "IConcat": {
        if (n > self.left.length) {
          return drop2(self.right, n - self.left.length);
        }
        return makeChunk({
          _tag: "IConcat",
          left: drop2(self.left, n),
          right: self.right
        });
      }
      default: {
        return makeChunk({
          _tag: "ISlice",
          chunk: self,
          offset: n,
          length: self.length - n
        });
      }
    }
  }
});
var appendAll2 = /* @__PURE__ */ dual(2, (self, that) => {
  if (self.backing._tag === "IEmpty") {
    return that;
  }
  if (that.backing._tag === "IEmpty") {
    return self;
  }
  const diff8 = that.depth - self.depth;
  if (Math.abs(diff8) <= 1) {
    return makeChunk({
      _tag: "IConcat",
      left: self,
      right: that
    });
  } else if (diff8 < -1) {
    if (self.left.depth >= self.right.depth) {
      const nr = appendAll2(self.right, that);
      return makeChunk({
        _tag: "IConcat",
        left: self.left,
        right: nr
      });
    } else {
      const nrr = appendAll2(self.right.right, that);
      if (nrr.depth === self.depth - 3) {
        const nr = makeChunk({
          _tag: "IConcat",
          left: self.right.left,
          right: nrr
        });
        return makeChunk({
          _tag: "IConcat",
          left: self.left,
          right: nr
        });
      } else {
        const nl = makeChunk({
          _tag: "IConcat",
          left: self.left,
          right: self.right.left
        });
        return makeChunk({
          _tag: "IConcat",
          left: nl,
          right: nrr
        });
      }
    }
  } else {
    if (that.right.depth >= that.left.depth) {
      const nl = appendAll2(self, that.left);
      return makeChunk({
        _tag: "IConcat",
        left: nl,
        right: that.right
      });
    } else {
      const nll = appendAll2(self, that.left.left);
      if (nll.depth === that.depth - 3) {
        const nl = makeChunk({
          _tag: "IConcat",
          left: nll,
          right: that.left.right
        });
        return makeChunk({
          _tag: "IConcat",
          left: nl,
          right: that.right
        });
      } else {
        const nr = makeChunk({
          _tag: "IConcat",
          left: that.left.right,
          right: that.right
        });
        return makeChunk({
          _tag: "IConcat",
          left: nll,
          right: nr
        });
      }
    }
  }
});
var filter3 = /* @__PURE__ */ dual(2, (self, predicate) => unsafeFromArray(filter2(self, predicate)));
var isEmpty = (self) => self.length === 0;
var isNonEmpty2 = (self) => self.length > 0;
var head2 = /* @__PURE__ */ get4(0);
var unsafeHead = (self) => unsafeGet4(self, 0);
var headNonEmpty2 = unsafeHead;
var map4 = /* @__PURE__ */ dual(2, (self, f) => self.backing._tag === "ISingleton" ? of2(f(self.backing.a, 0)) : unsafeFromArray(pipe(toReadonlyArray(self), map3((a, i) => f(a, i)))));
var tailNonEmpty2 = (self) => drop2(self, 1);
var reduce2 = reduce;

// node_modules/effect/dist/esm/Duration.js
var Duration_exports = {};
__export(Duration_exports, {
  Equivalence: () => Equivalence,
  Order: () => Order2,
  between: () => between2,
  clamp: () => clamp3,
  days: () => days,
  decode: () => decode,
  decodeUnknown: () => decodeUnknown,
  divide: () => divide,
  equals: () => equals2,
  format: () => format2,
  formatIso: () => formatIso,
  fromIso: () => fromIso,
  greaterThan: () => greaterThan2,
  greaterThanOrEqualTo: () => greaterThanOrEqualTo2,
  hours: () => hours,
  infinity: () => infinity,
  isDuration: () => isDuration,
  isFinite: () => isFinite,
  isZero: () => isZero,
  lessThan: () => lessThan2,
  lessThanOrEqualTo: () => lessThanOrEqualTo2,
  match: () => match4,
  matchWith: () => matchWith,
  max: () => max2,
  micros: () => micros,
  millis: () => millis,
  min: () => min2,
  minutes: () => minutes,
  nanos: () => nanos,
  parts: () => parts,
  seconds: () => seconds,
  subtract: () => subtract,
  sum: () => sum,
  times: () => times,
  toDays: () => toDays,
  toHours: () => toHours,
  toHrTime: () => toHrTime,
  toMillis: () => toMillis,
  toMinutes: () => toMinutes,
  toNanos: () => toNanos,
  toSeconds: () => toSeconds,
  toWeeks: () => toWeeks,
  unsafeDivide: () => unsafeDivide,
  unsafeFormatIso: () => unsafeFormatIso,
  unsafeToNanos: () => unsafeToNanos,
  weeks: () => weeks,
  zero: () => zero
});
var TypeId6 = /* @__PURE__ */ Symbol.for("effect/Duration");
var bigint0 = /* @__PURE__ */ BigInt(0);
var bigint24 = /* @__PURE__ */ BigInt(24);
var bigint60 = /* @__PURE__ */ BigInt(60);
var bigint1e3 = /* @__PURE__ */ BigInt(1e3);
var bigint1e6 = /* @__PURE__ */ BigInt(1e6);
var bigint1e9 = /* @__PURE__ */ BigInt(1e9);
var DURATION_REGEX = /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/;
var decode = (input) => {
  if (isDuration(input)) {
    return input;
  } else if (isNumber(input)) {
    return millis(input);
  } else if (isBigInt(input)) {
    return nanos(input);
  } else if (Array.isArray(input) && input.length === 2 && input.every(isNumber)) {
    if (input[0] === -Infinity || input[1] === -Infinity || Number.isNaN(input[0]) || Number.isNaN(input[1])) {
      return zero;
    }
    if (input[0] === Infinity || input[1] === Infinity) {
      return infinity;
    }
    return nanos(BigInt(Math.round(input[0] * 1e9)) + BigInt(Math.round(input[1])));
  } else if (isString(input)) {
    const match19 = DURATION_REGEX.exec(input);
    if (match19) {
      const [_, valueStr, unit] = match19;
      const value = Number(valueStr);
      switch (unit) {
        case "nano":
        case "nanos":
          return nanos(BigInt(valueStr));
        case "micro":
        case "micros":
          return micros(BigInt(valueStr));
        case "milli":
        case "millis":
          return millis(value);
        case "second":
        case "seconds":
          return seconds(value);
        case "minute":
        case "minutes":
          return minutes(value);
        case "hour":
        case "hours":
          return hours(value);
        case "day":
        case "days":
          return days(value);
        case "week":
        case "weeks":
          return weeks(value);
      }
    }
  }
  throw new Error("Invalid DurationInput");
};
var decodeUnknown = /* @__PURE__ */ liftThrowable(decode);
var zeroValue = {
  _tag: "Millis",
  millis: 0
};
var infinityValue = {
  _tag: "Infinity"
};
var DurationProto = {
  [TypeId6]: TypeId6,
  [symbol]() {
    return cached(this, structure(this.value));
  },
  [symbol2](that) {
    return isDuration(that) && equals2(this, that);
  },
  toString() {
    return `Duration(${format2(this)})`;
  },
  toJSON() {
    switch (this.value._tag) {
      case "Millis":
        return {
          _id: "Duration",
          _tag: "Millis",
          millis: this.value.millis
        };
      case "Nanos":
        return {
          _id: "Duration",
          _tag: "Nanos",
          hrtime: toHrTime(this)
        };
      case "Infinity":
        return {
          _id: "Duration",
          _tag: "Infinity"
        };
    }
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make7 = (input) => {
  const duration3 = Object.create(DurationProto);
  if (isNumber(input)) {
    if (isNaN(input) || input <= 0) {
      duration3.value = zeroValue;
    } else if (!Number.isFinite(input)) {
      duration3.value = infinityValue;
    } else if (!Number.isInteger(input)) {
      duration3.value = {
        _tag: "Nanos",
        nanos: BigInt(Math.round(input * 1e6))
      };
    } else {
      duration3.value = {
        _tag: "Millis",
        millis: input
      };
    }
  } else if (input <= bigint0) {
    duration3.value = zeroValue;
  } else {
    duration3.value = {
      _tag: "Nanos",
      nanos: input
    };
  }
  return duration3;
};
var isDuration = (u) => hasProperty(u, TypeId6);
var isFinite = (self) => self.value._tag !== "Infinity";
var isZero = (self) => {
  switch (self.value._tag) {
    case "Millis": {
      return self.value.millis === 0;
    }
    case "Nanos": {
      return self.value.nanos === bigint0;
    }
    case "Infinity": {
      return false;
    }
  }
};
var zero = /* @__PURE__ */ make7(0);
var infinity = /* @__PURE__ */ make7(Infinity);
var nanos = (nanos2) => make7(nanos2);
var micros = (micros2) => make7(micros2 * bigint1e3);
var millis = (millis2) => make7(millis2);
var seconds = (seconds2) => make7(seconds2 * 1e3);
var minutes = (minutes2) => make7(minutes2 * 6e4);
var hours = (hours2) => make7(hours2 * 36e5);
var days = (days2) => make7(days2 * 864e5);
var weeks = (weeks2) => make7(weeks2 * 6048e5);
var toMillis = (self) => match4(self, {
  onMillis: (millis2) => millis2,
  onNanos: (nanos2) => Number(nanos2) / 1e6
});
var toSeconds = (self) => match4(self, {
  onMillis: (millis2) => millis2 / 1e3,
  onNanos: (nanos2) => Number(nanos2) / 1e9
});
var toMinutes = (self) => match4(self, {
  onMillis: (millis2) => millis2 / 6e4,
  onNanos: (nanos2) => Number(nanos2) / 6e10
});
var toHours = (self) => match4(self, {
  onMillis: (millis2) => millis2 / 36e5,
  onNanos: (nanos2) => Number(nanos2) / 36e11
});
var toDays = (self) => match4(self, {
  onMillis: (millis2) => millis2 / 864e5,
  onNanos: (nanos2) => Number(nanos2) / 864e11
});
var toWeeks = (self) => match4(self, {
  onMillis: (millis2) => millis2 / 6048e5,
  onNanos: (nanos2) => Number(nanos2) / 6048e11
});
var toNanos = (self) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      return none2();
    case "Nanos":
      return some2(_self.value.nanos);
    case "Millis":
      return some2(BigInt(Math.round(_self.value.millis * 1e6)));
  }
};
var unsafeToNanos = (self) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return _self.value.nanos;
    case "Millis":
      return BigInt(Math.round(_self.value.millis * 1e6));
  }
};
var toHrTime = (self) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Infinity":
      return [Infinity, 0];
    case "Nanos":
      return [Number(_self.value.nanos / bigint1e9), Number(_self.value.nanos % bigint1e9)];
    case "Millis":
      return [Math.floor(_self.value.millis / 1e3), Math.round(_self.value.millis % 1e3 * 1e6)];
  }
};
var match4 = /* @__PURE__ */ dual(2, (self, options) => {
  const _self = decode(self);
  switch (_self.value._tag) {
    case "Nanos":
      return options.onNanos(_self.value.nanos);
    case "Infinity":
      return options.onMillis(Infinity);
    case "Millis":
      return options.onMillis(_self.value.millis);
  }
});
var matchWith = /* @__PURE__ */ dual(3, (self, that, options) => {
  const _self = decode(self);
  const _that = decode(that);
  if (_self.value._tag === "Infinity" || _that.value._tag === "Infinity") {
    return options.onMillis(toMillis(_self), toMillis(_that));
  } else if (_self.value._tag === "Nanos" || _that.value._tag === "Nanos") {
    const selfNanos = _self.value._tag === "Nanos" ? _self.value.nanos : BigInt(Math.round(_self.value.millis * 1e6));
    const thatNanos = _that.value._tag === "Nanos" ? _that.value.nanos : BigInt(Math.round(_that.value.millis * 1e6));
    return options.onNanos(selfNanos, thatNanos);
  }
  return options.onMillis(_self.value.millis, _that.value.millis);
});
var Order2 = /* @__PURE__ */ make2((self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => self2 < that2 ? -1 : self2 > that2 ? 1 : 0,
  onNanos: (self2, that2) => self2 < that2 ? -1 : self2 > that2 ? 1 : 0
}));
var between2 = /* @__PURE__ */ between(/* @__PURE__ */ mapInput2(Order2, decode));
var Equivalence = (self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => self2 === that2,
  onNanos: (self2, that2) => self2 === that2
});
var _min = /* @__PURE__ */ min(Order2);
var min2 = /* @__PURE__ */ dual(2, (self, that) => _min(decode(self), decode(that)));
var _max = /* @__PURE__ */ max(Order2);
var max2 = /* @__PURE__ */ dual(2, (self, that) => _max(decode(self), decode(that)));
var _clamp = /* @__PURE__ */ clamp(Order2);
var clamp3 = /* @__PURE__ */ dual(2, (self, options) => _clamp(decode(self), {
  minimum: decode(options.minimum),
  maximum: decode(options.maximum)
}));
var divide = /* @__PURE__ */ dual(2, (self, by) => match4(self, {
  onMillis: (millis2) => {
    if (by === 0 || isNaN(by) || !Number.isFinite(by)) {
      return none2();
    }
    return some2(make7(millis2 / by));
  },
  onNanos: (nanos2) => {
    if (isNaN(by) || by <= 0 || !Number.isFinite(by)) {
      return none2();
    }
    try {
      return some2(make7(nanos2 / BigInt(by)));
    } catch {
      return none2();
    }
  }
}));
var unsafeDivide = /* @__PURE__ */ dual(2, (self, by) => match4(self, {
  onMillis: (millis2) => make7(millis2 / by),
  onNanos: (nanos2) => {
    if (isNaN(by) || by < 0 || Object.is(by, -0)) {
      return zero;
    } else if (Object.is(by, 0) || !Number.isFinite(by)) {
      return infinity;
    }
    return make7(nanos2 / BigInt(by));
  }
}));
var times = /* @__PURE__ */ dual(2, (self, times2) => match4(self, {
  onMillis: (millis2) => make7(millis2 * times2),
  onNanos: (nanos2) => make7(nanos2 * BigInt(times2))
}));
var subtract = /* @__PURE__ */ dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => make7(self2 - that2),
  onNanos: (self2, that2) => make7(self2 - that2)
}));
var sum = /* @__PURE__ */ dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => make7(self2 + that2),
  onNanos: (self2, that2) => make7(self2 + that2)
}));
var lessThan2 = /* @__PURE__ */ dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => self2 < that2,
  onNanos: (self2, that2) => self2 < that2
}));
var lessThanOrEqualTo2 = /* @__PURE__ */ dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => self2 <= that2,
  onNanos: (self2, that2) => self2 <= that2
}));
var greaterThan2 = /* @__PURE__ */ dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => self2 > that2,
  onNanos: (self2, that2) => self2 > that2
}));
var greaterThanOrEqualTo2 = /* @__PURE__ */ dual(2, (self, that) => matchWith(self, that, {
  onMillis: (self2, that2) => self2 >= that2,
  onNanos: (self2, that2) => self2 >= that2
}));
var equals2 = /* @__PURE__ */ dual(2, (self, that) => Equivalence(decode(self), decode(that)));
var parts = (self) => {
  const duration3 = decode(self);
  if (duration3.value._tag === "Infinity") {
    return {
      days: Infinity,
      hours: Infinity,
      minutes: Infinity,
      seconds: Infinity,
      millis: Infinity,
      nanos: Infinity
    };
  }
  const nanos2 = unsafeToNanos(duration3);
  const ms = nanos2 / bigint1e6;
  const sec = ms / bigint1e3;
  const min4 = sec / bigint60;
  const hr = min4 / bigint60;
  const days2 = hr / bigint24;
  return {
    days: Number(days2),
    hours: Number(hr % bigint24),
    minutes: Number(min4 % bigint60),
    seconds: Number(sec % bigint60),
    millis: Number(ms % bigint1e3),
    nanos: Number(nanos2 % bigint1e6)
  };
};
var format2 = (self) => {
  const duration3 = decode(self);
  if (duration3.value._tag === "Infinity") {
    return "Infinity";
  }
  if (isZero(duration3)) {
    return "0";
  }
  const fragments = parts(duration3);
  const pieces = [];
  if (fragments.days !== 0) {
    pieces.push(`${fragments.days}d`);
  }
  if (fragments.hours !== 0) {
    pieces.push(`${fragments.hours}h`);
  }
  if (fragments.minutes !== 0) {
    pieces.push(`${fragments.minutes}m`);
  }
  if (fragments.seconds !== 0) {
    pieces.push(`${fragments.seconds}s`);
  }
  if (fragments.millis !== 0) {
    pieces.push(`${fragments.millis}ms`);
  }
  if (fragments.nanos !== 0) {
    pieces.push(`${fragments.nanos}ns`);
  }
  return pieces.join(" ");
};
var unsafeFormatIso = (self) => {
  const duration3 = decode(self);
  if (!isFinite(duration3)) {
    throw new RangeError("Cannot format infinite duration");
  }
  const fragments = [];
  const {
    days: days2,
    hours: hours2,
    millis: millis2,
    minutes: minutes2,
    nanos: nanos2,
    seconds: seconds2
  } = parts(duration3);
  let rest = days2;
  if (rest >= 365) {
    const years = Math.floor(rest / 365);
    rest %= 365;
    fragments.push(`${years}Y`);
  }
  if (rest >= 30) {
    const months = Math.floor(rest / 30);
    rest %= 30;
    fragments.push(`${months}M`);
  }
  if (rest >= 7) {
    const weeks2 = Math.floor(rest / 7);
    rest %= 7;
    fragments.push(`${weeks2}W`);
  }
  if (rest > 0) {
    fragments.push(`${rest}D`);
  }
  if (hours2 !== 0 || minutes2 !== 0 || seconds2 !== 0 || millis2 !== 0 || nanos2 !== 0) {
    fragments.push("T");
    if (hours2 !== 0) {
      fragments.push(`${hours2}H`);
    }
    if (minutes2 !== 0) {
      fragments.push(`${minutes2}M`);
    }
    if (seconds2 !== 0 || millis2 !== 0 || nanos2 !== 0) {
      const total = BigInt(seconds2) * bigint1e9 + BigInt(millis2) * bigint1e6 + BigInt(nanos2);
      const str = (Number(total) / 1e9).toFixed(9).replace(/\.?0+$/, "");
      fragments.push(`${str}S`);
    }
  }
  return `P${fragments.join("") || "T0S"}`;
};
var formatIso = (self) => {
  const duration3 = decode(self);
  return isFinite(duration3) ? some2(unsafeFormatIso(duration3)) : none2();
};
var fromIso = (iso) => {
  const result = DURATION_ISO_REGEX.exec(iso);
  if (result == null) {
    return none2();
  }
  const [years, months, weeks2, days2, hours2, mins, secs] = result.slice(1, 8).map((_) => _ ? Number(_) : 0);
  const value = years * 365 * 24 * 60 * 60 + months * 30 * 24 * 60 * 60 + weeks2 * 7 * 24 * 60 * 60 + days2 * 24 * 60 * 60 + hours2 * 60 * 60 + mins * 60 + secs;
  return some2(seconds(value));
};
var DURATION_ISO_REGEX = /^P(?!$)(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?!$)(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;

// node_modules/effect/dist/esm/internal/hashMap/config.js
var SIZE = 5;
var BUCKET_SIZE = /* @__PURE__ */ Math.pow(2, SIZE);
var MASK = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;

// node_modules/effect/dist/esm/internal/hashMap/bitwise.js
function popcount(x) {
  x -= x >> 1 & 1431655765;
  x = (x & 858993459) + (x >> 2 & 858993459);
  x = x + (x >> 4) & 252645135;
  x += x >> 8;
  x += x >> 16;
  return x & 127;
}
function hashFragment(shift2, h) {
  return h >>> shift2 & MASK;
}
function toBitmap(x) {
  return 1 << x;
}
function fromBitmap(bitmap, bit) {
  return popcount(bitmap & bit - 1);
}

// node_modules/effect/dist/esm/internal/stack.js
var make8 = (value, previous) => ({
  value,
  previous
});

// node_modules/effect/dist/esm/internal/hashMap/array.js
function arrayUpdate(mutate5, at, v, arr) {
  let out = arr;
  if (!mutate5) {
    const len = arr.length;
    out = new Array(len);
    for (let i = 0; i < len; ++i) out[i] = arr[i];
  }
  out[at] = v;
  return out;
}
function arraySpliceOut(mutate5, at, arr) {
  const newLen = arr.length - 1;
  let i = 0;
  let g = 0;
  let out = arr;
  if (mutate5) {
    i = g = at;
  } else {
    out = new Array(newLen);
    while (i < at) out[g++] = arr[i++];
  }
  ++i;
  while (i <= newLen) out[g++] = arr[i++];
  if (mutate5) {
    out.length = newLen;
  }
  return out;
}
function arraySpliceIn(mutate5, at, v, arr) {
  const len = arr.length;
  if (mutate5) {
    let i2 = len;
    while (i2 >= at) arr[i2--] = arr[i2];
    arr[at] = v;
    return arr;
  }
  let i = 0, g = 0;
  const out = new Array(len + 1);
  while (i < at) out[g++] = arr[i++];
  out[at] = v;
  while (i < len) out[++g] = arr[i++];
  return out;
}

// node_modules/effect/dist/esm/internal/hashMap/node.js
var EmptyNode = class _EmptyNode {
  _tag = "EmptyNode";
  modify(edit, _shift, f, hash2, key, size13) {
    const v = f(none2());
    if (isNone2(v)) return new _EmptyNode();
    ++size13.value;
    return new LeafNode(edit, hash2, key, v);
  }
};
function isEmptyNode(a) {
  return isTagged(a, "EmptyNode");
}
function isLeafNode(node) {
  return isEmptyNode(node) || node._tag === "LeafNode" || node._tag === "CollisionNode";
}
function canEditNode(node, edit) {
  return isEmptyNode(node) ? false : edit === node.edit;
}
var LeafNode = class _LeafNode {
  edit;
  hash;
  key;
  value;
  _tag = "LeafNode";
  constructor(edit, hash2, key, value) {
    this.edit = edit;
    this.hash = hash2;
    this.key = key;
    this.value = value;
  }
  modify(edit, shift2, f, hash2, key, size13) {
    if (equals(key, this.key)) {
      const v2 = f(this.value);
      if (v2 === this.value) return this;
      else if (isNone2(v2)) {
        --size13.value;
        return new EmptyNode();
      }
      if (canEditNode(this, edit)) {
        this.value = v2;
        return this;
      }
      return new _LeafNode(edit, hash2, key, v2);
    }
    const v = f(none2());
    if (isNone2(v)) return this;
    ++size13.value;
    return mergeLeaves(edit, shift2, this.hash, this, hash2, new _LeafNode(edit, hash2, key, v));
  }
};
var CollisionNode = class _CollisionNode {
  edit;
  hash;
  children;
  _tag = "CollisionNode";
  constructor(edit, hash2, children3) {
    this.edit = edit;
    this.hash = hash2;
    this.children = children3;
  }
  modify(edit, shift2, f, hash2, key, size13) {
    if (hash2 === this.hash) {
      const canEdit = canEditNode(this, edit);
      const list = this.updateCollisionList(canEdit, edit, this.hash, this.children, f, key, size13);
      if (list === this.children) return this;
      return list.length > 1 ? new _CollisionNode(edit, this.hash, list) : list[0];
    }
    const v = f(none2());
    if (isNone2(v)) return this;
    ++size13.value;
    return mergeLeaves(edit, shift2, this.hash, this, hash2, new LeafNode(edit, hash2, key, v));
  }
  updateCollisionList(mutate5, edit, hash2, list, f, key, size13) {
    const len = list.length;
    for (let i = 0; i < len; ++i) {
      const child = list[i];
      if ("key" in child && equals(key, child.key)) {
        const value = child.value;
        const newValue2 = f(value);
        if (newValue2 === value) return list;
        if (isNone2(newValue2)) {
          --size13.value;
          return arraySpliceOut(mutate5, i, list);
        }
        return arrayUpdate(mutate5, i, new LeafNode(edit, hash2, key, newValue2), list);
      }
    }
    const newValue = f(none2());
    if (isNone2(newValue)) return list;
    ++size13.value;
    return arrayUpdate(mutate5, len, new LeafNode(edit, hash2, key, newValue), list);
  }
};
var IndexedNode = class _IndexedNode {
  edit;
  mask;
  children;
  _tag = "IndexedNode";
  constructor(edit, mask, children3) {
    this.edit = edit;
    this.mask = mask;
    this.children = children3;
  }
  modify(edit, shift2, f, hash2, key, size13) {
    const mask = this.mask;
    const children3 = this.children;
    const frag = hashFragment(shift2, hash2);
    const bit = toBitmap(frag);
    const indx = fromBitmap(mask, bit);
    const exists5 = mask & bit;
    const canEdit = canEditNode(this, edit);
    if (!exists5) {
      const _newChild = new EmptyNode().modify(edit, shift2 + SIZE, f, hash2, key, size13);
      if (!_newChild) return this;
      return children3.length >= MAX_INDEX_NODE ? expand(edit, frag, _newChild, mask, children3) : new _IndexedNode(edit, mask | bit, arraySpliceIn(canEdit, indx, _newChild, children3));
    }
    const current = children3[indx];
    const child = current.modify(edit, shift2 + SIZE, f, hash2, key, size13);
    if (current === child) return this;
    let bitmap = mask;
    let newChildren;
    if (isEmptyNode(child)) {
      bitmap &= ~bit;
      if (!bitmap) return new EmptyNode();
      if (children3.length <= 2 && isLeafNode(children3[indx ^ 1])) {
        return children3[indx ^ 1];
      }
      newChildren = arraySpliceOut(canEdit, indx, children3);
    } else {
      newChildren = arrayUpdate(canEdit, indx, child, children3);
    }
    if (canEdit) {
      this.mask = bitmap;
      this.children = newChildren;
      return this;
    }
    return new _IndexedNode(edit, bitmap, newChildren);
  }
};
var ArrayNode = class _ArrayNode {
  edit;
  size;
  children;
  _tag = "ArrayNode";
  constructor(edit, size13, children3) {
    this.edit = edit;
    this.size = size13;
    this.children = children3;
  }
  modify(edit, shift2, f, hash2, key, size13) {
    let count4 = this.size;
    const children3 = this.children;
    const frag = hashFragment(shift2, hash2);
    const child = children3[frag];
    const newChild = (child || new EmptyNode()).modify(edit, shift2 + SIZE, f, hash2, key, size13);
    if (child === newChild) return this;
    const canEdit = canEditNode(this, edit);
    let newChildren;
    if (isEmptyNode(child) && !isEmptyNode(newChild)) {
      ++count4;
      newChildren = arrayUpdate(canEdit, frag, newChild, children3);
    } else if (!isEmptyNode(child) && isEmptyNode(newChild)) {
      --count4;
      if (count4 <= MIN_ARRAY_NODE) {
        return pack(edit, count4, frag, children3);
      }
      newChildren = arrayUpdate(canEdit, frag, new EmptyNode(), children3);
    } else {
      newChildren = arrayUpdate(canEdit, frag, newChild, children3);
    }
    if (canEdit) {
      this.size = count4;
      this.children = newChildren;
      return this;
    }
    return new _ArrayNode(edit, count4, newChildren);
  }
};
function pack(edit, count4, removed, elements) {
  const children3 = new Array(count4 - 1);
  let g = 0;
  let bitmap = 0;
  for (let i = 0, len = elements.length; i < len; ++i) {
    if (i !== removed) {
      const elem = elements[i];
      if (elem && !isEmptyNode(elem)) {
        children3[g++] = elem;
        bitmap |= 1 << i;
      }
    }
  }
  return new IndexedNode(edit, bitmap, children3);
}
function expand(edit, frag, child, bitmap, subNodes) {
  const arr = [];
  let bit = bitmap;
  let count4 = 0;
  for (let i = 0; bit; ++i) {
    if (bit & 1) arr[i] = subNodes[count4++];
    bit >>>= 1;
  }
  arr[frag] = child;
  return new ArrayNode(edit, count4 + 1, arr);
}
function mergeLeavesInner(edit, shift2, h1, n1, h2, n2) {
  if (h1 === h2) return new CollisionNode(edit, h1, [n2, n1]);
  const subH1 = hashFragment(shift2, h1);
  const subH2 = hashFragment(shift2, h2);
  if (subH1 === subH2) {
    return (child) => new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), [child]);
  } else {
    const children3 = subH1 < subH2 ? [n1, n2] : [n2, n1];
    return new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), children3);
  }
}
function mergeLeaves(edit, shift2, h1, n1, h2, n2) {
  let stack = void 0;
  let currentShift = shift2;
  while (true) {
    const res = mergeLeavesInner(edit, currentShift, h1, n1, h2, n2);
    if (typeof res === "function") {
      stack = make8(res, stack);
      currentShift = currentShift + SIZE;
    } else {
      let final = res;
      while (stack != null) {
        final = stack.value(final);
        stack = stack.previous;
      }
      return final;
    }
  }
}

// node_modules/effect/dist/esm/internal/hashMap.js
var HashMapSymbolKey = "effect/HashMap";
var HashMapTypeId = /* @__PURE__ */ Symbol.for(HashMapSymbolKey);
var HashMapProto = {
  [HashMapTypeId]: HashMapTypeId,
  [Symbol.iterator]() {
    return new HashMapIterator(this, (k, v) => [k, v]);
  },
  [symbol]() {
    let hash2 = hash(HashMapSymbolKey);
    for (const item of this) {
      hash2 ^= pipe(hash(item[0]), combine(hash(item[1])));
    }
    return cached(this, hash2);
  },
  [symbol2](that) {
    if (isHashMap(that)) {
      if (that._size !== this._size) {
        return false;
      }
      for (const item of this) {
        const elem = pipe(that, getHash(item[0], hash(item[0])));
        if (isNone2(elem)) {
          return false;
        } else {
          if (!equals(item[1], elem.value)) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashMap",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeImpl = (editable, edit, root, size13) => {
  const map25 = Object.create(HashMapProto);
  map25._editable = editable;
  map25._edit = edit;
  map25._root = root;
  map25._size = size13;
  return map25;
};
var HashMapIterator = class _HashMapIterator {
  map;
  f;
  v;
  constructor(map25, f) {
    this.map = map25;
    this.f = f;
    this.v = visitLazy(this.map._root, this.f, void 0);
  }
  next() {
    if (isNone2(this.v)) {
      return {
        done: true,
        value: void 0
      };
    }
    const v0 = this.v.value;
    this.v = applyCont(v0.cont);
    return {
      done: false,
      value: v0.value
    };
  }
  [Symbol.iterator]() {
    return new _HashMapIterator(this.map, this.f);
  }
};
var applyCont = (cont) => cont ? visitLazyChildren(cont[0], cont[1], cont[2], cont[3], cont[4]) : none2();
var visitLazy = (node, f, cont = void 0) => {
  switch (node._tag) {
    case "LeafNode": {
      if (isSome2(node.value)) {
        return some2({
          value: f(node.key, node.value.value),
          cont
        });
      }
      return applyCont(cont);
    }
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode": {
      const children3 = node.children;
      return visitLazyChildren(children3.length, children3, 0, f, cont);
    }
    default: {
      return applyCont(cont);
    }
  }
};
var visitLazyChildren = (len, children3, i, f, cont) => {
  while (i < len) {
    const child = children3[i++];
    if (child && !isEmptyNode(child)) {
      return visitLazy(child, f, [len, children3, i, f, cont]);
    }
  }
  return applyCont(cont);
};
var _empty3 = /* @__PURE__ */ makeImpl(false, 0, /* @__PURE__ */ new EmptyNode(), 0);
var empty5 = () => _empty3;
var fromIterable4 = (entries2) => {
  const map25 = beginMutation(empty5());
  for (const entry of entries2) {
    set(map25, entry[0], entry[1]);
  }
  return endMutation(map25);
};
var isHashMap = (u) => hasProperty(u, HashMapTypeId);
var isEmpty2 = (self) => self && isEmptyNode(self._root);
var get5 = /* @__PURE__ */ dual(2, (self, key) => getHash(self, key, hash(key)));
var getHash = /* @__PURE__ */ dual(3, (self, key, hash2) => {
  let node = self._root;
  let shift2 = 0;
  while (true) {
    switch (node._tag) {
      case "LeafNode": {
        return equals(key, node.key) ? node.value : none2();
      }
      case "CollisionNode": {
        if (hash2 === node.hash) {
          const children3 = node.children;
          for (let i = 0, len = children3.length; i < len; ++i) {
            const child = children3[i];
            if ("key" in child && equals(key, child.key)) {
              return child.value;
            }
          }
        }
        return none2();
      }
      case "IndexedNode": {
        const frag = hashFragment(shift2, hash2);
        const bit = toBitmap(frag);
        if (node.mask & bit) {
          node = node.children[fromBitmap(node.mask, bit)];
          shift2 += SIZE;
          break;
        }
        return none2();
      }
      case "ArrayNode": {
        node = node.children[hashFragment(shift2, hash2)];
        if (node) {
          shift2 += SIZE;
          break;
        }
        return none2();
      }
      default:
        return none2();
    }
  }
});
var has = /* @__PURE__ */ dual(2, (self, key) => isSome2(getHash(self, key, hash(key))));
var set = /* @__PURE__ */ dual(3, (self, key, value) => modifyAt(self, key, () => some2(value)));
var setTree = /* @__PURE__ */ dual(3, (self, newRoot, newSize) => {
  if (self._editable) {
    self._root = newRoot;
    self._size = newSize;
    return self;
  }
  return newRoot === self._root ? self : makeImpl(self._editable, self._edit, newRoot, newSize);
});
var keys = (self) => new HashMapIterator(self, (key) => key);
var size = (self) => self._size;
var beginMutation = (self) => makeImpl(true, self._edit + 1, self._root, self._size);
var endMutation = (self) => {
  self._editable = false;
  return self;
};
var mutate = /* @__PURE__ */ dual(2, (self, f) => {
  const transient = beginMutation(self);
  f(transient);
  return endMutation(transient);
});
var modifyAt = /* @__PURE__ */ dual(3, (self, key, f) => modifyHash(self, key, hash(key), f));
var modifyHash = /* @__PURE__ */ dual(4, (self, key, hash2, f) => {
  const size13 = {
    value: self._size
  };
  const newRoot = self._root.modify(self._editable ? self._edit : NaN, 0, f, hash2, key, size13);
  return pipe(self, setTree(newRoot, size13.value));
});
var remove2 = /* @__PURE__ */ dual(2, (self, key) => modifyAt(self, key, none2));
var map5 = /* @__PURE__ */ dual(2, (self, f) => reduce3(self, empty5(), (map25, value, key) => set(map25, key, f(value, key))));
var forEach = /* @__PURE__ */ dual(2, (self, f) => reduce3(self, void 0, (_, value, key) => f(value, key)));
var reduce3 = /* @__PURE__ */ dual(3, (self, zero2, f) => {
  const root = self._root;
  if (root._tag === "LeafNode") {
    return isSome2(root.value) ? f(zero2, root.value.value, root.key) : zero2;
  }
  if (root._tag === "EmptyNode") {
    return zero2;
  }
  const toVisit = [root.children];
  let children3;
  while (children3 = toVisit.pop()) {
    for (let i = 0, len = children3.length; i < len; ) {
      const child = children3[i++];
      if (child && !isEmptyNode(child)) {
        if (child._tag === "LeafNode") {
          if (isSome2(child.value)) {
            zero2 = f(zero2, child.value.value, child.key);
          }
        } else {
          toVisit.push(child.children);
        }
      }
    }
  }
  return zero2;
});

// node_modules/effect/dist/esm/internal/hashSet.js
var HashSetSymbolKey = "effect/HashSet";
var HashSetTypeId = /* @__PURE__ */ Symbol.for(HashSetSymbolKey);
var HashSetProto = {
  [HashSetTypeId]: HashSetTypeId,
  [Symbol.iterator]() {
    return keys(this._keyMap);
  },
  [symbol]() {
    return cached(this, combine(hash(this._keyMap))(hash(HashSetSymbolKey)));
  },
  [symbol2](that) {
    if (isHashSet(that)) {
      return size(this._keyMap) === size(that._keyMap) && equals(this._keyMap, that._keyMap);
    }
    return false;
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashSet",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeImpl2 = (keyMap) => {
  const set7 = Object.create(HashSetProto);
  set7._keyMap = keyMap;
  return set7;
};
var isHashSet = (u) => hasProperty(u, HashSetTypeId);
var _empty4 = /* @__PURE__ */ makeImpl2(/* @__PURE__ */ empty5());
var empty6 = () => _empty4;
var fromIterable5 = (elements) => {
  const set7 = beginMutation2(empty6());
  for (const value of elements) {
    add3(set7, value);
  }
  return endMutation2(set7);
};
var make9 = (...elements) => {
  const set7 = beginMutation2(empty6());
  for (const value of elements) {
    add3(set7, value);
  }
  return endMutation2(set7);
};
var has2 = /* @__PURE__ */ dual(2, (self, value) => has(self._keyMap, value));
var some3 = /* @__PURE__ */ dual(2, (self, f) => {
  let found = false;
  for (const value of self) {
    found = f(value);
    if (found) {
      break;
    }
  }
  return found;
});
var every = /* @__PURE__ */ dual(2, (self, refinement) => !some3(self, (a) => !refinement(a)));
var size2 = (self) => size(self._keyMap);
var beginMutation2 = (self) => makeImpl2(beginMutation(self._keyMap));
var endMutation2 = (self) => {
  self._keyMap._editable = false;
  return self;
};
var mutate2 = /* @__PURE__ */ dual(2, (self, f) => {
  const transient = beginMutation2(self);
  f(transient);
  return endMutation2(transient);
});
var add3 = /* @__PURE__ */ dual(2, (self, value) => self._keyMap._editable ? (set(value, true)(self._keyMap), self) : makeImpl2(set(value, true)(self._keyMap)));
var remove3 = /* @__PURE__ */ dual(2, (self, value) => self._keyMap._editable ? (remove2(value)(self._keyMap), self) : makeImpl2(remove2(value)(self._keyMap)));
var difference2 = /* @__PURE__ */ dual(2, (self, that) => mutate2(self, (set7) => {
  for (const value of that) {
    remove3(set7, value);
  }
}));
var union2 = /* @__PURE__ */ dual(2, (self, that) => mutate2(empty6(), (set7) => {
  forEach2(self, (value) => add3(set7, value));
  for (const value of that) {
    add3(set7, value);
  }
}));
var map6 = /* @__PURE__ */ dual(2, (self, f) => mutate2(empty6(), (set7) => {
  forEach2(self, (a) => {
    const b = f(a);
    if (!has2(set7, b)) {
      add3(set7, b);
    }
  });
}));
var flatMap3 = /* @__PURE__ */ dual(2, (self, f) => mutate2(empty6(), (set7) => {
  forEach2(self, (a) => {
    for (const b of f(a)) {
      if (!has2(set7, b)) {
        add3(set7, b);
      }
    }
  });
}));
var forEach2 = /* @__PURE__ */ dual(2, (self, f) => forEach(self._keyMap, (_, k) => f(k)));
var reduce4 = /* @__PURE__ */ dual(3, (self, zero2, f) => reduce3(self._keyMap, zero2, (z, _, a) => f(z, a)));

// node_modules/effect/dist/esm/HashSet.js
var empty7 = empty6;
var fromIterable6 = fromIterable5;
var make10 = make9;
var has3 = has2;
var every2 = every;
var size3 = size2;
var add4 = add3;
var remove4 = remove3;
var difference3 = difference2;
var union3 = union2;
var map7 = map6;
var flatMap4 = flatMap3;
var reduce5 = reduce4;

// node_modules/effect/dist/esm/MutableRef.js
var TypeId7 = /* @__PURE__ */ Symbol.for("effect/MutableRef");
var MutableRefProto = {
  [TypeId7]: TypeId7,
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableRef",
      current: toJSON(this.current)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make11 = (value) => {
  const ref = Object.create(MutableRefProto);
  ref.current = value;
  return ref;
};
var compareAndSet = /* @__PURE__ */ dual(3, (self, oldValue, newValue) => {
  if (equals(oldValue, self.current)) {
    self.current = newValue;
    return true;
  }
  return false;
});
var get6 = (self) => self.current;
var set2 = /* @__PURE__ */ dual(2, (self, value) => {
  self.current = value;
  return self;
});

// node_modules/effect/dist/esm/internal/fiberId.js
var FiberIdSymbolKey = "effect/FiberId";
var FiberIdTypeId = /* @__PURE__ */ Symbol.for(FiberIdSymbolKey);
var OP_NONE = "None";
var OP_RUNTIME = "Runtime";
var OP_COMPOSITE = "Composite";
var emptyHash = /* @__PURE__ */ string(`${FiberIdSymbolKey}-${OP_NONE}`);
var None = class {
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_NONE;
  id = -1;
  startTimeMillis = -1;
  [symbol]() {
    return emptyHash;
  }
  [symbol2](that) {
    return isFiberId(that) && that._tag === OP_NONE;
  }
  toString() {
    return format(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var Runtime = class {
  id;
  startTimeMillis;
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_RUNTIME;
  constructor(id3, startTimeMillis) {
    this.id = id3;
    this.startTimeMillis = startTimeMillis;
  }
  [symbol]() {
    return cached(this, string(`${FiberIdSymbolKey}-${this._tag}-${this.id}-${this.startTimeMillis}`));
  }
  [symbol2](that) {
    return isFiberId(that) && that._tag === OP_RUNTIME && this.id === that.id && this.startTimeMillis === that.startTimeMillis;
  }
  toString() {
    return format(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      id: this.id,
      startTimeMillis: this.startTimeMillis
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var Composite = class {
  left;
  right;
  [FiberIdTypeId] = FiberIdTypeId;
  _tag = OP_COMPOSITE;
  constructor(left3, right3) {
    this.left = left3;
    this.right = right3;
  }
  _hash;
  [symbol]() {
    return pipe(string(`${FiberIdSymbolKey}-${this._tag}`), combine(hash(this.left)), combine(hash(this.right)), cached(this));
  }
  [symbol2](that) {
    return isFiberId(that) && that._tag === OP_COMPOSITE && equals(this.left, that.left) && equals(this.right, that.right);
  }
  toString() {
    return format(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      left: toJSON(this.left),
      right: toJSON(this.right)
    };
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var none3 = /* @__PURE__ */ new None();
var isFiberId = (self) => hasProperty(self, FiberIdTypeId);
var isNone3 = (self) => {
  return self._tag === OP_NONE || pipe(toSet(self), every2((id3) => isNone3(id3)));
};
var combine2 = /* @__PURE__ */ dual(2, (self, that) => {
  if (self._tag === OP_NONE) {
    return that;
  }
  if (that._tag === OP_NONE) {
    return self;
  }
  return new Composite(self, that);
});
var combineAll = (fiberIds) => {
  return pipe(fiberIds, reduce5(none3, (a, b) => combine2(b)(a)));
};
var getOrElse4 = /* @__PURE__ */ dual(2, (self, that) => isNone3(self) ? that : self);
var ids = (self) => {
  switch (self._tag) {
    case OP_NONE: {
      return empty7();
    }
    case OP_RUNTIME: {
      return make10(self.id);
    }
    case OP_COMPOSITE: {
      return pipe(ids(self.left), union3(ids(self.right)));
    }
  }
};
var _fiberCounter = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Fiber/Id/_fiberCounter"), () => make11(0));
var threadName = (self) => {
  const identifiers = Array.from(ids(self)).map((n) => `#${n}`).join(",");
  return identifiers;
};
var toSet = (self) => {
  switch (self._tag) {
    case OP_NONE: {
      return empty7();
    }
    case OP_RUNTIME: {
      return make10(self);
    }
    case OP_COMPOSITE: {
      return pipe(toSet(self.left), union3(toSet(self.right)));
    }
  }
};
var unsafeMake2 = () => {
  const id3 = get6(_fiberCounter);
  pipe(_fiberCounter, set2(id3 + 1));
  return new Runtime(id3, Date.now());
};

// node_modules/effect/dist/esm/FiberId.js
var none4 = none3;
var combine3 = combine2;
var combineAll2 = combineAll;
var getOrElse5 = getOrElse4;
var ids2 = ids;
var threadName2 = threadName;
var unsafeMake3 = unsafeMake2;

// node_modules/effect/dist/esm/HashMap.js
var empty8 = empty5;
var fromIterable7 = fromIterable4;
var isEmpty3 = isEmpty2;
var get7 = get5;
var set3 = set;
var keys2 = keys;
var mutate3 = mutate;
var modifyAt2 = modifyAt;
var map8 = map5;
var forEach3 = forEach;
var reduce6 = reduce3;

// node_modules/effect/dist/esm/List.js
var TypeId8 = /* @__PURE__ */ Symbol.for("effect/List");
var toArray2 = (self) => fromIterable2(self);
var getEquivalence4 = (isEquivalent) => mapInput(getEquivalence2(isEquivalent), toArray2);
var _equivalence4 = /* @__PURE__ */ getEquivalence4(equals);
var ConsProto = {
  [TypeId8]: TypeId8,
  _tag: "Cons",
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Cons",
      values: toArray2(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol2](that) {
    return isList(that) && this._tag === that._tag && _equivalence4(this, that);
  },
  [symbol]() {
    return cached(this, array2(toArray2(this)));
  },
  [Symbol.iterator]() {
    let done10 = false;
    let self = this;
    return {
      next() {
        if (done10) {
          return this.return();
        }
        if (self._tag === "Nil") {
          done10 = true;
          return this.return();
        }
        const value = self.head;
        self = self.tail;
        return {
          done: done10,
          value
        };
      },
      return(value) {
        if (!done10) {
          done10 = true;
        }
        return {
          done: true,
          value
        };
      }
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeCons = (head6, tail) => {
  const cons2 = Object.create(ConsProto);
  cons2.head = head6;
  cons2.tail = tail;
  return cons2;
};
var NilHash = /* @__PURE__ */ string("Nil");
var NilProto = {
  [TypeId8]: TypeId8,
  _tag: "Nil",
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Nil"
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol]() {
    return NilHash;
  },
  [symbol2](that) {
    return isList(that) && this._tag === that._tag;
  },
  [Symbol.iterator]() {
    return {
      next() {
        return {
          done: true,
          value: void 0
        };
      }
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var _Nil = /* @__PURE__ */ Object.create(NilProto);
var isList = (u) => hasProperty(u, TypeId8);
var isNil = (self) => self._tag === "Nil";
var isCons = (self) => self._tag === "Cons";
var nil = () => _Nil;
var cons = (head6, tail) => makeCons(head6, tail);
var empty9 = nil;
var of3 = (value) => makeCons(value, _Nil);
var appendAll3 = /* @__PURE__ */ dual(2, (self, that) => prependAll(that, self));
var prepend3 = /* @__PURE__ */ dual(2, (self, element) => cons(element, self));
var prependAll = /* @__PURE__ */ dual(2, (self, prefix) => {
  if (isNil(self)) {
    return prefix;
  } else if (isNil(prefix)) {
    return self;
  } else {
    const result = makeCons(prefix.head, self);
    let curr = result;
    let that = prefix.tail;
    while (!isNil(that)) {
      const temp = makeCons(that.head, self);
      curr.tail = temp;
      curr = temp;
      that = that.tail;
    }
    return result;
  }
});
var reduce7 = /* @__PURE__ */ dual(3, (self, zero2, f) => {
  let acc = zero2;
  let these = self;
  while (!isNil(these)) {
    acc = f(acc, these.head);
    these = these.tail;
  }
  return acc;
});
var reverse3 = (self) => {
  let result = empty9();
  let these = self;
  while (!isNil(these)) {
    result = prepend3(result, these.head);
    these = these.tail;
  }
  return result;
};

// node_modules/effect/dist/esm/internal/data.js
var ArrayProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Array.prototype), {
  [symbol]() {
    return cached(this, array2(this));
  },
  [symbol2](that) {
    if (Array.isArray(that) && this.length === that.length) {
      return this.every((v, i) => equals(v, that[i]));
    } else {
      return false;
    }
  }
});
var Structural = /* @__PURE__ */ (function() {
  function Structural3(args2) {
    if (args2) {
      Object.assign(this, args2);
    }
  }
  Structural3.prototype = StructuralPrototype;
  return Structural3;
})();
var struct = (as13) => Object.assign(Object.create(StructuralPrototype), as13);

// node_modules/effect/dist/esm/internal/differ/contextPatch.js
var ContextPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferContextPatch");
function variance(a) {
  return a;
}
var PatchProto = {
  ...Structural.prototype,
  [ContextPatchTypeId]: {
    _Value: variance,
    _Patch: variance
  }
};
var EmptyProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "Empty"
});
var _empty5 = /* @__PURE__ */ Object.create(EmptyProto);
var empty10 = () => _empty5;
var AndThenProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "AndThen"
});
var makeAndThen = (first2, second) => {
  const o = Object.create(AndThenProto);
  o.first = first2;
  o.second = second;
  return o;
};
var AddServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "AddService"
});
var makeAddService = (key, service3) => {
  const o = Object.create(AddServiceProto);
  o.key = key;
  o.service = service3;
  return o;
};
var RemoveServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "RemoveService"
});
var makeRemoveService = (key) => {
  const o = Object.create(RemoveServiceProto);
  o.key = key;
  return o;
};
var UpdateServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "UpdateService"
});
var makeUpdateService = (key, update5) => {
  const o = Object.create(UpdateServiceProto);
  o.key = key;
  o.update = update5;
  return o;
};
var diff = (oldValue, newValue) => {
  const missingServices = new Map(oldValue.unsafeMap);
  let patch9 = empty10();
  for (const [tag2, newService] of newValue.unsafeMap.entries()) {
    if (missingServices.has(tag2)) {
      const old = missingServices.get(tag2);
      missingServices.delete(tag2);
      if (!equals(old, newService)) {
        patch9 = combine4(makeUpdateService(tag2, () => newService))(patch9);
      }
    } else {
      missingServices.delete(tag2);
      patch9 = combine4(makeAddService(tag2, newService))(patch9);
    }
  }
  for (const [tag2] of missingServices.entries()) {
    patch9 = combine4(makeRemoveService(tag2))(patch9);
  }
  return patch9;
};
var combine4 = /* @__PURE__ */ dual(2, (self, that) => makeAndThen(self, that));
var patch = /* @__PURE__ */ dual(2, (self, context7) => {
  if (self._tag === "Empty") {
    return context7;
  }
  let wasServiceUpdated = false;
  let patches = of2(self);
  const updatedContext = new Map(context7.unsafeMap);
  while (isNonEmpty2(patches)) {
    const head6 = headNonEmpty2(patches);
    const tail = tailNonEmpty2(patches);
    switch (head6._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AddService": {
        updatedContext.set(head6.key, head6.service);
        patches = tail;
        break;
      }
      case "AndThen": {
        patches = prepend2(prepend2(tail, head6.second), head6.first);
        break;
      }
      case "RemoveService": {
        updatedContext.delete(head6.key);
        patches = tail;
        break;
      }
      case "UpdateService": {
        updatedContext.set(head6.key, head6.update(updatedContext.get(head6.key)));
        wasServiceUpdated = true;
        patches = tail;
        break;
      }
    }
  }
  if (!wasServiceUpdated) {
    return makeContext(updatedContext);
  }
  const map25 = /* @__PURE__ */ new Map();
  for (const [tag2] of context7.unsafeMap) {
    if (updatedContext.has(tag2)) {
      map25.set(tag2, updatedContext.get(tag2));
      updatedContext.delete(tag2);
    }
  }
  for (const [tag2, s] of updatedContext) {
    map25.set(tag2, s);
  }
  return makeContext(map25);
});

// node_modules/effect/dist/esm/internal/differ/hashSetPatch.js
var HashSetPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferHashSetPatch");
function variance2(a) {
  return a;
}
var PatchProto2 = {
  ...Structural.prototype,
  [HashSetPatchTypeId]: {
    _Value: variance2,
    _Key: variance2,
    _Patch: variance2
  }
};
var EmptyProto2 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "Empty"
});
var _empty6 = /* @__PURE__ */ Object.create(EmptyProto2);
var empty11 = () => _empty6;
var AndThenProto2 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "AndThen"
});
var makeAndThen2 = (first2, second) => {
  const o = Object.create(AndThenProto2);
  o.first = first2;
  o.second = second;
  return o;
};
var AddProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "Add"
});
var makeAdd = (value) => {
  const o = Object.create(AddProto);
  o.value = value;
  return o;
};
var RemoveProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto2), {
  _tag: "Remove"
});
var makeRemove = (value) => {
  const o = Object.create(RemoveProto);
  o.value = value;
  return o;
};
var diff2 = (oldValue, newValue) => {
  const [removed, patch9] = reduce5([oldValue, empty11()], ([set7, patch10], value) => {
    if (has3(value)(set7)) {
      return [remove4(value)(set7), patch10];
    }
    return [set7, combine5(makeAdd(value))(patch10)];
  })(newValue);
  return reduce5(patch9, (patch10, value) => combine5(makeRemove(value))(patch10))(removed);
};
var combine5 = /* @__PURE__ */ dual(2, (self, that) => makeAndThen2(self, that));
var patch2 = /* @__PURE__ */ dual(2, (self, oldValue) => {
  if (self._tag === "Empty") {
    return oldValue;
  }
  let set7 = oldValue;
  let patches = of2(self);
  while (isNonEmpty2(patches)) {
    const head6 = headNonEmpty2(patches);
    const tail = tailNonEmpty2(patches);
    switch (head6._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AndThen": {
        patches = prepend2(head6.first)(prepend2(head6.second)(tail));
        break;
      }
      case "Add": {
        set7 = add4(head6.value)(set7);
        patches = tail;
        break;
      }
      case "Remove": {
        set7 = remove4(head6.value)(set7);
        patches = tail;
      }
    }
  }
  return set7;
});

// node_modules/effect/dist/esm/internal/differ/readonlyArrayPatch.js
var ReadonlyArrayPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferReadonlyArrayPatch");
function variance3(a) {
  return a;
}
var PatchProto3 = {
  ...Structural.prototype,
  [ReadonlyArrayPatchTypeId]: {
    _Value: variance3,
    _Patch: variance3
  }
};
var EmptyProto3 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto3), {
  _tag: "Empty"
});
var _empty7 = /* @__PURE__ */ Object.create(EmptyProto3);
var empty12 = () => _empty7;
var AndThenProto3 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto3), {
  _tag: "AndThen"
});
var makeAndThen3 = (first2, second) => {
  const o = Object.create(AndThenProto3);
  o.first = first2;
  o.second = second;
  return o;
};
var AppendProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto3), {
  _tag: "Append"
});
var makeAppend = (values3) => {
  const o = Object.create(AppendProto);
  o.values = values3;
  return o;
};
var SliceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto3), {
  _tag: "Slice"
});
var makeSlice = (from, until) => {
  const o = Object.create(SliceProto);
  o.from = from;
  o.until = until;
  return o;
};
var UpdateProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto3), {
  _tag: "Update"
});
var makeUpdate = (index, patch9) => {
  const o = Object.create(UpdateProto);
  o.index = index;
  o.patch = patch9;
  return o;
};
var diff3 = (options) => {
  let i = 0;
  let patch9 = empty12();
  while (i < options.oldValue.length && i < options.newValue.length) {
    const oldElement = options.oldValue[i];
    const newElement = options.newValue[i];
    const valuePatch = options.differ.diff(oldElement, newElement);
    if (!equals(valuePatch, options.differ.empty)) {
      patch9 = combine6(patch9, makeUpdate(i, valuePatch));
    }
    i = i + 1;
  }
  if (i < options.oldValue.length) {
    patch9 = combine6(patch9, makeSlice(0, i));
  }
  if (i < options.newValue.length) {
    patch9 = combine6(patch9, makeAppend(drop(i)(options.newValue)));
  }
  return patch9;
};
var combine6 = /* @__PURE__ */ dual(2, (self, that) => makeAndThen3(self, that));
var patch3 = /* @__PURE__ */ dual(3, (self, oldValue, differ3) => {
  if (self._tag === "Empty") {
    return oldValue;
  }
  let readonlyArray2 = oldValue.slice();
  let patches = of(self);
  while (isNonEmptyArray2(patches)) {
    const head6 = headNonEmpty(patches);
    const tail = tailNonEmpty(patches);
    switch (head6._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AndThen": {
        tail.unshift(head6.first, head6.second);
        patches = tail;
        break;
      }
      case "Append": {
        for (const value of head6.values) {
          readonlyArray2.push(value);
        }
        patches = tail;
        break;
      }
      case "Slice": {
        readonlyArray2 = readonlyArray2.slice(head6.from, head6.until);
        patches = tail;
        break;
      }
      case "Update": {
        readonlyArray2[head6.index] = differ3.patch(head6.patch, readonlyArray2[head6.index]);
        patches = tail;
        break;
      }
    }
  }
  return readonlyArray2;
});

// node_modules/effect/dist/esm/internal/differ.js
var DifferTypeId = /* @__PURE__ */ Symbol.for("effect/Differ");
var DifferProto = {
  [DifferTypeId]: {
    _P: identity,
    _V: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make14 = (params) => {
  const differ3 = Object.create(DifferProto);
  differ3.empty = params.empty;
  differ3.diff = params.diff;
  differ3.combine = params.combine;
  differ3.patch = params.patch;
  return differ3;
};
var environment = () => make14({
  empty: empty10(),
  combine: (first2, second) => combine4(second)(first2),
  diff: (oldValue, newValue) => diff(oldValue, newValue),
  patch: (patch9, oldValue) => patch(oldValue)(patch9)
});
var hashSet = () => make14({
  empty: empty11(),
  combine: (first2, second) => combine5(second)(first2),
  diff: (oldValue, newValue) => diff2(oldValue, newValue),
  patch: (patch9, oldValue) => patch2(oldValue)(patch9)
});
var readonlyArray = (differ3) => make14({
  empty: empty12(),
  combine: (first2, second) => combine6(first2, second),
  diff: (oldValue, newValue) => diff3({
    oldValue,
    newValue,
    differ: differ3
  }),
  patch: (patch9, oldValue) => patch3(patch9, oldValue, differ3)
});
var update = () => updateWith((_, a) => a);
var updateWith = (f) => make14({
  empty: identity,
  combine: (first2, second) => {
    if (first2 === identity) {
      return second;
    }
    if (second === identity) {
      return first2;
    }
    return (a) => second(first2(a));
  },
  diff: (oldValue, newValue) => {
    if (equals(oldValue, newValue)) {
      return identity;
    }
    return constant(newValue);
  },
  patch: (patch9, oldValue) => f(oldValue, patch9(oldValue))
});

// node_modules/effect/dist/esm/internal/runtimeFlagsPatch.js
var BIT_MASK = 255;
var BIT_SHIFT = 8;
var active = (patch9) => patch9 & BIT_MASK;
var enabled = (patch9) => patch9 >> BIT_SHIFT & BIT_MASK;
var make15 = (active2, enabled2) => (active2 & BIT_MASK) + ((enabled2 & active2 & BIT_MASK) << BIT_SHIFT);
var empty13 = /* @__PURE__ */ make15(0, 0);
var enable = (flag) => make15(flag, flag);
var disable = (flag) => make15(flag, 0);
var exclude = /* @__PURE__ */ dual(2, (self, flag) => make15(active(self) & ~flag, enabled(self)));
var andThen2 = /* @__PURE__ */ dual(2, (self, that) => self | that);
var invert = (n) => ~n >>> 0 & BIT_MASK;

// node_modules/effect/dist/esm/internal/runtimeFlags.js
var None2 = 0;
var Interruption = 1 << 0;
var OpSupervision = 1 << 1;
var RuntimeMetrics = 1 << 2;
var WindDown = 1 << 4;
var CooperativeYielding = 1 << 5;
var cooperativeYielding = (self) => isEnabled(self, CooperativeYielding);
var disable2 = /* @__PURE__ */ dual(2, (self, flag) => self & ~flag);
var enable2 = /* @__PURE__ */ dual(2, (self, flag) => self | flag);
var interruptible = (self) => interruption(self) && !windDown(self);
var interruption = (self) => isEnabled(self, Interruption);
var isEnabled = /* @__PURE__ */ dual(2, (self, flag) => (self & flag) !== 0);
var make16 = (...flags) => flags.reduce((a, b) => a | b, 0);
var none5 = /* @__PURE__ */ make16(None2);
var runtimeMetrics = (self) => isEnabled(self, RuntimeMetrics);
var windDown = (self) => isEnabled(self, WindDown);
var diff4 = /* @__PURE__ */ dual(2, (self, that) => make15(self ^ that, that));
var patch4 = /* @__PURE__ */ dual(2, (self, patch9) => self & (invert(active(patch9)) | enabled(patch9)) | active(patch9) & enabled(patch9));
var differ = /* @__PURE__ */ make14({
  empty: empty13,
  diff: (oldValue, newValue) => diff4(oldValue, newValue),
  combine: (first2, second) => andThen2(second)(first2),
  patch: (_patch, oldValue) => patch4(oldValue, _patch)
});

// node_modules/effect/dist/esm/RuntimeFlagsPatch.js
var empty14 = empty13;
var enable3 = enable;
var disable3 = disable;
var exclude2 = exclude;

// node_modules/effect/dist/esm/internal/blockedRequests.js
var empty15 = {
  _tag: "Empty"
};
var par = (self, that) => ({
  _tag: "Par",
  left: self,
  right: that
});
var seq = (self, that) => ({
  _tag: "Seq",
  left: self,
  right: that
});
var single = (dataSource, blockedRequest) => ({
  _tag: "Single",
  dataSource,
  blockedRequest
});
var flatten4 = (self) => {
  let current = of3(self);
  let updated = empty9();
  while (1) {
    const [parallel5, sequential5] = reduce7(current, [parallelCollectionEmpty(), empty9()], ([parallel6, sequential6], blockedRequest) => {
      const [par2, seq2] = step(blockedRequest);
      return [parallelCollectionCombine(parallel6, par2), appendAll3(sequential6, seq2)];
    });
    updated = merge4(updated, parallel5);
    if (isNil(sequential5)) {
      return reverse3(updated);
    }
    current = sequential5;
  }
  throw new Error("BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/effect/issues");
};
var step = (requests) => {
  let current = requests;
  let parallel5 = parallelCollectionEmpty();
  let stack = empty9();
  let sequential5 = empty9();
  while (1) {
    switch (current._tag) {
      case "Empty": {
        if (isNil(stack)) {
          return [parallel5, sequential5];
        }
        current = stack.head;
        stack = stack.tail;
        break;
      }
      case "Par": {
        stack = cons(current.right, stack);
        current = current.left;
        break;
      }
      case "Seq": {
        const left3 = current.left;
        const right3 = current.right;
        switch (left3._tag) {
          case "Empty": {
            current = right3;
            break;
          }
          case "Par": {
            const l = left3.left;
            const r = left3.right;
            current = par(seq(l, right3), seq(r, right3));
            break;
          }
          case "Seq": {
            const l = left3.left;
            const r = left3.right;
            current = seq(l, seq(r, right3));
            break;
          }
          case "Single": {
            current = left3;
            sequential5 = cons(right3, sequential5);
            break;
          }
        }
        break;
      }
      case "Single": {
        parallel5 = parallelCollectionAdd(parallel5, current);
        if (isNil(stack)) {
          return [parallel5, sequential5];
        }
        current = stack.head;
        stack = stack.tail;
        break;
      }
    }
  }
  throw new Error("BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/effect/issues");
};
var merge4 = (sequential5, parallel5) => {
  if (isNil(sequential5)) {
    return of3(parallelCollectionToSequentialCollection(parallel5));
  }
  if (parallelCollectionIsEmpty(parallel5)) {
    return sequential5;
  }
  const seqHeadKeys = sequentialCollectionKeys(sequential5.head);
  const parKeys = parallelCollectionKeys(parallel5);
  if (seqHeadKeys.length === 1 && parKeys.length === 1 && equals(seqHeadKeys[0], parKeys[0])) {
    return cons(sequentialCollectionCombine(sequential5.head, parallelCollectionToSequentialCollection(parallel5)), sequential5.tail);
  }
  return cons(parallelCollectionToSequentialCollection(parallel5), sequential5);
};
var EntryTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/Entry");
var EntryImpl = class {
  request;
  result;
  listeners;
  ownerId;
  state;
  [EntryTypeId] = blockedRequestVariance;
  constructor(request2, result, listeners, ownerId, state) {
    this.request = request2;
    this.result = result;
    this.listeners = listeners;
    this.ownerId = ownerId;
    this.state = state;
  }
};
var blockedRequestVariance = {
  /* c8 ignore next */
  _R: (_) => _
};
var makeEntry = (options) => new EntryImpl(options.request, options.result, options.listeners, options.ownerId, options.state);
var RequestBlockParallelTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockParallel");
var parallelVariance = {
  /* c8 ignore next */
  _R: (_) => _
};
var ParallelImpl = class {
  map;
  [RequestBlockParallelTypeId] = parallelVariance;
  constructor(map25) {
    this.map = map25;
  }
};
var parallelCollectionEmpty = () => new ParallelImpl(empty8());
var parallelCollectionAdd = (self, blockedRequest) => new ParallelImpl(modifyAt2(self.map, blockedRequest.dataSource, (_) => orElseSome(map2(_, append2(blockedRequest.blockedRequest)), () => of2(blockedRequest.blockedRequest))));
var parallelCollectionCombine = (self, that) => new ParallelImpl(reduce6(self.map, that.map, (map25, value, key) => set3(map25, key, match2(get7(map25, key), {
  onNone: () => value,
  onSome: (other) => appendAll2(value, other)
}))));
var parallelCollectionIsEmpty = (self) => isEmpty3(self.map);
var parallelCollectionKeys = (self) => Array.from(keys2(self.map));
var parallelCollectionToSequentialCollection = (self) => sequentialCollectionMake(map8(self.map, (x) => of2(x)));
var SequentialCollectionTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockSequential");
var sequentialVariance = {
  /* c8 ignore next */
  _R: (_) => _
};
var SequentialImpl = class {
  map;
  [SequentialCollectionTypeId] = sequentialVariance;
  constructor(map25) {
    this.map = map25;
  }
};
var sequentialCollectionMake = (map25) => new SequentialImpl(map25);
var sequentialCollectionCombine = (self, that) => new SequentialImpl(reduce6(that.map, self.map, (map25, value, key) => set3(map25, key, match2(get7(map25, key), {
  onNone: () => empty4(),
  onSome: (a) => appendAll2(a, value)
}))));
var sequentialCollectionKeys = (self) => Array.from(keys2(self.map));
var sequentialCollectionToChunk = (self) => Array.from(self.map);

// node_modules/effect/dist/esm/internal/opCodes/cause.js
var OP_DIE = "Die";
var OP_EMPTY = "Empty";
var OP_FAIL = "Fail";
var OP_INTERRUPT = "Interrupt";
var OP_PARALLEL = "Parallel";
var OP_SEQUENTIAL = "Sequential";

// node_modules/effect/dist/esm/internal/cause.js
var CauseSymbolKey = "effect/Cause";
var CauseTypeId = /* @__PURE__ */ Symbol.for(CauseSymbolKey);
var variance4 = {
  /* c8 ignore next */
  _E: (_) => _
};
var proto = {
  [CauseTypeId]: variance4,
  [symbol]() {
    return pipe(hash(CauseSymbolKey), combine(hash(flattenCause(this))), cached(this));
  },
  [symbol2](that) {
    return isCause(that) && causeEquals(this, that);
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toJSON() {
    switch (this._tag) {
      case "Empty":
        return {
          _id: "Cause",
          _tag: this._tag
        };
      case "Die":
        return {
          _id: "Cause",
          _tag: this._tag,
          defect: toJSON(this.defect)
        };
      case "Interrupt":
        return {
          _id: "Cause",
          _tag: this._tag,
          fiberId: this.fiberId.toJSON()
        };
      case "Fail":
        return {
          _id: "Cause",
          _tag: this._tag,
          failure: toJSON(this.error)
        };
      case "Sequential":
      case "Parallel":
        return {
          _id: "Cause",
          _tag: this._tag,
          left: toJSON(this.left),
          right: toJSON(this.right)
        };
    }
  },
  toString() {
    return pretty(this);
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var empty16 = /* @__PURE__ */ (() => {
  const o = /* @__PURE__ */ Object.create(proto);
  o._tag = OP_EMPTY;
  return o;
})();
var fail = (error) => {
  const o = Object.create(proto);
  o._tag = OP_FAIL;
  o.error = error;
  return o;
};
var die = (defect) => {
  const o = Object.create(proto);
  o._tag = OP_DIE;
  o.defect = defect;
  return o;
};
var interrupt = (fiberId3) => {
  const o = Object.create(proto);
  o._tag = OP_INTERRUPT;
  o.fiberId = fiberId3;
  return o;
};
var parallel = (left3, right3) => {
  const o = Object.create(proto);
  o._tag = OP_PARALLEL;
  o.left = left3;
  o.right = right3;
  return o;
};
var sequential = (left3, right3) => {
  const o = Object.create(proto);
  o._tag = OP_SEQUENTIAL;
  o.left = left3;
  o.right = right3;
  return o;
};
var isCause = (u) => hasProperty(u, CauseTypeId);
var isEmptyType = (self) => self._tag === OP_EMPTY;
var isFailType = (self) => self._tag === OP_FAIL;
var isDieType = (self) => self._tag === OP_DIE;
var isInterruptType = (self) => self._tag === OP_INTERRUPT;
var isSequentialType = (self) => self._tag === OP_SEQUENTIAL;
var isParallelType = (self) => self._tag === OP_PARALLEL;
var size4 = (self) => reduceWithContext(self, void 0, SizeCauseReducer);
var isEmpty5 = (self) => {
  if (self._tag === OP_EMPTY) {
    return true;
  }
  return reduce8(self, true, (acc, cause3) => {
    switch (cause3._tag) {
      case OP_EMPTY: {
        return some2(acc);
      }
      case OP_DIE:
      case OP_FAIL:
      case OP_INTERRUPT: {
        return some2(false);
      }
      default: {
        return none2();
      }
    }
  });
};
var isFailure = (self) => isSome2(failureOption(self));
var isDie = (self) => isSome2(dieOption(self));
var isInterrupted = (self) => isSome2(interruptOption(self));
var isInterruptedOnly = (self) => reduceWithContext(void 0, IsInterruptedOnlyCauseReducer)(self);
var failures = (self) => reverse2(reduce8(self, empty4(), (list, cause3) => cause3._tag === OP_FAIL ? some2(pipe(list, prepend2(cause3.error))) : none2()));
var defects = (self) => reverse2(reduce8(self, empty4(), (list, cause3) => cause3._tag === OP_DIE ? some2(pipe(list, prepend2(cause3.defect))) : none2()));
var interruptors = (self) => reduce8(self, empty7(), (set7, cause3) => cause3._tag === OP_INTERRUPT ? some2(pipe(set7, add4(cause3.fiberId))) : none2());
var failureOption = (self) => find(self, (cause3) => cause3._tag === OP_FAIL ? some2(cause3.error) : none2());
var failureOrCause = (self) => {
  const option3 = failureOption(self);
  switch (option3._tag) {
    case "None": {
      return right2(self);
    }
    case "Some": {
      return left2(option3.value);
    }
  }
};
var dieOption = (self) => find(self, (cause3) => cause3._tag === OP_DIE ? some2(cause3.defect) : none2());
var flipCauseOption = (self) => match5(self, {
  onEmpty: some2(empty16),
  onFail: map2(fail),
  onDie: (defect) => some2(die(defect)),
  onInterrupt: (fiberId3) => some2(interrupt(fiberId3)),
  onSequential: mergeWith(sequential),
  onParallel: mergeWith(parallel)
});
var interruptOption = (self) => find(self, (cause3) => cause3._tag === OP_INTERRUPT ? some2(cause3.fiberId) : none2());
var keepDefects = (self) => match5(self, {
  onEmpty: none2(),
  onFail: () => none2(),
  onDie: (defect) => some2(die(defect)),
  onInterrupt: () => none2(),
  onSequential: mergeWith(sequential),
  onParallel: mergeWith(parallel)
});
var keepDefectsAndElectFailures = (self) => match5(self, {
  onEmpty: none2(),
  onFail: (failure) => some2(die(failure)),
  onDie: (defect) => some2(die(defect)),
  onInterrupt: () => none2(),
  onSequential: mergeWith(sequential),
  onParallel: mergeWith(parallel)
});
var linearize = (self) => match5(self, {
  onEmpty: empty7(),
  onFail: (error) => make10(fail(error)),
  onDie: (defect) => make10(die(defect)),
  onInterrupt: (fiberId3) => make10(interrupt(fiberId3)),
  onSequential: (leftSet, rightSet) => flatMap4(leftSet, (leftCause) => map7(rightSet, (rightCause) => sequential(leftCause, rightCause))),
  onParallel: (leftSet, rightSet) => flatMap4(leftSet, (leftCause) => map7(rightSet, (rightCause) => parallel(leftCause, rightCause)))
});
var stripFailures = (self) => match5(self, {
  onEmpty: empty16,
  onFail: () => empty16,
  onDie: die,
  onInterrupt: interrupt,
  onSequential: sequential,
  onParallel: parallel
});
var electFailures = (self) => match5(self, {
  onEmpty: empty16,
  onFail: die,
  onDie: die,
  onInterrupt: interrupt,
  onSequential: sequential,
  onParallel: parallel
});
var stripSomeDefects = /* @__PURE__ */ dual(2, (self, pf) => match5(self, {
  onEmpty: some2(empty16),
  onFail: (error) => some2(fail(error)),
  onDie: (defect) => {
    const option3 = pf(defect);
    return isSome2(option3) ? none2() : some2(die(defect));
  },
  onInterrupt: (fiberId3) => some2(interrupt(fiberId3)),
  onSequential: mergeWith(sequential),
  onParallel: mergeWith(parallel)
}));
var as2 = /* @__PURE__ */ dual(2, (self, error) => map9(self, () => error));
var map9 = /* @__PURE__ */ dual(2, (self, f) => flatMap6(self, (e) => fail(f(e))));
var flatMap6 = /* @__PURE__ */ dual(2, (self, f) => match5(self, {
  onEmpty: empty16,
  onFail: (error) => f(error),
  onDie: (defect) => die(defect),
  onInterrupt: (fiberId3) => interrupt(fiberId3),
  onSequential: (left3, right3) => sequential(left3, right3),
  onParallel: (left3, right3) => parallel(left3, right3)
}));
var flatten5 = (self) => flatMap6(self, identity);
var andThen3 = /* @__PURE__ */ dual(2, (self, f) => isFunction2(f) ? flatMap6(self, f) : flatMap6(self, () => f));
var contains3 = /* @__PURE__ */ dual(2, (self, that) => {
  if (that._tag === OP_EMPTY || self === that) {
    return true;
  }
  return reduce8(self, false, (accumulator, cause3) => {
    return some2(accumulator || causeEquals(cause3, that));
  });
});
var causeEquals = (left3, right3) => {
  let leftStack = of2(left3);
  let rightStack = of2(right3);
  while (isNonEmpty2(leftStack) && isNonEmpty2(rightStack)) {
    const [leftParallel, leftSequential] = pipe(headNonEmpty2(leftStack), reduce8([empty7(), empty4()], ([parallel5, sequential5], cause3) => {
      const [par2, seq2] = evaluateCause(cause3);
      return some2([pipe(parallel5, union3(par2)), pipe(sequential5, appendAll2(seq2))]);
    }));
    const [rightParallel, rightSequential] = pipe(headNonEmpty2(rightStack), reduce8([empty7(), empty4()], ([parallel5, sequential5], cause3) => {
      const [par2, seq2] = evaluateCause(cause3);
      return some2([pipe(parallel5, union3(par2)), pipe(sequential5, appendAll2(seq2))]);
    }));
    if (!equals(leftParallel, rightParallel)) {
      return false;
    }
    leftStack = leftSequential;
    rightStack = rightSequential;
  }
  return true;
};
var flattenCause = (cause3) => {
  return flattenCauseLoop(of2(cause3), empty4());
};
var flattenCauseLoop = (causes, flattened) => {
  while (1) {
    const [parallel5, sequential5] = pipe(causes, reduce([empty7(), empty4()], ([parallel6, sequential6], cause3) => {
      const [par2, seq2] = evaluateCause(cause3);
      return [pipe(parallel6, union3(par2)), pipe(sequential6, appendAll2(seq2))];
    }));
    const updated = size3(parallel5) > 0 ? pipe(flattened, prepend2(parallel5)) : flattened;
    if (isEmpty(sequential5)) {
      return reverse2(updated);
    }
    causes = sequential5;
    flattened = updated;
  }
  throw new Error(getBugErrorMessage("Cause.flattenCauseLoop"));
};
var find = /* @__PURE__ */ dual(2, (self, pf) => {
  const stack = [self];
  while (stack.length > 0) {
    const item = stack.pop();
    const option3 = pf(item);
    switch (option3._tag) {
      case "None": {
        switch (item._tag) {
          case OP_SEQUENTIAL:
          case OP_PARALLEL: {
            stack.push(item.right);
            stack.push(item.left);
            break;
          }
        }
        break;
      }
      case "Some": {
        return option3;
      }
    }
  }
  return none2();
});
var filter6 = /* @__PURE__ */ dual(2, (self, predicate) => reduceWithContext(self, void 0, FilterCauseReducer(predicate)));
var evaluateCause = (self) => {
  let cause3 = self;
  const stack = [];
  let _parallel = empty7();
  let _sequential = empty4();
  while (cause3 !== void 0) {
    switch (cause3._tag) {
      case OP_EMPTY: {
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause3 = stack.pop();
        break;
      }
      case OP_FAIL: {
        _parallel = add4(_parallel, make6(cause3._tag, cause3.error));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause3 = stack.pop();
        break;
      }
      case OP_DIE: {
        _parallel = add4(_parallel, make6(cause3._tag, cause3.defect));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause3 = stack.pop();
        break;
      }
      case OP_INTERRUPT: {
        _parallel = add4(_parallel, make6(cause3._tag, cause3.fiberId));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause3 = stack.pop();
        break;
      }
      case OP_SEQUENTIAL: {
        switch (cause3.left._tag) {
          case OP_EMPTY: {
            cause3 = cause3.right;
            break;
          }
          case OP_SEQUENTIAL: {
            cause3 = sequential(cause3.left.left, sequential(cause3.left.right, cause3.right));
            break;
          }
          case OP_PARALLEL: {
            cause3 = parallel(sequential(cause3.left.left, cause3.right), sequential(cause3.left.right, cause3.right));
            break;
          }
          default: {
            _sequential = prepend2(_sequential, cause3.right);
            cause3 = cause3.left;
            break;
          }
        }
        break;
      }
      case OP_PARALLEL: {
        stack.push(cause3.right);
        cause3 = cause3.left;
        break;
      }
    }
  }
  throw new Error(getBugErrorMessage("Cause.evaluateCauseLoop"));
};
var SizeCauseReducer = {
  emptyCase: () => 0,
  failCase: () => 1,
  dieCase: () => 1,
  interruptCase: () => 1,
  sequentialCase: (_, left3, right3) => left3 + right3,
  parallelCase: (_, left3, right3) => left3 + right3
};
var IsInterruptedOnlyCauseReducer = {
  emptyCase: constTrue,
  failCase: constFalse,
  dieCase: constFalse,
  interruptCase: constTrue,
  sequentialCase: (_, left3, right3) => left3 && right3,
  parallelCase: (_, left3, right3) => left3 && right3
};
var FilterCauseReducer = (predicate) => ({
  emptyCase: () => empty16,
  failCase: (_, error) => fail(error),
  dieCase: (_, defect) => die(defect),
  interruptCase: (_, fiberId3) => interrupt(fiberId3),
  sequentialCase: (_, left3, right3) => {
    if (predicate(left3)) {
      if (predicate(right3)) {
        return sequential(left3, right3);
      }
      return left3;
    }
    if (predicate(right3)) {
      return right3;
    }
    return empty16;
  },
  parallelCase: (_, left3, right3) => {
    if (predicate(left3)) {
      if (predicate(right3)) {
        return parallel(left3, right3);
      }
      return left3;
    }
    if (predicate(right3)) {
      return right3;
    }
    return empty16;
  }
});
var OP_SEQUENTIAL_CASE = "SequentialCase";
var OP_PARALLEL_CASE = "ParallelCase";
var match5 = /* @__PURE__ */ dual(2, (self, {
  onDie,
  onEmpty,
  onFail,
  onInterrupt: onInterrupt3,
  onParallel,
  onSequential
}) => {
  return reduceWithContext(self, void 0, {
    emptyCase: () => onEmpty,
    failCase: (_, error) => onFail(error),
    dieCase: (_, defect) => onDie(defect),
    interruptCase: (_, fiberId3) => onInterrupt3(fiberId3),
    sequentialCase: (_, left3, right3) => onSequential(left3, right3),
    parallelCase: (_, left3, right3) => onParallel(left3, right3)
  });
});
var reduce8 = /* @__PURE__ */ dual(3, (self, zero2, pf) => {
  let accumulator = zero2;
  let cause3 = self;
  const causes = [];
  while (cause3 !== void 0) {
    const option3 = pf(accumulator, cause3);
    accumulator = isSome2(option3) ? option3.value : accumulator;
    switch (cause3._tag) {
      case OP_SEQUENTIAL: {
        causes.push(cause3.right);
        cause3 = cause3.left;
        break;
      }
      case OP_PARALLEL: {
        causes.push(cause3.right);
        cause3 = cause3.left;
        break;
      }
      default: {
        cause3 = void 0;
        break;
      }
    }
    if (cause3 === void 0 && causes.length > 0) {
      cause3 = causes.pop();
    }
  }
  return accumulator;
});
var reduceWithContext = /* @__PURE__ */ dual(3, (self, context7, reducer) => {
  const input = [self];
  const output = [];
  while (input.length > 0) {
    const cause3 = input.pop();
    switch (cause3._tag) {
      case OP_EMPTY: {
        output.push(right2(reducer.emptyCase(context7)));
        break;
      }
      case OP_FAIL: {
        output.push(right2(reducer.failCase(context7, cause3.error)));
        break;
      }
      case OP_DIE: {
        output.push(right2(reducer.dieCase(context7, cause3.defect)));
        break;
      }
      case OP_INTERRUPT: {
        output.push(right2(reducer.interruptCase(context7, cause3.fiberId)));
        break;
      }
      case OP_SEQUENTIAL: {
        input.push(cause3.right);
        input.push(cause3.left);
        output.push(left2({
          _tag: OP_SEQUENTIAL_CASE
        }));
        break;
      }
      case OP_PARALLEL: {
        input.push(cause3.right);
        input.push(cause3.left);
        output.push(left2({
          _tag: OP_PARALLEL_CASE
        }));
        break;
      }
    }
  }
  const accumulator = [];
  while (output.length > 0) {
    const either7 = output.pop();
    switch (either7._tag) {
      case "Left": {
        switch (either7.left._tag) {
          case OP_SEQUENTIAL_CASE: {
            const left3 = accumulator.pop();
            const right3 = accumulator.pop();
            const value = reducer.sequentialCase(context7, left3, right3);
            accumulator.push(value);
            break;
          }
          case OP_PARALLEL_CASE: {
            const left3 = accumulator.pop();
            const right3 = accumulator.pop();
            const value = reducer.parallelCase(context7, left3, right3);
            accumulator.push(value);
            break;
          }
        }
        break;
      }
      case "Right": {
        accumulator.push(either7.right);
        break;
      }
    }
  }
  if (accumulator.length === 0) {
    throw new Error("BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/effect/issues");
  }
  return accumulator.pop();
});
var pretty = (cause3, options) => {
  if (isInterruptedOnly(cause3)) {
    return "All fibers interrupted without errors.";
  }
  return prettyErrors(cause3).map(function(e) {
    if (options?.renderErrorCause !== true || e.cause === void 0) {
      return e.stack;
    }
    return `${e.stack} {
${renderErrorCause(e.cause, "  ")}
}`;
  }).join("\n");
};
var renderErrorCause = (cause3, prefix) => {
  const lines = cause3.stack.split("\n");
  let stack = `${prefix}[cause]: ${lines[0]}`;
  for (let i = 1, len = lines.length; i < len; i++) {
    stack += `
${prefix}${lines[i]}`;
  }
  if (cause3.cause) {
    stack += ` {
${renderErrorCause(cause3.cause, `${prefix}  `)}
${prefix}}`;
  }
  return stack;
};
var PrettyError = class _PrettyError extends globalThis.Error {
  span = void 0;
  constructor(originalError2) {
    const originalErrorIsObject = typeof originalError2 === "object" && originalError2 !== null;
    const prevLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 1;
    super(prettyErrorMessage(originalError2), originalErrorIsObject && "cause" in originalError2 && typeof originalError2.cause !== "undefined" ? {
      cause: new _PrettyError(originalError2.cause)
    } : void 0);
    if (this.message === "") {
      this.message = "An error has occurred";
    }
    Error.stackTraceLimit = prevLimit;
    this.name = originalError2 instanceof Error ? originalError2.name : "Error";
    if (originalErrorIsObject) {
      if (spanSymbol in originalError2) {
        this.span = originalError2[spanSymbol];
      }
      Object.keys(originalError2).forEach((key) => {
        if (!(key in this)) {
          this[key] = originalError2[key];
        }
      });
    }
    this.stack = prettyErrorStack(`${this.name}: ${this.message}`, originalError2 instanceof Error && originalError2.stack ? originalError2.stack : "", this.span);
  }
};
var prettyErrorMessage = (u) => {
  if (typeof u === "string") {
    return u;
  }
  if (typeof u === "object" && u !== null && u instanceof Error) {
    return u.message;
  }
  try {
    if (hasProperty(u, "toString") && isFunction2(u["toString"]) && u["toString"] !== Object.prototype.toString && u["toString"] !== globalThis.Array.prototype.toString) {
      return u["toString"]();
    }
  } catch {
  }
  return stringifyCircular(u);
};
var locationRegex = /\((.*)\)/g;
var spanToTrace = /* @__PURE__ */ globalValue("effect/Tracer/spanToTrace", () => /* @__PURE__ */ new WeakMap());
var prettyErrorStack = (message, stack, span4) => {
  const out = [message];
  const lines = stack.startsWith(message) ? stack.slice(message.length).split("\n") : stack.split("\n");
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].includes(" at new BaseEffectError") || lines[i].includes(" at new YieldableError")) {
      i++;
      continue;
    }
    if (lines[i].includes("Generator.next")) {
      break;
    }
    if (lines[i].includes("effect_internal_function")) {
      break;
    }
    out.push(lines[i].replace(/at .*effect_instruction_i.*\((.*)\)/, "at $1").replace(/EffectPrimitive\.\w+/, "<anonymous>"));
  }
  if (span4) {
    let current = span4;
    let i = 0;
    while (current && current._tag === "Span" && i < 10) {
      const stackFn = spanToTrace.get(current);
      if (typeof stackFn === "function") {
        const stack2 = stackFn();
        if (typeof stack2 === "string") {
          const locationMatchAll = stack2.matchAll(locationRegex);
          let match19 = false;
          for (const [, location] of locationMatchAll) {
            match19 = true;
            out.push(`    at ${current.name} (${location})`);
          }
          if (!match19) {
            out.push(`    at ${current.name} (${stack2.replace(/^at /, "")})`);
          }
        } else {
          out.push(`    at ${current.name}`);
        }
      } else {
        out.push(`    at ${current.name}`);
      }
      current = getOrUndefined(current.parent);
      i++;
    }
  }
  return out.join("\n");
};
var spanSymbol = /* @__PURE__ */ Symbol.for("effect/SpanAnnotation");
var prettyErrors = (cause3) => reduceWithContext(cause3, void 0, {
  emptyCase: () => [],
  dieCase: (_, unknownError) => {
    return [new PrettyError(unknownError)];
  },
  failCase: (_, error) => {
    return [new PrettyError(error)];
  },
  interruptCase: () => [],
  parallelCase: (_, l, r) => [...l, ...r],
  sequentialCase: (_, l, r) => [...l, ...r]
});

// node_modules/effect/dist/esm/internal/opCodes/deferred.js
var OP_STATE_PENDING = "Pending";
var OP_STATE_DONE = "Done";

// node_modules/effect/dist/esm/internal/deferred.js
var DeferredSymbolKey = "effect/Deferred";
var DeferredTypeId = /* @__PURE__ */ Symbol.for(DeferredSymbolKey);
var deferredVariance = {
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _
};
var pending = (joiners) => {
  return {
    _tag: OP_STATE_PENDING,
    joiners
  };
};
var done = (effect3) => {
  return {
    _tag: OP_STATE_DONE,
    effect: effect3
  };
};

// node_modules/effect/dist/esm/internal/singleShotGen.js
var SingleShotGen2 = class _SingleShotGen {
  self;
  called = false;
  constructor(self) {
    this.self = self;
  }
  next(a) {
    return this.called ? {
      value: a,
      done: true
    } : (this.called = true, {
      value: this.self,
      done: false
    });
  }
  return(a) {
    return {
      value: a,
      done: true
    };
  }
  throw(e) {
    throw e;
  }
  [Symbol.iterator]() {
    return new _SingleShotGen(this.self);
  }
};

// node_modules/effect/dist/esm/internal/core.js
var blocked = (blockedRequests, _continue3) => {
  const effect3 = new EffectPrimitive("Blocked");
  effect3.effect_instruction_i0 = blockedRequests;
  effect3.effect_instruction_i1 = _continue3;
  return effect3;
};
var runRequestBlock = (blockedRequests) => {
  const effect3 = new EffectPrimitive("RunBlocked");
  effect3.effect_instruction_i0 = blockedRequests;
  return effect3;
};
var EffectTypeId2 = /* @__PURE__ */ Symbol.for("effect/Effect");
var RevertFlags = class {
  patch;
  op;
  _op = OP_REVERT_FLAGS;
  constructor(patch9, op) {
    this.patch = patch9;
    this.op = op;
  }
};
var EffectPrimitive = class {
  _op;
  effect_instruction_i0 = void 0;
  effect_instruction_i1 = void 0;
  effect_instruction_i2 = void 0;
  trace = void 0;
  [EffectTypeId2] = effectVariance;
  constructor(_op) {
    this._op = _op;
  }
  [symbol2](that) {
    return this === that;
  }
  [symbol]() {
    return cached(this, random(this));
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Effect",
      _op: this._op,
      effect_instruction_i0: toJSON(this.effect_instruction_i0),
      effect_instruction_i1: toJSON(this.effect_instruction_i1),
      effect_instruction_i2: toJSON(this.effect_instruction_i2)
    };
  }
  toString() {
    return format(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
};
var EffectPrimitiveFailure = class {
  _op;
  effect_instruction_i0 = void 0;
  effect_instruction_i1 = void 0;
  effect_instruction_i2 = void 0;
  trace = void 0;
  [EffectTypeId2] = effectVariance;
  constructor(_op) {
    this._op = _op;
    this._tag = _op;
  }
  [symbol2](that) {
    return exitIsExit(that) && that._op === "Failure" && // @ts-expect-error
    equals(this.effect_instruction_i0, that.effect_instruction_i0);
  }
  [symbol]() {
    return pipe(
      // @ts-expect-error
      string(this._tag),
      // @ts-expect-error
      combine(hash(this.effect_instruction_i0)),
      cached(this)
    );
  }
  get cause() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      cause: this.cause.toJSON()
    };
  }
  toString() {
    return format(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
};
var EffectPrimitiveSuccess = class {
  _op;
  effect_instruction_i0 = void 0;
  effect_instruction_i1 = void 0;
  effect_instruction_i2 = void 0;
  trace = void 0;
  [EffectTypeId2] = effectVariance;
  constructor(_op) {
    this._op = _op;
    this._tag = _op;
  }
  [symbol2](that) {
    return exitIsExit(that) && that._op === "Success" && // @ts-expect-error
    equals(this.effect_instruction_i0, that.effect_instruction_i0);
  }
  [symbol]() {
    return pipe(
      // @ts-expect-error
      string(this._tag),
      // @ts-expect-error
      combine(hash(this.effect_instruction_i0)),
      cached(this)
    );
  }
  get value() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      value: toJSON(this.value)
    };
  }
  toString() {
    return format(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
};
var isEffect = (u) => hasProperty(u, EffectTypeId2);
var withFiberRuntime = (withRuntime) => {
  const effect3 = new EffectPrimitive(OP_WITH_RUNTIME);
  effect3.effect_instruction_i0 = withRuntime;
  return effect3;
};
var acquireUseRelease = /* @__PURE__ */ dual(3, (acquire, use, release) => uninterruptibleMask((restore) => flatMap7(acquire, (a) => flatMap7(exit(suspend(() => restore(use(a)))), (exit4) => {
  return suspend(() => release(a, exit4)).pipe(matchCauseEffect({
    onFailure: (cause3) => {
      switch (exit4._tag) {
        case OP_FAILURE:
          return failCause(sequential(exit4.effect_instruction_i0, cause3));
        case OP_SUCCESS:
          return failCause(cause3);
      }
    },
    onSuccess: () => exit4
  }));
}))));
var as3 = /* @__PURE__ */ dual(2, (self, value) => flatMap7(self, () => succeed(value)));
var asVoid2 = (self) => as3(self, void 0);
var custom = function() {
  const wrapper = new EffectPrimitive(OP_COMMIT);
  switch (arguments.length) {
    case 2: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.commit = arguments[1];
      break;
    }
    case 3: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.effect_instruction_i1 = arguments[1];
      wrapper.commit = arguments[2];
      break;
    }
    case 4: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.effect_instruction_i1 = arguments[1];
      wrapper.effect_instruction_i2 = arguments[2];
      wrapper.commit = arguments[3];
      break;
    }
    default: {
      throw new Error(getBugErrorMessage("you're not supposed to end up here"));
    }
  }
  return wrapper;
};
var unsafeAsync = (register, blockingOn = none4) => {
  const effect3 = new EffectPrimitive(OP_ASYNC);
  let cancelerRef = void 0;
  effect3.effect_instruction_i0 = (resume2) => {
    cancelerRef = register(resume2);
  };
  effect3.effect_instruction_i1 = blockingOn;
  return onInterrupt(effect3, (_) => isEffect(cancelerRef) ? cancelerRef : void_2);
};
var asyncInterrupt = (register, blockingOn = none4) => suspend(() => unsafeAsync(register, blockingOn));
var async_ = (resume2, blockingOn = none4) => {
  return custom(resume2, function() {
    let backingResume = void 0;
    let pendingEffect = void 0;
    function proxyResume(effect4) {
      if (backingResume) {
        backingResume(effect4);
      } else if (pendingEffect === void 0) {
        pendingEffect = effect4;
      }
    }
    const effect3 = new EffectPrimitive(OP_ASYNC);
    effect3.effect_instruction_i0 = (resume3) => {
      backingResume = resume3;
      if (pendingEffect) {
        resume3(pendingEffect);
      }
    };
    effect3.effect_instruction_i1 = blockingOn;
    let cancelerRef = void 0;
    let controllerRef = void 0;
    if (this.effect_instruction_i0.length !== 1) {
      controllerRef = new AbortController();
      cancelerRef = internalCall(() => this.effect_instruction_i0(proxyResume, controllerRef.signal));
    } else {
      cancelerRef = internalCall(() => this.effect_instruction_i0(proxyResume));
    }
    return cancelerRef || controllerRef ? onInterrupt(effect3, (_) => {
      if (controllerRef) {
        controllerRef.abort();
      }
      return cancelerRef ?? void_2;
    }) : effect3;
  });
};
var catchAllCause = /* @__PURE__ */ dual(2, (self, f) => {
  const effect3 = new EffectPrimitive(OP_ON_FAILURE);
  effect3.effect_instruction_i0 = self;
  effect3.effect_instruction_i1 = f;
  return effect3;
});
var catchAll = /* @__PURE__ */ dual(2, (self, f) => matchEffect(self, {
  onFailure: f,
  onSuccess: succeed
}));
var catchIf = /* @__PURE__ */ dual(3, (self, predicate, f) => catchAllCause(self, (cause3) => {
  const either7 = failureOrCause(cause3);
  switch (either7._tag) {
    case "Left":
      return predicate(either7.left) ? f(either7.left) : failCause(cause3);
    case "Right":
      return failCause(either7.right);
  }
}));
var catchSome = /* @__PURE__ */ dual(2, (self, pf) => catchAllCause(self, (cause3) => {
  const either7 = failureOrCause(cause3);
  switch (either7._tag) {
    case "Left":
      return pipe(pf(either7.left), getOrElse(() => failCause(cause3)));
    case "Right":
      return failCause(either7.right);
  }
}));
var checkInterruptible = (f) => withFiberRuntime((_, status3) => f(interruption(status3.runtimeFlags)));
var originalSymbol = /* @__PURE__ */ Symbol.for("effect/OriginalAnnotation");
var originalInstance = (obj) => {
  if (hasProperty(obj, originalSymbol)) {
    return obj[originalSymbol];
  }
  return obj;
};
var capture = (obj, span4) => {
  if (isSome2(span4)) {
    return new Proxy(obj, {
      has(target, p) {
        return p === spanSymbol || p === originalSymbol || p in target;
      },
      get(target, p) {
        if (p === spanSymbol) {
          return span4.value;
        }
        if (p === originalSymbol) {
          return obj;
        }
        return target[p];
      }
    });
  }
  return obj;
};
var die2 = (defect) => isObject(defect) && !(spanSymbol in defect) ? withFiberRuntime((fiber) => failCause(die(capture(defect, currentSpanFromFiber(fiber))))) : failCause(die(defect));
var dieMessage = (message) => failCauseSync(() => die(new RuntimeException(message)));
var dieSync = (evaluate2) => flatMap7(sync(evaluate2), die2);
var either2 = (self) => matchEffect(self, {
  onFailure: (e) => succeed(left2(e)),
  onSuccess: (a) => succeed(right2(a))
});
var exit = (self) => matchCause(self, {
  onFailure: exitFailCause,
  onSuccess: exitSucceed
});
var fail2 = (error) => isObject(error) && !(spanSymbol in error) ? withFiberRuntime((fiber) => failCause(fail(capture(error, currentSpanFromFiber(fiber))))) : failCause(fail(error));
var failSync = (evaluate2) => flatMap7(sync(evaluate2), fail2);
var failCause = (cause3) => {
  const effect3 = new EffectPrimitiveFailure(OP_FAILURE);
  effect3.effect_instruction_i0 = cause3;
  return effect3;
};
var failCauseSync = (evaluate2) => flatMap7(sync(evaluate2), failCause);
var fiberId = /* @__PURE__ */ withFiberRuntime((state) => succeed(state.id()));
var fiberIdWith = (f) => withFiberRuntime((state) => f(state.id()));
var flatMap7 = /* @__PURE__ */ dual(2, (self, f) => {
  const effect3 = new EffectPrimitive(OP_ON_SUCCESS);
  effect3.effect_instruction_i0 = self;
  effect3.effect_instruction_i1 = f;
  return effect3;
});
var andThen4 = /* @__PURE__ */ dual(2, (self, f) => flatMap7(self, (a) => {
  const b = typeof f === "function" ? f(a) : f;
  if (isEffect(b)) {
    return b;
  } else if (isPromiseLike(b)) {
    return unsafeAsync((resume2) => {
      b.then((a2) => resume2(succeed(a2)), (e) => resume2(fail2(new UnknownException(e, "An unknown error occurred in Effect.andThen"))));
    });
  }
  return succeed(b);
}));
var step2 = (self) => {
  const effect3 = new EffectPrimitive("OnStep");
  effect3.effect_instruction_i0 = self;
  return effect3;
};
var flatten6 = (self) => flatMap7(self, identity);
var flip = (self) => matchEffect(self, {
  onFailure: succeed,
  onSuccess: fail2
});
var matchCause = /* @__PURE__ */ dual(2, (self, options) => matchCauseEffect(self, {
  onFailure: (cause3) => succeed(options.onFailure(cause3)),
  onSuccess: (a) => succeed(options.onSuccess(a))
}));
var matchCauseEffect = /* @__PURE__ */ dual(2, (self, options) => {
  const effect3 = new EffectPrimitive(OP_ON_SUCCESS_AND_FAILURE);
  effect3.effect_instruction_i0 = self;
  effect3.effect_instruction_i1 = options.onFailure;
  effect3.effect_instruction_i2 = options.onSuccess;
  return effect3;
});
var matchEffect = /* @__PURE__ */ dual(2, (self, options) => matchCauseEffect(self, {
  onFailure: (cause3) => {
    const defects3 = defects(cause3);
    if (defects3.length > 0) {
      return failCause(electFailures(cause3));
    }
    const failures3 = failures(cause3);
    if (failures3.length > 0) {
      return options.onFailure(unsafeHead(failures3));
    }
    return failCause(cause3);
  },
  onSuccess: options.onSuccess
}));
var forEachSequential = /* @__PURE__ */ dual(2, (self, f) => suspend(() => {
  const arr = fromIterable2(self);
  const ret = allocate(arr.length);
  let i = 0;
  return as3(whileLoop({
    while: () => i < arr.length,
    body: () => f(arr[i], i),
    step: (b) => {
      ret[i++] = b;
    }
  }), ret);
}));
var forEachSequentialDiscard = /* @__PURE__ */ dual(2, (self, f) => suspend(() => {
  const arr = fromIterable2(self);
  let i = 0;
  return whileLoop({
    while: () => i < arr.length,
    body: () => f(arr[i], i),
    step: () => {
      i++;
    }
  });
}));
var if_ = /* @__PURE__ */ dual((args2) => typeof args2[0] === "boolean" || isEffect(args2[0]), (self, options) => isEffect(self) ? flatMap7(self, (b) => b ? options.onTrue() : options.onFalse()) : self ? options.onTrue() : options.onFalse());
var interrupt2 = /* @__PURE__ */ flatMap7(fiberId, (fiberId3) => interruptWith(fiberId3));
var interruptWith = (fiberId3) => failCause(interrupt(fiberId3));
var interruptible2 = (self) => {
  const effect3 = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect3.effect_instruction_i0 = enable3(Interruption);
  effect3.effect_instruction_i1 = () => self;
  return effect3;
};
var interruptibleMask = (f) => custom(f, function() {
  const effect3 = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect3.effect_instruction_i0 = enable3(Interruption);
  effect3.effect_instruction_i1 = (oldFlags) => interruption(oldFlags) ? internalCall(() => this.effect_instruction_i0(interruptible2)) : internalCall(() => this.effect_instruction_i0(uninterruptible));
  return effect3;
});
var intoDeferred = /* @__PURE__ */ dual(2, (self, deferred) => uninterruptibleMask((restore) => flatMap7(exit(restore(self)), (exit4) => deferredDone(deferred, exit4))));
var map10 = /* @__PURE__ */ dual(2, (self, f) => flatMap7(self, (a) => sync(() => f(a))));
var mapBoth = /* @__PURE__ */ dual(2, (self, options) => matchEffect(self, {
  onFailure: (e) => failSync(() => options.onFailure(e)),
  onSuccess: (a) => sync(() => options.onSuccess(a))
}));
var mapError = /* @__PURE__ */ dual(2, (self, f) => matchCauseEffect(self, {
  onFailure: (cause3) => {
    const either7 = failureOrCause(cause3);
    switch (either7._tag) {
      case "Left": {
        return failSync(() => f(either7.left));
      }
      case "Right": {
        return failCause(either7.right);
      }
    }
  },
  onSuccess: succeed
}));
var onError = /* @__PURE__ */ dual(2, (self, cleanup) => onExit(self, (exit4) => exitIsSuccess(exit4) ? void_2 : cleanup(exit4.effect_instruction_i0)));
var onExit = /* @__PURE__ */ dual(2, (self, cleanup) => uninterruptibleMask((restore) => matchCauseEffect(restore(self), {
  onFailure: (cause1) => {
    const result = exitFailCause(cause1);
    return matchCauseEffect(cleanup(result), {
      onFailure: (cause22) => exitFailCause(sequential(cause1, cause22)),
      onSuccess: () => result
    });
  },
  onSuccess: (success) => {
    const result = exitSucceed(success);
    return zipRight2(cleanup(result), result);
  }
})));
var onInterrupt = /* @__PURE__ */ dual(2, (self, cleanup) => onExit(self, exitMatch({
  onFailure: (cause3) => isInterruptedOnly(cause3) ? asVoid2(cleanup(interruptors(cause3))) : void_2,
  onSuccess: () => void_2
})));
var orElse2 = /* @__PURE__ */ dual(2, (self, that) => attemptOrElse(self, that, succeed));
var orDie = (self) => orDieWith(self, identity);
var orDieWith = /* @__PURE__ */ dual(2, (self, f) => matchEffect(self, {
  onFailure: (e) => die2(f(e)),
  onSuccess: succeed
}));
var partitionMap3 = partitionMap2;
var runtimeFlags = /* @__PURE__ */ withFiberRuntime((_, status3) => succeed(status3.runtimeFlags));
var succeed = (value) => {
  const effect3 = new EffectPrimitiveSuccess(OP_SUCCESS);
  effect3.effect_instruction_i0 = value;
  return effect3;
};
var suspend = (evaluate2) => {
  const effect3 = new EffectPrimitive(OP_COMMIT);
  effect3.commit = evaluate2;
  return effect3;
};
var sync = (thunk) => {
  const effect3 = new EffectPrimitive(OP_SYNC);
  effect3.effect_instruction_i0 = thunk;
  return effect3;
};
var tap2 = /* @__PURE__ */ dual((args2) => args2.length === 3 || args2.length === 2 && !(isObject(args2[1]) && "onlyEffect" in args2[1]), (self, f) => flatMap7(self, (a) => {
  const b = typeof f === "function" ? f(a) : f;
  if (isEffect(b)) {
    return as3(b, a);
  } else if (isPromiseLike(b)) {
    return unsafeAsync((resume2) => {
      b.then((_) => resume2(succeed(a)), (e) => resume2(fail2(new UnknownException(e, "An unknown error occurred in Effect.tap"))));
    });
  }
  return succeed(a);
}));
var transplant = (f) => withFiberRuntime((state) => {
  const scopeOverride = state.getFiberRef(currentForkScopeOverride);
  const scope5 = pipe(scopeOverride, getOrElse(() => state.scope()));
  return f(fiberRefLocally(currentForkScopeOverride, some2(scope5)));
});
var attemptOrElse = /* @__PURE__ */ dual(3, (self, that, onSuccess) => matchCauseEffect(self, {
  onFailure: (cause3) => {
    const defects3 = defects(cause3);
    if (defects3.length > 0) {
      return failCause(getOrThrow2(keepDefectsAndElectFailures(cause3)));
    }
    return that();
  },
  onSuccess
}));
var uninterruptible = (self) => {
  const effect3 = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect3.effect_instruction_i0 = disable3(Interruption);
  effect3.effect_instruction_i1 = () => self;
  return effect3;
};
var uninterruptibleMask = (f) => custom(f, function() {
  const effect3 = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect3.effect_instruction_i0 = disable3(Interruption);
  effect3.effect_instruction_i1 = (oldFlags) => interruption(oldFlags) ? internalCall(() => this.effect_instruction_i0(interruptible2)) : internalCall(() => this.effect_instruction_i0(uninterruptible));
  return effect3;
});
var void_2 = /* @__PURE__ */ succeed(void 0);
var updateRuntimeFlags = (patch9) => {
  const effect3 = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect3.effect_instruction_i0 = patch9;
  effect3.effect_instruction_i1 = void 0;
  return effect3;
};
var whenEffect = /* @__PURE__ */ dual(2, (self, condition) => flatMap7(condition, (b) => {
  if (b) {
    return pipe(self, map10(some2));
  }
  return succeed(none2());
}));
var whileLoop = (options) => {
  const effect3 = new EffectPrimitive(OP_WHILE);
  effect3.effect_instruction_i0 = options.while;
  effect3.effect_instruction_i1 = options.body;
  effect3.effect_instruction_i2 = options.step;
  return effect3;
};
var fromIterator = (iterator) => suspend(() => {
  const effect3 = new EffectPrimitive(OP_ITERATOR);
  effect3.effect_instruction_i0 = iterator();
  return effect3;
});
var gen2 = function() {
  const f = arguments.length === 1 ? arguments[0] : arguments[1].bind(arguments[0]);
  return fromIterator(() => f(pipe));
};
var fnUntraced = (body, ...pipeables) => Object.defineProperty(pipeables.length === 0 ? function(...args2) {
  return fromIterator(() => body.apply(this, args2));
} : function(...args2) {
  let effect3 = fromIterator(() => body.apply(this, args2));
  for (const x of pipeables) {
    effect3 = x(effect3, ...args2);
  }
  return effect3;
}, "length", {
  value: body.length,
  configurable: true
});
var withConcurrency = /* @__PURE__ */ dual(2, (self, concurrency) => fiberRefLocally(self, currentConcurrency, concurrency));
var withRequestBatching = /* @__PURE__ */ dual(2, (self, requestBatching) => fiberRefLocally(self, currentRequestBatching, requestBatching));
var withRuntimeFlags = /* @__PURE__ */ dual(2, (self, update5) => {
  const effect3 = new EffectPrimitive(OP_UPDATE_RUNTIME_FLAGS);
  effect3.effect_instruction_i0 = update5;
  effect3.effect_instruction_i1 = () => self;
  return effect3;
});
var withTracerEnabled = /* @__PURE__ */ dual(2, (effect3, enabled2) => fiberRefLocally(effect3, currentTracerEnabled, enabled2));
var withTracerTiming = /* @__PURE__ */ dual(2, (effect3, enabled2) => fiberRefLocally(effect3, currentTracerTimingEnabled, enabled2));
var yieldNow = (options) => {
  const effect3 = new EffectPrimitive(OP_YIELD);
  return typeof options?.priority !== "undefined" ? withSchedulingPriority(effect3, options.priority) : effect3;
};
var zip2 = /* @__PURE__ */ dual(2, (self, that) => flatMap7(self, (a) => map10(that, (b) => [a, b])));
var zipLeft2 = /* @__PURE__ */ dual(2, (self, that) => flatMap7(self, (a) => as3(that, a)));
var zipRight2 = /* @__PURE__ */ dual(2, (self, that) => flatMap7(self, () => that));
var zipWith3 = /* @__PURE__ */ dual(3, (self, that, f) => flatMap7(self, (a) => map10(that, (b) => f(a, b))));
var never = /* @__PURE__ */ asyncInterrupt(() => {
  const interval = setInterval(() => {
  }, 2 ** 31 - 1);
  return sync(() => clearInterval(interval));
});
var interruptFiber = (self) => flatMap7(fiberId, (fiberId3) => pipe(self, interruptAsFiber(fiberId3)));
var interruptAsFiber = /* @__PURE__ */ dual(2, (self, fiberId3) => flatMap7(self.interruptAsFork(fiberId3), () => self.await));
var logLevelAll = {
  _tag: "All",
  syslog: 0,
  label: "ALL",
  ordinal: Number.MIN_SAFE_INTEGER,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelFatal = {
  _tag: "Fatal",
  syslog: 2,
  label: "FATAL",
  ordinal: 5e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelError = {
  _tag: "Error",
  syslog: 3,
  label: "ERROR",
  ordinal: 4e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelWarning = {
  _tag: "Warning",
  syslog: 4,
  label: "WARN",
  ordinal: 3e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelInfo = {
  _tag: "Info",
  syslog: 6,
  label: "INFO",
  ordinal: 2e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelDebug = {
  _tag: "Debug",
  syslog: 7,
  label: "DEBUG",
  ordinal: 1e4,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelTrace = {
  _tag: "Trace",
  syslog: 7,
  label: "TRACE",
  ordinal: 0,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var logLevelNone = {
  _tag: "None",
  syslog: 7,
  label: "OFF",
  ordinal: Number.MAX_SAFE_INTEGER,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var FiberRefSymbolKey = "effect/FiberRef";
var FiberRefTypeId = /* @__PURE__ */ Symbol.for(FiberRefSymbolKey);
var fiberRefVariance = {
  /* c8 ignore next */
  _A: (_) => _
};
var fiberRefGet = (self) => withFiberRuntime((fiber) => exitSucceed(fiber.getFiberRef(self)));
var fiberRefGetWith = /* @__PURE__ */ dual(2, (self, f) => flatMap7(fiberRefGet(self), f));
var fiberRefSet = /* @__PURE__ */ dual(2, (self, value) => fiberRefModify(self, () => [void 0, value]));
var fiberRefModify = /* @__PURE__ */ dual(2, (self, f) => withFiberRuntime((state) => {
  const [b, a] = f(state.getFiberRef(self));
  state.setFiberRef(self, a);
  return succeed(b);
}));
var fiberRefLocally = /* @__PURE__ */ dual(3, (use, self, value) => acquireUseRelease(zipLeft2(fiberRefGet(self), fiberRefSet(self, value)), () => use, (oldValue) => fiberRefSet(self, oldValue)));
var fiberRefLocallyWith = /* @__PURE__ */ dual(3, (use, self, f) => fiberRefGetWith(self, (a) => fiberRefLocally(use, self, f(a))));
var fiberRefUnsafeMake = (initial, options) => fiberRefUnsafeMakePatch(initial, {
  differ: update(),
  fork: options?.fork ?? identity,
  join: options?.join
});
var fiberRefUnsafeMakeHashSet = (initial) => {
  const differ3 = hashSet();
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ3,
    fork: differ3.empty
  });
};
var fiberRefUnsafeMakeReadonlyArray = (initial) => {
  const differ3 = readonlyArray(update());
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ3,
    fork: differ3.empty
  });
};
var fiberRefUnsafeMakeContext = (initial) => {
  const differ3 = environment();
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ3,
    fork: differ3.empty
  });
};
var fiberRefUnsafeMakePatch = (initial, options) => {
  const _fiberRef = {
    ...CommitPrototype,
    [FiberRefTypeId]: fiberRefVariance,
    initial,
    commit() {
      return fiberRefGet(this);
    },
    diff: (oldValue, newValue) => options.differ.diff(oldValue, newValue),
    combine: (first2, second) => options.differ.combine(first2, second),
    patch: (patch9) => (oldValue) => options.differ.patch(patch9, oldValue),
    fork: options.fork,
    join: options.join ?? ((_, n) => n)
  };
  return _fiberRef;
};
var fiberRefUnsafeMakeRuntimeFlags = (initial) => fiberRefUnsafeMakePatch(initial, {
  differ,
  fork: differ.empty
});
var currentContext = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentContext"), () => fiberRefUnsafeMakeContext(empty3()));
var currentSchedulingPriority = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentSchedulingPriority"), () => fiberRefUnsafeMake(0));
var currentMaxOpsBeforeYield = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"), () => fiberRefUnsafeMake(2048));
var currentLogAnnotations = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogAnnotation"), () => fiberRefUnsafeMake(empty8()));
var currentLogLevel = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogLevel"), () => fiberRefUnsafeMake(logLevelInfo));
var currentLogSpan = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogSpan"), () => fiberRefUnsafeMake(empty9()));
var withSchedulingPriority = /* @__PURE__ */ dual(2, (self, scheduler) => fiberRefLocally(self, currentSchedulingPriority, scheduler));
var withMaxOpsBeforeYield = /* @__PURE__ */ dual(2, (self, scheduler) => fiberRefLocally(self, currentMaxOpsBeforeYield, scheduler));
var currentConcurrency = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentConcurrency"), () => fiberRefUnsafeMake("unbounded"));
var currentRequestBatching = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestBatching"), () => fiberRefUnsafeMake(true));
var currentUnhandledErrorLogLevel = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"), () => fiberRefUnsafeMake(some2(logLevelDebug)));
var currentVersionMismatchErrorLogLevel = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/versionMismatchErrorLogLevel"), () => fiberRefUnsafeMake(some2(logLevelWarning)));
var withUnhandledErrorLogLevel = /* @__PURE__ */ dual(2, (self, level) => fiberRefLocally(self, currentUnhandledErrorLogLevel, level));
var currentMetricLabels = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMetricLabels"), () => fiberRefUnsafeMakeReadonlyArray(empty()));
var metricLabels = /* @__PURE__ */ fiberRefGet(currentMetricLabels);
var currentForkScopeOverride = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentForkScopeOverride"), () => fiberRefUnsafeMake(none2(), {
  fork: () => none2(),
  join: (parent, _) => parent
}));
var currentInterruptedCause = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentInterruptedCause"), () => fiberRefUnsafeMake(empty16, {
  fork: () => empty16,
  join: (parent, _) => parent
}));
var currentTracerEnabled = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentTracerEnabled"), () => fiberRefUnsafeMake(true));
var currentTracerTimingEnabled = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentTracerTiming"), () => fiberRefUnsafeMake(true));
var currentTracerSpanAnnotations = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentTracerSpanAnnotations"), () => fiberRefUnsafeMake(empty8()));
var currentTracerSpanLinks = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentTracerSpanLinks"), () => fiberRefUnsafeMake(empty4()));
var ScopeTypeId = /* @__PURE__ */ Symbol.for("effect/Scope");
var CloseableScopeTypeId = /* @__PURE__ */ Symbol.for("effect/CloseableScope");
var scopeAddFinalizer = (self, finalizer2) => self.addFinalizer(() => asVoid2(finalizer2));
var scopeAddFinalizerExit = (self, finalizer2) => self.addFinalizer(finalizer2);
var scopeClose = (self, exit4) => self.close(exit4);
var scopeFork = (self, strategy) => self.fork(strategy);
var causeSquash = (self) => {
  return causeSquashWith(identity)(self);
};
var causeSquashWith = /* @__PURE__ */ dual(2, (self, f) => {
  const option3 = pipe(self, failureOption, map2(f));
  switch (option3._tag) {
    case "None": {
      return pipe(defects(self), head2, match2({
        onNone: () => {
          const interrupts = fromIterable2(interruptors(self)).flatMap((fiberId3) => fromIterable2(ids2(fiberId3)).map((id3) => `#${id3}`));
          return new InterruptedException(interrupts ? `Interrupted by fibers: ${interrupts.join(", ")}` : void 0);
        },
        onSome: identity
      }));
    }
    case "Some": {
      return option3.value;
    }
  }
});
var YieldableError = /* @__PURE__ */ (function() {
  class YieldableError3 extends globalThis.Error {
    commit() {
      return fail2(this);
    }
    toJSON() {
      const obj = {
        ...this
      };
      if (this.message) obj.message = this.message;
      if (this.cause) obj.cause = this.cause;
      return obj;
    }
    [NodeInspectSymbol]() {
      if (this.toString !== globalThis.Error.prototype.toString) {
        return this.stack ? `${this.toString()}
${this.stack.split("\n").slice(1).join("\n")}` : this.toString();
      } else if ("Bun" in globalThis) {
        return pretty(fail(this), {
          renderErrorCause: true
        });
      }
      return this;
    }
  }
  Object.assign(YieldableError3.prototype, StructuralCommitPrototype);
  return YieldableError3;
})();
var makeException = (proto12, tag2) => {
  class Base3 extends YieldableError {
    _tag = tag2;
  }
  Object.assign(Base3.prototype, proto12);
  Base3.prototype.name = tag2;
  return Base3;
};
var RuntimeExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/RuntimeException");
var RuntimeException = /* @__PURE__ */ makeException({
  [RuntimeExceptionTypeId]: RuntimeExceptionTypeId
}, "RuntimeException");
var isRuntimeException = (u) => hasProperty(u, RuntimeExceptionTypeId);
var InterruptedExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/InterruptedException");
var InterruptedException = /* @__PURE__ */ makeException({
  [InterruptedExceptionTypeId]: InterruptedExceptionTypeId
}, "InterruptedException");
var isInterruptedException = (u) => hasProperty(u, InterruptedExceptionTypeId);
var IllegalArgumentExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/IllegalArgument");
var IllegalArgumentException = /* @__PURE__ */ makeException({
  [IllegalArgumentExceptionTypeId]: IllegalArgumentExceptionTypeId
}, "IllegalArgumentException");
var isIllegalArgumentException = (u) => hasProperty(u, IllegalArgumentExceptionTypeId);
var NoSuchElementExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/NoSuchElement");
var NoSuchElementException = /* @__PURE__ */ makeException({
  [NoSuchElementExceptionTypeId]: NoSuchElementExceptionTypeId
}, "NoSuchElementException");
var isNoSuchElementException = (u) => hasProperty(u, NoSuchElementExceptionTypeId);
var InvalidPubSubCapacityExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/InvalidPubSubCapacityException");
var ExceededCapacityExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/ExceededCapacityException");
var ExceededCapacityException = /* @__PURE__ */ makeException({
  [ExceededCapacityExceptionTypeId]: ExceededCapacityExceptionTypeId
}, "ExceededCapacityException");
var isExceededCapacityException = (u) => hasProperty(u, ExceededCapacityExceptionTypeId);
var TimeoutExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/Timeout");
var TimeoutException = /* @__PURE__ */ makeException({
  [TimeoutExceptionTypeId]: TimeoutExceptionTypeId
}, "TimeoutException");
var timeoutExceptionFromDuration = (duration3) => new TimeoutException(`Operation timed out after '${format2(duration3)}'`);
var isTimeoutException = (u) => hasProperty(u, TimeoutExceptionTypeId);
var UnknownExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/UnknownException");
var UnknownException = /* @__PURE__ */ (function() {
  class UnknownException3 extends YieldableError {
    _tag = "UnknownException";
    error;
    constructor(cause3, message) {
      super(message ?? "An unknown error occurred", {
        cause: cause3
      });
      this.error = cause3;
    }
  }
  Object.assign(UnknownException3.prototype, {
    [UnknownExceptionTypeId]: UnknownExceptionTypeId,
    name: "UnknownException"
  });
  return UnknownException3;
})();
var isUnknownException = (u) => hasProperty(u, UnknownExceptionTypeId);
var exitIsExit = (u) => isEffect(u) && "_tag" in u && (u._tag === "Success" || u._tag === "Failure");
var exitIsFailure = (self) => self._tag === "Failure";
var exitIsSuccess = (self) => self._tag === "Success";
var exitIsInterrupted = (self) => {
  switch (self._tag) {
    case OP_FAILURE:
      return isInterrupted(self.effect_instruction_i0);
    case OP_SUCCESS:
      return false;
  }
};
var exitAs = /* @__PURE__ */ dual(2, (self, value) => {
  switch (self._tag) {
    case OP_FAILURE: {
      return exitFailCause(self.effect_instruction_i0);
    }
    case OP_SUCCESS: {
      return exitSucceed(value);
    }
  }
});
var exitAsVoid = (self) => exitAs(self, void 0);
var exitCauseOption = (self) => {
  switch (self._tag) {
    case OP_FAILURE:
      return some2(self.effect_instruction_i0);
    case OP_SUCCESS:
      return none2();
  }
};
var exitCollectAll = (exits, options) => exitCollectAllInternal(exits, options?.parallel ? parallel : sequential);
var exitDie = (defect) => exitFailCause(die(defect));
var exitExists = /* @__PURE__ */ dual(2, (self, refinement) => {
  switch (self._tag) {
    case OP_FAILURE:
      return false;
    case OP_SUCCESS:
      return refinement(self.effect_instruction_i0);
  }
});
var exitFail = (error) => exitFailCause(fail(error));
var exitFailCause = (cause3) => {
  const effect3 = new EffectPrimitiveFailure(OP_FAILURE);
  effect3.effect_instruction_i0 = cause3;
  return effect3;
};
var exitFlatMap = /* @__PURE__ */ dual(2, (self, f) => {
  switch (self._tag) {
    case OP_FAILURE: {
      return exitFailCause(self.effect_instruction_i0);
    }
    case OP_SUCCESS: {
      return f(self.effect_instruction_i0);
    }
  }
});
var exitFlatMapEffect = /* @__PURE__ */ dual(2, (self, f) => {
  switch (self._tag) {
    case OP_FAILURE: {
      return succeed(exitFailCause(self.effect_instruction_i0));
    }
    case OP_SUCCESS: {
      return f(self.effect_instruction_i0);
    }
  }
});
var exitFlatten = (self) => pipe(self, exitFlatMap(identity));
var exitForEachEffect = /* @__PURE__ */ dual(2, (self, f) => {
  switch (self._tag) {
    case OP_FAILURE: {
      return succeed(exitFailCause(self.effect_instruction_i0));
    }
    case OP_SUCCESS: {
      return exit(f(self.effect_instruction_i0));
    }
  }
});
var exitFromEither = (either7) => {
  switch (either7._tag) {
    case "Left":
      return exitFail(either7.left);
    case "Right":
      return exitSucceed(either7.right);
  }
};
var exitFromOption = (option3) => {
  switch (option3._tag) {
    case "None":
      return exitFail(void 0);
    case "Some":
      return exitSucceed(option3.value);
  }
};
var exitGetOrElse = /* @__PURE__ */ dual(2, (self, orElse12) => {
  switch (self._tag) {
    case OP_FAILURE:
      return orElse12(self.effect_instruction_i0);
    case OP_SUCCESS:
      return self.effect_instruction_i0;
  }
});
var exitInterrupt = (fiberId3) => exitFailCause(interrupt(fiberId3));
var exitMap = /* @__PURE__ */ dual(2, (self, f) => {
  switch (self._tag) {
    case OP_FAILURE:
      return exitFailCause(self.effect_instruction_i0);
    case OP_SUCCESS:
      return exitSucceed(f(self.effect_instruction_i0));
  }
});
var exitMapBoth = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OP_FAILURE:
      return exitFailCause(pipe(self.effect_instruction_i0, map9(onFailure)));
    case OP_SUCCESS:
      return exitSucceed(onSuccess(self.effect_instruction_i0));
  }
});
var exitMapError = /* @__PURE__ */ dual(2, (self, f) => {
  switch (self._tag) {
    case OP_FAILURE:
      return exitFailCause(pipe(self.effect_instruction_i0, map9(f)));
    case OP_SUCCESS:
      return exitSucceed(self.effect_instruction_i0);
  }
});
var exitMapErrorCause = /* @__PURE__ */ dual(2, (self, f) => {
  switch (self._tag) {
    case OP_FAILURE:
      return exitFailCause(f(self.effect_instruction_i0));
    case OP_SUCCESS:
      return exitSucceed(self.effect_instruction_i0);
  }
});
var exitMatch = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OP_FAILURE:
      return onFailure(self.effect_instruction_i0);
    case OP_SUCCESS:
      return onSuccess(self.effect_instruction_i0);
  }
});
var exitMatchEffect = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OP_FAILURE:
      return onFailure(self.effect_instruction_i0);
    case OP_SUCCESS:
      return onSuccess(self.effect_instruction_i0);
  }
});
var exitSucceed = (value) => {
  const effect3 = new EffectPrimitiveSuccess(OP_SUCCESS);
  effect3.effect_instruction_i0 = value;
  return effect3;
};
var exitVoid = /* @__PURE__ */ exitSucceed(void 0);
var exitZip = /* @__PURE__ */ dual(2, (self, that) => exitZipWith(self, that, {
  onSuccess: (a, a2) => [a, a2],
  onFailure: sequential
}));
var exitZipLeft = /* @__PURE__ */ dual(2, (self, that) => exitZipWith(self, that, {
  onSuccess: (a, _) => a,
  onFailure: sequential
}));
var exitZipRight = /* @__PURE__ */ dual(2, (self, that) => exitZipWith(self, that, {
  onSuccess: (_, a2) => a2,
  onFailure: sequential
}));
var exitZipPar = /* @__PURE__ */ dual(2, (self, that) => exitZipWith(self, that, {
  onSuccess: (a, a2) => [a, a2],
  onFailure: parallel
}));
var exitZipParLeft = /* @__PURE__ */ dual(2, (self, that) => exitZipWith(self, that, {
  onSuccess: (a, _) => a,
  onFailure: parallel
}));
var exitZipParRight = /* @__PURE__ */ dual(2, (self, that) => exitZipWith(self, that, {
  onSuccess: (_, a2) => a2,
  onFailure: parallel
}));
var exitZipWith = /* @__PURE__ */ dual(3, (self, that, {
  onFailure,
  onSuccess
}) => {
  switch (self._tag) {
    case OP_FAILURE: {
      switch (that._tag) {
        case OP_SUCCESS:
          return exitFailCause(self.effect_instruction_i0);
        case OP_FAILURE: {
          return exitFailCause(onFailure(self.effect_instruction_i0, that.effect_instruction_i0));
        }
      }
    }
    case OP_SUCCESS: {
      switch (that._tag) {
        case OP_SUCCESS:
          return exitSucceed(onSuccess(self.effect_instruction_i0, that.effect_instruction_i0));
        case OP_FAILURE:
          return exitFailCause(that.effect_instruction_i0);
      }
    }
  }
});
var exitCollectAllInternal = (exits, combineCauses) => {
  const list = fromIterable3(exits);
  if (!isNonEmpty2(list)) {
    return none2();
  }
  return pipe(tailNonEmpty2(list), reduce(pipe(headNonEmpty2(list), exitMap(of2)), (accumulator, current) => pipe(accumulator, exitZipWith(current, {
    onSuccess: (list2, value) => pipe(list2, prepend2(value)),
    onFailure: combineCauses
  }))), exitMap(reverse2), exitMap((chunk3) => toReadonlyArray(chunk3)), some2);
};
var deferredUnsafeMake = (fiberId3) => {
  const _deferred = {
    ...CommitPrototype,
    [DeferredTypeId]: deferredVariance,
    state: make11(pending([])),
    commit() {
      return deferredAwait(this);
    },
    blockingOn: fiberId3
  };
  return _deferred;
};
var deferredMake = () => flatMap7(fiberId, (id3) => deferredMakeAs(id3));
var deferredMakeAs = (fiberId3) => sync(() => deferredUnsafeMake(fiberId3));
var deferredAwait = (self) => asyncInterrupt((resume2) => {
  const state = get6(self.state);
  switch (state._tag) {
    case OP_STATE_DONE: {
      return resume2(state.effect);
    }
    case OP_STATE_PENDING: {
      state.joiners.push(resume2);
      return deferredInterruptJoiner(self, resume2);
    }
  }
}, self.blockingOn);
var deferredComplete = /* @__PURE__ */ dual(2, (self, effect3) => intoDeferred(effect3, self));
var deferredCompleteWith = /* @__PURE__ */ dual(2, (self, effect3) => sync(() => {
  const state = get6(self.state);
  switch (state._tag) {
    case OP_STATE_DONE: {
      return false;
    }
    case OP_STATE_PENDING: {
      set2(self.state, done(effect3));
      for (let i = 0, len = state.joiners.length; i < len; i++) {
        state.joiners[i](effect3);
      }
      return true;
    }
  }
}));
var deferredDone = /* @__PURE__ */ dual(2, (self, exit4) => deferredCompleteWith(self, exit4));
var deferredFail = /* @__PURE__ */ dual(2, (self, error) => deferredCompleteWith(self, fail2(error)));
var deferredFailSync = /* @__PURE__ */ dual(2, (self, evaluate2) => deferredCompleteWith(self, failSync(evaluate2)));
var deferredFailCause = /* @__PURE__ */ dual(2, (self, cause3) => deferredCompleteWith(self, failCause(cause3)));
var deferredFailCauseSync = /* @__PURE__ */ dual(2, (self, evaluate2) => deferredCompleteWith(self, failCauseSync(evaluate2)));
var deferredDie = /* @__PURE__ */ dual(2, (self, defect) => deferredCompleteWith(self, die2(defect)));
var deferredDieSync = /* @__PURE__ */ dual(2, (self, evaluate2) => deferredCompleteWith(self, dieSync(evaluate2)));
var deferredInterrupt = (self) => flatMap7(fiberId, (fiberId3) => deferredCompleteWith(self, interruptWith(fiberId3)));
var deferredInterruptWith = /* @__PURE__ */ dual(2, (self, fiberId3) => deferredCompleteWith(self, interruptWith(fiberId3)));
var deferredIsDone = (self) => sync(() => get6(self.state)._tag === OP_STATE_DONE);
var deferredPoll = (self) => sync(() => {
  const state = get6(self.state);
  switch (state._tag) {
    case OP_STATE_DONE: {
      return some2(state.effect);
    }
    case OP_STATE_PENDING: {
      return none2();
    }
  }
});
var deferredSucceed = /* @__PURE__ */ dual(2, (self, value) => deferredCompleteWith(self, succeed(value)));
var deferredSync = /* @__PURE__ */ dual(2, (self, evaluate2) => deferredCompleteWith(self, sync(evaluate2)));
var deferredUnsafeDone = (self, effect3) => {
  const state = get6(self.state);
  if (state._tag === OP_STATE_PENDING) {
    set2(self.state, done(effect3));
    for (let i = 0, len = state.joiners.length; i < len; i++) {
      state.joiners[i](effect3);
    }
  }
};
var deferredInterruptJoiner = (self, joiner) => sync(() => {
  const state = get6(self.state);
  if (state._tag === OP_STATE_PENDING) {
    const index = state.joiners.indexOf(joiner);
    if (index >= 0) {
      state.joiners.splice(index, 1);
    }
  }
});
var constContext = /* @__PURE__ */ withFiberRuntime((fiber) => exitSucceed(fiber.currentContext));
var context = () => constContext;
var contextWithEffect = (f) => flatMap7(context(), f);
var provideContext = /* @__PURE__ */ dual(2, (self, context7) => fiberRefLocally(currentContext, context7)(self));
var provideSomeContext = /* @__PURE__ */ dual(2, (self, context7) => fiberRefLocallyWith(currentContext, (parent) => merge3(parent, context7))(self));
var mapInputContext = /* @__PURE__ */ dual(2, (self, f) => contextWithEffect((context7) => provideContext(self, f(context7))));
var filterEffectOrElse = /* @__PURE__ */ dual(2, (self, options) => flatMap7(self, (a) => flatMap7(options.predicate(a), (pass) => pass ? succeed(a) : options.orElse(a))));
var filterEffectOrFail = /* @__PURE__ */ dual(2, (self, options) => filterEffectOrElse(self, {
  predicate: options.predicate,
  orElse: (a) => fail2(options.orFailWith(a))
}));
var currentSpanFromFiber = (fiber) => {
  const span4 = fiber.currentSpan;
  return span4 !== void 0 && span4._tag === "Span" ? some2(span4) : none2();
};
var NoopSpanProto = {
  _tag: "Span",
  spanId: "noop",
  traceId: "noop",
  sampled: false,
  status: {
    _tag: "Ended",
    startTime: /* @__PURE__ */ BigInt(0),
    endTime: /* @__PURE__ */ BigInt(0),
    exit: exitVoid
  },
  attributes: /* @__PURE__ */ new Map(),
  links: [],
  kind: "internal",
  attribute() {
  },
  event() {
  },
  end() {
  },
  addLinks() {
  }
};
var noopSpan = (options) => Object.assign(Object.create(NoopSpanProto), options);

// node_modules/effect/dist/esm/Deferred.js
var DeferredTypeId2 = DeferredTypeId;
var make18 = deferredMake;
var makeAs = deferredMakeAs;
var _await = deferredAwait;
var complete = deferredComplete;
var completeWith = deferredCompleteWith;
var done2 = deferredDone;
var fail3 = deferredFail;
var failSync2 = deferredFailSync;
var failCause2 = deferredFailCause;
var failCauseSync2 = deferredFailCauseSync;
var die3 = deferredDie;
var dieSync2 = deferredDieSync;
var interrupt3 = deferredInterrupt;
var interruptWith2 = deferredInterruptWith;
var isDone = deferredIsDone;
var poll = deferredPoll;
var succeed2 = deferredSucceed;
var sync2 = deferredSync;
var unsafeMake4 = deferredUnsafeMake;
var unsafeDone = deferredUnsafeDone;

// node_modules/effect/dist/esm/Exit.js
var Exit_exports = {};
__export(Exit_exports, {
  all: () => all4,
  as: () => as4,
  asVoid: () => asVoid3,
  causeOption: () => causeOption,
  die: () => die4,
  exists: () => exists2,
  fail: () => fail4,
  failCause: () => failCause3,
  flatMap: () => flatMap8,
  flatMapEffect: () => flatMapEffect,
  flatten: () => flatten7,
  forEachEffect: () => forEachEffect,
  fromEither: () => fromEither,
  fromOption: () => fromOption3,
  getOrElse: () => getOrElse6,
  interrupt: () => interrupt4,
  isExit: () => isExit,
  isFailure: () => isFailure2,
  isInterrupted: () => isInterrupted2,
  isSuccess: () => isSuccess,
  map: () => map11,
  mapBoth: () => mapBoth2,
  mapError: () => mapError2,
  mapErrorCause: () => mapErrorCause,
  match: () => match6,
  matchEffect: () => matchEffect2,
  succeed: () => succeed3,
  void: () => void_3,
  zip: () => zip3,
  zipLeft: () => zipLeft3,
  zipPar: () => zipPar,
  zipParLeft: () => zipParLeft,
  zipParRight: () => zipParRight,
  zipRight: () => zipRight3,
  zipWith: () => zipWith4
});
var isExit = exitIsExit;
var isFailure2 = exitIsFailure;
var isSuccess = exitIsSuccess;
var isInterrupted2 = exitIsInterrupted;
var as4 = exitAs;
var asVoid3 = exitAsVoid;
var causeOption = exitCauseOption;
var all4 = exitCollectAll;
var die4 = exitDie;
var exists2 = exitExists;
var fail4 = exitFail;
var failCause3 = exitFailCause;
var flatMap8 = exitFlatMap;
var flatMapEffect = exitFlatMapEffect;
var flatten7 = exitFlatten;
var forEachEffect = exitForEachEffect;
var fromEither = exitFromEither;
var fromOption3 = exitFromOption;
var getOrElse6 = exitGetOrElse;
var interrupt4 = exitInterrupt;
var map11 = exitMap;
var mapBoth2 = exitMapBoth;
var mapError2 = exitMapError;
var mapErrorCause = exitMapErrorCause;
var match6 = exitMatch;
var matchEffect2 = exitMatchEffect;
var succeed3 = exitSucceed;
var void_3 = exitVoid;
var zip3 = exitZip;
var zipLeft3 = exitZipLeft;
var zipRight3 = exitZipRight;
var zipPar = exitZipPar;
var zipParLeft = exitZipParLeft;
var zipParRight = exitZipParRight;
var zipWith4 = exitZipWith;

// node_modules/effect/dist/esm/MutableHashMap.js
var TypeId9 = /* @__PURE__ */ Symbol.for("effect/MutableHashMap");
var MutableHashMapProto = {
  [TypeId9]: TypeId9,
  [Symbol.iterator]() {
    return new MutableHashMapIterator(this);
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableHashMap",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var MutableHashMapIterator = class _MutableHashMapIterator {
  self;
  referentialIterator;
  bucketIterator;
  constructor(self) {
    this.self = self;
    this.referentialIterator = self.referential[Symbol.iterator]();
  }
  next() {
    if (this.bucketIterator !== void 0) {
      return this.bucketIterator.next();
    }
    const result = this.referentialIterator.next();
    if (result.done) {
      this.bucketIterator = new BucketIterator(this.self.buckets.values());
      return this.next();
    }
    return result;
  }
  [Symbol.iterator]() {
    return new _MutableHashMapIterator(this.self);
  }
};
var BucketIterator = class {
  backing;
  constructor(backing) {
    this.backing = backing;
  }
  currentBucket;
  next() {
    if (this.currentBucket === void 0) {
      const result2 = this.backing.next();
      if (result2.done) {
        return result2;
      }
      this.currentBucket = result2.value[Symbol.iterator]();
    }
    const result = this.currentBucket.next();
    if (result.done) {
      this.currentBucket = void 0;
      return this.next();
    }
    return result;
  }
};
var empty17 = () => {
  const self = Object.create(MutableHashMapProto);
  self.referential = /* @__PURE__ */ new Map();
  self.buckets = /* @__PURE__ */ new Map();
  self.bucketsSize = 0;
  return self;
};
var get8 = /* @__PURE__ */ dual(2, (self, key) => {
  if (isEqual(key) === false) {
    return self.referential.has(key) ? some2(self.referential.get(key)) : none2();
  }
  const hash2 = key[symbol]();
  const bucket = self.buckets.get(hash2);
  if (bucket === void 0) {
    return none2();
  }
  return getFromBucket(self, bucket, key);
});
var getFromBucket = (self, bucket, key, remove9 = false) => {
  for (let i = 0, len = bucket.length; i < len; i++) {
    if (key[symbol2](bucket[i][0])) {
      const value = bucket[i][1];
      if (remove9) {
        bucket.splice(i, 1);
        self.bucketsSize--;
      }
      return some2(value);
    }
  }
  return none2();
};
var has4 = /* @__PURE__ */ dual(2, (self, key) => isSome2(get8(self, key)));
var set4 = /* @__PURE__ */ dual(3, (self, key, value) => {
  if (isEqual(key) === false) {
    self.referential.set(key, value);
    return self;
  }
  const hash2 = key[symbol]();
  const bucket = self.buckets.get(hash2);
  if (bucket === void 0) {
    self.buckets.set(hash2, [[key, value]]);
    self.bucketsSize++;
    return self;
  }
  removeFromBucket(self, bucket, key);
  bucket.push([key, value]);
  self.bucketsSize++;
  return self;
});
var removeFromBucket = (self, bucket, key) => {
  for (let i = 0, len = bucket.length; i < len; i++) {
    if (key[symbol2](bucket[i][0])) {
      bucket.splice(i, 1);
      self.bucketsSize--;
      return;
    }
  }
};
var remove5 = /* @__PURE__ */ dual(2, (self, key) => {
  if (isEqual(key) === false) {
    self.referential.delete(key);
    return self;
  }
  const hash2 = key[symbol]();
  const bucket = self.buckets.get(hash2);
  if (bucket === void 0) {
    return self;
  }
  removeFromBucket(self, bucket, key);
  if (bucket.length === 0) {
    self.buckets.delete(hash2);
  }
  return self;
});
var size5 = (self) => {
  return self.referential.size + self.bucketsSize;
};

// node_modules/effect/dist/esm/MutableList.js
var TypeId10 = /* @__PURE__ */ Symbol.for("effect/MutableList");
var MutableListProto = {
  [TypeId10]: TypeId10,
  [Symbol.iterator]() {
    let done10 = false;
    let head6 = this.head;
    return {
      next() {
        if (done10) {
          return this.return();
        }
        if (head6 == null) {
          done10 = true;
          return this.return();
        }
        const value = head6.value;
        head6 = head6.next;
        return {
          done: done10,
          value
        };
      },
      return(value) {
        if (!done10) {
          done10 = true;
        }
        return {
          done: true,
          value
        };
      }
    };
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableList",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeNode = (value) => ({
  value,
  removed: false,
  prev: void 0,
  next: void 0
});
var empty18 = () => {
  const list = Object.create(MutableListProto);
  list.head = void 0;
  list.tail = void 0;
  list._length = 0;
  return list;
};
var isEmpty6 = (self) => length(self) === 0;
var length = (self) => self._length;
var append3 = /* @__PURE__ */ dual(2, (self, value) => {
  const node = makeNode(value);
  if (self.head === void 0) {
    self.head = node;
  }
  if (self.tail === void 0) {
    self.tail = node;
  } else {
    self.tail.next = node;
    node.prev = self.tail;
    self.tail = node;
  }
  self._length += 1;
  return self;
});
var shift = (self) => {
  const head6 = self.head;
  if (head6 !== void 0) {
    remove6(self, head6);
    return head6.value;
  }
  return void 0;
};
var remove6 = (self, node) => {
  if (node.removed) {
    return;
  }
  node.removed = true;
  if (node.prev !== void 0 && node.next !== void 0) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  } else if (node.prev !== void 0) {
    self.tail = node.prev;
    node.prev.next = void 0;
  } else if (node.next !== void 0) {
    self.head = node.next;
    node.next.prev = void 0;
  } else {
    self.tail = void 0;
    self.head = void 0;
  }
  if (self._length > 0) {
    self._length -= 1;
  }
};

// node_modules/effect/dist/esm/MutableQueue.js
var TypeId11 = /* @__PURE__ */ Symbol.for("effect/MutableQueue");
var EmptyMutableQueue = /* @__PURE__ */ Symbol.for("effect/mutable/MutableQueue/Empty");
var MutableQueueProto = {
  [TypeId11]: TypeId11,
  [Symbol.iterator]() {
    return Array.from(this.queue)[Symbol.iterator]();
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableQueue",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make19 = (capacity3) => {
  const queue = Object.create(MutableQueueProto);
  queue.queue = empty18();
  queue.capacity = capacity3;
  return queue;
};
var bounded = (capacity3) => make19(capacity3);
var unbounded = () => make19(void 0);
var length2 = (self) => length(self.queue);
var isEmpty7 = (self) => isEmpty6(self.queue);
var capacity = (self) => self.capacity === void 0 ? Infinity : self.capacity;
var offer = /* @__PURE__ */ dual(2, (self, value) => {
  const queueLength = length(self.queue);
  if (self.capacity !== void 0 && queueLength === self.capacity) {
    return false;
  }
  append3(value)(self.queue);
  return true;
});
var offerAll = /* @__PURE__ */ dual(2, (self, values3) => {
  const iterator = values3[Symbol.iterator]();
  let next4;
  let remainder = empty4();
  let offering = true;
  while (offering && (next4 = iterator.next()) && !next4.done) {
    offering = offer(next4.value)(self);
  }
  while (next4 != null && !next4.done) {
    remainder = prepend2(next4.value)(remainder);
    next4 = iterator.next();
  }
  return reverse2(remainder);
});
var poll2 = /* @__PURE__ */ dual(2, (self, def) => {
  if (isEmpty6(self.queue)) {
    return def;
  }
  return shift(self.queue);
});
var pollUpTo = /* @__PURE__ */ dual(2, (self, n) => {
  let result = empty4();
  let count4 = 0;
  while (count4 < n) {
    const element = poll2(EmptyMutableQueue)(self);
    if (element === EmptyMutableQueue) {
      break;
    }
    result = prepend2(element)(result);
    count4 += 1;
  }
  return reverse2(result);
});

// node_modules/effect/dist/esm/Clock.js
var Clock_exports = {};
__export(Clock_exports, {
  Clock: () => Clock,
  ClockTypeId: () => ClockTypeId2,
  clockWith: () => clockWith2,
  currentTimeMillis: () => currentTimeMillis2,
  currentTimeNanos: () => currentTimeNanos2,
  make: () => make25,
  sleep: () => sleep2
});

// node_modules/effect/dist/esm/internal/clock.js
var ClockSymbolKey = "effect/Clock";
var ClockTypeId = /* @__PURE__ */ Symbol.for(ClockSymbolKey);
var clockTag = /* @__PURE__ */ GenericTag("effect/Clock");
var MAX_TIMER_MILLIS = 2 ** 31 - 1;
var globalClockScheduler = {
  unsafeSchedule(task, duration3) {
    const millis2 = toMillis(duration3);
    if (millis2 > MAX_TIMER_MILLIS) {
      return constFalse;
    }
    let completed = false;
    const handle = setTimeout(() => {
      completed = true;
      task();
    }, millis2);
    return () => {
      clearTimeout(handle);
      return !completed;
    };
  }
};
var performanceNowNanos = /* @__PURE__ */ (function() {
  const bigint1e62 = /* @__PURE__ */ BigInt(1e6);
  if (typeof performance === "undefined" || typeof performance.now !== "function") {
    return () => BigInt(Date.now()) * bigint1e62;
  }
  let origin;
  return () => {
    if (origin === void 0) {
      origin = BigInt(Date.now()) * bigint1e62 - BigInt(Math.round(performance.now() * 1e6));
    }
    return origin + BigInt(Math.round(performance.now() * 1e6));
  };
})();
var processOrPerformanceNow = /* @__PURE__ */ (function() {
  const processHrtime = typeof process === "object" && "hrtime" in process && typeof process.hrtime.bigint === "function" ? process.hrtime : void 0;
  if (!processHrtime) {
    return performanceNowNanos;
  }
  const origin = /* @__PURE__ */ performanceNowNanos() - /* @__PURE__ */ processHrtime.bigint();
  return () => origin + processHrtime.bigint();
})();
var ClockImpl = class {
  [ClockTypeId] = ClockTypeId;
  unsafeCurrentTimeMillis() {
    return Date.now();
  }
  unsafeCurrentTimeNanos() {
    return processOrPerformanceNow();
  }
  currentTimeMillis = /* @__PURE__ */ sync(() => this.unsafeCurrentTimeMillis());
  currentTimeNanos = /* @__PURE__ */ sync(() => this.unsafeCurrentTimeNanos());
  scheduler() {
    return succeed(globalClockScheduler);
  }
  sleep(duration3) {
    return async_((resume2) => {
      const canceler = globalClockScheduler.unsafeSchedule(() => resume2(void_2), duration3);
      return asVoid2(sync(canceler));
    });
  }
};
var make20 = () => new ClockImpl();

// node_modules/effect/dist/esm/internal/opCodes/configError.js
var OP_AND = "And";
var OP_OR = "Or";
var OP_INVALID_DATA = "InvalidData";
var OP_MISSING_DATA = "MissingData";
var OP_SOURCE_UNAVAILABLE = "SourceUnavailable";
var OP_UNSUPPORTED = "Unsupported";

// node_modules/effect/dist/esm/internal/configError.js
var ConfigErrorSymbolKey = "effect/ConfigError";
var ConfigErrorTypeId = /* @__PURE__ */ Symbol.for(ConfigErrorSymbolKey);
var proto2 = {
  _tag: "ConfigError",
  [ConfigErrorTypeId]: ConfigErrorTypeId
};
var And = (self, that) => {
  const error = Object.create(proto2);
  error._op = OP_AND;
  error.left = self;
  error.right = that;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      return `${this.left} and ${this.right}`;
    }
  });
  Object.defineProperty(error, "message", {
    enumerable: false,
    get() {
      return this.toString();
    }
  });
  return error;
};
var Or = (self, that) => {
  const error = Object.create(proto2);
  error._op = OP_OR;
  error.left = self;
  error.right = that;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      return `${this.left} or ${this.right}`;
    }
  });
  Object.defineProperty(error, "message", {
    enumerable: false,
    get() {
      return this.toString();
    }
  });
  return error;
};
var InvalidData = (path3, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._op = OP_INVALID_DATA;
  error.path = path3;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path4 = pipe(this.path, join(options.pathDelim));
      return `(Invalid data at ${path4}: "${this.message}")`;
    }
  });
  return error;
};
var MissingData = (path3, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._op = OP_MISSING_DATA;
  error.path = path3;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path4 = pipe(this.path, join(options.pathDelim));
      return `(Missing data at ${path4}: "${this.message}")`;
    }
  });
  return error;
};
var SourceUnavailable = (path3, message, cause3, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._op = OP_SOURCE_UNAVAILABLE;
  error.path = path3;
  error.message = message;
  error.cause = cause3;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path4 = pipe(this.path, join(options.pathDelim));
      return `(Source unavailable at ${path4}: "${this.message}")`;
    }
  });
  return error;
};
var Unsupported = (path3, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto2);
  error._op = OP_UNSUPPORTED;
  error.path = path3;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path4 = pipe(this.path, join(options.pathDelim));
      return `(Unsupported operation at ${path4}: "${this.message}")`;
    }
  });
  return error;
};
var prefixed = /* @__PURE__ */ dual(2, (self, prefix) => {
  switch (self._op) {
    case OP_AND: {
      return And(prefixed(self.left, prefix), prefixed(self.right, prefix));
    }
    case OP_OR: {
      return Or(prefixed(self.left, prefix), prefixed(self.right, prefix));
    }
    case OP_INVALID_DATA: {
      return InvalidData([...prefix, ...self.path], self.message);
    }
    case OP_MISSING_DATA: {
      return MissingData([...prefix, ...self.path], self.message);
    }
    case OP_SOURCE_UNAVAILABLE: {
      return SourceUnavailable([...prefix, ...self.path], self.message, self.cause);
    }
    case OP_UNSUPPORTED: {
      return Unsupported([...prefix, ...self.path], self.message);
    }
  }
});

// node_modules/effect/dist/esm/internal/configProvider/pathPatch.js
var empty19 = {
  _tag: "Empty"
};
var patch5 = /* @__PURE__ */ dual(2, (path3, patch9) => {
  let input = of3(patch9);
  let output = path3;
  while (isCons(input)) {
    const patch10 = input.head;
    switch (patch10._tag) {
      case "Empty": {
        input = input.tail;
        break;
      }
      case "AndThen": {
        input = cons(patch10.first, cons(patch10.second, input.tail));
        break;
      }
      case "MapName": {
        output = map3(output, patch10.f);
        input = input.tail;
        break;
      }
      case "Nested": {
        output = prepend(output, patch10.name);
        input = input.tail;
        break;
      }
      case "Unnested": {
        const containsName = pipe(head(output), contains(patch10.name));
        if (containsName) {
          output = tailNonEmpty(output);
          input = input.tail;
        } else {
          return left2(MissingData(output, `Expected ${patch10.name} to be in path in ConfigProvider#unnested`));
        }
        break;
      }
    }
  }
  return right2(output);
});

// node_modules/effect/dist/esm/internal/opCodes/config.js
var OP_CONSTANT = "Constant";
var OP_FAIL2 = "Fail";
var OP_FALLBACK = "Fallback";
var OP_DESCRIBED = "Described";
var OP_LAZY = "Lazy";
var OP_MAP_OR_FAIL = "MapOrFail";
var OP_NESTED = "Nested";
var OP_PRIMITIVE = "Primitive";
var OP_SEQUENCE = "Sequence";
var OP_HASHMAP = "HashMap";
var OP_ZIP_WITH = "ZipWith";

// node_modules/effect/dist/esm/internal/configProvider.js
var concat = (l, r) => [...l, ...r];
var ConfigProviderSymbolKey = "effect/ConfigProvider";
var ConfigProviderTypeId = /* @__PURE__ */ Symbol.for(ConfigProviderSymbolKey);
var configProviderTag = /* @__PURE__ */ GenericTag("effect/ConfigProvider");
var FlatConfigProviderSymbolKey = "effect/ConfigProviderFlat";
var FlatConfigProviderTypeId = /* @__PURE__ */ Symbol.for(FlatConfigProviderSymbolKey);
var make22 = (options) => ({
  [ConfigProviderTypeId]: ConfigProviderTypeId,
  pipe() {
    return pipeArguments(this, arguments);
  },
  ...options
});
var makeFlat = (options) => ({
  [FlatConfigProviderTypeId]: FlatConfigProviderTypeId,
  patch: options.patch,
  load: (path3, config, split2 = true) => options.load(path3, config, split2),
  enumerateChildren: options.enumerateChildren
});
var fromFlat = (flat) => make22({
  load: (config) => flatMap7(fromFlatLoop(flat, empty(), config, false), (chunk3) => match2(head(chunk3), {
    onNone: () => fail2(MissingData(empty(), `Expected a single value having structure: ${config}`)),
    onSome: succeed
  })),
  flattened: flat
});
var fromEnv = (options) => {
  const {
    pathDelim,
    seqDelim
  } = Object.assign({}, {
    pathDelim: "_",
    seqDelim: ","
  }, options);
  const makePathString = (path3) => pipe(path3, join(pathDelim));
  const unmakePathString = (pathString) => pathString.split(pathDelim);
  const getEnv = () => typeof process !== "undefined" && "env" in process && typeof process.env === "object" ? process.env : {};
  const load = (path3, primitive, split2 = true) => {
    const pathString = makePathString(path3);
    const current = getEnv();
    const valueOpt = pathString in current ? some2(current[pathString]) : none2();
    return pipe(valueOpt, mapError(() => MissingData(path3, `Expected ${pathString} to exist in the process context`)), flatMap7((value) => parsePrimitive(value, path3, primitive, seqDelim, split2)));
  };
  const enumerateChildren = (path3) => sync(() => {
    const current = getEnv();
    const keys5 = Object.keys(current);
    const keyPaths = keys5.map((value) => unmakePathString(value.toUpperCase()));
    const filteredKeyPaths = keyPaths.filter((keyPath) => {
      for (let i = 0; i < path3.length; i++) {
        const pathComponent = pipe(path3, unsafeGet(i));
        const currentElement = keyPath[i];
        if (currentElement === void 0 || pathComponent !== currentElement) {
          return false;
        }
      }
      return true;
    }).flatMap((keyPath) => keyPath.slice(path3.length, path3.length + 1));
    return fromIterable6(filteredKeyPaths);
  });
  return fromFlat(makeFlat({
    load,
    enumerateChildren,
    patch: empty19
  }));
};
var extend = (leftDef, rightDef, left3, right3) => {
  const leftPad = unfold(left3.length, (index) => index >= right3.length ? none2() : some2([leftDef(index), index + 1]));
  const rightPad = unfold(right3.length, (index) => index >= left3.length ? none2() : some2([rightDef(index), index + 1]));
  const leftExtension = concat(left3, leftPad);
  const rightExtension = concat(right3, rightPad);
  return [leftExtension, rightExtension];
};
var appendConfigPath = (path3, config) => {
  let op = config;
  if (op._tag === "Nested") {
    const out = path3.slice();
    while (op._tag === "Nested") {
      out.push(op.name);
      op = op.config;
    }
    return out;
  }
  return path3;
};
var fromFlatLoop = (flat, prefix, config, split2) => {
  const op = config;
  switch (op._tag) {
    case OP_CONSTANT: {
      return succeed(of(op.value));
    }
    case OP_DESCRIBED: {
      return suspend(() => fromFlatLoop(flat, prefix, op.config, split2));
    }
    case OP_FAIL2: {
      return fail2(MissingData(prefix, op.message));
    }
    case OP_FALLBACK: {
      return pipe(suspend(() => fromFlatLoop(flat, prefix, op.first, split2)), catchAll((error1) => {
        if (op.condition(error1)) {
          return pipe(fromFlatLoop(flat, prefix, op.second, split2), catchAll((error2) => fail2(Or(error1, error2))));
        }
        return fail2(error1);
      }));
    }
    case OP_LAZY: {
      return suspend(() => fromFlatLoop(flat, prefix, op.config(), split2));
    }
    case OP_MAP_OR_FAIL: {
      return suspend(() => pipe(fromFlatLoop(flat, prefix, op.original, split2), flatMap7(forEachSequential((a) => pipe(op.mapOrFail(a), mapError(prefixed(appendConfigPath(prefix, op.original))))))));
    }
    case OP_NESTED: {
      return suspend(() => fromFlatLoop(flat, concat(prefix, of(op.name)), op.config, split2));
    }
    case OP_PRIMITIVE: {
      return pipe(patch5(prefix, flat.patch), flatMap7((prefix2) => pipe(flat.load(prefix2, op, split2), flatMap7((values3) => {
        if (values3.length === 0) {
          const name = pipe(last(prefix2), getOrElse(() => "<n/a>"));
          return fail2(MissingData([], `Expected ${op.description} with name ${name}`));
        }
        return succeed(values3);
      }))));
    }
    case OP_SEQUENCE: {
      return pipe(patch5(prefix, flat.patch), flatMap7((patchedPrefix) => pipe(flat.enumerateChildren(patchedPrefix), flatMap7(indicesFrom), flatMap7((indices) => {
        if (indices.length === 0) {
          return suspend(() => map10(fromFlatLoop(flat, prefix, op.config, true), of));
        }
        return pipe(forEachSequential(indices, (index) => fromFlatLoop(flat, append(prefix, `[${index}]`), op.config, true)), map10((chunkChunk) => {
          const flattened = flatten2(chunkChunk);
          if (flattened.length === 0) {
            return of(empty());
          }
          return of(flattened);
        }));
      }))));
    }
    case OP_HASHMAP: {
      return suspend(() => pipe(patch5(prefix, flat.patch), flatMap7((prefix2) => pipe(flat.enumerateChildren(prefix2), flatMap7((keys5) => {
        return pipe(keys5, forEachSequential((key) => fromFlatLoop(flat, concat(prefix2, of(key)), op.valueConfig, split2)), map10((matrix) => {
          if (matrix.length === 0) {
            return of(empty8());
          }
          return pipe(transpose(matrix), map3((values3) => fromIterable7(zip(fromIterable2(keys5), values3))));
        }));
      })))));
    }
    case OP_ZIP_WITH: {
      return suspend(() => pipe(fromFlatLoop(flat, prefix, op.left, split2), either2, flatMap7((left3) => pipe(fromFlatLoop(flat, prefix, op.right, split2), either2, flatMap7((right3) => {
        if (isLeft2(left3) && isLeft2(right3)) {
          return fail2(And(left3.left, right3.left));
        }
        if (isLeft2(left3) && isRight2(right3)) {
          return fail2(left3.left);
        }
        if (isRight2(left3) && isLeft2(right3)) {
          return fail2(right3.left);
        }
        if (isRight2(left3) && isRight2(right3)) {
          const path3 = pipe(prefix, join("."));
          const fail18 = fromFlatLoopFail(prefix, path3);
          const [lefts, rights] = extend(fail18, fail18, pipe(left3.right, map3(right2)), pipe(right3.right, map3(right2)));
          return pipe(lefts, zip(rights), forEachSequential(([left4, right4]) => pipe(zip2(left4, right4), map10(([left5, right5]) => op.zip(left5, right5)))));
        }
        throw new Error("BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/effect/issues");
      })))));
    }
  }
};
var fromFlatLoopFail = (prefix, path3) => (index) => left2(MissingData(prefix, `The element at index ${index} in a sequence at path "${path3}" was missing`));
var splitPathString = (text, delim) => {
  const split2 = text.split(new RegExp(`\\s*${escape(delim)}\\s*`));
  return split2;
};
var parsePrimitive = (text, path3, primitive, delimiter, split2) => {
  if (!split2) {
    return pipe(primitive.parse(text), mapBoth({
      onFailure: prefixed(path3),
      onSuccess: of
    }));
  }
  return pipe(splitPathString(text, delimiter), forEachSequential((char) => primitive.parse(char.trim())), mapError(prefixed(path3)));
};
var transpose = (array4) => {
  return Object.keys(array4[0]).map((column) => array4.map((row) => row[column]));
};
var indicesFrom = (quotedIndices) => pipe(forEachSequential(quotedIndices, parseQuotedIndex), mapBoth({
  onFailure: () => empty(),
  onSuccess: sort(Order)
}), either2, map10(merge));
var QUOTED_INDEX_REGEX = /^(\[(\d+)\])$/;
var parseQuotedIndex = (str) => {
  const match19 = str.match(QUOTED_INDEX_REGEX);
  if (match19 !== null) {
    const matchedIndex = match19[2];
    return pipe(matchedIndex !== void 0 && matchedIndex.length > 0 ? some2(matchedIndex) : none2(), flatMap(parseInteger));
  }
  return none2();
};
var parseInteger = (str) => {
  const parsedIndex = Number.parseInt(str);
  return Number.isNaN(parsedIndex) ? none2() : some2(parsedIndex);
};

// node_modules/effect/dist/esm/internal/defaultServices/console.js
var TypeId12 = /* @__PURE__ */ Symbol.for("effect/Console");
var consoleTag = /* @__PURE__ */ GenericTag("effect/Console");
var defaultConsole = {
  [TypeId12]: TypeId12,
  assert(condition, ...args2) {
    return sync(() => {
      console.assert(condition, ...args2);
    });
  },
  clear: /* @__PURE__ */ sync(() => {
    console.clear();
  }),
  count(label) {
    return sync(() => {
      console.count(label);
    });
  },
  countReset(label) {
    return sync(() => {
      console.countReset(label);
    });
  },
  debug(...args2) {
    return sync(() => {
      console.debug(...args2);
    });
  },
  dir(item, options) {
    return sync(() => {
      console.dir(item, options);
    });
  },
  dirxml(...args2) {
    return sync(() => {
      console.dirxml(...args2);
    });
  },
  error(...args2) {
    return sync(() => {
      console.error(...args2);
    });
  },
  group(options) {
    return options?.collapsed ? sync(() => console.groupCollapsed(options?.label)) : sync(() => console.group(options?.label));
  },
  groupEnd: /* @__PURE__ */ sync(() => {
    console.groupEnd();
  }),
  info(...args2) {
    return sync(() => {
      console.info(...args2);
    });
  },
  log(...args2) {
    return sync(() => {
      console.log(...args2);
    });
  },
  table(tabularData, properties) {
    return sync(() => {
      console.table(tabularData, properties);
    });
  },
  time(label) {
    return sync(() => console.time(label));
  },
  timeEnd(label) {
    return sync(() => console.timeEnd(label));
  },
  timeLog(label, ...args2) {
    return sync(() => {
      console.timeLog(label, ...args2);
    });
  },
  trace(...args2) {
    return sync(() => {
      console.trace(...args2);
    });
  },
  warn(...args2) {
    return sync(() => {
      console.warn(...args2);
    });
  },
  unsafe: console
};

// node_modules/effect/dist/esm/internal/random.js
var RandomSymbolKey = "effect/Random";
var RandomTypeId = /* @__PURE__ */ Symbol.for(RandomSymbolKey);
var randomTag = /* @__PURE__ */ GenericTag("effect/Random");
var RandomImpl = class {
  seed;
  [RandomTypeId] = RandomTypeId;
  PRNG;
  constructor(seed) {
    this.seed = seed;
    this.PRNG = new PCGRandom(seed);
  }
  get next() {
    return sync(() => this.PRNG.number());
  }
  get nextBoolean() {
    return map10(this.next, (n) => n > 0.5);
  }
  get nextInt() {
    return sync(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER));
  }
  nextRange(min4, max6) {
    return map10(this.next, (n) => (max6 - min4) * n + min4);
  }
  nextIntBetween(min4, max6) {
    return sync(() => this.PRNG.integer(max6 - min4) + min4);
  }
  shuffle(elements) {
    return shuffleWith(elements, (n) => this.nextIntBetween(0, n));
  }
};
var shuffleWith = (elements, nextIntBounded) => {
  return suspend(() => pipe(sync(() => Array.from(elements)), flatMap7((buffer2) => {
    const numbers = [];
    for (let i = buffer2.length; i >= 2; i = i - 1) {
      numbers.push(i);
    }
    return pipe(numbers, forEachSequentialDiscard((n) => pipe(nextIntBounded(n), map10((k) => swap(buffer2, n - 1, k)))), as3(fromIterable3(buffer2)));
  })));
};
var swap = (buffer2, index1, index2) => {
  const tmp = buffer2[index1];
  buffer2[index1] = buffer2[index2];
  buffer2[index2] = tmp;
  return buffer2;
};
var make23 = (seed) => new RandomImpl(hash(seed));
var FixedRandomImpl = class {
  values;
  [RandomTypeId] = RandomTypeId;
  index = 0;
  constructor(values3) {
    this.values = values3;
    if (values3.length === 0) {
      throw new Error("Requires at least one value");
    }
  }
  getNextValue() {
    const value = this.values[this.index];
    this.index = (this.index + 1) % this.values.length;
    return value;
  }
  get next() {
    return sync(() => {
      const value = this.getNextValue();
      if (typeof value === "number") {
        return Math.max(0, Math.min(1, value));
      }
      return hash(value) / 2147483647;
    });
  }
  get nextBoolean() {
    return sync(() => {
      const value = this.getNextValue();
      if (typeof value === "boolean") {
        return value;
      }
      return hash(value) % 2 === 0;
    });
  }
  get nextInt() {
    return sync(() => {
      const value = this.getNextValue();
      if (typeof value === "number" && Number.isFinite(value)) {
        return Math.round(value);
      }
      return Math.abs(hash(value));
    });
  }
  nextRange(min4, max6) {
    return map10(this.next, (n) => (max6 - min4) * n + min4);
  }
  nextIntBetween(min4, max6) {
    return sync(() => {
      const value = this.getNextValue();
      if (typeof value === "number" && Number.isFinite(value)) {
        return Math.max(min4, Math.min(max6 - 1, Math.round(value)));
      }
      const hash2 = Math.abs(hash(value));
      return min4 + hash2 % (max6 - min4);
    });
  }
  shuffle(elements) {
    return shuffleWith(elements, (n) => this.nextIntBetween(0, n));
  }
};
var fixed = (values3) => new FixedRandomImpl(values3);

// node_modules/effect/dist/esm/internal/tracer.js
var TracerTypeId = /* @__PURE__ */ Symbol.for("effect/Tracer");
var make24 = (options) => ({
  [TracerTypeId]: TracerTypeId,
  ...options
});
var tracerTag = /* @__PURE__ */ GenericTag("effect/Tracer");
var spanTag = /* @__PURE__ */ GenericTag("effect/ParentSpan");
var randomHexString = /* @__PURE__ */ (function() {
  const characters = "abcdef0123456789";
  const charactersLength = characters.length;
  return function(length3) {
    let result = "";
    for (let i = 0; i < length3; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
})();
var NativeSpan = class {
  name;
  parent;
  context;
  startTime;
  kind;
  _tag = "Span";
  spanId;
  traceId = "native";
  sampled = true;
  status;
  attributes;
  events = [];
  links;
  constructor(name, parent, context7, links, startTime, kind) {
    this.name = name;
    this.parent = parent;
    this.context = context7;
    this.startTime = startTime;
    this.kind = kind;
    this.status = {
      _tag: "Started",
      startTime
    };
    this.attributes = /* @__PURE__ */ new Map();
    this.traceId = parent._tag === "Some" ? parent.value.traceId : randomHexString(32);
    this.spanId = randomHexString(16);
    this.links = Array.from(links);
  }
  end(endTime, exit4) {
    this.status = {
      _tag: "Ended",
      endTime,
      exit: exit4,
      startTime: this.status.startTime
    };
  }
  attribute(key, value) {
    this.attributes.set(key, value);
  }
  event(name, startTime, attributes) {
    this.events.push([name, startTime, attributes ?? {}]);
  }
  addLinks(links) {
    this.links.push(...links);
  }
};
var nativeTracer = /* @__PURE__ */ make24({
  span: (name, parent, context7, links, startTime, kind) => new NativeSpan(name, parent, context7, links, startTime, kind),
  context: (f) => f()
});
var addSpanStackTrace = (options) => {
  if (options?.captureStackTrace === false) {
    return options;
  } else if (options?.captureStackTrace !== void 0 && typeof options.captureStackTrace !== "boolean") {
    return options;
  }
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 3;
  const traceError = new Error();
  Error.stackTraceLimit = limit;
  let cache = false;
  return {
    ...options,
    captureStackTrace: () => {
      if (cache !== false) {
        return cache;
      }
      if (traceError.stack !== void 0) {
        const stack = traceError.stack.split("\n");
        if (stack[3] !== void 0) {
          cache = stack[3].trim();
          return cache;
        }
      }
    }
  };
};
var DisablePropagation = /* @__PURE__ */ Reference2()("effect/Tracer/DisablePropagation", {
  defaultValue: constFalse
});

// node_modules/effect/dist/esm/internal/defaultServices.js
var liveServices = /* @__PURE__ */ pipe(/* @__PURE__ */ empty3(), /* @__PURE__ */ add2(clockTag, /* @__PURE__ */ make20()), /* @__PURE__ */ add2(consoleTag, defaultConsole), /* @__PURE__ */ add2(randomTag, /* @__PURE__ */ make23(/* @__PURE__ */ Math.random())), /* @__PURE__ */ add2(configProviderTag, /* @__PURE__ */ fromEnv()), /* @__PURE__ */ add2(tracerTag, nativeTracer));
var currentServices = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/DefaultServices/currentServices"), () => fiberRefUnsafeMakeContext(liveServices));
var sleep = (duration3) => {
  const decodedDuration = decode(duration3);
  return clockWith((clock3) => clock3.sleep(decodedDuration));
};
var defaultServicesWith = (f) => withFiberRuntime((fiber) => f(fiber.currentDefaultServices));
var clockWith = (f) => defaultServicesWith((services) => f(services.unsafeMap.get(clockTag.key)));
var currentTimeMillis = /* @__PURE__ */ clockWith((clock3) => clock3.currentTimeMillis);
var currentTimeNanos = /* @__PURE__ */ clockWith((clock3) => clock3.currentTimeNanos);
var withClock = /* @__PURE__ */ dual(2, (effect3, c) => fiberRefLocallyWith(currentServices, add2(clockTag, c))(effect3));
var withConfigProvider = /* @__PURE__ */ dual(2, (self, provider) => fiberRefLocallyWith(currentServices, add2(configProviderTag, provider))(self));
var configProviderWith = (f) => defaultServicesWith((services) => f(services.unsafeMap.get(configProviderTag.key)));
var randomWith = (f) => defaultServicesWith((services) => f(services.unsafeMap.get(randomTag.key)));
var withRandom = /* @__PURE__ */ dual(2, (effect3, value) => fiberRefLocallyWith(currentServices, add2(randomTag, value))(effect3));
var next = /* @__PURE__ */ randomWith((random4) => random4.next);
var tracerWith = (f) => defaultServicesWith((services) => f(services.unsafeMap.get(tracerTag.key)));
var withTracer = /* @__PURE__ */ dual(2, (effect3, value) => fiberRefLocallyWith(currentServices, add2(tracerTag, value))(effect3));

// node_modules/effect/dist/esm/Clock.js
var ClockTypeId2 = ClockTypeId;
var make25 = make20;
var sleep2 = sleep;
var currentTimeMillis2 = currentTimeMillis;
var currentTimeNanos2 = currentTimeNanos;
var clockWith2 = clockWith;
var Clock = clockTag;

// node_modules/effect/dist/esm/internal/fiberRefs.js
function unsafeMake5(fiberRefLocals) {
  return new FiberRefsImpl(fiberRefLocals);
}
function empty20() {
  return unsafeMake5(/* @__PURE__ */ new Map());
}
var FiberRefsSym = /* @__PURE__ */ Symbol.for("effect/FiberRefs");
var FiberRefsImpl = class {
  locals;
  [FiberRefsSym] = FiberRefsSym;
  constructor(locals) {
    this.locals = locals;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var findAncestor = (_ref, _parentStack, _childStack, _childModified = false) => {
  const ref = _ref;
  let parentStack = _parentStack;
  let childStack = _childStack;
  let childModified = _childModified;
  let ret = void 0;
  while (ret === void 0) {
    if (isNonEmptyReadonlyArray(parentStack) && isNonEmptyReadonlyArray(childStack)) {
      const parentFiberId = headNonEmpty(parentStack)[0];
      const parentAncestors = tailNonEmpty(parentStack);
      const childFiberId = headNonEmpty(childStack)[0];
      const childRefValue = headNonEmpty(childStack)[1];
      const childAncestors = tailNonEmpty(childStack);
      if (parentFiberId.startTimeMillis < childFiberId.startTimeMillis) {
        childStack = childAncestors;
        childModified = true;
      } else if (parentFiberId.startTimeMillis > childFiberId.startTimeMillis) {
        parentStack = parentAncestors;
      } else {
        if (parentFiberId.id < childFiberId.id) {
          childStack = childAncestors;
          childModified = true;
        } else if (parentFiberId.id > childFiberId.id) {
          parentStack = parentAncestors;
        } else {
          ret = [childRefValue, childModified];
        }
      }
    } else {
      ret = [ref.initial, true];
    }
  }
  return ret;
};
var joinAs = /* @__PURE__ */ dual(3, (self, fiberId3, that) => {
  const parentFiberRefs = new Map(self.locals);
  that.locals.forEach((childStack, fiberRef) => {
    const childValue = childStack[0][1];
    if (!childStack[0][0][symbol2](fiberId3)) {
      if (!parentFiberRefs.has(fiberRef)) {
        if (equals(childValue, fiberRef.initial)) {
          return;
        }
        parentFiberRefs.set(fiberRef, [[fiberId3, fiberRef.join(fiberRef.initial, childValue)]]);
        return;
      }
      const parentStack = parentFiberRefs.get(fiberRef);
      const [ancestor, wasModified] = findAncestor(fiberRef, parentStack, childStack);
      if (wasModified) {
        const patch9 = fiberRef.diff(ancestor, childValue);
        const oldValue = parentStack[0][1];
        const newValue = fiberRef.join(oldValue, fiberRef.patch(patch9)(oldValue));
        if (!equals(oldValue, newValue)) {
          let newStack;
          const parentFiberId = parentStack[0][0];
          if (parentFiberId[symbol2](fiberId3)) {
            newStack = [[parentFiberId, newValue], ...parentStack.slice(1)];
          } else {
            newStack = [[fiberId3, newValue], ...parentStack];
          }
          parentFiberRefs.set(fiberRef, newStack);
        }
      }
    }
  });
  return new FiberRefsImpl(parentFiberRefs);
});
var forkAs = /* @__PURE__ */ dual(2, (self, childId) => {
  const map25 = /* @__PURE__ */ new Map();
  unsafeForkAs(self, map25, childId);
  return new FiberRefsImpl(map25);
});
var unsafeForkAs = (self, map25, fiberId3) => {
  self.locals.forEach((stack, fiberRef) => {
    const oldValue = stack[0][1];
    const newValue = fiberRef.patch(fiberRef.fork)(oldValue);
    if (equals(oldValue, newValue)) {
      map25.set(fiberRef, stack);
    } else {
      map25.set(fiberRef, [[fiberId3, newValue], ...stack]);
    }
  });
};
var fiberRefs = (self) => fromIterable6(self.locals.keys());
var setAll = (self) => forEachSequentialDiscard(fiberRefs(self), (fiberRef) => fiberRefSet(fiberRef, getOrDefault(self, fiberRef)));
var delete_ = /* @__PURE__ */ dual(2, (self, fiberRef) => {
  const locals = new Map(self.locals);
  locals.delete(fiberRef);
  return new FiberRefsImpl(locals);
});
var get9 = /* @__PURE__ */ dual(2, (self, fiberRef) => {
  if (!self.locals.has(fiberRef)) {
    return none2();
  }
  return some2(headNonEmpty(self.locals.get(fiberRef))[1]);
});
var getOrDefault = /* @__PURE__ */ dual(2, (self, fiberRef) => pipe(get9(self, fiberRef), getOrElse(() => fiberRef.initial)));
var updateAs = /* @__PURE__ */ dual(2, (self, {
  fiberId: fiberId3,
  fiberRef,
  value
}) => {
  if (self.locals.size === 0) {
    return new FiberRefsImpl(/* @__PURE__ */ new Map([[fiberRef, [[fiberId3, value]]]]));
  }
  const locals = new Map(self.locals);
  unsafeUpdateAs(locals, fiberId3, fiberRef, value);
  return new FiberRefsImpl(locals);
});
var unsafeUpdateAs = (locals, fiberId3, fiberRef, value) => {
  const oldStack = locals.get(fiberRef) ?? [];
  let newStack;
  if (isNonEmptyReadonlyArray(oldStack)) {
    const [currentId, currentValue] = headNonEmpty(oldStack);
    if (currentId[symbol2](fiberId3)) {
      if (equals(currentValue, value)) {
        return;
      } else {
        newStack = [[fiberId3, value], ...oldStack.slice(1)];
      }
    } else {
      newStack = [[fiberId3, value], ...oldStack];
    }
  } else {
    newStack = [[fiberId3, value]];
  }
  locals.set(fiberRef, newStack);
};
var updateManyAs = /* @__PURE__ */ dual(2, (self, {
  entries: entries2,
  forkAs: forkAs2
}) => {
  if (self.locals.size === 0) {
    return new FiberRefsImpl(new Map(entries2));
  }
  const locals = new Map(self.locals);
  if (forkAs2 !== void 0) {
    unsafeForkAs(self, locals, forkAs2);
  }
  entries2.forEach(([fiberRef, values3]) => {
    if (values3.length === 1) {
      unsafeUpdateAs(locals, values3[0][0], fiberRef, values3[0][1]);
    } else {
      values3.forEach(([fiberId3, value]) => {
        unsafeUpdateAs(locals, fiberId3, fiberRef, value);
      });
    }
  });
  return new FiberRefsImpl(locals);
});

// node_modules/effect/dist/esm/FiberRefs.js
var delete_2 = delete_;
var get10 = get9;
var getOrDefault2 = getOrDefault;
var joinAs2 = joinAs;
var setAll2 = setAll;
var updateAs2 = updateAs;
var updateManyAs2 = updateManyAs;
var empty21 = empty20;

// node_modules/effect/dist/esm/LogLevel.js
var All = logLevelAll;
var Fatal = logLevelFatal;
var Error2 = logLevelError;
var Warning = logLevelWarning;
var Info = logLevelInfo;
var Debug = logLevelDebug;
var Trace = logLevelTrace;
var None3 = logLevelNone;
var Order3 = /* @__PURE__ */ pipe(Order, /* @__PURE__ */ mapInput2((level) => level.ordinal));
var greaterThan3 = /* @__PURE__ */ greaterThan(Order3);
var fromLiteral = (literal) => {
  switch (literal) {
    case "All":
      return All;
    case "Debug":
      return Debug;
    case "Error":
      return Error2;
    case "Fatal":
      return Fatal;
    case "Info":
      return Info;
    case "Trace":
      return Trace;
    case "None":
      return None3;
    case "Warning":
      return Warning;
  }
};

// node_modules/effect/dist/esm/internal/logSpan.js
var make26 = (label, startTime) => ({
  label,
  startTime
});
var formatLabel = (key) => key.replace(/[\s="]/g, "_");
var render = (now) => (self) => {
  const label = formatLabel(self.label);
  return `${label}=${now - self.startTime}ms`;
};

// node_modules/effect/dist/esm/LogSpan.js
var make27 = make26;

// node_modules/effect/dist/esm/Ref.js
var Ref_exports = {};
__export(Ref_exports, {
  RefTypeId: () => RefTypeId2,
  get: () => get12,
  getAndSet: () => getAndSet2,
  getAndUpdate: () => getAndUpdate2,
  getAndUpdateSome: () => getAndUpdateSome2,
  make: () => make29,
  modify: () => modify4,
  modifySome: () => modifySome2,
  set: () => set6,
  setAndGet: () => setAndGet2,
  unsafeMake: () => unsafeMake7,
  update: () => update3,
  updateAndGet: () => updateAndGet2,
  updateSome: () => updateSome2,
  updateSomeAndGet: () => updateSomeAndGet2
});

// node_modules/effect/dist/esm/Effectable.js
var EffectPrototype2 = EffectPrototype;
var CommitPrototype2 = CommitPrototype;
var Base2 = Base;
var Class2 = class extends Base2 {
};

// node_modules/effect/dist/esm/Readable.js
var TypeId13 = /* @__PURE__ */ Symbol.for("effect/Readable");

// node_modules/effect/dist/esm/internal/ref.js
var RefTypeId = /* @__PURE__ */ Symbol.for("effect/Ref");
var refVariance = {
  /* c8 ignore next */
  _A: (_) => _
};
var RefImpl = class extends Class2 {
  ref;
  commit() {
    return this.get;
  }
  [RefTypeId] = refVariance;
  [TypeId13] = TypeId13;
  constructor(ref) {
    super();
    this.ref = ref;
    this.get = sync(() => get6(this.ref));
  }
  get;
  modify(f) {
    return sync(() => {
      const current = get6(this.ref);
      const [b, a] = f(current);
      if (current !== a) {
        set2(a)(this.ref);
      }
      return b;
    });
  }
};
var unsafeMake6 = (value) => new RefImpl(make11(value));
var make28 = (value) => sync(() => unsafeMake6(value));
var get11 = (self) => self.get;
var set5 = /* @__PURE__ */ dual(2, (self, value) => self.modify(() => [void 0, value]));
var getAndSet = /* @__PURE__ */ dual(2, (self, value) => self.modify((a) => [a, value]));
var getAndUpdate = /* @__PURE__ */ dual(2, (self, f) => self.modify((a) => [a, f(a)]));
var getAndUpdateSome = /* @__PURE__ */ dual(2, (self, pf) => self.modify((value) => {
  const option3 = pf(value);
  switch (option3._tag) {
    case "None": {
      return [value, value];
    }
    case "Some": {
      return [value, option3.value];
    }
  }
}));
var setAndGet = /* @__PURE__ */ dual(2, (self, value) => self.modify(() => [value, value]));
var modify3 = /* @__PURE__ */ dual(2, (self, f) => self.modify(f));
var modifySome = /* @__PURE__ */ dual(3, (self, fallback, pf) => self.modify((value) => {
  const option3 = pf(value);
  switch (option3._tag) {
    case "None": {
      return [fallback, value];
    }
    case "Some": {
      return option3.value;
    }
  }
}));
var update2 = /* @__PURE__ */ dual(2, (self, f) => self.modify((a) => [void 0, f(a)]));
var updateAndGet = /* @__PURE__ */ dual(2, (self, f) => self.modify((a) => {
  const result = f(a);
  return [result, result];
}));
var updateSome = /* @__PURE__ */ dual(2, (self, f) => self.modify((a) => [void 0, match2(f(a), {
  onNone: () => a,
  onSome: (b) => b
})]));
var updateSomeAndGet = /* @__PURE__ */ dual(2, (self, pf) => self.modify((value) => {
  const option3 = pf(value);
  switch (option3._tag) {
    case "None": {
      return [value, value];
    }
    case "Some": {
      return [option3.value, option3.value];
    }
  }
}));

// node_modules/effect/dist/esm/Ref.js
var RefTypeId2 = RefTypeId;
var make29 = make28;
var get12 = get11;
var getAndSet2 = getAndSet;
var getAndUpdate2 = getAndUpdate;
var getAndUpdateSome2 = getAndUpdateSome;
var modify4 = modify3;
var modifySome2 = modifySome;
var set6 = set5;
var setAndGet2 = setAndGet;
var update3 = update2;
var updateAndGet2 = updateAndGet;
var updateSome2 = updateSome;
var updateSomeAndGet2 = updateSomeAndGet;
var unsafeMake7 = unsafeMake6;

// node_modules/effect/dist/esm/Tracer.js
var tracerWith2 = tracerWith;

// node_modules/effect/dist/esm/internal/fiberRefs/patch.js
var OP_EMPTY2 = "Empty";
var OP_ADD = "Add";
var OP_REMOVE = "Remove";
var OP_UPDATE = "Update";
var OP_AND_THEN = "AndThen";
var empty22 = {
  _tag: OP_EMPTY2
};
var diff5 = (oldValue, newValue) => {
  const missingLocals = new Map(oldValue.locals);
  let patch9 = empty22;
  for (const [fiberRef, pairs] of newValue.locals.entries()) {
    const newValue2 = headNonEmpty(pairs)[1];
    const old = missingLocals.get(fiberRef);
    if (old !== void 0) {
      const oldValue2 = headNonEmpty(old)[1];
      if (!equals(oldValue2, newValue2)) {
        patch9 = combine7({
          _tag: OP_UPDATE,
          fiberRef,
          patch: fiberRef.diff(oldValue2, newValue2)
        })(patch9);
      }
    } else {
      patch9 = combine7({
        _tag: OP_ADD,
        fiberRef,
        value: newValue2
      })(patch9);
    }
    missingLocals.delete(fiberRef);
  }
  for (const [fiberRef] of missingLocals.entries()) {
    patch9 = combine7({
      _tag: OP_REMOVE,
      fiberRef
    })(patch9);
  }
  return patch9;
};
var combine7 = /* @__PURE__ */ dual(2, (self, that) => ({
  _tag: OP_AND_THEN,
  first: self,
  second: that
}));
var patch6 = /* @__PURE__ */ dual(3, (self, fiberId3, oldValue) => {
  let fiberRefs3 = oldValue;
  let patches = of(self);
  while (isNonEmptyReadonlyArray(patches)) {
    const head6 = headNonEmpty(patches);
    const tail = tailNonEmpty(patches);
    switch (head6._tag) {
      case OP_EMPTY2: {
        patches = tail;
        break;
      }
      case OP_ADD: {
        fiberRefs3 = updateAs(fiberRefs3, {
          fiberId: fiberId3,
          fiberRef: head6.fiberRef,
          value: head6.value
        });
        patches = tail;
        break;
      }
      case OP_REMOVE: {
        fiberRefs3 = delete_(fiberRefs3, head6.fiberRef);
        patches = tail;
        break;
      }
      case OP_UPDATE: {
        const value = getOrDefault(fiberRefs3, head6.fiberRef);
        fiberRefs3 = updateAs(fiberRefs3, {
          fiberId: fiberId3,
          fiberRef: head6.fiberRef,
          value: head6.fiberRef.patch(head6.patch)(value)
        });
        patches = tail;
        break;
      }
      case OP_AND_THEN: {
        patches = prepend(head6.first)(prepend(head6.second)(tail));
        break;
      }
    }
  }
  return fiberRefs3;
});

// node_modules/effect/dist/esm/internal/metric/label.js
var MetricLabelSymbolKey = "effect/MetricLabel";
var MetricLabelTypeId = /* @__PURE__ */ Symbol.for(MetricLabelSymbolKey);
var MetricLabelImpl = class {
  key;
  value;
  [MetricLabelTypeId] = MetricLabelTypeId;
  _hash;
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this._hash = string(MetricLabelSymbolKey + this.key + this.value);
  }
  [symbol]() {
    return this._hash;
  }
  [symbol2](that) {
    return isMetricLabel(that) && this.key === that.key && this.value === that.value;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make30 = (key, value) => {
  return new MetricLabelImpl(key, value);
};
var isMetricLabel = (u) => hasProperty(u, MetricLabelTypeId);

// node_modules/effect/dist/esm/internal/core-effect.js
var annotateLogs = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), function() {
  const args2 = arguments;
  return fiberRefLocallyWith(args2[0], currentLogAnnotations, typeof args2[1] === "string" ? set3(args2[1], args2[2]) : (annotations2) => Object.entries(args2[1]).reduce((acc, [key, value]) => set3(acc, key, value), annotations2));
});
var asSome = (self) => map10(self, some2);
var asSomeError = (self) => mapError(self, some2);
var try_ = (arg) => {
  let evaluate2;
  let onFailure = void 0;
  if (typeof arg === "function") {
    evaluate2 = arg;
  } else {
    evaluate2 = arg.try;
    onFailure = arg.catch;
  }
  return suspend(() => {
    try {
      return succeed(internalCall(evaluate2));
    } catch (error) {
      return fail2(onFailure ? internalCall(() => onFailure(error)) : new UnknownException(error, "An unknown error occurred in Effect.try"));
    }
  });
};
var _catch = /* @__PURE__ */ dual(3, (self, tag2, options) => catchAll(self, (e) => {
  if (hasProperty(e, tag2) && e[tag2] === options.failure) {
    return options.onFailure(e);
  }
  return fail2(e);
}));
var catchAllDefect = /* @__PURE__ */ dual(2, (self, f) => catchAllCause(self, (cause3) => {
  const option3 = find(cause3, (_) => isDieType(_) ? some2(_) : none2());
  switch (option3._tag) {
    case "None": {
      return failCause(cause3);
    }
    case "Some": {
      return f(option3.value.defect);
    }
  }
}));
var catchSomeCause = /* @__PURE__ */ dual(2, (self, f) => matchCauseEffect(self, {
  onFailure: (cause3) => {
    const option3 = f(cause3);
    switch (option3._tag) {
      case "None": {
        return failCause(cause3);
      }
      case "Some": {
        return option3.value;
      }
    }
  },
  onSuccess: succeed
}));
var catchSomeDefect = /* @__PURE__ */ dual(2, (self, pf) => catchAllCause(self, (cause3) => {
  const option3 = find(cause3, (_) => isDieType(_) ? some2(_) : none2());
  switch (option3._tag) {
    case "None": {
      return failCause(cause3);
    }
    case "Some": {
      const optionEffect = pf(option3.value.defect);
      return optionEffect._tag === "Some" ? optionEffect.value : failCause(cause3);
    }
  }
}));
var catchTag = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, ...args2) => {
  const f = args2[args2.length - 1];
  let predicate;
  if (args2.length === 2) {
    predicate = isTagged(args2[0]);
  } else {
    predicate = (e) => {
      const tag2 = hasProperty(e, "_tag") ? e["_tag"] : void 0;
      if (!tag2) return false;
      for (let i = 0; i < args2.length - 1; i++) {
        if (args2[i] === tag2) return true;
      }
      return false;
    };
  }
  return catchIf(self, predicate, f);
});
var catchTags = /* @__PURE__ */ dual(2, (self, cases) => {
  let keys5;
  return catchIf(self, (e) => {
    keys5 ??= Object.keys(cases);
    return hasProperty(e, "_tag") && isString(e["_tag"]) && keys5.includes(e["_tag"]);
  }, (e) => cases[e["_tag"]](e));
});
var cause = (self) => matchCause(self, {
  onFailure: identity,
  onSuccess: () => empty16
});
var clockWith3 = clockWith2;
var clock = /* @__PURE__ */ clockWith3(succeed);
var delay = /* @__PURE__ */ dual(2, (self, duration3) => zipRight2(sleep2(duration3), self));
var descriptorWith = (f) => withFiberRuntime((state, status3) => f({
  id: state.id(),
  status: status3,
  interruptors: interruptors(state.getFiberRef(currentInterruptedCause))
}));
var allowInterrupt = /* @__PURE__ */ descriptorWith((descriptor3) => size3(descriptor3.interruptors) > 0 ? interrupt2 : void_2);
var descriptor = /* @__PURE__ */ descriptorWith(succeed);
var diffFiberRefs = (self) => summarized(self, fiberRefs2, diff5);
var diffFiberRefsAndRuntimeFlags = (self) => summarized(self, zip2(fiberRefs2, runtimeFlags), ([refs, flags], [refsNew, flagsNew]) => [diff5(refs, refsNew), diff4(flags, flagsNew)]);
var Do2 = /* @__PURE__ */ succeed({});
var bind3 = /* @__PURE__ */ bind(map10, flatMap7);
var bindTo3 = /* @__PURE__ */ bindTo(map10);
var let_3 = /* @__PURE__ */ let_(map10);
var dropUntil = /* @__PURE__ */ dual(2, (elements, predicate) => suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let next4;
  let dropping3 = succeed(false);
  let i = 0;
  while ((next4 = iterator.next()) && !next4.done) {
    const a = next4.value;
    const index = i++;
    dropping3 = flatMap7(dropping3, (bool) => {
      if (bool) {
        builder.push(a);
        return succeed(true);
      }
      return predicate(a, index);
    });
  }
  return map10(dropping3, () => builder);
}));
var dropWhile = /* @__PURE__ */ dual(2, (elements, predicate) => suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let next4;
  let dropping3 = succeed(true);
  let i = 0;
  while ((next4 = iterator.next()) && !next4.done) {
    const a = next4.value;
    const index = i++;
    dropping3 = flatMap7(dropping3, (d) => map10(d ? predicate(a, index) : succeed(false), (b) => {
      if (!b) {
        builder.push(a);
      }
      return b;
    }));
  }
  return map10(dropping3, () => builder);
}));
var contextWith = (f) => map10(context(), f);
var eventually = (self) => orElse2(self, () => flatMap7(yieldNow(), () => eventually(self)));
var filterMap4 = /* @__PURE__ */ dual(2, (elements, pf) => map10(forEachSequential(elements, identity), filterMap2(pf)));
var filterOrDie = /* @__PURE__ */ dual(3, (self, predicate, orDieWith5) => filterOrElse(self, predicate, (a) => dieSync(() => orDieWith5(a))));
var filterOrDieMessage = /* @__PURE__ */ dual(3, (self, predicate, message) => filterOrElse(self, predicate, () => dieMessage(message)));
var filterOrElse = /* @__PURE__ */ dual(3, (self, predicate, orElse12) => flatMap7(self, (a) => predicate(a) ? succeed(a) : orElse12(a)));
var liftPredicate2 = /* @__PURE__ */ dual(3, (self, predicate, orFailWith) => suspend(() => predicate(self) ? succeed(self) : fail2(orFailWith(self))));
var filterOrFail = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, predicate, orFailWith) => filterOrElse(self, predicate, (a) => orFailWith === void 0 ? fail2(new NoSuchElementException()) : failSync(() => orFailWith(a))));
var findFirst3 = /* @__PURE__ */ dual(2, (elements, predicate) => suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const next4 = iterator.next();
  if (!next4.done) {
    return findLoop(iterator, 0, predicate, next4.value);
  }
  return succeed(none2());
}));
var findLoop = (iterator, index, f, value) => flatMap7(f(value, index), (result) => {
  if (result) {
    return succeed(some2(value));
  }
  const next4 = iterator.next();
  if (!next4.done) {
    return findLoop(iterator, index + 1, f, next4.value);
  }
  return succeed(none2());
});
var firstSuccessOf = (effects) => suspend(() => {
  const list = fromIterable3(effects);
  if (!isNonEmpty2(list)) {
    return dieSync(() => new IllegalArgumentException(`Received an empty collection of effects`));
  }
  return pipe(tailNonEmpty2(list), reduce(headNonEmpty2(list), (left3, right3) => orElse2(left3, () => right3)));
});
var flipWith = /* @__PURE__ */ dual(2, (self, f) => flip(f(flip(self))));
var match7 = /* @__PURE__ */ dual(2, (self, options) => matchEffect(self, {
  onFailure: (e) => succeed(options.onFailure(e)),
  onSuccess: (a) => succeed(options.onSuccess(a))
}));
var every4 = /* @__PURE__ */ dual(2, (elements, predicate) => suspend(() => forAllLoop(elements[Symbol.iterator](), 0, predicate)));
var forAllLoop = (iterator, index, f) => {
  const next4 = iterator.next();
  return next4.done ? succeed(true) : flatMap7(f(next4.value, index), (b) => b ? forAllLoop(iterator, index + 1, f) : succeed(b));
};
var forever = (self) => {
  const loop3 = flatMap7(flatMap7(self, () => yieldNow()), () => loop3);
  return loop3;
};
var fiberRefs2 = /* @__PURE__ */ withFiberRuntime((state) => succeed(state.getFiberRefs()));
var head3 = (self) => flatMap7(self, (as13) => {
  const iterator = as13[Symbol.iterator]();
  const next4 = iterator.next();
  if (next4.done) {
    return fail2(new NoSuchElementException());
  }
  return succeed(next4.value);
});
var ignore = (self) => match7(self, {
  onFailure: constVoid,
  onSuccess: constVoid
});
var ignoreLogged = (self) => matchCauseEffect(self, {
  onFailure: (cause3) => logDebug(cause3, "An error was silently ignored because it is not anticipated to be useful"),
  onSuccess: () => void_2
});
var inheritFiberRefs = (childFiberRefs) => updateFiberRefs((parentFiberId, parentFiberRefs) => joinAs2(parentFiberRefs, parentFiberId, childFiberRefs));
var isFailure3 = (self) => match7(self, {
  onFailure: constTrue,
  onSuccess: constFalse
});
var isSuccess2 = (self) => match7(self, {
  onFailure: constFalse,
  onSuccess: constTrue
});
var iterate = (initial, options) => suspend(() => {
  if (options.while(initial)) {
    return flatMap7(options.body(initial), (z2) => iterate(z2, options));
  }
  return succeed(initial);
});
var logWithLevel = (level) => (...message) => {
  const levelOption = fromNullable(level);
  let cause3 = void 0;
  for (let i = 0, len = message.length; i < len; i++) {
    const msg = message[i];
    if (isCause(msg)) {
      if (cause3 !== void 0) {
        cause3 = sequential(cause3, msg);
      } else {
        cause3 = msg;
      }
      message = [...message.slice(0, i), ...message.slice(i + 1)];
      i--;
    }
  }
  if (cause3 === void 0) {
    cause3 = empty16;
  }
  return withFiberRuntime((fiberState) => {
    fiberState.log(message, cause3, levelOption);
    return void_2;
  });
};
var log = /* @__PURE__ */ logWithLevel();
var logTrace = /* @__PURE__ */ logWithLevel(Trace);
var logDebug = /* @__PURE__ */ logWithLevel(Debug);
var logInfo = /* @__PURE__ */ logWithLevel(Info);
var logWarning = /* @__PURE__ */ logWithLevel(Warning);
var logError = /* @__PURE__ */ logWithLevel(Error2);
var logFatal = /* @__PURE__ */ logWithLevel(Fatal);
var withLogSpan = /* @__PURE__ */ dual(2, (effect3, label) => flatMap7(currentTimeMillis2, (now) => fiberRefLocallyWith(effect3, currentLogSpan, prepend3(make27(label, now)))));
var logAnnotations = /* @__PURE__ */ fiberRefGet(currentLogAnnotations);
var loop = (initial, options) => options.discard ? loopDiscard(initial, options.while, options.step, options.body) : map10(loopInternal(initial, options.while, options.step, options.body), fromIterable2);
var loopInternal = (initial, cont, inc, body) => suspend(() => cont(initial) ? flatMap7(body(initial), (a) => map10(loopInternal(inc(initial), cont, inc, body), prepend3(a))) : sync(() => empty9()));
var loopDiscard = (initial, cont, inc, body) => suspend(() => cont(initial) ? flatMap7(body(initial), () => loopDiscard(inc(initial), cont, inc, body)) : void_2);
var mapAccum2 = /* @__PURE__ */ dual(3, (elements, initial, f) => suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let result = succeed(initial);
  let next4;
  let i = 0;
  while (!(next4 = iterator.next()).done) {
    const index = i++;
    const value = next4.value;
    result = flatMap7(result, (state) => map10(f(state, value, index), ([z, b]) => {
      builder.push(b);
      return z;
    }));
  }
  return map10(result, (z) => [z, builder]);
}));
var mapErrorCause2 = /* @__PURE__ */ dual(2, (self, f) => matchCauseEffect(self, {
  onFailure: (c) => failCauseSync(() => f(c)),
  onSuccess: succeed
}));
var memoize = (self) => pipe(deferredMake(), flatMap7((deferred) => pipe(diffFiberRefsAndRuntimeFlags(self), intoDeferred(deferred), once, map10((complete4) => zipRight2(complete4, pipe(deferredAwait(deferred), flatMap7(([patch9, a]) => as3(zip2(patchFiberRefs(patch9[0]), updateRuntimeFlags(patch9[1])), a))))))));
var merge5 = (self) => matchEffect(self, {
  onFailure: (e) => succeed(e),
  onSuccess: succeed
});
var negate = (self) => map10(self, (b) => !b);
var none6 = (self) => flatMap7(self, (option3) => {
  switch (option3._tag) {
    case "None":
      return void_2;
    case "Some":
      return fail2(new NoSuchElementException());
  }
});
var once = (self) => map10(make29(true), (ref) => asVoid2(whenEffect(self, getAndSet2(ref, false))));
var option = (self) => matchEffect(self, {
  onFailure: () => succeed(none2()),
  onSuccess: (a) => succeed(some2(a))
});
var orElseFail = /* @__PURE__ */ dual(2, (self, evaluate2) => orElse2(self, () => failSync(evaluate2)));
var orElseSucceed = /* @__PURE__ */ dual(2, (self, evaluate2) => orElse2(self, () => sync(evaluate2)));
var parallelErrors = (self) => matchCauseEffect(self, {
  onFailure: (cause3) => {
    const errors = fromIterable2(failures(cause3));
    return errors.length === 0 ? failCause(cause3) : fail2(errors);
  },
  onSuccess: succeed
});
var patchFiberRefs = (patch9) => updateFiberRefs((fiberId3, fiberRefs3) => pipe(patch9, patch6(fiberId3, fiberRefs3)));
var promise = (evaluate2) => evaluate2.length >= 1 ? async_((resolve3, signal) => {
  try {
    evaluate2(signal).then((a) => resolve3(succeed(a)), (e) => resolve3(die2(e)));
  } catch (e) {
    resolve3(die2(e));
  }
}) : async_((resolve3) => {
  try {
    ;
    evaluate2().then((a) => resolve3(succeed(a)), (e) => resolve3(die2(e)));
  } catch (e) {
    resolve3(die2(e));
  }
});
var provideService = /* @__PURE__ */ dual(3, (self, tag2, service3) => contextWithEffect((env) => provideContext(self, add2(env, tag2, service3))));
var provideServiceEffect = /* @__PURE__ */ dual(3, (self, tag2, effect3) => contextWithEffect((env) => flatMap7(effect3, (service3) => provideContext(self, pipe(env, add2(tag2, service3))))));
var random2 = /* @__PURE__ */ randomWith(succeed);
var reduce9 = /* @__PURE__ */ dual(3, (elements, zero2, f) => fromIterable2(elements).reduce((acc, el, i) => flatMap7(acc, (a) => f(a, el, i)), succeed(zero2)));
var reduceRight2 = /* @__PURE__ */ dual(3, (elements, zero2, f) => fromIterable2(elements).reduceRight((acc, el, i) => flatMap7(acc, (a) => f(el, a, i)), succeed(zero2)));
var reduceWhile = /* @__PURE__ */ dual(3, (elements, zero2, options) => flatMap7(sync(() => elements[Symbol.iterator]()), (iterator) => reduceWhileLoop(iterator, 0, zero2, options.while, options.body)));
var reduceWhileLoop = (iterator, index, state, predicate, f) => {
  const next4 = iterator.next();
  if (!next4.done && predicate(state)) {
    return flatMap7(f(state, next4.value, index), (nextState) => reduceWhileLoop(iterator, index + 1, nextState, predicate, f));
  }
  return succeed(state);
};
var repeatN = /* @__PURE__ */ dual(2, (self, n) => suspend(() => repeatNLoop(self, n)));
var repeatNLoop = (self, n) => flatMap7(self, (a) => n <= 0 ? succeed(a) : zipRight2(yieldNow(), repeatNLoop(self, n - 1)));
var sandbox = (self) => matchCauseEffect(self, {
  onFailure: fail2,
  onSuccess: succeed
});
var setFiberRefs = (fiberRefs3) => suspend(() => setAll2(fiberRefs3));
var sleep3 = sleep2;
var succeedNone = /* @__PURE__ */ succeed(/* @__PURE__ */ none2());
var succeedSome = (value) => succeed(some2(value));
var summarized = /* @__PURE__ */ dual(3, (self, summary5, f) => flatMap7(summary5, (start3) => flatMap7(self, (value) => map10(summary5, (end4) => [f(start3, end4), value]))));
var tagMetrics = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), function() {
  return labelMetrics(arguments[0], typeof arguments[1] === "string" ? [make30(arguments[1], arguments[2])] : Object.entries(arguments[1]).map(([k, v]) => make30(k, v)));
});
var labelMetrics = /* @__PURE__ */ dual(2, (self, labels) => fiberRefLocallyWith(self, currentMetricLabels, (old) => union(old, labels)));
var takeUntil = /* @__PURE__ */ dual(2, (elements, predicate) => suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let next4;
  let effect3 = succeed(false);
  let i = 0;
  while ((next4 = iterator.next()) && !next4.done) {
    const a = next4.value;
    const index = i++;
    effect3 = flatMap7(effect3, (bool) => {
      if (bool) {
        return succeed(true);
      }
      builder.push(a);
      return predicate(a, index);
    });
  }
  return map10(effect3, () => builder);
}));
var takeWhile = /* @__PURE__ */ dual(2, (elements, predicate) => suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const builder = [];
  let next4;
  let taking = succeed(true);
  let i = 0;
  while ((next4 = iterator.next()) && !next4.done) {
    const a = next4.value;
    const index = i++;
    taking = flatMap7(taking, (taking2) => pipe(taking2 ? predicate(a, index) : succeed(false), map10((bool) => {
      if (bool) {
        builder.push(a);
      }
      return bool;
    })));
  }
  return map10(taking, () => builder);
}));
var tapBoth = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => matchCauseEffect(self, {
  onFailure: (cause3) => {
    const either7 = failureOrCause(cause3);
    switch (either7._tag) {
      case "Left": {
        return zipRight2(onFailure(either7.left), failCause(cause3));
      }
      case "Right": {
        return failCause(cause3);
      }
    }
  },
  onSuccess: (a) => as3(onSuccess(a), a)
}));
var tapDefect = /* @__PURE__ */ dual(2, (self, f) => catchAllCause(self, (cause3) => match2(keepDefects(cause3), {
  onNone: () => failCause(cause3),
  onSome: (a) => zipRight2(f(a), failCause(cause3))
})));
var tapError = /* @__PURE__ */ dual(2, (self, f) => matchCauseEffect(self, {
  onFailure: (cause3) => {
    const either7 = failureOrCause(cause3);
    switch (either7._tag) {
      case "Left":
        return zipRight2(f(either7.left), failCause(cause3));
      case "Right":
        return failCause(cause3);
    }
  },
  onSuccess: succeed
}));
var tapErrorTag = /* @__PURE__ */ dual(3, (self, k, f) => tapError(self, (e) => {
  if (isTagged(e, k)) {
    return f(e);
  }
  return void_2;
}));
var tapErrorCause = /* @__PURE__ */ dual(2, (self, f) => matchCauseEffect(self, {
  onFailure: (cause3) => zipRight2(f(cause3), failCause(cause3)),
  onSuccess: succeed
}));
var timed = (self) => timedWith(self, currentTimeNanos2);
var timedWith = /* @__PURE__ */ dual(2, (self, nanos2) => summarized(self, nanos2, (start3, end4) => nanos(end4 - start3)));
var tracerWith3 = tracerWith2;
var tracer = /* @__PURE__ */ tracerWith3(succeed);
var tryPromise = (arg) => {
  let evaluate2;
  let catcher = void 0;
  if (typeof arg === "function") {
    evaluate2 = arg;
  } else {
    evaluate2 = arg.try;
    catcher = arg.catch;
  }
  const fail18 = (e) => catcher ? failSync(() => catcher(e)) : fail2(new UnknownException(e, "An unknown error occurred in Effect.tryPromise"));
  if (evaluate2.length >= 1) {
    return async_((resolve3, signal) => {
      try {
        evaluate2(signal).then((a) => resolve3(succeed(a)), (e) => resolve3(fail18(e)));
      } catch (e) {
        resolve3(fail18(e));
      }
    });
  }
  return async_((resolve3) => {
    try {
      evaluate2().then((a) => resolve3(succeed(a)), (e) => resolve3(fail18(e)));
    } catch (e) {
      resolve3(fail18(e));
    }
  });
};
var tryMap = /* @__PURE__ */ dual(2, (self, options) => flatMap7(self, (a) => try_({
  try: () => options.try(a),
  catch: options.catch
})));
var tryMapPromise = /* @__PURE__ */ dual(2, (self, options) => flatMap7(self, (a) => tryPromise({
  try: options.try.length >= 1 ? (signal) => options.try(a, signal) : () => options.try(a),
  catch: options.catch
})));
var unless = /* @__PURE__ */ dual(2, (self, condition) => suspend(() => condition() ? succeedNone : asSome(self)));
var unlessEffect = /* @__PURE__ */ dual(2, (self, condition) => flatMap7(condition, (b) => b ? succeedNone : asSome(self)));
var unsandbox = (self) => mapErrorCause2(self, flatten5);
var updateFiberRefs = (f) => withFiberRuntime((state) => {
  state.setFiberRefs(f(state.id(), state.getFiberRefs()));
  return void_2;
});
var updateService = /* @__PURE__ */ dual(3, (self, tag2, f) => mapInputContext(self, (context7) => add2(context7, tag2, f(unsafeGet3(context7, tag2)))));
var when = /* @__PURE__ */ dual(2, (self, condition) => suspend(() => condition() ? map10(self, some2) : succeed(none2())));
var whenFiberRef = /* @__PURE__ */ dual(3, (self, fiberRef, predicate) => flatMap7(fiberRefGet(fiberRef), (s) => predicate(s) ? map10(self, (a) => [s, some2(a)]) : succeed([s, none2()])));
var whenRef = /* @__PURE__ */ dual(3, (self, ref, predicate) => flatMap7(get12(ref), (s) => predicate(s) ? map10(self, (a) => [s, some2(a)]) : succeed([s, none2()])));
var withMetric = /* @__PURE__ */ dual(2, (self, metric) => metric(self));
var serviceFunctionEffect = (getService, f) => (...args2) => flatMap7(getService, (a) => f(a)(...args2));
var serviceFunction = (getService, f) => (...args2) => map10(getService, (a) => f(a)(...args2));
var serviceFunctions = (getService) => new Proxy({}, {
  get(_target, prop, _receiver) {
    return (...args2) => flatMap7(getService, (s) => s[prop](...args2));
  }
});
var serviceConstants = (getService) => new Proxy({}, {
  get(_target, prop, _receiver) {
    return flatMap7(getService, (s) => isEffect(s[prop]) ? s[prop] : succeed(s[prop]));
  }
});
var serviceMembers = (getService) => ({
  functions: serviceFunctions(getService),
  constants: serviceConstants(getService)
});
var serviceOption = (tag2) => map10(context(), getOption2(tag2));
var serviceOptional = (tag2) => flatMap7(context(), getOption2(tag2));
var annotateCurrentSpan = function() {
  const args2 = arguments;
  return ignore(flatMap7(currentSpan, (span4) => sync(() => {
    if (typeof args2[0] === "string") {
      span4.attribute(args2[0], args2[1]);
    } else {
      for (const key in args2[0]) {
        span4.attribute(key, args2[0][key]);
      }
    }
  })));
};
var linkSpanCurrent = function() {
  const args2 = arguments;
  const links = Array.isArray(args2[0]) ? args2[0] : [{
    _tag: "SpanLink",
    span: args2[0],
    attributes: args2[1] ?? {}
  }];
  return ignore(flatMap7(currentSpan, (span4) => sync(() => span4.addLinks(links))));
};
var annotateSpans = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), function() {
  const args2 = arguments;
  return fiberRefLocallyWith(args2[0], currentTracerSpanAnnotations, typeof args2[1] === "string" ? set3(args2[1], args2[2]) : (annotations2) => Object.entries(args2[1]).reduce((acc, [key, value]) => set3(acc, key, value), annotations2));
});
var currentParentSpan = /* @__PURE__ */ serviceOptional(spanTag);
var currentSpan = /* @__PURE__ */ flatMap7(/* @__PURE__ */ context(), (context7) => {
  const span4 = context7.unsafeMap.get(spanTag.key);
  return span4 !== void 0 && span4._tag === "Span" ? succeed(span4) : fail2(new NoSuchElementException());
});
var linkSpans = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, span4, attributes) => fiberRefLocallyWith(self, currentTracerSpanLinks, append2({
  _tag: "SpanLink",
  span: span4,
  attributes: attributes ?? {}
})));
var bigint02 = /* @__PURE__ */ BigInt(0);
var filterDisablePropagation = /* @__PURE__ */ flatMap((span4) => get3(span4.context, DisablePropagation) ? span4._tag === "Span" ? filterDisablePropagation(span4.parent) : none2() : some2(span4));
var unsafeMakeSpan = (fiber, name, options) => {
  const disablePropagation = !fiber.getFiberRef(currentTracerEnabled) || options.context && get3(options.context, DisablePropagation);
  const context7 = fiber.getFiberRef(currentContext);
  const parent = options.parent ? some2(options.parent) : options.root ? none2() : filterDisablePropagation(getOption2(context7, spanTag));
  let span4;
  if (disablePropagation) {
    span4 = noopSpan({
      name,
      parent,
      context: add2(options.context ?? empty3(), DisablePropagation, true)
    });
  } else {
    const services = fiber.getFiberRef(currentServices);
    const tracer3 = get3(services, tracerTag);
    const clock3 = get3(services, Clock);
    const timingEnabled = fiber.getFiberRef(currentTracerTimingEnabled);
    const fiberRefs3 = fiber.getFiberRefs();
    const annotationsFromEnv = get10(fiberRefs3, currentTracerSpanAnnotations);
    const linksFromEnv = get10(fiberRefs3, currentTracerSpanLinks);
    const links = linksFromEnv._tag === "Some" ? options.links !== void 0 ? [...toReadonlyArray(linksFromEnv.value), ...options.links ?? []] : toReadonlyArray(linksFromEnv.value) : options.links ?? empty();
    span4 = tracer3.span(name, parent, options.context ?? empty3(), links, timingEnabled ? clock3.unsafeCurrentTimeNanos() : bigint02, options.kind ?? "internal", options);
    if (annotationsFromEnv._tag === "Some") {
      forEach3(annotationsFromEnv.value, (value, key) => span4.attribute(key, value));
    }
    if (options.attributes !== void 0) {
      Object.entries(options.attributes).forEach(([k, v]) => span4.attribute(k, v));
    }
  }
  if (typeof options.captureStackTrace === "function") {
    spanToTrace.set(span4, options.captureStackTrace);
  }
  return span4;
};
var makeSpan = (name, options) => {
  options = addSpanStackTrace(options);
  return withFiberRuntime((fiber) => succeed(unsafeMakeSpan(fiber, name, options)));
};
var spanAnnotations = /* @__PURE__ */ fiberRefGet(currentTracerSpanAnnotations);
var spanLinks = /* @__PURE__ */ fiberRefGet(currentTracerSpanLinks);
var endSpan = (span4, exit4, clock3, timingEnabled) => sync(() => {
  if (span4.status._tag === "Ended") {
    return;
  }
  if (exitIsFailure(exit4) && spanToTrace.has(span4)) {
    span4.attribute("code.stacktrace", spanToTrace.get(span4)());
  }
  span4.end(timingEnabled ? clock3.unsafeCurrentTimeNanos() : bigint02, exit4);
});
var useSpan = (name, ...args2) => {
  const options = addSpanStackTrace(args2.length === 1 ? void 0 : args2[0]);
  const evaluate2 = args2[args2.length - 1];
  return withFiberRuntime((fiber) => {
    const span4 = unsafeMakeSpan(fiber, name, options);
    const timingEnabled = fiber.getFiberRef(currentTracerTimingEnabled);
    const clock3 = get3(fiber.getFiberRef(currentServices), clockTag);
    return onExit(evaluate2(span4), (exit4) => endSpan(span4, exit4, clock3, timingEnabled));
  });
};
var withParentSpan = /* @__PURE__ */ dual(2, (self, span4) => provideService(self, spanTag, span4));
var withSpan = function() {
  const dataFirst = typeof arguments[0] !== "string";
  const name = dataFirst ? arguments[1] : arguments[0];
  const options = addSpanStackTrace(dataFirst ? arguments[2] : arguments[1]);
  if (dataFirst) {
    const self = arguments[0];
    return useSpan(name, options, (span4) => withParentSpan(self, span4));
  }
  return (self) => useSpan(name, options, (span4) => withParentSpan(self, span4));
};
var functionWithSpan = (options) => function() {
  let captureStackTrace = options.captureStackTrace ?? false;
  if (options.captureStackTrace !== false) {
    const limit = Error.stackTraceLimit;
    Error.stackTraceLimit = 2;
    const error = new Error();
    Error.stackTraceLimit = limit;
    let cache = false;
    captureStackTrace = () => {
      if (cache !== false) {
        return cache;
      }
      if (error.stack) {
        const stack = error.stack.trim().split("\n");
        cache = stack.slice(2).join("\n").trim();
        return cache;
      }
    };
  }
  return suspend(() => {
    const opts = typeof options.options === "function" ? options.options.apply(null, arguments) : options.options;
    return withSpan(suspend(() => internalCall(() => options.body.apply(this, arguments))), opts.name, {
      ...opts,
      captureStackTrace
    });
  });
};
var fromNullable2 = (value) => value == null ? fail2(new NoSuchElementException()) : succeed(value);
var optionFromOptional = (self) => catchAll(map10(self, some2), (error) => isNoSuchElementException(error) ? succeedNone : fail2(error));

// node_modules/effect/dist/esm/internal/executionStrategy.js
var OP_SEQUENTIAL2 = "Sequential";
var OP_PARALLEL2 = "Parallel";
var OP_PARALLEL_N = "ParallelN";
var sequential2 = {
  _tag: OP_SEQUENTIAL2
};
var parallel2 = {
  _tag: OP_PARALLEL2
};
var parallelN = (parallelism) => ({
  _tag: OP_PARALLEL_N,
  parallelism
});
var isSequential = (self) => self._tag === OP_SEQUENTIAL2;
var isParallel = (self) => self._tag === OP_PARALLEL2;

// node_modules/effect/dist/esm/ExecutionStrategy.js
var sequential3 = sequential2;
var parallel3 = parallel2;
var parallelN2 = parallelN;

// node_modules/effect/dist/esm/FiberRefsPatch.js
var diff6 = diff5;
var patch7 = patch6;

// node_modules/effect/dist/esm/internal/fiberStatus.js
var FiberStatusSymbolKey = "effect/FiberStatus";
var FiberStatusTypeId = /* @__PURE__ */ Symbol.for(FiberStatusSymbolKey);
var OP_DONE = "Done";
var OP_RUNNING = "Running";
var OP_SUSPENDED = "Suspended";
var DoneHash = /* @__PURE__ */ string(`${FiberStatusSymbolKey}-${OP_DONE}`);
var Done = class {
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_DONE;
  [symbol]() {
    return DoneHash;
  }
  [symbol2](that) {
    return isFiberStatus(that) && that._tag === OP_DONE;
  }
};
var Running = class {
  runtimeFlags;
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_RUNNING;
  constructor(runtimeFlags2) {
    this.runtimeFlags = runtimeFlags2;
  }
  [symbol]() {
    return pipe(hash(FiberStatusSymbolKey), combine(hash(this._tag)), combine(hash(this.runtimeFlags)), cached(this));
  }
  [symbol2](that) {
    return isFiberStatus(that) && that._tag === OP_RUNNING && this.runtimeFlags === that.runtimeFlags;
  }
};
var Suspended = class {
  runtimeFlags;
  blockingOn;
  [FiberStatusTypeId] = FiberStatusTypeId;
  _tag = OP_SUSPENDED;
  constructor(runtimeFlags2, blockingOn) {
    this.runtimeFlags = runtimeFlags2;
    this.blockingOn = blockingOn;
  }
  [symbol]() {
    return pipe(hash(FiberStatusSymbolKey), combine(hash(this._tag)), combine(hash(this.runtimeFlags)), combine(hash(this.blockingOn)), cached(this));
  }
  [symbol2](that) {
    return isFiberStatus(that) && that._tag === OP_SUSPENDED && this.runtimeFlags === that.runtimeFlags && equals(this.blockingOn, that.blockingOn);
  }
};
var done3 = /* @__PURE__ */ new Done();
var running = (runtimeFlags2) => new Running(runtimeFlags2);
var suspended = (runtimeFlags2, blockingOn) => new Suspended(runtimeFlags2, blockingOn);
var isFiberStatus = (u) => hasProperty(u, FiberStatusTypeId);
var isDone2 = (self) => self._tag === OP_DONE;
var isRunning = (self) => self._tag === OP_RUNNING;
var isSuspended = (self) => self._tag === OP_SUSPENDED;

// node_modules/effect/dist/esm/FiberStatus.js
var done4 = done3;
var running2 = running;
var suspended2 = suspended;
var isDone3 = isDone2;
var isRunning2 = isRunning;
var isSuspended2 = isSuspended;

// node_modules/effect/dist/esm/Micro.js
var TypeId14 = /* @__PURE__ */ Symbol.for("effect/Micro");
var MicroExitTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroExit");
var MicroCauseTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroCause");
var microCauseVariance = {
  _E: identity
};
var MicroCauseImpl = class extends globalThis.Error {
  _tag;
  traces;
  [MicroCauseTypeId];
  constructor(_tag, originalError2, traces) {
    const causeName = `MicroCause.${_tag}`;
    let name;
    let message;
    let stack;
    if (originalError2 instanceof globalThis.Error) {
      name = `(${causeName}) ${originalError2.name}`;
      message = originalError2.message;
      const messageLines = message.split("\n").length;
      stack = originalError2.stack ? `(${causeName}) ${originalError2.stack.split("\n").slice(0, messageLines + 3).join("\n")}` : `${name}: ${message}`;
    } else {
      name = causeName;
      message = toStringUnknown(originalError2, 0);
      stack = `${name}: ${message}`;
    }
    if (traces.length > 0) {
      stack += `
    ${traces.join("\n    ")}`;
    }
    super(message);
    this._tag = _tag;
    this.traces = traces;
    this[MicroCauseTypeId] = microCauseVariance;
    this.name = name;
    this.stack = stack;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toString() {
    return this.stack;
  }
  [NodeInspectSymbol]() {
    return this.stack;
  }
};
var Die = class extends MicroCauseImpl {
  defect;
  constructor(defect, traces = []) {
    super("Die", defect, traces);
    this.defect = defect;
  }
};
var causeDie = (defect, traces = []) => new Die(defect, traces);
var Interrupt = class extends MicroCauseImpl {
  constructor(traces = []) {
    super("Interrupt", "interrupted", traces);
  }
};
var causeInterrupt = (traces = []) => new Interrupt(traces);
var causeIsInterrupt = (self) => self._tag === "Interrupt";
var MicroFiberTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroFiber");
var fiberVariance = {
  _A: identity,
  _E: identity
};
var MicroFiberImpl = class {
  context;
  interruptible;
  [MicroFiberTypeId];
  _stack = [];
  _observers = [];
  _exit;
  _children;
  currentOpCount = 0;
  constructor(context7, interruptible5 = true) {
    this.context = context7;
    this.interruptible = interruptible5;
    this[MicroFiberTypeId] = fiberVariance;
  }
  getRef(ref) {
    return unsafeGetReference(this.context, ref);
  }
  addObserver(cb) {
    if (this._exit) {
      cb(this._exit);
      return constVoid;
    }
    this._observers.push(cb);
    return () => {
      const index = this._observers.indexOf(cb);
      if (index >= 0) {
        this._observers.splice(index, 1);
      }
    };
  }
  _interrupted = false;
  unsafeInterrupt() {
    if (this._exit) {
      return;
    }
    this._interrupted = true;
    if (this.interruptible) {
      this.evaluate(exitInterrupt2);
    }
  }
  unsafePoll() {
    return this._exit;
  }
  evaluate(effect3) {
    if (this._exit) {
      return;
    } else if (this._yielded !== void 0) {
      const yielded = this._yielded;
      this._yielded = void 0;
      yielded();
    }
    const exit4 = this.runLoop(effect3);
    if (exit4 === Yield) {
      return;
    }
    const interruptChildren = fiberMiddleware.interruptChildren && fiberMiddleware.interruptChildren(this);
    if (interruptChildren !== void 0) {
      return this.evaluate(flatMap9(interruptChildren, () => exit4));
    }
    this._exit = exit4;
    for (let i = 0; i < this._observers.length; i++) {
      this._observers[i](exit4);
    }
    this._observers.length = 0;
  }
  runLoop(effect3) {
    let yielding = false;
    let current = effect3;
    this.currentOpCount = 0;
    try {
      while (true) {
        this.currentOpCount++;
        if (!yielding && this.getRef(CurrentScheduler).shouldYield(this)) {
          yielding = true;
          const prev = current;
          current = flatMap9(yieldNow2, () => prev);
        }
        current = current[evaluate](this);
        if (current === Yield) {
          const yielded = this._yielded;
          if (MicroExitTypeId in yielded) {
            this._yielded = void 0;
            return yielded;
          }
          return Yield;
        }
      }
    } catch (error) {
      if (!hasProperty(current, evaluate)) {
        return exitDie2(`MicroFiber.runLoop: Not a valid effect: ${String(current)}`);
      }
      return exitDie2(error);
    }
  }
  getCont(symbol3) {
    while (true) {
      const op = this._stack.pop();
      if (!op) return void 0;
      const cont = op[ensureCont] && op[ensureCont](this);
      if (cont) return {
        [symbol3]: cont
      };
      if (op[symbol3]) return op;
    }
  }
  // cancel the yielded operation, or for the yielded exit value
  _yielded = void 0;
  yieldWith(value) {
    this._yielded = value;
    return Yield;
  }
  children() {
    return this._children ??= /* @__PURE__ */ new Set();
  }
};
var fiberMiddleware = /* @__PURE__ */ globalValue("effect/Micro/fiberMiddleware", () => ({
  interruptChildren: void 0
}));
var identifier = /* @__PURE__ */ Symbol.for("effect/Micro/identifier");
var args = /* @__PURE__ */ Symbol.for("effect/Micro/args");
var evaluate = /* @__PURE__ */ Symbol.for("effect/Micro/evaluate");
var successCont = /* @__PURE__ */ Symbol.for("effect/Micro/successCont");
var failureCont = /* @__PURE__ */ Symbol.for("effect/Micro/failureCont");
var ensureCont = /* @__PURE__ */ Symbol.for("effect/Micro/ensureCont");
var Yield = /* @__PURE__ */ Symbol.for("effect/Micro/Yield");
var microVariance = {
  _A: identity,
  _E: identity,
  _R: identity
};
var MicroProto = {
  ...EffectPrototype2,
  _op: "Micro",
  [TypeId14]: microVariance,
  pipe() {
    return pipeArguments(this, arguments);
  },
  [Symbol.iterator]() {
    return new SingleShotGen(new YieldWrap(this));
  },
  toJSON() {
    return {
      _id: "Micro",
      op: this[identifier],
      ...args in this ? {
        args: this[args]
      } : void 0
    };
  },
  toString() {
    return format(this);
  },
  [NodeInspectSymbol]() {
    return format(this);
  }
};
function defaultEvaluate(_fiber) {
  return exitDie2(`Micro.evaluate: Not implemented`);
}
var makePrimitiveProto = (options) => ({
  ...MicroProto,
  [identifier]: options.op,
  [evaluate]: options.eval ?? defaultEvaluate,
  [successCont]: options.contA,
  [failureCont]: options.contE,
  [ensureCont]: options.ensure
});
var makePrimitive = (options) => {
  const Proto3 = makePrimitiveProto(options);
  return function() {
    const self = Object.create(Proto3);
    self[args] = options.single === false ? arguments : arguments[0];
    return self;
  };
};
var makeExit = (options) => {
  const Proto3 = {
    ...makePrimitiveProto(options),
    [MicroExitTypeId]: MicroExitTypeId,
    _tag: options.op,
    get [options.prop]() {
      return this[args];
    },
    toJSON() {
      return {
        _id: "MicroExit",
        _tag: options.op,
        [options.prop]: this[args]
      };
    },
    [symbol2](that) {
      return isMicroExit(that) && that._tag === options.op && equals(this[args], that[args]);
    },
    [symbol]() {
      return cached(this, combine(string(options.op))(hash(this[args])));
    }
  };
  return function(value) {
    const self = Object.create(Proto3);
    self[args] = value;
    self[successCont] = void 0;
    self[failureCont] = void 0;
    self[ensureCont] = void 0;
    return self;
  };
};
var succeed4 = /* @__PURE__ */ makeExit({
  op: "Success",
  prop: "value",
  eval(fiber) {
    const cont = fiber.getCont(successCont);
    return cont ? cont[successCont](this[args], fiber) : fiber.yieldWith(this);
  }
});
var failCause4 = /* @__PURE__ */ makeExit({
  op: "Failure",
  prop: "cause",
  eval(fiber) {
    let cont = fiber.getCont(failureCont);
    while (causeIsInterrupt(this[args]) && cont && fiber.interruptible) {
      cont = fiber.getCont(failureCont);
    }
    return cont ? cont[failureCont](this[args], fiber) : fiber.yieldWith(this);
  }
});
var yieldNowWith = /* @__PURE__ */ makePrimitive({
  op: "Yield",
  eval(fiber) {
    let resumed = false;
    fiber.getRef(CurrentScheduler).scheduleTask(() => {
      if (resumed) return;
      fiber.evaluate(exitVoid2);
    }, this[args] ?? 0);
    return fiber.yieldWith(() => {
      resumed = true;
    });
  }
});
var yieldNow2 = /* @__PURE__ */ yieldNowWith(0);
var void_4 = /* @__PURE__ */ succeed4(void 0);
var withMicroFiber = /* @__PURE__ */ makePrimitive({
  op: "WithMicroFiber",
  eval(fiber) {
    return this[args](fiber);
  }
});
var flatMap9 = /* @__PURE__ */ dual(2, (self, f) => {
  const onSuccess = Object.create(OnSuccessProto);
  onSuccess[args] = self;
  onSuccess[successCont] = f;
  return onSuccess;
});
var OnSuccessProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnSuccess",
  eval(fiber) {
    fiber._stack.push(this);
    return this[args];
  }
});
var isMicroExit = (u) => hasProperty(u, MicroExitTypeId);
var exitSucceed2 = succeed4;
var exitFailCause2 = failCause4;
var exitInterrupt2 = /* @__PURE__ */ exitFailCause2(/* @__PURE__ */ causeInterrupt());
var exitDie2 = (defect) => exitFailCause2(causeDie(defect));
var exitVoid2 = /* @__PURE__ */ exitSucceed2(void 0);
var setImmediate = "setImmediate" in globalThis ? globalThis.setImmediate : (f) => setTimeout(f, 0);
var MicroSchedulerDefault = class {
  tasks = [];
  running = false;
  /**
   * @since 3.5.9
   */
  scheduleTask(task, _priority) {
    this.tasks.push(task);
    if (!this.running) {
      this.running = true;
      setImmediate(this.afterScheduled);
    }
  }
  /**
   * @since 3.5.9
   */
  afterScheduled = () => {
    this.running = false;
    this.runTasks();
  };
  /**
   * @since 3.5.9
   */
  runTasks() {
    const tasks = this.tasks;
    this.tasks = [];
    for (let i = 0, len = tasks.length; i < len; i++) {
      tasks[i]();
    }
  }
  /**
   * @since 3.5.9
   */
  shouldYield(fiber) {
    return fiber.currentOpCount >= fiber.getRef(MaxOpsBeforeYield);
  }
  /**
   * @since 3.5.9
   */
  flush() {
    while (this.tasks.length > 0) {
      this.runTasks();
    }
  }
};
var updateContext = /* @__PURE__ */ dual(2, (self, f) => withMicroFiber((fiber) => {
  const prev = fiber.context;
  fiber.context = f(prev);
  return onExit2(self, () => {
    fiber.context = prev;
    return void_4;
  });
}));
var provideContext2 = /* @__PURE__ */ dual(2, (self, provided) => updateContext(self, merge3(provided)));
var MaxOpsBeforeYield = class extends (/* @__PURE__ */ Reference2()("effect/Micro/currentMaxOpsBeforeYield", {
  defaultValue: () => 2048
})) {
};
var CurrentScheduler = class extends (/* @__PURE__ */ Reference2()("effect/Micro/currentScheduler", {
  defaultValue: () => new MicroSchedulerDefault()
})) {
};
var matchCauseEffect2 = /* @__PURE__ */ dual(2, (self, options) => {
  const primitive = Object.create(OnSuccessAndFailureProto);
  primitive[args] = self;
  primitive[successCont] = options.onSuccess;
  primitive[failureCont] = options.onFailure;
  return primitive;
});
var OnSuccessAndFailureProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnSuccessAndFailure",
  eval(fiber) {
    fiber._stack.push(this);
    return this[args];
  }
});
var onExit2 = /* @__PURE__ */ dual(2, (self, f) => uninterruptibleMask2((restore) => matchCauseEffect2(restore(self), {
  onFailure: (cause3) => flatMap9(f(exitFailCause2(cause3)), () => failCause4(cause3)),
  onSuccess: (a) => flatMap9(f(exitSucceed2(a)), () => succeed4(a))
})));
var setInterruptible = /* @__PURE__ */ makePrimitive({
  op: "SetInterruptible",
  ensure(fiber) {
    fiber.interruptible = this[args];
    if (fiber._interrupted && fiber.interruptible) {
      return () => exitInterrupt2;
    }
  }
});
var interruptible3 = (self) => withMicroFiber((fiber) => {
  if (fiber.interruptible) return self;
  fiber.interruptible = true;
  fiber._stack.push(setInterruptible(false));
  if (fiber._interrupted) return exitInterrupt2;
  return self;
});
var uninterruptibleMask2 = (f) => withMicroFiber((fiber) => {
  if (!fiber.interruptible) return f(identity);
  fiber.interruptible = false;
  fiber._stack.push(setInterruptible(true));
  return f(interruptible3);
});
var runFork = (effect3, options) => {
  const fiber = new MicroFiberImpl(CurrentScheduler.context(new MicroSchedulerDefault()));
  fiber.evaluate(effect3);
  return fiber;
};

// node_modules/effect/dist/esm/Scheduler.js
var SchedulerRunner = class _SchedulerRunner {
  scheduleDrain;
  running = false;
  tasks = /* @__PURE__ */ new PriorityBuckets();
  constructor(scheduleDrain) {
    this.scheduleDrain = scheduleDrain;
  }
  starveInternal = (depth) => {
    const tasks = this.tasks.buckets;
    this.tasks.buckets = [];
    for (const [_, toRun] of tasks) {
      for (let i = 0; i < toRun.length; i++) {
        toRun[i]();
      }
    }
    if (this.tasks.buckets.length === 0) {
      this.running = false;
    } else {
      this.starve(depth);
    }
  };
  starve(depth = 0) {
    this.scheduleDrain(depth, this.starveInternal);
  }
  scheduleTask(task, priority) {
    this.tasks.scheduleTask(task, priority);
    if (!this.running) {
      this.running = true;
      this.starve();
    }
  }
  /**
   * @since 3.20.0
   * @category constructors
   */
  static cached(scheduleDrain) {
    const fallback = new _SchedulerRunner(scheduleDrain);
    const runners = /* @__PURE__ */ new WeakMap();
    return (fiber) => {
      if (fiber === void 0) {
        return fallback;
      }
      let runner = runners.get(fiber);
      if (runner === void 0) {
        runner = new _SchedulerRunner(scheduleDrain);
        runners.set(fiber, runner);
      }
      return runner;
    };
  }
};
var PriorityBuckets = class {
  /**
   * @since 2.0.0
   */
  buckets = [];
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    const length3 = this.buckets.length;
    let bucket = void 0;
    let index = 0;
    for (; index < length3; index++) {
      if (this.buckets[index][0] <= priority) {
        bucket = this.buckets[index];
      } else {
        break;
      }
    }
    if (bucket && bucket[0] === priority) {
      bucket[1].push(task);
    } else if (index === length3) {
      this.buckets.push([priority, [task]]);
    } else {
      this.buckets.splice(index, 0, [priority, [task]]);
    }
  }
};
var MixedScheduler = class {
  maxNextTickBeforeTimer;
  getRunner = /* @__PURE__ */ SchedulerRunner.cached((depth, drain4) => {
    if (depth >= this.maxNextTickBeforeTimer) {
      setTimeout(() => drain4(0), 0);
    } else {
      Promise.resolve(void 0).then(() => drain4(depth + 1));
    }
  });
  constructor(maxNextTickBeforeTimer) {
    this.maxNextTickBeforeTimer = maxNextTickBeforeTimer;
  }
  /**
   * @since 2.0.0
   */
  shouldYield(fiber) {
    return fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) ? fiber.getFiberRef(currentSchedulingPriority) : false;
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority, fiber) {
    this.getRunner(fiber).scheduleTask(task, priority);
  }
};
var defaultScheduler = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Scheduler/defaultScheduler"), () => new MixedScheduler(2048));
var SyncScheduler = class {
  /**
   * @since 2.0.0
   */
  tasks = /* @__PURE__ */ new PriorityBuckets();
  /**
   * @since 2.0.0
   */
  deferred = false;
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority, fiber) {
    if (this.deferred) {
      defaultScheduler.scheduleTask(task, priority, fiber);
    } else {
      this.tasks.scheduleTask(task, priority);
    }
  }
  /**
   * @since 2.0.0
   */
  shouldYield(fiber) {
    return fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) ? fiber.getFiberRef(currentSchedulingPriority) : false;
  }
  /**
   * @since 2.0.0
   */
  flush() {
    while (this.tasks.buckets.length > 0) {
      const tasks = this.tasks.buckets;
      this.tasks.buckets = [];
      for (const [_, toRun] of tasks) {
        for (let i = 0; i < toRun.length; i++) {
          toRun[i]();
        }
      }
    }
    this.deferred = true;
  }
};
var currentScheduler = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentScheduler"), () => fiberRefUnsafeMake(defaultScheduler));
var withScheduler = /* @__PURE__ */ dual(2, (self, scheduler) => fiberRefLocally(self, currentScheduler, scheduler));

// node_modules/effect/dist/esm/internal/completedRequestMap.js
var currentRequestMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestMap"), () => fiberRefUnsafeMake(/* @__PURE__ */ new Map()));

// node_modules/effect/dist/esm/internal/concurrency.js
var match9 = (concurrency, sequential5, unbounded4, bounded4) => {
  switch (concurrency) {
    case void 0:
      return sequential5();
    case "unbounded":
      return unbounded4();
    case "inherit":
      return fiberRefGetWith(currentConcurrency, (concurrency2) => concurrency2 === "unbounded" ? unbounded4() : concurrency2 > 1 ? bounded4(concurrency2) : sequential5());
    default:
      return concurrency > 1 ? bounded4(concurrency) : sequential5();
  }
};
var matchSimple = (concurrency, sequential5, concurrent) => {
  switch (concurrency) {
    case void 0:
      return sequential5();
    case "unbounded":
      return concurrent();
    case "inherit":
      return fiberRefGetWith(currentConcurrency, (concurrency2) => concurrency2 === "unbounded" || concurrency2 > 1 ? concurrent() : sequential5());
    default:
      return concurrency > 1 ? concurrent() : sequential5();
  }
};

// node_modules/effect/dist/esm/internal/fiberMessage.js
var OP_INTERRUPT_SIGNAL = "InterruptSignal";
var OP_STATEFUL = "Stateful";
var OP_RESUME = "Resume";
var OP_YIELD_NOW = "YieldNow";
var interruptSignal = (cause3) => ({
  _tag: OP_INTERRUPT_SIGNAL,
  cause: cause3
});
var stateful = (onFiber) => ({
  _tag: OP_STATEFUL,
  onFiber
});
var resume = (effect3) => ({
  _tag: OP_RESUME,
  effect: effect3
});
var yieldNow3 = () => ({
  _tag: OP_YIELD_NOW
});

// node_modules/effect/dist/esm/internal/fiberScope.js
var FiberScopeSymbolKey = "effect/FiberScope";
var FiberScopeTypeId = /* @__PURE__ */ Symbol.for(FiberScopeSymbolKey);
var Global = class {
  [FiberScopeTypeId] = FiberScopeTypeId;
  fiberId = none4;
  roots = /* @__PURE__ */ new Set();
  add(_runtimeFlags, child) {
    this.roots.add(child);
    child.addObserver(() => {
      this.roots.delete(child);
    });
  }
};
var Local = class {
  fiberId;
  parent;
  [FiberScopeTypeId] = FiberScopeTypeId;
  constructor(fiberId3, parent) {
    this.fiberId = fiberId3;
    this.parent = parent;
  }
  add(_runtimeFlags, child) {
    this.parent.tell(stateful((parentFiber) => {
      parentFiber.addChild(child);
      child.addObserver(() => {
        parentFiber.removeChild(child);
      });
    }));
  }
};
var unsafeMake8 = (fiber) => {
  return new Local(fiber.id(), fiber);
};
var globalScope = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberScope/Global"), () => new Global());

// node_modules/effect/dist/esm/internal/fiber.js
var FiberSymbolKey = "effect/Fiber";
var FiberTypeId = /* @__PURE__ */ Symbol.for(FiberSymbolKey);
var fiberVariance2 = {
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _
};
var fiberProto = {
  [FiberTypeId]: fiberVariance2,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var RuntimeFiberSymbolKey = "effect/Fiber";
var RuntimeFiberTypeId = /* @__PURE__ */ Symbol.for(RuntimeFiberSymbolKey);
var Order4 = /* @__PURE__ */ pipe(/* @__PURE__ */ tuple(Order, Order), /* @__PURE__ */ mapInput2((fiber) => [fiber.id().startTimeMillis, fiber.id().id]));
var isFiber = (u) => hasProperty(u, FiberTypeId);
var isRuntimeFiber = (self) => RuntimeFiberTypeId in self;
var _await2 = (self) => self.await;
var children = (self) => self.children;
var done5 = (exit4) => {
  const _fiber = {
    ...CommitPrototype,
    commit() {
      return join2(this);
    },
    ...fiberProto,
    id: () => none4,
    await: succeed(exit4),
    children: succeed([]),
    inheritAll: void_2,
    poll: succeed(some2(exit4)),
    interruptAsFork: () => void_2
  };
  return _fiber;
};
var dump = (self) => map10(self.status, (status3) => ({
  id: self.id(),
  status: status3
}));
var dumpAll = (fibers) => forEachSequential(fibers, dump);
var fail5 = (error) => done5(fail4(error));
var failCause5 = (cause3) => done5(failCause3(cause3));
var fromEffect = (effect3) => map10(exit(effect3), done5);
var id = (self) => self.id();
var inheritAll = (self) => self.inheritAll;
var interrupted = (fiberId3) => done5(interrupt4(fiberId3));
var interruptAll = (fibers) => flatMap7(fiberId, (fiberId3) => pipe(fibers, interruptAllAs(fiberId3)));
var interruptAllAs = /* @__PURE__ */ dual(2, /* @__PURE__ */ fnUntraced(function* (fibers, fiberId3) {
  for (const fiber of fibers) {
    if (isRuntimeFiber(fiber)) {
      fiber.unsafeInterruptAsFork(fiberId3);
      continue;
    }
    yield* fiber.interruptAsFork(fiberId3);
  }
  for (const fiber of fibers) {
    if (isRuntimeFiber(fiber) && fiber.unsafePoll()) {
      continue;
    }
    yield* fiber.await;
  }
}));
var interruptAsFork = /* @__PURE__ */ dual(2, (self, fiberId3) => self.interruptAsFork(fiberId3));
var join2 = (self) => zipLeft2(flatten6(self.await), self.inheritAll);
var map13 = /* @__PURE__ */ dual(2, (self, f) => mapEffect(self, (a) => sync(() => f(a))));
var mapEffect = /* @__PURE__ */ dual(2, (self, f) => {
  const _fiber = {
    ...CommitPrototype,
    commit() {
      return join2(this);
    },
    ...fiberProto,
    id: () => self.id(),
    await: flatMap7(self.await, forEachEffect(f)),
    children: self.children,
    inheritAll: self.inheritAll,
    poll: flatMap7(self.poll, (result) => {
      switch (result._tag) {
        case "None":
          return succeed(none2());
        case "Some":
          return pipe(forEachEffect(result.value, f), map10(some2));
      }
    }),
    interruptAsFork: (id3) => self.interruptAsFork(id3)
  };
  return _fiber;
});
var mapFiber = /* @__PURE__ */ dual(2, (self, f) => map10(self.await, match6({
  onFailure: (cause3) => failCause5(cause3),
  onSuccess: (a) => f(a)
})));
var match10 = /* @__PURE__ */ dual(2, (self, {
  onFiber,
  onRuntimeFiber
}) => {
  if (isRuntimeFiber(self)) {
    return onRuntimeFiber(self);
  }
  return onFiber(self);
});
var _never = {
  ...CommitPrototype,
  commit() {
    return join2(this);
  },
  ...fiberProto,
  id: () => none4,
  await: never,
  children: /* @__PURE__ */ succeed([]),
  inheritAll: never,
  poll: /* @__PURE__ */ succeed(/* @__PURE__ */ none2()),
  interruptAsFork: () => never
};
var never2 = _never;
var orElse3 = /* @__PURE__ */ dual(2, (self, that) => ({
  ...CommitPrototype,
  commit() {
    return join2(this);
  },
  ...fiberProto,
  id: () => getOrElse5(self.id(), that.id()),
  await: zipWith3(self.await, that.await, (exit1, exit22) => isSuccess(exit1) ? exit1 : exit22),
  children: self.children,
  inheritAll: zipRight2(that.inheritAll, self.inheritAll),
  poll: zipWith3(self.poll, that.poll, (option1, option22) => {
    switch (option1._tag) {
      case "None": {
        return none2();
      }
      case "Some": {
        return isSuccess(option1.value) ? option1 : option22;
      }
    }
  }),
  interruptAsFork: (id3) => pipe(interruptAsFiber(self, id3), zipRight2(pipe(that, interruptAsFiber(id3))), asVoid2)
}));
var orElseEither2 = /* @__PURE__ */ dual(2, (self, that) => orElse3(map13(self, left2), map13(that, right2)));
var poll3 = (self) => self.poll;
var parseMs = (milliseconds) => {
  const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
  return {
    days: roundTowardsZero(milliseconds / 864e5),
    hours: roundTowardsZero(milliseconds / 36e5) % 24,
    minutes: roundTowardsZero(milliseconds / 6e4) % 60,
    seconds: roundTowardsZero(milliseconds / 1e3) % 60,
    milliseconds: roundTowardsZero(milliseconds) % 1e3,
    microseconds: roundTowardsZero(milliseconds * 1e3) % 1e3,
    nanoseconds: roundTowardsZero(milliseconds * 1e6) % 1e3
  };
};
var renderStatus = (status3) => {
  if (isDone3(status3)) {
    return "Done";
  }
  if (isRunning2(status3)) {
    return "Running";
  }
  const isInterruptible = interruptible(status3.runtimeFlags) ? "interruptible" : "uninterruptible";
  return `Suspended(${isInterruptible})`;
};
var pretty2 = (self) => flatMap7(currentTimeMillis2, (now) => map10(dump(self), (dump3) => {
  const time = now - dump3.id.startTimeMillis;
  const {
    days: days2,
    hours: hours2,
    milliseconds,
    minutes: minutes2,
    seconds: seconds2
  } = parseMs(time);
  const lifeMsg = (days2 === 0 ? "" : `${days2}d`) + (days2 === 0 && hours2 === 0 ? "" : `${hours2}h`) + (days2 === 0 && hours2 === 0 && minutes2 === 0 ? "" : `${minutes2}m`) + (days2 === 0 && hours2 === 0 && minutes2 === 0 && seconds2 === 0 ? "" : `${seconds2}s`) + `${milliseconds}ms`;
  const waitMsg = isSuspended2(dump3.status) ? (() => {
    const ids3 = ids2(dump3.status.blockingOn);
    return size3(ids3) > 0 ? `waiting on ` + Array.from(ids3).map((id3) => `${id3}`).join(", ") : "";
  })() : "";
  const statusMsg = renderStatus(dump3.status);
  return `[Fiber](#${dump3.id.id}) (${lifeMsg}) ${waitMsg}
   Status: ${statusMsg}`;
}));
var unsafeRoots = () => Array.from(globalScope.roots);
var roots = /* @__PURE__ */ sync(unsafeRoots);
var status = (self) => self.status;
var succeed5 = (value) => done5(succeed3(value));
var void_5 = /* @__PURE__ */ succeed5(void 0);
var currentFiberURI = "effect/FiberCurrent";
var getCurrentFiber = () => fromNullable(globalThis[currentFiberURI]);

// node_modules/effect/dist/esm/internal/logger.js
var LoggerSymbolKey = "effect/Logger";
var LoggerTypeId = /* @__PURE__ */ Symbol.for(LoggerSymbolKey);
var loggerVariance = {
  /* c8 ignore next */
  _Message: (_) => _,
  /* c8 ignore next */
  _Output: (_) => _
};
var makeLogger = (log4) => ({
  [LoggerTypeId]: loggerVariance,
  log: log4,
  pipe() {
    return pipeArguments(this, arguments);
  }
});
var textOnly = /^[^\s"=]*$/;
var format3 = (quoteValue, whitespace) => ({
  annotations: annotations2,
  cause: cause3,
  date,
  fiberId: fiberId3,
  logLevel,
  message,
  spans
}) => {
  const formatValue = (value) => value.match(textOnly) ? value : quoteValue(value);
  const format4 = (label, value) => `${formatLabel(label)}=${formatValue(value)}`;
  const append4 = (label, value) => " " + format4(label, value);
  let out = format4("timestamp", date.toISOString());
  out += append4("level", logLevel.label);
  out += append4("fiber", threadName(fiberId3));
  const messages = ensure(message);
  for (let i = 0; i < messages.length; i++) {
    out += append4("message", toStringUnknown(messages[i], whitespace));
  }
  if (!isEmptyType(cause3)) {
    out += append4("cause", pretty(cause3, {
      renderErrorCause: true
    }));
  }
  for (const span4 of spans) {
    out += " " + render(date.getTime())(span4);
  }
  for (const [label, value] of annotations2) {
    out += append4(label, toStringUnknown(value, whitespace));
  }
  return out;
};
var escapeDoubleQuotes = (s) => `"${s.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`;
var stringLogger = /* @__PURE__ */ makeLogger(/* @__PURE__ */ format3(escapeDoubleQuotes));
var hasProcessStdout = typeof process === "object" && process !== null && typeof process.stdout === "object" && process.stdout !== null;
hasProcessStdout && process.stdout.isTTY === true;

// node_modules/effect/dist/esm/internal/metric/boundaries.js
var MetricBoundariesSymbolKey = "effect/MetricBoundaries";
var MetricBoundariesTypeId = /* @__PURE__ */ Symbol.for(MetricBoundariesSymbolKey);
var MetricBoundariesImpl = class {
  values;
  [MetricBoundariesTypeId] = MetricBoundariesTypeId;
  constructor(values3) {
    this.values = values3;
    this._hash = pipe(string(MetricBoundariesSymbolKey), combine(array2(this.values)));
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](u) {
    return isMetricBoundaries(u) && equals(this.values, u.values);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isMetricBoundaries = (u) => hasProperty(u, MetricBoundariesTypeId);
var fromIterable8 = (iterable) => {
  const values3 = pipe(iterable, appendAll(of2(Number.POSITIVE_INFINITY)), dedupe);
  return new MetricBoundariesImpl(values3);
};
var exponential = (options) => pipe(makeBy(options.count - 1, (i) => options.start * Math.pow(options.factor, i)), unsafeFromArray, fromIterable8);

// node_modules/effect/dist/esm/internal/metric/keyType.js
var MetricKeyTypeSymbolKey = "effect/MetricKeyType";
var MetricKeyTypeTypeId = /* @__PURE__ */ Symbol.for(MetricKeyTypeSymbolKey);
var CounterKeyTypeSymbolKey = "effect/MetricKeyType/Counter";
var CounterKeyTypeTypeId = /* @__PURE__ */ Symbol.for(CounterKeyTypeSymbolKey);
var FrequencyKeyTypeSymbolKey = "effect/MetricKeyType/Frequency";
var FrequencyKeyTypeTypeId = /* @__PURE__ */ Symbol.for(FrequencyKeyTypeSymbolKey);
var GaugeKeyTypeSymbolKey = "effect/MetricKeyType/Gauge";
var GaugeKeyTypeTypeId = /* @__PURE__ */ Symbol.for(GaugeKeyTypeSymbolKey);
var HistogramKeyTypeSymbolKey = "effect/MetricKeyType/Histogram";
var HistogramKeyTypeTypeId = /* @__PURE__ */ Symbol.for(HistogramKeyTypeSymbolKey);
var SummaryKeyTypeSymbolKey = "effect/MetricKeyType/Summary";
var SummaryKeyTypeTypeId = /* @__PURE__ */ Symbol.for(SummaryKeyTypeSymbolKey);
var metricKeyTypeVariance = {
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _Out: (_) => _
};
var CounterKeyType = class {
  incremental;
  bigint;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [CounterKeyTypeTypeId] = CounterKeyTypeTypeId;
  constructor(incremental, bigint) {
    this.incremental = incremental;
    this.bigint = bigint;
    this._hash = string(CounterKeyTypeSymbolKey);
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](that) {
    return isCounterKey(that);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var HistogramKeyType = class {
  boundaries;
  [MetricKeyTypeTypeId] = metricKeyTypeVariance;
  [HistogramKeyTypeTypeId] = HistogramKeyTypeTypeId;
  constructor(boundaries) {
    this.boundaries = boundaries;
    this._hash = pipe(string(HistogramKeyTypeSymbolKey), combine(hash(this.boundaries)));
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](that) {
    return isHistogramKey(that) && equals(this.boundaries, that.boundaries);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var counter = (options) => new CounterKeyType(options?.incremental ?? false, options?.bigint ?? false);
var histogram = (boundaries) => {
  return new HistogramKeyType(boundaries);
};
var isCounterKey = (u) => hasProperty(u, CounterKeyTypeTypeId);
var isFrequencyKey = (u) => hasProperty(u, FrequencyKeyTypeTypeId);
var isGaugeKey = (u) => hasProperty(u, GaugeKeyTypeTypeId);
var isHistogramKey = (u) => hasProperty(u, HistogramKeyTypeTypeId);
var isSummaryKey = (u) => hasProperty(u, SummaryKeyTypeTypeId);

// node_modules/effect/dist/esm/internal/metric/key.js
var MetricKeySymbolKey = "effect/MetricKey";
var MetricKeyTypeId = /* @__PURE__ */ Symbol.for(MetricKeySymbolKey);
var metricKeyVariance = {
  /* c8 ignore next */
  _Type: (_) => _
};
var arrayEquivilence = /* @__PURE__ */ getEquivalence2(equals);
var MetricKeyImpl = class {
  name;
  keyType;
  description;
  tags;
  [MetricKeyTypeId] = metricKeyVariance;
  constructor(name, keyType, description, tags = []) {
    this.name = name;
    this.keyType = keyType;
    this.description = description;
    this.tags = tags;
    this._hash = pipe(string(this.name + this.description), combine(hash(this.keyType)), combine(array2(this.tags)));
  }
  _hash;
  [symbol]() {
    return this._hash;
  }
  [symbol2](u) {
    return isMetricKey(u) && this.name === u.name && equals(this.keyType, u.keyType) && equals(this.description, u.description) && arrayEquivilence(this.tags, u.tags);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isMetricKey = (u) => hasProperty(u, MetricKeyTypeId);
var counter2 = (name, options) => new MetricKeyImpl(name, counter(options), fromNullable(options?.description));
var histogram2 = (name, boundaries, description) => new MetricKeyImpl(name, histogram(boundaries), fromNullable(description));
var taggedWithLabels = /* @__PURE__ */ dual(2, (self, extraTags) => extraTags.length === 0 ? self : new MetricKeyImpl(self.name, self.keyType, self.description, union(self.tags, extraTags)));

// node_modules/effect/dist/esm/internal/metric/state.js
var MetricStateSymbolKey = "effect/MetricState";
var MetricStateTypeId = /* @__PURE__ */ Symbol.for(MetricStateSymbolKey);
var CounterStateSymbolKey = "effect/MetricState/Counter";
var CounterStateTypeId = /* @__PURE__ */ Symbol.for(CounterStateSymbolKey);
var FrequencyStateSymbolKey = "effect/MetricState/Frequency";
var FrequencyStateTypeId = /* @__PURE__ */ Symbol.for(FrequencyStateSymbolKey);
var GaugeStateSymbolKey = "effect/MetricState/Gauge";
var GaugeStateTypeId = /* @__PURE__ */ Symbol.for(GaugeStateSymbolKey);
var HistogramStateSymbolKey = "effect/MetricState/Histogram";
var HistogramStateTypeId = /* @__PURE__ */ Symbol.for(HistogramStateSymbolKey);
var SummaryStateSymbolKey = "effect/MetricState/Summary";
var SummaryStateTypeId = /* @__PURE__ */ Symbol.for(SummaryStateSymbolKey);
var metricStateVariance = {
  /* c8 ignore next */
  _A: (_) => _
};
var CounterState = class {
  count;
  [MetricStateTypeId] = metricStateVariance;
  [CounterStateTypeId] = CounterStateTypeId;
  constructor(count4) {
    this.count = count4;
  }
  [symbol]() {
    return pipe(hash(CounterStateSymbolKey), combine(hash(this.count)), cached(this));
  }
  [symbol2](that) {
    return isCounterState(that) && this.count === that.count;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var arrayEquals = /* @__PURE__ */ getEquivalence2(equals);
var FrequencyState = class {
  occurrences;
  [MetricStateTypeId] = metricStateVariance;
  [FrequencyStateTypeId] = FrequencyStateTypeId;
  constructor(occurrences) {
    this.occurrences = occurrences;
  }
  _hash;
  [symbol]() {
    return pipe(string(FrequencyStateSymbolKey), combine(array2(fromIterable2(this.occurrences.entries()))), cached(this));
  }
  [symbol2](that) {
    return isFrequencyState(that) && arrayEquals(fromIterable2(this.occurrences.entries()), fromIterable2(that.occurrences.entries()));
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var GaugeState = class {
  value;
  [MetricStateTypeId] = metricStateVariance;
  [GaugeStateTypeId] = GaugeStateTypeId;
  constructor(value) {
    this.value = value;
  }
  [symbol]() {
    return pipe(hash(GaugeStateSymbolKey), combine(hash(this.value)), cached(this));
  }
  [symbol2](u) {
    return isGaugeState(u) && this.value === u.value;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var HistogramState = class {
  buckets;
  count;
  min;
  max;
  sum;
  [MetricStateTypeId] = metricStateVariance;
  [HistogramStateTypeId] = HistogramStateTypeId;
  constructor(buckets, count4, min4, max6, sum3) {
    this.buckets = buckets;
    this.count = count4;
    this.min = min4;
    this.max = max6;
    this.sum = sum3;
  }
  [symbol]() {
    return pipe(hash(HistogramStateSymbolKey), combine(hash(this.buckets)), combine(hash(this.count)), combine(hash(this.min)), combine(hash(this.max)), combine(hash(this.sum)), cached(this));
  }
  [symbol2](that) {
    return isHistogramState(that) && equals(this.buckets, that.buckets) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var SummaryState = class {
  error;
  quantiles;
  count;
  min;
  max;
  sum;
  [MetricStateTypeId] = metricStateVariance;
  [SummaryStateTypeId] = SummaryStateTypeId;
  constructor(error, quantiles, count4, min4, max6, sum3) {
    this.error = error;
    this.quantiles = quantiles;
    this.count = count4;
    this.min = min4;
    this.max = max6;
    this.sum = sum3;
  }
  [symbol]() {
    return pipe(hash(SummaryStateSymbolKey), combine(hash(this.error)), combine(hash(this.quantiles)), combine(hash(this.count)), combine(hash(this.min)), combine(hash(this.max)), combine(hash(this.sum)), cached(this));
  }
  [symbol2](that) {
    return isSummaryState(that) && this.error === that.error && equals(this.quantiles, that.quantiles) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var counter3 = (count4) => new CounterState(count4);
var frequency2 = (occurrences) => {
  return new FrequencyState(occurrences);
};
var gauge2 = (count4) => new GaugeState(count4);
var histogram3 = (options) => new HistogramState(options.buckets, options.count, options.min, options.max, options.sum);
var summary2 = (options) => new SummaryState(options.error, options.quantiles, options.count, options.min, options.max, options.sum);
var isCounterState = (u) => hasProperty(u, CounterStateTypeId);
var isFrequencyState = (u) => hasProperty(u, FrequencyStateTypeId);
var isGaugeState = (u) => hasProperty(u, GaugeStateTypeId);
var isHistogramState = (u) => hasProperty(u, HistogramStateTypeId);
var isSummaryState = (u) => hasProperty(u, SummaryStateTypeId);

// node_modules/effect/dist/esm/internal/metric/hook.js
var MetricHookSymbolKey = "effect/MetricHook";
var MetricHookTypeId = /* @__PURE__ */ Symbol.for(MetricHookSymbolKey);
var metricHookVariance = {
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _Out: (_) => _
};
var make31 = (options) => ({
  [MetricHookTypeId]: metricHookVariance,
  pipe() {
    return pipeArguments(this, arguments);
  },
  ...options
});
var bigint03 = /* @__PURE__ */ BigInt(0);
var counter4 = (key) => {
  let sum3 = key.keyType.bigint ? bigint03 : 0;
  const canUpdate = key.keyType.incremental ? key.keyType.bigint ? (value) => value >= bigint03 : (value) => value >= 0 : (_value) => true;
  const update5 = (value) => {
    if (canUpdate(value)) {
      sum3 = sum3 + value;
    }
  };
  return make31({
    get: () => counter3(sum3),
    update: update5,
    modify: update5
  });
};
var frequency3 = (key) => {
  const values3 = /* @__PURE__ */ new Map();
  for (const word of key.keyType.preregisteredWords) {
    values3.set(word, 0);
  }
  const update5 = (word) => {
    const slotCount = values3.get(word) ?? 0;
    values3.set(word, slotCount + 1);
  };
  return make31({
    get: () => frequency2(values3),
    update: update5,
    modify: update5
  });
};
var gauge3 = (_key, startAt) => {
  let value = startAt;
  return make31({
    get: () => gauge2(value),
    update: (v) => {
      value = v;
    },
    modify: (v) => {
      value = value + v;
    }
  });
};
var histogram4 = (key) => {
  const bounds = key.keyType.boundaries.values;
  const size13 = bounds.length;
  const values3 = new Uint32Array(size13 + 1);
  const boundaries = new Float64Array(size13);
  let count4 = 0;
  let sum3 = 0;
  let min4 = Number.MAX_VALUE;
  let max6 = Number.MIN_VALUE;
  pipe(bounds, sort(Order), map3((n, i) => {
    boundaries[i] = n;
  }));
  const update5 = (value) => {
    let from = 0;
    let to = size13;
    while (from !== to) {
      const mid = Math.floor(from + (to - from) / 2);
      const boundary = boundaries[mid];
      if (value <= boundary) {
        to = mid;
      } else {
        from = mid;
      }
      if (to === from + 1) {
        if (value <= boundaries[from]) {
          to = from;
        } else {
          from = to;
        }
      }
    }
    values3[from] = values3[from] + 1;
    count4 = count4 + 1;
    sum3 = sum3 + value;
    if (value < min4) {
      min4 = value;
    }
    if (value > max6) {
      max6 = value;
    }
  };
  const getBuckets = () => {
    const builder = allocate(size13);
    let cumulated = 0;
    for (let i = 0; i < size13; i++) {
      const boundary = boundaries[i];
      const value = values3[i];
      cumulated = cumulated + value;
      builder[i] = [boundary, cumulated];
    }
    return builder;
  };
  return make31({
    get: () => histogram3({
      buckets: getBuckets(),
      count: count4,
      min: min4,
      max: max6,
      sum: sum3
    }),
    update: update5,
    modify: update5
  });
};
var summary3 = (key) => {
  const {
    error,
    maxAge,
    maxSize,
    quantiles
  } = key.keyType;
  const sortedQuantiles = pipe(quantiles, sort(Order));
  const values3 = allocate(maxSize);
  let head6 = 0;
  let count4 = 0;
  let sum3 = 0;
  let min4 = 0;
  let max6 = 0;
  const snapshot = (now) => {
    const builder = [];
    let i = 0;
    while (i !== maxSize - 1) {
      const item = values3[i];
      if (item != null) {
        const [t, v] = item;
        const age = millis(now - t);
        if (greaterThanOrEqualTo2(age, zero) && lessThanOrEqualTo2(age, maxAge)) {
          builder.push(v);
        }
      }
      i = i + 1;
    }
    return calculateQuantiles(error, sortedQuantiles, sort(builder, Order));
  };
  const observe = (value, timestamp) => {
    if (maxSize > 0) {
      head6 = head6 + 1;
      const target = head6 % maxSize;
      values3[target] = [timestamp, value];
    }
    min4 = count4 === 0 ? value : Math.min(min4, value);
    max6 = count4 === 0 ? value : Math.max(max6, value);
    count4 = count4 + 1;
    sum3 = sum3 + value;
  };
  return make31({
    get: () => summary2({
      error,
      quantiles: snapshot(Date.now()),
      count: count4,
      min: min4,
      max: max6,
      sum: sum3
    }),
    update: ([value, timestamp]) => observe(value, timestamp),
    modify: ([value, timestamp]) => observe(value, timestamp)
  });
};
var calculateQuantiles = (error, sortedQuantiles, sortedSamples) => {
  const sampleCount = sortedSamples.length;
  if (!isNonEmptyReadonlyArray(sortedQuantiles)) {
    return empty();
  }
  const head6 = sortedQuantiles[0];
  const tail = sortedQuantiles.slice(1);
  const resolvedHead = resolveQuantile(error, sampleCount, none2(), 0, head6, sortedSamples);
  const resolved = of(resolvedHead);
  tail.forEach((quantile) => {
    resolved.push(resolveQuantile(error, sampleCount, resolvedHead.value, resolvedHead.consumed, quantile, resolvedHead.rest));
  });
  return map3(resolved, (rq) => [rq.quantile, rq.value]);
};
var resolveQuantile = (error, sampleCount, current, consumed, quantile, rest) => {
  let error_1 = error;
  let sampleCount_1 = sampleCount;
  let current_1 = current;
  let consumed_1 = consumed;
  let quantile_1 = quantile;
  let rest_1 = rest;
  let error_2 = error;
  let sampleCount_2 = sampleCount;
  let current_2 = current;
  let consumed_2 = consumed;
  let quantile_2 = quantile;
  let rest_2 = rest;
  while (1) {
    if (!isNonEmptyReadonlyArray(rest_1)) {
      return {
        quantile: quantile_1,
        value: none2(),
        consumed: consumed_1,
        rest: []
      };
    }
    if (quantile_1 === 1) {
      return {
        quantile: quantile_1,
        value: some2(lastNonEmpty(rest_1)),
        consumed: consumed_1 + rest_1.length,
        rest: []
      };
    }
    const headValue = headNonEmpty(rest_1);
    const sameHead = span(rest_1, (n) => n === headValue);
    const desired = quantile_1 * sampleCount_1;
    const allowedError = error_1 / 2 * desired;
    const candConsumed = consumed_1 + sameHead[0].length;
    const candError = Math.abs(candConsumed - desired);
    if (candConsumed < desired - allowedError) {
      error_2 = error_1;
      sampleCount_2 = sampleCount_1;
      current_2 = head(rest_1);
      consumed_2 = candConsumed;
      quantile_2 = quantile_1;
      rest_2 = sameHead[1];
      error_1 = error_2;
      sampleCount_1 = sampleCount_2;
      current_1 = current_2;
      consumed_1 = consumed_2;
      quantile_1 = quantile_2;
      rest_1 = rest_2;
      continue;
    }
    if (candConsumed > desired + allowedError) {
      const valueToReturn = isNone2(current_1) ? some2(headValue) : current_1;
      return {
        quantile: quantile_1,
        value: valueToReturn,
        consumed: consumed_1,
        rest: rest_1
      };
    }
    switch (current_1._tag) {
      case "None": {
        error_2 = error_1;
        sampleCount_2 = sampleCount_1;
        current_2 = head(rest_1);
        consumed_2 = candConsumed;
        quantile_2 = quantile_1;
        rest_2 = sameHead[1];
        error_1 = error_2;
        sampleCount_1 = sampleCount_2;
        current_1 = current_2;
        consumed_1 = consumed_2;
        quantile_1 = quantile_2;
        rest_1 = rest_2;
        continue;
      }
      case "Some": {
        const prevError = Math.abs(desired - current_1.value);
        if (candError < prevError) {
          error_2 = error_1;
          sampleCount_2 = sampleCount_1;
          current_2 = head(rest_1);
          consumed_2 = candConsumed;
          quantile_2 = quantile_1;
          rest_2 = sameHead[1];
          error_1 = error_2;
          sampleCount_1 = sampleCount_2;
          current_1 = current_2;
          consumed_1 = consumed_2;
          quantile_1 = quantile_2;
          rest_1 = rest_2;
          continue;
        }
        return {
          quantile: quantile_1,
          value: some2(current_1.value),
          consumed: consumed_1,
          rest: rest_1
        };
      }
    }
  }
  throw new Error("BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/effect/issues");
};

// node_modules/effect/dist/esm/internal/metric/pair.js
var MetricPairSymbolKey = "effect/MetricPair";
var MetricPairTypeId = /* @__PURE__ */ Symbol.for(MetricPairSymbolKey);
var metricPairVariance = {
  /* c8 ignore next */
  _Type: (_) => _
};
var unsafeMake9 = (metricKey, metricState) => {
  return {
    [MetricPairTypeId]: metricPairVariance,
    metricKey,
    metricState,
    pipe() {
      return pipeArguments(this, arguments);
    }
  };
};

// node_modules/effect/dist/esm/internal/metric/registry.js
var MetricRegistrySymbolKey = "effect/MetricRegistry";
var MetricRegistryTypeId = /* @__PURE__ */ Symbol.for(MetricRegistrySymbolKey);
var MetricRegistryImpl = class {
  [MetricRegistryTypeId] = MetricRegistryTypeId;
  map = /* @__PURE__ */ empty17();
  snapshot() {
    const result = [];
    for (const [key, hook] of this.map) {
      result.push(unsafeMake9(key, hook.get()));
    }
    return result;
  }
  get(key) {
    const hook = pipe(this.map, get8(key), getOrUndefined);
    if (hook == null) {
      if (isCounterKey(key.keyType)) {
        return this.getCounter(key);
      }
      if (isGaugeKey(key.keyType)) {
        return this.getGauge(key);
      }
      if (isFrequencyKey(key.keyType)) {
        return this.getFrequency(key);
      }
      if (isHistogramKey(key.keyType)) {
        return this.getHistogram(key);
      }
      if (isSummaryKey(key.keyType)) {
        return this.getSummary(key);
      }
      throw new Error("BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/effect/issues");
    } else {
      return hook;
    }
  }
  getCounter(key) {
    let value = pipe(this.map, get8(key), getOrUndefined);
    if (value == null) {
      const counter6 = counter4(key);
      if (!pipe(this.map, has4(key))) {
        pipe(this.map, set4(key, counter6));
      }
      value = counter6;
    }
    return value;
  }
  getFrequency(key) {
    let value = pipe(this.map, get8(key), getOrUndefined);
    if (value == null) {
      const frequency5 = frequency3(key);
      if (!pipe(this.map, has4(key))) {
        pipe(this.map, set4(key, frequency5));
      }
      value = frequency5;
    }
    return value;
  }
  getGauge(key) {
    let value = pipe(this.map, get8(key), getOrUndefined);
    if (value == null) {
      const gauge5 = gauge3(key, key.keyType.bigint ? BigInt(0) : 0);
      if (!pipe(this.map, has4(key))) {
        pipe(this.map, set4(key, gauge5));
      }
      value = gauge5;
    }
    return value;
  }
  getHistogram(key) {
    let value = pipe(this.map, get8(key), getOrUndefined);
    if (value == null) {
      const histogram6 = histogram4(key);
      if (!pipe(this.map, has4(key))) {
        pipe(this.map, set4(key, histogram6));
      }
      value = histogram6;
    }
    return value;
  }
  getSummary(key) {
    let value = pipe(this.map, get8(key), getOrUndefined);
    if (value == null) {
      const summary5 = summary3(key);
      if (!pipe(this.map, has4(key))) {
        pipe(this.map, set4(key, summary5));
      }
      value = summary5;
    }
    return value;
  }
};
var make32 = () => {
  return new MetricRegistryImpl();
};

// node_modules/effect/dist/esm/internal/metric.js
var MetricSymbolKey = "effect/Metric";
var MetricTypeId = /* @__PURE__ */ Symbol.for(MetricSymbolKey);
var metricVariance = {
  /* c8 ignore next */
  _Type: (_) => _,
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _Out: (_) => _
};
var globalMetricRegistry = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Metric/globalMetricRegistry"), () => make32());
var make33 = function(keyType, unsafeUpdate, unsafeValue, unsafeModify) {
  const metric = Object.assign((effect3) => tap2(effect3, (a) => update4(metric, a)), {
    [MetricTypeId]: metricVariance,
    keyType,
    unsafeUpdate,
    unsafeValue,
    unsafeModify,
    register() {
      this.unsafeValue([]);
      return this;
    },
    pipe() {
      return pipeArguments(this, arguments);
    }
  });
  return metric;
};
var counter5 = (name, options) => fromMetricKey(counter2(name, options));
var fromMetricKey = (key) => {
  let untaggedHook;
  const hookCache = /* @__PURE__ */ new WeakMap();
  const hook = (extraTags) => {
    if (extraTags.length === 0) {
      if (untaggedHook !== void 0) {
        return untaggedHook;
      }
      untaggedHook = globalMetricRegistry.get(key);
      return untaggedHook;
    }
    let hook2 = hookCache.get(extraTags);
    if (hook2 !== void 0) {
      return hook2;
    }
    hook2 = globalMetricRegistry.get(taggedWithLabels(key, extraTags));
    hookCache.set(extraTags, hook2);
    return hook2;
  };
  return make33(key.keyType, (input, extraTags) => hook(extraTags).update(input), (extraTags) => hook(extraTags).get(), (input, extraTags) => hook(extraTags).modify(input));
};
var histogram5 = (name, boundaries, description) => fromMetricKey(histogram2(name, boundaries, description));
var tagged = /* @__PURE__ */ dual(3, (self, key, value) => taggedWithLabels2(self, [make30(key, value)]));
var taggedWithLabels2 = /* @__PURE__ */ dual(2, (self, extraTags) => {
  return make33(self.keyType, (input, extraTags1) => self.unsafeUpdate(input, union(extraTags, extraTags1)), (extraTags1) => self.unsafeValue(union(extraTags, extraTags1)), (input, extraTags1) => self.unsafeModify(input, union(extraTags, extraTags1)));
});
var update4 = /* @__PURE__ */ dual(2, (self, input) => fiberRefGetWith(currentMetricLabels, (tags) => sync(() => self.unsafeUpdate(input, tags))));

// node_modules/effect/dist/esm/internal/request.js
var RequestSymbolKey = "effect/Request";
var RequestTypeId = /* @__PURE__ */ Symbol.for(RequestSymbolKey);
({
  ...StructuralPrototype});
var isRequest = (u) => hasProperty(u, RequestTypeId);
var complete2 = /* @__PURE__ */ dual(2, (self, result) => fiberRefGetWith(currentRequestMap, (map25) => sync(() => {
  if (map25.has(self)) {
    const entry = map25.get(self);
    if (!entry.state.completed) {
      entry.state.completed = true;
      deferredUnsafeDone(entry.result, result);
    }
  }
})));
var Listeners = class {
  count = 0;
  observers = /* @__PURE__ */ new Set();
  interrupted = false;
  addObserver(f) {
    this.observers.add(f);
  }
  removeObserver(f) {
    this.observers.delete(f);
  }
  increment() {
    this.count++;
    this.observers.forEach((f) => f(this.count));
  }
  decrement() {
    this.count--;
    this.observers.forEach((f) => f(this.count));
  }
};

// node_modules/effect/dist/esm/internal/supervisor.js
var SupervisorSymbolKey = "effect/Supervisor";
var SupervisorTypeId = /* @__PURE__ */ Symbol.for(SupervisorSymbolKey);
var supervisorVariance = {
  /* c8 ignore next */
  _T: (_) => _
};
var ProxySupervisor = class _ProxySupervisor {
  underlying;
  value0;
  [SupervisorTypeId] = supervisorVariance;
  constructor(underlying, value0) {
    this.underlying = underlying;
    this.value0 = value0;
  }
  get value() {
    return this.value0;
  }
  onStart(context7, effect3, parent, fiber) {
    this.underlying.onStart(context7, effect3, parent, fiber);
  }
  onEnd(value, fiber) {
    this.underlying.onEnd(value, fiber);
  }
  onEffect(fiber, effect3) {
    this.underlying.onEffect(fiber, effect3);
  }
  onSuspend(fiber) {
    this.underlying.onSuspend(fiber);
  }
  onResume(fiber) {
    this.underlying.onResume(fiber);
  }
  map(f) {
    return new _ProxySupervisor(this, pipe(this.value, map10(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
};
var Zip = class _Zip {
  left;
  right;
  _tag = "Zip";
  [SupervisorTypeId] = supervisorVariance;
  constructor(left3, right3) {
    this.left = left3;
    this.right = right3;
  }
  get value() {
    return zip2(this.left.value, this.right.value);
  }
  onStart(context7, effect3, parent, fiber) {
    this.left.onStart(context7, effect3, parent, fiber);
    this.right.onStart(context7, effect3, parent, fiber);
  }
  onEnd(value, fiber) {
    this.left.onEnd(value, fiber);
    this.right.onEnd(value, fiber);
  }
  onEffect(fiber, effect3) {
    this.left.onEffect(fiber, effect3);
    this.right.onEffect(fiber, effect3);
  }
  onSuspend(fiber) {
    this.left.onSuspend(fiber);
    this.right.onSuspend(fiber);
  }
  onResume(fiber) {
    this.left.onResume(fiber);
    this.right.onResume(fiber);
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map10(f)));
  }
  zip(right3) {
    return new _Zip(this, right3);
  }
};
var isZip = (self) => hasProperty(self, SupervisorTypeId) && isTagged(self, "Zip");
var Track = class {
  [SupervisorTypeId] = supervisorVariance;
  fibers = /* @__PURE__ */ new Set();
  get value() {
    return sync(() => Array.from(this.fibers));
  }
  onStart(_context, _effect, _parent, fiber) {
    this.fibers.add(fiber);
  }
  onEnd(_value, fiber) {
    this.fibers.delete(fiber);
  }
  onEffect(_fiber, _effect) {
  }
  onSuspend(_fiber) {
  }
  onResume(_fiber) {
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map10(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
  onRun(execution, _fiber) {
    return execution();
  }
};
var Const = class {
  effect;
  [SupervisorTypeId] = supervisorVariance;
  constructor(effect3) {
    this.effect = effect3;
  }
  get value() {
    return this.effect;
  }
  onStart(_context, _effect, _parent, _fiber) {
  }
  onEnd(_value, _fiber) {
  }
  onEffect(_fiber, _effect) {
  }
  onSuspend(_fiber) {
  }
  onResume(_fiber) {
  }
  map(f) {
    return new ProxySupervisor(this, pipe(this.value, map10(f)));
  }
  zip(right3) {
    return new Zip(this, right3);
  }
  onRun(execution, _fiber) {
    return execution();
  }
};
var unsafeTrack = () => {
  return new Track();
};
var track = /* @__PURE__ */ sync(unsafeTrack);
var fromEffect2 = (effect3) => {
  return new Const(effect3);
};
var none8 = /* @__PURE__ */ globalValue("effect/Supervisor/none", () => fromEffect2(void_2));

// node_modules/effect/dist/esm/Differ.js
var make35 = make14;

// node_modules/effect/dist/esm/internal/supervisor/patch.js
var OP_EMPTY3 = "Empty";
var OP_ADD_SUPERVISOR = "AddSupervisor";
var OP_REMOVE_SUPERVISOR = "RemoveSupervisor";
var OP_AND_THEN2 = "AndThen";
var empty25 = {
  _tag: OP_EMPTY3
};
var combine8 = (self, that) => {
  return {
    _tag: OP_AND_THEN2,
    first: self,
    second: that
  };
};
var patch8 = (self, supervisor) => {
  return patchLoop(supervisor, of2(self));
};
var patchLoop = (_supervisor, _patches) => {
  let supervisor = _supervisor;
  let patches = _patches;
  while (isNonEmpty2(patches)) {
    const head6 = headNonEmpty2(patches);
    switch (head6._tag) {
      case OP_EMPTY3: {
        patches = tailNonEmpty2(patches);
        break;
      }
      case OP_ADD_SUPERVISOR: {
        supervisor = supervisor.zip(head6.supervisor);
        patches = tailNonEmpty2(patches);
        break;
      }
      case OP_REMOVE_SUPERVISOR: {
        supervisor = removeSupervisor(supervisor, head6.supervisor);
        patches = tailNonEmpty2(patches);
        break;
      }
      case OP_AND_THEN2: {
        patches = prepend2(head6.first)(prepend2(head6.second)(tailNonEmpty2(patches)));
        break;
      }
    }
  }
  return supervisor;
};
var removeSupervisor = (self, that) => {
  if (equals(self, that)) {
    return none8;
  } else {
    if (isZip(self)) {
      return removeSupervisor(self.left, that).zip(removeSupervisor(self.right, that));
    } else {
      return self;
    }
  }
};
var toSet2 = (self) => {
  if (equals(self, none8)) {
    return empty7();
  } else {
    if (isZip(self)) {
      return pipe(toSet2(self.left), union3(toSet2(self.right)));
    } else {
      return make10(self);
    }
  }
};
var diff7 = (oldValue, newValue) => {
  if (equals(oldValue, newValue)) {
    return empty25;
  }
  const oldSupervisors = toSet2(oldValue);
  const newSupervisors = toSet2(newValue);
  const added = pipe(newSupervisors, difference3(oldSupervisors), reduce5(empty25, (patch9, supervisor) => combine8(patch9, {
    _tag: OP_ADD_SUPERVISOR,
    supervisor
  })));
  const removed = pipe(oldSupervisors, difference3(newSupervisors), reduce5(empty25, (patch9, supervisor) => combine8(patch9, {
    _tag: OP_REMOVE_SUPERVISOR,
    supervisor
  })));
  return combine8(added, removed);
};
var differ2 = /* @__PURE__ */ make35({
  empty: empty25,
  patch: patch8,
  combine: combine8,
  diff: diff7
});

// node_modules/effect/dist/esm/internal/fiberRuntime.js
var fiberStarted = /* @__PURE__ */ counter5("effect_fiber_started", {
  incremental: true
});
var fiberActive = /* @__PURE__ */ counter5("effect_fiber_active");
var fiberSuccesses = /* @__PURE__ */ counter5("effect_fiber_successes", {
  incremental: true
});
var fiberFailures = /* @__PURE__ */ counter5("effect_fiber_failures", {
  incremental: true
});
var fiberLifetimes = /* @__PURE__ */ tagged(/* @__PURE__ */ histogram5("effect_fiber_lifetimes", /* @__PURE__ */ exponential({
  start: 0.5,
  factor: 2,
  count: 35
})), "time_unit", "milliseconds");
var EvaluationSignalContinue = "Continue";
var EvaluationSignalDone = "Done";
var EvaluationSignalYieldNow = "Yield";
var runtimeFiberVariance = {
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _
};
var absurd = (_) => {
  throw new Error(`BUG: FiberRuntime - ${toStringUnknown(_)} - please report an issue at https://github.com/Effect-TS/effect/issues`);
};
var YieldedOp = /* @__PURE__ */ Symbol.for("effect/internal/fiberRuntime/YieldedOp");
var yieldedOpChannel = /* @__PURE__ */ globalValue("effect/internal/fiberRuntime/yieldedOpChannel", () => ({
  currentOp: null
}));
var contOpSuccess = {
  [OP_ON_SUCCESS]: (_, cont, value) => {
    return internalCall(() => cont.effect_instruction_i1(value));
  },
  ["OnStep"]: (_, _cont, value) => {
    return exitSucceed(exitSucceed(value));
  },
  [OP_ON_SUCCESS_AND_FAILURE]: (_, cont, value) => {
    return internalCall(() => cont.effect_instruction_i2(value));
  },
  [OP_REVERT_FLAGS]: (self, cont, value) => {
    self.patchRuntimeFlags(self.currentRuntimeFlags, cont.patch);
    if (interruptible(self.currentRuntimeFlags) && self.isInterrupted()) {
      return exitFailCause(self.getInterruptedCause());
    } else {
      return exitSucceed(value);
    }
  },
  [OP_WHILE]: (self, cont, value) => {
    internalCall(() => cont.effect_instruction_i2(value));
    if (internalCall(() => cont.effect_instruction_i0())) {
      self.pushStack(cont);
      return internalCall(() => cont.effect_instruction_i1());
    } else {
      return void_2;
    }
  },
  [OP_ITERATOR]: (self, cont, value) => {
    while (true) {
      const state = internalCall(() => cont.effect_instruction_i0.next(value));
      if (state.done) {
        return exitSucceed(state.value);
      }
      const primitive = yieldWrapGet(state.value);
      if (!exitIsExit(primitive)) {
        self.pushStack(cont);
        return primitive;
      } else if (primitive._tag === "Failure") {
        return primitive;
      }
      value = primitive.value;
    }
  }
};
var drainQueueWhileRunningTable = {
  [OP_INTERRUPT_SIGNAL]: (self, runtimeFlags2, cur, message) => {
    self.processNewInterruptSignal(message.cause);
    return interruptible(runtimeFlags2) ? exitFailCause(message.cause) : cur;
  },
  [OP_RESUME]: (_self, _runtimeFlags, _cur, _message) => {
    throw new Error("It is illegal to have multiple concurrent run loops in a single fiber");
  },
  [OP_STATEFUL]: (self, runtimeFlags2, cur, message) => {
    message.onFiber(self, running2(runtimeFlags2));
    return cur;
  },
  [OP_YIELD_NOW]: (_self, _runtimeFlags, cur, _message) => {
    return flatMap7(yieldNow(), () => cur);
  }
};
var runBlockedRequests = (self) => forEachSequentialDiscard(flatten4(self), (requestsByRequestResolver) => forEachConcurrentDiscard(sequentialCollectionToChunk(requestsByRequestResolver), ([dataSource, sequential5]) => {
  const map25 = /* @__PURE__ */ new Map();
  const arr = [];
  for (const block of sequential5) {
    arr.push(toReadonlyArray(block));
    for (const entry of block) {
      map25.set(entry.request, entry);
    }
  }
  const flat = arr.flat();
  return fiberRefLocally(invokeWithInterrupt(dataSource.runAll(arr), flat, () => flat.forEach((entry) => {
    entry.listeners.interrupted = true;
  })), currentRequestMap, map25);
}, false, false));
var _version = /* @__PURE__ */ getCurrentVersion();
var FiberRuntime = class extends Class2 {
  [FiberTypeId] = fiberVariance2;
  [RuntimeFiberTypeId] = runtimeFiberVariance;
  _fiberRefs;
  _fiberId;
  _queue = /* @__PURE__ */ new Array();
  _children = null;
  _observers = /* @__PURE__ */ new Array();
  _running = false;
  _stack = [];
  _asyncInterruptor = null;
  _asyncBlockingOn = null;
  _exitValue = null;
  _steps = [];
  _isYielding = false;
  currentRuntimeFlags;
  currentOpCount = 0;
  currentSupervisor;
  currentScheduler;
  currentTracer;
  currentSpan;
  currentContext;
  currentDefaultServices;
  constructor(fiberId3, fiberRefs0, runtimeFlags0) {
    super();
    this.currentRuntimeFlags = runtimeFlags0;
    this._fiberId = fiberId3;
    this._fiberRefs = fiberRefs0;
    if (runtimeMetrics(runtimeFlags0)) {
      const tags = this.getFiberRef(currentMetricLabels);
      fiberStarted.unsafeUpdate(1, tags);
      fiberActive.unsafeUpdate(1, tags);
    }
    this.refreshRefCache();
  }
  commit() {
    return join2(this);
  }
  /**
   * The identity of the fiber.
   */
  id() {
    return this._fiberId;
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background. This can be called to "kick off" execution of a fiber after
   * it has been created.
   */
  resume(effect3) {
    this.tell(resume(effect3));
  }
  /**
   * The status of the fiber.
   */
  get status() {
    return this.ask((_, status3) => status3);
  }
  /**
   * Gets the fiber runtime flags.
   */
  get runtimeFlags() {
    return this.ask((state, status3) => {
      if (isDone3(status3)) {
        return state.currentRuntimeFlags;
      }
      return status3.runtimeFlags;
    });
  }
  /**
   * Returns the current `FiberScope` for the fiber.
   */
  scope() {
    return unsafeMake8(this);
  }
  /**
   * Retrieves the immediate children of the fiber.
   */
  get children() {
    return this.ask((fiber) => Array.from(fiber.getChildren()));
  }
  /**
   * Gets the fiber's set of children.
   */
  getChildren() {
    if (this._children === null) {
      this._children = /* @__PURE__ */ new Set();
    }
    return this._children;
  }
  /**
   * Retrieves the interrupted cause of the fiber, which will be `Cause.empty`
   * if the fiber has not been interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getInterruptedCause() {
    return this.getFiberRef(currentInterruptedCause);
  }
  /**
   * Retrieves the whole set of fiber refs.
   */
  fiberRefs() {
    return this.ask((fiber) => fiber.getFiberRefs());
  }
  /**
   * Returns an effect that will contain information computed from the fiber
   * state and status while running on the fiber.
   *
   * This allows the outside world to interact safely with mutable fiber state
   * without locks or immutable data.
   */
  ask(f) {
    return suspend(() => {
      const deferred = deferredUnsafeMake(this._fiberId);
      this.tell(stateful((fiber, status3) => {
        deferredUnsafeDone(deferred, sync(() => f(fiber, status3)));
      }));
      return deferredAwait(deferred);
    });
  }
  /**
   * Adds a message to be processed by the fiber on the fiber.
   */
  tell(message) {
    this._queue.push(message);
    if (!this._running) {
      this._running = true;
      this.drainQueueLaterOnExecutor();
    }
  }
  get await() {
    return async_((resume2) => {
      const cb = (exit4) => resume2(succeed(exit4));
      if (this._exitValue !== null) {
        cb(this._exitValue);
        return;
      }
      this.tell(stateful((fiber, _) => {
        if (fiber._exitValue !== null) {
          cb(this._exitValue);
        } else {
          fiber.addObserver(cb);
        }
      }));
      return sync(() => this.tell(stateful((fiber, _) => {
        fiber.removeObserver(cb);
      })));
    }, this.id());
  }
  get inheritAll() {
    return withFiberRuntime((parentFiber, parentStatus) => {
      const parentFiberId = parentFiber.id();
      const parentFiberRefs = parentFiber.getFiberRefs();
      const parentRuntimeFlags = parentStatus.runtimeFlags;
      const childFiberRefs = this.getFiberRefs();
      const updatedFiberRefs = joinAs(parentFiberRefs, parentFiberId, childFiberRefs);
      parentFiber.setFiberRefs(updatedFiberRefs);
      const updatedRuntimeFlags = parentFiber.getFiberRef(currentRuntimeFlags);
      const patch9 = pipe(
        diff4(parentRuntimeFlags, updatedRuntimeFlags),
        // Do not inherit WindDown or Interruption!
        exclude2(Interruption),
        exclude2(WindDown)
      );
      return updateRuntimeFlags(patch9);
    });
  }
  /**
   * Tentatively observes the fiber, but returns immediately if it is not
   * already done.
   */
  get poll() {
    return sync(() => fromNullable(this._exitValue));
  }
  /**
   * Unsafely observes the fiber, but returns immediately if it is not
   * already done.
   */
  unsafePoll() {
    return this._exitValue;
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  interruptAsFork(fiberId3) {
    return sync(() => this.tell(interruptSignal(interrupt(fiberId3))));
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  unsafeInterruptAsFork(fiberId3) {
    this.tell(interruptSignal(interrupt(fiberId3)));
  }
  /**
   * Adds an observer to the list of observers.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addObserver(observer) {
    if (this._exitValue !== null) {
      observer(this._exitValue);
    } else {
      this._observers.push(observer);
    }
  }
  /**
   * Removes the specified observer from the list of observers that will be
   * notified when the fiber exits.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeObserver(observer) {
    this._observers = this._observers.filter((o) => o !== observer);
  }
  /**
   * Retrieves all fiber refs of the fiber.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRefs() {
    this.setFiberRef(currentRuntimeFlags, this.currentRuntimeFlags);
    return this._fiberRefs;
  }
  /**
   * Deletes the specified fiber ref.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  unsafeDeleteFiberRef(fiberRef) {
    this._fiberRefs = delete_(this._fiberRefs, fiberRef);
  }
  /**
   * Retrieves the state of the fiber ref, or else its initial value.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRef(fiberRef) {
    if (this._fiberRefs.locals.has(fiberRef)) {
      return this._fiberRefs.locals.get(fiberRef)[0][1];
    }
    return fiberRef.initial;
  }
  /**
   * Sets the fiber ref to the specified value.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRef(fiberRef, value) {
    this._fiberRefs = updateAs(this._fiberRefs, {
      fiberId: this._fiberId,
      fiberRef,
      value
    });
    this.refreshRefCache();
  }
  refreshRefCache() {
    this.currentDefaultServices = this.getFiberRef(currentServices);
    this.currentTracer = this.currentDefaultServices.unsafeMap.get(tracerTag.key);
    this.currentSupervisor = this.getFiberRef(currentSupervisor);
    this.currentScheduler = this.getFiberRef(currentScheduler);
    this.currentContext = this.getFiberRef(currentContext);
    this.currentSpan = this.currentContext.unsafeMap.get(spanTag.key);
  }
  /**
   * Wholesale replaces all fiber refs of this fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRefs(fiberRefs3) {
    this._fiberRefs = fiberRefs3;
    this.refreshRefCache();
  }
  /**
   * Adds a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addChild(child) {
    this.getChildren().add(child);
  }
  /**
   * Removes a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeChild(child) {
    this.getChildren().delete(child);
  }
  /**
   * Transfers all children of this fiber that are currently running to the
   * specified fiber scope.
   *
   * **NOTE**: This method must be invoked by the fiber itself after it has
   * evaluated the effects but prior to exiting.
   */
  transferChildren(scope5) {
    const children3 = this._children;
    this._children = null;
    if (children3 !== null && children3.size > 0) {
      for (const child of children3) {
        if (child._exitValue === null) {
          scope5.add(this.currentRuntimeFlags, child);
        }
      }
    }
  }
  /**
   * On the current thread, executes all messages in the fiber's inbox. This
   * method may return before all work is done, in the event the fiber executes
   * an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueOnCurrentThread() {
    let recurse = true;
    while (recurse) {
      let evaluationSignal = EvaluationSignalContinue;
      const prev = globalThis[currentFiberURI];
      globalThis[currentFiberURI] = this;
      try {
        while (evaluationSignal === EvaluationSignalContinue) {
          evaluationSignal = this._queue.length === 0 ? EvaluationSignalDone : this.evaluateMessageWhileSuspended(this._queue.splice(0, 1)[0]);
        }
      } finally {
        this._running = false;
        globalThis[currentFiberURI] = prev;
      }
      if (this._queue.length > 0 && !this._running) {
        this._running = true;
        if (evaluationSignal === EvaluationSignalYieldNow) {
          this.drainQueueLaterOnExecutor();
          recurse = false;
        } else {
          recurse = true;
        }
      } else {
        recurse = false;
      }
    }
  }
  /**
   * Schedules the execution of all messages in the fiber's inbox.
   *
   * This method will return immediately after the scheduling
   * operation is completed, but potentially before such messages have been
   * executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueLaterOnExecutor() {
    this.currentScheduler.scheduleTask(this.run, this.getFiberRef(currentSchedulingPriority), this);
  }
  /**
   * Drains the fiber's message queue while the fiber is actively running,
   * returning the next effect to execute, which may be the input effect if no
   * additional effect needs to be executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueWhileRunning(runtimeFlags2, cur0) {
    let cur = cur0;
    while (this._queue.length > 0) {
      const message = this._queue.splice(0, 1)[0];
      cur = drainQueueWhileRunningTable[message._tag](this, runtimeFlags2, cur, message);
    }
    return cur;
  }
  /**
   * Determines if the fiber is interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  isInterrupted() {
    return !isEmpty5(this.getFiberRef(currentInterruptedCause));
  }
  /**
   * Adds an interruptor to the set of interruptors that are interrupting this
   * fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addInterruptedCause(cause3) {
    const oldSC = this.getFiberRef(currentInterruptedCause);
    this.setFiberRef(currentInterruptedCause, sequential(oldSC, cause3));
  }
  /**
   * Processes a new incoming interrupt signal.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  processNewInterruptSignal(cause3) {
    this.addInterruptedCause(cause3);
    this.sendInterruptSignalToAllChildren();
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  sendInterruptSignalToAllChildren() {
    if (this._children === null || this._children.size === 0) {
      return false;
    }
    let told = false;
    for (const child of this._children) {
      child.tell(interruptSignal(interrupt(this.id())));
      told = true;
    }
    return told;
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  interruptAllChildren() {
    if (this.sendInterruptSignalToAllChildren()) {
      const it = this._children.values();
      this._children = null;
      let isDone6 = false;
      const body = () => {
        const next4 = it.next();
        if (!next4.done) {
          return asVoid2(next4.value.await);
        } else {
          return sync(() => {
            isDone6 = true;
          });
        }
      };
      return whileLoop({
        while: () => !isDone6,
        body,
        step: () => {
        }
      });
    }
    return null;
  }
  reportExitValue(exit4) {
    if (runtimeMetrics(this.currentRuntimeFlags)) {
      const tags = this.getFiberRef(currentMetricLabels);
      const startTimeMillis = this.id().startTimeMillis;
      const endTimeMillis = Date.now();
      fiberLifetimes.unsafeUpdate(endTimeMillis - startTimeMillis, tags);
      fiberActive.unsafeUpdate(-1, tags);
      switch (exit4._tag) {
        case OP_SUCCESS: {
          fiberSuccesses.unsafeUpdate(1, tags);
          break;
        }
        case OP_FAILURE: {
          fiberFailures.unsafeUpdate(1, tags);
          break;
        }
      }
    }
    if (exit4._tag === "Failure") {
      const level = this.getFiberRef(currentUnhandledErrorLogLevel);
      if (!isInterruptedOnly(exit4.cause) && level._tag === "Some") {
        this.log("Fiber terminated with an unhandled error", exit4.cause, level);
      }
    }
  }
  setExitValue(exit4) {
    this._exitValue = exit4;
    this.reportExitValue(exit4);
    for (let i = this._observers.length - 1; i >= 0; i--) {
      this._observers[i](exit4);
    }
    this._observers = [];
  }
  getLoggers() {
    return this.getFiberRef(currentLoggers);
  }
  log(message, cause3, overrideLogLevel) {
    const logLevel = isSome2(overrideLogLevel) ? overrideLogLevel.value : this.getFiberRef(currentLogLevel);
    const minimumLogLevel = this.getFiberRef(currentMinimumLogLevel);
    if (greaterThan3(minimumLogLevel, logLevel)) {
      return;
    }
    const spans = this.getFiberRef(currentLogSpan);
    const annotations2 = this.getFiberRef(currentLogAnnotations);
    const loggers = this.getLoggers();
    const contextMap = this.getFiberRefs();
    if (size3(loggers) > 0) {
      const clockService = get3(this.getFiberRef(currentServices), clockTag);
      const date = new Date(clockService.unsafeCurrentTimeMillis());
      withRedactableContext(contextMap, () => {
        for (const logger of loggers) {
          logger.log({
            fiberId: this.id(),
            logLevel,
            message,
            cause: cause3,
            context: contextMap,
            spans,
            annotations: annotations2,
            date
          });
        }
      });
    }
  }
  /**
   * Evaluates a single message on the current thread, while the fiber is
   * suspended. This method should only be called while evaluation of the
   * fiber's effect is suspended due to an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateMessageWhileSuspended(message) {
    switch (message._tag) {
      case OP_YIELD_NOW: {
        return EvaluationSignalYieldNow;
      }
      case OP_INTERRUPT_SIGNAL: {
        this.processNewInterruptSignal(message.cause);
        if (this._asyncInterruptor !== null) {
          this._asyncInterruptor(exitFailCause(message.cause));
          this._asyncInterruptor = null;
        }
        return EvaluationSignalContinue;
      }
      case OP_RESUME: {
        this._asyncInterruptor = null;
        this._asyncBlockingOn = null;
        this.evaluateEffect(message.effect);
        return EvaluationSignalContinue;
      }
      case OP_STATEFUL: {
        message.onFiber(this, this._exitValue !== null ? done4 : suspended2(this.currentRuntimeFlags, this._asyncBlockingOn));
        return EvaluationSignalContinue;
      }
      default: {
        return absurd(message);
      }
    }
  }
  /**
   * Evaluates an effect until completion, potentially asynchronously.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateEffect(effect0) {
    this.currentSupervisor.onResume(this);
    try {
      let effect3 = interruptible(this.currentRuntimeFlags) && this.isInterrupted() ? exitFailCause(this.getInterruptedCause()) : effect0;
      while (effect3 !== null) {
        const eff = effect3;
        const exit4 = this.runLoop(eff);
        if (exit4 === YieldedOp) {
          const op = yieldedOpChannel.currentOp;
          yieldedOpChannel.currentOp = null;
          if (op._op === OP_YIELD) {
            if (cooperativeYielding(this.currentRuntimeFlags)) {
              this.tell(yieldNow3());
              this.tell(resume(exitVoid));
              effect3 = null;
            } else {
              effect3 = exitVoid;
            }
          } else if (op._op === OP_ASYNC) {
            effect3 = null;
          }
        } else {
          this.currentRuntimeFlags = pipe(this.currentRuntimeFlags, enable2(WindDown));
          const interruption2 = this.interruptAllChildren();
          if (interruption2 !== null) {
            effect3 = flatMap7(interruption2, () => exit4);
          } else {
            if (this._queue.length === 0) {
              this.setExitValue(exit4);
            } else {
              this.tell(resume(exit4));
            }
            effect3 = null;
          }
        }
      }
    } finally {
      this.currentSupervisor.onSuspend(this);
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on the current
   * thread. This can be called to "kick off" execution of a fiber after it has
   * been created, in hopes that the effect can be executed synchronously.
   *
   * This is not the normal way of starting a fiber, but it is useful when the
   * express goal of executing the fiber is to synchronously produce its exit.
   */
  start(effect3) {
    if (!this._running) {
      this._running = true;
      const prev = globalThis[currentFiberURI];
      globalThis[currentFiberURI] = this;
      try {
        this.evaluateEffect(effect3);
      } finally {
        this._running = false;
        globalThis[currentFiberURI] = prev;
        if (this._queue.length > 0) {
          this.drainQueueLaterOnExecutor();
        }
      }
    } else {
      this.tell(resume(effect3));
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background, and on the correct thread pool. This can be called to "kick
   * off" execution of a fiber after it has been created, in hopes that the
   * effect can be executed synchronously.
   */
  startFork(effect3) {
    this.tell(resume(effect3));
  }
  /**
   * Takes the current runtime flags, patches them to return the new runtime
   * flags, and then makes any changes necessary to fiber state based on the
   * specified patch.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  patchRuntimeFlags(oldRuntimeFlags, patch9) {
    const newRuntimeFlags = patch4(oldRuntimeFlags, patch9);
    globalThis[currentFiberURI] = this;
    this.currentRuntimeFlags = newRuntimeFlags;
    return newRuntimeFlags;
  }
  /**
   * Initiates an asynchronous operation, by building a callback that will
   * resume execution, and then feeding that callback to the registration
   * function, handling error cases and repeated resumptions appropriately.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  initiateAsync(runtimeFlags2, asyncRegister) {
    let alreadyCalled = false;
    const callback = (effect3) => {
      if (!alreadyCalled) {
        alreadyCalled = true;
        this.tell(resume(effect3));
      }
    };
    if (interruptible(runtimeFlags2)) {
      this._asyncInterruptor = callback;
    }
    try {
      asyncRegister(callback);
    } catch (e) {
      callback(failCause(die(e)));
    }
  }
  pushStack(cont) {
    this._stack.push(cont);
    if (cont._op === "OnStep") {
      this._steps.push({
        refs: this.getFiberRefs(),
        flags: this.currentRuntimeFlags
      });
    }
  }
  popStack() {
    const item = this._stack.pop();
    if (item) {
      if (item._op === "OnStep") {
        this._steps.pop();
      }
      return item;
    }
    return;
  }
  getNextSuccessCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OP_ON_FAILURE) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  getNextFailCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OP_ON_SUCCESS && frame._op !== OP_WHILE && frame._op !== OP_ITERATOR) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  [OP_TAG](op) {
    return sync(() => unsafeGet3(this.currentContext, op));
  }
  ["Left"](op) {
    return fail2(op.left);
  }
  ["None"](_) {
    return fail2(new NoSuchElementException());
  }
  ["Right"](op) {
    return exitSucceed(op.right);
  }
  ["Some"](op) {
    return exitSucceed(op.value);
  }
  ["Micro"](op) {
    return unsafeAsync((microResume) => {
      let resume2 = microResume;
      const fiber = runFork(provideContext2(op, this.currentContext));
      fiber.addObserver((exit4) => {
        if (exit4._tag === "Success") {
          return resume2(exitSucceed(exit4.value));
        }
        switch (exit4.cause._tag) {
          case "Interrupt": {
            return resume2(exitFailCause(interrupt(none4)));
          }
          case "Fail": {
            return resume2(fail2(exit4.cause.error));
          }
          case "Die": {
            return resume2(die2(exit4.cause.defect));
          }
        }
      });
      return unsafeAsync((abortResume) => {
        resume2 = (_) => {
          abortResume(void_2);
        };
        fiber.unsafeInterrupt();
      });
    });
  }
  [OP_SYNC](op) {
    const value = internalCall(() => op.effect_instruction_i0());
    const cont = this.getNextSuccessCont();
    if (cont !== void 0) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, value);
    } else {
      yieldedOpChannel.currentOp = exitSucceed(value);
      return YieldedOp;
    }
  }
  [OP_SUCCESS](op) {
    const oldCur = op;
    const cont = this.getNextSuccessCont();
    if (cont !== void 0) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, oldCur.effect_instruction_i0);
    } else {
      yieldedOpChannel.currentOp = oldCur;
      return YieldedOp;
    }
  }
  [OP_FAILURE](op) {
    const cause3 = op.effect_instruction_i0;
    const cont = this.getNextFailCont();
    if (cont !== void 0) {
      switch (cont._op) {
        case OP_ON_FAILURE:
        case OP_ON_SUCCESS_AND_FAILURE: {
          if (!(interruptible(this.currentRuntimeFlags) && this.isInterrupted())) {
            return internalCall(() => cont.effect_instruction_i1(cause3));
          } else {
            return exitFailCause(stripFailures(cause3));
          }
        }
        case "OnStep": {
          if (!(interruptible(this.currentRuntimeFlags) && this.isInterrupted())) {
            return exitSucceed(exitFailCause(cause3));
          } else {
            return exitFailCause(stripFailures(cause3));
          }
        }
        case OP_REVERT_FLAGS: {
          this.patchRuntimeFlags(this.currentRuntimeFlags, cont.patch);
          if (interruptible(this.currentRuntimeFlags) && this.isInterrupted()) {
            return exitFailCause(sequential(cause3, this.getInterruptedCause()));
          } else {
            return exitFailCause(cause3);
          }
        }
        default: {
          absurd(cont);
        }
      }
    } else {
      yieldedOpChannel.currentOp = exitFailCause(cause3);
      return YieldedOp;
    }
  }
  [OP_WITH_RUNTIME](op) {
    return internalCall(() => op.effect_instruction_i0(this, running2(this.currentRuntimeFlags)));
  }
  ["Blocked"](op) {
    const refs = this.getFiberRefs();
    const flags = this.currentRuntimeFlags;
    if (this._steps.length > 0) {
      const frames = [];
      const snap = this._steps[this._steps.length - 1];
      let frame = this.popStack();
      while (frame && frame._op !== "OnStep") {
        frames.push(frame);
        frame = this.popStack();
      }
      this.setFiberRefs(snap.refs);
      this.currentRuntimeFlags = snap.flags;
      const patchRefs = diff6(snap.refs, refs);
      const patchFlags = diff4(snap.flags, flags);
      return exitSucceed(blocked(op.effect_instruction_i0, withFiberRuntime((newFiber) => {
        while (frames.length > 0) {
          newFiber.pushStack(frames.pop());
        }
        newFiber.setFiberRefs(patch7(newFiber.id(), newFiber.getFiberRefs())(patchRefs));
        newFiber.currentRuntimeFlags = patch4(patchFlags)(newFiber.currentRuntimeFlags);
        return op.effect_instruction_i1;
      })));
    }
    return uninterruptibleMask((restore) => flatMap7(forkDaemon(runRequestBlock(op.effect_instruction_i0)), () => restore(op.effect_instruction_i1)));
  }
  ["RunBlocked"](op) {
    return runBlockedRequests(op.effect_instruction_i0);
  }
  [OP_UPDATE_RUNTIME_FLAGS](op) {
    const updateFlags = op.effect_instruction_i0;
    const oldRuntimeFlags = this.currentRuntimeFlags;
    const newRuntimeFlags = patch4(oldRuntimeFlags, updateFlags);
    if (interruptible(newRuntimeFlags) && this.isInterrupted()) {
      return exitFailCause(this.getInterruptedCause());
    } else {
      this.patchRuntimeFlags(this.currentRuntimeFlags, updateFlags);
      if (op.effect_instruction_i1) {
        const revertFlags = diff4(newRuntimeFlags, oldRuntimeFlags);
        this.pushStack(new RevertFlags(revertFlags, op));
        return internalCall(() => op.effect_instruction_i1(oldRuntimeFlags));
      } else {
        return exitVoid;
      }
    }
  }
  [OP_ON_SUCCESS](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  ["OnStep"](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ON_FAILURE](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ON_SUCCESS_AND_FAILURE](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ASYNC](op) {
    this._asyncBlockingOn = op.effect_instruction_i1;
    this.initiateAsync(this.currentRuntimeFlags, op.effect_instruction_i0);
    yieldedOpChannel.currentOp = op;
    return YieldedOp;
  }
  [OP_YIELD](op) {
    this._isYielding = false;
    yieldedOpChannel.currentOp = op;
    return YieldedOp;
  }
  [OP_WHILE](op) {
    const check3 = op.effect_instruction_i0;
    const body = op.effect_instruction_i1;
    if (check3()) {
      this.pushStack(op);
      return body();
    } else {
      return exitVoid;
    }
  }
  [OP_ITERATOR](op) {
    return contOpSuccess[OP_ITERATOR](this, op, void 0);
  }
  [OP_COMMIT](op) {
    return internalCall(() => op.commit());
  }
  /**
   * The main run-loop for evaluating effects.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  runLoop(effect0) {
    let cur = effect0;
    this.currentOpCount = 0;
    while (true) {
      if ((this.currentRuntimeFlags & OpSupervision) !== 0) {
        this.currentSupervisor.onEffect(this, cur);
      }
      if (this._queue.length > 0) {
        cur = this.drainQueueWhileRunning(this.currentRuntimeFlags, cur);
      }
      if (!this._isYielding) {
        this.currentOpCount += 1;
        const shouldYield = this.currentScheduler.shouldYield(this);
        if (shouldYield !== false) {
          this._isYielding = true;
          this.currentOpCount = 0;
          const oldCur = cur;
          cur = flatMap7(yieldNow({
            priority: shouldYield
          }), () => oldCur);
        }
      }
      try {
        cur = this.currentTracer.context(() => {
          if (_version !== cur[EffectTypeId2]._V) {
            const level = this.getFiberRef(currentVersionMismatchErrorLogLevel);
            if (level._tag === "Some") {
              const effectVersion = cur[EffectTypeId2]._V;
              this.log(`Executing an Effect versioned ${effectVersion} with a Runtime of version ${getCurrentVersion()}, you may want to dedupe the effect dependencies, you can use the language service plugin to detect this at compile time: https://github.com/Effect-TS/language-service`, empty16, level);
            }
          }
          return this[cur._op](cur);
        }, this);
        if (cur === YieldedOp) {
          const op = yieldedOpChannel.currentOp;
          if (op._op === OP_YIELD || op._op === OP_ASYNC) {
            return YieldedOp;
          }
          yieldedOpChannel.currentOp = null;
          return op._op === OP_SUCCESS || op._op === OP_FAILURE ? op : exitFailCause(die(op));
        }
      } catch (e) {
        if (cur !== YieldedOp && !hasProperty(cur, "_op") || !(cur._op in this)) {
          cur = dieMessage(`Not a valid effect: ${toStringUnknown(cur)}`);
        } else if (isInterruptedException(e)) {
          cur = exitFailCause(sequential(die(e), interrupt(none4)));
        } else {
          cur = die2(e);
        }
      }
    }
  }
  run = () => {
    this.drainQueueOnCurrentThread();
  };
};
var currentMinimumLogLevel = /* @__PURE__ */ globalValue("effect/FiberRef/currentMinimumLogLevel", () => fiberRefUnsafeMake(fromLiteral("Info")));
var loggerWithConsoleLog = (self) => makeLogger((opts) => {
  const services = getOrDefault2(opts.context, currentServices);
  get3(services, consoleTag).unsafe.log(self.log(opts));
});
var defaultLogger = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Logger/defaultLogger"), () => loggerWithConsoleLog(stringLogger));
var tracerLogger = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/Logger/tracerLogger"), () => makeLogger(({
  annotations: annotations2,
  cause: cause3,
  context: context7,
  fiberId: fiberId3,
  logLevel,
  message
}) => {
  const span4 = getOption2(getOrDefault(context7, currentContext), spanTag);
  if (span4._tag === "None" || span4.value._tag === "ExternalSpan") {
    return;
  }
  const clockService = unsafeGet3(getOrDefault(context7, currentServices), clockTag);
  const attributes = {};
  for (const [key, value] of annotations2) {
    attributes[key] = value;
  }
  attributes["effect.fiberId"] = threadName2(fiberId3);
  attributes["effect.logLevel"] = logLevel.label;
  if (cause3 !== null && cause3._tag !== "Empty") {
    attributes["effect.cause"] = pretty(cause3, {
      renderErrorCause: true
    });
  }
  span4.value.event(toStringUnknown(Array.isArray(message) && message.length === 1 ? message[0] : message), clockService.unsafeCurrentTimeNanos(), attributes);
}));
var currentLoggers = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLoggers"), () => fiberRefUnsafeMakeHashSet(make10(defaultLogger, tracerLogger)));
var annotateLogsScoped = function() {
  if (typeof arguments[0] === "string") {
    return fiberRefLocallyScopedWith(currentLogAnnotations, set3(arguments[0], arguments[1]));
  }
  const entries2 = Object.entries(arguments[0]);
  return fiberRefLocallyScopedWith(currentLogAnnotations, mutate3((annotations2) => {
    for (let i = 0; i < entries2.length; i++) {
      const [key, value] = entries2[i];
      set3(annotations2, key, value);
    }
    return annotations2;
  }));
};
var whenLogLevel = /* @__PURE__ */ dual(2, (effect3, level) => {
  const requiredLogLevel = typeof level === "string" ? fromLiteral(level) : level;
  return withFiberRuntime((fiberState) => {
    const minimumLogLevel = fiberState.getFiberRef(currentMinimumLogLevel);
    if (greaterThan3(minimumLogLevel, requiredLogLevel)) {
      return succeed(none2());
    }
    return map10(effect3, some2);
  });
});
var acquireRelease = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (acquire, release) => uninterruptible(tap2(acquire, (a) => addFinalizer((exit4) => release(a, exit4)))));
var acquireReleaseInterruptible = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (acquire, release) => ensuring(acquire, addFinalizer((exit4) => release(exit4))));
var addFinalizer = (finalizer2) => withFiberRuntime((runtime4) => {
  const acquireRefs = runtime4.getFiberRefs();
  const acquireFlags = disable2(runtime4.currentRuntimeFlags, Interruption);
  return flatMap7(scope, (scope5) => scopeAddFinalizerExit(scope5, (exit4) => withFiberRuntime((runtimeFinalizer) => {
    const preRefs = runtimeFinalizer.getFiberRefs();
    const preFlags = runtimeFinalizer.currentRuntimeFlags;
    const patchRefs = diff6(preRefs, acquireRefs);
    const patchFlags = diff4(preFlags, acquireFlags);
    const inverseRefs = diff6(acquireRefs, preRefs);
    runtimeFinalizer.setFiberRefs(patch7(patchRefs, runtimeFinalizer.id(), acquireRefs));
    return ensuring(withRuntimeFlags(finalizer2(exit4), patchFlags), sync(() => {
      runtimeFinalizer.setFiberRefs(patch7(inverseRefs, runtimeFinalizer.id(), runtimeFinalizer.getFiberRefs()));
    }));
  })));
});
var daemonChildren = (self) => {
  const forkScope = fiberRefLocally(currentForkScopeOverride, some2(globalScope));
  return forkScope(self);
};
var _existsParFound = /* @__PURE__ */ Symbol.for("effect/Effect/existsPar/found");
var exists3 = /* @__PURE__ */ dual((args2) => isIterable(args2[0]) && !isEffect(args2[0]), (elements, predicate, options) => matchSimple(options?.concurrency, () => suspend(() => existsLoop(elements[Symbol.iterator](), 0, predicate)), () => matchEffect(forEach7(elements, (a, i) => if_(predicate(a, i), {
  onTrue: () => fail2(_existsParFound),
  onFalse: () => void_2
}), options), {
  onFailure: (e) => e === _existsParFound ? succeed(true) : fail2(e),
  onSuccess: () => succeed(false)
})));
var existsLoop = (iterator, index, f) => {
  const next4 = iterator.next();
  if (next4.done) {
    return succeed(false);
  }
  return flatMap7(f(next4.value, index), (b) => b ? succeed(b) : existsLoop(iterator, index + 1, f));
};
var filter7 = /* @__PURE__ */ dual((args2) => isIterable(args2[0]) && !isEffect(args2[0]), (elements, predicate, options) => {
  const predicate_ = options?.negate ? (a, i) => map10(predicate(a, i), not) : predicate;
  return matchSimple(options?.concurrency, () => suspend(() => fromIterable2(elements).reduceRight((effect3, a, i) => zipWith3(effect3, suspend(() => predicate_(a, i)), (list, b) => b ? [a, ...list] : list), sync(() => new Array()))), () => map10(forEach7(elements, (a, i) => map10(predicate_(a, i), (b) => b ? some2(a) : none2()), options), getSomes));
});
var allResolveInput = (input) => {
  if (Array.isArray(input) || isIterable(input)) {
    return [input, none2()];
  }
  const keys5 = Object.keys(input);
  const size13 = keys5.length;
  return [keys5.map((k) => input[k]), some2((values3) => {
    const res = {};
    for (let i = 0; i < size13; i++) {
      res[keys5[i]] = values3[i];
    }
    return res;
  })];
};
var allValidate = (effects, reconcile, options) => {
  const eitherEffects = [];
  for (const effect3 of effects) {
    eitherEffects.push(either2(effect3));
  }
  return flatMap7(forEach7(eitherEffects, identity, {
    concurrency: options?.concurrency,
    batching: options?.batching,
    concurrentFinalizers: options?.concurrentFinalizers
  }), (eithers) => {
    const none10 = none2();
    const size13 = eithers.length;
    const errors = new Array(size13);
    const successes = new Array(size13);
    let errored = false;
    for (let i = 0; i < size13; i++) {
      const either7 = eithers[i];
      if (either7._tag === "Left") {
        errors[i] = some2(either7.left);
        errored = true;
      } else {
        successes[i] = either7.right;
        errors[i] = none10;
      }
    }
    if (errored) {
      return reconcile._tag === "Some" ? fail2(reconcile.value(errors)) : fail2(errors);
    } else if (options?.discard) {
      return void_2;
    }
    return reconcile._tag === "Some" ? succeed(reconcile.value(successes)) : succeed(successes);
  });
};
var allEither = (effects, reconcile, options) => {
  const eitherEffects = [];
  for (const effect3 of effects) {
    eitherEffects.push(either2(effect3));
  }
  if (options?.discard) {
    return forEach7(eitherEffects, identity, {
      concurrency: options?.concurrency,
      batching: options?.batching,
      discard: true,
      concurrentFinalizers: options?.concurrentFinalizers
    });
  }
  return map10(forEach7(eitherEffects, identity, {
    concurrency: options?.concurrency,
    batching: options?.batching,
    concurrentFinalizers: options?.concurrentFinalizers
  }), (eithers) => reconcile._tag === "Some" ? reconcile.value(eithers) : eithers);
};
var all5 = (arg, options) => {
  const [effects, reconcile] = allResolveInput(arg);
  if (options?.mode === "validate") {
    return allValidate(effects, reconcile, options);
  } else if (options?.mode === "either") {
    return allEither(effects, reconcile, options);
  }
  return options?.discard !== true && reconcile._tag === "Some" ? map10(forEach7(effects, identity, options), reconcile.value) : forEach7(effects, identity, options);
};
var allWith = (options) => (arg) => all5(arg, options);
var allSuccesses = (elements, options) => map10(all5(fromIterable2(elements).map(exit), options), filterMap2((exit4) => exitIsSuccess(exit4) ? some2(exit4.effect_instruction_i0) : none2()));
var replicate = /* @__PURE__ */ dual(2, (self, n) => Array.from({
  length: n
}, () => self));
var replicateEffect = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, n, options) => all5(replicate(self, n), options));
var forEach7 = /* @__PURE__ */ dual((args2) => isIterable(args2[0]), (self, f, options) => withFiberRuntime((r) => {
  const isRequestBatchingEnabled = options?.batching === true || options?.batching === "inherit" && r.getFiberRef(currentRequestBatching);
  if (options?.discard) {
    return match9(options.concurrency, () => finalizersMaskInternal(sequential3, options?.concurrentFinalizers)((restore) => isRequestBatchingEnabled ? forEachConcurrentDiscard(self, (a, i) => restore(f(a, i)), true, false, 1) : forEachSequentialDiscard(self, (a, i) => restore(f(a, i)))), () => finalizersMaskInternal(parallel3, options?.concurrentFinalizers)((restore) => forEachConcurrentDiscard(self, (a, i) => restore(f(a, i)), isRequestBatchingEnabled, false)), (n) => finalizersMaskInternal(parallelN2(n), options?.concurrentFinalizers)((restore) => forEachConcurrentDiscard(self, (a, i) => restore(f(a, i)), isRequestBatchingEnabled, false, n)));
  }
  return match9(options?.concurrency, () => finalizersMaskInternal(sequential3, options?.concurrentFinalizers)((restore) => isRequestBatchingEnabled ? forEachParN(self, 1, (a, i) => restore(f(a, i)), true) : forEachSequential(self, (a, i) => restore(f(a, i)))), () => finalizersMaskInternal(parallel3, options?.concurrentFinalizers)((restore) => forEachParUnbounded(self, (a, i) => restore(f(a, i)), isRequestBatchingEnabled)), (n) => finalizersMaskInternal(parallelN2(n), options?.concurrentFinalizers)((restore) => forEachParN(self, n, (a, i) => restore(f(a, i)), isRequestBatchingEnabled)));
}));
var forEachParUnbounded = (self, f, batching) => suspend(() => {
  const as13 = fromIterable2(self);
  const array4 = new Array(as13.length);
  const fn2 = (a, i) => flatMap7(f(a, i), (b) => sync(() => array4[i] = b));
  return zipRight2(forEachConcurrentDiscard(as13, fn2, batching, false), succeed(array4));
});
var forEachConcurrentDiscard = (self, f, batching, processAll, n) => uninterruptibleMask((restore) => transplant((graft) => withFiberRuntime((parent) => {
  let todos = Array.from(self).reverse();
  let target = todos.length;
  if (target === 0) {
    return void_2;
  }
  let counter6 = 0;
  let interrupted3 = false;
  const fibersCount = n ? Math.min(todos.length, n) : todos.length;
  const fibers = /* @__PURE__ */ new Set();
  const results = new Array();
  const interruptAll3 = () => fibers.forEach((fiber) => {
    fiber.currentScheduler.scheduleTask(() => {
      fiber.unsafeInterruptAsFork(parent.id());
    }, 0, fiber);
  });
  const startOrder = new Array();
  const joinOrder = new Array();
  const residual = new Array();
  const collectExits = () => {
    const exits = results.filter(({
      exit: exit4
    }) => exit4._tag === "Failure").sort((a, b) => a.index < b.index ? -1 : a.index === b.index ? 0 : 1).map(({
      exit: exit4
    }) => exit4);
    if (exits.length === 0) {
      exits.push(exitVoid);
    }
    return exits;
  };
  const runFiber = (eff, interruptImmediately = false) => {
    const runnable = uninterruptible(graft(eff));
    const fiber = unsafeForkUnstarted(runnable, parent, parent.currentRuntimeFlags, globalScope);
    parent.currentScheduler.scheduleTask(() => {
      if (interruptImmediately) {
        fiber.unsafeInterruptAsFork(parent.id());
      }
      fiber.resume(runnable);
    }, 0, fiber);
    return fiber;
  };
  const onInterruptSignal = () => {
    if (!processAll) {
      target -= todos.length;
      todos = [];
    }
    interrupted3 = true;
    interruptAll3();
  };
  const stepOrExit = batching ? step2 : exit;
  const processingFiber = runFiber(async_((resume2) => {
    const pushResult = (res, index) => {
      if (res._op === "Blocked") {
        residual.push(res);
      } else {
        results.push({
          index,
          exit: res
        });
        if (res._op === "Failure" && !interrupted3) {
          onInterruptSignal();
        }
      }
    };
    const next4 = () => {
      if (todos.length > 0) {
        const a = todos.pop();
        let index = counter6++;
        const returnNextElement = () => {
          const a2 = todos.pop();
          index = counter6++;
          return flatMap7(yieldNow(), () => flatMap7(stepOrExit(restore(f(a2, index))), onRes));
        };
        const onRes = (res) => {
          if (todos.length > 0) {
            pushResult(res, index);
            if (todos.length > 0) {
              return returnNextElement();
            }
          }
          return succeed(res);
        };
        const todo = flatMap7(stepOrExit(restore(f(a, index))), onRes);
        const fiber = runFiber(todo);
        startOrder.push(fiber);
        fibers.add(fiber);
        if (interrupted3) {
          fiber.currentScheduler.scheduleTask(() => {
            fiber.unsafeInterruptAsFork(parent.id());
          }, 0, fiber);
        }
        fiber.addObserver((wrapped) => {
          let exit4;
          if (wrapped._op === "Failure") {
            exit4 = wrapped;
          } else {
            exit4 = wrapped.effect_instruction_i0;
          }
          joinOrder.push(fiber);
          fibers.delete(fiber);
          pushResult(exit4, index);
          if (results.length === target) {
            resume2(succeed(getOrElse(exitCollectAll(collectExits(), {
              parallel: true
            }), () => exitVoid)));
          } else if (residual.length + results.length === target) {
            const exits = collectExits();
            const requests = residual.map((blocked3) => blocked3.effect_instruction_i0).reduce(par);
            resume2(succeed(blocked(requests, forEachConcurrentDiscard([getOrElse(exitCollectAll(exits, {
              parallel: true
            }), () => exitVoid), ...residual.map((blocked3) => blocked3.effect_instruction_i1)], (i) => i, batching, true, n))));
          } else {
            next4();
          }
        });
      }
    };
    for (let i = 0; i < fibersCount; i++) {
      next4();
    }
  }));
  return asVoid2(onExit(flatten6(restore(join2(processingFiber))), exitMatch({
    onFailure: (cause3) => {
      onInterruptSignal();
      const target2 = residual.length + 1;
      const concurrency = Math.min(typeof n === "number" ? n : residual.length, residual.length);
      const toPop = Array.from(residual);
      return async_((cb) => {
        let count4 = 0;
        let index = 0;
        const check3 = (index2, hitNext) => (exit4) => {
          count4++;
          if (count4 === target2) {
            cb(exitSucceed(exitFailCause(cause3)));
          }
          if (toPop.length > 0 && hitNext) {
            next4();
          }
        };
        const next4 = () => {
          runFiber(toPop.pop(), true).addObserver(check3(index, true));
          index++;
        };
        processingFiber.addObserver(check3(index, false));
        index++;
        for (let i = 0; i < concurrency; i++) {
          next4();
        }
      });
    },
    onSuccess: () => forEachSequential(joinOrder, (f2) => f2.inheritAll)
  })));
})));
var forEachParN = (self, n, f, batching) => suspend(() => {
  const as13 = fromIterable2(self);
  const array4 = new Array(as13.length);
  const fn2 = (a, i) => map10(f(a, i), (b) => array4[i] = b);
  return zipRight2(forEachConcurrentDiscard(as13, fn2, batching, false, n), succeed(array4));
});
var fork = (self) => withFiberRuntime((state, status3) => succeed(unsafeFork2(self, state, status3.runtimeFlags)));
var forkDaemon = (self) => forkWithScopeOverride(self, globalScope);
var forkWithErrorHandler = /* @__PURE__ */ dual(2, (self, handler) => fork(onError(self, (cause3) => {
  const either7 = failureOrCause(cause3);
  switch (either7._tag) {
    case "Left":
      return handler(either7.left);
    case "Right":
      return failCause(either7.right);
  }
})));
var unsafeFork2 = (effect3, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childFiber = unsafeMakeChildFiber(effect3, parentFiber, parentRuntimeFlags, overrideScope);
  childFiber.resume(effect3);
  return childFiber;
};
var unsafeForkUnstarted = (effect3, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childFiber = unsafeMakeChildFiber(effect3, parentFiber, parentRuntimeFlags, overrideScope);
  return childFiber;
};
var unsafeMakeChildFiber = (effect3, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childId = unsafeMake3();
  const parentFiberRefs = parentFiber.getFiberRefs();
  const childFiberRefs = forkAs(parentFiberRefs, childId);
  const childFiber = new FiberRuntime(childId, childFiberRefs, parentRuntimeFlags);
  const childContext = getOrDefault(childFiberRefs, currentContext);
  const supervisor = childFiber.currentSupervisor;
  supervisor.onStart(childContext, effect3, some2(parentFiber), childFiber);
  childFiber.addObserver((exit4) => supervisor.onEnd(exit4, childFiber));
  const parentScope = overrideScope !== null ? overrideScope : pipe(parentFiber.getFiberRef(currentForkScopeOverride), getOrElse(() => parentFiber.scope()));
  parentScope.add(parentRuntimeFlags, childFiber);
  return childFiber;
};
var forkWithScopeOverride = (self, scopeOverride) => withFiberRuntime((parentFiber, parentStatus) => succeed(unsafeFork2(self, parentFiber, parentStatus.runtimeFlags, scopeOverride)));
var mergeAll3 = /* @__PURE__ */ dual((args2) => isFunction2(args2[2]), (elements, zero2, f, options) => matchSimple(options?.concurrency, () => fromIterable2(elements).reduce((acc, a, i) => zipWith3(acc, a, (acc2, a2) => f(acc2, a2, i)), succeed(zero2)), () => flatMap7(make29(zero2), (acc) => flatMap7(forEach7(elements, (effect3, i) => flatMap7(effect3, (a) => update3(acc, (b) => f(b, a, i))), options), () => get12(acc)))));
var partition3 = /* @__PURE__ */ dual((args2) => isIterable(args2[0]), (elements, f, options) => pipe(forEach7(elements, (a, i) => either2(f(a, i)), options), map10((chunk3) => partitionMap3(chunk3, identity))));
var validateAll = /* @__PURE__ */ dual((args2) => isIterable(args2[0]), (elements, f, options) => flatMap7(partition3(elements, f, {
  concurrency: options?.concurrency,
  batching: options?.batching,
  concurrentFinalizers: options?.concurrentFinalizers
}), ([es, bs]) => isNonEmptyArray2(es) ? fail2(es) : options?.discard ? void_2 : succeed(bs)));
var raceAll = (all8) => withFiberRuntime((state, status3) => async_((resume2) => {
  const fibers = /* @__PURE__ */ new Set();
  let winner;
  let failures3 = empty16;
  const interruptAll3 = () => {
    for (const fiber of fibers) {
      fiber.unsafeInterruptAsFork(state.id());
    }
  };
  let latch = false;
  let empty33 = true;
  for (const self of all8) {
    empty33 = false;
    const fiber = unsafeFork2(interruptible2(self), state, status3.runtimeFlags);
    fibers.add(fiber);
    fiber.addObserver((exit4) => {
      fibers.delete(fiber);
      if (!winner) {
        if (exit4._tag === "Success") {
          latch = true;
          winner = fiber;
          failures3 = empty16;
          interruptAll3();
        } else {
          failures3 = parallel(exit4.cause, failures3);
        }
      }
      if (latch && fibers.size === 0) {
        resume2(winner ? zipRight2(inheritAll(winner), winner.unsafePoll()) : failCause(failures3));
      }
    });
    if (winner) break;
  }
  if (empty33) {
    return resume2(dieSync(() => new IllegalArgumentException(`Received an empty collection of effects`)));
  }
  latch = true;
  return interruptAllAs(fibers, state.id());
}));
var reduceEffect = /* @__PURE__ */ dual((args2) => isIterable(args2[0]) && !isEffect(args2[0]), (elements, zero2, f, options) => matchSimple(options?.concurrency, () => fromIterable2(elements).reduce((acc, a, i) => zipWith3(acc, a, (acc2, a2) => f(acc2, a2, i)), zero2), () => suspend(() => pipe(mergeAll3([zero2, ...elements], none2(), (acc, elem, i) => {
  switch (acc._tag) {
    case "None": {
      return some2(elem);
    }
    case "Some": {
      return some2(f(acc.value, elem, i));
    }
  }
}, options), map10((option3) => {
  switch (option3._tag) {
    case "None": {
      throw new Error("BUG: Effect.reduceEffect - please report an issue at https://github.com/Effect-TS/effect/issues");
    }
    case "Some": {
      return option3.value;
    }
  }
})))));
var parallelFinalizers = (self) => contextWithEffect((context7) => match2(getOption2(context7, scopeTag), {
  onNone: () => self,
  onSome: (scope5) => {
    switch (scope5.strategy._tag) {
      case "Parallel":
        return self;
      case "Sequential":
      case "ParallelN":
        return flatMap7(scopeFork(scope5, parallel3), (inner) => scopeExtend(self, inner));
    }
  }
}));
var parallelNFinalizers = (parallelism) => (self) => contextWithEffect((context7) => match2(getOption2(context7, scopeTag), {
  onNone: () => self,
  onSome: (scope5) => {
    if (scope5.strategy._tag === "ParallelN" && scope5.strategy.parallelism === parallelism) {
      return self;
    }
    return flatMap7(scopeFork(scope5, parallelN2(parallelism)), (inner) => scopeExtend(self, inner));
  }
}));
var finalizersMask = (strategy) => (self) => finalizersMaskInternal(strategy, true)(self);
var finalizersMaskInternal = (strategy, concurrentFinalizers) => (self) => contextWithEffect((context7) => match2(getOption2(context7, scopeTag), {
  onNone: () => self(identity),
  onSome: (scope5) => {
    if (concurrentFinalizers === true) {
      const patch9 = strategy._tag === "Parallel" ? parallelFinalizers : strategy._tag === "Sequential" ? sequentialFinalizers : parallelNFinalizers(strategy.parallelism);
      switch (scope5.strategy._tag) {
        case "Parallel":
          return patch9(self(parallelFinalizers));
        case "Sequential":
          return patch9(self(sequentialFinalizers));
        case "ParallelN":
          return patch9(self(parallelNFinalizers(scope5.strategy.parallelism)));
      }
    } else {
      return self(identity);
    }
  }
}));
var scopeWith = (f) => flatMap7(scopeTag, f);
var scopedWith = (f) => flatMap7(scopeMake(), (scope5) => onExit(f(scope5), (exit4) => scope5.close(exit4)));
var scopedEffect = (effect3) => flatMap7(scopeMake(), (scope5) => scopeUse(effect3, scope5));
var sequentialFinalizers = (self) => contextWithEffect((context7) => match2(getOption2(context7, scopeTag), {
  onNone: () => self,
  onSome: (scope5) => {
    switch (scope5.strategy._tag) {
      case "Sequential":
        return self;
      case "Parallel":
      case "ParallelN":
        return flatMap7(scopeFork(scope5, sequential3), (inner) => scopeExtend(self, inner));
    }
  }
}));
var tagMetricsScoped = (key, value) => labelMetricsScoped([make30(key, value)]);
var labelMetricsScoped = (labels) => fiberRefLocallyScopedWith(currentMetricLabels, (old) => union(old, labels));
var using = /* @__PURE__ */ dual(2, (self, use) => scopedWith((scope5) => flatMap7(scopeExtend(self, scope5), use)));
var validate = /* @__PURE__ */ dual((args2) => isEffect(args2[1]), (self, that, options) => validateWith(self, that, (a, b) => [a, b], options));
var validateWith = /* @__PURE__ */ dual((args2) => isEffect(args2[1]), (self, that, f, options) => flatten6(zipWithOptions(exit(self), exit(that), (ea, eb) => exitZipWith(ea, eb, {
  onSuccess: f,
  onFailure: (ca, cb) => options?.concurrent ? parallel(ca, cb) : sequential(ca, cb)
}), options)));
var validateFirst = /* @__PURE__ */ dual((args2) => isIterable(args2[0]), (elements, f, options) => flip(forEach7(elements, (a, i) => flip(f(a, i)), options)));
var withClockScoped = (c) => fiberRefLocallyScopedWith(currentServices, add2(clockTag, c));
var withRandomScoped = (value) => fiberRefLocallyScopedWith(currentServices, add2(randomTag, value));
var withConfigProviderScoped = (provider) => fiberRefLocallyScopedWith(currentServices, add2(configProviderTag, provider));
var withEarlyRelease = (self) => scopeWith((parent) => flatMap7(scopeFork(parent, sequential2), (child) => pipe(self, scopeExtend(child), map10((value) => [fiberIdWith((fiberId3) => scopeClose(child, exitInterrupt(fiberId3))), value]))));
var zipOptions = /* @__PURE__ */ dual((args2) => isEffect(args2[1]), (self, that, options) => zipWithOptions(self, that, (a, b) => [a, b], options));
var zipLeftOptions = /* @__PURE__ */ dual((args2) => isEffect(args2[1]), (self, that, options) => {
  if (options?.concurrent !== true && (options?.batching === void 0 || options.batching === false)) {
    return zipLeft2(self, that);
  }
  return zipWithOptions(self, that, (a, _) => a, options);
});
var zipRightOptions = /* @__PURE__ */ dual((args2) => isEffect(args2[1]), (self, that, options) => {
  if (options?.concurrent !== true && (options?.batching === void 0 || options.batching === false)) {
    return zipRight2(self, that);
  }
  return zipWithOptions(self, that, (_, b) => b, options);
});
var zipWithOptions = /* @__PURE__ */ dual((args2) => isEffect(args2[1]), (self, that, f, options) => map10(all5([self, that], {
  concurrency: options?.concurrent ? 2 : 1,
  batching: options?.batching,
  concurrentFinalizers: options?.concurrentFinalizers
}), ([a, a2]) => f(a, a2)));
var withRuntimeFlagsScoped = (update5) => {
  if (update5 === empty14) {
    return void_2;
  }
  return pipe(runtimeFlags, flatMap7((runtimeFlags2) => {
    const updatedRuntimeFlags = patch4(runtimeFlags2, update5);
    const revertRuntimeFlags = diff4(updatedRuntimeFlags, runtimeFlags2);
    return pipe(updateRuntimeFlags(update5), zipRight2(addFinalizer(() => updateRuntimeFlags(revertRuntimeFlags))), asVoid2);
  }), uninterruptible);
};
var scopeTag = /* @__PURE__ */ GenericTag("effect/Scope");
var scope = scopeTag;
var scopeUnsafeAddFinalizer = (scope5, fin) => {
  if (scope5.state._tag === "Open") {
    scope5.state.finalizers.set({}, fin);
  }
};
var ScopeImplProto = {
  [ScopeTypeId]: ScopeTypeId,
  [CloseableScopeTypeId]: CloseableScopeTypeId,
  pipe() {
    return pipeArguments(this, arguments);
  },
  fork(strategy) {
    return sync(() => {
      const newScope = scopeUnsafeMake(strategy);
      if (this.state._tag === "Closed") {
        newScope.state = this.state;
        return newScope;
      }
      const key = {};
      const fin = (exit4) => newScope.close(exit4);
      this.state.finalizers.set(key, fin);
      scopeUnsafeAddFinalizer(newScope, (_) => sync(() => {
        if (this.state._tag === "Open") {
          this.state.finalizers.delete(key);
        }
      }));
      return newScope;
    });
  },
  close(exit4) {
    return suspend(() => {
      if (this.state._tag === "Closed") {
        return void_2;
      }
      const finalizers = Array.from(this.state.finalizers.values()).reverse();
      this.state = {
        _tag: "Closed",
        exit: exit4
      };
      if (finalizers.length === 0) {
        return void_2;
      }
      return isSequential(this.strategy) ? pipe(forEachSequential(finalizers, (fin) => exit(fin(exit4))), flatMap7((results) => pipe(exitCollectAll(results), map2(exitAsVoid), getOrElse(() => exitVoid)))) : isParallel(this.strategy) ? pipe(forEachParUnbounded(finalizers, (fin) => exit(fin(exit4)), false), flatMap7((results) => pipe(exitCollectAll(results, {
        parallel: true
      }), map2(exitAsVoid), getOrElse(() => exitVoid)))) : pipe(forEachParN(finalizers, this.strategy.parallelism, (fin) => exit(fin(exit4)), false), flatMap7((results) => pipe(exitCollectAll(results, {
        parallel: true
      }), map2(exitAsVoid), getOrElse(() => exitVoid))));
    });
  },
  addFinalizer(fin) {
    return suspend(() => {
      if (this.state._tag === "Closed") {
        return fin(this.state.exit);
      }
      this.state.finalizers.set({}, fin);
      return void_2;
    });
  }
};
var scopeUnsafeMake = (strategy = sequential2) => {
  const scope5 = Object.create(ScopeImplProto);
  scope5.strategy = strategy;
  scope5.state = {
    _tag: "Open",
    finalizers: /* @__PURE__ */ new Map()
  };
  return scope5;
};
var scopeMake = (strategy = sequential2) => sync(() => scopeUnsafeMake(strategy));
var scopeExtend = /* @__PURE__ */ dual(2, (effect3, scope5) => mapInputContext(
  effect3,
  // @ts-expect-error
  merge3(make5(scopeTag, scope5))
));
var scopeUse = /* @__PURE__ */ dual(2, (effect3, scope5) => pipe(effect3, scopeExtend(scope5), onExit((exit4) => scope5.close(exit4))));
var fiberRefUnsafeMakeSupervisor = (initial) => fiberRefUnsafeMakePatch(initial, {
  differ: differ2,
  fork: empty25
});
var fiberRefLocallyScoped = /* @__PURE__ */ dual(2, (self, value) => asVoid2(acquireRelease(flatMap7(fiberRefGet(self), (oldValue) => as3(fiberRefSet(self, value), oldValue)), (oldValue) => fiberRefSet(self, oldValue))));
var fiberRefLocallyScopedWith = /* @__PURE__ */ dual(2, (self, f) => fiberRefGetWith(self, (a) => fiberRefLocallyScoped(self, f(a))));
var currentRuntimeFlags = /* @__PURE__ */ fiberRefUnsafeMakeRuntimeFlags(none5);
var currentSupervisor = /* @__PURE__ */ fiberRefUnsafeMakeSupervisor(none8);
var fiberAwaitAll = (fibers) => forEach7(fibers, _await2);
var fiberAll = (fibers) => {
  const _fiberAll = {
    ...CommitPrototype2,
    commit() {
      return join2(this);
    },
    [FiberTypeId]: fiberVariance2,
    id: () => fromIterable2(fibers).reduce((id3, fiber) => combine3(id3, fiber.id()), none4),
    await: exit(forEachParUnbounded(fibers, (fiber) => flatten6(fiber.await), false)),
    children: map10(forEachParUnbounded(fibers, (fiber) => fiber.children, false), flatten2),
    inheritAll: forEachSequentialDiscard(fibers, (fiber) => fiber.inheritAll),
    poll: map10(forEachSequential(fibers, (fiber) => fiber.poll), reduceRight(some2(exitSucceed(new Array())), (optionB, optionA) => {
      switch (optionA._tag) {
        case "None": {
          return none2();
        }
        case "Some": {
          switch (optionB._tag) {
            case "None": {
              return none2();
            }
            case "Some": {
              return some2(exitZipWith(optionA.value, optionB.value, {
                onSuccess: (a, chunk3) => [a, ...chunk3],
                onFailure: parallel
              }));
            }
          }
        }
      }
    })),
    interruptAsFork: (fiberId3) => forEachSequentialDiscard(fibers, (fiber) => fiber.interruptAsFork(fiberId3))
  };
  return _fiberAll;
};
var fiberInterruptFork = (self) => asVoid2(forkDaemon(interruptFiber(self)));
var fiberJoinAll = (fibers) => join2(fiberAll(fibers));
var fiberScoped = (self) => acquireRelease(succeed(self), interruptFiber);
var raceWith = /* @__PURE__ */ dual(3, (self, other, options) => raceFibersWith(self, other, {
  onSelfWin: (winner, loser) => flatMap7(winner.await, (exit4) => {
    switch (exit4._tag) {
      case OP_SUCCESS: {
        return flatMap7(winner.inheritAll, () => options.onSelfDone(exit4, loser));
      }
      case OP_FAILURE: {
        return options.onSelfDone(exit4, loser);
      }
    }
  }),
  onOtherWin: (winner, loser) => flatMap7(winner.await, (exit4) => {
    switch (exit4._tag) {
      case OP_SUCCESS: {
        return flatMap7(winner.inheritAll, () => options.onOtherDone(exit4, loser));
      }
      case OP_FAILURE: {
        return options.onOtherDone(exit4, loser);
      }
    }
  })
}));
var disconnect = (self) => uninterruptibleMask((restore) => fiberIdWith((fiberId3) => flatMap7(forkDaemon(restore(self)), (fiber) => pipe(restore(join2(fiber)), onInterrupt(() => pipe(fiber, interruptAsFork(fiberId3)))))));
var race = /* @__PURE__ */ dual(2, (self, that) => fiberIdWith((parentFiberId) => raceWith(self, that, {
  onSelfDone: (exit4, right3) => exitMatchEffect(exit4, {
    onFailure: (cause3) => pipe(join2(right3), mapErrorCause2((cause22) => parallel(cause3, cause22))),
    onSuccess: (value) => pipe(right3, interruptAsFiber(parentFiberId), as3(value))
  }),
  onOtherDone: (exit4, left3) => exitMatchEffect(exit4, {
    onFailure: (cause3) => pipe(join2(left3), mapErrorCause2((cause22) => parallel(cause22, cause3))),
    onSuccess: (value) => pipe(left3, interruptAsFiber(parentFiberId), as3(value))
  })
})));
var raceFibersWith = /* @__PURE__ */ dual(3, (self, other, options) => withFiberRuntime((parentFiber, parentStatus) => {
  const parentRuntimeFlags = parentStatus.runtimeFlags;
  const raceIndicator = make11(true);
  const leftFiber = unsafeMakeChildFiber(self, parentFiber, parentRuntimeFlags, options.selfScope);
  const rightFiber = unsafeMakeChildFiber(other, parentFiber, parentRuntimeFlags, options.otherScope);
  return async_((cb) => {
    leftFiber.addObserver(() => completeRace(leftFiber, rightFiber, options.onSelfWin, raceIndicator, cb));
    rightFiber.addObserver(() => completeRace(rightFiber, leftFiber, options.onOtherWin, raceIndicator, cb));
    leftFiber.startFork(self);
    rightFiber.startFork(other);
  }, combine3(leftFiber.id(), rightFiber.id()));
}));
var completeRace = (winner, loser, cont, ab, cb) => {
  if (compareAndSet(true, false)(ab)) {
    cb(cont(winner, loser));
  }
};
var ensuring = /* @__PURE__ */ dual(2, (self, finalizer2) => uninterruptibleMask((restore) => matchCauseEffect(restore(self), {
  onFailure: (cause1) => matchCauseEffect(finalizer2, {
    onFailure: (cause22) => failCause(sequential(cause1, cause22)),
    onSuccess: () => failCause(cause1)
  }),
  onSuccess: (a) => as3(finalizer2, a)
})));
var invokeWithInterrupt = (self, entries2, onInterrupt3) => fiberIdWith((id3) => flatMap7(flatMap7(forkDaemon(interruptible2(self)), (processing) => async_((cb) => {
  const counts = entries2.map((_) => _.listeners.count);
  const checkDone = () => {
    if (counts.every((count4) => count4 === 0)) {
      if (entries2.every((_) => {
        if (_.result.state.current._tag === "Pending") {
          return true;
        } else if (_.result.state.current._tag === "Done" && exitIsExit(_.result.state.current.effect) && _.result.state.current.effect._tag === "Failure" && isInterrupted(_.result.state.current.effect.cause)) {
          return true;
        } else {
          return false;
        }
      })) {
        cleanup.forEach((f) => f());
        onInterrupt3?.();
        cb(interruptFiber(processing));
      }
    }
  };
  processing.addObserver((exit4) => {
    cleanup.forEach((f) => f());
    cb(exit4);
  });
  const cleanup = entries2.map((r, i) => {
    const observer = (count4) => {
      counts[i] = count4;
      checkDone();
    };
    r.listeners.addObserver(observer);
    return () => r.listeners.removeObserver(observer);
  });
  checkDone();
  return sync(() => {
    cleanup.forEach((f) => f());
  });
})), () => suspend(() => {
  const residual = entries2.flatMap((entry) => {
    if (!entry.state.completed) {
      return [entry];
    }
    return [];
  });
  return forEachSequentialDiscard(residual, (entry) => complete2(entry.request, exitInterrupt(id3)));
})));
var makeSpanScoped = (name, options) => {
  options = addSpanStackTrace(options);
  return uninterruptible(withFiberRuntime((fiber) => {
    const scope5 = unsafeGet3(fiber.getFiberRef(currentContext), scopeTag);
    const span4 = unsafeMakeSpan(fiber, name, options);
    const timingEnabled = fiber.getFiberRef(currentTracerTimingEnabled);
    const clock_ = get3(fiber.getFiberRef(currentServices), clockTag);
    return as3(scopeAddFinalizerExit(scope5, (exit4) => endSpan(span4, exit4, clock_, timingEnabled)), span4);
  }));
};
var withTracerScoped = (value) => fiberRefLocallyScopedWith(currentServices, add2(tracerTag, value));
var withSpanScoped = function() {
  const dataFirst = typeof arguments[0] !== "string";
  const name = dataFirst ? arguments[1] : arguments[0];
  const options = addSpanStackTrace(dataFirst ? arguments[2] : arguments[1]);
  if (dataFirst) {
    const self = arguments[0];
    return flatMap7(makeSpanScoped(name, addSpanStackTrace(options)), (span4) => provideService(self, spanTag, span4));
  }
  return (self) => flatMap7(makeSpanScoped(name, addSpanStackTrace(options)), (span4) => provideService(self, spanTag, span4));
};

// node_modules/effect/dist/esm/internal/cache.js
var complete3 = (key, exit4, entryStats, timeToLiveMillis) => struct({
  _tag: "Complete",
  key,
  exit: exit4,
  entryStats,
  timeToLiveMillis
});
var pending2 = (key, deferred) => struct({
  _tag: "Pending",
  key,
  deferred
});
var refreshing = (deferred, complete4) => struct({
  _tag: "Refreshing",
  deferred,
  complete: complete4
});
var MapKeyTypeId = /* @__PURE__ */ Symbol.for("effect/Cache/MapKey");
var MapKeyImpl = class {
  current;
  [MapKeyTypeId] = MapKeyTypeId;
  previous = void 0;
  next = void 0;
  constructor(current) {
    this.current = current;
  }
  [symbol]() {
    return pipe(hash(this.current), combine(hash(this.previous)), combine(hash(this.next)), cached(this));
  }
  [symbol2](that) {
    if (this === that) {
      return true;
    }
    return isMapKey(that) && equals(this.current, that.current) && equals(this.previous, that.previous) && equals(this.next, that.next);
  }
};
var makeMapKey = (current) => new MapKeyImpl(current);
var isMapKey = (u) => hasProperty(u, MapKeyTypeId);
var KeySetImpl = class {
  head = void 0;
  tail = void 0;
  add(key) {
    if (key !== this.tail) {
      if (this.tail === void 0) {
        this.head = key;
        this.tail = key;
      } else {
        const previous = key.previous;
        const next4 = key.next;
        if (next4 !== void 0) {
          key.next = void 0;
          if (previous !== void 0) {
            previous.next = next4;
            next4.previous = previous;
          } else {
            this.head = next4;
            this.head.previous = void 0;
          }
        }
        this.tail.next = key;
        key.previous = this.tail;
        this.tail = key;
      }
    }
  }
  remove() {
    const key = this.head;
    if (key !== void 0) {
      const next4 = key.next;
      if (next4 !== void 0) {
        key.next = void 0;
        this.head = next4;
        this.head.previous = void 0;
      } else {
        this.head = void 0;
        this.tail = void 0;
      }
    }
    return key;
  }
};
var makeKeySet = () => new KeySetImpl();
var makeCacheState = (map25, keys5, accesses, updating, hits, misses) => ({
  map: map25,
  keys: keys5,
  accesses,
  updating,
  hits,
  misses
});
var initialCacheState = () => makeCacheState(empty17(), makeKeySet(), unbounded(), make11(false), 0, 0);
var CacheSymbolKey = "effect/Cache";
var CacheTypeId = /* @__PURE__ */ Symbol.for(CacheSymbolKey);
var cacheVariance = {
  /* c8 ignore next */
  _Key: (_) => _,
  /* c8 ignore next */
  _Error: (_) => _,
  /* c8 ignore next */
  _Value: (_) => _
};
var ConsumerCacheSymbolKey = "effect/ConsumerCache";
var ConsumerCacheTypeId = /* @__PURE__ */ Symbol.for(ConsumerCacheSymbolKey);
var consumerCacheVariance = {
  /* c8 ignore next */
  _Key: (_) => _,
  /* c8 ignore next */
  _Error: (_) => _,
  /* c8 ignore next */
  _Value: (_) => _
};
var makeCacheStats = (options) => options;
var makeEntryStats = (loadedMillis) => ({
  loadedMillis
});
var CacheImpl = class {
  capacity;
  context;
  fiberId;
  lookup;
  timeToLive;
  [CacheTypeId] = cacheVariance;
  [ConsumerCacheTypeId] = consumerCacheVariance;
  cacheState;
  constructor(capacity3, context7, fiberId3, lookup, timeToLive) {
    this.capacity = capacity3;
    this.context = context7;
    this.fiberId = fiberId3;
    this.lookup = lookup;
    this.timeToLive = timeToLive;
    this.cacheState = initialCacheState();
  }
  get(key) {
    return map10(this.getEither(key), merge);
  }
  get cacheStats() {
    return sync(() => makeCacheStats({
      hits: this.cacheState.hits,
      misses: this.cacheState.misses,
      size: size5(this.cacheState.map)
    }));
  }
  getOption(key) {
    return suspend(() => match2(get8(this.cacheState.map, key), {
      onNone: () => {
        const mapKey = makeMapKey(key);
        this.trackAccess(mapKey);
        this.trackMiss();
        return succeed(none2());
      },
      onSome: (value) => this.resolveMapValue(value)
    }));
  }
  getOptionComplete(key) {
    return suspend(() => match2(get8(this.cacheState.map, key), {
      onNone: () => {
        const mapKey = makeMapKey(key);
        this.trackAccess(mapKey);
        this.trackMiss();
        return succeed(none2());
      },
      onSome: (value) => this.resolveMapValue(value, true)
    }));
  }
  contains(key) {
    return sync(() => has4(this.cacheState.map, key));
  }
  entryStats(key) {
    return sync(() => {
      const option3 = get8(this.cacheState.map, key);
      if (isSome2(option3)) {
        switch (option3.value._tag) {
          case "Complete": {
            const loaded = option3.value.entryStats.loadedMillis;
            return some2(makeEntryStats(loaded));
          }
          case "Pending": {
            return none2();
          }
          case "Refreshing": {
            const loaded = option3.value.complete.entryStats.loadedMillis;
            return some2(makeEntryStats(loaded));
          }
        }
      }
      return none2();
    });
  }
  getEither(key) {
    return suspend(() => {
      const k = key;
      let mapKey = void 0;
      let deferred = void 0;
      let value = getOrUndefined(get8(this.cacheState.map, k));
      if (value === void 0) {
        deferred = unsafeMake4(this.fiberId);
        mapKey = makeMapKey(k);
        if (has4(this.cacheState.map, k)) {
          value = getOrUndefined(get8(this.cacheState.map, k));
        } else {
          set4(this.cacheState.map, k, pending2(mapKey, deferred));
        }
      }
      if (value === void 0) {
        this.trackAccess(mapKey);
        this.trackMiss();
        return map10(this.lookupValueOf(key, deferred), right2);
      } else {
        return flatMap7(this.resolveMapValue(value), match2({
          onNone: () => this.getEither(key),
          onSome: (value2) => succeed(left2(value2))
        }));
      }
    });
  }
  invalidate(key) {
    return sync(() => {
      remove5(this.cacheState.map, key);
    });
  }
  invalidateWhen(key, when4) {
    return sync(() => {
      const value = get8(this.cacheState.map, key);
      if (isSome2(value) && value.value._tag === "Complete") {
        if (value.value.exit._tag === "Success") {
          if (when4(value.value.exit.value)) {
            remove5(this.cacheState.map, key);
          }
        }
      }
    });
  }
  get invalidateAll() {
    return sync(() => {
      this.cacheState.map = empty17();
    });
  }
  refresh(key) {
    return clockWith3((clock3) => suspend(() => {
      const k = key;
      const deferred = unsafeMake4(this.fiberId);
      let value = getOrUndefined(get8(this.cacheState.map, k));
      if (value === void 0) {
        if (has4(this.cacheState.map, k)) {
          value = getOrUndefined(get8(this.cacheState.map, k));
        } else {
          set4(this.cacheState.map, k, pending2(makeMapKey(k), deferred));
        }
      }
      if (value === void 0) {
        return asVoid2(this.lookupValueOf(key, deferred));
      } else {
        switch (value._tag) {
          case "Complete": {
            if (this.hasExpired(clock3, value.timeToLiveMillis)) {
              const found = getOrUndefined(get8(this.cacheState.map, k));
              if (equals(found, value)) {
                remove5(this.cacheState.map, k);
              }
              return asVoid2(this.get(key));
            }
            return pipe(this.lookupValueOf(key, deferred), when(() => {
              const current = getOrUndefined(get8(this.cacheState.map, k));
              if (equals(current, value)) {
                const mapValue = refreshing(deferred, value);
                set4(this.cacheState.map, k, mapValue);
                return true;
              }
              return false;
            }), asVoid2);
          }
          case "Pending": {
            return _await(value.deferred);
          }
          case "Refreshing": {
            return _await(value.deferred);
          }
        }
      }
    }));
  }
  set(key, value) {
    return clockWith3((clock3) => sync(() => {
      const now = clock3.unsafeCurrentTimeMillis();
      const k = key;
      const lookupResult = succeed3(value);
      const mapValue = complete3(makeMapKey(k), lookupResult, makeEntryStats(now), now + toMillis(decode(this.timeToLive(lookupResult))));
      set4(this.cacheState.map, k, mapValue);
    }));
  }
  get size() {
    return sync(() => {
      return size5(this.cacheState.map);
    });
  }
  get values() {
    return sync(() => {
      const values3 = [];
      for (const entry of this.cacheState.map) {
        if (entry[1]._tag === "Complete" && entry[1].exit._tag === "Success") {
          values3.push(entry[1].exit.value);
        }
      }
      return values3;
    });
  }
  get entries() {
    return sync(() => {
      const values3 = [];
      for (const entry of this.cacheState.map) {
        if (entry[1]._tag === "Complete" && entry[1].exit._tag === "Success") {
          values3.push([entry[0], entry[1].exit.value]);
        }
      }
      return values3;
    });
  }
  get keys() {
    return sync(() => {
      const keys5 = [];
      for (const entry of this.cacheState.map) {
        if (entry[1]._tag === "Complete" && entry[1].exit._tag === "Success") {
          keys5.push(entry[0]);
        }
      }
      return keys5;
    });
  }
  resolveMapValue(value, ignorePending = false) {
    return clockWith3((clock3) => {
      switch (value._tag) {
        case "Complete": {
          this.trackAccess(value.key);
          if (this.hasExpired(clock3, value.timeToLiveMillis)) {
            remove5(this.cacheState.map, value.key.current);
            return succeed(none2());
          }
          this.trackHit();
          return map10(value.exit, some2);
        }
        case "Pending": {
          this.trackAccess(value.key);
          this.trackHit();
          if (ignorePending) {
            return succeed(none2());
          }
          return map10(_await(value.deferred), some2);
        }
        case "Refreshing": {
          this.trackAccess(value.complete.key);
          this.trackHit();
          if (this.hasExpired(clock3, value.complete.timeToLiveMillis)) {
            if (ignorePending) {
              return succeed(none2());
            }
            return map10(_await(value.deferred), some2);
          }
          return map10(value.complete.exit, some2);
        }
      }
    });
  }
  trackHit() {
    this.cacheState.hits = this.cacheState.hits + 1;
  }
  trackMiss() {
    this.cacheState.misses = this.cacheState.misses + 1;
  }
  trackAccess(key) {
    offer(this.cacheState.accesses, key);
    if (compareAndSet(this.cacheState.updating, false, true)) {
      let loop3 = true;
      while (loop3) {
        const key2 = poll2(this.cacheState.accesses, EmptyMutableQueue);
        if (key2 === EmptyMutableQueue) {
          loop3 = false;
        } else {
          this.cacheState.keys.add(key2);
        }
      }
      let size13 = size5(this.cacheState.map);
      loop3 = size13 > this.capacity;
      while (loop3) {
        const key2 = this.cacheState.keys.remove();
        if (key2 !== void 0) {
          if (has4(this.cacheState.map, key2.current)) {
            remove5(this.cacheState.map, key2.current);
            size13 = size13 - 1;
            loop3 = size13 > this.capacity;
          }
        } else {
          loop3 = false;
        }
      }
      set2(this.cacheState.updating, false);
    }
  }
  hasExpired(clock3, timeToLiveMillis) {
    return clock3.unsafeCurrentTimeMillis() > timeToLiveMillis;
  }
  lookupValueOf(input, deferred) {
    return clockWith3((clock3) => suspend(() => {
      const key = input;
      return pipe(this.lookup(input), provideContext(this.context), exit, flatMap7((exit4) => {
        const now = clock3.unsafeCurrentTimeMillis();
        const stats = makeEntryStats(now);
        const value = complete3(makeMapKey(key), exit4, stats, now + toMillis(decode(this.timeToLive(exit4))));
        set4(this.cacheState.map, key, value);
        return zipRight2(done2(deferred, exit4), exit4);
      }), onInterrupt(() => zipRight2(interrupt3(deferred), sync(() => {
        remove5(this.cacheState.map, key);
      }))));
    }));
  }
};
var unsafeMakeWith = (capacity3, lookup, timeToLive) => new CacheImpl(capacity3, empty3(), none3, lookup, (exit4) => decode(timeToLive(exit4)));

// node_modules/effect/dist/esm/Cause.js
var Cause_exports = {};
__export(Cause_exports, {
  CauseTypeId: () => CauseTypeId2,
  ExceededCapacityException: () => ExceededCapacityException2,
  ExceededCapacityExceptionTypeId: () => ExceededCapacityExceptionTypeId2,
  IllegalArgumentException: () => IllegalArgumentException2,
  IllegalArgumentExceptionTypeId: () => IllegalArgumentExceptionTypeId2,
  InterruptedException: () => InterruptedException2,
  InterruptedExceptionTypeId: () => InterruptedExceptionTypeId2,
  InvalidPubSubCapacityExceptionTypeId: () => InvalidPubSubCapacityExceptionTypeId2,
  NoSuchElementException: () => NoSuchElementException2,
  NoSuchElementExceptionTypeId: () => NoSuchElementExceptionTypeId2,
  RuntimeException: () => RuntimeException2,
  RuntimeExceptionTypeId: () => RuntimeExceptionTypeId2,
  TimeoutException: () => TimeoutException2,
  TimeoutExceptionTypeId: () => TimeoutExceptionTypeId2,
  UnknownException: () => UnknownException2,
  UnknownExceptionTypeId: () => UnknownExceptionTypeId2,
  YieldableError: () => YieldableError2,
  andThen: () => andThen5,
  as: () => as6,
  contains: () => contains4,
  defects: () => defects2,
  die: () => die5,
  dieOption: () => dieOption2,
  empty: () => empty26,
  fail: () => fail6,
  failureOption: () => failureOption2,
  failureOrCause: () => failureOrCause2,
  failures: () => failures2,
  filter: () => filter8,
  find: () => find2,
  flatMap: () => flatMap10,
  flatten: () => flatten8,
  flipCauseOption: () => flipCauseOption2,
  interrupt: () => interrupt5,
  interruptOption: () => interruptOption2,
  interruptors: () => interruptors2,
  isCause: () => isCause2,
  isDie: () => isDie2,
  isDieType: () => isDieType2,
  isEmpty: () => isEmpty8,
  isEmptyType: () => isEmptyType2,
  isExceededCapacityException: () => isExceededCapacityException2,
  isFailType: () => isFailType2,
  isFailure: () => isFailure4,
  isIllegalArgumentException: () => isIllegalArgumentException2,
  isInterruptType: () => isInterruptType2,
  isInterrupted: () => isInterrupted3,
  isInterruptedException: () => isInterruptedException2,
  isInterruptedOnly: () => isInterruptedOnly2,
  isNoSuchElementException: () => isNoSuchElementException2,
  isParallelType: () => isParallelType2,
  isRuntimeException: () => isRuntimeException2,
  isSequentialType: () => isSequentialType2,
  isTimeoutException: () => isTimeoutException2,
  isUnknownException: () => isUnknownException2,
  keepDefects: () => keepDefects2,
  linearize: () => linearize2,
  map: () => map14,
  match: () => match11,
  originalError: () => originalError,
  parallel: () => parallel4,
  pretty: () => pretty3,
  prettyErrors: () => prettyErrors2,
  reduce: () => reduce11,
  reduceWithContext: () => reduceWithContext2,
  sequential: () => sequential4,
  size: () => size8,
  squash: () => squash,
  squashWith: () => squashWith,
  stripFailures: () => stripFailures2,
  stripSomeDefects: () => stripSomeDefects2
});
var CauseTypeId2 = CauseTypeId;
var RuntimeExceptionTypeId2 = RuntimeExceptionTypeId;
var InterruptedExceptionTypeId2 = InterruptedExceptionTypeId;
var IllegalArgumentExceptionTypeId2 = IllegalArgumentExceptionTypeId;
var NoSuchElementExceptionTypeId2 = NoSuchElementExceptionTypeId;
var InvalidPubSubCapacityExceptionTypeId2 = InvalidPubSubCapacityExceptionTypeId;
var ExceededCapacityExceptionTypeId2 = ExceededCapacityExceptionTypeId;
var TimeoutExceptionTypeId2 = TimeoutExceptionTypeId;
var UnknownExceptionTypeId2 = UnknownExceptionTypeId;
var YieldableError2 = YieldableError;
var empty26 = empty16;
var fail6 = fail;
var die5 = die;
var interrupt5 = interrupt;
var parallel4 = parallel;
var sequential4 = sequential;
var isCause2 = isCause;
var isEmptyType2 = isEmptyType;
var isFailType2 = isFailType;
var isDieType2 = isDieType;
var isInterruptType2 = isInterruptType;
var isSequentialType2 = isSequentialType;
var isParallelType2 = isParallelType;
var size8 = size4;
var isEmpty8 = isEmpty5;
var isFailure4 = isFailure;
var isDie2 = isDie;
var isInterrupted3 = isInterrupted;
var isInterruptedOnly2 = isInterruptedOnly;
var failures2 = failures;
var defects2 = defects;
var interruptors2 = interruptors;
var failureOption2 = failureOption;
var failureOrCause2 = failureOrCause;
var flipCauseOption2 = flipCauseOption;
var dieOption2 = dieOption;
var interruptOption2 = interruptOption;
var keepDefects2 = keepDefects;
var linearize2 = linearize;
var stripFailures2 = stripFailures;
var stripSomeDefects2 = stripSomeDefects;
var as6 = as2;
var map14 = map9;
var flatMap10 = flatMap6;
var andThen5 = andThen3;
var flatten8 = flatten5;
var contains4 = contains3;
var squash = causeSquash;
var squashWith = causeSquashWith;
var find2 = find;
var filter8 = filter6;
var match11 = match5;
var reduce11 = reduce8;
var reduceWithContext2 = reduceWithContext;
var InterruptedException2 = InterruptedException;
var isInterruptedException2 = isInterruptedException;
var IllegalArgumentException2 = IllegalArgumentException;
var isIllegalArgumentException2 = isIllegalArgumentException;
var NoSuchElementException2 = NoSuchElementException;
var isNoSuchElementException2 = isNoSuchElementException;
var RuntimeException2 = RuntimeException;
var isRuntimeException2 = isRuntimeException;
var TimeoutException2 = TimeoutException;
var isTimeoutException2 = isTimeoutException;
var UnknownException2 = UnknownException;
var isUnknownException2 = isUnknownException;
var ExceededCapacityException2 = ExceededCapacityException;
var isExceededCapacityException2 = isExceededCapacityException;
var pretty3 = pretty;
var prettyErrors2 = prettyErrors;
var originalError = originalInstance;

// node_modules/effect/dist/esm/Effect.js
var Effect_exports = {};
__export(Effect_exports, {
  Do: () => Do3,
  EffectTypeId: () => EffectTypeId3,
  Service: () => Service,
  Tag: () => Tag3,
  acquireRelease: () => acquireRelease2,
  acquireReleaseInterruptible: () => acquireReleaseInterruptible2,
  acquireUseRelease: () => acquireUseRelease2,
  addFinalizer: () => addFinalizer3,
  all: () => all7,
  allSuccesses: () => allSuccesses2,
  allWith: () => allWith2,
  allowInterrupt: () => allowInterrupt2,
  andThen: () => andThen7,
  annotateCurrentSpan: () => annotateCurrentSpan2,
  annotateLogs: () => annotateLogs3,
  annotateLogsScoped: () => annotateLogsScoped2,
  annotateSpans: () => annotateSpans3,
  ap: () => ap2,
  as: () => as8,
  asSome: () => asSome2,
  asSomeError: () => asSomeError2,
  asVoid: () => asVoid5,
  async: () => async2,
  asyncEffect: () => asyncEffect2,
  awaitAllChildren: () => awaitAllChildren2,
  bind: () => bind4,
  bindAll: () => bindAll2,
  bindTo: () => bindTo4,
  blocked: () => blocked2,
  cacheRequestResult: () => cacheRequestResult,
  cached: () => cached3,
  cachedFunction: () => cachedFunction2,
  cachedInvalidateWithTTL: () => cachedInvalidateWithTTL2,
  cachedWithTTL: () => cachedWithTTL,
  catch: () => _catch2,
  catchAll: () => catchAll3,
  catchAllCause: () => catchAllCause3,
  catchAllDefect: () => catchAllDefect2,
  catchIf: () => catchIf2,
  catchSome: () => catchSome2,
  catchSomeCause: () => catchSomeCause2,
  catchSomeDefect: () => catchSomeDefect2,
  catchTag: () => catchTag2,
  catchTags: () => catchTags2,
  cause: () => cause2,
  checkInterruptible: () => checkInterruptible2,
  clock: () => clock2,
  clockWith: () => clockWith4,
  configProviderWith: () => configProviderWith2,
  console: () => console3,
  consoleWith: () => consoleWith2,
  context: () => context3,
  contextWith: () => contextWith2,
  contextWithEffect: () => contextWithEffect2,
  currentParentSpan: () => currentParentSpan2,
  currentSpan: () => currentSpan2,
  custom: () => custom2,
  daemonChildren: () => daemonChildren2,
  delay: () => delay2,
  descriptor: () => descriptor2,
  descriptorWith: () => descriptorWith2,
  die: () => die7,
  dieMessage: () => dieMessage2,
  dieSync: () => dieSync4,
  diffFiberRefs: () => diffFiberRefs2,
  disconnect: () => disconnect2,
  dropUntil: () => dropUntil2,
  dropWhile: () => dropWhile2,
  either: () => either4,
  ensureErrorType: () => ensureErrorType,
  ensureRequirementsType: () => ensureRequirementsType,
  ensureSuccessType: () => ensureSuccessType,
  ensuring: () => ensuring3,
  ensuringChild: () => ensuringChild2,
  ensuringChildren: () => ensuringChildren2,
  eventually: () => eventually2,
  every: () => every5,
  exists: () => exists4,
  exit: () => exit3,
  fail: () => fail10,
  failCause: () => failCause9,
  failCauseSync: () => failCauseSync4,
  failSync: () => failSync4,
  fiberId: () => fiberId2,
  fiberIdWith: () => fiberIdWith2,
  filter: () => filter9,
  filterEffectOrElse: () => filterEffectOrElse2,
  filterEffectOrFail: () => filterEffectOrFail2,
  filterMap: () => filterMap5,
  filterOrDie: () => filterOrDie2,
  filterOrDieMessage: () => filterOrDieMessage2,
  filterOrElse: () => filterOrElse2,
  filterOrFail: () => filterOrFail2,
  finalizersMask: () => finalizersMask2,
  findFirst: () => findFirst5,
  firstSuccessOf: () => firstSuccessOf2,
  flatMap: () => flatMap12,
  flatten: () => flatten10,
  flip: () => flip2,
  flipWith: () => flipWith2,
  fn: () => fn,
  fnUntraced: () => fnUntraced2,
  forEach: () => forEach8,
  forever: () => forever3,
  fork: () => fork3,
  forkAll: () => forkAll2,
  forkDaemon: () => forkDaemon2,
  forkIn: () => forkIn2,
  forkScoped: () => forkScoped2,
  forkWithErrorHandler: () => forkWithErrorHandler2,
  fromFiber: () => fromFiber2,
  fromFiberEffect: () => fromFiberEffect2,
  fromNullable: () => fromNullable3,
  functionWithSpan: () => functionWithSpan2,
  gen: () => gen3,
  getFiberRefs: () => getFiberRefs,
  getRuntimeFlags: () => getRuntimeFlags,
  head: () => head4,
  if: () => if_2,
  ignore: () => ignore2,
  ignoreLogged: () => ignoreLogged2,
  inheritFiberRefs: () => inheritFiberRefs2,
  interrupt: () => interrupt7,
  interruptWith: () => interruptWith3,
  interruptible: () => interruptible4,
  interruptibleMask: () => interruptibleMask2,
  intoDeferred: () => intoDeferred2,
  isEffect: () => isEffect2,
  isFailure: () => isFailure5,
  isSuccess: () => isSuccess3,
  iterate: () => iterate2,
  labelMetrics: () => labelMetrics2,
  labelMetricsScoped: () => labelMetricsScoped2,
  let: () => let_4,
  liftPredicate: () => liftPredicate3,
  linkSpanCurrent: () => linkSpanCurrent2,
  linkSpans: () => linkSpans2,
  locally: () => locally,
  locallyScoped: () => locallyScoped,
  locallyScopedWith: () => locallyScopedWith,
  locallyWith: () => locallyWith,
  log: () => log2,
  logAnnotations: () => logAnnotations2,
  logDebug: () => logDebug2,
  logError: () => logError2,
  logFatal: () => logFatal2,
  logInfo: () => logInfo2,
  logTrace: () => logTrace2,
  logWarning: () => logWarning2,
  logWithLevel: () => logWithLevel2,
  loop: () => loop2,
  makeLatch: () => makeLatch2,
  makeSemaphore: () => makeSemaphore2,
  makeSpan: () => makeSpan2,
  makeSpanScoped: () => makeSpanScoped2,
  map: () => map18,
  mapAccum: () => mapAccum3,
  mapBoth: () => mapBoth4,
  mapError: () => mapError4,
  mapErrorCause: () => mapErrorCause3,
  mapInputContext: () => mapInputContext3,
  match: () => match15,
  matchCause: () => matchCause4,
  matchCauseEffect: () => matchCauseEffect3,
  matchEffect: () => matchEffect3,
  merge: () => merge7,
  mergeAll: () => mergeAll5,
  metricLabels: () => metricLabels2,
  negate: () => negate2,
  never: () => never4,
  none: () => none9,
  onError: () => onError2,
  onExit: () => onExit3,
  onInterrupt: () => onInterrupt2,
  once: () => once3,
  option: () => option2,
  optionFromOptional: () => optionFromOptional2,
  orDie: () => orDie3,
  orDieWith: () => orDieWith2,
  orElse: () => orElse6,
  orElseFail: () => orElseFail2,
  orElseSucceed: () => orElseSucceed2,
  parallelErrors: () => parallelErrors2,
  parallelFinalizers: () => parallelFinalizers2,
  partition: () => partition4,
  patchFiberRefs: () => patchFiberRefs2,
  patchRuntimeFlags: () => patchRuntimeFlags,
  promise: () => promise2,
  provide: () => provide2,
  provideService: () => provideService4,
  provideServiceEffect: () => provideServiceEffect2,
  race: () => race2,
  raceAll: () => raceAll2,
  raceFirst: () => raceFirst2,
  raceWith: () => raceWith2,
  random: () => random3,
  randomWith: () => randomWith2,
  reduce: () => reduce13,
  reduceEffect: () => reduceEffect3,
  reduceRight: () => reduceRight3,
  reduceWhile: () => reduceWhile2,
  repeat: () => repeat,
  repeatN: () => repeatN2,
  repeatOrElse: () => repeatOrElse,
  replicate: () => replicate2,
  replicateEffect: () => replicateEffect2,
  request: () => request,
  retry: () => retry2,
  retryOrElse: () => retryOrElse,
  runCallback: () => runCallback,
  runFork: () => runFork2,
  runPromise: () => runPromise,
  runPromiseExit: () => runPromiseExit,
  runRequestBlock: () => runRequestBlock2,
  runSync: () => runSync,
  runSyncExit: () => runSyncExit,
  runtime: () => runtime3,
  sandbox: () => sandbox2,
  schedule: () => schedule,
  scheduleForked: () => scheduleForked2,
  scheduleFrom: () => scheduleFrom,
  scope: () => scope3,
  scopeWith: () => scopeWith2,
  scoped: () => scoped3,
  scopedWith: () => scopedWith2,
  sequentialFinalizers: () => sequentialFinalizers2,
  serviceConstants: () => serviceConstants2,
  serviceFunction: () => serviceFunction2,
  serviceFunctionEffect: () => serviceFunctionEffect2,
  serviceFunctions: () => serviceFunctions2,
  serviceMembers: () => serviceMembers2,
  serviceOption: () => serviceOption2,
  serviceOptional: () => serviceOptional2,
  setFiberRefs: () => setFiberRefs2,
  sleep: () => sleep4,
  spanAnnotations: () => spanAnnotations2,
  spanLinks: () => spanLinks2,
  step: () => step3,
  succeed: () => succeed10,
  succeedNone: () => succeedNone2,
  succeedSome: () => succeedSome2,
  summarized: () => summarized2,
  supervised: () => supervised2,
  suspend: () => suspend4,
  sync: () => sync6,
  tagMetrics: () => tagMetrics2,
  tagMetricsScoped: () => tagMetricsScoped2,
  takeUntil: () => takeUntil2,
  takeWhile: () => takeWhile2,
  tap: () => tap4,
  tapBoth: () => tapBoth2,
  tapDefect: () => tapDefect2,
  tapError: () => tapError3,
  tapErrorCause: () => tapErrorCause3,
  tapErrorTag: () => tapErrorTag2,
  timed: () => timed2,
  timedWith: () => timedWith2,
  timeout: () => timeout2,
  timeoutFail: () => timeoutFail2,
  timeoutFailCause: () => timeoutFailCause2,
  timeoutOption: () => timeoutOption2,
  timeoutTo: () => timeoutTo2,
  tracer: () => tracer2,
  tracerWith: () => tracerWith4,
  transplant: () => transplant2,
  transposeMapOption: () => transposeMapOption,
  transposeOption: () => transposeOption,
  try: () => try_2,
  tryMap: () => tryMap2,
  tryMapPromise: () => tryMapPromise2,
  tryPromise: () => tryPromise2,
  uninterruptible: () => uninterruptible2,
  uninterruptibleMask: () => uninterruptibleMask3,
  unless: () => unless2,
  unlessEffect: () => unlessEffect2,
  unsafeMakeLatch: () => unsafeMakeLatch2,
  unsafeMakeSemaphore: () => unsafeMakeSemaphore2,
  unsandbox: () => unsandbox2,
  updateFiberRefs: () => updateFiberRefs3,
  updateService: () => updateService2,
  useSpan: () => useSpan2,
  using: () => using2,
  validate: () => validate2,
  validateAll: () => validateAll2,
  validateFirst: () => validateFirst2,
  validateWith: () => validateWith2,
  void: () => _void,
  when: () => when2,
  whenEffect: () => whenEffect2,
  whenFiberRef: () => whenFiberRef2,
  whenLogLevel: () => whenLogLevel2,
  whenRef: () => whenRef2,
  whileLoop: () => whileLoop3,
  withClock: () => withClock2,
  withClockScoped: () => withClockScoped2,
  withConcurrency: () => withConcurrency2,
  withConfigProvider: () => withConfigProvider2,
  withConfigProviderScoped: () => withConfigProviderScoped2,
  withConsole: () => withConsole2,
  withConsoleScoped: () => withConsoleScoped2,
  withEarlyRelease: () => withEarlyRelease2,
  withExecutionPlan: () => withExecutionPlan2,
  withFiberRuntime: () => withFiberRuntime2,
  withLogSpan: () => withLogSpan2,
  withMaxOpsBeforeYield: () => withMaxOpsBeforeYield2,
  withMetric: () => withMetric2,
  withParentSpan: () => withParentSpan3,
  withRandom: () => withRandom2,
  withRandomFixed: () => withRandomFixed,
  withRandomScoped: () => withRandomScoped2,
  withRequestBatching: () => withRequestBatching2,
  withRequestCache: () => withRequestCache2,
  withRequestCaching: () => withRequestCaching2,
  withRuntimeFlagsPatch: () => withRuntimeFlagsPatch,
  withRuntimeFlagsPatchScoped: () => withRuntimeFlagsPatchScoped,
  withScheduler: () => withScheduler2,
  withSchedulingPriority: () => withSchedulingPriority2,
  withSpan: () => withSpan3,
  withSpanScoped: () => withSpanScoped2,
  withTracer: () => withTracer2,
  withTracerEnabled: () => withTracerEnabled2,
  withTracerScoped: () => withTracerScoped2,
  withTracerTiming: () => withTracerTiming2,
  withUnhandledErrorLogLevel: () => withUnhandledErrorLogLevel2,
  yieldNow: () => yieldNow4,
  zip: () => zip6,
  zipLeft: () => zipLeft6,
  zipRight: () => zipRight6,
  zipWith: () => zipWith8
});

// node_modules/effect/dist/esm/internal/schedule/interval.js
var IntervalSymbolKey = "effect/ScheduleInterval";
var IntervalTypeId = /* @__PURE__ */ Symbol.for(IntervalSymbolKey);
var empty27 = {
  [IntervalTypeId]: IntervalTypeId,
  startMillis: 0,
  endMillis: 0
};
var make36 = (startMillis, endMillis) => {
  if (startMillis > endMillis) {
    return empty27;
  }
  return {
    [IntervalTypeId]: IntervalTypeId,
    startMillis,
    endMillis
  };
};
var lessThan3 = /* @__PURE__ */ dual(2, (self, that) => min3(self, that) === self);
var min3 = /* @__PURE__ */ dual(2, (self, that) => {
  if (self.endMillis <= that.startMillis) return self;
  if (that.endMillis <= self.startMillis) return that;
  if (self.startMillis < that.startMillis) return self;
  if (that.startMillis < self.startMillis) return that;
  if (self.endMillis <= that.endMillis) return self;
  return that;
});
var isEmpty9 = (self) => {
  return self.startMillis >= self.endMillis;
};
var intersect = /* @__PURE__ */ dual(2, (self, that) => {
  const start3 = Math.max(self.startMillis, that.startMillis);
  const end4 = Math.min(self.endMillis, that.endMillis);
  return make36(start3, end4);
});
var size9 = (self) => {
  return millis(self.endMillis - self.startMillis);
};
var after = (startMilliseconds) => {
  return make36(startMilliseconds, Number.POSITIVE_INFINITY);
};

// node_modules/effect/dist/esm/ScheduleInterval.js
var make37 = make36;
var empty28 = empty27;
var lessThan4 = lessThan3;
var isEmpty10 = isEmpty9;
var intersect2 = intersect;
var size10 = size9;
var after2 = after;

// node_modules/effect/dist/esm/internal/schedule/intervals.js
var IntervalsSymbolKey = "effect/ScheduleIntervals";
var IntervalsTypeId = /* @__PURE__ */ Symbol.for(IntervalsSymbolKey);
var make38 = (intervals) => {
  return {
    [IntervalsTypeId]: IntervalsTypeId,
    intervals
  };
};
var union6 = /* @__PURE__ */ dual(2, (self, that) => {
  if (!isNonEmpty2(that.intervals)) {
    return self;
  }
  if (!isNonEmpty2(self.intervals)) {
    return that;
  }
  if (headNonEmpty2(self.intervals).startMillis < headNonEmpty2(that.intervals).startMillis) {
    return unionLoop(tailNonEmpty2(self.intervals), that.intervals, headNonEmpty2(self.intervals), empty4());
  }
  return unionLoop(self.intervals, tailNonEmpty2(that.intervals), headNonEmpty2(that.intervals), empty4());
});
var unionLoop = (_self, _that, _interval, _acc) => {
  let self = _self;
  let that = _that;
  let interval = _interval;
  let acc = _acc;
  while (isNonEmpty2(self) || isNonEmpty2(that)) {
    if (!isNonEmpty2(self) && isNonEmpty2(that)) {
      if (interval.endMillis < headNonEmpty2(that).startMillis) {
        acc = pipe(acc, prepend2(interval));
        interval = headNonEmpty2(that);
        that = tailNonEmpty2(that);
        self = empty4();
      } else {
        interval = make37(interval.startMillis, headNonEmpty2(that).endMillis);
        that = tailNonEmpty2(that);
        self = empty4();
      }
    } else if (isNonEmpty2(self) && isEmpty(that)) {
      if (interval.endMillis < headNonEmpty2(self).startMillis) {
        acc = pipe(acc, prepend2(interval));
        interval = headNonEmpty2(self);
        that = empty4();
        self = tailNonEmpty2(self);
      } else {
        interval = make37(interval.startMillis, headNonEmpty2(self).endMillis);
        that = empty4();
        self = tailNonEmpty2(self);
      }
    } else if (isNonEmpty2(self) && isNonEmpty2(that)) {
      if (headNonEmpty2(self).startMillis < headNonEmpty2(that).startMillis) {
        if (interval.endMillis < headNonEmpty2(self).startMillis) {
          acc = pipe(acc, prepend2(interval));
          interval = headNonEmpty2(self);
          self = tailNonEmpty2(self);
        } else {
          interval = make37(interval.startMillis, headNonEmpty2(self).endMillis);
          self = tailNonEmpty2(self);
        }
      } else if (interval.endMillis < headNonEmpty2(that).startMillis) {
        acc = pipe(acc, prepend2(interval));
        interval = headNonEmpty2(that);
        that = tailNonEmpty2(that);
      } else {
        interval = make37(interval.startMillis, headNonEmpty2(that).endMillis);
        that = tailNonEmpty2(that);
      }
    } else {
      throw new Error(getBugErrorMessage("Intervals.unionLoop"));
    }
  }
  return make38(pipe(acc, prepend2(interval), reverse2));
};
var intersect3 = /* @__PURE__ */ dual(2, (self, that) => intersectLoop(self.intervals, that.intervals, empty4()));
var intersectLoop = (_left, _right, _acc) => {
  let left3 = _left;
  let right3 = _right;
  let acc = _acc;
  while (isNonEmpty2(left3) && isNonEmpty2(right3)) {
    const interval = pipe(headNonEmpty2(left3), intersect2(headNonEmpty2(right3)));
    const intervals = isEmpty10(interval) ? acc : pipe(acc, prepend2(interval));
    if (pipe(headNonEmpty2(left3), lessThan4(headNonEmpty2(right3)))) {
      left3 = tailNonEmpty2(left3);
    } else {
      right3 = tailNonEmpty2(right3);
    }
    acc = intervals;
  }
  return make38(reverse2(acc));
};
var start = (self) => {
  return pipe(self.intervals, head2, getOrElse(() => empty28)).startMillis;
};
var end = (self) => {
  return pipe(self.intervals, head2, getOrElse(() => empty28)).endMillis;
};
var lessThan5 = /* @__PURE__ */ dual(2, (self, that) => start(self) < start(that));
var isNonEmpty4 = (self) => {
  return isNonEmpty2(self.intervals);
};
var max4 = /* @__PURE__ */ dual(2, (self, that) => lessThan5(self, that) ? that : self);

// node_modules/effect/dist/esm/ScheduleIntervals.js
var make39 = make38;
var union7 = union6;
var intersect4 = intersect3;
var start2 = start;
var end2 = end;
var lessThan6 = lessThan5;
var isNonEmpty5 = isNonEmpty4;
var max5 = max4;

// node_modules/effect/dist/esm/internal/schedule/decision.js
var OP_CONTINUE = "Continue";
var OP_DONE2 = "Done";
var _continue = (intervals) => {
  return {
    _tag: OP_CONTINUE,
    intervals
  };
};
var continueWith = (interval) => {
  return {
    _tag: OP_CONTINUE,
    intervals: make39(of2(interval))
  };
};
var done6 = {
  _tag: OP_DONE2
};
var isContinue = (self) => {
  return self._tag === OP_CONTINUE;
};
var isDone4 = (self) => {
  return self._tag === OP_DONE2;
};

// node_modules/effect/dist/esm/ScheduleDecision.js
var _continue2 = _continue;
var continueWith2 = continueWith;
var done7 = done6;
var isContinue2 = isContinue;
var isDone5 = isDone4;

// node_modules/effect/dist/esm/Scope.js
var Scope = scopeTag;
var addFinalizer2 = scopeAddFinalizer;
var addFinalizerExit = scopeAddFinalizerExit;
var close = scopeClose;
var extend2 = scopeExtend;
var fork2 = scopeFork;
var make40 = scopeMake;

// node_modules/effect/dist/esm/internal/effect/circular.js
var Semaphore = class {
  permits;
  waiters = /* @__PURE__ */ new Set();
  taken = 0;
  constructor(permits) {
    this.permits = permits;
  }
  get free() {
    return this.permits - this.taken;
  }
  take = (n) => asyncInterrupt((resume2) => {
    if (this.free < n) {
      const observer = () => {
        if (this.free < n) return;
        this.waiters.delete(observer);
        resume2(suspend(() => {
          if (this.free < n) return this.take(n);
          this.taken += n;
          return succeed(n);
        }));
      };
      this.waiters.add(observer);
      return sync(() => {
        this.waiters.delete(observer);
      });
    }
    resume2(suspend(() => {
      if (this.free < n) return this.take(n);
      this.taken += n;
      return succeed(n);
    }));
  });
  updateTakenUnsafe(fiber, f) {
    this.taken = f(this.taken);
    if (this.waiters.size > 0) {
      fiber.getFiberRef(currentScheduler).scheduleTask(() => {
        const iter = this.waiters.values();
        let item = iter.next();
        while (item.done === false && this.free > 0) {
          item.value();
          item = iter.next();
        }
      }, fiber.getFiberRef(currentSchedulingPriority), fiber);
    }
    return succeed(this.free);
  }
  updateTaken(f) {
    return withFiberRuntime((fiber) => this.updateTakenUnsafe(fiber, f));
  }
  resize = (permits) => asVoid2(withFiberRuntime((fiber) => {
    this.permits = permits;
    if (this.free < 0) {
      return void_2;
    }
    return this.updateTakenUnsafe(fiber, (taken) => taken);
  }));
  release = (n) => this.updateTaken((taken) => taken - n);
  releaseAll = /* @__PURE__ */ this.updateTaken((_) => 0);
  withPermits = (n) => (self) => uninterruptibleMask((restore) => flatMap7(restore(this.take(n)), (permits) => ensuring(restore(self), this.release(permits))));
  withPermitsIfAvailable = (n) => (self) => uninterruptibleMask((restore) => suspend(() => {
    if (this.free < n) {
      return succeedNone;
    }
    this.taken += n;
    return ensuring(restore(asSome(self)), this.release(n));
  }));
};
var unsafeMakeSemaphore = (permits) => new Semaphore(permits);
var makeSemaphore = (permits) => sync(() => unsafeMakeSemaphore(permits));
var Latch = class extends Class2 {
  isOpen;
  waiters = [];
  scheduled = false;
  constructor(isOpen) {
    super();
    this.isOpen = isOpen;
  }
  commit() {
    return this.await;
  }
  unsafeSchedule(fiber) {
    if (this.scheduled || this.waiters.length === 0) {
      return void_2;
    }
    this.scheduled = true;
    fiber.currentScheduler.scheduleTask(this.flushWaiters, fiber.getFiberRef(currentSchedulingPriority), fiber);
    return void_2;
  }
  flushWaiters = () => {
    this.scheduled = false;
    const waiters = this.waiters;
    this.waiters = [];
    for (let i = 0; i < waiters.length; i++) {
      waiters[i](exitVoid);
    }
  };
  open = /* @__PURE__ */ withFiberRuntime((fiber) => {
    if (this.isOpen) {
      return void_2;
    }
    this.isOpen = true;
    return this.unsafeSchedule(fiber);
  });
  unsafeOpen() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.flushWaiters();
  }
  release = /* @__PURE__ */ withFiberRuntime((fiber) => {
    if (this.isOpen) {
      return void_2;
    }
    return this.unsafeSchedule(fiber);
  });
  await = /* @__PURE__ */ asyncInterrupt((resume2) => {
    if (this.isOpen) {
      return resume2(void_2);
    }
    this.waiters.push(resume2);
    return sync(() => {
      const index = this.waiters.indexOf(resume2);
      if (index !== -1) {
        this.waiters.splice(index, 1);
      }
    });
  });
  unsafeClose() {
    this.isOpen = false;
  }
  close = /* @__PURE__ */ sync(() => {
    this.isOpen = false;
  });
  whenOpen = (self) => {
    return zipRight2(this.await, self);
  };
};
var unsafeMakeLatch = (open) => new Latch(open ?? false);
var makeLatch = (open) => sync(() => unsafeMakeLatch(open));
var awaitAllChildren = (self) => ensuringChildren(self, fiberAwaitAll);
var cached2 = /* @__PURE__ */ dual(2, (self, timeToLive) => map10(cachedInvalidateWithTTL(self, timeToLive), (tuple3) => tuple3[0]));
var cachedInvalidateWithTTL = /* @__PURE__ */ dual(2, (self, timeToLive) => {
  const duration3 = decode(timeToLive);
  return flatMap7(context(), (env) => map10(makeSynchronized(none2()), (cache) => [provideContext(getCachedValue(self, duration3, cache), env), invalidateCache(cache)]));
});
var computeCachedValue = (self, timeToLive, start3) => {
  const timeToLiveMillis = toMillis(decode(timeToLive));
  return pipe(deferredMake(), tap2((deferred) => intoDeferred(self, deferred)), map10((deferred) => some2([start3 + timeToLiveMillis, deferred])));
};
var getCachedValue = (self, timeToLive, cache) => uninterruptibleMask((restore) => pipe(clockWith3((clock3) => clock3.currentTimeMillis), flatMap7((time) => updateSomeAndGetEffectSynchronized(cache, (option3) => {
  switch (option3._tag) {
    case "None": {
      return some2(computeCachedValue(self, timeToLive, time));
    }
    case "Some": {
      const [end4] = option3.value;
      return end4 - time <= 0 ? some2(computeCachedValue(self, timeToLive, time)) : none2();
    }
  }
})), flatMap7((option3) => isNone2(option3) ? dieMessage("BUG: Effect.cachedInvalidate - please report an issue at https://github.com/Effect-TS/effect/issues") : restore(deferredAwait(option3.value[1])))));
var invalidateCache = (cache) => set5(cache, none2());
var ensuringChild = /* @__PURE__ */ dual(2, (self, f) => ensuringChildren(self, (children3) => f(fiberAll(children3))));
var ensuringChildren = /* @__PURE__ */ dual(2, (self, children3) => flatMap7(track, (supervisor) => pipe(supervised(self, supervisor), ensuring(flatMap7(supervisor.value, children3)))));
var forkAll = /* @__PURE__ */ dual((args2) => isIterable(args2[0]), (effects, options) => options?.discard ? forEachSequentialDiscard(effects, fork) : map10(forEachSequential(effects, fork), fiberAll));
var forkIn = /* @__PURE__ */ dual(2, (self, scope5) => withFiberRuntime((parent, parentStatus) => {
  const scopeImpl = scope5;
  const fiber = unsafeFork2(self, parent, parentStatus.runtimeFlags, globalScope);
  if (scopeImpl.state._tag === "Open") {
    const finalizer2 = () => fiberIdWith((fiberId3) => equals(fiberId3, fiber.id()) ? void_2 : asVoid2(interruptFiber(fiber)));
    const key = {};
    scopeImpl.state.finalizers.set(key, finalizer2);
    fiber.addObserver(() => {
      if (scopeImpl.state._tag === "Closed") return;
      scopeImpl.state.finalizers.delete(key);
    });
  } else {
    fiber.unsafeInterruptAsFork(parent.id());
  }
  return succeed(fiber);
}));
var forkScoped = (self) => scopeWith((scope5) => forkIn(self, scope5));
var fromFiber = (fiber) => join2(fiber);
var fromFiberEffect = (fiber) => suspend(() => flatMap7(fiber, join2));
var memoKeySymbol = /* @__PURE__ */ Symbol.for("effect/Effect/memoizeFunction.key");
var Key = class {
  a;
  eq;
  [memoKeySymbol] = memoKeySymbol;
  constructor(a, eq) {
    this.a = a;
    this.eq = eq;
  }
  [symbol2](that) {
    if (hasProperty(that, memoKeySymbol)) {
      if (this.eq) {
        return this.eq(this.a, that.a);
      } else {
        return equals(this.a, that.a);
      }
    }
    return false;
  }
  [symbol]() {
    return this.eq ? 0 : cached(this, hash(this.a));
  }
};
var cachedFunction = (f, eq) => {
  return pipe(sync(() => empty17()), flatMap7(makeSynchronized), map10((ref) => (a) => pipe(ref.modifyEffect((map25) => {
    const result = pipe(map25, get8(new Key(a, eq)));
    if (isNone2(result)) {
      return pipe(deferredMake(), tap2((deferred) => pipe(diffFiberRefs(f(a)), intoDeferred(deferred), fork)), map10((deferred) => [deferred, pipe(map25, set4(new Key(a, eq), deferred))]));
    }
    return succeed([result.value, map25]);
  }), flatMap7(deferredAwait), flatMap7(([patch9, b]) => pipe(patchFiberRefs(patch9), as3(b))))));
};
var raceFirst = /* @__PURE__ */ dual(2, (self, that) => pipe(exit(self), race(exit(that)), (effect3) => flatten6(effect3)));
var supervised = /* @__PURE__ */ dual(2, (self, supervisor) => {
  const supervise = fiberRefLocallyWith(currentSupervisor, (s) => s.zip(supervisor));
  return supervise(self);
});
var timeout = /* @__PURE__ */ dual(2, (self, duration3) => timeoutFail(self, {
  onTimeout: () => timeoutExceptionFromDuration(duration3),
  duration: duration3
}));
var timeoutFail = /* @__PURE__ */ dual(2, (self, {
  duration: duration3,
  onTimeout
}) => flatten6(timeoutTo(self, {
  onTimeout: () => failSync(onTimeout),
  onSuccess: succeed,
  duration: duration3
})));
var timeoutFailCause = /* @__PURE__ */ dual(2, (self, {
  duration: duration3,
  onTimeout
}) => flatten6(timeoutTo(self, {
  onTimeout: () => failCauseSync(onTimeout),
  onSuccess: succeed,
  duration: duration3
})));
var timeoutOption = /* @__PURE__ */ dual(2, (self, duration3) => timeoutTo(self, {
  duration: duration3,
  onSuccess: some2,
  onTimeout: none2
}));
var timeoutTo = /* @__PURE__ */ dual(2, (self, {
  duration: duration3,
  onSuccess,
  onTimeout
}) => fiberIdWith((parentFiberId) => uninterruptibleMask((restore) => raceFibersWith(restore(self), interruptible2(sleep3(duration3)), {
  onSelfWin: (winner, loser) => flatMap7(winner.await, (exit4) => {
    if (exit4._tag === "Success") {
      return flatMap7(winner.inheritAll, () => as3(interruptAsFiber(loser, parentFiberId), onSuccess(exit4.value)));
    } else {
      return flatMap7(interruptAsFiber(loser, parentFiberId), () => exitFailCause(exit4.cause));
    }
  }),
  onOtherWin: (winner, loser) => flatMap7(winner.await, (exit4) => {
    if (exit4._tag === "Success") {
      return flatMap7(winner.inheritAll, () => as3(interruptAsFiber(loser, parentFiberId), onTimeout()));
    } else {
      return flatMap7(interruptAsFiber(loser, parentFiberId), () => exitFailCause(exit4.cause));
    }
  }),
  otherScope: globalScope
}))));
var SynchronizedSymbolKey = "effect/Ref/SynchronizedRef";
var SynchronizedTypeId = /* @__PURE__ */ Symbol.for(SynchronizedSymbolKey);
var synchronizedVariance = {
  /* c8 ignore next */
  _A: (_) => _
};
var SynchronizedImpl = class extends Class2 {
  ref;
  withLock;
  [SynchronizedTypeId] = synchronizedVariance;
  [RefTypeId] = refVariance;
  [TypeId13] = TypeId13;
  constructor(ref, withLock) {
    super();
    this.ref = ref;
    this.withLock = withLock;
    this.get = get11(this.ref);
  }
  get;
  commit() {
    return this.get;
  }
  modify(f) {
    return this.modifyEffect((a) => succeed(f(a)));
  }
  modifyEffect(f) {
    return this.withLock(pipe(flatMap7(get11(this.ref), f), flatMap7(([b, a]) => as3(set5(this.ref, a), b))));
  }
};
var makeSynchronized = (value) => sync(() => unsafeMakeSynchronized(value));
var unsafeMakeSynchronized = (value) => {
  const ref = unsafeMake6(value);
  const sem = unsafeMakeSemaphore(1);
  return new SynchronizedImpl(ref, sem.withPermits(1));
};
var updateSomeAndGetEffectSynchronized = /* @__PURE__ */ dual(2, (self, pf) => self.modifyEffect((value) => {
  const result = pf(value);
  switch (result._tag) {
    case "None": {
      return succeed([value, value]);
    }
    case "Some": {
      return map10(result.value, (a) => [a, a]);
    }
  }
}));
var zipFiber = /* @__PURE__ */ dual(2, (self, that) => zipWithFiber(self, that, (a, b) => [a, b]));
var zipLeftFiber = /* @__PURE__ */ dual(2, (self, that) => zipWithFiber(self, that, (a, _) => a));
var zipRightFiber = /* @__PURE__ */ dual(2, (self, that) => zipWithFiber(self, that, (_, b) => b));
var zipWithFiber = /* @__PURE__ */ dual(3, (self, that, f) => ({
  ...CommitPrototype2,
  commit() {
    return join2(this);
  },
  [FiberTypeId]: fiberVariance2,
  id: () => pipe(self.id(), getOrElse5(that.id())),
  await: pipe(self.await, flatten6, zipWithOptions(flatten6(that.await), f, {
    concurrent: true
  }), exit),
  children: self.children,
  inheritAll: zipRight2(that.inheritAll, self.inheritAll),
  poll: zipWith3(self.poll, that.poll, (optionA, optionB) => pipe(optionA, flatMap((exitA) => pipe(optionB, map2((exitB) => zipWith4(exitA, exitB, {
    onSuccess: f,
    onFailure: parallel
  })))))),
  interruptAsFork: (id3) => zipRight2(self.interruptAsFork(id3), that.interruptAsFork(id3)),
  pipe() {
    return pipeArguments(this, arguments);
  }
}));
var bindAll = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, f, options) => flatMap7(self, (a) => all5(f(a), options).pipe(map10((record2) => Object.assign({}, a, record2)))));

// node_modules/effect/dist/esm/internal/managedRuntime/circular.js
var TypeId16 = /* @__PURE__ */ Symbol.for("effect/ManagedRuntime");

// node_modules/effect/dist/esm/internal/opCodes/layer.js
var OP_EXTEND_SCOPE = "ExtendScope";
var OP_FOLD = "Fold";
var OP_FRESH = "Fresh";
var OP_FROM_EFFECT = "FromEffect";
var OP_SCOPED = "Scoped";
var OP_SUSPEND = "Suspend";
var OP_PROVIDE = "Provide";
var OP_PROVIDE_MERGE = "ProvideMerge";
var OP_MERGE_ALL = "MergeAll";
var OP_ZIP_WITH2 = "ZipWith";

// node_modules/effect/dist/esm/Fiber.js
var Fiber_exports = {};
__export(Fiber_exports, {
  FiberTypeId: () => FiberTypeId2,
  Order: () => Order5,
  RuntimeFiberTypeId: () => RuntimeFiberTypeId2,
  all: () => all6,
  await: () => _await3,
  awaitAll: () => awaitAll,
  children: () => children2,
  done: () => done8,
  dump: () => dump2,
  dumpAll: () => dumpAll2,
  fail: () => fail7,
  failCause: () => failCause6,
  fromEffect: () => fromEffect3,
  getCurrentFiber: () => getCurrentFiber2,
  id: () => id2,
  inheritAll: () => inheritAll2,
  interrupt: () => interrupt6,
  interruptAll: () => interruptAll2,
  interruptAllAs: () => interruptAllAs2,
  interruptAs: () => interruptAs,
  interruptAsFork: () => interruptAsFork2,
  interruptFork: () => interruptFork,
  interrupted: () => interrupted2,
  isFiber: () => isFiber2,
  isRuntimeFiber: () => isRuntimeFiber2,
  join: () => join3,
  joinAll: () => joinAll,
  map: () => map15,
  mapEffect: () => mapEffect2,
  mapFiber: () => mapFiber2,
  match: () => match12,
  never: () => never3,
  orElse: () => orElse4,
  orElseEither: () => orElseEither4,
  poll: () => poll4,
  pretty: () => pretty4,
  roots: () => roots2,
  scoped: () => scoped,
  status: () => status2,
  succeed: () => succeed6,
  unsafeRoots: () => unsafeRoots2,
  void: () => void_6,
  zip: () => zip5,
  zipLeft: () => zipLeft4,
  zipRight: () => zipRight4,
  zipWith: () => zipWith5
});
var FiberTypeId2 = FiberTypeId;
var RuntimeFiberTypeId2 = RuntimeFiberTypeId;
var Order5 = Order4;
var isFiber2 = isFiber;
var isRuntimeFiber2 = isRuntimeFiber;
var id2 = id;
var _await3 = _await2;
var awaitAll = fiberAwaitAll;
var children2 = children;
var all6 = fiberAll;
var done8 = done5;
var dump2 = dump;
var dumpAll2 = dumpAll;
var fail7 = fail5;
var failCause6 = failCause5;
var fromEffect3 = fromEffect;
var getCurrentFiber2 = getCurrentFiber;
var inheritAll2 = inheritAll;
var interrupt6 = interruptFiber;
var interrupted2 = interrupted;
var interruptAs = interruptAsFiber;
var interruptAsFork2 = interruptAsFork;
var interruptAll2 = interruptAll;
var interruptAllAs2 = interruptAllAs;
var interruptFork = fiberInterruptFork;
var join3 = join2;
var joinAll = fiberJoinAll;
var map15 = map13;
var mapEffect2 = mapEffect;
var mapFiber2 = mapFiber;
var match12 = match10;
var never3 = never2;
var orElse4 = orElse3;
var orElseEither4 = orElseEither2;
var poll4 = poll3;
var pretty4 = pretty2;
var roots2 = roots;
var unsafeRoots2 = unsafeRoots;
var scoped = fiberScoped;
var status2 = status;
var succeed6 = succeed5;
var void_6 = void_5;
var zip5 = zipFiber;
var zipLeft4 = zipLeftFiber;
var zipRight4 = zipRightFiber;
var zipWith5 = zipWithFiber;

// node_modules/effect/dist/esm/internal/runtime.js
var makeDual = (f) => function() {
  if (arguments.length === 1) {
    const runtime4 = arguments[0];
    return (effect3, ...args2) => f(runtime4, effect3, ...args2);
  }
  return f.apply(this, arguments);
};
var unsafeFork3 = /* @__PURE__ */ makeDual((runtime4, self, options) => {
  const fiberId3 = unsafeMake3();
  const fiberRefUpdates = [[currentContext, [[fiberId3, runtime4.context]]]];
  if (options?.scheduler) {
    fiberRefUpdates.push([currentScheduler, [[fiberId3, options.scheduler]]]);
  }
  let fiberRefs3 = updateManyAs2(runtime4.fiberRefs, {
    entries: fiberRefUpdates,
    forkAs: fiberId3
  });
  if (options?.updateRefs) {
    fiberRefs3 = options.updateRefs(fiberRefs3, fiberId3);
  }
  const fiberRuntime = new FiberRuntime(fiberId3, fiberRefs3, runtime4.runtimeFlags);
  let effect3 = self;
  if (options?.scope) {
    effect3 = flatMap7(fork2(options.scope, sequential2), (closeableScope) => zipRight2(scopeAddFinalizer(closeableScope, fiberIdWith((id3) => equals(id3, fiberRuntime.id()) ? void_2 : interruptAsFiber(fiberRuntime, id3))), onExit(self, (exit4) => close(closeableScope, exit4))));
  }
  const supervisor = fiberRuntime.currentSupervisor;
  if (supervisor !== none8) {
    supervisor.onStart(runtime4.context, effect3, none2(), fiberRuntime);
    fiberRuntime.addObserver((exit4) => supervisor.onEnd(exit4, fiberRuntime));
  }
  globalScope.add(runtime4.runtimeFlags, fiberRuntime);
  if (options?.immediate === false) {
    fiberRuntime.resume(effect3);
  } else {
    fiberRuntime.start(effect3);
  }
  return fiberRuntime;
});
var unsafeRunCallback = /* @__PURE__ */ makeDual((runtime4, effect3, options = {}) => {
  const fiberRuntime = unsafeFork3(runtime4, effect3, options);
  if (options.onExit) {
    fiberRuntime.addObserver((exit4) => {
      options.onExit(exit4);
    });
  }
  return (id3, cancelOptions) => unsafeRunCallback(runtime4)(pipe(fiberRuntime, interruptAs(id3 ?? none4)), {
    ...cancelOptions,
    onExit: cancelOptions?.onExit ? (exit4) => cancelOptions.onExit(flatten7(exit4)) : void 0
  });
});
var unsafeRunSync = /* @__PURE__ */ makeDual((runtime4, effect3) => {
  const result = unsafeRunSyncExit(runtime4)(effect3);
  if (result._tag === "Failure") {
    throw fiberFailure(result.effect_instruction_i0);
  }
  return result.effect_instruction_i0;
});
var AsyncFiberExceptionImpl = class extends Error {
  fiber;
  _tag = "AsyncFiberException";
  constructor(fiber) {
    super(`Fiber #${fiber.id().id} cannot be resolved synchronously. This is caused by using runSync on an effect that performs async work`);
    this.fiber = fiber;
    this.name = this._tag;
    this.stack = this.message;
  }
};
var asyncFiberException = (fiber) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const error = new AsyncFiberExceptionImpl(fiber);
  Error.stackTraceLimit = limit;
  return error;
};
var isAsyncFiberException = (u) => isTagged(u, "AsyncFiberException") && "fiber" in u;
var FiberFailureId = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure");
var FiberFailureCauseId = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure/Cause");
var FiberFailureImpl = class extends Error {
  [FiberFailureId];
  [FiberFailureCauseId];
  constructor(cause3) {
    const head6 = prettyErrors(cause3)[0];
    super(head6?.message || "An error has occurred");
    this[FiberFailureId] = FiberFailureId;
    this[FiberFailureCauseId] = cause3;
    this.name = head6 ? `(FiberFailure) ${head6.name}` : "FiberFailure";
    if (head6?.stack) {
      this.stack = head6.stack;
    }
  }
  toJSON() {
    return {
      _id: "FiberFailure",
      cause: this[FiberFailureCauseId].toJSON()
    };
  }
  toString() {
    return "(FiberFailure) " + pretty(this[FiberFailureCauseId], {
      renderErrorCause: true
    });
  }
  [NodeInspectSymbol]() {
    return this.toString();
  }
};
var fiberFailure = (cause3) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const error = new FiberFailureImpl(cause3);
  Error.stackTraceLimit = limit;
  return error;
};
var isFiberFailure = (u) => hasProperty(u, FiberFailureId);
var fastPath = (effect3) => {
  const op = effect3;
  switch (op._op) {
    case "Failure":
    case "Success": {
      return op;
    }
    case "Left": {
      return exitFail(op.left);
    }
    case "Right": {
      return exitSucceed(op.right);
    }
    case "Some": {
      return exitSucceed(op.value);
    }
    case "None": {
      return exitFail(new NoSuchElementException());
    }
  }
};
var unsafeRunSyncExit = /* @__PURE__ */ makeDual((runtime4, effect3) => {
  const op = fastPath(effect3);
  if (op) {
    return op;
  }
  const scheduler = new SyncScheduler();
  const fiberRuntime = unsafeFork3(runtime4)(effect3, {
    scheduler
  });
  scheduler.flush();
  const result = fiberRuntime.unsafePoll();
  if (result) {
    return result;
  }
  return exitDie(capture(asyncFiberException(fiberRuntime), currentSpanFromFiber(fiberRuntime)));
});
var unsafeRunPromise = /* @__PURE__ */ makeDual((runtime4, effect3, options) => unsafeRunPromiseExit(runtime4, effect3, options).then((result) => {
  switch (result._tag) {
    case OP_SUCCESS: {
      return result.effect_instruction_i0;
    }
    case OP_FAILURE: {
      throw fiberFailure(result.effect_instruction_i0);
    }
  }
}));
var unsafeRunPromiseExit = /* @__PURE__ */ makeDual((runtime4, effect3, options) => new Promise((resolve3) => {
  const op = fastPath(effect3);
  if (op) {
    resolve3(op);
  }
  const fiber = unsafeFork3(runtime4)(effect3);
  fiber.addObserver((exit4) => {
    resolve3(exit4);
  });
  if (options?.signal !== void 0) {
    if (options.signal.aborted) {
      fiber.unsafeInterruptAsFork(fiber.id());
    } else {
      options.signal.addEventListener("abort", () => {
        fiber.unsafeInterruptAsFork(fiber.id());
      }, {
        once: true
      });
    }
  }
}));
var RuntimeImpl = class {
  context;
  runtimeFlags;
  fiberRefs;
  constructor(context7, runtimeFlags2, fiberRefs3) {
    this.context = context7;
    this.runtimeFlags = runtimeFlags2;
    this.fiberRefs = fiberRefs3;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make41 = (options) => new RuntimeImpl(options.context, options.runtimeFlags, options.fiberRefs);
var runtime2 = () => withFiberRuntime((state, status3) => succeed(new RuntimeImpl(state.getFiberRef(currentContext), status3.runtimeFlags, state.getFiberRefs())));
var defaultRuntimeFlags = /* @__PURE__ */ make16(Interruption, CooperativeYielding, RuntimeMetrics);
var defaultRuntime = /* @__PURE__ */ make41({
  context: /* @__PURE__ */ empty3(),
  runtimeFlags: defaultRuntimeFlags,
  fiberRefs: /* @__PURE__ */ empty21()
});
var updateRuntimeFlags2 = /* @__PURE__ */ dual(2, (self, f) => make41({
  context: self.context,
  runtimeFlags: f(self.runtimeFlags),
  fiberRefs: self.fiberRefs
}));
var disableRuntimeFlag = /* @__PURE__ */ dual(2, (self, flag) => updateRuntimeFlags2(self, disable2(flag)));
var enableRuntimeFlag = /* @__PURE__ */ dual(2, (self, flag) => updateRuntimeFlags2(self, enable2(flag)));
var updateContext2 = /* @__PURE__ */ dual(2, (self, f) => make41({
  context: f(self.context),
  runtimeFlags: self.runtimeFlags,
  fiberRefs: self.fiberRefs
}));
var provideService2 = /* @__PURE__ */ dual(3, (self, tag2, service3) => updateContext2(self, add2(tag2, service3)));
var updateFiberRefs2 = /* @__PURE__ */ dual(2, (self, f) => make41({
  context: self.context,
  runtimeFlags: self.runtimeFlags,
  fiberRefs: f(self.fiberRefs)
}));
var setFiberRef = /* @__PURE__ */ dual(3, (self, fiberRef, value) => updateFiberRefs2(self, updateAs2({
  fiberId: none4,
  fiberRef,
  value
})));
var deleteFiberRef = /* @__PURE__ */ dual(2, (self, fiberRef) => updateFiberRefs2(self, delete_2(fiberRef)));
var unsafeRunEffect = /* @__PURE__ */ unsafeRunCallback(defaultRuntime);
var unsafeForkEffect = /* @__PURE__ */ unsafeFork3(defaultRuntime);
var unsafeRunPromiseEffect = /* @__PURE__ */ unsafeRunPromise(defaultRuntime);
var unsafeRunPromiseExitEffect = /* @__PURE__ */ unsafeRunPromiseExit(defaultRuntime);
var unsafeRunSyncEffect = /* @__PURE__ */ unsafeRunSync(defaultRuntime);
var unsafeRunSyncExitEffect = /* @__PURE__ */ unsafeRunSyncExit(defaultRuntime);
var asyncEffect = (register) => suspend(() => {
  let cleanup = void 0;
  return flatMap7(deferredMake(), (deferred) => flatMap7(runtime2(), (runtime4) => uninterruptibleMask((restore) => zipRight2(fork(restore(matchCauseEffect(register((cb) => unsafeRunCallback(runtime4)(intoDeferred(cb, deferred))), {
    onFailure: (cause3) => deferredFailCause(deferred, cause3),
    onSuccess: (cleanup_) => {
      cleanup = cleanup_;
      return void_2;
    }
  }))), restore(onInterrupt(deferredAwait(deferred), () => cleanup ?? void_2))))));
});

// node_modules/effect/dist/esm/internal/synchronizedRef.js
var modifyEffect = /* @__PURE__ */ dual(2, (self, f) => self.modifyEffect(f));

// node_modules/effect/dist/esm/internal/layer.js
var LayerSymbolKey = "effect/Layer";
var LayerTypeId = /* @__PURE__ */ Symbol.for(LayerSymbolKey);
var layerVariance = {
  /* c8 ignore next */
  _RIn: (_) => _,
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _ROut: (_) => _
};
var proto3 = {
  [LayerTypeId]: layerVariance,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var MemoMapTypeIdKey = "effect/Layer/MemoMap";
var MemoMapTypeId = /* @__PURE__ */ Symbol.for(MemoMapTypeIdKey);
var CurrentMemoMap = /* @__PURE__ */ Reference2()("effect/Layer/CurrentMemoMap", {
  defaultValue: () => unsafeMakeMemoMap()
});
var isLayer = (u) => hasProperty(u, LayerTypeId);
var isFresh = (self) => {
  return self._op_layer === OP_FRESH;
};
var MemoMapImpl = class {
  ref;
  [MemoMapTypeId];
  constructor(ref) {
    this.ref = ref;
    this[MemoMapTypeId] = MemoMapTypeId;
  }
  /**
   * Checks the memo map to see if a layer exists. If it is, immediately
   * returns it. Otherwise, obtains the layer, stores it in the memo map,
   * and adds a finalizer to the `Scope`.
   */
  getOrElseMemoize(layer2, scope5) {
    return pipe(modifyEffect(this.ref, (map25) => {
      const inMap = map25.get(layer2);
      if (inMap !== void 0) {
        const [acquire, release] = inMap;
        const cached4 = pipe(acquire, flatMap7(([patch9, b]) => pipe(patchFiberRefs(patch9), as3(b))), onExit(exitMatch({
          onFailure: () => void_2,
          onSuccess: () => scopeAddFinalizerExit(scope5, release)
        })));
        return succeed([cached4, map25]);
      }
      return pipe(make28(0), flatMap7((observers) => pipe(deferredMake(), flatMap7((deferred) => pipe(make28(() => void_2), map10((finalizerRef) => {
        const resource = uninterruptibleMask((restore) => pipe(scopeMake(), flatMap7((innerScope) => pipe(restore(flatMap7(makeBuilder(layer2, innerScope, true), (f) => diffFiberRefs(f(this)))), exit, flatMap7((exit4) => {
          switch (exit4._tag) {
            case OP_FAILURE: {
              return pipe(deferredFailCause(deferred, exit4.effect_instruction_i0), zipRight2(scopeClose(innerScope, exit4)), zipRight2(failCause(exit4.effect_instruction_i0)));
            }
            case OP_SUCCESS: {
              return pipe(set5(finalizerRef, (exit5) => pipe(scopeClose(innerScope, exit5), whenEffect(modify3(observers, (n) => [n === 1, n - 1])), asVoid2)), zipRight2(update2(observers, (n) => n + 1)), zipRight2(scopeAddFinalizerExit(scope5, (exit5) => pipe(sync(() => map25.delete(layer2)), zipRight2(get11(finalizerRef)), flatMap7((finalizer2) => finalizer2(exit5))))), zipRight2(deferredSucceed(deferred, exit4.effect_instruction_i0)), as3(exit4.effect_instruction_i0[1]));
            }
          }
        })))));
        const memoized = [pipe(deferredAwait(deferred), onExit(exitMatchEffect({
          onFailure: () => void_2,
          onSuccess: () => update2(observers, (n) => n + 1)
        }))), (exit4) => pipe(get11(finalizerRef), flatMap7((finalizer2) => finalizer2(exit4)))];
        return [resource, isFresh(layer2) ? map25 : map25.set(layer2, memoized)];
      }))))));
    }), flatten6);
  }
};
var makeMemoMap = /* @__PURE__ */ suspend(() => map10(makeSynchronized(/* @__PURE__ */ new Map()), (ref) => new MemoMapImpl(ref)));
var unsafeMakeMemoMap = () => new MemoMapImpl(unsafeMakeSynchronized(/* @__PURE__ */ new Map()));
var build = (self) => scopeWith((scope5) => buildWithScope(self, scope5));
var buildWithScope = /* @__PURE__ */ dual(2, (self, scope5) => flatMap7(makeMemoMap, (memoMap) => buildWithMemoMap(self, memoMap, scope5)));
var buildWithMemoMap = /* @__PURE__ */ dual(3, (self, memoMap, scope5) => flatMap7(makeBuilder(self, scope5), (run7) => provideService(run7(memoMap), CurrentMemoMap, memoMap)));
var makeBuilder = (self, scope5, inMemoMap = false) => {
  const op = self;
  switch (op._op_layer) {
    case "Locally": {
      return sync(() => (memoMap) => op.f(memoMap.getOrElseMemoize(op.self, scope5)));
    }
    case "ExtendScope": {
      return sync(() => (memoMap) => scopeWith((scope6) => memoMap.getOrElseMemoize(op.layer, scope6)));
    }
    case "Fold": {
      return sync(() => (memoMap) => pipe(memoMap.getOrElseMemoize(op.layer, scope5), matchCauseEffect({
        onFailure: (cause3) => memoMap.getOrElseMemoize(op.failureK(cause3), scope5),
        onSuccess: (value) => memoMap.getOrElseMemoize(op.successK(value), scope5)
      })));
    }
    case "Fresh": {
      return sync(() => (_) => pipe(op.layer, buildWithScope(scope5)));
    }
    case "FromEffect": {
      return inMemoMap ? sync(() => (_) => op.effect) : sync(() => (memoMap) => memoMap.getOrElseMemoize(self, scope5));
    }
    case "Provide": {
      return sync(() => (memoMap) => pipe(memoMap.getOrElseMemoize(op.first, scope5), flatMap7((env) => pipe(memoMap.getOrElseMemoize(op.second, scope5), provideContext(env)))));
    }
    case "Scoped": {
      return inMemoMap ? sync(() => (_) => scopeExtend(op.effect, scope5)) : sync(() => (memoMap) => memoMap.getOrElseMemoize(self, scope5));
    }
    case "Suspend": {
      return sync(() => (memoMap) => memoMap.getOrElseMemoize(op.evaluate(), scope5));
    }
    case "ProvideMerge": {
      return sync(() => (memoMap) => pipe(memoMap.getOrElseMemoize(op.first, scope5), zipWith3(memoMap.getOrElseMemoize(op.second, scope5), op.zipK)));
    }
    case "ZipWith": {
      return gen2(function* () {
        const parallelScope = yield* scopeFork(scope5, parallel2);
        const firstScope = yield* scopeFork(parallelScope, sequential2);
        const secondScope = yield* scopeFork(parallelScope, sequential2);
        return (memoMap) => pipe(memoMap.getOrElseMemoize(op.first, firstScope), zipWithOptions(memoMap.getOrElseMemoize(op.second, secondScope), op.zipK, {
          concurrent: true
        }));
      });
    }
    case "MergeAll": {
      const layers = op.layers;
      return map10(scopeFork(scope5, parallel2), (parallelScope) => (memoMap) => {
        const contexts = new Array(layers.length);
        return map10(forEachConcurrentDiscard(layers, fnUntraced(function* (layer2, i) {
          const scope6 = yield* scopeFork(parallelScope, sequential2);
          const context7 = yield* memoMap.getOrElseMemoize(layer2, scope6);
          contexts[i] = context7;
        }), false, false), () => mergeAll2(...contexts));
      });
    }
  }
};
var catchAll2 = /* @__PURE__ */ dual(2, (self, onFailure) => match13(self, {
  onFailure,
  onSuccess: succeedContext
}));
var catchAllCause2 = /* @__PURE__ */ dual(2, (self, onFailure) => matchCause3(self, {
  onFailure,
  onSuccess: succeedContext
}));
var die6 = (defect) => failCause7(die5(defect));
var dieSync3 = (evaluate2) => failCauseSync3(() => die5(evaluate2()));
var discard = (self) => map16(self, () => empty3());
var context2 = () => fromEffectContext(context());
var extendScope = (self) => {
  const extendScope3 = Object.create(proto3);
  extendScope3._op_layer = OP_EXTEND_SCOPE;
  extendScope3.layer = self;
  return extendScope3;
};
var fail8 = (error) => failCause7(fail6(error));
var failSync3 = (evaluate2) => failCauseSync3(() => fail6(evaluate2()));
var failCause7 = (cause3) => fromEffectContext(failCause(cause3));
var failCauseSync3 = (evaluate2) => fromEffectContext(failCauseSync(evaluate2));
var flatMap11 = /* @__PURE__ */ dual(2, (self, f) => match13(self, {
  onFailure: fail8,
  onSuccess: f
}));
var flatten9 = /* @__PURE__ */ dual(2, (self, tag2) => flatMap11(self, get3(tag2)));
var fresh = (self) => {
  const fresh3 = Object.create(proto3);
  fresh3._op_layer = OP_FRESH;
  fresh3.layer = self;
  return fresh3;
};
var fromEffect4 = /* @__PURE__ */ dual(2, (a, b) => {
  const tagFirst = isTag2(a);
  const tag2 = tagFirst ? a : b;
  const effect3 = tagFirst ? b : a;
  return fromEffectContext(map10(effect3, (service3) => make5(tag2, service3)));
});
var fromEffectDiscard = (effect3) => fromEffectContext(map10(effect3, () => empty3()));
function fromEffectContext(effect3) {
  const fromEffect9 = Object.create(proto3);
  fromEffect9._op_layer = OP_FROM_EFFECT;
  fromEffect9.effect = effect3;
  return fromEffect9;
}
var fiberRefLocally2 = /* @__PURE__ */ dual(3, (self, ref, value) => locallyEffect(self, fiberRefLocally(ref, value)));
var locallyEffect = /* @__PURE__ */ dual(2, (self, f) => {
  const locally3 = Object.create(proto3);
  locally3._op_layer = "Locally";
  locally3.self = self;
  locally3.f = f;
  return locally3;
});
var fiberRefLocallyWith2 = /* @__PURE__ */ dual(3, (self, ref, value) => locallyEffect(self, fiberRefLocallyWith(ref, value)));
var fiberRefLocallyScoped2 = (self, value) => scopedDiscard(fiberRefLocallyScoped(self, value));
var fiberRefLocallyScopedWith2 = (self, value) => scopedDiscard(fiberRefLocallyScopedWith(self, value));
var fromFunction = (tagA, tagB, f) => fromEffectContext(map10(tagA, (a) => make5(tagB, f(a))));
var launch = (self) => scopedEffect(zipRight2(scopeWith((scope5) => pipe(self, buildWithScope(scope5))), never));
var mock = function() {
  if (arguments.length === 1) {
    return (service3) => mockImpl(arguments[0], service3);
  }
  return mockImpl(arguments[0], arguments[1]);
};
var mockImpl = (tag2, service3) => succeed7(tag2, new Proxy({
  ...service3
}, {
  get(target, prop, _receiver) {
    if (prop in target) {
      return target[prop];
    }
    const prevLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 2;
    const error = new Error(`${tag2.key}: Unimplemented method "${prop.toString()}"`);
    Error.stackTraceLimit = prevLimit;
    error.name = "UnimplementedError";
    return makeUnimplemented(error);
  },
  has: constTrue
}));
var makeUnimplemented = (error) => {
  const dead = die2(error);
  function unimplemented() {
    return dead;
  }
  Object.assign(unimplemented, dead);
  Object.setPrototypeOf(unimplemented, Object.getPrototypeOf(dead));
  return unimplemented;
};
var map16 = /* @__PURE__ */ dual(2, (self, f) => flatMap11(self, (context7) => succeedContext(f(context7))));
var mapError3 = /* @__PURE__ */ dual(2, (self, f) => catchAll2(self, (error) => failSync3(() => f(error))));
var matchCause3 = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => {
  const fold2 = Object.create(proto3);
  fold2._op_layer = OP_FOLD;
  fold2.layer = self;
  fold2.failureK = onFailure;
  fold2.successK = onSuccess;
  return fold2;
});
var match13 = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => matchCause3(self, {
  onFailure: (cause3) => {
    const failureOrCause3 = failureOrCause2(cause3);
    switch (failureOrCause3._tag) {
      case "Left": {
        return onFailure(failureOrCause3.left);
      }
      case "Right": {
        return failCause7(failureOrCause3.right);
      }
    }
  },
  onSuccess
}));
var memoize2 = (self) => scopeWith((scope5) => map10(memoize(buildWithScope(self, scope5)), fromEffectContext));
var merge6 = /* @__PURE__ */ dual(2, (self, that) => zipWith6(self, that, (a, b) => merge3(a, b)));
var mergeAll4 = (...layers) => {
  const mergeAll9 = Object.create(proto3);
  mergeAll9._op_layer = OP_MERGE_ALL;
  mergeAll9.layers = layers;
  return mergeAll9;
};
var orDie2 = (self) => catchAll2(self, (defect) => die6(defect));
var orElse5 = /* @__PURE__ */ dual(2, (self, that) => catchAll2(self, that));
var passthrough = (self) => merge6(context2(), self);
var project = /* @__PURE__ */ dual(4, (self, tagA, tagB, f) => map16(self, (context7) => make5(tagB, f(unsafeGet3(context7, tagA)))));
var retry = /* @__PURE__ */ dual(2, (self, schedule3) => suspend3(() => {
  const stateTag = GenericTag("effect/Layer/retry/{ state: unknown }");
  return pipe(succeed7(stateTag, {
    state: schedule3.initial
  }), flatMap11((env) => retryLoop(self, schedule3, stateTag, pipe(env, get3(stateTag)).state)));
}));
var retryLoop = (self, schedule3, stateTag, state) => {
  return pipe(self, catchAll2((error) => pipe(retryUpdate(schedule3, stateTag, error, state), flatMap11((env) => fresh(retryLoop(self, schedule3, stateTag, pipe(env, get3(stateTag)).state))))));
};
var retryUpdate = (schedule3, stateTag, error, state) => {
  return fromEffect4(stateTag, pipe(currentTimeMillis2, flatMap7((now) => pipe(schedule3.step(now, error, state), flatMap7(([state2, _, decision]) => isDone5(decision) ? fail2(error) : pipe(sleep2(millis(start2(decision.intervals) - now)), as3({
    state: state2
  })))))));
};
var scoped2 = /* @__PURE__ */ dual(2, (a, b) => {
  const tagFirst = isTag2(a);
  const tag2 = tagFirst ? a : b;
  const effect3 = tagFirst ? b : a;
  return scopedContext(map10(effect3, (service3) => make5(tag2, service3)));
});
var scopedDiscard = (effect3) => scopedContext(pipe(effect3, as3(empty3())));
var scopedContext = (effect3) => {
  const scoped7 = Object.create(proto3);
  scoped7._op_layer = OP_SCOPED;
  scoped7.effect = effect3;
  return scoped7;
};
var scope2 = /* @__PURE__ */ scopedContext(/* @__PURE__ */ map10(/* @__PURE__ */ acquireRelease(/* @__PURE__ */ scopeMake(), (scope5, exit4) => scope5.close(exit4)), (scope5) => make5(Scope, scope5)));
var service = (tag2) => fromEffect4(tag2, tag2);
var succeed7 = /* @__PURE__ */ dual(2, (a, b) => {
  const tagFirst = isTag2(a);
  const tag2 = tagFirst ? a : b;
  const resource = tagFirst ? b : a;
  return fromEffectContext(succeed(make5(tag2, resource)));
});
var succeedContext = (context7) => {
  return fromEffectContext(succeed(context7));
};
var empty30 = /* @__PURE__ */ succeedContext(/* @__PURE__ */ empty3());
var suspend3 = (evaluate2) => {
  const suspend9 = Object.create(proto3);
  suspend9._op_layer = OP_SUSPEND;
  suspend9.evaluate = evaluate2;
  return suspend9;
};
var sync4 = /* @__PURE__ */ dual(2, (a, b) => {
  const tagFirst = isTag2(a);
  const tag2 = tagFirst ? a : b;
  const evaluate2 = tagFirst ? b : a;
  return fromEffectContext(sync(() => make5(tag2, evaluate2())));
});
var syncContext = (evaluate2) => {
  return fromEffectContext(sync(evaluate2));
};
var tap3 = /* @__PURE__ */ dual(2, (self, f) => flatMap11(self, (context7) => fromEffectContext(as3(f(context7), context7))));
var tapError2 = /* @__PURE__ */ dual(2, (self, f) => catchAll2(self, (e) => fromEffectContext(flatMap7(f(e), () => fail2(e)))));
var tapErrorCause2 = /* @__PURE__ */ dual(2, (self, f) => catchAllCause2(self, (cause3) => fromEffectContext(flatMap7(f(cause3), () => failCause(cause3)))));
var toRuntime = (self) => pipe(scopeWith((scope5) => buildWithScope(self, scope5)), flatMap7((context7) => pipe(runtime2(), provideContext(context7))));
var toRuntimeWithMemoMap = /* @__PURE__ */ dual(2, (self, memoMap) => flatMap7(scopeWith((scope5) => buildWithMemoMap(self, memoMap, scope5)), (context7) => pipe(runtime2(), provideContext(context7))));
var provide = /* @__PURE__ */ dual(2, (self, that) => suspend3(() => {
  const provideTo = Object.create(proto3);
  provideTo._op_layer = OP_PROVIDE;
  provideTo.first = Object.create(proto3, {
    _op_layer: {
      value: OP_PROVIDE_MERGE,
      enumerable: true
    },
    first: {
      value: context2(),
      enumerable: true
    },
    second: {
      value: Array.isArray(that) ? mergeAll4(...that) : that
    },
    zipK: {
      value: (a, b) => pipe(a, merge3(b))
    }
  });
  provideTo.second = self;
  return provideTo;
}));
var provideMerge = /* @__PURE__ */ dual(2, (that, self) => {
  const zipWith14 = Object.create(proto3);
  zipWith14._op_layer = OP_PROVIDE_MERGE;
  zipWith14.first = self;
  zipWith14.second = provide(that, self);
  zipWith14.zipK = (a, b) => {
    return pipe(a, merge3(b));
  };
  return zipWith14;
});
var zipWith6 = /* @__PURE__ */ dual(3, (self, that, f) => suspend3(() => {
  const zipWith14 = Object.create(proto3);
  zipWith14._op_layer = OP_ZIP_WITH2;
  zipWith14.first = self;
  zipWith14.second = that;
  zipWith14.zipK = f;
  return zipWith14;
}));
var unwrapEffect = (self) => {
  const tag2 = GenericTag("effect/Layer/unwrapEffect/Layer.Layer<R1, E1, A>");
  return flatMap11(fromEffect4(tag2, self), (context7) => get3(context7, tag2));
};
var unwrapScoped = (self) => {
  const tag2 = GenericTag("effect/Layer/unwrapScoped/Layer.Layer<R1, E1, A>");
  return flatMap11(scoped2(tag2, self), (context7) => get3(context7, tag2));
};
var annotateLogs2 = /* @__PURE__ */ dual((args2) => isLayer(args2[0]), function() {
  const args2 = arguments;
  return fiberRefLocallyWith2(args2[0], currentLogAnnotations, typeof args2[1] === "string" ? set3(args2[1], args2[2]) : (annotations2) => Object.entries(args2[1]).reduce((acc, [key, value]) => set3(acc, key, value), annotations2));
});
var annotateSpans2 = /* @__PURE__ */ dual((args2) => isLayer(args2[0]), function() {
  const args2 = arguments;
  return fiberRefLocallyWith2(args2[0], currentTracerSpanAnnotations, typeof args2[1] === "string" ? set3(args2[1], args2[2]) : (annotations2) => Object.entries(args2[1]).reduce((acc, [key, value]) => set3(acc, key, value), annotations2));
});
var withSpan2 = function() {
  const dataFirst = typeof arguments[0] !== "string";
  const name = dataFirst ? arguments[1] : arguments[0];
  const options = addSpanStackTrace(dataFirst ? arguments[2] : arguments[1]);
  if (dataFirst) {
    const self = arguments[0];
    return unwrapScoped(map10(options?.onEnd ? tap2(makeSpanScoped(name, options), (span4) => addFinalizer((exit4) => options.onEnd(span4, exit4))) : makeSpanScoped(name, options), (span4) => withParentSpan2(self, span4)));
  }
  return (self) => unwrapScoped(map10(options?.onEnd ? tap2(makeSpanScoped(name, options), (span4) => addFinalizer((exit4) => options.onEnd(span4, exit4))) : makeSpanScoped(name, options), (span4) => withParentSpan2(self, span4)));
};
var withParentSpan2 = /* @__PURE__ */ dual(2, (self, span4) => provide(self, succeedContext(make5(spanTag, span4))));
var provideSomeLayer = /* @__PURE__ */ dual(2, (self, layer2) => scopedWith((scope5) => flatMap7(buildWithScope(layer2, scope5), (context7) => provideSomeContext(self, context7))));
var provideSomeRuntime = /* @__PURE__ */ dual(2, (self, rt) => {
  const patchRefs = diff6(defaultRuntime.fiberRefs, rt.fiberRefs);
  const patchFlags = diff4(defaultRuntime.runtimeFlags, rt.runtimeFlags);
  return uninterruptibleMask((restore) => withFiberRuntime((fiber) => {
    const oldContext = fiber.getFiberRef(currentContext);
    const oldRefs = fiber.getFiberRefs();
    const newRefs = patch7(fiber.id(), oldRefs)(patchRefs);
    const oldFlags = fiber.currentRuntimeFlags;
    const newFlags = patch4(patchFlags)(oldFlags);
    const rollbackRefs = diff6(newRefs, oldRefs);
    const rollbackFlags = diff4(newFlags, oldFlags);
    fiber.setFiberRefs(newRefs);
    fiber.currentRuntimeFlags = newFlags;
    return ensuring(provideSomeContext(restore(self), merge3(oldContext, rt.context)), withFiberRuntime((fiber2) => {
      fiber2.setFiberRefs(patch7(fiber2.id(), fiber2.getFiberRefs())(rollbackRefs));
      fiber2.currentRuntimeFlags = patch4(rollbackFlags)(fiber2.currentRuntimeFlags);
      return void_2;
    }));
  }));
});
var effect_provide = /* @__PURE__ */ dual(2, (self, source) => {
  if (Array.isArray(source)) {
    return provideSomeLayer(self, mergeAll4(...source));
  } else if (isLayer(source)) {
    return provideSomeLayer(self, source);
  } else if (isContext2(source)) {
    return provideSomeContext(self, source);
  } else if (TypeId16 in source) {
    return flatMap7(source.runtimeEffect, (rt) => provideSomeRuntime(self, rt));
  } else {
    return provideSomeRuntime(self, source);
  }
});

// node_modules/effect/dist/esm/internal/console.js
var console2 = /* @__PURE__ */ map10(/* @__PURE__ */ fiberRefGet(currentServices), /* @__PURE__ */ get3(consoleTag));
var consoleWith = (f) => fiberRefGetWith(currentServices, (services) => f(get3(services, consoleTag)));
var withConsole = /* @__PURE__ */ dual(2, (effect3, value) => fiberRefLocallyWith(effect3, currentServices, add2(consoleTag, value)));
var withConsoleScoped = (console4) => fiberRefLocallyScopedWith(currentServices, add2(consoleTag, console4));

// node_modules/effect/dist/esm/Data.js
var Data_exports = {};
__export(Data_exports, {
  Class: () => Class3,
  Error: () => Error3,
  Structural: () => Structural2,
  TaggedClass: () => TaggedClass,
  TaggedError: () => TaggedError,
  array: () => array3,
  case: () => _case,
  struct: () => struct2,
  tagged: () => tagged2,
  taggedEnum: () => taggedEnum,
  tuple: () => tuple2,
  unsafeArray: () => unsafeArray,
  unsafeStruct: () => unsafeStruct
});
var struct2 = struct;
var unsafeStruct = (as13) => Object.setPrototypeOf(as13, StructuralPrototype);
var tuple2 = (...as13) => unsafeArray(as13);
var array3 = (as13) => unsafeArray(as13.slice(0));
var unsafeArray = (as13) => Object.setPrototypeOf(as13, ArrayProto);
var _case = () => (args2) => args2 === void 0 ? Object.create(StructuralPrototype) : struct2(args2);
var tagged2 = (tag2) => (args2) => {
  const value = args2 === void 0 ? Object.create(StructuralPrototype) : struct2(args2);
  value._tag = tag2;
  return value;
};
var Class3 = Structural;
var TaggedClass = (tag2) => {
  class Base3 extends Class3 {
    _tag = tag2;
  }
  return Base3;
};
var Structural2 = Structural;
var taggedEnum = () => new Proxy({}, {
  get(_target, tag2, _receiver) {
    if (tag2 === "$is") {
      return isTagged;
    } else if (tag2 === "$match") {
      return taggedMatch;
    }
    return tagged2(tag2);
  }
});
function taggedMatch() {
  if (arguments.length === 1) {
    const cases2 = arguments[0];
    return function(value2) {
      return cases2[value2._tag](value2);
    };
  }
  const value = arguments[0];
  const cases = arguments[1];
  return cases[value._tag](value);
}
var Error3 = /* @__PURE__ */ (function() {
  const plainArgsSymbol = /* @__PURE__ */ Symbol.for("effect/Data/Error/plainArgs");
  const O = {
    BaseEffectError: class extends YieldableError {
      constructor(args2) {
        super(args2?.message, args2?.cause ? {
          cause: args2.cause
        } : void 0);
        if (args2) {
          Object.assign(this, args2);
          Object.defineProperty(this, plainArgsSymbol, {
            value: args2,
            enumerable: false
          });
        }
      }
      toJSON() {
        return {
          ...this[plainArgsSymbol],
          ...this
        };
      }
    }
  };
  return O.BaseEffectError;
})();
var TaggedError = (tag2) => {
  const O = {
    BaseEffectError: class extends Error3 {
      _tag = tag2;
    }
  };
  O.BaseEffectError.prototype.name = tag2;
  return O.BaseEffectError;
};

// node_modules/effect/dist/esm/internal/dateTime.js
var TypeId17 = /* @__PURE__ */ Symbol.for("effect/DateTime");
var TimeZoneTypeId = /* @__PURE__ */ Symbol.for("effect/DateTime/TimeZone");
var Proto2 = {
  [TypeId17]: TypeId17,
  pipe() {
    return pipeArguments(this, arguments);
  },
  [NodeInspectSymbol]() {
    return this.toString();
  },
  toJSON() {
    return toDateUtc(this).toJSON();
  }
};
var ProtoUtc = {
  ...Proto2,
  _tag: "Utc",
  [symbol]() {
    return cached(this, number2(this.epochMillis));
  },
  [symbol2](that) {
    return isDateTime(that) && that._tag === "Utc" && this.epochMillis === that.epochMillis;
  },
  toString() {
    return `DateTime.Utc(${toDateUtc(this).toJSON()})`;
  }
};
var ProtoZoned = {
  ...Proto2,
  _tag: "Zoned",
  [symbol]() {
    return pipe(number2(this.epochMillis), combine(hash(this.zone)), cached(this));
  },
  [symbol2](that) {
    return isDateTime(that) && that._tag === "Zoned" && this.epochMillis === that.epochMillis && equals(this.zone, that.zone);
  },
  toString() {
    return `DateTime.Zoned(${formatIsoZoned(this)})`;
  }
};
var ProtoTimeZone = {
  [TimeZoneTypeId]: TimeZoneTypeId,
  [NodeInspectSymbol]() {
    return this.toString();
  }
};
var ProtoTimeZoneNamed = {
  ...ProtoTimeZone,
  _tag: "Named",
  [symbol]() {
    return cached(this, string(`Named:${this.id}`));
  },
  [symbol2](that) {
    return isTimeZone(that) && that._tag === "Named" && this.id === that.id;
  },
  toString() {
    return `TimeZone.Named(${this.id})`;
  },
  toJSON() {
    return {
      _id: "TimeZone",
      _tag: "Named",
      id: this.id
    };
  }
};
var ProtoTimeZoneOffset = {
  ...ProtoTimeZone,
  _tag: "Offset",
  [symbol]() {
    return cached(this, string(`Offset:${this.offset}`));
  },
  [symbol2](that) {
    return isTimeZone(that) && that._tag === "Offset" && this.offset === that.offset;
  },
  toString() {
    return `TimeZone.Offset(${offsetToString(this.offset)})`;
  },
  toJSON() {
    return {
      _id: "TimeZone",
      _tag: "Offset",
      offset: this.offset
    };
  }
};
var makeZonedProto = (epochMillis, zone, partsUtc) => {
  const self = Object.create(ProtoZoned);
  self.epochMillis = epochMillis;
  self.zone = zone;
  Object.defineProperty(self, "partsUtc", {
    value: partsUtc,
    enumerable: false,
    writable: true
  });
  Object.defineProperty(self, "adjustedEpochMillis", {
    value: void 0,
    enumerable: false,
    writable: true
  });
  Object.defineProperty(self, "partsAdjusted", {
    value: void 0,
    enumerable: false,
    writable: true
  });
  return self;
};
var isDateTime = (u) => hasProperty(u, TypeId17);
var isDateTimeArgs = (args2) => isDateTime(args2[0]);
var isTimeZone = (u) => hasProperty(u, TimeZoneTypeId);
var isTimeZoneNamed = (u) => isTimeZone(u) && u._tag === "Named";
var isZoned = (self) => self._tag === "Zoned";
var makeUtc = (epochMillis) => {
  const self = Object.create(ProtoUtc);
  self.epochMillis = epochMillis;
  Object.defineProperty(self, "partsUtc", {
    value: void 0,
    enumerable: false,
    writable: true
  });
  return self;
};
var unsafeFromDate = (date) => {
  const epochMillis = date.getTime();
  if (Number.isNaN(epochMillis)) {
    throw new IllegalArgumentException2("Invalid date");
  }
  return makeUtc(epochMillis);
};
var unsafeMake10 = (input) => {
  if (isDateTime(input)) {
    return input;
  } else if (input instanceof Date) {
    return unsafeFromDate(input);
  } else if (typeof input === "object") {
    const date = /* @__PURE__ */ new Date(0);
    setPartsDate(date, input);
    return unsafeFromDate(date);
  } else if (typeof input === "string" && !hasZone(input)) {
    return unsafeFromDate(/* @__PURE__ */ new Date(input + "Z"));
  }
  return unsafeFromDate(new Date(input));
};
var hasZone = (input) => /Z|[+-]\d{2}$|[+-]\d{2}:?\d{2}$|\]$/.test(input);
var minEpochMillis = -864e13 + 12 * 60 * 60 * 1e3;
var maxEpochMillis = 864e13 - 14 * 60 * 60 * 1e3;
var unsafeMakeZoned = (input, options) => {
  if (options?.timeZone === void 0 && isDateTime(input) && isZoned(input)) {
    return input;
  }
  const self = unsafeMake10(input);
  if (self.epochMillis < minEpochMillis || self.epochMillis > maxEpochMillis) {
    throw new RangeError(`Epoch millis out of range: ${self.epochMillis}`);
  }
  let zone;
  if (options?.timeZone === void 0) {
    const offset = new Date(self.epochMillis).getTimezoneOffset() * -60 * 1e3;
    zone = zoneMakeOffset(offset);
  } else if (isTimeZone(options?.timeZone)) {
    zone = options.timeZone;
  } else if (typeof options?.timeZone === "number") {
    zone = zoneMakeOffset(options.timeZone);
  } else {
    const parsedZone = zoneFromString(options.timeZone);
    if (isNone2(parsedZone)) {
      throw new IllegalArgumentException2(`Invalid time zone: ${options.timeZone}`);
    }
    zone = parsedZone.value;
  }
  if (options?.adjustForTimeZone !== true) {
    return makeZonedProto(self.epochMillis, zone, self.partsUtc);
  }
  return makeZonedFromAdjusted(self.epochMillis, zone, options?.disambiguation ?? "compatible");
};
var validZoneCache = /* @__PURE__ */ globalValue("effect/DateTime/validZoneCache", () => /* @__PURE__ */ new Map());
var formatOptions = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZoneName: "longOffset",
  fractionalSecondDigits: 3,
  hourCycle: "h23"
};
var zoneMakeIntl = (format4) => {
  const zoneId = format4.resolvedOptions().timeZone;
  if (validZoneCache.has(zoneId)) {
    return validZoneCache.get(zoneId);
  }
  const zone = Object.create(ProtoTimeZoneNamed);
  zone.id = zoneId;
  zone.format = format4;
  validZoneCache.set(zoneId, zone);
  return zone;
};
var zoneUnsafeMakeNamed = (zoneId) => {
  if (validZoneCache.has(zoneId)) {
    return validZoneCache.get(zoneId);
  }
  try {
    return zoneMakeIntl(new Intl.DateTimeFormat("en-US", {
      ...formatOptions,
      timeZone: zoneId
    }));
  } catch {
    throw new IllegalArgumentException2(`Invalid time zone: ${zoneId}`);
  }
};
var zoneMakeOffset = (offset) => {
  const zone = Object.create(ProtoTimeZoneOffset);
  zone.offset = offset;
  return zone;
};
var zoneMakeNamed = /* @__PURE__ */ liftThrowable(zoneUnsafeMakeNamed);
var offsetZoneRegex = /^(?:GMT|[+-])/;
var zoneFromString = (zone) => {
  if (offsetZoneRegex.test(zone)) {
    const offset = parseOffset(zone);
    return offset === null ? none2() : some2(zoneMakeOffset(offset));
  }
  return zoneMakeNamed(zone);
};
var toDateUtc = (self) => new Date(self.epochMillis);
var toDate = (self) => {
  if (self._tag === "Utc") {
    return new Date(self.epochMillis);
  } else if (self.zone._tag === "Offset") {
    return new Date(self.epochMillis + self.zone.offset);
  } else if (self.adjustedEpochMillis !== void 0) {
    return new Date(self.adjustedEpochMillis);
  }
  const parts2 = self.zone.format.formatToParts(self.epochMillis).filter((_) => _.type !== "literal");
  const date = /* @__PURE__ */ new Date(0);
  date.setUTCFullYear(Number(parts2[2].value), Number(parts2[0].value) - 1, Number(parts2[1].value));
  date.setUTCHours(Number(parts2[3].value), Number(parts2[4].value), Number(parts2[5].value), Number(parts2[6].value));
  self.adjustedEpochMillis = date.getTime();
  return date;
};
var zonedOffset = (self) => {
  const date = toDate(self);
  return date.getTime() - toEpochMillis(self);
};
var offsetToString = (offset) => {
  const abs = Math.abs(offset);
  let hours2 = Math.floor(abs / (60 * 60 * 1e3));
  let minutes2 = Math.round(abs % (60 * 60 * 1e3) / (60 * 1e3));
  if (minutes2 === 60) {
    hours2 += 1;
    minutes2 = 0;
  }
  return `${offset < 0 ? "-" : "+"}${String(hours2).padStart(2, "0")}:${String(minutes2).padStart(2, "0")}`;
};
var zonedOffsetIso = (self) => offsetToString(zonedOffset(self));
var toEpochMillis = (self) => self.epochMillis;
var dateToParts = (date) => ({
  millis: date.getUTCMilliseconds(),
  seconds: date.getUTCSeconds(),
  minutes: date.getUTCMinutes(),
  hours: date.getUTCHours(),
  day: date.getUTCDate(),
  weekDay: date.getUTCDay(),
  month: date.getUTCMonth() + 1,
  year: date.getUTCFullYear()
});
var toParts = (self) => {
  if (self._tag === "Utc") {
    return toPartsUtc(self);
  } else if (self.partsAdjusted !== void 0) {
    return self.partsAdjusted;
  }
  self.partsAdjusted = withDate(self, dateToParts);
  return self.partsAdjusted;
};
var toPartsUtc = (self) => {
  if (self.partsUtc !== void 0) {
    return self.partsUtc;
  }
  self.partsUtc = withDateUtc(self, dateToParts);
  return self.partsUtc;
};
var setPartsDate = (date, parts2) => {
  if (parts2.year !== void 0) {
    date.setUTCFullYear(parts2.year);
  }
  if (parts2.month !== void 0) {
    date.setUTCMonth(parts2.month - 1);
  }
  if (parts2.day !== void 0) {
    date.setUTCDate(parts2.day);
  }
  if (parts2.weekDay !== void 0) {
    const diff8 = parts2.weekDay - date.getUTCDay();
    date.setUTCDate(date.getUTCDate() + diff8);
  }
  if (parts2.hours !== void 0) {
    date.setUTCHours(parts2.hours);
  }
  if (parts2.minutes !== void 0) {
    date.setUTCMinutes(parts2.minutes);
  }
  if (parts2.seconds !== void 0) {
    date.setUTCSeconds(parts2.seconds);
  }
  if (parts2.millis !== void 0) {
    date.setUTCMilliseconds(parts2.millis);
  }
};
var constDayMillis = 24 * 60 * 60 * 1e3;
var makeZonedFromAdjusted = (adjustedMillis, zone, disambiguation) => {
  if (zone._tag === "Offset") {
    return makeZonedProto(adjustedMillis - zone.offset, zone);
  }
  const beforeOffset = calculateNamedOffset(adjustedMillis - constDayMillis, adjustedMillis, zone);
  const afterOffset = calculateNamedOffset(adjustedMillis + constDayMillis, adjustedMillis, zone);
  if (beforeOffset === afterOffset) {
    return makeZonedProto(adjustedMillis - beforeOffset, zone);
  }
  const isForwards = beforeOffset < afterOffset;
  const transitionMillis = beforeOffset - afterOffset;
  if (isForwards) {
    const currentAfterOffset = calculateNamedOffset(adjustedMillis - afterOffset, adjustedMillis, zone);
    if (currentAfterOffset === afterOffset) {
      return makeZonedProto(adjustedMillis - afterOffset, zone);
    }
    const before2 = makeZonedProto(adjustedMillis - beforeOffset, zone);
    const beforeAdjustedMillis = toDate(before2).getTime();
    if (adjustedMillis !== beforeAdjustedMillis) {
      switch (disambiguation) {
        case "reject": {
          const formatted = new Date(adjustedMillis).toISOString();
          throw new RangeError(`Gap time: ${formatted} does not exist in time zone ${zone.id}`);
        }
        case "earlier":
          return makeZonedProto(adjustedMillis - afterOffset, zone);
        case "compatible":
        case "later":
          return before2;
      }
    }
    return before2;
  }
  const currentBeforeOffset = calculateNamedOffset(adjustedMillis - beforeOffset, adjustedMillis, zone);
  if (currentBeforeOffset === beforeOffset) {
    if (disambiguation === "earlier" || disambiguation === "compatible") {
      return makeZonedProto(adjustedMillis - beforeOffset, zone);
    }
    const laterOffset = calculateNamedOffset(adjustedMillis - beforeOffset + transitionMillis, adjustedMillis + transitionMillis, zone);
    if (laterOffset === beforeOffset) {
      return makeZonedProto(adjustedMillis - beforeOffset, zone);
    }
    if (disambiguation === "reject") {
      const formatted = new Date(adjustedMillis).toISOString();
      throw new RangeError(`Ambiguous time: ${formatted} occurs twice in time zone ${zone.id}`);
    }
  }
  return makeZonedProto(adjustedMillis - afterOffset, zone);
};
var offsetRegex = /([+-])(\d{2}):(\d{2})$/;
var parseOffset = (offset) => {
  const match19 = offsetRegex.exec(offset);
  if (match19 === null) {
    return null;
  }
  const [, sign, hours2, minutes2] = match19;
  return (sign === "+" ? 1 : -1) * (Number(hours2) * 60 + Number(minutes2)) * 60 * 1e3;
};
var calculateNamedOffset = (utcMillis, adjustedMillis, zone) => {
  const offset = zone.format.formatToParts(utcMillis).find((_) => _.type === "timeZoneName")?.value ?? "";
  if (offset === "GMT") {
    return 0;
  }
  const result = parseOffset(offset);
  if (result === null) {
    return zonedOffset(makeZonedProto(adjustedMillis, zone));
  }
  return result;
};
var mutate4 = /* @__PURE__ */ dual(isDateTimeArgs, (self, f, options) => {
  if (self._tag === "Utc") {
    const date = toDateUtc(self);
    f(date);
    return makeUtc(date.getTime());
  }
  const adjustedDate = toDate(self);
  const newAdjustedDate = new Date(adjustedDate.getTime());
  f(newAdjustedDate);
  return makeZonedFromAdjusted(newAdjustedDate.getTime(), self.zone, options?.disambiguation ?? "compatible");
});
var withDate = /* @__PURE__ */ dual(2, (self, f) => f(toDate(self)));
var withDateUtc = /* @__PURE__ */ dual(2, (self, f) => f(toDateUtc(self)));
var formatIsoOffset = (self) => {
  const date = toDate(self);
  return self._tag === "Utc" ? date.toISOString() : `${date.toISOString().slice(0, -1)}${zonedOffsetIso(self)}`;
};
var formatIsoZoned = (self) => self.zone._tag === "Offset" ? formatIsoOffset(self) : `${formatIsoOffset(self)}[${self.zone.id}]`;

// node_modules/effect/dist/esm/String.js
var isNonEmpty6 = (self) => self.length > 0;

// node_modules/effect/dist/esm/Cron.js
var TypeId18 = /* @__PURE__ */ Symbol.for("effect/Cron");
var CronProto = {
  [TypeId18]: TypeId18,
  [symbol2](that) {
    return isCron(that) && equals3(this, that);
  },
  [symbol]() {
    return pipe(hash(this.tz), combine(array2(fromIterable2(this.seconds))), combine(array2(fromIterable2(this.minutes))), combine(array2(fromIterable2(this.hours))), combine(array2(fromIterable2(this.days))), combine(array2(fromIterable2(this.months))), combine(array2(fromIterable2(this.weekdays))), cached(this));
  },
  toString() {
    return format(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Cron",
      tz: this.tz,
      seconds: fromIterable2(this.seconds),
      minutes: fromIterable2(this.minutes),
      hours: fromIterable2(this.hours),
      days: fromIterable2(this.days),
      months: fromIterable2(this.months),
      weekdays: fromIterable2(this.weekdays)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isCron = (u) => hasProperty(u, TypeId18);
var make42 = (values3) => {
  const o = Object.create(CronProto);
  o.seconds = new Set(sort(values3.seconds ?? [0], Order));
  o.minutes = new Set(sort(values3.minutes, Order));
  o.hours = new Set(sort(values3.hours, Order));
  o.days = new Set(sort(values3.days, Order));
  o.months = new Set(sort(values3.months, Order));
  o.weekdays = new Set(sort(values3.weekdays, Order));
  o.tz = fromNullable(values3.tz);
  const seconds2 = Array.from(o.seconds);
  const minutes2 = Array.from(o.minutes);
  const hours2 = Array.from(o.hours);
  const days2 = Array.from(o.days);
  const months = Array.from(o.months);
  const weekdays = Array.from(o.weekdays);
  o.first = {
    second: seconds2[0] ?? 0,
    minute: minutes2[0] ?? 0,
    hour: hours2[0] ?? 0,
    day: days2[0] ?? 1,
    month: (months[0] ?? 1) - 1,
    weekday: weekdays[0] ?? 0
  };
  o.next = {
    second: nextLookupTable(seconds2, 60),
    minute: nextLookupTable(minutes2, 60),
    hour: nextLookupTable(hours2, 24),
    day: nextLookupTable(days2, 32),
    month: nextLookupTable(months, 13),
    weekday: nextLookupTable(weekdays, 7)
  };
  return o;
};
var nextLookupTable = (values3, size13) => {
  const result = new Array(size13).fill(void 0);
  if (values3.length === 0) {
    return result;
  }
  let current = void 0;
  let index = values3.length - 1;
  for (let i = size13 - 1; i >= 0; i--) {
    while (index >= 0 && values3[index] >= i) {
      current = values3[index--];
    }
    result[i] = current;
  }
  return result;
};
var ParseErrorTypeId = /* @__PURE__ */ Symbol.for("effect/Cron/errors/ParseError");
var ParseError = class extends (/* @__PURE__ */ TaggedError("CronParseError")) {
  /**
   * @since 2.0.0
   */
  [ParseErrorTypeId] = ParseErrorTypeId;
};
var parse = (cron3, tz) => {
  const segments = cron3.split(" ").filter(isNonEmpty6);
  if (segments.length !== 5 && segments.length !== 6) {
    return left2(new ParseError({
      message: `Invalid number of segments in cron expression`,
      input: cron3
    }));
  }
  if (segments.length === 5) {
    segments.unshift("0");
  }
  const [seconds2, minutes2, hours2, days2, months, weekdays] = segments;
  const zone = tz === void 0 || isTimeZone(tz) ? right2(tz) : fromOption2(zoneFromString(tz), () => new ParseError({
    message: `Invalid time zone in cron expression`,
    input: tz
  }));
  return all({
    tz: zone,
    seconds: parseSegment(seconds2, secondOptions),
    minutes: parseSegment(minutes2, minuteOptions),
    hours: parseSegment(hours2, hourOptions),
    days: parseSegment(days2, dayOptions),
    months: parseSegment(months, monthOptions),
    weekdays: parseSegment(weekdays, weekdayOptions)
  }).pipe(map(make42));
};
var match14 = (cron3, date) => {
  const parts2 = unsafeMakeZoned(date, {
    timeZone: getOrUndefined(cron3.tz)
  }).pipe(toParts);
  if (cron3.seconds.size !== 0 && !cron3.seconds.has(parts2.seconds)) {
    return false;
  }
  if (cron3.minutes.size !== 0 && !cron3.minutes.has(parts2.minutes)) {
    return false;
  }
  if (cron3.hours.size !== 0 && !cron3.hours.has(parts2.hours)) {
    return false;
  }
  if (cron3.months.size !== 0 && !cron3.months.has(parts2.month)) {
    return false;
  }
  if (cron3.days.size === 0 && cron3.weekdays.size === 0) {
    return true;
  }
  if (cron3.weekdays.size === 0) {
    return cron3.days.has(parts2.day);
  }
  if (cron3.days.size === 0) {
    return cron3.weekdays.has(parts2.weekDay);
  }
  return cron3.days.has(parts2.day) || cron3.weekdays.has(parts2.weekDay);
};
var daysInMonth = (date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
var next2 = (cron3, startFrom) => {
  const tz = getOrUndefined(cron3.tz);
  const zoned = unsafeMakeZoned(startFrom ?? /* @__PURE__ */ new Date(), {
    timeZone: tz
  });
  const utc = tz !== void 0 && isTimeZoneNamed(tz) && tz.id === "UTC";
  const adjustDst = utc ? constVoid : (current) => {
    const adjusted = unsafeMakeZoned(current, {
      timeZone: zoned.zone,
      adjustForTimeZone: true
    }).pipe(toDate);
    const drift = current.getTime() - adjusted.getTime();
    if (drift > 0) {
      current.setTime(current.getTime() + drift);
    }
  };
  const result = mutate4(zoned, (current) => {
    current.setUTCSeconds(current.getUTCSeconds() + 1, 0);
    for (let i = 0; i < 1e4; i++) {
      if (cron3.seconds.size !== 0) {
        const currentSecond = current.getUTCSeconds();
        const nextSecond2 = cron3.next.second[currentSecond];
        if (nextSecond2 === void 0) {
          current.setUTCMinutes(current.getUTCMinutes() + 1, cron3.first.second);
          adjustDst(current);
          continue;
        }
        if (nextSecond2 > currentSecond) {
          current.setUTCSeconds(nextSecond2);
          adjustDst(current);
          continue;
        }
      }
      if (cron3.minutes.size !== 0) {
        const currentMinute = current.getUTCMinutes();
        const nextMinute2 = cron3.next.minute[currentMinute];
        if (nextMinute2 === void 0) {
          current.setUTCHours(current.getUTCHours() + 1, cron3.first.minute, cron3.first.second);
          adjustDst(current);
          continue;
        }
        if (nextMinute2 > currentMinute) {
          current.setUTCMinutes(nextMinute2, cron3.first.second);
          adjustDst(current);
          continue;
        }
      }
      if (cron3.hours.size !== 0) {
        const currentHour = current.getUTCHours();
        const nextHour2 = cron3.next.hour[currentHour];
        if (nextHour2 === void 0) {
          current.setUTCDate(current.getUTCDate() + 1);
          current.setUTCHours(cron3.first.hour, cron3.first.minute, cron3.first.second);
          adjustDst(current);
          continue;
        }
        if (nextHour2 > currentHour) {
          current.setUTCHours(nextHour2, cron3.first.minute, cron3.first.second);
          adjustDst(current);
          continue;
        }
      }
      if (cron3.weekdays.size !== 0 || cron3.days.size !== 0) {
        let a = Infinity;
        let b = Infinity;
        if (cron3.weekdays.size !== 0) {
          const currentWeekday = current.getUTCDay();
          const nextWeekday = cron3.next.weekday[currentWeekday];
          a = nextWeekday === void 0 ? 7 - currentWeekday + cron3.first.weekday : nextWeekday - currentWeekday;
        }
        if (cron3.days.size !== 0 && a !== 0) {
          const currentDay = current.getUTCDate();
          const nextDay2 = cron3.next.day[currentDay];
          b = nextDay2 === void 0 ? daysInMonth(current) - currentDay + cron3.first.day : nextDay2 - currentDay;
        }
        const addDays = Math.min(a, b);
        if (addDays !== 0) {
          current.setUTCDate(current.getUTCDate() + addDays);
          current.setUTCHours(cron3.first.hour, cron3.first.minute, cron3.first.second);
          adjustDst(current);
          continue;
        }
      }
      if (cron3.months.size !== 0) {
        const currentMonth = current.getUTCMonth() + 1;
        const nextMonth = cron3.next.month[currentMonth];
        if (nextMonth === void 0) {
          current.setUTCFullYear(current.getUTCFullYear() + 1);
          current.setUTCMonth(cron3.first.month, cron3.first.day);
          current.setUTCHours(cron3.first.hour, cron3.first.minute, cron3.first.second);
          adjustDst(current);
          continue;
        }
        if (nextMonth > currentMonth) {
          current.setUTCMonth(nextMonth - 1, cron3.first.day);
          current.setUTCHours(cron3.first.hour, cron3.first.minute, cron3.first.second);
          adjustDst(current);
          continue;
        }
      }
      return;
    }
    throw new Error("Unable to find next cron date");
  });
  return toDateUtc(result);
};
var Equivalence2 = /* @__PURE__ */ make((self, that) => restrictionsEquals(self.seconds, that.seconds) && restrictionsEquals(self.minutes, that.minutes) && restrictionsEquals(self.hours, that.hours) && restrictionsEquals(self.days, that.days) && restrictionsEquals(self.months, that.months) && restrictionsEquals(self.weekdays, that.weekdays));
var restrictionsArrayEquals = /* @__PURE__ */ array(number);
var restrictionsEquals = (self, that) => restrictionsArrayEquals(fromIterable2(self), fromIterable2(that));
var equals3 = /* @__PURE__ */ dual(2, (self, that) => Equivalence2(self, that));
var secondOptions = {
  min: 0,
  max: 59
};
var minuteOptions = {
  min: 0,
  max: 59
};
var hourOptions = {
  min: 0,
  max: 23
};
var dayOptions = {
  min: 1,
  max: 31
};
var monthOptions = {
  min: 1,
  max: 12,
  aliases: {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12
  }
};
var weekdayOptions = {
  min: 0,
  max: 6,
  aliases: {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6
  }
};
var parseSegment = (input, options) => {
  const capacity3 = options.max - options.min + 1;
  const values3 = /* @__PURE__ */ new Set();
  const fields = input.split(",");
  for (const field of fields) {
    const [raw, step4] = splitStep(field);
    if (raw === "*" && step4 === void 0) {
      return right2(/* @__PURE__ */ new Set());
    }
    if (step4 !== void 0) {
      if (!Number.isInteger(step4)) {
        return left2(new ParseError({
          message: `Expected step value to be a positive integer`,
          input
        }));
      }
      if (step4 < 1) {
        return left2(new ParseError({
          message: `Expected step value to be greater than 0`,
          input
        }));
      }
      if (step4 > options.max) {
        return left2(new ParseError({
          message: `Expected step value to be less than ${options.max}`,
          input
        }));
      }
    }
    if (raw === "*") {
      for (let i = options.min; i <= options.max; i += step4 ?? 1) {
        values3.add(i);
      }
    } else {
      const [left3, right3] = splitRange(raw, options.aliases);
      if (!Number.isInteger(left3)) {
        return left2(new ParseError({
          message: `Expected a positive integer`,
          input
        }));
      }
      if (left3 < options.min || left3 > options.max) {
        return left2(new ParseError({
          message: `Expected a value between ${options.min} and ${options.max}`,
          input
        }));
      }
      if (right3 === void 0) {
        values3.add(left3);
      } else {
        if (!Number.isInteger(right3)) {
          return left2(new ParseError({
            message: `Expected a positive integer`,
            input
          }));
        }
        if (right3 < options.min || right3 > options.max) {
          return left2(new ParseError({
            message: `Expected a value between ${options.min} and ${options.max}`,
            input
          }));
        }
        if (left3 > right3) {
          return left2(new ParseError({
            message: `Invalid value range`,
            input
          }));
        }
        for (let i = left3; i <= right3; i += step4 ?? 1) {
          values3.add(i);
        }
      }
    }
    if (values3.size >= capacity3) {
      return right2(/* @__PURE__ */ new Set());
    }
  }
  return right2(values3);
};
var splitStep = (input) => {
  const seperator = input.indexOf("/");
  if (seperator !== -1) {
    return [input.slice(0, seperator), Number(input.slice(seperator + 1))];
  }
  return [input, void 0];
};
var splitRange = (input, aliases) => {
  const seperator = input.indexOf("-");
  if (seperator !== -1) {
    return [aliasOrValue(input.slice(0, seperator), aliases), aliasOrValue(input.slice(seperator + 1), aliases)];
  }
  return [aliasOrValue(input, aliases), void 0];
};
function aliasOrValue(field, aliases) {
  return aliases?.[field.toLocaleLowerCase()] ?? Number(field);
}

// node_modules/effect/dist/esm/Random.js
var next3 = next;
var fixed2 = fixed;

// node_modules/effect/dist/esm/internal/schedule.js
var ScheduleSymbolKey = "effect/Schedule";
var ScheduleTypeId = /* @__PURE__ */ Symbol.for(ScheduleSymbolKey);
var isSchedule = (u) => hasProperty(u, ScheduleTypeId);
var ScheduleDriverSymbolKey = "effect/ScheduleDriver";
var ScheduleDriverTypeId = /* @__PURE__ */ Symbol.for(ScheduleDriverSymbolKey);
var defaultIterationMetadata = {
  start: 0,
  now: 0,
  input: void 0,
  output: void 0,
  elapsed: zero,
  elapsedSincePrevious: zero,
  recurrence: 0
};
var CurrentIterationMetadata = /* @__PURE__ */ Reference2()("effect/Schedule/CurrentIterationMetadata", {
  defaultValue: () => defaultIterationMetadata
});
var scheduleVariance = {
  /* c8 ignore next */
  _Out: (_) => _,
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _R: (_) => _
};
var scheduleDriverVariance = {
  /* c8 ignore next */
  _Out: (_) => _,
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _R: (_) => _
};
var ScheduleImpl = class {
  initial;
  step;
  [ScheduleTypeId] = scheduleVariance;
  constructor(initial, step4) {
    this.initial = initial;
    this.step = step4;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var updateInfo = (iterationMetaRef, now, input, output) => update2(iterationMetaRef, (prev) => prev.recurrence === 0 ? {
  now,
  input,
  output,
  recurrence: prev.recurrence + 1,
  elapsed: zero,
  elapsedSincePrevious: zero,
  start: now
} : {
  now,
  input,
  output,
  recurrence: prev.recurrence + 1,
  elapsed: millis(now - prev.start),
  elapsedSincePrevious: millis(now - prev.now),
  start: prev.start
});
var ScheduleDriverImpl = class {
  schedule;
  ref;
  [ScheduleDriverTypeId] = scheduleDriverVariance;
  constructor(schedule3, ref) {
    this.schedule = schedule3;
    this.ref = ref;
  }
  get state() {
    return map10(get11(this.ref), (tuple3) => tuple3[1]);
  }
  get last() {
    return flatMap7(get11(this.ref), ([element, _]) => {
      switch (element._tag) {
        case "None": {
          return failSync(() => new NoSuchElementException());
        }
        case "Some": {
          return succeed(element.value);
        }
      }
    });
  }
  iterationMeta = /* @__PURE__ */ unsafeMake6(defaultIterationMetadata);
  get reset() {
    return set5(this.ref, [none2(), this.schedule.initial]).pipe(zipLeft2(set5(this.iterationMeta, defaultIterationMetadata)));
  }
  next(input) {
    return pipe(map10(get11(this.ref), (tuple3) => tuple3[1]), flatMap7((state) => pipe(currentTimeMillis2, flatMap7((now) => pipe(suspend(() => this.schedule.step(now, input, state)), flatMap7(([state2, out, decision]) => {
      const setState = set5(this.ref, [some2(out), state2]);
      if (isDone5(decision)) {
        return setState.pipe(zipRight2(fail2(none2())));
      }
      const millis2 = start2(decision.intervals) - now;
      if (millis2 <= 0) {
        return setState.pipe(zipRight2(updateInfo(this.iterationMeta, now, input, out)), as3(out));
      }
      const duration3 = millis(millis2);
      return pipe(setState, zipRight2(updateInfo(this.iterationMeta, now, input, out)), zipRight2(sleep3(duration3)), as3(out));
    }))))));
  }
};
var makeWithState = (initial, step4) => new ScheduleImpl(initial, step4);
var addDelay = /* @__PURE__ */ dual(2, (self, f) => addDelayEffect(self, (out) => sync(() => f(out))));
var addDelayEffect = /* @__PURE__ */ dual(2, (self, f) => modifyDelayEffect(self, (out, duration3) => map10(f(out), (delay3) => sum(duration3, decode(delay3)))));
var andThen6 = /* @__PURE__ */ dual(2, (self, that) => map17(andThenEither(self, that), merge));
var andThenEither = /* @__PURE__ */ dual(2, (self, that) => makeWithState([self.initial, that.initial, true], (now, input, state) => state[2] ? flatMap7(self.step(now, input, state[0]), ([lState, out, decision]) => {
  if (isDone5(decision)) {
    return map10(that.step(now, input, state[1]), ([rState, out2, decision2]) => [[lState, rState, false], right2(out2), decision2]);
  }
  return succeed([[lState, state[1], true], left2(out), decision]);
}) : map10(that.step(now, input, state[1]), ([rState, out, decision]) => [[state[0], rState, false], right2(out), decision])));
var as7 = /* @__PURE__ */ dual(2, (self, out) => map17(self, () => out));
var asVoid4 = (self) => map17(self, constVoid);
var bothInOut = /* @__PURE__ */ dual(2, (self, that) => makeWithState([self.initial, that.initial], (now, [in1, in2], state) => zipWith3(self.step(now, in1, state[0]), that.step(now, in2, state[1]), ([lState, out, lDecision], [rState, out2, rDecision]) => {
  if (isContinue2(lDecision) && isContinue2(rDecision)) {
    const interval = pipe(lDecision.intervals, union7(rDecision.intervals));
    return [[lState, rState], [out, out2], _continue2(interval)];
  }
  return [[lState, rState], [out, out2], done7];
})));
var check = /* @__PURE__ */ dual(2, (self, test) => checkEffect(self, (input, out) => sync(() => test(input, out))));
var checkEffect = /* @__PURE__ */ dual(2, (self, test) => makeWithState(self.initial, (now, input, state) => flatMap7(self.step(now, input, state), ([state2, out, decision]) => {
  if (isDone5(decision)) {
    return succeed([state2, out, done7]);
  }
  return map10(test(input, out), (cont) => cont ? [state2, out, decision] : [state2, out, done7]);
})));
var collectAllInputs = () => collectAllOutputs(identity2());
var collectAllOutputs = (self) => reduce12(self, empty4(), (outs, out) => pipe(outs, append2(out)));
var collectUntil = (f) => collectAllOutputs(recurUntil(f));
var collectUntilEffect = (f) => collectAllOutputs(recurUntilEffect(f));
var collectWhile = (f) => collectAllOutputs(recurWhile(f));
var collectWhileEffect = (f) => collectAllOutputs(recurWhileEffect(f));
var compose = /* @__PURE__ */ dual(2, (self, that) => makeWithState([self.initial, that.initial], (now, input, state) => flatMap7(self.step(now, input, state[0]), ([lState, out, lDecision]) => map10(that.step(now, out, state[1]), ([rState, out2, rDecision]) => isDone5(lDecision) ? [[lState, rState], out2, done7] : isDone5(rDecision) ? [[lState, rState], out2, done7] : [[lState, rState], out2, _continue2(pipe(lDecision.intervals, max5(rDecision.intervals)))]))));
var mapInput3 = /* @__PURE__ */ dual(2, (self, f) => mapInputEffect(self, (input2) => sync(() => f(input2))));
var mapInputContext2 = /* @__PURE__ */ dual(2, (self, f) => makeWithState(self.initial, (now, input, state) => mapInputContext(self.step(now, input, state), f)));
var mapInputEffect = /* @__PURE__ */ dual(2, (self, f) => makeWithState(self.initial, (now, input2, state) => flatMap7(f(input2), (input) => self.step(now, input, state))));
var cron = (expression, tz) => {
  const parsed = isCron(expression) ? right2(expression) : parse(expression, tz);
  return makeWithState([true, [Number.MIN_SAFE_INTEGER, 0, 0]], (now, _, [initial, previous]) => {
    if (now < previous[0]) {
      return succeed([[false, previous], [previous[1], previous[2]], continueWith2(make37(previous[1], previous[2]))]);
    }
    if (isLeft2(parsed)) {
      return die2(parsed.left);
    }
    const cron3 = parsed.right;
    const date = new Date(now);
    let next4;
    if (initial && match14(cron3, date)) {
      next4 = now;
    }
    next4 = next2(cron3, date).getTime();
    const start3 = beginningOfSecond(next4);
    const end4 = endOfSecond(next4);
    return succeed([[false, [next4, start3, end4]], [start3, end4], continueWith2(make37(start3, end4))]);
  });
};
var dayOfMonth = (day) => {
  return makeWithState([Number.NEGATIVE_INFINITY, 0], (now, _, state) => {
    if (!Number.isInteger(day) || day < 1 || 31 < day) {
      return dieSync(() => new IllegalArgumentException(`Invalid argument in: dayOfMonth(${day}). Must be in range 1...31`));
    }
    const n = state[1];
    const initial = n === 0;
    const day0 = nextDayOfMonth(now, day, initial);
    const start3 = beginningOfDay(day0);
    const end4 = endOfDay(day0);
    const interval = make37(start3, end4);
    return succeed([[end4, n + 1], n, continueWith2(interval)]);
  });
};
var dayOfWeek = (day) => {
  return makeWithState([Number.MIN_SAFE_INTEGER, 0], (now, _, state) => {
    if (!Number.isInteger(day) || day < 1 || 7 < day) {
      return dieSync(() => new IllegalArgumentException(`Invalid argument in: dayOfWeek(${day}). Must be in range 1 (Monday)...7 (Sunday)`));
    }
    const n = state[1];
    const initial = n === 0;
    const day0 = nextDay(now, day, initial);
    const start3 = beginningOfDay(day0);
    const end4 = endOfDay(day0);
    const interval = make37(start3, end4);
    return succeed([[end4, n + 1], n, continueWith2(interval)]);
  });
};
var delayed = /* @__PURE__ */ dual(2, (self, f) => delayedEffect(self, (duration3) => sync(() => f(duration3))));
var delayedEffect = /* @__PURE__ */ dual(2, (self, f) => modifyDelayEffect(self, (_, delay3) => f(delay3)));
var delayedSchedule = (schedule3) => addDelay(schedule3, (x) => x);
var delays = (self) => makeWithState(self.initial, (now, input, state) => pipe(self.step(now, input, state), flatMap7(([state2, _, decision]) => {
  if (isDone5(decision)) {
    return succeed([state2, zero, decision]);
  }
  return succeed([state2, millis(start2(decision.intervals) - now), decision]);
})));
var mapBoth3 = /* @__PURE__ */ dual(2, (self, {
  onInput,
  onOutput
}) => map17(mapInput3(self, onInput), onOutput));
var mapBothEffect = /* @__PURE__ */ dual(2, (self, {
  onInput,
  onOutput
}) => mapEffect3(mapInputEffect(self, onInput), onOutput));
var driver = (self) => pipe(make28([none2(), self.initial]), map10((ref) => new ScheduleDriverImpl(self, ref)));
var duration = (durationInput) => {
  const duration3 = decode(durationInput);
  const durationMillis = toMillis(duration3);
  return makeWithState(true, (now, _, state) => succeed(state ? [false, duration3, continueWith2(after2(now + durationMillis))] : [false, zero, done7]));
};
var either3 = /* @__PURE__ */ dual(2, (self, that) => union8(self, that));
var eitherWith = /* @__PURE__ */ dual(3, (self, that, f) => unionWith2(self, that, f));
var ensuring2 = /* @__PURE__ */ dual(2, (self, finalizer2) => makeWithState(self.initial, (now, input, state) => flatMap7(self.step(now, input, state), ([state2, out, decision]) => isDone5(decision) ? as3(finalizer2, [state2, out, decision]) : succeed([state2, out, decision]))));
var exponential2 = (baseInput, factor = 2) => {
  const base = decode(baseInput);
  return delayedSchedule(map17(forever2, (i) => times(base, Math.pow(factor, i))));
};
var fibonacci = (oneInput) => {
  const one = decode(oneInput);
  return delayedSchedule(pipe(unfold2([one, one], ([a, b]) => [b, sum(a, b)]), map17((out) => out[0])));
};
var fixed3 = (intervalInput) => {
  const interval = decode(intervalInput);
  const intervalMillis = toMillis(interval);
  return makeWithState([none2(), 0], (now, _, [option3, n]) => sync(() => {
    switch (option3._tag) {
      case "None": {
        return [[some2([now, now + intervalMillis]), n + 1], n, continueWith2(after2(now + intervalMillis))];
      }
      case "Some": {
        const [startMillis, lastRun] = option3.value;
        const runningBehind = now > lastRun + intervalMillis;
        const boundary = equals(interval, zero) ? interval : millis(intervalMillis - (now - startMillis) % intervalMillis);
        const sleepTime = equals(boundary, zero) ? interval : boundary;
        const nextRun = runningBehind ? now : now + toMillis(sleepTime);
        return [[some2([startMillis, nextRun]), n + 1], n, continueWith2(after2(nextRun))];
      }
    }
  }));
};
var fromDelay = (delay3) => duration(delay3);
var fromDelays = (delay3, ...delays3) => makeWithState([[delay3, ...delays3].map((_) => decode(_)), true], (now, _, [durations, cont]) => sync(() => {
  if (cont) {
    const x = durations[0];
    const interval = after2(now + toMillis(x));
    if (durations.length >= 2) {
      return [[durations.slice(1), true], x, continueWith2(interval)];
    }
    const y = durations.slice(1);
    return [[[x, ...y], false], x, continueWith2(interval)];
  }
  return [[durations, false], zero, done7];
}));
var fromFunction2 = (f) => map17(identity2(), f);
var hourOfDay = (hour) => makeWithState([Number.NEGATIVE_INFINITY, 0], (now, _, state) => {
  if (!Number.isInteger(hour) || hour < 0 || 23 < hour) {
    return dieSync(() => new IllegalArgumentException(`Invalid argument in: hourOfDay(${hour}). Must be in range 0...23`));
  }
  const n = state[1];
  const initial = n === 0;
  const hour0 = nextHour(now, hour, initial);
  const start3 = beginningOfHour(hour0);
  const end4 = endOfHour(hour0);
  const interval = make37(start3, end4);
  return succeed([[end4, n + 1], n, continueWith2(interval)]);
});
var identity2 = () => makeWithState(void 0, (now, input, state) => succeed([state, input, continueWith2(after2(now))]));
var intersect5 = /* @__PURE__ */ dual(2, (self, that) => intersectWith(self, that, intersect4));
var intersectWith = /* @__PURE__ */ dual(3, (self, that, f) => makeWithState([self.initial, that.initial], (now, input, state) => pipe(zipWith3(self.step(now, input, state[0]), that.step(now, input, state[1]), (a, b) => [a, b]), flatMap7(([[lState, out, lDecision], [rState, out2, rDecision]]) => {
  if (isContinue2(lDecision) && isContinue2(rDecision)) {
    return intersectWithLoop(self, that, input, lState, out, lDecision.intervals, rState, out2, rDecision.intervals, f);
  }
  return succeed([[lState, rState], [out, out2], done7]);
}))));
var intersectWithLoop = (self, that, input, lState, out, lInterval, rState, out2, rInterval, f) => {
  const combined = f(lInterval, rInterval);
  if (isNonEmpty5(combined)) {
    return succeed([[lState, rState], [out, out2], _continue2(combined)]);
  }
  if (pipe(lInterval, lessThan6(rInterval))) {
    return flatMap7(self.step(end2(lInterval), input, lState), ([lState2, out3, decision]) => {
      if (isDone5(decision)) {
        return succeed([[lState2, rState], [out3, out2], done7]);
      }
      return intersectWithLoop(self, that, input, lState2, out3, decision.intervals, rState, out2, rInterval, f);
    });
  }
  return flatMap7(that.step(end2(rInterval), input, rState), ([rState2, out22, decision]) => {
    if (isDone5(decision)) {
      return succeed([[lState, rState2], [out, out22], done7]);
    }
    return intersectWithLoop(self, that, input, lState, out, lInterval, rState2, out22, decision.intervals, f);
  });
};
var jittered = (self) => jitteredWith(self, {
  min: 0.8,
  max: 1.2
});
var jitteredWith = /* @__PURE__ */ dual(2, (self, options) => {
  const {
    max: max6,
    min: min4
  } = Object.assign({
    min: 0.8,
    max: 1.2
  }, options);
  return delayedEffect(self, (duration3) => map10(next3, (random4) => {
    const d = toMillis(duration3);
    const jittered3 = d * min4 * (1 - random4) + d * max6 * random4;
    return millis(jittered3);
  }));
});
var linear = (baseInput) => {
  const base = decode(baseInput);
  return delayedSchedule(map17(forever2, (i) => times(base, i + 1)));
};
var map17 = /* @__PURE__ */ dual(2, (self, f) => mapEffect3(self, (out) => sync(() => f(out))));
var mapEffect3 = /* @__PURE__ */ dual(2, (self, f) => makeWithState(self.initial, (now, input, state) => flatMap7(self.step(now, input, state), ([state2, out, decision]) => map10(f(out), (out2) => [state2, out2, decision]))));
var minuteOfHour = (minute) => makeWithState([Number.MIN_SAFE_INTEGER, 0], (now, _, state) => {
  if (!Number.isInteger(minute) || minute < 0 || 59 < minute) {
    return dieSync(() => new IllegalArgumentException(`Invalid argument in: minuteOfHour(${minute}). Must be in range 0...59`));
  }
  const n = state[1];
  const initial = n === 0;
  const minute0 = nextMinute(now, minute, initial);
  const start3 = beginningOfMinute(minute0);
  const end4 = endOfMinute(minute0);
  const interval = make37(start3, end4);
  return succeed([[end4, n + 1], n, continueWith2(interval)]);
});
var modifyDelay = /* @__PURE__ */ dual(2, (self, f) => modifyDelayEffect(self, (out, duration3) => sync(() => f(out, duration3))));
var modifyDelayEffect = /* @__PURE__ */ dual(2, (self, f) => makeWithState(self.initial, (now, input, state) => flatMap7(self.step(now, input, state), ([state2, out, decision]) => {
  if (isDone5(decision)) {
    return succeed([state2, out, decision]);
  }
  const intervals = decision.intervals;
  const delay3 = size10(make37(now, start2(intervals)));
  return map10(f(out, delay3), (durationInput) => {
    const duration3 = decode(durationInput);
    const oldStart = start2(intervals);
    const newStart = now + toMillis(duration3);
    const delta = newStart - oldStart;
    const newEnd = Math.max(0, end2(intervals) + delta);
    const newInterval = make37(newStart, newEnd);
    return [state2, out, continueWith2(newInterval)];
  });
})));
var onDecision = /* @__PURE__ */ dual(2, (self, f) => makeWithState(self.initial, (now, input, state) => flatMap7(self.step(now, input, state), ([state2, out, decision]) => as3(f(out, decision), [state2, out, decision]))));
var passthrough2 = (self) => makeWithState(self.initial, (now, input, state) => pipe(self.step(now, input, state), map10(([state2, _, decision]) => [state2, input, decision])));
var provideContext3 = /* @__PURE__ */ dual(2, (self, context7) => makeWithState(self.initial, (now, input, state) => provideContext(self.step(now, input, state), context7)));
var provideService3 = /* @__PURE__ */ dual(3, (self, tag2, service3) => makeWithState(self.initial, (now, input, state) => contextWithEffect((env) => provideContext(
  // @ts-expect-error
  self.step(now, input, state),
  add2(env, tag2, service3)
))));
var recurUntil = (f) => untilInput(identity2(), f);
var recurUntilEffect = (f) => untilInputEffect(identity2(), f);
var recurUntilOption = (pf) => untilOutput(map17(identity2(), pf), isSome2);
var recurUpTo = (durationInput) => {
  const duration3 = decode(durationInput);
  return whileOutput(elapsed, (elapsed3) => lessThan2(elapsed3, duration3));
};
var recurWhile = (f) => whileInput(identity2(), f);
var recurWhileEffect = (f) => whileInputEffect(identity2(), f);
var recurs = (n) => whileOutput(forever2, (out) => out < n);
var reduce12 = /* @__PURE__ */ dual(3, (self, zero2, f) => reduceEffect2(self, zero2, (z, out) => sync(() => f(z, out))));
var reduceEffect2 = /* @__PURE__ */ dual(3, (self, zero2, f) => makeWithState([self.initial, zero2], (now, input, [s, z]) => flatMap7(self.step(now, input, s), ([s2, out, decision]) => isDone5(decision) ? succeed([[s2, z], z, decision]) : map10(f(z, out), (z2) => [[s2, z2], z, decision]))));
var repetitions = (self) => reduce12(self, 0, (n, _) => n + 1);
var resetAfter = /* @__PURE__ */ dual(2, (self, durationInput) => {
  const duration3 = decode(durationInput);
  return pipe(self, intersect5(elapsed), resetWhen(([, time]) => greaterThanOrEqualTo2(time, duration3)), map17((out) => out[0]));
});
var resetWhen = /* @__PURE__ */ dual(2, (self, f) => makeWithState(self.initial, (now, input, state) => flatMap7(self.step(now, input, state), ([state2, out, decision]) => f(out) ? self.step(now, input, self.initial) : succeed([state2, out, decision]))));
var run = /* @__PURE__ */ dual(3, (self, now, input) => pipe(runLoop(self, now, fromIterable3(input), self.initial, empty4()), map10((list) => reverse2(list))));
var runLoop = (self, now, inputs, state, acc) => {
  if (!isNonEmpty2(inputs)) {
    return succeed(acc);
  }
  const input = headNonEmpty2(inputs);
  const nextInputs = tailNonEmpty2(inputs);
  return flatMap7(self.step(now, input, state), ([state2, out, decision]) => {
    if (isDone5(decision)) {
      return sync(() => pipe(acc, prepend2(out)));
    }
    return runLoop(self, start2(decision.intervals), nextInputs, state2, prepend2(acc, out));
  });
};
var secondOfMinute = (second) => makeWithState([Number.NEGATIVE_INFINITY, 0], (now, _, state) => {
  if (!Number.isInteger(second) || second < 0 || 59 < second) {
    return dieSync(() => new IllegalArgumentException(`Invalid argument in: secondOfMinute(${second}). Must be in range 0...59`));
  }
  const n = state[1];
  const initial = n === 0;
  const second0 = nextSecond(now, second, initial);
  const start3 = beginningOfSecond(second0);
  const end4 = endOfSecond(second0);
  const interval = make37(start3, end4);
  return succeed([[end4, n + 1], n, continueWith2(interval)]);
});
var spaced = (duration3) => addDelay(forever2, () => duration3);
var succeed8 = (value) => map17(forever2, () => value);
var sync5 = (evaluate2) => map17(forever2, evaluate2);
var tapInput = /* @__PURE__ */ dual(2, (self, f) => makeWithState(self.initial, (now, input, state) => zipRight2(f(input), self.step(now, input, state))));
var tapOutput = /* @__PURE__ */ dual(2, (self, f) => makeWithState(self.initial, (now, input, state) => tap2(self.step(now, input, state), ([, out]) => f(out))));
var unfold2 = (initial, f) => makeWithState(initial, (now, _, state) => sync(() => [f(state), state, continueWith2(after2(now))]));
var union8 = /* @__PURE__ */ dual(2, (self, that) => unionWith2(self, that, union7));
var unionWith2 = /* @__PURE__ */ dual(3, (self, that, f) => makeWithState([self.initial, that.initial], (now, input, state) => zipWith3(self.step(now, input, state[0]), that.step(now, input, state[1]), ([lState, l, lDecision], [rState, r, rDecision]) => {
  if (isDone5(lDecision) && isDone5(rDecision)) {
    return [[lState, rState], [l, r], done7];
  }
  if (isDone5(lDecision) && isContinue2(rDecision)) {
    return [[lState, rState], [l, r], _continue2(rDecision.intervals)];
  }
  if (isContinue2(lDecision) && isDone5(rDecision)) {
    return [[lState, rState], [l, r], _continue2(lDecision.intervals)];
  }
  if (isContinue2(lDecision) && isContinue2(rDecision)) {
    const combined = f(lDecision.intervals, rDecision.intervals);
    return [[lState, rState], [l, r], _continue2(combined)];
  }
  throw new Error("BUG: Schedule.unionWith - please report an issue at https://github.com/Effect-TS/effect/issues");
})));
var untilInput = /* @__PURE__ */ dual(2, (self, f) => check(self, (input, _) => !f(input)));
var untilInputEffect = /* @__PURE__ */ dual(2, (self, f) => checkEffect(self, (input, _) => negate(f(input))));
var untilOutput = /* @__PURE__ */ dual(2, (self, f) => check(self, (_, out) => !f(out)));
var untilOutputEffect = /* @__PURE__ */ dual(2, (self, f) => checkEffect(self, (_, out) => negate(f(out))));
var upTo = /* @__PURE__ */ dual(2, (self, duration3) => zipLeft5(self, recurUpTo(duration3)));
var whileInput = /* @__PURE__ */ dual(2, (self, f) => check(self, (input, _) => f(input)));
var whileInputEffect = /* @__PURE__ */ dual(2, (self, f) => checkEffect(self, (input, _) => f(input)));
var whileOutput = /* @__PURE__ */ dual(2, (self, f) => check(self, (_, out) => f(out)));
var whileOutputEffect = /* @__PURE__ */ dual(2, (self, f) => checkEffect(self, (_, out) => f(out)));
var windowed = (intervalInput) => {
  const interval = decode(intervalInput);
  const millis2 = toMillis(interval);
  return makeWithState([none2(), 0], (now, _, [option3, n]) => {
    switch (option3._tag) {
      case "None": {
        return succeed([[some2(now), n + 1], n, continueWith2(after2(now + millis2))]);
      }
      case "Some": {
        return succeed([[some2(option3.value), n + 1], n, continueWith2(after2(now + (millis2 - (now - option3.value) % millis2)))]);
      }
    }
  });
};
var zipLeft5 = /* @__PURE__ */ dual(2, (self, that) => map17(intersect5(self, that), (out) => out[0]));
var zipRight5 = /* @__PURE__ */ dual(2, (self, that) => map17(intersect5(self, that), (out) => out[1]));
var zipWith7 = /* @__PURE__ */ dual(3, (self, that, f) => map17(intersect5(self, that), ([out, out2]) => f(out, out2)));
var beginningOfSecond = (now) => {
  const date = new Date(now);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0).getTime();
};
var endOfSecond = (now) => {
  const date = new Date(beginningOfSecond(now));
  return date.setSeconds(date.getSeconds() + 1);
};
var nextSecond = (now, second, initial) => {
  const date = new Date(now);
  if (date.getSeconds() === second && initial) {
    return now;
  }
  if (date.getSeconds() < second) {
    return date.setSeconds(second);
  }
  const newDate = new Date(date.setSeconds(second));
  return newDate.setTime(newDate.getTime() + 1e3 * 60);
};
var beginningOfMinute = (now) => {
  const date = new Date(now);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0, 0).getTime();
};
var endOfMinute = (now) => {
  const date = new Date(beginningOfMinute(now));
  return date.setMinutes(date.getMinutes() + 1);
};
var nextMinute = (now, minute, initial) => {
  const date = new Date(now);
  if (date.getMinutes() === minute && initial) {
    return now;
  }
  if (date.getMinutes() < minute) {
    return date.setMinutes(minute);
  }
  const newDate = new Date(date.setMinutes(minute));
  return newDate.setTime(newDate.getTime() + 1e3 * 60 * 60);
};
var beginningOfHour = (now) => {
  const date = new Date(now);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0, 0).getTime();
};
var endOfHour = (now) => {
  const date = new Date(beginningOfHour(now));
  return date.setHours(date.getHours() + 1);
};
var nextHour = (now, hour, initial) => {
  const date = new Date(now);
  if (date.getHours() === hour && initial) {
    return now;
  }
  if (date.getHours() < hour) {
    return date.setHours(hour);
  }
  const newDate = new Date(date.setHours(hour));
  return newDate.setTime(newDate.getTime() + 1e3 * 60 * 60 * 24);
};
var beginningOfDay = (now) => {
  const date = new Date(now);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime();
};
var endOfDay = (now) => {
  const date = new Date(beginningOfDay(now));
  return date.setDate(date.getDate() + 1);
};
var nextDay = (now, dayOfWeek3, initial) => {
  const date = new Date(now);
  if (date.getDay() === dayOfWeek3 && initial) {
    return now;
  }
  const nextDayOfWeek = (7 + dayOfWeek3 - date.getDay()) % 7;
  return date.setDate(date.getDate() + (nextDayOfWeek === 0 ? 7 : nextDayOfWeek));
};
var nextDayOfMonth = (now, day, initial) => {
  const date = new Date(now);
  if (date.getDate() === day && initial) {
    return now;
  }
  if (date.getDate() < day) {
    return date.setDate(day);
  }
  return findNextMonth(now, day, 1);
};
var findNextMonth = (now, day, months) => {
  const d = new Date(now);
  const tmp1 = new Date(d.setDate(day));
  const tmp2 = new Date(tmp1.setMonth(tmp1.getMonth() + months));
  if (tmp2.getDate() === day) {
    const d2 = new Date(now);
    const tmp3 = new Date(d2.setDate(day));
    return tmp3.setMonth(tmp3.getMonth() + months);
  }
  return findNextMonth(now, day, months + 1);
};
var ScheduleDefectTypeId = /* @__PURE__ */ Symbol.for("effect/Schedule/ScheduleDefect");
var ScheduleDefect = class {
  error;
  [ScheduleDefectTypeId];
  constructor(error) {
    this.error = error;
    this[ScheduleDefectTypeId] = ScheduleDefectTypeId;
  }
};
var isScheduleDefect = (u) => hasProperty(u, ScheduleDefectTypeId);
var scheduleDefectWrap = (self) => catchAll(self, (e) => die2(new ScheduleDefect(e)));
var scheduleDefectRefailCause = (cause3) => match2(find(cause3, (_) => isDieType(_) && isScheduleDefect(_.defect) ? some2(_.defect) : none2()), {
  onNone: () => cause3,
  onSome: (error) => fail(error.error)
});
var scheduleDefectRefail = (effect3) => catchAllCause(effect3, (cause3) => failCause(scheduleDefectRefailCause(cause3)));
var repeat_Effect = /* @__PURE__ */ dual(2, (self, schedule3) => repeatOrElse_Effect(self, schedule3, (e, _) => fail2(e)));
var repeat_combined = /* @__PURE__ */ dual(2, (self, options) => {
  if (isSchedule(options)) {
    return repeat_Effect(self, options);
  }
  const base = options.schedule ?? passthrough2(forever2);
  const withWhile = options.while ? whileInputEffect(base, (a) => {
    const applied = options.while(a);
    if (typeof applied === "boolean") {
      return succeed(applied);
    }
    return scheduleDefectWrap(applied);
  }) : base;
  const withUntil = options.until ? untilInputEffect(withWhile, (a) => {
    const applied = options.until(a);
    if (typeof applied === "boolean") {
      return succeed(applied);
    }
    return scheduleDefectWrap(applied);
  }) : withWhile;
  const withTimes = options.times ? intersect5(withUntil, recurs(options.times)).pipe(map17((intersectionPair) => intersectionPair[0])) : withUntil;
  return scheduleDefectRefail(repeat_Effect(self, withTimes));
});
var repeatOrElse_Effect = /* @__PURE__ */ dual(3, (self, schedule3, orElse12) => flatMap7(driver(schedule3), (driver3) => matchEffect(self, {
  onFailure: (error) => orElse12(error, none2()),
  onSuccess: (value) => repeatOrElseEffectLoop(provideServiceEffect(self, CurrentIterationMetadata, get11(driver3.iterationMeta)), driver3, (error, option3) => provideServiceEffect(orElse12(error, option3), CurrentIterationMetadata, get11(driver3.iterationMeta)), value)
})));
var repeatOrElseEffectLoop = (self, driver3, orElse12, value) => matchEffect(driver3.next(value), {
  onFailure: () => orDie(driver3.last),
  onSuccess: (b) => matchEffect(self, {
    onFailure: (error) => orElse12(error, some2(b)),
    onSuccess: (value2) => repeatOrElseEffectLoop(self, driver3, orElse12, value2)
  })
});
var retry_Effect = /* @__PURE__ */ dual(2, (self, policy) => retryOrElse_Effect(self, policy, (e, _) => fail2(e)));
var retry_combined = /* @__PURE__ */ dual(2, (self, options) => {
  if (isSchedule(options)) {
    return retry_Effect(self, options);
  }
  return scheduleDefectRefail(retry_Effect(self, fromRetryOptions(options)));
});
var fromRetryOptions = (options) => {
  const base = options.schedule ?? forever2;
  const withWhile = options.while ? whileInputEffect(base, (e) => {
    const applied = options.while(e);
    if (typeof applied === "boolean") {
      return succeed(applied);
    }
    return scheduleDefectWrap(applied);
  }) : base;
  const withUntil = options.until ? untilInputEffect(withWhile, (e) => {
    const applied = options.until(e);
    if (typeof applied === "boolean") {
      return succeed(applied);
    }
    return scheduleDefectWrap(applied);
  }) : withWhile;
  return options.times !== void 0 ? intersect5(withUntil, recurs(options.times)) : withUntil;
};
var retryOrElse_Effect = /* @__PURE__ */ dual(3, (self, policy, orElse12) => flatMap7(driver(policy), (driver3) => retryOrElse_EffectLoop(provideServiceEffect(self, CurrentIterationMetadata, get11(driver3.iterationMeta)), driver3, (e, out) => provideServiceEffect(orElse12(e, out), CurrentIterationMetadata, get11(driver3.iterationMeta)))));
var retryOrElse_EffectLoop = (self, driver3, orElse12) => {
  return catchAll(self, (e) => matchEffect(driver3.next(e), {
    onFailure: () => pipe(driver3.last, orDie, flatMap7((out) => orElse12(e, out))),
    onSuccess: () => retryOrElse_EffectLoop(self, driver3, orElse12)
  }));
};
var schedule_Effect = /* @__PURE__ */ dual(2, (self, schedule3) => scheduleFrom_Effect(self, void 0, schedule3));
var scheduleFrom_Effect = /* @__PURE__ */ dual(3, (self, initial, schedule3) => flatMap7(driver(schedule3), (driver3) => scheduleFrom_EffectLoop(provideServiceEffect(self, CurrentIterationMetadata, get11(driver3.iterationMeta)), initial, driver3)));
var scheduleFrom_EffectLoop = (self, initial, driver3) => matchEffect(driver3.next(initial), {
  onFailure: () => orDie(driver3.last),
  onSuccess: () => flatMap7(self, (a) => scheduleFrom_EffectLoop(self, a, driver3))
});
var count = /* @__PURE__ */ unfold2(0, (n) => n + 1);
var elapsed = /* @__PURE__ */ makeWithState(/* @__PURE__ */ none2(), (now, _, state) => {
  switch (state._tag) {
    case "None": {
      return succeed([some2(now), zero, continueWith2(after2(now))]);
    }
    case "Some": {
      return succeed([some2(state.value), millis(now - state.value), continueWith2(after2(now))]);
    }
  }
});
var forever2 = /* @__PURE__ */ unfold2(0, (n) => n + 1);
var once2 = /* @__PURE__ */ asVoid4(/* @__PURE__ */ recurs(1));
var stop = /* @__PURE__ */ asVoid4(/* @__PURE__ */ recurs(0));
var scheduleForked = /* @__PURE__ */ dual(2, (self, schedule3) => forkScoped(schedule_Effect(self, schedule3)));

// node_modules/effect/dist/esm/internal/executionPlan.js
var withExecutionPlan = /* @__PURE__ */ dual(2, (effect3, plan) => suspend(() => {
  let i = 0;
  let result;
  return flatMap7(whileLoop({
    while: () => i < plan.steps.length && (result === void 0 || isLeft2(result)),
    body: () => {
      const step4 = plan.steps[i];
      let nextEffect = effect_provide(effect3, step4.provide);
      if (result) {
        let attempted = false;
        const wrapped = nextEffect;
        nextEffect = suspend(() => {
          if (attempted) return wrapped;
          attempted = true;
          return result;
        });
        nextEffect = scheduleDefectRefail(retry_Effect(nextEffect, scheduleFromStep(step4, false)));
      } else {
        const schedule3 = scheduleFromStep(step4, true);
        nextEffect = schedule3 ? scheduleDefectRefail(retry_Effect(nextEffect, schedule3)) : nextEffect;
      }
      return either2(nextEffect);
    },
    step: (either7) => {
      result = either7;
      i++;
    }
  }), () => result);
}));
var scheduleFromStep = (step4, first2) => {
  if (!first2) {
    return fromRetryOptions({
      schedule: step4.schedule ? step4.schedule : step4.attempts ? void 0 : once2,
      times: step4.attempts,
      while: step4.while
    });
  } else if (step4.attempts === 1 || !(step4.schedule || step4.attempts)) {
    return void 0;
  }
  return fromRetryOptions({
    schedule: step4.schedule,
    while: step4.while,
    times: step4.attempts ? step4.attempts - 1 : void 0
  });
};

// node_modules/effect/dist/esm/internal/query.js
var currentCache = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentCache"), () => fiberRefUnsafeMake(unsafeMakeWith(65536, () => map10(deferredMake(), (handle) => ({
  listeners: new Listeners(),
  handle
})), () => seconds(60))));
var currentCacheEnabled = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentCacheEnabled"), () => fiberRefUnsafeMake(false));
var fromRequest = (request2, dataSource) => flatMap7(isEffect(dataSource) ? dataSource : succeed(dataSource), (ds) => fiberIdWith((id3) => {
  const proxy = new Proxy(request2, {});
  return fiberRefGetWith(currentCacheEnabled, (cacheEnabled) => {
    if (cacheEnabled) {
      const cached4 = fiberRefGetWith(currentCache, (cache) => flatMap7(cache.getEither(proxy), (orNew) => {
        switch (orNew._tag) {
          case "Left": {
            if (orNew.left.listeners.interrupted) {
              return flatMap7(cache.invalidateWhen(proxy, (entry) => entry.handle === orNew.left.handle), () => cached4);
            }
            orNew.left.listeners.increment();
            return uninterruptibleMask((restore) => flatMap7(exit(blocked(empty15, restore(deferredAwait(orNew.left.handle)))), (exit4) => {
              orNew.left.listeners.decrement();
              return exit4;
            }));
          }
          case "Right": {
            orNew.right.listeners.increment();
            return uninterruptibleMask((restore) => flatMap7(exit(blocked(single(ds, makeEntry({
              request: proxy,
              result: orNew.right.handle,
              listeners: orNew.right.listeners,
              ownerId: id3,
              state: {
                completed: false
              }
            })), restore(deferredAwait(orNew.right.handle)))), () => {
              orNew.right.listeners.decrement();
              return deferredAwait(orNew.right.handle);
            }));
          }
        }
      }));
      return cached4;
    }
    const listeners = new Listeners();
    listeners.increment();
    return flatMap7(deferredMake(), (ref) => ensuring(blocked(single(ds, makeEntry({
      request: proxy,
      result: ref,
      listeners,
      ownerId: id3,
      state: {
        completed: false
      }
    })), deferredAwait(ref)), sync(() => listeners.decrement())));
  });
}));
var cacheRequest = (request2, result) => {
  return fiberRefGetWith(currentCacheEnabled, (cacheEnabled) => {
    if (cacheEnabled) {
      return fiberRefGetWith(currentCache, (cache) => flatMap7(cache.getEither(request2), (orNew) => {
        switch (orNew._tag) {
          case "Left": {
            return void_2;
          }
          case "Right": {
            return deferredComplete(orNew.right.handle, result);
          }
        }
      }));
    }
    return void_2;
  });
};
var withRequestCaching = /* @__PURE__ */ dual(2, (self, strategy) => fiberRefLocally(self, currentCacheEnabled, strategy));
var withRequestCache = /* @__PURE__ */ dual(
  2,
  // @ts-expect-error
  (self, cache) => fiberRefLocally(self, currentCache, cache)
);

// node_modules/effect/dist/esm/Request.js
var isRequest2 = isRequest;

// node_modules/effect/dist/esm/Effect.js
var EffectTypeId3 = EffectTypeId2;
var isEffect2 = isEffect;
var cachedWithTTL = cached2;
var cachedInvalidateWithTTL2 = cachedInvalidateWithTTL;
var cached3 = memoize;
var cachedFunction2 = cachedFunction;
var once3 = once;
var all7 = all5;
var allWith2 = allWith;
var allSuccesses2 = allSuccesses;
var dropUntil2 = dropUntil;
var dropWhile2 = dropWhile;
var takeUntil2 = takeUntil;
var takeWhile2 = takeWhile;
var every5 = every4;
var exists4 = exists3;
var filter9 = filter7;
var filterMap5 = filterMap4;
var findFirst5 = findFirst3;
var forEach8 = forEach7;
var head4 = head3;
var mergeAll5 = mergeAll3;
var partition4 = partition3;
var reduce13 = reduce9;
var reduceWhile2 = reduceWhile;
var reduceRight3 = reduceRight2;
var reduceEffect3 = reduceEffect;
var replicate2 = replicate;
var replicateEffect2 = replicateEffect;
var validateAll2 = validateAll;
var validateFirst2 = validateFirst;
var async2 = async_;
var asyncEffect2 = asyncEffect;
var custom2 = custom;
var withFiberRuntime2 = withFiberRuntime;
var fail10 = fail2;
var failSync4 = failSync;
var failCause9 = failCause;
var failCauseSync4 = failCauseSync;
var die7 = die2;
var dieMessage2 = dieMessage;
var dieSync4 = dieSync;
var gen3 = gen2;
var never4 = never;
var none9 = none6;
var promise2 = promise;
var succeed10 = succeed;
var succeedNone2 = succeedNone;
var succeedSome2 = succeedSome;
var suspend4 = suspend;
var sync6 = sync;
var _void = void_2;
var yieldNow4 = yieldNow;
var _catch2 = _catch;
var catchAll3 = catchAll;
var catchAllCause3 = catchAllCause;
var catchAllDefect2 = catchAllDefect;
var catchIf2 = catchIf;
var catchSome2 = catchSome;
var catchSomeCause2 = catchSomeCause;
var catchSomeDefect2 = catchSomeDefect;
var catchTag2 = catchTag;
var catchTags2 = catchTags;
var cause2 = cause;
var eventually2 = eventually;
var ignore2 = ignore;
var ignoreLogged2 = ignoreLogged;
var parallelErrors2 = parallelErrors;
var sandbox2 = sandbox;
var retry2 = retry_combined;
var withExecutionPlan2 = withExecutionPlan;
var retryOrElse = retryOrElse_Effect;
var try_2 = try_;
var tryMap2 = tryMap;
var tryMapPromise2 = tryMapPromise;
var tryPromise2 = tryPromise;
var unsandbox2 = unsandbox;
var allowInterrupt2 = allowInterrupt;
var checkInterruptible2 = checkInterruptible;
var disconnect2 = disconnect;
var interrupt7 = interrupt2;
var interruptWith3 = interruptWith;
var interruptible4 = interruptible2;
var interruptibleMask2 = interruptibleMask;
var onInterrupt2 = onInterrupt;
var uninterruptible2 = uninterruptible;
var uninterruptibleMask3 = uninterruptibleMask;
var liftPredicate3 = liftPredicate2;
var as8 = as3;
var asSome2 = asSome;
var asSomeError2 = asSomeError;
var asVoid5 = asVoid2;
var flip2 = flip;
var flipWith2 = flipWith;
var map18 = map10;
var mapAccum3 = mapAccum2;
var mapBoth4 = mapBoth;
var mapError4 = mapError;
var mapErrorCause3 = mapErrorCause2;
var merge7 = merge5;
var negate2 = negate;
var acquireRelease2 = acquireRelease;
var acquireReleaseInterruptible2 = acquireReleaseInterruptible;
var acquireUseRelease2 = acquireUseRelease;
var addFinalizer3 = addFinalizer;
var ensuring3 = ensuring;
var onError2 = onError;
var onExit3 = onExit;
var parallelFinalizers2 = parallelFinalizers;
var sequentialFinalizers2 = sequentialFinalizers;
var finalizersMask2 = finalizersMask;
var scope3 = scope;
var scopeWith2 = scopeWith;
var scopedWith2 = scopedWith;
var scoped3 = scopedEffect;
var using2 = using;
var withEarlyRelease2 = withEarlyRelease;
var awaitAllChildren2 = awaitAllChildren;
var daemonChildren2 = daemonChildren;
var descriptor2 = descriptor;
var descriptorWith2 = descriptorWith;
var diffFiberRefs2 = diffFiberRefs;
var ensuringChild2 = ensuringChild;
var ensuringChildren2 = ensuringChildren;
var fiberId2 = fiberId;
var fiberIdWith2 = fiberIdWith;
var fork3 = fork;
var forkDaemon2 = forkDaemon;
var forkAll2 = forkAll;
var forkIn2 = forkIn;
var forkScoped2 = forkScoped;
var forkWithErrorHandler2 = forkWithErrorHandler;
var fromFiber2 = fromFiber;
var fromFiberEffect2 = fromFiberEffect;
var supervised2 = supervised;
var transplant2 = transplant;
var withConcurrency2 = withConcurrency;
var withScheduler2 = withScheduler;
var withSchedulingPriority2 = withSchedulingPriority;
var withMaxOpsBeforeYield2 = withMaxOpsBeforeYield;
var clock2 = clock;
var clockWith4 = clockWith3;
var withClockScoped2 = withClockScoped;
var withClock2 = withClock;
var console3 = console2;
var consoleWith2 = consoleWith;
var withConsoleScoped2 = withConsoleScoped;
var withConsole2 = withConsole;
var delay2 = delay;
var sleep4 = sleep3;
var timed2 = timed;
var timedWith2 = timedWith;
var timeout2 = timeout;
var timeoutOption2 = timeoutOption;
var timeoutFail2 = timeoutFail;
var timeoutFailCause2 = timeoutFailCause;
var timeoutTo2 = timeoutTo;
var configProviderWith2 = configProviderWith;
var withConfigProvider2 = withConfigProvider;
var withConfigProviderScoped2 = withConfigProviderScoped;
var context3 = context;
var contextWith2 = contextWith;
var contextWithEffect2 = contextWithEffect;
var mapInputContext3 = mapInputContext;
var provide2 = effect_provide;
var provideService4 = provideService;
var provideServiceEffect2 = provideServiceEffect;
var serviceFunction2 = serviceFunction;
var serviceFunctionEffect2 = serviceFunctionEffect;
var serviceFunctions2 = serviceFunctions;
var serviceConstants2 = serviceConstants;
var serviceMembers2 = serviceMembers;
var serviceOption2 = serviceOption;
var serviceOptional2 = serviceOptional;
var updateService2 = updateService;
var Do3 = Do2;
var bind4 = bind3;
var bindAll2 = bindAll;
var bindTo4 = bindTo3;
var let_4 = let_3;
var option2 = option;
var either4 = either2;
var exit3 = exit;
var intoDeferred2 = intoDeferred;
var if_2 = if_;
var filterOrDie2 = filterOrDie;
var filterOrDieMessage2 = filterOrDieMessage;
var filterOrElse2 = filterOrElse;
var filterOrFail2 = filterOrFail;
var filterEffectOrElse2 = filterEffectOrElse;
var filterEffectOrFail2 = filterEffectOrFail;
var unless2 = unless;
var unlessEffect2 = unlessEffect;
var when2 = when;
var whenEffect2 = whenEffect;
var whenFiberRef2 = whenFiberRef;
var whenRef2 = whenRef;
var flatMap12 = flatMap7;
var andThen7 = andThen4;
var flatten10 = flatten6;
var race2 = race;
var raceAll2 = raceAll;
var raceFirst2 = raceFirst;
var raceWith2 = raceWith;
var summarized2 = summarized;
var tap4 = tap2;
var tapBoth2 = tapBoth;
var tapDefect2 = tapDefect;
var tapError3 = tapError;
var tapErrorTag2 = tapErrorTag;
var tapErrorCause3 = tapErrorCause;
var forever3 = forever;
var iterate2 = iterate;
var loop2 = loop;
var repeat = repeat_combined;
var repeatN2 = repeatN;
var repeatOrElse = repeatOrElse_Effect;
var schedule = schedule_Effect;
var scheduleForked2 = scheduleForked;
var scheduleFrom = scheduleFrom_Effect;
var whileLoop3 = whileLoop;
var getFiberRefs = fiberRefs2;
var inheritFiberRefs2 = inheritFiberRefs;
var locally = fiberRefLocally;
var locallyWith = fiberRefLocallyWith;
var locallyScoped = fiberRefLocallyScoped;
var locallyScopedWith = fiberRefLocallyScopedWith;
var patchFiberRefs2 = patchFiberRefs;
var setFiberRefs2 = setFiberRefs;
var updateFiberRefs3 = updateFiberRefs;
var isFailure5 = isFailure3;
var isSuccess3 = isSuccess2;
var match15 = match7;
var matchCause4 = matchCause;
var matchCauseEffect3 = matchCauseEffect;
var matchEffect3 = matchEffect;
var log2 = log;
var logWithLevel2 = (level, ...message) => logWithLevel(level)(...message);
var logTrace2 = logTrace;
var logDebug2 = logDebug;
var logInfo2 = logInfo;
var logWarning2 = logWarning;
var logError2 = logError;
var logFatal2 = logFatal;
var withLogSpan2 = withLogSpan;
var annotateLogs3 = annotateLogs;
var annotateLogsScoped2 = annotateLogsScoped;
var logAnnotations2 = logAnnotations;
var withUnhandledErrorLogLevel2 = withUnhandledErrorLogLevel;
var whenLogLevel2 = whenLogLevel;
var orDie3 = orDie;
var orDieWith2 = orDieWith;
var orElse6 = orElse2;
var orElseFail2 = orElseFail;
var orElseSucceed2 = orElseSucceed;
var firstSuccessOf2 = firstSuccessOf;
var random3 = random2;
var randomWith2 = randomWith;
var withRandom2 = withRandom;
var withRandomFixed = /* @__PURE__ */ dual(2, (effect3, values3) => withRandom2(effect3, fixed2(values3)));
var withRandomScoped2 = withRandomScoped;
var runtime3 = runtime2;
var getRuntimeFlags = runtimeFlags;
var patchRuntimeFlags = updateRuntimeFlags;
var withRuntimeFlagsPatch = withRuntimeFlags;
var withRuntimeFlagsPatchScoped = withRuntimeFlagsScoped;
var tagMetrics2 = tagMetrics;
var labelMetrics2 = labelMetrics;
var tagMetricsScoped2 = tagMetricsScoped;
var labelMetricsScoped2 = labelMetricsScoped;
var metricLabels2 = metricLabels;
var withMetric2 = withMetric;
var unsafeMakeSemaphore2 = unsafeMakeSemaphore;
var makeSemaphore2 = makeSemaphore;
var unsafeMakeLatch2 = unsafeMakeLatch;
var makeLatch2 = makeLatch;
var runFork2 = unsafeForkEffect;
var runCallback = unsafeRunEffect;
var runPromise = unsafeRunPromiseEffect;
var runPromiseExit = unsafeRunPromiseExitEffect;
var runSync = unsafeRunSyncEffect;
var runSyncExit = unsafeRunSyncExitEffect;
var validate2 = validate;
var validateWith2 = validateWith;
var zip6 = zipOptions;
var zipLeft6 = zipLeftOptions;
var zipRight6 = zipRightOptions;
var zipWith8 = zipWithOptions;
var ap2 = /* @__PURE__ */ dual(2, (self, that) => zipWith8(self, that, (f, a) => f(a)));
var blocked2 = blocked;
var runRequestBlock2 = runRequestBlock;
var step3 = step2;
var request = /* @__PURE__ */ dual((args2) => isRequest2(args2[0]), fromRequest);
var cacheRequestResult = cacheRequest;
var withRequestBatching2 = withRequestBatching;
var withRequestCaching2 = withRequestCaching;
var withRequestCache2 = withRequestCache;
var tracer2 = tracer;
var tracerWith4 = tracerWith;
var withTracer2 = withTracer;
var withTracerScoped2 = withTracerScoped;
var withTracerEnabled2 = withTracerEnabled;
var withTracerTiming2 = withTracerTiming;
var annotateSpans3 = annotateSpans;
var annotateCurrentSpan2 = annotateCurrentSpan;
var currentSpan2 = currentSpan;
var currentParentSpan2 = currentParentSpan;
var spanAnnotations2 = spanAnnotations;
var spanLinks2 = spanLinks;
var linkSpans2 = linkSpans;
var linkSpanCurrent2 = linkSpanCurrent;
var makeSpan2 = makeSpan;
var makeSpanScoped2 = makeSpanScoped;
var useSpan2 = useSpan;
var withSpan3 = withSpan;
var functionWithSpan2 = functionWithSpan;
var withSpanScoped2 = withSpanScoped;
var withParentSpan3 = withParentSpan;
var fromNullable3 = fromNullable2;
var optionFromOptional2 = optionFromOptional;
var transposeOption = (self) => {
  return isNone(self) ? succeedNone2 : map18(self.value, some);
};
var transposeMapOption = /* @__PURE__ */ dual(2, (self, f) => isNone(self) ? succeedNone2 : map18(f(self.value), some));
var makeTagProxy = (TagClass) => {
  const cache = /* @__PURE__ */ new Map();
  return new Proxy(TagClass, {
    get(target, prop, receiver) {
      if (prop in target) {
        return Reflect.get(target, prop, receiver);
      }
      if (cache.has(prop)) {
        return cache.get(prop);
      }
      const fn2 = (...args2) => andThen4(target, (s) => {
        if (typeof s[prop] === "function") {
          cache.set(prop, (...args3) => andThen4(target, (s2) => s2[prop](...args3)));
          return s[prop](...args2);
        }
        cache.set(prop, andThen4(target, (s2) => s2[prop]));
        return s[prop];
      });
      const cn = andThen4(target, (s) => s[prop]);
      Object.assign(fn2, cn);
      const apply = fn2.apply;
      const bind6 = fn2.bind;
      const call = fn2.call;
      const proto12 = Object.setPrototypeOf({}, Object.getPrototypeOf(cn));
      proto12.apply = apply;
      proto12.bind = bind6;
      proto12.call = call;
      Object.setPrototypeOf(fn2, proto12);
      cache.set(prop, fn2);
      return fn2;
    }
  });
};
var Tag3 = (id3) => () => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error();
  Error.stackTraceLimit = limit;
  function TagClass() {
  }
  Object.setPrototypeOf(TagClass, TagProto);
  TagClass.key = id3;
  Object.defineProperty(TagClass, "use", {
    get() {
      return (body) => andThen4(this, body);
    }
  });
  Object.defineProperty(TagClass, "stack", {
    get() {
      return creationError.stack;
    }
  });
  return makeTagProxy(TagClass);
};
var Service = function() {
  return function() {
    const [id3, maker] = arguments;
    const proxy = "accessors" in maker ? maker["accessors"] : false;
    const limit = Error.stackTraceLimit;
    Error.stackTraceLimit = 2;
    const creationError = new Error();
    Error.stackTraceLimit = limit;
    let patchState = "unchecked";
    const TagClass = function(service3) {
      if (patchState === "unchecked") {
        const proto12 = Object.getPrototypeOf(service3);
        if (proto12 === Object.prototype || proto12 === null) {
          patchState = "plain";
        } else {
          const selfProto = Object.getPrototypeOf(this);
          Object.setPrototypeOf(selfProto, proto12);
          patchState = "patched";
        }
      }
      if (patchState === "plain") {
        Object.assign(this, service3);
      } else if (patchState === "patched") {
        Object.setPrototypeOf(service3, Object.getPrototypeOf(this));
        return service3;
      }
    };
    TagClass.prototype._tag = id3;
    Object.defineProperty(TagClass, "make", {
      get() {
        return (service3) => new this(service3);
      }
    });
    Object.defineProperty(TagClass, "use", {
      get() {
        return (body) => andThen4(this, body);
      }
    });
    TagClass.key = id3;
    Object.assign(TagClass, TagProto);
    Object.defineProperty(TagClass, "stack", {
      get() {
        return creationError.stack;
      }
    });
    const hasDeps = "dependencies" in maker && maker.dependencies.length > 0;
    const layerName = hasDeps ? "DefaultWithoutDependencies" : "Default";
    let layerCache;
    let isFunction3 = false;
    if ("effect" in maker) {
      isFunction3 = typeof maker.effect === "function";
      Object.defineProperty(TagClass, layerName, {
        get() {
          if (isFunction3) {
            return function() {
              return fromEffect4(TagClass, map18(maker.effect.apply(null, arguments), (_) => new this(_)));
            }.bind(this);
          }
          return layerCache ??= fromEffect4(TagClass, map18(maker.effect, (_) => new this(_)));
        }
      });
    } else if ("scoped" in maker) {
      isFunction3 = typeof maker.scoped === "function";
      Object.defineProperty(TagClass, layerName, {
        get() {
          if (isFunction3) {
            return function() {
              return scoped2(TagClass, map18(maker.scoped.apply(null, arguments), (_) => new this(_)));
            }.bind(this);
          }
          return layerCache ??= scoped2(TagClass, map18(maker.scoped, (_) => new this(_)));
        }
      });
    } else if ("sync" in maker) {
      Object.defineProperty(TagClass, layerName, {
        get() {
          return layerCache ??= sync4(TagClass, () => new this(maker.sync()));
        }
      });
    } else {
      Object.defineProperty(TagClass, layerName, {
        get() {
          return layerCache ??= succeed7(TagClass, new this(maker.succeed));
        }
      });
    }
    if (hasDeps) {
      let layerWithDepsCache;
      Object.defineProperty(TagClass, "Default", {
        get() {
          if (isFunction3) {
            return function() {
              return provide(this.DefaultWithoutDependencies.apply(null, arguments), maker.dependencies);
            };
          }
          return layerWithDepsCache ??= provide(this.DefaultWithoutDependencies, maker.dependencies);
        }
      });
    }
    return proxy === true ? makeTagProxy(TagClass) : TagClass;
  };
};
var fn = function(nameOrBody, ...pipeables) {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const errorDef = new Error();
  Error.stackTraceLimit = limit;
  if (typeof nameOrBody !== "string") {
    return defineLength(nameOrBody.length, function(...args2) {
      const limit2 = Error.stackTraceLimit;
      Error.stackTraceLimit = 2;
      const errorCall = new Error();
      Error.stackTraceLimit = limit2;
      return fnApply({
        self: this,
        body: nameOrBody,
        args: args2,
        pipeables,
        spanName: "<anonymous>",
        spanOptions: {
          context: DisablePropagation.context(true)
        },
        errorDef,
        errorCall
      });
    });
  }
  const name = nameOrBody;
  const options = pipeables[0];
  return (body, ...pipeables2) => defineLength(body.length, {
    [name](...args2) {
      const limit2 = Error.stackTraceLimit;
      Error.stackTraceLimit = 2;
      const errorCall = new Error();
      Error.stackTraceLimit = limit2;
      return fnApply({
        self: this,
        body,
        args: args2,
        pipeables: pipeables2,
        spanName: name,
        spanOptions: options,
        errorDef,
        errorCall
      });
    }
  }[name]);
};
function defineLength(length3, fn2) {
  return Object.defineProperty(fn2, "length", {
    value: length3,
    configurable: true
  });
}
function fnApply(options) {
  let effect3;
  let fnError = void 0;
  if (isGeneratorFunction(options.body)) {
    effect3 = fromIterator(() => options.body.apply(options.self, options.args));
  } else {
    try {
      effect3 = options.body.apply(options.self, options.args);
    } catch (error) {
      fnError = error;
      effect3 = die7(error);
    }
  }
  if (options.pipeables.length > 0) {
    try {
      for (const x of options.pipeables) {
        effect3 = x(effect3, ...options.args);
      }
    } catch (error) {
      effect3 = fnError ? failCause9(sequential(die(fnError), die(error))) : die7(error);
    }
  }
  let cache = false;
  const captureStackTrace = () => {
    if (cache !== false) {
      return cache;
    }
    if (options.errorCall.stack) {
      const stackDef = options.errorDef.stack.trim().split("\n");
      const stackCall = options.errorCall.stack.trim().split("\n");
      let endStackDef = stackDef.slice(2).join("\n").trim();
      if (!endStackDef.includes(`(`)) {
        endStackDef = endStackDef.replace(/at (.*)/, "at ($1)");
      }
      let endStackCall = stackCall.slice(2).join("\n").trim();
      if (!endStackCall.includes(`(`)) {
        endStackCall = endStackCall.replace(/at (.*)/, "at ($1)");
      }
      cache = `${endStackDef}
${endStackCall}`;
      return cache;
    }
  };
  const opts = options.spanOptions && "captureStackTrace" in options.spanOptions ? options.spanOptions : {
    captureStackTrace,
    ...options.spanOptions
  };
  return withSpan3(effect3, options.spanName, opts);
}
var fnUntraced2 = fnUntraced;
var ensureSuccessType = () => (effect3) => effect3;
var ensureErrorType = () => (effect3) => effect3;
var ensureRequirementsType = () => (effect3) => effect3;

// node_modules/effect/dist/esm/Layer.js
var Layer_exports = {};
__export(Layer_exports, {
  CurrentMemoMap: () => CurrentMemoMap2,
  LayerTypeId: () => LayerTypeId2,
  MemoMapTypeId: () => MemoMapTypeId2,
  annotateLogs: () => annotateLogs4,
  annotateSpans: () => annotateSpans4,
  build: () => build2,
  buildWithMemoMap: () => buildWithMemoMap2,
  buildWithScope: () => buildWithScope2,
  catchAll: () => catchAll4,
  catchAllCause: () => catchAllCause4,
  context: () => context4,
  die: () => die8,
  dieSync: () => dieSync5,
  discard: () => discard2,
  effect: () => effect,
  effectContext: () => effectContext,
  effectDiscard: () => effectDiscard,
  empty: () => empty31,
  extendScope: () => extendScope2,
  fail: () => fail11,
  failCause: () => failCause10,
  failCauseSync: () => failCauseSync5,
  failSync: () => failSync5,
  fiberRefLocallyScopedWith: () => fiberRefLocallyScopedWith3,
  flatMap: () => flatMap13,
  flatten: () => flatten11,
  fresh: () => fresh2,
  function: () => fromFunction3,
  isFresh: () => isFresh2,
  isLayer: () => isLayer2,
  launch: () => launch2,
  locally: () => locally2,
  locallyEffect: () => locallyEffect2,
  locallyScoped: () => locallyScoped2,
  locallyWith: () => locallyWith2,
  makeMemoMap: () => makeMemoMap2,
  map: () => map19,
  mapError: () => mapError5,
  match: () => match16,
  matchCause: () => matchCause5,
  memoize: () => memoize3,
  merge: () => merge8,
  mergeAll: () => mergeAll6,
  mock: () => mock2,
  orDie: () => orDie4,
  orElse: () => orElse7,
  parentSpan: () => parentSpan2,
  passthrough: () => passthrough3,
  project: () => project2,
  provide: () => provide3,
  provideMerge: () => provideMerge2,
  retry: () => retry3,
  scope: () => scope4,
  scoped: () => scoped4,
  scopedContext: () => scopedContext2,
  scopedDiscard: () => scopedDiscard2,
  service: () => service2,
  setClock: () => setClock,
  setConfigProvider: () => setConfigProvider2,
  setRandom: () => setRandom,
  setRequestBatching: () => setRequestBatching,
  setRequestCache: () => setRequestCache,
  setRequestCaching: () => setRequestCaching,
  setScheduler: () => setScheduler,
  setTracer: () => setTracer2,
  setTracerEnabled: () => setTracerEnabled,
  setTracerTiming: () => setTracerTiming,
  setUnhandledErrorLogLevel: () => setUnhandledErrorLogLevel,
  setVersionMismatchErrorLogLevel: () => setVersionMismatchErrorLogLevel,
  span: () => span3,
  succeed: () => succeed11,
  succeedContext: () => succeedContext2,
  suspend: () => suspend5,
  sync: () => sync7,
  syncContext: () => syncContext2,
  tap: () => tap5,
  tapError: () => tapError4,
  tapErrorCause: () => tapErrorCause4,
  toRuntime: () => toRuntime2,
  toRuntimeWithMemoMap: () => toRuntimeWithMemoMap2,
  unwrapEffect: () => unwrapEffect2,
  unwrapScoped: () => unwrapScoped2,
  updateService: () => updateService3,
  withParentSpan: () => withParentSpan4,
  withSpan: () => withSpan4,
  zipWith: () => zipWith9
});

// node_modules/effect/dist/esm/internal/layer/circular.js
var setConfigProvider = (configProvider) => scopedDiscard(withConfigProviderScoped(configProvider));
var parentSpan = (span4) => succeedContext(make5(spanTag, span4));
var span2 = (name, options) => {
  options = addSpanStackTrace(options);
  return scoped2(spanTag, options?.onEnd ? tap2(makeSpanScoped(name, options), (span4) => addFinalizer((exit4) => options.onEnd(span4, exit4))) : makeSpanScoped(name, options));
};
var setTracer = (tracer3) => scopedDiscard(withTracerScoped(tracer3));

// node_modules/effect/dist/esm/Layer.js
var LayerTypeId2 = LayerTypeId;
var MemoMapTypeId2 = MemoMapTypeId;
var CurrentMemoMap2 = CurrentMemoMap;
var isLayer2 = isLayer;
var isFresh2 = isFresh;
var annotateLogs4 = annotateLogs2;
var annotateSpans4 = annotateSpans2;
var build2 = build;
var buildWithScope2 = buildWithScope;
var catchAll4 = catchAll2;
var catchAllCause4 = catchAllCause2;
var context4 = context2;
var die8 = die6;
var dieSync5 = dieSync3;
var discard2 = discard;
var effect = fromEffect4;
var effectDiscard = fromEffectDiscard;
var effectContext = fromEffectContext;
var empty31 = empty30;
var extendScope2 = extendScope;
var fail11 = fail8;
var failSync5 = failSync3;
var failCause10 = failCause7;
var failCauseSync5 = failCauseSync3;
var flatMap13 = flatMap11;
var flatten11 = flatten9;
var fresh2 = fresh;
var mock2 = mock;
var fromFunction3 = fromFunction;
var launch2 = launch;
var map19 = map16;
var mapError5 = mapError3;
var match16 = match13;
var matchCause5 = matchCause3;
var memoize3 = memoize2;
var merge8 = merge6;
var mergeAll6 = mergeAll4;
var orDie4 = orDie2;
var orElse7 = orElse5;
var passthrough3 = passthrough;
var project2 = project;
var locallyEffect2 = locallyEffect;
var locally2 = fiberRefLocally2;
var locallyWith2 = fiberRefLocallyWith2;
var locallyScoped2 = fiberRefLocallyScoped2;
var fiberRefLocallyScopedWith3 = fiberRefLocallyScopedWith2;
var retry3 = retry;
var scope4 = scope2;
var scoped4 = scoped2;
var scopedDiscard2 = scopedDiscard;
var scopedContext2 = scopedContext;
var service2 = service;
var succeed11 = succeed7;
var succeedContext2 = succeedContext;
var suspend5 = suspend3;
var sync7 = sync4;
var syncContext2 = syncContext;
var tap5 = tap3;
var tapError4 = tapError2;
var tapErrorCause4 = tapErrorCause2;
var toRuntime2 = toRuntime;
var toRuntimeWithMemoMap2 = toRuntimeWithMemoMap;
var provide3 = provide;
var provideMerge2 = provideMerge;
var zipWith9 = zipWith6;
var unwrapEffect2 = unwrapEffect;
var unwrapScoped2 = unwrapScoped;
var setClock = (clock3) => scopedDiscard2(fiberRefLocallyScopedWith(currentServices, add2(clockTag, clock3)));
var setConfigProvider2 = setConfigProvider;
var parentSpan2 = parentSpan;
var setRandom = (random4) => scopedDiscard2(fiberRefLocallyScopedWith(currentServices, add2(randomTag, random4)));
var setRequestBatching = (requestBatching) => scopedDiscard2(fiberRefLocallyScoped(currentRequestBatching, requestBatching));
var setRequestCaching = (requestCaching) => scopedDiscard2(fiberRefLocallyScoped(currentCacheEnabled, requestCaching));
var setRequestCache = (cache) => scopedDiscard2(isEffect(cache) ? flatMap7(cache, (x) => fiberRefLocallyScoped(currentCache, x)) : fiberRefLocallyScoped(currentCache, cache));
var setScheduler = (scheduler) => scopedDiscard2(fiberRefLocallyScoped(currentScheduler, scheduler));
var span3 = span2;
var setTracer2 = setTracer;
var setTracerEnabled = (enabled2) => scopedDiscard2(fiberRefLocallyScoped(currentTracerEnabled, enabled2));
var setTracerTiming = (enabled2) => scopedDiscard2(fiberRefLocallyScoped(currentTracerTimingEnabled, enabled2));
var setUnhandledErrorLogLevel = (level) => scopedDiscard2(fiberRefLocallyScoped(currentUnhandledErrorLogLevel, level));
var setVersionMismatchErrorLogLevel = (level) => scopedDiscard2(fiberRefLocallyScoped(currentVersionMismatchErrorLogLevel, level));
var withSpan4 = withSpan2;
var withParentSpan4 = withParentSpan2;
var makeMemoMap2 = makeMemoMap;
var buildWithMemoMap2 = buildWithMemoMap;
var updateService3 = /* @__PURE__ */ dual(3, (layer2, tag2, f) => provide3(layer2, map19(context4(), (c) => add2(c, tag2, f(unsafeGet3(c, tag2))))));

// node_modules/effect/dist/esm/internal/queue.js
var EnqueueSymbolKey = "effect/QueueEnqueue";
var EnqueueTypeId = /* @__PURE__ */ Symbol.for(EnqueueSymbolKey);
var DequeueSymbolKey = "effect/QueueDequeue";
var DequeueTypeId = /* @__PURE__ */ Symbol.for(DequeueSymbolKey);
var QueueStrategySymbolKey = "effect/QueueStrategy";
var QueueStrategyTypeId = /* @__PURE__ */ Symbol.for(QueueStrategySymbolKey);
var BackingQueueSymbolKey = "effect/BackingQueue";
var BackingQueueTypeId = /* @__PURE__ */ Symbol.for(BackingQueueSymbolKey);
var queueStrategyVariance = {
  /* c8 ignore next */
  _A: (_) => _
};
var backingQueueVariance = {
  /* c8 ignore next */
  _A: (_) => _
};
var enqueueVariance = {
  /* c8 ignore next */
  _In: (_) => _
};
var dequeueVariance = {
  /* c8 ignore next */
  _Out: (_) => _
};
var QueueImpl = class extends Class2 {
  queue;
  takers;
  shutdownHook;
  shutdownFlag;
  strategy;
  [EnqueueTypeId] = enqueueVariance;
  [DequeueTypeId] = dequeueVariance;
  constructor(queue, takers, shutdownHook, shutdownFlag, strategy) {
    super();
    this.queue = queue;
    this.takers = takers;
    this.shutdownHook = shutdownHook;
    this.shutdownFlag = shutdownFlag;
    this.strategy = strategy;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  commit() {
    return this.take;
  }
  capacity() {
    return this.queue.capacity();
  }
  get size() {
    return suspend(() => catchAll(this.unsafeSize(), () => interrupt2));
  }
  unsafeSize() {
    if (get6(this.shutdownFlag)) {
      return none2();
    }
    return some2(this.queue.length() - length2(this.takers) + this.strategy.surplusSize());
  }
  get isEmpty() {
    return map10(this.size, (size13) => size13 <= 0);
  }
  get isFull() {
    return map10(this.size, (size13) => size13 >= this.capacity());
  }
  get shutdown() {
    return uninterruptible(withFiberRuntime((state) => {
      pipe(this.shutdownFlag, set2(true));
      return pipe(forEachConcurrentDiscard(unsafePollAll(this.takers), (d) => deferredInterruptWith(d, state.id()), false, false), zipRight2(this.strategy.shutdown), whenEffect(deferredSucceed(this.shutdownHook, void 0)), asVoid2);
    }));
  }
  get isShutdown() {
    return sync(() => get6(this.shutdownFlag));
  }
  get awaitShutdown() {
    return deferredAwait(this.shutdownHook);
  }
  isActive() {
    return !get6(this.shutdownFlag);
  }
  unsafeOffer(value) {
    if (get6(this.shutdownFlag)) {
      return false;
    }
    let noRemaining;
    if (this.queue.length() === 0) {
      const taker = pipe(this.takers, poll2(EmptyMutableQueue));
      if (taker !== EmptyMutableQueue) {
        unsafeCompleteDeferred(taker, value);
        noRemaining = true;
      } else {
        noRemaining = false;
      }
    } else {
      noRemaining = false;
    }
    if (noRemaining) {
      return true;
    }
    const succeeded = this.queue.offer(value);
    unsafeCompleteTakers(this.strategy, this.queue, this.takers);
    return succeeded;
  }
  offer(value) {
    return suspend(() => {
      if (get6(this.shutdownFlag)) {
        return interrupt2;
      }
      let noRemaining;
      if (this.queue.length() === 0) {
        const taker = pipe(this.takers, poll2(EmptyMutableQueue));
        if (taker !== EmptyMutableQueue) {
          unsafeCompleteDeferred(taker, value);
          noRemaining = true;
        } else {
          noRemaining = false;
        }
      } else {
        noRemaining = false;
      }
      if (noRemaining) {
        return succeed(true);
      }
      const succeeded = this.queue.offer(value);
      unsafeCompleteTakers(this.strategy, this.queue, this.takers);
      return succeeded ? succeed(true) : this.strategy.handleSurplus([value], this.queue, this.takers, this.shutdownFlag);
    });
  }
  offerAll(iterable) {
    return suspend(() => {
      if (get6(this.shutdownFlag)) {
        return interrupt2;
      }
      const values3 = fromIterable2(iterable);
      const pTakers = this.queue.length() === 0 ? fromIterable2(unsafePollN(this.takers, values3.length)) : empty;
      const [forTakers, remaining] = pipe(values3, splitAt(pTakers.length));
      for (let i = 0; i < pTakers.length; i++) {
        const taker = pTakers[i];
        const item = forTakers[i];
        unsafeCompleteDeferred(taker, item);
      }
      if (remaining.length === 0) {
        return succeed(true);
      }
      const surplus = this.queue.offerAll(remaining);
      unsafeCompleteTakers(this.strategy, this.queue, this.takers);
      return isEmpty(surplus) ? succeed(true) : this.strategy.handleSurplus(surplus, this.queue, this.takers, this.shutdownFlag);
    });
  }
  get take() {
    return withFiberRuntime((state) => {
      if (get6(this.shutdownFlag)) {
        return interrupt2;
      }
      const item = this.queue.poll(EmptyMutableQueue);
      if (item !== EmptyMutableQueue) {
        this.strategy.unsafeOnQueueEmptySpace(this.queue, this.takers);
        return succeed(item);
      } else {
        const deferred = deferredUnsafeMake(state.id());
        return pipe(suspend(() => {
          pipe(this.takers, offer(deferred));
          unsafeCompleteTakers(this.strategy, this.queue, this.takers);
          return get6(this.shutdownFlag) ? interrupt2 : deferredAwait(deferred);
        }), onInterrupt(() => {
          return sync(() => unsafeRemove(this.takers, deferred));
        }));
      }
    });
  }
  get takeAll() {
    return suspend(() => {
      return get6(this.shutdownFlag) ? interrupt2 : sync(() => {
        const values3 = this.queue.pollUpTo(Number.POSITIVE_INFINITY);
        this.strategy.unsafeOnQueueEmptySpace(this.queue, this.takers);
        return fromIterable3(values3);
      });
    });
  }
  takeUpTo(max6) {
    return suspend(() => get6(this.shutdownFlag) ? interrupt2 : sync(() => {
      const values3 = this.queue.pollUpTo(max6);
      this.strategy.unsafeOnQueueEmptySpace(this.queue, this.takers);
      return fromIterable3(values3);
    }));
  }
  takeBetween(min4, max6) {
    return suspend(() => takeRemainderLoop(this, min4, max6, empty4()));
  }
};
var takeRemainderLoop = (self, min4, max6, acc) => {
  if (max6 < min4) {
    return succeed(acc);
  }
  return pipe(takeUpTo(self, max6), flatMap7((bs) => {
    const remaining = min4 - bs.length;
    if (remaining === 1) {
      return pipe(take(self), map10((b) => pipe(acc, appendAll2(bs), append2(b))));
    }
    if (remaining > 1) {
      return pipe(take(self), flatMap7((b) => takeRemainderLoop(self, remaining - 1, max6 - bs.length - 1, pipe(acc, appendAll2(bs), append2(b)))));
    }
    return succeed(pipe(acc, appendAll2(bs)));
  }));
};
var bounded2 = (requestedCapacity) => pipe(sync(() => bounded(requestedCapacity)), flatMap7((queue) => make43(backingQueueFromMutableQueue(queue), backPressureStrategy())));
var dropping = (requestedCapacity) => pipe(sync(() => bounded(requestedCapacity)), flatMap7((queue) => make43(backingQueueFromMutableQueue(queue), droppingStrategy())));
var sliding = (requestedCapacity) => pipe(sync(() => bounded(requestedCapacity)), flatMap7((queue) => make43(backingQueueFromMutableQueue(queue), slidingStrategy())));
var unbounded2 = () => pipe(sync(() => unbounded()), flatMap7((queue) => make43(backingQueueFromMutableQueue(queue), droppingStrategy())));
var unsafeMake11 = (queue, takers, shutdownHook, shutdownFlag, strategy) => {
  return new QueueImpl(queue, takers, shutdownHook, shutdownFlag, strategy);
};
var make43 = (queue, strategy) => pipe(deferredMake(), map10((deferred) => unsafeMake11(queue, unbounded(), deferred, make11(false), strategy)));
var BackingQueueFromMutableQueue = class {
  mutable;
  [BackingQueueTypeId] = backingQueueVariance;
  constructor(mutable2) {
    this.mutable = mutable2;
  }
  poll(def) {
    return poll2(this.mutable, def);
  }
  pollUpTo(limit) {
    return pollUpTo(this.mutable, limit);
  }
  offerAll(elements) {
    return offerAll(this.mutable, elements);
  }
  offer(element) {
    return offer(this.mutable, element);
  }
  capacity() {
    return capacity(this.mutable);
  }
  length() {
    return length2(this.mutable);
  }
};
var backingQueueFromMutableQueue = (mutable2) => new BackingQueueFromMutableQueue(mutable2);
var size11 = (self) => self.size;
var shutdown = (self) => self.shutdown;
var offer2 = /* @__PURE__ */ dual(2, (self, value) => self.offer(value));
var take = (self) => self.take;
var takeUpTo = /* @__PURE__ */ dual(2, (self, max6) => self.takeUpTo(max6));
var backPressureStrategy = () => new BackPressureStrategy();
var droppingStrategy = () => new DroppingStrategy();
var slidingStrategy = () => new SlidingStrategy();
var BackPressureStrategy = class {
  [QueueStrategyTypeId] = queueStrategyVariance;
  putters = /* @__PURE__ */ unbounded();
  surplusSize() {
    return length2(this.putters);
  }
  onCompleteTakersWithEmptyQueue(takers) {
    while (!isEmpty7(this.putters) && !isEmpty7(takers)) {
      const taker = poll2(takers, void 0);
      const putter = poll2(this.putters, void 0);
      if (putter[2]) {
        unsafeCompleteDeferred(putter[1], true);
      }
      unsafeCompleteDeferred(taker, putter[0]);
    }
  }
  get shutdown() {
    return pipe(fiberId, flatMap7((fiberId3) => pipe(sync(() => unsafePollAll(this.putters)), flatMap7((putters) => forEachConcurrentDiscard(putters, ([_, deferred, isLastItem]) => isLastItem ? pipe(deferredInterruptWith(deferred, fiberId3), asVoid2) : void_2, false, false)))));
  }
  handleSurplus(iterable, queue, takers, isShutdown3) {
    return withFiberRuntime((state) => {
      const deferred = deferredUnsafeMake(state.id());
      return pipe(suspend(() => {
        this.unsafeOffer(iterable, deferred);
        this.unsafeOnQueueEmptySpace(queue, takers);
        unsafeCompleteTakers(this, queue, takers);
        return get6(isShutdown3) ? interrupt2 : deferredAwait(deferred);
      }), onInterrupt(() => sync(() => this.unsafeRemove(deferred))));
    });
  }
  unsafeOnQueueEmptySpace(queue, takers) {
    let keepPolling = true;
    while (keepPolling && (queue.capacity() === Number.POSITIVE_INFINITY || queue.length() < queue.capacity())) {
      const putter = pipe(this.putters, poll2(EmptyMutableQueue));
      if (putter === EmptyMutableQueue) {
        keepPolling = false;
      } else {
        const offered = queue.offer(putter[0]);
        if (offered && putter[2]) {
          unsafeCompleteDeferred(putter[1], true);
        } else if (!offered) {
          unsafeOfferAll(this.putters, pipe(unsafePollAll(this.putters), prepend2(putter)));
        }
        unsafeCompleteTakers(this, queue, takers);
      }
    }
  }
  unsafeOffer(iterable, deferred) {
    const stuff = fromIterable2(iterable);
    for (let i = 0; i < stuff.length; i++) {
      const value = stuff[i];
      if (i === stuff.length - 1) {
        pipe(this.putters, offer([value, deferred, true]));
      } else {
        pipe(this.putters, offer([value, deferred, false]));
      }
    }
  }
  unsafeRemove(deferred) {
    unsafeOfferAll(this.putters, pipe(unsafePollAll(this.putters), filter3(([, _]) => _ !== deferred)));
  }
};
var DroppingStrategy = class {
  [QueueStrategyTypeId] = queueStrategyVariance;
  surplusSize() {
    return 0;
  }
  get shutdown() {
    return void_2;
  }
  onCompleteTakersWithEmptyQueue() {
  }
  handleSurplus(_iterable, _queue, _takers, _isShutdown) {
    return succeed(false);
  }
  unsafeOnQueueEmptySpace(_queue, _takers) {
  }
};
var SlidingStrategy = class {
  [QueueStrategyTypeId] = queueStrategyVariance;
  surplusSize() {
    return 0;
  }
  get shutdown() {
    return void_2;
  }
  onCompleteTakersWithEmptyQueue() {
  }
  handleSurplus(iterable, queue, takers, _isShutdown) {
    return sync(() => {
      this.unsafeOffer(queue, iterable);
      unsafeCompleteTakers(this, queue, takers);
      return true;
    });
  }
  unsafeOnQueueEmptySpace(_queue, _takers) {
  }
  unsafeOffer(queue, iterable) {
    const iterator = iterable[Symbol.iterator]();
    let next4;
    let offering = true;
    while (!(next4 = iterator.next()).done && offering) {
      if (queue.capacity() === 0) {
        return;
      }
      queue.poll(EmptyMutableQueue);
      offering = queue.offer(next4.value);
    }
  }
};
var unsafeCompleteDeferred = (deferred, a) => {
  return deferredUnsafeDone(deferred, succeed(a));
};
var unsafeOfferAll = (queue, as13) => {
  return pipe(queue, offerAll(as13));
};
var unsafePollAll = (queue) => {
  return pipe(queue, pollUpTo(Number.POSITIVE_INFINITY));
};
var unsafePollN = (queue, max6) => {
  return pipe(queue, pollUpTo(max6));
};
var unsafeRemove = (queue, a) => {
  unsafeOfferAll(queue, pipe(unsafePollAll(queue), filter3((b) => a !== b)));
};
var unsafeCompleteTakers = (strategy, queue, takers) => {
  let keepPolling = true;
  while (keepPolling && queue.length() !== 0) {
    const taker = pipe(takers, poll2(EmptyMutableQueue));
    if (taker !== EmptyMutableQueue) {
      const element = queue.poll(EmptyMutableQueue);
      if (element !== EmptyMutableQueue) {
        unsafeCompleteDeferred(taker, element);
        strategy.unsafeOnQueueEmptySpace(queue, takers);
      } else {
        unsafeOfferAll(takers, pipe(unsafePollAll(takers), prepend2(taker)));
      }
      keepPolling = true;
    } else {
      keepPolling = false;
    }
  }
  if (keepPolling && queue.length() === 0 && !isEmpty7(takers)) {
    strategy.onCompleteTakersWithEmptyQueue(takers);
  }
};

// node_modules/effect/dist/esm/Queue.js
var bounded3 = bounded2;
var dropping2 = dropping;
var sliding2 = sliding;
var unbounded3 = unbounded2;
var size12 = size11;
var shutdown2 = shutdown;
var offer3 = offer2;
var take2 = take;

// node_modules/effect/dist/esm/internal/opCodes/channelChildExecutorDecision.js
var OP_CONTINUE2 = "Continue";
var OP_CLOSE = "Close";
var OP_YIELD2 = "Yield";

// node_modules/effect/dist/esm/internal/channel/childExecutorDecision.js
var ChildExecutorDecisionSymbolKey = "effect/ChannelChildExecutorDecision";
var ChildExecutorDecisionTypeId = /* @__PURE__ */ Symbol.for(ChildExecutorDecisionSymbolKey);
var proto4 = {
  [ChildExecutorDecisionTypeId]: ChildExecutorDecisionTypeId
};
var Continue = (_) => {
  const op = Object.create(proto4);
  op._tag = OP_CONTINUE2;
  return op;
};

// node_modules/effect/dist/esm/internal/opCodes/continuation.js
var OP_CONTINUATION_K = "ContinuationK";
var OP_CONTINUATION_FINALIZER = "ContinuationFinalizer";

// node_modules/effect/dist/esm/internal/channel/continuation.js
var ContinuationTypeId = /* @__PURE__ */ Symbol.for("effect/ChannelContinuation");
var continuationVariance = {
  /* c8 ignore next */
  _Env: (_) => _,
  /* c8 ignore next */
  _InErr: (_) => _,
  /* c8 ignore next */
  _InElem: (_) => _,
  /* c8 ignore next */
  _InDone: (_) => _,
  /* c8 ignore next */
  _OutErr: (_) => _,
  /* c8 ignore next */
  _OutDone: (_) => _,
  /* c8 ignore next */
  _OutErr2: (_) => _,
  /* c8 ignore next */
  _OutElem: (_) => _,
  /* c8 ignore next */
  _OutDone2: (_) => _
};
var ContinuationKImpl = class {
  onSuccess;
  onHalt;
  _tag = OP_CONTINUATION_K;
  [ContinuationTypeId] = continuationVariance;
  constructor(onSuccess, onHalt) {
    this.onSuccess = onSuccess;
    this.onHalt = onHalt;
  }
  onExit(exit4) {
    return isFailure2(exit4) ? this.onHalt(exit4.cause) : this.onSuccess(exit4.value);
  }
};
var ContinuationFinalizerImpl = class {
  finalizer;
  _tag = OP_CONTINUATION_FINALIZER;
  [ContinuationTypeId] = continuationVariance;
  constructor(finalizer2) {
    this.finalizer = finalizer2;
  }
};

// node_modules/effect/dist/esm/internal/opCodes/channelUpstreamPullStrategy.js
var OP_PULL_AFTER_NEXT = "PullAfterNext";
var OP_PULL_AFTER_ALL_ENQUEUED = "PullAfterAllEnqueued";

// node_modules/effect/dist/esm/internal/channel/upstreamPullStrategy.js
var UpstreamPullStrategySymbolKey = "effect/ChannelUpstreamPullStrategy";
var UpstreamPullStrategyTypeId = /* @__PURE__ */ Symbol.for(UpstreamPullStrategySymbolKey);
var upstreamPullStrategyVariance = {
  /* c8 ignore next */
  _A: (_) => _
};
var proto5 = {
  [UpstreamPullStrategyTypeId]: upstreamPullStrategyVariance
};
var PullAfterNext = (emitSeparator) => {
  const op = Object.create(proto5);
  op._tag = OP_PULL_AFTER_NEXT;
  op.emitSeparator = emitSeparator;
  return op;
};

// node_modules/effect/dist/esm/internal/opCodes/channel.js
var OP_BRACKET_OUT = "BracketOut";
var OP_BRIDGE = "Bridge";
var OP_CONCAT_ALL = "ConcatAll";
var OP_EMIT = "Emit";
var OP_ENSURING = "Ensuring";
var OP_FAIL3 = "Fail";
var OP_FOLD2 = "Fold";
var OP_FROM_EFFECT2 = "FromEffect";
var OP_PIPE_TO = "PipeTo";
var OP_PROVIDE2 = "Provide";
var OP_READ = "Read";
var OP_SUCCEED = "Succeed";
var OP_SUCCEED_NOW = "SucceedNow";
var OP_SUSPEND2 = "Suspend";

// node_modules/effect/dist/esm/internal/core-stream.js
var ChannelSymbolKey = "effect/Channel";
var ChannelTypeId2 = /* @__PURE__ */ Symbol.for(ChannelSymbolKey);
var channelVariance2 = {
  /* c8 ignore next */
  _Env: (_) => _,
  /* c8 ignore next */
  _InErr: (_) => _,
  /* c8 ignore next */
  _InElem: (_) => _,
  /* c8 ignore next */
  _InDone: (_) => _,
  /* c8 ignore next */
  _OutErr: (_) => _,
  /* c8 ignore next */
  _OutElem: (_) => _,
  /* c8 ignore next */
  _OutDone: (_) => _
};
var proto6 = {
  [ChannelTypeId2]: channelVariance2,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isChannel = (u) => hasProperty(u, ChannelTypeId2) || isEffect2(u);
var acquireReleaseOut = /* @__PURE__ */ dual(2, (self, release) => {
  const op = Object.create(proto6);
  op._tag = OP_BRACKET_OUT;
  op.acquire = () => self;
  op.finalizer = release;
  return op;
});
var concatAllWith = (channels, f, g) => {
  const op = Object.create(proto6);
  op._tag = OP_CONCAT_ALL;
  op.combineInners = f;
  op.combineAll = g;
  op.onPull = () => PullAfterNext(none2());
  op.onEmit = () => Continue;
  op.value = () => channels;
  op.k = identity;
  return op;
};
var concatMapWith = /* @__PURE__ */ dual(4, (self, f, g, h) => {
  const op = Object.create(proto6);
  op._tag = OP_CONCAT_ALL;
  op.combineInners = g;
  op.combineAll = h;
  op.onPull = () => PullAfterNext(none2());
  op.onEmit = () => Continue;
  op.value = () => self;
  op.k = f;
  return op;
});
var embedInput = /* @__PURE__ */ dual(2, (self, input) => {
  const op = Object.create(proto6);
  op._tag = OP_BRIDGE;
  op.input = input;
  op.channel = self;
  return op;
});
var ensuringWith = /* @__PURE__ */ dual(2, (self, finalizer2) => {
  const op = Object.create(proto6);
  op._tag = OP_ENSURING;
  op.channel = self;
  op.finalizer = finalizer2;
  return op;
});
var fail12 = (error) => failCause11(fail6(error));
var failCause11 = (cause3) => failCauseSync6(() => cause3);
var failCauseSync6 = (evaluate2) => {
  const op = Object.create(proto6);
  op._tag = OP_FAIL3;
  op.error = evaluate2;
  return op;
};
var flatMap14 = /* @__PURE__ */ dual(2, (self, f) => {
  const op = Object.create(proto6);
  op._tag = OP_FOLD2;
  op.channel = self;
  op.k = new ContinuationKImpl(f, failCause11);
  return op;
});
var fromEffect5 = (effect3) => {
  const op = Object.create(proto6);
  op._tag = OP_FROM_EFFECT2;
  op.effect = () => effect3;
  return op;
};
var pipeTo = /* @__PURE__ */ dual(2, (self, that) => {
  const op = Object.create(proto6);
  op._tag = OP_PIPE_TO;
  op.left = () => self;
  op.right = () => that;
  return op;
});
var readWith = (options) => readWithCause({
  onInput: options.onInput,
  onFailure: (cause3) => match(failureOrCause2(cause3), {
    onLeft: options.onFailure,
    onRight: failCause11
  }),
  onDone: options.onDone
});
var readWithCause = (options) => {
  const op = Object.create(proto6);
  op._tag = OP_READ;
  op.more = options.onInput;
  op.done = new ContinuationKImpl(options.onDone, options.onFailure);
  return op;
};
var succeed12 = (value) => sync8(() => value);
var succeedNow = (result) => {
  const op = Object.create(proto6);
  op._tag = OP_SUCCEED_NOW;
  op.terminal = result;
  return op;
};
var sync8 = (evaluate2) => {
  const op = Object.create(proto6);
  op._tag = OP_SUCCEED;
  op.evaluate = evaluate2;
  return op;
};
var void_7 = /* @__PURE__ */ succeedNow(void 0);
var write = (out) => {
  const op = Object.create(proto6);
  op._tag = OP_EMIT;
  op.out = out;
  return op;
};

// node_modules/effect/dist/esm/internal/opCodes/channelState.js
var OP_DONE3 = "Done";
var OP_EMIT2 = "Emit";
var OP_FROM_EFFECT3 = "FromEffect";
var OP_READ2 = "Read";

// node_modules/effect/dist/esm/internal/channel/channelState.js
var ChannelStateTypeId = /* @__PURE__ */ Symbol.for("effect/ChannelState");
var channelStateVariance = {
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _R: (_) => _
};
var proto7 = {
  [ChannelStateTypeId]: channelStateVariance
};
var Done2 = () => {
  const op = Object.create(proto7);
  op._tag = OP_DONE3;
  return op;
};
var Emit = () => {
  const op = Object.create(proto7);
  op._tag = OP_EMIT2;
  return op;
};
var fromEffect6 = (effect3) => {
  const op = Object.create(proto7);
  op._tag = OP_FROM_EFFECT3;
  op.effect = effect3;
  return op;
};
var Read = (upstream, onEffect, onEmit, onDone2) => {
  const op = Object.create(proto7);
  op._tag = OP_READ2;
  op.upstream = upstream;
  op.onEffect = onEffect;
  op.onEmit = onEmit;
  op.onDone = onDone2;
  return op;
};
var isFromEffect = (self) => self._tag === OP_FROM_EFFECT3;
var effect2 = (self) => isFromEffect(self) ? self.effect : _void;
var effectOrUndefinedIgnored = (self) => isFromEffect(self) ? ignore2(self.effect) : void 0;

// node_modules/effect/dist/esm/internal/channel/subexecutor.js
var OP_PULL_FROM_CHILD = "PullFromChild";
var OP_PULL_FROM_UPSTREAM = "PullFromUpstream";
var OP_DRAIN_CHILD_EXECUTORS = "DrainChildExecutors";
var OP_EMIT3 = "Emit";
var PullFromChild = class {
  childExecutor;
  parentSubexecutor;
  onEmit;
  _tag = OP_PULL_FROM_CHILD;
  constructor(childExecutor, parentSubexecutor, onEmit) {
    this.childExecutor = childExecutor;
    this.parentSubexecutor = parentSubexecutor;
    this.onEmit = onEmit;
  }
  close(exit4) {
    const fin1 = this.childExecutor.close(exit4);
    const fin2 = this.parentSubexecutor.close(exit4);
    if (fin1 !== void 0 && fin2 !== void 0) {
      return zipWith8(exit3(fin1), exit3(fin2), (exit1, exit22) => pipe(exit1, zipRight3(exit22)));
    } else if (fin1 !== void 0) {
      return fin1;
    } else if (fin2 !== void 0) {
      return fin2;
    } else {
      return void 0;
    }
  }
  enqueuePullFromChild(_child) {
    return this;
  }
};
var PullFromUpstream = class _PullFromUpstream {
  upstreamExecutor;
  createChild;
  lastDone;
  activeChildExecutors;
  combineChildResults;
  combineWithChildResult;
  onPull;
  onEmit;
  _tag = OP_PULL_FROM_UPSTREAM;
  constructor(upstreamExecutor, createChild, lastDone, activeChildExecutors, combineChildResults, combineWithChildResult, onPull, onEmit) {
    this.upstreamExecutor = upstreamExecutor;
    this.createChild = createChild;
    this.lastDone = lastDone;
    this.activeChildExecutors = activeChildExecutors;
    this.combineChildResults = combineChildResults;
    this.combineWithChildResult = combineWithChildResult;
    this.onPull = onPull;
    this.onEmit = onEmit;
  }
  close(exit4) {
    const fin1 = this.upstreamExecutor.close(exit4);
    const fins = [...this.activeChildExecutors.map((child) => child !== void 0 ? child.childExecutor.close(exit4) : void 0), fin1];
    const result = fins.reduce((acc, next4) => {
      if (acc !== void 0 && next4 !== void 0) {
        return zipWith8(acc, exit3(next4), (exit1, exit22) => zipRight3(exit1, exit22));
      } else if (acc !== void 0) {
        return acc;
      } else if (next4 !== void 0) {
        return exit3(next4);
      } else {
        return void 0;
      }
    }, void 0);
    return result === void 0 ? result : result;
  }
  enqueuePullFromChild(child) {
    return new _PullFromUpstream(this.upstreamExecutor, this.createChild, this.lastDone, [...this.activeChildExecutors, child], this.combineChildResults, this.combineWithChildResult, this.onPull, this.onEmit);
  }
};
var DrainChildExecutors = class _DrainChildExecutors {
  upstreamExecutor;
  lastDone;
  activeChildExecutors;
  upstreamDone;
  combineChildResults;
  combineWithChildResult;
  onPull;
  _tag = OP_DRAIN_CHILD_EXECUTORS;
  constructor(upstreamExecutor, lastDone, activeChildExecutors, upstreamDone, combineChildResults, combineWithChildResult, onPull) {
    this.upstreamExecutor = upstreamExecutor;
    this.lastDone = lastDone;
    this.activeChildExecutors = activeChildExecutors;
    this.upstreamDone = upstreamDone;
    this.combineChildResults = combineChildResults;
    this.combineWithChildResult = combineWithChildResult;
    this.onPull = onPull;
  }
  close(exit4) {
    const fin1 = this.upstreamExecutor.close(exit4);
    const fins = [...this.activeChildExecutors.map((child) => child !== void 0 ? child.childExecutor.close(exit4) : void 0), fin1];
    const result = fins.reduce((acc, next4) => {
      if (acc !== void 0 && next4 !== void 0) {
        return zipWith8(acc, exit3(next4), (exit1, exit22) => zipRight3(exit1, exit22));
      } else if (acc !== void 0) {
        return acc;
      } else if (next4 !== void 0) {
        return exit3(next4);
      } else {
        return void 0;
      }
    }, void 0);
    return result === void 0 ? result : result;
  }
  enqueuePullFromChild(child) {
    return new _DrainChildExecutors(this.upstreamExecutor, this.lastDone, [...this.activeChildExecutors, child], this.upstreamDone, this.combineChildResults, this.combineWithChildResult, this.onPull);
  }
};
var Emit2 = class {
  value;
  next;
  _tag = OP_EMIT3;
  constructor(value, next4) {
    this.value = value;
    this.next = next4;
  }
  close(exit4) {
    const result = this.next.close(exit4);
    return result === void 0 ? result : result;
  }
  enqueuePullFromChild(_child) {
    return this;
  }
};

// node_modules/effect/dist/esm/internal/opCodes/channelUpstreamPullRequest.js
var OP_PULLED = "Pulled";
var OP_NO_UPSTREAM = "NoUpstream";

// node_modules/effect/dist/esm/internal/channel/upstreamPullRequest.js
var UpstreamPullRequestSymbolKey = "effect/ChannelUpstreamPullRequest";
var UpstreamPullRequestTypeId = /* @__PURE__ */ Symbol.for(UpstreamPullRequestSymbolKey);
var upstreamPullRequestVariance = {
  /* c8 ignore next */
  _A: (_) => _
};
var proto8 = {
  [UpstreamPullRequestTypeId]: upstreamPullRequestVariance
};
var Pulled = (value) => {
  const op = Object.create(proto8);
  op._tag = OP_PULLED;
  op.value = value;
  return op;
};
var NoUpstream = (activeDownstreamCount) => {
  const op = Object.create(proto8);
  op._tag = OP_NO_UPSTREAM;
  op.activeDownstreamCount = activeDownstreamCount;
  return op;
};

// node_modules/effect/dist/esm/internal/channel/channelExecutor.js
var ChannelExecutor = class _ChannelExecutor {
  _activeSubexecutor = void 0;
  _cancelled = void 0;
  _closeLastSubstream = void 0;
  _currentChannel;
  _done = void 0;
  _doneStack = [];
  _emitted = void 0;
  _executeCloseLastSubstream;
  _input = void 0;
  _inProgressFinalizer = void 0;
  _providedEnv;
  constructor(initialChannel, providedEnv, executeCloseLastSubstream) {
    this._currentChannel = initialChannel;
    this._executeCloseLastSubstream = executeCloseLastSubstream;
    this._providedEnv = providedEnv;
  }
  run() {
    let result = void 0;
    while (result === void 0) {
      if (this._cancelled !== void 0) {
        result = this.processCancellation();
      } else if (this._activeSubexecutor !== void 0) {
        result = this.runSubexecutor();
      } else {
        try {
          if (this._currentChannel === void 0) {
            result = Done2();
          } else {
            if (isEffect2(this._currentChannel)) {
              this._currentChannel = fromEffect5(this._currentChannel);
            }
            switch (this._currentChannel._tag) {
              case OP_BRACKET_OUT: {
                result = this.runBracketOut(this._currentChannel);
                break;
              }
              case OP_BRIDGE: {
                const bridgeInput = this._currentChannel.input;
                this._currentChannel = this._currentChannel.channel;
                if (this._input !== void 0) {
                  const inputExecutor = this._input;
                  this._input = void 0;
                  const drainer = () => flatMap12(bridgeInput.awaitRead(), () => suspend4(() => {
                    const state = inputExecutor.run();
                    switch (state._tag) {
                      case OP_DONE3: {
                        return match6(inputExecutor.getDone(), {
                          onFailure: (cause3) => bridgeInput.error(cause3),
                          onSuccess: (value) => bridgeInput.done(value)
                        });
                      }
                      case OP_EMIT2: {
                        return flatMap12(bridgeInput.emit(inputExecutor.getEmit()), () => drainer());
                      }
                      case OP_FROM_EFFECT3: {
                        return matchCauseEffect3(state.effect, {
                          onFailure: (cause3) => bridgeInput.error(cause3),
                          onSuccess: () => drainer()
                        });
                      }
                      case OP_READ2: {
                        return readUpstream(state, () => drainer(), (cause3) => bridgeInput.error(cause3));
                      }
                    }
                  }));
                  result = fromEffect6(flatMap12(forkDaemon2(interruptible4(drainer())), (fiber) => sync6(() => this.addFinalizer((exit4) => flatMap12(interrupt6(fiber), () => suspend4(() => {
                    const effect3 = this.restorePipe(exit4, inputExecutor);
                    return effect3 !== void 0 ? effect3 : _void;
                  }))))));
                }
                break;
              }
              case OP_CONCAT_ALL: {
                const executor = new _ChannelExecutor(this._currentChannel.value(), this._providedEnv, (effect3) => sync6(() => {
                  const prevLastClose = this._closeLastSubstream === void 0 ? _void : this._closeLastSubstream;
                  this._closeLastSubstream = pipe(prevLastClose, zipRight6(effect3));
                }));
                executor._input = this._input;
                const channel = this._currentChannel;
                this._activeSubexecutor = new PullFromUpstream(executor, (value) => channel.k(value), void 0, [], (x, y) => channel.combineInners(x, y), (x, y) => channel.combineAll(x, y), (request2) => channel.onPull(request2), (value) => channel.onEmit(value));
                this._closeLastSubstream = void 0;
                this._currentChannel = void 0;
                break;
              }
              case OP_EMIT: {
                this._emitted = this._currentChannel.out;
                this._currentChannel = this._activeSubexecutor !== void 0 ? void 0 : void_7;
                result = Emit();
                break;
              }
              case OP_ENSURING: {
                this.runEnsuring(this._currentChannel);
                break;
              }
              case OP_FAIL3: {
                result = this.doneHalt(this._currentChannel.error());
                break;
              }
              case OP_FOLD2: {
                this._doneStack.push(this._currentChannel.k);
                this._currentChannel = this._currentChannel.channel;
                break;
              }
              case OP_FROM_EFFECT2: {
                const effect3 = this._providedEnv === void 0 ? this._currentChannel.effect() : pipe(this._currentChannel.effect(), provide2(this._providedEnv));
                result = fromEffect6(matchCauseEffect3(effect3, {
                  onFailure: (cause3) => {
                    const state = this.doneHalt(cause3);
                    return state !== void 0 && isFromEffect(state) ? state.effect : _void;
                  },
                  onSuccess: (value) => {
                    const state = this.doneSucceed(value);
                    return state !== void 0 && isFromEffect(state) ? state.effect : _void;
                  }
                }));
                break;
              }
              case OP_PIPE_TO: {
                const previousInput = this._input;
                const leftExec = new _ChannelExecutor(this._currentChannel.left(), this._providedEnv, (effect3) => this._executeCloseLastSubstream(effect3));
                leftExec._input = previousInput;
                this._input = leftExec;
                this.addFinalizer((exit4) => {
                  const effect3 = this.restorePipe(exit4, previousInput);
                  return effect3 !== void 0 ? effect3 : _void;
                });
                this._currentChannel = this._currentChannel.right();
                break;
              }
              case OP_PROVIDE2: {
                const previousEnv = this._providedEnv;
                this._providedEnv = this._currentChannel.context();
                this._currentChannel = this._currentChannel.inner;
                this.addFinalizer(() => sync6(() => {
                  this._providedEnv = previousEnv;
                }));
                break;
              }
              case OP_READ: {
                const read = this._currentChannel;
                result = Read(this._input, identity, (emitted) => {
                  try {
                    this._currentChannel = read.more(emitted);
                  } catch (error) {
                    this._currentChannel = read.done.onExit(die4(error));
                  }
                  return void 0;
                }, (exit4) => {
                  const onExit4 = (exit5) => {
                    return read.done.onExit(exit5);
                  };
                  this._currentChannel = onExit4(exit4);
                  return void 0;
                });
                break;
              }
              case OP_SUCCEED: {
                result = this.doneSucceed(this._currentChannel.evaluate());
                break;
              }
              case OP_SUCCEED_NOW: {
                result = this.doneSucceed(this._currentChannel.terminal);
                break;
              }
              case OP_SUSPEND2: {
                this._currentChannel = this._currentChannel.channel();
                break;
              }
            }
          }
        } catch (error) {
          this._currentChannel = failCause11(die5(error));
        }
      }
    }
    return result;
  }
  getDone() {
    return this._done;
  }
  getEmit() {
    return this._emitted;
  }
  cancelWith(exit4) {
    this._cancelled = exit4;
  }
  clearInProgressFinalizer() {
    this._inProgressFinalizer = void 0;
  }
  storeInProgressFinalizer(finalizer2) {
    this._inProgressFinalizer = finalizer2;
  }
  popAllFinalizers(exit4) {
    const finalizers = [];
    let next4 = this._doneStack.pop();
    while (next4) {
      if (next4._tag === "ContinuationFinalizer") {
        finalizers.push(next4.finalizer);
      }
      next4 = this._doneStack.pop();
    }
    const effect3 = finalizers.length === 0 ? _void : runFinalizers(finalizers, exit4);
    this.storeInProgressFinalizer(effect3);
    return effect3;
  }
  popNextFinalizers() {
    const builder = [];
    while (this._doneStack.length !== 0) {
      const cont = this._doneStack[this._doneStack.length - 1];
      if (cont._tag === OP_CONTINUATION_K) {
        return builder;
      }
      builder.push(cont);
      this._doneStack.pop();
    }
    return builder;
  }
  restorePipe(exit4, prev) {
    const currInput = this._input;
    this._input = prev;
    if (currInput !== void 0) {
      const effect3 = currInput.close(exit4);
      return effect3;
    }
    return _void;
  }
  close(exit4) {
    let runInProgressFinalizers = void 0;
    const finalizer2 = this._inProgressFinalizer;
    if (finalizer2 !== void 0) {
      runInProgressFinalizers = pipe(finalizer2, ensuring3(sync6(() => this.clearInProgressFinalizer())));
    }
    let closeSelf = void 0;
    const selfFinalizers = this.popAllFinalizers(exit4);
    if (selfFinalizers !== void 0) {
      closeSelf = pipe(selfFinalizers, ensuring3(sync6(() => this.clearInProgressFinalizer())));
    }
    const closeSubexecutors = this._activeSubexecutor === void 0 ? void 0 : this._activeSubexecutor.close(exit4);
    if (closeSubexecutors === void 0 && runInProgressFinalizers === void 0 && closeSelf === void 0) {
      return void 0;
    }
    return pipe(
      exit3(ifNotNull(closeSubexecutors)),
      zip6(exit3(ifNotNull(runInProgressFinalizers))),
      zip6(exit3(ifNotNull(closeSelf))),
      map18(([[exit1, exit22], exit32]) => pipe(exit1, zipRight3(exit22), zipRight3(exit32))),
      uninterruptible2,
      // TODO: remove
      flatMap12((exit5) => suspend4(() => exit5))
    );
  }
  doneSucceed(value) {
    if (this._doneStack.length === 0) {
      this._done = succeed3(value);
      this._currentChannel = void 0;
      return Done2();
    }
    const head6 = this._doneStack[this._doneStack.length - 1];
    if (head6._tag === OP_CONTINUATION_K) {
      this._doneStack.pop();
      this._currentChannel = head6.onSuccess(value);
      return void 0;
    }
    const finalizers = this.popNextFinalizers();
    if (this._doneStack.length === 0) {
      this._doneStack = finalizers.reverse();
      this._done = succeed3(value);
      this._currentChannel = void 0;
      return Done2();
    }
    const finalizerEffect = runFinalizers(finalizers.map((f) => f.finalizer), succeed3(value));
    this.storeInProgressFinalizer(finalizerEffect);
    const effect3 = pipe(finalizerEffect, ensuring3(sync6(() => this.clearInProgressFinalizer())), uninterruptible2, flatMap12(() => sync6(() => this.doneSucceed(value))));
    return fromEffect6(effect3);
  }
  doneHalt(cause3) {
    if (this._doneStack.length === 0) {
      this._done = failCause3(cause3);
      this._currentChannel = void 0;
      return Done2();
    }
    const head6 = this._doneStack[this._doneStack.length - 1];
    if (head6._tag === OP_CONTINUATION_K) {
      this._doneStack.pop();
      try {
        this._currentChannel = head6.onHalt(cause3);
      } catch (error) {
        this._currentChannel = failCause11(die5(error));
      }
      return void 0;
    }
    const finalizers = this.popNextFinalizers();
    if (this._doneStack.length === 0) {
      this._doneStack = finalizers.reverse();
      this._done = failCause3(cause3);
      this._currentChannel = void 0;
      return Done2();
    }
    const finalizerEffect = runFinalizers(finalizers.map((f) => f.finalizer), failCause3(cause3));
    this.storeInProgressFinalizer(finalizerEffect);
    const effect3 = pipe(finalizerEffect, ensuring3(sync6(() => this.clearInProgressFinalizer())), uninterruptible2, flatMap12(() => sync6(() => this.doneHalt(cause3))));
    return fromEffect6(effect3);
  }
  processCancellation() {
    this._currentChannel = void 0;
    this._done = this._cancelled;
    this._cancelled = void 0;
    return Done2();
  }
  runBracketOut(bracketOut) {
    const effect3 = uninterruptible2(matchCauseEffect3(this.provide(bracketOut.acquire()), {
      onFailure: (cause3) => sync6(() => {
        this._currentChannel = failCause11(cause3);
      }),
      onSuccess: (out) => sync6(() => {
        this.addFinalizer((exit4) => this.provide(bracketOut.finalizer(out, exit4)));
        this._currentChannel = write(out);
      })
    }));
    return fromEffect6(effect3);
  }
  provide(effect3) {
    if (this._providedEnv === void 0) {
      return effect3;
    }
    return pipe(effect3, provide2(this._providedEnv));
  }
  runEnsuring(ensuring8) {
    this.addFinalizer(ensuring8.finalizer);
    this._currentChannel = ensuring8.channel;
  }
  addFinalizer(f) {
    this._doneStack.push(new ContinuationFinalizerImpl(f));
  }
  runSubexecutor() {
    const subexecutor = this._activeSubexecutor;
    switch (subexecutor._tag) {
      case OP_PULL_FROM_CHILD: {
        return this.pullFromChild(subexecutor.childExecutor, subexecutor.parentSubexecutor, subexecutor.onEmit, subexecutor);
      }
      case OP_PULL_FROM_UPSTREAM: {
        return this.pullFromUpstream(subexecutor);
      }
      case OP_DRAIN_CHILD_EXECUTORS: {
        return this.drainChildExecutors(subexecutor);
      }
      case OP_EMIT3: {
        this._emitted = subexecutor.value;
        this._activeSubexecutor = subexecutor.next;
        return Emit();
      }
    }
  }
  replaceSubexecutor(nextSubExec) {
    this._currentChannel = void 0;
    this._activeSubexecutor = nextSubExec;
  }
  finishWithExit(exit4) {
    const state = match6(exit4, {
      onFailure: (cause3) => this.doneHalt(cause3),
      onSuccess: (value) => this.doneSucceed(value)
    });
    this._activeSubexecutor = void 0;
    return state === void 0 ? _void : effect2(state);
  }
  finishSubexecutorWithCloseEffect(subexecutorDone, ...closeFuncs) {
    this.addFinalizer(() => pipe(closeFuncs, forEach8((closeFunc) => pipe(sync6(() => closeFunc(subexecutorDone)), flatMap12((closeEffect) => closeEffect !== void 0 ? closeEffect : _void)), {
      discard: true
    })));
    const state = pipe(subexecutorDone, match6({
      onFailure: (cause3) => this.doneHalt(cause3),
      onSuccess: (value) => this.doneSucceed(value)
    }));
    this._activeSubexecutor = void 0;
    return state;
  }
  applyUpstreamPullStrategy(upstreamFinished, queue, strategy) {
    switch (strategy._tag) {
      case OP_PULL_AFTER_NEXT: {
        const shouldPrepend = !upstreamFinished || queue.some((subexecutor) => subexecutor !== void 0);
        return [strategy.emitSeparator, shouldPrepend ? [void 0, ...queue] : queue];
      }
      case OP_PULL_AFTER_ALL_ENQUEUED: {
        const shouldEnqueue = !upstreamFinished || queue.some((subexecutor) => subexecutor !== void 0);
        return [strategy.emitSeparator, shouldEnqueue ? [...queue, void 0] : queue];
      }
    }
  }
  pullFromChild(childExecutor, parentSubexecutor, onEmitted, subexecutor) {
    return Read(childExecutor, identity, (emitted) => {
      const childExecutorDecision = onEmitted(emitted);
      switch (childExecutorDecision._tag) {
        case OP_CONTINUE2: {
          break;
        }
        case OP_CLOSE: {
          this.finishWithDoneValue(childExecutor, parentSubexecutor, childExecutorDecision.value);
          break;
        }
        case OP_YIELD2: {
          const modifiedParent = parentSubexecutor.enqueuePullFromChild(subexecutor);
          this.replaceSubexecutor(modifiedParent);
          break;
        }
      }
      this._activeSubexecutor = new Emit2(emitted, this._activeSubexecutor);
      return void 0;
    }, match6({
      onFailure: (cause3) => {
        const state = this.handleSubexecutorFailure(childExecutor, parentSubexecutor, cause3);
        return state === void 0 ? void 0 : effectOrUndefinedIgnored(state);
      },
      onSuccess: (doneValue) => {
        this.finishWithDoneValue(childExecutor, parentSubexecutor, doneValue);
        return void 0;
      }
    }));
  }
  finishWithDoneValue(childExecutor, parentSubexecutor, doneValue) {
    const subexecutor = parentSubexecutor;
    switch (subexecutor._tag) {
      case OP_PULL_FROM_UPSTREAM: {
        const modifiedParent = new PullFromUpstream(subexecutor.upstreamExecutor, subexecutor.createChild, subexecutor.lastDone !== void 0 ? subexecutor.combineChildResults(subexecutor.lastDone, doneValue) : doneValue, subexecutor.activeChildExecutors, subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull, subexecutor.onEmit);
        this._closeLastSubstream = childExecutor.close(succeed3(doneValue));
        this.replaceSubexecutor(modifiedParent);
        break;
      }
      case OP_DRAIN_CHILD_EXECUTORS: {
        const modifiedParent = new DrainChildExecutors(subexecutor.upstreamExecutor, subexecutor.lastDone !== void 0 ? subexecutor.combineChildResults(subexecutor.lastDone, doneValue) : doneValue, subexecutor.activeChildExecutors, subexecutor.upstreamDone, subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull);
        this._closeLastSubstream = childExecutor.close(succeed3(doneValue));
        this.replaceSubexecutor(modifiedParent);
        break;
      }
    }
  }
  handleSubexecutorFailure(childExecutor, parentSubexecutor, cause3) {
    return this.finishSubexecutorWithCloseEffect(failCause3(cause3), (exit4) => parentSubexecutor.close(exit4), (exit4) => childExecutor.close(exit4));
  }
  pullFromUpstream(subexecutor) {
    if (subexecutor.activeChildExecutors.length === 0) {
      return this.performPullFromUpstream(subexecutor);
    }
    const activeChild = subexecutor.activeChildExecutors[0];
    const parentSubexecutor = new PullFromUpstream(subexecutor.upstreamExecutor, subexecutor.createChild, subexecutor.lastDone, subexecutor.activeChildExecutors.slice(1), subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull, subexecutor.onEmit);
    if (activeChild === void 0) {
      return this.performPullFromUpstream(parentSubexecutor);
    }
    this.replaceSubexecutor(new PullFromChild(activeChild.childExecutor, parentSubexecutor, activeChild.onEmit));
    return void 0;
  }
  performPullFromUpstream(subexecutor) {
    return Read(subexecutor.upstreamExecutor, (effect3) => {
      const closeLastSubstream = this._closeLastSubstream === void 0 ? _void : this._closeLastSubstream;
      this._closeLastSubstream = void 0;
      return pipe(this._executeCloseLastSubstream(closeLastSubstream), zipRight6(effect3));
    }, (emitted) => {
      if (this._closeLastSubstream !== void 0) {
        const closeLastSubstream = this._closeLastSubstream;
        this._closeLastSubstream = void 0;
        return pipe(this._executeCloseLastSubstream(closeLastSubstream), map18(() => {
          const childExecutor2 = new _ChannelExecutor(subexecutor.createChild(emitted), this._providedEnv, this._executeCloseLastSubstream);
          childExecutor2._input = this._input;
          const [emitSeparator2, updatedChildExecutors2] = this.applyUpstreamPullStrategy(false, subexecutor.activeChildExecutors, subexecutor.onPull(Pulled(emitted)));
          this._activeSubexecutor = new PullFromChild(childExecutor2, new PullFromUpstream(subexecutor.upstreamExecutor, subexecutor.createChild, subexecutor.lastDone, updatedChildExecutors2, subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull, subexecutor.onEmit), subexecutor.onEmit);
          if (isSome2(emitSeparator2)) {
            this._activeSubexecutor = new Emit2(emitSeparator2.value, this._activeSubexecutor);
          }
          return void 0;
        }));
      }
      const childExecutor = new _ChannelExecutor(subexecutor.createChild(emitted), this._providedEnv, this._executeCloseLastSubstream);
      childExecutor._input = this._input;
      const [emitSeparator, updatedChildExecutors] = this.applyUpstreamPullStrategy(false, subexecutor.activeChildExecutors, subexecutor.onPull(Pulled(emitted)));
      this._activeSubexecutor = new PullFromChild(childExecutor, new PullFromUpstream(subexecutor.upstreamExecutor, subexecutor.createChild, subexecutor.lastDone, updatedChildExecutors, subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull, subexecutor.onEmit), subexecutor.onEmit);
      if (isSome2(emitSeparator)) {
        this._activeSubexecutor = new Emit2(emitSeparator.value, this._activeSubexecutor);
      }
      return void 0;
    }, (exit4) => {
      if (subexecutor.activeChildExecutors.some((subexecutor2) => subexecutor2 !== void 0)) {
        const drain4 = new DrainChildExecutors(subexecutor.upstreamExecutor, subexecutor.lastDone, [void 0, ...subexecutor.activeChildExecutors], subexecutor.upstreamExecutor.getDone(), subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull);
        if (this._closeLastSubstream !== void 0) {
          const closeLastSubstream2 = this._closeLastSubstream;
          this._closeLastSubstream = void 0;
          return pipe(this._executeCloseLastSubstream(closeLastSubstream2), map18(() => this.replaceSubexecutor(drain4)));
        }
        this.replaceSubexecutor(drain4);
        return void 0;
      }
      const closeLastSubstream = this._closeLastSubstream;
      const state = this.finishSubexecutorWithCloseEffect(pipe(exit4, map11((a) => subexecutor.combineWithChildResult(subexecutor.lastDone, a))), () => closeLastSubstream, (exit5) => subexecutor.upstreamExecutor.close(exit5));
      return state === void 0 ? void 0 : (
        // NOTE: assuming finalizers cannot fail
        effectOrUndefinedIgnored(state)
      );
    });
  }
  drainChildExecutors(subexecutor) {
    if (subexecutor.activeChildExecutors.length === 0) {
      const lastClose = this._closeLastSubstream;
      if (lastClose !== void 0) {
        this.addFinalizer(() => succeed10(lastClose));
      }
      return this.finishSubexecutorWithCloseEffect(subexecutor.upstreamDone, () => lastClose, (exit4) => subexecutor.upstreamExecutor.close(exit4));
    }
    const activeChild = subexecutor.activeChildExecutors[0];
    const rest = subexecutor.activeChildExecutors.slice(1);
    if (activeChild === void 0) {
      const [emitSeparator, remainingExecutors] = this.applyUpstreamPullStrategy(true, rest, subexecutor.onPull(NoUpstream(rest.reduce((n, curr) => curr !== void 0 ? n + 1 : n, 0))));
      this.replaceSubexecutor(new DrainChildExecutors(subexecutor.upstreamExecutor, subexecutor.lastDone, remainingExecutors, subexecutor.upstreamDone, subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull));
      if (isSome2(emitSeparator)) {
        this._emitted = emitSeparator.value;
        return Emit();
      }
      return void 0;
    }
    const parentSubexecutor = new DrainChildExecutors(subexecutor.upstreamExecutor, subexecutor.lastDone, rest, subexecutor.upstreamDone, subexecutor.combineChildResults, subexecutor.combineWithChildResult, subexecutor.onPull);
    this.replaceSubexecutor(new PullFromChild(activeChild.childExecutor, parentSubexecutor, activeChild.onEmit));
    return void 0;
  }
};
var ifNotNull = (effect3) => effect3 !== void 0 ? effect3 : _void;
var runFinalizers = (finalizers, exit4) => {
  return pipe(forEach8(finalizers, (fin) => exit3(fin(exit4))), map18((exits) => pipe(all4(exits), getOrElse(() => void_3))), flatMap12((exit5) => suspend4(() => exit5)));
};
var readUpstream = (r, onSuccess, onFailure) => {
  const readStack = [r];
  const read = () => {
    const current = readStack.pop();
    if (current === void 0 || current.upstream === void 0) {
      return dieMessage2("Unexpected end of input for channel execution");
    }
    const state = current.upstream.run();
    switch (state._tag) {
      case OP_EMIT2: {
        const emitEffect = current.onEmit(current.upstream.getEmit());
        if (readStack.length === 0) {
          if (emitEffect === void 0) {
            return suspend4(onSuccess);
          }
          return pipe(emitEffect, matchCauseEffect3({
            onFailure,
            onSuccess
          }));
        }
        if (emitEffect === void 0) {
          return suspend4(() => read());
        }
        return pipe(emitEffect, matchCauseEffect3({
          onFailure,
          onSuccess: () => read()
        }));
      }
      case OP_DONE3: {
        const doneEffect = current.onDone(current.upstream.getDone());
        if (readStack.length === 0) {
          if (doneEffect === void 0) {
            return suspend4(onSuccess);
          }
          return pipe(doneEffect, matchCauseEffect3({
            onFailure,
            onSuccess
          }));
        }
        if (doneEffect === void 0) {
          return suspend4(() => read());
        }
        return pipe(doneEffect, matchCauseEffect3({
          onFailure,
          onSuccess: () => read()
        }));
      }
      case OP_FROM_EFFECT3: {
        readStack.push(current);
        return pipe(current.onEffect(state.effect), catchAllCause3((cause3) => suspend4(() => {
          const doneEffect = current.onDone(failCause3(cause3));
          return doneEffect === void 0 ? _void : doneEffect;
        })), matchCauseEffect3({
          onFailure,
          onSuccess: () => read()
        }));
      }
      case OP_READ2: {
        readStack.push(current);
        readStack.push(state);
        return suspend4(() => read());
      }
    }
  };
  return read();
};
var runIn = /* @__PURE__ */ dual(2, (self, scope5) => {
  const run7 = (channelDeferred, scopeDeferred, scope6) => acquireUseRelease2(sync6(() => new ChannelExecutor(self, void 0, identity)), (exec2) => suspend4(() => runScopedInterpret(exec2.run(), exec2).pipe(intoDeferred2(channelDeferred), zipRight6(_await(channelDeferred)), zipLeft6(_await(scopeDeferred)))), (exec2, exit4) => {
    const finalize = exec2.close(exit4);
    if (finalize === void 0) {
      return _void;
    }
    return tapErrorCause3(finalize, (cause3) => addFinalizer2(scope6, failCause9(cause3)));
  });
  return uninterruptibleMask3((restore) => all7([fork2(scope5, sequential3), make18(), make18()]).pipe(flatMap12(([child, channelDeferred, scopeDeferred]) => restore(run7(channelDeferred, scopeDeferred, child)).pipe(forkIn2(scope5), flatMap12((fiber) => scope5.addFinalizer((exit4) => {
    const interruptors3 = isFailure2(exit4) ? interruptors2(exit4.cause) : void 0;
    return isDone(channelDeferred).pipe(flatMap12((isDone6) => isDone6 ? succeed2(scopeDeferred, void 0).pipe(zipRight6(_await3(fiber)), zipRight6(inheritAll2(fiber))) : succeed2(scopeDeferred, void 0).pipe(zipRight6(interruptors3 && size3(interruptors3) > 0 ? interruptAs(fiber, combineAll2(interruptors3)) : interrupt6(fiber)), zipRight6(inheritAll2(fiber)))));
  }).pipe(zipRight6(restore(_await(channelDeferred)))))))));
});
var runScopedInterpret = (channelState, exec2) => {
  const op = channelState;
  switch (op._tag) {
    case OP_FROM_EFFECT3: {
      return pipe(op.effect, flatMap12(() => runScopedInterpret(exec2.run(), exec2)));
    }
    case OP_EMIT2: {
      return runScopedInterpret(exec2.run(), exec2);
    }
    case OP_DONE3: {
      return suspend4(() => exec2.getDone());
    }
    case OP_READ2: {
      return readUpstream(op, () => runScopedInterpret(exec2.run(), exec2), failCause9);
    }
  }
};

// node_modules/effect/dist/esm/internal/opCodes/channelMergeDecision.js
var OP_DONE4 = "Done";
var OP_AWAIT = "Await";

// node_modules/effect/dist/esm/internal/channel/mergeDecision.js
var MergeDecisionSymbolKey = "effect/ChannelMergeDecision";
var MergeDecisionTypeId = /* @__PURE__ */ Symbol.for(MergeDecisionSymbolKey);
var proto9 = {
  [MergeDecisionTypeId]: {
    _R: (_) => _,
    _E0: (_) => _,
    _Z0: (_) => _,
    _E: (_) => _,
    _Z: (_) => _
  }
};
var Await = (f) => {
  const op = Object.create(proto9);
  op._tag = OP_AWAIT;
  op.f = f;
  return op;
};

// node_modules/effect/dist/esm/internal/opCodes/channelMergeState.js
var OP_BOTH_RUNNING = "BothRunning";
var OP_LEFT_DONE = "LeftDone";
var OP_RIGHT_DONE = "RightDone";

// node_modules/effect/dist/esm/internal/channel/mergeState.js
var MergeStateSymbolKey = "effect/ChannelMergeState";
var MergeStateTypeId = /* @__PURE__ */ Symbol.for(MergeStateSymbolKey);
var proto10 = {
  [MergeStateTypeId]: MergeStateTypeId
};
var BothRunning = (left3, right3) => {
  const op = Object.create(proto10);
  op._tag = OP_BOTH_RUNNING;
  op.left = left3;
  op.right = right3;
  return op;
};
var LeftDone = (f) => {
  const op = Object.create(proto10);
  op._tag = OP_LEFT_DONE;
  op.f = f;
  return op;
};
var RightDone = (f) => {
  const op = Object.create(proto10);
  op._tag = OP_RIGHT_DONE;
  op.f = f;
  return op;
};

// node_modules/effect/dist/esm/internal/opCodes/channelMergeStrategy.js
var OP_BACK_PRESSURE = "BackPressure";
var OP_BUFFER_SLIDING = "BufferSliding";

// node_modules/effect/dist/esm/internal/channel/mergeStrategy.js
var MergeStrategySymbolKey = "effect/ChannelMergeStrategy";
var MergeStrategyTypeId = /* @__PURE__ */ Symbol.for(MergeStrategySymbolKey);
var proto11 = {
  [MergeStrategyTypeId]: MergeStrategyTypeId
};
var BackPressure = (_) => {
  const op = Object.create(proto11);
  op._tag = OP_BACK_PRESSURE;
  return op;
};
var BufferSliding = (_) => {
  const op = Object.create(proto11);
  op._tag = OP_BUFFER_SLIDING;
  return op;
};
var match17 = /* @__PURE__ */ dual(2, (self, {
  onBackPressure,
  onBufferSliding
}) => {
  switch (self._tag) {
    case OP_BACK_PRESSURE: {
      return onBackPressure();
    }
    case OP_BUFFER_SLIDING: {
      return onBufferSliding();
    }
  }
});

// node_modules/effect/dist/esm/internal/channel/singleProducerAsyncInput.js
var OP_STATE_EMPTY = "Empty";
var OP_STATE_EMIT = "Emit";
var OP_STATE_ERROR = "Error";
var OP_STATE_DONE2 = "Done";
var stateEmpty = (notifyProducer) => ({
  _tag: OP_STATE_EMPTY,
  notifyProducer
});
var stateEmit = (notifyConsumers) => ({
  _tag: OP_STATE_EMIT,
  notifyConsumers
});
var stateError = (cause3) => ({
  _tag: OP_STATE_ERROR,
  cause: cause3
});
var stateDone = (done10) => ({
  _tag: OP_STATE_DONE2,
  done: done10
});
var SingleProducerAsyncInputImpl = class {
  ref;
  constructor(ref) {
    this.ref = ref;
  }
  awaitRead() {
    return flatten10(modify4(this.ref, (state) => state._tag === OP_STATE_EMPTY ? [_await(state.notifyProducer), state] : [_void, state]));
  }
  get close() {
    return fiberIdWith2((fiberId3) => this.error(interrupt5(fiberId3)));
  }
  done(value) {
    return flatten10(modify4(this.ref, (state) => {
      switch (state._tag) {
        case OP_STATE_EMPTY: {
          return [_await(state.notifyProducer), state];
        }
        case OP_STATE_EMIT: {
          return [forEach8(state.notifyConsumers, (deferred) => succeed2(deferred, left2(value)), {
            discard: true
          }), stateDone(value)];
        }
        case OP_STATE_ERROR: {
          return [interrupt7, state];
        }
        case OP_STATE_DONE2: {
          return [interrupt7, state];
        }
      }
    }));
  }
  emit(element) {
    return flatMap12(make18(), (deferred) => flatten10(modify4(this.ref, (state) => {
      switch (state._tag) {
        case OP_STATE_EMPTY: {
          return [_await(state.notifyProducer), state];
        }
        case OP_STATE_EMIT: {
          const notifyConsumer = state.notifyConsumers[0];
          const notifyConsumers = state.notifyConsumers.slice(1);
          if (notifyConsumer !== void 0) {
            return [succeed2(notifyConsumer, right2(element)), notifyConsumers.length === 0 ? stateEmpty(deferred) : stateEmit(notifyConsumers)];
          }
          throw new Error("Bug: Channel.SingleProducerAsyncInput.emit - Queue was empty! please report an issue at https://github.com/Effect-TS/effect/issues");
        }
        case OP_STATE_ERROR: {
          return [interrupt7, state];
        }
        case OP_STATE_DONE2: {
          return [interrupt7, state];
        }
      }
    })));
  }
  error(cause3) {
    return flatten10(modify4(this.ref, (state) => {
      switch (state._tag) {
        case OP_STATE_EMPTY: {
          return [_await(state.notifyProducer), state];
        }
        case OP_STATE_EMIT: {
          return [forEach8(state.notifyConsumers, (deferred) => failCause2(deferred, cause3), {
            discard: true
          }), stateError(cause3)];
        }
        case OP_STATE_ERROR: {
          return [interrupt7, state];
        }
        case OP_STATE_DONE2: {
          return [interrupt7, state];
        }
      }
    }));
  }
  get take() {
    return this.takeWith((cause3) => failCause3(map14(cause3, left2)), (elem) => succeed3(elem), (done10) => fail4(right2(done10)));
  }
  takeWith(onError4, onElement, onDone2) {
    return flatMap12(make18(), (deferred) => flatten10(modify4(this.ref, (state) => {
      switch (state._tag) {
        case OP_STATE_EMPTY: {
          return [zipRight6(succeed2(state.notifyProducer, void 0), matchCause4(_await(deferred), {
            onFailure: onError4,
            onSuccess: match({
              onLeft: onDone2,
              onRight: onElement
            })
          })), stateEmit([deferred])];
        }
        case OP_STATE_EMIT: {
          return [matchCause4(_await(deferred), {
            onFailure: onError4,
            onSuccess: match({
              onLeft: onDone2,
              onRight: onElement
            })
          }), stateEmit([...state.notifyConsumers, deferred])];
        }
        case OP_STATE_ERROR: {
          return [succeed10(onError4(state.cause)), state];
        }
        case OP_STATE_DONE2: {
          return [succeed10(onDone2(state.done)), state];
        }
      }
    })));
  }
};
var make44 = () => pipe(make18(), flatMap12((deferred) => make29(stateEmpty(deferred))), map18((ref) => new SingleProducerAsyncInputImpl(ref)));

// node_modules/effect/dist/esm/internal/channel.js
var concatMap = /* @__PURE__ */ dual(2, (self, f) => concatMapWith(self, f, () => void 0, () => void 0));
var drain = (self) => {
  const drainer = readWithCause({
    onInput: () => drainer,
    onFailure: failCause11,
    onDone: succeed12
  });
  return pipeTo(self, drainer);
};
var ensuring4 = /* @__PURE__ */ dual(2, (self, finalizer2) => ensuringWith(self, () => finalizer2));
var flatten12 = (self) => flatMap14(self, identity);
var fromInput = (input) => unwrap(input.takeWith(failCause11, (elem) => flatMap14(write(elem), () => fromInput(input)), succeed12));
var map20 = /* @__PURE__ */ dual(2, (self, f) => flatMap14(self, (a) => sync8(() => f(a))));
var mapOut = /* @__PURE__ */ dual(2, (self, f) => {
  const reader = readWith({
    onInput: (outElem) => flatMap14(write(f(outElem)), () => reader),
    onFailure: fail12,
    onDone: succeedNow
  });
  return pipeTo(self, reader);
});
var mapOutEffect = /* @__PURE__ */ dual(2, (self, f) => {
  const reader = readWithCause({
    onInput: (outElem) => pipe(fromEffect5(f(outElem)), flatMap14(write), flatMap14(() => reader)),
    onFailure: failCause11,
    onDone: succeedNow
  });
  return pipeTo(self, reader);
});
var mergeAll7 = (options) => {
  return (channels) => mergeAllWith(options)(channels, constVoid);
};
var mergeAllWith = ({
  bufferSize = 16,
  concurrency,
  mergeStrategy = BackPressure()
}) => (channels, f) => unwrapScopedWith((scope5) => gen3(function* () {
  const concurrencyN = concurrency === "unbounded" ? Number.MAX_SAFE_INTEGER : concurrency;
  const input = yield* make44();
  const queueReader = fromInput(input);
  const queue = yield* bounded3(bufferSize);
  yield* addFinalizer2(scope5, shutdown2(queue));
  const cancelers = yield* unbounded3();
  yield* addFinalizer2(scope5, shutdown2(cancelers));
  const lastDone = yield* make29(none2());
  const errorSignal = yield* make18();
  const withPermits = (yield* makeSemaphore2(concurrencyN)).withPermits;
  const pull = yield* toPullIn(pipeTo(queueReader, channels), scope5);
  function evaluatePull(pull2) {
    return pull2.pipe(flatMap12(match({
      onLeft: (done10) => succeed10(some2(done10)),
      onRight: (outElem) => as8(offer3(queue, succeed10(right2(outElem))), none2())
    })), repeat({
      until: (_) => isSome2(_)
    }), flatMap12((outDone) => update3(lastDone, match2({
      onNone: () => some2(outDone.value),
      onSome: (lastDone2) => some2(f(lastDone2, outDone.value))
    }))), catchAllCause3((cause3) => isInterrupted3(cause3) ? failCause9(cause3) : offer3(queue, failCause9(cause3)).pipe(zipRight6(succeed2(errorSignal, void 0)), asVoid5)));
  }
  yield* pull.pipe(matchCauseEffect3({
    onFailure: (cause3) => offer3(queue, failCause9(cause3)).pipe(zipRight6(succeed10(false))),
    onSuccess: match({
      onLeft: (outDone) => raceWith2(interruptible4(_await(errorSignal)), interruptible4(withPermits(concurrencyN)(_void)), {
        onSelfDone: (_, permitAcquisition) => as8(interrupt6(permitAcquisition), false),
        onOtherDone: (_, failureAwait) => zipRight6(interrupt6(failureAwait), get12(lastDone).pipe(flatMap12(match2({
          onNone: () => offer3(queue, succeed10(left2(outDone))),
          onSome: (lastDone2) => offer3(queue, succeed10(left2(f(lastDone2, outDone))))
        })), as8(false)))
      }),
      onRight: (channel) => match17(mergeStrategy, {
        onBackPressure: () => gen3(function* () {
          const latch = yield* make18();
          const raceEffects = scopedWith2((scope6) => toPullIn(pipeTo(queueReader, channel), scope6).pipe(flatMap12((pull2) => race2(exit3(evaluatePull(pull2)), exit3(interruptible4(_await(errorSignal))))), flatMap12(identity)));
          yield* succeed2(latch, void 0).pipe(zipRight6(raceEffects), withPermits(1), forkIn2(scope5));
          yield* _await(latch);
          const errored = yield* isDone(errorSignal);
          return !errored;
        }),
        onBufferSliding: () => gen3(function* () {
          const canceler = yield* make18();
          const latch = yield* make18();
          const size13 = yield* size12(cancelers);
          yield* take2(cancelers).pipe(flatMap12((canceler2) => succeed2(canceler2, void 0)), when2(() => size13 >= concurrencyN));
          yield* offer3(cancelers, canceler);
          const raceEffects = scopedWith2((scope6) => toPullIn(pipeTo(queueReader, channel), scope6).pipe(flatMap12((pull2) => exit3(evaluatePull(pull2)).pipe(race2(exit3(interruptible4(_await(errorSignal)))), race2(exit3(interruptible4(_await(canceler)))))), flatMap12(identity)));
          yield* succeed2(latch, void 0).pipe(zipRight6(raceEffects), withPermits(1), forkIn2(scope5));
          yield* _await(latch);
          const errored = yield* isDone(errorSignal);
          return !errored;
        })
      })
    })
  }), repeat({
    while: (_) => _
  }), forkIn2(scope5));
  const consumer = pipe(take2(queue), flatten10, matchCause4({
    onFailure: failCause11,
    onSuccess: match({
      onLeft: succeedNow,
      onRight: (outElem) => flatMap14(write(outElem), () => consumer)
    })
  }), unwrap);
  return embedInput(consumer, input);
}));
var mergeMap = /* @__PURE__ */ dual(3, (self, f, options) => mergeAll7(options)(mapOut(self, f)));
var mergeWith2 = /* @__PURE__ */ dual(2, (self, options) => {
  function merge10(scope5) {
    return gen3(function* () {
      const input = yield* make44();
      const queueReader = fromInput(input);
      const pullL = yield* toPullIn(pipeTo(queueReader, self), scope5);
      const pullR = yield* toPullIn(pipeTo(queueReader, options.other), scope5);
      function handleSide(exit4, fiber, pull) {
        return (done10, both2, single2) => {
          function onDecision3(decision) {
            const op = decision;
            if (op._tag === OP_DONE4) {
              return succeed10(fromEffect5(zipRight6(interrupt6(fiber), op.effect)));
            }
            return map18(_await3(fiber), match6({
              onFailure: (cause3) => fromEffect5(op.f(failCause3(cause3))),
              onSuccess: match({
                onLeft: (done11) => fromEffect5(op.f(succeed3(done11))),
                onRight: (elem) => zipRight7(write(elem), go2(single2(op.f)))
              })
            }));
          }
          return match6(exit4, {
            onFailure: (cause3) => onDecision3(done10(failCause3(cause3))),
            onSuccess: match({
              onLeft: (z) => onDecision3(done10(succeed3(z))),
              onRight: (elem) => succeed10(flatMap14(write(elem), () => flatMap14(fromEffect5(forkIn2(interruptible4(pull), scope5)), (leftFiber) => go2(both2(leftFiber, fiber)))))
            })
          });
        };
      }
      function go2(state) {
        switch (state._tag) {
          case OP_BOTH_RUNNING: {
            const leftJoin = interruptible4(join3(state.left));
            const rightJoin = interruptible4(join3(state.right));
            return unwrap(raceWith2(leftJoin, rightJoin, {
              onSelfDone: (leftExit, rf) => zipRight6(interrupt6(rf), handleSide(leftExit, state.right, pullL)(options.onSelfDone, BothRunning, (f) => LeftDone(f))),
              onOtherDone: (rightExit, lf) => zipRight6(interrupt6(lf), handleSide(rightExit, state.left, pullR)(options.onOtherDone, (left3, right3) => BothRunning(right3, left3), (f) => RightDone(f)))
            }));
          }
          case OP_LEFT_DONE: {
            return unwrap(map18(exit3(pullR), match6({
              onFailure: (cause3) => fromEffect5(state.f(failCause3(cause3))),
              onSuccess: match({
                onLeft: (done10) => fromEffect5(state.f(succeed3(done10))),
                onRight: (elem) => flatMap14(write(elem), () => go2(LeftDone(state.f)))
              })
            })));
          }
          case OP_RIGHT_DONE: {
            return unwrap(map18(exit3(pullL), match6({
              onFailure: (cause3) => fromEffect5(state.f(failCause3(cause3))),
              onSuccess: match({
                onLeft: (done10) => fromEffect5(state.f(succeed3(done10))),
                onRight: (elem) => flatMap14(write(elem), () => go2(RightDone(state.f)))
              })
            })));
          }
        }
      }
      return fromEffect5(withFiberRuntime2((parent) => {
        const inherit = withFiberRuntime2((state) => {
          state.transferChildren(parent.scope());
          return _void;
        });
        const leftFiber = interruptible4(pullL).pipe(ensuring3(inherit), forkIn2(scope5));
        const rightFiber = interruptible4(pullR).pipe(ensuring3(inherit), forkIn2(scope5));
        return zipWith8(leftFiber, rightFiber, (left3, right3) => BothRunning(left3, right3));
      })).pipe(flatMap14(go2), embedInput(input));
    });
  }
  return unwrapScopedWith(merge10);
});
var runScoped = (self) => scopeWith2((scope5) => runIn(self, scope5));
var scoped5 = (effect3) => unwrap(uninterruptibleMask3((restore) => map18(make40(), (scope5) => acquireReleaseOut(tapErrorCause3(restore(extend2(effect3, scope5)), (cause3) => close(scope5, failCause3(cause3))), (_, exit4) => close(scope5, exit4)))));
var scopedWith3 = (f) => unwrapScoped3(map18(scope3, (scope5) => flatMap14(fromEffect5(f(scope5)), write)));
var toPullIn = /* @__PURE__ */ dual(2, (self, scope5) => zip6(sync6(() => new ChannelExecutor(self, void 0, identity)), runtime3()).pipe(tap4(([executor, runtime4]) => addFinalizerExit(scope5, (exit4) => {
  const finalizer2 = executor.close(exit4);
  return finalizer2 !== void 0 ? provide2(finalizer2, runtime4) : _void;
})), uninterruptible2, map18(([executor]) => suspend4(() => interpretToPull(executor.run(), executor)))));
var interpretToPull = (channelState, exec2) => {
  const state = channelState;
  switch (state._tag) {
    case OP_DONE3: {
      return match6(exec2.getDone(), {
        onFailure: failCause9,
        onSuccess: (done10) => succeed10(left2(done10))
      });
    }
    case OP_EMIT2: {
      return succeed10(right2(exec2.getEmit()));
    }
    case OP_FROM_EFFECT3: {
      return pipe(state.effect, flatMap12(() => interpretToPull(exec2.run(), exec2)));
    }
    case OP_READ2: {
      return readUpstream(state, () => interpretToPull(exec2.run(), exec2), (cause3) => failCause9(cause3));
    }
  }
};
var unwrap = (channel) => flatten12(fromEffect5(channel));
var unwrapScoped3 = (self) => concatAllWith(scoped5(self), (d, _) => d, (d, _) => d);
var unwrapScopedWith = (f) => concatAllWith(scopedWith3(f), (d, _) => d, (d, _) => d);
var writeChunk = (outs) => writeChunkWriter(0, outs.length, outs);
var writeChunkWriter = (idx, len, chunk3) => {
  return idx === len ? void_7 : pipe(write(pipe(chunk3, unsafeGet4(idx))), flatMap14(() => writeChunkWriter(idx + 1, len, chunk3)));
};
var zip7 = /* @__PURE__ */ dual((args2) => isChannel(args2[1]), (self, that, options) => options?.concurrent ? mergeWith2(self, {
  other: that,
  onSelfDone: (exit1) => Await((exit22) => suspend4(() => zip3(exit1, exit22))),
  onOtherDone: (exit22) => Await((exit1) => suspend4(() => zip3(exit1, exit22)))
}) : flatMap14(self, (a) => map20(that, (b) => [a, b])));
var zipRight7 = /* @__PURE__ */ dual((args2) => isChannel(args2[1]), (self, that, options) => options?.concurrent ? map20(zip7(self, that, {
  concurrent: true
}), (tuple3) => tuple3[1]) : flatMap14(self, () => that));

// node_modules/effect/dist/esm/internal/sink.js
var SinkTypeId2 = /* @__PURE__ */ Symbol.for("effect/Sink");
var sinkVariance2 = {
  /* c8 ignore next */
  _A: (_) => _,
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _L: (_) => _,
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _R: (_) => _
};
var SinkImpl = class {
  channel;
  [SinkTypeId2] = sinkVariance2;
  constructor(channel) {
    this.channel = channel;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var fail13 = (e) => new SinkImpl(fail12(e));
var forEach9 = (f) => {
  const process2 = readWithCause({
    onInput: (input) => pipe(fromEffect5(forEach8(input, (v) => f(v), {
      discard: true
    })), flatMap14(() => process2)),
    onFailure: failCause11,
    onDone: () => void_7
  });
  return new SinkImpl(process2);
};
var fromEffect7 = (effect3) => new SinkImpl(fromEffect5(effect3));
var toChannel = (self) => isEffect2(self) ? toChannel(fromEffect7(self)) : self.channel;
var unwrapScoped4 = (effect3) => new SinkImpl(unwrapScoped3(effect3.pipe(map18((sink) => toChannel(sink)))));

// node_modules/effect/dist/esm/Runtime.js
var Runtime_exports = {};
__export(Runtime_exports, {
  FiberFailureCauseId: () => FiberFailureCauseId2,
  FiberFailureId: () => FiberFailureId2,
  defaultRuntime: () => defaultRuntime2,
  defaultRuntimeFlags: () => defaultRuntimeFlags2,
  deleteFiberRef: () => deleteFiberRef2,
  disableRuntimeFlag: () => disableRuntimeFlag2,
  enableRuntimeFlag: () => enableRuntimeFlag2,
  isAsyncFiberException: () => isAsyncFiberException2,
  isFiberFailure: () => isFiberFailure2,
  make: () => make45,
  makeFiberFailure: () => makeFiberFailure,
  provideService: () => provideService5,
  runCallback: () => runCallback2,
  runFork: () => runFork3,
  runPromise: () => runPromise2,
  runPromiseExit: () => runPromiseExit2,
  runSync: () => runSync2,
  runSyncExit: () => runSyncExit2,
  setFiberRef: () => setFiberRef2,
  updateContext: () => updateContext3,
  updateFiberRefs: () => updateFiberRefs4,
  updateRuntimeFlags: () => updateRuntimeFlags3
});
var runFork3 = unsafeFork3;
var runSyncExit2 = unsafeRunSyncExit;
var runSync2 = unsafeRunSync;
var runCallback2 = unsafeRunCallback;
var runPromise2 = unsafeRunPromise;
var runPromiseExit2 = unsafeRunPromiseExit;
var defaultRuntime2 = defaultRuntime;
var defaultRuntimeFlags2 = defaultRuntimeFlags;
var make45 = make41;
var FiberFailureId2 = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure");
var FiberFailureCauseId2 = FiberFailureCauseId;
var isAsyncFiberException2 = isAsyncFiberException;
var isFiberFailure2 = isFiberFailure;
var makeFiberFailure = fiberFailure;
var updateRuntimeFlags3 = updateRuntimeFlags2;
var enableRuntimeFlag2 = enableRuntimeFlag;
var disableRuntimeFlag2 = disableRuntimeFlag;
var updateContext3 = updateContext2;
var provideService5 = provideService2;
var updateFiberRefs4 = updateFiberRefs2;
var setFiberRef2 = setFiberRef;
var deleteFiberRef2 = deleteFiberRef;

// node_modules/effect/dist/esm/Schedule.js
var Schedule_exports = {};
__export(Schedule_exports, {
  CurrentIterationMetadata: () => CurrentIterationMetadata2,
  ScheduleDriverTypeId: () => ScheduleDriverTypeId2,
  ScheduleTypeId: () => ScheduleTypeId2,
  addDelay: () => addDelay2,
  addDelayEffect: () => addDelayEffect2,
  andThen: () => andThen8,
  andThenEither: () => andThenEither2,
  as: () => as10,
  asVoid: () => asVoid6,
  bothInOut: () => bothInOut2,
  check: () => check2,
  checkEffect: () => checkEffect2,
  collectAllInputs: () => collectAllInputs2,
  collectAllOutputs: () => collectAllOutputs2,
  collectUntil: () => collectUntil2,
  collectUntilEffect: () => collectUntilEffect2,
  collectWhile: () => collectWhile2,
  collectWhileEffect: () => collectWhileEffect2,
  compose: () => compose2,
  count: () => count2,
  cron: () => cron2,
  dayOfMonth: () => dayOfMonth2,
  dayOfWeek: () => dayOfWeek2,
  delayed: () => delayed2,
  delayedEffect: () => delayedEffect2,
  delayedSchedule: () => delayedSchedule2,
  delays: () => delays2,
  driver: () => driver2,
  duration: () => duration2,
  either: () => either5,
  eitherWith: () => eitherWith2,
  elapsed: () => elapsed2,
  ensuring: () => ensuring5,
  exponential: () => exponential3,
  fibonacci: () => fibonacci2,
  fixed: () => fixed4,
  forever: () => forever4,
  fromDelay: () => fromDelay2,
  fromDelays: () => fromDelays2,
  fromFunction: () => fromFunction4,
  hourOfDay: () => hourOfDay2,
  identity: () => identity3,
  intersect: () => intersect6,
  intersectWith: () => intersectWith2,
  isSchedule: () => isSchedule2,
  jittered: () => jittered2,
  jitteredWith: () => jitteredWith2,
  linear: () => linear2,
  makeWithState: () => makeWithState2,
  map: () => map21,
  mapBoth: () => mapBoth5,
  mapBothEffect: () => mapBothEffect2,
  mapEffect: () => mapEffect5,
  mapInput: () => mapInput4,
  mapInputContext: () => mapInputContext4,
  mapInputEffect: () => mapInputEffect2,
  minuteOfHour: () => minuteOfHour2,
  modifyDelay: () => modifyDelay2,
  modifyDelayEffect: () => modifyDelayEffect2,
  onDecision: () => onDecision2,
  once: () => once4,
  passthrough: () => passthrough4,
  provideContext: () => provideContext5,
  provideService: () => provideService6,
  recurUntil: () => recurUntil2,
  recurUntilEffect: () => recurUntilEffect2,
  recurUntilOption: () => recurUntilOption2,
  recurUpTo: () => recurUpTo2,
  recurWhile: () => recurWhile2,
  recurWhileEffect: () => recurWhileEffect2,
  recurs: () => recurs2,
  reduce: () => reduce14,
  reduceEffect: () => reduceEffect4,
  repeatForever: () => repeatForever,
  repetitions: () => repetitions2,
  resetAfter: () => resetAfter2,
  resetWhen: () => resetWhen2,
  run: () => run2,
  secondOfMinute: () => secondOfMinute2,
  spaced: () => spaced2,
  stop: () => stop2,
  succeed: () => succeed13,
  sync: () => sync9,
  tapInput: () => tapInput2,
  tapOutput: () => tapOutput2,
  unfold: () => unfold3,
  union: () => union9,
  unionWith: () => unionWith3,
  untilInput: () => untilInput2,
  untilInputEffect: () => untilInputEffect2,
  untilOutput: () => untilOutput2,
  untilOutputEffect: () => untilOutputEffect2,
  upTo: () => upTo2,
  whileInput: () => whileInput2,
  whileInputEffect: () => whileInputEffect2,
  whileOutput: () => whileOutput2,
  whileOutputEffect: () => whileOutputEffect2,
  windowed: () => windowed2,
  zipLeft: () => zipLeft8,
  zipRight: () => zipRight8,
  zipWith: () => zipWith10
});
var ScheduleTypeId2 = ScheduleTypeId;
var ScheduleDriverTypeId2 = ScheduleDriverTypeId;
var makeWithState2 = makeWithState;
var isSchedule2 = isSchedule;
var addDelay2 = addDelay;
var addDelayEffect2 = addDelayEffect;
var andThen8 = andThen6;
var andThenEither2 = andThenEither;
var as10 = as7;
var asVoid6 = asVoid4;
var bothInOut2 = bothInOut;
var check2 = check;
var checkEffect2 = checkEffect;
var collectAllInputs2 = collectAllInputs;
var collectAllOutputs2 = collectAllOutputs;
var collectUntil2 = collectUntil;
var collectUntilEffect2 = collectUntilEffect;
var collectWhile2 = collectWhile;
var collectWhileEffect2 = collectWhileEffect;
var compose2 = compose;
var mapInput4 = mapInput3;
var mapInputEffect2 = mapInputEffect;
var mapInputContext4 = mapInputContext2;
var count2 = count;
var cron2 = cron;
var secondOfMinute2 = secondOfMinute;
var minuteOfHour2 = minuteOfHour;
var hourOfDay2 = hourOfDay;
var dayOfMonth2 = dayOfMonth;
var dayOfWeek2 = dayOfWeek;
var delayed2 = delayed;
var delayedEffect2 = delayedEffect;
var delayedSchedule2 = delayedSchedule;
var delays2 = delays;
var mapBoth5 = mapBoth3;
var mapBothEffect2 = mapBothEffect;
var driver2 = driver;
var duration2 = duration;
var either5 = either3;
var eitherWith2 = eitherWith;
var elapsed2 = elapsed;
var ensuring5 = ensuring2;
var exponential3 = exponential2;
var fibonacci2 = fibonacci;
var fixed4 = fixed3;
var forever4 = forever2;
var fromDelay2 = fromDelay;
var fromDelays2 = fromDelays;
var fromFunction4 = fromFunction2;
var identity3 = identity2;
var passthrough4 = passthrough2;
var intersect6 = intersect5;
var intersectWith2 = intersectWith;
var jittered2 = jittered;
var jitteredWith2 = jitteredWith;
var linear2 = linear;
var map21 = map17;
var mapEffect5 = mapEffect3;
var modifyDelay2 = modifyDelay;
var modifyDelayEffect2 = modifyDelayEffect;
var onDecision2 = onDecision;
var once4 = once2;
var provideContext5 = provideContext3;
var provideService6 = provideService3;
var recurUntil2 = recurUntil;
var recurUntilEffect2 = recurUntilEffect;
var recurUntilOption2 = recurUntilOption;
var recurUpTo2 = recurUpTo;
var recurWhile2 = recurWhile;
var recurWhileEffect2 = recurWhileEffect;
var recurs2 = recurs;
var reduce14 = reduce12;
var reduceEffect4 = reduceEffect2;
var repeatForever = forever2;
var repetitions2 = repetitions;
var resetAfter2 = resetAfter;
var resetWhen2 = resetWhen;
var run2 = run;
var spaced2 = spaced;
var stop2 = stop;
var succeed13 = succeed8;
var sync9 = sync5;
var tapInput2 = tapInput;
var tapOutput2 = tapOutput;
var unfold3 = unfold2;
var union9 = union8;
var unionWith3 = unionWith2;
var untilInput2 = untilInput;
var untilInputEffect2 = untilInputEffect;
var untilOutput2 = untilOutput;
var untilOutputEffect2 = untilOutputEffect;
var upTo2 = upTo;
var whileInput2 = whileInput;
var whileInputEffect2 = whileInputEffect;
var whileOutput2 = whileOutput;
var whileOutputEffect2 = whileOutputEffect;
var windowed2 = windowed;
var zipLeft8 = zipLeft5;
var zipRight8 = zipRight5;
var zipWith10 = zipWith7;
var CurrentIterationMetadata2 = CurrentIterationMetadata;

// node_modules/effect/dist/esm/internal/take.js
var TakeSymbolKey = "effect/Take";
var TakeTypeId = /* @__PURE__ */ Symbol.for(TakeSymbolKey);
var takeVariance = {
  /* c8 ignore next */
  _A: (_) => _,
  /* c8 ignore next */
  _E: (_) => _
};
var TakeImpl = class {
  exit;
  [TakeTypeId] = takeVariance;
  constructor(exit4) {
    this.exit = exit4;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var chunk2 = (chunk3) => new TakeImpl(succeed3(chunk3));
var end3 = /* @__PURE__ */ new TakeImpl(/* @__PURE__ */ fail4(/* @__PURE__ */ none2()));
var failCause12 = (cause3) => new TakeImpl(failCause3(pipe(cause3, map14(some2))));
var match18 = /* @__PURE__ */ dual(2, (self, {
  onEnd: onEnd2,
  onFailure,
  onSuccess
}) => match6(self.exit, {
  onFailure: (cause3) => match2(flipCauseOption2(cause3), {
    onNone: onEnd2,
    onSome: onFailure
  }),
  onSuccess
}));

// node_modules/effect/dist/esm/internal/stream.js
var StreamSymbolKey = "effect/Stream";
var StreamTypeId2 = /* @__PURE__ */ Symbol.for(StreamSymbolKey);
var streamVariance = {
  _R: (_) => _,
  _E: (_) => _,
  _A: (_) => _
};
var StreamImpl = class {
  channel;
  [StreamTypeId2] = streamVariance;
  constructor(channel) {
    this.channel = channel;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isStream = (u) => hasProperty(u, StreamTypeId2) || isEffect2(u);
var bufferChunks = /* @__PURE__ */ dual(2, (self, options) => {
  if (options.strategy === "dropping") {
    return bufferChunksDropping(self, options.capacity);
  } else if (options.strategy === "sliding") {
    return bufferChunksSliding(self, options.capacity);
  }
  const queue = toQueue(self, options);
  return new StreamImpl(unwrapScoped3(map18(queue, (queue2) => {
    const process2 = pipe(fromEffect5(take2(queue2)), flatMap14(match18({
      onEnd: () => void_7,
      onFailure: failCause11,
      onSuccess: (value) => pipe(write(value), flatMap14(() => process2))
    })));
    return process2;
  })));
});
var bufferChunksDropping = /* @__PURE__ */ dual(2, (self, capacity3) => {
  const queue = acquireRelease2(dropping2(capacity3), (queue2) => shutdown2(queue2));
  return new StreamImpl(bufferSignal(queue, toChannel2(self)));
});
var bufferChunksSliding = /* @__PURE__ */ dual(2, (self, capacity3) => {
  const queue = acquireRelease2(sliding2(capacity3), (queue2) => shutdown2(queue2));
  return new StreamImpl(bufferSignal(queue, toChannel2(self)));
});
var bufferSignal = (scoped7, bufferChannel) => {
  const producer = (queue, ref) => {
    const terminate = (take6) => pipe(get12(ref), tap4(_await), zipRight6(make18()), flatMap12((deferred) => pipe(offer3(queue, [take6, deferred]), zipRight6(set6(ref, deferred)), zipRight6(_await(deferred)))), asVoid5, fromEffect5);
    return readWithCause({
      onInput: (input) => pipe(make18(), flatMap12((deferred) => pipe(offer3(queue, [chunk2(input), deferred]), flatMap12((added) => pipe(set6(ref, deferred), when2(() => added))))), asVoid5, fromEffect5, flatMap14(() => producer(queue, ref))),
      onFailure: (error) => terminate(failCause12(error)),
      onDone: () => terminate(end3)
    });
  };
  const consumer = (queue) => {
    const process2 = pipe(fromEffect5(take2(queue)), flatMap14(([take6, deferred]) => zipRight7(fromEffect5(succeed2(deferred, void 0)), match18(take6, {
      onEnd: () => void_7,
      onFailure: failCause11,
      onSuccess: (value) => pipe(write(value), flatMap14(() => process2))
    }))));
    return process2;
  };
  return unwrapScoped3(pipe(scoped7, flatMap12((queue) => pipe(make18(), tap4((start3) => succeed2(start3, void 0)), flatMap12((start3) => pipe(make29(start3), flatMap12((ref) => pipe(bufferChannel, pipeTo(producer(queue, ref)), runScoped, forkScoped2)), as8(consumer(queue))))))));
};
var fail14 = (error) => fromEffectOption(fail10(some2(error)));
var flatMap16 = /* @__PURE__ */ dual((args2) => isStream(args2[0]), (self, f, options) => {
  const bufferSize = options?.bufferSize ?? 16;
  if (options?.switch) {
    return matchConcurrency(options?.concurrency, () => flatMapParSwitchBuffer(self, 1, bufferSize, f), (n) => flatMapParSwitchBuffer(self, n, bufferSize, f));
  }
  return matchConcurrency(options?.concurrency, () => new StreamImpl(concatMap(toChannel2(self), (as13) => pipe(as13, map4((a) => toChannel2(f(a))), reduce2(void_7, (left3, right3) => pipe(left3, zipRight7(right3)))))), (_) => new StreamImpl(pipe(toChannel2(self), concatMap(writeChunk), mergeMap((out) => toChannel2(f(out)), options))));
});
var matchConcurrency = (concurrency, sequential5, bounded4) => {
  switch (concurrency) {
    case void 0:
      return sequential5();
    case "unbounded":
      return bounded4(Number.MAX_SAFE_INTEGER);
    default:
      return concurrency > 1 ? bounded4(concurrency) : sequential5();
  }
};
var flatMapParSwitchBuffer = /* @__PURE__ */ dual(4, (self, n, bufferSize, f) => new StreamImpl(pipe(toChannel2(self), concatMap(writeChunk), mergeMap((out) => toChannel2(f(out)), {
  concurrency: n,
  mergeStrategy: BufferSliding(),
  bufferSize
}))));
var flatten14 = /* @__PURE__ */ dual((args2) => isStream(args2[0]), (self, options) => flatMap16(self, identity, options));
var fromChannel = (channel) => new StreamImpl(channel);
var toChannel2 = (stream2) => {
  if ("channel" in stream2) {
    return stream2.channel;
  } else if (isEffect2(stream2)) {
    return toChannel2(fromEffect8(stream2));
  } else {
    throw new TypeError(`Expected a Stream.`);
  }
};
var fromEffect8 = (effect3) => pipe(effect3, mapError4(some2), fromEffectOption);
var fromEffectOption = (effect3) => new StreamImpl(unwrap(match15(effect3, {
  onFailure: match2({
    onNone: () => void_7,
    onSome: fail12
  }),
  onSuccess: (a) => write(of2(a))
})));
var runIntoQueueScoped = /* @__PURE__ */ dual(2, (self, queue) => {
  const writer = readWithCause({
    onInput: (input) => flatMap14(write(chunk2(input)), () => writer),
    onFailure: (cause3) => write(failCause12(cause3)),
    onDone: () => write(end3)
  });
  return pipe(pipeTo(toChannel2(self), writer), mapOutEffect((take6) => offer3(queue, take6)), drain, runScoped, asVoid5);
});
var scoped6 = (effect3) => new StreamImpl(ensuring4(scoped5(pipe(effect3, map18(of2))), _void));
var toQueue = /* @__PURE__ */ dual((args2) => isStream(args2[0]), (self, options) => tap4(acquireRelease2(options?.strategy === "unbounded" ? unbounded3() : options?.strategy === "dropping" ? dropping2(options.capacity ?? 2) : options?.strategy === "sliding" ? sliding2(options.capacity ?? 2) : bounded3(options?.capacity ?? 2), (queue) => shutdown2(queue)), (queue) => forkScoped2(runIntoQueueScoped(self, queue))));
var unwrapScoped5 = (effect3) => flatten14(scoped6(effect3));

// node_modules/effect/dist/esm/Channel.js
var flatMap17 = flatMap14;
var void_8 = void_7;
var write2 = write;

// node_modules/effect/dist/esm/ParseResult.js
var Pointer = class {
  path;
  actual;
  issue;
  /**
   * @since 3.10.0
   */
  _tag = "Pointer";
  constructor(path3, actual, issue) {
    this.path = path3;
    this.actual = actual;
    this.issue = issue;
  }
};
var Unexpected = class {
  actual;
  message;
  /**
   * @since 3.10.0
   */
  _tag = "Unexpected";
  constructor(actual, message) {
    this.actual = actual;
    this.message = message;
  }
};
var Missing = class {
  ast;
  message;
  /**
   * @since 3.10.0
   */
  _tag = "Missing";
  /**
   * @since 3.10.0
   */
  actual = void 0;
  constructor(ast, message) {
    this.ast = ast;
    this.message = message;
  }
};
var Composite2 = class {
  ast;
  actual;
  issues;
  output;
  /**
   * @since 3.10.0
   */
  _tag = "Composite";
  constructor(ast, actual, issues, output) {
    this.ast = ast;
    this.actual = actual;
    this.issues = issues;
    this.output = output;
  }
};
var Refinement2 = class {
  ast;
  actual;
  kind;
  issue;
  /**
   * @since 3.10.0
   */
  _tag = "Refinement";
  constructor(ast, actual, kind, issue) {
    this.ast = ast;
    this.actual = actual;
    this.kind = kind;
    this.issue = issue;
  }
};
var Transformation2 = class {
  ast;
  actual;
  kind;
  issue;
  /**
   * @since 3.10.0
   */
  _tag = "Transformation";
  constructor(ast, actual, kind, issue) {
    this.ast = ast;
    this.actual = actual;
    this.kind = kind;
    this.issue = issue;
  }
};
var Type2 = class {
  ast;
  actual;
  message;
  /**
   * @since 3.10.0
   */
  _tag = "Type";
  constructor(ast, actual, message) {
    this.ast = ast;
    this.actual = actual;
    this.message = message;
  }
};
var Forbidden = class {
  ast;
  actual;
  message;
  /**
   * @since 3.10.0
   */
  _tag = "Forbidden";
  constructor(ast, actual, message) {
    this.ast = ast;
    this.actual = actual;
    this.message = message;
  }
};
var ParseErrorTypeId2 = /* @__PURE__ */ Symbol.for("effect/Schema/ParseErrorTypeId");
var ParseError2 = class extends (/* @__PURE__ */ TaggedError("ParseError")) {
  /**
   * @since 3.10.0
   */
  [ParseErrorTypeId2] = ParseErrorTypeId2;
  get message() {
    return this.toString();
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return TreeFormatter.formatIssueSync(this.issue);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _id: "ParseError",
      message: this.toString()
    };
  }
  /**
   * @since 3.10.0
   */
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var parseError = (issue) => new ParseError2({
  issue
});
var succeed14 = right2;
var fail15 = left2;
var isEither3 = isEither2;
var flatMap18 = /* @__PURE__ */ dual(2, (self, f) => {
  return isEither3(self) ? match(self, {
    onLeft: left2,
    onRight: f
  }) : flatMap12(self, f);
});
var map22 = /* @__PURE__ */ dual(2, (self, f) => {
  return isEither3(self) ? map(self, f) : map18(self, f);
});
var mapError7 = /* @__PURE__ */ dual(2, (self, f) => {
  return isEither3(self) ? mapLeft(self, f) : mapError4(self, f);
});
var orElse9 = /* @__PURE__ */ dual(2, (self, f) => {
  return isEither3(self) ? match(self, {
    onLeft: f,
    onRight: right2
  }) : catchAll3(self, f);
});
var mergeInternalOptions = (options, overrideOptions) => {
  if (overrideOptions === void 0 || isNumber(overrideOptions)) {
    return options;
  }
  if (options === void 0) {
    return overrideOptions;
  }
  return {
    ...options,
    ...overrideOptions
  };
};
var getEither = (ast, isDecoding, options) => {
  const parser = goMemo(ast, isDecoding);
  return (u, overrideOptions) => parser(u, mergeInternalOptions(options, overrideOptions));
};
var getSync = (ast, isDecoding, options) => {
  const parser = getEither(ast, isDecoding, options);
  return (input, overrideOptions) => getOrThrowWith(parser(input, overrideOptions), parseError);
};
var getEffect = (ast, isDecoding, options) => {
  const parser = goMemo(ast, isDecoding);
  return (input, overrideOptions) => parser(input, {
    ...mergeInternalOptions(options, overrideOptions),
    isEffectAllowed: true
  });
};
var encodeUnknown = (schema, options) => getEffect(schema.ast, false, options);
var validateSync = (schema, options) => getSync(typeAST(schema.ast), true, options);
var is = (schema, options) => {
  const parser = goMemo(typeAST(schema.ast), true);
  return (u, overrideOptions) => isRight2(parser(u, {
    exact: true,
    ...mergeInternalOptions(options, overrideOptions)
  }));
};
var decodeMemoMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/ParseResult/decodeMemoMap"), () => /* @__PURE__ */ new WeakMap());
var encodeMemoMap = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("effect/ParseResult/encodeMemoMap"), () => /* @__PURE__ */ new WeakMap());
var goMemo = (ast, isDecoding) => {
  const memoMap = isDecoding ? decodeMemoMap : encodeMemoMap;
  const memo = memoMap.get(ast);
  if (memo) {
    return memo;
  }
  const raw = go(ast, isDecoding);
  const parseOptionsAnnotation = getParseOptionsAnnotation(ast);
  const parserWithOptions = isSome2(parseOptionsAnnotation) ? (i, options) => raw(i, mergeInternalOptions(options, parseOptionsAnnotation.value)) : raw;
  const decodingFallbackAnnotation = getDecodingFallbackAnnotation(ast);
  const parser = isDecoding && isSome2(decodingFallbackAnnotation) ? (i, options) => handleForbidden(orElse9(parserWithOptions(i, options), decodingFallbackAnnotation.value), ast, i, options) : parserWithOptions;
  memoMap.set(ast, parser);
  return parser;
};
var getConcurrency = (ast) => getOrUndefined(getConcurrencyAnnotation(ast));
var getBatching = (ast) => getOrUndefined(getBatchingAnnotation(ast));
var go = (ast, isDecoding) => {
  switch (ast._tag) {
    case "Refinement": {
      if (isDecoding) {
        const from = goMemo(ast.from, true);
        return (i, options) => {
          options = options ?? defaultParseOption;
          const allErrors = options?.errors === "all";
          const result = flatMap18(orElse9(from(i, options), (ef) => {
            const issue = new Refinement2(ast, i, "From", ef);
            if (allErrors && hasStableFilter(ast) && isComposite2(ef)) {
              return match2(ast.filter(i, options, ast), {
                onNone: () => left2(issue),
                onSome: (ep) => left2(new Composite2(ast, i, [issue, new Refinement2(ast, i, "Predicate", ep)]))
              });
            }
            return left2(issue);
          }), (a) => match2(ast.filter(a, options, ast), {
            onNone: () => right2(a),
            onSome: (ep) => left2(new Refinement2(ast, i, "Predicate", ep))
          }));
          return handleForbidden(result, ast, i, options);
        };
      } else {
        const from = goMemo(typeAST(ast), true);
        const to = goMemo(dropRightRefinement(ast.from), false);
        return (i, options) => handleForbidden(flatMap18(from(i, options), (a) => to(a, options)), ast, i, options);
      }
    }
    case "Transformation": {
      const transform3 = getFinalTransformation(ast.transformation, isDecoding);
      const from = isDecoding ? goMemo(ast.from, true) : goMemo(ast.to, false);
      const to = isDecoding ? goMemo(ast.to, true) : goMemo(ast.from, false);
      return (i, options) => handleForbidden(flatMap18(mapError7(from(i, options), (e) => new Transformation2(ast, i, isDecoding ? "Encoded" : "Type", e)), (a) => flatMap18(mapError7(transform3(a, options ?? defaultParseOption, ast, i), (e) => new Transformation2(ast, i, "Transformation", e)), (i2) => mapError7(to(i2, options), (e) => new Transformation2(ast, i, isDecoding ? "Type" : "Encoded", e)))), ast, i, options);
    }
    case "Declaration": {
      const parse2 = isDecoding ? ast.decodeUnknown(...ast.typeParameters) : ast.encodeUnknown(...ast.typeParameters);
      return (i, options) => handleForbidden(parse2(i, options ?? defaultParseOption, ast), ast, i, options);
    }
    case "Literal":
      return fromRefinement(ast, (u) => u === ast.literal);
    case "UniqueSymbol":
      return fromRefinement(ast, (u) => u === ast.symbol);
    case "UndefinedKeyword":
      return fromRefinement(ast, isUndefined);
    case "NeverKeyword":
      return fromRefinement(ast, isNever);
    case "UnknownKeyword":
    case "AnyKeyword":
    case "VoidKeyword":
      return right2;
    case "StringKeyword":
      return fromRefinement(ast, isString);
    case "NumberKeyword":
      return fromRefinement(ast, isNumber);
    case "BooleanKeyword":
      return fromRefinement(ast, isBoolean);
    case "BigIntKeyword":
      return fromRefinement(ast, isBigInt);
    case "SymbolKeyword":
      return fromRefinement(ast, isSymbol);
    case "ObjectKeyword":
      return fromRefinement(ast, isObject);
    case "Enums":
      return fromRefinement(ast, (u) => ast.enums.some(([_, value]) => value === u));
    case "TemplateLiteral": {
      const regex = getTemplateLiteralRegExp(ast);
      return fromRefinement(ast, (u) => isString(u) && regex.test(u));
    }
    case "TupleType": {
      const elements = ast.elements.map((e) => goMemo(e.type, isDecoding));
      const rest = ast.rest.map((annotatedAST) => goMemo(annotatedAST.type, isDecoding));
      let requiredTypes = ast.elements.filter((e) => !e.isOptional);
      if (ast.rest.length > 0) {
        requiredTypes = requiredTypes.concat(ast.rest.slice(1));
      }
      const requiredLen = requiredTypes.length;
      const expectedIndexes = ast.elements.length > 0 ? ast.elements.map((_, i) => i).join(" | ") : "never";
      const concurrency = getConcurrency(ast);
      const batching = getBatching(ast);
      return (input, options) => {
        if (!isArray(input)) {
          return left2(new Type2(ast, input));
        }
        const allErrors = options?.errors === "all";
        const es = [];
        let stepKey = 0;
        const output = [];
        const len = input.length;
        for (let i2 = len; i2 <= requiredLen - 1; i2++) {
          const e = new Pointer(i2, input, new Missing(requiredTypes[i2 - len]));
          if (allErrors) {
            es.push([stepKey++, e]);
            continue;
          } else {
            return left2(new Composite2(ast, input, e, output));
          }
        }
        if (ast.rest.length === 0) {
          for (let i2 = ast.elements.length; i2 <= len - 1; i2++) {
            const e = new Pointer(i2, input, new Unexpected(input[i2], `is unexpected, expected: ${expectedIndexes}`));
            if (allErrors) {
              es.push([stepKey++, e]);
              continue;
            } else {
              return left2(new Composite2(ast, input, e, output));
            }
          }
        }
        let i = 0;
        let queue = void 0;
        for (; i < elements.length; i++) {
          if (len < i + 1) {
            if (ast.elements[i].isOptional) {
              continue;
            }
          } else {
            const parser = elements[i];
            const te = parser(input[i], options);
            if (isEither3(te)) {
              if (isLeft2(te)) {
                const e = new Pointer(i, input, te.left);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return left2(new Composite2(ast, input, e, sortByIndex(output)));
                }
              }
              output.push([stepKey++, te.right]);
            } else {
              const nk = stepKey++;
              const index = i;
              if (!queue) {
                queue = [];
              }
              queue.push(({
                es: es2,
                output: output2
              }) => flatMap12(either4(te), (t) => {
                if (isLeft2(t)) {
                  const e = new Pointer(index, input, t.left);
                  if (allErrors) {
                    es2.push([nk, e]);
                    return _void;
                  } else {
                    return left2(new Composite2(ast, input, e, sortByIndex(output2)));
                  }
                }
                output2.push([nk, t.right]);
                return _void;
              }));
            }
          }
        }
        if (isNonEmptyReadonlyArray(rest)) {
          const [head6, ...tail] = rest;
          for (; i < len - tail.length; i++) {
            const te = head6(input[i], options);
            if (isEither3(te)) {
              if (isLeft2(te)) {
                const e = new Pointer(i, input, te.left);
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return left2(new Composite2(ast, input, e, sortByIndex(output)));
                }
              } else {
                output.push([stepKey++, te.right]);
              }
            } else {
              const nk = stepKey++;
              const index = i;
              if (!queue) {
                queue = [];
              }
              queue.push(({
                es: es2,
                output: output2
              }) => flatMap12(either4(te), (t) => {
                if (isLeft2(t)) {
                  const e = new Pointer(index, input, t.left);
                  if (allErrors) {
                    es2.push([nk, e]);
                    return _void;
                  } else {
                    return left2(new Composite2(ast, input, e, sortByIndex(output2)));
                  }
                } else {
                  output2.push([nk, t.right]);
                  return _void;
                }
              }));
            }
          }
          for (let j = 0; j < tail.length; j++) {
            const index = i + j;
            if (len < index + 1) {
              continue;
            } else {
              const te = tail[j](input[index], options);
              if (isEither3(te)) {
                if (isLeft2(te)) {
                  const e = new Pointer(index, input, te.left);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  } else {
                    return left2(new Composite2(ast, input, e, sortByIndex(output)));
                  }
                }
                output.push([stepKey++, te.right]);
              } else {
                const nk = stepKey++;
                if (!queue) {
                  queue = [];
                }
                queue.push(({
                  es: es2,
                  output: output2
                }) => flatMap12(either4(te), (t) => {
                  if (isLeft2(t)) {
                    const e = new Pointer(index, input, t.left);
                    if (allErrors) {
                      es2.push([nk, e]);
                      return _void;
                    } else {
                      return left2(new Composite2(ast, input, e, sortByIndex(output2)));
                    }
                  }
                  output2.push([nk, t.right]);
                  return _void;
                }));
              }
            }
          }
        }
        const computeResult = ({
          es: es2,
          output: output2
        }) => isNonEmptyArray2(es2) ? left2(new Composite2(ast, input, sortByIndex(es2), sortByIndex(output2))) : right2(sortByIndex(output2));
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend4(() => {
            const state = {
              es: copy(es),
              output: copy(output)
            };
            return flatMap12(forEach8(cqueue, (f) => f(state), {
              concurrency,
              batching,
              discard: true
            }), () => computeResult(state));
          });
        }
        return computeResult({
          output,
          es
        });
      };
    }
    case "TypeLiteral": {
      if (ast.propertySignatures.length === 0 && ast.indexSignatures.length === 0) {
        return fromRefinement(ast, isNotNullable);
      }
      const propertySignatures = [];
      const expectedKeysMap = {};
      const expectedKeys = [];
      for (const ps of ast.propertySignatures) {
        propertySignatures.push([goMemo(ps.type, isDecoding), ps]);
        expectedKeysMap[ps.name] = null;
        expectedKeys.push(ps.name);
      }
      const indexSignatures = ast.indexSignatures.map((is2) => [goMemo(is2.parameter, isDecoding), goMemo(is2.type, isDecoding), is2.parameter]);
      const expectedAST = Union.make(ast.indexSignatures.map((is2) => is2.parameter).concat(expectedKeys.map((key) => isSymbol(key) ? new UniqueSymbol(key) : new Literal(key))));
      const expected = goMemo(expectedAST, isDecoding);
      const concurrency = getConcurrency(ast);
      const batching = getBatching(ast);
      return (input, options) => {
        if (!isRecord(input)) {
          return left2(new Type2(ast, input));
        }
        const allErrors = options?.errors === "all";
        const es = [];
        let stepKey = 0;
        const onExcessPropertyError = options?.onExcessProperty === "error";
        const onExcessPropertyPreserve = options?.onExcessProperty === "preserve";
        const output = {};
        let inputKeys;
        if (onExcessPropertyError || onExcessPropertyPreserve) {
          inputKeys = Reflect.ownKeys(input);
          for (const key of inputKeys) {
            const te = expected(key, options);
            if (isEither3(te) && isLeft2(te)) {
              if (onExcessPropertyError) {
                const e = new Pointer(key, input, new Unexpected(input[key], `is unexpected, expected: ${String(expectedAST)}`));
                if (allErrors) {
                  es.push([stepKey++, e]);
                  continue;
                } else {
                  return left2(new Composite2(ast, input, e, output));
                }
              } else {
                output[key] = input[key];
              }
            }
          }
        }
        let queue = void 0;
        const isExact = options?.exact === true;
        for (let i = 0; i < propertySignatures.length; i++) {
          const ps = propertySignatures[i][1];
          const name = ps.name;
          const hasKey = Object.prototype.hasOwnProperty.call(input, name);
          if (!hasKey) {
            if (ps.isOptional) {
              continue;
            } else if (isExact) {
              const e = new Pointer(name, input, new Missing(ps));
              if (allErrors) {
                es.push([stepKey++, e]);
                continue;
              } else {
                return left2(new Composite2(ast, input, e, output));
              }
            }
          }
          const parser = propertySignatures[i][0];
          const te = parser(input[name], options);
          if (isEither3(te)) {
            if (isLeft2(te)) {
              const e = new Pointer(name, input, hasKey ? te.left : new Missing(ps));
              if (allErrors) {
                es.push([stepKey++, e]);
                continue;
              } else {
                return left2(new Composite2(ast, input, e, output));
              }
            }
            output[name] = te.right;
          } else {
            const nk = stepKey++;
            const index = name;
            if (!queue) {
              queue = [];
            }
            queue.push(({
              es: es2,
              output: output2
            }) => flatMap12(either4(te), (t) => {
              if (isLeft2(t)) {
                const e = new Pointer(index, input, hasKey ? t.left : new Missing(ps));
                if (allErrors) {
                  es2.push([nk, e]);
                  return _void;
                } else {
                  return left2(new Composite2(ast, input, e, output2));
                }
              }
              output2[index] = t.right;
              return _void;
            }));
          }
        }
        for (let i = 0; i < indexSignatures.length; i++) {
          const indexSignature = indexSignatures[i];
          const parameter = indexSignature[0];
          const type = indexSignature[1];
          const keys5 = getKeysForIndexSignature(input, indexSignature[2]);
          for (const key of keys5) {
            const keu = parameter(key, options);
            if (isEither3(keu) && isRight2(keu)) {
              const vpr = type(input[key], options);
              if (isEither3(vpr)) {
                if (isLeft2(vpr)) {
                  const e = new Pointer(key, input, vpr.left);
                  if (allErrors) {
                    es.push([stepKey++, e]);
                    continue;
                  } else {
                    return left2(new Composite2(ast, input, e, output));
                  }
                } else {
                  if (!Object.prototype.hasOwnProperty.call(expectedKeysMap, key)) {
                    output[key] = vpr.right;
                  }
                }
              } else {
                const nk = stepKey++;
                const index = key;
                if (!queue) {
                  queue = [];
                }
                queue.push(({
                  es: es2,
                  output: output2
                }) => flatMap12(either4(vpr), (tv) => {
                  if (isLeft2(tv)) {
                    const e = new Pointer(index, input, tv.left);
                    if (allErrors) {
                      es2.push([nk, e]);
                      return _void;
                    } else {
                      return left2(new Composite2(ast, input, e, output2));
                    }
                  } else {
                    if (!Object.prototype.hasOwnProperty.call(expectedKeysMap, key)) {
                      output2[key] = tv.right;
                    }
                    return _void;
                  }
                }));
              }
            }
          }
        }
        const computeResult = ({
          es: es2,
          output: output2
        }) => {
          if (isNonEmptyArray2(es2)) {
            return left2(new Composite2(ast, input, sortByIndex(es2), output2));
          }
          if (options?.propertyOrder === "original") {
            const keys5 = inputKeys || Reflect.ownKeys(input);
            for (const name of expectedKeys) {
              if (keys5.indexOf(name) === -1) {
                keys5.push(name);
              }
            }
            const out = {};
            for (const key of keys5) {
              if (Object.prototype.hasOwnProperty.call(output2, key)) {
                out[key] = output2[key];
              }
            }
            return right2(out);
          }
          return right2(output2);
        };
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend4(() => {
            const state = {
              es: copy(es),
              output: Object.assign({}, output)
            };
            return flatMap12(forEach8(cqueue, (f) => f(state), {
              concurrency,
              batching,
              discard: true
            }), () => computeResult(state));
          });
        }
        return computeResult({
          es,
          output
        });
      };
    }
    case "Union": {
      const searchTree = getSearchTree(ast.types, isDecoding);
      const ownKeys = Reflect.ownKeys(searchTree.keys);
      const ownKeysLen = ownKeys.length;
      const astTypesLen = ast.types.length;
      const map25 = /* @__PURE__ */ new Map();
      for (let i = 0; i < astTypesLen; i++) {
        map25.set(ast.types[i], goMemo(ast.types[i], isDecoding));
      }
      const concurrency = getConcurrency(ast) ?? 1;
      const batching = getBatching(ast);
      return (input, options) => {
        const es = [];
        let stepKey = 0;
        let candidates = [];
        if (ownKeysLen > 0) {
          if (isRecordOrArray(input)) {
            for (let i = 0; i < ownKeysLen; i++) {
              const name = ownKeys[i];
              const buckets = searchTree.keys[name].buckets;
              if (Object.prototype.hasOwnProperty.call(input, name)) {
                const literal = String(input[name]);
                if (Object.prototype.hasOwnProperty.call(buckets, literal)) {
                  candidates = candidates.concat(buckets[literal]);
                } else {
                  const {
                    candidates: candidates2,
                    literals
                  } = searchTree.keys[name];
                  const literalsUnion = Union.make(literals);
                  const errorAst = candidates2.length === astTypesLen ? new TypeLiteral([new PropertySignature(name, literalsUnion, false, true)], []) : Union.make(candidates2);
                  es.push([stepKey++, new Composite2(errorAst, input, new Pointer(name, input, new Type2(literalsUnion, input[name])))]);
                }
              } else {
                const {
                  candidates: candidates2,
                  literals
                } = searchTree.keys[name];
                const fakePropertySignature = new PropertySignature(name, Union.make(literals), false, true);
                const errorAst = candidates2.length === astTypesLen ? new TypeLiteral([fakePropertySignature], []) : Union.make(candidates2);
                es.push([stepKey++, new Composite2(errorAst, input, new Pointer(name, input, new Missing(fakePropertySignature)))]);
              }
            }
          } else {
            const errorAst = searchTree.candidates.length === astTypesLen ? ast : Union.make(searchTree.candidates);
            es.push([stepKey++, new Type2(errorAst, input)]);
          }
        }
        if (searchTree.otherwise.length > 0) {
          candidates = candidates.concat(searchTree.otherwise);
        }
        let queue = void 0;
        for (let i = 0; i < candidates.length; i++) {
          const candidate = candidates[i];
          const pr = map25.get(candidate)(input, options);
          if (isEither3(pr) && (!queue || queue.length === 0)) {
            if (isRight2(pr)) {
              return pr;
            } else {
              es.push([stepKey++, pr.left]);
            }
          } else {
            const nk = stepKey++;
            if (!queue) {
              queue = [];
            }
            queue.push((state) => suspend4(() => {
              if ("finalResult" in state) {
                return _void;
              } else {
                return flatMap12(either4(pr), (t) => {
                  if (isRight2(t)) {
                    state.finalResult = t;
                  } else {
                    state.es.push([nk, t.left]);
                  }
                  return _void;
                });
              }
            }));
          }
        }
        const computeResult = (es2) => isNonEmptyArray2(es2) ? es2.length === 1 && es2[0][1]._tag === "Type" ? left2(es2[0][1]) : left2(new Composite2(ast, input, sortByIndex(es2))) : (
          // this should never happen
          left2(new Type2(ast, input))
        );
        if (queue && queue.length > 0) {
          const cqueue = queue;
          return suspend4(() => {
            const state = {
              es: copy(es)
            };
            return flatMap12(forEach8(cqueue, (f) => f(state), {
              concurrency,
              batching,
              discard: true
            }), () => {
              if ("finalResult" in state) {
                return state.finalResult;
              }
              return computeResult(state.es);
            });
          });
        }
        return computeResult(es);
      };
    }
    case "Suspend": {
      const get13 = memoizeThunk(() => goMemo(ast.f(), isDecoding));
      return (a, options) => get13()(a, options);
    }
  }
};
var fromRefinement = (ast, refinement) => (u) => refinement(u) ? right2(u) : left2(new Type2(ast, u));
var getLiterals = (ast, isDecoding) => {
  switch (ast._tag) {
    case "Declaration": {
      const annotation = getSurrogateAnnotation(ast);
      if (isSome2(annotation)) {
        return getLiterals(annotation.value, isDecoding);
      }
      break;
    }
    case "TypeLiteral": {
      const out = [];
      for (let i = 0; i < ast.propertySignatures.length; i++) {
        const propertySignature2 = ast.propertySignatures[i];
        const type = isDecoding ? encodedAST(propertySignature2.type) : typeAST(propertySignature2.type);
        if (isLiteral(type) && !propertySignature2.isOptional) {
          out.push([propertySignature2.name, type]);
        }
      }
      return out;
    }
    case "TupleType": {
      const out = [];
      for (let i = 0; i < ast.elements.length; i++) {
        const element = ast.elements[i];
        const type = isDecoding ? encodedAST(element.type) : typeAST(element.type);
        if (isLiteral(type) && !element.isOptional) {
          out.push([i, type]);
        }
      }
      return out;
    }
    case "Refinement":
      return getLiterals(ast.from, isDecoding);
    case "Suspend":
      return getLiterals(ast.f(), isDecoding);
    case "Transformation":
      return getLiterals(isDecoding ? ast.from : ast.to, isDecoding);
  }
  return [];
};
var getSearchTree = (members, isDecoding) => {
  const keys5 = {};
  const otherwise = [];
  const candidates = [];
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    const tags = getLiterals(member, isDecoding);
    if (tags.length > 0) {
      candidates.push(member);
      for (let j = 0; j < tags.length; j++) {
        const [key, literal] = tags[j];
        const hash2 = String(literal.literal);
        keys5[key] = keys5[key] || {
          buckets: {},
          literals: [],
          candidates: []
        };
        const buckets = keys5[key].buckets;
        if (Object.prototype.hasOwnProperty.call(buckets, hash2)) {
          if (j < tags.length - 1) {
            continue;
          }
          buckets[hash2].push(member);
          keys5[key].literals.push(literal);
          keys5[key].candidates.push(member);
        } else {
          buckets[hash2] = [member];
          keys5[key].literals.push(literal);
          keys5[key].candidates.push(member);
          break;
        }
      }
    } else {
      otherwise.push(member);
    }
  }
  return {
    keys: keys5,
    otherwise,
    candidates
  };
};
var dropRightRefinement = (ast) => isRefinement(ast) ? dropRightRefinement(ast.from) : ast;
var handleForbidden = (effect3, ast, actual, options) => {
  if (options?.isEffectAllowed === true) {
    return effect3;
  }
  if (isEither3(effect3)) {
    return effect3;
  }
  const scheduler = new SyncScheduler();
  const fiber = runFork2(effect3, {
    scheduler
  });
  scheduler.flush();
  const exit4 = fiber.unsafePoll();
  if (exit4) {
    if (isSuccess(exit4)) {
      return right2(exit4.value);
    }
    const cause3 = exit4.cause;
    if (isFailType2(cause3)) {
      return left2(cause3.error);
    }
    return left2(new Forbidden(ast, actual, pretty3(cause3)));
  }
  return left2(new Forbidden(ast, actual, "cannot be be resolved synchronously, this is caused by using runSync on an effect that performs async work"));
};
var compare = ([a], [b]) => a > b ? 1 : a < b ? -1 : 0;
function sortByIndex(es) {
  return es.sort(compare).map((t) => t[1]);
}
var getFinalTransformation = (transformation, isDecoding) => {
  switch (transformation._tag) {
    case "FinalTransformation":
      return isDecoding ? transformation.decode : transformation.encode;
    case "ComposeTransformation":
      return right2;
    case "TypeLiteralTransformation":
      return (input) => {
        let out = right2(input);
        for (const pst of transformation.propertySignatureTransformations) {
          const [from, to] = isDecoding ? [pst.from, pst.to] : [pst.to, pst.from];
          const transformation2 = isDecoding ? pst.decode : pst.encode;
          const f = (input2) => {
            const o = transformation2(Object.prototype.hasOwnProperty.call(input2, from) ? some2(input2[from]) : none2());
            delete input2[from];
            if (isSome2(o)) {
              input2[to] = o.value;
            }
            return input2;
          };
          out = map22(out, f);
        }
        return out;
      };
  }
};
var makeTree = (value, forest = []) => ({
  value,
  forest
});
var TreeFormatter = {
  formatIssue: (issue) => map22(formatTree(issue), drawTree),
  formatIssueSync: (issue) => {
    const e = TreeFormatter.formatIssue(issue);
    return isEither3(e) ? getOrThrow(e) : runSync(e);
  },
  formatError: (error) => TreeFormatter.formatIssue(error.issue),
  formatErrorSync: (error) => TreeFormatter.formatIssueSync(error.issue)
};
var drawTree = (tree) => tree.value + draw("\n", tree.forest);
var draw = (indentation, forest) => {
  let r = "";
  const len = forest.length;
  let tree;
  for (let i = 0; i < len; i++) {
    tree = forest[i];
    const isLast = i === len - 1;
    r += indentation + (isLast ? "\u2514" : "\u251C") + "\u2500 " + tree.value;
    r += draw(indentation + (len > 1 && !isLast ? "\u2502  " : "   "), tree.forest);
  }
  return r;
};
var formatTransformationKind = (kind) => {
  switch (kind) {
    case "Encoded":
      return "Encoded side transformation failure";
    case "Transformation":
      return "Transformation process failure";
    case "Type":
      return "Type side transformation failure";
  }
};
var formatRefinementKind = (kind) => {
  switch (kind) {
    case "From":
      return "From side refinement failure";
    case "Predicate":
      return "Predicate refinement failure";
  }
};
var getAnnotated = (issue) => "ast" in issue ? some2(issue.ast) : none2();
var Either_void = /* @__PURE__ */ right2(void 0);
var getCurrentMessage = (issue) => getAnnotated(issue).pipe(flatMap(getMessageAnnotation), match2({
  onNone: () => Either_void,
  onSome: (messageAnnotation) => {
    const union10 = messageAnnotation(issue);
    if (isString(union10)) {
      return right2({
        message: union10,
        override: false
      });
    }
    if (isEffect2(union10)) {
      return map18(union10, (message) => ({
        message,
        override: false
      }));
    }
    if (isString(union10.message)) {
      return right2({
        message: union10.message,
        override: union10.override
      });
    }
    return map18(union10.message, (message) => ({
      message,
      override: union10.override
    }));
  }
}));
var createParseIssueGuard = (tag2) => (issue) => issue._tag === tag2;
var isComposite2 = /* @__PURE__ */ createParseIssueGuard("Composite");
var isRefinement2 = /* @__PURE__ */ createParseIssueGuard("Refinement");
var isTransformation2 = /* @__PURE__ */ createParseIssueGuard("Transformation");
var getMessage = (issue) => flatMap18(getCurrentMessage(issue), (currentMessage) => {
  if (currentMessage !== void 0) {
    const useInnerMessage = !currentMessage.override && (isComposite2(issue) || isRefinement2(issue) && issue.kind === "From" || isTransformation2(issue) && issue.kind !== "Transformation");
    return useInnerMessage ? isTransformation2(issue) || isRefinement2(issue) ? getMessage(issue.issue) : Either_void : right2(currentMessage.message);
  }
  return Either_void;
});
var getParseIssueTitleAnnotation2 = (issue) => getAnnotated(issue).pipe(flatMap(getParseIssueTitleAnnotation), flatMapNullable((annotation) => annotation(issue)), getOrUndefined);
function getRefinementExpected(ast) {
  return getDescriptionAnnotation(ast).pipe(orElse(() => getTitleAnnotation(ast)), orElse(() => getAutoTitleAnnotation(ast)), orElse(() => getIdentifierAnnotation(ast)), getOrElse(() => `{ ${ast.from} | filter }`));
}
function getDefaultTypeMessage(issue) {
  if (issue.message !== void 0) {
    return issue.message;
  }
  const expected = isRefinement(issue.ast) ? getRefinementExpected(issue.ast) : String(issue.ast);
  return `Expected ${expected}, actual ${formatUnknown(issue.actual)}`;
}
var formatTypeMessage = (issue) => map22(getMessage(issue), (message) => message ?? getParseIssueTitleAnnotation2(issue) ?? getDefaultTypeMessage(issue));
var getParseIssueTitle = (issue) => getParseIssueTitleAnnotation2(issue) ?? String(issue.ast);
var formatForbiddenMessage = (issue) => issue.message ?? "is forbidden";
var formatUnexpectedMessage = (issue) => issue.message ?? "is unexpected";
var formatMissingMessage = (issue) => {
  const missingMessageAnnotation = getMissingMessageAnnotation(issue.ast);
  if (isSome2(missingMessageAnnotation)) {
    const annotation = missingMessageAnnotation.value();
    return isString(annotation) ? right2(annotation) : annotation;
  }
  return right2(issue.message ?? "is missing");
};
var formatTree = (issue) => {
  switch (issue._tag) {
    case "Type":
      return map22(formatTypeMessage(issue), makeTree);
    case "Forbidden":
      return right2(makeTree(getParseIssueTitle(issue), [makeTree(formatForbiddenMessage(issue))]));
    case "Unexpected":
      return right2(makeTree(formatUnexpectedMessage(issue)));
    case "Missing":
      return map22(formatMissingMessage(issue), makeTree);
    case "Transformation":
      return flatMap18(getMessage(issue), (message) => {
        if (message !== void 0) {
          return right2(makeTree(message));
        }
        return map22(formatTree(issue.issue), (tree) => makeTree(getParseIssueTitle(issue), [makeTree(formatTransformationKind(issue.kind), [tree])]));
      });
    case "Refinement":
      return flatMap18(getMessage(issue), (message) => {
        if (message !== void 0) {
          return right2(makeTree(message));
        }
        return map22(formatTree(issue.issue), (tree) => makeTree(getParseIssueTitle(issue), [makeTree(formatRefinementKind(issue.kind), [tree])]));
      });
    case "Pointer":
      return map22(formatTree(issue.issue), (tree) => makeTree(formatPath(issue.path), [tree]));
    case "Composite":
      return flatMap18(getMessage(issue), (message) => {
        if (message !== void 0) {
          return right2(makeTree(message));
        }
        const parseIssueTitle = getParseIssueTitle(issue);
        return isNonEmpty(issue.issues) ? map22(forEach8(issue.issues, formatTree), (forest) => makeTree(parseIssueTitle, forest)) : map22(formatTree(issue.issues), (tree) => makeTree(parseIssueTitle, [tree]));
      });
  }
};

// node_modules/effect/dist/esm/Struct.js
var pick3 = /* @__PURE__ */ dual((args2) => isObject(args2[0]), (s, ...keys5) => {
  const out = {};
  for (const k of keys5) {
    if (k in s) {
      out[k] = s[k];
    }
  }
  return out;
});
var omit3 = /* @__PURE__ */ dual((args2) => isObject(args2[0]), (s, ...keys5) => {
  const out = {
    ...s
  };
  for (const k of keys5) {
    delete out[k];
  }
  return out;
});

// node_modules/effect/dist/esm/Schema.js
var TypeId19 = /* @__PURE__ */ Symbol.for("effect/Schema");
function make46(ast) {
  return class SchemaClass {
    [TypeId19] = variance5;
    static ast = ast;
    static annotations(annotations2) {
      return make46(mergeSchemaAnnotations(this.ast, annotations2));
    }
    static pipe() {
      return pipeArguments(this, arguments);
    }
    static toString() {
      return String(ast);
    }
    static Type;
    static Encoded;
    static Context;
    static [TypeId19] = variance5;
  };
}
var variance5 = {
  /* c8 ignore next */
  _A: (_) => _,
  /* c8 ignore next */
  _I: (_) => _,
  /* c8 ignore next */
  _R: (_) => _
};
var builtInAnnotations = {
  typeConstructor: TypeConstructorAnnotationId,
  schemaId: SchemaIdAnnotationId,
  message: MessageAnnotationId,
  missingMessage: MissingMessageAnnotationId,
  identifier: IdentifierAnnotationId,
  title: TitleAnnotationId,
  description: DescriptionAnnotationId,
  examples: ExamplesAnnotationId,
  default: DefaultAnnotationId,
  documentation: DocumentationAnnotationId,
  jsonSchema: JSONSchemaAnnotationId,
  arbitrary: ArbitraryAnnotationId,
  pretty: PrettyAnnotationId,
  equivalence: EquivalenceAnnotationId,
  concurrency: ConcurrencyAnnotationId,
  batching: BatchingAnnotationId,
  parseIssueTitle: ParseIssueTitleAnnotationId,
  parseOptions: ParseOptionsAnnotationId,
  decodingFallback: DecodingFallbackAnnotationId
};
var toASTAnnotations = (annotations2) => {
  if (!annotations2) {
    return {};
  }
  const out = {
    ...annotations2
  };
  for (const key in builtInAnnotations) {
    if (key in annotations2) {
      const id3 = builtInAnnotations[key];
      out[id3] = annotations2[key];
      delete out[key];
    }
  }
  return out;
};
var mergeSchemaAnnotations = (ast, annotations2) => annotations(ast, toASTAnnotations(annotations2));
var encodedSchema = (schema) => make46(encodedAST(schema.ast));
var typeSchema = (schema) => make46(typeAST(schema.ast));
var isSchema = (u) => hasProperty(u, TypeId19) && isObject(u[TypeId19]);
function getDefaultLiteralAST(literals) {
  return isMembers(literals) ? Union.make(mapMembers(literals, (literal) => new Literal(literal))) : new Literal(literals[0]);
}
function makeLiteralClass(literals, ast = getDefaultLiteralAST(literals)) {
  return class LiteralClass extends make46(ast) {
    static annotations(annotations2) {
      return makeLiteralClass(this.literals, mergeSchemaAnnotations(this.ast, annotations2));
    }
    static literals = [...literals];
  };
}
function Literal2(...literals) {
  return isNonEmptyReadonlyArray(literals) ? makeLiteralClass(literals) : Never;
}
var declareConstructor = (typeParameters, options, annotations2) => makeDeclareClass(typeParameters, new Declaration(typeParameters.map((tp) => tp.ast), (...typeParameters2) => options.decode(...typeParameters2.map(make46)), (...typeParameters2) => options.encode(...typeParameters2.map(make46)), toASTAnnotations(annotations2)));
var declarePrimitive = (is2, annotations2) => {
  const decodeUnknown3 = () => (input, _, ast) => is2(input) ? succeed14(input) : fail15(new Type2(ast, input));
  const encodeUnknown2 = decodeUnknown3;
  return makeDeclareClass([], new Declaration([], decodeUnknown3, encodeUnknown2, toASTAnnotations(annotations2)));
};
function makeDeclareClass(typeParameters, ast) {
  return class DeclareClass extends make46(ast) {
    static annotations(annotations2) {
      return makeDeclareClass(this.typeParameters, mergeSchemaAnnotations(this.ast, annotations2));
    }
    static typeParameters = [...typeParameters];
  };
}
var declare = function() {
  if (Array.isArray(arguments[0])) {
    const typeParameters = arguments[0];
    const options = arguments[1];
    const annotations3 = arguments[2];
    return declareConstructor(typeParameters, options, annotations3);
  }
  const is2 = arguments[0];
  const annotations2 = arguments[1];
  return declarePrimitive(is2, annotations2);
};
var Undefined = class extends (/* @__PURE__ */ make46(undefinedKeyword)) {
};
var Never = class extends (/* @__PURE__ */ make46(neverKeyword)) {
};
var Unknown = class extends (/* @__PURE__ */ make46(unknownKeyword)) {
};
var String$ = class extends (/* @__PURE__ */ make46(stringKeyword)) {
};
var Number$ = class extends (/* @__PURE__ */ make46(numberKeyword)) {
};
var getDefaultUnionAST = (members) => Union.make(members.map((m) => m.ast));
function makeUnionClass(members, ast = getDefaultUnionAST(members)) {
  return class UnionClass extends make46(ast) {
    static annotations(annotations2) {
      return makeUnionClass(this.members, mergeSchemaAnnotations(this.ast, annotations2));
    }
    static members = [...members];
  };
}
function Union2(...members) {
  return isMembers(members) ? makeUnionClass(members) : isNonEmptyReadonlyArray(members) ? members[0] : Never;
}
var UndefinedOr = (self) => Union2(self, Undefined);
var formatPropertySignatureToken = (isOptional) => isOptional ? '"?:"' : '":"';
var PropertySignatureDeclaration = class extends OptionalType {
  isReadonly;
  defaultValue;
  /**
   * @since 3.10.0
   */
  _tag = "PropertySignatureDeclaration";
  constructor(type, isOptional, isReadonly, annotations2, defaultValue) {
    super(type, isOptional, annotations2);
    this.isReadonly = isReadonly;
    this.defaultValue = defaultValue;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    const token = formatPropertySignatureToken(this.isOptional);
    const type = String(this.type);
    return `PropertySignature<${token}, ${type}, never, ${token}, ${type}>`;
  }
};
var ToPropertySignature = class extends OptionalType {
  isReadonly;
  defaultValue;
  constructor(type, isOptional, isReadonly, annotations2, defaultValue) {
    super(type, isOptional, annotations2);
    this.isReadonly = isReadonly;
    this.defaultValue = defaultValue;
  }
};
var formatPropertyKey2 = (p) => {
  if (p === void 0) {
    return "never";
  }
  if (isString(p)) {
    return JSON.stringify(p);
  }
  return String(p);
};
var PropertySignatureTransformation2 = class {
  from;
  to;
  decode;
  encode;
  /**
   * @since 3.10.0
   */
  _tag = "PropertySignatureTransformation";
  constructor(from, to, decode2, encode) {
    this.from = from;
    this.to = to;
    this.decode = decode2;
    this.encode = encode;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return `PropertySignature<${formatPropertySignatureToken(this.to.isOptional)}, ${this.to.type}, ${formatPropertyKey2(this.from.fromKey)}, ${formatPropertySignatureToken(this.from.isOptional)}, ${this.from.type}>`;
  }
};
var mergeSignatureAnnotations = (ast, annotations2) => {
  switch (ast._tag) {
    case "PropertySignatureDeclaration": {
      return new PropertySignatureDeclaration(ast.type, ast.isOptional, ast.isReadonly, {
        ...ast.annotations,
        ...annotations2
      }, ast.defaultValue);
    }
    case "PropertySignatureTransformation": {
      return new PropertySignatureTransformation2(ast.from, new ToPropertySignature(ast.to.type, ast.to.isOptional, ast.to.isReadonly, {
        ...ast.to.annotations,
        ...annotations2
      }, ast.to.defaultValue), ast.decode, ast.encode);
    }
  }
};
var PropertySignatureTypeId = /* @__PURE__ */ Symbol.for("effect/PropertySignature");
var isPropertySignature = (u) => hasProperty(u, PropertySignatureTypeId);
var PropertySignatureImpl = class _PropertySignatureImpl {
  ast;
  [TypeId19];
  [PropertySignatureTypeId] = null;
  _TypeToken;
  _Key;
  _EncodedToken;
  _HasDefault;
  constructor(ast) {
    this.ast = ast;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  annotations(annotations2) {
    return new _PropertySignatureImpl(mergeSignatureAnnotations(this.ast, toASTAnnotations(annotations2)));
  }
  toString() {
    return String(this.ast);
  }
};
var makePropertySignature = (ast) => new PropertySignatureImpl(ast);
var PropertySignatureWithFromImpl = class _PropertySignatureWithFromImpl extends PropertySignatureImpl {
  from;
  constructor(ast, from) {
    super(ast);
    this.from = from;
  }
  annotations(annotations2) {
    return new _PropertySignatureWithFromImpl(mergeSignatureAnnotations(this.ast, toASTAnnotations(annotations2)), this.from);
  }
};
var propertySignature = (self) => new PropertySignatureWithFromImpl(new PropertySignatureDeclaration(self.ast, false, true, {}, void 0), self);
var withConstructorDefault = /* @__PURE__ */ dual(2, (self, defaultValue) => {
  const ast = self.ast;
  switch (ast._tag) {
    case "PropertySignatureDeclaration":
      return makePropertySignature(new PropertySignatureDeclaration(ast.type, ast.isOptional, ast.isReadonly, ast.annotations, defaultValue));
    case "PropertySignatureTransformation":
      return makePropertySignature(new PropertySignatureTransformation2(ast.from, new ToPropertySignature(ast.to.type, ast.to.isOptional, ast.to.isReadonly, ast.to.annotations, defaultValue), ast.decode, ast.encode));
  }
});
var optional = (self) => {
  const ast = self.ast === undefinedKeyword || self.ast === neverKeyword ? undefinedKeyword : UndefinedOr(self).ast;
  return new PropertySignatureWithFromImpl(new PropertySignatureDeclaration(ast, true, true, {}, void 0), self);
};
var preserveMissingMessageAnnotation = /* @__PURE__ */ pickAnnotations([MissingMessageAnnotationId]);
var getDefaultTypeLiteralAST = (fields, records) => {
  const ownKeys = Reflect.ownKeys(fields);
  const pss = [];
  if (ownKeys.length > 0) {
    const from = [];
    const to = [];
    const transformations = [];
    for (let i = 0; i < ownKeys.length; i++) {
      const key = ownKeys[i];
      const field = fields[key];
      if (isPropertySignature(field)) {
        const ast = field.ast;
        switch (ast._tag) {
          case "PropertySignatureDeclaration": {
            const type = ast.type;
            const isOptional = ast.isOptional;
            const toAnnotations = ast.annotations;
            from.push(new PropertySignature(key, type, isOptional, true, preserveMissingMessageAnnotation(ast)));
            to.push(new PropertySignature(key, typeAST(type), isOptional, true, toAnnotations));
            pss.push(new PropertySignature(key, type, isOptional, true, toAnnotations));
            break;
          }
          case "PropertySignatureTransformation": {
            const fromKey = ast.from.fromKey ?? key;
            from.push(new PropertySignature(fromKey, ast.from.type, ast.from.isOptional, true, ast.from.annotations));
            to.push(new PropertySignature(key, ast.to.type, ast.to.isOptional, true, ast.to.annotations));
            transformations.push(new PropertySignatureTransformation(fromKey, key, ast.decode, ast.encode));
            break;
          }
        }
      } else {
        from.push(new PropertySignature(key, field.ast, false, true));
        to.push(new PropertySignature(key, typeAST(field.ast), false, true));
        pss.push(new PropertySignature(key, field.ast, false, true));
      }
    }
    if (isNonEmptyReadonlyArray(transformations)) {
      const issFrom = [];
      const issTo = [];
      for (const r of records) {
        const {
          indexSignatures,
          propertySignatures
        } = record(r.key.ast, r.value.ast);
        propertySignatures.forEach((ps) => {
          from.push(ps);
          to.push(new PropertySignature(ps.name, typeAST(ps.type), ps.isOptional, ps.isReadonly, ps.annotations));
        });
        indexSignatures.forEach((is2) => {
          issFrom.push(is2);
          issTo.push(new IndexSignature(is2.parameter, typeAST(is2.type), is2.isReadonly));
        });
      }
      return new Transformation(new TypeLiteral(from, issFrom, {
        [AutoTitleAnnotationId]: "Struct (Encoded side)"
      }), new TypeLiteral(to, issTo, {
        [AutoTitleAnnotationId]: "Struct (Type side)"
      }), new TypeLiteralTransformation(transformations));
    }
  }
  const iss = [];
  for (const r of records) {
    const {
      indexSignatures,
      propertySignatures
    } = record(r.key.ast, r.value.ast);
    propertySignatures.forEach((ps) => pss.push(ps));
    indexSignatures.forEach((is2) => iss.push(is2));
  }
  return new TypeLiteral(pss, iss);
};
var lazilyMergeDefaults = (fields, out) => {
  const ownKeys = Reflect.ownKeys(fields);
  for (const key of ownKeys) {
    const field = fields[key];
    if (out[key] === void 0 && isPropertySignature(field)) {
      const ast = field.ast;
      const defaultValue = ast._tag === "PropertySignatureDeclaration" ? ast.defaultValue : ast.to.defaultValue;
      if (defaultValue !== void 0) {
        out[key] = defaultValue();
      }
    }
  }
  return out;
};
function makeTypeLiteralClass(fields, records, ast = getDefaultTypeLiteralAST(fields, records)) {
  return class TypeLiteralClass extends make46(ast) {
    static annotations(annotations2) {
      return makeTypeLiteralClass(this.fields, this.records, mergeSchemaAnnotations(this.ast, annotations2));
    }
    static fields = {
      ...fields
    };
    static records = [...records];
    static make = (props, options) => {
      const propsWithDefaults = lazilyMergeDefaults(fields, {
        ...props
      });
      return getDisableValidationMakeOption(options) ? propsWithDefaults : validateSync(this)(propsWithDefaults);
    };
    static pick(...keys5) {
      return Struct(pick3(fields, ...keys5));
    }
    static omit(...keys5) {
      return Struct(omit3(fields, ...keys5));
    }
  };
}
function Struct(fields, ...records) {
  return makeTypeLiteralClass(fields, records);
}
var intersectTypeLiterals = (x, y, path3) => {
  if (isTypeLiteral(x) && isTypeLiteral(y)) {
    const propertySignatures = [...x.propertySignatures];
    for (const ps of y.propertySignatures) {
      const name = ps.name;
      const i = propertySignatures.findIndex((ps2) => ps2.name === name);
      if (i === -1) {
        propertySignatures.push(ps);
      } else {
        const {
          isOptional,
          type
        } = propertySignatures[i];
        propertySignatures[i] = new PropertySignature(name, extendAST(type, ps.type, path3.concat(name)), isOptional, true);
      }
    }
    return new TypeLiteral(propertySignatures, x.indexSignatures.concat(y.indexSignatures));
  }
  throw new Error(getSchemaExtendErrorMessage(x, y, path3));
};
var preserveRefinementAnnotations = /* @__PURE__ */ omitAnnotations([IdentifierAnnotationId]);
var addRefinementToMembers = (refinement, asts) => asts.map((ast) => new Refinement(ast, refinement.filter, preserveRefinementAnnotations(refinement)));
var extendAST = (x, y, path3) => Union.make(intersectUnionMembers([x], [y], path3));
var getTypes = (ast) => isUnion(ast) ? ast.types : [ast];
var intersectUnionMembers = (xs, ys, path3) => flatMap2(xs, (x) => flatMap2(ys, (y) => {
  switch (y._tag) {
    case "Literal": {
      if (isString(y.literal) && isStringKeyword(x) || isNumber(y.literal) && isNumberKeyword(x) || isBoolean(y.literal) && isBooleanKeyword(x)) {
        return [y];
      }
      break;
    }
    case "StringKeyword": {
      if (y === stringKeyword) {
        if (isStringKeyword(x) || isLiteral(x) && isString(x.literal)) {
          return [x];
        } else if (isRefinement(x)) {
          return addRefinementToMembers(x, intersectUnionMembers(getTypes(x.from), [y], path3));
        }
      } else if (x === stringKeyword) {
        return [y];
      }
      break;
    }
    case "NumberKeyword": {
      if (y === numberKeyword) {
        if (isNumberKeyword(x) || isLiteral(x) && isNumber(x.literal)) {
          return [x];
        } else if (isRefinement(x)) {
          return addRefinementToMembers(x, intersectUnionMembers(getTypes(x.from), [y], path3));
        }
      } else if (x === numberKeyword) {
        return [y];
      }
      break;
    }
    case "BooleanKeyword": {
      if (y === booleanKeyword) {
        if (isBooleanKeyword(x) || isLiteral(x) && isBoolean(x.literal)) {
          return [x];
        } else if (isRefinement(x)) {
          return addRefinementToMembers(x, intersectUnionMembers(getTypes(x.from), [y], path3));
        }
      } else if (x === booleanKeyword) {
        return [y];
      }
      break;
    }
    case "Union":
      return intersectUnionMembers(getTypes(x), y.types, path3);
    case "Suspend":
      return [new Suspend(() => extendAST(x, y.f(), path3))];
    case "Refinement":
      return addRefinementToMembers(y, intersectUnionMembers(getTypes(x), getTypes(y.from), path3));
    case "TypeLiteral": {
      switch (x._tag) {
        case "Union":
          return intersectUnionMembers(x.types, [y], path3);
        case "Suspend":
          return [new Suspend(() => extendAST(x.f(), y, path3))];
        case "Refinement":
          return addRefinementToMembers(x, intersectUnionMembers(getTypes(x.from), [y], path3));
        case "TypeLiteral":
          return [intersectTypeLiterals(x, y, path3)];
        case "Transformation": {
          const transformation = x.transformation;
          const from = intersectTypeLiterals(x.from, y, path3);
          const to = intersectTypeLiterals(x.to, typeAST(y), path3);
          switch (transformation._tag) {
            case "TypeLiteralTransformation":
              return [new Transformation(from, to, new TypeLiteralTransformation(transformation.propertySignatureTransformations))];
            case "ComposeTransformation":
              return [new Transformation(from, to, composeTransformation)];
            case "FinalTransformation":
              return [new Transformation(from, to, new FinalTransformation((fromA, options, ast, fromI) => map22(transformation.decode(fromA, options, ast, fromI), (partial2) => ({
                ...fromA,
                ...partial2
              })), (toI, options, ast, toA) => map22(transformation.encode(toI, options, ast, toA), (partial2) => ({
                ...toI,
                ...partial2
              }))))];
          }
        }
      }
      break;
    }
    case "Transformation": {
      if (isTransformation(x)) {
        if (isTypeLiteralTransformation(y.transformation) && isTypeLiteralTransformation(x.transformation)) {
          return [new Transformation(intersectTypeLiterals(x.from, y.from, path3), intersectTypeLiterals(x.to, y.to, path3), new TypeLiteralTransformation(y.transformation.propertySignatureTransformations.concat(x.transformation.propertySignatureTransformations)))];
        }
      } else {
        return intersectUnionMembers([y], [x], path3);
      }
      break;
    }
  }
  throw new Error(getSchemaExtendErrorMessage(x, y, path3));
}));
var extend3 = /* @__PURE__ */ dual(2, (self, that) => make46(extendAST(self.ast, that.ast, [])));
var RefineSchemaId = /* @__PURE__ */ Symbol.for("effect/SchemaId/Refine");
function makeTransformationClass(from, to, ast) {
  return class TransformationClass extends make46(ast) {
    static annotations(annotations2) {
      return makeTransformationClass(this.from, this.to, mergeSchemaAnnotations(this.ast, annotations2));
    }
    static from = from;
    static to = to;
  };
}
var transformOrFail = /* @__PURE__ */ dual((args2) => isSchema(args2[0]) && isSchema(args2[1]), (from, to, options) => makeTransformationClass(from, to, new Transformation(from.ast, to.ast, new FinalTransformation(options.decode, options.encode))));
var transform2 = /* @__PURE__ */ dual((args2) => isSchema(args2[0]) && isSchema(args2[1]), (from, to, options) => transformOrFail(from, to, {
  strict: true,
  decode: (fromA, _options, _ast, toA) => succeed14(options.decode(fromA, toA)),
  encode: (toI, _options, _ast, toA) => succeed14(options.encode(toI, toA))
}));
var isField = (u) => isSchema(u) || isPropertySignature(u);
var isFields = (fields) => Reflect.ownKeys(fields).every((key) => isField(fields[key]));
var getFields = (hasFields) => "fields" in hasFields ? hasFields.fields : getFields(hasFields[RefineSchemaId]);
var getSchemaFromFieldsOr = (fieldsOr) => isFields(fieldsOr) ? Struct(fieldsOr) : isSchema(fieldsOr) ? fieldsOr : Struct(getFields(fieldsOr));
var getFieldsFromFieldsOr = (fieldsOr) => isFields(fieldsOr) ? fieldsOr : getFields(fieldsOr);
var getClassTag = (tag2) => withConstructorDefault(propertySignature(Literal2(tag2)), () => tag2);
var TaggedError2 = (identifier2) => (tag2, fieldsOr, annotations2) => {
  class Base3 extends Error3 {
  }
  Base3.prototype.name = tag2;
  const fields = getFieldsFromFieldsOr(fieldsOr);
  const schema = getSchemaFromFieldsOr(fieldsOr);
  const newFields = {
    _tag: getClassTag(tag2)
  };
  const taggedFields = extendFields(newFields, fields);
  const hasMessageField = "message" in taggedFields;
  class TaggedErrorClass extends makeClass({
    kind: "TaggedError",
    identifier: identifier2 ?? tag2,
    schema: extend3(schema, Struct(newFields)),
    fields: taggedFields,
    Base: Base3,
    annotations: annotations2,
    disableToString: true
  }) {
    static _tag = tag2;
  }
  if (!hasMessageField) {
    Object.defineProperty(TaggedErrorClass.prototype, "message", {
      get() {
        return `{ ${Reflect.ownKeys(fields).map((p) => `${formatPropertyKey(p)}: ${formatUnknown(this[p])}`).join(", ")} }`;
      },
      enumerable: false,
      // mirrors the built-in Error.prototype.message, whose descriptor is also non-enumerable
      configurable: true
    });
  }
  return TaggedErrorClass;
};
var extendFields = (a, b) => {
  const out = {
    ...a
  };
  for (const key of Reflect.ownKeys(b)) {
    if (key in a) {
      throw new Error(getASTDuplicatePropertySignatureErrorMessage(key));
    }
    out[key] = b[key];
  }
  return out;
};
function getDisableValidationMakeOption(options) {
  return isBoolean(options) ? options : options?.disableValidation ?? false;
}
var astCache = /* @__PURE__ */ globalValue("effect/Schema/astCache", () => /* @__PURE__ */ new WeakMap());
var getClassAnnotations = (annotations2) => {
  if (annotations2 === void 0) {
    return [];
  } else if (Array.isArray(annotations2)) {
    return annotations2;
  } else {
    return [annotations2];
  }
};
var makeClass = ({
  Base: Base3,
  annotations: annotations2,
  disableToString,
  fields,
  identifier: identifier2,
  kind,
  schema
}) => {
  const classSymbol = /* @__PURE__ */ Symbol.for(`effect/Schema/${kind}/${identifier2}`);
  const [typeAnnotations, transformationAnnotations, encodedAnnotations] = getClassAnnotations(annotations2);
  const typeSchema_ = typeSchema(schema);
  const declarationSurrogate = typeSchema_.annotations({
    identifier: identifier2,
    ...typeAnnotations
  });
  const typeSide = typeSchema_.annotations({
    [AutoTitleAnnotationId]: `${identifier2} (Type side)`,
    ...typeAnnotations
  });
  const constructorSchema = schema.annotations({
    [AutoTitleAnnotationId]: `${identifier2} (Constructor)`,
    ...typeAnnotations
  });
  const encodedSide = schema.annotations({
    [AutoTitleAnnotationId]: `${identifier2} (Encoded side)`,
    ...encodedAnnotations
  });
  const transformationSurrogate = schema.annotations({
    ...encodedAnnotations,
    ...typeAnnotations,
    ...transformationAnnotations
  });
  const fallbackInstanceOf = (u) => hasProperty(u, classSymbol) && is(typeSide)(u);
  const klass = class extends Base3 {
    constructor(props = {}, options = false) {
      props = {
        ...props
      };
      {
        delete props["_tag"];
      }
      props = lazilyMergeDefaults(fields, props);
      if (!getDisableValidationMakeOption(options)) {
        props = validateSync(constructorSchema)(props);
      }
      super(props, true);
    }
    // ----------------
    // Schema interface
    // ----------------
    static [TypeId19] = variance5;
    static get ast() {
      let out = astCache.get(this);
      if (out) {
        return out;
      }
      const declaration = declare([schema], {
        decode: () => (input, _, ast) => input instanceof this || fallbackInstanceOf(input) ? succeed14(input) : fail15(new Type2(ast, input)),
        encode: () => (input, options) => input instanceof this ? succeed14(input) : map22(encodeUnknown(typeSide)(input, options), (props) => new this(props, true))
      }, {
        identifier: identifier2,
        pretty: (pretty5) => (self) => `${identifier2}(${pretty5(self)})`,
        // @ts-expect-error
        arbitrary: (arb) => (fc) => arb(fc).map((props) => new this(props)),
        equivalence: identity,
        [SurrogateAnnotationId]: declarationSurrogate.ast,
        ...typeAnnotations
      });
      out = transform2(encodedSide, declaration, {
        strict: true,
        decode: (i) => new this(i, true),
        encode: identity
      }).annotations({
        [SurrogateAnnotationId]: transformationSurrogate.ast,
        ...transformationAnnotations
      }).ast;
      astCache.set(this, out);
      return out;
    }
    static pipe() {
      return pipeArguments(this, arguments);
    }
    static annotations(annotations3) {
      return make46(this.ast).annotations(annotations3);
    }
    static toString() {
      return `(${String(encodedSide)} <-> ${identifier2})`;
    }
    // ----------------
    // Class interface
    // ----------------
    static make(...args2) {
      return new this(...args2);
    }
    static fields = {
      ...fields
    };
    static identifier = identifier2;
    static extend(identifier3) {
      return (newFieldsOr, annotations3) => {
        const newFields = getFieldsFromFieldsOr(newFieldsOr);
        const newSchema = getSchemaFromFieldsOr(newFieldsOr);
        const extendedFields = extendFields(fields, newFields);
        return makeClass({
          kind,
          identifier: identifier3,
          schema: extend3(schema, newSchema),
          fields: extendedFields,
          Base: this,
          annotations: annotations3
        });
      };
    }
    static transformOrFail(identifier3) {
      return (newFieldsOr, options, annotations3) => {
        const transformedFields = extendFields(fields, newFieldsOr);
        return makeClass({
          kind,
          identifier: identifier3,
          schema: transformOrFail(schema, typeSchema(Struct(transformedFields)), options),
          fields: transformedFields,
          Base: this,
          annotations: annotations3
        });
      };
    }
    static transformOrFailFrom(identifier3) {
      return (newFields, options, annotations3) => {
        const transformedFields = extendFields(fields, newFields);
        return makeClass({
          kind,
          identifier: identifier3,
          schema: transformOrFail(encodedSchema(schema), Struct(transformedFields), options),
          fields: transformedFields,
          Base: this,
          annotations: annotations3
        });
      };
    }
    // ----------------
    // other
    // ----------------
    get [classSymbol]() {
      return classSymbol;
    }
  };
  if (disableToString !== true) {
    Object.defineProperty(klass.prototype, "toString", {
      value() {
        return `${identifier2}({ ${Reflect.ownKeys(fields).map((p) => `${formatPropertyKey(p)}: ${formatUnknown(this[p])}`).join(", ")} })`;
      },
      configurable: true,
      writable: true
    });
  }
  return klass;
};
var Defect = class extends (/* @__PURE__ */ transform2(Unknown, Unknown, {
  strict: true,
  decode: (i) => {
    if (isObject(i) && "message" in i && typeof i.message === "string") {
      const err = new Error(i.message, {
        cause: i
      });
      if ("name" in i && typeof i.name === "string") {
        err.name = i.name;
      }
      err.stack = "stack" in i && typeof i.stack === "string" ? i.stack : "";
      return err;
    }
    return prettyErrorMessage(i);
  },
  encode: (a) => {
    if (a instanceof Error) {
      return {
        name: a.name,
        message: a.message
        // no stack because of security reasons
      };
    }
    return prettyErrorMessage(a);
  }
}).annotations({
  identifier: "Defect"
})) {
};

// node_modules/effect/dist/esm/Sink.js
var fail16 = fail13;
var forEach10 = forEach9;
var unwrapScoped6 = unwrapScoped4;

// node_modules/effect/dist/esm/Stream.js
var bufferChunks2 = bufferChunks;
var fail17 = fail14;
var fromChannel3 = fromChannel;
var unwrapScoped7 = unwrapScoped5;

// node_modules/@effect/platform/dist/esm/Error.js
var TypeId20 = /* @__PURE__ */ Symbol.for("@effect/platform/Error");
var Module = /* @__PURE__ */ Literal2("Clipboard", "Command", "FileSystem", "KeyValueStore", "Path", "Stream", "Terminal");
var BadArgument = class extends (/* @__PURE__ */ TaggedError2("@effect/platform/Error/BadArgument")("BadArgument", {
  module: Module,
  method: String$,
  description: /* @__PURE__ */ optional(String$),
  cause: /* @__PURE__ */ optional(Defect)
})) {
  /**
   * @since 1.0.0
   */
  [TypeId20] = TypeId20;
  /**
   * @since 1.0.0
   */
  get message() {
    return `${this.module}.${this.method}${this.description ? `: ${this.description}` : ""}`;
  }
};
var SystemErrorReason = /* @__PURE__ */ Literal2("AlreadyExists", "BadResource", "Busy", "InvalidData", "NotFound", "PermissionDenied", "TimedOut", "UnexpectedEof", "Unknown", "WouldBlock", "WriteZero");
var SystemError = class extends (/* @__PURE__ */ TaggedError2("@effect/platform/Error/SystemError")("SystemError", {
  reason: SystemErrorReason,
  module: Module,
  method: String$,
  description: /* @__PURE__ */ optional(String$),
  syscall: /* @__PURE__ */ optional(String$),
  pathOrDescriptor: /* @__PURE__ */ optional(/* @__PURE__ */ Union2(String$, Number$)),
  cause: /* @__PURE__ */ optional(Defect)
})) {
  /**
   * @since 1.0.0
   */
  [TypeId20] = TypeId20;
  /**
   * @since 1.0.0
   */
  get message() {
    return `${this.reason}: ${this.module}.${this.method}${this.pathOrDescriptor !== void 0 ? ` (${this.pathOrDescriptor})` : ""}${this.description ? `: ${this.description}` : ""}`;
  }
};

// node_modules/@effect/platform/dist/esm/FileSystem.js
var FileSystem_exports = {};
__export(FileSystem_exports, {
  FileDescriptor: () => FileDescriptor,
  FileSystem: () => FileSystem,
  FileTypeId: () => FileTypeId,
  GiB: () => GiB2,
  KiB: () => KiB2,
  MiB: () => MiB2,
  PiB: () => PiB2,
  Size: () => Size2,
  TiB: () => TiB2,
  WatchBackend: () => WatchBackend,
  WatchEventCreate: () => WatchEventCreate,
  WatchEventRemove: () => WatchEventRemove,
  WatchEventUpdate: () => WatchEventUpdate,
  isFile: () => isFile,
  layerNoop: () => layerNoop2,
  make: () => make49,
  makeNoop: () => makeNoop2
});

// node_modules/@effect/platform/dist/esm/internal/fileSystem.js
var tag = /* @__PURE__ */ GenericTag("@effect/platform/FileSystem");
var Size = (bytes) => typeof bytes === "bigint" ? bytes : BigInt(bytes);
var KiB = (n) => Size(n * 1024);
var MiB = (n) => Size(n * 1024 * 1024);
var GiB = (n) => Size(n * 1024 * 1024 * 1024);
var TiB = (n) => Size(n * 1024 * 1024 * 1024 * 1024);
var bigint1024 = /* @__PURE__ */ BigInt(1024);
var bigintPiB = bigint1024 * bigint1024 * bigint1024 * bigint1024 * bigint1024;
var PiB = (n) => Size(BigInt(n) * bigintPiB);
var make48 = (impl) => {
  return tag.of({
    ...impl,
    exists: (path3) => pipe(impl.access(path3), as8(true), catchTag2("SystemError", (e) => e.reason === "NotFound" ? succeed10(false) : fail10(e))),
    readFileString: (path3, encoding) => tryMap2(impl.readFile(path3), {
      try: (_) => new TextDecoder(encoding).decode(_),
      catch: (cause3) => new BadArgument({
        module: "FileSystem",
        method: "readFileString",
        description: "invalid encoding",
        cause: cause3
      })
    }),
    stream: (path3, options) => pipe(impl.open(path3, {
      flag: "r"
    }), options?.offset ? tap4((file) => file.seek(options.offset, "start")) : identity, map18((file) => stream(file, options)), unwrapScoped7),
    sink: (path3, options) => pipe(impl.open(path3, {
      flag: "w",
      ...options
    }), map18((file) => forEach10((_) => file.writeAll(_))), unwrapScoped6),
    writeFileString: (path3, data, options) => flatMap12(try_2({
      try: () => new TextEncoder().encode(data),
      catch: (cause3) => new BadArgument({
        module: "FileSystem",
        method: "writeFileString",
        description: "could not encode string",
        cause: cause3
      })
    }), (_) => impl.writeFile(path3, _, options))
  });
};
var notFound = (method, path3) => new SystemError({
  module: "FileSystem",
  method,
  reason: "NotFound",
  description: "No such file or directory",
  pathOrDescriptor: path3
});
var makeNoop = (fileSystem) => {
  return {
    access(path3) {
      return fail10(notFound("access", path3));
    },
    chmod(path3) {
      return fail10(notFound("chmod", path3));
    },
    chown(path3) {
      return fail10(notFound("chown", path3));
    },
    copy(path3) {
      return fail10(notFound("copy", path3));
    },
    copyFile(path3) {
      return fail10(notFound("copyFile", path3));
    },
    exists() {
      return succeed10(false);
    },
    link(path3) {
      return fail10(notFound("link", path3));
    },
    makeDirectory() {
      return die7("not implemented");
    },
    makeTempDirectory() {
      return die7("not implemented");
    },
    makeTempDirectoryScoped() {
      return die7("not implemented");
    },
    makeTempFile() {
      return die7("not implemented");
    },
    makeTempFileScoped() {
      return die7("not implemented");
    },
    open(path3) {
      return fail10(notFound("open", path3));
    },
    readDirectory(path3) {
      return fail10(notFound("readDirectory", path3));
    },
    readFile(path3) {
      return fail10(notFound("readFile", path3));
    },
    readFileString(path3) {
      return fail10(notFound("readFileString", path3));
    },
    readLink(path3) {
      return fail10(notFound("readLink", path3));
    },
    realPath(path3) {
      return fail10(notFound("realPath", path3));
    },
    remove() {
      return _void;
    },
    rename(oldPath) {
      return fail10(notFound("rename", oldPath));
    },
    sink(path3) {
      return fail16(notFound("sink", path3));
    },
    stat(path3) {
      return fail10(notFound("stat", path3));
    },
    stream(path3) {
      return fail17(notFound("stream", path3));
    },
    symlink(fromPath) {
      return fail10(notFound("symlink", fromPath));
    },
    truncate(path3) {
      return fail10(notFound("truncate", path3));
    },
    utimes(path3) {
      return fail10(notFound("utimes", path3));
    },
    watch(path3) {
      return fail17(notFound("watch", path3));
    },
    writeFile(path3) {
      return fail10(notFound("writeFile", path3));
    },
    writeFileString(path3) {
      return fail10(notFound("writeFileString", path3));
    },
    ...fileSystem
  };
};
var layerNoop = (fileSystem) => succeed11(tag, makeNoop(fileSystem));
var stream = (file, {
  bufferSize = 16,
  bytesToRead: bytesToRead_,
  chunkSize: chunkSize_ = Size(64 * 1024)
} = {}) => {
  const bytesToRead = bytesToRead_ !== void 0 ? Size(bytesToRead_) : void 0;
  const chunkSize = Size(chunkSize_);
  function loop3(totalBytesRead) {
    if (bytesToRead !== void 0 && bytesToRead <= totalBytesRead) {
      return void_8;
    }
    const toRead = bytesToRead !== void 0 && bytesToRead - totalBytesRead < chunkSize ? bytesToRead - totalBytesRead : chunkSize;
    return flatMap17(file.readAlloc(toRead), match2({
      onNone: () => void_8,
      onSome: (buf) => flatMap17(write2(of2(buf)), (_) => loop3(totalBytesRead + BigInt(buf.length)))
    }));
  }
  return bufferChunks2(fromChannel3(loop3(BigInt(0))), {
    capacity: bufferSize
  });
};

// node_modules/@effect/platform/dist/esm/FileSystem.js
var Size2 = Size;
var KiB2 = KiB;
var MiB2 = MiB;
var GiB2 = GiB;
var TiB2 = TiB;
var PiB2 = PiB;
var FileSystem = tag;
var make49 = make48;
var makeNoop2 = makeNoop;
var layerNoop2 = layerNoop;
var FileTypeId = /* @__PURE__ */ Symbol.for("@effect/platform/FileSystem/File");
var isFile = (u) => typeof u === "object" && u !== null && FileTypeId in u;
var FileDescriptor = /* @__PURE__ */ nominal();
var WatchEventCreate = /* @__PURE__ */ tagged2("Create");
var WatchEventUpdate = /* @__PURE__ */ tagged2("Update");
var WatchEventRemove = /* @__PURE__ */ tagged2("Remove");
var WatchBackend = class extends (/* @__PURE__ */ Tag2("@effect/platform/FileSystem/WatchBackend")()) {
};

// src/platform/node/nodeFileSystem.ts
var REASON_BY_CODE = {
  ENOENT: "NotFound",
  EEXIST: "AlreadyExists",
  EACCES: "PermissionDenied",
  EPERM: "PermissionDenied",
  EBUSY: "Busy",
  ETIMEDOUT: "TimedOut",
  EISDIR: "InvalidData",
  ENOTDIR: "InvalidData"
};
var toSystemError = (method, pathOrDescriptor, cause3) => {
  const errno = cause3;
  return new SystemError({
    module: "FileSystem",
    method,
    reason: REASON_BY_CODE[errno?.code ?? ""] ?? "Unknown",
    pathOrDescriptor,
    syscall: errno?.syscall,
    cause: cause3
  });
};
var run5 = (method, path3, thunk) => Effect_exports.tryPromise({
  try: thunk,
  catch: (cause3) => toSystemError(method, path3, cause3)
});
var fileType = (s) => {
  if (s.isDirectory()) return "Directory";
  if (s.isSymbolicLink()) return "SymbolicLink";
  if (s.isBlockDevice()) return "BlockDevice";
  if (s.isCharacterDevice()) return "CharacterDevice";
  if (s.isFIFO()) return "FIFO";
  if (s.isSocket()) return "Socket";
  if (s.isFile()) return "File";
  return "Unknown";
};
var toFileInfo = (s) => ({
  type: fileType(s),
  mtime: Option_exports.fromNullable(s.mtime),
  atime: Option_exports.fromNullable(s.atime),
  birthtime: Option_exports.fromNullable(s.birthtime),
  dev: s.dev,
  ino: Option_exports.some(s.ino),
  mode: s.mode,
  nlink: Option_exports.some(s.nlink),
  uid: Option_exports.some(s.uid),
  gid: Option_exports.some(s.gid),
  rdev: Option_exports.some(s.rdev),
  size: FileSystem_exports.Size(s.size),
  blksize: Option_exports.some(FileSystem_exports.Size(s.blksize)),
  blocks: Option_exports.some(s.blocks)
});
var layer = FileSystem_exports.layerNoop({
  stat: (path3) => run5("stat", path3, () => stat(path3)).pipe(Effect_exports.map(toFileInfo)),
  readFileString: (path3, encoding) => run5(
    "readFileString",
    path3,
    () => readFile(path3, encoding ?? "utf8")
  ),
  readDirectory: (path3, options) => run5("readDirectory", path3, () => readdir(path3, { recursive: options?.recursive })),
  realPath: (path3) => run5("realPath", path3, () => realpath(path3)),
  remove: (path3, options) => run5(
    "remove",
    path3,
    () => rm(path3, { recursive: options?.recursive, force: options?.force }).then(
      () => void 0
    )
  ),
  makeDirectory: (path3, options) => run5(
    "makeDirectory",
    path3,
    () => mkdir(path3, { recursive: options?.recursive, mode: options?.mode }).then(
      () => void 0
    )
  ),
  writeFileString: (path3, data, options) => run5(
    "writeFileString",
    path3,
    () => writeFile(path3, data, {
      flag: options?.flag ?? "w",
      mode: options?.mode
    })
  )
});

// src/errors/errors.ts
var ExecError = class extends Data_exports.TaggedError("ExecError") {
};
(class extends Data_exports.TaggedError("ExecHostError") {
});
var CopyError = class extends Data_exports.TaggedError("CopyError") {
};
(class extends Data_exports.TaggedError("DockerError") {
});
(class extends Data_exports.TaggedError("PodmanError") {
});
var SyncError = class extends Data_exports.TaggedError("SyncError") {
};
var WorktreeError = class extends Data_exports.TaggedError("WorktreeError") {
};
var PromptError = class extends Data_exports.TaggedError("PromptError") {
};
var AgentError = class extends Data_exports.TaggedError("AgentError") {
};
(class extends Data_exports.TaggedError("ConfigDirError") {
});
(class extends Data_exports.TaggedError("InitError") {
});
(class extends Data_exports.TaggedError("FleetError") {
});
var AgentIdleTimeoutError = class extends Data_exports.TaggedError(
  "AgentIdleTimeoutError"
) {
};
var WorktreeTimeoutError = class extends Data_exports.TaggedError(
  "WorktreeTimeoutError"
) {
};
var ContainerStartTimeoutError = class extends Data_exports.TaggedError(
  "ContainerStartTimeoutError"
) {
};
var CopyToWorktreeTimeoutError = class extends Data_exports.TaggedError(
  "CopyToWorktreeTimeoutError"
) {
};
var CopyToWorktreeError = class extends Data_exports.TaggedError(
  "CopyToWorktreeError"
) {
};
var SyncInTimeoutError = class extends Data_exports.TaggedError("SyncInTimeoutError") {
};
var HookTimeoutError = class extends Data_exports.TaggedError("HookTimeoutError") {
};
var GitSetupTimeoutError = class extends Data_exports.TaggedError(
  "GitSetupTimeoutError"
) {
};
var PromptExpansionTimeoutError = class extends Data_exports.TaggedError(
  "PromptExpansionTimeoutError"
) {
};
var CommitCollectionTimeoutError = class extends Data_exports.TaggedError(
  "CommitCollectionTimeoutError"
) {
};
var MergeToHostTimeoutError = class extends Data_exports.TaggedError(
  "MergeToHostTimeoutError"
) {
};
var withTimeout = (timeoutMs, onTimeout) => (effect3) => effect3.pipe(
  Effect_exports.timeoutFail({
    duration: Duration_exports.millis(timeoutMs),
    onTimeout
  })
);
var CwdError = class extends Data_exports.TaggedError("CwdError") {
};

// src/utils/resolveCwd.ts
var resolveCwd = (cwd) => Effect_exports.gen(function* () {
  const resolved = cwd !== void 0 ? resolve(process.cwd(), cwd) : resolve(process.cwd());
  const fs = yield* FileSystem_exports.FileSystem;
  const stat3 = yield* fs.stat(resolved).pipe(
    Effect_exports.mapError(
      () => new CwdError({
        message: `cwd does not exist: ${resolved}`,
        cwd: resolved
      })
    )
  );
  if (stat3.type !== "Directory") {
    return yield* new CwdError({
      message: `cwd is not a directory: ${resolved}`,
      cwd: resolved
    });
  }
  return resolved;
});

// src/application/sandbox/lifecycle/providerTraits.ts
var providerTraits = (provider) => ({
  isolated: provider.tag === "isolated"
});
var resolveBranchStrategy = (provider, requested) => {
  const { isolated } = providerTraits(provider);
  const strategy = requested ?? (isolated ? { type: "merge-to-head" } : { type: "head" });
  if (strategy.type === "head" && isolated) {
    throw new Error(
      "head branch strategy is not supported with isolated providers"
    );
  }
  return strategy;
};

// src/ports/Display.ts
var Display = class extends Context_exports.Tag("Display")() {
};

// src/platform/node/displays.ts
var SilentDisplay = {
  layer: (ref) => Layer_exports.succeed(Display, {
    intro: (title) => Ref_exports.update(ref, (entries2) => [
      ...entries2,
      { _tag: "intro", title }
    ]),
    status: (message, severity) => Ref_exports.update(ref, (entries2) => [
      ...entries2,
      { _tag: "status", message, severity }
    ]),
    spinner: (message, effect3) => Effect_exports.flatMap(
      Ref_exports.update(ref, (entries2) => [
        ...entries2,
        { _tag: "spinner", message }
      ]),
      () => effect3
    ),
    summary: (title, rows) => Ref_exports.update(ref, (entries2) => [
      ...entries2,
      { _tag: "summary", title, rows }
    ]),
    taskLog: (title, effect3) => {
      const messages = [];
      return Effect_exports.flatMap(
        effect3((msg) => messages.push(msg)),
        (result) => Effect_exports.map(
          Ref_exports.update(ref, (entries2) => [
            ...entries2,
            {
              _tag: "taskLog",
              title,
              messages: [...messages]
            }
          ]),
          () => result
        )
      );
    },
    alert: (message) => Effect_exports.zipRight(
      Effect_exports.sync(() => writeStderr(message)),
      Ref_exports.update(ref, (entries2) => [
        ...entries2,
        { _tag: "alert", message }
      ])
    ),
    text: (message) => Ref_exports.update(ref, (entries2) => [
      ...entries2,
      { _tag: "text", message }
    ]),
    textChunk: (chunk3) => Ref_exports.update(ref, (entries2) => [
      ...entries2,
      { _tag: "textChunk", message: chunk3 }
    ]),
    toolCall: (name, formattedArgs) => Ref_exports.update(ref, (entries2) => [
      ...entries2,
      { _tag: "toolCall", name, formattedArgs }
    ])
  })
};
var FileDisplay = {
  layer: (filePath) => Layer_exports.effect(
    Display,
    Effect_exports.gen(function* () {
      const fs = yield* FileSystem_exports.FileSystem;
      yield* fs.makeDirectory(dirname(filePath), { recursive: true }).pipe(Effect_exports.orDie);
      const delimiter = `
--- Run started: ${(/* @__PURE__ */ new Date()).toISOString()} ---
`;
      yield* fs.writeFileString(filePath, delimiter, { flag: "a" }).pipe(Effect_exports.orDie);
      let midLine = false;
      const appendSync = (text) => {
        try {
          appendFileSync(filePath, text);
        } catch {
        }
      };
      const appendToLog = (line) => Effect_exports.sync(() => {
        const prefix = midLine ? "\n" : "";
        midLine = false;
        appendSync(`${prefix}${line}
`);
      });
      const appendRaw = (chunk3) => Effect_exports.sync(() => {
        if (chunk3.length === 0) return;
        midLine = !chunk3.endsWith("\n");
        appendSync(chunk3);
      });
      return {
        intro: () => Effect_exports.void,
        status: (message, _severity) => appendToLog(message.replace(/^\[[^\]]+\] /, "")),
        spinner: (message, effect3) => Effect_exports.gen(function* () {
          yield* appendToLog(`${message}...`);
          const start3 = Date.now();
          const result = yield* effect3;
          const elapsed3 = ((Date.now() - start3) / 1e3).toFixed(1);
          yield* appendToLog(`${message} done (${elapsed3}s)`);
          return result;
        }),
        summary: (title, rows) => {
          const lines = Object.entries(rows).map(([key, value]) => `  ${key}: ${value}`).join("\n");
          return appendToLog(`${title}
${lines}`);
        },
        taskLog: (title, effect3) => Effect_exports.gen(function* () {
          yield* appendToLog(title);
          const start3 = Date.now();
          const messages = [];
          const result = yield* effect3((msg) => {
            messages.push(msg);
          });
          const elapsed3 = ((Date.now() - start3) / 1e3).toFixed(1);
          for (const msg of messages) {
            yield* appendToLog(`  ${msg}`);
          }
          yield* appendToLog(`${title} done (${elapsed3}s)`);
          return result;
        }),
        alert: (message) => Effect_exports.zipRight(
          Effect_exports.sync(() => writeStderr(message)),
          appendToLog(message)
        ),
        text: (message) => appendToLog(message),
        textChunk: (chunk3) => appendRaw(chunk3),
        toolCall: (name, formattedArgs) => appendToLog(`${name}(${formattedArgs})`)
      };
    })
  )
};
var writeStderr = (message) => {
  console.error(message);
};
var severityToClack = {
  info: clack.log.info,
  success: clack.log.success,
  warn: clack.log.warning,
  error: clack.log.error
};
var terminalStyle = {
  status: (message) => styleText("bold", message),
  summaryTitle: (title) => styleText("bold", title),
  summaryRow: (key, value) => `${styleText("bold", key)}: ${styleText("dim", value)}`,
  toolCall: (text) => styleText("dim", text)
};
var ClackDisplay = {
  layer: Layer_exports.succeed(Display, {
    intro: (title) => Effect_exports.sync(() => clack.intro(styleText("inverse", ` ${title} `))),
    status: (message, severity) => Effect_exports.sync(
      () => severityToClack[severity](terminalStyle.status(message))
    ),
    spinner: (message, effect3) => Effect_exports.acquireUseRelease(
      Effect_exports.sync(() => {
        const s = clack.spinner();
        s.start(message);
        return s;
      }),
      () => effect3,
      (s, exit4) => Effect_exports.sync(() => {
        if (exit4._tag === "Success") {
          s.stop(message);
        } else {
          s.stop(`${message} (failed)`);
        }
      })
    ),
    summary: (title, rows) => Effect_exports.sync(() => {
      const lines = Object.entries(rows).map(([key, value]) => terminalStyle.summaryRow(key, value)).join("\n");
      clack.note(lines, terminalStyle.summaryTitle(title));
    }),
    taskLog: (title, effect3) => Effect_exports.acquireUseRelease(
      Effect_exports.sync(() => clack.taskLog({ title })),
      (log4) => effect3((msg) => log4.message(msg)),
      (log4, exit4) => Effect_exports.sync(() => {
        if (exit4._tag === "Success") {
          log4.success(title, { showLog: true });
        } else {
          log4.error(title, { showLog: true });
        }
      })
    ),
    alert: (message) => Effect_exports.sync(() => writeStderr(message)),
    text: (message) => Effect_exports.sync(() => clack.log.message(message)),
    textChunk: (chunk3) => Effect_exports.sync(() => clack.log.message(chunk3)),
    toolCall: (name, formattedArgs) => Effect_exports.sync(
      () => clack.log.step(terminalStyle.toolCall(`${name}(${formattedArgs})`))
    )
  })
};

// src/application/display/AgentStreamEmitter.ts
var AgentStreamEmitter = class extends Context_exports.Tag("AgentStreamEmitter")() {
};
var agentStreamEmitterLayer = (onEvent) => Layer_exports.succeed(AgentStreamEmitter, {
  emit: onEvent ? (event) => Effect_exports.sync(() => {
    try {
      onEvent(event);
    } catch {
    }
  }) : () => Effect_exports.void
});

// src/application/prompts/PromptPreprocessor.ts
var PROMPT_EXPANSION_TIMEOUT_MS = 3e4;
var SHELL_BLOCK_MARKER = "";
var MARKED_SHELL_BLOCK_PATTERN = new RegExp(
  `!${SHELL_BLOCK_MARKER}\`([^\`]+)\``,
  "g"
);
var preprocessPrompt = (prompt, sandbox3, cwd) => {
  const matches = [...prompt.matchAll(MARKED_SHELL_BLOCK_PATTERN)];
  if (matches.length === 0) {
    return Effect_exports.succeed(prompt.replaceAll(SHELL_BLOCK_MARKER, ""));
  }
  return Effect_exports.gen(function* () {
    const display = yield* Display;
    return yield* display.taskLog(
      "Expanding shell expressions",
      (message) => Effect_exports.gen(function* () {
        const results = yield* Effect_exports.all(
          matches.map((match19) => {
            const command = match19[1];
            return Effect_exports.gen(function* () {
              const start3 = yield* Clock_exports.currentTimeMillis;
              const maybeResult = yield* sandbox3.exec(command, { cwd }).pipe(
                Effect_exports.timeoutOption(
                  Duration_exports.millis(PROMPT_EXPANSION_TIMEOUT_MS)
                )
              );
              if (Option_exports.isNone(maybeResult)) {
                const elapsedMs = (yield* Clock_exports.currentTimeMillis) - start3;
                return yield* Effect_exports.fail(
                  new PromptExpansionTimeoutError({
                    message: `Shell expression \`${command}\` timed out after ${elapsedMs}ms`,
                    timeoutMs: PROMPT_EXPANSION_TIMEOUT_MS,
                    expression: command,
                    elapsedMs
                  })
                );
              }
              const execResult = maybeResult.value;
              if (execResult.exitCode !== 0) {
                return yield* Effect_exports.fail(
                  new PromptError({
                    message: `Command \`${command}\` exited with code ${execResult.exitCode}: ${execResult.stderr}`,
                    exitCode: execResult.exitCode
                  })
                );
              }
              return execResult.stdout.trimEnd();
            });
          }),
          { concurrency: "unbounded" }
        );
        for (let i = 0; i < matches.length; i++) {
          const command = matches[i][1];
          const tokens = Math.ceil(results[i].length / 4);
          message(`${command} \u2192 ~${tokens} tokens`);
        }
        let result = prompt;
        for (let i = matches.length - 1; i >= 0; i--) {
          const match19 = matches[i];
          const index = match19.index;
          result = result.slice(0, index) + results[i] + result.slice(index + match19[0].length);
        }
        return result.replaceAll(SHELL_BLOCK_MARKER, "");
      })
    );
  });
};

// src/ports/HostProcess.ts
var HostCommandError = class extends Data_exports.TaggedError("HostCommandError") {
};
var HostProcess = class extends Context_exports.Tag("HostProcess")() {
};

// src/application/sandbox/worktree/WorktreeManager.ts
var WORKTREE_TIMEOUT_MS = 3e4;
var NO_CONFIG_LOCK_FLAGS = [
  "-c",
  "branch.autoSetupMerge=false",
  "-c",
  "push.autoSetupRemote=false"
];
var formatTimestamp = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
};
var randomBranchSuffix = () => randomBytes(3).toString("hex");
var sanitizeName = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, "-");
var execGit = (args2, cwd) => Effect_exports.flatMap(
  HostProcess,
  (host) => (
    // Force the C locale so git emits English, machine-stable messages. Several
    // callers match git's stderr (e.g. "invalid reference") to decide control
    // flow; under a localized locale gettext translates those strings and the
    // matches silently fail, breaking worktree creation.
    host.run("git", args2, { cwd, env: { LC_ALL: "C" } }).pipe(
      Effect_exports.map(({ stdout }) => stdout),
      Effect_exports.mapError(
        (error) => new WorktreeError({
          message: error.stderr.trim() || error.message
        })
      )
    )
  )
);
var generateTempBranchName = (name) => {
  const ts = formatTimestamp(/* @__PURE__ */ new Date());
  const suffix = randomBranchSuffix();
  if (name) {
    return `arsenal/${sanitizeName(name)}/${ts}-${suffix}`;
  }
  return `arsenal/${ts}-${suffix}`;
};
var getCurrentBranch = (repoDir) => execGit(["rev-parse", "--abbrev-ref", "HEAD"], repoDir).pipe(
  Effect_exports.map((output) => output.trim())
);
var normalizePath = (p) => p.replace(/\\/g, "/");
var findCollidingWorktree = (existing, branch, worktreePath) => existing.find((wt) => wt.branch === branch) ?? existing.find((wt) => normalizePath(wt.path) === normalizePath(worktreePath));
var isManagedWorktreePath = (worktreePath, worktreesDir) => normalizePath(worktreePath).startsWith(normalizePath(worktreesDir));
var isOrphanedWorktreePath = (entryPath, activeWorktreePaths) => {
  const normalizedEntry = normalizePath(entryPath);
  for (const active2 of activeWorktreePaths) {
    if (normalizePath(active2) === normalizedEntry) return false;
  }
  return true;
};
var listWorktrees = (repoDir) => execGit(["worktree", "list", "--porcelain"], repoDir).pipe(
  Effect_exports.map((output) => {
    const entries2 = [];
    let currentPath = null;
    let currentBranch = null;
    for (const line of output.split("\n")) {
      if (line.startsWith("worktree ")) {
        if (currentPath !== null) {
          entries2.push({ path: currentPath, branch: currentBranch });
        }
        currentPath = line.slice("worktree ".length).trim();
        currentBranch = null;
      } else if (line.startsWith("branch ")) {
        currentBranch = line.slice("branch refs/heads/".length).trim();
      }
    }
    if (currentPath !== null) {
      entries2.push({ path: currentPath, branch: currentBranch });
    }
    return entries2;
  })
);
var fastForwardFromOrigin = (worktreePath, branch) => Effect_exports.gen(function* () {
  const display = yield* Display;
  const headRef = yield* execGit(
    ["symbolic-ref", "--quiet", "HEAD"],
    worktreePath
  ).pipe(
    Effect_exports.map((s) => s.trim()),
    Effect_exports.orElseSucceed(() => "")
  );
  if (headRef !== `refs/heads/${branch}`) {
    yield* display.status(
      `Reusing worktree at ${worktreePath} (branch '${branch}') \u2014 HEAD is not on '${branch}', skipping origin refresh`,
      "info"
    );
    return;
  }
  const fetchResult = yield* Effect_exports.either(
    execGit(
      [...NO_CONFIG_LOCK_FLAGS, "fetch", "origin", branch],
      worktreePath
    )
  );
  if (fetchResult._tag === "Left") {
    yield* display.status(
      `Could not fetch from origin (reusing worktree at ${worktreePath} as-is, branch '${branch}')`,
      "info"
    );
    return;
  }
  const before2 = yield* execGit(["rev-parse", "HEAD"], worktreePath).pipe(
    Effect_exports.map((s) => s.trim()),
    Effect_exports.orElseSucceed(() => "")
  );
  const mergeResult = yield* Effect_exports.either(
    execGit(
      [...NO_CONFIG_LOCK_FLAGS, "merge", "--ff-only", `origin/${branch}`],
      worktreePath
    )
  );
  if (mergeResult._tag === "Left") {
    yield* display.status(
      `Branch '${branch}' has diverged from origin (reusing worktree at ${worktreePath} as-is)`,
      "info"
    );
    return;
  }
  const after3 = yield* execGit(["rev-parse", "HEAD"], worktreePath).pipe(
    Effect_exports.map((s) => s.trim()),
    Effect_exports.orElseSucceed(() => "")
  );
  if (before2 && after3 && before2 !== after3) {
    yield* display.status(
      `Fast-forwarded worktree at ${worktreePath} (branch '${branch}') to origin/${branch}`,
      "info"
    );
  } else {
    yield* display.status(
      `Reusing existing worktree at ${worktreePath} (branch '${branch}')`,
      "info"
    );
  }
});
var create = (repoDir, opts) => Effect_exports.gen(function* () {
  const fs = yield* FileSystem_exports.FileSystem;
  const worktreesDir = join$1(repoDir, ".arsenal", "worktrees");
  yield* fs.makeDirectory(worktreesDir, { recursive: true }).pipe(Effect_exports.mapError((e) => new WorktreeError({ message: e.message })));
  const realWorktreesDir = yield* fs.realPath(worktreesDir).pipe(Effect_exports.catchAll(() => Effect_exports.succeed(worktreesDir)));
  let branch;
  let worktreeName;
  if (opts?.branch) {
    branch = opts.branch;
    worktreeName = branch.replace(/\//g, "-");
  } else {
    const timestamp = formatTimestamp(/* @__PURE__ */ new Date());
    const suffix = randomBranchSuffix();
    if (opts?.name) {
      const sanitized = sanitizeName(opts.name);
      branch = `arsenal/${sanitized}/${timestamp}-${suffix}`;
      worktreeName = `arsenal-${sanitized}-${timestamp}-${suffix}`;
    } else {
      branch = `arsenal/${timestamp}-${suffix}`;
      worktreeName = `arsenal-${timestamp}-${suffix}`;
    }
  }
  const worktreePath = join$1(realWorktreesDir, worktreeName);
  if (opts?.branch) {
    const existing = yield* listWorktrees(repoDir);
    const collision = findCollidingWorktree(existing, branch, worktreePath);
    if (collision) {
      if (isManagedWorktreePath(collision.path, realWorktreesDir)) {
        const dirty = yield* hasUncommittedChanges(collision.path);
        if (dirty) {
          const display = yield* Display;
          yield* display.status(
            `Reusing worktree at ${collision.path} (branch '${branch}') \u2014 worktree has uncommitted changes`,
            "warn"
          );
        } else {
          yield* fastForwardFromOrigin(collision.path, branch);
        }
        return { path: normalize(collision.path), branch, reused: true };
      }
      yield* Effect_exports.fail(
        new WorktreeError({
          message: `Branch '${branch}' is already checked out in worktree at '${collision.path}'. Arsenal's branch and merge-to-head strategies run the agent in a git worktree under .arsenal/worktrees/, and git refuses to check out the same branch in two worktrees at once (HEAD would become ambiguous). Pick a different branch, or switch the main working tree to a different branch before re-running.`
        })
      );
    }
    yield* execGit(
      [...NO_CONFIG_LOCK_FLAGS, "worktree", "add", worktreePath, branch],
      repoDir
    ).pipe(
      Effect_exports.catchAll((e) => {
        if (e.message.includes("invalid reference")) {
          return execGit(
            [
              ...NO_CONFIG_LOCK_FLAGS,
              "worktree",
              "add",
              "-b",
              branch,
              worktreePath,
              opts?.baseBranch ?? "HEAD"
            ],
            repoDir
          );
        }
        return Effect_exports.fail(e);
      })
    );
  } else {
    yield* execGit(
      [
        ...NO_CONFIG_LOCK_FLAGS,
        "worktree",
        "add",
        "-b",
        branch,
        worktreePath,
        "HEAD"
      ],
      repoDir
    ).pipe(
      Effect_exports.catchAll((e) => {
        if (e.message.includes("already checked out") || e.message.includes("already exists")) {
          return Effect_exports.fail(
            new WorktreeError({
              message: `Branch '${branch}' is already checked out in another worktree. Use a different branch name, or wait for the other run to finish.`
            })
          );
        }
        return Effect_exports.fail(e);
      })
    );
  }
  return { path: worktreePath, branch, reused: false };
}).pipe(
  withTimeout(
    WORKTREE_TIMEOUT_MS,
    () => new WorktreeTimeoutError({
      message: `Worktree creation timed out after ${WORKTREE_TIMEOUT_MS}ms`,
      timeoutMs: WORKTREE_TIMEOUT_MS,
      path: repoDir,
      operation: "create"
    })
  )
);
var hasUncommittedChanges = (worktreePath) => execGit(["status", "--porcelain"], worktreePath).pipe(
  Effect_exports.map((output) => output.trim().length > 0)
);
var remove8 = (worktreePath) => execGit(["worktree", "remove", "--force", worktreePath], worktreePath).pipe(
  Effect_exports.asVoid
);
var pruneStale = (repoDir) => Effect_exports.gen(function* () {
  const fs = yield* FileSystem_exports.FileSystem;
  yield* execGit(["worktree", "prune"], repoDir);
  const worktreesDir = join$1(repoDir, ".arsenal", "worktrees");
  const entries2 = yield* fs.readDirectory(worktreesDir).pipe(
    Effect_exports.map((es) => es),
    Effect_exports.catchSome(
      (e) => e._tag === "SystemError" && e.reason === "NotFound" ? Option_exports.some(Effect_exports.succeed(null)) : Option_exports.none()
    ),
    Effect_exports.mapError((e) => new WorktreeError({ message: e.message }))
  );
  if (entries2 === null) return;
  const realWorktreesDir = yield* fs.realPath(worktreesDir).pipe(Effect_exports.catchAll(() => Effect_exports.succeed(worktreesDir)));
  const worktreeList = yield* execGit(
    ["worktree", "list", "--porcelain"],
    repoDir
  );
  const activeWorktreePaths = new Set(
    worktreeList.split("\n").filter((line) => line.startsWith("worktree ")).map((line) => line.slice("worktree ".length).trim())
  );
  for (const entry of entries2) {
    const entryPath = join$1(realWorktreesDir, entry);
    const isDir = yield* fs.stat(entryPath).pipe(
      Effect_exports.map((s) => s.type === "Directory"),
      Effect_exports.catchAll(() => Effect_exports.succeed(false))
    );
    if (isDir && isOrphanedWorktreePath(entryPath, activeWorktreePaths)) {
      yield* fs.remove(entryPath, { recursive: true, force: true }).pipe(
        Effect_exports.mapError(
          (e) => new WorktreeError({
            message: `Failed to remove ${entryPath}: ${e.message}`
          })
        )
      );
    }
  }
}).pipe(
  withTimeout(
    WORKTREE_TIMEOUT_MS,
    () => new WorktreeTimeoutError({
      message: `Worktree prune timed out after ${WORKTREE_TIMEOUT_MS}ms`,
      timeoutMs: WORKTREE_TIMEOUT_MS,
      path: repoDir,
      operation: "prune"
    })
  )
);
var COPY_TO_WORKTREE_TIMEOUT_MS = 6e4;
var getCopyOnWriteFlags = (platform) => platform === "darwin" ? ["-cR"] : ["-R", "--reflink=auto"];
var isWithin = (parent, child) => {
  const rel = relative(parent, child);
  return rel === "" || !rel.startsWith("..") && !isAbsolute(rel);
};
var copyToWorktree = (paths, hostRepoDir, worktreePath, timeoutMs) => {
  const effectiveTimeout = timeoutMs ?? COPY_TO_WORKTREE_TIMEOUT_MS;
  return Effect_exports.gen(function* () {
    const host = yield* HostProcess;
    const cowFlags = getCopyOnWriteFlags(host.platform);
    const controller = new AbortController();
    const copyResults = yield* Effect_exports.all(
      paths.flatMap((relativePath) => {
        const src = join$1(hostRepoDir, relativePath);
        const dest = join$1(worktreePath, relativePath);
        if (!isWithin(hostRepoDir, src) || !isWithin(worktreePath, dest)) {
          return [
            Effect_exports.fail(
              new CopyToWorktreeError({
                message: `Refusing to copy '${relativePath}': resolves outside the worktree`,
                path: relativePath,
                stderr: "",
                exitCode: null
              })
            ).pipe(Effect_exports.either)
          ];
        }
        if (!existsSync(src)) {
          return [];
        }
        const runOpts = { signal: controller.signal };
        return [
          // Replace the destination outright rather than `cp`-ing into it:
          // `cp -R src dest` nests as dest/<basename(src)> when dest already
          // exists, so clear it first and recreate its parent directory
          // (paths can be nested under a directory the checkout doesn't have
          // yet) so `cp` always creates `dest` fresh as an exact copy of `src`.
          host.run("rm", ["-rf", dest], runOpts).pipe(
            Effect_exports.andThen(
              () => host.run("mkdir", ["-p", dirname(dest)], runOpts)
            ),
            Effect_exports.andThen(
              () => host.run("cp", [...cowFlags, src, dest], runOpts).pipe(
                Effect_exports.catchAll(
                  () => host.run("cp", ["-R", src, dest], runOpts)
                )
              )
            ),
            Effect_exports.mapError(
              (error) => new CopyToWorktreeError({
                message: `Failed to copy ${relativePath} to worktree: ${error.stderr || error.message}`,
                path: relativePath,
                stderr: error.stderr || error.message,
                exitCode: error.exitCode
              })
            ),
            Effect_exports.either
          )
        ];
      }),
      { concurrency: "unbounded" }
    ).pipe(Effect_exports.onInterrupt(() => Effect_exports.sync(() => controller.abort())));
    for (const result of copyResults) {
      if (result._tag === "Left") {
        yield* Effect_exports.fail(result.left);
      }
    }
  }).pipe(
    withTimeout(
      effectiveTimeout,
      () => new CopyToWorktreeTimeoutError({
        message: `Copying files to worktree timed out after ${effectiveTimeout}ms`,
        timeoutMs: effectiveTimeout,
        paths
      })
    )
  );
};

// src/ports/runEffect.ts
var runPromiseUnwrapped = async (effect3) => {
  const exit4 = await Effect_exports.runPromiseExit(effect3);
  if (Exit_exports.isSuccess(exit4)) return exit4.value;
  throw Cause_exports.squash(exit4.cause);
};

// src/ports/SandboxOps.ts
var toSandboxCommands = (sandbox3) => ({
  exec: (command, options) => runPromiseUnwrapped(sandbox3.exec(command, options)),
  ...sandbox3.interactiveExec ? { interactiveExec: sandbox3.interactiveExec } : {},
  copyIn: (hostPath, sandboxPath) => runPromiseUnwrapped(sandbox3.copyIn(hostPath, sandboxPath)),
  copyFileOut: (sandboxPath, hostPath) => runPromiseUnwrapped(sandbox3.copyFileOut(sandboxPath, hostPath))
});
var toError = (e) => e instanceof Error ? e.message : String(e);
var fromSandboxCommands = (commands) => ({
  exec: (command, options) => Effect_exports.tryPromise({
    try: () => commands.exec(command, options),
    catch: (e) => e instanceof ExecError ? e : new ExecError({ command, message: `exec failed: ${toError(e)}` })
  }),
  ...commands.interactiveExec ? { interactiveExec: commands.interactiveExec } : {},
  copyIn: (hostPath, sandboxPath) => Effect_exports.tryPromise({
    try: () => commands.copyIn(hostPath, sandboxPath),
    catch: (e) => e instanceof CopyError ? e : new CopyError({ message: `copyIn failed: ${toError(e)}` })
  }),
  copyFileOut: (sandboxPath, hostPath) => Effect_exports.tryPromise({
    try: () => commands.copyFileOut(sandboxPath, hostPath),
    catch: (e) => e instanceof CopyError ? e : new CopyError({ message: `copyFileOut failed: ${toError(e)}` })
  })
});
var sandboxExecutor = (sandbox3) => ({
  exec: sandbox3.exec,
  ...sandbox3.interactiveExec ? { interactiveExec: sandbox3.interactiveExec } : {}
});
var makeSandboxFromHandle = (handle) => ({
  ...handle.interactiveExec ? { interactiveExec: handle.interactiveExec.bind(handle) } : {},
  exec: (command, options) => Effect_exports.tryPromise({
    try: () => handle.exec(command, options),
    catch: (e) => new ExecError({
      command,
      message: `exec failed: ${e instanceof Error ? e.message : String(e)}`
    })
  }),
  copyIn: (hostPath, sandboxPath) => handle.transfer ? Effect_exports.tryPromise({
    try: () => handle.transfer.copyIn(hostPath, sandboxPath),
    catch: (e) => new CopyError({
      message: `copyIn failed: ${e instanceof Error ? e.message : String(e)}`
    })
  }) : Effect_exports.fail(
    new CopyError({
      message: "copyIn is not supported for this sandbox provider"
    })
  ),
  copyFileOut: (sandboxPath, hostPath) => handle.transfer ? Effect_exports.tryPromise({
    try: () => handle.transfer.copyFileOut(sandboxPath, hostPath),
    catch: (e) => new CopyError({
      message: `copyFileOut failed: ${e instanceof Error ? e.message : String(e)}`
    })
  }) : Effect_exports.fail(
    new CopyError({
      message: "copyFileOut is not supported for this sandbox provider"
    })
  )
});
var execOk = (sandbox3, command, options) => Effect_exports.flatMap(
  sandbox3.exec(command, options),
  (result) => result.exitCode !== 0 ? Effect_exports.fail(
    new ExecError({
      command,
      exitCode: result.exitCode,
      message: `Command failed (exit ${result.exitCode}): ${command}
${result.stderr}`
    })
  ) : Effect_exports.succeed(result)
);

// src/application/sandbox/lifecycle/hooks.ts
var HOOK_TIMEOUT_MS = 6e4;
var runHostHooks = (hooks, cwd, signal) => Effect_exports.gen(function* () {
  const host = yield* HostProcess;
  for (const hook of hooks) {
    const timeout4 = hook.timeoutMs ?? HOOK_TIMEOUT_MS;
    const hookController = new AbortController();
    const forwardAbort = () => hookController.abort(signal?.reason);
    if (signal) {
      if (signal.aborted) hookController.abort(signal.reason);
      else signal.addEventListener("abort", forwardAbort, { once: true });
    }
    yield* host.shell(hook.command, { cwd, signal: hookController.signal }).pipe(
      // Attached to the innermost effect (before withTimeout races it) so
      // it's this fiber's own finalizer that runs when withTimeout
      // interrupts it on timeout, not a no-op wrapping the race itself.
      Effect_exports.onInterrupt(() => Effect_exports.sync(() => hookController.abort())),
      Effect_exports.mapError(
        (err) => new ExecError({
          command: hook.command,
          message: `Host hook failed: ${hook.command}
${err.message}`
        })
      ),
      withTimeout(
        timeout4,
        () => new HookTimeoutError({
          message: `Host hook '${hook.command}' timed out after ${timeout4}ms`,
          timeoutMs: timeout4,
          command: hook.command
        })
      ),
      Effect_exports.ensuring(
        Effect_exports.sync(
          () => signal?.removeEventListener("abort", forwardAbort)
        )
      )
    );
  }
});
var runSandboxHooksWithAbort = (sandbox3, sandboxRepoDir, hooks, signal) => Effect_exports.gen(function* () {
  const abortDeferred = yield* Deferred_exports.make();
  let abortCleanup = null;
  if (signal.aborted) {
    yield* Deferred_exports.fail(
      abortDeferred,
      new ExecError({
        command: "abort",
        message: `Aborted: ${signal.reason}`
      })
    );
  } else {
    const onAbort = () => {
      Effect_exports.runPromise(
        Deferred_exports.fail(
          abortDeferred,
          new ExecError({
            command: "abort",
            message: `Aborted: ${signal.reason}`
          })
        )
      ).catch(() => {
      });
    };
    signal.addEventListener("abort", onAbort, { once: true });
    abortCleanup = () => signal.removeEventListener("abort", onAbort);
  }
  const hookEffects = hooks.map((hook) => {
    const timeout4 = hook.timeoutMs ?? HOOK_TIMEOUT_MS;
    return Effect_exports.raceFirst(
      execOk(sandbox3, hook.command, {
        cwd: sandboxRepoDir,
        sudo: hook.sudo
      }).pipe(
        withTimeout(
          timeout4,
          () => new HookTimeoutError({
            message: `Hook '${hook.command}' timed out after ${timeout4}ms`,
            timeoutMs: timeout4,
            command: hook.command
          })
        )
      ),
      Deferred_exports.await(abortDeferred)
    );
  });
  yield* (hookEffects.length > 0 ? Effect_exports.all(hookEffects, { concurrency: "unbounded" }) : Effect_exports.void).pipe(Effect_exports.ensuring(Effect_exports.sync(() => abortCleanup?.())));
});

// src/spi/SandboxProvider.ts
var requireTransfer = (handle, context7) => {
  if (!handle.transfer) {
    throw new Error(
      `${context7}: sandbox handle has no \`transfer\` implementation. Isolated providers must implement \`transfer.copyIn\`/\`copyFileOut\` in their \`create\` function \u2014 see IsolatedSandboxProviderConfig.create.`
    );
  }
  return handle.transfer;
};
var createBindMountSandboxProvider = (config) => ({
  tag: "bind-mount",
  name: config.name,
  env: config.env ?? {},
  sandboxHomedir: config.sandboxHomedir,
  create: config.create
});
var createIsolatedSandboxProvider = (config) => ({
  tag: "isolated",
  name: config.name,
  env: config.env ?? {},
  create: config.create
});

// src/application/sync/syncExec.ts
var execHost = (command, cwd) => Effect_exports.flatMap(HostProcess, (host) => {
  const controller = new AbortController();
  return host.shell(command, {
    cwd,
    maxBuffer: 10 * 1024 * 1024,
    signal: controller.signal
  }).pipe(
    Effect_exports.map(({ stdout }) => stdout),
    Effect_exports.mapError(
      (e) => new SyncError({
        message: `Host command failed: ${command}
${e.message}`
      })
    ),
    Effect_exports.onInterrupt(() => Effect_exports.sync(() => controller.abort()))
  );
});
var execHandleOk = (handle, command, options) => Effect_exports.tryPromise({
  try: () => handle.exec(command, options),
  catch: (e) => new SyncError({
    message: `Sandbox exec failed: ${command}
${e instanceof Error ? e.message : String(e)}`
  })
}).pipe(
  Effect_exports.flatMap(
    (result) => result.exitCode !== 0 ? Effect_exports.fail(
      new SyncError({
        message: `Sandbox command failed (exit ${result.exitCode}): ${command}
${result.stderr}`
      })
    ) : Effect_exports.succeed(result)
  )
);

// src/application/sync/syncIn.ts
var syncIn = (hostRepoDir, handle) => Effect_exports.gen(function* () {
  const branch = (yield* execHost(
    "git rev-parse --abbrev-ref HEAD",
    hostRepoDir
  )).trim();
  const bundleDir = yield* Effect_exports.tryPromise({
    try: () => mkdtemp(join$1(tmpdir(), "arsenal-bundle-")),
    catch: (e) => new SyncError({
      message: `Failed to create temp dir: ${e instanceof Error ? e.message : String(e)}`
    })
  });
  const bundleHostPath = join$1(bundleDir, "repo.bundle");
  yield* Effect_exports.ensuring(
    Effect_exports.gen(function* () {
      yield* execHost(
        `git bundle create "${bundleHostPath}" --all`,
        hostRepoDir
      );
      const mkTempResult = yield* execHandleOk(
        handle,
        "mktemp -d -t arsenal-XXXXXX"
      );
      const sandboxTmpDir = mkTempResult.stdout.trim();
      const bundleSandboxPath = `${sandboxTmpDir}/repo.bundle`;
      yield* Effect_exports.tryPromise({
        // `transfer` is guaranteed present — syncIn is only ever called
        // with an isolated provider's handle.
        try: () => handle.transfer.copyIn(bundleHostPath, bundleSandboxPath),
        catch: (e) => new SyncError({
          message: `Failed to copy bundle into sandbox: ${e instanceof Error ? e.message : String(e)}`
        })
      });
      const worktreePath = handle.worktreePath;
      yield* execHandleOk(
        handle,
        `git clone "${bundleSandboxPath}" "${worktreePath}_clone"`
      );
      yield* execHandleOk(
        handle,
        `rm -rf "${worktreePath}" && mv "${worktreePath}_clone" "${worktreePath}"`
      );
      yield* execHandleOk(handle, `git checkout "${branch}"`, {
        cwd: worktreePath
      });
      yield* Effect_exports.tryPromise({
        try: () => handle.exec(`rm -rf "${sandboxTmpDir}"`),
        catch: () => new SyncError({ message: "Failed to clean up sandbox temp dir" })
      });
      const hostHead = (yield* execHost(
        "git rev-parse HEAD",
        hostRepoDir
      )).trim();
      const sandboxHead = (yield* execHandleOk(handle, "git rev-parse HEAD", {
        cwd: worktreePath
      })).stdout.trim();
      if (hostHead !== sandboxHead) {
        yield* Effect_exports.fail(
          new SyncError({
            message: `HEAD mismatch after sync-in: host=${hostHead} sandbox=${sandboxHead}`
          })
        );
      }
    }),
    // Clean up host-side bundle temp dir (runs regardless of success/failure)
    Effect_exports.promise(() => rm(bundleDir, { recursive: true, force: true }))
  );
  return { branch };
});
var PARENT_GIT_SANDBOX_DIR = "/.arsenal-parent-git";
var SANDBOX_REPO_DIR = "/home/agent/workspace";
var normalizeMounts = (mounts, worktreeHostPath, sandboxRepoDir, platform = process.platform) => {
  if (platform !== "win32") return mounts;
  const normalizedWorktree = worktreeHostPath.replace(/\\/g, "/");
  return mounts.map((m) => {
    const hostPath = m.hostPath.replace(/\\/g, "/");
    let sandboxPath = m.sandboxPath;
    if (/^[A-Za-z]:[/\\]/.test(sandboxPath) || sandboxPath.includes("\\")) {
      const normalizedSandboxPath = sandboxPath.replace(/\\/g, "/");
      if (normalizedSandboxPath.startsWith(normalizedWorktree + "/")) {
        const relativeSuffix = normalizedSandboxPath.slice(
          normalizedWorktree.length
        );
        sandboxPath = sandboxRepoDir + relativeSuffix;
      } else if (normalizedSandboxPath === normalizedWorktree) {
        sandboxPath = sandboxRepoDir;
      } else {
        sandboxPath = normalizedSandboxPath;
      }
    }
    return { ...m, hostPath, sandboxPath };
  });
};
var parseGitdirPath = (gitdirPath) => {
  const normalized = gitdirPath.replace(/\\/g, "/").replace(/\/+$/, "");
  const segments = normalized.split("/");
  const worktreeName = segments.pop();
  segments.pop();
  const parentGitDir = segments.join("/");
  return { worktreeName, parentGitDir };
};
var patchGitMountsForWindows = (gitMounts, worktreeHostPath, sandboxRepoDir, readFile3, statFile, platform = process.platform) => Effect_exports.gen(function* () {
  if (platform !== "win32") return gitMounts;
  const _readFile = (async (p) => {
    const { readFile: rf } = await import('fs/promises');
    return rf(p, "utf-8");
  });
  const _statFile = (async (p) => {
    const { stat: stat3 } = await import('fs/promises');
    const s = await stat3(p);
    return s.isDirectory() ? "directory" : "file";
  });
  const gitEntryPath = join$1(worktreeHostPath, ".git");
  const gitEntryType = yield* Effect_exports.tryPromise({
    try: () => _statFile(gitEntryPath),
    catch: () => null
  }).pipe(Effect_exports.catchAll(() => Effect_exports.succeed(null)));
  if (gitEntryType === null) return gitMounts;
  if (gitEntryType === "directory") return gitMounts;
  const content = yield* Effect_exports.tryPromise({
    try: () => _readFile(gitEntryPath),
    catch: () => null
  }).pipe(
    Effect_exports.map((s) => s.trim()),
    Effect_exports.catchAll(() => Effect_exports.succeed(null))
  );
  if (content === null) return gitMounts;
  const match19 = content.match(/^gitdir:\s*(.+)$/);
  if (!match19) return gitMounts;
  const gitdirPath = match19[1];
  const { parentGitDir, worktreeName } = parseGitdirPath(gitdirPath);
  const correctedGitdir = `${PARENT_GIT_SANDBOX_DIR}/worktrees/${worktreeName}`;
  const tempDir = yield* Effect_exports.tryPromise({
    try: () => mkdtemp(join$1(tmpdir(), "arsenal-git-")),
    catch: (e) => new WorktreeError({
      message: `Failed to create temp dir for git override: ${e instanceof Error ? e.message : String(e)}`
    })
  });
  const tempGitFile = join$1(tempDir, "git-override");
  yield* Effect_exports.tryPromise({
    try: () => writeFile(tempGitFile, `gitdir: ${correctedGitdir}
`),
    catch: (e) => new WorktreeError({
      message: `Failed to write git override file: ${e instanceof Error ? e.message : String(e)}`
    })
  });
  const normalizedParentGitDir = parentGitDir.replace(/\\/g, "/");
  const gitFileHostPath = gitEntryPath.replace(/\\/g, "/");
  const correctedMounts = [];
  let replacedGitFile = false;
  for (const m of gitMounts) {
    const normalizedHostPath = m.hostPath.replace(/\\/g, "/");
    if (normalizedHostPath === normalizedParentGitDir) {
      correctedMounts.push({ ...m, sandboxPath: PARENT_GIT_SANDBOX_DIR });
    } else if (normalizedHostPath === gitFileHostPath) {
      correctedMounts.push({
        ...m,
        hostPath: tempGitFile,
        sandboxPath: `${sandboxRepoDir}/.git`
      });
      replacedGitFile = true;
    } else {
      correctedMounts.push(m);
    }
  }
  if (!replacedGitFile) {
    correctedMounts.push({
      hostPath: tempGitFile,
      sandboxPath: `${sandboxRepoDir}/.git`
    });
  }
  return correctedMounts;
});

// src/application/sandbox/lifecycle/launchSandboxHandle.ts
var CONTAINER_START_TIMEOUT_MS = 12e4;
var SYNC_IN_TIMEOUT_MS = 12e4;
var COPY_PATHS_TIMEOUT_MS = 12e4;
var launchSandboxHandle = (options) => {
  if (options.provider.tag === "bind-mount") {
    return startBindMountSandbox(options);
  }
  if (options.provider.tag === "none") {
    return startNoSandbox(options);
  }
  return startIsolatedSandbox(options);
};
var startNoSandbox = (options) => Effect_exports.tryPromise({
  try: () => options.provider.create({
    worktreePath: options.worktreeOrRepoPath,
    env: options.env
  }),
  catch: (e) => new WorktreeError({
    message: `Provider '${options.provider.name}' create failed: ${e instanceof Error ? e.message : String(e)}`
  })
}).pipe(
  Effect_exports.map((handle) => ({
    handle,
    sandbox: makeSandboxFromHandle(handle),
    worktreePath: handle.worktreePath
  }))
);
var startBindMountSandbox = (options) => Effect_exports.tryPromise({
  try: () => {
    const rawMounts = [
      {
        hostPath: options.worktreeOrRepoPath,
        sandboxPath: options.repoDir
      },
      ...options.gitMounts
    ];
    const mounts = normalizeMounts(
      rawMounts,
      options.worktreeOrRepoPath,
      SANDBOX_REPO_DIR
    );
    const worktreePath = process.platform === "win32" ? options.worktreeOrRepoPath.replace(/\\/g, "/") : options.worktreeOrRepoPath;
    return options.provider.create({
      worktreePath,
      hostRepoPath: options.hostRepoDir,
      mounts,
      env: options.env
    });
  },
  catch: (e) => new WorktreeError({
    message: `Provider '${options.provider.name}' create failed: ${e instanceof Error ? e.message : String(e)}`
  })
}).pipe(
  Effect_exports.map((handle) => ({
    handle,
    sandbox: makeSandboxFromHandle(handle),
    worktreePath: handle.worktreePath
  })),
  withTimeout(
    CONTAINER_START_TIMEOUT_MS,
    () => new ContainerStartTimeoutError({
      message: `Sandbox container start timed out after ${CONTAINER_START_TIMEOUT_MS}ms`,
      timeoutMs: CONTAINER_START_TIMEOUT_MS
    })
  )
);
var startIsolatedSandbox = (options) => Effect_exports.gen(function* () {
  const handle = yield* Effect_exports.tryPromise({
    try: () => options.provider.create({ env: options.env }),
    catch: (e) => new WorktreeError({
      message: `Isolated provider '${options.provider.name}' setup failed: ${e instanceof Error ? e.message : String(e)}`
    })
  }).pipe(
    withTimeout(
      CONTAINER_START_TIMEOUT_MS,
      () => new ContainerStartTimeoutError({
        message: `Isolated sandbox container start timed out after ${CONTAINER_START_TIMEOUT_MS}ms`,
        timeoutMs: CONTAINER_START_TIMEOUT_MS
      })
    )
  );
  yield* syncIn(options.hostRepoDir, handle).pipe(
    withTimeout(
      SYNC_IN_TIMEOUT_MS,
      () => new SyncInTimeoutError({
        message: `Sync-in timed out after ${SYNC_IN_TIMEOUT_MS}ms`,
        timeoutMs: SYNC_IN_TIMEOUT_MS
      })
    )
  );
  if (options.copyPaths && options.copyPaths.length > 0) {
    const pathsToCopy = options.copyPaths;
    yield* Effect_exports.gen(function* () {
      for (const relativePath of pathsToCopy) {
        const hostPath = join$1(options.hostRepoDir, relativePath);
        if (!existsSync(hostPath)) {
          continue;
        }
        const sandboxPath = posix.join(handle.worktreePath, relativePath);
        yield* Effect_exports.tryPromise({
          try: () => requireTransfer(handle, "copyPaths").copyIn(
            hostPath,
            sandboxPath
          ),
          catch: (e) => new WorktreeError({
            message: `Failed to copy ${relativePath} into sandbox: ${e instanceof Error ? e.message : String(e)}`
          })
        });
      }
    }).pipe(
      withTimeout(
        COPY_PATHS_TIMEOUT_MS,
        () => new CopyToWorktreeTimeoutError({
          message: `Copying paths to worktree timed out after ${COPY_PATHS_TIMEOUT_MS}ms`,
          timeoutMs: COPY_PATHS_TIMEOUT_MS,
          paths: pathsToCopy
        })
      )
    );
  }
  return {
    handle,
    sandbox: makeSandboxFromHandle(handle),
    worktreePath: handle.worktreePath
  };
});

// src/application/sync/RecoveryMessage.ts
var buildRecoveryMessage = (input) => {
  const { patchDir, failedStep, hasCommits, hasDiff, hasUntracked, branch } = input;
  const cmdPatchDir = branch ? `../../${patchDir}` : patchDir;
  const steps = [];
  if (hasCommits)
    steps.push({ key: "commits", label: "committed changes", has: true });
  if (hasDiff)
    steps.push({ key: "diff", label: "uncommitted changes", has: true });
  if (hasUntracked)
    steps.push({ key: "untracked", label: "untracked files", has: true });
  const failedIndex = steps.findIndex((s) => s.key === failedStep);
  const failedStepInfo = steps[failedIndex];
  const stepNumber = failedIndex + 1;
  const lines = [];
  lines.push(
    `Patch application failed at step ${stepNumber} (${failedStepInfo.label}).`
  );
  lines.push("");
  if (branch) {
    lines.push("Set up worktree, then resolve:");
    lines.push(
      formatCommandBlock([
        `git worktree add .arsenal/worktree ${branch}`,
        `cd .arsenal/worktree`
      ])
    );
    lines.push("");
  }
  if (failedStep === "commits") {
    lines.push("Resolve conflicts, then continue with:");
    lines.push(`  git am --continue`);
    const remaining = buildRemainingCommands(
      cmdPatchDir,
      steps.slice(failedIndex + 1)
    );
    if (remaining.length > 0) {
      lines.push("");
      lines.push("After all commits are applied, run the remaining steps:");
      lines.push(formatCommandBlock(remaining));
    }
  } else {
    const remaining = buildRemainingCommands(
      cmdPatchDir,
      steps.slice(failedIndex)
    );
    if (remaining.length > 0) {
      lines.push("Run the remaining steps:");
      lines.push(formatCommandBlock(remaining));
    }
  }
  return lines.join("\n");
};
var buildRemainingCommands = (patchDir, steps) => {
  const commands = [];
  for (const step4 of steps) {
    if (!step4.has) continue;
    if (step4.key === "commits") {
      commands.push(`git am --3way ${patchDir}/*.patch`);
    } else if (step4.key === "diff") {
      commands.push(`git apply ${patchDir}/changes.patch`);
    } else if (step4.key === "untracked") {
      commands.push(`cp -r ${patchDir}/untracked/* .`);
    }
  }
  return commands;
};
var formatCommandBlock = (commands) => {
  if (commands.length === 1) {
    return `  ${commands[0]}`;
  }
  return commands.map((cmd, i) => i < commands.length - 1 ? `  ${cmd} && \\` : `  ${cmd}`).join("\n");
};

// src/application/sync/syncOut.ts
var SYNC_BASE_REF = "refs/arsenal/sync-base";
var execSandbox = (handle, command, options) => Effect_exports.tryPromise({
  try: () => handle.exec(command, options),
  catch: (e) => new SyncError({
    message: `Sandbox exec failed: ${command}
${e instanceof Error ? e.message : String(e)}`
  })
});
var isEmptyPatch = (patchPath) => Effect_exports.tryPromise({
  try: async () => {
    const info = await stat(patchPath);
    if (info.size === 0) return true;
    const content = await readFile(patchPath, "utf-8");
    return !content.includes("diff --git");
  },
  catch: (e) => new SyncError({
    message: `Failed to check patch ${patchPath}: ${e instanceof Error ? e.message : String(e)}`
  })
});
var createPatchDir = (hostRepoDir) => Effect_exports.tryPromise({
  try: async () => {
    const now = /* @__PURE__ */ new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const base = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const patchesRoot = join$1(hostRepoDir, ".arsenal", "patches");
    await mkdir(patchesRoot, { recursive: true });
    let dirName = base;
    let counter6 = 0;
    while (existsSync(join$1(patchesRoot, dirName))) {
      counter6++;
      dirName = `${base}-${counter6}`;
    }
    const patchDir = join$1(patchesRoot, dirName);
    await mkdir(patchDir, { recursive: true });
    return patchDir;
  },
  catch: (e) => new SyncError({
    message: `Failed to create patch directory: ${e instanceof Error ? e.message : String(e)}`
  })
});
var countCommitsToSync = (sandbox3, cwd, hostHead) => Effect_exports.gen(function* () {
  const baseResult = yield* sandbox3.exec(`git rev-parse --verify --quiet ${SYNC_BASE_REF}`, { cwd }).pipe(
    Effect_exports.catchAll(
      () => Effect_exports.succeed({
        stdout: "",
        stderr: "",
        exitCode: 1
      })
    )
  );
  const base = baseResult.exitCode === 0 && baseResult.stdout.trim().length > 0 ? baseResult.stdout.trim() : hostHead;
  const countResult = yield* sandbox3.exec(`git rev-list "${base}..HEAD" --count`, { cwd }).pipe(
    Effect_exports.catchAll(
      () => Effect_exports.succeed({
        stdout: "0",
        stderr: "",
        exitCode: 1
      })
    )
  );
  if (countResult.exitCode !== 0) return 0;
  const parsed = parseInt(countResult.stdout.trim(), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
});
var syncOut = (hostRepoDir, handle) => Effect_exports.gen(function* () {
  const worktreePath = handle.worktreePath;
  const hostHead = (yield* execHost(
    "git rev-parse HEAD",
    hostRepoDir
  )).trim();
  const sandboxHead = (yield* execHandleOk(handle, "git rev-parse HEAD", {
    cwd: worktreePath
  })).stdout.trim();
  const baseRefResult = yield* execSandbox(
    handle,
    `git rev-parse --verify --quiet ${SYNC_BASE_REF}`,
    { cwd: worktreePath }
  );
  const base = baseRefResult.exitCode === 0 && baseRefResult.stdout.trim().length > 0 ? baseRefResult.stdout.trim() : hostHead;
  const hasCommits = base !== sandboxHead;
  const diffResult = yield* execSandbox(handle, "git diff HEAD", {
    cwd: worktreePath
  });
  const hasDiff = diffResult.exitCode === 0 && diffResult.stdout.trim().length > 0;
  const lsFilesResult = yield* execSandbox(
    handle,
    "git ls-files --others --exclude-standard",
    { cwd: worktreePath }
  );
  const hasUntracked = lsFilesResult.exitCode === 0 && lsFilesResult.stdout.trim().length > 0;
  const untrackedFiles = hasUntracked ? lsFilesResult.stdout.trim().split("\n").filter((f) => f.length > 0) : [];
  if (!hasCommits && !hasDiff && !hasUntracked) {
    return {};
  }
  const patchDir = yield* createPatchDir(hostRepoDir);
  const relativePatchDir = join$1(".arsenal", "patches", basename(patchDir));
  const nonEmptyPatches = [];
  if (hasCommits) {
    const mkTempResult = yield* execHandleOk(
      handle,
      "mktemp -d -t arsenal-patches-XXXXXX"
    );
    const sandboxPatchDir = mkTempResult.stdout.trim();
    try {
      yield* execHandleOk(
        handle,
        `git format-patch "${base}..HEAD" -o "${sandboxPatchDir}"`,
        { cwd: worktreePath }
      );
      const lsResult = yield* execHandleOk(
        handle,
        `ls -1 "${sandboxPatchDir}"`
      );
      const patchNames = lsResult.stdout.trim().split("\n").filter((name) => name.length > 0);
      for (const patchName of patchNames) {
        const sandboxPatchPath = `${sandboxPatchDir}/${patchName}`;
        const hostPatchPath = join$1(patchDir, patchName);
        yield* Effect_exports.tryPromise({
          try: () => requireTransfer(handle, "syncOut").copyFileOut(
            sandboxPatchPath,
            hostPatchPath
          ),
          catch: (e) => new SyncError({
            message: `Failed to copy patch ${patchName}: ${e instanceof Error ? e.message : String(e)}`
          })
        });
        if (!(yield* isEmptyPatch(hostPatchPath))) {
          nonEmptyPatches.push(hostPatchPath);
        }
      }
    } finally {
      yield* execSandbox(handle, `rm -rf "${sandboxPatchDir}"`);
    }
  }
  if (hasDiff) {
    const diffPath = join$1(patchDir, "changes.patch");
    yield* Effect_exports.tryPromise({
      try: () => writeFile(diffPath, diffResult.stdout),
      catch: (e) => new SyncError({
        message: `Failed to write diff patch: ${e instanceof Error ? e.message : String(e)}`
      })
    });
  }
  if (hasUntracked) {
    const untrackedDir = join$1(patchDir, "untracked");
    for (const relPath of untrackedFiles) {
      const sandboxFilePath = `${worktreePath}/${relPath}`;
      const hostFilePath = join$1(untrackedDir, relPath);
      yield* Effect_exports.tryPromise({
        try: async () => {
          await mkdir(dirname(hostFilePath), { recursive: true });
          await requireTransfer(handle, "syncOut").copyFileOut(
            sandboxFilePath,
            hostFilePath
          );
        },
        catch: (e) => new SyncError({
          message: `Failed to save untracked file ${relPath}: ${e instanceof Error ? e.message : String(e)}`
        })
      });
    }
  }
  let failedStep;
  if (nonEmptyPatches.length > 0) {
    yield* Effect_exports.either(
      execHost("git am --abort", hostRepoDir)
    );
    const patchArgs = nonEmptyPatches.map((p) => `"${p}"`).join(" ");
    const applyResult = yield* Effect_exports.either(
      execHost(`git am --3way ${patchArgs}`, hostRepoDir)
    );
    if (applyResult._tag === "Left") {
      failedStep = "commits";
    }
  }
  if (!failedStep && hasDiff) {
    const diffPath = join$1(patchDir, "changes.patch");
    const applyResult = yield* Effect_exports.either(
      execHost(`git apply "${diffPath}"`, hostRepoDir)
    );
    if (applyResult._tag === "Left") {
      failedStep = "diff";
    }
  }
  if (!failedStep && hasUntracked) {
    const copyResult = yield* Effect_exports.either(
      Effect_exports.tryPromise({
        try: async () => {
          const untrackedDir = join$1(patchDir, "untracked");
          for (const relPath of untrackedFiles) {
            const srcPath = join$1(untrackedDir, relPath);
            const destPath = join$1(hostRepoDir, relPath);
            await mkdir(dirname(destPath), { recursive: true });
            const content = await readFile(srcPath);
            await writeFile(destPath, content);
          }
        },
        catch: (e) => new SyncError({
          message: `Failed to copy untracked files: ${e instanceof Error ? e.message : String(e)}`
        })
      })
    );
    if (copyResult._tag === "Left") {
      failedStep = "untracked";
    }
  }
  if (hasCommits && failedStep !== "commits") {
    yield* execHandleOk(
      handle,
      `git update-ref ${SYNC_BASE_REF} ${sandboxHead}`,
      {
        cwd: worktreePath
      }
    );
  }
  if (failedStep) {
    const msg = buildRecoveryMessage({
      patchDir: relativePatchDir,
      failedStep,
      hasCommits: nonEmptyPatches.length > 0,
      hasDiff,
      hasUntracked
    });
    return { recoveryMessage: msg };
  }
  yield* Effect_exports.tryPromise({
    try: async () => {
      await rm(patchDir, { recursive: true, force: true });
      const patchesRoot = join$1(hostRepoDir, ".arsenal", "patches");
      try {
        const remaining = await readdir(patchesRoot);
        if (remaining.length === 0) {
          await rm(patchesRoot, {
            recursive: true,
            force: true
          });
        }
      } catch {
      }
    },
    catch: () => new SyncError({ message: "Failed to clean up patch directory" })
  });
  return {};
});

// src/application/sandbox/lifecycle/sandboxAlerts.ts
var alertWorktreePreserved = (worktreePath, reason) => Effect_exports.flatMap(
  Display,
  (display) => display.alert(
    [
      `
${reason}`,
      `  To review: cd ${worktreePath}`,
      `  To clean up: git worktree remove --force ${worktreePath}`
    ].join("\n")
  )
);
var alertSyncOutRecovery = ({
  recoveryMessage
}) => recoveryMessage === void 0 ? Effect_exports.void : Effect_exports.flatMap(
  Display,
  (display) => display.alert(`
${recoveryMessage}`)
);
var attachPreservedPath = (path3, e) => {
  if (path3 !== void 0) {
    if (e instanceof AgentIdleTimeoutError) {
      return new AgentIdleTimeoutError({
        message: e.message,
        timeoutMs: e.timeoutMs,
        preservedWorktreePath: path3
      });
    }
    if (e instanceof AgentError) {
      return new AgentError({
        message: e.message,
        preservedWorktreePath: path3
      });
    }
  }
  return e;
};

// src/application/sandbox/lifecycle/SandboxFactory.ts
var assertNever = (x) => {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`);
};
var SandboxFactory = class extends Context_exports.Tag("SandboxFactory")() {
};
var SandboxConfig = class extends Context_exports.Tag("SandboxConfig")() {
};
var cleanupWorktree = (worktreePath, exit4) => Effect_exports.gen(function* () {
  const isDirty = yield* hasUncommittedChanges(
    worktreePath
  ).pipe(Effect_exports.catchAll(() => Effect_exports.succeed(false)));
  if (isDirty) {
    yield* alertWorktreePreserved(
      worktreePath,
      Exit_exports.isSuccess(exit4) ? `Run succeeded but worktree has uncommitted changes at ${worktreePath}` : `Worktree preserved at ${worktreePath}`
    );
    return worktreePath;
  }
  if (!Exit_exports.isSuccess(exit4)) {
    const display = yield* Display;
    yield* display.alert(`
Worktree removed (no uncommitted changes)`);
  }
  yield* remove8(worktreePath);
  return void 0;
});
var resolveGitMounts = (gitPath) => Effect_exports.gen(function* () {
  const fs = yield* FileSystem_exports.FileSystem;
  const stat3 = yield* fs.stat(gitPath);
  if (stat3.type === "Directory") {
    return [{ hostPath: gitPath, sandboxPath: gitPath }];
  }
  const content = (yield* fs.readFileString(gitPath)).trim();
  const match19 = content.match(/^gitdir:\s*(.+)$/);
  if (!match19) {
    return [{ hostPath: gitPath, sandboxPath: gitPath }];
  }
  const gitdirPath = match19[1];
  const { parentGitDir } = parseGitdirPath(gitdirPath);
  return [
    { hostPath: gitPath, sandboxPath: gitPath },
    { hostPath: parentGitDir, sandboxPath: parentGitDir }
  ];
});
var resolveAndPatchGitMounts = (hostRepoDir, targetPath) => resolveGitMounts(join$1(hostRepoDir, ".git")).pipe(
  Effect_exports.mapError(
    (e) => new WorktreeError({
      message: `Failed to resolve git mounts: ${e}`
    })
  ),
  Effect_exports.flatMap(
    (gitMounts) => patchGitMountsForWindows(gitMounts, targetPath, SANDBOX_REPO_DIR)
  )
);
var startSandboxAgainstTarget = (options) => Effect_exports.gen(function* () {
  const {
    env,
    hostRepoDir,
    targetPath,
    copyToWorktree: copyPaths,
    sandboxProvider,
    hooks,
    signal,
    timeouts
  } = options;
  const display = yield* Display;
  const host = yield* HostProcess;
  const runOnWorktreeReady = () => hooks?.host?.onWorktreeReady?.length ? runHostHooks(hooks.host.onWorktreeReady, targetPath, signal) : Effect_exports.void;
  const runCopyToWorktree = () => copyPaths && copyPaths.length > 0 ? display.spinner(
    "Copying to worktree",
    copyToWorktree(
      copyPaths,
      hostRepoDir,
      targetPath,
      timeouts?.copyToWorktreeMs
    )
  ) : Effect_exports.succeed(void 0);
  switch (sandboxProvider.tag) {
    // No-sandbox providers: run directly on the host, no container or mounts.
    case "none": {
      yield* runCopyToWorktree();
      yield* runOnWorktreeReady();
      const { sandbox: sandbox3, worktreePath, handle } = yield* launchSandboxHandle({
        provider: sandboxProvider,
        hostRepoDir,
        env,
        worktreeOrRepoPath: targetPath
      });
      return {
        sandboxInfo: {
          hostWorktreePath: targetPath,
          sandboxRepoPath: worktreePath
        },
        sandbox: sandbox3,
        handle
      };
    }
    // Isolated providers sync via git bundle. Note `copyPaths` is threaded
    // into `launchSandboxHandle` here (not applied via `runCopyToWorktree`) —
    // isolated providers copy the whole target into the sandbox via
    // sync-in, so extra paths ride along with that same transfer rather
    // than a separate host-side step.
    case "isolated": {
      yield* runOnWorktreeReady();
      const { sandbox: sandbox3, worktreePath, handle } = yield* launchSandboxHandle({
        provider: sandboxProvider,
        hostRepoDir: targetPath,
        env,
        copyPaths
      });
      return {
        sandboxInfo: {
          hostWorktreePath: targetPath,
          sandboxRepoPath: worktreePath,
          applyToHost: () => syncOut(targetPath, handle).pipe(
            Effect_exports.flatMap(alertSyncOutRecovery),
            Effect_exports.provideService(Display, display),
            Effect_exports.provideService(HostProcess, host)
          )
        },
        sandbox: sandbox3,
        handle
      };
    }
    // Bind-mount provider.
    case "bind-mount": {
      yield* runCopyToWorktree();
      yield* runOnWorktreeReady();
      const gitMounts = yield* resolveAndPatchGitMounts(
        hostRepoDir,
        targetPath
      );
      const { sandbox: sandbox3, worktreePath, handle } = yield* launchSandboxHandle({
        provider: sandboxProvider,
        hostRepoDir,
        env,
        worktreeOrRepoPath: targetPath,
        gitMounts,
        repoDir: SANDBOX_REPO_DIR
      });
      return {
        sandboxInfo: {
          hostWorktreePath: targetPath,
          sandboxRepoPath: worktreePath
        },
        sandbox: sandbox3,
        handle
      };
    }
    default:
      return assertNever(sandboxProvider);
  }
});
var acquireSandbox = (options) => Effect_exports.gen(function* () {
  const {
    env,
    hostRepoDir,
    copyToWorktree: copyToWorktree2,
    name,
    sandboxProvider,
    branchStrategy,
    hooks,
    signal,
    timeouts
  } = options;
  const isHeadMode = branchStrategy.type === "head";
  const branch = branchStrategy.type === "branch" ? branchStrategy.branch : void 0;
  const baseBranch = branchStrategy.type === "branch" ? branchStrategy.baseBranch : void 0;
  const fileSystem = yield* FileSystem_exports.FileSystem;
  const display = yield* Display;
  const host = yield* HostProcess;
  const startAgainst = (targetPath) => provideAcquireDepsLocal(
    startSandboxAgainstTarget({
      env,
      hostRepoDir,
      targetPath,
      copyToWorktree: copyToWorktree2,
      sandboxProvider,
      hooks,
      signal,
      timeouts
    })
  );
  function provideAcquireDepsLocal(effect3) {
    return effect3.pipe(
      Effect_exports.provideService(Display, display),
      Effect_exports.provideService(FileSystem_exports.FileSystem, fileSystem),
      Effect_exports.provideService(HostProcess, host)
    );
  }
  if (isHeadMode) {
    const { sandboxInfo, sandbox: sandbox3, handle } = yield* startAgainst(hostRepoDir);
    return { sandboxInfo, sandbox: sandbox3, handle, worktreeInfo: void 0 };
  }
  const pruneAndCreate = () => pruneStale(hostRepoDir).pipe(
    Effect_exports.catchAll(
      (e) => Effect_exports.flatMap(
        Display,
        (display2) => display2.alert(
          `[arsenal] Warning: failed to prune stale worktrees: ${e.message}`
        )
      )
    ),
    Effect_exports.andThen(
      branch ? create(hostRepoDir, { branch, baseBranch }) : create(hostRepoDir, { name })
    ),
    Effect_exports.provideService(FileSystem_exports.FileSystem, fileSystem)
  );
  let preservedPath;
  return yield* Effect_exports.acquireUseRelease(
    pruneAndCreate(),
    (worktreeInfo) => startAgainst(worktreeInfo.path).pipe(
      Effect_exports.map(({ sandboxInfo, sandbox: sandbox3, handle }) => ({
        sandboxInfo,
        sandbox: sandbox3,
        handle,
        worktreeInfo
      }))
    ),
    (worktreeInfo, exit4) => Exit_exports.isSuccess(exit4) ? Effect_exports.void : cleanupWorktree(worktreeInfo.path, exit4).pipe(
      Effect_exports.tap((p) => {
        preservedPath = p;
      }),
      Effect_exports.asVoid,
      Effect_exports.orDie
    )
  ).pipe(
    Effect_exports.mapError(
      (e) => attachPreservedPath(preservedPath, e)
    )
  );
});
var releaseSandbox = (acquired, exit4 = Exit_exports.succeed(void 0)) => Effect_exports.gen(function* () {
  yield* Effect_exports.tryPromise({
    try: () => acquired.handle.close(),
    catch: () => void 0
  }).pipe(Effect_exports.orDie);
  if (!acquired.worktreeInfo) {
    return { preservedWorktreePath: void 0 };
  }
  const preservedWorktreePath = yield* cleanupWorktree(
    acquired.worktreeInfo.path,
    exit4
  ).pipe(Effect_exports.orDie);
  return { preservedWorktreePath };
});
var WorktreeDockerSandboxFactory = {
  layer: Layer_exports.effect(
    SandboxFactory,
    Effect_exports.gen(function* () {
      const config = yield* SandboxConfig;
      const display = yield* Display;
      const fileSystem = yield* FileSystem_exports.FileSystem;
      const host = yield* HostProcess;
      const provideAcquireDeps = (effect3) => effect3.pipe(
        Effect_exports.provideService(Display, display),
        Effect_exports.provideService(FileSystem_exports.FileSystem, fileSystem),
        Effect_exports.provideService(HostProcess, host)
      );
      return {
        withSandbox: (makeEffect) => {
          let preservedPath;
          return Effect_exports.acquireUseRelease(
            provideAcquireDeps(acquireSandbox(config)),
            (acquired) => makeEffect(
              acquired.sandboxInfo,
              acquired.sandbox
            ),
            (acquired, exit4) => provideAcquireDeps(releaseSandbox(acquired, exit4)).pipe(
              Effect_exports.tap(({ preservedWorktreePath }) => {
                preservedPath = preservedWorktreePath;
              }),
              Effect_exports.asVoid
            )
          ).pipe(
            Effect_exports.map((value) => ({
              value,
              preservedWorktreePath: preservedPath
            })),
            Effect_exports.mapError(
              (e) => attachPreservedPath(preservedPath, e)
            )
          );
        }
      };
    })
  )
};

// src/application/git/GitClient.ts
var GitClient = class extends Context_exports.Tag("GitClient")() {
};
var makeGitClient = (gitExec) => ({
  currentBranch: (cwd) => Effect_exports.promise(async () => {
    const { stdout } = await gitExec("git rev-parse --abbrev-ref HEAD", cwd);
    return stdout.trim();
  }),
  identity: (cwd) => Effect_exports.promise(async () => {
    const [name, email] = await Promise.all([
      gitExec("git config user.name", cwd).then((r) => r.stdout.trim()).catch(() => ""),
      gitExec("git config user.email", cwd).then((r) => r.stdout.trim()).catch(() => "")
    ]);
    return { name, email };
  }),
  revParseHead: (cwd) => Effect_exports.promise(async () => {
    const { stdout } = await gitExec("git rev-parse HEAD", cwd);
    return stdout.trim();
  }),
  hasCommitsInRange: (cwd, range3) => Effect_exports.promise(async () => {
    try {
      const { stdout } = await gitExec(
        `git rev-list "${range3}" --count`,
        cwd
      );
      return parseInt(stdout.trim(), 10) > 0;
    } catch {
      return false;
    }
  }),
  revList: (cwd, range3) => Effect_exports.promise(async () => {
    try {
      const { stdout } = await gitExec(
        `git rev-list "${range3}" --reverse`,
        cwd
      );
      const lines = stdout.trim();
      return lines ? lines.split("\n") : [];
    } catch {
      return [];
    }
  }),
  mergeBranch: (cwd, branch, targetBranchName) => Effect_exports.tryPromise({
    try: async () => {
      try {
        await gitExec(`git merge "${branch}"`, cwd);
      } catch {
        throw new Error(
          `Merge of '${branch}' onto '${targetBranchName}' failed. The temporary branch '${branch}' has been preserved. To retry: git merge ${branch}, then clean up: git branch -D ${branch}`
        );
      }
    },
    catch: (e) => e instanceof Error ? e : new Error(String(e))
  }),
  deleteBranch: (cwd, branch) => Effect_exports.promise(
    () => gitExec(`git branch -D "${branch}"`, cwd).catch(() => {
    })
  ).pipe(Effect_exports.asVoid)
});
var LocalGitClient = Layer_exports.effect(
  GitClient,
  Effect_exports.map(
    HostProcess,
    (host) => makeGitClient(
      (command, cwd) => runPromiseUnwrapped(host.shell(command, { cwd }))
    )
  )
);

// src/application/sandbox/lifecycle/SandboxLifecycle.ts
var GIT_SETUP_TIMEOUT_MS = 1e4;
var COMMIT_COLLECTION_TIMEOUT_MS = 3e4;
var MERGE_TO_HOST_TIMEOUT_MS = 3e4;
var GIT_SETUP_MAX_RETRIES = 8;
var GIT_SETUP_RETRY_SCHEDULE = Schedule_exports.exponential(
  Duration_exports.millis(150),
  1.8
).pipe(Schedule_exports.jittered);
var TRANSIENT_EXEC_EXIT_CODES = /* @__PURE__ */ new Set([126, 137]);
var GIT_LOCK_CONTENTION_PATTERN = /could not lock config file/i;
var isTransientExecError = (err) => err._tag === "ExecError" && (err.exitCode !== void 0 && TRANSIENT_EXEC_EXIT_CODES.has(err.exitCode) || GIT_LOCK_CONTENTION_PATTERN.test(err.message));
var execOkWithGitTimeout = (sandbox3, command, gitSetupTimeoutMs, options) => execOk(sandbox3, command, options).pipe(
  withTimeout(
    gitSetupTimeoutMs,
    () => new GitSetupTimeoutError({
      message: `Git command timed out after ${gitSetupTimeoutMs}ms: ${command}`,
      timeoutMs: gitSetupTimeoutMs,
      command
    })
  ),
  // Each attempt is bounded by its own timeout (above); retry only transient
  // exec races, so a genuine git error or a hung exec still fails fast.
  Effect_exports.retry({
    while: isTransientExecError,
    times: GIT_SETUP_MAX_RETRIES,
    schedule: GIT_SETUP_RETRY_SCHEDULE
  })
);
var IDENTITY_STEP_FAILED_MARKER = "__arsenal_step_failed__";
var identifyFailedStep = (err, steps) => {
  if (err._tag !== "ExecError") return err;
  const match19 = new RegExp(`${IDENTITY_STEP_FAILED_MARKER}:(\\S+)`).exec(
    err.message
  );
  const failedStep = match19 && steps.find((step4) => step4.label === match19[1]);
  if (!failedStep) return err;
  return new ExecError({
    command: failedStep.command,
    exitCode: err.exitCode,
    message: `Git identity/branch setup failed at step '${failedStep.label}': ${failedStep.command}
${err.message}`
  });
};
var withSandboxLifecycleImpl = (options, sandbox3, work) => Effect_exports.gen(function* () {
  const display = yield* Display;
  const gitClient = yield* GitClient;
  const host = yield* HostProcess;
  const { hostRepoDir, sandboxRepoDir, hooks, branch, hostWorktreePath } = options;
  const gitSetupTimeoutMs = options.timeouts?.gitSetupMs ?? GIT_SETUP_TIMEOUT_MS;
  const commitCollectionTimeoutMs = options.timeouts?.commitCollectionMs ?? COMMIT_COLLECTION_TIMEOUT_MS;
  const mergeToHostTimeoutMs = options.timeouts?.mergeToHostMs ?? MERGE_TO_HOST_TIMEOUT_MS;
  const signal = options.signal ?? new AbortController().signal;
  const hostCurrentBranch = !branch ? yield* gitClient.currentBranch(hostRepoDir) : null;
  const { name: hostGitName, email: hostGitEmail } = yield* gitClient.identity(hostRepoDir);
  const hostSideWorktreePath = hostWorktreePath ?? sandboxRepoDir;
  let resolvedBranch = "";
  yield* display.taskLog(
    "Setting up sandbox",
    (message) => Effect_exports.gen(function* () {
      yield* execOkWithGitTimeout(
        sandbox3,
        `git config --global --add safe.directory "${sandboxRepoDir}"`,
        gitSetupTimeoutMs
      );
      const identitySteps = [
        hostGitName && {
          label: "user.name",
          command: `git config --global user.name "${hostGitName.replace(/"/g, '\\"')}"`
        },
        hostGitEmail && {
          label: "user.email",
          command: `git config --global user.email "${hostGitEmail.replace(/"/g, '\\"')}"`
        },
        { label: "rev-parse", command: "git rev-parse --abbrev-ref HEAD" }
      ].filter(
        (step4) => Boolean(step4)
      );
      const batchedCommand = identitySteps.map(
        ({ label, command }) => `${command} || { echo "${IDENTITY_STEP_FAILED_MARKER}:${label}" >&2; exit 1; }`
      ).join(" && ");
      resolvedBranch = (yield* execOkWithGitTimeout(
        sandbox3,
        batchedCommand,
        gitSetupTimeoutMs,
        { cwd: sandboxRepoDir }
      ).pipe(Effect_exports.mapError((err) => identifyFailedStep(err, identitySteps)))).stdout.trim();
      const sandboxHooks = hooks?.sandbox?.onSandboxReady;
      const hostOnSandboxReady = hooks?.host?.onSandboxReady;
      if (sandboxHooks?.length) {
        for (const hook of sandboxHooks) {
          message(hook.command);
        }
      }
      if (hostOnSandboxReady?.length) {
        for (const hook of hostOnSandboxReady) {
          message(`[host] ${hook.command}`);
        }
      }
      const hostHookEffects = (hostOnSandboxReady ?? []).map((hook) => {
        const timeout4 = hook.timeoutMs ?? HOOK_TIMEOUT_MS;
        return host.shell(hook.command, { cwd: hostSideWorktreePath, signal }).pipe(
          Effect_exports.mapError(
            (err) => new ExecError({
              command: hook.command,
              message: `Host hook failed: ${hook.command}
${err.message}`
            })
          ),
          withTimeout(
            timeout4,
            () => new HookTimeoutError({
              message: `Host hook '${hook.command}' timed out after ${timeout4}ms`,
              timeoutMs: timeout4,
              command: hook.command
            })
          )
        );
      });
      yield* Effect_exports.all(
        [
          runSandboxHooksWithAbort(
            sandbox3,
            sandboxRepoDir,
            sandboxHooks ?? [],
            signal
          ),
          ...hostHookEffects
        ],
        { concurrency: "unbounded" }
      );
    })
  );
  const targetBranch = branch ?? resolvedBranch;
  const baseHead = yield* gitClient.revParseHead(hostSideWorktreePath);
  const result = yield* work({ sandbox: sandbox3, sandboxRepoDir, baseHead });
  if (options.applyToHost) {
    const commitCount = yield* countCommitsToSync(
      sandbox3,
      sandboxRepoDir,
      baseHead
    );
    yield* display.taskLog(
      commitCount > 0 ? `Syncing ${commitCount} commit${commitCount !== 1 ? "s" : ""} to host` : "No commits to sync out",
      () => options.applyToHost()
    );
  }
  let commits;
  let finalBranch;
  if (hostCurrentBranch !== null) {
    const hasNewCommits = yield* gitClient.hasCommitsInRange(
      hostSideWorktreePath,
      `${baseHead}..HEAD`
    );
    if (!options.keepSourceBranch) {
      yield* execOk(sandbox3, "git checkout --detach", {
        cwd: sandboxRepoDir
      });
    }
    if (hasNewCommits) {
      yield* display.taskLog(
        `Merging to ${hostCurrentBranch}`,
        () => gitClient.mergeBranch(hostRepoDir, resolvedBranch, hostCurrentBranch).pipe(
          Effect_exports.mapError((e) => new SyncError({ message: e.message })),
          withTimeout(
            mergeToHostTimeoutMs,
            () => new MergeToHostTimeoutError({
              message: `Merge of '${resolvedBranch}' to '${hostCurrentBranch}' timed out after ${mergeToHostTimeoutMs}ms`,
              timeoutMs: mergeToHostTimeoutMs,
              sourceBranch: resolvedBranch,
              targetBranch: hostCurrentBranch
            })
          )
        )
      );
    }
    if (!options.keepSourceBranch) {
      yield* gitClient.deleteBranch(hostRepoDir, resolvedBranch);
    }
    commits = yield* display.taskLog(
      "Collecting commits",
      () => gitClient.revList(hostRepoDir, `${baseHead}..HEAD`).pipe(
        Effect_exports.map((shas) => shas.map((sha) => ({ sha }))),
        withTimeout(
          commitCollectionTimeoutMs,
          () => new CommitCollectionTimeoutError({
            message: `Commit collection timed out after ${commitCollectionTimeoutMs}ms`,
            timeoutMs: commitCollectionTimeoutMs
          })
        )
      )
    );
    finalBranch = hostCurrentBranch;
  } else {
    commits = yield* display.taskLog(
      "Collecting commits",
      () => gitClient.revList(hostRepoDir, `${baseHead}..refs/heads/${targetBranch}`).pipe(
        Effect_exports.map((shas) => shas.map((sha) => ({ sha }))),
        withTimeout(
          commitCollectionTimeoutMs,
          () => new CommitCollectionTimeoutError({
            message: `Commit collection timed out after ${commitCollectionTimeoutMs}ms`,
            timeoutMs: commitCollectionTimeoutMs
          })
        )
      )
    );
    finalBranch = targetBranch;
  }
  return { result, branch: finalBranch, commits };
});
var withSandboxLifecycle = (options, sandbox3, work) => withSandboxLifecycleImpl(options, sandbox3, work).pipe(
  Effect_exports.provide(LocalGitClient)
);

// src/application/display/TextDeltaBuffer.ts
var LENGTH_THRESHOLD = 80;
var DEBOUNCE_MS = 50;
var SENTENCE_BOUNDARY_RE = /[.!?] $/;
var TextDeltaBuffer = class {
  buffer = "";
  timer = null;
  onFlush;
  constructor(onFlush) {
    this.onFlush = onFlush;
  }
  write(text) {
    if (text.length === 0) return;
    this.buffer += text;
    this.clearTimer();
    if (this.shouldFlush()) {
      this.doFlush();
      return;
    }
    this.timer = setTimeout(() => {
      this.doFlush();
    }, DEBOUNCE_MS);
  }
  /** Force-flush any buffered text. */
  flush() {
    this.clearTimer();
    this.doFlush();
  }
  /** Flush remaining buffer and clean up. */
  dispose() {
    this.flush();
  }
  shouldFlush() {
    if (this.buffer.includes("\n")) return true;
    if (SENTENCE_BOUNDARY_RE.test(this.buffer)) return true;
    if (this.buffer.length >= LENGTH_THRESHOLD) return true;
    return false;
  }
  doFlush() {
    if (this.buffer.length === 0) return;
    const text = this.buffer;
    this.buffer = "";
    this.onFlush(text);
  }
  clearTimer() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
};

// src/application/orchestration/completionSignal.ts
var DEFAULT_COMPLETION_SIGNAL = "<promise>COMPLETE</promise>";
var normalizeCompletionSignals = (completionSignal) => {
  if (completionSignal === void 0) return [DEFAULT_COMPLETION_SIGNAL];
  const signals = typeof completionSignal === "string" ? [completionSignal] : completionSignal;
  return signals.filter((sig) => sig.trim().length > 0);
};
var matchCompletionSignal = (output, completionSignal) => normalizeCompletionSignals(completionSignal).find(
  (sig) => output.includes(sig)
);
var runAcpSession = async (options) => {
  const { cwd, prompt, onEvent, onRawUpdate, signal } = options;
  signal?.throwIfAborted();
  if (options.session) {
    const { session } = options;
    const activeSession2 = session.activeSession;
    const sessionId2 = activeSession2.sessionId;
    let abortListener2;
    if (signal) {
      abortListener2 = () => {
        void session.cancel();
      };
      signal.addEventListener("abort", abortListener2, { once: true });
    }
    try {
      signal?.throwIfAborted();
      session.toolCallNames.clear();
      const promptDone = activeSession2.prompt(prompt);
      const toolCallNames = session.toolCallNames;
      while (true) {
        if (signal?.aborted) throw signal.reason;
        const msg = await activeSession2.nextUpdate();
        if (msg.kind === "stop") break;
        if (msg.kind === "session_update") {
          onRawUpdate?.(msg.update);
          for (const event of parseAcpUpdate(msg.update, toolCallNames)) {
            onEvent(event);
          }
        }
      }
      await promptDone;
      onEvent({ type: "session_id", sessionId: sessionId2 });
      return { stopReason: "end_turn", exitCode: 0, sessionId: sessionId2 };
    } finally {
      if (abortListener2 && signal)
        signal.removeEventListener("abort", abortListener2);
    }
  }
  const { provider, interactiveExec } = options;
  if (!provider || !interactiveExec) {
    throw new Error(
      "runAcpSession: provide either `session` or both `provider` and `interactiveExec`."
    );
  }
  if (!provider.buildAcpArgs || !provider.parseAcpUpdate) {
    throw new Error(
      `Agent provider "${provider.name}" must implement buildAcpArgs and parseAcpUpdate to use ACP sessions.`
    );
  }
  const acpArgs = provider.buildAcpArgs();
  const parseUpdate = provider.parseAcpUpdate.bind(provider);
  const toAgent = new PassThrough();
  const fromAgent = new PassThrough();
  const execPromise = interactiveExec(acpArgs, {
    stdin: toAgent,
    stdout: fromAgent,
    stderr: process.stderr,
    cwd
  });
  const stream2 = ndJsonStream(
    Writable.toWeb(toAgent),
    Readable.toWeb(fromAgent)
  );
  const app = client({ name: "arsenal" });
  const conn = app.connect(stream2);
  let sessionId;
  let abortListener;
  if (signal) {
    abortListener = () => {
      if (sessionId !== void 0) {
        try {
          void conn.agent.notify("session/cancel", { sessionId });
        } catch {
        }
      }
      setTimeout(() => {
        if (!toAgent.destroyed) toAgent.destroy();
      }, 500);
    };
    signal.addEventListener("abort", abortListener, { once: true });
  }
  let activeSession;
  try {
    signal?.throwIfAborted();
    activeSession = await conn.agent.buildSession(cwd).start();
    sessionId = activeSession.sessionId;
    const promptDone = activeSession.prompt(prompt);
    while (true) {
      if (signal?.aborted) throw signal.reason;
      const msg = await activeSession.nextUpdate();
      if (msg.kind === "stop") break;
      if (msg.kind === "session_update") {
        onRawUpdate?.(msg.update);
        for (const event of parseUpdate(msg.update)) {
          onEvent(event);
        }
      }
    }
    await promptDone;
    onEvent({ type: "session_id", sessionId });
    toAgent.end();
    const { exitCode } = await execPromise;
    return { stopReason: "end_turn", exitCode, sessionId };
  } finally {
    if (abortListener && signal)
      signal.removeEventListener("abort", abortListener);
    if (!toAgent.destroyed) toAgent.destroy();
    try {
      activeSession?.dispose();
    } catch {
    }
  }
};

// src/application/orchestration/invokeAgentEffect.ts
var IDLE_WARNING_INTERVAL_MS = 6e4;
var DEFAULT_IDLE_TIMEOUT_SECONDS = 10 * 60;
var DEFAULT_COMPLETION_TIMEOUT_SECONDS = 60;
var invokeAgentEffect = (options) => Effect_exports.gen(function* () {
  const {
    executor,
    cwd,
    prompt,
    provider,
    signal,
    onText = () => {
    },
    onToolCall = () => {
    },
    onRawLine,
    onIdleWarning = () => {
    },
    onCompletionTimeout = () => {
    }
  } = options;
  const idleTimeoutMs = (options.idleTimeoutSeconds ?? DEFAULT_IDLE_TIMEOUT_SECONDS) * 1e3;
  const completionTimeoutMs = (options.completionTimeoutSeconds ?? DEFAULT_COMPLETION_TIMEOUT_SECONDS) * 1e3;
  const idleWarningIntervalMs = options._idleWarningIntervalMs ?? IDLE_WARNING_INTERVAL_MS;
  const completionSignals = normalizeCompletionSignals(
    options.completionSignal
  );
  const { session } = options;
  const { interactiveExec } = executor;
  if (!session && !interactiveExec) {
    return yield* Effect_exports.fail(
      new AgentError({
        message: "Executor does not support interactiveExec, which is required for ACP transport."
      })
    );
  }
  let resultText = "";
  let sessionId;
  let usage;
  let accumulatedOutput = "";
  const timeoutSignal = yield* Deferred_exports.make();
  const completionTimeoutDeferred = yield* Deferred_exports.make();
  let timeoutFiber = null;
  let completionDetected = false;
  let matchedSignal;
  let warningFiber = null;
  let idleMinuteCounter = 0;
  const acpAbortController = new AbortController();
  const interruptFiber2 = (f) => {
    if (f !== null) Effect_exports.runFork(Fiber_exports.interrupt(f));
  };
  const startWarningInterval = () => {
    interruptFiber2(warningFiber);
    idleMinuteCounter = 0;
    warningFiber = Effect_exports.runFork(
      Effect_exports.gen(function* () {
        while (true) {
          yield* Effect_exports.sleep(Duration_exports.millis(idleWarningIntervalMs));
          idleMinuteCounter++;
          onIdleWarning(idleMinuteCounter);
        }
      })
    );
  };
  const resetTimer = () => {
    interruptFiber2(timeoutFiber);
    if (completionDetected) {
      timeoutFiber = Effect_exports.runFork(
        Effect_exports.gen(function* () {
          yield* Effect_exports.sleep(Duration_exports.millis(completionTimeoutMs));
          onCompletionTimeout(completionTimeoutMs);
          acpAbortController.abort(
            new Error("Completion grace period elapsed")
          );
          yield* Deferred_exports.succeed(completionTimeoutDeferred, {
            result: resultText || accumulatedOutput,
            sessionId,
            usage,
            completionSignal: matchedSignal
          });
        })
      );
    } else {
      timeoutFiber = Effect_exports.runFork(
        Effect_exports.gen(function* () {
          yield* Effect_exports.sleep(Duration_exports.millis(idleTimeoutMs));
          const idleError = new AgentIdleTimeoutError({
            message: `Agent idle for ${idleTimeoutMs / 1e3} seconds \u2014 no output received. Consider increasing the idleTimeoutSeconds option.`,
            timeoutMs: idleTimeoutMs
          });
          acpAbortController.abort(idleError);
          yield* Deferred_exports.fail(timeoutSignal, idleError);
        })
      );
      startWarningInterval();
    }
  };
  const handleEvent = (event) => {
    switch (event.type) {
      case "text":
        onText(event.text);
        if (event.assertive !== false) accumulatedOutput += event.text;
        break;
      case "result":
        resultText = event.result;
        accumulatedOutput += event.result;
        break;
      case "tool_call":
        onToolCall(event.name, event.args);
        break;
      case "session_id":
        sessionId = event.sessionId;
        break;
      case "usage":
        usage = event.usage;
        break;
    }
    if (!completionDetected) {
      const found = matchCompletionSignal(
        accumulatedOutput,
        completionSignals
      );
      if (found !== void 0) {
        completionDetected = true;
        matchedSignal = found;
        interruptFiber2(warningFiber);
        warningFiber = null;
      }
    }
    resetTimer();
  };
  const abortDeferred = yield* Deferred_exports.make();
  let abortCleanup = null;
  if (signal) {
    if (signal.aborted) return yield* Effect_exports.die(signal.reason);
    const onAbort = () => {
      acpAbortController.abort(signal.reason);
      Effect_exports.runFork(Deferred_exports.die(abortDeferred, signal.reason));
    };
    signal.addEventListener("abort", onAbort, { once: true });
    abortCleanup = () => signal.removeEventListener("abort", onAbort);
  }
  resetTimer();
  const workEffect = Effect_exports.tryPromise({
    try: () => runAcpSession({
      cwd,
      prompt,
      signal: acpAbortController.signal,
      onEvent: handleEvent,
      onRawUpdate: (update5) => {
        onRawLine?.(JSON.stringify(update5));
        resetTimer();
      },
      ...session ? { session } : { provider, interactiveExec }
    }),
    catch: (e) => new AgentError({
      message: `ACP session failed: ${e instanceof Error ? e.message : String(e)}`
    })
  }).pipe(
    Effect_exports.flatMap((sessionResult) => {
      if (sessionResult.exitCode !== 0 && !matchedSignal) {
        return Effect_exports.fail(
          new AgentError({
            message: `Agent exited with non-zero code ${sessionResult.exitCode}`
          })
        );
      }
      return Effect_exports.succeed({
        result: resultText || accumulatedOutput,
        sessionId,
        usage,
        completionSignal: matchedSignal
      });
    })
  );
  const workWithCleanup = workEffect.pipe(
    Effect_exports.ensuring(
      Effect_exports.sync(() => {
        interruptFiber2(timeoutFiber);
        timeoutFiber = null;
        interruptFiber2(warningFiber);
        warningFiber = null;
        if (abortCleanup) {
          abortCleanup();
          abortCleanup = null;
        }
      })
    )
  );
  return yield* Effect_exports.raceFirst(
    workWithCleanup,
    Effect_exports.raceFirst(
      Deferred_exports.await(timeoutSignal),
      Effect_exports.raceFirst(
        Deferred_exports.await(completionTimeoutDeferred),
        Deferred_exports.await(abortDeferred)
      )
    )
  );
});

// src/application/orchestration/iterationLoop.ts
var INITIAL_RETRY_DELAY_MS = 100;
var MAX_RETRY_DELAY_MS = 5e3;
var RETRYABLE_TAGS = /* @__PURE__ */ new Set(["AgentError", "AgentIdleTimeoutError"]);
var isRetryableAgentError = (e) => {
  const error = Runtime_exports.isFiberFailure(e) ? Cause_exports.squash(e[Runtime_exports.FiberFailureCauseId]) : e;
  const tag2 = error?._tag;
  return typeof tag2 === "string" && RETRYABLE_TAGS.has(tag2);
};
var checkAbort = (signal) => signal?.aborted ? Effect_exports.die(signal.reason) : Effect_exports.void;
var runWithRetries = (iteration, options, work) => Effect_exports.gen(function* () {
  let delayMs = INITIAL_RETRY_DELAY_MS;
  for (let attempt = 0; ; attempt++) {
    yield* checkAbort(options.signal);
    const outcome = yield* Effect_exports.either(work(iteration));
    if (outcome._tag === "Right") return outcome.right;
    const e = outcome.left;
    if (!isRetryableAgentError(e) || attempt >= options.iterationRetries) {
      return yield* Effect_exports.fail(e);
    }
    yield* options.onRetry?.(e, attempt + 1, options.iterationRetries) ?? Effect_exports.void;
    yield* Effect_exports.sleep(Duration_exports.millis(delayMs));
    delayMs = Math.min(delayMs * 2, MAX_RETRY_DELAY_MS);
  }
});
var runIterationLoop = (options, work) => Effect_exports.gen(function* () {
  const results = [];
  for (let i = 1; i <= options.maxIterations; i++) {
    yield* checkAbort(options.signal);
    const result = yield* runWithRetries(i, options, work);
    results.push({ iteration: i, result });
    if (options.shouldStop?.(result, i)) break;
  }
  return results;
});

// src/application/orchestration/Orchestrator.ts
var DEFAULT_IDLE_TIMEOUT_SECONDS2 = 10 * 60;
var DEFAULT_COMPLETION_TIMEOUT_SECONDS2 = 60;
var orchestrate = (options) => {
  const idleTimeoutMs = (options.idleTimeoutSeconds ?? DEFAULT_IDLE_TIMEOUT_SECONDS2) * 1e3;
  const completionTimeoutMs = (options.completionTimeoutSeconds ?? DEFAULT_COMPLETION_TIMEOUT_SECONDS2) * 1e3;
  const maxRetries = options.iterationRetries ?? 0;
  return Effect_exports.gen(function* () {
    const factory = yield* SandboxFactory;
    const display = yield* Display;
    const streamEmitter = yield* AgentStreamEmitter;
    const { hostRepoDir, iterations, hooks, prompt, branch, provider } = options;
    const completionSignals = normalizeCompletionSignals(
      options.completionSignal
    );
    const label = (msg) => options.name ? `[${options.name}] ${msg}` : msg;
    const runIteration = (i) => Effect_exports.gen(function* () {
      yield* display.status(label(`Iteration ${i}/${iterations}`), "info");
      return yield* factory.withSandbox(
        ({ hostWorktreePath, sandboxRepoPath, applyToHost }, sandbox3) => withSandboxLifecycle(
          {
            hostRepoDir,
            sandboxRepoDir: sandboxRepoPath,
            hooks,
            branch,
            hostWorktreePath,
            applyToHost,
            signal: options.signal,
            timeouts: options.timeouts,
            keepSourceBranch: options.keepSourceBranch
          },
          sandbox3,
          (ctx) => Effect_exports.gen(function* () {
            const fullPrompt = options.skipPromptExpansion ? prompt : yield* preprocessPrompt(
              prompt,
              ctx.sandbox,
              ctx.sandboxRepoDir
            );
            yield* display.status(label("Agent started"), "success");
            const textBuffer = new TextDeltaBuffer((chunk3) => {
              Effect_exports.runPromise(display.textChunk(chunk3));
              Effect_exports.runPromise(
                streamEmitter.emit({
                  type: "text",
                  message: chunk3,
                  iteration: i,
                  timestamp: /* @__PURE__ */ new Date()
                })
              );
            });
            const onText = (text) => {
              textBuffer.write(text);
            };
            const onToolCall = (name, formattedArgs) => {
              textBuffer.flush();
              Effect_exports.runPromise(display.toolCall(name, formattedArgs));
              Effect_exports.runPromise(
                streamEmitter.emit({
                  type: "toolCall",
                  name,
                  formattedArgs,
                  iteration: i,
                  timestamp: /* @__PURE__ */ new Date()
                })
              );
            };
            const onRawLine = (line) => {
              Effect_exports.runPromise(
                streamEmitter.emit({
                  type: "raw",
                  line,
                  iteration: i,
                  timestamp: /* @__PURE__ */ new Date()
                })
              );
            };
            const onIdleWarning = (minutes2) => {
              const msg = minutes2 === 1 ? "Agent idle for 1 minute" : `Agent idle for ${minutes2} minutes`;
              Effect_exports.runPromise(display.status(label(msg), "warn"));
            };
            const onCompletionTimeout = (timeoutMs) => {
              Effect_exports.runPromise(
                display.status(
                  label(
                    `Completion signal seen but agent process is hanging \u2014 force-completing after ${timeoutMs / 1e3}s grace window.`
                  ),
                  "warn"
                )
              );
            };
            const {
              result: agentOutput,
              sessionId,
              usage,
              completionSignal: matchedSignal
            } = yield* invokeAgentEffect({
              executor: sandboxExecutor(toSandboxCommands(ctx.sandbox)),
              cwd: ctx.sandboxRepoDir,
              prompt: fullPrompt,
              provider,
              idleTimeoutSeconds: idleTimeoutMs / 1e3,
              completionTimeoutSeconds: completionTimeoutMs / 1e3,
              completionSignal: completionSignals,
              onText,
              onToolCall,
              onRawLine,
              onIdleWarning,
              onCompletionTimeout,
              _idleWarningIntervalMs: options._idleWarningIntervalMs,
              signal: options.signal
            });
            textBuffer.dispose();
            yield* display.status(label("Agent stopped"), "info");
            return {
              completionSignal: matchedSignal,
              stdout: agentOutput,
              sessionId,
              usage
            };
          })
        )
      );
    });
    const outcomes = yield* runIterationLoop(
      {
        maxIterations: iterations,
        iterationRetries: maxRetries,
        signal: options.signal,
        onRetry: (e, attempt, retries) => {
          const err = e;
          const reason = err._tag === "AgentIdleTimeoutError" ? "Agent idle timeout" : `Agent failed: ${err.message.split("\n")[0]}`;
          return display.status(
            label(`${reason} (attempt ${attempt}/${retries + 1}). Retrying\u2026`),
            "warn"
          );
        },
        shouldStop: (iterationResult) => iterationResult.value.result.completionSignal !== void 0
      },
      runIteration
    );
    const allCommits = [];
    const allIterations = [];
    let allStdout = "";
    let resolvedBranch = "";
    for (const { result: iterationResult } of outcomes) {
      const lifecycleResult = iterationResult.value;
      allCommits.push(...lifecycleResult.commits);
      allStdout += lifecycleResult.result.stdout;
      resolvedBranch = lifecycleResult.branch;
      allIterations.push({
        sessionId: lifecycleResult.result.sessionId,
        usage: lifecycleResult.result.usage
      });
    }
    const lastOutcome = outcomes[outcomes.length - 1];
    const iterationPreservedPath = lastOutcome?.result.preservedWorktreePath;
    const completionSignal = lastOutcome?.result.value.result.completionSignal;
    yield* display.status(
      completionSignal !== void 0 ? label(
        `Agent signaled completion after ${outcomes.length} iteration(s).`
      ) : label(`Reached max iterations (${iterations}).`),
      completionSignal !== void 0 ? "success" : "info"
    );
    return {
      iterations: allIterations,
      completionSignal,
      stdout: allStdout,
      commits: allCommits,
      branch: resolvedBranch,
      preservedWorktreePath: iterationPreservedPath
    };
  });
};

// src/application/prompts/PromptResolver.ts
var resolvePrompt = (options) => {
  const { prompt, promptFile } = options;
  if (prompt !== void 0 && promptFile !== void 0) {
    return Effect_exports.fail(
      new PromptError({
        message: "Cannot provide both prompt and promptFile"
      })
    );
  }
  if (prompt !== void 0) {
    return Effect_exports.succeed({ text: prompt, source: "inline" });
  }
  if (promptFile === void 0) {
    return Effect_exports.fail(
      new PromptError({
        message: "Must provide either prompt or promptFile. Pass prompt: '...' or promptFile: './.arsenal/prompt.md' to run()."
      })
    );
  }
  return Effect_exports.gen(function* () {
    const fs = yield* FileSystem_exports.FileSystem;
    const text = yield* fs.readFileString(promptFile).pipe(
      Effect_exports.catchAll(
        (e) => Effect_exports.fail(
          new PromptError({
            message: `Failed to read prompt from ${promptFile}: ${e}`
          })
        )
      )
    );
    return { text, source: "template" };
  });
};
var parseEnvFile = (filePath) => Effect_exports.gen(function* () {
  const fs = yield* FileSystem_exports.FileSystem;
  const content = yield* fs.readFileString(filePath).pipe(Effect_exports.catchAll(() => Effect_exports.succeed(null)));
  if (content === null) return {};
  const vars = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    const isDoubleQuoted = value.length >= 2 && value[0] === '"' && value[value.length - 1] === '"';
    const isSingleQuoted = value.length >= 2 && value[0] === "'" && value[value.length - 1] === "'";
    if (isDoubleQuoted || isSingleQuoted) {
      value = value.slice(1, -1);
    }
    if (isDoubleQuoted) {
      value = value.replace(/\\([nrt\\])/g, (_, ch) => {
        const escapes = {
          n: "\n",
          r: "\r",
          t: "	",
          "\\": "\\"
        };
        return escapes[ch] ?? ch;
      });
    }
    vars[key] = value;
  }
  return vars;
});
var resolveEnv = (repoDir) => Effect_exports.gen(function* () {
  const arsenalEnv = yield* parseEnvFile(join$1(repoDir, ".arsenal", ".env"));
  const result = {};
  for (const key of Object.keys(arsenalEnv)) {
    const value = arsenalEnv[key] || process.env[key];
    if (value) {
      result[key] = value;
    }
  }
  return result;
});

// src/errors/ErrorHandler.ts
var formatErrorMessage = (error) => {
  switch (error._tag) {
    case "ExecError":
      return `Command failed in sandbox (${error.command}): ${error.message}`;
    case "ExecHostError":
      return `Command failed on host (${error.command}): ${error.message}`;
    case "CopyError":
      return `File copy failed: ${error.message}`;
    case "DockerError":
      return `Docker operation failed: ${error.message}. Is Docker running?`;
    case "PodmanError":
      return `Podman operation failed: ${error.message}. Is Podman running?`;
    case "SyncError":
      return `Git sync failed: ${error.message}`;
    case "WorktreeError":
      return `Git worktree operation failed: ${error.message}`;
    case "PromptError":
      return `Failed to resolve prompt: ${error.message}`;
    case "AgentError":
      return `Agent invocation failed: ${error.message}`;
    case "ConfigDirError":
      return `${error.message}`;
    case "InitError":
      return `${error.message}`;
    case "AgentIdleTimeoutError":
    case "WorktreeTimeoutError":
    case "ContainerStartTimeoutError":
    case "CopyToWorktreeTimeoutError":
    case "CopyToWorktreeError":
    case "SyncInTimeoutError":
    case "HookTimeoutError":
    case "GitSetupTimeoutError":
    case "PromptExpansionTimeoutError":
    case "CommitCollectionTimeoutError":
    case "MergeToHostTimeoutError":
    case "CwdError":
      return error.message;
  }
};

// src/application/sandbox/mergeProviderEnv.ts
var mergeProviderEnv = (options) => {
  const { resolvedEnv, agentProviderEnv, sandboxProviderEnv } = options;
  const agentKeys = Object.keys(agentProviderEnv);
  const sandboxKeys = new Set(Object.keys(sandboxProviderEnv));
  const overlapping = agentKeys.filter((k) => sandboxKeys.has(k));
  if (overlapping.length > 0) {
    throw new Error(
      `Overlapping env keys between agent provider and sandbox provider: ${overlapping.join(", ")}`
    );
  }
  return {
    ...resolvedEnv,
    ...sandboxProviderEnv,
    ...agentProviderEnv
  };
};

// src/application/prompts/PromptArgumentSubstitution.ts
var SHELL_BLOCK_PATTERN = /!`([^`]+)`/g;
var BUILT_IN_PROMPT_ARG_KEYS = [
  "SOURCE_BRANCH",
  "TARGET_BRANCH"
];
var PLACEHOLDER_PATTERN = /\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g;
var validateNoArgsWithInlinePrompt = (args2) => {
  if (Object.keys(args2).length === 0) return Effect_exports.void;
  return Effect_exports.fail(
    new PromptError({
      message: 'promptArgs is only supported with promptFile. Inline prompts (prompt: "...") are passed to the agent as-is \u2014 interpolate values directly in JavaScript, or switch to promptFile to use {{KEY}} substitution.'
    })
  );
};
var validateNoBuiltInArgOverride = (args2) => {
  for (const key of BUILT_IN_PROMPT_ARG_KEYS) {
    if (key in args2) {
      return Effect_exports.fail(
        new PromptError({
          message: `"${key}" is a built-in prompt argument and cannot be overridden via promptArgs`
        })
      );
    }
  }
  return Effect_exports.void;
};
var substitutePromptArgs = (prompt, args2, silentKeys) => {
  const markedPrompt = prompt.replaceAll(SHELL_BLOCK_MARKER, "").replace(SHELL_BLOCK_PATTERN, `!${SHELL_BLOCK_MARKER}\`$1\``);
  const sanitizedArgs = Object.fromEntries(
    Object.entries(args2).map(([key, value]) => [
      key,
      typeof value === "string" ? value.replaceAll(SHELL_BLOCK_MARKER, "") : value
    ])
  );
  const matches = [...markedPrompt.matchAll(PLACEHOLDER_PATTERN)];
  if (matches.length === 0 && Object.keys(sanitizedArgs).length === 0) {
    return Effect_exports.succeed(markedPrompt);
  }
  return Effect_exports.gen(function* () {
    const display = yield* Display;
    const referencedKeys = new Set(matches.map((m) => m[1]));
    for (const key of referencedKeys) {
      if (!(key in sanitizedArgs)) {
        return yield* Effect_exports.fail(
          new PromptError({
            message: `Prompt argument "{{${key}}}" has no matching value in promptArgs`
          })
        );
      }
      const value = sanitizedArgs[key];
      if (value == null) {
        return yield* Effect_exports.fail(
          new PromptError({
            message: `Prompt argument "{{${key}}}" has value ${value === null ? "null" : "undefined"} in promptArgs`
          })
        );
      }
    }
    for (const key of Object.keys(sanitizedArgs)) {
      if (!referencedKeys.has(key) && !silentKeys?.has(key)) {
        yield* display.status(
          `Prompt argument "${key}" was provided but not referenced in the prompt`,
          "warn"
        );
      }
    }
    const result = markedPrompt.replace(
      PLACEHOLDER_PATTERN,
      (_match, key) => sanitizedArgs[key].toString()
    );
    return result;
  });
};
var applyPromptArgs = (options) => Effect_exports.gen(function* () {
  if (options.isInlinePrompt) {
    yield* validateNoArgsWithInlinePrompt(options.userArgs);
    return options.rawPrompt;
  }
  yield* validateNoBuiltInArgOverride(options.userArgs);
  return yield* substitutePromptArgs(
    options.rawPrompt,
    { ...options.builtIns, ...options.userArgs },
    new Set(BUILT_IN_PROMPT_ARG_KEYS)
  );
});

// src/application/prompts/StructuredOutput.ts
var Output = {
  /**
   * Declare an object-typed structured output extracted from an XML tag in
   * the agent's stdout. The tag contents are JSON-parsed (with fence-aware
   * unwrapping) and validated against the provided Standard Schema validator.
   */
  object: (opts) => ({
    _tag: "object",
    tag: opts.tag,
    schema: opts.schema
  }),
  /**
   * Declare a string-typed structured output extracted from an XML tag in
   * the agent's stdout. The tag contents are whitespace-trimmed and returned
   * as a plain string — no JSON parsing, no schema validation.
   */
  string: (opts) => ({
    _tag: "string",
    tag: opts.tag
  })
};
var StructuredOutputError = class extends Error {
  tag;
  rawMatched;
  cause;
  commits;
  branch;
  preservedWorktreePath;
  /** Session ID of the iteration that produced the bad output, when available. */
  sessionId;
  constructor(message, options) {
    super(message);
    this.name = "StructuredOutputError";
    this.tag = options.tag;
    this.rawMatched = options.rawMatched;
    this.cause = options.cause;
    this.commits = options.commits;
    this.branch = options.branch;
    this.preservedWorktreePath = options.preservedWorktreePath;
    this.sessionId = options.sessionId;
  }
};

// src/application/prompts/extractStructuredOutput.ts
var extractStructuredOutput = async (stdout, definition, context7) => {
  if (definition._tag === "object") {
    return extractObject(
      stdout,
      definition,
      context7
    );
  }
  return extractString(stdout, definition, context7);
};
var extractObject = async (stdout, definition, context7) => {
  const raw = findLastTagContent(stdout, definition.tag);
  if (raw === void 0) {
    throw new StructuredOutputError(
      `Structured output tag <${definition.tag}> not found in agent output`,
      { tag: definition.tag, rawMatched: void 0, ...context7 }
    );
  }
  const unwrapped = unwrapFences(raw.trim());
  let parsed;
  try {
    parsed = JSON.parse(unwrapped);
  } catch (cause3) {
    throw new StructuredOutputError(
      `Structured output tag <${definition.tag}> contains invalid JSON`,
      { tag: definition.tag, rawMatched: raw, cause: cause3, ...context7 }
    );
  }
  const result = await definition.schema["~standard"].validate(parsed);
  if (result.issues) {
    throw new StructuredOutputError(
      `Structured output tag <${definition.tag}> failed schema validation`,
      {
        tag: definition.tag,
        rawMatched: raw,
        cause: result.issues,
        ...context7
      }
    );
  }
  return result.value;
};
var extractString = (stdout, definition, context7) => {
  const raw = findLastTagContent(stdout, definition.tag);
  if (raw === void 0) {
    throw new StructuredOutputError(
      `Structured output tag <${definition.tag}> not found in agent output`,
      { tag: definition.tag, rawMatched: void 0, ...context7 }
    );
  }
  return raw.trim();
};
var findLastTagContent = (text, tag2) => {
  const openTag = `<${tag2}>`;
  const closeTag = `</${tag2}>`;
  let lastContent;
  let searchFrom = 0;
  while (true) {
    const openIdx = text.indexOf(openTag, searchFrom);
    if (openIdx === -1) break;
    const contentStart = openIdx + openTag.length;
    const closeIdx = text.indexOf(closeTag, contentStart);
    if (closeIdx === -1) break;
    lastContent = text.slice(contentStart, closeIdx);
    searchFrom = closeIdx + closeTag.length;
  }
  return lastContent;
};
var unwrapFences = (text) => {
  const fenceMatch = text.match(/^```(?:json)?\s*\n([\s\S]*?)\n\s*```\s*$/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }
  return text;
};
var DEFAULT_MAX_ITERATIONS = 1;
var sanitizeBranchForFilename = (branch) => branch.replace(/[/\\:*?"<>|]/g, "-");
var resolveLogging = (options) => options.logging ?? {
  type: "file",
  path: path2.join(
    options.hostRepoDir,
    ".arsenal",
    "logs",
    buildLogFilename(options.branch, options.targetBranch, options.name)
  )
};
var buildLogFilename = (resolvedBranch, targetBranch, name) => {
  const sanitized = sanitizeBranchForFilename(resolvedBranch);
  const nameSuffix = name ? `-${name.toLowerCase().replace(/[^a-z0-9_.-]/g, "-")}` : "";
  if (targetBranch) {
    return `${sanitizeBranchForFilename(targetBranch)}-${sanitized}${nameSuffix}.log`;
  }
  return `${sanitized}${nameSuffix}.log`;
};
var buildRunSummaryRows = (options) => ({
  Agent: options.name ?? options.agentName,
  Sandbox: options.sandboxName,
  "Max iterations": String(options.maxIterations),
  Branch: options.branch
});
var buildCompletionMessage = (completionSignal, iterationsRun) => {
  if (completionSignal !== void 0) {
    return {
      message: `Run complete: agent finished after ${iterationsRun} iteration(s).`,
      severity: "success"
    };
  }
  return {
    message: `Run complete: reached ${iterationsRun} iteration(s) without completion signal.`,
    severity: "warn"
  };
};
var formatContextWindowSize = (usage) => {
  if (usage.contextTokens !== void 0 && usage.contextTokens > 0) {
    return `${Math.ceil(usage.contextTokens / 1e3)}k`;
  }
  const total = usage.inputTokens + usage.cacheCreationInputTokens + usage.cacheReadInputTokens;
  return total > 0 ? `${Math.ceil(total / 1e3)}k` : void 0;
};
var buildContextWindowLines = (iterations) => iterations.filter((it) => it.usage !== void 0).flatMap((it) => {
  const size13 = formatContextWindowSize(it.usage);
  return size13 !== void 0 ? [`Context window: ${size13}`] : [];
});
var printFileDisplayStartup = (options) => {
  const name = options.agentName ?? "Agent";
  const label = styleText("bold", `[${name}]`);
  const branchPart = options.branch ? ` on branch ${options.branch}` : "";
  const hostRepoDir = options.hostRepoDir ?? process.cwd();
  const displayLogPath = hostRepoDir === process.cwd() ? path2.relative(process.cwd(), options.logPath) : options.logPath;
  console.log(`${label} Started${branchPart}`);
  console.log(styleText("dim", `  tail -f ${displayLogPath}`));
};
var buildRunDisplayLayer = (logging, startup, stdoutLayer) => {
  if (logging.type !== "file") return stdoutLayer;
  printFileDisplayStartup({ ...startup, logPath: logging.path });
  return Layer_exports.provide(FileDisplay.layer(logging.path), layer);
};
var buildAgentStreamHandler = (logging) => {
  const userHandler = logging.onAgentStreamEvent;
  const verboseSink = logging.verbose ? buildVerboseRawLineSink(logging) : void 0;
  if (!userHandler && !verboseSink) return void 0;
  return (event) => {
    if (userHandler) {
      try {
        userHandler(event);
      } catch {
      }
    }
    if (verboseSink && event.type === "raw") {
      verboseSink(event.line);
    }
  };
};
var buildVerboseRawLineSink = (logging) => {
  if (logging.type === "file") {
    const logPath = logging.path;
    try {
      mkdirSync(path2.dirname(logPath), { recursive: true });
    } catch {
    }
    return (line) => {
      try {
        appendFileSync(logPath, line + "\n");
      } catch {
      }
    };
  }
  return (line) => {
    process.stdout.write(line + "\n");
  };
};
var toNodeOptions = (options) => ({
  encoding: "utf8",
  ...options?.cwd !== void 0 ? { cwd: options.cwd } : {},
  ...options?.env !== void 0 ? { env: { ...process.env, ...options.env } } : {},
  ...options?.signal !== void 0 ? { signal: options.signal } : {},
  ...options?.maxBuffer !== void 0 ? { maxBuffer: options.maxBuffer } : {}
});
var settle = (resume2) => (error, stdout, stderr) => {
  if (error) {
    resume2(
      Effect_exports.fail(
        new HostCommandError({
          message: error.message,
          stdout: String(stdout ?? ""),
          stderr: String(stderr ?? ""),
          exitCode: typeof error.code === "number" ? error.code : null
        })
      )
    );
  } else {
    resume2(
      Effect_exports.succeed({ stdout: String(stdout), stderr: String(stderr) })
    );
  }
};
var nodeHostProcess = {
  platform: process.platform,
  shell: (command, options) => Effect_exports.async((resume2) => {
    const child = exec(command, toNodeOptions(options), settle(resume2));
    return Effect_exports.sync(() => {
      child.kill();
    });
  }),
  run: (file, args2, options) => Effect_exports.async((resume2) => {
    const child = execFile(
      file,
      [...args2],
      toNodeOptions(options),
      settle(resume2)
    );
    return Effect_exports.sync(() => {
      child.kill();
    });
  })
};
var NodeHostProcess = {
  layer: Layer_exports.succeed(HostProcess, nodeHostProcess)
};

// src/composition/presets/runWithHost.ts
var runWithHost = (effect3) => runPromiseUnwrapped(Effect_exports.provide(effect3, NodeHostProcess.layer));

// src/composition/presets/run.ts
async function run6(options) {
  options.signal?.throwIfAborted();
  const {
    prompt,
    promptFile,
    maxIterations = DEFAULT_MAX_ITERATIONS,
    hooks,
    agent: provider
  } = options;
  const branchStrategy = resolveBranchStrategy(
    options.sandbox,
    options.branchStrategy
  );
  const effectiveBranchType = branchStrategy.type;
  if (effectiveBranchType === "head" && options.copyToWorktree && options.copyToWorktree.length > 0) {
    throw new Error(
      "copyToWorktree is not supported with head branch strategy. In head mode the host working directory is bind-mounted directly."
    );
  }
  if (options.output && maxIterations !== 1) {
    throw new Error(
      "output requires maxIterations to be 1. Structured output is only supported for single-iteration runs."
    );
  }
  const branch = branchStrategy.type === "branch" ? branchStrategy.branch : void 0;
  const { hostRepoDir, resolved, resolvedEnv, currentHostBranch } = await runWithHost(
    Effect_exports.gen(function* () {
      const [cwdResult, promptResult] = yield* Effect_exports.all(
        [
          resolveCwd(options.cwd).pipe(
            Effect_exports.provide(layer),
            Effect_exports.either
          ),
          resolvePrompt({ prompt, promptFile }).pipe(
            Effect_exports.provide(layer),
            Effect_exports.either
          )
        ],
        { concurrency: "unbounded" }
      );
      if (cwdResult._tag === "Left") return yield* Effect_exports.fail(cwdResult.left);
      const hostRepoDir2 = cwdResult.right;
      if (promptResult._tag === "Left") {
        return yield* Effect_exports.fail(promptResult.left);
      }
      const resolved2 = promptResult.right;
      const [envResult, branchResult] = yield* Effect_exports.all(
        [
          resolveEnv(hostRepoDir2).pipe(
            Effect_exports.provide(layer),
            Effect_exports.either
          ),
          getCurrentBranch(hostRepoDir2).pipe(Effect_exports.either)
        ],
        { concurrency: "unbounded" }
      );
      if (envResult._tag === "Left") return yield* Effect_exports.fail(envResult.left);
      const resolvedEnv2 = envResult.right;
      if (branchResult._tag === "Left") {
        return yield* Effect_exports.fail(branchResult.left);
      }
      const currentHostBranch2 = branchResult.right;
      return { hostRepoDir: hostRepoDir2, resolved: resolved2, resolvedEnv: resolvedEnv2, currentHostBranch: currentHostBranch2 };
    })
  );
  const rawPrompt = resolved.text;
  const isInlinePrompt = resolved.source === "inline";
  if (options.output) {
    const openTag = `<${options.output.tag}>`;
    if (!rawPrompt.includes(openTag)) {
      throw new Error(
        `output tag <${options.output.tag}> not found in the resolved prompt. The caller must instruct the agent to emit the configured tag.`
      );
    }
  }
  const agentName = provider.name;
  const env = mergeProviderEnv({
    resolvedEnv,
    agentProviderEnv: provider.env,
    sandboxProviderEnv: options.sandbox.env
  });
  const resolvedBranch = effectiveBranchType === "head" ? currentHostBranch : branch ?? generateTempBranchName(options.name);
  const targetBranch = effectiveBranchType === "merge-to-head" ? currentHostBranch : void 0;
  const resolvedLogging = resolveLogging({
    logging: options.logging,
    hostRepoDir,
    branch: resolvedBranch,
    targetBranch,
    name: options.name
  });
  const displayLayer = buildRunDisplayLayer(
    resolvedLogging,
    { agentName: options.name, branch: resolvedBranch, hostRepoDir },
    ClackDisplay.layer
  );
  const factoryLayer = Layer_exports.provide(
    WorktreeDockerSandboxFactory.layer,
    Layer_exports.mergeAll(
      Layer_exports.succeed(SandboxConfig, {
        env,
        hostRepoDir,
        copyToWorktree: options.copyToWorktree,
        name: options.name,
        sandboxProvider: options.sandbox,
        branchStrategy,
        hooks,
        signal: options.signal,
        timeouts: options.timeouts
      }),
      layer,
      displayLayer
    )
  );
  const streamEmitterLayer = agentStreamEmitterLayer(
    buildAgentStreamHandler(resolvedLogging)
  );
  const runLayer = Layer_exports.mergeAll(
    factoryLayer,
    displayLayer,
    streamEmitterLayer
  );
  const baseEffect = Effect_exports.gen(function* () {
    const d = yield* Display;
    yield* d.intro(options.name ?? "arsenal");
    const rows = buildRunSummaryRows({
      name: options.name,
      agentName,
      sandboxName: options.sandbox.name,
      maxIterations,
      branch: resolvedBranch
    });
    yield* d.summary("Arsenal Run", rows);
    const resolvedPrompt = yield* applyPromptArgs({
      rawPrompt,
      isInlinePrompt,
      userArgs: options.promptArgs ?? {},
      builtIns: {
        SOURCE_BRANCH: resolvedBranch,
        TARGET_BRANCH: currentHostBranch
      }
    });
    const orchestrateBranch = effectiveBranchType === "head" ? currentHostBranch : branch;
    const orchestrateResult = yield* orchestrate({
      hostRepoDir,
      iterations: maxIterations,
      hooks,
      prompt: resolvedPrompt,
      branch: orchestrateBranch,
      provider,
      completionSignal: options.completionSignal,
      idleTimeoutSeconds: options.idleTimeoutSeconds,
      completionTimeoutSeconds: options.completionTimeoutSeconds,
      name: options.name,
      signal: options.signal,
      skipPromptExpansion: isInlinePrompt,
      timeouts: options.timeouts,
      iterationRetries: options.iterationRetries
    });
    const completion = buildCompletionMessage(
      orchestrateResult.completionSignal,
      orchestrateResult.iterations.length
    );
    yield* d.status(completion.message, completion.severity);
    for (const line of buildContextWindowLines(orchestrateResult.iterations)) {
      yield* d.text(line);
    }
    return orchestrateResult;
  });
  const withErrorLog = resolvedLogging.type === "file" ? baseEffect.pipe(
    Effect_exports.tapError(
      (error) => Effect_exports.gen(function* () {
        const d = yield* Display;
        yield* d.status(
          formatErrorMessage(error),
          "error"
        );
      })
    )
  ) : baseEffect;
  let result;
  try {
    result = await runWithHost(withErrorLog.pipe(Effect_exports.provide(runLayer)));
  } catch (error) {
    options.signal?.throwIfAborted();
    throw error;
  }
  const baseResult = {
    ...result,
    logFilePath: resolvedLogging.type === "file" ? resolvedLogging.path : void 0
  };
  if (options.output) {
    const lastIteration = baseResult.iterations.at(-1);
    const output = await extractStructuredOutput(
      baseResult.stdout,
      options.output,
      {
        commits: baseResult.commits,
        branch: baseResult.branch,
        preservedWorktreePath: baseResult.preservedWorktreePath,
        sessionId: lastIteration?.sessionId
      }
    );
    return { ...baseResult, output };
  }
  return baseResult;
}

// src/composition/primitives/invokeAgent.ts
var invokeAgent = (options) => runPromiseUnwrapped(invokeAgentEffect(options));
var toExitCode = (code, signal) => code ?? (signal ? 128 + constants.signals[signal] : 0);
var localExecutor = (cwd, env = {}) => {
  const processEnv = { ...process.env, ...env };
  return {
    exec: (command, opts) => runPromiseUnwrapped(
      Effect_exports.tryPromise({
        try: () => new Promise((resolve3, reject) => {
          const isWindows = process.platform === "win32";
          const shellCmd = isWindows ? "cmd.exe" : "sh";
          const shellArgs = isWindows ? ["/d", "/s", "/c", command] : ["-c", command];
          const proc = spawn(shellCmd, shellArgs, {
            cwd: opts?.cwd ?? cwd,
            env: processEnv,
            stdio: [
              opts?.stdin !== void 0 ? "pipe" : "ignore",
              "pipe",
              "pipe"
            ],
            windowsVerbatimArguments: isWindows
          });
          if (opts?.stdin !== void 0) {
            proc.stdin.write(opts.stdin);
            proc.stdin.end();
          }
          proc.on(
            "error",
            (e) => reject(new Error(`exec failed: ${e.message}`))
          );
          const stdoutChunks = [];
          const stderrChunks = [];
          proc.stdout.on(
            "data",
            (chunk3) => stdoutChunks.push(chunk3.toString())
          );
          proc.stderr.on(
            "data",
            (chunk3) => stderrChunks.push(chunk3.toString())
          );
          proc.on(
            "close",
            (code, signal) => resolve3({
              stdout: stdoutChunks.join(""),
              stderr: stderrChunks.join(""),
              exitCode: toExitCode(code, signal)
            })
          );
        }),
        catch: (e) => new ExecError({
          command,
          message: `exec failed: ${e instanceof Error ? e.message : String(e)}`
        })
      })
    ),
    interactiveExec: (args2, opts) => new Promise((resolve3, reject) => {
      const [cmd, ...rest] = args2;
      const proc = spawn(cmd, rest, {
        cwd: opts.cwd ?? cwd,
        env: processEnv,
        stdio: ["pipe", "pipe", "inherit"],
        shell: process.platform === "win32"
      });
      opts.stdin.pipe(proc.stdin);
      proc.stdout.pipe(opts.stdout);
      proc.on("error", (e) => reject(new Error(`exec failed: ${e.message}`)));
      proc.on(
        "close",
        (code, signal) => resolve3({ exitCode: toExitCode(code, signal) })
      );
    })
  };
};

// src/composition/primitives/withWorktree.ts
async function withWorktree(options, work) {
  const branchStrategy = resolveBranchStrategy(
    options.sandbox,
    options.branchStrategy
  );
  const hostRepoDir = await Effect_exports.runPromise(
    resolveCwd(options.cwd).pipe(Effect_exports.provide(layer))
  );
  const resolvedEnv = await Effect_exports.runPromise(
    resolveEnv(hostRepoDir).pipe(Effect_exports.provide(layer))
  );
  const env = mergeProviderEnv({
    resolvedEnv,
    agentProviderEnv: options.agent.env,
    sandboxProviderEnv: options.sandbox.env
  });
  const factoryLayer = Layer_exports.provide(
    WorktreeDockerSandboxFactory.layer,
    Layer_exports.mergeAll(
      Layer_exports.succeed(SandboxConfig, {
        env,
        hostRepoDir,
        copyToWorktree: options.copyToWorktree,
        name: options.name,
        sandboxProvider: options.sandbox,
        branchStrategy,
        hooks: options.hooks,
        signal: options.signal,
        timeouts: options.timeouts
      }),
      layer,
      ClackDisplay.layer
    )
  );
  const runLayer = Layer_exports.mergeAll(
    factoryLayer,
    ClackDisplay.layer,
    agentStreamEmitterLayer(() => {
    })
  );
  const program = Effect_exports.gen(function* () {
    const factory = yield* SandboxFactory;
    const sandboxResult = yield* factory.withSandbox(
      ({ sandboxRepoPath, hostWorktreePath, applyToHost }, sandbox3) => withSandboxLifecycle(
        {
          hostRepoDir,
          sandboxRepoDir: sandboxRepoPath,
          hooks: options.hooks,
          // Named-branch strategies carry the branch on the strategy
          // itself; derive it from there so the lifecycle doesn't fall
          // back to merge-to-head just because the caller didn't also
          // duplicate it onto `options.branch`.
          branch: branchStrategy.type === "branch" ? branchStrategy.branch : options.branch,
          hostWorktreePath,
          applyToHost,
          signal: options.signal,
          timeouts: options.timeouts
        },
        sandbox3,
        // The callback's own errors are not SandboxErrors: carry them as
        // defects so they reach the caller unchanged (see below).
        (ctx) => {
          const sandbox4 = toSandboxCommands(ctx.sandbox);
          return Effect_exports.promise(
            () => work({
              executor: sandboxExecutor(sandbox4),
              sandbox: sandbox4,
              cwd: ctx.sandboxRepoDir
            })
          );
        }
      )
    );
    const lifecycleResult = sandboxResult.value;
    return {
      value: lifecycleResult.result,
      commits: lifecycleResult.commits,
      branch: lifecycleResult.branch,
      preservedWorktreePath: sandboxResult.preservedWorktreePath
    };
  }).pipe(Effect_exports.provide(runLayer));
  return runPromiseUnwrapped(Effect_exports.provide(program, NodeHostProcess.layer));
}

// src/composition/primitives/withHooks.ts
async function withHooks(hooks, options, work) {
  const { cwd, sandbox: sandbox3, signal } = options;
  const sandboxCwd = options.sandboxCwd ?? cwd;
  const effectiveSignal = signal ?? new AbortController().signal;
  await runPromiseUnwrapped(
    Effect_exports.gen(function* () {
      const worktreeReadyHooks = hooks.host?.onWorktreeReady ?? [];
      if (worktreeReadyHooks.length > 0) {
        yield* runHostHooks(worktreeReadyHooks, cwd, signal);
      }
      const hostSandboxReadyHooks = hooks.host?.onSandboxReady ?? [];
      if (hostSandboxReadyHooks.length > 0) {
        yield* runHostHooks(hostSandboxReadyHooks, cwd, signal);
      }
      const sandboxReadyHooks = hooks.sandbox?.onSandboxReady ?? [];
      if (sandboxReadyHooks.length > 0) {
        if (!sandbox3)
          throw new Error(
            "withHooks: sandbox is required when hooks.sandbox.onSandboxReady is set"
          );
        yield* runSandboxHooksWithAbort(
          fromSandboxCommands(sandbox3),
          sandboxCwd,
          sandboxReadyHooks,
          effectiveSignal
        );
      }
    }).pipe(Effect_exports.provide(NodeHostProcess.layer))
  );
  return work();
}

// src/composition/primitives/iterate.ts
var toError2 = (e) => e instanceof Error ? e : new Error(String(e));
async function iterate4(options, work) {
  return runPromiseUnwrapped(
    runIterationLoop(
      {
        maxIterations: options.maxIterations ?? 1,
        iterationRetries: options.iterationRetries ?? 0,
        signal: options.signal,
        onRetry: options.onRetry ? (e, attempt, maxRetries) => Effect_exports.sync(
          () => options.onRetry(toError2(e), attempt, maxRetries)
        ) : void 0,
        shouldStop: options.shouldStop
      },
      (i) => Effect_exports.tryPromise({ try: () => work(i), catch: (e) => e })
    )
  );
}

// src/platform/node/shutdownRegistry.ts
var teardownCallbacks = /* @__PURE__ */ new Set();
var listenersInstalled = false;
var runTeardowns = () => {
  for (const teardown of teardownCallbacks) {
    try {
      teardown();
    } catch {
    }
  }
};
var handleExit = () => {
  runTeardowns();
};
var handleSignal = () => {
  detachListeners();
  runTeardowns();
  process.exit(1);
};
var attachListeners = () => {
  if (listenersInstalled) return;
  listenersInstalled = true;
  process.on("exit", handleExit);
  process.on("SIGINT", handleSignal);
  process.on("SIGTERM", handleSignal);
};
var detachListeners = () => {
  if (!listenersInstalled) return;
  listenersInstalled = false;
  process.removeListener("exit", handleExit);
  process.removeListener("SIGINT", handleSignal);
  process.removeListener("SIGTERM", handleSignal);
};
var registerShutdown = (teardown) => {
  teardownCallbacks.add(teardown);
  attachListeners();
  let active2 = true;
  return () => {
    if (!active2) return;
    active2 = false;
    teardownCallbacks.delete(teardown);
    if (teardownCallbacks.size === 0) detachListeners();
  };
};

// src/utils/shellQuote.ts
var shellQuote = (value) => `'${value.replace(/'/g, `'\\''`)}'`;

// src/application/sandbox/worktree/worktreeSandbox.ts
var startWorktreeSandbox = (options) => Effect_exports.gen(function* () {
  const { provider, hostRepoDir, worktreePath } = options;
  if (options.buildTestSandbox) {
    return {
      providerHandle: void 0,
      sandbox: options.buildTestSandbox(worktreePath),
      sandboxRepoDir: worktreePath
    };
  }
  const resolvedEnv = yield* resolveEnv(hostRepoDir);
  const env = mergeProviderEnv({
    resolvedEnv,
    agentProviderEnv: {},
    sandboxProviderEnv: provider.env
  });
  const started = provider.tag === "isolated" ? yield* launchSandboxHandle({
    provider,
    hostRepoDir: worktreePath,
    env,
    copyPaths: options.copyToWorktree
  }) : provider.tag === "none" ? yield* launchSandboxHandle({
    provider,
    hostRepoDir,
    env,
    worktreeOrRepoPath: worktreePath
  }) : (
    // A failure to resolve git mounts must fail the sandbox start, not
    // silently start it with no git mounts at all.
    yield* resolveAndPatchGitMounts(hostRepoDir, worktreePath).pipe(
      Effect_exports.flatMap(
        (gitMounts) => launchSandboxHandle({
          provider,
          hostRepoDir,
          env,
          worktreeOrRepoPath: worktreePath,
          gitMounts,
          repoDir: SANDBOX_REPO_DIR
        })
      )
    )
  );
  return {
    providerHandle: started.handle,
    sandbox: started.sandbox,
    sandboxRepoDir: started.worktreePath
  };
});
var runSandboxReadyHooks = ({ sandbox: sandbox3, sandboxRepoDir }, worktreePath, hooks) => Effect_exports.gen(function* () {
  const sandboxOnReady = hooks?.sandbox?.onSandboxReady ?? [];
  const hostOnReady = hooks?.host?.onSandboxReady ?? [];
  if (sandboxOnReady.length === 0 && hostOnReady.length === 0) return;
  yield* execOk(
    sandbox3,
    `git config --global --add safe.directory ${shellQuote(sandboxRepoDir)}`
  );
  const effects = sandboxOnReady.map((hook) => {
    const timeout4 = hook.timeoutMs ?? HOOK_TIMEOUT_MS;
    return execOk(sandbox3, hook.command, {
      cwd: sandboxRepoDir,
      sudo: hook.sudo
    }).pipe(
      withTimeout(
        timeout4,
        () => new HookTimeoutError({
          message: `Hook '${hook.command}' timed out after ${timeout4}ms`,
          timeoutMs: timeout4,
          command: hook.command
        })
      )
    );
  });
  if (hostOnReady.length > 0) {
    effects.push(runHostHooks(hostOnReady, worktreePath));
  }
  yield* Effect_exports.all(effects, { concurrency: "unbounded" });
});

// src/composition/presets/sandboxHandle.ts
var buildSandboxHandle = (ctx, close2) => {
  const {
    branch,
    worktreePath,
    hostRepoDir,
    sandboxRepoDir,
    sandbox: sandbox3,
    providerHandle,
    applyToHost,
    timeouts,
    branchStrategy
  } = ctx;
  const mergeToHead = branchStrategy?.type === "merge-to-head";
  const sandboxHandle = {
    branch,
    worktreePath,
    runAgent: async (runOptions) => {
      runOptions.signal?.throwIfAborted();
      const {
        agent: provider,
        prompt,
        promptFile,
        maxIterations = 1
      } = runOptions;
      const resolved = await runWithHost(
        resolvePrompt({ prompt, promptFile }).pipe(
          Effect_exports.provide(layer)
        )
      );
      const rawPrompt = resolved.text;
      const isInlinePrompt = resolved.source === "inline";
      const currentHostBranch = await runWithHost(
        getCurrentBranch(hostRepoDir)
      );
      const displayRef = Ref_exports.unsafeMake([]);
      const silentDisplayLayer = SilentDisplay.layer(displayRef);
      const resolvedPrompt = await runWithHost(
        applyPromptArgs({
          rawPrompt,
          isInlinePrompt,
          userArgs: runOptions.promptArgs ?? {},
          builtIns: { SOURCE_BRANCH: branch, TARGET_BRANCH: currentHostBranch }
        }).pipe(Effect_exports.provide(silentDisplayLayer))
      );
      const resolvedLogging = resolveLogging({
        logging: runOptions.logging,
        hostRepoDir,
        branch,
        name: runOptions.name
      });
      const runDisplayLayer = buildRunDisplayLayer(
        resolvedLogging,
        { agentName: runOptions.name, branch, hostRepoDir },
        silentDisplayLayer
      );
      const reuseFactoryLayer = Layer_exports.succeed(SandboxFactory, {
        withSandbox: (makeEffect) => makeEffect(
          {
            hostWorktreePath: worktreePath,
            sandboxRepoPath: sandboxRepoDir,
            applyToHost
          },
          sandbox3
        ).pipe(
          Effect_exports.map((value) => ({
            value,
            preservedWorktreePath: void 0
          }))
        )
      });
      const streamEmitterLayer = agentStreamEmitterLayer(
        buildAgentStreamHandler(resolvedLogging)
      );
      const runLayer = Layer_exports.mergeAll(
        reuseFactoryLayer,
        runDisplayLayer,
        streamEmitterLayer
      );
      let result;
      try {
        result = await runWithHost(
          Effect_exports.gen(function* () {
            const display = yield* Display;
            yield* display.intro(runOptions.name ?? "arsenal");
            const orchestrateResult = yield* orchestrate({
              hostRepoDir,
              iterations: maxIterations,
              prompt: resolvedPrompt,
              branch: mergeToHead ? void 0 : branch,
              provider,
              completionSignal: runOptions.completionSignal,
              idleTimeoutSeconds: runOptions.idleTimeoutSeconds,
              completionTimeoutSeconds: runOptions.completionTimeoutSeconds,
              name: runOptions.name,
              iterationRetries: runOptions.iterationRetries,
              signal: runOptions.signal,
              skipPromptExpansion: isInlinePrompt,
              timeouts,
              keepSourceBranch: mergeToHead
            });
            const completion = buildCompletionMessage(
              orchestrateResult.completionSignal,
              orchestrateResult.iterations.length
            );
            yield* display.status(completion.message, completion.severity);
            for (const line of buildContextWindowLines(
              orchestrateResult.iterations
            )) {
              yield* display.text(line);
            }
            return orchestrateResult;
          }).pipe(Effect_exports.provide(runLayer))
        );
      } catch (error) {
        runOptions.signal?.throwIfAborted();
        throw error;
      }
      return {
        iterations: result.iterations,
        completionSignal: result.completionSignal,
        stdout: result.stdout,
        commits: result.commits,
        logFilePath: resolvedLogging.type === "file" ? resolvedLogging.path : void 0
      };
    },
    interactive: async (interactiveOptions) => {
      interactiveOptions.signal?.throwIfAborted();
      const { agent: provider, prompt, promptFile } = interactiveOptions;
      if (typeof provider.buildAcpArgs !== "function" || typeof provider.parseAcpUpdate !== "function") {
        throw new Error(
          `Agent provider "${provider.name}" does not support buildAcpArgs or parseAcpUpdate, required for interactive sessions.`
        );
      }
      if (!providerHandle?.interactiveExec) {
        throw new Error(
          `Sandbox provider does not support interactiveExec. The provider must implement the optional interactiveExec method to use .interactive().`
        );
      }
      const interactiveExecFn = providerHandle.interactiveExec.bind(providerHandle);
      let lifecycleResult;
      try {
        lifecycleResult = await runWithHost(
          Effect_exports.gen(function* () {
            const resolved = yield* resolvePrompt({ prompt, promptFile });
            const rawPrompt = resolved.text;
            const isInlinePrompt = resolved.source === "inline";
            const currentHostBranch = yield* getCurrentBranch(hostRepoDir);
            const resolvedPrompt = yield* applyPromptArgs({
              rawPrompt,
              isInlinePrompt,
              userArgs: interactiveOptions.promptArgs ?? {},
              builtIns: {
                SOURCE_BRANCH: branch,
                TARGET_BRANCH: currentHostBranch
              }
            });
            return yield* withSandboxLifecycle(
              {
                hostRepoDir,
                sandboxRepoDir,
                branch: mergeToHead ? void 0 : branch,
                hostWorktreePath: worktreePath,
                applyToHost,
                timeouts,
                keepSourceBranch: mergeToHead
              },
              sandbox3,
              (ctx2) => Effect_exports.gen(function* () {
                const fullPrompt = isInlinePrompt ? resolvedPrompt : yield* preprocessPrompt(
                  resolvedPrompt,
                  ctx2.sandbox,
                  ctx2.sandboxRepoDir
                );
                const acpTextBuffer = new TextDeltaBuffer((chunk3) => {
                  process.stdout.write(chunk3);
                });
                const { exitCode } = yield* Effect_exports.promise(
                  () => runAcpSession({
                    provider,
                    interactiveExec: interactiveExecFn,
                    cwd: ctx2.sandboxRepoDir,
                    prompt: fullPrompt,
                    onEvent: (event) => {
                      if (event.type === "text") {
                        acpTextBuffer.write(event.text);
                      } else if (event.type === "tool_call") {
                        acpTextBuffer.flush();
                        process.stdout.write(
                          `[tool] ${event.name}  ${event.args}
`
                        );
                      }
                    },
                    signal: interactiveOptions.signal
                  })
                );
                acpTextBuffer.flush();
                return exitCode;
              })
            );
          }).pipe(
            Effect_exports.provide(ClackDisplay.layer),
            Effect_exports.provide(layer)
          )
        );
      } catch (error) {
        interactiveOptions.signal?.throwIfAborted();
        throw error;
      }
      return {
        commits: lifecycleResult.commits,
        exitCode: lifecycleResult.result
      };
    },
    exec: async (command, options) => {
      const mergedOptions = { cwd: sandboxRepoDir, ...options };
      if (providerHandle) {
        return providerHandle.exec(command, mergedOptions);
      }
      return runWithHost(sandbox3.exec(command, mergedOptions));
    },
    close: async () => close2(),
    [Symbol.asyncDispose]: async () => {
      await sandboxHandle.close();
    }
  };
  return sandboxHandle;
};

// src/composition/presets/createSandbox.ts
var makeApplyToHost = (isIsolated, providerHandle, worktreePath) => isIsolated && providerHandle ? () => syncOut(worktreePath, providerHandle).pipe(
  Effect_exports.flatMap(alertSyncOutRecovery),
  Effect_exports.provide(ClackDisplay.layer),
  Effect_exports.provide(NodeHostProcess.layer)
) : () => Effect_exports.void;
var createSandboxFromWorktree = async (options) => {
  const { branch, worktreePath, hostRepoDir } = options;
  const { isolated: isIsolated } = providerTraits(options.sandbox);
  if (options.copyToWorktree && options.copyToWorktree.length > 0 && !isIsolated) {
    await runWithHost(
      copyToWorktree(
        options.copyToWorktree,
        hostRepoDir,
        worktreePath,
        options.timeouts?.copyToWorktreeMs
      )
    );
  }
  const started = await runWithHost(
    startWorktreeSandbox({
      provider: options.sandbox,
      hostRepoDir,
      worktreePath,
      copyToWorktree: options.copyToWorktree,
      buildTestSandbox: options._test?.buildSandbox
    }).pipe(Effect_exports.provide(layer))
  );
  await runWithHost(runSandboxReadyHooks(started, worktreePath, options.hooks));
  const { providerHandle, sandbox: sandbox3, sandboxRepoDir } = started;
  let closed = false;
  return buildSandboxHandle(
    {
      branch,
      worktreePath,
      hostRepoDir,
      sandboxRepoDir,
      sandbox: sandbox3,
      providerHandle,
      applyToHost: makeApplyToHost(isIsolated, providerHandle, worktreePath),
      timeouts: options.timeouts,
      branchStrategy: options.branchStrategy
    },
    async () => {
      if (closed) return { preservedWorktreePath: void 0 };
      closed = true;
      if (providerHandle) await providerHandle.close();
      return { preservedWorktreePath: void 0 };
    }
  );
};
var createSandbox = async (options) => {
  const { branch } = options;
  const { isolated: isIsolated } = providerTraits(options.sandbox);
  const { hostRepoDir, worktreePath, providerHandle, sandbox: sandbox3, sandboxRepoDir } = await runWithHost(
    Effect_exports.gen(function* () {
      const hostRepoDir2 = yield* resolveCwd(options.cwd);
      yield* pruneStale(hostRepoDir2).pipe(
        Effect_exports.catchAll(() => Effect_exports.void)
      );
      const { path: worktreePath2, reused: worktreeReused } = yield* create(hostRepoDir2, {
        branch,
        baseBranch: options.baseBranch
      });
      const prepared = yield* Effect_exports.gen(function* () {
        if (options.copyToWorktree && options.copyToWorktree.length > 0 && !isIsolated) {
          yield* copyToWorktree(
            options.copyToWorktree,
            hostRepoDir2,
            worktreePath2,
            options.timeouts?.copyToWorktreeMs
          );
        }
        if (options.hooks?.host?.onWorktreeReady?.length) {
          yield* runHostHooks(
            options.hooks.host.onWorktreeReady,
            worktreePath2
          );
        }
        const started = yield* startWorktreeSandbox({
          provider: options.sandbox,
          hostRepoDir: hostRepoDir2,
          worktreePath: worktreePath2,
          copyToWorktree: options.copyToWorktree,
          buildTestSandbox: options._test?.buildSandbox
        });
        yield* runSandboxReadyHooks(
          started,
          worktreePath2,
          options.hooks
        ).pipe(
          Effect_exports.onError(
            () => started.providerHandle ? Effect_exports.promise(
              () => started.providerHandle.close().catch(() => {
              })
            ) : Effect_exports.void
          )
        );
        return started;
      }).pipe(
        Effect_exports.onError(
          () => (
            // A reused worktree belongs to whoever created it originally —
            // never force-remove it here. Only clean up a worktree this call
            // itself created, and only if it has no uncommitted changes.
            worktreeReused ? Effect_exports.void : hasUncommittedChanges(worktreePath2).pipe(
              Effect_exports.catchAll(() => Effect_exports.succeed(false)),
              Effect_exports.flatMap(
                (isDirty) => isDirty ? Effect_exports.void : remove8(worktreePath2).pipe(
                  Effect_exports.catchAll(() => Effect_exports.void)
                )
              )
            )
          )
        )
      );
      return { hostRepoDir: hostRepoDir2, worktreePath: worktreePath2, ...prepared };
    }).pipe(
      Effect_exports.provide(ClackDisplay.layer),
      Effect_exports.provide(layer)
    )
  );
  let closed = false;
  let closeResult;
  const forceCleanup = () => {
    console.error(`
Worktree preserved at ${worktreePath}`);
    console.error(`  To review: cd ${worktreePath}`);
    console.error(`  To clean up: git worktree remove --force ${worktreePath}`);
  };
  const unregisterShutdown = registerShutdown(forceCleanup);
  const doClose = async () => {
    if (closed) return closeResult;
    let closeError;
    if (providerHandle) {
      try {
        await providerHandle.close();
      } catch (error) {
        closeError = error;
      }
    }
    const result = await runWithHost(
      Effect_exports.gen(function* () {
        const isDirty = yield* hasUncommittedChanges(
          worktreePath
        ).pipe(Effect_exports.catchAll(() => Effect_exports.succeed(false)));
        if (isDirty) {
          yield* alertWorktreePreserved(
            worktreePath,
            `Worktree preserved at ${worktreePath}`
          );
          return { preservedWorktreePath: worktreePath };
        }
        yield* remove8(worktreePath).pipe(
          Effect_exports.catchAll(() => Effect_exports.void)
        );
        return { preservedWorktreePath: void 0 };
      }).pipe(Effect_exports.provide(ClackDisplay.layer))
    );
    closed = true;
    closeResult = result;
    unregisterShutdown();
    if (closeError) throw closeError;
    return result;
  };
  return buildSandboxHandle(
    {
      branch,
      worktreePath,
      hostRepoDir,
      sandboxRepoDir,
      sandbox: sandbox3,
      providerHandle,
      applyToHost: makeApplyToHost(isIsolated, providerHandle, worktreePath),
      timeouts: options.timeouts
    },
    doClose
  );
};

// src/composition/presets/createWorktree.ts
var createWorktree = async (options) => {
  const branch = options.branchStrategy.type === "branch" ? options.branchStrategy.branch : void 0;
  const baseBranch = options.branchStrategy.type === "branch" ? options.branchStrategy.baseBranch : void 0;
  const isMergeToHead = options.branchStrategy.type === "merge-to-head";
  const { hostRepoDir, worktreeInfo } = await Effect_exports.gen(function* () {
    const hostRepoDir2 = yield* resolveCwd(options.cwd);
    yield* pruneStale(hostRepoDir2).pipe(
      Effect_exports.catchAll(() => Effect_exports.void)
    );
    const info = yield* create(hostRepoDir2, {
      branch,
      baseBranch
    });
    if (options.copyToWorktree && options.copyToWorktree.length > 0) {
      yield* copyToWorktree(
        options.copyToWorktree,
        hostRepoDir2,
        info.path,
        options.timeouts?.copyToWorktreeMs
      );
    }
    if (options.hooks?.host?.onWorktreeReady?.length) {
      yield* runHostHooks(options.hooks.host.onWorktreeReady, info.path);
    }
    return { hostRepoDir: hostRepoDir2, worktreeInfo: info };
  }).pipe(
    Effect_exports.provide(ClackDisplay.layer),
    Effect_exports.provide(layer),
    Effect_exports.provide(NodeHostProcess.layer),
    Effect_exports.runPromise
  );
  let closed = false;
  const close2 = async () => {
    if (closed) return { preservedWorktreePath: void 0 };
    closed = true;
    return Effect_exports.gen(function* () {
      const isDirty = yield* hasUncommittedChanges(
        worktreeInfo.path
      ).pipe(Effect_exports.catchAll(() => Effect_exports.succeed(false)));
      if (isDirty) {
        yield* alertWorktreePreserved(
          worktreeInfo.path,
          `Worktree preserved at ${worktreeInfo.path}`
        );
        return { preservedWorktreePath: worktreeInfo.path };
      }
      yield* remove8(worktreeInfo.path).pipe(
        Effect_exports.catchAll(() => Effect_exports.void)
      );
      return { preservedWorktreePath: void 0 };
    }).pipe(
      Effect_exports.provide(ClackDisplay.layer),
      Effect_exports.provide(NodeHostProcess.layer),
      Effect_exports.runPromise
    );
  };
  const worktreeRun = async (opts) => {
    opts.signal?.throwIfAborted();
    const { prompt, promptFile, hooks, agent: provider } = opts;
    const sandboxProvider = opts.sandbox;
    const maxIterations = opts.maxIterations ?? 1;
    const inner = Effect_exports.gen(function* () {
      const resolved = yield* resolvePrompt({ prompt, promptFile });
      const rawPrompt = resolved.text;
      const isInlinePrompt = resolved.source === "inline";
      const resolvedEnv = yield* resolveEnv(hostRepoDir);
      const env = mergeProviderEnv({
        resolvedEnv,
        agentProviderEnv: provider.env,
        sandboxProviderEnv: sandboxProvider.env
      });
      const effectiveEnv = { ...env, ...opts.env ?? {} };
      const resolvedPrompt = yield* applyPromptArgs({
        rawPrompt,
        isInlinePrompt,
        userArgs: opts.promptArgs ?? {},
        builtIns: {
          SOURCE_BRANCH: worktreeInfo.branch,
          TARGET_BRANCH: worktreeInfo.branch
        }
      });
      const { handle, sandbox: sandbox3, sandboxInfo } = yield* startSandboxAgainstTarget(
        {
          env: effectiveEnv,
          hostRepoDir,
          targetPath: worktreeInfo.path,
          sandboxProvider,
          hooks,
          signal: opts.signal,
          timeouts: options.timeouts
        }
      );
      sandboxInfo.sandboxRepoPath;
      const resolvedLogging = resolveLogging({
        logging: opts.logging,
        hostRepoDir,
        branch: worktreeInfo.branch,
        name: opts.name
      });
      const runDisplayLayer = buildRunDisplayLayer(
        resolvedLogging,
        { agentName: opts.name, branch: worktreeInfo.branch, hostRepoDir },
        ClackDisplay.layer
      );
      const reuseFactoryLayer = Layer_exports.succeed(SandboxFactory, {
        withSandbox: (makeEffect) => makeEffect(sandboxInfo, sandbox3).pipe(
          Effect_exports.map((value) => ({
            value,
            preservedWorktreePath: void 0
          }))
        )
      });
      const streamEmitterLayer = agentStreamEmitterLayer(
        buildAgentStreamHandler(resolvedLogging)
      );
      const runLayer = Layer_exports.mergeAll(
        reuseFactoryLayer,
        runDisplayLayer,
        streamEmitterLayer
      );
      const result = yield* Effect_exports.gen(function* () {
        const display = yield* Display;
        yield* display.intro(opts.name ?? "arsenal");
        const orchestrateResult = yield* orchestrate({
          hostRepoDir,
          iterations: maxIterations,
          hooks,
          prompt: resolvedPrompt,
          // merge-to-head: pass `undefined` so the lifecycle records the host's
          // current branch and routes through the merge step. branch strategy:
          // pin to the worktree's branch so commits stay there.
          branch: isMergeToHead ? void 0 : worktreeInfo.branch,
          provider,
          completionSignal: opts.completionSignal,
          idleTimeoutSeconds: opts.idleTimeoutSeconds,
          completionTimeoutSeconds: opts.completionTimeoutSeconds,
          name: opts.name,
          iterationRetries: opts.iterationRetries,
          signal: opts.signal,
          skipPromptExpansion: isInlinePrompt,
          timeouts: options.timeouts,
          keepSourceBranch: isMergeToHead
        });
        const completion = buildCompletionMessage(
          orchestrateResult.completionSignal,
          orchestrateResult.iterations.length
        );
        yield* display.status(completion.message, completion.severity);
        for (const line of buildContextWindowLines(
          orchestrateResult.iterations
        )) {
          yield* display.text(line);
        }
        return orchestrateResult;
      }).pipe(
        Effect_exports.provide(runLayer),
        // Always close sandbox handle
        Effect_exports.ensuring(Effect_exports.promise(() => handle.close().catch(() => {
        })))
      );
      return {
        iterations: result.iterations,
        completionSignal: result.completionSignal,
        stdout: result.stdout,
        commits: result.commits,
        branch: result.branch,
        logFilePath: resolvedLogging.type === "file" ? resolvedLogging.path : void 0
      };
    });
    try {
      return await Effect_exports.runPromise(
        inner.pipe(
          Effect_exports.provide(ClackDisplay.layer),
          Effect_exports.provide(layer),
          Effect_exports.provide(layer),
          Effect_exports.provide(NodeHostProcess.layer)
        )
      );
    } catch (error) {
      opts.signal?.throwIfAborted();
      throw error;
    }
  };
  const worktreeCreateSandbox = async (opts) => {
    return createSandboxFromWorktree({
      branch: worktreeInfo.branch,
      worktreePath: worktreeInfo.path,
      hostRepoDir,
      sandbox: opts.sandbox,
      hooks: opts.hooks,
      copyToWorktree: opts.copyToWorktree,
      timeouts: opts.timeouts,
      branchStrategy: options.branchStrategy,
      _test: opts._test
    });
  };
  return {
    branch: worktreeInfo.branch,
    worktreePath: worktreeInfo.path,
    runAgent: worktreeRun,
    attachSandbox: worktreeCreateSandbox,
    close: close2,
    async [Symbol.asyncDispose]() {
      await close2();
    }
  };
};

// src/errors/CwdError.ts
var CwdError2 = CwdError;

export { CwdError2 as CwdError, Output, StructuredOutputError, createBindMountSandboxProvider, createIsolatedSandboxProvider, createSandbox, createWorktree, invokeAgent, iterate4 as iterate, localExecutor, matchCompletionSignal, run6 as run, sandboxExecutor, withHooks, withWorktree };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map