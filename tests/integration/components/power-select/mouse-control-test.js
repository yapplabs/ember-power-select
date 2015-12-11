import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { numbers } from '../constants';

/**
7 - Mouse control
*/
moduleForComponent('ember-power-select', 'Integration | Component | Ember Power Select (Mouse control)', {
  integration: true
});

test('Mouseovering a list item highlights it', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').mousedown());
  assert.ok($('.ember-power-select-option:eq(0)').hasClass('ember-power-select-option--highlighted'), 'The first element is highlighted');
  Ember.run(() => $('.ember-power-select-option:eq(3)').trigger('mouseover'));
  assert.ok($('.ember-power-select-option:eq(3)').hasClass('ember-power-select-option--highlighted'), 'The 4th element is highlighted');
  assert.equal($('.ember-power-select-option:eq(3)').text().trim(), 'four');
});

test('Clicking an item selects it, closes the dropdown and focuses the trigger', function(assert) {
  assert.expect(4);

  this.numbers = numbers;
  this.foo = (val, dropdown) => {
    assert.equal(val, 'four', 'The action is invoked with the selected value as first parameter');
    assert.ok(dropdown.actions.close, 'The action is invoked with the the dropdown object as second parameter');
  };
  this.render(hbs`
    {{#power-select options=numbers onchange=foo as |option|}}
      {{option}}
    {{/power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').mousedown());
  Ember.run(() => $('.ember-power-select-option:eq(3)').mouseup());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select was closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigger is focused');
});

test('Clicking the trigger while the select is opened closes it and and focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').mousedown());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  Ember.run(() => this.$('.ember-power-select-trigger').mousedown());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.ok($('.ember-power-select-trigger').get(0) === document.activeElement, 'The trigger is focused');
});

test('Doing mousedown the clear button removes the selection but does not open the select', function(assert) {
  assert.expect(6);

  this.numbers = numbers;
  this.onChange = (selected, dropdown) => {
    assert.equal(selected, null, 'The onchange action was called with the new selection (null)');
    assert.ok(dropdown.actions.close, 'The onchange action was called with the dropdown object as second argument');
    this.set('selected', selected);
  };
  this.selected = "three";
  this.render(hbs`
    {{#power-select options=numbers selected=selected allowClear=true onchange=onChange as |option|}}
      {{option}}
    {{/power-select}}
  `);

  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.ok(/three/.test($('.ember-power-select-trigger').text().trim()), 'A element is selected');
  Ember.run(() => $('.ember-power-select-clear-btn').mousedown());
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is still closed');
  assert.ok(!/three/.test($('.ember-power-select-trigger').text().trim()), 'That element is not selected now');
});

test('Clicking anywhere outside the select while opened closes the component and doesn\'t focuses the trigger', function(assert) {
  assert.expect(3);

  this.numbers = numbers;
  this.render(hbs`
    <div id="other-thing">Foo</div>
    {{#power-select options=numbers onchange=(action (mut foo)) as |option|}}
      {{option}}
    {{/power-select}}
  `);

  Ember.run(() => this.$('.ember-power-select-trigger').mousedown());
  assert.equal($('.ember-power-select-dropdown').length, 1, 'The select is opened');
  Ember.run(() => {
    let event = new window.Event('mousedown');
    this.$('#other-thing')[0].dispatchEvent(event);
  });
  assert.equal($('.ember-power-select-dropdown').length, 0, 'The select is closed');
  assert.ok($('.ember-power-select-trigger').get(0) !== document.activeElement, 'The select is not focused');
});



