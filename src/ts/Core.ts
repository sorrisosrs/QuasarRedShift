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
     * @propriety {jQuery} $element
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
 * Manipulação de html
 * @Class HTMLHelper
 */
class HTMLHelper{
    /**
     * Armazena a resepentação de texto do codigo html
     * @propriety {String} html
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
     * @proprity {String} name
     */
    private name : String;

    constructor( name : String ){
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

        this.$element = superElement;
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

class SimplePlugin implements Plugable{
    private name : String;
    private $body : jQuery;
    private menuItem : PluginMenuItem;

    constructor( name : String ){
        this.name = name;
        this.menuItem = new PluginMenuItem( name );
    }

    public getMenuItem() : PluginMenuItem{
        return this.menuItem;
    }

    public getName() : String{
        return this.name;
    }

    public setBody( $body : jQuery){
        this.$body = $body;
    }

    public getBody(){
        return this.$body;
    }

    /* SOBRESCREVA OS METODOS ABAIXO */

    //Injeta HTML na pagina
    public postExecute() : void{
        console.log( this.getName() + " injetou nada na pagina.");
    }

    //Pre executa o plugin
    public preExecute():void {
        console.log( this.getName() + " foi carregado com sucesso.");
    }

    //Checa se o plugin pode ser executado
    public check( url : String ):boolean {
        return false;
    }

    //Executa o plugin... Inicializa
    public execute():void {
        //Mensagem de exução padão.
        console.log( this.getName() + " está sendo executado.");
    }

}

/** CONTROLADORES */

//Controlador de Plugins
class PluginController{
    private plugins : Array<SimplePlugin>;

    //Adiciona um plugin a lista de plugins do controlador
    public addPlugin(plugin : SimplePlugin ) : void{
        this.plugins.push( plugin )
    }

    //Desenha todos os plugins dentro do Menu e injeta seus
    public paint( menu : Menu ){
        for( var i in this.plugins ) {
            var thatPlugin = this.plugins[i];
            menu.add( thatPlugin.getMenuItem() );
        }
        menu.paint();
    }

    //executa todos os plugins
    public run( url : String, $body : jQuery ) : void{
        for( var i in this.plugins ){
            var thatPlugin = this.plugins[i];
            thatPlugin.setBody( $body );
            //Pre executa o plugin
            thatPlugin.preExecute();
            //Realiza a checagem do plugin
            if( thatPlugin.check( url ) ){
                //Dispacha o Execute do plugin de forma asincronizada.
                setTimeout(function(){
                    thatPlugin.execute();
                }, 10);
            }
            thatPlugin.postExecute();
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