/**
 * Created by Wesley Nascimento on 13/11/2014.
 */
/// <reference path="jquery.d.ts"/>
/// <reference path="Core.ts" />

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
    check( url : string ) : boolean;

    /**
     *  Ação do plugin, só é executado se o check retornar true
     *  @param {PluginController } controller Controlador de plugins
     *  @class execute
     */
    execute( controller : PluginController ) : void;

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
    $element : JQuery;

    /**
     * Returns this object elements
     * @returns {jQuery} $element
     */
    getElement() : JQuery

    /**
     * Adiciona ( pinta ) um elemento dentro de outro
     * @param {jQuery} $parentElement Elemento no qual esse será adicionado
     * @return {jQuery} $element Representação desse elemento
     * @returns null pode retornar null
     */
    paint( $parentElement : JQuery ) : JQuery;
}