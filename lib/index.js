'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function randomString(length) {
  var result = '';
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (var i = length; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }return result;
}

var getY = function getY(elem) {
  return elem.getBoundingClientRect().top;
  var location = 0;
  if (elem.offsetParent) {
    do {
      location += elem.offsetTop;
      location -= elem.scrollTop;
      elem = elem.offsetParent;
    } while (elem);
  }
  return location >= 0 ? location : 0;
};

var getX = function getX(elem) {
  return elem.getBoundingClientRect().left;
  var location = 0;
  if (elem.offsetParent) {
    do {
      location += elem.offsetLeft;
      elem = elem.offsetParent;
    } while (elem);
  }
  return location >= 0 ? location : 0;
};

var position = function position(key) {
  var node = document.querySelector('[data-move-key="' + key + '"]');

  return {
    x: getX(node),
    y: getY(node)
  };
};

function inject(key, styles) {
  var node = document.getElementById('move-' + key) || document.createElement('style');
  node.setAttribute('id', 'move-' + key);
  node.innerHTML = styles;
  document.head.appendChild(node);

  return node;
}

window.movtState = {};

var Movement = (function () {
  function Movement() {
    _classCallCheck(this, Movement);
  }

  _createClass(Movement, [{
    key: 'updateAll',
    value: function updateAll() {
      Object.keys(movtState).forEach(function (key) {
        console.log('update', position(key));

        Object.assign(window.movtState[key], _extends({}, position(key)));
      });
    }

    // update(key, node) {
    //   let prev = window.movtState[key];
    //   let pos = position(key);

    //   if (prev
    //     && prev.x == pos.x
    //     && prev.y == pos.y) {
    //     return this;
    //   }

    //   return this.move(key, node);
    // }

  }, {
    key: 'move',
    value: function move(key) {
      var node = document.querySelector('[data-move-key="' + key + '"]');

      if (!node) return;

      var prev = window.movtState[key];
      var rand = randomString(4);
      var pos = position(key);

      if (!prev) {
        window.movtState[key] = _extends({
          node: node
        }, pos);

        return false;
      }

      inject(key, '\n      @keyframes ' + rand + ' {\n        from {\n          transform:\n            translateX(' + (-getX(node) + prev.x) + 'px)\n            translateY(' + (-getY(node) + prev.y) + 'px)\n        }\n      }\n\n      :root:not([data-move-active="false"]) [data-move-key="' + key + '"] {\n        animation: ' + rand + ' 0.3s ease-in-out none;\n      }\n    ');

      return rand;
    }
  }, {
    key: 'moveAll',
    value: function moveAll() {
      var _this = this;

      Object.keys(movtState).forEach(function (key) {
        _this.move(key);
      });
    }
  }]);

  return Movement;
})();

function move(fn) {
  return function () {
    movt.updateAll();

    document.querySelector('html').setAttribute('data-move-active', false);

    var result = fn();

    movt.moveAll();
    document.querySelector('html').setAttribute('data-move-active', true);

    return result;
  };
}

window.movt = new Movement();