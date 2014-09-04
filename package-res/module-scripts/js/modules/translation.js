/*
 * Copyright 2002 - 2014 Webdetails, a Pentaho company.  All rights reserved.
 *
 * This software was developed by Webdetails and is provided under the terms
 * of the Mozilla Public License, Version 2.0, or any later version. You may not use
 * this file except in compliance with the license. If you need a copy of the license,
 * please go to  http://mozilla.org/MPL/2.0/. The Initial Developer is Webdetails.
 *
 * Software distributed under the Mozilla Public License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
 * the license for the specific language governing your rights and limitations.
 */

'use strict';

define([
    'common-ui/angular',
    './propertiesToJson'
], function(angular, propsToJsonParser) {
    
    // Based on pascalprecht.translate from
    // https://github.com/angular-translate/angular-translate/blob/master/src/service/loader-static-files.js
    var module = angular.module('pentaho.common-ui.translate', []);
    
    /**
     * @ngdoc object
     * @name pentaho.common-ui.translation.$translatePropertiesFilesLoader
     * @requires $q
     * @requires $http
     *
     * @description
     * Creates a loading function for a typical static file url pattern:
     * "lang-en_US.json", "lang-de_DE.json", etc. Using this builder,
     * the response of these urls must be a properties file.
     * 
     * To use this loader <tt>with pascalprecht.translate</tt>'s angular module, 
     * require its $translateProvider and do:
     * @example
     * <pre>
     * $translateProvider.useLoader('$translatePropertiesFilesLoader', {
     *    prefix: 'i18n/messages-',
     *    suffix: '.properties'
     * });
     * </pre>
     * 
     * @param {object} options Options object, which gets prefix, suffix.
     * @param {string} options.prefix The prefix to use to build the properties file names.
     * This will tipically consist of a directory location and file prefix.
     * @param {string} [options.suffix='.properties'] The suffix to use to build 
     * the properties file names.
     */
    module.factory('$translatePropertiesFilesLoader', ['$http', function ($http) {

        return function(options) {
            if(options && options.suffix == null) { options.suffix = '.properties'; }

            if(!options || (!angular.isString(options.prefix) || !angular.isString(options.suffix))) {
                throw new Error("Couldn't load properties files, no prefix or suffix specified!");
            }

            function onSuccess(resp) {
                return propsToJsonParser(resp.data);
            }

            function onError(resp) {
                return options.key;
            }

            var url = [
                options.prefix,
                options.key,
                options.suffix
            ].join('');

            return $http.get(url)
                .then(onSuccess, onError);
            };
        }
    ]);

    return module;
});