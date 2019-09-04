import { fixture, assert, aTimeout } from '@open-wc/testing';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import './test-element.js';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';

describe('ProjectsListConsumerMixin', function() {
  async function noAutoFixture() {
    return await fixture(`<test-element noautoprojects></test-element>`);
  }

  async function basicFixture() {
    return await fixture(`<test-element></test-element>`);
  }

  describe('_projectDataImportHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Calls refreshProjects() when called', () => {
      let called = false;
      element.refreshProjects = () => called = true;
      element._projectDataImportHandler({
        cancelable: false
      });
      assert.isTrue(called);
    });

    it('Won\'t call refreshProjects() when event is cancelable', () => {
      let called = false;
      element.refreshProjects = () => called = true;
      element._projectDataImportHandler({
        cancelable: true
      });
      assert.isFalse(called);
    });

    it('Calls refresh() when data-imported is handled', () => {
      let called = false;
      element.refreshProjects = () => called = true;
      document.body.dispatchEvent(new CustomEvent('data-imported', {
        bubbles: true
      }));
      assert.isTrue(called);
    });
  });

  describe('_projectDatabaseDestroyedHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Calls refreshProjects() when called with "legacy-projects" datastore', () => {
      let called = false;
      element.refreshProjects = () => called = true;
      element._projectDatabaseDestroyedHandler({
        detail: {
          datastore: ['legacy-projects']
        }
      });
      assert.isTrue(called);
    });

    it('Calls refreshProjects() when called with "all" datastore', () => {
      let called = false;
      element.refreshProjects = () => called = true;
      element._projectDatabaseDestroyedHandler({
        detail: {
          datastore: ['legacy-projects']
        }
      });
      assert.isTrue(called);
    });

    it('Calls refreshProjects() when datastore is a string', () => {
      let called = false;
      element.refreshProjects = () => called = true;
      element._projectDatabaseDestroyedHandler({
        detail: {
          datastore: 'legacy-projects'
        }
      });
      assert.isTrue(called);
    });

    it('Calls refreshProjects() when datastore-destroyed is handled', () => {
      let called = false;
      element.refreshProjects = () => called = true;
      document.body.dispatchEvent(new CustomEvent('datastore-destroyed', {
        bubbles: true,
        detail: {
          datastore: ['legacy-projects']
        }
      }));
      assert.isTrue(called);
    });

    it('Do nothing when datastore not set', () => {
      let called = false;
      element.refreshProjects = () => called = true;
      element._projectDatabaseDestroyedHandler({
        detail: {}
      });
      assert.isFalse(called);
    });

    it('Do nothing when datastore is not an array', () => {
      let called = false;
      element.refreshProjects = () => called = true;
      element._projectDatabaseDestroyedHandler({
        detail: {
          datastore: true
        }
      });
      assert.isFalse(called);
    });

    it('Do nothing when datastore is not projects store', () => {
      let called = false;
      element.refreshProjects = () => called = true;
      element._projectDatabaseDestroyedHandler({
        detail: {
          datastore: 'saved'
        }
      });
      assert.isFalse(called);
    });
  });

  describe('_projectsSortFn()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Returns 0 when order equal', () => {
      const a = {
        order: 1
      };
      const b = {
        order: 1
      };
      const result = element._projectsSortFn(a, b);
      assert.equal(result, 0);
    });

    it('Returns 1 when A order is higher', () => {
      const a = {
        order: 1
      };
      const b = {
        order: 0
      };
      const result = element._projectsSortFn(a, b);
      assert.equal(result, 1);
    });

    it('Returns -1 when B order is higher', () => {
      const a = {
        order: 0
      };
      const b = {
        order: 1
      };
      const result = element._projectsSortFn(a, b);
      assert.equal(result, -1);
    });
  });

  describe('_computeProjectsAutocomplete()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Returns undefined when no argument', () => {
      const result = element._computeProjectsAutocomplete();
      assert.isUndefined(result);
    });

    it('Returns undefined when passed array is empty', () => {
      const result = element._computeProjectsAutocomplete([]);
      assert.isUndefined(result);
    });

    it('Returns undefined when argument is not an array', () => {
      const result = element._computeProjectsAutocomplete(123);
      assert.isUndefined(result);
    });

    it('Returns list of names', () => {
      const result = element._computeProjectsAutocomplete([{
        name: 't1'
      }, {
        name: 't2'
      }]);
      assert.deepEqual(result, ['t1', 't2']);
    });
  });

  describe('_processSelectedProjectsInfo()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Returns object when no argument', () => {
      const result = element._processSelectedProjectsInfo();
      assert.typeOf(result, 'object');
    });

    it('Returns object when argument is empty', () => {
      const result = element._processSelectedProjectsInfo([]);
      assert.typeOf(result, 'object');
    });

    it('Object has empty "add" list', () => {
      const result = element._processSelectedProjectsInfo([]);
      assert.typeOf(result.add, 'array');
      assert.lengthOf(result.add, 0);
    });

    it('Object has empty "existing" list', () => {
      const result = element._processSelectedProjectsInfo([]);
      assert.typeOf(result.existing, 'array');
      assert.lengthOf(result.existing, 0);
    });

    it('Add projects to "add" proeprty when projects do not exist', () => {
      const result = element._processSelectedProjectsInfo(['a', 'b']);
      assert.deepEqual(result.add, ['a', 'b']);
      assert.lengthOf(result.existing, 0);
    });

    it('Skips empty names', () => {
      const result = element._processSelectedProjectsInfo(['a', '', 'b']);
      assert.deepEqual(result.add, ['a', 'b']);
      assert.lengthOf(result.existing, 0);
    });

    it('Add projects to "existing" proeprty when projects exist', () => {
      element.projects = [{
        name: 'a',
        _id: 'aId'
      }, {
        name: 'b',
        _id: 'bId'
      }];
      const result = element._processSelectedProjectsInfo(['a', 'b']);
      assert.deepEqual(result.existing, ['aId', 'bId']);
      assert.lengthOf(result.add, 0);
    });
  });

  describe('_handleProjectsError()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Dispatches "send-analytics" custom event', () => {
      const spy = sinon.spy();
      element.addEventListener('send-analytics', spy);
      try {
        element._handleProjectsError(new Error('test-message'));
      } catch (_) {
        // ...
      }
      assert.isTrue(spy.called);
    });

    it('"send-analytics" has required properties', () => {
      const spy = sinon.spy();
      element.addEventListener('send-analytics', spy);
      try {
        element._handleProjectsError(new Error('test-message'));
      } catch (_) {
        // ..
      }
      const { detail } = spy.args[0][0];
      assert.typeOf(detail, 'object', 'e.detail is an object');
      assert.equal(detail.type, 'exception', 'type is set');
      assert.equal(detail.description,
        '[projects-list-consumer]: test-message', 'message is set');
      assert.isFalse(detail.fatal, 'fatal is set');
    });

    it('Throws the same error', () => {
      assert.throws(() => {
        element._handleProjectsError(new Error('test-message'));
      });
    });
  });

  describe('refreshProjects()', () => {
    let element;
    beforeEach(async () => {
      element = await noAutoFixture();
    });

    it('Eventually calls _updateProjectsList()', async () => {
      let called = false;
      element._updateProjectsList = () => called = true;
      element.refreshProjects();
      await aTimeout();
      assert.isTrue(called);
    });

    it('Sets __refreshingDebouncer flag', async () => {
      element._updateProjectsList = () => {};
      element.refreshProjects();
      assert.isTrue(element.__refreshingDebouncer);
      await aTimeout();
    });

    it('Clears __refreshingDebouncer flag after callback', async () => {
      element._updateProjectsList = () => {};
      element.refreshProjects();
      await aTimeout();
      assert.isFalse(element.__refreshingDebouncer);
    });

    it('Do nothing when __refreshingDebouncer flag is set', async () => {
      let called = false;
      element._updateProjectsList = () => called = true;
      element.__refreshingDebouncer = true;
      element.refreshProjects();
      await aTimeout();
      assert.isFalse(called);
    });
  });

  describe('_updateProjectsList()', () => {
    before(async () => {
      await DataGenerator.insertProjectsData({
        projectsSize: 20,
        autoRequestId: true
      });
    });

    after(async () => {
      await DataGenerator.destroySavedRequestData();
    });

    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Eventually updates projects list', (done) => {
      element.addEventListener('projects-changed', function f(e) {
        if (!e.detail.value) {
          return;
        }
        element.removeEventListener('projects-changed', f);
        assert.typeOf(element.projects, 'array');
        assert.lengthOf(element.projects, 20);
        done();
      });
    });

    it('Calls notifyResize()', (done) => {
      element.notifyResize = () => {};
      const spy = sinon.spy(element, 'notifyResize');
      element.addEventListener('projects-changed', function f(e) {
        if (!e.detail.value) {
          return;
        }
        element.removeEventListener('projects-changed', f);
        setTimeout(() => {
          assert.isTrue(spy.called);
          done();
        }, 5);
      });
    });
  });

  describe('_projectChangedHandler()', () => {
    let element;
    let projects;
    const changedName = 'test-name-changed';
    beforeEach(async function() {
      element = await noAutoFixture();
    });

    before(async () => {
      projects = await DataGenerator.insertProjectsData({
        projectsSize: 20,
        autoRequestId: true
      });
    });

    after(async () => {
      await DataGenerator.destroySavedRequestData();
    });

    it('Does nothing when event is cancelable', () => {
      const updated = Object.assign({}, projects[0]);
      updated.name = changedName;
      element._projectChangedHandler({
        cancelable: true,
        detail: {
          project: updated
        }
      });
      assert.isUndefined(element.projects);
    });

    it('Does nothing when no project on the event', () => {
      element._projectChangedHandler({
        cancelable: false,
        detail: {}
      });
      assert.isUndefined(element.projects);
    });

    it('Does nothing when project has no ID', () => {
      element._projectChangedHandler({
        cancelable: false,
        detail: {
          project: {}
        }
      });
      assert.isUndefined(element.projects);
    });

    it('Creates list of projects when undefined', () => {
      const updated = Object.assign({}, projects[0]);
      updated.name = changedName;
      element._projectChangedHandler({
        cancelable: false,
        detail: {
          project: updated
        }
      });
      assert.typeOf(element.projects, 'array');
      assert.lengthOf(element.projects, 1);
    });

    it('Created list has updated item', () => {
      const updated = Object.assign({}, projects[0]);
      updated.name = changedName;
      element._projectChangedHandler({
        cancelable: false,
        detail: {
          project: updated
        }
      });
      assert.deepEqual(element.projects[0], updated);
    });

    it('Updates item on the list', () => {
      const updated = Object.assign({}, projects[0]);
      updated.name = changedName;
      element.projects = Array.from(projects);
      element._projectChangedHandler({
        cancelable: false,
        detail: {
          project: updated
        }
      });
      assert.equal(element.projects[0].name, changedName);
    });

    it('Adds new item to the list', () => {
      const updated = Object.assign({}, projects[0]);
      updated.name = changedName;
      updated._id = 'test-id';
      element.projects = Array.from(projects);
      element._projectChangedHandler({
        cancelable: false,
        detail: {
          project: updated
        }
      });
      assert.lengthOf(element.projects, 21);
      assert.equal(element.projects[20].name, changedName);
    });

    it('Handles project-object-changed event', () => {
      const updated = Object.assign({}, projects[0]);
      updated.name = changedName;
      document.body.dispatchEvent(new CustomEvent('project-object-changed', {
        bubbles: true,
        detail: {
          project: updated
        }
      }));
      assert.typeOf(element.projects, 'array');
      assert.lengthOf(element.projects, 1);
      assert.deepEqual(element.projects[0], updated);
    });
  });

  describe('_projectDeletedHandler()', () => {
    let element;
    let projects;
    beforeEach(async function() {
      element = await noAutoFixture();
    });

    before(async () => {
      projects = await DataGenerator.insertProjectsData({
        projectsSize: 20,
        autoRequestId: true
      });
    });

    after(async () => {
      await DataGenerator.destroySavedRequestData();
    });

    it('Does nothing when event is cancelable', () => {
      element.projects = Array.from(projects);
      element._projectDeletedHandler({
        cancelable: true,
        detail: {
          id: projects[0]._id
        }
      });
      assert.lengthOf(element.projects, 20);
    });

    it('Does nothing when no project ID on the event', () => {
      element.projects = Array.from(projects);
      element._projectDeletedHandler({
        cancelable: false,
        detail: {}
      });
      assert.lengthOf(element.projects, 20);
    });

    it('Does nothing when no projects ', () => {
      element._projectDeletedHandler({
        cancelable: false,
        detail: {
          id: projects[0]._id
        }
      });
      // It's about not throwing an error
      assert.isUndefined(element.projects);
    });

    it('Removes project from the list ', () => {
      element.projects = Array.from(projects);
      element._projectDeletedHandler({
        cancelable: false,
        detail: {
          id: projects[0]._id
        }
      });
      assert.lengthOf(element.projects, 19);
    });

    it('Ignores other requests ', () => {
      element.projects = Array.from(projects);
      assert.lengthOf(element.projects, 20, 'Initially has 20 requests');
      element._projectDeletedHandler({
        cancelable: false,
        detail: {
          id: 'test'
        }
      });
      assert.lengthOf(element.projects, 20);
    });
  });
});
