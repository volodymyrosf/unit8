$(document).ready(function() {

	var userList = document.querySelector('#user-list');
    var search = document.querySelector('#search');
    
    /**
	 * @function
	 * @description Renders image list
	 * @param {array} data
	 */
    function initFancyBox () {
      return $(".fancybox").fancybox({
                openEffect: 'none',
                closeEffect: 'none',
                nextEffect: 'none',
                prevEffect: 'none',
                nextSpeed: 0,
                prevSpeed: 0,
                preload: 3,
                padding: 55
        });
    }


	// filter search
	search.addEventListener('keyup', function(event) {
		var searchString = search.value.toLowerCase();
		var filtered =  userService.data.filter(function(element) {
            var pattern = new RegExp(searchString);
            var workerName = element.name.first + " " + element.name.last;
			return pattern.test(workerName);
		});
		userList.innerHTML = '';
		filtered.map(function(element, index) {
            userService.renderUser(element, index);
            userService.splittedDate(element.dob.date);
            initFancyBox();
            userService.renderUserFancyBox(element, index);
        })
	});

	// init
	// renderImageList(imgData);

	var userService = (function() {
		 
        var userList = document.querySelector('#user-list');
        var fancyboxHidden = document.querySelector("#fancybox-hidden");

         /**
		 * @function
		 * @description Formats user date of birth
		 * @param {string} dob
		 */
		function splittedDate(dob) {
             var splittedDOB = dob.slice(0, 10)
             return splittedDOB;
		}

        /**
		 * @function
		 * @description Checks server response
		 * @param {object} response
		 */
		function checkStatus(response) {
			if (response.ok) {
				return Promise.resolve(response);
			} else {
				return Promise.reject(new Error(response.statusText));
			}
		}

		/**
		 * @function
		 * @description Renders image list
		 * @param {array} data
		 */
		function fetchData(url) {
			return fetch(url)
				.then(checkStatus)
				.then(res => res.json())
				.catch(error => console.log('Looks like there was a problem!', error));
        }

        /**
		 * @function
		 * @description Renders user info for FancyBox plugin provided by function fetchData
		 * @param {object} user
         * @param {number} arrIndex
		 */
        function renderUserFancyBox (user, arrIndex) {
            var birthday = splittedDate(user.dob.date);
            var html = `
            <div class="user__item text-center" id="page${arrIndex + 1}" rel="gallery">
                <div class="user__photo-wrapper">
                    <img src="${user.picture.thumbnail}" alt="user photo" class="user__photo">
                </div>
                <div class="user__helper">
                    <h2 class="user__name">${user.name.first} ${user.name.last}</h2>
                    <p class="user__email">${user.email}</p>
                    <p class="user__city">${user.location.city}</p>
                    <p class="user__phone">${user.phone}</p>
                    <p class="user__address">${user.location.state} ${user.location.street} ${user.location.postcode} </p>
                    <p class="user__birthday">${birthday}</p>
                     
                </div>
            </div>
            `;
            fancyboxHidden.insertAdjacentHTML('beforeEnd', html);
        }

		/**
		 * @function
		 * @description Renders user info provided by function fetchData
		 * @param {object} user
         * @param {number} arrIndex
		 */
		function renderUser(user, arrIndex) {

			var html = `
                <li class="user__item col-md-4">
                <a class="user__fancybox-link fancybox" href="#page${arrIndex + 1}" rel="gallery">
                <div class="user__wrapper">
                    <div class="user__photo-wrapper">
                        <img src="${user.picture.thumbnail}" alt="user photo" class="user__photo">
                    </div>
                    <div class="user__helper">
                        <h2 class="user__name">${user.name.first} ${user.name.last}</h2>
                        <p class="user__email">${user.email}</p>
                        <p class="user__city">${user.location.city}</p>
                    </div>
                </div>
                </a>
				</li>
            `;
			userList.insertAdjacentHTML('beforeEnd', html);
		}

		return {
			fetchData: fetchData,
            renderUser: renderUser,
            renderUserFancyBox: renderUserFancyBox,
            splittedDate: splittedDate
        };
        
	})();

	userService
		.fetchData('https://randomuser.me/api/?results=12&nat=us')
		.then(data => (userService.data = data.results))
		.then(() => {
			userService.data.map(function(element, index) {
                userService.renderUser(element, index);
                userService.splittedDate(element.dob.date);
                initFancyBox();
                userService.renderUserFancyBox(element, index);
            });
        });

});
