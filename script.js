var VERSION_RE = /\bv?[0-9]+\.[0-9]+\.[0-9]+\b/;

main();

function main () {
  var plusOneCount = 0,
      uselessCount = 0;

  var elts = document.querySelectorAll('.comment-body');

  for (var i = 0, ii = elts.length; i < ii; i++) {
    var elt = elts[i],
        greatGrandpaElt = elt.parentElement.parentElement.parentElement;

    // skip all of our own comments
    if (greatGrandpaElt.className.indexOf('owner-comment') > -1 || greatGrandpaElt.className.indexOf('preview-content') > -1) {
      continue;
    }
    if (plusOneComment(elt)) {
      greatGrandpaElt.parentElement.remove();
      plusOneCount += 1;
    } else if (uselessComment(elt)) {
      greatGrandpaElt.parentElement.remove();
      uselessCount += 1;
    }
  }

  // add info into meta bar in DOM
  var metaBarElt = document.querySelector('.gh-header-meta');
  if (uselessCount > 0) {
    var uselessCountElt = createMetaBarItem(uselessCount, 'octicon-comment-discussion');
    metaBarElt.insertBefore(uselessCountElt, metaBarElt.firstChild);
  }
  if (plusOneCount > 0) {
    var plusOneCountElt = createMetaBarItem(plusOneCount, 'octicon-plus', 'state-open');
    metaBarElt.insertBefore(plusOneCountElt, metaBarElt.firstChild);
  }
}



function createMetaBarItem (text, icon, className) {
  className = className || '';
  var countElt = document.createElement('div');
  countElt.innerHTML = '<div class="state ' + className + '"><span class="octicon ' + icon + '"></span> ' + text + '</div>';
  countElt.className = 'flex-table-item';
  return countElt;
}


/*
 * A "+1" comment is <=40 chars and has +1 or :+1:
 */
function plusOneComment (elt) {
  var text = elt.innerText;
  if (text.length > 40) return false;
  if (text.indexOf('+1') > -1) return true;
  if (elt.querySelector('img[title=":+1:"]')) return true;
  return false;
}


/*
 * useless comments:
 *   - are <100 chars
 *   - have no version numbers
 *   - have no links
 *   - have no code snippets
 */
function uselessComment (elt) {
  var text = elt.innerText;
  if (text.length > 100) return false;
  if (VERSION_RE.test(text)) return false;
  if (elt.querySelector('a')) return false;
  if (elt.querySelector('pre')) return false;
  if (elt.querySelector(':not(.emoji) img')) return false;
  return true;
}
