/**
 * Created by Wesley Nascimento on 07/11/2014.
 */
/// <reference path="jquery.d.ts"/>
/// <reference path="Utils.ts"/>
/// <reference path="Interfaces.ts" />
/// <reference path="Models.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Variaveis abstratas
 */
var game_data = game_data || {};
/**
 * Informações de desenvolvimento
 */
var DevInfo = {
    version: "3.0.0",
    name: "Quasar",
    codename: "RedShift",
    authors: "Wesley Nascimento",
    colaborators: []
};
/**
 * Item para menu basico
 */
var MenuItem = (function () {
    function MenuItem() {
    }
    MenuItem.prototype.getElement = function () {
        return this.$element;
    };
    /**
     * Desenha um MenuItem Padrão
     * @param $parentElement
     * @returns {jQuery} jQUery
     */
    MenuItem.prototype.paint = function ($parentElement) {
        var helper = new HTMLHelper('<div class="menu-item"></div>');
        this.$element = helper.getElement();
        $parentElement.append(this.$element);
        return this.$element;
    };
    return MenuItem;
})();
var PluginMenuItem = (function (_super) {
    __extends(PluginMenuItem, _super);
    function PluginMenuItem(name, plugin) {
        _super.call(this);
        if (name == null) {
            this.name = "no_named";
        }
        this.name = name;
        this.plugin = plugin;
    }
    /**
     * Sobre escreve o metodo de pintar
     * @param $parentElement
     * @returns {jQuery}
     */
    PluginMenuItem.prototype.paint = function ($parentElement) {
        var superElement = _super.prototype.paint.call(this, $());
        superElement.addClass('plugin-item');
        superElement.append(this.name);
        if (this.plugin.isEnable()) {
            superElement.addClass('enabled');
        }
        superElement.on('click', this.onClick);
        this.$element = superElement;
        return this.$element;
    };
    /**
     * Vinculado ao onClick do elemento de menu
     */
    PluginMenuItem.prototype.onClick = function () {
        this.plugin.toogle();
        if (this.plugin.isEnable()) {
            this.getElement().addClass('enabled');
        }
        else {
            this.getElement().removeClass('enabled');
        }
    };
    return PluginMenuItem;
})(MenuItem);
/**
 * Apenas uma classe simbolica
 * @class PluginEmptyMenuItem
 */
var PluginEmptyMenuItem = (function (_super) {
    __extends(PluginEmptyMenuItem, _super);
    function PluginEmptyMenuItem() {
        _super.apply(this, arguments);
    }
    /**
     * Sobrescreve o methodo de PluginMenuItem
     * @param $parentElement
     */
    PluginEmptyMenuItem.prototype.paint = function ($parentElement) {
        this.$element = new HTMLHelper('').getElement();
        return this.$element;
    };
    return PluginEmptyMenuItem;
})(PluginMenuItem);
/**
 * Menu principal é "desenhado" a cada execução.
 * Apresenta os botoes dos plugins, de configurações e informações adicionais.
 * @class Menu
 */
var Menu = (function () {
    function Menu($body) {
        this.itens = [];
        var menu = new HTMLHelper('');
        menu.append('<section class="quasar">');
        menu.append('</section>');
        this.$element = menu.getElement();
        this.$body = $body;
    }
    Menu.prototype.getElement = function () {
        return this.$element;
    };
    /**
     * Retorna O cabeçalho do menu
     * @returns {jQuery} $head
     */
    Menu.prototype.getHead = function () {
        var head = new HTMLHelper('');
        head.append('<div class="head">');
        head.append('<div class="big">' + DevInfo.name + '</div>');
        head.append('<div class="small">' + DevInfo.codename + '</div>');
        head.append('</div>');
        return head.getElement();
    };
    Menu.prototype.getBody = function () {
        var body = new HTMLHelper('');
        body.append('<div class="body">');
        body.append('</div>');
        return body.getElement();
    };
    /**
     * Retorna o rodape do Menu
     * @returns {JQuery} $bottom
     */
    Menu.prototype.getBottom = function () {
        var bottom = new HTMLHelper('');
        return bottom.getElement();
    };
    Menu.prototype.paint = function () {
        this.$element.append(this.getHead());
        var $menuBody = this.getBody();
        for (var i in this.itens) {
            var menuItem = this.itens[i];
            menuItem.paint($menuBody);
        }
        this.$element.append($menuBody);
        this.$element.append(this.getBottom);
        this.$body.append(this.$element);
        return this.$element;
    };
    /**
     * Pinta um MenuItem dentro do Menu principal
     * @param menuItem
     */
    Menu.prototype.add = function (menuItem) {
        this.itens.push(menuItem);
    };
    return Menu;
})();
/**
 * Super Classe para plugins, define as principais funções de um plugin, seus valores e ações padroes.
 * @class SimplePlugin
 */
var SimplePlugin = (function () {
    function SimplePlugin(name) {
        /**
         * Nome do plugin, que será exibido no menu e nos logs.
         * @property {String} name
         */
        this.name = "No-named";
        this.name = name;
        this.menuItem = new PluginMenuItem(name, this);
    }
    /**
     * Retorna o item de menu desse plugin
     * @returns {PluginMenuItem} menuItem
     */
    SimplePlugin.prototype.getMenuItem = function () {
        return this.menuItem;
    };
    /**
     * Define o menu
     * @param menu
     */
    SimplePlugin.prototype.setMenuItem = function (menu) {
        this.menuItem = menu;
    };
    /**
     * Retorna o nome desse plugin
     * @returns {String} name
     */
    SimplePlugin.prototype.getName = function () {
        return this.name;
    };
    /**
     * Inverte o status de ativação do plugin
     */
    SimplePlugin.prototype.toogle = function () {
        this.setEnable(!this.isEnable());
    };
    /**
     * Altera o status de ativação do plugin
     * @param {boolean} enable
     */
    SimplePlugin.prototype.setEnable = function (enable) {
        var storage = new LocalStorage();
        storage.set(this.getName() + "_enable", enable);
    };
    /**
     * Retorna o status de ativação do plugin
     * @returns {boolean} status
     */
    SimplePlugin.prototype.isEnable = function () {
        var storage = new LocalStorage();
        return storage.get(this.getName() + "_enable", false);
    };
    /** Metodos padroes para Plugins */
    SimplePlugin.prototype.postExecute = function () {
        console.log(this.getName() + " injetou nada na pagina.");
    };
    SimplePlugin.prototype.preExecute = function () {
        console.log(this.getName() + " foi carregado com sucesso.");
    };
    SimplePlugin.prototype.check = function (url) {
        return false;
    };
    SimplePlugin.prototype.execute = function (controller) {
        console.log(this.getName() + " está sendo executado.");
    };
    return SimplePlugin;
})();
/** CONTROLADORES */
/**
 * Controlador de Plugins
 * @class PluginController
 */
var PluginController = (function () {
    function PluginController() {
        /**
         * Lista de plugins
         * @property plugins
         */
        this.plugins = [];
        /**
         * Forçado a parar?
         * @type {boolean}
         */
        this.break = false;
    }
    /**
     * Retorna se esta parado
     * @returns {boolean}
     */
    PluginController.prototype.isBreak = function () {
        return this.break;
    };
    /**
     * Para a execução dos plugins
     */
    PluginController.prototype.breakNow = function () {
        this.break = true;
    };
    /**
     * Adiciona um plugin a lista de plugins
     * @param {SimplePlugin} plugin
     */
    PluginController.prototype.addPlugin = function (plugin) {
        this.plugins.push(plugin);
    };
    PluginController.prototype.getPlugin = function (name) {
        for (var i in this.plugins) {
            var thatPlugin = this.plugins[i];
            if (thatPlugin.getName() == name)
                return thatPlugin;
        }
        return null;
    };
    /**
     * Coloca todos os plugins dentro do menu
     * E renderiza o menu
     * @param menu
     */
    PluginController.prototype.paint = function (menu) {
        for (var i in this.plugins) {
            var thatPlugin = this.plugins[i];
            menu.add(thatPlugin.getMenuItem());
        }
        menu.paint();
    };
    /**
     * Roda todos os scripts na respectiva ordem
     * - plugin.preExecute
     * - plugin.check
     *  - plugin.execute
     * - plugin.postExecute
     * @param url
     * @param $body
     */
    PluginController.prototype.run = function (url) {
        for (var i in this.plugins) {
            var thatPlugin = this.plugins[i];
            thatPlugin.preExecute();
            if (thatPlugin.check(url)) {
                if (!this.isBreak())
                    thatPlugin.execute(this);
            }
            thatPlugin.postExecute();
        }
    };
    return PluginController;
})();
/**
 * PLUGINS
 */
var AntiCaptcha = (function (_super) {
    __extends(AntiCaptcha, _super);
    function AntiCaptcha() {
        _super.call(this, "Captcha");
        this.factor = 10;
        //this.setMenuItem( new PluginEmptyMenuItem(null, this) );
    }
    /* Esse plugin sempre será executado */
    AntiCaptcha.prototype.check = function (url) {
        return true;
    };
    AntiCaptcha.prototype.execute = function (controller) {
        _super.prototype.execute.call(this, controller);
        var random = new Random();
        var factor = random.nextInt(0, 10);
        var $captcha = $('#bot_check_image');
        if ($captcha.length > 0) {
            controller.breakNow();
            this.bindForm();
            this.soundAlarm();
        }
        else if (factor == this.factor) {
            this.fakePage();
        }
    };
    AntiCaptcha.prototype.fakePage = function () {
        var random = new Random();
        console.log("game_data", game_data);
        var base = '?village=' + game_data.village.id + '&screen=';
        var pages = ['forum', 'ally', 'ranking', 'ranking&mode=con_player', 'market', 'smith', 'statue', 'farm', 'barracks', 'stable', 'garage', 'storage', 'hide', 'wall'];
        var index = random.nextInt(0, pages.length - 1);
        var page = pages[index];
        $.get(base + page);
    };
    AntiCaptcha.prototype.soundAlarm = function () {
        //$("body").append('<object height="50" width="100" data="' + Loader.host + '/alarm.mp3"></object>');
        $(document).prop('title', 'Preencher Captcha');
        var alarm = 'media/alarm.mp3';
        var vol = 50, audio = new Audio();
        audio.src = alarm;
        audio.volume = vol / 100;
        var storage = new LocalStorage();
        if (storage.get("sound_alarm", true)) {
            setInterval(audio.play, 30 * 1000);
            audio.play();
        }
    };
    AntiCaptcha.prototype.bindForm = function () {
        $('#bot_check_form').submit(function (e) {
            e.preventDefault();
            var code = $('#bot_check_code').val();
            $('#bot_check_code').val('');
            var url = 'game.php';
            if (game_data.player.sitter > 0) {
                url += '?t=' + game_data.player.id;
            }
            $.post(url, {
                bot_check_code: code
            }, function (data) {
                alert(data);
                if (data.error) {
                    $('#bot_check_error').show().text(data.error);
                    $('#bot_check_image').attr('src', function () {
                        var imagesource = $(this).attr('src');
                        imagesource += '&' + new Date().getTime();
                        return imagesource;
                    });
                }
                else {
                    location.href = "";
                }
            }, 'json');
        });
    };
    return AntiCaptcha;
})(SimplePlugin);
/** RUN */
$(document).ready(function () {
    //Executa os plugins quando necessario
    var url = location.href;
    var $body = $("body");
    //Cria um controlador e um menu
    var controller = new PluginController();
    var menu = new Menu($body);
    //Adiciona os plugins ao controlador
    controller.addPlugin(new AntiCaptcha());
    controller.run(url);
    //Adiciona todos plugins ao menu
    controller.paint(menu);
});
//# sourceMappingURL=Core.js.map