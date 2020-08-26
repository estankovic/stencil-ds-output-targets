// @ts-nocheck
/* generated by Svelte v3.24.1 */
import {
	SvelteComponent,
	binding_callbacks,
	create_slot,
	detach,
	element,
	flush,
	init,
	insert,
	listen,
	run_all,
	safe_not_equal,
	set_custom_element_data,
	transition_in,
	transition_out,
	update_slot
} from "svelte/internal";

import { createEventDispatcher, onMount } from "svelte";

function create_fragment(ctx) {
	let my_radio;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[8].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

	return {
		c() {
			my_radio = element("my-radio");
			if (default_slot) default_slot.c();
			set_custom_element_data(my_radio, "color", /*color*/ ctx[0]);
			set_custom_element_data(my_radio, "name", /*name*/ ctx[1]);
			set_custom_element_data(my_radio, "disabled", /*disabled*/ ctx[2]);
			set_custom_element_data(my_radio, "value", /*value*/ ctx[3]);
		},
		m(target, anchor) {
			insert(target, my_radio, anchor);

			if (default_slot) {
				default_slot.m(my_radio, null);
			}

			/*my_radio_binding*/ ctx[9](my_radio);
			current = true;

			if (!mounted) {
				dispose = [
					listen(my_radio, "myStyle", /*onEvent*/ ctx[5]),
					listen(my_radio, "myFocus", /*onEvent*/ ctx[5]),
					listen(my_radio, "myBlur", /*onEvent*/ ctx[5]),
					listen(my_radio, "mySelect", /*onEvent*/ ctx[5])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 128) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[7], dirty, null, null);
				}
			}

			if (!current || dirty & /*color*/ 1) {
				set_custom_element_data(my_radio, "color", /*color*/ ctx[0]);
			}

			if (!current || dirty & /*name*/ 2) {
				set_custom_element_data(my_radio, "name", /*name*/ ctx[1]);
			}

			if (!current || dirty & /*disabled*/ 4) {
				set_custom_element_data(my_radio, "disabled", /*disabled*/ ctx[2]);
			}

			if (!current || dirty & /*value*/ 8) {
				set_custom_element_data(my_radio, "value", /*value*/ ctx[3]);
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(my_radio);
			if (default_slot) default_slot.d(detaching);
			/*my_radio_binding*/ ctx[9](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let __ref;
	let __mounted = false;
	const dispatch = createEventDispatcher();
	let { color } = $$props;
	let { name } = $$props;
	let { disabled } = $$props;
	let { value } = $$props;
	const getWebComponent = () => __ref;

	onMount(() => {
		__mounted = true;
	});

	const setProp = (prop, value) => {
		if (__ref) $$invalidate(4, __ref[prop] = value, __ref);
	};

	const onEvent = e => {
		e.stopPropagation();
		dispatch(e.type, e.detail);

		if (e.type === "mySelect") {
			checked = e.detail;
		}
	};

	let { $$slots = {}, $$scope } = $$props;

	function my_radio_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			__ref = $$value;
			$$invalidate(4, __ref);
		});
	}

	$$self.$$set = $$props => {
		if ("color" in $$props) $$invalidate(0, color = $$props.color);
		if ("name" in $$props) $$invalidate(1, name = $$props.name);
		if ("disabled" in $$props) $$invalidate(2, disabled = $$props.disabled);
		if ("value" in $$props) $$invalidate(3, value = $$props.value);
		if ("$$scope" in $$props) $$invalidate(7, $$scope = $$props.$$scope);
	};

	return [
		color,
		name,
		disabled,
		value,
		__ref,
		onEvent,
		getWebComponent,
		$$scope,
		$$slots,
		my_radio_binding
	];
}

class MyRadio extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance, create_fragment, safe_not_equal, {
			color: 0,
			name: 1,
			disabled: 2,
			value: 3,
			getWebComponent: 6
		});
	}

	get color() {
		return this.$$.ctx[0];
	}

	set color(color) {
		this.$set({ color });
		flush();
	}

	get name() {
		return this.$$.ctx[1];
	}

	set name(name) {
		this.$set({ name });
		flush();
	}

	get disabled() {
		return this.$$.ctx[2];
	}

	set disabled(disabled) {
		this.$set({ disabled });
		flush();
	}

	get value() {
		return this.$$.ctx[3];
	}

	set value(value) {
		this.$set({ value });
		flush();
	}

	get getWebComponent() {
		return this.$$.ctx[6];
	}
}

export default MyRadio;