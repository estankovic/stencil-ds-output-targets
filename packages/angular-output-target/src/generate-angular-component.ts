import type { CompilerJsDoc, ComponentCompilerEvent } from '@stencil/core/internal';

import { createComponentEventTypeImports, dashToPascalCase, formatToQuotedList } from './utils';

/**
 * Creates an Angular component declaration from formatted Stencil compiler metadata.
 *
 * @param tagName The tag name of the component.
 * @param inputs The inputs of the Stencil component (e.g. ['myInput']).
 * @param outputs The outputs/events of the Stencil component. (e.g. ['myOutput']).
 * @param methods The methods of the Stencil component. (e.g. ['myMethod']).
 * @param includeImportCustomElements Whether to define the component as a custom element.
 * @returns The component declaration as a string.
 */
export const createAngularComponentDefinition = (
  tagName: string,
  inputs: readonly string[],
  outputs: readonly string[],
  methods: readonly string[],
  includeImportCustomElements = false
) => {
  const tagNameAsPascal = dashToPascalCase(tagName);

  const hasInputs = inputs.length > 0;
  const hasOutputs = outputs.length > 0;
  const hasMethods = methods.length > 0;

  // Formats the input strings into comma separated, single quoted values.
  const formattedInputs = formatToQuotedList(inputs);
  // Formats the output strings into comma separated, single quoted values.
  const formattedOutputs = formatToQuotedList(outputs);
  // Formats the method strings into comma separated, single quoted values.
  const formattedMethods = formatToQuotedList(methods);

  const proxyCmpOptions = [];

  if (includeImportCustomElements) {
    const defineCustomElementFn = `define${tagNameAsPascal}`;

    proxyCmpOptions.push(`\n  defineCustomElementFn: ${defineCustomElementFn}`);
  }

  if (hasInputs) {
    proxyCmpOptions.push(`\n  inputs: [${formattedInputs}]`);
  }

  if (hasMethods) {
    proxyCmpOptions.push(`\n  methods: [${formattedMethods}]`);
  }

  /**
   * Notes on the generated output:
   * - We disable @angular-eslint/no-inputs-metadata-property, so that
   * Angular does not complain about the inputs property. The output target
   * uses the inputs property to define the inputs of the component instead of
   * having to use the @Input decorator (and manually define the type and default value).
   */
  const output = `@ProxyCmp({${proxyCmpOptions.join(',')}\n})
@Component({
  selector: '${tagName}',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [${formattedInputs}],
})
export class ${tagNameAsPascal} {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;${
      hasOutputs
        ? `
    proxyOutputs(this, this.el, [${formattedOutputs}]);`
        : ''
    }
  }
}`;

  return output;
};

/**
 * Sanitizes and formats the component event type.
 * @param componentClassName The class name of the component (e.g. 'MyComponent')
 * @param event The Stencil component event.
 * @returns The sanitized event type as a string.
 */
const formatOutputType = (componentClassName: string, event: ComponentCompilerEvent) => {
  /**
   * The original attribute contains the original type defined by the devs.
   * This regexp normalizes the reference, by removing linebreaks,
   * replacing consecutive spaces with a single space, and adding a single space after commas.
   */
  return Object.entries(event.complexType.references)
    .filter(([_, refObject]) => refObject.location === 'local' || refObject.location === 'import')
    .reduce(
      (type, [src, dst]) => {
        const renamedType = `I${componentClassName}${type}`;
        return (
          renamedType
            .replace(new RegExp(`^${src}$`, 'g'), `${dst}`)
            // Capture all instances of the `src` field surrounded by non-word characters on each side and join them.
            .replace(new RegExp(`([^\\w])${src}([^\\w])`, 'g'), (v, p1, p2) => [p1, dst, p2].join(''))
        );
      },
      event.complexType.original
        .replace(/\n/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/,\s*/g, ', ')
    );
};

/**
 * Creates a formatted comment block based on the JS doc comment.
 * @param doc The compiler jsdoc.
 * @returns The formatted comment block as a string.
 */
const createDocComment = (doc: CompilerJsDoc) => {
  if (doc.text.trim().length === 0 && doc.tags.length === 0) {
    return '';
  }
  return `/**
   * ${doc.text}${doc.tags.length > 0 ? ' ' : ''}${doc.tags.map((tag) => `@${tag.name} ${tag.text}`)}
   */`;
};

/**
 * Creates the component interface type definition.
 * @param tagNameAsPascal The tag name as PascalCase.
 * @param events The events to generate the interface properties for.
 * @param componentCorePackage The component core package.
 * @param includeImportCustomElements Whether to include the import for the custom element definition.
 * @param customElementsDir The custom elements directory.
 * @returns The component interface type definition as a string.
 */
export const createComponentTypeDefinition = (
  tagNameAsPascal: string,
  events: readonly ComponentCompilerEvent[],
  componentCorePackage: string,
  includeImportCustomElements = false,
  customElementsDir?: string
) => {
  const publicEvents = events.filter((ev) => !ev.internal);

  const eventTypeImports = createComponentEventTypeImports(tagNameAsPascal, publicEvents, {
    componentCorePackage,
    includeImportCustomElements,
    customElementsDir,
  });
  const eventTypes = publicEvents.map((event) => {
    const comment = createDocComment(event.docs);
    return `${comment.length > 0 ? `  ${comment}` : ''}
  ${event.name}: EventEmitter<CustomEvent<${formatOutputType(tagNameAsPascal, event)}>>;`;
  });
  const interfaceDeclaration = `export declare interface ${tagNameAsPascal} extends Components.${tagNameAsPascal} {`;

  const typeDefinition =
    (eventTypeImports.length > 0 ? `${eventTypeImports + '\n\n'}` : '') +
    `${interfaceDeclaration}${
      eventTypes.length === 0
        ? '}'
        : `
${eventTypes.join('\n')}
}`
    }`;

  return typeDefinition;
};
