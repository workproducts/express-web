var _ = require('underscore');
var s = require('underscore.string');

var $ = module.exports = {};

var dirs = ['lib', 'helpers', 'views', 'plugins', 'controllers', 'services', 'managers', 'orchestrators'];

var process = function(moduleName, list) {
    var module = $[moduleName];

    _.each(list, function(item) {
        //console.log('module item.name=', item.name);

        item.name = item.name.split('../../'+moduleName+'/')[1];

        if (item.name.indexOf('express') !== -1) {
            return;
        }

        var isIndex = item.name.indexOf('index.js') !== -1;

        item.name = item.name.split('.js')[0];

        var splits = item.name.split('/');
        if (splits.length > 1) {
            var ref = module;
            var prevSplit = null;
            var prevRef = null;
            _.each(splits, function(split, index) {
                split = s.camelize(split);
                if (index === splits.length - 1) {
                    ref[split] = item.module;
                    if (isIndex) {
                        //console.log('extend prevSplit = ', prevSplit);
                        _.extend(prevRef[prevSplit], item.module);
                    }
                } else {
                    var localRef = ref;
                    ref = ref[split] || (ref[split] = function() {
                            return _.isFunction(localRef[split].index) && localRef[split].index.apply(this,arguments);
                        });
                }
                prevSplit = split;
                prevRef = ref;
            });
        } else {
            module[s.camelize(item.name)] = item.module;
            if (isIndex) {
                //console.log('extend module = ', module);
                _.extend(module, item.module);
            }
        }
    });
};

$.load = function(_$) {
    console.log('');
    console.log('LOADING', __dirname);

    if (_$) {
        _.extend($, _$);
    } else {
        _.each(dirs, function(dir) {
            $[dir] = function() {
                return _.isFunction($[dir].index) && $[dir].index.apply(this,arguments);
            };
        });
    }

    console.log('loading lib');
    process('lib', require('../../lib/**/*.js', {mode: 'list', resolve:['path','strip-ext'], options: {ignore:'../../lib/**/index.js'} }));
    process('lib', require('../../lib/**/index.js', {mode: 'list', resolve:['path']}));

    console.log('loading helpers');
    process('helpers', require('../../helpers/**/*.js', {mode: 'list', resolve:['path','strip-ext'], options: {ignore:'../../helpers/**/index.js'} }));
    process('helpers', require('../../helpers/**/index.js', {mode: 'list', resolve:['path']}));

    console.log('loading views');
    process('views', require('../../views/**/*{.ejs,.js}', {mode: 'list', resolve:['path','strip-ext'], options: {ignore:'../../views/**/index.js'} }));
    process('views', require('../../views/**/index.js', {mode: 'list', resolve:['path']}));

    console.log('loading plugins');
    process('plugins', require('../../plugins/**/*.js', {mode: 'list', resolve:['path','strip-ext'], options: {ignore:'../../plugins/**/index.js'} }));
    process('plugins', require('../../plugins/**/index.js', {mode: 'list', resolve:['path']}));

    console.log('loading controllers');
    process('controllers', require('../../controllers/**/*.js', {mode: 'list', resolve:['path','strip-ext'], options: {ignore:'../../controllers/**/index.js'} }));
    process('controllers', require('../../controllers/**/index.js', {mode: 'list', resolve:['path']}));

    console.log('loading services');
    process('services', require('../../services/**/*.js', {mode: 'list', resolve:['path','strip-ext'], options: {ignore:'../../services/**/index.js'} }));
    process('services', require('../../services/**/index.js', {mode: 'list', resolve:['path']}));

    console.log('loading managers');
    process('managers', require('../../managers/**/*.js', {mode: 'list', resolve:['path','strip-ext'], options: {ignore:'../../managers/**/index.js'} }));
    process('managers', require('../../managers/**/index.js', {mode: 'list', resolve:['path']}));

    console.log('loading orchestrators');
    process('orchestrators', require('../../orchestrators/**/*.js', {mode: 'list', resolve:['path','strip-ext'], options: {ignore:'../../orchestrators/**/index.js'} }));
    process('orchestrators', require('../../orchestrators/**/index.js', {mode: 'list', resolve:['path']}));

    console.log('LOADED');

    return $;
};