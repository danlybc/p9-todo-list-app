/*global NodeList */
/**
 * Helpers module for useful functions (selectors, handlers...)
 * @namespace helpers
 */
(function (window) {
  "use strict";

  /**
   * @memberof helpers
   * @param {string} selector query selector
   * @param {string} scope scope for the query, if not provided document is the scope
   * @return {node} first matching element node
   */
  window.qs = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  /**
   * @memberof helpers
   * @param {string} selector query selector
   * @param {string} scope scope for the query, if not provided document is the scope
   * @return {node} node list with all matching element nodes or an empty list if no matches found
   */
  window.qsa = function (selector, scope) {
    return (scope || document).querySelectorAll(selector);
  };

  /**
   * @memberof helpers
   * @param {string} target target for the event
   * @param {string} type type of the event
   * @param {function} callback callback called when event is fired
   * @param {bool} useCapture whether events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree
   */
  window.$on = function (target, type, callback, useCapture) {
    target.addEventListener(type, callback, !!useCapture);
  };

  /**
   * Attach a handler to event for all elements that match the selector,
   * now or in the future, based on a root element
   * @memberof helpers
   * @param {string} target target for the event
   * @param {string} selector selector for the query
   * @param {string} type type of the event
   * @param {function} callback callback called when event is fired
   * @param {string} handler handler attached to event
   */
  window.$delegate = function (target, selector, type, handler) {
    function dispatchEvent(event) {
      var targetElement = event.target;
      var potentialElements = window.qsa(selector, target);
      var hasMatch =
        Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

      if (hasMatch) {
        handler.call(targetElement, event);
      }
    }

    // https://developer.mozilla.org/en-US/docs/Web/Events/blur
    var useCapture = type === "blur" || type === "focus";

    window.$on(target, type, dispatchEvent, useCapture);
  };

  // Find the element's parent with the given tag name:
  // $parent(qs('a'), 'div');
  /**
   * Find the element's parent with the given tag name
   * ex: $parent(qs('a'), 'div')
   * @memberof helpers
   * @param {string} element child of the parent to find
   * @param {string} tagName tag of the parent element
   * @returns {node} node of the parent element
   */
  window.$parent = function (element, tagName) {
    if (!element.parentNode) {
      return;
    }
    if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
      return element.parentNode;
    }
    return window.$parent(element.parentNode, tagName);
  };

  // Allow for looping on nodes by chaining:
  // qsa('.foo').forEach(function () {})
  NodeList.prototype.forEach = Array.prototype.forEach;
})(window);
