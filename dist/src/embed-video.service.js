"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var platform_browser_1 = require("@angular/platform-browser");
require("rxjs/add/operator/toPromise");
require("rxjs/add/operator/map");
var EmbedVideoService = /** @class */ (function () {
    function EmbedVideoService(http, sanitizer) {
        this.http = http;
        this.sanitizer = sanitizer;
        this.validYouTubeOptions = [
            'default',
            'mqdefault',
            'hqdefault',
            'sddefault',
            'maxresdefault'
        ];
        this.validVimeoOptions = [
            'thumbnail_small',
            'thumbnail_medium',
            'thumbnail_large'
        ];
        this.validDailyMotionOptions = [
            'thumbnail_60_url',
            'thumbnail_120_url',
            'thumbnail_180_url',
            'thumbnail_240_url',
            'thumbnail_360_url',
            'thumbnail_480_url',
            'thumbnail_720_url',
            'thumbnail_1080_url'
        ];
    }
    EmbedVideoService.prototype.embed = function (url, options) {
        var id;
        url = new URL(url);
        id = this.detectYoutube(url);
        if (id) {
            return this.embed_youtube(id, options);
        }
        id = this.detectVimeo(url);
        if (id) {
            return this.embed_vimeo(id, options);
        }
        id = this.detectDailymotion(url);
        if (id) {
            return this.embed_dailymotion(id, options);
        }
    };
    EmbedVideoService.prototype.embed_youtube = function (id, options) {
        options = this.parseOptions(options);
        var queryString;
        if (options && options.hasOwnProperty('query')) {
            queryString = '?' + this.serializeQuery(options.query);
        }
        return this.sanitize_iframe('<iframe src="https://www.youtube.com/embed/'
            + id + options.query + '"' + options.attr
            + ' id="embededvideo" frameborder="0" allowfullscreen></iframe>');
    };
    EmbedVideoService.prototype.embed_vimeo = function (id, options) {
        options = this.parseOptions(options);
        return this.sanitize_iframe('<iframe src="https://player.vimeo.com/video/'
            + id + options.query + options.hash + '"' + options.attr
            + ' id="embededvideo" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
    };
    EmbedVideoService.prototype.embed_dailymotion = function (id, options) {
        options = this.parseOptions(options);
        var queryString;
        if (options && options.hasOwnProperty('query')) {
            queryString = '?' + this.serializeQuery(options.query);
        }
        return this.sanitize_iframe('<iframe src="https://www.dailymotion.com/embed/video/'
            + id + options.query + '"' + options.attr
            + ' id="embededvideo" frameborder="0" allowfullscreen></iframe>');
    };
    EmbedVideoService.prototype.embed_image = function (url, options) {
        var id;
        url = new URL(url);
        id = this.detectYoutube(url);
        if (id) {
            return this.embed_youtube_image(id, options);
        }
        id = this.detectVimeo(url);
        if (id) {
            return this.embed_vimeo_image(id, options);
        }
        id = this.detectDailymotion(url);
        if (id) {
            return this.embed_dailymotion_image(id, options);
        }
    };
    EmbedVideoService.prototype.embed_youtube_image = function (id, options) {
        if (typeof options === 'function') {
            options = {};
        }
        options = options || {};
        options.image = this.validYouTubeOptions.indexOf(options.image) > 0 ? options.image : 'default';
        var src = 'https://img.youtube.com/vi/' + id + '/' + options.image + '.jpg';
        var result = {
            link: src,
            html: '<img src="' + src + '"/>'
        };
        return new Promise(function (resolve, reject) {
            resolve(result);
        });
    };
    EmbedVideoService.prototype.embed_vimeo_image = function (id, options) {
        if (typeof options === 'function') {
            options = {};
        }
        options = options || {};
        options.image = this.validVimeoOptions.indexOf(options.image) >= 0 ? options.image : 'thumbnail_large';
        return this.http.get('https://vimeo.com/api/v2/video/' + id + '.json')
            .map(function (res) {
            return {
                'link': res.json()[0][options.image],
                'html': '<img src="' + res.json()[0][options.image] + '"/>'
            };
        })
            .toPromise()
            .catch(function (error) { return console.log(error); });
    };
    EmbedVideoService.prototype.embed_dailymotion_image = function (id, options) {
        if (typeof options === 'function') {
            options = {};
        }
        options = options || {};
        options.image = this.validDailyMotionOptions.indexOf(options.image) >= 0 ? options.image : 'thumbnail_480_url';
        return this.http.get('https://api.dailymotion.com/video/' + id + '?fields=' + options.image)
            .map(function (res) {
            return {
                'link': res.json()[options.image],
                'html': '<img src="' + res.json()[options.image] + '"/>'
            };
        })
            .toPromise()
            .catch(function (error) { return console.log(error); });
    };
    EmbedVideoService.prototype.parseOptions = function (options) {
        var hashString = '', queryString = '', attributes = '';
        if (options && options.hasOwnProperty('hash')) {
            hashString = '#' + options.hash;
        }
        if (options && options.hasOwnProperty('query')) {
            queryString = '?' + this.serializeQuery(options.query);
        }
        if (options && options.hasOwnProperty('attr')) {
            var temp_1 = [];
            Object.keys(options.attr).forEach(function (key) {
                temp_1.push(key + '="' + (options.attr[key]) + '"');
            });
            attributes = ' ' + temp_1.join(' ');
        }
        return {
            hash: hashString,
            query: queryString,
            attr: attributes
        };
    };
    EmbedVideoService.prototype.serializeQuery = function (query) {
        var queryString = [];
        for (var p in query) {
            if (query.hasOwnProperty(p)) {
                queryString.push(encodeURIComponent(p) + '=' + encodeURIComponent(query[p]));
            }
        }
        return queryString.join('&');
    };
    EmbedVideoService.prototype.sanitize_iframe = function (iframe) {
        return this.sanitizer.bypassSecurityTrustHtml(iframe);
    };
    EmbedVideoService.prototype.detectVimeo = function (url) {
        return (url.hostname === 'vimeo.com') ? url.pathname.split('/')[1] : null;
    };
    EmbedVideoService.prototype.detectYoutube = function (url) {
        if (url.hostname.indexOf('youtube.com') > -1) {
            return url.search.split('=')[1];
        }
        if (url.hostname === 'youtu.be') {
            return url.pathname.split('/')[1];
        }
        return '';
    };
    EmbedVideoService.prototype.detectDailymotion = function (url) {
        if (url.hostname.indexOf('dailymotion.com') > -1) {
            return url.pathname.split('/')[2].split('_')[0];
        }
        if (url.hostname === 'dai.ly') {
            return url.pathname.split('/')[1];
        }
        return '';
    };
    EmbedVideoService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            platform_browser_1.DomSanitizer])
    ], EmbedVideoService);
    return EmbedVideoService;
}());
exports.EmbedVideoService = EmbedVideoService;
//# sourceMappingURL=embed-video.service.js.map