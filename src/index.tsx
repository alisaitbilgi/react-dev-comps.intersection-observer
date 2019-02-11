import * as React from 'react';
import { checkOptionsChanged, validateOptions, ObserverOptions, Options } from './utils';
import scheduleTasks from 'background-tasks-api';
import 'intersection-observer';

type observerCb = (entries: ObserverEntry[], observer: IntersectionObserver) => void;
type observerCbExposed = (entry: ObserverEntry, observer: IntersectionObserver) => void;

interface Callbacks {
  onIntersect?: observerCbExposed;
  onEnter?: observerCbExposed;
  onLeave?: observerCbExposed;
}

interface Props extends Callbacks {
  targetClass?: string;
  targetStyle?: any;
  children?: any;
  updateOn?: any;
  options?: ObserverOptions;
}

interface ObserverEntry {
  intersectionRatio: number;
  isIntersecting: boolean;
}

declare class IntersectionObserver {
  constructor(callback: observerCb, options?: ObserverOptions);
  observe(target: Element): void;
  unobserve(target: Element): void;
}

class IntersectionTarget extends React.Component <Props> {
  targetElem: null | Element | HTMLDivElement;
  observer: null | IntersectionObserver;
  errorMsg: string;

  constructor(props: Props) {
    super(props);
    this.targetElem = null;
    this.observer = null;
    this.errorMsg = 'Target element is missing to be observed. Be sure, you did not mutate it.';
  }

  componentDidMount() {
    this.observeIntersection();
  }

  componentDidUpdate(prevProps: Props) {
    const { updateOn, options } = this.props;
    const isOptionsChanged = checkOptionsChanged(prevProps.options, options);
    const hasUpdate = checkOptionsChanged(prevProps.updateOn, updateOn);

    // when options are changed or onUpdate property array has changed,
    // we need to un-observe then re-observe intersections with new options provided.
    if (hasUpdate || isOptionsChanged) {
      if (!this.targetElem) {
        throw new Error(this.errorMsg);
      }

      if (this.observer && this.observer.unobserve) {
        this.observer.unobserve(this.targetElem);
        this.observeIntersection();
      }
    }
  }

  componentWillUnmount() {
    if (!this.targetElem || !this.observer || !this.observer.unobserve) return;

    this.observer.unobserve(this.targetElem);
  }

  setTargetElem() {
    return (elem: HTMLDivElement) => {
      this.targetElem = elem;
    };
  }

  observeIntersection() {
    if (!this.targetElem) {
      throw new Error(this.errorMsg);
    }

    const { onIntersect, onEnter, onLeave, options = {} } = this.props;
    const callbacks: Callbacks = { onIntersect, onEnter, onLeave };
    const opts = validateOptions(options);
    const intersectionHandler = this.handleIntersect(callbacks, opts);

    this.observer = new IntersectionObserver(intersectionHandler, opts);
    this.observer.observe(this.targetElem);
  }

  handleIntersect({ onIntersect, onEnter, onLeave }: Callbacks, opts: Options) {
    return (entries: ObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry: ObserverEntry) => {
        const { isIntersecting = false, intersectionRatio = 0 } = entry;
        const threshold = (opts && opts.threshold) || 1;
        const minThreshold = Array.isArray(threshold) ? Math.min(...threshold) : threshold;

        // Value of isIntersecting is depended on threshold value on chrome.
        // However, for safari, firefox and polyfill we just need to check also intersectionRatio.
        // Realized different behavior: https://github.com/w3c/IntersectionObserver/issues/345
        // inView variable is for fixing the behaviour between browsers.
        const inView = (isIntersecting && intersectionRatio >= (1 - minThreshold));

        // exposing onIntersect callback
        !!onIntersect && onIntersect(entry, observer);

        // exposing onEnter or onLeave callbacks
        inView
          ? !!onEnter && onEnter(entry, observer)
          : !!onLeave && onLeave(entry, observer);
      });
    };
  }

  render() {
    const {
      targetClass = 'intersection-target',
      targetStyle = {},
      children = null,
    } = this.props;

    return (
      <div
        ref={this.setTargetElem()}
        id="intersection-target"
        style={targetStyle}
        className={targetClass}
      >
        {children}
      </div>
    );
  }
}

export { scheduleTasks as scheduleTasksOnBackground };
export default IntersectionTarget;
