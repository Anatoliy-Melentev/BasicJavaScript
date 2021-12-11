const
  sum = document.getElementById('total-price'),
  table = document.querySelector('table#cart-list > tbody'),
  quantity = document.getElementById('quantity-icon'),
  products = document.getElementById('products');

  cartReload();

  products.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.offsetParent.classList.contains('product')) {
      const
        product = getProductData(e.target.offsetParent),
        products = addProductInList(product);

      writeProducts(products);
      cartReload();
    }
  })

  table.addEventListener('click', e => {
    e.preventDefault();

    if (e.target.classList.contains('close-btn')) {
      delProduct(e.target.dataset.id);
    }
  })

  function getProductData(productEl) {
    if (!productEl) {
      return false;
    }

    return {
      id: productEl.dataset.id,
      name: productEl.querySelector('.product__title').innerText,
      count: 1,
      price: +productEl.querySelector('.product__price').innerText.slice(1),
      img: productEl.querySelector('.product__img').getAttribute('src').split('/').pop(),
    };
  };

  function addProductInList(product) {
    let products = getProductsList(), index = false;

    if (products.id) {
      let obj = products;
      products = [];
      products.push(obj);
    }

    index = products.findIndex((item, i) => {
      return +item.id === +product.id
    });

    if (index + 1) {
      products[index].count++;
    } else {
      products.push(product);
    }

    return products;
  };

  function getProductsList() {
    const products = getCookie('products');

    return products ? JSON.parse(products) : [];
  };

  function writeProducts(products) {
    if (!products) {
      return;
    }

    setCookie('products', JSON.stringify(products));
  };

  function cartReload() {
    let products = getProductsList();

    [...table.children].forEach(el => el.remove());

    if (!products || products.length === 0 || !table) {
      setSum();
      return;
    } else {
      products.forEach(product => {
        table.appendChild(createCartRow(product));
      });
    }

    setSum();
  }

  function createCartRow(data) {
    const
      tdCls = 'card-menu__col',
      closeBtn = createEl('span', 'close-btn'),
      closeTd = createEl('td', tdCls),
      tr = createEl('tr', 'card-menu__row');

    closeBtn.style.color = 'red';
    closeBtn.setAttribute('data-id', data.id);
    closeTd.appendChild(closeBtn)
    tr.setAttribute('data-id', data.id);

    tr.appendChild(createEl('td', tdCls, data.name));
    tr.appendChild(createEl('td', tdCls, data.count));
    tr.appendChild(createEl('td', tdCls, data.price));
    tr.appendChild(createEl('td', tdCls, (data.price * data.count).toFixed(2)));
    tr.appendChild(closeTd);

    return tr;
  }

  function createEl(tag, className, item) {
    const el = document.createElement(tag);
    el.classList.add(className);

    if (item) {
      el.innerHTML = item;
    }

    return el;
  }

  function delProduct(id){
    const products = getProductsList();

    let index = products.findIndex((item, i) => {
      return +item.id === +id;
    });
    products.splice(index, 1);

    writeProducts([...products]);
    cartReload();
  }

  function setSum() {
    const products = getProductsList();

    sum.innerText = products.reduce((sum, product) => {
      return product.count * product.price + sum;
    }, 0).toFixed(2);

    quantity.innerText = products.reduce((sum, product) => {
      return product.count + sum;
    }, 0);
  }
