/**
 * Created by Wesley Nascimento on 13/11/2014.
 */
/// <reference path="jquery.d.ts"/>
var game_data = game_data || {};

/**
 * Manipulação da memoria cache do navegador
 * @class storage
 */
class LocalStorage{

    private isNotUserData : boolean = false;

    /**
     * @param {boolean} isNotUserData são configurações
     */
    public setNotUserData( isNotUserData : boolean ){
        this.isNotUserData = isNotUserData == null ? false : true;
    }

    /**
     * Retorna um valor que esta na cache do navegador
     * @param {string} key Chave de acesso
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
     * @param {string} key Chave de acesso
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
     * @param {string} key Chave de acesso
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
     * @param {string} key Chave de acesso
     * @param value Valor
     */
    public setUserData(key : string, value : any){
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
     * @param {string} key Chave de acesso
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
     * @param {string} key Chave de acesso
     * @param {any} valor
     */
    public setData( key : string, value : any ){
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
     * @property {string} html
     */
    html: string = '';

    constructor( html : string){
        if( typeof html !== "undefined" ){
            this.append( html );
        }
    }

    /**
     * Adiciona html ao objeto
     * @param {string} html Codigo html a ser adicionado
     * @returns {HTMLHelper} htmlHelper return essa instancia
     */
    public append( html : string) : HTMLHelper{
        this.html += html;
        return this;
    }

    /**
     * Retorna o html completo como string
     * @returns {string} html
     */
    public getHTML() : string{
        return this.html;
    }

    /**
     * Retorna a representação em jQuery do html desse objeto
     * @returns {JQuery} jQuery
     */
    public getElement() : JQuery{
        return $( this.getHTML() );
    }
}

class Random{
    public next( int : number ) : number{
        return Math.floor(Math.random() ) + int;
    }

    public nextInt( min : number, max : number) : number{
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

