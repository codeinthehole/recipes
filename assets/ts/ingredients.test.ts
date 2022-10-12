/**
 * @jest-environment jsdom
 */

import { 
    Unit, 
    consolidateIngredients, 
    compareIngredients, 
    parseMethodIngredient, 
    normaliseIngredient, 
    formatIngredientObject, 
    numberToFraction,
    titleCase
} from './ingredients';

describe("normaliseIngredient", () => {
    it.each([
        ["Eggs, chopped", "Eggs"],
        ["250g of lentils (red or green), washed", "250g of lentils (red or green)"],
        ["250g of lentils (green, red or mix), washed", "250g of lentils (green, red or mix)"],
        ["250g of lentils (green, red or mix)", "250g of lentils (green, red or mix)"],
    ])('normalises %p', (raw, normalised) => {
        expect(
            normaliseIngredient(raw)
        ).toBe(normalised)
    });
})

describe("parseMethodIngredient", () => {
    it.each([
        ["6x eggs, chopped", {name: "eggs", quantity: 6, unit: "ITEM"}],
        ["3 cloves of garlic, crushed", {name: "cloves of garlic", quantity: 3, unit: "ITEM"}],
        ["500g plain flour", {name: "plain flour", quantity: 500, unit: "GRAMS"}],
        ["1.25l stock", {name: "stock", quantity: 1.25, unit: "LITRES"}],
        ["A chunk of ginger, grated", {name: "ginger", quantity: 1, unit: "ITEM"}],
        ["1 tbsp garam masala", {name: "garam masala", quantity: 1, unit: "TABLESPOON"}],
        ["1 tbsp of garam masala", {name: "garam masala", quantity: 1, unit: "TABLESPOON"}],
        ["1 tsp of garam masala", {name: "garam masala", quantity: 1, unit: "TEASPOON"}],
        ["1/2 tbsp cayenne pepper", {name: "cayenne pepper", quantity: 0.5, unit: "TABLESPOON"}],
        ["1/4 tsp cayenne pepper", {name: "cayenne pepper", quantity: 0.25, unit: "TEASPOON"}],
        ["Pinch ground cinnamon", {name: "ground cinnamon", quantity: 1, unit: "PINCH"}],
        ["A few black cardomon pods", {name: "black cardomon pods", quantity: 3, unit: "ITEM"}],
        ["1 block of paneer, cubed", {name: "paneer", quantity: 1, unit: "ITEM"}],
        ["10-15 curry leaves, crushed", {name: "curry leaves", quantity: 15, unit: "ITEM"}],
        ["250g of lentils (green, red or black)", {name: "lentils (green, red or black)", quantity: 250, unit: "GRAMS"}],
        ["80ml milk", {name: "milk", quantity: 0.08, unit: "LITRES"}],
    ])('parses %p', (raw, parsed) => {
        expect(
            parseMethodIngredient(raw)
        ).toEqual(parsed)
    });
})

describe("formatIngredientObject", () => {
    it.each([
        [{name: "eggs", quantity: 6, unit: Unit.Item}, "6x eggs"],
        [{name: "lemon", quantity: 1, unit: Unit.Item}, "1x lemon"],
        [{name: "ground cinnamon", quantity: 1, unit: Unit.Pinch}, "Ground cinnamon"],
        [{name: "ground cumin", quantity: 0.5, unit: Unit.Teaspoon}, "Ground cumin"],
    ])('parses %p', (ingredientObj, formatted) => {
        expect(
            formatIngredientObject(ingredientObj)
        ).toEqual(formatted)
    });
})

describe("numberToFraction", () => {
    it.each([
        [1, "1"],
        [2, "2"],
        [0.5, "1/2"],
    ])('converts %p to %p', (num: number, fraction: string) => {
        expect(
            numberToFraction(num)
        ).toEqual(fraction)
    });
})

const A_BEFORE_B = -1
const B_BEFORE_A = 1

describe("compareIngredients", () => {
    it('500g comes before 1/2 tsp', () => {
        const a = {name: "A", quantity: 0.5, unit: Unit.Teaspoon}
        const b = {name: "B", quantity: 500, unit: Unit.Grams}

        expect(compareIngredients(a, b)).toEqual(B_BEFORE_A)
    });
    it('1 tbsp comes before 2 tsp', () => {
        const a = {name: "A", quantity: 1, unit: Unit.Tablespoon}
        const b = {name: "B", quantity: 2, unit: Unit.Teaspoon}

        expect(compareIngredients(a, b)).toEqual(A_BEFORE_B)
    });
    it('1 item comes before 2 tsp', () => {
        const a = {name: "A", quantity: 1, unit: Unit.Item}
        const b = {name: "B", quantity: 2, unit: Unit.Teaspoon}

        expect(compareIngredients(a, b)).toEqual(A_BEFORE_B)
    });
    it('1 item comes before 2 items', () => {
        const a = {name: "A", quantity: 1, unit: Unit.Item}
        const b = {name: "B", quantity: 2, unit: Unit.Item}

        expect(compareIngredients(a, b)).toEqual(A_BEFORE_B)
    });
    it('250g comes before 1 item', () => {
        const a = {name: "A", quantity: 250, unit: Unit.Grams}
        const b = {name: "B", quantity: 1, unit: Unit.Item}

        expect(compareIngredients(a, b)).toEqual(A_BEFORE_B)
    });
    it('1.5l comes before 1 item', () => {
        const a = {name: "A", quantity: 1.5, unit: Unit.Litres}
        const b = {name: "B", quantity: 1, unit: Unit.Item}

        expect(compareIngredients(a, b)).toEqual(A_BEFORE_B)
    });
    it('1.5l comes before 1 item', () => {
        const a = {name: "A", quantity: 1.5, unit: Unit.Litres}
        const b = {name: "B", quantity: 1, unit: Unit.Item}

        expect(compareIngredients(a, b)).toEqual(A_BEFORE_B)
    });
})

describe("titleCase", () => {
    it.each([
        ["cumin", "Cumin"],
    ])('converts %p to %p', (before: string, after: string) => {
        expect(titleCase(before)).toEqual(after)
    });
})

describe("consolidateIngredients", () => {
    it('works on single ingredient', () => {
        const methodIngredients = [
            "6x eggs, chopped"
        ]
        expect(
            consolidateIngredients(methodIngredients)
        ).toEqual([
            "6x eggs"
        ])
    });
    it('works on same ingredient reference multiple times', () => {
        const methodIngredients = [
            "6x eggs, chopped",
            "1 lemon",
            "3x eggs, whole"
        ]
        expect(
            consolidateIngredients(methodIngredients)
        ).toEqual([
            "1x lemon",
            "9x eggs"
        ])
    });
    it('sorts ingredients by approx size', () => {
        const methodIngredients = [
            "1/2 tsp salt",
            "500g plain flour",
        ]
        expect(
            consolidateIngredients(methodIngredients)
        ).toEqual([
            "500g plain flour",
            "Salt",
        ])
    });
    it('sorts ingredients by approx size (bigger list)', () => {
        const methodIngredients = [
            "250g lentils",
            "2 tsp cumin seeds",
            "1 onion",
            "1 block of paneer",
        ]
        expect(
            consolidateIngredients(methodIngredients)
        ).toEqual([
            "250g lentils",
            "1x onion",
            "1x paneer",
            "Cumin seeds",
        ])
    });
})
