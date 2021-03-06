
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro ??? we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro ??? needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.44.2 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (251:0) {:else}
    function create_else_block$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$6(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/qrng/Qrng.svelte generated by Svelte v3.44.2 */

    const file$f = "src/pages/qrng/Qrng.svelte";

    function create_fragment$f(ctx) {
    	let div6;
    	let div0;
    	let t1;
    	let div1;
    	let p0;
    	let t3;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let div5;
    	let p1;
    	let t6;
    	let div4;
    	let div2;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let div3;
    	let img2;
    	let img2_src_value;
    	let t8;
    	let p2;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div0 = element("div");
    			div0.textContent = "IT QRNG";
    			t1 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Reliable randomness sources are in increasing demand across many key fields such as cryptography and other information technologies. Standard classical approaches for random number generation cannot produce truly unpredictable outcomes and are thus unsuitable for security-critical applications. On the other hand, the intrinsic statistical properties of quantum mechanics can be explored to obtain values that are truly unpredictable.";
    			t3 = space();
    			img0 = element("img");
    			t4 = space();
    			div5 = element("div");
    			p1 = element("p");
    			p1.textContent = "Our approach harnesses measurements from a quantum noise source to derive true randomness, which is not accessible to an adversary. We have chosen to probe the quantum fluctuations in the vacuum of the electromagnetic field by employing a homodyne detection scheme. As can be seen in the schematic above, by sending a laser through a beam splitter, we allow it to interact with the vacuum state, whose fluctuations will be present in the output beams. These are subsequently measured by two detectors and the resulting signals are subtracted. In a classical description, we would expect the output beams to be identical and no signal to remain. By contrast, here, the random quantum noise is still observable, and a signal proportional to the inherently probabilistic quadrature fluctuations of the optical vacuum state can be measured. Despite this, some additional classical noise is also inevitably introduced by the operation of the intrinsically imperfect hardware devices. Consequently, after quantifying the portion of entropy that originates from the vacuum fluctuations, the measurements are subjected to a randomness extraction algorithm that sacrifices a portion of the output to obtain a uniform distribution.";
    			t6 = space();
    			div4 = element("div");
    			div2 = element("div");
    			img1 = element("img");
    			t7 = space();
    			div3 = element("div");
    			img2 = element("img");
    			t8 = space();
    			p2 = element("p");
    			p2.textContent = "Unlike other approaches, the real-time Toeplitz matrix hashing algorithm implemented efficiently extracts information-theoretically secure numbers at a rate of approximately 75 Mbit/s. This approach already supports real-time generation rates up to 8.23 Gbit/s, with the quality of the output being certified by applying on-demand statistical validation. In fact, the generation scheme has been shown to pass all evaluations in the standard NIST, Dieharder, and TestU01's SmallCrush statistical test suites.";
    			attr_dev(div0, "class", "ml-4 text-2xl mb-4 font-bold");
    			add_location(div0, file$f, 5, 4, 69);
    			add_location(p0, file$f, 7, 8, 157);
    			attr_dev(img0, "class", "mx-auto mt-4 w-5/6");
    			if (!src_url_equal(img0.src, img0_src_value = "assets/images/QRNG_schema.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Schematic representation of the quantum random number generator implemented. The scheme can be divided into two mains blocks: the physical layer, which measures the entropy source through homodyne detection, and the postprocessing layer, which eliminates the contributions of classical sources such as electronic noise.");
    			add_location(img0, file$f, 12, 8, 644);
    			attr_dev(div1, "class", "mb-10");
    			add_location(div1, file$f, 6, 4, 129);
    			add_location(p1, file$f, 16, 8, 1073);
    			attr_dev(img1, "class", "mx-auto w-1/2");
    			if (!src_url_equal(img1.src, img1_src_value = "assets/images/physical_qrng.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Quantum random number generator as implemented at Instituto de Telecomunica????es");
    			add_location(img1, file$f, 22, 16, 2410);
    			attr_dev(div2, "class", "flex-1");
    			add_location(div2, file$f, 21, 12, 2373);
    			attr_dev(img2, "class", "mx-auto w-1/2");
    			if (!src_url_equal(img2.src, img2_src_value = "assets/images/noise_sample.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Bitmap (500x500) with the extracted true random bits showing a clear absence of any evident patterns.");
    			add_location(img2, file$f, 25, 16, 2630);
    			attr_dev(div3, "class", "flex-1");
    			add_location(div3, file$f, 24, 12, 2593);
    			attr_dev(div4, "class", "flex my-4");
    			add_location(div4, file$f, 20, 8, 2337);
    			add_location(div5, file$f, 15, 4, 1059);
    			add_location(p2, file$f, 30, 4, 2857);
    			attr_dev(div6, "class", "center text-justify");
    			add_location(div6, file$f, 4, 0, 31);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div0);
    			append_dev(div6, t1);
    			append_dev(div6, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t3);
    			append_dev(div1, img0);
    			append_dev(div6, t4);
    			append_dev(div6, div5);
    			append_dev(div5, p1);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, img1);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, img2);
    			append_dev(div6, t8);
    			append_dev(div6, p2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Qrng', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Qrng> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Qrng extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Qrng",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/pages/documentation/components/DocsSidebar.svelte generated by Svelte v3.44.2 */

    const file$e = "src/pages/documentation/components/DocsSidebar.svelte";

    function create_fragment$e(ctx) {
    	let nav;
    	let a0;
    	let t1;
    	let a1;
    	let t3;
    	let a2;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			a0 = element("a");
    			a0.textContent = "Services";
    			t1 = space();
    			a1 = element("a");
    			a1.textContent = "QRNG Service";
    			t3 = space();
    			a2 = element("a");
    			a2.textContent = "Prime Service";
    			attr_dev(a0, "href", "#services");
    			attr_dev(a0, "class", "text-lg block rounded-md transition duration-100 hover:bg-gray-100 text-gray-500 hover:text-gray-800 hover:no-underline py-1");
    			add_location(a0, file$e, 1, 4, 48);
    			attr_dev(a1, "href", "#qrng-service");
    			attr_dev(a1, "class", "px-2 block rounded-md transition duration-100 hover:bg-gray-100 text-gray-500 hover:text-gray-800 hover:no-underline py-1");
    			add_location(a1, file$e, 3, 4, 219);
    			attr_dev(a2, "href", "#qrng-service");
    			attr_dev(a2, "class", "px-2 block rounded-md transition duration-100 hover:bg-gray-100 text-gray-500 hover:text-gray-800 hover:no-underline py-1");
    			add_location(a2, file$e, 5, 4, 395);
    			attr_dev(nav, "class", "w-52 bg-transparent font-mono");
    			add_location(nav, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, a0);
    			append_dev(nav, t1);
    			append_dev(nav, a1);
    			append_dev(nav, t3);
    			append_dev(nav, a2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DocsSidebar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DocsSidebar> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class DocsSidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DocsSidebar",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/components/CodeBlock.svelte generated by Svelte v3.44.2 */

    const file$d = "src/components/CodeBlock.svelte";

    function create_fragment$d(ctx) {
    	let div4;
    	let div1;
    	let div0;
    	let t0;
    	let span0;
    	let t1;
    	let span1;
    	let t2;
    	let span2;
    	let t3;
    	let div3;
    	let div2;
    	let raw_value = /*code*/ ctx[0].replaceAll('\\', '<br>') + "";

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			span0 = element("span");
    			t1 = space();
    			span1 = element("span");
    			t2 = space();
    			span2 = element("span");
    			t3 = space();
    			div3 = element("div");
    			div2 = element("div");
    			attr_dev(div0, "class", "absolute w-full h-full inset-0 bg-gray-900 opacity-50 rounded-b-lg");
    			add_location(div0, file$d, 5, 8, 231);
    			attr_dev(span0, "class", "relative w-3 h-3 border-2 rounded-full border-red-400 bg-red-400");
    			add_location(span0, file$d, 6, 8, 327);
    			attr_dev(span1, "class", "relative w-3 h-3 border-2 rounded-full border-yellow-400 bg-yellow-400");
    			add_location(span1, file$d, 7, 8, 422);
    			attr_dev(span2, "class", "relative w-3 h-3 border-2 rounded-full border-green-400 bg-green-400");
    			add_location(span2, file$d, 8, 8, 523);
    			attr_dev(div1, "class", "w-full h-11 relative rounded-t-lg bg-gray-900 flex overflow-hidden justify-start items-center space-x-1.5 px-2");
    			add_location(div1, file$d, 4, 4, 98);
    			attr_dev(div2, "class", "absolute w-full h-full inset-0 bg-gray-900 py-4 px-8 text-gray-300 rounded-b-lg");
    			add_location(div2, file$d, 11, 8, 713);
    			attr_dev(div3, "class", "relative bg-gray-900 w-full h-32 border-gray-900 rounded-b-lg");
    			add_location(div3, file$d, 10, 4, 629);
    			attr_dev(div4, "class", "max-w-3xl mx-auto my-10 font-mono");
    			add_location(div4, file$d, 3, 0, 46);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t0);
    			append_dev(div1, span0);
    			append_dev(div1, t1);
    			append_dev(div1, span1);
    			append_dev(div1, t2);
    			append_dev(div1, span2);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			div2.innerHTML = raw_value;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*code*/ 1 && raw_value !== (raw_value = /*code*/ ctx[0].replaceAll('\\', '<br>') + "")) div2.innerHTML = raw_value;		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CodeBlock', slots, []);
    	let { code } = $$props;
    	const writable_props = ['code'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CodeBlock> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('code' in $$props) $$invalidate(0, code = $$props.code);
    	};

    	$$self.$capture_state = () => ({ code });

    	$$self.$inject_state = $$props => {
    		if ('code' in $$props) $$invalidate(0, code = $$props.code);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [code];
    }

    class CodeBlock extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { code: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CodeBlock",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*code*/ ctx[0] === undefined && !('code' in props)) {
    			console.warn("<CodeBlock> was created without expected prop 'code'");
    		}
    	}

    	get code() {
    		throw new Error("<CodeBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set code(value) {
    		throw new Error("<CodeBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/documentation/Documentation.svelte generated by Svelte v3.44.2 */
    const file$c = "src/pages/documentation/Documentation.svelte";

    function create_fragment$c(ctx) {
    	let div2;
    	let sidebar;
    	let t0;
    	let div1;
    	let h1;
    	let t2;
    	let span0;
    	let t4;
    	let span1;
    	let t6;
    	let ul;
    	let li0;
    	let t8;
    	let li1;
    	let t10;
    	let li2;
    	let t12;
    	let li3;
    	let t14;
    	let br;
    	let t15;
    	let span2;
    	let t17;
    	let span3;
    	let t19;
    	let h20;
    	let t21;
    	let h21;
    	let t23;
    	let div0;
    	let p;
    	let t25;
    	let codeblock;
    	let t26;
    	let current;
    	sidebar = new DocsSidebar({ $$inline: true });

    	codeblock = new CodeBlock({
    			props: {
    				code: "\n                npm install \\\\\n                npm run dev"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			create_component(sidebar.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Services";
    			t2 = space();
    			span0 = element("span");
    			span0.textContent = "In this chapter we will discuss in depth how the services were created and why. All services were purposely created to be loosely coupled with each other.";
    			t4 = space();
    			span1 = element("span");
    			span1.textContent = "To provide a rapid, frequent and reliable delivery of complex applications, the microservice architecture was chosen. This architecture allows for:";
    			t6 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "different teams to work on different services with low communications if any while working together";
    			t8 = space();
    			li1 = element("li");
    			li1.textContent = "loosely coupled code and components";
    			t10 = space();
    			li2 = element("li");
    			li2.textContent = "independently deployable";
    			t12 = space();
    			li3 = element("li");
    			li3.textContent = "highly maintainable and testable";
    			t14 = space();
    			br = element("br");
    			t15 = space();
    			span2 = element("span");
    			span2.textContent = "The order in which the services will be reviewed is crescent in terms of abstraction.";
    			t17 = space();
    			span3 = element("span");
    			span3.textContent = "All services but RNG were created with java in the Spring Framework, the RNG was created in python because it will be the most used by future users adding generators and python is widely used and easier to use compared to most other languages.";
    			t19 = space();
    			h20 = element("h2");
    			h20.textContent = "QRNG Service";
    			t21 = text("\n        adad\n\n        ");
    			h21 = element("h2");
    			h21.textContent = "Prime Service";
    			t23 = space();
    			div0 = element("div");
    			p = element("p");
    			p.textContent = "qrng";
    			t25 = space();
    			create_component(codeblock.$$.fragment);
    			t26 = text("\n\n\nada");
    			attr_dev(h1, "class", "text-2xl pb-4 font-semibold");
    			attr_dev(h1, "id", "services");
    			add_location(h1, file$c, 12, 8, 297);
    			attr_dev(span0, "class", "block");
    			add_location(span0, file$c, 14, 8, 374);
    			attr_dev(span1, "class", "block");
    			add_location(span1, file$c, 15, 5, 561);
    			add_location(li0, file$c, 17, 12, 797);
    			add_location(li1, file$c, 18, 12, 918);
    			add_location(li2, file$c, 19, 12, 975);
    			add_location(li3, file$c, 20, 12, 1021);
    			attr_dev(ul, "class", "list-decimal pl-8 space-y-1");
    			add_location(ul, file$c, 16, 8, 744);
    			add_location(br, file$c, 22, 8, 1085);
    			attr_dev(span2, "class", "block");
    			add_location(span2, file$c, 23, 8, 1098);
    			attr_dev(span3, "class", "block");
    			add_location(span3, file$c, 24, 8, 1219);
    			attr_dev(h20, "class", "text-1xl pt-8 font-semibold");
    			attr_dev(h20, "id", "qrng-service");
    			add_location(h20, file$c, 27, 8, 1500);
    			attr_dev(h21, "class", "text-1xl pt-8 font-semibold");
    			attr_dev(h21, "id", "qrng-service");
    			add_location(h21, file$c, 30, 8, 1598);
    			attr_dev(p, "class", "text-md text-dark-gray");
    			add_location(p, file$c, 33, 12, 1703);
    			add_location(div0, file$c, 32, 8, 1684);
    			attr_dev(div1, "class", "flex-1 px-8 text-gray-800 space-y-1");
    			add_location(div1, file$c, 11, 4, 239);
    			attr_dev(div2, "class", "flex relative");
    			add_location(div2, file$c, 6, 0, 143);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			mount_component(sidebar, div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t2);
    			append_dev(div1, span0);
    			append_dev(div1, t4);
    			append_dev(div1, span1);
    			append_dev(div1, t6);
    			append_dev(div1, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t8);
    			append_dev(ul, li1);
    			append_dev(ul, t10);
    			append_dev(ul, li2);
    			append_dev(ul, t12);
    			append_dev(ul, li3);
    			append_dev(div1, t14);
    			append_dev(div1, br);
    			append_dev(div1, t15);
    			append_dev(div1, span2);
    			append_dev(div1, t17);
    			append_dev(div1, span3);
    			append_dev(div1, t19);
    			append_dev(div1, h20);
    			append_dev(div1, t21);
    			append_dev(div1, h21);
    			append_dev(div1, t23);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(div0, t25);
    			mount_component(codeblock, div0, null);
    			append_dev(div1, t26);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebar.$$.fragment, local);
    			transition_in(codeblock.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebar.$$.fragment, local);
    			transition_out(codeblock.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(sidebar);
    			destroy_component(codeblock);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Documentation', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Documentation> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Sidebar: DocsSidebar, CodeBlock });
    	return [];
    }

    class Documentation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Documentation",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    function createGenerators() {
        const { subscribe, update, set } = writable([]);
        return {
            subscribe,
            set,
            add: (new_generator) => update(old => ([...old, new_generator]))
        };
    }
    const generators = createGenerators();

    const default_statistics = {
        mean: null,
        max: null,
        min: null,
        sum: 0,
        Q1: null,
        Q2: null,
        Q3: null,
        Q4: null
    };
    function createGeneratorStatistics() {
        const { subscribe, update, set } = writable({
            generator: get_store_value(generators)[0],
            random_values: [],
            statistics: default_statistics,
            active: false,
            elapsed: 0,
            total: 0
        });
        return {
            subscribe,
            set,
            update,
            add: (random_numbers) => update(old => (Object.assign(Object.assign({}, old), { random_values: [...old.random_values, ...random_numbers] }))),
            reset_values: () => update(old => (Object.assign(Object.assign({}, old), { random_values: [], statistics: default_statistics, elapsed: 0, old: 0 }))),
            update_stats: (stats) => update((old) => (Object.assign(Object.assign({}, old), { statistics: Object.assign(Object.assign({}, old.statistics), stats) }))),
            update_generator: (generator) => update(() => ({
                generator: generator,
                random_values: [],
                statistics: default_statistics,
                active: false,
                elapsed: 0,
                total: 0
            })),
            status: (value) => update((old) => (Object.assign(Object.assign({}, old), { active: value }))),
            tick: () => update((old) => (Object.assign(Object.assign({}, old), { elapsed: old.elapsed + 1 }))),
            update_goal: (goal) => update((old) => (Object.assign(Object.assign({}, old), { total: old.random_values.length + goal })))
        };
    }
    const selected_generator = createGeneratorStatistics();

    /* src/pages/demonstrations/components/DemoStats.svelte generated by Svelte v3.44.2 */
    const file$b = "src/pages/demonstrations/components/DemoStats.svelte";

    // (38:16) {#if $selected_generator.active == true }
    function create_if_block_1$1(ctx) {
    	let span2;
    	let span0;
    	let t;
    	let span1;

    	const block = {
    		c: function create() {
    			span2 = element("span");
    			span0 = element("span");
    			t = space();
    			span1 = element("span");
    			attr_dev(span0, "class", "animate-ping absolute inline-flex h-3 w-3 rounded-full bg-it-red opacity-75");
    			add_location(span0, file$b, 39, 24, 1361);
    			attr_dev(span1, "class", "relative inline-flex rounded-full h-3 w-3 bg-it-red");
    			add_location(span1, file$b, 40, 24, 1483);
    			attr_dev(span2, "class", "flex my-auto ml-4");
    			add_location(span2, file$b, 38, 20, 1304);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span2, anchor);
    			append_dev(span2, span0);
    			append_dev(span2, t);
    			append_dev(span2, span1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(38:16) {#if $selected_generator.active == true }",
    		ctx
    	});

    	return block;
    }

    // (50:12) {#if $selected_generator.random_values.length > 0 && $selected_generator.active == false}
    function create_if_block$5(ctx) {
    	let button;
    	let svg;
    	let path;
    	let t0;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			span = element("span");
    			span.textContent = "Random Numbers";
    			attr_dev(path, "d", "M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z");
    			add_location(path, file$b, 51, 105, 2141);
    			attr_dev(svg, "class", "fill-current w-4 h-4");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			add_location(svg, file$b, 51, 16, 2052);
    			attr_dev(span, "class", "ml-2");
    			add_location(span, file$b, 52, 16, 2217);
    			attr_dev(button, "class", "bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-2 rounded inline-flex items-center");
    			add_location(button, file$b, 50, 12, 1897);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(button, t0);
    			append_dev(button, span);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*download_random_numbers*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(50:12) {#if $selected_generator.random_values.length > 0 && $selected_generator.active == false}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div5;
    	let div2;
    	let div0;
    	let h3;
    	let span;
    	let t1;
    	let t2;
    	let p;
    	let t4;
    	let div1;
    	let t5;
    	let div4;
    	let dl;
    	let div3;
    	let dt0;
    	let t7;
    	let dd0;

    	let t8_value = (/*$selected_generator*/ ctx[0].statistics.mean == null
    	? 0
    	: /*$selected_generator*/ ctx[0].statistics.mean) + "";

    	let t8;
    	let t9;
    	let dt1;
    	let t11;
    	let dd1;

    	let t12_value = (/*$selected_generator*/ ctx[0].statistics.max == null
    	? 0
    	: /*$selected_generator*/ ctx[0].statistics.max) + "";

    	let t12;
    	let t13;
    	let dt2;
    	let t15;
    	let dd2;

    	let t16_value = (/*$selected_generator*/ ctx[0].statistics.min == null
    	? 0
    	: /*$selected_generator*/ ctx[0].statistics.min) + "";

    	let t16;
    	let if_block0 = /*$selected_generator*/ ctx[0].active == true && create_if_block_1$1(ctx);
    	let if_block1 = /*$selected_generator*/ ctx[0].random_values.length > 0 && /*$selected_generator*/ ctx[0].active == false && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			span = element("span");
    			span.textContent = "Statistics";
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			p = element("p");
    			p.textContent = "Live statistics";
    			t4 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t5 = space();
    			div4 = element("div");
    			dl = element("dl");
    			div3 = element("div");
    			dt0 = element("dt");
    			dt0.textContent = "Mean";
    			t7 = space();
    			dd0 = element("dd");
    			t8 = text(t8_value);
    			t9 = space();
    			dt1 = element("dt");
    			dt1.textContent = "Max";
    			t11 = space();
    			dd1 = element("dd");
    			t12 = text(t12_value);
    			t13 = space();
    			dt2 = element("dt");
    			dt2.textContent = "Min";
    			t15 = space();
    			dd2 = element("dd");
    			t16 = text(t16_value);
    			add_location(span, file$b, 36, 16, 1202);
    			attr_dev(h3, "class", "text-lg leading-6 font-medium flex");
    			add_location(h3, file$b, 35, 12, 1138);
    			attr_dev(p, "class", "mt-1 max-w-2xl text-sm text-gray-500");
    			add_location(p, file$b, 44, 12, 1637);
    			attr_dev(div0, "class", "flex-1");
    			add_location(div0, file$b, 34, 8, 1105);
    			attr_dev(div1, "class", "flex-right");
    			add_location(div1, file$b, 48, 8, 1758);
    			attr_dev(div2, "class", "flex px-4 py-5 sm:px-6");
    			add_location(div2, file$b, 33, 4, 1060);
    			attr_dev(dt0, "class", "text-sm font-medium text-gray-500");
    			add_location(dt0, file$b, 60, 16, 2481);
    			attr_dev(dd0, "class", "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2");
    			add_location(dd0, file$b, 63, 16, 2591);
    			attr_dev(dt1, "class", "text-sm font-medium text-gray-500");
    			add_location(dt1, file$b, 66, 16, 2804);
    			attr_dev(dd1, "class", "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2");
    			add_location(dd1, file$b, 69, 16, 2913);
    			attr_dev(dt2, "class", "text-sm font-medium text-gray-500");
    			add_location(dt2, file$b, 72, 16, 3124);
    			attr_dev(dd2, "class", "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2");
    			add_location(dd2, file$b, 75, 16, 3233);
    			attr_dev(div3, "class", "bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6");
    			add_location(div3, file$b, 59, 12, 2392);
    			add_location(dl, file$b, 58, 8, 2375);
    			attr_dev(div4, "class", "border-t border-gray-200");
    			add_location(div4, file$b, 57, 4, 2328);
    			attr_dev(div5, "class", "bg-white shadow overflow-hidden rounded-lg");
    			add_location(div5, file$b, 32, 0, 999);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(h3, span);
    			append_dev(h3, t1);
    			if (if_block0) if_block0.m(h3, null);
    			append_dev(div0, t2);
    			append_dev(div0, p);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div5, t5);
    			append_dev(div5, div4);
    			append_dev(div4, dl);
    			append_dev(dl, div3);
    			append_dev(div3, dt0);
    			append_dev(div3, t7);
    			append_dev(div3, dd0);
    			append_dev(dd0, t8);
    			append_dev(div3, t9);
    			append_dev(div3, dt1);
    			append_dev(div3, t11);
    			append_dev(div3, dd1);
    			append_dev(dd1, t12);
    			append_dev(div3, t13);
    			append_dev(div3, dt2);
    			append_dev(div3, t15);
    			append_dev(div3, dd2);
    			append_dev(dd2, t16);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$selected_generator*/ ctx[0].active == true) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(h3, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$selected_generator*/ ctx[0].random_values.length > 0 && /*$selected_generator*/ ctx[0].active == false) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*$selected_generator*/ 1 && t8_value !== (t8_value = (/*$selected_generator*/ ctx[0].statistics.mean == null
    			? 0
    			: /*$selected_generator*/ ctx[0].statistics.mean) + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*$selected_generator*/ 1 && t12_value !== (t12_value = (/*$selected_generator*/ ctx[0].statistics.max == null
    			? 0
    			: /*$selected_generator*/ ctx[0].statistics.max) + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*$selected_generator*/ 1 && t16_value !== (t16_value = (/*$selected_generator*/ ctx[0].statistics.min == null
    			? 0
    			: /*$selected_generator*/ ctx[0].statistics.min) + "")) set_data_dev(t16, t16_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function sleep$1(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $selected_generator;
    	validate_store(selected_generator, 'selected_generator');
    	component_subscribe($$self, selected_generator, $$value => $$invalidate(0, $selected_generator = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DemoStats', slots, []);
    	let mean = 20;

    	function download_random_numbers() {
    		let random_numbers = get_store_value(selected_generator).random_values;
    		let a = document.createElement('a');
    		let blob = new Blob([random_numbers.join(", ")], { 'type': 'application/octet-stream' });
    		a.href = window.URL.createObjectURL(blob);
    		a.download = `random_numbers_at_${Date.now()}.csv`;
    		a.click();
    	} /*
    document.location = 'data:Application/octet-stream,' +
        encodeURIComponent(random_numbers.join(", "));
    */

    	async function simulate() {
    		for (let i = 0; i < 100; i++) {
    			let random_number = Math.random();
    			if (random_number >= 0.5) mean = mean + random_number; else mean = mean - random_number;
    			await sleep$1(2000);
    		}
    	}

    	simulate();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DemoStats> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		selected_generator,
    		get: get_store_value,
    		mean,
    		sleep: sleep$1,
    		download_random_numbers,
    		simulate,
    		$selected_generator
    	});

    	$$self.$inject_state = $$props => {
    		if ('mean' in $$props) mean = $$props.mean;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$selected_generator, download_random_numbers];
    }

    class DemoStats extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DemoStats",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/pages/demonstrations/components/GeneratorStats.svelte generated by Svelte v3.44.2 */
    const file$a = "src/pages/demonstrations/components/GeneratorStats.svelte";

    function create_fragment$a(ctx) {
    	let div3;
    	let div0;
    	let h3;
    	let t0;
    	let t1_value = /*$selected_generator*/ ctx[0].generator.name + "";
    	let t1;
    	let t2;
    	let p;
    	let t4;
    	let div2;
    	let dl;
    	let div1;
    	let dt0;
    	let t6;
    	let dd0;
    	let t7_value = /*$selected_generator*/ ctx[0].generator.type + "";
    	let t7;
    	let t8;
    	let dt1;
    	let t10;
    	let dd1;
    	let t11_value = /*$selected_generator*/ ctx[0].generator.developed_by + "";
    	let t11;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			t0 = text("Generator ");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			p.textContent = "Details";
    			t4 = space();
    			div2 = element("div");
    			dl = element("dl");
    			div1 = element("div");
    			dt0 = element("dt");
    			dt0.textContent = "Type";
    			t6 = space();
    			dd0 = element("dd");
    			t7 = text(t7_value);
    			t8 = space();
    			dt1 = element("dt");
    			dt1.textContent = "Developed by:";
    			t10 = space();
    			dd1 = element("dd");
    			t11 = text(t11_value);
    			attr_dev(h3, "class", "text-lg leading-6 font-medium");
    			add_location(h3, file$a, 5, 8, 198);
    			attr_dev(p, "class", "mt-1 max-w-2xl text-sm text-gray-500");
    			add_location(p, file$a, 8, 8, 324);
    			attr_dev(div0, "class", "px-4 py-5 sm:px-6");
    			add_location(div0, file$a, 4, 4, 158);
    			attr_dev(dt0, "class", "text-sm font-medium text-gray-500");
    			add_location(dt0, file$a, 15, 16, 574);
    			attr_dev(dd0, "class", "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2");
    			add_location(dd0, file$a, 18, 16, 684);
    			attr_dev(dt1, "class", "text-sm font-medium text-gray-500");
    			add_location(dt1, file$a, 22, 16, 860);
    			attr_dev(dd1, "class", "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2");
    			add_location(dd1, file$a, 25, 16, 979);
    			attr_dev(div1, "class", "bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6");
    			add_location(div1, file$a, 14, 12, 485);
    			add_location(dl, file$a, 13, 8, 468);
    			attr_dev(div2, "class", "border-t border-gray-200");
    			add_location(div2, file$a, 12, 4, 421);
    			attr_dev(div3, "class", "bg-white shadow overflow-hidden rounded-lg");
    			add_location(div3, file$a, 3, 0, 97);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			append_dev(div0, t2);
    			append_dev(div0, p);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, dl);
    			append_dev(dl, div1);
    			append_dev(div1, dt0);
    			append_dev(div1, t6);
    			append_dev(div1, dd0);
    			append_dev(dd0, t7);
    			append_dev(div1, t8);
    			append_dev(div1, dt1);
    			append_dev(div1, t10);
    			append_dev(div1, dd1);
    			append_dev(dd1, t11);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$selected_generator*/ 1 && t1_value !== (t1_value = /*$selected_generator*/ ctx[0].generator.name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$selected_generator*/ 1 && t7_value !== (t7_value = /*$selected_generator*/ ctx[0].generator.type + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*$selected_generator*/ 1 && t11_value !== (t11_value = /*$selected_generator*/ ctx[0].generator.developed_by + "")) set_data_dev(t11, t11_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $selected_generator;
    	validate_store(selected_generator, 'selected_generator');
    	component_subscribe($$self, selected_generator, $$value => $$invalidate(0, $selected_generator = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GeneratorStats', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GeneratorStats> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ selected_generator, $selected_generator });
    	return [$selected_generator];
    }

    class GeneratorStats extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GeneratorStats",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src/pages/demonstrations/components/GeneratorSelection.svelte generated by Svelte v3.44.2 */
    const file$9 = "src/pages/demonstrations/components/GeneratorSelection.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (41:4) {#if dropdownOpen}
    function create_if_block$4(ctx) {
    	let ul;
    	let ul_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*$generators*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm");
    			attr_dev(ul, "tabindex", "-1");
    			attr_dev(ul, "role", "listbox");
    			attr_dev(ul, "aria-labelledby", "listbox-label");
    			attr_dev(ul, "aria-activedescendant", "listbox-option-3");
    			add_location(ul, file$9, 41, 8, 2121);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(ul, "mouseleave", /*mouseleave_handler*/ ctx[7], false, false, false),
    					listen_dev(ul, "blur", /*blur_handler*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$selected_generator, $generators, switch_generator*/ 14) {
    				each_value = /*$generators*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!ul_transition) ul_transition = create_bidirectional_transition(ul, fly, { y: -10, duration: 100 }, true);
    				ul_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!ul_transition) ul_transition = create_bidirectional_transition(ul, fly, { y: -10, duration: 100 }, false);
    			ul_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			if (detaching && ul_transition) ul_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(41:4) {#if dropdownOpen}",
    		ctx
    	});

    	return block;
    }

    // (43:12) {#each $generators as generator}
    function create_each_block$1(ctx) {
    	let li;
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let span0;
    	let t1_value = /*generator*/ ctx[8].name + "";
    	let t1;
    	let t2;
    	let span1;
    	let svg;
    	let path;
    	let t3;
    	let li_class_value;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[6](/*generator*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			span1 = element("span");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t3 = space();
    			if (!src_url_equal(img.src, img_src_value = /*generator*/ ctx[8].img)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "flex-shrink-0 h-6 w-6 rounded-full");
    			add_location(img, file$9, 50, 24, 3127);
    			attr_dev(span0, "class", "font-normal ml-3 block truncate");
    			add_location(span0, file$9, 52, 24, 3317);
    			attr_dev(div, "class", "flex items-center");
    			add_location(div, file$9, 49, 20, 3071);
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z");
    			attr_dev(path, "clip-rule", "evenodd");
    			add_location(path, file$9, 65, 24, 4024);
    			attr_dev(svg, "class", "h-5 w-5");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$9, 64, 24, 3884);
    			attr_dev(span1, "class", "text-green-400 absolute inset-y-0 right-0 flex items-center pr-4");
    			add_location(span1, file$9, 62, 20, 3720);

    			attr_dev(li, "class", li_class_value = "text-gray-900 select-none relative py-2 pl-3 pr-9 hover:bg-gray-200 cursor-pointer " + (/*$selected_generator*/ ctx[1].generator.id == /*generator*/ ctx[8].id
    			? 'bg-gray-100'
    			: ''));

    			attr_dev(li, "id", "listbox-option-0");
    			attr_dev(li, "role", "option");
    			add_location(li, file$9, 48, 16, 2801);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, span0);
    			append_dev(span0, t1);
    			append_dev(li, t2);
    			append_dev(li, span1);
    			append_dev(span1, svg);
    			append_dev(svg, path);
    			append_dev(li, t3);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$generators*/ 4 && !src_url_equal(img.src, img_src_value = /*generator*/ ctx[8].img)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*$generators*/ 4 && t1_value !== (t1_value = /*generator*/ ctx[8].name + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*$selected_generator, $generators*/ 6 && li_class_value !== (li_class_value = "text-gray-900 select-none relative py-2 pl-3 pr-9 hover:bg-gray-200 cursor-pointer " + (/*$selected_generator*/ ctx[1].generator.id == /*generator*/ ctx[8].id
    			? 'bg-gray-100'
    			: ''))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(43:12) {#each $generators as generator}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div1;
    	let h3;
    	let t1;
    	let div0;
    	let button;
    	let span1;
    	let img;
    	let img_src_value;
    	let t2;
    	let span0;
    	let t3_value = /*$selected_generator*/ ctx[1].generator.name + "";
    	let t3;
    	let t4;
    	let span2;
    	let svg;
    	let path;
    	let t5;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*dropdownOpen*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Select the Generator";
    			t1 = space();
    			div0 = element("div");
    			button = element("button");
    			span1 = element("span");
    			img = element("img");
    			t2 = space();
    			span0 = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			span2 = element("span");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t5 = space();
    			if (if_block) if_block.c();
    			attr_dev(h3, "class", "block text-sm font-medium text-gray-700");
    			add_location(h3, file$9, 11, 4, 375);
    			if (!src_url_equal(img.src, img_src_value = /*$selected_generator*/ ctx[1].generator.img)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "flex-shrink-0 h-6 w-6 rounded-full");
    			add_location(img, file$9, 17, 16, 898);
    			attr_dev(span0, "class", "ml-3 block truncate transition ease-in duration-1000");
    			add_location(span0, file$9, 18, 16, 1014);
    			attr_dev(span1, "class", "flex items-center");
    			add_location(span1, file$9, 16, 12, 849);
    			attr_dev(path, "fill-rule", "evenodd");
    			attr_dev(path, "d", "M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z");
    			attr_dev(path, "clip-rule", "evenodd");
    			add_location(path, file$9, 25, 16, 1505);
    			attr_dev(svg, "class", "h-5 w-5 text-gray-400");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "fill", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$9, 24, 16, 1359);
    			attr_dev(span2, "class", "ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none");
    			add_location(span2, file$9, 22, 12, 1198);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "relative w-full cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-transparent sm:text-sm");
    			attr_dev(button, "aria-haspopup", "listbox");
    			attr_dev(button, "aria-expanded", "true");
    			attr_dev(button, "aria-labelledby", "listbox-label");
    			add_location(button, file$9, 15, 8, 507);
    			attr_dev(div0, "class", "mt-1 relative");
    			add_location(div0, file$9, 14, 4, 471);
    			attr_dev(div1, "class", "mx-auto w-64");
    			add_location(div1, file$9, 10, 0, 344);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h3);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, span1);
    			append_dev(span1, img);
    			append_dev(span1, t2);
    			append_dev(span1, span0);
    			append_dev(span0, t3);
    			append_dev(button, t4);
    			append_dev(button, span2);
    			append_dev(span2, svg);
    			append_dev(svg, path);
    			append_dev(div0, t5);
    			if (if_block) if_block.m(div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$selected_generator*/ 2 && !src_url_equal(img.src, img_src_value = /*$selected_generator*/ ctx[1].generator.img)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*$selected_generator*/ 2) && t3_value !== (t3_value = /*$selected_generator*/ ctx[1].generator.name + "")) set_data_dev(t3, t3_value);

    			if (/*dropdownOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*dropdownOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $selected_generator;
    	let $generators;
    	validate_store(selected_generator, 'selected_generator');
    	component_subscribe($$self, selected_generator, $$value => $$invalidate(1, $selected_generator = $$value));
    	validate_store(generators, 'generators');
    	component_subscribe($$self, generators, $$value => $$invalidate(2, $generators = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GeneratorSelection', slots, []);
    	let dropdownOpen = false;

    	const switch_generator = generator => {
    		selected_generator.update_generator(generator);
    		$$invalidate(0, dropdownOpen = false);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GeneratorSelection> was created with unknown prop '${key}'`);
    	});

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => $$invalidate(0, dropdownOpen = !dropdownOpen);
    	const click_handler_1 = generator => switch_generator(generator);
    	const mouseleave_handler = () => $$invalidate(0, dropdownOpen = false);

    	$$self.$capture_state = () => ({
    		generators,
    		selected_generator,
    		fly,
    		dropdownOpen,
    		switch_generator,
    		$selected_generator,
    		$generators
    	});

    	$$self.$inject_state = $$props => {
    		if ('dropdownOpen' in $$props) $$invalidate(0, dropdownOpen = $$props.dropdownOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		dropdownOpen,
    		$selected_generator,
    		$generators,
    		switch_generator,
    		blur_handler,
    		click_handler,
    		click_handler_1,
    		mouseleave_handler
    	];
    }

    class GeneratorSelection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GeneratorSelection",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    let MAX_SINGLE_CALL_AMOUNT = 2000;
    function assignGenerator() {
        let generators$1 = get_store_value(generators);
        let default_generator = generators$1[0];
        for (let generator of generators$1)
            if (generator.name == "IT QRNG")
                default_generator = generator;
        selected_generator.update_generator(default_generator);
    }
    function fetch_from_server(n) {
        let random_numbers = [];
        while (n > 0) {
            random_numbers.push(Math.random());
            n -= 1;
        }
        return random_numbers;
    }
    function update_statistics(new_random_numbers) {
        let stats = get_store_value(selected_generator).statistics;
        let sum = 0;
        let max = stats.max;
        let min = stats.min;
        for (let number of new_random_numbers) {
            sum += number;
            if (max == null || number > stats.max)
                max = number;
            if (min == null || number < stats.min)
                min = number;
        }
        let store = get_store_value(selected_generator);
        selected_generator.update_stats({
            sum: store.statistics.sum + sum,
            mean: (store.statistics.sum + sum) / (store.random_values.length + new_random_numbers.length),
            max: max,
            min: min
        });
    }
    async function fetch(n) {
        if (n <= 0)
            return;
        selected_generator.status(true);
        const elapse_manager = setInterval(() => {
            selected_generator.tick();
        }, 1000);
        selected_generator.update_goal(n);
        while (n > 0) {
            // break loop when there is a stop signal
            if (!get_store_value(selected_generator).active)
                break;
            // fetch n or MAX_SINGLE_CALL_AMOUNT from server based on the remaining quantity needed
            let to_fetch = (n / MAX_SINGLE_CALL_AMOUNT < 1) ? n : MAX_SINGLE_CALL_AMOUNT;
            let new_random_numbers = fetch_from_server(to_fetch);
            await sleep(10);
            selected_generator.add(new_random_numbers);
            n -= new_random_numbers.length;
            update_statistics(new_random_numbers);
        }
        clearInterval(elapse_manager);
        await sleep(600);
        selected_generator.status(false);
    }
    function stop_fetch() {
        selected_generator.status(false);
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /* src/pages/demonstrations/components/StartDemo.svelte generated by Svelte v3.44.2 */
    const file$8 = "src/pages/demonstrations/components/StartDemo.svelte";

    // (19:2) {:else}
    function create_else_block$1(ctx) {
    	let button;
    	let t;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Generate");

    			attr_dev(button, "class", button_class_value = "transition-colors duration-150 w-48 " + (/*value*/ ctx[0] > 0
    			? 'bg-gray-400 text-white'
    			: 'bg-gray-300 text-gray-700') + " rounded-md text-center py-1 cursor-pointer");

    			add_location(button, file$8, 19, 4, 667);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 1 && button_class_value !== (button_class_value = "transition-colors duration-150 w-48 " + (/*value*/ ctx[0] > 0
    			? 'bg-gray-400 text-white'
    			: 'bg-gray-300 text-gray-700') + " rounded-md text-center py-1 cursor-pointer")) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(19:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:2) {#if $selected_generator.active}
    function create_if_block$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Pause...";
    			attr_dev(button, "class", "transition-colors duration-150 w-48 animate-pulse bg-red-700 opacity-80 rounded-md text-center py-1 text-white cursor-pointer");
    			add_location(button, file$8, 15, 4, 451);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(15:2) {#if $selected_generator.active}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div1;
    	let div0;
    	let input;
    	let input_disabled_value;
    	let t0;
    	let span;
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*$selected_generator*/ ctx[2].active) return create_if_block$3;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = text(/*size*/ ctx[1]);
    			t2 = space();
    			if_block.c();
    			attr_dev(input, "type", "range");
    			attr_dev(input, "max", "100");
    			attr_dev(input, "class", "range");
    			input.disabled = input_disabled_value = /*$selected_generator*/ ctx[2].active;
    			add_location(input, file$8, 10, 4, 276);
    			add_location(span, file$8, 11, 4, 382);
    			add_location(div0, file$8, 9, 2, 266);
    			attr_dev(div1, "class", "flex flex-col pt-4 space-y-3 mx-auto");
    			add_location(div1, file$8, 8, 0, 213);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*value*/ ctx[0]);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			append_dev(span, t1);
    			append_dev(div1, t2);
    			if_block.m(div1, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[3]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[3])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$selected_generator*/ 4 && input_disabled_value !== (input_disabled_value = /*$selected_generator*/ ctx[2].active)) {
    				prop_dev(input, "disabled", input_disabled_value);
    			}

    			if (dirty & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			if (dirty & /*size*/ 2) set_data_dev(t1, /*size*/ ctx[1]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let size;
    	let $selected_generator;
    	validate_store(selected_generator, 'selected_generator');
    	component_subscribe($$self, selected_generator, $$value => $$invalidate(2, $selected_generator = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StartDemo', slots, []);
    	let value = 10;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StartDemo> was created with unknown prop '${key}'`);
    	});

    	function input_change_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(0, value);
    	}

    	const click_handler = () => stop_fetch();
    	const click_handler_1 = () => fetch(size);

    	$$self.$capture_state = () => ({
    		fetch,
    		stop_fetch,
    		selected_generator,
    		value,
    		size,
    		$selected_generator
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 1) {
    			$$invalidate(1, size = value ** 3);
    		}
    	};

    	return [
    		value,
    		size,
    		$selected_generator,
    		input_change_input_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class StartDemo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StartDemo",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/pages/demonstrations/demos/Demo1.svelte generated by Svelte v3.44.2 */
    const file$7 = "src/pages/demonstrations/demos/Demo1.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (41:12) {#if points.length > 0}
    function create_if_block$2(ctx) {
    	let each_1_anchor;
    	let each_value = /*points*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*points*/ 1) {
    				each_value = /*points*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(41:12) {#if points.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (42:16) {#each points as point}
    function create_each_block(ctx) {
    	let circle;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_fill_value;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", circle_cx_value = /*point*/ ctx[9][0] * 100 + '%');
    			attr_dev(circle, "cy", circle_cy_value = /*point*/ ctx[9][1] * 100 + '%');
    			attr_dev(circle, "r", 1);
    			attr_dev(circle, "fill", circle_fill_value = /*point*/ ctx[9][2] ? "black" : "red");
    			add_location(circle, file$7, 42, 16, 1469);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*points*/ 1 && circle_cx_value !== (circle_cx_value = /*point*/ ctx[9][0] * 100 + '%')) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty & /*points*/ 1 && circle_cy_value !== (circle_cy_value = /*point*/ ctx[9][1] * 100 + '%')) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty & /*points*/ 1 && circle_fill_value !== (circle_fill_value = /*point*/ ctx[9][2] ? "black" : "red")) {
    				attr_dev(circle, "fill", circle_fill_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(42:16) {#each points as point}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div2;
    	let div0;
    	let h3;
    	let t1;
    	let p;
    	let span;

    	let t2_value = (isNaN(/*pi_approximation*/ ctx[1])
    	? 0
    	: /*pi_approximation*/ ctx[1]) + "";

    	let t2;
    	let t3;
    	let div1;
    	let svg;
    	let if_block = /*points*/ ctx[0].length > 0 && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Approximate ??";
    			t1 = space();
    			p = element("p");
    			span = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			attr_dev(h3, "class", "text-lg leading-6 font-medium");
    			add_location(h3, file$7, 31, 8, 1010);
    			attr_dev(span, "class", "text-xl text-center mx-auto break-all");
    			add_location(span, file$7, 35, 12, 1162);
    			attr_dev(p, "class", "mt-1 max-w-2xl text-sm text-gray-500");
    			add_location(p, file$7, 34, 8, 1101);
    			attr_dev(div0, "class", "flex-1 px-4 py-5 sm:px-6");
    			add_location(div0, file$7, 30, 4, 963);
    			attr_dev(svg, "viewBox", "0 0 500 500");
    			add_location(svg, file$7, 39, 8, 1349);
    			attr_dev(div1, "class", "w-1/3 border-2 ml-4 mr-12 my-1");
    			add_location(div1, file$7, 38, 4, 1296);
    			attr_dev(div2, "class", "flex bg-white shadow overflow-hidden rounded-lg");
    			add_location(div2, file$7, 29, 0, 897);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(p, span);
    			append_dev(span, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, svg);
    			if (if_block) if_block.m(svg, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*pi_approximation*/ 2 && t2_value !== (t2_value = (isNaN(/*pi_approximation*/ ctx[1])
    			? 0
    			: /*pi_approximation*/ ctx[1]) + "")) set_data_dev(t2, t2_value);

    			if (/*points*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(svg, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $selected_generator;
    	validate_store(selected_generator, 'selected_generator');
    	component_subscribe($$self, selected_generator, $$value => $$invalidate(8, $selected_generator = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Demo1', slots, []);
    	let random_numbers;
    	let points = [];
    	let last_idx = 0;
    	let pi_approximation = 0;
    	let is_inside;
    	let inside_counter = 0;
    	let left_side_number;
    	let right_side_number;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Demo1> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		selected_generator,
    		random_numbers,
    		points,
    		last_idx,
    		pi_approximation,
    		is_inside,
    		inside_counter,
    		left_side_number,
    		right_side_number,
    		$selected_generator
    	});

    	$$self.$inject_state = $$props => {
    		if ('random_numbers' in $$props) $$invalidate(2, random_numbers = $$props.random_numbers);
    		if ('points' in $$props) $$invalidate(0, points = $$props.points);
    		if ('last_idx' in $$props) $$invalidate(3, last_idx = $$props.last_idx);
    		if ('pi_approximation' in $$props) $$invalidate(1, pi_approximation = $$props.pi_approximation);
    		if ('is_inside' in $$props) $$invalidate(4, is_inside = $$props.is_inside);
    		if ('inside_counter' in $$props) $$invalidate(5, inside_counter = $$props.inside_counter);
    		if ('left_side_number' in $$props) $$invalidate(6, left_side_number = $$props.left_side_number);
    		if ('right_side_number' in $$props) $$invalidate(7, right_side_number = $$props.right_side_number);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$selected_generator*/ 256) {
    			$$invalidate(2, random_numbers = $selected_generator.random_values);
    		}

    		if ($$self.$$.dirty & /*last_idx, random_numbers, left_side_number, right_side_number, inside_counter, points, is_inside*/ 253) {
    			{
    				for (let i = last_idx; i < random_numbers.length; i = i + 2) {
    					$$invalidate(3, last_idx = random_numbers.length);
    					$$invalidate(6, left_side_number = random_numbers[i]);
    					$$invalidate(7, right_side_number = random_numbers[i + 1]);
    					$$invalidate(4, is_inside = false);

    					if (left_side_number * left_side_number + right_side_number * right_side_number <= 1) {
    						$$invalidate(4, is_inside = true);
    						$$invalidate(5, inside_counter += 1);
    					}

    					points.push([left_side_number, right_side_number, is_inside]);
    					((((((($$invalidate(0, points), $$invalidate(3, last_idx)), $$invalidate(2, random_numbers)), $$invalidate(6, left_side_number)), $$invalidate(7, right_side_number)), $$invalidate(5, inside_counter)), $$invalidate(4, is_inside)), $$invalidate(8, $selected_generator));
    				}

    				$$invalidate(1, pi_approximation = inside_counter / random_numbers.length * 8);
    			}
    		}
    	};

    	return [
    		points,
    		pi_approximation,
    		random_numbers,
    		last_idx,
    		is_inside,
    		inside_counter,
    		left_side_number,
    		right_side_number,
    		$selected_generator
    	];
    }

    class Demo1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Demo1",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/pages/demonstrations/demos/Demo2.svelte generated by Svelte v3.44.2 */

    const file$6 = "src/pages/demonstrations/demos/Demo2.svelte";

    function create_fragment$6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Demo2";
    			add_location(div, file$6, 1, 0, 1);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Demo2', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Demo2> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Demo2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Demo2",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/pages/demonstrations/demos/Demo3.svelte generated by Svelte v3.44.2 */

    const file$5 = "src/pages/demonstrations/demos/Demo3.svelte";

    function create_fragment$5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Demo3";
    			add_location(div, file$5, 1, 0, 1);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Demo3', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Demo3> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Demo3 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Demo3",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/pages/demonstrations/Demonstrations.svelte generated by Svelte v3.44.2 */
    const file$4 = "src/pages/demonstrations/Demonstrations.svelte";

    // (52:4) {:else}
    function create_else_block_2(ctx) {
    	let button;
    	let h3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			h3 = element("h3");
    			h3.textContent = "Aproximation of Pi (??)";
    			attr_dev(h3, "class", "text-lg leading-6 font-medium");
    			add_location(h3, file$4, 53, 8, 1894);
    			attr_dev(button, "class", "py-8 hover:bg-gray-100 hover:text-large bg-white shadow overflow-hidden rounded-lg");
    			add_location(button, file$4, 52, 6, 1748);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, h3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(52:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:4) {#if demos['demo1']['active']}
    function create_if_block_2(ctx) {
    	let div1;
    	let div0;
    	let button;
    	let svg;
    	let path;
    	let t;
    	let demo1;
    	let current;
    	let mounted;
    	let dispose;
    	demo1 = new Demo1({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t = space();
    			create_component(demo1.$$.fragment);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M6 18L18 6M6 6l12 12");
    			add_location(path, file$4, 45, 14, 1548);
    			attr_dev(svg, "class", "h-6 w-6");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$4, 44, 12, 1404);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "bg-gray-100 rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mr-1 mt-1");
    			add_location(button, file$4, 43, 10, 1123);
    			attr_dev(div0, "class", "absolute top-0 right-0 ");
    			add_location(div0, file$4, 42, 8, 1075);
    			attr_dev(div1, "class", "relative");
    			add_location(div1, file$4, 41, 6, 1044);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(div1, t);
    			mount_component(demo1, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(demo1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(demo1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(demo1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(41:4) {#if demos['demo1']['active']}",
    		ctx
    	});

    	return block;
    }

    // (72:4) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let h3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			h3 = element("h3");
    			h3.textContent = "Demonstration 2";
    			attr_dev(h3, "class", "text-lg leading-6 font-medium");
    			add_location(h3, file$4, 73, 8, 2924);
    			attr_dev(button, "class", "py-8 hover:bg-gray-100 hover:text-large bg-white shadow overflow-hidden rounded-lg");
    			add_location(button, file$4, 72, 6, 2778);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, h3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(72:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (61:4) {#if demos['demo2']['active']}
    function create_if_block_1(ctx) {
    	let div1;
    	let div0;
    	let button;
    	let svg;
    	let path;
    	let t;
    	let demo2;
    	let current;
    	let mounted;
    	let dispose;
    	demo2 = new Demo2({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t = space();
    			create_component(demo2.$$.fragment);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M6 18L18 6M6 6l12 12");
    			add_location(path, file$4, 65, 14, 2578);
    			attr_dev(svg, "class", "h-6 w-6");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$4, 64, 12, 2434);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "bg-gray-100 rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mr-1 mt-1");
    			add_location(button, file$4, 63, 10, 2153);
    			attr_dev(div0, "class", "absolute top-0 right-0 ");
    			add_location(div0, file$4, 62, 8, 2105);
    			attr_dev(div1, "class", "relative");
    			add_location(div1, file$4, 61, 6, 2074);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(div1, t);
    			mount_component(demo2, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(demo2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(demo2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(demo2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(61:4) {#if demos['demo2']['active']}",
    		ctx
    	});

    	return block;
    }

    // (92:4) {:else}
    function create_else_block(ctx) {
    	let button;
    	let h3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			h3 = element("h3");
    			h3.textContent = "Demonstration 3";
    			attr_dev(h3, "class", "text-lg leading-6 font-medium");
    			add_location(h3, file$4, 93, 8, 3947);
    			attr_dev(button, "class", "py-8 hover:bg-gray-100 hover:text-large bg-white shadow overflow-hidden rounded-lg");
    			add_location(button, file$4, 92, 6, 3801);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, h3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_5*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(92:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (81:4) {#if demos['demo3']['active']}
    function create_if_block$1(ctx) {
    	let div1;
    	let div0;
    	let button;
    	let svg;
    	let path;
    	let t;
    	let demo3;
    	let current;
    	let mounted;
    	let dispose;
    	demo3 = new Demo3({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t = space();
    			create_component(demo3.$$.fragment);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M6 18L18 6M6 6l12 12");
    			add_location(path, file$4, 85, 14, 3601);
    			attr_dev(svg, "class", "h-6 w-6");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$4, 84, 12, 3457);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "bg-gray-100 rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mr-1 mt-1");
    			add_location(button, file$4, 83, 10, 3176);
    			attr_dev(div0, "class", "absolute top-0 right-0 ");
    			add_location(div0, file$4, 82, 8, 3128);
    			attr_dev(div1, "class", "relative");
    			add_location(div1, file$4, 81, 6, 3097);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(div1, t);
    			mount_component(demo3, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_4*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(demo3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(demo3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(demo3);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(81:4) {#if demos['demo3']['active']}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div5;
    	let div3;
    	let div0;
    	let generatorselection;
    	let t0;
    	let startdemo;
    	let t1;
    	let div1;
    	let generatorstats;
    	let t2;
    	let div2;
    	let demostats;
    	let t3;
    	let div4;
    	let current_block_type_index;
    	let if_block0;
    	let t4;
    	let current_block_type_index_1;
    	let if_block1;
    	let t5;
    	let current_block_type_index_2;
    	let if_block2;
    	let current;
    	generatorselection = new GeneratorSelection({ $$inline: true });
    	startdemo = new StartDemo({ $$inline: true });
    	generatorstats = new GeneratorStats({ $$inline: true });
    	demostats = new DemoStats({ $$inline: true });
    	const if_block_creators = [create_if_block_2, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*demos*/ ctx[0]['demo1']['active']) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const if_block_creators_1 = [create_if_block_1, create_else_block_1];
    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*demos*/ ctx[0]['demo2']['active']) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_1(ctx);
    	if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    	const if_block_creators_2 = [create_if_block$1, create_else_block];
    	const if_blocks_2 = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*demos*/ ctx[0]['demo3']['active']) return 0;
    		return 1;
    	}

    	current_block_type_index_2 = select_block_type_2(ctx);
    	if_block2 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			create_component(generatorselection.$$.fragment);
    			t0 = space();
    			create_component(startdemo.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(generatorstats.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			create_component(demostats.$$.fragment);
    			t3 = space();
    			div4 = element("div");
    			if_block0.c();
    			t4 = space();
    			if_block1.c();
    			t5 = space();
    			if_block2.c();
    			attr_dev(div0, "class", "flex flex-col");
    			add_location(div0, file$4, 26, 4, 722);
    			attr_dev(div1, "class", "flex-1");
    			add_location(div1, file$4, 30, 4, 812);
    			attr_dev(div2, "class", "flex-1");
    			add_location(div2, file$4, 33, 4, 872);
    			attr_dev(div3, "class", "flex flex-col xl:flex-row gap-x-20 pb-16 space-y-4 justify-center");
    			add_location(div3, file$4, 25, 2, 638);
    			attr_dev(div4, "class", "grid grid-cols-2 gap-x-12 gap-y-6");
    			add_location(div4, file$4, 38, 2, 935);
    			add_location(div5, file$4, 24, 0, 630);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			append_dev(div3, div0);
    			mount_component(generatorselection, div0, null);
    			append_dev(div0, t0);
    			mount_component(startdemo, div0, null);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			mount_component(generatorstats, div1, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			mount_component(demostats, div2, null);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			if_blocks[current_block_type_index].m(div4, null);
    			append_dev(div4, t4);
    			if_blocks_1[current_block_type_index_1].m(div4, null);
    			append_dev(div4, t5);
    			if_blocks_2[current_block_type_index_2].m(div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div4, t4);
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_1(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks_1[current_block_type_index_1];

    				if (!if_block1) {
    					if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div4, t5);
    			}

    			let previous_block_index_2 = current_block_type_index_2;
    			current_block_type_index_2 = select_block_type_2(ctx);

    			if (current_block_type_index_2 === previous_block_index_2) {
    				if_blocks_2[current_block_type_index_2].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_2[previous_block_index_2], 1, 1, () => {
    					if_blocks_2[previous_block_index_2] = null;
    				});

    				check_outros();
    				if_block2 = if_blocks_2[current_block_type_index_2];

    				if (!if_block2) {
    					if_block2 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);
    					if_block2.c();
    				} else {
    					if_block2.p(ctx, dirty);
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(div4, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(generatorselection.$$.fragment, local);
    			transition_in(startdemo.$$.fragment, local);
    			transition_in(generatorstats.$$.fragment, local);
    			transition_in(demostats.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(generatorselection.$$.fragment, local);
    			transition_out(startdemo.$$.fragment, local);
    			transition_out(generatorstats.$$.fragment, local);
    			transition_out(demostats.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(generatorselection);
    			destroy_component(startdemo);
    			destroy_component(generatorstats);
    			destroy_component(demostats);
    			if_blocks[current_block_type_index].d();
    			if_blocks_1[current_block_type_index_1].d();
    			if_blocks_2[current_block_type_index_2].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Demonstrations', slots, []);

    	let demos = {
    		demo1: { active: false },
    		demo2: { active: false },
    		demo3: { active: false }
    	};

    	function toggle_demo(demo) {
    		$$invalidate(0, demos[demo]['active'] = !demos[demo]['active'], demos);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Demonstrations> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => toggle_demo('demo1');
    	const click_handler_1 = () => toggle_demo("demo1");
    	const click_handler_2 = () => toggle_demo('demo2');
    	const click_handler_3 = () => toggle_demo("demo2");
    	const click_handler_4 = () => toggle_demo('demo3');
    	const click_handler_5 = () => toggle_demo("demo3");

    	$$self.$capture_state = () => ({
    		DemoStats,
    		GeneratorStats,
    		GeneratorSelection,
    		StartDemo,
    		Demo1,
    		Demo2,
    		Demo3,
    		demos,
    		toggle_demo
    	});

    	$$self.$inject_state = $$props => {
    		if ('demos' in $$props) $$invalidate(0, demos = $$props.demos);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		demos,
    		toggle_demo,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class Demonstrations extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Demonstrations",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const routes = {
        // root
        '/': Documentation,
        '/demos': Demonstrations,
        '/qrng': Qrng
    };

    /* src/components/Navbar.svelte generated by Svelte v3.44.2 */
    const file$3 = "src/components/Navbar.svelte";

    function create_fragment$3(ctx) {
    	let nav;
    	let ul0;
    	let li;
    	let img;
    	let img_src_value;
    	let t0;
    	let ul1;
    	let a0;
    	let t1;
    	let a0_class_value;
    	let t2;
    	let a1;
    	let t3;
    	let a1_class_value;
    	let t4;
    	let a2;
    	let t5;
    	let a2_class_value;
    	let t6;
    	let a3;
    	let t7;
    	let a3_class_value;
    	let t8;
    	let a4;
    	let t9;
    	let a4_class_value;
    	let t10;
    	let t11;
    	let div;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul0 = element("ul");
    			li = element("li");
    			img = element("img");
    			t0 = space();
    			ul1 = element("ul");
    			a0 = element("a");
    			t1 = text("Documentation");
    			t2 = space();
    			a1 = element("a");
    			t3 = text("API");
    			t4 = space();
    			a2 = element("a");
    			t5 = text("QRNG");
    			t6 = space();
    			a3 = element("a");
    			t7 = text("Demos");
    			t8 = space();
    			a4 = element("a");
    			t9 = text("About");
    			t10 = space();
    			t11 = space();
    			div = element("div");
    			attr_dev(img, "class", "h-full w-full mx-auto");
    			if (!src_url_equal(img.src, img_src_value = "/qrng-logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "svelte logo");
    			add_location(img, file$3, 10, 12, 291);
    			attr_dev(li, "class", "h-8 w-8");
    			add_location(li, file$3, 9, 8, 258);
    			attr_dev(ul0, "class", "my-auto");
    			add_location(ul0, file$3, 8, 4, 229);
    			attr_dev(a0, "href", "/#");
    			attr_dev(a0, "class", a0_class_value = "hover:no-underline " + (/*$location*/ ctx[0] == '/' ? selected_color : ''));
    			add_location(a0, file$3, 21, 8, 584);
    			attr_dev(a1, "href", "/#/api");
    			attr_dev(a1, "class", a1_class_value = "hover:no-underline " + (/*$location*/ ctx[0] == '/api' ? selected_color : ''));
    			add_location(a1, file$3, 22, 8, 691);
    			attr_dev(a2, "href", "/#/qrng");
    			attr_dev(a2, "class", a2_class_value = "hover:no-underline " + (/*$location*/ ctx[0] == '/qrng' ? selected_color : ''));
    			add_location(a2, file$3, 23, 8, 795);
    			attr_dev(a3, "href", "/#/demos");
    			attr_dev(a3, "class", a3_class_value = "hover:no-underline " + (/*$location*/ ctx[0] == '/demos' ? selected_color : ''));
    			add_location(a3, file$3, 24, 8, 902);
    			attr_dev(a4, "href", "/#/about");
    			attr_dev(a4, "class", a4_class_value = "hover:no-underline " + (/*$location*/ ctx[0] == '/about' ? selected_color : ''));
    			add_location(a4, file$3, 25, 8, 1012);
    			attr_dev(ul1, "class", "flex items-center gap-10 flex-grow justify-end");
    			add_location(ul1, file$3, 20, 4, 516);
    			attr_dev(nav, "class", "flex flex-col flex-wrap justify-between font-mono bg-white h-12 px-4 md:px-32");
    			add_location(nav, file$3, 5, 0, 114);
    			attr_dev(div, "class", "border-t border-gray-200");
    			add_location(div, file$3, 57, 0, 2140);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul0);
    			append_dev(ul0, li);
    			append_dev(li, img);
    			append_dev(nav, t0);
    			append_dev(nav, ul1);
    			append_dev(ul1, a0);
    			append_dev(a0, t1);
    			append_dev(ul1, t2);
    			append_dev(ul1, a1);
    			append_dev(a1, t3);
    			append_dev(ul1, t4);
    			append_dev(ul1, a2);
    			append_dev(a2, t5);
    			append_dev(ul1, t6);
    			append_dev(ul1, a3);
    			append_dev(a3, t7);
    			append_dev(ul1, t8);
    			append_dev(ul1, a4);
    			append_dev(a4, t9);
    			append_dev(nav, t10);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$location*/ 1 && a0_class_value !== (a0_class_value = "hover:no-underline " + (/*$location*/ ctx[0] == '/' ? selected_color : ''))) {
    				attr_dev(a0, "class", a0_class_value);
    			}

    			if (dirty & /*$location*/ 1 && a1_class_value !== (a1_class_value = "hover:no-underline " + (/*$location*/ ctx[0] == '/api' ? selected_color : ''))) {
    				attr_dev(a1, "class", a1_class_value);
    			}

    			if (dirty & /*$location*/ 1 && a2_class_value !== (a2_class_value = "hover:no-underline " + (/*$location*/ ctx[0] == '/qrng' ? selected_color : ''))) {
    				attr_dev(a2, "class", a2_class_value);
    			}

    			if (dirty & /*$location*/ 1 && a3_class_value !== (a3_class_value = "hover:no-underline " + (/*$location*/ ctx[0] == '/demos' ? selected_color : ''))) {
    				attr_dev(a3, "class", a3_class_value);
    			}

    			if (dirty & /*$location*/ 1 && a4_class_value !== (a4_class_value = "hover:no-underline " + (/*$location*/ ctx[0] == '/about' ? selected_color : ''))) {
    				attr_dev(a4, "class", a4_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const selected_color = 'text-it-red';

    function instance$3($$self, $$props, $$invalidate) {
    	let $location;
    	validate_store(location, 'location');
    	component_subscribe($$self, location, $$value => $$invalidate(0, $location = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ location, selected_color, $location });
    	return [$location];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/Footer.svelte generated by Svelte v3.44.2 */

    const file$2 = "src/components/Footer.svelte";

    function create_fragment$2(ctx) {
    	let footer;
    	let div5;
    	let div0;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let p0;
    	let t2;
    	let div4;
    	let div1;
    	let h20;
    	let t4;
    	let ul0;
    	let li0;
    	let a1;
    	let t6;
    	let li1;
    	let a2;
    	let t8;
    	let div2;
    	let h21;
    	let t10;
    	let ul1;
    	let li2;
    	let a3;
    	let t12;
    	let li3;
    	let a4;
    	let t14;
    	let li4;
    	let a5;
    	let t16;
    	let div3;
    	let h22;
    	let t18;
    	let ul2;
    	let li5;
    	let a6;
    	let t20;
    	let li6;
    	let a7;
    	let t22;
    	let li7;
    	let a8;
    	let t24;
    	let li8;
    	let a9;
    	let t26;
    	let div6;
    	let p1;
    	let t27;
    	let a10;
    	let t29;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div5 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "Quantum Random Number Generator";
    			t2 = space();
    			div4 = element("div");
    			div1 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Docs";
    			t4 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "Documentation";
    			t6 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "Staff";
    			t8 = space();
    			div2 = element("div");
    			h21 = element("h2");
    			h21.textContent = "API";
    			t10 = space();
    			ul1 = element("ul");
    			li2 = element("li");
    			a3 = element("a");
    			a3.textContent = "Register";
    			t12 = space();
    			li3 = element("li");
    			a4 = element("a");
    			a4.textContent = "Log In";
    			t14 = space();
    			li4 = element("li");
    			a5 = element("a");
    			a5.textContent = "Documendation";
    			t16 = space();
    			div3 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Contacts";
    			t18 = space();
    			ul2 = element("ul");
    			li5 = element("li");
    			a6 = element("a");
    			a6.textContent = "Website";
    			t20 = space();
    			li6 = element("li");
    			a7 = element("a");
    			a7.textContent = "Phone";
    			t22 = space();
    			li7 = element("li");
    			a8 = element("a");
    			a8.textContent = "Email";
    			t24 = space();
    			li8 = element("li");
    			a9 = element("a");
    			a9.textContent = "Locations";
    			t26 = space();
    			div6 = element("div");
    			p1 = element("p");
    			t27 = text("All rights reserved by ");
    			a10 = element("a");
    			a10.textContent = "IT";
    			t29 = text(" 2021");
    			attr_dev(img, "alt", "IT Header");
    			if (!src_url_equal(img.src, img_src_value = "assets/images/logo-IT-header.png")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$2, 13, 66, 419);
    			attr_dev(a0, "class", "flex items-center hover:no-underline");
    			attr_dev(a0, "href", "/#");
    			add_location(a0, file$2, 13, 8, 361);
    			attr_dev(p0, "class", "mt-2 text-md text-gray-500");
    			add_location(p0, file$2, 14, 8, 493);
    			attr_dev(div0, "class", "w-1/3 mx-auto text-left sm:justify-center md:justify-start mb-12");
    			add_location(div0, file$2, 12, 6, 273);
    			attr_dev(h20, "class", "mb-8 tracking-widest text-gray-900");
    			add_location(h20, file$2, 20, 10, 712);
    			attr_dev(a1, "href", "/#");
    			attr_dev(a1, "class", "text-gray-500 hover:text-gray-800 hover:no-underline");
    			add_location(a1, file$2, 25, 14, 880);
    			add_location(li0, file$2, 24, 12, 861);
    			attr_dev(a2, "href", "/#");
    			attr_dev(a2, "class", "text-gray-500 hover:text-gray-800 hover:no-underline");
    			add_location(a2, file$2, 28, 14, 1021);
    			add_location(li1, file$2, 27, 12, 1002);
    			attr_dev(ul0, "class", "mb-8 space-y-2 text-sm list-none");
    			add_location(ul0, file$2, 23, 10, 803);
    			attr_dev(div1, "class", "w-full px-4");
    			add_location(div1, file$2, 19, 8, 676);
    			attr_dev(h21, "class", "mb-8 tracking-widest text-gray-900");
    			add_location(h21, file$2, 33, 10, 1198);
    			attr_dev(a3, "href", "/#");
    			attr_dev(a3, "class", "text-gray-500 hover:text-gray-800 hover:no-underline");
    			add_location(a3, file$2, 38, 14, 1365);
    			add_location(li2, file$2, 37, 12, 1346);
    			attr_dev(a4, "href", "/#");
    			attr_dev(a4, "class", "text-gray-500 hover:text-gray-800 hover:no-underline");
    			add_location(a4, file$2, 41, 14, 1501);
    			add_location(li3, file$2, 40, 12, 1482);
    			attr_dev(a5, "href", "/#");
    			attr_dev(a5, "class", "text-gray-500 hover:text-gray-800 hover:no-underline");
    			add_location(a5, file$2, 44, 14, 1635);
    			add_location(li4, file$2, 43, 12, 1616);
    			attr_dev(ul1, "class", "mb-8 space-y-2 text-sm list-none");
    			add_location(ul1, file$2, 36, 10, 1288);
    			attr_dev(div2, "class", "w-full px-4");
    			add_location(div2, file$2, 32, 8, 1162);
    			attr_dev(h22, "class", "mb-8 tracking-widest text-gray-900");
    			add_location(h22, file$2, 49, 10, 1820);
    			attr_dev(a6, "href", "/#");
    			attr_dev(a6, "class", "text-gray-500 hover:text-gray-800 hover:no-underline");
    			add_location(a6, file$2, 54, 14, 1992);
    			add_location(li5, file$2, 53, 12, 1973);
    			attr_dev(a7, "href", "/#");
    			attr_dev(a7, "class", "text-gray-500 hover:text-gray-800 hover:no-underline");
    			add_location(a7, file$2, 57, 14, 2127);
    			add_location(li6, file$2, 56, 12, 2108);
    			attr_dev(a8, "href", "/#");
    			attr_dev(a8, "class", "text-gray-500 hover:text-gray-800 hover:no-underline");
    			add_location(a8, file$2, 60, 14, 2260);
    			add_location(li7, file$2, 59, 12, 2241);
    			attr_dev(a9, "href", "/#");
    			attr_dev(a9, "class", "text-gray-500 hover:text-gray-800 hover:no-underline");
    			add_location(a9, file$2, 63, 14, 2393);
    			add_location(li8, file$2, 62, 12, 2374);
    			attr_dev(ul2, "class", "mb-8 space-y-2 text-sm list-none");
    			add_location(ul2, file$2, 52, 10, 1915);
    			attr_dev(div3, "class", "w-full px-4");
    			add_location(div3, file$2, 48, 8, 1784);
    			attr_dev(div4, "class", "justify-between w-full mt-4 lg:flex text-center");
    			add_location(div4, file$2, 18, 6, 606);
    			attr_dev(div5, "class", "container flex flex-col flex-wrap items-center px-4 py-12 mx-auto lg:items-start md:flex-row md:flex-nowrap ");
    			add_location(div5, file$2, 1, 4, 70);
    			attr_dev(a10, "href", "https://www.it.pt");
    			add_location(a10, file$2, 71, 31, 2665);
    			attr_dev(p1, "class", "text-base text-gray-400");
    			add_location(p1, file$2, 70, 6, 2598);
    			attr_dev(div6, "class", "flex justify-center");
    			add_location(div6, file$2, 69, 4, 2558);
    			attr_dev(footer, "class", "border-t border-gray-200 font-mono px-4 md:px-32");
    			add_location(footer, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div5);
    			append_dev(div5, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img);
    			append_dev(div0, t0);
    			append_dev(div0, p0);
    			append_dev(div5, t2);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, h20);
    			append_dev(div1, t4);
    			append_dev(div1, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, a1);
    			append_dev(ul0, t6);
    			append_dev(ul0, li1);
    			append_dev(li1, a2);
    			append_dev(div4, t8);
    			append_dev(div4, div2);
    			append_dev(div2, h21);
    			append_dev(div2, t10);
    			append_dev(div2, ul1);
    			append_dev(ul1, li2);
    			append_dev(li2, a3);
    			append_dev(ul1, t12);
    			append_dev(ul1, li3);
    			append_dev(li3, a4);
    			append_dev(ul1, t14);
    			append_dev(ul1, li4);
    			append_dev(li4, a5);
    			append_dev(div4, t16);
    			append_dev(div4, div3);
    			append_dev(div3, h22);
    			append_dev(div3, t18);
    			append_dev(div3, ul2);
    			append_dev(ul2, li5);
    			append_dev(li5, a6);
    			append_dev(ul2, t20);
    			append_dev(ul2, li6);
    			append_dev(li6, a7);
    			append_dev(ul2, t22);
    			append_dev(ul2, li7);
    			append_dev(li7, a8);
    			append_dev(ul2, t24);
    			append_dev(ul2, li8);
    			append_dev(li8, a9);
    			append_dev(footer, t26);
    			append_dev(footer, div6);
    			append_dev(div6, p1);
    			append_dev(p1, t27);
    			append_dev(p1, a10);
    			append_dev(p1, t29);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/pages/demonstrations/components/DemoProgress.svelte generated by Svelte v3.44.2 */
    const file$1 = "src/pages/demonstrations/components/DemoProgress.svelte";

    // (6:0) {#if $selected_generator.active}
    function create_if_block(ctx) {
    	let div10;
    	let div9;
    	let div0;
    	let a;
    	let t1;
    	let div3;
    	let div1;
    	let dt0;
    	let t3;
    	let dd0;
    	let t4_value = /*$selected_generator*/ ctx[1].random_values.length + "";
    	let t4;
    	let t5;
    	let div2;
    	let dt1;
    	let t7;
    	let dd1;
    	let t8_value = /*$selected_generator*/ ctx[1].elapsed + "";
    	let t8;
    	let t9;
    	let t10;
    	let div4;
    	let t11;
    	let div8;
    	let div5;
    	let dt2;
    	let t13;
    	let dd2;

    	let t14_value = (/*$selected_generator*/ ctx[1].statistics.min == null
    	? '0'
    	: /*$selected_generator*/ ctx[1].statistics.min.toFixed(8)) + "";

    	let t14;
    	let t15;
    	let div6;
    	let dt3;
    	let t17;
    	let dd3;

    	let t18_value = (/*$selected_generator*/ ctx[1].statistics.mean == null
    	? '0'
    	: /*$selected_generator*/ ctx[1].statistics.mean.toFixed(8)) + "";

    	let t18;
    	let t19;
    	let div7;
    	let dt4;
    	let t21;
    	let dd4;

    	let t22_value = (/*$selected_generator*/ ctx[1].statistics.max == null
    	? '0'
    	: /*$selected_generator*/ ctx[1].statistics.max.toFixed(8)) + "";

    	let t22;
    	let div9_class_value;
    	let t23;
    	let button;
    	let span;
    	let t24_value = (/*$selected_generator*/ ctx[1].random_values.length / /*$selected_generator*/ ctx[1].total * 100).toFixed(1) + "";
    	let t24;
    	let t25;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div9 = element("div");
    			div0 = element("div");
    			a = element("a");
    			a.textContent = "Back";
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			dt0 = element("dt");
    			dt0.textContent = "Generated";
    			t3 = space();
    			dd0 = element("dd");
    			t4 = text(t4_value);
    			t5 = space();
    			div2 = element("div");
    			dt1 = element("dt");
    			dt1.textContent = "Elapsed";
    			t7 = space();
    			dd1 = element("dd");
    			t8 = text(t8_value);
    			t9 = text(" s");
    			t10 = space();
    			div4 = element("div");
    			t11 = space();
    			div8 = element("div");
    			div5 = element("div");
    			dt2 = element("dt");
    			dt2.textContent = "Min";
    			t13 = space();
    			dd2 = element("dd");
    			t14 = text(t14_value);
    			t15 = space();
    			div6 = element("div");
    			dt3 = element("dt");
    			dt3.textContent = "Mean";
    			t17 = space();
    			dd3 = element("dd");
    			t18 = text(t18_value);
    			t19 = space();
    			div7 = element("div");
    			dt4 = element("dt");
    			dt4.textContent = "Max";
    			t21 = space();
    			dd4 = element("dd");
    			t22 = text(t22_value);
    			t23 = space();
    			button = element("button");
    			span = element("span");
    			t24 = text(t24_value);
    			t25 = text(" %");
    			attr_dev(a, "href", "/#/demos");
    			add_location(a, file$1, 9, 12, 432);
    			attr_dev(div0, "class", "absolute top-0 right-2");
    			add_location(div0, file$1, 8, 8, 383);
    			attr_dev(dt0, "class", "text-sm font-medium text-gray-500");
    			add_location(dt0, file$1, 13, 16, 600);
    			attr_dev(dd0, "class", "text-sm text-gray-900 sm:mt-0 sm:col-span-2");
    			add_location(dd0, file$1, 16, 16, 715);
    			attr_dev(div1, "class", "w-1/2");
    			add_location(div1, file$1, 12, 12, 564);
    			attr_dev(dt1, "class", "text-sm font-medium text-gray-500");
    			add_location(dt1, file$1, 21, 16, 926);
    			attr_dev(dd1, "class", "text-sm text-gray-900 sm:mt-0 sm:col-span-2");
    			add_location(dd1, file$1, 24, 16, 1039);
    			attr_dev(div2, "class", "w-1/2");
    			add_location(div2, file$1, 20, 12, 890);
    			attr_dev(div3, "class", "grid grid-cols-2");
    			add_location(div3, file$1, 11, 8, 521);
    			attr_dev(div4, "class", "border-t border-gray-200 w-full");
    			add_location(div4, file$1, 29, 8, 1214);
    			attr_dev(dt2, "class", "text-sm font-medium text-gray-500");
    			add_location(dt2, file$1, 32, 16, 1358);
    			attr_dev(dd2, "class", "text-sm text-gray-900 sm:mt-0 sm:col-span-2");
    			add_location(dd2, file$1, 35, 16, 1467);
    			attr_dev(div5, "class", "w-1/2");
    			add_location(div5, file$1, 31, 12, 1322);
    			attr_dev(dt3, "class", "text-sm font-medium text-gray-500");
    			add_location(dt3, file$1, 40, 16, 1734);
    			attr_dev(dd3, "class", "text-sm text-gray-900 sm:mt-0 sm:col-span-2");
    			add_location(dd3, file$1, 43, 16, 1844);
    			attr_dev(div6, "class", "w-1/2");
    			add_location(div6, file$1, 39, 12, 1698);
    			attr_dev(dt4, "class", "text-sm font-medium text-gray-500");
    			add_location(dt4, file$1, 48, 16, 2114);
    			attr_dev(dd4, "class", "text-sm text-gray-900 sm:mt-0 sm:col-span-2");
    			add_location(dd4, file$1, 51, 16, 2223);
    			attr_dev(div7, "class", "w-1/2");
    			add_location(div7, file$1, 47, 12, 2078);
    			attr_dev(div8, "class", "grid grid-cols-2 pt-4");
    			add_location(div8, file$1, 30, 8, 1274);
    			attr_dev(div9, "class", div9_class_value = "w-96 " + (/*show_tooltip*/ ctx[0] ? '' : 'invisible') + " absolute rounded shadow-lg px-8 py-4 bg-white text-gray-500 -ml-96 mt-8 z-40");
    			add_location(div9, file$1, 7, 4, 196);
    			attr_dev(span, "class", "m-auto");
    			add_location(span, file$1, 59, 8, 2651);
    			attr_dev(button, "class", "flex rounded-full bg-gray-200 text-gray-500 w-full h-full cursor-pointer animate-bounce scale-125");
    			add_location(button, file$1, 58, 4, 2482);
    			attr_dev(div10, "class", "w-full h-full sticky");
    			add_location(div10, file$1, 6, 0, 157);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div9);
    			append_dev(div9, div0);
    			append_dev(div0, a);
    			append_dev(div9, t1);
    			append_dev(div9, div3);
    			append_dev(div3, div1);
    			append_dev(div1, dt0);
    			append_dev(div1, t3);
    			append_dev(div1, dd0);
    			append_dev(dd0, t4);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, dt1);
    			append_dev(div2, t7);
    			append_dev(div2, dd1);
    			append_dev(dd1, t8);
    			append_dev(dd1, t9);
    			append_dev(div9, t10);
    			append_dev(div9, div4);
    			append_dev(div9, t11);
    			append_dev(div9, div8);
    			append_dev(div8, div5);
    			append_dev(div5, dt2);
    			append_dev(div5, t13);
    			append_dev(div5, dd2);
    			append_dev(dd2, t14);
    			append_dev(div8, t15);
    			append_dev(div8, div6);
    			append_dev(div6, dt3);
    			append_dev(div6, t17);
    			append_dev(div6, dd3);
    			append_dev(dd3, t18);
    			append_dev(div8, t19);
    			append_dev(div8, div7);
    			append_dev(div7, dt4);
    			append_dev(div7, t21);
    			append_dev(div7, dd4);
    			append_dev(dd4, t22);
    			append_dev(div10, t23);
    			append_dev(div10, button);
    			append_dev(button, span);
    			append_dev(span, t24);
    			append_dev(span, t25);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(div9, "mouseleave", /*mouseleave_handler*/ ctx[4], false, false, false),
    					listen_dev(div9, "blur", /*blur_handler*/ ctx[2], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$selected_generator*/ 2 && t4_value !== (t4_value = /*$selected_generator*/ ctx[1].random_values.length + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*$selected_generator*/ 2 && t8_value !== (t8_value = /*$selected_generator*/ ctx[1].elapsed + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*$selected_generator*/ 2 && t14_value !== (t14_value = (/*$selected_generator*/ ctx[1].statistics.min == null
    			? '0'
    			: /*$selected_generator*/ ctx[1].statistics.min.toFixed(8)) + "")) set_data_dev(t14, t14_value);

    			if (dirty & /*$selected_generator*/ 2 && t18_value !== (t18_value = (/*$selected_generator*/ ctx[1].statistics.mean == null
    			? '0'
    			: /*$selected_generator*/ ctx[1].statistics.mean.toFixed(8)) + "")) set_data_dev(t18, t18_value);

    			if (dirty & /*$selected_generator*/ 2 && t22_value !== (t22_value = (/*$selected_generator*/ ctx[1].statistics.max == null
    			? '0'
    			: /*$selected_generator*/ ctx[1].statistics.max.toFixed(8)) + "")) set_data_dev(t22, t22_value);

    			if (dirty & /*show_tooltip*/ 1 && div9_class_value !== (div9_class_value = "w-96 " + (/*show_tooltip*/ ctx[0] ? '' : 'invisible') + " absolute rounded shadow-lg px-8 py-4 bg-white text-gray-500 -ml-96 mt-8 z-40")) {
    				attr_dev(div9, "class", div9_class_value);
    			}

    			if (dirty & /*$selected_generator*/ 2 && t24_value !== (t24_value = (/*$selected_generator*/ ctx[1].random_values.length / /*$selected_generator*/ ctx[1].total * 100).toFixed(1) + "")) set_data_dev(t24, t24_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(6:0) {#if $selected_generator.active}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*$selected_generator*/ ctx[1].active && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$selected_generator*/ ctx[1].active) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $selected_generator;
    	validate_store(selected_generator, 'selected_generator');
    	component_subscribe($$self, selected_generator, $$value => $$invalidate(1, $selected_generator = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DemoProgress', slots, []);
    	let show_tooltip = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DemoProgress> was created with unknown prop '${key}'`);
    	});

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => $$invalidate(0, show_tooltip = false);
    	const mouseleave_handler = () => $$invalidate(0, show_tooltip = false);
    	const click_handler_1 = () => $$invalidate(0, show_tooltip = !show_tooltip);

    	$$self.$capture_state = () => ({
    		selected_generator,
    		show_tooltip,
    		$selected_generator
    	});

    	$$self.$inject_state = $$props => {
    		if ('show_tooltip' in $$props) $$invalidate(0, show_tooltip = $$props.show_tooltip);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		show_tooltip,
    		$selected_generator,
    		blur_handler,
    		click_handler,
    		mouseleave_handler,
    		click_handler_1
    	];
    }

    class DemoProgress extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DemoProgress",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    let all_generators = [
        {
            id: 1,
            name: "Intel QRNG",
            img: "qrng-logo.png",
            developed_by: 'Intel',
            type: 'QUANTUM'
        },
        {
            id: 2,
            name: "IT proprietary",
            img: "qrng-logo.png",
            developed_by: 'IT',
            type: 'PSEUDO-RANDOM'
        },
        {
            id: 3,
            name: "Raspberry PI",
            img: "qrng-logo.png",
            developed_by: 'Raspberry Fundation',
            type: 'PSEUDO-RANDOM'
        },
        {
            id: 4,
            name: "IT QRNG",
            img: "qrng-logo.png",
            developed_by: "IT",
            type: "QUANTUM"
        }
    ];
    function fetchGenerators() {
        generators.set(all_generators);
    }

    /* src/App.svelte generated by Svelte v3.44.2 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let body;
    	let navbar;
    	let t0;
    	let div0;
    	let demoprogress;
    	let t1;
    	let div1;
    	let router;
    	let t2;
    	let footer;
    	let current;
    	navbar = new Navbar({ $$inline: true });
    	demoprogress = new DemoProgress({ $$inline: true });
    	router = new Router({ props: { routes }, $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			body = element("body");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			create_component(demoprogress.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(router.$$.fragment);
    			t2 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div0, "class", "absolute top-12 right-32 w-16 h-16 z-10");
    			add_location(div0, file, 16, 1, 578);
    			attr_dev(div1, "class", "flex-grow min-w-full px-4 md:px-32 py-12 bg-light-gray text-gray-700 z-0");
    			add_location(div1, file, 19, 1, 659);
    			attr_dev(body, "class", "flex flex-col min-h-screen font-body");
    			add_location(body, file, 14, 0, 514);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			mount_component(navbar, body, null);
    			append_dev(body, t0);
    			append_dev(body, div0);
    			mount_component(demoprogress, div0, null);
    			append_dev(body, t1);
    			append_dev(body, div1);
    			mount_component(router, div1, null);
    			append_dev(body, t2);
    			mount_component(footer, body, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(demoprogress.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(demoprogress.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			destroy_component(navbar);
    			destroy_component(demoprogress);
    			destroy_component(router);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	onMount(() => {
    		fetchGenerators();
    		assignGenerator();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Router,
    		routes,
    		Navbar,
    		Footer,
    		DemoProgress,
    		fetchGenerators,
    		assignGenerator
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
