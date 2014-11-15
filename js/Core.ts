/**
 * Created by Wesley Nascimento on 07/11/2014.
 */
/// <reference path="jquery.d.ts"/>
/// <reference path="Utils.ts"/>
/// <reference path="Interfaces.ts" />
/// <reference path="Models.ts" />

/**
 * Variaveis abstratas
 */
var game_data = game_data || {};

/**
 * Informações de desenvolvimento
 */
var DevInfo = {
    version : "3.0.0",
    name : "Quasar",
    codename : "RedShift",
    authors : "Wesley Nascimento",
    colaborators : []
};

/**
 * Item para menu basico
 */
class MenuItem implements Paintable{
    $element : JQuery;

    public getElement() : JQuery{
        return this.$element;
    }

    /**
     * Desenha um MenuItem Padrão
     * @param $parentElement
     * @returns {jQuery} jQUery
     */
    public paint( $parentElement : JQuery) : JQuery {
        var helper = new HTMLHelper('<div class="menu-item"></div>');
        this.$element = helper.getElement();

        $parentElement.append( this.$element );
        return this.$element;
    }
}

class PluginMenuItem extends MenuItem{

    /**
     * Nome que será mostrado para o plugin
     * @property {String} name
     */
    private name : string;

    /**
     * Representação do plugin em questão
     * @property {SimplePlugin} plugin
     */
    private plugin : SimplePlugin;

    constructor( name : string, plugin : SimplePlugin ){
        super();
        if( name == null){
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
    public paint( $parentElement : JQuery) : JQuery {
        var superElement = super.paint( $() );

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
    public paint( $parentElement : JQuery) : JQuery {
        this.$element = new HTMLHelper( '' ).getElement();
        return this.$element;
    }
}

/**
 * Menu principal é "desenhado" a cada execução.
 * Apresenta os botoes dos plugins, de configurações e informações adicionais.
 * @class Menu
 */
class Menu implements Paintable{
    $element : JQuery;
    private $body : JQuery;
    private itens : Array<MenuItem> = [];

    constructor( $body : JQuery ){
        var menu = new HTMLHelper('');
        menu.append('<section class="quasar">');
        menu.append('</section>');
        this.$element = menu.getElement();

        this.$body = $body;
    }

    public getElement() : JQuery{
        return this.$element;
    }

    /**
     * Retorna O cabeçalho do menu
     * @returns {jQuery} $head
     */
    public getHead() : JQuery{
        var head = new HTMLHelper('');
        head.append('<div class="head">');
        head.append('<div class="big">' + DevInfo.name +'</div>');
        head.append('<div class="small">' + DevInfo.codename +'</div>')
        head.append('</div>');

        return head.getElement();
    }

    public getBody() : JQuery{
        var body = new HTMLHelper('');
        body.append('<div class="body">');
        body.append('</div>');
        return body.getElement();
    }

    /**
     * Retorna o rodape do Menu
     * @returns {JQuery} $bottom
     */
    public getBottom() : JQuery{
        var bottom = new HTMLHelper('');

        return bottom.getElement();
    }

    public paint( ) : JQuery {
        this.$element.append( this.getHead() );

        var $menuBody = this.getBody();

        for( var i in this.itens ){
            var menuItem = this.itens[i];
            menuItem.paint( $menuBody );
        }

        this.$element.append( $menuBody );
        this.$element.append( this.getBottom );

        this.$body.append( this.$element );
        return this.$element;
    }

    /**
     * Pinta um MenuItem dentro do Menu principal
     * @param menuItem
     */
    public add( menuItem : MenuItem ){
        this.itens.push( menuItem );
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
    private name : String = "No-named";

    /**
     * Instancia do item de menu desse plugin
     * Caso o plugin não precise de um item no menu, configure-o com PluginEmptyMenuItem;
     * @property {PluginMenuItem} menuItem
     */
    private menuItem : PluginMenuItem;

    constructor( name : string ){
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
     * Define o menu
     * @param menu
     */
    public setMenuItem( menu : PluginMenuItem ){
        this.menuItem = menu;
    }

    /**
     * Retorna o nome desse plugin
     * @returns {String} name
     */
    public getName() : String{
        return this.name;
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
        var storage = new LocalStorage();
        storage.set(this.getName() + "_enable", enable);
    }

    /**
     * Retorna o status de ativação do plugin
     * @returns {boolean} status
     */
    public isEnable() : boolean{
        var storage = new LocalStorage();
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

    public execute( controller : PluginController):void {
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
    private plugins : Array<SimplePlugin> = [];

    /**
     * Forçado a parar?
     * @type {boolean}
     */
    private break : boolean = false;

    /**
     * Retorna se esta parado
     * @returns {boolean}
     */
    public isBreak() : boolean{
        return this.break;
    }

    /**
     * Para a execução dos plugins
     */
    public breakNow() {
        this.break = true;
    }

    /**
     * Adiciona um plugin a lista de plugins
     * @param {SimplePlugin} plugin
     */
    public addPlugin(plugin : SimplePlugin ) : void{
        this.plugins.push( plugin )
    }

    public getPlugin( name : string ) : SimplePlugin{
        for( var i in this.plugins ) {
            var thatPlugin = this.plugins[i];
            if( thatPlugin.getName() == name ) return thatPlugin;
        }
        return null;
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
    public run( url : String) : void{
        for( var i in this.plugins ) {
            var thatPlugin = this.plugins[i];
            thatPlugin.preExecute();

            if ( thatPlugin.check(url) ) {
                if( !this.isBreak() )
                    thatPlugin.execute(this);
            }
            thatPlugin.postExecute();
        }
    }
}

/**
 * PLUGINS
 */

class AntiCaptcha extends SimplePlugin{
    private factor : number = 10;

    constructor(){
        super("Captcha");
        //this.setMenuItem( new PluginEmptyMenuItem(null, this) );
    }

    /* Esse plugin sempre será executado */
    public check( url : string ) : boolean{
        return true;
    }

    public execute( controller : PluginController){
        super.execute( controller );
        var random = new Random();
        var factor = random.nextInt(0, 10);
        var $captcha = $('#bot_check_image');

        if( $captcha.length > 0){
            controller.breakNow();
            this.bindForm();
            this.soundAlarm();
        }
        else if( factor == this.factor){
            this.fakePage();
        }

    }

    public fakePage(){
        var random = new Random();
        console.log( "game_data", game_data )
        var base = '?village=' + game_data.village.id + '&screen=';

        var pages = ['forum', 'ally', 'ranking', 'ranking&mode=con_player', 'market', 'smith',
            'statue', 'farm', 'barracks', 'stable', 'garage', 'storage', 'hide', 'wall'];


        var index = random.nextInt(0, pages.length - 1);
        var page = pages[index];
        $.get(base + page);
    }

    public soundAlarm(){
        //$("body").append('<object height="50" width="100" data="' + Loader.host + '/alarm.mp3"></object>');
        $(document).prop('title', 'Preencher Captcha');
        var alarm = 'media/alarm.mp3';

        var vol = 50,
            audio = new Audio();
        audio.src = alarm;
        audio.volume = vol / 100;

        var storage = new LocalStorage();
        if ( storage.get("sound_alarm", true) ) {
            setInterval(audio.play, 30 * 1000);
            audio.play();
        }
    }

    public bindForm(){
        $('#bot_check_form').submit(function (e) {
            e.preventDefault();
            var code = $('#bot_check_code').val();

            $('#bot_check_code').val('');

            var url = 'game.php';
            if (game_data.player.sitter > 0) {
                url += '?t=' + game_data.player.id;
            }

            $.post(url, {
                bot_check_code : code
            }, function (data) {
                alert(data);
                if (data.error) {
                    $('#bot_check_error').show().text(data.error);
                    $('#bot_check_image').attr('src', function () {
                        var imagesource = $(this).attr('src');
                        imagesource += '&' + new Date().getTime()

                        return imagesource;
                    });
                } else {
                    location.href = "";
                }
            }, 'json');
        });
    }
}

/** RUN */
$(document).ready(function() {
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