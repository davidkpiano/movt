function randomString(length) {
  let result = '';
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}

const getY = ( elem ) => {
  // return elem.getBoundingClientRect().top;
  let location = 0;
  if (elem.offsetParent) {
    do {
      location += elem.offsetTop;
      location -= elem.scrollTop;
      elem = elem.offsetParent;
    } while (elem);
  }
  return location >= 0 ? location : 0;
};

const getX = ( elem ) => {
  // return elem.getBoundingClientRect().left;
  let location = 0;
  if (elem.offsetParent) {
    do {
      location += elem.offsetLeft;
      elem = elem.offsetParent;
    } while (elem);
  }
  return location >= 0 ? location : 0;
};

const position = ( key ) => {
  const node = document.querySelector(`[data-move-key="${key}"]`);

  return {
    x: getX(node),
    y: getY(node)
  }
}

function inject(key, styles) {
  const node = document.getElementById(`move-${key}`)
    || document.createElement('style');
  node.setAttribute('id', `move-${key}`);
  node.innerHTML = styles;
  document.head.appendChild(node);

  return node
}

window.movtState = {};

class Movement {
  updateAll() {
    Object.keys(movtState).forEach((key) => {
      console.log('update',position(key));

      Object.assign(window.movtState[key], {
        ...position(key)
      });
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

  move(key) {
    const node = document.querySelector(`[data-move-key="${key}"]`);
    
    const prev = window.movtState[key];
    const rand = randomString(4);
    const pos = position(key);

      console.log('\tbefore move', {...movtState[key]})
      console.log('move', position(key));


    if (!prev) {
      window.movtState[key] = {
        node,
        ...pos
      };

      return false;
    }

    inject(key, `
      @keyframes ${rand} {
        from {
          transform:
            translateX(${-getX(node) + prev.x}px)
            translateY(${-getY(node) + prev.y}px)
        }
      }

      [data-move-key="${key}"] {
        animation: ${rand} 0.3s ease-in-out none;
      }
    `);

    // Object.assign(window.movtState[key], {
    //   node,
    //   ...pos
    // });

    return rand;
  }

  moveAll() {
    Object.keys(movtState).forEach((key) => {
      this.move(key);
    });
  }
}

function move(fn) {
  return () => {  
    movt.updateAll();

    const result = fn();

    movt.moveAll();

    return result;
  }
}

window.movt = new Movement();
