// import 'core.js';
import 'regenerator-runtime/runtime'; // Polyfilling async await
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { async } from 'regenerator-runtime';
import shoppingCartView from './views/shoppingCartView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// Not from JS But from Parcel
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1. LOADING THE RECIPE
    await model.loadRecipe(id); // It is a async function so it'll return a promise

    // 2. RENDERING THE RECIPE
    recipeView.render(model.state.recipe);
  } catch (err) {
    alert(err);
    recipeView.renderError();
  }
};

// controlRecipes('5ed6604591c37cdc054bc886');

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Publisher-Subscriber Pattern
 *
 * Publisher - code that knows when to react
 * Subscriber - code that wants to react (Usually does not know that the publisher exists)
 * Subscribes to publisher by passing in the subscriber function
 */

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render Bookmark View
    bookmarksView.render(model.state.bookmarks);

    /**
     * Change ID in URL
     *
     * @state
     * @title
     * @URL
     */
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back(); - Automatically going back to the last page

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`💥 ${err}`);
    addRecipeView.renderError(err.message);
  }
};

const controlSort = async function () {
  try {
    // 1) Show loading spinner
    resultsView.renderSpinner();

    // 2) Load search results
    await model.loadSearchResultsSort();

    // 3) Check if all recipes have cookingTime property
    const hasValidCookingTimes = model.state.search.results.every(
      result => result.cookingTime !== undefined
    );

    if (!hasValidCookingTimes) {
      throw new Error('Some recipes have missing or undefined cooking times.');
    }

    // 4) Sort the search results by cooking_time
    model.state.search.results.sort((a, b) => a.cookingTime - b.cookingTime);

    // 5) Render results
    resultsView.render(model.getSearchResultsPage());

    // 6) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlShoppingCart = function () {
  try {
    // Render recipe
    shoppingCartView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
  }
};

const init = function () {
  resultsView._addHandlerSort(controlSort);
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  recipeView.addHandlerCartClick(controlShoppingCart);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
