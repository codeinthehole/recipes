// Types
// -----

enum Unit {
    Item = "ITEM",
    Grams = "GRAMS",
    Litres = "LITRES",
    Tablespoon = "TABLESPOON",
    Teaspoon = "TEASPOON",
    Pinch = "PINCH",
}

interface Ingredient {
    readonly name: string;
    readonly unit: Unit;
    quantity: number;
}

type SortFlag = -1|0|1

// Sort function that puts larger ingredients first.
//    -1 means a comes BEFORE b
//    +1 means a comes AFTER b
function compareIngredients(a: Ingredient, b: Ingredient): SortFlag {
    // If same unit, compare quantities directly.
    let result: SortFlag
    if (a.unit == b.unit) {
        if (a.quantity > b.quantity) {
            result = -1
        } else if (a.quantity < b.quantity) {
            result = 1
        } else {
            result = 0
        }

        // Item type sorts the other way.
        if (a.unit == Unit.Item) {
            result *= -1
        }

        return result
    }

    // Use an approx unit order
    const units: string[] = [
        Unit.Item,
        Unit.Grams,
        Unit.Litres,
        Unit.Tablespoon,
        Unit.Teaspoon,
    ]
    const aIndex: number = units.indexOf(a.unit)
    const bIndex: number = units.indexOf(b.unit)
    if (aIndex == -1 || bIndex == -1) {
        // If we can't find the unit, we don't change the order.
        return 0 
    } else {
        if (aIndex < bIndex) {
            return -1
        } else if (aIndex > bIndex) {
            return 1
        } else {
            return 0
        }
    }
}

// Return an array of ingredient strings, optimised for preparation (e.g.
// getting them out of the fridge/cupboards).
//
// The input is a list of method ingredients.
function consolidateIngredients(methodIngredientStrings: string[]): string[] {
    // Parse the method-ingredient strings into objects so we can
    // combine items, and sort by their approx size.
    const methodIngredientObjects: Ingredient[] = []
    methodIngredientStrings.forEach(function(item: string): void {
        methodIngredientObjects.push(parseMethodIngredient(item))
    })

    // Combine quantities of ingredients. 
    const prepIngredientMap: { [key: string]: Ingredient; } = {};
    methodIngredientObjects.forEach(function(item: Ingredient): void {
        if (item.name in prepIngredientMap && item.unit == prepIngredientMap[item.name].unit) {
            prepIngredientMap[item.name].quantity += item.quantity
        } else {
            prepIngredientMap[item.name] = item
        }
    })
    const prepIngredientObjects: Ingredient[] = Object.values(prepIngredientMap)

    // Sort array of ingredients by approx size.
    prepIngredientObjects.sort(compareIngredients)

    // Convert the ingredient objects back to an array of strings.
    const prepIngredientStrings: string[] = []
    prepIngredientObjects.forEach(function(item: Ingredient): void {
        prepIngredientStrings.push(formatIngredientObject(item))
    })
    return prepIngredientStrings
}

// Parse a method ingredient string into an ingredient object.
function parseMethodIngredient(item: string): Ingredient {
    const normalised: string = normaliseIngredient(item)
    let match: string[];
    let name = "", quantity = 1;
    let unit: Unit = Unit.Item;

    // Check for "6x sausages" form.
    match = normalised.match(/^([\d.]+)x? (.*)/)
    if (match) {
        quantity = parseFloat(match[1])
        name = match[2]
        unit = Unit.Item
    }

    // Check for "10-15 X" form.
    match = normalised.match(/^(\d+)-(\d+) (.*)/)
    if (match) {
        // Take upper found as quantity
        quantity = parseFloat(match[2])
        name = match[3]
        unit = Unit.Item
    }

    // Check for "500g plain flour" form.
    match = normalised.match(/^([\d.]+)g (of )?(.*)/)
    if (match) {
        quantity = parseFloat(match[1])
        name = match[3]
        unit = Unit.Grams
    }

    // Check for "1.25l stock" form.
    match = normalised.match(/^([\d.]+)l (.*)/)
    if (match) {
        quantity = parseFloat(match[1])
        name = match[2]
        unit = Unit.Litres
    }

    // Check for "A something of X" form.
    match = normalised.match(/^(A|1) .* of (\w+)/)
    if (match) {
        quantity = 1
        name = match[2]
        unit = Unit.Item
    }

    // Check for "1 tbsp of X".
    match = normalised.match(/^([\d.]+) ?(tb?sp)s? (of )?(.*)/)
    if (match) {
        quantity = parseFloat(match[1])
        name = match[4]
        unit = (match[2] == "tsp") ? Unit.Teaspoon : Unit.Tablespoon
    }

    // Check for "1/2 tsp of X".
    match = normalised.match(/^(\d+)\/(\d+) ?(tb?sp)s? (of )?(.*)/)
    if (match) {
        quantity = parseFloat(match[1]) / parseFloat(match[2])
        name = match[5]
        unit = (match[3] == "tsp") ? Unit.Teaspoon : Unit.Tablespoon
    }

    // Check for "Pinch .." etc
    match = normalised.match(/^Pinch (of )?(.*)/)
    if (match) {
        quantity = 1
        name = match[2]
        unit = Unit.Pinch
    }

    // Check for "A few .." etc
    match = normalised.match(/^A few (.*)/)
    if (match) {
        quantity = 3  // a few = 3
        name = match[1]
        unit = Unit.Item
    }

    return {
        name: name,
        quantity: quantity,  
        unit: unit,  
    }
}

// Strip method instructions from method ingredient string.
function normaliseIngredient(ingredient: string): string {
    let normalised = ""

    // Look for section wrapped in parens.
    const match = ingredient.match(/\(.*?\)/) 
    if (match) {
        // String contains parens.
        const noParens: string = ingredient.replace(/\(.*?\)/, "XX")
        const segments: string[] = noParens.split(",")
        if (segments.length > 1) {
            normalised = segments.slice(0, -1).join(",").replace("XX", match[0])
        } else {
            normalised = ingredient
        }
    } else {
        // String doesn't contain parens.
        const segments: string[] = ingredient.split(",")
        if (segments.length > 1) {
            normalised = segments.slice(0, -1).join(",")
        } else {
            normalised = ingredient
        }
    }
    return normalised
}

function formatIngredientObject(ingredientObj: Ingredient): string {
    // Other metric units
    const unitLabels: { [key in Unit]?: string; } = {
        [Unit.Item]: "x",
        [Unit.Grams]: "g",
        [Unit.Litres]: "l",
        [Unit.Tablespoon]: " tbsp", // Having a space before looks better
        [Unit.Teaspoon]: " tsp",
    };
    let unitLabel;
    if (ingredientObj.unit in unitLabels) {
        unitLabel = unitLabels[ingredientObj.unit];
        return `${ingredientObj.quantity}${unitLabel} ${ingredientObj.name}`
    }

    // Hand pinch separately as it has no quantity.
    if (ingredientObj.unit == Unit.Pinch) {
        return `A pinch of ${ingredientObj.name}`
    }

    return ingredientObj.name
}

export { 
    Unit, 
    consolidateIngredients, 
    compareIngredients, 
    parseMethodIngredient, 
    normaliseIngredient, 
    formatIngredientObject 
}
