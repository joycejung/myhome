let cascadeFlowModule = (function () {
    let columns = Array.from(document.querySelectorAll('.column')),
        _data = [];

    let queryData = function queryData() {
        let xhr = new XMLHttpRequest;
        xhr.open('GET', './json/data.json', false);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                _data = JSON.parse(xhr.responseText);
            }
        };
        xhr.send(null);


    };

    let bindHTMl = function bindHTMl() {
        _data = _data.map(item => {
            let h = item.height,
                w = item.width;
            h = h / (w / 230);
            item.width = 230;
            item.height = h;
            return item;
        });

        for (let i = 0; i < _data.length; i += 3) {
            let groups = _data.slice(i, i + 3);
            groups.sort((a, b) => {
                return a.height - b.height;
            });
            columns.sort((a, b) => {
                return b.offsetHeight - a.offsetHeight;
            });
            let card = document.createElement('div');
            card.className = 'card';
            groups.forEach((item, index) => {
                let {
                    pic,
                    height,
                    title,
                    link
                } = item;
                card.innerHTML = `
                <a href="${link}">
                        <div class="lazyImage" style= "height:${height}px">
                            <img src="" alt=""  data-img="${pic}">
                        </div>
                        <p>${title}</p>
                    </a>`;

                columns[index].appendChild(card);
            });

        }

    };

    let lazyFunc = function lazyFunc() {
        let lazyImageBoxs = document.querySelectorAll(".lazyImageBox");
        [].forEach.call(lazyImageBoxs, lazyImageBox => {
            let load = lazyImageBox.getAttribute("isLoad");
            if (isLoad == ture) return;
            let B = utils.offsetHeight(lazyImageBox).top + lazyImageBox.offsetHeight / 2;
            let A = document.documentElement.clientHeight + document.documentElement.scrollTop;
            if (B <= A) {
                lazyImag(lazyImageBox);
            }
        });
    };


    let lazyImag = function lazyImag(lazyImageBox) {
        let img = document.querySelector('img'),
            dataImage = img.getAttribute('data-image'),
            tempImage = new Image;
        tempImage.src = dataImage;
        tempImage.onload = () => {
            img.src = dataImage;
            utils.css(img, 'opacity', 1);


        };
        img.removeAttribute('data-image');
        tempImage = null;
        lazyImageBox.setAttribute('isLoad', 'true');



    };

    let isRender;
    let loadMoreData = function loadMoreData() {
        let HTML = document.documentElement;
        if (HTML.clientHeight + HTML.clientHeight / 2 + HTML.scrollTop >= HTML.scrollHeight) {
            if (isRender) return;
            isRender = true;
            queryData();
            bindHTMl();
            lazyFunc();
            isRender = false;

        }
    };

    return {
        init() {
            queryData();
            bindHTMl();
            lazyFunc();
            window.onscroll = function () {
                lazyFunc();
                loadMoreData();
            };
        }
    }
    })();
    cascadeFlowModule.init();