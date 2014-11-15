/**
 * Created by Wesley Nascimento on 13/11/2014.
 */
/// <reference path="jquery.d.ts"/>
var game_data = game_data || {};
/**
 * Manipulação da memoria cache do navegador
 * @class storage
 */
var LocalStorage = (function () {
    function LocalStorage() {
        this.isNotUserData = false;
    }
    /**
     * @param {boolean} isNotUserData são configurações
     */
    LocalStorage.prototype.setNotUserData = function (isNotUserData) {
        this.isNotUserData = isNotUserData == null ? false : true;
    };
    /**
     * Retorna um valor que esta na cache do navegador
     * @param {string} key Chave de acesso
     * @param def Valor padrão
     * @returns {any} result
     */
    LocalStorage.prototype.get = function (key, def) {
        if (this.isNotUserData) {
            return this.getData(key, def);
        }
        else {
            return this.getUserData(key, def);
        }
    };
    /**
     * Define um chave na cache do navegador
     * @param {string} key Chave de acesso
     * @param value Valor
     */
    LocalStorage.prototype.set = function (key, value) {
        if (this.isNotUserData) {
            this.setData(key, value);
        }
        else {
            this.setUserData(key, value);
        }
    };
    /**
     * Recebe dados em uma chave especifica do jogador atual
     * @param {string} key Chave de acesso
     * @param {any} def Valor padrão
     */
    LocalStorage.prototype.getUserData = function (key, def) {
        var json = this.getUserJSON();
        var result = json[key];
        if (typeof result == "undefined") {
            return typeof def == "undefined" ? null : def;
        }
        return result;
    };
    /**
     * Define o valor de alguma chave no JSON local do usuario conectado
     * @param {string} key Chave de acesso
     * @param value Valor
     */
    LocalStorage.prototype.setUserData = function (key, value) {
        var user = game_data.player.name;
        var json = this.getUserJSON();
        json[key] = value;
        this.setData(user, json);
    };
    /**
     * Retorna o JSON referente a cache local do usuario conectado
     * @returns {JSON} json
     */
    LocalStorage.prototype.getUserJSON = function () {
        var user = game_data.player.name;
        return JSON.parse(this.getData(user, {}));
    };
    /**
     * Recebe dados direto da cache do navegador
     * @param {string} key Chave de acesso
     * @param def Valor padrão
     * @returns {any} result
     */
    LocalStorage.prototype.getData = function (key, def) {
        if (typeof def == "undefined") {
            def = null;
        }
        var result = localStorage.getItem(name);
        if (typeof result == "undefined") {
            return def;
        }
        return result;
    };
    /**
     * Salva dados diretamente na cache do navegador
     * @param {string} key Chave de acesso
     * @param {any} valor
     */
    LocalStorage.prototype.setData = function (key, value) {
        if (typeof value == "undefined") {
            value == null;
        }
        localStorage.setItem(key, value);
    };
    return LocalStorage;
})();
/**
 * Manipulação de html
 * @Class HTMLHelper
 */
var HTMLHelper = (function () {
    function HTMLHelper(html) {
        /**
         * Armazena a resepentação de texto do codigo html
         * @property {string} html
         */
        this.html = '';
        if (typeof html !== "undefined") {
            this.append(html);
        }
    }
    /**
     * Adiciona html ao objeto
     * @param {string} html Codigo html a ser adicionado
     * @returns {HTMLHelper} htmlHelper return essa instancia
     */
    HTMLHelper.prototype.append = function (html) {
        this.html += html;
        return this;
    };
    /**
     * Retorna o html completo como string
     * @returns {string} html
     */
    HTMLHelper.prototype.getHTML = function () {
        return this.html;
    };
    /**
     * Retorna a representação em jQuery do html desse objeto
     * @returns {JQuery} jQuery
     */
    HTMLHelper.prototype.getElement = function () {
        return $(this.getHTML());
    };
    return HTMLHelper;
})();
var Random = (function () {
    function Random() {
    }
    Random.prototype.next = function (int) {
        return Math.floor(Math.random()) + int;
    };
    Random.prototype.nextInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    return Random;
})();
//# sourceMappingURL=Utils.js.map