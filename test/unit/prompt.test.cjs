const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { transformSync } = require('esbuild');
const React = require('react');

// Run the real component with native host elements, without a device or Appium.
const native = Object.fromEntries(['Modal', 'Text', 'TextInput', 'TouchableWithoutFeedback', 'View'].map(name => [name, name]));
native.StyleSheet = { create: styles => styles };
function load(name) {
  const source = readFileSync(join(__dirname, '../../src', name + '.js'), 'utf8');
  const { code } = transformSync(source, { loader: 'jsx', format: 'cjs', target: 'node24' });
  const module = { exports: {} };
  const localRequire = id => id === 'react-native' ? native : id === './styles' ? { default: load('styles'), __esModule: true } : require(id);
  new Function('require', 'module', 'exports', code)(localRequire, module, module.exports);
  return module.exports.default;
}
const Prompt = load('Prompt');
function prompt(props = {}) {
  const instance = new Prompt({ ...Prompt.defaultProps, title: 'Caption', onSubmit() {}, onCancel() {}, ...props });
  instance.setState = update => { instance.state = { ...instance.state, ...update }; };
  instance.componentDidMount();
  return instance;
}
function find(element, type) {
  if (!React.isValidElement(element)) return;
  if (element.type === type) return element;
  for (const child of React.Children.toArray(element.props.children)) {
    const match = find(child, type);
    if (match) return match;
  }
}

test('existing captions initialize both value and character count', () => {
  const instance = prompt({ defaultValue: 'Existing caption' });
  assert.equal(instance.state.value, 'Existing caption');
  assert.equal(instance.state.length, 16);
  assert.equal(find(instance.render(), 'TextInput').props.value, 'Existing caption');
});

test('reopening resets the draft to the current default, but typing is not reset', () => {
  const instance = prompt({ visible: true, defaultValue: 'First caption' });
  instance._onChangeText('Unsaved draft');
  instance.componentDidUpdate(instance.props);
  assert.equal(instance.state.value, 'Unsaved draft');
  instance.props = { ...instance.props, visible: false, defaultValue: 'Another day' };
  instance.componentDidUpdate({ visible: true });
  instance.props = { ...instance.props, visible: true };
  instance.componentDidUpdate({ visible: false });
  assert.equal(instance.state.value, 'Another day');
  assert.equal(instance.state.length, 11);
  assert.equal(find(instance.render(), 'TextInput').props.value, 'Another day');
});

test('a pending submission blocks repeated submits and cancellation', async () => {
  let finish;
  let submitted = 0;
  let cancelled = 0;
  const pending = new Promise(resolve => { finish = resolve; });
  const instance = prompt({ onSubmit: () => { submitted++; return pending; }, onCancel: () => { cancelled++; } });
  const first = instance._onSubmitPress();
  instance._onSubmitPress();
  instance.render().props.onRequestClose();
  assert.equal(submitted, 1);
  assert.equal(cancelled, 0);
  finish();
  await first;
  instance._onCancelPress();
  assert.equal(cancelled, 1);
});

test('a failed submission unlocks retry and retains the draft', async () => {
  let fail;
  const pending = new Promise((resolve, reject) => { fail = reject; });
  const instance = prompt({ defaultValue: 'Keep me', onSubmit: () => pending });
  const result = instance._onSubmitPress();
  assert.equal(typeof result?.then, 'function');
  fail(new Error('upload failed'));
  await assert.rejects(result, /upload failed/);
  let retried;
  instance.props = { ...instance.props, onSubmit: value => { retried = value; } };
  await instance._onSubmitPress();
  assert.equal(retried, 'Keep me');
  assert.equal(instance.state.value, 'Keep me');
});

test('over-limit text does not submit, including keyboard submission', async () => {
  let submitted = 0;
  const instance = prompt({ limit: 3, defaultValue: 'Four', onSubmit: () => { submitted++; } });
  await instance._onSubmitPress();
  assert.equal(submitted, 0);
  instance._onChangeText('OK');
  await instance._onSubmitPress();
  assert.equal(submitted, 1);
});

test('Android back requests use the controlled cancellation callback', () => {
  let cancelled = 0;
  const instance = prompt({ visible: true, onCancel: () => { cancelled++; } });
  instance.render().props.onRequestClose();
  assert.equal(cancelled, 1);
});
