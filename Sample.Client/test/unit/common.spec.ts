import * as util from '../../src/common/util/func';

describe('COALESCE [simple]', () => {
    it('returns input when input is not null', () => {
        expect(util.coalesce('123', 'abc')).toBe('123');
    });
    it('returns alternative when input is undefined', () => {
        expect(util.coalesce(undefined, 'abc')).toBe('abc');
    }); 
    it('returns alternative when input is null', () => {
        expect(util.coalesce(null, 'abc')).toBe('abc');
    });
});

describe('COALESCE2 [multiple ]', () => {
    it('returns input when input is not null', () => {
        expect(util.coalesce2('123', 'abc', 'def')).toBe('123');
    });
    it('returns first alternative when input is null', () => {
        expect(util.coalesce2(null, 'abc', 'def')).toBe('abc');
    });
    it('returns single alternative when input is undefined', () => {
        expect(util.coalesce2(undefined, 'abc')).toBe('abc');
    });   
    it('returns null when input is undefined and alt is {}', () => {
        expect(util.coalesce2(null, {})).toEqual({});
    });
    it('returns null when input is null and alt is null', () => {
        expect(util.coalesce2(null, null)).toBeNull();
    });
});

describe('REMAINDER with spread operator', () => {
    it('returns correct remainder from list with 3 elements', () => {
        expect(util.remainder(1, 2, 3)).toEqual([2, 3]);
    });
    it('returns null remainder from a list with a single null element', () => {
        expect(util.remainder(null)).toBeNull();
    });
    it('returns null remainder from a list with no elements', () => {
        expect(util.remainder()).toBeNull();
    });
});

describe('SINGLE', () => {
    it('returns the single element of a list with a valid single element', () => {
        util.single(1).then(r => expect(r).toEqual(1));
    });
    it('returns error when list has more than one element', () => {
        util.single(1, 2).catch(r => expect(r).toContain('list is either'));
    });
    it('#3', () => {
        util.single(null).then(r => expect(r).toBeNull());
    });
    it('returns error when list is empty', () => {
        util.single().catch(r => expect(r).toContain('list is either'));
    });
    it('returns error when list is undefined', () => {
        var r;
        util.single(r).catch(r => expect(r).toContain('list is either'));
    });
    it('returns error when list is null', () => {
        var r = null;
        util.single(r).catch(r => expect(r).toContain('list is either'));
    });
});
