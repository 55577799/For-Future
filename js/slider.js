"use strict";

/**
 * @property {Object} settings Объект с настройками галереи.
 * @property {string} settings.previewSelector Селектор обертки для миниатюр галереи.
 * @property {string} settings.openedImageWrapperClass Класс для обертки открытой картинки.
 * @property {string} settings.openedImageClass Класс открытой картинки.
 * @property {string} settings.openedImageScreenClass Класс для ширмы открытой картинки.
 * @property {string} settings.openedImageCloseBtnClass Класс для картинки кнопки закрыть.
 * @property {string} settings.openedImageCloseBtnSrc Путь до картинки кнопки открыть.
 * @property {string} settings.imageNotFoundSrc Путь до картинки заглушки.
 * @property {string} settings.openedImageNextBtnSrc Путь до картинки стрелка вправо.
 * @property {string} settings.openedImageBackBtnSrc Путь до картинки стрелка влево.
 * @property {string} settings.openedImageNextBtnClass Класс картинки стрелка вправо.
 * @property {string} settings.openedImageBackBtnClass Класс картинки стрелка влево.
 */
const gallery = {
	openedImageEl: null, // здесь будем хранить элемент миниатюры
    
	settings: {
        previewSelector: '.mySuperGallery',
        openedImageWrapperClass: 'galleryWrapper',
        openedImageClass: 'galleryWrapper__image',
        openedImageScreenClass: 'galleryWrapper__screen',
        openedImageCloseBtnClass: 'galleryWrapper__close',
        openedImageNextBtnClass: 'galleryWrapper__next',
        openedImageBackBtnClass: 'galleryWrapper__back',
        openedImageCloseBtnSrc: 'images/gallery/close.png',
        openedImageNextBtnSrc: 'images/gallery/next.jpg',
        openedImageBackBtnSrc: 'images/gallery/back.jpg',
		imageNotFoundSrc: 'images/min/5.jpg',
        
    },
    /**
     * Инициализирует галерею, ставит обработчик события.
     * @param {Object} userSettings Объект настроек для галереи.
     */
    init(userSettings = {}) {
        // Записываем настройки, которые передал пользователь в наши настройки.
        Object.assign(this.settings, userSettings);

        // Находим элемент, где будут превью картинок и ставим обработчик на этот элемент,
        // при клике на этот элемент вызовем функцию containerClickHandler в нашем объекте
        // gallery и передадим туда событие MouseEvent, которое случилось.
        document
            .querySelector(this.settings.previewSelector)
            .addEventListener('click', event => this.containerClickHandler(event));
    },

    /**
     * Обработчик события клика для открытия картинки.
     * @param {MouseEvent} event Событие клики мышью.
     * @param {HTMLElement} event.target Целевой объект, куда был произведен клик.
     */
    containerClickHandler(event) {
        // Если целевой тег не был картинкой, то ничего не делаем, просто завершаем функцию.
        if (event.target.tagName !== 'IMG') {
            return;
        }
		
		this.openedImageEl = event.target; //Кликаем сам элемент по картинке
        // Открываем картинку с полученным из целевого тега (data-full_image_url атрибут).
        this.openImage(event.target.dataset.full_image_url);
    },

    /**
     * Открывает картинку.
     * @param {string} src Ссылка на картинку, которую надо открыть.
     */
    openImage(src) {
        // Получаем контейнер для открытой картинки, в нем находим тег img и ставим ему нужный src.
        const openedImageEl = this.getScreenContainer().querySelector(`.${this.settings.openedImageClass}`);
		const img = new Image();
		img.onload = () => openedImageEl.src = src;
		img.onerror = () => openedImageEl.src = this.settings.imageNotFoundSrc;
		img.src = src;
		 },
		 
		/*const img = this.getScreenContainer().querySelector(`.${this.settings.openedImageClass}`);
        img.src = src;
        img.onerror = () => img.src = this.settings.openedImageStubClass;

        сохраняем открытую миниатюру
        this.openedImageEl = img;*/
   

    /**
     * Возвращает контейнер для открытой картинки, либо создает такой контейнер, если его еще нет.
     * @returns {Element}
     */
    getScreenContainer() {
        // Получаем контейнер для открытой картинки.
        const galleryWrapperElement = document.querySelector(`.${this.settings.openedImageWrapperClass}`);
        // Если контейнер для открытой картинки существует - возвращаем его.
        if (galleryWrapperElement) {
            return galleryWrapperElement;
        }

        // Возвращаем полученный из метода createScreenContainer контейнер.
        return this.createScreenContainer();
    },

    /**
     * Создает контейнер для открытой картинки.
     * @returns {HTMLElement}
     */
    createScreenContainer() {
        // Создаем сам контейнер-обертку и ставим ему класс.
        const galleryWrapperElement = document.createElement('div');
        galleryWrapperElement.classList.add(this.settings.openedImageWrapperClass);


        const nextBtn = new Image();
        nextBtn.classList.add(this.settings.openedImageNextBtnClass);
        nextBtn.src = this.settings.openedImageNextBtnSrc;
        galleryWrapperElement.appendChild(nextBtn);
		
		nextBtn.addEventListener('click', () => {
			this.openedImageEl = this.getNextImage();
			this.openImage(this.openedImageEl.dataset.full_image_url);
		});

        const backBtn = new Image();
        backBtn.classList.add(this.settings.openedImageBackBtnClass);
        backBtn.src = this.settings.openedImageBackBtnSrc;
        galleryWrapperElement.appendChild(backBtn);
 
        backBtn.addEventListener('click', () => {
			this.openedImageEl = this.getPrevImage();
			this.openImage(this.openedImageEl.dataset.full_image_url);
		});

        // Создаем контейнер занавеса, ставим ему класс и добавляем в контейнер-обертку.
        const galleryScreenElement = document.createElement('div');
        galleryScreenElement.classList.add(this.settings.openedImageScreenClass);
        galleryWrapperElement.appendChild(galleryScreenElement);

        // Создаем картинку для кнопки закрыть, ставим класс, src и добавляем ее в контейнер-обертку.
        const closeImageElement = new Image();
        closeImageElement.classList.add(this.settings.openedImageCloseBtnClass);
        closeImageElement.src = this.settings.openedImageCloseBtnSrc;
        closeImageElement.addEventListener('click', () => this.close());
        galleryWrapperElement.appendChild(closeImageElement);

        // Создаем картинку, которую хотим открыть, ставим класс и добавляем ее в контейнер-обертку.
        const image = new Image();
        image.classList.add(this.settings.openedImageClass);
        galleryWrapperElement.appendChild(image);


        // Добавляем контейнер-обертку в тег body.
        document.body.appendChild(galleryWrapperElement);

        // Возвращаем добавленный в body элемент, наш контейнер-обертку.
        return galleryWrapperElement;
    },
       //Возвращает следующий элемент, картинку, от открытой или первую картинку в контейнере
	   // Если текущая открытая картинка последняя 
    
	 getNextImage() {
        const nextSibling = this.openedImageEl.nextElementSibling;
		return nextSibling ? nextSibling : this.openedImageEl.parentNode.firstElementChild;
    },
	
	
	// Возвращает предыдущий элемент картинку, от открытой, или последнюю картинку в контейнере.
	   // Если текущая открытая картинка первая
	   
	getPrevImage() {
        const prevSibling = this.openedImageEl.previousElementSibling;
		return prevSibling ? prevSibling : this.openedImageEl.parentNode.lastElementChild;
    },
    



    /**
     * Закрывает (удаляет) контейнер для открытой картинки.
     */
    close() {
        document.querySelector(`.${this.settings.openedImageWrapperClass}`).remove();
    }
};

// Инициализируем нашу галерею при загрузке страницы.
window.onload = () => gallery.init({previewSelector: '.galleryPreviewsContainer'});