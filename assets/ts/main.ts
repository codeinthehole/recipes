import u from 'umbrellajs'
import { consolidateIngredients } from './ingredients'

// Render an ingredients section in the page.
function main(): void {
    // All DOM interaction takes place in this function.
    //
    // Extract an array of method ingredient strings, which are assumed to be
    // in <li> elements within the article.
    const methodIngredientStrings: string[] = []
    u('article div.f4 li').each(function(node: HTMLElement): void {
        methodIngredientStrings.push(node.innerHTML)
    })

    // Build a <ul> of preparation ingredients.
    const prepIngredientsList: string[] = u('<ul>').append(
        ingredient => `<li>${ ingredient }</li>`, 
        consolidateIngredients(methodIngredientStrings)
    );

    // Append list to page.
    const articleEle = u('article div.f4')
    articleEle.append(u("<h2>Ingredients!</h2>"))
    articleEle.append(prepIngredientsList)
}


document.addEventListener("DOMContentLoaded", main)

