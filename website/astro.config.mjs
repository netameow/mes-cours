// @ts-check
import { writeFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import { SIDEBAR_SYNC_FILE, buildSidebar, vaultSignature } from './src/lib/vault.mjs';
import { obsidianCallouts } from './src/lib/obsidian-callouts.mjs';
import { mathKatex } from './src/lib/math-katex.mjs';
import { mermaidDiagrams } from './src/lib/mermaid.mjs';
import { plantumlBlocks } from './src/lib/plantuml.mjs';
import { wikiLinks } from './src/lib/wiki-links.mjs';

const SITE = 'https://netameow.github.io';
const BASE = '/mes-cours';

function vaultSidebarWatch() {
	return {
		name: 'mes-cours-vault-sidebar-watch',
		hooks: {
			'astro:config:setup': ({ addWatchFile, command }) => {
				if (command !== 'dev') return;
				try {
					writeFileSync(SIDEBAR_SYNC_FILE, vaultSignature());
				} catch {
					// nuh uh
				}
				addWatchFile(SIDEBAR_SYNC_FILE);
			},
		},
	};
}

export default defineConfig({
	markdown: {
		processor: satteri({
			features: { math: true },
			mdastPlugins: [obsidianCallouts, mathKatex, mermaidDiagrams, plantumlBlocks, wikiLinks({ base: BASE })],
		}),
	},
	site: SITE,
	base: BASE,
	integrations: [
		vaultSidebarWatch(),
		starlight({
			title: 'Mes cours',
			description: 'Notes de cours en informatique',
			defaultLocale: 'fr',
			customCss: [
				'katex/dist/katex.min.css',
				'./src/styles/mermaid.css',
				'./src/styles/plantuml.css',
			],
			components: {
				Head: './src/components/Head.astro',
				Sidebar: './src/components/Sidebar.astro',
				Footer: './src/components/Footer.astro',
			},
			favicon: '/favicon.svg',
			disable404Route: true,
			sidebar: buildSidebar(),
		}),
	],
});
