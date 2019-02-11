import * as React from 'react';
import 'intersection-observer';
import { expect } from 'chai';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import IntersectionTarget from '../src/index';
import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { warningMsg } from '../src/utils';

declare global {
  interface Window {
    IntersectionObserver: any;
    console: any;
  }
}

window.IntersectionObserver = window.IntersectionObserver || {};

const sandbox = sinon.createSandbox();
const elem = document.createElement('div');
const _Adapter: any = Adapter;

elem.setAttribute('id', 'test-container');
document.body.appendChild(elem);
configure({ adapter: new _Adapter.default() });

describe('IntersectionTargets', () => {
  let wrapper: any;
  let observeIntersection: any;
  let handleIntersect: any;
  let setTargetElem: any;
  let wrapperInstance: any;
  let componentDidMount: any;
  let componentDidUpdate: any;

  beforeEach(() => {
    // we must *mount* the component instead of *shallow* to trigger ref callback.
    // ref-enzyme issue: https://github.com/airbnb/enzyme/issues/1394
    wrapper = mount(<IntersectionTarget />, {
      attachTo: document.getElementById('test-container'),
    });
    wrapperInstance = wrapper.instance();
    (
      {
        observeIntersection,
        handleIntersect,
        setTargetElem,
        componentDidMount,
        componentDidUpdate,
      } = wrapperInstance
    );
  });

  afterEach(() => {
    sandbox.restore();
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe('componentDidMount method', () => {
    it('should call observeIntersection method', () => {
      wrapperInstance.observeIntersection = sandbox.stub();
      componentDidMount.bind(wrapperInstance)();
      expect(wrapperInstance.observeIntersection.callCount).to.equal(1);
    });
  });
  describe('componentDidUpdate method', () => {
    it('should do nothing if options prop is not changed', () => {
      wrapper.setProps({ options: { rootMargin: '10px', threshold: 1 } });
      wrapperInstance.observeIntersection = sandbox.stub();
      wrapperInstance.observer = { unobserve: sandbox.stub() };
      componentDidUpdate.bind(wrapperInstance)({ options: { rootMargin: '10px', threshold: 1 } });
      expect(wrapperInstance.observeIntersection.callCount).to.equal(0);
      expect(wrapperInstance.observer.unobserve.callCount).to.equal(0);
    });
    it('should un-observe and then re-observe with new options provided if options changed', () => {
      wrapper.setProps({ options: { rootMargin: '10px', threshold: 1 } });
      wrapperInstance.observeIntersection = sandbox.stub();
      wrapperInstance.observer = { unobserve: sandbox.stub() };
      componentDidUpdate.bind(wrapperInstance)({ options: { rootMargin: '20px', threshold: 1 } });
      expect(wrapperInstance.observeIntersection.callCount).to.equal(1);
      expect(wrapperInstance.observer.unobserve.callCount).to.equal(1);
    });
  });
  describe('observeIntersection method', () => {
    beforeEach(() => {
      handleIntersect = sandbox.stub();
    });

    it('should throw exception if target element is mutated to become null', () => {
      // two lines of 'this' bindings..
      const setTargetMethod = setTargetElem.bind(wrapperInstance);
      const observeIntersectionMethod = observeIntersection.bind(wrapperInstance);
      setTargetMethod()(null);

      expect(() => observeIntersectionMethod()).to.throw(Error);
    });
    it('should observe the intersections with default options, if none provided', () => {
      const observeIntersectionMethod = observeIntersection.bind(wrapperInstance);
      window.IntersectionObserver = sandbox.stub().returns({ observe: () => {} });
      observeIntersectionMethod();

      expect(window.IntersectionObserver.lastCall.args[1])
        .to.eql({ root: null, rootMargin: '0px', threshold: 1 });
    });
    it('should validate the options with defaults and warn the user if invalid given, ', () => {
      const observeIntersectionMethod = observeIntersection.bind(wrapperInstance);
      window.console.error = sandbox.stub();
      window.IntersectionObserver = sandbox.stub().returns({ observe: () => {} });
      // invalid options given
      wrapper.setProps({ options: { ali: 'sait' } });
      observeIntersectionMethod();

      expect(window.console.error.lastCall.args[0]).to.equal(warningMsg);
      expect(window.IntersectionObserver.lastCall.args[1])
        .to.eql({ root: null, rootMargin: '0px', threshold: 1 });
    });
    it('should observe the intersections with the options provided if valid given', () => {
      const observeIntersectionMethod = observeIntersection.bind(wrapperInstance);
      window.IntersectionObserver = sandbox.stub().returns({ observe: () => {} });
      wrapper.setProps({ options: { rootMargin: '10px', threshold: 0.5 } });
      observeIntersectionMethod();

      expect(window.IntersectionObserver.lastCall.args[1])
        .to.eql({ root: null, rootMargin: '10px', threshold: 0.5 });
    });
  });
  describe('handleIntersect method', () => {
    beforeEach(() => {
      observeIntersection = sandbox.stub();
    });

    it('should fire its onIntersect callback with entry and observer', () => {
      const onIntersectProp = sandbox.stub();
      const intersectionHandler = handleIntersect({ onIntersect: onIntersectProp });
      const fakeEntries = [{ fake: 'me' }];
      const fakeObserver = { fake: 'me' };

      intersectionHandler(fakeEntries, fakeObserver);

      expect(onIntersectProp.lastCall.args).to.eql([fakeEntries[0], fakeObserver]);
    });
    it('should fire its onEnter callback if target intersects the root', () => {
      const onEnterProp = sandbox.stub();
      const intersectionHandler = handleIntersect({ onEnter: onEnterProp });
      const fakeEntries = [{ fake: 'me', isIntersecting: true }];
      const fakeObserver = { fake: 'me' };

      intersectionHandler(fakeEntries, fakeObserver);

      expect(onEnterProp.lastCall.args).to.eql([fakeEntries[0], fakeObserver]);
    });
    it('should fire its onLeave callback if target lost the intersection from root', () => {
      const onLeaveProp = sandbox.stub();
      const intersectionHandler = handleIntersect({ onLeave: onLeaveProp });
      const fakeEntries = [{ fake: 'me', isIntersecting: false }];
      const fakeObserver = { fake: 'me' };

      intersectionHandler(fakeEntries, fakeObserver);

      expect(onLeaveProp.lastCall.args).to.eql([fakeEntries[0], fakeObserver]);
    });
  });
});
