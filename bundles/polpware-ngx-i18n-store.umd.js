(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@polpware/fe-dependencies'), require('@polpware/fe-utilities'), require('@polpware/fe-data')) :
    typeof define === 'function' && define.amd ? define('@polpware/ngx-i18n-store', ['exports', '@angular/core', '@polpware/fe-dependencies', '@polpware/fe-utilities', '@polpware/fe-data'], factory) :
    (global = global || self, factory((global.polpware = global.polpware || {}, global.polpware['ngx-i18n-store'] = {}), global.ng.core, global.feDependencies, global.feUtilities, global.feData));
}(this, (function (exports, core, feDependencies, feUtilities, feData) { 'use strict';

    var _ = feDependencies.underscore;
    /**
     * Verify if the given lang is valid. If the given lang is not valid,
     * this function returns a default one.
     * @private
     * @function validate
     * @param {Object} options The avaliable lang options.
     * @param {String} lang The requested lang code.
     * @returns {String} Verified lang code.
     */
    function validate(options, code) {
        var lang = code || 'en-us';
        var entry = _.find(options, function (e) { return e.code.substring(0, 2) === lang.substring(0, 2); });
        if (entry) {
            lang = entry.code;
        }
        return lang;
    }
    var ResourceLoaderService = /** @class */ (function () {
        function ResourceLoaderService(ngZone) {
            var cache = new feData.SlidingExpirationCache(3 * 60, 5 * 60, ngZone);
            this._resourceLoader = new feData.ResourceLoader(cache);
        }
        Object.defineProperty(ResourceLoaderService.prototype, "resourceLoader", {
            get: function () {
                return this._resourceLoader;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Loads the dictionary for the given lang code.
         * @function loadPromise
         * @param {String} langCode The requested language code.
         * @param {String}[] filter The optional language code which we are not interested in.
         * @returns {Promise} The promise with the state of the loaded language dictionary.
         * @throws {Error}
         */
        ResourceLoaderService.prototype.loadPromise = function (langCode, filter) {
            var resourceLoader = this._resourceLoader;
            return resourceLoader.getPromise('lang.options', function (id) { return id; })
                .then(function (resolvedOptionsUrl) {
                return feData.loadJsonUriP(resolvedOptionsUrl);
            })
                .then(function (resolvedOptions) {
                return validate(resolvedOptions, langCode);
            })
                .then(function (resolvedLangCode) {
                if (resolvedLangCode === filter) {
                    throw new Error('Loading the current language: ' + resolvedLangCode);
                }
                return resolvedLangCode;
            })
                .then(function (filteredLangCode) {
                langCode = filteredLangCode;
                return resourceLoader.getPromise('lang.urlTmpl', function (id) { return id; });
            })
                .then(function (resolvedUrlTmpl) {
                return feUtilities.replace(resolvedUrlTmpl, { code: langCode });
            })
                .then(function (resolvedUrl) {
                return feData.loadJsonUriP(resolvedUrl);
            })
                .then(function (resolvedData) {
                feData.I18n.add(resolvedData.code, resolvedData.items);
                feData.I18n.recycleOthers(resolvedData.code);
                return resolvedData;
            });
        };
        /**
         * Load lang options
         * @function loadOptionPromise
         * @returns {Promise}
         */
        ResourceLoaderService.prototype.loadOptionPromise = function () {
            return this._resourceLoader.getPromise('lang.options', function (id) { return id; })
                .then(function (resolvedOptionsUrl) {
                return feData.loadJsonUriP(resolvedOptionsUrl);
            });
        };
        ResourceLoaderService.ɵfac = function ResourceLoaderService_Factory(t) { return new (t || ResourceLoaderService)(core.ɵɵinject(core.NgZone)); };
        ResourceLoaderService.ɵprov = core.ɵɵdefineInjectable({ token: ResourceLoaderService, factory: ResourceLoaderService.ɵfac });
        return ResourceLoaderService;
    }());
    /*@__PURE__*/ (function () { core.ɵsetClassMetadata(ResourceLoaderService, [{
            type: core.Injectable
        }], function () { return [{ type: core.NgZone }]; }, null); })();

    exports.ResourceLoaderService = ResourceLoaderService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=polpware-ngx-i18n-store.umd.js.map
