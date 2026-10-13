// @ts-check
import { writeFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import { SIDEBAR_SYNC_FILE, buildSidebar, vaultSignature } from './src/lib/vault.mjs';
import { obsidianCallouts } from './src/lib/obsidian-callouts.mjs';

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
		processor: satteri({ mdastPlugins: [obsidianCallouts] }),
	},
	site: 'https://netameow.github.io',
	base: '/mes-cours',
	integrations: [
		vaultSidebarWatch(),
		starlight({
			title: 'Mes cours',
			description: 'Notes de cours en informatique',
			defaultLocale: 'fr',
			components: {
				Head: './src/components/Head.astro',
			},
			favicon: '/favicon.svg',
			disable404Route: true,
			sidebar: buildSidebar(),
		}),
	],
});
