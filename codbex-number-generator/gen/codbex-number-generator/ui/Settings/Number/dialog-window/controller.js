angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-number-generator/gen/codbex-number-generator/api/Settings/NumberController.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'Number successfully created';
		let propertySuccessfullyUpdated = 'Number successfully updated';

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'Number Details',
			create: 'Create Number',
			update: 'Update Number'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-number-generator:codbex-number-generator-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-number-generator:codbex-number-generator-model.defaults.formHeadSelect', { name: '$t(codbex-number-generator:codbex-number-generator-model.t.NUMBER)' });
			$scope.formHeaders.create = LocaleService.t('codbex-number-generator:codbex-number-generator-model.defaults.formHeadCreate', { name: '$t(codbex-number-generator:codbex-number-generator-model.t.NUMBER)' });
			$scope.formHeaders.update = LocaleService.t('codbex-number-generator:codbex-number-generator-model.defaults.formHeadUpdate', { name: '$t(codbex-number-generator:codbex-number-generator-model.t.NUMBER)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-number-generator:codbex-number-generator-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-number-generator:codbex-number-generator-model.t.NUMBER)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-number-generator:codbex-number-generator-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-number-generator:codbex-number-generator-model.t.NUMBER)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-number-generator.Settings.Number.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-number-generator:codbex-number-generator-model.t.NUMBER'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-number-generator:codbex-number-generator-model.messages.error.unableToCreate', { name: '$t(codbex-number-generator:codbex-number-generator-model.t.NUMBER)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-number-generator.Settings.Number.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-number-generator:codbex-number-generator-model.t.NUMBER'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-number-generator:codbex-number-generator-model.messages.error.unableToUpdate', { name: '$t(codbex-number-generator:codbex-number-generator-model.t.NUMBER)', message: message });
				});
				console.error('EntityService:', error);
			});
		};


		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'Number-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});