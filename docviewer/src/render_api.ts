import { ProjectReflection } from 'typedoc';
import { Comment } from 'typedoc/dist/lib/models/comments/comment';
import { SourceReference } from 'typedoc/dist/lib/models/sources/file';
import { DeclarationReflection } from 'typedoc/dist/lib/models/reflections/declaration';
import { SignatureReflection } from 'typedoc/dist/lib/models/reflections/signature';
import { ParameterReflection } from 'typedoc/dist/lib/models/reflections/parameter';
import { ContainerReflection } from 'typedoc/dist/lib/models/reflections/container';
import { TypeParameterReflection } from 'typedoc/dist/lib/models/reflections/type-parameter';
import { Reflection } from 'typedoc/dist/lib/models/reflections/abstract';
import { Type } from 'typedoc/dist/lib/models/types/abstract';
import { StringLiteralType } from 'typedoc/dist/lib/models/types/string-literal';
import { UnionType } from 'typedoc/dist/lib/models/types/union';
import { ArrayType } from 'typedoc/dist/lib/models/types/array';
import { ReflectionType } from 'typedoc/dist/lib/models/types/reflection';
import { ReferenceType } from 'typedoc/dist/lib/models/types/reference';
import { IntrinsicType } from 'typedoc/dist/lib/models/types/intrinsic';
import { TypeParameterType } from 'typedoc/dist/lib/models/types/type-parameter';
import { UnknownType } from 'typedoc/dist/lib/models/types/unknown';
import * as h from 'hyperscript';

import {
	clearNode,
	createSlugifier,
	docFetch,
	docIdToDomId,
	highlight,
	makeToc,
	renderMarkdown,
	resetScroll,
	sep,
	toHash,
	LocationRef,
	RenderContext
} from './common';

const apiCache: {
	[hash: string]: {
		pages: { [name: string]: DocPage };
		tocs: { [name: string]: Element };
		menu: Element;
		docLink: Element;
	};
} = Object.create(null);

/**
 * Render a Markdown document for a particular repo and version.
 *
 * A doc ID has the format '<org>/<repo>/<version>[/<path>]'. It looks like
 * 'dojo/cli/master' or 'dojo/core/master/docs/math.md'.
 */
export default async function renderApi(
	ref: LocationRef,
	context: RenderContext
) {
	const { docContainer, docSelector, tocContainer } = context;
	const docHash = toHash({
		type: 'api',
		repo: ref.repo,
		version: ref.version
	});

	let pages: { [name: string]: DocPage };
	let tocs: { [name: string]: Element };
	let menu: Element;
	let docLink: Element;

	if (apiCache[docHash]) {
		pages = apiCache[docHash].pages;
		tocs = apiCache[docHash].tocs;
		menu = apiCache[docHash].menu;
		docLink = apiCache[docHash].docLink;
	} else {
		const file = 'docs/api.json';
		const { repo, version } = ref;
		const json = await docFetch(repo + '/' + version + '/' + file);
		const data: ProjectReflection = JSON.parse(json);
		const repoRef = { type: ref.type, repo: ref.repo, version: ref.version };

		pages = renderApiPages(repoRef, data);
		tocs = Object.keys(pages).reduce(
			(allTocs, name) => ({ ...allTocs, [name]: makeToc(pages[name].element) }),
			{}
		);
		docLink = docSelector.querySelector(`a[href="${docHash}"]`);
		menu = h(
			'ul',
			{ className: 'uk-nav-sub uk-nav-default' },
			Object.keys(pages).map(name => {
				const label = pages[name].title;
				const href = toHash(pages[name].ref);
				return h('li', {}, h('a', { href }, label));
			})
		);

		apiCache[docHash] = {
			pages,
			tocs,
			menu,
			docLink
		};
	}

	const path = ref.path || Object.keys(pages)[0];
	const page = pages[path].element;
	clearNode(docContainer);
	docContainer.appendChild(page);
	resetScroll(docContainer);

	const toc = tocs[path];
	clearNode(tocContainer);
	tocContainer.scrollTop = 0;
	tocContainer.appendChild(toc);

	// Clear out any nav submenu that may have been added by the API
	// renderer
	const existingMenu = context.docSelector.querySelector('ul');
	if (existingMenu) {
		existingMenu.parentElement.removeChild(existingMenu);
	}

	if (docLink) {
		docLink.parentElement.appendChild(menu);
	}
}

const preferredSignatureWidth = 60;

interface GenericReflection extends Reflection {
	typeParameter: TypeParameterReflection[];
}

/**
 * Render the API pages for a docset
 */
export function renderApiPages(ref: LocationRef, data: ProjectReflection) {
	const modules = getExports(data)!;
	const apiIndex = createApiIndex(data);
	const slugIndex: SlugIndex = {};
	const pageIndex: { [id: number]: string } = {};
	const linksToResolve: { link: HTMLAnchorElement; id: number }[] = [];
	const nameRefs: NameRefs = Object.create(null);
	const cache: { [key: string]: DocPage } = Object.create(null);

	modules
		.filter(module => {
			if (getExports(module).length === 0 && !hasComment(module)) {
				// Only show modules that have exports
				return false;
			}
			const name = module.name.replace(/^"/, '').replace(/"$/, '');
			return name.indexOf('tests/') === -1;
		})
		.forEach(module => {
			const name = module.name.replace(/^"/, '').replace(/"$/, '');
			pageIndex[module.id] = name;
			const renderHeading = getHeadingRenderer(ref, name, createSlugifier());

			const element = h('div');
			const page = (cache[name] = {
				name,
				title: name.replace(/^src\//, ''),
				element,
				ref: {
					...ref,
					path: name
				}
			});
			const context: ApiRenderContext = {
				page,
				renderHeading,
				api: data,
				apiIndex,
				slugIndex,
				ref,
				linksToResolve,
				nameRefs
			};

			renderModule(module, 1, context);
		});

	// Fixup other links
	for (const { link, id } of linksToResolve) {
		const type = apiIndex[id];
		if (id === -1) {
			continue;
		}
		const module = findModule(id, apiIndex);

		if (module === type) {
			link.href = toHash({
				...ref,
				path: name
			});
		} else {
			link.href = toHash({
				...ref,
				path: pageIndex[module.id],
				anchor: slugIndex[type.id]
			});
		}
	}

	return cache;
}

/**
 * Get the module containing a given reflection
 */
function getContainingModule(reflection: Reflection) {
	while (reflection && reflection.kindString !== 'External module') {
		reflection = reflection.parent;
	}
	return <ContainerReflection>reflection;
}

/**
 * Return the reflection ID corresponding to a given name.
 */
function getReflectionIdForName(
	name: string,
	context: ApiRenderContext,
	_module: ContainerReflection
) {
	const { nameRefs } = context;
	if (!(name in nameRefs)) {
		const reflection = findReflectionByName(name, context.api);
		nameRefs[name] = reflection ? reflection.id : -1;
	}
	return nameRefs[name];
}

/**
 * Recursively find a reflection in the API by dot-separated name
 */
function findReflectionByName(
	name: string,
	reflection: Reflection
): Reflection | undefined {
	let head = name;
	let dot = head.indexOf('.');
	if (dot !== -1) {
		head = head.slice(0, dot);
	}

	if (isContainerReflection(reflection)) {
		for (const child of reflection.children) {
			const childName = child.name.replace(/^"|"$/g, '');
			if (childName === head) {
				if (head !== name) {
					const tail = name.slice(dot + 1);
					return findReflectionByName(tail, child);
				} else {
					return child;
				}
			}
		}
	}

	return;
}

/**
 * Render a module page
 */
function renderModule(
	module: ContainerReflection,
	level: number,
	context: ApiRenderContext
) {
	const { renderHeading, slugIndex, page } = context;
	const heading = renderHeading(level, module, context);
	slugIndex[module.id] = heading.id;

	if (hasComment(module)) {
		page.element.appendChild(renderComment(module.comment, module, context));
	}

	const exports = getExports(module);

	const global = exports.filter(ex => ex.name === '__global')[0];
	if (global) {
		renderHeading(level, 'Globals', context);
		for (const child of global.children.slice().sort(nameSorter)) {
			renderProperty(child, level + 1, context);
		}
	}

	const classes = exports
		.filter(ex => ex.kindString === 'Class')
		.sort(nameSorter);
	for (const cls of classes) {
		renderClass(cls, level + 1, context);
	}

	const interfaces = exports
		.filter(ex => ex.kindString === 'Interface')
		.sort(nameSorter);
	for (const iface of interfaces) {
		renderInterface(iface, level + 1, context);
	}

	const functions = exports
		.filter(ex => ex.kindString === 'Function')
		.sort(nameSorter);
	for (const func of functions) {
		renderFunction(func, level + 1, context);
	}

	const constants = exports
		.filter(ex => ex.kindString === 'Object literal')
		.sort(nameSorter);
	for (const constant of constants) {
		renderValue(constant, level + 1, context);
	}
}

/**
 * Render a class
 */
function renderClass(
	cls: DeclarationReflection,
	level: number,
	context: ApiRenderContext
) {
	const { renderHeading, slugIndex, page } = context;
	const heading = renderHeading(level, cls, context);
	slugIndex[cls.id] = heading.id;

	let declaration = `class ${cls.name}`;

	if (isGenericReflection(cls)) {
		const typeParams = cls.typeParameter
			.map(param => typeParameterToString(param))
			.join(', ');
		declaration += `<${typeParams}>`;
	}

	if (cls.extendedTypes) {
		const types = cls.extendedTypes.map(type => typeToString(type)).join(', ');
		declaration += ` extends ${types}`;
	}

	if (cls.implementedTypes) {
		const types = cls.implementedTypes
			.map(type => typeToString(type))
			.join(', ');
		declaration += ` implements ${types}`;
	}

	const formatted = formatDeclaration(declaration);
	const html = highlight('typescript', formatted);
	context.page.element.appendChild(
		h('pre', {}, h('code.hljs.lang-typescript', { innerHTML: html }))
	);

	if (hasComment(cls)) {
		page.element.appendChild(
			renderComment(cls.comment, getContainingModule(cls), context)
		);
	}

	const exports = getExports(cls);

	const properties = exports
		.filter(ex => ex.kindString === 'Property' || ex.kindString === 'Accessor')
		.sort(nameSorter);
	for (const property of properties) {
		renderProperty(property, level + 1, context);
	}

	const constructors = exports.filter(ex => ex.kindString === 'Constructor');
	for (const ctor of constructors) {
		renderMethod(ctor, level + 1, context);
	}

	const methods = exports
		.filter(ex => ex.kindString === 'Method')
		.sort(nameSorter);
	for (const method of methods) {
		renderMethod(method, level + 1, context);
	}
}

/**
 * Indicate whetehr a reflection is a GenericReflection
 */
function isGenericReflection(type: Reflection): type is GenericReflection {
	return (<any>type).typeParameter != null;
}

/**
 * Indicate whetehr a reflection is a ContainerReflection
 */
function isContainerReflection(type: Reflection): type is ContainerReflection {
	return (<any>type).children != null;
}

/**
 * Render a type parameter
 */
function typeParameterToString(param: TypeParameterReflection) {
	if (param.type) {
		return `${param.name} extends ${typeToString(param.type)}`;
	} else {
		return param.name;
	}
}

/**
 * Render a class method
 */
function renderMethod(
	method: DeclarationReflection,
	level: number,
	context: ApiRenderContext
) {
	renderFunction(method, level, context);
}

/**
 * Render a class or interface inheritance chain
 */
function renderParent(
	types: Type[],
	relationship: Relationship,
	context: ApiRenderContext
) {
	for (const type of types) {
		const p = h('p.api-metadata', {}, [
			h('span.api-label', {}, `${relationship}: `)
		]);
		p.appendChild(renderType(type, context));
		context.page.element.appendChild(p);
	}
}

/**
 * Render a TypeScript interface
 */
function renderInterface(
	iface: DeclarationReflection,
	level: number,
	context: ApiRenderContext
) {
	const { renderHeading, slugIndex, page } = context;
	const heading = renderHeading(level, iface, context);
	slugIndex[iface.id] = heading.id;

	let declaration = `interface ${iface.name}`;

	if (isGenericReflection(iface)) {
		const typeParams = iface.typeParameter
			.map(param => typeParameterToString(param))
			.join(', ');
		declaration += `<${typeParams}>`;
	}

	if (iface.extendedTypes) {
		const types = iface.extendedTypes
			.map(type => typeToString(type))
			.join(', ');
		declaration += ` extends ${types}`;
	}

	if (iface.implementedTypes) {
		const types = iface.implementedTypes
			.map(type => typeToString(type))
			.join(', ');
		declaration += ` implements ${types}`;
	}

	const formatted = formatDeclaration(declaration);
	const html = highlight('typescript', formatted);
	context.page.element.appendChild(
		h('pre', {}, h('code.hljs.lang-typescript', { innerHTML: html }))
	);

	if (hasComment(iface)) {
		page.element.appendChild(
			renderComment(iface.comment, getContainingModule(iface), context)
		);
	}

	if (iface.indexSignature) {
		renderHeading(level + 1, 'Index signature', context);
		// TypeDoc's typing is wrong -- this is always an array
		const sig: SignatureReflection[] = <any>iface.indexSignature;
		renderSignatures(sig, iface, context);
	}

	if (iface.signatures) {
		renderHeading(level + 1, 'Call signatures', context);
		renderSignatures(iface.signatures, iface, context);
	}

	const exports = getExports(iface);

	const properties = exports
		.filter(ex => ex.kindString === 'Property')
		.sort(nameSorter);
	for (const property of properties) {
		renderProperty(property, level + 1, context);
	}

	const constructors = exports.filter(ex => ex.kindString === 'Constructor');
	for (const ctor of constructors) {
		renderMethod(ctor, level + 1, context);
	}

	const methods = exports
		.filter(ex => ex.kindString === 'Method')
		.sort(nameSorter);
	for (const method of methods) {
		renderMethod(method, level + 1, context);
	}
}

/**
 * Render a class or interface property
 */
function renderProperty(
	property: DeclarationReflection,
	level: number,
	context: ApiRenderContext
) {
	const { page, renderHeading, slugIndex } = context;
	const heading = renderHeading(level, property, context);
	slugIndex[property.id] = heading.id;

	if (property.inheritedFrom) {
		renderParent([property.inheritedFrom], Relationship.Inherited, context);
	}

	let typeString: string | undefined;
	let access = { canRead: false, canWrite: false };
	let comment: Comment | undefined;

	if (property.kindString === 'Accessor') {
		if (property.getSignature) {
			access.canRead = true;
			const sig = (<any>property.getSignature)[0];
			typeString = typeToString(sig.type);
			if (hasComment(sig)) {
				comment = sig.comment;
			}
		}
		if (property.setSignature) {
			access.canWrite = true;
			const sig = (<any>property.setSignature)[0];
			if (!typeString) {
				typeString = typeToString(sig.parameters[0].type);
			}
			if (!comment && hasComment(sig)) {
				comment = sig.comment;
			}
		}
	} else {
		access.canRead = true;
		access.canWrite = true;
		comment = property.comment;
		typeString = typeToString(property.type);
	}

	const text = `${property.name}: ${formatSignature(typeString!)}`;
	const codeP = renderCode(text);
	if (!access.canRead) {
		const code = codeP.childNodes[0];
		const tag = h('span.tag.is-primary', {}, 'write only');
		code.insertBefore(tag, code.firstChild);
	} else if (!access.canWrite) {
		const code = codeP.childNodes[0];
		const tag = h('span.tag.is-primary', {}, 'read only');
		code.insertBefore(tag, code.firstChild);
	}

	page.element.appendChild(codeP);

	if (comment) {
		page.element.appendChild(
			renderComment(comment, getContainingModule(property), context)
		);
	}
}

/**
 * Render an exported function
 */
function renderFunction(
	func: DeclarationReflection,
	level: number,
	context: ApiRenderContext
) {
	const { renderHeading, slugIndex, page } = context;
	const heading = renderHeading(level, func, context);
	slugIndex[func.id] = heading.id;

	renderSignatures(func.signatures!, func, context);

	for (const signature of func.signatures!) {
		if (hasComment(signature)) {
			page.element.appendChild(
				renderComment(signature.comment, getContainingModule(func), context)
			);
			break;
		}
	}
}

/**
 * Render an array of function/method signatures
 */
function renderSignatures(
	signatures: SignatureReflection[],
	parent: ContainerReflection,
	context: ApiRenderContext
) {
	const { page } = context;
	for (const sig of signatures) {
		const text = signatureToString(sig);
		const formatted = formatSignature(text);
		const html = highlight('typescript', formatted);
		page.element.appendChild(
			h('pre', {}, [h('code.hljs.lang-typescript', { innerHTML: html })])
		);
	}

	const parameters = signatures.reduce(
		(params, sig) => {
			return params.concat(sig.parameters || []);
		},
		<ParameterReflection[]>[]
	);
	if (parameters.length > 0) {
		renderParameterTable(parameters, parent, context);
	}
}

/**
 * Render a table of signature parameters
 */
function renderParameterTable(
	parameters: ParameterReflection[],
	parent: ContainerReflection,
	context: ApiRenderContext
) {
	const { page } = context;
	const params = parameters.filter(param => {
		return hasComment(param) || param.defaultValue;
	});

	if (params.length > 0) {
		const rows = params.map(param => {
			let comment: Element | undefined;
			if (hasComment(param)) {
				comment = renderComment(
					param.comment,
					getContainingModule(parent),
					context
				);
			}
			return [param.name, comment || '', param.defaultValue || ''];
		});

		const header = ['Parameter', 'Description', 'Default'];
		if (!rows.some(row => Boolean(row[2]))) {
			header.pop();
			rows.forEach(row => row.pop());
		}

		page.element.appendChild(h('p', {}, [createTable(header, rows)]));
	}
}

/**
 * Render a literal value
 */
function renderValue(
	value: DeclarationReflection,
	level: number,
	context: ApiRenderContext
) {
	const { page, renderHeading, slugIndex } = context;
	const heading = renderHeading(level, value, context);
	slugIndex[value.id] = heading.id;

	if (hasComment(value)) {
		page.element.appendChild(renderComment(value.comment, value, context));
	}

	if (value.kindString === 'Object literal') {
		const parts = value.children.map(child => {
			if (child.name) {
				return `${child.name}: ${child.defaultValue}`;
			}
			return child.defaultValue;
		});
		let type = typeToString(value.type!);
		const text = `${value.name}: ${type} = {\n\t${parts.join(',\n\t')}\n}`;
		page.element.appendChild(renderCode(text));
	}
}

/**
 * Render a declaration comment
 */
function renderComment(
	comment: Comment,
	module: ContainerReflection,
	context: ApiRenderContext
) {
	const { page, linksToResolve } = context;
	const element = h('p', { innerHTML: commentToHtml(comment, page.name) });

	const links = <NodeListOf<HTMLAnchorElement>>element.querySelectorAll('a');
	for (let i = 0; i < links.length; i++) {
		if (links[i].href.indexOf('api:') === 0) {
			const link = links[i];
			const name = link.href.slice('api:'.length);
			const id = getReflectionIdForName(name, context, module);
			linksToResolve.push({ link, id });
		}
	}

	return element;
}

/**
 * Generate HTML for an API comment
 */
function commentToHtml(comment: Comment, pageName: string) {
	let parts: string[] = [];

	if (comment.shortText) {
		parts.push(renderText(comment.shortText, pageName));
	}

	if (comment.text) {
		parts.push(renderText(comment.text, pageName));
	}

	if (comment.returns) {
		const returns = comment.returns[0].toLowerCase() + comment.returns.slice(1);
		parts.push(renderText(`Returns ${returns}`, pageName));
	}

	return parts.join('');
}

/**
 * Render comment text
 */
function renderText(text: string, _pageName: string) {
	// Fix jsdoc-style links
	text = text.replace(/\[\[(.*?)(?:\|(.*?))?]]/g, (_match, p1, p2) => {
		let name = p2 || p1;
		// If the target name is dotted or slashed (e.g., Executor.Config) and
		// the user didn't provide a name, use the last element in the list as
		// the link text
		if (!p2 && (p1.indexOf('.') !== -1 || p1.indexOf('/') !== -1)) {
			const lastDot = p1.lastIndexOf('.');
			const lastSlash = p1.lastIndexOf('/');
			name = p1.slice(Math.max(lastDot, lastSlash) + 1);
		}
		if (/^https?:\/\//.test(p1)) {
			// p1 is an absolute address
			return `[${name}](${p1})`;
		} else {
			return `[${name}](api:${p1})`;
		}
	});
	return renderMarkdown(text, {
		ref: <LocationRef>{},
		docs: <{ [pkg: string]: string }>{}
	});
}

/**
 * Render a syntax-highlighted block of code
 */
function renderCode(text: string, language = 'typescript') {
	const html = highlight(language, text)
		.replace(/\n/g, '<br>')
		.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
	return h('pre', {}, [h(`code.hljs.lang-${language}`, { innerHTML: html })]);
}

/**
 * Render a link to an element's source code
 */
function createSourceLink(source: SourceReference, _context: ApiRenderContext) {
	// Don't try to create links for files with absolute paths
	if (source.fileName[0] === '/') {
		return;
	}

	// const link = <HTMLElement>createGitHubLink(
	// 	{
	// 		project: context.docSetId.project,
	// 		version: context.docSetId.version!
	// 	},
	// 	`src/${source.fileName}#L${source.line}`
	// );
	const link = h('a');
	link.title = `${source.fileName}#L${source.line}`;
	return <HTMLAnchorElement>link;
}

/**
 * Generate a string representation of a function/method signature
 */
function signatureToString(
	signature: SignatureReflection,
	isParameter = false
): string {
	if (signature.name === '__index') {
		const param = signature.parameters[0];
		return `[${param.name}: ${typeToString(param.type)}]: ${typeToString(
			signature.type
		)}`;
	} else {
		let name = signature.name;
		if (name === '__call') {
			name = '';
		}

		let text = `${name}`;

		if (isGenericReflection(signature)) {
			const typeParams = signature.typeParameter
				.map(param => typeParameterToString(param))
				.join(', ');
			text += `<${typeParams}>`;
		}

		text += '(';
		if (signature.parameters) {
			const params = signature.parameters.map(param => {
				const optional = param.flags.isOptional ? '?' : '';
				return `${param.name}${optional}: ${typeToString(param.type)}`;
			});
			text += params.join(', ');
		}

		text += `)`;

		if (signature.kindString !== 'Constructor signature') {
			const sep = isParameter ? ' => ' : ': ';
			text += `${sep}${typeToString(signature.type)}`;
		}

		return text;
	}
}

/**
 * Generate a string representation of a type
 */
function typeToString(type: Type): string {
	if (isStringLiteralType(type)) {
		return `'${type.value}'`;
	} else if (isUnionType(type)) {
		const strings = type.types!.map(typeToString);
		return strings.join(' | ');
	} else if (isArrayType(type)) {
		return `${typeToString(type.elementType!)}[]`;
	} else if (isReflectionType(type)) {
		const d = type.declaration!;
		if (d.kindString === 'Type literal') {
			if (d.children) {
				const parts = d.children.map((child: any) => {
					return `${child.name}: ${typeToString(
						child.type || child.kindString
					)}`;
				});
				return `{ ${parts.join(', ')} }`;
			} else if (d.signatures) {
				return signatureToString(d.signatures[0], true);
			} else if (d.name === '__type') {
				return '{ ... }';
			}
		}
	} else if (isReferenceType(type)) {
		let str = type.name!;
		if (type.typeArguments) {
			const args = type.typeArguments.map((arg: any) => {
				return typeToString(arg);
			});
			str += `<${args.join(', ')}>`;
		}
		return str;
	} else if (isIntrinsicType(type)) {
		return type.name;
	} else if (isTypeParameterType(type)) {
		if (type.constraint) {
			return `${type.name}<${typeToString(type.constraint)}>`;
		} else {
			return type.name;
		}
	} else if (isUnknownType(type)) {
		return type.name;
	}

	return type.type;
}

/**
 * Indicate whether a value is a string literal
 */
function isStringLiteralType(type: Type): type is StringLiteralType {
	return type.type === 'stringLiteral';
}

/**
 * Indicate whether a value is a union
 */
function isUnionType(type: Type): type is UnionType {
	return type.type === 'union';
}

/**
 * Indicate whether a value is an array
 */
function isArrayType(type: Type): type is ArrayType {
	return type.type === 'array';
}

/**
 * Indicate whether a value is a reflection
 */
function isReflectionType(type: Type): type is ReflectionType {
	return type.type === 'reflection';
}

/**
 * Indicate whether a value is a reference type
 */
function isReferenceType(type: Type): type is ReferenceType {
	return type.type === 'reference';
}

/**
 * Indicate whether a value is an intrinsic type
 */
function isIntrinsicType(type: Type): type is IntrinsicType {
	return type.type === 'intrinsic';
}

/**
 * Indicate whether a value is a type parameter
 */
function isTypeParameterType(type: Type): type is TypeParameterType {
	return type.type === 'typeParameter';
}

function isUnknownType(type: Type): type is UnknownType {
	return type.type === 'unknown';
}

/**
 * Render a type to a DOM node
 */
function renderType(type: any, context: ApiRenderContext): HTMLElement {
	if (type.type === 'stringLiteral') {
		return h('span.type-literal', {}, type.value);
	} else if (type.type === 'union') {
		return h('span.type-union', {}, type.types!.map(renderType));
	} else if (type.type === 'array') {
		const node = renderType(type.elementType!, context);
		node.classList.add('type-array');
		return node;
	} else if (type.type === 'reflection') {
		const d = type.declaration!;
		if (d.kindString === 'Type literal') {
			if (d.children) {
				const parts = d.children.map((child: any) => {
					const typeNode = renderType(child.type, context);
					return h('span', {}, [
						h('span.type-label', {}, child.name),
						typeNode
					]);
				});

				return h('span.type-list', {}, parts);
			} else if (d.signatures) {
				return h('span.type-signature', {
					innerHTML: signatureToString(d.signatures[0], true)
				});
			}
		}
	}

	const returnType = h('span');
	if (type.type === 'reference' && type.id != null) {
		const link = h('a', {}, type.name);
		returnType.appendChild(link);

		// Push this link onto the list to be resolved later, once all the
		// slugs have been generated
		context.linksToResolve.push({
			link,
			id: type.id
		});
	} else {
		returnType.appendChild(document.createTextNode(type.name));
	}

	if (type.typeArguments) {
		const args = type.typeArguments.map((arg: any) => {
			return renderType(arg, context);
		});
		returnType.appendChild(h('span.type-list.type-arg', {}, args));
	}

	return returnType;
}

/**
 * Find the module that contains a given declaration ID
 */
function findModule(id: number, index: ApiIndex) {
	let declaration = <Reflection>index[id];
	while (declaration && declaration.kindString !== 'External module') {
		declaration = declaration.parent;
	}
	return declaration;
}

/**
 * Get all the exported, public members from an API item. Members
 * prefixed by '_' and those inherited from external sources are currently
 * excluded.
 */
function getExports(reflection: ContainerReflection) {
	if (!reflection.children) {
		return [];
	}
	const exports: DeclarationReflection[] = [];
	for (let child of reflection.children) {
		if (child.name === '_global') {
			exports.push(child);
		}
		if (child.flags.isExported) {
			const source = child.sources[0].fileName;
			// Don't include private (by convention) members
			if (!/^_/.test(child.name) && !/node_modules\//.test(source)) {
				exports.push(child);
			}
		}
	}
	return exports;
}

/**
 * Create a heading element at a given level, including an anchor ID.
 */
function getHeadingRenderer(
	ref: LocationRef,
	name: string,
	slugify: (url: string) => string
) {
	return (
		level: number,
		content: Reflection | string,
		context: ApiRenderContext
	) => {
		const classes: string[] = [];

		let type: string | undefined;
		if (typeof content !== 'string') {
			type = content.kindString;
		} else if (content === 'Call signatures') {
			type = 'Function';
		}

		if (type) {
			classes.push('is-type');
		}

		if (type === 'Method' || type === 'Function') {
			classes.push('is-type-callable');
		} else if (type === 'Property' || type === 'Accessor') {
			classes.push('is-type-property');
		} else if (type === 'Constructor') {
			classes.push('is-type-constructor');
		} else if (type === 'Class') {
			classes.push('is-type-class');
		} else if (type === 'Interface') {
			classes.push('is-type-interface');
		} else if (type === 'Object literal') {
			classes.push('is-type-value');
		}

		const text =
			typeof content === 'string'
				? content
				: // Module names are surrounded by '"'
				  content.name.replace(/^"|"$/g, '');
		const className = classes.join(' ');
		let id: string;

		if (level === 1) {
			id = `${toHash(ref)}__${docIdToDomId(name)}`.slice(1);
		} else {
			id = `${toHash(ref)}__${docIdToDomId(name)}${sep}${slugify(
				docIdToDomId(text)
			)}`.slice(1);
		}

		const heading = <HTMLElement>h(
			`h${level}`,
			{ className, id },
			text.replace(/^src\//, '')
		);

		let sourceLink: HTMLAnchorElement | undefined;
		if (typeof content !== 'string' && content.sources) {
			sourceLink = createSourceLink(content.sources[0], context);
		}

		// if (sourceLink) {
		// 	const icons = addHeadingIcons(heading);
		// 	icons.appendChild(sourceLink);
		// }

		context.page.element.appendChild(heading);
		return heading;
	};
}

// Create a DOM table
function createTable(headings: string[], rows: (string | Element)[][]) {
	return h('table.table.is-bordered', {}, [
		h('thead', {}, [
			h('tr', {}, [headings.map(heading => h('th', {}, heading))])
		]),
		h(
			'tbody',
			{},
			rows.map(row =>
				h(
					'tr',
					{},
					row.map(content => {
						if (typeof content === 'string') {
							return h('td', { innerHTML: content });
						} else {
							return h('td', {}, content);
						}
					})
				)
			)
		)
	]);
}

/**
 * Indicate whether a reflection has a comment element wiht content
 */
function hasComment(reflection: Reflection) {
	const comment = reflection.comment;
	return comment && (comment.text || comment.shortText);
}

/**
 * Create an index of TypeDoc declaration IDs to data structures. This function
 * also creates parent relationships.
 */
function createApiIndex(data: ProjectReflection) {
	const index: ApiIndex = {};
	for (const child of data.children) {
		child.parent = data;
		walkTree(child);
	}
	return index;

	function walkTree(data: DeclarationReflection) {
		index[data.id] = data;
		if (data.children) {
			for (const child of data.children) {
				child.parent = data;
				walkTree(child);
			}
		}
	}
}

/**
 * Sorter function for sorting API reflections
 */
function nameSorter(a: Reflection, b: Reflection) {
	if (a.name < b.name) {
		return -1;
	}
	if (a.name > b.name) {
		return 1;
	}
	return 0;
}

/**
 * Format a TypeScript class or interface declaration.
 *
 * This is an extremely simple format function whose goal is to keep
 * declaration lines from being too long.
 */
function formatDeclaration(text: string) {
	if (text.length <= preferredSignatureWidth) {
		return text;
	}

	return formatSignature(text);
}

/**
 * Format a TypeScript method signature.
 *
 * This is an extremely simple format function whose goal is to keep
 * declaration lines from being too long.
 */
function formatSignature(text: string) {
	if (text.length <= preferredSignatureWidth) {
		return text;
	}

	let output = [text];
	let input: string[] = [];
	let changed = true;

	while (
		output.some(line => line.length > preferredSignatureWidth) &&
		changed
	) {
		input = output;
		output = [];
		changed = false;

		while (input.length > 0) {
			const text = input.shift()!;
			if (text.length <= preferredSignatureWidth) {
				output.push(text);
			} else {
				const range = findSplitCandidate(text);
				if (range) {
					const indent = getIndent(text);
					output.push(text.slice(0, range[0]));
					output.push(
						...splitList(text, range[0], range[1]).map(line => {
							return `${indent}    ${line}`;
						})
					);
					output.push(`${indent}${text.slice(range[1])}`);
					changed = true;
				} else {
					output.push(text);
				}
			}
		}
	}

	return output.join('\n');
}

/**
 * Find the best group expression to split in a given line of code
 */
function findSplitCandidate(text: string) {
	let width = 0;
	let best: number[] | undefined;
	let hasGroups = true;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		let end = i;
		if (char === '(' || char === '{' || char === '<') {
			end = findGroupEnd(text, i + 1);
		}
		if (end > i) {
			hasGroups = true;
			if (canSplit(text, i + 1, end)) {
				if (!best || end - i > width) {
					if (text[i + 1] === ' ') {
						// There are spaces around the expression, like { foo }
						best = [i + 2, end - 1];
					} else {
						best = [i + 1, end];
					}
					width = end - i;
				}
			}
		}
	}

	if (!best && hasGroups) {
		// There wasn't a list to split, so split the longest group
		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			let end = i;
			if (char === '(' || char === '{' || char === '<') {
				end = findGroupEnd(text, i + 1);
			}
			if (end > i) {
				if (!best || end - i > width) {
					if (text[i + 1] === ' ') {
						// There are spaces around the expression, like { foo }
						best = [i + 2, end - 1];
					} else {
						best = [i + 1, end];
					}
					width = end - i;
				}
			}
		}
	}

	return best;
}

/**
 * Find the end of a group expression
 */
function findGroupEnd(text: string, start: number) {
	let depth = 1;
	for (let i = start; i < text.length; i++) {
		const char = text[i];
		if (char === '(' || char === '{' || char === '<') {
			depth++;
		} else if (
			char === ')' ||
			char === '}' ||
			(char === '>' && text[i - 1] !== '=')
		) {
			depth--;
		}
		if (depth === 0) {
			return i;
		}
	}
	return -1;
}

/**
 * Return true if the given segment be split as an expression list
 */
function canSplit(text: string, start: number, end: number) {
	let depth = 0;
	for (let i = start; i < end; i++) {
		const char = text[i];
		if (char === '(' || char === '{' || char === '<') {
			depth++;
		} else if (
			char === ')' ||
			char === '}' ||
			(char === '>' && text[i - 1] !== '=')
		) {
			depth--;
		} else if (char === ',' && depth === 0) {
			return true;
		}
	}
	return false;
}

/**
 * Split a list of TS expressions
 */
function splitList(text: string, start: number, end: number) {
	let depth = 0;
	let partStart = start;
	const parts: string[] = [];
	for (let i = start; i < end; i++) {
		const char = text[i];
		if (char === '(' || char === '{' || char === '<') {
			depth++;
		} else if (
			char === ')' ||
			char === '}' ||
			(char === '>' && text[i - 1] !== '=')
		) {
			depth--;
		} else if (char === ',' && depth === 0) {
			parts.push(text.slice(partStart, i + 1));
			partStart = i + 2;
		}
	}
	parts.push(text.slice(partStart, end));
	return parts;
}

/**
 * Get the initial blank space at the start of a string
 */
function getIndent(text: string) {
	const textStart = text.search(/\S/);
	if (textStart !== -1) {
		return text.slice(0, textStart);
	}
	return '';
}

type ApiIndex = { [key: number]: DeclarationReflection };
type SlugIndex = { [key: number]: string };

interface HeadingRenderer {
	(
		level: number,
		content: Reflection | string,
		context: ApiRenderContext
	): HTMLElement;
}

interface NameRefs {
	[key: string]: number;
}

interface ApiRenderContext {
	page: DocPage;
	renderHeading: HeadingRenderer;
	apiIndex: ApiIndex;
	slugIndex: SlugIndex;
	api: ProjectReflection;
	ref: LocationRef;
	linksToResolve: { link: HTMLAnchorElement; id: number }[];
	nameRefs: NameRefs;
}

interface DocPage {
	name: string;
	element: Element;
	title: string;
	ref: LocationRef;
}

enum Relationship {
	Extends = 'Extends',
	Inherited = 'Inherited from'
}
