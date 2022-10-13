import u from 'umbrellajs'
import { consolidateIngredients } from './ingredients'

// Entry-point for binding JS behaviour.
//
// All DOM interaction takes place in this function.
function main(): void {
    // Extract an array of method ingredient strings, which are assumed to be
    // in <li> elements within the article.
    const methodIngredientStrings: string[] = []
    u('article ul li').each(function(node: HTMLElement): void {
        methodIngredientStrings.push(node.innerHTML)
    })

    // Build a <ul> of preparation ingredients.
    const prepIngredientsList: string[] = u('<ul>').append(
        ingredient => `<li>${ ingredient }</li>`, 
        consolidateIngredients(methodIngredientStrings)
    );

    // Append list to page.
    const articleEle = u('article')
    articleEle.append(u("<h2>Ingredients!</h2>"))
    articleEle.append(prepIngredientsList)
}


document.addEventListener("DOMContentLoaded", main)

