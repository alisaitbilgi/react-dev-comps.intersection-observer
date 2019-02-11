export interface ObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | [number];
}

interface ExtendedOptions extends ObserverOptions {
  [key: string]: any;
}

export type Options = ObserverOptions | undefined;

// tslint:disable-next-line
export const warningMsg = 'Warning: Your invalid options have been replaced with default options. Please check to validate: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API';

// it is really okey to compare old/new **options** changes with JSON.stringify.
export function checkOptionsChanged(prev: Options, next: Options): boolean {
  return JSON.stringify(prev) !== JSON.stringify(next);
}

export function checkOptionsValidity(options: any, defaultOptions: ExtendedOptions): boolean {
  const optionsKeys = Object.keys(options);
  const hasInvalidNumberOfOptions = optionsKeys.length > 3;
  const hasInvalidOptionKey = optionsKeys
    .filter((eachKey: any) => defaultOptions[eachKey] === undefined).length > 0;

  return !hasInvalidNumberOfOptions && !hasInvalidOptionKey;
}

export function validateOptions(options: Options): Options {
  const defaultOptions = { root: null, rootMargin: '0px', threshold: 1 };
  const isOptionsValid = checkOptionsValidity(options, defaultOptions);

  if (!isOptionsValid) {
    console.error(warningMsg);

    return defaultOptions;
  }

  return (<any>Object).assign(defaultOptions, options);
}
