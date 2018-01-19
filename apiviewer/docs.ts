import { parseHash } from './hash';

export enum DocType {
	api = 'api',
	docs = 'docs'
}

export interface ProjectDocs {
	url: string;
	logo?: string;
	latest: string;
	next: string;
	versions: { [version: string]: DocSet };
}

/**
 * A specific doc set. If a branch is specified but url or docBase are not,
 * they will be constructed using the standard GitHub URL format.
 */
export interface DocSet {
	// The base URL for the doc set
	url?: string;
	// The base URL from which the pages should be loaded
	docBase?: string;
	// The branch or tag in the repo where docs will be loaded from.
	branch?: string;
	// The path to an API data file
	api?: string;

	// The paths to  markdown pages that make up the doc set, relative to
	// docBase
	pages: string[];
	// A cache of rendered documents
	pageCache?: { [name: string]: DocPage };
	// The rendered menu element
	menu?: Element;
	// A promise that resolves when the pages and menu have been rendered
	ready?: Promise<void>;

	// The IDs of generated API pages
	apiPages?: string[];
	// A cache of rendered api doc pages
	apiCache?: { [name: string]: DocPage };
	// The rendered api menu element
	apiMenu?: Element;
	// A promise that resolves when the API pages and menu have been rendered
	apiReady?: Promise<void>;
}

/**
 * A single doc page
 */
export interface DocPage {
	name: string;
	element: Element;
	title: string;
}

/**
 * An ID for a particular doc set
 */
export interface DocSetId {
	project: string;
	version: string;
}

/**
 * An ID for a specific page in a doc set
 */
export interface PageId extends DocSetId {
	type: DocType;
	page: string;
	section?: string;
}

/**
 * Get information about the currently displayed page.
 *
 * Returns a page ID if the current hash is valid, or throws.
 */
export function getCurrentPageId(includeSection = true) {
	const docSetId = getCurrentDocSetId();
	const { type, page, section } = parseHash();

	if (!type || !(type in DocType)) {
		throw new Error(`Missing or invalid doc type: ${type}`);
	}

	if (!page) {
		throw new Error('Missing page name');
	}

	const docSet = getDocSet(docSetId);
	const pageNames = type === DocType.api ? docSet.apiPages : docSet.pages;
	if (!pageNames) {
		throw new Error(`No pages of type "${type}"`);
	}

	if (pageNames.indexOf(page) === -1) {
		throw new Error(`Invalid page: ${page}`);
	}

	const { project, version } = docSetId;
	const id: PageId = { project, version, type, page };
	if (includeSection) {
		id.section = section;
	}

	return id;
}

/**
 * Get the current doc set ID
 */
export function getCurrentDocSetId() {
	const { project, version } = parseHash();

	if (!project || !docSets[project]) {
		throw new Error(`Missing or invalid project: ${project}`);
	}

	if (!version) {
		throw new Error(`Missing version`);
	}

	const projectDocs = docSets[project];

	let realVersion = resolveVersion({ project, version });
	if (!projectDocs.versions[realVersion]) {
		throw new Error(`Invalid version: ${version}`);
	}

	return { project, version: realVersion };
}

/**
 * Get a doc set by id
 */
export function getDocSet(id: DocSetId) {
	if (!isValidDocSetId(id)) {
		throw new Error('getDocSet called with invalid ID');
	}
	const project = docSets[id.project];
	let version = resolveVersion(id);
	return project.versions[version];
}

/**
 * Return the ID of the default doc set
 */
export function getDefaultDocSetId() {
	return {
		project: 'Intern',
		version: docSets['Intern'].latest
	};
}

/**
 * Return the ID of the default page for a given doc set
 */
export function getDefaultPageId(docSetId: DocSetId, type = DocType.docs) {
	const docSet = getDocSet(docSetId);
	const { project, version } = docSetId;
	if (!type || !(type in DocType)) {
		throw new Error(`Invalid doc type: ${type}`);
	}
	const page = type === DocType.api ? docSet.apiPages![0] : docSet.pages[0];
	return { project, version, page, type };
}

/**
 * Get the project base URL for a given project version. If the doc set
 * version structure contains a `url` field, it will be used. Otherwise, a
 * URL will be constructed using the doc set version branch and standard
 * GitHub URL formats.
 */
export function getDocVersionUrl(id: DocSetId) {
	if (!isValidDocSetId(id)) {
		throw new Error('Invalid docSet');
	}

	const projectDocs = docSets[id.project];
	const version = resolveVersion(id);
	const dv = projectDocs.versions[version];
	if (dv.url) {
		return dv.url;
	}
	return `${projectDocs.url}/tree/${dv.branch}`;
}

/**
 * Get the doc base URL for a given project version. If the doc set version
 * structure contains a `docBase` field, it will be used. Otherwise, a URL
 * will be constructed using the doc set version branch and standard GitHub
 * URL formats.
 */
export function getDocBaseUrl(id: DocSetId) {
	if (!isValidDocSetId(id)) {
		throw new Error('Invalid docSet');
	}

	const projectDocs = docSets[id.project];
	const version = resolveVersion(id);
	const dv = projectDocs.versions[version];
	if (dv.docBase) {
		return dv.docBase;
	}

	const url = projectDocs.url.replace(
		/\/\/github\./,
		'//raw.githubusercontent.'
	);
	return `${url}/${dv.branch}/`;
}

/**
 * Return true if a given doc set ID is valid. To be valid, it must
 * specify a valid project and version
 */
export function isValidDocSetId(id: Partial<DocSetId>): id is DocSetId {
	const { project, version } = id;

	if (!project || !docSets[project]) {
		return false;
	}

	if (!version) {
		return false;
	}

	const realVersion = resolveVersion({ project, version });
	if (!docSets[project].versions[realVersion]) {
		return false;
	}

	return true;
}

/**
 * Return true if a given page ID is valid. To be valid it must
 * specify a valid project, version, and type
 */
export function isValidPageId(id: Partial<PageId>): id is PageId {
	if (!isValidDocSetId(id)) {
		return false;
	}

	const { type, page } = <Partial<PageId>>id;

	if (!type || !(type in DocType)) {
		return false;
	}

	if (!page) {
		return false;
	}

	return true;
}

/**
 * Return the 'latest' version of a given project. This may be the highest
 * version number, or the version tagged as the 'latest' in the doc set data.
 */
export function getLatestVersion(project: string) {
	const docSet = docSets[project];
	let version = docSet.latest;
	if (!version) {
		const versions = Object.keys(docSet.versions).sort(compareVersions);
		version = versions[versions.length - 1];
	}
	return version;
}

/**
 * Return the 'next' version of a given project. This may be the version
 * directly after the 'latest' version, or the version tagged as 'next' in the
 * docSet data.
 */
export function getNextVersion(project: string) {
	const docSet = docSets[project];
	let version = docSet.next;
	if (!version) {
		const versions = Object.keys(docSet.versions).sort(compareVersions);
		const latest = getLatestVersion(project);
		const idx = versions.indexOf(latest);
		if (idx !== -1 && versions[idx + 1]) {
			version = versions[idx + 1];
		}
	}
	return version;
}

/**
 * Return a list of available project names
 */
export function getProjects() {
	return Object.keys(docSets);
}

/**
 * Return a list of available versions for a given project
 */
export function getVersions(project: string) {
	if (!docSets[project]) {
		throw new Error(`Invalid project: ${project}`);
	}
	return Object.keys(docSets[project].versions).sort(compareVersions);
}

/**
 * Return a logo image URL for a project
 */
export function getProjectLogo(project: string) {
	if (!docSets[project]) {
		throw new Error(`Invalid project: ${project}`);
	}
	return docSets[project].logo;
}

/**
 * Return the base URL for a project
 */
export function getProjectUrl(project: string) {
	if (!docSets[project]) {
		throw new Error(`Invalid project: ${project}`);
	}
	return docSets[project].url;
}

/**
 * Resolve a version for a project
 */
function resolveVersion(id: DocSetId) {
	if (id.version === 'latest') {
		return getLatestVersion(id.project);
	}
	if (id.version === 'next') {
		return getNextVersion(id.project);
	}
	return id.version;
}

/**
 * Loosely compare two version strings
 */
function compareVersions(a: string, b: string) {
	const aParts = a.split('.').map(part => Number(part) || 0);
	const bParts = b.split('.').map(part => Number(part) || 0);
	const length = Math.max(aParts.length, bParts.length);
	for (let i = 0; i < length; i++) {
		const diff = aParts[i] - bParts[i];
		if (diff !== 0) {
			return diff;
		}
	}
	return aParts.length - bParts.length;
}

declare const docSets: { [name: string]: ProjectDocs };
