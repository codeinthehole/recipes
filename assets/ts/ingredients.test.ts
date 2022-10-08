/**
 * @jest-environment jsdom
 */

import { Unit, consolidateIngredients, compareIngredients, parseMethodIngredient, normaliseIngredient, formatIngredientObject } from './ingredients';

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
        ["Pinch ground cinnamon", {name: "ground cinnamon", quantity: 1, unit: "ITEM"}],
        ["A few black cardomon pods", {name: "black cardomon pods", quantity: 3, unit: "ITEM"}],
        ["1 block of paneer, cubed", {name: "paneer", quantity: 1, unit: "ITEM"}],
        ["10-15 curry leaves, crushed", {name: "curry leaves", quantity: 15, unit: "ITEM"}],
        ["250g of lentils (green, red or black)", {name: "lentils (green, red or black)", quantity: 250, unit: "GRAMS"}],
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
    ])('parses %p', (ingredientObj, formatted) => {
        expect(
            formatIngredientObject(ingredientObj)
        ).toEqual(formatted)
    });
})

describe("compareIngredients", () => {
    it('500g comes before 1/2 tsp', () => {
        let a = {name: "A", quantity: 0.5, unit: Unit.Teaspoon}
        let b = {name: "B", quantity: 500, unit: Unit.Grams}

        expect(compareIngredients(a, b)).toEqual(1)
    });
    it('1 tbsp comes before 2 tsp', () => {
        let a = {name: "A", quantity: 1, unit: Unit.Tablespoon}
        let b = {name: "B", quantity: 2, unit: Unit.Teaspoon}

        expect(compareIngredients(a, b)).toEqual(-1)
    });
    it('1 item comes before 2 tsp', () => {
        let a = {name: "A", quantity: 1, unit: Unit.Item}
        let b = {name: "B", quantity: 2, unit: Unit.Teaspoon}

        expect(compareIngredients(a, b)).toEqual(-1)
    });
})

describe("consolidateIngredients", () => {
    it('works on single ingredient', () => {
        var methodIngredients = [
            "6x eggs, chopped"
        ]
        expect(
            consolidateIngredients(methodIngredients)
        ).toEqual([
            "6x eggs"
        ])
    });
    it('works on same ingredient reference multiple times', () => {
        var methodIngredients = [
            "6x eggs, chopped",
            "1 lemon",
            "3x eggs, whole"
        ]
        expect(
            consolidateIngredients(methodIngredients)
        ).toEqual([
            "9x eggs",
            "1x lemon"
        ])
    });
    it('sorts ingredients by approx size', () => {
        var methodIngredients = [
            "1/2 tsp salt",
            "500g plain flour",
        ]
        expect(
            consolidateIngredients(methodIngredients)
        ).toEqual([
            "500g plain flour",
            "0.5 tsp salt",
        ])
    });
    it('sorts ingredients by approx size (bigger list)', () => {
        var methodIngredients = [
            "250g lentils",
            "2 tsp cumin seeds",
            "1 onion",
            "1 block of paneer",
        ]
        expect(
            consolidateIngredients(methodIngredients)
        ).toEqual([
            "1x onion",
            "1x paneer",
            "250g lentils",
            "2 tsp cumin seeds",
        ])
    });
})
