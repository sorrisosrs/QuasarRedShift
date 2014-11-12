/**
 * Created by Wesley Nascimento on 07/11/2014.
 */
/// <reference path="Plugins.ts" />
/// <reference path="jquery.d.ts"/>
/// <reference path="Models.ts" />

/* INTERFACES */
/**
 * Plugables são objectos plugaveis, que executão uma acão em determinadas condições.
 * @interface Plugable
 */
interface Plugable{
    /**
     * Executado antes da check
     * @method preExecute
     */
    preExecute() : void;

    /**
     * Verifica se plugin pode ser executado.
     * @param {String} url a URL da pagina atual em que o script está sendo executado
     * @returns {boolean} result can or can't be executed
     */
    check( url : String ) : boolean;

    /**
     *  Ação do plugin, só é executado se o check retornar true
     *  @class execute
     */
    execute() : void;

    /**
     * Executado depois do check e idependedo do resultado
     */
    postExecute() : void;
}
/**
 * Pantables são objetos em que devem ser renderizados na tela, são objetos que tem uma representação em HTML;
 * @interface Paintable
 */
interface Paintable{
    /**
     * Representação em jQuery para o objeto
     * @property {jQuery} $element
     */
    $element : jQuery;

    /**
     * Returns this object elements
     * @returns {jQuery} $element
     */
    getElement() : jQuery

    /**
     * Adiciona ( pinta ) um elemento dentro de outro
     * @param {jQuery} $parentElement Elemento no qual esse será adicionado
     * @return {jQuery} $element Representação desse elemento
     * @returns null pode retornar null
     */
    paint( $parentElement : jQuery ) : jQuery;
}

/* CLASSES DE UTILITARIOS */
/**
 * Manipulação da memoria cache do navegador
 * @class Storage
 */
class Storage{

    private isNotUserData : boolean = false;

    /**
     * @param {boolean} isNotUserData são configurações
     */
    constructor( isNotUserData : boolean ){
        this.isNotUserData = isNotUserData == null ? false : true;
    }

    /**
     * Retorna um valor que esta na cache do navegador
     * @param {String} key Chave de acesso
     * @param def Valor padrão
     * @returns {any} result
     */
    public get( key : string, def : any) : any{
        if( this.isNotUserData ){
            return this.getData(key, def);
        }
        else {
            return this.getUserData( key, def );
        }
    }

    /**
     * Define um chave na cache do navegador
     * @param {String} key Chave de acesso
     * @param value Valor
     */
    public set( key : string, value : any ){
        if( this.isNotUserData ){
            this.setData(key, value)
        }
        else {
            this.setUserData( key, value );
        }
    }

    /**
     * Recebe dados em uma chave especifica do jogador atual
     * @param {String} key Chave de acesso
     * @param {any} def Valor padrão
     */
    public getUserData(key : string, def : any) : any{
        var json = this.getUserJSON();
        var result = json[ key ];
        if( typeof result == "undefined" ){
            return typeof def == "undefined" ? null : def ;
        }
        return result;
    }

    /**
     * Define o valor de alguma chave no JSON local do usuario conectado
     * @param {String} key Chave de acesso
     * @param value Valor
     */
    public setUserData(key : String, value : any){
        var user = game_data.player.name;

        var json = this.getUserJSON();
        json[ key ] = value;
        this.setData( user, json);
    }

    /**
     * Retorna o JSON referente a cache local do usuario conectado
     * @returns {JSON} json
     */
    public getUserJSON() : JSON{
        var user = game_data.player.name;
        return JSON.parse( this.getData( user, {} ) );
    }

    /**
     * Recebe dados direto da cache do navegador
     * @param {String} key Chave de acesso
     * @param def Valor padrão
     * @returns {any} result
     */
    public getData( key : string, def : any ) : any{

        if( typeof def == "undefined" ){
            def = null;
        }

        var result = localStorage.getItem(name);

        if( typeof result == "undefined" ){
            return def;
        }

        return result;
    }

    /**
     * Salva dados diretamente na cache do navegador
     * @param {String} key Chave de acesso
     * @param {any} valor
     */
    public setData( key : String, value : any ){
        if( typeof value == "undefined" ){
            value == null;
        }
        localStorage.setItem(key, value);
    }
}


/**
 * Manipulação de html
 * @Class HTMLHelper
 */
class HTMLHelper{
    /**
     * Armazena a resepentação de texto do codigo html
     * @property {String} html
     */
    private html: String = '';

    constructor( html : String){
        if( html !== null ){
            this.append( html );
        }
    }

    /**
     * Adiciona html ao objeto
     * @param {String} html Codigo html a ser adicionado
     * @returns {HTMLHelper} htmlHelper return essa instancia
     */
    public append( html : String) : HTMLHelper{
        this.html += html;
        return this;
    }

    /**
     * Retorna o html completo como String
     * @returns {String} html
     */
    public getHTML() : String{
        return this.html;
    }

    /**
     * Retorna a representação em jQuery do html desse objeto
     * @returns {JQuery} jQuery
     */
    public getElement() : jQuery{
        return $( this.getHTML() );
    }
}

/** SUPER CLASSES */
/**
 * Item para menu basico
 */
class MenuItem implements Paintable{
    private $element : jQuery;

    public getElement() : jQuery{
        return this.$element;
    }

    /**
     * Desenha um MenuItem Padrão
     * @param $parentElement
     * @returns {jQuery} jQUery
     */
    public paint( $parentElement : jQuery) : jQuery {
        var helper = new HTMLHelper('<div class="menu-item"></div>');
        this.element = helper.getElement();

        $parentElement.append( this.$element );
        return this.$element;
    }
}

class PluginMenuItem extends MenuItem{

    /**
     * Nome que será mostrado para o plugin
     * @property {String} name
     */
    private name : String;

    /**
     * Representação do plugin em questão
     * @property {SimplePlugin} plugin
     */
    private plugin : SimplePlugin;

    constructor( name : String, plugin : SimplePlugin ){
        if( name == null){
            this.nam = "no_named";
        }
        this.name = name;
    }

    /**
     * Sobre escreve o metodo de pintar
     * @param $parentElement
     * @returns {jQuery}
     */
    public paint( $parentElement : jQuery) : jQuery {
        var superElement = super.paint();

        superElement.addClass('plugin-item');
        superElement.append( this.name );

        if( this.plugin.isEnable() ){
            superElement.addClass('enabled');
        }

        superElement.on('click', this.onClick );

        this.$element = superElement;
        return this.$element;
    }

    /**
     * Vinculado ao onClick do elemento de menu
     */
    public onClick(){
        this.plugin.toogle();
        if( this.plugin.isEnable() ){
            this.getElement().addClass('enabled');
        }
        else {
            this.getElement().removeClass('enabled');
        }
    }
}

/**
 * Apenas uma classe simbolica
 * @class PluginEmptyMenuItem
 */
class PluginEmptyMenuItem extends PluginMenuItem{

    /**
     * Sobrescreve o methodo de PluginMenuItem
     * @param $parentElement
     */
    public paint( $parentElement : jQuery) : jQuery {
        this.$element = new HTMLHelper().getElement();
        return this.$element;
    }
}

/**
 * Menu principal é "desenhado" a cada execução.
 * Apresenta os botoes dos plugins, de configurações e informações adicionais.
 * @class Menu
 */
class Menu implements Paintable{
    private $element : jQuery;

    public getElement() : jQuery{
        return this.$element;
    }

    public paint( $parentElement : jQuery) : jQuery {
        var $body = $('body');

        $body.append( this.$element );
        return this.$element;
    }

    /**
     * Pinta um MenuItem dentro do Menu principal
     * @param menuItem
     */
    public add( menuItem : MenuItem ){
        menuItem.paint( this.getElement() );
    }
}

/**
 * Super Classe para plugins, define as principais funções de um plugin, seus valores e ações padroes.
 * @class SimplePlugin
 */
class SimplePlugin implements Plugable{
    /**
     * Nome do plugin, que será exibido no menu e nos logs.
     * @property {String} name
     */
    private name : String;

    /**
     * A representação do body da pagina em jQuery
     * @property {jQuery} $body
     */
    private $body : jQuery;

    /**
     * Instancia do item de menu desse plugin
     * Caso o plugin não precise de um item no menu, configure-o com PluginEmptyMenuItem;
     * @property {PluginMenuItem} menuItem
     */
    private menuItem : PluginMenuItem;

    constructor( name : String ){
        this.name = name;
        this.menuItem = new PluginMenuItem( name, this );
    }

    /**
     * Retorna o item de menu desse plugin
     * @returns {PluginMenuItem} menuItem
     */
    public getMenuItem() : PluginMenuItem{
        return this.menuItem;
    }

    /**
     * Retorna o nome desse plugin
     * @returns {String} name
     */
    public getName() : String{
        return this.name;
    }

    /**
     * Define o elemento B
     * @param $body
     */
    public setBody( $body : jQuery){
        this.$body = $body;
    }

    /**
     * Retorna o a representação do body em jQuery
     * @returns {jQuery} $body
     */
    public getBody(){
        return this.$body;
    }

    /**
     * Inverte o status de ativação do plugin
     */
    public toogle(){
        this.setEnable( ! this.isEnable() );
    }

    /**
     * Altera o status de ativação do plugin
     * @param {boolean} enable
     */
    public setEnable( enable : boolean){
        var storage = new Storage();
        storage.set(this.getName() + "_enable", enable);
    }

    /**
     * Retorna o status de ativação do plugin
     * @returns {boolean} status
     */
    public isEnable() : boolean{
        var storage = new Storage();
        return storage.get( this.getName() + "_enable", false);
    }

    /** Metodos padroes para Plugins */
    public postExecute() : void{
        console.log( this.getName() + " injetou nada na pagina.");
    }

    public preExecute():void {
        console.log( this.getName() + " foi carregado com sucesso.");
    }

    public check( url : String ):boolean {
        return false;
    }

    public execute():void {
        console.log( this.getName() + " está sendo executado.");
    }

}

/** CONTROLADORES */

/**
 * Controlador de Plugins
 * @class PluginController
 */
class PluginController{
    /**
     * Lista de plugins
     * @property plugins
     */
    private plugins : Array<SimplePlugin>;

    /**
     * Adiciona um plugin a lista de plugins
     * @param {SimplePlugin} plugin
     */
    public addPlugin(plugin : SimplePlugin ) : void{
        this.plugins.push( plugin )
    }

    /**
     * Coloca todos os plugins dentro do menu
     * E renderiza o menu
     * @param menu
     */
    public paint( menu : Menu ){
        for( var i in this.plugins ) {
            var thatPlugin = this.plugins[i];
            menu.add( thatPlugin.getMenuItem() );
        }
        menu.paint();
    }

    /**
     * Roda todos os scripts na respectiva ordem
     * - plugin.preExecute
     * - plugin.check
     *  - plugin.execute
     * - plugin.postExecute
     * @param url
     * @param $body
     */
    public run( url : String, $body : jQuery ) : void{
        for( var i in this.plugins ){
            var thatPlugin = this.plugins[i];
            //Cria função asincronica para realizar operações
            setTimeout( function() {
                thatPlugin.setBody($body);

                thatPlugin.preExecute();

                if (thatPlugin.check(url)) {
                    thatPlugin.execute();
                }
                thatPlugin.postExecute();
            }, 15);
        }
    }
}

/** RUN */
(function(){
    //Cria um controlador e um menu
    var controller = new PluginController();
    var menu = new Menu();

    //Adiciona os plugins ao controlador
    controller.addPlugin( new AntiCaptcha() );

    //Executa os plugins quando necessario
    var url = location.href;
    var $body = $("body");

    controller.run( url, $body );

    //Adiciona todos plugins ao menu
    controller.paint( menu );

    //Desenha o menu na pagina
    menu.paint( $body );

    console.log("Core.js");
})();