/**
 * Created by Wesley Nascimento on 07/11/2014.
 */
/// <reference path="Plugins.ts" />
/// <reference path="Models.ts" />
var Menu = (function () {
    function Menu() {
    }
    Menu.prototype.getElement = function () {
        return this.$element;
    };
    //Coloca todos MenuItens dentro do objecto do menu
    Menu.prototype.paint = function (container) {
    };
    //Salva o objeto de menu dentro da DOM
    Menu.prototype.inject = function () {
    };
    return Menu;
})();
var SimplePlugin = (function () {
    function SimplePlugin(name) {
        this.name = name;
    }
    SimplePlugin.prototype.getName = function () {
        return this.name;
    };
    /* SOBRESCREVA OS METODOS ABAIXO */
    //Desenha o botão de ativaçao e desativaçao do plugin
    SimplePlugin.prototype.paint = function ($element) {
    };
    //Injeta HTML na pagina
    SimplePlugin.prototype.inject = function () {
    };
    //Pre executa o plugin
    SimplePlugin.prototype.preExecute = function () {
        console.log(this.getName() + " foi carregado com sucesso.");
    };
    //Checa se o plugin pode ser executado
    SimplePlugin.prototype.check = function (url) {
        return false;
    };
    //Executa o plugin... Inicializa
    SimplePlugin.prototype.execute = function () {
        //Mensagem de exução padão.
        console.log(this.getName() + " está sendo executado.");
    };
    return SimplePlugin;
})();
var PluginController = (function () {
    function PluginController() {
    }
    PluginController.prototype.addPlugin = function (plugin) {
        this.plugins.push(plugin);
    };
    PluginController.prototype.paint = function (menu) {
        var $menuElement = menu.getElement();
        for (var i in this.plugins) {
            var thatPlugin = this.plugins[i];
            thatPlugin.paint($menuElement);
            thatPlugin.inject();
        }
    };
    //Roda todos os plugins
    PluginController.prototype.run = function (url) {
        for (var i in this.plugins) {
            var thatPlugin = this.plugins[i];
            //Pre executa o plugin
            thatPlugin.preExecute();
            //Realiza a checagem do plugin
            if (thatPlugin.check(url)) {
                //Dispacha o Execute do plugin de forma dessincronizada.
                setTimeout(thatPlugin.execute, 10);
            }
        }
    };
    return PluginController;
})();
(function () {
    var controller = new PluginController();
    var url = location.href;
    controller.run(url);
    console.log("Core.js");
})();
//# sourceMappingURL=Core.js.map