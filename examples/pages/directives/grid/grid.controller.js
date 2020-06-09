(function () {
	angular.module("test").controller("GridController", GridController);

	GridController.$inject = ["ObjectService", "$http"];
	function GridController(ObjectService, $http) {
		var example = this;

		example.test = new ObjectService();

		example.test.grid2HeaderVisibility = true;
		example.test.toggleHeader = toggleHeader;
		example.test.grid = {
			bindingObject: example.test,
			initLoad: true,
			columns: [
				{ name: "id", displayName: "شناسه" },
				{ name: "name", displayName: "نام" },
				{ name: "email", displayName: "ایمیل" },
				{ name: "phone", displayName: "تلفن" }
			],
			readOnly: function () {
				return true;
			},
			displayNameFormat: ["Name"],
			globalSearch: true,
			listService: universities
		};
		example.test.grid2 = {
			items: [
				{
					testName: "John Doe",
					testDate: new Date(),
					testMinutes: 290,
					testMoney: 290500,
					user: { full: { name: "wow1" } }
				}
			],
			checkHeaderVisibility: () => {
				return example.test.grid2HeaderVisibility;
			},
			bindingObject: example.test,
			columns: [
				{ name: "user.full.name", displayName: "چند قسمتی" },
				{ name: "testName", displayName: "نام" },
				{ name: "testMoney", displayName: "مبلغ", type: "money" },
				{ name: "testDate", displayName: "تاریخ", type: "date" },
				{ name: "testDate", displayName: "ساعت", type: "time" },
				{
					name: "testMinutes",
					displayName: "ساعت 2",
					type: "time",
					callback: function (input) {
						return "ساعت " + input;
					}
				}
			],
			displayNameFormat: data => {
				return `کاربر به نام ${data.testName}`;
			},
			rowClass: () => {
				return "text-danger";
			},
			globalSearch: true
		};

		function universities(options) {
			return $http({
				method: "GET",
				url: "https://jsonplaceholder.typicode.com/users",
				data: options
			}).then(function (result) {
				return result.data;
			});
		}
		function toggleHeader() {
			example.test.grid2HeaderVisibility = !example.test.grid2HeaderVisibility;
		}
	}
})();
