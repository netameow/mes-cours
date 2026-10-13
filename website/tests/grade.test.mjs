import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	gradeMultipleChoice,
	gradeMultipleMany,
	gradeTrueFalse,
	gradeFill,
	gradeText,
	gradeMatch,
	gradeOrder,
	normalizeAnswerText,
} from '../src/lib/activity/grade.mjs';

const mc = { k: 'mc', o: ['a', 'b', 'c'], a: 1 };
const mm = { k: 'mm', o: ['a', 'b', 'c'], a: [0, 2] };
const tf = { k: 'tf', a: true };
const fill = { k: 'fill', a: [['infinie', 'illimitée'], ['256']] };
const text = { k: 'text', a: ['3', 'x = 3'] };
const match = { k: 'match', o: ['A', 'B'], a: ['1', '2'] };
const order = { k: 'order', o: ['a', 'b', 'c'] };

test('mc : correct / incorrect / incomplet', () => {
	assert.equal(gradeMultipleChoice(mc, 1).status, 'correct');
	assert.equal(gradeMultipleChoice(mc, 0).status, 'incorrect');
	assert.equal(gradeMultipleChoice(mc, undefined).status, 'incomplete');
	assert.equal(gradeMultipleChoice(mc, 9).status, 'incomplete');
});

test('mm : ensemble exact exigé', () => {
	assert.equal(gradeMultipleMany(mm, [0, 2]).status, 'correct');
	assert.equal(gradeMultipleMany(mm, [2, 0]).status, 'correct');
	assert.equal(gradeMultipleMany(mm, [0]).status, 'incorrect');
	assert.equal(gradeMultipleMany(mm, []).status, 'incomplete');
});

test('tf : correct / incorrect / incomplet', () => {
	assert.equal(gradeTrueFalse(tf, true).status, 'correct');
	assert.equal(gradeTrueFalse(tf, false).status, 'incorrect');
	assert.equal(gradeTrueFalse(tf, null).status, 'incomplete');
});

test('fill : correction par trou, partielle', () => {
	assert.equal(gradeFill(fill, ['infinie', '256']).status, 'correct');
	assert.equal(gradeFill(fill, ['illimitée', '256']).status, 'correct');
	assert.equal(gradeFill(fill, ['gigantesque', '256']).status, 'partial');
	assert.equal(gradeFill(fill, ['a', 'b']).status, 'incorrect');
	assert.equal(gradeFill(fill, []).status, 'incomplete');
});

test('fill : la normalisation ignore accents/casse', () => {
	assert.equal(gradeFill({ k: 'fill', a: [['Chaîne', 'chaine'], ['café', 'CAFE']] }, ['chaine', 'café']).status, 'correct');
});

test('text : comparaison déterministe et tolérante', () => {
	assert.equal(gradeText(text, '3').status, 'correct');
	assert.equal(gradeText(text, '  x  =  3  ').status, 'correct');
	assert.equal(gradeText(text, '4').status, 'incorrect');
	assert.equal(gradeText(text, '').status, 'incomplete');
});

test('normalizeAnswerText : règles documentées', () => {
	assert.equal(normalizeAnswerText('  CafÉ !  '), 'cafe');
	assert.equal(normalizeAnswerText('x = 3'), 'x = 3');
	assert.equal(normalizeAnswerText('"Oui"'), 'oui');
});

test('match : correction de toutes les paires', () => {
	assert.equal(gradeMatch(match, [[0, 0], [1, 1]]).status, 'correct');
	assert.equal(gradeMatch(match, [[0, 1], [1, 0]]).status, 'incorrect');
	assert.equal(gradeMatch(match, [[0, 0]]).status, 'partial');
	assert.equal(gradeMatch(match, []).status, 'incomplete');
});

test('order : rangs corrects', () => {
	assert.equal(gradeOrder(order, [0, 1, 2]).status, 'correct');
	assert.equal(gradeOrder(order, [1, 2, 0]).status, 'incorrect');
	assert.equal(gradeOrder(order, [0, 2, 1]).status, 'partial');
	assert.equal(gradeOrder(order, [0, 1]).status, 'incomplete');
});