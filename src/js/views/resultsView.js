import PreviewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends PreviewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again!';
  _sortBtn = document.querySelector('.nav__btn--sort');

  // _addHandlerSort(handler) {
  //   this._sortBtn.addEventListener('click', function (e) {
  //     handler();
  //   });
  // }
}

export default new ResultsView();
