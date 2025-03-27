angular.module('page', ['blimpKit', 'platformView'])
	.controller('PageController', function ($scope, ViewParameters) {
		const Dialogs = new DialogHub();
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.entity = params.entity ?? {};
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
		}

		$scope.filter = () => {
			let entity = $scope.entity;
			const filter = {
				$filter: {
					equals: {
					},
					notEquals: {
					},
					contains: {
					},
					greaterThan: {
					},
					greaterThanOrEqual: {
					},
					lessThan: {
					},
					lessThanOrEqual: {
					}
				},
			};
			if (entity.Id !== undefined) {
				filter.$filter.equals.Id = entity.Id;
			}
			if (entity.Type) {
				filter.$filter.contains.Type = entity.Type;
			}
			if (entity.Prefix) {
				filter.$filter.contains.Prefix = entity.Prefix;
			}
			if (entity.Length !== undefined) {
				filter.$filter.equals.Length = entity.Length;
			}
			if (entity.Value !== undefined) {
				filter.$filter.equals.Value = entity.Value;
			}
			Dialogs.postMessage({ topic: 'codbex-number-generator.Numbers.Number.entitySearch', data: {
				entity: entity,
				filter: filter
			}});
			$scope.cancel();
		};

		$scope.resetFilter = () => {
			$scope.entity = {};
			$scope.filter();
		};

		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: 'Description',
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			Dialogs.closeWindow({ id: 'Number-filter' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};

	});