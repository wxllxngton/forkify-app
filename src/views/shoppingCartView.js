import View from './View.js';
import icons from 'url:../../img/icons.svg';

class ShoppingCartView extends View {
  _parentElement = document.querySelector('.shopping');
  _shoppingList = document.querySelector('.shopping__list');

  render(data) {
    // If there's no data or if there's data but the data is an array and it has no items in it
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    this._shoppingList.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup() {
    return `
        ${this._data.ingredients
          .map(ingredient => this._generateMarkupIngredient(ingredient))
          .join('')}
    `;
  }

  _generateMarkupIngredient(ingredient) {
    return `
          <li>${
            ingredient.quantity
              ? new Fraction(ingredient.quantity).toString()
              : ''
          } ${ingredient.unit} ${ingredient.description}
          </li>`;
  }
}

{
  /* <li class="recipe__ingredient">
            <svg class="recipe__icon">
              <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${
              ingredient.quantity
                ? new Fraction(ingredient.quantity).toString()
                : ''
            }</div>
            <div class="recipe__description">
              <span class="recipe__unit">${ingredient.unit}</span>
              ${ingredient.description}
            </div>
          </li>`; */
}

export default new ShoppingCartView();
