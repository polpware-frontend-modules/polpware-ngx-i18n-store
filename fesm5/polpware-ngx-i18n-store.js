import { ɵɵinject, NgZone, ɵɵdefineInjectable, ɵsetClassMetadata, Injectable } from '@angular/core';
import { underscore } from '@polpware/fe-dependencies';
import { replace } from '@polpware/fe-utilities';
import { SlidingExpirationCache, ResourceLoader, loadJsonUriP, I18n } from '@polpware/fe-data';

var _ = underscore;
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
        var cache = new SlidingExpirationCache(3 * 60, 5 * 60, ngZone);
        this._resourceLoader = new ResourceLoader(cache);
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
            return loadJsonUriP(resolvedOptionsUrl);
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
            return replace(resolvedUrlTmpl, { code: langCode });
        })
            .then(function (resolvedUrl) {
            return loadJsonUriP(resolvedUrl);
        })
            .then(function (resolvedData) {
            I18n.add(resolvedData.code, resolvedData.items);
            I18n.recycleOthers(resolvedData.code);
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
            return loadJsonUriP(resolvedOptionsUrl);
        });
    };
    ResourceLoaderService.ɵfac = function ResourceLoaderService_Factory(t) { return new (t || ResourceLoaderService)(ɵɵinject(NgZone)); };
    ResourceLoaderService.ɵprov = ɵɵdefineInjectable({ token: ResourceLoaderService, factory: ResourceLoaderService.ɵfac });
    return ResourceLoaderService;
}());
/*@__PURE__*/ (function () { ɵsetClassMetadata(ResourceLoaderService, [{
        type: Injectable
    }], function () { return [{ type: NgZone }]; }, null); })();

/*
 * Public API Surface of ngx-i18n-store
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ResourceLoaderService };
//# sourceMappingURL=polpware-ngx-i18n-store.js.map
