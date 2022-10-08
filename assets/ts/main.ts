import u from 'umbrellajs'
import { consolidateIngredients, compareIngredients, parseMethodIngredient, normaliseIngredient, formatIngredientObject } from './ingredients'

// Render an ingredients section in the page.
function main(event): void {
    // All DOM interaction takes place in this function.
    //
    // Extract an array of method ingredient strings, which are assumed to be
    // in <li> elements within the article.
    let methodIngredientStrings: string[] = []
    u('article div.f4 li').each(function(node: HTMLElement, index: number): void {
        methodIngredientStrings.push(node.innerHTML)
    })

    // Build a <ul> of preparation ingredients.
    let prepIngredientsList: string[] = u('<ul>').append(
        ingredient => `<li>${ ingredient }</li>`, 
        consolidateIngredients(methodIngredientStrings)
    );

    // Append list to page.
    let articleEle = u('article div.f4')
    articleEle.append(u("<h2>Ingredients!</h2>"))
    articleEle.append(prepIngredientsList)
}


document.addEventListener("DOMContentLoaded", main)

