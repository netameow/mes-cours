import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { VAULT_ROOT, idForFile, titleForFile, vaultSignature, writeSidebarSignature } from './lib/vault.mjs';

const watchedWatchers = new WeakSet();

const vaultDocsLoader = {
	name: 'mes-cours-vault-loader',
	load: async (context) => {
		const { watcher } = context;
		if (watcher && !watchedWatchers.has(watcher)) {
			watchedWatchers.add(watcher);
			const onStructureChange = () => writeSidebarSignature(vaultSignature());
			watcher.on('add', onStructureChange);
			watcher.on('unlink', onStructureChange);
			watcher.on('addDir', onStructureChange);
			watcher.on('unlinkDir', onStructureChange);
		}

		const globLoader = glob({
			base: VAULT_ROOT,
			pattern: 'R1.*/**/[^_]*.{md,mdx,markdown,mdown,mkdn,mkd,mdwn}',
			generateId: ({ entry }) => idForFile(entry),
		});

		await globLoader.load({
			...context,
			parseData: ({ id, data, filePath }) => {
				const next = { ...data };
				if (typeof next.title !== 'string' || next.title.trim() === '') {
					next.title = filePath ? titleForFile(filePath) : id;
				}
				return context.parseData({ id, data: next, filePath });
			},
		});
	},
};

export const collections = {
	docs: defineCollection({ loader: vaultDocsLoader, schema: docsSchema() }),
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
