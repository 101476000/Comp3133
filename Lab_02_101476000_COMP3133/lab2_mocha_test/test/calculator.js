const assert = require('chai').assert;
const calculator = require('../calculator');

describe('Calculator Tests', function() {
    
    // Addition Tests
    describe('Addition function', function() {
        it('add(5, 2) should return 7 - PASS', function() {
            assert.equal(calculator.add(5, 2), 7);
            console.log('✓ PASS: add(5, 2) = 7');
        });

        it('add(5, 2) should return 8 - FAIL', function() {
            assert.equal(calculator.add(5, 2), 8);
            console.log('✗ FAIL: add(5, 2) does not equal 8');
        });
    });

    // Subtraction Tests
    describe('Subtraction function', function() {
        it('sub(5, 2) should return 3 - PASS', function() {
            assert.equal(calculator.sub(5, 2), 3);
            console.log('✓ PASS: sub(5, 2) = 3');
        });

        it('sub(5, 2) should return 5 - FAIL', function() {
            assert.equal(calculator.sub(5, 2), 5);
            console.log('✗ FAIL: sub(5, 2) does not equal 5');
        });
    });

    // Multiplication Tests
    describe('Multiplication function', function() {
        it('mul(5, 2) should return 10 - PASS', function() {
            assert.equal(calculator.mul(5, 2), 10);
            console.log('✓ PASS: mul(5, 2) = 10');
        });

        it('mul(5, 2) should return 12 - FAIL', function() {
            assert.equal(calculator.mul(5, 2), 12);
            console.log('✗ FAIL: mul(5, 2) does not equal 12');
        });
    });

    // Division Tests
    describe('Division function', function() {
        it('div(10, 2) should return 5 - PASS', function() {
            assert.equal(calculator.div(10, 2), 5);
            console.log('✓ PASS: div(10, 2) = 5');
        });

        it('div(10, 2) should return 2 - FAIL', function() {
            assert.equal(calculator.div(10, 2), 2);
            console.log('✗ FAIL: div(10, 2) does not equal 2');
        });
    });
});
