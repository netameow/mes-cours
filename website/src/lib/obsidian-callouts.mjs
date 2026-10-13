const CALLOUT_VARIANTS = {
	// Bleu
	note: 'note',
	abstract: 'note',
	summary: 'note',
	tldr: 'note',
	info: 'note',
	todo: 'note',
	example: 'note',
	quote: 'note',
	cite: 'note',
	// Violet
	tip: 'tip',
	hint: 'tip',
	important: 'tip',
	success: 'tip',
	check: 'tip',
	done: 'tip',
	question: 'tip',
	help: 'tip',
	faq: 'tip',
	// Orange
	warning: 'caution',
	caution: 'caution',
	attention: 'caution',
	// Rouge
	danger: 'danger',
	error: 'danger',
	bug: 'danger',
	failure: 'danger',
	fail: 'danger',
	missing: 'danger',
};

const DEFAULT_TITLES = {
	note: 'Note',
	tip: 'Astuce',
	caution: 'Attention',
	danger: 'Danger',
};

const ICONS = {
	note: '<path d="M12 11a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-1Zm.38-3.92a1 1 0 0 0-.76 0 1 1 0 0 0-.33.21 1.15 1.15 0 0 0-.21.33 1 1 0 0 0 .21 1.09c.097.088.209.16.33.21A1 1 0 0 0 13 8a1.05 1.05 0 0 0-.29-.71 1 1 0 0 0-.33-.21ZM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16.001A8 8 0 0 1 12 20Z"/>',
	tip: '<path fill-rule="evenodd" d="M1.44 8.855v-.001l3.527-3.516c.34-.344.802-.541 1.285-.548h6.649l.947-.947c3.07-3.07 6.207-3.072 7.62-2.868a1.821 1.821 0 0 1 1.557 1.557c.204 1.413.203 4.55-2.868 7.62l-.946.946v6.649a1.845 1.845 0 0 1-.549 1.286l-3.516 3.528a1.844 1.844 0 0 1-3.11-.944l-.858-4.275-4.52-4.52-2.31-.463-1.964-.394A1.847 1.847 0 0 1 .98 10.693a1.843 1.843 0 0 1 .46-1.838Zm5.379 2.017-3.873-.776L6.32 6.733h4.638l-4.14 4.14Zm8.403-5.655c2.459-2.46 4.856-2.463 5.89-2.33.134 1.035.13 3.432-2.329 5.891l-6.71 6.71-3.561-3.56 6.71-6.711Zm-1.318 15.837-.776-3.873 4.14-4.14v4.639l-3.364 3.374Z" clip-rule="evenodd"/><path d="M9.318 18.345a.972.972 0 0 0-1.86-.561c-.482 1.435-1.687 2.204-2.934 2.619a8.22 8.22 0 0 1-1.23.302c.062-.365.157-.79.303-1.229.415-1.247 1.184-2.452 2.62-2.935a.971.971 0 1 0-.62-1.842c-.12.04-.236.084-.35.13-2.02.828-3.012 2.588-3.493 4.033a10.383 10.383 0 0 0-.51 2.845l-.001.016v.063c0 .536.434.972.97.972H2.24a7.21 7.21 0 0 0 .878-.065c.527-.063 1.248-.19 2.02-.447 1.445-.48 3.205-1.472 4.033-3.494a5.828 5.828 0 0 0 .147-.407Z"/>',
	caution: '<path d="M12 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm10.67 1.47-8.05-14a3 3 0 0 0-5.24 0l-8 14A3 3 0 0 0 3.94 22h16.12a3 3 0 0 0 2.61-4.53Zm-1.73 2a1 1 0 0 1-.88.51H3.94a1 1 0 0 1-.88-.51 1 1 0 0 1 0-1l8-14a1 1 0 0 1 1.78 0l8.05 14a1 1 0 0 1 .05 1.02v-.02ZM12 8a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1Z"/>',
	danger: '<path d="M12 7a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm9.71-7.44-5.27-5.27a1.05 1.05 0 0 0-.71-.29H8.27a1.05 1.05 0 0 0-.71.29L2.29 7.56a1.05 1.05 0 0 0-.29.71v7.46c.004.265.107.518.29.71l5.27 5.27c.192.183.445.286.71.29h7.46a1.05 1.05 0 0 0 .71-.29l5.27-5.27a1.05 1.05 0 0 0 .29-.71V8.27a1.05 1.05 0 0 0-.29-.71ZM20 15.31 15.31 20H8.69L4 15.31V8.69L8.69 4h6.62L20 8.69v6.62Z"/>',
};

const MARKER = /^\[!([A-Za-z][A-Za-z0-9-]*)\]([+-]?)/;

export const CALL_OUT_VARIANTS = CALLOUT_VARIANTS;
export const DEFAULT_CALLOUT_TITLES = DEFAULT_TITLES;
export const CALL_OUT_ICONS = ICONS;
export const CALL_OUT_MARKER = MARKER;

function element(tagName, properties, children) {
	return {
		type: 'paragraph',
		data: { hName: tagName, hProperties: properties },
		children,
	};
}

function textContent(nodes) {
	let out = '';
	for (const node of nodes) {
		if (typeof node.value === 'string') out += node.value;
		else if (Array.isArray(node.children)) out += textContent(node.children);
	}
	return out;
}

function trimTextEdges(nodes) {
	let start = 0;
	let end = nodes.length;

	while (start < end && nodes[start].type === 'text' && /^\s*$/.test(nodes[start].value)) start++;
	while (end > start && nodes[end - 1].type === 'text' && /^\s*$/.test(nodes[end - 1].value)) end--;

	const trimmed = nodes.slice(start, end);
	if (trimmed.length > 0 && trimmed[0].type === 'text') {
		trimmed[0] = { type: 'text', value: trimmed[0].value.replace(/^\s+/, '') };
	}
	if (trimmed.length > 0 && trimmed[trimmed.length - 1].type === 'text') {
		const last = trimmed[trimmed.length - 1];
		trimmed[trimmed.length - 1] = { type: 'text', value: last.value.replace(/\s+$/, '') };
	}
	return trimmed;
}

function parseCallout(paragraph) {
	const [first, ...rest] = paragraph.children;
	if (!first || first.type !== 'text') return null;

	const match = MARKER.exec(first.value);
	if (!match) return null;

	const variant = CALLOUT_VARIANTS[match[1].toLowerCase()] ?? 'note';

	const inline = [];
	const afterMarker = first.value.slice(match[0].length);
	if (afterMarker !== '') inline.push({ type: 'text', value: afterMarker });
	inline.push(...rest);

  const title = [];
	const content = [];
	let inContent = false;
	for (const node of inline) {
		if (inContent) {
			content.push(node);
			continue;
		}
		if (node.type === 'break') {
			inContent = true;
			continue;
		}
		if (node.type === 'text' && node.value.includes('\n')) {
			const index = node.value.indexOf('\n');
			const before = node.value.slice(0, index);
			const after = node.value.slice(index + 1);
			if (before !== '') title.push({ type: 'text', value: before });
			inContent = true;
			if (after !== '') content.push({ type: 'text', value: after });
			continue;
		}
		title.push(node);
	}

	return { variant, title: trimTextEdges(title), content: trimTextEdges(content) };
}

export const obsidianCallouts = {
	name: 'obsidian-callouts',
	blockquote(node, ctx) {
		const first = node.children[0];
		if (!first || first.type !== 'paragraph') return undefined;

		const callout = parseCallout(first);
		if (!callout) return undefined;

		const { variant, title, content } = callout;
		const titleNodes = title.length > 0 ? title : [{ type: 'text', value: DEFAULT_TITLES[variant] }];
		const label = title.length > 0 ? textContent(titleNodes) : DEFAULT_TITLES[variant];

		const contentChildren = [];
		if (content.length > 0) contentChildren.push({ type: 'paragraph', children: content });
		contentChildren.push(...node.children.slice(1));

		const iconSvg = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="starlight-aside__icon">${ICONS[variant]}</svg>`;
		const icon =
			ctx.sourceFormat === 'mdx'
				? {
						type: 'mdxJsxTextElement',
						name: 'Fragment',
						attributes: [{ type: 'mdxJsxAttribute', name: 'set:html', value: iconSvg }],
					}
				: { type: 'html', value: iconSvg };

		return element(
			'aside',
			{ 'aria-label': label, class: `starlight-aside starlight-aside--${variant}` },
			[
				element('p', { class: 'starlight-aside__title', 'aria-hidden': 'true' }, [icon, ...titleNodes]),
				element('div', { class: 'starlight-aside__content' }, contentChildren),
			],
		);
	},
};
