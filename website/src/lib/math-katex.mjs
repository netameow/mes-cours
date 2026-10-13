import katex from 'katex';

export const mathKatex = {
	name: 'math-katex',
	inlineMath(node) {
		return {
			type: 'html',
			value: katex.renderToString(node.value, { displayMode: false, throwOnError: false }),
		};
	},
	math(node) {
		return {
			type: 'html',
			value: `<div class="katex-block">${katex.renderToString(node.value, { displayMode: true, throwOnError: false })}</div>`,
		};
	},
};
