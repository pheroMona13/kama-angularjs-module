displayMoney.$inject = ['$filter'];
export default function displayMoney($filter) {
	return (input) => {
		return $filter('number')(input);
	}
}